[**@fest-lib/object v0.1.31**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / wrapRef

# Function: wrapRef()

```ts
function wrapRef<T>(initial?, behavior?): observeValid<refType<T>>;
```

Defined in: core/Primitives.ts:91

Generic ref wrapper for values that do not need one of the specialized primitive ref shapes.

## Type Parameters

### T

`T` = `any`

## Parameters

### initial?

`T` \| `Promise`\<`T`\> \| `null`

### behavior?

`any`

## Returns

[`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<[`refType`](../type-aliases/refType.md)\<`T`\>\>
