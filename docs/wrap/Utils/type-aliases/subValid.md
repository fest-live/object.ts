[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / subValid

# Type Alias: subValid\<T\>

```ts
type subValid<T> = 
  | observeValid<T>
  | TupleWithInheritedMethods<observeValid<T>>
| TupleVariadicWithInheritedMethods<observeValid<T>>;
```

Defined in: [wrap/Utils.ts:82](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/wrap/Utils.ts#L82)

## Type Parameters

### T

`T` = `any`
