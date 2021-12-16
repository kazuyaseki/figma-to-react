export const COLOR_STYLES_GROUP_NAME = 'FigmaColors'
export const EFFECT_STYLES_GROUP_NAME = 'FigmaEffects'
export const GRID_STYLES_GROUP_NAME = 'FigmaGrids'
export const TEXT_STYLES_GROUP_NAME = 'FigmaTexts'

export function isFigmaStyleGroup(groupName: string) {
  const figmaStylesGroupNames = [COLOR_STYLES_GROUP_NAME, EFFECT_STYLES_GROUP_NAME, GRID_STYLES_GROUP_NAME, TEXT_STYLES_GROUP_NAME]
  return figmaStylesGroupNames.includes(groupName)
}
