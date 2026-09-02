[**@fest-lib/object v0.1.26**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ObserveArrayHandler

# Class: ObserveArrayHandler

Defined in: core/Specific.ts:376

Proxy handler for observable arrays, including index writes and mutation methods.

## Constructors

### Constructor

```ts
new ObserveArrayHandler(): ObserveArrayHandler;
```

Defined in: core/Specific.ts:378

#### Returns

`ObserveArrayHandler`

## Properties

### \[$triggerLock\]?

```ts
optional [$triggerLock]?: boolean;
```

Defined in: core/Specific.ts:377

## Methods

### deleteProperty()

```ts
deleteProperty(target, name): boolean;
```

Defined in: core/Specific.ts:477

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

Defined in: core/Specific.ts:386

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

Defined in: core/Specific.ts:382

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

Defined in: core/Specific.ts:433

#### Parameters

##### target

`any`

##### name

`any`

##### value

`any`

#### Returns

`boolean`
