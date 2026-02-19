[**@fest-lib/object v0.0.0**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Legacy](../README.md) / Time

# Class: Time

Defined in: [core/Legacy.ts:28](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L28)

## Constructors

### Constructor

```ts
new Time(): AxTime;
```

Defined in: [core/Legacy.ts:29](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L29)

#### Returns

`AxTime`

## Properties

### looping

```ts
static looping: Map<string, Function>;
```

Defined in: [core/Legacy.ts:32](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L32)

***

### registry

```ts
static registry: FinalizationRegistry<unknown>;
```

Defined in: [core/Legacy.ts:33](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L33)

## Accessors

### raf

#### Get Signature

```ts
get static raf(): Promise<unknown>;
```

Defined in: [core/Legacy.ts:34](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L34)

##### Returns

`Promise`\<`unknown`\>

## Methods

### available()

```ts
available(elapsed, fn): boolean;
```

Defined in: [core/Legacy.ts:42](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L42)

#### Parameters

##### elapsed

`any`

##### fn

() => `boolean`

#### Returns

`boolean`

***

### cached()

```ts
cached(fn, interval): (...args) => any;
```

Defined in: [core/Legacy.ts:40](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L40)

#### Parameters

##### fn

`any`

##### interval

`number` = `100`

#### Returns

```ts
(...args): any;
```

##### Parameters

###### args

...`any`[]

##### Returns

`any`

***

### protect()

```ts
protect(fn, interval): (...args) => any;
```

Defined in: [core/Legacy.ts:41](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L41)

#### Parameters

##### fn

`any`

##### interval

`number` = `100`

#### Returns

```ts
(...args): any;
```

##### Parameters

###### args

...`any`[]

##### Returns

`any`

***

### cached()

```ts
static cached(fn, interval): (...args) => any;
```

Defined in: [core/Legacy.ts:36](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L36)

#### Parameters

##### fn

`any`

##### interval

`number` = `100`

#### Returns

```ts
(...args): any;
```

##### Parameters

###### args

...`any`[]

##### Returns

`any`

***

### protect()

```ts
static protect(fn, interval): (...args) => any;
```

Defined in: [core/Legacy.ts:35](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L35)

#### Parameters

##### fn

`any`

##### interval

`number` = `100`

#### Returns

```ts
(...args): any;
```

##### Parameters

###### args

...`any`[]

##### Returns

`any`

***

### rafLoop()

```ts
static rafLoop(fn, ctx): Promise<boolean>;
```

Defined in: [core/Legacy.ts:54](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L54)

#### Parameters

##### fn

`any`

##### ctx

`Document` = `document`

#### Returns

`Promise`\<`boolean`\>

***

### symbol()

```ts
static symbol(name): symbol;
```

Defined in: [core/Legacy.ts:37](https://github.com/fest-live/object.ts/blob/9c7e7454d5cde6f79afa05bc9b999ff94be2998e/src/core/Legacy.ts#L37)

#### Parameters

##### name

`string` = `""`

#### Returns

`symbol`
