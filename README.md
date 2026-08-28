<p align="center">
  <strong>@fest-lib/object</strong><br>
  Level 1 — observe / affected / refs. LUR.E and FL.UI subscribe through <code>affected</code>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@fest-lib/object"><img src="https://img.shields.io/npm/v/@fest-lib/object?style=flat-square" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@fest-lib/object?style=flat-square" alt="MIT"></a>
  <a href="https://github.com/fest-live/object.ts"><img src="https://img.shields.io/github/stars/fest-live/object.ts?style=flat-square" alt="stars"></a>
</p>

Reactive proxies for objects, arrays, `Set`, and `Map`. Subscriptions do **not** retain the target. Updates fire only when the value actually changes.

```text
core · uniform
 └── fest/object      ← you are here
      └── lure · veela · icon · image · fl-ui
```

## Install

```bash
npm install @fest-lib/core @fest-lib/uniform @fest-lib/object
```

Peers: `@fest-lib/core`, `@fest-lib/uniform` (`>=0.1.0`). ESM, Node **20+**.

```ts
import { observe, affected, ref, computed } from "@fest-lib/object";

const state = observe({ count: 0, user: { name: "Ada" } });
const stop = affected(state, (value, prop) => {
    console.log("changed:", prop, value[prop as keyof typeof value]);
});
state.count = 1;
stop?.();
```

## Features

- Non-intrusive subscriptions (disposer from `affected`).
- `observe` adapts `Set` / `Map` so iteration changes notify.
- Primitive refs with coercion (`numberRef`, `stringRef`, `booleanRef`).
- `computed` / `derivate` / `conditional` / `propRef`.
- `bindBy` / `assign` / `link` for shape sync.
- `safe()` for JSON (cycles, WeakRef).

## Primitive refs

```ts
import { numberRef, stringRef, booleanRef, autoRef, promised } from "@fest-lib/object";

const n = numberRef(0);
const s = stringRef("hello");
const b = booleanRef(false);
n.value++;
s.value = `${s}!`;
b.value = 1;                    // truthy → true

const later = promised(fetch("/api").then((r) => r.status));
```

`autoRef(true)` / `autoRef(42)` / `autoRef("hi")` pick the matching primitive ref.

## Collections

```ts
const list = observe([1, 2, 3]);
const bag = observe(new Set(["a", "b"]));
const map = observe(new Map([["x", 1]]));

affected(list, (_v, prop) => console.log("list", prop));
affected([observe({ name: "Ada" }), "name"], (v) => console.log("name:", v));
```

`observableBySet` / `observableByMap` expose a reactive array view. `iterated` subscribes to iteration.

## Derived & bind

```ts
const source = observe({ x: 1, y: 2 });
const total = computed(source, (s) => s.x + s.y);
const view = derivate(source, (s) => ({ sum: s.x + s.y }));

const target = { x: 0, y: 0 };
bindBy(target, source);         // two-way by shape
source.x = 3;                   // target.x === 3
```

```ts
const cond = booleanRef(true);
const pick = conditional(cond, "yes", "no");
cond.value = false;             // pick.value === "no"

const obj = observe({ nested: { value: 42 } });
const deep = propRef(obj, "nested.value");
```

## API map

| Group | Exports |
| --- | --- |
| Reactivity | `observe`, `affected`, `isObservable`, `recoverReactive`, `makeArrayObservable` |
| Refs | `ref`, `numberRef`, `stringRef`, `booleanRef`, `autoRef`, `promised`, `propRef` |
| Derived | `computed`, `derivate`, `conditional`, `remap`, `unified` |
| Bind | `bindBy`, `assign`, `link` |
| Collections | `observableBySet`, `observableByMap`, `iterated` |
| Timing | `triggerWithDelay`, `delayedBehavior`, `delayedOrInstantBehavior` |
| Utils | `safe`, `deref`, `unwrap`, `unaffected` |
| Legacy | `createReactive`, `createReactiveMap`, `createReactiveSet` (deprecated) |

`affected(obj, cb)` or `affected([obj, key], cb)` → unsubscribe function. Keep it and call it.

Sources: `src/core/Mainline.ts` (subscribe), `Primitives.ts`, `Assigned.ts`, `Subscript.ts`, `src/wrap/*`.

## Workspace

```bash
cd modules/projects/object.ts
npm test                 # node + deno + browser
npm run build
npm run publish
```

License: [MIT](LICENSE).
