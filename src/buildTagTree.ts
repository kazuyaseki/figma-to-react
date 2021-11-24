import { UnitType } from './buildSizeStringByUnit'
import { CSSData, getCssDataForTag, TextCount } from './getCssDataForTag'
import { TEXT_TAG_PREFIX } from './utils/constants'
import { getItemSpacing, isImageNode } from './utils/isImageNode'

type Property = {
  name: string
  notStringValue?: boolean
  value: string
}

export type Tag = {
  children: Tag[]
  css: CSSData
  hasItemSpacing: boolean
  isComponent?: boolean
  isImg: boolean
  isText: boolean
  name: string
  node: SceneNode
  properties: Property[]
  textCharacters: string | null
}

export function buildTagTree(node: SceneNode, unitType: UnitType, textCount: TextCount): Tag | null {
  if (!node.visible) {
    return null
  }

  const hasItemSpacing = getItemSpacing(node) > 0
  const isImg = isImageNode(node)
  const properties: Property[] = []

  const childTags: Tag[] = []
  if ('children' in node && !isImg) {
    node.children.forEach((child) => {
      const childTag = buildTagTree(child, unitType, textCount)
      if (childTag) {
        childTags.push(childTag)
      }
    })
  }

  const tag: Tag = {
    name: node.name,
    isText: node.type === 'TEXT' || node.name.startsWith(TEXT_TAG_PREFIX),
    textCharacters: node.type === 'TEXT' ? node.characters : null,
    isImg,
    css: getCssDataForTag(node, unitType, textCount),
    properties,
    children: childTags,
    node,
    hasItemSpacing
  }

  return tag
}
