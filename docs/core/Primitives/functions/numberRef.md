[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / numberRef

# Function: numberRef()

```ts
function numberRef(initial?, behavior?): observeValid<{
  [$behavior]: any;
  [$promise]: any;
  [$value]: number;
  get value(): any;
  [toPrimitive]: any;
  [toStringTag]: string;
}>;
```

Defined in: [core/Primitives.ts:8](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Primitives.ts#L8)

## Parameters

### initial?

`any`

### behavior?

`any`

## Returns

[`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<\{
  `[$behavior]`: `any`;
  `[$promise]`: `any`;
  `[$value]`: `number`;
  get `value`(): `any`;
  `[toPrimitive]`: `any`;
  `[toStringTag]`: `string`;
\}\>
