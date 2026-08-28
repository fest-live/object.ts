[**@fest-lib/object v0.1.19**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / refType

# Type Alias: refType\<T\>

```ts
type refType<T> = 
  | refWrap<T>
  | T extends object ? T : any & MethodsOf<T> & T extends symbol | object | Function ? T : any;
```

Defined in: core/Primitives.ts:29

## Type Parameters

### T

`T` = `any`
