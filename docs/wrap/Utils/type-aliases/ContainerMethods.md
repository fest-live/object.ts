[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / ContainerMethods

# Type Alias: ContainerMethods\<X\>

```ts
type ContainerMethods<X> = X extends any[] | any[] ? MethodsOf<any[]> : X extends Map<keyType, any> ? MethodsOf<Map<keyType, any>> : X extends Set<any> ? MethodsOf<Set<any>> : X extends WeakMap<WeakKey, any> ? MethodsOf<WeakMap<WeakKey, any>> : X extends WeakSet<WeakKey> ? MethodsOf<WeakSet<WeakKey>> : X extends Function ? MethodsOf<Function> : object;
```

Defined in: [wrap/Utils.ts:48](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/wrap/Utils.ts#L48)

## Type Parameters

### X

`X`
