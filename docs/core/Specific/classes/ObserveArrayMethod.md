[**@fest-lib/object v0.1.47**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Specific](../README.md) / ObserveArrayMethod

# Class: ObserveArrayMethod

Defined in: core/Specific.ts:399

Wrap mutating array methods so they emit normalized add/set/delete events.

## Constructors

### Constructor

```ts
new ObserveArrayMethod(
   name, 
   self, 
   handle
): ObserveArrayMethod;
```

Defined in: core/Specific.ts:401

#### Parameters

##### name

`any`

##### self

`any`

##### handle

`any`

#### Returns

`ObserveArrayMethod`

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args
): any;
```

Defined in: core/Specific.ts:415

#### Parameters

##### target

`any`

##### ctx

`any`

##### args

`any`

#### Returns

`any`

***

### get()

```ts
get(
   target, 
   name, 
   rec
): any;
```

Defined in: core/Specific.ts:408

#### Parameters

##### target

`any`

##### name

`any`

##### rec

`any`

#### Returns

`any`
