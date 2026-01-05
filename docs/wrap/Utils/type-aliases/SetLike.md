[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / SetLike

# Type Alias: SetLike\<V, _\>

```ts
type SetLike<V, _> = 
  | Set<V>
  | WeakSet<V extends WeakKey ? V : never>
  | V[];
```

Defined in: [wrap/Utils.ts:64](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/wrap/Utils.ts#L64)

## Type Parameters

### V

`V` = `any`

### _

`_` = `unknown`
