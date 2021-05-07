[dumba](../README.md) / [field](../modules/field.md) / Field

# Class: Field<T\>

[field](../modules/field.md).Field

Field form the [Form](form.form-1.md)

## Type parameters

| Name | Description |
| :------ | :------ |
| `T` | type of the value for the field |

## Table of contents

### Constructors

- [constructor](field.field-1.md#constructor)

### Properties

- [\_dependants](field.field-1.md#_dependants)
- [alwaysValid](field.field-1.md#alwaysvalid)
- [delay](field.field-1.md#delay)
- [dependsOn](field.field-1.md#dependson)
- [errors](field.field-1.md#errors)
- [form](field.field-1.md#form)
- [initialValue](field.field-1.md#initialvalue)
- [isValidated](field.field-1.md#isvalidated)
- [isValidating](field.field-1.md#isvalidating)
- [name](field.field-1.md#name)
- [onChange](field.field-1.md#onchange)
- [parseValue](field.field-1.md#parsevalue)
- [path](field.field-1.md#path)
- [runner](field.field-1.md#runner)
- [timeoutId](field.field-1.md#timeoutid)
- [value](field.field-1.md#value)

### Accessors

- [dependants](field.field-1.md#dependants)
- [isDirty](field.field-1.md#isdirty)
- [isValid](field.field-1.md#isvalid)

### Methods

- [checkForNull](field.field-1.md#checkfornull)
- [clearErrors](field.field-1.md#clearerrors)
- [reset](field.field-1.md#reset)
- [setPathData](field.field-1.md#setpathdata)
- [setValue](field.field-1.md#setvalue)
- [validate](field.field-1.md#validate)
- [validateDependants](field.field-1.md#validatedependants)

## Constructors

### constructor

\+ **new Field**<T\>(`runner`: [*Runner*](runner.runner-1.md), `value`: T, `alwaysValid`: *boolean*, `parseValue?`: (`data`: *any*, `form`: [*Form*](form.form-1.md)<any\>) => *any*, `delay?`: *number*, `dependsOn?`: *string*[]): [*Field*](field.field-1.md)<T\>

Creates an instance of field.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `runner` | [*Runner*](runner.runner-1.md) | - |
| `value` | T | - |
| `alwaysValid` | *boolean* | - |
| `parseValue?` | (`data`: *any*, `form`: [*Form*](form.form-1.md)<any\>) => *any* | - |
| `delay?` | *number* | - |
| `dependsOn` | *string*[] | [] |

**Returns:** [*Field*](field.field-1.md)<T\>

Defined in: [field.ts:159](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L159)

## Properties

### \_dependants

• `Protected` **\_dependants**: *Map*<string, [*Field*](field.field-1.md)<any\>\>

Defined in: [field.ts:159](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L159)

___

### alwaysValid

• `Protected` **alwaysValid**: *boolean*

___

### delay

• `Optional` **delay**: *number*

___

### dependsOn

• `Protected` **dependsOn**: *string*[]= []

___

### errors

• **errors**: *string*[]= []

Errors from the validation process

Defined in: [field.ts:129](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L129)

___

### form

• **form**: [*Form*](form.form-1.md)<any\>

Refrence to the [Form](form.form-1.md) that is holding the field instance

Defined in: [field.ts:134](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L134)

___

### initialValue

• **initialValue**: T

Initial value of field. Field will be reverted to this value after [Field.reset](field.field-1.md#reset)

Defined in: [field.ts:149](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L149)

___

### isValidated

• **isValidated**: *boolean*= false

Determines whether field is validated. The value is true when field validations
have run at least once

Defined in: [field.ts:124](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L124)

___

### isValidating

• **isValidating**: *boolean*= false

Determines whether field is in the process of validating

Defined in: [field.ts:118](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L118)

___

### name

• **name**: *string*

Name  of field

Defined in: [field.ts:139](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L139)

___

### onChange

• **onChange**: (...`args`: *any*[]) => *Promise*<void\>

Method to be hooked to the HTML "onChange" event. It will set the value to the field, and run validations.
This method can also be hooked to the HTML "onBlur" event.

#### Type declaration

▸ (...`args`: *any*[]): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | *any*[] |

**Returns:** *Promise*<void\>

Defined in: [field.ts:155](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L155)

Defined in: [field.ts:155](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L155)

___

### parseValue

• `Protected` `Optional` **parseValue**: (`data`: *any*, `form`: [*Form*](form.form-1.md)<any\>) => *any*

#### Type declaration

▸ (`data`: *any*, `form`: [*Form*](form.form-1.md)<any\>): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | *any* |
| `form` | [*Form*](form.form-1.md)<any\> |

**Returns:** *any*

Defined in: [field.ts:174](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L174)

___

### path

• **path**: *string*

Path  of field in the [Form](form.form-1.md) that holds the field

Defined in: [field.ts:144](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L144)

___

### runner

• **runner**: [*Runner*](runner.runner-1.md)

___

### timeoutId

• `Protected` `Optional` **timeoutId**: *number*

Defined in: [field.ts:157](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L157)

___

### value

• **value**: T

## Accessors

### dependants

• get **dependants**(): *Pick*<Map<string, [*Field*](field.field-1.md)<any\>\>, ``"entries"`` \| ``"forEach"`` \| ``"get"`` \| ``"keys"`` \| ``"size"`` \| ``"values"``\>

Gets all the dependant fields

**Returns:** *Pick*<Map<string, [*Field*](field.field-1.md)<any\>\>, ``"entries"`` \| ``"forEach"`` \| ``"get"`` \| ``"keys"`` \| ``"size"`` \| ``"values"``\>

Defined in: [field.ts:265](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L265)

___

### isDirty

• get **isDirty**(): *boolean*

Gets whether field is  dirty.
Field is dirty when current value is not equal to the initial value

**Returns:** *boolean*

Defined in: [field.ts:350](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L350)

___

### isValid

• get **isValid**(): *boolean*

Gets whether field is valid. Field is valid when there are no errors.

**Returns:** *boolean*

Defined in: [field.ts:342](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L342)

## Methods

### checkForNull

▸ `Protected` **checkForNull**(`value`: *any*): *void*

Checks if value is null

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | *any* | value to check |

**Returns:** *void*

Defined in: [field.ts:372](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L372)

___

### clearErrors

▸ **clearErrors**(): *void*

Clears all field errors

**Returns:** *void*

Defined in: [field.ts:312](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L312)

___

### reset

▸ **reset**(): *void*

Resets the field to the initial value, clears all errors, and runs validations
on all dependant fields.

**Returns:** *void*

Defined in: [field.ts:358](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L358)

___

### setPathData

▸ **setPathData**(`name`: *string*, `path`: *string*, `form`: [*Form*](form.form-1.md)<any\>): *void*

Sets data that determines at what location the field is attached to the {@link Form.}

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | *string* | name of the field |
| `path` | *string* | dot notation of the path e.g. info.location.zip |
| `form` | [*Form*](form.form-1.md)<any\> | reference to the [Form](form.form-1.md) |

**Returns:** *void*

Defined in: [field.ts:294](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L294)

___

### setValue

▸ **setValue**(`value`: T, `cb?`: (`field`: [*Field*](field.field-1.md)<T\>) => *void*): *Promise*<void\>

Sets value to the field

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | T | value for the field |
| `cb?` | (`field`: [*Field*](field.field-1.md)<T\>) => *void* | - |

**Returns:** *Promise*<void\>

Defined in: [field.ts:278](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L278)

___

### validate

▸ **validate**(`cb?`: (`field`: [*Field*](field.field-1.md)<T\>) => *void*): *Promise*<void\>

Run all validations for the field

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | (`field`: [*Field*](field.field-1.md)<T\>) => *void* |

**Returns:** *Promise*<void\>

Defined in: [field.ts:304](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L304)

___

### validateDependants

▸ `Protected` **validateDependants**(): *any*

Runs validations on the dependant fields

**Returns:** *any*

results of all validations

Defined in: [field.ts:252](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L252)
