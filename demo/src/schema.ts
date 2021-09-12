import { createField, createValidation, Field, getForm } from 'dumba'
import React from 'react'
import isAlpha from 'validator/lib/isAlpha'
import isLength from 'validator/lib/isLength'
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
    parseValue: (
      evt: React.ChangeEvent<HTMLInputElement>,
      field: Field<string>
    ) => {
      const newValue = evt.currentTarget.value

      if (newValue.length === 0) {
        return newValue
      }
      const currentValue = field.value

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
      shouldDisable: (_value: string, _field: Field, dependancy?: Field) => {
        return dependancy?.value === 'disabled'
      },
      validations: [
        createValidation(
          (value: string, _field: Field<string>) => isLength(value, { min: 1 }),
          "Can't be empty"
        ),
        createValidation((value: string, field: Field, dependancy?: Field) => {
          //get the Form instance of the field
          const form = getForm<typeof schema>(field)
          /*
          when validation runs because of the dependency change
            form.fields.typeOptions.types  === dependancy
          */

          if (form.fields.typeOptions.types.value === 'number') {
            return isNumeric(value)
          }

          return true
        }, 'Not a number'),
        createValidation((value: string, field: Field, dependancy?: Field) => {
          const form = getForm<typeof schema>(field)

          if (form.fields.typeOptions.types.value === 'letter') {
            // @ts-expect-error - typings from validator.js are wrong
            return isAlpha(value, undefined, { ignore: ' ' })
          }

          return true
        }, 'Not a letter')
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
