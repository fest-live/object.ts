[**@fest-lib/object API Documentation v0.1.1**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / addToCallChain

# Function: addToCallChain()

> **addToCallChain**(`obj`, `methodKey`, `callback?`): `void`

Defined in: wrap/Utils.ts:145

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
