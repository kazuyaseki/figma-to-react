import { DesignTokenType } from './DesignToken'

export const FigmaProperties = [
  { name: 'backgroundColor', type: DesignTokenType.Color }, // doesn't exist on Figma node, created by this plugin
  { name: 'height', type: DesignTokenType.Number },
  { name: 'itemSpacing', type: DesignTokenType.Number },
  { name: 'paddingBottom', type: DesignTokenType.Number },
  { name: 'paddingLeft', type: DesignTokenType.Number },
  { name: 'paddingRight', type: DesignTokenType.Number },
  { name: 'paddingTop', type: DesignTokenType.Number },
  { name: 'textStyle', type: DesignTokenType.Text }, // doesn't exist on Figma node, created by this plugin
  { name: 'width', type: DesignTokenType.Number }
]

export type FigmaProperty = {
  name: string
  type: DesignTokenType
}

// Custom properties that doesn't exist on Figma Node

export type CustomTextStyleProperty = {
  fontFamily: string
  fontSize: number
  fontWeight: string
  letterSpacing: number
  lineHeight: number
}

export function isCustomTextStyleProperty(object: any): object is CustomTextStyleProperty {
  return 'fontFamily' in object
}
