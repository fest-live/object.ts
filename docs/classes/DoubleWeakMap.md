[**@fest-lib/object API Documentation v0.1.2**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / DoubleWeakMap

# Class: DoubleWeakMap

Defined in: core/Mainline.ts:256

Two-level WeakMap used to memoize subscriptions keyed by `[target, callback]` pairs.

## Constructors

### Constructor

> **new DoubleWeakMap**(): `DoubleWeakMap`

#### Returns

`DoubleWeakMap`

## Methods

### hasL1()

> **hasL1**(`key1`): `boolean`

Defined in: core/Mainline.ts:276

#### Parameters

##### key1

`any`

#### Returns

`boolean`

***

### set()

> **set**(`pair`, `value`): `DoubleWeakMap`

Defined in: core/Mainline.ts:280

#### Parameters

##### pair

`any`

##### value

`any`

#### Returns

`DoubleWeakMap`

***

### get()

> **get**(`pair`): `any`

Defined in: core/Mainline.ts:286

#### Parameters

##### pair

`any`

#### Returns

`any`

***

### has()

> **has**(`pair`): `any`

Defined in: core/Mainline.ts:291

#### Parameters

##### pair

`any`

#### Returns

`any`

***

### delete()

> **delete**(`pair`): `any`

Defined in: core/Mainline.ts:296

#### Parameters

##### pair

`any`

#### Returns

`any`

***

### deleteTop()

> **deleteTop**(`key1`): `boolean`

Defined in: core/Mainline.ts:302

#### Parameters

##### key1

`any`

#### Returns

`boolean`

***

### getOrCreate()

> **getOrCreate**(`pair`, `factory`): `any`

Defined in: core/Mainline.ts:307

#### Parameters

##### pair

`any`

##### factory

`any`

#### Returns

`any`

***

### getOrInsert()

> **getOrInsert**(`pair`, `value`): `any`

Defined in: core/Mainline.ts:319

#### Parameters

##### pair

`any`

##### value

`any`

#### Returns

`any`

***

### getOrInsertComputed()

> **getOrInsertComputed**(`pair`, `compute`): `any`

Defined in: core/Mainline.ts:331

#### Parameters

##### pair

`any`

##### compute

`any`

#### Returns

`any`
