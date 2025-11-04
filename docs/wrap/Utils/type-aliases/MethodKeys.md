[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [wrap/Utils](../README.md) / MethodKeys

# Type Alias: MethodKeys\<T\>

```ts
type MethodKeys<T> = { [K in keyof T]-?: T[K] extends AnyFn ? K : never }[keyof T];
```

Defined in: [wrap/Utils.ts:38](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/Utils.ts#L38)

## Type Parameters

### T

`T`
