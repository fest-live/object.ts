[**@fest-lib/object v0.1.38**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Mainline](../README.md) / DoubleWeakMap

# Class: DoubleWeakMap

Defined in: core/Mainline.ts:257

Two-level WeakMap used to memoize subscriptions keyed by `[target, callback]` pairs.

## Constructors

### Constructor

```ts
new DoubleWeakMap(): DoubleWeakMap;
```

#### Returns

`DoubleWeakMap`

## Methods

### delete()

```ts
delete(pair): any;
```

Defined in: core/Mainline.ts:305

#### Parameters

##### pair

`any`

#### Returns

`any`

***

### deleteTop()

```ts
deleteTop(key1): boolean;
```

Defined in: core/Mainline.ts:312

#### Parameters

##### key1

`any`

#### Returns

`boolean`

***

### get()

```ts
get(pair): any;
```

Defined in: core/Mainline.ts:293

#### Parameters

##### pair

`any`

#### Returns

`any`

***

### getOrCreate()

```ts
getOrCreate(pair, factory): any;
```

Defined in: core/Mainline.ts:318

#### Parameters

##### pair

`any`

##### factory

`any`

#### Returns

`any`

***

### getOrInsert()

```ts
getOrInsert(pair, value): any;
```

Defined in: core/Mainline.ts:333

#### Parameters

##### pair

`any`

##### value

`any`

#### Returns

`any`

***

### getOrInsertComputed()

```ts
getOrInsertComputed(pair, compute): any;
```

Defined in: core/Mainline.ts:348

#### Parameters

##### pair

`any`

##### compute

`any`

#### Returns

`any`

***

### has()

```ts
has(pair): any;
```

Defined in: core/Mainline.ts:299

#### Parameters

##### pair

`any`

#### Returns

`any`

***

### hasL1()

```ts
hasL1(key1): boolean;
```

Defined in: core/Mainline.ts:281

#### Parameters

##### key1

`any`

#### Returns

`boolean`

***

### set()

```ts
set(pair, value): DoubleWeakMap;
```

Defined in: core/Mainline.ts:285

#### Parameters

##### pair

`any`

##### value

`any`

#### Returns

`DoubleWeakMap`
