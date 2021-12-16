import * as _ from 'lodash'
import * as React from 'react'
import styles from '../ui.css'
import { useStore } from '../hooks/useStore'
import { messageTypes } from '../model/messagesTypes'
import Spacer from './Spacer'
import { buildDesignTokensJson } from '../core/buildDesignTokensJson'
import { Button } from '@material-ui/core'

export const renderSyncTab = (parent: any) => {
  const [code, setCode] = React.useState('')

  const textRef = React.useRef<HTMLTextAreaElement>(null)

  const designTokens = useStore((state) => state.designTokens)
  const designTokensGroups = useStore((state) => state.designTokensGroups)
  const getDesignTokensByGroup = useStore((state) => state.getDesignTokensByGroup)

  // set initial values taken from figma storage
  React.useEffect(() => {
    const designTokensJson = buildDesignTokensJson(designTokens, designTokensGroups, getDesignTokensByGroup)
    const codeStr = JSON.stringify(designTokensJson, null, 2)
    setCode(codeStr)
  }, [designTokens, designTokensGroups])

  const onPressCopyToClipboard = () => {
    if (textRef.current) {
      textRef.current.select()
      document.execCommand('copy')
      const msg: messageTypes = { type: 'notify-copy-success' }
      parent.postMessage(msg, '*')
    }
  }

  const onPressExportToJson = () => {
    const element = document.createElement('a')
    const textFile = new Blob([syntaxHighlightedCode], { type: 'text/plain' }) //pass data from localStorage API to blob
    element.href = URL.createObjectURL(textFile)
    element.download = 'tokens.json'
    document.body.appendChild(element)
    element.click()
  }

  const syntaxHighlightedCode = React.useMemo(() => code, [code])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
      <div>
        <p style={{ alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>Design Tokens (Generated JSON)</p>
        {_.isEmpty(designTokensGroups) ? (
          <div style={{ margin: '20px 0px' }}>
            <p className={styles.generatedCode}>// No Design Tokens Groups</p>
          </div>
        ) : (
          <div style={{ margin: '20px 0px' }}>
            <div className={styles.code}>
              <textarea className={styles.textareaForClipboard} ref={textRef} value={code} readOnly />
              <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedCode }} />

              <Spacer axis="vertical" size={12} />

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="outlined" onClick={onPressCopyToClipboard} style={{ marginRight: '20px' }}>
                  COPY TO CLIPBOARD
                </Button>
                <Button variant="outlined" onClick={onPressExportToJson}>
                  EXPORT TO JSON
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
