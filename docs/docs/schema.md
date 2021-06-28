---
# sidebar_position: 1
---

# Schema

Schema is the most important part of the library, all form logic lives in schema.
With schema we define constraints for the fields in the form.

```ts
const schema: SchemaType = {
  email: createField({
    value: 'admin@example.com',
    validations: createValidation(
      (str: string) => isEmail(str),
      'Not a valid email'
    )
  })
}
```

We just created a simple schema with only one field (`email`) that has an initial value of `admin@example.com` and, there is one validation for this field, it checks if what the user entered is a valid email address, if the address is not valid, this field will contain an error message `Not a valid email`.

Schema can have any number of fields even nested fields.

```ts
const schema: SchemaType = {
  person: {
    name: createField(),
    lastName: createField(),
    address: {
      street: createField(),
      zipCode: createField(),
      city: createField(),
      country: createField()
    }
  }
}
```

## Create schema field

Schema fields are created via `createField()` factory function. There are couple of options that are used with the `createField()` function, in this example we are going to concentrate on the `email` field.

```ts
const schema: SchemaType = {
  name: createField({
    validations: createValidation(
      (str: string) => isAlpha(str),
      'Only letters are allowed'
    )
  }),
  email: createField({
    value: 'admin@example.com',
    validations: [
      createValidation((str: string) => isEmail(str), 'Not a valid email'),
      createValidation(
        (str: string) => isAlpha(str),
        'Only letters are allowed'
      )
    ],
    delay: 100,
    bailEarly: true,
    dependsOn: ['name'],
    disabled: false
  })
}
```

- `value`- the initial value of the field
- `validations` - single validation or array of `validations` for the field to be tested with. [Read more](#creating-field-validation)
- `delay` - delay in running the field validations. This is very handy if you like to debounce user input and not run validations on every user keystroke.
- `bailEarly` - mark field as invalid as soon as the first validation for the field fails. This is only valid when there is more than one validation for the field.
- `disabled` - determine if the field should be disabled. If the field is disabled, it will not be validated, and the form with a disabled field will always be valid.
- `dependsOn` - Fields in a schema can depend on other fields, that means that when the field in the `dependsOn` array (`name` in our example) changes, validations for the `email` field will be automatically triggered. If the field is a deeply nested field inside the schema use _dot_ notation e.g. `person.address.city`

### Advanced

There are two more properties that can be passed to the `createField` function.

- `parseValue` - `(evt: any, field: Field<T>) => any` function to **extract** the value from the field in the actual HTML form. By default this function just takes the value from `evt.currentTarget.value` and passess it for validation. It can be useful if you want to hook the field to something other than html form element (custom component etc...)

- `shouldDisable` - `(value: string, field: Field, dependancy?: Field):boolean` if the function returns **true** schema field will be disabled, and no validations for the field will run., `disabled` property of the field will be `true`. This function is triggered only if `dependsOn` field is declared and not empty.

### Creating Field Validation

Actual field validation tests are created via `createValidation` function.

`createValidation` function accepts two arguments:

- function to carry on the validation. It should return true if field is valid, or if it returns a string it will mark the field as invalid, and the string will be used as the error, in this case, second parameter (message) will be ignored. This is particularly useful when working with dependant fields.
- message to be used as an error if validation fails.

```ts
export type ValidationFn = (
  value: any, // field value
  field: Field<any>, // reference to the field instance
  dependency?: Field<any> // depended field that can also trigger the validation function
) => boolean | Promise<boolean>
```

example function that checks if value is email:

```ts
// isEmail from validator library
import isEmail from 'validator/lib/isEmail'
createValidation((str: string) => isEmail(str), 'Not a valid email')
```

check if value is bigger than 3:

```ts
createValidation(
  (num: number) => Number.isInteger(num) && num > 3,
  'Should be a number and bigger than 3'
)
```

```ts
createValidation((num: number, _field: Field, dependancy: Field) => {
  if (dependancy?.value === 'pool party') {
    if (num > 20) {
      return 'max pool party attendance is 20' // error
    }
    return true //valid
  }
  if (dependancy?.value === 'beach party') {
    if (num > 200) {
      return 'max beach party attendance is 20' // error
    }
    return true //valid
  }
})
```

Field validation will also be triggered if the dependant field changes. If the dependant field is undefined that means that the validation has been triggered from the field itself (not the dependancy). In that case if you still need to access the dependant field or anything else on the form you can use

```ts
const schema: SchemaType = {
  season: createField({
    value: 'summer'
  }),
  sport: createField({
    value: 'swimming',
    validations: [
      createValidation(
        (sport: string, _field: Field<string>, dependancy: Field) => {
          // dependency.name === 'season'

          const form: Form<SchemaType> = field.form
          // form.fields - access any other field

          if (dependency.value === 'summer') {
            return sport === 'swimming'
          }

          if (dependency.value === 'winter') {
            return sport === 'skiing'
          }
        },
        'Not a valid sport'
      )
    ]
  })
}
```
