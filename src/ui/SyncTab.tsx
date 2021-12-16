import * as _ from 'lodash'
import * as React from 'react'
import styles from '../ui.css'
import { useStore } from '../hooks/useStore'
import { messageTypes } from '../model/messagesTypes'
import Spacer from './Spacer'
import { buildDesignTokensJson } from '../core/buildDesignTokensJson'
import { Autocomplete, Button, TextField } from '@material-ui/core'

export const renderSyncTab = (parent: any) => {
  const [code, setCode] = React.useState('')

  const branchFieldRef = React.useRef(null)
  const personalAccessTokenFieldRef = React.useRef(null)
  const repositoryNameFieldRef = React.useRef(null)
  const usernameFieldRef = React.useRef(null)
  const workflowNameFieldRef = React.useRef(null)

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

  const onPressSendToProvider = async () => {
    const branch = branchFieldRef?.current?.value
    const user = usernameFieldRef?.current?.value
    const repo = repositoryNameFieldRef?.current?.value
    const token = personalAccessTokenFieldRef?.current?.value
    const workflow = workflowNameFieldRef?.current?.value

    const url = `https://api.github.com/repos/${user}/${repo}/actions/workflows/${workflow}/dispatches`

    const body = {
      ref: branch,
      inputs: {
        branch,
        message: syntaxHighlightedCode
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `token ${token}`
    }

    await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
      .then(async (res) => {
        const text = await res.text()
        if (res.status >= 200 && res.status < 300) alert('Design Tokens successfully sent to provider!')
        else alert(text)
      })
      .catch((error) => alert(error))
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
            <div className={styles.container}>
              <textarea className={styles.textareaForClipboard} ref={textRef} value={code} readOnly />
              <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedCode }} />

              <Spacer axis="vertical" size={12} />

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="outlined" onClick={onPressCopyToClipboard}>
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
      <div>
        <p style={{ alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>Design Tokens (Provider Configuration)</p>
        <div style={{ margin: '20px 0px' }}>
          <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p>Provider</p>
              </div>
              <div style={{ flex: 1 }}>
                <Autocomplete
                  disabled
                  id="combo-providers"
                  options={[]}
                  renderInput={(params) => <TextField {...params} size="small" />}
                  size="small"
                  sx={{ width: 250 }}
                  value="GitHub Actions"
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p>Personal Access Token</p>
              </div>
              <div style={{ flex: 1 }}>
                <TextField id="personalAccessToken" inputRef={personalAccessTokenFieldRef} size="small" style={{ backgroundColor: '#fff' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p>GitHub Username</p>
              </div>
              <div style={{ flex: 1 }}>
                <TextField id="username" inputRef={usernameFieldRef} size="small" style={{ backgroundColor: '#fff' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p>GitHub Repository name</p>
              </div>
              <div style={{ flex: 1 }}>
                <TextField id="repositoryName" inputRef={repositoryNameFieldRef} size="small" style={{ backgroundColor: '#fff' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p>GitHub Workflow filename</p>
              </div>
              <div style={{ flex: 1 }}>
                <TextField id="workflowName" inputRef={workflowNameFieldRef} placeholder="main.yml" size="small" style={{ backgroundColor: '#fff' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p>GitHub Branch</p>
              </div>
              <div style={{ flex: 1 }}>
                <TextField id="branch" inputRef={branchFieldRef} size="small" placeholder="main" style={{ backgroundColor: '#fff' }} />
              </div>
            </div>
            <Spacer axis="vertical" size={12} />
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <Button disabled variant="outlined" onClick={onPressCopyToClipboard}>
                STORE SETTINGS
              </Button>
              <Button disabled variant="outlined" onClick={onPressExportToJson}>
                CLEAR SETTINGS
              </Button>
              <Button variant="contained" onClick={onPressSendToProvider}>
                SEND TO PROVIDER
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
