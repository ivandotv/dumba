import { Form } from 'dumba'
import { schema } from './schema'

const form = new Form(schema)

export function useForm() {
  return form
}

// @ts-ignore
window.form = form
