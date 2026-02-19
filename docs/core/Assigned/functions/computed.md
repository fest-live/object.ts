[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Assigned](../README.md) / computed

# Function: computed()

```ts
function computed<T, OT>(
   src, 
   cb?, 
   behavior?, 
prop?): observeValid<OT>;
```

Defined in: [core/Assigned.ts:248](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Assigned.ts#L248)

## Type Parameters

### T

`T` = `any`

### OT

`OT` = `T`

## Parameters

### src

[`subValid`](../../../wrap/Utils/type-aliases/subValid.md)\<`T`\>

### cb?

`Function` | `null`

### behavior?

`any`

### prop?

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md) | `null`

## Returns

[`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<`OT`\>
