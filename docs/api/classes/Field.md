[dumba](../README.md) / Field

# Class: Field<T\>

Field form the [Form](Form.md)

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `any` | type of the value for the field |

## Table of contents

### Constructors

- [constructor](Field.md#constructor)

### Properties

- [\_dependants](Field.md#_dependants)
- [alwaysValid](Field.md#alwaysvalid)
- [delay](Field.md#delay)
- [dependsOn](Field.md#dependson)
- [errors](Field.md#errors)
- [form](Field.md#form)
- [initialValue](Field.md#initialvalue)
- [isDisabled](Field.md#isdisabled)
- [isValidated](Field.md#isvalidated)
- [isValidating](Field.md#isvalidating)
- [name](Field.md#name)
- [onChange](Field.md#onchange)
- [parseValue](Field.md#parsevalue)
- [path](Field.md#path)
- [runner](Field.md#runner)
- [shouldDisable](Field.md#shoulddisable)
- [timeoutId](Field.md#timeoutid)
- [value](Field.md#value)

### Accessors

- [dependants](Field.md#dependants)
- [isDirty](Field.md#isdirty)
- [isValid](Field.md#isvalid)

### Methods

- [checkForNull](Field.md#checkfornull)
- [clearErrors](Field.md#clearerrors)
- [maybeDisable](Field.md#maybedisable)
- [reset](Field.md#reset)
- [setDisabled](Field.md#setdisabled)
- [setValue](Field.md#setvalue)
- [validate](Field.md#validate)
- [validateDependants](Field.md#validatedependants)

## Constructors

### constructor

• **new Field**<`T`\>(`runner`, `value`, `alwaysValid`, `parseValue?`, `delay?`, `dependsOn?`, `isDisabled?`, `shouldDisable?`)

Creates an instance of field.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `runner` | [`Runner`](Runner.md) | `undefined` |
| `value` | `T` | `undefined` |
| `alwaysValid` | `boolean` | `undefined` |
| `parseValue?` | (`data`: `any`, `field`: [`Field`](Field.md)<`T`\>) => `T` | `undefined` |
| `delay?` | `number` | `undefined` |
| `dependsOn` | `string`[] | `[]` |
| `isDisabled` | `boolean` | `false` |
| `shouldDisable?` | (`value`: `any`, `field`: [`Field`](Field.md)<`any`\>, `dependency?`: [`Field`](Field.md)<`any`\>) => `boolean` \| `Promise`<`boolean`\> | `undefined` |

#### Defined in

[field.ts:95](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L95)

## Properties

### \_dependants

• `Protected` **\_dependants**: `Map`<`string`, [`Field`](Field.md)<`any`\>\>

Fields that depend on this field

#### Defined in

[field.ts:84](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L84)

___

### alwaysValid

• `Protected` **alwaysValid**: `boolean`

___

### delay

• `Optional` **delay**: `number`

___

### dependsOn

• `Protected` **dependsOn**: `string`[] = `[]`

___

### errors

• **errors**: `string`[] = `[]`

Errors from the validation process

#### Defined in

[field.ts:48](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L48)

___

### form

• **form**: [`Form`](Form.md)<`any`\>

Refrence to the [Form](Form.md) that is holding the field instance

#### Defined in

[field.ts:53](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L53)

___

### initialValue

• **initialValue**: `T`

Initial value of field. Field will be reverted to this value after [Field.reset](Field.md#reset)

#### Defined in

[field.ts:68](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L68)

___

### isDisabled

• **isDisabled**: `boolean` = `false`

___

### isValidated

• **isValidated**: `boolean` = `false`

Determines whether field is validated. The value is true when field validations
have run at least once

#### Defined in

[field.ts:43](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L43)

___

### isValidating

• **isValidating**: `boolean` = `false`

Determines whether field is in the process of validating

#### Defined in

[field.ts:37](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L37)

___

### name

• **name**: `string`

Name  of field

#### Defined in

[field.ts:58](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L58)

___

### onChange

• **onChange**: (...`args`: `any`[]) => `Promise`<`void`\>

#### Type declaration

▸ (...`args`): `Promise`<`void`\>

Method to be hooked to the HTML "onChange" event. It will set the value to the field, and run validations.
This method can also be hooked to the HTML "onBlur" event.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`Promise`<`void`\>

#### Defined in

[field.ts:74](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L74)

___

### parseValue

• `Protected` `Optional` **parseValue**: (`data`: `any`, `field`: [`Field`](Field.md)<`T`\>) => `T`

#### Type declaration

▸ (`data`, `field`): `T`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `field` | [`Field`](Field.md)<`T`\> |

##### Returns

`T`

___

### path

• **path**: `string`

Path  of field in the [Form](Form.md) that holds the field

#### Defined in

[field.ts:63](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L63)

___

### runner

• **runner**: [`Runner`](Runner.md)

___

### shouldDisable

• `Protected` `Optional` **shouldDisable**: (`value`: `any`, `field`: [`Field`](Field.md)<`any`\>, `dependency?`: [`Field`](Field.md)<`any`\>) => `boolean` \| `Promise`<`boolean`\>

#### Type declaration

▸ (`value`, `field`, `dependency?`): `boolean` \| `Promise`<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `field` | [`Field`](Field.md)<`any`\> |
| `dependency?` | [`Field`](Field.md)<`any`\> |

##### Returns

`boolean` \| `Promise`<`boolean`\>

___

### timeoutId

• `Protected` `Optional` **timeoutId**: `number`

ID of debounced onChange event

#### Defined in

[field.ts:79](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L79)

___

### value

• **value**: `T`

## Accessors

### dependants

• `get` **dependants**(): `Pick`<`Map`<`string`, [`Field`](Field.md)<`any`\>\>, ``"entries"`` \| ``"forEach"`` \| ``"get"`` \| ``"keys"`` \| ``"size"`` \| ``"values"``\>

Gets all the dependant fields

#### Returns

`Pick`<`Map`<`string`, [`Field`](Field.md)<`any`\>\>, ``"entries"`` \| ``"forEach"`` \| ``"get"`` \| ``"keys"`` \| ``"size"`` \| ``"values"``\>

#### Defined in

[field.ts:235](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L235)

___

### isDirty

• `get` **isDirty**(): `boolean`

Gets whether field is  dirty.
Field is dirty when current value is not equal to the initial value

#### Returns

`boolean`

#### Defined in

[field.ts:316](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L316)

___

### isValid

• `get` **isValid**(): `boolean`

Gets whether field is valid. Field is valid when there are no errors.

#### Returns

`boolean`

#### Defined in

[field.ts:308](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L308)

## Methods

### checkForNull

▸ `Protected` **checkForNull**(`value`): `void`

Checks if value is null

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | value to check |

#### Returns

`void`

#### Defined in

[field.ts:338](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L338)

___

### clearErrors

▸ **clearErrors**(): `void`

Clears all field errors

#### Returns

`void`

#### Defined in

[field.ts:283](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L283)

___

### maybeDisable

▸ `Protected` **maybeDisable**(`dependency`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependency` | [`Field`](Field.md)<`any`\> |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[field.ts:208](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L208)

___

### reset

▸ **reset**(): `void`

Resets the field to the initial value, clears all errors, and runs validations
on all dependant fields.

#### Returns

`void`

#### Defined in

[field.ts:324](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L324)

___

### setDisabled

▸ **setDisabled**(`disable`, `cb?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `disable` | `boolean` |
| `cb?` | (`field`: [`Field`](Field.md)<`T`\>) => `void` |

#### Returns

`Promise`<`void`\>

#### Defined in

[field.ts:216](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L216)

___

### setValue

▸ **setValue**(`value`, `cb?`): `Promise`<`void`\>

Sets value to the field

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | value for the field |
| `cb?` | (`field`: [`Field`](Field.md)<`T`\>) => `void` | - |

#### Returns

`Promise`<`void`\>

#### Defined in

[field.ts:248](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L248)

___

### validate

▸ **validate**(`cb?`): `Promise`<`void`\>

Run all validations for the field

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | (`field`: [`Field`](Field.md)<`T`\>) => `void` |

#### Returns

`Promise`<`void`\>

#### Defined in

[field.ts:275](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L275)

___

### validateDependants

▸ `Protected` **validateDependants**(): `Promise`<`void`[]\>

Runs validations on the dependant fields

#### Returns

`Promise`<`void`[]\>

results of all validations

#### Defined in

[field.ts:190](https://github.com/ivandotv/dumba/blob/2d807dc/packages/dumba/src/field.ts#L190)
