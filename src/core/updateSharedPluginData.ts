import { messageTypes } from '../model/messagesTypes'
import { Store } from '../model/Store'

export const updateSharedPluginData = (parent: any, updatedData: Store) => {
  const { designTokens, designTokensCounter, designTokensGroups, designTokensGroupsCounter } = updatedData
  if (designTokens && designTokensCounter) {
    const designTokensString = JSON.stringify(designTokens)
    const designTokensMsg: messageTypes = { type: 'set-shared-plugin-data', key: 'designTokens', value: designTokensString }
    parent.postMessage({ pluginMessage: designTokensMsg }, '*')

    const designTokensCounterString = String(designTokensCounter)
    const designTokensCounterMsg: messageTypes = { type: 'set-shared-plugin-data', key: 'designTokensCounter', value: designTokensCounterString }
    parent.postMessage({ pluginMessage: designTokensCounterMsg }, '*')
  }

  if (designTokensGroups && designTokensGroupsCounter) {
    const designTokensGroupsString = JSON.stringify(designTokensGroups)
    const designTokensGroupsMsg: messageTypes = { type: 'set-shared-plugin-data', key: 'designTokensGroups', value: designTokensGroupsString }
    parent.postMessage({ pluginMessage: designTokensGroupsMsg }, '*')

    const designTokensGroupsCounterString = String(designTokensGroupsCounter)
    const designTokensGroupsCounterMsg: messageTypes = { type: 'set-shared-plugin-data', key: 'designTokensGroupsCounter', value: designTokensGroupsCounterString }
    parent.postMessage({ pluginMessage: designTokensGroupsCounterMsg }, '*')
  }
}
