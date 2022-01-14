import { CSSData } from './getCssDataForTag'
import { Tag } from './buildTagTree'
import { buildClassName } from '../utils/cssUtils'
import { PRESSABLE_TAG_SUFFIX, TEXT_TAG_SUFFIX } from '../utils/constants'
import { getItemSpacing } from '../utils/isImageNode'
import { Store } from '../model/Store'
export type CssStyle = 'css' | 'StyleSheet' | 'Restyle' | 'styled-components'

type DataObject = {
  addedToCode?: boolean
  tag: Tag
  cssData: CSSData
}

function buildArray(tag: Tag, arr: DataObject[]): DataObject[] {
  if (!tag.isComponent) {
    arr.push({ addedToCode: false, tag: tag, cssData: tag.css })
  }

  tag.children.forEach((child) => {
    arr = buildArray(child, arr)
  })

  return arr
}

export function buildCssString(tag: Tag, cssStyle: CssStyle, sharedPluginData: Store) {
  const dataObjectArray: DataObject[] = buildArray(tag, [])
  const codeTagNames: string[] = []

  let codeStr = ''

  if (!dataObjectArray) {
    return ''
  }

  dataObjectArray.forEach((dataObject: DataObject) => {
    if (!dataObject.cssData || dataObject.cssData.properties.length === 0) {
      return
    }

    const codeTagName = getCodeTagName(dataObject.cssData?.className, cssStyle)

    if (codeTagNames.includes(codeTagName)) {
      return
    }

    if (cssStyle === 'styled-components') {
      codeStr += getStyledComponentsCodeString(tag, dataObject, codeTagName, codeTagNames)
    } else if (cssStyle === 'Restyle') {
      codeStr += getRestyleCodeString(tag, dataObject, codeTagName, codeTagNames)
    }
  })

  return codeStr
}

export function getCodeTagName(className: string, style: CssStyle) {
  if (style === 'styled-components' || style === 'Restyle') {
    return className.replace(/\s/g, '')
  }
  return buildClassName(className)
}

function getRestyleCodeString(tag: Tag, dataObject: DataObject, codeTagName: string, codeTagNames: string[]) {
  let result = ''

  let reactNativeComponent = 'Box'

  if (tag.isText || dataObject.cssData?.className.endsWith(TEXT_TAG_SUFFIX)) {
    reactNativeComponent = 'Text'
  } else if (dataObject.cssData?.className.endsWith(PRESSABLE_TAG_SUFFIX)) {
    reactNativeComponent = 'Pressable'
  }

  if (reactNativeComponent === 'Box') {
    const currentStr = `const ${codeTagName} = createBox<Theme>();\n`
    result += currentStr
  } else if (reactNativeComponent === 'Text') {
    const currentStr = `const ${codeTagName} = createText<Theme>();\n`
    result += currentStr
  } else if (reactNativeComponent === 'Pressable') {
    const currentStr = `const ${codeTagName} = createBox<Theme, PressableProps>(Pressable);\n`
    result += currentStr
  }

  codeTagNames.push(codeTagName)

  return result
}

function getStyledComponentsCodeString(tag: Tag, dataObject: DataObject, codeTagName: string, codeTagNames: string[]) {
  let result = ''

  let reactNativeComponent = 'View'
  /*
   * FIXME: Image still not implemented
  if (tag.isImg || cssData?.className.endsWith(IMAGE_TAG_SUFFIX)) {
    reactNativeComponent = 'Image'
  }
  */
  if (tag.isText || dataObject.cssData?.className.endsWith(TEXT_TAG_SUFFIX)) {
    reactNativeComponent = 'Text'
  } else if (dataObject.cssData?.className.endsWith(PRESSABLE_TAG_SUFFIX)) {
    reactNativeComponent = 'Pressable'
  }

  const currentStr = `const ${codeTagName} = styled.${reactNativeComponent}\`
${dataObject.cssData.properties.map((property: any) => `  ${property.name}: ${property.value};`).join('\n')}
\`\n`

  result += currentStr
  codeTagNames.push(codeTagName)

  // FIXME: Spacer shouldn't be needed if gap property is working
  if (dataObject.tag.hasItemSpacing) {
    const node = dataObject.tag.node

    let propertyName = 'height'

    if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
      if (node.layoutMode === 'HORIZONTAL') {
        propertyName = 'width'
      }
    }

    /* FIXME: replace values by design tokens
    const propertiesByNodeId = sharedPluginData.properties?.filter((property: any) => property.nodeId === node.id)
    const property = propertiesByNodeId?.find((currentProperty: any) => propertyName === currentProperty.id)

    if (property?.linkedToken) {
      //        const designTokens = sharedPluginData.designTokens
      //        const designToken = designTokens.find((designToken: any) => designToken.tokenName === property.linkedToken)
    }
  */

    const spacerStr = `\nconst ${dataObject.cssData?.className.replace(/\s/g, '')}Spacer = styled.View\`
${propertyName}: ${getItemSpacing(dataObject.tag.node)}px;
\`\n\n`

    result += spacerStr
  }

  return result
}
