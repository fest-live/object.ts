[**@fest-lib/object API Documentation v0.1.4**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / assign

# Function: assign()

> **assign**\<`T`\>(`a`, `b`, `prop?`): `any`

Defined in: core/Assigned.ts:197

Bind one reactive endpoint to another, optionally with a compute function.

AI-READ: `a` and `b` can be plain observables or tuple forms like
`[target, prop]`; this function normalizes both forms before wiring.

## Type Parameters

### T

`T` = `any`

## Parameters

### a

[`subValid`](../type-aliases/subValid.md)\<`T`\>

### b

[`subValid`](../type-aliases/subValid.md)\<`T`\>

### prop?

`keyType` \| `null`

## Returns

`any`
