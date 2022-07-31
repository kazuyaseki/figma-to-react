const username = ''
const repoName = ''
const githubPAT = '' // keep this secret
import { Base64 } from 'js-base64'

const createBranch = async (branchName: string) => {
  // main の先頭のコミットハッシュを取得
  const fetchRefUrl = `https://api.github.com/repos/${username}/${repoName}/git/refs/heads/main`

  const res = await fetch(fetchRefUrl, {
    method: 'GET',
    headers: {
      Authorization: 'token ' + githubPAT
    }
  })
  const json = await res.json()
  const sha = json.object.sha

  // ブランチを作成
  const createBranchUrl = `https://api.github.com/repos/${username}/${repoName}/git/refs`
  const resCreateBranch = await fetch(createBranchUrl, {
    method: 'POST',
    body: `{"ref": "refs/heads/${branchName}","sha":"${sha}", "force": true}`,
    headers: {
      Authorization: 'token ' + githubPAT
    }
  })
  return await resCreateBranch.json()
}

const createFile = async (branchName: string, componentName: string, code: string, storyString: string) => {
  const createComponentFileUrl = `https://api.github.com/repos/${username}/${repoName}/contents/components/${componentName}/index.tsx`

  const _code = Base64.encode(code)

  await fetch(createComponentFileUrl, {
    method: 'PUT',
    body: `{"ref": "refs/heads/${branchName}","branch":"${branchName}", "message": "add ${componentName}", "content": "${_code}"}`,
    headers: {
      Authorization: 'token ' + githubPAT
    }
  })

  const createStoryFileUrl = `https://api.github.com/repos/${username}/${repoName}/contents/components/${componentName}/${componentName}.stories.tsx`
  const _storyString = Base64.encode(storyString)

  await fetch(createStoryFileUrl, {
    method: 'PUT',
    body: `{"ref": "refs/heads/${branchName}","branch":"${branchName}", "message": "add ${componentName}", "content": "${_storyString}"}`,
    headers: {
      Authorization: 'token ' + githubPAT
    }
  })
}

const createPR = async (componentName: string, branchName: string) => {
  const createPRUrl = `https://api.github.com/repos/${username}/${repoName}/pulls`
  const body = `最高！！！`

  const result = await fetch(createPRUrl, {
    method: 'POST',
    body: `{"title": "Added ${componentName} Component", "base": "main", "head":"${branchName}", "body": "${body}", "draft": true}`,
    headers: {
      Authorization: 'token ' + githubPAT
    }
  })
  const json = await result.json()
  console.log(json)
  return json.html_url
}

export const generatePR = async (componentName: string, code: string, storyString: string) => {
  const branchName = `feature/add-component-${componentName}`.toLowerCase()
  await createBranch(branchName)
  await createFile(branchName, componentName, code, storyString)
  const prUrl = await createPR(componentName, branchName)
  window.open(prUrl, '_blank')
}
