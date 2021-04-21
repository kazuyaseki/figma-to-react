import { modifyTreeForComponent } from './modifyTreeForComponent'
import { buildCode } from './buildCode'
import { extractCssDatum } from './extractCSSDatum'
import { buildTagTree } from './buildTagTree'

figma.showUI(__html__, { width: 480, height: 440 })

type CssStyle = 'css' | 'styled-components'

const selectedNodes = figma.currentPage.selection
const CSS_STYLE_KEY = 'CSS_STYLE_KEY'

async function generate(node: SceneNode, cssStyle?: CssStyle) {
  let _css = cssStyle
  if (!_css) {
    _css = await figma.clientStorage.getAsync(CSS_STYLE_KEY)

    if (!_css) {
      _css = 'css'
    }
  }

  const tag = modifyTreeForComponent(buildTagTree(node), figma)
  const generatedCodeStr = buildCode(tag, _css)
  const cssDatum = extractCssDatum([], node)

  figma.ui.postMessage({ generatedCodeStr, cssDatum, cssStyle: _css })
}

if (selectedNodes.length > 1) {
  figma.notify('Please select only 1 node')
  figma.closePlugin()
} else if (selectedNodes.length === 0) {
  figma.notify('Please select a node')
  figma.closePlugin()
} else {
  generate(selectedNodes[0])
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'notify-copy-success') {
    figma.notify('copied to clipboard👍')
  }
  if (msg.type === 'new-css-style-set') {
    figma.clientStorage.setAsync(CSS_STYLE_KEY, msg.cssStyle)

    const tag = modifyTreeForComponent(buildTagTree(selectedNodes[0]), figma)
    const generatedCodeStr = buildCode(tag, msg.cssStyle as CssStyle)
    const cssDatum = extractCssDatum([], selectedNodes[0])

    figma.ui.postMessage({ generatedCodeStr, cssDatum })
  }
}
