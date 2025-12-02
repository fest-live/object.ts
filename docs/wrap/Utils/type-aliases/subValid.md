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

Defined in: [wrap/Utils.ts:76](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/Utils.ts#L76)

## Type Parameters

### Under

`Under` = `any`

### T

`T` = `any`

### K

`K` = `any`
