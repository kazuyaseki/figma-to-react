export type DesignToken = {
  id: any
  tokenName: string
  tokenValue: any
  tokenGroup?: string
  type?: DesignTokenType
}

export enum DesignTokenType {
  Color,
  Text,
  Grid,
  Effect,
  Number
}
