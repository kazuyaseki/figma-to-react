import { createFigma } from 'figma-api-stub'
import { buildCode } from './buildCode'
import { buildTagTree } from './buildTagTree'
import { TextCount } from './getCssDataForTag'
import { modifyTreeForComponent } from './modifyTreeForComponent'

function createFrameWithDefaultProperties(figma: PluginAPI, config?: { name?: string; isImage?: boolean }) {
  const frameNode = figma.createFrame()
  frameNode.name = config?.name ? config?.name : 'Test'
  frameNode.visible = true
  frameNode.layoutMode = 'NONE'
  frameNode.fills = config?.isImage ? [{ type: 'IMAGE', imageHash: '', scaleMode: 'FILL' }] : []
  frameNode.strokes = []

  return frameNode
}

function createTextNodeWithDefaultProperties(figma: PluginAPI, config?: { name?: string; characters?: string }) {
  const textNode = figma.createText()
  textNode.name = config?.name ? config?.name : 'Test'
  textNode.characters = config?.characters ? config?.characters : 'Test'
  textNode.visible = true
  textNode.fills = []
  textNode.strokes = []
  textNode.letterSpacing = { value: 14, unit: 'PIXELS' }
  textNode.lineHeight = { unit: 'AUTO' }

  return textNode
}

const figma = createFigma({})

describe('when css style is pure CSS', () => {
  test('Frame without children should render only one tag', async () => {
    const frameNode = createFrameWithDefaultProperties(figma)

    const tag = await modifyTreeForComponent(buildTagTree(frameNode, 'px', new TextCount())!, figma)
    expect(buildCode(tag, 'css')).toBe(`const Test: React.VFC = () => {
  return (
    <div className="test" />
  )
}`)
  })

  test('render frame with children', async () => {
    const parentNode = createFrameWithDefaultProperties(figma, { name: 'Parent' })
    const childNode = createFrameWithDefaultProperties(figma, { name: 'Child' })
    parentNode.appendChild(childNode)

    const tag = await modifyTreeForComponent(buildTagTree(parentNode, 'px', new TextCount())!, figma)
    expect(buildCode(tag, 'css')).toBe(`const Parent: React.VFC = () => {
  return (
    <div className="parent">
      <div className="child" />
    </div>
  )
}`)
  })

  test('render Text character', async () => {
    const characters = 'てすと'
    const textNode = createTextNodeWithDefaultProperties(figma, { name: 'Text', characters })

    const tag = await modifyTreeForComponent(buildTagTree(textNode, 'px', new TextCount())!, figma)
    expect(buildCode(tag, 'css')).toBe(`const Text: React.VFC = () => {
  return (
    <p className="text">${characters}</p>
  )
}`)
  })

  test('render Image node', async () => {
    const imageNode = createFrameWithDefaultProperties(figma, { name: 'Image', isImage: true })

    const tag = await modifyTreeForComponent(buildTagTree(imageNode, 'px', new TextCount())!, figma)
    expect(buildCode(tag, 'css')).toBe(`const Img: React.VFC = () => {
  return (
    <img src="" />
  )
}`)
  })
})

describe('when css style is styled-components', () => {
  test('Frame without children should render only one tag', async () => {
    const frameNode = createFrameWithDefaultProperties(figma)

    const tag = await modifyTreeForComponent(buildTagTree(frameNode, 'px', new TextCount())!, figma)
    expect(buildCode(tag, 'styled-components')).toBe(`const Test: React.VFC = () => {
  return (
    <Test />
  )
}`)
  })

  test('render frame with children', async () => {
    const parentNode = createFrameWithDefaultProperties(figma, { name: 'Parent' })
    const childNode = createFrameWithDefaultProperties(figma, { name: 'Child' })
    parentNode.appendChild(childNode)

    const tag = await modifyTreeForComponent(buildTagTree(parentNode, 'px', new TextCount())!, figma)
    expect(buildCode(tag, 'styled-components')).toBe(`const Parent: React.VFC = () => {
  return (
    <Parent>
      <Child />
    </Parent>
  )
}`)
  })

  test('render Text character', async () => {
    const characters = 'てすと'

    const textNode = createTextNodeWithDefaultProperties(figma, { name: 'Text', characters })

    const tag = await modifyTreeForComponent(buildTagTree(textNode, 'px', new TextCount())!, figma)
    expect(buildCode(tag, 'styled-components')).toBe(`const Text: React.VFC = () => {
  return (
    <Text>${characters}</Text>
  )
}`)
  })

  test('render Image node', async () => {
    const imageNode = createFrameWithDefaultProperties(figma, { name: 'Image', isImage: true })

    const tag = await modifyTreeForComponent(buildTagTree(imageNode, 'px', new TextCount())!, figma)
    expect(buildCode(tag, 'styled-components')).toBe(`const Img: React.VFC = () => {
  return (
    <img src="" />
  )
}`)
  })
})

test('render Frame with invisible node', async () => {
  const parentNode = createFrameWithDefaultProperties(figma, { name: 'Parent' })
  const childNode = createFrameWithDefaultProperties(figma, { name: 'Child' })
  childNode.visible = false
  parentNode.appendChild(childNode)

  const tag = await modifyTreeForComponent(buildTagTree(parentNode, 'px', new TextCount())!, figma)
  expect(buildCode(tag, 'styled-components')).toBe(`const Parent: React.VFC = () => {
  return (
    <Parent />
  )
}`)
})
