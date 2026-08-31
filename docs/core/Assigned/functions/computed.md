[**@fest-lib/object v0.1.23**](../../../README.md)

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

Defined in: core/Assigned.ts:293

Build a computed ref whose getter and optional setter are driven by a source subscription.

## Type Parameters

### T

`T` = `any`

### OT

`OT` = `T`

## Parameters

### src

[`subValid`](../../../wrap/Utils/type-aliases/subValid.md)\<`T`\>

### cb?

`Function` \| `null`

### behavior?

`any`

### prop?

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md) \| `null`

## Returns

[`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<`OT`\>
