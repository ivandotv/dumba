import { configure } from 'mobx'
import { createField, Field } from '../field'
import { Form } from '../form'
import {
  asyncValidationError,
  getAsyncSchema,
  getSchema,
  validationOk
} from './__fixtures__/fixtures'

configure({
  enforceActions: 'always'
})

describe('Form', () => {
  test('fields are correctly initialized', () => {
    const form = new Form(getSchema())

    expect(form.fields.name).toBeInstanceOf(Field)
    // @ts-expect-error - a field does not exist
    expect(form.fields.info.a).toBeUndefined()
    expect(form.fields.info.b).toBeInstanceOf(Field)
    expect(form.fields.info.c.c1).toBeInstanceOf(Field)
  })

  describe('Validate', () => {
    test('Validate successfully', async () => {
      const form = new Form(getAsyncSchema())
      const expectedPayload = {
        name: 'name',
        info: {
          b: 'b',
          c: {
            c1: 'c1'
          }
        }
      }

      const callback = jest.fn()
      await form.validate(callback)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(form)

      expect(form.data).toEqual(expectedPayload)
      expect(form.isValid).toBe(true)
    })
    test('Validate unsuccessfully', async () => {
      const bFieldErrorOne = 'b field error one'
      const bFieldErrorTwo = 'b field error two'
      const cFieldError = 'c field error'

      const schema = {
        name: createField({
          value: 'name',
          validations: validationOk()
        }),
        info: {
          b: createField({
            value: 'b',
            validations: [
              asyncValidationError(bFieldErrorOne),
              asyncValidationError(bFieldErrorTwo)
            ]
          }),
          c: {
            c1: createField({
              value: 'c1',
              validations: asyncValidationError(cFieldError)
            })
          }
        }
      }
      const expectedPayload = {
        name: 'name',
        info: {
          b: 'b',
          c: {
            c1: 'c1'
          }
        }
      }

      const form = new Form(schema)
      const callback = jest.fn()
      await form.validate(callback)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(form)

      expect(form.data).toEqual(expectedPayload)
      expect(form.isValid).toBe(false)
    })
  })

  test('When validating, "isValidating" property is true', async () => {
    const form = new Form(getAsyncSchema())

    expect(form.isValidating).toBe(false)

    const result = form.validate()

    expect(form.isValidating).toBe(true)

    await result

    expect(form.isValidating).toBe(false)
  })

  test('When field values are changed, "isDirty" is true', () => {
    const form = new Form(getSchema())

    expect(form.isDirty).toBe(false)

    form.fields.info.c.c1.setValue('new value')

    expect(form.isDirty).toBe(true)
  })

  test('When field values are not yet validated, "isValidated" is false', async () => {
    const form = new Form(getSchema())

    expect(form.isValidated).toBe(false)
  })

  test('When field values are  validated, "isValidated" is true', async () => {
    const form = new Form(getSchema())

    await form.validate()

    expect(form.isValidated).toBe(true)
  })

  test('Payload always reflects current form data', () => {
    const form = new Form(getSchema())
    // const bValue = form.fields.info.b.value
    const newValue = 'new b'

    form.fields.info.b.setValue(newValue)

    const newPayload = form.data

    expect(newPayload.info.b).toBe(newValue)
  })

  describe('Handle submit', () => {
    test('Submit handler returns response', async () => {
      const form = new Form(getSchema())
      const response = 'response'
      const submitFn = jest.fn().mockResolvedValueOnce(response)

      const result = await form.handleSubmit(submitFn)

      expect(result).toEqual(response)
    })
    test('Submit function should get current payload and refrence to form', async () => {
      const form = new Form(getSchema())
      const submitFn = jest.fn().mockResolvedValueOnce(true)

      form.handleSubmit(submitFn)
      expect(submitFn).toHaveBeenCalledWith(form.data, form)
    })
    test('Handle submit returns the response', async () => {
      const form = new Form(getSchema())
      const submitResponse = { data: 'success', code: 200 }
      const submitFn = jest.fn().mockResolvedValueOnce(submitResponse)

      const result = await form.handleSubmit(submitFn)
      expect(result).toEqual(submitResponse)
    })
    test('When submit process starts, "isSubmitting" property is true', () => {
      const form = new Form(getSchema())
      const submitFn = jest.fn().mockResolvedValueOnce(true)

      form.handleSubmit(submitFn)

      expect(form.isSubmitting).toBe(true)
    })
    test('When submit process ends, "isSubmitting" property is false', async () => {
      const form = new Form(getSchema())
      const submitFn = jest.fn().mockResolvedValueOnce(true)

      const result = form.handleSubmit(submitFn)
      await result

      expect(form.isSubmitting).toBe(false)
    })

    describe('On successful submit', () => {
      test('"submitError" property is null', async () => {
        const form = new Form(getSchema())
        const submitFn = jest.fn().mockResolvedValueOnce(true)

        const result = form.handleSubmit(submitFn)
        await result

        expect(form.submitError).toBeNull()
      })
      test('"lastSavedData" reflects, last successful submit', async () => {
        const form = new Form(getSchema())
        const submitFn = jest.fn().mockResolvedValueOnce(true)

        const dataBeforeSave = form.data
        await form.handleSubmit(submitFn)

        //change field value
        await form.fields.info.b.setValue('new value')

        expect(form.lastSavedData).toEqual(dataBeforeSave)
        expect(form.lastSavedData).not.toEqual(form.data)
      })

      test('If the form hasn\'t been submitted, "lastSavedData" is null', async () => {
        const form = new Form(getSchema())

        expect(form.lastSavedData).toBeNull()
      })
    })

    describe('On unsuccessful submit', () => {
      test('"submitError" property holds submit error response', async () => {
        const form = new Form(getSchema())
        const responseError = 'response error'
        const submitFn = jest.fn().mockRejectedValueOnce(responseError)

        await expect(form.handleSubmit(submitFn)).rejects.toBeTruthy()
        expect(form.submitError).toBe(responseError)
      })

      test('submit handler rethrows response error', async () => {
        const form = new Form(getSchema())
        const responseError = 'response error'
        const submitFn = jest.fn().mockRejectedValueOnce(responseError)

        await expect(form.handleSubmit(submitFn)).rejects.toEqual(responseError)
      })
    })
    describe('Reset', () => {
      describe('Rest to initial values', () => {
        test('After reset, form has initial values', () => {
          const form = new Form(getSchema())
          const newValue = 'new b'

          const initialPayload = form.data
          //change value on one field
          form.fields.info.b.setValue(newValue)

          form.reset()

          const afterResetPayload = form.data

          expect(afterResetPayload.info.b).not.toBe(newValue)
          expect(initialPayload).toEqual(afterResetPayload)
        })
      })
      describe('Last saved values', () => {
        test('After reset, form has last successfully saved values', async () => {
          const form = new Form(getSchema())
          const submitFn = jest.fn().mockResolvedValueOnce(true)
          await form.handleSubmit(submitFn)

          form.fields.name.setValue('new name')
          form.fields.info.b.setValue('new value')

          expect(form.data).not.toEqual(form.lastSavedData)

          form.resetToLastSaved()

          expect(form.data).toEqual(form.lastSavedData)
        })

        test('If there is no last saved data, reset to initial value', async () => {
          const form = new Form(getSchema())

          const initialData = form.data

          form.fields.name.setValue('new name')
          form.fields.info.b.setValue('new value')

          expect(form.lastSavedData).toBeNull()

          form.resetToLastSaved()

          expect(form.data).toEqual(initialData)
        })
      })
    })
  })
})
