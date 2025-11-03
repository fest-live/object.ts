[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [wrap/Utils](../README.md) / MethodKeys

# Type Alias: MethodKeys\<T\>

```ts
type MethodKeys<T> = { [K in keyof T]-?: T[K] extends AnyFn ? K : never }[keyof T];
```

Defined in: wrap/Utils.ts:38

## Type Parameters

### T

`T`
