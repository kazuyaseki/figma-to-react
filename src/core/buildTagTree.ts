import { UnitType } from './buildSizeStringByUnit'
import { CSSData, getCssDataForTag, TextCount } from './getCssDataForTag'
import {
  alignItemsCssValues,
  IMAGE_TAG_PREFIX,
  IMAGE_TAG_SUFFIX,
  justifyContentCssValues,
  PRESSABLE_TAG_PREFIX,
  PRESSABLE_TAG_SUFFIX,
  TEXT_TAG_PREFIX,
  TEXT_TAG_SUFFIX
} from '../utils/constants'
import { getItemSpacing, isImageNode } from '../utils/isImageNode'
import { CssStyle } from './buildCssString'
import * as _ from 'lodash'
import { Store } from '../model/Store'

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

export function buildTagTree(node: SceneNode, unitType: UnitType, textCount: TextCount, cssStyle?: CssStyle, sharedPluginData?: Store): Tag | null {
  if (!node.visible) {
    return null
  }

  const childTags: Tag[] = []
  const hasItemSpacing = getItemSpacing(node) > 0
  const isImg = isImageNode(node)
  const properties: Property[] = []

  let nodeName = node.name

  if ('children' in node && !isImg) {
    node.children.forEach((child) => {
      const childTag = buildTagTree(child, unitType, textCount, cssStyle, sharedPluginData)
      if (childTag) {
        childTags.push(childTag)
      }
    })
  }

  if (cssStyle === 'Restyle') {
    const style: any = {}

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

          const spacingKeys = ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight']

          spacingKeys.forEach((key: any) => {
            if (node[key as keyof unknown] > 0) {
              const propertiesByNodeId = sharedPluginData?.properties?.filter((property: any) => property.nodeId === node.id)
              const property = propertiesByNodeId?.find((currentProperty: any) => key === currentProperty.id)

              if (property?.linkedToken) {
                properties.push({ name: key, value: property.linkedToken })
              } else {
                style[key] = node.paddingTop
              }
            }
          })

          /* FIXME: gap is currently not supported on React Native styled-components
          if (node.primaryAxisAlignItems !== 'SPACE_BETWEEN' && node.itemSpacing > 0) {
            properties.push({ name: 'gap', value: buildSizeStringByUnit(node.itemSpacing, unitType) })
          } */
        } else {
          properties.push({ name: 'height', value: Math.floor(node.height) + 'px' })
          properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
        }

        /* FIXME: border and color stuff
        if ((node.fills as Paint[]).length > 0 && (node.fills as Paint[])[0].type !== 'IMAGE') {
          const paint = (node.fills as Paint[])[0]
          properties.push({ name: 'background-color', value: buildColorString(paint) })
        }

        if ((node.strokes as Paint[]).length > 0) {
          const paint = (node.strokes as Paint[])[0]
          properties.push({ name: 'border', value: `${buildSizeStringByUnit(node.strokeWeight, unitType)} solid ${buildColorString(paint)}` })
        } 
        */
      }

      // ... tons of other types of node ...

      if (node.type === 'GROUP' || node.type === 'ELLIPSE' || node.type === 'POLYGON' || node.type === 'STAR') {
        properties.push({ name: 'height', value: Math.floor(node.height) + 'px' })
        properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
      }

      // FIXME: Just a workaround while Image is not implemented, use a Gray View as placeholder
      if (node.name.startsWith(IMAGE_TAG_PREFIX)) {
        style['backgroundColor'] = `'gray'`
      }

      // FIXME: this workaround for Pressable should't be needed in the future
      if (node.name.startsWith(PRESSABLE_TAG_PREFIX)) {
        properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
      }
    }

    if (!_.isEmpty(style)) {
      properties.push({ name: 'style', notStringValue: true, value: JSON.stringify(style).replaceAll('"', '') })
    }

    // Fix node name if needed

    if (isImageNode(node)) {
      if (node.name.startsWith(IMAGE_TAG_PREFIX)) {
        nodeName = node.name.substring(IMAGE_TAG_PREFIX.length, node.name.length)
      }
      if (!node.name.endsWith(IMAGE_TAG_SUFFIX)) {
        nodeName += IMAGE_TAG_SUFFIX
      }
    }

    if (node.type === 'TEXT' && !node.name.endsWith(TEXT_TAG_SUFFIX)) {
      nodeName = node.name + TEXT_TAG_SUFFIX
    }

    if (node.name.startsWith(PRESSABLE_TAG_PREFIX)) {
      nodeName = node.name.substring(PRESSABLE_TAG_PREFIX.length, node.name.length)
      if (!node.name.endsWith(PRESSABLE_TAG_SUFFIX)) {
        nodeName += PRESSABLE_TAG_SUFFIX
      }
    }
  }

  const tag: Tag = {
    name: nodeName,
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
