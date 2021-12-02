import * as React from 'react'
import { Autocomplete, Button, TextField } from '@material-ui/core'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { messageTypes } from '../messagesTypes'
import { getDesignTokensNames } from './DesignTokensTab'

let propertyIdCounter = 0

const propertyCreateRow = (key: any, value: any) => {
  propertyIdCounter += 1
  return { id: propertyIdCounter, col1: key, col2: value }
}

const propertiesColumns: GridColDef[] = [
  { field: 'col1', headerName: 'Property Name', width: 150 },
  { field: 'col2', headerName: 'Property Value', width: 150 },
  {
    field: 'col3',
    headerName: 'Linked Token',
    width: 250,
    renderCell: (params: GridRenderCellParams) => (
      <Autocomplete 
        id="combo-design-tokens" 
        options={getDesignTokensNames()} 
        sx={{ width: 250 }} 
        renderInput={(params) => <TextField {...params} />}
    )
  }
]

export const renderPropertiesTab = (nodeProperties: any, parent: any) => {
  const [propertiesRows, setPropertiesRows] = React.useState(() => [])

  const prepareProperties = () => {
    console.log('nodeProperties:')
    console.log(nodeProperties)

    const propertiesArray: any[] = []
    Object.keys(nodeProperties).map((key) => {
      const value = nodeProperties && nodeProperties[key as keyof unknown]
      if (value) {
        console.log('property key: ' + key)
        console.log('property value: ' + value)
        propertiesArray.push(propertyCreateRow(key, value))
      }
    })
    console.log('propertiesArray:')
    console.log(propertiesArray)
    setPropertiesRows(propertiesArray)
  }

  React.useEffect(() => {
    prepareProperties()
  }, [nodeProperties])

  const test = () => {
    const updatedNodeProperties = { ...nodeProperties, height: 1000 }
    const msg: messageTypes = { type: 'update-node-properties', nodeProperties: updatedNodeProperties }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  return (
    <div>
      {/*properties*/}

      <div style={{ width: '100%' }}>
        <DataGrid autoHeight rows={propertiesRows} columns={propertiesColumns} />
        <Button variant="outlined" onClick={test}>
          Test
        </Button>
      </div>
    </div>
  )
}
