# Object.ts API Reference

This reference lists the primary exported functions and types. All modules are under `modules/object.ts/src`.

## Exports from `index.ts`

- Assigning helpers: `removeExtra`, `objectAssign`, `makeObjectAssignable`
- Core: `makeReactive`, `subscribe`, `observe`, `unsubscribe`, `bindByKey`, `derivate`, `bindBy`, `observableBySet`, `observableByMap`
- Primitives: `conditional`, `numberRef`, `stringRef`, `booleanRef`, `ref`, `autoRef`, `promised`, `assign`, `link`, `computed`, `propRef`, `conditionalIndex`, `delayedSubscribe`, `triggerWithDelay`, `delayedBehavior`, `delayedOrInstantBehavior`, `remap` (deprecated), `unified` (deprecated)
- Promise utilities: `Promised`, `fixFx`, `$set`
- WeakRef wrapper: `WRef`
- Utilities: `$triggerLess`, `safe`, `unwrap`, `deref`, `isValidObj`, `addToCallChain`

## Function Details

### makeReactive(target)

Wraps objects, arrays, maps, sets, and functions into a reactive proxy. Returns `target` unchanged for Symbols, Promises, `WeakRef`, or already-wrapped values.

Parameters:

- `target`: Any object/function/collection

Returns: reactive proxy or original value.

### subscribe(tg, cb[, ctx])

Subscribes to changes on `tg`. `tg` can be a reactive object or `[object, key]`. Callback receives `(value, prop, old)`.

Returns: `unsub()` function.

### observe(tg, cb[, ctx])

Convenience for working with arrays; if `tg` is an array, subscribes to iterator updates.

### unsubscribe(tg, cb?, ctx?)

Removes a subscription. With `cb` removes only that callback; otherwise clears all.

### bindByKey(target, reactive, keyFn)

Mirrors updates for `keyFn()` property from `reactive` into `target`.

### derivate(from, reactFn, watch?)

Creates a derived reactive from `from` using `reactFn`, with optional `watch` to propagate changes back.

### bindBy(target, reactive, watch?)

Two-way sync between plain target and reactive by properties.

### observableBySet(set)

Returns reactive array that reflects membership of `set`.

### observableByMap(map)

Returns reactive array of `[key, value]` pairs reflecting `map`.

### conditional(cond, ifTrue, ifFalse[, behavior])

Reactive branch value that switches with `cond`.

### numberRef/stringRef/booleanRef/ref/autoRef

Reactive primitive references with `.value` access, coercing to their types.

### promised(promise[, behavior])

Wraps a promise into a reactive reference `.value` that updates on resolve.

### assign([a, prop], [b, prop|compute], prop?)

One-way sync from `b` to `a` for `prop`. If the second tuple has a function, it is used as compute.

### link(a, b[, prop])

Two-way sync between two reactives/objects.

### computed(src, cb?, behavior?, prop="value")

Creates a computed ref dependent on `src[prop]` and `cb`.

### propRef(src, srcProp?, behavior?, initial?)

Reactive reference to `src[srcProp]` with synchronization.

### conditionalIndex(conditions)

Computed index of first predicate returning true.

### delayedSubscribe(ref, cb, delay?), triggerWithDelay(ref, cb, delay?)

Delay helpers for truthy `.value` activation.

### delayedBehavior(delay?), delayedOrInstantBehavior(delay?)

Composable behaviors that integrate with abort signals for cleanup.

### remap(sub, cb?, dest?) [deprecated]

One-way map into destination reactive.

### unified(...subs) [deprecated]

Merges updates from multiple reactives into one object.

## Types and Symbols

- `keyType`: `string|number|symbol`
- `refValid`, `subValid`: Broad union types for reactive-capable inputs/tuples
- Symbols: `$value`, `$extractKey$`, `$originalKey$`, `$registryKey$`, `$triggerLess`, `$triggerLock`, `$promise`, `$behavior`
