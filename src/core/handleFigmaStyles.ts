import { DesignToken } from '../model/DesignToken'
import { DesignTokenGroup } from '../model/DesignTokenGroup'
import { COLOR_STYLES_GROUP_NAME, EFFECT_STYLES_GROUP_NAME, GRID_STYLES_GROUP_NAME, TEXT_STYLES_GROUP_NAME } from '../model/FigmaStyleGroup'
import { Store } from '../model/Store'
import { rgbaToHex } from '../utils/unitTypeUtils'

export function updateColorsTokensFromFigmaStyles(sharedPluginData: Store, localPaintStyles: PaintStyle[]) {
  if (localPaintStyles.length > 0) {
    const figmaColorsGroup = sharedPluginData.designTokensGroups?.find((designTokenGroup: DesignTokenGroup) => designTokenGroup.groupName === COLOR_STYLES_GROUP_NAME)

    if (!figmaColorsGroup && sharedPluginData.designTokensGroupsCounter !== undefined) {
      // Add new group
      sharedPluginData.designTokensGroups?.unshift({ id: sharedPluginData.designTokensGroupsCounter, groupName: COLOR_STYLES_GROUP_NAME })
      sharedPluginData.designTokensGroupsCounter += 1
    }

    localPaintStyles.forEach((paintStyle: PaintStyle) => {
      const colorId = paintStyle.id
      const colorName = paintStyle.name
      const paintsArray = paintStyle.paints
      if (paintsArray.length > 0) {
        const paint = paintsArray[0]
        if (paint.type === 'SOLID') {
          const redValue = Math.floor(paint.color.r * 255)
          const greenValue = Math.floor(paint.color.g * 255)
          const blueValue = Math.floor(paint.color.b * 255)
          const opacityValue = paint.opacity?.toFixed(2) || 1.0

          const figmaColorDesignToken = sharedPluginData.designTokens?.find(
            (designToken: DesignToken) => designToken.tokenGroup === COLOR_STYLES_GROUP_NAME && designToken.id === colorId
          )

          const rgbaString = `rgba(${redValue}, ${greenValue}, ${blueValue}, ${opacityValue})`

          if (figmaColorDesignToken) {
            figmaColorDesignToken.tokenName = colorName
            figmaColorDesignToken.tokenValue = rgbaToHex(rgbaString).toUpperCase()
          } else {
            // Add new Figma Color
            sharedPluginData.designTokens?.unshift({
              id: colorId,
              tokenName: colorName,
              tokenValue: rgbaToHex(rgbaString).toUpperCase(),
              tokenGroup: COLOR_STYLES_GROUP_NAME
            })
            if (sharedPluginData.designTokensCounter !== undefined) {
              sharedPluginData.designTokensCounter += 1
            }
          }
        }
      }
    })
  }
}

export function updateEffectsTokensFromFigmaStyles(sharedPluginData: Store, localEffectStyles: EffectStyle[]) {
  if (localEffectStyles.length > 0) {
    const figmaEffectsGroup = sharedPluginData.designTokensGroups?.find((designTokenGroup: DesignTokenGroup) => designTokenGroup.groupName === EFFECT_STYLES_GROUP_NAME)

    if (!figmaEffectsGroup && sharedPluginData.designTokensGroupsCounter !== undefined) {
      // Add new group
      sharedPluginData.designTokensGroups?.unshift({ id: sharedPluginData.designTokensGroupsCounter, groupName: EFFECT_STYLES_GROUP_NAME })
      sharedPluginData.designTokensGroupsCounter += 1
    }

    localEffectStyles.forEach((effectStyle: EffectStyle) => {
      const effectId = effectStyle.id
      const effectName = effectStyle.name
      const effectsArray = effectStyle.effects
      if (effectsArray.length > 0) {
        const effect = effectsArray[0]
        if (effect.type === 'DROP_SHADOW') {
          let effectValue: any = {
            offset: effect.offset,
            radius: effect.radius
          }

          if (effect.color) {
            const redValue = Math.floor(effect.color.r * 255)
            const greenValue = Math.floor(effect.color.g * 255)
            const blueValue = Math.floor(effect.color.b * 255)
            const opacityValue = effect.color.a.toFixed(2) || 1.0
            const rgbaString = `rgba(${redValue}, ${greenValue}, ${blueValue}, ${opacityValue})`
            const effectColor = rgbaToHex(rgbaString).toUpperCase()
            effectValue = { ...effectValue, color: effectColor }
          }

          const figmaEffectDesignToken = sharedPluginData.designTokens?.find(
            (designToken: DesignToken) => designToken.tokenGroup === EFFECT_STYLES_GROUP_NAME && designToken.id === effectId
          )

          if (figmaEffectDesignToken) {
            figmaEffectDesignToken.tokenName = effectName
            figmaEffectDesignToken.tokenValue = effectValue
          } else {
            // Add new Figma Effect
            sharedPluginData.designTokens?.unshift({
              id: effectId,
              tokenName: effectName,
              tokenValue: effectValue,
              tokenGroup: EFFECT_STYLES_GROUP_NAME
            })
            if (sharedPluginData.designTokensCounter !== undefined) {
              sharedPluginData.designTokensCounter += 1
            }
          }
        }
      }
    })
  }
}

export function updateGridsTokensFromFigmaStyles(sharedPluginData: Store, localGridStyles: GridStyle[]) {
  if (localGridStyles.length > 0) {
    const figmaGridsGroup = sharedPluginData.designTokensGroups?.find((designTokenGroup: DesignTokenGroup) => designTokenGroup.groupName === GRID_STYLES_GROUP_NAME)

    if (!figmaGridsGroup && sharedPluginData.designTokensGroupsCounter !== undefined) {
      // Add new group
      sharedPluginData.designTokensGroups?.unshift({ id: sharedPluginData.designTokensGroupsCounter, groupName: GRID_STYLES_GROUP_NAME })
      sharedPluginData.designTokensGroupsCounter += 1
    }

    localGridStyles.forEach((gridStyle: GridStyle) => {
      const gridId = gridStyle.id
      const gridName = gridStyle.name
      const layoutGridsArray = gridStyle.layoutGrids
      if (layoutGridsArray.length > 0) {
        const grid = layoutGridsArray[0]
        if (grid.pattern === 'COLUMNS') {
          const gridValue: any = {
            alignment: grid.alignment,
            count: grid.count,
            gutterSize: grid.gutterSize,
            pattern: grid.pattern
          }

          const figmaGridDesignToken = sharedPluginData.designTokens?.find(
            (designToken: DesignToken) => designToken.tokenGroup === GRID_STYLES_GROUP_NAME && designToken.id === gridId
          )

          if (figmaGridDesignToken) {
            figmaGridDesignToken.tokenName = gridName
            figmaGridDesignToken.tokenValue = gridValue
          } else {
            // Add new Figma Grid
            sharedPluginData.designTokens?.unshift({
              id: gridId,
              tokenName: gridName,
              tokenValue: gridValue,
              tokenGroup: GRID_STYLES_GROUP_NAME
            })
            if (sharedPluginData.designTokensCounter !== undefined) {
              sharedPluginData.designTokensCounter += 1
            }
          }
        }
      }
    })
  }
}

export function updateTextsTokensFromFigmaStyles(sharedPluginData: Store, localTextStyles: TextStyle[]) {
  if (localTextStyles.length > 0) {
    const figmaTextsGroup = sharedPluginData.designTokensGroups?.find((designTokenGroup: DesignTokenGroup) => designTokenGroup.groupName === TEXT_STYLES_GROUP_NAME)

    if (!figmaTextsGroup && sharedPluginData.designTokensGroupsCounter) {
      // Add new group
      sharedPluginData.designTokensGroups?.unshift({ id: sharedPluginData.designTokensGroupsCounter, groupName: TEXT_STYLES_GROUP_NAME })
      sharedPluginData.designTokensGroupsCounter += 1
    }

    localTextStyles.forEach((textStyle: TextStyle) => {
      const textId = textStyle.id
      const textName = textStyle.name

      const textValue = {
        fontFamily: textStyle.fontName.family,
        fontWeight: textStyle.fontName.style,
        fontSize: textStyle.fontSize
      }

      const figmaTextDesignToken = sharedPluginData.designTokens?.find((designToken: DesignToken) => designToken.tokenGroup === TEXT_STYLES_GROUP_NAME && designToken.id === textId)

      if (figmaTextDesignToken) {
        figmaTextDesignToken.tokenName = textName
        figmaTextDesignToken.tokenValue = textValue
      } else {
        // Add new Figma Text Design Tokens
        sharedPluginData.designTokens?.unshift({
          id: textId,
          tokenName: textName,
          tokenValue: textValue,
          tokenGroup: TEXT_STYLES_GROUP_NAME
        })
        if (sharedPluginData.designTokensCounter !== undefined) {
          sharedPluginData.designTokensCounter += 1
        }
      }
    })
  }
}
