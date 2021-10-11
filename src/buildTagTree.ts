import { UnitType } from './buildSizeStringByUnit'
import { FluentComponentType } from './fluentTypes'
import { CSSData, getCssDataForTag } from './getCssDataForTag'
import { isImageNode } from './utils/isImageNode'

type Property = {
  name: string
  value: string | null | Property[]
  notStringValue?: boolean
}

export type Tag = {
  name: string
  isText: boolean
  textCharacters: string | null
  isImg: boolean
  properties: Property[]
  css?: CSSData
  children: Tag[]
  node: SceneNode
  isComponent?: boolean
  fluentType?: FluentComponentType
}

export function buildTagTree(node: SceneNode, unitType: UnitType): Tag | null {
  if (!node.visible) {
    return null
  }

  const isImg = isImageNode(node)

  let fluentType: FluentComponentType | undefined = undefined
  const properties: Property[] = []
  let childTags: Tag[] = !isImg ? getChildTags(node, unitType) : []
  let isText = node.type === 'TEXT'
  let textCharacters = node.type === 'TEXT' ? node.characters : null

  if (isImg) {
    properties.push({ name: 'src', value: '' })
  }
  
  if (node.type === 'FRAME' && (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL')) {
    fluentType = FluentComponentType.Stack
    if (node.layoutMode === 'HORIZONTAL') {
      properties.push({ name: 'horizontal', value: null })
    }
  }

  // InstanceNode is assumed as a common component from Fluent UI
  if (node.type === 'INSTANCE') {
    if (node.name === 'Button') {
      if ('variantProperties' in node && node.variantProperties) {
        if (node.variantProperties['Type'] === 'Primary') {
          fluentType = FluentComponentType.PrimaryButton
        } else {
          fluentType = FluentComponentType.DefaultButton
        }
      }
      const titleChild = childTags.find(childTag => childTag.isText && childTag.name === 'String-buton')
      if (titleChild) {
        properties.push({ name: 'text', value: titleChild.textCharacters })
      }
      childTags = []
    }

    if (node.name === 'Icon') {
      fluentType = FluentComponentType.IconButton
      const iconChild = childTags.find(childTag => childTag.isText)
      if (iconChild) {
        properties.push({ name: 'iconProps', value: [{ name: 'iconName', value: iconChild.name }], notStringValue: true })
      }
      childTags = []
    }

    if (node.name === 'Link') {
      fluentType = FluentComponentType.Link
      properties.push({ name: 'href', value: ''}, { name: 'underline', value: null })
      const stringChild = childTags.find(childTag => childTag.isText)
      if (stringChild) {
        isText = true
        textCharacters = stringChild.textCharacters
      }
      childTags = []
    }

    if (node.name === 'SearchBox') {
      fluentType = FluentComponentType.SearchBox
      if ('variantProperties' in node && node.variantProperties && node.variantProperties['Type'] === 'Underline') {
        properties.push({ name: 'underlined', value: 'true', notStringValue: true })
      }
      const placeholderChild = childTags.find(childTag => childTag.isText && childTag.name === 'String')
      if (placeholderChild) {
        properties.push({ name: 'placeholder', value: placeholderChild.textCharacters })
      }
      childTags = []
    }

    if (node.name.toLocaleLowerCase().includes('textfield')) {
      fluentType = FluentComponentType.TextField
      parseLabelAndPlaceholder(childTags, properties, 'TextField')
      childTags = []
    }

    if (node.name.toLowerCase().includes('dropdown')) {
      fluentType = FluentComponentType.Dropdown
      parseLabelAndPlaceholder(childTags, properties, 'Dropdown')
      childTags = []
    }

    if (node.name === 'SpinButton') {
      fluentType = FluentComponentType.SpinButton
      childTags = []
    }

    if (node.name === 'Checkbox') {
      fluentType = FluentComponentType.CheckBox
      const labelTag = childTags.find(childTag => childTag.name === 'String')
      if (labelTag && labelTag.textCharacters) {
        properties.push({ name: 'label', value: labelTag.textCharacters })
      }
      childTags = []
    }

    if (node.name === 'ChoiceGroup') {
      fluentType = FluentComponentType.ChoiceGroup

      const labelTag = childTags.find(childTag => childTag.name === 'Label')
      if (labelTag && labelTag.textCharacters) {
        properties.push({ name: 'label', value: labelTag.textCharacters })
      }

      const choicesContainerTag = childTags.find(childTag => childTag.node.type === 'FRAME')
      if (choicesContainerTag && 'children' in choicesContainerTag.node) {
        const options = choicesContainerTag.node.children.map((optionNode, index) => {
          if ('children' in optionNode) {
            const optionLabelNode = optionNode.children.find(childNode => childNode.type === 'TEXT')
            if (optionLabelNode && 'characters' in optionLabelNode) {
              return `{ key: '${index}' , text: '${optionLabelNode.characters}' },`
            }
          }
        })
        if (options.length > 0) {
          properties.push({ name: 'options', value: `[${options.join(' ')}]`, notStringValue: true, })
        }
      }

      childTags = []
    }

    if (node.name.startsWith('Toggle')) { // 'Toggle' or 'Toggle-label'
      fluentType = FluentComponentType.Toggle

      if (node.name === 'Toggle-label') {
        parseLabelAndPlaceholder(childTags, properties, 'Dropdown')
        childTags.find(child => child.fluentType === FluentComponentType.Toggle)?.properties.forEach(p => properties.push(p))
      }

      const toggleContainer = childTags.find(child => child.name === 'Toggle-container')
      if (toggleContainer) {
        const stringContainer = toggleContainer.children.find(child => child.name === 'String-container')
        if (stringContainer) {
          const stringTag = stringContainer.children.find(child => child.name === 'String-toggle')
          if (stringTag && stringTag.textCharacters) {
            properties.push({ name: 'onText', value: stringTag.textCharacters }) // TODO: ON/OFF?
          }
        }
      }

      childTags = []
    }

    if (node.name.includes('DetailsList')) {
      fluentType = FluentComponentType.DetailsList
      childTags = []
    }

    if (node.name === 'Label') {
      fluentType = FluentComponentType.Label
      const stringChild = childTags.find(childTag => childTag.isText)
      if (stringChild) {
        isText = true
        textCharacters = stringChild.textCharacters
      }
      childTags = []
    }
  }
  
  const tag: Tag = {
    name: isImg ? 'img' : node.name,
    isText,
    textCharacters,
    isImg,
    css: getCssDataForTag(node, unitType),
    properties,
    children: childTags,
    node,
    fluentType: fluentType,
  }

  return tag
}

const getChildTags = (node: SceneNode, unitType: UnitType): Tag[] => {
  const childTags: Tag[] = []
  if ('children' in node) {
    node.children.forEach((child) => {
      const childTag = buildTagTree(child, unitType)
      if (childTag) {
        childTags.push(childTag)
      }
    })
  }
  return childTags
}

const parseLabelAndPlaceholder = (childTags: Tag[], properties: Property[], nestedTagName: string) => {
  const labelTag = childTags.find(childTag => childTag.name === 'Label') // has already parsed as a Tag
  if (labelTag) { // with label
    if (labelTag.textCharacters) {
      properties.push({ name: 'label', value: labelTag.textCharacters })
    }
    const nestedTag = childTags.find(childTag => childTag.name === nestedTagName)
    if (nestedTag) {
      const placeholderProperty = nestedTag.properties.find(p => p.name === "placeholder")
      if (placeholderProperty) {
        properties.push({ name: 'placeholder', value: placeholderProperty.value })
      }
    }
  } else { // without label
    const placeholderTag = childTags.find(childTag => childTag.isText && childTag.name === 'String')
    if (placeholderTag) {
      properties.push({ name: 'placeholder', value: placeholderTag.textCharacters })
    }
  }
}