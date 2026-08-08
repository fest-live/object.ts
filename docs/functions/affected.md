[**@fest-lib/object API Documentation v0.1.4**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / affected

# Function: affected()

> **affected**\<`Under`\>(`obj`, `prop`, `cb?`, `options?`): `Function` \| `undefined`

Defined in: core/Mainline.ts:165

`function` (not `const`) so circular imports from Assigned/Primitives cannot hit TDZ during bundle init.

## Type Parameters

### Under

`Under` = `any`

## Parameters

### obj

`any`

### prop

`keyType` \| [`AffectedCallback`](../type-aliases/AffectedCallback.md) \| `null`

### cb?

[`AffectedCallback`](../type-aliases/AffectedCallback.md) \| [`AffectedConfig`](../type-aliases/AffectedConfig.md)

### options?

[`AffectedConfig`](../type-aliases/AffectedConfig.md)

## Returns

`Function` \| `undefined`
