[**@fest-lib/object v0.1.17**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Primitives](../README.md) / refWrap

# Interface: refWrap\<T\>

Defined in: core/Primitives.ts:16

## Type Parameters

### T

`T` = `any`

## Properties

### \[$behavior\]?

```ts
optional [$behavior]?: any;
```

Defined in: core/Primitives.ts:18

***

### \[$promise\]?

```ts
optional [$promise]?: Promise<T> | null;
```

Defined in: core/Primitives.ts:17

***

### \[$realProp\]?

```ts
optional [$realProp]?: keyType | null;
```

Defined in: core/Primitives.ts:19

***

### \[$value\]?

```ts
optional [$value]?: T;
```

Defined in: core/Primitives.ts:23

***

### realProp?

```ts
optional realProp?: keyType | null;
```

Defined in: core/Primitives.ts:20

## Accessors

### value

#### Get Signature

```ts
get value(): T | null | undefined;
```

Defined in: core/Primitives.ts:25

##### Returns

`T` \| `null` \| `undefined`

#### Set Signature

```ts
set value(v): void;
```

Defined in: core/Primitives.ts:24

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

Defined in: core/Primitives.ts:22

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

Defined in: core/Primitives.ts:21

#### Returns

`string`
