import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { Form } from '.'
import { Runner } from './runner'
import { equals } from './utils'
import { Validation } from './validation'

export type CreateFieldData<T> = {
  value: T
  validations?: Validation[] | Validation
  parseValue?: (data: any, form: Form) => any
  delay?: number
  bailEarly?: boolean
  dependsOn?: string | string[]
}

export type FieldResult<T> = {
  name: string
  value: T
  path: string
  errors: string[] | null
}

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
    data.dependsOn
  )

  return field
}

export class Field<T> {
  isValidating = false

  errors: string[] = []

  form!: Form<any>

  name!: string

  path!: string

  initialValue: T

  validated = false

  onChange: (...args: any[]) => Promise<FieldResult<T>>

  protected timeoutId?: number

  protected _dependants: Map<string, Field<any>> = new Map()

  constructor(
    public runner: Runner,
    public value: T,
    protected alwaysValid: boolean,
    protected parseValue?: (data: any, form: Form) => any,
    public delay?: number,
    protected dependsOn: string[] = []
  ) {
    this.initialValue = this.value

    if (this.alwaysValid) {
      this.validated = true
    }

    this.onChange = async (evt: any) => {
      this.value = this.parseValue
        ? this.parseValue(evt, this.form)
        : evt?.currentTarget?.value != null
        ? evt.currentTarget.value
        : null

      this.checkForNull(this.value)

      const validationTest = new Promise<FieldResult<T>>((resolve) => {
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
      const result = await validationTest

      this.processDependants()

      return result
    }

    this.onChange = this.onChange.bind(this)
    this.validate = this.validate.bind(this)
    this.validateAsync = this.validateAsync.bind(this)

    makeObservable(this, {
      isValid: computed,
      isDirty: computed,
      isValidating: observable,
      errors: observable,
      value: observable,
      validated: observable,
      onChange: action,
      setValue: action,
      setValueAsync: action,
      validate: action,
      validateAsync: action,
      reset: action
    })
  }

  //@internal
  initDependencies() {
    this.dependsOn.forEach((path) => {
      const formField = this.form.fieldsByPath.get(path)
      if (formField instanceof Field) {
        formField._dependants.set(this.path, this)
      } else {
        throw new Error(`Dependant field "${path}" not found`)
      }
    })
  }

  protected processDependants() {
    for (const field of this._dependants.values()) {
      field.validateAsync()
    }
  }

  get dependants(): Pick<
    Field<any>['_dependants'],
    'entries' | 'forEach' | 'get' | 'keys' | 'size' | 'values'
  > {
    return this._dependants
  }

  setValue(value: T): FieldResult<T> {
    this.checkForNull(value)
    this.value = value

    const result = this.validate()
    this.processDependants()

    return result
  }

  async setValueAsync(value: T): Promise<FieldResult<T>> {
    this.checkForNull(value)
    this.value = value

    const result = await this.validateAsync()
    this.processDependants()

    return result
  }

  //todo @internal
  attachToPath(name: string, path: string, form: Form<any>): void {
    this.name = name
    this.path = path
    this.form = form
  }

  validate(): FieldResult<T> {
    const result = this.runner.validate(this.value, this.form)

    this.errors = result.errors ?? []

    this.validated = true

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
      this.validated = true
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
    if (!this.alwaysValid) {
      this.validated = false
    }
    this.errors = []
  }

  protected checkForNull(value: any): void {
    if (value == null) {
      throw new TypeError(`Test value can't be null or undefined`)
    }
  }
}
