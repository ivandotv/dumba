[dumba](../README.md) / form

# Module: form

## Table of contents

### Classes

- [Form](../classes/form.form-1.md)

### Type aliases

- [SchemaResults](form.md#schemaresults)
- [SchemaValues](form.md#schemavalues)

## Type aliases

### SchemaResults

Ƭ **SchemaResults**<T\>: T *extends* *Record*<string, any\> ? { [key in keyof T]: T[key] extends object ? FieldResult<T[key]["value" & keyof T[key]]\> : SchemaResults<T[key]\>} : T

Schema structure with validation results for the fields in the schema

#### Type parameters

| Name |
| :------ |
| `T` |

Defined in: [form.ts:23](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L23)

___

### SchemaValues

Ƭ **SchemaValues**<T\>: T *extends* *Record*<string, any\> ? { [key in keyof T]: T[key] extends object ? T[key]["value" & keyof T[key]] : SchemaValues<T[key]\>} : T

Schema structure with values for the fields in the schema

#### Type parameters

| Name |
| :------ |
| `T` |

Defined in: [form.ts:12](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/form.ts#L12)
