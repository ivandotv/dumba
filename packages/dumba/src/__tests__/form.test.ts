import { configure } from 'mobx'
import React from 'react'
import { getForm } from '..'
import { Field } from '../field'
import { createField } from '../field-factory'
import { FAILED_VALIDATION_RESPONSE, Form } from '../form'
import { createValidation } from '../validation'
import * as fixtures from './__fixtures__/fixtures'

configure({
  enforceActions: 'always'
})

describe('Form', () => {
  test('fields are correctly initialized', () => {
    const form = new Form(fixtures.getSchema())

    expect(form.fields.name).toBeInstanceOf(Field)
    // @ts-expect-error - a field does not exist
    expect(form.fields.info.a).toBeUndefined()
    expect(form.fields.info.b).toBeInstanceOf(Field)
    expect(form.fields.info.c.c1).toBeInstanceOf(Field)
  })

  test('Get the form from a field propety', () => {
    const form = new Form(fixtures.getSchema())

    const fromNameField = getForm<typeof fixtures.getSchema>(form.fields.name)
    const formSubFields = getForm<typeof fixtures.getSchema>(form.fields.info.b)

    expect(fromNameField).toBe(form)
    expect(formSubFields).toBe(form)
  })

  describe('Validate', () => {
    test('Validate successfully', async () => {
      const form = new Form(fixtures.getAsyncSchema())
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

    test('When there are disabled fields, they are skipped when validating', async () => {
      const validationSpy = jest.fn().mockReturnValueOnce(false)
      const schema = {
        a: createField({
          disabled: false,
          value: 'a'
        }),
        levelOne: {
          b: createField({
            disabled: true,
            validations: createValidation(validationSpy, ''),
            value: 'b'
          })
        }
      }
      const form = new Form(schema)
      await form.validate()

      expect(validationSpy).not.toHaveBeenCalled()
    })

    test('When there are invalid and disabled fields, form is still valid after validation', async () => {
      const schema = {
        a: createField({
          disabled: false,
          value: 'a'
        }),
        levelOne: {
          b: createField({
            disabled: true,
            validations: createValidation(() => false, ''),
            value: 'b'
          })
        }
      }
      const form = new Form(schema)
      await form.validate()

      expect(form.isValid).toBe(true)
    })

    test('Validate unsuccessfully', async () => {
      const bFieldErrorOne = 'b field error one'
      const bFieldErrorTwo = 'b field error two'
      const cFieldError = 'c field error'

      const schema = {
        name: createField({
          value: 'name',
          validations: fixtures.validationError()
        }),
        info: {
          b: createField({
            value: 'b',
            validations: [
              fixtures.asyncValidationError(bFieldErrorOne),
              fixtures.asyncValidationError(bFieldErrorTwo)
            ]
          }),
          c: {
            c1: createField({
              value: 'c1',
              validations: fixtures.asyncValidationError(cFieldError)
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
    const form = new Form(fixtures.getAsyncSchema())

    expect(form.isValidating).toBe(false)

    const result = form.validate()

    expect(form.isValidating).toBe(true)

    await result

    expect(form.isValidating).toBe(false)
  })

  test('Clear validation errors for all fields', async () => {
    const schema = {
      name: createField({
        value: 'name',
        validations: fixtures.validationError()
      }),
      info: {
        b: createField({
          value: 'b',
          validations: [
            fixtures.asyncValidationError(),
            fixtures.asyncValidationError()
          ]
        }),
        c: {
          c1: createField({
            value: 'c1',
            validations: fixtures.asyncValidationError()
          })
        }
      }
    }
    const form = new Form(schema)
    await form.validate()

    form.clearErrors()

    expect(form.fields.name.errors).toHaveLength(0)
    expect(form.fields.name.isValid).toBe(true)
    expect(form.fields.info.b.errors).toHaveLength(0)
    expect(form.fields.info.b.isValid).toBe(true)
    expect(form.fields.info.c.c1.errors).toHaveLength(0)
    expect(form.fields.info.c.c1.isValid).toBe(true)
  })

  test('When field value is changed, "isDirty" property is true', () => {
    const form = new Form(fixtures.getSchema())

    expect(form.isDirty).toBe(false)

    form.fields.info.c.c1.setValue('new value')

    expect(form.isDirty).toBe(true)
  })

  test('When field value on disabled field is changed, "isDirty" property is still false', async () => {
    const bValue = 'b'
    const schema = {
      a: createField({
        disabled: false,
        value: 'a'
      }),
      b: createField({
        disabled: true,
        value: bValue
      })
    }
    const form = new Form(schema)

    expect(form.isDirty).toBe(false)

    await form.fields.b.setValue('new value')

    expect(form.isDirty).toBe(false)
  })

  test('When field value is not yet validated, "isValidated" property is false', async () => {
    const form = new Form(fixtures.getSchema())

    expect(form.isValidated).toBe(false)
  })

  test('When field value is validated, "isValidated" property is true', async () => {
    const form = new Form(fixtures.getSchema())

    await form.validate()

    expect(form.isValidated).toBe(true)
  })

  test('When there is a disable field, after validation "isValidated" property is true', async () => {
    const validationSpy = jest.fn().mockReturnValueOnce(false)
    const bValue = 'b'
    const schema = {
      a: createField({
        disabled: false,
        value: 'a'
      }),
      levelOne: {
        b: createField({
          disabled: true,
          validations: createValidation(validationSpy, ''),
          value: bValue
        })
      }
    }
    const form = new Form(schema)

    await form.validate()

    expect(form.isValidated).toBe(true)
    expect(validationSpy).not.toHaveBeenCalled()
  })

  test('Payload always reflects current form data', () => {
    const form = new Form(fixtures.getSchema())
    // const bValue = form.fields.info.b.value
    const newValue = 'new b'

    form.fields.info.b.setValue(newValue)

    const newPayload = form.data

    expect(newPayload.info.b).toBe(newValue)
  })

  describe('Handle submit', () => {
    test('Submit handler calls submission function', async () => {
      const form = new Form(fixtures.getSchema())
      const response = 'response'
      const submitFn = jest.fn().mockResolvedValueOnce(response)

      await form.handleSubmit(submitFn)()

      expect(submitFn).toHaveBeenCalledTimes(1)
      expect(submitFn).toHaveBeenCalledWith(form)
    })

    test('If event is passed to submit handler, it calls "preventDefault"', async () => {
      const form = new Form(fixtures.getSchema())
      const response = 'response'
      const submitFn = jest.fn().mockResolvedValueOnce(response)
      const preventDefaultSpy = {
        preventDefault: jest.fn()
      } as unknown as React.FormEvent<HTMLFormElement>

      await form.handleSubmit(submitFn)(preventDefaultSpy)

      expect(preventDefaultSpy.preventDefault).toHaveBeenCalledTimes(1)
    })

    test('If success callback is passed in, it is called after successful submission', async () => {
      const form = new Form(fixtures.getSchema())
      const response = 'response'
      const submitFn = jest.fn().mockResolvedValueOnce(response)
      const successCallback = jest.fn()

      await form.handleSubmit(submitFn, successCallback)()

      expect(successCallback).toHaveBeenCalledTimes(1)
      expect(successCallback).toHaveBeenCalledWith(form, response)
    })

    test('If error callback is passed in, it is called after failed submission', async () => {
      const form = new Form(fixtures.getSchema())
      const response = 'response'
      const submitFn = jest.fn().mockRejectedValueOnce(response)
      const errorCallback = jest.fn()

      await form.handleSubmit(submitFn, undefined, errorCallback)()

      expect(errorCallback).toHaveBeenCalledTimes(1)
      expect(errorCallback).toHaveBeenCalledWith(form, response)
    })

    test('When submit process starts, "isSubmitting" property is true', () => {
      const form = new Form(fixtures.getSchema())
      const submitFn = jest.fn().mockResolvedValueOnce(true)

      form.handleSubmit(submitFn)()

      expect(form.isSubmitting).toBe(true)
    })

    test('When submit process ends, "isSubmitting" property is false', async () => {
      const form = new Form(fixtures.getSchema())
      const submitFn = jest.fn().mockResolvedValueOnce(true)

      await form.handleSubmit(submitFn)()

      expect(form.isSubmitting).toBe(false)
    })

    describe('Successful submit', () => {
      test('"submitError" property is null', async () => {
        const form = new Form(fixtures.getSchema())
        const submitFn = jest.fn().mockResolvedValueOnce(true)

        await form.handleSubmit(submitFn)()

        expect(form.submitError).toBeNull()
      })
      test('"lastSavedData" reflects, last successful submit', async () => {
        const form = new Form(fixtures.getSchema())
        const submitFn = jest.fn().mockResolvedValueOnce(true)
        const dataBeforeSave = form.data
        await form.handleSubmit(submitFn)()
        //change field value
        await form.fields.info.b.setValue('new value')

        expect(form.lastSavedData).toEqual(dataBeforeSave)
        expect(form.lastSavedData).not.toEqual(form.data)
      })

      test("If the form hasn't been submitted, 'lastSavedData' is null", async () => {
        const form = new Form(fixtures.getSchema())

        expect(form.lastSavedData).toBeNull()
      })

      test('When configured to remove disabled fields, set disabled fields to "undefined"', async () => {
        const schema = {
          a: createField({
            disabled: false,
            value: 'a'
          }),
          levelOne: {
            b: createField({
              disabled: true,
              value: 'b'
            })
          }
        }
        const expected = {
          a: 'a'
        }

        const form = new Form(schema, { removeDisabled: true })

        expect(form.data).toStrictEqual(expected)
      })

      test('Validate all fields before submitting the data', async () => {
        const schema = {
          a: createField({
            disabled: false,
            value: 'a'
          }),
          levelOne: {
            b: createField({
              disabled: true,
              value: 'b'
            })
          }
        }
        const form = new Form(schema, { removeDisabled: true })
        const validateSpy = jest.spyOn(form, 'validate')

        await form.handleSubmit(() => Promise.resolve(true))()

        expect(validateSpy).toHaveBeenCalled()
      })

      test("If configured not to validate data, don't execute any validations", async () => {
        const schema = {
          a: createField({
            value: 'a'
          }),
          levelOne: {
            b: createField({
              value: 'b'
            })
          }
        }
        const form = new Form(schema, { validateBeforeSubmit: false })
        const validateSpy = jest.spyOn(form, 'validate')

        await form.handleSubmit(() => Promise.resolve(true))()

        expect(validateSpy).not.toHaveBeenCalled()
      })

      test('If validation fails, fail submission process', async () => {
        const submissionFn = jest.fn()
        const schema = {
          a: createField({
            value: 'a'
          }),
          levelOne: {
            b: createField({
              value: 'b',
              validations: fixtures.validationError('')
            })
          }
        }
        const form = new Form(schema, { validateBeforeSubmit: true })

        const result = await form.handleSubmit(submissionFn)()

        expect(submissionFn).not.toHaveBeenCalled()
        expect(result).toStrictEqual({
          response: FAILED_VALIDATION_RESPONSE,
          status: 'rejected'
        })
      })
    })

    describe('Unsuccessful submit', () => {
      test('"submitError" property holds latest submit error response', async () => {
        const form = new Form(fixtures.getSchema())
        const responseError = 'response error'
        const submitFn = jest.fn().mockRejectedValueOnce(responseError)
        const submit = form.handleSubmit(submitFn)

        await submit()

        expect(form.submitError).toBe(responseError)
      })

      test('submit handler returns response error', async () => {
        const form = new Form(fixtures.getSchema())
        const responseError = 'response error'
        const submitFn = jest.fn().mockRejectedValueOnce(responseError)
        const submit = form.handleSubmit(submitFn)

        await expect(submit()).resolves.toEqual({
          status: 'rejected',
          response: responseError
        })
      })
    })

    describe('Reset', () => {
      describe('Reset to initial values', () => {
        test('After the reset, form has initial values', () => {
          const form = new Form(fixtures.getSchema())
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
        test('After the reset, form is reverted to last successfully saved values', async () => {
          const form = new Form(fixtures.getSchema())
          const submitFn = jest.fn().mockResolvedValueOnce(true)
          const submit = form.handleSubmit(submitFn)
          await submit()

          form.fields.name.setValue('new name')
          form.fields.info.b.setValue('new value')

          expect(form.data).not.toEqual(form.lastSavedData)

          form.resetToLastSaved()

          expect(form.data).toEqual(form.lastSavedData)
        })

        test('If there is no last saved data, reset to initial form values', async () => {
          const form = new Form(fixtures.getSchema())
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
