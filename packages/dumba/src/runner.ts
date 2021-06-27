import { Field } from './field'
import { Validation } from './validation'

/**
 * Result of running all {@link Validation | Validations }
 */
export type RunnerResult = {
  /**
   *  error messages
   */
  errors: null | string[]
  /**
   * value that was validated against
   */
  value: any
}

/**
 * Runner
 * Runs validations and reports results
 */
export class Runner {
  constructor(public validations: Validation[], protected bailEarly = false) {}

  /**
   * Run validations, it will run all validations, and then return the result.
   * @param value - value to validate against
   * @param field - {@link Field} associated with validations
   * @param [dependency] Dependency {@link Field } that triggered the validation
   * @returns promise of {@link RunnerResult}
   */
  async validate(
    value: any,
    field: Field<any>,
    dependency?: Field<any>
  ): Promise<RunnerResult> {
    if (!this.validations.length) {
      return { errors: null, value }
    }
    if (this.bailEarly) {
      return await this.bailEarlyValidation(value, field, dependency)
    }

    const errors: string[] = []
    const validationsToRun = []

    for (const validation of this.validations) {
      validationsToRun.push(
        Promise.resolve(validation.fn(value, field, dependency)).then(
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
      if (typeof validation.result === 'string') {
        errors.push(validation.result)
      } else if (!validation.result) {
        errors.push(validation.msg)
      }
    }

    return errors.length ? { errors, value } : { errors: null, value }
  }

  /**
   * Runs validations, and returns on first validation that errors out
   * @param value
   * @param field
   * @param [dependency]
   * @returns early validation
   */
  protected async bailEarlyValidation(
    value: any,
    field: Field<any>,
    dependency?: Field<any>
  ): Promise<RunnerResult> {
    for (const validation of this.validations) {
      const result = await validation.fn(value, field, dependency)

      if (typeof result === 'string') {
        return { errors: [result], value }
      } else if (!result) {
        return { errors: [validation.msg], value }
      }
    }

    return { errors: null, value }
  }
}
