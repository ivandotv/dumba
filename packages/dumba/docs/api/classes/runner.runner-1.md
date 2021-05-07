[dumba](../README.md) / [runner](../modules/runner.md) / Runner

# Class: Runner

[runner](../modules/runner.md).Runner

Runner
Runs validations and reports results

## Table of contents

### Constructors

- [constructor](runner.runner-1.md#constructor)

### Properties

- [bailEarly](runner.runner-1.md#bailearly)
- [validations](runner.runner-1.md#validations)

### Methods

- [bailEarlyValidation](runner.runner-1.md#bailearlyvalidation)
- [validate](runner.runner-1.md#validate)

## Constructors

### constructor

\+ **new Runner**(`validations`: [*Validation*](validation.validation-1.md)[], `bailEarly?`: *boolean*): [*Runner*](runner.runner-1.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `validations` | [*Validation*](validation.validation-1.md)[] | - |
| `bailEarly` | *boolean* | false |

**Returns:** [*Runner*](runner.runner-1.md)

Defined in: [runner.ts:23](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/runner.ts#L23)

## Properties

### bailEarly

• `Protected` **bailEarly**: *boolean*= false

___

### validations

• **validations**: [*Validation*](validation.validation-1.md)[]

## Methods

### bailEarlyValidation

▸ `Protected` **bailEarlyValidation**(`value`: *any*, `ctx`: [*Form*](form.form-1.md)<any\>, `field`: [*Field*](field.field-1.md)<any\>, `dependency?`: [*Field*](field.field-1.md)<any\>): *Promise*<[*RunnerResult*](../modules/runner.md#runnerresult)\>

Runs validations, and returns on first validation that errors out

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *any* |
| `ctx` | [*Form*](form.form-1.md)<any\> |
| `field` | [*Field*](field.field-1.md)<any\> |
| `dependency?` | [*Field*](field.field-1.md)<any\> |

**Returns:** *Promise*<[*RunnerResult*](../modules/runner.md#runnerresult)\>

early validation

Defined in: [runner.ts:82](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/runner.ts#L82)

___

### validate

▸ **validate**(`value`: *any*, `ctx`: [*Form*](form.form-1.md)<any\>, `field`: [*Field*](field.field-1.md)<any\>, `dependency?`: [*Field*](field.field-1.md)<any\>): *Promise*<[*RunnerResult*](../modules/runner.md#runnerresult)\>

Run validations, it will run all validations, and then return the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | *any* | value to validate against |
| `ctx` | [*Form*](form.form-1.md)<any\> | [Form](form.form-1.md) instance |
| `field` | [*Field*](field.field-1.md)<any\> | [Field](field.field-1.md) associated with validations |
| `dependency?` | [*Field*](field.field-1.md)<any\> | - |

**Returns:** *Promise*<[*RunnerResult*](../modules/runner.md#runnerresult)\>

promise of [RunnerResult](../modules/runner.md#runnerresult)

Defined in: [runner.ts:34](https://github.com/ivandotv/dumba/blob/63fcdf7/packages/dumba/src/runner.ts#L34)
