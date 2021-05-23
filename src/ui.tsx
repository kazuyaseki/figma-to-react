import * as React from 'react'
import * as ReactDom from 'react-dom'
import { CssStyle } from './buildCssString'
import { UnitType } from './buildSizeStringByUnit'
import { messageTypes } from './messagesTypes'
import styles from './ui.css'
import Spacer from './ui/Spacer'
import UserComponentSettingList from './ui/UserComponentSettingList'
import { UserComponentSetting } from './userComponentSetting'

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

const cssStyles: { value: CssStyle; label: string }[] = [
  { value: 'css', label: 'CSS' },
  { value: 'styled-components', label: 'styled-components' }
]

const unitTypes: { value: UnitType; label: string }[] = [
  { value: 'px', label: 'px' },
  { value: 'rem', label: 'rem' },
  { value: 'remAs10px', label: 'rem(as 10px)' }
]

const App: React.VFC = () => {
  const [code, setCode] = React.useState('')
  const [selectedCssStyle, setCssStyle] = React.useState<CssStyle>('css')
  const [selectedUnitType, setUnitType] = React.useState<UnitType>('px')
  const [userComponentSettings, setUserComponentSettings] = React.useState<UserComponentSetting[]>([])
  const textRef = React.useRef<HTMLTextAreaElement>(null)

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

  // set initial values taken from figma storage
  React.useEffect(() => {
    onmessage = (event) => {
      setCssStyle(event.data.pluginMessage.cssStyle)
      setUnitType(event.data.pluginMessage.unitType)
      const codeStr = event.data.pluginMessage.generatedCodeStr + '\n\n' + event.data.pluginMessage.cssString
      setCode(codeStr)
      setUserComponentSettings(event.data.pluginMessage.userComponentSettings)
    }
  }, [])

  return (
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
              <input type="radio" name="css-style" id={style.value} value={style.value} checked={selectedCssStyle === style.value} onChange={notifyChangeCssStyle} />
              <label htmlFor={style.value}>{style.label}</label>
            </div>
          ))}
        </div>

        <Spacer axis="vertical" size={12} />

        <div className={styles.optionList}>
          {unitTypes.map((unitType) => (
            <div key={unitType.value} className={styles.option}>
              <input type="radio" name="unit-type" id={unitType.value} value={unitType.value} checked={selectedUnitType === unitType.value} onChange={notifyChangeUnitType} />
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
  )
}

ReactDom.render(<App />, document.getElementById('app'))
