import { Form } from '.'
import { Runner } from './runner'
import { equals } from './utils'
import { createValidation, Validation } from './validation'

export type CreateFieldData<T> = {
  value: T
  validations?: Validation[] | Validation
  parseValue?: (data: any) => any
  delay?: number
}

export type FieldResult<T> = {
  name: string
  value: T
  path: string
  errors: string[] | null
}

export function createField<T>(data: CreateFieldData<T>) {
  let validations
  if (data.validations) {
    if (Array.isArray(data.validations)) {
      validations = [...data.validations]
    } else {
      validations = [data.validations]
    }
  } else {
    // default no-op validation
    validations = [createValidation(() => true, '')]
  }

  const runner = new Runner(validations)

  const field = new Field(runner, data.value, data.parseValue, data.delay)

  return field
}

export class Field<T> {
  isValidating = false

  errors: FieldResult<T>['errors'] = null

  form!: Form<any>

  name!: string

  path!: string

  initialValue: T

  onChange: (...args: any[]) => Promise<FieldResult<T>>

  protected timeoutId?: number

  constructor(
    public runner: Runner,
    public value: T,
    //@internal
    public parseValue?: (data: any) => any,
    public delay?: number
  ) {
    this.initialValue = this.value

    this.onChange = async (data: any) => {
      this.value = this.parseValue
        ? this.parseValue(data)
        : data.value
        ? data.value
        : data.target && data.target.value
        ? data.target.value
        : data

      return new Promise<FieldResult<T>>((resolve) => {
        if (typeof this.delay !== 'undefined') {
          if (this.timeoutId) {
            clearTimeout(this.timeoutId)
          }
          this.timeoutId = window.setTimeout(() => {
            resolve(this.validateAsync())
          }, this.delay)
        } else {
          resolve(this.validateAsync())
        }
      })
    }

    this.onChange = this.onChange.bind(this)
  }

  setValue(value: T): FieldResult<T> {
    this.value = value

    return this.validate()
  }

  setValueAsync(value: T): Promise<FieldResult<T>> {
    this.value = value

    return this.validateAsync()
  }

  attachToPath(name: string, path: string, form: Form<any>): void {
    this.name = name
    this.path = path
    this.form = form
  }

  validate(): FieldResult<T> {
    const result = this.runner.validate(this.value, this.form)

    this.errors = result.errors

    return {
      name: this.name,
      path: this.path,
      ...result
    }
  }

  async validateAsync(): Promise<FieldResult<T>> {
    this.isValidating = true
    const result = await this.runner.validateAsync(this.value, this.form)
    this.isValidating = false

    this.errors = result.errors

    return {
      name: this.name,
      path: this.path,
      ...result
    }
  }

  get isValid(): boolean {
    return !this.errors
  }

  get isDirty(): boolean {
    return !equals(this.initialValue, this.value)
  }

  reset(): void {
    this.value = this.initialValue
    this.errors = null
  }

  addValidation(validation: Validation): void {
    this.runner.addValidation(validation)
  }

  removeValidation(name: string): boolean {
    return this.runner.removeValidation(name)
  }

  getValidation(name: string): Validation | undefined {
    return this.runner.getValidation(name)
  }
}
