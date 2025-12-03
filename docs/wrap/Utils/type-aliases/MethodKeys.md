[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / MethodKeys

# Type Alias: MethodKeys\<T\>

```ts
type MethodKeys<T> = { [K in keyof T]-?: T[K] extends AnyFn ? K : never }[keyof T];
```

Defined in: [wrap/Utils.ts:38](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/wrap/Utils.ts#L38)

## Type Parameters

### T

`T`
