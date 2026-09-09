import { $avoidTrigger as se, $getValue as Be, $triggerLock as Ke, Promised as Ge, bindCtx as H, callByAllProp as Ze, callByProp as dt, defaultByType as ht, hasValue as M, isArrayInvalidKey as te, isKeyType as N, isNotEqual as w, isPrimitive as A, isPromise as P, makeTriggerLess as ve, objectAssign as ce, objectAssignNotEqual as vt, potentiallyAsync as Me, potentiallyAsyncMap as He, resolved as Oe, tryParseByHint as _ } from "@fest-lib/core";
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var d = /* @__PURE__ */ Symbol.for("@value"), m = /* @__PURE__ */ Symbol.for("@extract"), V = /* @__PURE__ */ Symbol.for("@origin"), re = /* @__PURE__ */ Symbol.for("@registry"), F = /* @__PURE__ */ Symbol.for("@behavior"), k = /* @__PURE__ */ Symbol.for("@promise"), Le = /* @__PURE__ */ Symbol.for("@resolved"), pe = /* @__PURE__ */ Symbol.for("@trigger-less"), h = /* @__PURE__ */ Symbol.for("@trigger-lock"), pt = /* @__PURE__ */ Symbol.for("@trigger-control"), E = /* @__PURE__ */ Symbol.for("@trigger"), ne = /* @__PURE__ */ Symbol.for("@subscribe"), bt = /* @__PURE__ */ Symbol.for("@isNotEqual"), ye = /* @__PURE__ */ Symbol.for("@realProp"), Fe = /* @__PURE__ */ new WeakMap(), fe = (e) => {
  const t = typeof e == "object" || typeof e == "function" ? e?.[m] ?? e : e, r = (n) => fe(n);
  return Array.isArray(t) ? t?.map?.(r) || Array.from(t || [])?.map?.(r) || [] : t instanceof Map || t instanceof WeakMap ? new Map(Array.from(t?.entries?.() || [])?.map?.(([n, l]) => [n, fe(l)])) : t instanceof Set || t instanceof WeakSet ? new Set(Array.from(t?.values?.() || [])?.map?.(r)) : t != null && typeof t == "function" || typeof t == "object" ? Object.fromEntries(Array.from(Object.entries(t || {}) || [])?.filter?.(([n]) => n != m && n != V && n != re)?.map?.(([n, l]) => [n, fe(l)])) : t;
}, St = (e) => e?.[m] ?? e?.["@target"] ?? e, W = (e, t = !1) => {
  const r = e;
  if (A(e) || typeof e == "symbol") return e;
  if (e != null && (e instanceof WeakRef || "deref" in e && typeof e?.deref == "function") && (e = e?.deref?.()), e != null && (typeof e == "object" || typeof e == "function")) {
    e = St(e);
    const n = t && M(e) && e?.value;
    if (n != null && (typeof n == "object" || typeof n == "function") && (e = n), r != e) return W(e, t);
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
        return (typeof n == "object" || typeof n == "function") && (gt.register(n, l), je.set(n, l), n[Symbol.dispose] ??= () => l.forEach((s) => {
          s?.();
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
      const y = [...o, ...f];
      return s(y), y.length;
    },
    splice: (i, f, ...o) => {
      const y = l(), a = Math.min(Math.max(i, 0), y.length), v = f === void 0 ? y.length - a : Math.max(0, Math.min(f, y.length - a)), p = y.splice(a, v);
      let g = a;
      for (const O of o) {
        if (y.includes(O)) {
          n(O, "splice", g);
          continue;
        }
        y.splice(g++, 0, O);
      }
      return s(y), p;
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
      if (Y(f)) return l()[Number(f)];
      const o = u[f];
      return o;
    },
    set: (i, f, o) => {
      if (f === "length") {
        if (typeof o != "number" || !Number.isFinite(o) || o < 0) throw new RangeError("length must be a finite non-negative number");
        const y = Math.floor(o);
        if (y >= r.size) return !0;
        const a = l().slice(0, y);
        return s(a), !0;
      }
      if (Y(f)) {
        const y = l(), a = Number(f);
        if (a > y.length) return !0;
        const v = o;
        if (a < y.length) {
          const p = y[a];
          if (Object.is(p, v)) return !0;
          if (y.some((g, O) => O !== a && Object.is(g, v)))
            return n(v, "set", a), !0;
          y[a] = v;
        } else {
          if (y.includes(v))
            return n(v, "set", a), !0;
          y.push(v);
        }
        return s(y), !0;
      }
      return Reflect.set(u, f, o);
    },
    deleteProperty: (i, f) => {
      if (f === "length") return !1;
      if (Y(f)) {
        const o = l(), y = Number(f);
        return y >= o.length || (o.splice(y, 1), s(o)), !0;
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
      if (Y(f)) {
        const o = l(), y = Number(f);
        return y >= o.length ? void 0 : {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          value: o[y]
        };
      }
      return Reflect.getOwnPropertyDescriptor(u, f);
    },
    has: (i, f) => {
      if (f === "length") return !0;
      if (Y(f)) {
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
    return ce(e, r, t), !0;
  }
  get(e, t, r) {
    return typeof t == "symbol" ? e?.[t] ?? e : Reflect.get(e, t, r);
  }
}, hr = (e) => {
  if (e?.[V] || Fe.has(e)) return e;
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
}, ue = (e, t) => (e = W(e?.[m] ?? e), typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || e == null ? e : Tt.getOrInsertComputed(e, () => new Proxy(e, xt(e, t)))), Z = /* @__PURE__ */ Symbol.for("@allProps"), lt = /* @__PURE__ */ new Set(["*", "all"]), ke = /* @__PURE__ */ new Map([
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
}, ut = (e) => {
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
  return [...lt].some((n) => r.has(n)) || ut(t).some((n) => r.has(n));
}, st = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), be = (e = ["*"]) => {
  if (st(e)) return {
    affectTypes: U(e.affectTypes ?? e.triggers ?? ["*"]),
    triggerImmediately: e.triggerImmediately !== !1
  };
  const t = U(e);
  return {
    affectTypes: t,
    triggerImmediately: q(t, "initial")
  };
}, ft = (e = ["*"]) => st(e) ? {
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
    l = le(l) ?? l;
    const u = this.#e;
    if (u?.size)
      for (const [i, f] of u.entries()) (f.prop === t || f.prop === Z || f.prop === null) && q(f.triggers, l) && this.$safeExec(i, r, t, n, l, ...s);
    if (ae.size) {
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
      for (const [f, o] of ae.entries()) q(o, l) && this.$safeExec(f, i);
    }
  }
  wrap(t) {
    return Array.isArray(t) ? ue(t, this) : t;
  }
  get triggerControl() {
    return this.#c;
  }
  isTriggerEnabled(t) {
    return !q(this.#n, "all") && !ut(t).some((r) => this.#n.has(r));
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
  trigger(t, r, n, l = "set", ...s) {
    if (typeof t == "symbol" || (l === void 0 && (l = "set"), l = le(l) ?? l, !this.isTriggerEnabled(l))) return;
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
      for (const [o, y] of f)
        if (!(o != null && this.#i.has(o))) {
          o != null && this.#i.add(o);
          try {
            for (const [, a] of y) {
              const [v, p, g, O, R] = a;
              try {
                this.#s(v, p, g, O, ...R ?? []);
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
  const t = W(e);
  return t?.[m] ?? t;
};
function Je(e, t = "all") {
  const r = $e(e);
  return P(r) ? Oe(r, t) : P(r?.[k]) ? Oe(r[k], t) : Oe(r ?? e, t);
}
function ct(e, t = !1) {
  const r = ((n = "all") => {
    const l = Je(e, n);
    return t ? l.then((s) => {
      const u = $e(e), i = u?.realProp ?? (u && "value" in u ? "value" : null);
      return b.get(u)?.trigger?.(i, s, void 0, "resolved"), s;
    }) : l;
  });
  return r.all = () => r("all"), r.allSettled = () => r("settled"), r.allKeyed = () => r("all"), r.allSettledKeyed = () => r("settled"), r.try = (n, ...l) => Promise.try(n, ...l).then((s) => Je(s ?? e, "all")), r;
}
function ie(e, t, r, n) {
  const l = $e(e) ?? e;
  b.get(l)?.trigger?.(t, r, n, "resolved");
}
function _e(e, t) {
  if (e == null || t == null) return e;
  if (Array.isArray(t))
    return t.forEach((r, n) => {
      P(r) && (e[n] = r);
    }), e;
  if (t instanceof Map) {
    for (const [r, n] of t.entries()) P(n) && e.set(r, n);
    return e;
  }
  if (t instanceof Set) return e;
  for (const r of Reflect.ownKeys(t)) {
    if (r == m || r == k || r == Le || !Object.getOwnPropertyDescriptor(t, r)?.enumerable) continue;
    const n = t[r];
    P(n) && (e[r] = n);
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
  const n = (s, u, i) => (Te(u) || (i ??= u), t(Te(s) ? s : Te(u, !0) ? {
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
}, ge = (e, t, r) => {
  if (e == null || A(e)) return e;
  if (([
    "deref",
    "bind",
    "@target",
    V,
    m,
    re
  ].indexOf(t) < 0 ? c(e, t)?.bind?.(e) : null) != null) return null;
  if ([m, V].indexOf(t) >= 0) return c(e, t) ?? e;
  if (t == d) return c(e, t) ?? c(e, "value");
  if (t == re) return r;
  if (t == Le || t == "resolved" && !Object.prototype.hasOwnProperty.call(e, "resolved")) return ct(e);
  if (t == pt) return r?.triggerControl;
  if (t == Symbol.observable) return r?.compatible;
  if (t == Symbol.subscribe) return (n, l, s) => S(l != null ? [e, l] : e, n, s);
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
      const l = S(e, n?.next), s = n?.complete;
      return n.complete = (...u) => (l?.(), s?.(...u)), n.complete;
    }
  });
}, Wt = class {
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
    let n = [], l = [], s = [], u = [...this.#e], i = -1;
    const f = Reflect.apply(e, t || this.#e, r);
    if (this.#t?.[h])
      return Array.isArray(f) ? Pe(f) : f;
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
        for (let y = 0; y < Math.max(u.length, this.#e.length); y++) {
          const a = u[y], v = this.#e[y];
          v === void 0 && y >= this.#e.length ? l.push(a) : a === void 0 && y >= u.length ? s.push([
            y,
            v,
            void 0,
            !1
          ]) : w(a, v) && s.push([
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
        for (let y = 0; y < u.length; y++) w(u[y], this.#e[y]) && s.push([
          i + y,
          this.#e[y],
          u[y],
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
    const o = b.get(this.#e);
    return n?.length == 1 ? o?.trigger?.(i, n[0], null, "add") : n?.length > 1 && (o?.trigger?.(i, n, null, "addAll"), n.forEach((y, a) => o?.trigger?.(i + a, y, null, "add"))), s?.length == 1 ? o?.trigger?.(s[0]?.[0] ?? i, s[0]?.[1], s[0]?.[2], s[0]?.[3] === !1 ? "add" : "set") : s?.length > 1 && (o?.trigger?.(i, s, u, "setAll"), s.forEach((y, a) => o?.trigger?.(y?.[0] ?? i + a, y?.[1], y?.[2], y?.[3] === !1 ? "add" : "set"))), l?.length == 1 ? o?.trigger?.(i, null, l[0], "delete") : l?.length > 1 && (o?.trigger?.(i, null, l, "deleteAll"), l.forEach((y, a) => o?.trigger?.(i + a, null, y, "delete"))), f == e ? new Proxy(f, this.#t) : Array.isArray(f) ? Pe(f) : f;
  }
}, Vt = (e, t, r, n) => {
  const l = Number.isInteger(r) && Number.isInteger(n) && n < r ? t.slice(n, r) : [];
  if (!e[h] && r !== n) {
    const s = b.get(t);
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
    const n = L(e, t);
    if (n != null) return n;
    if ([
      m,
      V,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? c(e, t)?.bind?.(e) : c(e, t);
    const l = b?.get?.(e), s = ge(e, t, l);
    if (s != null) return s;
    const u = we(e, t, l);
    if (u != null) return u;
    if (t == pe) return ve.call(this, this);
    if (t == E) return me(l, (f) => {
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
    return typeof i == "function" ? new Proxy(typeof i == "function" ? i?.bind?.(e) : i, new Wt(t, e, this)) : i;
  }
  set(e, t, r) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h && r)
      return this[h] = !!r, !0;
    if (t == h && !r)
      return delete this[h], !0;
    const n = P(r);
    return Me(r, (l) => {
      const s = c(e, t), u = [
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
      let y = !1;
      return f >= 0 ? y = Reflect.set(e, f, l) : o >= 0 ? y = Reflect.set(e, o, l) : y = Reflect.set(e, t, l), t == "length" && w(s, l) && Vt(this, e, s, l), !this[h] && typeof t != "symbol" && (w(s, l) && b?.get?.(e)?.trigger?.(t, l, s, "set"), n && ie(e, t, l, s)), y;
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
      V,
      "@target",
      "deref",
      "then",
      "catch",
      "finally"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? H(e, c(e, t)) : c(e, t);
    const n = b.get(e) ?? b.get(c(e, "value") ?? e), l = ge(e, t, n);
    if (l != null) return l;
    c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const s = we(e, t, n);
    return s ?? (t == pe ? ve.call(this, this) : t == E ? me(n, (u) => {
      const i = Qe(e, u.key ?? u.name ?? de(e) ?? "value"), f = D(u, "oldValue", () => i == "value" || i == de(e) ? c(e, d) : void 0), o = D(u, "value", () => _t(e, i));
      return n?.trigger?.(i, o, f, Se(u, "manual"));
    }, e) : t == Symbol.toPrimitive ? (u) => {
      const i = G(e, t);
      return c(i, t) ? c(i, t)?.(u) : A(i) ? _(i, u) : A(c(i, "value")) ? _(c(i, "value"), u) : _(c(i, "value") ?? i, u);
    } : t == Symbol.toStringTag ? () => {
      const u = G(e, t);
      return c(u, t) ? c(u, t)?.() : A(u) ? String(u ?? "") || "" : A(c(u, "value")) ? String(c(u, "value") ?? "") || "" : String(c(u, "value") ?? u ?? "") || "";
    } : t == "toString" ? () => {
      const u = G(e, t);
      return c(u, t) ? c(u, t)?.() : c(u, Symbol.toStringTag) ? c(u, Symbol.toStringTag)?.() : A(u) ? String(u ?? "") || "" : A(c(u, "value")) ? String(c(u, "value") ?? "") || "" : String(c(u, "value") ?? u ?? "") || "";
    } : t == "valueOf" ? () => {
      const u = G(e, t);
      return c(u, t) ? c(u, t)?.() : c(u, Symbol.toPrimitive) ? c(u, Symbol.toPrimitive)?.() : A(u) ? u : A(c(u, "value")) ? c(u, "value") : c(u, "value") ?? u;
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
      const s = L(l, t);
      if (s != null) return s;
      if (t == h && r)
        return this[h] = !!r, !0;
      if (t == h && !r)
        return delete this[h], !0;
      const u = e;
      if (c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), typeof t == "symbol" && !(c(e, t) != null && t in e)) return;
      const i = Qe(e, t), f = t == "value" ? c(e, d) ?? c(e, t) : c(e, t);
      e[t] = l;
      const o = c(e, t) ?? l;
      if (!this[h] && typeof t != "symbol") {
        const y = b.get(e) ?? b.get(u);
        (c(e, bt) ?? w)?.(f, o) && y?.trigger?.(i, l, f), P(r) && ie(u, i, l, f);
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
    const l = c(e, t), s = Reflect.defineProperty(e, t, {
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
      V,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? H(e, c(e, t)) : c(e, t);
    const n = b.get(e), l = ge(e, t, n);
    if (l != null) return l;
    const s = we(e, t, n);
    if (s != null) return s;
    e = c(e, m) ?? c(e, V) ?? e;
    const u = H(e, c(e, t));
    if (typeof t == "symbol" && (t in e || c(e, t) != null)) return u;
    if (t == pe) return ve.call(this, this);
    if (t == E) return me(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = D(i, "value", () => e.get(f));
      if (o == null && !$(i, "value")) return;
      const y = D(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, Se(i, "manual"));
    }, e);
    if (t == "clear") return () => {
      const i = Array.from(e?.entries?.() || []), f = u();
      return i.forEach(([o, y]) => {
        this[h] || b.get(e)?.trigger?.(o, null, y, "delete");
      }), f;
    };
    if (t == "delete") return (i, f = null) => {
      const o = e.has(i), y = e.get(i), a = u(i);
      return !this[h] && o && b.get(e)?.trigger?.(i, null, y, "delete"), a;
    };
    if (t == "set") return (i, f) => He(f, (o) => {
      const y = e.has(i), a = e.get(i), v = u(i, o);
      return this[h] || ((!y || w(a, o)) && b.get(e)?.trigger?.(i, o, y ? a : null, y ? "set" : "add"), P(f) && ie(e, i, o, a)), v;
    });
    if (t == "getOrInsert" || t == "getOrInsertComputed") {
      const i = t == "getOrInsertComputed";
      return (f, o) => {
        if (e.has(f)) return e.get(f);
        const y = i && typeof o == "function" ? o(f) : o;
        return He(y, (a) => {
          const v = typeof e.getOrInsert == "function" ? e.getOrInsert(f, a) : (e.set(f, a), e.get(f));
          return this[h] || (b.get(e)?.trigger?.(f, a, null, "add"), P(y) && ie(e, f, a, null)), v;
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
      V,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? H(e, c(e, t)) : c(e, t);
    const n = b.get(e), l = ge(e, t, n);
    if (l != null) return l;
    const s = we(e, t, n);
    if (s != null) return s;
    e = c(e, m) ?? c(e, V) ?? e;
    const u = H(e, c(e, t));
    return typeof t == "symbol" && (t in e || c(e, t) != null) ? u : t == pe ? ve.call(this, this) : t == E ? me(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = D(i, "value", () => e.has(f)), y = D(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, Se(i, "manual"));
    }, e) : t == "clear" ? () => {
      const i = Array.from(e?.values?.() || []), f = u();
      return i.forEach((o) => {
        this[h] || b.get(e)?.trigger?.(null, null, o, "delete");
      }), f;
    } : t == "delete" ? (i) => {
      const f = e.has(i), o = f ? i : null, y = u(i);
      return !this[h] && f && b.get(e)?.trigger?.(i, null, o, "delete"), y;
    } : t == "add" ? (i) => Me(i, (f) => {
      const o = e.has(f), y = o ? f : null, a = u(f);
      return this[h] || (o || b.get(e)?.trigger?.(f, f, y, "add"), P(i) && ie(e, f, f, y)), a;
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
}, J = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[m] || e?.[ne])), Pe = (e) => J(e) ? e : _e(ue(e, new zt()), e), Bt = (e) => J(e) ? e : _e(ue(e, new Ct()), e), Kt = (e) => J(e) ? e : _e(ue(e, new Nt()), e), Gt = (e) => J(e) ? e : ue(e, new Dt()), Ht = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = x({
    [k]: r ? e : null,
    [d]: r ? 0 : Number(W(e) || 0) || 0,
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
    n.value = l, n[E]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Ft = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = x({
    [k]: r ? e : null,
    [d]: (r ? "" : String(W(typeof e == "number" ? String(e) : e || ""))) ?? "",
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
    n.value = l, n[E]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, jt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = x({
    [k]: r ? e : null,
    [d]: (r ? !1 : (W(e) != null ? typeof W(e) == "string" ? !0 : !!W(e) : !1) || !1) || !1,
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
    n.value = l, n[E]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), n;
}, Xe = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = x({
    [k]: r ? e : null,
    [F]: t,
    [Symbol?.toStringTag]() {
      return String(this.value ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return _(this.value, l);
    },
    value: r ? null : W(e)
  });
  return e?.then?.((l) => {
    n.value = l, n[E]?.({
      key: "value",
      value: l,
      trigger: "resolved"
    });
  }), S(e, (l) => {
    n?.[E]?.();
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
  const l = e instanceof Map || e instanceof WeakMap || typeof e?.get == "function" && typeof e?.set == "function" && (typeof e?.delete == "function" || typeof e?.remove == "function"), s = e instanceof Set || e instanceof WeakSet || typeof e?.has == "function" && typeof e?.add == "function" && (typeof e?.delete == "function" || typeof e?.remove == "function");
  if (l || s) {
    if (t == null) return;
  } else if ((t ??= Array.isArray(e) ? null : "value") == null || te(t, e)) return;
  const u = () => l ? e?.get?.(t) : s ? e?.has?.(t) ? t : null : e?.[t], i = (a) => {
    if (l)
      return e?.has?.(t) && w(a, e?.get?.(t)) && e?.set?.(t, a), a;
    if (s) {
      if (a ??= t, !e?.has?.(a) && a != null)
        return e?.add?.(a), a;
      if (e?.has?.(a))
        return a == null && e?.delete?.(a), a;
    } else e?.[t] && w(a, e?.[t]) && (e[t] = a);
    return a;
  };
  l && r !== void 0 && !e?.has?.(t) ? e?.set?.(t, r) : s && r && !e?.has?.(t) && e?.add?.(t);
  const f = u();
  if (!s && t != null && M(f) && z(f)) return xe(Qt(f), t);
  if (!l && !s && t && typeof e?.getProperty == "function" && z(e?.getProperty?.(t))) return xe(e?.getProperty?.(t), t);
  !l && !s ? e[t] ??= r ?? e?.[t] : l && w(r ?? e?.get?.(t), e?.get?.(t)) ? e?.set?.(t, r ?? e?.get?.(t)) : s && e?.has?.(r ?? t) && e?.add?.(r ?? t);
  const o = x({
    [d]: s ? !!u() : u() ?? r,
    [F]: n,
    [Symbol?.toStringTag]() {
      return String(u() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return _(u(), a);
    },
    set value(a) {
      if (o[Ke] = !0, s) this[d] = i(a);
      else {
        const v = a ?? ht(u());
        this[d] = i(v);
      }
      o[Ke] = !1;
    },
    get value() {
      const a = u();
      return this[d] = a ?? this[d];
    }
  });
  xe(o, t);
  const y = S(e, (a, v, p, g) => {
    w(v, t) && (w(a, u() ?? p) || i(a));
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
      if (e != null) return Xe(x(e), t);
    default:
      return Xe(e, t);
  }
}, Jt = (e, t = "value", r) => {
  const n = z(e) ? e : Ut(e, r);
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
function x(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || J(e) || (e = W?.(e)) == null || e instanceof Promise || e instanceof WeakRef || J(e)) return e;
  const r = e;
  if (r == null || typeof r == "symbol" || !(typeof r == "object" || typeof r == "function") || r instanceof Promise || r instanceof WeakRef) return r;
  let n = r;
  return Array.isArray(r) ? (n = Pe(r), n) : r instanceof Map ? (n = Kt(r), n) : r instanceof Set ? (n = Gt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = Bt(r)), n);
}
var z = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[m] || e?.[ne] || b?.has?.(e))), Qt = (e) => z(e) ? x(e) : null, mr = (e) => {
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
}, j = /* @__PURE__ */ new WeakMap(), Ve = (e) => {
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
  return (l, s, u, ...i) => e?.(l, s, u, r, ...i);
}, Yt = (e, t, r, n = ["*"]) => {
  if (!e || !Ve(e)) return;
  const l = t != Symbol.iterator ? Ce(e, t) : null;
  let s = e?.[re] ?? b.get(e);
  e = e?.[m] ?? e, queueMicrotask(() => {
    const i = yt(r, n, he);
    i && (l != null && l != Symbol.iterator ? Ee(e, l, i, null) : Ze(e, i, null));
  });
  let u = s?.affected?.(r, l, n);
  return e?.[Symbol.dispose] || (I(u, Symbol.dispose, u), I(u, Symbol.asyncDispose, u), I(e, Symbol.dispose, u), I(e, Symbol.asyncDispose, u)), u;
}, Zt = (e, t, r, n = ["*"]) => {
  const l = be(n).affectTypes, s = {};
  let u = e?.value;
  const i = (f) => {
    const o = f?.target?.value;
    q(l, "set") && r?.(o, "value", u, "set", f), u = o;
  };
  return e?.addEventListener?.("change", i, s), () => e?.removeEventListener?.("change", i, s);
}, ee = (e) => Array.isArray(e) && e?.length == 2 && Ve(e?.[0]) && (N(e?.[1]) || e?.[1] == Symbol.iterator), Lt = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), er = (e) => e == null ? [] : Array.isArray(e) && !ee(e) && !z(e) ? e : [e], tr = (e) => {
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
  const l = N(e?.[1]) ? e?.[1] : null;
  return S(e?.[0], l, r, n);
}, lr = (e, t, r, n = ["*"]) => e?.then?.((l) => S?.(l, t, r, n))?.catch?.((l) => (console.warn(l), null)), S = (e, t, r = () => {
}, n) => {
  if (typeof t == "function" ? (n = r, r = t, t = null) : t = Ce(e, t), (typeof r == "object" || Array.isArray(r)) && (n = r, r = () => {
  }), (A(e) || typeof e == "symbol") && be(n).triggerImmediately)
    return Ge(globalThis?.Promise?.try?.(() => r?.(e, null, null, null, he)));
  if (typeof e?.[ne] == "function") return e?.[ne]?.(r, t, n);
  if (Ve(e)) {
    const l = e;
    if (j?.has?.(e = e?.[m] ?? e)) return j?.get?.(e)?.(l, t, r, n);
    if (z(l) || ee(e) && z(e?.[0]))
      return oe(e) ? j?.getOrInsert?.(e, lr)?.(e, t, r, n) : ee(e) ? j?.getOrInsert?.(e, nr)?.(e, t, r, n) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? j?.getOrInsert?.(e, Zt)?.(e, t, r, n) : j?.getOrInsert?.(e, Yt)?.(l, t, r, n);
    {
      const s = yt(r, n, he);
      return s ? Ge(globalThis?.Promise?.try?.(() => ee(e) ? Ee?.(e?.[0], e?.[1], s, null) : t != null && t != Symbol.iterator ? Ee?.(e, t, s, null) : Ze?.(e, s, null))) : void 0;
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
    return S(i.target, i.prop, (f, o, y, a, ...v) => e(rr(i.source, i.target, f, o, y, a ?? null, v)), l);
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
}, Re = new ur();
function sr(e, t, r = ["*"]) {
  if (!e || typeof e != "object" && typeof e != "function") return;
  if (Re.has([e, t])) return Re.get([e, t]);
  const n = (l, s, u, i) => {
    if (s == "value") {
      const f = (u?.value ?? u)?.entries?.(), o = e?.value ?? l?.value ?? l;
      if (f) for (const [y, a] of f) {
        const v = a ?? (u?.value ?? u)?.[y] ?? null, p = o?.[y];
        v == null && p != null ? t(p, y, null, "add") : v != null && p == null ? t(null, y, v, "delete") : w(v, p) && t(p, y, v, "set");
      }
      return sr(l ?? e?.value, t, r);
    }
    return s == null ? void 0 : e[s];
  };
  return Re.getOrInsertComputed([e, t], () => e instanceof Set ? S([at(e), Symbol.iterator], t, r) : e instanceof Map ? S(e, t, r) : M(e) ? S(e, n, r) : Array.isArray(e) && !(e?.length == 2 && N(e?.[1]) && z(e?.[0])) ? S([e, Symbol.iterator], t, r) : S(e, t, r));
}
function Ie(e, t) {
  return mt(e, (r) => {
    const n = Array.isArray(r) && r?.length == 2 && ["object", "function"].indexOf(typeof r?.[0]) >= 0 && N(r?.[1]), l = n ? r?.[1] : null;
    r = n && l != null ? r?.[0] ?? r : r;
    const s = typeof r == "object" || typeof r == "function" ? r?.[m] ?? r : r;
    (r?.[re] ?? b.get(s))?.unaffected?.(t, l);
  });
}
var fr = (e, t, r) => (S(t, null, (n, l) => {
  ce(e, n, l, !0);
}), r?.(() => e, (n) => {
  for (const l in n) ce(t, n[l], l, !0);
}, { deep: !0 }), e), Ar = (e, t, r) => fr(t(fe(e)), e, r), Or = (e, t, r = () => "") => S(t, null, (n, l) => {
  l == r() && ce(e, n, null, !0);
}), Tr = (e = []) => {
  const t = x({ value: 0 }), r = (i) => typeof i == "function" ? i() : M(i) ? i.value : i, l = yr([t, "value"], () => e.findIndex((i) => !!r(i)), "value"), s = () => {
    t.value++;
  }, u = [];
  z(e) && u.push(S(e, s, {
    affectTypes: [
      "add",
      "set",
      "delete"
    ],
    triggerImmediately: !1
  }));
  for (const i of e) M(i) && u.push(S([i, "value"], s, {
    affectTypes: ["setter"],
    triggerImmediately: !1
  }));
  return I(l, Symbol.dispose, () => u.forEach((i) => i?.())), l;
}, or = (e, t, r, n) => {
  if (A(e)) return e ? t : r;
  const l = () => t, s = () => r, u = (o) => (o != null && (e.value = M(o) ? o?.value : o), (M(e) ? e?.value : e) ? l() : s()), i = x({
    [d]: u(),
    [F]: n,
    [Symbol?.toStringTag]() {
      return String(u() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](o) {
      return _(u() ?? this[d], o);
    },
    set value(o) {
      this[d] = u(o);
    },
    get value() {
      return this[d] = u() ?? this[d];
    }
  }), f = S([e, "value"], () => {
    const o = i?.[d], y = u();
    i[d] = y, i?.[E]?.({
      key: "value",
      value: y,
      oldValue: o,
      trigger: "manual"
    });
  });
  return I(i, Symbol.dispose, f), i;
}, xr = or, Rr = (e, t, r) => {
  r || (r = x({}));
  const n = S(e, (l, s, u) => {
    if (s == null) return;
    const i = t?.(l, s, u);
    typeof i == "object" ? vt(r, i) : w(r[s], i) && (r[s] = i);
  });
  return r && I(r, Symbol.dispose, n), r;
}, Ir = (...e) => {
  const t = x({});
  return e?.forEach?.((r) => S(r, (n, l, s) => {
    l != null && w(t[l], n) && (t[l] = n);
  })), t;
}, at = (e) => {
  const t = x([]);
  return t.push(...Array.from(e?.values?.() || [])), I(t, Symbol.dispose, S(e, (r, n, l) => {
    if (w(r, l))
      if (l == null && r != null) t.push(r);
      else if (l != null && r == null) {
        const s = t.indexOf(l);
        s >= 0 && t.splice(s, 1);
      } else {
        const s = t.indexOf(l);
        s >= 0 && w(t[s], r) && (t[s] = r);
      }
  })), t;
}, cr = (e) => {
  const t = x([]), r = Array.from(e.entries());
  return t.push(...r), I(t, Symbol.dispose, S(e, (n, l, s) => {
    if (w(n, s) || s == null && n != null || s != null && n == null)
      if (s != null && n == null) {
        let u = t.findIndex(([i, f]) => i == l);
        u < 0 && (u = t.findLastIndex(([i, f]) => s === f)), u >= 0 && t.splice(u, 1);
      } else {
        let u = t.findIndex(([i, f]) => i == l);
        u >= 0 && u < t.length ? w(t[u]?.[1], n) && (t[u] = [l, n]) : t.push([l, n]);
      }
  })), t;
}, K = /* @__PURE__ */ new WeakMap(), Ye = (e, t, r = "value") => {
  const n = typeof e?.[1] == "function" && e?.length == 2, l = typeof t?.[1] == "function" && t?.length == 2, s = l ? t?.[1] : null, u = (N(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let i = u && !n ? e?.[1] : Array.isArray(e) ? null : r;
  !u && !n && (e = [e, i]), n && (e[1] = i);
  const f = (N(t?.[1]) || t?.[1] == Symbol.iterator) && t?.length == 2;
  let o = f && !l ? t?.[1] : Array.isArray(t) ? null : r;
  if (!f && !l && (t = [t, o]), l && (t[1] = o), i == null || o == null || te(i, e?.[0]) || te(o, t?.[0])) return;
  if (!((typeof t?.[0] == "object" || typeof t?.[0] == "function") && t?.[0] != null) && !Array.isArray(e[0]))
    return se(t, () => {
      e[0][i] = t?.[0];
    }), () => {
    };
  const y = (C, Q) => {
    const B = p?.deref?.(), X = v?.deref?.();
    if (K?.get?.(B)?.get?.(i)?.bound == X) {
      let Ae = null;
      const Ne = K?.get?.(B)?.get?.(i)?.cmpfx;
      se(X, () => {
        typeof Ne == "function" ? Ae = Ne?.(Be(X) ?? C, Q, null) : Ae = X?.[Q] ?? C;
      });
      const De = Be(Ae);
      w(B[i], De) && se(X, () => {
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
    cmpfx: s
  };
  const O = p?.deref?.(), R = v?.deref?.();
  return p instanceof WeakRef && (K?.get?.(O)?.get?.(i)?.bound != R && K?.get?.(O)?.delete?.(i), g = K?.getOrInsert?.(O, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(i, () => ({
    bound: R,
    cmpfx: s,
    unsub: null,
    compute: y,
    dispose: a
  })), g.unsub = S(t, y), g.cmpfx = s, I(O, Symbol.dispose, g?.dispose), I(R, Symbol.dispose, g?.dispose)), R && !Array.isArray(R) && se(O, () => {
    R[o] ??= O?.[i] ?? R[o];
  }), g?.dispose;
}, Pr = (e, t, r = "value") => {
  const n = [Ye(e, t, r), Ye(t, e, r)];
  return () => n?.map?.((l) => l?.());
}, yr = (e, t, r, n = "value") => {
  const l = typeof e?.[1] == "function" && e?.length == 2, s = (N(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let u = s && !l ? e?.[1] : Array.isArray(e) ? null : n;
  if (!s && !l && (e = [s ? e?.[0] : e, u]), l && (e[1] = u), u == null || te(u, e?.[0])) return;
  const i = (p) => {
    let g;
    return p != null && (g = e[0][u], e[0][u] = p), t?.(e?.[0]?.[u], u, g);
  }, f = i(), o = P(f), y = x({
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
    if (P(p)) return Promise.resolve(p).then((R) => {
      const C = y?.[d];
      return y[d] = R, y?.[E]?.({
        key: "value",
        value: R,
        oldValue: C,
        trigger: "resolved"
      }), R;
    });
    const O = y?.[d];
    return y[d] = p, y?.[E]?.({
      key: "value",
      value: p,
      oldValue: O,
      trigger: g
    }), p;
  };
  o && a(f, "resolved");
  const v = S([e?.[0] ?? e, u ?? "value"], () => {
    a(i(), "manual");
  });
  return I(y, Symbol.dispose, v), y;
}, Er = (e, t, r = 100) => {
  let n;
  return S(e, "value", (l) => {
    !l && n ? (clearTimeout(n), n = null) : l && !n && (n = We(e, t, r) ?? n);
  });
};
export {
  ne as $affected,
  Ut as $ref,
  Le as $resolved,
  E as $trigger,
  pt as $triggerControl,
  pe as $triggerLess,
  h as $triggerLock,
  wt as AssignObjectHandler,
  ur as DoubleWeakMap,
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
  W as deref,
  Ar as derivate,
  ir as effect,
  gr as effected,
  z as isObservable,
  sr as iterated,
  Pr as link,
  wr as makeArrayObservable,
  hr as makeObjectAssignable,
  ct as makeResolvedOp,
  Ht as numberRef,
  cr as observableByMap,
  at as observableBySet,
  x as observe,
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
  We as triggerWithDelay,
  Ie as unaffected,
  Ir as unified,
  St as unwrap,
  mr as useObservable,
  Xe as wrapRef,
  dr as wrapSetAsArray
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vI3JlZ2lvbiBzcmMvd3JhcC9TeW1ib2wudHNcblN5bWJvbC5vYnNlcnZhYmxlIHx8PSBTeW1ib2wuZm9yKFwib2JzZXJ2YWJsZVwiKTtcblN5bWJvbC5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJzdWJzY3JpYmVcIik7XG5TeW1ib2wudW5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJ1bnN1YnNjcmliZVwiKTtcbnZhciAkdmFsdWUgPSBTeW1ib2wuZm9yKFwiQHZhbHVlXCIpO1xudmFyICRleHRyYWN0S2V5JCA9IFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKTtcbnZhciAkb3JpZ2luYWxLZXkkID0gU3ltYm9sLmZvcihcIkBvcmlnaW5cIik7XG52YXIgJHJlZ2lzdHJ5S2V5JCA9IFN5bWJvbC5mb3IoXCJAcmVnaXN0cnlcIik7XG52YXIgJGJlaGF2aW9yID0gU3ltYm9sLmZvcihcIkBiZWhhdmlvclwiKTtcbnZhciAkcHJvbWlzZSA9IFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKTtcbnZhciAkcmVzb2x2ZWQgPSBTeW1ib2wuZm9yKFwiQHJlc29sdmVkXCIpO1xudmFyICR0cmlnZ2VyTGVzcyA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sZXNzXCIpO1xudmFyICR0cmlnZ2VyTG9jayA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sb2NrXCIpO1xudmFyICR0cmlnZ2VyQ29udHJvbCA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpO1xudmFyICR0cmlnZ2VyID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyXCIpO1xudmFyICRhZmZlY3RlZCA9IFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpO1xudmFyICRpc05vdEVxdWFsID0gU3ltYm9sLmZvcihcIkBpc05vdEVxdWFsXCIpO1xudmFyICRyZWFsUHJvcCA9IFN5bWJvbC5mb3IoXCJAcmVhbFByb3BcIik7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy93cmFwL1V0aWxzLnRzXG52YXIgJG9yaWdpbmFsT2JqZWN0cyQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzYWZlID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldCwgbWFwcGVkID0gKGUpID0+IHNhZmUoZSk7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHJldHVybiB1bndyYXA/Lm1hcD8uKG1hcHBlZCkgfHwgQXJyYXkuZnJvbSh1bndyYXAgfHwgW10pPy5tYXA/LihtYXBwZWQpIHx8IFtdO1xuXHRlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXAgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha01hcCkgcmV0dXJuIG5ldyBNYXAoQXJyYXkuZnJvbSh1bndyYXA/LmVudHJpZXM/LigpIHx8IFtdKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrU2V0KSByZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKHVud3JhcD8udmFsdWVzPy4oKSB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkpO1xuXHRlbHNlIGlmICh1bndyYXAgIT0gbnVsbCAmJiB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyh1bndyYXAgfHwge30pIHx8IFtdKT8uZmlsdGVyPy4oKFtLXSkgPT4gSyAhPSAkZXh0cmFjdEtleSQgJiYgSyAhPSAkb3JpZ2luYWxLZXkkICYmIEsgIT0gJHJlZ2lzdHJ5S2V5JCk/Lm1hcD8uKChbSywgVl0pID0+IFtLLCBzYWZlKFYpXSkpO1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciB1bndyYXAgPSAoYXJyKSA9PiB7XG5cdHJldHVybiBhcnI/LlskZXh0cmFjdEtleSRdID8/IGFycj8uW1wiQHRhcmdldFwiXSA/PyBhcnI7XG59O1xudmFyIGRlcmVmID0gKHRhcmdldCwgZGlzY291bnRWYWx1ZSA9IGZhbHNlKSA9PiB7XG5cdGNvbnN0IG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRpZiAoaXNQcmltaXRpdmUodGFyZ2V0KSB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCBcImRlcmVmXCIgaW4gdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQ/LmRlcmVmID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9IHRhcmdldD8uZGVyZWY/LigpO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwgJiYgKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHR0YXJnZXQgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRjb25zdCAkdmFsID0gZGlzY291bnRWYWx1ZSAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHRhcmdldD8udmFsdWU7XG5cdFx0aWYgKCR2YWwgIT0gbnVsbCAmJiAodHlwZW9mICR2YWwgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgJHZhbCA9PSBcImZ1bmN0aW9uXCIpKSB0YXJnZXQgPSAkdmFsO1xuXHRcdGlmIChvcmlnaW5hbCAhPSB0YXJnZXQpIHJldHVybiBkZXJlZih0YXJnZXQsIGRpc2NvdW50VmFsdWUpO1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGlzVGhlbmFibGUgPSAodmFsKSA9PiB2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbnZhciB3aXRoUHJvbWlzZSA9ICh0YXJnZXQsIGNiKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY2I/Lih0YXJnZXQpO1xuXHRpZiAoaXNUaGVuYWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0LnRoZW4oY2IpO1xuXHRpZiAodHlwZW9mIHRhcmdldD8ucmVzb2x2ZWQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRhcmdldC5yZXNvbHZlZCgpKS50aGVuKGNiKTtcblx0aWYgKHRhcmdldD8ucHJvbWlzZSAmJiBpc1RoZW5hYmxlKHRhcmdldC5wcm9taXNlKSkgcmV0dXJuIHRhcmdldC5wcm9taXNlLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5bJHByb21pc2VdICYmIGlzVGhlbmFibGUodGFyZ2V0WyRwcm9taXNlXSkpIHJldHVybiB0YXJnZXRbJHByb21pc2VdLnRoZW4oY2IpO1xuXHRyZXR1cm4gY2I/Lih0YXJnZXQpO1xufTtcbnZhciBkaXNwb3NlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZGlzcG9zZVJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChjYWxsc3RhY2spID0+IHtcblx0Y2FsbHN0YWNrPy5mb3JFYWNoPy4oKGNiKSA9PiBjYj8uKCkpO1xufSk7XG5mdW5jdGlvbiBhZGRUb0NhbGxDaGFpbihvYmosIG1ldGhvZEtleSwgY2FsbGJhY2spIHtcblx0aWYgKCFjYWxsYmFjayB8fCB0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBvYmogIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAobWV0aG9kS2V5ID09IFN5bWJvbC5kaXNwb3NlKSB7XG5cdFx0Y29uc3QgY2hhaW5UYXJnZXQgPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iajtcblx0XHRkaXNwb3NlTWFwPy5nZXRPckluc2VydENvbXB1dGVkPy4oY2hhaW5UYXJnZXQsICgpID0+IHtcblx0XHRcdGNvbnN0IENhbGxDaGFpbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0XHRpZiAodHlwZW9mIGNoYWluVGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNoYWluVGFyZ2V0ID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRkaXNwb3NlUmVnaXN0cnkucmVnaXN0ZXIoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGRpc3Bvc2VNYXAuc2V0KGNoYWluVGFyZ2V0LCBDYWxsQ2hhaW4pO1xuXHRcdFx0XHRjaGFpblRhcmdldFtTeW1ib2wuZGlzcG9zZV0gPz89ICgpID0+IENhbGxDaGFpbi5mb3JFYWNoKChjYikgPT4ge1xuXHRcdFx0XHRcdGNiPy4oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQ2FsbENoYWluO1xuXHRcdH0pPy5hZGQ/LihjYWxsYmFjayk7XG5cdH0gZWxzZSBvYmpbbWV0aG9kS2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IG9iaj8uW21ldGhvZEtleV07XG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbCA9PSBcImZ1bmN0aW9uXCIpIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxudmFyIGlzQXJyYXlJbmRleCA9IChwcm9wKSA9PiB7XG5cdGlmICh0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuXHRpZiAocHJvcCA9PT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBudW0gPSBOdW1iZXIocHJvcCk7XG5cdHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IDAgJiYgU3RyaW5nKG51bSkgPT09IHByb3A7XG59O1xuZnVuY3Rpb24gd3JhcFNldEFzQXJyYXkoc291cmNlID0gW10sIG9wdGlvbnMgPSB7fSkge1xuXHRsZXQgYmFja2luZ1NldCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdGNvbnN0IG5vdGlmeUR1cGxpY2F0ZSA9ICh2YWx1ZSwgdmlhLCBpbmRleCkgPT4ge1xuXHRcdG9wdGlvbnMub25EdXBsaWNhdGU/Lih7XG5cdFx0XHR2YWx1ZSxcblx0XHRcdHZpYSxcblx0XHRcdGluZGV4XG5cdFx0fSk7XG5cdH07XG5cdGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIGJhY2tpbmdTZXQgPSBzb3VyY2U7XG5cdGVsc2UgZm9yIChjb25zdCBpdGVtIG9mIHNvdXJjZSkge1xuXHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fVxuXHRjb25zdCBzbmFwc2hvdCA9ICgpID0+IEFycmF5LmZyb20oYmFja2luZ1NldCk7XG5cdGNvbnN0IHJlYnVpbGRGcm9tID0gKGFycikgPT4ge1xuXHRcdGJhY2tpbmdTZXQuY2xlYXIoKTtcblx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSBiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fTtcblx0Y29uc3QgbWV0aG9kcyA9IHtcblx0XHRwdXNoOiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGxldCBzaXplID0gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInB1c2hcIik7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdFx0XHRcdHNpemUrKztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzaXplO1xuXHRcdH0sXG5cdFx0cG9wOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0aWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdFx0YmFja2luZ1NldC5kZWxldGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2hpZnQ6ICgpID0+IHtcblx0XHRcdGNvbnN0IGl0ZXJhdG9yID0gYmFja2luZ1NldC52YWx1ZXMoKS5uZXh0KCk7XG5cdFx0XHRpZiAoaXRlcmF0b3IuZG9uZSkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmF0b3IudmFsdWU7XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHR1bnNoaWZ0OiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Y29uc3QgY3VycmVudCA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCB0b1ByZXBlbmQgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoY3VycmVudC5pbmNsdWRlcyhpdGVtKSB8fCB0b1ByZXBlbmQuaW5jbHVkZXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJ1bnNoaWZ0XCIsIDApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvUHJlcGVuZC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0b1ByZXBlbmQubGVuZ3RoKSByZXR1cm4gY3VycmVudC5sZW5ndGg7XG5cdFx0XHRjb25zdCBuZXh0ID0gWy4uLnRvUHJlcGVuZCwgLi4uY3VycmVudF07XG5cdFx0XHRyZWJ1aWxkRnJvbShuZXh0KTtcblx0XHRcdHJldHVybiBuZXh0Lmxlbmd0aDtcblx0XHR9LFxuXHRcdHNwbGljZTogKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBub3JtYWxpemVkU3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChzdGFydCwgMCksIGFyci5sZW5ndGgpO1xuXHRcdFx0Y29uc3QgYWN0dWFsRGVsZXRlQ291bnQgPSBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gYXJyLmxlbmd0aCAtIG5vcm1hbGl6ZWRTdGFydCA6IE1hdGgubWF4KDAsIE1hdGgubWluKGRlbGV0ZUNvdW50LCBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0KSk7XG5cdFx0XHRjb25zdCByZW1vdmVkID0gYXJyLnNwbGljZShub3JtYWxpemVkU3RhcnQsIGFjdHVhbERlbGV0ZUNvdW50KTtcblx0XHRcdGxldCBpbnNlcnRQb3NpdGlvbiA9IG5vcm1hbGl6ZWRTdGFydDtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwic3BsaWNlXCIsIGluc2VydFBvc2l0aW9uKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcnIuc3BsaWNlKGluc2VydFBvc2l0aW9uKyssIDAsIGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdHJldHVybiByZW1vdmVkO1xuXHRcdH0sXG5cdFx0aW5jbHVkZXM6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5oYXModmFsdWUpLFxuXHRcdGluZGV4T2Y6ICh2YWx1ZSkgPT4gc25hcHNob3QoKS5pbmRleE9mKHZhbHVlKSxcblx0XHRjbGVhcjogKCkgPT4ge1xuXHRcdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlOiAodmFsdWUpID0+IGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKSxcblx0XHR0b0FycmF5OiAoKSA9PiBzbmFwc2hvdCgpLFxuXHRcdHRvU2V0OiAoKSA9PiBuZXcgU2V0KGJhY2tpbmdTZXQpLFxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBiYWNraW5nU2V0W1N5bWJvbC5pdGVyYXRvcl0oKVxuXHR9O1xuXHRyZXR1cm4gbmV3IFByb3h5KG1ldGhvZHMsIHtcblx0XHRnZXQ6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHJldHVybiBzbmFwc2hvdCgpW051bWJlcihwcm9wKV07XG5cdFx0XHRjb25zdCB2YWx1ZSA9IG1ldGhvZHNbcHJvcF07XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHNldDogKF8sIHByb3AsIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyXCIpO1xuXHRcdFx0XHRjb25zdCBuZXh0TGVuZ3RoID0gTWF0aC5mbG9vcih2YWx1ZSk7XG5cdFx0XHRcdGlmIChuZXh0TGVuZ3RoID49IGJhY2tpbmdTZXQuc2l6ZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCkuc2xpY2UoMCwgbmV4dExlbmd0aCk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID4gYXJyLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IG5leHRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAoaW5kZXggPCBhcnIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFZhbHVlID0gYXJyW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoT2JqZWN0LmlzKGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKGFyci5zb21lKChpdGVtLCBpZHgpID0+IGlkeCAhPT0gaW5kZXggJiYgT2JqZWN0LmlzKGl0ZW0sIG5leHRWYWx1ZSkpKSB7XG5cdFx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUobmV4dFZhbHVlLCBcInNldFwiLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YXJyW2luZGV4XSA9IG5leHRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKG5leHRWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnIucHVzaChuZXh0VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3Quc2V0KG1ldGhvZHMsIHByb3AsIHZhbHVlKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRvd25LZXlzOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gW107XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IF8gb2YgYmFja2luZ1NldCkga2V5cy5wdXNoKFN0cmluZyhpKyspKTtcblx0XHRcdGtleXMucHVzaChcImxlbmd0aFwiKTtcblx0XHRcdHJldHVybiBrZXlzO1xuXHRcdH0sXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0dmFsdWU6IGJhY2tpbmdTZXQuc2l6ZVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHZhbHVlOiBhcnJbaW5kZXhdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRoYXM6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRyZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9wIGluIG1ldGhvZHM7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3dyYXAvQXNzaWduT2JqZWN0LnRzXG52YXIgQXNzaWduT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbmFtZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ/LltuYW1lXSA/PyB0YXJnZXQ7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgY3R4KTtcblx0fVxufTtcbnZhciBtYWtlT2JqZWN0QXNzaWduYWJsZSA9IChvYmopID0+IHtcblx0aWYgKG9iaj8uWyRvcmlnaW5hbEtleSRdIHx8ICRvcmlnaW5hbE9iamVjdHMkLmhhcyhvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCBweCA9IG5ldyBQcm94eShvYmosIG5ldyBBc3NpZ25PYmplY3RIYW5kbGVyKCkpO1xuXHQkb3JpZ2luYWxPYmplY3RzJC5zZXQocHgsIG9iaik7XG5cdHJldHVybiBweDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1N1YnNjcmlwdC50c1xudmFyIHdpdGhVbnN1YlN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd2l0aFVuc3ViXCIpO1xuZ2xvYmFsVGhpc1t3aXRoVW5zdWJTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB3aXRoVW5zdWIgPSBnbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF07XG52YXIgY29tcGxldGVXaXRoVW5zdWIgPSAoc3Vic2NyaWJlciwgd2VhaywgaGFuZGxlcikgPT4ge1xuXHRyZXR1cm4gd2l0aFVuc3ViLmdldE9ySW5zZXJ0KHN1YnNjcmliZXIsICgpID0+IHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHdlYWs/LmRlcmVmPy4oKTtcblx0XHRyZWdpc3RyeT8uYWZmZWN0ZWQ/LihoYW5kbGVyKTtcblx0XHRjb25zdCBzYXZDb21wbGV0ZSA9IHN1YnNjcmliZXI/LmNvbXBsZXRlPy5iaW5kPy4oc3Vic2NyaWJlcik7XG5cdFx0Y29uc3QgdW5hZmZlY3RlZCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHIgPSBzYXZDb21wbGV0ZT8uKCk7XG5cdFx0XHRyZWdpc3RyeT8udW5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fTtcblx0XHRzdWJzY3JpYmVyLmNvbXBsZXRlID0gdW5hZmZlY3RlZDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuZGlzcG9zZV06IHVuYWZmZWN0ZWQsXG5cdFx0XHRbU3ltYm9sLmFzeW5jRGlzcG9zZV06IHVuYWZmZWN0ZWRcblx0XHR9O1xuXHR9KTtcbn07XG52YXIgc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHN1YnNjcmlwdFJlZ2lzdHJ5XCIpO1xuZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHN1YnNjcmlwdFJlZ2lzdHJ5ID0gZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAZ2xvYmFsRWZmZWN0TGlzdGVuZXJzXCIpO1xuZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVycyA9IGdsb2JhbFRoaXNbZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sXTtcbnZhciBlZmZlY3RHbG9iYWxseSA9IChjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Z2xvYmFsRWZmZWN0TGlzdGVuZXJzLnNldChjYiwgbm9ybWFsaXplZC5hZmZlY3RUeXBlcyk7XG5cdHJldHVybiAoKSA9PiBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuZGVsZXRlKGNiKTtcbn07XG52YXIgd3JhcHBlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd3JhcHBlZFwiKTtcbmdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdyYXBwZWQgPSBnbG9iYWxUaGlzW3dyYXBwZWRTeW1ib2xdO1xudmFyIHJlZ2lzdGVyID0gKHdoYXQsIGhhbmRsZSkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0O1xuXHRsZXQgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKTtcblx0aWYgKCFyZWdpc3RyeSkge1xuXHRcdHJlZ2lzdHJ5ID0gbmV3IFN1YnNjcmlwdCh1bndyYXApO1xuXHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LnNldCh1bndyYXAsIHJlZ2lzdHJ5KTtcblx0fSBlbHNlIHJlZ2lzdHJ5LmJpbmRTb3VyY2UodW53cmFwKTtcblx0cmV0dXJuIGhhbmRsZTtcbn07XG52YXIgd3JhcFdpdGggPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdHdoYXQgPSBkZXJlZih3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0KTtcblx0aWYgKHR5cGVvZiB3aGF0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2Ygd2hhdCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB3aGF0ID09IFwiZnVuY3Rpb25cIikgfHwgd2hhdCA9PSBudWxsKSByZXR1cm4gd2hhdDtcblx0cmV0dXJuIHdyYXBwZWQuZ2V0T3JJbnNlcnRDb21wdXRlZCh3aGF0LCAoKSA9PiBuZXcgUHJveHkod2hhdCwgcmVnaXN0ZXIod2hhdCwgaGFuZGxlKSkpO1xufTtcbnZhciBmb3JBbGwgPSBTeW1ib2wuZm9yKFwiQGFsbFByb3BzXCIpO1xudmFyIHdpbGRjYXJkVHJpZ2dlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCIsIFwiYWxsXCJdKTtcbnZhciB0cmlnZ2VyQWxpYXNlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKFtcblx0W1wic2V0XCIsIFtcInNldHRlclwiLCBcIkBzZXRcIl1dLFxuXHRbXCJhZGRcIiwgW1wiQGFkZFwiXV0sXG5cdFtcImRlbGV0ZVwiLCBbXCJAZGVsZXRlXCJdXSxcblx0W1wiaW52YWxpZGF0ZVwiLCBbXCJAaW52YWxpZGF0ZVwiXV0sXG5cdFtcIm1hbnVhbFwiLCBbXCJAbWFudWFsXCJdXSxcblx0W1wiY3VzdG9tXCIsIFtcIkBjdXN0b21cIl1dLFxuXHRbXCJyZXNvbHZlZFwiLCBbXCJAcmVzb2x2ZWRcIl1dLFxuXHRbXCJzZXRBbGxcIiwgW1wiQHNldEFsbFwiXV0sXG5cdFtcImFkZEFsbFwiLCBbXCJAYWRkQWxsXCJdXSxcblx0W1wiZGVsZXRlQWxsXCIsIFtcIkBkZWxldGVBbGxcIiwgXCJAY2xlYXJcIl1dXG5dKTtcbnZhciB0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHRyaWdnZXJDYW5vbmljYWxOYW1lc1wiKTtcbmdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXSA/Pz0gbmV3IE1hcChBcnJheS5mcm9tKHRyaWdnZXJBbGlhc2VzLmVudHJpZXMoKSkuZmxhdE1hcCgoW2Nhbm9uaWNhbCwgYWxpYXNlc10pID0+IGFsaWFzZXMubWFwKChhbGlhcykgPT4gW2FsaWFzLCBjYW5vbmljYWxdKSkpO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lcyA9IGdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXTtcbnZhciBub3JtYWxpemVUcmlnZ2VyTmFtZSA9ICh0cmlnZ2VyID0gXCJzZXRcIikgPT4ge1xuXHRpZiAodHJpZ2dlciA9PSBudWxsKSByZXR1cm4gdHJpZ2dlcjtcblx0Y29uc3QgbmFtZSA9IFN0cmluZyh0cmlnZ2VyIHx8IFwic2V0XCIpO1xuXHRyZXR1cm4gdHJpZ2dlckNhbm9uaWNhbE5hbWVzLmdldChuYW1lKSA/PyBuYW1lO1xufTtcbnZhciB0cmlnZ2VyTmFtZXNPZiA9ICh0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5hbWUgPSB0cmlnZ2VyID09IG51bGwgPyBcImFsbFwiIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IFwiYWxsXCIpO1xuXHRyZXR1cm4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV07XG59O1xudmFyIGV4cGFuZFRyaWdnZXJGaWx0ZXIgPSAodHlwZXMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBuZXcgU2V0KFsuLi5ub3JtYWxpemVUcmlnZ2VyRmlsdGVyKHR5cGVzKV0uZmxhdE1hcCgobmFtZSkgPT4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV0pKTtcbn07XG52YXIgbm9ybWFsaXplVHJpZ2dlckZpbHRlciA9ICh0cmlnZ2VycyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgbGlzdCA9IHR5cGVvZiB0cmlnZ2VycyA9PSBcInN0cmluZ1wiID8gW3RyaWdnZXJzXSA6IEFycmF5LmZyb20odHJpZ2dlcnMgPz8gW1wiKlwiXSk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBuZXcgU2V0KGxpc3QubWFwKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgbmFtZSA9IFN0cmluZyhpdGVtIHx8IFwiKlwiKTtcblx0XHRyZXR1cm4gd2lsZGNhcmRUcmlnZ2Vycy5oYXMobmFtZSkgPyBuYW1lIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG5hbWUpID8/IG5hbWUpO1xuXHR9KSk7XG5cdHJldHVybiBub3JtYWxpemVkLnNpemUgPyBub3JtYWxpemVkIDogLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1wiKlwiXSk7XG59O1xudmFyIHRyaWdnZXJGaWx0ZXJBbGxvd3MgPSAodHJpZ2dlcnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3QgZmlsdGVyID0gdHJpZ2dlcnMgaW5zdGFuY2VvZiBTZXQgPyB0cmlnZ2VycyA6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHJpZ2dlcnMpO1xuXHRyZXR1cm4gWy4uLndpbGRjYXJkVHJpZ2dlcnNdLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpIHx8IHRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpO1xufTtcbnZhciBpc09wdGlvbnNPYmplY3QgPSAob3B0aW9ucykgPT4ge1xuXHRyZXR1cm4gISFvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucykgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlcnNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gb3B0aW9ucyk7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ICE9PSBmYWxzZVxuXHR9O1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyk7XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiB0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcImluaXRpYWxcIilcblx0fTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0T3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ID09PSB0cnVlXG5cdH07XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9O1xufTtcbnZhciBTdWJzY3JpcHRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQFN1YnNjcmlwdFwiKTtcbmdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXSA/Pz0gY2xhc3MgU3Vic2NyaXB0IHtcblx0Y29tcGF0aWJsZTtcblx0I3NvdXJjZTtcblx0I2xpc3RlbmVycztcblx0I2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdCNuYXRpdmU7XG5cdCNpdGVyYXRvcjtcblx0I2luRGlzcGF0Y2ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjZGlzYWJsZWRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCN0cmlnZ2VyQ29udHJvbDtcblx0I3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQjcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy4jbGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHR0aGlzLiNmbGFncyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRcdHRoaXMuI3RyaWdnZXJDb250cm9sID0ge1xuXHRcdFx0ZW5hYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgdHJ1ZSwgY2IpIDogdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIHRydWUpLFxuXHRcdFx0ZGlzYWJsZTogKHR5cGVzID0gW1wiKlwiXSwgY2IpID0+IGNiID8gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIGZhbHNlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgZmFsc2UpLFxuXHRcdFx0c2V0OiAodHlwZXMsIGVuYWJsZWQpID0+IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBlbmFibGVkKSxcblx0XHRcdHdpdGg6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYiksXG5cdFx0XHR3aXRob3V0OiAodHlwZXMsIGNiKSA9PiB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSxcblx0XHRcdGlzRW5hYmxlZDogKHRyaWdnZXIpID0+IHRoaXMuaXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKVxuXHRcdH07XG5cdFx0dGhpcy4jaXRlcmF0b3IgPSB7IG5leHQ6IChhcmdzKSA9PiB7XG5cdFx0XHRpZiAoYXJncykgQXJyYXkuaXNBcnJheShhcmdzKSA/IHRoaXMuI2Rpc3BhdGNoKC4uLmFyZ3MpIDogdGhpcy4jZGlzcGF0Y2goYXJncyk7XG5cdFx0fSB9O1xuXHRcdGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZih0aGlzKTtcblx0XHRjb25zdCBjb250cm9sbGVyID0gZnVuY3Rpb24oc3Vic2NyaWJlcikge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IHN1YnNjcmliZXI/Lm5leHQ/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRcdHJldHVybiBjb21wbGV0ZVdpdGhVbnN1YihzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKTtcblx0XHR9O1xuXHRcdHRoaXMuI25hdGl2ZSA9IHR5cGVvZiBPYnNlcnZhYmxlICE9IFwidW5kZWZpbmVkXCIgPyBuZXcgT2JzZXJ2YWJsZShjb250cm9sbGVyKSA6IG51bGw7XG5cdFx0dGhpcy5jb21wYXRpYmxlID0gKCkgPT4gdGhpcy4jbmF0aXZlO1xuXHR9XG5cdGJpbmRTb3VyY2Uoc291cmNlKSB7XG5cdFx0dGhpcy4jc291cmNlID8/PSBzb3VyY2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0JHNhZmVFeGVjKGNiLCAuLi5hcmdzKSB7XG5cdFx0aWYgKCFjYiB8fCB0aGlzLiNmbGFncy5oYXMoY2IpKSByZXR1cm47XG5cdFx0dGhpcy4jZmxhZ3MuYWRkKGNiKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzID0gY2IoLi4uYXJncyk7XG5cdFx0XHRpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHJlcy5jYXRjaChjb25zb2xlLndhcm4pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy4jZmxhZ3MuZGVsZXRlKGNiKTtcblx0XHR9XG5cdH1cblx0I2Rpc3BhdGNoKG5hbWUsIHZhbHVlID0gbnVsbCwgb2xkVmFsdWUsIHRyaWdnZXIgPSBcImFsbFwiLCAuLi5ldGMpIHtcblx0XHR0cmlnZ2VyID0gbm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gdHJpZ2dlcjtcblx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0aWYgKGxpc3RlbmVycz8uc2l6ZSkge1xuXHRcdFx0Zm9yIChjb25zdCBbY2IsIHJlY29yZF0gb2YgbGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKChyZWNvcmQucHJvcCA9PT0gbmFtZSB8fCByZWNvcmQucHJvcCA9PT0gZm9yQWxsIHx8IHJlY29yZC5wcm9wID09PSBudWxsKSAmJiB0cmlnZ2VyRmlsdGVyQWxsb3dzKHJlY29yZC50cmlnZ2VycywgdHJpZ2dlcikpIHRoaXMuJHNhZmVFeGVjKGNiLCB2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG5cdFx0fVxuXHRcdGlmIChnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2l6ZSkge1xuXHRcdFx0Y29uc3QgZXZlbnQgPSB7XG5cdFx0XHRcdHNvdXJjZTogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR0YXJnZXQ6IHRoaXMuI3NvdXJjZSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdHByb3A6IG5hbWUsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyLFxuXHRcdFx0XHRhcmdzOiBldGNcblx0XHRcdH07XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgdHJpZ2dlcnNdIG9mIGdsb2JhbEVmZmVjdExpc3RlbmVycy5lbnRyaWVzKCkpIGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKHRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIGV2ZW50KTtcblx0XHR9XG5cdH1cblx0d3JhcChudykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG53KSkgcmV0dXJuIHdyYXBXaXRoKG53LCB0aGlzKTtcblx0XHRyZXR1cm4gbnc7XG5cdH1cblx0Z2V0IHRyaWdnZXJDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLiN0cmlnZ2VyQ29udHJvbDtcblx0fVxuXHRpc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpIHtcblx0XHRyZXR1cm4gIXRyaWdnZXJGaWx0ZXJBbGxvd3ModGhpcy4jZGlzYWJsZWRUcmlnZ2VycywgXCJhbGxcIikgJiYgIXRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpKTtcblx0fVxuXHRzZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMgPSBbXCIqXCJdLCBlbmFibGVkID0gdHJ1ZSkge1xuXHRcdGNvbnN0IG5hbWVzID0gZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyk7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSBpZiAoZW5hYmxlZCkgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5kZWxldGUobmFtZSk7XG5cdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0fVxuXHR3aXRoVHJpZ2dlcnModHlwZXMsIGVuYWJsZWQsIGNiKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBbLi4uZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyldO1xuXHRcdGNvbnN0IHByZXZpb3VzID0gbmV3IE1hcChuYW1lcy5tYXAoKG5hbWUpID0+IFtuYW1lLCB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmhhcyhuYW1lKV0pKTtcblx0XHRjb25zdCByZXN0b3JlID0gKCkgPT4ge1xuXHRcdFx0cHJldmlvdXMuZm9yRWFjaCgod2FzRGlzYWJsZWQsIG5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHdhc0Rpc2FibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0XHRcdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0dGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQobmFtZXMsIGVuYWJsZWQpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjYj8uKCk7XG5cdFx0XHRpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQuZmluYWxseSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiByZXN1bHQuZmluYWxseShyZXN0b3JlKTtcblx0XHRcdHJlc3RvcmUoKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YWZmZWN0ZWQoY2IsIHByb3AsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdFx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy4jbGlzdGVuZXJzLnNldChjYiwge1xuXHRcdFx0cHJvcDogcHJvcCB8fCBmb3JBbGwsXG5cdFx0XHR0cmlnZ2Vyczogbm9ybWFsaXplZC5hZmZlY3RUeXBlc1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnVuYWZmZWN0ZWQoY2IsIHByb3AgfHwgZm9yQWxsKTtcblx0fVxuXHR1bmFmZmVjdGVkKGNiLCBwcm9wKSB7XG5cdFx0aWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy4jbGlzdGVuZXJzO1xuXHRcdFx0Y29uc3QgcmVjb3JkID0gbGlzdGVuZXJzPy5nZXQoY2IpO1xuXHRcdFx0aWYgKHJlY29yZCAmJiAocmVjb3JkLnByb3AgPT0gcHJvcCB8fCBwcm9wID09IG51bGwgfHwgcHJvcCA9PSBmb3JBbGwpKSB7XG5cdFx0XHRcdGxpc3RlbmVycy5kZWxldGUoY2IpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gdGhpcy5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwsIHJlY29yZC50cmlnZ2Vycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiNsaXN0ZW5lcnMuY2xlYXIoKTtcblx0fVxuXHR0cmlnZ2VyKG5hbWUsIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwic2V0XCIsIC4uLmV0Yykge1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgcmV0dXJuO1xuXHRcdGlmICh0cmlnZ2VyID09PSB2b2lkIDApIHRyaWdnZXIgPSBcInNldFwiO1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGlmICghdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpKSByZXR1cm47XG5cdFx0Y29uc3Qgb3BLZXkgPSBgJHt0cmlnZ2VyID8/IFwiYWxsXCJ9YDtcblx0XHRsZXQgYnlPcCA9IHRoaXMuI3BlbmRpbmdCeVByb3AuZ2V0KG5hbWUpO1xuXHRcdGlmICghYnlPcCkge1xuXHRcdFx0YnlPcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wLnNldChuYW1lLCBieU9wKTtcblx0XHR9XG5cdFx0YnlPcC5zZXQob3BLZXksIFtcblx0XHRcdG5hbWUsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdGV0Y1xuXHRcdF0pO1xuXHRcdGlmICh0aGlzLiNmbHVzaFNjaGVkdWxlZCkgcmV0dXJuO1xuXHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcblx0XHRxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG5cdFx0XHR0aGlzLiNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRcdFx0Y29uc3QgYmF0Y2ggPSB0aGlzLiNwZW5kaW5nQnlQcm9wO1xuXHRcdFx0dGhpcy4jcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRmb3IgKGNvbnN0IFtwcm9wLCBvcE1hcF0gb2YgYmF0Y2gpIHtcblx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCAmJiB0aGlzLiNpbkRpc3BhdGNoLmhhcyhwcm9wKSkgY29udGludWU7XG5cdFx0XHRcdGlmIChwcm9wICE9IG51bGwpIHRoaXMuI2luRGlzcGF0Y2guYWRkKHByb3ApO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgWywgYXJnc10gb2Ygb3BNYXApIHtcblx0XHRcdFx0XHRcdGNvbnN0IFtubSwgdiwgb3YsIHRnLCByZXN0XSA9IGFyZ3M7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLiNkaXNwYXRjaChubSwgdiwgb3YsIHRnLCAuLi5yZXN0ID8/IFtdKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRpZiAocHJvcCAhPSBudWxsKSB0aGlzLiNpbkRpc3BhdGNoLmRlbGV0ZShwcm9wKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdGdldCBpdGVyYXRvcigpIHtcblx0XHRyZXR1cm4gdGhpcy4jaXRlcmF0b3I7XG5cdH1cbn07XG52YXIgU3Vic2NyaXB0ID0gZ2xvYmFsVGhpc1tTdWJzY3JpcHRTeW1ib2xdO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9SZXNvbHZlZC50c1xudmFyIHJhd09mID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXBwZWQgPSBkZXJlZih0YXJnZXQpO1xuXHRyZXR1cm4gdW53cmFwcGVkPy5bJGV4dHJhY3RLZXkkXSA/PyB1bndyYXBwZWQ7XG59O1xuZnVuY3Rpb24gcmVzb2x2ZWQodGFyZ2V0LCBtb2RlID0gXCJhbGxcIikge1xuXHRjb25zdCByYXcgPSByYXdPZih0YXJnZXQpO1xuXHRpZiAoaXNQcm9taXNlKHJhdykpIHJldHVybiByZXNvbHZlZCQxKHJhdywgbW9kZSk7XG5cdGlmIChpc1Byb21pc2UocmF3Py5bJHByb21pc2VdKSkgcmV0dXJuIHJlc29sdmVkJDEocmF3WyRwcm9taXNlXSwgbW9kZSk7XG5cdHJldHVybiByZXNvbHZlZCQxKHJhdyA/PyB0YXJnZXQsIG1vZGUpO1xufVxuZnVuY3Rpb24gbWFrZVJlc29sdmVkT3AodGFyZ2V0LCBlbWl0ID0gZmFsc2UpIHtcblx0Y29uc3QgcnVuID0gKChtb2RlID0gXCJhbGxcIikgPT4ge1xuXHRcdGNvbnN0IHBlbmRpbmcgPSByZXNvbHZlZCh0YXJnZXQsIG1vZGUpO1xuXHRcdGlmICghZW1pdCkgcmV0dXJuIHBlbmRpbmc7XG5cdFx0cmV0dXJuIHBlbmRpbmcudGhlbigodmFsdWUpID0+IHtcblx0XHRcdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCk7XG5cdFx0XHRjb25zdCBrZXkgPSByYXc/LnJlYWxQcm9wID8/IChyYXcgJiYgXCJ2YWx1ZVwiIGluIHJhdyA/IFwidmFsdWVcIiA6IG51bGwpO1xuXHRcdFx0c3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHJhdyk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCB2b2lkIDAsIFwicmVzb2x2ZWRcIik7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSk7XG5cdH0pO1xuXHRydW4uYWxsID0gKCkgPT4gcnVuKFwiYWxsXCIpO1xuXHRydW4uYWxsU2V0dGxlZCA9ICgpID0+IHJ1bihcInNldHRsZWRcIik7XG5cdHJ1bi5hbGxLZXllZCA9ICgpID0+IHJ1bihcImFsbFwiKTtcblx0cnVuLmFsbFNldHRsZWRLZXllZCA9ICgpID0+IHJ1bihcInNldHRsZWRcIik7XG5cdHJ1bi50cnkgPSAoY2FsbGJhY2tPclZhbHVlLCAuLi5hcmdzKSA9PiBQcm9taXNlLnRyeShjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpLnRoZW4oKHZhbHVlKSA9PiByZXNvbHZlZCh2YWx1ZSA/PyB0YXJnZXQsIFwiYWxsXCIpKTtcblx0cmV0dXJuIHJ1bjtcbn1cbmZ1bmN0aW9uIGVtaXRSZXNvbHZlZCh0YXJnZXQsIGtleSwgdmFsdWUsIG9sZFZhbHVlKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCkgPz8gdGFyZ2V0O1xuXHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCBcInJlc29sdmVkXCIpO1xufVxuZnVuY3Rpb24gYmluZEV4aXN0aW5nVGhlbmFibGVzKGxpdmUsIHJhdykge1xuXHRpZiAobGl2ZSA9PSBudWxsIHx8IHJhdyA9PSBudWxsKSByZXR1cm4gbGl2ZTtcblx0aWYgKEFycmF5LmlzQXJyYXkocmF3KSkge1xuXHRcdHJhdy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcblx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlW2luZGV4XSA9IHZhbHVlO1xuXHRcdH0pO1xuXHRcdHJldHVybiBsaXZlO1xuXHR9XG5cdGlmIChyYXcgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiByYXcuZW50cmllcygpKSBpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZS5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0cmV0dXJuIGxpdmU7XG5cdH1cblx0aWYgKHJhdyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIGxpdmU7XG5cdGZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhyYXcpKSB7XG5cdFx0aWYgKGtleSA9PSAkZXh0cmFjdEtleSQgfHwga2V5ID09ICRwcm9taXNlIHx8IGtleSA9PSAkcmVzb2x2ZWQpIGNvbnRpbnVlO1xuXHRcdGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihyYXcsIGtleSk/LmVudW1lcmFibGUpIGNvbnRpbnVlO1xuXHRcdGNvbnN0IHZhbHVlID0gcmF3W2tleV07XG5cdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmVba2V5XSA9IHZhbHVlO1xuXHR9XG5cdHJldHVybiBsaXZlO1xufVxuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9TcGVjaWZpYy50c1xudmFyIF9fc2FmZUdldEd1YXJkU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0BfX3NhZmVHZXRHdWFyZFwiKTtcbnZhciBfX3N5c3RlbVNraXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG5cdFN5bWJvbC50b1N0cmluZ1RhZyxcblx0U3ltYm9sLml0ZXJhdG9yLFxuXHRTeW1ib2wuYXN5bmNJdGVyYXRvcixcblx0U3ltYm9sLnRvUHJpbWl0aXZlLFxuXHRcInRvU3RyaW5nXCIsXG5cdFwidmFsdWVPZlwiLFxuXHRcImluc3BlY3RcIixcblx0XCJjb25zdHJ1Y3RvclwiLFxuXHRcIl9fcHJvdG9fX1wiLFxuXHRcInByb3RvdHlwZVwiLFxuXHRcInRoZW5cIixcblx0XCJjYXRjaFwiLFxuXHRcImZpbmFsbHlcIixcblx0XCJuZXh0XCJcbl0pO1xudmFyIHN5c3RlbVNraXBHZXQgPSAodGFyZ2V0LCBuYW1lKSA9PiB7XG5cdGlmICghX19zeXN0ZW1Ta2lwLmhhcyhuYW1lKSkgcmV0dXJuIG51bGw7XG5cdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0cmV0dXJuIHR5cGVvZiBnb3QgPT09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBnb3QpIDogZ290O1xufTtcbnZhciBfX3NhZmVHZXRHdWFyZCA9IGdsb2JhbFRoaXNbX19zYWZlR2V0R3VhcmRTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIGlzR2V0dGVyKG9iaiwgcHJvcE5hbWUpIHtcblx0bGV0IGdvdCA9IHRydWU7XG5cdHRyeSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4ocHJvcE5hbWUpO1xuXHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4ob2JqKT8uaGFzPy4ocHJvcE5hbWUpKSBnb3QgPSB0cnVlO1xuXHRcdGdvdCA9IHR5cGVvZiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3BOYW1lKT8uZ2V0ID09IFwiZnVuY3Rpb25cIjtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGdvdCA9IHRydWU7XG5cdH0gZmluYWxseSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/LmRlbGV0ZT8uKHByb3BOYW1lKTtcblx0fVxuXHRyZXR1cm4gZ290O1xufVxudmFyIGZhbGxUaHJvdWdoID0gKG9iaiwga2V5KSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCB2YWx1ZSA9IHNhZmVHZXQob2JqLCBrZXkpO1xuXHRpZiAodmFsdWUgPT0gbnVsbCAmJiBrZXkgIT0gXCJ2YWx1ZVwiKSB7XG5cdFx0Y29uc3QgdG1wID0gc2FmZUdldChvYmosIFwidmFsdWVcIik7XG5cdFx0aWYgKHRtcCAhPSBudWxsICYmICFpc1ByaW1pdGl2ZSh0bXApKSByZXR1cm4gZmFsbFRocm91Z2godG1wLCBrZXkpO1xuXHRcdGVsc2UgcmV0dXJuIHZhbHVlO1xuXHR9IGVsc2UgaWYgKGtleSA9PSBcInZhbHVlXCIgJiYgdmFsdWUgIT0gbnVsbCAmJiAhaXNQcmltaXRpdmUodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxsVGhyb3VnaCh2YWx1ZSwga2V5KSA/PyB2YWx1ZSA/PyBvYmo7XG5cdHJldHVybiB2YWx1ZSA/PyBvYmo7XG59O1xudmFyIHNhZmVTZXQgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XG5cdGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlU2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIGZhbHNlO1xuXHRhY3RpdmU/LmFkZD8uKGtleSk7XG5cdHJldHVybiBSZWZsZWN0LnNldChvYmosIGtleSwgdmFsdWUpO1xufTtcbnZhciBzYWZlR2V0ID0gKG9iaiwga2V5LCByZWMpID0+IHtcblx0bGV0IHJlc3VsdCA9IHZvaWQgMDtcblx0aWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIG51bGw7XG5cdGlmICghaXNHZXR0ZXIob2JqLCBrZXkpKSByZXN1bHQgPz89IFJlZmxlY3QuZ2V0KG9iaiwga2V5LCByZWMgIT0gbnVsbCA/IHJlYyA6IG9iaik7XG5cdGVsc2Uge1xuXHRcdGFjdGl2ZT8uYWRkPy4oa2V5KTtcblx0XHR0cnkge1xuXHRcdFx0cmVzdWx0ID0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcblx0XHR9IGNhdGNoIChfZSkge1xuXHRcdFx0cmVzdWx0ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRhY3RpdmUuZGVsZXRlKGtleSk7XG5cdFx0XHRpZiAoYWN0aXZlPy5zaXplID09PSAwKSBfX3NhZmVHZXRHdWFyZD8uZGVsZXRlPy4ob2JqKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHR5cGVvZiByZXN1bHQgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eChvYmosIHJlc3VsdCkgOiByZXN1bHQ7XG59O1xudmFyIGhhc093biA9IChvYmosIGtleSkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbnZhciBpc1RyaWdnZXJFbWl0T3B0aW9ucyA9ICh2YWx1ZSwgYWxsb3dWYWx1ZU9ubHkgPSBmYWxzZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKGhhc093bih2YWx1ZSwgXCJrZXlcIikgfHwgaGFzT3duKHZhbHVlLCBcIm5hbWVcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9sZFZhbHVlXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvbGRcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9wXCIpIHx8IGhhc093bih2YWx1ZSwgXCJ0cmlnZ2VyXCIpIHx8IGFsbG93VmFsdWVPbmx5ICYmIGhhc093bih2YWx1ZSwgXCJ2YWx1ZVwiKSk7XG59O1xudmFyIHRyaWdnZXJPcHRpb25WYWx1ZSA9IChvcHRpb25zLCBrZXksIGZhbGxiYWNrKSA9PiB7XG5cdGlmIChoYXNPd24ob3B0aW9ucywga2V5KSkgcmV0dXJuIG9wdGlvbnNba2V5XTtcblx0aWYgKGtleSA9PSBcIm9sZFZhbHVlXCIgJiYgaGFzT3duKG9wdGlvbnMsIFwib2xkXCIpKSByZXR1cm4gb3B0aW9ucy5vbGQ7XG5cdHJldHVybiBmYWxsYmFjaygpO1xufTtcbnZhciB0cmlnZ2VyT3B0aW9uVHJpZ2dlciA9IChvcHRpb25zLCBmYWxsYmFjayA9IFwibWFudWFsXCIpID0+IG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG9wdGlvbnMudHJpZ2dlciA/PyBvcHRpb25zLm9wID8/IGZhbGxiYWNrKTtcbnZhciBpc1J1bnRpbWVLZXkgPSAoa2V5KSA9PiB0eXBlb2Yga2V5ID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGtleSA9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBrZXkgPT0gXCJzeW1ib2xcIjtcbnZhciByZWFsUHJvcE9mJDEgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHByb3AgPSBzYWZlR2V0KHRhcmdldCwgJHJlYWxQcm9wKSA/PyBzYWZlR2V0KHRhcmdldCwgXCJyZWFsUHJvcFwiKTtcblx0cmV0dXJuIGlzUnVudGltZUtleShwcm9wKSA/IHByb3AgOiBudWxsO1xufTtcbnZhciB0cmlnZ2VyS2V5T2YgPSAodGFyZ2V0LCBrZXkpID0+IGtleSA9PSBcInZhbHVlXCIgPyByZWFsUHJvcE9mJDEodGFyZ2V0KSA/PyBrZXkgOiBrZXk7XG52YXIgdHJpZ2dlclZhbHVlT2YgPSAodGFyZ2V0LCBrZXkpID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mJDEodGFyZ2V0KTtcblx0aWYgKHJlYWxQcm9wICE9IG51bGwgJiYga2V5ID09IHJlYWxQcm9wKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgPz8gc2FmZUdldCh0YXJnZXQsIGtleSk7XG5cdHJldHVybiBrZXkgPT0gbnVsbCA/IHZvaWQgMCA6IHNhZmVHZXQodGFyZ2V0LCBrZXkpO1xufTtcbnZhciBjcmVhdGVUcmlnZ2VyQVBJID0gKHJlZ2lzdHJ5LCBlbWl0LCB0YXJnZXQpID0+IHtcblx0Y29uc3QgYXBpID0gKGtleSwgb3BPck9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoIWlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zKSkgdHJpZ2dlciA/Pz0gb3BPck9wdGlvbnM7XG5cdFx0cmV0dXJuIGVtaXQoaXNUcmlnZ2VyRW1pdE9wdGlvbnMoa2V5KSA/IGtleSA6IGlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zLCB0cnVlKSA/IHtcblx0XHRcdGtleSxcblx0XHRcdHRyaWdnZXIsXG5cdFx0XHQuLi5vcE9yT3B0aW9uc1xuXHRcdH0gOiB7XG5cdFx0XHRrZXksXG5cdFx0XHR0cmlnZ2VyOiB0cmlnZ2VyID8/IG9wT3JPcHRpb25zXG5cdFx0fSk7XG5cdH07XG5cdGNvbnN0IGNvbnRyb2wgPSByZWdpc3RyeT8udHJpZ2dlckNvbnRyb2w7XG5cdGlmIChjb250cm9sKSBPYmplY3QuYXNzaWduKGFwaSwgY29udHJvbCk7XG5cdGFwaS5jdXN0b20gPSAodHJpZ2dlciwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpID0+IGFwaSh7XG5cdFx0a2V5LFxuXHRcdHRyaWdnZXIsXG5cdFx0dmFsdWUsXG5cdFx0b2xkVmFsdWVcblx0fSk7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCkgYXBpLnJlc29sdmVkID0gbWFrZVJlc29sdmVkT3AodGFyZ2V0LCB0cnVlKTtcblx0cmV0dXJuIGFwaTtcbn07XG52YXIgc3lzdGVtR2V0ID0gKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IGlzUHJpbWl0aXZlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGlmICgoW1xuXHRcdFwiZGVyZWZcIixcblx0XHRcImJpbmRcIixcblx0XHRcIkB0YXJnZXRcIixcblx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdCRleHRyYWN0S2V5JCxcblx0XHQkcmVnaXN0cnlLZXkkXG5cdF0uaW5kZXhPZihuYW1lKSA8IDAgPyBzYWZlR2V0KHRhcmdldCwgbmFtZSk/LmJpbmQ/Lih0YXJnZXQpIDogbnVsbCkgIT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdGlmIChbJGV4dHJhY3RLZXkkLCAkb3JpZ2luYWxLZXkkXS5pbmRleE9mKG5hbWUpID49IDApIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdGFyZ2V0O1xuXHRpZiAobmFtZSA9PSAkdmFsdWUpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIik7XG5cdGlmIChuYW1lID09ICRyZWdpc3RyeUtleSQpIHJldHVybiByZWdpc3RyeTtcblx0aWYgKG5hbWUgPT0gJHJlc29sdmVkIHx8IG5hbWUgPT0gXCJyZXNvbHZlZFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBcInJlc29sdmVkXCIpKSByZXR1cm4gbWFrZVJlc29sdmVkT3AodGFyZ2V0KTtcblx0aWYgKG5hbWUgPT0gJHRyaWdnZXJDb250cm9sKSByZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXJDb250cm9sO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wub2JzZXJ2YWJsZSkgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuc3Vic2NyaWJlKSByZXR1cm4gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiBhZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCwgY2IsIG9wdGlvbnMpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5hc3luY0l0ZXJhdG9yKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuZGlzcG9zZSkgcmV0dXJuIChwcm9wKSA9PiB7XG5cdFx0c2FmZUdldCh0YXJnZXQsIFN5bWJvbC5kaXNwb3NlKT8uKHByb3ApO1xuXHRcdHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHR9O1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuYXN5bmNEaXNwb3NlKSByZXR1cm4gKHByb3ApID0+IHtcblx0XHRzYWZlR2V0KHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSk/Lihwcm9wKTtcblx0XHR1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0fTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLnVuc3Vic2NyaWJlKSByZXR1cm4gKHByb3ApID0+IHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xufTtcbnZhciBvYnNlcnZhYmxlQVBJTWV0aG9kcyA9ICh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KSA9PiB7XG5cdGlmIChuYW1lID09IFwic3Vic2NyaWJlXCIpIHJldHVybiByZWdpc3RyeT8uY29tcGF0aWJsZT8uW25hbWVdID8/ICgoaGFuZGxlcikgPT4ge1xuXHRcdGlmICh0eXBlb2YgaGFuZGxlciA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXIpO1xuXHRcdGVsc2UgaWYgKFwibmV4dFwiIGluIGhhbmRsZXIgJiYgaGFuZGxlcj8ubmV4dCAhPSBudWxsKSB7XG5cdFx0XHRjb25zdCB1c3ViID0gYWZmZWN0ZWQodGFyZ2V0LCBoYW5kbGVyPy5uZXh0KSwgY29tcCA9IGhhbmRsZXI/LltcImNvbXBsZXRlXCJdO1xuXHRcdFx0aGFuZGxlcltcImNvbXBsZXRlXCJdID0gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0dXN1Yj8uKCk7XG5cdFx0XHRcdHJldHVybiBjb21wPy4oLi4uYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGhhbmRsZXJbXCJjb21wbGV0ZVwiXTtcblx0XHR9XG5cdH0pO1xufTtcbnZhciBPYnNlcnZlQXJyYXlNZXRob2QgPSBjbGFzcyB7XG5cdCNuYW1lO1xuXHQjc2VsZjtcblx0I2hhbmRsZTtcblx0Y29uc3RydWN0b3IobmFtZSwgc2VsZiwgaGFuZGxlKSB7XG5cdFx0dGhpcy4jbmFtZSA9IG5hbWU7XG5cdFx0dGhpcy4jc2VsZiA9IHNlbGY7XG5cdFx0dGhpcy4jaGFuZGxlID0gaGFuZGxlO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgcmVjKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdGxldCBhZGRlZCA9IFtdLCByZW1vdmVkID0gW107XG5cdFx0bGV0IHNldFBhaXJzID0gW107XG5cdFx0bGV0IG9sZFN0YXRlID0gWy4uLnRoaXMuI3NlbGZdO1xuXHRcdGxldCBpZHggPSAtMTtcblx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4IHx8IHRoaXMuI3NlbGYsIGFyZ3MpO1xuXHRcdGlmICh0aGlzLiNoYW5kbGU/LlskdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSByZXR1cm4gb2JzZXJ2ZUFycmF5KHJlc3VsdCk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRzd2l0Y2ggKHRoaXMuI25hbWUpIHtcblx0XHRcdGNhc2UgXCJwdXNoXCI6XG5cdFx0XHRcdGlkeCA9IG9sZFN0YXRlPy5sZW5ndGg7XG5cdFx0XHRcdGFkZGVkID0gYXJncztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidW5zaGlmdFwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRhZGRlZCA9IGFyZ3M7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInBvcFwiOlxuXHRcdFx0XHRpZHggPSBvbGRTdGF0ZT8ubGVuZ3RoIC0gMTtcblx0XHRcdFx0aWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbb2xkU3RhdGVbaWR4XV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNoaWZ0XCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGlmIChvbGRTdGF0ZS5sZW5ndGggPiAwKSByZW1vdmVkID0gW29sZFN0YXRlW2lkeF1dO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzcGxpY2VcIjpcblx0XHRcdFx0aWR4ID0gYXJnc1swXTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1heChvbGRTdGF0ZS5sZW5ndGgsIHRoaXMuI3NlbGYubGVuZ3RoKTsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBvbGRTdGF0ZVtpXTtcblx0XHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHRoaXMuI3NlbGZbaV07XG5cdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09PSB2b2lkIDAgJiYgaSA+PSB0aGlzLiNzZWxmLmxlbmd0aCkgcmVtb3ZlZC5wdXNoKG9sZFZhbHVlKTtcblx0XHRcdFx0XHRlbHNlIGlmIChvbGRWYWx1ZSA9PT0gdm9pZCAwICYmIGkgPj0gb2xkU3RhdGUubGVuZ3RoKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdHZvaWQgMCxcblx0XHRcdFx0XHRcdGZhbHNlXG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChvbGRWYWx1ZSwgbmV3VmFsdWUpKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNvcnRcIjpcblx0XHRcdGNhc2UgXCJmaWxsXCI6XG5cdFx0XHRjYXNlIFwicmV2ZXJzZVwiOlxuXHRcdFx0Y2FzZSBcImNvcHlXaXRoaW5cIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvbGRTdGF0ZS5sZW5ndGg7IGkrKykgaWYgKGlzTm90RXF1YWwob2xkU3RhdGVbaV0sIHRoaXMuI3NlbGZbaV0pKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRpZHggKyBpLFxuXHRcdFx0XHRcdHRoaXMuI3NlbGZbaV0sXG5cdFx0XHRcdFx0b2xkU3RhdGVbaV0sXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2V0XCI6XG5cdFx0XHRcdGlkeCA9IGFyZ3NbMV07XG5cdFx0XHRcdHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdGlkeCxcblx0XHRcdFx0XHRhcmdzWzBdLFxuXHRcdFx0XHRcdG9sZFN0YXRlPy5baWR4XSxcblx0XHRcdFx0XHRpZHggaW4gb2xkU3RhdGVcblx0XHRcdFx0XSk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlZyA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0aGlzLiNzZWxmKTtcblx0XHRpZiAoYWRkZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIGFkZGVkWzBdLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZD8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBhZGRlZCwgbnVsbCwgXCJhZGRBbGxcIik7XG5cdFx0XHRhZGRlZC5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWc/LnRyaWdnZXI/LihpZHggKyBJLCBpdGVtLCBudWxsLCBcImFkZFwiKSk7XG5cdFx0fVxuXHRcdGlmIChzZXRQYWlycz8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKHNldFBhaXJzWzBdPy5bMF0gPz8gaWR4LCBzZXRQYWlyc1swXT8uWzFdLCBzZXRQYWlyc1swXT8uWzJdLCBzZXRQYWlyc1swXT8uWzNdID09PSBmYWxzZSA/IFwiYWRkXCIgOiBcInNldFwiKTtcblx0XHRlbHNlIGlmIChzZXRQYWlycz8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBzZXRQYWlycywgb2xkU3RhdGUsIFwic2V0QWxsXCIpO1xuXHRcdFx0c2V0UGFpcnMuZm9yRWFjaCgocGFpciwgSSkgPT4gcmVnPy50cmlnZ2VyPy4ocGFpcj8uWzBdID8/IGlkeCArIEksIHBhaXI/LlsxXSwgcGFpcj8uWzJdLCBwYWlyPy5bM10gPT09IGZhbHNlID8gXCJhZGRcIiA6IFwic2V0XCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlbW92ZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIG51bGwsIHJlbW92ZWRbMF0sIFwiZGVsZXRlXCIpO1xuXHRcdGVsc2UgaWYgKHJlbW92ZWQ/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZCwgXCJkZWxldGVBbGxcIik7XG5cdFx0XHRyZW1vdmVkLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZz8udHJpZ2dlcj8uKGlkeCArIEksIG51bGwsIGl0ZW0sIFwiZGVsZXRlXCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlc3VsdCA9PSB0YXJnZXQpIHJldHVybiBuZXcgUHJveHkocmVzdWx0LCB0aGlzLiNoYW5kbGUpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHJldHVybiBvYnNlcnZlQXJyYXkocmVzdWx0KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlID0gKHNlbGYsIHRhcmdldCwgb2xkTGVuLCBuZXdMZW4pID0+IHtcblx0Y29uc3QgcmVtb3ZlZEl0ZW1zID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPCBvbGRMZW4gPyB0YXJnZXQuc2xpY2UobmV3TGVuLCBvbGRMZW4pIDogW107XG5cdGlmICghc2VsZlskdHJpZ2dlckxvY2tdICYmIG9sZExlbiAhPT0gbmV3TGVuKSB7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA9PT0gMSkgcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtc1swXSwgXCJkZWxldGVcIik7XG5cdFx0ZWxzZSBpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuLCBudWxsLCByZW1vdmVkSXRlbXMsIFwiZGVsZXRlQWxsXCIpO1xuXHRcdFx0cmVtb3ZlZEl0ZW1zLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuICsgSSwgbnVsbCwgaXRlbSwgXCJkZWxldGVcIikpO1xuXHRcdH1cblx0XHRjb25zdCBhZGRlZENvdW50ID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPiBvbGRMZW4gPyBuZXdMZW4gLSBvbGRMZW4gOiAwO1xuXHRcdGlmIChhZGRlZENvdW50ID09PSAxKSByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgdm9pZCAwLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZENvdW50ID4gMSkge1xuXHRcdFx0Y29uc3QgYWRkZWQgPSBBcnJheShhZGRlZENvdW50KS5maWxsKHZvaWQgMCk7XG5cdFx0XHRyZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgYWRkZWQsIG51bGwsIFwiYWRkQWxsXCIpO1xuXHRcdFx0YWRkZWQuZm9yRWFjaCgoXywgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4gKyBJLCB2b2lkIDAsIG51bGwsIFwiYWRkXCIpKTtcblx0XHR9XG5cdH1cbn07XG52YXIgT2JzZXJ2ZUFycmF5SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0aGFzKHRhcmdldCwgbmFtZSkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gc2FmZUdldCh0YXJnZXQsIGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiQHRhcmdldFwiIHx8IG5hbWUgPT0gJGV4dHJhY3RLZXkkKSByZXR1cm4gdGFyZ2V0O1xuXHRcdGlmIChuYW1lID09IFwieFwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueCA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwieVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueSA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwielwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwid1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8udyA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiclwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uciA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZ1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uZyA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYlwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYSA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyAobmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IG51bGwpO1xuXHRcdGlmICh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG5ldyBQcm94eSh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIiA/IGdvdD8uYmluZD8uKHRhcmdldCkgOiBnb3QsIG5ldyBPYnNlcnZlQXJyYXlNZXRob2QobmFtZSwgdGFyZ2V0LCB0aGlzKSk7XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihwYXJzZUludChuYW1lKSkpIG5hbWUgPSBwYXJzZUludChuYW1lKSA/PyBuYW1lO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBwZW5kaW5nID0gaXNQcm9taXNlKHZhbHVlKTtcblx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IG9sZCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IHh5encgPSBbXG5cdFx0XHRcdFwieFwiLFxuXHRcdFx0XHRcInlcIixcblx0XHRcdFx0XCJ6XCIsXG5cdFx0XHRcdFwid1wiXG5cdFx0XHRdO1xuXHRcdFx0Y29uc3QgcmdiYSA9IFtcblx0XHRcdFx0XCJyXCIsXG5cdFx0XHRcdFwiZ1wiLFxuXHRcdFx0XHRcImJcIixcblx0XHRcdFx0XCJhXCJcblx0XHRcdF07XG5cdFx0XHRjb25zdCB4eXp3X2lkeCA9IHh5encuaW5kZXhPZihuYW1lKTtcblx0XHRcdGNvbnN0IHJnYmFfaWR4ID0gcmdiYS5pbmRleE9mKG5hbWUpO1xuXHRcdFx0bGV0IGdvdCA9IGZhbHNlO1xuXHRcdFx0aWYgKHh5endfaWR4ID49IDApIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgeHl6d19pZHgsIHYpO1xuXHRcdFx0ZWxzZSBpZiAocmdiYV9pZHggPj0gMCkgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCByZ2JhX2lkeCwgdik7XG5cdFx0XHRlbHNlIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdik7XG5cdFx0XHRpZiAobmFtZSA9PSBcImxlbmd0aFwiKSB7XG5cdFx0XHRcdGlmIChpc05vdEVxdWFsKG9sZCwgdikpIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlKHRoaXMsIHRhcmdldCwgb2xkLCB2KTtcblx0XHRcdH1cblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2xkLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnk/LmdldD8uKHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCB2LCBvbGQsIFwic2V0XCIpO1xuXHRcdFx0XHRpZiAocGVuZGluZykgZW1pdFJlc29sdmVkKHRhcmdldCwgbmFtZSwgdiwgb2xkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBnb3Q7XG5cdFx0fSk7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KG5hbWUpKSkgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBvbGQgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgZ290ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG5hbWUgIT0gXCJsZW5ndGhcIiAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAob2xkICE9IG51bGwpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbmFtZSwgb2xkLCBcImRlbGV0ZVwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxufTtcbnZhciBPYnNlcnZlT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIixcblx0XHRcdFwidGhlblwiLFxuXHRcdFx0XCJjYXRjaFwiLFxuXHRcdFx0XCJmaW5hbGx5XCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gcmVhbFByb3BPZiQxKHRhcmdldCkgPz8gXCJ2YWx1ZVwiKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4ga2V5ID09IFwidmFsdWVcIiB8fCBrZXkgPT0gcmVhbFByb3BPZiQxKHRhcmdldCkgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IHZvaWQgMCk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRyaWdnZXJWYWx1ZU9mKHRhcmdldCwga2V5KSk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gU3ltYm9sLnRvUHJpbWl0aXZlKSByZXR1cm4gKGhpbnQpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oaGludCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoZnQsIGhpbnQpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSwgaGludCk7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCwgaGludCk7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBTeW1ib2wudG9TdHJpbmdUYWcpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gU3RyaW5nKGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0cmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInRvU3RyaW5nXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvU3RyaW5nVGFnKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1N0cmluZ1RhZyk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIFN0cmluZyhmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZU9mXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvUHJpbWl0aXZlKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1ByaW1pdGl2ZSk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIGZ0O1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKTtcblx0XHRcdHJldHVybiBzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0O1xuXHRcdH07XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRyZXR1cm4gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuXHRcdGxldCBnb3QgPSB2b2lkIDA7XG5cdFx0dHJ5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG5cdFx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIGdvdCA9IHZvaWQgMDtcblx0XHRcdGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRnb3QgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodiwgbmFtZSk7XG5cdFx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCAkb3JpZ2luYWwgPSB0YXJnZXQ7XG5cdFx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAhKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIG5hbWUgaW4gdGFyZ2V0KSkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdHJpZ2dlck5hbWUgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gbmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA/PyBzYWZlR2V0KHRhcmdldCwgbmFtZSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0XHR0YXJnZXRbbmFtZV0gPSB2O1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdjtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdFx0Y29uc3Qgc3Vic2NyaXB0ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KCRvcmlnaW5hbCk7XG5cdFx0XHRcdGlmICgoc2FmZUdldCh0YXJnZXQsICRpc05vdEVxdWFsKSA/PyBpc05vdEVxdWFsKT8uKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHN1YnNjcmlwdD8udHJpZ2dlcj8uKHRyaWdnZXJOYW1lLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQoJG9yaWdpbmFsLCB0cmlnZ2VyTmFtZSwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSk7XG5cdH1cblx0ZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISFkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0aWYgKGRlc2NyaXB0b3IuZ2V0ID09IHZvaWQgMCAmJiBkZXNjcmlwdG9yLnNldCA9PSB2b2lkIDApIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgJHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG5cdFx0XHRnZXQ6IGRlc2NyaXB0b3IuZ2V0LFxuXHRcdFx0c2V0OiBkZXNjcmlwdG9yLnNldCxcblx0XHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA/PyB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA/PyB0cnVlXG5cdFx0fSk7XG5cdFx0c2FmZVNldCh0YXJnZXQsIG5hbWUsIG9sZFZhbHVlKTtcblx0XHRyZXR1cm4gJHJlc3VsdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIE9ic2VydmVNYXBIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHR0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgJGV4dHJhY3RLZXkkKSA/PyBzYWZlR2V0KHRhcmdldCwgJG9yaWdpbmFsS2V5JCkgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiB2YWx1ZU9yRng7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lO1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm47XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCAmJiAhaGFzT3duKG9wdGlvbnMsIFwidmFsdWVcIikpIHJldHVybjtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcImNsZWFyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8uZW50cmllcz8uKCkgfHwgW10pLCByZXN1bHQgPSB2YWx1ZU9yRngoKTtcblx0XHRcdG9sZFZhbHVlcy5mb3JFYWNoKChbcHJvcCwgb2xkVmFsdWVdKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZGVsZXRlXCIpIHJldHVybiAocHJvcCwgXyA9IG51bGwpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXMocHJvcCksIG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3ApO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInNldFwiKSByZXR1cm4gKHByb3AsIHZhbHVlKSA9PiBwb3RlbnRpYWxseUFzeW5jTWFwKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyhwcm9wKSwgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCwgdik7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRpZiAoIWhhZCB8fCBpc05vdEVxdWFsKG9sZFZhbHVlLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCB2LCBoYWQgPyBvbGRWYWx1ZSA6IG51bGwsIGhhZCA/IFwic2V0XCIgOiBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHByb3AsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0aWYgKG5hbWUgPT0gXCJnZXRPckluc2VydFwiIHx8IG5hbWUgPT0gXCJnZXRPckluc2VydENvbXB1dGVkXCIpIHtcblx0XHRcdGNvbnN0IGNvbXB1dGVkID0gbmFtZSA9PSBcImdldE9ySW5zZXJ0Q29tcHV0ZWRcIjtcblx0XHRcdHJldHVybiAoa2V5LCBkZWZhdWx0T3JDb21wdXRlKSA9PiB7XG5cdFx0XHRcdGlmICh0YXJnZXQuaGFzKGtleSkpIHJldHVybiB0YXJnZXQuZ2V0KGtleSk7XG5cdFx0XHRcdGNvbnN0IGluY29taW5nID0gY29tcHV0ZWQgPyB0eXBlb2YgZGVmYXVsdE9yQ29tcHV0ZSA9PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0T3JDb21wdXRlKGtleSkgOiBkZWZhdWx0T3JDb21wdXRlIDogZGVmYXVsdE9yQ29tcHV0ZTtcblx0XHRcdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmNNYXAoaW5jb21pbmcsICh2KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdHlwZW9mIHRhcmdldC5nZXRPckluc2VydCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQuZ2V0T3JJbnNlcnQoa2V5LCB2KSA6ICh0YXJnZXQuc2V0KGtleSwgdiksIHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0XHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4oa2V5LCB2LCBudWxsLCBcImFkZFwiKTtcblx0XHRcdFx0XHRcdGlmIChpc1Byb21pc2UoaW5jb21pbmcpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBrZXksIHYsIG51bGwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZU9yRng7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZVNldEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdID0gZmFsc2U7XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0dGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsICRleHRyYWN0S2V5JCkgPz8gc2FmZUdldCh0YXJnZXQsICRvcmlnaW5hbEtleSQpID8/IHRhcmdldDtcblx0XHRjb25zdCB2YWx1ZU9yRnggPSBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gdmFsdWVPckZ4O1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZTtcblx0XHRcdGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0YXJnZXQuaGFzKGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiY2xlYXJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlcyA9IEFycmF5LmZyb20odGFyZ2V0Py52YWx1ZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG5cdFx0XHRvbGRWYWx1ZXMuZm9yRWFjaCgob2xkVmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obnVsbCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJkZWxldGVcIikgcmV0dXJuICh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2YWx1ZSksIG9sZFZhbHVlID0gaGFkID8gdmFsdWUgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodmFsdWUpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHZhbHVlLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhZGRcIikgcmV0dXJuICh2YWx1ZSkgPT4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXModiksIG9sZFZhbHVlID0gaGFkID8gdiA6IG51bGwsIHJlc3VsdCA9IHZhbHVlT3JGeCh2KTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdGlmICghaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHYsIHYsIG9sZFZhbHVlLCBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHYsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciAkaXNPYnNlcnZhYmxlID0gKHRhcmdldCkgPT4ge1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSkpO1xufTtcbnZhciBvYnNlcnZlQXJyYXkgPSAoYXJyKSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKGFycikpIHJldHVybiBhcnI7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgoYXJyLCBuZXcgT2JzZXJ2ZUFycmF5SGFuZGxlcigpKSwgYXJyKTtcbn07XG52YXIgb2JzZXJ2ZU9iamVjdCA9IChvYmopID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUob2JqKSkgcmV0dXJuIG9iajtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChvYmosIG5ldyBPYnNlcnZlT2JqZWN0SGFuZGxlcigpKSwgb2JqKTtcbn07XG52YXIgb2JzZXJ2ZU1hcCA9IChtYXApID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUobWFwKSkgcmV0dXJuIG1hcDtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChtYXAsIG5ldyBPYnNlcnZlTWFwSGFuZGxlcigpKSwgbWFwKTtcbn07XG52YXIgb2JzZXJ2ZVNldCA9IChzZXQpID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUoc2V0KSkgcmV0dXJuIHNldDtcblx0cmV0dXJuIHdyYXBXaXRoKHNldCwgbmV3IE9ic2VydmVTZXRIYW5kbGVyKCkpO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvUHJpbWl0aXZlcy50c1xudmFyIG51bWJlclJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IGlzUHJvbWlzZSA/IDAgOiBOdW1iZXIoZGVyZWYoaW5pdGlhbCkgfHwgMCkgfHwgMCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCgodHlwZW9mIHRoaXM/LlskdmFsdWVdICE9IFwib2JqZWN0XCIgPyB0aGlzPy5bJHZhbHVlXSA6IHRoaXM/LlskdmFsdWVdPy52YWx1ZSB8fCAwKSA/PyAwLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4odikgPyBOdW1iZXIodikgOiB0aGlzWyR2YWx1ZV0pIHx8IDA7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gTnVtYmVyKHRoaXNbJHZhbHVlXSB8fCAwKSB8fCAwO1xuXHRcdH1cblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIHN0cmluZ1JlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBcIlwiIDogU3RyaW5nKGRlcmVmKHR5cGVvZiBpbml0aWFsID09IFwibnVtYmVyXCIgPyBTdHJpbmcoaW5pdGlhbCkgOiBpbml0aWFsIHx8IFwiXCIpKSkgPz8gXCJcIixcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSA/PyBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSBTdHJpbmcodHlwZW9mIHYgPT0gXCJudW1iZXJcIiA/IFN0cmluZyh2KSA6IHYgfHwgXCJcIikgPz8gXCJcIjtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpc1skdmFsdWVdID8/IFwiXCIpID8/IFwiXCI7XG5cdFx0fVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgYm9vbGVhblJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBmYWxzZSA6IChkZXJlZihpbml0aWFsKSAhPSBudWxsID8gdHlwZW9mIGRlcmVmKGluaXRpYWwpID09IFwic3RyaW5nXCIgPyB0cnVlIDogISFkZXJlZihpbml0aWFsKSA6IGZhbHNlKSB8fCBmYWxzZSkgfHwgZmFsc2UsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoISF0aGlzPy5bJHZhbHVlXSB8fCBmYWxzZSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gKHYgIT0gbnVsbCA/IHR5cGVvZiB2ID09IFwic3RyaW5nXCIgPyB0cnVlIDogISF2IDogdGhpc1skdmFsdWVdKSB8fCBmYWxzZTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gfHwgZmFsc2U7XG5cdFx0fVxuXHR9KTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgd3JhcFJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzLnZhbHVlLCBoaW50KTtcblx0XHR9LFxuXHRcdHZhbHVlOiBpc1Byb21pc2UgPyBudWxsIDogZGVyZWYoaW5pdGlhbClcblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZmZlY3RlZChpbml0aWFsLCAodikgPT4ge1xuXHRcdCRyPy5bJHRyaWdnZXJdPy4oKTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgbWFya1JlYWxQcm9wID0gKHRhcmdldCwgcmVhbFByb3ApID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGFyZ2V0ICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRhcmdldDtcblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCAkcmVhbFByb3AsIHtcblx0XHRcdHZhbHVlOiByZWFsUHJvcCxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0gY2F0Y2gge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXJnZXRbJHJlYWxQcm9wXSA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHR0cnkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIFwicmVhbFByb3BcIiwge1xuXHRcdFx0dmFsdWU6IHJlYWxQcm9wLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhcmdldC5yZWFsUHJvcCA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBwcm9wUmVmID0gKHNyYywgc3JjUHJvcCA9IFwidmFsdWVcIiwgaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKHNyYykgfHwgIXNyYykgcmV0dXJuIHNyYztcblx0aWYgKEFycmF5LmlzQXJyYXkoc3JjKSAmJiBzcmMubGVuZ3RoID09IDIgJiYgc3JjWzBdICE9IG51bGwgJiYgKHNyY1swXSBpbnN0YW5jZW9mIE1hcCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrTWFwIHx8IHNyY1swXSBpbnN0YW5jZW9mIFNldCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrU2V0KSkge1xuXHRcdGlmIChzcmNQcm9wID09IG51bGwgfHwgc3JjUHJvcCA9PT0gXCJ2YWx1ZVwiKSBzcmNQcm9wID0gc3JjWzFdO1xuXHRcdHNyYyA9IHNyY1swXTtcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNyYykgJiYgIWlzQXJyYXlJbnZhbGlkS2V5KHNyYz8uWzFdLCBzcmMpICYmIChBcnJheS5pc0FycmF5KHNyYz8uWzBdKSB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJmdW5jdGlvblwiKSkgc3JjID0gc3JjPy5bMF07XG5cdGNvbnN0IGlzTWFwID0gc3JjIGluc3RhbmNlb2YgTWFwIHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtNYXAgfHwgdHlwZW9mIHNyYz8uZ2V0ID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc3JjPy5zZXQgPT0gXCJmdW5jdGlvblwiICYmICh0eXBlb2Ygc3JjPy5kZWxldGUgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBzcmM/LnJlbW92ZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRjb25zdCBpc1NldCA9IHNyYyBpbnN0YW5jZW9mIFNldCB8fCBzcmMgaW5zdGFuY2VvZiBXZWFrU2V0IHx8IHR5cGVvZiBzcmM/LmhhcyA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNyYz8uYWRkID09IFwiZnVuY3Rpb25cIiAmJiAodHlwZW9mIHNyYz8uZGVsZXRlID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygc3JjPy5yZW1vdmUgPT0gXCJmdW5jdGlvblwiKTtcblx0aWYgKGlzTWFwIHx8IGlzU2V0KSB7XG5cdFx0aWYgKHNyY1Byb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHR9IGVsc2UgaWYgKChzcmNQcm9wID8/PSBBcnJheS5pc0FycmF5KHNyYykgPyBudWxsIDogXCJ2YWx1ZVwiKSA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KHNyY1Byb3AsIHNyYykpIHJldHVybjtcblx0Y29uc3QgcmVhZFNsb3QgPSAoKSA9PiB7XG5cdFx0aWYgKGlzTWFwKSByZXR1cm4gc3JjPy5nZXQ/LihzcmNQcm9wKTtcblx0XHRpZiAoaXNTZXQpIHJldHVybiBzcmM/Lmhhcz8uKHNyY1Byb3ApID8gc3JjUHJvcCA6IG51bGw7XG5cdFx0cmV0dXJuIHNyYz8uW3NyY1Byb3BdO1xuXHR9O1xuXHRjb25zdCB3cml0ZVNsb3QgPSAodikgPT4ge1xuXHRcdGlmIChpc01hcCkge1xuXHRcdFx0aWYgKHNyYz8uaGFzPy4oc3JjUHJvcCkgJiYgaXNOb3RFcXVhbCh2LCBzcmM/LmdldD8uKHNyY1Byb3ApKSkgc3JjPy5zZXQ/LihzcmNQcm9wLCB2KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH0gZWxzZSBpZiAoaXNTZXQpIHtcblx0XHRcdHYgPz89IHNyY1Byb3A7XG5cdFx0XHRpZiAoIXNyYz8uaGFzPy4odikgJiYgdiAhPSBudWxsKSB7XG5cdFx0XHRcdHNyYz8uYWRkPy4odik7XG5cdFx0XHRcdHJldHVybiB2O1xuXHRcdFx0fSBlbHNlIGlmIChzcmM/Lmhhcz8uKHYpKSB7XG5cdFx0XHRcdGlmICh2ID09IG51bGwpIHtcblx0XHRcdFx0XHRzcmM/LmRlbGV0ZT8uKHYpO1xuXHRcdFx0XHRcdHJldHVybiB2O1xuXHRcdFx0XHR9IGVsc2UgcmV0dXJuIHY7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzcmM/LltzcmNQcm9wXSAmJiBpc05vdEVxdWFsKHYsIHNyYz8uW3NyY1Byb3BdKSkgc3JjW3NyY1Byb3BdID0gdjtcblx0XHRyZXR1cm4gdjtcblx0fTtcblx0aWYgKGlzTWFwICYmIGluaXRpYWwgIT09IHZvaWQgMCAmJiAhc3JjPy5oYXM/LihzcmNQcm9wKSkgc3JjPy5zZXQ/LihzcmNQcm9wLCBpbml0aWFsKTtcblx0ZWxzZSBpZiAoaXNTZXQgJiYgaW5pdGlhbCAmJiAhc3JjPy5oYXM/LihzcmNQcm9wKSkgc3JjPy5hZGQ/LihzcmNQcm9wKTtcblx0Y29uc3QgY3VycmVudCA9IHJlYWRTbG90KCk7XG5cdGlmICghaXNTZXQgJiYgc3JjUHJvcCAhPSBudWxsICYmIGhhc1ZhbHVlKGN1cnJlbnQpICYmIGlzT2JzZXJ2YWJsZShjdXJyZW50KSkgcmV0dXJuIG1hcmtSZWFsUHJvcChyZWNvdmVyUmVhY3RpdmUoY3VycmVudCksIHNyY1Byb3ApO1xuXHRpZiAoIWlzTWFwICYmICFpc1NldCAmJiBzcmNQcm9wICYmIHR5cGVvZiBzcmM/LmdldFByb3BlcnR5ID09IFwiZnVuY3Rpb25cIiAmJiBpc09ic2VydmFibGUoc3JjPy5nZXRQcm9wZXJ0eT8uKHNyY1Byb3ApKSkgcmV0dXJuIG1hcmtSZWFsUHJvcChzcmM/LmdldFByb3BlcnR5Py4oc3JjUHJvcCksIHNyY1Byb3ApO1xuXHRpZiAoIWlzTWFwICYmICFpc1NldCkgc3JjW3NyY1Byb3BdID8/PSBpbml0aWFsID8/IHNyYz8uW3NyY1Byb3BdO1xuXHRlbHNlIGlmIChpc01hcCAmJiBpc05vdEVxdWFsKGluaXRpYWwgPz8gc3JjPy5nZXQ/LihzcmNQcm9wKSwgc3JjPy5nZXQ/LihzcmNQcm9wKSkpIHNyYz8uc2V0Py4oc3JjUHJvcCwgaW5pdGlhbCA/PyBzcmM/LmdldD8uKHNyY1Byb3ApKTtcblx0ZWxzZSBpZiAoaXNTZXQgJiYgc3JjPy5oYXM/Lihpbml0aWFsID8/IHNyY1Byb3ApKSBzcmM/LmFkZD8uKGluaXRpYWwgPz8gc3JjUHJvcCk7XG5cdGNvbnN0IHIgPSBvYnNlcnZlKHtcblx0XHRbJHZhbHVlXTogaXNTZXQgPyAhIXJlYWRTbG90KCkgOiByZWFkU2xvdCgpID8/IGluaXRpYWwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcocmVhZFNsb3QoKSA/PyB0aGlzWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQocmVhZFNsb3QoKSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0clskdHJpZ2dlckxvY2skMV0gPSB0cnVlO1xuXHRcdFx0aWYgKGlzU2V0KSB0aGlzWyR2YWx1ZV0gPSB3cml0ZVNsb3Qodik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc3QgbmV4dCA9IHYgPz8gZGVmYXVsdEJ5VHlwZShyZWFkU2xvdCgpKTtcblx0XHRcdFx0dGhpc1skdmFsdWVdID0gd3JpdGVTbG90KG5leHQpO1xuXHRcdFx0fVxuXHRcdFx0clskdHJpZ2dlckxvY2skMV0gPSBmYWxzZTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdGNvbnN0IHNsb3QgPSByZWFkU2xvdCgpO1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSA9IHNsb3QgPz8gdGhpc1skdmFsdWVdO1xuXHRcdH1cblx0fSk7XG5cdG1hcmtSZWFsUHJvcChyLCBzcmNQcm9wKTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoc3JjLCAodiwgX3Byb3AsIG9sZCwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChpc05vdEVxdWFsKF9wcm9wLCBzcmNQcm9wKSkge1xuXHRcdFx0aWYgKCFpc05vdEVxdWFsKHYsIHJlYWRTbG90KCkgPz8gb2xkKSkgd3JpdGVTbG90KHYpO1xuXHRcdH1cblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHIsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcjtcbn07XG52YXIgJHJlZiA9ICh0eXBlZCwgYmVoYXZpb3IpID0+IHtcblx0c3dpdGNoICh0eXBlb2YgdHlwZWQpIHtcblx0XHRjYXNlIFwiYm9vbGVhblwiOiByZXR1cm4gYm9vbGVhblJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJudW1iZXJcIjogcmV0dXJuIG51bWJlclJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJzdHJpbmdcIjogcmV0dXJuIHN0cmluZ1JlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJvYmplY3RcIjogaWYgKHR5cGVkICE9IG51bGwpIHJldHVybiB3cmFwUmVmKG9ic2VydmUodHlwZWQpLCBiZWhhdmlvcik7XG5cdFx0ZGVmYXVsdDogcmV0dXJuIHdyYXBSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0fVxufTtcbnZhciByZWYgPSAodHlwZWQsIHByb3AgPSBcInZhbHVlXCIsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0ICRyID0gaXNPYnNlcnZhYmxlKHR5cGVkKSA/IHR5cGVkIDogJHJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRpZiAocHJvcCAhPSBudWxsKSByZXR1cm4gcHJvcFJlZigkciwgcHJvcCwgYmVoYXZpb3IpO1xuXHRlbHNlIHJldHVybiAkcjtcbn07XG52YXIgcHJvbWlzZWQgPSAocHJvbWlzZSwgYmVoYXZpb3IpID0+IHtcblx0cmV0dXJuIHJlZihwcm9taXNlLCBiZWhhdmlvcik7XG59O1xudmFyIHRyaWdnZXJXaXRoRGVsYXkgPSAocmVmLCBjYiwgZGVsYXkgPSAxMDApID0+IHtcblx0aWYgKHJlZj8udmFsdWUgPz8gcmVmKSByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0aWYgKHJlZi52YWx1ZSkgY2I/LigpO1xuXHR9LCBkZWxheSk7XG59O1xudmFyIGRlbGF5ZWRCZWhhdmlvciA9IChkZWxheSA9IDEwMCkgPT4ge1xuXHRyZXR1cm4gKGNiLCBbdmFsXSwgW3NpZ10pID0+IHtcblx0XHRsZXQgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHZhbCwgY2IsIGRlbGF5KTtcblx0XHRzaWc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImFib3J0XCIsICgpID0+IHtcblx0XHRcdGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKTtcblx0XHR9LCB7IG9uY2U6IHRydWUgfSk7XG5cdH07XG59O1xudmFyIGRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciA9IChkZWxheSA9IDEwMCkgPT4ge1xuXHRyZXR1cm4gKGNiLCBbdmFsXSwgW3NpZ10pID0+IHtcblx0XHRsZXQgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHZhbCwgY2IsIGRlbGF5KTtcblx0XHRzaWc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImFib3J0XCIsICgpID0+IHtcblx0XHRcdGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKTtcblx0XHR9LCB7IG9uY2U6IHRydWUgfSk7XG5cdFx0aWYgKCF0bSkgY2I/LigpO1xuXHR9O1xufTtcbmZ1bmN0aW9uIG9ic2VydmUodGFyZ2V0LCBzdGF0ZU5hbWUpIHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJzeW1ib2xcIiB8fCAhKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgfHwgJGlzT2JzZXJ2YWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRpZiAoKHRhcmdldCA9IGRlcmVmPy4odGFyZ2V0KSkgPT0gbnVsbCB8fCB0YXJnZXQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHRhcmdldCBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgJGlzT2JzZXJ2YWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRjb25zdCB1bndyYXAgPSB0YXJnZXQ7XG5cdGlmICh1bndyYXAgPT0gbnVsbCB8fCB0eXBlb2YgdW53cmFwID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIpIHx8IHVud3JhcCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha1JlZikgcmV0dXJuIHVud3JhcDtcblx0bGV0IHJlYWN0aXZlID0gdW53cmFwO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh1bndyYXApKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlQXJyYXkodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodW53cmFwIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlTWFwKHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZVNldCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVPYmplY3QodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH1cblx0cmV0dXJuIHJlYWN0aXZlO1xufVxudmFyIGlzT2JzZXJ2YWJsZSA9ICh0YXJnZXQpID0+IHtcblx0aWYgKHR5cGVvZiBIVE1MSW5wdXRFbGVtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuIHRydWU7XG5cdHJldHVybiAhISgodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSAmJiB0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSB8fCB0YXJnZXQ/LlskYWZmZWN0ZWRdIHx8IHN1YnNjcmlwdFJlZ2lzdHJ5Py5oYXM/Lih0YXJnZXQpKSk7XG59O1xudmFyIHJlY292ZXJSZWFjdGl2ZSA9ICh0YXJnZXQpID0+IHtcblx0cmV0dXJuIGlzT2JzZXJ2YWJsZSh0YXJnZXQpID8gb2JzZXJ2ZSh0YXJnZXQpIDogbnVsbDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL01haW5saW5lLnRzXG52YXIgdXNlT2JzZXJ2YWJsZSA9ICh1bndyYXApID0+IHtcblx0aWYgKHVud3JhcCA9PSBudWxsIHx8IHR5cGVvZiB1bndyYXAgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdW53cmFwICE9IFwiZnVuY3Rpb25cIiB8fCB1bndyYXA/LltTeW1ib2wub2JzZXJ2YWJsZV0gIT0gbnVsbCkgcmV0dXJuIHVud3JhcDtcblx0dHJ5IHtcblx0XHR1bndyYXBbU3ltYm9sLm9ic2VydmFibGVdID0gc2VsZj8uY29tcGF0aWJsZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUud2FybihcIlVuYWJsZSB0byBhc3NpZ24gPFtTeW1ib2wub2JzZXJ2YWJsZV0+LCBvYmplY3Qgd2lsbCBub3Qgb2JzZXJ2YWJsZSBieSBvdGhlciBmcmFtZXdvcmtzXCIpO1xuXHR9XG5cdHVud3JhcFskYWZmZWN0ZWRdID0gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiB7XG5cdFx0Y29uc3Qgb2JzZXJ2YWJsZSA9IHVud3JhcD8uW1N5bWJvbD8ub2JzZXJ2YWJsZV07XG5cdFx0b2JzZXJ2YWJsZT8uKCk/LmFmZmVjdGVkPy4oY2IsIHByb3AsIG9wdGlvbnMpO1xuXHRcdHJldHVybiAoKSA9PiBvYnNlcnZhYmxlPy4oKT8udW5hZmZlY3RlZD8uKGNiLCBwcm9wKTtcblx0fTtcblx0cmV0dXJuIHVud3JhcDtcbn07XG52YXIgc3BlY2lhbGl6ZWRTdWJzY3JpYmUgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBjaGVja1ZhbGlkT2JqID0gKG9iaikgPT4ge1xuXHRpZiAodHlwZW9mIG9iaiA9PSBcInN5bWJvbFwiIHx8IG9iaiA9PSBudWxsIHx8ICEodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiKSkgcmV0dXJuO1xuXHRyZXR1cm4gb2JqO1xufTtcbnZhciBpbml0aWFsVHJpZ2dlciA9IFwiaW5pdGlhbFwiO1xudmFyIHJlYWxQcm9wT2YgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHByb3AgPSB0YXJnZXQ/LlskcmVhbFByb3BdID8/IHRhcmdldD8ucmVhbFByb3A7XG5cdHJldHVybiBpc0tleVR5cGUocHJvcCkgPyBwcm9wIDogbnVsbDtcbn07XG52YXIgbm9ybWFsaXplQWZmZWN0ZWRQcm9wID0gKHRhcmdldCwgcHJvcCkgPT4ge1xuXHRjb25zdCByZWFsUHJvcCA9IHJlYWxQcm9wT2YodGFyZ2V0KTtcblx0aWYgKHJlYWxQcm9wICE9IG51bGwgJiYgKHByb3AgPT0gbnVsbCB8fCBwcm9wID09IFwidmFsdWVcIikpIHJldHVybiByZWFsUHJvcDtcblx0cmV0dXJuIHByb3A7XG59O1xudmFyIHByb3BWYWx1ZU9mID0gKHRhcmdldCwgcHJvcCkgPT4ge1xuXHRpZiAocHJvcCAhPSBudWxsICYmIHByb3AgPT0gcmVhbFByb3BPZih0YXJnZXQpKSByZXR1cm4gdGFyZ2V0Py52YWx1ZTtcblx0cmV0dXJuIHRhcmdldD8uW3Byb3BdO1xufTtcbnZhciBjYWxsQnlQcm9wUmVmQXdhcmUgPSAodGFyZ2V0LCBwcm9wLCBjYiwgY3R4KSA9PiB7XG5cdGlmIChwcm9wICE9IG51bGwgJiYgcHJvcCA9PSByZWFsUHJvcE9mKHRhcmdldCkpIHtcblx0XHRjb25zdCB2YWx1ZSA9IHByb3BWYWx1ZU9mKHRhcmdldCwgcHJvcCk7XG5cdFx0aWYgKHZhbHVlICE9IG51bGwpIHJldHVybiBjYj8uKHZhbHVlLCBwcm9wLCBudWxsLCBcInNldFwiKTtcblx0fVxuXHRyZXR1cm4gY2FsbEJ5UHJvcCh0YXJnZXQsIHByb3AsIGNiLCBjdHgpO1xufTtcbnZhciB3aXRoVHJpZ2dlciA9IChjYiwgb3B0aW9ucywgdHJpZ2dlcikgPT4ge1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpO1xuXHRpZiAodHJpZ2dlciA9PSBpbml0aWFsVHJpZ2dlcikge1xuXHRcdGlmICghbm9ybWFsaXplZC50cmlnZ2VySW1tZWRpYXRlbHkpIHJldHVybjtcblx0fSBlbHNlIGlmICghdHJpZ2dlckZpbHRlckFsbG93cyhub3JtYWxpemVkLmFmZmVjdFR5cGVzLCB0cmlnZ2VyKSkgcmV0dXJuO1xuXHRyZXR1cm4gKHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgLi4uZXRjKSA9PiBjYj8uKHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgdHJpZ2dlciwgLi4uZXRjKTtcbn07XG52YXIgc3Vic2NyaWJlRGlyZWN0bHkgPSAodGFyZ2V0LCBwcm9wLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKCF0YXJnZXQpIHJldHVybjtcblx0aWYgKCFjaGVja1ZhbGlkT2JqKHRhcmdldCkpIHJldHVybjtcblx0Y29uc3QgdFByb3AgPSBwcm9wICE9IFN5bWJvbC5pdGVyYXRvciA/IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCh0YXJnZXQsIHByb3ApIDogbnVsbDtcblx0bGV0IHJlZ2lzdHJ5ID0gdGFyZ2V0Py5bJHJlZ2lzdHJ5S2V5JF0gPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdHRhcmdldCA9IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0O1xuXHRxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG5cdFx0Y29uc3QgaW5pdGlhbENiID0gd2l0aFRyaWdnZXIoY2IsIG9wdGlvbnMsIGluaXRpYWxUcmlnZ2VyKTtcblx0XHRpZiAoIWluaXRpYWxDYikgcmV0dXJuO1xuXHRcdGlmICh0UHJvcCAhPSBudWxsICYmIHRQcm9wICE9IFN5bWJvbC5pdGVyYXRvcikgY2FsbEJ5UHJvcFJlZkF3YXJlKHRhcmdldCwgdFByb3AsIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0ZWxzZSBjYWxsQnlBbGxQcm9wKHRhcmdldCwgaW5pdGlhbENiLCBudWxsKTtcblx0fSk7XG5cdGxldCB1blN1YiA9IHJlZ2lzdHJ5Py5hZmZlY3RlZD8uKGNiLCB0UHJvcCwgb3B0aW9ucyk7XG5cdGlmICh0YXJnZXQ/LltTeW1ib2wuZGlzcG9zZV0pIHJldHVybiB1blN1Yjtcblx0YWRkVG9DYWxsQ2hhaW4odW5TdWIsIFN5bWJvbC5kaXNwb3NlLCB1blN1Yik7XG5cdGFkZFRvQ2FsbENoYWluKHVuU3ViLCBTeW1ib2wuYXN5bmNEaXNwb3NlLCB1blN1Yik7XG5cdGFkZFRvQ2FsbENoYWluKHRhcmdldCwgU3ltYm9sLmRpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odGFyZ2V0LCBTeW1ib2wuYXN5bmNEaXNwb3NlLCB1blN1Yik7XG5cdHJldHVybiB1blN1Yjtcbn07XG52YXIgc3Vic2NyaWJlSW5wdXQgPSAodGcsIF8sIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKS5hZmZlY3RUeXBlcztcblx0Y29uc3QgJG9wdCA9IHt9O1xuXHRsZXQgb2xkVmFsdWUgPSB0Zz8udmFsdWU7XG5cdGNvbnN0ICRjYiA9IChldikgPT4ge1xuXHRcdGNvbnN0IHZhbHVlID0gZXY/LnRhcmdldD8udmFsdWU7XG5cdFx0aWYgKHRyaWdnZXJGaWx0ZXJBbGxvd3MoYWZmZWN0VHlwZXMsIFwic2V0XCIpKSBjYj8uKHZhbHVlLCBcInZhbHVlXCIsIG9sZFZhbHVlLCBcInNldFwiLCBldik7XG5cdFx0b2xkVmFsdWUgPSB2YWx1ZTtcblx0fTtcblx0dGc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImNoYW5nZVwiLCAkY2IsICRvcHQpO1xuXHRyZXR1cm4gKCkgPT4gdGc/LnJlbW92ZUV2ZW50TGlzdGVuZXI/LihcImNoYW5nZVwiLCAkY2IsICRvcHQpO1xufTtcbnZhciBjaGVja0lzUGFpcmVkID0gKHRnKSA9PiB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHRnKSAmJiB0Zz8ubGVuZ3RoID09IDIgJiYgY2hlY2tWYWxpZE9iaih0Zz8uWzBdKSAmJiAoaXNLZXlUeXBlKHRnPy5bMV0pIHx8IHRnPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKTtcbn07XG52YXIgaXNFZmZlY3RPcHRpb25zQXJnID0gKHZhbHVlKSA9PiB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAoXCJhZmZlY3RUeXBlc1wiIGluIHZhbHVlIHx8IFwidHJpZ2dlcnNcIiBpbiB2YWx1ZSB8fCBcInRyaWdnZXJJbW1lZGlhdGVseVwiIGluIHZhbHVlKTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0VGFyZ2V0cyA9ICh0YXJnZXRzKSA9PiB7XG5cdGlmICh0YXJnZXRzID09IG51bGwpIHJldHVybiBbXTtcblx0aWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0cykgJiYgIWNoZWNrSXNQYWlyZWQodGFyZ2V0cykgJiYgIWlzT2JzZXJ2YWJsZSh0YXJnZXRzKSkgcmV0dXJuIHRhcmdldHM7XG5cdHJldHVybiBbdGFyZ2V0c107XG59O1xudmFyIGVmZmVjdFRhcmdldENvbnRleHQgPSAoc291cmNlKSA9PiB7XG5cdGlmIChjaGVja0lzUGFpcmVkKHNvdXJjZSkpIHtcblx0XHRjb25zdCB0YXJnZXQgPSBzb3VyY2U/LlswXTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c291cmNlLFxuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0cHJvcDogbm9ybWFsaXplQWZmZWN0ZWRQcm9wKHRhcmdldCwgc291cmNlPy5bMV0pXG5cdFx0fTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdHNvdXJjZSxcblx0XHR0YXJnZXQ6IHNvdXJjZSxcblx0XHRwcm9wOiBudWxsXG5cdH07XG59O1xudmFyIHRvRWZmZWN0RXZlbnQgPSAoc291cmNlLCB0YXJnZXQsIHZhbHVlLCBwcm9wLCBvbGRWYWx1ZSwgdHJpZ2dlciwgYXJncykgPT4gKHtcblx0c291cmNlLFxuXHR0YXJnZXQsXG5cdHZhbHVlLFxuXHRwcm9wLFxuXHRuYW1lOiBwcm9wLFxuXHRvbGRWYWx1ZSxcblx0dHJpZ2dlcixcblx0YXJnc1xufSk7XG52YXIgc3Vic2NyaWJlUGFpcmVkID0gKHRnLCBfLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgcHJvcCA9IGlzS2V5VHlwZSh0Zz8uWzFdKSA/IHRnPy5bMV0gOiBudWxsO1xuXHRyZXR1cm4gYWZmZWN0ZWQodGc/LlswXSwgcHJvcCwgY2IsIG9wdGlvbnMpO1xufTtcbnZhciBzdWJzY3JpYmVUaGVuYWJsZSA9IChvYmosIHByb3AsIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRyZXR1cm4gb2JqPy50aGVuPy4oKG9iaikgPT4gYWZmZWN0ZWQ/LihvYmosIHByb3AsIGNiLCBvcHRpb25zKSk/LmNhdGNoPy4oKGUpID0+IHtcblx0XHRjb25zb2xlLndhcm4oZSk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH0pO1xufTtcbnZhciBhZmZlY3RlZCA9IChvYmosIHByb3AsIGNiID0gKCkgPT4ge30sIG9wdGlvbnMpID0+IHtcblx0aWYgKHR5cGVvZiBwcm9wID09IFwiZnVuY3Rpb25cIikge1xuXHRcdG9wdGlvbnMgPSBjYjtcblx0XHRjYiA9IHByb3A7XG5cdFx0cHJvcCA9IG51bGw7XG5cdH0gZWxzZSBwcm9wID0gbm9ybWFsaXplQWZmZWN0ZWRQcm9wKG9iaiwgcHJvcCk7XG5cdGlmICh0eXBlb2YgY2IgPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KGNiKSkge1xuXHRcdG9wdGlvbnMgPSBjYjtcblx0XHRjYiA9ICgpID0+IHt9O1xuXHR9XG5cdGlmIChpc1ByaW1pdGl2ZShvYmopIHx8IHR5cGVvZiBvYmogPT0gXCJzeW1ib2xcIikge1xuXHRcdGlmIChub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucykudHJpZ2dlckltbWVkaWF0ZWx5KSByZXR1cm4gUHJvbWlzZWQoZ2xvYmFsVGhpcz8uUHJvbWlzZT8udHJ5Py4oKCkgPT4ge1xuXHRcdFx0cmV0dXJuIGNiPy4ob2JqLCBudWxsLCBudWxsLCBudWxsLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0fSkpO1xuXHR9XG5cdGlmICh0eXBlb2Ygb2JqPy5bJGFmZmVjdGVkXSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBvYmo/LlskYWZmZWN0ZWRdPy4oY2IsIHByb3AsIG9wdGlvbnMpO1xuXHRlbHNlIGlmIChjaGVja1ZhbGlkT2JqKG9iaikpIHtcblx0XHRjb25zdCB3cmFwcGVkID0gb2JqO1xuXHRcdGlmIChzcGVjaWFsaXplZFN1YnNjcmliZT8uaGFzPy4ob2JqID0gb2JqPy5bJGV4dHJhY3RLZXkkXSA/PyBvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldD8uKG9iaik/Lih3cmFwcGVkLCBwcm9wLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKGlzT2JzZXJ2YWJsZSh3cmFwcGVkKSB8fCBjaGVja0lzUGFpcmVkKG9iaikgJiYgaXNPYnNlcnZhYmxlKG9iaj8uWzBdKSkge1xuXHRcdFx0aWYgKGlzVGhlbmFibGUob2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlVGhlbmFibGUpPy4ob2JqLCBwcm9wLCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIGlmIChjaGVja0lzUGFpcmVkKG9iaikpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZVBhaXJlZCk/LihvYmosIHByb3AsIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBIVE1MSW5wdXRFbGVtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgb2JqIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlSW5wdXQpPy4ob2JqLCBwcm9wLCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZURpcmVjdGx5KT8uKHdyYXBwZWQsIHByb3AsIGNiLCBvcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgaW5pdGlhbENiID0gd2l0aFRyaWdnZXIoY2IsIG9wdGlvbnMsIGluaXRpYWxUcmlnZ2VyKTtcblx0XHRcdGlmICghaW5pdGlhbENiKSByZXR1cm47XG5cdFx0XHRyZXR1cm4gUHJvbWlzZWQoZ2xvYmFsVGhpcz8uUHJvbWlzZT8udHJ5Py4oKCkgPT4ge1xuXHRcdFx0XHRpZiAoY2hlY2tJc1BhaXJlZChvYmopKSByZXR1cm4gY2FsbEJ5UHJvcFJlZkF3YXJlPy4ob2JqPy5bMF0sIG9iaj8uWzFdLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0XHRlbHNlIGlmIChwcm9wICE9IG51bGwgJiYgcHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBjYWxsQnlQcm9wUmVmQXdhcmU/LihvYmosIHByb3AsIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgcmV0dXJuIGNhbGxCeUFsbFByb3A/LihvYmosIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHR9XG59O1xuZnVuY3Rpb24gZWZmZWN0KGNiLCB0YXJnZXRzLCBvcHRpb25zKSB7XG5cdGlmIChjYiA9PSBudWxsIHx8IHR5cGVvZiBjYiAhPSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0aWYgKGlzRWZmZWN0T3B0aW9uc0FyZyh0YXJnZXRzKSAmJiBvcHRpb25zID09PSB2b2lkIDApIHJldHVybiBlZmZlY3RHbG9iYWxseShjYiwgdGFyZ2V0cyk7XG5cdGlmICh0YXJnZXRzID09IG51bGwpIHJldHVybiBlZmZlY3RHbG9iYWxseShjYiwgb3B0aW9ucyk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVFZmZlY3RPcHRpb25zKG9wdGlvbnMpO1xuXHRjb25zdCBhZmZlY3RlZE9wdGlvbnMgPSB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZWQuYWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBub3JtYWxpemVkLnRyaWdnZXJJbW1lZGlhdGVseVxuXHR9O1xuXHRjb25zdCBkaXNwb3NlcnMgPSBub3JtYWxpemVFZmZlY3RUYXJnZXRzKHRhcmdldHMpLm1hcCgoc291cmNlKSA9PiB7XG5cdFx0Y29uc3QgY3R4ID0gZWZmZWN0VGFyZ2V0Q29udGV4dChzb3VyY2UpO1xuXHRcdHJldHVybiBhZmZlY3RlZChjdHgudGFyZ2V0LCBjdHgucHJvcCwgKHZhbHVlLCBwcm9wLCBvbGRWYWx1ZSwgdHJpZ2dlciwgLi4uYXJncykgPT4ge1xuXHRcdFx0cmV0dXJuIGNiKHRvRWZmZWN0RXZlbnQoY3R4LnNvdXJjZSwgY3R4LnRhcmdldCwgdmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyID8/IG51bGwsIGFyZ3MpKTtcblx0XHR9LCBhZmZlY3RlZE9wdGlvbnMpO1xuXHR9KS5maWx0ZXIoKGRpc3Bvc2UpID0+IHR5cGVvZiBkaXNwb3NlID09IFwiZnVuY3Rpb25cIik7XG5cdHJldHVybiAoKSA9PiBkaXNwb3NlcnMuZm9yRWFjaCgoZGlzcG9zZSkgPT4gZGlzcG9zZT8uKCkpO1xufVxuZnVuY3Rpb24gZWZmZWN0ZWQodGFyZ2V0cywgY2IsIG9wdGlvbnMpIHtcblx0cmV0dXJuIGVmZmVjdChjYiwgdGFyZ2V0cywgb3B0aW9ucyk7XG59XG52YXIgbWFrZUFycmF5T2JzZXJ2YWJsZSA9ICh0ZykgPT4ge1xuXHRpZiAodGcgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBvYnNlcnZhYmxlQnlTZXQodGcpO1xuXHRpZiAodGcgaW5zdGFuY2VvZiBNYXApIHJldHVybiBvYnNlcnZhYmxlQnlNYXAodGcpO1xuXHRyZXR1cm4gdGc7XG59O1xudmFyIERvdWJsZVdlYWtNYXAgPSBjbGFzcyB7XG5cdCN0b3AgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0I2Vuc3VyZUlubmVyKGtleTEpIHtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBudWxsO1xuXHRcdGxldCBpbm5lciA9IHRoaXMuI3RvcC5nZXQoa2V5MSk7XG5cdFx0aWYgKCFpbm5lcikge1xuXHRcdFx0aW5uZXIgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0XHRcdHRoaXMuI3RvcC5zZXQoa2V5MSwgaW5uZXIpO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5uZXI7XG5cdH1cblx0I3NwbGl0UGFpcihwYWlyKSB7XG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHBhaXIpIHx8IHBhaXIubGVuZ3RoICE9PSAyKSByZXR1cm4gW251bGwsIG51bGxdO1xuXHRcdHJldHVybiBwYWlyO1xuXHR9XG5cdGhhc0wxKGtleTEpIHtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmhhcyhrZXkxKTtcblx0fVxuXHRzZXQocGFpciwgdmFsdWUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdGhpcztcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdGdldChwYWlyKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHZvaWQgMDtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmdldChrZXkxKT8uZ2V0KGtleTIpO1xuXHR9XG5cdGhhcyhwYWlyKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZ2V0KGtleTEpPy5oYXMoa2V5MikgPz8gZmFsc2U7XG5cdH1cblx0ZGVsZXRlKHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiN0b3AuZ2V0KGtleTEpO1xuXHRcdHJldHVybiBpbm5lciA/IGlubmVyLmRlbGV0ZShrZXkyKSA6IGZhbHNlO1xuXHR9XG5cdGRlbGV0ZVRvcChrZXkxKSB7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5kZWxldGUoa2V5MSk7XG5cdH1cblx0Z2V0T3JDcmVhdGUocGFpciwgZmFjdG9yeSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWN0b3J5Py4oKTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGNvbnN0IHZhbHVlID0gZmFjdG9yeSgpO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cdGdldE9ySW5zZXJ0KHBhaXIsIHZhbHVlKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHZhbHVlO1xuXHRcdGlmIChpbm5lci5oYXMoa2V5MikpIHJldHVybiBpbm5lci5nZXQoa2V5Mik7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblx0Z2V0T3JJbnNlcnRDb21wdXRlZChwYWlyLCBjb21wdXRlKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbXB1dGU/Lihba2V5MSwga2V5Ml0pO1xuXHRcdGlmIChpbm5lci5oYXMoa2V5MikpIHJldHVybiBpbm5lci5nZXQoa2V5Mik7XG5cdFx0Y29uc3QgdmFsdWUgPSBjb21wdXRlKFtrZXkxLCBrZXkyXSk7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cbn07XG52YXIgcmVnaXN0ZXJlZEl0ZXJhdGVkID0gbmV3IERvdWJsZVdlYWtNYXAoKTtcbmZ1bmN0aW9uIGl0ZXJhdGVkKHRnLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pIHtcblx0aWYgKCF0ZykgcmV0dXJuO1xuXHRpZiAodHlwZW9mIHRnICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiB0ZyAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGlmIChyZWdpc3RlcmVkSXRlcmF0ZWQuaGFzKFt0ZywgY2JdKSkgcmV0dXJuIHJlZ2lzdGVyZWRJdGVyYXRlZC5nZXQoW3RnLCBjYl0pO1xuXHRjb25zdCAkc3ViID0gKHZhbHVlLCBuYW1lLCBvbGQsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAobmFtZSA9PSBcInZhbHVlXCIpIHtcblx0XHRcdGNvbnN0IGVudHJpZXMgPSAob2xkPy52YWx1ZSA/PyBvbGQpPy5lbnRyaWVzPy4oKTtcblx0XHRcdGNvbnN0IGJhc2lzID0gdGc/LnZhbHVlID8/IHZhbHVlPy52YWx1ZSA/PyB2YWx1ZTtcblx0XHRcdGlmIChlbnRyaWVzKSBmb3IgKGNvbnN0IFtpZHgsIGl0ZW1dIG9mIGVudHJpZXMpIHtcblx0XHRcdFx0Y29uc3Qgb2ZPbGQgPSBpdGVtID8/IChvbGQ/LnZhbHVlID8/IG9sZCk/LltpZHhdID8/IG51bGw7XG5cdFx0XHRcdGNvbnN0IG9mTmV3ID0gYmFzaXM/LltpZHhdO1xuXHRcdFx0XHRpZiAob2ZPbGQgPT0gbnVsbCAmJiBvZk5ldyAhPSBudWxsKSBjYihvZk5ldywgaWR4LCBudWxsLCBcImFkZFwiKTtcblx0XHRcdFx0ZWxzZSBpZiAob2ZPbGQgIT0gbnVsbCAmJiBvZk5ldyA9PSBudWxsKSBjYihudWxsLCBpZHgsIG9mT2xkLCBcImRlbGV0ZVwiKTtcblx0XHRcdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChvZk9sZCwgb2ZOZXcpKSBjYihvZk5ldywgaWR4LCBvZk9sZCwgXCJzZXRcIik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaXRlcmF0ZWQodmFsdWUgPz8gdGc/LnZhbHVlLCBjYiwgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdHJldHVybiBuYW1lID09IG51bGwgPyB2b2lkIDAgOiB0Z1tuYW1lXTtcblx0fTtcblx0cmV0dXJuIHJlZ2lzdGVyZWRJdGVyYXRlZC5nZXRPckluc2VydENvbXB1dGVkKFt0ZywgY2JdLCAoKSA9PiB7XG5cdFx0aWYgKHRnIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gYWZmZWN0ZWQoW29ic2VydmFibGVCeVNldCh0ZyksIFN5bWJvbC5pdGVyYXRvcl0sIGNiLCBvcHRpb25zKTtcblx0XHRpZiAodGcgaW5zdGFuY2VvZiBNYXApIHJldHVybiBhZmZlY3RlZCh0ZywgY2IsIG9wdGlvbnMpO1xuXHRcdGlmIChoYXNWYWx1ZSh0ZykpIHJldHVybiBhZmZlY3RlZCh0ZywgJHN1Yiwgb3B0aW9ucyk7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodGcpICYmICEodGc/Lmxlbmd0aCA9PSAyICYmIGlzS2V5VHlwZSh0Zz8uWzFdKSAmJiBpc09ic2VydmFibGUodGc/LlswXSkpKSByZXR1cm4gYWZmZWN0ZWQoW3RnLCBTeW1ib2wuaXRlcmF0b3JdLCBjYiwgb3B0aW9ucyk7XG5cdFx0cmV0dXJuIGFmZmVjdGVkKHRnLCBjYiwgb3B0aW9ucyk7XG5cdH0pO1xufVxuZnVuY3Rpb24gdW5hZmZlY3RlZCh0ZywgY2IpIHtcblx0cmV0dXJuIHdpdGhQcm9taXNlKHRnLCAodGFyZ2V0KSA9PiB7XG5cdFx0Y29uc3QgaXNQYWlyID0gQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmIHRhcmdldD8ubGVuZ3RoID09IDIgJiYgW1wib2JqZWN0XCIsIFwiZnVuY3Rpb25cIl0uaW5kZXhPZih0eXBlb2YgdGFyZ2V0Py5bMF0pID49IDAgJiYgaXNLZXlUeXBlKHRhcmdldD8uWzFdKTtcblx0XHRjb25zdCBwcm9wID0gaXNQYWlyID8gdGFyZ2V0Py5bMV0gOiBudWxsO1xuXHRcdHRhcmdldCA9IGlzUGFpciAmJiBwcm9wICE9IG51bGwgPyB0YXJnZXQ/LlswXSA/PyB0YXJnZXQgOiB0YXJnZXQ7XG5cdFx0Y29uc3QgdW53cmFwID0gdHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiID8gdGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSA/PyB0YXJnZXQgOiB0YXJnZXQ7XG5cdFx0KHRhcmdldD8uWyRyZWdpc3RyeUtleSRdID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh1bndyYXApKT8udW5hZmZlY3RlZD8uKGNiLCBwcm9wKTtcblx0fSk7XG59XG52YXIgYmluZEJ5ID0gKHRhcmdldCwgcmVhY3RpdmUsIHdhdGNoKSA9PiB7XG5cdGFmZmVjdGVkKHJlYWN0aXZlLCBudWxsLCAodiwgcCkgPT4ge1xuXHRcdG9iamVjdEFzc2lnbih0YXJnZXQsIHYsIHAsIHRydWUpO1xuXHR9KTtcblx0d2F0Y2g/LigoKSA9PiB0YXJnZXQsIChOKSA9PiB7XG5cdFx0Zm9yIChjb25zdCBrIGluIE4pIG9iamVjdEFzc2lnbihyZWFjdGl2ZSwgTltrXSwgaywgdHJ1ZSk7XG5cdH0sIHsgZGVlcDogdHJ1ZSB9KTtcblx0cmV0dXJuIHRhcmdldDtcbn07XG52YXIgZGVyaXZhdGUgPSAoZnJvbSwgcmVhY3RGbiwgd2F0Y2gpID0+IGJpbmRCeShyZWFjdEZuKHNhZmUoZnJvbSkpLCBmcm9tLCB3YXRjaCk7XG52YXIgYmluZEJ5S2V5ID0gKHRhcmdldCwgcmVhY3RpdmUsIGtleSA9ICgpID0+IFwiXCIpID0+IGFmZmVjdGVkKHJlYWN0aXZlLCBudWxsLCAodmFsdWUsIHApID0+IHtcblx0aWYgKHAgPT0ga2V5KCkpIG9iamVjdEFzc2lnbih0YXJnZXQsIHZhbHVlLCBudWxsLCB0cnVlKTtcbn0pO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9Bc3NpZ25lZC50c1xudmFyIGNvbmRpdGlvbmFsSW5kZXggPSAoY29uZExpc3QgPSBbXSkgPT4ge1xuXHRjb25zdCBzb3VyY2UgPSBvYnNlcnZlKHsgdmFsdWU6IDAgfSk7XG5cdGNvbnN0IHJlYWRDb25kaXRpb24gPSAoY29uZGl0aW9uKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBjb25kaXRpb24gPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY29uZGl0aW9uKCk7XG5cdFx0cmV0dXJuIGhhc1ZhbHVlKGNvbmRpdGlvbikgPyBjb25kaXRpb24udmFsdWUgOiBjb25kaXRpb247XG5cdH07XG5cdGNvbnN0IGV2YWx1YXRlID0gKCkgPT4gY29uZExpc3QuZmluZEluZGV4KChjb25kaXRpb24pID0+ICEhcmVhZENvbmRpdGlvbihjb25kaXRpb24pKTtcblx0Y29uc3QgcmVzdWx0ID0gY29tcHV0ZWQoW3NvdXJjZSwgXCJ2YWx1ZVwiXSwgZXZhbHVhdGUsIFwidmFsdWVcIik7XG5cdGNvbnN0IGludmFsaWRhdGUgPSAoKSA9PiB7XG5cdFx0c291cmNlLnZhbHVlKys7XG5cdH07XG5cdGNvbnN0IGRpc3Bvc2VycyA9IFtdO1xuXHRpZiAoaXNPYnNlcnZhYmxlKGNvbmRMaXN0KSkgZGlzcG9zZXJzLnB1c2goYWZmZWN0ZWQoY29uZExpc3QsIGludmFsaWRhdGUsIHtcblx0XHRhZmZlY3RUeXBlczogW1xuXHRcdFx0XCJhZGRcIixcblx0XHRcdFwic2V0XCIsXG5cdFx0XHRcImRlbGV0ZVwiXG5cdFx0XSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IGZhbHNlXG5cdH0pKTtcblx0Zm9yIChjb25zdCBjb25kaXRpb24gb2YgY29uZExpc3QpIGlmIChoYXNWYWx1ZShjb25kaXRpb24pKSBkaXNwb3NlcnMucHVzaChhZmZlY3RlZChbY29uZGl0aW9uLCBcInZhbHVlXCJdLCBpbnZhbGlkYXRlLCB7XG5cdFx0YWZmZWN0VHlwZXM6IFtcInNldHRlclwiXSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IGZhbHNlXG5cdH0pKTtcblx0YWRkVG9DYWxsQ2hhaW4ocmVzdWx0LCBTeW1ib2wuZGlzcG9zZSwgKCkgPT4gZGlzcG9zZXJzLmZvckVhY2goKGRpc3Bvc2UpID0+IGRpc3Bvc2U/LigpKSk7XG5cdHJldHVybiByZXN1bHQ7XG59O1xudmFyIGNvbmRpdGlvbmFsUmVmID0gKGNvbmQsIGlmVHJ1ZSwgaWZGYWxzZSwgYmVoYXZpb3IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKGNvbmQpKSByZXR1cm4gY29uZCA/IGlmVHJ1ZSA6IGlmRmFsc2U7XG5cdGNvbnN0IGdldFRydWUgPSAoKSA9PiB7XG5cdFx0cmV0dXJuIGlmVHJ1ZTtcblx0fTtcblx0Y29uc3QgZ2V0RmFsc2UgPSAoKSA9PiB7XG5cdFx0cmV0dXJuIGlmRmFsc2U7XG5cdH07XG5cdGNvbnN0IHZhbHVlT2YgPSAobikgPT4ge1xuXHRcdGlmIChuICE9IG51bGwpIGNvbmQudmFsdWUgPSBoYXNWYWx1ZShuKSA/IG4/LnZhbHVlIDogbjtcblx0XHRyZXR1cm4gKGhhc1ZhbHVlKGNvbmQpID8gY29uZD8udmFsdWUgOiBjb25kKSA/IGdldFRydWUoKSA6IGdldEZhbHNlKCk7XG5cdH07XG5cdGNvbnN0IHIgPSBvYnNlcnZlKHtcblx0XHRbJHZhbHVlXTogdmFsdWVPZigpLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQodmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gdmFsdWVPZih2KTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gPSB2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdO1xuXHRcdH1cblx0fSk7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKFtjb25kLCBcInZhbHVlXCJdLCAoKSA9PiB7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSByPy5bJHZhbHVlXTtcblx0XHRjb25zdCB2YWx1ZSA9IHZhbHVlT2YoKTtcblx0XHRyWyR2YWx1ZV0gPSB2YWx1ZTtcblx0XHRyPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcjogXCJtYW51YWxcIlxuXHRcdH0pO1xuXHR9KTtcblx0YWRkVG9DYWxsQ2hhaW4ociwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiByO1xufTtcbnZhciBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsUmVmO1xudmFyIHJlbWFwID0gKHN1YiwgY2IsIGRlc3QpID0+IHtcblx0aWYgKCFkZXN0KSBkZXN0ID0gb2JzZXJ2ZSh7fSk7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKHN1YiwgKHZhbHVlLCBwcm9wLCBvbGQpID0+IHtcblx0XHRpZiAocHJvcCA9PSBudWxsKSByZXR1cm47XG5cdFx0Y29uc3QgZ290ID0gY2I/Lih2YWx1ZSwgcHJvcCwgb2xkKTtcblx0XHRpZiAodHlwZW9mIGdvdCA9PSBcIm9iamVjdFwiKSBvYmplY3RBc3NpZ25Ob3RFcXVhbChkZXN0LCBnb3QpO1xuXHRcdGVsc2UgaWYgKGlzTm90RXF1YWwoZGVzdFtwcm9wXSwgZ290KSkgZGVzdFtwcm9wXSA9IGdvdDtcblx0fSk7XG5cdGlmIChkZXN0KSBhZGRUb0NhbGxDaGFpbihkZXN0LCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIGRlc3Q7XG59O1xudmFyIHVuaWZpZWQgPSAoLi4uc3VicykgPT4ge1xuXHRjb25zdCBkZXN0ID0gb2JzZXJ2ZSh7fSk7XG5cdHN1YnM/LmZvckVhY2g/Ligoc3ViKSA9PiBhZmZlY3RlZChzdWIsICh2YWx1ZSwgcHJvcCwgXykgPT4ge1xuXHRcdGlmIChwcm9wID09IG51bGwpIHJldHVybjtcblx0XHRpZiAoaXNOb3RFcXVhbChkZXN0W3Byb3BdLCB2YWx1ZSkpIGRlc3RbcHJvcF0gPSB2YWx1ZTtcblx0fSkpO1xuXHRyZXR1cm4gZGVzdDtcbn07XG52YXIgb2JzZXJ2YWJsZUJ5U2V0ID0gKHNldCkgPT4ge1xuXHRjb25zdCBvYnMgPSBvYnNlcnZlKFtdKTtcblx0b2JzLnB1c2goLi4uQXJyYXkuZnJvbShzZXQ/LnZhbHVlcz8uKCkgfHwgW10pKTtcblx0YWRkVG9DYWxsQ2hhaW4ob2JzLCBTeW1ib2wuZGlzcG9zZSwgYWZmZWN0ZWQoc2V0LCAodmFsdWUsIF8sIG9sZCkgPT4ge1xuXHRcdGlmIChpc05vdEVxdWFsKHZhbHVlLCBvbGQpKSB7XG5cdFx0XHRpZiAob2xkID09IG51bGwgJiYgdmFsdWUgIT0gbnVsbCkgb2JzLnB1c2godmFsdWUpO1xuXHRcdFx0ZWxzZSBpZiAob2xkICE9IG51bGwgJiYgdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRjb25zdCBpZHggPSBvYnMuaW5kZXhPZihvbGQpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDApIG9icy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGlkeCA9IG9icy5pbmRleE9mKG9sZCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCAmJiBpc05vdEVxdWFsKG9ic1tpZHhdLCB2YWx1ZSkpIG9ic1tpZHhdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KSk7XG5cdHJldHVybiBvYnM7XG59O1xudmFyIG9ic2VydmFibGVCeU1hcCA9IChtYXApID0+IHtcblx0Y29uc3Qgb2JzID0gb2JzZXJ2ZShbXSk7XG5cdGNvbnN0IGluaXRpYWxFbnRyaWVzID0gQXJyYXkuZnJvbShtYXAuZW50cmllcygpKTtcblx0b2JzLnB1c2goLi4uaW5pdGlhbEVudHJpZXMpO1xuXHRhZGRUb0NhbGxDaGFpbihvYnMsIFN5bWJvbC5kaXNwb3NlLCBhZmZlY3RlZChtYXAsICh2YWx1ZSwgcHJvcCwgb2xkKSA9PiB7XG5cdFx0aWYgKGlzTm90RXF1YWwodmFsdWUsIG9sZCkgfHwgb2xkID09IG51bGwgJiYgdmFsdWUgIT0gbnVsbCB8fCBvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRpZiAob2xkICE9IG51bGwgJiYgdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRsZXQgaWR4ID0gb2JzLmZpbmRJbmRleCgoW25hbWUsIF9dKSA9PiBuYW1lID09IHByb3ApO1xuXHRcdFx0XHRpZiAoaWR4IDwgMCkgaWR4ID0gb2JzLmZpbmRMYXN0SW5kZXgoKFtfLCB2YWxdKSA9PiBvbGQgPT09IHZhbCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCkgb2JzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGlkeCA9IG9icy5maW5kSW5kZXgoKFtuYW1lLCBfXSkgPT4gbmFtZSA9PSBwcm9wKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwICYmIGlkeCA8IG9icy5sZW5ndGgpIHtcblx0XHRcdFx0XHRpZiAoaXNOb3RFcXVhbChvYnNbaWR4XT8uWzFdLCB2YWx1ZSkpIG9ic1tpZHhdID0gW3Byb3AsIHZhbHVlXTtcblx0XHRcdFx0fSBlbHNlIG9icy5wdXNoKFtwcm9wLCB2YWx1ZV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkpO1xuXHRyZXR1cm4gb2JzO1xufTtcbnZhciBhc3NpZ25NYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBhc3NpZ24gPSAoYSwgYiwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRjb25zdCBpc0FDb21wdXRlID0gdHlwZW9mIGE/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgYT8ubGVuZ3RoID09IDIsIGlzQkNvbXB1dGUgPSB0eXBlb2YgYj8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBiPy5sZW5ndGggPT0gMiwgY21wQkZuYyA9IGlzQkNvbXB1dGUgPyBiPy5bMV0gOiBudWxsO1xuXHRjb25zdCBpc0FQcm9wID0gKGlzS2V5VHlwZShhPy5bMV0pIHx8IGE/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpICYmIGE/Lmxlbmd0aCA9PSAyO1xuXHRsZXQgYV9wcm9wID0gaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSA/IGE/LlsxXSA6IEFycmF5LmlzQXJyYXkoYSkgPyBudWxsIDogcHJvcDtcblx0aWYgKCFpc0FQcm9wICYmICFpc0FDb21wdXRlKSBhID0gW2EsIGFfcHJvcF07XG5cdGlmIChpc0FDb21wdXRlKSBhWzFdID0gYV9wcm9wO1xuXHRjb25zdCBpc0JQcm9wID0gKGlzS2V5VHlwZShiPy5bMV0pIHx8IGI/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpICYmIGI/Lmxlbmd0aCA9PSAyO1xuXHRsZXQgYl9wcm9wID0gaXNCUHJvcCAmJiAhaXNCQ29tcHV0ZSA/IGI/LlsxXSA6IEFycmF5LmlzQXJyYXkoYikgPyBudWxsIDogcHJvcDtcblx0aWYgKCFpc0JQcm9wICYmICFpc0JDb21wdXRlKSBiID0gW2IsIGJfcHJvcF07XG5cdGlmIChpc0JDb21wdXRlKSBiWzFdID0gYl9wcm9wO1xuXHRpZiAoYV9wcm9wID09IG51bGwgfHwgYl9wcm9wID09IG51bGwgfHwgaXNBcnJheUludmFsaWRLZXkoYV9wcm9wLCBhPy5bMF0pIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGJfcHJvcCwgYj8uWzBdKSkgcmV0dXJuO1xuXHRpZiAoISgodHlwZW9mIGI/LlswXSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBiPy5bMF0gPT0gXCJmdW5jdGlvblwiKSAmJiBiPy5bMF0gIT0gbnVsbCkgJiYgIUFycmF5LmlzQXJyYXkoYVswXSkpIHtcblx0XHQkYXZvaWRUcmlnZ2VyKGIsICgpID0+IHtcblx0XHRcdGFbMF1bYV9wcm9wXSA9IGI/LlswXTtcblx0XHR9KTtcblx0XHRyZXR1cm4gKCkgPT4ge307XG5cdH1cblx0Y29uc3QgY29tcHV0ZSA9ICh2LCBwKSA9PiB7XG5cdFx0Y29uc3QgYV90bXAgPSBhUmVmPy5kZXJlZj8uKCk7XG5cdFx0Y29uc3QgYl90bXAgPSBiUmVmPy5kZXJlZj8uKCk7XG5cdFx0aWYgKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5nZXQ/LihhX3Byb3ApPy5ib3VuZCA9PSBiX3RtcCkge1xuXHRcdFx0bGV0IHZhbCA9IG51bGw7XG5cdFx0XHRjb25zdCBjbXBmeCA9IGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5nZXQ/LihhX3Byb3ApPy5jbXBmeDtcblx0XHRcdCRhdm9pZFRyaWdnZXIoYl90bXAsICgpID0+IHtcblx0XHRcdFx0aWYgKHR5cGVvZiBjbXBmeCA9PSBcImZ1bmN0aW9uXCIpIHZhbCA9IGNtcGZ4Py4oJGdldFZhbHVlKGJfdG1wKSA/PyB2LCBwLCBudWxsKTtcblx0XHRcdFx0ZWxzZSB2YWwgPSBiX3RtcD8uW3BdID8/IHY7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IG52ID0gJGdldFZhbHVlKHZhbCk7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbChhX3RtcFthX3Byb3BdLCBudikpICRhdm9pZFRyaWdnZXIoYl90bXAsICgpID0+IHtcblx0XHRcdFx0YV90bXBbYV9wcm9wXSA9IG52O1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlICgoYXNzaWduTWFwPy5nZXQ/LihhX3RtcCkpPy5nZXQ/LihhX3Byb3ApKT8uZGlzcG9zZT8uKCk7XG5cdH07XG5cdGNvbnN0IGRpc3Bvc2UgPSAoKSA9PiB7XG5cdFx0Y29uc3QgYV90bXAgPSBhUmVmPy5kZXJlZj8uKCk7XG5cdFx0Y29uc3QgbWFwID0gYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk7XG5cdFx0Y29uc3Qgc3RvcmUgPSBtYXA/LmdldD8uKGFfcHJvcCk7XG5cdFx0bWFwPy5kZWxldGU/LihhX3Byb3ApO1xuXHRcdHN0b3JlPy51bnN1Yj8uKCk7XG5cdH07XG5cdGNvbnN0IGJSZWYgPSBiPy5bMF0gIT0gbnVsbCAmJiAodHlwZW9mIGI/LlswXSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBiPy5bMF0gPT0gXCJmdW5jdGlvblwiKSAmJiAhKGI/LlswXSBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgdHlwZW9mIGI/LlswXT8uZGVyZWYgPT0gXCJmdW5jdGlvblwiKSA/IG5ldyBXZWFrUmVmKGI/LlswXSkgOiBiPy5bMF0sIGFSZWYgPSBhPy5bMF0gIT0gbnVsbCAmJiAodHlwZW9mIGE/LlswXSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBhPy5bMF0gPT0gXCJmdW5jdGlvblwiKSAmJiAhKGE/LlswXSBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgdHlwZW9mIGE/LlswXT8uZGVyZWYgPT0gXCJmdW5jdGlvblwiKSA/IG5ldyBXZWFrUmVmKGE/LlswXSkgOiBhPy5bMF07XG5cdGxldCBzdG9yZSA9IHtcblx0XHRjb21wdXRlLFxuXHRcdGRpc3Bvc2UsXG5cdFx0Y21wZng6IGNtcEJGbmNcblx0fTtcblx0Y29uc3QgYV90bXAgPSBhUmVmPy5kZXJlZj8uKCksIGJfdG1wID0gYlJlZj8uZGVyZWY/LigpO1xuXHRpZiAoYVJlZiBpbnN0YW5jZW9mIFdlYWtSZWYpIHtcblx0XHRpZiAoYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmJvdW5kICE9IGJfdG1wKSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZGVsZXRlPy4oYV9wcm9wKTtcblx0XHRzdG9yZSA9IChhc3NpZ25NYXA/LmdldE9ySW5zZXJ0Py4oYV90bXAsIC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCkpKT8uZ2V0T3JJbnNlcnRDb21wdXRlZD8uKGFfcHJvcCwgKCkgPT4gKHtcblx0XHRcdGJvdW5kOiBiX3RtcCxcblx0XHRcdGNtcGZ4OiBjbXBCRm5jLFxuXHRcdFx0dW5zdWI6IG51bGwsXG5cdFx0XHRjb21wdXRlLFxuXHRcdFx0ZGlzcG9zZVxuXHRcdH0pKTtcblx0XHRzdG9yZS51bnN1YiA9IGFmZmVjdGVkKGIsIGNvbXB1dGUpO1xuXHRcdHN0b3JlLmNtcGZ4ID0gY21wQkZuYztcblx0XHRhZGRUb0NhbGxDaGFpbihhX3RtcCwgU3ltYm9sLmRpc3Bvc2UsIHN0b3JlPy5kaXNwb3NlKTtcblx0XHRhZGRUb0NhbGxDaGFpbihiX3RtcCwgU3ltYm9sLmRpc3Bvc2UsIHN0b3JlPy5kaXNwb3NlKTtcblx0fVxuXHRpZiAoYl90bXAgJiYgIUFycmF5LmlzQXJyYXkoYl90bXApKSAkYXZvaWRUcmlnZ2VyKGFfdG1wLCAoKSA9PiB7XG5cdFx0Yl90bXBbYl9wcm9wXSA/Pz0gYV90bXA/LlthX3Byb3BdID8/IGJfdG1wW2JfcHJvcF07XG5cdH0pO1xuXHRyZXR1cm4gc3RvcmU/LmRpc3Bvc2U7XG59O1xudmFyIGxpbmsgPSAoYSwgYiwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRjb25zdCB1c3ViID0gW2Fzc2lnbihhLCBiLCBwcm9wKSwgYXNzaWduKGIsIGEsIHByb3ApXTtcblx0cmV0dXJuICgpID0+IHVzdWI/Lm1hcD8uKChjKSA9PiBjPy4oKSk7XG59O1xudmFyIGNvbXB1dGVkID0gKHNyYywgY2IsIGJlaGF2aW9yLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IGlzQUNvbXB1dGUgPSB0eXBlb2Ygc3JjPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIHNyYz8ubGVuZ3RoID09IDI7XG5cdGNvbnN0IGlzQVByb3AgPSAoaXNLZXlUeXBlKHNyYz8uWzFdKSB8fCBzcmM/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpICYmIHNyYz8ubGVuZ3RoID09IDI7XG5cdGxldCBhX3Byb3AgPSBpc0FQcm9wICYmICFpc0FDb21wdXRlID8gc3JjPy5bMV0gOiBBcnJheS5pc0FycmF5KHNyYykgPyBudWxsIDogcHJvcDtcblx0aWYgKCFpc0FQcm9wICYmICFpc0FDb21wdXRlKSBzcmMgPSBbaXNBUHJvcCA/IHNyYz8uWzBdIDogc3JjLCBhX3Byb3BdO1xuXHRpZiAoaXNBQ29tcHV0ZSkgc3JjWzFdID0gYV9wcm9wO1xuXHRpZiAoYV9wcm9wID09IG51bGwgfHwgaXNBcnJheUludmFsaWRLZXkoYV9wcm9wLCBzcmM/LlswXSkpIHJldHVybjtcblx0Y29uc3QgY21wID0gKHYpID0+IHtcblx0XHRsZXQgb2xkVmFsdWUgPSB2b2lkIDA7XG5cdFx0aWYgKHYgIT0gdm9pZCAwKSB7XG5cdFx0XHRvbGRWYWx1ZSA9IHNyY1swXVthX3Byb3BdO1xuXHRcdFx0c3JjWzBdW2FfcHJvcF0gPSB2O1xuXHRcdH1cblx0XHRyZXR1cm4gY2I/LihzcmM/LlswXT8uW2FfcHJvcF0sIGFfcHJvcCwgb2xkVmFsdWUpO1xuXHR9O1xuXHRjb25zdCBpbml0aWFsID0gY21wKCk7XG5cdGNvbnN0IHBlbmRpbmdJbml0aWFsID0gaXNQcm9taXNlKGluaXRpYWwpO1xuXHRjb25zdCByZiA9IG9ic2VydmUoe1xuXHRcdFskcHJvbWlzZV06IHBlbmRpbmdJbml0aWFsID8gaW5pdGlhbCA6IHZvaWQgMCxcblx0XHRbJHZhbHVlXTogcGVuZGluZ0luaXRpYWwgPyB2b2lkIDAgOiBpbml0aWFsLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKGNtcCgpID8/IHRoaXNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludChjbXAoKSA/PyB0aGlzWyR2YWx1ZV0sIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9IGNtcCh2KTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gPSBjbXAoKSA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0Y29uc3Qgd3JpdGVDb21wdXRlZCA9ICh2YWx1ZSwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKCh2KSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHJmPy5bJHZhbHVlXTtcblx0XHRcdHJmWyR2YWx1ZV0gPSB2O1xuXHRcdFx0cmY/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0XHR2YWx1ZTogdixcblx0XHRcdFx0b2xkVmFsdWUsXG5cdFx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9KTtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHJmPy5bJHZhbHVlXTtcblx0XHRyZlskdmFsdWVdID0gdmFsdWU7XG5cdFx0cmY/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlLFxuXHRcdFx0b2xkVmFsdWUsXG5cdFx0XHR0cmlnZ2VyXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xuXHRpZiAocGVuZGluZ0luaXRpYWwpIHdyaXRlQ29tcHV0ZWQoaW5pdGlhbCwgXCJyZXNvbHZlZFwiKTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoW3NyYz8uWzBdID8/IHNyYywgYV9wcm9wID8/IFwidmFsdWVcIl0sICgpID0+IHtcblx0XHR3cml0ZUNvbXB1dGVkKGNtcCgpLCBcIm1hbnVhbFwiKTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHJmLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHJmO1xufTtcbnZhciBkZWxheWVkU3Vic2NyaWJlID0gKHJlZiwgY2IsIGRlbGF5ID0gMTAwKSA9PiB7XG5cdGxldCB0bTtcblx0cmV0dXJuIGFmZmVjdGVkKHJlZiwgXCJ2YWx1ZVwiLCAodikgPT4ge1xuXHRcdGlmICghdiAmJiB0bSkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRtKTtcblx0XHRcdHRtID0gbnVsbDtcblx0XHR9IGVsc2UgaWYgKHYgJiYgIXRtKSB0bSA9IHRyaWdnZXJXaXRoRGVsYXkocmVmLCBjYiwgZGVsYXkpID8/IHRtO1xuXHR9KTtcbn07XG5cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgJGFmZmVjdGVkLCAkcmVmLCAkcmVzb2x2ZWQsICR0cmlnZ2VyLCAkdHJpZ2dlckNvbnRyb2wsICR0cmlnZ2VyTGVzcywgJHRyaWdnZXJMb2NrLCBBc3NpZ25PYmplY3RIYW5kbGVyLCBEb3VibGVXZWFrTWFwLCBhZGRUb0NhbGxDaGFpbiwgYWZmZWN0ZWQsIGFzc2lnbiwgYXNzaWduTWFwLCBiaW5kQnksIGJpbmRCeUtleSwgYm9vbGVhblJlZiwgY29tcHV0ZWQsIGNvbmRpdGlvbmFsLCBjb25kaXRpb25hbEluZGV4LCBjb25kaXRpb25hbFJlZiwgZGVsYXllZEJlaGF2aW9yLCBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IsIGRlbGF5ZWRTdWJzY3JpYmUsIGRlcmVmLCBkZXJpdmF0ZSwgZWZmZWN0LCBlZmZlY3RlZCwgaXNPYnNlcnZhYmxlLCBpdGVyYXRlZCwgbGluaywgbWFrZUFycmF5T2JzZXJ2YWJsZSwgbWFrZU9iamVjdEFzc2lnbmFibGUsIG1ha2VSZXNvbHZlZE9wLCBudW1iZXJSZWYsIG9ic2VydmFibGVCeU1hcCwgb2JzZXJ2YWJsZUJ5U2V0LCBvYnNlcnZlLCBwcm9taXNlZCwgcHJvcFJlZiwgcmVjb3ZlclJlYWN0aXZlLCByZWYsIHJlbWFwLCByZXNvbHZlZCwgc2FmZSwgc3BlY2lhbGl6ZWRTdWJzY3JpYmUsIHN0cmluZ1JlZiwgc3Vic2NyaWJlRGlyZWN0bHksIHN1YnNjcmliZUlucHV0LCBzdWJzY3JpYmVQYWlyZWQsIHN1YnNjcmliZVRoZW5hYmxlLCB0cmlnZ2VyV2l0aERlbGF5LCB1bmFmZmVjdGVkLCB1bmlmaWVkLCB1bndyYXAsIHVzZU9ic2VydmFibGUsIHdyYXBSZWYsIHdyYXBTZXRBc0FycmF5IH07Il0sCiAgIm1hcHBpbmdzIjogIkFBQUEsU0FBUyxpQkFBQUEsSUFBZSxhQUFBQyxJQUFXLGdCQUFnQkMsSUFBZ0IsWUFBQUMsSUFBVSxXQUFBQyxHQUFTLGlCQUFBQyxJQUFlLGNBQUFDLElBQVksaUJB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MVksQ0FBTSxJQUFJOEosR0FDYjRPLElBQUtoWSxDQUFRLElBQUk7QUFBQSxRQUNoQixLQUFLO0FBQUEsUUFDTCxPQUFPb0o7QUFBQSxRQUNQLFVBQUFoQjtBQUFBLFFBQ0EsU0FBUztBQUFBLE1BQ1YsQ0FBQyxHQUNNZ0I7QUFBQSxJQUNSLENBQUM7QUFDRCxVQUFNaEIsSUFBVzRQLElBQUsxWSxDQUFNO0FBQzVCLFdBQUEwWSxFQUFHMVksQ0FBTSxJQUFJaUQsR0FDYnlWLElBQUtoWSxDQUFRLElBQUk7QUFBQSxNQUNoQixLQUFLO0FBQUEsTUFDTCxPQUFBdUM7QUFBQSxNQUNBLFVBQUE2RjtBQUFBLE1BQ0EsU0FBQTVCO0FBQUEsSUFDRCxDQUFDLEdBQ01qRTtBQUFBLEVBQ1I7QUFDQSxFQUFJd1YsS0FBZ0JFLEVBQWN4SSxHQUFTLFVBQVU7QUFDckQsUUFBTWtCLElBQU14RSxFQUFTLENBQUMrRCxJQUFNLENBQUMsS0FBS0EsR0FBS2dILEtBQVUsT0FBTyxHQUFHLE1BQU07QUFDaEUsSUFBQWUsRUFBY0gsRUFBSSxHQUFHLFFBQVE7QUFBQSxFQUM5QixDQUFDO0FBQ0QsU0FBQXRXLEVBQWV3VyxHQUFJLE9BQU8sU0FBU3JILENBQUcsR0FDL0JxSDtBQUNSLEdBQ0lFLEtBQW1CLENBQUNuSCxHQUFLM1AsR0FBSStQLElBQVEsUUFBUTtBQUNoRCxNQUFJRztBQUNKLFNBQU9uRixFQUFTNEUsR0FBSyxTQUFTLENBQUMzSCxNQUFNO0FBQ3BDLElBQUksQ0FBQ0EsS0FBS2tJLEtBQ1QsYUFBYUEsQ0FBRSxHQUNmQSxJQUFLLFFBQ0tsSSxLQUFLLENBQUNrSSxNQUFJQSxJQUFLSixHQUFpQkgsR0FBSzNQLEdBQUkrUCxDQUFLLEtBQUtHO0FBQUEsRUFDL0QsQ0FBQztBQUNGOyIsCiAgIm5hbWVzIjogWyIkYXZvaWRUcmlnZ2VyIiwgIiRnZXRWYWx1ZSIsICIkdHJpZ2dlckxvY2skMSIsICJQcm9taXNlZCIsICJiaW5kQ3R4IiwgImNhbGxCeUFsbFByb3AiLCAiY2FsbEJ5UHJvcCIsICJkZWZhdWx0QnlUeXBlIiwgImhhc1ZhbHVlIiwgImlzQXJyYXlJbnZhbGlkS2V5IiwgImlzS2V5VHlwZSIsICJpc05vdEVxdWFsIiwgImlzUHJpbWl0aXZlIiwgImlzUHJvbWlzZSIsICJtYWtlVHJpZ2dlckxlc3MiLCAib2JqZWN0QXNzaWduIiwgIm9iamVjdEFzc2lnbk5vdEVxdWFsIiwgInBvdGVudGlhbGx5QXN5bmMiLCAicG90ZW50aWFsbHlBc3luY01hcCIsICJyZXNvbHZlZCQxIiwgInRyeVBhcnNlQnlIaW50IiwgIiR2YWx1ZSIsICIkZXh0cmFjdEtleSQiLCAiJG9yaWdpbmFsS2V5JCIsICIkcmVnaXN0cnlLZXkkIiwgIiRiZWhhdmlvciIsICIkcHJvbWlzZSIsICIkcmVzb2x2ZWQiLCAiJHRyaWdnZXJMZXNzIiwgIiR0cmlnZ2VyTG9jayIsICIkdHJpZ2dlckNvbnRyb2wiLCAiJHRyaWdnZXIiLCAiJGFmZmVjdGVkIiwgIiRpc05vdEVxdWFsIiwgIiRyZWFsUHJvcCIsICIkb3JpZ2luYWxPYmplY3RzJCIsICJzYWZlIiwgInRhcmdldCIsICJ1bndyYXAiLCAibWFwcGVkIiwgImUiLCAiSyIsICJWIiwgImFyciIsICJkZXJlZiIsICJkaXNjb3VudFZhbHVlIiwgIm9yaWdpbmFsIiwgIiR2YWwiLCAiaXNUaGVuYWJsZSIsICJ2YWwiLCAid2l0aFByb21pc2UiLCAiY2IiLCAiZGlzcG9zZU1hcCIsICJkaXNwb3NlUmVnaXN0cnkiLCAiY2FsbHN0YWNrIiwgImFkZFRvQ2FsbENoYWluIiwgIm9iaiIsICJtZXRob2RLZXkiLCAiY2FsbGJhY2siLCAiY2hhaW5UYXJnZXQiLCAiQ2FsbENoYWluIiwgImFyZ3MiLCAiaXNBcnJheUluZGV4IiwgInByb3AiLCAibnVtIiwgIndyYXBTZXRBc0FycmF5IiwgInNvdXJjZSIsICJvcHRpb25zIiwgImJhY2tpbmdTZXQiLCAibm90aWZ5RHVwbGljYXRlIiwgInZhbHVlIiwgInZpYSIsICJpbmRleCIsICJpdGVtIiwgInNuYXBzaG90IiwgInJlYnVpbGRGcm9tIiwgIm1ldGhvZHMiLCAiaXRlbXMiLCAic2l6ZSIsICJpdGVyYXRvciIsICJjdXJyZW50IiwgInRvUHJlcGVuZCIsICJuZXh0IiwgInN0YXJ0IiwgImRlbGV0ZUNvdW50IiwgIm5vcm1hbGl6ZWRTdGFydCIsICJhY3R1YWxEZWxldGVDb3VudCIsICJyZW1vdmVkIiwgImluc2VydFBvc2l0aW9uIiwgIl8iLCAibmV4dExlbmd0aCIsICJuZXh0VmFsdWUiLCAiY3VycmVudFZhbHVlIiwgImlkeCIsICJrZXlzIiwgImkiLCAiQXNzaWduT2JqZWN0SGFuZGxlciIsICJuYW1lIiwgIm5ld1QiLCAiY3R4IiwgIm1ha2VPYmplY3RBc3NpZ25hYmxlIiwgInB4IiwgIndpdGhVbnN1YlN5bWJvbCIsICJ3aXRoVW5zdWIiLCAiY29tcGxldGVXaXRoVW5zdWIiLCAic3Vic2NyaWJlciIsICJ3ZWFrIiwgImhhbmRsZXIiLCAicmVnaXN0cnkiLCAic2F2Q29tcGxldGUiLCAidW5hZmZlY3RlZCIsICJyIiwgInN1YnNjcmlwdFJlZ2lzdHJ5U3ltYm9sIiwgInN1YnNjcmlwdFJlZ2lzdHJ5IiwgImdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCIsICJnbG9iYWxFZmZlY3RMaXN0ZW5lcnMiLCAiZWZmZWN0R2xvYmFsbHkiLCAibm9ybWFsaXplZCIsICJub3JtYWxpemVFZmZlY3RPcHRpb25zIiwgIndyYXBwZWRTeW1ib2wiLCAid3JhcHBlZCIsICJyZWdpc3RlciIsICJ3aGF0IiwgImhhbmRsZSIsICJTdWJzY3JpcHQiLCAid3JhcFdpdGgiLCAiZm9yQWxsIiwgIndpbGRjYXJkVHJpZ2dlcnMiLCAidHJpZ2dlckFsaWFzZXMiLCAidHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sIiwgImNhbm9uaWNhbCIsICJhbGlhc2VzIiwgImFsaWFzIiwgInRyaWdnZXJDYW5vbmljYWxOYW1lcyIsICJub3JtYWxpemVUcmlnZ2VyTmFtZSIsICJ0cmlnZ2VyIiwgInRyaWdnZXJOYW1lc09mIiwgImV4cGFuZFRyaWdnZXJGaWx0ZXIiLCAidHlwZXMiLCAibm9ybWFsaXplVHJpZ2dlckZpbHRlciIsICJ0cmlnZ2VycyIsICJsaXN0IiwgInRyaWdnZXJGaWx0ZXJBbGxvd3MiLCAiZmlsdGVyIiwgImlzT3B0aW9uc09iamVjdCIsICJub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMiLCAiYWZmZWN0VHlwZXMiLCAiU3Vic2NyaXB0U3ltYm9sIiwgIiNzb3VyY2UiLCAiI2xpc3RlbmVycyIsICIjZmxhZ3MiLCAiI25hdGl2ZSIsICIjaXRlcmF0b3IiLCAiI2luRGlzcGF0Y2giLCAiI2Rpc2FibGVkVHJpZ2dlcnMiLCAiI3RyaWdnZXJDb250cm9sIiwgIiNwZW5kaW5nIiwgIiNwZW5kaW5nQnlQcm9wIiwgIiNmbHVzaFNjaGVkdWxlZCIsICJlbmFibGVkIiwgIiNkaXNwYXRjaCIsICJjb250cm9sbGVyIiwgInJlcyIsICJvbGRWYWx1ZSIsICJldGMiLCAibGlzdGVuZXJzIiwgInJlY29yZCIsICJldmVudCIsICJudyIsICJuYW1lcyIsICJwcmV2aW91cyIsICJyZXN0b3JlIiwgIndhc0Rpc2FibGVkIiwgInJlc3VsdCIsICJvcEtleSIsICJieU9wIiwgImJhdGNoIiwgIm9wTWFwIiwgIm5tIiwgInYiLCAib3YiLCAidGciLCAicmVzdCIsICJyYXdPZiIsICJ1bndyYXBwZWQiLCAicmVzb2x2ZWQiLCAibW9kZSIsICJyYXciLCAibWFrZVJlc29sdmVkT3AiLCAiZW1pdCIsICJydW4iLCAicGVuZGluZyIsICJrZXkiLCAiY2FsbGJhY2tPclZhbHVlIiwgImVtaXRSZXNvbHZlZCIsICJiaW5kRXhpc3RpbmdUaGVuYWJsZXMiLCAibGl2ZSIsICJfX3NhZmVHZXRHdWFyZFN5bWJvbCIsICJfX3N5c3RlbVNraXAiLCAic3lzdGVtU2tpcEdldCIsICJnb3QiLCAic2FmZUdldCIsICJfX3NhZmVHZXRHdWFyZCIsICJpc0dldHRlciIsICJwcm9wTmFtZSIsICJmYWxsVGhyb3VnaCIsICJ0bXAiLCAic2FmZVNldCIsICJhY3RpdmUiLCAicmVjIiwgImhhc093biIsICJpc1RyaWdnZXJFbWl0T3B0aW9ucyIsICJhbGxvd1ZhbHVlT25seSIsICJ0cmlnZ2VyT3B0aW9uVmFsdWUiLCAiZmFsbGJhY2siLCAidHJpZ2dlck9wdGlvblRyaWdnZXIiLCAiaXNSdW50aW1lS2V5IiwgInJlYWxQcm9wT2YkMSIsICJ0cmlnZ2VyS2V5T2YiLCAidHJpZ2dlclZhbHVlT2YiLCAicmVhbFByb3AiLCAiY3JlYXRlVHJpZ2dlckFQSSIsICJhcGkiLCAib3BPck9wdGlvbnMiLCAiY29udHJvbCIsICJzeXN0ZW1HZXQiLCAiYWZmZWN0ZWQiLCAib2JzZXJ2YWJsZUFQSU1ldGhvZHMiLCAidXN1YiIsICJjb21wIiwgIk9ic2VydmVBcnJheU1ldGhvZCIsICIjbmFtZSIsICIjc2VsZiIsICIjaGFuZGxlIiwgInNlbGYiLCAic2tpcCIsICJhZGRlZCIsICJzZXRQYWlycyIsICJvbGRTdGF0ZSIsICJvYnNlcnZlQXJyYXkiLCAibmV3VmFsdWUiLCAicmVnIiwgIkkiLCAicGFpciIsICJ0cmlnZ2VyV2hlbkxlbmd0aENoYW5nZSIsICJvbGRMZW4iLCAibmV3TGVuIiwgInJlbW92ZWRJdGVtcyIsICJhZGRlZENvdW50IiwgIk9ic2VydmVBcnJheUhhbmRsZXIiLCAic3lzIiwgIm9icyIsICJvbGQiLCAieHl6dyIsICJyZ2JhIiwgInh5endfaWR4IiwgInJnYmFfaWR4IiwgIk9ic2VydmVPYmplY3RIYW5kbGVyIiwgImhpbnQiLCAiZnQiLCAiJG9yaWdpbmFsIiwgInRyaWdnZXJOYW1lIiwgInN1YnNjcmlwdCIsICJkZXNjcmlwdG9yIiwgIiRyZXN1bHQiLCAiT2JzZXJ2ZU1hcEhhbmRsZXIiLCAidmFsdWVPckZ4IiwgIm9sZFZhbHVlcyIsICJoYWQiLCAiY29tcHV0ZWQiLCAiZGVmYXVsdE9yQ29tcHV0ZSIsICJpbmNvbWluZyIsICJPYnNlcnZlU2V0SGFuZGxlciIsICIkaXNPYnNlcnZhYmxlIiwgIm9ic2VydmVPYmplY3QiLCAib2JzZXJ2ZU1hcCIsICJtYXAiLCAib2JzZXJ2ZVNldCIsICJzZXQiLCAibnVtYmVyUmVmIiwgImluaXRpYWwiLCAiYmVoYXZpb3IiLCAiJHIiLCAib2JzZXJ2ZSIsICJzdHJpbmdSZWYiLCAiYm9vbGVhblJlZiIsICJ3cmFwUmVmIiwgIm1hcmtSZWFsUHJvcCIsICJwcm9wUmVmIiwgInNyYyIsICJzcmNQcm9wIiwgImlzTWFwIiwgImlzU2V0IiwgInJlYWRTbG90IiwgIndyaXRlU2xvdCIsICJpc09ic2VydmFibGUiLCAicmVjb3ZlclJlYWN0aXZlIiwgInNsb3QiLCAidXNiIiwgIl9wcm9wIiwgIiRyZWYiLCAidHlwZWQiLCAicmVmIiwgInByb21pc2VkIiwgInByb21pc2UiLCAidHJpZ2dlcldpdGhEZWxheSIsICJkZWxheSIsICJkZWxheWVkQmVoYXZpb3IiLCAic2lnIiwgInRtIiwgImRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciIsICJzdGF0ZU5hbWUiLCAicmVhY3RpdmUiLCAidXNlT2JzZXJ2YWJsZSIsICJvYnNlcnZhYmxlIiwgInNwZWNpYWxpemVkU3Vic2NyaWJlIiwgImNoZWNrVmFsaWRPYmoiLCAiaW5pdGlhbFRyaWdnZXIiLCAicmVhbFByb3BPZiIsICJub3JtYWxpemVBZmZlY3RlZFByb3AiLCAicHJvcFZhbHVlT2YiLCAiY2FsbEJ5UHJvcFJlZkF3YXJlIiwgIndpdGhUcmlnZ2VyIiwgInN1YnNjcmliZURpcmVjdGx5IiwgInRQcm9wIiwgImluaXRpYWxDYiIsICJ1blN1YiIsICJzdWJzY3JpYmVJbnB1dCIsICIkb3B0IiwgIiRjYiIsICJldiIsICJjaGVja0lzUGFpcmVkIiwgImlzRWZmZWN0T3B0aW9uc0FyZyIsICJub3JtYWxpemVFZmZlY3RUYXJnZXRzIiwgInRhcmdldHMiLCAiZWZmZWN0VGFyZ2V0Q29udGV4dCIsICJ0b0VmZmVjdEV2ZW50IiwgInN1YnNjcmliZVBhaXJlZCIsICJzdWJzY3JpYmVUaGVuYWJsZSIsICJlZmZlY3QiLCAiYWZmZWN0ZWRPcHRpb25zIiwgImRpc3Bvc2VycyIsICJkaXNwb3NlIiwgImVmZmVjdGVkIiwgIm1ha2VBcnJheU9ic2VydmFibGUiLCAib2JzZXJ2YWJsZUJ5U2V0IiwgIm9ic2VydmFibGVCeU1hcCIsICJEb3VibGVXZWFrTWFwIiwgIiN0b3AiLCAiI2Vuc3VyZUlubmVyIiwgImtleTEiLCAiaW5uZXIiLCAiI3NwbGl0UGFpciIsICJrZXkyIiwgImZhY3RvcnkiLCAiY29tcHV0ZSIsICJyZWdpc3RlcmVkSXRlcmF0ZWQiLCAiaXRlcmF0ZWQiLCAiJHN1YiIsICJlbnRyaWVzIiwgImJhc2lzIiwgIm9mT2xkIiwgIm9mTmV3IiwgImlzUGFpciIsICJiaW5kQnkiLCAid2F0Y2giLCAicCIsICJOIiwgImsiLCAiZGVyaXZhdGUiLCAiZnJvbSIsICJyZWFjdEZuIiwgImJpbmRCeUtleSIsICJjb25kaXRpb25hbEluZGV4IiwgImNvbmRMaXN0IiwgInJlYWRDb25kaXRpb24iLCAiY29uZGl0aW9uIiwgImludmFsaWRhdGUiLCAiY29uZGl0aW9uYWxSZWYiLCAiY29uZCIsICJpZlRydWUiLCAiaWZGYWxzZSIsICJnZXRUcnVlIiwgImdldEZhbHNlIiwgInZhbHVlT2YiLCAibiIsICJjb25kaXRpb25hbCIsICJyZW1hcCIsICJzdWIiLCAiZGVzdCIsICJ1bmlmaWVkIiwgInN1YnMiLCAiaW5pdGlhbEVudHJpZXMiLCAiYXNzaWduTWFwIiwgImFzc2lnbiIsICJhIiwgImIiLCAiaXNBQ29tcHV0ZSIsICJpc0JDb21wdXRlIiwgImNtcEJGbmMiLCAiaXNBUHJvcCIsICJhX3Byb3AiLCAiaXNCUHJvcCIsICJiX3Byb3AiLCAiYV90bXAiLCAiYVJlZiIsICJiX3RtcCIsICJiUmVmIiwgImNtcGZ4IiwgIm52IiwgInN0b3JlIiwgImxpbmsiLCAiYyIsICJjbXAiLCAicGVuZGluZ0luaXRpYWwiLCAicmYiLCAid3JpdGVDb21wdXRlZCIsICJkZWxheWVkU3Vic2NyaWJlIl0KfQo=
