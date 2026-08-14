[**@fest-lib/object v0.1.15**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Mainline](../README.md) / iterated

# Function: iterated()

```ts
function iterated<T>(
   tg, 
   cb, 
   options?): any;
```

Defined in: core/Mainline.ts:357

Subscribe to iteration-level changes for arrays, sets, maps, and ref-like
containers whose `value` should itself be treated as a collection.

## Type Parameters

### T

`T` = `any`

## Parameters

### tg

[`subValid`](../../../wrap/Utils/type-aliases/subValid.md)\<`T`\>

### cb

[`AffectedCallback`](../../Subscript/type-aliases/AffectedCallback.md)

### options?

[`AffectedConfig`](../../Subscript/type-aliases/AffectedConfig.md) = `...`

## Returns

`any`
