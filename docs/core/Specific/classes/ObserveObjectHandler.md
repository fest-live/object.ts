[**@fest-lib/object v0.1.47**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ObserveObjectHandler

# Class: ObserveObjectHandler\<T\>

Defined in: core/Specific.ts:662

Proxy handler for observable objects and ref-like `{ value }` containers.

## Type Parameters

### T

`T` = `any`

## Constructors

### Constructor

```ts
new ObserveObjectHandler<T>(): ObserveObjectHandler<T>;
```

Defined in: core/Specific.ts:664

#### Returns

`ObserveObjectHandler`\<`T`\>

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]?: boolean;
```

Defined in: core/Specific.ts:663

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args
): unknown;
```

Defined in: core/Specific.ts:760

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

Defined in: core/Specific.ts:762

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

### defineProperty()

```ts
defineProperty(
   target, 
   name, 
   descriptor
): any;
```

Defined in: core/Specific.ts:831

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### descriptor

`PropertyDescriptor`

#### Returns

`any`

***

### deleteProperty()

```ts
deleteProperty(target, name): boolean;
```

Defined in: core/Specific.ts:874

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

Defined in: core/Specific.ts:667

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

Defined in: core/Specific.ts:766

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

Defined in: core/Specific.ts:781

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

Defined in: core/Specific.ts:763

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

Defined in: core/Specific.ts:761

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
): any;
```

Defined in: core/Specific.ts:782

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`any`
