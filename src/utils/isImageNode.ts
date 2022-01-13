import { IMAGE_TAG_PREFIX } from './constants'

export function getFigmaObjectAsString(objectKey: string, object: any) {
  let result = ''
  Object.keys(object).map((key) => {
    const value = object && object[key as keyof unknown]
    result += `${objectKey} ${key}: ${value}\n`
  })
  return result
}

export function getItemSpacing(node: SceneNode): number {
  if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
    if (node.layoutMode !== 'NONE') {
      if (node.primaryAxisAlignItems !== 'SPACE_BETWEEN' && node.itemSpacing > 0) {
        return node.itemSpacing
      }
    }
  }
  return 0
}

export function isImageNode(node: SceneNode): boolean {
  if (node.name.startsWith(IMAGE_TAG_PREFIX)) {
    return true
  }
  if ('children' in node && node.children.length > 0) {
    let hasOnlyVector = true
    node.children.forEach((child) => {
      if (child.type !== 'VECTOR') {
        hasOnlyVector = false
      }
    })
    if (hasOnlyVector) {
      return true
    }
  } else if (node.type === 'VECTOR') {
    return true
  }
  if (node.type === 'FRAME' || node.type === 'RECTANGLE') {
    if ((node.fills as Paint[]).find((paint) => paint.type === 'IMAGE') !== undefined) {
      return true
    }
  }

  return false
}
