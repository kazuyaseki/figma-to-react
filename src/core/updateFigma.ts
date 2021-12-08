export function updateNode(selectedNode: SceneNode, properties: any) {
  const updatedProperties = getUpdatedPluginProperties(selectedNode, properties)

  console.log('updateNode() updatedProperties')
  console.log(updatedProperties)

  if (selectedNode.type === 'FRAME') {
    selectedNode.resize(updatedProperties.width || selectedNode.width, updatedProperties.height || selectedNode.height)
  }
}

function getUpdatedPluginProperties(node: SceneNode, properties: any) {
  const updatedProperties: any = {}
  Object.keys(properties).map((key) => {
    const value = properties && properties[key as keyof unknown]
    if (key !== 'id' && key !== 'name') {
      const newPropertyValue = value
      const originalPropertyValue = node[key]
      if (newPropertyValue !== originalPropertyValue) {
        updatedProperties[key] = newPropertyValue
      }
    }
  })
  return updatedProperties
}
