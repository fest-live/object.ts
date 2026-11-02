[**@fest-lib/object v0.1.47**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ObserveArrayHandler

# Class: ObserveArrayHandler

Defined in: core/Specific.ts:538

Proxy handler for observable arrays, including index writes and mutation methods.

## Constructors

### Constructor

```ts
new ObserveArrayHandler(): ObserveArrayHandler;
```

Defined in: core/Specific.ts:540

#### Returns

`ObserveArrayHandler`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]?: boolean;
```

Defined in: core/Specific.ts:539

## Methods

### deleteProperty()

```ts
deleteProperty(target, name): boolean;
```

Defined in: core/Specific.ts:636

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

Defined in: core/Specific.ts:548

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

Defined in: core/Specific.ts:544

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

Defined in: core/Specific.ts:595

#### Parameters

##### target

`any`

##### name

`any`

##### value

`any`

#### Returns

`any`
