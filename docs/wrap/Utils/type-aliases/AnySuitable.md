[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / AnySuitable

# Type Alias: AnySuitable\<K, V\>

```ts
type AnySuitable<K, V> = 
  | Function
  | Record<K extends keyType ? K : never, V>
  | MapLike<K, V>
| SetLike<K, V extends unknown ? V : unknown>;
```

Defined in: [wrap/Utils.ts:65](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/wrap/Utils.ts#L65)

## Type Parameters

### K

`K` = `any`

### V

`V` = `any` \| `unknown`
