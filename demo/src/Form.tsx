import { isObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useForm } from './formStore'

const Form = observer(function Form() {
  const formStore = useForm()

  console.log('value', formStore.fields.name.value)
  // console.log('is observable ', isObservable(formStore.fields.name.value))
  console.log('is valid ', formStore.fields.name.isValid)
  console.log('errors ', formStore.fields.name.errors)

  return (
    <div className="formWrap">
      <form>
        <fieldset>
          <legend>Form Demo</legend>
          <div
            className={!formStore.fields.name.isValid ? 'not-valid' : undefined}
          >
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formStore.fields.name.onChange}
            />
          </div>
          <div
            className={
              !formStore.fields.email.isValid ? 'not-valid' : undefined
            }
          >
            <label htmlFor="name">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formStore.fields.email.value}
              onChange={formStore.fields.email.onChange}
            />
          </div>
          <div
            className={
              !formStore.fields.masked.isValid ? 'not-valid' : undefined
            }
          >
            <label htmlFor="masked">Masked: Only Letters "ABC"</label>
            <input
              type="text"
              id="masked"
              name="masked"
              value={formStore.fields.masked.value}
              onChange={formStore.fields.masked.onChange}
            />
          </div>
          <div>
            <label htmlFor="types">Types</label>
            <select
              value={formStore.fields.types.value}
              onChange={formStore.fields.types.onChange}
            >
              <option value="number">Number</option>
              <option value="string">String</option>
            </select>
          </div>
          <div
            className={
              !formStore.fields.numberOrString.isValid ? 'not-valid' : undefined
            }
          >
            <label htmlFor="numberOrString">Number or String</label>
            <br />
            <small>
              Depends on <strong>types</strong> above
            </small>
            <input
              type="text"
              id="numberOrString"
              name="numberOrString"
              onChange={formStore.fields.numberOrString.onChange}
            />
          </div>
        </fieldset>
      </form>
    </div>
  )
})

export { Form }
