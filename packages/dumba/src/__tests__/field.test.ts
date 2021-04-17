import { Field } from '..'
import { createField } from '../field'
import { Runner } from '../runner'
import { Validation } from '../validation'
import * as fixtures from './__fixtures__/fixtures'

describe('Field', () => {
  describe('Create', () => {
    test('If there are no tests, pass sync validation', () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.attachToPath(name, path, form)

      const result = field.validate()

      expect(result).toEqual({ name, path, value, errors: null })
    })
    test('If there are no tests, pass async validation', async () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.attachToPath(name, path, form)

      const result = await field.validate()

      expect(result).toEqual({ name, path, value, errors: null })
    })
    test('Use single test', () => {
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

      const result = field.validate()

      expect(result).toEqual({ name, path, value, errors: [message] })
    })

    test('Use array of validations', () => {
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

      const result = field.validate()

      expect(result).toEqual({
        name,
        path,
        value,
        errors: [message, messageTwo]
      })
    })
  })

  describe('Validate', () => {
    test('Pass validation', () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value,
        validations: [fixtures.validationOk()]
      })
      field.attachToPath(name, path, form)

      const result = field.validate()

      expect(result).toEqual({ name, path, value, errors: null })
    })
    test('Pass async validation', async () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value,
        validations: [fixtures.asyncValidationOk()]
      })
      field.attachToPath(name, path, form)

      const result = await field.validateAsync()

      expect(result).toEqual({ name, path, value, errors: null })
    })

    test('Fail validation', () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const message = 'failed validation'
      const field = createField({
        value,
        validations: [fixtures.validationError(message)]
      })
      field.attachToPath(name, path, form)

      const result = field.validate()

      expect(result).toEqual({ name, path, value, errors: [message] })
    })

    test('Fail async validation', async () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const message = 'failed validation'
      const field = createField({
        value,
        validations: [fixtures.asyncValidationError(message)]
      })
      field.attachToPath(name, path, form)

      const result = await field.validateAsync()

      expect(result).toEqual({ name, path, value, errors: [message] })
    })
  })
  describe('On Change', () => {
    describe('Parse change object', () => {
      test('Simple value', () => {
        const event = 'C'
        const { field } = fixtures.getField()
        field.onChange(event)

        expect(field.value).toBe(event)
      })
      test('Object with "value" property', () => {
        const event = { value: 'C' }
        const { field } = fixtures.getField()
        field.onChange(event)

        expect(field.value).toBe(event.value)
      })
      test('Object with "target.value" property', () => {
        const event = { target: { value: 'C' } }
        const { field } = fixtures.getField()
        field.onChange(event)

        expect(field.value).toBe(event.target.value)
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

      const result = field.setValueAsync(value)

      expect(field.isValidating).toBe(true)

      await result

      expect(field.isValidating).toBe(false)
    })

    test('Add new validation', async () => {
      const newValidation = new Validation(() => true, '', '')
      const runner = new Runner([new Validation(() => true, '', '')])
      const spyFn = jest.spyOn(runner, 'addValidation')
      const field = new Field(runner, 'A', undefined, 100)

      field.addValidation(newValidation)

      expect(spyFn).toBeCalledWith(newValidation)
    })
    test('Remove validation', async () => {
      const validationName = 'validation name'
      const validation = new Validation(() => true, '', validationName)
      const runner = new Runner([validation])
      const spyFn = jest.spyOn(runner, 'removeValidation')
      const field = new Field(runner, 'A', undefined, 100)

      const result = field.removeValidation(validationName)

      expect(spyFn).toBeCalledWith(validationName)
      expect(result).toBe(true)
    })
    test('Get validation', async () => {
      const validationName = 'validation name'
      const validation = new Validation(() => true, '', validationName)
      const runner = new Runner([validation])
      const spyFn = jest.spyOn(runner, 'getValidation')
      const field = new Field(runner, 'A', undefined, 100)

      const result = field.getValidation(validationName)

      expect(spyFn).toBeCalledWith(validationName)
      expect(result).toBe(validation)
    })

    test('If initialized with a delay, validation process will be delayed', async () => {
      jest.useFakeTimers()
      const eventOne = 1
      const eventTwo = 2
      const eventThree = 3

      const validationFn = jest.fn().mockReturnValue(true)

      const runner = new Runner([new Validation(validationFn, '', '')])

      const field = new Field(runner, 'A', undefined, 100)
      const form = fixtures.getForm()
      field.attachToPath('', '', form)

      field.onChange(eventOne)
      field.onChange(eventTwo)

      const last = field.onChange(eventThree)

      expect(field.isValidating).toBe(false)
      expect(validationFn).not.toBeCalled()

      jest.runOnlyPendingTimers()

      expect(field.isValidating).toBe(true)
      await last

      expect(field.isValidating).toBe(false)

      expect(validationFn).toBeCalledTimes(1)
      expect(validationFn).toBeCalledWith(eventThree, form)
    })

    test('Validate successfully', async () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value,
        validations: [fixtures.validationOk()]
      })

      field.attachToPath(name, path, form)

      const result = field.onChange({ value })
      await result
      expect(field.errors).toBeNull()
      expect(field.isValid).toBe(true)
    })

    test('Validate unsuccessfully', async () => {
      const value = 'A'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const errorMessage = 'failed validation'
      const field = createField({
        value,
        validations: [
          fixtures.validationOk(),
          fixtures.asyncValidationError(errorMessage)
        ]
      })
      field.attachToPath(name, path, form)

      const result = field.onChange({ value })

      await result

      expect(field.errors).toEqual([errorMessage])
      expect(field.isValid).toBe(false)
    })

    test('When primitive initial value is not equal to new value, field is dirty', async () => {
      const value = 'A'
      const newValue = 'B'
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.attachToPath(name, path, form)

      const result = field.onChange(newValue)

      await result

      expect(field.isDirty).toBe(true)
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

      const result = field.setValueAsync(newValue)

      await result

      expect(field.isDirty).toBe(false)
    })

    test('When non primitive initial value (array) is not equal to new value, field is dirty', async () => {
      const value = [1]
      const newValue = [1, 2]
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.attachToPath(name, path, form)

      const result = field.setValueAsync(newValue)

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

      const result = field.setValueAsync(newValue)

      await result

      expect(field.isDirty).toBe(true)
    })
    test('When non primitive initial value (object) is equal to new value, field is not dirty', async () => {
      const value = { a: 'a' }
      const newValue = { a: 'a' }
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.attachToPath(name, path, form)

      const result = field.setValueAsync(newValue)

      await result

      expect(field.isDirty).toBe(false)
    })
  })
  describe('Reset', () => {
    test('When field is reset, it has the initial value', async () => {
      const value = [1]
      const newValue = [1, 2]
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const field = createField({
        value
      })
      field.attachToPath(name, path, form)
      await field.setValueAsync(newValue)

      field.reset()

      expect(field.value).toBe(value)
    })

    test('When field is reset, it should not keep previous errors', async () => {
      const value = [1]
      const newValue = [1, 2]
      const path = '/path'
      const name = 'lastName'
      const form = fixtures.getForm()
      const errorMessage = 'validation failed'
      const field = createField({
        value,
        validations: fixtures.validationError(errorMessage)
      })
      field.attachToPath(name, path, form)
      await field.setValueAsync(newValue)

      field.reset()

      expect(field.value).toBe(value)
      expect(field.errors).toBeNull()
    })
  })
})
