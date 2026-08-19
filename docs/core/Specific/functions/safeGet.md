[**@fest-lib/object v0.1.16**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / safeGet

# Function: safeGet()

```ts
function safeGet<T>(
   obj, 
   key, 
   rec?): T | null | undefined;
```

Defined in: core/Specific.ts:93

Safe getter with re-entrancy protection to avoid recursive accessor loops.

## Type Parameters

### T

`T` = `any`

## Parameters

### obj

`any`

### key

`any`

### rec?

`any`

## Returns

`T` \| `null` \| `undefined`
