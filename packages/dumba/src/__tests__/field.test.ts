import { Form } from '../form'
import { createField, Field } from '../field'
import { Runner } from '../runner'
import { createValidation, Validation } from '../validation'
import * as fixtures from './__fixtures__/fixtures'
import { configure } from 'mobx'

configure({
  enforceActions: 'always'
})

describe('Field', () => {
  describe('Create', () => {
    test('Attach to path', () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })

      field.attachToPath(name, path, form)

      expect(field.name).toBe(name)
      expect(field.path).toBe(path)
      expect(field.form).toBe(form)
    })
    test('If there are no tests, pass validation', async () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })

      field.attachToPath(name, path, form)

      await field.validate()

      expect(field.errors).toHaveLength(0)
    })
    test('If callback is present, call it', async () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })

      field.attachToPath(name, path, form)
      const callback = jest.fn()

      await field.validate(callback)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(field)
    })
    test('Use single validation', async () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const message = 'failed validation'
      const field = createField({
        value,
        validations: fixtures.validationError(message)
      })
      field.attachToPath(name, path, form)

      await field.validate()

      expect(field.isValid).toBe(false)
      expect(field.errors).toEqual([message])
    })

    test('Use array of validations', async () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const message = 'failed validation'
      const messageTwo = 'failed validation two'
      const field = createField({
        value,
        validations: [
          fixtures.validationError(message),
          fixtures.validationError(messageTwo)
        ]
      })

      field.attachToPath(name, path, form)

      await field.validate()

      expect(field.isValid).toBe(false)
      expect(field.errors).toEqual([message, messageTwo])
    })
  })

  describe('On Change', () => {
    describe('Parse change object', () => {
      test('Throw if onChange value is null', async () => {
        const value = 'A'
        const path = '/path'
        const name = 'lastName'
        const form = fixtures.getForm()
        const field = createField({
          value,
          validations: [fixtures.asyncValidationOk()]
        })

        field.attachToPath(name, path, form)

        await expect(field.onChange(null)).rejects.toThrow(
          "Test value can't be null or undefined"
        )
      })
      test('Throw if onChange value is undefined', async () => {
        const value = 'A'
        const path = '/path'
        const name = 'lastName'
        const form = fixtures.getForm()
        const field = createField({
          value,
          validations: [fixtures.asyncValidationOk()]
        })

        field.attachToPath(name, path, form)

        await expect(field.onChange()).rejects.toThrow(
          /Test value can't be null or undefined/
        )
      })
      test('Throw if onChange value is not an object with "currentTarget" or "target" property', async () => {
        const value = 'A'
        const path = '/path'
        const name = 'lastName'
        const form = fixtures.getForm()
        const field = createField({
          value,
          validations: [fixtures.asyncValidationOk()]
        })

        field.attachToPath(name, path, form)

        await expect(
          field.onChange({ noTarget: { value: 'test' } })
        ).rejects.toThrow(/Test value can't be null or undefined/)
      })

      test('Currectly parse object with "currentTarget"', async () => {
        const value = 'A'
        const newValue = 'B'
        const path = '/path'
        const name = 'lastName'
        const form = fixtures.getForm()
        const field = createField({
          value,
          validations: [fixtures.asyncValidationOk()]
        })

        field.attachToPath(name, path, form)

        await field.onChange({ currentTarget: { value: newValue } })
        expect(field.value).toBe(newValue)
      })

      test('Custom parse value function', () => {
        const event = { a: { b: { c: { value: 'A' } } } }

        const { field } = fixtures.getField({
          parseValue: (event: any) => event.a.b.c.value
        })
        field.onChange(event)

        expect(field.value).toBe(event.a.b.c.value)
      })
    })
    test('When validation is in progress, "isValidating" is true', async () => {
      const value = 123
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value,
        validations: [fixtures.validationOk()]
      })

      field.attachToPath(name, path, form)

      expect(field.isValidating).toBe(false)

      const result = field.setValue(value)

      expect(field.isValidating).toBe(true)

      await result

      expect(field.isValidating).toBe(false)
    })
    test('When value is set, callback is called', async () => {
      const value = 123
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value,
        validations: [fixtures.validationOk()]
      })

      field.attachToPath(name, path, form)

      const callback = jest.fn()

      await field.setValue(value, callback)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(field)
    })

    test('If initialized with a delay, validation process will be delayed', async () => {
      jest.useFakeTimers()
      const eventOne = fixtures.onChangeEvent(1)
      const eventTwo = fixtures.onChangeEvent(2)
      const eventThree = fixtures.onChangeEvent(3)

      const validationFn = jest.fn().mockReturnValue(true)

      const runner = new Runner([new Validation(validationFn, '')])

      const field = new Field(runner, 'A', false, undefined, 100)
      const form = fixtures.getForm()
      field.attachToPath('', '', form)

      field.onChange(eventOne)
      field.onChange(eventTwo)

      const last = field.onChange(eventThree)

      expect(field.isValidating).toBe(false)
      expect(validationFn).not.toHaveBeenCalled()

      jest.runOnlyPendingTimers()

      expect(field.isValidating).toBe(true)

      await last

      expect(field.isValidating).toBe(false)

      expect(validationFn).toHaveBeenCalledTimes(1)
      expect(validationFn).toHaveBeenCalledWith(
        eventThree.currentTarget.value,
        form,
        field,
        undefined
      )
    })

    test('Validate successfully', async () => {
      const event = fixtures.onChangeEvent('A')
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value: event.currentTarget.value,
        validations: [fixtures.validationOk()]
      })

      field.attachToPath(name, path, form)

      const result = field.onChange(event)
      await result
      expect(field.errors).toEqual([])
      expect(field.isValid).toBe(true)
    })

    test('Validate unsuccessfully', async () => {
      const event = fixtures.onChangeEvent('A')
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const errorMessage = 'failed validation'
      const field = createField({
        value: event.currentTarget.value,
        validations: [
          fixtures.validationOk(),
          fixtures.asyncValidationError(errorMessage)
        ]
      })
      field.attachToPath(name, path, form)

      const result = field.onChange(event)

      await result

      expect(field.errors).toEqual([errorMessage])
      expect(field.isValid).toBe(false)
    })

    test('When primitive initial value is not equal to new value, field is dirty', async () => {
      const value = 'A'
      const event = fixtures.onChangeEvent('B')
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.attachToPath(name, path, form)

      const result = field.onChange(event)

      await result

      expect(field.isDirty).toBe(true)
    })

    test('Clear errors', async () => {
      const event = fixtures.onChangeEvent('A')
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const errorMessage = 'failed validation'
      const field = createField({
        value: event.currentTarget.value,
        validations: [fixtures.asyncValidationError(errorMessage)]
      })
      field.attachToPath(name, path, form)

      const result = field.setValue('A')
      await result

      field.clearErrors()
      expect(field.errors).toHaveLength(0)
      expect(field.isValid).toBe(true)
    })
    test('When non primitive initial value (array) is equal to current value, field is not dirty', async () => {
      const value = [1, 2]
      const newValue = [1, 2]
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.attachToPath(name, path, form)

      const result = field.setValue(newValue)

      await result

      expect(field.isDirty).toBe(false)
    })

    test('When non primitive initial value (array) is not equal to new value, field is dirty', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value: event.currentTarget.value
      })
      field.attachToPath(name, path, form)

      const result = field.onChange(newEvent)

      await result

      expect(field.isDirty).toBe(true)
    })

    test('When non primitive initial value (object) is not equal to new value, field is dirty', async () => {
      const value = { a: 'a' }
      const newValue = { a: 'a', b: 'b' }
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.attachToPath(name, path, form)

      const result = field.setValue(newValue)

      await result

      expect(field.isDirty).toBe(true)
    })
    test('When non primitive initial value (object) is equal to new value, field is not dirty', async () => {
      const event = fixtures.onChangeEvent({ a: 'a' })
      const newEvent = fixtures.onChangeEvent({ a: 'a' })
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value: event.currentTarget.value
      })
      field.attachToPath(name, path, form)

      const result = field.onChange(newEvent)

      await result

      expect(field.isDirty).toBe(false)
    })
  })
  describe('Reset', () => {
    test('When field is reset, it has the initial value', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value: event.currentTarget.value
      })
      field.attachToPath(name, path, form)
      await field.onChange(newEvent)

      field.reset()

      expect(field.value).toEqual(event.currentTarget.value)
    })

    test('When field is reset, it should not keep previous errors', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const errorMessage = 'validation failed'
      const field = createField({
        value: event.currentTarget.value,
        validations: fixtures.validationError(errorMessage)
      })
      field.attachToPath(name, path, form)
      await field.onChange(newEvent)

      field.reset()

      expect(field.value).toEqual(event.currentTarget.value)
      expect(field.errors).toStrictEqual([])
    })
    test('When field is reset, "validated" property is "false"', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value: event.currentTarget.value,
        validations: fixtures.validationOk()
      })
      field.attachToPath(name, path, form)
      await field.onChange(newEvent)

      field.reset()

      expect(field.isValidated).toBe(false)
    })
    test('When field is reset, if field is "alwaysValid", "validated" property is "true"', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value: event.currentTarget.value
      })
      field.attachToPath(name, path, form)

      await field.onChange(newEvent)

      field.reset()

      expect(field.isValidated).toBe(true)
    })
  })

  describe('Dependent fields', () => {
    test('Field registers dependencies correctly', () => {
      const bValidation = fixtures.validationOk()
      const cValidation = fixtures.validationOk()
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            value: 'b',
            dependsOn: 'a',
            validations: bValidation
          }),
          levelTwo: {
            c: createField({
              dependsOn: ['a', 'levelOne.b'],
              value: 'c',
              validations: cValidation
            })
          }
        }
      }

      const form = new Form(schema)

      expect(form.fields.a.dependants.size).toBe(2)
      expect([...form.fields.a.dependants.values()]).toStrictEqual(
        expect.arrayContaining([
          form.fields.levelOne.levelTwo.c,
          form.fields.levelOne.b
        ])
      )
    })

    test('If field to be depended upon is not present,throw error', () => {
      const notPresentField = 'c'
      const schema = {
        a: createField({
          value: 'a'
        }),
        b: createField({ value: 'b', dependsOn: notPresentField })
      }

      expect(() => new Form(schema)).toThrow(
        new RegExp(`"${notPresentField}" not found`)
      )
    })

    test('When field is changed, all dependant field validations are run', async () => {
      const cFnSpy = jest.fn().mockReturnValueOnce(true)
      const cValidation = createValidation(cFnSpy, '')
      const cValue = 'c'
      const fieldEvent = { currentTarget: { value: 'new value' } }
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            value: 'b'
          }),
          levelTwo: {
            c: createField({
              dependsOn: ['a'],
              value: cValue,
              validations: cValidation
            })
          }
        }
      }

      const form = new Form(schema)

      await form.fields.a.onChange(fieldEvent)

      expect(cFnSpy).toHaveBeenCalledTimes(1)
      expect(cFnSpy).toHaveBeenCalledWith(
        cValue,
        form,
        form.fields.levelOne.levelTwo.c,
        form.fields.a
      )
    })

    test('Field with dependencies validates unsuccessfully', async () => {
      const validationMessage = 'failed'
      const bValidation = createValidation(() => {
        return false
      }, validationMessage)
      const schema = {
        levelOne: {
          b: createField({
            value: 'b',
            dependsOn: ['levelOne.levelTwo.c'],
            validations: bValidation
          }),
          levelTwo: {
            c: createField({
              value: 'c'
            })
          }
        }
      }

      const form = new Form(schema)

      await form.fields.levelOne.levelTwo.c.setValue('number')

      expect(form.fields.levelOne.b.errors).toEqual([validationMessage])
      expect(form.fields.levelOne.b.isValid).toBe(false)
      expect(form.fields.levelOne.b.isValidated).toBe(true)
    })

    test('When field value is set, all dependant field validations are run', async () => {
      const cFnSpy = jest.fn().mockReturnValueOnce(true)
      const cValidation = createValidation(cFnSpy, '')
      const cValue = 'c'
      const newFieldValue = 'new value'
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            value: 'b'
          }),
          levelTwo: {
            c: createField({
              dependsOn: ['a', 'levelOne.b'],
              value: cValue,
              validations: cValidation
            })
          }
        }
      }
      const form = new Form(schema)

      await form.fields.a.setValue(newFieldValue)

      expect(cFnSpy).toHaveBeenCalledTimes(1)
      expect(cFnSpy).toHaveBeenCalledWith(
        cValue,
        form,
        form.fields.levelOne.levelTwo.c,
        form.fields.a
      )
    })
    test('Can depend on deeply nested fields', async () => {
      const newFieldValue = 'new value'

      const cFnSpy = jest.fn().mockReturnValueOnce(true)
      const cValidation = createValidation(cFnSpy, '')
      const cValue = 'c'
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            value: 'b'
          }),
          levelTwo: {
            c: createField({
              dependsOn: ['a', 'levelOne.b'],
              value: cValue,
              validations: cValidation
            })
          }
        }
      }
      const form = new Form(schema)

      await form.fields.levelOne.b.setValue(newFieldValue)

      expect(cFnSpy).toHaveBeenCalledTimes(1)
      expect(cFnSpy).toHaveBeenCalledWith(
        cValue,
        form,
        form.fields.levelOne.levelTwo.c,
        form.fields.levelOne.b
      )
    })
  })
})
