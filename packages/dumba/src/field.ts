import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { Form } from './form'
import { Runner } from './runner'
import { equals } from './utils'
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
  parseValue?: (data: any, form: Form) => any

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
}

/**
 * Result of the {@link Field} validation
 * @typeparam T - value of the {@link Field}
 */
export type FieldResult<T> = {
  /**
   * name of the field
   */
  name: string
  /**
   * value of the field
   */
  value: T
  /**
   * path of the field in the schema
   */
  path: string
  /**
   * error messages
   */
  errors: string[] | null
}

/**
 * Factory function that creates the @class Field
 * @param data need for the create of the Field instance
 * @returns {@link Field} instance
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
    data.dependsOn
  )

  return field
}

/**
 * Field form the {@link Form}
 * @typeparam T - type of the value for the field
 */
export class Field<T> {
  /**
   * Determines whether field is in the process of validating
   */
  isValidating = false

  /**
   * Determines whether field is validated. The value is true when field validations
   * have run at least once
   */
  isValidated = false

  /**
   * Errors from the validation process
   */
  errors: string[] = []

  /**
   * Refrence to the {@link Form} that is holding the field instance
   */
  form!: Form<any>

  /**
   * Name  of field
   */
  name!: string

  /**
   * Path  of field in the {@link Form} that holds the field
   */
  path!: string

  /**
   * Initial value of field. Field will be reverted to this value after {@link Field.reset}
   */
  initialValue: T

  /**
   * Method to be hooked to the HTML "onChange" event. It will set the value to the field, and run validations.
   * This method can also be hooked to the HTML "onBlur" event.
   */
  onChange: (...args: any[]) => Promise<void>

  protected timeoutId?: number

  protected _dependants: Map<string, Field<any>> = new Map()

  /**
   * Creates an instance of field.
   * @param runner
   * @param value
   * @param alwaysValid
   * @param [parseValue]
   * @param [delay]
   * @param [dependsOn]
   */
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
        : evt?.target?.value != null
        ? evt.target.value
        : null

      this.checkForNull(this.value)

      const validationTest = new Promise<void>((resolve) => {
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
      await validationTest

      await this.validateDependants()
    }

    this.onChange = this.onChange.bind(this)
    this.validate = this.validate.bind(this)
    this.reset = this.reset.bind(this)
    this.setValue = this.setValue.bind(this)
    this.clearErrors = this.clearErrors.bind(this)

    makeObservable(this, {
      isValid: computed,
      isDirty: computed,
      isValidating: observable,
      errors: observable,
      value: observable,
      isValidated: observable,
      onChange: action,
      setValue: action,
      validate: action,
      reset: action,
      clearErrors: action
    })
  }

  /**
   * Wires up dependencies for the field
   * @internal
   */
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

  /**
   * Runs validations on the dependant fields
   * @returns  results of all validations
   */
  protected async validateDependants() {
    const results = []
    for (const field of this._dependants.values()) {
      //field is a dependant field (not this)
      results.push(field.validateAsync(this))
    }

    return await Promise.all(results)
  }

  /**
   * Gets all the dependant fields
   */
  get dependants(): Pick<
    Field<any>['_dependants'],
    'entries' | 'forEach' | 'get' | 'keys' | 'size' | 'values'
  > {
    return this._dependants
  }

  /**
   * Sets value to the field
   * @param value - value for the field
   * @param [cb] - callback that is triggerd when the value is set and all validations for the field
   * and dependant fields are run.
   */
  async setValue(value: T, cb?: (field: Field<T>) => void): Promise<void> {
    this.checkForNull(value)
    this.value = value

    await this.validateAsync()
    await this.validateDependants()

    cb && cb(this)
  }

  /**
   * Sets data that determines at what location the field is attached to the {@link Form.}
   * @param name - name of the field
   * @param path - dot notation of the path e.g. info.location.zip
   * @param form - reference to the {@link Form}
   */
  setPathData(name: string, path: string, form: Form<any>): void {
    this.name = name
    this.path = path
    this.form = form
  }

  /**
   * Run all validations for the field
   * @param [cb] - callback function that is triggerd after all validations are done
   */
  async validate(cb?: (field: Field<T>) => void): Promise<void> {
    await this.validateAsync()
    cb && cb(this)
  }

  /**
   * Clears all field errors
   */
  clearErrors() {
    this.errors = []
  }

  /**
   * Runs validations
   * @param [dependancy] - Dependency field that has trigged the validation process
   * @internal
   */
  protected async validateAsync(dependancy?: Field<any>): Promise<void> {
    runInAction(() => {
      this.isValidating = true
    })
    const result = await this.runner.validate(
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
  }

  /**
   * Gets whether field is valid. Field is valid when there are no errors.
   */
  get isValid(): boolean {
    return !this.errors.length
  }

  /**
   * Gets whether field is  dirty.
   * Field is dirty when current value is not equal to the initial value
   */
  get isDirty(): boolean {
    return !equals(this.initialValue, this.value)
  }

  /**
   * Resets the field to the initial value, clears all errors, and runs validations
   * on all dependant fields.
   */
  reset(): void {
    this.value = this.initialValue
    if (!this.alwaysValid) {
      this.isValidated = false
    }
    this.clearErrors()

    this.validateDependants()
  }

  /**
   * Checks if value is null
   * @param value - value to check
   */
  protected checkForNull(value: any): void {
    if (value == null) {
      throw new TypeError(`Test value can't be null or undefined`)
    }
  }
}
