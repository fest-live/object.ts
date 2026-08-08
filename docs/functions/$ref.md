[**@fest-lib/object API Documentation v0.1.4**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / $ref

# Function: $ref()

> **$ref**\<`T`\>(`typed`, `behavior?`): `T` *extends* `symbol` \| `object` \| `Function` ? [`observeValid`](../type-aliases/observeValid.md)\<`T`\> \| [`refType`](../type-aliases/refType.md)\<`T`\> : [`refType`](../type-aliases/refType.md)\<`T`\>

Defined in: core/Primitives.ts:228

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

`T` *extends* `symbol` \| `object` \| `Function` ? [`observeValid`](../type-aliases/observeValid.md)\<`T`\> \| [`refType`](../type-aliases/refType.md)\<`T`\> : [`refType`](../type-aliases/refType.md)\<`T`\>
