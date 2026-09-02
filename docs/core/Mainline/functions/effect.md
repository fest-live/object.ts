[**@fest-lib/object v0.1.26**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Mainline](../README.md) / effect

# Function: effect()

```ts
function effect(
   cb, 
   targets?, 
   options?): (() => any) | undefined;
```

Defined in: core/Mainline.ts:219

Subscribe to one or many reactive triggers and receive a structured event.

Unlike `affected()`, `effect()` is callback-first and reports the source that
registered or emitted the event. It does not emit initial events by default.

## Parameters

### cb

[`EffectCallback`](../../Subscript/type-aliases/EffectCallback.md)

### targets?

`any`

### options?

[`EffectConfig`](../../Subscript/type-aliases/EffectConfig.md)

## Returns

(() => `any`) \| `undefined`
