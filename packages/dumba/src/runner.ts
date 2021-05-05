import isPromise from 'p-is-promise'
import { Field } from '.'
import { Form } from './form'
import { Validation } from './validation'

export type RunnerResult = {
  errors: null | string[]
  value: any
}

export class Runner {
  constructor(public validations: Validation[], protected bailEarly = false) {}

  validate(
    value: any,
    ctx: Form<any>,
    field: Field<any>,
    dependency?: Field<any>
  ): RunnerResult {
    if (!this.validations.length) {
      return { errors: null, value }
    }
    const errors = []

    for (const validation of this.validations) {
      const result = validation.fn(value, ctx, field, dependency)
      if (isPromise(result)) {
        throw new Error(`runner has async validations`)
      }
      if (!result) {
        errors.push(validation.msg)
      }

      if (this.bailEarly) {
        return errors.length ? { errors, value } : { errors: null, value }
      }
    }

    return errors.length ? { errors, value } : { errors: null, value }
  }

  async validateAsync(
    value: any,
    ctx: Form<any>,
    field: Field<any>,
    dependency?: Field<any>
  ): Promise<RunnerResult> {
    if (!this.validations.length) {
      return { errors: null, value }
    }
    if (this.bailEarly) {
      return await this.bailEarlyAsync(value, ctx, field, dependency)
    }

    const errors: string[] = []
    const validationsToRun = []

    for (const validation of this.validations) {
      validationsToRun.push(
        Promise.resolve(validation.fn(value, ctx, field, dependency)).then(
          (result) => {
            return {
              result,
              msg: validation.msg
            }
          }
        )
      )
    }

    const resolved = await Promise.all(validationsToRun)

    for (const validation of resolved) {
      if (!validation.result) {
        errors.push(validation.msg)
      }
    }

    return errors.length ? { errors, value } : { errors: null, value }
  }

  async bailEarlyAsync(
    value: any,
    ctx: Form<any>,
    field: Field<any>,
    dependency?: Field<any>
  ): Promise<RunnerResult> {
    for (const validation of this.validations) {
      const result = await validation.fn(value, ctx, field, dependency)

      if (!result) {
        return { errors: [validation.msg], value }
      }
    }

    return { errors: null, value }
  }
}
