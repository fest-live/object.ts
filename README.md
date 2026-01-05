# Object.TS

<img src="https://img.shields.io/github/license/fest-live/object.ts?style=flat-square" alt="License"> <img src="https://img.shields.io/github/stars/fest-live/object.ts?style=flat-square" alt="Stars"> <img src="https://img.shields.io/github/last-commit/fest-live/object.ts?style=flat-square" alt="Last Commit">

[![npm version](https://img.shields.io/npm/v/object.ts?style=flat-square)](https://www.npmjs.com/package/@fest-lib/object.ts)
[![Build Status](https://img.shields.io/github/actions/workflow/status/fest-live/object.ts/ci.yml?branch=main&style=flat-square)](https://github.com/fest-live/object.ts/actions)
[![Coverage Status](https://img.shields.io/codecov/c/github/fest-live/object.ts?style=flat-square)](https://codecov.io/gh/fest-live/object.ts)

---

**Object.ts** is a lightweight library providing reactive primitives and object utilities for JavaScript. It is a minor sibling of [`Uniform.TS`](https://github.com/fest-live/uniform.ts), originally created in early 2024 and partially revisited in 2025. The library is primarily used in internal projects and is designed to be compatible with modern reactive libraries.

The current version provides a comprehensive reactivity system with non-intrusive subscriptions, efficient change detection, and compatibility with modern JavaScript frameworks.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Reactivity](#reactivity)
  - [DOM Utilities](#dom-utilities)
- [Related Projects](#related-projects)
- [License](#license)

---

## Features

- **Non-intrusive subscriptions:** Subscribers do not retain references to target objects.
- **Efficient reactivity:** Triggers only on actual value changes.
- **Compatibility:** Works with recent versions of popular reactive libraries.

---

## Usage & Examples

### Reactivity (basics)

- **`observe(initial)`**
  Creates a reactive primitive from an existing object, array, Set, or Map.

- **`affected(obj, callback)`**
  Subscribes to changes in an observable object, `Set`, or `Map`.
  - Supports `[obj, key]` to subscribe to a specific property.
  - Returns an unsubscribe function.

- **`ref(initial)`**
  Creates an observable reference with a `value` property.

- **`computed(src, cb, behavior, prop)`**
  Creates a computed reactive value from a source.
  - Computes its value using a callback function.
  - Automatically updates when dependencies change.

- **`conditional(cond, ifTrue, ifFalse)`**
  Reactive value that switches between `ifTrue` and `ifFalse` based on `cond.value`.

### Install

```bash
npm i @fest-lib/object.ts
```

### Importing

```ts
import {
  // Core reactivity
  observe,
  affected,
  makeArrayObservable,
  isObservable,
  recoverReactive,

  // Primitive refs
  ref,
  numberRef,
  stringRef,
  booleanRef,
  autoRef,
  promised,

  // Computed and derived values
  computed,
  derivate,
  conditional,
  remap,
  unified,

  // Binding and assignment
  bindBy,
  assign,
  link,

  // Collection utilities
  observableBySet,
  observableByMap,
  iterated,

  // Subscription management
  unaffected,
  triggerWithDelay,
  delayedBehavior,
  delayedOrInstantBehavior,

  // Utilities
  safe,
  deref,
  unwrap,
  propRef,

  // Legacy (deprecated)
  createReactive,
  createReactiveMap,
  createReactiveSet
} from "@fest-lib/object.ts";
```

### Quick start

```ts
const state = observe({ count: 0, user: { name: "Ada" } });

const stop = affected(state, (value, prop) => {
  console.log("changed:", prop, value[prop as keyof typeof value]);
});

state.count = 1;
stop?.();
```

### Primitive refs

```ts
const n = numberRef(0);
const s = stringRef("hello");
const b = booleanRef(false);

n.value++;            // 1
s.value = s + "!";    // "hello!"
b.value = 1;          // true (truthy coercion)
```

#### Auto ref and promised

```ts
const r1 = autoRef(true);     // booleanRef
const r2 = autoRef(42);       // numberRef
const r3 = autoRef("hi");    // stringRef
const r4 = ref<any>({ a: 1 });

const later = promised(fetch("/api").then(r => r.status));
subscribe(later, () => console.log("ready:", later.value));
```

### Observing collections and properties

```ts
const list = observe([1, 2, 3]);
const bag  = observe(new Set(["a", "b"]));
const map  = observe(new Map([["x", 1]]));

const unAll = affected(list, (v, prop) => console.log("list changed", prop));
const unBag = affected(bag,  (v, prop) => console.log("set changed", prop));
const unMap = affected(map,  (v, prop) => console.log("map changed", prop));

const person = observe({ name: "Ada", age: 36 });
const unName = affected([person, "name"], (v) => console.log("name:", v));

person.name = "Grace";
unAll?.(); unBag?.(); unMap?.(); unName?.();
```

### Deriving and binding

```ts
const source = observe({ x: 1, y: 2 });

// Read-only derivative
const sum = derivate(source, s => ({ sum: s.x + s.y }));
affected(sum, () => console.log("sum:", sum.sum));

// Two-way bind by shape
const target: any = { x: 0, y: 0 };
bindBy(target, source);

source.x = 3; // target.x becomes 3
```

### Safe serialization

```ts
const complex = observe({ d: new Date(), w: new WeakRef({ a: 1 }) });
JSON.stringify(safe(complex));
```

### Computed values

```ts
const state = observe({ a: 1, b: 2 });
const sum = computed(state, s => s.a + s.b);

affected(sum, () => console.log("sum changed:", sum.value));
state.a = 3; // triggers: sum changed: 5
```

### Conditional reactivity

```ts
const condition = booleanRef(true);
const result = conditional(condition, "yes", "no");

affected(result, () => console.log("result:", result.value));
condition.value = false; // triggers: result: no
```

### Property references

```ts
const obj = observe({ nested: { value: 42 } });
const propRef = propRef(obj, "nested.value");

affected(propRef, () => console.log("nested value:", propRef.value));
obj.nested.value = 100; // triggers: nested value: 100
```

### Collection observables

```ts
const set = observe(new Set([1, 2, 3]));
const arrayFromSet = observableBySet(set);

affected(arrayFromSet, () => console.log("set as array:", arrayFromSet));
set.add(4); // triggers: set as array: [1, 2, 3, 4]
```

### Notes

- Subscriptions fire only on actual changes.
- `observe` adapts `Set`/`Map` to emit iteration changes.
- To stop listening, keep the disposer returned by `affected` and call it.

## API Reference

### Core Reactivity

#### `observe<T>(target: T): observeValid<T>`

Creates a reactive proxy from an object, array, Set, or Map. Changes to the reactive object will trigger subscriptions.

```ts
const obj = observe({ count: 0 });
const arr = observe([1, 2, 3]);
const set = observe(new Set([1, 2]));
```

#### `affected(obj, callback): UnsubscribeFn`

Subscribes to changes on a reactive object. Returns an unsubscribe function.

```ts
const state = observe({ count: 0 });
const unsubscribe = affected(state, (value, prop, old) => {
  console.log(`${prop} changed from ${old} to ${value[prop]}`);
});
```

#### `isObservable(obj): boolean`

Checks if an object is already reactive.

#### `recoverReactive(obj): observeValid | null`

Attempts to recover the reactive version of an object.

### Reactive References

#### `ref<T>(initial: T): Ref<T>`

Creates a reactive reference with a `.value` property.

#### `numberRef(initial?: number): NumberRef`

Creates a reactive number reference with type coercion.

#### `stringRef(initial?: string): StringRef`

Creates a reactive string reference with type coercion.

#### `booleanRef(initial?: boolean): BooleanRef`

Creates a reactive boolean reference with truthy coercion.

#### `autoRef(initial: any): Ref`

Automatically creates the appropriate ref type based on the initial value.

#### `promised<T>(promise: Promise<T>): PromisedRef<T>`

Creates a reactive reference from a Promise.

### Computed Values

#### `computed<T>(src, cb, behavior?, prop?): ComputedRef<T>`

Creates a computed reactive value that updates when its dependencies change.

```ts
const state = observe({ a: 1, b: 2 });
const sum = computed(state, s => s.a + s.b);
```

#### `derivate<T>(from, reactFn, watch?): observeValid`

Creates a derived reactive object from a source.

#### `conditional<T>(cond, ifTrue, ifFalse): ConditionalRef<T>`

Creates a reactive value that switches between two values based on a condition.

### Binding & Assignment

#### `bindBy(target, reactive, watch?)`

Two-way binds a target object to a reactive source.

#### `assign<T>(a, b, prop?): UnsubscribeFn`

Assigns reactive values between objects with automatic synchronization.

#### `link<T>(a, b, prop?): UnsubscribeFn`

Creates a bidirectional link between two reactive values.

### Collection Utilities

#### `observableBySet<T>(set: Set<T>): T[]`

Converts a reactive Set to a reactive array.

#### `observableByMap<K, V>(map: Map<K, V>): [K, V][]`

Converts a reactive Map to a reactive array of key-value pairs.

#### `iterated<T>(target, cb, ctx?): UnsubscribeFn`

Subscribes to iteration changes on collections.

#### `makeArrayObservable(target): observeValid`

Makes arrays observable.

### Utilities

#### `safe(obj): any`

Prepares an object for JSON serialization by handling circular references and WeakRefs.

#### `deref(obj): any`

Dereferences WeakRefs and unwraps reactive objects.

#### `unwrap(obj): any`

Unwraps reactive objects to their original form.

#### `propRef<T>(src, prop, initial?, behavior?): Ref<T>`

Creates a reactive reference to a specific property.

### Subscription Management

#### `unaffected<T>(target, cb?, ctx?): Promise<T>`

Removes subscriptions from an object.

#### `triggerWithDelay(ref, cb, delay?): Timeout`

Triggers a callback after a delay if the ref value is truthy.

#### `delayedBehavior(delay?): Function`

Creates a behavior function that delays execution.

#### `delayedOrInstantBehavior(delay?): Function`

Creates a behavior that executes immediately or after delay.

### Legacy (Deprecated)

#### `createReactive(target, stateName?)`

Legacy function for creating reactive objects.

#### `createReactiveMap<K, V>(map?): Map<K, V>`

Legacy function for creating reactive Maps.

#### `createReactiveSet<V>(set?): Set<V>`

Legacy function for creating reactive Sets.

***

## Modules

- [core/Assigned](docs/core/Assigned/README.md) - Assignment and binding utilities
- [core/Legacy](docs/core/Legacy/README.md) - Legacy compatibility functions
- [core/Mainline](docs/core/Mainline/README.md) - Core subscription and reactivity system
- [core/Primitives](docs/core/Primitives/README.md) - Primitive reactive references
- [core/Specific](docs/core/Specific/README.md) - Specific object type handlers
- [core/Subscript](docs/core/Subscript/README.md) - Subscription registry system
- [index](docs/index/README.md) - Main exports
- [wrap/AssignObject](docs/wrap/AssignObject/README.md) - Object assignment proxy
- [wrap/Symbol](docs/wrap/Symbol/README.md) - Internal symbols and triggers
- [wrap/Utils](docs/wrap/Utils/README.md) - Utility functions and types

---

## License

This project is licensed under the [MIT License](LICENSE).
