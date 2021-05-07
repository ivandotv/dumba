// @ts-expect-error no typings
import deepForEach from 'deep-for-each'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
// @ts-expect-error no typings
import setValue from 'set-value'
import { Field, FieldResult } from './field'
import type React from 'react'

export type SchemaValues<T> = T extends Record<string, any>
  ? {
      [key in keyof T]: T[key] extends { value: any }
        ? T[key]['value' & keyof T[key]]
        : SchemaValues<T[key]>
    }
  : T

export type SchemaResults<T> = T extends Record<string, any>
  ? {
      [key in keyof T]: T[key] extends { value: any }
        ? FieldResult<T[key]['value' & keyof T[key]]>
        : SchemaResults<T[key]>
    }
  : T

export class Form<TSchema = any> {
  fields: TSchema

  isSubmitting = false

  submitError = null

  //@internal
  fieldsByPath: Map<string, Field<any>> = new Map()

  protected lastSavedDataByPath: Map<string, any> = new Map()

  constructor(schema: TSchema) {
    // @ts-expect-error - must be initialized with empty object
    this.fields = {}

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
          formField.attachToPath(key, path, this)
          setValue(this.fields, path, formField)
          this.fieldsByPath.set(path, formField)
        })
      }
    )

    for (const field of this.fieldsByPath.values()) {
      field.initDependencies()
    }
  }

  async validate(cb?: (form: Form<TSchema>) => void): Promise<void> {
    for (const field of this.fieldsByPath.values()) {
      await field.validate()
    }
    if (cb) {
      cb(this)
    }
  }

  get data(): SchemaValues<TSchema> {
    const data = {}
    for (const [path, field] of this.fieldsByPath.entries()) {
      setValue(data, path, field.value)
    }

    return data as SchemaValues<TSchema>
  }

  get isValid(): boolean {
    for (const field of this.fieldsByPath.values()) {
      if (!field.isValid) {
        return false
      }
    }

    return true
  }

  get isValidating(): boolean {
    for (const field of this.fieldsByPath.values()) {
      if (field.isValidating) {
        return true
      }
    }

    return false
  }

  get isDirty(): boolean {
    for (const field of this.fieldsByPath.values()) {
      if (field.isDirty) {
        return true
      }
    }

    return false
  }

  get isValidated(): boolean {
    for (const field of this.fieldsByPath.values()) {
      if (!field.isValidated) {
        return false
      }
    }

    return true
  }

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

  reset(): void {
    for (const field of this.fieldsByPath.values()) {
      field.reset()
    }
  }

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

  handleSubmit<T>(
    fn: (form: this) => Promise<T>,
    onSuccess?: (form: Form<TSchema>, response: T) => void,
    onError?: (form: Form<TSchema>, response: any) => void
  ) {
    return (event?: React.FormEvent<HTMLFormElement>) => {
      event && event.preventDefault()

      runInAction(() => {
        this.isSubmitting = true
        this.submitError = null
      })

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

      return fn(this)
        .then((response: any) => {
          runInAction(() => {
            this.lastSavedDataByPath = dataBeforeSave
            onSuccess && onSuccess(this, response)
          })

          return {
            status: 'fulfilled',
            response
          }
        })
        .catch((response) => {
          runInAction(() => {
            this.submitError = response
            onError && onError(this, response)
          })

          return {
            status: 'rejected',
            response
          }
        })
        .finally(() => {
          runInAction(() => {
            this.isSubmitting = false
          })
        })
    }
  }
}
