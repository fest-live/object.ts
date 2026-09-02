[**@fest-lib/object v0.1.27**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / ref

# Function: ref()

```ts
function ref<T>(
   typed, 
   prop?, 
   behavior?): T extends symbol | object | Function ? 
  | observeValid<T>
  | refType<T> : refType<T> & T extends symbol | object | Function ? T : any;
```

Defined in: core/Primitives.ts:256

Public ref helper that can either wrap a value or target one specific property.

## Type Parameters

### T

`T` = `any`

## Parameters

### typed

`T` \| `Promise`\<`T`\> \| `null` \| `undefined`

### prop?

`keyType` \| `null`

### behavior?

`any`

## Returns

`T` *extends* `symbol` \| `object` \| `Function` ? 
  \| [`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<`T`\>
  \| [`refType`](../type-aliases/refType.md)\<`T`\> : [`refType`](../type-aliases/refType.md)\<`T`\> & `T` *extends* `symbol` \| `object` \| `Function` ? `T` : `any`
