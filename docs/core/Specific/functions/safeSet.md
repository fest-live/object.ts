[**@fest-lib/object v0.1.24**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / safeSet

# Function: safeSet()

```ts
function safeSet<T>(
   obj, 
   key, 
   value): boolean;
```

Defined in: core/Specific.ts:82

Safe setter with re-entrancy protection to avoid recursive accessor loops.

## Type Parameters

### T

`T` = `any`

## Parameters

### obj

`any`

### key

`any`

### value

`T`

## Returns

`boolean`
