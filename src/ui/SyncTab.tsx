import * as _ from 'lodash'
import * as React from 'react'
import styles from '../ui.css'
import { useStore } from '../hooks/useStore'
import { messageTypes } from '../model/messagesTypes'
import Spacer from './Spacer'
import { buildDesignTokensJson } from '../core/buildDesignTokensJson'
import { Autocomplete, Button, TextField } from '@material-ui/core'

export const renderSyncTab = (storedProviderSettings: any, parent: any) => {
  const [branchField, setBranchField] = React.useState('')
  const [code, setCode] = React.useState('')
  const [repositoryField, setRepositoryField] = React.useState('')
  const [tokenField, setTokenField] = React.useState('')
  const [usernameField, setUsernameField] = React.useState('')
  const [workflowField, setWorkflowField] = React.useState('')

  const textRef = React.useRef<HTMLTextAreaElement>(null)

  const designTokens = useStore((state) => state.designTokens)
  const designTokensGroups = useStore((state) => state.designTokensGroups)
  const getDesignTokensByGroup = useStore((state) => state.getDesignTokensByGroup)

  React.useEffect(() => {
    console.log('SyncTab useEffect providerSettings')
    console.log(storedProviderSettings)
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

  const syntaxHighlightedCode = React.useMemo(() => code, [code])

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
      <div className={styles.container} style={{ margin: '20px 0px' }}>
        <p style={{ alignSelf: 'center', fontWeight: 'bold', textAlign: 'center' }}>Design Tokens (Provider Configuration)</p>
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
                STORE SETTINGS
              </Button>
              <Button variant="outlined" onClick={onPressClearSettings}>
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
