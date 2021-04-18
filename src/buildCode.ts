import { modifyTreeForComponent } from './modifyTreeForComponent'
import { buildTagTree } from './buildTagTree'
import { kebabize } from './utils/stringUtils'
import { Tag } from './buildTagTree'

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

const getTagName = (tag: Tag, cssStyle: CssStyle) => {
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

const getClassName = (tag: Tag, cssStyle: CssStyle) => {
  if (cssStyle === 'css' && !tag.isComponent) {
    if (tag.isImg) {
      return ''
    }
    if (tag.isText) {
      return ' className="text"'
    }
    return ` className="${kebabize(tag.name)}"`
  }
  return ''
}

const buildJsxString = (tag: Tag, cssStyle: CssStyle, level: number) => {
  const spaceString = buildSpaces(4, level)
  const hasChildren = tag.children.length > 0

  const tagName = getTagName(tag, cssStyle)

  const className = getClassName(tag, cssStyle)
  const properties = tag.properties
    .map((prop) => ` ${prop.name}${prop.value !== null ? `=${prop.notStringValue ? '{' : '"'}${prop.value}${prop.notStringValue ? '}' : '"'}` : ''}`)
    .join('')

  const openingTag = `${spaceString}<${tagName}${className}${properties}${hasChildren || tag.isText ? `` : ' /'}>`
  const childTags = hasChildren
    ? '\n' + tag.children.map((child) => buildJsxString(child, cssStyle, level + 1)).join('\n')
    : tag.isText
    ? `\n${buildSpaces(4, level + 1)}${tag.textCharacters}`
    : ''
  const closingTag = hasChildren || tag.isText ? `\n${spaceString}</${tagName}>` : ''

  return openingTag + childTags + closingTag
}

export const buildCode = (node: SceneNode, css: CssStyle, _figma: PluginAPI): string => {
  const tag = modifyTreeForComponent(buildTagTree(node), _figma)

  return `const ${tag.name.replace(/\s/g, '')}: React.VFC = () => {
  return (
${buildJsxString(tag, css, 0)}
  )
}`
}
