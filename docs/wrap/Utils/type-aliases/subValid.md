[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / subValid

# Type Alias: subValid\<Under, T, K\>

```ts
type subValid<Under, T, K> = 
  | refValid<Under, T, K>
  | TupleWithInheritedMethods<refValid<Under, T, K>>
| TupleVariadicWithInheritedMethods<refValid<Under, T, K>>;
```

Defined in: [wrap/Utils.ts:76](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/wrap/Utils.ts#L76)

## Type Parameters

### Under

`Under` = `any`

### T

`T` = `any`

### K

`K` = `any`
