import { Field } from './field'
import { Form } from './form'
import { Validation } from './validation'

export type RunnerResult = {
  errors: null | string[]
  value: any
}

export class Runner {
  constructor(public validations: Validation[], protected bailEarly = false) {}

  async validate(
    value: any,
    ctx: Form<any>,
    field: Field<any>,
    dependency?: Field<any>
  ): Promise<RunnerResult> {
    if (!this.validations.length) {
      return { errors: null, value }
    }
    if (this.bailEarly) {
      return await this.bailEarlyValidation(value, ctx, field, dependency)
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

  async bailEarlyValidation(
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
