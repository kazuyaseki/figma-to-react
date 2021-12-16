import { DesignToken } from '../model/DesignToken'
import { DesignTokenGroup } from '../model/DesignTokenGroup'

type DesignTokensJson = {
  [key: string]: any
}

export const buildDesignTokensJson = (designTokens: DesignToken[], designTokensGroups: DesignTokenGroup[], getDesignTokensByGroup: any) => {
  const designTokensObject: DesignTokensJson = {}
  designTokensGroups.forEach((designTokenGroup: DesignTokenGroup) => {
    const groupName = designTokenGroup.groupName
    const designTokensByGroup = getDesignTokensByGroup(groupName)
    const designTokensByGroupObject: DesignTokensJson = {}
    designTokensByGroup.forEach((designToken: DesignToken) => {
      const designTokenName = designToken.tokenName
      const designTokenValue = designToken.tokenValue
      designTokensByGroupObject[designTokenName] = designTokenValue
    })
    designTokensObject[groupName] = designTokensByGroupObject
  })
  return designTokensObject
}
