import { CSSData } from './getCssDataForTag'
import { Tag } from './buildTagTree'
import { buildClassName } from './utils/cssUtils'
import { capitalizeFirstLetter } from './utils/stringUtils'

export type CssStyle = 'css' | 'styled-components' | 'stitches'

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

    //     const cssStr =
    //       cssStyle === 'styled-components'
    //         ? `const ${cssData?.className.replace(/\s/g, '')} = styled.div\`
    // ${cssData.properties.map((property) => `  ${property.name}: ${property.value};`).join('\n')}
    // \`\n`
    //         : `.${buildClassName(cssData?.className)} {
    // ${cssData.properties.map((property) => `  ${property.name}: ${property.value};`).join('\n')}
    // }\n`

    const cssStr = `const ${capitalizeFirstLetter(cssData?.className.replace(/\s/g, ''))} = styled("div", {
${cssData.properties.map((property) => `  ${property.name.replace(/-./g, (x) => x[1].toUpperCase())}: "${property.value}";`).join('\n')}
}\n`

    codeStr += cssStr
  })

  return codeStr
}
