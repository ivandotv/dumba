---
slug: /
---

# Introduction

Dumba.js is a small library (4KB) for handling form data, it is built on top of Mobx.js.
It supports asynchronous validation and a whole lot more.
It does not contain any validation rules though, so for actual field tests it is recommended to use tried and tested third party validation libraries like [Validator.js](https://github.com/validatorjs/validator.js)

## Demo

Take a look at this simple form [Demo](https://dumba-demo.netlify.app/) that shows pretty much all the functionality of the library.

You can also play with it the demo in [CodeSandobx]('')

## Installation

```sh
npm install dumba
```

## Usage

Create the schema

```ts
// schema.ts

import { createField, createValidation } from 'dumba'
import isEmail from 'validator/lib/isEmail'

const schema = {
  email: createField({
    value: 'admin@example.com',
    validations: createValidation(
      (str: string) => isEmail(str),
      'Not a valid email'
    )
  })
}
```

Create the form and connect it with schema

```ts
// form.ts

import { Form } from 'dumba'
import { schema } from './schema'

const form = new Form(schema)

// simple hook like function that returns the form instance
// you could do the react provider dance if that is your thing
export function useForm() {
  return form
}
```

React component

```ts
// FormDemo.tsx

//using material ui just as an example
import TextField from '@material-ui/core/TextField'
import { useForm } from './form'

const FormDemo = observer(function FormDemo() {
  const formStore = useForm()

  //form submit function
  const handleOnSubmit = useMemo(
    () => formStore.handleSubmit((form: Form) => Promise.resolve(true)),
    [formStore]
  )

  return (
    <form onSubmit={handleOnSubmit} autoComplete="off" noValidate>
      <TextField
        type="text"
        id="email"
        name="email"
        label="Email"
        disabled={formStore.isSubmitting}
        value={formStore.fields.email.value}
        onChange={formStore.fields.email.onChange}
        onBlur={formStore.fields.email.onChange}
        error={!!formStore.fields.email.errors.length}
        helperText={<DisplayErrors errors={formStore.fields.email.errors} />}
        autoComplete="off"
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={
          formStore.isSubmitting ||
          formStore.isValidating ||
          !formStore.isValid ||
          !formStore.isValidated
        }
      >
        Submit
      </Button>
    </form>
  )
})
```

There is a lot more you can do with Dumba forms, make sure you read the rest of the documentation.
