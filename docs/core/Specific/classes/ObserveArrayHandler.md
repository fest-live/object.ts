[**@fest-lib/object v0.1.46**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ObserveArrayHandler

# Class: ObserveArrayHandler

Defined in: core/Specific.ts:532

Proxy handler for observable arrays, including index writes and mutation methods.

## Constructors

### Constructor

```ts
new ObserveArrayHandler(): ObserveArrayHandler;
```

Defined in: core/Specific.ts:534

#### Returns

`ObserveArrayHandler`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]?: boolean;
```

Defined in: core/Specific.ts:533

## Methods

### deleteProperty()

```ts
deleteProperty(target, name): boolean;
```

Defined in: core/Specific.ts:630

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
   rec
): any;
```

Defined in: core/Specific.ts:542

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

Defined in: core/Specific.ts:538

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
   value
): any;
```

Defined in: core/Specific.ts:589

#### Parameters

##### target

`any`

##### name

`any`

##### value

`any`

#### Returns

`any`
