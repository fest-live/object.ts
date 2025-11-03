[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [core/Specific](../README.md) / ReactiveSet

# Class: ReactiveSet

Defined in: core/Specific.ts:481

## Constructors

### Constructor

```ts
new ReactiveSet(): ReactiveSet;
```

Defined in: core/Specific.ts:483

#### Returns

`ReactiveSet`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]: boolean = false;
```

Defined in: core/Specific.ts:482

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args): unknown;
```

Defined in: core/Specific.ts:546

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

Defined in: core/Specific.ts:547

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

Defined in: core/Specific.ts:555

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

Defined in: core/Specific.ts:486

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

Defined in: core/Specific.ts:550

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

Defined in: core/Specific.ts:545

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

Defined in: core/Specific.ts:549

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

Defined in: core/Specific.ts:548

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

Defined in: core/Specific.ts:538

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`boolean`
