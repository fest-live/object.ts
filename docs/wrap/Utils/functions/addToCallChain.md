[**@fest-lib/object v0.1.28**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / addToCallChain

# Function: addToCallChain()

```ts
function addToCallChain(
   obj, 
   methodKey, 
   callback?): void;
```

Defined in: wrap/Utils.ts:147

Append a callback to an object's disposal/call chain.

AI-READ: `Symbol.dispose` is treated specially and kept in a side registry so
multiple callbacks can be composed without overwriting each other.

## Parameters

### obj

`any`

### methodKey

`any`

### callback?

`any`

## Returns

`void`
