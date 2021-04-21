import { kebabize } from './utils/stringUtils'
import { CSSData } from './getCssDataForTag'
import { Tag } from './buildTagTree'

export type CssStyle = 'css' | 'styled-components'

const buildArray = (tag: Tag, arr: CSSData[]): CSSData[] => {
  arr.push(tag.css)

  tag.children.forEach((child) => {
    arr = buildArray(child, arr)
  })

  return arr
}

export const buildCssString = (tag: Tag, cssStyle: CssStyle): string => {
  const cssArray = buildArray(tag, [])
  let codeStr = ''

  cssArray.forEach((cssData) => {
    const cssStr =
      cssStyle === 'styled-components'
        ? `const ${cssData.className.replace(/\s/g, '')} = styled.div\`
${cssData.properties.map((property) => `  ${property.name}: ${property.value};`).join('\n')}
\`\n`
        : `.${kebabize(cssData.className)} {
${cssData.properties.map((property) => `  ${property.name}: ${property.value};`).join('\n')}
}\n`

    codeStr += cssStr
  })

  return codeStr
}
