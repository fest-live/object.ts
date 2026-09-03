[**@fest-lib/object v0.1.29**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / delayedOrInstantBehavior

# Function: delayedOrInstantBehavior()

```ts
function delayedOrInstantBehavior(delay?): (cb, __namedParameters, __namedParameters) => void;
```

Defined in: core/Primitives.ts:298

Same as `delayedBehavior`, but invoke immediately when the delay gate is not needed.

## Parameters

### delay?

`number` = `100`

## Returns

(`cb`, `__namedParameters`, `__namedParameters`) => `void`
