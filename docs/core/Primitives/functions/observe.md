[**@fest-lib/object v0.1.32**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / observe

# Function: observe()

```ts
function observe<T>(target, stateName?): observeValid<T>;
```

Defined in: core/Primitives.ts:305

`function` (not `const`) so circular Mainline ↔ Primitives/Assigned init cannot TDZ in bundled output.

## Type Parameters

### T

`T` = `any`

## Parameters

### target

`T`

### stateName?

`string`

## Returns

[`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<`T`\>
