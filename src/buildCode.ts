import { kebabize } from './utils/kebabize'
import { isImageNode } from './utils/isImageNode'

type Property = {
  name: string
  value: string
}

type Tag = {
  name: string
  type: 'opening' | 'closing'
  properties: Property[]
  level: number
  node: SceneNode
  renderTextWithoutTag?: boolean
  hasChildren: boolean
}

type CssStyle = 'css' | 'styled-components'

const extractTagNames = (tagNameQueue: Tag[], node: SceneNode, level: number) => {
  if (!node.visible) {
    return
  }

  const skipChildrenIndex: number[] = []
  const renderChildTextWithoutTag = false
  const properties: Property[] = []
  const hasChildren = ('children' in node && node.children.length > 0) || node.type === 'TEXT' // text は characters が子供なので除外

  const isImageFrame = isImageNode(node)
  if (isImageFrame) {
    properties.push({ name: 'src', value: '' })
  }

  tagNameQueue.push({
    node,
    name: isImageFrame ? 'img' : node.name,
    type: 'opening',
    properties,
    level,
    hasChildren
  })

  if ('children' in node && !isImageFrame) {
    if (renderChildTextWithoutTag) {
      tagNameQueue.push({
        node,
        name: (node.children[0] as TextNode).characters,
        type: 'opening',
        properties: [],
        level: level + 1,
        renderTextWithoutTag: true,
        hasChildren
      })
    } else {
      node.children.forEach((child, index) => {
        if (!skipChildrenIndex.includes(index)) {
          extractTagNames(tagNameQueue, child, level + 1)
        }
      })
    }
  }

  if (!isImageFrame && hasChildren) {
    tagNameQueue.push({
      node,
      name: node.name,
      type: 'closing',
      properties: [],
      level,
      hasChildren
    })
  }
}

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

export const buildCode = (node: SceneNode, css: CssStyle) => {
  const tagNameQueue: Tag[] = []
  extractTagNames(tagNameQueue, node, 0)

  return `const ${node.name.replace(/\s/g, '')}: React.VFC = () => {
  return (
${tagNameQueue.reduce((prev, current, index) => {
  const isText = current.node.type === 'TEXT'

  let textStyle: BaseStyle | undefined = undefined
  if (isText) {
    textStyle = figma.getStyleById((current.node as TextNode).textStyleId as string)
  }

  const hasTextStyle = !!textStyle

  const isOpeningText = isText && current.type === 'opening'
  const isClosingText = isText && current.type === 'closing'

  const spaceString = isClosingText ? '' : buildSpaces(4, current.level)

  const openingBracket = current.renderTextWithoutTag ? '' : '<'
  const closingSlash = current.type === 'closing' ? '/' : ''
  const tagName = hasTextStyle ? 'p' : css === 'css' ? (isText ? 'p' : guessTagName(current.name)) : isText ? 'Text' : current.name.replace(/\s/g, '')
  const className =
    current.type === 'closing'
      ? ''
      : hasTextStyle
      ? ` className="${textStyle.name}"`
      : css === 'css'
      ? isText
        ? ' className="text"'
        : ` className="${kebabize(current.name)}"`
      : ''
  const properties = current.type === 'opening' ? current.properties.map((prop) => ` ${prop.name}="${prop.value}"`).join() : ''
  const openingTagSlash = current.hasChildren ? '' : ' /'
  const closingBracket = current.renderTextWithoutTag ? '' : '>'
  const textValue = isOpeningText ? current.name : '' /* テキストの場合は中身のテキストを足す */

  const tag = openingBracket + closingSlash + tagName + className + properties + openingTagSlash + closingBracket + textValue

  const ending = isOpeningText || index === tagNameQueue.length - 1 ? '' : '\n'

  return prev + spaceString + tag + ending
}, '')}
  )
}`
}
