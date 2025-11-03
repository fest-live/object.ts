[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [core/$Broken](../README.md) / ReactiveObject

# Class: ReactiveObject

Defined in: core/$Broken.ts:306

## Constructors

### Constructor

```ts
new ReactiveObject(): ReactiveObject;
```

Defined in: core/$Broken.ts:308

#### Returns

`ReactiveObject`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]: boolean;
```

Defined in: core/$Broken.ts:307

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args): unknown;
```

Defined in: core/$Broken.ts:349

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
   newT): unknown;
```

Defined in: core/$Broken.ts:351

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

Defined in: core/$Broken.ts:385

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
   ctx): any;
```

Defined in: core/$Broken.ts:311

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
getOwnPropertyDescriptor(target, key): undefined | TypedPropertyDescriptor<any>;
```

Defined in: core/$Broken.ts:355

#### Parameters

##### target

`any`

##### key

`any`

#### Returns

`undefined` \| `TypedPropertyDescriptor`\<`any`\>

***

### has()

```ts
has(target, prop): boolean;
```

Defined in: core/$Broken.ts:360

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

Defined in: core/$Broken.ts:352

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

Defined in: core/$Broken.ts:350

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
   value): any;
```

Defined in: core/$Broken.ts:361

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`any`
