import { Form } from 'dumba'
import { reaction, toJS } from 'mobx'
import { schema } from './schema'

const form = new Form(schema)

reaction(
  () => {
    return form.fields.name.errors
  },
  (v) => {
    console.log('reaction ', v ? toJS(v) : 'no errors')
  }
)
export function useForm() {
  return form
}
