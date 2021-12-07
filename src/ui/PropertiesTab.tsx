import * as React from 'react'
import { Autocomplete, Button, TextField } from '@material-ui/core'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { messageTypes } from '../messagesTypes'
import { useStore } from '../hooks/useStore'

export const renderPropertiesTab = (nodeProperties: any, parent: any) => {
  const designTokens = useStore((state) => state.designTokens)
  const properties = useStore((state) => state.properties)

  const getDesignTokenByPropertyName = useStore((state) => state.getDesignTokenByPropertyName)
  const getDesignTokenByName = useStore((state) => state.getDesignTokenByName)
  const getPropertyByName = useStore((state) => state.getPropertyByName)
  const updateProperty = useStore((state) => state.updateProperty)

  React.useEffect(() => {
    updateProperties()
  }, [designTokens, nodeProperties])

  const propertiesColumns: GridColDef[] = [
    { field: 'id', headerName: 'Property Name', width: 150 },
    { field: 'value', headerName: 'Property Value', width: 150 },
    {
      field: 'linkedToken',
      headerName: 'Linked Token',
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Autocomplete
          id="combo-design-tokens"
          onChange={(event, newValue) => {
            const row = params.row
            onChangeLinkedToken(row, newValue)
          }}
          options={designTokens.map((designToken) => designToken.tokenName)}
          renderInput={(params) => <TextField {...params} />}
          sx={{ width: 250 }}
          value={getAutocompleteValue(params)}
        />
      )
    }
  ]

  const getAutocompleteValue = (params: any) => {
    const row = params.row
    const property: any = properties.find((property: any) => property.nodeId === row.nodeId && property.id === row.id)
    return property?.linkedToken || null
  }

  const onChangeLinkedToken = (row: any, linkedToken: any) => {
    const designToken = getDesignTokenByName(linkedToken)
    const nodeOriginalValue = nodeProperties[row.id]
    updateProperty(row.nodeId, row.id, designToken?.tokenValue || nodeOriginalValue, linkedToken)
  }

  const updateProperties = () => {
    const nodeId = nodeProperties['id']
    Object.keys(nodeProperties).map((key) => {
      const value = nodeProperties && nodeProperties[key as keyof unknown]
      if (key !== 'id' && key !== 'name') {
        const designToken = getDesignTokenByPropertyName(key)
        const newValue = designToken?.tokenValue || value
        updateProperty(nodeId, key, newValue)
      }
    })
  }

  const test = () => {
    Object.keys(nodeProperties).map((key) => {
      const value = nodeProperties && nodeProperties[key as keyof unknown]
      if (key !== 'id' && key !== 'name') {
        const property = getPropertyByName(key)
        console.log('property')
        console.log(property)
        const newValue = property.value || value
        nodeProperties[key] = Number(newValue)
      }
    })

    const updatedNodeProperties = { ...nodeProperties }

    console.log('updatedNodeProperties')
    console.log(updatedNodeProperties)

    const msg: messageTypes = { type: 'update-node-properties', nodeProperties: updatedNodeProperties }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 400 }}>
        <span style={{ fontWeight: 'bold' }}>Node: {nodeProperties['name']}</span>
        <DataGrid rows={properties} columns={propertiesColumns} />
      </div>
      <Button variant="outlined" onClick={test}>
        Test
      </Button>
    </div>
  )
}
