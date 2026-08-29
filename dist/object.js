import { $avoidTrigger as ie, $getValue as We, $triggerLock as Ve, Promised as ze, bindCtx as B, callByAllProp as Fe, callByProp as nt, defaultByType as lt, hasValue as P, isArrayInvalidKey as L, isKeyType as W, isNotEqual as O, isPrimitive as g, makeTriggerLess as ae, objectAssign as se, objectAssignNotEqual as it, potentiallyAsync as ut, potentiallyAsyncMap as st, tryParseByHint as E } from "@fest-lib/core";
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var h = /* @__PURE__ */ Symbol.for("@value"), S = /* @__PURE__ */ Symbol.for("@extract"), k = /* @__PURE__ */ Symbol.for("@origin"), ee = /* @__PURE__ */ Symbol.for("@registry"), G = /* @__PURE__ */ Symbol.for("@behavior"), ne = /* @__PURE__ */ Symbol.for("@promise"), de = /* @__PURE__ */ Symbol.for("@trigger-less"), d = /* @__PURE__ */ Symbol.for("@trigger-lock"), ft = /* @__PURE__ */ Symbol.for("@trigger-control"), z = /* @__PURE__ */ Symbol.for("@trigger"), te = /* @__PURE__ */ Symbol.for("@subscribe"), ot = /* @__PURE__ */ Symbol.for("@isNotEqual"), fe = /* @__PURE__ */ Symbol.for("@realProp"), Ce = /* @__PURE__ */ new WeakMap(), ue = (e) => {
  const t = typeof e == "object" || typeof e == "function" ? e?.[S] ?? e : e, r = (n) => ue(n);
  return Array.isArray(t) ? t?.map?.(r) || Array.from(t || [])?.map?.(r) || [] : t instanceof Map || t instanceof WeakMap ? new Map(Array.from(t?.entries?.() || [])?.map?.(([n, l]) => [n, ue(l)])) : t instanceof Set || t instanceof WeakSet ? new Set(Array.from(t?.values?.() || [])?.map?.(r)) : t != null && typeof t == "function" || typeof t == "object" ? Object.fromEntries(Array.from(Object.entries(t || {}) || [])?.filter?.(([n]) => n != S && n != k && n != ee)?.map?.(([n, l]) => [n, ue(l)])) : t;
}, ct = (e) => e?.[S] ?? e?.["@target"] ?? e, $ = (e, t = !1) => {
  const r = e;
  if (g(e) || typeof e == "symbol") return e;
  if (e != null && (e instanceof WeakRef || "deref" in e && typeof e?.deref == "function") && (e = e?.deref?.()), e != null && (typeof e == "object" || typeof e == "function")) {
    e = ct(e);
    const n = t && P(e) && e?.value;
    if (n != null && (typeof n == "object" || typeof n == "function") && (e = n), r != e) return $(e, t);
  }
  return e;
}, Oe = (e) => e != null && typeof e.then == "function", yt = (e, t) => g(e) || typeof e == "function" ? t?.(e) : Oe(e) ? e.then(t) : e?.promise && Oe(e.promise) ? e.promise.then(t) : t?.(e), Ne = /* @__PURE__ */ new WeakMap(), at = new FinalizationRegistry((e) => {
  e?.forEach?.((t) => t?.());
});
function R(e, t, r) {
  if (!(!r || typeof r != "function" || typeof e != "object" && typeof e != "function"))
    if (t == Symbol.dispose) {
      const n = e?.[S] ?? e;
      Ne?.getOrInsertComputed?.(n, () => {
        const l = /* @__PURE__ */ new Set();
        return (typeof n == "object" || typeof n == "function") && (at.register(n, l), Ne.set(n, l), n[Symbol.dispose] ??= () => l.forEach((s) => {
          s?.();
        })), l;
      })?.add?.(r);
    } else e[t] = function(...n) {
      const l = e?.[t];
      typeof l == "function" && l.apply(this, n), r.apply(this, n);
    };
}
var Q = (e) => {
  if (typeof e != "string" || e === "") return !1;
  const t = Number(e);
  return Number.isInteger(t) && t >= 0 && String(t) === e;
};
function ir(e = [], t = {}) {
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
      const y = l(), a = Math.min(Math.max(i, 0), y.length), v = f === void 0 ? y.length - a : Math.max(0, Math.min(f, y.length - a)), m = y.splice(a, v);
      let A = a;
      for (const w of o) {
        if (y.includes(w)) {
          n(w, "splice", A);
          continue;
        }
        y.splice(A++, 0, w);
      }
      return s(y), m;
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
      if (Q(f)) return l()[Number(f)];
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
      if (Q(f)) {
        const y = l(), a = Number(f);
        if (a > y.length) return !0;
        const v = o;
        if (a < y.length) {
          const m = y[a];
          if (Object.is(m, v)) return !0;
          if (y.some((A, w) => w !== a && Object.is(A, v)))
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
      if (Q(f)) {
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
      if (Q(f)) {
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
      if (Q(f)) {
        const o = Number(f);
        return o >= 0 && o < r.size;
      }
      return f in u;
    }
  });
}
var dt = class {
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
    return se(e, r, t), !0;
  }
  get(e, t, r) {
    return typeof t == "symbol" ? e?.[t] ?? e : Reflect.get(e, t, r);
  }
}, ur = (e) => {
  if (e?.[k] || Ce.has(e)) return e;
  const t = new Proxy(e, new dt());
  return Ce.set(t, e), t;
}, qe = /* @__PURE__ */ Symbol.for("object.ts@withUnsub");
globalThis[qe] ??= /* @__PURE__ */ new WeakMap();
var ht = globalThis[qe], vt = (e, t, r) => ht.getOrInsert(e, () => {
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
}), je = /* @__PURE__ */ Symbol.for("object.ts@subscriptRegistry");
globalThis[je] ??= /* @__PURE__ */ new WeakMap();
var p = globalThis[je] ??= /* @__PURE__ */ new WeakMap(), Ue = /* @__PURE__ */ Symbol.for("object.ts@globalEffectListeners");
globalThis[Ue] ??= /* @__PURE__ */ new Map();
var oe = globalThis[Ue], De = (e, t = ["*"]) => {
  if (e == null || typeof e != "function") return;
  const r = Le(t);
  return oe.set(e, r.affectTypes), () => oe.delete(e);
}, Je = /* @__PURE__ */ Symbol.for("object.ts@wrapped");
globalThis[Je] ??= /* @__PURE__ */ new WeakMap();
var bt = globalThis[Je], pt = (e, t) => {
  const r = e?.[S] ?? e;
  let n = p.get(r);
  return n ? n.bindSource(r) : (n = new mt(r), p.set(r, n)), t;
}, le = (e, t) => (e = $(e?.[S] ?? e), typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || e == null ? e : bt.getOrInsertComputed(e, () => new Proxy(e, pt(e, t)))), X = /* @__PURE__ */ Symbol.for("@allProps"), Qe = /* @__PURE__ */ new Set(["*", "all"]), Ie = /* @__PURE__ */ new Map([
  ["set", ["setter", "@set"]],
  ["add", ["@add"]],
  ["delete", ["@delete"]],
  ["invalidate", ["@invalidate"]],
  ["manual", ["@manual"]],
  ["custom", ["@custom"]],
  ["setAll", ["@setAll"]],
  ["addAll", ["@addAll"]],
  ["deleteAll", ["@deleteAll", "@clear"]]
]), Xe = /* @__PURE__ */ Symbol.for("object.ts@triggerCanonicalNames");
globalThis[Xe] ??= new Map(Array.from(Ie.entries()).flatMap(([e, t]) => t.map((r) => [r, e])));
var St = globalThis[Xe], re = (e = "set") => {
  if (e == null) return e;
  const t = String(e || "set");
  return St.get(t) ?? t;
}, Ye = (e) => {
  const t = e == null ? "all" : String(re(e) ?? "all");
  return [t, ...Ie.get(t) ?? []];
}, Be = (e = ["*"]) => new Set([...q(e)].flatMap((t) => [t, ...Ie.get(t) ?? []])), q = (e = ["*"]) => {
  const t = typeof e == "string" ? [e] : Array.from(e ?? ["*"]), r = new Set(t.map((n) => {
    const l = String(n || "*");
    return Qe.has(l) ? l : String(re(l) ?? l);
  }));
  return r.size ? r : /* @__PURE__ */ new Set(["*"]);
}, F = (e, t) => {
  const r = e instanceof Set ? e : q(e);
  return [...Qe].some((n) => r.has(n)) || Ye(t).some((n) => r.has(n));
}, Ze = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), he = (e = ["*"]) => {
  if (Ze(e)) return {
    affectTypes: q(e.affectTypes ?? e.triggers ?? ["*"]),
    triggerImmediately: e.triggerImmediately !== !1
  };
  const t = q(e);
  return {
    affectTypes: t,
    triggerImmediately: F(t, "initial")
  };
}, Le = (e = ["*"]) => Ze(e) ? {
  affectTypes: q(e.affectTypes ?? e.triggers ?? ["*"]),
  triggerImmediately: e.triggerImmediately === !0
} : {
  affectTypes: q(e),
  triggerImmediately: !1
}, et = /* @__PURE__ */ Symbol.for("object.ts@Subscript");
globalThis[et] ??= class {
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
      return vt(l, r, s);
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
    l = re(l) ?? l;
    const u = this.#e;
    if (u?.size)
      for (const [i, f] of u.entries()) (f.prop === t || f.prop === X || f.prop === null) && F(f.triggers, l) && this.$safeExec(i, r, t, n, l, ...s);
    if (oe.size) {
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
      for (const [f, o] of oe.entries()) F(o, l) && this.$safeExec(f, i);
    }
  }
  wrap(t) {
    return Array.isArray(t) ? le(t, this) : t;
  }
  get triggerControl() {
    return this.#c;
  }
  isTriggerEnabled(t) {
    return !F(this.#n, "all") && !Ye(t).some((r) => this.#n.has(r));
  }
  setTriggersEnabled(t = ["*"], r = !0) {
    const n = Be(t);
    for (const l of n) r ? this.#n.delete(l) : this.#n.add(l);
  }
  withTriggers(t, r, n) {
    const l = [...Be(t)], s = new Map(l.map((i) => [i, this.#n.has(i)])), u = () => {
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
    const l = he(n);
    return this.#e.set(t, {
      prop: r || X,
      triggers: l.affectTypes
    }), () => this.unaffected(t, r || X);
  }
  unaffected(t, r) {
    if (t != null && typeof t == "function") {
      const n = this.#e, l = n?.get(t);
      if (l && (l.prop == r || r == null || r == X))
        return n.delete(t), () => this.affected(t, r || X, l.triggers);
    }
    return this.#e.clear();
  }
  trigger(t, r, n, l = "set", ...s) {
    if (typeof t == "symbol" || (l === void 0 && (l = "set"), l = re(l) ?? l, !this.isTriggerEnabled(l))) return;
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
              const [v, m, A, w, I] = a;
              try {
                this.#s(v, m, A, w, ...I ?? []);
              } catch (K) {
                console.warn(K);
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
var mt = globalThis[et], gt = /* @__PURE__ */ Symbol.for("object.ts@__safeGetGuard"), wt = /* @__PURE__ */ new Set([
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
]), Y = (e, t) => {
  if (!wt.has(t)) return null;
  const r = c(e, t);
  return typeof r == "function" ? B(e, r) : r;
}, T = globalThis[gt] ??= /* @__PURE__ */ new WeakMap();
function At(e, t) {
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
var D = (e, t) => {
  if (g(e)) return e;
  const r = c(e, t);
  if (r == null && t != "value") {
    const n = c(e, "value");
    return n != null && !g(n) ? D(n, t) : r;
  } else if (t == "value" && r != null && !g(r) && typeof r != "function") return D(r, t) ?? r ?? e;
  return r ?? e;
}, Tt = (e, t, r) => {
  if (e == null) return !1;
  let n = __safeSetGuard?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  return n?.has?.(t) ? !1 : (n?.add?.(t), Reflect.set(e, t, r));
}, c = (e, t, r) => {
  let n;
  if (e == null) return e;
  let l = T?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  if (l?.has?.(t)) return null;
  if (!At(e, t)) n ??= Reflect.get(e, t, r ?? e);
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
  return typeof n == "function" ? B(e, n) : n;
}, M = (e, t) => Object.prototype.hasOwnProperty.call(e, t), ge = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && (M(e, "key") || M(e, "name") || M(e, "oldValue") || M(e, "old") || M(e, "op") || M(e, "trigger") || t && M(e, "value")), V = (e, t, r) => M(e, t) ? e[t] : t == "oldValue" && M(e, "old") ? e.old : r(), ve = (e, t = "manual") => re(e.trigger ?? e.op ?? t), Ot = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", ce = (e) => {
  const t = c(e, fe) ?? c(e, "realProp");
  return Ot(t) ? t : null;
}, Ge = (e, t) => t == "value" ? ce(e) ?? t : t, xt = (e, t) => {
  const r = ce(e);
  return r != null && t == r ? c(e, "value") ?? c(e, h) ?? c(e, t) : t == null ? void 0 : c(e, t);
}, be = (e, t) => {
  const r = (l, s, u) => (ge(s) || (u ??= s), t(ge(l) ? l : ge(s, !0) ? {
    key: l,
    trigger: u,
    ...s
  } : {
    key: l,
    trigger: u ?? s
  })), n = e?.triggerControl;
  return n && Object.assign(r, n), r.custom = (l, s, u, i) => r({
    key: s,
    trigger: l,
    value: u,
    oldValue: i
  }), r;
}, pe = (e, t, r) => {
  if (e == null || g(e)) return e;
  if (([
    "deref",
    "bind",
    "@target",
    k,
    S,
    ee
  ].indexOf(t) < 0 ? c(e, t)?.bind?.(e) : null) != null) return null;
  if ([S, k].indexOf(t) >= 0) return c(e, t) ?? e;
  if (t == h) return c(e, t) ?? c(e, "value");
  if (t == ee) return r;
  if (t == ft) return r?.triggerControl;
  if (t == Symbol.observable) return r?.compatible;
  if (t == Symbol.subscribe) return (n, l, s) => b(l != null ? [e, l] : e, n, s);
  if (t == Symbol.iterator || t == Symbol.asyncIterator) return c(e, t);
  if (t == Symbol.dispose) return (n) => {
    c(e, Symbol.dispose)?.(n), Te(n != null ? [e, n] : e);
  };
  if (t == Symbol.asyncDispose) return (n) => {
    c(e, Symbol.asyncDispose)?.(n), Te(n != null ? [e, n] : e);
  };
  if (t == Symbol.unsubscribe) return (n) => Te(n != null ? [e, n] : e);
  if (typeof t == "symbol" && (t in e || c(e, t) != null)) return c(e, t);
}, Se = (e, t, r) => {
  if (t == "subscribe") return r?.compatible?.[t] ?? ((n) => {
    if (typeof n == "function") return b(e, n);
    if ("next" in n && n?.next != null) {
      const l = b(e, n?.next), s = n?.complete;
      return n.complete = (...u) => (l?.(), s?.(...u)), n.complete;
    }
  });
}, Rt = class {
  #r;
  #e;
  #t;
  constructor(e, t, r) {
    this.#r = e, this.#e = t, this.#t = r;
  }
  get(e, t, r) {
    const n = Y(e, t);
    return n ?? Reflect.get(e, t, r);
  }
  apply(e, t, r) {
    let n = [], l = [], s = [], u = [...this.#e], i = -1;
    const f = Reflect.apply(e, t || this.#e, r);
    if (this.#t?.[d])
      return Array.isArray(f) ? xe(f) : f;
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
          ]) : O(a, v) && s.push([
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
        for (let y = 0; y < u.length; y++) O(u[y], this.#e[y]) && s.push([
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
    const o = p.get(this.#e);
    return n?.length == 1 ? o?.trigger?.(i, n[0], null, "add") : n?.length > 1 && (o?.trigger?.(i, n, null, "addAll"), n.forEach((y, a) => o?.trigger?.(i + a, y, null, "add"))), s?.length == 1 ? o?.trigger?.(s[0]?.[0] ?? i, s[0]?.[1], s[0]?.[2], s[0]?.[3] === !1 ? "add" : "set") : s?.length > 1 && (o?.trigger?.(i, s, u, "setAll"), s.forEach((y, a) => o?.trigger?.(y?.[0] ?? i + a, y?.[1], y?.[2], y?.[3] === !1 ? "add" : "set"))), l?.length == 1 ? o?.trigger?.(i, null, l[0], "delete") : l?.length > 1 && (o?.trigger?.(i, null, l, "deleteAll"), l.forEach((y, a) => o?.trigger?.(i + a, null, y, "delete"))), f == e ? new Proxy(f, this.#t) : Array.isArray(f) ? xe(f) : f;
  }
}, It = (e, t, r, n) => {
  const l = Number.isInteger(r) && Number.isInteger(n) && n < r ? t.slice(n, r) : [];
  if (!e[d] && r !== n) {
    const s = p.get(t);
    l.length === 1 ? s?.trigger?.(n, null, l[0], "delete") : l.length > 1 && (s?.trigger?.(n, null, l, "deleteAll"), l.forEach((i, f) => s?.trigger?.(n + f, null, i, "delete")));
    const u = Number.isInteger(r) && Number.isInteger(n) && n > r ? n - r : 0;
    if (u === 1) s?.trigger?.(r, void 0, null, "add");
    else if (u > 1) {
      const i = Array(u).fill(void 0);
      s?.trigger?.(r, i, null, "addAll"), i.forEach((f, o) => s?.trigger?.(r + o, void 0, null, "add"));
    }
  }
}, Pt = class {
  [d];
  constructor() {
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  get(e, t, r) {
    const n = Y(e, t);
    if (n != null) return n;
    if ([
      S,
      k,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? c(e, t)?.bind?.(e) : c(e, t);
    const l = p?.get?.(e), s = pe(e, t, l);
    if (s != null) return s;
    const u = Se(e, t, l);
    if (u != null) return u;
    if (t == de) return ae.call(this, this);
    if (t == z) return be(l, (f) => {
      const o = f.key ?? f.name ?? 0, y = V(f, "value", () => c(e, o)), a = V(f, "oldValue", () => {
      });
      return l?.trigger?.(o, y, a, ve(f, "manual"));
    });
    if (t == "@target" || t == S) return e;
    if (t == "x") return () => e?.x ?? e?.[0];
    if (t == "y") return () => e?.y ?? e?.[1];
    if (t == "z") return () => e?.z ?? e?.[2];
    if (t == "w") return () => e?.w ?? e?.[3];
    if (t == "r") return () => e?.r ?? e?.[0];
    if (t == "g") return () => e?.g ?? e?.[1];
    if (t == "b") return () => e?.b ?? e?.[2];
    if (t == "a") return () => e?.a ?? e?.[3];
    const i = c(e, t) ?? (t == "value" ? c(e, h) : null);
    return typeof i == "function" ? new Proxy(typeof i == "function" ? i?.bind?.(e) : i, new Rt(t, e, this)) : i;
  }
  set(e, t, r) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == d && r)
      return this[d] = !!r, !0;
    if (t == d && !r)
      return delete this[d], !0;
    const n = c(e, t), l = [
      "x",
      "y",
      "z",
      "w"
    ], s = [
      "r",
      "g",
      "b",
      "a"
    ], u = l.indexOf(t), i = s.indexOf(t);
    let f = !1;
    return u >= 0 ? f = Reflect.set(e, u, r) : i >= 0 ? f = Reflect.set(e, i, r) : f = Reflect.set(e, t, r), t == "length" && O(n, r) && It(this, e, n, r), !this[d] && typeof t != "symbol" && O(n, r) && p?.get?.(e)?.trigger?.(t, r, n, "set"), f;
  }
  deleteProperty(e, t) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == d)
      return delete this[d], !0;
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
    return !this[d] && t != "length" && t != d && typeof t != "symbol" && r != null && p.get(e)?.trigger?.(t, t, r, "delete"), n;
  }
}, Mt = class {
  [d];
  constructor() {
  }
  get(e, t, r) {
    if ([
      S,
      k,
      "@target",
      "deref",
      "then",
      "catch",
      "finally"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? B(e, c(e, t)) : c(e, t);
    const n = p.get(e) ?? p.get(c(e, "value") ?? e), l = pe(e, t, n);
    if (l != null) return l;
    c(e, t) == null && t != "value" && P(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const s = Se(e, t, n);
    return s ?? (t == de ? ae.call(this, this) : t == z ? be(n, (u) => {
      const i = Ge(e, u.key ?? u.name ?? ce(e) ?? "value"), f = V(u, "oldValue", () => i == "value" || i == ce(e) ? c(e, h) : void 0), o = V(u, "value", () => xt(e, i));
      return n?.trigger?.(i, o, f, ve(u, "manual"));
    }) : t == Symbol.toPrimitive ? (u) => {
      const i = D(e, t);
      return c(i, t) ? c(i, t)?.(u) : g(i) ? E(i, u) : g(c(i, "value")) ? E(c(i, "value"), u) : E(c(i, "value") ?? i, u);
    } : t == Symbol.toStringTag ? () => {
      const u = D(e, t);
      return c(u, t) ? c(u, t)?.() : g(u) ? String(u ?? "") || "" : g(c(u, "value")) ? String(c(u, "value") ?? "") || "" : String(c(u, "value") ?? u ?? "") || "";
    } : t == "toString" ? () => {
      const u = D(e, t);
      return c(u, t) ? c(u, t)?.() : c(u, Symbol.toStringTag) ? c(u, Symbol.toStringTag)?.() : g(u) ? String(u ?? "") || "" : g(c(u, "value")) ? String(c(u, "value") ?? "") || "" : String(c(u, "value") ?? u ?? "") || "";
    } : t == "valueOf" ? () => {
      const u = D(e, t);
      return c(u, t) ? c(u, t)?.() : c(u, Symbol.toPrimitive) ? c(u, Symbol.toPrimitive)?.() : g(u) ? u : g(c(u, "value")) ? c(u, "value") : c(u, "value") ?? u;
    } : typeof t == "symbol" && (t in e || c(e, t) != null) ? c(e, t) : D(e, t));
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
    const n = Y(e, t);
    return n ?? ut(r, (l) => {
      const s = Y(l, t);
      if (s != null) return s;
      if (t == d && r)
        return this[d] = !!r, !0;
      if (t == d && !r)
        return delete this[d], !0;
      const u = e;
      if (c(e, t) == null && t != "value" && P(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), typeof t == "symbol" && !(c(e, t) != null && t in e)) return;
      const i = Ge(e, t), f = t == "value" ? c(e, h) ?? c(e, t) : c(e, t);
      e[t] = l;
      const o = c(e, t) ?? l;
      return !this[d] && typeof t != "symbol" && (c(e, ot) ?? O)?.(f, o) && (p.get(e) ?? p.get(u))?.trigger?.(i, l, f), !0;
    });
  }
  defineProperty(e, t, r) {
    const n = Y(e, t);
    if (n != null) return n;
    if (t == d && r.value)
      return this[d] = !!r.value, !0;
    if (t == d && !r.value)
      return delete this[d], !0;
    if (c(e, t) == null && t != "value" && P(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), r.get == null && r.set == null) return Reflect.defineProperty(e, t, r);
    const l = c(e, t), s = Reflect.defineProperty(e, t, {
      get: r.get,
      set: r.set,
      enumerable: r.enumerable ?? !0,
      configurable: r.configurable ?? !0
    });
    return Tt(e, t, l), s;
  }
  deleteProperty(e, t) {
    if (t == d)
      return delete this[d], !0;
    c(e, t) == null && t != "value" && P(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
    return !this[d] && t != d && typeof t != "symbol" && p.get(e)?.trigger?.(t, null, r, "delete"), n;
  }
}, Et = class {
  [d];
  constructor() {
  }
  get(e, t, r) {
    if ([
      S,
      k,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? B(e, c(e, t)) : c(e, t);
    const n = p.get(e), l = pe(e, t, n);
    if (l != null) return l;
    const s = Se(e, t, n);
    if (s != null) return s;
    e = c(e, S) ?? c(e, k) ?? e;
    const u = B(e, c(e, t));
    return typeof t == "symbol" && (t in e || c(e, t) != null) ? u : t == de ? ae.call(this, this) : t == z ? be(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = V(i, "value", () => e.get(f));
      if (o == null && !M(i, "value")) return;
      const y = V(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, ve(i, "manual"));
    }) : t == "clear" ? () => {
      const i = Array.from(e?.entries?.() || []), f = u();
      return i.forEach(([o, y]) => {
        this[d] || p.get(e)?.trigger?.(o, null, y, "delete");
      }), f;
    } : t == "delete" ? (i, f = null) => {
      const o = e.has(i), y = e.get(i), a = u(i);
      return !this[d] && o && p.get(e)?.trigger?.(i, null, y, "delete"), a;
    } : t == "set" ? (i, f) => st(f, (o) => {
      const y = e.has(i), a = e.get(i), v = u(i, o);
      return (!y || O(a, o)) && (this[d] || p.get(e)?.trigger?.(i, o, y ? a : null, y ? "set" : "add")), v;
    }) : u;
  }
  set(e, t, r) {
    return t == d ? (this[d] = !!r, !0) : t == d && !r ? (delete this[d], !0) : Reflect.set(e, t, r);
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
    return t == d ? (delete this[d], !0) : Reflect.deleteProperty(e, t);
  }
}, kt = class {
  [d] = !1;
  constructor() {
  }
  get(e, t, r) {
    if ([
      S,
      k,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? B(e, c(e, t)) : c(e, t);
    const n = p.get(e), l = pe(e, t, n);
    if (l != null) return l;
    const s = Se(e, t, n);
    if (s != null) return s;
    e = c(e, S) ?? c(e, k) ?? e;
    const u = B(e, c(e, t));
    return typeof t == "symbol" && (t in e || c(e, t) != null) ? u : t == de ? ae.call(this, this) : t == z ? be(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = V(i, "value", () => e.has(f)), y = V(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, ve(i, "manual"));
    }) : t == "clear" ? () => {
      const i = Array.from(e?.values?.() || []), f = u();
      return i.forEach((o) => {
        this[d] || p.get(e)?.trigger?.(null, null, o, "delete");
      }), f;
    } : t == "delete" ? (i) => {
      const f = e.has(i), o = f ? i : null, y = u(i);
      return !this[d] && f && p.get(e)?.trigger?.(i, null, o, "delete"), y;
    } : t == "add" ? (i) => {
      const f = e.has(i), o = f ? i : null, y = u(i);
      return f || this[d] || p.get(e)?.trigger?.(i, i, o, "add"), y;
    } : u;
  }
  set(e, t, r) {
    return t == d && r ? (this[d] = !!r, !0) : t == d && !r ? (delete this[d], !0) : Reflect.set(e, t, r);
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
    return t == d ? (delete this[d], !0) : Reflect.deleteProperty(e, t);
  }
}, j = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[S] || e?.[te])), xe = (e) => j(e) ? e : le(e, new Pt()), $t = (e) => j(e) ? e : le(e, new Mt()), _t = (e) => j(e) ? e : le(e, new Et()), Wt = (e) => j(e) ? e : le(e, new kt()), Vt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = x({
    [ne]: r ? e : null,
    [h]: r ? 0 : Number($(e) || 0) || 0,
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return E((typeof this?.[h] != "object" ? this?.[h] : this?.[h]?.value || 0) ?? 0, l);
    },
    set value(l) {
      this[h] = (l != null && !Number.isNaN(l) ? Number(l) : this[h]) || 0;
    },
    get value() {
      return Number(this[h] || 0) || 0;
    }
  });
  return e?.then?.((l) => n.value = l), n;
}, zt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = x({
    [ne]: r ? e : null,
    [h]: (r ? "" : String($(typeof e == "number" ? String(e) : e || ""))) ?? "",
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[h] ?? "") ?? "";
    },
    [Symbol?.toPrimitive](l) {
      return E(this?.[h] ?? "", l);
    },
    set value(l) {
      this[h] = String(typeof l == "number" ? String(l) : l || "") ?? "";
    },
    get value() {
      return String(this[h] ?? "") ?? "";
    }
  });
  return e?.then?.((l) => n.value = l), n;
}, Ct = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = x({
    [ne]: r ? e : null,
    [h]: (r ? !1 : ($(e) != null ? typeof $(e) == "string" ? !0 : !!$(e) : !1) || !1) || !1,
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return E(!!this?.[h] || !1, l);
    },
    set value(l) {
      this[h] = (l != null ? typeof l == "string" ? !0 : !!l : this[h]) || !1;
    },
    get value() {
      return this[h] || !1;
    }
  });
  return e?.then?.((l) => n.value = l), n;
}, Ke = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = x({
    [ne]: r ? e : null,
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this.value ?? "") || "";
    },
    [Symbol?.toPrimitive](l) {
      return E(this.value, l);
    },
    value: r ? null : $(e)
  });
  return e?.then?.((l) => n.value = l), b(e, (l) => {
    n?.[z]?.();
  }), n;
}, we = (e, t) => {
  if (e == null || typeof e != "object" && typeof e != "function") return e;
  try {
    Object.defineProperty(e, fe, {
      value: t,
      writable: !0,
      configurable: !0
    });
  } catch {
    try {
      e[fe] = t;
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
}, Nt = (e, t = "value", r, n) => {
  if (g(e) || !e) return e;
  Array.isArray(e) && e.length == 2 && e[0] != null && (e[0] instanceof Map || e[0] instanceof WeakMap || e[0] instanceof Set || e[0] instanceof WeakSet) ? ((t == null || t === "value") && (t = e[1]), e = e[0]) : Array.isArray(e) && !L(e?.[1], e) && (Array.isArray(e?.[0]) || typeof e?.[0] == "object" || typeof e?.[0] == "function") && (e = e?.[0]);
  const l = e instanceof Map || e instanceof WeakMap, s = e instanceof Set || e instanceof WeakSet;
  if (l || s) {
    if (t == null) return;
  } else if ((t ??= Array.isArray(e) ? null : "value") == null || L(t, e)) return;
  const u = () => l ? e.get(t) : s ? e.has(t) : e?.[t], i = (a) => l ? (e.set(t, a), a) : s ? (a ? e.add(t) : e.delete(t), e.has(t)) : e[t] = a;
  l && r !== void 0 && !e.has(t) ? e.set(t, r) : s && r && !e.has(t) && e.add(t);
  const f = u();
  if (!s && t != null && P(f) && _(f)) return we(Gt(f), t);
  if (!l && !s && t && typeof e?.getProperty == "function" && _(e?.getProperty?.(t))) return we(e?.getProperty?.(t), t);
  !l && !s && (e[t] ??= r ?? e[t]);
  const o = x({
    [h]: s ? !!u() : u() ?? r,
    [G]: n,
    [Symbol?.toStringTag]() {
      return String(u() ?? this[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return E(u(), a);
    },
    set value(a) {
      if (o[Ve] = !0, s) this[h] = i(a);
      else {
        const v = a ?? lt(u());
        this[h] = i(v);
      }
      o[Ve] = !1;
    },
    get value() {
      const a = u();
      return this[h] = s ? !!a : a ?? this[h];
    }
  });
  we(o, t);
  const y = b(e, (a, v, m, A) => {
    if (v === t) {
      const w = s ? a != null : a, I = s ? m != null : m;
      o?.[z]?.({
        key: t,
        value: w,
        oldValue: I,
        trigger: A
      });
    }
  });
  return R(o, Symbol.dispose, y), o;
}, Dt = (e, t) => {
  switch (typeof e) {
    case "boolean":
      return Ct(e, t);
    case "number":
      return Vt(e, t);
    case "string":
      return zt(e, t);
    case "object":
      if (e != null) return Ke(x(e), t);
    default:
      return Ke(e, t);
  }
}, Bt = (e, t = "value", r) => {
  const n = _(e) ? e : Dt(e, r);
  return t != null ? Nt(n, t, r) : n;
}, fr = (e, t) => Bt(e, t), Pe = (e, t, r = 100) => {
  if (e?.value ?? e) return setTimeout(() => {
    e.value && t?.();
  }, r);
}, or = (e = 100) => (t, [r], [n]) => {
  let l = Pe(r, t, e);
  n?.addEventListener?.("abort", () => {
    l && clearTimeout(l);
  }, { once: !0 });
}, cr = (e = 100) => (t, [r], [n]) => {
  let l = Pe(r, t, e);
  n?.addEventListener?.("abort", () => {
    l && clearTimeout(l);
  }, { once: !0 }), l || t?.();
};
function x(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || j(e) || (e = $?.(e)) == null || e instanceof Promise || e instanceof WeakRef || j(e)) return e;
  const r = e;
  if (r == null || typeof r == "symbol" || !(typeof r == "object" || typeof r == "function") || r instanceof Promise || r instanceof WeakRef) return r;
  let n = r;
  return Array.isArray(r) ? (n = xe(r), n) : r instanceof Map ? (n = _t(r), n) : r instanceof Set ? (n = Wt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = $t(r)), n);
}
var _ = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[S] || e?.[te] || p?.has?.(e))), Gt = (e) => _(e) ? x(e) : null, yr = (e) => {
  if (e == null || typeof e != "object" && typeof e != "function" || e?.[Symbol.observable] != null) return e;
  try {
    e[Symbol.observable] = self?.compatible;
  } catch {
    console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks");
  }
  return e[te] = (t, r, n) => {
    const l = e?.[Symbol?.observable];
    return l?.()?.affected?.(t, r, n), () => l?.()?.unaffected?.(t, r);
  }, e;
}, H = /* @__PURE__ */ new WeakMap(), Me = (e) => {
  if (!(typeof e == "symbol" || e == null || !(typeof e == "object" || typeof e == "function")))
    return e;
}, ye = "initial", Ee = (e) => {
  const t = e?.[fe] ?? e?.realProp;
  return W(t) ? t : null;
}, ke = (e, t) => {
  const r = Ee(e);
  return r != null && (t == null || t == "value") ? r : t;
}, Kt = (e, t) => t != null && t == Ee(e) ? e?.value : e?.[t], Re = (e, t, r, n) => {
  if (t != null && t == Ee(e)) {
    const l = Kt(e, t);
    if (l != null) return r?.(l, t, null, "set");
  }
  return nt(e, t, r, n);
}, tt = (e, t, r) => {
  const n = he(t);
  if (r == ye) {
    if (!n.triggerImmediately) return;
  } else if (!F(n.affectTypes, r)) return;
  return (l, s, u, ...i) => e?.(l, s, u, r, ...i);
}, Ht = (e, t, r, n = ["*"]) => {
  if (!e || !Me(e)) return;
  const l = t != Symbol.iterator ? ke(e, t) : null;
  let s = e?.[ee] ?? p.get(e);
  e = e?.[S] ?? e, queueMicrotask(() => {
    const i = tt(r, n, ye);
    i && (l != null && l != Symbol.iterator ? Re(e, l, i, null) : Fe(e, i, null));
  });
  let u = s?.affected?.(r, l, n);
  return e?.[Symbol.dispose] || (R(u, Symbol.dispose, u), R(u, Symbol.asyncDispose, u), R(e, Symbol.dispose, u), R(e, Symbol.asyncDispose, u)), u;
}, Ft = (e, t, r, n = ["*"]) => {
  const l = he(n).affectTypes, s = {};
  let u = e?.value;
  const i = (f) => {
    const o = f?.target?.value;
    F(l, "set") && r?.(o, "value", u, "set", f), u = o;
  };
  return e?.addEventListener?.("change", i, s), () => e?.removeEventListener?.("change", i, s);
}, Z = (e) => Array.isArray(e) && e?.length == 2 && Me(e?.[0]) && (W(e?.[1]) || e?.[1] == Symbol.iterator), qt = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), jt = (e) => e == null ? [] : Array.isArray(e) && !Z(e) && !_(e) ? e : [e], Ut = (e) => {
  if (Z(e)) {
    const t = e?.[0];
    return {
      source: e,
      target: t,
      prop: ke(t, e?.[1])
    };
  }
  return {
    source: e,
    target: e,
    prop: null
  };
}, Jt = (e, t, r, n, l, s, u) => ({
  source: e,
  target: t,
  value: r,
  prop: n,
  name: n,
  oldValue: l,
  trigger: s,
  args: u
}), Qt = (e, t, r, n = ["*"]) => {
  const l = W(e?.[1]) ? e?.[1] : null;
  return b(e?.[0], l, r, n);
}, Xt = (e, t, r, n = ["*"]) => e?.then?.((l) => b?.(l, t, r, n))?.catch?.((l) => (console.warn(l), null)), b = (e, t, r = () => {
}, n) => {
  if (typeof t == "function" ? (n = r, r = t, t = null) : t = ke(e, t), (typeof r == "object" || Array.isArray(r)) && (n = r, r = () => {
  }), (g(e) || typeof e == "symbol") && he(n).triggerImmediately)
    return ze(globalThis?.Promise?.try?.(() => r?.(e, null, null, null, ye)));
  if (typeof e?.[te] == "function") return e?.[te]?.(r, t, n);
  if (Me(e)) {
    const l = e;
    if (H?.has?.(e = e?.[S] ?? e)) return H?.get?.(e)?.(l, t, r, n);
    if (_(l) || Z(e) && _(e?.[0]))
      return Oe(e) ? H?.getOrInsert?.(e, Xt)?.(e, t, r, n) : Z(e) ? H?.getOrInsert?.(e, Qt)?.(e, t, r, n) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? H?.getOrInsert?.(e, Ft)?.(e, t, r, n) : H?.getOrInsert?.(e, Ht)?.(l, t, r, n);
    {
      const s = tt(r, n, ye);
      return s ? ze(globalThis?.Promise?.try?.(() => Z(e) ? Re?.(e?.[0], e?.[1], s, null) : t != null && t != Symbol.iterator ? Re?.(e, t, s, null) : Fe?.(e, s, null))) : void 0;
    }
  }
};
function Yt(e, t, r) {
  if (e == null || typeof e != "function") return;
  if (qt(t) && r === void 0) return De(e, t);
  if (t == null) return De(e, r);
  const n = Le(r), l = {
    affectTypes: n.affectTypes,
    triggerImmediately: n.triggerImmediately
  }, s = jt(t).map((u) => {
    const i = Ut(u);
    return b(i.target, i.prop, (f, o, y, a, ...v) => e(Jt(i.source, i.target, f, o, y, a ?? null, v)), l);
  }).filter((u) => typeof u == "function");
  return () => s.forEach((u) => u?.());
}
function ar(e, t, r) {
  return Yt(t, e, r);
}
var dr = (e) => e instanceof Set ? rt(e) : e instanceof Map ? rr(e) : e, Zt = class {
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
}, Ae = new Zt();
function Lt(e, t, r = ["*"]) {
  if (!e || typeof e != "object" && typeof e != "function") return;
  if (Ae.has([e, t])) return Ae.get([e, t]);
  const n = (l, s, u, i) => {
    if (s == "value") {
      const f = (u?.value ?? u)?.entries?.(), o = e?.value ?? l?.value ?? l;
      if (f) for (const [y, a] of f) {
        const v = a ?? (u?.value ?? u)?.[y] ?? null, m = o?.[y];
        v == null && m != null ? t(m, y, null, "add") : v != null && m == null ? t(null, y, v, "delete") : O(v, m) && t(m, y, v, "set");
      }
      return Lt(l ?? e?.value, t, r);
    }
    return s == null ? void 0 : e[s];
  };
  return Ae.getOrInsertComputed([e, t], () => e instanceof Set ? b([rt(e), Symbol.iterator], t, r) : e instanceof Map ? b(e, t, r) : P(e) ? b(e, n, r) : Array.isArray(e) && !(e?.length == 2 && W(e?.[1]) && _(e?.[0])) ? b([e, Symbol.iterator], t, r) : b(e, t, r));
}
function Te(e, t) {
  return yt(e, (r) => {
    const n = Array.isArray(r) && r?.length == 2 && ["object", "function"].indexOf(typeof r?.[0]) >= 0 && W(r?.[1]), l = n ? r?.[1] : null;
    r = n && l != null ? r?.[0] ?? r : r;
    const s = typeof r == "object" || typeof r == "function" ? r?.[S] ?? r : r;
    (r?.[ee] ?? p.get(s))?.unaffected?.(t, l);
  });
}
var er = (e, t, r) => (b(t, null, (n, l) => {
  se(e, n, l, !0);
}), r?.(() => e, (n) => {
  for (const l in n) se(t, n[l], l, !0);
}, { deep: !0 }), e), hr = (e, t, r) => er(t(ue(e)), e, r), vr = (e, t, r = () => "") => b(t, null, (n, l) => {
  l == r() && se(e, n, null, !0);
}), br = (e = []) => {
  const t = x({ value: 0 }), r = (i) => typeof i == "function" ? i() : P(i) ? i.value : i, l = nr([t, "value"], () => e.findIndex((i) => !!r(i)), "value"), s = () => {
    t.value++;
  }, u = [];
  _(e) && u.push(b(e, s, {
    affectTypes: [
      "add",
      "set",
      "delete"
    ],
    triggerImmediately: !1
  }));
  for (const i of e) P(i) && u.push(b([i, "value"], s, {
    affectTypes: ["setter"],
    triggerImmediately: !1
  }));
  return R(l, Symbol.dispose, () => u.forEach((i) => i?.())), l;
}, tr = (e, t, r, n) => {
  if (g(e)) return e ? t : r;
  const l = () => t, s = () => r, u = (o) => (o != null && (e.value = P(o) ? o?.value : o), (P(e) ? e?.value : e) ? l() : s()), i = x({
    [h]: u(),
    [G]: n,
    [Symbol?.toStringTag]() {
      return String(u() ?? this[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](o) {
      return E(u() ?? this[h], o);
    },
    set value(o) {
      this[h] = u(o);
    },
    get value() {
      return this[h] = u() ?? this[h];
    }
  }), f = b([e, "value"], () => {
    const o = i?.[h], y = u();
    i[h] = y, i?.[z]?.({
      key: "value",
      value: y,
      oldValue: o,
      trigger: "manual"
    });
  });
  return R(i, Symbol.dispose, f), i;
}, pr = tr, Sr = (e, t, r) => {
  r || (r = x({}));
  const n = b(e, (l, s, u) => {
    if (s == null) return;
    const i = t?.(l, s, u);
    typeof i == "object" ? it(r, i) : O(r[s], i) && (r[s] = i);
  });
  return r && R(r, Symbol.dispose, n), r;
}, mr = (...e) => {
  const t = x({});
  return e?.forEach?.((r) => b(r, (n, l, s) => {
    l != null && O(t[l], n) && (t[l] = n);
  })), t;
}, rt = (e) => {
  const t = x([]);
  return t.push(...Array.from(e?.values?.() || [])), R(t, Symbol.dispose, b(e, (r, n, l) => {
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
}, rr = (e) => {
  const t = x([]), r = Array.from(e.entries());
  return t.push(...r), R(t, Symbol.dispose, b(e, (n, l, s) => {
    if (O(n, s) || s == null && n != null || s != null && n == null)
      if (s != null && n == null) {
        let u = t.findIndex(([i, f]) => i == l);
        u < 0 && (u = t.findLastIndex(([i, f]) => s === f)), u >= 0 && t.splice(u, 1);
      } else {
        let u = t.findIndex(([i, f]) => i == l);
        u >= 0 && u < t.length ? O(t[u]?.[1], n) && (t[u] = [l, n]) : t.push([l, n]);
      }
  })), t;
}, N = /* @__PURE__ */ new WeakMap(), He = (e, t, r = "value") => {
  const n = typeof e?.[1] == "function" && e?.length == 2, l = typeof t?.[1] == "function" && t?.length == 2, s = l ? t?.[1] : null, u = (W(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let i = u && !n ? e?.[1] : Array.isArray(e) ? null : r;
  !u && !n && (e = [e, i]), n && (e[1] = i);
  const f = (W(t?.[1]) || t?.[1] == Symbol.iterator) && t?.length == 2;
  let o = f && !l ? t?.[1] : Array.isArray(t) ? null : r;
  if (!f && !l && (t = [t, o]), l && (t[1] = o), i == null || o == null || L(i, e?.[0]) || L(o, t?.[0])) return;
  if (!((typeof t?.[0] == "object" || typeof t?.[0] == "function") && t?.[0] != null) && !Array.isArray(e[0]))
    return ie(t, () => {
      e[0][i] = t?.[0];
    }), () => {
    };
  const y = (K, U) => {
    const C = m?.deref?.(), J = v?.deref?.();
    if (N?.get?.(C)?.get?.(i)?.bound == J) {
      let me = null;
      const $e = N?.get?.(C)?.get?.(i)?.cmpfx;
      ie(J, () => {
        typeof $e == "function" ? me = $e?.(We(J) ?? K, U, null) : me = J?.[U] ?? K;
      });
      const _e = We(me);
      O(C[i], _e) && ie(J, () => {
        C[i] = _e;
      });
    } else N?.get?.(C)?.get?.(i)?.dispose?.();
  }, a = () => {
    const K = m?.deref?.(), U = N?.get?.(K), C = U?.get?.(i);
    U?.delete?.(i), C?.unsub?.();
  }, v = t?.[0] != null && (typeof t?.[0] == "object" || typeof t?.[0] == "function") && !(t?.[0] instanceof WeakRef || typeof t?.[0]?.deref == "function") ? new WeakRef(t?.[0]) : t?.[0], m = e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function") && !(e?.[0] instanceof WeakRef || typeof e?.[0]?.deref == "function") ? new WeakRef(e?.[0]) : e?.[0];
  let A = {
    compute: y,
    dispose: a,
    cmpfx: s
  };
  const w = m?.deref?.(), I = v?.deref?.();
  return m instanceof WeakRef && (N?.get?.(w)?.get?.(i)?.bound != I && N?.get?.(w)?.delete?.(i), A = N?.getOrInsert?.(w, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(i, () => ({
    bound: I,
    cmpfx: s,
    unsub: null,
    compute: y,
    dispose: a
  })), A.unsub = b(t, y), A.cmpfx = s, R(w, Symbol.dispose, A?.dispose), R(I, Symbol.dispose, A?.dispose)), I && !Array.isArray(I) && ie(w, () => {
    I[o] ??= w?.[i] ?? I[o];
  }), A?.dispose;
}, gr = (e, t, r = "value") => {
  const n = [He(e, t, r), He(t, e, r)];
  return () => n?.map?.((l) => l?.());
}, nr = (e, t, r, n = "value") => {
  const l = typeof e?.[1] == "function" && e?.length == 2, s = (W(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let u = s && !l ? e?.[1] : Array.isArray(e) ? null : n;
  if (!s && !l && (e = [s ? e?.[0] : e, u]), l && (e[1] = u), u == null || L(u, e?.[0])) return;
  const i = (a) => {
    let v;
    return a != null && (v = e[0][u], e[0][u] = a), t?.(e?.[0]?.[u], u, v);
  }, f = i(), o = x({
    [ne]: void 0,
    [h]: f,
    [G]: r,
    [Symbol?.toStringTag]() {
      return String(i() ?? this[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return E(i() ?? this[h], a);
    },
    set value(a) {
      this[h] = i(a);
    },
    get value() {
      return this[h] = i() ?? this[h];
    }
  }), y = b([e?.[0] ?? e, u ?? "value"], () => {
    const a = o?.[h], v = i();
    o[h] = v, o?.[z]?.({
      key: "value",
      value: v,
      oldValue: a,
      trigger: "manual"
    });
  });
  return R(o, Symbol.dispose, y), o;
}, wr = (e, t, r = 100) => {
  let n;
  return b(e, "value", (l) => {
    !l && n ? (clearTimeout(n), n = null) : l && !n && (n = Pe(e, t, r) ?? n);
  });
};
export {
  te as $affected,
  Dt as $ref,
  z as $trigger,
  ft as $triggerControl,
  de as $triggerLess,
  d as $triggerLock,
  dt as AssignObjectHandler,
  Zt as DoubleWeakMap,
  R as addToCallChain,
  b as affected,
  He as assign,
  N as assignMap,
  er as bindBy,
  vr as bindByKey,
  Ct as booleanRef,
  nr as computed,
  pr as conditional,
  br as conditionalIndex,
  tr as conditionalRef,
  or as delayedBehavior,
  cr as delayedOrInstantBehavior,
  wr as delayedSubscribe,
  $ as deref,
  hr as derivate,
  Yt as effect,
  ar as effected,
  _ as isObservable,
  Lt as iterated,
  gr as link,
  dr as makeArrayObservable,
  ur as makeObjectAssignable,
  Vt as numberRef,
  rr as observableByMap,
  rt as observableBySet,
  x as observe,
  fr as promised,
  Nt as propRef,
  Gt as recoverReactive,
  Bt as ref,
  Sr as remap,
  ue as safe,
  H as specializedSubscribe,
  zt as stringRef,
  Ht as subscribeDirectly,
  Ft as subscribeInput,
  Qt as subscribePaired,
  Xt as subscribeThenable,
  Pe as triggerWithDelay,
  Te as unaffected,
  mr as unified,
  ct as unwrap,
  yr as useObservable,
  Ke as wrapRef,
  ir as wrapSetAsArray
};
