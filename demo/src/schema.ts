import { createField, createValidation, Form } from 'dumba'
import React from 'react'
import isAlpha from 'validator/es/lib/isAlpha'
import isLength from 'validator/es/lib/isLength'
import isEmail from 'validator/lib/isEmail'
import isNumeric from 'validator/lib/isNumeric'

export const schema = {
  username: createField({
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
  typeOptions: {
    types: createField({
      // radio buttons don't need validation
      value: 'letter'
    }),
    numberOrString: createField({
      value: '',
      dependsOn: 'typeOptions.types',
      validations: [
        createValidation(
          (str: string) => isLength(str, { min: 1 }),
          "Can't be empty"
        ),
        createValidation((value: string, form: Form) => {
          const typesValue = form.fields.typeOptions.types.value

          // debugger
          //only handle the case when dropdown value is string
          if ('letter' === typesValue) {
            // check if only letters
            return isAlpha(value)
          }
          return true
        }, 'Must be letters'),
        createValidation((value: string, form: Form) => {
          const typesValue = form.fields.typeOptions.types.value

          //only handle the case when dropdown value is number
          if ('number' === typesValue) {
            // check if number
            return isNumeric(value)
          }

          return true
        }, 'Must be numeric')
      ]
    })
  },
  superhero: createField({
    value: '',
    delay: 400,
    bailEarly: true,
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
      }, 'Superhero not found')
    ]
  })
}
