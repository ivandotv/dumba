import { createField, createValidation, Form } from 'dumba'
import React from 'react'
import isAlpha from 'validator/es/lib/isAlpha'
import isLength from 'validator/es/lib/isLength'
import isEmail from 'validator/lib/isEmail'
import isNumeric from 'validator/lib/isNumeric'

export const schema = {
  name: createField({
    value: '',
    validations: [
      createValidation(
        (str: string) => isAlpha(str),
        'Only letters are allowed'
      ),
      createValidation(
        (str: string) => isLength(str, { min: 3 }),
        'Name must be more than 3 characters'
      )
    ]
  }),
  email: createField({
    value: 'admin@example.com',
    validations: createValidation(
      (str: string) => isEmail(str),
      'Not a valid email'
    )
  }),
  masked: createField({
    value: '',
    validations: createValidation(
      (str: string) => isLength(str, { min: 1 }),
      'Must have at least one character'
    ),
    parseValue: (evt: React.ChangeEvent<HTMLInputElement>, form: Form<any>) => {
      const newValue = evt.currentTarget.value

      if (newValue.length === 0) {
        return newValue
      }
      const currentValue = form.fields.masked.value

      //todo - compile regex ahead of time
      const regex = /^[ABC]+$/

      const isOnlyABC = regex.test(newValue)
      if (!isOnlyABC) {
        return currentValue
      }
      return newValue
    }
  }),
  types: createField({
    value: 'letter',
    validations: createValidation((value: string, form: Form) => {
      // when the dropdown changes, validate numberOrString
      form.fields.numberOrString.validate()

      return true // this is always valid
    }, '') //always valid, no need for the error message
  }),
  numberOrString: createField({
    value: '',
    validations: [
      createValidation((value: string, form: Form) => {
        const dropdownValue = form.fields.types.value

        //only handle the case when dropdown value is string
        if ('letter' === dropdownValue && form.fields.numberOrString.isDirty) {
          // check if only letters
          return isAlpha(value)
        }
        return true
      }, 'Must be letters'),
      createValidation((value: string, form: Form) => {
        const dropdownValue = form.fields.types.value

        //only handle the case when dropdown value is number
        if ('number' === dropdownValue && form.fields.numberOrString.isDirty) {
          // check if is number
          return isNumeric(value)
        }

        return true
      }, 'Must be numeric')
    ]
  }),
  username: createField({
    value: '',
    delay: 400,
    validations: [
      createValidation(
        (str: string) => isAlpha(str),
        'Required, only letters are allowed'
      ),
      createValidation((str: string) => {
        const p = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(str === 'batman')
          }, 700)
        })

        return p as Promise<boolean>
      }, 'user name taken')
    ]
  })
}
