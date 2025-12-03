[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ReactiveObject

# Class: ReactiveObject

Defined in: [core/Specific.ts:352](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L352)

## Constructors

### Constructor

```ts
new ReactiveObject(): ReactiveObject;
```

Defined in: [core/Specific.ts:354](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L354)

#### Returns

`ReactiveObject`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]: boolean;
```

Defined in: [core/Specific.ts:353](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L353)

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args): unknown;
```

Defined in: [core/Specific.ts:436](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L436)

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

Defined in: [core/Specific.ts:438](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L438)

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

Defined in: [core/Specific.ts:480](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L480)

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

Defined in: [core/Specific.ts:357](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L357)

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

Defined in: [core/Specific.ts:442](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L442)

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

Defined in: [core/Specific.ts:457](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L457)

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

Defined in: [core/Specific.ts:439](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L439)

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

Defined in: [core/Specific.ts:437](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L437)

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

Defined in: [core/Specific.ts:458](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L458)

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`any`
