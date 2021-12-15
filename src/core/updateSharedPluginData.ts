import { messageTypes } from '../model/messagesTypes'

export const updateSharedPluginData = (parent: any, designTokens?: any, designTokensCounter?: any) => {
  if (designTokens && designTokensCounter) {
    const designTokensString = JSON.stringify(designTokens)
    const designTokensMsg: messageTypes = { type: 'set-shared-plugin-data', key: 'designTokens', value: designTokensString }
    parent.postMessage({ pluginMessage: designTokensMsg }, '*')

    const designTokensCounterString = String(designTokensCounter)
    const designTokensCounterMsg: messageTypes = { type: 'set-shared-plugin-data', key: 'designTokensCounter', value: designTokensCounterString }
    parent.postMessage({ pluginMessage: designTokensCounterMsg }, '*')
  }
}
