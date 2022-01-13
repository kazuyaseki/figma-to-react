import { Autocomplete, Button, TextField } from '@material-ui/core'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid'
import * as _ from 'lodash'
import * as React from 'react'
import styles from '../ui.css'
import { updateSharedPluginData } from '../core/updateSharedPluginData'
import { useStore } from '../hooks/useStore'
import { isFigmaStyleGroup } from '../model/FigmaStyleGroup'
import { Store } from '../model/Store'
import { hexToRgb, isDarkColor, isHex, isNotANumber } from '../utils/unitTypeUtils'
import { messageTypes } from '../model/messagesTypes'
import { getFigmaObjectAsString } from '../utils/isImageNode'

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

const inspectTokenTexts = {
  noRowsLabel: 'No Properties Linked To This Token'
}

export const renderDesignTokensTab = (parent: any) => {
  const [editDesignTokensRowsModel, setEditDesignTokensRowsModel] = React.useState<any>({})
  const [editDesignTokensGroupsRowsModel, setEditDesignTokensGroupsRowsModel] = React.useState<any>({})
  const [selectionModel, setSelectionModel] = React.useState([])
  const [groupSelectionModel, setGroupSelectionModel] = React.useState([])

  const designTokens = useStore((state) => state.designTokens)
  const designTokensCounter = useStore((state) => state.designTokensCounter)
  const designTokensGroups = useStore((state) => state.designTokensGroups)
  const designTokensGroupsCounter = useStore((state) => state.designTokensGroupsCounter)
  const nodes = useStore((state) => state.nodes)

  const addDesignToken = useStore((state) => state.addDesignToken)
  const addDesignTokenGroup = useStore((state) => state.addDesignTokenGroup)
  const deleteToken = useStore((state) => state.deleteToken)
  const deleteTokenGroup = useStore((state) => state.deleteTokenGroup)
  const getDesignTokenById = useStore((state) => state.getDesignTokenById)
  const getNodeById = useStore((state) => state.getNodeById)
  const getPropertiesByLinkedToken = useStore((state) => state.getPropertiesByLinkedToken)
  const updateDesignToken = useStore((state) => state.updateDesignToken)
  const updateDesignTokenGroup = useStore((state) => state.updateDesignTokenGroup)

  React.useEffect(() => {
    const updatedData: Store = {
      designTokens,
      designTokensCounter,
      designTokensGroups,
      designTokensGroupsCounter,
      nodes
    }

    updateSharedPluginData(parent, updatedData)
  }, [designTokens, designTokensCounter, designTokensGroups, designTokensGroupsCounter, nodes])

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
    { field: 'tokenName', headerName: 'Token Name', width: 180, editable: true },
    {
      field: 'tokenValue',
      headerName: 'Token Value',
      width: 170,
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        const tokenValue = params?.value
        if (_.isObject(tokenValue)) {
          let result = ''
          Object.keys(tokenValue).map((key) => {
            const value = tokenValue && tokenValue[key as keyof unknown]
            if (_.isObject(value)) {
              result += getFigmaObjectAsString(key, value)
            } else {
              result += `${key}: ${value}\n`
            }
          })
          return <div style={{ fontSize: '9px', lineHeight: '10px', whiteSpace: 'pre-line' }}>{result}</div>
        }
        if (isHex(tokenValue)) {
          let textColor = 'black'
          const rgbValue = hexToRgb(tokenValue)
          if (rgbValue && isDarkColor(rgbValue)) {
            textColor = 'white'
          }
          return (
            <div>
              <span style={{ backgroundColor: String(tokenValue), color: textColor }}>{tokenValue}</span>
            </div>
          )
        }

        return <div>{params.value}</div>
      }
    },
    {
      field: 'tokenGroup',
      headerName: 'Token Group',
      flex: 1,
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

  const inspectTokenColumns: GridColDef[] = [
    { field: 'nodeName', headerName: 'Node Name', width: 150, editable: false },
    { field: 'nodePage', headerName: 'Node Page', width: 120, editable: false },
    { field: 'propertyName', headerName: 'Property Name', width: 150, editable: false },
    {
      field: 'propertyValue',
      headerName: 'Property Value',
      editable: false,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const currentPropertyValue = String(params.row.propertyValue)
        const currentDesignToken = getDesignTokenById(selectionModel[0])
        if (currentPropertyValue !== currentDesignToken.tokenValue) {
          return (
            <div>
              <span style={{ fontWeight: 'bold' }}>{currentDesignToken.tokenValue}</span> ({currentPropertyValue})
            </div>
          )
        }
        return <div>{currentPropertyValue}</div>
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

  const onPressAddATokenGroup = () => {
    const groupName = 'exampleGroup' + designTokensGroupsCounter
    addDesignTokenGroup(groupName)
  }

  const onPressDeleteToken = () => {
    deleteToken(selectionModel[0])
  }

  const onPressDeleteTokenGroup = () => {
    deleteTokenGroup(groupSelectionModel[0])
  }

  const onPressUpdateAllLinkedProperties = () => {
    const selectedDesignToken = getDesignTokenById(selectionModel[0])

    console.log('propertiesLinkedToSelectedDesignToken:')
    console.log(propertiesLinkedToSelectedDesignToken)

    for (let index = 0; index < propertiesLinkedToSelectedDesignToken.length; index++) {
      console.log('element.propertyValue: ')
      console.log(propertiesLinkedToSelectedDesignToken[index].propertyValue)
      console.log('selectedDesignToken.tokenValue: ')
      console.log(selectedDesignToken.tokenValue)
      propertiesLinkedToSelectedDesignToken[index].propertyValue = selectedDesignToken.tokenValue
    }

    const msg: messageTypes = { type: 'update-all-linked-properties', linkedProperties: propertiesLinkedToSelectedDesignToken }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  let selectedDesignToken = undefined

  if (selectionModel) {
    selectedDesignToken = getDesignTokenById(selectionModel[0])
  }

  const propertiesLinkedToSelectedDesignToken: any = []

  if (selectedDesignToken) {
    const propertiesByLinkedToken = getPropertiesByLinkedToken(selectedDesignToken.tokenName)
    let propertiesCounter = 0
    propertiesByLinkedToken.forEach((property: any) => {
      const nodeInfo = getNodeById(property.nodeId)
      propertiesLinkedToSelectedDesignToken.push({
        id: propertiesCounter,
        nodeName: nodeInfo?.name || property.nodeId,
        nodePage: nodeInfo?.page || '',
        propertyName: property.id,
        propertyValue: property.value
      })
      propertiesCounter += 1
    })
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
      {!!selectedDesignToken && (
        <div className={styles.container} style={{ margin: '20px 0px' }}>
          <p style={{ alignSelf: 'center', fontWeight: 'bold', marginTop: '20px', textAlign: 'center' }}>Inspect Token: '{selectedDesignToken.tokenName}'</p>
          <div style={{ height: 300, marginTop: '20px' }}>
            <DataGrid columns={inspectTokenColumns} hideFooter localeText={inspectTokenTexts} rows={propertiesLinkedToSelectedDesignToken} rowsPerPageOptions={[100]} />
          </div>
          <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', margin: '20px 0px' }}>
            <Button disabled={propertiesLinkedToSelectedDesignToken?.length === 0} variant="outlined" onClick={onPressUpdateAllLinkedProperties}>
              UPDATE ALL LINKED PROPERTIES
            </Button>
          </div>
        </div>
      )}
      <div style={{ margin: '20px 0px' }}>
        <p style={{ alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>Token Groups</p>
        <div style={{ display: 'flex', flex: 2, height: 300, marginTop: '20px' }}>
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
