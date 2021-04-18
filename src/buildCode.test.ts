import { createFigma } from 'figma-api-stub'
import { buildCode } from './buildCode'

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
  test('Frame without children should render only one tag', () => {
    const frameNode = createFrameWithDefaultProperties(figma)
    expect(buildCode(frameNode, 'css', figma)).toBe(`const Test: React.VFC = () => {
  return (
    <div className="test" />
  )
}`)
  })

  test('render frame with children', () => {
    const parentNode = createFrameWithDefaultProperties(figma, { name: 'Parent' })
    const childNode = createFrameWithDefaultProperties(figma, { name: 'Child' })
    parentNode.appendChild(childNode)

    expect(buildCode(parentNode, 'css', figma)).toBe(`const Parent: React.VFC = () => {
  return (
    <div className="parent">
      <div className="child" />
    </div>
  )
}`)
  })

  test('render Text character', () => {
    const characters = 'てすと'
    const textNode = createTextNodeWithDefaultProperties(figma, { name: 'Text', characters })

    expect(buildCode(textNode, 'css', figma)).toBe(`const Text: React.VFC = () => {
  return (
    <p className="text">
      ${characters}
    </p>
  )
}`)
  })

  test('render Image node', () => {
    const imageNode = createFrameWithDefaultProperties(figma, { name: 'Image', isImage: true })

    expect(buildCode(imageNode, 'css', figma)).toBe(`const Image: React.VFC = () => {
  return (
    <img src="" />
  )
}`)
  })
})

describe('when css style is styled-components', () => {
  test('Frame without children should render only one tag', () => {
    const frameNode = createFrameWithDefaultProperties(figma)
    expect(buildCode(frameNode, 'styled-components', figma)).toBe(`const Test: React.VFC = () => {
  return (
    <Test />
  )
}`)
  })

  test('render frame with children', () => {
    const parentNode = createFrameWithDefaultProperties(figma, { name: 'Parent' })
    const childNode = createFrameWithDefaultProperties(figma, { name: 'Child' })
    parentNode.appendChild(childNode)

    expect(buildCode(parentNode, 'styled-components', figma)).toBe(`const Parent: React.VFC = () => {
  return (
    <Parent>
      <Child />
    </Parent>
  )
}`)
  })

  test('render Text character', () => {
    const characters = 'てすと'

    const textNode = createTextNodeWithDefaultProperties(figma, { name: 'Text', characters })

    expect(buildCode(textNode, 'styled-components')).toBe(`const Text: React.VFC = () => {
  return (
    <Text>
      ${characters}
    </Text>
  )
}`)
  })

  test('render Image node', () => {
    const imageNode = createFrameWithDefaultProperties(figma, { name: 'Image', isImage: true })

    expect(buildCode(imageNode, 'styled-components')).toBe(`const Image: React.VFC = () => {
  return (
    <Image src="" />
  )
}`)
  })
})
