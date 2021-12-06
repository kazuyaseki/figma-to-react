import { Button } from '@material-ui/core'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import { useStore } from '../hooks/useStore'

const designTokensColumns: GridColDef[] = [
  { field: 'tokenName', headerName: 'Token Name', width: 300, editable: true },
  { field: 'tokenValue', headerName: 'Token Value', width: 300, editable: true }
]

export const renderDesignTokensTab = () => {
  const [editRowsModel, setEditRowsModel] = React.useState({})

  const addDesignToken = useStore((state) => state.addDesignToken)
  const designTokens = useStore((state) => state.designTokens)
  const designTokensCounter = useStore((state) => state.designTokensCounter)
  const updateDesignToken = useStore((state) => state.updateDesignToken)

  React.useEffect(() => {
    const objectKeys = Object.keys(editRowsModel)
    if (objectKeys.length !== 0) {
      const designTokenId = objectKeys[0]
      updateDesignToken(Number(designTokenId), editRowsModel[designTokenId].tokenName?.value, editRowsModel[designTokenId].tokenValue?.value)
    }
  }, [editRowsModel])

  const onEditRowsModelChange = React.useCallback((model) => {
    setEditRowsModel(model)
  }, [])

  const onPressAddAToken = () => {
    const tokenName = 'exampleToken' + designTokensCounter
    addDesignToken(tokenName, 10)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 400 }}>
        <DataGrid columns={designTokensColumns} editRowsModel={editRowsModel} onEditRowsModelChange={onEditRowsModelChange} rows={designTokens} />
      </div>
      <Button variant="outlined" onClick={onPressAddAToken}>
        Add a Token
      </Button>
    </div>
  )
}
