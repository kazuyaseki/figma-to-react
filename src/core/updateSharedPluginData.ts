import * as _ from 'lodash'
import { messageTypes } from '../model/messagesTypes'
import { Store } from '../model/Store'

export const updateSharedPluginData = (parent: any, updatedData: Store) => {
  console.log('updateSharedPluginData()')
  console.log(updatedData)

  const { designTokens, designTokensCounter, designTokensGroups, designTokensGroupsCounter, nodes, properties } = updatedData

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

  if (!_.isEmpty(nodes)) {
    const nodesString = JSON.stringify(nodes)
    const nodesMsg: messageTypes = { type: 'set-shared-plugin-data', key: 'nodes', value: nodesString }
    parent.postMessage({ pluginMessage: nodesMsg }, '*')
  }

  if (!_.isEmpty(properties)) {
    const propertiesString = JSON.stringify(properties)
    const propertiesMsg: messageTypes = { type: 'set-shared-plugin-data', key: 'properties', value: propertiesString }
    parent.postMessage({ pluginMessage: propertiesMsg }, '*')
  }
}
