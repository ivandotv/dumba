// @ts-expect-error no typings
import deepForEach from 'deep-for-each'
// @ts-expect-error no typings
import setValue from 'set-value'
import { Field, FieldResult } from './field'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'

type SchemaValues<T> = T extends Record<string, any>
  ? {
      [key in keyof T]: T[key] extends { value: any }
        ? T[key]['value' & keyof T[key]]
        : SchemaValues<T[key]>
    }
  : T

type SchemaResults<T> = T extends Record<string, any>
  ? {
      [key in keyof T]: T[key] extends { value: any }
        ? FieldResult<T[key]['value' & keyof T[key]]>
        : SchemaResults<T[key]>
    }
  : T

export class Form<TSchema> {
  fieldsByPath: Map<string, Field<any>> = new Map()

  fields: TSchema

  lastSavedData: Map<string, any> = new Map()

  isSubmitting = false

  submitError = null

  constructor(schema: TSchema) {
    // @ts-expect-error - must be initialized with empty object
    this.fields = {}

    deepForEach(
      schema,
      (formField: Field<any>, key: string, _subject: any, path: string) => {
        if (!(formField instanceof Field)) {
          return
        }

        formField.attachToPath(key, path, this)

        setValue(this.fields, path, formField)
        this.fieldsByPath.set(path, formField)
      }
    )

    // initMobx(this)
    makeObservable(this, {
      fields: observable,
      submitError: observable,
      isSubmitting: observable,
      isValid: computed,
      isValidating: computed,
      isDirty: computed,
      handleSubmit: action
    })
  }

  validate(): SchemaResults<TSchema> {
    const result = {}
    for (const [path, field] of this.fieldsByPath.entries()) {
      setValue(result, path, field.validate())
    }

    return result as SchemaResults<TSchema>
  }

  async validateAsync(): Promise<SchemaResults<TSchema>> {
    const result = {}
    for (const [path, field] of this.fieldsByPath.entries()) {
      setValue(result, path, await field.validateAsync())
    }

    return result as SchemaResults<TSchema>
  }

  getData(): SchemaValues<TSchema> {
    const data = {}
    for (const [path, field] of this.fieldsByPath.entries()) {
      setValue(data, path, field.value)
    }

    return data as SchemaValues<TSchema>
  }

  getLastSavedData(): SchemaValues<TSchema> | null {
    if (this.lastSavedData.size === 0) {
      return null
    }

    const data = {}
    for (const [path, value] of this.lastSavedData.entries()) {
      setValue(data, path, value)
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

  reset(): void {
    for (const field of this.fieldsByPath.values()) {
      field.reset()
    }
  }

  resetToLastSaved(): void {
    if (this.lastSavedData.size === 0) {
      this.reset()
    } else {
      for (const [path, value] of this.lastSavedData.entries()) {
        const field = this.fieldsByPath.get(path)
        field?.setValue(value)
      }
    }
  }

  async handleSubmit<T extends (payload: any, form: this) => Promise<any>>(
    fn: T
  ): Promise<ReturnType<typeof fn>> {
    try {
      this.isSubmitting = true
      this.submitError = null

      const dataBeforeSave = new Map()
      for (const [path, field] of this.fieldsByPath.entries()) {
        dataBeforeSave.set(path, field.value)
      }

      const result = await fn(this.getData(), this)

      this.lastSavedData = dataBeforeSave

      return result
    } catch (e) {
      runInAction(() => {
        this.submitError = e
      })

      throw e
    } finally {
      runInAction(() => {
        this.isSubmitting = false
      })
    }
  }
}
