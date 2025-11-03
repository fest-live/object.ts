[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [wrap/Utils](../README.md) / ContainerMethods

# Type Alias: ContainerMethods\<X\>

```ts
type ContainerMethods<X> = X extends any[] | any[] ? MethodsOf<any[]> : X extends Map<keyType, any> ? MethodsOf<Map<keyType, any>> : X extends Set<any> ? MethodsOf<Set<any>> : X extends WeakMap<WeakKey, any> ? MethodsOf<WeakMap<WeakKey, any>> : X extends WeakSet<WeakKey> ? MethodsOf<WeakSet<WeakKey>> : X extends Function ? MethodsOf<Function> : object;
```

Defined in: wrap/Utils.ts:48

## Type Parameters

### X

`X`
