import * as React from 'react'
import { UserComponentSetting } from '../userComponentSetting'

type Props = {
  setting: UserComponentSetting
  onDelete: (name: string) => void
  onUpdate: (setting: UserComponentSetting) => void
}

export default function UserComponentSettingItem(props: Props) {
  return (
    <div>
      {props.setting.name}
      <button onClick={() => props.onDelete(props.setting.name)}>Delete</button>
    </div>
  )
}
