import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { Form } from './form'
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

  isValidated = false

  errors: string[] = []

  form!: Form<any>

  name!: string

  path!: string

  initialValue: T

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
      this.isValidated = true
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
            resolve(this.__validateAsync())
          }, this.delay)
        } else {
          resolve(this.__validateAsync())
        }
      })
      const result = await validationTest

      await this.validateDependants()

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
      isValidated: observable,
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

  protected async validateDependants() {
    const results = []
    for (const field of this._dependants.values()) {
      //field is a dependant field (not this)
      results.push(field.__validateAsync(this))
    }

    return await Promise.all(results)
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

    this.validateDependants()

    return result
  }

  async setValueAsync(value: T): Promise<FieldResult<T>> {
    this.checkForNull(value)
    this.value = value

    const result = await this.__validateAsync()

    await this.validateDependants()

    return result
  }

  //todo @internal
  attachToPath(name: string, path: string, form: Form<any>): void {
    this.name = name
    this.path = path
    this.form = form
  }

  validate(): FieldResult<T> {
    const result = this.runner.validate(this.value, this.form, this)

    this.errors = result.errors ?? []

    this.isValidated = true

    return {
      name: this.name,
      path: this.path,
      ...result
    }
  }

  async validateAsync(): Promise<FieldResult<T>> {
    return this.__validateAsync()
  }

  protected async __validateAsync(
    dependancy?: Field<any>
  ): Promise<FieldResult<T>> {
    runInAction(() => {
      this.isValidating = true
    })
    const result = await this.runner.validateAsync(
      this.value,
      this.form,
      this,
      dependancy
    )
    runInAction(() => {
      this.isValidating = false

      this.errors = result.errors ?? []
      this.isValidated = true
    })

    return {
      name: this.name,
      path: this.path,
      ...result
    }
  }

  // async validateBecauseOfDependency(
  //   dependency?: Field<any>
  // ): Promise<FieldResult<T>> {
  //   this.isValidating = true
  //   const result = await this.runner.validateAsync(
  //     this.value,
  //     this.form,
  //     this,
  //     dependency
  //   )
  //   runInAction(() => {
  //     this.isValidating = false

  //     this.errors = result.errors ?? []
  //     this.validated = true
  //   })

  //   return {
  //     name: this.name,
  //     path: this.path,
  //     ...result
  //   }
  // }

  get isValid(): boolean {
    return !this.errors.length
  }

  get isDirty(): boolean {
    return !equals(this.initialValue, this.value)
  }

  reset(): void {
    this.value = this.initialValue
    if (!this.alwaysValid) {
      this.isValidated = false
    }
    this.errors = []

    this.validateDependants()
  }

  protected checkForNull(value: any): void {
    if (value == null) {
      throw new TypeError(`Test value can't be null or undefined`)
    }
  }
}
