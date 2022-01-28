import * as _ from 'lodash'
import { DesignToken } from '../model/DesignToken'
import { DesignTokenGroup } from '../model/DesignTokenGroup'
import { COLOR_STYLES_GROUP_NAME, TEXT_STYLES_GROUP_NAME } from '../model/FigmaStyleGroup'
import { getConvertedValue } from '../utils/unitTypeUtils'

type DesignTokensJson = {
  [key: string]: any
}

type RestyleThemeJs = {
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
      const designTokenValue = getConvertedValue(designToken.tokenValue)
      designTokensByGroupObject[designTokenName] = designTokenValue
    })
    designTokensObject[groupName] = designTokensByGroupObject
  })
  return designTokensObject
}

export const buildRestyleThemeObject = (designTokensJson: any) => {
  const themeObject: RestyleThemeJs = {}
  // Look for 'spacing', 'colors' and 'breakpoints' groups on design tokens and add them to the theme
  Object.keys(designTokensJson).map((groupKey) => {
    if (groupKey.toLowerCase() === 'spacing') {
      const spacingValues = designTokensJson && designTokensJson[groupKey as keyof unknown]
      if (!_.isEmpty(spacingValues)) {
        if (!themeObject['spacing']) {
          themeObject['spacing'] = {}
        }
        Object.keys(spacingValues).map((key) => {
          themeObject['spacing'][key] = `tokens.${groupKey}.${key}`
        })
      }
    } else if (groupKey.toLowerCase() === 'colors') {
      const colorsValues = designTokensJson && designTokensJson[groupKey as keyof unknown]
      if (!_.isEmpty(colorsValues)) {
        if (!themeObject['colors']) {
          themeObject['colors'] = {}
        }
        Object.keys(colorsValues).map((key) => {
          themeObject['colors'][key] = `tokens.${groupKey}.${key}`
        })
      }
    } else if (groupKey.toLowerCase() === 'breakpoints') {
      const breakpointsValues = designTokensJson && designTokensJson[groupKey as keyof unknown]
      if (!_.isEmpty(breakpointsValues)) {
        if (!themeObject['breakpoints']) {
          themeObject['breakpoints'] = {}
        }
        Object.keys(breakpointsValues).map((key) => {
          themeObject['breakpoints'][key] = `tokens.${groupKey}.${key}`
        })
      }
    }
  })
  // Get figma colors styles and add them to theme 'colors' key
  const figmaColors = designTokensJson[COLOR_STYLES_GROUP_NAME]
  if (!_.isEmpty(figmaColors)) {
    if (!themeObject['colors']) {
      themeObject['colors'] = {}
    }
    Object.keys(figmaColors).map((key) => {
      themeObject['colors'][key] = `tokens.${COLOR_STYLES_GROUP_NAME}.${key}`
    })
  }
  // Get figma texts styles and add them to theme 'textVariants' key
  const figmaTexts = designTokensJson[TEXT_STYLES_GROUP_NAME]
  if (!_.isEmpty(figmaTexts)) {
    if (!themeObject['textVariants']) {
      themeObject['textVariants'] = {}
    }
    Object.keys(figmaTexts).map((textVariantKey) => {
      const textVariantValue = figmaTexts && figmaTexts[textVariantKey as keyof unknown]
      if (!_.isEmpty(textVariantValue)) {
        themeObject['textVariants'][textVariantKey] = {}
        Object.keys(textVariantValue).map((key) => {
          if (
            key === 'fontFamily' ||
            key === 'fontSize' ||
            key === 'fontStyle' ||
            key === 'fontWeight' ||
            key === 'letterSpacing' ||
            key === 'lineHeight' ||
            key === 'textAlign' ||
            key === 'textDecorationLine' ||
            key === 'textDecorationStyle' ||
            key === 'textTransform'
          ) {
            themeObject['textVariants'][textVariantKey][key] = `tokens.${TEXT_STYLES_GROUP_NAME}.${textVariantKey}.${key}`
          }
        })
      }
    })
  }

  return themeObject
}
