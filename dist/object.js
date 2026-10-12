import { $avoidTrigger as fe, $getValue as Ke, $triggerLock as Oe, Promised as je, bindCtx as q, callByAllProp as Ze, callByProp as dt, defaultByType as ht, hasValue as V, isArrayInvalidKey as re, isKeyType as j, isNotEqual as O, isPrimitive as T, isPromise as k, makeTriggerLess as pe, objectAssign as ye, objectAssignNotEqual as vt, potentiallyAsync as ke, potentiallyAsyncMap as Ge, resolved as Te, tryParseByHint as C } from "@fest-lib/core";
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var d = /* @__PURE__ */ Symbol.for("@value"), w = /* @__PURE__ */ Symbol.for("@extract"), D = /* @__PURE__ */ Symbol.for("@origin"), ne = /* @__PURE__ */ Symbol.for("@registry"), U = /* @__PURE__ */ Symbol.for("@behavior"), W = /* @__PURE__ */ Symbol.for("@promise"), Le = /* @__PURE__ */ Symbol.for("@resolved"), be = /* @__PURE__ */ Symbol.for("@trigger-less"), h = /* @__PURE__ */ Symbol.for("@trigger-lock"), pt = /* @__PURE__ */ Symbol.for("@trigger-control"), M = /* @__PURE__ */ Symbol.for("@trigger"), le = /* @__PURE__ */ Symbol.for("@subscribe"), bt = /* @__PURE__ */ Symbol.for("@isNotEqual"), ae = /* @__PURE__ */ Symbol.for("@realProp"), Fe = /* @__PURE__ */ new WeakMap(), oe = (e) => {
  const t = typeof e == "object" || typeof e == "function" ? e?.[w] ?? e : e, r = (n) => oe(n);
  return Array.isArray(t) ? t?.map?.(r) || Array.from(t || [])?.map?.(r) || [] : t instanceof Map || t instanceof WeakMap ? new Map(Array.from(t?.entries?.() || [])?.map?.(([n, l]) => [n, oe(l)])) : t instanceof Set || t instanceof WeakSet ? new Set(Array.from(t?.values?.() || [])?.map?.(r)) : t != null && typeof t == "function" || typeof t == "object" ? Object.fromEntries(Array.from(Object.entries(t || {}) || [])?.filter?.(([n]) => n != w && n != D && n != ne)?.map?.(([n, l]) => [n, oe(l)])) : t;
}, St = (e) => e?.[w] ?? e?.["@target"] ?? e, N = (e, t = !1) => {
  const r = e;
  if (T(e) || typeof e == "symbol") return e;
  if (e != null && (e instanceof WeakRef || "deref" in e && typeof e?.deref == "function") && (e = e?.deref?.()), e != null && (typeof e == "object" || typeof e == "function")) {
    e = St(e);
    const n = t && V(e) && e?.value;
    if (n != null && (typeof n == "object" || typeof n == "function") && (e = n), r != e) return N(e, t);
  }
  return e;
}, ce = (e) => e != null && typeof e.then == "function", mt = (e, t) => T(e) || typeof e == "function" ? t?.(e) : ce(e) ? e.then(t) : typeof e?.resolved == "function" ? Promise.resolve(e.resolved()).then(t) : e?.promise && ce(e.promise) ? e.promise.then(t) : e?.[W] && ce(e[W]) ? e[W].then(t) : t?.(e), He = /* @__PURE__ */ new WeakMap(), gt = new FinalizationRegistry((e) => {
  e?.forEach?.((t) => t?.());
});
function E(e, t, r) {
  if (!(!r || typeof r != "function" || typeof e != "object" && typeof e != "function"))
    if (t == Symbol.dispose) {
      const n = e?.[w] ?? e;
      He?.getOrInsertComputed?.(n, () => {
        const l = /* @__PURE__ */ new Set();
        return (typeof n == "object" || typeof n == "function") && (gt.register(n, l), He.set(n, l), n[Symbol.dispose] ??= () => l.forEach((s) => {
          s?.();
        })), l;
      })?.add?.(r);
    } else e[t] = function(...n) {
      const l = e?.[t];
      typeof l == "function" && l.apply(this, n), r.apply(this, n);
    };
}
var Z = (e) => {
  if (typeof e != "string" || e === "") return !1;
  const t = Number(e);
  return Number.isInteger(t) && t >= 0 && String(t) === e;
};
function dr(e = [], t = {}) {
  let r = /* @__PURE__ */ new Set();
  const n = (i, f, o) => {
    t.onDuplicate?.({
      value: i,
      via: f,
      index: o
    });
  };
  if (e instanceof Set) r = e;
  else for (const i of e) {
    if (r.has(i)) {
      n(i, "push");
      continue;
    }
    r.add(i);
  }
  const l = () => Array.from(r), s = (i) => {
    r.clear();
    for (const f of i) r.add(f);
  }, u = {
    push: (...i) => {
      let f = r.size;
      for (const o of i) {
        if (r.has(o)) {
          n(o, "push");
          continue;
        }
        r.add(o), f++;
      }
      return f;
    },
    pop: () => {
      const i = l();
      if (!i.length) return;
      const f = i[i.length - 1];
      return r.delete(f), f;
    },
    shift: () => {
      const i = r.values().next();
      if (i.done) return;
      const f = i.value;
      return r.delete(f), f;
    },
    unshift: (...i) => {
      if (!i.length) return r.size;
      const f = l(), o = [];
      for (const a of i) {
        if (f.includes(a) || o.includes(a)) {
          n(a, "unshift", 0);
          continue;
        }
        o.push(a);
      }
      if (!o.length) return f.length;
      const c = [...o, ...f];
      return s(c), c.length;
    },
    splice: (i, f, ...o) => {
      const c = l(), a = Math.min(Math.max(i, 0), c.length), v = f === void 0 ? c.length - a : Math.max(0, Math.min(f, c.length - a)), S = c.splice(a, v);
      let b = a;
      for (const A of o) {
        if (c.includes(A)) {
          n(A, "splice", b);
          continue;
        }
        c.splice(b++, 0, A);
      }
      return s(c), S;
    },
    includes: (i) => r.has(i),
    indexOf: (i) => l().indexOf(i),
    clear: () => {
      r.clear();
    },
    delete: (i) => r.delete(i),
    toArray: () => l(),
    toSet: () => new Set(r),
    [Symbol.iterator]: () => r[Symbol.iterator]()
  };
  return new Proxy(u, {
    get: (i, f) => {
      if (f === "length") return r.size;
      if (Z(f)) return l()[Number(f)];
      const o = u[f];
      return o;
    },
    set: (i, f, o) => {
      if (f === "length") {
        if (typeof o != "number" || !Number.isFinite(o) || o < 0) throw new RangeError("length must be a finite non-negative number");
        const c = Math.floor(o);
        if (c >= r.size) return !0;
        const a = l().slice(0, c);
        return s(a), !0;
      }
      if (Z(f)) {
        const c = l(), a = Number(f);
        if (a > c.length) return !0;
        const v = o;
        if (a < c.length) {
          const S = c[a];
          if (Object.is(S, v)) return !0;
          if (c.some((b, A) => A !== a && Object.is(b, v)))
            return n(v, "set", a), !0;
          c[a] = v;
        } else {
          if (c.includes(v))
            return n(v, "set", a), !0;
          c.push(v);
        }
        return s(c), !0;
      }
      return Reflect.set(u, f, o);
    },
    deleteProperty: (i, f) => {
      if (f === "length") return !1;
      if (Z(f)) {
        const o = l(), c = Number(f);
        return c >= o.length || (o.splice(c, 1), s(o)), !0;
      }
      return Reflect.deleteProperty(u, f);
    },
    ownKeys: () => {
      const i = [];
      let f = 0;
      for (const o of r) i.push(String(f++));
      return i.push("length"), i;
    },
    getOwnPropertyDescriptor: (i, f) => {
      if (f === "length") return {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: r.size
      };
      if (Z(f)) {
        const o = l(), c = Number(f);
        return c >= o.length ? void 0 : {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          value: o[c]
        };
      }
      return Reflect.getOwnPropertyDescriptor(u, f);
    },
    has: (i, f) => {
      if (f === "length") return !0;
      if (Z(f)) {
        const o = Number(f);
        return o >= 0 && o < r.size;
      }
      return f in u;
    }
  });
}
var wt = class {
  constructor() {
  }
  deleteProperty(e, t) {
    return Reflect.deleteProperty(e, t);
  }
  construct(e, t, r) {
    return Reflect.construct(e, t, r);
  }
  apply(e, t, r) {
    return Reflect.apply(e, t, r);
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  set(e, t, r) {
    return ye(e, r, t), !0;
  }
  get(e, t, r) {
    return typeof t == "symbol" ? e?.[t] ?? e : Reflect.get(e, t, r);
  }
}, hr = (e) => {
  if (e?.[D] || Fe.has(e)) return e;
  const t = new Proxy(e, new wt());
  return Fe.set(t, e), t;
}, et = /* @__PURE__ */ Symbol.for("object.ts@withUnsub");
globalThis[et] ??= /* @__PURE__ */ new WeakMap();
var At = globalThis[et], Ot = (e, t, r) => At.getOrInsert(e, () => {
  const n = t?.deref?.();
  n?.affected?.(r);
  const l = e?.complete?.bind?.(e), s = () => {
    const u = l?.();
    return n?.unaffected?.(r), u;
  };
  return e.complete = s, {
    unaffected: s,
    [Symbol.dispose]: s,
    [Symbol.asyncDispose]: s
  };
}), tt = /* @__PURE__ */ Symbol.for("object.ts@subscriptRegistry");
globalThis[tt] ??= /* @__PURE__ */ new WeakMap();
var m = globalThis[tt] ??= /* @__PURE__ */ new WeakMap(), rt = /* @__PURE__ */ Symbol.for("object.ts@globalEffectListeners");
globalThis[rt] ??= /* @__PURE__ */ new Map();
var de = globalThis[rt], qe = (e, t = ["*"]) => {
  if (e == null || typeof e != "function") return;
  const r = ft(t);
  return de.set(e, r.affectTypes), () => de.delete(e);
}, nt = /* @__PURE__ */ Symbol.for("object.ts@wrapped");
globalThis[nt] ??= /* @__PURE__ */ new WeakMap();
var Tt = globalThis[nt], xt = (e, t) => {
  const r = e?.[w] ?? e;
  let n = m.get(r);
  return n ? n.bindSource(r) : (n = new It(r), m.set(r, n)), t;
}, se = (e, t) => (e = N(e?.[w] ?? e), typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || e == null ? e : Tt.getOrInsertComputed(e, () => new Proxy(e, xt(e, t)))), L = /* @__PURE__ */ Symbol.for("@allProps"), lt = /* @__PURE__ */ new Set(["*", "all"]), $e = /* @__PURE__ */ new Map([
  ["set", ["setter", "@set"]],
  ["add", ["@add"]],
  ["delete", ["@delete"]],
  ["invalidate", ["@invalidate"]],
  ["manual", ["@manual"]],
  ["custom", ["@custom"]],
  ["resolved", ["@resolved"]],
  ["setAll", ["@setAll"]],
  ["addAll", ["@addAll"]],
  ["deleteAll", ["@deleteAll", "@clear"]]
]), it = /* @__PURE__ */ Symbol.for("object.ts@triggerCanonicalNames");
globalThis[it] ??= new Map(Array.from($e.entries()).flatMap(([e, t]) => t.map((r) => [r, e])));
var Rt = globalThis[it], ie = (e = "set") => {
  if (e == null) return e;
  const t = String(e || "set");
  return Rt.get(t) ?? t;
}, ut = (e) => {
  const t = e == null ? "all" : String(ie(e) ?? "all");
  return [t, ...$e.get(t) ?? []];
}, Ue = (e = ["*"]) => new Set([...X(e)].flatMap((t) => [t, ...$e.get(t) ?? []])), X = (e = ["*"]) => {
  const t = typeof e == "string" ? [e] : Array.from(e ?? ["*"]), r = new Set(t.map((n) => {
    const l = String(n || "*");
    return lt.has(l) ? l : String(ie(l) ?? l);
  }));
  return r.size ? r : /* @__PURE__ */ new Set(["*"]);
}, Q = (e, t) => {
  const r = e instanceof Set ? e : X(e);
  return [...lt].some((n) => r.has(n)) || ut(t).some((n) => r.has(n));
}, st = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), Se = (e = ["*"]) => {
  if (st(e)) return {
    affectTypes: X(e.affectTypes ?? e.triggers ?? ["*"]),
    triggerImmediately: e.triggerImmediately !== !1
  };
  const t = X(e);
  return {
    affectTypes: t,
    triggerImmediately: Q(t, "initial")
  };
}, ft = (e = ["*"]) => st(e) ? {
  affectTypes: X(e.affectTypes ?? e.triggers ?? ["*"]),
  triggerImmediately: e.triggerImmediately === !0
} : {
  affectTypes: X(e),
  triggerImmediately: !1
}, ot = /* @__PURE__ */ Symbol.for("object.ts@Subscript");
globalThis[ot] ??= class {
  compatible;
  #r;
  #e;
  #t = /* @__PURE__ */ new WeakSet();
  #f;
  #o;
  #i = /* @__PURE__ */ new Set();
  #n = /* @__PURE__ */ new Set();
  #c;
  #y = /* @__PURE__ */ new Map();
  #l = /* @__PURE__ */ new Map();
  #u = !1;
  constructor(t) {
    this.#r = t, this.#e = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new WeakSet(), this.#c = {
      enable: (l = ["*"], s) => s ? this.withTriggers(l, !0, s) : this.setTriggersEnabled(l, !0),
      disable: (l = ["*"], s) => s ? this.withTriggers(l, !1, s) : this.setTriggersEnabled(l, !1),
      set: (l, s) => this.setTriggersEnabled(l, s),
      with: (l, s) => this.withTriggers(l, !0, s),
      without: (l, s) => this.withTriggers(l, !1, s),
      isEnabled: (l) => this.isTriggerEnabled(l)
    }, this.#o = { next: (l) => {
      l && (Array.isArray(l) ? this.#s(...l) : this.#s(l));
    } };
    const r = new WeakRef(this), n = function(l) {
      const s = l?.next?.bind?.(l);
      return Ot(l, r, s);
    };
    this.#f = typeof Observable < "u" ? new Observable(n) : null, this.compatible = () => this.#f;
  }
  bindSource(t) {
    return this.#r ??= t, this;
  }
  $safeExec(t, ...r) {
    if (!(!t || this.#t.has(t))) {
      this.#t.add(t);
      try {
        const n = t(...r);
        if (n && typeof n.then == "function") {
          n.catch(console.warn);
          return;
        }
        return n;
      } catch (n) {
        console.warn(n);
      } finally {
        this.#t.delete(t);
      }
    }
  }
  #s(t, r = null, n, l = "all", ...s) {
    l = ie(l) ?? l;
    const u = this.#e;
    if (u?.size)
      for (const [i, f] of u.entries()) (f.prop === t || f.prop === L || f.prop === null) && Q(f.triggers, l) && this.$safeExec(i, r, t, n, l, ...s);
    if (de.size) {
      const i = {
        source: this.#r,
        target: this.#r,
        value: r,
        prop: t,
        name: t,
        oldValue: n,
        trigger: l,
        args: s
      };
      for (const [f, o] of de.entries()) Q(o, l) && this.$safeExec(f, i);
    }
  }
  wrap(t) {
    return Array.isArray(t) ? se(t, this) : t;
  }
  get triggerControl() {
    return this.#c;
  }
  isTriggerEnabled(t) {
    return !Q(this.#n, "all") && !ut(t).some((r) => this.#n.has(r));
  }
  setTriggersEnabled(t = ["*"], r = !0) {
    const n = Ue(t);
    for (const l of n) r ? this.#n.delete(l) : this.#n.add(l);
  }
  withTriggers(t, r, n) {
    const l = [...Ue(t)], s = new Map(l.map((i) => [i, this.#n.has(i)])), u = () => {
      s.forEach((i, f) => {
        i ? this.#n.add(f) : this.#n.delete(f);
      });
    };
    this.setTriggersEnabled(l, r);
    try {
      const i = n?.();
      return i && typeof i.finally == "function" ? i.finally(u) : (u(), i);
    } catch (i) {
      throw u(), i;
    }
  }
  affected(t, r, n = ["*"]) {
    if (t == null || typeof t != "function") return;
    const l = Se(n);
    return this.#e.set(t, {
      prop: r || L,
      triggers: l.affectTypes
    }), () => this.unaffected(t, r || L);
  }
  unaffected(t, r) {
    if (t != null && typeof t == "function") {
      const n = this.#e, l = n?.get(t);
      if (l && (l.prop == r || r == null || r == L))
        return n.delete(t), () => this.affected(t, r || L, l.triggers);
    }
    return this.#e.clear();
  }
  trigger(t, r, n, l = "set", ...s) {
    if (typeof t == "symbol" || (l === void 0 && (l = "set"), l = ie(l) ?? l, !this.isTriggerEnabled(l))) return;
    const u = `${l ?? "all"}`;
    let i = this.#l.get(t);
    i || (i = /* @__PURE__ */ new Map(), this.#l.set(t, i)), i.set(u, [
      t,
      r,
      n,
      l,
      s
    ]), !this.#u && (this.#u = !0, queueMicrotask(() => {
      this.#u = !1;
      const f = this.#l;
      this.#l = /* @__PURE__ */ new Map();
      for (const [o, c] of f)
        if (!(o != null && this.#i.has(o))) {
          o != null && this.#i.add(o);
          try {
            for (const [, a] of c) {
              const [v, S, b, A, I] = a;
              try {
                this.#s(v, S, b, A, ...I ?? []);
              } catch (p) {
                console.warn(p);
              }
            }
          } finally {
            o != null && this.#i.delete(o);
          }
        }
    }));
  }
  get iterator() {
    return this.#o;
  }
};
var It = globalThis[ot], _e = (e) => {
  const t = N(e);
  return t?.[w] ?? t;
};
function Je(e, t = "all") {
  const r = _e(e);
  return k(r) ? Te(r, t) : k(r?.[W]) ? Te(r[W], t) : Te(r ?? e, t);
}
function ct(e, t = !1) {
  const r = ((n = "all") => {
    const l = Je(e, n);
    return t ? l.then((s) => {
      const u = _e(e), i = u?.realProp ?? (u && "value" in u ? "value" : null);
      return m.get(u)?.trigger?.(i, s, void 0, "resolved"), s;
    }) : l;
  });
  return r.all = () => r("all"), r.allSettled = () => r("settled"), r.allKeyed = () => r("all"), r.allSettledKeyed = () => r("settled"), r.try = (n, ...l) => Promise.try(n, ...l).then((s) => Je(s ?? e, "all")), r;
}
function ue(e, t, r, n) {
  const l = _e(e) ?? e;
  m.get(l)?.trigger?.(t, r, n, "resolved");
}
function Ve(e, t) {
  if (e == null || t == null) return e;
  if (Array.isArray(t))
    return t.forEach((r, n) => {
      k(r) && (e[n] = r);
    }), e;
  if (t instanceof Map) {
    for (const [r, n] of t.entries()) k(n) && e.set(r, n);
    return e;
  }
  if (t instanceof Set) return e;
  for (const r of Reflect.ownKeys(t)) {
    if (r == w || r == W || r == Le || !Object.getOwnPropertyDescriptor(t, r)?.enumerable) continue;
    const n = t[r];
    k(n) && (e[r] = n);
  }
  return e;
}
var Pt = /* @__PURE__ */ Symbol.for("object.ts@__safeGetGuard"), Et = /* @__PURE__ */ new Set([
  Symbol.toStringTag,
  Symbol.iterator,
  Symbol.asyncIterator,
  Symbol.toPrimitive,
  "toString",
  "valueOf",
  "inspect",
  "constructor",
  "__proto__",
  "prototype",
  "then",
  "catch",
  "finally",
  "next"
]), ee = (e, t) => {
  if (!Et.has(t)) return null;
  const r = y(e, t);
  return typeof r == "function" ? q(e, r) : r;
}, x = globalThis[Pt] ??= /* @__PURE__ */ new WeakMap();
function Mt(e, t) {
  let r = !0;
  try {
    x?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), x?.get?.(e)?.has?.(t) && (r = !0), r = typeof Reflect.getOwnPropertyDescriptor(e, t)?.get == "function";
  } catch {
    r = !0;
  } finally {
    x?.get?.(e)?.delete?.(t);
  }
  return r;
}
var H = (e, t) => {
  if (T(e)) return e;
  const r = y(e, t);
  if (r == null && t != "value") {
    const n = y(e, "value");
    return n != null && !T(n) ? H(n, t) : r;
  } else if (t == "value" && r != null && !T(r) && typeof r != "function") return H(r, t) ?? r ?? e;
  return r ?? e;
}, kt = (e, t, r) => {
  if (e == null) return !1;
  let n = __safeSetGuard?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  return n?.has?.(t) ? !1 : (n?.add?.(t), Reflect.set(e, t, r));
}, y = (e, t, r) => {
  let n;
  if (e == null) return e;
  let l = x?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  if (l?.has?.(t)) return null;
  if (!Mt(e, t)) n ??= Reflect.get(e, t, r ?? e);
  else {
    l?.add?.(t);
    try {
      n = Reflect.get(e, t, r ?? e);
    } catch {
      n = void 0;
    } finally {
      l.delete(t), l?.size === 0 && x?.delete?.(e);
    }
  }
  return typeof n == "function" ? q(e, n) : n;
}, z = (e, t) => Object.prototype.hasOwnProperty.call(e, t), xe = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && (z(e, "key") || z(e, "name") || z(e, "oldValue") || z(e, "old") || z(e, "op") || z(e, "trigger") || t && z(e, "value")), G = (e, t, r) => z(e, t) ? e[t] : t == "oldValue" && z(e, "old") ? e.old : r(), me = (e, t = "manual") => ie(e.trigger ?? e.op ?? t), $t = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", he = (e) => {
  const t = y(e, ae) ?? y(e, "realProp");
  return $t(t) ? t : null;
}, Qe = (e, t) => t == "value" ? he(e) ?? t : t, _t = (e, t) => {
  const r = he(e);
  return r != null && t == r ? y(e, "value") ?? y(e, d) ?? y(e, t) : t == null ? void 0 : y(e, t);
}, ge = (e, t, r) => {
  const n = (s, u, i) => (xe(u) || (i ??= u), t(xe(s) ? s : xe(u, !0) ? {
    key: s,
    trigger: i,
    ...u
  } : {
    key: s,
    trigger: i ?? u
  })), l = e?.triggerControl;
  return l && Object.assign(n, l), n.custom = (s, u, i, f) => n({
    key: u,
    trigger: s,
    value: i,
    oldValue: f
  }), r != null && (n.resolved = ct(r, !0)), n;
}, we = (e, t, r) => {
  if (e == null || T(e)) return e;
  if (([
    "deref",
    "bind",
    "@target",
    D,
    w,
    ne
  ].indexOf(t) < 0 ? y(e, t)?.bind?.(e) : null) != null) return null;
  if ([w, D].indexOf(t) >= 0) return y(e, t) ?? e;
  if (t == d) return y(e, t) ?? y(e, "value");
  if (t == ne) return r;
  if (t == Le || t == "resolved" && !Object.prototype.hasOwnProperty.call(e, "resolved")) return ct(e);
  if (t == pt) return r?.triggerControl;
  if (t == Symbol.observable) return r?.compatible;
  if (t == Symbol.subscribe) return (n, l, s) => g(l != null ? [e, l] : e, n, s);
  if (t == Symbol.iterator || t == Symbol.asyncIterator) return y(e, t);
  if (t == Symbol.dispose) return (n) => {
    y(e, Symbol.dispose)?.(n), Pe(n != null ? [e, n] : e);
  };
  if (t == Symbol.asyncDispose) return (n) => {
    y(e, Symbol.asyncDispose)?.(n), Pe(n != null ? [e, n] : e);
  };
  if (t == Symbol.unsubscribe) return (n) => Pe(n != null ? [e, n] : e);
  if (typeof t == "symbol" && (t in e || y(e, t) != null)) return y(e, t);
}, Ae = (e, t, r) => {
  if (t == "subscribe") return r?.compatible?.[t] ?? ((n) => {
    if (typeof n == "function") return g(e, n);
    if ("next" in n && n?.next != null) {
      const l = g(e, n?.next), s = n?.complete;
      return n.complete = (...u) => (l?.(), s?.(...u)), n.complete;
    }
  });
}, Vt = class {
  #r;
  #e;
  #t;
  constructor(e, t, r) {
    this.#r = e, this.#e = t, this.#t = r;
  }
  get(e, t, r) {
    const n = ee(e, t);
    return n ?? Reflect.get(e, t, r);
  }
  apply(e, t, r) {
    let n = [], l = [], s = [], u = [...this.#e], i = -1;
    const f = Reflect.apply(e, t || this.#e, r);
    if (this.#t?.[h])
      return Array.isArray(f) ? Ee(f) : f;
    switch (this.#r) {
      case "push":
        i = u?.length, n = r;
        break;
      case "unshift":
        i = 0, n = r;
        break;
      case "pop":
        i = u?.length - 1, u.length > 0 && (l = [u[i]]);
        break;
      case "shift":
        i = 0, u.length > 0 && (l = [u[i]]);
        break;
      case "splice":
        i = r[0];
        for (let c = 0; c < Math.max(u.length, this.#e.length); c++) {
          const a = u[c], v = this.#e[c];
          v === void 0 && c >= this.#e.length ? l.push(a) : a === void 0 && c >= u.length ? s.push([
            c,
            v,
            void 0,
            !1
          ]) : O(a, v) && s.push([
            c,
            v,
            a,
            !0
          ]);
        }
        break;
      case "sort":
      case "fill":
      case "reverse":
      case "copyWithin":
        i = 0;
        for (let c = 0; c < u.length; c++) O(u[c], this.#e[c]) && s.push([
          i + c,
          this.#e[c],
          u[c],
          !0
        ]);
        break;
      case "set":
        i = r[1], s.push([
          i,
          r[0],
          u?.[i],
          i in u
        ]);
    }
    const o = m.get(this.#e);
    return n?.length == 1 ? o?.trigger?.(i, n[0], null, "add") : n?.length > 1 && (o?.trigger?.(i, n, null, "addAll"), n.forEach((c, a) => o?.trigger?.(i + a, c, null, "add"))), s?.length == 1 ? o?.trigger?.(s[0]?.[0] ?? i, s[0]?.[1], s[0]?.[2], s[0]?.[3] === !1 ? "add" : "set") : s?.length > 1 && (o?.trigger?.(i, s, u, "setAll"), s.forEach((c, a) => o?.trigger?.(c?.[0] ?? i + a, c?.[1], c?.[2], c?.[3] === !1 ? "add" : "set"))), l?.length == 1 ? o?.trigger?.(i, null, l[0], "delete") : l?.length > 1 && (o?.trigger?.(i, null, l, "deleteAll"), l.forEach((c, a) => o?.trigger?.(i + a, null, c, "delete"))), f == e ? new Proxy(f, this.#t) : Array.isArray(f) ? Ee(f) : f;
  }
}, Wt = (e, t, r, n) => {
  const l = Number.isInteger(r) && Number.isInteger(n) && n < r ? t.slice(n, r) : [];
  if (!e[h] && r !== n) {
    const s = m.get(t);
    l.length === 1 ? s?.trigger?.(n, null, l[0], "delete") : l.length > 1 && (s?.trigger?.(n, null, l, "deleteAll"), l.forEach((i, f) => s?.trigger?.(n + f, null, i, "delete")));
    const u = Number.isInteger(r) && Number.isInteger(n) && n > r ? n - r : 0;
    if (u === 1) s?.trigger?.(r, void 0, null, "add");
    else if (u > 1) {
      const i = Array(u).fill(void 0);
      s?.trigger?.(r, i, null, "addAll"), i.forEach((f, o) => s?.trigger?.(r + o, void 0, null, "add"));
    }
  }
}, zt = class {
  [h];
  constructor() {
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  get(e, t, r) {
    const n = ee(e, t);
    if (n != null) return n;
    if ([
      w,
      D,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? y(e, t)?.bind?.(e) : y(e, t);
    const l = m?.get?.(e), s = we(e, t, l);
    if (s != null) return s;
    const u = Ae(e, t, l);
    if (u != null) return u;
    if (t == be) return pe.call(this, this);
    if (t == M) return ge(l, (f) => {
      const o = f.key ?? f.name ?? 0, c = G(f, "value", () => y(e, o)), a = G(f, "oldValue", () => {
      });
      return l?.trigger?.(o, c, a, me(f, "manual"));
    }, e);
    if (t == "@target" || t == w) return e;
    if (t == "x") return () => e?.x ?? e?.[0];
    if (t == "y") return () => e?.y ?? e?.[1];
    if (t == "z") return () => e?.z ?? e?.[2];
    if (t == "w") return () => e?.w ?? e?.[3];
    if (t == "r") return () => e?.r ?? e?.[0];
    if (t == "g") return () => e?.g ?? e?.[1];
    if (t == "b") return () => e?.b ?? e?.[2];
    if (t == "a") return () => e?.a ?? e?.[3];
    const i = y(e, t) ?? (t == "value" ? y(e, d) : null);
    return typeof i == "function" ? new Proxy(typeof i == "function" ? i?.bind?.(e) : i, new Vt(t, e, this)) : i;
  }
  set(e, t, r) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h && r)
      return this[h] = !!r, !0;
    if (t == h && !r)
      return delete this[h], !0;
    const n = k(r);
    return ke(r, (l) => {
      const s = y(e, t), u = [
        "x",
        "y",
        "z",
        "w"
      ], i = [
        "r",
        "g",
        "b",
        "a"
      ], f = u.indexOf(t), o = i.indexOf(t);
      let c = !1;
      return f >= 0 ? c = Reflect.set(e, f, l) : o >= 0 ? c = Reflect.set(e, o, l) : c = Reflect.set(e, t, l), t == "length" && O(s, l) && Wt(this, e, s, l), !this[h] && typeof t != "symbol" && (O(s, l) && m?.get?.(e)?.trigger?.(t, l, s, "set"), n && ue(e, t, l, s)), c;
    });
  }
  deleteProperty(e, t) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h)
      return delete this[h], !0;
    const r = y(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != "length" && t != h && typeof t != "symbol" && r != null && m.get(e)?.trigger?.(t, t, r, "delete"), n;
  }
}, Ct = class {
  [h];
  constructor() {
  }
  get(e, t, r) {
    if ([
      w,
      D,
      "@target",
      "deref",
      "then",
      "catch",
      "finally"
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? q(e, y(e, t)) : y(e, t);
    const n = m.get(e) ?? m.get(y(e, "value") ?? e), l = we(e, t, n);
    if (l != null) return l;
    y(e, t) == null && t != "value" && V(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e);
    const s = Ae(e, t, n);
    return s ?? (t == be ? pe.call(this, this) : t == M ? ge(n, (u) => {
      const i = Qe(e, u.key ?? u.name ?? he(e) ?? "value"), f = G(u, "oldValue", () => i == "value" || i == he(e) ? y(e, d) : void 0), o = G(u, "value", () => _t(e, i));
      return n?.trigger?.(i, o, f, me(u, "manual"));
    }, e) : t == Symbol.toPrimitive ? (u) => {
      const i = H(e, t);
      return y(i, t) ? y(i, t)?.(u) : T(i) ? C(i, u) : T(y(i, "value")) ? C(y(i, "value"), u) : C(y(i, "value") ?? i, u);
    } : t == Symbol.toStringTag ? () => {
      const u = H(e, t);
      return y(u, t) ? y(u, t)?.() : T(u) ? String(u ?? "") || "" : T(y(u, "value")) ? String(y(u, "value") ?? "") || "" : String(y(u, "value") ?? u ?? "") || "";
    } : t == "toString" ? () => {
      const u = H(e, t);
      return y(u, t) ? y(u, t)?.() : y(u, Symbol.toStringTag) ? y(u, Symbol.toStringTag)?.() : T(u) ? String(u ?? "") || "" : T(y(u, "value")) ? String(y(u, "value") ?? "") || "" : String(y(u, "value") ?? u ?? "") || "";
    } : t == "valueOf" ? () => {
      const u = H(e, t);
      return y(u, t) ? y(u, t)?.() : y(u, Symbol.toPrimitive) ? y(u, Symbol.toPrimitive)?.() : T(u) ? u : T(y(u, "value")) ? y(u, "value") : y(u, "value") ?? u;
    } : typeof t == "symbol" && (t in e || y(e, t) != null) ? y(e, t) : H(e, t));
  }
  apply(e, t, r) {
    return Reflect.apply(e?.[/* @__PURE__ */ Symbol.for("@@apply")]?.bind?.(e?.[/* @__PURE__ */ Symbol.for("@@apply")] ?? e) ?? e, t, r);
  }
  ownKeys(e) {
    return Reflect.ownKeys(e);
  }
  construct(e, t, r) {
    return Reflect.construct(e, t, r);
  }
  isExtensible(e) {
    return Reflect.isExtensible(e);
  }
  getOwnPropertyDescriptor(e, t) {
    let r;
    try {
      x?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), x?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      x?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  has(e, t) {
    return t in e;
  }
  set(e, t, r) {
    const n = ee(e, t);
    return n ?? ke(r, (l) => {
      const s = ee(l, t);
      if (s != null) return s;
      if (t == h && r)
        return this[h] = !!r, !0;
      if (t == h && !r)
        return delete this[h], !0;
      const u = e;
      if (y(e, t) == null && t != "value" && V(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e), typeof t == "symbol" && !(y(e, t) != null && t in e)) return;
      const i = Qe(e, t), f = t == "value" ? y(e, d) ?? y(e, t) : y(e, t);
      e[t] = l;
      const o = y(e, t) ?? l;
      if (!this[h] && typeof t != "symbol") {
        const c = m.get(e) ?? m.get(u);
        (y(e, bt) ?? O)?.(f, o) && c?.trigger?.(i, l, f), k(r) && ue(u, i, l, f);
      }
      return !0;
    });
  }
  defineProperty(e, t, r) {
    const n = ee(e, t);
    if (n != null) return n;
    if (t == h && r.value)
      return this[h] = !!r.value, !0;
    if (t == h && !r.value)
      return delete this[h], !0;
    if (y(e, t) == null && t != "value" && V(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e), r.get == null && r.set == null) return Reflect.defineProperty(e, t, r);
    const l = y(e, t), s = Reflect.defineProperty(e, t, {
      get: r.get,
      set: r.set,
      enumerable: r.enumerable ?? !0,
      configurable: r.configurable ?? !0
    });
    return kt(e, t, l), s;
  }
  deleteProperty(e, t) {
    if (t == h)
      return delete this[h], !0;
    y(e, t) == null && t != "value" && V(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e);
    const r = y(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != h && typeof t != "symbol" && m.get(e)?.trigger?.(t, null, r, "delete"), n;
  }
}, Nt = class {
  [h];
  constructor() {
  }
  get(e, t, r) {
    if ([
      w,
      D,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? q(e, y(e, t)) : y(e, t);
    const n = m.get(e), l = we(e, t, n);
    if (l != null) return l;
    const s = Ae(e, t, n);
    if (s != null) return s;
    e = y(e, w) ?? y(e, D) ?? e;
    const u = q(e, y(e, t));
    if (typeof t == "symbol" && (t in e || y(e, t) != null)) return u;
    if (t == be) return pe.call(this, this);
    if (t == M) return ge(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = G(i, "value", () => e.get(f));
      if (o == null && !z(i, "value")) return;
      const c = G(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, c, me(i, "manual"));
    }, e);
    if (t == "clear") return () => {
      const i = Array.from(e?.entries?.() || []), f = u();
      return i.forEach(([o, c]) => {
        this[h] || m.get(e)?.trigger?.(o, null, c, "delete");
      }), f;
    };
    if (t == "delete") return (i, f = null) => {
      const o = e.has(i), c = e.get(i), a = u(i);
      return !this[h] && o && m.get(e)?.trigger?.(i, null, c, "delete"), a;
    };
    if (t == "set") return (i, f) => Ge(f, (o) => {
      const c = e.has(i), a = e.get(i), v = u(i, o);
      return this[h] || ((!c || O(a, o)) && m.get(e)?.trigger?.(i, o, c ? a : null, c ? "set" : "add"), k(f) && ue(e, i, o, a)), v;
    });
    if (t == "getOrInsert" || t == "getOrInsertComputed") {
      const i = t == "getOrInsertComputed";
      return (f, o) => {
        if (e.has(f)) return e.get(f);
        const c = i && typeof o == "function" ? o(f) : o;
        return Ge(c, (a) => {
          const v = typeof e.getOrInsert == "function" ? e.getOrInsert(f, a) : (e.set(f, a), e.get(f));
          return this[h] || (m.get(e)?.trigger?.(f, a, null, "add"), k(c) && ue(e, f, a, null)), v;
        });
      };
    }
    return u;
  }
  set(e, t, r) {
    return t == h ? (this[h] = !!r, !0) : t == h && !r ? (delete this[h], !0) : Reflect.set(e, t, r);
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  apply(e, t, r) {
    return Reflect.apply(e, t, r);
  }
  construct(e, t, r) {
    return Reflect.construct(e, t, r);
  }
  ownKeys(e) {
    return Reflect.ownKeys(e);
  }
  isExtensible(e) {
    return Reflect.isExtensible(e);
  }
  getOwnPropertyDescriptor(e, t) {
    let r;
    try {
      x?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), x?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      x?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  deleteProperty(e, t) {
    return t == h ? (delete this[h], !0) : Reflect.deleteProperty(e, t);
  }
}, Dt = class {
  [h] = !1;
  constructor() {
  }
  get(e, t, r) {
    if ([
      w,
      D,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? q(e, y(e, t)) : y(e, t);
    const n = m.get(e), l = we(e, t, n);
    if (l != null) return l;
    const s = Ae(e, t, n);
    if (s != null) return s;
    e = y(e, w) ?? y(e, D) ?? e;
    const u = q(e, y(e, t));
    return typeof t == "symbol" && (t in e || y(e, t) != null) ? u : t == be ? pe.call(this, this) : t == M ? ge(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = G(i, "value", () => e.has(f)), c = G(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, c, me(i, "manual"));
    }, e) : t == "clear" ? () => {
      const i = Array.from(e?.values?.() || []), f = u();
      return i.forEach((o) => {
        this[h] || m.get(e)?.trigger?.(null, null, o, "delete");
      }), f;
    } : t == "delete" ? (i) => {
      const f = e.has(i), o = f ? i : null, c = u(i);
      return !this[h] && f && m.get(e)?.trigger?.(i, null, o, "delete"), c;
    } : t == "add" ? (i) => ke(i, (f) => {
      const o = e.has(f), c = o ? f : null, a = u(f);
      return this[h] || (o || m.get(e)?.trigger?.(f, f, c, "add"), k(i) && ue(e, f, f, c)), a;
    }) : u;
  }
  set(e, t, r) {
    return t == h && r ? (this[h] = !!r, !0) : t == h && !r ? (delete this[h], !0) : Reflect.set(e, t, r);
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  apply(e, t, r) {
    return Reflect.apply(e, t, r);
  }
  construct(e, t, r) {
    return Reflect.construct(e, t, r);
  }
  ownKeys(e) {
    return Reflect.ownKeys(e);
  }
  isExtensible(e) {
    return Reflect.isExtensible(e);
  }
  getOwnPropertyDescriptor(e, t) {
    let r;
    try {
      x?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), x?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      x?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  deleteProperty(e, t) {
    return t == h ? (delete this[h], !0) : Reflect.deleteProperty(e, t);
  }
}, Y = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[le])), Ee = (e) => Y(e) ? e : Ve(se(e, new zt()), e), Bt = (e) => Y(e) ? e : Ve(se(e, new Ct()), e), Kt = (e) => Y(e) ? e : Ve(se(e, new Nt()), e), jt = (e) => Y(e) ? e : se(e, new Dt()), Gt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = R({
    [W]: r ? e : null,
    [d]: r ? 0 : Number(N(e) || 0) || 0,
    [U]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return C((typeof this?.[d] != "object" ? this?.[d] : this?.[d]?.value || 0) ?? 0, l);
    },
    set value(l) {
      this[d] = (l != null && !Number.isNaN(l) ? Number(l) : this[d]) || 0;
    },
    get value() {
      return Number(this[d] || 0) || 0;
    }
  });
  return e?.then?.((l) => {
    n.value = l, n[M]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Ft = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = R({
    [W]: r ? e : null,
    [d]: (r ? "" : String(N(typeof e == "number" ? String(e) : e || ""))) ?? "",
    [U]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") ?? "";
    },
    [Symbol?.toPrimitive](l) {
      return C(this?.[d] ?? "", l);
    },
    set value(l) {
      this[d] = String(typeof l == "number" ? String(l) : l || "") ?? "";
    },
    get value() {
      return String(this[d] ?? "") ?? "";
    }
  });
  return e?.then?.((l) => {
    n.value = l, n[M]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Ht = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = R({
    [W]: r ? e : null,
    [d]: (r ? !1 : (N(e) != null ? typeof N(e) == "string" ? !0 : !!N(e) : !1) || !1) || !1,
    [U]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return C(!!this?.[d] || !1, l);
    },
    set value(l) {
      this[d] = (l != null ? typeof l == "string" ? !0 : !!l : this[d]) || !1;
    },
    get value() {
      return this[d] || !1;
    }
  });
  return e?.then?.((l) => {
    n.value = l, n[M]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Xe = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = R({
    [W]: r ? e : null,
    [U]: t,
    [Symbol?.toStringTag]() {
      return String(this.value ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return C(this.value, l);
    },
    value: r ? null : N(e)
  });
  return e?.then?.((l) => {
    n.value = l, n[M]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), g(e, (l) => {
    n?.[M]?.();
  }), n;
}, Re = (e, t) => {
  if (e == null || typeof e != "object" && typeof e != "function") return e;
  try {
    Object.defineProperty(e, ae, {
      value: t,
      writable: !0,
      configurable: !0
    });
  } catch {
    try {
      e[ae] = t;
    } catch {
    }
  }
  try {
    Object.defineProperty(e, "realProp", {
      value: t,
      writable: !0,
      configurable: !0
    });
  } catch {
    try {
      e.realProp = t;
    } catch {
    }
  }
  return e;
}, qt = (e, t = "value", r, n) => {
  if (T(e) || !e) return e;
  Array.isArray(e) && e.length == 2 && e[0] != null && (e[0] instanceof Map || e[0] instanceof WeakMap || e[0] instanceof Set || e[0] instanceof WeakSet) ? ((t == null || t === "value") && (t = e[1]), e = e[0]) : Array.isArray(e) && !re(e?.[1], e) && (Array.isArray(e?.[0]) || typeof e?.[0] == "object" || typeof e?.[0] == "function") && (e = e?.[0]);
  const l = e instanceof Map || e instanceof WeakMap || typeof e?.get == "function" && typeof e?.set == "function" && (typeof e?.delete == "function" || typeof e?.remove == "function"), s = e instanceof Set || e instanceof WeakSet || typeof e?.has == "function" && typeof e?.add == "function" && (typeof e?.delete == "function" || typeof e?.remove == "function");
  if (l || s) {
    if (t == null) return;
  } else if ((t ??= Array.isArray(e) ? null : "value") == null || re(t, e)) return;
  const u = () => l ? e?.get?.(t) : s ? e?.has?.(t) ? t : null : e?.[t], i = (a) => {
    if (l) {
      const v = e;
      return O(a, v?.get?.(t)) && v?.set?.(t, a), a;
    }
    if (s) {
      const v = e, S = a ?? t;
      return S == null ? (v?.delete?.(t), S) : (v?.has?.(S) || v?.add?.(S), S);
    }
    return O(a, e?.[t]) && (e[t] = a), a;
  };
  l && r !== void 0 && !e?.has?.(t) ? e?.set?.(t, r) : s && r && !e?.has?.(t) && e?.add?.(t);
  const f = u();
  if (!s && t != null && V(f) && K(f)) return Re(Qt(f), t);
  if (!l && !s && t && typeof e?.getProperty == "function" && K(e?.getProperty?.(t))) return Re(e?.getProperty?.(t), t);
  !l && !s ? e[t] ??= r ?? e?.[t] : l && O(r ?? e?.get?.(t), e?.get?.(t)) ? e?.set?.(t, r ?? e?.get?.(t)) : s && e?.has?.(r ?? t) && e?.add?.(r ?? t);
  const o = R({
    [d]: s ? u() : u() ?? r,
    [U]: n,
    [Symbol?.toStringTag]() {
      return String(u() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return C(u(), a);
    },
    set value(a) {
      if (o[Oe] = !0, s) this[d] = i(a);
      else {
        const v = a ?? ht(u());
        this[d] = i(v);
      }
      o[Oe] = !1;
    },
    get value() {
      const a = u();
      return this[d] = a ?? this[d];
    }
  });
  Re(o, t);
  const c = g(e, (a, v, S, b) => {
    if (v != t || o[Oe]) return;
    const A = s ? u() : a, I = o[d];
    o[d] = A, o[M]?.({
      key: "value",
      value: A,
      oldValue: S ?? I,
      trigger: b ?? "set"
    });
  });
  return E(o, Symbol.dispose, c), o;
}, Ut = (e, t) => {
  switch (typeof e) {
    case "boolean":
      return Ht(e, t);
    case "number":
      return Gt(e, t);
    case "string":
      return Ft(e, t);
    case "object":
      if (e != null) return Xe(R(e), t);
    default:
      return Xe(e, t);
  }
}, Jt = (e, t = "value", r) => {
  const n = K(e) ? e : Ut(e, r);
  return t != null ? qt(n, t, r) : n;
}, pr = (e, t) => Jt(e, t), We = (e, t, r = 100) => {
  if (e?.value ?? e) return setTimeout(() => {
    e.value && t?.();
  }, r);
}, br = (e = 100) => (t, [r], [n]) => {
  let l = We(r, t, e);
  n?.addEventListener?.("abort", () => {
    l && clearTimeout(l);
  }, { once: !0 });
}, Sr = (e = 100) => (t, [r], [n]) => {
  let l = We(r, t, e);
  n?.addEventListener?.("abort", () => {
    l && clearTimeout(l);
  }, { once: !0 }), l || t?.();
};
function R(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || Y(e) || (e = N?.(e)) == null || e instanceof Promise || e instanceof WeakRef || Y(e)) return e;
  const r = e;
  if (r == null || typeof r == "symbol" || !(typeof r == "object" || typeof r == "function") || r instanceof Promise || r instanceof WeakRef) return r;
  let n = r;
  return Array.isArray(r) ? (n = Ee(r), n) : r instanceof Map ? (n = Kt(r), n) : r instanceof Set ? (n = jt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = Bt(r)), n);
}
var K = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[le] || m?.has?.(e))), Qt = (e) => K(e) ? R(e) : null, mr = (e) => {
  if (e == null || typeof e != "object" && typeof e != "function" || e?.[Symbol.observable] != null) return e;
  try {
    e[Symbol.observable] = self?.compatible;
  } catch {
    console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks");
  }
  return e[le] = (t, r, n) => {
    const l = e?.[Symbol?.observable];
    return l?.()?.affected?.(t, r, n), () => l?.()?.unaffected?.(t, r);
  }, e;
}, J = /* @__PURE__ */ new WeakMap(), ze = (e) => {
  if (!(typeof e == "symbol" || e == null || !(typeof e == "object" || typeof e == "function")))
    return e;
}, ve = "initial", Ce = (e) => {
  const t = e?.[ae] ?? e?.realProp;
  return j(t) ? t : null;
}, Ne = (e, t) => {
  const r = Ce(e);
  return r != null && (t == null || t == "value") ? r : t;
}, Xt = (e, t) => t != null && t == Ce(e) ? e?.value : e?.[t], Me = (e, t, r, n) => {
  if (t != null && t == Ce(e)) {
    const l = Xt(e, t);
    if (l != null) return r?.(l, t, null, "set");
  }
  return dt(e, t, r, n);
}, yt = (e, t, r) => {
  const n = Se(t);
  if (r == ve) {
    if (!n.triggerImmediately) return;
  } else if (!Q(n.affectTypes, r)) return;
  return (l, s, u, ...i) => e?.(l, s, u, r, ...i);
}, Yt = (e, t, r, n = ["*"]) => {
  if (!e || !ze(e)) return;
  const l = t != Symbol.iterator ? Ne(e, t) : null;
  let s = e?.[ne] ?? m.get(e);
  e = e?.[w] ?? e, queueMicrotask(() => {
    const i = yt(r, n, ve);
    i && (l != null && l != Symbol.iterator ? Me(e, l, i, null) : Ze(e, i, null));
  });
  let u = s?.affected?.(r, l, n);
  return e?.[Symbol.dispose] || (E(u, Symbol.dispose, u), E(u, Symbol.asyncDispose, u), E(e, Symbol.dispose, u), E(e, Symbol.asyncDispose, u)), u;
}, Zt = (e, t, r, n = ["*"]) => {
  const l = Se(n).affectTypes, s = {};
  let u = e?.value;
  const i = (f) => {
    const o = f?.target?.value;
    Q(l, "set") && r?.(o, "value", u, "set", f), u = o;
  };
  return e?.addEventListener?.("change", i, s), () => e?.removeEventListener?.("change", i, s);
}, te = (e) => Array.isArray(e) && e?.length == 2 && ze(e?.[0]) && (j(e?.[1]) || e?.[1] == Symbol.iterator), Lt = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), er = (e) => e == null ? [] : Array.isArray(e) && !te(e) && !K(e) ? e : [e], tr = (e) => {
  if (te(e)) {
    const t = e?.[0];
    return {
      source: e,
      target: t,
      prop: Ne(t, e?.[1])
    };
  }
  return {
    source: e,
    target: e,
    prop: null
  };
}, rr = (e, t, r, n, l, s, u) => ({
  source: e,
  target: t,
  value: r,
  prop: n,
  name: n,
  oldValue: l,
  trigger: s,
  args: u
}), nr = (e, t, r, n = ["*"]) => {
  const l = j(e?.[1]) ? e?.[1] : null;
  return g(e?.[0], l, r, n);
}, lr = (e, t, r, n = ["*"]) => e?.then?.((l) => g?.(l, t, r, n))?.catch?.((l) => (console.warn(l), null)), g = (e, t, r = () => {
}, n) => {
  let l = null;
  if (typeof t == "function" ? (n = r, r = t) : l = Ne(e, t), (typeof r == "object" || Array.isArray(r)) && (n = r, r = () => {
  }), (T(e) || typeof e == "symbol") && Se(n).triggerImmediately)
    return je(globalThis?.Promise?.try?.(() => r?.(e, null, null, null, ve)));
  if (typeof e?.[le] == "function") return e?.[le]?.(r, l, n);
  if (ze(e)) {
    const s = e;
    if (J?.has?.(e = e?.[w] ?? e)) return J?.get?.(e)?.(s, l, r, n);
    if (K(s) || te(e) && K(e?.[0]))
      return ce(e) ? J?.getOrInsert?.(e, lr)?.(e, l, r, n) : te(e) ? J?.getOrInsert?.(e, nr)?.(e, l, r, n) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? J?.getOrInsert?.(e, Zt)?.(e, l, r, n) : J?.getOrInsert?.(e, Yt)?.(s, l, r, n);
    {
      const u = yt(r, n, ve);
      return u ? je(globalThis?.Promise?.try?.(() => te(e) ? Me?.(e?.[0], e?.[1], u, null) : l != null && l != Symbol.iterator ? Me?.(e, l, u, null) : Ze?.(e, u, null))) : void 0;
    }
  }
};
function ir(e, t, r) {
  if (e == null || typeof e != "function") return;
  if (Lt(t) && r === void 0) return qe(e, t);
  if (t == null) return qe(e, r);
  const n = ft(r), l = {
    affectTypes: n.affectTypes,
    triggerImmediately: n.triggerImmediately
  }, s = er(t).map((u) => {
    const i = tr(u);
    return g(i.target, i.prop, (f, o, c, a, ...v) => e(rr(i.source, i.target, f, o, c, a ?? null, v)), l);
  }).filter((u) => typeof u == "function");
  return () => s.forEach((u) => u?.());
}
function gr(e, t, r) {
  return ir(t, e, r);
}
var wr = (e) => e instanceof Set ? at(e) : e instanceof Map ? cr(e) : e, ur = class {
  #r = /* @__PURE__ */ new WeakMap();
  #e(e) {
    if (e == null || typeof e != "object" && typeof e != "function") return null;
    let t = this.#r.get(e);
    return t || (t = /* @__PURE__ */ new WeakMap(), this.#r.set(e, t)), t;
  }
  #t(e) {
    return !Array.isArray(e) || e.length !== 2 ? [null, null] : e;
  }
  hasL1(e) {
    return this.#r.has(e);
  }
  set(e, t) {
    const [r, n] = this.#t(e), l = this.#e(r);
    return !l || n == null || typeof n != "object" && typeof n != "function" ? this : (l.set(n, t), this);
  }
  get(e) {
    const [t, r] = this.#t(e);
    if (!(t == null || typeof t != "object" && typeof t != "function"))
      return this.#r.get(t)?.get(r);
  }
  has(e) {
    const [t, r] = this.#t(e);
    return t == null || typeof t != "object" && typeof t != "function" ? !1 : this.#r.get(t)?.has(r) ?? !1;
  }
  delete(e) {
    const [t, r] = this.#t(e);
    if (t == null || typeof t != "object" && typeof t != "function") return !1;
    const n = this.#r.get(t);
    return n ? n.delete(r) : !1;
  }
  deleteTop(e) {
    return e == null || typeof e != "object" && typeof e != "function" ? !1 : this.#r.delete(e);
  }
  getOrCreate(e, t) {
    const [r, n] = this.#t(e), l = this.#e(r);
    if (!l || n == null || typeof n != "object" && typeof n != "function") return t?.();
    if (l.has(n)) return l.get(n);
    const s = t();
    return l.set(n, s), s;
  }
  getOrInsert(e, t) {
    const [r, n] = this.#t(e), l = this.#e(r);
    return !l || n == null || typeof n != "object" && typeof n != "function" ? t : l.has(n) ? l.get(n) : (l.set(n, t), t);
  }
  getOrInsertComputed(e, t) {
    const [r, n] = this.#t(e), l = this.#e(r);
    if (!l || n == null || typeof n != "object" && typeof n != "function") return t?.([r, n]);
    if (l.has(n)) return l.get(n);
    const s = t([r, n]);
    return l.set(n, s), s;
  }
}, Ie = new ur();
function sr(e, t, r = ["*"]) {
  if (!e || typeof e != "object" && typeof e != "function") return;
  if (Ie.has([e, t])) return Ie.get([e, t]);
  const n = (l, s, u, i) => {
    if (s == "value") {
      const f = (u?.value ?? u)?.entries?.(), o = e?.value ?? l?.value ?? l;
      if (f) for (const [c, a] of f) {
        const v = a ?? (u?.value ?? u)?.[c] ?? null, S = o?.[c];
        v == null && S != null ? t(S, c, null, "add") : v != null && S == null ? t(null, c, v, "delete") : O(v, S) && t(S, c, v, "set");
      }
      return sr(l ?? e?.value, t, r);
    }
    return s == null ? void 0 : e[s];
  };
  return Ie.getOrInsertComputed([e, t], () => e instanceof Set ? g([at(e), Symbol.iterator], t, r) : e instanceof Map ? g(e, t, r) : V(e) ? g(e, n, r) : Array.isArray(e) && !(e?.length == 2 && j(e?.[1]) && K(e?.[0])) ? g([e, Symbol.iterator], t, r) : g(e, t, r));
}
function Pe(e, t) {
  return mt(e, (r) => {
    const n = Array.isArray(r) && r?.length == 2 && ["object", "function"].indexOf(typeof r?.[0]) >= 0 && j(r?.[1]), l = n ? r?.[1] : null;
    r = n && l != null ? r?.[0] ?? r : r;
    const s = typeof r == "object" || typeof r == "function" ? r?.[w] ?? r : r;
    (r?.[ne] ?? m.get(s))?.unaffected?.(t, l);
  });
}
var fr = (e, t, r) => (g(t, null, (n, l) => {
  ye(e, n, l, !0);
}), r?.(() => e, (n) => {
  for (const l in n) ye(t, n[l], l, !0);
}, { deep: !0 }), e), Ar = (e, t, r) => fr(t(oe(e)), e, r), Or = (e, t, r = () => "") => g(t, null, (n, l) => {
  l == r() && ye(e, n, null, !0);
}), Tr = (e = []) => {
  const t = R({ value: 0 }), r = (i) => typeof i == "function" ? i() : V(i) ? i.value : i, l = yr([t, "value"], () => e.findIndex((i) => !!r(i)), "value"), s = () => {
    t.value++;
  }, u = [];
  K(e) && u.push(g(e, s, {
    affectTypes: [
      "add",
      "set",
      "delete"
    ],
    triggerImmediately: !1
  }));
  for (const i of e) V(i) && u.push(g([i, "value"], s, {
    affectTypes: ["setter"],
    triggerImmediately: !1
  }));
  return E(l, Symbol.dispose, () => u.forEach((i) => i?.())), l;
}, or = (e, t, r, n) => {
  if (T(e)) return e ? t : r;
  const l = () => t, s = () => r, u = (o) => (o != null && (e.value = V(o) ? o?.value : o), (V(e) ? e?.value : e) ? l() : s()), i = R({
    [d]: u(),
    [U]: n,
    [Symbol?.toStringTag]() {
      return String(u() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](o) {
      return C(u() ?? this[d], o);
    },
    set value(o) {
      this[d] = u(o);
    },
    get value() {
      return this[d] = u() ?? this[d];
    }
  }), f = g([e, "value"], () => {
    const o = i?.[d], c = u();
    i[d] = c, i?.[M]?.({
      key: "value",
      value: c,
      oldValue: o,
      trigger: "manual"
    });
  });
  return E(i, Symbol.dispose, f), i;
}, xr = or, Rr = (e, t, r) => {
  r || (r = R({}));
  const n = g(e, (l, s, u) => {
    if (s == null) return;
    const i = t?.(l, s, u);
    typeof i == "object" ? vt(r, i) : O(r[s], i) && (r[s] = i);
  });
  return r && E(r, Symbol.dispose, n), r;
}, Ir = (...e) => {
  const t = R({});
  return e?.forEach?.((r) => g(r, (n, l, s) => {
    l != null && O(t[l], n) && (t[l] = n);
  })), t;
}, at = (e) => {
  const t = R([]);
  return t.push(...Array.from(e?.values?.() || [])), E(t, Symbol.dispose, g(e, (r, n, l) => {
    if (O(r, l))
      if (l == null && r != null) t.push(r);
      else if (l != null && r == null) {
        const s = t.indexOf(l);
        s >= 0 && t.splice(s, 1);
      } else {
        const s = t.indexOf(l);
        s >= 0 && O(t[s], r) && (t[s] = r);
      }
  })), t;
}, cr = (e) => {
  const t = R([]), r = Array.from(e.entries());
  return t.push(...r), E(t, Symbol.dispose, g(e, (n, l, s) => {
    if (O(n, s) || s == null && n != null || s != null && n == null)
      if (s != null && n == null) {
        let u = t.findIndex(([i, f]) => i == l);
        u < 0 && (u = t.findLastIndex(([i, f]) => s === f)), u >= 0 && t.splice(u, 1);
      } else {
        let u = t.findIndex(([i, f]) => i == l);
        u >= 0 && u < t.length ? O(t[u]?.[1], n) && (t[u] = [l, n]) : t.push([l, n]);
      }
  })), t;
}, F = /* @__PURE__ */ new WeakMap(), Ye = (e, t, r = "value") => {
  const n = typeof e?.[1] == "function" && e?.length == 2, l = typeof t?.[1] == "function" && t?.length == 2, s = l ? t?.[1] : null, u = (j(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let i = u && !n ? e?.[1] : Array.isArray(e) ? null : r;
  !u && !n && (e = [e, i]), n && (e[1] = i);
  const f = (j(t?.[1]) || t?.[1] == Symbol.iterator) && t?.length == 2;
  let o = f && !l ? t?.[1] : Array.isArray(t) ? null : r;
  if (!f && !l && (t = [t, o]), l && (t[1] = o), i == null || o == null || re(i, e?.[0]) || re(o, t?.[0])) return;
  if (!((typeof t?.[0] == "object" || typeof t?.[0] == "function") && t?.[0] != null) && !Array.isArray(e[0]))
    return fe(t, () => {
      e[0][i] = t?.[0];
    }), () => {
    };
  const c = (p, P) => {
    const $ = S?.deref?.(), _ = v?.deref?.();
    if (F?.get?.($)?.get?.(i)?.bound == _) {
      let B = null;
      const De = F?.get?.($)?.get?.(i)?.cmpfx;
      fe(_, () => {
        typeof De == "function" ? B = De?.(Ke(_) ?? p, P, null) : B = _?.[P] ?? p;
      });
      const Be = Ke(B);
      O($[i], Be) && fe(_, () => {
        $[i] = Be;
      });
    } else F?.get?.($)?.get?.(i)?.dispose?.();
  }, a = () => {
    const p = S?.deref?.(), P = F?.get?.(p), $ = P?.get?.(i);
    P?.delete?.(i), $?.unsub?.();
  }, v = t?.[0] != null && (typeof t?.[0] == "object" || typeof t?.[0] == "function") && !(t?.[0] instanceof WeakRef || typeof t?.[0]?.deref == "function") ? new WeakRef(t?.[0]) : t?.[0], S = e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function") && !(e?.[0] instanceof WeakRef || typeof e?.[0]?.deref == "function") ? new WeakRef(e?.[0]) : e?.[0];
  let b = {
    compute: c,
    dispose: a,
    cmpfx: s
  };
  const A = S?.deref?.(), I = v?.deref?.();
  return S instanceof WeakRef && (F?.get?.(A)?.get?.(i)?.bound != I && F?.get?.(A)?.delete?.(i), b = F?.getOrInsert?.(A, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(i, () => ({
    bound: I,
    cmpfx: s,
    unsub: null,
    compute: c,
    dispose: a
  })), b.unsub = g(t, c), b.cmpfx = s, E(A, Symbol.dispose, b?.dispose), E(I, Symbol.dispose, b?.dispose)), I && !Array.isArray(I) && fe(A, () => {
    I[o] ??= A?.[i] ?? I[o];
  }), b?.dispose;
}, Pr = (e, t, r = "value") => {
  const n = [Ye(e, t, r), Ye(t, e, r)];
  return () => n?.map?.((l) => l?.());
}, yr = (e, t, r, n = "value") => {
  const l = typeof e?.[1] == "function" && e?.length == 2, s = (j(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let u = s && !l ? e?.[1] : Array.isArray(e) ? null : n;
  if (!s && !l && (e = [s ? e?.[0] : e, u]), l && (e[1] = u), u == null || re(u, e?.[0])) return;
  let i, f;
  const o = (p, P) => (p ??= e?.[0]?.[u] ?? f ?? p, P || O(f, p) || i == null ? t?.(p, u, f) : i), c = (p, P = "value", $, _) => {
    if (f = $ ?? f, p ??= e?.[0]?.[u], O(f, p) || i == null) {
      let B = t?.(p, u, f, _);
      return f = p, (O(B, i) || i == null) && (b[P] = i = B, i = b[P]), B;
    }
    return b[P];
  }, a = o(e[0][u] ?? f), v = k(a), S = /* @__PURE__ */ Symbol.for("@@apply");
  Object.defineProperty(c, W, {
    value: a,
    writable: !0
  }), Object.defineProperty(c, d, {
    value: a,
    writable: !0
  }), Object.defineProperty(c, U, {
    value: r,
    writable: !0
  }), Object.defineProperty(c, Symbol?.toStringTag, {
    value: String(c[d] ?? "") || "",
    writable: !0
  }), Object.defineProperty(c, Symbol?.toPrimitive, {
    value: C(c[d], "number"),
    writable: !0
  }), Object.defineProperty(c, "value", {
    enumerable: !0,
    get: function() {
      const p = o();
      return p != null && (c[d] = p), c[d];
    },
    set: function(p) {
      c[d] = o(p, !0);
    }
  }), Object.defineProperty(c, S, {
    value: (p) => t?.(p, u, void 0),
    writable: !0
  });
  const b = R(c), A = (p, P) => {
    if (k(p)) return Promise.resolve(p).then((_) => {
      const B = b?.[d];
      return b[d] = _, b?.[M]?.({
        key: "value",
        value: _,
        oldValue: B,
        trigger: "resolved"
      }), _;
    });
    const $ = b?.[d];
    return b[d] = p, b?.[M]?.({
      key: "value",
      value: p,
      oldValue: $,
      trigger: P
    }), p;
  };
  v && A(a, "resolved");
  const I = g([e?.[0] ?? e, u ?? "value"], () => {
    A(o(), "manual");
  });
  return E(b, Symbol.dispose, I), b;
}, Er = (e, t, r = 100) => {
  let n;
  return g(e, "value", (l) => {
    !l && n ? (clearTimeout(n), n = null) : l && !n && (n = We(e, t, r) ?? n);
  });
};
export {
  le as $affected,
  Ut as $ref,
  Le as $resolved,
  M as $trigger,
  pt as $triggerControl,
  be as $triggerLess,
  h as $triggerLock,
  wt as AssignObjectHandler,
  ur as DoubleWeakMap,
  E as addToCallChain,
  g as affected,
  Ye as assign,
  F as assignMap,
  fr as bindBy,
  Or as bindByKey,
  Ht as booleanRef,
  yr as computed,
  xr as conditional,
  Tr as conditionalIndex,
  or as conditionalRef,
  br as delayedBehavior,
  Sr as delayedOrInstantBehavior,
  Er as delayedSubscribe,
  N as deref,
  Ar as derivate,
  ir as effect,
  gr as effected,
  K as isObservable,
  sr as iterated,
  Pr as link,
  wr as makeArrayObservable,
  hr as makeObjectAssignable,
  ct as makeResolvedOp,
  Gt as numberRef,
  cr as observableByMap,
  at as observableBySet,
  R as observe,
  pr as promised,
  qt as propRef,
  Qt as recoverReactive,
  Jt as ref,
  Rr as remap,
  Je as resolved,
  oe as safe,
  J as specializedSubscribe,
  Ft as stringRef,
  Yt as subscribeDirectly,
  Zt as subscribeInput,
  nr as subscribePaired,
  lr as subscribeThenable,
  We as triggerWithDelay,
  Pe as unaffected,
  Ir as unified,
  St as unwrap,
  mr as useObservable,
  Xe as wrapRef,
  dr as wrapSetAsArray
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vI3JlZ2lvbiBzcmMvd3JhcC9TeW1ib2wudHNcblN5bWJvbC5vYnNlcnZhYmxlIHx8PSBTeW1ib2wuZm9yKFwib2JzZXJ2YWJsZVwiKTtcblN5bWJvbC5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJzdWJzY3JpYmVcIik7XG5TeW1ib2wudW5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJ1bnN1YnNjcmliZVwiKTtcbnZhciAkdmFsdWUgPSBTeW1ib2wuZm9yKFwiQHZhbHVlXCIpO1xudmFyICRleHRyYWN0S2V5JCA9IFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKTtcbnZhciAkb3JpZ2luYWxLZXkkID0gU3ltYm9sLmZvcihcIkBvcmlnaW5cIik7XG52YXIgJHJlZ2lzdHJ5S2V5JCA9IFN5bWJvbC5mb3IoXCJAcmVnaXN0cnlcIik7XG52YXIgJGJlaGF2aW9yID0gU3ltYm9sLmZvcihcIkBiZWhhdmlvclwiKTtcbnZhciAkcHJvbWlzZSA9IFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKTtcbnZhciAkcmVzb2x2ZWQgPSBTeW1ib2wuZm9yKFwiQHJlc29sdmVkXCIpO1xudmFyICR0cmlnZ2VyTGVzcyA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sZXNzXCIpO1xudmFyICR0cmlnZ2VyTG9jayA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sb2NrXCIpO1xudmFyICR0cmlnZ2VyQ29udHJvbCA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpO1xudmFyICR0cmlnZ2VyID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyXCIpO1xudmFyICRhZmZlY3RlZCA9IFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpO1xudmFyICRpc05vdEVxdWFsID0gU3ltYm9sLmZvcihcIkBpc05vdEVxdWFsXCIpO1xudmFyICRyZWFsUHJvcCA9IFN5bWJvbC5mb3IoXCJAcmVhbFByb3BcIik7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy93cmFwL1V0aWxzLnRzXG52YXIgJG9yaWdpbmFsT2JqZWN0cyQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzYWZlID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldCwgbWFwcGVkID0gKGUpID0+IHNhZmUoZSk7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHJldHVybiB1bndyYXA/Lm1hcD8uKG1hcHBlZCkgfHwgQXJyYXkuZnJvbSh1bndyYXAgfHwgW10pPy5tYXA/LihtYXBwZWQpIHx8IFtdO1xuXHRlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXAgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha01hcCkgcmV0dXJuIG5ldyBNYXAoQXJyYXkuZnJvbSh1bndyYXA/LmVudHJpZXM/LigpIHx8IFtdKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrU2V0KSByZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKHVud3JhcD8udmFsdWVzPy4oKSB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkpO1xuXHRlbHNlIGlmICh1bndyYXAgIT0gbnVsbCAmJiB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyh1bndyYXAgfHwge30pIHx8IFtdKT8uZmlsdGVyPy4oKFtLXSkgPT4gSyAhPSAkZXh0cmFjdEtleSQgJiYgSyAhPSAkb3JpZ2luYWxLZXkkICYmIEsgIT0gJHJlZ2lzdHJ5S2V5JCk/Lm1hcD8uKChbSywgVl0pID0+IFtLLCBzYWZlKFYpXSkpO1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciB1bndyYXAgPSAoYXJyKSA9PiB7XG5cdHJldHVybiBhcnI/LlskZXh0cmFjdEtleSRdID8/IGFycj8uW1wiQHRhcmdldFwiXSA/PyBhcnI7XG59O1xudmFyIGRlcmVmID0gKHRhcmdldCwgZGlzY291bnRWYWx1ZSA9IGZhbHNlKSA9PiB7XG5cdGNvbnN0IG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRpZiAoaXNQcmltaXRpdmUodGFyZ2V0KSB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCBcImRlcmVmXCIgaW4gdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQ/LmRlcmVmID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9IHRhcmdldD8uZGVyZWY/LigpO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwgJiYgKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHR0YXJnZXQgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRjb25zdCAkdmFsID0gZGlzY291bnRWYWx1ZSAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHRhcmdldD8udmFsdWU7XG5cdFx0aWYgKCR2YWwgIT0gbnVsbCAmJiAodHlwZW9mICR2YWwgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgJHZhbCA9PSBcImZ1bmN0aW9uXCIpKSB0YXJnZXQgPSAkdmFsO1xuXHRcdGlmIChvcmlnaW5hbCAhPSB0YXJnZXQpIHJldHVybiBkZXJlZih0YXJnZXQsIGRpc2NvdW50VmFsdWUpO1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGlzVGhlbmFibGUgPSAodmFsKSA9PiB2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbnZhciB3aXRoUHJvbWlzZSA9ICh0YXJnZXQsIGNiKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY2I/Lih0YXJnZXQpO1xuXHRpZiAoaXNUaGVuYWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0LnRoZW4oY2IpO1xuXHRpZiAodHlwZW9mIHRhcmdldD8ucmVzb2x2ZWQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRhcmdldC5yZXNvbHZlZCgpKS50aGVuKGNiKTtcblx0aWYgKHRhcmdldD8ucHJvbWlzZSAmJiBpc1RoZW5hYmxlKHRhcmdldC5wcm9taXNlKSkgcmV0dXJuIHRhcmdldC5wcm9taXNlLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5bJHByb21pc2VdICYmIGlzVGhlbmFibGUodGFyZ2V0WyRwcm9taXNlXSkpIHJldHVybiB0YXJnZXRbJHByb21pc2VdLnRoZW4oY2IpO1xuXHRyZXR1cm4gY2I/Lih0YXJnZXQpO1xufTtcbnZhciBkaXNwb3NlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZGlzcG9zZVJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChjYWxsc3RhY2spID0+IHtcblx0Y2FsbHN0YWNrPy5mb3JFYWNoPy4oKGNiKSA9PiBjYj8uKCkpO1xufSk7XG5mdW5jdGlvbiBhZGRUb0NhbGxDaGFpbihvYmosIG1ldGhvZEtleSwgY2FsbGJhY2spIHtcblx0aWYgKCFjYWxsYmFjayB8fCB0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBvYmogIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAobWV0aG9kS2V5ID09IFN5bWJvbC5kaXNwb3NlKSB7XG5cdFx0Y29uc3QgY2hhaW5UYXJnZXQgPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iajtcblx0XHRkaXNwb3NlTWFwPy5nZXRPckluc2VydENvbXB1dGVkPy4oY2hhaW5UYXJnZXQsICgpID0+IHtcblx0XHRcdGNvbnN0IENhbGxDaGFpbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0XHRpZiAodHlwZW9mIGNoYWluVGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNoYWluVGFyZ2V0ID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRkaXNwb3NlUmVnaXN0cnkucmVnaXN0ZXIoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGRpc3Bvc2VNYXAuc2V0KGNoYWluVGFyZ2V0LCBDYWxsQ2hhaW4pO1xuXHRcdFx0XHRjaGFpblRhcmdldFtTeW1ib2wuZGlzcG9zZV0gPz89ICgpID0+IENhbGxDaGFpbi5mb3JFYWNoKChjYikgPT4ge1xuXHRcdFx0XHRcdGNiPy4oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQ2FsbENoYWluO1xuXHRcdH0pPy5hZGQ/LihjYWxsYmFjayk7XG5cdH0gZWxzZSBvYmpbbWV0aG9kS2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IG9iaj8uW21ldGhvZEtleV07XG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbCA9PSBcImZ1bmN0aW9uXCIpIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxudmFyIGlzQXJyYXlJbmRleCA9IChwcm9wKSA9PiB7XG5cdGlmICh0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuXHRpZiAocHJvcCA9PT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBudW0gPSBOdW1iZXIocHJvcCk7XG5cdHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IDAgJiYgU3RyaW5nKG51bSkgPT09IHByb3A7XG59O1xuZnVuY3Rpb24gd3JhcFNldEFzQXJyYXkoc291cmNlID0gW10sIG9wdGlvbnMgPSB7fSkge1xuXHRsZXQgYmFja2luZ1NldCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdGNvbnN0IG5vdGlmeUR1cGxpY2F0ZSA9ICh2YWx1ZSwgdmlhLCBpbmRleCkgPT4ge1xuXHRcdG9wdGlvbnMub25EdXBsaWNhdGU/Lih7XG5cdFx0XHR2YWx1ZSxcblx0XHRcdHZpYSxcblx0XHRcdGluZGV4XG5cdFx0fSk7XG5cdH07XG5cdGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIGJhY2tpbmdTZXQgPSBzb3VyY2U7XG5cdGVsc2UgZm9yIChjb25zdCBpdGVtIG9mIHNvdXJjZSkge1xuXHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fVxuXHRjb25zdCBzbmFwc2hvdCA9ICgpID0+IEFycmF5LmZyb20oYmFja2luZ1NldCk7XG5cdGNvbnN0IHJlYnVpbGRGcm9tID0gKGFycikgPT4ge1xuXHRcdGJhY2tpbmdTZXQuY2xlYXIoKTtcblx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSBiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fTtcblx0Y29uc3QgbWV0aG9kcyA9IHtcblx0XHRwdXNoOiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGxldCBzaXplID0gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInB1c2hcIik7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdFx0XHRcdHNpemUrKztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzaXplO1xuXHRcdH0sXG5cdFx0cG9wOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0aWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdFx0YmFja2luZ1NldC5kZWxldGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2hpZnQ6ICgpID0+IHtcblx0XHRcdGNvbnN0IGl0ZXJhdG9yID0gYmFja2luZ1NldC52YWx1ZXMoKS5uZXh0KCk7XG5cdFx0XHRpZiAoaXRlcmF0b3IuZG9uZSkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmF0b3IudmFsdWU7XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHR1bnNoaWZ0OiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Y29uc3QgY3VycmVudCA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCB0b1ByZXBlbmQgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoY3VycmVudC5pbmNsdWRlcyhpdGVtKSB8fCB0b1ByZXBlbmQuaW5jbHVkZXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJ1bnNoaWZ0XCIsIDApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvUHJlcGVuZC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0b1ByZXBlbmQubGVuZ3RoKSByZXR1cm4gY3VycmVudC5sZW5ndGg7XG5cdFx0XHRjb25zdCBuZXh0ID0gWy4uLnRvUHJlcGVuZCwgLi4uY3VycmVudF07XG5cdFx0XHRyZWJ1aWxkRnJvbShuZXh0KTtcblx0XHRcdHJldHVybiBuZXh0Lmxlbmd0aDtcblx0XHR9LFxuXHRcdHNwbGljZTogKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBub3JtYWxpemVkU3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChzdGFydCwgMCksIGFyci5sZW5ndGgpO1xuXHRcdFx0Y29uc3QgYWN0dWFsRGVsZXRlQ291bnQgPSBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gYXJyLmxlbmd0aCAtIG5vcm1hbGl6ZWRTdGFydCA6IE1hdGgubWF4KDAsIE1hdGgubWluKGRlbGV0ZUNvdW50LCBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0KSk7XG5cdFx0XHRjb25zdCByZW1vdmVkID0gYXJyLnNwbGljZShub3JtYWxpemVkU3RhcnQsIGFjdHVhbERlbGV0ZUNvdW50KTtcblx0XHRcdGxldCBpbnNlcnRQb3NpdGlvbiA9IG5vcm1hbGl6ZWRTdGFydDtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwic3BsaWNlXCIsIGluc2VydFBvc2l0aW9uKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcnIuc3BsaWNlKGluc2VydFBvc2l0aW9uKyssIDAsIGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdHJldHVybiByZW1vdmVkO1xuXHRcdH0sXG5cdFx0aW5jbHVkZXM6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5oYXModmFsdWUpLFxuXHRcdGluZGV4T2Y6ICh2YWx1ZSkgPT4gc25hcHNob3QoKS5pbmRleE9mKHZhbHVlKSxcblx0XHRjbGVhcjogKCkgPT4ge1xuXHRcdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlOiAodmFsdWUpID0+IGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKSxcblx0XHR0b0FycmF5OiAoKSA9PiBzbmFwc2hvdCgpLFxuXHRcdHRvU2V0OiAoKSA9PiBuZXcgU2V0KGJhY2tpbmdTZXQpLFxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBiYWNraW5nU2V0W1N5bWJvbC5pdGVyYXRvcl0oKVxuXHR9O1xuXHRyZXR1cm4gbmV3IFByb3h5KG1ldGhvZHMsIHtcblx0XHRnZXQ6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHJldHVybiBzbmFwc2hvdCgpW051bWJlcihwcm9wKV07XG5cdFx0XHRjb25zdCB2YWx1ZSA9IG1ldGhvZHNbcHJvcF07XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHNldDogKF8sIHByb3AsIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyXCIpO1xuXHRcdFx0XHRjb25zdCBuZXh0TGVuZ3RoID0gTWF0aC5mbG9vcih2YWx1ZSk7XG5cdFx0XHRcdGlmIChuZXh0TGVuZ3RoID49IGJhY2tpbmdTZXQuc2l6ZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCkuc2xpY2UoMCwgbmV4dExlbmd0aCk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID4gYXJyLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IG5leHRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAoaW5kZXggPCBhcnIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFZhbHVlID0gYXJyW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoT2JqZWN0LmlzKGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKGFyci5zb21lKChpdGVtLCBpZHgpID0+IGlkeCAhPT0gaW5kZXggJiYgT2JqZWN0LmlzKGl0ZW0sIG5leHRWYWx1ZSkpKSB7XG5cdFx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUobmV4dFZhbHVlLCBcInNldFwiLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YXJyW2luZGV4XSA9IG5leHRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKG5leHRWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnIucHVzaChuZXh0VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3Quc2V0KG1ldGhvZHMsIHByb3AsIHZhbHVlKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRvd25LZXlzOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gW107XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IF8gb2YgYmFja2luZ1NldCkga2V5cy5wdXNoKFN0cmluZyhpKyspKTtcblx0XHRcdGtleXMucHVzaChcImxlbmd0aFwiKTtcblx0XHRcdHJldHVybiBrZXlzO1xuXHRcdH0sXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0dmFsdWU6IGJhY2tpbmdTZXQuc2l6ZVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHZhbHVlOiBhcnJbaW5kZXhdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRoYXM6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRyZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9wIGluIG1ldGhvZHM7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3dyYXAvQXNzaWduT2JqZWN0LnRzXG52YXIgQXNzaWduT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbmFtZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ/LltuYW1lXSA/PyB0YXJnZXQ7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgY3R4KTtcblx0fVxufTtcbnZhciBtYWtlT2JqZWN0QXNzaWduYWJsZSA9IChvYmopID0+IHtcblx0aWYgKG9iaj8uWyRvcmlnaW5hbEtleSRdIHx8ICRvcmlnaW5hbE9iamVjdHMkLmhhcyhvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCBweCA9IG5ldyBQcm94eShvYmosIG5ldyBBc3NpZ25PYmplY3RIYW5kbGVyKCkpO1xuXHQkb3JpZ2luYWxPYmplY3RzJC5zZXQocHgsIG9iaik7XG5cdHJldHVybiBweDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1N1YnNjcmlwdC50c1xudmFyIHdpdGhVbnN1YlN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd2l0aFVuc3ViXCIpO1xuZ2xvYmFsVGhpc1t3aXRoVW5zdWJTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB3aXRoVW5zdWIgPSBnbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF07XG52YXIgY29tcGxldGVXaXRoVW5zdWIgPSAoc3Vic2NyaWJlciwgd2VhaywgaGFuZGxlcikgPT4ge1xuXHRyZXR1cm4gd2l0aFVuc3ViLmdldE9ySW5zZXJ0KHN1YnNjcmliZXIsICgpID0+IHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHdlYWs/LmRlcmVmPy4oKTtcblx0XHRyZWdpc3RyeT8uYWZmZWN0ZWQ/LihoYW5kbGVyKTtcblx0XHRjb25zdCBzYXZDb21wbGV0ZSA9IHN1YnNjcmliZXI/LmNvbXBsZXRlPy5iaW5kPy4oc3Vic2NyaWJlcik7XG5cdFx0Y29uc3QgdW5hZmZlY3RlZCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHIgPSBzYXZDb21wbGV0ZT8uKCk7XG5cdFx0XHRyZWdpc3RyeT8udW5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fTtcblx0XHRzdWJzY3JpYmVyLmNvbXBsZXRlID0gdW5hZmZlY3RlZDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuZGlzcG9zZV06IHVuYWZmZWN0ZWQsXG5cdFx0XHRbU3ltYm9sLmFzeW5jRGlzcG9zZV06IHVuYWZmZWN0ZWRcblx0XHR9O1xuXHR9KTtcbn07XG52YXIgc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHN1YnNjcmlwdFJlZ2lzdHJ5XCIpO1xuZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHN1YnNjcmlwdFJlZ2lzdHJ5ID0gZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAZ2xvYmFsRWZmZWN0TGlzdGVuZXJzXCIpO1xuZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVycyA9IGdsb2JhbFRoaXNbZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sXTtcbnZhciBlZmZlY3RHbG9iYWxseSA9IChjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Z2xvYmFsRWZmZWN0TGlzdGVuZXJzLnNldChjYiwgbm9ybWFsaXplZC5hZmZlY3RUeXBlcyk7XG5cdHJldHVybiAoKSA9PiBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuZGVsZXRlKGNiKTtcbn07XG52YXIgd3JhcHBlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd3JhcHBlZFwiKTtcbmdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdyYXBwZWQgPSBnbG9iYWxUaGlzW3dyYXBwZWRTeW1ib2xdO1xudmFyIHJlZ2lzdGVyID0gKHdoYXQsIGhhbmRsZSkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0O1xuXHRsZXQgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKTtcblx0aWYgKCFyZWdpc3RyeSkge1xuXHRcdHJlZ2lzdHJ5ID0gbmV3IFN1YnNjcmlwdCh1bndyYXApO1xuXHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LnNldCh1bndyYXAsIHJlZ2lzdHJ5KTtcblx0fSBlbHNlIHJlZ2lzdHJ5LmJpbmRTb3VyY2UodW53cmFwKTtcblx0cmV0dXJuIGhhbmRsZTtcbn07XG52YXIgd3JhcFdpdGggPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdHdoYXQgPSBkZXJlZih3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0KTtcblx0aWYgKHR5cGVvZiB3aGF0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2Ygd2hhdCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB3aGF0ID09IFwiZnVuY3Rpb25cIikgfHwgd2hhdCA9PSBudWxsKSByZXR1cm4gd2hhdDtcblx0cmV0dXJuIHdyYXBwZWQuZ2V0T3JJbnNlcnRDb21wdXRlZCh3aGF0LCAoKSA9PiBuZXcgUHJveHkod2hhdCwgcmVnaXN0ZXIod2hhdCwgaGFuZGxlKSkpO1xufTtcbnZhciBmb3JBbGwgPSBTeW1ib2wuZm9yKFwiQGFsbFByb3BzXCIpO1xudmFyIHdpbGRjYXJkVHJpZ2dlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCIsIFwiYWxsXCJdKTtcbnZhciB0cmlnZ2VyQWxpYXNlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKFtcblx0W1wic2V0XCIsIFtcInNldHRlclwiLCBcIkBzZXRcIl1dLFxuXHRbXCJhZGRcIiwgW1wiQGFkZFwiXV0sXG5cdFtcImRlbGV0ZVwiLCBbXCJAZGVsZXRlXCJdXSxcblx0W1wiaW52YWxpZGF0ZVwiLCBbXCJAaW52YWxpZGF0ZVwiXV0sXG5cdFtcIm1hbnVhbFwiLCBbXCJAbWFudWFsXCJdXSxcblx0W1wiY3VzdG9tXCIsIFtcIkBjdXN0b21cIl1dLFxuXHRbXCJyZXNvbHZlZFwiLCBbXCJAcmVzb2x2ZWRcIl1dLFxuXHRbXCJzZXRBbGxcIiwgW1wiQHNldEFsbFwiXV0sXG5cdFtcImFkZEFsbFwiLCBbXCJAYWRkQWxsXCJdXSxcblx0W1wiZGVsZXRlQWxsXCIsIFtcIkBkZWxldGVBbGxcIiwgXCJAY2xlYXJcIl1dXG5dKTtcbnZhciB0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHRyaWdnZXJDYW5vbmljYWxOYW1lc1wiKTtcbmdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXSA/Pz0gbmV3IE1hcChBcnJheS5mcm9tKHRyaWdnZXJBbGlhc2VzLmVudHJpZXMoKSkuZmxhdE1hcCgoW2Nhbm9uaWNhbCwgYWxpYXNlc10pID0+IGFsaWFzZXMubWFwKChhbGlhcykgPT4gW2FsaWFzLCBjYW5vbmljYWxdKSkpO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lcyA9IGdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXTtcbnZhciBub3JtYWxpemVUcmlnZ2VyTmFtZSA9ICh0cmlnZ2VyID0gXCJzZXRcIikgPT4ge1xuXHRpZiAodHJpZ2dlciA9PSBudWxsKSByZXR1cm4gdHJpZ2dlcjtcblx0Y29uc3QgbmFtZSA9IFN0cmluZyh0cmlnZ2VyIHx8IFwic2V0XCIpO1xuXHRyZXR1cm4gdHJpZ2dlckNhbm9uaWNhbE5hbWVzLmdldChuYW1lKSA/PyBuYW1lO1xufTtcbnZhciB0cmlnZ2VyTmFtZXNPZiA9ICh0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5hbWUgPSB0cmlnZ2VyID09IG51bGwgPyBcImFsbFwiIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IFwiYWxsXCIpO1xuXHRyZXR1cm4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV07XG59O1xudmFyIGV4cGFuZFRyaWdnZXJGaWx0ZXIgPSAodHlwZXMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBuZXcgU2V0KFsuLi5ub3JtYWxpemVUcmlnZ2VyRmlsdGVyKHR5cGVzKV0uZmxhdE1hcCgobmFtZSkgPT4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV0pKTtcbn07XG52YXIgbm9ybWFsaXplVHJpZ2dlckZpbHRlciA9ICh0cmlnZ2VycyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgbGlzdCA9IHR5cGVvZiB0cmlnZ2VycyA9PSBcInN0cmluZ1wiID8gW3RyaWdnZXJzXSA6IEFycmF5LmZyb20odHJpZ2dlcnMgPz8gW1wiKlwiXSk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBuZXcgU2V0KGxpc3QubWFwKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgbmFtZSA9IFN0cmluZyhpdGVtIHx8IFwiKlwiKTtcblx0XHRyZXR1cm4gd2lsZGNhcmRUcmlnZ2Vycy5oYXMobmFtZSkgPyBuYW1lIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG5hbWUpID8/IG5hbWUpO1xuXHR9KSk7XG5cdHJldHVybiBub3JtYWxpemVkLnNpemUgPyBub3JtYWxpemVkIDogLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1wiKlwiXSk7XG59O1xudmFyIHRyaWdnZXJGaWx0ZXJBbGxvd3MgPSAodHJpZ2dlcnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3QgZmlsdGVyID0gdHJpZ2dlcnMgaW5zdGFuY2VvZiBTZXQgPyB0cmlnZ2VycyA6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHJpZ2dlcnMpO1xuXHRyZXR1cm4gWy4uLndpbGRjYXJkVHJpZ2dlcnNdLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpIHx8IHRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpO1xufTtcbnZhciBpc09wdGlvbnNPYmplY3QgPSAob3B0aW9ucykgPT4ge1xuXHRyZXR1cm4gISFvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucykgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlcnNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gb3B0aW9ucyk7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ICE9PSBmYWxzZVxuXHR9O1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyk7XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiB0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcImluaXRpYWxcIilcblx0fTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0T3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ID09PSB0cnVlXG5cdH07XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9O1xufTtcbnZhciBTdWJzY3JpcHRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQFN1YnNjcmlwdFwiKTtcbmdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXSA/Pz0gY2xhc3MgU3Vic2NyaXB0IHtcblx0Y29tcGF0aWJsZTtcblx0I3NvdXJjZTtcblx0I2xpc3RlbmVycztcblx0I2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdCNuYXRpdmU7XG5cdCNpdGVyYXRvcjtcblx0I2luRGlzcGF0Y2ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjZGlzYWJsZWRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCN0cmlnZ2VyQ29udHJvbDtcblx0I3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQjcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy4jbGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHR0aGlzLiNmbGFncyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRcdHRoaXMuI3RyaWdnZXJDb250cm9sID0ge1xuXHRcdFx0ZW5hYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgdHJ1ZSwgY2IpIDogdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIHRydWUpLFxuXHRcdFx0ZGlzYWJsZTogKHR5cGVzID0gW1wiKlwiXSwgY2IpID0+IGNiID8gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIGZhbHNlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgZmFsc2UpLFxuXHRcdFx0c2V0OiAodHlwZXMsIGVuYWJsZWQpID0+IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBlbmFibGVkKSxcblx0XHRcdHdpdGg6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYiksXG5cdFx0XHR3aXRob3V0OiAodHlwZXMsIGNiKSA9PiB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSxcblx0XHRcdGlzRW5hYmxlZDogKHRyaWdnZXIpID0+IHRoaXMuaXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKVxuXHRcdH07XG5cdFx0dGhpcy4jaXRlcmF0b3IgPSB7IG5leHQ6IChhcmdzKSA9PiB7XG5cdFx0XHRpZiAoYXJncykgQXJyYXkuaXNBcnJheShhcmdzKSA/IHRoaXMuI2Rpc3BhdGNoKC4uLmFyZ3MpIDogdGhpcy4jZGlzcGF0Y2goYXJncyk7XG5cdFx0fSB9O1xuXHRcdGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZih0aGlzKTtcblx0XHRjb25zdCBjb250cm9sbGVyID0gZnVuY3Rpb24oc3Vic2NyaWJlcikge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IHN1YnNjcmliZXI/Lm5leHQ/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRcdHJldHVybiBjb21wbGV0ZVdpdGhVbnN1YihzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKTtcblx0XHR9O1xuXHRcdHRoaXMuI25hdGl2ZSA9IHR5cGVvZiBPYnNlcnZhYmxlICE9IFwidW5kZWZpbmVkXCIgPyBuZXcgT2JzZXJ2YWJsZShjb250cm9sbGVyKSA6IG51bGw7XG5cdFx0dGhpcy5jb21wYXRpYmxlID0gKCkgPT4gdGhpcy4jbmF0aXZlO1xuXHR9XG5cdGJpbmRTb3VyY2Uoc291cmNlKSB7XG5cdFx0dGhpcy4jc291cmNlID8/PSBzb3VyY2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0JHNhZmVFeGVjKGNiLCAuLi5hcmdzKSB7XG5cdFx0aWYgKCFjYiB8fCB0aGlzLiNmbGFncy5oYXMoY2IpKSByZXR1cm47XG5cdFx0dGhpcy4jZmxhZ3MuYWRkKGNiKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzID0gY2IoLi4uYXJncyk7XG5cdFx0XHRpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHJlcy5jYXRjaChjb25zb2xlLndhcm4pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy4jZmxhZ3MuZGVsZXRlKGNiKTtcblx0XHR9XG5cdH1cblx0I2Rpc3BhdGNoKG5hbWUsIHZhbHVlID0gbnVsbCwgb2xkVmFsdWUsIHRyaWdnZXIgPSBcImFsbFwiLCAuLi5ldGMpIHtcblx0XHR0cmlnZ2VyID0gbm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gdHJpZ2dlcjtcblx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0aWYgKGxpc3RlbmVycz8uc2l6ZSkge1xuXHRcdFx0Zm9yIChjb25zdCBbY2IsIHJlY29yZF0gb2YgbGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKChyZWNvcmQucHJvcCA9PT0gbmFtZSB8fCByZWNvcmQucHJvcCA9PT0gZm9yQWxsIHx8IHJlY29yZC5wcm9wID09PSBudWxsKSAmJiB0cmlnZ2VyRmlsdGVyQWxsb3dzKHJlY29yZC50cmlnZ2VycywgdHJpZ2dlcikpIHRoaXMuJHNhZmVFeGVjKGNiLCB2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG5cdFx0fVxuXHRcdGlmIChnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2l6ZSkge1xuXHRcdFx0Y29uc3QgZXZlbnQgPSB7XG5cdFx0XHRcdHNvdXJjZTogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR0YXJnZXQ6IHRoaXMuI3NvdXJjZSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdHByb3A6IG5hbWUsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyLFxuXHRcdFx0XHRhcmdzOiBldGNcblx0XHRcdH07XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgdHJpZ2dlcnNdIG9mIGdsb2JhbEVmZmVjdExpc3RlbmVycy5lbnRyaWVzKCkpIGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKHRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIGV2ZW50KTtcblx0XHR9XG5cdH1cblx0d3JhcChudykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG53KSkgcmV0dXJuIHdyYXBXaXRoKG53LCB0aGlzKTtcblx0XHRyZXR1cm4gbnc7XG5cdH1cblx0Z2V0IHRyaWdnZXJDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLiN0cmlnZ2VyQ29udHJvbDtcblx0fVxuXHRpc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpIHtcblx0XHRyZXR1cm4gIXRyaWdnZXJGaWx0ZXJBbGxvd3ModGhpcy4jZGlzYWJsZWRUcmlnZ2VycywgXCJhbGxcIikgJiYgIXRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpKTtcblx0fVxuXHRzZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMgPSBbXCIqXCJdLCBlbmFibGVkID0gdHJ1ZSkge1xuXHRcdGNvbnN0IG5hbWVzID0gZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyk7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSBpZiAoZW5hYmxlZCkgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5kZWxldGUobmFtZSk7XG5cdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0fVxuXHR3aXRoVHJpZ2dlcnModHlwZXMsIGVuYWJsZWQsIGNiKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBbLi4uZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyldO1xuXHRcdGNvbnN0IHByZXZpb3VzID0gbmV3IE1hcChuYW1lcy5tYXAoKG5hbWUpID0+IFtuYW1lLCB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmhhcyhuYW1lKV0pKTtcblx0XHRjb25zdCByZXN0b3JlID0gKCkgPT4ge1xuXHRcdFx0cHJldmlvdXMuZm9yRWFjaCgod2FzRGlzYWJsZWQsIG5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHdhc0Rpc2FibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0XHRcdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0dGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQobmFtZXMsIGVuYWJsZWQpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjYj8uKCk7XG5cdFx0XHRpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQuZmluYWxseSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiByZXN1bHQuZmluYWxseShyZXN0b3JlKTtcblx0XHRcdHJlc3RvcmUoKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YWZmZWN0ZWQoY2IsIHByb3AsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdFx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy4jbGlzdGVuZXJzLnNldChjYiwge1xuXHRcdFx0cHJvcDogcHJvcCB8fCBmb3JBbGwsXG5cdFx0XHR0cmlnZ2Vyczogbm9ybWFsaXplZC5hZmZlY3RUeXBlc1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnVuYWZmZWN0ZWQoY2IsIHByb3AgfHwgZm9yQWxsKTtcblx0fVxuXHR1bmFmZmVjdGVkKGNiLCBwcm9wKSB7XG5cdFx0aWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy4jbGlzdGVuZXJzO1xuXHRcdFx0Y29uc3QgcmVjb3JkID0gbGlzdGVuZXJzPy5nZXQoY2IpO1xuXHRcdFx0aWYgKHJlY29yZCAmJiAocmVjb3JkLnByb3AgPT0gcHJvcCB8fCBwcm9wID09IG51bGwgfHwgcHJvcCA9PSBmb3JBbGwpKSB7XG5cdFx0XHRcdGxpc3RlbmVycy5kZWxldGUoY2IpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gdGhpcy5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwsIHJlY29yZC50cmlnZ2Vycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiNsaXN0ZW5lcnMuY2xlYXIoKTtcblx0fVxuXHR0cmlnZ2VyKG5hbWUsIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwic2V0XCIsIC4uLmV0Yykge1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgcmV0dXJuO1xuXHRcdGlmICh0cmlnZ2VyID09PSB2b2lkIDApIHRyaWdnZXIgPSBcInNldFwiO1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGlmICghdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpKSByZXR1cm47XG5cdFx0Y29uc3Qgb3BLZXkgPSBgJHt0cmlnZ2VyID8/IFwiYWxsXCJ9YDtcblx0XHRsZXQgYnlPcCA9IHRoaXMuI3BlbmRpbmdCeVByb3AuZ2V0KG5hbWUpO1xuXHRcdGlmICghYnlPcCkge1xuXHRcdFx0YnlPcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wLnNldChuYW1lLCBieU9wKTtcblx0XHR9XG5cdFx0YnlPcC5zZXQob3BLZXksIFtcblx0XHRcdG5hbWUsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdGV0Y1xuXHRcdF0pO1xuXHRcdGlmICh0aGlzLiNmbHVzaFNjaGVkdWxlZCkgcmV0dXJuO1xuXHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcblx0XHRxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG5cdFx0XHR0aGlzLiNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRcdFx0Y29uc3QgYmF0Y2ggPSB0aGlzLiNwZW5kaW5nQnlQcm9wO1xuXHRcdFx0dGhpcy4jcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRmb3IgKGNvbnN0IFtwcm9wLCBvcE1hcF0gb2YgYmF0Y2gpIHtcblx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCAmJiB0aGlzLiNpbkRpc3BhdGNoLmhhcyhwcm9wKSkgY29udGludWU7XG5cdFx0XHRcdGlmIChwcm9wICE9IG51bGwpIHRoaXMuI2luRGlzcGF0Y2guYWRkKHByb3ApO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgWywgYXJnc10gb2Ygb3BNYXApIHtcblx0XHRcdFx0XHRcdGNvbnN0IFtubSwgdiwgb3YsIHRnLCByZXN0XSA9IGFyZ3M7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLiNkaXNwYXRjaChubSwgdiwgb3YsIHRnLCAuLi5yZXN0ID8/IFtdKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRpZiAocHJvcCAhPSBudWxsKSB0aGlzLiNpbkRpc3BhdGNoLmRlbGV0ZShwcm9wKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdGdldCBpdGVyYXRvcigpIHtcblx0XHRyZXR1cm4gdGhpcy4jaXRlcmF0b3I7XG5cdH1cbn07XG52YXIgU3Vic2NyaXB0ID0gZ2xvYmFsVGhpc1tTdWJzY3JpcHRTeW1ib2xdO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9SZXNvbHZlZC50c1xudmFyIHJhd09mID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXBwZWQgPSBkZXJlZih0YXJnZXQpO1xuXHRyZXR1cm4gdW53cmFwcGVkPy5bJGV4dHJhY3RLZXkkXSA/PyB1bndyYXBwZWQ7XG59O1xuZnVuY3Rpb24gcmVzb2x2ZWQodGFyZ2V0LCBtb2RlID0gXCJhbGxcIikge1xuXHRjb25zdCByYXcgPSByYXdPZih0YXJnZXQpO1xuXHRpZiAoaXNQcm9taXNlKHJhdykpIHJldHVybiByZXNvbHZlZCQxKHJhdywgbW9kZSk7XG5cdGlmIChpc1Byb21pc2UocmF3Py5bJHByb21pc2VdKSkgcmV0dXJuIHJlc29sdmVkJDEocmF3WyRwcm9taXNlXSwgbW9kZSk7XG5cdHJldHVybiByZXNvbHZlZCQxKHJhdyA/PyB0YXJnZXQsIG1vZGUpO1xufVxuZnVuY3Rpb24gbWFrZVJlc29sdmVkT3AodGFyZ2V0LCBlbWl0ID0gZmFsc2UpIHtcblx0Y29uc3QgcnVuID0gKChtb2RlID0gXCJhbGxcIikgPT4ge1xuXHRcdGNvbnN0IHBlbmRpbmcgPSByZXNvbHZlZCh0YXJnZXQsIG1vZGUpO1xuXHRcdGlmICghZW1pdCkgcmV0dXJuIHBlbmRpbmc7XG5cdFx0cmV0dXJuIHBlbmRpbmcudGhlbigodmFsdWUpID0+IHtcblx0XHRcdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCk7XG5cdFx0XHRjb25zdCBrZXkgPSByYXc/LnJlYWxQcm9wID8/IChyYXcgJiYgXCJ2YWx1ZVwiIGluIHJhdyA/IFwidmFsdWVcIiA6IG51bGwpO1xuXHRcdFx0c3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHJhdyk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCB2b2lkIDAsIFwicmVzb2x2ZWRcIik7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSk7XG5cdH0pO1xuXHRydW4uYWxsID0gKCkgPT4gcnVuKFwiYWxsXCIpO1xuXHRydW4uYWxsU2V0dGxlZCA9ICgpID0+IHJ1bihcInNldHRsZWRcIik7XG5cdHJ1bi5hbGxLZXllZCA9ICgpID0+IHJ1bihcImFsbFwiKTtcblx0cnVuLmFsbFNldHRsZWRLZXllZCA9ICgpID0+IHJ1bihcInNldHRsZWRcIik7XG5cdHJ1bi50cnkgPSAoY2FsbGJhY2tPclZhbHVlLCAuLi5hcmdzKSA9PiBQcm9taXNlLnRyeShjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpLnRoZW4oKHZhbHVlKSA9PiByZXNvbHZlZCh2YWx1ZSA/PyB0YXJnZXQsIFwiYWxsXCIpKTtcblx0cmV0dXJuIHJ1bjtcbn1cbmZ1bmN0aW9uIGVtaXRSZXNvbHZlZCh0YXJnZXQsIGtleSwgdmFsdWUsIG9sZFZhbHVlKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCkgPz8gdGFyZ2V0O1xuXHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCBcInJlc29sdmVkXCIpO1xufVxuZnVuY3Rpb24gYmluZEV4aXN0aW5nVGhlbmFibGVzKGxpdmUsIHJhdykge1xuXHRpZiAobGl2ZSA9PSBudWxsIHx8IHJhdyA9PSBudWxsKSByZXR1cm4gbGl2ZTtcblx0aWYgKEFycmF5LmlzQXJyYXkocmF3KSkge1xuXHRcdHJhdy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcblx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlW2luZGV4XSA9IHZhbHVlO1xuXHRcdH0pO1xuXHRcdHJldHVybiBsaXZlO1xuXHR9XG5cdGlmIChyYXcgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiByYXcuZW50cmllcygpKSBpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZS5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0cmV0dXJuIGxpdmU7XG5cdH1cblx0aWYgKHJhdyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIGxpdmU7XG5cdGZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhyYXcpKSB7XG5cdFx0aWYgKGtleSA9PSAkZXh0cmFjdEtleSQgfHwga2V5ID09ICRwcm9taXNlIHx8IGtleSA9PSAkcmVzb2x2ZWQpIGNvbnRpbnVlO1xuXHRcdGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihyYXcsIGtleSk/LmVudW1lcmFibGUpIGNvbnRpbnVlO1xuXHRcdGNvbnN0IHZhbHVlID0gcmF3W2tleV07XG5cdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmVba2V5XSA9IHZhbHVlO1xuXHR9XG5cdHJldHVybiBsaXZlO1xufVxuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9TcGVjaWZpYy50c1xudmFyIF9fc2FmZUdldEd1YXJkU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0BfX3NhZmVHZXRHdWFyZFwiKTtcbnZhciBfX3N5c3RlbVNraXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG5cdFN5bWJvbC50b1N0cmluZ1RhZyxcblx0U3ltYm9sLml0ZXJhdG9yLFxuXHRTeW1ib2wuYXN5bmNJdGVyYXRvcixcblx0U3ltYm9sLnRvUHJpbWl0aXZlLFxuXHRcInRvU3RyaW5nXCIsXG5cdFwidmFsdWVPZlwiLFxuXHRcImluc3BlY3RcIixcblx0XCJjb25zdHJ1Y3RvclwiLFxuXHRcIl9fcHJvdG9fX1wiLFxuXHRcInByb3RvdHlwZVwiLFxuXHRcInRoZW5cIixcblx0XCJjYXRjaFwiLFxuXHRcImZpbmFsbHlcIixcblx0XCJuZXh0XCJcbl0pO1xudmFyIHN5c3RlbVNraXBHZXQgPSAodGFyZ2V0LCBuYW1lKSA9PiB7XG5cdGlmICghX19zeXN0ZW1Ta2lwLmhhcyhuYW1lKSkgcmV0dXJuIG51bGw7XG5cdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0cmV0dXJuIHR5cGVvZiBnb3QgPT09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBnb3QpIDogZ290O1xufTtcbnZhciBfX3NhZmVHZXRHdWFyZCA9IGdsb2JhbFRoaXNbX19zYWZlR2V0R3VhcmRTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIGlzR2V0dGVyKG9iaiwgcHJvcE5hbWUpIHtcblx0bGV0IGdvdCA9IHRydWU7XG5cdHRyeSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4ocHJvcE5hbWUpO1xuXHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4ob2JqKT8uaGFzPy4ocHJvcE5hbWUpKSBnb3QgPSB0cnVlO1xuXHRcdGdvdCA9IHR5cGVvZiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3BOYW1lKT8uZ2V0ID09IFwiZnVuY3Rpb25cIjtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGdvdCA9IHRydWU7XG5cdH0gZmluYWxseSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/LmRlbGV0ZT8uKHByb3BOYW1lKTtcblx0fVxuXHRyZXR1cm4gZ290O1xufVxudmFyIGZhbGxUaHJvdWdoID0gKG9iaiwga2V5KSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCB2YWx1ZSA9IHNhZmVHZXQob2JqLCBrZXkpO1xuXHRpZiAodmFsdWUgPT0gbnVsbCAmJiBrZXkgIT0gXCJ2YWx1ZVwiKSB7XG5cdFx0Y29uc3QgdG1wID0gc2FmZUdldChvYmosIFwidmFsdWVcIik7XG5cdFx0aWYgKHRtcCAhPSBudWxsICYmICFpc1ByaW1pdGl2ZSh0bXApKSByZXR1cm4gZmFsbFRocm91Z2godG1wLCBrZXkpO1xuXHRcdGVsc2UgcmV0dXJuIHZhbHVlO1xuXHR9IGVsc2UgaWYgKGtleSA9PSBcInZhbHVlXCIgJiYgdmFsdWUgIT0gbnVsbCAmJiAhaXNQcmltaXRpdmUodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxsVGhyb3VnaCh2YWx1ZSwga2V5KSA/PyB2YWx1ZSA/PyBvYmo7XG5cdHJldHVybiB2YWx1ZSA/PyBvYmo7XG59O1xudmFyIHNhZmVTZXQgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XG5cdGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlU2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIGZhbHNlO1xuXHRhY3RpdmU/LmFkZD8uKGtleSk7XG5cdHJldHVybiBSZWZsZWN0LnNldChvYmosIGtleSwgdmFsdWUpO1xufTtcbnZhciBzYWZlR2V0ID0gKG9iaiwga2V5LCByZWMpID0+IHtcblx0bGV0IHJlc3VsdCA9IHZvaWQgMDtcblx0aWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIG51bGw7XG5cdGlmICghaXNHZXR0ZXIob2JqLCBrZXkpKSByZXN1bHQgPz89IFJlZmxlY3QuZ2V0KG9iaiwga2V5LCByZWMgIT0gbnVsbCA/IHJlYyA6IG9iaik7XG5cdGVsc2Uge1xuXHRcdGFjdGl2ZT8uYWRkPy4oa2V5KTtcblx0XHR0cnkge1xuXHRcdFx0cmVzdWx0ID0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcblx0XHR9IGNhdGNoIChfZSkge1xuXHRcdFx0cmVzdWx0ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRhY3RpdmUuZGVsZXRlKGtleSk7XG5cdFx0XHRpZiAoYWN0aXZlPy5zaXplID09PSAwKSBfX3NhZmVHZXRHdWFyZD8uZGVsZXRlPy4ob2JqKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHR5cGVvZiByZXN1bHQgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eChvYmosIHJlc3VsdCkgOiByZXN1bHQ7XG59O1xudmFyIGhhc093biA9IChvYmosIGtleSkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbnZhciBpc1RyaWdnZXJFbWl0T3B0aW9ucyA9ICh2YWx1ZSwgYWxsb3dWYWx1ZU9ubHkgPSBmYWxzZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKGhhc093bih2YWx1ZSwgXCJrZXlcIikgfHwgaGFzT3duKHZhbHVlLCBcIm5hbWVcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9sZFZhbHVlXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvbGRcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9wXCIpIHx8IGhhc093bih2YWx1ZSwgXCJ0cmlnZ2VyXCIpIHx8IGFsbG93VmFsdWVPbmx5ICYmIGhhc093bih2YWx1ZSwgXCJ2YWx1ZVwiKSk7XG59O1xudmFyIHRyaWdnZXJPcHRpb25WYWx1ZSA9IChvcHRpb25zLCBrZXksIGZhbGxiYWNrKSA9PiB7XG5cdGlmIChoYXNPd24ob3B0aW9ucywga2V5KSkgcmV0dXJuIG9wdGlvbnNba2V5XTtcblx0aWYgKGtleSA9PSBcIm9sZFZhbHVlXCIgJiYgaGFzT3duKG9wdGlvbnMsIFwib2xkXCIpKSByZXR1cm4gb3B0aW9ucy5vbGQ7XG5cdHJldHVybiBmYWxsYmFjaygpO1xufTtcbnZhciB0cmlnZ2VyT3B0aW9uVHJpZ2dlciA9IChvcHRpb25zLCBmYWxsYmFjayA9IFwibWFudWFsXCIpID0+IG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG9wdGlvbnMudHJpZ2dlciA/PyBvcHRpb25zLm9wID8/IGZhbGxiYWNrKTtcbnZhciBpc1J1bnRpbWVLZXkgPSAoa2V5KSA9PiB0eXBlb2Yga2V5ID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGtleSA9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBrZXkgPT0gXCJzeW1ib2xcIjtcbnZhciByZWFsUHJvcE9mJDEgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHByb3AgPSBzYWZlR2V0KHRhcmdldCwgJHJlYWxQcm9wKSA/PyBzYWZlR2V0KHRhcmdldCwgXCJyZWFsUHJvcFwiKTtcblx0cmV0dXJuIGlzUnVudGltZUtleShwcm9wKSA/IHByb3AgOiBudWxsO1xufTtcbnZhciB0cmlnZ2VyS2V5T2YgPSAodGFyZ2V0LCBrZXkpID0+IGtleSA9PSBcInZhbHVlXCIgPyByZWFsUHJvcE9mJDEodGFyZ2V0KSA/PyBrZXkgOiBrZXk7XG52YXIgdHJpZ2dlclZhbHVlT2YgPSAodGFyZ2V0LCBrZXkpID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mJDEodGFyZ2V0KTtcblx0aWYgKHJlYWxQcm9wICE9IG51bGwgJiYga2V5ID09IHJlYWxQcm9wKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgPz8gc2FmZUdldCh0YXJnZXQsIGtleSk7XG5cdHJldHVybiBrZXkgPT0gbnVsbCA/IHZvaWQgMCA6IHNhZmVHZXQodGFyZ2V0LCBrZXkpO1xufTtcbnZhciBjcmVhdGVUcmlnZ2VyQVBJID0gKHJlZ2lzdHJ5LCBlbWl0LCB0YXJnZXQpID0+IHtcblx0Y29uc3QgYXBpID0gKGtleSwgb3BPck9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoIWlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zKSkgdHJpZ2dlciA/Pz0gb3BPck9wdGlvbnM7XG5cdFx0cmV0dXJuIGVtaXQoaXNUcmlnZ2VyRW1pdE9wdGlvbnMoa2V5KSA/IGtleSA6IGlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zLCB0cnVlKSA/IHtcblx0XHRcdGtleSxcblx0XHRcdHRyaWdnZXIsXG5cdFx0XHQuLi5vcE9yT3B0aW9uc1xuXHRcdH0gOiB7XG5cdFx0XHRrZXksXG5cdFx0XHR0cmlnZ2VyOiB0cmlnZ2VyID8/IG9wT3JPcHRpb25zXG5cdFx0fSk7XG5cdH07XG5cdGNvbnN0IGNvbnRyb2wgPSByZWdpc3RyeT8udHJpZ2dlckNvbnRyb2w7XG5cdGlmIChjb250cm9sKSBPYmplY3QuYXNzaWduKGFwaSwgY29udHJvbCk7XG5cdGFwaS5jdXN0b20gPSAodHJpZ2dlciwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpID0+IGFwaSh7XG5cdFx0a2V5LFxuXHRcdHRyaWdnZXIsXG5cdFx0dmFsdWUsXG5cdFx0b2xkVmFsdWVcblx0fSk7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCkgYXBpLnJlc29sdmVkID0gbWFrZVJlc29sdmVkT3AodGFyZ2V0LCB0cnVlKTtcblx0cmV0dXJuIGFwaTtcbn07XG52YXIgc3lzdGVtR2V0ID0gKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IGlzUHJpbWl0aXZlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGlmICgoW1xuXHRcdFwiZGVyZWZcIixcblx0XHRcImJpbmRcIixcblx0XHRcIkB0YXJnZXRcIixcblx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdCRleHRyYWN0S2V5JCxcblx0XHQkcmVnaXN0cnlLZXkkXG5cdF0uaW5kZXhPZihuYW1lKSA8IDAgPyBzYWZlR2V0KHRhcmdldCwgbmFtZSk/LmJpbmQ/Lih0YXJnZXQpIDogbnVsbCkgIT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdGlmIChbJGV4dHJhY3RLZXkkLCAkb3JpZ2luYWxLZXkkXS5pbmRleE9mKG5hbWUpID49IDApIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdGFyZ2V0O1xuXHRpZiAobmFtZSA9PSAkdmFsdWUpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIik7XG5cdGlmIChuYW1lID09ICRyZWdpc3RyeUtleSQpIHJldHVybiByZWdpc3RyeTtcblx0aWYgKG5hbWUgPT0gJHJlc29sdmVkIHx8IG5hbWUgPT0gXCJyZXNvbHZlZFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBcInJlc29sdmVkXCIpKSByZXR1cm4gbWFrZVJlc29sdmVkT3AodGFyZ2V0KTtcblx0aWYgKG5hbWUgPT0gJHRyaWdnZXJDb250cm9sKSByZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXJDb250cm9sO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wub2JzZXJ2YWJsZSkgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuc3Vic2NyaWJlKSByZXR1cm4gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiBhZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCwgY2IsIG9wdGlvbnMpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5hc3luY0l0ZXJhdG9yKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuZGlzcG9zZSkgcmV0dXJuIChwcm9wKSA9PiB7XG5cdFx0c2FmZUdldCh0YXJnZXQsIFN5bWJvbC5kaXNwb3NlKT8uKHByb3ApO1xuXHRcdHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHR9O1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuYXN5bmNEaXNwb3NlKSByZXR1cm4gKHByb3ApID0+IHtcblx0XHRzYWZlR2V0KHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSk/Lihwcm9wKTtcblx0XHR1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0fTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLnVuc3Vic2NyaWJlKSByZXR1cm4gKHByb3ApID0+IHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xufTtcbnZhciBvYnNlcnZhYmxlQVBJTWV0aG9kcyA9ICh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KSA9PiB7XG5cdGlmIChuYW1lID09IFwic3Vic2NyaWJlXCIpIHJldHVybiByZWdpc3RyeT8uY29tcGF0aWJsZT8uW25hbWVdID8/ICgoaGFuZGxlcikgPT4ge1xuXHRcdGlmICh0eXBlb2YgaGFuZGxlciA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXIpO1xuXHRcdGVsc2UgaWYgKFwibmV4dFwiIGluIGhhbmRsZXIgJiYgaGFuZGxlcj8ubmV4dCAhPSBudWxsKSB7XG5cdFx0XHRjb25zdCB1c3ViID0gYWZmZWN0ZWQodGFyZ2V0LCBoYW5kbGVyPy5uZXh0KSwgY29tcCA9IGhhbmRsZXI/LltcImNvbXBsZXRlXCJdO1xuXHRcdFx0aGFuZGxlcltcImNvbXBsZXRlXCJdID0gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0dXN1Yj8uKCk7XG5cdFx0XHRcdHJldHVybiBjb21wPy4oLi4uYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGhhbmRsZXJbXCJjb21wbGV0ZVwiXTtcblx0XHR9XG5cdH0pO1xufTtcbnZhciBPYnNlcnZlQXJyYXlNZXRob2QgPSBjbGFzcyB7XG5cdCNuYW1lO1xuXHQjc2VsZjtcblx0I2hhbmRsZTtcblx0Y29uc3RydWN0b3IobmFtZSwgc2VsZiwgaGFuZGxlKSB7XG5cdFx0dGhpcy4jbmFtZSA9IG5hbWU7XG5cdFx0dGhpcy4jc2VsZiA9IHNlbGY7XG5cdFx0dGhpcy4jaGFuZGxlID0gaGFuZGxlO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgcmVjKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdGxldCBhZGRlZCA9IFtdLCByZW1vdmVkID0gW107XG5cdFx0bGV0IHNldFBhaXJzID0gW107XG5cdFx0bGV0IG9sZFN0YXRlID0gWy4uLnRoaXMuI3NlbGZdO1xuXHRcdGxldCBpZHggPSAtMTtcblx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4IHx8IHRoaXMuI3NlbGYsIGFyZ3MpO1xuXHRcdGlmICh0aGlzLiNoYW5kbGU/LlskdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSByZXR1cm4gb2JzZXJ2ZUFycmF5KHJlc3VsdCk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRzd2l0Y2ggKHRoaXMuI25hbWUpIHtcblx0XHRcdGNhc2UgXCJwdXNoXCI6XG5cdFx0XHRcdGlkeCA9IG9sZFN0YXRlPy5sZW5ndGg7XG5cdFx0XHRcdGFkZGVkID0gYXJncztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidW5zaGlmdFwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRhZGRlZCA9IGFyZ3M7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInBvcFwiOlxuXHRcdFx0XHRpZHggPSBvbGRTdGF0ZT8ubGVuZ3RoIC0gMTtcblx0XHRcdFx0aWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbb2xkU3RhdGVbaWR4XV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNoaWZ0XCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGlmIChvbGRTdGF0ZS5sZW5ndGggPiAwKSByZW1vdmVkID0gW29sZFN0YXRlW2lkeF1dO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzcGxpY2VcIjpcblx0XHRcdFx0aWR4ID0gYXJnc1swXTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1heChvbGRTdGF0ZS5sZW5ndGgsIHRoaXMuI3NlbGYubGVuZ3RoKTsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBvbGRTdGF0ZVtpXTtcblx0XHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHRoaXMuI3NlbGZbaV07XG5cdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09PSB2b2lkIDAgJiYgaSA+PSB0aGlzLiNzZWxmLmxlbmd0aCkgcmVtb3ZlZC5wdXNoKG9sZFZhbHVlKTtcblx0XHRcdFx0XHRlbHNlIGlmIChvbGRWYWx1ZSA9PT0gdm9pZCAwICYmIGkgPj0gb2xkU3RhdGUubGVuZ3RoKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdHZvaWQgMCxcblx0XHRcdFx0XHRcdGZhbHNlXG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChvbGRWYWx1ZSwgbmV3VmFsdWUpKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNvcnRcIjpcblx0XHRcdGNhc2UgXCJmaWxsXCI6XG5cdFx0XHRjYXNlIFwicmV2ZXJzZVwiOlxuXHRcdFx0Y2FzZSBcImNvcHlXaXRoaW5cIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvbGRTdGF0ZS5sZW5ndGg7IGkrKykgaWYgKGlzTm90RXF1YWwob2xkU3RhdGVbaV0sIHRoaXMuI3NlbGZbaV0pKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRpZHggKyBpLFxuXHRcdFx0XHRcdHRoaXMuI3NlbGZbaV0sXG5cdFx0XHRcdFx0b2xkU3RhdGVbaV0sXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2V0XCI6XG5cdFx0XHRcdGlkeCA9IGFyZ3NbMV07XG5cdFx0XHRcdHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdGlkeCxcblx0XHRcdFx0XHRhcmdzWzBdLFxuXHRcdFx0XHRcdG9sZFN0YXRlPy5baWR4XSxcblx0XHRcdFx0XHRpZHggaW4gb2xkU3RhdGVcblx0XHRcdFx0XSk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlZyA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0aGlzLiNzZWxmKTtcblx0XHRpZiAoYWRkZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIGFkZGVkWzBdLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZD8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBhZGRlZCwgbnVsbCwgXCJhZGRBbGxcIik7XG5cdFx0XHRhZGRlZC5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWc/LnRyaWdnZXI/LihpZHggKyBJLCBpdGVtLCBudWxsLCBcImFkZFwiKSk7XG5cdFx0fVxuXHRcdGlmIChzZXRQYWlycz8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKHNldFBhaXJzWzBdPy5bMF0gPz8gaWR4LCBzZXRQYWlyc1swXT8uWzFdLCBzZXRQYWlyc1swXT8uWzJdLCBzZXRQYWlyc1swXT8uWzNdID09PSBmYWxzZSA/IFwiYWRkXCIgOiBcInNldFwiKTtcblx0XHRlbHNlIGlmIChzZXRQYWlycz8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBzZXRQYWlycywgb2xkU3RhdGUsIFwic2V0QWxsXCIpO1xuXHRcdFx0c2V0UGFpcnMuZm9yRWFjaCgocGFpciwgSSkgPT4gcmVnPy50cmlnZ2VyPy4ocGFpcj8uWzBdID8/IGlkeCArIEksIHBhaXI/LlsxXSwgcGFpcj8uWzJdLCBwYWlyPy5bM10gPT09IGZhbHNlID8gXCJhZGRcIiA6IFwic2V0XCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlbW92ZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIG51bGwsIHJlbW92ZWRbMF0sIFwiZGVsZXRlXCIpO1xuXHRcdGVsc2UgaWYgKHJlbW92ZWQ/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZCwgXCJkZWxldGVBbGxcIik7XG5cdFx0XHRyZW1vdmVkLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZz8udHJpZ2dlcj8uKGlkeCArIEksIG51bGwsIGl0ZW0sIFwiZGVsZXRlXCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlc3VsdCA9PSB0YXJnZXQpIHJldHVybiBuZXcgUHJveHkocmVzdWx0LCB0aGlzLiNoYW5kbGUpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHJldHVybiBvYnNlcnZlQXJyYXkocmVzdWx0KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlID0gKHNlbGYsIHRhcmdldCwgb2xkTGVuLCBuZXdMZW4pID0+IHtcblx0Y29uc3QgcmVtb3ZlZEl0ZW1zID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPCBvbGRMZW4gPyB0YXJnZXQuc2xpY2UobmV3TGVuLCBvbGRMZW4pIDogW107XG5cdGlmICghc2VsZlskdHJpZ2dlckxvY2tdICYmIG9sZExlbiAhPT0gbmV3TGVuKSB7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA9PT0gMSkgcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtc1swXSwgXCJkZWxldGVcIik7XG5cdFx0ZWxzZSBpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuLCBudWxsLCByZW1vdmVkSXRlbXMsIFwiZGVsZXRlQWxsXCIpO1xuXHRcdFx0cmVtb3ZlZEl0ZW1zLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuICsgSSwgbnVsbCwgaXRlbSwgXCJkZWxldGVcIikpO1xuXHRcdH1cblx0XHRjb25zdCBhZGRlZENvdW50ID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPiBvbGRMZW4gPyBuZXdMZW4gLSBvbGRMZW4gOiAwO1xuXHRcdGlmIChhZGRlZENvdW50ID09PSAxKSByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgdm9pZCAwLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZENvdW50ID4gMSkge1xuXHRcdFx0Y29uc3QgYWRkZWQgPSBBcnJheShhZGRlZENvdW50KS5maWxsKHZvaWQgMCk7XG5cdFx0XHRyZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgYWRkZWQsIG51bGwsIFwiYWRkQWxsXCIpO1xuXHRcdFx0YWRkZWQuZm9yRWFjaCgoXywgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4gKyBJLCB2b2lkIDAsIG51bGwsIFwiYWRkXCIpKTtcblx0XHR9XG5cdH1cbn07XG52YXIgT2JzZXJ2ZUFycmF5SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0aGFzKHRhcmdldCwgbmFtZSkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gc2FmZUdldCh0YXJnZXQsIGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiQHRhcmdldFwiIHx8IG5hbWUgPT0gJGV4dHJhY3RLZXkkKSByZXR1cm4gdGFyZ2V0O1xuXHRcdGlmIChuYW1lID09IFwieFwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueCA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwieVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueSA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwielwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwid1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8udyA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiclwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uciA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZ1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uZyA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYlwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYSA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyAobmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IG51bGwpO1xuXHRcdGlmICh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG5ldyBQcm94eSh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIiA/IGdvdD8uYmluZD8uKHRhcmdldCkgOiBnb3QsIG5ldyBPYnNlcnZlQXJyYXlNZXRob2QobmFtZSwgdGFyZ2V0LCB0aGlzKSk7XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihwYXJzZUludChuYW1lKSkpIG5hbWUgPSBwYXJzZUludChuYW1lKSA/PyBuYW1lO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBwZW5kaW5nID0gaXNQcm9taXNlKHZhbHVlKTtcblx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IG9sZCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IHh5encgPSBbXG5cdFx0XHRcdFwieFwiLFxuXHRcdFx0XHRcInlcIixcblx0XHRcdFx0XCJ6XCIsXG5cdFx0XHRcdFwid1wiXG5cdFx0XHRdO1xuXHRcdFx0Y29uc3QgcmdiYSA9IFtcblx0XHRcdFx0XCJyXCIsXG5cdFx0XHRcdFwiZ1wiLFxuXHRcdFx0XHRcImJcIixcblx0XHRcdFx0XCJhXCJcblx0XHRcdF07XG5cdFx0XHRjb25zdCB4eXp3X2lkeCA9IHh5encuaW5kZXhPZihuYW1lKTtcblx0XHRcdGNvbnN0IHJnYmFfaWR4ID0gcmdiYS5pbmRleE9mKG5hbWUpO1xuXHRcdFx0bGV0IGdvdCA9IGZhbHNlO1xuXHRcdFx0aWYgKHh5endfaWR4ID49IDApIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgeHl6d19pZHgsIHYpO1xuXHRcdFx0ZWxzZSBpZiAocmdiYV9pZHggPj0gMCkgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCByZ2JhX2lkeCwgdik7XG5cdFx0XHRlbHNlIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdik7XG5cdFx0XHRpZiAobmFtZSA9PSBcImxlbmd0aFwiKSB7XG5cdFx0XHRcdGlmIChpc05vdEVxdWFsKG9sZCwgdikpIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlKHRoaXMsIHRhcmdldCwgb2xkLCB2KTtcblx0XHRcdH1cblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2xkLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnk/LmdldD8uKHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCB2LCBvbGQsIFwic2V0XCIpO1xuXHRcdFx0XHRpZiAocGVuZGluZykgZW1pdFJlc29sdmVkKHRhcmdldCwgbmFtZSwgdiwgb2xkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBnb3Q7XG5cdFx0fSk7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KG5hbWUpKSkgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBvbGQgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgZ290ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG5hbWUgIT0gXCJsZW5ndGhcIiAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAob2xkICE9IG51bGwpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbmFtZSwgb2xkLCBcImRlbGV0ZVwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxufTtcbnZhciBPYnNlcnZlT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIixcblx0XHRcdFwidGhlblwiLFxuXHRcdFx0XCJjYXRjaFwiLFxuXHRcdFx0XCJmaW5hbGx5XCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gcmVhbFByb3BPZiQxKHRhcmdldCkgPz8gXCJ2YWx1ZVwiKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4ga2V5ID09IFwidmFsdWVcIiB8fCBrZXkgPT0gcmVhbFByb3BPZiQxKHRhcmdldCkgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IHZvaWQgMCk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRyaWdnZXJWYWx1ZU9mKHRhcmdldCwga2V5KSk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gU3ltYm9sLnRvUHJpbWl0aXZlKSByZXR1cm4gKGhpbnQpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oaGludCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoZnQsIGhpbnQpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSwgaGludCk7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCwgaGludCk7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBTeW1ib2wudG9TdHJpbmdUYWcpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gU3RyaW5nKGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0cmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInRvU3RyaW5nXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvU3RyaW5nVGFnKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1N0cmluZ1RhZyk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIFN0cmluZyhmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZU9mXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvUHJpbWl0aXZlKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1ByaW1pdGl2ZSk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIGZ0O1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKTtcblx0XHRcdHJldHVybiBzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0O1xuXHRcdH07XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRyZXR1cm4gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldD8uW1N5bWJvbC5mb3IoXCJAQGFwcGx5XCIpXT8uYmluZD8uKHRhcmdldD8uW1N5bWJvbC5mb3IoXCJAQGFwcGx5XCIpXSA/PyB0YXJnZXQpID8/IHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuXHRcdGxldCBnb3QgPSB2b2lkIDA7XG5cdFx0dHJ5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG5cdFx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIGdvdCA9IHZvaWQgMDtcblx0XHRcdGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRnb3QgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodiwgbmFtZSk7XG5cdFx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCAkb3JpZ2luYWwgPSB0YXJnZXQ7XG5cdFx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAhKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIG5hbWUgaW4gdGFyZ2V0KSkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdHJpZ2dlck5hbWUgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gbmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA/PyBzYWZlR2V0KHRhcmdldCwgbmFtZSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0XHR0YXJnZXRbbmFtZV0gPSB2O1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdjtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdFx0Y29uc3Qgc3Vic2NyaXB0ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KCRvcmlnaW5hbCk7XG5cdFx0XHRcdGlmICgoc2FmZUdldCh0YXJnZXQsICRpc05vdEVxdWFsKSA/PyBpc05vdEVxdWFsKT8uKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHN1YnNjcmlwdD8udHJpZ2dlcj8uKHRyaWdnZXJOYW1lLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQoJG9yaWdpbmFsLCB0cmlnZ2VyTmFtZSwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSk7XG5cdH1cblx0ZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISFkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0aWYgKGRlc2NyaXB0b3IuZ2V0ID09IHZvaWQgMCAmJiBkZXNjcmlwdG9yLnNldCA9PSB2b2lkIDApIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgJHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG5cdFx0XHRnZXQ6IGRlc2NyaXB0b3IuZ2V0LFxuXHRcdFx0c2V0OiBkZXNjcmlwdG9yLnNldCxcblx0XHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA/PyB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA/PyB0cnVlXG5cdFx0fSk7XG5cdFx0c2FmZVNldCh0YXJnZXQsIG5hbWUsIG9sZFZhbHVlKTtcblx0XHRyZXR1cm4gJHJlc3VsdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIE9ic2VydmVNYXBIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHR0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgJGV4dHJhY3RLZXkkKSA/PyBzYWZlR2V0KHRhcmdldCwgJG9yaWdpbmFsS2V5JCkgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiB2YWx1ZU9yRng7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lO1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm47XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCAmJiAhaGFzT3duKG9wdGlvbnMsIFwidmFsdWVcIikpIHJldHVybjtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcImNsZWFyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8uZW50cmllcz8uKCkgfHwgW10pLCByZXN1bHQgPSB2YWx1ZU9yRngoKTtcblx0XHRcdG9sZFZhbHVlcy5mb3JFYWNoKChbcHJvcCwgb2xkVmFsdWVdKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZGVsZXRlXCIpIHJldHVybiAocHJvcCwgXyA9IG51bGwpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXMocHJvcCksIG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3ApO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInNldFwiKSByZXR1cm4gKHByb3AsIHZhbHVlKSA9PiBwb3RlbnRpYWxseUFzeW5jTWFwKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyhwcm9wKSwgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCwgdik7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRpZiAoIWhhZCB8fCBpc05vdEVxdWFsKG9sZFZhbHVlLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCB2LCBoYWQgPyBvbGRWYWx1ZSA6IG51bGwsIGhhZCA/IFwic2V0XCIgOiBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHByb3AsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0aWYgKG5hbWUgPT0gXCJnZXRPckluc2VydFwiIHx8IG5hbWUgPT0gXCJnZXRPckluc2VydENvbXB1dGVkXCIpIHtcblx0XHRcdGNvbnN0IGNvbXB1dGVkID0gbmFtZSA9PSBcImdldE9ySW5zZXJ0Q29tcHV0ZWRcIjtcblx0XHRcdHJldHVybiAoa2V5LCBkZWZhdWx0T3JDb21wdXRlKSA9PiB7XG5cdFx0XHRcdGlmICh0YXJnZXQuaGFzKGtleSkpIHJldHVybiB0YXJnZXQuZ2V0KGtleSk7XG5cdFx0XHRcdGNvbnN0IGluY29taW5nID0gY29tcHV0ZWQgPyB0eXBlb2YgZGVmYXVsdE9yQ29tcHV0ZSA9PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0T3JDb21wdXRlKGtleSkgOiBkZWZhdWx0T3JDb21wdXRlIDogZGVmYXVsdE9yQ29tcHV0ZTtcblx0XHRcdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmNNYXAoaW5jb21pbmcsICh2KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdHlwZW9mIHRhcmdldC5nZXRPckluc2VydCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQuZ2V0T3JJbnNlcnQoa2V5LCB2KSA6ICh0YXJnZXQuc2V0KGtleSwgdiksIHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0XHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4oa2V5LCB2LCBudWxsLCBcImFkZFwiKTtcblx0XHRcdFx0XHRcdGlmIChpc1Byb21pc2UoaW5jb21pbmcpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBrZXksIHYsIG51bGwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZU9yRng7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZVNldEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdID0gZmFsc2U7XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0dGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsICRleHRyYWN0S2V5JCkgPz8gc2FmZUdldCh0YXJnZXQsICRvcmlnaW5hbEtleSQpID8/IHRhcmdldDtcblx0XHRjb25zdCB2YWx1ZU9yRnggPSBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gdmFsdWVPckZ4O1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZTtcblx0XHRcdGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0YXJnZXQuaGFzKGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiY2xlYXJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlcyA9IEFycmF5LmZyb20odGFyZ2V0Py52YWx1ZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG5cdFx0XHRvbGRWYWx1ZXMuZm9yRWFjaCgob2xkVmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obnVsbCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJkZWxldGVcIikgcmV0dXJuICh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2YWx1ZSksIG9sZFZhbHVlID0gaGFkID8gdmFsdWUgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodmFsdWUpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHZhbHVlLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhZGRcIikgcmV0dXJuICh2YWx1ZSkgPT4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXModiksIG9sZFZhbHVlID0gaGFkID8gdiA6IG51bGwsIHJlc3VsdCA9IHZhbHVlT3JGeCh2KTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdGlmICghaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHYsIHYsIG9sZFZhbHVlLCBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHYsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciAkaXNPYnNlcnZhYmxlID0gKHRhcmdldCkgPT4ge1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSkpO1xufTtcbnZhciBvYnNlcnZlQXJyYXkgPSAoYXJyKSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKGFycikpIHJldHVybiBhcnI7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgoYXJyLCBuZXcgT2JzZXJ2ZUFycmF5SGFuZGxlcigpKSwgYXJyKTtcbn07XG52YXIgb2JzZXJ2ZU9iamVjdCA9IChvYmopID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUob2JqKSkgcmV0dXJuIG9iajtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChvYmosIG5ldyBPYnNlcnZlT2JqZWN0SGFuZGxlcigpKSwgb2JqKTtcbn07XG52YXIgb2JzZXJ2ZU1hcCA9IChtYXApID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUobWFwKSkgcmV0dXJuIG1hcDtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChtYXAsIG5ldyBPYnNlcnZlTWFwSGFuZGxlcigpKSwgbWFwKTtcbn07XG52YXIgb2JzZXJ2ZVNldCA9IChzZXQpID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUoc2V0KSkgcmV0dXJuIHNldDtcblx0cmV0dXJuIHdyYXBXaXRoKHNldCwgbmV3IE9ic2VydmVTZXRIYW5kbGVyKCkpO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvUHJpbWl0aXZlcy50c1xudmFyIG51bWJlclJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IGlzUHJvbWlzZSA/IDAgOiBOdW1iZXIoZGVyZWYoaW5pdGlhbCkgfHwgMCkgfHwgMCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCgodHlwZW9mIHRoaXM/LlskdmFsdWVdICE9IFwib2JqZWN0XCIgPyB0aGlzPy5bJHZhbHVlXSA6IHRoaXM/LlskdmFsdWVdPy52YWx1ZSB8fCAwKSA/PyAwLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4odikgPyBOdW1iZXIodikgOiB0aGlzWyR2YWx1ZV0pIHx8IDA7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gTnVtYmVyKHRoaXNbJHZhbHVlXSB8fCAwKSB8fCAwO1xuXHRcdH1cblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIHN0cmluZ1JlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBcIlwiIDogU3RyaW5nKGRlcmVmKHR5cGVvZiBpbml0aWFsID09IFwibnVtYmVyXCIgPyBTdHJpbmcoaW5pdGlhbCkgOiBpbml0aWFsIHx8IFwiXCIpKSkgPz8gXCJcIixcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSA/PyBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSBTdHJpbmcodHlwZW9mIHYgPT0gXCJudW1iZXJcIiA/IFN0cmluZyh2KSA6IHYgfHwgXCJcIikgPz8gXCJcIjtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpc1skdmFsdWVdID8/IFwiXCIpID8/IFwiXCI7XG5cdFx0fVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgYm9vbGVhblJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBmYWxzZSA6IChkZXJlZihpbml0aWFsKSAhPSBudWxsID8gdHlwZW9mIGRlcmVmKGluaXRpYWwpID09IFwic3RyaW5nXCIgPyB0cnVlIDogISFkZXJlZihpbml0aWFsKSA6IGZhbHNlKSB8fCBmYWxzZSkgfHwgZmFsc2UsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoISF0aGlzPy5bJHZhbHVlXSB8fCBmYWxzZSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gKHYgIT0gbnVsbCA/IHR5cGVvZiB2ID09IFwic3RyaW5nXCIgPyB0cnVlIDogISF2IDogdGhpc1skdmFsdWVdKSB8fCBmYWxzZTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gfHwgZmFsc2U7XG5cdFx0fVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgd3JhcFJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzLnZhbHVlLCBoaW50KTtcblx0XHR9LFxuXHRcdHZhbHVlOiBpc1Byb21pc2UgPyBudWxsIDogZGVyZWYoaW5pdGlhbClcblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZmZlY3RlZChpbml0aWFsLCAodikgPT4ge1xuXHRcdCRyPy5bJHRyaWdnZXJdPy4oKTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgbWFya1JlYWxQcm9wID0gKHRhcmdldCwgcmVhbFByb3ApID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGFyZ2V0ICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRhcmdldDtcblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCAkcmVhbFByb3AsIHtcblx0XHRcdHZhbHVlOiByZWFsUHJvcCxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0gY2F0Y2gge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXJnZXRbJHJlYWxQcm9wXSA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHR0cnkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIFwicmVhbFByb3BcIiwge1xuXHRcdFx0dmFsdWU6IHJlYWxQcm9wLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhcmdldC5yZWFsUHJvcCA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBwcm9wUmVmID0gKHNyYywgc3JjUHJvcCA9IFwidmFsdWVcIiwgaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKHNyYykgfHwgIXNyYykgcmV0dXJuIHNyYztcblx0aWYgKEFycmF5LmlzQXJyYXkoc3JjKSAmJiBzcmMubGVuZ3RoID09IDIgJiYgc3JjWzBdICE9IG51bGwgJiYgKHNyY1swXSBpbnN0YW5jZW9mIE1hcCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrTWFwIHx8IHNyY1swXSBpbnN0YW5jZW9mIFNldCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrU2V0KSkge1xuXHRcdGlmIChzcmNQcm9wID09IG51bGwgfHwgc3JjUHJvcCA9PT0gXCJ2YWx1ZVwiKSBzcmNQcm9wID0gc3JjWzFdO1xuXHRcdHNyYyA9IHNyY1swXTtcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNyYykgJiYgIWlzQXJyYXlJbnZhbGlkS2V5KHNyYz8uWzFdLCBzcmMpICYmIChBcnJheS5pc0FycmF5KHNyYz8uWzBdKSB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJmdW5jdGlvblwiKSkgc3JjID0gc3JjPy5bMF07XG5cdGNvbnN0IGlzTWFwID0gc3JjIGluc3RhbmNlb2YgTWFwIHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtNYXAgfHwgdHlwZW9mIHNyYz8uZ2V0ID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc3JjPy5zZXQgPT0gXCJmdW5jdGlvblwiICYmICh0eXBlb2Ygc3JjPy5kZWxldGUgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBzcmM/LnJlbW92ZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRjb25zdCBpc1NldCA9IHNyYyBpbnN0YW5jZW9mIFNldCB8fCBzcmMgaW5zdGFuY2VvZiBXZWFrU2V0IHx8IHR5cGVvZiBzcmM/LmhhcyA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNyYz8uYWRkID09IFwiZnVuY3Rpb25cIiAmJiAodHlwZW9mIHNyYz8uZGVsZXRlID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygc3JjPy5yZW1vdmUgPT0gXCJmdW5jdGlvblwiKTtcblx0aWYgKGlzTWFwIHx8IGlzU2V0KSB7XG5cdFx0aWYgKHNyY1Byb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHR9IGVsc2UgaWYgKChzcmNQcm9wID8/PSBBcnJheS5pc0FycmF5KHNyYykgPyBudWxsIDogXCJ2YWx1ZVwiKSA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KHNyY1Byb3AsIHNyYykpIHJldHVybjtcblx0Y29uc3QgcmVhZFNsb3QgPSAoKSA9PiB7XG5cdFx0aWYgKGlzTWFwKSByZXR1cm4gc3JjPy5nZXQ/LihzcmNQcm9wKTtcblx0XHRpZiAoaXNTZXQpIHJldHVybiBzcmM/Lmhhcz8uKHNyY1Byb3ApID8gc3JjUHJvcCA6IG51bGw7XG5cdFx0cmV0dXJuIHNyYz8uW3NyY1Byb3BdO1xuXHR9O1xuXHRjb25zdCB3cml0ZVNsb3QgPSAodikgPT4ge1xuXHRcdGlmIChpc01hcCkge1xuXHRcdFx0Y29uc3QgbWFwID0gc3JjO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwodiwgbWFwPy5nZXQ/LihzcmNQcm9wKSkpIG1hcD8uc2V0Py4oc3JjUHJvcCwgdik7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9XG5cdFx0aWYgKGlzU2V0KSB7XG5cdFx0XHRjb25zdCBzZXQgPSBzcmM7XG5cdFx0XHRjb25zdCBtZW1iZXIgPSB2ID8/IHNyY1Byb3A7XG5cdFx0XHRpZiAobWVtYmVyID09IG51bGwpIHtcblx0XHRcdFx0c2V0Py5kZWxldGU/LihzcmNQcm9wKTtcblx0XHRcdFx0cmV0dXJuIG1lbWJlcjtcblx0XHRcdH1cblx0XHRcdGlmICghc2V0Py5oYXM/LihtZW1iZXIpKSBzZXQ/LmFkZD8uKG1lbWJlcik7XG5cdFx0XHRyZXR1cm4gbWVtYmVyO1xuXHRcdH1cblx0XHRpZiAoaXNOb3RFcXVhbCh2LCBzcmM/LltzcmNQcm9wXSkpIHNyY1tzcmNQcm9wXSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH07XG5cdGlmIChpc01hcCAmJiBpbml0aWFsICE9PSB2b2lkIDAgJiYgIXNyYz8uaGFzPy4oc3JjUHJvcCkpIHNyYz8uc2V0Py4oc3JjUHJvcCwgaW5pdGlhbCk7XG5cdGVsc2UgaWYgKGlzU2V0ICYmIGluaXRpYWwgJiYgIXNyYz8uaGFzPy4oc3JjUHJvcCkpIHNyYz8uYWRkPy4oc3JjUHJvcCk7XG5cdGNvbnN0IGN1cnJlbnQgPSByZWFkU2xvdCgpO1xuXHRpZiAoIWlzU2V0ICYmIHNyY1Byb3AgIT0gbnVsbCAmJiBoYXNWYWx1ZShjdXJyZW50KSAmJiBpc09ic2VydmFibGUoY3VycmVudCkpIHJldHVybiBtYXJrUmVhbFByb3AocmVjb3ZlclJlYWN0aXZlKGN1cnJlbnQpLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQgJiYgc3JjUHJvcCAmJiB0eXBlb2Ygc3JjPy5nZXRQcm9wZXJ0eSA9PSBcImZ1bmN0aW9uXCIgJiYgaXNPYnNlcnZhYmxlKHNyYz8uZ2V0UHJvcGVydHk/LihzcmNQcm9wKSkpIHJldHVybiBtYXJrUmVhbFByb3Aoc3JjPy5nZXRQcm9wZXJ0eT8uKHNyY1Byb3ApLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQpIHNyY1tzcmNQcm9wXSA/Pz0gaW5pdGlhbCA/PyBzcmM/LltzcmNQcm9wXTtcblx0ZWxzZSBpZiAoaXNNYXAgJiYgaXNOb3RFcXVhbChpbml0aWFsID8/IHNyYz8uZ2V0Py4oc3JjUHJvcCksIHNyYz8uZ2V0Py4oc3JjUHJvcCkpKSBzcmM/LnNldD8uKHNyY1Byb3AsIGluaXRpYWwgPz8gc3JjPy5nZXQ/LihzcmNQcm9wKSk7XG5cdGVsc2UgaWYgKGlzU2V0ICYmIHNyYz8uaGFzPy4oaW5pdGlhbCA/PyBzcmNQcm9wKSkgc3JjPy5hZGQ/Lihpbml0aWFsID8/IHNyY1Byb3ApO1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IGlzU2V0ID8gcmVhZFNsb3QoKSA6IHJlYWRTbG90KCkgPz8gaW5pdGlhbCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyhyZWFkU2xvdCgpID8/IHRoaXNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludChyZWFkU2xvdCgpLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHRyWyR0cmlnZ2VyTG9jayQxXSA9IHRydWU7XG5cdFx0XHRpZiAoaXNTZXQpIHRoaXNbJHZhbHVlXSA9IHdyaXRlU2xvdCh2KTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjb25zdCBuZXh0ID0gdiA/PyBkZWZhdWx0QnlUeXBlKHJlYWRTbG90KCkpO1xuXHRcdFx0XHR0aGlzWyR2YWx1ZV0gPSB3cml0ZVNsb3QobmV4dCk7XG5cdFx0XHR9XG5cdFx0XHRyWyR0cmlnZ2VyTG9jayQxXSA9IGZhbHNlO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0Y29uc3Qgc2xvdCA9IHJlYWRTbG90KCk7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gc2xvdCA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0bWFya1JlYWxQcm9wKHIsIHNyY1Byb3ApO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzcmMsICh2LCBfcHJvcCwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKF9wcm9wICE9IHNyY1Byb3ApIHJldHVybjtcblx0XHRpZiAoclskdHJpZ2dlckxvY2skMV0pIHJldHVybjtcblx0XHRjb25zdCBuZXh0ID0gaXNTZXQgPyByZWFkU2xvdCgpIDogdjtcblx0XHRjb25zdCBwcmV2ID0gclskdmFsdWVdO1xuXHRcdHJbJHZhbHVlXSA9IG5leHQ7XG5cdFx0clskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiBuZXh0LFxuXHRcdFx0b2xkVmFsdWU6IG9sZCA/PyBwcmV2LFxuXHRcdFx0dHJpZ2dlcjogdHJpZ2dlciA/PyBcInNldFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHI7XG59O1xudmFyICRyZWYgPSAodHlwZWQsIGJlaGF2aW9yKSA9PiB7XG5cdHN3aXRjaCAodHlwZW9mIHR5cGVkKSB7XG5cdFx0Y2FzZSBcImJvb2xlYW5cIjogcmV0dXJuIGJvb2xlYW5SZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwibnVtYmVyXCI6IHJldHVybiBudW1iZXJSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwic3RyaW5nXCI6IHJldHVybiBzdHJpbmdSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwib2JqZWN0XCI6IGlmICh0eXBlZCAhPSBudWxsKSByZXR1cm4gd3JhcFJlZihvYnNlcnZlKHR5cGVkKSwgYmVoYXZpb3IpO1xuXHRcdGRlZmF1bHQ6IHJldHVybiB3cmFwUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdH1cbn07XG52YXIgcmVmID0gKHR5cGVkLCBwcm9wID0gXCJ2YWx1ZVwiLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCAkciA9IGlzT2JzZXJ2YWJsZSh0eXBlZCkgPyB0eXBlZCA6ICRyZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0aWYgKHByb3AgIT0gbnVsbCkgcmV0dXJuIHByb3BSZWYoJHIsIHByb3AsIGJlaGF2aW9yKTtcblx0ZWxzZSByZXR1cm4gJHI7XG59O1xudmFyIHByb21pc2VkID0gKHByb21pc2UsIGJlaGF2aW9yKSA9PiB7XG5cdHJldHVybiByZWYocHJvbWlzZSwgYmVoYXZpb3IpO1xufTtcbnZhciB0cmlnZ2VyV2l0aERlbGF5ID0gKHJlZiwgY2IsIGRlbGF5ID0gMTAwKSA9PiB7XG5cdGlmIChyZWY/LnZhbHVlID8/IHJlZikgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGlmIChyZWYudmFsdWUpIGNiPy4oKTtcblx0fSwgZGVsYXkpO1xufTtcbnZhciBkZWxheWVkQmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHR9O1xufTtcbnZhciBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHRcdGlmICghdG0pIGNiPy4oKTtcblx0fTtcbn07XG5mdW5jdGlvbiBvYnNlcnZlKHRhcmdldCwgc3RhdGVOYW1lKSB7XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0aWYgKCh0YXJnZXQgPSBkZXJlZj8uKHRhcmdldCkpID09IG51bGwgfHwgdGFyZ2V0IGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0YXJnZXQgaW5zdGFuY2VvZiBXZWFrUmVmIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0Y29uc3QgdW53cmFwID0gdGFyZ2V0O1xuXHRpZiAodW53cmFwID09IG51bGwgfHwgdHlwZW9mIHVud3JhcCA9PSBcInN5bWJvbFwiIHx8ICEodHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiKSB8fCB1bndyYXAgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHVud3JhcCBpbnN0YW5jZW9mIFdlYWtSZWYpIHJldHVybiB1bndyYXA7XG5cdGxldCByZWFjdGl2ZSA9IHVud3JhcDtcblx0aWYgKEFycmF5LmlzQXJyYXkodW53cmFwKSkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZUFycmF5KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZU1hcCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVTZXQodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlT2JqZWN0KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9XG5cdHJldHVybiByZWFjdGl2ZTtcbn1cbnZhciBpc09ic2VydmFibGUgPSAodGFyZ2V0KSA9PiB7XG5cdGlmICh0eXBlb2YgSFRNTElucHV0RWxlbWVudCAhPSBcInVuZGVmaW5lZFwiICYmIHRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSB8fCBzdWJzY3JpcHRSZWdpc3RyeT8uaGFzPy4odGFyZ2V0KSkpO1xufTtcbnZhciByZWNvdmVyUmVhY3RpdmUgPSAodGFyZ2V0KSA9PiB7XG5cdHJldHVybiBpc09ic2VydmFibGUodGFyZ2V0KSA/IG9ic2VydmUodGFyZ2V0KSA6IG51bGw7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9NYWlubGluZS50c1xudmFyIHVzZU9ic2VydmFibGUgPSAodW53cmFwKSA9PiB7XG5cdGlmICh1bndyYXAgPT0gbnVsbCB8fCB0eXBlb2YgdW53cmFwICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHVud3JhcCAhPSBcImZ1bmN0aW9uXCIgfHwgdW53cmFwPy5bU3ltYm9sLm9ic2VydmFibGVdICE9IG51bGwpIHJldHVybiB1bndyYXA7XG5cdHRyeSB7XG5cdFx0dW53cmFwW1N5bWJvbC5vYnNlcnZhYmxlXSA9IHNlbGY/LmNvbXBhdGlibGU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRjb25zb2xlLndhcm4oXCJVbmFibGUgdG8gYXNzaWduIDxbU3ltYm9sLm9ic2VydmFibGVdPiwgb2JqZWN0IHdpbGwgbm90IG9ic2VydmFibGUgYnkgb3RoZXIgZnJhbWV3b3Jrc1wiKTtcblx0fVxuXHR1bndyYXBbJGFmZmVjdGVkXSA9IChjYiwgcHJvcCwgb3B0aW9ucykgPT4ge1xuXHRcdGNvbnN0IG9ic2VydmFibGUgPSB1bndyYXA/LltTeW1ib2w/Lm9ic2VydmFibGVdO1xuXHRcdG9ic2VydmFibGU/LigpPy5hZmZlY3RlZD8uKGNiLCBwcm9wLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gKCkgPT4gb2JzZXJ2YWJsZT8uKCk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH07XG5cdHJldHVybiB1bndyYXA7XG59O1xudmFyIHNwZWNpYWxpemVkU3Vic2NyaWJlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgY2hlY2tWYWxpZE9iaiA9IChvYmopID0+IHtcblx0aWYgKHR5cGVvZiBvYmogPT0gXCJzeW1ib2xcIiB8fCBvYmogPT0gbnVsbCB8fCAhKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikpIHJldHVybjtcblx0cmV0dXJuIG9iajtcbn07XG52YXIgaW5pdGlhbFRyaWdnZXIgPSBcImluaXRpYWxcIjtcbnZhciByZWFsUHJvcE9mID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCBwcm9wID0gdGFyZ2V0Py5bJHJlYWxQcm9wXSA/PyB0YXJnZXQ/LnJlYWxQcm9wO1xuXHRyZXR1cm4gaXNLZXlUeXBlKHByb3ApID8gcHJvcCA6IG51bGw7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mKHRhcmdldCk7XG5cdGlmIChyZWFsUHJvcCAhPSBudWxsICYmIChwcm9wID09IG51bGwgfHwgcHJvcCA9PSBcInZhbHVlXCIpKSByZXR1cm4gcmVhbFByb3A7XG5cdHJldHVybiBwcm9wO1xufTtcbnZhciBwcm9wVmFsdWVPZiA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0aWYgKHByb3AgIT0gbnVsbCAmJiBwcm9wID09IHJlYWxQcm9wT2YodGFyZ2V0KSkgcmV0dXJuIHRhcmdldD8udmFsdWU7XG5cdHJldHVybiB0YXJnZXQ/Lltwcm9wXTtcbn07XG52YXIgY2FsbEJ5UHJvcFJlZkF3YXJlID0gKHRhcmdldCwgcHJvcCwgY2IsIGN0eCkgPT4ge1xuXHRpZiAocHJvcCAhPSBudWxsICYmIHByb3AgPT0gcmVhbFByb3BPZih0YXJnZXQpKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSBwcm9wVmFsdWVPZih0YXJnZXQsIHByb3ApO1xuXHRcdGlmICh2YWx1ZSAhPSBudWxsKSByZXR1cm4gY2I/Lih2YWx1ZSwgcHJvcCwgbnVsbCwgXCJzZXRcIik7XG5cdH1cblx0cmV0dXJuIGNhbGxCeVByb3AodGFyZ2V0LCBwcm9wLCBjYiwgY3R4KTtcbn07XG52YXIgd2l0aFRyaWdnZXIgPSAoY2IsIG9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKTtcblx0aWYgKHRyaWdnZXIgPT0gaW5pdGlhbFRyaWdnZXIpIHtcblx0XHRpZiAoIW5vcm1hbGl6ZWQudHJpZ2dlckltbWVkaWF0ZWx5KSByZXR1cm47XG5cdH0gZWxzZSBpZiAoIXRyaWdnZXJGaWx0ZXJBbGxvd3Mobm9ybWFsaXplZC5hZmZlY3RUeXBlcywgdHJpZ2dlcikpIHJldHVybjtcblx0cmV0dXJuICh2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIC4uLmV0YykgPT4gY2I/Lih2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG59O1xudmFyIHN1YnNjcmliZURpcmVjdGx5ID0gKHRhcmdldCwgcHJvcCwgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmICghdGFyZ2V0KSByZXR1cm47XG5cdGlmICghY2hlY2tWYWxpZE9iaih0YXJnZXQpKSByZXR1cm47XG5cdGNvbnN0IHRQcm9wID0gcHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IgPyBub3JtYWxpemVBZmZlY3RlZFByb3AodGFyZ2V0LCBwcm9wKSA6IG51bGw7XG5cdGxldCByZWdpc3RyeSA9IHRhcmdldD8uWyRyZWdpc3RyeUtleSRdID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHR0YXJnZXQgPSB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldDtcblx0cXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuXHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0aWYgKCFpbml0aWFsQ2IpIHJldHVybjtcblx0XHRpZiAodFByb3AgIT0gbnVsbCAmJiB0UHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IpIGNhbGxCeVByb3BSZWZBd2FyZSh0YXJnZXQsIHRQcm9wLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdGVsc2UgY2FsbEJ5QWxsUHJvcCh0YXJnZXQsIGluaXRpYWxDYiwgbnVsbCk7XG5cdH0pO1xuXHRsZXQgdW5TdWIgPSByZWdpc3RyeT8uYWZmZWN0ZWQ/LihjYiwgdFByb3AsIG9wdGlvbnMpO1xuXHRpZiAodGFyZ2V0Py5bU3ltYm9sLmRpc3Bvc2VdKSByZXR1cm4gdW5TdWI7XG5cdGFkZFRvQ2FsbENoYWluKHVuU3ViLCBTeW1ib2wuZGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih1blN1YiwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih0YXJnZXQsIFN5bWJvbC5kaXNwb3NlLCB1blN1Yik7XG5cdGFkZFRvQ2FsbENoYWluKHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRyZXR1cm4gdW5TdWI7XG59O1xudmFyIHN1YnNjcmliZUlucHV0ID0gKHRnLCBfLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgYWZmZWN0VHlwZXMgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucykuYWZmZWN0VHlwZXM7XG5cdGNvbnN0ICRvcHQgPSB7fTtcblx0bGV0IG9sZFZhbHVlID0gdGc/LnZhbHVlO1xuXHRjb25zdCAkY2IgPSAoZXYpID0+IHtcblx0XHRjb25zdCB2YWx1ZSA9IGV2Py50YXJnZXQ/LnZhbHVlO1xuXHRcdGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcInNldFwiKSkgY2I/Lih2YWx1ZSwgXCJ2YWx1ZVwiLCBvbGRWYWx1ZSwgXCJzZXRcIiwgZXYpO1xuXHRcdG9sZFZhbHVlID0gdmFsdWU7XG5cdH07XG5cdHRnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcblx0cmV0dXJuICgpID0+IHRnPy5yZW1vdmVFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcbn07XG52YXIgY2hlY2tJc1BhaXJlZCA9ICh0ZykgPT4ge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh0ZykgJiYgdGc/Lmxlbmd0aCA9PSAyICYmIGNoZWNrVmFsaWRPYmoodGc/LlswXSkgJiYgKGlzS2V5VHlwZSh0Zz8uWzFdKSB8fCB0Zz8uWzFdID09IFN5bWJvbC5pdGVyYXRvcik7XG59O1xudmFyIGlzRWZmZWN0T3B0aW9uc0FyZyA9ICh2YWx1ZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiB2YWx1ZSB8fCBcInRyaWdnZXJzXCIgaW4gdmFsdWUgfHwgXCJ0cmlnZ2VySW1tZWRpYXRlbHlcIiBpbiB2YWx1ZSk7XG59O1xudmFyIG5vcm1hbGl6ZUVmZmVjdFRhcmdldHMgPSAodGFyZ2V0cykgPT4ge1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gW107XG5cdGlmIChBcnJheS5pc0FycmF5KHRhcmdldHMpICYmICFjaGVja0lzUGFpcmVkKHRhcmdldHMpICYmICFpc09ic2VydmFibGUodGFyZ2V0cykpIHJldHVybiB0YXJnZXRzO1xuXHRyZXR1cm4gW3RhcmdldHNdO1xufTtcbnZhciBlZmZlY3RUYXJnZXRDb250ZXh0ID0gKHNvdXJjZSkgPT4ge1xuXHRpZiAoY2hlY2tJc1BhaXJlZChzb3VyY2UpKSB7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gc291cmNlPy5bMF07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNvdXJjZSxcblx0XHRcdHRhcmdldCxcblx0XHRcdHByb3A6IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCh0YXJnZXQsIHNvdXJjZT8uWzFdKVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHtcblx0XHRzb3VyY2UsXG5cdFx0dGFyZ2V0OiBzb3VyY2UsXG5cdFx0cHJvcDogbnVsbFxuXHR9O1xufTtcbnZhciB0b0VmZmVjdEV2ZW50ID0gKHNvdXJjZSwgdGFyZ2V0LCB2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIGFyZ3MpID0+ICh7XG5cdHNvdXJjZSxcblx0dGFyZ2V0LFxuXHR2YWx1ZSxcblx0cHJvcCxcblx0bmFtZTogcHJvcCxcblx0b2xkVmFsdWUsXG5cdHRyaWdnZXIsXG5cdGFyZ3Ncbn0pO1xudmFyIHN1YnNjcmliZVBhaXJlZCA9ICh0ZywgXywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IHByb3AgPSBpc0tleVR5cGUodGc/LlsxXSkgPyB0Zz8uWzFdIDogbnVsbDtcblx0cmV0dXJuIGFmZmVjdGVkKHRnPy5bMF0sIHByb3AsIGNiLCBvcHRpb25zKTtcbn07XG52YXIgc3Vic2NyaWJlVGhlbmFibGUgPSAob2JqLCBwcm9wLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0cmV0dXJuIG9iaj8udGhlbj8uKChvYmopID0+IGFmZmVjdGVkPy4ob2JqLCBwcm9wLCBjYiwgb3B0aW9ucykpPy5jYXRjaD8uKChlKSA9PiB7XG5cdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9KTtcbn07XG52YXIgYWZmZWN0ZWQgPSAob2JqLCBwcm9wLCBjYiA9ICgpID0+IHt9LCBvcHRpb25zKSA9PiB7XG5cdGxldCBrZXkgPSBudWxsO1xuXHRpZiAodHlwZW9mIHByb3AgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0b3B0aW9ucyA9IGNiO1xuXHRcdGNiID0gcHJvcDtcblx0fSBlbHNlIGtleSA9IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcChvYmosIHByb3ApO1xuXHRpZiAodHlwZW9mIGNiID09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShjYikpIHtcblx0XHRvcHRpb25zID0gY2I7XG5cdFx0Y2IgPSAoKSA9PiB7fTtcblx0fVxuXHRpZiAoaXNQcmltaXRpdmUob2JqKSB8fCB0eXBlb2Ygb2JqID09IFwic3ltYm9sXCIpIHtcblx0XHRpZiAobm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpLnRyaWdnZXJJbW1lZGlhdGVseSkgcmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdHJldHVybiBjYj8uKG9iaiwgbnVsbCwgbnVsbCwgbnVsbCwgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdH0pKTtcblx0fVxuXHRpZiAodHlwZW9mIG9iaj8uWyRhZmZlY3RlZF0gPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gb2JqPy5bJGFmZmVjdGVkXT8uKGNiLCBrZXksIG9wdGlvbnMpO1xuXHRlbHNlIGlmIChjaGVja1ZhbGlkT2JqKG9iaikpIHtcblx0XHRjb25zdCB3cmFwcGVkID0gb2JqO1xuXHRcdGlmIChzcGVjaWFsaXplZFN1YnNjcmliZT8uaGFzPy4ob2JqID0gb2JqPy5bJGV4dHJhY3RLZXkkXSA/PyBvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldD8uKG9iaik/Lih3cmFwcGVkLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaXNPYnNlcnZhYmxlKHdyYXBwZWQpIHx8IGNoZWNrSXNQYWlyZWQob2JqKSAmJiBpc09ic2VydmFibGUob2JqPy5bMF0pKSB7XG5cdFx0XHRpZiAoaXNUaGVuYWJsZShvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVUaGVuYWJsZSk/LihvYmosIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdFx0ZWxzZSBpZiAoY2hlY2tJc1BhaXJlZChvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVQYWlyZWQpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBIVE1MSW5wdXRFbGVtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgb2JqIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlSW5wdXQpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlRGlyZWN0bHkpPy4od3JhcHBlZCwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0XHRpZiAoIWluaXRpYWxDYikgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdFx0aWYgKGNoZWNrSXNQYWlyZWQob2JqKSkgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaj8uWzBdLCBvYmo/LlsxXSwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdFx0ZWxzZSBpZiAoa2V5ICE9IG51bGwgJiYga2V5ICE9IFN5bWJvbC5pdGVyYXRvcikgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaiwga2V5LCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0XHRlbHNlIHJldHVybiBjYWxsQnlBbGxQcm9wPy4ob2JqLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxufTtcbmZ1bmN0aW9uIGVmZmVjdChjYiwgdGFyZ2V0cywgb3B0aW9ucykge1xuXHRpZiAoY2IgPT0gbnVsbCB8fCB0eXBlb2YgY2IgIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGlmIChpc0VmZmVjdE9wdGlvbnNBcmcodGFyZ2V0cykgJiYgb3B0aW9ucyA9PT0gdm9pZCAwKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIHRhcmdldHMpO1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIG9wdGlvbnMpO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Y29uc3QgYWZmZWN0ZWRPcHRpb25zID0ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVkLmFmZmVjdFR5cGVzLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogbm9ybWFsaXplZC50cmlnZ2VySW1tZWRpYXRlbHlcblx0fTtcblx0Y29uc3QgZGlzcG9zZXJzID0gbm9ybWFsaXplRWZmZWN0VGFyZ2V0cyh0YXJnZXRzKS5tYXAoKHNvdXJjZSkgPT4ge1xuXHRcdGNvbnN0IGN0eCA9IGVmZmVjdFRhcmdldENvbnRleHQoc291cmNlKTtcblx0XHRyZXR1cm4gYWZmZWN0ZWQoY3R4LnRhcmdldCwgY3R4LnByb3AsICh2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmFyZ3MpID0+IHtcblx0XHRcdHJldHVybiBjYih0b0VmZmVjdEV2ZW50KGN0eC5zb3VyY2UsIGN0eC50YXJnZXQsIHZhbHVlLCBwcm9wLCBvbGRWYWx1ZSwgdHJpZ2dlciA/PyBudWxsLCBhcmdzKSk7XG5cdFx0fSwgYWZmZWN0ZWRPcHRpb25zKTtcblx0fSkuZmlsdGVyKChkaXNwb3NlKSA9PiB0eXBlb2YgZGlzcG9zZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRyZXR1cm4gKCkgPT4gZGlzcG9zZXJzLmZvckVhY2goKGRpc3Bvc2UpID0+IGRpc3Bvc2U/LigpKTtcbn1cbmZ1bmN0aW9uIGVmZmVjdGVkKHRhcmdldHMsIGNiLCBvcHRpb25zKSB7XG5cdHJldHVybiBlZmZlY3QoY2IsIHRhcmdldHMsIG9wdGlvbnMpO1xufVxudmFyIG1ha2VBcnJheU9ic2VydmFibGUgPSAodGcpID0+IHtcblx0aWYgKHRnIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gb2JzZXJ2YWJsZUJ5U2V0KHRnKTtcblx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gb2JzZXJ2YWJsZUJ5TWFwKHRnKTtcblx0cmV0dXJuIHRnO1xufTtcbnZhciBEb3VibGVXZWFrTWFwID0gY2xhc3Mge1xuXHQjdG9wID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdCNlbnN1cmVJbm5lcihrZXkxKSB7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbnVsbDtcblx0XHRsZXQgaW5uZXIgPSB0aGlzLiN0b3AuZ2V0KGtleTEpO1xuXHRcdGlmICghaW5uZXIpIHtcblx0XHRcdGlubmVyID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdFx0XHR0aGlzLiN0b3Auc2V0KGtleTEsIGlubmVyKTtcblx0XHR9XG5cdFx0cmV0dXJuIGlubmVyO1xuXHR9XG5cdCNzcGxpdFBhaXIocGFpcikge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShwYWlyKSB8fCBwYWlyLmxlbmd0aCAhPT0gMikgcmV0dXJuIFtudWxsLCBudWxsXTtcblx0XHRyZXR1cm4gcGFpcjtcblx0fVxuXHRoYXNMMShrZXkxKSB7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5oYXMoa2V5MSk7XG5cdH1cblx0c2V0KHBhaXIsIHZhbHVlKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRoaXM7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRnZXQocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2b2lkIDA7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5nZXQoa2V5MSk/LmdldChrZXkyKTtcblx0fVxuXHRoYXMocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmdldChrZXkxKT8uaGFzKGtleTIpID8/IGZhbHNlO1xuXHR9XG5cdGRlbGV0ZShwYWlyKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jdG9wLmdldChrZXkxKTtcblx0XHRyZXR1cm4gaW5uZXIgPyBpbm5lci5kZWxldGUoa2V5MikgOiBmYWxzZTtcblx0fVxuXHRkZWxldGVUb3Aoa2V5MSkge1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZGVsZXRlKGtleTEpO1xuXHR9XG5cdGdldE9yQ3JlYXRlKHBhaXIsIGZhY3RvcnkpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFjdG9yeT8uKCk7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRjb25zdCB2YWx1ZSA9IGZhY3RvcnkoKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRnZXRPckluc2VydChwYWlyLCB2YWx1ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cdGdldE9ySW5zZXJ0Q29tcHV0ZWQocGFpciwgY29tcHV0ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb21wdXRlPy4oW2tleTEsIGtleTJdKTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGNvbnN0IHZhbHVlID0gY29tcHV0ZShba2V5MSwga2V5Ml0pO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59O1xudmFyIHJlZ2lzdGVyZWRJdGVyYXRlZCA9IG5ldyBEb3VibGVXZWFrTWFwKCk7XG5mdW5jdGlvbiBpdGVyYXRlZCh0ZywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdGlmICghdGcpIHJldHVybjtcblx0aWYgKHR5cGVvZiB0ZyAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGcgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAocmVnaXN0ZXJlZEl0ZXJhdGVkLmhhcyhbdGcsIGNiXSkpIHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0KFt0ZywgY2JdKTtcblx0Y29uc3QgJHN1YiA9ICh2YWx1ZSwgbmFtZSwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZVwiKSB7XG5cdFx0XHRjb25zdCBlbnRyaWVzID0gKG9sZD8udmFsdWUgPz8gb2xkKT8uZW50cmllcz8uKCk7XG5cdFx0XHRjb25zdCBiYXNpcyA9IHRnPy52YWx1ZSA/PyB2YWx1ZT8udmFsdWUgPz8gdmFsdWU7XG5cdFx0XHRpZiAoZW50cmllcykgZm9yIChjb25zdCBbaWR4LCBpdGVtXSBvZiBlbnRyaWVzKSB7XG5cdFx0XHRcdGNvbnN0IG9mT2xkID0gaXRlbSA/PyAob2xkPy52YWx1ZSA/PyBvbGQpPy5baWR4XSA/PyBudWxsO1xuXHRcdFx0XHRjb25zdCBvZk5ldyA9IGJhc2lzPy5baWR4XTtcblx0XHRcdFx0aWYgKG9mT2xkID09IG51bGwgJiYgb2ZOZXcgIT0gbnVsbCkgY2Iob2ZOZXcsIGlkeCwgbnVsbCwgXCJhZGRcIik7XG5cdFx0XHRcdGVsc2UgaWYgKG9mT2xkICE9IG51bGwgJiYgb2ZOZXcgPT0gbnVsbCkgY2IobnVsbCwgaWR4LCBvZk9sZCwgXCJkZWxldGVcIik7XG5cdFx0XHRcdGVsc2UgaWYgKGlzTm90RXF1YWwob2ZPbGQsIG9mTmV3KSkgY2Iob2ZOZXcsIGlkeCwgb2ZPbGQsIFwic2V0XCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGl0ZXJhdGVkKHZhbHVlID8/IHRnPy52YWx1ZSwgY2IsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmFtZSA9PSBudWxsID8gdm9pZCAwIDogdGdbbmFtZV07XG5cdH07XG5cdHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0T3JJbnNlcnRDb21wdXRlZChbdGcsIGNiXSwgKCkgPT4ge1xuXHRcdGlmICh0ZyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIGFmZmVjdGVkKFtvYnNlcnZhYmxlQnlTZXQodGcpLCBTeW1ib2wuaXRlcmF0b3JdLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gYWZmZWN0ZWQodGcsIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaGFzVmFsdWUodGcpKSByZXR1cm4gYWZmZWN0ZWQodGcsICRzdWIsIG9wdGlvbnMpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHRnKSAmJiAhKHRnPy5sZW5ndGggPT0gMiAmJiBpc0tleVR5cGUodGc/LlsxXSkgJiYgaXNPYnNlcnZhYmxlKHRnPy5bMF0pKSkgcmV0dXJuIGFmZmVjdGVkKFt0ZywgU3ltYm9sLml0ZXJhdG9yXSwgY2IsIG9wdGlvbnMpO1xuXHRcdHJldHVybiBhZmZlY3RlZCh0ZywgY2IsIG9wdGlvbnMpO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIHVuYWZmZWN0ZWQodGcsIGNiKSB7XG5cdHJldHVybiB3aXRoUHJvbWlzZSh0ZywgKHRhcmdldCkgPT4ge1xuXHRcdGNvbnN0IGlzUGFpciA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KSAmJiB0YXJnZXQ/Lmxlbmd0aCA9PSAyICYmIFtcIm9iamVjdFwiLCBcImZ1bmN0aW9uXCJdLmluZGV4T2YodHlwZW9mIHRhcmdldD8uWzBdKSA+PSAwICYmIGlzS2V5VHlwZSh0YXJnZXQ/LlsxXSk7XG5cdFx0Y29uc3QgcHJvcCA9IGlzUGFpciA/IHRhcmdldD8uWzFdIDogbnVsbDtcblx0XHR0YXJnZXQgPSBpc1BhaXIgJiYgcHJvcCAhPSBudWxsID8gdGFyZ2V0Py5bMF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdGNvbnN0IHVud3JhcCA9IHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdCh0YXJnZXQ/LlskcmVnaXN0cnlLZXkkXSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKSk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH0pO1xufVxudmFyIGJpbmRCeSA9ICh0YXJnZXQsIHJlYWN0aXZlLCB3YXRjaCkgPT4ge1xuXHRhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHYsIHApID0+IHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2LCBwLCB0cnVlKTtcblx0fSk7XG5cdHdhdGNoPy4oKCkgPT4gdGFyZ2V0LCAoTikgPT4ge1xuXHRcdGZvciAoY29uc3QgayBpbiBOKSBvYmplY3RBc3NpZ24ocmVhY3RpdmUsIE5ba10sIGssIHRydWUpO1xuXHR9LCB7IGRlZXA6IHRydWUgfSk7XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGRlcml2YXRlID0gKGZyb20sIHJlYWN0Rm4sIHdhdGNoKSA9PiBiaW5kQnkocmVhY3RGbihzYWZlKGZyb20pKSwgZnJvbSwgd2F0Y2gpO1xudmFyIGJpbmRCeUtleSA9ICh0YXJnZXQsIHJlYWN0aXZlLCBrZXkgPSAoKSA9PiBcIlwiKSA9PiBhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHZhbHVlLCBwKSA9PiB7XG5cdGlmIChwID09IGtleSgpKSBvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbnVsbCwgdHJ1ZSk7XG59KTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvQXNzaWduZWQudHNcbnZhciBjb25kaXRpb25hbEluZGV4ID0gKGNvbmRMaXN0ID0gW10pID0+IHtcblx0Y29uc3Qgc291cmNlID0gb2JzZXJ2ZSh7IHZhbHVlOiAwIH0pO1xuXHRjb25zdCByZWFkQ29uZGl0aW9uID0gKGNvbmRpdGlvbikgPT4ge1xuXHRcdGlmICh0eXBlb2YgY29uZGl0aW9uID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbmRpdGlvbigpO1xuXHRcdHJldHVybiBoYXNWYWx1ZShjb25kaXRpb24pID8gY29uZGl0aW9uLnZhbHVlIDogY29uZGl0aW9uO1xuXHR9O1xuXHRjb25zdCBldmFsdWF0ZSA9ICgpID0+IGNvbmRMaXN0LmZpbmRJbmRleCgoY29uZGl0aW9uKSA9PiAhIXJlYWRDb25kaXRpb24oY29uZGl0aW9uKSk7XG5cdGNvbnN0IHJlc3VsdCA9IGNvbXB1dGVkKFtzb3VyY2UsIFwidmFsdWVcIl0sIGV2YWx1YXRlLCBcInZhbHVlXCIpO1xuXHRjb25zdCBpbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdHNvdXJjZS52YWx1ZSsrO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlcnMgPSBbXTtcblx0aWYgKGlzT2JzZXJ2YWJsZShjb25kTGlzdCkpIGRpc3Bvc2Vycy5wdXNoKGFmZmVjdGVkKGNvbmRMaXN0LCBpbnZhbGlkYXRlLCB7XG5cdFx0YWZmZWN0VHlwZXM6IFtcblx0XHRcdFwiYWRkXCIsXG5cdFx0XHRcInNldFwiLFxuXHRcdFx0XCJkZWxldGVcIlxuXHRcdF0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIGNvbmRMaXN0KSBpZiAoaGFzVmFsdWUoY29uZGl0aW9uKSkgZGlzcG9zZXJzLnB1c2goYWZmZWN0ZWQoW2NvbmRpdGlvbiwgXCJ2YWx1ZVwiXSwgaW52YWxpZGF0ZSwge1xuXHRcdGFmZmVjdFR5cGVzOiBbXCJzZXR0ZXJcIl0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGFkZFRvQ2FsbENoYWluKHJlc3VsdCwgU3ltYm9sLmRpc3Bvc2UsICgpID0+IGRpc3Bvc2Vycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlPy4oKSkpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbnZhciBjb25kaXRpb25hbFJlZiA9IChjb25kLCBpZlRydWUsIGlmRmFsc2UsIGJlaGF2aW9yKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShjb25kKSkgcmV0dXJuIGNvbmQgPyBpZlRydWUgOiBpZkZhbHNlO1xuXHRjb25zdCBnZXRUcnVlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZlRydWU7XG5cdH07XG5cdGNvbnN0IGdldEZhbHNlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZkZhbHNlO1xuXHR9O1xuXHRjb25zdCB2YWx1ZU9mID0gKG4pID0+IHtcblx0XHRpZiAobiAhPSBudWxsKSBjb25kLnZhbHVlID0gaGFzVmFsdWUobikgPyBuPy52YWx1ZSA6IG47XG5cdFx0cmV0dXJuIChoYXNWYWx1ZShjb25kKSA/IGNvbmQ/LnZhbHVlIDogY29uZCkgPyBnZXRUcnVlKCkgOiBnZXRGYWxzZSgpO1xuXHR9O1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IHZhbHVlT2YoKSxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV0sIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9IHZhbHVlT2Yodik7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gdmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXTtcblx0XHR9XG5cdH0pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChbY29uZCwgXCJ2YWx1ZVwiXSwgKCkgPT4ge1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gcj8uWyR2YWx1ZV07XG5cdFx0Y29uc3QgdmFsdWUgPSB2YWx1ZU9mKCk7XG5cdFx0clskdmFsdWVdID0gdmFsdWU7XG5cdFx0cj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRvbGRWYWx1ZSxcblx0XHRcdHRyaWdnZXI6IFwibWFudWFsXCJcblx0XHR9KTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHIsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcjtcbn07XG52YXIgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbFJlZjtcbnZhciByZW1hcCA9IChzdWIsIGNiLCBkZXN0KSA9PiB7XG5cdGlmICghZGVzdCkgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzdWIsICh2YWx1ZSwgcHJvcCwgb2xkKSA9PiB7XG5cdFx0aWYgKHByb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGNvbnN0IGdvdCA9IGNiPy4odmFsdWUsIHByb3AsIG9sZCk7XG5cdFx0aWYgKHR5cGVvZiBnb3QgPT0gXCJvYmplY3RcIikgb2JqZWN0QXNzaWduTm90RXF1YWwoZGVzdCwgZ290KTtcblx0XHRlbHNlIGlmIChpc05vdEVxdWFsKGRlc3RbcHJvcF0sIGdvdCkpIGRlc3RbcHJvcF0gPSBnb3Q7XG5cdH0pO1xuXHRpZiAoZGVzdCkgYWRkVG9DYWxsQ2hhaW4oZGVzdCwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiBkZXN0O1xufTtcbnZhciB1bmlmaWVkID0gKC4uLnN1YnMpID0+IHtcblx0Y29uc3QgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRzdWJzPy5mb3JFYWNoPy4oKHN1YikgPT4gYWZmZWN0ZWQoc3ViLCAodmFsdWUsIHByb3AsIF8pID0+IHtcblx0XHRpZiAocHJvcCA9PSBudWxsKSByZXR1cm47XG5cdFx0aWYgKGlzTm90RXF1YWwoZGVzdFtwcm9wXSwgdmFsdWUpKSBkZXN0W3Byb3BdID0gdmFsdWU7XG5cdH0pKTtcblx0cmV0dXJuIGRlc3Q7XG59O1xudmFyIG9ic2VydmFibGVCeVNldCA9IChzZXQpID0+IHtcblx0Y29uc3Qgb2JzID0gb2JzZXJ2ZShbXSk7XG5cdG9icy5wdXNoKC4uLkFycmF5LmZyb20oc2V0Py52YWx1ZXM/LigpIHx8IFtdKSk7XG5cdGFkZFRvQ2FsbENoYWluKG9icywgU3ltYm9sLmRpc3Bvc2UsIGFmZmVjdGVkKHNldCwgKHZhbHVlLCBfLCBvbGQpID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2YWx1ZSwgb2xkKSkge1xuXHRcdFx0aWYgKG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwpIG9icy5wdXNoKHZhbHVlKTtcblx0XHRcdGVsc2UgaWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gb2JzLmluZGV4T2Yob2xkKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwKSBvYnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBpZHggPSBvYnMuaW5kZXhPZihvbGQpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDAgJiYgaXNOb3RFcXVhbChvYnNbaWR4XSwgdmFsdWUpKSBvYnNbaWR4XSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkpO1xuXHRyZXR1cm4gb2JzO1xufTtcbnZhciBvYnNlcnZhYmxlQnlNYXAgPSAobWFwKSA9PiB7XG5cdGNvbnN0IG9icyA9IG9ic2VydmUoW10pO1xuXHRjb25zdCBpbml0aWFsRW50cmllcyA9IEFycmF5LmZyb20obWFwLmVudHJpZXMoKSk7XG5cdG9icy5wdXNoKC4uLmluaXRpYWxFbnRyaWVzKTtcblx0YWRkVG9DYWxsQ2hhaW4ob2JzLCBTeW1ib2wuZGlzcG9zZSwgYWZmZWN0ZWQobWFwLCAodmFsdWUsIHByb3AsIG9sZCkgPT4ge1xuXHRcdGlmIChpc05vdEVxdWFsKHZhbHVlLCBvbGQpIHx8IG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwgfHwgb2xkICE9IG51bGwgJiYgdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0aWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0bGV0IGlkeCA9IG9icy5maW5kSW5kZXgoKFtuYW1lLCBfXSkgPT4gbmFtZSA9PSBwcm9wKTtcblx0XHRcdFx0aWYgKGlkeCA8IDApIGlkeCA9IG9icy5maW5kTGFzdEluZGV4KChbXywgdmFsXSkgPT4gb2xkID09PSB2YWwpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDApIG9icy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBpZHggPSBvYnMuZmluZEluZGV4KChbbmFtZSwgX10pID0+IG5hbWUgPT0gcHJvcCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCAmJiBpZHggPCBvYnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2JzW2lkeF0/LlsxXSwgdmFsdWUpKSBvYnNbaWR4XSA9IFtwcm9wLCB2YWx1ZV07XG5cdFx0XHRcdH0gZWxzZSBvYnMucHVzaChbcHJvcCwgdmFsdWVdKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKTtcblx0cmV0dXJuIG9icztcbn07XG52YXIgYXNzaWduTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgYXNzaWduID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgaXNBQ29tcHV0ZSA9IHR5cGVvZiBhPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIGE/Lmxlbmd0aCA9PSAyLCBpc0JDb21wdXRlID0gdHlwZW9mIGI/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgYj8ubGVuZ3RoID09IDIsIGNtcEJGbmMgPSBpc0JDb21wdXRlID8gYj8uWzFdIDogbnVsbDtcblx0Y29uc3QgaXNBUHJvcCA9IChpc0tleVR5cGUoYT8uWzFdKSB8fCBhPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBhPy5sZW5ndGggPT0gMjtcblx0bGV0IGFfcHJvcCA9IGlzQVByb3AgJiYgIWlzQUNvbXB1dGUgPyBhPy5bMV0gOiBBcnJheS5pc0FycmF5KGEpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgYSA9IFthLCBhX3Byb3BdO1xuXHRpZiAoaXNBQ29tcHV0ZSkgYVsxXSA9IGFfcHJvcDtcblx0Y29uc3QgaXNCUHJvcCA9IChpc0tleVR5cGUoYj8uWzFdKSB8fCBiPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBiPy5sZW5ndGggPT0gMjtcblx0bGV0IGJfcHJvcCA9IGlzQlByb3AgJiYgIWlzQkNvbXB1dGUgPyBiPy5bMV0gOiBBcnJheS5pc0FycmF5KGIpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNCUHJvcCAmJiAhaXNCQ29tcHV0ZSkgYiA9IFtiLCBiX3Byb3BdO1xuXHRpZiAoaXNCQ29tcHV0ZSkgYlsxXSA9IGJfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGJfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgYT8uWzBdKSB8fCBpc0FycmF5SW52YWxpZEtleShiX3Byb3AsIGI/LlswXSkpIHJldHVybjtcblx0aWYgKCEoKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgYj8uWzBdICE9IG51bGwpICYmICFBcnJheS5pc0FycmF5KGFbMF0pKSB7XG5cdFx0JGF2b2lkVHJpZ2dlcihiLCAoKSA9PiB7XG5cdFx0XHRhWzBdW2FfcHJvcF0gPSBiPy5bMF07XG5cdFx0fSk7XG5cdFx0cmV0dXJuICgpID0+IHt9O1xuXHR9XG5cdGNvbnN0IGNvbXB1dGUgPSAodiwgcCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IGJfdG1wID0gYlJlZj8uZGVyZWY/LigpO1xuXHRcdGlmIChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uYm91bmQgPT0gYl90bXApIHtcblx0XHRcdGxldCB2YWwgPSBudWxsO1xuXHRcdFx0Y29uc3QgY21wZnggPSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uY21wZng7XG5cdFx0XHQkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgY21wZnggPT0gXCJmdW5jdGlvblwiKSB2YWwgPSBjbXBmeD8uKCRnZXRWYWx1ZShiX3RtcCkgPz8gdiwgcCwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgdmFsID0gYl90bXA/LltwXSA/PyB2O1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBudiA9ICRnZXRWYWx1ZSh2YWwpO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwoYV90bXBbYV9wcm9wXSwgbnYpKSAkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGFfdG1wW2FfcHJvcF0gPSBudjtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSAoKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApKT8uZ2V0Py4oYV9wcm9wKSk/LmRpc3Bvc2U/LigpO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlID0gKCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IG1hcCA9IGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApO1xuXHRcdGNvbnN0IHN0b3JlID0gbWFwPy5nZXQ/LihhX3Byb3ApO1xuXHRcdG1hcD8uZGVsZXRlPy4oYV9wcm9wKTtcblx0XHRzdG9yZT8udW5zdWI/LigpO1xuXHR9O1xuXHRjb25zdCBiUmVmID0gYj8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShiPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBiPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihiPy5bMF0pIDogYj8uWzBdLCBhUmVmID0gYT8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBhPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYT8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShhPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBhPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihhPy5bMF0pIDogYT8uWzBdO1xuXHRsZXQgc3RvcmUgPSB7XG5cdFx0Y29tcHV0ZSxcblx0XHRkaXNwb3NlLFxuXHRcdGNtcGZ4OiBjbXBCRm5jXG5cdH07XG5cdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpLCBiX3RtcCA9IGJSZWY/LmRlcmVmPy4oKTtcblx0aWYgKGFSZWYgaW5zdGFuY2VvZiBXZWFrUmVmKSB7XG5cdFx0aWYgKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5nZXQ/LihhX3Byb3ApPy5ib3VuZCAhPSBiX3RtcCkgYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmRlbGV0ZT8uKGFfcHJvcCk7XG5cdFx0c3RvcmUgPSAoYXNzaWduTWFwPy5nZXRPckluc2VydD8uKGFfdG1wLCAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKSk/LmdldE9ySW5zZXJ0Q29tcHV0ZWQ/LihhX3Byb3AsICgpID0+ICh7XG5cdFx0XHRib3VuZDogYl90bXAsXG5cdFx0XHRjbXBmeDogY21wQkZuYyxcblx0XHRcdHVuc3ViOiBudWxsLFxuXHRcdFx0Y29tcHV0ZSxcblx0XHRcdGRpc3Bvc2Vcblx0XHR9KSk7XG5cdFx0c3RvcmUudW5zdWIgPSBhZmZlY3RlZChiLCBjb21wdXRlKTtcblx0XHRzdG9yZS5jbXBmeCA9IGNtcEJGbmM7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYV90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYl90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdH1cblx0aWYgKGJfdG1wICYmICFBcnJheS5pc0FycmF5KGJfdG1wKSkgJGF2b2lkVHJpZ2dlcihhX3RtcCwgKCkgPT4ge1xuXHRcdGJfdG1wW2JfcHJvcF0gPz89IGFfdG1wPy5bYV9wcm9wXSA/PyBiX3RtcFtiX3Byb3BdO1xuXHR9KTtcblx0cmV0dXJuIHN0b3JlPy5kaXNwb3NlO1xufTtcbnZhciBsaW5rID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgdXN1YiA9IFthc3NpZ24oYSwgYiwgcHJvcCksIGFzc2lnbihiLCBhLCBwcm9wKV07XG5cdHJldHVybiAoKSA9PiB1c3ViPy5tYXA/LigoYykgPT4gYz8uKCkpO1xufTtcbnZhciBjb21wdXRlZCA9IChzcmMsIGNiLCBiZWhhdmlvciwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRjb25zdCBpc0FDb21wdXRlID0gdHlwZW9mIHNyYz8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRjb25zdCBpc0FQcm9wID0gKGlzS2V5VHlwZShzcmM/LlsxXSkgfHwgc3JjPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRsZXQgYV9wcm9wID0gaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSA/IHNyYz8uWzFdIDogQXJyYXkuaXNBcnJheShzcmMpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgc3JjID0gW2lzQVByb3AgPyBzcmM/LlswXSA6IHNyYywgYV9wcm9wXTtcblx0aWYgKGlzQUNvbXB1dGUpIHNyY1sxXSA9IGFfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgc3JjPy5bMF0pKSByZXR1cm47XG5cdGxldCBvbGRWYWx1ZSA9IHZvaWQgMDtcblx0bGV0IG9sZEFyZyA9IHZvaWQgMDtcblx0Y29uc3QgY21wID0gKGFyZywgZm9yY2UpID0+IHtcblx0XHRhcmcgPz89IHNyYz8uWzBdPy5bYV9wcm9wXSA/PyBvbGRBcmcgPz8gYXJnO1xuXHRcdGlmIChmb3JjZSB8fCBpc05vdEVxdWFsKG9sZEFyZywgYXJnKSB8fCBvbGRWYWx1ZSA9PSB2b2lkIDApIHJldHVybiBjYj8uKGFyZywgYV9wcm9wLCBvbGRBcmcpO1xuXHRcdHJldHVybiBvbGRWYWx1ZTtcblx0fTtcblx0Y29uc3Qgd3JwRnVuYyA9IChhcmcsIHByb3AgPSBcInZhbHVlXCIsIG9sZEFyZyQsIG9wKSA9PiB7XG5cdFx0b2xkQXJnID0gb2xkQXJnJCA/PyBvbGRBcmc7XG5cdFx0YXJnID8/PSBzcmM/LlswXT8uW2FfcHJvcF07XG5cdFx0aWYgKGlzTm90RXF1YWwob2xkQXJnLCBhcmcpIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0bGV0IG52ID0gY2I/LihhcmcsIGFfcHJvcCwgb2xkQXJnLCBvcCk7XG5cdFx0XHRvbGRBcmcgPSBhcmc7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbChudiwgb2xkVmFsdWUpIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0XHRyZltwcm9wXSA9IG9sZFZhbHVlID0gbnY7XG5cdFx0XHRcdG9sZFZhbHVlID0gcmZbcHJvcF07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnY7XG5cdFx0fVxuXHRcdHJldHVybiByZltwcm9wXTtcblx0fTtcblx0Y29uc3QgaW5pdGlhbCA9IGNtcChzcmNbMF1bYV9wcm9wXSA/PyBvbGRBcmcpO1xuXHRjb25zdCBwZW5kaW5nSW5pdGlhbCA9IGlzUHJvbWlzZShpbml0aWFsKTtcblx0Y29uc3QgJGFwcGx5ID0gU3ltYm9sLmZvcihcIkBAYXBwbHlcIik7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkcHJvbWlzZSwge1xuXHRcdHZhbHVlOiBpbml0aWFsLFxuXHRcdHdyaXRhYmxlOiB0cnVlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgJHZhbHVlLCB7XG5cdFx0dmFsdWU6IGluaXRpYWwsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkYmVoYXZpb3IsIHtcblx0XHR2YWx1ZTogYmVoYXZpb3IsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBTeW1ib2w/LnRvU3RyaW5nVGFnLCB7XG5cdFx0dmFsdWU6IFN0cmluZyh3cnBGdW5jWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIixcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsIFN5bWJvbD8udG9QcmltaXRpdmUsIHtcblx0XHR2YWx1ZTogdHJ5UGFyc2VCeUhpbnQod3JwRnVuY1skdmFsdWVdLCBcIm51bWJlclwiKSxcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsIFwidmFsdWVcIiwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGNwID0gY21wKCk7XG5cdFx0XHRpZiAoY3AgIT0gbnVsbCkgd3JwRnVuY1skdmFsdWVdID0gY3A7XG5cdFx0XHRyZXR1cm4gd3JwRnVuY1skdmFsdWVdO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHR3cnBGdW5jWyR2YWx1ZV0gPSBjbXAodiwgdHJ1ZSk7XG5cdFx0fVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRhcHBseSwge1xuXHRcdHZhbHVlOiAodikgPT4ge1xuXHRcdFx0cmV0dXJuIGNiPy4odiwgYV9wcm9wLCB2b2lkIDApO1xuXHRcdH0sXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdGNvbnN0IHJmID0gb2JzZXJ2ZSh3cnBGdW5jKTtcblx0Y29uc3Qgd3JpdGVDb21wdXRlZCA9ICh2YWx1ZSwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKCh2KSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHJmPy5bJHZhbHVlXTtcblx0XHRcdHJmWyR2YWx1ZV0gPSB2O1xuXHRcdFx0cmY/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0XHR2YWx1ZTogdixcblx0XHRcdFx0b2xkVmFsdWUsXG5cdFx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9KTtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHJmPy5bJHZhbHVlXTtcblx0XHRyZlskdmFsdWVdID0gdmFsdWU7XG5cdFx0cmY/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlLFxuXHRcdFx0b2xkVmFsdWUsXG5cdFx0XHR0cmlnZ2VyXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xuXHRpZiAocGVuZGluZ0luaXRpYWwpIHdyaXRlQ29tcHV0ZWQoaW5pdGlhbCwgXCJyZXNvbHZlZFwiKTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoW3NyYz8uWzBdID8/IHNyYywgYV9wcm9wID8/IFwidmFsdWVcIl0sICgpID0+IHtcblx0XHR3cml0ZUNvbXB1dGVkKGNtcCgpLCBcIm1hbnVhbFwiKTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHJmLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHJmO1xufTtcbnZhciBkZWxheWVkU3Vic2NyaWJlID0gKHJlZiwgY2IsIGRlbGF5ID0gMTAwKSA9PiB7XG5cdGxldCB0bTtcblx0cmV0dXJuIGFmZmVjdGVkKHJlZiwgXCJ2YWx1ZVwiLCAodikgPT4ge1xuXHRcdGlmICghdiAmJiB0bSkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRtKTtcblx0XHRcdHRtID0gbnVsbDtcblx0XHR9IGVsc2UgaWYgKHYgJiYgIXRtKSB0bSA9IHRyaWdnZXJXaXRoRGVsYXkocmVmLCBjYiwgZGVsYXkpID8/IHRtO1xuXHR9KTtcbn07XG5cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgJGFmZmVjdGVkLCAkcmVmLCAkcmVzb2x2ZWQsICR0cmlnZ2VyLCAkdHJpZ2dlckNvbnRyb2wsICR0cmlnZ2VyTGVzcywgJHRyaWdnZXJMb2NrLCBBc3NpZ25PYmplY3RIYW5kbGVyLCBEb3VibGVXZWFrTWFwLCBhZGRUb0NhbGxDaGFpbiwgYWZmZWN0ZWQsIGFzc2lnbiwgYXNzaWduTWFwLCBiaW5kQnksIGJpbmRCeUtleSwgYm9vbGVhblJlZiwgY29tcHV0ZWQsIGNvbmRpdGlvbmFsLCBjb25kaXRpb25hbEluZGV4LCBjb25kaXRpb25hbFJlZiwgZGVsYXllZEJlaGF2aW9yLCBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IsIGRlbGF5ZWRTdWJzY3JpYmUsIGRlcmVmLCBkZXJpdmF0ZSwgZWZmZWN0LCBlZmZlY3RlZCwgaXNPYnNlcnZhYmxlLCBpdGVyYXRlZCwgbGluaywgbWFrZUFycmF5T2JzZXJ2YWJsZSwgbWFrZU9iamVjdEFzc2lnbmFibGUsIG1ha2VSZXNvbHZlZE9wLCBudW1iZXJSZWYsIG9ic2VydmFibGVCeU1hcCwgb2JzZXJ2YWJsZUJ5U2V0LCBvYnNlcnZlLCBwcm9taXNlZCwgcHJvcFJlZiwgcmVjb3ZlclJlYWN0aXZlLCByZWYsIHJlbWFwLCByZXNvbHZlZCwgc2FmZSwgc3BlY2lhbGl6ZWRTdWJzY3JpYmUsIHN0cmluZ1JlZiwgc3Vic2NyaWJlRGlyZWN0bHksIHN1YnNjcmliZUlucHV0LCBzdWJzY3JpYmVQYWlyZWQsIHN1YnNjcmliZVRoZW5hYmxlLCB0cmlnZ2VyV2l0aERlbGF5LCB1bmFmZmVjdGVkLCB1bmlmaWVkLCB1bndyYXAsIHVzZU9ic2VydmFibGUsIHdyYXBSZWYsIHdyYXBTZXRBc0FycmF5IH07Il0sCiAgIm1hcHBpbmdzIjogIkFBQUEsU0FBUyxpQkFBQUEsSUFBZSxhQUFBQyxJQUFXLGdCQUFnQkMsSUFBZ0IsWUFBQUMsSUFBVSxXQUFBQyxHQUFTLGlCQUFBQyxJQUFlLGNBQUFDLElBQVksaUJBQUFDLElBQWUsWUFBQUMsR0FBVSxxQkFBQUMsSUFBbUIsYUFBQUMsR0FBVyxjQUFBQyxHQUFZLGVBQUFDLEdBQWEsYUFBQUMsR0FBVyxtQkFBQUMsSUFBaUIsZ0JBQUFDLElBQWMsd0JBQUFDLElBQXNCLG9CQUFBQyxJQUFrQix1QkFBQUMsSUFBcUIsWUFBWUMsSUFBWSxrQkFBQUMsU0FBc0I7QUFHdFYsT0FBTyxlQUFlLHVCQUFPLElBQUksWUFBWTtBQUM3QyxPQUFPLGNBQWMsdUJBQU8sSUFBSSxXQUFXO0FBQzNDLE9BQU8sZ0JBQWdCLHVCQUFPLElBQUksYUFBYTtBQUMvQyxJQUFJQyxJQUFTLHVCQUFPLElBQUksUUFBUSxHQUM1QkMsSUFBZSx1QkFBTyxJQUFJLFVBQVUsR0FDcENDLElBQWdCLHVCQUFPLElBQUksU0FBUyxHQUNwQ0MsS0FBZ0IsdUJBQU8sSUFBSSxXQUFXLEdBQ3RDQyxJQUFZLHVCQUFPLElBQUksV0FBVyxHQUNsQ0MsSUFBVyx1QkFBTyxJQUFJLFVBQVUsR0FDaENDLEtBQVksdUJBQU8sSUFBSSxXQUFXLEdBQ2xDQyxLQUFlLHVCQUFPLElBQUksZUFB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S2tILEtBQVUsT0FBTyxHQUFHLE1BQU07QUFDaEUsSUFBQXVCLEVBQWNWLEVBQUksR0FBRyxRQUFRO0FBQUEsRUFDOUIsQ0FBQztBQUNELFNBQUF6VyxFQUFlK1csR0FBSSxPQUFPLFNBQVMzSCxDQUFHLEdBQy9CMkg7QUFDUixHQUNJSyxLQUFtQixDQUFDM0gsR0FBSzdQLEdBQUlpUSxJQUFRLFFBQVE7QUFDaEQsTUFBSUc7QUFDSixTQUFPckYsRUFBUzhFLEdBQUssU0FBUyxDQUFDN0gsTUFBTTtBQUNwQyxJQUFJLENBQUNBLEtBQUtvSSxLQUNULGFBQWFBLENBQUUsR0FDZkEsSUFBSyxRQUNLcEksS0FBSyxDQUFDb0ksTUFBSUEsSUFBS0osR0FBaUJILEdBQUs3UCxHQUFJaVEsQ0FBSyxLQUFLRztBQUFBLEVBQy9ELENBQUM7QUFDRjsiLAogICJuYW1lcyI6IFsiJGF2b2lkVHJpZ2dlciIsICIkZ2V0VmFsdWUiLCAiJHRyaWdnZXJMb2NrJDEiLCAiUHJvbWlzZWQiLCAiYmluZEN0eCIsICJjYWxsQnlBbGxQcm9wIiwgImNhbGxCeVByb3AiLCAiZGVmYXVsdEJ5VHlwZSIsICJoYXNWYWx1ZSIsICJpc0FycmF5SW52YWxpZEtleSIsICJpc0tleVR5cGUiLCAiaXNOb3RFcXVhbCIsICJpc1ByaW1pdGl2ZSIsICJpc1Byb21pc2UiLCAibWFrZVRyaWdnZXJMZXNzIiwgIm9iamVjdEFzc2lnbiIsICJvYmplY3RBc3NpZ25Ob3RFcXVhbCIsICJwb3RlbnRpYWxseUFzeW5jIiwgInBvdGVudGlhbGx5QXN5bmNNYXAiLCAicmVzb2x2ZWQkMSIsICJ0cnlQYXJzZUJ5SGludCIsICIkdmFsdWUiLCAiJGV4dHJhY3RLZXkkIiwgIiRvcmlnaW5hbEtleSQiLCAiJHJlZ2lzdHJ5S2V5JCIsICIkYmVoYXZpb3IiLCAiJHByb21pc2UiLCAiJHJlc29sdmVkIiwgIiR0cmlnZ2VyTGVzcyIsICIkdHJpZ2dlckxvY2siLCAiJHRyaWdnZXJDb250cm9sIiwgIiR0cmlnZ2VyIiwgIiRhZmZlY3RlZCIsICIkaXNOb3RFcXVhbCIsICIkcmVhbFByb3AiLCAiJG9yaWdpbmFsT2JqZWN0cyQiLCAic2FmZSIsICJ0YXJnZXQiLCAidW53cmFwIiwgIm1hcHBlZCIsICJlIiwgIksiLCAiViIsICJhcnIiLCAiZGVyZWYiLCAiZGlzY291bnRWYWx1ZSIsICJvcmlnaW5hbCIsICIkdmFsIiwgImlzVGhlbmFibGUiLCAidmFsIiwgIndpdGhQcm9taXNlIiwgImNiIiwgImRpc3Bvc2VNYXAiLCAiZGlzcG9zZVJlZ2lzdHJ5IiwgImNhbGxzdGFjayIsICJhZGRUb0NhbGxDaGFpbiIsICJvYmoiLCAibWV0aG9kS2V5IiwgImNhbGxiYWNrIiwgImNoYWluVGFyZ2V0IiwgIkNhbGxDaGFpbiIsICJhcmdzIiwgImlzQXJyYXlJbmRleCIsICJwcm9wIiwgIm51bSIsICJ3cmFwU2V0QXNBcnJheSIsICJzb3VyY2UiLCAib3B0aW9ucyIsICJiYWNraW5nU2V0IiwgIm5vdGlmeUR1cGxpY2F0ZSIsICJ2YWx1ZSIsICJ2aWEiLCAiaW5kZXgiLCAiaXRlbSIsICJzbmFwc2hvdCIsICJyZWJ1aWxkRnJvbSIsICJtZXRob2RzIiwgIml0ZW1zIiwgInNpemUiLCAiaXRlcmF0b3IiLCAiY3VycmVudCIsICJ0b1ByZXBlbmQiLCAibmV4dCIsICJzdGFydCIsICJkZWxldGVDb3VudCIsICJub3JtYWxpemVkU3RhcnQiLCAiYWN0dWFsRGVsZXRlQ291bnQiLCAicmVtb3ZlZCIsICJpbnNlcnRQb3NpdGlvbiIsICJfIiwgIm5leHRMZW5ndGgiLCAibmV4dFZhbHVlIiwgImN1cnJlbnRWYWx1ZSIsICJpZHgiLCAia2V5cyIsICJpIiwgIkFzc2lnbk9iamVjdEhhbmRsZXIiLCAibmFtZSIsICJuZXdUIiwgImN0eCIsICJtYWtlT2JqZWN0QXNzaWduYWJsZSIsICJweCIsICJ3aXRoVW5zdWJTeW1ib2wiLCAid2l0aFVuc3ViIiwgImNvbXBsZXRlV2l0aFVuc3ViIiwgInN1YnNjcmliZXIiLCAid2VhayIsICJoYW5kbGVyIiwgInJlZ2lzdHJ5IiwgInNhdkNvbXBsZXRlIiwgInVuYWZmZWN0ZWQiLCAiciIsICJzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbCIsICJzdWJzY3JpcHRSZWdpc3RyeSIsICJnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2wiLCAiZ2xvYmFsRWZmZWN0TGlzdGVuZXJzIiwgImVmZmVjdEdsb2JhbGx5IiwgIm5vcm1hbGl6ZWQiLCAibm9ybWFsaXplRWZmZWN0T3B0aW9ucyIsICJ3cmFwcGVkU3ltYm9sIiwgIndyYXBwZWQiLCAicmVnaXN0ZXIiLCAid2hhdCIsICJoYW5kbGUiLCAiU3Vic2NyaXB0IiwgIndyYXBXaXRoIiwgImZvckFsbCIsICJ3aWxkY2FyZFRyaWdnZXJzIiwgInRyaWdnZXJBbGlhc2VzIiwgInRyaWdnZXJDYW5vbmljYWxOYW1lc1N5bWJvbCIsICJjYW5vbmljYWwiLCAiYWxpYXNlcyIsICJhbGlhcyIsICJ0cmlnZ2VyQ2Fub25pY2FsTmFtZXMiLCAibm9ybWFsaXplVHJpZ2dlck5hbWUiLCAidHJpZ2dlciIsICJ0cmlnZ2VyTmFtZXNPZiIsICJleHBhbmRUcmlnZ2VyRmlsdGVyIiwgInR5cGVzIiwgIm5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIiLCAidHJpZ2dlcnMiLCAibGlzdCIsICJ0cmlnZ2VyRmlsdGVyQWxsb3dzIiwgImZpbHRlciIsICJpc09wdGlvbnNPYmplY3QiLCAibm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zIiwgImFmZmVjdFR5cGVzIiwgIlN1YnNjcmlwdFN5bWJvbCIsICIjc291cmNlIiwgIiNsaXN0ZW5lcnMiLCAiI2ZsYWdzIiwgIiNuYXRpdmUiLCAiI2l0ZXJhdG9yIiwgIiNpbkRpc3BhdGNoIiwgIiNkaXNhYmxlZFRyaWdnZXJzIiwgIiN0cmlnZ2VyQ29udHJvbCIsICIjcGVuZGluZyIsICIjcGVuZGluZ0J5UHJvcCIsICIjZmx1c2hTY2hlZHVsZWQiLCAiZW5hYmxlZCIsICIjZGlzcGF0Y2giLCAiY29udHJvbGxlciIsICJyZXMiLCAib2xkVmFsdWUiLCAiZXRjIiwgImxpc3RlbmVycyIsICJyZWNvcmQiLCAiZXZlbnQiLCAibnciLCAibmFtZXMiLCAicHJldmlvdXMiLCAicmVzdG9yZSIsICJ3YXNEaXNhYmxlZCIsICJyZXN1bHQiLCAib3BLZXkiLCAiYnlPcCIsICJiYXRjaCIsICJvcE1hcCIsICJubSIsICJ2IiwgIm92IiwgInRnIiwgInJlc3QiLCAicmF3T2YiLCAidW53cmFwcGVkIiwgInJlc29sdmVkIiwgIm1vZGUiLCAicmF3IiwgIm1ha2VSZXNvbHZlZE9wIiwgImVtaXQiLCAicnVuIiwgInBlbmRpbmciLCAia2V5IiwgImNhbGxiYWNrT3JWYWx1ZSIsICJlbWl0UmVzb2x2ZWQiLCAiYmluZEV4aXN0aW5nVGhlbmFibGVzIiwgImxpdmUiLCAiX19zYWZlR2V0R3VhcmRTeW1ib2wiLCAiX19zeXN0ZW1Ta2lwIiwgInN5c3RlbVNraXBHZXQiLCAiZ290IiwgInNhZmVHZXQiLCAiX19zYWZlR2V0R3VhcmQiLCAiaXNHZXR0ZXIiLCAicHJvcE5hbWUiLCAiZmFsbFRocm91Z2giLCAidG1wIiwgInNhZmVTZXQiLCAiYWN0aXZlIiwgInJlYyIsICJoYXNPd24iLCAiaXNUcmlnZ2VyRW1pdE9wdGlvbnMiLCAiYWxsb3dWYWx1ZU9ubHkiLCAidHJpZ2dlck9wdGlvblZhbHVlIiwgImZhbGxiYWNrIiwgInRyaWdnZXJPcHRpb25UcmlnZ2VyIiwgImlzUnVudGltZUtleSIsICJyZWFsUHJvcE9mJDEiLCAidHJpZ2dlcktleU9mIiwgInRyaWdnZXJWYWx1ZU9mIiwgInJlYWxQcm9wIiwgImNyZWF0ZVRyaWdnZXJBUEkiLCAiYXBpIiwgIm9wT3JPcHRpb25zIiwgImNvbnRyb2wiLCAic3lzdGVtR2V0IiwgImFmZmVjdGVkIiwgIm9ic2VydmFibGVBUElNZXRob2RzIiwgInVzdWIiLCAiY29tcCIsICJPYnNlcnZlQXJyYXlNZXRob2QiLCAiI25hbWUiLCAiI3NlbGYiLCAiI2hhbmRsZSIsICJzZWxmIiwgInNraXAiLCAiYWRkZWQiLCAic2V0UGFpcnMiLCAib2xkU3RhdGUiLCAib2JzZXJ2ZUFycmF5IiwgIm5ld1ZhbHVlIiwgInJlZyIsICJJIiwgInBhaXIiLCAidHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UiLCAib2xkTGVuIiwgIm5ld0xlbiIsICJyZW1vdmVkSXRlbXMiLCAiYWRkZWRDb3VudCIsICJPYnNlcnZlQXJyYXlIYW5kbGVyIiwgInN5cyIsICJvYnMiLCAib2xkIiwgInh5enciLCAicmdiYSIsICJ4eXp3X2lkeCIsICJyZ2JhX2lkeCIsICJPYnNlcnZlT2JqZWN0SGFuZGxlciIsICJoaW50IiwgImZ0IiwgIiRvcmlnaW5hbCIsICJ0cmlnZ2VyTmFtZSIsICJzdWJzY3JpcHQiLCAiZGVzY3JpcHRvciIsICIkcmVzdWx0IiwgIk9ic2VydmVNYXBIYW5kbGVyIiwgInZhbHVlT3JGeCIsICJvbGRWYWx1ZXMiLCAiaGFkIiwgImNvbXB1dGVkIiwgImRlZmF1bHRPckNvbXB1dGUiLCAiaW5jb21pbmciLCAiT2JzZXJ2ZVNldEhhbmRsZXIiLCAiJGlzT2JzZXJ2YWJsZSIsICJvYnNlcnZlT2JqZWN0IiwgIm9ic2VydmVNYXAiLCAibWFwIiwgIm9ic2VydmVTZXQiLCAic2V0IiwgIm51bWJlclJlZiIsICJpbml0aWFsIiwgImJlaGF2aW9yIiwgIiRyIiwgIm9ic2VydmUiLCAic3RyaW5nUmVmIiwgImJvb2xlYW5SZWYiLCAid3JhcFJlZiIsICJtYXJrUmVhbFByb3AiLCAicHJvcFJlZiIsICJzcmMiLCAic3JjUHJvcCIsICJpc01hcCIsICJpc1NldCIsICJyZWFkU2xvdCIsICJ3cml0ZVNsb3QiLCAibWVtYmVyIiwgImlzT2JzZXJ2YWJsZSIsICJyZWNvdmVyUmVhY3RpdmUiLCAic2xvdCIsICJ1c2IiLCAiX3Byb3AiLCAicHJldiIsICIkcmVmIiwgInR5cGVkIiwgInJlZiIsICJwcm9taXNlZCIsICJwcm9taXNlIiwgInRyaWdnZXJXaXRoRGVsYXkiLCAiZGVsYXkiLCAiZGVsYXllZEJlaGF2aW9yIiwgInNpZyIsICJ0bSIsICJkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IiLCAic3RhdGVOYW1lIiwgInJlYWN0aXZlIiwgInVzZU9ic2VydmFibGUiLCAib2JzZXJ2YWJsZSIsICJzcGVjaWFsaXplZFN1YnNjcmliZSIsICJjaGVja1ZhbGlkT2JqIiwgImluaXRpYWxUcmlnZ2VyIiwgInJlYWxQcm9wT2YiLCAibm9ybWFsaXplQWZmZWN0ZWRQcm9wIiwgInByb3BWYWx1ZU9mIiwgImNhbGxCeVByb3BSZWZBd2FyZSIsICJ3aXRoVHJpZ2dlciIsICJzdWJzY3JpYmVEaXJlY3RseSIsICJ0UHJvcCIsICJpbml0aWFsQ2IiLCAidW5TdWIiLCAic3Vic2NyaWJlSW5wdXQiLCAiJG9wdCIsICIkY2IiLCAiZXYiLCAiY2hlY2tJc1BhaXJlZCIsICJpc0VmZmVjdE9wdGlvbnNBcmciLCAibm9ybWFsaXplRWZmZWN0VGFyZ2V0cyIsICJ0YXJnZXRzIiwgImVmZmVjdFRhcmdldENvbnRleHQiLCAidG9FZmZlY3RFdmVudCIsICJzdWJzY3JpYmVQYWlyZWQiLCAic3Vic2NyaWJlVGhlbmFibGUiLCAiZWZmZWN0IiwgImFmZmVjdGVkT3B0aW9ucyIsICJkaXNwb3NlcnMiLCAiZGlzcG9zZSIsICJlZmZlY3RlZCIsICJtYWtlQXJyYXlPYnNlcnZhYmxlIiwgIm9ic2VydmFibGVCeVNldCIsICJvYnNlcnZhYmxlQnlNYXAiLCAiRG91YmxlV2Vha01hcCIsICIjdG9wIiwgIiNlbnN1cmVJbm5lciIsICJrZXkxIiwgImlubmVyIiwgIiNzcGxpdFBhaXIiLCAia2V5MiIsICJmYWN0b3J5IiwgImNvbXB1dGUiLCAicmVnaXN0ZXJlZEl0ZXJhdGVkIiwgIml0ZXJhdGVkIiwgIiRzdWIiLCAiZW50cmllcyIsICJiYXNpcyIsICJvZk9sZCIsICJvZk5ldyIsICJpc1BhaXIiLCAiYmluZEJ5IiwgIndhdGNoIiwgInAiLCAiTiIsICJrIiwgImRlcml2YXRlIiwgImZyb20iLCAicmVhY3RGbiIsICJiaW5kQnlLZXkiLCAiY29uZGl0aW9uYWxJbmRleCIsICJjb25kTGlzdCIsICJyZWFkQ29uZGl0aW9uIiwgImNvbmRpdGlvbiIsICJpbnZhbGlkYXRlIiwgImNvbmRpdGlvbmFsUmVmIiwgImNvbmQiLCAiaWZUcnVlIiwgImlmRmFsc2UiLCAiZ2V0VHJ1ZSIsICJnZXRGYWxzZSIsICJ2YWx1ZU9mIiwgIm4iLCAiY29uZGl0aW9uYWwiLCAicmVtYXAiLCAic3ViIiwgImRlc3QiLCAidW5pZmllZCIsICJzdWJzIiwgImluaXRpYWxFbnRyaWVzIiwgImFzc2lnbk1hcCIsICJhc3NpZ24iLCAiYSIsICJiIiwgImlzQUNvbXB1dGUiLCAiaXNCQ29tcHV0ZSIsICJjbXBCRm5jIiwgImlzQVByb3AiLCAiYV9wcm9wIiwgImlzQlByb3AiLCAiYl9wcm9wIiwgImFfdG1wIiwgImFSZWYiLCAiYl90bXAiLCAiYlJlZiIsICJjbXBmeCIsICJudiIsICJzdG9yZSIsICJsaW5rIiwgImMiLCAib2xkQXJnIiwgImNtcCIsICJhcmciLCAiZm9yY2UiLCAid3JwRnVuYyIsICJvbGRBcmckIiwgIm9wIiwgInJmIiwgInBlbmRpbmdJbml0aWFsIiwgIiRhcHBseSIsICJjcCIsICJ3cml0ZUNvbXB1dGVkIiwgImRlbGF5ZWRTdWJzY3JpYmUiXQp9Cg==
