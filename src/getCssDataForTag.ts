import { buildSizeStringByUnit, UnitType } from './buildSizeStringByUnit'
import { isImageNode } from './utils/isImageNode'

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

const justifyContentCssValues = {
  MIN: 'flex-start',
  MAX: 'flex-end',
  CENTER: 'center',
  SPACE_BETWEEN: 'space-between'
}

const alignItemsCssValues = {
  MIN: 'flex-start',
  MAX: 'flex-end',
  CENTER: 'center',
  BASELINE: 'center'
}

const textAlignCssValues = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  JUSTIFIED: 'justify'
}

const textVerticalAlignCssValues = {
  TOP: 'top',
  CENTER: 'middle',
  BOTTOM: 'bottom'
}

const textDecorationCssValues = {
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'line-through'
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

      if (node.layoutMode !== 'NONE') {
        properties.push({ name: 'display', value: 'flex' })
        properties.push({ name: 'flex-direction', value: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column' })
        properties.push({ name: 'justify-content', value: justifyContentCssValues[node.primaryAxisAlignItems] })
        properties.push({ name: 'align-items', value: alignItemsCssValues[node.counterAxisAlignItems] })

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

        if (node.primaryAxisAlignItems !== 'SPACE_BETWEEN' && node.itemSpacing > 0) {
          properties.push({ name: 'gap', value: buildSizeStringByUnit(node.itemSpacing, unitType) })
        }
      } else {
        properties.push({ name: 'height', value: Math.floor(node.height) + 'px' })
        properties.push({ name: 'width', value: Math.floor(node.width) + 'px' })
      }

      if ((node.fills as Paint[]).length > 0 && (node.fills as Paint[])[0].type !== 'IMAGE') {
        const paint = (node.fills as Paint[])[0]
        if (typeof node.fillStyleId === 'string') {
          const style = figma.getStyleById(node.fillStyleId)
          properties.push({ name: 'background-color', value: `$${style?.name.split('/').join('-').split(' ').join('-').toLowerCase()}` })
        } else {
          properties.push({ name: 'background-color', value: buildColorString(paint) })
        }
      }

      if ((node.strokes as Paint[]).length > 0) {
        const paint = (node.strokes as Paint[])[0]

        if (typeof node.strokeStyleId === 'string') {
          const style = figma.getStyleById(node.strokeStyleId)
          properties.push({
            name: 'border',
            value: `${buildSizeStringByUnit(node.strokeWeight, unitType)} solid ${`$${style?.name.split('/').join('-').split(' ').join('-').toLowerCase()}`}`
          })
        } else {
          properties.push({ name: 'border', value: `${buildSizeStringByUnit(node.strokeWeight, unitType)} solid ${buildColorString(paint)}` })
        }
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
      properties.push({ name: 'text-align', value: textAlignCssValues[node.textAlignHorizontal] })
      properties.push({ name: 'vertical-align', value: textVerticalAlignCssValues[node.textAlignVertical] })

      if (node.textStyleId && typeof node.textStyleId === 'string') {
        const style = figma.getStyleById(node.textStyleId)
        properties.push({
          name: 'typography',
          value: `$${style?.name.split('/').join('-').split(' ').join('-').toLowerCase()}`
        })
      } else {
        properties.push({ name: 'font-size', value: `${node.fontSize as number}px` })
        properties.push({ name: 'font-family', value: (node.fontName as FontName).family })

        const letterSpacing = node.letterSpacing as LetterSpacing
        if (letterSpacing.value !== 0) {
          properties.push({ name: 'letter-spacing', value: letterSpacing.unit === 'PIXELS' ? buildSizeStringByUnit(letterSpacing.value, unitType) : letterSpacing.value + '%' })
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
      }

      if (node.textDecoration === 'STRIKETHROUGH' || node.textDecoration === 'UNDERLINE') {
        properties.push({ name: 'text-decoration', value: textDecorationCssValues[node.textDecoration] })
      }
      if ((node.fills as Paint[]).length > 0) {
        if (typeof node.fillStyleId === 'string') {
          const style = figma.getStyleById(node.fillStyleId)
          properties.push({ name: 'color', value: `$${style?.name.split('/').join('-').split(' ').join('-').toLowerCase()}` })
        } else {
          const paint = (node.fills as Paint[])[0]
          properties.push({ name: 'color', value: buildColorString(paint) })
        }
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
  }

  if (properties.length > 0) {
    let className = node.name

    if (isImageNode(node)) {
      className = 'img' + textCount.count
      textCount.increment()
    }

    if (node.type === 'TEXT') {
      className = 'text' + textCount.count
      textCount.increment()
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

function rgbValueToHex(value: number) {
  return Math.floor(value * 255)
    .toString(16)
    .padStart(2, '0')
}

function buildColorString(paint: Paint) {
  if (paint.type === 'SOLID') {
    if (paint.opacity !== undefined && paint.opacity < 1) {
      return `rgba(${Math.floor(paint.color.r * 255)}, ${Math.floor(paint.color.g * 255)}, ${Math.floor(paint.color.b * 255)}, ${paint.opacity})`
    }
    return `#${rgbValueToHex(paint.color.r)}${rgbValueToHex(paint.color.g)}${rgbValueToHex(paint.color.b)}`
  }

  return ''
}
