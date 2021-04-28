import { createValidation, Validation } from '../validation'

describe('Validation', () => {
  test('Create validation via validation factory', () => {
    const msg = 'Test message'
    const fn = () => true
    const validation = createValidation(fn, msg)

    expect(validation).toBeInstanceOf(Validation)
    expect(validation.fn).toBe(fn)
    expect(validation.msg).toBe(msg)
  })
})
