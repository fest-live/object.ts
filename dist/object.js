import { $avoidTrigger as ue, $getValue as Be, $triggerLock as Ke, Promised as Ge, bindCtx as H, callByAllProp as Ze, callByProp as dt, defaultByType as ht, hasValue as M, isArrayInvalidKey as te, isKeyType as N, isNotEqual as x, isPrimitive as A, isPromise as E, makeTriggerLess as ve, objectAssign as ce, objectAssignNotEqual as vt, potentiallyAsync as Me, potentiallyAsyncMap as He, resolved as Oe, tryParseByHint as _ } from "@fest-lib/core";
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var d = /* @__PURE__ */ Symbol.for("@value"), m = /* @__PURE__ */ Symbol.for("@extract"), W = /* @__PURE__ */ Symbol.for("@origin"), re = /* @__PURE__ */ Symbol.for("@registry"), F = /* @__PURE__ */ Symbol.for("@behavior"), k = /* @__PURE__ */ Symbol.for("@promise"), Le = /* @__PURE__ */ Symbol.for("@resolved"), pe = /* @__PURE__ */ Symbol.for("@trigger-less"), h = /* @__PURE__ */ Symbol.for("@trigger-lock"), pt = /* @__PURE__ */ Symbol.for("@trigger-control"), P = /* @__PURE__ */ Symbol.for("@trigger"), ne = /* @__PURE__ */ Symbol.for("@subscribe"), bt = /* @__PURE__ */ Symbol.for("@isNotEqual"), ye = /* @__PURE__ */ Symbol.for("@realProp"), Fe = /* @__PURE__ */ new WeakMap(), fe = (e) => {
  const t = typeof e == "object" || typeof e == "function" ? e?.[m] ?? e : e, r = (n) => fe(n);
  return Array.isArray(t) ? t?.map?.(r) || Array.from(t || [])?.map?.(r) || [] : t instanceof Map || t instanceof WeakMap ? new Map(Array.from(t?.entries?.() || [])?.map?.(([n, l]) => [n, fe(l)])) : t instanceof Set || t instanceof WeakSet ? new Set(Array.from(t?.values?.() || [])?.map?.(r)) : t != null && typeof t == "function" || typeof t == "object" ? Object.fromEntries(Array.from(Object.entries(t || {}) || [])?.filter?.(([n]) => n != m && n != W && n != re)?.map?.(([n, l]) => [n, fe(l)])) : t;
}, St = (e) => e?.[m] ?? e?.["@target"] ?? e, V = (e, t = !1) => {
  const r = e;
  if (A(e) || typeof e == "symbol") return e;
  if (e != null && (e instanceof WeakRef || "deref" in e && typeof e?.deref == "function") && (e = e?.deref?.()), e != null && (typeof e == "object" || typeof e == "function")) {
    e = St(e);
    const n = t && M(e) && e?.value;
    if (n != null && (typeof n == "object" || typeof n == "function") && (e = n), r != e) return V(e, t);
  }
  return e;
}, oe = (e) => e != null && typeof e.then == "function", mt = (e, t) => A(e) || typeof e == "function" ? t?.(e) : oe(e) ? e.then(t) : typeof e?.resolved == "function" ? Promise.resolve(e.resolved()).then(t) : e?.promise && oe(e.promise) ? e.promise.then(t) : e?.[k] && oe(e[k]) ? e[k].then(t) : t?.(e), je = /* @__PURE__ */ new WeakMap(), gt = new FinalizationRegistry((e) => {
  e?.forEach?.((t) => t?.());
});
function I(e, t, r) {
  if (!(!r || typeof r != "function" || typeof e != "object" && typeof e != "function"))
    if (t == Symbol.dispose) {
      const n = e?.[m] ?? e;
      je?.getOrInsertComputed?.(n, () => {
        const l = /* @__PURE__ */ new Set();
        return (typeof n == "object" || typeof n == "function") && (gt.register(n, l), je.set(n, l), n[Symbol.dispose] ??= () => l.forEach((u) => {
          u?.();
        })), l;
      })?.add?.(r);
    } else e[t] = function(...n) {
      const l = e?.[t];
      typeof l == "function" && l.apply(this, n), r.apply(this, n);
    };
}
var Y = (e) => {
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
  const l = () => Array.from(r), u = (i) => {
    r.clear();
    for (const f of i) r.add(f);
  }, s = {
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
      const y = [...o, ...f];
      return u(y), y.length;
    },
    splice: (i, f, ...o) => {
      const y = l(), a = Math.min(Math.max(i, 0), y.length), v = f === void 0 ? y.length - a : Math.max(0, Math.min(f, y.length - a)), p = y.splice(a, v);
      let g = a;
      for (const w of o) {
        if (y.includes(w)) {
          n(w, "splice", g);
          continue;
        }
        y.splice(g++, 0, w);
      }
      return u(y), p;
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
  return new Proxy(s, {
    get: (i, f) => {
      if (f === "length") return r.size;
      if (Y(f)) return l()[Number(f)];
      const o = s[f];
      return o;
    },
    set: (i, f, o) => {
      if (f === "length") {
        if (typeof o != "number" || !Number.isFinite(o) || o < 0) throw new RangeError("length must be a finite non-negative number");
        const y = Math.floor(o);
        if (y >= r.size) return !0;
        const a = l().slice(0, y);
        return u(a), !0;
      }
      if (Y(f)) {
        const y = l(), a = Number(f);
        if (a > y.length) return !0;
        const v = o;
        if (a < y.length) {
          const p = y[a];
          if (Object.is(p, v)) return !0;
          if (y.some((g, w) => w !== a && Object.is(g, v)))
            return n(v, "set", a), !0;
          y[a] = v;
        } else {
          if (y.includes(v))
            return n(v, "set", a), !0;
          y.push(v);
        }
        return u(y), !0;
      }
      return Reflect.set(s, f, o);
    },
    deleteProperty: (i, f) => {
      if (f === "length") return !1;
      if (Y(f)) {
        const o = l(), y = Number(f);
        return y >= o.length || (o.splice(y, 1), u(o)), !0;
      }
      return Reflect.deleteProperty(s, f);
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
      if (Y(f)) {
        const o = l(), y = Number(f);
        return y >= o.length ? void 0 : {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          value: o[y]
        };
      }
      return Reflect.getOwnPropertyDescriptor(s, f);
    },
    has: (i, f) => {
      if (f === "length") return !0;
      if (Y(f)) {
        const o = Number(f);
        return o >= 0 && o < r.size;
      }
      return f in s;
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
    return ce(e, r, t), !0;
  }
  get(e, t, r) {
    return typeof t == "symbol" ? e?.[t] ?? e : Reflect.get(e, t, r);
  }
}, hr = (e) => {
  if (e?.[W] || Fe.has(e)) return e;
  const t = new Proxy(e, new wt());
  return Fe.set(t, e), t;
}, et = /* @__PURE__ */ Symbol.for("object.ts@withUnsub");
globalThis[et] ??= /* @__PURE__ */ new WeakMap();
var At = globalThis[et], Ot = (e, t, r) => At.getOrInsert(e, () => {
  const n = t?.deref?.();
  n?.affected?.(r);
  const l = e?.complete?.bind?.(e), u = () => {
    const s = l?.();
    return n?.unaffected?.(r), s;
  };
  return e.complete = u, {
    unaffected: u,
    [Symbol.dispose]: u,
    [Symbol.asyncDispose]: u
  };
}), tt = /* @__PURE__ */ Symbol.for("object.ts@subscriptRegistry");
globalThis[tt] ??= /* @__PURE__ */ new WeakMap();
var b = globalThis[tt] ??= /* @__PURE__ */ new WeakMap(), rt = /* @__PURE__ */ Symbol.for("object.ts@globalEffectListeners");
globalThis[rt] ??= /* @__PURE__ */ new Map();
var ae = globalThis[rt], qe = (e, t = ["*"]) => {
  if (e == null || typeof e != "function") return;
  const r = ft(t);
  return ae.set(e, r.affectTypes), () => ae.delete(e);
}, nt = /* @__PURE__ */ Symbol.for("object.ts@wrapped");
globalThis[nt] ??= /* @__PURE__ */ new WeakMap();
var Tt = globalThis[nt], xt = (e, t) => {
  const r = e?.[m] ?? e;
  let n = b.get(r);
  return n ? n.bindSource(r) : (n = new It(r), b.set(r, n)), t;
}, se = (e, t) => (e = V(e?.[m] ?? e), typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || e == null ? e : Tt.getOrInsertComputed(e, () => new Proxy(e, xt(e, t)))), Z = /* @__PURE__ */ Symbol.for("@allProps"), lt = /* @__PURE__ */ new Set(["*", "all"]), ke = /* @__PURE__ */ new Map([
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
globalThis[it] ??= new Map(Array.from(ke.entries()).flatMap(([e, t]) => t.map((r) => [r, e])));
var Rt = globalThis[it], le = (e = "set") => {
  if (e == null) return e;
  const t = String(e || "set");
  return Rt.get(t) ?? t;
}, st = (e) => {
  const t = e == null ? "all" : String(le(e) ?? "all");
  return [t, ...ke.get(t) ?? []];
}, Ue = (e = ["*"]) => new Set([...U(e)].flatMap((t) => [t, ...ke.get(t) ?? []])), U = (e = ["*"]) => {
  const t = typeof e == "string" ? [e] : Array.from(e ?? ["*"]), r = new Set(t.map((n) => {
    const l = String(n || "*");
    return lt.has(l) ? l : String(le(l) ?? l);
  }));
  return r.size ? r : /* @__PURE__ */ new Set(["*"]);
}, q = (e, t) => {
  const r = e instanceof Set ? e : U(e);
  return [...lt].some((n) => r.has(n)) || st(t).some((n) => r.has(n));
}, ut = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), be = (e = ["*"]) => {
  if (ut(e)) return {
    affectTypes: U(e.affectTypes ?? e.triggers ?? ["*"]),
    triggerImmediately: e.triggerImmediately !== !1
  };
  const t = U(e);
  return {
    affectTypes: t,
    triggerImmediately: q(t, "initial")
  };
}, ft = (e = ["*"]) => ut(e) ? {
  affectTypes: U(e.affectTypes ?? e.triggers ?? ["*"]),
  triggerImmediately: e.triggerImmediately === !0
} : {
  affectTypes: U(e),
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
  #s = !1;
  constructor(t) {
    this.#r = t, this.#e = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new WeakSet(), this.#c = {
      enable: (l = ["*"], u) => u ? this.withTriggers(l, !0, u) : this.setTriggersEnabled(l, !0),
      disable: (l = ["*"], u) => u ? this.withTriggers(l, !1, u) : this.setTriggersEnabled(l, !1),
      set: (l, u) => this.setTriggersEnabled(l, u),
      with: (l, u) => this.withTriggers(l, !0, u),
      without: (l, u) => this.withTriggers(l, !1, u),
      isEnabled: (l) => this.isTriggerEnabled(l)
    }, this.#o = { next: (l) => {
      l && (Array.isArray(l) ? this.#u(...l) : this.#u(l));
    } };
    const r = new WeakRef(this), n = function(l) {
      const u = l?.next?.bind?.(l);
      return Ot(l, r, u);
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
  #u(t, r = null, n, l = "all", ...u) {
    l = le(l) ?? l;
    const s = this.#e;
    if (s?.size)
      for (const [i, f] of s.entries()) (f.prop === t || f.prop === Z || f.prop === null) && q(f.triggers, l) && this.$safeExec(i, r, t, n, l, ...u);
    if (ae.size) {
      const i = {
        source: this.#r,
        target: this.#r,
        value: r,
        prop: t,
        name: t,
        oldValue: n,
        trigger: l,
        args: u
      };
      for (const [f, o] of ae.entries()) q(o, l) && this.$safeExec(f, i);
    }
  }
  wrap(t) {
    return Array.isArray(t) ? se(t, this) : t;
  }
  get triggerControl() {
    return this.#c;
  }
  isTriggerEnabled(t) {
    return !q(this.#n, "all") && !st(t).some((r) => this.#n.has(r));
  }
  setTriggersEnabled(t = ["*"], r = !0) {
    const n = Ue(t);
    for (const l of n) r ? this.#n.delete(l) : this.#n.add(l);
  }
  withTriggers(t, r, n) {
    const l = [...Ue(t)], u = new Map(l.map((i) => [i, this.#n.has(i)])), s = () => {
      u.forEach((i, f) => {
        i ? this.#n.add(f) : this.#n.delete(f);
      });
    };
    this.setTriggersEnabled(l, r);
    try {
      const i = n?.();
      return i && typeof i.finally == "function" ? i.finally(s) : (s(), i);
    } catch (i) {
      throw s(), i;
    }
  }
  affected(t, r, n = ["*"]) {
    if (t == null || typeof t != "function") return;
    const l = be(n);
    return this.#e.set(t, {
      prop: r || Z,
      triggers: l.affectTypes
    }), () => this.unaffected(t, r || Z);
  }
  unaffected(t, r) {
    if (t != null && typeof t == "function") {
      const n = this.#e, l = n?.get(t);
      if (l && (l.prop == r || r == null || r == Z))
        return n.delete(t), () => this.affected(t, r || Z, l.triggers);
    }
    return this.#e.clear();
  }
  trigger(t, r, n, l = "set", ...u) {
    if (typeof t == "symbol" || (l === void 0 && (l = "set"), l = le(l) ?? l, !this.isTriggerEnabled(l))) return;
    const s = `${l ?? "all"}`;
    let i = this.#l.get(t);
    i || (i = /* @__PURE__ */ new Map(), this.#l.set(t, i)), i.set(s, [
      t,
      r,
      n,
      l,
      u
    ]), !this.#s && (this.#s = !0, queueMicrotask(() => {
      this.#s = !1;
      const f = this.#l;
      this.#l = /* @__PURE__ */ new Map();
      for (const [o, y] of f)
        if (!(o != null && this.#i.has(o))) {
          o != null && this.#i.add(o);
          try {
            for (const [, a] of y) {
              const [v, p, g, w, O] = a;
              try {
                this.#u(v, p, g, w, ...O ?? []);
              } catch (C) {
                console.warn(C);
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
var It = globalThis[ot], $e = (e) => {
  const t = V(e);
  return t?.[m] ?? t;
};
function Je(e, t = "all") {
  const r = $e(e);
  return E(r) ? Oe(r, t) : E(r?.[k]) ? Oe(r[k], t) : Oe(r ?? e, t);
}
function ct(e, t = !1) {
  const r = ((n = "all") => {
    const l = Je(e, n);
    return t ? l.then((u) => {
      const s = $e(e), i = s?.realProp ?? (s && "value" in s ? "value" : null);
      return b.get(s)?.trigger?.(i, u, void 0, "resolved"), u;
    }) : l;
  });
  return r.all = () => r("all"), r.allSettled = () => r("settled"), r.allKeyed = () => r("all"), r.allSettledKeyed = () => r("settled"), r.try = (n, ...l) => Promise.try(n, ...l).then((u) => Je(u ?? e, "all")), r;
}
function ie(e, t, r, n) {
  const l = $e(e) ?? e;
  b.get(l)?.trigger?.(t, r, n, "resolved");
}
function _e(e, t) {
  if (e == null || t == null) return e;
  if (Array.isArray(t))
    return t.forEach((r, n) => {
      E(r) && (e[n] = r);
    }), e;
  if (t instanceof Map) {
    for (const [r, n] of t.entries()) E(n) && e.set(r, n);
    return e;
  }
  if (t instanceof Set) return e;
  for (const r of Reflect.ownKeys(t)) {
    if (r == m || r == k || r == Le || !Object.getOwnPropertyDescriptor(t, r)?.enumerable) continue;
    const n = t[r];
    E(n) && (e[r] = n);
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
]), L = (e, t) => {
  if (!Et.has(t)) return null;
  const r = c(e, t);
  return typeof r == "function" ? H(e, r) : r;
}, T = globalThis[Pt] ??= /* @__PURE__ */ new WeakMap();
function Mt(e, t) {
  let r = !0;
  try {
    T?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), T?.get?.(e)?.has?.(t) && (r = !0), r = typeof Reflect.getOwnPropertyDescriptor(e, t)?.get == "function";
  } catch {
    r = !0;
  } finally {
    T?.get?.(e)?.delete?.(t);
  }
  return r;
}
var G = (e, t) => {
  if (A(e)) return e;
  const r = c(e, t);
  if (r == null && t != "value") {
    const n = c(e, "value");
    return n != null && !A(n) ? G(n, t) : r;
  } else if (t == "value" && r != null && !A(r) && typeof r != "function") return G(r, t) ?? r ?? e;
  return r ?? e;
}, kt = (e, t, r) => {
  if (e == null) return !1;
  let n = __safeSetGuard?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  return n?.has?.(t) ? !1 : (n?.add?.(t), Reflect.set(e, t, r));
}, c = (e, t, r) => {
  let n;
  if (e == null) return e;
  let l = T?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  if (l?.has?.(t)) return null;
  if (!Mt(e, t)) n ??= Reflect.get(e, t, r ?? e);
  else {
    l?.add?.(t);
    try {
      n = Reflect.get(e, t, r ?? e);
    } catch {
      n = void 0;
    } finally {
      l.delete(t), l?.size === 0 && T?.delete?.(e);
    }
  }
  return typeof n == "function" ? H(e, n) : n;
}, $ = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Te = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && ($(e, "key") || $(e, "name") || $(e, "oldValue") || $(e, "old") || $(e, "op") || $(e, "trigger") || t && $(e, "value")), D = (e, t, r) => $(e, t) ? e[t] : t == "oldValue" && $(e, "old") ? e.old : r(), Se = (e, t = "manual") => le(e.trigger ?? e.op ?? t), $t = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", de = (e) => {
  const t = c(e, ye) ?? c(e, "realProp");
  return $t(t) ? t : null;
}, Qe = (e, t) => t == "value" ? de(e) ?? t : t, _t = (e, t) => {
  const r = de(e);
  return r != null && t == r ? c(e, "value") ?? c(e, d) ?? c(e, t) : t == null ? void 0 : c(e, t);
}, me = (e, t, r) => {
  const n = (u, s, i) => (Te(s) || (i ??= s), t(Te(u) ? u : Te(s, !0) ? {
    key: u,
    trigger: i,
    ...s
  } : {
    key: u,
    trigger: i ?? s
  })), l = e?.triggerControl;
  return l && Object.assign(n, l), n.custom = (u, s, i, f) => n({
    key: s,
    trigger: u,
    value: i,
    oldValue: f
  }), r != null && (n.resolved = ct(r, !0)), n;
}, ge = (e, t, r) => {
  if (e == null || A(e)) return e;
  if (([
    "deref",
    "bind",
    "@target",
    W,
    m,
    re
  ].indexOf(t) < 0 ? c(e, t)?.bind?.(e) : null) != null) return null;
  if ([m, W].indexOf(t) >= 0) return c(e, t) ?? e;
  if (t == d) return c(e, t) ?? c(e, "value");
  if (t == re) return r;
  if (t == Le || t == "resolved" && !Object.prototype.hasOwnProperty.call(e, "resolved")) return ct(e);
  if (t == pt) return r?.triggerControl;
  if (t == Symbol.observable) return r?.compatible;
  if (t == Symbol.subscribe) return (n, l, u) => S(l != null ? [e, l] : e, n, u);
  if (t == Symbol.iterator || t == Symbol.asyncIterator) return c(e, t);
  if (t == Symbol.dispose) return (n) => {
    c(e, Symbol.dispose)?.(n), Ie(n != null ? [e, n] : e);
  };
  if (t == Symbol.asyncDispose) return (n) => {
    c(e, Symbol.asyncDispose)?.(n), Ie(n != null ? [e, n] : e);
  };
  if (t == Symbol.unsubscribe) return (n) => Ie(n != null ? [e, n] : e);
  if (typeof t == "symbol" && (t in e || c(e, t) != null)) return c(e, t);
}, we = (e, t, r) => {
  if (t == "subscribe") return r?.compatible?.[t] ?? ((n) => {
    if (typeof n == "function") return S(e, n);
    if ("next" in n && n?.next != null) {
      const l = S(e, n?.next), u = n?.complete;
      return n.complete = (...s) => (l?.(), u?.(...s)), n.complete;
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
    const n = L(e, t);
    return n ?? Reflect.get(e, t, r);
  }
  apply(e, t, r) {
    let n = [], l = [], u = [], s = [...this.#e], i = -1;
    const f = Reflect.apply(e, t || this.#e, r);
    if (this.#t?.[h])
      return Array.isArray(f) ? Pe(f) : f;
    switch (this.#r) {
      case "push":
        i = s?.length, n = r;
        break;
      case "unshift":
        i = 0, n = r;
        break;
      case "pop":
        i = s?.length - 1, s.length > 0 && (l = [s[i]]);
        break;
      case "shift":
        i = 0, s.length > 0 && (l = [s[i]]);
        break;
      case "splice":
        i = r[0];
        for (let y = 0; y < Math.max(s.length, this.#e.length); y++) {
          const a = s[y], v = this.#e[y];
          v === void 0 && y >= this.#e.length ? l.push(a) : a === void 0 && y >= s.length ? u.push([
            y,
            v,
            void 0,
            !1
          ]) : x(a, v) && u.push([
            y,
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
        for (let y = 0; y < s.length; y++) x(s[y], this.#e[y]) && u.push([
          i + y,
          this.#e[y],
          s[y],
          !0
        ]);
        break;
      case "set":
        i = r[1], u.push([
          i,
          r[0],
          s?.[i],
          i in s
        ]);
    }
    const o = b.get(this.#e);
    return n?.length == 1 ? o?.trigger?.(i, n[0], null, "add") : n?.length > 1 && (o?.trigger?.(i, n, null, "addAll"), n.forEach((y, a) => o?.trigger?.(i + a, y, null, "add"))), u?.length == 1 ? o?.trigger?.(u[0]?.[0] ?? i, u[0]?.[1], u[0]?.[2], u[0]?.[3] === !1 ? "add" : "set") : u?.length > 1 && (o?.trigger?.(i, u, s, "setAll"), u.forEach((y, a) => o?.trigger?.(y?.[0] ?? i + a, y?.[1], y?.[2], y?.[3] === !1 ? "add" : "set"))), l?.length == 1 ? o?.trigger?.(i, null, l[0], "delete") : l?.length > 1 && (o?.trigger?.(i, null, l, "deleteAll"), l.forEach((y, a) => o?.trigger?.(i + a, null, y, "delete"))), f == e ? new Proxy(f, this.#t) : Array.isArray(f) ? Pe(f) : f;
  }
}, Wt = (e, t, r, n) => {
  const l = Number.isInteger(r) && Number.isInteger(n) && n < r ? t.slice(n, r) : [];
  if (!e[h] && r !== n) {
    const u = b.get(t);
    l.length === 1 ? u?.trigger?.(n, null, l[0], "delete") : l.length > 1 && (u?.trigger?.(n, null, l, "deleteAll"), l.forEach((i, f) => u?.trigger?.(n + f, null, i, "delete")));
    const s = Number.isInteger(r) && Number.isInteger(n) && n > r ? n - r : 0;
    if (s === 1) u?.trigger?.(r, void 0, null, "add");
    else if (s > 1) {
      const i = Array(s).fill(void 0);
      u?.trigger?.(r, i, null, "addAll"), i.forEach((f, o) => u?.trigger?.(r + o, void 0, null, "add"));
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
    const n = L(e, t);
    if (n != null) return n;
    if ([
      m,
      W,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? c(e, t)?.bind?.(e) : c(e, t);
    const l = b?.get?.(e), u = ge(e, t, l);
    if (u != null) return u;
    const s = we(e, t, l);
    if (s != null) return s;
    if (t == pe) return ve.call(this, this);
    if (t == P) return me(l, (f) => {
      const o = f.key ?? f.name ?? 0, y = D(f, "value", () => c(e, o)), a = D(f, "oldValue", () => {
      });
      return l?.trigger?.(o, y, a, Se(f, "manual"));
    }, e);
    if (t == "@target" || t == m) return e;
    if (t == "x") return () => e?.x ?? e?.[0];
    if (t == "y") return () => e?.y ?? e?.[1];
    if (t == "z") return () => e?.z ?? e?.[2];
    if (t == "w") return () => e?.w ?? e?.[3];
    if (t == "r") return () => e?.r ?? e?.[0];
    if (t == "g") return () => e?.g ?? e?.[1];
    if (t == "b") return () => e?.b ?? e?.[2];
    if (t == "a") return () => e?.a ?? e?.[3];
    const i = c(e, t) ?? (t == "value" ? c(e, d) : null);
    return typeof i == "function" ? new Proxy(typeof i == "function" ? i?.bind?.(e) : i, new Vt(t, e, this)) : i;
  }
  set(e, t, r) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h && r)
      return this[h] = !!r, !0;
    if (t == h && !r)
      return delete this[h], !0;
    const n = E(r);
    return Me(r, (l) => {
      const u = c(e, t), s = [
        "x",
        "y",
        "z",
        "w"
      ], i = [
        "r",
        "g",
        "b",
        "a"
      ], f = s.indexOf(t), o = i.indexOf(t);
      let y = !1;
      return f >= 0 ? y = Reflect.set(e, f, l) : o >= 0 ? y = Reflect.set(e, o, l) : y = Reflect.set(e, t, l), t == "length" && x(u, l) && Wt(this, e, u, l), !this[h] && typeof t != "symbol" && (x(u, l) && b?.get?.(e)?.trigger?.(t, l, u, "set"), n && ie(e, t, l, u)), y;
    });
  }
  deleteProperty(e, t) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h)
      return delete this[h], !0;
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != "length" && t != h && typeof t != "symbol" && r != null && b.get(e)?.trigger?.(t, t, r, "delete"), n;
  }
}, Ct = class {
  [h];
  constructor() {
  }
  get(e, t, r) {
    if ([
      m,
      W,
      "@target",
      "deref",
      "then",
      "catch",
      "finally"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? H(e, c(e, t)) : c(e, t);
    const n = b.get(e) ?? b.get(c(e, "value") ?? e), l = ge(e, t, n);
    if (l != null) return l;
    c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const u = we(e, t, n);
    return u ?? (t == pe ? ve.call(this, this) : t == P ? me(n, (s) => {
      const i = Qe(e, s.key ?? s.name ?? de(e) ?? "value"), f = D(s, "oldValue", () => i == "value" || i == de(e) ? c(e, d) : void 0), o = D(s, "value", () => _t(e, i));
      return n?.trigger?.(i, o, f, Se(s, "manual"));
    }, e) : t == Symbol.toPrimitive ? (s) => {
      const i = G(e, t);
      return c(i, t) ? c(i, t)?.(s) : A(i) ? _(i, s) : A(c(i, "value")) ? _(c(i, "value"), s) : _(c(i, "value") ?? i, s);
    } : t == Symbol.toStringTag ? () => {
      const s = G(e, t);
      return c(s, t) ? c(s, t)?.() : A(s) ? String(s ?? "") || "" : A(c(s, "value")) ? String(c(s, "value") ?? "") || "" : String(c(s, "value") ?? s ?? "") || "";
    } : t == "toString" ? () => {
      const s = G(e, t);
      return c(s, t) ? c(s, t)?.() : c(s, Symbol.toStringTag) ? c(s, Symbol.toStringTag)?.() : A(s) ? String(s ?? "") || "" : A(c(s, "value")) ? String(c(s, "value") ?? "") || "" : String(c(s, "value") ?? s ?? "") || "";
    } : t == "valueOf" ? () => {
      const s = G(e, t);
      return c(s, t) ? c(s, t)?.() : c(s, Symbol.toPrimitive) ? c(s, Symbol.toPrimitive)?.() : A(s) ? s : A(c(s, "value")) ? c(s, "value") : c(s, "value") ?? s;
    } : typeof t == "symbol" && (t in e || c(e, t) != null) ? c(e, t) : G(e, t));
  }
  apply(e, t, r) {
    return Reflect.apply(e, t, r);
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
      T?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), T?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      T?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  has(e, t) {
    return t in e;
  }
  set(e, t, r) {
    const n = L(e, t);
    return n ?? Me(r, (l) => {
      const u = L(l, t);
      if (u != null) return u;
      if (t == h && r)
        return this[h] = !!r, !0;
      if (t == h && !r)
        return delete this[h], !0;
      const s = e;
      if (c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), typeof t == "symbol" && !(c(e, t) != null && t in e)) return;
      const i = Qe(e, t), f = t == "value" ? c(e, d) ?? c(e, t) : c(e, t);
      e[t] = l;
      const o = c(e, t) ?? l;
      if (!this[h] && typeof t != "symbol") {
        const y = b.get(e) ?? b.get(s);
        (c(e, bt) ?? x)?.(f, o) && y?.trigger?.(i, l, f), E(r) && ie(s, i, l, f);
      }
      return !0;
    });
  }
  defineProperty(e, t, r) {
    const n = L(e, t);
    if (n != null) return n;
    if (t == h && r.value)
      return this[h] = !!r.value, !0;
    if (t == h && !r.value)
      return delete this[h], !0;
    if (c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), r.get == null && r.set == null) return Reflect.defineProperty(e, t, r);
    const l = c(e, t), u = Reflect.defineProperty(e, t, {
      get: r.get,
      set: r.set,
      enumerable: r.enumerable ?? !0,
      configurable: r.configurable ?? !0
    });
    return kt(e, t, l), u;
  }
  deleteProperty(e, t) {
    if (t == h)
      return delete this[h], !0;
    c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != h && typeof t != "symbol" && b.get(e)?.trigger?.(t, null, r, "delete"), n;
  }
}, Nt = class {
  [h];
  constructor() {
  }
  get(e, t, r) {
    if ([
      m,
      W,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? H(e, c(e, t)) : c(e, t);
    const n = b.get(e), l = ge(e, t, n);
    if (l != null) return l;
    const u = we(e, t, n);
    if (u != null) return u;
    e = c(e, m) ?? c(e, W) ?? e;
    const s = H(e, c(e, t));
    if (typeof t == "symbol" && (t in e || c(e, t) != null)) return s;
    if (t == pe) return ve.call(this, this);
    if (t == P) return me(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = D(i, "value", () => e.get(f));
      if (o == null && !$(i, "value")) return;
      const y = D(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, Se(i, "manual"));
    }, e);
    if (t == "clear") return () => {
      const i = Array.from(e?.entries?.() || []), f = s();
      return i.forEach(([o, y]) => {
        this[h] || b.get(e)?.trigger?.(o, null, y, "delete");
      }), f;
    };
    if (t == "delete") return (i, f = null) => {
      const o = e.has(i), y = e.get(i), a = s(i);
      return !this[h] && o && b.get(e)?.trigger?.(i, null, y, "delete"), a;
    };
    if (t == "set") return (i, f) => He(f, (o) => {
      const y = e.has(i), a = e.get(i), v = s(i, o);
      return this[h] || ((!y || x(a, o)) && b.get(e)?.trigger?.(i, o, y ? a : null, y ? "set" : "add"), E(f) && ie(e, i, o, a)), v;
    });
    if (t == "getOrInsert" || t == "getOrInsertComputed") {
      const i = t == "getOrInsertComputed";
      return (f, o) => {
        if (e.has(f)) return e.get(f);
        const y = i && typeof o == "function" ? o(f) : o;
        return He(y, (a) => {
          const v = typeof e.getOrInsert == "function" ? e.getOrInsert(f, a) : (e.set(f, a), e.get(f));
          return this[h] || (b.get(e)?.trigger?.(f, a, null, "add"), E(y) && ie(e, f, a, null)), v;
        });
      };
    }
    return s;
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
      T?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), T?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      T?.get?.(e)?.delete?.(t);
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
      m,
      W,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? H(e, c(e, t)) : c(e, t);
    const n = b.get(e), l = ge(e, t, n);
    if (l != null) return l;
    const u = we(e, t, n);
    if (u != null) return u;
    e = c(e, m) ?? c(e, W) ?? e;
    const s = H(e, c(e, t));
    return typeof t == "symbol" && (t in e || c(e, t) != null) ? s : t == pe ? ve.call(this, this) : t == P ? me(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = D(i, "value", () => e.has(f)), y = D(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, Se(i, "manual"));
    }, e) : t == "clear" ? () => {
      const i = Array.from(e?.values?.() || []), f = s();
      return i.forEach((o) => {
        this[h] || b.get(e)?.trigger?.(null, null, o, "delete");
      }), f;
    } : t == "delete" ? (i) => {
      const f = e.has(i), o = f ? i : null, y = s(i);
      return !this[h] && f && b.get(e)?.trigger?.(i, null, o, "delete"), y;
    } : t == "add" ? (i) => Me(i, (f) => {
      const o = e.has(f), y = o ? f : null, a = s(f);
      return this[h] || (o || b.get(e)?.trigger?.(f, f, y, "add"), E(i) && ie(e, f, f, y)), a;
    }) : s;
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
      T?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), T?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      T?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  deleteProperty(e, t) {
    return t == h ? (delete this[h], !0) : Reflect.deleteProperty(e, t);
  }
}, J = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[m] || e?.[ne])), Pe = (e) => J(e) ? e : _e(se(e, new zt()), e), Bt = (e) => J(e) ? e : _e(se(e, new Ct()), e), Kt = (e) => J(e) ? e : _e(se(e, new Nt()), e), Gt = (e) => J(e) ? e : se(e, new Dt()), Ht = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = R({
    [k]: r ? e : null,
    [d]: r ? 0 : Number(V(e) || 0) || 0,
    [F]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return _((typeof this?.[d] != "object" ? this?.[d] : this?.[d]?.value || 0) ?? 0, l);
    },
    set value(l) {
      this[d] = (l != null && !Number.isNaN(l) ? Number(l) : this[d]) || 0;
    },
    get value() {
      return Number(this[d] || 0) || 0;
    }
  });
  return e?.then?.((l) => {
    n.value = l, n[P]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Ft = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = R({
    [k]: r ? e : null,
    [d]: (r ? "" : String(V(typeof e == "number" ? String(e) : e || ""))) ?? "",
    [F]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") ?? "";
    },
    [Symbol?.toPrimitive](l) {
      return _(this?.[d] ?? "", l);
    },
    set value(l) {
      this[d] = String(typeof l == "number" ? String(l) : l || "") ?? "";
    },
    get value() {
      return String(this[d] ?? "") ?? "";
    }
  });
  return e?.then?.((l) => {
    n.value = l, n[P]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, jt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = R({
    [k]: r ? e : null,
    [d]: (r ? !1 : (V(e) != null ? typeof V(e) == "string" ? !0 : !!V(e) : !1) || !1) || !1,
    [F]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return _(!!this?.[d] || !1, l);
    },
    set value(l) {
      this[d] = (l != null ? typeof l == "string" ? !0 : !!l : this[d]) || !1;
    },
    get value() {
      return this[d] || !1;
    }
  });
  return e?.then?.((l) => {
    n.value = l, n[P]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Xe = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = R({
    [k]: r ? e : null,
    [F]: t,
    [Symbol?.toStringTag]() {
      return String(this.value ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return _(this.value, l);
    },
    value: r ? null : V(e)
  });
  return e?.then?.((l) => {
    n.value = l, n[P]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), S(e, (l) => {
    n?.[P]?.();
  }), n;
}, xe = (e, t) => {
  if (e == null || typeof e != "object" && typeof e != "function") return e;
  try {
    Object.defineProperty(e, ye, {
      value: t,
      writable: !0,
      configurable: !0
    });
  } catch {
    try {
      e[ye] = t;
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
  if (A(e) || !e) return e;
  Array.isArray(e) && e.length == 2 && e[0] != null && (e[0] instanceof Map || e[0] instanceof WeakMap || e[0] instanceof Set || e[0] instanceof WeakSet) ? ((t == null || t === "value") && (t = e[1]), e = e[0]) : Array.isArray(e) && !te(e?.[1], e) && (Array.isArray(e?.[0]) || typeof e?.[0] == "object" || typeof e?.[0] == "function") && (e = e?.[0]);
  const l = e instanceof Map || e instanceof WeakMap, u = e instanceof Set || e instanceof WeakSet;
  if (l || u) {
    if (t == null) return;
  } else if ((t ??= Array.isArray(e) ? null : "value") == null || te(t, e)) return;
  const s = () => l ? e.get(t) : u ? e.has(t) : e?.[t], i = (a) => l ? (e.set(t, a), a) : u ? (a ? e.add(t) : e.delete(t), e.has(t)) : e[t] = a;
  l && r !== void 0 && !e.has(t) ? e.set(t, r) : u && r && !e.has(t) && e.add(t);
  const f = s();
  if (!u && t != null && M(f) && z(f)) return xe(Qt(f), t);
  if (!l && !u && t && typeof e?.getProperty == "function" && z(e?.getProperty?.(t))) return xe(e?.getProperty?.(t), t);
  !l && !u && (e[t] ??= r ?? e[t]);
  const o = R({
    [d]: u ? !!s() : s() ?? r,
    [F]: n,
    [Symbol?.toStringTag]() {
      return String(s() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return _(s(), a);
    },
    set value(a) {
      if (o[Ke] = !0, u) this[d] = i(a);
      else {
        const v = a ?? ht(s());
        this[d] = i(v);
      }
      o[Ke] = !1;
    },
    get value() {
      const a = s();
      return this[d] = u ? !!a : a ?? this[d];
    }
  });
  xe(o, t);
  const y = S(e, (a, v, p, g) => {
    if (v === t) {
      const w = u ? a != null : a, O = u ? p != null : p;
      o?.[P]?.({
        key: t,
        value: w,
        oldValue: O,
        trigger: g
      });
    }
  });
  return I(o, Symbol.dispose, y), o;
}, Ut = (e, t) => {
  switch (typeof e) {
    case "boolean":
      return jt(e, t);
    case "number":
      return Ht(e, t);
    case "string":
      return Ft(e, t);
    case "object":
      if (e != null) return Xe(R(e), t);
    default:
      return Xe(e, t);
  }
}, Jt = (e, t = "value", r) => {
  const n = z(e) ? e : Ut(e, r);
  return t != null ? qt(n, t, r) : n;
}, pr = (e, t) => Jt(e, t), Ve = (e, t, r = 100) => {
  if (e?.value ?? e) return setTimeout(() => {
    e.value && t?.();
  }, r);
}, br = (e = 100) => (t, [r], [n]) => {
  let l = Ve(r, t, e);
  n?.addEventListener?.("abort", () => {
    l && clearTimeout(l);
  }, { once: !0 });
}, Sr = (e = 100) => (t, [r], [n]) => {
  let l = Ve(r, t, e);
  n?.addEventListener?.("abort", () => {
    l && clearTimeout(l);
  }, { once: !0 }), l || t?.();
};
function R(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || J(e) || (e = V?.(e)) == null || e instanceof Promise || e instanceof WeakRef || J(e)) return e;
  const r = e;
  if (r == null || typeof r == "symbol" || !(typeof r == "object" || typeof r == "function") || r instanceof Promise || r instanceof WeakRef) return r;
  let n = r;
  return Array.isArray(r) ? (n = Pe(r), n) : r instanceof Map ? (n = Kt(r), n) : r instanceof Set ? (n = Gt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = Bt(r)), n);
}
var z = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[m] || e?.[ne] || b?.has?.(e))), Qt = (e) => z(e) ? R(e) : null, mr = (e) => {
  if (e == null || typeof e != "object" && typeof e != "function" || e?.[Symbol.observable] != null) return e;
  try {
    e[Symbol.observable] = self?.compatible;
  } catch {
    console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks");
  }
  return e[ne] = (t, r, n) => {
    const l = e?.[Symbol?.observable];
    return l?.()?.affected?.(t, r, n), () => l?.()?.unaffected?.(t, r);
  }, e;
}, j = /* @__PURE__ */ new WeakMap(), We = (e) => {
  if (!(typeof e == "symbol" || e == null || !(typeof e == "object" || typeof e == "function")))
    return e;
}, he = "initial", ze = (e) => {
  const t = e?.[ye] ?? e?.realProp;
  return N(t) ? t : null;
}, Ce = (e, t) => {
  const r = ze(e);
  return r != null && (t == null || t == "value") ? r : t;
}, Xt = (e, t) => t != null && t == ze(e) ? e?.value : e?.[t], Ee = (e, t, r, n) => {
  if (t != null && t == ze(e)) {
    const l = Xt(e, t);
    if (l != null) return r?.(l, t, null, "set");
  }
  return dt(e, t, r, n);
}, yt = (e, t, r) => {
  const n = be(t);
  if (r == he) {
    if (!n.triggerImmediately) return;
  } else if (!q(n.affectTypes, r)) return;
  return (l, u, s, ...i) => e?.(l, u, s, r, ...i);
}, Yt = (e, t, r, n = ["*"]) => {
  if (!e || !We(e)) return;
  const l = t != Symbol.iterator ? Ce(e, t) : null;
  let u = e?.[re] ?? b.get(e);
  e = e?.[m] ?? e, queueMicrotask(() => {
    const i = yt(r, n, he);
    i && (l != null && l != Symbol.iterator ? Ee(e, l, i, null) : Ze(e, i, null));
  });
  let s = u?.affected?.(r, l, n);
  return e?.[Symbol.dispose] || (I(s, Symbol.dispose, s), I(s, Symbol.asyncDispose, s), I(e, Symbol.dispose, s), I(e, Symbol.asyncDispose, s)), s;
}, Zt = (e, t, r, n = ["*"]) => {
  const l = be(n).affectTypes, u = {};
  let s = e?.value;
  const i = (f) => {
    const o = f?.target?.value;
    q(l, "set") && r?.(o, "value", s, "set", f), s = o;
  };
  return e?.addEventListener?.("change", i, u), () => e?.removeEventListener?.("change", i, u);
}, ee = (e) => Array.isArray(e) && e?.length == 2 && We(e?.[0]) && (N(e?.[1]) || e?.[1] == Symbol.iterator), Lt = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), er = (e) => e == null ? [] : Array.isArray(e) && !ee(e) && !z(e) ? e : [e], tr = (e) => {
  if (ee(e)) {
    const t = e?.[0];
    return {
      source: e,
      target: t,
      prop: Ce(t, e?.[1])
    };
  }
  return {
    source: e,
    target: e,
    prop: null
  };
}, rr = (e, t, r, n, l, u, s) => ({
  source: e,
  target: t,
  value: r,
  prop: n,
  name: n,
  oldValue: l,
  trigger: u,
  args: s
}), nr = (e, t, r, n = ["*"]) => {
  const l = N(e?.[1]) ? e?.[1] : null;
  return S(e?.[0], l, r, n);
}, lr = (e, t, r, n = ["*"]) => e?.then?.((l) => S?.(l, t, r, n))?.catch?.((l) => (console.warn(l), null)), S = (e, t, r = () => {
}, n) => {
  if (typeof t == "function" ? (n = r, r = t, t = null) : t = Ce(e, t), (typeof r == "object" || Array.isArray(r)) && (n = r, r = () => {
  }), (A(e) || typeof e == "symbol") && be(n).triggerImmediately)
    return Ge(globalThis?.Promise?.try?.(() => r?.(e, null, null, null, he)));
  if (typeof e?.[ne] == "function") return e?.[ne]?.(r, t, n);
  if (We(e)) {
    const l = e;
    if (j?.has?.(e = e?.[m] ?? e)) return j?.get?.(e)?.(l, t, r, n);
    if (z(l) || ee(e) && z(e?.[0]))
      return oe(e) ? j?.getOrInsert?.(e, lr)?.(e, t, r, n) : ee(e) ? j?.getOrInsert?.(e, nr)?.(e, t, r, n) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? j?.getOrInsert?.(e, Zt)?.(e, t, r, n) : j?.getOrInsert?.(e, Yt)?.(l, t, r, n);
    {
      const u = yt(r, n, he);
      return u ? Ge(globalThis?.Promise?.try?.(() => ee(e) ? Ee?.(e?.[0], e?.[1], u, null) : t != null && t != Symbol.iterator ? Ee?.(e, t, u, null) : Ze?.(e, u, null))) : void 0;
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
  }, u = er(t).map((s) => {
    const i = tr(s);
    return S(i.target, i.prop, (f, o, y, a, ...v) => e(rr(i.source, i.target, f, o, y, a ?? null, v)), l);
  }).filter((s) => typeof s == "function");
  return () => u.forEach((s) => s?.());
}
function gr(e, t, r) {
  return ir(t, e, r);
}
var wr = (e) => e instanceof Set ? at(e) : e instanceof Map ? cr(e) : e, sr = class {
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
    const u = t();
    return l.set(n, u), u;
  }
  getOrInsert(e, t) {
    const [r, n] = this.#t(e), l = this.#e(r);
    return !l || n == null || typeof n != "object" && typeof n != "function" ? t : l.has(n) ? l.get(n) : (l.set(n, t), t);
  }
  getOrInsertComputed(e, t) {
    const [r, n] = this.#t(e), l = this.#e(r);
    if (!l || n == null || typeof n != "object" && typeof n != "function") return t?.([r, n]);
    if (l.has(n)) return l.get(n);
    const u = t([r, n]);
    return l.set(n, u), u;
  }
}, Re = new sr();
function ur(e, t, r = ["*"]) {
  if (!e || typeof e != "object" && typeof e != "function") return;
  if (Re.has([e, t])) return Re.get([e, t]);
  const n = (l, u, s, i) => {
    if (u == "value") {
      const f = (s?.value ?? s)?.entries?.(), o = e?.value ?? l?.value ?? l;
      if (f) for (const [y, a] of f) {
        const v = a ?? (s?.value ?? s)?.[y] ?? null, p = o?.[y];
        v == null && p != null ? t(p, y, null, "add") : v != null && p == null ? t(null, y, v, "delete") : x(v, p) && t(p, y, v, "set");
      }
      return ur(l ?? e?.value, t, r);
    }
    return u == null ? void 0 : e[u];
  };
  return Re.getOrInsertComputed([e, t], () => e instanceof Set ? S([at(e), Symbol.iterator], t, r) : e instanceof Map ? S(e, t, r) : M(e) ? S(e, n, r) : Array.isArray(e) && !(e?.length == 2 && N(e?.[1]) && z(e?.[0])) ? S([e, Symbol.iterator], t, r) : S(e, t, r));
}
function Ie(e, t) {
  return mt(e, (r) => {
    const n = Array.isArray(r) && r?.length == 2 && ["object", "function"].indexOf(typeof r?.[0]) >= 0 && N(r?.[1]), l = n ? r?.[1] : null;
    r = n && l != null ? r?.[0] ?? r : r;
    const u = typeof r == "object" || typeof r == "function" ? r?.[m] ?? r : r;
    (r?.[re] ?? b.get(u))?.unaffected?.(t, l);
  });
}
var fr = (e, t, r) => (S(t, null, (n, l) => {
  ce(e, n, l, !0);
}), r?.(() => e, (n) => {
  for (const l in n) ce(t, n[l], l, !0);
}, { deep: !0 }), e), Ar = (e, t, r) => fr(t(fe(e)), e, r), Or = (e, t, r = () => "") => S(t, null, (n, l) => {
  l == r() && ce(e, n, null, !0);
}), Tr = (e = []) => {
  const t = R({ value: 0 }), r = (i) => typeof i == "function" ? i() : M(i) ? i.value : i, l = yr([t, "value"], () => e.findIndex((i) => !!r(i)), "value"), u = () => {
    t.value++;
  }, s = [];
  z(e) && s.push(S(e, u, {
    affectTypes: [
      "add",
      "set",
      "delete"
    ],
    triggerImmediately: !1
  }));
  for (const i of e) M(i) && s.push(S([i, "value"], u, {
    affectTypes: ["setter"],
    triggerImmediately: !1
  }));
  return I(l, Symbol.dispose, () => s.forEach((i) => i?.())), l;
}, or = (e, t, r, n) => {
  if (A(e)) return e ? t : r;
  const l = () => t, u = () => r, s = (o) => (o != null && (e.value = M(o) ? o?.value : o), (M(e) ? e?.value : e) ? l() : u()), i = R({
    [d]: s(),
    [F]: n,
    [Symbol?.toStringTag]() {
      return String(s() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](o) {
      return _(s() ?? this[d], o);
    },
    set value(o) {
      this[d] = s(o);
    },
    get value() {
      return this[d] = s() ?? this[d];
    }
  }), f = S([e, "value"], () => {
    const o = i?.[d], y = s();
    i[d] = y, i?.[P]?.({
      key: "value",
      value: y,
      oldValue: o,
      trigger: "manual"
    });
  });
  return I(i, Symbol.dispose, f), i;
}, xr = or, Rr = (e, t, r) => {
  r || (r = R({}));
  const n = S(e, (l, u, s) => {
    if (u == null) return;
    const i = t?.(l, u, s);
    typeof i == "object" ? vt(r, i) : x(r[u], i) && (r[u] = i);
  });
  return r && I(r, Symbol.dispose, n), r;
}, Ir = (...e) => {
  const t = R({});
  return e?.forEach?.((r) => S(r, (n, l, u) => {
    l != null && x(t[l], n) && (t[l] = n);
  })), t;
}, at = (e) => {
  const t = R([]);
  return t.push(...Array.from(e?.values?.() || [])), I(t, Symbol.dispose, S(e, (r, n, l) => {
    if (x(r, l))
      if (l == null && r != null) t.push(r);
      else if (l != null && r == null) {
        const u = t.indexOf(l);
        u >= 0 && t.splice(u, 1);
      } else {
        const u = t.indexOf(l);
        u >= 0 && x(t[u], r) && (t[u] = r);
      }
  })), t;
}, cr = (e) => {
  const t = R([]), r = Array.from(e.entries());
  return t.push(...r), I(t, Symbol.dispose, S(e, (n, l, u) => {
    if (x(n, u) || u == null && n != null || u != null && n == null)
      if (u != null && n == null) {
        let s = t.findIndex(([i, f]) => i == l);
        s < 0 && (s = t.findLastIndex(([i, f]) => u === f)), s >= 0 && t.splice(s, 1);
      } else {
        let s = t.findIndex(([i, f]) => i == l);
        s >= 0 && s < t.length ? x(t[s]?.[1], n) && (t[s] = [l, n]) : t.push([l, n]);
      }
  })), t;
}, K = /* @__PURE__ */ new WeakMap(), Ye = (e, t, r = "value") => {
  const n = typeof e?.[1] == "function" && e?.length == 2, l = typeof t?.[1] == "function" && t?.length == 2, u = l ? t?.[1] : null, s = (N(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let i = s && !n ? e?.[1] : Array.isArray(e) ? null : r;
  !s && !n && (e = [e, i]), n && (e[1] = i);
  const f = (N(t?.[1]) || t?.[1] == Symbol.iterator) && t?.length == 2;
  let o = f && !l ? t?.[1] : Array.isArray(t) ? null : r;
  if (!f && !l && (t = [t, o]), l && (t[1] = o), i == null || o == null || te(i, e?.[0]) || te(o, t?.[0])) return;
  if (!((typeof t?.[0] == "object" || typeof t?.[0] == "function") && t?.[0] != null) && !Array.isArray(e[0]))
    return ue(t, () => {
      e[0][i] = t?.[0];
    }), () => {
    };
  const y = (C, Q) => {
    const B = p?.deref?.(), X = v?.deref?.();
    if (K?.get?.(B)?.get?.(i)?.bound == X) {
      let Ae = null;
      const Ne = K?.get?.(B)?.get?.(i)?.cmpfx;
      ue(X, () => {
        typeof Ne == "function" ? Ae = Ne?.(Be(X) ?? C, Q, null) : Ae = X?.[Q] ?? C;
      });
      const De = Be(Ae);
      x(B[i], De) && ue(X, () => {
        B[i] = De;
      });
    } else K?.get?.(B)?.get?.(i)?.dispose?.();
  }, a = () => {
    const C = p?.deref?.(), Q = K?.get?.(C), B = Q?.get?.(i);
    Q?.delete?.(i), B?.unsub?.();
  }, v = t?.[0] != null && (typeof t?.[0] == "object" || typeof t?.[0] == "function") && !(t?.[0] instanceof WeakRef || typeof t?.[0]?.deref == "function") ? new WeakRef(t?.[0]) : t?.[0], p = e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function") && !(e?.[0] instanceof WeakRef || typeof e?.[0]?.deref == "function") ? new WeakRef(e?.[0]) : e?.[0];
  let g = {
    compute: y,
    dispose: a,
    cmpfx: u
  };
  const w = p?.deref?.(), O = v?.deref?.();
  return p instanceof WeakRef && (K?.get?.(w)?.get?.(i)?.bound != O && K?.get?.(w)?.delete?.(i), g = K?.getOrInsert?.(w, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(i, () => ({
    bound: O,
    cmpfx: u,
    unsub: null,
    compute: y,
    dispose: a
  })), g.unsub = S(t, y), g.cmpfx = u, I(w, Symbol.dispose, g?.dispose), I(O, Symbol.dispose, g?.dispose)), O && !Array.isArray(O) && ue(w, () => {
    O[o] ??= w?.[i] ?? O[o];
  }), g?.dispose;
}, Pr = (e, t, r = "value") => {
  const n = [Ye(e, t, r), Ye(t, e, r)];
  return () => n?.map?.((l) => l?.());
}, yr = (e, t, r, n = "value") => {
  const l = typeof e?.[1] == "function" && e?.length == 2, u = (N(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let s = u && !l ? e?.[1] : Array.isArray(e) ? null : n;
  if (!u && !l && (e = [u ? e?.[0] : e, s]), l && (e[1] = s), s == null || te(s, e?.[0])) return;
  const i = (p) => {
    let g;
    return p != null && (g = e[0][s], e[0][s] = p), t?.(e?.[0]?.[s], s, g);
  }, f = i(), o = E(f), y = R({
    [k]: o ? f : void 0,
    [d]: o ? void 0 : f,
    [F]: r,
    [Symbol?.toStringTag]() {
      return String(i() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](p) {
      return _(i() ?? this[d], p);
    },
    set value(p) {
      this[d] = i(p);
    },
    get value() {
      return this[d] = i() ?? this[d];
    }
  }), a = (p, g) => {
    if (E(p)) return Promise.resolve(p).then((O) => {
      const C = y?.[d];
      return y[d] = O, y?.[P]?.({
        key: "value",
        value: O,
        oldValue: C,
        trigger: "resolved"
      }), O;
    });
    const w = y?.[d];
    return y[d] = p, y?.[P]?.({
      key: "value",
      value: p,
      oldValue: w,
      trigger: g
    }), p;
  };
  o && a(f, "resolved");
  const v = S([e?.[0] ?? e, s ?? "value"], () => {
    a(i(), "manual");
  });
  return I(y, Symbol.dispose, v), y;
}, Er = (e, t, r = 100) => {
  let n;
  return S(e, "value", (l) => {
    !l && n ? (clearTimeout(n), n = null) : l && !n && (n = Ve(e, t, r) ?? n);
  });
};
export {
  ne as $affected,
  Ut as $ref,
  Le as $resolved,
  P as $trigger,
  pt as $triggerControl,
  pe as $triggerLess,
  h as $triggerLock,
  wt as AssignObjectHandler,
  sr as DoubleWeakMap,
  I as addToCallChain,
  S as affected,
  Ye as assign,
  K as assignMap,
  fr as bindBy,
  Or as bindByKey,
  jt as booleanRef,
  yr as computed,
  xr as conditional,
  Tr as conditionalIndex,
  or as conditionalRef,
  br as delayedBehavior,
  Sr as delayedOrInstantBehavior,
  Er as delayedSubscribe,
  V as deref,
  Ar as derivate,
  ir as effect,
  gr as effected,
  z as isObservable,
  ur as iterated,
  Pr as link,
  wr as makeArrayObservable,
  hr as makeObjectAssignable,
  ct as makeResolvedOp,
  Ht as numberRef,
  cr as observableByMap,
  at as observableBySet,
  R as observe,
  pr as promised,
  qt as propRef,
  Qt as recoverReactive,
  Jt as ref,
  Rr as remap,
  Je as resolved,
  fe as safe,
  j as specializedSubscribe,
  Ft as stringRef,
  Yt as subscribeDirectly,
  Zt as subscribeInput,
  nr as subscribePaired,
  lr as subscribeThenable,
  Ve as triggerWithDelay,
  Ie as unaffected,
  Ir as unified,
  St as unwrap,
  mr as useObservable,
  Xe as wrapRef,
  dr as wrapSetAsArray
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vI3JlZ2lvbiBzcmMvd3JhcC9TeW1ib2wudHNcblN5bWJvbC5vYnNlcnZhYmxlIHx8PSBTeW1ib2wuZm9yKFwib2JzZXJ2YWJsZVwiKTtcblN5bWJvbC5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJzdWJzY3JpYmVcIik7XG5TeW1ib2wudW5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJ1bnN1YnNjcmliZVwiKTtcbnZhciAkdmFsdWUgPSBTeW1ib2wuZm9yKFwiQHZhbHVlXCIpO1xudmFyICRleHRyYWN0S2V5JCA9IFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKTtcbnZhciAkb3JpZ2luYWxLZXkkID0gU3ltYm9sLmZvcihcIkBvcmlnaW5cIik7XG52YXIgJHJlZ2lzdHJ5S2V5JCA9IFN5bWJvbC5mb3IoXCJAcmVnaXN0cnlcIik7XG52YXIgJGJlaGF2aW9yID0gU3ltYm9sLmZvcihcIkBiZWhhdmlvclwiKTtcbnZhciAkcHJvbWlzZSA9IFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKTtcbnZhciAkcmVzb2x2ZWQgPSBTeW1ib2wuZm9yKFwiQHJlc29sdmVkXCIpO1xudmFyICR0cmlnZ2VyTGVzcyA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sZXNzXCIpO1xudmFyICR0cmlnZ2VyTG9jayA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sb2NrXCIpO1xudmFyICR0cmlnZ2VyQ29udHJvbCA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpO1xudmFyICR0cmlnZ2VyID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyXCIpO1xudmFyICRhZmZlY3RlZCA9IFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpO1xudmFyICRpc05vdEVxdWFsID0gU3ltYm9sLmZvcihcIkBpc05vdEVxdWFsXCIpO1xudmFyICRyZWFsUHJvcCA9IFN5bWJvbC5mb3IoXCJAcmVhbFByb3BcIik7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy93cmFwL1V0aWxzLnRzXG52YXIgJG9yaWdpbmFsT2JqZWN0cyQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzYWZlID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldCwgbWFwcGVkID0gKGUpID0+IHNhZmUoZSk7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHJldHVybiB1bndyYXA/Lm1hcD8uKG1hcHBlZCkgfHwgQXJyYXkuZnJvbSh1bndyYXAgfHwgW10pPy5tYXA/LihtYXBwZWQpIHx8IFtdO1xuXHRlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXAgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha01hcCkgcmV0dXJuIG5ldyBNYXAoQXJyYXkuZnJvbSh1bndyYXA/LmVudHJpZXM/LigpIHx8IFtdKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrU2V0KSByZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKHVud3JhcD8udmFsdWVzPy4oKSB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkpO1xuXHRlbHNlIGlmICh1bndyYXAgIT0gbnVsbCAmJiB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyh1bndyYXAgfHwge30pIHx8IFtdKT8uZmlsdGVyPy4oKFtLXSkgPT4gSyAhPSAkZXh0cmFjdEtleSQgJiYgSyAhPSAkb3JpZ2luYWxLZXkkICYmIEsgIT0gJHJlZ2lzdHJ5S2V5JCk/Lm1hcD8uKChbSywgVl0pID0+IFtLLCBzYWZlKFYpXSkpO1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciB1bndyYXAgPSAoYXJyKSA9PiB7XG5cdHJldHVybiBhcnI/LlskZXh0cmFjdEtleSRdID8/IGFycj8uW1wiQHRhcmdldFwiXSA/PyBhcnI7XG59O1xudmFyIGRlcmVmID0gKHRhcmdldCwgZGlzY291bnRWYWx1ZSA9IGZhbHNlKSA9PiB7XG5cdGNvbnN0IG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRpZiAoaXNQcmltaXRpdmUodGFyZ2V0KSB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCBcImRlcmVmXCIgaW4gdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQ/LmRlcmVmID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9IHRhcmdldD8uZGVyZWY/LigpO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwgJiYgKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHR0YXJnZXQgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRjb25zdCAkdmFsID0gZGlzY291bnRWYWx1ZSAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHRhcmdldD8udmFsdWU7XG5cdFx0aWYgKCR2YWwgIT0gbnVsbCAmJiAodHlwZW9mICR2YWwgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgJHZhbCA9PSBcImZ1bmN0aW9uXCIpKSB0YXJnZXQgPSAkdmFsO1xuXHRcdGlmIChvcmlnaW5hbCAhPSB0YXJnZXQpIHJldHVybiBkZXJlZih0YXJnZXQsIGRpc2NvdW50VmFsdWUpO1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGlzVGhlbmFibGUgPSAodmFsKSA9PiB2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbnZhciB3aXRoUHJvbWlzZSA9ICh0YXJnZXQsIGNiKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY2I/Lih0YXJnZXQpO1xuXHRpZiAoaXNUaGVuYWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0LnRoZW4oY2IpO1xuXHRpZiAodHlwZW9mIHRhcmdldD8ucmVzb2x2ZWQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRhcmdldC5yZXNvbHZlZCgpKS50aGVuKGNiKTtcblx0aWYgKHRhcmdldD8ucHJvbWlzZSAmJiBpc1RoZW5hYmxlKHRhcmdldC5wcm9taXNlKSkgcmV0dXJuIHRhcmdldC5wcm9taXNlLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5bJHByb21pc2VdICYmIGlzVGhlbmFibGUodGFyZ2V0WyRwcm9taXNlXSkpIHJldHVybiB0YXJnZXRbJHByb21pc2VdLnRoZW4oY2IpO1xuXHRyZXR1cm4gY2I/Lih0YXJnZXQpO1xufTtcbnZhciBkaXNwb3NlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZGlzcG9zZVJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChjYWxsc3RhY2spID0+IHtcblx0Y2FsbHN0YWNrPy5mb3JFYWNoPy4oKGNiKSA9PiBjYj8uKCkpO1xufSk7XG5mdW5jdGlvbiBhZGRUb0NhbGxDaGFpbihvYmosIG1ldGhvZEtleSwgY2FsbGJhY2spIHtcblx0aWYgKCFjYWxsYmFjayB8fCB0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBvYmogIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAobWV0aG9kS2V5ID09IFN5bWJvbC5kaXNwb3NlKSB7XG5cdFx0Y29uc3QgY2hhaW5UYXJnZXQgPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iajtcblx0XHRkaXNwb3NlTWFwPy5nZXRPckluc2VydENvbXB1dGVkPy4oY2hhaW5UYXJnZXQsICgpID0+IHtcblx0XHRcdGNvbnN0IENhbGxDaGFpbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0XHRpZiAodHlwZW9mIGNoYWluVGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNoYWluVGFyZ2V0ID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRkaXNwb3NlUmVnaXN0cnkucmVnaXN0ZXIoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGRpc3Bvc2VNYXAuc2V0KGNoYWluVGFyZ2V0LCBDYWxsQ2hhaW4pO1xuXHRcdFx0XHRjaGFpblRhcmdldFtTeW1ib2wuZGlzcG9zZV0gPz89ICgpID0+IENhbGxDaGFpbi5mb3JFYWNoKChjYikgPT4ge1xuXHRcdFx0XHRcdGNiPy4oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQ2FsbENoYWluO1xuXHRcdH0pPy5hZGQ/LihjYWxsYmFjayk7XG5cdH0gZWxzZSBvYmpbbWV0aG9kS2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IG9iaj8uW21ldGhvZEtleV07XG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbCA9PSBcImZ1bmN0aW9uXCIpIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxudmFyIGlzQXJyYXlJbmRleCA9IChwcm9wKSA9PiB7XG5cdGlmICh0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuXHRpZiAocHJvcCA9PT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBudW0gPSBOdW1iZXIocHJvcCk7XG5cdHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IDAgJiYgU3RyaW5nKG51bSkgPT09IHByb3A7XG59O1xuZnVuY3Rpb24gd3JhcFNldEFzQXJyYXkoc291cmNlID0gW10sIG9wdGlvbnMgPSB7fSkge1xuXHRsZXQgYmFja2luZ1NldCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdGNvbnN0IG5vdGlmeUR1cGxpY2F0ZSA9ICh2YWx1ZSwgdmlhLCBpbmRleCkgPT4ge1xuXHRcdG9wdGlvbnMub25EdXBsaWNhdGU/Lih7XG5cdFx0XHR2YWx1ZSxcblx0XHRcdHZpYSxcblx0XHRcdGluZGV4XG5cdFx0fSk7XG5cdH07XG5cdGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIGJhY2tpbmdTZXQgPSBzb3VyY2U7XG5cdGVsc2UgZm9yIChjb25zdCBpdGVtIG9mIHNvdXJjZSkge1xuXHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fVxuXHRjb25zdCBzbmFwc2hvdCA9ICgpID0+IEFycmF5LmZyb20oYmFja2luZ1NldCk7XG5cdGNvbnN0IHJlYnVpbGRGcm9tID0gKGFycikgPT4ge1xuXHRcdGJhY2tpbmdTZXQuY2xlYXIoKTtcblx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSBiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fTtcblx0Y29uc3QgbWV0aG9kcyA9IHtcblx0XHRwdXNoOiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGxldCBzaXplID0gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInB1c2hcIik7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdFx0XHRcdHNpemUrKztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzaXplO1xuXHRcdH0sXG5cdFx0cG9wOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0aWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdFx0YmFja2luZ1NldC5kZWxldGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2hpZnQ6ICgpID0+IHtcblx0XHRcdGNvbnN0IGl0ZXJhdG9yID0gYmFja2luZ1NldC52YWx1ZXMoKS5uZXh0KCk7XG5cdFx0XHRpZiAoaXRlcmF0b3IuZG9uZSkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmF0b3IudmFsdWU7XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHR1bnNoaWZ0OiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Y29uc3QgY3VycmVudCA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCB0b1ByZXBlbmQgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoY3VycmVudC5pbmNsdWRlcyhpdGVtKSB8fCB0b1ByZXBlbmQuaW5jbHVkZXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJ1bnNoaWZ0XCIsIDApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvUHJlcGVuZC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0b1ByZXBlbmQubGVuZ3RoKSByZXR1cm4gY3VycmVudC5sZW5ndGg7XG5cdFx0XHRjb25zdCBuZXh0ID0gWy4uLnRvUHJlcGVuZCwgLi4uY3VycmVudF07XG5cdFx0XHRyZWJ1aWxkRnJvbShuZXh0KTtcblx0XHRcdHJldHVybiBuZXh0Lmxlbmd0aDtcblx0XHR9LFxuXHRcdHNwbGljZTogKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBub3JtYWxpemVkU3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChzdGFydCwgMCksIGFyci5sZW5ndGgpO1xuXHRcdFx0Y29uc3QgYWN0dWFsRGVsZXRlQ291bnQgPSBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gYXJyLmxlbmd0aCAtIG5vcm1hbGl6ZWRTdGFydCA6IE1hdGgubWF4KDAsIE1hdGgubWluKGRlbGV0ZUNvdW50LCBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0KSk7XG5cdFx0XHRjb25zdCByZW1vdmVkID0gYXJyLnNwbGljZShub3JtYWxpemVkU3RhcnQsIGFjdHVhbERlbGV0ZUNvdW50KTtcblx0XHRcdGxldCBpbnNlcnRQb3NpdGlvbiA9IG5vcm1hbGl6ZWRTdGFydDtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwic3BsaWNlXCIsIGluc2VydFBvc2l0aW9uKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcnIuc3BsaWNlKGluc2VydFBvc2l0aW9uKyssIDAsIGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdHJldHVybiByZW1vdmVkO1xuXHRcdH0sXG5cdFx0aW5jbHVkZXM6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5oYXModmFsdWUpLFxuXHRcdGluZGV4T2Y6ICh2YWx1ZSkgPT4gc25hcHNob3QoKS5pbmRleE9mKHZhbHVlKSxcblx0XHRjbGVhcjogKCkgPT4ge1xuXHRcdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlOiAodmFsdWUpID0+IGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKSxcblx0XHR0b0FycmF5OiAoKSA9PiBzbmFwc2hvdCgpLFxuXHRcdHRvU2V0OiAoKSA9PiBuZXcgU2V0KGJhY2tpbmdTZXQpLFxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBiYWNraW5nU2V0W1N5bWJvbC5pdGVyYXRvcl0oKVxuXHR9O1xuXHRyZXR1cm4gbmV3IFByb3h5KG1ldGhvZHMsIHtcblx0XHRnZXQ6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHJldHVybiBzbmFwc2hvdCgpW051bWJlcihwcm9wKV07XG5cdFx0XHRjb25zdCB2YWx1ZSA9IG1ldGhvZHNbcHJvcF07XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHNldDogKF8sIHByb3AsIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyXCIpO1xuXHRcdFx0XHRjb25zdCBuZXh0TGVuZ3RoID0gTWF0aC5mbG9vcih2YWx1ZSk7XG5cdFx0XHRcdGlmIChuZXh0TGVuZ3RoID49IGJhY2tpbmdTZXQuc2l6ZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCkuc2xpY2UoMCwgbmV4dExlbmd0aCk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID4gYXJyLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IG5leHRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAoaW5kZXggPCBhcnIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFZhbHVlID0gYXJyW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoT2JqZWN0LmlzKGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKGFyci5zb21lKChpdGVtLCBpZHgpID0+IGlkeCAhPT0gaW5kZXggJiYgT2JqZWN0LmlzKGl0ZW0sIG5leHRWYWx1ZSkpKSB7XG5cdFx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUobmV4dFZhbHVlLCBcInNldFwiLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YXJyW2luZGV4XSA9IG5leHRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKG5leHRWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnIucHVzaChuZXh0VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3Quc2V0KG1ldGhvZHMsIHByb3AsIHZhbHVlKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRvd25LZXlzOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gW107XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IF8gb2YgYmFja2luZ1NldCkga2V5cy5wdXNoKFN0cmluZyhpKyspKTtcblx0XHRcdGtleXMucHVzaChcImxlbmd0aFwiKTtcblx0XHRcdHJldHVybiBrZXlzO1xuXHRcdH0sXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0dmFsdWU6IGJhY2tpbmdTZXQuc2l6ZVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHZhbHVlOiBhcnJbaW5kZXhdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRoYXM6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRyZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9wIGluIG1ldGhvZHM7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3dyYXAvQXNzaWduT2JqZWN0LnRzXG52YXIgQXNzaWduT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbmFtZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ/LltuYW1lXSA/PyB0YXJnZXQ7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgY3R4KTtcblx0fVxufTtcbnZhciBtYWtlT2JqZWN0QXNzaWduYWJsZSA9IChvYmopID0+IHtcblx0aWYgKG9iaj8uWyRvcmlnaW5hbEtleSRdIHx8ICRvcmlnaW5hbE9iamVjdHMkLmhhcyhvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCBweCA9IG5ldyBQcm94eShvYmosIG5ldyBBc3NpZ25PYmplY3RIYW5kbGVyKCkpO1xuXHQkb3JpZ2luYWxPYmplY3RzJC5zZXQocHgsIG9iaik7XG5cdHJldHVybiBweDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1N1YnNjcmlwdC50c1xudmFyIHdpdGhVbnN1YlN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd2l0aFVuc3ViXCIpO1xuZ2xvYmFsVGhpc1t3aXRoVW5zdWJTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB3aXRoVW5zdWIgPSBnbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF07XG52YXIgY29tcGxldGVXaXRoVW5zdWIgPSAoc3Vic2NyaWJlciwgd2VhaywgaGFuZGxlcikgPT4ge1xuXHRyZXR1cm4gd2l0aFVuc3ViLmdldE9ySW5zZXJ0KHN1YnNjcmliZXIsICgpID0+IHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHdlYWs/LmRlcmVmPy4oKTtcblx0XHRyZWdpc3RyeT8uYWZmZWN0ZWQ/LihoYW5kbGVyKTtcblx0XHRjb25zdCBzYXZDb21wbGV0ZSA9IHN1YnNjcmliZXI/LmNvbXBsZXRlPy5iaW5kPy4oc3Vic2NyaWJlcik7XG5cdFx0Y29uc3QgdW5hZmZlY3RlZCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHIgPSBzYXZDb21wbGV0ZT8uKCk7XG5cdFx0XHRyZWdpc3RyeT8udW5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fTtcblx0XHRzdWJzY3JpYmVyLmNvbXBsZXRlID0gdW5hZmZlY3RlZDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuZGlzcG9zZV06IHVuYWZmZWN0ZWQsXG5cdFx0XHRbU3ltYm9sLmFzeW5jRGlzcG9zZV06IHVuYWZmZWN0ZWRcblx0XHR9O1xuXHR9KTtcbn07XG52YXIgc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHN1YnNjcmlwdFJlZ2lzdHJ5XCIpO1xuZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHN1YnNjcmlwdFJlZ2lzdHJ5ID0gZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAZ2xvYmFsRWZmZWN0TGlzdGVuZXJzXCIpO1xuZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVycyA9IGdsb2JhbFRoaXNbZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sXTtcbnZhciBlZmZlY3RHbG9iYWxseSA9IChjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Z2xvYmFsRWZmZWN0TGlzdGVuZXJzLnNldChjYiwgbm9ybWFsaXplZC5hZmZlY3RUeXBlcyk7XG5cdHJldHVybiAoKSA9PiBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuZGVsZXRlKGNiKTtcbn07XG52YXIgd3JhcHBlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd3JhcHBlZFwiKTtcbmdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdyYXBwZWQgPSBnbG9iYWxUaGlzW3dyYXBwZWRTeW1ib2xdO1xudmFyIHJlZ2lzdGVyID0gKHdoYXQsIGhhbmRsZSkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0O1xuXHRsZXQgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKTtcblx0aWYgKCFyZWdpc3RyeSkge1xuXHRcdHJlZ2lzdHJ5ID0gbmV3IFN1YnNjcmlwdCh1bndyYXApO1xuXHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LnNldCh1bndyYXAsIHJlZ2lzdHJ5KTtcblx0fSBlbHNlIHJlZ2lzdHJ5LmJpbmRTb3VyY2UodW53cmFwKTtcblx0cmV0dXJuIGhhbmRsZTtcbn07XG52YXIgd3JhcFdpdGggPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdHdoYXQgPSBkZXJlZih3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0KTtcblx0aWYgKHR5cGVvZiB3aGF0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2Ygd2hhdCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB3aGF0ID09IFwiZnVuY3Rpb25cIikgfHwgd2hhdCA9PSBudWxsKSByZXR1cm4gd2hhdDtcblx0cmV0dXJuIHdyYXBwZWQuZ2V0T3JJbnNlcnRDb21wdXRlZCh3aGF0LCAoKSA9PiBuZXcgUHJveHkod2hhdCwgcmVnaXN0ZXIod2hhdCwgaGFuZGxlKSkpO1xufTtcbnZhciBmb3JBbGwgPSBTeW1ib2wuZm9yKFwiQGFsbFByb3BzXCIpO1xudmFyIHdpbGRjYXJkVHJpZ2dlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCIsIFwiYWxsXCJdKTtcbnZhciB0cmlnZ2VyQWxpYXNlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKFtcblx0W1wic2V0XCIsIFtcInNldHRlclwiLCBcIkBzZXRcIl1dLFxuXHRbXCJhZGRcIiwgW1wiQGFkZFwiXV0sXG5cdFtcImRlbGV0ZVwiLCBbXCJAZGVsZXRlXCJdXSxcblx0W1wiaW52YWxpZGF0ZVwiLCBbXCJAaW52YWxpZGF0ZVwiXV0sXG5cdFtcIm1hbnVhbFwiLCBbXCJAbWFudWFsXCJdXSxcblx0W1wiY3VzdG9tXCIsIFtcIkBjdXN0b21cIl1dLFxuXHRbXCJyZXNvbHZlZFwiLCBbXCJAcmVzb2x2ZWRcIl1dLFxuXHRbXCJzZXRBbGxcIiwgW1wiQHNldEFsbFwiXV0sXG5cdFtcImFkZEFsbFwiLCBbXCJAYWRkQWxsXCJdXSxcblx0W1wiZGVsZXRlQWxsXCIsIFtcIkBkZWxldGVBbGxcIiwgXCJAY2xlYXJcIl1dXG5dKTtcbnZhciB0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHRyaWdnZXJDYW5vbmljYWxOYW1lc1wiKTtcbmdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXSA/Pz0gbmV3IE1hcChBcnJheS5mcm9tKHRyaWdnZXJBbGlhc2VzLmVudHJpZXMoKSkuZmxhdE1hcCgoW2Nhbm9uaWNhbCwgYWxpYXNlc10pID0+IGFsaWFzZXMubWFwKChhbGlhcykgPT4gW2FsaWFzLCBjYW5vbmljYWxdKSkpO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lcyA9IGdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXTtcbnZhciBub3JtYWxpemVUcmlnZ2VyTmFtZSA9ICh0cmlnZ2VyID0gXCJzZXRcIikgPT4ge1xuXHRpZiAodHJpZ2dlciA9PSBudWxsKSByZXR1cm4gdHJpZ2dlcjtcblx0Y29uc3QgbmFtZSA9IFN0cmluZyh0cmlnZ2VyIHx8IFwic2V0XCIpO1xuXHRyZXR1cm4gdHJpZ2dlckNhbm9uaWNhbE5hbWVzLmdldChuYW1lKSA/PyBuYW1lO1xufTtcbnZhciB0cmlnZ2VyTmFtZXNPZiA9ICh0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5hbWUgPSB0cmlnZ2VyID09IG51bGwgPyBcImFsbFwiIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IFwiYWxsXCIpO1xuXHRyZXR1cm4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV07XG59O1xudmFyIGV4cGFuZFRyaWdnZXJGaWx0ZXIgPSAodHlwZXMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBuZXcgU2V0KFsuLi5ub3JtYWxpemVUcmlnZ2VyRmlsdGVyKHR5cGVzKV0uZmxhdE1hcCgobmFtZSkgPT4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV0pKTtcbn07XG52YXIgbm9ybWFsaXplVHJpZ2dlckZpbHRlciA9ICh0cmlnZ2VycyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgbGlzdCA9IHR5cGVvZiB0cmlnZ2VycyA9PSBcInN0cmluZ1wiID8gW3RyaWdnZXJzXSA6IEFycmF5LmZyb20odHJpZ2dlcnMgPz8gW1wiKlwiXSk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBuZXcgU2V0KGxpc3QubWFwKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgbmFtZSA9IFN0cmluZyhpdGVtIHx8IFwiKlwiKTtcblx0XHRyZXR1cm4gd2lsZGNhcmRUcmlnZ2Vycy5oYXMobmFtZSkgPyBuYW1lIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG5hbWUpID8/IG5hbWUpO1xuXHR9KSk7XG5cdHJldHVybiBub3JtYWxpemVkLnNpemUgPyBub3JtYWxpemVkIDogLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1wiKlwiXSk7XG59O1xudmFyIHRyaWdnZXJGaWx0ZXJBbGxvd3MgPSAodHJpZ2dlcnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3QgZmlsdGVyID0gdHJpZ2dlcnMgaW5zdGFuY2VvZiBTZXQgPyB0cmlnZ2VycyA6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHJpZ2dlcnMpO1xuXHRyZXR1cm4gWy4uLndpbGRjYXJkVHJpZ2dlcnNdLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpIHx8IHRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpO1xufTtcbnZhciBpc09wdGlvbnNPYmplY3QgPSAob3B0aW9ucykgPT4ge1xuXHRyZXR1cm4gISFvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucykgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlcnNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gb3B0aW9ucyk7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ICE9PSBmYWxzZVxuXHR9O1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyk7XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiB0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcImluaXRpYWxcIilcblx0fTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0T3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ID09PSB0cnVlXG5cdH07XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9O1xufTtcbnZhciBTdWJzY3JpcHRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQFN1YnNjcmlwdFwiKTtcbmdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXSA/Pz0gY2xhc3MgU3Vic2NyaXB0IHtcblx0Y29tcGF0aWJsZTtcblx0I3NvdXJjZTtcblx0I2xpc3RlbmVycztcblx0I2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdCNuYXRpdmU7XG5cdCNpdGVyYXRvcjtcblx0I2luRGlzcGF0Y2ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjZGlzYWJsZWRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCN0cmlnZ2VyQ29udHJvbDtcblx0I3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQjcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy4jbGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHR0aGlzLiNmbGFncyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRcdHRoaXMuI3RyaWdnZXJDb250cm9sID0ge1xuXHRcdFx0ZW5hYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgdHJ1ZSwgY2IpIDogdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIHRydWUpLFxuXHRcdFx0ZGlzYWJsZTogKHR5cGVzID0gW1wiKlwiXSwgY2IpID0+IGNiID8gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIGZhbHNlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgZmFsc2UpLFxuXHRcdFx0c2V0OiAodHlwZXMsIGVuYWJsZWQpID0+IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBlbmFibGVkKSxcblx0XHRcdHdpdGg6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYiksXG5cdFx0XHR3aXRob3V0OiAodHlwZXMsIGNiKSA9PiB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSxcblx0XHRcdGlzRW5hYmxlZDogKHRyaWdnZXIpID0+IHRoaXMuaXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKVxuXHRcdH07XG5cdFx0dGhpcy4jaXRlcmF0b3IgPSB7IG5leHQ6IChhcmdzKSA9PiB7XG5cdFx0XHRpZiAoYXJncykgQXJyYXkuaXNBcnJheShhcmdzKSA/IHRoaXMuI2Rpc3BhdGNoKC4uLmFyZ3MpIDogdGhpcy4jZGlzcGF0Y2goYXJncyk7XG5cdFx0fSB9O1xuXHRcdGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZih0aGlzKTtcblx0XHRjb25zdCBjb250cm9sbGVyID0gZnVuY3Rpb24oc3Vic2NyaWJlcikge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IHN1YnNjcmliZXI/Lm5leHQ/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRcdHJldHVybiBjb21wbGV0ZVdpdGhVbnN1YihzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKTtcblx0XHR9O1xuXHRcdHRoaXMuI25hdGl2ZSA9IHR5cGVvZiBPYnNlcnZhYmxlICE9IFwidW5kZWZpbmVkXCIgPyBuZXcgT2JzZXJ2YWJsZShjb250cm9sbGVyKSA6IG51bGw7XG5cdFx0dGhpcy5jb21wYXRpYmxlID0gKCkgPT4gdGhpcy4jbmF0aXZlO1xuXHR9XG5cdGJpbmRTb3VyY2Uoc291cmNlKSB7XG5cdFx0dGhpcy4jc291cmNlID8/PSBzb3VyY2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0JHNhZmVFeGVjKGNiLCAuLi5hcmdzKSB7XG5cdFx0aWYgKCFjYiB8fCB0aGlzLiNmbGFncy5oYXMoY2IpKSByZXR1cm47XG5cdFx0dGhpcy4jZmxhZ3MuYWRkKGNiKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzID0gY2IoLi4uYXJncyk7XG5cdFx0XHRpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHJlcy5jYXRjaChjb25zb2xlLndhcm4pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy4jZmxhZ3MuZGVsZXRlKGNiKTtcblx0XHR9XG5cdH1cblx0I2Rpc3BhdGNoKG5hbWUsIHZhbHVlID0gbnVsbCwgb2xkVmFsdWUsIHRyaWdnZXIgPSBcImFsbFwiLCAuLi5ldGMpIHtcblx0XHR0cmlnZ2VyID0gbm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gdHJpZ2dlcjtcblx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0aWYgKGxpc3RlbmVycz8uc2l6ZSkge1xuXHRcdFx0Zm9yIChjb25zdCBbY2IsIHJlY29yZF0gb2YgbGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKChyZWNvcmQucHJvcCA9PT0gbmFtZSB8fCByZWNvcmQucHJvcCA9PT0gZm9yQWxsIHx8IHJlY29yZC5wcm9wID09PSBudWxsKSAmJiB0cmlnZ2VyRmlsdGVyQWxsb3dzKHJlY29yZC50cmlnZ2VycywgdHJpZ2dlcikpIHRoaXMuJHNhZmVFeGVjKGNiLCB2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG5cdFx0fVxuXHRcdGlmIChnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2l6ZSkge1xuXHRcdFx0Y29uc3QgZXZlbnQgPSB7XG5cdFx0XHRcdHNvdXJjZTogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR0YXJnZXQ6IHRoaXMuI3NvdXJjZSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdHByb3A6IG5hbWUsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyLFxuXHRcdFx0XHRhcmdzOiBldGNcblx0XHRcdH07XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgdHJpZ2dlcnNdIG9mIGdsb2JhbEVmZmVjdExpc3RlbmVycy5lbnRyaWVzKCkpIGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKHRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIGV2ZW50KTtcblx0XHR9XG5cdH1cblx0d3JhcChudykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG53KSkgcmV0dXJuIHdyYXBXaXRoKG53LCB0aGlzKTtcblx0XHRyZXR1cm4gbnc7XG5cdH1cblx0Z2V0IHRyaWdnZXJDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLiN0cmlnZ2VyQ29udHJvbDtcblx0fVxuXHRpc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpIHtcblx0XHRyZXR1cm4gIXRyaWdnZXJGaWx0ZXJBbGxvd3ModGhpcy4jZGlzYWJsZWRUcmlnZ2VycywgXCJhbGxcIikgJiYgIXRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpKTtcblx0fVxuXHRzZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMgPSBbXCIqXCJdLCBlbmFibGVkID0gdHJ1ZSkge1xuXHRcdGNvbnN0IG5hbWVzID0gZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyk7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSBpZiAoZW5hYmxlZCkgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5kZWxldGUobmFtZSk7XG5cdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0fVxuXHR3aXRoVHJpZ2dlcnModHlwZXMsIGVuYWJsZWQsIGNiKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBbLi4uZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyldO1xuXHRcdGNvbnN0IHByZXZpb3VzID0gbmV3IE1hcChuYW1lcy5tYXAoKG5hbWUpID0+IFtuYW1lLCB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmhhcyhuYW1lKV0pKTtcblx0XHRjb25zdCByZXN0b3JlID0gKCkgPT4ge1xuXHRcdFx0cHJldmlvdXMuZm9yRWFjaCgod2FzRGlzYWJsZWQsIG5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHdhc0Rpc2FibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0XHRcdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0dGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQobmFtZXMsIGVuYWJsZWQpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjYj8uKCk7XG5cdFx0XHRpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQuZmluYWxseSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiByZXN1bHQuZmluYWxseShyZXN0b3JlKTtcblx0XHRcdHJlc3RvcmUoKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YWZmZWN0ZWQoY2IsIHByb3AsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdFx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy4jbGlzdGVuZXJzLnNldChjYiwge1xuXHRcdFx0cHJvcDogcHJvcCB8fCBmb3JBbGwsXG5cdFx0XHR0cmlnZ2Vyczogbm9ybWFsaXplZC5hZmZlY3RUeXBlc1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnVuYWZmZWN0ZWQoY2IsIHByb3AgfHwgZm9yQWxsKTtcblx0fVxuXHR1bmFmZmVjdGVkKGNiLCBwcm9wKSB7XG5cdFx0aWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy4jbGlzdGVuZXJzO1xuXHRcdFx0Y29uc3QgcmVjb3JkID0gbGlzdGVuZXJzPy5nZXQoY2IpO1xuXHRcdFx0aWYgKHJlY29yZCAmJiAocmVjb3JkLnByb3AgPT0gcHJvcCB8fCBwcm9wID09IG51bGwgfHwgcHJvcCA9PSBmb3JBbGwpKSB7XG5cdFx0XHRcdGxpc3RlbmVycy5kZWxldGUoY2IpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gdGhpcy5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwsIHJlY29yZC50cmlnZ2Vycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiNsaXN0ZW5lcnMuY2xlYXIoKTtcblx0fVxuXHR0cmlnZ2VyKG5hbWUsIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwic2V0XCIsIC4uLmV0Yykge1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgcmV0dXJuO1xuXHRcdGlmICh0cmlnZ2VyID09PSB2b2lkIDApIHRyaWdnZXIgPSBcInNldFwiO1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGlmICghdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpKSByZXR1cm47XG5cdFx0Y29uc3Qgb3BLZXkgPSBgJHt0cmlnZ2VyID8/IFwiYWxsXCJ9YDtcblx0XHRsZXQgYnlPcCA9IHRoaXMuI3BlbmRpbmdCeVByb3AuZ2V0KG5hbWUpO1xuXHRcdGlmICghYnlPcCkge1xuXHRcdFx0YnlPcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wLnNldChuYW1lLCBieU9wKTtcblx0XHR9XG5cdFx0YnlPcC5zZXQob3BLZXksIFtcblx0XHRcdG5hbWUsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdGV0Y1xuXHRcdF0pO1xuXHRcdGlmICh0aGlzLiNmbHVzaFNjaGVkdWxlZCkgcmV0dXJuO1xuXHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcblx0XHRxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG5cdFx0XHR0aGlzLiNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRcdFx0Y29uc3QgYmF0Y2ggPSB0aGlzLiNwZW5kaW5nQnlQcm9wO1xuXHRcdFx0dGhpcy4jcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRmb3IgKGNvbnN0IFtwcm9wLCBvcE1hcF0gb2YgYmF0Y2gpIHtcblx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCAmJiB0aGlzLiNpbkRpc3BhdGNoLmhhcyhwcm9wKSkgY29udGludWU7XG5cdFx0XHRcdGlmIChwcm9wICE9IG51bGwpIHRoaXMuI2luRGlzcGF0Y2guYWRkKHByb3ApO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgWywgYXJnc10gb2Ygb3BNYXApIHtcblx0XHRcdFx0XHRcdGNvbnN0IFtubSwgdiwgb3YsIHRnLCByZXN0XSA9IGFyZ3M7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLiNkaXNwYXRjaChubSwgdiwgb3YsIHRnLCAuLi5yZXN0ID8/IFtdKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRpZiAocHJvcCAhPSBudWxsKSB0aGlzLiNpbkRpc3BhdGNoLmRlbGV0ZShwcm9wKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdGdldCBpdGVyYXRvcigpIHtcblx0XHRyZXR1cm4gdGhpcy4jaXRlcmF0b3I7XG5cdH1cbn07XG52YXIgU3Vic2NyaXB0ID0gZ2xvYmFsVGhpc1tTdWJzY3JpcHRTeW1ib2xdO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9SZXNvbHZlZC50c1xudmFyIHJhd09mID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXBwZWQgPSBkZXJlZih0YXJnZXQpO1xuXHRyZXR1cm4gdW53cmFwcGVkPy5bJGV4dHJhY3RLZXkkXSA/PyB1bndyYXBwZWQ7XG59O1xuZnVuY3Rpb24gcmVzb2x2ZWQodGFyZ2V0LCBtb2RlID0gXCJhbGxcIikge1xuXHRjb25zdCByYXcgPSByYXdPZih0YXJnZXQpO1xuXHRpZiAoaXNQcm9taXNlKHJhdykpIHJldHVybiByZXNvbHZlZCQxKHJhdywgbW9kZSk7XG5cdGlmIChpc1Byb21pc2UocmF3Py5bJHByb21pc2VdKSkgcmV0dXJuIHJlc29sdmVkJDEocmF3WyRwcm9taXNlXSwgbW9kZSk7XG5cdHJldHVybiByZXNvbHZlZCQxKHJhdyA/PyB0YXJnZXQsIG1vZGUpO1xufVxuZnVuY3Rpb24gbWFrZVJlc29sdmVkT3AodGFyZ2V0LCBlbWl0ID0gZmFsc2UpIHtcblx0Y29uc3QgcnVuID0gKChtb2RlID0gXCJhbGxcIikgPT4ge1xuXHRcdGNvbnN0IHBlbmRpbmcgPSByZXNvbHZlZCh0YXJnZXQsIG1vZGUpO1xuXHRcdGlmICghZW1pdCkgcmV0dXJuIHBlbmRpbmc7XG5cdFx0cmV0dXJuIHBlbmRpbmcudGhlbigodmFsdWUpID0+IHtcblx0XHRcdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCk7XG5cdFx0XHRjb25zdCBrZXkgPSByYXc/LnJlYWxQcm9wID8/IChyYXcgJiYgXCJ2YWx1ZVwiIGluIHJhdyA/IFwidmFsdWVcIiA6IG51bGwpO1xuXHRcdFx0c3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHJhdyk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCB2b2lkIDAsIFwicmVzb2x2ZWRcIik7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSk7XG5cdH0pO1xuXHRydW4uYWxsID0gKCkgPT4gcnVuKFwiYWxsXCIpO1xuXHRydW4uYWxsU2V0dGxlZCA9ICgpID0+IHJ1bihcInNldHRsZWRcIik7XG5cdHJ1bi5hbGxLZXllZCA9ICgpID0+IHJ1bihcImFsbFwiKTtcblx0cnVuLmFsbFNldHRsZWRLZXllZCA9ICgpID0+IHJ1bihcInNldHRsZWRcIik7XG5cdHJ1bi50cnkgPSAoY2FsbGJhY2tPclZhbHVlLCAuLi5hcmdzKSA9PiBQcm9taXNlLnRyeShjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpLnRoZW4oKHZhbHVlKSA9PiByZXNvbHZlZCh2YWx1ZSA/PyB0YXJnZXQsIFwiYWxsXCIpKTtcblx0cmV0dXJuIHJ1bjtcbn1cbmZ1bmN0aW9uIGVtaXRSZXNvbHZlZCh0YXJnZXQsIGtleSwgdmFsdWUsIG9sZFZhbHVlKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCkgPz8gdGFyZ2V0O1xuXHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCBcInJlc29sdmVkXCIpO1xufVxuZnVuY3Rpb24gYmluZEV4aXN0aW5nVGhlbmFibGVzKGxpdmUsIHJhdykge1xuXHRpZiAobGl2ZSA9PSBudWxsIHx8IHJhdyA9PSBudWxsKSByZXR1cm4gbGl2ZTtcblx0aWYgKEFycmF5LmlzQXJyYXkocmF3KSkge1xuXHRcdHJhdy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcblx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlW2luZGV4XSA9IHZhbHVlO1xuXHRcdH0pO1xuXHRcdHJldHVybiBsaXZlO1xuXHR9XG5cdGlmIChyYXcgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiByYXcuZW50cmllcygpKSBpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZS5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0cmV0dXJuIGxpdmU7XG5cdH1cblx0aWYgKHJhdyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIGxpdmU7XG5cdGZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhyYXcpKSB7XG5cdFx0aWYgKGtleSA9PSAkZXh0cmFjdEtleSQgfHwga2V5ID09ICRwcm9taXNlIHx8IGtleSA9PSAkcmVzb2x2ZWQpIGNvbnRpbnVlO1xuXHRcdGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihyYXcsIGtleSk/LmVudW1lcmFibGUpIGNvbnRpbnVlO1xuXHRcdGNvbnN0IHZhbHVlID0gcmF3W2tleV07XG5cdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmVba2V5XSA9IHZhbHVlO1xuXHR9XG5cdHJldHVybiBsaXZlO1xufVxuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9TcGVjaWZpYy50c1xudmFyIF9fc2FmZUdldEd1YXJkU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0BfX3NhZmVHZXRHdWFyZFwiKTtcbnZhciBfX3N5c3RlbVNraXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG5cdFN5bWJvbC50b1N0cmluZ1RhZyxcblx0U3ltYm9sLml0ZXJhdG9yLFxuXHRTeW1ib2wuYXN5bmNJdGVyYXRvcixcblx0U3ltYm9sLnRvUHJpbWl0aXZlLFxuXHRcInRvU3RyaW5nXCIsXG5cdFwidmFsdWVPZlwiLFxuXHRcImluc3BlY3RcIixcblx0XCJjb25zdHJ1Y3RvclwiLFxuXHRcIl9fcHJvdG9fX1wiLFxuXHRcInByb3RvdHlwZVwiLFxuXHRcInRoZW5cIixcblx0XCJjYXRjaFwiLFxuXHRcImZpbmFsbHlcIixcblx0XCJuZXh0XCJcbl0pO1xudmFyIHN5c3RlbVNraXBHZXQgPSAodGFyZ2V0LCBuYW1lKSA9PiB7XG5cdGlmICghX19zeXN0ZW1Ta2lwLmhhcyhuYW1lKSkgcmV0dXJuIG51bGw7XG5cdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0cmV0dXJuIHR5cGVvZiBnb3QgPT09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBnb3QpIDogZ290O1xufTtcbnZhciBfX3NhZmVHZXRHdWFyZCA9IGdsb2JhbFRoaXNbX19zYWZlR2V0R3VhcmRTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIGlzR2V0dGVyKG9iaiwgcHJvcE5hbWUpIHtcblx0bGV0IGdvdCA9IHRydWU7XG5cdHRyeSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4ocHJvcE5hbWUpO1xuXHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4ob2JqKT8uaGFzPy4ocHJvcE5hbWUpKSBnb3QgPSB0cnVlO1xuXHRcdGdvdCA9IHR5cGVvZiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3BOYW1lKT8uZ2V0ID09IFwiZnVuY3Rpb25cIjtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGdvdCA9IHRydWU7XG5cdH0gZmluYWxseSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/LmRlbGV0ZT8uKHByb3BOYW1lKTtcblx0fVxuXHRyZXR1cm4gZ290O1xufVxudmFyIGZhbGxUaHJvdWdoID0gKG9iaiwga2V5KSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCB2YWx1ZSA9IHNhZmVHZXQob2JqLCBrZXkpO1xuXHRpZiAodmFsdWUgPT0gbnVsbCAmJiBrZXkgIT0gXCJ2YWx1ZVwiKSB7XG5cdFx0Y29uc3QgdG1wID0gc2FmZUdldChvYmosIFwidmFsdWVcIik7XG5cdFx0aWYgKHRtcCAhPSBudWxsICYmICFpc1ByaW1pdGl2ZSh0bXApKSByZXR1cm4gZmFsbFRocm91Z2godG1wLCBrZXkpO1xuXHRcdGVsc2UgcmV0dXJuIHZhbHVlO1xuXHR9IGVsc2UgaWYgKGtleSA9PSBcInZhbHVlXCIgJiYgdmFsdWUgIT0gbnVsbCAmJiAhaXNQcmltaXRpdmUodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxsVGhyb3VnaCh2YWx1ZSwga2V5KSA/PyB2YWx1ZSA/PyBvYmo7XG5cdHJldHVybiB2YWx1ZSA/PyBvYmo7XG59O1xudmFyIHNhZmVTZXQgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XG5cdGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlU2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIGZhbHNlO1xuXHRhY3RpdmU/LmFkZD8uKGtleSk7XG5cdHJldHVybiBSZWZsZWN0LnNldChvYmosIGtleSwgdmFsdWUpO1xufTtcbnZhciBzYWZlR2V0ID0gKG9iaiwga2V5LCByZWMpID0+IHtcblx0bGV0IHJlc3VsdCA9IHZvaWQgMDtcblx0aWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIG51bGw7XG5cdGlmICghaXNHZXR0ZXIob2JqLCBrZXkpKSByZXN1bHQgPz89IFJlZmxlY3QuZ2V0KG9iaiwga2V5LCByZWMgIT0gbnVsbCA/IHJlYyA6IG9iaik7XG5cdGVsc2Uge1xuXHRcdGFjdGl2ZT8uYWRkPy4oa2V5KTtcblx0XHR0cnkge1xuXHRcdFx0cmVzdWx0ID0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcblx0XHR9IGNhdGNoIChfZSkge1xuXHRcdFx0cmVzdWx0ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRhY3RpdmUuZGVsZXRlKGtleSk7XG5cdFx0XHRpZiAoYWN0aXZlPy5zaXplID09PSAwKSBfX3NhZmVHZXRHdWFyZD8uZGVsZXRlPy4ob2JqKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHR5cGVvZiByZXN1bHQgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eChvYmosIHJlc3VsdCkgOiByZXN1bHQ7XG59O1xudmFyIGhhc093biA9IChvYmosIGtleSkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbnZhciBpc1RyaWdnZXJFbWl0T3B0aW9ucyA9ICh2YWx1ZSwgYWxsb3dWYWx1ZU9ubHkgPSBmYWxzZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKGhhc093bih2YWx1ZSwgXCJrZXlcIikgfHwgaGFzT3duKHZhbHVlLCBcIm5hbWVcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9sZFZhbHVlXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvbGRcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9wXCIpIHx8IGhhc093bih2YWx1ZSwgXCJ0cmlnZ2VyXCIpIHx8IGFsbG93VmFsdWVPbmx5ICYmIGhhc093bih2YWx1ZSwgXCJ2YWx1ZVwiKSk7XG59O1xudmFyIHRyaWdnZXJPcHRpb25WYWx1ZSA9IChvcHRpb25zLCBrZXksIGZhbGxiYWNrKSA9PiB7XG5cdGlmIChoYXNPd24ob3B0aW9ucywga2V5KSkgcmV0dXJuIG9wdGlvbnNba2V5XTtcblx0aWYgKGtleSA9PSBcIm9sZFZhbHVlXCIgJiYgaGFzT3duKG9wdGlvbnMsIFwib2xkXCIpKSByZXR1cm4gb3B0aW9ucy5vbGQ7XG5cdHJldHVybiBmYWxsYmFjaygpO1xufTtcbnZhciB0cmlnZ2VyT3B0aW9uVHJpZ2dlciA9IChvcHRpb25zLCBmYWxsYmFjayA9IFwibWFudWFsXCIpID0+IG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG9wdGlvbnMudHJpZ2dlciA/PyBvcHRpb25zLm9wID8/IGZhbGxiYWNrKTtcbnZhciBpc1J1bnRpbWVLZXkgPSAoa2V5KSA9PiB0eXBlb2Yga2V5ID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGtleSA9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBrZXkgPT0gXCJzeW1ib2xcIjtcbnZhciByZWFsUHJvcE9mJDEgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHByb3AgPSBzYWZlR2V0KHRhcmdldCwgJHJlYWxQcm9wKSA/PyBzYWZlR2V0KHRhcmdldCwgXCJyZWFsUHJvcFwiKTtcblx0cmV0dXJuIGlzUnVudGltZUtleShwcm9wKSA/IHByb3AgOiBudWxsO1xufTtcbnZhciB0cmlnZ2VyS2V5T2YgPSAodGFyZ2V0LCBrZXkpID0+IGtleSA9PSBcInZhbHVlXCIgPyByZWFsUHJvcE9mJDEodGFyZ2V0KSA/PyBrZXkgOiBrZXk7XG52YXIgdHJpZ2dlclZhbHVlT2YgPSAodGFyZ2V0LCBrZXkpID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mJDEodGFyZ2V0KTtcblx0aWYgKHJlYWxQcm9wICE9IG51bGwgJiYga2V5ID09IHJlYWxQcm9wKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgPz8gc2FmZUdldCh0YXJnZXQsIGtleSk7XG5cdHJldHVybiBrZXkgPT0gbnVsbCA/IHZvaWQgMCA6IHNhZmVHZXQodGFyZ2V0LCBrZXkpO1xufTtcbnZhciBjcmVhdGVUcmlnZ2VyQVBJID0gKHJlZ2lzdHJ5LCBlbWl0LCB0YXJnZXQpID0+IHtcblx0Y29uc3QgYXBpID0gKGtleSwgb3BPck9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoIWlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zKSkgdHJpZ2dlciA/Pz0gb3BPck9wdGlvbnM7XG5cdFx0cmV0dXJuIGVtaXQoaXNUcmlnZ2VyRW1pdE9wdGlvbnMoa2V5KSA/IGtleSA6IGlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zLCB0cnVlKSA/IHtcblx0XHRcdGtleSxcblx0XHRcdHRyaWdnZXIsXG5cdFx0XHQuLi5vcE9yT3B0aW9uc1xuXHRcdH0gOiB7XG5cdFx0XHRrZXksXG5cdFx0XHR0cmlnZ2VyOiB0cmlnZ2VyID8/IG9wT3JPcHRpb25zXG5cdFx0fSk7XG5cdH07XG5cdGNvbnN0IGNvbnRyb2wgPSByZWdpc3RyeT8udHJpZ2dlckNvbnRyb2w7XG5cdGlmIChjb250cm9sKSBPYmplY3QuYXNzaWduKGFwaSwgY29udHJvbCk7XG5cdGFwaS5jdXN0b20gPSAodHJpZ2dlciwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpID0+IGFwaSh7XG5cdFx0a2V5LFxuXHRcdHRyaWdnZXIsXG5cdFx0dmFsdWUsXG5cdFx0b2xkVmFsdWVcblx0fSk7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCkgYXBpLnJlc29sdmVkID0gbWFrZVJlc29sdmVkT3AodGFyZ2V0LCB0cnVlKTtcblx0cmV0dXJuIGFwaTtcbn07XG52YXIgc3lzdGVtR2V0ID0gKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IGlzUHJpbWl0aXZlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGlmICgoW1xuXHRcdFwiZGVyZWZcIixcblx0XHRcImJpbmRcIixcblx0XHRcIkB0YXJnZXRcIixcblx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdCRleHRyYWN0S2V5JCxcblx0XHQkcmVnaXN0cnlLZXkkXG5cdF0uaW5kZXhPZihuYW1lKSA8IDAgPyBzYWZlR2V0KHRhcmdldCwgbmFtZSk/LmJpbmQ/Lih0YXJnZXQpIDogbnVsbCkgIT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdGlmIChbJGV4dHJhY3RLZXkkLCAkb3JpZ2luYWxLZXkkXS5pbmRleE9mKG5hbWUpID49IDApIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdGFyZ2V0O1xuXHRpZiAobmFtZSA9PSAkdmFsdWUpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIik7XG5cdGlmIChuYW1lID09ICRyZWdpc3RyeUtleSQpIHJldHVybiByZWdpc3RyeTtcblx0aWYgKG5hbWUgPT0gJHJlc29sdmVkIHx8IG5hbWUgPT0gXCJyZXNvbHZlZFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBcInJlc29sdmVkXCIpKSByZXR1cm4gbWFrZVJlc29sdmVkT3AodGFyZ2V0KTtcblx0aWYgKG5hbWUgPT0gJHRyaWdnZXJDb250cm9sKSByZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXJDb250cm9sO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wub2JzZXJ2YWJsZSkgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuc3Vic2NyaWJlKSByZXR1cm4gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiBhZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCwgY2IsIG9wdGlvbnMpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5hc3luY0l0ZXJhdG9yKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuZGlzcG9zZSkgcmV0dXJuIChwcm9wKSA9PiB7XG5cdFx0c2FmZUdldCh0YXJnZXQsIFN5bWJvbC5kaXNwb3NlKT8uKHByb3ApO1xuXHRcdHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHR9O1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuYXN5bmNEaXNwb3NlKSByZXR1cm4gKHByb3ApID0+IHtcblx0XHRzYWZlR2V0KHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSk/Lihwcm9wKTtcblx0XHR1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0fTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLnVuc3Vic2NyaWJlKSByZXR1cm4gKHByb3ApID0+IHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xufTtcbnZhciBvYnNlcnZhYmxlQVBJTWV0aG9kcyA9ICh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KSA9PiB7XG5cdGlmIChuYW1lID09IFwic3Vic2NyaWJlXCIpIHJldHVybiByZWdpc3RyeT8uY29tcGF0aWJsZT8uW25hbWVdID8/ICgoaGFuZGxlcikgPT4ge1xuXHRcdGlmICh0eXBlb2YgaGFuZGxlciA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXIpO1xuXHRcdGVsc2UgaWYgKFwibmV4dFwiIGluIGhhbmRsZXIgJiYgaGFuZGxlcj8ubmV4dCAhPSBudWxsKSB7XG5cdFx0XHRjb25zdCB1c3ViID0gYWZmZWN0ZWQodGFyZ2V0LCBoYW5kbGVyPy5uZXh0KSwgY29tcCA9IGhhbmRsZXI/LltcImNvbXBsZXRlXCJdO1xuXHRcdFx0aGFuZGxlcltcImNvbXBsZXRlXCJdID0gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0dXN1Yj8uKCk7XG5cdFx0XHRcdHJldHVybiBjb21wPy4oLi4uYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGhhbmRsZXJbXCJjb21wbGV0ZVwiXTtcblx0XHR9XG5cdH0pO1xufTtcbnZhciBPYnNlcnZlQXJyYXlNZXRob2QgPSBjbGFzcyB7XG5cdCNuYW1lO1xuXHQjc2VsZjtcblx0I2hhbmRsZTtcblx0Y29uc3RydWN0b3IobmFtZSwgc2VsZiwgaGFuZGxlKSB7XG5cdFx0dGhpcy4jbmFtZSA9IG5hbWU7XG5cdFx0dGhpcy4jc2VsZiA9IHNlbGY7XG5cdFx0dGhpcy4jaGFuZGxlID0gaGFuZGxlO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgcmVjKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdGxldCBhZGRlZCA9IFtdLCByZW1vdmVkID0gW107XG5cdFx0bGV0IHNldFBhaXJzID0gW107XG5cdFx0bGV0IG9sZFN0YXRlID0gWy4uLnRoaXMuI3NlbGZdO1xuXHRcdGxldCBpZHggPSAtMTtcblx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4IHx8IHRoaXMuI3NlbGYsIGFyZ3MpO1xuXHRcdGlmICh0aGlzLiNoYW5kbGU/LlskdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSByZXR1cm4gb2JzZXJ2ZUFycmF5KHJlc3VsdCk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRzd2l0Y2ggKHRoaXMuI25hbWUpIHtcblx0XHRcdGNhc2UgXCJwdXNoXCI6XG5cdFx0XHRcdGlkeCA9IG9sZFN0YXRlPy5sZW5ndGg7XG5cdFx0XHRcdGFkZGVkID0gYXJncztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidW5zaGlmdFwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRhZGRlZCA9IGFyZ3M7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInBvcFwiOlxuXHRcdFx0XHRpZHggPSBvbGRTdGF0ZT8ubGVuZ3RoIC0gMTtcblx0XHRcdFx0aWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbb2xkU3RhdGVbaWR4XV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNoaWZ0XCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGlmIChvbGRTdGF0ZS5sZW5ndGggPiAwKSByZW1vdmVkID0gW29sZFN0YXRlW2lkeF1dO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzcGxpY2VcIjpcblx0XHRcdFx0aWR4ID0gYXJnc1swXTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1heChvbGRTdGF0ZS5sZW5ndGgsIHRoaXMuI3NlbGYubGVuZ3RoKTsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBvbGRTdGF0ZVtpXTtcblx0XHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHRoaXMuI3NlbGZbaV07XG5cdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09PSB2b2lkIDAgJiYgaSA+PSB0aGlzLiNzZWxmLmxlbmd0aCkgcmVtb3ZlZC5wdXNoKG9sZFZhbHVlKTtcblx0XHRcdFx0XHRlbHNlIGlmIChvbGRWYWx1ZSA9PT0gdm9pZCAwICYmIGkgPj0gb2xkU3RhdGUubGVuZ3RoKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdHZvaWQgMCxcblx0XHRcdFx0XHRcdGZhbHNlXG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChvbGRWYWx1ZSwgbmV3VmFsdWUpKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNvcnRcIjpcblx0XHRcdGNhc2UgXCJmaWxsXCI6XG5cdFx0XHRjYXNlIFwicmV2ZXJzZVwiOlxuXHRcdFx0Y2FzZSBcImNvcHlXaXRoaW5cIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvbGRTdGF0ZS5sZW5ndGg7IGkrKykgaWYgKGlzTm90RXF1YWwob2xkU3RhdGVbaV0sIHRoaXMuI3NlbGZbaV0pKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRpZHggKyBpLFxuXHRcdFx0XHRcdHRoaXMuI3NlbGZbaV0sXG5cdFx0XHRcdFx0b2xkU3RhdGVbaV0sXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2V0XCI6XG5cdFx0XHRcdGlkeCA9IGFyZ3NbMV07XG5cdFx0XHRcdHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdGlkeCxcblx0XHRcdFx0XHRhcmdzWzBdLFxuXHRcdFx0XHRcdG9sZFN0YXRlPy5baWR4XSxcblx0XHRcdFx0XHRpZHggaW4gb2xkU3RhdGVcblx0XHRcdFx0XSk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlZyA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0aGlzLiNzZWxmKTtcblx0XHRpZiAoYWRkZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIGFkZGVkWzBdLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZD8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBhZGRlZCwgbnVsbCwgXCJhZGRBbGxcIik7XG5cdFx0XHRhZGRlZC5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWc/LnRyaWdnZXI/LihpZHggKyBJLCBpdGVtLCBudWxsLCBcImFkZFwiKSk7XG5cdFx0fVxuXHRcdGlmIChzZXRQYWlycz8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKHNldFBhaXJzWzBdPy5bMF0gPz8gaWR4LCBzZXRQYWlyc1swXT8uWzFdLCBzZXRQYWlyc1swXT8uWzJdLCBzZXRQYWlyc1swXT8uWzNdID09PSBmYWxzZSA/IFwiYWRkXCIgOiBcInNldFwiKTtcblx0XHRlbHNlIGlmIChzZXRQYWlycz8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBzZXRQYWlycywgb2xkU3RhdGUsIFwic2V0QWxsXCIpO1xuXHRcdFx0c2V0UGFpcnMuZm9yRWFjaCgocGFpciwgSSkgPT4gcmVnPy50cmlnZ2VyPy4ocGFpcj8uWzBdID8/IGlkeCArIEksIHBhaXI/LlsxXSwgcGFpcj8uWzJdLCBwYWlyPy5bM10gPT09IGZhbHNlID8gXCJhZGRcIiA6IFwic2V0XCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlbW92ZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIG51bGwsIHJlbW92ZWRbMF0sIFwiZGVsZXRlXCIpO1xuXHRcdGVsc2UgaWYgKHJlbW92ZWQ/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZCwgXCJkZWxldGVBbGxcIik7XG5cdFx0XHRyZW1vdmVkLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZz8udHJpZ2dlcj8uKGlkeCArIEksIG51bGwsIGl0ZW0sIFwiZGVsZXRlXCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlc3VsdCA9PSB0YXJnZXQpIHJldHVybiBuZXcgUHJveHkocmVzdWx0LCB0aGlzLiNoYW5kbGUpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHJldHVybiBvYnNlcnZlQXJyYXkocmVzdWx0KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlID0gKHNlbGYsIHRhcmdldCwgb2xkTGVuLCBuZXdMZW4pID0+IHtcblx0Y29uc3QgcmVtb3ZlZEl0ZW1zID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPCBvbGRMZW4gPyB0YXJnZXQuc2xpY2UobmV3TGVuLCBvbGRMZW4pIDogW107XG5cdGlmICghc2VsZlskdHJpZ2dlckxvY2tdICYmIG9sZExlbiAhPT0gbmV3TGVuKSB7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA9PT0gMSkgcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtc1swXSwgXCJkZWxldGVcIik7XG5cdFx0ZWxzZSBpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuLCBudWxsLCByZW1vdmVkSXRlbXMsIFwiZGVsZXRlQWxsXCIpO1xuXHRcdFx0cmVtb3ZlZEl0ZW1zLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuICsgSSwgbnVsbCwgaXRlbSwgXCJkZWxldGVcIikpO1xuXHRcdH1cblx0XHRjb25zdCBhZGRlZENvdW50ID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPiBvbGRMZW4gPyBuZXdMZW4gLSBvbGRMZW4gOiAwO1xuXHRcdGlmIChhZGRlZENvdW50ID09PSAxKSByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgdm9pZCAwLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZENvdW50ID4gMSkge1xuXHRcdFx0Y29uc3QgYWRkZWQgPSBBcnJheShhZGRlZENvdW50KS5maWxsKHZvaWQgMCk7XG5cdFx0XHRyZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgYWRkZWQsIG51bGwsIFwiYWRkQWxsXCIpO1xuXHRcdFx0YWRkZWQuZm9yRWFjaCgoXywgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4gKyBJLCB2b2lkIDAsIG51bGwsIFwiYWRkXCIpKTtcblx0XHR9XG5cdH1cbn07XG52YXIgT2JzZXJ2ZUFycmF5SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0aGFzKHRhcmdldCwgbmFtZSkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gc2FmZUdldCh0YXJnZXQsIGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiQHRhcmdldFwiIHx8IG5hbWUgPT0gJGV4dHJhY3RLZXkkKSByZXR1cm4gdGFyZ2V0O1xuXHRcdGlmIChuYW1lID09IFwieFwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueCA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwieVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueSA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwielwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwid1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8udyA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiclwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uciA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZ1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uZyA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYlwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYSA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyAobmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IG51bGwpO1xuXHRcdGlmICh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG5ldyBQcm94eSh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIiA/IGdvdD8uYmluZD8uKHRhcmdldCkgOiBnb3QsIG5ldyBPYnNlcnZlQXJyYXlNZXRob2QobmFtZSwgdGFyZ2V0LCB0aGlzKSk7XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihwYXJzZUludChuYW1lKSkpIG5hbWUgPSBwYXJzZUludChuYW1lKSA/PyBuYW1lO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBwZW5kaW5nID0gaXNQcm9taXNlKHZhbHVlKTtcblx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IG9sZCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IHh5encgPSBbXG5cdFx0XHRcdFwieFwiLFxuXHRcdFx0XHRcInlcIixcblx0XHRcdFx0XCJ6XCIsXG5cdFx0XHRcdFwid1wiXG5cdFx0XHRdO1xuXHRcdFx0Y29uc3QgcmdiYSA9IFtcblx0XHRcdFx0XCJyXCIsXG5cdFx0XHRcdFwiZ1wiLFxuXHRcdFx0XHRcImJcIixcblx0XHRcdFx0XCJhXCJcblx0XHRcdF07XG5cdFx0XHRjb25zdCB4eXp3X2lkeCA9IHh5encuaW5kZXhPZihuYW1lKTtcblx0XHRcdGNvbnN0IHJnYmFfaWR4ID0gcmdiYS5pbmRleE9mKG5hbWUpO1xuXHRcdFx0bGV0IGdvdCA9IGZhbHNlO1xuXHRcdFx0aWYgKHh5endfaWR4ID49IDApIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgeHl6d19pZHgsIHYpO1xuXHRcdFx0ZWxzZSBpZiAocmdiYV9pZHggPj0gMCkgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCByZ2JhX2lkeCwgdik7XG5cdFx0XHRlbHNlIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdik7XG5cdFx0XHRpZiAobmFtZSA9PSBcImxlbmd0aFwiKSB7XG5cdFx0XHRcdGlmIChpc05vdEVxdWFsKG9sZCwgdikpIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlKHRoaXMsIHRhcmdldCwgb2xkLCB2KTtcblx0XHRcdH1cblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2xkLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnk/LmdldD8uKHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCB2LCBvbGQsIFwic2V0XCIpO1xuXHRcdFx0XHRpZiAocGVuZGluZykgZW1pdFJlc29sdmVkKHRhcmdldCwgbmFtZSwgdiwgb2xkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBnb3Q7XG5cdFx0fSk7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KG5hbWUpKSkgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBvbGQgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgZ290ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG5hbWUgIT0gXCJsZW5ndGhcIiAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAob2xkICE9IG51bGwpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbmFtZSwgb2xkLCBcImRlbGV0ZVwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxufTtcbnZhciBPYnNlcnZlT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIixcblx0XHRcdFwidGhlblwiLFxuXHRcdFx0XCJjYXRjaFwiLFxuXHRcdFx0XCJmaW5hbGx5XCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gcmVhbFByb3BPZiQxKHRhcmdldCkgPz8gXCJ2YWx1ZVwiKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4ga2V5ID09IFwidmFsdWVcIiB8fCBrZXkgPT0gcmVhbFByb3BPZiQxKHRhcmdldCkgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IHZvaWQgMCk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRyaWdnZXJWYWx1ZU9mKHRhcmdldCwga2V5KSk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gU3ltYm9sLnRvUHJpbWl0aXZlKSByZXR1cm4gKGhpbnQpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oaGludCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoZnQsIGhpbnQpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSwgaGludCk7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCwgaGludCk7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBTeW1ib2wudG9TdHJpbmdUYWcpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gU3RyaW5nKGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0cmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInRvU3RyaW5nXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvU3RyaW5nVGFnKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1N0cmluZ1RhZyk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIFN0cmluZyhmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZU9mXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvUHJpbWl0aXZlKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1ByaW1pdGl2ZSk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIGZ0O1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKTtcblx0XHRcdHJldHVybiBzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0O1xuXHRcdH07XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRyZXR1cm4gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuXHRcdGxldCBnb3QgPSB2b2lkIDA7XG5cdFx0dHJ5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG5cdFx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIGdvdCA9IHZvaWQgMDtcblx0XHRcdGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRnb3QgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodiwgbmFtZSk7XG5cdFx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCAkb3JpZ2luYWwgPSB0YXJnZXQ7XG5cdFx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAhKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIG5hbWUgaW4gdGFyZ2V0KSkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdHJpZ2dlck5hbWUgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gbmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA/PyBzYWZlR2V0KHRhcmdldCwgbmFtZSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0XHR0YXJnZXRbbmFtZV0gPSB2O1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdjtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdFx0Y29uc3Qgc3Vic2NyaXB0ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KCRvcmlnaW5hbCk7XG5cdFx0XHRcdGlmICgoc2FmZUdldCh0YXJnZXQsICRpc05vdEVxdWFsKSA/PyBpc05vdEVxdWFsKT8uKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHN1YnNjcmlwdD8udHJpZ2dlcj8uKHRyaWdnZXJOYW1lLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQoJG9yaWdpbmFsLCB0cmlnZ2VyTmFtZSwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSk7XG5cdH1cblx0ZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISFkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0aWYgKGRlc2NyaXB0b3IuZ2V0ID09IHZvaWQgMCAmJiBkZXNjcmlwdG9yLnNldCA9PSB2b2lkIDApIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgJHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG5cdFx0XHRnZXQ6IGRlc2NyaXB0b3IuZ2V0LFxuXHRcdFx0c2V0OiBkZXNjcmlwdG9yLnNldCxcblx0XHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA/PyB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA/PyB0cnVlXG5cdFx0fSk7XG5cdFx0c2FmZVNldCh0YXJnZXQsIG5hbWUsIG9sZFZhbHVlKTtcblx0XHRyZXR1cm4gJHJlc3VsdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIE9ic2VydmVNYXBIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHR0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgJGV4dHJhY3RLZXkkKSA/PyBzYWZlR2V0KHRhcmdldCwgJG9yaWdpbmFsS2V5JCkgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiB2YWx1ZU9yRng7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lO1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm47XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCAmJiAhaGFzT3duKG9wdGlvbnMsIFwidmFsdWVcIikpIHJldHVybjtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcImNsZWFyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8uZW50cmllcz8uKCkgfHwgW10pLCByZXN1bHQgPSB2YWx1ZU9yRngoKTtcblx0XHRcdG9sZFZhbHVlcy5mb3JFYWNoKChbcHJvcCwgb2xkVmFsdWVdKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZGVsZXRlXCIpIHJldHVybiAocHJvcCwgXyA9IG51bGwpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXMocHJvcCksIG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3ApO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInNldFwiKSByZXR1cm4gKHByb3AsIHZhbHVlKSA9PiBwb3RlbnRpYWxseUFzeW5jTWFwKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyhwcm9wKSwgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCwgdik7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRpZiAoIWhhZCB8fCBpc05vdEVxdWFsKG9sZFZhbHVlLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCB2LCBoYWQgPyBvbGRWYWx1ZSA6IG51bGwsIGhhZCA/IFwic2V0XCIgOiBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHByb3AsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0aWYgKG5hbWUgPT0gXCJnZXRPckluc2VydFwiIHx8IG5hbWUgPT0gXCJnZXRPckluc2VydENvbXB1dGVkXCIpIHtcblx0XHRcdGNvbnN0IGNvbXB1dGVkID0gbmFtZSA9PSBcImdldE9ySW5zZXJ0Q29tcHV0ZWRcIjtcblx0XHRcdHJldHVybiAoa2V5LCBkZWZhdWx0T3JDb21wdXRlKSA9PiB7XG5cdFx0XHRcdGlmICh0YXJnZXQuaGFzKGtleSkpIHJldHVybiB0YXJnZXQuZ2V0KGtleSk7XG5cdFx0XHRcdGNvbnN0IGluY29taW5nID0gY29tcHV0ZWQgPyB0eXBlb2YgZGVmYXVsdE9yQ29tcHV0ZSA9PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0T3JDb21wdXRlKGtleSkgOiBkZWZhdWx0T3JDb21wdXRlIDogZGVmYXVsdE9yQ29tcHV0ZTtcblx0XHRcdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmNNYXAoaW5jb21pbmcsICh2KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdHlwZW9mIHRhcmdldC5nZXRPckluc2VydCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQuZ2V0T3JJbnNlcnQoa2V5LCB2KSA6ICh0YXJnZXQuc2V0KGtleSwgdiksIHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0XHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4oa2V5LCB2LCBudWxsLCBcImFkZFwiKTtcblx0XHRcdFx0XHRcdGlmIChpc1Byb21pc2UoaW5jb21pbmcpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBrZXksIHYsIG51bGwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZU9yRng7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZVNldEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdID0gZmFsc2U7XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0dGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsICRleHRyYWN0S2V5JCkgPz8gc2FmZUdldCh0YXJnZXQsICRvcmlnaW5hbEtleSQpID8/IHRhcmdldDtcblx0XHRjb25zdCB2YWx1ZU9yRnggPSBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gdmFsdWVPckZ4O1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZTtcblx0XHRcdGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0YXJnZXQuaGFzKGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiY2xlYXJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlcyA9IEFycmF5LmZyb20odGFyZ2V0Py52YWx1ZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG5cdFx0XHRvbGRWYWx1ZXMuZm9yRWFjaCgob2xkVmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obnVsbCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJkZWxldGVcIikgcmV0dXJuICh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2YWx1ZSksIG9sZFZhbHVlID0gaGFkID8gdmFsdWUgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodmFsdWUpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHZhbHVlLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhZGRcIikgcmV0dXJuICh2YWx1ZSkgPT4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXModiksIG9sZFZhbHVlID0gaGFkID8gdiA6IG51bGwsIHJlc3VsdCA9IHZhbHVlT3JGeCh2KTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdGlmICghaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHYsIHYsIG9sZFZhbHVlLCBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHYsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciAkaXNPYnNlcnZhYmxlID0gKHRhcmdldCkgPT4ge1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSkpO1xufTtcbnZhciBvYnNlcnZlQXJyYXkgPSAoYXJyKSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKGFycikpIHJldHVybiBhcnI7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgoYXJyLCBuZXcgT2JzZXJ2ZUFycmF5SGFuZGxlcigpKSwgYXJyKTtcbn07XG52YXIgb2JzZXJ2ZU9iamVjdCA9IChvYmopID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUob2JqKSkgcmV0dXJuIG9iajtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChvYmosIG5ldyBPYnNlcnZlT2JqZWN0SGFuZGxlcigpKSwgb2JqKTtcbn07XG52YXIgb2JzZXJ2ZU1hcCA9IChtYXApID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUobWFwKSkgcmV0dXJuIG1hcDtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChtYXAsIG5ldyBPYnNlcnZlTWFwSGFuZGxlcigpKSwgbWFwKTtcbn07XG52YXIgb2JzZXJ2ZVNldCA9IChzZXQpID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUoc2V0KSkgcmV0dXJuIHNldDtcblx0cmV0dXJuIHdyYXBXaXRoKHNldCwgbmV3IE9ic2VydmVTZXRIYW5kbGVyKCkpO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvUHJpbWl0aXZlcy50c1xudmFyIG51bWJlclJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IGlzUHJvbWlzZSA/IDAgOiBOdW1iZXIoZGVyZWYoaW5pdGlhbCkgfHwgMCkgfHwgMCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCgodHlwZW9mIHRoaXM/LlskdmFsdWVdICE9IFwib2JqZWN0XCIgPyB0aGlzPy5bJHZhbHVlXSA6IHRoaXM/LlskdmFsdWVdPy52YWx1ZSB8fCAwKSA/PyAwLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4odikgPyBOdW1iZXIodikgOiB0aGlzWyR2YWx1ZV0pIHx8IDA7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gTnVtYmVyKHRoaXNbJHZhbHVlXSB8fCAwKSB8fCAwO1xuXHRcdH1cblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIHN0cmluZ1JlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBcIlwiIDogU3RyaW5nKGRlcmVmKHR5cGVvZiBpbml0aWFsID09IFwibnVtYmVyXCIgPyBTdHJpbmcoaW5pdGlhbCkgOiBpbml0aWFsIHx8IFwiXCIpKSkgPz8gXCJcIixcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSA/PyBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSBTdHJpbmcodHlwZW9mIHYgPT0gXCJudW1iZXJcIiA/IFN0cmluZyh2KSA6IHYgfHwgXCJcIikgPz8gXCJcIjtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpc1skdmFsdWVdID8/IFwiXCIpID8/IFwiXCI7XG5cdFx0fVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgYm9vbGVhblJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBmYWxzZSA6IChkZXJlZihpbml0aWFsKSAhPSBudWxsID8gdHlwZW9mIGRlcmVmKGluaXRpYWwpID09IFwic3RyaW5nXCIgPyB0cnVlIDogISFkZXJlZihpbml0aWFsKSA6IGZhbHNlKSB8fCBmYWxzZSkgfHwgZmFsc2UsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoISF0aGlzPy5bJHZhbHVlXSB8fCBmYWxzZSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gKHYgIT0gbnVsbCA/IHR5cGVvZiB2ID09IFwic3RyaW5nXCIgPyB0cnVlIDogISF2IDogdGhpc1skdmFsdWVdKSB8fCBmYWxzZTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gfHwgZmFsc2U7XG5cdFx0fVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgd3JhcFJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzLnZhbHVlLCBoaW50KTtcblx0XHR9LFxuXHRcdHZhbHVlOiBpc1Byb21pc2UgPyBudWxsIDogZGVyZWYoaW5pdGlhbClcblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZmZlY3RlZChpbml0aWFsLCAodikgPT4ge1xuXHRcdCRyPy5bJHRyaWdnZXJdPy4oKTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgbWFya1JlYWxQcm9wID0gKHRhcmdldCwgcmVhbFByb3ApID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGFyZ2V0ICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRhcmdldDtcblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCAkcmVhbFByb3AsIHtcblx0XHRcdHZhbHVlOiByZWFsUHJvcCxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0gY2F0Y2gge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXJnZXRbJHJlYWxQcm9wXSA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHR0cnkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIFwicmVhbFByb3BcIiwge1xuXHRcdFx0dmFsdWU6IHJlYWxQcm9wLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhcmdldC5yZWFsUHJvcCA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBwcm9wUmVmID0gKHNyYywgc3JjUHJvcCA9IFwidmFsdWVcIiwgaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKHNyYykgfHwgIXNyYykgcmV0dXJuIHNyYztcblx0aWYgKEFycmF5LmlzQXJyYXkoc3JjKSAmJiBzcmMubGVuZ3RoID09IDIgJiYgc3JjWzBdICE9IG51bGwgJiYgKHNyY1swXSBpbnN0YW5jZW9mIE1hcCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrTWFwIHx8IHNyY1swXSBpbnN0YW5jZW9mIFNldCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrU2V0KSkge1xuXHRcdGlmIChzcmNQcm9wID09IG51bGwgfHwgc3JjUHJvcCA9PT0gXCJ2YWx1ZVwiKSBzcmNQcm9wID0gc3JjWzFdO1xuXHRcdHNyYyA9IHNyY1swXTtcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNyYykgJiYgIWlzQXJyYXlJbnZhbGlkS2V5KHNyYz8uWzFdLCBzcmMpICYmIChBcnJheS5pc0FycmF5KHNyYz8uWzBdKSB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJmdW5jdGlvblwiKSkgc3JjID0gc3JjPy5bMF07XG5cdGNvbnN0IGlzTWFwID0gc3JjIGluc3RhbmNlb2YgTWFwIHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtNYXA7XG5cdGNvbnN0IGlzU2V0ID0gc3JjIGluc3RhbmNlb2YgU2V0IHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtTZXQ7XG5cdGlmIChpc01hcCB8fCBpc1NldCkge1xuXHRcdGlmIChzcmNQcm9wID09IG51bGwpIHJldHVybjtcblx0fSBlbHNlIGlmICgoc3JjUHJvcCA/Pz0gQXJyYXkuaXNBcnJheShzcmMpID8gbnVsbCA6IFwidmFsdWVcIikgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShzcmNQcm9wLCBzcmMpKSByZXR1cm47XG5cdGNvbnN0IHJlYWRTbG90ID0gKCkgPT4ge1xuXHRcdGlmIChpc01hcCkgcmV0dXJuIHNyYy5nZXQoc3JjUHJvcCk7XG5cdFx0aWYgKGlzU2V0KSByZXR1cm4gc3JjLmhhcyhzcmNQcm9wKTtcblx0XHRyZXR1cm4gc3JjPy5bc3JjUHJvcF07XG5cdH07XG5cdGNvbnN0IHdyaXRlU2xvdCA9ICh2KSA9PiB7XG5cdFx0aWYgKGlzTWFwKSB7XG5cdFx0XHRzcmMuc2V0KHNyY1Byb3AsIHYpO1xuXHRcdFx0cmV0dXJuIHY7XG5cdFx0fVxuXHRcdGlmIChpc1NldCkge1xuXHRcdFx0aWYgKHYpIHNyYy5hZGQoc3JjUHJvcCk7XG5cdFx0XHRlbHNlIHNyYy5kZWxldGUoc3JjUHJvcCk7XG5cdFx0XHRyZXR1cm4gc3JjLmhhcyhzcmNQcm9wKTtcblx0XHR9XG5cdFx0cmV0dXJuIHNyY1tzcmNQcm9wXSA9IHY7XG5cdH07XG5cdGlmIChpc01hcCAmJiBpbml0aWFsICE9PSB2b2lkIDAgJiYgIXNyYy5oYXMoc3JjUHJvcCkpIHNyYy5zZXQoc3JjUHJvcCwgaW5pdGlhbCk7XG5cdGVsc2UgaWYgKGlzU2V0ICYmIGluaXRpYWwgJiYgIXNyYy5oYXMoc3JjUHJvcCkpIHNyYy5hZGQoc3JjUHJvcCk7XG5cdGNvbnN0IGN1cnJlbnQgPSByZWFkU2xvdCgpO1xuXHRpZiAoIWlzU2V0ICYmIHNyY1Byb3AgIT0gbnVsbCAmJiBoYXNWYWx1ZShjdXJyZW50KSAmJiBpc09ic2VydmFibGUoY3VycmVudCkpIHJldHVybiBtYXJrUmVhbFByb3AocmVjb3ZlclJlYWN0aXZlKGN1cnJlbnQpLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQgJiYgc3JjUHJvcCAmJiB0eXBlb2Ygc3JjPy5nZXRQcm9wZXJ0eSA9PSBcImZ1bmN0aW9uXCIgJiYgaXNPYnNlcnZhYmxlKHNyYz8uZ2V0UHJvcGVydHk/LihzcmNQcm9wKSkpIHJldHVybiBtYXJrUmVhbFByb3Aoc3JjPy5nZXRQcm9wZXJ0eT8uKHNyY1Byb3ApLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQpIHNyY1tzcmNQcm9wXSA/Pz0gaW5pdGlhbCA/PyBzcmNbc3JjUHJvcF07XG5cdGNvbnN0IHIgPSBvYnNlcnZlKHtcblx0XHRbJHZhbHVlXTogaXNTZXQgPyAhIXJlYWRTbG90KCkgOiByZWFkU2xvdCgpID8/IGluaXRpYWwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcocmVhZFNsb3QoKSA/PyB0aGlzWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQocmVhZFNsb3QoKSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0clskdHJpZ2dlckxvY2skMV0gPSB0cnVlO1xuXHRcdFx0aWYgKGlzU2V0KSB0aGlzWyR2YWx1ZV0gPSB3cml0ZVNsb3Qodik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc3QgbmV4dCA9IHYgPz8gZGVmYXVsdEJ5VHlwZShyZWFkU2xvdCgpKTtcblx0XHRcdFx0dGhpc1skdmFsdWVdID0gd3JpdGVTbG90KG5leHQpO1xuXHRcdFx0fVxuXHRcdFx0clskdHJpZ2dlckxvY2skMV0gPSBmYWxzZTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdGNvbnN0IHNsb3QgPSByZWFkU2xvdCgpO1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSA9IGlzU2V0ID8gISFzbG90IDogc2xvdCA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0bWFya1JlYWxQcm9wKHIsIHNyY1Byb3ApO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzcmMsICh2LCBfcHJvcCwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKF9wcm9wID09PSBzcmNQcm9wKSB7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IGlzU2V0ID8gdiAhPSBudWxsIDogdjtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gaXNTZXQgPyBvbGQgIT0gbnVsbCA6IG9sZDtcblx0XHRcdHI/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRcdGtleTogc3JjUHJvcCxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHI7XG59O1xudmFyICRyZWYgPSAodHlwZWQsIGJlaGF2aW9yKSA9PiB7XG5cdHN3aXRjaCAodHlwZW9mIHR5cGVkKSB7XG5cdFx0Y2FzZSBcImJvb2xlYW5cIjogcmV0dXJuIGJvb2xlYW5SZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwibnVtYmVyXCI6IHJldHVybiBudW1iZXJSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwic3RyaW5nXCI6IHJldHVybiBzdHJpbmdSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwib2JqZWN0XCI6IGlmICh0eXBlZCAhPSBudWxsKSByZXR1cm4gd3JhcFJlZihvYnNlcnZlKHR5cGVkKSwgYmVoYXZpb3IpO1xuXHRcdGRlZmF1bHQ6IHJldHVybiB3cmFwUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdH1cbn07XG52YXIgcmVmID0gKHR5cGVkLCBwcm9wID0gXCJ2YWx1ZVwiLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCAkciA9IGlzT2JzZXJ2YWJsZSh0eXBlZCkgPyB0eXBlZCA6ICRyZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0aWYgKHByb3AgIT0gbnVsbCkgcmV0dXJuIHByb3BSZWYoJHIsIHByb3AsIGJlaGF2aW9yKTtcblx0ZWxzZSByZXR1cm4gJHI7XG59O1xudmFyIHByb21pc2VkID0gKHByb21pc2UsIGJlaGF2aW9yKSA9PiB7XG5cdHJldHVybiByZWYocHJvbWlzZSwgYmVoYXZpb3IpO1xufTtcbnZhciB0cmlnZ2VyV2l0aERlbGF5ID0gKHJlZiwgY2IsIGRlbGF5ID0gMTAwKSA9PiB7XG5cdGlmIChyZWY/LnZhbHVlID8/IHJlZikgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGlmIChyZWYudmFsdWUpIGNiPy4oKTtcblx0fSwgZGVsYXkpO1xufTtcbnZhciBkZWxheWVkQmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHR9O1xufTtcbnZhciBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHRcdGlmICghdG0pIGNiPy4oKTtcblx0fTtcbn07XG5mdW5jdGlvbiBvYnNlcnZlKHRhcmdldCwgc3RhdGVOYW1lKSB7XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0aWYgKCh0YXJnZXQgPSBkZXJlZj8uKHRhcmdldCkpID09IG51bGwgfHwgdGFyZ2V0IGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0YXJnZXQgaW5zdGFuY2VvZiBXZWFrUmVmIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0Y29uc3QgdW53cmFwID0gdGFyZ2V0O1xuXHRpZiAodW53cmFwID09IG51bGwgfHwgdHlwZW9mIHVud3JhcCA9PSBcInN5bWJvbFwiIHx8ICEodHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiKSB8fCB1bndyYXAgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHVud3JhcCBpbnN0YW5jZW9mIFdlYWtSZWYpIHJldHVybiB1bndyYXA7XG5cdGxldCByZWFjdGl2ZSA9IHVud3JhcDtcblx0aWYgKEFycmF5LmlzQXJyYXkodW53cmFwKSkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZUFycmF5KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZU1hcCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVTZXQodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlT2JqZWN0KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9XG5cdHJldHVybiByZWFjdGl2ZTtcbn1cbnZhciBpc09ic2VydmFibGUgPSAodGFyZ2V0KSA9PiB7XG5cdGlmICh0eXBlb2YgSFRNTElucHV0RWxlbWVudCAhPSBcInVuZGVmaW5lZFwiICYmIHRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSB8fCBzdWJzY3JpcHRSZWdpc3RyeT8uaGFzPy4odGFyZ2V0KSkpO1xufTtcbnZhciByZWNvdmVyUmVhY3RpdmUgPSAodGFyZ2V0KSA9PiB7XG5cdHJldHVybiBpc09ic2VydmFibGUodGFyZ2V0KSA/IG9ic2VydmUodGFyZ2V0KSA6IG51bGw7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9NYWlubGluZS50c1xudmFyIHVzZU9ic2VydmFibGUgPSAodW53cmFwKSA9PiB7XG5cdGlmICh1bndyYXAgPT0gbnVsbCB8fCB0eXBlb2YgdW53cmFwICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHVud3JhcCAhPSBcImZ1bmN0aW9uXCIgfHwgdW53cmFwPy5bU3ltYm9sLm9ic2VydmFibGVdICE9IG51bGwpIHJldHVybiB1bndyYXA7XG5cdHRyeSB7XG5cdFx0dW53cmFwW1N5bWJvbC5vYnNlcnZhYmxlXSA9IHNlbGY/LmNvbXBhdGlibGU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRjb25zb2xlLndhcm4oXCJVbmFibGUgdG8gYXNzaWduIDxbU3ltYm9sLm9ic2VydmFibGVdPiwgb2JqZWN0IHdpbGwgbm90IG9ic2VydmFibGUgYnkgb3RoZXIgZnJhbWV3b3Jrc1wiKTtcblx0fVxuXHR1bndyYXBbJGFmZmVjdGVkXSA9IChjYiwgcHJvcCwgb3B0aW9ucykgPT4ge1xuXHRcdGNvbnN0IG9ic2VydmFibGUgPSB1bndyYXA/LltTeW1ib2w/Lm9ic2VydmFibGVdO1xuXHRcdG9ic2VydmFibGU/LigpPy5hZmZlY3RlZD8uKGNiLCBwcm9wLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gKCkgPT4gb2JzZXJ2YWJsZT8uKCk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH07XG5cdHJldHVybiB1bndyYXA7XG59O1xudmFyIHNwZWNpYWxpemVkU3Vic2NyaWJlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgY2hlY2tWYWxpZE9iaiA9IChvYmopID0+IHtcblx0aWYgKHR5cGVvZiBvYmogPT0gXCJzeW1ib2xcIiB8fCBvYmogPT0gbnVsbCB8fCAhKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikpIHJldHVybjtcblx0cmV0dXJuIG9iajtcbn07XG52YXIgaW5pdGlhbFRyaWdnZXIgPSBcImluaXRpYWxcIjtcbnZhciByZWFsUHJvcE9mID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCBwcm9wID0gdGFyZ2V0Py5bJHJlYWxQcm9wXSA/PyB0YXJnZXQ/LnJlYWxQcm9wO1xuXHRyZXR1cm4gaXNLZXlUeXBlKHByb3ApID8gcHJvcCA6IG51bGw7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mKHRhcmdldCk7XG5cdGlmIChyZWFsUHJvcCAhPSBudWxsICYmIChwcm9wID09IG51bGwgfHwgcHJvcCA9PSBcInZhbHVlXCIpKSByZXR1cm4gcmVhbFByb3A7XG5cdHJldHVybiBwcm9wO1xufTtcbnZhciBwcm9wVmFsdWVPZiA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0aWYgKHByb3AgIT0gbnVsbCAmJiBwcm9wID09IHJlYWxQcm9wT2YodGFyZ2V0KSkgcmV0dXJuIHRhcmdldD8udmFsdWU7XG5cdHJldHVybiB0YXJnZXQ/Lltwcm9wXTtcbn07XG52YXIgY2FsbEJ5UHJvcFJlZkF3YXJlID0gKHRhcmdldCwgcHJvcCwgY2IsIGN0eCkgPT4ge1xuXHRpZiAocHJvcCAhPSBudWxsICYmIHByb3AgPT0gcmVhbFByb3BPZih0YXJnZXQpKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSBwcm9wVmFsdWVPZih0YXJnZXQsIHByb3ApO1xuXHRcdGlmICh2YWx1ZSAhPSBudWxsKSByZXR1cm4gY2I/Lih2YWx1ZSwgcHJvcCwgbnVsbCwgXCJzZXRcIik7XG5cdH1cblx0cmV0dXJuIGNhbGxCeVByb3AodGFyZ2V0LCBwcm9wLCBjYiwgY3R4KTtcbn07XG52YXIgd2l0aFRyaWdnZXIgPSAoY2IsIG9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKTtcblx0aWYgKHRyaWdnZXIgPT0gaW5pdGlhbFRyaWdnZXIpIHtcblx0XHRpZiAoIW5vcm1hbGl6ZWQudHJpZ2dlckltbWVkaWF0ZWx5KSByZXR1cm47XG5cdH0gZWxzZSBpZiAoIXRyaWdnZXJGaWx0ZXJBbGxvd3Mobm9ybWFsaXplZC5hZmZlY3RUeXBlcywgdHJpZ2dlcikpIHJldHVybjtcblx0cmV0dXJuICh2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIC4uLmV0YykgPT4gY2I/Lih2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG59O1xudmFyIHN1YnNjcmliZURpcmVjdGx5ID0gKHRhcmdldCwgcHJvcCwgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmICghdGFyZ2V0KSByZXR1cm47XG5cdGlmICghY2hlY2tWYWxpZE9iaih0YXJnZXQpKSByZXR1cm47XG5cdGNvbnN0IHRQcm9wID0gcHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IgPyBub3JtYWxpemVBZmZlY3RlZFByb3AodGFyZ2V0LCBwcm9wKSA6IG51bGw7XG5cdGxldCByZWdpc3RyeSA9IHRhcmdldD8uWyRyZWdpc3RyeUtleSRdID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHR0YXJnZXQgPSB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldDtcblx0cXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuXHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0aWYgKCFpbml0aWFsQ2IpIHJldHVybjtcblx0XHRpZiAodFByb3AgIT0gbnVsbCAmJiB0UHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IpIGNhbGxCeVByb3BSZWZBd2FyZSh0YXJnZXQsIHRQcm9wLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdGVsc2UgY2FsbEJ5QWxsUHJvcCh0YXJnZXQsIGluaXRpYWxDYiwgbnVsbCk7XG5cdH0pO1xuXHRsZXQgdW5TdWIgPSByZWdpc3RyeT8uYWZmZWN0ZWQ/LihjYiwgdFByb3AsIG9wdGlvbnMpO1xuXHRpZiAodGFyZ2V0Py5bU3ltYm9sLmRpc3Bvc2VdKSByZXR1cm4gdW5TdWI7XG5cdGFkZFRvQ2FsbENoYWluKHVuU3ViLCBTeW1ib2wuZGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih1blN1YiwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih0YXJnZXQsIFN5bWJvbC5kaXNwb3NlLCB1blN1Yik7XG5cdGFkZFRvQ2FsbENoYWluKHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRyZXR1cm4gdW5TdWI7XG59O1xudmFyIHN1YnNjcmliZUlucHV0ID0gKHRnLCBfLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgYWZmZWN0VHlwZXMgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucykuYWZmZWN0VHlwZXM7XG5cdGNvbnN0ICRvcHQgPSB7fTtcblx0bGV0IG9sZFZhbHVlID0gdGc/LnZhbHVlO1xuXHRjb25zdCAkY2IgPSAoZXYpID0+IHtcblx0XHRjb25zdCB2YWx1ZSA9IGV2Py50YXJnZXQ/LnZhbHVlO1xuXHRcdGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcInNldFwiKSkgY2I/Lih2YWx1ZSwgXCJ2YWx1ZVwiLCBvbGRWYWx1ZSwgXCJzZXRcIiwgZXYpO1xuXHRcdG9sZFZhbHVlID0gdmFsdWU7XG5cdH07XG5cdHRnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcblx0cmV0dXJuICgpID0+IHRnPy5yZW1vdmVFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcbn07XG52YXIgY2hlY2tJc1BhaXJlZCA9ICh0ZykgPT4ge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh0ZykgJiYgdGc/Lmxlbmd0aCA9PSAyICYmIGNoZWNrVmFsaWRPYmoodGc/LlswXSkgJiYgKGlzS2V5VHlwZSh0Zz8uWzFdKSB8fCB0Zz8uWzFdID09IFN5bWJvbC5pdGVyYXRvcik7XG59O1xudmFyIGlzRWZmZWN0T3B0aW9uc0FyZyA9ICh2YWx1ZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiB2YWx1ZSB8fCBcInRyaWdnZXJzXCIgaW4gdmFsdWUgfHwgXCJ0cmlnZ2VySW1tZWRpYXRlbHlcIiBpbiB2YWx1ZSk7XG59O1xudmFyIG5vcm1hbGl6ZUVmZmVjdFRhcmdldHMgPSAodGFyZ2V0cykgPT4ge1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gW107XG5cdGlmIChBcnJheS5pc0FycmF5KHRhcmdldHMpICYmICFjaGVja0lzUGFpcmVkKHRhcmdldHMpICYmICFpc09ic2VydmFibGUodGFyZ2V0cykpIHJldHVybiB0YXJnZXRzO1xuXHRyZXR1cm4gW3RhcmdldHNdO1xufTtcbnZhciBlZmZlY3RUYXJnZXRDb250ZXh0ID0gKHNvdXJjZSkgPT4ge1xuXHRpZiAoY2hlY2tJc1BhaXJlZChzb3VyY2UpKSB7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gc291cmNlPy5bMF07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNvdXJjZSxcblx0XHRcdHRhcmdldCxcblx0XHRcdHByb3A6IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCh0YXJnZXQsIHNvdXJjZT8uWzFdKVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHtcblx0XHRzb3VyY2UsXG5cdFx0dGFyZ2V0OiBzb3VyY2UsXG5cdFx0cHJvcDogbnVsbFxuXHR9O1xufTtcbnZhciB0b0VmZmVjdEV2ZW50ID0gKHNvdXJjZSwgdGFyZ2V0LCB2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIGFyZ3MpID0+ICh7XG5cdHNvdXJjZSxcblx0dGFyZ2V0LFxuXHR2YWx1ZSxcblx0cHJvcCxcblx0bmFtZTogcHJvcCxcblx0b2xkVmFsdWUsXG5cdHRyaWdnZXIsXG5cdGFyZ3Ncbn0pO1xudmFyIHN1YnNjcmliZVBhaXJlZCA9ICh0ZywgXywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IHByb3AgPSBpc0tleVR5cGUodGc/LlsxXSkgPyB0Zz8uWzFdIDogbnVsbDtcblx0cmV0dXJuIGFmZmVjdGVkKHRnPy5bMF0sIHByb3AsIGNiLCBvcHRpb25zKTtcbn07XG52YXIgc3Vic2NyaWJlVGhlbmFibGUgPSAob2JqLCBwcm9wLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0cmV0dXJuIG9iaj8udGhlbj8uKChvYmopID0+IGFmZmVjdGVkPy4ob2JqLCBwcm9wLCBjYiwgb3B0aW9ucykpPy5jYXRjaD8uKChlKSA9PiB7XG5cdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9KTtcbn07XG52YXIgYWZmZWN0ZWQgPSAob2JqLCBwcm9wLCBjYiA9ICgpID0+IHt9LCBvcHRpb25zKSA9PiB7XG5cdGlmICh0eXBlb2YgcHJvcCA9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRvcHRpb25zID0gY2I7XG5cdFx0Y2IgPSBwcm9wO1xuXHRcdHByb3AgPSBudWxsO1xuXHR9IGVsc2UgcHJvcCA9IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcChvYmosIHByb3ApO1xuXHRpZiAodHlwZW9mIGNiID09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShjYikpIHtcblx0XHRvcHRpb25zID0gY2I7XG5cdFx0Y2IgPSAoKSA9PiB7fTtcblx0fVxuXHRpZiAoaXNQcmltaXRpdmUob2JqKSB8fCB0eXBlb2Ygb2JqID09IFwic3ltYm9sXCIpIHtcblx0XHRpZiAobm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpLnRyaWdnZXJJbW1lZGlhdGVseSkgcmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdHJldHVybiBjYj8uKG9iaiwgbnVsbCwgbnVsbCwgbnVsbCwgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdH0pKTtcblx0fVxuXHRpZiAodHlwZW9mIG9iaj8uWyRhZmZlY3RlZF0gPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gb2JqPy5bJGFmZmVjdGVkXT8uKGNiLCBwcm9wLCBvcHRpb25zKTtcblx0ZWxzZSBpZiAoY2hlY2tWYWxpZE9iaihvYmopKSB7XG5cdFx0Y29uc3Qgd3JhcHBlZCA9IG9iajtcblx0XHRpZiAoc3BlY2lhbGl6ZWRTdWJzY3JpYmU/Lmhhcz8uKG9iaiA9IG9iaj8uWyRleHRyYWN0S2V5JF0gPz8gb2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXQ/LihvYmopPy4od3JhcHBlZCwgcHJvcCwgY2IsIG9wdGlvbnMpO1xuXHRcdGlmIChpc09ic2VydmFibGUod3JhcHBlZCkgfHwgY2hlY2tJc1BhaXJlZChvYmopICYmIGlzT2JzZXJ2YWJsZShvYmo/LlswXSkpIHtcblx0XHRcdGlmIChpc1RoZW5hYmxlKG9iaikpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZVRoZW5hYmxlKT8uKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMpO1xuXHRcdFx0ZWxzZSBpZiAoY2hlY2tJc1BhaXJlZChvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVQYWlyZWQpPy4ob2JqLCBwcm9wLCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgSFRNTElucHV0RWxlbWVudCAhPSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZUlucHV0KT8uKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMpO1xuXHRcdFx0ZWxzZSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVEaXJlY3RseSk/Lih3cmFwcGVkLCBwcm9wLCBjYiwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0XHRpZiAoIWluaXRpYWxDYikgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdFx0aWYgKGNoZWNrSXNQYWlyZWQob2JqKSkgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaj8uWzBdLCBvYmo/LlsxXSwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdFx0ZWxzZSBpZiAocHJvcCAhPSBudWxsICYmIHByb3AgIT0gU3ltYm9sLml0ZXJhdG9yKSByZXR1cm4gY2FsbEJ5UHJvcFJlZkF3YXJlPy4ob2JqLCBwcm9wLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0XHRlbHNlIHJldHVybiBjYWxsQnlBbGxQcm9wPy4ob2JqLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxufTtcbmZ1bmN0aW9uIGVmZmVjdChjYiwgdGFyZ2V0cywgb3B0aW9ucykge1xuXHRpZiAoY2IgPT0gbnVsbCB8fCB0eXBlb2YgY2IgIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGlmIChpc0VmZmVjdE9wdGlvbnNBcmcodGFyZ2V0cykgJiYgb3B0aW9ucyA9PT0gdm9pZCAwKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIHRhcmdldHMpO1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIG9wdGlvbnMpO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Y29uc3QgYWZmZWN0ZWRPcHRpb25zID0ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVkLmFmZmVjdFR5cGVzLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogbm9ybWFsaXplZC50cmlnZ2VySW1tZWRpYXRlbHlcblx0fTtcblx0Y29uc3QgZGlzcG9zZXJzID0gbm9ybWFsaXplRWZmZWN0VGFyZ2V0cyh0YXJnZXRzKS5tYXAoKHNvdXJjZSkgPT4ge1xuXHRcdGNvbnN0IGN0eCA9IGVmZmVjdFRhcmdldENvbnRleHQoc291cmNlKTtcblx0XHRyZXR1cm4gYWZmZWN0ZWQoY3R4LnRhcmdldCwgY3R4LnByb3AsICh2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmFyZ3MpID0+IHtcblx0XHRcdHJldHVybiBjYih0b0VmZmVjdEV2ZW50KGN0eC5zb3VyY2UsIGN0eC50YXJnZXQsIHZhbHVlLCBwcm9wLCBvbGRWYWx1ZSwgdHJpZ2dlciA/PyBudWxsLCBhcmdzKSk7XG5cdFx0fSwgYWZmZWN0ZWRPcHRpb25zKTtcblx0fSkuZmlsdGVyKChkaXNwb3NlKSA9PiB0eXBlb2YgZGlzcG9zZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRyZXR1cm4gKCkgPT4gZGlzcG9zZXJzLmZvckVhY2goKGRpc3Bvc2UpID0+IGRpc3Bvc2U/LigpKTtcbn1cbmZ1bmN0aW9uIGVmZmVjdGVkKHRhcmdldHMsIGNiLCBvcHRpb25zKSB7XG5cdHJldHVybiBlZmZlY3QoY2IsIHRhcmdldHMsIG9wdGlvbnMpO1xufVxudmFyIG1ha2VBcnJheU9ic2VydmFibGUgPSAodGcpID0+IHtcblx0aWYgKHRnIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gb2JzZXJ2YWJsZUJ5U2V0KHRnKTtcblx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gb2JzZXJ2YWJsZUJ5TWFwKHRnKTtcblx0cmV0dXJuIHRnO1xufTtcbnZhciBEb3VibGVXZWFrTWFwID0gY2xhc3Mge1xuXHQjdG9wID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdCNlbnN1cmVJbm5lcihrZXkxKSB7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbnVsbDtcblx0XHRsZXQgaW5uZXIgPSB0aGlzLiN0b3AuZ2V0KGtleTEpO1xuXHRcdGlmICghaW5uZXIpIHtcblx0XHRcdGlubmVyID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdFx0XHR0aGlzLiN0b3Auc2V0KGtleTEsIGlubmVyKTtcblx0XHR9XG5cdFx0cmV0dXJuIGlubmVyO1xuXHR9XG5cdCNzcGxpdFBhaXIocGFpcikge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShwYWlyKSB8fCBwYWlyLmxlbmd0aCAhPT0gMikgcmV0dXJuIFtudWxsLCBudWxsXTtcblx0XHRyZXR1cm4gcGFpcjtcblx0fVxuXHRoYXNMMShrZXkxKSB7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5oYXMoa2V5MSk7XG5cdH1cblx0c2V0KHBhaXIsIHZhbHVlKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRoaXM7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRnZXQocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2b2lkIDA7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5nZXQoa2V5MSk/LmdldChrZXkyKTtcblx0fVxuXHRoYXMocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmdldChrZXkxKT8uaGFzKGtleTIpID8/IGZhbHNlO1xuXHR9XG5cdGRlbGV0ZShwYWlyKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jdG9wLmdldChrZXkxKTtcblx0XHRyZXR1cm4gaW5uZXIgPyBpbm5lci5kZWxldGUoa2V5MikgOiBmYWxzZTtcblx0fVxuXHRkZWxldGVUb3Aoa2V5MSkge1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZGVsZXRlKGtleTEpO1xuXHR9XG5cdGdldE9yQ3JlYXRlKHBhaXIsIGZhY3RvcnkpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFjdG9yeT8uKCk7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRjb25zdCB2YWx1ZSA9IGZhY3RvcnkoKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRnZXRPckluc2VydChwYWlyLCB2YWx1ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cdGdldE9ySW5zZXJ0Q29tcHV0ZWQocGFpciwgY29tcHV0ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb21wdXRlPy4oW2tleTEsIGtleTJdKTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGNvbnN0IHZhbHVlID0gY29tcHV0ZShba2V5MSwga2V5Ml0pO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59O1xudmFyIHJlZ2lzdGVyZWRJdGVyYXRlZCA9IG5ldyBEb3VibGVXZWFrTWFwKCk7XG5mdW5jdGlvbiBpdGVyYXRlZCh0ZywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdGlmICghdGcpIHJldHVybjtcblx0aWYgKHR5cGVvZiB0ZyAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGcgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAocmVnaXN0ZXJlZEl0ZXJhdGVkLmhhcyhbdGcsIGNiXSkpIHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0KFt0ZywgY2JdKTtcblx0Y29uc3QgJHN1YiA9ICh2YWx1ZSwgbmFtZSwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZVwiKSB7XG5cdFx0XHRjb25zdCBlbnRyaWVzID0gKG9sZD8udmFsdWUgPz8gb2xkKT8uZW50cmllcz8uKCk7XG5cdFx0XHRjb25zdCBiYXNpcyA9IHRnPy52YWx1ZSA/PyB2YWx1ZT8udmFsdWUgPz8gdmFsdWU7XG5cdFx0XHRpZiAoZW50cmllcykgZm9yIChjb25zdCBbaWR4LCBpdGVtXSBvZiBlbnRyaWVzKSB7XG5cdFx0XHRcdGNvbnN0IG9mT2xkID0gaXRlbSA/PyAob2xkPy52YWx1ZSA/PyBvbGQpPy5baWR4XSA/PyBudWxsO1xuXHRcdFx0XHRjb25zdCBvZk5ldyA9IGJhc2lzPy5baWR4XTtcblx0XHRcdFx0aWYgKG9mT2xkID09IG51bGwgJiYgb2ZOZXcgIT0gbnVsbCkgY2Iob2ZOZXcsIGlkeCwgbnVsbCwgXCJhZGRcIik7XG5cdFx0XHRcdGVsc2UgaWYgKG9mT2xkICE9IG51bGwgJiYgb2ZOZXcgPT0gbnVsbCkgY2IobnVsbCwgaWR4LCBvZk9sZCwgXCJkZWxldGVcIik7XG5cdFx0XHRcdGVsc2UgaWYgKGlzTm90RXF1YWwob2ZPbGQsIG9mTmV3KSkgY2Iob2ZOZXcsIGlkeCwgb2ZPbGQsIFwic2V0XCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGl0ZXJhdGVkKHZhbHVlID8/IHRnPy52YWx1ZSwgY2IsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmFtZSA9PSBudWxsID8gdm9pZCAwIDogdGdbbmFtZV07XG5cdH07XG5cdHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0T3JJbnNlcnRDb21wdXRlZChbdGcsIGNiXSwgKCkgPT4ge1xuXHRcdGlmICh0ZyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIGFmZmVjdGVkKFtvYnNlcnZhYmxlQnlTZXQodGcpLCBTeW1ib2wuaXRlcmF0b3JdLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gYWZmZWN0ZWQodGcsIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaGFzVmFsdWUodGcpKSByZXR1cm4gYWZmZWN0ZWQodGcsICRzdWIsIG9wdGlvbnMpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHRnKSAmJiAhKHRnPy5sZW5ndGggPT0gMiAmJiBpc0tleVR5cGUodGc/LlsxXSkgJiYgaXNPYnNlcnZhYmxlKHRnPy5bMF0pKSkgcmV0dXJuIGFmZmVjdGVkKFt0ZywgU3ltYm9sLml0ZXJhdG9yXSwgY2IsIG9wdGlvbnMpO1xuXHRcdHJldHVybiBhZmZlY3RlZCh0ZywgY2IsIG9wdGlvbnMpO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIHVuYWZmZWN0ZWQodGcsIGNiKSB7XG5cdHJldHVybiB3aXRoUHJvbWlzZSh0ZywgKHRhcmdldCkgPT4ge1xuXHRcdGNvbnN0IGlzUGFpciA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KSAmJiB0YXJnZXQ/Lmxlbmd0aCA9PSAyICYmIFtcIm9iamVjdFwiLCBcImZ1bmN0aW9uXCJdLmluZGV4T2YodHlwZW9mIHRhcmdldD8uWzBdKSA+PSAwICYmIGlzS2V5VHlwZSh0YXJnZXQ/LlsxXSk7XG5cdFx0Y29uc3QgcHJvcCA9IGlzUGFpciA/IHRhcmdldD8uWzFdIDogbnVsbDtcblx0XHR0YXJnZXQgPSBpc1BhaXIgJiYgcHJvcCAhPSBudWxsID8gdGFyZ2V0Py5bMF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdGNvbnN0IHVud3JhcCA9IHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdCh0YXJnZXQ/LlskcmVnaXN0cnlLZXkkXSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKSk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH0pO1xufVxudmFyIGJpbmRCeSA9ICh0YXJnZXQsIHJlYWN0aXZlLCB3YXRjaCkgPT4ge1xuXHRhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHYsIHApID0+IHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2LCBwLCB0cnVlKTtcblx0fSk7XG5cdHdhdGNoPy4oKCkgPT4gdGFyZ2V0LCAoTikgPT4ge1xuXHRcdGZvciAoY29uc3QgayBpbiBOKSBvYmplY3RBc3NpZ24ocmVhY3RpdmUsIE5ba10sIGssIHRydWUpO1xuXHR9LCB7IGRlZXA6IHRydWUgfSk7XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGRlcml2YXRlID0gKGZyb20sIHJlYWN0Rm4sIHdhdGNoKSA9PiBiaW5kQnkocmVhY3RGbihzYWZlKGZyb20pKSwgZnJvbSwgd2F0Y2gpO1xudmFyIGJpbmRCeUtleSA9ICh0YXJnZXQsIHJlYWN0aXZlLCBrZXkgPSAoKSA9PiBcIlwiKSA9PiBhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHZhbHVlLCBwKSA9PiB7XG5cdGlmIChwID09IGtleSgpKSBvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbnVsbCwgdHJ1ZSk7XG59KTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvQXNzaWduZWQudHNcbnZhciBjb25kaXRpb25hbEluZGV4ID0gKGNvbmRMaXN0ID0gW10pID0+IHtcblx0Y29uc3Qgc291cmNlID0gb2JzZXJ2ZSh7IHZhbHVlOiAwIH0pO1xuXHRjb25zdCByZWFkQ29uZGl0aW9uID0gKGNvbmRpdGlvbikgPT4ge1xuXHRcdGlmICh0eXBlb2YgY29uZGl0aW9uID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbmRpdGlvbigpO1xuXHRcdHJldHVybiBoYXNWYWx1ZShjb25kaXRpb24pID8gY29uZGl0aW9uLnZhbHVlIDogY29uZGl0aW9uO1xuXHR9O1xuXHRjb25zdCBldmFsdWF0ZSA9ICgpID0+IGNvbmRMaXN0LmZpbmRJbmRleCgoY29uZGl0aW9uKSA9PiAhIXJlYWRDb25kaXRpb24oY29uZGl0aW9uKSk7XG5cdGNvbnN0IHJlc3VsdCA9IGNvbXB1dGVkKFtzb3VyY2UsIFwidmFsdWVcIl0sIGV2YWx1YXRlLCBcInZhbHVlXCIpO1xuXHRjb25zdCBpbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdHNvdXJjZS52YWx1ZSsrO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlcnMgPSBbXTtcblx0aWYgKGlzT2JzZXJ2YWJsZShjb25kTGlzdCkpIGRpc3Bvc2Vycy5wdXNoKGFmZmVjdGVkKGNvbmRMaXN0LCBpbnZhbGlkYXRlLCB7XG5cdFx0YWZmZWN0VHlwZXM6IFtcblx0XHRcdFwiYWRkXCIsXG5cdFx0XHRcInNldFwiLFxuXHRcdFx0XCJkZWxldGVcIlxuXHRcdF0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIGNvbmRMaXN0KSBpZiAoaGFzVmFsdWUoY29uZGl0aW9uKSkgZGlzcG9zZXJzLnB1c2goYWZmZWN0ZWQoW2NvbmRpdGlvbiwgXCJ2YWx1ZVwiXSwgaW52YWxpZGF0ZSwge1xuXHRcdGFmZmVjdFR5cGVzOiBbXCJzZXR0ZXJcIl0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGFkZFRvQ2FsbENoYWluKHJlc3VsdCwgU3ltYm9sLmRpc3Bvc2UsICgpID0+IGRpc3Bvc2Vycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlPy4oKSkpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbnZhciBjb25kaXRpb25hbFJlZiA9IChjb25kLCBpZlRydWUsIGlmRmFsc2UsIGJlaGF2aW9yKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShjb25kKSkgcmV0dXJuIGNvbmQgPyBpZlRydWUgOiBpZkZhbHNlO1xuXHRjb25zdCBnZXRUcnVlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZlRydWU7XG5cdH07XG5cdGNvbnN0IGdldEZhbHNlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZkZhbHNlO1xuXHR9O1xuXHRjb25zdCB2YWx1ZU9mID0gKG4pID0+IHtcblx0XHRpZiAobiAhPSBudWxsKSBjb25kLnZhbHVlID0gaGFzVmFsdWUobikgPyBuPy52YWx1ZSA6IG47XG5cdFx0cmV0dXJuIChoYXNWYWx1ZShjb25kKSA/IGNvbmQ/LnZhbHVlIDogY29uZCkgPyBnZXRUcnVlKCkgOiBnZXRGYWxzZSgpO1xuXHR9O1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IHZhbHVlT2YoKSxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV0sIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9IHZhbHVlT2Yodik7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gdmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXTtcblx0XHR9XG5cdH0pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChbY29uZCwgXCJ2YWx1ZVwiXSwgKCkgPT4ge1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gcj8uWyR2YWx1ZV07XG5cdFx0Y29uc3QgdmFsdWUgPSB2YWx1ZU9mKCk7XG5cdFx0clskdmFsdWVdID0gdmFsdWU7XG5cdFx0cj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRvbGRWYWx1ZSxcblx0XHRcdHRyaWdnZXI6IFwibWFudWFsXCJcblx0XHR9KTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHIsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcjtcbn07XG52YXIgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbFJlZjtcbnZhciByZW1hcCA9IChzdWIsIGNiLCBkZXN0KSA9PiB7XG5cdGlmICghZGVzdCkgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzdWIsICh2YWx1ZSwgcHJvcCwgb2xkKSA9PiB7XG5cdFx0aWYgKHByb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGNvbnN0IGdvdCA9IGNiPy4odmFsdWUsIHByb3AsIG9sZCk7XG5cdFx0aWYgKHR5cGVvZiBnb3QgPT0gXCJvYmplY3RcIikgb2JqZWN0QXNzaWduTm90RXF1YWwoZGVzdCwgZ290KTtcblx0XHRlbHNlIGlmIChpc05vdEVxdWFsKGRlc3RbcHJvcF0sIGdvdCkpIGRlc3RbcHJvcF0gPSBnb3Q7XG5cdH0pO1xuXHRpZiAoZGVzdCkgYWRkVG9DYWxsQ2hhaW4oZGVzdCwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiBkZXN0O1xufTtcbnZhciB1bmlmaWVkID0gKC4uLnN1YnMpID0+IHtcblx0Y29uc3QgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRzdWJzPy5mb3JFYWNoPy4oKHN1YikgPT4gYWZmZWN0ZWQoc3ViLCAodmFsdWUsIHByb3AsIF8pID0+IHtcblx0XHRpZiAocHJvcCA9PSBudWxsKSByZXR1cm47XG5cdFx0aWYgKGlzTm90RXF1YWwoZGVzdFtwcm9wXSwgdmFsdWUpKSBkZXN0W3Byb3BdID0gdmFsdWU7XG5cdH0pKTtcblx0cmV0dXJuIGRlc3Q7XG59O1xudmFyIG9ic2VydmFibGVCeVNldCA9IChzZXQpID0+IHtcblx0Y29uc3Qgb2JzID0gb2JzZXJ2ZShbXSk7XG5cdG9icy5wdXNoKC4uLkFycmF5LmZyb20oc2V0Py52YWx1ZXM/LigpIHx8IFtdKSk7XG5cdGFkZFRvQ2FsbENoYWluKG9icywgU3ltYm9sLmRpc3Bvc2UsIGFmZmVjdGVkKHNldCwgKHZhbHVlLCBfLCBvbGQpID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2YWx1ZSwgb2xkKSkge1xuXHRcdFx0aWYgKG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwpIG9icy5wdXNoKHZhbHVlKTtcblx0XHRcdGVsc2UgaWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gb2JzLmluZGV4T2Yob2xkKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwKSBvYnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBpZHggPSBvYnMuaW5kZXhPZihvbGQpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDAgJiYgaXNOb3RFcXVhbChvYnNbaWR4XSwgdmFsdWUpKSBvYnNbaWR4XSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkpO1xuXHRyZXR1cm4gb2JzO1xufTtcbnZhciBvYnNlcnZhYmxlQnlNYXAgPSAobWFwKSA9PiB7XG5cdGNvbnN0IG9icyA9IG9ic2VydmUoW10pO1xuXHRjb25zdCBpbml0aWFsRW50cmllcyA9IEFycmF5LmZyb20obWFwLmVudHJpZXMoKSk7XG5cdG9icy5wdXNoKC4uLmluaXRpYWxFbnRyaWVzKTtcblx0YWRkVG9DYWxsQ2hhaW4ob2JzLCBTeW1ib2wuZGlzcG9zZSwgYWZmZWN0ZWQobWFwLCAodmFsdWUsIHByb3AsIG9sZCkgPT4ge1xuXHRcdGlmIChpc05vdEVxdWFsKHZhbHVlLCBvbGQpIHx8IG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwgfHwgb2xkICE9IG51bGwgJiYgdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0aWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0bGV0IGlkeCA9IG9icy5maW5kSW5kZXgoKFtuYW1lLCBfXSkgPT4gbmFtZSA9PSBwcm9wKTtcblx0XHRcdFx0aWYgKGlkeCA8IDApIGlkeCA9IG9icy5maW5kTGFzdEluZGV4KChbXywgdmFsXSkgPT4gb2xkID09PSB2YWwpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDApIG9icy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBpZHggPSBvYnMuZmluZEluZGV4KChbbmFtZSwgX10pID0+IG5hbWUgPT0gcHJvcCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCAmJiBpZHggPCBvYnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2JzW2lkeF0/LlsxXSwgdmFsdWUpKSBvYnNbaWR4XSA9IFtwcm9wLCB2YWx1ZV07XG5cdFx0XHRcdH0gZWxzZSBvYnMucHVzaChbcHJvcCwgdmFsdWVdKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKTtcblx0cmV0dXJuIG9icztcbn07XG52YXIgYXNzaWduTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgYXNzaWduID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgaXNBQ29tcHV0ZSA9IHR5cGVvZiBhPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIGE/Lmxlbmd0aCA9PSAyLCBpc0JDb21wdXRlID0gdHlwZW9mIGI/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgYj8ubGVuZ3RoID09IDIsIGNtcEJGbmMgPSBpc0JDb21wdXRlID8gYj8uWzFdIDogbnVsbDtcblx0Y29uc3QgaXNBUHJvcCA9IChpc0tleVR5cGUoYT8uWzFdKSB8fCBhPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBhPy5sZW5ndGggPT0gMjtcblx0bGV0IGFfcHJvcCA9IGlzQVByb3AgJiYgIWlzQUNvbXB1dGUgPyBhPy5bMV0gOiBBcnJheS5pc0FycmF5KGEpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgYSA9IFthLCBhX3Byb3BdO1xuXHRpZiAoaXNBQ29tcHV0ZSkgYVsxXSA9IGFfcHJvcDtcblx0Y29uc3QgaXNCUHJvcCA9IChpc0tleVR5cGUoYj8uWzFdKSB8fCBiPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBiPy5sZW5ndGggPT0gMjtcblx0bGV0IGJfcHJvcCA9IGlzQlByb3AgJiYgIWlzQkNvbXB1dGUgPyBiPy5bMV0gOiBBcnJheS5pc0FycmF5KGIpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNCUHJvcCAmJiAhaXNCQ29tcHV0ZSkgYiA9IFtiLCBiX3Byb3BdO1xuXHRpZiAoaXNCQ29tcHV0ZSkgYlsxXSA9IGJfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGJfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgYT8uWzBdKSB8fCBpc0FycmF5SW52YWxpZEtleShiX3Byb3AsIGI/LlswXSkpIHJldHVybjtcblx0aWYgKCEoKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgYj8uWzBdICE9IG51bGwpICYmICFBcnJheS5pc0FycmF5KGFbMF0pKSB7XG5cdFx0JGF2b2lkVHJpZ2dlcihiLCAoKSA9PiB7XG5cdFx0XHRhWzBdW2FfcHJvcF0gPSBiPy5bMF07XG5cdFx0fSk7XG5cdFx0cmV0dXJuICgpID0+IHt9O1xuXHR9XG5cdGNvbnN0IGNvbXB1dGUgPSAodiwgcCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IGJfdG1wID0gYlJlZj8uZGVyZWY/LigpO1xuXHRcdGlmIChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uYm91bmQgPT0gYl90bXApIHtcblx0XHRcdGxldCB2YWwgPSBudWxsO1xuXHRcdFx0Y29uc3QgY21wZnggPSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uY21wZng7XG5cdFx0XHQkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgY21wZnggPT0gXCJmdW5jdGlvblwiKSB2YWwgPSBjbXBmeD8uKCRnZXRWYWx1ZShiX3RtcCkgPz8gdiwgcCwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgdmFsID0gYl90bXA/LltwXSA/PyB2O1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBudiA9ICRnZXRWYWx1ZSh2YWwpO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwoYV90bXBbYV9wcm9wXSwgbnYpKSAkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGFfdG1wW2FfcHJvcF0gPSBudjtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSAoKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApKT8uZ2V0Py4oYV9wcm9wKSk/LmRpc3Bvc2U/LigpO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlID0gKCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IG1hcCA9IGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApO1xuXHRcdGNvbnN0IHN0b3JlID0gbWFwPy5nZXQ/LihhX3Byb3ApO1xuXHRcdG1hcD8uZGVsZXRlPy4oYV9wcm9wKTtcblx0XHRzdG9yZT8udW5zdWI/LigpO1xuXHR9O1xuXHRjb25zdCBiUmVmID0gYj8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShiPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBiPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihiPy5bMF0pIDogYj8uWzBdLCBhUmVmID0gYT8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBhPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYT8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShhPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBhPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihhPy5bMF0pIDogYT8uWzBdO1xuXHRsZXQgc3RvcmUgPSB7XG5cdFx0Y29tcHV0ZSxcblx0XHRkaXNwb3NlLFxuXHRcdGNtcGZ4OiBjbXBCRm5jXG5cdH07XG5cdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpLCBiX3RtcCA9IGJSZWY/LmRlcmVmPy4oKTtcblx0aWYgKGFSZWYgaW5zdGFuY2VvZiBXZWFrUmVmKSB7XG5cdFx0aWYgKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5nZXQ/LihhX3Byb3ApPy5ib3VuZCAhPSBiX3RtcCkgYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmRlbGV0ZT8uKGFfcHJvcCk7XG5cdFx0c3RvcmUgPSAoYXNzaWduTWFwPy5nZXRPckluc2VydD8uKGFfdG1wLCAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKSk/LmdldE9ySW5zZXJ0Q29tcHV0ZWQ/LihhX3Byb3AsICgpID0+ICh7XG5cdFx0XHRib3VuZDogYl90bXAsXG5cdFx0XHRjbXBmeDogY21wQkZuYyxcblx0XHRcdHVuc3ViOiBudWxsLFxuXHRcdFx0Y29tcHV0ZSxcblx0XHRcdGRpc3Bvc2Vcblx0XHR9KSk7XG5cdFx0c3RvcmUudW5zdWIgPSBhZmZlY3RlZChiLCBjb21wdXRlKTtcblx0XHRzdG9yZS5jbXBmeCA9IGNtcEJGbmM7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYV90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYl90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdH1cblx0aWYgKGJfdG1wICYmICFBcnJheS5pc0FycmF5KGJfdG1wKSkgJGF2b2lkVHJpZ2dlcihhX3RtcCwgKCkgPT4ge1xuXHRcdGJfdG1wW2JfcHJvcF0gPz89IGFfdG1wPy5bYV9wcm9wXSA/PyBiX3RtcFtiX3Byb3BdO1xuXHR9KTtcblx0cmV0dXJuIHN0b3JlPy5kaXNwb3NlO1xufTtcbnZhciBsaW5rID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgdXN1YiA9IFthc3NpZ24oYSwgYiwgcHJvcCksIGFzc2lnbihiLCBhLCBwcm9wKV07XG5cdHJldHVybiAoKSA9PiB1c3ViPy5tYXA/LigoYykgPT4gYz8uKCkpO1xufTtcbnZhciBjb21wdXRlZCA9IChzcmMsIGNiLCBiZWhhdmlvciwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRjb25zdCBpc0FDb21wdXRlID0gdHlwZW9mIHNyYz8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRjb25zdCBpc0FQcm9wID0gKGlzS2V5VHlwZShzcmM/LlsxXSkgfHwgc3JjPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRsZXQgYV9wcm9wID0gaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSA/IHNyYz8uWzFdIDogQXJyYXkuaXNBcnJheShzcmMpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgc3JjID0gW2lzQVByb3AgPyBzcmM/LlswXSA6IHNyYywgYV9wcm9wXTtcblx0aWYgKGlzQUNvbXB1dGUpIHNyY1sxXSA9IGFfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgc3JjPy5bMF0pKSByZXR1cm47XG5cdGNvbnN0IGNtcCA9ICh2KSA9PiB7XG5cdFx0bGV0IG9sZFZhbHVlID0gdm9pZCAwO1xuXHRcdGlmICh2ICE9IHZvaWQgMCkge1xuXHRcdFx0b2xkVmFsdWUgPSBzcmNbMF1bYV9wcm9wXTtcblx0XHRcdHNyY1swXVthX3Byb3BdID0gdjtcblx0XHR9XG5cdFx0cmV0dXJuIGNiPy4oc3JjPy5bMF0/LlthX3Byb3BdLCBhX3Byb3AsIG9sZFZhbHVlKTtcblx0fTtcblx0Y29uc3QgaW5pdGlhbCA9IGNtcCgpO1xuXHRjb25zdCBwZW5kaW5nSW5pdGlhbCA9IGlzUHJvbWlzZShpbml0aWFsKTtcblx0Y29uc3QgcmYgPSBvYnNlcnZlKHtcblx0XHRbJHByb21pc2VdOiBwZW5kaW5nSW5pdGlhbCA/IGluaXRpYWwgOiB2b2lkIDAsXG5cdFx0WyR2YWx1ZV06IHBlbmRpbmdJbml0aWFsID8gdm9pZCAwIDogaW5pdGlhbCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyhjbXAoKSA/PyB0aGlzWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoY21wKCkgPz8gdGhpc1skdmFsdWVdLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSBjbXAodik7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gY21wKCkgPz8gdGhpc1skdmFsdWVdO1xuXHRcdH1cblx0fSk7XG5cdGNvbnN0IHdyaXRlQ29tcHV0ZWQgPSAodmFsdWUsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbigodikgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSByZj8uWyR2YWx1ZV07XG5cdFx0XHRyZlskdmFsdWVdID0gdjtcblx0XHRcdHJmPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdFx0dmFsdWU6IHYsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHY7XG5cdFx0fSk7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSByZj8uWyR2YWx1ZV07XG5cdFx0cmZbJHZhbHVlXSA9IHZhbHVlO1xuXHRcdHJmPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlclxuXHRcdH0pO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblx0aWYgKHBlbmRpbmdJbml0aWFsKSB3cml0ZUNvbXB1dGVkKGluaXRpYWwsIFwicmVzb2x2ZWRcIik7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKFtzcmM/LlswXSA/PyBzcmMsIGFfcHJvcCA/PyBcInZhbHVlXCJdLCAoKSA9PiB7XG5cdFx0d3JpdGVDb21wdXRlZChjbXAoKSwgXCJtYW51YWxcIik7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyZiwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiByZjtcbn07XG52YXIgZGVsYXllZFN1YnNjcmliZSA9IChyZWYsIGNiLCBkZWxheSA9IDEwMCkgPT4ge1xuXHRsZXQgdG07XG5cdHJldHVybiBhZmZlY3RlZChyZWYsIFwidmFsdWVcIiwgKHYpID0+IHtcblx0XHRpZiAoIXYgJiYgdG0pIHtcblx0XHRcdGNsZWFyVGltZW91dCh0bSk7XG5cdFx0XHR0bSA9IG51bGw7XG5cdFx0fSBlbHNlIGlmICh2ICYmICF0bSkgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHJlZiwgY2IsIGRlbGF5KSA/PyB0bTtcblx0fSk7XG59O1xuXG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7ICRhZmZlY3RlZCwgJHJlZiwgJHJlc29sdmVkLCAkdHJpZ2dlciwgJHRyaWdnZXJDb250cm9sLCAkdHJpZ2dlckxlc3MsICR0cmlnZ2VyTG9jaywgQXNzaWduT2JqZWN0SGFuZGxlciwgRG91YmxlV2Vha01hcCwgYWRkVG9DYWxsQ2hhaW4sIGFmZmVjdGVkLCBhc3NpZ24sIGFzc2lnbk1hcCwgYmluZEJ5LCBiaW5kQnlLZXksIGJvb2xlYW5SZWYsIGNvbXB1dGVkLCBjb25kaXRpb25hbCwgY29uZGl0aW9uYWxJbmRleCwgY29uZGl0aW9uYWxSZWYsIGRlbGF5ZWRCZWhhdmlvciwgZGVsYXllZE9ySW5zdGFudEJlaGF2aW9yLCBkZWxheWVkU3Vic2NyaWJlLCBkZXJlZiwgZGVyaXZhdGUsIGVmZmVjdCwgZWZmZWN0ZWQsIGlzT2JzZXJ2YWJsZSwgaXRlcmF0ZWQsIGxpbmssIG1ha2VBcnJheU9ic2VydmFibGUsIG1ha2VPYmplY3RBc3NpZ25hYmxlLCBtYWtlUmVzb2x2ZWRPcCwgbnVtYmVyUmVmLCBvYnNlcnZhYmxlQnlNYXAsIG9ic2VydmFibGVCeVNldCwgb2JzZXJ2ZSwgcHJvbWlzZWQsIHByb3BSZWYsIHJlY292ZXJSZWFjdGl2ZSwgcmVmLCByZW1hcCwgcmVzb2x2ZWQsIHNhZmUsIHNwZWNpYWxpemVkU3Vic2NyaWJlLCBzdHJpbmdSZWYsIHN1YnNjcmliZURpcmVjdGx5LCBzdWJzY3JpYmVJbnB1dCwgc3Vic2NyaWJlUGFpcmVkLCBzdWJzY3JpYmVUaGVuYWJsZSwgdHJpZ2dlcldpdGhEZWxheSwgdW5hZmZlY3RlZCwgdW5pZmllZCwgdW53cmFwLCB1c2VPYnNlcnZhYmxlLCB3cmFwUmVmLCB3cmFwU2V0QXNBcnJheSB9OyJdLAogICJtYXBwaW5ncyI6ICJBQUFBLFNBQVMsaUJBQUFBLElBQWUsYUFBQUMsSUFBVyxnQkFBZ0JDLElBQWdCLFlBQUFDLElBQVUsV0FBQUMsR0FBUyxpQkFBQUMsSUFBZSxjQUFBQyxJQUFZLGlCQUFBQyxJQUFlLFlBQUFDLEdBQVUscUJBQUFDLElBQW1CLGFBQUFDLEdBQVcsY0FBQUMsR0FBWSxlQUFBQyxHQUFhLGFBQUFDLEdBQVcsbUJBQUFDLElBQWlCLGdCQUFBQyxJQUFjLHdCQUFBQyxJQUFzQixvQkFBQUMsSUFBa0IsdUJBQUFDLElBQXFCLFlBQVlDLElBQVksa0JBQUFDLFNBQXNCO0FBR3RWLE9BQU8sZUFBZSx1QkFBTyxJQUFJLFlBQVk7QUFDN0MsT0FBTyxjQUFjLHVCQUFPLElBQUksV0FBVztBQUMzQyxPQUFPLGdCQUFnQix1QkFBTyxJQUFJLGFBQWE7QUFDL0MsSUFBSUMsSUFBUyx1QkFBTyxJQUFJLFFBQVEsR0FDNUJDLElBQWUsdUJBQU8sSUFBSSxVQUFVLEdBQ3BDQyxJQUFnQix1QkFBTyxJQUFJLFNBQVMsR0FDcENDLEtBQWdCLHVCQUFPLElBQUksV0FBVyxHQUN0Q0MsSUFBWSx1QkFBTyxJQUFJLFdBQVcsR0FDbENDLElBQVcsdUJBQU8sSUFBSSxVQUFVLEdBQ2hDQyxLQUFZLHVCQUFPLElBQUksV0FBVyxHQUNsQ0MsS0FBZSx1QkFBTyxJQUFJLGVBQWUsR0FDekNDLElBQWUsdUJBQU8sSUFBSSxlQUFlLEdBQ3pDQyxLQUFrQix1QkFBTyxJQUFJLGtCQUFrQixHQUMvQ0MsSUFBVyx1QkFBTyxJQUFJLFVBQVUsR0FDaENDLEtBQVksdUJBQU8sSUFBSSxZQUFZLEdBQ25DQyxLQUFjLHVCQUFPLElBQUksYUFBYSxHQUN0Q0MsS0FBWSx1QkFBTyxJQUFJLFdBQVcsR0FJbENDLEtBQW9DLG9CQUFJLFFB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QTZGO0FBQUEsTUFDQSxTQUFBNUI7QUFBQSxJQUNELENBQUMsR0FDTWpFO0FBQUEsRUFDUjtBQUNBLEVBQUl3VixLQUFnQkUsRUFBY3hJLEdBQVMsVUFBVTtBQUNyRCxRQUFNa0IsSUFBTXhFLEVBQVMsQ0FBQytELElBQU0sQ0FBQyxLQUFLQSxHQUFLZ0gsS0FBVSxPQUFPLEdBQUcsTUFBTTtBQUNoRSxJQUFBZSxFQUFjSCxFQUFJLEdBQUcsUUFBUTtBQUFBLEVBQzlCLENBQUM7QUFDRCxTQUFBdFcsRUFBZXdXLEdBQUksT0FBTyxTQUFTckgsQ0FBRyxHQUMvQnFIO0FBQ1IsR0FDSUUsS0FBbUIsQ0FBQ25ILEdBQUszUCxHQUFJK1AsSUFBUSxRQUFRO0FBQ2hELE1BQUlHO0FBQ0osU0FBT25GLEVBQVM0RSxHQUFLLFNBQVMsQ0FBQzNILE1BQU07QUFDcEMsSUFBSSxDQUFDQSxLQUFLa0ksS0FDVCxhQUFhQSxDQUFFLEdBQ2ZBLElBQUssUUFDS2xJLEtBQUssQ0FBQ2tJLE1BQUlBLElBQUtKLEdBQWlCSCxHQUFLM1AsR0FBSStQLENBQUssS0FBS0c7QUFBQSxFQUMvRCxDQUFDO0FBQ0Y7IiwKICAibmFtZXMiOiBbIiRhdm9pZFRyaWdnZXIiLCAiJGdldFZhbHVlIiwgIiR0cmlnZ2VyTG9jayQxIiwgIlByb21pc2VkIiwgImJpbmRDdHgiLCAiY2FsbEJ5QWxsUHJvcCIsICJjYWxsQnlQcm9wIiwgImRlZmF1bHRCeVR5cGUiLCAiaGFzVmFsdWUiLCAiaXNBcnJheUludmFsaWRLZXkiLCAiaXNLZXlUeXBlIiwgImlzTm90RXF1YWwiLCAiaXNQcmltaXRpdmUiLCAiaXNQcm9taXNlIiwgIm1ha2VUcmlnZ2VyTGVzcyIsICJvYmplY3RBc3NpZ24iLCAib2JqZWN0QXNzaWduTm90RXF1YWwiLCAicG90ZW50aWFsbHlBc3luYyIsICJwb3RlbnRpYWxseUFzeW5jTWFwIiwgInJlc29sdmVkJDEiLCAidHJ5UGFyc2VCeUhpbnQiLCAiJHZhbHVlIiwgIiRleHRyYWN0S2V5JCIsICIkb3JpZ2luYWxLZXkkIiwgIiRyZWdpc3RyeUtleSQiLCAiJGJlaGF2aW9yIiwgIiRwcm9taXNlIiwgIiRyZXNvbHZlZCIsICIkdHJpZ2dlckxlc3MiLCAiJHRyaWdnZXJMb2NrIiwgIiR0cmlnZ2VyQ29udHJvbCIsICIkdHJpZ2dlciIsICIkYWZmZWN0ZWQiLCAiJGlzTm90RXF1YWwiLCAiJHJlYWxQcm9wIiwgIiRvcmlnaW5hbE9iamVjdHMkIiwgInNhZmUiLCAidGFyZ2V0IiwgInVud3JhcCIsICJtYXBwZWQiLCAiZSIsICJLIiwgIlYiLCAiYXJyIiwgImRlcmVmIiwgImRpc2NvdW50VmFsdWUiLCAib3JpZ2luYWwiLCAiJHZhbCIsICJpc1RoZW5hYmxlIiwgInZhbCIsICJ3aXRoUHJvbWlzZSIsICJjYiIsICJkaXNwb3NlTWFwIiwgImRpc3Bvc2VSZWdpc3RyeSIsICJjYWxsc3RhY2siLCAiYWRkVG9DYWxsQ2hhaW4iLCAib2JqIiwgIm1ldGhvZEtleSIsICJjYWxsYmFjayIsICJjaGFpblRhcmdldCIsICJDYWxsQ2hhaW4iLCAiYXJncyIsICJpc0FycmF5SW5kZXgiLCAicHJvcCIsICJudW0iLCAid3JhcFNldEFzQXJyYXkiLCAic291cmNlIiwgIm9wdGlvbnMiLCAiYmFja2luZ1NldCIsICJub3RpZnlEdXBsaWNhdGUiLCAidmFsdWUiLCAidmlhIiwgImluZGV4IiwgIml0ZW0iLCAic25hcHNob3QiLCAicmVidWlsZEZyb20iLCAibWV0aG9kcyIsICJpdGVtcyIsICJzaXplIiwgIml0ZXJhdG9yIiwgImN1cnJlbnQiLCAidG9QcmVwZW5kIiwgIm5leHQiLCAic3RhcnQiLCAiZGVsZXRlQ291bnQiLCAibm9ybWFsaXplZFN0YXJ0IiwgImFjdHVhbERlbGV0ZUNvdW50IiwgInJlbW92ZWQiLCAiaW5zZXJ0UG9zaXRpb24iLCAiXyIsICJuZXh0TGVuZ3RoIiwgIm5leHRWYWx1ZSIsICJjdXJyZW50VmFsdWUiLCAiaWR4IiwgImtleXMiLCAiaSIsICJBc3NpZ25PYmplY3RIYW5kbGVyIiwgIm5hbWUiLCAibmV3VCIsICJjdHgiLCAibWFrZU9iamVjdEFzc2lnbmFibGUiLCAicHgiLCAid2l0aFVuc3ViU3ltYm9sIiwgIndpdGhVbnN1YiIsICJjb21wbGV0ZVdpdGhVbnN1YiIsICJzdWJzY3JpYmVyIiwgIndlYWsiLCAiaGFuZGxlciIsICJyZWdpc3RyeSIsICJzYXZDb21wbGV0ZSIsICJ1bmFmZmVjdGVkIiwgInIiLCAic3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wiLCAic3Vic2NyaXB0UmVnaXN0cnkiLCAiZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sIiwgImdsb2JhbEVmZmVjdExpc3RlbmVycyIsICJlZmZlY3RHbG9iYWxseSIsICJub3JtYWxpemVkIiwgIm5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMiLCAid3JhcHBlZFN5bWJvbCIsICJ3cmFwcGVkIiwgInJlZ2lzdGVyIiwgIndoYXQiLCAiaGFuZGxlIiwgIlN1YnNjcmlwdCIsICJ3cmFwV2l0aCIsICJmb3JBbGwiLCAid2lsZGNhcmRUcmlnZ2VycyIsICJ0cmlnZ2VyQWxpYXNlcyIsICJ0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wiLCAiY2Fub25pY2FsIiwgImFsaWFzZXMiLCAiYWxpYXMiLCAidHJpZ2dlckNhbm9uaWNhbE5hbWVzIiwgIm5vcm1hbGl6ZVRyaWdnZXJOYW1lIiwgInRyaWdnZXIiLCAidHJpZ2dlck5hbWVzT2YiLCAiZXhwYW5kVHJpZ2dlckZpbHRlciIsICJ0eXBlcyIsICJub3JtYWxpemVUcmlnZ2VyRmlsdGVyIiwgInRyaWdnZXJzIiwgImxpc3QiLCAidHJpZ2dlckZpbHRlckFsbG93cyIsICJmaWx0ZXIiLCAiaXNPcHRpb25zT2JqZWN0IiwgIm5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyIsICJhZmZlY3RUeXBlcyIsICJTdWJzY3JpcHRTeW1ib2wiLCAiI3NvdXJjZSIsICIjbGlzdGVuZXJzIiwgIiNmbGFncyIsICIjbmF0aXZlIiwgIiNpdGVyYXRvciIsICIjaW5EaXNwYXRjaCIsICIjZGlzYWJsZWRUcmlnZ2VycyIsICIjdHJpZ2dlckNvbnRyb2wiLCAiI3BlbmRpbmciLCAiI3BlbmRpbmdCeVByb3AiLCAiI2ZsdXNoU2NoZWR1bGVkIiwgImVuYWJsZWQiLCAiI2Rpc3BhdGNoIiwgImNvbnRyb2xsZXIiLCAicmVzIiwgIm9sZFZhbHVlIiwgImV0YyIsICJsaXN0ZW5lcnMiLCAicmVjb3JkIiwgImV2ZW50IiwgIm53IiwgIm5hbWVzIiwgInByZXZpb3VzIiwgInJlc3RvcmUiLCAid2FzRGlzYWJsZWQiLCAicmVzdWx0IiwgIm9wS2V5IiwgImJ5T3AiLCAiYmF0Y2giLCAib3BNYXAiLCAibm0iLCAidiIsICJvdiIsICJ0ZyIsICJyZXN0IiwgInJhd09mIiwgInVud3JhcHBlZCIsICJyZXNvbHZlZCIsICJtb2RlIiwgInJhdyIsICJtYWtlUmVzb2x2ZWRPcCIsICJlbWl0IiwgInJ1biIsICJwZW5kaW5nIiwgImtleSIsICJjYWxsYmFja09yVmFsdWUiLCAiZW1pdFJlc29sdmVkIiwgImJpbmRFeGlzdGluZ1RoZW5hYmxlcyIsICJsaXZlIiwgIl9fc2FmZUdldEd1YXJkU3ltYm9sIiwgIl9fc3lzdGVtU2tpcCIsICJzeXN0ZW1Ta2lwR2V0IiwgImdvdCIsICJzYWZlR2V0IiwgIl9fc2FmZUdldEd1YXJkIiwgImlzR2V0dGVyIiwgInByb3BOYW1lIiwgImZhbGxUaHJvdWdoIiwgInRtcCIsICJzYWZlU2V0IiwgImFjdGl2ZSIsICJyZWMiLCAiaGFzT3duIiwgImlzVHJpZ2dlckVtaXRPcHRpb25zIiwgImFsbG93VmFsdWVPbmx5IiwgInRyaWdnZXJPcHRpb25WYWx1ZSIsICJmYWxsYmFjayIsICJ0cmlnZ2VyT3B0aW9uVHJpZ2dlciIsICJpc1J1bnRpbWVLZXkiLCAicmVhbFByb3BPZiQxIiwgInRyaWdnZXJLZXlPZiIsICJ0cmlnZ2VyVmFsdWVPZiIsICJyZWFsUHJvcCIsICJjcmVhdGVUcmlnZ2VyQVBJIiwgImFwaSIsICJvcE9yT3B0aW9ucyIsICJjb250cm9sIiwgInN5c3RlbUdldCIsICJhZmZlY3RlZCIsICJvYnNlcnZhYmxlQVBJTWV0aG9kcyIsICJ1c3ViIiwgImNvbXAiLCAiT2JzZXJ2ZUFycmF5TWV0aG9kIiwgIiNuYW1lIiwgIiNzZWxmIiwgIiNoYW5kbGUiLCAic2VsZiIsICJza2lwIiwgImFkZGVkIiwgInNldFBhaXJzIiwgIm9sZFN0YXRlIiwgIm9ic2VydmVBcnJheSIsICJuZXdWYWx1ZSIsICJyZWciLCAiSSIsICJwYWlyIiwgInRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlIiwgIm9sZExlbiIsICJuZXdMZW4iLCAicmVtb3ZlZEl0ZW1zIiwgImFkZGVkQ291bnQiLCAiT2JzZXJ2ZUFycmF5SGFuZGxlciIsICJzeXMiLCAib2JzIiwgIm9sZCIsICJ4eXp3IiwgInJnYmEiLCAieHl6d19pZHgiLCAicmdiYV9pZHgiLCAiT2JzZXJ2ZU9iamVjdEhhbmRsZXIiLCAiaGludCIsICJmdCIsICIkb3JpZ2luYWwiLCAidHJpZ2dlck5hbWUiLCAic3Vic2NyaXB0IiwgImRlc2NyaXB0b3IiLCAiJHJlc3VsdCIsICJPYnNlcnZlTWFwSGFuZGxlciIsICJ2YWx1ZU9yRngiLCAib2xkVmFsdWVzIiwgImhhZCIsICJjb21wdXRlZCIsICJkZWZhdWx0T3JDb21wdXRlIiwgImluY29taW5nIiwgIk9ic2VydmVTZXRIYW5kbGVyIiwgIiRpc09ic2VydmFibGUiLCAib2JzZXJ2ZU9iamVjdCIsICJvYnNlcnZlTWFwIiwgIm1hcCIsICJvYnNlcnZlU2V0IiwgInNldCIsICJudW1iZXJSZWYiLCAiaW5pdGlhbCIsICJiZWhhdmlvciIsICIkciIsICJvYnNlcnZlIiwgInN0cmluZ1JlZiIsICJib29sZWFuUmVmIiwgIndyYXBSZWYiLCAibWFya1JlYWxQcm9wIiwgInByb3BSZWYiLCAic3JjIiwgInNyY1Byb3AiLCAiaXNNYXAiLCAiaXNTZXQiLCAicmVhZFNsb3QiLCAid3JpdGVTbG90IiwgImlzT2JzZXJ2YWJsZSIsICJyZWNvdmVyUmVhY3RpdmUiLCAic2xvdCIsICJ1c2IiLCAiX3Byb3AiLCAiJHJlZiIsICJ0eXBlZCIsICJyZWYiLCAicHJvbWlzZWQiLCAicHJvbWlzZSIsICJ0cmlnZ2VyV2l0aERlbGF5IiwgImRlbGF5IiwgImRlbGF5ZWRCZWhhdmlvciIsICJzaWciLCAidG0iLCAiZGVsYXllZE9ySW5zdGFudEJlaGF2aW9yIiwgInN0YXRlTmFtZSIsICJyZWFjdGl2ZSIsICJ1c2VPYnNlcnZhYmxlIiwgIm9ic2VydmFibGUiLCAic3BlY2lhbGl6ZWRTdWJzY3JpYmUiLCAiY2hlY2tWYWxpZE9iaiIsICJpbml0aWFsVHJpZ2dlciIsICJyZWFsUHJvcE9mIiwgIm5vcm1hbGl6ZUFmZmVjdGVkUHJvcCIsICJwcm9wVmFsdWVPZiIsICJjYWxsQnlQcm9wUmVmQXdhcmUiLCAid2l0aFRyaWdnZXIiLCAic3Vic2NyaWJlRGlyZWN0bHkiLCAidFByb3AiLCAiaW5pdGlhbENiIiwgInVuU3ViIiwgInN1YnNjcmliZUlucHV0IiwgIiRvcHQiLCAiJGNiIiwgImV2IiwgImNoZWNrSXNQYWlyZWQiLCAiaXNFZmZlY3RPcHRpb25zQXJnIiwgIm5vcm1hbGl6ZUVmZmVjdFRhcmdldHMiLCAidGFyZ2V0cyIsICJlZmZlY3RUYXJnZXRDb250ZXh0IiwgInRvRWZmZWN0RXZlbnQiLCAic3Vic2NyaWJlUGFpcmVkIiwgInN1YnNjcmliZVRoZW5hYmxlIiwgImVmZmVjdCIsICJhZmZlY3RlZE9wdGlvbnMiLCAiZGlzcG9zZXJzIiwgImRpc3Bvc2UiLCAiZWZmZWN0ZWQiLCAibWFrZUFycmF5T2JzZXJ2YWJsZSIsICJvYnNlcnZhYmxlQnlTZXQiLCAib2JzZXJ2YWJsZUJ5TWFwIiwgIkRvdWJsZVdlYWtNYXAiLCAiI3RvcCIsICIjZW5zdXJlSW5uZXIiLCAia2V5MSIsICJpbm5lciIsICIjc3BsaXRQYWlyIiwgImtleTIiLCAiZmFjdG9yeSIsICJjb21wdXRlIiwgInJlZ2lzdGVyZWRJdGVyYXRlZCIsICJpdGVyYXRlZCIsICIkc3ViIiwgImVudHJpZXMiLCAiYmFzaXMiLCAib2ZPbGQiLCAib2ZOZXciLCAiaXNQYWlyIiwgImJpbmRCeSIsICJ3YXRjaCIsICJwIiwgIk4iLCAiayIsICJkZXJpdmF0ZSIsICJmcm9tIiwgInJlYWN0Rm4iLCAiYmluZEJ5S2V5IiwgImNvbmRpdGlvbmFsSW5kZXgiLCAiY29uZExpc3QiLCAicmVhZENvbmRpdGlvbiIsICJjb25kaXRpb24iLCAiaW52YWxpZGF0ZSIsICJjb25kaXRpb25hbFJlZiIsICJjb25kIiwgImlmVHJ1ZSIsICJpZkZhbHNlIiwgImdldFRydWUiLCAiZ2V0RmFsc2UiLCAidmFsdWVPZiIsICJuIiwgImNvbmRpdGlvbmFsIiwgInJlbWFwIiwgInN1YiIsICJkZXN0IiwgInVuaWZpZWQiLCAic3VicyIsICJpbml0aWFsRW50cmllcyIsICJhc3NpZ25NYXAiLCAiYXNzaWduIiwgImEiLCAiYiIsICJpc0FDb21wdXRlIiwgImlzQkNvbXB1dGUiLCAiY21wQkZuYyIsICJpc0FQcm9wIiwgImFfcHJvcCIsICJpc0JQcm9wIiwgImJfcHJvcCIsICJhX3RtcCIsICJhUmVmIiwgImJfdG1wIiwgImJSZWYiLCAiY21wZngiLCAibnYiLCAic3RvcmUiLCAibGluayIsICJjIiwgImNtcCIsICJwZW5kaW5nSW5pdGlhbCIsICJyZiIsICJ3cml0ZUNvbXB1dGVkIiwgImRlbGF5ZWRTdWJzY3JpYmUiXQp9Cg==
