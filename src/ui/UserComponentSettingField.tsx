import * as React from 'react'
import styles from './UserComponentSettingField.css'
import { UserComponentSetting } from '../userComponentSetting'
import Spacer from './Spacer'

type Props = { onSubmit: (userComponentSetting: UserComponentSetting) => void; onCancel: () => void }

export default function UserComponentSettingField(props: Props) {
  const [componentName, setComponentName] = React.useState('')
  const [componentProps, setComponentProps] = React.useState<UserComponentSetting['props']>([
    { name: '', type: 'TEXT', labelNodeName: '' },
    { name: '', type: 'TEXT', labelNodeName: '' },
    { name: '', type: 'TEXT', labelNodeName: '' },
    { name: '', type: 'TEXT', labelNodeName: '' },
    { name: '', type: 'TEXT', labelNodeName: '' }
  ])
  const [childrenNodeName, setChildrenNodeName] = React.useState('')

  const handleAdd = () => {
    props.onSubmit({ name: componentName, props: componentProps, childrenNodeName: childrenNodeName.length > 0 ? childrenNodeName : null })
  }

  const handleEditProps = (prop: UserComponentSetting['props'][number], index: number) => {
    const _props = [...componentProps]
    _props[index] = prop
    setComponentProps(_props)
  }

  return (
    <div className={styles.layout}>
      <h3 className={styles.heading}>Add new component</h3>

      <Spacer size={16} axis="vertical" />

      <div className={styles.row}>
        <label>Component Name:</label>
        <input type="text" value={componentName} className={styles.textField} onChange={(e) => setComponentName(e.target.value)} />
      </div>

      <Spacer size={8} axis="vertical" />

      <div className={styles.row}>
        <label>Children Node Name:</label>
        <input type="text" value={childrenNodeName} className={styles.textField} onChange={(e) => setChildrenNodeName(e.target.value)} />
      </div>

      <Spacer size={16} axis="vertical" />

      <div>
        <h4 className={styles.subheading}>Text Props</h4>
        <Spacer size={4} axis="vertical" />
        <ul className={styles.propList}>
          {componentProps.map((prop, index) => (
            <li className={styles.propListItem}>
              <input
                type="text"
                className={styles.textField}
                value={prop.name}
                onChange={(e) => handleEditProps({ ...componentProps[index], name: e.target.value }, index)}
                placeholder="Prop name"
              />

              <input
                type="text"
                className={styles.textField}
                value={prop.labelNodeName}
                onChange={(e) => handleEditProps({ ...componentProps[index], labelNodeName: e.target.value }, index)}
                placeholder="Figma node name for the prop"
              />
            </li>
          ))}
        </ul>
      </div>

      <Spacer size={20} axis="vertical" />

      <div className={styles.buttonLayout}>
        <button className={styles.buttonOutline} onClick={props.onCancel}>
          Cancel
        </button>
        <button className={styles.button} onClick={handleAdd} disabled={componentName.length === 0}>
          Add
        </button>
      </div>
    </div>
  )
}
