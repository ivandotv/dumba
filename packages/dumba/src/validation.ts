import { Field } from './field'
import { Form } from './form'

type ValidationFn = (
  value: any,
  ctx: Form,
  field: Field<any>,
  dependency?: Field<any>
) => boolean | Promise<boolean>

export function createValidation(fn: ValidationFn, msg: string) {
  return new Validation(fn, msg)
}

export class Validation {
  constructor(public fn: ValidationFn, public msg: string) {}
}
