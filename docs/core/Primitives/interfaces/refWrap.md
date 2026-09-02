[**@fest-lib/object v0.1.28**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / refWrap

# Interface: refWrap\<T\>

Defined in: core/Primitives.ts:15

## Type Parameters

### T

`T` = `any`

## Properties

### \[$behavior\]?

```ts
optional [$behavior]?: any;
```

Defined in: core/Primitives.ts:17

***

### \[$promise\]?

```ts
optional [$promise]?: Promise<T> | null;
```

Defined in: core/Primitives.ts:16

***

### \[$realProp\]?

```ts
optional [$realProp]?: keyType | null;
```

Defined in: core/Primitives.ts:18

***

### \[$value\]?

```ts
optional [$value]?: T;
```

Defined in: core/Primitives.ts:22

***

### realProp?

```ts
optional realProp?: keyType | null;
```

Defined in: core/Primitives.ts:19

## Accessors

### value

#### Get Signature

```ts
get value(): T | null | undefined;
```

Defined in: core/Primitives.ts:24

##### Returns

`T` \| `null` \| `undefined`

#### Set Signature

```ts
set value(v): void;
```

Defined in: core/Primitives.ts:23

##### Parameters

###### v

`T` \| `null` \| `undefined`

##### Returns

`void`

## Methods

### \[toPrimitive\]()?

```ts
optional toPrimitive: any;
```

Defined in: core/Primitives.ts:21

#### Parameters

##### hint

`any`

#### Returns

`any`

***

### \[toStringTag\]()?

```ts
optional toStringTag: string;
```

Defined in: core/Primitives.ts:20

#### Returns

`string`
