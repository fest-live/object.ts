[**@fest-lib/object v0.1.34**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ObserveArrayHandler

# Class: ObserveArrayHandler

Defined in: core/Specific.ts:381

Proxy handler for observable arrays, including index writes and mutation methods.

## Constructors

### Constructor

```ts
new ObserveArrayHandler(): ObserveArrayHandler;
```

Defined in: core/Specific.ts:383

#### Returns

`ObserveArrayHandler`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]?: boolean;
```

Defined in: core/Specific.ts:382

## Methods

### deleteProperty()

```ts
deleteProperty(target, name): boolean;
```

Defined in: core/Specific.ts:479

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

Defined in: core/Specific.ts:391

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

Defined in: core/Specific.ts:387

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
   value): any;
```

Defined in: core/Specific.ts:438

#### Parameters

##### target

`any`

##### name

`any`

##### value

`any`

#### Returns

`any`
