[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / TupleVariadicWithInheritedMethods

# Type Alias: TupleVariadicWithInheritedMethods\<RV\>

```ts
type TupleVariadicWithInheritedMethods<RV> = RV extends unknown ? [RV, keyType | Function, ...any[]] & ContainerMethods<RV> : never;
```

Defined in: [wrap/Utils.ts:72](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/wrap/Utils.ts#L72)

## Type Parameters

### RV

`RV`
