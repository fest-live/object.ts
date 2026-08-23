[**@fest-lib/object v0.1.18**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / wrapSetAsArray

# Function: wrapSetAsArray()

```ts
function wrapSetAsArray<T>(source?, options?): SetArray<T>;
```

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

[`SetArray`](../type-aliases/SetArray.md)\<`T`\>
