import * as React from 'react'
import { Autocomplete, Box, Button, TextField } from '@material-ui/core'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid'
import { messageTypes } from '../model/messagesTypes'
import { updateSharedPluginData } from '../core/updateSharedPluginData'
import { useStore } from '../hooks/useStore'
import * as _ from 'lodash'
import { getConvertedValue, hexToRgb, isDarkColor, isHex, rgbaToHex } from '../utils/unitTypeUtils'
import { Store } from '../model/Store'
import { getFigmaObjectAsString } from '../utils/isImageNode'
import { FigmaProperties, FigmaProperty } from '../model/FigmaProperties'

export const renderPropertiesTab = (nodeProperties: any, parent: any) => {
  const designTokens = useStore((state) => state.designTokens)
  const properties = useStore((state) => state.properties)

  const getDesignTokenByName = useStore((state) => state.getDesignTokenByName)
  const getDesignTokensByType = useStore((state) => state.getDesignTokensByType)
  const getLinkedToken = useStore((state) => state.getLinkedToken)
  const getPropertiesByNodeId = useStore((state) => state.getPropertiesByNodeId)
  const getPropertyByName = useStore((state) => state.getPropertyByName)
  const updateProperty = useStore((state) => state.updateProperty)

  React.useEffect(() => {
    updateProperties()
  }, [designTokens, nodeProperties])

  const propertiesColumns: GridColDef[] = [
    { field: 'id', headerName: 'Property Name', width: 150 },
    {
      field: 'value',
      headerName: 'Property Value',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const tokenValue: any = params?.value

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
        if (_.isObject(tokenValue)) {
          let result = ''
          const objectKeys = Object.keys(tokenValue)
          const figmaObject: any = tokenValue
          if (figmaObject.visible && figmaObject.type === 'SOLID' && !_.isEmpty(figmaObject.color) && figmaObject.opacity) {
            const rgbValue = [Math.floor(figmaObject.color.r * 255), Math.floor(figmaObject.color.g * 255), Math.floor(figmaObject.color.b * 255)]

            let textColor = 'black'

            if (isDarkColor(rgbValue)) {
              textColor = 'white'
            }

            const opacityValue = figmaObject.opacity?.toFixed(2) || 1.0
            const rgbaString = `rgba(${rgbValue[0]}, ${rgbValue[1]}, ${rgbValue[2]}, ${opacityValue})`
            result += rgbaToHex(rgbaString).toUpperCase()

            return (
              <div>
                <span style={{ backgroundColor: String(rgbaString), color: textColor }}>{result}</span>
              </div>
            )
          } else {
            objectKeys.map((key) => {
              const value = tokenValue && tokenValue[key as keyof unknown]
              if (_.isObject(value)) {
                result += getFigmaObjectAsString(key, value)
              } else {
                result += `${key}: ${value}\n`
              }
            })
            return <div style={{ fontSize: '9px', lineHeight: '10px', paddingBottom: 10, paddingTop: 10, whiteSpace: 'pre-line' }}>{result}</div>
          }
        }

        const currentKey = params.row.id
        const currentValueString = String(params.row.value)

        if (currentValueString !== String(nodeProperties[currentKey])) {
          return (
            <div>
              <span style={{ fontWeight: 'bold' }}>{currentValueString}</span> ({nodeProperties[currentKey]})
            </div>
          )
        }

        return <div>{currentValueString}</div>
      }
    },
    {
      field: 'linkedToken',
      headerName: 'Linked Token',
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row

        console.log('row:')
        console.log(row)

        // Shouldn't render Autocomplete if it is a Figma Style token
        if (row.linkedToken && _.isObject(row.value) && !_.isEmpty(row.value.styleId)) {
          return <p style={{ fontWeight: 'bold' }}> {row.linkedToken}</p>
        }

        return (
          <Autocomplete
            id="combo-design-tokens"
            onChange={(event, newValue) => {
              const row = params.row
              onChangeLinkedToken(row, newValue)
            }}
            options={getDesignTokensCombo(params)}
            renderInput={(params) => <TextField {...params} />}
            sx={{ width: 250 }}
            value={getAutocompleteValue(params)}
          />
        )
      }
    }
  ]

  const getAutocompleteValue = (params: GridRenderCellParams) => {
    const row = params.row
    const property: any = properties.find((property: any) => property.nodeId === row.nodeId && property.id === row.id)
    return property?.linkedToken || null
  }

  const getDesignTokensCombo = (params: GridRenderCellParams) => {
    const row = params.row
    const tokenName = row.id
    const property = FigmaProperties.find((figmaProperty: FigmaProperty) => figmaProperty.name === tokenName)
    if (property) {
      const designTokensByType = getDesignTokensByType(property.type)
      return designTokensByType.map((designToken: any) => designToken.tokenName)
    }
    return designTokens.map((designToken: any) => designToken.tokenName)
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
        let property: any = {
          id: key,
          nodeId,
          value: newValue
        }
        if (designToken) {
          property = { ...property, linkedToken: designToken.tokenName }
        }
        const updatedData: Store = {
          properties: [property]
        }
        updateSharedPluginData(parent, updatedData)
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
