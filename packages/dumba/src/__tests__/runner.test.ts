import { Runner } from '../runner'
import * as fixtures from './__fixtures__/fixtures'

describe('Runner', () => {
  describe('Create', () => {
    test('With one validation instance', () => {
      const validation = fixtures.validationOk()

      const runner = new Runner([validation])

      expect(runner.validations).toHaveLength(1)
      expect(runner.validations[0]).toBe(validation)
      expect(runner.validations).toStrictEqual(
        expect.arrayContaining([validation])
      )
    })

    test('With multiple validation instances', () => {
      const validationOne = fixtures.validationOk()
      const validationTwo = fixtures.validationOk()

      const runner = new Runner([validationOne, validationTwo])

      expect(runner.validations).toHaveLength(2)
      expect(runner.validations[0]).toBe(validationOne)
      expect(runner.validations[1]).toBe(validationTwo)
    })
  })

  // describe('Validate', () => {
  //   test('With success', () => {
  //     const expectedValue = 'A'
  //     const expectedResult = { errors: null, value: expectedValue }
  //     const runner = new Runner([fixtures.validationOk()])
  //     const form = fixtures.getForm()
  //     const { field } = fixtures.getField()

  //     const result = runner.validate(expectedValue, form, field)

  //     expect(result).toEqual(expectedResult)
  //   })

  //   test('With failure', () => {
  //     const value = 'A'
  //     const messageOne = 'failed'
  //     const messageTwo = 'second failure'
  //     const expectedResult = {
  //       errors: [messageOne, messageTwo],
  //       value: value
  //     }
  //     const form = fixtures.getForm()
  //     const { field } = fixtures.getField()

  //     const runner = new Runner([
  //       fixtures.validationError(messageOne),
  //       fixtures.validationError(messageTwo)
  //     ])

  //     const result = runner.validate(value, form, field)

  //     expect(result).toEqual(expectedResult)
  //   })
  //   test('Bail early - with failure', () => {
  //     const expectedValue = 'A'
  //     const expectedMessage = 'failed'
  //     const expectedResult = {
  //       errors: [expectedMessage],
  //       value: expectedValue
  //     }

  //     const secondValidation = jest.spyOn(fixtures.validationError(), 'fn')

  //     const runner = new Runner(
  //       [fixtures.validationError(expectedMessage)],
  //       true
  //     )

  //     const form = fixtures.getForm()
  //     const { field } = fixtures.getField()
  //     const result = runner.validate(expectedValue, form, field)

  //     expect(result).toEqual(expectedResult)
  //     expect(secondValidation).not.toHaveBeenCalled()
  //   })
  //   test('Bail early - with success', () => {
  //     const expectedValue = 'A'
  //     const expectedResult = {
  //       errors: null,
  //       value: expectedValue
  //     }

  //     const runner = new Runner([fixtures.validationOk()], true)

  //     const form = fixtures.getForm()
  //     const { field } = fixtures.getField()
  //     const result = runner.validate(expectedValue, form, field)

  //     expect(result).toEqual(expectedResult)
  //   })

  //   test('Throw if there is an asynchronous validation', () => {
  //     const { field } = fixtures.getField()

  //     expect(() =>
  //       new Runner([fixtures.asyncValidationOk()]).validate(
  //         'A',
  //         fixtures.getForm(),
  //         field
  //       )
  //     ).toThrow(/runner has async validations/)
  //   })
  // })

  describe('Validate', () => {
    test('With success', async () => {
      const expectedValue = 'A'
      const expectedResult = { errors: null, value: expectedValue }
      const runner = new Runner([fixtures.validationOk()])

      const form = fixtures.getForm()
      const { field } = fixtures.getField()

      const result = await runner.validate(expectedValue, form, field)

      expect(result).toEqual(expectedResult)
    })

    test('With failure', async () => {
      const expectedValue = 'A'
      const expectedMessage = 'failed'
      const expectedResult = {
        errors: [expectedMessage],
        value: expectedValue
      }
      const runner = new Runner([fixtures.validationError(expectedMessage)])

      const form = fixtures.getForm()
      const { field } = fixtures.getField()
      const result = await runner.validate(expectedValue, form, field)

      expect(result).toEqual(expectedResult)
    })

    test('With success when bail early is true', async () => {
      const expectedValue = 'A'
      const expectedResult = {
        errors: null,
        value: expectedValue
      }
      const form = fixtures.getForm()
      const { field } = fixtures.getField()
      const firstValidation = fixtures.validationOk()
      const firstSpy = jest.spyOn(firstValidation, 'fn')

      const secondValidation = fixtures.validationOk()
      const secondSpy = jest.spyOn(secondValidation, 'fn')

      const runner = new Runner([firstValidation, secondValidation], true)

      const result = await runner.validate(expectedValue, form, field)

      expect(result).toEqual(expectedResult)

      expect(firstSpy).toHaveBeenCalled()
      expect(secondSpy).toHaveBeenCalled()
    })

    test('With failure when bail early is true', async () => {
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

      const form = fixtures.getForm()
      const { field } = fixtures.getField()
      const result = await runner.validate(expectedValue, form, field)

      expect(result).toEqual(expectedResult)
      expect(secondValidation).not.toHaveBeenCalled()
    })

    test('Run multiple validations', async () => {
      const expectedValue = 'A'
      const fnOne = fixtures.validationOk()
      const fnOneSpy = jest.spyOn(fnOne, 'fn')
      const fnTwo = fixtures.validationOk()
      const fnTwoSpy = jest.spyOn(fnTwo, 'fn')
      const form = fixtures.getForm()
      const { field } = fixtures.getField()

      const runner = new Runner([fnOne, fnTwo])

      await runner.validate(expectedValue, form, field)

      expect(fnOneSpy).toHaveBeenCalledTimes(1)
      expect(fnOneSpy).toHaveBeenCalledWith(
        expectedValue,
        form,
        field,
        undefined
      )
      expect(fnTwoSpy).toHaveBeenCalledTimes(1)
      expect(fnTwoSpy).toHaveBeenCalledWith(
        expectedValue,
        form,
        field,
        undefined
      )
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

      const form = fixtures.getForm()
      const { field } = fixtures.getField()
      const runner = new Runner([fnOne, fnOneAsync, fnTwo, fnTwoAsync])

      await runner.validate(expectedValue, form, field)

      expect(fnOneSpy).toHaveBeenCalledTimes(1)
      expect(fnOneSpy).toHaveBeenCalledWith(
        expectedValue,
        form,
        field,
        undefined
      )

      expect(fnTwoSpy).toHaveBeenCalledTimes(1)
      expect(fnTwoSpy).toHaveBeenCalledWith(
        expectedValue,
        form,
        field,
        undefined
      )

      expect(fnOneAsyncSpy).toHaveBeenCalledTimes(1)
      expect(fnOneAsyncSpy).toHaveBeenCalledWith(
        expectedValue,
        form,
        field,
        undefined
      )

      expect(fnTwoAsyncSpy).toHaveBeenCalledTimes(1)
      expect(fnTwoAsyncSpy).toHaveBeenCalledWith(
        expectedValue,
        form,
        field,
        undefined
      )
    })

    test('Return error from async validation', async () => {
      const expectedValue = 'A'
      const expectedSyncMessage = 'sync fail A'
      const expectedAsyncMessage = 'async fail A'
      const form = fixtures.getForm()
      const { field } = fixtures.getField()
      const expectedResult = {
        errors: [expectedSyncMessage, expectedAsyncMessage],
        value: expectedValue
      }
      const validationSync = fixtures.validationError(expectedSyncMessage)
      const validationAsync = fixtures.asyncValidationError(
        expectedAsyncMessage
      )
      const runner = new Runner([validationSync, validationAsync])

      const result = await runner.validate(expectedValue, form, field)

      expect(expectedResult).toEqual(result)
    })
  })
})
