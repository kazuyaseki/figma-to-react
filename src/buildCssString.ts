import { CSSData } from './getCssDataForTag'
import { Tag } from './buildTagTree'
import { buildClassName } from './utils/cssUtils'
import { PRESSABLE_TAG_SUFFIX, TEXT_TAG_SUFFIX } from './utils/constants'
import { getItemSpacing } from './utils/isImageNode'

export type CssStyle = 'css' | 'StyleSheet' | 'Restyle' | 'styled-components'

function buildArray(tag: Tag, arr: CSSData[]): CSSData[] {
  if (!tag.isComponent) {
    arr.push(tag.css)
  }

  tag.children.forEach((child) => {
    arr = buildArray(child, arr)
  })

  return arr
}

export function buildCssString(tag: Tag, cssStyle: CssStyle): string {
  const cssArray = buildArray(tag, [])
  let codeStr = ''

  if (!cssArray) {
    return codeStr
  }
  cssArray.forEach((cssData) => {
    if (!cssData || cssData.properties.length === 0) {
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
      if (tag.isText || cssData?.className.endsWith(TEXT_TAG_SUFFIX)) {
        reactNativeComponent = 'Text'
      } else if (cssData?.className.endsWith(PRESSABLE_TAG_SUFFIX)) {
        reactNativeComponent = 'Pressable'
      }
    }

    const currentStr =
      cssStyle === 'styled-components'
        ? `const ${cssData?.className.replace(/\s/g, '')} = styled.${reactNativeComponent}\`
${cssData.properties.map((property) => `  ${property.name}: ${property.value};`).join('\n')}
\`\n`
        : `.${buildClassName(cssData?.className)} {
${cssData.properties.map((property) => `  ${property.name}: ${property.value};`).join('\n')}
}\n`

    codeStr += currentStr
  })

  // FIXME: Spacer shouldn't be needed if gap property is working
  if (cssStyle === 'styled-components') {
    const node = tag.node
    let propertyName = 'height'
    if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
      if (node.layoutMode === 'HORIZONTAL') {
        propertyName = 'width'
      }
    }

    const spacerStr = `\nconst Spacer = styled.View\`
  ${propertyName}: ${getItemSpacing(tag.node)}px;
\``
    codeStr += spacerStr
  }

  return codeStr
}
