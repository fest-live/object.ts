[**@fest-lib/object v0.1.32**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / $ref

# Function: $ref()

```ts
function $ref<T>(typed, behavior?): T extends symbol | object | Function ? 
  | observeValid<T>
| refType<T> : refType<T>;
```

Defined in: core/Primitives.ts:245

Pick the most suitable ref implementation for the provided value type.

## Type Parameters

### T

`T` = `any`

## Parameters

### typed

`T` \| `Promise`\<`T`\> \| `null` \| `undefined`

### behavior?

`any`

## Returns

`T` *extends* `symbol` \| `object` \| `Function` ? 
  \| [`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<`T`\>
  \| [`refType`](../type-aliases/refType.md)\<`T`\> : [`refType`](../type-aliases/refType.md)\<`T`\>
