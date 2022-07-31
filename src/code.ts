import { STORAGE_KEYS } from './storageKeys'
import { messageTypes } from './messagesTypes'
import { UnitType } from './buildSizeStringByUnit'
import { modifyTreeForComponent } from './modifyTreeForComponent'
import { buildCode } from './buildCode'
import { buildTagTree } from './buildTagTree'
import { buildCssString, CssStyle } from './buildCssString'
import { UserComponentSetting } from './userComponentSetting'
import { TextCount } from './getCssDataForTag'
import { capitalizeFirstLetter } from './utils/stringUtils'

figma.showUI(__html__, { width: 480, height: 480 })

const selectedNodes = figma.currentPage.selection

async function generate(node: SceneNode, config: { cssStyle?: CssStyle; unitType?: UnitType }) {
  let cssStyle = config.cssStyle
  if (!cssStyle) {
    cssStyle = await figma.clientStorage.getAsync(STORAGE_KEYS.CSS_STYLE_KEY)

    if (!cssStyle) {
      cssStyle = 'css'
    }
  }

  let unitType = config.unitType
  if (!unitType) {
    unitType = await figma.clientStorage.getAsync(STORAGE_KEYS.UNIT_TYPE_KEY)

    if (!unitType) {
      unitType = 'px'
    }
  }

  const userComponentSettings: UserComponentSetting[] = (await figma.clientStorage.getAsync(STORAGE_KEYS.USER_COMPONENT_SETTINGS_KEY)) || []

  const textCount = new TextCount()

  const originalTagTree = buildTagTree(node, unitType, textCount)
  if (originalTagTree === null) {
    figma.notify('Please select a visible node')
    return
  }

  const tag = await modifyTreeForComponent(originalTagTree, figma)

  const component = tag.node.parent
  let variantGroupProperties: {
    [property: string]: {
      values: string[]
    }
  } = {}
  let props: string[] = []
  if (component?.type === 'COMPONENT_SET') {
    tag.name = capitalizeFirstLetter(component.name)
    variantGroupProperties = component.variantGroupProperties
    props = Object.keys(variantGroupProperties)
  }
  const generatedCodeStr = buildCode(tag, cssStyle, props, variantGroupProperties)
  const cssString = buildCssString(tag, cssStyle)

  const storyString = `import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ${tag.name} } from '.';

export default {
  title: '${tag.name}',
  component: ${tag.name},
  argTypes: {
    ${props
      .map(
        (prop) => `${prop}: {
      options: [${variantGroupProperties[prop].values.map((val) => `"${val}"`).join(',')}],
      control: { type: 'radio' },
    }`
      )
      .join(',\n    ')}
  },
} as ComponentMeta<typeof ${tag.name}>;

const Template: ComponentStory<typeof ${tag.name}> = (args) => <${tag.name} {...args} />;
`

  figma.ui.postMessage({ generatedCodeStr, cssString, cssStyle, unitType, userComponentSettings, storyString, componentName: tag.name })
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

figma.ui.onmessage = (msg: messageTypes) => {
  if (msg.type === 'notify-copy-success') {
    figma.notify('copied to clipboard👍')
  }
  if (msg.type === 'new-css-style-set') {
    figma.clientStorage.setAsync(STORAGE_KEYS.CSS_STYLE_KEY, msg.cssStyle)
    generate(selectedNodes[0], { cssStyle: msg.cssStyle })
  }
  if (msg.type === 'new-unit-type-set') {
    figma.clientStorage.setAsync(STORAGE_KEYS.UNIT_TYPE_KEY, msg.unitType)
    generate(selectedNodes[0], { unitType: msg.unitType })
  }
  if (msg.type === 'update-user-component-settings') {
    figma.clientStorage.setAsync(STORAGE_KEYS.USER_COMPONENT_SETTINGS_KEY, msg.userComponentSettings)
    generate(selectedNodes[0], {})
  }
}
