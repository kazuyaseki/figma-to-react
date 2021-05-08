import { STORAGE_KEYS } from './storageKeys'
import { UserComponentSetting } from './userComponentSetting'
import { Tag } from './buildTagTree'

type ComponentSetting = {
  name: string
  matcher: (node: SceneNode) => boolean
  modifyFunc: (tag: Tag, _figma: PluginAPI) => Tag
}

const components: ComponentSetting[] = [
  {
    name: 'Spacer',
    matcher: (node: SceneNode) => {
      return node.name === 'Spacer' && (!('children' in node) || node.children.length === 0)
    },
    modifyFunc: (tag: Tag) => {
      if (tag.node.width > tag.node.height) {
        tag.properties.push({ name: 'height', value: tag.node.height.toString(), notStringValue: true })
      } else {
        tag.properties.push({ name: 'width', value: tag.node.width.toString(), notStringValue: true })
      }

      tag.isComponent = true
      return tag
    }
  }
]

function findChildTagByName(name: string, tag: Tag): Tag | null {
  const match = tag.children.find((child) => child.name === name)
  if (match) {
    return match
  }

  let res = null
  tag.children.forEach((child) => {
    const result = findChildTagByName(name, child)
    if (result) {
      res = result
    }
  })

  return res
}

function findChildNodeWithName(name: string, node: SceneNode): SceneNode | null {
  if (node.name === name) {
    return node
  }

  let _node = null

  if ('children' in node) {
    node.children.forEach((child) => {
      const foundNode = findChildNodeWithName(name, child)
      if (foundNode) {
        _node = foundNode
      }
    })
  }

  return _node
}

function generateComponentSetting(settings: UserComponentSetting[]): ComponentSetting[] {
  return settings.map((setting) => {
    return {
      name: setting.name,
      matcher: (node: SceneNode) => node.name === setting.name,
      modifyFunc: (tag: Tag) => {
        setting.props.forEach((prop) => {
          const node = findChildNodeWithName(prop.labelNodeName, tag.node)

          if (node && 'characters' in node) {
            tag.properties.push({ name: prop.name, value: node.characters })
          }
        })

        if (setting.childrenNodeName) {
          const child = findChildTagByName(setting.childrenNodeName, tag)
          tag.children = child ? [child] : []
        } else {
          tag.children = []
        }
        tag.isComponent = true
        return tag
      }
    }
  })
}

async function modify(tag: Tag, _figma: PluginAPI) {
  if (!tag || !tag.node) {
    return tag
  }

  let modifiedOnce = false

  const userComponentSettings = await _figma.clientStorage?.getAsync(STORAGE_KEYS.USER_COMPONENT_SETTINGS_KEY)
  const compSetting = generateComponentSetting(userComponentSettings || [])
  const comps = [...components, ...compSetting]

  comps.forEach((setting) => {
    if (!modifiedOnce && setting.matcher(tag.node)) {
      tag = setting.modifyFunc(tag, _figma)
      modifiedOnce = true
    }
  })

  return tag
}

export async function modifyTreeForComponent(tree: Tag, _figma: PluginAPI) {
  const newTag = await modify(tree, _figma)

  if (newTag) {
    newTag.children.forEach(async (child, index) => {
      newTag.children[index] = await modifyTreeForComponent(child, _figma)
    })
  }

  return newTag
}
