import * as React from 'react'
import { UserComponentSetting } from '../userComponentSetting'
import UserComponentSettingField from './UserComponentSettingField'
import UserComponentSettingItem from './UserComponentSettingItem'

type Props = {
  settings: UserComponentSetting[]
  onAdd: (setting: UserComponentSetting) => void
  onUpdate: (setting: UserComponentSetting) => void
  onDelete: (name: string) => void
}

export default function UserComponentSettingList(props: Props) {
  return (
    <div>
      {props.settings.map((setting) => (
        <UserComponentSettingItem key={setting.name} setting={setting} onDelete={props.onDelete} onUpdate={props.onUpdate} />
      ))}
      <UserComponentSettingField onSubmit={props.onAdd} />
    </div>
  )
}
