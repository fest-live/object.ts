[**@fest-lib/object v0.1.24**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Subscript](../README.md) / TriggerControl

# Type Alias: TriggerControl

```ts
type TriggerControl = object;
```

Defined in: core/Subscript.ts:43

## Methods

### disable()

```ts
disable(types?, cb?): any;
```

Defined in: core/Subscript.ts:45

#### Parameters

##### types?

[`TriggerFilterList`](TriggerFilterList.md)

##### cb?

() => `any`

#### Returns

`any`

***

### enable()

```ts
enable(types?, cb?): any;
```

Defined in: core/Subscript.ts:44

#### Parameters

##### types?

[`TriggerFilterList`](TriggerFilterList.md)

##### cb?

() => `any`

#### Returns

`any`

***

### isEnabled()

```ts
isEnabled(trigger): boolean;
```

Defined in: core/Subscript.ts:49

#### Parameters

##### trigger

[`TriggerName`](TriggerName.md)

#### Returns

`boolean`

***

### set()

```ts
set(types, enabled): void;
```

Defined in: core/Subscript.ts:46

#### Parameters

##### types

[`TriggerFilterList`](TriggerFilterList.md)

##### enabled

`boolean`

#### Returns

`void`

***

### with()

```ts
with(types, cb): any;
```

Defined in: core/Subscript.ts:47

#### Parameters

##### types

[`TriggerFilterList`](TriggerFilterList.md)

##### cb

() => `any`

#### Returns

`any`

***

### without()

```ts
without(types, cb): any;
```

Defined in: core/Subscript.ts:48

#### Parameters

##### types

[`TriggerFilterList`](TriggerFilterList.md)

##### cb

() => `any`

#### Returns

`any`
