[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/$Broken](../README.md) / ReactiveSet

# Class: ReactiveSet

Defined in: [core/$Broken.ts:509](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L509)

## Constructors

### Constructor

```ts
new ReactiveSet(): ReactiveSet;
```

Defined in: [core/$Broken.ts:511](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L511)

#### Returns

`ReactiveSet`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]: boolean = false;
```

Defined in: [core/$Broken.ts:510](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L510)

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args): unknown;
```

Defined in: [core/$Broken.ts:590](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L590)

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

Defined in: [core/$Broken.ts:591](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L591)

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

Defined in: [core/$Broken.ts:599](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L599)

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

Defined in: [core/$Broken.ts:514](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L514)

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

Defined in: [core/$Broken.ts:594](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L594)

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

Defined in: [core/$Broken.ts:589](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L589)

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

Defined in: [core/$Broken.ts:593](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L593)

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

Defined in: [core/$Broken.ts:592](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L592)

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

Defined in: [core/$Broken.ts:582](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/core/$Broken.ts#L582)

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`boolean`
