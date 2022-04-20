dumba

# dumba

## Table of contents

### Classes

- [Field](classes/Field.md)
- [Form](classes/Form.md)
- [Runner](classes/Runner.md)
- [Validation](classes/Validation.md)

### Type aliases

- [CreateFieldData](README.md#createfielddata)
- [FieldResult](README.md#fieldresult)
- [FormConfig](README.md#formconfig)
- [RunnerResult](README.md#runnerresult)
- [SchemaResults](README.md#schemaresults)
- [SchemaValues](README.md#schemavalues)
- [ValidationFn](README.md#validationfn)

### Variables

- [FAILED\_VALIDATION\_RESPONSE](README.md#failed_validation_response)

### Functions

- [createField](README.md#createfield)
- [createValidation](README.md#createvalidation)
- [getForm](README.md#getform)

## Type aliases

### CreateFieldData

Ƭ **CreateFieldData**<`T`\>: `Object`

Data for the [createField](README.md#createfield) factory

**`example`** Depends on
```
const schema = {
  info:{
    name:{}
    nick:{
      dependsOn:'info.name'
    }
  }
}
```

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | type of value for the [Field](classes/Field.md) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bailEarly?` | `boolean` | return as soon as first validation returns error |
| `delay?` | `number` | delay for running the validations |
| `dependsOn?` | `string` \| `string`[] | path to fields that current field should depend on |
| `disabled?` | `boolean` | if field is disabled |
| `validations?` | [`Validation`](classes/Validation.md)[] \| [`Validation`](classes/Validation.md) | array of [Validation](classes/Validation.md) to be used for validating the field |
| `value` | `T` | value of the field |
| `parseValue?` | (`data`: `any`, `field`: [`Field`](classes/Field.md)<`T`\>) => `any` | function that can intercept [Field.onChange](classes/Field.md#onchange) and return a custom value |
| `shouldDisable?` | (`value`: `any`, `field`: [`Field`](classes/Field.md)<`any`\>, `dependency?`: [`Field`](classes/Field.md)<`any`\>) => `boolean` \| `Promise`<`boolean`\> | - |

#### Defined in

[field-factory.ts:21](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/field-factory.ts#L21)

___

### FieldResult

Ƭ **FieldResult**<`T`\>: `Object`

Result of the [Field](classes/Field.md) validation

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `any` | value of the [Field](classes/Field.md) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors` | `string`[] \| ``null`` | error messages |
| `name` | `string` | name of the field |
| `path` | `string` | path of the field in the schema |
| `value` | `T` | value of the field |

#### Defined in

[field.ts:10](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/field.ts#L10)

___

### FormConfig

Ƭ **FormConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `removeDisabled?` | `boolean` |
| `validateBeforeSubmit?` | `boolean` |

#### Defined in

[form.ts:36](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/form.ts#L36)

___

### RunnerResult

Ƭ **RunnerResult**: `Object`

Result of running all [Validations](classes/Validation.md)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors` | ``null`` \| `string`[] | error messages |
| `value` | `any` | value that was validated against |

#### Defined in

[runner.ts:7](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/runner.ts#L7)

___

### SchemaResults

Ƭ **SchemaResults**<`T`\>: `T` extends `Record`<`string`, `any`\> ? { [key in keyof T]: T[key] extends Object ? FieldResult<T[key]["value" & keyof T[key]]\> : SchemaResults<T[key]\> } : `T`

Schema structure with validation results for the fields in the schema

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[form.ts:28](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/form.ts#L28)

___

### SchemaValues

Ƭ **SchemaValues**<`T`\>: `T` extends `Record`<`string`, `any`\> ? { [key in keyof T]: T[key] extends Object ? T[key]["value" & keyof T[key]] : SchemaValues<T[key]\> } : `T`

Schema structure with values for the fields in the schema

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[form.ts:17](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/form.ts#L17)

___

### ValidationFn

Ƭ **ValidationFn**: (`value`: `any`, `field`: [`Field`](classes/Field.md)<`any`\>, `dependency?`: [`Field`](classes/Field.md)<`any`\>) => `boolean` \| `Promise`<`boolean`\> \| `string` \| `Promise`<`string`\>

#### Type declaration

▸ (`value`, `field`, `dependency?`): `boolean` \| `Promise`<`boolean`\> \| `string` \| `Promise`<`string`\>

Validation function signature

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | value to be validated |
| `field` | [`Field`](classes/Field.md)<`any`\> | - |
| `dependency?` | [`Field`](classes/Field.md)<`any`\> | - |

##### Returns

`boolean` \| `Promise`<`boolean`\> \| `string` \| `Promise`<`string`\>

#### Defined in

[validation.ts:8](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/validation.ts#L8)

## Variables

### FAILED\_VALIDATION\_RESPONSE

• **FAILED\_VALIDATION\_RESPONSE**: ``"validation_failed"``

Response string that is returned when the form fails validation

#### Defined in

[form.ts:12](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/form.ts#L12)

## Functions

### createField

▸ **createField**<`T`\>(`data`): [`Field`](classes/Field.md)<`T`\>

Factory function that creates the @class Field

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`CreateFieldData`](README.md#createfielddata)<`T`\> | field data |

#### Returns

[`Field`](classes/Field.md)<`T`\>

instance of [Field](classes/Field.md)

#### Defined in

[field-factory.ts:68](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/field-factory.ts#L68)

___

### createValidation

▸ **createValidation**(`fn`, `msg?`): [`Validation`](classes/Validation.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fn` | [`ValidationFn`](README.md#validationfn) | `undefined` |
| `msg` | `string` | `Validation.defaultMessage` |

#### Returns

[`Validation`](classes/Validation.md)

#### Defined in

[validation.ts:14](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/validation.ts#L14)

___

### getForm

▸ **getForm**<`T`\>(`field`): [`Form`](classes/Form.md)<`T`\>

Gets the form [Form](classes/Form.md) from the passed in field

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | value of the Form schema |

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Field`](classes/Field.md)<`any`\> |

#### Returns

[`Form`](classes/Form.md)<`T`\>

#### Defined in

[utils.ts:24](https://github.com/ivandotv/dumba/blob/a5ded83/packages/dumba/src/utils.ts#L24)
