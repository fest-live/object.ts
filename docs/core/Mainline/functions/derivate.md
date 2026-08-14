[**@fest-lib/object v0.1.12**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Mainline](../README.md) / derivate

# Function: derivate()

```ts
function derivate<Under, T>(
   from, 
   reactFn, 
   watch?): any;
```

Defined in: core/Mainline.ts:420

Derive a plain target object from a source by combining `safe()` cloning with `bindBy()`.

## Type Parameters

### Under

`Under` = `any`

### T

`T` = [`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<`Under`\>

## Parameters

### from

`any`

### reactFn

(`value`) => `any`

### watch?

`any`

## Returns

`any`
