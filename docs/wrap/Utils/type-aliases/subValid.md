[**@fest-lib/object v0.1.34**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / subValid

# Type Alias: subValid\<T\>

```ts
type subValid<T> = 
  | observeValid<T>
  | TupleWithInheritedMethods<observeValid<T>>
| TupleVariadicWithInheritedMethods<observeValid<T>>;
```

Defined in: wrap/Utils.ts:89

## Type Parameters

### T

`T` = `any`
