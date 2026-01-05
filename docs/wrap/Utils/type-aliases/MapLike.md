[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / MapLike

# Type Alias: MapLike\<K, V\>

```ts
type MapLike<K, V> = 
  | Map<K, V>
  | WeakMap<K extends WeakKey ? K : never, V>
| Record<K extends keyType ? K : never, V>;
```

Defined in: [wrap/Utils.ts:63](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/wrap/Utils.ts#L63)

## Type Parameters

### K

`K` = `any`

### V

`V` = `any`
