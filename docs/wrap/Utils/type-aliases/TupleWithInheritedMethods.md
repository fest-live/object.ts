[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [wrap/Utils](../README.md) / TupleWithInheritedMethods

# Type Alias: TupleWithInheritedMethods\<RV\>

```ts
type TupleWithInheritedMethods<RV> = RV extends unknown ? [RV, keyType | Function] & ContainerMethods<RV> : never;
```

Defined in: wrap/Utils.ts:68

## Type Parameters

### RV

`RV`
