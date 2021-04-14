import { createFigma } from 'figma-api-stub'
import { buildCode } from './buildCode'

test('Frame without children', () => {
  const figma = createFigma({})
  const frameNode = figma.createFrame()
  frameNode.name = 'Test'
  frameNode.visible = true
  frameNode.layoutMode = 'NONE'
  frameNode.fills = []
  frameNode.strokes = []

  expect(buildCode(frameNode, 'styled-components')).toBe(`const Test: React.VFC = () => {
  return (
    <Test />
  )
}`)
})
