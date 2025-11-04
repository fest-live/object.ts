**@fest/object v0.0.0**
## @fest/object — Usage & Examples

### Install

```bash
npm i @fest/object
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
} from "@fest/object";
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

# @fest/object v0.0.0

## Modules

- [core/$Broken](core/$Broken/README.md)
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
