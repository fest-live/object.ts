[**@fest-lib/object v0.1.23**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/Utils](../README.md) / observeSpecificKeys

# Type Alias: observeSpecificKeys\<T\>

```ts
type observeSpecificKeys<T> = T & { [K in keyof T]: T[K] extends AnySuitable<keyType, any> ? Ui<T[K], keyType, any> : T[K] }[keyof T & keyType];
```

Defined in: wrap/Utils.ts:65

## Type Parameters

### T

`T` *extends* `Record`\<[`keyType`](keyType.md), `any`\> = `any`
