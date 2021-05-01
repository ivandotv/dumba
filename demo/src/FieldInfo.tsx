import { Field } from 'dumba/dist/types'
import { observer } from 'mobx-react-lite'

const FieldInfo = observer(function FieldInfo({
  field,
  children,
  name
}: {
  field: Field<any>
  name?: string
  children?: React.ReactNode
}) {
  console.log('field is valid : ', field.isValid)
  return (
    <fieldset>
      <legend>
        {name
          ? name
          : `${field.name.slice(0, 1).toUpperCase()}${field.name.slice(1)}: ${
              field.value
            }`}
      </legend>
      <div>
        {children}
        {field.errors?.length ? (
          <>
            <p>Errors:</p>
            <ul>
              {field.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>No errors</p>
        )}
      </div>
    </fieldset>
  )
})

export { FieldInfo }
