import { Button, FormControlLabel, FormGroup, Switch, TextField } from '@material-ui/core'
import * as _ from 'lodash'
import * as React from 'react'
import { messageTypes } from '../model/messagesTypes'
import { getDefaultSettings } from '../model/Settings'
import styles from '../ui.css'

export const SettingsTab = ({ parent, settings }: any) => {
  const [camelCaseSwitch, setCamelCaseSwitch] = React.useState(true)
  const [figmaColorsField, setFigmaColorsField] = React.useState('')
  const [figmaEffectsField, setFigmaEffectsField] = React.useState('')
  const [figmaGridsField, setFigmaGridsField] = React.useState('')
  const [figmaTextsField, setFigmaTextsField] = React.useState('')
  const [imagePrefixField, setImagePrefixField] = React.useState('')
  const [pressablePrefixField, setPressablePrefixField] = React.useState('')
  const [scrollablePrefixField, setScrollablePrefixField] = React.useState('')
  const [textPrefixField, setTextPrefixField] = React.useState('')

  React.useEffect(() => {
    const {
      camelCase,
      codeButtonPrefix,
      codeImagePrefix,
      codeScrollablePrefix,
      codeTextPrefix,
      figmaColorsGroupName,
      figmaEffectsGroupName,
      figmaGridsGroupName,
      figmaTextsGroupName
    } = getDefaultSettings()

    console.log('SettingsTab useEffect [] settings:')
    console.log(settings)

    setCamelCaseSwitch(settings?.camelCaseSwitch || camelCase)
    setFigmaColorsField(settings?.figmaColorsGroupName || figmaColorsGroupName)
    setFigmaEffectsField(settings?.figmaEffectsGroupName || figmaEffectsGroupName)
    setFigmaGridsField(settings?.figmaGridsGroupName || figmaGridsGroupName)
    setFigmaTextsField(settings?.figmaTextsField || figmaTextsGroupName)
    setImagePrefixField(settings?.codeImagePrefix || codeImagePrefix)
    setPressablePrefixField(settings?.codeButtonPrefix || codeButtonPrefix)
    setScrollablePrefixField(settings?.codeScrollablePrefix || codeScrollablePrefix)
    setTextPrefixField(settings?.codeTextPrefix || codeTextPrefix)
  }, [])

  const handleCamelCaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCamelCaseSwitch(event.target.checked)
  }

  const onPressReset = () => {
    const {
      camelCase,
      codeButtonPrefix,
      codeImagePrefix,
      codeScrollablePrefix,
      codeTextPrefix,
      figmaColorsGroupName,
      figmaEffectsGroupName,
      figmaGridsGroupName,
      figmaTextsGroupName
    } = getDefaultSettings()

    setCamelCaseSwitch(camelCase)
    setFigmaColorsField(figmaColorsGroupName)
    setFigmaEffectsField(figmaEffectsGroupName)
    setFigmaGridsField(figmaGridsGroupName)
    setFigmaTextsField(figmaTextsGroupName)
    setImagePrefixField(codeImagePrefix)
    setPressablePrefixField(codeButtonPrefix)
    setScrollablePrefixField(codeScrollablePrefix)
    setTextPrefixField(codeTextPrefix)
  }

  const onPressSave = () => {
    const updatedSettings = {
      camelCase: camelCaseSwitch,
      codeButtonPrefix: pressablePrefixField,
      codeImagePrefix: imagePrefixField,
      codeScrollablePrefix: scrollablePrefixField,
      codeTextPrefix: textPrefixField,
      figmaColorsGroupName: figmaColorsField,
      figmaEffectsGroupName: figmaEffectsField,
      figmaGridsGroupName: figmaGridsField,
      figmaTextsGroupName: figmaTextsField
    }
    const msg: messageTypes = { type: 'update-settings', settings: updatedSettings }
    parent.postMessage({ pluginMessage: msg }, '*')

    alert('Settings updated. Please restart the plugin.')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px' }}>
      <div className={styles.container}>
        <p style={{ alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>Design Tokens</p>
        <div style={{ flexDirection: 'column', justifyContent: 'center', marginTop: '20px' }}>
          <FormGroup>
            <FormControlLabel control={<Switch checked={camelCaseSwitch} onChange={handleCamelCaseChange} />} label="Convert tokens imported from Figma Styles to camelCase" />
          </FormGroup>
          <div style={{ alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                id="username"
                label="Token Group name for Figma Color Styles"
                onChange={(evt) => {
                  setFigmaColorsField(evt.target.value)
                }}
                size="small"
                style={{ backgroundColor: '#fff' }}
                value={figmaColorsField}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                id="repositoryName"
                label="Token Group name for Figma Effect Styles"
                onChange={(evt) => {
                  setFigmaEffectsField(evt.target.value)
                }}
                size="small"
                style={{ backgroundColor: '#fff' }}
                value={figmaEffectsField}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                id="workflowName"
                label="Token Group name for Figma Grid Styles"
                onChange={(evt) => {
                  setFigmaGridsField(evt.target.value)
                }}
                size="small"
                style={{ backgroundColor: '#fff' }}
                value={figmaGridsField}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                id="branch"
                label="Token Group name for Figma Text Styles"
                onChange={(evt) => {
                  setFigmaTextsField(evt.target.value)
                }}
                size="small"
                style={{ backgroundColor: '#fff' }}
                value={figmaTextsField}
              />
            </div>
          </div>
        </div>
        <p style={{ alignSelf: 'center', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>Code Generation</p>
        <div style={{ justifyContent: 'center', marginTop: '20px' }}>
          <div style={{ alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                id="username"
                label="Prefix for Figma Nodes to generate proper Image code (i.e. Image/MyFigmaNodeName)"
                onChange={(evt) => {
                  setImagePrefixField(evt.target.value)
                }}
                size="small"
                style={{ backgroundColor: '#fff' }}
                value={imagePrefixField}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                id="repositoryName"
                label="Prefix for Figma Nodes to generate proper Button code (i.e. Pressable/MyFigmaNodeName)"
                onChange={(evt) => {
                  setPressablePrefixField(evt.target.value)
                }}
                size="small"
                style={{ backgroundColor: '#fff' }}
                value={pressablePrefixField}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                id="workflowName"
                label="Prefix for Figma Nodes to generate proper Scrollable code (i.e. ScrollView/MyFigmaNodeName)"
                onChange={(evt) => {
                  setScrollablePrefixField(evt.target.value)
                }}
                size="small"
                style={{ backgroundColor: '#fff' }}
                value={scrollablePrefixField}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                id="branch"
                label="Prefix for Figma Nodes to generate proper Text code (i.e. Text/MyFigmaNodeName)"
                onChange={(evt) => {
                  setTextPrefixField(evt.target.value)
                }}
                size="small"
                style={{ backgroundColor: '#fff' }}
                value={textPrefixField}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
          <Button variant="contained" onClick={onPressSave}>
            SAVE
          </Button>
          <Button variant="outlined" onClick={onPressReset}>
            RESET TO DEFAULT VALUES
          </Button>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>Note:</span> These settings values are saved locally. If you change them, make sure you share the new values with other plugin users
        from your team.
      </div>
    </div>
  )
}

export default SettingsTab
