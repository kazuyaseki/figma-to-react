import * as _ from 'lodash'
import { getConvertedValue } from '../utils/unitTypeUtils'

export function getUpdateableProperties(node: SceneNode) {
  let updateableProperties = {
    id: node.id,
    name: node.name,
    height: node.height,
    width: node.width
  }

  if (node.type === 'TEXT') {
    if ((node.fills as Paint[]).length > 0 && (node.fills as Paint[])[0].type !== 'IMAGE') {
      const paint = (node.fills as Paint[])[0]
      const styleId = node.fillStyleId
      const colorProperties = {
        color: _.isEmpty(styleId) ? paint : { ...paint, styleId }
      }
      updateableProperties = { ...updateableProperties, ...colorProperties }
    }
  } else if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET' || node.type === 'INSTANCE') {
    if ((node.fills as Paint[]).length > 0 && (node.fills as Paint[])[0].type !== 'IMAGE') {
      const paint = (node.fills as Paint[])[0]
      const styleId = node.fillStyleId
      const colorProperties = {
        backgroundColor: _.isEmpty(styleId) ? paint : { ...paint, styleId }
      }
      updateableProperties = { ...updateableProperties, ...colorProperties }
    }
    if (node.layoutMode !== 'NONE') {
      const layoutProperties = {
        itemSpacing: node.itemSpacing,
        paddingBottom: node.paddingBottom,
        paddingLeft: node.paddingLeft,
        paddingRight: node.paddingRight,
        paddingTop: node.paddingTop
      }
      updateableProperties = { ...updateableProperties, ...layoutProperties }
    }
  }

  return updateableProperties
}

export function updateNode(node: SceneNode, properties: any) {
  const updatedProperties = getUpdatedPluginProperties(node, properties)

  //  console.log('updateNode() updatedProperties')
  //  console.log(updatedProperties)

  // RESIZE NODE IF NEEDED
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET' || node.type === 'INSTANCE') {
    if (updatedProperties.width || updatedProperties.height) {
      node.resize(updatedProperties.width || node.width, updatedProperties.height || node.height)
    }
  }

  // SET LAYOUT PROPERTIES IF NEEDED
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET' || node.type === 'INSTANCE') {
    node.itemSpacing = updatedProperties.itemSpacing || node.itemSpacing
    node.paddingBottom = updatedProperties.paddingBottom || node.paddingBottom
    node.paddingLeft = updatedProperties.paddingLeft || node.paddingLeft
    node.paddingRight = updatedProperties.paddingRight || node.paddingRight
    node.paddingTop = updatedProperties.paddingTop || node.paddingTop
  }
}

function getUpdatedPluginProperties(node: SceneNode, properties: any) {
  const updatedProperties: any = {}
  Object.keys(properties).map((key) => {
    const value = properties && properties[key as keyof unknown]
    if (key !== 'id' && key !== 'name') {
      const newPropertyValue = value
      const originalPropertyValue = (node as any)[key]
      if (newPropertyValue !== originalPropertyValue) {
        updatedProperties[key] = getConvertedValue(newPropertyValue)
      }
    }
  })
  return updatedProperties
}
