[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/AssignObject](../README.md) / AssignObjectHandler

# Class: AssignObjectHandler

Defined in: [wrap/AssignObject.ts:6](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/AssignObject.ts#L6)

## Constructors

### Constructor

```ts
new AssignObjectHandler(): AssignObjectHandler;
```

Defined in: [wrap/AssignObject.ts:7](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/AssignObject.ts#L7)

#### Returns

`AssignObjectHandler`

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args): unknown;
```

Defined in: [wrap/AssignObject.ts:10](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/AssignObject.ts#L10)

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

Defined in: [wrap/AssignObject.ts:9](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/AssignObject.ts#L9)

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

Defined in: [wrap/AssignObject.ts:8](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/AssignObject.ts#L8)

#### Parameters

##### target

`any`

##### name

[`keyType`](../../Utils/type-aliases/keyType.md)

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

Defined in: [wrap/AssignObject.ts:13](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/AssignObject.ts#L13)

#### Parameters

##### target

`any`

##### name

[`keyType`](../../Utils/type-aliases/keyType.md)

##### ctx

`any`

#### Returns

`any`

***

### has()

```ts
has(target, prop): boolean;
```

Defined in: [wrap/AssignObject.ts:11](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/AssignObject.ts#L11)

#### Parameters

##### target

`any`

##### prop

[`keyType`](../../Utils/type-aliases/keyType.md)

#### Returns

`boolean`

***

### set()

```ts
set(
   target, 
   name, 
   value): boolean;
```

Defined in: [wrap/AssignObject.ts:12](https://github.com/fest-live/object.ts/blob/286e8fe84b447878d1612b2d3b1a1882e45303e4/src/wrap/AssignObject.ts#L12)

#### Parameters

##### target

`any`

##### name

[`keyType`](../../Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`boolean`
