import * as React from 'react'
import { Autocomplete, Button, TextField } from '@material-ui/core'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { messageTypes } from '../messagesTypes'
import { useStore } from '../hooks/useStore'

export const renderPropertiesTab = (nodeProperties: any, parent: any) => {
  const addProperty = useStore((state) => state.addProperty)
  const designTokens = useStore((state) => state.designTokens)
  const properties = useStore((state) => state.properties)

  React.useEffect(() => {
    prepareProperties()
  }, [nodeProperties])

  const propertiesColumns: GridColDef[] = [
    { field: 'propertyName', headerName: 'Property Name', width: 150 },
    { field: 'propertyValue', headerName: 'Property Value', width: 150 },
    {
      field: 'linkedToken',
      headerName: 'Linked Token',
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Autocomplete
          id="combo-design-tokens"
          options={designTokens.map((designToken) => designToken.tokenName)}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} />}
        />
      )
    }
  ]

  const prepareProperties = () => {
    const propertiesArray: any[] = []

    Object.keys(nodeProperties).map((key) => {
      const value = nodeProperties && nodeProperties[key as keyof unknown]
      if (value) {
        propertiesArray.push(addProperty(key, value))
      }
    })
  }

  const test = () => {
    const updatedNodeProperties = { ...nodeProperties, height: 1000 }
    const msg: messageTypes = { type: 'update-node-properties', nodeProperties: updatedNodeProperties }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 400 }}>
        <DataGrid rows={properties} columns={propertiesColumns} />
      </div>
      <Button variant="outlined" onClick={test}>
        Test
      </Button>
    </div>
  )
}
