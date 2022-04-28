[dumba](../README.md) / Form

# Class: Form<TSchema\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | `any` |

## Table of contents

### Constructors

- [constructor](Form.md#constructor)

### Properties

- [config](Form.md#config)
- [fields](Form.md#fields)
- [fieldsByPath](Form.md#fieldsbypath)
- [isSubmitting](Form.md#issubmitting)
- [lastSavedDataByPath](Form.md#lastsaveddatabypath)
- [submitError](Form.md#submiterror)

### Accessors

- [data](Form.md#data)
- [isDirty](Form.md#isdirty)
- [isValid](Form.md#isvalid)
- [isValidated](Form.md#isvalidated)
- [isValidating](Form.md#isvalidating)
- [lastSavedData](Form.md#lastsaveddata)

### Methods

- [clearErrors](Form.md#clearerrors)
- [handleSubmit](Form.md#handlesubmit)
- [reset](Form.md#reset)
- [resetToLastSaved](Form.md#resettolastsaved)
- [validate](Form.md#validate)

## Constructors

### constructor

• **new Form**<`TSchema`\>(`schema`, `config?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `TSchema` |
| `config` | [`FormConfig`](../README.md#formconfig) |

#### Defined in

[form.ts:62](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L62)

## Properties

### config

• `Protected` **config**: [`FormConfig`](../README.md#formconfig) = `{}`

___

### fields

• **fields**: `TSchema`

Access to fields that are created from the schema

#### Defined in

[form.ts:45](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L45)

___

### fieldsByPath

• **fieldsByPath**: `Map`<`string`, [`Field`](Field.md)<`any`\>\>

#### Defined in

[form.ts:58](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L58)

___

### isSubmitting

• **isSubmitting**: `boolean` = `false`

Determines whether form is in the process of submitting

#### Defined in

[form.ts:50](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L50)

___

### lastSavedDataByPath

• `Protected` **lastSavedDataByPath**: `Map`<`string`, `any`\>

#### Defined in

[form.ts:60](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L60)

___

### submitError

• **submitError**: `unknown` = `null`

Holds last submission error

#### Defined in

[form.ts:55](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L55)

## Accessors

### data

• `get` **data**(): [`SchemaValues`](../README.md#schemavalues)<`TSchema`\>

Gets form data. This is an object with the same structure as the schema, but it
only holds values, so it could be sent over the wire.

#### Returns

[`SchemaValues`](../README.md#schemavalues)<`TSchema`\>

#### Defined in

[form.ts:141](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L141)

___

### isDirty

• `get` **isDirty**(): `boolean`

Gets whether any of the fields in the form are dirty. Field is dirty if the current
value of the is different from the value the field was initialized with.

#### Returns

`boolean`

#### Defined in

[form.ts:183](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L183)

___

### isValid

• `get` **isValid**(): `boolean`

Gets whether all fields in the form are valid.

#### Returns

`boolean`

#### Defined in

[form.ts:156](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L156)

___

### isValidated

• `get` **isValidated**(): `boolean`

Gets whether all the fields in the form have been validated at least once.
Don't confuse this propety with [Form.isValid](Form.md#isvalid)

#### Returns

`boolean`

#### Defined in

[form.ts:197](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L197)

___

### isValidating

• `get` **isValidating**(): `boolean`

Gets whether any of the fields in the form are currently validating.

#### Returns

`boolean`

#### Defined in

[form.ts:169](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L169)

___

### lastSavedData

• `get` **lastSavedData**(): ``null`` \| [`SchemaValues`](../README.md#schemavalues)<`TSchema`\>

After successful form submission, this field holds the data that the form head when it was submitted.

#### Returns

``null`` \| [`SchemaValues`](../README.md#schemavalues)<`TSchema`\>

#### Defined in

[form.ts:211](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L211)

## Methods

### clearErrors

▸ **clearErrors**(): `void`

Clears errors for all form fields.

#### Returns

`void`

#### Defined in

[form.ts:131](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L131)

___

### handleSubmit

▸ **handleSubmit**<`T`\>(`submission`, `onSuccess?`, `onError?`): (`event?`: `FormEvent`<`HTMLFormElement`\>) => `Promise`<{ `response`: `unknown` = err; `status`: `string` = 'rejected' }\>

Handles submitting the form

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `submission` | (`form`: [`Form`](Form.md)<`TSchema`\>) => `Promise`<`T`\> | function that does the actuall submission process. The function will be awaited for, and the result will be returned. |
| `onSuccess?` | (`form`: [`Form`](Form.md)<`TSchema`\>, `response`: `T`) => `void` | - |
| `onError?` | (`form`: [`Form`](Form.md)<`TSchema`\>, `response`: `any`) => `void` | - |

#### Returns

`fn`

object with "status" filed that tells if submission was successful or not and "response" field with
the response from the submission function

▸ (`event?`): `Promise`<{ `response`: `unknown` = err; `status`: `string` = 'rejected' }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `FormEvent`<`HTMLFormElement`\> |

##### Returns

`Promise`<{ `response`: `unknown` = err; `status`: `string` = 'rejected' }\>

#### Defined in

[form.ts:254](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L254)

___

### reset

▸ **reset**(): `void`

Resets form fields to their initial values from the schema

#### Returns

`void`

#### Defined in

[form.ts:226](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L226)

___

### resetToLastSaved

▸ **resetToLastSaved**(): `void`

Resets form fields to last successfully saved values

#### Returns

`void`

#### Defined in

[form.ts:235](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L235)

___

### validate

▸ **validate**(`cb?`): `Promise`<`void`\>

Validates form

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | (`form`: [`Form`](Form.md)<`TSchema`\>) => `void` |

#### Returns

`Promise`<`void`\>

#### Defined in

[form.ts:114](https://github.com/ivandotv/dumba/blob/213e863/packages/dumba/src/form.ts#L114)
