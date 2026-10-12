import { $avoidTrigger as fe, $getValue as Ke, $triggerLock as Oe, Promised as je, bindCtx as q, callByAllProp as Ze, callByProp as dt, defaultByType as ht, hasValue as V, isArrayInvalidKey as re, isKeyType as j, isNotEqual as O, isPrimitive as T, isPromise as $, makeTriggerLess as pe, objectAssign as ye, objectAssignNotEqual as vt, potentiallyAsync as ke, potentiallyAsyncMap as Ge, resolved as Te, tryParseByHint as C } from "@fest-lib/core";
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var d = /* @__PURE__ */ Symbol.for("@value"), w = /* @__PURE__ */ Symbol.for("@extract"), D = /* @__PURE__ */ Symbol.for("@origin"), ne = /* @__PURE__ */ Symbol.for("@registry"), U = /* @__PURE__ */ Symbol.for("@behavior"), W = /* @__PURE__ */ Symbol.for("@promise"), Le = /* @__PURE__ */ Symbol.for("@resolved"), be = /* @__PURE__ */ Symbol.for("@trigger-less"), h = /* @__PURE__ */ Symbol.for("@trigger-lock"), pt = /* @__PURE__ */ Symbol.for("@trigger-control"), k = /* @__PURE__ */ Symbol.for("@trigger"), le = /* @__PURE__ */ Symbol.for("@subscribe"), bt = /* @__PURE__ */ Symbol.for("@isNotEqual"), ae = /* @__PURE__ */ Symbol.for("@realProp"), Fe = /* @__PURE__ */ new WeakMap(), oe = (e) => {
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
function M(e, t, r) {
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
              const [v, S, b, A, P] = a;
              try {
                this.#s(v, S, b, A, ...P ?? []);
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
  return $(r) ? Te(r, t) : $(r?.[W]) ? Te(r[W], t) : Te(r ?? e, t);
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
      $(r) && (e[n] = r);
    }), e;
  if (t instanceof Map) {
    for (const [r, n] of t.entries()) $(n) && e.set(r, n);
    return e;
  }
  if (t instanceof Set) return e;
  for (const r of Reflect.ownKeys(t)) {
    if (r == w || r == W || r == Le || !Object.getOwnPropertyDescriptor(t, r)?.enumerable) continue;
    const n = t[r];
    $(n) && (e[r] = n);
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
}, R = globalThis[Pt] ??= /* @__PURE__ */ new WeakMap();
function Mt(e, t) {
  let r = !0;
  try {
    R?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), R?.get?.(e)?.has?.(t) && (r = !0), r = typeof Reflect.getOwnPropertyDescriptor(e, t)?.get == "function";
  } catch {
    r = !0;
  } finally {
    R?.get?.(e)?.delete?.(t);
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
  let l = R?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  if (l?.has?.(t)) return null;
  if (!Mt(e, t)) n ??= Reflect.get(e, t, r ?? e);
  else {
    l?.add?.(t);
    try {
      n = Reflect.get(e, t, r ?? e);
    } catch {
      n = void 0;
    } finally {
      l.delete(t), l?.size === 0 && R?.delete?.(e);
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
    if (t == k) return ge(l, (f) => {
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
    const n = $(r);
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
    return s ?? (t == be ? pe.call(this, this) : t == k ? ge(n, (u) => {
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
      R?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), R?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      R?.get?.(e)?.delete?.(t);
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
        (y(e, bt) ?? O)?.(f, o) && c?.trigger?.(i, l, f), $(r) && ue(u, i, l, f);
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
    if (t == k) return ge(n, (i) => {
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
      return this[h] || ((!c || O(a, o)) && m.get(e)?.trigger?.(i, o, c ? a : null, c ? "set" : "add"), $(f) && ue(e, i, o, a)), v;
    });
    if (t == "getOrInsert" || t == "getOrInsertComputed") {
      const i = t == "getOrInsertComputed";
      return (f, o) => {
        if (e.has(f)) return e.get(f);
        const c = i && typeof o == "function" ? o(f) : o;
        return Ge(c, (a) => {
          const v = typeof e.getOrInsert == "function" ? e.getOrInsert(f, a) : (e.set(f, a), e.get(f));
          return this[h] || (m.get(e)?.trigger?.(f, a, null, "add"), $(c) && ue(e, f, a, null)), v;
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
      R?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), R?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      R?.get?.(e)?.delete?.(t);
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
    return typeof t == "symbol" && (t in e || y(e, t) != null) ? u : t == be ? pe.call(this, this) : t == k ? ge(n, (i) => {
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
      return this[h] || (o || m.get(e)?.trigger?.(f, f, c, "add"), $(i) && ue(e, f, f, c)), a;
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
      R?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), R?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      R?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  deleteProperty(e, t) {
    return t == h ? (delete this[h], !0) : Reflect.deleteProperty(e, t);
  }
}, Y = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[le])), Ee = (e) => Y(e) ? e : Ve(se(e, new zt()), e), Bt = (e) => Y(e) ? e : Ve(se(e, new Ct()), e), Kt = (e) => Y(e) ? e : Ve(se(e, new Nt()), e), jt = (e) => Y(e) ? e : se(e, new Dt()), Gt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = I({
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
    n.value = l, n[k]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Ft = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = I({
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
    n.value = l, n[k]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Ht = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = I({
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
    n.value = l, n[k]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Xe = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = I({
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
    n.value = l, n[k]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), g(e, (l) => {
    n?.[k]?.();
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
  const o = I({
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
    const A = s ? u() : a, P = o[d];
    o[d] = A, o[k]?.({
      key: "value",
      value: A,
      oldValue: S ?? P,
      trigger: b ?? "set"
    });
  });
  return M(o, Symbol.dispose, c), o;
}, Ut = (e, t) => {
  switch (typeof e) {
    case "boolean":
      return Ht(e, t);
    case "number":
      return Gt(e, t);
    case "string":
      return Ft(e, t);
    case "object":
      if (e != null) return Xe(I(e), t);
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
function I(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || Y(e) || (e = N?.(e)) == null || e instanceof Promise || e instanceof WeakRef || Y(e)) return e;
  const r = e;
  if (r == null || typeof r == "symbol" || !(typeof r == "object" || typeof r == "function") || r instanceof Promise || r instanceof WeakRef) return r;
  let n = r;
  return Array.isArray(r) ? (n = Ee(r), n) : r instanceof Map ? (n = Kt(r), n) : r instanceof Set ? (n = jt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = Bt(r)), n);
}
var K = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[le] || m?.has?.(e))), Qt = (e) => K(e) ? I(e) : null, mr = (e) => {
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
  return e?.[Symbol.dispose] || (M(u, Symbol.dispose, u), M(u, Symbol.asyncDispose, u), M(e, Symbol.dispose, u), M(e, Symbol.asyncDispose, u)), u;
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
  const t = I({ value: 0 }), r = (i) => typeof i == "function" ? i() : V(i) ? i.value : i, l = yr([t, "value"], () => e.findIndex((i) => !!r(i)), "value"), s = () => {
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
  return M(l, Symbol.dispose, () => u.forEach((i) => i?.())), l;
}, or = (e, t, r, n) => {
  if (T(e)) return e ? t : r;
  const l = () => t, s = () => r, u = (o) => (o != null && (e.value = V(o) ? o?.value : o), (V(e) ? e?.value : e) ? l() : s()), i = I({
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
    i[d] = c, i?.[k]?.({
      key: "value",
      value: c,
      oldValue: o,
      trigger: "manual"
    });
  });
  return M(i, Symbol.dispose, f), i;
}, xr = or, Rr = (e, t, r) => {
  r || (r = I({}));
  const n = g(e, (l, s, u) => {
    if (s == null) return;
    const i = t?.(l, s, u);
    typeof i == "object" ? vt(r, i) : O(r[s], i) && (r[s] = i);
  });
  return r && M(r, Symbol.dispose, n), r;
}, Ir = (...e) => {
  const t = I({});
  return e?.forEach?.((r) => g(r, (n, l, s) => {
    l != null && O(t[l], n) && (t[l] = n);
  })), t;
}, at = (e) => {
  const t = I([]);
  return t.push(...Array.from(e?.values?.() || [])), M(t, Symbol.dispose, g(e, (r, n, l) => {
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
  const t = I([]), r = Array.from(e.entries());
  return t.push(...r), M(t, Symbol.dispose, g(e, (n, l, s) => {
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
  const c = (p, E) => {
    const x = S?.deref?.(), _ = v?.deref?.();
    if (F?.get?.(x)?.get?.(i)?.bound == _) {
      let B = null;
      const De = F?.get?.(x)?.get?.(i)?.cmpfx;
      fe(_, () => {
        typeof De == "function" ? B = De?.(Ke(_) ?? p, E, null) : B = _?.[E] ?? p;
      });
      const Be = Ke(B);
      O(x[i], Be) && fe(_, () => {
        x[i] = Be;
      });
    } else F?.get?.(x)?.get?.(i)?.dispose?.();
  }, a = () => {
    const p = S?.deref?.(), E = F?.get?.(p), x = E?.get?.(i);
    E?.delete?.(i), x?.unsub?.();
  }, v = t?.[0] != null && (typeof t?.[0] == "object" || typeof t?.[0] == "function") && !(t?.[0] instanceof WeakRef || typeof t?.[0]?.deref == "function") ? new WeakRef(t?.[0]) : t?.[0], S = e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function") && !(e?.[0] instanceof WeakRef || typeof e?.[0]?.deref == "function") ? new WeakRef(e?.[0]) : e?.[0];
  let b = {
    compute: c,
    dispose: a,
    cmpfx: s
  };
  const A = S?.deref?.(), P = v?.deref?.();
  return S instanceof WeakRef && (F?.get?.(A)?.get?.(i)?.bound != P && F?.get?.(A)?.delete?.(i), b = F?.getOrInsert?.(A, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(i, () => ({
    bound: P,
    cmpfx: s,
    unsub: null,
    compute: c,
    dispose: a
  })), b.unsub = g(t, c), b.cmpfx = s, M(A, Symbol.dispose, b?.dispose), M(P, Symbol.dispose, b?.dispose)), P && !Array.isArray(P) && fe(A, () => {
    P[o] ??= A?.[i] ?? P[o];
  }), b?.dispose;
}, Pr = (e, t, r = "value") => {
  const n = [Ye(e, t, r), Ye(t, e, r)];
  return () => n?.map?.((l) => l?.());
}, yr = (e, t, r, n = "value") => {
  const l = typeof e?.[1] == "function" && e?.length == 2, s = (j(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let u = s && !l ? e?.[1] : Array.isArray(e) ? null : n;
  if (!s && !l && (e = [s ? e?.[0] : e, u]), l && (e[1] = u), u == null || re(u, e?.[0])) return;
  let i, f;
  const o = (p, E) => {
    if (p ??= e?.[0]?.[u] ?? f ?? p, E || O(f, p) && p != null || i == null) {
      let x = t?.(p, u, f);
      return i = x, x;
    }
    return i;
  }, c = (p, E = "value", x, _) => {
    if (f = x ?? f, p ??= e?.[0]?.[u], O(f, p) && p != null || i == null) {
      let B = t?.(p, u, f, _);
      return f = p, (O(B, i) || i == null) && (b[E] = i = B, i = b[E]), B;
    }
    return b[E];
  }, a = o(e[0][u] ?? f), v = $(a), S = /* @__PURE__ */ Symbol.for("@@apply");
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
    writable: !1
  }), Object.defineProperty(c, Symbol?.toPrimitive, {
    value: C(c[d], "number"),
    writable: !1
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
    value: (p) => (p == null || (b.value = p), b?.value),
    writable: !1
  });
  const b = I(c), A = (p, E) => {
    if ($(p)) return Promise.resolve(p).then((_) => {
      const B = b?.[d];
      return b[d] = _, b?.[k]?.({
        key: "value",
        value: _,
        oldValue: B,
        trigger: "resolved"
      }), _;
    });
    const x = b?.[d];
    return b[d] = p, b?.[k]?.({
      key: "value",
      value: p,
      oldValue: x,
      trigger: E
    }), p;
  };
  v && A(a, "resolved");
  const P = g([e?.[0] ?? e, u ?? "value"], () => {
    A(o(), "manual");
  });
  return M(b, Symbol.dispose, P), b;
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
  k as $trigger,
  pt as $triggerControl,
  be as $triggerLess,
  h as $triggerLock,
  wt as AssignObjectHandler,
  ur as DoubleWeakMap,
  M as addToCallChain,
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
  I as observe,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vI3JlZ2lvbiBzcmMvd3JhcC9TeW1ib2wudHNcblN5bWJvbC5vYnNlcnZhYmxlIHx8PSBTeW1ib2wuZm9yKFwib2JzZXJ2YWJsZVwiKTtcblN5bWJvbC5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJzdWJzY3JpYmVcIik7XG5TeW1ib2wudW5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJ1bnN1YnNjcmliZVwiKTtcbnZhciAkdmFsdWUgPSBTeW1ib2wuZm9yKFwiQHZhbHVlXCIpO1xudmFyICRleHRyYWN0S2V5JCA9IFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKTtcbnZhciAkb3JpZ2luYWxLZXkkID0gU3ltYm9sLmZvcihcIkBvcmlnaW5cIik7XG52YXIgJHJlZ2lzdHJ5S2V5JCA9IFN5bWJvbC5mb3IoXCJAcmVnaXN0cnlcIik7XG52YXIgJGJlaGF2aW9yID0gU3ltYm9sLmZvcihcIkBiZWhhdmlvclwiKTtcbnZhciAkcHJvbWlzZSA9IFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKTtcbnZhciAkcmVzb2x2ZWQgPSBTeW1ib2wuZm9yKFwiQHJlc29sdmVkXCIpO1xudmFyICR0cmlnZ2VyTGVzcyA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sZXNzXCIpO1xudmFyICR0cmlnZ2VyTG9jayA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sb2NrXCIpO1xudmFyICR0cmlnZ2VyQ29udHJvbCA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpO1xudmFyICR0cmlnZ2VyID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyXCIpO1xudmFyICRhZmZlY3RlZCA9IFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpO1xudmFyICRpc05vdEVxdWFsID0gU3ltYm9sLmZvcihcIkBpc05vdEVxdWFsXCIpO1xudmFyICRyZWFsUHJvcCA9IFN5bWJvbC5mb3IoXCJAcmVhbFByb3BcIik7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy93cmFwL1V0aWxzLnRzXG52YXIgJG9yaWdpbmFsT2JqZWN0cyQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzYWZlID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldCwgbWFwcGVkID0gKGUpID0+IHNhZmUoZSk7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHJldHVybiB1bndyYXA/Lm1hcD8uKG1hcHBlZCkgfHwgQXJyYXkuZnJvbSh1bndyYXAgfHwgW10pPy5tYXA/LihtYXBwZWQpIHx8IFtdO1xuXHRlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXAgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha01hcCkgcmV0dXJuIG5ldyBNYXAoQXJyYXkuZnJvbSh1bndyYXA/LmVudHJpZXM/LigpIHx8IFtdKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrU2V0KSByZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKHVud3JhcD8udmFsdWVzPy4oKSB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkpO1xuXHRlbHNlIGlmICh1bndyYXAgIT0gbnVsbCAmJiB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyh1bndyYXAgfHwge30pIHx8IFtdKT8uZmlsdGVyPy4oKFtLXSkgPT4gSyAhPSAkZXh0cmFjdEtleSQgJiYgSyAhPSAkb3JpZ2luYWxLZXkkICYmIEsgIT0gJHJlZ2lzdHJ5S2V5JCk/Lm1hcD8uKChbSywgVl0pID0+IFtLLCBzYWZlKFYpXSkpO1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciB1bndyYXAgPSAoYXJyKSA9PiB7XG5cdHJldHVybiBhcnI/LlskZXh0cmFjdEtleSRdID8/IGFycj8uW1wiQHRhcmdldFwiXSA/PyBhcnI7XG59O1xudmFyIGRlcmVmID0gKHRhcmdldCwgZGlzY291bnRWYWx1ZSA9IGZhbHNlKSA9PiB7XG5cdGNvbnN0IG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRpZiAoaXNQcmltaXRpdmUodGFyZ2V0KSB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCBcImRlcmVmXCIgaW4gdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQ/LmRlcmVmID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9IHRhcmdldD8uZGVyZWY/LigpO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwgJiYgKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHR0YXJnZXQgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRjb25zdCAkdmFsID0gZGlzY291bnRWYWx1ZSAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHRhcmdldD8udmFsdWU7XG5cdFx0aWYgKCR2YWwgIT0gbnVsbCAmJiAodHlwZW9mICR2YWwgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgJHZhbCA9PSBcImZ1bmN0aW9uXCIpKSB0YXJnZXQgPSAkdmFsO1xuXHRcdGlmIChvcmlnaW5hbCAhPSB0YXJnZXQpIHJldHVybiBkZXJlZih0YXJnZXQsIGRpc2NvdW50VmFsdWUpO1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGlzVGhlbmFibGUgPSAodmFsKSA9PiB2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbnZhciB3aXRoUHJvbWlzZSA9ICh0YXJnZXQsIGNiKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY2I/Lih0YXJnZXQpO1xuXHRpZiAoaXNUaGVuYWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0LnRoZW4oY2IpO1xuXHRpZiAodHlwZW9mIHRhcmdldD8ucmVzb2x2ZWQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRhcmdldC5yZXNvbHZlZCgpKS50aGVuKGNiKTtcblx0aWYgKHRhcmdldD8ucHJvbWlzZSAmJiBpc1RoZW5hYmxlKHRhcmdldC5wcm9taXNlKSkgcmV0dXJuIHRhcmdldC5wcm9taXNlLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5bJHByb21pc2VdICYmIGlzVGhlbmFibGUodGFyZ2V0WyRwcm9taXNlXSkpIHJldHVybiB0YXJnZXRbJHByb21pc2VdLnRoZW4oY2IpO1xuXHRyZXR1cm4gY2I/Lih0YXJnZXQpO1xufTtcbnZhciBkaXNwb3NlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZGlzcG9zZVJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChjYWxsc3RhY2spID0+IHtcblx0Y2FsbHN0YWNrPy5mb3JFYWNoPy4oKGNiKSA9PiBjYj8uKCkpO1xufSk7XG5mdW5jdGlvbiBhZGRUb0NhbGxDaGFpbihvYmosIG1ldGhvZEtleSwgY2FsbGJhY2spIHtcblx0aWYgKCFjYWxsYmFjayB8fCB0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBvYmogIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAobWV0aG9kS2V5ID09IFN5bWJvbC5kaXNwb3NlKSB7XG5cdFx0Y29uc3QgY2hhaW5UYXJnZXQgPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iajtcblx0XHRkaXNwb3NlTWFwPy5nZXRPckluc2VydENvbXB1dGVkPy4oY2hhaW5UYXJnZXQsICgpID0+IHtcblx0XHRcdGNvbnN0IENhbGxDaGFpbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0XHRpZiAodHlwZW9mIGNoYWluVGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNoYWluVGFyZ2V0ID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRkaXNwb3NlUmVnaXN0cnkucmVnaXN0ZXIoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGRpc3Bvc2VNYXAuc2V0KGNoYWluVGFyZ2V0LCBDYWxsQ2hhaW4pO1xuXHRcdFx0XHRjaGFpblRhcmdldFtTeW1ib2wuZGlzcG9zZV0gPz89ICgpID0+IENhbGxDaGFpbi5mb3JFYWNoKChjYikgPT4ge1xuXHRcdFx0XHRcdGNiPy4oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQ2FsbENoYWluO1xuXHRcdH0pPy5hZGQ/LihjYWxsYmFjayk7XG5cdH0gZWxzZSBvYmpbbWV0aG9kS2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IG9iaj8uW21ldGhvZEtleV07XG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbCA9PSBcImZ1bmN0aW9uXCIpIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxudmFyIGlzQXJyYXlJbmRleCA9IChwcm9wKSA9PiB7XG5cdGlmICh0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuXHRpZiAocHJvcCA9PT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBudW0gPSBOdW1iZXIocHJvcCk7XG5cdHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IDAgJiYgU3RyaW5nKG51bSkgPT09IHByb3A7XG59O1xuZnVuY3Rpb24gd3JhcFNldEFzQXJyYXkoc291cmNlID0gW10sIG9wdGlvbnMgPSB7fSkge1xuXHRsZXQgYmFja2luZ1NldCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdGNvbnN0IG5vdGlmeUR1cGxpY2F0ZSA9ICh2YWx1ZSwgdmlhLCBpbmRleCkgPT4ge1xuXHRcdG9wdGlvbnMub25EdXBsaWNhdGU/Lih7XG5cdFx0XHR2YWx1ZSxcblx0XHRcdHZpYSxcblx0XHRcdGluZGV4XG5cdFx0fSk7XG5cdH07XG5cdGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIGJhY2tpbmdTZXQgPSBzb3VyY2U7XG5cdGVsc2UgZm9yIChjb25zdCBpdGVtIG9mIHNvdXJjZSkge1xuXHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fVxuXHRjb25zdCBzbmFwc2hvdCA9ICgpID0+IEFycmF5LmZyb20oYmFja2luZ1NldCk7XG5cdGNvbnN0IHJlYnVpbGRGcm9tID0gKGFycikgPT4ge1xuXHRcdGJhY2tpbmdTZXQuY2xlYXIoKTtcblx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSBiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fTtcblx0Y29uc3QgbWV0aG9kcyA9IHtcblx0XHRwdXNoOiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGxldCBzaXplID0gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInB1c2hcIik7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdFx0XHRcdHNpemUrKztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzaXplO1xuXHRcdH0sXG5cdFx0cG9wOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0aWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdFx0YmFja2luZ1NldC5kZWxldGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2hpZnQ6ICgpID0+IHtcblx0XHRcdGNvbnN0IGl0ZXJhdG9yID0gYmFja2luZ1NldC52YWx1ZXMoKS5uZXh0KCk7XG5cdFx0XHRpZiAoaXRlcmF0b3IuZG9uZSkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmF0b3IudmFsdWU7XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHR1bnNoaWZ0OiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Y29uc3QgY3VycmVudCA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCB0b1ByZXBlbmQgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoY3VycmVudC5pbmNsdWRlcyhpdGVtKSB8fCB0b1ByZXBlbmQuaW5jbHVkZXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJ1bnNoaWZ0XCIsIDApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvUHJlcGVuZC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0b1ByZXBlbmQubGVuZ3RoKSByZXR1cm4gY3VycmVudC5sZW5ndGg7XG5cdFx0XHRjb25zdCBuZXh0ID0gWy4uLnRvUHJlcGVuZCwgLi4uY3VycmVudF07XG5cdFx0XHRyZWJ1aWxkRnJvbShuZXh0KTtcblx0XHRcdHJldHVybiBuZXh0Lmxlbmd0aDtcblx0XHR9LFxuXHRcdHNwbGljZTogKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBub3JtYWxpemVkU3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChzdGFydCwgMCksIGFyci5sZW5ndGgpO1xuXHRcdFx0Y29uc3QgYWN0dWFsRGVsZXRlQ291bnQgPSBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gYXJyLmxlbmd0aCAtIG5vcm1hbGl6ZWRTdGFydCA6IE1hdGgubWF4KDAsIE1hdGgubWluKGRlbGV0ZUNvdW50LCBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0KSk7XG5cdFx0XHRjb25zdCByZW1vdmVkID0gYXJyLnNwbGljZShub3JtYWxpemVkU3RhcnQsIGFjdHVhbERlbGV0ZUNvdW50KTtcblx0XHRcdGxldCBpbnNlcnRQb3NpdGlvbiA9IG5vcm1hbGl6ZWRTdGFydDtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwic3BsaWNlXCIsIGluc2VydFBvc2l0aW9uKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcnIuc3BsaWNlKGluc2VydFBvc2l0aW9uKyssIDAsIGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdHJldHVybiByZW1vdmVkO1xuXHRcdH0sXG5cdFx0aW5jbHVkZXM6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5oYXModmFsdWUpLFxuXHRcdGluZGV4T2Y6ICh2YWx1ZSkgPT4gc25hcHNob3QoKS5pbmRleE9mKHZhbHVlKSxcblx0XHRjbGVhcjogKCkgPT4ge1xuXHRcdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlOiAodmFsdWUpID0+IGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKSxcblx0XHR0b0FycmF5OiAoKSA9PiBzbmFwc2hvdCgpLFxuXHRcdHRvU2V0OiAoKSA9PiBuZXcgU2V0KGJhY2tpbmdTZXQpLFxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBiYWNraW5nU2V0W1N5bWJvbC5pdGVyYXRvcl0oKVxuXHR9O1xuXHRyZXR1cm4gbmV3IFByb3h5KG1ldGhvZHMsIHtcblx0XHRnZXQ6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHJldHVybiBzbmFwc2hvdCgpW051bWJlcihwcm9wKV07XG5cdFx0XHRjb25zdCB2YWx1ZSA9IG1ldGhvZHNbcHJvcF07XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHNldDogKF8sIHByb3AsIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyXCIpO1xuXHRcdFx0XHRjb25zdCBuZXh0TGVuZ3RoID0gTWF0aC5mbG9vcih2YWx1ZSk7XG5cdFx0XHRcdGlmIChuZXh0TGVuZ3RoID49IGJhY2tpbmdTZXQuc2l6ZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCkuc2xpY2UoMCwgbmV4dExlbmd0aCk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID4gYXJyLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IG5leHRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAoaW5kZXggPCBhcnIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFZhbHVlID0gYXJyW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoT2JqZWN0LmlzKGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKGFyci5zb21lKChpdGVtLCBpZHgpID0+IGlkeCAhPT0gaW5kZXggJiYgT2JqZWN0LmlzKGl0ZW0sIG5leHRWYWx1ZSkpKSB7XG5cdFx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUobmV4dFZhbHVlLCBcInNldFwiLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YXJyW2luZGV4XSA9IG5leHRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKG5leHRWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnIucHVzaChuZXh0VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3Quc2V0KG1ldGhvZHMsIHByb3AsIHZhbHVlKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRvd25LZXlzOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gW107XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IF8gb2YgYmFja2luZ1NldCkga2V5cy5wdXNoKFN0cmluZyhpKyspKTtcblx0XHRcdGtleXMucHVzaChcImxlbmd0aFwiKTtcblx0XHRcdHJldHVybiBrZXlzO1xuXHRcdH0sXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0dmFsdWU6IGJhY2tpbmdTZXQuc2l6ZVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHZhbHVlOiBhcnJbaW5kZXhdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRoYXM6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRyZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9wIGluIG1ldGhvZHM7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3dyYXAvQXNzaWduT2JqZWN0LnRzXG52YXIgQXNzaWduT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbmFtZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ/LltuYW1lXSA/PyB0YXJnZXQ7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgY3R4KTtcblx0fVxufTtcbnZhciBtYWtlT2JqZWN0QXNzaWduYWJsZSA9IChvYmopID0+IHtcblx0aWYgKG9iaj8uWyRvcmlnaW5hbEtleSRdIHx8ICRvcmlnaW5hbE9iamVjdHMkLmhhcyhvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCBweCA9IG5ldyBQcm94eShvYmosIG5ldyBBc3NpZ25PYmplY3RIYW5kbGVyKCkpO1xuXHQkb3JpZ2luYWxPYmplY3RzJC5zZXQocHgsIG9iaik7XG5cdHJldHVybiBweDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1N1YnNjcmlwdC50c1xudmFyIHdpdGhVbnN1YlN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd2l0aFVuc3ViXCIpO1xuZ2xvYmFsVGhpc1t3aXRoVW5zdWJTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB3aXRoVW5zdWIgPSBnbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF07XG52YXIgY29tcGxldGVXaXRoVW5zdWIgPSAoc3Vic2NyaWJlciwgd2VhaywgaGFuZGxlcikgPT4ge1xuXHRyZXR1cm4gd2l0aFVuc3ViLmdldE9ySW5zZXJ0KHN1YnNjcmliZXIsICgpID0+IHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHdlYWs/LmRlcmVmPy4oKTtcblx0XHRyZWdpc3RyeT8uYWZmZWN0ZWQ/LihoYW5kbGVyKTtcblx0XHRjb25zdCBzYXZDb21wbGV0ZSA9IHN1YnNjcmliZXI/LmNvbXBsZXRlPy5iaW5kPy4oc3Vic2NyaWJlcik7XG5cdFx0Y29uc3QgdW5hZmZlY3RlZCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHIgPSBzYXZDb21wbGV0ZT8uKCk7XG5cdFx0XHRyZWdpc3RyeT8udW5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fTtcblx0XHRzdWJzY3JpYmVyLmNvbXBsZXRlID0gdW5hZmZlY3RlZDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuZGlzcG9zZV06IHVuYWZmZWN0ZWQsXG5cdFx0XHRbU3ltYm9sLmFzeW5jRGlzcG9zZV06IHVuYWZmZWN0ZWRcblx0XHR9O1xuXHR9KTtcbn07XG52YXIgc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHN1YnNjcmlwdFJlZ2lzdHJ5XCIpO1xuZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHN1YnNjcmlwdFJlZ2lzdHJ5ID0gZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAZ2xvYmFsRWZmZWN0TGlzdGVuZXJzXCIpO1xuZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVycyA9IGdsb2JhbFRoaXNbZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sXTtcbnZhciBlZmZlY3RHbG9iYWxseSA9IChjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Z2xvYmFsRWZmZWN0TGlzdGVuZXJzLnNldChjYiwgbm9ybWFsaXplZC5hZmZlY3RUeXBlcyk7XG5cdHJldHVybiAoKSA9PiBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuZGVsZXRlKGNiKTtcbn07XG52YXIgd3JhcHBlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd3JhcHBlZFwiKTtcbmdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdyYXBwZWQgPSBnbG9iYWxUaGlzW3dyYXBwZWRTeW1ib2xdO1xudmFyIHJlZ2lzdGVyID0gKHdoYXQsIGhhbmRsZSkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0O1xuXHRsZXQgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKTtcblx0aWYgKCFyZWdpc3RyeSkge1xuXHRcdHJlZ2lzdHJ5ID0gbmV3IFN1YnNjcmlwdCh1bndyYXApO1xuXHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LnNldCh1bndyYXAsIHJlZ2lzdHJ5KTtcblx0fSBlbHNlIHJlZ2lzdHJ5LmJpbmRTb3VyY2UodW53cmFwKTtcblx0cmV0dXJuIGhhbmRsZTtcbn07XG52YXIgd3JhcFdpdGggPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdHdoYXQgPSBkZXJlZih3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0KTtcblx0aWYgKHR5cGVvZiB3aGF0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2Ygd2hhdCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB3aGF0ID09IFwiZnVuY3Rpb25cIikgfHwgd2hhdCA9PSBudWxsKSByZXR1cm4gd2hhdDtcblx0cmV0dXJuIHdyYXBwZWQuZ2V0T3JJbnNlcnRDb21wdXRlZCh3aGF0LCAoKSA9PiBuZXcgUHJveHkod2hhdCwgcmVnaXN0ZXIod2hhdCwgaGFuZGxlKSkpO1xufTtcbnZhciBmb3JBbGwgPSBTeW1ib2wuZm9yKFwiQGFsbFByb3BzXCIpO1xudmFyIHdpbGRjYXJkVHJpZ2dlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCIsIFwiYWxsXCJdKTtcbnZhciB0cmlnZ2VyQWxpYXNlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKFtcblx0W1wic2V0XCIsIFtcInNldHRlclwiLCBcIkBzZXRcIl1dLFxuXHRbXCJhZGRcIiwgW1wiQGFkZFwiXV0sXG5cdFtcImRlbGV0ZVwiLCBbXCJAZGVsZXRlXCJdXSxcblx0W1wiaW52YWxpZGF0ZVwiLCBbXCJAaW52YWxpZGF0ZVwiXV0sXG5cdFtcIm1hbnVhbFwiLCBbXCJAbWFudWFsXCJdXSxcblx0W1wiY3VzdG9tXCIsIFtcIkBjdXN0b21cIl1dLFxuXHRbXCJyZXNvbHZlZFwiLCBbXCJAcmVzb2x2ZWRcIl1dLFxuXHRbXCJzZXRBbGxcIiwgW1wiQHNldEFsbFwiXV0sXG5cdFtcImFkZEFsbFwiLCBbXCJAYWRkQWxsXCJdXSxcblx0W1wiZGVsZXRlQWxsXCIsIFtcIkBkZWxldGVBbGxcIiwgXCJAY2xlYXJcIl1dXG5dKTtcbnZhciB0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHRyaWdnZXJDYW5vbmljYWxOYW1lc1wiKTtcbmdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXSA/Pz0gbmV3IE1hcChBcnJheS5mcm9tKHRyaWdnZXJBbGlhc2VzLmVudHJpZXMoKSkuZmxhdE1hcCgoW2Nhbm9uaWNhbCwgYWxpYXNlc10pID0+IGFsaWFzZXMubWFwKChhbGlhcykgPT4gW2FsaWFzLCBjYW5vbmljYWxdKSkpO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lcyA9IGdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXTtcbnZhciBub3JtYWxpemVUcmlnZ2VyTmFtZSA9ICh0cmlnZ2VyID0gXCJzZXRcIikgPT4ge1xuXHRpZiAodHJpZ2dlciA9PSBudWxsKSByZXR1cm4gdHJpZ2dlcjtcblx0Y29uc3QgbmFtZSA9IFN0cmluZyh0cmlnZ2VyIHx8IFwic2V0XCIpO1xuXHRyZXR1cm4gdHJpZ2dlckNhbm9uaWNhbE5hbWVzLmdldChuYW1lKSA/PyBuYW1lO1xufTtcbnZhciB0cmlnZ2VyTmFtZXNPZiA9ICh0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5hbWUgPSB0cmlnZ2VyID09IG51bGwgPyBcImFsbFwiIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IFwiYWxsXCIpO1xuXHRyZXR1cm4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV07XG59O1xudmFyIGV4cGFuZFRyaWdnZXJGaWx0ZXIgPSAodHlwZXMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBuZXcgU2V0KFsuLi5ub3JtYWxpemVUcmlnZ2VyRmlsdGVyKHR5cGVzKV0uZmxhdE1hcCgobmFtZSkgPT4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV0pKTtcbn07XG52YXIgbm9ybWFsaXplVHJpZ2dlckZpbHRlciA9ICh0cmlnZ2VycyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgbGlzdCA9IHR5cGVvZiB0cmlnZ2VycyA9PSBcInN0cmluZ1wiID8gW3RyaWdnZXJzXSA6IEFycmF5LmZyb20odHJpZ2dlcnMgPz8gW1wiKlwiXSk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBuZXcgU2V0KGxpc3QubWFwKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgbmFtZSA9IFN0cmluZyhpdGVtIHx8IFwiKlwiKTtcblx0XHRyZXR1cm4gd2lsZGNhcmRUcmlnZ2Vycy5oYXMobmFtZSkgPyBuYW1lIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG5hbWUpID8/IG5hbWUpO1xuXHR9KSk7XG5cdHJldHVybiBub3JtYWxpemVkLnNpemUgPyBub3JtYWxpemVkIDogLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1wiKlwiXSk7XG59O1xudmFyIHRyaWdnZXJGaWx0ZXJBbGxvd3MgPSAodHJpZ2dlcnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3QgZmlsdGVyID0gdHJpZ2dlcnMgaW5zdGFuY2VvZiBTZXQgPyB0cmlnZ2VycyA6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHJpZ2dlcnMpO1xuXHRyZXR1cm4gWy4uLndpbGRjYXJkVHJpZ2dlcnNdLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpIHx8IHRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpO1xufTtcbnZhciBpc09wdGlvbnNPYmplY3QgPSAob3B0aW9ucykgPT4ge1xuXHRyZXR1cm4gISFvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucykgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlcnNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gb3B0aW9ucyk7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ICE9PSBmYWxzZVxuXHR9O1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyk7XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiB0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcImluaXRpYWxcIilcblx0fTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0T3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ID09PSB0cnVlXG5cdH07XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9O1xufTtcbnZhciBTdWJzY3JpcHRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQFN1YnNjcmlwdFwiKTtcbmdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXSA/Pz0gY2xhc3MgU3Vic2NyaXB0IHtcblx0Y29tcGF0aWJsZTtcblx0I3NvdXJjZTtcblx0I2xpc3RlbmVycztcblx0I2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdCNuYXRpdmU7XG5cdCNpdGVyYXRvcjtcblx0I2luRGlzcGF0Y2ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjZGlzYWJsZWRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCN0cmlnZ2VyQ29udHJvbDtcblx0I3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQjcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy4jbGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHR0aGlzLiNmbGFncyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRcdHRoaXMuI3RyaWdnZXJDb250cm9sID0ge1xuXHRcdFx0ZW5hYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgdHJ1ZSwgY2IpIDogdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIHRydWUpLFxuXHRcdFx0ZGlzYWJsZTogKHR5cGVzID0gW1wiKlwiXSwgY2IpID0+IGNiID8gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIGZhbHNlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgZmFsc2UpLFxuXHRcdFx0c2V0OiAodHlwZXMsIGVuYWJsZWQpID0+IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBlbmFibGVkKSxcblx0XHRcdHdpdGg6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYiksXG5cdFx0XHR3aXRob3V0OiAodHlwZXMsIGNiKSA9PiB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSxcblx0XHRcdGlzRW5hYmxlZDogKHRyaWdnZXIpID0+IHRoaXMuaXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKVxuXHRcdH07XG5cdFx0dGhpcy4jaXRlcmF0b3IgPSB7IG5leHQ6IChhcmdzKSA9PiB7XG5cdFx0XHRpZiAoYXJncykgQXJyYXkuaXNBcnJheShhcmdzKSA/IHRoaXMuI2Rpc3BhdGNoKC4uLmFyZ3MpIDogdGhpcy4jZGlzcGF0Y2goYXJncyk7XG5cdFx0fSB9O1xuXHRcdGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZih0aGlzKTtcblx0XHRjb25zdCBjb250cm9sbGVyID0gZnVuY3Rpb24oc3Vic2NyaWJlcikge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IHN1YnNjcmliZXI/Lm5leHQ/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRcdHJldHVybiBjb21wbGV0ZVdpdGhVbnN1YihzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKTtcblx0XHR9O1xuXHRcdHRoaXMuI25hdGl2ZSA9IHR5cGVvZiBPYnNlcnZhYmxlICE9IFwidW5kZWZpbmVkXCIgPyBuZXcgT2JzZXJ2YWJsZShjb250cm9sbGVyKSA6IG51bGw7XG5cdFx0dGhpcy5jb21wYXRpYmxlID0gKCkgPT4gdGhpcy4jbmF0aXZlO1xuXHR9XG5cdGJpbmRTb3VyY2Uoc291cmNlKSB7XG5cdFx0dGhpcy4jc291cmNlID8/PSBzb3VyY2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0JHNhZmVFeGVjKGNiLCAuLi5hcmdzKSB7XG5cdFx0aWYgKCFjYiB8fCB0aGlzLiNmbGFncy5oYXMoY2IpKSByZXR1cm47XG5cdFx0dGhpcy4jZmxhZ3MuYWRkKGNiKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzID0gY2IoLi4uYXJncyk7XG5cdFx0XHRpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHJlcy5jYXRjaChjb25zb2xlLndhcm4pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy4jZmxhZ3MuZGVsZXRlKGNiKTtcblx0XHR9XG5cdH1cblx0I2Rpc3BhdGNoKG5hbWUsIHZhbHVlID0gbnVsbCwgb2xkVmFsdWUsIHRyaWdnZXIgPSBcImFsbFwiLCAuLi5ldGMpIHtcblx0XHR0cmlnZ2VyID0gbm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gdHJpZ2dlcjtcblx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0aWYgKGxpc3RlbmVycz8uc2l6ZSkge1xuXHRcdFx0Zm9yIChjb25zdCBbY2IsIHJlY29yZF0gb2YgbGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKChyZWNvcmQucHJvcCA9PT0gbmFtZSB8fCByZWNvcmQucHJvcCA9PT0gZm9yQWxsIHx8IHJlY29yZC5wcm9wID09PSBudWxsKSAmJiB0cmlnZ2VyRmlsdGVyQWxsb3dzKHJlY29yZC50cmlnZ2VycywgdHJpZ2dlcikpIHRoaXMuJHNhZmVFeGVjKGNiLCB2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG5cdFx0fVxuXHRcdGlmIChnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2l6ZSkge1xuXHRcdFx0Y29uc3QgZXZlbnQgPSB7XG5cdFx0XHRcdHNvdXJjZTogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR0YXJnZXQ6IHRoaXMuI3NvdXJjZSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdHByb3A6IG5hbWUsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyLFxuXHRcdFx0XHRhcmdzOiBldGNcblx0XHRcdH07XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgdHJpZ2dlcnNdIG9mIGdsb2JhbEVmZmVjdExpc3RlbmVycy5lbnRyaWVzKCkpIGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKHRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIGV2ZW50KTtcblx0XHR9XG5cdH1cblx0d3JhcChudykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG53KSkgcmV0dXJuIHdyYXBXaXRoKG53LCB0aGlzKTtcblx0XHRyZXR1cm4gbnc7XG5cdH1cblx0Z2V0IHRyaWdnZXJDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLiN0cmlnZ2VyQ29udHJvbDtcblx0fVxuXHRpc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpIHtcblx0XHRyZXR1cm4gIXRyaWdnZXJGaWx0ZXJBbGxvd3ModGhpcy4jZGlzYWJsZWRUcmlnZ2VycywgXCJhbGxcIikgJiYgIXRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpKTtcblx0fVxuXHRzZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMgPSBbXCIqXCJdLCBlbmFibGVkID0gdHJ1ZSkge1xuXHRcdGNvbnN0IG5hbWVzID0gZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyk7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSBpZiAoZW5hYmxlZCkgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5kZWxldGUobmFtZSk7XG5cdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0fVxuXHR3aXRoVHJpZ2dlcnModHlwZXMsIGVuYWJsZWQsIGNiKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBbLi4uZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyldO1xuXHRcdGNvbnN0IHByZXZpb3VzID0gbmV3IE1hcChuYW1lcy5tYXAoKG5hbWUpID0+IFtuYW1lLCB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmhhcyhuYW1lKV0pKTtcblx0XHRjb25zdCByZXN0b3JlID0gKCkgPT4ge1xuXHRcdFx0cHJldmlvdXMuZm9yRWFjaCgod2FzRGlzYWJsZWQsIG5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHdhc0Rpc2FibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0XHRcdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0dGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQobmFtZXMsIGVuYWJsZWQpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjYj8uKCk7XG5cdFx0XHRpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQuZmluYWxseSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiByZXN1bHQuZmluYWxseShyZXN0b3JlKTtcblx0XHRcdHJlc3RvcmUoKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YWZmZWN0ZWQoY2IsIHByb3AsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdFx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy4jbGlzdGVuZXJzLnNldChjYiwge1xuXHRcdFx0cHJvcDogcHJvcCB8fCBmb3JBbGwsXG5cdFx0XHR0cmlnZ2Vyczogbm9ybWFsaXplZC5hZmZlY3RUeXBlc1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnVuYWZmZWN0ZWQoY2IsIHByb3AgfHwgZm9yQWxsKTtcblx0fVxuXHR1bmFmZmVjdGVkKGNiLCBwcm9wKSB7XG5cdFx0aWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy4jbGlzdGVuZXJzO1xuXHRcdFx0Y29uc3QgcmVjb3JkID0gbGlzdGVuZXJzPy5nZXQoY2IpO1xuXHRcdFx0aWYgKHJlY29yZCAmJiAocmVjb3JkLnByb3AgPT0gcHJvcCB8fCBwcm9wID09IG51bGwgfHwgcHJvcCA9PSBmb3JBbGwpKSB7XG5cdFx0XHRcdGxpc3RlbmVycy5kZWxldGUoY2IpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gdGhpcy5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwsIHJlY29yZC50cmlnZ2Vycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiNsaXN0ZW5lcnMuY2xlYXIoKTtcblx0fVxuXHR0cmlnZ2VyKG5hbWUsIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwic2V0XCIsIC4uLmV0Yykge1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgcmV0dXJuO1xuXHRcdGlmICh0cmlnZ2VyID09PSB2b2lkIDApIHRyaWdnZXIgPSBcInNldFwiO1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGlmICghdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpKSByZXR1cm47XG5cdFx0Y29uc3Qgb3BLZXkgPSBgJHt0cmlnZ2VyID8/IFwiYWxsXCJ9YDtcblx0XHRsZXQgYnlPcCA9IHRoaXMuI3BlbmRpbmdCeVByb3AuZ2V0KG5hbWUpO1xuXHRcdGlmICghYnlPcCkge1xuXHRcdFx0YnlPcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wLnNldChuYW1lLCBieU9wKTtcblx0XHR9XG5cdFx0YnlPcC5zZXQob3BLZXksIFtcblx0XHRcdG5hbWUsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdGV0Y1xuXHRcdF0pO1xuXHRcdGlmICh0aGlzLiNmbHVzaFNjaGVkdWxlZCkgcmV0dXJuO1xuXHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcblx0XHRxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG5cdFx0XHR0aGlzLiNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRcdFx0Y29uc3QgYmF0Y2ggPSB0aGlzLiNwZW5kaW5nQnlQcm9wO1xuXHRcdFx0dGhpcy4jcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRmb3IgKGNvbnN0IFtwcm9wLCBvcE1hcF0gb2YgYmF0Y2gpIHtcblx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCAmJiB0aGlzLiNpbkRpc3BhdGNoLmhhcyhwcm9wKSkgY29udGludWU7XG5cdFx0XHRcdGlmIChwcm9wICE9IG51bGwpIHRoaXMuI2luRGlzcGF0Y2guYWRkKHByb3ApO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgWywgYXJnc10gb2Ygb3BNYXApIHtcblx0XHRcdFx0XHRcdGNvbnN0IFtubSwgdiwgb3YsIHRnLCByZXN0XSA9IGFyZ3M7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLiNkaXNwYXRjaChubSwgdiwgb3YsIHRnLCAuLi5yZXN0ID8/IFtdKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRpZiAocHJvcCAhPSBudWxsKSB0aGlzLiNpbkRpc3BhdGNoLmRlbGV0ZShwcm9wKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdGdldCBpdGVyYXRvcigpIHtcblx0XHRyZXR1cm4gdGhpcy4jaXRlcmF0b3I7XG5cdH1cbn07XG52YXIgU3Vic2NyaXB0ID0gZ2xvYmFsVGhpc1tTdWJzY3JpcHRTeW1ib2xdO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9SZXNvbHZlZC50c1xudmFyIHJhd09mID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXBwZWQgPSBkZXJlZih0YXJnZXQpO1xuXHRyZXR1cm4gdW53cmFwcGVkPy5bJGV4dHJhY3RLZXkkXSA/PyB1bndyYXBwZWQ7XG59O1xuZnVuY3Rpb24gcmVzb2x2ZWQodGFyZ2V0LCBtb2RlID0gXCJhbGxcIikge1xuXHRjb25zdCByYXcgPSByYXdPZih0YXJnZXQpO1xuXHRpZiAoaXNQcm9taXNlKHJhdykpIHJldHVybiByZXNvbHZlZCQxKHJhdywgbW9kZSk7XG5cdGlmIChpc1Byb21pc2UocmF3Py5bJHByb21pc2VdKSkgcmV0dXJuIHJlc29sdmVkJDEocmF3WyRwcm9taXNlXSwgbW9kZSk7XG5cdHJldHVybiByZXNvbHZlZCQxKHJhdyA/PyB0YXJnZXQsIG1vZGUpO1xufVxuZnVuY3Rpb24gbWFrZVJlc29sdmVkT3AodGFyZ2V0LCBlbWl0ID0gZmFsc2UpIHtcblx0Y29uc3QgcnVuID0gKChtb2RlID0gXCJhbGxcIikgPT4ge1xuXHRcdGNvbnN0IHBlbmRpbmcgPSByZXNvbHZlZCh0YXJnZXQsIG1vZGUpO1xuXHRcdGlmICghZW1pdCkgcmV0dXJuIHBlbmRpbmc7XG5cdFx0cmV0dXJuIHBlbmRpbmcudGhlbigodmFsdWUpID0+IHtcblx0XHRcdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCk7XG5cdFx0XHRjb25zdCBrZXkgPSByYXc/LnJlYWxQcm9wID8/IChyYXcgJiYgXCJ2YWx1ZVwiIGluIHJhdyA/IFwidmFsdWVcIiA6IG51bGwpO1xuXHRcdFx0c3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHJhdyk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCB2b2lkIDAsIFwicmVzb2x2ZWRcIik7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSk7XG5cdH0pO1xuXHRydW4uYWxsID0gKCkgPT4gcnVuKFwiYWxsXCIpO1xuXHRydW4uYWxsU2V0dGxlZCA9ICgpID0+IHJ1bihcInNldHRsZWRcIik7XG5cdHJ1bi5hbGxLZXllZCA9ICgpID0+IHJ1bihcImFsbFwiKTtcblx0cnVuLmFsbFNldHRsZWRLZXllZCA9ICgpID0+IHJ1bihcInNldHRsZWRcIik7XG5cdHJ1bi50cnkgPSAoY2FsbGJhY2tPclZhbHVlLCAuLi5hcmdzKSA9PiBQcm9taXNlLnRyeShjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpLnRoZW4oKHZhbHVlKSA9PiByZXNvbHZlZCh2YWx1ZSA/PyB0YXJnZXQsIFwiYWxsXCIpKTtcblx0cmV0dXJuIHJ1bjtcbn1cbmZ1bmN0aW9uIGVtaXRSZXNvbHZlZCh0YXJnZXQsIGtleSwgdmFsdWUsIG9sZFZhbHVlKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCkgPz8gdGFyZ2V0O1xuXHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCBcInJlc29sdmVkXCIpO1xufVxuZnVuY3Rpb24gYmluZEV4aXN0aW5nVGhlbmFibGVzKGxpdmUsIHJhdykge1xuXHRpZiAobGl2ZSA9PSBudWxsIHx8IHJhdyA9PSBudWxsKSByZXR1cm4gbGl2ZTtcblx0aWYgKEFycmF5LmlzQXJyYXkocmF3KSkge1xuXHRcdHJhdy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcblx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlW2luZGV4XSA9IHZhbHVlO1xuXHRcdH0pO1xuXHRcdHJldHVybiBsaXZlO1xuXHR9XG5cdGlmIChyYXcgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiByYXcuZW50cmllcygpKSBpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZS5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0cmV0dXJuIGxpdmU7XG5cdH1cblx0aWYgKHJhdyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIGxpdmU7XG5cdGZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhyYXcpKSB7XG5cdFx0aWYgKGtleSA9PSAkZXh0cmFjdEtleSQgfHwga2V5ID09ICRwcm9taXNlIHx8IGtleSA9PSAkcmVzb2x2ZWQpIGNvbnRpbnVlO1xuXHRcdGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihyYXcsIGtleSk/LmVudW1lcmFibGUpIGNvbnRpbnVlO1xuXHRcdGNvbnN0IHZhbHVlID0gcmF3W2tleV07XG5cdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmVba2V5XSA9IHZhbHVlO1xuXHR9XG5cdHJldHVybiBsaXZlO1xufVxuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9TcGVjaWZpYy50c1xudmFyIF9fc2FmZUdldEd1YXJkU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0BfX3NhZmVHZXRHdWFyZFwiKTtcbnZhciBfX3N5c3RlbVNraXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG5cdFN5bWJvbC50b1N0cmluZ1RhZyxcblx0U3ltYm9sLml0ZXJhdG9yLFxuXHRTeW1ib2wuYXN5bmNJdGVyYXRvcixcblx0U3ltYm9sLnRvUHJpbWl0aXZlLFxuXHRcInRvU3RyaW5nXCIsXG5cdFwidmFsdWVPZlwiLFxuXHRcImluc3BlY3RcIixcblx0XCJjb25zdHJ1Y3RvclwiLFxuXHRcIl9fcHJvdG9fX1wiLFxuXHRcInByb3RvdHlwZVwiLFxuXHRcInRoZW5cIixcblx0XCJjYXRjaFwiLFxuXHRcImZpbmFsbHlcIixcblx0XCJuZXh0XCJcbl0pO1xudmFyIHN5c3RlbVNraXBHZXQgPSAodGFyZ2V0LCBuYW1lKSA9PiB7XG5cdGlmICghX19zeXN0ZW1Ta2lwLmhhcyhuYW1lKSkgcmV0dXJuIG51bGw7XG5cdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0cmV0dXJuIHR5cGVvZiBnb3QgPT09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBnb3QpIDogZ290O1xufTtcbnZhciBfX3NhZmVHZXRHdWFyZCA9IGdsb2JhbFRoaXNbX19zYWZlR2V0R3VhcmRTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIGlzR2V0dGVyKG9iaiwgcHJvcE5hbWUpIHtcblx0bGV0IGdvdCA9IHRydWU7XG5cdHRyeSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4ocHJvcE5hbWUpO1xuXHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4ob2JqKT8uaGFzPy4ocHJvcE5hbWUpKSBnb3QgPSB0cnVlO1xuXHRcdGdvdCA9IHR5cGVvZiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3BOYW1lKT8uZ2V0ID09IFwiZnVuY3Rpb25cIjtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGdvdCA9IHRydWU7XG5cdH0gZmluYWxseSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/LmRlbGV0ZT8uKHByb3BOYW1lKTtcblx0fVxuXHRyZXR1cm4gZ290O1xufVxudmFyIGZhbGxUaHJvdWdoID0gKG9iaiwga2V5KSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCB2YWx1ZSA9IHNhZmVHZXQob2JqLCBrZXkpO1xuXHRpZiAodmFsdWUgPT0gbnVsbCAmJiBrZXkgIT0gXCJ2YWx1ZVwiKSB7XG5cdFx0Y29uc3QgdG1wID0gc2FmZUdldChvYmosIFwidmFsdWVcIik7XG5cdFx0aWYgKHRtcCAhPSBudWxsICYmICFpc1ByaW1pdGl2ZSh0bXApKSByZXR1cm4gZmFsbFRocm91Z2godG1wLCBrZXkpO1xuXHRcdGVsc2UgcmV0dXJuIHZhbHVlO1xuXHR9IGVsc2UgaWYgKGtleSA9PSBcInZhbHVlXCIgJiYgdmFsdWUgIT0gbnVsbCAmJiAhaXNQcmltaXRpdmUodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxsVGhyb3VnaCh2YWx1ZSwga2V5KSA/PyB2YWx1ZSA/PyBvYmo7XG5cdHJldHVybiB2YWx1ZSA/PyBvYmo7XG59O1xudmFyIHNhZmVTZXQgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XG5cdGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlU2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIGZhbHNlO1xuXHRhY3RpdmU/LmFkZD8uKGtleSk7XG5cdHJldHVybiBSZWZsZWN0LnNldChvYmosIGtleSwgdmFsdWUpO1xufTtcbnZhciBzYWZlR2V0ID0gKG9iaiwga2V5LCByZWMpID0+IHtcblx0bGV0IHJlc3VsdCA9IHZvaWQgMDtcblx0aWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIG51bGw7XG5cdGlmICghaXNHZXR0ZXIob2JqLCBrZXkpKSByZXN1bHQgPz89IFJlZmxlY3QuZ2V0KG9iaiwga2V5LCByZWMgIT0gbnVsbCA/IHJlYyA6IG9iaik7XG5cdGVsc2Uge1xuXHRcdGFjdGl2ZT8uYWRkPy4oa2V5KTtcblx0XHR0cnkge1xuXHRcdFx0cmVzdWx0ID0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcblx0XHR9IGNhdGNoIChfZSkge1xuXHRcdFx0cmVzdWx0ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRhY3RpdmUuZGVsZXRlKGtleSk7XG5cdFx0XHRpZiAoYWN0aXZlPy5zaXplID09PSAwKSBfX3NhZmVHZXRHdWFyZD8uZGVsZXRlPy4ob2JqKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHR5cGVvZiByZXN1bHQgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eChvYmosIHJlc3VsdCkgOiByZXN1bHQ7XG59O1xudmFyIGhhc093biA9IChvYmosIGtleSkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbnZhciBpc1RyaWdnZXJFbWl0T3B0aW9ucyA9ICh2YWx1ZSwgYWxsb3dWYWx1ZU9ubHkgPSBmYWxzZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKGhhc093bih2YWx1ZSwgXCJrZXlcIikgfHwgaGFzT3duKHZhbHVlLCBcIm5hbWVcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9sZFZhbHVlXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvbGRcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9wXCIpIHx8IGhhc093bih2YWx1ZSwgXCJ0cmlnZ2VyXCIpIHx8IGFsbG93VmFsdWVPbmx5ICYmIGhhc093bih2YWx1ZSwgXCJ2YWx1ZVwiKSk7XG59O1xudmFyIHRyaWdnZXJPcHRpb25WYWx1ZSA9IChvcHRpb25zLCBrZXksIGZhbGxiYWNrKSA9PiB7XG5cdGlmIChoYXNPd24ob3B0aW9ucywga2V5KSkgcmV0dXJuIG9wdGlvbnNba2V5XTtcblx0aWYgKGtleSA9PSBcIm9sZFZhbHVlXCIgJiYgaGFzT3duKG9wdGlvbnMsIFwib2xkXCIpKSByZXR1cm4gb3B0aW9ucy5vbGQ7XG5cdHJldHVybiBmYWxsYmFjaygpO1xufTtcbnZhciB0cmlnZ2VyT3B0aW9uVHJpZ2dlciA9IChvcHRpb25zLCBmYWxsYmFjayA9IFwibWFudWFsXCIpID0+IG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG9wdGlvbnMudHJpZ2dlciA/PyBvcHRpb25zLm9wID8/IGZhbGxiYWNrKTtcbnZhciBpc1J1bnRpbWVLZXkgPSAoa2V5KSA9PiB0eXBlb2Yga2V5ID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGtleSA9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBrZXkgPT0gXCJzeW1ib2xcIjtcbnZhciByZWFsUHJvcE9mJDEgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHByb3AgPSBzYWZlR2V0KHRhcmdldCwgJHJlYWxQcm9wKSA/PyBzYWZlR2V0KHRhcmdldCwgXCJyZWFsUHJvcFwiKTtcblx0cmV0dXJuIGlzUnVudGltZUtleShwcm9wKSA/IHByb3AgOiBudWxsO1xufTtcbnZhciB0cmlnZ2VyS2V5T2YgPSAodGFyZ2V0LCBrZXkpID0+IGtleSA9PSBcInZhbHVlXCIgPyByZWFsUHJvcE9mJDEodGFyZ2V0KSA/PyBrZXkgOiBrZXk7XG52YXIgdHJpZ2dlclZhbHVlT2YgPSAodGFyZ2V0LCBrZXkpID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mJDEodGFyZ2V0KTtcblx0aWYgKHJlYWxQcm9wICE9IG51bGwgJiYga2V5ID09IHJlYWxQcm9wKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgPz8gc2FmZUdldCh0YXJnZXQsIGtleSk7XG5cdHJldHVybiBrZXkgPT0gbnVsbCA/IHZvaWQgMCA6IHNhZmVHZXQodGFyZ2V0LCBrZXkpO1xufTtcbnZhciBjcmVhdGVUcmlnZ2VyQVBJID0gKHJlZ2lzdHJ5LCBlbWl0LCB0YXJnZXQpID0+IHtcblx0Y29uc3QgYXBpID0gKGtleSwgb3BPck9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoIWlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zKSkgdHJpZ2dlciA/Pz0gb3BPck9wdGlvbnM7XG5cdFx0cmV0dXJuIGVtaXQoaXNUcmlnZ2VyRW1pdE9wdGlvbnMoa2V5KSA/IGtleSA6IGlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zLCB0cnVlKSA/IHtcblx0XHRcdGtleSxcblx0XHRcdHRyaWdnZXIsXG5cdFx0XHQuLi5vcE9yT3B0aW9uc1xuXHRcdH0gOiB7XG5cdFx0XHRrZXksXG5cdFx0XHR0cmlnZ2VyOiB0cmlnZ2VyID8/IG9wT3JPcHRpb25zXG5cdFx0fSk7XG5cdH07XG5cdGNvbnN0IGNvbnRyb2wgPSByZWdpc3RyeT8udHJpZ2dlckNvbnRyb2w7XG5cdGlmIChjb250cm9sKSBPYmplY3QuYXNzaWduKGFwaSwgY29udHJvbCk7XG5cdGFwaS5jdXN0b20gPSAodHJpZ2dlciwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpID0+IGFwaSh7XG5cdFx0a2V5LFxuXHRcdHRyaWdnZXIsXG5cdFx0dmFsdWUsXG5cdFx0b2xkVmFsdWVcblx0fSk7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCkgYXBpLnJlc29sdmVkID0gbWFrZVJlc29sdmVkT3AodGFyZ2V0LCB0cnVlKTtcblx0cmV0dXJuIGFwaTtcbn07XG52YXIgc3lzdGVtR2V0ID0gKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IGlzUHJpbWl0aXZlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGlmICgoW1xuXHRcdFwiZGVyZWZcIixcblx0XHRcImJpbmRcIixcblx0XHRcIkB0YXJnZXRcIixcblx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdCRleHRyYWN0S2V5JCxcblx0XHQkcmVnaXN0cnlLZXkkXG5cdF0uaW5kZXhPZihuYW1lKSA8IDAgPyBzYWZlR2V0KHRhcmdldCwgbmFtZSk/LmJpbmQ/Lih0YXJnZXQpIDogbnVsbCkgIT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdGlmIChbJGV4dHJhY3RLZXkkLCAkb3JpZ2luYWxLZXkkXS5pbmRleE9mKG5hbWUpID49IDApIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdGFyZ2V0O1xuXHRpZiAobmFtZSA9PSAkdmFsdWUpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIik7XG5cdGlmIChuYW1lID09ICRyZWdpc3RyeUtleSQpIHJldHVybiByZWdpc3RyeTtcblx0aWYgKG5hbWUgPT0gJHJlc29sdmVkIHx8IG5hbWUgPT0gXCJyZXNvbHZlZFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBcInJlc29sdmVkXCIpKSByZXR1cm4gbWFrZVJlc29sdmVkT3AodGFyZ2V0KTtcblx0aWYgKG5hbWUgPT0gJHRyaWdnZXJDb250cm9sKSByZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXJDb250cm9sO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wub2JzZXJ2YWJsZSkgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuc3Vic2NyaWJlKSByZXR1cm4gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiBhZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCwgY2IsIG9wdGlvbnMpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5hc3luY0l0ZXJhdG9yKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuZGlzcG9zZSkgcmV0dXJuIChwcm9wKSA9PiB7XG5cdFx0c2FmZUdldCh0YXJnZXQsIFN5bWJvbC5kaXNwb3NlKT8uKHByb3ApO1xuXHRcdHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHR9O1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuYXN5bmNEaXNwb3NlKSByZXR1cm4gKHByb3ApID0+IHtcblx0XHRzYWZlR2V0KHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSk/Lihwcm9wKTtcblx0XHR1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0fTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLnVuc3Vic2NyaWJlKSByZXR1cm4gKHByb3ApID0+IHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xufTtcbnZhciBvYnNlcnZhYmxlQVBJTWV0aG9kcyA9ICh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KSA9PiB7XG5cdGlmIChuYW1lID09IFwic3Vic2NyaWJlXCIpIHJldHVybiByZWdpc3RyeT8uY29tcGF0aWJsZT8uW25hbWVdID8/ICgoaGFuZGxlcikgPT4ge1xuXHRcdGlmICh0eXBlb2YgaGFuZGxlciA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXIpO1xuXHRcdGVsc2UgaWYgKFwibmV4dFwiIGluIGhhbmRsZXIgJiYgaGFuZGxlcj8ubmV4dCAhPSBudWxsKSB7XG5cdFx0XHRjb25zdCB1c3ViID0gYWZmZWN0ZWQodGFyZ2V0LCBoYW5kbGVyPy5uZXh0KSwgY29tcCA9IGhhbmRsZXI/LltcImNvbXBsZXRlXCJdO1xuXHRcdFx0aGFuZGxlcltcImNvbXBsZXRlXCJdID0gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0dXN1Yj8uKCk7XG5cdFx0XHRcdHJldHVybiBjb21wPy4oLi4uYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGhhbmRsZXJbXCJjb21wbGV0ZVwiXTtcblx0XHR9XG5cdH0pO1xufTtcbnZhciBPYnNlcnZlQXJyYXlNZXRob2QgPSBjbGFzcyB7XG5cdCNuYW1lO1xuXHQjc2VsZjtcblx0I2hhbmRsZTtcblx0Y29uc3RydWN0b3IobmFtZSwgc2VsZiwgaGFuZGxlKSB7XG5cdFx0dGhpcy4jbmFtZSA9IG5hbWU7XG5cdFx0dGhpcy4jc2VsZiA9IHNlbGY7XG5cdFx0dGhpcy4jaGFuZGxlID0gaGFuZGxlO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgcmVjKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdGxldCBhZGRlZCA9IFtdLCByZW1vdmVkID0gW107XG5cdFx0bGV0IHNldFBhaXJzID0gW107XG5cdFx0bGV0IG9sZFN0YXRlID0gWy4uLnRoaXMuI3NlbGZdO1xuXHRcdGxldCBpZHggPSAtMTtcblx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4IHx8IHRoaXMuI3NlbGYsIGFyZ3MpO1xuXHRcdGlmICh0aGlzLiNoYW5kbGU/LlskdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSByZXR1cm4gb2JzZXJ2ZUFycmF5KHJlc3VsdCk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRzd2l0Y2ggKHRoaXMuI25hbWUpIHtcblx0XHRcdGNhc2UgXCJwdXNoXCI6XG5cdFx0XHRcdGlkeCA9IG9sZFN0YXRlPy5sZW5ndGg7XG5cdFx0XHRcdGFkZGVkID0gYXJncztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidW5zaGlmdFwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRhZGRlZCA9IGFyZ3M7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInBvcFwiOlxuXHRcdFx0XHRpZHggPSBvbGRTdGF0ZT8ubGVuZ3RoIC0gMTtcblx0XHRcdFx0aWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbb2xkU3RhdGVbaWR4XV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNoaWZ0XCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGlmIChvbGRTdGF0ZS5sZW5ndGggPiAwKSByZW1vdmVkID0gW29sZFN0YXRlW2lkeF1dO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzcGxpY2VcIjpcblx0XHRcdFx0aWR4ID0gYXJnc1swXTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1heChvbGRTdGF0ZS5sZW5ndGgsIHRoaXMuI3NlbGYubGVuZ3RoKTsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBvbGRTdGF0ZVtpXTtcblx0XHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHRoaXMuI3NlbGZbaV07XG5cdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09PSB2b2lkIDAgJiYgaSA+PSB0aGlzLiNzZWxmLmxlbmd0aCkgcmVtb3ZlZC5wdXNoKG9sZFZhbHVlKTtcblx0XHRcdFx0XHRlbHNlIGlmIChvbGRWYWx1ZSA9PT0gdm9pZCAwICYmIGkgPj0gb2xkU3RhdGUubGVuZ3RoKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdHZvaWQgMCxcblx0XHRcdFx0XHRcdGZhbHNlXG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChvbGRWYWx1ZSwgbmV3VmFsdWUpKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNvcnRcIjpcblx0XHRcdGNhc2UgXCJmaWxsXCI6XG5cdFx0XHRjYXNlIFwicmV2ZXJzZVwiOlxuXHRcdFx0Y2FzZSBcImNvcHlXaXRoaW5cIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvbGRTdGF0ZS5sZW5ndGg7IGkrKykgaWYgKGlzTm90RXF1YWwob2xkU3RhdGVbaV0sIHRoaXMuI3NlbGZbaV0pKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRpZHggKyBpLFxuXHRcdFx0XHRcdHRoaXMuI3NlbGZbaV0sXG5cdFx0XHRcdFx0b2xkU3RhdGVbaV0sXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2V0XCI6XG5cdFx0XHRcdGlkeCA9IGFyZ3NbMV07XG5cdFx0XHRcdHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdGlkeCxcblx0XHRcdFx0XHRhcmdzWzBdLFxuXHRcdFx0XHRcdG9sZFN0YXRlPy5baWR4XSxcblx0XHRcdFx0XHRpZHggaW4gb2xkU3RhdGVcblx0XHRcdFx0XSk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlZyA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0aGlzLiNzZWxmKTtcblx0XHRpZiAoYWRkZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIGFkZGVkWzBdLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZD8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBhZGRlZCwgbnVsbCwgXCJhZGRBbGxcIik7XG5cdFx0XHRhZGRlZC5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWc/LnRyaWdnZXI/LihpZHggKyBJLCBpdGVtLCBudWxsLCBcImFkZFwiKSk7XG5cdFx0fVxuXHRcdGlmIChzZXRQYWlycz8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKHNldFBhaXJzWzBdPy5bMF0gPz8gaWR4LCBzZXRQYWlyc1swXT8uWzFdLCBzZXRQYWlyc1swXT8uWzJdLCBzZXRQYWlyc1swXT8uWzNdID09PSBmYWxzZSA/IFwiYWRkXCIgOiBcInNldFwiKTtcblx0XHRlbHNlIGlmIChzZXRQYWlycz8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBzZXRQYWlycywgb2xkU3RhdGUsIFwic2V0QWxsXCIpO1xuXHRcdFx0c2V0UGFpcnMuZm9yRWFjaCgocGFpciwgSSkgPT4gcmVnPy50cmlnZ2VyPy4ocGFpcj8uWzBdID8/IGlkeCArIEksIHBhaXI/LlsxXSwgcGFpcj8uWzJdLCBwYWlyPy5bM10gPT09IGZhbHNlID8gXCJhZGRcIiA6IFwic2V0XCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlbW92ZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIG51bGwsIHJlbW92ZWRbMF0sIFwiZGVsZXRlXCIpO1xuXHRcdGVsc2UgaWYgKHJlbW92ZWQ/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZCwgXCJkZWxldGVBbGxcIik7XG5cdFx0XHRyZW1vdmVkLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZz8udHJpZ2dlcj8uKGlkeCArIEksIG51bGwsIGl0ZW0sIFwiZGVsZXRlXCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlc3VsdCA9PSB0YXJnZXQpIHJldHVybiBuZXcgUHJveHkocmVzdWx0LCB0aGlzLiNoYW5kbGUpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHJldHVybiBvYnNlcnZlQXJyYXkocmVzdWx0KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlID0gKHNlbGYsIHRhcmdldCwgb2xkTGVuLCBuZXdMZW4pID0+IHtcblx0Y29uc3QgcmVtb3ZlZEl0ZW1zID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPCBvbGRMZW4gPyB0YXJnZXQuc2xpY2UobmV3TGVuLCBvbGRMZW4pIDogW107XG5cdGlmICghc2VsZlskdHJpZ2dlckxvY2tdICYmIG9sZExlbiAhPT0gbmV3TGVuKSB7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA9PT0gMSkgcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtc1swXSwgXCJkZWxldGVcIik7XG5cdFx0ZWxzZSBpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuLCBudWxsLCByZW1vdmVkSXRlbXMsIFwiZGVsZXRlQWxsXCIpO1xuXHRcdFx0cmVtb3ZlZEl0ZW1zLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuICsgSSwgbnVsbCwgaXRlbSwgXCJkZWxldGVcIikpO1xuXHRcdH1cblx0XHRjb25zdCBhZGRlZENvdW50ID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPiBvbGRMZW4gPyBuZXdMZW4gLSBvbGRMZW4gOiAwO1xuXHRcdGlmIChhZGRlZENvdW50ID09PSAxKSByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgdm9pZCAwLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZENvdW50ID4gMSkge1xuXHRcdFx0Y29uc3QgYWRkZWQgPSBBcnJheShhZGRlZENvdW50KS5maWxsKHZvaWQgMCk7XG5cdFx0XHRyZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgYWRkZWQsIG51bGwsIFwiYWRkQWxsXCIpO1xuXHRcdFx0YWRkZWQuZm9yRWFjaCgoXywgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4gKyBJLCB2b2lkIDAsIG51bGwsIFwiYWRkXCIpKTtcblx0XHR9XG5cdH1cbn07XG52YXIgT2JzZXJ2ZUFycmF5SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0aGFzKHRhcmdldCwgbmFtZSkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gc2FmZUdldCh0YXJnZXQsIGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiQHRhcmdldFwiIHx8IG5hbWUgPT0gJGV4dHJhY3RLZXkkKSByZXR1cm4gdGFyZ2V0O1xuXHRcdGlmIChuYW1lID09IFwieFwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueCA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwieVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueSA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwielwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwid1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8udyA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiclwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uciA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZ1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uZyA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYlwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYSA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyAobmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IG51bGwpO1xuXHRcdGlmICh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG5ldyBQcm94eSh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIiA/IGdvdD8uYmluZD8uKHRhcmdldCkgOiBnb3QsIG5ldyBPYnNlcnZlQXJyYXlNZXRob2QobmFtZSwgdGFyZ2V0LCB0aGlzKSk7XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihwYXJzZUludChuYW1lKSkpIG5hbWUgPSBwYXJzZUludChuYW1lKSA/PyBuYW1lO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBwZW5kaW5nID0gaXNQcm9taXNlKHZhbHVlKTtcblx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IG9sZCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IHh5encgPSBbXG5cdFx0XHRcdFwieFwiLFxuXHRcdFx0XHRcInlcIixcblx0XHRcdFx0XCJ6XCIsXG5cdFx0XHRcdFwid1wiXG5cdFx0XHRdO1xuXHRcdFx0Y29uc3QgcmdiYSA9IFtcblx0XHRcdFx0XCJyXCIsXG5cdFx0XHRcdFwiZ1wiLFxuXHRcdFx0XHRcImJcIixcblx0XHRcdFx0XCJhXCJcblx0XHRcdF07XG5cdFx0XHRjb25zdCB4eXp3X2lkeCA9IHh5encuaW5kZXhPZihuYW1lKTtcblx0XHRcdGNvbnN0IHJnYmFfaWR4ID0gcmdiYS5pbmRleE9mKG5hbWUpO1xuXHRcdFx0bGV0IGdvdCA9IGZhbHNlO1xuXHRcdFx0aWYgKHh5endfaWR4ID49IDApIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgeHl6d19pZHgsIHYpO1xuXHRcdFx0ZWxzZSBpZiAocmdiYV9pZHggPj0gMCkgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCByZ2JhX2lkeCwgdik7XG5cdFx0XHRlbHNlIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdik7XG5cdFx0XHRpZiAobmFtZSA9PSBcImxlbmd0aFwiKSB7XG5cdFx0XHRcdGlmIChpc05vdEVxdWFsKG9sZCwgdikpIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlKHRoaXMsIHRhcmdldCwgb2xkLCB2KTtcblx0XHRcdH1cblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2xkLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnk/LmdldD8uKHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCB2LCBvbGQsIFwic2V0XCIpO1xuXHRcdFx0XHRpZiAocGVuZGluZykgZW1pdFJlc29sdmVkKHRhcmdldCwgbmFtZSwgdiwgb2xkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBnb3Q7XG5cdFx0fSk7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KG5hbWUpKSkgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBvbGQgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgZ290ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG5hbWUgIT0gXCJsZW5ndGhcIiAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAob2xkICE9IG51bGwpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbmFtZSwgb2xkLCBcImRlbGV0ZVwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxufTtcbnZhciBPYnNlcnZlT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIixcblx0XHRcdFwidGhlblwiLFxuXHRcdFx0XCJjYXRjaFwiLFxuXHRcdFx0XCJmaW5hbGx5XCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gcmVhbFByb3BPZiQxKHRhcmdldCkgPz8gXCJ2YWx1ZVwiKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4ga2V5ID09IFwidmFsdWVcIiB8fCBrZXkgPT0gcmVhbFByb3BPZiQxKHRhcmdldCkgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IHZvaWQgMCk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRyaWdnZXJWYWx1ZU9mKHRhcmdldCwga2V5KSk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gU3ltYm9sLnRvUHJpbWl0aXZlKSByZXR1cm4gKGhpbnQpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oaGludCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoZnQsIGhpbnQpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSwgaGludCk7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCwgaGludCk7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBTeW1ib2wudG9TdHJpbmdUYWcpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gU3RyaW5nKGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0cmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInRvU3RyaW5nXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvU3RyaW5nVGFnKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1N0cmluZ1RhZyk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIFN0cmluZyhmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZU9mXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvUHJpbWl0aXZlKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1ByaW1pdGl2ZSk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIGZ0O1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKTtcblx0XHRcdHJldHVybiBzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0O1xuXHRcdH07XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRyZXR1cm4gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldD8uW1N5bWJvbC5mb3IoXCJAQGFwcGx5XCIpXT8uYmluZD8uKHRhcmdldD8uW1N5bWJvbC5mb3IoXCJAQGFwcGx5XCIpXSA/PyB0YXJnZXQpID8/IHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuXHRcdGxldCBnb3QgPSB2b2lkIDA7XG5cdFx0dHJ5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG5cdFx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIGdvdCA9IHZvaWQgMDtcblx0XHRcdGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRnb3QgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodiwgbmFtZSk7XG5cdFx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCAkb3JpZ2luYWwgPSB0YXJnZXQ7XG5cdFx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAhKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIG5hbWUgaW4gdGFyZ2V0KSkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdHJpZ2dlck5hbWUgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gbmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA/PyBzYWZlR2V0KHRhcmdldCwgbmFtZSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0XHR0YXJnZXRbbmFtZV0gPSB2O1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdjtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdFx0Y29uc3Qgc3Vic2NyaXB0ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KCRvcmlnaW5hbCk7XG5cdFx0XHRcdGlmICgoc2FmZUdldCh0YXJnZXQsICRpc05vdEVxdWFsKSA/PyBpc05vdEVxdWFsKT8uKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHN1YnNjcmlwdD8udHJpZ2dlcj8uKHRyaWdnZXJOYW1lLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQoJG9yaWdpbmFsLCB0cmlnZ2VyTmFtZSwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSk7XG5cdH1cblx0ZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISFkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0aWYgKGRlc2NyaXB0b3IuZ2V0ID09IHZvaWQgMCAmJiBkZXNjcmlwdG9yLnNldCA9PSB2b2lkIDApIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgJHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG5cdFx0XHRnZXQ6IGRlc2NyaXB0b3IuZ2V0LFxuXHRcdFx0c2V0OiBkZXNjcmlwdG9yLnNldCxcblx0XHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA/PyB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA/PyB0cnVlXG5cdFx0fSk7XG5cdFx0c2FmZVNldCh0YXJnZXQsIG5hbWUsIG9sZFZhbHVlKTtcblx0XHRyZXR1cm4gJHJlc3VsdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIE9ic2VydmVNYXBIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHR0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgJGV4dHJhY3RLZXkkKSA/PyBzYWZlR2V0KHRhcmdldCwgJG9yaWdpbmFsS2V5JCkgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiB2YWx1ZU9yRng7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lO1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm47XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCAmJiAhaGFzT3duKG9wdGlvbnMsIFwidmFsdWVcIikpIHJldHVybjtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcImNsZWFyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8uZW50cmllcz8uKCkgfHwgW10pLCByZXN1bHQgPSB2YWx1ZU9yRngoKTtcblx0XHRcdG9sZFZhbHVlcy5mb3JFYWNoKChbcHJvcCwgb2xkVmFsdWVdKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZGVsZXRlXCIpIHJldHVybiAocHJvcCwgXyA9IG51bGwpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXMocHJvcCksIG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3ApO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInNldFwiKSByZXR1cm4gKHByb3AsIHZhbHVlKSA9PiBwb3RlbnRpYWxseUFzeW5jTWFwKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyhwcm9wKSwgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCwgdik7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRpZiAoIWhhZCB8fCBpc05vdEVxdWFsKG9sZFZhbHVlLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCB2LCBoYWQgPyBvbGRWYWx1ZSA6IG51bGwsIGhhZCA/IFwic2V0XCIgOiBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHByb3AsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0aWYgKG5hbWUgPT0gXCJnZXRPckluc2VydFwiIHx8IG5hbWUgPT0gXCJnZXRPckluc2VydENvbXB1dGVkXCIpIHtcblx0XHRcdGNvbnN0IGNvbXB1dGVkID0gbmFtZSA9PSBcImdldE9ySW5zZXJ0Q29tcHV0ZWRcIjtcblx0XHRcdHJldHVybiAoa2V5LCBkZWZhdWx0T3JDb21wdXRlKSA9PiB7XG5cdFx0XHRcdGlmICh0YXJnZXQuaGFzKGtleSkpIHJldHVybiB0YXJnZXQuZ2V0KGtleSk7XG5cdFx0XHRcdGNvbnN0IGluY29taW5nID0gY29tcHV0ZWQgPyB0eXBlb2YgZGVmYXVsdE9yQ29tcHV0ZSA9PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0T3JDb21wdXRlKGtleSkgOiBkZWZhdWx0T3JDb21wdXRlIDogZGVmYXVsdE9yQ29tcHV0ZTtcblx0XHRcdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmNNYXAoaW5jb21pbmcsICh2KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdHlwZW9mIHRhcmdldC5nZXRPckluc2VydCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQuZ2V0T3JJbnNlcnQoa2V5LCB2KSA6ICh0YXJnZXQuc2V0KGtleSwgdiksIHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0XHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4oa2V5LCB2LCBudWxsLCBcImFkZFwiKTtcblx0XHRcdFx0XHRcdGlmIChpc1Byb21pc2UoaW5jb21pbmcpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBrZXksIHYsIG51bGwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZU9yRng7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZVNldEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdID0gZmFsc2U7XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0dGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsICRleHRyYWN0S2V5JCkgPz8gc2FmZUdldCh0YXJnZXQsICRvcmlnaW5hbEtleSQpID8/IHRhcmdldDtcblx0XHRjb25zdCB2YWx1ZU9yRnggPSBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gdmFsdWVPckZ4O1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZTtcblx0XHRcdGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0YXJnZXQuaGFzKGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiY2xlYXJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlcyA9IEFycmF5LmZyb20odGFyZ2V0Py52YWx1ZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG5cdFx0XHRvbGRWYWx1ZXMuZm9yRWFjaCgob2xkVmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obnVsbCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJkZWxldGVcIikgcmV0dXJuICh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2YWx1ZSksIG9sZFZhbHVlID0gaGFkID8gdmFsdWUgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodmFsdWUpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHZhbHVlLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhZGRcIikgcmV0dXJuICh2YWx1ZSkgPT4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXModiksIG9sZFZhbHVlID0gaGFkID8gdiA6IG51bGwsIHJlc3VsdCA9IHZhbHVlT3JGeCh2KTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdGlmICghaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHYsIHYsIG9sZFZhbHVlLCBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHYsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciAkaXNPYnNlcnZhYmxlID0gKHRhcmdldCkgPT4ge1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSkpO1xufTtcbnZhciBvYnNlcnZlQXJyYXkgPSAoYXJyKSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKGFycikpIHJldHVybiBhcnI7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgoYXJyLCBuZXcgT2JzZXJ2ZUFycmF5SGFuZGxlcigpKSwgYXJyKTtcbn07XG52YXIgb2JzZXJ2ZU9iamVjdCA9IChvYmopID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUob2JqKSkgcmV0dXJuIG9iajtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChvYmosIG5ldyBPYnNlcnZlT2JqZWN0SGFuZGxlcigpKSwgb2JqKTtcbn07XG52YXIgb2JzZXJ2ZU1hcCA9IChtYXApID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUobWFwKSkgcmV0dXJuIG1hcDtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChtYXAsIG5ldyBPYnNlcnZlTWFwSGFuZGxlcigpKSwgbWFwKTtcbn07XG52YXIgb2JzZXJ2ZVNldCA9IChzZXQpID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUoc2V0KSkgcmV0dXJuIHNldDtcblx0cmV0dXJuIHdyYXBXaXRoKHNldCwgbmV3IE9ic2VydmVTZXRIYW5kbGVyKCkpO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvUHJpbWl0aXZlcy50c1xudmFyIG51bWJlclJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IGlzUHJvbWlzZSA/IDAgOiBOdW1iZXIoZGVyZWYoaW5pdGlhbCkgfHwgMCkgfHwgMCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCgodHlwZW9mIHRoaXM/LlskdmFsdWVdICE9IFwib2JqZWN0XCIgPyB0aGlzPy5bJHZhbHVlXSA6IHRoaXM/LlskdmFsdWVdPy52YWx1ZSB8fCAwKSA/PyAwLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4odikgPyBOdW1iZXIodikgOiB0aGlzWyR2YWx1ZV0pIHx8IDA7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gTnVtYmVyKHRoaXNbJHZhbHVlXSB8fCAwKSB8fCAwO1xuXHRcdH1cblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIHN0cmluZ1JlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBcIlwiIDogU3RyaW5nKGRlcmVmKHR5cGVvZiBpbml0aWFsID09IFwibnVtYmVyXCIgPyBTdHJpbmcoaW5pdGlhbCkgOiBpbml0aWFsIHx8IFwiXCIpKSkgPz8gXCJcIixcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSA/PyBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSBTdHJpbmcodHlwZW9mIHYgPT0gXCJudW1iZXJcIiA/IFN0cmluZyh2KSA6IHYgfHwgXCJcIikgPz8gXCJcIjtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpc1skdmFsdWVdID8/IFwiXCIpID8/IFwiXCI7XG5cdFx0fVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgYm9vbGVhblJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBmYWxzZSA6IChkZXJlZihpbml0aWFsKSAhPSBudWxsID8gdHlwZW9mIGRlcmVmKGluaXRpYWwpID09IFwic3RyaW5nXCIgPyB0cnVlIDogISFkZXJlZihpbml0aWFsKSA6IGZhbHNlKSB8fCBmYWxzZSkgfHwgZmFsc2UsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoISF0aGlzPy5bJHZhbHVlXSB8fCBmYWxzZSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gKHYgIT0gbnVsbCA/IHR5cGVvZiB2ID09IFwic3RyaW5nXCIgPyB0cnVlIDogISF2IDogdGhpc1skdmFsdWVdKSB8fCBmYWxzZTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gfHwgZmFsc2U7XG5cdFx0fVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgd3JhcFJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzLnZhbHVlLCBoaW50KTtcblx0XHR9LFxuXHRcdHZhbHVlOiBpc1Byb21pc2UgPyBudWxsIDogZGVyZWYoaW5pdGlhbClcblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZmZlY3RlZChpbml0aWFsLCAodikgPT4ge1xuXHRcdCRyPy5bJHRyaWdnZXJdPy4oKTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgbWFya1JlYWxQcm9wID0gKHRhcmdldCwgcmVhbFByb3ApID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGFyZ2V0ICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRhcmdldDtcblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCAkcmVhbFByb3AsIHtcblx0XHRcdHZhbHVlOiByZWFsUHJvcCxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0gY2F0Y2gge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXJnZXRbJHJlYWxQcm9wXSA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHR0cnkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIFwicmVhbFByb3BcIiwge1xuXHRcdFx0dmFsdWU6IHJlYWxQcm9wLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhcmdldC5yZWFsUHJvcCA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBwcm9wUmVmID0gKHNyYywgc3JjUHJvcCA9IFwidmFsdWVcIiwgaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKHNyYykgfHwgIXNyYykgcmV0dXJuIHNyYztcblx0aWYgKEFycmF5LmlzQXJyYXkoc3JjKSAmJiBzcmMubGVuZ3RoID09IDIgJiYgc3JjWzBdICE9IG51bGwgJiYgKHNyY1swXSBpbnN0YW5jZW9mIE1hcCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrTWFwIHx8IHNyY1swXSBpbnN0YW5jZW9mIFNldCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrU2V0KSkge1xuXHRcdGlmIChzcmNQcm9wID09IG51bGwgfHwgc3JjUHJvcCA9PT0gXCJ2YWx1ZVwiKSBzcmNQcm9wID0gc3JjWzFdO1xuXHRcdHNyYyA9IHNyY1swXTtcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNyYykgJiYgIWlzQXJyYXlJbnZhbGlkS2V5KHNyYz8uWzFdLCBzcmMpICYmIChBcnJheS5pc0FycmF5KHNyYz8uWzBdKSB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJmdW5jdGlvblwiKSkgc3JjID0gc3JjPy5bMF07XG5cdGNvbnN0IGlzTWFwID0gc3JjIGluc3RhbmNlb2YgTWFwIHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtNYXAgfHwgdHlwZW9mIHNyYz8uZ2V0ID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc3JjPy5zZXQgPT0gXCJmdW5jdGlvblwiICYmICh0eXBlb2Ygc3JjPy5kZWxldGUgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBzcmM/LnJlbW92ZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRjb25zdCBpc1NldCA9IHNyYyBpbnN0YW5jZW9mIFNldCB8fCBzcmMgaW5zdGFuY2VvZiBXZWFrU2V0IHx8IHR5cGVvZiBzcmM/LmhhcyA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNyYz8uYWRkID09IFwiZnVuY3Rpb25cIiAmJiAodHlwZW9mIHNyYz8uZGVsZXRlID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygc3JjPy5yZW1vdmUgPT0gXCJmdW5jdGlvblwiKTtcblx0aWYgKGlzTWFwIHx8IGlzU2V0KSB7XG5cdFx0aWYgKHNyY1Byb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHR9IGVsc2UgaWYgKChzcmNQcm9wID8/PSBBcnJheS5pc0FycmF5KHNyYykgPyBudWxsIDogXCJ2YWx1ZVwiKSA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KHNyY1Byb3AsIHNyYykpIHJldHVybjtcblx0Y29uc3QgcmVhZFNsb3QgPSAoKSA9PiB7XG5cdFx0aWYgKGlzTWFwKSByZXR1cm4gc3JjPy5nZXQ/LihzcmNQcm9wKTtcblx0XHRpZiAoaXNTZXQpIHJldHVybiBzcmM/Lmhhcz8uKHNyY1Byb3ApID8gc3JjUHJvcCA6IG51bGw7XG5cdFx0cmV0dXJuIHNyYz8uW3NyY1Byb3BdO1xuXHR9O1xuXHRjb25zdCB3cml0ZVNsb3QgPSAodikgPT4ge1xuXHRcdGlmIChpc01hcCkge1xuXHRcdFx0Y29uc3QgbWFwID0gc3JjO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwodiwgbWFwPy5nZXQ/LihzcmNQcm9wKSkpIG1hcD8uc2V0Py4oc3JjUHJvcCwgdik7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9XG5cdFx0aWYgKGlzU2V0KSB7XG5cdFx0XHRjb25zdCBzZXQgPSBzcmM7XG5cdFx0XHRjb25zdCBtZW1iZXIgPSB2ID8/IHNyY1Byb3A7XG5cdFx0XHRpZiAobWVtYmVyID09IG51bGwpIHtcblx0XHRcdFx0c2V0Py5kZWxldGU/LihzcmNQcm9wKTtcblx0XHRcdFx0cmV0dXJuIG1lbWJlcjtcblx0XHRcdH1cblx0XHRcdGlmICghc2V0Py5oYXM/LihtZW1iZXIpKSBzZXQ/LmFkZD8uKG1lbWJlcik7XG5cdFx0XHRyZXR1cm4gbWVtYmVyO1xuXHRcdH1cblx0XHRpZiAoaXNOb3RFcXVhbCh2LCBzcmM/LltzcmNQcm9wXSkpIHNyY1tzcmNQcm9wXSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH07XG5cdGlmIChpc01hcCAmJiBpbml0aWFsICE9PSB2b2lkIDAgJiYgIXNyYz8uaGFzPy4oc3JjUHJvcCkpIHNyYz8uc2V0Py4oc3JjUHJvcCwgaW5pdGlhbCk7XG5cdGVsc2UgaWYgKGlzU2V0ICYmIGluaXRpYWwgJiYgIXNyYz8uaGFzPy4oc3JjUHJvcCkpIHNyYz8uYWRkPy4oc3JjUHJvcCk7XG5cdGNvbnN0IGN1cnJlbnQgPSByZWFkU2xvdCgpO1xuXHRpZiAoIWlzU2V0ICYmIHNyY1Byb3AgIT0gbnVsbCAmJiBoYXNWYWx1ZShjdXJyZW50KSAmJiBpc09ic2VydmFibGUoY3VycmVudCkpIHJldHVybiBtYXJrUmVhbFByb3AocmVjb3ZlclJlYWN0aXZlKGN1cnJlbnQpLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQgJiYgc3JjUHJvcCAmJiB0eXBlb2Ygc3JjPy5nZXRQcm9wZXJ0eSA9PSBcImZ1bmN0aW9uXCIgJiYgaXNPYnNlcnZhYmxlKHNyYz8uZ2V0UHJvcGVydHk/LihzcmNQcm9wKSkpIHJldHVybiBtYXJrUmVhbFByb3Aoc3JjPy5nZXRQcm9wZXJ0eT8uKHNyY1Byb3ApLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQpIHNyY1tzcmNQcm9wXSA/Pz0gaW5pdGlhbCA/PyBzcmM/LltzcmNQcm9wXTtcblx0ZWxzZSBpZiAoaXNNYXAgJiYgaXNOb3RFcXVhbChpbml0aWFsID8/IHNyYz8uZ2V0Py4oc3JjUHJvcCksIHNyYz8uZ2V0Py4oc3JjUHJvcCkpKSBzcmM/LnNldD8uKHNyY1Byb3AsIGluaXRpYWwgPz8gc3JjPy5nZXQ/LihzcmNQcm9wKSk7XG5cdGVsc2UgaWYgKGlzU2V0ICYmIHNyYz8uaGFzPy4oaW5pdGlhbCA/PyBzcmNQcm9wKSkgc3JjPy5hZGQ/Lihpbml0aWFsID8/IHNyY1Byb3ApO1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IGlzU2V0ID8gcmVhZFNsb3QoKSA6IHJlYWRTbG90KCkgPz8gaW5pdGlhbCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyhyZWFkU2xvdCgpID8/IHRoaXNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludChyZWFkU2xvdCgpLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHRyWyR0cmlnZ2VyTG9jayQxXSA9IHRydWU7XG5cdFx0XHRpZiAoaXNTZXQpIHRoaXNbJHZhbHVlXSA9IHdyaXRlU2xvdCh2KTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjb25zdCBuZXh0ID0gdiA/PyBkZWZhdWx0QnlUeXBlKHJlYWRTbG90KCkpO1xuXHRcdFx0XHR0aGlzWyR2YWx1ZV0gPSB3cml0ZVNsb3QobmV4dCk7XG5cdFx0XHR9XG5cdFx0XHRyWyR0cmlnZ2VyTG9jayQxXSA9IGZhbHNlO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0Y29uc3Qgc2xvdCA9IHJlYWRTbG90KCk7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gc2xvdCA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0bWFya1JlYWxQcm9wKHIsIHNyY1Byb3ApO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzcmMsICh2LCBfcHJvcCwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKF9wcm9wICE9IHNyY1Byb3ApIHJldHVybjtcblx0XHRpZiAoclskdHJpZ2dlckxvY2skMV0pIHJldHVybjtcblx0XHRjb25zdCBuZXh0ID0gaXNTZXQgPyByZWFkU2xvdCgpIDogdjtcblx0XHRjb25zdCBwcmV2ID0gclskdmFsdWVdO1xuXHRcdHJbJHZhbHVlXSA9IG5leHQ7XG5cdFx0clskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiBuZXh0LFxuXHRcdFx0b2xkVmFsdWU6IG9sZCA/PyBwcmV2LFxuXHRcdFx0dHJpZ2dlcjogdHJpZ2dlciA/PyBcInNldFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHI7XG59O1xudmFyICRyZWYgPSAodHlwZWQsIGJlaGF2aW9yKSA9PiB7XG5cdHN3aXRjaCAodHlwZW9mIHR5cGVkKSB7XG5cdFx0Y2FzZSBcImJvb2xlYW5cIjogcmV0dXJuIGJvb2xlYW5SZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwibnVtYmVyXCI6IHJldHVybiBudW1iZXJSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwic3RyaW5nXCI6IHJldHVybiBzdHJpbmdSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwib2JqZWN0XCI6IGlmICh0eXBlZCAhPSBudWxsKSByZXR1cm4gd3JhcFJlZihvYnNlcnZlKHR5cGVkKSwgYmVoYXZpb3IpO1xuXHRcdGRlZmF1bHQ6IHJldHVybiB3cmFwUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdH1cbn07XG52YXIgcmVmID0gKHR5cGVkLCBwcm9wID0gXCJ2YWx1ZVwiLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCAkciA9IGlzT2JzZXJ2YWJsZSh0eXBlZCkgPyB0eXBlZCA6ICRyZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0aWYgKHByb3AgIT0gbnVsbCkgcmV0dXJuIHByb3BSZWYoJHIsIHByb3AsIGJlaGF2aW9yKTtcblx0ZWxzZSByZXR1cm4gJHI7XG59O1xudmFyIHByb21pc2VkID0gKHByb21pc2UsIGJlaGF2aW9yKSA9PiB7XG5cdHJldHVybiByZWYocHJvbWlzZSwgYmVoYXZpb3IpO1xufTtcbnZhciB0cmlnZ2VyV2l0aERlbGF5ID0gKHJlZiwgY2IsIGRlbGF5ID0gMTAwKSA9PiB7XG5cdGlmIChyZWY/LnZhbHVlID8/IHJlZikgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGlmIChyZWYudmFsdWUpIGNiPy4oKTtcblx0fSwgZGVsYXkpO1xufTtcbnZhciBkZWxheWVkQmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHR9O1xufTtcbnZhciBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHRcdGlmICghdG0pIGNiPy4oKTtcblx0fTtcbn07XG5mdW5jdGlvbiBvYnNlcnZlKHRhcmdldCwgc3RhdGVOYW1lKSB7XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0aWYgKCh0YXJnZXQgPSBkZXJlZj8uKHRhcmdldCkpID09IG51bGwgfHwgdGFyZ2V0IGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0YXJnZXQgaW5zdGFuY2VvZiBXZWFrUmVmIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0Y29uc3QgdW53cmFwID0gdGFyZ2V0O1xuXHRpZiAodW53cmFwID09IG51bGwgfHwgdHlwZW9mIHVud3JhcCA9PSBcInN5bWJvbFwiIHx8ICEodHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiKSB8fCB1bndyYXAgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHVud3JhcCBpbnN0YW5jZW9mIFdlYWtSZWYpIHJldHVybiB1bndyYXA7XG5cdGxldCByZWFjdGl2ZSA9IHVud3JhcDtcblx0aWYgKEFycmF5LmlzQXJyYXkodW53cmFwKSkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZUFycmF5KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZU1hcCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVTZXQodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlT2JqZWN0KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9XG5cdHJldHVybiByZWFjdGl2ZTtcbn1cbnZhciBpc09ic2VydmFibGUgPSAodGFyZ2V0KSA9PiB7XG5cdGlmICh0eXBlb2YgSFRNTElucHV0RWxlbWVudCAhPSBcInVuZGVmaW5lZFwiICYmIHRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSB8fCBzdWJzY3JpcHRSZWdpc3RyeT8uaGFzPy4odGFyZ2V0KSkpO1xufTtcbnZhciByZWNvdmVyUmVhY3RpdmUgPSAodGFyZ2V0KSA9PiB7XG5cdHJldHVybiBpc09ic2VydmFibGUodGFyZ2V0KSA/IG9ic2VydmUodGFyZ2V0KSA6IG51bGw7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9NYWlubGluZS50c1xudmFyIHVzZU9ic2VydmFibGUgPSAodW53cmFwKSA9PiB7XG5cdGlmICh1bndyYXAgPT0gbnVsbCB8fCB0eXBlb2YgdW53cmFwICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHVud3JhcCAhPSBcImZ1bmN0aW9uXCIgfHwgdW53cmFwPy5bU3ltYm9sLm9ic2VydmFibGVdICE9IG51bGwpIHJldHVybiB1bndyYXA7XG5cdHRyeSB7XG5cdFx0dW53cmFwW1N5bWJvbC5vYnNlcnZhYmxlXSA9IHNlbGY/LmNvbXBhdGlibGU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRjb25zb2xlLndhcm4oXCJVbmFibGUgdG8gYXNzaWduIDxbU3ltYm9sLm9ic2VydmFibGVdPiwgb2JqZWN0IHdpbGwgbm90IG9ic2VydmFibGUgYnkgb3RoZXIgZnJhbWV3b3Jrc1wiKTtcblx0fVxuXHR1bndyYXBbJGFmZmVjdGVkXSA9IChjYiwgcHJvcCwgb3B0aW9ucykgPT4ge1xuXHRcdGNvbnN0IG9ic2VydmFibGUgPSB1bndyYXA/LltTeW1ib2w/Lm9ic2VydmFibGVdO1xuXHRcdG9ic2VydmFibGU/LigpPy5hZmZlY3RlZD8uKGNiLCBwcm9wLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gKCkgPT4gb2JzZXJ2YWJsZT8uKCk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH07XG5cdHJldHVybiB1bndyYXA7XG59O1xudmFyIHNwZWNpYWxpemVkU3Vic2NyaWJlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgY2hlY2tWYWxpZE9iaiA9IChvYmopID0+IHtcblx0aWYgKHR5cGVvZiBvYmogPT0gXCJzeW1ib2xcIiB8fCBvYmogPT0gbnVsbCB8fCAhKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikpIHJldHVybjtcblx0cmV0dXJuIG9iajtcbn07XG52YXIgaW5pdGlhbFRyaWdnZXIgPSBcImluaXRpYWxcIjtcbnZhciByZWFsUHJvcE9mID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCBwcm9wID0gdGFyZ2V0Py5bJHJlYWxQcm9wXSA/PyB0YXJnZXQ/LnJlYWxQcm9wO1xuXHRyZXR1cm4gaXNLZXlUeXBlKHByb3ApID8gcHJvcCA6IG51bGw7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mKHRhcmdldCk7XG5cdGlmIChyZWFsUHJvcCAhPSBudWxsICYmIChwcm9wID09IG51bGwgfHwgcHJvcCA9PSBcInZhbHVlXCIpKSByZXR1cm4gcmVhbFByb3A7XG5cdHJldHVybiBwcm9wO1xufTtcbnZhciBwcm9wVmFsdWVPZiA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0aWYgKHByb3AgIT0gbnVsbCAmJiBwcm9wID09IHJlYWxQcm9wT2YodGFyZ2V0KSkgcmV0dXJuIHRhcmdldD8udmFsdWU7XG5cdHJldHVybiB0YXJnZXQ/Lltwcm9wXTtcbn07XG52YXIgY2FsbEJ5UHJvcFJlZkF3YXJlID0gKHRhcmdldCwgcHJvcCwgY2IsIGN0eCkgPT4ge1xuXHRpZiAocHJvcCAhPSBudWxsICYmIHByb3AgPT0gcmVhbFByb3BPZih0YXJnZXQpKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSBwcm9wVmFsdWVPZih0YXJnZXQsIHByb3ApO1xuXHRcdGlmICh2YWx1ZSAhPSBudWxsKSByZXR1cm4gY2I/Lih2YWx1ZSwgcHJvcCwgbnVsbCwgXCJzZXRcIik7XG5cdH1cblx0cmV0dXJuIGNhbGxCeVByb3AodGFyZ2V0LCBwcm9wLCBjYiwgY3R4KTtcbn07XG52YXIgd2l0aFRyaWdnZXIgPSAoY2IsIG9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKTtcblx0aWYgKHRyaWdnZXIgPT0gaW5pdGlhbFRyaWdnZXIpIHtcblx0XHRpZiAoIW5vcm1hbGl6ZWQudHJpZ2dlckltbWVkaWF0ZWx5KSByZXR1cm47XG5cdH0gZWxzZSBpZiAoIXRyaWdnZXJGaWx0ZXJBbGxvd3Mobm9ybWFsaXplZC5hZmZlY3RUeXBlcywgdHJpZ2dlcikpIHJldHVybjtcblx0cmV0dXJuICh2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIC4uLmV0YykgPT4gY2I/Lih2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG59O1xudmFyIHN1YnNjcmliZURpcmVjdGx5ID0gKHRhcmdldCwgcHJvcCwgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmICghdGFyZ2V0KSByZXR1cm47XG5cdGlmICghY2hlY2tWYWxpZE9iaih0YXJnZXQpKSByZXR1cm47XG5cdGNvbnN0IHRQcm9wID0gcHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IgPyBub3JtYWxpemVBZmZlY3RlZFByb3AodGFyZ2V0LCBwcm9wKSA6IG51bGw7XG5cdGxldCByZWdpc3RyeSA9IHRhcmdldD8uWyRyZWdpc3RyeUtleSRdID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHR0YXJnZXQgPSB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldDtcblx0cXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuXHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0aWYgKCFpbml0aWFsQ2IpIHJldHVybjtcblx0XHRpZiAodFByb3AgIT0gbnVsbCAmJiB0UHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IpIGNhbGxCeVByb3BSZWZBd2FyZSh0YXJnZXQsIHRQcm9wLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdGVsc2UgY2FsbEJ5QWxsUHJvcCh0YXJnZXQsIGluaXRpYWxDYiwgbnVsbCk7XG5cdH0pO1xuXHRsZXQgdW5TdWIgPSByZWdpc3RyeT8uYWZmZWN0ZWQ/LihjYiwgdFByb3AsIG9wdGlvbnMpO1xuXHRpZiAodGFyZ2V0Py5bU3ltYm9sLmRpc3Bvc2VdKSByZXR1cm4gdW5TdWI7XG5cdGFkZFRvQ2FsbENoYWluKHVuU3ViLCBTeW1ib2wuZGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih1blN1YiwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih0YXJnZXQsIFN5bWJvbC5kaXNwb3NlLCB1blN1Yik7XG5cdGFkZFRvQ2FsbENoYWluKHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRyZXR1cm4gdW5TdWI7XG59O1xudmFyIHN1YnNjcmliZUlucHV0ID0gKHRnLCBfLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgYWZmZWN0VHlwZXMgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucykuYWZmZWN0VHlwZXM7XG5cdGNvbnN0ICRvcHQgPSB7fTtcblx0bGV0IG9sZFZhbHVlID0gdGc/LnZhbHVlO1xuXHRjb25zdCAkY2IgPSAoZXYpID0+IHtcblx0XHRjb25zdCB2YWx1ZSA9IGV2Py50YXJnZXQ/LnZhbHVlO1xuXHRcdGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcInNldFwiKSkgY2I/Lih2YWx1ZSwgXCJ2YWx1ZVwiLCBvbGRWYWx1ZSwgXCJzZXRcIiwgZXYpO1xuXHRcdG9sZFZhbHVlID0gdmFsdWU7XG5cdH07XG5cdHRnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcblx0cmV0dXJuICgpID0+IHRnPy5yZW1vdmVFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcbn07XG52YXIgY2hlY2tJc1BhaXJlZCA9ICh0ZykgPT4ge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh0ZykgJiYgdGc/Lmxlbmd0aCA9PSAyICYmIGNoZWNrVmFsaWRPYmoodGc/LlswXSkgJiYgKGlzS2V5VHlwZSh0Zz8uWzFdKSB8fCB0Zz8uWzFdID09IFN5bWJvbC5pdGVyYXRvcik7XG59O1xudmFyIGlzRWZmZWN0T3B0aW9uc0FyZyA9ICh2YWx1ZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiB2YWx1ZSB8fCBcInRyaWdnZXJzXCIgaW4gdmFsdWUgfHwgXCJ0cmlnZ2VySW1tZWRpYXRlbHlcIiBpbiB2YWx1ZSk7XG59O1xudmFyIG5vcm1hbGl6ZUVmZmVjdFRhcmdldHMgPSAodGFyZ2V0cykgPT4ge1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gW107XG5cdGlmIChBcnJheS5pc0FycmF5KHRhcmdldHMpICYmICFjaGVja0lzUGFpcmVkKHRhcmdldHMpICYmICFpc09ic2VydmFibGUodGFyZ2V0cykpIHJldHVybiB0YXJnZXRzO1xuXHRyZXR1cm4gW3RhcmdldHNdO1xufTtcbnZhciBlZmZlY3RUYXJnZXRDb250ZXh0ID0gKHNvdXJjZSkgPT4ge1xuXHRpZiAoY2hlY2tJc1BhaXJlZChzb3VyY2UpKSB7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gc291cmNlPy5bMF07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNvdXJjZSxcblx0XHRcdHRhcmdldCxcblx0XHRcdHByb3A6IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCh0YXJnZXQsIHNvdXJjZT8uWzFdKVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHtcblx0XHRzb3VyY2UsXG5cdFx0dGFyZ2V0OiBzb3VyY2UsXG5cdFx0cHJvcDogbnVsbFxuXHR9O1xufTtcbnZhciB0b0VmZmVjdEV2ZW50ID0gKHNvdXJjZSwgdGFyZ2V0LCB2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIGFyZ3MpID0+ICh7XG5cdHNvdXJjZSxcblx0dGFyZ2V0LFxuXHR2YWx1ZSxcblx0cHJvcCxcblx0bmFtZTogcHJvcCxcblx0b2xkVmFsdWUsXG5cdHRyaWdnZXIsXG5cdGFyZ3Ncbn0pO1xudmFyIHN1YnNjcmliZVBhaXJlZCA9ICh0ZywgXywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IHByb3AgPSBpc0tleVR5cGUodGc/LlsxXSkgPyB0Zz8uWzFdIDogbnVsbDtcblx0cmV0dXJuIGFmZmVjdGVkKHRnPy5bMF0sIHByb3AsIGNiLCBvcHRpb25zKTtcbn07XG52YXIgc3Vic2NyaWJlVGhlbmFibGUgPSAob2JqLCBwcm9wLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0cmV0dXJuIG9iaj8udGhlbj8uKChvYmopID0+IGFmZmVjdGVkPy4ob2JqLCBwcm9wLCBjYiwgb3B0aW9ucykpPy5jYXRjaD8uKChlKSA9PiB7XG5cdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9KTtcbn07XG52YXIgYWZmZWN0ZWQgPSAob2JqLCBwcm9wLCBjYiA9ICgpID0+IHt9LCBvcHRpb25zKSA9PiB7XG5cdGxldCBrZXkgPSBudWxsO1xuXHRpZiAodHlwZW9mIHByb3AgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0b3B0aW9ucyA9IGNiO1xuXHRcdGNiID0gcHJvcDtcblx0fSBlbHNlIGtleSA9IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcChvYmosIHByb3ApO1xuXHRpZiAodHlwZW9mIGNiID09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShjYikpIHtcblx0XHRvcHRpb25zID0gY2I7XG5cdFx0Y2IgPSAoKSA9PiB7fTtcblx0fVxuXHRpZiAoaXNQcmltaXRpdmUob2JqKSB8fCB0eXBlb2Ygb2JqID09IFwic3ltYm9sXCIpIHtcblx0XHRpZiAobm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpLnRyaWdnZXJJbW1lZGlhdGVseSkgcmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdHJldHVybiBjYj8uKG9iaiwgbnVsbCwgbnVsbCwgbnVsbCwgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdH0pKTtcblx0fVxuXHRpZiAodHlwZW9mIG9iaj8uWyRhZmZlY3RlZF0gPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gb2JqPy5bJGFmZmVjdGVkXT8uKGNiLCBrZXksIG9wdGlvbnMpO1xuXHRlbHNlIGlmIChjaGVja1ZhbGlkT2JqKG9iaikpIHtcblx0XHRjb25zdCB3cmFwcGVkID0gb2JqO1xuXHRcdGlmIChzcGVjaWFsaXplZFN1YnNjcmliZT8uaGFzPy4ob2JqID0gb2JqPy5bJGV4dHJhY3RLZXkkXSA/PyBvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldD8uKG9iaik/Lih3cmFwcGVkLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaXNPYnNlcnZhYmxlKHdyYXBwZWQpIHx8IGNoZWNrSXNQYWlyZWQob2JqKSAmJiBpc09ic2VydmFibGUob2JqPy5bMF0pKSB7XG5cdFx0XHRpZiAoaXNUaGVuYWJsZShvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVUaGVuYWJsZSk/LihvYmosIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdFx0ZWxzZSBpZiAoY2hlY2tJc1BhaXJlZChvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVQYWlyZWQpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBIVE1MSW5wdXRFbGVtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgb2JqIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlSW5wdXQpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlRGlyZWN0bHkpPy4od3JhcHBlZCwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0XHRpZiAoIWluaXRpYWxDYikgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdFx0aWYgKGNoZWNrSXNQYWlyZWQob2JqKSkgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaj8uWzBdLCBvYmo/LlsxXSwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdFx0ZWxzZSBpZiAoa2V5ICE9IG51bGwgJiYga2V5ICE9IFN5bWJvbC5pdGVyYXRvcikgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaiwga2V5LCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0XHRlbHNlIHJldHVybiBjYWxsQnlBbGxQcm9wPy4ob2JqLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxufTtcbmZ1bmN0aW9uIGVmZmVjdChjYiwgdGFyZ2V0cywgb3B0aW9ucykge1xuXHRpZiAoY2IgPT0gbnVsbCB8fCB0eXBlb2YgY2IgIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGlmIChpc0VmZmVjdE9wdGlvbnNBcmcodGFyZ2V0cykgJiYgb3B0aW9ucyA9PT0gdm9pZCAwKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIHRhcmdldHMpO1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIG9wdGlvbnMpO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Y29uc3QgYWZmZWN0ZWRPcHRpb25zID0ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVkLmFmZmVjdFR5cGVzLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogbm9ybWFsaXplZC50cmlnZ2VySW1tZWRpYXRlbHlcblx0fTtcblx0Y29uc3QgZGlzcG9zZXJzID0gbm9ybWFsaXplRWZmZWN0VGFyZ2V0cyh0YXJnZXRzKS5tYXAoKHNvdXJjZSkgPT4ge1xuXHRcdGNvbnN0IGN0eCA9IGVmZmVjdFRhcmdldENvbnRleHQoc291cmNlKTtcblx0XHRyZXR1cm4gYWZmZWN0ZWQoY3R4LnRhcmdldCwgY3R4LnByb3AsICh2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmFyZ3MpID0+IHtcblx0XHRcdHJldHVybiBjYih0b0VmZmVjdEV2ZW50KGN0eC5zb3VyY2UsIGN0eC50YXJnZXQsIHZhbHVlLCBwcm9wLCBvbGRWYWx1ZSwgdHJpZ2dlciA/PyBudWxsLCBhcmdzKSk7XG5cdFx0fSwgYWZmZWN0ZWRPcHRpb25zKTtcblx0fSkuZmlsdGVyKChkaXNwb3NlKSA9PiB0eXBlb2YgZGlzcG9zZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRyZXR1cm4gKCkgPT4gZGlzcG9zZXJzLmZvckVhY2goKGRpc3Bvc2UpID0+IGRpc3Bvc2U/LigpKTtcbn1cbmZ1bmN0aW9uIGVmZmVjdGVkKHRhcmdldHMsIGNiLCBvcHRpb25zKSB7XG5cdHJldHVybiBlZmZlY3QoY2IsIHRhcmdldHMsIG9wdGlvbnMpO1xufVxudmFyIG1ha2VBcnJheU9ic2VydmFibGUgPSAodGcpID0+IHtcblx0aWYgKHRnIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gb2JzZXJ2YWJsZUJ5U2V0KHRnKTtcblx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gb2JzZXJ2YWJsZUJ5TWFwKHRnKTtcblx0cmV0dXJuIHRnO1xufTtcbnZhciBEb3VibGVXZWFrTWFwID0gY2xhc3Mge1xuXHQjdG9wID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdCNlbnN1cmVJbm5lcihrZXkxKSB7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbnVsbDtcblx0XHRsZXQgaW5uZXIgPSB0aGlzLiN0b3AuZ2V0KGtleTEpO1xuXHRcdGlmICghaW5uZXIpIHtcblx0XHRcdGlubmVyID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdFx0XHR0aGlzLiN0b3Auc2V0KGtleTEsIGlubmVyKTtcblx0XHR9XG5cdFx0cmV0dXJuIGlubmVyO1xuXHR9XG5cdCNzcGxpdFBhaXIocGFpcikge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShwYWlyKSB8fCBwYWlyLmxlbmd0aCAhPT0gMikgcmV0dXJuIFtudWxsLCBudWxsXTtcblx0XHRyZXR1cm4gcGFpcjtcblx0fVxuXHRoYXNMMShrZXkxKSB7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5oYXMoa2V5MSk7XG5cdH1cblx0c2V0KHBhaXIsIHZhbHVlKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRoaXM7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRnZXQocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2b2lkIDA7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5nZXQoa2V5MSk/LmdldChrZXkyKTtcblx0fVxuXHRoYXMocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmdldChrZXkxKT8uaGFzKGtleTIpID8/IGZhbHNlO1xuXHR9XG5cdGRlbGV0ZShwYWlyKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jdG9wLmdldChrZXkxKTtcblx0XHRyZXR1cm4gaW5uZXIgPyBpbm5lci5kZWxldGUoa2V5MikgOiBmYWxzZTtcblx0fVxuXHRkZWxldGVUb3Aoa2V5MSkge1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZGVsZXRlKGtleTEpO1xuXHR9XG5cdGdldE9yQ3JlYXRlKHBhaXIsIGZhY3RvcnkpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFjdG9yeT8uKCk7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRjb25zdCB2YWx1ZSA9IGZhY3RvcnkoKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRnZXRPckluc2VydChwYWlyLCB2YWx1ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cdGdldE9ySW5zZXJ0Q29tcHV0ZWQocGFpciwgY29tcHV0ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb21wdXRlPy4oW2tleTEsIGtleTJdKTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGNvbnN0IHZhbHVlID0gY29tcHV0ZShba2V5MSwga2V5Ml0pO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59O1xudmFyIHJlZ2lzdGVyZWRJdGVyYXRlZCA9IG5ldyBEb3VibGVXZWFrTWFwKCk7XG5mdW5jdGlvbiBpdGVyYXRlZCh0ZywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdGlmICghdGcpIHJldHVybjtcblx0aWYgKHR5cGVvZiB0ZyAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGcgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAocmVnaXN0ZXJlZEl0ZXJhdGVkLmhhcyhbdGcsIGNiXSkpIHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0KFt0ZywgY2JdKTtcblx0Y29uc3QgJHN1YiA9ICh2YWx1ZSwgbmFtZSwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZVwiKSB7XG5cdFx0XHRjb25zdCBlbnRyaWVzID0gKG9sZD8udmFsdWUgPz8gb2xkKT8uZW50cmllcz8uKCk7XG5cdFx0XHRjb25zdCBiYXNpcyA9IHRnPy52YWx1ZSA/PyB2YWx1ZT8udmFsdWUgPz8gdmFsdWU7XG5cdFx0XHRpZiAoZW50cmllcykgZm9yIChjb25zdCBbaWR4LCBpdGVtXSBvZiBlbnRyaWVzKSB7XG5cdFx0XHRcdGNvbnN0IG9mT2xkID0gaXRlbSA/PyAob2xkPy52YWx1ZSA/PyBvbGQpPy5baWR4XSA/PyBudWxsO1xuXHRcdFx0XHRjb25zdCBvZk5ldyA9IGJhc2lzPy5baWR4XTtcblx0XHRcdFx0aWYgKG9mT2xkID09IG51bGwgJiYgb2ZOZXcgIT0gbnVsbCkgY2Iob2ZOZXcsIGlkeCwgbnVsbCwgXCJhZGRcIik7XG5cdFx0XHRcdGVsc2UgaWYgKG9mT2xkICE9IG51bGwgJiYgb2ZOZXcgPT0gbnVsbCkgY2IobnVsbCwgaWR4LCBvZk9sZCwgXCJkZWxldGVcIik7XG5cdFx0XHRcdGVsc2UgaWYgKGlzTm90RXF1YWwob2ZPbGQsIG9mTmV3KSkgY2Iob2ZOZXcsIGlkeCwgb2ZPbGQsIFwic2V0XCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGl0ZXJhdGVkKHZhbHVlID8/IHRnPy52YWx1ZSwgY2IsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmFtZSA9PSBudWxsID8gdm9pZCAwIDogdGdbbmFtZV07XG5cdH07XG5cdHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0T3JJbnNlcnRDb21wdXRlZChbdGcsIGNiXSwgKCkgPT4ge1xuXHRcdGlmICh0ZyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIGFmZmVjdGVkKFtvYnNlcnZhYmxlQnlTZXQodGcpLCBTeW1ib2wuaXRlcmF0b3JdLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gYWZmZWN0ZWQodGcsIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaGFzVmFsdWUodGcpKSByZXR1cm4gYWZmZWN0ZWQodGcsICRzdWIsIG9wdGlvbnMpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHRnKSAmJiAhKHRnPy5sZW5ndGggPT0gMiAmJiBpc0tleVR5cGUodGc/LlsxXSkgJiYgaXNPYnNlcnZhYmxlKHRnPy5bMF0pKSkgcmV0dXJuIGFmZmVjdGVkKFt0ZywgU3ltYm9sLml0ZXJhdG9yXSwgY2IsIG9wdGlvbnMpO1xuXHRcdHJldHVybiBhZmZlY3RlZCh0ZywgY2IsIG9wdGlvbnMpO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIHVuYWZmZWN0ZWQodGcsIGNiKSB7XG5cdHJldHVybiB3aXRoUHJvbWlzZSh0ZywgKHRhcmdldCkgPT4ge1xuXHRcdGNvbnN0IGlzUGFpciA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KSAmJiB0YXJnZXQ/Lmxlbmd0aCA9PSAyICYmIFtcIm9iamVjdFwiLCBcImZ1bmN0aW9uXCJdLmluZGV4T2YodHlwZW9mIHRhcmdldD8uWzBdKSA+PSAwICYmIGlzS2V5VHlwZSh0YXJnZXQ/LlsxXSk7XG5cdFx0Y29uc3QgcHJvcCA9IGlzUGFpciA/IHRhcmdldD8uWzFdIDogbnVsbDtcblx0XHR0YXJnZXQgPSBpc1BhaXIgJiYgcHJvcCAhPSBudWxsID8gdGFyZ2V0Py5bMF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdGNvbnN0IHVud3JhcCA9IHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdCh0YXJnZXQ/LlskcmVnaXN0cnlLZXkkXSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKSk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH0pO1xufVxudmFyIGJpbmRCeSA9ICh0YXJnZXQsIHJlYWN0aXZlLCB3YXRjaCkgPT4ge1xuXHRhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHYsIHApID0+IHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2LCBwLCB0cnVlKTtcblx0fSk7XG5cdHdhdGNoPy4oKCkgPT4gdGFyZ2V0LCAoTikgPT4ge1xuXHRcdGZvciAoY29uc3QgayBpbiBOKSBvYmplY3RBc3NpZ24ocmVhY3RpdmUsIE5ba10sIGssIHRydWUpO1xuXHR9LCB7IGRlZXA6IHRydWUgfSk7XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGRlcml2YXRlID0gKGZyb20sIHJlYWN0Rm4sIHdhdGNoKSA9PiBiaW5kQnkocmVhY3RGbihzYWZlKGZyb20pKSwgZnJvbSwgd2F0Y2gpO1xudmFyIGJpbmRCeUtleSA9ICh0YXJnZXQsIHJlYWN0aXZlLCBrZXkgPSAoKSA9PiBcIlwiKSA9PiBhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHZhbHVlLCBwKSA9PiB7XG5cdGlmIChwID09IGtleSgpKSBvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbnVsbCwgdHJ1ZSk7XG59KTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvQXNzaWduZWQudHNcbnZhciBjb25kaXRpb25hbEluZGV4ID0gKGNvbmRMaXN0ID0gW10pID0+IHtcblx0Y29uc3Qgc291cmNlID0gb2JzZXJ2ZSh7IHZhbHVlOiAwIH0pO1xuXHRjb25zdCByZWFkQ29uZGl0aW9uID0gKGNvbmRpdGlvbikgPT4ge1xuXHRcdGlmICh0eXBlb2YgY29uZGl0aW9uID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbmRpdGlvbigpO1xuXHRcdHJldHVybiBoYXNWYWx1ZShjb25kaXRpb24pID8gY29uZGl0aW9uLnZhbHVlIDogY29uZGl0aW9uO1xuXHR9O1xuXHRjb25zdCBldmFsdWF0ZSA9ICgpID0+IGNvbmRMaXN0LmZpbmRJbmRleCgoY29uZGl0aW9uKSA9PiAhIXJlYWRDb25kaXRpb24oY29uZGl0aW9uKSk7XG5cdGNvbnN0IHJlc3VsdCA9IGNvbXB1dGVkKFtzb3VyY2UsIFwidmFsdWVcIl0sIGV2YWx1YXRlLCBcInZhbHVlXCIpO1xuXHRjb25zdCBpbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdHNvdXJjZS52YWx1ZSsrO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlcnMgPSBbXTtcblx0aWYgKGlzT2JzZXJ2YWJsZShjb25kTGlzdCkpIGRpc3Bvc2Vycy5wdXNoKGFmZmVjdGVkKGNvbmRMaXN0LCBpbnZhbGlkYXRlLCB7XG5cdFx0YWZmZWN0VHlwZXM6IFtcblx0XHRcdFwiYWRkXCIsXG5cdFx0XHRcInNldFwiLFxuXHRcdFx0XCJkZWxldGVcIlxuXHRcdF0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIGNvbmRMaXN0KSBpZiAoaGFzVmFsdWUoY29uZGl0aW9uKSkgZGlzcG9zZXJzLnB1c2goYWZmZWN0ZWQoW2NvbmRpdGlvbiwgXCJ2YWx1ZVwiXSwgaW52YWxpZGF0ZSwge1xuXHRcdGFmZmVjdFR5cGVzOiBbXCJzZXR0ZXJcIl0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGFkZFRvQ2FsbENoYWluKHJlc3VsdCwgU3ltYm9sLmRpc3Bvc2UsICgpID0+IGRpc3Bvc2Vycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlPy4oKSkpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbnZhciBjb25kaXRpb25hbFJlZiA9IChjb25kLCBpZlRydWUsIGlmRmFsc2UsIGJlaGF2aW9yKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShjb25kKSkgcmV0dXJuIGNvbmQgPyBpZlRydWUgOiBpZkZhbHNlO1xuXHRjb25zdCBnZXRUcnVlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZlRydWU7XG5cdH07XG5cdGNvbnN0IGdldEZhbHNlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZkZhbHNlO1xuXHR9O1xuXHRjb25zdCB2YWx1ZU9mID0gKG4pID0+IHtcblx0XHRpZiAobiAhPSBudWxsKSBjb25kLnZhbHVlID0gaGFzVmFsdWUobikgPyBuPy52YWx1ZSA6IG47XG5cdFx0cmV0dXJuIChoYXNWYWx1ZShjb25kKSA/IGNvbmQ/LnZhbHVlIDogY29uZCkgPyBnZXRUcnVlKCkgOiBnZXRGYWxzZSgpO1xuXHR9O1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IHZhbHVlT2YoKSxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV0sIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9IHZhbHVlT2Yodik7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gdmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXTtcblx0XHR9XG5cdH0pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChbY29uZCwgXCJ2YWx1ZVwiXSwgKCkgPT4ge1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gcj8uWyR2YWx1ZV07XG5cdFx0Y29uc3QgdmFsdWUgPSB2YWx1ZU9mKCk7XG5cdFx0clskdmFsdWVdID0gdmFsdWU7XG5cdFx0cj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRvbGRWYWx1ZSxcblx0XHRcdHRyaWdnZXI6IFwibWFudWFsXCJcblx0XHR9KTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHIsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcjtcbn07XG52YXIgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbFJlZjtcbnZhciByZW1hcCA9IChzdWIsIGNiLCBkZXN0KSA9PiB7XG5cdGlmICghZGVzdCkgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzdWIsICh2YWx1ZSwgcHJvcCwgb2xkKSA9PiB7XG5cdFx0aWYgKHByb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGNvbnN0IGdvdCA9IGNiPy4odmFsdWUsIHByb3AsIG9sZCk7XG5cdFx0aWYgKHR5cGVvZiBnb3QgPT0gXCJvYmplY3RcIikgb2JqZWN0QXNzaWduTm90RXF1YWwoZGVzdCwgZ290KTtcblx0XHRlbHNlIGlmIChpc05vdEVxdWFsKGRlc3RbcHJvcF0sIGdvdCkpIGRlc3RbcHJvcF0gPSBnb3Q7XG5cdH0pO1xuXHRpZiAoZGVzdCkgYWRkVG9DYWxsQ2hhaW4oZGVzdCwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiBkZXN0O1xufTtcbnZhciB1bmlmaWVkID0gKC4uLnN1YnMpID0+IHtcblx0Y29uc3QgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRzdWJzPy5mb3JFYWNoPy4oKHN1YikgPT4gYWZmZWN0ZWQoc3ViLCAodmFsdWUsIHByb3AsIF8pID0+IHtcblx0XHRpZiAocHJvcCA9PSBudWxsKSByZXR1cm47XG5cdFx0aWYgKGlzTm90RXF1YWwoZGVzdFtwcm9wXSwgdmFsdWUpKSBkZXN0W3Byb3BdID0gdmFsdWU7XG5cdH0pKTtcblx0cmV0dXJuIGRlc3Q7XG59O1xudmFyIG9ic2VydmFibGVCeVNldCA9IChzZXQpID0+IHtcblx0Y29uc3Qgb2JzID0gb2JzZXJ2ZShbXSk7XG5cdG9icy5wdXNoKC4uLkFycmF5LmZyb20oc2V0Py52YWx1ZXM/LigpIHx8IFtdKSk7XG5cdGFkZFRvQ2FsbENoYWluKG9icywgU3ltYm9sLmRpc3Bvc2UsIGFmZmVjdGVkKHNldCwgKHZhbHVlLCBfLCBvbGQpID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2YWx1ZSwgb2xkKSkge1xuXHRcdFx0aWYgKG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwpIG9icy5wdXNoKHZhbHVlKTtcblx0XHRcdGVsc2UgaWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gb2JzLmluZGV4T2Yob2xkKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwKSBvYnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBpZHggPSBvYnMuaW5kZXhPZihvbGQpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDAgJiYgaXNOb3RFcXVhbChvYnNbaWR4XSwgdmFsdWUpKSBvYnNbaWR4XSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkpO1xuXHRyZXR1cm4gb2JzO1xufTtcbnZhciBvYnNlcnZhYmxlQnlNYXAgPSAobWFwKSA9PiB7XG5cdGNvbnN0IG9icyA9IG9ic2VydmUoW10pO1xuXHRjb25zdCBpbml0aWFsRW50cmllcyA9IEFycmF5LmZyb20obWFwLmVudHJpZXMoKSk7XG5cdG9icy5wdXNoKC4uLmluaXRpYWxFbnRyaWVzKTtcblx0YWRkVG9DYWxsQ2hhaW4ob2JzLCBTeW1ib2wuZGlzcG9zZSwgYWZmZWN0ZWQobWFwLCAodmFsdWUsIHByb3AsIG9sZCkgPT4ge1xuXHRcdGlmIChpc05vdEVxdWFsKHZhbHVlLCBvbGQpIHx8IG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwgfHwgb2xkICE9IG51bGwgJiYgdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0aWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0bGV0IGlkeCA9IG9icy5maW5kSW5kZXgoKFtuYW1lLCBfXSkgPT4gbmFtZSA9PSBwcm9wKTtcblx0XHRcdFx0aWYgKGlkeCA8IDApIGlkeCA9IG9icy5maW5kTGFzdEluZGV4KChbXywgdmFsXSkgPT4gb2xkID09PSB2YWwpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDApIG9icy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBpZHggPSBvYnMuZmluZEluZGV4KChbbmFtZSwgX10pID0+IG5hbWUgPT0gcHJvcCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCAmJiBpZHggPCBvYnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2JzW2lkeF0/LlsxXSwgdmFsdWUpKSBvYnNbaWR4XSA9IFtwcm9wLCB2YWx1ZV07XG5cdFx0XHRcdH0gZWxzZSBvYnMucHVzaChbcHJvcCwgdmFsdWVdKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKTtcblx0cmV0dXJuIG9icztcbn07XG52YXIgYXNzaWduTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgYXNzaWduID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgaXNBQ29tcHV0ZSA9IHR5cGVvZiBhPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIGE/Lmxlbmd0aCA9PSAyLCBpc0JDb21wdXRlID0gdHlwZW9mIGI/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgYj8ubGVuZ3RoID09IDIsIGNtcEJGbmMgPSBpc0JDb21wdXRlID8gYj8uWzFdIDogbnVsbDtcblx0Y29uc3QgaXNBUHJvcCA9IChpc0tleVR5cGUoYT8uWzFdKSB8fCBhPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBhPy5sZW5ndGggPT0gMjtcblx0bGV0IGFfcHJvcCA9IGlzQVByb3AgJiYgIWlzQUNvbXB1dGUgPyBhPy5bMV0gOiBBcnJheS5pc0FycmF5KGEpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgYSA9IFthLCBhX3Byb3BdO1xuXHRpZiAoaXNBQ29tcHV0ZSkgYVsxXSA9IGFfcHJvcDtcblx0Y29uc3QgaXNCUHJvcCA9IChpc0tleVR5cGUoYj8uWzFdKSB8fCBiPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBiPy5sZW5ndGggPT0gMjtcblx0bGV0IGJfcHJvcCA9IGlzQlByb3AgJiYgIWlzQkNvbXB1dGUgPyBiPy5bMV0gOiBBcnJheS5pc0FycmF5KGIpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNCUHJvcCAmJiAhaXNCQ29tcHV0ZSkgYiA9IFtiLCBiX3Byb3BdO1xuXHRpZiAoaXNCQ29tcHV0ZSkgYlsxXSA9IGJfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGJfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgYT8uWzBdKSB8fCBpc0FycmF5SW52YWxpZEtleShiX3Byb3AsIGI/LlswXSkpIHJldHVybjtcblx0aWYgKCEoKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgYj8uWzBdICE9IG51bGwpICYmICFBcnJheS5pc0FycmF5KGFbMF0pKSB7XG5cdFx0JGF2b2lkVHJpZ2dlcihiLCAoKSA9PiB7XG5cdFx0XHRhWzBdW2FfcHJvcF0gPSBiPy5bMF07XG5cdFx0fSk7XG5cdFx0cmV0dXJuICgpID0+IHt9O1xuXHR9XG5cdGNvbnN0IGNvbXB1dGUgPSAodiwgcCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IGJfdG1wID0gYlJlZj8uZGVyZWY/LigpO1xuXHRcdGlmIChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uYm91bmQgPT0gYl90bXApIHtcblx0XHRcdGxldCB2YWwgPSBudWxsO1xuXHRcdFx0Y29uc3QgY21wZnggPSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uY21wZng7XG5cdFx0XHQkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgY21wZnggPT0gXCJmdW5jdGlvblwiKSB2YWwgPSBjbXBmeD8uKCRnZXRWYWx1ZShiX3RtcCkgPz8gdiwgcCwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgdmFsID0gYl90bXA/LltwXSA/PyB2O1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBudiA9ICRnZXRWYWx1ZSh2YWwpO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwoYV90bXBbYV9wcm9wXSwgbnYpKSAkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGFfdG1wW2FfcHJvcF0gPSBudjtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSAoKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApKT8uZ2V0Py4oYV9wcm9wKSk/LmRpc3Bvc2U/LigpO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlID0gKCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IG1hcCA9IGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApO1xuXHRcdGNvbnN0IHN0b3JlID0gbWFwPy5nZXQ/LihhX3Byb3ApO1xuXHRcdG1hcD8uZGVsZXRlPy4oYV9wcm9wKTtcblx0XHRzdG9yZT8udW5zdWI/LigpO1xuXHR9O1xuXHRjb25zdCBiUmVmID0gYj8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShiPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBiPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihiPy5bMF0pIDogYj8uWzBdLCBhUmVmID0gYT8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBhPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYT8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShhPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBhPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihhPy5bMF0pIDogYT8uWzBdO1xuXHRsZXQgc3RvcmUgPSB7XG5cdFx0Y29tcHV0ZSxcblx0XHRkaXNwb3NlLFxuXHRcdGNtcGZ4OiBjbXBCRm5jXG5cdH07XG5cdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpLCBiX3RtcCA9IGJSZWY/LmRlcmVmPy4oKTtcblx0aWYgKGFSZWYgaW5zdGFuY2VvZiBXZWFrUmVmKSB7XG5cdFx0aWYgKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5nZXQ/LihhX3Byb3ApPy5ib3VuZCAhPSBiX3RtcCkgYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmRlbGV0ZT8uKGFfcHJvcCk7XG5cdFx0c3RvcmUgPSAoYXNzaWduTWFwPy5nZXRPckluc2VydD8uKGFfdG1wLCAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKSk/LmdldE9ySW5zZXJ0Q29tcHV0ZWQ/LihhX3Byb3AsICgpID0+ICh7XG5cdFx0XHRib3VuZDogYl90bXAsXG5cdFx0XHRjbXBmeDogY21wQkZuYyxcblx0XHRcdHVuc3ViOiBudWxsLFxuXHRcdFx0Y29tcHV0ZSxcblx0XHRcdGRpc3Bvc2Vcblx0XHR9KSk7XG5cdFx0c3RvcmUudW5zdWIgPSBhZmZlY3RlZChiLCBjb21wdXRlKTtcblx0XHRzdG9yZS5jbXBmeCA9IGNtcEJGbmM7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYV90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYl90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdH1cblx0aWYgKGJfdG1wICYmICFBcnJheS5pc0FycmF5KGJfdG1wKSkgJGF2b2lkVHJpZ2dlcihhX3RtcCwgKCkgPT4ge1xuXHRcdGJfdG1wW2JfcHJvcF0gPz89IGFfdG1wPy5bYV9wcm9wXSA/PyBiX3RtcFtiX3Byb3BdO1xuXHR9KTtcblx0cmV0dXJuIHN0b3JlPy5kaXNwb3NlO1xufTtcbnZhciBsaW5rID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgdXN1YiA9IFthc3NpZ24oYSwgYiwgcHJvcCksIGFzc2lnbihiLCBhLCBwcm9wKV07XG5cdHJldHVybiAoKSA9PiB1c3ViPy5tYXA/LigoYykgPT4gYz8uKCkpO1xufTtcbnZhciBjb21wdXRlZCA9IChzcmMsIGNiLCBiZWhhdmlvciwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRjb25zdCBpc0FDb21wdXRlID0gdHlwZW9mIHNyYz8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRjb25zdCBpc0FQcm9wID0gKGlzS2V5VHlwZShzcmM/LlsxXSkgfHwgc3JjPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRsZXQgYV9wcm9wID0gaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSA/IHNyYz8uWzFdIDogQXJyYXkuaXNBcnJheShzcmMpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgc3JjID0gW2lzQVByb3AgPyBzcmM/LlswXSA6IHNyYywgYV9wcm9wXTtcblx0aWYgKGlzQUNvbXB1dGUpIHNyY1sxXSA9IGFfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgc3JjPy5bMF0pKSByZXR1cm47XG5cdGxldCBvbGRWYWx1ZSA9IHZvaWQgMDtcblx0bGV0IG9sZEFyZyA9IHZvaWQgMDtcblx0Y29uc3QgY21wID0gKGFyZywgZm9yY2UpID0+IHtcblx0XHRhcmcgPz89IHNyYz8uWzBdPy5bYV9wcm9wXSA/PyBvbGRBcmcgPz8gYXJnO1xuXHRcdGlmIChmb3JjZSB8fCBpc05vdEVxdWFsKG9sZEFyZywgYXJnKSAmJiBhcmcgIT0gdm9pZCAwIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0bGV0IG52ID0gY2I/LihhcmcsIGFfcHJvcCwgb2xkQXJnKTtcblx0XHRcdG9sZFZhbHVlID0gbnY7XG5cdFx0XHRyZXR1cm4gbnY7XG5cdFx0fVxuXHRcdHJldHVybiBvbGRWYWx1ZTtcblx0fTtcblx0Y29uc3Qgd3JwRnVuYyA9IChhcmcsIHByb3AgPSBcInZhbHVlXCIsIG9sZEFyZyQsIG9wKSA9PiB7XG5cdFx0b2xkQXJnID0gb2xkQXJnJCA/PyBvbGRBcmc7XG5cdFx0YXJnID8/PSBzcmM/LlswXT8uW2FfcHJvcF07XG5cdFx0aWYgKGlzTm90RXF1YWwob2xkQXJnLCBhcmcpICYmIGFyZyAhPSB2b2lkIDAgfHwgb2xkVmFsdWUgPT0gdm9pZCAwKSB7XG5cdFx0XHRsZXQgbnYgPSBjYj8uKGFyZywgYV9wcm9wLCBvbGRBcmcsIG9wKTtcblx0XHRcdG9sZEFyZyA9IGFyZztcblx0XHRcdGlmIChpc05vdEVxdWFsKG52LCBvbGRWYWx1ZSkgfHwgb2xkVmFsdWUgPT0gdm9pZCAwKSB7XG5cdFx0XHRcdHJmW3Byb3BdID0gb2xkVmFsdWUgPSBudjtcblx0XHRcdFx0b2xkVmFsdWUgPSByZltwcm9wXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBudjtcblx0XHR9XG5cdFx0cmV0dXJuIHJmW3Byb3BdO1xuXHR9O1xuXHRjb25zdCBpbml0aWFsID0gY21wKHNyY1swXVthX3Byb3BdID8/IG9sZEFyZyk7XG5cdGNvbnN0IHBlbmRpbmdJbml0aWFsID0gaXNQcm9taXNlKGluaXRpYWwpO1xuXHRjb25zdCAkYXBwbHkgPSBTeW1ib2wuZm9yKFwiQEBhcHBseVwiKTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRwcm9taXNlLCB7XG5cdFx0dmFsdWU6IGluaXRpYWwsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkdmFsdWUsIHtcblx0XHR2YWx1ZTogaW5pdGlhbCxcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRiZWhhdmlvciwge1xuXHRcdHZhbHVlOiBiZWhhdmlvcixcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsIFN5bWJvbD8udG9TdHJpbmdUYWcsIHtcblx0XHR2YWx1ZTogU3RyaW5nKHdycEZ1bmNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiLFxuXHRcdHdyaXRhYmxlOiBmYWxzZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsIFN5bWJvbD8udG9QcmltaXRpdmUsIHtcblx0XHR2YWx1ZTogdHJ5UGFyc2VCeUhpbnQod3JwRnVuY1skdmFsdWVdLCBcIm51bWJlclwiKSxcblx0XHR3cml0YWJsZTogZmFsc2Vcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBcInZhbHVlXCIsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBjcCA9IGNtcCgpO1xuXHRcdFx0aWYgKGNwICE9IG51bGwpIHdycEZ1bmNbJHZhbHVlXSA9IGNwO1xuXHRcdFx0cmV0dXJuIHdycEZ1bmNbJHZhbHVlXTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYXJnKSB7XG5cdFx0XHR3cnBGdW5jWyR2YWx1ZV0gPSBjbXAoYXJnLCB0cnVlKTtcblx0XHR9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgJGFwcGx5LCB7XG5cdFx0dmFsdWU6ICh2KSA9PiB7XG5cdFx0XHRpZiAodiA9PSB2b2lkIDApIHJldHVybiByZj8udmFsdWU7XG5cdFx0XHRyZi52YWx1ZSA9IHY7XG5cdFx0XHRyZXR1cm4gcmY/LnZhbHVlO1xuXHRcdH0sXG5cdFx0d3JpdGFibGU6IGZhbHNlXG5cdH0pO1xuXHRjb25zdCByZiA9IG9ic2VydmUod3JwRnVuYyk7XG5cdGNvbnN0IHdyaXRlQ29tcHV0ZWQgPSAodmFsdWUsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbigodikgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSByZj8uWyR2YWx1ZV07XG5cdFx0XHRyZlskdmFsdWVdID0gdjtcblx0XHRcdHJmPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdFx0dmFsdWU6IHYsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHY7XG5cdFx0fSk7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSByZj8uWyR2YWx1ZV07XG5cdFx0cmZbJHZhbHVlXSA9IHZhbHVlO1xuXHRcdHJmPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlclxuXHRcdH0pO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblx0aWYgKHBlbmRpbmdJbml0aWFsKSB3cml0ZUNvbXB1dGVkKGluaXRpYWwsIFwicmVzb2x2ZWRcIik7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKFtzcmM/LlswXSA/PyBzcmMsIGFfcHJvcCA/PyBcInZhbHVlXCJdLCAoKSA9PiB7XG5cdFx0d3JpdGVDb21wdXRlZChjbXAoKSwgXCJtYW51YWxcIik7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyZiwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiByZjtcbn07XG52YXIgZGVsYXllZFN1YnNjcmliZSA9IChyZWYsIGNiLCBkZWxheSA9IDEwMCkgPT4ge1xuXHRsZXQgdG07XG5cdHJldHVybiBhZmZlY3RlZChyZWYsIFwidmFsdWVcIiwgKHYpID0+IHtcblx0XHRpZiAoIXYgJiYgdG0pIHtcblx0XHRcdGNsZWFyVGltZW91dCh0bSk7XG5cdFx0XHR0bSA9IG51bGw7XG5cdFx0fSBlbHNlIGlmICh2ICYmICF0bSkgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHJlZiwgY2IsIGRlbGF5KSA/PyB0bTtcblx0fSk7XG59O1xuXG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7ICRhZmZlY3RlZCwgJHJlZiwgJHJlc29sdmVkLCAkdHJpZ2dlciwgJHRyaWdnZXJDb250cm9sLCAkdHJpZ2dlckxlc3MsICR0cmlnZ2VyTG9jaywgQXNzaWduT2JqZWN0SGFuZGxlciwgRG91YmxlV2Vha01hcCwgYWRkVG9DYWxsQ2hhaW4sIGFmZmVjdGVkLCBhc3NpZ24sIGFzc2lnbk1hcCwgYmluZEJ5LCBiaW5kQnlLZXksIGJvb2xlYW5SZWYsIGNvbXB1dGVkLCBjb25kaXRpb25hbCwgY29uZGl0aW9uYWxJbmRleCwgY29uZGl0aW9uYWxSZWYsIGRlbGF5ZWRCZWhhdmlvciwgZGVsYXllZE9ySW5zdGFudEJlaGF2aW9yLCBkZWxheWVkU3Vic2NyaWJlLCBkZXJlZiwgZGVyaXZhdGUsIGVmZmVjdCwgZWZmZWN0ZWQsIGlzT2JzZXJ2YWJsZSwgaXRlcmF0ZWQsIGxpbmssIG1ha2VBcnJheU9ic2VydmFibGUsIG1ha2VPYmplY3RBc3NpZ25hYmxlLCBtYWtlUmVzb2x2ZWRPcCwgbnVtYmVyUmVmLCBvYnNlcnZhYmxlQnlNYXAsIG9ic2VydmFibGVCeVNldCwgb2JzZXJ2ZSwgcHJvbWlzZWQsIHByb3BSZWYsIHJlY292ZXJSZWFjdGl2ZSwgcmVmLCByZW1hcCwgcmVzb2x2ZWQsIHNhZmUsIHNwZWNpYWxpemVkU3Vic2NyaWJlLCBzdHJpbmdSZWYsIHN1YnNjcmliZURpcmVjdGx5LCBzdWJzY3JpYmVJbnB1dCwgc3Vic2NyaWJlUGFpcmVkLCBzdWJzY3JpYmVUaGVuYWJsZSwgdHJpZ2dlcldpdGhEZWxheSwgdW5hZmZlY3RlZCwgdW5pZmllZCwgdW53cmFwLCB1c2VPYnNlcnZhYmxlLCB3cmFwUmVmLCB3cmFwU2V0QXNBcnJheSB9OyJdLAogICJtYXBwaW5ncyI6ICJBQUFBLFNBQVMsaUJBQUFBLElBQWUsYUFBQUMsSUFBVyxnQkFBZ0JDLElBQWdCLFlBQUFDLElBQVUsV0FBQUMsR0FBUyxpQkFBQUMsSUFBZSxjQUFBQyxJQUFZLGlCQUFBQyxJQUFlLFlBQUFDLEdBQVUscUJBQUFDLElBQW1CLGFBQUFDLEdBQVcsY0FBQUMsR0FBWSxlQUFBQyxHQUFhLGFBQUFDLEdBQVcsbUJBQUFDLElBQWlCLGdCQUFBQyxJQUFjLHdCQUFBQyxJQUFzQixvQkFBQUMsSUFBa0IsdUJBQUFDLElBQXFCLFlBQVlDLElBQVksa0JBQUFDLFNBQXNCO0FBR3RWLE9BQU8sZUFBZSx1QkFBTyxJQUFJLFlBQVk7QUFDN0MsT0FBTyxjQUFjLHVCQUFPLElBQUksV0FBVztBQUMzQyxPQUFPLGdCQUFnQix1QkFBTyxJQUFJLGFBQWE7QUFDL0MsSUFBSUMsSUFBUyx1QkFBTyxJQUFJLFFBQVEsR0FDNUJDLElBQWUsdUJBQU8sSUFBSSxVQUFVLEdBQ3BDQyxJQUFnQix1QkFBTyxJ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SUFBS2paLENBQU07QUFDNUIsV0FBQWlaLEVBQUdqWixDQUFNLElBQUlpRCxHQUNiZ1csSUFBS3ZZLENBQVEsSUFBSTtBQUFBLE1BQ2hCLEtBQUs7QUFBQSxNQUNMLE9BQUF1QztBQUFBLE1BQ0EsVUFBQTZGO0FBQUEsTUFDQSxTQUFBNUI7QUFBQSxJQUNELENBQUMsR0FDTWpFO0FBQUEsRUFDUjtBQUNBLEVBQUlpVyxLQUFnQkcsRUFBY2xKLEdBQVMsVUFBVTtBQUNyRCxRQUFNbUIsSUFBTXpFLEVBQVMsQ0FBQytELElBQU0sQ0FBQyxLQUFLQSxHQUFLa0gsS0FBVSxPQUFPLEdBQUcsTUFBTTtBQUNoRSxJQUFBdUIsRUFBY1YsRUFBSSxHQUFHLFFBQVE7QUFBQSxFQUM5QixDQUFDO0FBQ0QsU0FBQXpXLEVBQWUrVyxHQUFJLE9BQU8sU0FBUzNILENBQUcsR0FDL0IySDtBQUNSLEdBQ0lLLEtBQW1CLENBQUMzSCxHQUFLN1AsR0FBSWlRLElBQVEsUUFBUTtBQUNoRCxNQUFJRztBQUNKLFNBQU9yRixFQUFTOEUsR0FBSyxTQUFTLENBQUM3SCxNQUFNO0FBQ3BDLElBQUksQ0FBQ0EsS0FBS29JLEtBQ1QsYUFBYUEsQ0FBRSxHQUNmQSxJQUFLLFFBQ0twSSxLQUFLLENBQUNvSSxNQUFJQSxJQUFLSixHQUFpQkgsR0FBSzdQLEdBQUlpUSxDQUFLLEtBQUtHO0FBQUEsRUFDL0QsQ0FBQztBQUNGOyIsCiAgIm5hbWVzIjogWyIkYXZvaWRUcmlnZ2VyIiwgIiRnZXRWYWx1ZSIsICIkdHJpZ2dlckxvY2skMSIsICJQcm9taXNlZCIsICJiaW5kQ3R4IiwgImNhbGxCeUFsbFByb3AiLCAiY2FsbEJ5UHJvcCIsICJkZWZhdWx0QnlUeXBlIiwgImhhc1ZhbHVlIiwgImlzQXJyYXlJbnZhbGlkS2V5IiwgImlzS2V5VHlwZSIsICJpc05vdEVxdWFsIiwgImlzUHJpbWl0aXZlIiwgImlzUHJvbWlzZSIsICJtYWtlVHJpZ2dlckxlc3MiLCAib2JqZWN0QXNzaWduIiwgIm9iamVjdEFzc2lnbk5vdEVxdWFsIiwgInBvdGVudGlhbGx5QXN5bmMiLCAicG90ZW50aWFsbHlBc3luY01hcCIsICJyZXNvbHZlZCQxIiwgInRyeVBhcnNlQnlIaW50IiwgIiR2YWx1ZSIsICIkZXh0cmFjdEtleSQiLCAiJG9yaWdpbmFsS2V5JCIsICIkcmVnaXN0cnlLZXkkIiwgIiRiZWhhdmlvciIsICIkcHJvbWlzZSIsICIkcmVzb2x2ZWQiLCAiJHRyaWdnZXJMZXNzIiwgIiR0cmlnZ2VyTG9jayIsICIkdHJpZ2dlckNvbnRyb2wiLCAiJHRyaWdnZXIiLCAiJGFmZmVjdGVkIiwgIiRpc05vdEVxdWFsIiwgIiRyZWFsUHJvcCIsICIkb3JpZ2luYWxPYmplY3RzJCIsICJzYWZlIiwgInRhcmdldCIsICJ1bndyYXAiLCAibWFwcGVkIiwgImUiLCAiSyIsICJWIiwgImFyciIsICJkZXJlZiIsICJkaXNjb3VudFZhbHVlIiwgIm9yaWdpbmFsIiwgIiR2YWwiLCAiaXNUaGVuYWJsZSIsICJ2YWwiLCAid2l0aFByb21pc2UiLCAiY2IiLCAiZGlzcG9zZU1hcCIsICJkaXNwb3NlUmVnaXN0cnkiLCAiY2FsbHN0YWNrIiwgImFkZFRvQ2FsbENoYWluIiwgIm9iaiIsICJtZXRob2RLZXkiLCAiY2FsbGJhY2siLCAiY2hhaW5UYXJnZXQiLCAiQ2FsbENoYWluIiwgImFyZ3MiLCAiaXNBcnJheUluZGV4IiwgInByb3AiLCAibnVtIiwgIndyYXBTZXRBc0FycmF5IiwgInNvdXJjZSIsICJvcHRpb25zIiwgImJhY2tpbmdTZXQiLCAibm90aWZ5RHVwbGljYXRlIiwgInZhbHVlIiwgInZpYSIsICJpbmRleCIsICJpdGVtIiwgInNuYXBzaG90IiwgInJlYnVpbGRGcm9tIiwgIm1ldGhvZHMiLCAiaXRlbXMiLCAic2l6ZSIsICJpdGVyYXRvciIsICJjdXJyZW50IiwgInRvUHJlcGVuZCIsICJuZXh0IiwgInN0YXJ0IiwgImRlbGV0ZUNvdW50IiwgIm5vcm1hbGl6ZWRTdGFydCIsICJhY3R1YWxEZWxldGVDb3VudCIsICJyZW1vdmVkIiwgImluc2VydFBvc2l0aW9uIiwgIl8iLCAibmV4dExlbmd0aCIsICJuZXh0VmFsdWUiLCAiY3VycmVudFZhbHVlIiwgImlkeCIsICJrZXlzIiwgImkiLCAiQXNzaWduT2JqZWN0SGFuZGxlciIsICJuYW1lIiwgIm5ld1QiLCAiY3R4IiwgIm1ha2VPYmplY3RBc3NpZ25hYmxlIiwgInB4IiwgIndpdGhVbnN1YlN5bWJvbCIsICJ3aXRoVW5zdWIiLCAiY29tcGxldGVXaXRoVW5zdWIiLCAic3Vic2NyaWJlciIsICJ3ZWFrIiwgImhhbmRsZXIiLCAicmVnaXN0cnkiLCAic2F2Q29tcGxldGUiLCAidW5hZmZlY3RlZCIsICJyIiwgInN1YnNjcmlwdFJlZ2lzdHJ5U3ltYm9sIiwgInN1YnNjcmlwdFJlZ2lzdHJ5IiwgImdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCIsICJnbG9iYWxFZmZlY3RMaXN0ZW5lcnMiLCAiZWZmZWN0R2xvYmFsbHkiLCAibm9ybWFsaXplZCIsICJub3JtYWxpemVFZmZlY3RPcHRpb25zIiwgIndyYXBwZWRTeW1ib2wiLCAid3JhcHBlZCIsICJyZWdpc3RlciIsICJ3aGF0IiwgImhhbmRsZSIsICJTdWJzY3JpcHQiLCAid3JhcFdpdGgiLCAiZm9yQWxsIiwgIndpbGRjYXJkVHJpZ2dlcnMiLCAidHJpZ2dlckFsaWFzZXMiLCAidHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sIiwgImNhbm9uaWNhbCIsICJhbGlhc2VzIiwgImFsaWFzIiwgInRyaWdnZXJDYW5vbmljYWxOYW1lcyIsICJub3JtYWxpemVUcmlnZ2VyTmFtZSIsICJ0cmlnZ2VyIiwgInRyaWdnZXJOYW1lc09mIiwgImV4cGFuZFRyaWdnZXJGaWx0ZXIiLCAidHlwZXMiLCAibm9ybWFsaXplVHJpZ2dlckZpbHRlciIsICJ0cmlnZ2VycyIsICJsaXN0IiwgInRyaWdnZXJGaWx0ZXJBbGxvd3MiLCAiZmlsdGVyIiwgImlzT3B0aW9uc09iamVjdCIsICJub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMiLCAiYWZmZWN0VHlwZXMiLCAiU3Vic2NyaXB0U3ltYm9sIiwgIiNzb3VyY2UiLCAiI2xpc3RlbmVycyIsICIjZmxhZ3MiLCAiI25hdGl2ZSIsICIjaXRlcmF0b3IiLCAiI2luRGlzcGF0Y2giLCAiI2Rpc2FibGVkVHJpZ2dlcnMiLCAiI3RyaWdnZXJDb250cm9sIiwgIiNwZW5kaW5nIiwgIiNwZW5kaW5nQnlQcm9wIiwgIiNmbHVzaFNjaGVkdWxlZCIsICJlbmFibGVkIiwgIiNkaXNwYXRjaCIsICJjb250cm9sbGVyIiwgInJlcyIsICJvbGRWYWx1ZSIsICJldGMiLCAibGlzdGVuZXJzIiwgInJlY29yZCIsICJldmVudCIsICJudyIsICJuYW1lcyIsICJwcmV2aW91cyIsICJyZXN0b3JlIiwgIndhc0Rpc2FibGVkIiwgInJlc3VsdCIsICJvcEtleSIsICJieU9wIiwgImJhdGNoIiwgIm9wTWFwIiwgIm5tIiwgInYiLCAib3YiLCAidGciLCAicmVzdCIsICJyYXdPZiIsICJ1bndyYXBwZWQiLCAicmVzb2x2ZWQiLCAibW9kZSIsICJyYXciLCAibWFrZVJlc29sdmVkT3AiLCAiZW1pdCIsICJydW4iLCAicGVuZGluZyIsICJrZXkiLCAiY2FsbGJhY2tPclZhbHVlIiwgImVtaXRSZXNvbHZlZCIsICJiaW5kRXhpc3RpbmdUaGVuYWJsZXMiLCAibGl2ZSIsICJfX3NhZmVHZXRHdWFyZFN5bWJvbCIsICJfX3N5c3RlbVNraXAiLCAic3lzdGVtU2tpcEdldCIsICJnb3QiLCAic2FmZUdldCIsICJfX3NhZmVHZXRHdWFyZCIsICJpc0dldHRlciIsICJwcm9wTmFtZSIsICJmYWxsVGhyb3VnaCIsICJ0bXAiLCAic2FmZVNldCIsICJhY3RpdmUiLCAicmVjIiwgImhhc093biIsICJpc1RyaWdnZXJFbWl0T3B0aW9ucyIsICJhbGxvd1ZhbHVlT25seSIsICJ0cmlnZ2VyT3B0aW9uVmFsdWUiLCAiZmFsbGJhY2siLCAidHJpZ2dlck9wdGlvblRyaWdnZXIiLCAiaXNSdW50aW1lS2V5IiwgInJlYWxQcm9wT2YkMSIsICJ0cmlnZ2VyS2V5T2YiLCAidHJpZ2dlclZhbHVlT2YiLCAicmVhbFByb3AiLCAiY3JlYXRlVHJpZ2dlckFQSSIsICJhcGkiLCAib3BPck9wdGlvbnMiLCAiY29udHJvbCIsICJzeXN0ZW1HZXQiLCAiYWZmZWN0ZWQiLCAib2JzZXJ2YWJsZUFQSU1ldGhvZHMiLCAidXN1YiIsICJjb21wIiwgIk9ic2VydmVBcnJheU1ldGhvZCIsICIjbmFtZSIsICIjc2VsZiIsICIjaGFuZGxlIiwgInNlbGYiLCAic2tpcCIsICJhZGRlZCIsICJzZXRQYWlycyIsICJvbGRTdGF0ZSIsICJvYnNlcnZlQXJyYXkiLCAibmV3VmFsdWUiLCAicmVnIiwgIkkiLCAicGFpciIsICJ0cmlnZ2VyV2hlbkxlbmd0aENoYW5nZSIsICJvbGRMZW4iLCAibmV3TGVuIiwgInJlbW92ZWRJdGVtcyIsICJhZGRlZENvdW50IiwgIk9ic2VydmVBcnJheUhhbmRsZXIiLCAic3lzIiwgIm9icyIsICJvbGQiLCAieHl6dyIsICJyZ2JhIiwgInh5endfaWR4IiwgInJnYmFfaWR4IiwgIk9ic2VydmVPYmplY3RIYW5kbGVyIiwgImhpbnQiLCAiZnQiLCAiJG9yaWdpbmFsIiwgInRyaWdnZXJOYW1lIiwgInN1YnNjcmlwdCIsICJkZXNjcmlwdG9yIiwgIiRyZXN1bHQiLCAiT2JzZXJ2ZU1hcEhhbmRsZXIiLCAidmFsdWVPckZ4IiwgIm9sZFZhbHVlcyIsICJoYWQiLCAiY29tcHV0ZWQiLCAiZGVmYXVsdE9yQ29tcHV0ZSIsICJpbmNvbWluZyIsICJPYnNlcnZlU2V0SGFuZGxlciIsICIkaXNPYnNlcnZhYmxlIiwgIm9ic2VydmVPYmplY3QiLCAib2JzZXJ2ZU1hcCIsICJtYXAiLCAib2JzZXJ2ZVNldCIsICJzZXQiLCAibnVtYmVyUmVmIiwgImluaXRpYWwiLCAiYmVoYXZpb3IiLCAiJHIiLCAib2JzZXJ2ZSIsICJzdHJpbmdSZWYiLCAiYm9vbGVhblJlZiIsICJ3cmFwUmVmIiwgIm1hcmtSZWFsUHJvcCIsICJwcm9wUmVmIiwgInNyYyIsICJzcmNQcm9wIiwgImlzTWFwIiwgImlzU2V0IiwgInJlYWRTbG90IiwgIndyaXRlU2xvdCIsICJtZW1iZXIiLCAiaXNPYnNlcnZhYmxlIiwgInJlY292ZXJSZWFjdGl2ZSIsICJzbG90IiwgInVzYiIsICJfcHJvcCIsICJwcmV2IiwgIiRyZWYiLCAidHlwZWQiLCAicmVmIiwgInByb21pc2VkIiwgInByb21pc2UiLCAidHJpZ2dlcldpdGhEZWxheSIsICJkZWxheSIsICJkZWxheWVkQmVoYXZpb3IiLCAic2lnIiwgInRtIiwgImRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciIsICJzdGF0ZU5hbWUiLCAicmVhY3RpdmUiLCAidXNlT2JzZXJ2YWJsZSIsICJvYnNlcnZhYmxlIiwgInNwZWNpYWxpemVkU3Vic2NyaWJlIiwgImNoZWNrVmFsaWRPYmoiLCAiaW5pdGlhbFRyaWdnZXIiLCAicmVhbFByb3BPZiIsICJub3JtYWxpemVBZmZlY3RlZFByb3AiLCAicHJvcFZhbHVlT2YiLCAiY2FsbEJ5UHJvcFJlZkF3YXJlIiwgIndpdGhUcmlnZ2VyIiwgInN1YnNjcmliZURpcmVjdGx5IiwgInRQcm9wIiwgImluaXRpYWxDYiIsICJ1blN1YiIsICJzdWJzY3JpYmVJbnB1dCIsICIkb3B0IiwgIiRjYiIsICJldiIsICJjaGVja0lzUGFpcmVkIiwgImlzRWZmZWN0T3B0aW9uc0FyZyIsICJub3JtYWxpemVFZmZlY3RUYXJnZXRzIiwgInRhcmdldHMiLCAiZWZmZWN0VGFyZ2V0Q29udGV4dCIsICJ0b0VmZmVjdEV2ZW50IiwgInN1YnNjcmliZVBhaXJlZCIsICJzdWJzY3JpYmVUaGVuYWJsZSIsICJlZmZlY3QiLCAiYWZmZWN0ZWRPcHRpb25zIiwgImRpc3Bvc2VycyIsICJkaXNwb3NlIiwgImVmZmVjdGVkIiwgIm1ha2VBcnJheU9ic2VydmFibGUiLCAib2JzZXJ2YWJsZUJ5U2V0IiwgIm9ic2VydmFibGVCeU1hcCIsICJEb3VibGVXZWFrTWFwIiwgIiN0b3AiLCAiI2Vuc3VyZUlubmVyIiwgImtleTEiLCAiaW5uZXIiLCAiI3NwbGl0UGFpciIsICJrZXkyIiwgImZhY3RvcnkiLCAiY29tcHV0ZSIsICJyZWdpc3RlcmVkSXRlcmF0ZWQiLCAiaXRlcmF0ZWQiLCAiJHN1YiIsICJlbnRyaWVzIiwgImJhc2lzIiwgIm9mT2xkIiwgIm9mTmV3IiwgImlzUGFpciIsICJiaW5kQnkiLCAid2F0Y2giLCAicCIsICJOIiwgImsiLCAiZGVyaXZhdGUiLCAiZnJvbSIsICJyZWFjdEZuIiwgImJpbmRCeUtleSIsICJjb25kaXRpb25hbEluZGV4IiwgImNvbmRMaXN0IiwgInJlYWRDb25kaXRpb24iLCAiY29uZGl0aW9uIiwgImludmFsaWRhdGUiLCAiY29uZGl0aW9uYWxSZWYiLCAiY29uZCIsICJpZlRydWUiLCAiaWZGYWxzZSIsICJnZXRUcnVlIiwgImdldEZhbHNlIiwgInZhbHVlT2YiLCAibiIsICJjb25kaXRpb25hbCIsICJyZW1hcCIsICJzdWIiLCAiZGVzdCIsICJ1bmlmaWVkIiwgInN1YnMiLCAiaW5pdGlhbEVudHJpZXMiLCAiYXNzaWduTWFwIiwgImFzc2lnbiIsICJhIiwgImIiLCAiaXNBQ29tcHV0ZSIsICJpc0JDb21wdXRlIiwgImNtcEJGbmMiLCAiaXNBUHJvcCIsICJhX3Byb3AiLCAiaXNCUHJvcCIsICJiX3Byb3AiLCAiYV90bXAiLCAiYVJlZiIsICJiX3RtcCIsICJiUmVmIiwgImNtcGZ4IiwgIm52IiwgInN0b3JlIiwgImxpbmsiLCAiYyIsICJvbGRBcmciLCAiY21wIiwgImFyZyIsICJmb3JjZSIsICJ3cnBGdW5jIiwgIm9sZEFyZyQiLCAib3AiLCAicmYiLCAicGVuZGluZ0luaXRpYWwiLCAiJGFwcGx5IiwgImNwIiwgIndyaXRlQ29tcHV0ZWQiLCAiZGVsYXllZFN1YnNjcmliZSJdCn0K
