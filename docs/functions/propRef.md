[**@fest-lib/object API Documentation v0.1.3**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / propRef

# Function: propRef()

> **propRef**\<`T`\>(`src`, `srcProp?`, `initial?`, `behavior?`): `any`

Defined in: core/Primitives.ts:117

Create a reactive reference to one property/slot of an observable source.

WHY: this keeps duplex synchronization between the source slot and the
returned ref-like object while still behaving like a regular `value` ref.

Supported sources:
- object / array: `src[srcProp]`
- Map / WeakMap: `src.get(srcProp)` / `src.set(srcProp, v)`
- Set / WeakSet: boolean membership of `srcProp` (`has` / `add` / `delete`)

Also accepts `[map|set, key]` pair form (same shape as `affected()`).

WHY (Set → boolean): observable object `fallThrough` maps `null`/`undefined`
`.value` back to the wrapper itself, so absence must be a real primitive (`false`).

## Type Parameters

### T

`T` = `any`

## Parameters

### src

[`observeValid`](../type-aliases/observeValid.md)\<`T`\>

### srcProp?

`keyType` \| `null`

### initial?

`any`

### behavior?

`any`

## Returns

`any`
