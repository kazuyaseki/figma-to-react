import * as React from 'react'
import { Autocomplete, Button, TextField } from '@material-ui/core'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { messageTypes } from '../messagesTypes'
import { useStore } from '../hooks/useStore'
import * as _ from 'lodash'
import { getConvertedValue } from '../utils/unitTypeUtils'

export const renderPropertiesTab = (nodeProperties: any, parent: any) => {
  const designTokens = useStore((state) => state.designTokens)
  const properties = useStore((state) => state.properties)

  const getDesignTokenByName = useStore((state) => state.getDesignTokenByName)
  const getLinkedToken = useStore((state) => state.getLinkedToken)
  const getPropertiesByNodeId = useStore((state) => state.getPropertiesByNodeId)
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
          options={designTokens.map((designToken: any) => designToken.tokenName)}
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
        const designToken = getLinkedToken(nodeId, key)
        const newValue = designToken?.tokenValue || value
        updateProperty(nodeId, key, newValue)
      }
    })
  }

  const updateFigmaProperties = () => {
    const nodeId = nodeProperties['id']
    Object.keys(nodeProperties).map((key) => {
      const value = nodeProperties && nodeProperties[key as keyof unknown]
      if (key !== 'id' && key !== 'name') {
        const property = getPropertyByName(nodeId, key)
        const newValue = property.value || value
        nodeProperties[key] = getConvertedValue(newValue)
      }
    })

    const msg: messageTypes = { type: 'update-node-properties', nodeProperties }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {_.isEmpty(nodeProperties) ? (
        <span style={{ fontWeight: 'bold' }}>No Figma Node selected.</span>
      ) : (
        <div>
          <div>
            <span style={{ fontWeight: 'bold' }}>Node: {nodeProperties['name']}</span>
            <div style={{ height: 350 }}>
              <DataGrid rows={getPropertiesByNodeId(nodeProperties['id'])} columns={propertiesColumns} />
            </div>
          </div>
          <Button variant="outlined" onClick={updateFigmaProperties}>
            UPDATE FIGMA PROPERTIES
          </Button>
        </div>
      )}
    </div>
  )
}
