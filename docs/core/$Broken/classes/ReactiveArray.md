[**@fest-lib/object v0.1.14**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/$Broken](../README.md) / ReactiveArray

# Class: ReactiveArray

Defined in: core/$Broken.ts:215

Legacy array proxy handler retained for old call sites.

## Constructors

### Constructor

```ts
new ReactiveArray(): ReactiveArray;
```

Defined in: core/$Broken.ts:217

#### Returns

`ReactiveArray`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]?: boolean;
```

Defined in: core/$Broken.ts:216

## Methods

### deleteProperty()

```ts
deleteProperty(target, name): boolean;
```

Defined in: core/$Broken.ts:284

#### Parameters

##### target

`any`

##### name

`any`

#### Returns

`boolean`

***

### get()

```ts
get(
   target, 
   name, 
   rec): any;
```

Defined in: core/$Broken.ts:225

#### Parameters

##### target

`any`

##### name

`any`

##### rec

`any`

#### Returns

`any`

***

### has()

```ts
has(target, name): boolean;
```

Defined in: core/$Broken.ts:221

#### Parameters

##### target

`any`

##### name

`any`

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

Defined in: core/$Broken.ts:251

#### Parameters

##### target

`any`

##### name

`any`

##### value

`any`

#### Returns

`boolean`
