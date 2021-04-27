import { UnitType } from './buildSizeStringByUnit'
import { modifyTreeForComponent } from './modifyTreeForComponent'
import { buildCode } from './buildCode'
import { buildTagTree } from './buildTagTree'
import { buildCssString, CssStyle } from './buildCssString'

figma.showUI(__html__, { width: 480, height: 440 })

const selectedNodes = figma.currentPage.selection
const CSS_STYLE_KEY = 'CSS_STYLE_KEY'
const UNIT_TYPE_KEY = 'UNIT_TYPE_KEY'

async function generate(node: SceneNode, config: { cssStyle?: CssStyle; unitType?: UnitType }) {
  let cssStyle = config.cssStyle
  if (!cssStyle) {
    cssStyle = await figma.clientStorage.getAsync(CSS_STYLE_KEY)

    if (!cssStyle) {
      cssStyle = 'css'
    }
  }

  let unitType = config.unitType
  if (!unitType) {
    unitType = await figma.clientStorage.getAsync(UNIT_TYPE_KEY)

    if (!unitType) {
      unitType = 'px'
    }
  }
  console.log('hoge')

  const tag = modifyTreeForComponent(buildTagTree(node, unitType), figma)
  console.log(tag)
  const generatedCodeStr = buildCode(tag, cssStyle)
  const cssString = buildCssString(tag, cssStyle)

  figma.ui.postMessage({ generatedCodeStr, cssString, cssStyle, unitType })
}

if (selectedNodes.length > 1) {
  figma.notify('Please select only 1 node')
  figma.closePlugin()
} else if (selectedNodes.length === 0) {
  figma.notify('Please select a node')
  figma.closePlugin()
} else {
  generate(selectedNodes[0], {})
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'notify-copy-success') {
    figma.notify('copied to clipboard👍')
  }
  if (msg.type === 'new-css-style-set') {
    figma.clientStorage.setAsync(CSS_STYLE_KEY, msg.cssStyle)
    generate(selectedNodes[0], { cssStyle: msg.cssStyle })
  }
  if (msg.type === 'new-unit-type-set') {
    figma.clientStorage.setAsync(UNIT_TYPE_KEY, msg.unitType)
    generate(selectedNodes[0], { unitType: msg.unitType })
  }
}
