[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ReactiveMap

# Class: ReactiveMap

Defined in: [core/Specific.ts:497](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L497)

## Constructors

### Constructor

```ts
new ReactiveMap(): ReactiveMap;
```

Defined in: [core/Specific.ts:498](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L498)

#### Returns

`ReactiveMap`

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args): unknown;
```

Defined in: [core/Specific.ts:563](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L563)

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

Defined in: [core/Specific.ts:564](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L564)

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

Defined in: [core/Specific.ts:584](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L584)

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

Defined in: [core/Specific.ts:501](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L501)

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

Defined in: [core/Specific.ts:569](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L569)

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

Defined in: [core/Specific.ts:562](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L562)

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

Defined in: [core/Specific.ts:566](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L566)

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

Defined in: [core/Specific.ts:565](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L565)

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

Defined in: [core/Specific.ts:555](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Specific.ts#L555)

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`boolean`
