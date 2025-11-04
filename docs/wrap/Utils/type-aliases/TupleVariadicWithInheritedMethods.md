[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [wrap/Utils](../README.md) / TupleVariadicWithInheritedMethods

# Type Alias: TupleVariadicWithInheritedMethods\<RV\>

```ts
type TupleVariadicWithInheritedMethods<RV> = RV extends unknown ? [RV, keyType | Function, ...any[]] & ContainerMethods<RV> : never;
```

Defined in: [wrap/Utils.ts:72](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/Utils.ts#L72)

## Type Parameters

### RV

`RV`
