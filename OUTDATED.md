# OUTDATED PARTS OF README

## Installation

```bash
npm install object.ts
```

or

```bash
yarn add object.ts
```

## Usage

```js
import { makeReactive, ref, subscribe } from 'object.ts';

const state = makeReactive({ count: 0 });

const unsubscribe = subscribe(state, () => {
  console.log('State changed:', state.count);
});

state.count = 1; // Triggers subscriber
unsubscribe();   // Unsubscribe when needed
```

## API Reference

### Reactivity

- **`makeReactive(initial)`**
  Creates a reactive primitive from an existing object.

- **`subscribe(obj, [key], callback)`**
  Subscribes to changes in an observable object, `Set`, or `Map`.
  - Supports `[obj, key]` to subscribe to a specific property.
  - Returns an unsubscribe function.

- **`deref(obj)`**
  Dereferences a `WeakRef` or `.value`-based object.

- **`promised(obj)`**
  Wraps an awaitable promise as a reactive value.
  - Reacts only to `Promise.resolve`.

- **`ref(initial)`**
  Creates an observable reference with a `value` property.

- **`computed(sub)`**
  Similar to `ref`, but computes its value from a reactive source.
  - Setting the value has no effect on the source.

- **`unified(...objs)`**
  Combines multiple observable objects into one (read-only).

- **`remap(obj, cb)`**
  Creates a remapped reactive object with a different keyset (read-only).

- **`weak(initial)`**
  Like `ref`, but the `value` is always a `WeakRef` and may disappear without notification.

- **`conditional(cond, ifTrue, ifFalse)`**
  Reactive value that switches between `ifTrue` and `ifFalse` based on `cond.value`.

- **`safe(target)`**
  Prepares an object for serialization to JSON or [JSOX](https://github.com/d3x0r/JSOX).

### DOM Utilities

- **`matchMediaRef(mediaValue)`**
  Creates a reactive `ref` based on a `matchMedia` query.

- **`localStorageRef(name, initial)`**
  Creates a persistent reactive `ref` synchronized with `localStorage`.
  - Note: Does not currently react to changes from other tabs or windows with the same key.

## Related Projects

- [**BLU.E**](https://github.com/fest-live/BLU.E) (2025) — Built on top of Object.ts.
- [**Uniform.TS**](https://github.com/fest-live/uniform.ts) — The major sibling project.
