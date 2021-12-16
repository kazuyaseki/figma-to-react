import { trim } from 'lodash'

export function getConvertedValue(value: string) {
  if (isNotANumber(value)) {
    return value
  }
  return Number(value)
}

export function isNotANumber(value: string) {
  if (isNaN(+value)) {
    return true
  }
  return false
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
