export const isImageNode = (node: SceneNode) => {
  // 下部に Vector しか存在しないものは画像と判定する
  if ('children' in node) {
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
