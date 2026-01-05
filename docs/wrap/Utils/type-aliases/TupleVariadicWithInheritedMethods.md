[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / TupleVariadicWithInheritedMethods

# Type Alias: TupleVariadicWithInheritedMethods\<RV\>

```ts
type TupleVariadicWithInheritedMethods<RV> = RV extends unknown ? [RV, keyType | Function, ...any[]] & ContainerMethods<RV> : never;
```

Defined in: [wrap/Utils.ts:78](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/wrap/Utils.ts#L78)

## Type Parameters

### RV

`RV`
