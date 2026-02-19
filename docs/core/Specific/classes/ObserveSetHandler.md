[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ObserveSetHandler

# Class: ObserveSetHandler\<T\>

Defined in: [core/Specific.ts:618](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L618)

## Type Parameters

### T

`T` = `any`

## Constructors

### Constructor

```ts
new ObserveSetHandler<T>(): ObserveSetHandler<T>;
```

Defined in: [core/Specific.ts:620](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L620)

#### Returns

`ObserveSetHandler`\<`T`\>

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]: boolean = false;
```

Defined in: [core/Specific.ts:619](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L619)

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args): unknown;
```

Defined in: [core/Specific.ts:683](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L683)

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

Defined in: [core/Specific.ts:684](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L684)

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

Defined in: [core/Specific.ts:704](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L704)

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

Defined in: [core/Specific.ts:623](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L623)

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

Defined in: [core/Specific.ts:689](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L689)

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

Defined in: [core/Specific.ts:682](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L682)

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

Defined in: [core/Specific.ts:686](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L686)

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

Defined in: [core/Specific.ts:685](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L685)

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

Defined in: [core/Specific.ts:675](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Specific.ts#L675)

#### Parameters

##### target

`any`

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`boolean`
