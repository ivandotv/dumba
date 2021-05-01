import { observer } from 'mobx-react-lite'
import { FieldInfo } from './FieldInfo'
import { useForm } from './formStore'

const Watch = observer(function Watch() {
  const formStore = useForm()

  return (
    <div className="watch">
      <FieldInfo field={formStore.fields.name}>
        <span>Only letters (a-zA-Z), minimum 3 characters</span>
      </FieldInfo>
      <FieldInfo field={formStore.fields.email}>
        <span>Valid email address</span>
      </FieldInfo>
      <FieldInfo field={formStore.fields.masked}>
        <span>Only letters ABC</span>
      </FieldInfo>
      <FieldInfo
        field={formStore.fields.types}
        name="Types Dropdown"
      ></FieldInfo>
      <FieldInfo field={formStore.fields.numberOrString}>
        <span>
          Numbers or letters depeding on <strong>types dropdown</strong>
        </span>
      </FieldInfo>
    </div>
  )
})

export { Watch }
