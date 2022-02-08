import { FormControlLabel, FormGroup, Switch } from '@material-ui/core'
import * as _ from 'lodash'
import * as React from 'react'
import { messageTypes } from '../model/messagesTypes'

export const SettingsTab = ({ parent, settings }: any) => {
  const [settingsState, setSettingsState] = React.useState<any>()

  React.useEffect(() => {
    if (!_.isEmpty(settings)) {
      setSettingsState(settings)
    }
  }, [])

  React.useEffect(() => {
    const msg: messageTypes = { type: 'update-settings', settings: settingsState }
    parent.postMessage({ pluginMessage: msg }, '*')
  }, [settingsState])

  const handleCamelCaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettingsState({
      ...settings,
      camelCase: event.target.checked
    })
  }

  const camelCaseChecked = settingsState ? !!settingsState.camelCase : true

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
      <div style={{ justifyContent: 'center' }}>
        <FormGroup>
          <FormControlLabel control={<Switch checked={camelCaseChecked} onChange={handleCamelCaseChange} />} label="Convert tokens imported from Figma Styles to camelCase" />
        </FormGroup>
      </div>
    </div>
  )
}

export default SettingsTab
