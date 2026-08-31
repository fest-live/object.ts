[**@fest-lib/object v0.1.21**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / TupleWithInheritedMethods

# Type Alias: TupleWithInheritedMethods\<RV\>

```ts
type TupleWithInheritedMethods<RV> = RV extends unknown ? [RV, keyType | Function] & ContainerMethods<RV> : never;
```

Defined in: wrap/Utils.ts:81

## Type Parameters

### RV

`RV`
