[**@fest-lib/object v0.1.14**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [wrap/AssignObject](../README.md) / makeObjectAssignable

# Function: makeObjectAssignable()

```ts
function makeObjectAssignable<Under>(obj): observeValid<Under>;
```

Defined in: wrap/AssignObject.ts:26

Wrap an object in an assignment-aware proxy once, preserving the original-object lookup table.

## Type Parameters

### Under

`Under` = `any`

## Parameters

### obj

`Under`

## Returns

[`observeValid`](../../Utils/type-aliases/observeValid.md)\<`Under`\>
