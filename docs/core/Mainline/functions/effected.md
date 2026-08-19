[**@fest-lib/object v0.1.16**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Mainline](../README.md) / effected

# Function: effected()

```ts
function effected(
   targets, 
   cb, 
   options?): (() => any) | undefined;
```

Defined in: core/Mainline.ts:244

Target-first alias for `effect()` when that reads better at the callsite.

## Parameters

### targets

`any`

### cb

[`EffectCallback`](../../Subscript/type-aliases/EffectCallback.md)

### options?

[`EffectConfig`](../../Subscript/type-aliases/EffectConfig.md)

## Returns

(() => `any`) \| `undefined`
