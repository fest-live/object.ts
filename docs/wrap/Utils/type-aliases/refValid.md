[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / refValid

# Type Alias: refValid\<Under, T, K\>

```ts
type refValid<Under, T, K> = 
  | T & MethodsOf<T>
  | Under[] & MethodsOf<Under[]>
  | Map<K, Under> & MethodsOf<Map<K, Under>>
  | Set<Under> & MethodsOf<Set<Under>>
  | WeakMap<K extends WeakKey ? K : never, Under> & MethodsOf<WeakMap<K extends WeakKey ? K : never, Under>>
  | WeakSet<Under extends WeakKey ? Under : never> & MethodsOf<WeakSet<Under extends WeakKey ? Under : never>>
| Function & MethodsOf<Function>;
```

Defined in: [wrap/Utils.ts:58](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/wrap/Utils.ts#L58)

## Type Parameters

### Under

`Under` = `any`

### T

`T` = `any`

### K

`K` = `any`
