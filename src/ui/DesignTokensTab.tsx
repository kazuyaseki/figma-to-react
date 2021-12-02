import { Button } from '@material-ui/core'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import * as React from 'react'

let designTokenIdCounter = 0

const designTokenCreateRow = () => {
  designTokenIdCounter += 1
  return { id: designTokenIdCounter, col1: 'exampleToken', col2: '10' }
}

const designTokensColumns: GridColDef[] = [
  { field: 'col1', headerName: 'Token Name', width: 300, editable: true },
  { field: 'col2', headerName: 'Token Value', width: 300, editable: true }
]

const designTokensArray: any[] = []

export function getDesignTokensNames() {
  console.log('getDesignTokensNames designTokensArray')
  console.log(designTokensArray)
  const names: string[] = []
  for (let index = 0; index < designTokensArray.length; index++) {
    if (!names.includes(designTokensArray[index].tokenName)) {
      names.push(designTokensArray[index].tokenName)
    }
  }
  return names
}

export const renderDesignTokensTab = () => {
  const [designTokensRows, setDesignTokensRows] = React.useState(() => [designTokenCreateRow()])

  React.useEffect(() => {
    updateDesignTokensArray(designTokensRows)
  }, [designTokensRows])

  const onPressAddAToken = () => {
    setDesignTokensRows((prevRows) => [...prevRows, designTokenCreateRow()])
  }

  const updateDesignTokensArray = (designTokensRows: any) => {
    Object.keys(designTokensRows).map((key) => {
      const value = designTokensRows && designTokensRows[key as keyof unknown]
      if (value) {
        designTokensArray.push({
          tokenName: value.col1,
          tokenValue: value.col2
        })
      }
    })
  }

  return (
    <div style={{ width: '100%' }}>
      <DataGrid autoHeight rows={designTokensRows} columns={designTokensColumns} />
      <Button variant="outlined" onClick={onPressAddAToken}>
        Add a Token
      </Button>
    </div>
  )
}
