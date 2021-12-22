import * as React from 'react'
import { Autocomplete, Box, Button, TextField } from '@material-ui/core'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid'
import { messageTypes } from '../model/messagesTypes'
import { updateSharedPluginData } from '../core/updateSharedPluginData'
import { useStore } from '../hooks/useStore'
import * as _ from 'lodash'
import { getConvertedValue } from '../utils/unitTypeUtils'
import { Store } from '../model/Store'

export const renderPropertiesTab = (nodeProperties: any, parent: any) => {
  const [changedRows, setChangedRows] = React.useState([])

  const designTokens = useStore((state) => state.designTokens)
  const properties = useStore((state) => state.properties)

  const getDesignTokenByName = useStore((state) => state.getDesignTokenByName)
  const getLinkedToken = useStore((state) => state.getLinkedToken)
  const getPropertiesByNodeId = useStore((state) => state.getPropertiesByNodeId)
  const getPropertyByName = useStore((state) => state.getPropertyByName)
  const updateProperty = useStore((state) => state.updateProperty)

  React.useEffect(() => {
    console.log('PropertiesTab useEffect() properties')
    console.log(properties)
  }, [properties])

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

  const onChangeLinkedToken = (row: GridRowModel, linkedToken: any) => {
    const designToken = getDesignTokenByName(linkedToken)
    const nodeOriginalValue = nodeProperties[row.id]
    const value = designToken?.tokenValue || nodeOriginalValue

    updateProperty(row.nodeId, row.id, value, linkedToken)

    const property = { nodeId: row.nodeId, id: row.id, value, linkedToken }

    const updatedData: Store = {
      properties: [property]
    }

    updateSharedPluginData(parent, updatedData)
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {_.isEmpty(nodeProperties) ? (
        <span style={{ fontWeight: 'bold' }}>No Figma Node selected.</span>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0px' }}>
              <span style={{ fontWeight: 'bold' }}>Node: {nodeProperties['name']}</span>
            </div>
            <Box
              sx={{
                height: 500,
                width: 1,
                '& .row-changed': {
                  backgroundColor: 'green'
                },
                '& .value-changed': {
                  fontWeight: 'bold'
                }
              }}
            >
              <DataGrid
                columns={propertiesColumns}
                getRowClassName={(params) => {
                  // FIXME: test class name doesn't make sense
                  return `test`
                }}
                rows={getPropertiesByNodeId(nodeProperties['id'])}
              />
            </Box>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="outlined" onClick={updateFigmaProperties}>
              UPDATE FIGMA PROPERTIES
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
