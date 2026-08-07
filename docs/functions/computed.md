[**@fest-lib/object API Documentation v0.1.1**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / computed

# Function: computed()

> **computed**\<`T`, `OT`\>(`src`, `cb?`, `behavior?`, `prop?`): [`observeValid`](../type-aliases/observeValid.md)\<`OT`\>

Defined in: core/Assigned.ts:293

Build a computed ref whose getter and optional setter are driven by a source subscription.

## Type Parameters

### T

`T` = `any`

### OT

`OT` = `T`

## Parameters

### src

[`subValid`](../type-aliases/subValid.md)\<`T`\>

### cb?

`Function` \| `null`

### behavior?

`any`

### prop?

`keyType` \| `null`

## Returns

[`observeValid`](../type-aliases/observeValid.md)\<`OT`\>
