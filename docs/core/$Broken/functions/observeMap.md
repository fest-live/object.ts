[**@fest-lib/object v0.1.23**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/$Broken](../README.md) / observeMap

# Function: observeMap()

```ts
function observeMap<K, V, T>(map): observeValid<T>;
```

Defined in: core/$Broken.ts:617

Legacy map factory. Prefer `Specific.observeMap()` in newer code.

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`

### T

`T` *extends* [`MapLike`](../../../wrap/Utils/type-aliases/MapLike.md)\<`K`, `V`\> = `Map`\<`K`, `V`\>

## Parameters

### map

`T`

## Returns

[`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<`T`\>
