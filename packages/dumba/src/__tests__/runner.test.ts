import { Runner } from '../runner'
import * as fixtures from './__fixtures__/fixtures'
import { getForm } from './__fixtures__/fixtures'

describe('Runner', () => {
  describe('Create', () => {
    test('With one validation instance', () => {
      const validation = fixtures.validationOk()

      const runner = new Runner([validation])

      expect(runner.validations.length).toBe(1)
      expect(runner.validations[0]).toBe(validation)
      expect(runner.validations).toStrictEqual(
        expect.arrayContaining([validation])
      )
    })

    test('With multiple validation instances', () => {
      const validationOne = fixtures.validationOk()
      const validationTwo = fixtures.validationOk()

      const runner = new Runner([validationOne, validationTwo])

      expect(runner.validations.length).toBe(2)
      expect(runner.validations[0]).toBe(validationOne)
      expect(runner.validations[1]).toBe(validationTwo)
    })
  })
  describe('Validate', () => {
    test('With success', () => {
      const expectedValue = 'A'
      const expectedResult = { errors: null, value: expectedValue }
      const runner = new Runner([fixtures.validationOk()])

      const result = runner.validate(expectedValue, getForm())

      expect(result).toEqual(expectedResult)
    })

    test('With failure', () => {
      const value = 'A'
      const messageOne = 'failed'
      const messageTwo = 'second failure'

      const expectedResult = {
        errors: [messageOne, messageTwo],
        value: value
      }

      const runner = new Runner([
        fixtures.validationError(messageOne),
        fixtures.validationError(messageTwo)
      ])

      const result = runner.validate(value, getForm())

      expect(result).toEqual(expectedResult)
    })
    test('With failure - bail early', () => {
      const expectedValue = 'A'
      const expectedMessage = 'failed'
      const expectedResult = {
        errors: [expectedMessage],
        value: expectedValue
      }

      const secondValidation = jest.spyOn(fixtures.validationError(), 'fn')

      const runner = new Runner(
        [fixtures.validationError(expectedMessage)],
        true
      )

      const result = runner.validate(expectedValue, getForm())

      expect(result).toEqual(expectedResult)
      expect(secondValidation).not.toBeCalled()
    })

    test('Throw if there is an asynchronous validation', () => {
      expect.assertions(1)
      try {
        new Runner([fixtures.asyncValidationOk()]).validate(
          'A',
          fixtures.getForm()
        )
      } catch (e) {
        expect(e.message).toEqual(
          expect.stringMatching(/runner has async validations/)
        )
      }
    })
  })

  describe('Validate async', () => {
    test('Success with synchronous validation', async () => {
      const expectedValue = 'A'
      const expectedResult = { errors: null, value: expectedValue }
      const runner = new Runner([fixtures.validationOk()])

      const result = await runner.validateAsync(expectedValue, getForm())

      expect(result).toEqual(expectedResult)
    })

    test('Success with asynchronous validation', async () => {
      const expectedValue = 'A'
      const expectedResult = { errors: null, value: expectedValue }

      const runner = new Runner([fixtures.asyncValidationOk()])
      const result = await runner.validateAsync(expectedValue, getForm())

      expect(result).toEqual(expectedResult)
    })

    test('Failure with synchronous validation', async () => {
      const expectedValue = 'A'
      const expectedMessage = 'failed'
      const expectedResult = {
        errors: [expectedMessage],
        value: expectedValue
      }
      const runner = new Runner([fixtures.validationError(expectedMessage)])

      const result = await runner.validateAsync(expectedValue, getForm())

      expect(result).toEqual(expectedResult)
    })

    test('With failure - bail early', async () => {
      const expectedValue = 'A'
      const expectedMessage = 'failed'
      const expectedResult = {
        errors: [expectedMessage],
        value: expectedValue
      }

      const secondValidation = jest.spyOn(fixtures.validationError(), 'fn')

      const runner = new Runner(
        [fixtures.validationError(expectedMessage)],
        true
      )

      const result = await runner.validateAsync(expectedValue, getForm())

      expect(result).toEqual(expectedResult)
      expect(secondValidation).not.toBeCalled()
    })

    test('Failure with asyncsynchronous validation', async () => {
      const expectedValue = 'A'
      const expectedMessage = 'failed'
      const expectedResult = {
        errors: [expectedMessage],
        value: expectedValue
      }
      const runner = new Runner([
        fixtures.asyncValidationError(expectedMessage)
      ])

      const result = await runner.validateAsync(expectedValue, getForm())

      expect(result).toEqual(expectedResult)
    })

    test('Run multiple synchronous validations', async () => {
      const expectedValue = 'A'
      const fnOne = fixtures.validationOk()
      const fnOneSpy = jest.spyOn(fnOne, 'fn')
      const fnTwo = fixtures.validationOk()
      const fnTwoSpy = jest.spyOn(fnTwo, 'fn')
      const form = getForm()

      const runner = new Runner([fnOne, fnTwo])

      await runner.validateAsync(expectedValue, form)

      expect(fnOneSpy).toBeCalledTimes(1)
      expect(fnOneSpy).toBeCalledWith(expectedValue, form)
      expect(fnTwoSpy).toBeCalledTimes(1)
      expect(fnTwoSpy).toBeCalledWith(expectedValue, form)
    })

    test('Run multiple asyncsynchronous validations', async () => {
      const expectedValue = 'A'
      const fnOne = fixtures.validationOk()
      const fnOneSpy = jest.spyOn(fnOne, 'fn')
      const fnTwo = fixtures.validationOk()
      const fnTwoSpy = jest.spyOn(fnTwo, 'fn')
      const form = getForm()
      const runner = new Runner([fnOne, fnTwo])

      await runner.validateAsync(expectedValue, form)

      expect(fnOneSpy).toBeCalledTimes(1)
      expect(fnOneSpy).toBeCalledWith(expectedValue, form)
      expect(fnTwoSpy).toBeCalledTimes(1)
      expect(fnTwoSpy).toBeCalledWith(expectedValue, form)
    })

    test('Run mix of synchronous and asyncsynchronous validations', async () => {
      const expectedValue = 'A'
      const fnOne = fixtures.validationOk()
      const fnOneSpy = jest.spyOn(fnOne, 'fn')
      const fnTwo = fixtures.validationOk()
      const fnTwoSpy = jest.spyOn(fnTwo, 'fn')

      const fnOneAsync = fixtures.asyncValidationOk()
      const fnOneAsyncSpy = jest.spyOn(fnOneAsync, 'fn')
      const fnTwoAsync = fixtures.asyncValidationOk()
      const fnTwoAsyncSpy = jest.spyOn(fnTwoAsync, 'fn')

      const form = getForm()
      const runner = new Runner([fnOne, fnOneAsync, fnTwo, fnTwoAsync])

      await runner.validateAsync(expectedValue, form)

      expect(fnOneSpy).toBeCalledTimes(1)
      expect(fnOneSpy).toBeCalledWith(expectedValue, form)

      expect(fnTwoSpy).toBeCalledTimes(1)
      expect(fnTwoSpy).toBeCalledWith(expectedValue, form)

      expect(fnOneAsyncSpy).toBeCalledTimes(1)
      expect(fnOneAsyncSpy).toBeCalledWith(expectedValue, form)

      expect(fnTwoAsyncSpy).toBeCalledTimes(1)
      expect(fnTwoAsyncSpy).toBeCalledWith(expectedValue, form)
    })

    test('Return error from async validation', async () => {
      const expectedValue = 'A'
      const expectedSyncMessage = 'sync fail A'
      const expectedAsyncMessage = 'async fail A'
      const form = fixtures.getForm()
      const expectedResult = {
        errors: [expectedSyncMessage, expectedAsyncMessage],
        value: expectedValue
      }
      const validationSync = fixtures.validationError(expectedSyncMessage)
      const validationAsync = fixtures.asyncValidationError(
        expectedAsyncMessage
      )
      const runner = new Runner([validationSync, validationAsync])

      const result = await runner.validateAsync(expectedValue, form)

      expect(expectedResult).toEqual(result)
    })
  })
  describe('Add and remove validations', () => {
    test('Add one validation', () => {
      const expectedValue = 'A'
      const validationMsgOne = 'one'
      const validationMsgTwo = 'two'
      const expectedResult = {
        errors: [validationMsgOne, validationMsgTwo],
        value: expectedValue
      }
      const runner = new Runner([fixtures.validationError(validationMsgOne)])
      const totalBefore = runner.validations.length
      runner.addValidation(fixtures.validationError(validationMsgTwo))

      const result = runner.validate(expectedValue, getForm())

      expect(result).toEqual(expectedResult)
      expect(runner.validations.length).toEqual(totalBefore + 1)
    })

    test('Remove one validation', () => {
      const expectedValue = 'A'
      const validationMsgOne = 'one'
      const validationMsgTwo = 'two'
      const validationTwoName = 'validation two'
      const expectedResult = {
        errors: [validationMsgOne],
        value: expectedValue
      }
      const runner = new Runner([
        fixtures.validationError(validationMsgOne),
        fixtures.validationError(validationMsgTwo, validationTwoName)
      ])
      const totalBefore = runner.validations.length

      runner.removeValidation(validationTwoName)

      const result = runner.validate(expectedValue, getForm())

      expect(result).toEqual(expectedResult)
      expect(runner.validations.length).toBe(totalBefore - 1)
    })
    test('get validation by name', () => {
      const msg = 'one'
      const name = 'name-one'
      const validation = fixtures.validationOk(msg, name)
      const runner = new Runner([validation])

      const result = runner.getValidation(name)

      expect(result).toBe(validation)
    })
  })
})
