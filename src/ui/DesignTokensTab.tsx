import { Button } from '@material-ui/core'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import * as _ from 'lodash'
import * as React from 'react'
import { useStore } from '../hooks/useStore'

const designTokensColumns: GridColDef[] = [
  { field: 'tokenName', headerName: 'Token Name', width: 300, editable: true },
  { field: 'tokenValue', headerName: 'Token Value', width: 300, editable: true }
]

export const renderDesignTokensTab = () => {
  const [editRowsModel, setEditRowsModel] = React.useState<any>({})
  const [selectionModel, setSelectionModel] = React.useState([])

  const addDesignToken = useStore((state) => state.addDesignToken)
  const designTokens = useStore((state) => state.designTokens)
  const designTokensCounter = useStore((state) => state.designTokensCounter)
  const deleteToken = useStore((state) => state.deleteToken)
  const updateDesignToken = useStore((state) => state.updateDesignToken)

  React.useEffect(() => {
    console.log('editRowsModel')
    console.log(editRowsModel)
    const objectKeys = Object.keys(editRowsModel)
    console.log('objectKeys')
    console.log(objectKeys)
    if (objectKeys.length !== 0) {
      const designTokenId = objectKeys[0]
      const row = editRowsModel[designTokenId]
      updateDesignToken(Number(designTokenId), row.tokenName?.value, row.tokenValue?.value)
    }
  }, [editRowsModel])

  const onEditRowsModelChange = React.useCallback((model) => {
    setEditRowsModel(model)
  }, [])

  const onPressAddAToken = () => {
    const tokenName = 'exampleToken' + designTokensCounter
    addDesignToken(tokenName, 10)
  }

  const onPressDeleteToken = () => {
    deleteToken(selectionModel[0])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 500 }}>
        <DataGrid
          columns={designTokensColumns}
          editRowsModel={editRowsModel}
          onEditRowsModelChange={onEditRowsModelChange}
          onSelectionModelChange={(newSelectionModel: any) => {
            console.log('onSelectionModelChange')
            console.log(newSelectionModel)
            setSelectionModel(newSelectionModel)
          }}
          rows={designTokens}
          selectionModel={selectionModel}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="outlined" onClick={onPressAddAToken} style={{ marginRight: '20px' }}>
          ADD A TOKEN
        </Button>
        <Button disabled={_.isEmpty(selectionModel)} variant="outlined" onClick={onPressDeleteToken}>
          DELETE TOKEN
        </Button>
      </div>
    </div>
  )
}
