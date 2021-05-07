[dumba](../README.md) / [form](../modules/form.md) / Form

# Class: Form<TSchema\>

[form](../modules/form.md).Form

## Type parameters

| Name | Default |
| :------ | :------ |
| `TSchema` | *any* |

## Table of contents

### Constructors

- [constructor](form.form-1.md#constructor)

### Properties

- [fields](form.form-1.md#fields)
- [fieldsByPath](form.form-1.md#fieldsbypath)
- [isSubmitting](form.form-1.md#issubmitting)
- [lastSavedDataByPath](form.form-1.md#lastsaveddatabypath)
- [submitError](form.form-1.md#submiterror)

### Accessors

- [data](form.form-1.md#data)
- [isDirty](form.form-1.md#isdirty)
- [isValid](form.form-1.md#isvalid)
- [isValidated](form.form-1.md#isvalidated)
- [isValidating](form.form-1.md#isvalidating)
- [lastSavedData](form.form-1.md#lastsaveddata)

### Methods

- [clearErrors](form.form-1.md#clearerrors)
- [handleSubmit](form.form-1.md#handlesubmit)
- [reset](form.form-1.md#reset)
- [resetToLastSaved](form.form-1.md#resettolastsaved)
- [validate](form.form-1.md#validate)

## Constructors

### constructor

\+ **new Form**<TSchema\>(`schema`: TSchema): [*Form*](form.form-1.md)<TSchema\>

#### Type parameters

| Name | Default |
| :------ | :------ |
| `TSchema` | *any* |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | TSchema |

**Returns:** [*Form*](form.form-1.md)<TSchema\>

Defined in: [form.ts:41](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L41)

## Properties

### fields

• **fields**: TSchema

Defined in: [form.ts:32](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L32)

___

### fieldsByPath

• **fieldsByPath**: *Map*<string, [*Field*](field.field-1.md)<any\>\>

Defined in: [form.ts:39](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L39)

___

### isSubmitting

• **isSubmitting**: *boolean*= false

Defined in: [form.ts:34](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L34)

___

### lastSavedDataByPath

• `Protected` **lastSavedDataByPath**: *Map*<string, any\>

Defined in: [form.ts:41](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L41)

___

### submitError

• **submitError**: ``null``= null

Defined in: [form.ts:36](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L36)

## Accessors

### data

• get **data**(): [*SchemaValues*](../modules/form.md#schemavalues)<TSchema\>

Gets form data. This is an object with the same structure as the schema, but it
only holds values, so it could be sent over the wire.

**Returns:** [*SchemaValues*](../modules/form.md#schemavalues)<TSchema\>

Defined in: [form.ts:112](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L112)

___

### isDirty

• get **isDirty**(): *boolean*

Gets whether any of the fields in the form are dirty. Field is dirty if the current
value of the is different from the value the field was initialized with.

**Returns:** *boolean*

Defined in: [form.ts:151](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L151)

___

### isValid

• get **isValid**(): *boolean*

Gets whether all fields in the form are valid.

**Returns:** *boolean*

Defined in: [form.ts:124](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L124)

___

### isValidated

• get **isValidated**(): *boolean*

Gets whether all the fields in the form have been validated at least once.

**Returns:** *boolean*

Defined in: [form.ts:164](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L164)

___

### isValidating

• get **isValidating**(): *boolean*

Gets whether any of the fields in the form are currently validating.

**Returns:** *boolean*

Defined in: [form.ts:137](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L137)

___

### lastSavedData

• get **lastSavedData**(): ``null`` \| [*SchemaValues*](../modules/form.md#schemavalues)<TSchema\>

After successful form submission, this field holds the data that the form head when it was submitted.

**Returns:** ``null`` \| [*SchemaValues*](../modules/form.md#schemavalues)<TSchema\>

Defined in: [form.ts:178](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L178)

## Methods

### clearErrors

▸ **clearErrors**(): *void*

Clears errors for all form fields.

**Returns:** *void*

Defined in: [form.ts:102](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L102)

___

### handleSubmit

▸ **handleSubmit**<T\>(`submission`: (`form`: [*Form*](form.form-1.md)<TSchema\>) => *Promise*<T\>, `onSuccess?`: (`form`: [*Form*](form.form-1.md)<TSchema\>, `response`: T) => *void*, `onError?`: (`form`: [*Form*](form.form-1.md)<TSchema\>, `response`: *any*) => *void*): *function*

Handles submitting the form

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `submission` | (`form`: [*Form*](form.form-1.md)<TSchema\>) => *Promise*<T\> | function that does the actuall submission process. The function will be awaited for, and the result will be returned. |
| `onSuccess?` | (`form`: [*Form*](form.form-1.md)<TSchema\>, `response`: T) => *void* | - |
| `onError?` | (`form`: [*Form*](form.form-1.md)<TSchema\>, `response`: *any*) => *void* | - |

**Returns:** (`event?`: *FormEvent*<HTMLFormElement\>) => *Promise*<{ `response`: *any* ; `status`: *string* = 'fulfilled' } \| { `response`: *any* ; `status`: *string* = 'rejected' }\>

object with "status" filed that tells if submission was successful or not and "response" field with
the response from the submission function

Defined in: [form.ts:221](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L221)

___

### reset

▸ **reset**(): *void*

Resets form fields to their initial values from the schema

**Returns:** *void*

Defined in: [form.ts:193](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L193)

___

### resetToLastSaved

▸ **resetToLastSaved**(): *void*

Resets form fields to last successfully saved values

**Returns:** *void*

Defined in: [form.ts:202](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L202)

___

### validate

▸ **validate**(`cb?`: (`form`: [*Form*](form.form-1.md)<TSchema\>) => *void*): *Promise*<void\>

Validates form

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | (`form`: [*Form*](form.form-1.md)<TSchema\>) => *void* |

**Returns:** *Promise*<void\>

Defined in: [form.ts:90](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L90)
