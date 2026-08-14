[**@fest-lib/object v0.1.12**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Assigned](../README.md) / link

# Function: link()

```ts
function link<T>(
   a, 
   b, 
   prop?): () => any[];
```

Defined in: core/Assigned.ts:283

Create a duplex link by composing `assign(a, b)` and `assign(b, a)`.

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

() => `any`[]
