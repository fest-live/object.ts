[**@fest-lib/object v0.1.25**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/AssignObject](../README.md) / AssignObjectHandler

# Class: AssignObjectHandler

Defined in: wrap/AssignObject.ts:12

Proxy handler that redirects `set` operations to the Fest assignment helper.

## Constructors

### Constructor

```ts
new AssignObjectHandler(): AssignObjectHandler;
```

Defined in: wrap/AssignObject.ts:13

#### Returns

`AssignObjectHandler`

## Methods

### apply()

```ts
apply(
   target, 
   ctx, 
   args): unknown;
```

Defined in: wrap/AssignObject.ts:16

#### Parameters

##### target

`any`

##### ctx

`any`

##### args

`any`

#### Returns

`unknown`

***

### construct()

```ts
construct(
   target, 
   args, 
   newT): unknown;
```

Defined in: wrap/AssignObject.ts:15

#### Parameters

##### target

`any`

##### args

`any`

##### newT

`any`

#### Returns

`unknown`

***

### deleteProperty()

```ts
deleteProperty(target, name): boolean;
```

Defined in: wrap/AssignObject.ts:14

#### Parameters

##### target

`any`

##### name

[`keyType`](../../Utils/type-aliases/keyType.md)

#### Returns

`boolean`

***

### get()

```ts
get(
   target, 
   name, 
   ctx): any;
```

Defined in: wrap/AssignObject.ts:19

#### Parameters

##### target

`any`

##### name

[`keyType`](../../Utils/type-aliases/keyType.md)

##### ctx

`any`

#### Returns

`any`

***

### has()

```ts
has(target, prop): boolean;
```

Defined in: wrap/AssignObject.ts:17

#### Parameters

##### target

`any`

##### prop

[`keyType`](../../Utils/type-aliases/keyType.md)

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

Defined in: wrap/AssignObject.ts:18

#### Parameters

##### target

`any`

##### name

[`keyType`](../../Utils/type-aliases/keyType.md)

##### value

`any`

#### Returns

`boolean`
