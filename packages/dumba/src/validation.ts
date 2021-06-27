import { Field } from './field'
/**
 * Validation function signature
 * @param value - value to be validated
 * @param {@link Field} that holds the value that is being validated
 * @param {@link Field} dependency field that has changed and triggered this validation
 */
export type ValidationFn = (
  value: any,
  field: Field<any>,
  dependency?: Field<any>
) => boolean | Promise<boolean> | string | Promise<string>

export function createValidation(
  fn: ValidationFn,
  msg: string = Validation.defaultMessage
) {
  return new Validation(fn, msg)
}

export class Validation {
  static defaultMessage = 'not valid'

  constructor(public fn: ValidationFn, public msg: string) {}
}
