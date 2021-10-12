import { UnitType } from './buildSizeStringByUnit'
import { FluentComponentType } from './fluentTypes'
import { CSSData, getCssDataForTag } from './getCssDataForTag'
import { isImageNode } from './utils/isImageNode'

type Property = {
  name: string
  value: string | null
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
      if (node.variantProperties) {
        if (node.variantProperties['Type'] === 'Primary') {
          fluentType = FluentComponentType.PrimaryButton
        } else {
          fluentType = FluentComponentType.DefaultButton
        }
      }
      parseFigmaText(childTags, 'String-button', properties, 'text')
      childTags = []
    }

    if (node.name === 'Icon') {
      fluentType = FluentComponentType.IconButton
      const iconChild = childTags.find(childTag => childTag.isText)
      if (iconChild) {
        // TODO: find a better solution to specify the icon name
        properties.push({ name: 'iconProps', value: `{ iconName: 'TODO' }`, notStringValue: true })
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
      if (node.variantProperties && node.variantProperties['Type'] === 'Underline') {
        properties.push({ name: 'underlined', value: 'true', notStringValue: true })
      }
      parseFigmaText(childTags, 'String', properties, 'placeholder')
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
      parseFigmaText(childTags, 'String', properties, 'label')
      childTags = []
    }

    if (node.name === 'ChoiceGroup') {
      fluentType = FluentComponentType.ChoiceGroup
      parseFigmaText(childTags, 'Label', properties, 'label')

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
        if (stringContainer && node.variantProperties) {
          parseFigmaText(stringContainer.children, 'String-toggle', properties, node.variantProperties['OFF | ON'] === 'True' ? 'onText' : 'offText')
        }
      }

      childTags = []
    }

    if (node.name === 'Facepile') {
      fluentType = FluentComponentType.Facepile
      properties.push({ name: 'personas', value: '[]', notStringValue: true })
      childTags = []
    }

    if (node.name === 'Persona') {
      fluentType = FluentComponentType.Persona

      if (node.variantProperties) {
        if (node.variantProperties['Size']) {
          properties.push({ name: 'size', value: `PersonaSize.size${node.variantProperties['Size']}`, notStringValue: true })
        }
        if (node.variantProperties['Initials'] === 'False') {
          properties.push({ name: 'imgUrl', value: 'TODO' })
        }
        if (node.variantProperties['Details'] === 'False') {
          properties.push({ name: 'hidePersonaDetails', value: 'true', notStringValue: true })
        }
        if (node.variantProperties['Status'] === 'True') {
          properties.push({ name: 'presence', value: 'PersonaPresence.online', notStringValue: true })
        }
      }

      const detailsContainerTag = childTags.find(child => child.name === 'Details-container')
      if (detailsContainerTag) {
        parseFigmaText(detailsContainerTag.children, 'String-name', properties, 'text')
        parseFigmaText(detailsContainerTag.children, 'String-secondary', properties, 'secondaryText')
        parseFigmaText(detailsContainerTag.children, 'String-tertiary', properties, 'tertiaryText')
      }

      childTags = []
    }

    if (node.name === 'CommandBar') {
      fluentType = FluentComponentType.CommandBar

      const primaryContainerTag = childTags.find(child => child.name === 'primary-commands-container')
      if (primaryContainerTag && primaryContainerTag.children.length > 0) {
        properties.push({ name: 'items', value: getCommandBarItemProps(primaryContainerTag), notStringValue: true })
      }

      const secondaryContainerTag = childTags.find(child => child.name === 'secondary-commands-container')
      if (secondaryContainerTag && secondaryContainerTag.children.length > 0) {
        properties.push({ name: 'farItems', value: getCommandBarItemProps(secondaryContainerTag), notStringValue: true })
      }

      childTags = []
    }

    if (node.name === 'Pivot') {
      fluentType = FluentComponentType.PivotItem
      const containerTag = childTags.find(child => child.node.name === 'String-auto-layout' || child.node.name === 'String-icon-auto-layout')
      if (containerTag) {
        parseFigmaText(containerTag.children, 'String', properties, 'headerText')
        const iconTag = containerTag.children.find(child => child.node.name === 'String-icon')
        if (iconTag) {
          properties.push({ name: 'itemIcon', value: 'TODO' })
        }
      }
      childTags = []
    }

    if (node.name === 'Pivot-stack') {
      fluentType = FluentComponentType.Pivot
    }

    if (node.name.includes('DatePicker')) {
      fluentType = FluentComponentType.DatePicker
      const textFieldTag = childTags.find(child => child.fluentType === FluentComponentType.TextField) // already parsed
      if (textFieldTag) {
        const labelProp = textFieldTag.properties.find(p => p.name === 'label')
        if (labelProp) {
          properties.push({ name: 'label', value: labelProp.value })
        }
        const placeholderProp = textFieldTag.properties.find(p => p.name === 'placeholder')
        if (placeholderProp) {
          properties.push({ name: 'placeholder', value: placeholderProp.value })
        }
      }
      childTags = []
    }

    if (node.name === 'PeoplePicker') {
      fluentType = FluentComponentType.NormalPeoplePicker
      properties.push({ name: 'onResolveSuggestions', value: '(filterText, currentPersonas) => []', notStringValue: true })
      childTags = []
    }

    if (node.name === 'TagPicker') {
      fluentType = FluentComponentType.TagPicker
      properties.push({ name: 'onResolveSuggestions', value: '(filter) => []', notStringValue: true })
      childTags = []
    }

    if (node.name.includes('DetailsList')) {
      fluentType = FluentComponentType.DetailsList
      childTags = []
    }

    if (node.name.includes('Breadcrumbs')) {
      fluentType = FluentComponentType.Breadcrumb
      properties.push({ name: 'items', value: getBreadcrumbProps(childTags), notStringValue: true })
      childTags = []
    }

    if (node.name.includes('Nav')) {
      fluentType = FluentComponentType.Nav
      properties.push({ name: 'groups', value: '[]', notStringValue: true })
      childTags = []
    }

    if (node.name.includes('MessageBar')) {
      fluentType = FluentComponentType.MessageBar
      
      const messageStringTag = childTags.find(child => child.name === 'String-message')
      if (messageStringTag) {
        childTags = [messageStringTag]
      }

      properties.push({ name: 'onDismiss', value: '() => { return }', notStringValue: true })
      if (node.variantProperties) {
        if (node.variantProperties['Type']) {
          properties.push({ name: 'messageBarType', value: `MessageBarType.${getMessageBarTypeByFigmaVariant(node.variantProperties['Type'])}`, notStringValue: true })
        }
        if (node.variantProperties['Actions'] !== 'None') {
          properties.push({ name: 'actions', value: '<MessageBarButton>Action</MessageBarButton>', notStringValue: true })
        }
        if (node.variantProperties['State'] !== 'Fixed') {
          properties.push({ name: 'truncated', value: 'true', notStringValue: true })
        }
      }
    }

    if (node.name === 'Progress indicator') {
      fluentType = FluentComponentType.ProgressIndicator

      const labelContainerTag = childTags.find(child => child.name === 'Label-container')
      if (labelContainerTag) {
        parseFigmaText(labelContainerTag.children, 'String-label', properties, 'label')
      }

      parseFigmaText(childTags, 'String-description', properties, 'description')

      childTags = []
    }

    if (node.name === 'Spinner') {
      fluentType = FluentComponentType.Spinner
      if (node.variantProperties) {
        if (node.variantProperties['Label'] !== 'None') {
          properties.push({ name: 'label', value: 'Loading...' })
          properties.push({ name: 'labelPosition', value: node.variantProperties['Label'].toLowerCase() })
        }
      }
      childTags = []
    }

    if (node.name === 'ActivityItem') {
      fluentType = FluentComponentType.ActivityItem
      
      const stringContainer = childTags.find(child => child.name === 'String-container')
      if (stringContainer) {
        parseFigmaText(stringContainer.children, 'String-activityDescription', properties, 'activityDescription')
        parseFigmaText(stringContainer.children, 'String-comment', properties, 'comments')
        parseFigmaText(stringContainer.children, 'String-timeStamp', properties, 'timestamp')
      }

      if (node.variantProperties) {
        if (node.variantProperties['Icon'] === 'True') {
          properties.push({ name: 'activityIcon', value: '<Icon iconName={\'TODO\'} />' })
        }
        if (node.variantProperties['Persona'] === 'True') {
          properties.push({ name: 'activityPersonas', value: '[{ imageUrl: \'TODO\', text: \'TODO\' }', notStringValue: true })
        }
        if (node.variantProperties['Compact'] === 'True') {
          properties.push({ name: 'isCompact', value: 'true', notStringValue: true })
        }
      }
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

    if (node.name === 'Slider') {
      fluentType = FluentComponentType.Slider
      childTags = []
    }

    if (node.name.includes('Rating')) {
      fluentType = FluentComponentType.Rating
      if (node.variantProperties && node.variantProperties['Stars']) {
        properties.push({ name: 'rating', value: node.variantProperties['Stars'], notStringValue: true })
      }
      childTags = []
    }

    if (node.name === 'Separator') {
      fluentType = FluentComponentType.Separator
      if (node.variantProperties) {
        if (node.variantProperties['Vertical'] === 'True') {
          properties.push({ name: 'vertical', value: null })
        }
        if (node.variantProperties['String'] !== 'None') {
          if (node.variantProperties['String'] === 'Center') {
            properties.push({ name: 'alignContent', value: 'center' })
          } else if (node.variantProperties['String'] === 'Top' || node.variantProperties['String'] === 'Left') {
            properties.push({ name: 'alignContent', value: 'start' })
          } else if (node.variantProperties['String'] === 'Down' || node.variantProperties['String'] === 'Right') {
            properties.push({ name: 'alignContent', value: 'start' })
          }
        }
        const separatorContentTag = childTags.find(child => child.name === 'Separator-content')
        const stringContainerTag = (separatorContentTag?.children ?? childTags).find(child => child.name === 'String-auto-layout')
        if (stringContainerTag) {
          childTags = stringContainerTag.children
        }
      }
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
    parseFigmaText(childTags, 'String', properties, 'placeholder')
  }
}

const parseFigmaText = (childTags: Tag[], childNodeName: string, properties: Property[], propName: string) => {
  console.log(childTags)
  const textTag = childTags.find(child => child.name === childNodeName)
  if (textTag) {
    properties.push({ name: propName, value: textTag.textCharacters ?? '' })
  }
}

const getCommandBarItemProps = (containerTag: Tag): string => {
  const items = containerTag.children.map((childTag, index) => {
    if (childTag.name === 'Button') { // already parsed
      const textProperty = childTag.properties.find(p => p.name === 'text')
      return `{ key: '${index}', text: '${textProperty?.value ?? ''}', iconProps: { iconName: 'TODO' }},`
    }
    if (childTag.name === 'Icon') {
      const iconPropsProperty = childTag.properties.find(p => p.name === 'iconProps')
      return `{ key: '${index}', text: 'TODO', ariaLabel: 'TODO', iconOnly: true, iconProps: ${iconPropsProperty?.value} }`
    }
  })
  return items.length > 0 ? `[ ${items.join(' ')} ]` : ''
}

const getBreadcrumbProps = (childTags: Tag[]): string => {
  const items = childTags.map((childTag, index) => {
    const itemLinkTag = childTag.children.find(child => child.name === 'Item-link')
    const buttonTag = (itemLinkTag ?? childTag).children.find(child => child.name === 'Button')
    if (buttonTag) {
      const textProperty = buttonTag.properties.find(child => child.name === 'text')
      return `{ key: '${index}', text: '${textProperty?.value ?? ''}'${childTag.name.includes('Selected') ? ', isCurrentItem: true' : ''} }`
    }
  })
  return items.length > 0 ? `[ ${items.join(' ')} ]` : ''
}

const getMessageBarTypeByFigmaVariant = (type: string): string => {
  switch (type) {
    case 'Blocked':
      return 'blocked';
    case 'Error':
      return 'error';
    case 'Info':
      return 'info';
    case 'Severe-Warning':
      return 'severeWarning';
    case 'Success':
      return 'success';
    case 'Warning':
      return 'warning';
    default:
      return 'info';
  }
}