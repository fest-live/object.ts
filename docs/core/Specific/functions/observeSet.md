[**@fest-lib/object v0.1.18**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / observeSet

# Function: observeSet()

```ts
function observeSet<K, V, T>(set): observeValid<T>;
```

Defined in: core/Specific.ts:959

Wrap a set with the set-specific observable proxy.

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`

### T

`T` *extends* [`SetLike`](../../../wrap/Utils/type-aliases/SetLike.md)\<`K`, `V`\> = `Set`\<`K`\>

## Parameters

### set

`T`

## Returns

[`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<`T`\>
