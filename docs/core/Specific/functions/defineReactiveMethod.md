[**@fest-lib/object v0.1.48**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / defineReactiveMethod

# Function: defineReactiveMethod()

```ts
function defineReactiveMethod<T>(
   target, 
   key, 
   adapter
): boolean;
```

Defined in: core/Specific.ts:210

Replaces a method with an instance-level wrapper that snapshots state
and lets a collection-specific adapter emit normalized events.

## Type Parameters

### T

`T` *extends* `object`

## Parameters

### target

`T`

### key

`PropertyKey`

### adapter

`ReactiveMethodAdapter`\<`T`\>

## Returns

`boolean`
