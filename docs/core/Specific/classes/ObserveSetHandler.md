[**@fest-lib/object v0.1.48**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ObserveSetHandler

# Class: ObserveSetHandler\<T\>

Defined in: core/Specific.ts:1162

Proxy handler for observable sets, emitting membership changes as reactive events.

## Type Parameters

### T

`T` = `any`

## Constructors

### Constructor

```ts
new ObserveSetHandler<T>(): ObserveSetHandler<T>;
```

Defined in: core/Specific.ts:1164

#### Returns

`ObserveSetHandler`\<`T`\>

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]?: boolean = false;
```

Defined in: core/Specific.ts:1163

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args
): unknown;
```

Defined in: core/Specific.ts:1237

#### Parameters

##### target

`any`

##### ctx

`any`

##### args

`any`

#### Returns

`unknown`

***

### construct()

```ts
construct(
   target, 
   args, 
   newT
): unknown;
```

Defined in: core/Specific.ts:1238

#### Parameters

##### target

`any`

##### args

`any`

##### newT

`any`

#### Returns

`unknown`

***

### deleteProperty()

```ts
deleteProperty(target, name): boolean;
```

Defined in: core/Specific.ts:1258

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

#### Returns

`boolean`

***

### get()

```ts
get(
   target, 
   name, 
   ctx
): any;
```

Defined in: core/Specific.ts:1167

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### ctx

`any`

#### Returns

`any`

***

### getOwnPropertyDescriptor()

```ts
getOwnPropertyDescriptor(target, key): TypedPropertyDescriptor<any> | undefined;
```

Defined in: core/Specific.ts:1243

#### Parameters

##### target

`any`

##### key

`any`

#### Returns

`TypedPropertyDescriptor`\<`any`\> \| `undefined`

***

### has()

```ts
has(target, prop): boolean;
```

Defined in: core/Specific.ts:1236

#### Parameters

##### target

`any`

##### prop

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

#### Returns

`boolean`

***

### isExtensible()

```ts
isExtensible(target): boolean;
```

Defined in: core/Specific.ts:1240

#### Parameters

##### target

`any`

#### Returns

`boolean`

***

### ownKeys()

```ts
ownKeys(target): (string | symbol)[];
```

Defined in: core/Specific.ts:1239

#### Parameters

##### target

`any`

#### Returns

(`string` \| `symbol`)[]

***

### set()

```ts
set(
   target, 
   name, 
   value
): boolean;
```

Defined in: core/Specific.ts:1229

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`boolean`
