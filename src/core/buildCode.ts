import { capitalizeFirstLetter } from '../utils/stringUtils'
import { Tag } from './buildTagTree'
import { buildClassName } from '../utils/cssUtils'
import { CssStyle } from './buildCssString'
import { fixTagPrefixAndSuffix, getTagNameWithoutPrefix } from '../utils/tagUtils'

function buildSpaces(baseSpaces: number, level: number) {
  let spacesStr = ''

  for (let i = 0; i < baseSpaces; i++) {
    spacesStr += ' '
  }

  for (let i = 0; i < level; i++) {
    spacesStr += '  '
  }

  return spacesStr
}

function guessCssTagName(name: string) {
  const _name = name.toLowerCase()
  if (_name.includes('button')) {
    return 'button'
  }
  if (_name.includes('section')) {
    return 'section'
  }
  if (_name.includes('article')) {
    return 'article'
  }
  return 'div'
}

function getTagName(tag: Tag, cssStyle: CssStyle) {
  if (cssStyle === 'css' && !tag.isComponent) {
    if (tag.isImg) {
      return 'img'
    }
    if (tag.isText) {
      return 'p'
    }
    return guessCssTagName(tag.name)
  } else if (cssStyle === 'styled-components' && !tag.isComponent) {
    fixTagPrefixAndSuffix(tag)
  }
  return tag.name.replace(/\s/g, '')
}

function getClassName(tag: Tag, cssStyle: CssStyle) {
  if (cssStyle === 'css' && !tag.isComponent) {
    if (tag.isImg) {
      return ''
    }
    return ` className="${buildClassName(tag.css.className)}"`
  }
  return ''
}

function buildPropertyString(prop: Tag['properties'][number]) {
  return ` ${prop.name}${prop.value !== null ? `=${prop.notStringValue ? '{' : '"'}${prop.value}${prop.notStringValue ? '}' : '"'}` : ''}`
}

function buildChildTagsString(tag: Tag, cssStyle: CssStyle, level: number): string {
  if (tag.children.length > 0) {
    const childrenMap = tag.children.map((child) => buildJsxString(child, cssStyle, level + 1))

    // FIXME: Spacer shouldn't be needed if flex gap property is working
    const spaceString = buildSpaces(4, level + 1)
    return '\n' + childrenMap.join(tag.hasItemSpacing ? `\n${spaceString}<${getTagName(tag, cssStyle)}Spacer />\n` : '\n')
  }
  if (tag.isText) {
    return `${tag.textCharacters}`
  }
  return ''
}

function buildJsxString(tag: Tag, cssStyle: CssStyle, level: number) {
  if (!tag) {
    return ''
  }

  if (cssStyle === 'styled-components') {
    const spaceString = buildSpaces(4, level)
    const hasChildren = tag.children.length > 0
    const tagName = getTagName(tag, cssStyle)
    const className = getClassName(tag, cssStyle)
    const properties = tag.properties.map(buildPropertyString).join('')
    const openingTag = `${spaceString}<${tagName}${className}${properties}${hasChildren || tag.isText ? `` : ' /'}>`
    const childTags = buildChildTagsString(tag, cssStyle, level)
    const closingTag = hasChildren || tag.isText ? `${!tag.isText ? '\n' + spaceString : ''}</${tagName}>` : ''
    return openingTag + childTags + closingTag
  } else if (cssStyle === 'Restyle') {
    const spaceString = buildSpaces(4, level)
    const hasChildren = tag.children.length > 0
    const tagName = getTagName(tag, cssStyle)
    const className = getClassName(tag, cssStyle)
    const properties = tag.properties.map(buildPropertyString).join('')
    const openingTag = `${spaceString}<${tagName}${className}${properties}${hasChildren || tag.isText ? `` : ' /'}>`
    const childTags = buildChildTagsString(tag, cssStyle, level)
    const closingTag = hasChildren || tag.isText ? `${!tag.isText ? '\n' + spaceString : ''}</${tagName}>` : ''
    return openingTag + childTags + closingTag
  }
}

export function buildCode(tag: Tag, css: CssStyle): string {
  return `const ${capitalizeFirstLetter(getTagNameWithoutPrefix(tag.name).replace(/\s/g, ''))}Component: React.VFC = () => {
  return (
${buildJsxString(tag, css, 0)}
  )
}`
}
