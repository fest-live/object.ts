[**@fest-lib/object v0.1.21**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / ContainerMethods

# Type Alias: ContainerMethods\<X\>

```ts
type ContainerMethods<X> = X extends any[] | any[] ? MethodsOf<any[]> : X extends Map<keyType, any> ? MethodsOf<Map<keyType, any>> : X extends Set<any> ? MethodsOf<Set<any>> : X extends WeakMap<WeakKey, any> ? MethodsOf<WeakMap<WeakKey, any>> : X extends WeakSet<WeakKey> ? MethodsOf<WeakSet<WeakKey>> : X extends Function ? MethodsOf<Function> : object;
```

Defined in: wrap/Utils.ts:55

## Type Parameters

### X

`X`
