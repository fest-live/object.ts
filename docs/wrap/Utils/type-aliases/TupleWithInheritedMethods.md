[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / TupleWithInheritedMethods

# Type Alias: TupleWithInheritedMethods\<RV\>

```ts
type TupleWithInheritedMethods<RV> = RV extends unknown ? [RV, keyType | Function] & ContainerMethods<RV> : never;
```

Defined in: [wrap/Utils.ts:68](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/wrap/Utils.ts#L68)

## Type Parameters

### RV

`RV`
