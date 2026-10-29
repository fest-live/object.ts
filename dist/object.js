import { $avoidTrigger as fe, $getValue as Ke, $triggerLock as Oe, Promised as je, bindCtx as U, callByAllProp as Ze, callByProp as dt, defaultByType as ht, hasValue as V, isArrayInvalidKey as re, isKeyType as j, isNotEqual as O, isPrimitive as T, isPromise as $, makeTriggerLess as pe, objectAssign as ye, objectAssignNotEqual as vt, potentiallyAsync as ke, potentiallyAsyncMap as Ge, resolved as Te, tryParseByHint as C } from "@fest-lib/core";
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var d = /* @__PURE__ */ Symbol.for("@value"), w = /* @__PURE__ */ Symbol.for("@extract"), D = /* @__PURE__ */ Symbol.for("@origin"), ne = /* @__PURE__ */ Symbol.for("@registry"), q = /* @__PURE__ */ Symbol.for("@behavior"), W = /* @__PURE__ */ Symbol.for("@promise"), Le = /* @__PURE__ */ Symbol.for("@resolved"), be = /* @__PURE__ */ Symbol.for("@trigger-less"), h = /* @__PURE__ */ Symbol.for("@trigger-lock"), pt = /* @__PURE__ */ Symbol.for("@trigger-control"), k = /* @__PURE__ */ Symbol.for("@trigger"), le = /* @__PURE__ */ Symbol.for("@subscribe"), bt = /* @__PURE__ */ Symbol.for("@isNotEqual"), ae = /* @__PURE__ */ Symbol.for("@realProp"), Fe = /* @__PURE__ */ new WeakMap(), oe = (e) => {
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
var de = globalThis[rt], Ue = (e, t = ["*"]) => {
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
}, qe = (e = ["*"]) => new Set([...X(e)].flatMap((t) => [t, ...$e.get(t) ?? []])), X = (e = ["*"]) => {
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
    const n = qe(t);
    for (const l of n) r ? this.#n.delete(l) : this.#n.add(l);
  }
  withTriggers(t, r, n) {
    const l = [...qe(t)], s = new Map(l.map((i) => [i, this.#n.has(i)])), u = () => {
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
    ]), !this.#u && (this.#u = !0, scheduler?.yield?.()?.then?.(() => {
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
  return typeof r == "function" ? U(e, r) : r;
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
  return typeof n == "function" ? U(e, n) : n;
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
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? U(e, y(e, t)) : y(e, t);
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
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? U(e, y(e, t)) : y(e, t);
    const n = m.get(e), l = we(e, t, n);
    if (l != null) return l;
    const s = Ae(e, t, n);
    if (s != null) return s;
    e = y(e, w) ?? y(e, D) ?? e;
    const u = U(e, y(e, t));
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
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? U(e, y(e, t)) : y(e, t);
    const n = m.get(e), l = we(e, t, n);
    if (l != null) return l;
    const s = Ae(e, t, n);
    if (s != null) return s;
    e = y(e, w) ?? y(e, D) ?? e;
    const u = U(e, y(e, t));
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
    [q]: t,
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
    [q]: t,
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
    [q]: t,
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
    [q]: t,
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
}, Ut = (e, t = "value", r, n) => {
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
    [q]: n,
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
}, qt = (e, t) => {
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
  const n = K(e) ? e : qt(e, r);
  return t != null ? Ut(n, t, r) : n;
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
  e = e?.[w] ?? e, scheduler?.yield?.()?.then?.(() => {
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
  if (Lt(t) && r === void 0) return Ue(e, t);
  if (t == null) return Ue(e, r);
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
    [q]: n,
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
  }), Object.defineProperty(c, q, {
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
  qt as $ref,
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
  Ut as propRef,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vI3JlZ2lvbiBzcmMvd3JhcC9TeW1ib2wudHNcblN5bWJvbC5vYnNlcnZhYmxlIHx8PSBTeW1ib2wuZm9yKFwib2JzZXJ2YWJsZVwiKTtcblN5bWJvbC5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJzdWJzY3JpYmVcIik7XG5TeW1ib2wudW5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJ1bnN1YnNjcmliZVwiKTtcbnZhciAkdmFsdWUgPSBTeW1ib2wuZm9yKFwiQHZhbHVlXCIpO1xudmFyICRleHRyYWN0S2V5JCA9IFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKTtcbnZhciAkb3JpZ2luYWxLZXkkID0gU3ltYm9sLmZvcihcIkBvcmlnaW5cIik7XG52YXIgJHJlZ2lzdHJ5S2V5JCA9IFN5bWJvbC5mb3IoXCJAcmVnaXN0cnlcIik7XG52YXIgJGJlaGF2aW9yID0gU3ltYm9sLmZvcihcIkBiZWhhdmlvclwiKTtcbnZhciAkcHJvbWlzZSA9IFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKTtcbnZhciAkcmVzb2x2ZWQgPSBTeW1ib2wuZm9yKFwiQHJlc29sdmVkXCIpO1xudmFyICR0cmlnZ2VyTGVzcyA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sZXNzXCIpO1xudmFyICR0cmlnZ2VyTG9jayA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sb2NrXCIpO1xudmFyICR0cmlnZ2VyQ29udHJvbCA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpO1xudmFyICR0cmlnZ2VyID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyXCIpO1xudmFyICRhZmZlY3RlZCA9IFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpO1xudmFyICRpc05vdEVxdWFsID0gU3ltYm9sLmZvcihcIkBpc05vdEVxdWFsXCIpO1xudmFyICRyZWFsUHJvcCA9IFN5bWJvbC5mb3IoXCJAcmVhbFByb3BcIik7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy93cmFwL1V0aWxzLnRzXG52YXIgJG9yaWdpbmFsT2JqZWN0cyQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzYWZlID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldCwgbWFwcGVkID0gKGUpID0+IHNhZmUoZSk7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHJldHVybiB1bndyYXA/Lm1hcD8uKG1hcHBlZCkgfHwgQXJyYXkuZnJvbSh1bndyYXAgfHwgW10pPy5tYXA/LihtYXBwZWQpIHx8IFtdO1xuXHRlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXAgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha01hcCkgcmV0dXJuIG5ldyBNYXAoQXJyYXkuZnJvbSh1bndyYXA/LmVudHJpZXM/LigpIHx8IFtdKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrU2V0KSByZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKHVud3JhcD8udmFsdWVzPy4oKSB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkpO1xuXHRlbHNlIGlmICh1bndyYXAgIT0gbnVsbCAmJiB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyh1bndyYXAgfHwge30pIHx8IFtdKT8uZmlsdGVyPy4oKFtLXSkgPT4gSyAhPSAkZXh0cmFjdEtleSQgJiYgSyAhPSAkb3JpZ2luYWxLZXkkICYmIEsgIT0gJHJlZ2lzdHJ5S2V5JCk/Lm1hcD8uKChbSywgVl0pID0+IFtLLCBzYWZlKFYpXSkpO1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciB1bndyYXAgPSAoYXJyKSA9PiB7XG5cdHJldHVybiBhcnI/LlskZXh0cmFjdEtleSRdID8/IGFycj8uW1wiQHRhcmdldFwiXSA/PyBhcnI7XG59O1xudmFyIGRlcmVmID0gKHRhcmdldCwgZGlzY291bnRWYWx1ZSA9IGZhbHNlKSA9PiB7XG5cdGNvbnN0IG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRpZiAoaXNQcmltaXRpdmUodGFyZ2V0KSB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCBcImRlcmVmXCIgaW4gdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQ/LmRlcmVmID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9IHRhcmdldD8uZGVyZWY/LigpO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwgJiYgKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHR0YXJnZXQgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRjb25zdCAkdmFsID0gZGlzY291bnRWYWx1ZSAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHRhcmdldD8udmFsdWU7XG5cdFx0aWYgKCR2YWwgIT0gbnVsbCAmJiAodHlwZW9mICR2YWwgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgJHZhbCA9PSBcImZ1bmN0aW9uXCIpKSB0YXJnZXQgPSAkdmFsO1xuXHRcdGlmIChvcmlnaW5hbCAhPSB0YXJnZXQpIHJldHVybiBkZXJlZih0YXJnZXQsIGRpc2NvdW50VmFsdWUpO1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGlzVGhlbmFibGUgPSAodmFsKSA9PiB2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbnZhciB3aXRoUHJvbWlzZSA9ICh0YXJnZXQsIGNiKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY2I/Lih0YXJnZXQpO1xuXHRpZiAoaXNUaGVuYWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0LnRoZW4oY2IpO1xuXHRpZiAodHlwZW9mIHRhcmdldD8ucmVzb2x2ZWQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRhcmdldC5yZXNvbHZlZCgpKS50aGVuKGNiKTtcblx0aWYgKHRhcmdldD8ucHJvbWlzZSAmJiBpc1RoZW5hYmxlKHRhcmdldC5wcm9taXNlKSkgcmV0dXJuIHRhcmdldC5wcm9taXNlLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5bJHByb21pc2VdICYmIGlzVGhlbmFibGUodGFyZ2V0WyRwcm9taXNlXSkpIHJldHVybiB0YXJnZXRbJHByb21pc2VdLnRoZW4oY2IpO1xuXHRyZXR1cm4gY2I/Lih0YXJnZXQpO1xufTtcbnZhciBkaXNwb3NlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZGlzcG9zZVJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChjYWxsc3RhY2spID0+IHtcblx0Y2FsbHN0YWNrPy5mb3JFYWNoPy4oKGNiKSA9PiBjYj8uKCkpO1xufSk7XG5mdW5jdGlvbiBhZGRUb0NhbGxDaGFpbihvYmosIG1ldGhvZEtleSwgY2FsbGJhY2spIHtcblx0aWYgKCFjYWxsYmFjayB8fCB0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBvYmogIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAobWV0aG9kS2V5ID09IFN5bWJvbC5kaXNwb3NlKSB7XG5cdFx0Y29uc3QgY2hhaW5UYXJnZXQgPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iajtcblx0XHRkaXNwb3NlTWFwPy5nZXRPckluc2VydENvbXB1dGVkPy4oY2hhaW5UYXJnZXQsICgpID0+IHtcblx0XHRcdGNvbnN0IENhbGxDaGFpbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0XHRpZiAodHlwZW9mIGNoYWluVGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNoYWluVGFyZ2V0ID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRkaXNwb3NlUmVnaXN0cnkucmVnaXN0ZXIoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGRpc3Bvc2VNYXAuc2V0KGNoYWluVGFyZ2V0LCBDYWxsQ2hhaW4pO1xuXHRcdFx0XHRjaGFpblRhcmdldFtTeW1ib2wuZGlzcG9zZV0gPz89ICgpID0+IENhbGxDaGFpbi5mb3JFYWNoKChjYikgPT4ge1xuXHRcdFx0XHRcdGNiPy4oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQ2FsbENoYWluO1xuXHRcdH0pPy5hZGQ/LihjYWxsYmFjayk7XG5cdH0gZWxzZSBvYmpbbWV0aG9kS2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IG9iaj8uW21ldGhvZEtleV07XG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbCA9PSBcImZ1bmN0aW9uXCIpIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxudmFyIGlzQXJyYXlJbmRleCA9IChwcm9wKSA9PiB7XG5cdGlmICh0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuXHRpZiAocHJvcCA9PT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBudW0gPSBOdW1iZXIocHJvcCk7XG5cdHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IDAgJiYgU3RyaW5nKG51bSkgPT09IHByb3A7XG59O1xuZnVuY3Rpb24gd3JhcFNldEFzQXJyYXkoc291cmNlID0gW10sIG9wdGlvbnMgPSB7fSkge1xuXHRsZXQgYmFja2luZ1NldCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdGNvbnN0IG5vdGlmeUR1cGxpY2F0ZSA9ICh2YWx1ZSwgdmlhLCBpbmRleCkgPT4ge1xuXHRcdG9wdGlvbnMub25EdXBsaWNhdGU/Lih7XG5cdFx0XHR2YWx1ZSxcblx0XHRcdHZpYSxcblx0XHRcdGluZGV4XG5cdFx0fSk7XG5cdH07XG5cdGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIGJhY2tpbmdTZXQgPSBzb3VyY2U7XG5cdGVsc2UgZm9yIChjb25zdCBpdGVtIG9mIHNvdXJjZSkge1xuXHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fVxuXHRjb25zdCBzbmFwc2hvdCA9ICgpID0+IEFycmF5LmZyb20oYmFja2luZ1NldCk7XG5cdGNvbnN0IHJlYnVpbGRGcm9tID0gKGFycikgPT4ge1xuXHRcdGJhY2tpbmdTZXQuY2xlYXIoKTtcblx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSBiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fTtcblx0Y29uc3QgbWV0aG9kcyA9IHtcblx0XHRwdXNoOiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGxldCBzaXplID0gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInB1c2hcIik7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdFx0XHRcdHNpemUrKztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzaXplO1xuXHRcdH0sXG5cdFx0cG9wOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0aWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdFx0YmFja2luZ1NldC5kZWxldGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2hpZnQ6ICgpID0+IHtcblx0XHRcdGNvbnN0IGl0ZXJhdG9yID0gYmFja2luZ1NldC52YWx1ZXMoKS5uZXh0KCk7XG5cdFx0XHRpZiAoaXRlcmF0b3IuZG9uZSkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmF0b3IudmFsdWU7XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHR1bnNoaWZ0OiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Y29uc3QgY3VycmVudCA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCB0b1ByZXBlbmQgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoY3VycmVudC5pbmNsdWRlcyhpdGVtKSB8fCB0b1ByZXBlbmQuaW5jbHVkZXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJ1bnNoaWZ0XCIsIDApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvUHJlcGVuZC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0b1ByZXBlbmQubGVuZ3RoKSByZXR1cm4gY3VycmVudC5sZW5ndGg7XG5cdFx0XHRjb25zdCBuZXh0ID0gWy4uLnRvUHJlcGVuZCwgLi4uY3VycmVudF07XG5cdFx0XHRyZWJ1aWxkRnJvbShuZXh0KTtcblx0XHRcdHJldHVybiBuZXh0Lmxlbmd0aDtcblx0XHR9LFxuXHRcdHNwbGljZTogKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBub3JtYWxpemVkU3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChzdGFydCwgMCksIGFyci5sZW5ndGgpO1xuXHRcdFx0Y29uc3QgYWN0dWFsRGVsZXRlQ291bnQgPSBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gYXJyLmxlbmd0aCAtIG5vcm1hbGl6ZWRTdGFydCA6IE1hdGgubWF4KDAsIE1hdGgubWluKGRlbGV0ZUNvdW50LCBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0KSk7XG5cdFx0XHRjb25zdCByZW1vdmVkID0gYXJyLnNwbGljZShub3JtYWxpemVkU3RhcnQsIGFjdHVhbERlbGV0ZUNvdW50KTtcblx0XHRcdGxldCBpbnNlcnRQb3NpdGlvbiA9IG5vcm1hbGl6ZWRTdGFydDtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwic3BsaWNlXCIsIGluc2VydFBvc2l0aW9uKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcnIuc3BsaWNlKGluc2VydFBvc2l0aW9uKyssIDAsIGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdHJldHVybiByZW1vdmVkO1xuXHRcdH0sXG5cdFx0aW5jbHVkZXM6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5oYXModmFsdWUpLFxuXHRcdGluZGV4T2Y6ICh2YWx1ZSkgPT4gc25hcHNob3QoKS5pbmRleE9mKHZhbHVlKSxcblx0XHRjbGVhcjogKCkgPT4ge1xuXHRcdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlOiAodmFsdWUpID0+IGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKSxcblx0XHR0b0FycmF5OiAoKSA9PiBzbmFwc2hvdCgpLFxuXHRcdHRvU2V0OiAoKSA9PiBuZXcgU2V0KGJhY2tpbmdTZXQpLFxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBiYWNraW5nU2V0W1N5bWJvbC5pdGVyYXRvcl0oKVxuXHR9O1xuXHRyZXR1cm4gbmV3IFByb3h5KG1ldGhvZHMsIHtcblx0XHRnZXQ6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHJldHVybiBzbmFwc2hvdCgpW051bWJlcihwcm9wKV07XG5cdFx0XHRjb25zdCB2YWx1ZSA9IG1ldGhvZHNbcHJvcF07XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHNldDogKF8sIHByb3AsIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyXCIpO1xuXHRcdFx0XHRjb25zdCBuZXh0TGVuZ3RoID0gTWF0aC5mbG9vcih2YWx1ZSk7XG5cdFx0XHRcdGlmIChuZXh0TGVuZ3RoID49IGJhY2tpbmdTZXQuc2l6ZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCkuc2xpY2UoMCwgbmV4dExlbmd0aCk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID4gYXJyLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IG5leHRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAoaW5kZXggPCBhcnIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFZhbHVlID0gYXJyW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoT2JqZWN0LmlzKGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKGFyci5zb21lKChpdGVtLCBpZHgpID0+IGlkeCAhPT0gaW5kZXggJiYgT2JqZWN0LmlzKGl0ZW0sIG5leHRWYWx1ZSkpKSB7XG5cdFx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUobmV4dFZhbHVlLCBcInNldFwiLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YXJyW2luZGV4XSA9IG5leHRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKG5leHRWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnIucHVzaChuZXh0VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3Quc2V0KG1ldGhvZHMsIHByb3AsIHZhbHVlKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRvd25LZXlzOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gW107XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IF8gb2YgYmFja2luZ1NldCkga2V5cy5wdXNoKFN0cmluZyhpKyspKTtcblx0XHRcdGtleXMucHVzaChcImxlbmd0aFwiKTtcblx0XHRcdHJldHVybiBrZXlzO1xuXHRcdH0sXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0dmFsdWU6IGJhY2tpbmdTZXQuc2l6ZVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHZhbHVlOiBhcnJbaW5kZXhdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRoYXM6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRyZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9wIGluIG1ldGhvZHM7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3dyYXAvQXNzaWduT2JqZWN0LnRzXG52YXIgQXNzaWduT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbmFtZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ/LltuYW1lXSA/PyB0YXJnZXQ7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgY3R4KTtcblx0fVxufTtcbnZhciBtYWtlT2JqZWN0QXNzaWduYWJsZSA9IChvYmopID0+IHtcblx0aWYgKG9iaj8uWyRvcmlnaW5hbEtleSRdIHx8ICRvcmlnaW5hbE9iamVjdHMkLmhhcyhvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCBweCA9IG5ldyBQcm94eShvYmosIG5ldyBBc3NpZ25PYmplY3RIYW5kbGVyKCkpO1xuXHQkb3JpZ2luYWxPYmplY3RzJC5zZXQocHgsIG9iaik7XG5cdHJldHVybiBweDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1N1YnNjcmlwdC50c1xudmFyIHdpdGhVbnN1YlN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd2l0aFVuc3ViXCIpO1xuZ2xvYmFsVGhpc1t3aXRoVW5zdWJTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB3aXRoVW5zdWIgPSBnbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF07XG52YXIgY29tcGxldGVXaXRoVW5zdWIgPSAoc3Vic2NyaWJlciwgd2VhaywgaGFuZGxlcikgPT4ge1xuXHRyZXR1cm4gd2l0aFVuc3ViLmdldE9ySW5zZXJ0KHN1YnNjcmliZXIsICgpID0+IHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHdlYWs/LmRlcmVmPy4oKTtcblx0XHRyZWdpc3RyeT8uYWZmZWN0ZWQ/LihoYW5kbGVyKTtcblx0XHRjb25zdCBzYXZDb21wbGV0ZSA9IHN1YnNjcmliZXI/LmNvbXBsZXRlPy5iaW5kPy4oc3Vic2NyaWJlcik7XG5cdFx0Y29uc3QgdW5hZmZlY3RlZCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHIgPSBzYXZDb21wbGV0ZT8uKCk7XG5cdFx0XHRyZWdpc3RyeT8udW5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fTtcblx0XHRzdWJzY3JpYmVyLmNvbXBsZXRlID0gdW5hZmZlY3RlZDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuZGlzcG9zZV06IHVuYWZmZWN0ZWQsXG5cdFx0XHRbU3ltYm9sLmFzeW5jRGlzcG9zZV06IHVuYWZmZWN0ZWRcblx0XHR9O1xuXHR9KTtcbn07XG52YXIgc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHN1YnNjcmlwdFJlZ2lzdHJ5XCIpO1xuZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHN1YnNjcmlwdFJlZ2lzdHJ5ID0gZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAZ2xvYmFsRWZmZWN0TGlzdGVuZXJzXCIpO1xuZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVycyA9IGdsb2JhbFRoaXNbZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sXTtcbnZhciBlZmZlY3RHbG9iYWxseSA9IChjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Z2xvYmFsRWZmZWN0TGlzdGVuZXJzLnNldChjYiwgbm9ybWFsaXplZC5hZmZlY3RUeXBlcyk7XG5cdHJldHVybiAoKSA9PiBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuZGVsZXRlKGNiKTtcbn07XG52YXIgd3JhcHBlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd3JhcHBlZFwiKTtcbmdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdyYXBwZWQgPSBnbG9iYWxUaGlzW3dyYXBwZWRTeW1ib2xdO1xudmFyIHJlZ2lzdGVyID0gKHdoYXQsIGhhbmRsZSkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0O1xuXHRsZXQgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKTtcblx0aWYgKCFyZWdpc3RyeSkge1xuXHRcdHJlZ2lzdHJ5ID0gbmV3IFN1YnNjcmlwdCh1bndyYXApO1xuXHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LnNldCh1bndyYXAsIHJlZ2lzdHJ5KTtcblx0fSBlbHNlIHJlZ2lzdHJ5LmJpbmRTb3VyY2UodW53cmFwKTtcblx0cmV0dXJuIGhhbmRsZTtcbn07XG52YXIgd3JhcFdpdGggPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdHdoYXQgPSBkZXJlZih3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0KTtcblx0aWYgKHR5cGVvZiB3aGF0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2Ygd2hhdCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB3aGF0ID09IFwiZnVuY3Rpb25cIikgfHwgd2hhdCA9PSBudWxsKSByZXR1cm4gd2hhdDtcblx0cmV0dXJuIHdyYXBwZWQuZ2V0T3JJbnNlcnRDb21wdXRlZCh3aGF0LCAoKSA9PiBuZXcgUHJveHkod2hhdCwgcmVnaXN0ZXIod2hhdCwgaGFuZGxlKSkpO1xufTtcbnZhciBmb3JBbGwgPSBTeW1ib2wuZm9yKFwiQGFsbFByb3BzXCIpO1xudmFyIHdpbGRjYXJkVHJpZ2dlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCIsIFwiYWxsXCJdKTtcbnZhciB0cmlnZ2VyQWxpYXNlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKFtcblx0W1wic2V0XCIsIFtcInNldHRlclwiLCBcIkBzZXRcIl1dLFxuXHRbXCJhZGRcIiwgW1wiQGFkZFwiXV0sXG5cdFtcImRlbGV0ZVwiLCBbXCJAZGVsZXRlXCJdXSxcblx0W1wiaW52YWxpZGF0ZVwiLCBbXCJAaW52YWxpZGF0ZVwiXV0sXG5cdFtcIm1hbnVhbFwiLCBbXCJAbWFudWFsXCJdXSxcblx0W1wiY3VzdG9tXCIsIFtcIkBjdXN0b21cIl1dLFxuXHRbXCJyZXNvbHZlZFwiLCBbXCJAcmVzb2x2ZWRcIl1dLFxuXHRbXCJzZXRBbGxcIiwgW1wiQHNldEFsbFwiXV0sXG5cdFtcImFkZEFsbFwiLCBbXCJAYWRkQWxsXCJdXSxcblx0W1wiZGVsZXRlQWxsXCIsIFtcIkBkZWxldGVBbGxcIiwgXCJAY2xlYXJcIl1dXG5dKTtcbnZhciB0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHRyaWdnZXJDYW5vbmljYWxOYW1lc1wiKTtcbmdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXSA/Pz0gbmV3IE1hcChBcnJheS5mcm9tKHRyaWdnZXJBbGlhc2VzLmVudHJpZXMoKSkuZmxhdE1hcCgoW2Nhbm9uaWNhbCwgYWxpYXNlc10pID0+IGFsaWFzZXMubWFwKChhbGlhcykgPT4gW2FsaWFzLCBjYW5vbmljYWxdKSkpO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lcyA9IGdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXTtcbnZhciBub3JtYWxpemVUcmlnZ2VyTmFtZSA9ICh0cmlnZ2VyID0gXCJzZXRcIikgPT4ge1xuXHRpZiAodHJpZ2dlciA9PSBudWxsKSByZXR1cm4gdHJpZ2dlcjtcblx0Y29uc3QgbmFtZSA9IFN0cmluZyh0cmlnZ2VyIHx8IFwic2V0XCIpO1xuXHRyZXR1cm4gdHJpZ2dlckNhbm9uaWNhbE5hbWVzLmdldChuYW1lKSA/PyBuYW1lO1xufTtcbnZhciB0cmlnZ2VyTmFtZXNPZiA9ICh0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5hbWUgPSB0cmlnZ2VyID09IG51bGwgPyBcImFsbFwiIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IFwiYWxsXCIpO1xuXHRyZXR1cm4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV07XG59O1xudmFyIGV4cGFuZFRyaWdnZXJGaWx0ZXIgPSAodHlwZXMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBuZXcgU2V0KFsuLi5ub3JtYWxpemVUcmlnZ2VyRmlsdGVyKHR5cGVzKV0uZmxhdE1hcCgobmFtZSkgPT4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV0pKTtcbn07XG52YXIgbm9ybWFsaXplVHJpZ2dlckZpbHRlciA9ICh0cmlnZ2VycyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgbGlzdCA9IHR5cGVvZiB0cmlnZ2VycyA9PSBcInN0cmluZ1wiID8gW3RyaWdnZXJzXSA6IEFycmF5LmZyb20odHJpZ2dlcnMgPz8gW1wiKlwiXSk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBuZXcgU2V0KGxpc3QubWFwKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgbmFtZSA9IFN0cmluZyhpdGVtIHx8IFwiKlwiKTtcblx0XHRyZXR1cm4gd2lsZGNhcmRUcmlnZ2Vycy5oYXMobmFtZSkgPyBuYW1lIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG5hbWUpID8/IG5hbWUpO1xuXHR9KSk7XG5cdHJldHVybiBub3JtYWxpemVkLnNpemUgPyBub3JtYWxpemVkIDogLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1wiKlwiXSk7XG59O1xudmFyIHRyaWdnZXJGaWx0ZXJBbGxvd3MgPSAodHJpZ2dlcnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3QgZmlsdGVyID0gdHJpZ2dlcnMgaW5zdGFuY2VvZiBTZXQgPyB0cmlnZ2VycyA6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHJpZ2dlcnMpO1xuXHRyZXR1cm4gWy4uLndpbGRjYXJkVHJpZ2dlcnNdLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpIHx8IHRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpO1xufTtcbnZhciBpc09wdGlvbnNPYmplY3QgPSAob3B0aW9ucykgPT4ge1xuXHRyZXR1cm4gISFvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucykgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlcnNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gb3B0aW9ucyk7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ICE9PSBmYWxzZVxuXHR9O1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyk7XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiB0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcImluaXRpYWxcIilcblx0fTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0T3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ID09PSB0cnVlXG5cdH07XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9O1xufTtcbnZhciBTdWJzY3JpcHRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQFN1YnNjcmlwdFwiKTtcbmdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXSA/Pz0gY2xhc3MgU3Vic2NyaXB0IHtcblx0Y29tcGF0aWJsZTtcblx0I3NvdXJjZTtcblx0I2xpc3RlbmVycztcblx0I2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdCNuYXRpdmU7XG5cdCNpdGVyYXRvcjtcblx0I2luRGlzcGF0Y2ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjZGlzYWJsZWRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCN0cmlnZ2VyQ29udHJvbDtcblx0I3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQjcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy4jbGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHR0aGlzLiNmbGFncyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRcdHRoaXMuI3RyaWdnZXJDb250cm9sID0ge1xuXHRcdFx0ZW5hYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgdHJ1ZSwgY2IpIDogdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIHRydWUpLFxuXHRcdFx0ZGlzYWJsZTogKHR5cGVzID0gW1wiKlwiXSwgY2IpID0+IGNiID8gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIGZhbHNlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgZmFsc2UpLFxuXHRcdFx0c2V0OiAodHlwZXMsIGVuYWJsZWQpID0+IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBlbmFibGVkKSxcblx0XHRcdHdpdGg6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYiksXG5cdFx0XHR3aXRob3V0OiAodHlwZXMsIGNiKSA9PiB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSxcblx0XHRcdGlzRW5hYmxlZDogKHRyaWdnZXIpID0+IHRoaXMuaXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKVxuXHRcdH07XG5cdFx0dGhpcy4jaXRlcmF0b3IgPSB7IG5leHQ6IChhcmdzKSA9PiB7XG5cdFx0XHRpZiAoYXJncykgQXJyYXkuaXNBcnJheShhcmdzKSA/IHRoaXMuI2Rpc3BhdGNoKC4uLmFyZ3MpIDogdGhpcy4jZGlzcGF0Y2goYXJncyk7XG5cdFx0fSB9O1xuXHRcdGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZih0aGlzKTtcblx0XHRjb25zdCBjb250cm9sbGVyID0gZnVuY3Rpb24oc3Vic2NyaWJlcikge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IHN1YnNjcmliZXI/Lm5leHQ/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRcdHJldHVybiBjb21wbGV0ZVdpdGhVbnN1YihzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKTtcblx0XHR9O1xuXHRcdHRoaXMuI25hdGl2ZSA9IHR5cGVvZiBPYnNlcnZhYmxlICE9IFwidW5kZWZpbmVkXCIgPyBuZXcgT2JzZXJ2YWJsZShjb250cm9sbGVyKSA6IG51bGw7XG5cdFx0dGhpcy5jb21wYXRpYmxlID0gKCkgPT4gdGhpcy4jbmF0aXZlO1xuXHR9XG5cdGJpbmRTb3VyY2Uoc291cmNlKSB7XG5cdFx0dGhpcy4jc291cmNlID8/PSBzb3VyY2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0JHNhZmVFeGVjKGNiLCAuLi5hcmdzKSB7XG5cdFx0aWYgKCFjYiB8fCB0aGlzLiNmbGFncy5oYXMoY2IpKSByZXR1cm47XG5cdFx0dGhpcy4jZmxhZ3MuYWRkKGNiKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzID0gY2IoLi4uYXJncyk7XG5cdFx0XHRpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHJlcy5jYXRjaChjb25zb2xlLndhcm4pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy4jZmxhZ3MuZGVsZXRlKGNiKTtcblx0XHR9XG5cdH1cblx0I2Rpc3BhdGNoKG5hbWUsIHZhbHVlID0gbnVsbCwgb2xkVmFsdWUsIHRyaWdnZXIgPSBcImFsbFwiLCAuLi5ldGMpIHtcblx0XHR0cmlnZ2VyID0gbm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gdHJpZ2dlcjtcblx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0aWYgKGxpc3RlbmVycz8uc2l6ZSkge1xuXHRcdFx0Zm9yIChjb25zdCBbY2IsIHJlY29yZF0gb2YgbGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKChyZWNvcmQucHJvcCA9PT0gbmFtZSB8fCByZWNvcmQucHJvcCA9PT0gZm9yQWxsIHx8IHJlY29yZC5wcm9wID09PSBudWxsKSAmJiB0cmlnZ2VyRmlsdGVyQWxsb3dzKHJlY29yZC50cmlnZ2VycywgdHJpZ2dlcikpIHRoaXMuJHNhZmVFeGVjKGNiLCB2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG5cdFx0fVxuXHRcdGlmIChnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2l6ZSkge1xuXHRcdFx0Y29uc3QgZXZlbnQgPSB7XG5cdFx0XHRcdHNvdXJjZTogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR0YXJnZXQ6IHRoaXMuI3NvdXJjZSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdHByb3A6IG5hbWUsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyLFxuXHRcdFx0XHRhcmdzOiBldGNcblx0XHRcdH07XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgdHJpZ2dlcnNdIG9mIGdsb2JhbEVmZmVjdExpc3RlbmVycy5lbnRyaWVzKCkpIGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKHRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIGV2ZW50KTtcblx0XHR9XG5cdH1cblx0d3JhcChudykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG53KSkgcmV0dXJuIHdyYXBXaXRoKG53LCB0aGlzKTtcblx0XHRyZXR1cm4gbnc7XG5cdH1cblx0Z2V0IHRyaWdnZXJDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLiN0cmlnZ2VyQ29udHJvbDtcblx0fVxuXHRpc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpIHtcblx0XHRyZXR1cm4gIXRyaWdnZXJGaWx0ZXJBbGxvd3ModGhpcy4jZGlzYWJsZWRUcmlnZ2VycywgXCJhbGxcIikgJiYgIXRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpKTtcblx0fVxuXHRzZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMgPSBbXCIqXCJdLCBlbmFibGVkID0gdHJ1ZSkge1xuXHRcdGNvbnN0IG5hbWVzID0gZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyk7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSBpZiAoZW5hYmxlZCkgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5kZWxldGUobmFtZSk7XG5cdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0fVxuXHR3aXRoVHJpZ2dlcnModHlwZXMsIGVuYWJsZWQsIGNiKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBbLi4uZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyldO1xuXHRcdGNvbnN0IHByZXZpb3VzID0gbmV3IE1hcChuYW1lcy5tYXAoKG5hbWUpID0+IFtuYW1lLCB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmhhcyhuYW1lKV0pKTtcblx0XHRjb25zdCByZXN0b3JlID0gKCkgPT4ge1xuXHRcdFx0cHJldmlvdXMuZm9yRWFjaCgod2FzRGlzYWJsZWQsIG5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHdhc0Rpc2FibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0XHRcdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0dGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQobmFtZXMsIGVuYWJsZWQpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjYj8uKCk7XG5cdFx0XHRpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQuZmluYWxseSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiByZXN1bHQuZmluYWxseShyZXN0b3JlKTtcblx0XHRcdHJlc3RvcmUoKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YWZmZWN0ZWQoY2IsIHByb3AsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdFx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy4jbGlzdGVuZXJzLnNldChjYiwge1xuXHRcdFx0cHJvcDogcHJvcCB8fCBmb3JBbGwsXG5cdFx0XHR0cmlnZ2Vyczogbm9ybWFsaXplZC5hZmZlY3RUeXBlc1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnVuYWZmZWN0ZWQoY2IsIHByb3AgfHwgZm9yQWxsKTtcblx0fVxuXHR1bmFmZmVjdGVkKGNiLCBwcm9wKSB7XG5cdFx0aWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy4jbGlzdGVuZXJzO1xuXHRcdFx0Y29uc3QgcmVjb3JkID0gbGlzdGVuZXJzPy5nZXQoY2IpO1xuXHRcdFx0aWYgKHJlY29yZCAmJiAocmVjb3JkLnByb3AgPT0gcHJvcCB8fCBwcm9wID09IG51bGwgfHwgcHJvcCA9PSBmb3JBbGwpKSB7XG5cdFx0XHRcdGxpc3RlbmVycy5kZWxldGUoY2IpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gdGhpcy5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwsIHJlY29yZC50cmlnZ2Vycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiNsaXN0ZW5lcnMuY2xlYXIoKTtcblx0fVxuXHR0cmlnZ2VyKG5hbWUsIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwic2V0XCIsIC4uLmV0Yykge1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgcmV0dXJuO1xuXHRcdGlmICh0cmlnZ2VyID09PSB2b2lkIDApIHRyaWdnZXIgPSBcInNldFwiO1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGlmICghdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpKSByZXR1cm47XG5cdFx0Y29uc3Qgb3BLZXkgPSBgJHt0cmlnZ2VyID8/IFwiYWxsXCJ9YDtcblx0XHRsZXQgYnlPcCA9IHRoaXMuI3BlbmRpbmdCeVByb3AuZ2V0KG5hbWUpO1xuXHRcdGlmICghYnlPcCkge1xuXHRcdFx0YnlPcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wLnNldChuYW1lLCBieU9wKTtcblx0XHR9XG5cdFx0YnlPcC5zZXQob3BLZXksIFtcblx0XHRcdG5hbWUsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdGV0Y1xuXHRcdF0pO1xuXHRcdGlmICh0aGlzLiNmbHVzaFNjaGVkdWxlZCkgcmV0dXJuO1xuXHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcblx0XHRzY2hlZHVsZXI/LnlpZWxkPy4oKT8udGhlbj8uKCgpID0+IHtcblx0XHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5cdFx0XHRjb25zdCBiYXRjaCA9IHRoaXMuI3BlbmRpbmdCeVByb3A7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGZvciAoY29uc3QgW3Byb3AsIG9wTWFwXSBvZiBiYXRjaCkge1xuXHRcdFx0XHRpZiAocHJvcCAhPSBudWxsICYmIHRoaXMuI2luRGlzcGF0Y2guaGFzKHByb3ApKSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCkgdGhpcy4jaW5EaXNwYXRjaC5hZGQocHJvcCk7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBbLCBhcmdzXSBvZiBvcE1hcCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgW25tLCB2LCBvdiwgdGcsIHJlc3RdID0gYXJncztcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuI2Rpc3BhdGNoKG5tLCB2LCBvdiwgdGcsIC4uLnJlc3QgPz8gW10pO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdGlmIChwcm9wICE9IG51bGwpIHRoaXMuI2luRGlzcGF0Y2guZGVsZXRlKHByb3ApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0Z2V0IGl0ZXJhdG9yKCkge1xuXHRcdHJldHVybiB0aGlzLiNpdGVyYXRvcjtcblx0fVxufTtcbnZhciBTdWJzY3JpcHQgPSBnbG9iYWxUaGlzW1N1YnNjcmlwdFN5bWJvbF07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1Jlc29sdmVkLnRzXG52YXIgcmF3T2YgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHVud3JhcHBlZCA9IGRlcmVmKHRhcmdldCk7XG5cdHJldHVybiB1bndyYXBwZWQ/LlskZXh0cmFjdEtleSRdID8/IHVud3JhcHBlZDtcbn07XG5mdW5jdGlvbiByZXNvbHZlZCh0YXJnZXQsIG1vZGUgPSBcImFsbFwiKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCk7XG5cdGlmIChpc1Byb21pc2UocmF3KSkgcmV0dXJuIHJlc29sdmVkJDEocmF3LCBtb2RlKTtcblx0aWYgKGlzUHJvbWlzZShyYXc/LlskcHJvbWlzZV0pKSByZXR1cm4gcmVzb2x2ZWQkMShyYXdbJHByb21pc2VdLCBtb2RlKTtcblx0cmV0dXJuIHJlc29sdmVkJDEocmF3ID8/IHRhcmdldCwgbW9kZSk7XG59XG5mdW5jdGlvbiBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQsIGVtaXQgPSBmYWxzZSkge1xuXHRjb25zdCBydW4gPSAoKG1vZGUgPSBcImFsbFwiKSA9PiB7XG5cdFx0Y29uc3QgcGVuZGluZyA9IHJlc29sdmVkKHRhcmdldCwgbW9kZSk7XG5cdFx0aWYgKCFlbWl0KSByZXR1cm4gcGVuZGluZztcblx0XHRyZXR1cm4gcGVuZGluZy50aGVuKCh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KTtcblx0XHRcdGNvbnN0IGtleSA9IHJhdz8ucmVhbFByb3AgPz8gKHJhdyAmJiBcInZhbHVlXCIgaW4gcmF3ID8gXCJ2YWx1ZVwiIDogbnVsbCk7XG5cdFx0XHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIHZvaWQgMCwgXCJyZXNvbHZlZFwiKTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9KTtcblx0fSk7XG5cdHJ1bi5hbGwgPSAoKSA9PiBydW4oXCJhbGxcIik7XG5cdHJ1bi5hbGxTZXR0bGVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLmFsbEtleWVkID0gKCkgPT4gcnVuKFwiYWxsXCIpO1xuXHRydW4uYWxsU2V0dGxlZEtleWVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLnRyeSA9IChjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpID0+IFByb21pc2UudHJ5KGNhbGxiYWNrT3JWYWx1ZSwgLi4uYXJncykudGhlbigodmFsdWUpID0+IHJlc29sdmVkKHZhbHVlID8/IHRhcmdldCwgXCJhbGxcIikpO1xuXHRyZXR1cm4gcnVuO1xufVxuZnVuY3Rpb24gZW1pdFJlc29sdmVkKHRhcmdldCwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpIHtcblx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KSA/PyB0YXJnZXQ7XG5cdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChyYXcpPy50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIFwicmVzb2x2ZWRcIik7XG59XG5mdW5jdGlvbiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMobGl2ZSwgcmF3KSB7XG5cdGlmIChsaXZlID09IG51bGwgfHwgcmF3ID09IG51bGwpIHJldHVybiBsaXZlO1xuXHRpZiAoQXJyYXkuaXNBcnJheShyYXcpKSB7XG5cdFx0cmF3LmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuXHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmVbaW5kZXhdID0gdmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGxpdmU7XG5cdH1cblx0aWYgKHJhdyBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIHJhdy5lbnRyaWVzKCkpIGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlLnNldChrZXksIHZhbHVlKTtcblx0XHRyZXR1cm4gbGl2ZTtcblx0fVxuXHRpZiAocmF3IGluc3RhbmNlb2YgU2V0KSByZXR1cm4gbGl2ZTtcblx0Zm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdC5vd25LZXlzKHJhdykpIHtcblx0XHRpZiAoa2V5ID09ICRleHRyYWN0S2V5JCB8fCBrZXkgPT0gJHByb21pc2UgfHwga2V5ID09ICRyZXNvbHZlZCkgY29udGludWU7XG5cdFx0aWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHJhdywga2V5KT8uZW51bWVyYWJsZSkgY29udGludWU7XG5cdFx0Y29uc3QgdmFsdWUgPSByYXdba2V5XTtcblx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZVtrZXldID0gdmFsdWU7XG5cdH1cblx0cmV0dXJuIGxpdmU7XG59XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1NwZWNpZmljLnRzXG52YXIgX19zYWZlR2V0R3VhcmRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQF9fc2FmZUdldEd1YXJkXCIpO1xudmFyIF9fc3lzdGVtU2tpcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcblx0U3ltYm9sLnRvU3RyaW5nVGFnLFxuXHRTeW1ib2wuaXRlcmF0b3IsXG5cdFN5bWJvbC5hc3luY0l0ZXJhdG9yLFxuXHRTeW1ib2wudG9QcmltaXRpdmUsXG5cdFwidG9TdHJpbmdcIixcblx0XCJ2YWx1ZU9mXCIsXG5cdFwiaW5zcGVjdFwiLFxuXHRcImNvbnN0cnVjdG9yXCIsXG5cdFwiX19wcm90b19fXCIsXG5cdFwicHJvdG90eXBlXCIsXG5cdFwidGhlblwiLFxuXHRcImNhdGNoXCIsXG5cdFwiZmluYWxseVwiLFxuXHRcIm5leHRcIlxuXSk7XG52YXIgc3lzdGVtU2tpcEdldCA9ICh0YXJnZXQsIG5hbWUpID0+IHtcblx0aWYgKCFfX3N5c3RlbVNraXAuaGFzKG5hbWUpKSByZXR1cm4gbnVsbDtcblx0Y29uc3QgZ290ID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRyZXR1cm4gdHlwZW9mIGdvdCA9PT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIGdvdCkgOiBnb3Q7XG59O1xudmFyIF9fc2FmZUdldEd1YXJkID0gZ2xvYmFsVGhpc1tfX3NhZmVHZXRHdWFyZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gaXNHZXR0ZXIob2JqLCBwcm9wTmFtZSkge1xuXHRsZXQgZ290ID0gdHJ1ZTtcblx0dHJ5IHtcblx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/LihvYmosIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/Lihwcm9wTmFtZSk7XG5cdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/LihvYmopPy5oYXM/Lihwcm9wTmFtZSkpIGdvdCA9IHRydWU7XG5cdFx0Z290ID0gdHlwZW9mIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcE5hbWUpPy5nZXQgPT0gXCJmdW5jdGlvblwiO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Z290ID0gdHJ1ZTtcblx0fSBmaW5hbGx5IHtcblx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4ob2JqKT8uZGVsZXRlPy4ocHJvcE5hbWUpO1xuXHR9XG5cdHJldHVybiBnb3Q7XG59XG52YXIgZmFsbFRocm91Z2ggPSAob2JqLCBrZXkpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKG9iaikpIHJldHVybiBvYmo7XG5cdGNvbnN0IHZhbHVlID0gc2FmZUdldChvYmosIGtleSk7XG5cdGlmICh2YWx1ZSA9PSBudWxsICYmIGtleSAhPSBcInZhbHVlXCIpIHtcblx0XHRjb25zdCB0bXAgPSBzYWZlR2V0KG9iaiwgXCJ2YWx1ZVwiKTtcblx0XHRpZiAodG1wICE9IG51bGwgJiYgIWlzUHJpbWl0aXZlKHRtcCkpIHJldHVybiBmYWxsVGhyb3VnaCh0bXAsIGtleSk7XG5cdFx0ZWxzZSByZXR1cm4gdmFsdWU7XG5cdH0gZWxzZSBpZiAoa2V5ID09IFwidmFsdWVcIiAmJiB2YWx1ZSAhPSBudWxsICYmICFpc1ByaW1pdGl2ZSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbGxUaHJvdWdoKHZhbHVlLCBrZXkpID8/IHZhbHVlID8/IG9iajtcblx0cmV0dXJuIHZhbHVlID8/IG9iajtcbn07XG52YXIgc2FmZVNldCA9IChvYmosIGtleSwgdmFsdWUpID0+IHtcblx0aWYgKG9iaiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdGxldCBhY3RpdmUgPSBfX3NhZmVTZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/LihvYmosIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRpZiAoYWN0aXZlPy5oYXM/LihrZXkpKSByZXR1cm4gZmFsc2U7XG5cdGFjdGl2ZT8uYWRkPy4oa2V5KTtcblx0cmV0dXJuIFJlZmxlY3Quc2V0KG9iaiwga2V5LCB2YWx1ZSk7XG59O1xudmFyIHNhZmVHZXQgPSAob2JqLCBrZXksIHJlYykgPT4ge1xuXHRsZXQgcmVzdWx0ID0gdm9pZCAwO1xuXHRpZiAob2JqID09IG51bGwpIHJldHVybiBvYmo7XG5cdGxldCBhY3RpdmUgPSBfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/LihvYmosIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRpZiAoYWN0aXZlPy5oYXM/LihrZXkpKSByZXR1cm4gbnVsbDtcblx0aWYgKCFpc0dldHRlcihvYmosIGtleSkpIHJlc3VsdCA/Pz0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcblx0ZWxzZSB7XG5cdFx0YWN0aXZlPy5hZGQ/LihrZXkpO1xuXHRcdHRyeSB7XG5cdFx0XHRyZXN1bHQgPSBSZWZsZWN0LmdldChvYmosIGtleSwgcmVjICE9IG51bGwgPyByZWMgOiBvYmopO1xuXHRcdH0gY2F0Y2ggKF9lKSB7XG5cdFx0XHRyZXN1bHQgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdGFjdGl2ZS5kZWxldGUoa2V5KTtcblx0XHRcdGlmIChhY3RpdmU/LnNpemUgPT09IDApIF9fc2FmZUdldEd1YXJkPy5kZWxldGU/LihvYmopO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHlwZW9mIHJlc3VsdCA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KG9iaiwgcmVzdWx0KSA6IHJlc3VsdDtcbn07XG52YXIgaGFzT3duID0gKG9iaiwga2V5KSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xudmFyIGlzVHJpZ2dlckVtaXRPcHRpb25zID0gKHZhbHVlLCBhbGxvd1ZhbHVlT25seSA9IGZhbHNlKSA9PiB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAoaGFzT3duKHZhbHVlLCBcImtleVwiKSB8fCBoYXNPd24odmFsdWUsIFwibmFtZVwiKSB8fCBoYXNPd24odmFsdWUsIFwib2xkVmFsdWVcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9sZFwiKSB8fCBoYXNPd24odmFsdWUsIFwib3BcIikgfHwgaGFzT3duKHZhbHVlLCBcInRyaWdnZXJcIikgfHwgYWxsb3dWYWx1ZU9ubHkgJiYgaGFzT3duKHZhbHVlLCBcInZhbHVlXCIpKTtcbn07XG52YXIgdHJpZ2dlck9wdGlvblZhbHVlID0gKG9wdGlvbnMsIGtleSwgZmFsbGJhY2spID0+IHtcblx0aWYgKGhhc093bihvcHRpb25zLCBrZXkpKSByZXR1cm4gb3B0aW9uc1trZXldO1xuXHRpZiAoa2V5ID09IFwib2xkVmFsdWVcIiAmJiBoYXNPd24ob3B0aW9ucywgXCJvbGRcIikpIHJldHVybiBvcHRpb25zLm9sZDtcblx0cmV0dXJuIGZhbGxiYWNrKCk7XG59O1xudmFyIHRyaWdnZXJPcHRpb25UcmlnZ2VyID0gKG9wdGlvbnMsIGZhbGxiYWNrID0gXCJtYW51YWxcIikgPT4gbm9ybWFsaXplVHJpZ2dlck5hbWUob3B0aW9ucy50cmlnZ2VyID8/IG9wdGlvbnMub3AgPz8gZmFsbGJhY2spO1xudmFyIGlzUnVudGltZUtleSA9IChrZXkpID0+IHR5cGVvZiBrZXkgPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2Yga2V5ID09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGtleSA9PSBcInN5bWJvbFwiO1xudmFyIHJlYWxQcm9wT2YkMSA9ICh0YXJnZXQpID0+IHtcblx0Y29uc3QgcHJvcCA9IHNhZmVHZXQodGFyZ2V0LCAkcmVhbFByb3ApID8/IHNhZmVHZXQodGFyZ2V0LCBcInJlYWxQcm9wXCIpO1xuXHRyZXR1cm4gaXNSdW50aW1lS2V5KHByb3ApID8gcHJvcCA6IG51bGw7XG59O1xudmFyIHRyaWdnZXJLZXlPZiA9ICh0YXJnZXQsIGtleSkgPT4ga2V5ID09IFwidmFsdWVcIiA/IHJlYWxQcm9wT2YkMSh0YXJnZXQpID8/IGtleSA6IGtleTtcbnZhciB0cmlnZ2VyVmFsdWVPZiA9ICh0YXJnZXQsIGtleSkgPT4ge1xuXHRjb25zdCByZWFsUHJvcCA9IHJlYWxQcm9wT2YkMSh0YXJnZXQpO1xuXHRpZiAocmVhbFByb3AgIT0gbnVsbCAmJiBrZXkgPT0gcmVhbFByb3ApIHJldHVybiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA/PyBzYWZlR2V0KHRhcmdldCwga2V5KTtcblx0cmV0dXJuIGtleSA9PSBudWxsID8gdm9pZCAwIDogc2FmZUdldCh0YXJnZXQsIGtleSk7XG59O1xudmFyIGNyZWF0ZVRyaWdnZXJBUEkgPSAocmVnaXN0cnksIGVtaXQsIHRhcmdldCkgPT4ge1xuXHRjb25zdCBhcGkgPSAoa2V5LCBvcE9yT3B0aW9ucywgdHJpZ2dlcikgPT4ge1xuXHRcdGlmICghaXNUcmlnZ2VyRW1pdE9wdGlvbnMob3BPck9wdGlvbnMpKSB0cmlnZ2VyID8/PSBvcE9yT3B0aW9ucztcblx0XHRyZXR1cm4gZW1pdChpc1RyaWdnZXJFbWl0T3B0aW9ucyhrZXkpID8ga2V5IDogaXNUcmlnZ2VyRW1pdE9wdGlvbnMob3BPck9wdGlvbnMsIHRydWUpID8ge1xuXHRcdFx0a2V5LFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdC4uLm9wT3JPcHRpb25zXG5cdFx0fSA6IHtcblx0XHRcdGtleSxcblx0XHRcdHRyaWdnZXI6IHRyaWdnZXIgPz8gb3BPck9wdGlvbnNcblx0XHR9KTtcblx0fTtcblx0Y29uc3QgY29udHJvbCA9IHJlZ2lzdHJ5Py50cmlnZ2VyQ29udHJvbDtcblx0aWYgKGNvbnRyb2wpIE9iamVjdC5hc3NpZ24oYXBpLCBjb250cm9sKTtcblx0YXBpLmN1c3RvbSA9ICh0cmlnZ2VyLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSkgPT4gYXBpKHtcblx0XHRrZXksXG5cdFx0dHJpZ2dlcixcblx0XHR2YWx1ZSxcblx0XHRvbGRWYWx1ZVxuXHR9KTtcblx0aWYgKHRhcmdldCAhPSBudWxsKSBhcGkucmVzb2x2ZWQgPSBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQsIHRydWUpO1xuXHRyZXR1cm4gYXBpO1xufTtcbnZhciBzeXN0ZW1HZXQgPSAodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSkgPT4ge1xuXHRpZiAodGFyZ2V0ID09IG51bGwgfHwgaXNQcmltaXRpdmUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0aWYgKChbXG5cdFx0XCJkZXJlZlwiLFxuXHRcdFwiYmluZFwiLFxuXHRcdFwiQHRhcmdldFwiLFxuXHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0JGV4dHJhY3RLZXkkLFxuXHRcdCRyZWdpc3RyeUtleSRcblx0XS5pbmRleE9mKG5hbWUpIDwgMCA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBudWxsKSAhPSBudWxsKSByZXR1cm4gbnVsbDtcblx0aWYgKFskZXh0cmFjdEtleSQsICRvcmlnaW5hbEtleSRdLmluZGV4T2YobmFtZSkgPj0gMCkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyB0YXJnZXQ7XG5cdGlmIChuYW1lID09ICR2YWx1ZSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKTtcblx0aWYgKG5hbWUgPT0gJHJlZ2lzdHJ5S2V5JCkgcmV0dXJuIHJlZ2lzdHJ5O1xuXHRpZiAobmFtZSA9PSAkcmVzb2x2ZWQgfHwgbmFtZSA9PSBcInJlc29sdmVkXCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIFwicmVzb2x2ZWRcIikpIHJldHVybiBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQpO1xuXHRpZiAobmFtZSA9PSAkdHJpZ2dlckNvbnRyb2wpIHJldHVybiByZWdpc3RyeT8udHJpZ2dlckNvbnRyb2w7XG5cdGlmIChuYW1lID09IFN5bWJvbC5vYnNlcnZhYmxlKSByZXR1cm4gcmVnaXN0cnk/LmNvbXBhdGlibGU7XG5cdGlmIChuYW1lID09IFN5bWJvbC5zdWJzY3JpYmUpIHJldHVybiAoY2IsIHByb3AsIG9wdGlvbnMpID0+IGFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0LCBjYiwgb3B0aW9ucyk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5pdGVyYXRvcikgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5kaXNwb3NlKSByZXR1cm4gKHByb3ApID0+IHtcblx0XHRzYWZlR2V0KHRhcmdldCwgU3ltYm9sLmRpc3Bvc2UpPy4ocHJvcCk7XG5cdFx0dW5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCk7XG5cdH07XG5cdGlmIChuYW1lID09IFN5bWJvbC5hc3luY0Rpc3Bvc2UpIHJldHVybiAocHJvcCkgPT4ge1xuXHRcdHNhZmVHZXQodGFyZ2V0LCBTeW1ib2wuYXN5bmNEaXNwb3NlKT8uKHByb3ApO1xuXHRcdHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHR9O1xuXHRpZiAobmFtZSA9PSBTeW1ib2wudW5zdWJzY3JpYmUpIHJldHVybiAocHJvcCkgPT4gdW5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCk7XG5cdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG59O1xudmFyIG9ic2VydmFibGVBUElNZXRob2RzID0gKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpID0+IHtcblx0aWYgKG5hbWUgPT0gXCJzdWJzY3JpYmVcIikgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlPy5bbmFtZV0gPz8gKChoYW5kbGVyKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBoYW5kbGVyID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGFmZmVjdGVkKHRhcmdldCwgaGFuZGxlcik7XG5cdFx0ZWxzZSBpZiAoXCJuZXh0XCIgaW4gaGFuZGxlciAmJiBoYW5kbGVyPy5uZXh0ICE9IG51bGwpIHtcblx0XHRcdGNvbnN0IHVzdWIgPSBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXI/Lm5leHQpLCBjb21wID0gaGFuZGxlcj8uW1wiY29tcGxldGVcIl07XG5cdFx0XHRoYW5kbGVyW1wiY29tcGxldGVcIl0gPSAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHR1c3ViPy4oKTtcblx0XHRcdFx0cmV0dXJuIGNvbXA/LiguLi5hcmdzKTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gaGFuZGxlcltcImNvbXBsZXRlXCJdO1xuXHRcdH1cblx0fSk7XG59O1xudmFyIE9ic2VydmVBcnJheU1ldGhvZCA9IGNsYXNzIHtcblx0I25hbWU7XG5cdCNzZWxmO1xuXHQjaGFuZGxlO1xuXHRjb25zdHJ1Y3RvcihuYW1lLCBzZWxmLCBoYW5kbGUpIHtcblx0XHR0aGlzLiNuYW1lID0gbmFtZTtcblx0XHR0aGlzLiNzZWxmID0gc2VsZjtcblx0XHR0aGlzLiNoYW5kbGUgPSBoYW5kbGU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgcmVjKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBuYW1lLCByZWMpO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0bGV0IGFkZGVkID0gW10sIHJlbW92ZWQgPSBbXTtcblx0XHRsZXQgc2V0UGFpcnMgPSBbXTtcblx0XHRsZXQgb2xkU3RhdGUgPSBbLi4udGhpcy4jc2VsZl07XG5cdFx0bGV0IGlkeCA9IC0xO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHggfHwgdGhpcy4jc2VsZiwgYXJncyk7XG5cdFx0aWYgKHRoaXMuI2hhbmRsZT8uWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHJldHVybiBvYnNlcnZlQXJyYXkocmVzdWx0KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdHN3aXRjaCAodGhpcy4jbmFtZSkge1xuXHRcdFx0Y2FzZSBcInB1c2hcIjpcblx0XHRcdFx0aWR4ID0gb2xkU3RhdGU/Lmxlbmd0aDtcblx0XHRcdFx0YWRkZWQgPSBhcmdzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJ1bnNoaWZ0XCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGFkZGVkID0gYXJncztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwicG9wXCI6XG5cdFx0XHRcdGlkeCA9IG9sZFN0YXRlPy5sZW5ndGggLSAxO1xuXHRcdFx0XHRpZiAob2xkU3RhdGUubGVuZ3RoID4gMCkgcmVtb3ZlZCA9IFtvbGRTdGF0ZVtpZHhdXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2hpZnRcIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0aWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbb2xkU3RhdGVbaWR4XV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNwbGljZVwiOlxuXHRcdFx0XHRpZHggPSBhcmdzWzBdO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWF4KG9sZFN0YXRlLmxlbmd0aCwgdGhpcy4jc2VsZi5sZW5ndGgpOyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBvbGRWYWx1ZSA9IG9sZFN0YXRlW2ldO1xuXHRcdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gdGhpcy4jc2VsZltpXTtcblx0XHRcdFx0XHRpZiAobmV3VmFsdWUgPT09IHZvaWQgMCAmJiBpID49IHRoaXMuI3NlbGYubGVuZ3RoKSByZW1vdmVkLnB1c2gob2xkVmFsdWUpO1xuXHRcdFx0XHRcdGVsc2UgaWYgKG9sZFZhbHVlID09PSB2b2lkIDAgJiYgaSA+PSBvbGRTdGF0ZS5sZW5ndGgpIHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRcdG5ld1ZhbHVlLFxuXHRcdFx0XHRcdFx0dm9pZCAwLFxuXHRcdFx0XHRcdFx0ZmFsc2Vcblx0XHRcdFx0XHRdKTtcblx0XHRcdFx0XHRlbHNlIGlmIChpc05vdEVxdWFsKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRcdG5ld1ZhbHVlLFxuXHRcdFx0XHRcdFx0b2xkVmFsdWUsXG5cdFx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic29ydFwiOlxuXHRcdFx0Y2FzZSBcImZpbGxcIjpcblx0XHRcdGNhc2UgXCJyZXZlcnNlXCI6XG5cdFx0XHRjYXNlIFwiY29weVdpdGhpblwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG9sZFN0YXRlLmxlbmd0aDsgaSsrKSBpZiAoaXNOb3RFcXVhbChvbGRTdGF0ZVtpXSwgdGhpcy4jc2VsZltpXSkpIHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdGlkeCArIGksXG5cdFx0XHRcdFx0dGhpcy4jc2VsZltpXSxcblx0XHRcdFx0XHRvbGRTdGF0ZVtpXSxcblx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdF0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzZXRcIjpcblx0XHRcdFx0aWR4ID0gYXJnc1sxXTtcblx0XHRcdFx0c2V0UGFpcnMucHVzaChbXG5cdFx0XHRcdFx0aWR4LFxuXHRcdFx0XHRcdGFyZ3NbMF0sXG5cdFx0XHRcdFx0b2xkU3RhdGU/LltpZHhdLFxuXHRcdFx0XHRcdGlkeCBpbiBvbGRTdGF0ZVxuXHRcdFx0XHRdKTtcblx0XHR9XG5cdFx0Y29uc3QgcmVnID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRoaXMuI3NlbGYpO1xuXHRcdGlmIChhZGRlZD8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKGlkeCwgYWRkZWRbMF0sIG51bGwsIFwiYWRkXCIpO1xuXHRcdGVsc2UgaWYgKGFkZGVkPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWc/LnRyaWdnZXI/LihpZHgsIGFkZGVkLCBudWxsLCBcImFkZEFsbFwiKTtcblx0XHRcdGFkZGVkLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZz8udHJpZ2dlcj8uKGlkeCArIEksIGl0ZW0sIG51bGwsIFwiYWRkXCIpKTtcblx0XHR9XG5cdFx0aWYgKHNldFBhaXJzPy5sZW5ndGggPT0gMSkgcmVnPy50cmlnZ2VyPy4oc2V0UGFpcnNbMF0/LlswXSA/PyBpZHgsIHNldFBhaXJzWzBdPy5bMV0sIHNldFBhaXJzWzBdPy5bMl0sIHNldFBhaXJzWzBdPy5bM10gPT09IGZhbHNlID8gXCJhZGRcIiA6IFwic2V0XCIpO1xuXHRcdGVsc2UgaWYgKHNldFBhaXJzPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWc/LnRyaWdnZXI/LihpZHgsIHNldFBhaXJzLCBvbGRTdGF0ZSwgXCJzZXRBbGxcIik7XG5cdFx0XHRzZXRQYWlycy5mb3JFYWNoKChwYWlyLCBJKSA9PiByZWc/LnRyaWdnZXI/LihwYWlyPy5bMF0gPz8gaWR4ICsgSSwgcGFpcj8uWzFdLCBwYWlyPy5bMl0sIHBhaXI/LlszXSA9PT0gZmFsc2UgPyBcImFkZFwiIDogXCJzZXRcIikpO1xuXHRcdH1cblx0XHRpZiAocmVtb3ZlZD8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZFswXSwgXCJkZWxldGVcIik7XG5cdFx0ZWxzZSBpZiAocmVtb3ZlZD8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBudWxsLCByZW1vdmVkLCBcImRlbGV0ZUFsbFwiKTtcblx0XHRcdHJlbW92ZWQuZm9yRWFjaCgoaXRlbSwgSSkgPT4gcmVnPy50cmlnZ2VyPy4oaWR4ICsgSSwgbnVsbCwgaXRlbSwgXCJkZWxldGVcIikpO1xuXHRcdH1cblx0XHRpZiAocmVzdWx0ID09IHRhcmdldCkgcmV0dXJuIG5ldyBQcm94eShyZXN1bHQsIHRoaXMuI2hhbmRsZSk7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkgcmV0dXJuIG9ic2VydmVBcnJheShyZXN1bHQpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn07XG52YXIgdHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UgPSAoc2VsZiwgdGFyZ2V0LCBvbGRMZW4sIG5ld0xlbikgPT4ge1xuXHRjb25zdCByZW1vdmVkSXRlbXMgPSBOdW1iZXIuaXNJbnRlZ2VyKG9sZExlbikgJiYgTnVtYmVyLmlzSW50ZWdlcihuZXdMZW4pICYmIG5ld0xlbiA8IG9sZExlbiA/IHRhcmdldC5zbGljZShuZXdMZW4sIG9sZExlbikgOiBbXTtcblx0aWYgKCFzZWxmWyR0cmlnZ2VyTG9ja10gJiYgb2xkTGVuICE9PSBuZXdMZW4pIHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHRcdGlmIChyZW1vdmVkSXRlbXMubGVuZ3RoID09PSAxKSByZWdpc3RyeT8udHJpZ2dlcj8uKG5ld0xlbiwgbnVsbCwgcmVtb3ZlZEl0ZW1zWzBdLCBcImRlbGV0ZVwiKTtcblx0XHRlbHNlIGlmIChyZW1vdmVkSXRlbXMubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtcywgXCJkZWxldGVBbGxcIik7XG5cdFx0XHRyZW1vdmVkSXRlbXMuZm9yRWFjaCgoaXRlbSwgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4gKyBJLCBudWxsLCBpdGVtLCBcImRlbGV0ZVwiKSk7XG5cdFx0fVxuXHRcdGNvbnN0IGFkZGVkQ291bnQgPSBOdW1iZXIuaXNJbnRlZ2VyKG9sZExlbikgJiYgTnVtYmVyLmlzSW50ZWdlcihuZXdMZW4pICYmIG5ld0xlbiA+IG9sZExlbiA/IG5ld0xlbiAtIG9sZExlbiA6IDA7XG5cdFx0aWYgKGFkZGVkQ291bnQgPT09IDEpIHJlZ2lzdHJ5Py50cmlnZ2VyPy4ob2xkTGVuLCB2b2lkIDAsIG51bGwsIFwiYWRkXCIpO1xuXHRcdGVsc2UgaWYgKGFkZGVkQ291bnQgPiAxKSB7XG5cdFx0XHRjb25zdCBhZGRlZCA9IEFycmF5KGFkZGVkQ291bnQpLmZpbGwodm9pZCAwKTtcblx0XHRcdHJlZ2lzdHJ5Py50cmlnZ2VyPy4ob2xkTGVuLCBhZGRlZCwgbnVsbCwgXCJhZGRBbGxcIik7XG5cdFx0XHRhZGRlZC5mb3JFYWNoKChfLCBJKSA9PiByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiArIEksIHZvaWQgMCwgbnVsbCwgXCJhZGRcIikpO1xuXHRcdH1cblx0fVxufTtcbnZhciBPYnNlcnZlQXJyYXlIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRoYXModGFyZ2V0LCBuYW1lKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSk7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgcmVjKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gc2FmZUdldCh0YXJnZXQsIG5hbWUpPy5iaW5kPy4odGFyZ2V0KSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5Py5nZXQ/Lih0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZSA/PyAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiBzYWZlR2V0KHRhcmdldCwga2V5KSk7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IHZvaWQgMCk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gXCJAdGFyZ2V0XCIgfHwgbmFtZSA9PSAkZXh0cmFjdEtleSQpIHJldHVybiB0YXJnZXQ7XG5cdFx0aWYgKG5hbWUgPT0gXCJ4XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py54ID8/IHRhcmdldD8uWzBdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ5XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py55ID8/IHRhcmdldD8uWzFdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ6XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py56ID8/IHRhcmdldD8uWzJdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ3XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py53ID8/IHRhcmdldD8uWzNdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5yID8/IHRhcmdldD8uWzBdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJnXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5nID8/IHRhcmdldD8uWzFdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJiXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5iID8/IHRhcmdldD8uWzJdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5hID8/IHRhcmdldD8uWzNdO1xuXHRcdH07XG5cdFx0Y29uc3QgZ290ID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IChuYW1lID09IFwidmFsdWVcIiA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpIDogbnVsbCk7XG5cdFx0aWYgKHR5cGVvZiBnb3QgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbmV3IFByb3h5KHR5cGVvZiBnb3QgPT0gXCJmdW5jdGlvblwiID8gZ290Py5iaW5kPy4odGFyZ2V0KSA6IGdvdCwgbmV3IE9ic2VydmVBcnJheU1ldGhvZChuYW1lLCB0YXJnZXQsIHRoaXMpKTtcblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KG5hbWUpKSkgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGNvbnN0IHBlbmRpbmcgPSBpc1Byb21pc2UodmFsdWUpO1xuXHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0Y29uc3QgeHl6dyA9IFtcblx0XHRcdFx0XCJ4XCIsXG5cdFx0XHRcdFwieVwiLFxuXHRcdFx0XHRcInpcIixcblx0XHRcdFx0XCJ3XCJcblx0XHRcdF07XG5cdFx0XHRjb25zdCByZ2JhID0gW1xuXHRcdFx0XHRcInJcIixcblx0XHRcdFx0XCJnXCIsXG5cdFx0XHRcdFwiYlwiLFxuXHRcdFx0XHRcImFcIlxuXHRcdFx0XTtcblx0XHRcdGNvbnN0IHh5endfaWR4ID0geHl6dy5pbmRleE9mKG5hbWUpO1xuXHRcdFx0Y29uc3QgcmdiYV9pZHggPSByZ2JhLmluZGV4T2YobmFtZSk7XG5cdFx0XHRsZXQgZ290ID0gZmFsc2U7XG5cdFx0XHRpZiAoeHl6d19pZHggPj0gMCkgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCB4eXp3X2lkeCwgdik7XG5cdFx0XHRlbHNlIGlmIChyZ2JhX2lkeCA+PSAwKSBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHJnYmFfaWR4LCB2KTtcblx0XHRcdGVsc2UgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2KTtcblx0XHRcdGlmIChuYW1lID09IFwibGVuZ3RoXCIpIHtcblx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2xkLCB2KSkgdHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UodGhpcywgdGFyZ2V0LCBvbGQsIHYpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0XHRpZiAoaXNOb3RFcXVhbChvbGQsIHYpKSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIHYsIG9sZCwgXCJzZXRcIik7XG5cdFx0XHRcdGlmIChwZW5kaW5nKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBuYW1lLCB2LCBvbGQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGdvdDtcblx0XHR9KTtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAodHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0aWYgKE51bWJlci5pc0ludGVnZXIocGFyc2VJbnQobmFtZSkpKSBuYW1lID0gcGFyc2VJbnQobmFtZSkgPz8gbmFtZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGNvbnN0IG9sZCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCBnb3QgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgbmFtZSAhPSBcImxlbmd0aFwiICYmIG5hbWUgIT0gJHRyaWdnZXJMb2NrICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChvbGQgIT0gbnVsbCkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCBuYW1lLCBvbGQsIFwiZGVsZXRlXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG59O1xudmFyIE9ic2VydmVPYmplY3RIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiLFxuXHRcdFx0XCJ0aGVuXCIsXG5cdFx0XHRcImNhdGNoXCIsXG5cdFx0XHRcImZpbmFsbHlcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IHRyaWdnZXJLZXlPZih0YXJnZXQsIG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZSA/PyByZWFsUHJvcE9mJDEodGFyZ2V0KSA/PyBcInZhbHVlXCIpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiBrZXkgPT0gXCJ2YWx1ZVwiIHx8IGtleSA9PSByZWFsUHJvcE9mJDEodGFyZ2V0KSA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpIDogdm9pZCAwKTtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gdHJpZ2dlclZhbHVlT2YodGFyZ2V0LCBrZXkpKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBTeW1ib2wudG9QcmltaXRpdmUpIHJldHVybiAoaGludCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LihoaW50KTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiB0cnlQYXJzZUJ5SGludChmdCwgaGludCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiB0cnlQYXJzZUJ5SGludChzYWZlR2V0KGZ0LCBcInZhbHVlXCIpLCBoaW50KTtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludChzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0LCBoaW50KTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFN5bWJvbC50b1N0cmluZ1RhZykgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBTdHJpbmcoZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwidG9TdHJpbmdcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBTeW1ib2wudG9TdHJpbmdUYWcpKSByZXR1cm4gc2FmZUdldChmdCwgU3ltYm9sLnRvU3RyaW5nVGFnKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gU3RyaW5nKGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0cmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInZhbHVlT2ZcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBTeW1ib2wudG9QcmltaXRpdmUpKSByZXR1cm4gc2FmZUdldChmdCwgU3ltYm9sLnRvUHJpbWl0aXZlKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gZnQ7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBzYWZlR2V0KGZ0LCBcInZhbHVlXCIpO1xuXHRcdFx0cmV0dXJuIHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQ7XG5cdFx0fTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdHJldHVybiBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0Py5bU3ltYm9sLmZvcihcIkBAYXBwbHlcIildPy5iaW5kPy4odGFyZ2V0Py5bU3ltYm9sLmZvcihcIkBAYXBwbHlcIildID8/IHRhcmdldCkgPz8gdGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBwcm9wIGluIHRhcmdldDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmModmFsdWUsICh2KSA9PiB7XG5cdFx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh2LCBuYW1lKTtcblx0XHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7XG5cdFx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0ICRvcmlnaW5hbCA9IHRhcmdldDtcblx0XHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmICEoc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgbmFtZSBpbiB0YXJnZXQpKSByZXR1cm47XG5cdFx0XHRjb25zdCB0cmlnZ2VyTmFtZSA9IHRyaWdnZXJLZXlPZih0YXJnZXQsIG5hbWUpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBuYW1lID09IFwidmFsdWVcIiA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpID8/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRcdHRhcmdldFtuYW1lXSA9IHY7XG5cdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyB2O1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0XHRjb25zdCBzdWJzY3JpcHQgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQoJG9yaWdpbmFsKTtcblx0XHRcdFx0aWYgKChzYWZlR2V0KHRhcmdldCwgJGlzTm90RXF1YWwpID8/IGlzTm90RXF1YWwpPy4ob2xkVmFsdWUsIG5ld1ZhbHVlKSkgc3Vic2NyaXB0Py50cmlnZ2VyPy4odHJpZ2dlck5hbWUsIHYsIG9sZFZhbHVlKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCgkb3JpZ2luYWwsIHRyaWdnZXJOYW1lLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9KTtcblx0fVxuXHRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiBkZXNjcmlwdG9yLnZhbHVlKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIWRlc2NyaXB0b3IudmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICFkZXNjcmlwdG9yLnZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRpZiAoZGVzY3JpcHRvci5nZXQgPT0gdm9pZCAwICYmIGRlc2NyaXB0b3Iuc2V0ID09IHZvaWQgMCkgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCAkcmVzdWx0ID0gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHtcblx0XHRcdGdldDogZGVzY3JpcHRvci5nZXQsXG5cdFx0XHRzZXQ6IGRlc2NyaXB0b3Iuc2V0LFxuXHRcdFx0ZW51bWVyYWJsZTogZGVzY3JpcHRvci5lbnVtZXJhYmxlID8/IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID8/IHRydWVcblx0XHR9KTtcblx0XHRzYWZlU2V0KHRhcmdldCwgbmFtZSwgb2xkVmFsdWUpO1xuXHRcdHJldHVybiAkcmVzdWx0O1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG5hbWUgIT0gJHRyaWdnZXJMb2NrICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZU1hcEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdO1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGdldCh0YXJnZXQsIG5hbWUsIGN0eCkge1xuXHRcdGlmIChbXG5cdFx0XHQkZXh0cmFjdEtleSQsXG5cdFx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdFx0XCJAdGFyZ2V0XCIsXG5cdFx0XHRcImRlcmVmXCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCAkZXh0cmFjdEtleSQpID8/IHNhZmVHZXQodGFyZ2V0LCAkb3JpZ2luYWxLZXkkKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3QgdmFsdWVPckZ4ID0gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSk7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHZhbHVlT3JGeDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWU7XG5cdFx0XHRpZiAoa2V5ID09IG51bGwpIHJldHVybjtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gdGFyZ2V0LmdldChrZXkpKTtcblx0XHRcdGlmICh2YWx1ZSA9PSBudWxsICYmICFoYXNPd24ob3B0aW9ucywgXCJ2YWx1ZVwiKSkgcmV0dXJuO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiY2xlYXJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlcyA9IEFycmF5LmZyb20odGFyZ2V0Py5lbnRyaWVzPy4oKSB8fCBbXSksIHJlc3VsdCA9IHZhbHVlT3JGeCgpO1xuXHRcdFx0b2xkVmFsdWVzLmZvckVhY2goKFtwcm9wLCBvbGRWYWx1ZV0pID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4ocHJvcCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJkZWxldGVcIikgcmV0dXJuIChwcm9wLCBfID0gbnVsbCkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyhwcm9wKSwgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCk7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBoYWQpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4ocHJvcCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwic2V0XCIpIHJldHVybiAocHJvcCwgdmFsdWUpID0+IHBvdGVudGlhbGx5QXN5bmNNYXAodmFsdWUsICh2KSA9PiB7XG5cdFx0XHRjb25zdCBoYWQgPSB0YXJnZXQuaGFzKHByb3ApLCBvbGRWYWx1ZSA9IHRhcmdldC5nZXQocHJvcCksIHJlc3VsdCA9IHZhbHVlT3JGeChwcm9wLCB2KTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdGlmICghaGFkIHx8IGlzTm90RXF1YWwob2xkVmFsdWUsIHYpKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIHYsIGhhZCA/IG9sZFZhbHVlIDogbnVsbCwgaGFkID8gXCJzZXRcIiA6IFwiYWRkXCIpO1xuXHRcdFx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgZW1pdFJlc29sdmVkKHRhcmdldCwgcHJvcCwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9KTtcblx0XHRpZiAobmFtZSA9PSBcImdldE9ySW5zZXJ0XCIgfHwgbmFtZSA9PSBcImdldE9ySW5zZXJ0Q29tcHV0ZWRcIikge1xuXHRcdFx0Y29uc3QgY29tcHV0ZWQgPSBuYW1lID09IFwiZ2V0T3JJbnNlcnRDb21wdXRlZFwiO1xuXHRcdFx0cmV0dXJuIChrZXksIGRlZmF1bHRPckNvbXB1dGUpID0+IHtcblx0XHRcdFx0aWYgKHRhcmdldC5oYXMoa2V5KSkgcmV0dXJuIHRhcmdldC5nZXQoa2V5KTtcblx0XHRcdFx0Y29uc3QgaW5jb21pbmcgPSBjb21wdXRlZCA/IHR5cGVvZiBkZWZhdWx0T3JDb21wdXRlID09IFwiZnVuY3Rpb25cIiA/IGRlZmF1bHRPckNvbXB1dGUoa2V5KSA6IGRlZmF1bHRPckNvbXB1dGUgOiBkZWZhdWx0T3JDb21wdXRlO1xuXHRcdFx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luY01hcChpbmNvbWluZywgKHYpID0+IHtcblx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSB0eXBlb2YgdGFyZ2V0LmdldE9ySW5zZXJ0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldC5nZXRPckluc2VydChrZXksIHYpIDogKHRhcmdldC5zZXQoa2V5LCB2KSwgdGFyZ2V0LmdldChrZXkpKTtcblx0XHRcdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRcdFx0c3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihrZXksIHYsIG51bGwsIFwiYWRkXCIpO1xuXHRcdFx0XHRcdFx0aWYgKGlzUHJvbWlzZShpbmNvbWluZykpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIGtleSwgdiwgbnVsbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciBPYnNlcnZlU2V0SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja10gPSBmYWxzZTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHR0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgJGV4dHJhY3RLZXkkKSA/PyBzYWZlR2V0KHRhcmdldCwgJG9yaWdpbmFsS2V5JCkgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiB2YWx1ZU9yRng7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lO1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm47XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRhcmdldC5oYXMoa2V5KSk7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IHZvaWQgMCk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gXCJjbGVhclwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWVzID0gQXJyYXkuZnJvbSh0YXJnZXQ/LnZhbHVlcz8uKCkgfHwgW10pLCByZXN1bHQgPSB2YWx1ZU9yRngoKTtcblx0XHRcdG9sZFZhbHVlcy5mb3JFYWNoKChvbGRWYWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihudWxsLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImRlbGV0ZVwiKSByZXR1cm4gKHZhbHVlKSA9PiB7XG5cdFx0XHRjb25zdCBoYWQgPSB0YXJnZXQuaGFzKHZhbHVlKSwgb2xkVmFsdWUgPSBoYWQgPyB2YWx1ZSA6IG51bGwsIHJlc3VsdCA9IHZhbHVlT3JGeCh2YWx1ZSk7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBoYWQpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4odmFsdWUsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImFkZFwiKSByZXR1cm4gKHZhbHVlKSA9PiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2KSwgb2xkVmFsdWUgPSBoYWQgPyB2IDogbnVsbCwgcmVzdWx0ID0gdmFsdWVPckZ4KHYpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0aWYgKCFoYWQpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4odiwgdiwgb2xkVmFsdWUsIFwiYWRkXCIpO1xuXHRcdFx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgZW1pdFJlc29sdmVkKHRhcmdldCwgdiwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9KTtcblx0XHRyZXR1cm4gdmFsdWVPckZ4O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpO1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuXHRcdGxldCBnb3QgPSB2b2lkIDA7XG5cdFx0dHJ5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG5cdFx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIGdvdCA9IHZvaWQgMDtcblx0XHRcdGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRnb3QgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG59O1xudmFyICRpc09ic2VydmFibGUgPSAodGFyZ2V0KSA9PiB7XG5cdHJldHVybiAhISgodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSAmJiB0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSB8fCB0YXJnZXQ/LlskYWZmZWN0ZWRdKSk7XG59O1xudmFyIG9ic2VydmVBcnJheSA9IChhcnIpID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUoYXJyKSkgcmV0dXJuIGFycjtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChhcnIsIG5ldyBPYnNlcnZlQXJyYXlIYW5kbGVyKCkpLCBhcnIpO1xufTtcbnZhciBvYnNlcnZlT2JqZWN0ID0gKG9iaikgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShvYmopKSByZXR1cm4gb2JqO1xuXHRyZXR1cm4gYmluZEV4aXN0aW5nVGhlbmFibGVzKHdyYXBXaXRoKG9iaiwgbmV3IE9ic2VydmVPYmplY3RIYW5kbGVyKCkpLCBvYmopO1xufTtcbnZhciBvYnNlcnZlTWFwID0gKG1hcCkgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShtYXApKSByZXR1cm4gbWFwO1xuXHRyZXR1cm4gYmluZEV4aXN0aW5nVGhlbmFibGVzKHdyYXBXaXRoKG1hcCwgbmV3IE9ic2VydmVNYXBIYW5kbGVyKCkpLCBtYXApO1xufTtcbnZhciBvYnNlcnZlU2V0ID0gKHNldCkgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShzZXQpKSByZXR1cm4gc2V0O1xuXHRyZXR1cm4gd3JhcFdpdGgoc2V0LCBuZXcgT2JzZXJ2ZVNldEhhbmRsZXIoKSk7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9QcmltaXRpdmVzLnRzXG52YXIgbnVtYmVyUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogaXNQcm9taXNlID8gMCA6IE51bWJlcihkZXJlZihpbml0aWFsKSB8fCAwKSB8fCAwLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXM/LlskdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KCh0eXBlb2YgdGhpcz8uWyR2YWx1ZV0gIT0gXCJvYmplY3RcIiA/IHRoaXM/LlskdmFsdWVdIDogdGhpcz8uWyR2YWx1ZV0/LnZhbHVlIHx8IDApID8/IDAsIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9ICh2ICE9IG51bGwgJiYgIU51bWJlci5pc05hTih2KSA/IE51bWJlcih2KSA6IHRoaXNbJHZhbHVlXSkgfHwgMDtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiBOdW1iZXIodGhpc1skdmFsdWVdIHx8IDApIHx8IDA7XG5cdFx0fVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgc3RyaW5nUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogKGlzUHJvbWlzZSA/IFwiXCIgOiBTdHJpbmcoZGVyZWYodHlwZW9mIGluaXRpYWwgPT0gXCJudW1iZXJcIiA/IFN0cmluZyhpbml0aWFsKSA6IGluaXRpYWwgfHwgXCJcIikpKSA/PyBcIlwiLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXM/LlskdmFsdWVdID8/IFwiXCIpID8/IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHRoaXM/LlskdmFsdWVdID8/IFwiXCIsIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9IFN0cmluZyh0eXBlb2YgdiA9PSBcIm51bWJlclwiID8gU3RyaW5nKHYpIDogdiB8fCBcIlwiKSA/PyBcIlwiO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzWyR2YWx1ZV0gPz8gXCJcIikgPz8gXCJcIjtcblx0XHR9XG5cdH0pO1xuXHRpbml0aWFsPy50aGVuPy4oKHYpID0+IHtcblx0XHQkci52YWx1ZSA9IHY7XG5cdFx0JHJbJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZTogdixcblx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciBib29sZWFuUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogKGlzUHJvbWlzZSA/IGZhbHNlIDogKGRlcmVmKGluaXRpYWwpICE9IG51bGwgPyB0eXBlb2YgZGVyZWYoaW5pdGlhbCkgPT0gXCJzdHJpbmdcIiA/IHRydWUgOiAhIWRlcmVmKGluaXRpYWwpIDogZmFsc2UpIHx8IGZhbHNlKSB8fCBmYWxzZSxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCghIXRoaXM/LlskdmFsdWVdIHx8IGZhbHNlLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsID8gdHlwZW9mIHYgPT0gXCJzdHJpbmdcIiA/IHRydWUgOiAhIXYgOiB0aGlzWyR2YWx1ZV0pIHx8IGZhbHNlO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSB8fCBmYWxzZTtcblx0XHR9XG5cdH0pO1xuXHRpbml0aWFsPy50aGVuPy4oKHYpID0+IHtcblx0XHQkci52YWx1ZSA9IHY7XG5cdFx0JHJbJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZTogdixcblx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciB3cmFwUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHRoaXMudmFsdWUsIGhpbnQpO1xuXHRcdH0sXG5cdFx0dmFsdWU6IGlzUHJvbWlzZSA/IG51bGwgOiBkZXJlZihpbml0aWFsKVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdGFmZmVjdGVkKGluaXRpYWwsICh2KSA9PiB7XG5cdFx0JHI/LlskdHJpZ2dlcl0/LigpO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciBtYXJrUmVhbFByb3AgPSAodGFyZ2V0LCByZWFsUHJvcCkgPT4ge1xuXHRpZiAodGFyZ2V0ID09IG51bGwgfHwgdHlwZW9mIHRhcmdldCAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiB0YXJnZXQgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdGFyZ2V0O1xuXHR0cnkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsICRyZWFsUHJvcCwge1xuXHRcdFx0dmFsdWU6IHJlYWxQcm9wLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhcmdldFskcmVhbFByb3BdID0gcmVhbFByb3A7XG5cdFx0fSBjYXRjaCB7fVxuXHR9XG5cdHRyeSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgXCJyZWFsUHJvcFwiLCB7XG5cdFx0XHR2YWx1ZTogcmVhbFByb3AsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHR9IGNhdGNoIHtcblx0XHR0cnkge1xuXHRcdFx0dGFyZ2V0LnJlYWxQcm9wID0gcmVhbFByb3A7XG5cdFx0fSBjYXRjaCB7fVxuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIHByb3BSZWYgPSAoc3JjLCBzcmNQcm9wID0gXCJ2YWx1ZVwiLCBpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUoc3JjKSB8fCAhc3JjKSByZXR1cm4gc3JjO1xuXHRpZiAoQXJyYXkuaXNBcnJheShzcmMpICYmIHNyYy5sZW5ndGggPT0gMiAmJiBzcmNbMF0gIT0gbnVsbCAmJiAoc3JjWzBdIGluc3RhbmNlb2YgTWFwIHx8IHNyY1swXSBpbnN0YW5jZW9mIFdlYWtNYXAgfHwgc3JjWzBdIGluc3RhbmNlb2YgU2V0IHx8IHNyY1swXSBpbnN0YW5jZW9mIFdlYWtTZXQpKSB7XG5cdFx0aWYgKHNyY1Byb3AgPT0gbnVsbCB8fCBzcmNQcm9wID09PSBcInZhbHVlXCIpIHNyY1Byb3AgPSBzcmNbMV07XG5cdFx0c3JjID0gc3JjWzBdO1xuXHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc3JjKSAmJiAhaXNBcnJheUludmFsaWRLZXkoc3JjPy5bMV0sIHNyYykgJiYgKEFycmF5LmlzQXJyYXkoc3JjPy5bMF0pIHx8IHR5cGVvZiBzcmM/LlswXSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzcmM/LlswXSA9PSBcImZ1bmN0aW9uXCIpKSBzcmMgPSBzcmM/LlswXTtcblx0Y29uc3QgaXNNYXAgPSBzcmMgaW5zdGFuY2VvZiBNYXAgfHwgc3JjIGluc3RhbmNlb2YgV2Vha01hcCB8fCB0eXBlb2Ygc3JjPy5nZXQgPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBzcmM/LnNldCA9PSBcImZ1bmN0aW9uXCIgJiYgKHR5cGVvZiBzcmM/LmRlbGV0ZSA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHNyYz8ucmVtb3ZlID09IFwiZnVuY3Rpb25cIik7XG5cdGNvbnN0IGlzU2V0ID0gc3JjIGluc3RhbmNlb2YgU2V0IHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtTZXQgfHwgdHlwZW9mIHNyYz8uaGFzID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc3JjPy5hZGQgPT0gXCJmdW5jdGlvblwiICYmICh0eXBlb2Ygc3JjPy5kZWxldGUgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBzcmM/LnJlbW92ZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRpZiAoaXNNYXAgfHwgaXNTZXQpIHtcblx0XHRpZiAoc3JjUHJvcCA9PSBudWxsKSByZXR1cm47XG5cdH0gZWxzZSBpZiAoKHNyY1Byb3AgPz89IEFycmF5LmlzQXJyYXkoc3JjKSA/IG51bGwgOiBcInZhbHVlXCIpID09IG51bGwgfHwgaXNBcnJheUludmFsaWRLZXkoc3JjUHJvcCwgc3JjKSkgcmV0dXJuO1xuXHRjb25zdCByZWFkU2xvdCA9ICgpID0+IHtcblx0XHRpZiAoaXNNYXApIHJldHVybiBzcmM/LmdldD8uKHNyY1Byb3ApO1xuXHRcdGlmIChpc1NldCkgcmV0dXJuIHNyYz8uaGFzPy4oc3JjUHJvcCkgPyBzcmNQcm9wIDogbnVsbDtcblx0XHRyZXR1cm4gc3JjPy5bc3JjUHJvcF07XG5cdH07XG5cdGNvbnN0IHdyaXRlU2xvdCA9ICh2KSA9PiB7XG5cdFx0aWYgKGlzTWFwKSB7XG5cdFx0XHRjb25zdCBtYXAgPSBzcmM7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbCh2LCBtYXA/LmdldD8uKHNyY1Byb3ApKSkgbWFwPy5zZXQ/LihzcmNQcm9wLCB2KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRpZiAoaXNTZXQpIHtcblx0XHRcdGNvbnN0IHNldCA9IHNyYztcblx0XHRcdGNvbnN0IG1lbWJlciA9IHYgPz8gc3JjUHJvcDtcblx0XHRcdGlmIChtZW1iZXIgPT0gbnVsbCkge1xuXHRcdFx0XHRzZXQ/LmRlbGV0ZT8uKHNyY1Byb3ApO1xuXHRcdFx0XHRyZXR1cm4gbWVtYmVyO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFzZXQ/Lmhhcz8uKG1lbWJlcikpIHNldD8uYWRkPy4obWVtYmVyKTtcblx0XHRcdHJldHVybiBtZW1iZXI7XG5cdFx0fVxuXHRcdGlmIChpc05vdEVxdWFsKHYsIHNyYz8uW3NyY1Byb3BdKSkgc3JjW3NyY1Byb3BdID0gdjtcblx0XHRyZXR1cm4gdjtcblx0fTtcblx0aWYgKGlzTWFwICYmIGluaXRpYWwgIT09IHZvaWQgMCAmJiAhc3JjPy5oYXM/LihzcmNQcm9wKSkgc3JjPy5zZXQ/LihzcmNQcm9wLCBpbml0aWFsKTtcblx0ZWxzZSBpZiAoaXNTZXQgJiYgaW5pdGlhbCAmJiAhc3JjPy5oYXM/LihzcmNQcm9wKSkgc3JjPy5hZGQ/LihzcmNQcm9wKTtcblx0Y29uc3QgY3VycmVudCA9IHJlYWRTbG90KCk7XG5cdGlmICghaXNTZXQgJiYgc3JjUHJvcCAhPSBudWxsICYmIGhhc1ZhbHVlKGN1cnJlbnQpICYmIGlzT2JzZXJ2YWJsZShjdXJyZW50KSkgcmV0dXJuIG1hcmtSZWFsUHJvcChyZWNvdmVyUmVhY3RpdmUoY3VycmVudCksIHNyY1Byb3ApO1xuXHRpZiAoIWlzTWFwICYmICFpc1NldCAmJiBzcmNQcm9wICYmIHR5cGVvZiBzcmM/LmdldFByb3BlcnR5ID09IFwiZnVuY3Rpb25cIiAmJiBpc09ic2VydmFibGUoc3JjPy5nZXRQcm9wZXJ0eT8uKHNyY1Byb3ApKSkgcmV0dXJuIG1hcmtSZWFsUHJvcChzcmM/LmdldFByb3BlcnR5Py4oc3JjUHJvcCksIHNyY1Byb3ApO1xuXHRpZiAoIWlzTWFwICYmICFpc1NldCkgc3JjW3NyY1Byb3BdID8/PSBpbml0aWFsID8/IHNyYz8uW3NyY1Byb3BdO1xuXHRlbHNlIGlmIChpc01hcCAmJiBpc05vdEVxdWFsKGluaXRpYWwgPz8gc3JjPy5nZXQ/LihzcmNQcm9wKSwgc3JjPy5nZXQ/LihzcmNQcm9wKSkpIHNyYz8uc2V0Py4oc3JjUHJvcCwgaW5pdGlhbCA/PyBzcmM/LmdldD8uKHNyY1Byb3ApKTtcblx0ZWxzZSBpZiAoaXNTZXQgJiYgc3JjPy5oYXM/Lihpbml0aWFsID8/IHNyY1Byb3ApKSBzcmM/LmFkZD8uKGluaXRpYWwgPz8gc3JjUHJvcCk7XG5cdGNvbnN0IHIgPSBvYnNlcnZlKHtcblx0XHRbJHZhbHVlXTogaXNTZXQgPyByZWFkU2xvdCgpIDogcmVhZFNsb3QoKSA/PyBpbml0aWFsLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHJlYWRTbG90KCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHJlYWRTbG90KCksIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHJbJHRyaWdnZXJMb2NrJDFdID0gdHJ1ZTtcblx0XHRcdGlmIChpc1NldCkgdGhpc1skdmFsdWVdID0gd3JpdGVTbG90KHYpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnN0IG5leHQgPSB2ID8/IGRlZmF1bHRCeVR5cGUocmVhZFNsb3QoKSk7XG5cdFx0XHRcdHRoaXNbJHZhbHVlXSA9IHdyaXRlU2xvdChuZXh0KTtcblx0XHRcdH1cblx0XHRcdHJbJHRyaWdnZXJMb2NrJDFdID0gZmFsc2U7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRjb25zdCBzbG90ID0gcmVhZFNsb3QoKTtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gPSBzbG90ID8/IHRoaXNbJHZhbHVlXTtcblx0XHR9XG5cdH0pO1xuXHRtYXJrUmVhbFByb3Aociwgc3JjUHJvcCk7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKHNyYywgKHYsIF9wcm9wLCBvbGQsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoX3Byb3AgIT0gc3JjUHJvcCkgcmV0dXJuO1xuXHRcdGlmIChyWyR0cmlnZ2VyTG9jayQxXSkgcmV0dXJuO1xuXHRcdGNvbnN0IG5leHQgPSBpc1NldCA/IHJlYWRTbG90KCkgOiB2O1xuXHRcdGNvbnN0IHByZXYgPSByWyR2YWx1ZV07XG5cdFx0clskdmFsdWVdID0gbmV4dDtcblx0XHRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IG5leHQsXG5cdFx0XHRvbGRWYWx1ZTogb2xkID8/IHByZXYsXG5cdFx0XHR0cmlnZ2VyOiB0cmlnZ2VyID8/IFwic2V0XCJcblx0XHR9KTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHIsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcjtcbn07XG52YXIgJHJlZiA9ICh0eXBlZCwgYmVoYXZpb3IpID0+IHtcblx0c3dpdGNoICh0eXBlb2YgdHlwZWQpIHtcblx0XHRjYXNlIFwiYm9vbGVhblwiOiByZXR1cm4gYm9vbGVhblJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJudW1iZXJcIjogcmV0dXJuIG51bWJlclJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJzdHJpbmdcIjogcmV0dXJuIHN0cmluZ1JlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJvYmplY3RcIjogaWYgKHR5cGVkICE9IG51bGwpIHJldHVybiB3cmFwUmVmKG9ic2VydmUodHlwZWQpLCBiZWhhdmlvcik7XG5cdFx0ZGVmYXVsdDogcmV0dXJuIHdyYXBSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0fVxufTtcbnZhciByZWYgPSAodHlwZWQsIHByb3AgPSBcInZhbHVlXCIsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0ICRyID0gaXNPYnNlcnZhYmxlKHR5cGVkKSA/IHR5cGVkIDogJHJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRpZiAocHJvcCAhPSBudWxsKSByZXR1cm4gcHJvcFJlZigkciwgcHJvcCwgYmVoYXZpb3IpO1xuXHRlbHNlIHJldHVybiAkcjtcbn07XG52YXIgcHJvbWlzZWQgPSAocHJvbWlzZSwgYmVoYXZpb3IpID0+IHtcblx0cmV0dXJuIHJlZihwcm9taXNlLCBiZWhhdmlvcik7XG59O1xudmFyIHRyaWdnZXJXaXRoRGVsYXkgPSAocmVmLCBjYiwgZGVsYXkgPSAxMDApID0+IHtcblx0aWYgKHJlZj8udmFsdWUgPz8gcmVmKSByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0aWYgKHJlZi52YWx1ZSkgY2I/LigpO1xuXHR9LCBkZWxheSk7XG59O1xudmFyIGRlbGF5ZWRCZWhhdmlvciA9IChkZWxheSA9IDEwMCkgPT4ge1xuXHRyZXR1cm4gKGNiLCBbdmFsXSwgW3NpZ10pID0+IHtcblx0XHRsZXQgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHZhbCwgY2IsIGRlbGF5KTtcblx0XHRzaWc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImFib3J0XCIsICgpID0+IHtcblx0XHRcdGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKTtcblx0XHR9LCB7IG9uY2U6IHRydWUgfSk7XG5cdH07XG59O1xudmFyIGRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciA9IChkZWxheSA9IDEwMCkgPT4ge1xuXHRyZXR1cm4gKGNiLCBbdmFsXSwgW3NpZ10pID0+IHtcblx0XHRsZXQgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHZhbCwgY2IsIGRlbGF5KTtcblx0XHRzaWc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImFib3J0XCIsICgpID0+IHtcblx0XHRcdGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKTtcblx0XHR9LCB7IG9uY2U6IHRydWUgfSk7XG5cdFx0aWYgKCF0bSkgY2I/LigpO1xuXHR9O1xufTtcbmZ1bmN0aW9uIG9ic2VydmUodGFyZ2V0LCBzdGF0ZU5hbWUpIHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJzeW1ib2xcIiB8fCAhKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgfHwgJGlzT2JzZXJ2YWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRpZiAoKHRhcmdldCA9IGRlcmVmPy4odGFyZ2V0KSkgPT0gbnVsbCB8fCB0YXJnZXQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHRhcmdldCBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgJGlzT2JzZXJ2YWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRjb25zdCB1bndyYXAgPSB0YXJnZXQ7XG5cdGlmICh1bndyYXAgPT0gbnVsbCB8fCB0eXBlb2YgdW53cmFwID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIpIHx8IHVud3JhcCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha1JlZikgcmV0dXJuIHVud3JhcDtcblx0bGV0IHJlYWN0aXZlID0gdW53cmFwO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh1bndyYXApKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlQXJyYXkodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodW53cmFwIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlTWFwKHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZVNldCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVPYmplY3QodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH1cblx0cmV0dXJuIHJlYWN0aXZlO1xufVxudmFyIGlzT2JzZXJ2YWJsZSA9ICh0YXJnZXQpID0+IHtcblx0aWYgKHR5cGVvZiBIVE1MSW5wdXRFbGVtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuIHRydWU7XG5cdHJldHVybiAhISgodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSAmJiB0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSB8fCB0YXJnZXQ/LlskYWZmZWN0ZWRdIHx8IHN1YnNjcmlwdFJlZ2lzdHJ5Py5oYXM/Lih0YXJnZXQpKSk7XG59O1xudmFyIHJlY292ZXJSZWFjdGl2ZSA9ICh0YXJnZXQpID0+IHtcblx0cmV0dXJuIGlzT2JzZXJ2YWJsZSh0YXJnZXQpID8gb2JzZXJ2ZSh0YXJnZXQpIDogbnVsbDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL01haW5saW5lLnRzXG52YXIgdXNlT2JzZXJ2YWJsZSA9ICh1bndyYXApID0+IHtcblx0aWYgKHVud3JhcCA9PSBudWxsIHx8IHR5cGVvZiB1bndyYXAgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdW53cmFwICE9IFwiZnVuY3Rpb25cIiB8fCB1bndyYXA/LltTeW1ib2wub2JzZXJ2YWJsZV0gIT0gbnVsbCkgcmV0dXJuIHVud3JhcDtcblx0dHJ5IHtcblx0XHR1bndyYXBbU3ltYm9sLm9ic2VydmFibGVdID0gc2VsZj8uY29tcGF0aWJsZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUud2FybihcIlVuYWJsZSB0byBhc3NpZ24gPFtTeW1ib2wub2JzZXJ2YWJsZV0+LCBvYmplY3Qgd2lsbCBub3Qgb2JzZXJ2YWJsZSBieSBvdGhlciBmcmFtZXdvcmtzXCIpO1xuXHR9XG5cdHVud3JhcFskYWZmZWN0ZWRdID0gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiB7XG5cdFx0Y29uc3Qgb2JzZXJ2YWJsZSA9IHVud3JhcD8uW1N5bWJvbD8ub2JzZXJ2YWJsZV07XG5cdFx0b2JzZXJ2YWJsZT8uKCk/LmFmZmVjdGVkPy4oY2IsIHByb3AsIG9wdGlvbnMpO1xuXHRcdHJldHVybiAoKSA9PiBvYnNlcnZhYmxlPy4oKT8udW5hZmZlY3RlZD8uKGNiLCBwcm9wKTtcblx0fTtcblx0cmV0dXJuIHVud3JhcDtcbn07XG52YXIgc3BlY2lhbGl6ZWRTdWJzY3JpYmUgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBjaGVja1ZhbGlkT2JqID0gKG9iaikgPT4ge1xuXHRpZiAodHlwZW9mIG9iaiA9PSBcInN5bWJvbFwiIHx8IG9iaiA9PSBudWxsIHx8ICEodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiKSkgcmV0dXJuO1xuXHRyZXR1cm4gb2JqO1xufTtcbnZhciBpbml0aWFsVHJpZ2dlciA9IFwiaW5pdGlhbFwiO1xudmFyIHJlYWxQcm9wT2YgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHByb3AgPSB0YXJnZXQ/LlskcmVhbFByb3BdID8/IHRhcmdldD8ucmVhbFByb3A7XG5cdHJldHVybiBpc0tleVR5cGUocHJvcCkgPyBwcm9wIDogbnVsbDtcbn07XG52YXIgbm9ybWFsaXplQWZmZWN0ZWRQcm9wID0gKHRhcmdldCwgcHJvcCkgPT4ge1xuXHRjb25zdCByZWFsUHJvcCA9IHJlYWxQcm9wT2YodGFyZ2V0KTtcblx0aWYgKHJlYWxQcm9wICE9IG51bGwgJiYgKHByb3AgPT0gbnVsbCB8fCBwcm9wID09IFwidmFsdWVcIikpIHJldHVybiByZWFsUHJvcDtcblx0cmV0dXJuIHByb3A7XG59O1xudmFyIHByb3BWYWx1ZU9mID0gKHRhcmdldCwgcHJvcCkgPT4ge1xuXHRpZiAocHJvcCAhPSBudWxsICYmIHByb3AgPT0gcmVhbFByb3BPZih0YXJnZXQpKSByZXR1cm4gdGFyZ2V0Py52YWx1ZTtcblx0cmV0dXJuIHRhcmdldD8uW3Byb3BdO1xufTtcbnZhciBjYWxsQnlQcm9wUmVmQXdhcmUgPSAodGFyZ2V0LCBwcm9wLCBjYiwgY3R4KSA9PiB7XG5cdGlmIChwcm9wICE9IG51bGwgJiYgcHJvcCA9PSByZWFsUHJvcE9mKHRhcmdldCkpIHtcblx0XHRjb25zdCB2YWx1ZSA9IHByb3BWYWx1ZU9mKHRhcmdldCwgcHJvcCk7XG5cdFx0aWYgKHZhbHVlICE9IG51bGwpIHJldHVybiBjYj8uKHZhbHVlLCBwcm9wLCBudWxsLCBcInNldFwiKTtcblx0fVxuXHRyZXR1cm4gY2FsbEJ5UHJvcCh0YXJnZXQsIHByb3AsIGNiLCBjdHgpO1xufTtcbnZhciB3aXRoVHJpZ2dlciA9IChjYiwgb3B0aW9ucywgdHJpZ2dlcikgPT4ge1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpO1xuXHRpZiAodHJpZ2dlciA9PSBpbml0aWFsVHJpZ2dlcikge1xuXHRcdGlmICghbm9ybWFsaXplZC50cmlnZ2VySW1tZWRpYXRlbHkpIHJldHVybjtcblx0fSBlbHNlIGlmICghdHJpZ2dlckZpbHRlckFsbG93cyhub3JtYWxpemVkLmFmZmVjdFR5cGVzLCB0cmlnZ2VyKSkgcmV0dXJuO1xuXHRyZXR1cm4gKHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgLi4uZXRjKSA9PiBjYj8uKHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgdHJpZ2dlciwgLi4uZXRjKTtcbn07XG52YXIgc3Vic2NyaWJlRGlyZWN0bHkgPSAodGFyZ2V0LCBwcm9wLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKCF0YXJnZXQpIHJldHVybjtcblx0aWYgKCFjaGVja1ZhbGlkT2JqKHRhcmdldCkpIHJldHVybjtcblx0Y29uc3QgdFByb3AgPSBwcm9wICE9IFN5bWJvbC5pdGVyYXRvciA/IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCh0YXJnZXQsIHByb3ApIDogbnVsbDtcblx0bGV0IHJlZ2lzdHJ5ID0gdGFyZ2V0Py5bJHJlZ2lzdHJ5S2V5JF0gPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdHRhcmdldCA9IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0O1xuXHRzY2hlZHVsZXI/LnlpZWxkPy4oKT8udGhlbj8uKCgpID0+IHtcblx0XHRjb25zdCBpbml0aWFsQ2IgPSB3aXRoVHJpZ2dlcihjYiwgb3B0aW9ucywgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdGlmICghaW5pdGlhbENiKSByZXR1cm47XG5cdFx0aWYgKHRQcm9wICE9IG51bGwgJiYgdFByb3AgIT0gU3ltYm9sLml0ZXJhdG9yKSBjYWxsQnlQcm9wUmVmQXdhcmUodGFyZ2V0LCB0UHJvcCwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRlbHNlIGNhbGxCeUFsbFByb3AodGFyZ2V0LCBpbml0aWFsQ2IsIG51bGwpO1xuXHR9KTtcblx0bGV0IHVuU3ViID0gcmVnaXN0cnk/LmFmZmVjdGVkPy4oY2IsIHRQcm9wLCBvcHRpb25zKTtcblx0aWYgKHRhcmdldD8uW1N5bWJvbC5kaXNwb3NlXSkgcmV0dXJuIHVuU3ViO1xuXHRhZGRUb0NhbGxDaGFpbih1blN1YiwgU3ltYm9sLmRpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odW5TdWIsIFN5bWJvbC5hc3luY0Rpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odGFyZ2V0LCBTeW1ib2wuZGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih0YXJnZXQsIFN5bWJvbC5hc3luY0Rpc3Bvc2UsIHVuU3ViKTtcblx0cmV0dXJuIHVuU3ViO1xufTtcbnZhciBzdWJzY3JpYmVJbnB1dCA9ICh0ZywgXywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IGFmZmVjdFR5cGVzID0gbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpLmFmZmVjdFR5cGVzO1xuXHRjb25zdCAkb3B0ID0ge307XG5cdGxldCBvbGRWYWx1ZSA9IHRnPy52YWx1ZTtcblx0Y29uc3QgJGNiID0gKGV2KSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSBldj8udGFyZ2V0Py52YWx1ZTtcblx0XHRpZiAodHJpZ2dlckZpbHRlckFsbG93cyhhZmZlY3RUeXBlcywgXCJzZXRcIikpIGNiPy4odmFsdWUsIFwidmFsdWVcIiwgb2xkVmFsdWUsIFwic2V0XCIsIGV2KTtcblx0XHRvbGRWYWx1ZSA9IHZhbHVlO1xuXHR9O1xuXHR0Zz8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwiY2hhbmdlXCIsICRjYiwgJG9wdCk7XG5cdHJldHVybiAoKSA9PiB0Zz8ucmVtb3ZlRXZlbnRMaXN0ZW5lcj8uKFwiY2hhbmdlXCIsICRjYiwgJG9wdCk7XG59O1xudmFyIGNoZWNrSXNQYWlyZWQgPSAodGcpID0+IHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodGcpICYmIHRnPy5sZW5ndGggPT0gMiAmJiBjaGVja1ZhbGlkT2JqKHRnPy5bMF0pICYmIChpc0tleVR5cGUodGc/LlsxXSkgfHwgdGc/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpO1xufTtcbnZhciBpc0VmZmVjdE9wdGlvbnNBcmcgPSAodmFsdWUpID0+IHtcblx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIChcImFmZmVjdFR5cGVzXCIgaW4gdmFsdWUgfHwgXCJ0cmlnZ2Vyc1wiIGluIHZhbHVlIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gdmFsdWUpO1xufTtcbnZhciBub3JtYWxpemVFZmZlY3RUYXJnZXRzID0gKHRhcmdldHMpID0+IHtcblx0aWYgKHRhcmdldHMgPT0gbnVsbCkgcmV0dXJuIFtdO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXRzKSAmJiAhY2hlY2tJc1BhaXJlZCh0YXJnZXRzKSAmJiAhaXNPYnNlcnZhYmxlKHRhcmdldHMpKSByZXR1cm4gdGFyZ2V0cztcblx0cmV0dXJuIFt0YXJnZXRzXTtcbn07XG52YXIgZWZmZWN0VGFyZ2V0Q29udGV4dCA9IChzb3VyY2UpID0+IHtcblx0aWYgKGNoZWNrSXNQYWlyZWQoc291cmNlKSkge1xuXHRcdGNvbnN0IHRhcmdldCA9IHNvdXJjZT8uWzBdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzb3VyY2UsXG5cdFx0XHR0YXJnZXQsXG5cdFx0XHRwcm9wOiBub3JtYWxpemVBZmZlY3RlZFByb3AodGFyZ2V0LCBzb3VyY2U/LlsxXSlcblx0XHR9O1xuXHR9XG5cdHJldHVybiB7XG5cdFx0c291cmNlLFxuXHRcdHRhcmdldDogc291cmNlLFxuXHRcdHByb3A6IG51bGxcblx0fTtcbn07XG52YXIgdG9FZmZlY3RFdmVudCA9IChzb3VyY2UsIHRhcmdldCwgdmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyLCBhcmdzKSA9PiAoe1xuXHRzb3VyY2UsXG5cdHRhcmdldCxcblx0dmFsdWUsXG5cdHByb3AsXG5cdG5hbWU6IHByb3AsXG5cdG9sZFZhbHVlLFxuXHR0cmlnZ2VyLFxuXHRhcmdzXG59KTtcbnZhciBzdWJzY3JpYmVQYWlyZWQgPSAodGcsIF8sIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRjb25zdCBwcm9wID0gaXNLZXlUeXBlKHRnPy5bMV0pID8gdGc/LlsxXSA6IG51bGw7XG5cdHJldHVybiBhZmZlY3RlZCh0Zz8uWzBdLCBwcm9wLCBjYiwgb3B0aW9ucyk7XG59O1xudmFyIHN1YnNjcmliZVRoZW5hYmxlID0gKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBvYmo/LnRoZW4/Ligob2JqKSA9PiBhZmZlY3RlZD8uKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMpKT8uY2F0Y2g/LigoZSkgPT4ge1xuXHRcdGNvbnNvbGUud2FybihlKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fSk7XG59O1xudmFyIGFmZmVjdGVkID0gKG9iaiwgcHJvcCwgY2IgPSAoKSA9PiB7fSwgb3B0aW9ucykgPT4ge1xuXHRsZXQga2V5ID0gbnVsbDtcblx0aWYgKHR5cGVvZiBwcm9wID09IFwiZnVuY3Rpb25cIikge1xuXHRcdG9wdGlvbnMgPSBjYjtcblx0XHRjYiA9IHByb3A7XG5cdH0gZWxzZSBrZXkgPSBub3JtYWxpemVBZmZlY3RlZFByb3Aob2JqLCBwcm9wKTtcblx0aWYgKHR5cGVvZiBjYiA9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkoY2IpKSB7XG5cdFx0b3B0aW9ucyA9IGNiO1xuXHRcdGNiID0gKCkgPT4ge307XG5cdH1cblx0aWYgKGlzUHJpbWl0aXZlKG9iaikgfHwgdHlwZW9mIG9iaiA9PSBcInN5bWJvbFwiKSB7XG5cdFx0aWYgKG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKS50cmlnZ2VySW1tZWRpYXRlbHkpIHJldHVybiBQcm9taXNlZChnbG9iYWxUaGlzPy5Qcm9taXNlPy50cnk/LigoKSA9PiB7XG5cdFx0XHRyZXR1cm4gY2I/LihvYmosIG51bGwsIG51bGwsIG51bGwsIGluaXRpYWxUcmlnZ2VyKTtcblx0XHR9KSk7XG5cdH1cblx0aWYgKHR5cGVvZiBvYmo/LlskYWZmZWN0ZWRdID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG9iaj8uWyRhZmZlY3RlZF0/LihjYiwga2V5LCBvcHRpb25zKTtcblx0ZWxzZSBpZiAoY2hlY2tWYWxpZE9iaihvYmopKSB7XG5cdFx0Y29uc3Qgd3JhcHBlZCA9IG9iajtcblx0XHRpZiAoc3BlY2lhbGl6ZWRTdWJzY3JpYmU/Lmhhcz8uKG9iaiA9IG9iaj8uWyRleHRyYWN0S2V5JF0gPz8gb2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXQ/LihvYmopPy4od3JhcHBlZCwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKGlzT2JzZXJ2YWJsZSh3cmFwcGVkKSB8fCBjaGVja0lzUGFpcmVkKG9iaikgJiYgaXNPYnNlcnZhYmxlKG9iaj8uWzBdKSkge1xuXHRcdFx0aWYgKGlzVGhlbmFibGUob2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlVGhlbmFibGUpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgaWYgKGNoZWNrSXNQYWlyZWQob2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlUGFpcmVkKT8uKG9iaiwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgSFRNTElucHV0RWxlbWVudCAhPSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZUlucHV0KT8uKG9iaiwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZURpcmVjdGx5KT8uKHdyYXBwZWQsIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBpbml0aWFsQ2IgPSB3aXRoVHJpZ2dlcihjYiwgb3B0aW9ucywgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdFx0aWYgKCFpbml0aWFsQ2IpIHJldHVybjtcblx0XHRcdHJldHVybiBQcm9taXNlZChnbG9iYWxUaGlzPy5Qcm9taXNlPy50cnk/LigoKSA9PiB7XG5cdFx0XHRcdGlmIChjaGVja0lzUGFpcmVkKG9iaikpIHJldHVybiBjYWxsQnlQcm9wUmVmQXdhcmU/LihvYmo/LlswXSwgb2JqPy5bMV0sIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgaWYgKGtleSAhPSBudWxsICYmIGtleSAhPSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBjYWxsQnlQcm9wUmVmQXdhcmU/LihvYmosIGtleSwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdFx0ZWxzZSByZXR1cm4gY2FsbEJ5QWxsUHJvcD8uKG9iaiwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdH0pKTtcblx0XHR9XG5cdH1cbn07XG5mdW5jdGlvbiBlZmZlY3QoY2IsIHRhcmdldHMsIG9wdGlvbnMpIHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAoaXNFZmZlY3RPcHRpb25zQXJnKHRhcmdldHMpICYmIG9wdGlvbnMgPT09IHZvaWQgMCkgcmV0dXJuIGVmZmVjdEdsb2JhbGx5KGNiLCB0YXJnZXRzKTtcblx0aWYgKHRhcmdldHMgPT0gbnVsbCkgcmV0dXJuIGVmZmVjdEdsb2JhbGx5KGNiLCBvcHRpb25zKTtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMob3B0aW9ucyk7XG5cdGNvbnN0IGFmZmVjdGVkT3B0aW9ucyA9IHtcblx0XHRhZmZlY3RUeXBlczogbm9ybWFsaXplZC5hZmZlY3RUeXBlcyxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG5vcm1hbGl6ZWQudHJpZ2dlckltbWVkaWF0ZWx5XG5cdH07XG5cdGNvbnN0IGRpc3Bvc2VycyA9IG5vcm1hbGl6ZUVmZmVjdFRhcmdldHModGFyZ2V0cykubWFwKChzb3VyY2UpID0+IHtcblx0XHRjb25zdCBjdHggPSBlZmZlY3RUYXJnZXRDb250ZXh0KHNvdXJjZSk7XG5cdFx0cmV0dXJuIGFmZmVjdGVkKGN0eC50YXJnZXQsIGN0eC5wcm9wLCAodmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyLCAuLi5hcmdzKSA9PiB7XG5cdFx0XHRyZXR1cm4gY2IodG9FZmZlY3RFdmVudChjdHguc291cmNlLCBjdHgudGFyZ2V0LCB2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIgPz8gbnVsbCwgYXJncykpO1xuXHRcdH0sIGFmZmVjdGVkT3B0aW9ucyk7XG5cdH0pLmZpbHRlcigoZGlzcG9zZSkgPT4gdHlwZW9mIGRpc3Bvc2UgPT0gXCJmdW5jdGlvblwiKTtcblx0cmV0dXJuICgpID0+IGRpc3Bvc2Vycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlPy4oKSk7XG59XG5mdW5jdGlvbiBlZmZlY3RlZCh0YXJnZXRzLCBjYiwgb3B0aW9ucykge1xuXHRyZXR1cm4gZWZmZWN0KGNiLCB0YXJnZXRzLCBvcHRpb25zKTtcbn1cbnZhciBtYWtlQXJyYXlPYnNlcnZhYmxlID0gKHRnKSA9PiB7XG5cdGlmICh0ZyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIG9ic2VydmFibGVCeVNldCh0Zyk7XG5cdGlmICh0ZyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIG9ic2VydmFibGVCeU1hcCh0Zyk7XG5cdHJldHVybiB0Zztcbn07XG52YXIgRG91YmxlV2Vha01hcCA9IGNsYXNzIHtcblx0I3RvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHQjZW5zdXJlSW5uZXIoa2V5MSkge1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG51bGw7XG5cdFx0bGV0IGlubmVyID0gdGhpcy4jdG9wLmdldChrZXkxKTtcblx0XHRpZiAoIWlubmVyKSB7XG5cdFx0XHRpbm5lciA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRcdFx0dGhpcy4jdG9wLnNldChrZXkxLCBpbm5lcik7XG5cdFx0fVxuXHRcdHJldHVybiBpbm5lcjtcblx0fVxuXHQjc3BsaXRQYWlyKHBhaXIpIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkocGFpcikgfHwgcGFpci5sZW5ndGggIT09IDIpIHJldHVybiBbbnVsbCwgbnVsbF07XG5cdFx0cmV0dXJuIHBhaXI7XG5cdH1cblx0aGFzTDEoa2V5MSkge1xuXHRcdHJldHVybiB0aGlzLiN0b3AuaGFzKGtleTEpO1xuXHR9XG5cdHNldChwYWlyLCB2YWx1ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0aGlzO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0Z2V0KHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdm9pZCAwO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZ2V0KGtleTEpPy5nZXQoa2V5Mik7XG5cdH1cblx0aGFzKHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5nZXQoa2V5MSk/LmhhcyhrZXkyKSA/PyBmYWxzZTtcblx0fVxuXHRkZWxldGUocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI3RvcC5nZXQoa2V5MSk7XG5cdFx0cmV0dXJuIGlubmVyID8gaW5uZXIuZGVsZXRlKGtleTIpIDogZmFsc2U7XG5cdH1cblx0ZGVsZXRlVG9wKGtleTEpIHtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmRlbGV0ZShrZXkxKTtcblx0fVxuXHRnZXRPckNyZWF0ZShwYWlyLCBmYWN0b3J5KSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhY3Rvcnk/LigpO1xuXHRcdGlmIChpbm5lci5oYXMoa2V5MikpIHJldHVybiBpbm5lci5nZXQoa2V5Mik7XG5cdFx0Y29uc3QgdmFsdWUgPSBmYWN0b3J5KCk7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblx0Z2V0T3JJbnNlcnQocGFpciwgdmFsdWUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRnZXRPckluc2VydENvbXB1dGVkKHBhaXIsIGNvbXB1dGUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY29tcHV0ZT8uKFtrZXkxLCBrZXkyXSk7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRjb25zdCB2YWx1ZSA9IGNvbXB1dGUoW2tleTEsIGtleTJdKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxufTtcbnZhciByZWdpc3RlcmVkSXRlcmF0ZWQgPSBuZXcgRG91YmxlV2Vha01hcCgpO1xuZnVuY3Rpb24gaXRlcmF0ZWQodGcsIGNiLCBvcHRpb25zID0gW1wiKlwiXSkge1xuXHRpZiAoIXRnKSByZXR1cm47XG5cdGlmICh0eXBlb2YgdGcgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHRnICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0aWYgKHJlZ2lzdGVyZWRJdGVyYXRlZC5oYXMoW3RnLCBjYl0pKSByZXR1cm4gcmVnaXN0ZXJlZEl0ZXJhdGVkLmdldChbdGcsIGNiXSk7XG5cdGNvbnN0ICRzdWIgPSAodmFsdWUsIG5hbWUsIG9sZCwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChuYW1lID09IFwidmFsdWVcIikge1xuXHRcdFx0Y29uc3QgZW50cmllcyA9IChvbGQ/LnZhbHVlID8/IG9sZCk/LmVudHJpZXM/LigpO1xuXHRcdFx0Y29uc3QgYmFzaXMgPSB0Zz8udmFsdWUgPz8gdmFsdWU/LnZhbHVlID8/IHZhbHVlO1xuXHRcdFx0aWYgKGVudHJpZXMpIGZvciAoY29uc3QgW2lkeCwgaXRlbV0gb2YgZW50cmllcykge1xuXHRcdFx0XHRjb25zdCBvZk9sZCA9IGl0ZW0gPz8gKG9sZD8udmFsdWUgPz8gb2xkKT8uW2lkeF0gPz8gbnVsbDtcblx0XHRcdFx0Y29uc3Qgb2ZOZXcgPSBiYXNpcz8uW2lkeF07XG5cdFx0XHRcdGlmIChvZk9sZCA9PSBudWxsICYmIG9mTmV3ICE9IG51bGwpIGNiKG9mTmV3LCBpZHgsIG51bGwsIFwiYWRkXCIpO1xuXHRcdFx0XHRlbHNlIGlmIChvZk9sZCAhPSBudWxsICYmIG9mTmV3ID09IG51bGwpIGNiKG51bGwsIGlkeCwgb2ZPbGQsIFwiZGVsZXRlXCIpO1xuXHRcdFx0XHRlbHNlIGlmIChpc05vdEVxdWFsKG9mT2xkLCBvZk5ldykpIGNiKG9mTmV3LCBpZHgsIG9mT2xkLCBcInNldFwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpdGVyYXRlZCh2YWx1ZSA/PyB0Zz8udmFsdWUsIGNiLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5hbWUgPT0gbnVsbCA/IHZvaWQgMCA6IHRnW25hbWVdO1xuXHR9O1xuXHRyZXR1cm4gcmVnaXN0ZXJlZEl0ZXJhdGVkLmdldE9ySW5zZXJ0Q29tcHV0ZWQoW3RnLCBjYl0sICgpID0+IHtcblx0XHRpZiAodGcgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBhZmZlY3RlZChbb2JzZXJ2YWJsZUJ5U2V0KHRnKSwgU3ltYm9sLml0ZXJhdG9yXSwgY2IsIG9wdGlvbnMpO1xuXHRcdGlmICh0ZyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIGFmZmVjdGVkKHRnLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKGhhc1ZhbHVlKHRnKSkgcmV0dXJuIGFmZmVjdGVkKHRnLCAkc3ViLCBvcHRpb25zKTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh0ZykgJiYgISh0Zz8ubGVuZ3RoID09IDIgJiYgaXNLZXlUeXBlKHRnPy5bMV0pICYmIGlzT2JzZXJ2YWJsZSh0Zz8uWzBdKSkpIHJldHVybiBhZmZlY3RlZChbdGcsIFN5bWJvbC5pdGVyYXRvcl0sIGNiLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gYWZmZWN0ZWQodGcsIGNiLCBvcHRpb25zKTtcblx0fSk7XG59XG5mdW5jdGlvbiB1bmFmZmVjdGVkKHRnLCBjYikge1xuXHRyZXR1cm4gd2l0aFByb21pc2UodGcsICh0YXJnZXQpID0+IHtcblx0XHRjb25zdCBpc1BhaXIgPSBBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgdGFyZ2V0Py5sZW5ndGggPT0gMiAmJiBbXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiXS5pbmRleE9mKHR5cGVvZiB0YXJnZXQ/LlswXSkgPj0gMCAmJiBpc0tleVR5cGUodGFyZ2V0Py5bMV0pO1xuXHRcdGNvbnN0IHByb3AgPSBpc1BhaXIgPyB0YXJnZXQ/LlsxXSA6IG51bGw7XG5cdFx0dGFyZ2V0ID0gaXNQYWlyICYmIHByb3AgIT0gbnVsbCA/IHRhcmdldD8uWzBdID8/IHRhcmdldCA6IHRhcmdldDtcblx0XHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldDtcblx0XHQodGFyZ2V0Py5bJHJlZ2lzdHJ5S2V5JF0gPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHVud3JhcCkpPy51bmFmZmVjdGVkPy4oY2IsIHByb3ApO1xuXHR9KTtcbn1cbnZhciBiaW5kQnkgPSAodGFyZ2V0LCByZWFjdGl2ZSwgd2F0Y2gpID0+IHtcblx0YWZmZWN0ZWQocmVhY3RpdmUsIG51bGwsICh2LCBwKSA9PiB7XG5cdFx0b2JqZWN0QXNzaWduKHRhcmdldCwgdiwgcCwgdHJ1ZSk7XG5cdH0pO1xuXHR3YXRjaD8uKCgpID0+IHRhcmdldCwgKE4pID0+IHtcblx0XHRmb3IgKGNvbnN0IGsgaW4gTikgb2JqZWN0QXNzaWduKHJlYWN0aXZlLCBOW2tdLCBrLCB0cnVlKTtcblx0fSwgeyBkZWVwOiB0cnVlIH0pO1xuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBkZXJpdmF0ZSA9IChmcm9tLCByZWFjdEZuLCB3YXRjaCkgPT4gYmluZEJ5KHJlYWN0Rm4oc2FmZShmcm9tKSksIGZyb20sIHdhdGNoKTtcbnZhciBiaW5kQnlLZXkgPSAodGFyZ2V0LCByZWFjdGl2ZSwga2V5ID0gKCkgPT4gXCJcIikgPT4gYWZmZWN0ZWQocmVhY3RpdmUsIG51bGwsICh2YWx1ZSwgcCkgPT4ge1xuXHRpZiAocCA9PSBrZXkoKSkgb2JqZWN0QXNzaWduKHRhcmdldCwgdmFsdWUsIG51bGwsIHRydWUpO1xufSk7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL0Fzc2lnbmVkLnRzXG52YXIgY29uZGl0aW9uYWxJbmRleCA9IChjb25kTGlzdCA9IFtdKSA9PiB7XG5cdGNvbnN0IHNvdXJjZSA9IG9ic2VydmUoeyB2YWx1ZTogMCB9KTtcblx0Y29uc3QgcmVhZENvbmRpdGlvbiA9IChjb25kaXRpb24pID0+IHtcblx0XHRpZiAodHlwZW9mIGNvbmRpdGlvbiA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb25kaXRpb24oKTtcblx0XHRyZXR1cm4gaGFzVmFsdWUoY29uZGl0aW9uKSA/IGNvbmRpdGlvbi52YWx1ZSA6IGNvbmRpdGlvbjtcblx0fTtcblx0Y29uc3QgZXZhbHVhdGUgPSAoKSA9PiBjb25kTGlzdC5maW5kSW5kZXgoKGNvbmRpdGlvbikgPT4gISFyZWFkQ29uZGl0aW9uKGNvbmRpdGlvbikpO1xuXHRjb25zdCByZXN1bHQgPSBjb21wdXRlZChbc291cmNlLCBcInZhbHVlXCJdLCBldmFsdWF0ZSwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgaW52YWxpZGF0ZSA9ICgpID0+IHtcblx0XHRzb3VyY2UudmFsdWUrKztcblx0fTtcblx0Y29uc3QgZGlzcG9zZXJzID0gW107XG5cdGlmIChpc09ic2VydmFibGUoY29uZExpc3QpKSBkaXNwb3NlcnMucHVzaChhZmZlY3RlZChjb25kTGlzdCwgaW52YWxpZGF0ZSwge1xuXHRcdGFmZmVjdFR5cGVzOiBbXG5cdFx0XHRcImFkZFwiLFxuXHRcdFx0XCJzZXRcIixcblx0XHRcdFwiZGVsZXRlXCJcblx0XHRdLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogZmFsc2Vcblx0fSkpO1xuXHRmb3IgKGNvbnN0IGNvbmRpdGlvbiBvZiBjb25kTGlzdCkgaWYgKGhhc1ZhbHVlKGNvbmRpdGlvbikpIGRpc3Bvc2Vycy5wdXNoKGFmZmVjdGVkKFtjb25kaXRpb24sIFwidmFsdWVcIl0sIGludmFsaWRhdGUsIHtcblx0XHRhZmZlY3RUeXBlczogW1wic2V0dGVyXCJdLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogZmFsc2Vcblx0fSkpO1xuXHRhZGRUb0NhbGxDaGFpbihyZXN1bHQsIFN5bWJvbC5kaXNwb3NlLCAoKSA9PiBkaXNwb3NlcnMuZm9yRWFjaCgoZGlzcG9zZSkgPT4gZGlzcG9zZT8uKCkpKTtcblx0cmV0dXJuIHJlc3VsdDtcbn07XG52YXIgY29uZGl0aW9uYWxSZWYgPSAoY29uZCwgaWZUcnVlLCBpZkZhbHNlLCBiZWhhdmlvcikgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUoY29uZCkpIHJldHVybiBjb25kID8gaWZUcnVlIDogaWZGYWxzZTtcblx0Y29uc3QgZ2V0VHJ1ZSA9ICgpID0+IHtcblx0XHRyZXR1cm4gaWZUcnVlO1xuXHR9O1xuXHRjb25zdCBnZXRGYWxzZSA9ICgpID0+IHtcblx0XHRyZXR1cm4gaWZGYWxzZTtcblx0fTtcblx0Y29uc3QgdmFsdWVPZiA9IChuKSA9PiB7XG5cdFx0aWYgKG4gIT0gbnVsbCkgY29uZC52YWx1ZSA9IGhhc1ZhbHVlKG4pID8gbj8udmFsdWUgOiBuO1xuXHRcdHJldHVybiAoaGFzVmFsdWUoY29uZCkgPyBjb25kPy52YWx1ZSA6IGNvbmQpID8gZ2V0VHJ1ZSgpIDogZ2V0RmFsc2UoKTtcblx0fTtcblx0Y29uc3QgciA9IG9ic2VydmUoe1xuXHRcdFskdmFsdWVdOiB2YWx1ZU9mKCksXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSB2YWx1ZU9mKHYpO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSA9IHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoW2NvbmQsIFwidmFsdWVcIl0sICgpID0+IHtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHI/LlskdmFsdWVdO1xuXHRcdGNvbnN0IHZhbHVlID0gdmFsdWVPZigpO1xuXHRcdHJbJHZhbHVlXSA9IHZhbHVlO1xuXHRcdHI/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlLFxuXHRcdFx0b2xkVmFsdWUsXG5cdFx0XHR0cmlnZ2VyOiBcIm1hbnVhbFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHI7XG59O1xudmFyIGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWxSZWY7XG52YXIgcmVtYXAgPSAoc3ViLCBjYiwgZGVzdCkgPT4ge1xuXHRpZiAoIWRlc3QpIGRlc3QgPSBvYnNlcnZlKHt9KTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoc3ViLCAodmFsdWUsIHByb3AsIG9sZCkgPT4ge1xuXHRcdGlmIChwcm9wID09IG51bGwpIHJldHVybjtcblx0XHRjb25zdCBnb3QgPSBjYj8uKHZhbHVlLCBwcm9wLCBvbGQpO1xuXHRcdGlmICh0eXBlb2YgZ290ID09IFwib2JqZWN0XCIpIG9iamVjdEFzc2lnbk5vdEVxdWFsKGRlc3QsIGdvdCk7XG5cdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChkZXN0W3Byb3BdLCBnb3QpKSBkZXN0W3Byb3BdID0gZ290O1xuXHR9KTtcblx0aWYgKGRlc3QpIGFkZFRvQ2FsbENoYWluKGRlc3QsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gZGVzdDtcbn07XG52YXIgdW5pZmllZCA9ICguLi5zdWJzKSA9PiB7XG5cdGNvbnN0IGRlc3QgPSBvYnNlcnZlKHt9KTtcblx0c3Vicz8uZm9yRWFjaD8uKChzdWIpID0+IGFmZmVjdGVkKHN1YiwgKHZhbHVlLCBwcm9wLCBfKSA9PiB7XG5cdFx0aWYgKHByb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGlmIChpc05vdEVxdWFsKGRlc3RbcHJvcF0sIHZhbHVlKSkgZGVzdFtwcm9wXSA9IHZhbHVlO1xuXHR9KSk7XG5cdHJldHVybiBkZXN0O1xufTtcbnZhciBvYnNlcnZhYmxlQnlTZXQgPSAoc2V0KSA9PiB7XG5cdGNvbnN0IG9icyA9IG9ic2VydmUoW10pO1xuXHRvYnMucHVzaCguLi5BcnJheS5mcm9tKHNldD8udmFsdWVzPy4oKSB8fCBbXSkpO1xuXHRhZGRUb0NhbGxDaGFpbihvYnMsIFN5bWJvbC5kaXNwb3NlLCBhZmZlY3RlZChzZXQsICh2YWx1ZSwgXywgb2xkKSA9PiB7XG5cdFx0aWYgKGlzTm90RXF1YWwodmFsdWUsIG9sZCkpIHtcblx0XHRcdGlmIChvbGQgPT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsKSBvYnMucHVzaCh2YWx1ZSk7XG5cdFx0XHRlbHNlIGlmIChvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdGNvbnN0IGlkeCA9IG9icy5pbmRleE9mKG9sZCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCkgb2JzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gb2JzLmluZGV4T2Yob2xkKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwICYmIGlzTm90RXF1YWwob2JzW2lkeF0sIHZhbHVlKSkgb2JzW2lkeF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKTtcblx0cmV0dXJuIG9icztcbn07XG52YXIgb2JzZXJ2YWJsZUJ5TWFwID0gKG1hcCkgPT4ge1xuXHRjb25zdCBvYnMgPSBvYnNlcnZlKFtdKTtcblx0Y29uc3QgaW5pdGlhbEVudHJpZXMgPSBBcnJheS5mcm9tKG1hcC5lbnRyaWVzKCkpO1xuXHRvYnMucHVzaCguLi5pbml0aWFsRW50cmllcyk7XG5cdGFkZFRvQ2FsbENoYWluKG9icywgU3ltYm9sLmRpc3Bvc2UsIGFmZmVjdGVkKG1hcCwgKHZhbHVlLCBwcm9wLCBvbGQpID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2YWx1ZSwgb2xkKSB8fCBvbGQgPT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsIHx8IG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdGlmIChvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdGxldCBpZHggPSBvYnMuZmluZEluZGV4KChbbmFtZSwgX10pID0+IG5hbWUgPT0gcHJvcCk7XG5cdFx0XHRcdGlmIChpZHggPCAwKSBpZHggPSBvYnMuZmluZExhc3RJbmRleCgoW18sIHZhbF0pID0+IG9sZCA9PT0gdmFsKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwKSBvYnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgaWR4ID0gb2JzLmZpbmRJbmRleCgoW25hbWUsIF9dKSA9PiBuYW1lID09IHByb3ApO1xuXHRcdFx0XHRpZiAoaWR4ID49IDAgJiYgaWR4IDwgb2JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlmIChpc05vdEVxdWFsKG9ic1tpZHhdPy5bMV0sIHZhbHVlKSkgb2JzW2lkeF0gPSBbcHJvcCwgdmFsdWVdO1xuXHRcdFx0XHR9IGVsc2Ugb2JzLnB1c2goW3Byb3AsIHZhbHVlXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KSk7XG5cdHJldHVybiBvYnM7XG59O1xudmFyIGFzc2lnbk1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGFzc2lnbiA9IChhLCBiLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IGlzQUNvbXB1dGUgPSB0eXBlb2YgYT8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBhPy5sZW5ndGggPT0gMiwgaXNCQ29tcHV0ZSA9IHR5cGVvZiBiPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIGI/Lmxlbmd0aCA9PSAyLCBjbXBCRm5jID0gaXNCQ29tcHV0ZSA/IGI/LlsxXSA6IG51bGw7XG5cdGNvbnN0IGlzQVByb3AgPSAoaXNLZXlUeXBlKGE/LlsxXSkgfHwgYT8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgYT8ubGVuZ3RoID09IDI7XG5cdGxldCBhX3Byb3AgPSBpc0FQcm9wICYmICFpc0FDb21wdXRlID8gYT8uWzFdIDogQXJyYXkuaXNBcnJheShhKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQVByb3AgJiYgIWlzQUNvbXB1dGUpIGEgPSBbYSwgYV9wcm9wXTtcblx0aWYgKGlzQUNvbXB1dGUpIGFbMV0gPSBhX3Byb3A7XG5cdGNvbnN0IGlzQlByb3AgPSAoaXNLZXlUeXBlKGI/LlsxXSkgfHwgYj8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgYj8ubGVuZ3RoID09IDI7XG5cdGxldCBiX3Byb3AgPSBpc0JQcm9wICYmICFpc0JDb21wdXRlID8gYj8uWzFdIDogQXJyYXkuaXNBcnJheShiKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQlByb3AgJiYgIWlzQkNvbXB1dGUpIGIgPSBbYiwgYl9wcm9wXTtcblx0aWYgKGlzQkNvbXB1dGUpIGJbMV0gPSBiX3Byb3A7XG5cdGlmIChhX3Byb3AgPT0gbnVsbCB8fCBiX3Byb3AgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShhX3Byb3AsIGE/LlswXSkgfHwgaXNBcnJheUludmFsaWRLZXkoYl9wcm9wLCBiPy5bMF0pKSByZXR1cm47XG5cdGlmICghKCh0eXBlb2YgYj8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGI/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmIGI/LlswXSAhPSBudWxsKSAmJiAhQXJyYXkuaXNBcnJheShhWzBdKSkge1xuXHRcdCRhdm9pZFRyaWdnZXIoYiwgKCkgPT4ge1xuXHRcdFx0YVswXVthX3Byb3BdID0gYj8uWzBdO1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB7fTtcblx0fVxuXHRjb25zdCBjb21wdXRlID0gKHYsIHApID0+IHtcblx0XHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKTtcblx0XHRjb25zdCBiX3RtcCA9IGJSZWY/LmRlcmVmPy4oKTtcblx0XHRpZiAoYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmJvdW5kID09IGJfdG1wKSB7XG5cdFx0XHRsZXQgdmFsID0gbnVsbDtcblx0XHRcdGNvbnN0IGNtcGZ4ID0gYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmNtcGZ4O1xuXHRcdFx0JGF2b2lkVHJpZ2dlcihiX3RtcCwgKCkgPT4ge1xuXHRcdFx0XHRpZiAodHlwZW9mIGNtcGZ4ID09IFwiZnVuY3Rpb25cIikgdmFsID0gY21wZng/LigkZ2V0VmFsdWUoYl90bXApID8/IHYsIHAsIG51bGwpO1xuXHRcdFx0XHRlbHNlIHZhbCA9IGJfdG1wPy5bcF0gPz8gdjtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgbnYgPSAkZ2V0VmFsdWUodmFsKTtcblx0XHRcdGlmIChpc05vdEVxdWFsKGFfdG1wW2FfcHJvcF0sIG52KSkgJGF2b2lkVHJpZ2dlcihiX3RtcCwgKCkgPT4ge1xuXHRcdFx0XHRhX3RtcFthX3Byb3BdID0gbnY7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgKChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKSk/LmdldD8uKGFfcHJvcCkpPy5kaXNwb3NlPy4oKTtcblx0fTtcblx0Y29uc3QgZGlzcG9zZSA9ICgpID0+IHtcblx0XHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKTtcblx0XHRjb25zdCBtYXAgPSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKTtcblx0XHRjb25zdCBzdG9yZSA9IG1hcD8uZ2V0Py4oYV9wcm9wKTtcblx0XHRtYXA/LmRlbGV0ZT8uKGFfcHJvcCk7XG5cdFx0c3RvcmU/LnVuc3ViPy4oKTtcblx0fTtcblx0Y29uc3QgYlJlZiA9IGI/LlswXSAhPSBudWxsICYmICh0eXBlb2YgYj8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGI/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmICEoYj8uWzBdIGluc3RhbmNlb2YgV2Vha1JlZiB8fCB0eXBlb2YgYj8uWzBdPy5kZXJlZiA9PSBcImZ1bmN0aW9uXCIpID8gbmV3IFdlYWtSZWYoYj8uWzBdKSA6IGI/LlswXSwgYVJlZiA9IGE/LlswXSAhPSBudWxsICYmICh0eXBlb2YgYT8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGE/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmICEoYT8uWzBdIGluc3RhbmNlb2YgV2Vha1JlZiB8fCB0eXBlb2YgYT8uWzBdPy5kZXJlZiA9PSBcImZ1bmN0aW9uXCIpID8gbmV3IFdlYWtSZWYoYT8uWzBdKSA6IGE/LlswXTtcblx0bGV0IHN0b3JlID0ge1xuXHRcdGNvbXB1dGUsXG5cdFx0ZGlzcG9zZSxcblx0XHRjbXBmeDogY21wQkZuY1xuXHR9O1xuXHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKSwgYl90bXAgPSBiUmVmPy5kZXJlZj8uKCk7XG5cdGlmIChhUmVmIGluc3RhbmNlb2YgV2Vha1JlZikge1xuXHRcdGlmIChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uYm91bmQgIT0gYl90bXApIGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5kZWxldGU/LihhX3Byb3ApO1xuXHRcdHN0b3JlID0gKGFzc2lnbk1hcD8uZ2V0T3JJbnNlcnQ/LihhX3RtcCwgLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSkpPy5nZXRPckluc2VydENvbXB1dGVkPy4oYV9wcm9wLCAoKSA9PiAoe1xuXHRcdFx0Ym91bmQ6IGJfdG1wLFxuXHRcdFx0Y21wZng6IGNtcEJGbmMsXG5cdFx0XHR1bnN1YjogbnVsbCxcblx0XHRcdGNvbXB1dGUsXG5cdFx0XHRkaXNwb3NlXG5cdFx0fSkpO1xuXHRcdHN0b3JlLnVuc3ViID0gYWZmZWN0ZWQoYiwgY29tcHV0ZSk7XG5cdFx0c3RvcmUuY21wZnggPSBjbXBCRm5jO1xuXHRcdGFkZFRvQ2FsbENoYWluKGFfdG1wLCBTeW1ib2wuZGlzcG9zZSwgc3RvcmU/LmRpc3Bvc2UpO1xuXHRcdGFkZFRvQ2FsbENoYWluKGJfdG1wLCBTeW1ib2wuZGlzcG9zZSwgc3RvcmU/LmRpc3Bvc2UpO1xuXHR9XG5cdGlmIChiX3RtcCAmJiAhQXJyYXkuaXNBcnJheShiX3RtcCkpICRhdm9pZFRyaWdnZXIoYV90bXAsICgpID0+IHtcblx0XHRiX3RtcFtiX3Byb3BdID8/PSBhX3RtcD8uW2FfcHJvcF0gPz8gYl90bXBbYl9wcm9wXTtcblx0fSk7XG5cdHJldHVybiBzdG9yZT8uZGlzcG9zZTtcbn07XG52YXIgbGluayA9IChhLCBiLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IHVzdWIgPSBbYXNzaWduKGEsIGIsIHByb3ApLCBhc3NpZ24oYiwgYSwgcHJvcCldO1xuXHRyZXR1cm4gKCkgPT4gdXN1Yj8ubWFwPy4oKGMpID0+IGM/LigpKTtcbn07XG52YXIgY29tcHV0ZWQgPSAoc3JjLCBjYiwgYmVoYXZpb3IsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgaXNBQ29tcHV0ZSA9IHR5cGVvZiBzcmM/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgc3JjPy5sZW5ndGggPT0gMjtcblx0Y29uc3QgaXNBUHJvcCA9IChpc0tleVR5cGUoc3JjPy5bMV0pIHx8IHNyYz8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgc3JjPy5sZW5ndGggPT0gMjtcblx0bGV0IGFfcHJvcCA9IGlzQVByb3AgJiYgIWlzQUNvbXB1dGUgPyBzcmM/LlsxXSA6IEFycmF5LmlzQXJyYXkoc3JjKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQVByb3AgJiYgIWlzQUNvbXB1dGUpIHNyYyA9IFtpc0FQcm9wID8gc3JjPy5bMF0gOiBzcmMsIGFfcHJvcF07XG5cdGlmIChpc0FDb21wdXRlKSBzcmNbMV0gPSBhX3Byb3A7XG5cdGlmIChhX3Byb3AgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShhX3Byb3AsIHNyYz8uWzBdKSkgcmV0dXJuO1xuXHRsZXQgb2xkVmFsdWUgPSB2b2lkIDA7XG5cdGxldCBvbGRBcmcgPSB2b2lkIDA7XG5cdGNvbnN0IGNtcCA9IChhcmcsIGZvcmNlKSA9PiB7XG5cdFx0YXJnID8/PSBzcmM/LlswXT8uW2FfcHJvcF0gPz8gb2xkQXJnID8/IGFyZztcblx0XHRpZiAoZm9yY2UgfHwgaXNOb3RFcXVhbChvbGRBcmcsIGFyZykgJiYgYXJnICE9IHZvaWQgMCB8fCBvbGRWYWx1ZSA9PSB2b2lkIDApIHtcblx0XHRcdGxldCBudiA9IGNiPy4oYXJnLCBhX3Byb3AsIG9sZEFyZyk7XG5cdFx0XHRvbGRWYWx1ZSA9IG52O1xuXHRcdFx0cmV0dXJuIG52O1xuXHRcdH1cblx0XHRyZXR1cm4gb2xkVmFsdWU7XG5cdH07XG5cdGNvbnN0IHdycEZ1bmMgPSAoYXJnLCBwcm9wID0gXCJ2YWx1ZVwiLCBvbGRBcmckLCBvcCkgPT4ge1xuXHRcdG9sZEFyZyA9IG9sZEFyZyQgPz8gb2xkQXJnO1xuXHRcdGFyZyA/Pz0gc3JjPy5bMF0/LlthX3Byb3BdO1xuXHRcdGlmIChpc05vdEVxdWFsKG9sZEFyZywgYXJnKSAmJiBhcmcgIT0gdm9pZCAwIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0bGV0IG52ID0gY2I/LihhcmcsIGFfcHJvcCwgb2xkQXJnLCBvcCk7XG5cdFx0XHRvbGRBcmcgPSBhcmc7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbChudiwgb2xkVmFsdWUpIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0XHRyZltwcm9wXSA9IG9sZFZhbHVlID0gbnY7XG5cdFx0XHRcdG9sZFZhbHVlID0gcmZbcHJvcF07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnY7XG5cdFx0fVxuXHRcdHJldHVybiByZltwcm9wXTtcblx0fTtcblx0Y29uc3QgaW5pdGlhbCA9IGNtcChzcmNbMF1bYV9wcm9wXSA/PyBvbGRBcmcpO1xuXHRjb25zdCBwZW5kaW5nSW5pdGlhbCA9IGlzUHJvbWlzZShpbml0aWFsKTtcblx0Y29uc3QgJGFwcGx5ID0gU3ltYm9sLmZvcihcIkBAYXBwbHlcIik7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkcHJvbWlzZSwge1xuXHRcdHZhbHVlOiBpbml0aWFsLFxuXHRcdHdyaXRhYmxlOiB0cnVlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgJHZhbHVlLCB7XG5cdFx0dmFsdWU6IGluaXRpYWwsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkYmVoYXZpb3IsIHtcblx0XHR2YWx1ZTogYmVoYXZpb3IsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBTeW1ib2w/LnRvU3RyaW5nVGFnLCB7XG5cdFx0dmFsdWU6IFN0cmluZyh3cnBGdW5jWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIixcblx0XHR3cml0YWJsZTogZmFsc2Vcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBTeW1ib2w/LnRvUHJpbWl0aXZlLCB7XG5cdFx0dmFsdWU6IHRyeVBhcnNlQnlIaW50KHdycEZ1bmNbJHZhbHVlXSwgXCJudW1iZXJcIiksXG5cdFx0d3JpdGFibGU6IGZhbHNlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgXCJ2YWx1ZVwiLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgY3AgPSBjbXAoKTtcblx0XHRcdGlmIChjcCAhPSBudWxsKSB3cnBGdW5jWyR2YWx1ZV0gPSBjcDtcblx0XHRcdHJldHVybiB3cnBGdW5jWyR2YWx1ZV07XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKGFyZykge1xuXHRcdFx0d3JwRnVuY1skdmFsdWVdID0gY21wKGFyZywgdHJ1ZSk7XG5cdFx0fVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRhcHBseSwge1xuXHRcdHZhbHVlOiAodikgPT4ge1xuXHRcdFx0aWYgKHYgPT0gdm9pZCAwKSByZXR1cm4gcmY/LnZhbHVlO1xuXHRcdFx0cmYudmFsdWUgPSB2O1xuXHRcdFx0cmV0dXJuIHJmPy52YWx1ZTtcblx0XHR9LFxuXHRcdHdyaXRhYmxlOiBmYWxzZVxuXHR9KTtcblx0Y29uc3QgcmYgPSBvYnNlcnZlKHdycEZ1bmMpO1xuXHRjb25zdCB3cml0ZUNvbXB1dGVkID0gKHZhbHVlLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oKHYpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gcmY/LlskdmFsdWVdO1xuXHRcdFx0cmZbJHZhbHVlXSA9IHY7XG5cdFx0XHRyZj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0XHRvbGRWYWx1ZSxcblx0XHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH0pO1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gcmY/LlskdmFsdWVdO1xuXHRcdHJmWyR2YWx1ZV0gPSB2YWx1ZTtcblx0XHRyZj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRvbGRWYWx1ZSxcblx0XHRcdHRyaWdnZXJcblx0XHR9KTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH07XG5cdGlmIChwZW5kaW5nSW5pdGlhbCkgd3JpdGVDb21wdXRlZChpbml0aWFsLCBcInJlc29sdmVkXCIpO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChbc3JjPy5bMF0gPz8gc3JjLCBhX3Byb3AgPz8gXCJ2YWx1ZVwiXSwgKCkgPT4ge1xuXHRcdHdyaXRlQ29tcHV0ZWQoY21wKCksIFwibWFudWFsXCIpO1xuXHR9KTtcblx0YWRkVG9DYWxsQ2hhaW4ocmYsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcmY7XG59O1xudmFyIGRlbGF5ZWRTdWJzY3JpYmUgPSAocmVmLCBjYiwgZGVsYXkgPSAxMDApID0+IHtcblx0bGV0IHRtO1xuXHRyZXR1cm4gYWZmZWN0ZWQocmVmLCBcInZhbHVlXCIsICh2KSA9PiB7XG5cdFx0aWYgKCF2ICYmIHRtKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodG0pO1xuXHRcdFx0dG0gPSBudWxsO1xuXHRcdH0gZWxzZSBpZiAodiAmJiAhdG0pIHRtID0gdHJpZ2dlcldpdGhEZWxheShyZWYsIGNiLCBkZWxheSkgPz8gdG07XG5cdH0pO1xufTtcblxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyAkYWZmZWN0ZWQsICRyZWYsICRyZXNvbHZlZCwgJHRyaWdnZXIsICR0cmlnZ2VyQ29udHJvbCwgJHRyaWdnZXJMZXNzLCAkdHJpZ2dlckxvY2ssIEFzc2lnbk9iamVjdEhhbmRsZXIsIERvdWJsZVdlYWtNYXAsIGFkZFRvQ2FsbENoYWluLCBhZmZlY3RlZCwgYXNzaWduLCBhc3NpZ25NYXAsIGJpbmRCeSwgYmluZEJ5S2V5LCBib29sZWFuUmVmLCBjb21wdXRlZCwgY29uZGl0aW9uYWwsIGNvbmRpdGlvbmFsSW5kZXgsIGNvbmRpdGlvbmFsUmVmLCBkZWxheWVkQmVoYXZpb3IsIGRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciwgZGVsYXllZFN1YnNjcmliZSwgZGVyZWYsIGRlcml2YXRlLCBlZmZlY3QsIGVmZmVjdGVkLCBpc09ic2VydmFibGUsIGl0ZXJhdGVkLCBsaW5rLCBtYWtlQXJyYXlPYnNlcnZhYmxlLCBtYWtlT2JqZWN0QXNzaWduYWJsZSwgbWFrZVJlc29sdmVkT3AsIG51bWJlclJlZiwgb2JzZXJ2YWJsZUJ5TWFwLCBvYnNlcnZhYmxlQnlTZXQsIG9ic2VydmUsIHByb21pc2VkLCBwcm9wUmVmLCByZWNvdmVyUmVhY3RpdmUsIHJlZiwgcmVtYXAsIHJlc29sdmVkLCBzYWZlLCBzcGVjaWFsaXplZFN1YnNjcmliZSwgc3RyaW5nUmVmLCBzdWJzY3JpYmVEaXJlY3RseSwgc3Vic2NyaWJlSW5wdXQsIHN1YnNjcmliZVBhaXJlZCwgc3Vic2NyaWJlVGhlbmFibGUsIHRyaWdnZXJXaXRoRGVsYXksIHVuYWZmZWN0ZWQsIHVuaWZpZWQsIHVud3JhcCwgdXNlT2JzZXJ2YWJsZSwgd3JhcFJlZiwgd3JhcFNldEFzQXJyYXkgfTsiXSwKICAibWFwcGluZ3MiOiAiQUFBQSxTQUFTLGlCQUFBQSxJQUFlLGFBQUFDLElBQVcsZ0JBQWdCQyxJQUFnQixZQUFBQyxJQUFVLFdBQUFDLEdBQVMsaUJBQUFDLElBQWUsY0FBQUMsSUFBWSxpQkFBQUMsSUFBZSxZQUFBQyxHQUFVLHFCQUFBQyxJQUFtQixhQUFBQyxHQUFXLGNBQUFDLEdBQVksZUFBQUMsR0FBYSxhQUFBQyxHQUFXLG1CQUFBQyxJQUFpQixnQkFBQUMsSUFBYyx3QkFBQUMsSUFBc0Isb0JBQUFDLElBQWtCLHVCQUFBQyxJQUFxQixZQUFZQyxJQUFZLGtCQUFBQyxTQUFzQjtBQUd0VixPQUFPLGVBQWUsdUJBQU8sSUFBSSxZQUFZO0FBQzdDLE9BQU8sY0FBYyx1QkFBTyxJQUFJLFdBQVc7QUFDM0MsT0FBTyxnQkFBZ0IsdUJBQU8sSUFBSSxhQUFhO0FBQy9DLElBQUlDLElBQVMsdUJBQU8sSUFBSSxRQUFRLEdBQzVCQyxJQUFlLHVCQUFPLElB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UztBQUFBLE1BQ1YsQ0FBQyxHQUNNZ0I7QUFBQSxJQUNSLENBQUM7QUFDRCxVQUFNaEIsSUFBV21RLElBQUtqWixDQUFNO0FBQzVCLFdBQUFpWixFQUFHalosQ0FBTSxJQUFJaUQsR0FDYmdXLElBQUt2WSxDQUFRLElBQUk7QUFBQSxNQUNoQixLQUFLO0FBQUEsTUFDTCxPQUFBdUM7QUFBQSxNQUNBLFVBQUE2RjtBQUFBLE1BQ0EsU0FBQTVCO0FBQUEsSUFDRCxDQUFDLEdBQ01qRTtBQUFBLEVBQ1I7QUFDQSxFQUFJaVcsS0FBZ0JHLEVBQWNsSixHQUFTLFVBQVU7QUFDckQsUUFBTW1CLElBQU16RSxFQUFTLENBQUMrRCxJQUFNLENBQUMsS0FBS0EsR0FBS2tILEtBQVUsT0FBTyxHQUFHLE1BQU07QUFDaEUsSUFBQXVCLEVBQWNWLEVBQUksR0FBRyxRQUFRO0FBQUEsRUFDOUIsQ0FBQztBQUNELFNBQUF6VyxFQUFlK1csR0FBSSxPQUFPLFNBQVMzSCxDQUFHLEdBQy9CMkg7QUFDUixHQUNJSyxLQUFtQixDQUFDM0gsR0FBSzdQLEdBQUlpUSxJQUFRLFFBQVE7QUFDaEQsTUFBSUc7QUFDSixTQUFPckYsRUFBUzhFLEdBQUssU0FBUyxDQUFDN0gsTUFBTTtBQUNwQyxJQUFJLENBQUNBLEtBQUtvSSxLQUNULGFBQWFBLENBQUUsR0FDZkEsSUFBSyxRQUNLcEksS0FBSyxDQUFDb0ksTUFBSUEsSUFBS0osR0FBaUJILEdBQUs3UCxHQUFJaVEsQ0FBSyxLQUFLRztBQUFBLEVBQy9ELENBQUM7QUFDRjsiLAogICJuYW1lcyI6IFsiJGF2b2lkVHJpZ2dlciIsICIkZ2V0VmFsdWUiLCAiJHRyaWdnZXJMb2NrJDEiLCAiUHJvbWlzZWQiLCAiYmluZEN0eCIsICJjYWxsQnlBbGxQcm9wIiwgImNhbGxCeVByb3AiLCAiZGVmYXVsdEJ5VHlwZSIsICJoYXNWYWx1ZSIsICJpc0FycmF5SW52YWxpZEtleSIsICJpc0tleVR5cGUiLCAiaXNOb3RFcXVhbCIsICJpc1ByaW1pdGl2ZSIsICJpc1Byb21pc2UiLCAibWFrZVRyaWdnZXJMZXNzIiwgIm9iamVjdEFzc2lnbiIsICJvYmplY3RBc3NpZ25Ob3RFcXVhbCIsICJwb3RlbnRpYWxseUFzeW5jIiwgInBvdGVudGlhbGx5QXN5bmNNYXAiLCAicmVzb2x2ZWQkMSIsICJ0cnlQYXJzZUJ5SGludCIsICIkdmFsdWUiLCAiJGV4dHJhY3RLZXkkIiwgIiRvcmlnaW5hbEtleSQiLCAiJHJlZ2lzdHJ5S2V5JCIsICIkYmVoYXZpb3IiLCAiJHByb21pc2UiLCAiJHJlc29sdmVkIiwgIiR0cmlnZ2VyTGVzcyIsICIkdHJpZ2dlckxvY2siLCAiJHRyaWdnZXJDb250cm9sIiwgIiR0cmlnZ2VyIiwgIiRhZmZlY3RlZCIsICIkaXNOb3RFcXVhbCIsICIkcmVhbFByb3AiLCAiJG9yaWdpbmFsT2JqZWN0cyQiLCAic2FmZSIsICJ0YXJnZXQiLCAidW53cmFwIiwgIm1hcHBlZCIsICJlIiwgIksiLCAiViIsICJhcnIiLCAiZGVyZWYiLCAiZGlzY291bnRWYWx1ZSIsICJvcmlnaW5hbCIsICIkdmFsIiwgImlzVGhlbmFibGUiLCAidmFsIiwgIndpdGhQcm9taXNlIiwgImNiIiwgImRpc3Bvc2VNYXAiLCAiZGlzcG9zZVJlZ2lzdHJ5IiwgImNhbGxzdGFjayIsICJhZGRUb0NhbGxDaGFpbiIsICJvYmoiLCAibWV0aG9kS2V5IiwgImNhbGxiYWNrIiwgImNoYWluVGFyZ2V0IiwgIkNhbGxDaGFpbiIsICJhcmdzIiwgImlzQXJyYXlJbmRleCIsICJwcm9wIiwgIm51bSIsICJ3cmFwU2V0QXNBcnJheSIsICJzb3VyY2UiLCAib3B0aW9ucyIsICJiYWNraW5nU2V0IiwgIm5vdGlmeUR1cGxpY2F0ZSIsICJ2YWx1ZSIsICJ2aWEiLCAiaW5kZXgiLCAiaXRlbSIsICJzbmFwc2hvdCIsICJyZWJ1aWxkRnJvbSIsICJtZXRob2RzIiwgIml0ZW1zIiwgInNpemUiLCAiaXRlcmF0b3IiLCAiY3VycmVudCIsICJ0b1ByZXBlbmQiLCAibmV4dCIsICJzdGFydCIsICJkZWxldGVDb3VudCIsICJub3JtYWxpemVkU3RhcnQiLCAiYWN0dWFsRGVsZXRlQ291bnQiLCAicmVtb3ZlZCIsICJpbnNlcnRQb3NpdGlvbiIsICJfIiwgIm5leHRMZW5ndGgiLCAibmV4dFZhbHVlIiwgImN1cnJlbnRWYWx1ZSIsICJpZHgiLCAia2V5cyIsICJpIiwgIkFzc2lnbk9iamVjdEhhbmRsZXIiLCAibmFtZSIsICJuZXdUIiwgImN0eCIsICJtYWtlT2JqZWN0QXNzaWduYWJsZSIsICJweCIsICJ3aXRoVW5zdWJTeW1ib2wiLCAid2l0aFVuc3ViIiwgImNvbXBsZXRlV2l0aFVuc3ViIiwgInN1YnNjcmliZXIiLCAid2VhayIsICJoYW5kbGVyIiwgInJlZ2lzdHJ5IiwgInNhdkNvbXBsZXRlIiwgInVuYWZmZWN0ZWQiLCAiciIsICJzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbCIsICJzdWJzY3JpcHRSZWdpc3RyeSIsICJnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2wiLCAiZ2xvYmFsRWZmZWN0TGlzdGVuZXJzIiwgImVmZmVjdEdsb2JhbGx5IiwgIm5vcm1hbGl6ZWQiLCAibm9ybWFsaXplRWZmZWN0T3B0aW9ucyIsICJ3cmFwcGVkU3ltYm9sIiwgIndyYXBwZWQiLCAicmVnaXN0ZXIiLCAid2hhdCIsICJoYW5kbGUiLCAiU3Vic2NyaXB0IiwgIndyYXBXaXRoIiwgImZvckFsbCIsICJ3aWxkY2FyZFRyaWdnZXJzIiwgInRyaWdnZXJBbGlhc2VzIiwgInRyaWdnZXJDYW5vbmljYWxOYW1lc1N5bWJvbCIsICJjYW5vbmljYWwiLCAiYWxpYXNlcyIsICJhbGlhcyIsICJ0cmlnZ2VyQ2Fub25pY2FsTmFtZXMiLCAibm9ybWFsaXplVHJpZ2dlck5hbWUiLCAidHJpZ2dlciIsICJ0cmlnZ2VyTmFtZXNPZiIsICJleHBhbmRUcmlnZ2VyRmlsdGVyIiwgInR5cGVzIiwgIm5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIiLCAidHJpZ2dlcnMiLCAibGlzdCIsICJ0cmlnZ2VyRmlsdGVyQWxsb3dzIiwgImZpbHRlciIsICJpc09wdGlvbnNPYmplY3QiLCAibm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zIiwgImFmZmVjdFR5cGVzIiwgIlN1YnNjcmlwdFN5bWJvbCIsICIjc291cmNlIiwgIiNsaXN0ZW5lcnMiLCAiI2ZsYWdzIiwgIiNuYXRpdmUiLCAiI2l0ZXJhdG9yIiwgIiNpbkRpc3BhdGNoIiwgIiNkaXNhYmxlZFRyaWdnZXJzIiwgIiN0cmlnZ2VyQ29udHJvbCIsICIjcGVuZGluZyIsICIjcGVuZGluZ0J5UHJvcCIsICIjZmx1c2hTY2hlZHVsZWQiLCAiZW5hYmxlZCIsICIjZGlzcGF0Y2giLCAiY29udHJvbGxlciIsICJyZXMiLCAib2xkVmFsdWUiLCAiZXRjIiwgImxpc3RlbmVycyIsICJyZWNvcmQiLCAiZXZlbnQiLCAibnciLCAibmFtZXMiLCAicHJldmlvdXMiLCAicmVzdG9yZSIsICJ3YXNEaXNhYmxlZCIsICJyZXN1bHQiLCAib3BLZXkiLCAiYnlPcCIsICJiYXRjaCIsICJvcE1hcCIsICJubSIsICJ2IiwgIm92IiwgInRnIiwgInJlc3QiLCAicmF3T2YiLCAidW53cmFwcGVkIiwgInJlc29sdmVkIiwgIm1vZGUiLCAicmF3IiwgIm1ha2VSZXNvbHZlZE9wIiwgImVtaXQiLCAicnVuIiwgInBlbmRpbmciLCAia2V5IiwgImNhbGxiYWNrT3JWYWx1ZSIsICJlbWl0UmVzb2x2ZWQiLCAiYmluZEV4aXN0aW5nVGhlbmFibGVzIiwgImxpdmUiLCAiX19zYWZlR2V0R3VhcmRTeW1ib2wiLCAiX19zeXN0ZW1Ta2lwIiwgInN5c3RlbVNraXBHZXQiLCAiZ290IiwgInNhZmVHZXQiLCAiX19zYWZlR2V0R3VhcmQiLCAiaXNHZXR0ZXIiLCAicHJvcE5hbWUiLCAiZmFsbFRocm91Z2giLCAidG1wIiwgInNhZmVTZXQiLCAiYWN0aXZlIiwgInJlYyIsICJoYXNPd24iLCAiaXNUcmlnZ2VyRW1pdE9wdGlvbnMiLCAiYWxsb3dWYWx1ZU9ubHkiLCAidHJpZ2dlck9wdGlvblZhbHVlIiwgImZhbGxiYWNrIiwgInRyaWdnZXJPcHRpb25UcmlnZ2VyIiwgImlzUnVudGltZUtleSIsICJyZWFsUHJvcE9mJDEiLCAidHJpZ2dlcktleU9mIiwgInRyaWdnZXJWYWx1ZU9mIiwgInJlYWxQcm9wIiwgImNyZWF0ZVRyaWdnZXJBUEkiLCAiYXBpIiwgIm9wT3JPcHRpb25zIiwgImNvbnRyb2wiLCAic3lzdGVtR2V0IiwgImFmZmVjdGVkIiwgIm9ic2VydmFibGVBUElNZXRob2RzIiwgInVzdWIiLCAiY29tcCIsICJPYnNlcnZlQXJyYXlNZXRob2QiLCAiI25hbWUiLCAiI3NlbGYiLCAiI2hhbmRsZSIsICJzZWxmIiwgInNraXAiLCAiYWRkZWQiLCAic2V0UGFpcnMiLCAib2xkU3RhdGUiLCAib2JzZXJ2ZUFycmF5IiwgIm5ld1ZhbHVlIiwgInJlZyIsICJJIiwgInBhaXIiLCAidHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UiLCAib2xkTGVuIiwgIm5ld0xlbiIsICJyZW1vdmVkSXRlbXMiLCAiYWRkZWRDb3VudCIsICJPYnNlcnZlQXJyYXlIYW5kbGVyIiwgInN5cyIsICJvYnMiLCAib2xkIiwgInh5enciLCAicmdiYSIsICJ4eXp3X2lkeCIsICJyZ2JhX2lkeCIsICJPYnNlcnZlT2JqZWN0SGFuZGxlciIsICJoaW50IiwgImZ0IiwgIiRvcmlnaW5hbCIsICJ0cmlnZ2VyTmFtZSIsICJzdWJzY3JpcHQiLCAiZGVzY3JpcHRvciIsICIkcmVzdWx0IiwgIk9ic2VydmVNYXBIYW5kbGVyIiwgInZhbHVlT3JGeCIsICJvbGRWYWx1ZXMiLCAiaGFkIiwgImNvbXB1dGVkIiwgImRlZmF1bHRPckNvbXB1dGUiLCAiaW5jb21pbmciLCAiT2JzZXJ2ZVNldEhhbmRsZXIiLCAiJGlzT2JzZXJ2YWJsZSIsICJvYnNlcnZlT2JqZWN0IiwgIm9ic2VydmVNYXAiLCAibWFwIiwgIm9ic2VydmVTZXQiLCAic2V0IiwgIm51bWJlclJlZiIsICJpbml0aWFsIiwgImJlaGF2aW9yIiwgIiRyIiwgIm9ic2VydmUiLCAic3RyaW5nUmVmIiwgImJvb2xlYW5SZWYiLCAid3JhcFJlZiIsICJtYXJrUmVhbFByb3AiLCAicHJvcFJlZiIsICJzcmMiLCAic3JjUHJvcCIsICJpc01hcCIsICJpc1NldCIsICJyZWFkU2xvdCIsICJ3cml0ZVNsb3QiLCAibWVtYmVyIiwgImlzT2JzZXJ2YWJsZSIsICJyZWNvdmVyUmVhY3RpdmUiLCAic2xvdCIsICJ1c2IiLCAiX3Byb3AiLCAicHJldiIsICIkcmVmIiwgInR5cGVkIiwgInJlZiIsICJwcm9taXNlZCIsICJwcm9taXNlIiwgInRyaWdnZXJXaXRoRGVsYXkiLCAiZGVsYXkiLCAiZGVsYXllZEJlaGF2aW9yIiwgInNpZyIsICJ0bSIsICJkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IiLCAic3RhdGVOYW1lIiwgInJlYWN0aXZlIiwgInVzZU9ic2VydmFibGUiLCAib2JzZXJ2YWJsZSIsICJzcGVjaWFsaXplZFN1YnNjcmliZSIsICJjaGVja1ZhbGlkT2JqIiwgImluaXRpYWxUcmlnZ2VyIiwgInJlYWxQcm9wT2YiLCAibm9ybWFsaXplQWZmZWN0ZWRQcm9wIiwgInByb3BWYWx1ZU9mIiwgImNhbGxCeVByb3BSZWZBd2FyZSIsICJ3aXRoVHJpZ2dlciIsICJzdWJzY3JpYmVEaXJlY3RseSIsICJ0UHJvcCIsICJpbml0aWFsQ2IiLCAidW5TdWIiLCAic3Vic2NyaWJlSW5wdXQiLCAiJG9wdCIsICIkY2IiLCAiZXYiLCAiY2hlY2tJc1BhaXJlZCIsICJpc0VmZmVjdE9wdGlvbnNBcmciLCAibm9ybWFsaXplRWZmZWN0VGFyZ2V0cyIsICJ0YXJnZXRzIiwgImVmZmVjdFRhcmdldENvbnRleHQiLCAidG9FZmZlY3RFdmVudCIsICJzdWJzY3JpYmVQYWlyZWQiLCAic3Vic2NyaWJlVGhlbmFibGUiLCAiZWZmZWN0IiwgImFmZmVjdGVkT3B0aW9ucyIsICJkaXNwb3NlcnMiLCAiZGlzcG9zZSIsICJlZmZlY3RlZCIsICJtYWtlQXJyYXlPYnNlcnZhYmxlIiwgIm9ic2VydmFibGVCeVNldCIsICJvYnNlcnZhYmxlQnlNYXAiLCAiRG91YmxlV2Vha01hcCIsICIjdG9wIiwgIiNlbnN1cmVJbm5lciIsICJrZXkxIiwgImlubmVyIiwgIiNzcGxpdFBhaXIiLCAia2V5MiIsICJmYWN0b3J5IiwgImNvbXB1dGUiLCAicmVnaXN0ZXJlZEl0ZXJhdGVkIiwgIml0ZXJhdGVkIiwgIiRzdWIiLCAiZW50cmllcyIsICJiYXNpcyIsICJvZk9sZCIsICJvZk5ldyIsICJpc1BhaXIiLCAiYmluZEJ5IiwgIndhdGNoIiwgInAiLCAiTiIsICJrIiwgImRlcml2YXRlIiwgImZyb20iLCAicmVhY3RGbiIsICJiaW5kQnlLZXkiLCAiY29uZGl0aW9uYWxJbmRleCIsICJjb25kTGlzdCIsICJyZWFkQ29uZGl0aW9uIiwgImNvbmRpdGlvbiIsICJpbnZhbGlkYXRlIiwgImNvbmRpdGlvbmFsUmVmIiwgImNvbmQiLCAiaWZUcnVlIiwgImlmRmFsc2UiLCAiZ2V0VHJ1ZSIsICJnZXRGYWxzZSIsICJ2YWx1ZU9mIiwgIm4iLCAiY29uZGl0aW9uYWwiLCAicmVtYXAiLCAic3ViIiwgImRlc3QiLCAidW5pZmllZCIsICJzdWJzIiwgImluaXRpYWxFbnRyaWVzIiwgImFzc2lnbk1hcCIsICJhc3NpZ24iLCAiYSIsICJiIiwgImlzQUNvbXB1dGUiLCAiaXNCQ29tcHV0ZSIsICJjbXBCRm5jIiwgImlzQVByb3AiLCAiYV9wcm9wIiwgImlzQlByb3AiLCAiYl9wcm9wIiwgImFfdG1wIiwgImFSZWYiLCAiYl90bXAiLCAiYlJlZiIsICJjbXBmeCIsICJudiIsICJzdG9yZSIsICJsaW5rIiwgImMiLCAib2xkQXJnIiwgImNtcCIsICJhcmciLCAiZm9yY2UiLCAid3JwRnVuYyIsICJvbGRBcmckIiwgIm9wIiwgInJmIiwgInBlbmRpbmdJbml0aWFsIiwgIiRhcHBseSIsICJjcCIsICJ3cml0ZUNvbXB1dGVkIiwgImRlbGF5ZWRTdWJzY3JpYmUiXQp9Cg==
