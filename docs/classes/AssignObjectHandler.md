[**@fest-lib/object API Documentation v0.1.1**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / AssignObjectHandler

# Class: AssignObjectHandler

Defined in: wrap/AssignObject.ts:12

Proxy handler that redirects `set` operations to the Fest assignment helper.

## Constructors

### Constructor

> **new AssignObjectHandler**(): `AssignObjectHandler`

Defined in: wrap/AssignObject.ts:13

#### Returns

`AssignObjectHandler`

## Methods

### deleteProperty()

> **deleteProperty**(`target`, `name`): `boolean`

Defined in: wrap/AssignObject.ts:14

#### Parameters

##### target

`any`

##### name

`keyType`

#### Returns

`boolean`

***

### construct()

> **construct**(`target`, `args`, `newT`): `unknown`

Defined in: wrap/AssignObject.ts:15

#### Parameters

##### target

`any`

##### args

`any`

##### newT

`any`

#### Returns

`unknown`

***

### apply()

> **apply**(`target`, `ctx`, `args`): `unknown`

Defined in: wrap/AssignObject.ts:16

#### Parameters

##### target

`any`

##### ctx

`any`

##### args

`any`

#### Returns

`unknown`

***

### has()

> **has**(`target`, `prop`): `boolean`

Defined in: wrap/AssignObject.ts:17

#### Parameters

##### target

`any`

##### prop

`keyType`

#### Returns

`boolean`

***

### set()

> **set**(`target`, `name`, `value`): `boolean`

Defined in: wrap/AssignObject.ts:18

#### Parameters

##### target

`any`

##### name

`keyType`

##### value

`any`

#### Returns

`boolean`

***

### get()

> **get**(`target`, `name`, `ctx`): `any`

Defined in: wrap/AssignObject.ts:19

#### Parameters

##### target

`any`

##### name

`keyType`

##### ctx

`any`

#### Returns

`any`
