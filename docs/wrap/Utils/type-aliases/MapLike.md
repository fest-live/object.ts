[**@fest-lib/object v0.1.30**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / MapLike

# Type Alias: MapLike\<K, V\>

```ts
type MapLike<K, V> = 
  | Map<K, V>
  | WeakMap<K extends WeakKey ? K : never, V>
| Record<K extends keyType ? K : never, V>;
```

Defined in: wrap/Utils.ts:70

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`
