[**@fest-lib/object v0.1.30**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / refType

# Type Alias: refType\<T\>

```ts
type refType<T> = 
  | refWrap<T>
  | T extends object ? T : any & MethodsOf<T> & T extends symbol | object | Function ? T : any;
```

Defined in: core/Primitives.ts:28

## Type Parameters

### T

`T` = `any`
