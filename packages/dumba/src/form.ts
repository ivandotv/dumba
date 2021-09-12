// @ts-expect-error no typings
import deepForEach from 'deep-for-each'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
// @ts-expect-error no typings
import setValue from 'set-value'
import { Field, FieldResult } from './field'
import type React from 'react'

/**
 * Responst string that is return when form while submitting fails validation
 */
export const FAILED_VALIDATION_RESPONSE = 'validation_failed'

/**
 * Schema structure with values for the fields in the schema
 */
export type SchemaValues<T> = T extends Record<string, any>
  ? {
      [key in keyof T]: T[key] extends { value: any }
        ? T[key]['value' & keyof T[key]]
        : SchemaValues<T[key]>
    }
  : T

/**
 * Schema structure with validation results for the fields in the schema
 */
export type SchemaResults<T> = T extends Record<string, any>
  ? {
      [key in keyof T]: T[key] extends { value: any }
        ? FieldResult<T[key]['value' & keyof T[key]]>
        : SchemaResults<T[key]>
    }
  : T

export type FormConfig = {
  removeDisabled?: boolean
  validateBeforeSubmit?: boolean
}

export class Form<TSchema = any> {
  fields: TSchema

  isSubmitting = false

  submitError: unknown = null

  //@internal
  fieldsByPath: Map<string, Field<any>> = new Map()

  protected lastSavedDataByPath: Map<string, any> = new Map()

  constructor(schema: TSchema, protected config: FormConfig = {}) {
    // @ts-expect-error - must be initialized with empty object
    this.fields = {}

    this.config = {
      removeDisabled: false,
      validateBeforeSubmit: true,
      ...this.config
    }

    this.fieldsByPath = new Map()
    this.reset = this.reset.bind(this)
    this.resetToLastSaved = this.resetToLastSaved.bind(this)

    // initMobx(this)
    makeObservable<Form<any>, 'lastSavedDataByPath'>(this, {
      fields: observable,
      submitError: observable,
      isSubmitting: observable,
      lastSavedDataByPath: observable,
      fieldsByPath: observable,
      isValid: computed,
      isValidating: computed,
      lastSavedData: computed,
      data: computed,
      isDirty: computed,
      handleSubmit: action
    })

    deepForEach(
      schema,
      (formField: Field<any>, key: string, _subject: any, path: string) => {
        if (!(formField instanceof Field)) {
          return
        }

        runInAction(() => {
          formField.setPathData(key, path, this)
          setValue(this.fields, path, formField)
          this.fieldsByPath.set(path, formField)
        })
      }
    )

    for (const field of this.fieldsByPath.values()) {
      field.initDependencies()
    }
  }

  /**
   * Validates form
   * @param [cb] - Callback function that is called after the validation is complete
   */
  async validate(cb?: (form: Form<TSchema>) => void): Promise<void> {
    for (const field of this.fieldsByPath.values()) {
      if (!field.isDisabled) {
        await field.validate()
      }
    }
    if (cb) {
      cb(this)
    }
  }

  /**
   * Clears errors for all form fields.
   */
  clearErrors() {
    for (const field of this.fieldsByPath.values()) {
      field.clearErrors()
    }
  }

  /**
   * Gets form data. This is an object with the same structure as the schema, but it
   * only holds values, so it could be sent over the wire.
   */
  get data(): SchemaValues<TSchema> {
    const data = {}
    for (const [path, field] of this.fieldsByPath.entries()) {
      if (field.isDisabled && this.config.removeDisabled) {
        continue
      }
      setValue(data, path, field.value)
    }

    return data as SchemaValues<TSchema>
  }

  /**
   * Gets whether all fields in the form are valid.
   */
  get isValid(): boolean {
    for (const field of this.fieldsByPath.values()) {
      if (!field.isDisabled && !field.isValid) {
        return false
      }
    }

    return true
  }

  /**
   * Gets whether any of the fields in the form are currently validating.
   */
  get isValidating(): boolean {
    for (const field of this.fieldsByPath.values()) {
      if (!field.isDisabled && field.isValidating) {
        return true
      }
    }

    return false
  }

  /**
   * Gets whether any of the fields in the form are dirty. Field is dirty if the current
   * value of the is different from the value the field was initialized with.
   */
  get isDirty(): boolean {
    for (const field of this.fieldsByPath.values()) {
      if (!field.isDisabled && field.isDirty) {
        return true
      }
    }

    return false
  }

  /**
   * Gets whether all the fields in the form have been validated at least once.
   */
  get isValidated(): boolean {
    for (const field of this.fieldsByPath.values()) {
      if (!field.isDisabled && !field.isValidated) {
        return false
      }
    }

    return true
  }

  /**
   * After successful form submission, this field holds the data that the form head when it was submitted.
   *
   */
  get lastSavedData(): SchemaValues<TSchema> | null {
    if (this.lastSavedDataByPath.size === 0) {
      return null
    }
    const data = {}
    for (const [path, value] of this.lastSavedDataByPath.entries()) {
      setValue(data, path, value)
    }

    return data as SchemaValues<TSchema>
  }

  /**
   * Resets form fields to their initial values from the schema
   */
  reset(): void {
    for (const field of this.fieldsByPath.values()) {
      field.reset()
    }
  }

  /**
   * Resets form fields to last successfully saved values
   */
  resetToLastSaved(): void {
    if (this.lastSavedDataByPath.size === 0) {
      this.reset()
    } else {
      for (const [path, value] of this.lastSavedDataByPath.entries()) {
        const field = this.fieldsByPath.get(path)
        field!.setValue(value)
      }
    }
  }

  /**
   * Handles submitting the form
   * @param submission function that does the actuall submission process. The function will be awaited for, and the result will be returned.
   * @param [onSuccess] function that is called after a successful submission
   * @param [onError] function that is called after a unsuccessful submision
   * @returns object with "status" filed that tells if submission was successful or not and "response" field with
   * the response from the submission function
   */
  handleSubmit<T>(
    submission: (form: this) => Promise<T>,
    onSuccess?: (form: Form<TSchema>, response: T) => void,
    onError?: (form: Form<TSchema>, response: any) => void
  ) {
    return async (event?: React.FormEvent<HTMLFormElement>) => {
      event && event.preventDefault()

      runInAction(() => {
        this.isSubmitting = true
        this.submitError = null
      })

      if (this.config.validateBeforeSubmit) {
        await this.validate()
      }

      if (!this.isValid) {
        //return fails
        return {
          status: 'rejected',
          response: FAILED_VALIDATION_RESPONSE
        }
      }
      const dataBeforeSave = new Map()

      for (const [path, field] of this.fieldsByPath.entries()) {
        let value = field.value
        if (Array.isArray(value)) {
          value = [...value]
        } else if (typeof value === 'object') {
          value = { ...value }
        }

        dataBeforeSave.set(path, value)
      }

      try {
        const response = await submission(this)

        runInAction(() => {
          this.lastSavedDataByPath = dataBeforeSave
          onSuccess && onSuccess(this, response)
        })

        return {
          status: 'fulfilled',
          response
        }
      } catch (err) {
        runInAction(() => {
          this.submitError = err
          onError && onError(this, err)
        })

        return {
          status: 'rejected',
          response: err
        }
      } finally {
        runInAction(() => {
          this.isSubmitting = false
        })
      }
    }
  }
}
