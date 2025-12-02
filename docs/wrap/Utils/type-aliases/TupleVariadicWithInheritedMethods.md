[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / TupleVariadicWithInheritedMethods

# Type Alias: TupleVariadicWithInheritedMethods\<RV\>

```ts
type TupleVariadicWithInheritedMethods<RV> = RV extends unknown ? [RV, keyType | Function, ...any[]] & ContainerMethods<RV> : never;
```

Defined in: [wrap/Utils.ts:72](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/wrap/Utils.ts#L72)

## Type Parameters

### RV

`RV`
