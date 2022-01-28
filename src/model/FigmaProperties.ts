import { DesignTokenType } from './DesignToken'

export type FigmaProperty = {
  name: string
  type: DesignTokenType
}

export const FigmaProperties = [
  { name: 'backgroundColor', type: DesignTokenType.Color }, // doesn't exist on Figma, created by this plugin
  { name: 'height', type: DesignTokenType.Number },
  { name: 'itemSpacing', type: DesignTokenType.Number },
  { name: 'paddingBottom', type: DesignTokenType.Number },
  { name: 'paddingLeft', type: DesignTokenType.Number },
  { name: 'paddingRight', type: DesignTokenType.Number },
  { name: 'paddingTop', type: DesignTokenType.Number },
  { name: 'width', type: DesignTokenType.Number }
]
