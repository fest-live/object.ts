[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Subscript](../README.md) / Subscript

# Class: Subscript

Defined in: [core/Subscript.ts:46](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L46)

## Constructors

### Constructor

```ts
new Subscript(): Subscript;
```

Defined in: [core/Subscript.ts:77](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L77)

#### Returns

`Subscript`

## Properties

### compatible

```ts
compatible: any;
```

Defined in: [core/Subscript.ts:47](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L47)

***

### triggerLock

```ts
triggerLock: boolean;
```

Defined in: [core/Subscript.ts:52](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L52)

## Accessors

### iterator

#### Get Signature

```ts
get iterator(): any;
```

Defined in: [core/Subscript.ts:168](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L168)

##### Returns

`any`

## Methods

### $safeExec()

```ts
$safeExec(cb, ...args): any;
```

Defined in: [core/Subscript.ts:55](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L55)

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

Defined in: [core/Subscript.ts:131](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L131)

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
   etc?): Promise<void | any[]> | undefined;
```

Defined in: [core/Subscript.ts:153](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L153)

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

`Promise`\<`void` \| `any`[]\> \| `undefined`

***

### unsubscribe()

```ts
unsubscribe(cb?, prop?): 
  | void
  | () => () => void | (() => (() => void | ...) | undefined) | undefined;
```

Defined in: [core/Subscript.ts:140](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L140)

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

Defined in: [core/Subscript.ts:130](https://github.com/fest-live/object.ts/blob/ed41651393dc7ae0634f0ceb8071830cf5c46166/src/core/Subscript.ts#L130)

#### Parameters

##### nw

`unknown`

#### Returns

`any`
