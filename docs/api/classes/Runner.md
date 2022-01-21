[dumba](../README.md) / Runner

# Class: Runner

Runner
Runs validations and reports results

## Table of contents

### Constructors

- [constructor](Runner.md#constructor)

### Properties

- [bailEarly](Runner.md#bailearly)
- [validations](Runner.md#validations)

### Methods

- [bailEarlyValidation](Runner.md#bailearlyvalidation)
- [validate](Runner.md#validate)

## Constructors

### constructor

• **new Runner**(`validations`, `bailEarly?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `validations` | [`Validation`](Validation.md)[] | `undefined` |
| `bailEarly` | `boolean` | `false` |

#### Defined in

[runner.ts:23](https://github.com/ivandotv/dumba/blob/deccee5/packages/dumba/src/runner.ts#L23)

## Properties

### bailEarly

• `Protected` **bailEarly**: `boolean` = `false`

___

### validations

• **validations**: [`Validation`](Validation.md)[]

## Methods

### bailEarlyValidation

▸ `Protected` **bailEarlyValidation**(`value`, `field`, `dependency?`): `Promise`<[`RunnerResult`](../README.md#runnerresult)\>

Runs validations, and returns on first validation that errors out

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `field` | [`Field`](Field.md)<`any`\> |
| `dependency?` | [`Field`](Field.md)<`any`\> |

#### Returns

`Promise`<[`RunnerResult`](../README.md#runnerresult)\>

early validation

#### Defined in

[runner.ts:80](https://github.com/ivandotv/dumba/blob/deccee5/packages/dumba/src/runner.ts#L80)

___

### validate

▸ **validate**(`value`, `field`, `dependency?`): `Promise`<[`RunnerResult`](../README.md#runnerresult)\>

Run validations, it will run all validations, and then return the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | value to validate against |
| `field` | [`Field`](Field.md)<`any`\> | [Field](Field.md) associated with validations |
| `dependency?` | [`Field`](Field.md)<`any`\> | - |

#### Returns

`Promise`<[`RunnerResult`](../README.md#runnerresult)\>

promise of [RunnerResult](../README.md#runnerresult)

#### Defined in

[runner.ts:32](https://github.com/ivandotv/dumba/blob/deccee5/packages/dumba/src/runner.ts#L32)
