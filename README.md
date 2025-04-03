# Object.ts

Reactive and objects utils for JS. It's minor sibling of [`Uniform.TS`](https://github.com/unite-2-re/uniform.ts), created in earlier 2024 and partially revisited in 2025. At moment of 2025, I can't say about next-generation. It's used for own projects. For 2020 may to be something revolutional.

## Features

- Subscribers isn't holding target objects.
- Reacts only when values isn't same.
- Compatible with some reactive libraries (last versions).

## Notable functions

### Reactivity

- `makeReactive(initial)` - create reactive primitive from exists object
- `subscribe(obj)` - subscribe to observable object, set or map, argument may be promise
  - Can be used `[obj, key]` to subscribe exact key
  - Return unsubscribe function in last versions
- `deref(obj)` - used for WeakRef and `.value` based object
- `promised(obj)` - wrap awaitable promise as reactive
  - Only for reaction from Promise `resolve`
- `ref(initial)` use observable reference with `value` key
- `computed(sub)` same as `ref` but with computation from `sub` reaction, setting value have no effect to initator
- `unified(...objs)` use pack of observable objects as one, but you can't set properties (no effect)
- `remap(obj, cb)` remapped reactive object, usable when needs another keyset, but you unable to set backwardly (no effect)
- `weak(initial)` same as ref, but `value` key always has `WeakRef`, and may disappear (will not any notify)
- `conditional(cond, ifTrue, ifFalse)` reacts from `cond` (with `value` key), has own `value`, but always uses `ifTrue` or `ifFalse`
- `safe(target)` used for serialize to JSON or [JSOX](https://github.com/d3x0r/JSOX).

### DOM

- `matchMediaRef(mediaValue)` creates `matchMedia` reactive `ref`
- `localStorageRef(name, initial)` create same `ref`, but with `localStorage` interaction (PERSISTENT!)
  - Currently doesn't support reaction to another refs from `localStorage` with same key and same origin

## Projects (childrens)

- [`BLU.E`](https://github.com/unite-2-re/BLU.E) (2025) - uses that library as basis.
