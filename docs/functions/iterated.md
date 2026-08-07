[**@fest-lib/object API Documentation v0.1.2**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / iterated

# Function: iterated()

> **iterated**\<`T`\>(`tg`, `cb`, `options?`): `any`

Defined in: core/Mainline.ts:350

Subscribe to iteration-level changes for arrays, sets, maps, and ref-like
containers whose `value` should itself be treated as a collection.

## Type Parameters

### T

`T` = `any`

## Parameters

### tg

[`subValid`](../type-aliases/subValid.md)\<`T`\>

### cb

[`AffectedCallback`](../type-aliases/AffectedCallback.md)

### options?

[`AffectedConfig`](../type-aliases/AffectedConfig.md) = `...`

## Returns

`any`
