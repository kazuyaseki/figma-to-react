import { buildSizeStringByUnit, UnitType } from './buildSizeStringByUnit'
import { IMAGE_TAG_PREFIX, IMAGE_TAG_SUFFIX, PRESSABLE_TAG_PREFIX, PRESSABLE_TAG_SUFFIX, TEXT_TAG_SUFFIX } from '../utils/constants'
import { isImageNode } from '../utils/isImageNode'

export type CSSData = {
  className: string
  properties: {
    name: string
    value: string | number
  }[]
}

export class TextCount {
  count = 1
  constructor() {
    return
  }

  increment() {
    this.count++
  }
}

const alignItemsCssValues = {
  MIN: 'flex-start',
  MAX: 'flex-end',
  CENTER: 'center'
}

const justifyContentCssValues = {
  MIN: 'flex-start',
  MAX: 'flex-end',
  CENTER: 'center',
  SPACE_BETWEEN: 'space-between'
}

const textAlignCssValues = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  JUSTIFIED: 'justify'
}

const textDecorationCssValues = {
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'line-through'
}

const textVerticalAlignCssValues = {
  TOP: 'top',
  CENTER: 'middle',
  BOTTOM: 'bottom'
}

export function getCssDataForTag(node: SceneNode, unitType: UnitType, textCount: TextCount): CSSData {
  const properties: CSSData['properties'] = []

  // skip vector since it's often displayed as an img tag
  if (node.visible && node.type !== 'VECTOR') {
    if ('opacity' in node && (node?.opacity || 1) < 1) {
      properties.push({ name: 'opacity', value: node.opacity || 1 })
    }
    if ('rotation' in node && node.rotation !== 0) {
      properties.push({ name: 'transform', value: `rotate(${Math.floor(node.rotation)}deg)` })
    }

    if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
      const borderRadiusValue = getBorderRadiusString(node, unitType)
      if (borderRadiusValue) {
        properties.push({ name: 'border-radius', value: borderRadiusValue })
      }

      const boxShadowValue = getBoxShadowString(node, unitType)
      if (boxShadowValue) {
        properties.push({ name: 'box-shadow', value: boxShadowValue })
      }

      if (node.layoutMode !== 'NONE') {
        console.log('node.name ' + node.name)
        console.log(node)
        properties.push({ name: 'flex-direction', value: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column' })
        properties.push({ name: 'justify-content', value: justifyContentCssValues[node.primaryAxisAlignItems] })
        properties.push({ name: 'align-items', value: alignItemsCssValues[node.counterAxisAlignItems] })

        if (node.layoutAlign === 'STRETCH') {
          properties.push({ name: 'align-self', value: 'stretch' })
        }

        // FIXME: This name startsWith workaround for Pressable shouldn't be needed
        if (!node.name.startsWith(PRESSABLE_TAG_PREFIX) && (node.layoutGrow > 0 || node.layoutAlign === 'INHERIT')) {
          properties.push({ name: 'flex', value: node.layoutGrow === 0 ? 1 : node.layoutGrow })
        }

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

        /* FIXME: gap is currently not supported on React Native styled-components
        if (node.primaryAxisAlignItems !== 'SPACE_BETWEEN' && node.itemSpacing > 0) {
          properties.push({ name: 'gap', value: buildSizeStringByUnit(node.itemSpacing, unitType) })
        } */
      } else {
        properties.push({ name: 'height', value: Math.floor(node.height) + 'px' })
        properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
      }

      if ((node.fills as Paint[]).length > 0 && (node.fills as Paint[])[0].type !== 'IMAGE') {
        const paint = (node.fills as Paint[])[0]
        properties.push({ name: 'background-color', value: buildColorString(paint) })
      }

      if ((node.strokes as Paint[]).length > 0) {
        const paint = (node.strokes as Paint[])[0]
        properties.push({ name: 'border', value: `${buildSizeStringByUnit(node.strokeWeight, unitType)} solid ${buildColorString(paint)}` })
      }
    }

    if (node.type === 'RECTANGLE') {
      const borderRadiusValue = getBorderRadiusString(node, unitType)
      if (borderRadiusValue) {
        properties.push({ name: 'border-radius', value: borderRadiusValue })
      }

      properties.push({ name: 'height', value: Math.floor(node.height) + 'px' })
      properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })

      if ((node.fills as Paint[]).length > 0 && (node.fills as Paint[])[0].type !== 'IMAGE') {
        const paint = (node.fills as Paint[])[0]
        properties.push({ name: 'background-color', value: buildColorString(paint) })
      }

      if ((node.strokes as Paint[]).length > 0) {
        const paint = (node.strokes as Paint[])[0]
        properties.push({ name: 'border', value: `${buildSizeStringByUnit(node.strokeWeight, unitType)} solid ${buildColorString(paint)}` })
      }
    }

    if (node.type === 'TEXT') {
      if (node.textAutoResize !== 'WIDTH_AND_HEIGHT') {
        properties.push({ name: 'max-width', value: `${node.width}px` })
      }

      properties.push({ name: 'text-align', value: textAlignCssValues[node.textAlignHorizontal] })
      properties.push({ name: 'vertical-align', value: textVerticalAlignCssValues[node.textAlignVertical] })
      if (node.fontName) {
        const fontName = node.fontName
        if ((fontName as FontName).family) {
          properties.push({ name: 'font-family', value: (node.fontName as FontName).family })
        }
        if ((fontName as FontName).style) {
          properties.push({ name: 'font-weight', value: (node.fontName as FontName).style.toLowerCase() })
        }
      }
      properties.push({ name: 'font-size', value: `${node.fontSize as number}px` })

      const letterSpacing = node.letterSpacing as LetterSpacing
      const letterSpacingValue = letterSpacing.value
      if (letterSpacingValue !== 0) {
        properties.push({
          name: 'letter-spacing',
          value: letterSpacing.unit === 'PIXELS' ? buildSizeStringByUnit(Number(letterSpacingValue.toFixed(2)), unitType) : letterSpacing.value + '%'
        })
      }

      type LineHeightWithValue = {
        readonly value: number
        readonly unit: 'PIXELS' | 'PERCENT'
      }

      properties.push({
        name: 'line-height',
        value:
          (node.lineHeight as LineHeight).unit === 'AUTO'
            ? 'auto'
            : (node.letterSpacing as LetterSpacing).unit === 'PIXELS'
            ? buildSizeStringByUnit((node.lineHeight as LineHeightWithValue).value, unitType)
            : (node.lineHeight as LineHeightWithValue).value + '%'
      })

      if (node.textDecoration === 'STRIKETHROUGH' || node.textDecoration === 'UNDERLINE') {
        properties.push({ name: 'text-decoration', value: textDecorationCssValues[node.textDecoration] })
      }
      if ((node.fills as Paint[]).length > 0) {
        const paint = (node.fills as Paint[])[0]
        properties.push({ name: 'color', value: buildColorString(paint) })
      }
    }

    if (node.type === 'LINE') {
      properties.push({ name: 'height', value: Math.floor(node.height) + 'px' })
      properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })

      if ((node.strokes as Paint[]).length > 0) {
        const paint = (node.strokes as Paint[])[0]
        properties.push({ name: 'border', value: `${buildSizeStringByUnit(node.strokeWeight, unitType)} solid ${buildColorString(paint)}` })
      }
    }

    if (node.type === 'GROUP' || node.type === 'ELLIPSE' || node.type === 'POLYGON' || node.type === 'STAR') {
      properties.push({ name: 'height', value: Math.floor(node.height) + 'px' })
      properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
    }

    // FIXME: Just a workaround while Image is not implemented, use a Gray View as placeholder
    if (node.name.startsWith(IMAGE_TAG_PREFIX)) {
      properties.push({ name: 'background-color', value: 'gray' })
    }

    // FIXME: this workaround for Pressable should't be needed in the future
    if (node.name.startsWith(PRESSABLE_TAG_PREFIX)) {
      properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
    }
  }

  if (properties.length > 0) {
    let className = node.name

    if (isImageNode(node)) {
      if (node.name.startsWith(IMAGE_TAG_PREFIX)) {
        className = node.name.substring(IMAGE_TAG_PREFIX.length, node.name.length)
      }
      if (!node.name.endsWith(IMAGE_TAG_SUFFIX)) {
        className += IMAGE_TAG_SUFFIX
      }
    }

    if (node.type === 'TEXT' && !node.name.endsWith(TEXT_TAG_SUFFIX)) {
      className = node.name + TEXT_TAG_SUFFIX
    }

    if (node.name.startsWith(PRESSABLE_TAG_PREFIX)) {
      className = node.name.substring(PRESSABLE_TAG_PREFIX.length, node.name.length)
      if (!node.name.endsWith(PRESSABLE_TAG_SUFFIX)) {
        className += PRESSABLE_TAG_SUFFIX
      }
    }

    return {
      // name Text node as "Text" since name of text node is often the content of the node and is not appropriate as a name
      className,
      properties
    }
  }

  return { className: '', properties: [] }
}

function getBorderRadiusString(node: FrameNode | RectangleNode | ComponentNode | InstanceNode, unitType: UnitType) {
  if (node.cornerRadius !== 0) {
    if (typeof node.cornerRadius !== 'number') {
      return `${buildSizeStringByUnit(node.topLeftRadius, unitType)} ${buildSizeStringByUnit(node.topRightRadius, unitType)} ${buildSizeStringByUnit(
        node.bottomRightRadius,
        unitType
      )} ${buildSizeStringByUnit(node.bottomLeftRadius, unitType)}`
    }
    return `${buildSizeStringByUnit(node.cornerRadius, unitType)}`
  }
  return null
}

function getBoxShadowString(node: FrameNode | RectangleNode | ComponentNode | InstanceNode, unitType: UnitType) {
  if (node.effects.length > 0 && node.effects[0].type === 'DROP_SHADOW') {
    const dropShadowEffect = node.effects[0] as ShadowEffect

    let resultString = ''

    if (dropShadowEffect.offset) {
      resultString += `${buildSizeStringByUnit(dropShadowEffect.offset.x, unitType)} ${buildSizeStringByUnit(dropShadowEffect.offset.y, unitType)} `
    }
    if (dropShadowEffect.radius) {
      resultString += `${buildSizeStringByUnit(dropShadowEffect.radius, unitType)} `
    }
    if (dropShadowEffect.color) {
      resultString += buildColorString(dropShadowEffect)
    }
    return resultString
  }
  return null
}

function rgbValueToHex(value: number) {
  return Math.floor(value * 255)
    .toString(16)
    .padStart(2, '0')
}

function buildColorString(source: any) {
  const isSolidPaint = (source as Paint).type === 'SOLID'

  if (isSolidPaint) {
    const solidPaint = source as SolidPaint
    if (solidPaint.opacity !== undefined && solidPaint.opacity < 1) {
      return `rgba(${Math.floor(solidPaint.color.r * 255)}, ${Math.floor(solidPaint.color.g * 255)}, ${Math.floor(solidPaint.color.b * 255)}, ${Number(solidPaint.opacity).toFixed(
        2
      )})`
    }
    return `#${rgbValueToHex(solidPaint.color.r)}${rgbValueToHex(solidPaint.color.g)}${rgbValueToHex(solidPaint.color.b)}`
  }

  const isDropShadow = (source as ShadowEffect).type === 'DROP_SHADOW'
  if (isDropShadow) {
    const shadowEffect = source as ShadowEffect
    if (shadowEffect.color.a !== undefined && shadowEffect.color.a < 1) {
      return `rgba(${Math.floor(shadowEffect.color.r * 255)}, ${Math.floor(shadowEffect.color.g * 255)}, ${Math.floor(shadowEffect.color.b * 255)}, ${Number(
        shadowEffect.color.a
      ).toFixed(2)})`
    }
    return `#${rgbValueToHex(shadowEffect.color.r)}${rgbValueToHex(shadowEffect.color.g)}${rgbValueToHex(shadowEffect.color.b)}`
  }

  return ''
}
