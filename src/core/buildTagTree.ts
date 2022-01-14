import { UnitType } from './buildSizeStringByUnit'
import { CSSData, getCssDataForTag, TextCount } from './getCssDataForTag'
import { alignItemsCssValues, IMAGE_TAG_PREFIX, justifyContentCssValues, PRESSABLE_TAG_PREFIX, TEXT_TAG_PREFIX } from '../utils/constants'
import { getItemSpacing, isImageNode } from '../utils/isImageNode'
import { CssStyle } from './buildCssString'

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

export function buildTagTree(node: SceneNode, unitType: UnitType, textCount: TextCount, cssStyle?: CssStyle): Tag | null {
  if (!node.visible) {
    return null
  }

  const hasItemSpacing = getItemSpacing(node) > 0
  const isImg = isImageNode(node)
  const properties: Property[] = []

  const childTags: Tag[] = []

  if ('children' in node && !isImg) {
    node.children.forEach((child) => {
      const childTag = buildTagTree(child, unitType, textCount, cssStyle)
      if (childTag) {
        childTags.push(childTag)
      }
    })
  }

  if (cssStyle === 'Restyle') {
    // skip vector since it's often displayed as an img tag
    if (node.visible && node.type !== 'VECTOR') {
      if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
        /* FIXME: borderRadius should use borderRadii keys from theme
        const borderRadiusValue = getBorderRadiusString(node, unitType)
        if (borderRadiusValue) {
          properties.push({ name: 'borderRadius', value: borderRadiusValue })
        } */
        /* FIXME: box-shadow should be converted to shadowOpacity, shadowOffset,
          shadowRadius and elevation properties 
        const boxShadowValue = getBoxShadowString(node, unitType)
        if (boxShadowValue) {
          properties.push({ name: 'box-shadow', value: boxShadowValue })
        } */

        if (node.layoutMode !== 'NONE') {
          properties.push({ name: 'flexDirection', value: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column' })
          properties.push({ name: 'justifyContent', value: justifyContentCssValues[node.primaryAxisAlignItems] })
          properties.push({ name: 'alignItems', value: alignItemsCssValues[node.counterAxisAlignItems] })

          if (node.layoutAlign === 'STRETCH') {
            properties.push({ name: 'alignSelf', value: 'stretch' })
          }

          // FIXME: This name startsWith workaround for Pressable shouldn't be needed
          if (!node.name.startsWith(PRESSABLE_TAG_PREFIX) && (node.layoutGrow > 0 || node.layoutAlign === 'INHERIT')) {
            properties.push({ name: 'flex', value: node.layoutGrow === 0 ? '1' : `${node.layoutGrow}` })
          }
          /*
          if (node.paddingTop === node.paddingBottom && node.paddingTop === node.paddingLeft && node.paddingTop === node.paddingRight) {
            if (node.paddingTop > 0) {
              properties.push({ name: 'padding', value: `${buildSizeStringByUnit(node.paddingTop, unitType)}` })
            }
          } else if (node.paddingTop === node.paddingBottom && node.paddingLeft === node.paddingRight) {
            properties.push({ name: 'padding', value: `${buildSizeStringByUnit(node.paddingTop, unitType)} ${buildSizeStringByUnit(node.paddingLeft, unitType)}` })
          } else {
            properties.push({
              name: 'padding',
              value: `${buildSizeStringByUnit(node.paddingTop, unitType)} ${buildSizeStringByUnit(node.paddingRight, unitType)} ${buildSizeStringByUnit(
                node.paddingBottom,
                unitType
              )} ${buildSizeStringByUnit(node.paddingLeft, unitType)}`
            })
          }
          */
          /* FIXME: gap is currently not supported on React Native styled-components
          if (node.primaryAxisAlignItems !== 'SPACE_BETWEEN' && node.itemSpacing > 0) {
            properties.push({ name: 'gap', value: buildSizeStringByUnit(node.itemSpacing, unitType) })
          } */
        } else {
          properties.push({ name: 'height', value: Math.floor(node.height) + 'px' })
          properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
        }
      }

      // ... tons of other types of node ...

      if (node.type === 'GROUP' || node.type === 'ELLIPSE' || node.type === 'POLYGON' || node.type === 'STAR') {
        properties.push({ name: 'height', value: Math.floor(node.height) + 'px' })
        properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
      }

      // FIXME: Just a workaround while Image is not implemented, use a Gray View as placeholder
      if (node.name.startsWith(IMAGE_TAG_PREFIX)) {
        properties.push({ name: 'style', notStringValue: true, value: `{ backgroundColor: 'gray' }` })
      }

      // FIXME: this workaround for Pressable should't be needed in the future
      if (node.name.startsWith(PRESSABLE_TAG_PREFIX)) {
        properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
      }
    }
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
