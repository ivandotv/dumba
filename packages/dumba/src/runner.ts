import isPromise from 'p-is-promise'
import { Form } from './form'
import { Validation } from './validation'

export type RunnerResult = {
  errors: null | string[]
  value: any
}

export class Runner {
  protected validationsByName: Map<string, Validation> = new Map()

  constructor(public validations: Validation[]) {
    for (const validation of validations) {
      this.validationsByName.set(validation.name, validation)
    }
  }

  addValidation(validation: Validation): void {
    if (validation.name) {
      this.validationsByName.set(validation.name, validation)
      this.validations = [...this.validationsByName.values()]
    } else {
      this.validations.push(validation)
    }
  }

  removeValidation(name: string): boolean {
    const removed = this.validationsByName.delete(name)
    if (removed) {
      this.validations = [...this.validationsByName.values()]
    }

    return removed
  }

  getValidation(name: string): Validation | undefined {
    return this.validationsByName.get(name)
  }

  validate(value: any, ctx: Form<any>): RunnerResult {
    const errors = []

    for (const validation of this.validations) {
      const result = validation.fn(value, ctx)
      if (isPromise(result)) {
        throw new Error(`runner has async validations`)
      }
      if (!result) {
        errors.push(validation.msg)
      }
    }

    return errors.length ? { errors, value } : { errors: null, value }
  }

  async validateAsync(value: any, ctx: Form<any>): Promise<RunnerResult> {
    const errors: string[] = []
    const validationsToRun = []

    for (const validation of this.validations) {
      validationsToRun.push(
        Promise.resolve(validation.fn(value, ctx)).then((result) => {
          return {
            result,
            msg: validation.msg
          }
        })
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
}
