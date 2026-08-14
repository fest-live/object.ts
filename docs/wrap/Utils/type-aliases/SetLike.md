[**@fest-lib/object v0.1.14**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / SetLike

# Type Alias: SetLike\<V, _\>

```ts
type SetLike<V, _> = 
  | Set<V>
  | WeakSet<V extends WeakKey ? V : never>
  | V[];
```

Defined in: wrap/Utils.ts:71

## Type Parameters

### V

`V` = `any`

### _

`_` = `unknown`
