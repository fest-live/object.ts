[**@fest-lib/object v0.1.14**](../../../README.md)

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

Defined in: wrap/Utils.ts:72

## Type Parameters

### K

`K` = `any`

### V

`V` = `any` \| `unknown`
