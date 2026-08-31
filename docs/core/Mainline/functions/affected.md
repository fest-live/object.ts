[**@fest-lib/object v0.1.21**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Mainline](../README.md) / affected

# Function: affected()

```ts
function affected<Under>(
   obj, 
   prop, 
   cb?, 
   options?): Function | undefined;
```

Defined in: core/Mainline.ts:165

`function` (not `const`) so circular imports from Assigned/Primitives cannot hit TDZ during bundle init.

## Type Parameters

### Under

`Under` = `any`

## Parameters

### obj

`any`

### prop

  \| [`keyType`](../../../wrap/Utils/type-aliases/keyType.md)
  \| [`AffectedCallback`](../../Subscript/type-aliases/AffectedCallback.md)
  \| `null`

### cb?

  \| [`AffectedCallback`](../../Subscript/type-aliases/AffectedCallback.md)
  \| [`AffectedConfig`](../../Subscript/type-aliases/AffectedConfig.md)

### options?

[`AffectedConfig`](../../Subscript/type-aliases/AffectedConfig.md)

## Returns

`Function` \| `undefined`
