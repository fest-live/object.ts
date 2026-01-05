[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / MethodKeys

# Type Alias: MethodKeys\<T\>

```ts
type MethodKeys<T> = { [K in keyof T]-?: T[K] extends AnyFn ? K : never }[keyof T];
```

Defined in: [wrap/Utils.ts:38](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/wrap/Utils.ts#L38)

## Type Parameters

### T

`T`
