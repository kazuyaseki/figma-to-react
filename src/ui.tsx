import * as React from 'react'
import * as ReactDom from 'react-dom'
import { CssStyle } from './buildCssString'
import { UnitType } from './buildSizeStringByUnit'
import styles from './ui.css'

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
    .replaceAll('const', 'const <span class="variable-name">')
    .replaceAll(': React.VFC', '</span>: React.VFC')
    .replaceAll('= styled.', '</span>= styled.')
    .replaceAll('React.VFC', '<span class="type-text">React.VFC</span>')
    .replaceAll('return', '<span class="return-text">return</span>')
    .replaceAll(': ', '<span class="expression-text">: </span>')
    .replaceAll('= ()', '<span class="expression-text">= ()</span>')
    .replaceAll('{', '<span class="expression-text">{</span>')
    .replaceAll('}', '<span class="expression-text">}</span>')
    .replaceAll('(', '<span class="expression-text">(</span>')
    .replaceAll(')', '<span class="expression-text">)</span>')
    .replaceAll('&lt;', '<span class="tag-text">&lt;</span><span class="tag-name-text">')
    .replaceAll('&gt;', '</span><span class="tag-text">&gt;</span>')
    .replaceAll('=</span><span class="tag-text">&gt;</span>', '<span class="default-text">=&gt;</span>')
    .replaceAll('.div', '<span class="function-text">.div</span>')
    .replaceAll('`', '<span class="string-text">`</span>')
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
  const textRef = React.useRef<HTMLTextAreaElement>(null)

  const copyToClipboard = () => {
    if (textRef.current) {
      textRef.current.select()
      document.execCommand('copy')
      parent.postMessage({ pluginMessage: { type: 'notify-copy-success' } }, '*')
    }
  }

  const notifyChangeCssStyle = (event: React.ChangeEvent<HTMLInputElement>) => {
    parent.postMessage({ pluginMessage: { type: 'new-css-style-set', cssStyle: event.target.value } }, '*')
  }

  const notifyChangeUnitType = (event: React.ChangeEvent<HTMLInputElement>) => {
    parent.postMessage({ pluginMessage: { type: 'new-unit-type-set', unitType: event.target.value } }, '*')
  }

  const syntaxHighlightedCode = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(code)), [code])

  React.useEffect(() => {
    onmessage = (event) => {
      setCssStyle(event.data.pluginMessage.cssStyle)
      setUnitType(event.data.pluginMessage.unitType)
      const codeStr = event.data.pluginMessage.generatedCodeStr + '\n\n' + event.data.pluginMessage.cssString
      setCode(codeStr)
    }
  }, [])

  return (
    <div className="layout">
      <textarea className="textarea-for-clipboard" ref={textRef} value={code} readOnly />
      <p id="generated-code" className={styles.jsx} dangerouslySetInnerHTML={{ __html: syntaxHighlightedCode }} />

      <div className="switch-css-format">
        {cssStyles.map((style) => (
          <React.Fragment key={style.value}>
            <input type="radio" name="css-style" id={style.value} value={style.value} checked={selectedCssStyle === style.value} onChange={notifyChangeCssStyle} />
            <label htmlFor={style.value}>{style.label}</label>
          </React.Fragment>
        ))}
      </div>

      <div className="switch-unit-type">
        {unitTypes.map((unitType) => (
          <React.Fragment key={unitType.value}>
            <input type="radio" name="unit-type" id={unitType.value} value={unitType.value} checked={selectedUnitType === unitType.value} onChange={notifyChangeUnitType} />
            <label htmlFor={unitType.value}>{unitType.label}</label>
          </React.Fragment>
        ))}
      </div>

      <div className="button-layout">
        <button className="copy-button" onClick={copyToClipboard}>
          Copy to clipboard
        </button>
      </div>
    </div>
  )
}

ReactDom.render(<App />, document.getElementById('app'))
