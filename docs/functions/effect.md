[**@fest-lib/object API Documentation v0.1.1**](../README.md)

***

[@fest-lib/object API Documentation](../globals.md) / effect

# Function: effect()

> **effect**(`cb`, `targets?`, `options?`): (() => `void`) \| `undefined`

Defined in: core/Mainline.ts:219

Subscribe to one or many reactive triggers and receive a structured event.

Unlike `affected()`, `effect()` is callback-first and reports the source that
registered or emitted the event. It does not emit initial events by default.

## Parameters

### cb

[`EffectCallback`](../type-aliases/EffectCallback.md)

### targets?

`any`

### options?

[`EffectConfig`](../type-aliases/EffectConfig.md)

## Returns

(() => `void`) \| `undefined`
