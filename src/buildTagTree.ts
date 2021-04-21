import { CSSData, getCssDataForTag } from './getCssDataForTag'
import { isImageNode } from './utils/isImageNode'

type Property = {
  name: string
  value: string
  notStringValue?: boolean
}

export type Tag = {
  name: string
  isText: boolean
  textCharacters: string | null
  isImg: boolean
  properties: Property[]
  css: CSSData
  children: Tag[]
  node: SceneNode
  isComponent?: boolean
}

export function buildTagTree(node: SceneNode): Tag | null {
  if (!node.visible) {
    return null
  }

  const isImg = isImageNode(node)
  const properties: Property[] = []

  if (isImg) {
    properties.push({ name: 'src', value: '' })
  }

  const childTags: Tag[] = []
  if ('children' in node && !isImg) {
    node.children.forEach((child) => {
      childTags.push(buildTagTree(child))
    })
  }

  const tag: Tag = {
    name: node.name,
    isText: node.type === 'TEXT',
    textCharacters: node.type === 'TEXT' ? node.characters : null,
    isImg,
    css: getCssDataForTag(node),
    properties,
    children: childTags,
    node
  }

  return tag
}
