[**@fest-lib/object API Documentation v0.1.4**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / wrapSetAsArray

# Function: wrapSetAsArray()

> **wrapSetAsArray**\<`T`\>(`source?`, `options?`): `SetArray`\<`T`\>

Defined in: wrap/Utils.ts:213

Expose a `Set` through an array-like mutation API while preserving uniqueness.

WHY: some UI/state code expects `push`/`splice` semantics, but the underlying
source of truth should still reject duplicates like a `Set`.

## Type Parameters

### T

`T`

## Parameters

### source?

`Iterable`\<`T`\> = `[]`

### options?

`SetArrayOptions`\<`T`\> = `{}`

## Returns

`SetArray`\<`T`\>
