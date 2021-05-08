import * as React from 'react'
import { UserComponentSetting } from '../userComponentSetting'

type Props = { onSubmit: (userComponentSetting: UserComponentSetting) => void }

export default function UserComponentSettingField(props: Props) {
  const [componentName, setComponentName] = React.useState('')
  const [editingProp, setEditingProps] = React.useState<UserComponentSetting['props'][number]>({ type: 'TEXT', name: '', labelNodeName: '' })
  const [componentProps, setComponentProps] = React.useState<UserComponentSetting['props']>([])
  const [childrenNodeName, setChildrenNodeName] = React.useState('')

  const handleAdd = () => {
    props.onSubmit({ name: componentName, props: componentProps, childrenNodeName: childrenNodeName.length > 0 ? childrenNodeName : null })
  }

  const handleAddProp = () => {
    setComponentProps([...componentProps, editingProp])
    setEditingProps({ type: 'TEXT', name: '', labelNodeName: '' })
  }

  return (
    <div>
      <div>
        <input type="text" value={componentName} onChange={(e) => setComponentName(e.target.value)} />
        <label>Component Name</label>
      </div>

      <div>
        <h3>props</h3>
        <ul>
          {componentProps.map((prop) => (
            <li>
              <p>{prop.name}</p>
              <p>{prop.labelNodeName}</p>
            </li>
          ))}
        </ul>

        <div>
          <div>
            <input type="text" value={editingProp.name} onChange={(e) => setEditingProps({ ...editingProp, name: e.target.value })} />
            <label>prop Name</label>
          </div>
          <div>
            <input type="text" value={editingProp.labelNodeName} onChange={(e) => setEditingProps({ ...editingProp, labelNodeName: e.target.value })} />
            <label>prop labelNodeName</label>
          </div>
          <button onClick={handleAddProp}>add prop</button>
        </div>
      </div>

      <div>
        <input type="text" value={childrenNodeName} onChange={(e) => setChildrenNodeName(e.target.value)} />
        <label>Children Node Name</label>
      </div>

      <button className="button" onClick={handleAdd} disabled={componentName.length === 0}>
        Add
      </button>
    </div>
  )
}
