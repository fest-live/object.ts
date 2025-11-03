[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [wrap/Utils](../README.md) / subValid

# Type Alias: subValid\<Under, T, K\>

```ts
type subValid<Under, T, K> = 
  | refValid<Under, T, K>
  | TupleWithInheritedMethods<refValid<Under, T, K>>
| TupleVariadicWithInheritedMethods<refValid<Under, T, K>>;
```

Defined in: wrap/Utils.ts:76

## Type Parameters

### Under

`Under` = `any`

### T

`T` = `any`

### K

`K` = `any`
