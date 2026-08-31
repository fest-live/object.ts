[**@fest-lib/object v0.1.23**](../../../README.md)

***

[@fest-lib/object](../../../README.md) / [core/Assigned](../README.md) / delayedSubscribe

# Function: delayedSubscribe()

```ts
function delayedSubscribe<Under>(
   ref, 
   cb, 
delay?): observeValid<Under>;
```

Defined in: core/Assigned.ts:334

Subscribe to a truthy ref/value and trigger the callback only after a delay window.

## Type Parameters

### Under

`Under` = `any`

## Parameters

### ref

`any`

### cb

`Function`

### delay?

`number` = `100`

## Returns

[`observeValid`](../../../wrap/Utils/type-aliases/observeValid.md)\<`Under`\>
