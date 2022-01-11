import { DesignToken } from './DesignToken'
import { DesignTokenGroup } from './DesignTokenGroup'

export type Store = {
  designTokens?: DesignToken[]
  designTokensCounter?: number
  designTokensGroups?: DesignTokenGroup[]
  designTokensGroupsCounter?: number
  nodes?: any[]
  properties?: any[]
}
