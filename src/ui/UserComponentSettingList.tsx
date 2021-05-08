import * as React from 'react'
import { UserComponentSetting } from '../userComponentSetting'
import LinkButton from './LinkButton'
import UserComponentSettingField from './UserComponentSettingField'
import UserComponentSettingItem from './UserComponentSettingItem'

type Props = {
  settings: UserComponentSetting[]
  onAdd: (setting: UserComponentSetting) => void
  onUpdate: (setting: UserComponentSetting) => void
  onDelete: (name: string) => void
}

export default function UserComponentSettingList(props: Props) {
  const [addingComponent, setAddingComponent] = React.useState(false)

  return (
    <div>
      <ul>
        {props.settings.map((setting) => (
          <UserComponentSettingItem key={setting.name} setting={setting} onDelete={props.onDelete} onUpdate={props.onUpdate} />
        ))}
      </ul>

      {addingComponent ? (
        <div>
          <UserComponentSettingField onSubmit={props.onAdd} />
        </div>
      ) : (
        <LinkButton onClick={() => setAddingComponent(true)}>+ Add another component</LinkButton>
      )}
    </div>
  )
}
