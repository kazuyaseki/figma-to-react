import * as React from 'react'
import styles from './LinkButton.css'

type Props = {
  onClick: () => void
  children: React.ReactNode
}

export default function LinkButton(props: Props) {
  return (
    <button className={styles.button} onClick={props.onClick}>
      {props.children}
    </button>
  )
}
