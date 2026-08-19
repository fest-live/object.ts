[**@fest-lib/object v0.1.16**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Assigned](../README.md) / assign

# Function: assign()

```ts
function assign<T>(
   a, 
   b, 
   prop?): any;
```

Defined in: core/Assigned.ts:197

Bind one reactive endpoint to another, optionally with a compute function.

AI-READ: `a` and `b` can be plain observables or tuple forms like
`[target, prop]`; this function normalizes both forms before wiring.

## Type Parameters

### T

`T` = `any`

## Parameters

### a

[`subValid`](../../../wrap/Utils/type-aliases/subValid.md)\<`T`\>

### b

[`subValid`](../../../wrap/Utils/type-aliases/subValid.md)\<`T`\>

### prop?

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md) \| `null`

## Returns

`any`
