import { isString, trim } from 'lodash'
import { buildSizeStringByUnit, UnitType } from '../core/buildSizeStringByUnit'

export function getConvertedValue(value: string) {
  if (isNotANumber(value)) {
    return value
  }
  return Number(value)
}

export function isDarkColor(rgb: number[]) {
  const brightness = Math.round((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000)
  if (brightness > 125) {
    return false
  }
  return true
}

export function isHex(value: any) {
  if (isString(value)) {
    const hexValueToEvaluate = value.length > 7 ? value.substring(0, 7) : value
    const reg = /^#[0-9A-F]{6}$/i
    return reg.test(hexValueToEvaluate)
  }
  return false
}

export function isNotANumber(value: string) {
  if (isNaN(+value)) {
    return true
  }
  return false
}

export function rgbValueToHex(value: number) {
  return Math.floor(value * 255)
    .toString(16)
    .padStart(2, '0')
}

export function rgbaToHex(rgba: string) {
  const inParts = rgba.substring(rgba.indexOf('(')).split(','),
    r = parseInt(trim(inParts[0].substring(1)), 10),
    g = parseInt(trim(inParts[1]), 10),
    b = parseInt(trim(inParts[2]), 10),
    a: any = parseFloat(trim(inParts[3].substring(0, inParts[3].length - 1))).toFixed(2)
  const outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2)
  ]

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = '0' + part
    }
  })

  return '#' + outParts.join('')
}

export function hexToRgb(hex: string) {
  let hexMax6Digits = hex
  if (hex.length > 7) {
    hexMax6Digits = hex.substring(0, 7)
  }

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hexMax6Digits = hexMax6Digits.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexMax6Digits)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

export function getBorderRadiusString(node: FrameNode | RectangleNode | ComponentNode | InstanceNode, unitType: UnitType) {
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

export function getBoxShadowString(node: FrameNode | RectangleNode | ComponentNode | InstanceNode, unitType: UnitType) {
  if (node.effects.length > 0 && node.effects[0].type === 'DROP_SHADOW') {
    const dropShadowEffect = node.effects[0]

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

export function buildColorString(source: any) {
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

  const isDropShadow = source.type === 'DROP_SHADOW'
  if (isDropShadow) {
    const shadowEffect = source
    if (shadowEffect.color.a !== undefined && shadowEffect.color.a < 1) {
      return `rgba(${Math.floor(shadowEffect.color.r * 255)}, ${Math.floor(shadowEffect.color.g * 255)}, ${Math.floor(shadowEffect.color.b * 255)}, ${Number(
        shadowEffect.color.a
      ).toFixed(2)})`
    }
    return `#${rgbValueToHex(shadowEffect.color.r)}${rgbValueToHex(shadowEffect.color.g)}${rgbValueToHex(shadowEffect.color.b)}`
  }

  return ''
}
