import { STORAGE_KEYS } from './model/storageKeys'
import { messageTypes } from './model/messagesTypes'
import { UnitType } from './core/buildSizeStringByUnit'
import { modifyTreeForComponent } from './core/modifyTreeForComponent'
import { buildCode } from './core/buildCode'
import { buildTagTree } from './core/buildTagTree'
import { buildCssString, CssStyle } from './core/buildCssString'
import { UserComponentSetting } from './model/userComponentSetting'
import { TextCount } from './core/getCssDataForTag'
import { getUpdateableProperties, updateNode } from './core/updateFigma'
import { Store } from './model/Store'
import { updateColorsTokensFromFigmaStyles, updateEffectsTokensFromFigmaStyles, updateGridsTokensFromFigmaStyles, updateTextsTokensFromFigmaStyles } from './core/handleFigmaStyles'
import * as _ from 'lodash'

const figmaDocument = figma.root

let selectedNodes = figma.currentPage.selection

function init() {
  figma.showUI(__html__, { width: 640, height: 1080 })

  //  figmaDocument.setSharedPluginData('ftrn', 'properties', '[]')

  if (selectedNodes.length > 1) {
    figma.notify('Figma To React Native - Please select only 1 node')
    figma.closePlugin()
  } else {
    getProviderSettings().then((providerSettings) => {
      const sharedPluginData = getSharedPluginData()
      updateTokensFromFigmaStyles(sharedPluginData)
      figma.ui.postMessage({ providerSettings, nodeProperties: {}, sharedPluginData })
      if (selectedNodes.length === 1) {
        generate(selectedNodes[0], {})
      }
    })
  }
}

figma.ui.onmessage = (msg: messageTypes) => {
  if (msg.type === 'notify-copy-success') {
    figma.notify('Figma To React Native - Copied to Clipboard 👍')
  } else if (msg.type === 'new-css-style-set') {
    figma.clientStorage.setAsync(STORAGE_KEYS.CSS_STYLE_KEY, msg.cssStyle)
    generate(selectedNodes[0], { cssStyle: msg.cssStyle })
  } else if (msg.type === 'new-unit-type-set') {
    figma.clientStorage.setAsync(STORAGE_KEYS.UNIT_TYPE_KEY, msg.unitType)
    generate(selectedNodes[0], { unitType: msg.unitType })
  } else if (msg.type === 'update-user-component-settings') {
    figma.clientStorage.setAsync(STORAGE_KEYS.USER_COMPONENT_SETTINGS_KEY, msg.userComponentSettings)
    generate(selectedNodes[0], {})
  } else if (msg.type === 'update-node-properties') {
    figma.clientStorage.setAsync(STORAGE_KEYS.UPDATE_NODE_PROPERTIES_KEY, msg.nodeProperties)
    updateNode(selectedNodes[0], msg.nodeProperties)
  } else if (msg.type === 'set-shared-plugin-data') {
    if (msg.key === 'properties') {
      const currentProperties = JSON.parse(figmaDocument.getSharedPluginData('ftrn', 'properties'))
      const newProperties = JSON.parse(msg.value)
      const result = _.unionWith(newProperties, currentProperties, (first: any, second: any) => first.nodeId === second.nodeId && first.id === second.id)
      const newValue = JSON.stringify(result)
      figmaDocument.setSharedPluginData('ftrn', msg.key, newValue)
    } else {
      figmaDocument.setSharedPluginData('ftrn', msg.key, msg.value)
    }
  } else if (msg.type === 'store-provider-settings') {
    figma.clientStorage.setAsync(STORAGE_KEYS.PROVIDER_SETTINGS_KEY, msg.providerSettings)
    figma.notify('Figma to React Native - Provider Settings successfully stored')
  }
}

figma.on('selectionchange', () => {
  selectedNodes = figma.currentPage.selection
  if (selectedNodes.length > 1) {
    figma.notify('Figma to React Native - Please select only 1 node')
  } else if (selectedNodes.length === 0) {
    const sharedPluginData = getSharedPluginData()
    figma.ui.postMessage({ nodeProperties: {}, sharedPluginData })
  } else {
    generate(selectedNodes[0], {})
  }
})

async function generate(node: SceneNode, config: { cssStyle?: CssStyle; unitType?: UnitType }) {
  let cssStyle = config.cssStyle
  if (!cssStyle) {
    cssStyle = await figma.clientStorage.getAsync(STORAGE_KEYS.CSS_STYLE_KEY)

    if (!cssStyle) {
      cssStyle = 'css'
    }
  }

  let unitType = config.unitType
  if (!unitType) {
    unitType = await figma.clientStorage.getAsync(STORAGE_KEYS.UNIT_TYPE_KEY)

    if (!unitType) {
      unitType = 'px'
    }
  }

  const userComponentSettings: UserComponentSetting[] = (await figma.clientStorage.getAsync(STORAGE_KEYS.USER_COMPONENT_SETTINGS_KEY)) || []

  const textCount = new TextCount()

  const sharedPluginData = getSharedPluginData()

  const originalTagTree = buildTagTree(node, unitType, textCount)
  if (originalTagTree === null) {
    figma.notify('Please select a visible node')
    return
  }

  const tag = await modifyTreeForComponent(originalTagTree, figma)
  const generatedCodeStr = buildCode(tag, cssStyle)
  const cssString = buildCssString(tag, cssStyle, sharedPluginData)

  const updateableProperties = getUpdateableProperties(node)

  figma.ui.postMessage({ generatedCodeStr, cssString, cssStyle, unitType, userComponentSettings, nodeProperties: updateableProperties, sharedPluginData })
}

async function getProviderSettings() {
  const providerSettings = await figma.clientStorage.getAsync(STORAGE_KEYS.PROVIDER_SETTINGS_KEY)
  return providerSettings
}

function updateTokensFromFigmaStyles(sharedPluginData: Store) {
  updateTextsTokensFromFigmaStyles(sharedPluginData, figma.getLocalTextStyles())
  updateGridsTokensFromFigmaStyles(sharedPluginData, figma.getLocalGridStyles())
  updateEffectsTokensFromFigmaStyles(sharedPluginData, figma.getLocalEffectStyles())
  updateColorsTokensFromFigmaStyles(sharedPluginData, figma.getLocalPaintStyles())
}

function getSharedPluginData() {
  const designTokens = figmaDocument.getSharedPluginData('ftrn', 'designTokens')
  const designTokensCounter = figmaDocument.getSharedPluginData('ftrn', 'designTokensCounter')
  const designTokensGroups = figmaDocument.getSharedPluginData('ftrn', 'designTokensGroups')
  const designTokensGroupsCounter = figmaDocument.getSharedPluginData('ftrn', 'designTokensGroupsCounter')
  const properties = figmaDocument.getSharedPluginData('ftrn', 'properties')

  console.log('getSharedPluginData properties')
  console.log(properties)

  const sharedPluginData: Store = {
    designTokens: designTokens ? JSON.parse(designTokens) : [],
    designTokensCounter: Number(designTokensCounter),
    designTokensGroups: designTokensGroups ? JSON.parse(designTokensGroups) : [],
    designTokensGroupsCounter: Number(designTokensGroupsCounter),
    properties: properties ? JSON.parse(properties) : []
  }

  return sharedPluginData
}

// Load Plugin
init()
