import * as _ from 'lodash'
import * as React from 'react'
import styles from '../ui.css'
import { useStore } from '../hooks/useStore'
import { messageTypes } from '../model/messagesTypes'
import Spacer from './Spacer'
import { buildDesignTokensJson, buildRestyleThemeObject } from '../core/buildDesignTokensJson'
import { Autocomplete, Button, TextField } from '@material-ui/core'

export const renderSyncTab = (storedProviderSettings: any, parent: any) => {
  const [branchField, setBranchField] = React.useState('')
  const [designTokensCode, setDesignTokensCode] = React.useState('')
  const [repositoryField, setRepositoryField] = React.useState('')
  const [restyleThemeCode, setRestyleThemeCode] = React.useState('')
  const [tokenField, setTokenField] = React.useState('')
  const [usernameField, setUsernameField] = React.useState('')
  const [workflowField, setWorkflowField] = React.useState('')

  const designTokensTextRef = React.useRef<HTMLTextAreaElement>(null)
  const restyleThemeTextRef = React.useRef<HTMLTextAreaElement>(null)

  const designTokens = useStore((state) => state.designTokens)
  const designTokensGroups = useStore((state) => state.designTokensGroups)
  const getDesignTokensByGroup = useStore((state) => state.getDesignTokensByGroup)

  React.useEffect(() => {
    if (!_.isEmpty(storedProviderSettings)) {
      const { branch, repo, token, user, workflow } = storedProviderSettings
      setBranchField(branch)
      setRepositoryField(repo)
      setTokenField(token)
      setUsernameField(user)
      setWorkflowField(workflow)
    }
  }, [storedProviderSettings])

  React.useEffect(() => {
    const designTokensJson = buildDesignTokensJson(designTokens, designTokensGroups, getDesignTokensByGroup)
    const designTokensCodeStr = JSON.stringify(designTokensJson, null, 2)
    const restyleThemeObject = buildRestyleThemeObject(designTokensJson)
    const restyleThemeObjectStr = JSON.stringify(restyleThemeObject, null, 2).replaceAll('"', '').trim()
    const restyleThemeCodeStr = `import tokens from './tokens.json';
import { createTheme } from '@shopify/restyle';

const theme = createTheme(${restyleThemeObjectStr});

export type Theme = typeof theme;
export default theme;
`

    setDesignTokensCode(designTokensCodeStr)
    setRestyleThemeCode(restyleThemeCodeStr)
  }, [designTokens, designTokensGroups])

  const onPressCopyDesignTokensToClipboard = () => {
    if (designTokensTextRef.current) {
      designTokensTextRef.current.select()
      document.execCommand('copy')
      const msg: messageTypes = { type: 'notify-copy-success' }
      parent.postMessage(msg, '*')
    }
  }

  const onPressCopyRestyleThemeToClipboard = () => {
    if (restyleThemeTextRef.current) {
      restyleThemeTextRef.current.select()
      document.execCommand('copy')
      const msg: messageTypes = { type: 'notify-copy-success' }
      parent.postMessage(msg, '*')
    }
  }

  const onPressExportToJson = () => {
    const element = document.createElement('a')
    const textFile = new Blob([syntaxHighlightedDesignTokensCode], { type: 'text/plain' }) //pass data from localStorage API to blob
    element.href = URL.createObjectURL(textFile)
    element.download = 'tokens.json'
    document.body.appendChild(element)
    element.click()
  }

  const onPressExportToTypescript = () => {
    const element = document.createElement('a')
    const textFile = new Blob([syntaxHighlightedRestyleThemeCode], { type: 'text/plain' }) //pass data from localStorage API to blob
    element.href = URL.createObjectURL(textFile)
    element.download = 'theme.ts'
    document.body.appendChild(element)
    element.click()
  }

  const onPressSendToProvider = async () => {
    const branch = branchField
    const user = usernameField
    const repo = repositoryField
    const token = tokenField
    const workflow = workflowField

    const url = `https://api.github.com/repos/${user}/${repo}/actions/workflows/${workflow}/dispatches`

    const body = {
      ref: branch,
      inputs: {
        branch,
        tokens: syntaxHighlightedDesignTokensCode,
        theme: syntaxHighlightedRestyleThemeCode
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
        if (res.status >= 200 && res.status < 300) alert('Generated Files successfully sent to provider!')
        else alert(text)
      })
      .catch((error) => alert(error))
  }

  const onPressClearSettings = () => {
    setBranchField('')
    setUsernameField('')
    setRepositoryField('')
    setTokenField('')
    setWorkflowField('')
  }

  const onPressStoreSettings = () => {
    const providerSettings = {
      branch: branchField,
      user: usernameField,
      repo: repositoryField,
      token: tokenField,
      workflow: workflowField
    }

    const msg: messageTypes = { type: 'store-provider-settings', providerSettings }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const syntaxHighlightedDesignTokensCode = React.useMemo(() => designTokensCode, [designTokensCode])
  const syntaxHighlightedRestyleThemeCode = React.useMemo(() => restyleThemeCode, [restyleThemeCode])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
      <div className={styles.container}>
        <p style={{ alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>Design Tokens (Generated JSON)</p>
        {_.isEmpty(designTokensGroups) ? (
          <div style={{ margin: '20px 0px' }}>
            <p className={styles.generatedCode}>// No Design Tokens Groups</p>
          </div>
        ) : (
          <div style={{ margin: '20px 0px' }}>
            <div>
              <textarea className={styles.textareaForClipboard} ref={designTokensTextRef} value={designTokensCode} readOnly />
              <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedDesignTokensCode }} />

              <Spacer axis="vertical" size={12} />

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="outlined" onClick={onPressCopyDesignTokensToClipboard}>
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
      <div className={styles.container} style={{ margin: '20px 0px' }}>
        <p style={{ alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>Restyle Theme (Generated JS)</p>
        {_.isEmpty(syntaxHighlightedRestyleThemeCode) ? (
          <div style={{ margin: '20px 0px' }}>
            <p className={styles.generatedCode}>// No Restyle Theme Code</p>
          </div>
        ) : (
          <div style={{ margin: '20px 0px' }}>
            <div>
              <textarea className={styles.textareaForClipboard} ref={restyleThemeTextRef} value={restyleThemeCode} readOnly />
              <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedRestyleThemeCode }} />

              <Spacer axis="vertical" size={12} />

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="outlined" onClick={onPressCopyRestyleThemeToClipboard}>
                  COPY TO CLIPBOARD
                </Button>
                <Button variant="outlined" onClick={onPressExportToTypescript}>
                  EXPORT TO TYPESCRIPT
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.container} style={{ margin: '20px 0px' }}>
        <p style={{ alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>Provider Configuration</p>
        <div style={{ margin: '20px 0px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                <TextField
                  fullWidth
                  id="personalAccessToken"
                  label="Personal Access Token"
                  onChange={(evt) => {
                    setTokenField(evt.target.value)
                  }}
                  size="small"
                  style={{ backgroundColor: '#fff' }}
                  type="password"
                  value={tokenField}
                />
              </div>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <TextField
                  fullWidth
                  id="username"
                  label="Username"
                  onChange={(evt) => {
                    setUsernameField(evt.target.value)
                  }}
                  size="small"
                  style={{ backgroundColor: '#fff' }}
                  value={usernameField}
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  fullWidth
                  id="repositoryName"
                  label="Repository"
                  onChange={(evt) => {
                    setRepositoryField(evt.target.value)
                  }}
                  size="small"
                  style={{ backgroundColor: '#fff' }}
                  value={repositoryField}
                />
              </div>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <TextField
                  fullWidth
                  id="workflowName"
                  label="Workflow filename"
                  onChange={(evt) => {
                    setWorkflowField(evt.target.value)
                  }}
                  placeholder="main.yml"
                  size="small"
                  style={{ backgroundColor: '#fff' }}
                  value={workflowField}
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  fullWidth
                  id="branch"
                  label="Branch"
                  onChange={(evt) => {
                    setBranchField(evt.target.value)
                  }}
                  placeholder="main"
                  size="small"
                  style={{ backgroundColor: '#fff' }}
                  value={branchField}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <Button variant="outlined" onClick={onPressStoreSettings}>
                SAVE
              </Button>
              <Button variant="outlined" onClick={onPressClearSettings}>
                CLEAR
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
