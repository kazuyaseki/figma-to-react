import { IMAGE_TAG_PREFIX, PRESSABLE_TAG_PREFIX, SCROLLVIEW_TAG_PREFIX, TEXT_TAG_PREFIX } from '../utils/constants'
import { COLOR_STYLES_GROUP_NAME, EFFECT_STYLES_GROUP_NAME, GRID_STYLES_GROUP_NAME, TEXT_STYLES_GROUP_NAME } from './FigmaStyleGroup'

export function getDefaultSettings() {
  return {
    camelCase: true,
    codeButtonPrefix: PRESSABLE_TAG_PREFIX,
    codeImagePrefix: IMAGE_TAG_PREFIX,
    codeScrollablePrefix: SCROLLVIEW_TAG_PREFIX,
    codeTextPrefix: TEXT_TAG_PREFIX,
    figmaColorsGroupName: COLOR_STYLES_GROUP_NAME,
    figmaEffectsGroupName: EFFECT_STYLES_GROUP_NAME,
    figmaGridsGroupName: GRID_STYLES_GROUP_NAME,
    figmaTextsGroupName: TEXT_STYLES_GROUP_NAME
  }
}
