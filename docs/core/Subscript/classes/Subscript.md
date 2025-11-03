[**@fest/object v0.0.0**](../../../README.md)

***

[@fest/object](../../../README.md) / [core/Subscript](../README.md) / Subscript

# Class: Subscript

Defined in: core/Subscript.ts:46

## Constructors

### Constructor

```ts
new Subscript(): Subscript;
```

Defined in: core/Subscript.ts:68

#### Returns

`Subscript`

## Properties

### compatible

```ts
compatible: any;
```

Defined in: core/Subscript.ts:47

***

### triggerLock

```ts
triggerLock: boolean;
```

Defined in: core/Subscript.ts:52

## Accessors

### iterator

#### Get Signature

```ts
get iterator(): any;
```

Defined in: core/Subscript.ts:135

##### Returns

`any`

## Methods

### $safeExec()

```ts
$safeExec(cb, ...args): Subscript | Promise<unknown>;
```

Defined in: core/Subscript.ts:55

#### Parameters

##### cb

`any`

##### args

...`any`[]

#### Returns

`Subscript` \| `Promise`\<`unknown`\>

***

### subscribe()

```ts
subscribe(cb, prop?): 
  | undefined
  | () => void | () => (() => void | (() => ... | undefined)) | undefined;
```

Defined in: core/Subscript.ts:107

#### Parameters

##### cb

(`value`, `prop`) => `void`

##### prop?

`null` | [`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

#### Returns

  \| `undefined`
  \| () => `void` \| () => (() =\> void \| (() =\> ... \| undefined)) \| undefined

***

### trigger()

```ts
trigger(
   name, 
   value?, 
   oldValue?, ...
etc?): undefined | Promise<unknown>;
```

Defined in: core/Subscript.ts:129

#### Parameters

##### name

`null` | [`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

##### value?

`any`

##### oldValue?

`any`

##### etc?

...`any`[]

#### Returns

`undefined` \| `Promise`\<`unknown`\>

***

### unsubscribe()

```ts
unsubscribe(cb?, prop?): 
  | void
  | () => undefined | () => void | (() => (() => void | ...) | undefined);
```

Defined in: core/Subscript.ts:116

#### Parameters

##### cb?

(`value`, `prop`) => `void`

##### prop?

`null` | [`keyType`](../../../wrap/Utils/type-aliases/keyType.md)

#### Returns

  \| `void`
  \| () => `undefined` \| () => void \| (() =\> (() =\> void \| ...) \| undefined)

***

### wrap()

```ts
wrap(nw): any;
```

Defined in: core/Subscript.ts:106

#### Parameters

##### nw

`unknown`

#### Returns

`any`
