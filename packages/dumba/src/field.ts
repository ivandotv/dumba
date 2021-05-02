import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { Form } from '.'
import { Runner } from './runner'
import { equals } from './utils'
import { createValidation, Validation } from './validation'

export type CreateFieldData<T> = {
  value: T
  validations?: Validation[] | Validation
  parseValue?: (data: any, form: Form) => any
  delay?: number
  bailEarly?: boolean
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

  const runner = new Runner(validations, data.bailEarly)

  const field = new Field(runner, data.value, data.parseValue, data.delay)

  return field
}

export class Field<T> {
  isValidating = false

  errors: string[] = []

  form!: Form<any>

  name!: string

  path!: string

  initialValue: T

  onChange: (...args: any[]) => Promise<FieldResult<T>>

  protected timeoutId?: number

  constructor(
    public runner: Runner,
    public value: T,
    protected parseValue?: (data: any, form: Form) => any,
    public delay?: number
  ) {
    this.initialValue = this.value

    this.onChange = async (data: any) => {
      this.value = this.parseValue
        ? this.parseValue(data, this.form)
        : data?.currentTarget?.value != null
        ? data.currentTarget.value
        : null

      this.checkForNull(this.value)

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

    makeObservable(this, {
      isValid: computed,
      isDirty: computed,
      isValidating: observable,
      errors: observable,
      value: observable,
      onChange: action,
      setValue: action,
      setValueAsync: action,
      validate: action,
      validateAsync: action,
      reset: action
    })
  }

  setValue(value: T): FieldResult<T> {
    this.checkForNull(value)
    this.value = value

    return this.validate()
  }

  setValueAsync(value: T): Promise<FieldResult<T>> {
    this.checkForNull(value)
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

    this.errors = result.errors ?? []

    return {
      name: this.name,
      path: this.path,
      ...result
    }
  }

  async validateAsync(): Promise<FieldResult<T>> {
    this.isValidating = true
    const result = await this.runner.validateAsync(this.value, this.form)
    runInAction(() => {
      this.isValidating = false

      this.errors = result.errors ?? []
    })

    return {
      name: this.name,
      path: this.path,
      ...result
    }
  }

  get isValid(): boolean {
    return !this.errors.length
  }

  get isDirty(): boolean {
    return !equals(this.initialValue, this.value)
  }

  reset(): void {
    this.value = this.initialValue
    this.errors = []
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

  protected checkForNull(value: any): void {
    if (value == null) {
      throw new TypeError(`Test value can't be null or undefined`)
    }
  }
}
