import { Field } from './field'
import { Runner } from './runner'
import { Validation } from './validation'

/**
 * Data for the {@link createField} factory
 * @typeparam T - type of value for the {@link Field}
 *
 * @example Depends on
 * ```
 * const schema = {
 *   info:{
 *     name:{}
 *     nick:{
 *       dependsOn:'info.name'
 *     }
 *   }
 * }
 * ```
 */
export type CreateFieldData<T> = {
  /**
   * value of the field
   */
  value: T

  /**
   * array of {@link Validation} to be used for validating the field
   */
  validations?: Validation[] | Validation

  /**
   * function that can intercept {@link Field.onChange} and return a custom value
   */
  parseValue?: (data: any, field: Field<T>) => any

  /**
   * delay for running the validations
   */
  delay?: number

  /**
   * return as soon as first validation returns error
   */
  bailEarly?: boolean

  /**
   * path to fields that current field should depend on
   */
  dependsOn?: string | string[]

  shouldDisable?: (
    value: any,
    field: Field<any>,
    dependency?: Field<any>
  ) => boolean | Promise<boolean>
  /**
   * if field is disabled
   */
  disabled?: boolean
}

/**
 * Factory function that creates the @class Field
 * @param data - field data
 * @returns instance of {@link Field}
 */
export function createField<T>(data: CreateFieldData<T>) {
  let alwaysValid = false
  if (data.validations) {
    if (!Array.isArray(data.validations)) {
      data.validations = [data.validations]
    }
  } else {
    data.validations = []
    alwaysValid = true
  }

  const runner = new Runner(data.validations, data.bailEarly)

  data.dependsOn = data.dependsOn
    ? Array.isArray(data.dependsOn)
      ? [...data.dependsOn]
      : [data.dependsOn]
    : []

  const field = new Field(
    runner,
    data.value,
    alwaysValid,
    data.parseValue,
    data.delay,
    data.dependsOn,
    data.disabled,
    data.shouldDisable
  )

  return field
}
