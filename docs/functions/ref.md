[**@fest-lib/object API Documentation v0.1.2**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / ref

# Function: ref()

> **ref**\<`T`\>(`typed`, `prop?`, `behavior?`): `T` *extends* `symbol` \| `object` \| `Function` ? [`observeValid`](../type-aliases/observeValid.md)\<`T`\> \| [`refType`](../type-aliases/refType.md)\<`T`\> : [`refType`](../type-aliases/refType.md)\<`T`\> & `T` *extends* `symbol` \| `object` \| `Function` ? `T` : `any`

Defined in: core/Primitives.ts:239

Public ref helper that can either wrap a value or target one specific property.

## Type Parameters

### T

`T` = `any`

## Parameters

### typed

`T` \| `Promise`\<`T`\> \| `null` \| `undefined`

### prop?

`keyType` \| `null`

### behavior?

`any`

## Returns

`T` *extends* `symbol` \| `object` \| `Function` ? [`observeValid`](../type-aliases/observeValid.md)\<`T`\> \| [`refType`](../type-aliases/refType.md)\<`T`\> : [`refType`](../type-aliases/refType.md)\<`T`\> & `T` *extends* `symbol` \| `object` \| `Function` ? `T` : `any`
