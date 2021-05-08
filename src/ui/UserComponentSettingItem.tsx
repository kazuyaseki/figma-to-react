import * as React from 'react'
import { UserComponentSetting } from '../userComponentSetting'
import UserComponentSettingField from './UserComponentSettingField'

type Props = {
  setting: UserComponentSetting
  onDelete: (name: string) => void
  onUpdate: (setting: UserComponentSetting) => void
}

export default function UserComponentSettingItem(props: Props) {
  const [updating, setUpdating] = React.useState(false)

  return (
    <div>
      {updating ? (
        <UserComponentSettingField onSubmit={props.onUpdate} />
      ) : (
        <>
          {props.setting.name}
          <button onClick={() => props.onDelete(props.setting.name)}>Delete</button>
        </>
      )}
      <button onClick={() => setUpdating((_updating) => !_updating)}>{updating ? 'cancel' : 'update'}</button>
    </div>
  )
}
