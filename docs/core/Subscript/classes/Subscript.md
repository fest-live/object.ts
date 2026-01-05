[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Subscript](../README.md) / Subscript

# Class: Subscript

Defined in: [core/Subscript.ts:46](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Subscript.ts#L46)

## Constructors

### Constructor

```ts
new Subscript(): Subscript;
```

Defined in: [core/Subscript.ts:77](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Subscript.ts#L77)

#### Returns

`Subscript`

## Properties

### compatible

```ts
compatible: any;
```

Defined in: [core/Subscript.ts:47](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Subscript.ts#L47)

## Accessors

### iterator

#### Get Signature

```ts
get iterator(): any;
```

Defined in: [core/Subscript.ts:165](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Subscript.ts#L165)

##### Returns

`any`

## Methods

### $safeExec()

```ts
$safeExec(cb, ...args): any;
```

Defined in: [core/Subscript.ts:55](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Subscript.ts#L55)

#### Parameters

##### cb

`any`

##### args

...`any`[]

#### Returns

`any`

***

### affected()

```ts
affected(cb, prop?): 
  | () => void | () => (() => void | (() => ... | undefined)) | undefined
  | undefined;
```

Defined in: [core/Subscript.ts:122](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Subscript.ts#L122)

#### Parameters

##### cb

(`value`, `prop`) => `void`

##### prop?

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md) | `null`

#### Returns

  \| () => `void` \| () => (() =\> void \| (() =\> ... \| undefined)) \| undefined
  \| `undefined`

***

### trigger()

```ts
trigger(
   name, 
   value?, 
   oldValue?, ...
   etc?): Promise<any[]> | undefined;
```

Defined in: [core/Subscript.ts:144](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Subscript.ts#L144)

#### Parameters

##### name

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md) | `null`

##### value?

`any`

##### oldValue?

`any`

##### etc?

...`any`[]

#### Returns

`Promise`\<`any`[]\> \| `undefined`

***

### unaffected()

```ts
unaffected(cb?, prop?): 
  | void
  | () => () => void | (() => (() => void | ...) | undefined) | undefined;
```

Defined in: [core/Subscript.ts:131](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Subscript.ts#L131)

#### Parameters

##### cb?

(`value`, `prop`) => `void`

##### prop?

[`keyType`](../../../wrap/Utils/type-aliases/keyType.md) | `null`

#### Returns

  \| `void`
  \| () => () => void \| (() =\> (() =\> void \| ...) \| undefined) \| `undefined`

***

### wrap()

```ts
wrap(nw): any;
```

Defined in: [core/Subscript.ts:119](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Subscript.ts#L119)

#### Parameters

##### nw

`unknown`

#### Returns

`any`
