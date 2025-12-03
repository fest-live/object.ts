[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Subscript](../README.md) / Subscript

# Class: Subscript

Defined in: [core/Subscript.ts:46](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Subscript.ts#L46)

## Constructors

### Constructor

```ts
new Subscript(): Subscript;
```

Defined in: [core/Subscript.ts:77](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Subscript.ts#L77)

#### Returns

`Subscript`

## Properties

### compatible

```ts
compatible: any;
```

Defined in: [core/Subscript.ts:47](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Subscript.ts#L47)

## Accessors

### iterator

#### Get Signature

```ts
get iterator(): any;
```

Defined in: [core/Subscript.ts:180](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Subscript.ts#L180)

##### Returns

`any`

## Methods

### $safeExec()

```ts
$safeExec(cb, ...args): any;
```

Defined in: [core/Subscript.ts:55](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Subscript.ts#L55)

#### Parameters

##### cb

`any`

##### args

...`any`[]

#### Returns

`any`

***

### subscribe()

```ts
subscribe(cb, prop?): 
  | () => void | () => (() => void | (() => ... | undefined)) | undefined
  | undefined;
```

Defined in: [core/Subscript.ts:133](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Subscript.ts#L133)

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

Defined in: [core/Subscript.ts:155](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Subscript.ts#L155)

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

### unsubscribe()

```ts
unsubscribe(cb?, prop?): 
  | void
  | () => () => void | (() => (() => void | ...) | undefined) | undefined;
```

Defined in: [core/Subscript.ts:142](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Subscript.ts#L142)

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

Defined in: [core/Subscript.ts:132](https://github.com/fest-live/object.ts/blob/07201027b5853c0f6be880b9006c5e66cb0b9554/src/core/Subscript.ts#L132)

#### Parameters

##### nw

`unknown`

#### Returns

`any`
