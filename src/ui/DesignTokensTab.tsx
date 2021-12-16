import { Autocomplete, Button, TextField } from '@material-ui/core'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid'
import * as _ from 'lodash'
import * as React from 'react'
import { updateSharedPluginData } from '../core/updateSharedPluginData'
import { useStore } from '../hooks/useStore'
import { isFigmaStyleGroup } from '../model/FigmaStyleGroup'
import { Store } from '../model/Store'
import { isNotANumber } from '../utils/unitTypeUtils'

const designTokensTexts = {
  noRowsLabel: 'No Design Tokens',
  // Rows selected footer text
  footerRowSelected: (count: number) => (count !== 1 ? `${count.toLocaleString()} Design Tokens selected` : `${count.toLocaleString()} Design Token selected`)
}

const designTokensGroupsTexts = {
  noRowsLabel: 'No Groups',
  // Rows selected footer text
  footerRowSelected: (count: number) => (count !== 1 ? `${count.toLocaleString()} Groups selected` : `${count.toLocaleString()} Group selected`)
}

export const renderDesignTokensTab = (parent: any) => {
  const [editDesignTokensRowsModel, setEditDesignTokensRowsModel] = React.useState<any>({})
  const [editDesignTokensGroupsRowsModel, setEditDesignTokensGroupsRowsModel] = React.useState<any>({})
  const [selectionModel, setSelectionModel] = React.useState([])
  const [groupSelectionModel, setGroupSelectionModel] = React.useState([])

  const addDesignToken = useStore((state) => state.addDesignToken)
  const addDesignTokenGroup = useStore((state) => state.addDesignTokenGroup)
  const designTokens = useStore((state) => state.designTokens)
  const designTokensCounter = useStore((state) => state.designTokensCounter)
  const designTokensGroups = useStore((state) => state.designTokensGroups)
  const designTokensGroupsCounter = useStore((state) => state.designTokensGroupsCounter)
  const getDesignTokenById = useStore((state) => state.getDesignTokenById)
  const deleteToken = useStore((state) => state.deleteToken)
  const deleteTokenGroup = useStore((state) => state.deleteTokenGroup)
  const updateDesignToken = useStore((state) => state.updateDesignToken)
  const updateDesignTokenGroup = useStore((state) => state.updateDesignTokenGroup)

  React.useEffect(() => {
    const updatedData: Store = {
      designTokens,
      designTokensCounter,
      designTokensGroups,
      designTokensGroupsCounter
    }

    updateSharedPluginData(parent, updatedData)
  }, [designTokens, designTokensCounter, designTokensGroups, designTokensGroupsCounter])

  React.useEffect(() => {
    const objectKeys = Object.keys(editDesignTokensRowsModel)
    if (objectKeys.length !== 0) {
      const designTokenId = objectKeys[0]
      const row = editDesignTokensRowsModel[designTokenId]
      updateDesignToken(Number(designTokenId), row.tokenName?.value, row.tokenValue?.value, row.tokenGroup?.value)
    }
  }, [editDesignTokensRowsModel])

  React.useEffect(() => {
    const objectKeys = Object.keys(editDesignTokensGroupsRowsModel)
    if (objectKeys.length !== 0) {
      const groupId = objectKeys[0]
      const row = editDesignTokensGroupsRowsModel[groupId]
      updateDesignTokenGroup(Number(groupId), row.groupName?.value)
    }
  }, [editDesignTokensGroupsRowsModel])

  const designTokensGroupsFiltered = designTokensGroups.filter((designTokenGroup: any) => !isFigmaStyleGroup(designTokenGroup.groupName))

  const designTokensColumns: GridColDef[] = [
    { field: 'tokenName', headerName: 'Token Name', width: 200, editable: true },
    { field: 'tokenValue', headerName: 'Token Value', width: 120, editable: true },
    {
      field: 'tokenGroup',
      headerName: 'Token Group',
      flex: 1,
      //      width: 240,
      renderCell: (params: GridRenderCellParams) => {
        const groupName = params?.value
        if (isFigmaStyleGroup(groupName)) {
          return <p style={{ fontWeight: isFigmaStyleGroup(groupName) ? 'bold' : 'normal' }}>{groupName}</p>
        }
        return (
          <Autocomplete
            disabled={groupName && isFigmaStyleGroup(groupName)}
            id="combo-token-groups"
            onChange={(event, newValue) => {
              const row = params.row
              onChangeLinkedTokenGroup(row, newValue)
            }}
            options={designTokensGroupsFiltered.map((group: any) => group.groupName)}
            renderInput={(params) => <TextField {...params} size="small" />}
            sx={{ width: 250 }}
            value={getAutocompleteValue(params)}
          />
        )
      }
    }
  ]

  const designTokensGroupsColumns: GridColDef[] = [
    {
      editable: true,
      field: 'groupName',
      headerName: 'Group Name',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const groupName = params?.value
        return <p style={{ fontWeight: isFigmaStyleGroup(groupName) ? 'bold' : 'normal' }}>{groupName}</p>
      }
    }
  ]

  const getAutocompleteValue = (params: any) => {
    const row = params.row
    const designToken: any = designTokens.find((designToken: any) => designToken.id === row.id)
    const designTokenGroupName = designToken?.tokenGroup
    if (designTokenGroupName) {
      const groupExists = designTokensGroups.find((currentGroup: any) => designTokenGroupName === currentGroup.groupName)
      if (groupExists) {
        return designTokenGroupName
      }
    }
    return null
  }

  const onChangeLinkedTokenGroup = (row: GridRowModel, tokenGroup: any) => {
    const designToken = getDesignTokenById(row.id)
    updateDesignToken(designToken.id, designToken.tokenName, designToken.tokenValue, tokenGroup)
  }

  const onEditDesignTokensRowsModelChange = React.useCallback((model) => {
    const key = Object.keys(model)[0]
    if (key !== undefined && isNotANumber(key)) {
      alert(`You can't edit tokens automatically imported by Figma`)
    } else {
      setEditDesignTokensRowsModel(model)
    }
  }, [])

  const onEditDesignTokensGroupsRowsModelChange = React.useCallback((model) => {
    const key = Object.keys(model)[0]
    const groupName = model[key]?.groupName?.value
    if (groupName && isFigmaStyleGroup(groupName)) {
      alert(`You can't edit groups automatically imported by Figma`)
    } else {
      setEditDesignTokensGroupsRowsModel(model)
    }
  }, [])

  const onPressAddAToken = () => {
    const tokenName = 'exampleToken' + designTokensCounter
    addDesignToken(tokenName, 10)
  }

  const onPressDeleteToken = () => {
    deleteToken(selectionModel[0])
  }

  const onPressAddATokenGroup = () => {
    const groupName = 'exampleGroup' + designTokensGroupsCounter
    addDesignTokenGroup(groupName)
  }

  const onPressDeleteTokenGroup = () => {
    deleteTokenGroup(groupSelectionModel[0])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
      <div>
        <div style={{ height: 550 }}>
          <DataGrid
            columns={designTokensColumns}
            editRowsModel={editDesignTokensRowsModel}
            localeText={designTokensTexts}
            onEditRowsModelChange={onEditDesignTokensRowsModelChange}
            onSelectionModelChange={(newSelectionModel: any) => {
              setSelectionModel(newSelectionModel)
            }}
            rows={designTokens}
            rowsPerPageOptions={[100]}
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
      <div style={{ margin: '20px 0px' }}>
        <div style={{ display: 'flex', flex: 2, height: 300 }}>
          <DataGrid
            columns={designTokensGroupsColumns}
            editRowsModel={editDesignTokensGroupsRowsModel}
            headerHeight={0}
            hideFooter
            localeText={designTokensGroupsTexts}
            onEditRowsModelChange={onEditDesignTokensGroupsRowsModelChange}
            onSelectionModelChange={(newGroupSelectionModel: any) => {
              setGroupSelectionModel(newGroupSelectionModel)
            }}
            rows={designTokensGroups}
            rowsPerPageOptions={[100]}
            selectionModel={groupSelectionModel}
          />
        </div>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', margin: '20px 10px 0px 10px' }}>
          <Button variant="outlined" onClick={onPressAddATokenGroup}>
            ADD A GROUP
          </Button>
          <Button disabled={_.isEmpty(groupSelectionModel)} variant="outlined" onClick={onPressDeleteTokenGroup} style={{ marginLeft: '20px' }}>
            DELETE GROUP
          </Button>
        </div>
      </div>
    </div>
  )
}
