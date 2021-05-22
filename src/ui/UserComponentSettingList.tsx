import * as React from 'react'
import styles from './UserComponentSettingList.css'
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
      <h3>Components</h3>

      <ul className={styles.components}>
        {props.settings.map((setting) => (
          <UserComponentSettingItem key={setting.name} setting={setting} onDelete={props.onDelete} onUpdate={props.onUpdate} />
        ))}
      </ul>

      {addingComponent ? (
        <div>
          <UserComponentSettingField
            onSubmit={(userComponentSetting) => {
              props.onAdd(userComponentSetting)
              setAddingComponent(false)
            }}
            onCancel={() => setAddingComponent(false)}
          />
        </div>
      ) : (
        <LinkButton onClick={() => setAddingComponent(true)}>+ Add new component</LinkButton>
      )}
    </div>
  )
}
