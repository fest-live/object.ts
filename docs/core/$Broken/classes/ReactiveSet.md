[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [core/$Broken](../README.md) / ReactiveSet

# Class: ReactiveSet

Defined in: core/$Broken.ts:509

## Constructors

### Constructor

```ts
new ReactiveSet(): ReactiveSet;
```

Defined in: core/$Broken.ts:511

#### Returns

`ReactiveSet`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]: boolean = false;
```

Defined in: core/$Broken.ts:510

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args): unknown;
```

Defined in: core/$Broken.ts:590

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

Defined in: core/$Broken.ts:591

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

Defined in: core/$Broken.ts:599

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

Defined in: core/$Broken.ts:514

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

Defined in: core/$Broken.ts:594

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

Defined in: core/$Broken.ts:589

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

Defined in: core/$Broken.ts:593

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

Defined in: core/$Broken.ts:592

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
   value): boolean;
```

Defined in: core/$Broken.ts:582

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`boolean`
