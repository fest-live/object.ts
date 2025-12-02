# Object.TS

<img src="https://img.shields.io/github/license/fest-live/object.ts?style=flat-square" alt="License"> <img src="https://img.shields.io/github/stars/fest-live/object.ts?style=flat-square" alt="Stars"> <img src="https://img.shields.io/github/last-commit/fest-live/object.ts?style=flat-square" alt="Last Commit">

[![npm version](https://img.shields.io/npm/v/object.ts?style=flat-square)](https://www.npmjs.com/package/@fest-lib/object.ts)
[![Build Status](https://img.shields.io/github/actions/workflow/status/fest-live/object.ts/ci.yml?branch=main&style=flat-square)](https://github.com/fest-live/object.ts/actions)
[![Coverage Status](https://img.shields.io/codecov/c/github/fest-live/object.ts?style=flat-square)](https://codecov.io/gh/fest-live/object.ts)

---

**Object.ts** is a lightweight library providing reactive primitives and object utilities for JavaScript. It is a minor sibling of [`Uniform.TS`](https://github.com/fest-live/uniform.ts), originally created in early 2024 and partially revisited in 2025. The library is primarily used in internal projects and is designed to be compatible with modern reactive libraries.

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

- **`makeReactive(initial)`**
  Creates a reactive primitive from an existing object.

- **`subscribe(obj, callback)`**
  Subscribes to changes in an observable object, `Set`, or `Map`.
  - Supports `[obj, key]` to subscribe to a specific property.
  - Returns an unsubscribe function.

- **`ref(initial)`**
  Creates an observable reference with a `value` property.

- **`computed(sub)`**
  Similar to `ref`, but computes its value from a reactive source.
  - Setting the value has no effect on the source.

- **`conditional(cond, ifTrue, ifFalse)`**
  Reactive value that switches between `ifTrue` and `ifFalse` based on `cond.value`.

### Install

```bash
npm i @fest-lib/object
```

### Importing

```ts
import {
  ref,
  numberRef,
  stringRef,
  booleanRef,
  autoRef,
  promised,
  makeReactive,
  subscribe,
  observe,
  unsubscribe,
  derivate,
  bindBy,
  safe
} from "@fest-lib/object";
```

### Quick start

```ts
const state = makeReactive({ count: 0, user: { name: "Ada" } });

const stop = subscribe(state, (value, prop) => {
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
const list = makeReactive([1, 2, 3]);
const bag  = makeReactive(new Set(["a", "b"]));
const map  = makeReactive(new Map([["x", 1]]));

const unAll = observe(list, (v, prop) => console.log("list changed", prop));
const unBag = observe(bag,  (v, prop) => console.log("set changed", prop));
const unMap = observe(map,  (v, prop) => console.log("map changed", prop));

const person = makeReactive({ name: "Ada", age: 36 });
const unName = subscribe([person, "name"], (v) => console.log("name:", v));

person.name = "Grace";
unAll?.(); unBag?.(); unMap?.(); unName?.();
```

### Deriving and binding

```ts
const source = makeReactive({ x: 1, y: 2 });

// Read-only derivative
const sum = derivate(source, s => ({ sum: s.x + s.y }));
subscribe(sum, () => console.log("sum:", sum.sum));

// Two-way bind by shape
const target: any = { x: 0, y: 0 };
bindBy(target, source);

source.x = 3; // target.x becomes 3
```

### Safe serialization

```ts
const complex = makeReactive({ d: new Date(), w: new WeakRef({ a: 1 }) });
JSON.stringify(safe(complex));
```

### Notes

- Subscriptions fire only on actual changes.
- `observe` adapts `Set`/`Map` to emit iteration changes.
- To stop listening, keep the disposer returned by `subscribe`/`observe` and call it.
***

## Modules

- [core/Assigned](core/Assigned/README.md)
- [core/Legacy](core/Legacy/README.md)
- [core/Mainline](core/Mainline/README.md)
- [core/Primitives](core/Primitives/README.md)
- [core/Specific](core/Specific/README.md)
- [core/Subscript](core/Subscript/README.md)
- [index](index/README.md)
- [wrap/AssignObject](wrap/AssignObject/README.md)
- [wrap/Symbol](wrap/Symbol/README.md)
- [wrap/Utils](wrap/Utils/README.md)

---

## License

This project is licensed under the [MIT License](LICENSE).
