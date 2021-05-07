[dumba](../README.md) / field

# Module: field

## Table of contents

### Classes

- [Field](../classes/field.field-1.md)

### Type aliases

- [CreateFieldData](field.md#createfielddata)
- [FieldResult](field.md#fieldresult)

### Functions

- [createField](field.md#createfield)

## Type aliases

### CreateFieldData

Ƭ **CreateFieldData**<T\>: *object*

Data for the [createField](field.md#createfield) factory

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
| `T` | type of value for the [Field](../classes/field.field-1.md) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bailEarly?` | *boolean* | return as soon as first validation returns error |
| `delay?` | *number* | delay for running the validations |
| `dependsOn?` | *string* \| *string*[] | path to fields that current field should depend on |
| `parseValue?` | (`data`: *any*, `form`: [*Form*](../classes/form.form-1.md)) => *any* | function that can intercept [Field.onChange](../classes/field.field-1.md#onchange) and return a custom value |
| `validations?` | [*Validation*](../classes/validation.validation-1.md)[] \| [*Validation*](../classes/validation.validation-1.md) | array of [Validation](../classes/validation.validation-1.md) to be used for validating the field |
| `value` | T | value of the field |

Defined in: [field.ts:23](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L23)

___

### FieldResult

Ƭ **FieldResult**<T\>: *object*

Result of the [Field](../classes/field.field-1.md) validation

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | value of the [Field](../classes/field.field-1.md) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors` | *string*[] \| ``null`` | error messages |
| `name` | *string* | name of the field |
| `path` | *string* | path of the field in the schema |
| `value` | T | value of the field |

Defined in: [field.ts:55](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L55)

## Functions

### createField

▸ **createField**<T\>(`data`: [*CreateFieldData*](field.md#createfielddata)<T\>): [*Field*](../classes/field.field-1.md)<T\>

Factory function that creates the @class Field

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [*CreateFieldData*](field.md#createfielddata)<T\> | need for the create of the Field instance |

**Returns:** [*Field*](../classes/field.field-1.md)<T\>

[Field](../classes/field.field-1.md) instance

Defined in: [field.ts:79](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/field.ts#L79)
