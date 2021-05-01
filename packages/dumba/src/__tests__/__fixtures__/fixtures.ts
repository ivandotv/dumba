import { Form } from '../..'
import { createField, CreateFieldData } from '../../field'
import { createValidation } from '../../validation'

export function validationOk(msg = '', name?: string) {
  return createValidation(() => true, msg, name)
}
export function validationError(msg = 'error', name?: string) {
  return createValidation(() => false, msg, name)
}

export function asyncValidationOk(msg = '', name?: string) {
  return createValidation(() => Promise.resolve(true), msg, name)
}

export function asyncValidationError(msg = 'async error') {
  return createValidation(() => Promise.resolve(false), msg)
}

export function onChangeEvent(value: any) {
  return {
    currentTarget: {
      value
    }
  }
}

export function getSchema() {
  return {
    name: createField({
      value: 'name',
      validations: validationOk(),
      parseValue: (event: any) => event.target.value
      // msg: 'default message'
    }),
    info: {
      b: createField({
        value: 'b',
        validations: [validationOk(), validationOk()]
      }),
      c: {
        c1: createField({
          value: 'c1',
          validations: validationOk()
        })
      }
    }
  }
}

export function getAsyncSchema() {
  return {
    name: createField({
      value: 'name',
      validations: asyncValidationOk(),
      parseValue: (event: any) => event.target.value
      // msg: 'default message'
    }),
    info: {
      b: createField({
        value: 'b',
        validations: [asyncValidationOk(), validationOk()]
      }),
      c: {
        c1: createField({
          value: 'c1',
          validations: asyncValidationOk()
        })
      }
    }
  }
}

export function getField(
  data: Partial<CreateFieldData<any>> &
    Partial<{
      form: Form<any>
      name: string
      path: string
    }> = {}
) {
  const value = data.value ?? 'A'
  const name = data.name ?? 'lastName'
  const path = data.path ?? '/lastName'
  const form = data.form ?? getForm()
  const parseValue = data.parseValue
  const validations = data.validations
  const delay = data.delay

  const field = createField({ value, parseValue, validations, delay })

  field.attachToPath(name, path, form)

  return {
    field,
    data: { value, name, path, form, parseValue, validations }
  }
}

export function getForm(schema?: any) {
  return new Form(schema ? schema : getSchema())
}
