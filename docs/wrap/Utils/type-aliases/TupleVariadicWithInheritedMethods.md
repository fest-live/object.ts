[**@fest-lib/object v0.1.24**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / TupleVariadicWithInheritedMethods

# Type Alias: TupleVariadicWithInheritedMethods\<RV\>

```ts
type TupleVariadicWithInheritedMethods<RV> = RV extends unknown ? [RV, keyType | Function, ...any[]] & ContainerMethods<RV> : never;
```

Defined in: wrap/Utils.ts:85

## Type Parameters

### RV

`RV`
