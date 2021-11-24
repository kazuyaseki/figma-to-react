import { CSSData } from './getCssDataForTag'
import { Tag } from './buildTagTree'
import { buildClassName } from './utils/cssUtils'
import { PRESSABLE_TAG_SUFFIX, TEXT_TAG_SUFFIX } from './utils/constants'
import { getItemSpacing } from './utils/isImageNode'

export type CssStyle = 'css' | 'StyleSheet' | 'Restyle' | 'styled-components'

type DataObject = {
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

export function buildCssString(tag: Tag, cssStyle: CssStyle): string {
  const dataObjectArray: DataObject[] = buildArray(tag, [])
  const codeTagNames: string[] = []

  let codeStr = ''

  if (!dataObjectArray) {
    return codeStr
  }

  dataObjectArray.forEach((dataObject: DataObject) => {
    if (!dataObject.cssData || dataObject.cssData.properties.length === 0) {
      return
    }

    const codeTagName = getCodeTagName(dataObject.cssData?.className, cssStyle)

    if (codeTagNames.includes(codeTagName)) {
      return
    }

    let reactNativeComponent = 'View'

    if (cssStyle === 'styled-components') {
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
    }

    const currentStr =
      cssStyle === 'styled-components'
        ? `const ${codeTagName} = styled.${reactNativeComponent}\`
${dataObject.cssData.properties.map((property: any) => `  ${property.name}: ${property.value};`).join('\n')}
\`\n`
        : `.${codeTagName} {
${dataObject.cssData.properties.map((property: any) => `  ${property.name}: ${property.value};`).join('\n')}
}\n`

    codeStr += currentStr
    codeTagNames.push(codeTagName)

    // FIXME: Spacer shouldn't be needed if gap property is working
    if (cssStyle === 'styled-components' && dataObject.tag.hasItemSpacing) {
      const node = dataObject.tag.node
      let propertyName = 'height'

      if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
        if (node.layoutMode === 'HORIZONTAL') {
          propertyName = 'width'
        }
      }

      const spacerStr = `\nconst ${dataObject.cssData?.className.replace(/\s/g, '')}Spacer = styled.View\`
  ${propertyName}: ${getItemSpacing(dataObject.tag.node)}px;
\`\n\n`

      codeStr += spacerStr
    }
  })

  return codeStr
}

export function getCodeTagName(className: string, style: CssStyle) {
  if (style === 'styled-components') {
    return className.replace(/\s/g, '')
  }
  return buildClassName(className)
}
