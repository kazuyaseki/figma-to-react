import { capitalizeFirstLetter, kebabize } from './utils/stringUtils'
import { Tag } from './buildTagTree'
import { buildClassName } from './utils/cssUtils'

type CssStyle = 'css' | 'styled-components'

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

function guessTagName(name: string) {
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
    return guessTagName(tag.name)
  }
  return tag.isText ? 'Text' : tag.name.replace(/\s/g, '')
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
    return '\n' + tag.children.map((child) => buildJsxString(child, cssStyle, level + 1)).join('\n')
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

export function buildCode(tag: Tag, css: CssStyle): string {
  return `const ${capitalizeFirstLetter(tag.name.replace(/\s/g, ''))}: React.VFC = () => {
  return (
${buildJsxString(tag, css, 0)}
  )
}`
}
