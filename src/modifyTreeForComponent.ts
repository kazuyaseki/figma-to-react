import { Tag } from './buildTagTree'
import { kebabToUpperCamel } from './utils/stringUtils'

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

const modify = (tag: Tag, _figma: PluginAPI) => {
  if (!tag || !tag.node) {
    return tag
  }

  let modifiedOnce = false
  components.forEach((setting) => {
    if (!modifiedOnce && setting.matcher(tag.node)) {
      tag = setting.modifyFunc(tag, _figma)
      modifiedOnce = true
    }
  })

  return tag
}

export const modifyTreeForComponent = (tree: Tag, _figma: PluginAPI) => {
  const newTag = modify(tree, _figma)

  newTag.children.forEach((child, index) => {
    newTag.children[index] = modifyTreeForComponent(child, _figma)
  })

  return tree
}
