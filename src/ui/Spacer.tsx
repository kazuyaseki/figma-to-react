import * as React from 'react'

type Props = {
  size: number
  axis: 'vertical' | 'horizontal'
}

const Spacer: React.VFC<Props> = ({ size, axis, ...delegated }) => {
  const width = axis === 'vertical' ? 1 : size
  const height = axis === 'horizontal' ? 1 : size
  return (
    <span
      style={{
        display: 'block',
        width,
        minWidth: width,
        height,
        minHeight: height
      }}
      {...delegated}
    />
  )
}
export default Spacer
