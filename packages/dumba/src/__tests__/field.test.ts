import { Form } from '../form'
import { Field } from '../field'
import { Runner } from '../runner'
import { createField } from '../field-factory'
import { createValidation, Validation } from '../validation'
import * as fixtures from './__fixtures__/fixtures'
import { configure } from 'mobx'

configure({
  enforceActions: 'always'
})

describe('Field #field', () => {
  test('Attach to path', () => {
    const value = 'A'
    const path = '/path'
    const name = 'lastName'
    const form = fixtures.getForm()
    const field = createField({
      value
    })

    field.setPathData(name, path, form)

    expect(field.name).toBe(name)
    expect(field.path).toBe(path)
    expect(field.form).toBe(form)
  })

  describe('Validate', () => {
    test('If there are no tests, pass the validation', async () => {
      const value = 'A'
      const field = createField({
        value
      })

      await field.validate()

      expect(field.errors).toHaveLength(0)
    })

    test('If callback is present, call it', async () => {
      const value = 'A'
      const field = createField({
        value
      })
      const callback = jest.fn()

      await field.validate(callback)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(field)
    })

    test('Use single validation', async () => {
      const value = 'A'
      const message = 'failed validation'
      const field = createField({
        value,
        validations: fixtures.validationError(message)
      })

      await field.validate()

      expect(field.isValid).toBe(false)
      expect(field.errors).toEqual([message])
    })

    test('Use multiple validations', async () => {
      const value = 'A'
      const message = 'failed validation'
      const messageTwo = 'failed validation two'
      const field = createField({
        value,
        validations: [
          fixtures.validationError(message),
          fixtures.validationError(messageTwo)
        ]
      })

      await field.validate()

      expect(field.isValid).toBe(false)
      expect(field.errors).toEqual([message, messageTwo])
    })
  })

  describe('On Change', () => {
    describe('Parse the change object', () => {
      test('Throw if onChange value is not set', async () => {
        const value = 'A'
        const field = createField({
          value,
          validations: [fixtures.asyncValidationOk()]
        })

        await expect(field.onChange(null)).rejects.toThrow(
          "Test value can't be null or undefined"
        )
      })

      test('Throw if onChange value is not an object with "currentTarget" or "target" property', async () => {
        const value = 'A'
        const field = createField({
          value,
          validations: [fixtures.asyncValidationOk()]
        })

        await expect(
          field.onChange({ noTarget: { value: 'test' } })
        ).rejects.toThrow(/Test value can't be null or undefined/)
      })

      test('Correctly parse the onChange object with "currentTarget"', async () => {
        const value = 'A'
        const newValue = 'B'
        const field = createField({
          value,
          validations: [fixtures.asyncValidationOk()]
        })

        await field.onChange({ currentTarget: { value: newValue } })

        expect(field.value).toBe(newValue)
      })

      test('Use custom parse value function to return a custom value', () => {
        const event = { a: { b: { c: { value: 'A' } } } }
        const { field } = fixtures.getField({
          parseValue: (event: any) => event.a.b.c.value
        })

        field.onChange(event)

        expect(field.value).toBe(event.a.b.c.value)
      })

      test('Parse function accepts event like object and a reference to the field', () => {
        const parseSpy = jest.fn().mockImplementation((data: any) => data.value)
        const event = { value: 'A' }
        const { field } = fixtures.getField({
          parseValue: parseSpy
        })

        field.onChange(event)

        expect(parseSpy).toHaveBeenCalledTimes(1)
        expect(parseSpy).toHaveBeenCalledWith(event, field)
      })
    })

    test('When field is disabled, validation is not executed', async () => {
      const validationSpy = jest.fn()
      const schema = {
        a: createField({
          disabled: true,
          value: 'a',
          validations: createValidation(validationSpy, '')
        })
      }
      const form = new Form(schema)

      await form.fields.a.onChange()

      expect(validationSpy).not.toHaveBeenCalled()
    })

    test('When the field is disabled, dependant validation is not executed', async () => {
      const validationSpy = jest.fn()
      const bValue = 'b'
      const schema = {
        a: createField({
          disabled: true,
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            validations: createValidation(validationSpy, ''),
            value: bValue
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.onChange()

      expect(validationSpy).not.toHaveBeenCalled()
    })

    test('When validation is in progress, field is in validating state', async () => {
      const value = 123
      const field = createField({
        value,
        validations: [fixtures.validationOk()]
      })

      expect(field.isValidating).toBe(false)

      const result = field.setValue(value)

      expect(field.isValidating).toBe(true)

      await result

      expect(field.isValidating).toBe(false)
    })

    test('When value gets set, callback is called', async () => {
      const value = 123
      const field = createField({
        value,
        validations: [fixtures.validationOk()]
      })
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
      field.setPathData('', '', form)
      field.onChange(eventOne)
      field.onChange(eventTwo)

      const lastChange = field.onChange(eventThree)

      expect(field.isValidating).toBe(false)
      expect(validationFn).not.toHaveBeenCalled()

      jest.runOnlyPendingTimers()

      expect(field.isValidating).toBe(true)

      await lastChange

      expect(field.isValidating).toBe(false)

      expect(validationFn).toHaveBeenCalledTimes(1)
      expect(validationFn).toHaveBeenCalledWith(
        eventThree.currentTarget.value,
        field,
        undefined
      )
    })

    test('Validate successfully', async () => {
      const event = fixtures.onChangeEvent('A')
      const field = createField({
        value: event.currentTarget.value,
        validations: [fixtures.validationOk()]
      })

      await field.onChange(event)

      expect(field.errors).toEqual([])
      expect(field.isValid).toBe(true)
    })

    test('Validate unsuccessfully', async () => {
      const event = fixtures.onChangeEvent('A')
      const errorMessage = 'failed validation'
      const field = createField({
        value: event.currentTarget.value,
        validations: [
          fixtures.validationOk(),
          fixtures.asyncValidationError(errorMessage)
        ]
      })

      await field.onChange(event)

      expect(field.errors).toEqual([errorMessage])
      expect(field.isValid).toBe(false)
    })

    test('When primitive initial value is not equal to the new value, field is dirty', async () => {
      const value = 'A'
      const event = fixtures.onChangeEvent('B')
      const field = createField({
        value
      })

      await field.onChange(event)

      expect(field.isDirty).toBe(true)
    })

    test('When non primitive initial value (array) is equal to the current value, field is not dirty', async () => {
      const value = [1, 2]
      const newValue = [1, 2]
      const field = createField({
        value
      })

      await field.setValue(newValue)

      expect(field.isDirty).toBe(false)
    })

    test('When non primitive initial value (array) is not equal to the new value, field is dirty', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const field = createField({
        value: event.currentTarget.value
      })

      await field.onChange(newEvent)

      expect(field.isDirty).toBe(true)
    })

    test('When non primitive initial value (object) is not equal to the new value, field is dirty', async () => {
      const value = { a: 'a' }
      const newValue = { a: 'a', b: 'b' }
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.setPathData(name, path, form)

      await field.setValue(newValue)

      expect(field.isDirty).toBe(true)
    })

    test('When non primitive initial value (object) is equal to the new value, field is not dirty', async () => {
      const event = fixtures.onChangeEvent({ a: 'a' })
      const newEvent = fixtures.onChangeEvent({ a: 'a' })
      const field = createField({
        value: event.currentTarget.value
      })

      await field.onChange(newEvent)

      expect(field.isDirty).toBe(false)
    })
  })

  describe('Reset', () => {
    test('Clear all errors', async () => {
      const event = fixtures.onChangeEvent('A')
      const errorMessage = 'failed validation'
      const field = createField({
        value: event.currentTarget.value,
        validations: [fixtures.asyncValidationError(errorMessage)]
      })

      await field.setValue('A')
      field.clearErrors()

      expect(field.errors).toHaveLength(0)
      expect(field.isValid).toBe(true)
    })

    test('When the field is reset, it has the initial value', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const field = createField({
        value: event.currentTarget.value
      })
      await field.onChange(newEvent)

      field.reset()

      expect(field.value).toEqual(event.currentTarget.value)
    })

    test('When the field is reset, it should not keep previous errors', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const errorMessage = 'validation failed'
      const field = createField({
        value: event.currentTarget.value,
        validations: fixtures.validationError(errorMessage)
      })
      await field.onChange(newEvent)

      field.reset()

      expect(field.value).toEqual(event.currentTarget.value)
      expect(field.errors).toStrictEqual([])
    })

    test('When the field is reset, it is not in validated state', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const field = createField({
        value: event.currentTarget.value,
        validations: fixtures.validationOk()
      })
      await field.onChange(newEvent)

      field.reset()

      expect(field.isValidated).toBe(false)
    })

    test('When field is reset, and if the field should always be valid, field is validated', async () => {
      const event = fixtures.onChangeEvent([1])
      const newEvent = fixtures.onChangeEvent([1, 2])
      const field = createField({
        value: event.currentTarget.value
      })
      await field.onChange(newEvent)

      field.reset()

      expect(field.isValidated).toBe(true)
    })
  })

  describe('Dependant fields', () => {
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

    test('If the field to be depended upon is not present, throw error', () => {
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

    test('When the field value is changed, all dependant field validations are executed', async () => {
      const cFunctionSpy = jest.fn().mockReturnValueOnce(true)
      const cValidation = createValidation(cFunctionSpy, '')
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

      expect(cFunctionSpy).toHaveBeenCalledTimes(1)
      expect(cFunctionSpy).toHaveBeenCalledWith(
        cValue,
        form.fields.levelOne.levelTwo.c,
        form.fields.a
      )
    })

    test('When the dependency value is changed, field validates unsuccessfully', async () => {
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

    test('When the field value is set, all dependant field validations are executed', async () => {
      const cFunctionSpy = jest.fn().mockReturnValueOnce(true)
      const cValidation = createValidation(cFunctionSpy, '')
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

      expect(cFunctionSpy).toHaveBeenCalledTimes(1)
      expect(cFunctionSpy).toHaveBeenCalledWith(
        cValue,
        form.fields.levelOne.levelTwo.c,
        form.fields.a
      )
    })

    test('Field can depend on deeply nested fields', async () => {
      const newFieldValue = 'new value'
      const cFunctionSpy = jest.fn().mockReturnValueOnce(true)
      const cValidation = createValidation(cFunctionSpy, '')
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

      expect(cFunctionSpy).toHaveBeenCalledTimes(1)
      expect(cFunctionSpy).toHaveBeenCalledWith(
        cValue,
        form.fields.levelOne.levelTwo.c,
        form.fields.levelOne.b
      )
    })
  })

  describe('Field disabled', () => {
    test('By default, the field is not disabled', () => {
      const field = createField({ value: '' })

      expect(field.isDisabled).toBe(false)
    })

    test('Field can start disabled', () => {
      const field = createField({ value: '', disabled: true })

      expect(field.isDisabled).toBe(true)
    })

    test('"shouldDisable" option function receives correct arguments', async () => {
      const shouldDisableSpy = jest.fn()
      const bValue = 'b'
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            disabled: false,
            shouldDisable: shouldDisableSpy,
            value: 'b'
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.setValue('new value')

      expect(shouldDisableSpy).toHaveBeenCalledTimes(1)
      expect(shouldDisableSpy).toHaveBeenCalledWith(
        bValue,
        form.fields.levelOne.b,
        form.fields.a
      )
    })

    test('When the dependency for the field changes, field can be disabled', async () => {
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            disabled: false,
            shouldDisable: () => {
              return true
            },
            value: 'b'
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.setValue('new value')

      expect(form.fields.levelOne.b.isDisabled).toBe(true)
    })

    test('When the dependency for the field changes, field can be enabled', async () => {
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            disabled: true,
            shouldDisable: () => {
              return false
            },
            value: 'b'
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.setValue('new value')

      expect(form.fields.levelOne.b.isDisabled).toBe(false)
    })

    test('When the dependency field value changes and field is enabled, validation is executed', async () => {
      const validationSpy = jest.fn()
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            disabled: false,
            validations: createValidation(validationSpy, ''),
            shouldDisable: () => {
              return false
            },
            value: 'b'
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.setValue('new value')

      expect(validationSpy).toHaveBeenCalledTimes(1)
    })

    test('When the dependency field value changes and field is disabled, validation is not executed', async () => {
      const validationSpy = jest.fn()
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            disabled: true,
            validations: createValidation(validationSpy, ''),
            value: 'b'
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.setValue('new value')

      expect(validationSpy).not.toHaveBeenCalled()
    })

    test('When the dependency changes, and field is switched to enabled state, validation is executed', async () => {
      const validationSpy = jest.fn()
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            disabled: true,
            shouldDisable: () => {
              return false
            },
            validations: createValidation(validationSpy, ''),
            value: 'b'
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.setValue('new value')

      expect(validationSpy).toHaveBeenCalledTimes(1)
    })

    test('When the dependency changes, and field is switched to disabled, validation is not executed', async () => {
      const validationSpy = jest.fn()
      const schema = {
        a: createField({
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            disabled: false,
            shouldDisable: () => {
              return true
            },
            validations: createValidation(validationSpy, ''),
            value: 'b'
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.setValue('new value')

      expect(validationSpy).not.toHaveBeenCalled()
    })

    test('When the field is set to enabled, validation is executed', async () => {
      const validationSpy = jest.fn()
      const field = createField({
        value: '',
        disabled: true,
        validations: createValidation(validationSpy, '')
      })

      await field.setDisabled(false)

      expect(validationSpy).toHaveBeenCalledTimes(1)
    })

    test('When the field is set to enabled, callback is called', async () => {
      const callbackSpy = jest.fn()
      const field = createField({
        value: '',
        disabled: true
      })

      await field.setDisabled(false, callbackSpy)

      expect(callbackSpy).toHaveBeenCalledTimes(1)
      expect(callbackSpy).toHaveBeenCalledWith(field)
    })

    test('When the field is set to enabled, dependant validation is executed', async () => {
      const validationSpy = jest.fn()
      const bValue = 'b'
      const schema = {
        a: createField({
          disabled: true,
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            validations: createValidation(validationSpy, ''),
            value: bValue
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.setDisabled(false)

      expect(validationSpy).toHaveBeenCalledTimes(1)
      expect(validationSpy).toHaveBeenCalledWith(
        bValue,
        form.fields.levelOne.b,
        form.fields.a
      )
    })

    test('When the field is set to disabled, validation is not executed', async () => {
      const validationSpy = jest.fn()
      const field = createField({
        value: '',
        disabled: false,
        validations: createValidation(validationSpy, '')
      })

      await field.setDisabled(true)

      expect(validationSpy).not.toHaveBeenCalled()
    })

    test('When the field is set to disabled, callback is called', async () => {
      const callbackSpy = jest.fn()
      const field = createField({
        value: '',
        disabled: false
      })

      await field.setDisabled(true, callbackSpy)

      expect(callbackSpy).toHaveBeenCalledTimes(1)
      expect(callbackSpy).toHaveBeenCalledWith(field)
    })

    test('When the field is set to disabled, dependant validation is executed', async () => {
      const validationSpy = jest.fn()
      const bValue = 'b'
      const schema = {
        a: createField({
          disabled: false,
          value: 'a'
        }),
        levelOne: {
          b: createField({
            dependsOn: 'a',
            validations: createValidation(validationSpy, ''),
            value: bValue
          })
        }
      }
      const form = new Form(schema)

      await form.fields.a.setDisabled(true)

      expect(validationSpy).toHaveBeenCalledTimes(1)
      expect(validationSpy).toHaveBeenCalledWith(
        bValue,
        form.fields.levelOne.b,
        form.fields.a
      )
    })
  })
})
