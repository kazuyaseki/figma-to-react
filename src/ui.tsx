import * as React from 'react'
import * as ReactDom from 'react-dom'
import { CssStyle } from './core/buildCssString'
import { UnitType } from './core/buildSizeStringByUnit'
import { messageTypes } from './model/messagesTypes'
import styles from './ui.css'
import Spacer from './ui/Spacer'
import TabPanel from './ui/TabPanel'
import UserComponentSettingList from './ui/UserComponentSettingList'
import { UserComponentSetting } from './model/userComponentSetting'

import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { renderDesignTokensTab } from './ui/DesignTokensTab'
import { renderPropertiesTab } from './ui/PropertiesTab'
import * as _ from 'lodash'

function escapeHtml(str: string) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quot;')
  str = str.replace(/'/g, '&#39;')
  return str
}

// I tried to use highlight.js https://highlightjs.readthedocs.io/en/latest/index.html
// but didn't like the color. so I give it a go for this dirty style💪
function insertSyntaxHighlightText(text: string) {
  return text
    .replaceAll('const', `const <span class="${styles.variableName}">`)
    .replaceAll(': React.VFC', `</span>: React.VFC`)
    .replaceAll('= styled.', `</span>= styled.`)
    .replaceAll('React.VFC', `<span class="${styles.typeText}">React.VFC</span>`)
    .replaceAll('return', `<span class="${styles.returnText}">return</span>`)
    .replaceAll(': ', `<span class="${styles.expressionText}">: </span>`)
    .replaceAll('= ()', `<span class="${styles.expressionText}">= ()</span>`)
    .replaceAll('{', `<span class="${styles.expressionText}">{</span>`)
    .replaceAll('}', `<span class="${styles.expressionText}">}</span>`)
    .replaceAll('(', `<span class="${styles.expressionText}">(</span>`)
    .replaceAll(')', `<span class="${styles.expressionText}">)</span>`)
    .replaceAll('&lt;', `<span class="${styles.tagText}">&lt;</span><span class="${styles.tagNameText}">`)
    .replaceAll('&gt;', `</span><span class="${styles.tagText}">&gt;</span>`)
    .replaceAll('=</span><span class="tag-text">&gt;</span>', `<span class="${styles.defaultText}">=&gt;</span>`)
    .replaceAll('.div', `<span class="${styles.functionText}">.div</span>`)
    .replaceAll('`', `<span class="${styles.stringText}">${'`'}</span>`)
}

const cssStyles: { value: CssStyle; label: string; disabled: boolean }[] = [
  { value: 'StyleSheet', label: 'StyleSheet', disabled: true },
  { value: 'Restyle', label: 'Restyle', disabled: true },
  { value: 'styled-components', label: 'styled-components', disabled: false }
]

const unitTypes: { value: UnitType; label: string; disabled: boolean }[] = [
  { value: 'px', label: 'px', disabled: false },
  { value: 'rem', label: 'rem', disabled: true },
  { value: 'remAs10px', label: 'rem (as 10px)', disabled: true }
]

const App: React.VFC = () => {
  const [code, setCode] = React.useState('')
  const [nodeProperties, setNodeProperties] = React.useState({})
  const [selectedCssStyle, setCssStyle] = React.useState<CssStyle>('css')
  const [selectedUnitType, setUnitType] = React.useState<UnitType>('px')
  const [tabValue, setTabValue] = React.useState(2)
  const [userComponentSettings, setUserComponentSettings] = React.useState<UserComponentSetting[]>([])
  const textRef = React.useRef<HTMLTextAreaElement>(null)

  // set initial values taken from figma storage
  React.useEffect(() => {
    onmessage = (event) => {
      setCssStyle(event.data.pluginMessage.cssStyle)
      setUnitType(event.data.pluginMessage.unitType)

      const codeStr = event.data.pluginMessage.generatedCodeStr + '\n\n' + event.data.pluginMessage.cssString
      setCode(codeStr)

      setUserComponentSettings(event.data.pluginMessage.userComponentSettings)

      setNodeProperties(event.data.pluginMessage.nodeProperties)
    }
  }, [])

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue)
  }

  const copyToClipboard = () => {
    if (textRef.current) {
      textRef.current.select()
      document.execCommand('copy')

      const msg: messageTypes = { type: 'notify-copy-success' }
      parent.postMessage(msg, '*')
    }
  }

  const notifyChangeCssStyle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const msg: messageTypes = { type: 'new-css-style-set', cssStyle: event.target.value as CssStyle }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const notifyChangeUnitType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const msg: messageTypes = { type: 'new-unit-type-set', unitType: event.target.value as UnitType }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const notifyUpdateComponentSettings = (userComponentSettings: UserComponentSetting[]) => {
    const msg: messageTypes = { type: 'update-user-component-settings', userComponentSettings: userComponentSettings }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const onAddUserComponentSetting = (userComponentSetting: UserComponentSetting) => {
    notifyUpdateComponentSettings([...userComponentSettings, userComponentSetting])
  }

  const onUpdateUserComponentSetting = (userComponentSetting: UserComponentSetting, index: number) => {
    const newUserComponentSettings = [...userComponentSettings]
    newUserComponentSettings[index] = userComponentSetting
    notifyUpdateComponentSettings(newUserComponentSettings)
  }

  const onDeleteUserComponentSetting = (name: string) => {
    notifyUpdateComponentSettings(userComponentSettings.filter((setting) => setting.name !== name))
  }

  const syntaxHighlightedCode = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(code)), [code])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Design Tokens" />
          <Tab label="Properties" />
          <Tab label="Code" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {renderDesignTokensTab()}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderPropertiesTab(nodeProperties, parent)}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {_.isEmpty(nodeProperties) ? (
          <p className={styles.generatedCode}>// No Figma Node selected</p>
        ) : (
          <div>
            <div className={styles.code}>
              <textarea className={styles.textareaForClipboard} ref={textRef} value={code} readOnly />
              <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedCode }} />

              <Spacer axis="vertical" size={12} />

              <div className={styles.buttonLayout}>
                <button className={styles.copyButton} onClick={copyToClipboard}>
                  Copy to clipboard
                </button>
              </div>
            </div>

            <div className={styles.settings}>
              <h2 className={styles.heading}>Settings</h2>

              <Spacer axis="vertical" size={12} />

              <div className={styles.optionList}>
                {cssStyles.map((style) => (
                  <div key={style.value} className={styles.option}>
                    <input
                      type="radio"
                      name="css-style"
                      id={style.value}
                      value={style.value}
                      checked={selectedCssStyle === style.value}
                      disabled={style.disabled}
                      onChange={notifyChangeCssStyle}
                    />
                    <label htmlFor={style.value}>{style.label}</label>
                  </div>
                ))}
              </div>

              <Spacer axis="vertical" size={12} />

              <div className={styles.optionList}>
                {unitTypes.map((unitType) => (
                  <div key={unitType.value} className={styles.option}>
                    <input
                      type="radio"
                      name="unit-type"
                      id={unitType.value}
                      value={unitType.value}
                      checked={selectedUnitType === unitType.value}
                      disabled={unitType.disabled}
                      onChange={notifyChangeUnitType}
                    />
                    <label htmlFor={unitType.value}>{unitType.label}</label>
                  </div>
                ))}
              </div>

              <Spacer axis="vertical" size={12} />

              <UserComponentSettingList
                settings={userComponentSettings}
                onAdd={onAddUserComponentSetting}
                onDelete={onDeleteUserComponentSetting}
                onUpdate={onUpdateUserComponentSetting}
              />
            </div>
          </div>
        )}
      </TabPanel>
    </Box>
  )
}

ReactDom.render(<App />, document.getElementById('app'))
