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
import { loadDefaultSettings } from './model/Settings'

const figmaDocument = figma.root

let selectedNodes = figma.currentPage.selection

function init() {
  const sharedPluginData = getSharedPluginData()
  updateNodes(sharedPluginData)

  figma.showUI(__html__, { width: 640, height: 1080 })

  if (selectedNodes.length > 1) {
    figma.notify('Figma To React Native - Please select only 1 node')
    figma.closePlugin()
  } else {
    getSettings().then((settings) => {
      updateTokensFromFigmaStyles(sharedPluginData, settings)
    })
    getProviderSettings().then((providerSettings) => {
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
  } else if (msg.type === 'update-settings') {
    figma.clientStorage.setAsync(STORAGE_KEYS.UPDATE_SETTINGS_KEY, msg.settings)
    figma.ui.postMessage({ nodeProperties: {}, settings: msg.settings })
  } else if (msg.type === 'update-all-linked-properties') {
    figma.clientStorage.setAsync(STORAGE_KEYS.UPDATE_ALL_LINKED_PROPERTIES_KEY, msg.linkedProperties)
    updateAllLinkedProperties(msg.linkedProperties)
  } else if (msg.type === 'update-node-properties') {
    const nodeProperties = msg.nodeProperties
    figma.clientStorage.setAsync(STORAGE_KEYS.UPDATE_NODE_PROPERTIES_KEY, nodeProperties)
    updateNode(selectedNodes[0], nodeProperties)
  } else if (msg.type === 'set-shared-plugin-data') {
    if (msg.key === 'properties') {
      const sharedPluginDataProperties = figmaDocument.getSharedPluginData('ftrn', 'properties')
      const currentProperties = _.isEmpty(sharedPluginDataProperties) ? [] : JSON.parse(sharedPluginDataProperties)
      const newProperties = JSON.parse(msg.value)

      if (_.isObject(newProperties[0].value)) {
        const property = newProperties[0]
        const figmaStyleId = property.value.styleId
        if (figmaStyleId) {
          const figmaStyle = figma.getStyleById(figmaStyleId)
          const figmaStyleName = figmaStyle?.name

          if (figmaStyleName) {
            const propertiesByNodeId = currentProperties.filter((currentProperty: any) => currentProperty.nodeId === property.nodeId)
            const propertyByName = propertiesByNodeId.find((currentProperty: any) => currentProperty.id === property.id)
            if (propertyByName) {
              propertyByName['linkedToken'] = figmaStyleName
              newProperties[0] = { ...propertyByName }
            }
            /* TODO: MAYBE NOT NEEDED add figma style to design tokens if it doesn't exist there 
            const sharedPluginDataTokens = figmaDocument.getSharedPluginData('ftrn', 'designTokens')
            const currentDesignTokens: [] = _.isEmpty(sharedPluginDataTokens) ? [] : JSON.parse(sharedPluginDataTokens)
            const tokenByName = currentDesignTokens.find((designToken: any) => designToken.tokenName === figmaStyleName && designToken.tokenGroup === COLOR_STYLES_GROUP_NAME)
            if (!tokenByName) {
              const sharedPluginDataTokensCounter = figmaDocument.getSharedPluginData('ftrn', 'designTokensCounter')
              const currentDesignTokensCounter = Number(sharedPluginDataTokensCounter)
              const newToken = { id: currentDesignTokensCounter + 1, tokenName: figmaStyleName, tokenValue: ?, tokenGroup: COLOR_STYLES_GROUP_NAME}
              // setSharedPluginData
            }
            */
          }
        }
      }

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
    updateNodes(sharedPluginData)
    // FIXME: might be needed    updateTokensFromFigmaStyles(sharedPluginData)
    figma.ui.postMessage({ nodeProperties: {}, sharedPluginData })
  } else {
    generate(selectedNodes[0], {})
  }
})

async function generate(node: SceneNode, config: { cssStyle?: CssStyle; unitType?: UnitType }) {
  if (!node) {
    return
  }
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

  updateNodes(sharedPluginData)
  // FIXME: might be needed updateTokensFromFigmaStyles(sharedPluginData)

  const originalTagTree = buildTagTree(node, unitType, textCount, cssStyle, sharedPluginData)

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

async function getSettings() {
  const settings = await figma.clientStorage.getAsync(STORAGE_KEYS.UPDATE_SETTINGS_KEY)
  return settings
}

async function getProviderSettings() {
  const providerSettings = await figma.clientStorage.getAsync(STORAGE_KEYS.PROVIDER_SETTINGS_KEY)
  return providerSettings
}

function updateAllLinkedProperties(linkedProperties: any) {
  for (let index = 0; index < linkedProperties.length; index++) {
    const figmaNodes = figmaDocument.findAll((node) => node.name === linkedProperties[index].nodeName)
    figmaNodes.forEach((node: PageNode | SceneNode) => {
      const figmaNodePage = getNodePage(node)
      if (figmaNodePage.name === linkedProperties[index].nodePage && node.type !== 'PAGE') {
        const propertyName = linkedProperties[index]['propertyName']
        const newPropertyObject: any = {}
        newPropertyObject[propertyName] = linkedProperties[index].propertyValue
        updateNode(node, newPropertyObject)
      }
    })
  }
}

function updateNodes(sharedPluginData: Store) {
  const properties = sharedPluginData.properties
  const nodesInfos: any = []
  properties?.forEach((property: any) => {
    const figmaNode = figmaDocument.findOne((node) => node.id === property.nodeId)
    if (figmaNode) {
      const figmaNodePage = getNodePage(figmaNode)
      const index = nodesInfos.findIndex((currentNode: any) => currentNode.id === property.nodeId)
      const nodeInfo = {
        id: figmaNode.id,
        name: figmaNode.name,
        page: figmaNodePage.name,
        type: figmaNode.type
      }
      if (index === -1) {
        nodesInfos.push(nodeInfo)
      } else {
        nodesInfos[index] = nodeInfo
      }
    }
  })
  sharedPluginData.nodes = nodesInfos
}

async function updateTokensFromFigmaStyles(sharedPluginData: Store, settings?: any) {
  figma.skipInvisibleInstanceChildren = true

  const effectStyles = figma.getLocalEffectStyles()
  const gridStyles = figma.getLocalGridStyles()
  const paintStyles = figma.getLocalPaintStyles()
  const textStyles = figma.getLocalTextStyles()

  const initialTimestamp = Date.now()
  const nodes = figmaDocument.findAllWithCriteria({
    types: ['COMPONENT', 'COMPONENT_SET', 'FRAME', 'INSTANCE', 'TEXT']
  })

  let clientStorageSettings = settings
  if (_.isEmpty(clientStorageSettings)) {
    clientStorageSettings = loadDefaultSettings()
  }

  nodes.forEach((node: ComponentNode | ComponentSetNode | FrameNode | InstanceNode | TextNode) => {
    // TODO: also need to add external grid styles
    const effectStyleId = node.effectStyleId as string
    const fillStyleId = node.fillStyleId as string
    if (!_.isEmpty(effectStyleId)) {
      const effectStyleById = figma.getStyleById(effectStyleId) as EffectStyle
      const effectStyleByIdName = settings.camelCase ? _.camelCase(effectStyleById.name) : effectStyleById.name
      const currentEffectStyle = effectStyles.find((effectStyle) => effectStyle.id === node.effectStyleId || effectStyle.name === effectStyleByIdName)
      if (!currentEffectStyle) {
        effectStyles.push(effectStyleById)
      }
    }
    if (!_.isEmpty(fillStyleId)) {
      const paintStyleById = figma.getStyleById(fillStyleId) as PaintStyle
      const paintStyleByIdName = settings.camelCase ? _.camelCase(paintStyleById.name) : paintStyleById.name
      const currentPaintStyle = paintStyles.find((paintStyle) => paintStyle.id === node.fillStyleId || paintStyle.name === paintStyleByIdName)
      if (!currentPaintStyle) {
        paintStyles.push(paintStyleById)
      }
    }
    if (node.type === 'TEXT') {
      const textStyleId = node.textStyleId as string
      if (!_.isEmpty(textStyleId)) {
        const textStyleById = figma.getStyleById(textStyleId) as TextStyle
        const textStyleByIdName = settings.camelCase ? _.camelCase(textStyleById.name) : textStyleById.name
        const currentTextStyle = textStyles.find((textStyle) => textStyle.id === node.textStyleId || textStyle.name === textStyleByIdName)
        if (!currentTextStyle) {
          textStyles.push(textStyleById)
        }
      }
    }
  })

  updateEffectsTokensFromFigmaStyles(sharedPluginData, effectStyles, clientStorageSettings)
  updateGridsTokensFromFigmaStyles(sharedPluginData, gridStyles, clientStorageSettings)
  updateColorsTokensFromFigmaStyles(sharedPluginData, paintStyles, clientStorageSettings)
  updateTextsTokensFromFigmaStyles(sharedPluginData, textStyles, clientStorageSettings)

  figma.skipInvisibleInstanceChildren = false

  const finalTimestamp = Date.now()
  const timeDifference = finalTimestamp - initialTimestamp

  console.log('updateTokensFromFigmaStyles init time (in milisseconds): ' + timeDifference)
}

function getNodePage(node: any) {
  while (node && node.type !== 'PAGE') {
    node = node.parent
  }
  return node
}

function getSharedPluginData() {
  const designTokens = figmaDocument.getSharedPluginData('ftrn', 'designTokens')
  const designTokensCounter = figmaDocument.getSharedPluginData('ftrn', 'designTokensCounter')
  const designTokensGroups = figmaDocument.getSharedPluginData('ftrn', 'designTokensGroups')
  const designTokensGroupsCounter = figmaDocument.getSharedPluginData('ftrn', 'designTokensGroupsCounter')
  const nodes = figmaDocument.getSharedPluginData('ftrn', 'nodes')
  const properties = figmaDocument.getSharedPluginData('ftrn', 'properties')

  const sharedPluginData: Store = {
    designTokens: designTokens ? JSON.parse(designTokens) : [],
    designTokensCounter: Number(designTokensCounter),
    designTokensGroups: designTokensGroups ? JSON.parse(designTokensGroups) : [],
    designTokensGroupsCounter: Number(designTokensGroupsCounter),
    nodes: nodes ? JSON.parse(nodes) : [],
    properties: properties ? JSON.parse(properties) : []
  }

  return sharedPluginData
}

// Check Menu option
if (figma.command === 'open') {
  init()
} else if (figma.command === 'erase') {
  // Clear everything
  figmaDocument.setSharedPluginData('ftrn', 'designTokensCounter', '0')
  figmaDocument.setSharedPluginData('ftrn', 'designTokensGroupsCounter', '0')
  figmaDocument.setSharedPluginData('ftrn', 'designTokens', '')
  figmaDocument.setSharedPluginData('ftrn', 'designTokensGroups', '')
  figmaDocument.setSharedPluginData('ftrn', 'nodes', '')
  figmaDocument.setSharedPluginData('ftrn', 'properties', '')
  figma.notify('Figma to React Native - Document Data successfully erased')
  figma.closePlugin()
}
