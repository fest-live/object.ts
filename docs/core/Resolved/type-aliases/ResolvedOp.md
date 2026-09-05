[**@fest-lib/object v0.1.34**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Resolved](../README.md) / ResolvedOp

# Type Alias: ResolvedOp

```ts
type ResolvedOp = (mode?) => Promise<any> & object;
```

Defined in: core/Resolved.ts:10

## Type Declaration

### all()

```ts
all(): Promise<any>;
```

#### Returns

`Promise`\<`any`\>

### allKeyed()

```ts
allKeyed(): Promise<any>;
```

#### Returns

`Promise`\<`any`\>

### allSettled()

```ts
allSettled(): Promise<any>;
```

#### Returns

`Promise`\<`any`\>

### allSettledKeyed()

```ts
allSettledKeyed(): Promise<any>;
```

#### Returns

`Promise`\<`any`\>

### try()

```ts
try(callbackOrValue, ...args): Promise<any>;
```

#### Parameters

##### callbackOrValue

`any`

##### args

...`any`[]

#### Returns

`Promise`\<`any`\>
