[**@fest-lib/object v0.1.32**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / observeMap

# Function: observeMap()

```ts
function observeMap<K, V, T>(map): observeValid<T>;
```

Defined in: core/Specific.ts:992

Wrap a map with the map-specific observable proxy.

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
