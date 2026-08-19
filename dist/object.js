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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgbWFrZVRyaWdnZXJMZXNzLCBvYmplY3RBc3NpZ24sIG9iamVjdEFzc2lnbk5vdEVxdWFsLCBwb3RlbnRpYWxseUFzeW5jLCBwb3RlbnRpYWxseUFzeW5jTWFwLCB0cnlQYXJzZUJ5SGludCB9IGZyb20gXCJAZmVzdC1saWIvY29yZVwiO1xuXG4vLyNyZWdpb24gc3JjL3dyYXAvU3ltYm9sLnRzXG5TeW1ib2wub2JzZXJ2YWJsZSB8fD0gU3ltYm9sLmZvcihcIm9ic2VydmFibGVcIik7XG5TeW1ib2wuc3Vic2NyaWJlIHx8PSBTeW1ib2wuZm9yKFwic3Vic2NyaWJlXCIpO1xuU3ltYm9sLnVuc3Vic2NyaWJlIHx8PSBTeW1ib2wuZm9yKFwidW5zdWJzY3JpYmVcIik7XG52YXIgJHZhbHVlID0gU3ltYm9sLmZvcihcIkB2YWx1ZVwiKTtcbnZhciAkZXh0cmFjdEtleSQgPSBTeW1ib2wuZm9yKFwiQGV4dHJhY3RcIik7XG52YXIgJG9yaWdpbmFsS2V5JCA9IFN5bWJvbC5mb3IoXCJAb3JpZ2luXCIpO1xudmFyICRyZWdpc3RyeUtleSQgPSBTeW1ib2wuZm9yKFwiQHJlZ2lzdHJ5XCIpO1xudmFyICRiZWhhdmlvciA9IFN5bWJvbC5mb3IoXCJAYmVoYXZpb3JcIik7XG52YXIgJHByb21pc2UgPSBTeW1ib2wuZm9yKFwiQHByb21pc2VcIik7XG52YXIgJHRyaWdnZXJMZXNzID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyLWxlc3NcIik7XG52YXIgJHRyaWdnZXJMb2NrID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyLWxvY2tcIik7XG52YXIgJHRyaWdnZXJDb250cm9sID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyLWNvbnRyb2xcIik7XG52YXIgJHRyaWdnZXIgPSBTeW1ib2wuZm9yKFwiQHRyaWdnZXJcIik7XG52YXIgJGFmZmVjdGVkID0gU3ltYm9sLmZvcihcIkBzdWJzY3JpYmVcIik7XG52YXIgJGlzTm90RXF1YWwgPSBTeW1ib2wuZm9yKFwiQGlzTm90RXF1YWxcIik7XG52YXIgJHJlYWxQcm9wID0gU3ltYm9sLmZvcihcIkByZWFsUHJvcFwiKTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3dyYXAvVXRpbHMudHNcbnZhciAkb3JpZ2luYWxPYmplY3RzJCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHNhZmUgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHVud3JhcCA9IHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0IDogdGFyZ2V0LCBtYXBwZWQgPSAoZSkgPT4gc2FmZShlKTtcblx0aWYgKEFycmF5LmlzQXJyYXkodW53cmFwKSkgcmV0dXJuIHVud3JhcD8ubWFwPy4obWFwcGVkKSB8fCBBcnJheS5mcm9tKHVud3JhcCB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkgfHwgW107XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIE1hcCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrTWFwKSByZXR1cm4gbmV3IE1hcChBcnJheS5mcm9tKHVud3JhcD8uZW50cmllcz8uKCkgfHwgW10pPy5tYXA/LigoW0ssIFZdKSA9PiBbSywgc2FmZShWKV0pKTtcblx0ZWxzZSBpZiAodW53cmFwIGluc3RhbmNlb2YgU2V0IHx8IHVud3JhcCBpbnN0YW5jZW9mIFdlYWtTZXQpIHJldHVybiBuZXcgU2V0KEFycmF5LmZyb20odW53cmFwPy52YWx1ZXM/LigpIHx8IFtdKT8ubWFwPy4obWFwcGVkKSk7XG5cdGVsc2UgaWYgKHVud3JhcCAhPSBudWxsICYmIHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJvYmplY3RcIikgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhBcnJheS5mcm9tKE9iamVjdC5lbnRyaWVzKHVud3JhcCB8fCB7fSkgfHwgW10pPy5maWx0ZXI/LigoW0tdKSA9PiBLICE9ICRleHRyYWN0S2V5JCAmJiBLICE9ICRvcmlnaW5hbEtleSQgJiYgSyAhPSAkcmVnaXN0cnlLZXkkKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdHJldHVybiB1bndyYXA7XG59O1xudmFyIHVud3JhcCA9IChhcnIpID0+IHtcblx0cmV0dXJuIGFycj8uWyRleHRyYWN0S2V5JF0gPz8gYXJyPy5bXCJAdGFyZ2V0XCJdID8/IGFycjtcbn07XG52YXIgZGVyZWYgPSAodGFyZ2V0LCBkaXNjb3VudFZhbHVlID0gZmFsc2UpID0+IHtcblx0Y29uc3Qgb3JpZ2luYWwgPSB0YXJnZXQ7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJzeW1ib2xcIikgcmV0dXJuIHRhcmdldDtcblx0aWYgKHRhcmdldCAhPSBudWxsICYmICh0YXJnZXQgaW5zdGFuY2VvZiBXZWFrUmVmIHx8IFwiZGVyZWZcIiBpbiB0YXJnZXQgJiYgdHlwZW9mIHRhcmdldD8uZGVyZWYgPT0gXCJmdW5jdGlvblwiKSkgdGFyZ2V0ID0gdGFyZ2V0Py5kZXJlZj8uKCk7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSkge1xuXHRcdHRhcmdldCA9IHVud3JhcCh0YXJnZXQpO1xuXHRcdGNvbnN0ICR2YWwgPSBkaXNjb3VudFZhbHVlICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgdGFyZ2V0Py52YWx1ZTtcblx0XHRpZiAoJHZhbCAhPSBudWxsICYmICh0eXBlb2YgJHZhbCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiAkdmFsID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9ICR2YWw7XG5cdFx0aWYgKG9yaWdpbmFsICE9IHRhcmdldCkgcmV0dXJuIGRlcmVmKHRhcmdldCwgZGlzY291bnRWYWx1ZSk7XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbn07XG52YXIgaXNUaGVuYWJsZSA9ICh2YWwpID0+IHZhbCAhPSBudWxsICYmIHR5cGVvZiB2YWwudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xudmFyIHdpdGhQcm9taXNlID0gKHRhcmdldCwgY2IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKHRhcmdldCkgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjYj8uKHRhcmdldCk7XG5cdGlmIChpc1RoZW5hYmxlKHRhcmdldCkpIHJldHVybiB0YXJnZXQudGhlbihjYik7XG5cdGlmICh0YXJnZXQ/LnByb21pc2UgJiYgaXNUaGVuYWJsZSh0YXJnZXQucHJvbWlzZSkpIHJldHVybiB0YXJnZXQucHJvbWlzZS50aGVuKGNiKTtcblx0cmV0dXJuIGNiPy4odGFyZ2V0KTtcbn07XG52YXIgZGlzcG9zZU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGRpc3Bvc2VSZWdpc3RyeSA9IG5ldyBGaW5hbGl6YXRpb25SZWdpc3RyeSgoY2FsbHN0YWNrKSA9PiB7XG5cdGNhbGxzdGFjaz8uZm9yRWFjaD8uKChjYikgPT4gY2I/LigpKTtcbn0pO1xuZnVuY3Rpb24gYWRkVG9DYWxsQ2hhaW4ob2JqLCBtZXRob2RLZXksIGNhbGxiYWNrKSB7XG5cdGlmICghY2FsbGJhY2sgfHwgdHlwZW9mIGNhbGxiYWNrICE9IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygb2JqICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iaiAhPSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0aWYgKG1ldGhvZEtleSA9PSBTeW1ib2wuZGlzcG9zZSkge1xuXHRcdGNvbnN0IGNoYWluVGFyZ2V0ID0gb2JqPy5bJGV4dHJhY3RLZXkkXSA/PyBvYmo7XG5cdFx0ZGlzcG9zZU1hcD8uZ2V0T3JJbnNlcnRDb21wdXRlZD8uKGNoYWluVGFyZ2V0LCAoKSA9PiB7XG5cdFx0XHRjb25zdCBDYWxsQ2hhaW4gPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHRcdFx0aWYgKHR5cGVvZiBjaGFpblRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjaGFpblRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0ZGlzcG9zZVJlZ2lzdHJ5LnJlZ2lzdGVyKGNoYWluVGFyZ2V0LCBDYWxsQ2hhaW4pO1xuXHRcdFx0XHRkaXNwb3NlTWFwLnNldChjaGFpblRhcmdldCwgQ2FsbENoYWluKTtcblx0XHRcdFx0Y2hhaW5UYXJnZXRbU3ltYm9sLmRpc3Bvc2VdID8/PSAoKSA9PiBDYWxsQ2hhaW4uZm9yRWFjaCgoY2IpID0+IHtcblx0XHRcdFx0XHRjYj8uKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIENhbGxDaGFpbjtcblx0XHR9KT8uYWRkPy4oY2FsbGJhY2spO1xuXHR9IGVsc2Ugb2JqW21ldGhvZEtleV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG5cdFx0Y29uc3Qgb3JpZ2luYWwgPSBvYmo/LlttZXRob2RLZXldO1xuXHRcdGlmICh0eXBlb2Ygb3JpZ2luYWwgPT0gXCJmdW5jdGlvblwiKSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRjYWxsYmFjay5hcHBseSh0aGlzLCBhcmdzKTtcblx0fTtcbn1cbnZhciBpc0FycmF5SW5kZXggPSAocHJvcCkgPT4ge1xuXHRpZiAodHlwZW9mIHByb3AgIT09IFwic3RyaW5nXCIpIHJldHVybiBmYWxzZTtcblx0aWYgKHByb3AgPT09IFwiXCIpIHJldHVybiBmYWxzZTtcblx0Y29uc3QgbnVtID0gTnVtYmVyKHByb3ApO1xuXHRyZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihudW0pICYmIG51bSA+PSAwICYmIFN0cmluZyhudW0pID09PSBwcm9wO1xufTtcbmZ1bmN0aW9uIHdyYXBTZXRBc0FycmF5KHNvdXJjZSA9IFtdLCBvcHRpb25zID0ge30pIHtcblx0bGV0IGJhY2tpbmdTZXQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHRjb25zdCBub3RpZnlEdXBsaWNhdGUgPSAodmFsdWUsIHZpYSwgaW5kZXgpID0+IHtcblx0XHRvcHRpb25zLm9uRHVwbGljYXRlPy4oe1xuXHRcdFx0dmFsdWUsXG5cdFx0XHR2aWEsXG5cdFx0XHRpbmRleFxuXHRcdH0pO1xuXHR9O1xuXHRpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSBiYWNraW5nU2V0ID0gc291cmNlO1xuXHRlbHNlIGZvciAoY29uc3QgaXRlbSBvZiBzb3VyY2UpIHtcblx0XHRpZiAoYmFja2luZ1NldC5oYXMoaXRlbSkpIHtcblx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInB1c2hcIik7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0YmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdH1cblx0Y29uc3Qgc25hcHNob3QgPSAoKSA9PiBBcnJheS5mcm9tKGJhY2tpbmdTZXQpO1xuXHRjb25zdCByZWJ1aWxkRnJvbSA9IChhcnIpID0+IHtcblx0XHRiYWNraW5nU2V0LmNsZWFyKCk7XG5cdFx0Zm9yIChjb25zdCBpdGVtIG9mIGFycikgYmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdH07XG5cdGNvbnN0IG1ldGhvZHMgPSB7XG5cdFx0cHVzaDogKC4uLml0ZW1zKSA9PiB7XG5cdFx0XHRsZXQgc2l6ZSA9IGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoYmFja2luZ1NldC5oYXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJwdXNoXCIpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJhY2tpbmdTZXQuYWRkKGl0ZW0pO1xuXHRcdFx0XHRzaXplKys7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc2l6ZTtcblx0XHR9LFxuXHRcdHBvcDogKCkgPT4ge1xuXHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdGlmICghYXJyLmxlbmd0aCkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gYXJyW2Fyci5sZW5ndGggLSAxXTtcblx0XHRcdGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHNoaWZ0OiAoKSA9PiB7XG5cdFx0XHRjb25zdCBpdGVyYXRvciA9IGJhY2tpbmdTZXQudmFsdWVzKCkubmV4dCgpO1xuXHRcdFx0aWYgKGl0ZXJhdG9yLmRvbmUpIHJldHVybiB2b2lkIDA7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IGl0ZXJhdG9yLnZhbHVlO1xuXHRcdFx0YmFja2luZ1NldC5kZWxldGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0dW5zaGlmdDogKC4uLml0ZW1zKSA9PiB7XG5cdFx0XHRpZiAoIWl0ZW1zLmxlbmd0aCkgcmV0dXJuIGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGNvbnN0IGN1cnJlbnQgPSBzbmFwc2hvdCgpO1xuXHRcdFx0Y29uc3QgdG9QcmVwZW5kID0gW107XG5cdFx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcblx0XHRcdFx0aWYgKGN1cnJlbnQuaW5jbHVkZXMoaXRlbSkgfHwgdG9QcmVwZW5kLmluY2x1ZGVzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwidW5zaGlmdFwiLCAwKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0b1ByZXBlbmQucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHRcdGlmICghdG9QcmVwZW5kLmxlbmd0aCkgcmV0dXJuIGN1cnJlbnQubGVuZ3RoO1xuXHRcdFx0Y29uc3QgbmV4dCA9IFsuLi50b1ByZXBlbmQsIC4uLmN1cnJlbnRdO1xuXHRcdFx0cmVidWlsZEZyb20obmV4dCk7XG5cdFx0XHRyZXR1cm4gbmV4dC5sZW5ndGg7XG5cdFx0fSxcblx0XHRzcGxpY2U6IChzdGFydCwgZGVsZXRlQ291bnQsIC4uLml0ZW1zKSA9PiB7XG5cdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0Y29uc3Qgbm9ybWFsaXplZFN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgoc3RhcnQsIDApLCBhcnIubGVuZ3RoKTtcblx0XHRcdGNvbnN0IGFjdHVhbERlbGV0ZUNvdW50ID0gZGVsZXRlQ291bnQgPT09IHZvaWQgMCA/IGFyci5sZW5ndGggLSBub3JtYWxpemVkU3RhcnQgOiBNYXRoLm1heCgwLCBNYXRoLm1pbihkZWxldGVDb3VudCwgYXJyLmxlbmd0aCAtIG5vcm1hbGl6ZWRTdGFydCkpO1xuXHRcdFx0Y29uc3QgcmVtb3ZlZCA9IGFyci5zcGxpY2Uobm9ybWFsaXplZFN0YXJ0LCBhY3R1YWxEZWxldGVDb3VudCk7XG5cdFx0XHRsZXQgaW5zZXJ0UG9zaXRpb24gPSBub3JtYWxpemVkU3RhcnQ7XG5cdFx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcblx0XHRcdFx0aWYgKGFyci5pbmNsdWRlcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInNwbGljZVwiLCBpbnNlcnRQb3NpdGlvbik7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXJyLnNwbGljZShpbnNlcnRQb3NpdGlvbisrLCAwLCBpdGVtKTtcblx0XHRcdH1cblx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRyZXR1cm4gcmVtb3ZlZDtcblx0XHR9LFxuXHRcdGluY2x1ZGVzOiAodmFsdWUpID0+IGJhY2tpbmdTZXQuaGFzKHZhbHVlKSxcblx0XHRpbmRleE9mOiAodmFsdWUpID0+IHNuYXBzaG90KCkuaW5kZXhPZih2YWx1ZSksXG5cdFx0Y2xlYXI6ICgpID0+IHtcblx0XHRcdGJhY2tpbmdTZXQuY2xlYXIoKTtcblx0XHR9LFxuXHRcdGRlbGV0ZTogKHZhbHVlKSA9PiBiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSksXG5cdFx0dG9BcnJheTogKCkgPT4gc25hcHNob3QoKSxcblx0XHR0b1NldDogKCkgPT4gbmV3IFNldChiYWNraW5nU2V0KSxcblx0XHRbU3ltYm9sLml0ZXJhdG9yXTogKCkgPT4gYmFja2luZ1NldFtTeW1ib2wuaXRlcmF0b3JdKClcblx0fTtcblx0cmV0dXJuIG5ldyBQcm94eShtZXRob2RzLCB7XG5cdFx0Z2V0OiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiBiYWNraW5nU2V0LnNpemU7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSByZXR1cm4gc25hcHNob3QoKVtOdW1iZXIocHJvcCldO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBtZXRob2RzW3Byb3BdO1xuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHRzZXQ6IChfLCBwcm9wLCB2YWx1ZSkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJudW1iZXJcIiB8fCAhTnVtYmVyLmlzRmluaXRlKHZhbHVlKSB8fCB2YWx1ZSA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKFwibGVuZ3RoIG11c3QgYmUgYSBmaW5pdGUgbm9uLW5lZ2F0aXZlIG51bWJlclwiKTtcblx0XHRcdFx0Y29uc3QgbmV4dExlbmd0aCA9IE1hdGguZmxvb3IodmFsdWUpO1xuXHRcdFx0XHRpZiAobmV4dExlbmd0aCA+PSBiYWNraW5nU2V0LnNpemUpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpLnNsaWNlKDAsIG5leHRMZW5ndGgpO1xuXHRcdFx0XHRyZWJ1aWxkRnJvbShhcnIpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+IGFyci5sZW5ndGgpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRjb25zdCBuZXh0VmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0aWYgKGluZGV4IDwgYXJyLmxlbmd0aCkge1xuXHRcdFx0XHRcdGNvbnN0IGN1cnJlbnRWYWx1ZSA9IGFycltpbmRleF07XG5cdFx0XHRcdFx0aWYgKE9iamVjdC5pcyhjdXJyZW50VmFsdWUsIG5leHRWYWx1ZSkpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdGlmIChhcnIuc29tZSgoaXRlbSwgaWR4KSA9PiBpZHggIT09IGluZGV4ICYmIE9iamVjdC5pcyhpdGVtLCBuZXh0VmFsdWUpKSkge1xuXHRcdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKG5leHRWYWx1ZSwgXCJzZXRcIiwgaW5kZXgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFycltpbmRleF0gPSBuZXh0VmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKGFyci5pbmNsdWRlcyhuZXh0VmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUobmV4dFZhbHVlLCBcInNldFwiLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YXJyLnB1c2gobmV4dFZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZWJ1aWxkRnJvbShhcnIpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBSZWZsZWN0LnNldChtZXRob2RzLCBwcm9wLCB2YWx1ZSk7XG5cdFx0fSxcblx0XHRkZWxldGVQcm9wZXJ0eTogKF8sIHByb3ApID0+IHtcblx0XHRcdGlmIChwcm9wID09PSBcImxlbmd0aFwiKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRpZiAoaW5kZXggPj0gYXJyLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHRyZWJ1aWxkRnJvbShhcnIpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KG1ldGhvZHMsIHByb3ApO1xuXHRcdH0sXG5cdFx0b3duS2V5czogKCkgPT4ge1xuXHRcdFx0Y29uc3Qga2V5cyA9IFtdO1xuXHRcdFx0bGV0IGkgPSAwO1xuXHRcdFx0Zm9yIChjb25zdCBfIG9mIGJhY2tpbmdTZXQpIGtleXMucHVzaChTdHJpbmcoaSsrKSk7XG5cdFx0XHRrZXlzLnB1c2goXCJsZW5ndGhcIik7XG5cdFx0XHRyZXR1cm4ga2V5cztcblx0XHR9LFxuXHRcdGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogKF8sIHByb3ApID0+IHtcblx0XHRcdGlmIChwcm9wID09PSBcImxlbmd0aFwiKSByZXR1cm4ge1xuXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuXHRcdFx0XHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRcdHZhbHVlOiBiYWNraW5nU2V0LnNpemVcblx0XHRcdH07XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRpZiAoaW5kZXggPj0gYXJyLmxlbmd0aCkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHR2YWx1ZTogYXJyW2luZGV4XVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG1ldGhvZHMsIHByb3ApO1xuXHRcdH0sXG5cdFx0aGFzOiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiB0cnVlO1xuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0cmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCBiYWNraW5nU2V0LnNpemU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHJvcCBpbiBtZXRob2RzO1xuXHRcdH1cblx0fSk7XG59XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy93cmFwL0Fzc2lnbk9iamVjdC50c1xudmFyIEFzc2lnbk9iamVjdEhhbmRsZXIgPSBjbGFzcyB7XG5cdGNvbnN0cnVjdG9yKCkge31cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0b2JqZWN0QXNzaWduKHRhcmdldCwgdmFsdWUsIG5hbWUpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIGN0eCkge1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiKSByZXR1cm4gdGFyZ2V0Py5bbmFtZV0gPz8gdGFyZ2V0O1xuXHRcdHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIG5hbWUsIGN0eCk7XG5cdH1cbn07XG52YXIgbWFrZU9iamVjdEFzc2lnbmFibGUgPSAob2JqKSA9PiB7XG5cdGlmIChvYmo/Llskb3JpZ2luYWxLZXkkXSB8fCAkb3JpZ2luYWxPYmplY3RzJC5oYXMob2JqKSkgcmV0dXJuIG9iajtcblx0Y29uc3QgcHggPSBuZXcgUHJveHkob2JqLCBuZXcgQXNzaWduT2JqZWN0SGFuZGxlcigpKTtcblx0JG9yaWdpbmFsT2JqZWN0cyQuc2V0KHB4LCBvYmopO1xuXHRyZXR1cm4gcHg7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9TdWJzY3JpcHQudHNcbnZhciB3aXRoVW5zdWJTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHdpdGhVbnN1YlwiKTtcbmdsb2JhbFRoaXNbd2l0aFVuc3ViU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgd2l0aFVuc3ViID0gZ2xvYmFsVGhpc1t3aXRoVW5zdWJTeW1ib2xdO1xudmFyIGNvbXBsZXRlV2l0aFVuc3ViID0gKHN1YnNjcmliZXIsIHdlYWssIGhhbmRsZXIpID0+IHtcblx0cmV0dXJuIHdpdGhVbnN1Yi5nZXRPckluc2VydChzdWJzY3JpYmVyLCAoKSA9PiB7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSB3ZWFrPy5kZXJlZj8uKCk7XG5cdFx0cmVnaXN0cnk/LmFmZmVjdGVkPy4oaGFuZGxlcik7XG5cdFx0Y29uc3Qgc2F2Q29tcGxldGUgPSBzdWJzY3JpYmVyPy5jb21wbGV0ZT8uYmluZD8uKHN1YnNjcmliZXIpO1xuXHRcdGNvbnN0IHVuYWZmZWN0ZWQgPSAoKSA9PiB7XG5cdFx0XHRjb25zdCByID0gc2F2Q29tcGxldGU/LigpO1xuXHRcdFx0cmVnaXN0cnk/LnVuYWZmZWN0ZWQ/LihoYW5kbGVyKTtcblx0XHRcdHJldHVybiByO1xuXHRcdH07XG5cdFx0c3Vic2NyaWJlci5jb21wbGV0ZSA9IHVuYWZmZWN0ZWQ7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVuYWZmZWN0ZWQsXG5cdFx0XHRbU3ltYm9sLmRpc3Bvc2VdOiB1bmFmZmVjdGVkLFxuXHRcdFx0W1N5bWJvbC5hc3luY0Rpc3Bvc2VdOiB1bmFmZmVjdGVkXG5cdFx0fTtcblx0fSk7XG59O1xudmFyIHN1YnNjcmlwdFJlZ2lzdHJ5U3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0BzdWJzY3JpcHRSZWdpc3RyeVwiKTtcbmdsb2JhbFRoaXNbc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzdWJzY3JpcHRSZWdpc3RyeSA9IGdsb2JhbFRoaXNbc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQGdsb2JhbEVmZmVjdExpc3RlbmVyc1wiKTtcbmdsb2JhbFRoaXNbZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbnZhciBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMgPSBnbG9iYWxUaGlzW2dsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbF07XG52YXIgZWZmZWN0R2xvYmFsbHkgPSAoY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmIChjYiA9PSBudWxsIHx8IHR5cGVvZiBjYiAhPSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMob3B0aW9ucyk7XG5cdGdsb2JhbEVmZmVjdExpc3RlbmVycy5zZXQoY2IsIG5vcm1hbGl6ZWQuYWZmZWN0VHlwZXMpO1xuXHRyZXR1cm4gKCkgPT4gZ2xvYmFsRWZmZWN0TGlzdGVuZXJzLmRlbGV0ZShjYik7XG59O1xudmFyIHdyYXBwZWRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHdyYXBwZWRcIik7XG5nbG9iYWxUaGlzW3dyYXBwZWRTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB3cmFwcGVkID0gZ2xvYmFsVGhpc1t3cmFwcGVkU3ltYm9sXTtcbnZhciByZWdpc3RlciA9ICh3aGF0LCBoYW5kbGUpID0+IHtcblx0Y29uc3QgdW53cmFwID0gd2hhdD8uWyRleHRyYWN0S2V5JF0gPz8gd2hhdDtcblx0bGV0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHVud3JhcCk7XG5cdGlmICghcmVnaXN0cnkpIHtcblx0XHRyZWdpc3RyeSA9IG5ldyBTdWJzY3JpcHQodW53cmFwKTtcblx0XHRzdWJzY3JpcHRSZWdpc3RyeS5zZXQodW53cmFwLCByZWdpc3RyeSk7XG5cdH0gZWxzZSByZWdpc3RyeS5iaW5kU291cmNlKHVud3JhcCk7XG5cdHJldHVybiBoYW5kbGU7XG59O1xudmFyIHdyYXBXaXRoID0gKHdoYXQsIGhhbmRsZSkgPT4ge1xuXHR3aGF0ID0gZGVyZWYod2hhdD8uWyRleHRyYWN0S2V5JF0gPz8gd2hhdCk7XG5cdGlmICh0eXBlb2Ygd2hhdCA9PSBcInN5bWJvbFwiIHx8ICEodHlwZW9mIHdoYXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygd2hhdCA9PSBcImZ1bmN0aW9uXCIpIHx8IHdoYXQgPT0gbnVsbCkgcmV0dXJuIHdoYXQ7XG5cdHJldHVybiB3cmFwcGVkLmdldE9ySW5zZXJ0Q29tcHV0ZWQod2hhdCwgKCkgPT4gbmV3IFByb3h5KHdoYXQsIHJlZ2lzdGVyKHdoYXQsIGhhbmRsZSkpKTtcbn07XG52YXIgZm9yQWxsID0gU3ltYm9sLmZvcihcIkBhbGxQcm9wc1wiKTtcbnZhciB3aWxkY2FyZFRyaWdnZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1wiKlwiLCBcImFsbFwiXSk7XG52YXIgdHJpZ2dlckFsaWFzZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcChbXG5cdFtcInNldFwiLCBbXCJzZXR0ZXJcIiwgXCJAc2V0XCJdXSxcblx0W1wiYWRkXCIsIFtcIkBhZGRcIl1dLFxuXHRbXCJkZWxldGVcIiwgW1wiQGRlbGV0ZVwiXV0sXG5cdFtcImludmFsaWRhdGVcIiwgW1wiQGludmFsaWRhdGVcIl1dLFxuXHRbXCJtYW51YWxcIiwgW1wiQG1hbnVhbFwiXV0sXG5cdFtcImN1c3RvbVwiLCBbXCJAY3VzdG9tXCJdXSxcblx0W1wic2V0QWxsXCIsIFtcIkBzZXRBbGxcIl1dLFxuXHRbXCJhZGRBbGxcIiwgW1wiQGFkZEFsbFwiXV0sXG5cdFtcImRlbGV0ZUFsbFwiLCBbXCJAZGVsZXRlQWxsXCIsIFwiQGNsZWFyXCJdXVxuXSk7XG52YXIgdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0B0cmlnZ2VyQ2Fub25pY2FsTmFtZXNcIik7XG5nbG9iYWxUaGlzW3RyaWdnZXJDYW5vbmljYWxOYW1lc1N5bWJvbF0gPz89IG5ldyBNYXAoQXJyYXkuZnJvbSh0cmlnZ2VyQWxpYXNlcy5lbnRyaWVzKCkpLmZsYXRNYXAoKFtjYW5vbmljYWwsIGFsaWFzZXNdKSA9PiBhbGlhc2VzLm1hcCgoYWxpYXMpID0+IFthbGlhcywgY2Fub25pY2FsXSkpKTtcbnZhciB0cmlnZ2VyQ2Fub25pY2FsTmFtZXMgPSBnbG9iYWxUaGlzW3RyaWdnZXJDYW5vbmljYWxOYW1lc1N5bWJvbF07XG52YXIgbm9ybWFsaXplVHJpZ2dlck5hbWUgPSAodHJpZ2dlciA9IFwic2V0XCIpID0+IHtcblx0aWYgKHRyaWdnZXIgPT0gbnVsbCkgcmV0dXJuIHRyaWdnZXI7XG5cdGNvbnN0IG5hbWUgPSBTdHJpbmcodHJpZ2dlciB8fCBcInNldFwiKTtcblx0cmV0dXJuIHRyaWdnZXJDYW5vbmljYWxOYW1lcy5nZXQobmFtZSkgPz8gbmFtZTtcbn07XG52YXIgdHJpZ2dlck5hbWVzT2YgPSAodHJpZ2dlcikgPT4ge1xuXHRjb25zdCBuYW1lID0gdHJpZ2dlciA9PSBudWxsID8gXCJhbGxcIiA6IFN0cmluZyhub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyBcImFsbFwiKTtcblx0cmV0dXJuIFtuYW1lLCAuLi50cmlnZ2VyQWxpYXNlcy5nZXQobmFtZSkgPz8gW11dO1xufTtcbnZhciBleHBhbmRUcmlnZ2VyRmlsdGVyID0gKHR5cGVzID0gW1wiKlwiXSkgPT4ge1xuXHRyZXR1cm4gbmV3IFNldChbLi4ubm9ybWFsaXplVHJpZ2dlckZpbHRlcih0eXBlcyldLmZsYXRNYXAoKG5hbWUpID0+IFtuYW1lLCAuLi50cmlnZ2VyQWxpYXNlcy5nZXQobmFtZSkgPz8gW11dKSk7XG59O1xudmFyIG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIgPSAodHJpZ2dlcnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IGxpc3QgPSB0eXBlb2YgdHJpZ2dlcnMgPT0gXCJzdHJpbmdcIiA/IFt0cmlnZ2Vyc10gOiBBcnJheS5mcm9tKHRyaWdnZXJzID8/IFtcIipcIl0pO1xuXHRjb25zdCBub3JtYWxpemVkID0gbmV3IFNldChsaXN0Lm1hcCgoaXRlbSkgPT4ge1xuXHRcdGNvbnN0IG5hbWUgPSBTdHJpbmcoaXRlbSB8fCBcIipcIik7XG5cdFx0cmV0dXJuIHdpbGRjYXJkVHJpZ2dlcnMuaGFzKG5hbWUpID8gbmFtZSA6IFN0cmluZyhub3JtYWxpemVUcmlnZ2VyTmFtZShuYW1lKSA/PyBuYW1lKTtcblx0fSkpO1xuXHRyZXR1cm4gbm9ybWFsaXplZC5zaXplID8gbm9ybWFsaXplZCA6IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcIipcIl0pO1xufTtcbnZhciB0cmlnZ2VyRmlsdGVyQWxsb3dzID0gKHRyaWdnZXJzLCB0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IGZpbHRlciA9IHRyaWdnZXJzIGluc3RhbmNlb2YgU2V0ID8gdHJpZ2dlcnMgOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKHRyaWdnZXJzKTtcblx0cmV0dXJuIFsuLi53aWxkY2FyZFRyaWdnZXJzXS5zb21lKChuYW1lKSA9PiBmaWx0ZXIuaGFzKG5hbWUpKSB8fCB0cmlnZ2VyTmFtZXNPZih0cmlnZ2VyKS5zb21lKChuYW1lKSA9PiBmaWx0ZXIuaGFzKG5hbWUpKTtcbn07XG52YXIgaXNPcHRpb25zT2JqZWN0ID0gKG9wdGlvbnMpID0+IHtcblx0cmV0dXJuICEhb3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KG9wdGlvbnMpICYmIChcImFmZmVjdFR5cGVzXCIgaW4gb3B0aW9ucyB8fCBcInRyaWdnZXJzXCIgaW4gb3B0aW9ucyB8fCBcInRyaWdnZXJJbW1lZGlhdGVseVwiIGluIG9wdGlvbnMpO1xufTtcbnZhciBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMgPSAob3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGlzT3B0aW9uc09iamVjdChvcHRpb25zKSkgcmV0dXJuIHtcblx0XHRhZmZlY3RUeXBlczogbm9ybWFsaXplVHJpZ2dlckZpbHRlcihvcHRpb25zLmFmZmVjdFR5cGVzID8/IG9wdGlvbnMudHJpZ2dlcnMgPz8gW1wiKlwiXSksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBvcHRpb25zLnRyaWdnZXJJbW1lZGlhdGVseSAhPT0gZmFsc2Vcblx0fTtcblx0Y29uc3QgYWZmZWN0VHlwZXMgPSBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMpO1xuXHRyZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogdHJpZ2dlckZpbHRlckFsbG93cyhhZmZlY3RUeXBlcywgXCJpbml0aWFsXCIpXG5cdH07XG59O1xudmFyIG5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMgPSAob3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGlzT3B0aW9uc09iamVjdChvcHRpb25zKSkgcmV0dXJuIHtcblx0XHRhZmZlY3RUeXBlczogbm9ybWFsaXplVHJpZ2dlckZpbHRlcihvcHRpb25zLmFmZmVjdFR5cGVzID8/IG9wdGlvbnMudHJpZ2dlcnMgPz8gW1wiKlwiXSksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBvcHRpb25zLnRyaWdnZXJJbW1lZGlhdGVseSA9PT0gdHJ1ZVxuXHR9O1xuXHRyZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMpLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogZmFsc2Vcblx0fTtcbn07XG52YXIgU3Vic2NyaXB0U3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0BTdWJzY3JpcHRcIik7XG5nbG9iYWxUaGlzW1N1YnNjcmlwdFN5bWJvbF0gPz89IGNsYXNzIFN1YnNjcmlwdCB7XG5cdGNvbXBhdGlibGU7XG5cdCNzb3VyY2U7XG5cdCNsaXN0ZW5lcnM7XG5cdCNmbGFncyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHQjbmF0aXZlO1xuXHQjaXRlcmF0b3I7XG5cdCNpbkRpc3BhdGNoID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0I2Rpc2FibGVkVHJpZ2dlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjdHJpZ2dlckNvbnRyb2w7XG5cdCNwZW5kaW5nID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0I3BlbmRpbmdCeVByb3AgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQjZmx1c2hTY2hlZHVsZWQgPSBmYWxzZTtcblx0Y29uc3RydWN0b3Ioc291cmNlKSB7XG5cdFx0dGhpcy4jc291cmNlID0gc291cmNlO1xuXHRcdHRoaXMuI2xpc3RlbmVycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0dGhpcy4jZmxhZ3MgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtTZXQoKTtcblx0XHR0aGlzLiN0cmlnZ2VyQ29udHJvbCA9IHtcblx0XHRcdGVuYWJsZTogKHR5cGVzID0gW1wiKlwiXSwgY2IpID0+IGNiID8gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIHRydWUsIGNiKSA6IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCB0cnVlKSxcblx0XHRcdGRpc2FibGU6ICh0eXBlcyA9IFtcIipcIl0sIGNiKSA9PiBjYiA/IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCBmYWxzZSwgY2IpIDogdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIGZhbHNlKSxcblx0XHRcdHNldDogKHR5cGVzLCBlbmFibGVkKSA9PiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgZW5hYmxlZCksXG5cdFx0XHR3aXRoOiAodHlwZXMsIGNiKSA9PiB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgdHJ1ZSwgY2IpLFxuXHRcdFx0d2l0aG91dDogKHR5cGVzLCBjYikgPT4gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIGZhbHNlLCBjYiksXG5cdFx0XHRpc0VuYWJsZWQ6ICh0cmlnZ2VyKSA9PiB0aGlzLmlzVHJpZ2dlckVuYWJsZWQodHJpZ2dlcilcblx0XHR9O1xuXHRcdHRoaXMuI2l0ZXJhdG9yID0geyBuZXh0OiAoYXJncykgPT4ge1xuXHRcdFx0aWYgKGFyZ3MpIEFycmF5LmlzQXJyYXkoYXJncykgPyB0aGlzLiNkaXNwYXRjaCguLi5hcmdzKSA6IHRoaXMuI2Rpc3BhdGNoKGFyZ3MpO1xuXHRcdH0gfTtcblx0XHRjb25zdCB3ZWFrID0gbmV3IFdlYWtSZWYodGhpcyk7XG5cdFx0Y29uc3QgY29udHJvbGxlciA9IGZ1bmN0aW9uKHN1YnNjcmliZXIpIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBzdWJzY3JpYmVyPy5uZXh0Py5iaW5kPy4oc3Vic2NyaWJlcik7XG5cdFx0XHRyZXR1cm4gY29tcGxldGVXaXRoVW5zdWIoc3Vic2NyaWJlciwgd2VhaywgaGFuZGxlcik7XG5cdFx0fTtcblx0XHR0aGlzLiNuYXRpdmUgPSB0eXBlb2YgT2JzZXJ2YWJsZSAhPSBcInVuZGVmaW5lZFwiID8gbmV3IE9ic2VydmFibGUoY29udHJvbGxlcikgOiBudWxsO1xuXHRcdHRoaXMuY29tcGF0aWJsZSA9ICgpID0+IHRoaXMuI25hdGl2ZTtcblx0fVxuXHRiaW5kU291cmNlKHNvdXJjZSkge1xuXHRcdHRoaXMuI3NvdXJjZSA/Pz0gc291cmNlO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdCRzYWZlRXhlYyhjYiwgLi4uYXJncykge1xuXHRcdGlmICghY2IgfHwgdGhpcy4jZmxhZ3MuaGFzKGNiKSkgcmV0dXJuO1xuXHRcdHRoaXMuI2ZsYWdzLmFkZChjYik7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHJlcyA9IGNiKC4uLmFyZ3MpO1xuXHRcdFx0aWYgKHJlcyAmJiB0eXBlb2YgcmVzLnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRyZXMuY2F0Y2goY29uc29sZS53YXJuKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlcztcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oZSk7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdHRoaXMuI2ZsYWdzLmRlbGV0ZShjYik7XG5cdFx0fVxuXHR9XG5cdCNkaXNwYXRjaChuYW1lLCB2YWx1ZSA9IG51bGwsIG9sZFZhbHVlLCB0cmlnZ2VyID0gXCJhbGxcIiwgLi4uZXRjKSB7XG5cdFx0dHJpZ2dlciA9IG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IHRyaWdnZXI7XG5cdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy4jbGlzdGVuZXJzO1xuXHRcdGlmIChsaXN0ZW5lcnM/LnNpemUpIHtcblx0XHRcdGZvciAoY29uc3QgW2NiLCByZWNvcmRdIG9mIGxpc3RlbmVycy5lbnRyaWVzKCkpIGlmICgocmVjb3JkLnByb3AgPT09IG5hbWUgfHwgcmVjb3JkLnByb3AgPT09IGZvckFsbCB8fCByZWNvcmQucHJvcCA9PT0gbnVsbCkgJiYgdHJpZ2dlckZpbHRlckFsbG93cyhyZWNvcmQudHJpZ2dlcnMsIHRyaWdnZXIpKSB0aGlzLiRzYWZlRXhlYyhjYiwgdmFsdWUsIG5hbWUsIG9sZFZhbHVlLCB0cmlnZ2VyLCAuLi5ldGMpO1xuXHRcdH1cblx0XHRpZiAoZ2xvYmFsRWZmZWN0TGlzdGVuZXJzLnNpemUpIHtcblx0XHRcdGNvbnN0IGV2ZW50ID0ge1xuXHRcdFx0XHRzb3VyY2U6IHRoaXMuI3NvdXJjZSxcblx0XHRcdFx0dGFyZ2V0OiB0aGlzLiNzb3VyY2UsXG5cdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRwcm9wOiBuYW1lLFxuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRvbGRWYWx1ZSxcblx0XHRcdFx0dHJpZ2dlcixcblx0XHRcdFx0YXJnczogZXRjXG5cdFx0XHR9O1xuXHRcdFx0Zm9yIChjb25zdCBbY2IsIHRyaWdnZXJzXSBvZiBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuZW50cmllcygpKSBpZiAodHJpZ2dlckZpbHRlckFsbG93cyh0cmlnZ2VycywgdHJpZ2dlcikpIHRoaXMuJHNhZmVFeGVjKGNiLCBldmVudCk7XG5cdFx0fVxuXHR9XG5cdHdyYXAobncpIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShudykpIHJldHVybiB3cmFwV2l0aChudywgdGhpcyk7XG5cdFx0cmV0dXJuIG53O1xuXHR9XG5cdGdldCB0cmlnZ2VyQ29udHJvbCgpIHtcblx0XHRyZXR1cm4gdGhpcy4jdHJpZ2dlckNvbnRyb2w7XG5cdH1cblx0aXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKSB7XG5cdFx0cmV0dXJuICF0cmlnZ2VyRmlsdGVyQWxsb3dzKHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMsIFwiYWxsXCIpICYmICF0cmlnZ2VyTmFtZXNPZih0cmlnZ2VyKS5zb21lKChuYW1lKSA9PiB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmhhcyhuYW1lKSk7XG5cdH1cblx0c2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzID0gW1wiKlwiXSwgZW5hYmxlZCA9IHRydWUpIHtcblx0XHRjb25zdCBuYW1lcyA9IGV4cGFuZFRyaWdnZXJGaWx0ZXIodHlwZXMpO1xuXHRcdGZvciAoY29uc3QgbmFtZSBvZiBuYW1lcykgaWYgKGVuYWJsZWQpIHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuZGVsZXRlKG5hbWUpO1xuXHRcdGVsc2UgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5hZGQobmFtZSk7XG5cdH1cblx0d2l0aFRyaWdnZXJzKHR5cGVzLCBlbmFibGVkLCBjYikge1xuXHRcdGNvbnN0IG5hbWVzID0gWy4uLmV4cGFuZFRyaWdnZXJGaWx0ZXIodHlwZXMpXTtcblx0XHRjb25zdCBwcmV2aW91cyA9IG5ldyBNYXAobmFtZXMubWFwKChuYW1lKSA9PiBbbmFtZSwgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5oYXMobmFtZSldKSk7XG5cdFx0Y29uc3QgcmVzdG9yZSA9ICgpID0+IHtcblx0XHRcdHByZXZpb3VzLmZvckVhY2goKHdhc0Rpc2FibGVkLCBuYW1lKSA9PiB7XG5cdFx0XHRcdGlmICh3YXNEaXNhYmxlZCkgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5hZGQobmFtZSk7XG5cdFx0XHRcdGVsc2UgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5kZWxldGUobmFtZSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKG5hbWVzLCBlbmFibGVkKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gY2I/LigpO1xuXHRcdFx0aWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0LmZpbmFsbHkgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gcmVzdWx0LmZpbmFsbHkocmVzdG9yZSk7XG5cdFx0XHRyZXN0b3JlKCk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHJlc3RvcmUoKTtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHR9XG5cdGFmZmVjdGVkKGNiLCBwcm9wLCBvcHRpb25zID0gW1wiKlwiXSkge1xuXHRcdGlmIChjYiA9PSBudWxsIHx8IHR5cGVvZiBjYiAhPSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0XHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpO1xuXHRcdHRoaXMuI2xpc3RlbmVycy5zZXQoY2IsIHtcblx0XHRcdHByb3A6IHByb3AgfHwgZm9yQWxsLFxuXHRcdFx0dHJpZ2dlcnM6IG5vcm1hbGl6ZWQuYWZmZWN0VHlwZXNcblx0XHR9KTtcblx0XHRyZXR1cm4gKCkgPT4gdGhpcy51bmFmZmVjdGVkKGNiLCBwcm9wIHx8IGZvckFsbCk7XG5cdH1cblx0dW5hZmZlY3RlZChjYiwgcHJvcCkge1xuXHRcdGlmIChjYiAhPSBudWxsICYmIHR5cGVvZiBjYiA9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuI2xpc3RlbmVycztcblx0XHRcdGNvbnN0IHJlY29yZCA9IGxpc3RlbmVycz8uZ2V0KGNiKTtcblx0XHRcdGlmIChyZWNvcmQgJiYgKHJlY29yZC5wcm9wID09IHByb3AgfHwgcHJvcCA9PSBudWxsIHx8IHByb3AgPT0gZm9yQWxsKSkge1xuXHRcdFx0XHRsaXN0ZW5lcnMuZGVsZXRlKGNiKTtcblx0XHRcdFx0cmV0dXJuICgpID0+IHRoaXMuYWZmZWN0ZWQoY2IsIHByb3AgfHwgZm9yQWxsLCByZWNvcmQudHJpZ2dlcnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy4jbGlzdGVuZXJzLmNsZWFyKCk7XG5cdH1cblx0dHJpZ2dlcihuYW1lLCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXIgPSBcInNldFwiLCAuLi5ldGMpIHtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT09IFwic3ltYm9sXCIpIHJldHVybjtcblx0XHRpZiAodHJpZ2dlciA9PT0gdm9pZCAwKSB0cmlnZ2VyID0gXCJzZXRcIjtcblx0XHR0cmlnZ2VyID0gbm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gdHJpZ2dlcjtcblx0XHRpZiAoIXRoaXMuaXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKSkgcmV0dXJuO1xuXHRcdGNvbnN0IG9wS2V5ID0gYCR7dHJpZ2dlciA/PyBcImFsbFwifWA7XG5cdFx0bGV0IGJ5T3AgPSB0aGlzLiNwZW5kaW5nQnlQcm9wLmdldChuYW1lKTtcblx0XHRpZiAoIWJ5T3ApIHtcblx0XHRcdGJ5T3AgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0dGhpcy4jcGVuZGluZ0J5UHJvcC5zZXQobmFtZSwgYnlPcCk7XG5cdFx0fVxuXHRcdGJ5T3Auc2V0KG9wS2V5LCBbXG5cdFx0XHRuYW1lLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRvbGRWYWx1ZSxcblx0XHRcdHRyaWdnZXIsXG5cdFx0XHRldGNcblx0XHRdKTtcblx0XHRpZiAodGhpcy4jZmx1c2hTY2hlZHVsZWQpIHJldHVybjtcblx0XHR0aGlzLiNmbHVzaFNjaGVkdWxlZCA9IHRydWU7XG5cdFx0cXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuXHRcdFx0dGhpcy4jZmx1c2hTY2hlZHVsZWQgPSBmYWxzZTtcblx0XHRcdGNvbnN0IGJhdGNoID0gdGhpcy4jcGVuZGluZ0J5UHJvcDtcblx0XHRcdHRoaXMuI3BlbmRpbmdCeVByb3AgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0Zm9yIChjb25zdCBbcHJvcCwgb3BNYXBdIG9mIGJhdGNoKSB7XG5cdFx0XHRcdGlmIChwcm9wICE9IG51bGwgJiYgdGhpcy4jaW5EaXNwYXRjaC5oYXMocHJvcCkpIGNvbnRpbnVlO1xuXHRcdFx0XHRpZiAocHJvcCAhPSBudWxsKSB0aGlzLiNpbkRpc3BhdGNoLmFkZChwcm9wKTtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IFssIGFyZ3NdIG9mIG9wTWFwKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBbbm0sIHYsIG92LCB0ZywgcmVzdF0gPSBhcmdzO1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0dGhpcy4jZGlzcGF0Y2gobm0sIHYsIG92LCB0ZywgLi4ucmVzdCA/PyBbXSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCkgdGhpcy4jaW5EaXNwYXRjaC5kZWxldGUocHJvcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRnZXQgaXRlcmF0b3IoKSB7XG5cdFx0cmV0dXJuIHRoaXMuI2l0ZXJhdG9yO1xuXHR9XG59O1xudmFyIFN1YnNjcmlwdCA9IGdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvU3BlY2lmaWMudHNcbnZhciBfX3NhZmVHZXRHdWFyZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAX19zYWZlR2V0R3VhcmRcIik7XG52YXIgX19zeXN0ZW1Ta2lwID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1xuXHRTeW1ib2wudG9TdHJpbmdUYWcsXG5cdFN5bWJvbC5pdGVyYXRvcixcblx0U3ltYm9sLmFzeW5jSXRlcmF0b3IsXG5cdFN5bWJvbC50b1ByaW1pdGl2ZSxcblx0XCJ0b1N0cmluZ1wiLFxuXHRcInZhbHVlT2ZcIixcblx0XCJpbnNwZWN0XCIsXG5cdFwiY29uc3RydWN0b3JcIixcblx0XCJfX3Byb3RvX19cIixcblx0XCJwcm90b3R5cGVcIixcblx0XCJ0aGVuXCIsXG5cdFwiY2F0Y2hcIixcblx0XCJmaW5hbGx5XCIsXG5cdFwibmV4dFwiXG5dKTtcbnZhciBzeXN0ZW1Ta2lwR2V0ID0gKHRhcmdldCwgbmFtZSkgPT4ge1xuXHRpZiAoIV9fc3lzdGVtU2tpcC5oYXMobmFtZSkpIHJldHVybiBudWxsO1xuXHRjb25zdCBnb3QgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdHJldHVybiB0eXBlb2YgZ290ID09PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgZ290KSA6IGdvdDtcbn07XG52YXIgX19zYWZlR2V0R3VhcmQgPSBnbG9iYWxUaGlzW19fc2FmZUdldEd1YXJkU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBpc0dldHRlcihvYmosIHByb3BOYW1lKSB7XG5cdGxldCBnb3QgPSB0cnVlO1xuXHR0cnkge1xuXHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKHByb3BOYW1lKTtcblx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/Lmhhcz8uKHByb3BOYW1lKSkgZ290ID0gdHJ1ZTtcblx0XHRnb3QgPSB0eXBlb2YgUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBwcm9wTmFtZSk/LmdldCA9PSBcImZ1bmN0aW9uXCI7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRnb3QgPSB0cnVlO1xuXHR9IGZpbmFsbHkge1xuXHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/LihvYmopPy5kZWxldGU/Lihwcm9wTmFtZSk7XG5cdH1cblx0cmV0dXJuIGdvdDtcbn1cbnZhciBmYWxsVGhyb3VnaCA9IChvYmosIGtleSkgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUob2JqKSkgcmV0dXJuIG9iajtcblx0Y29uc3QgdmFsdWUgPSBzYWZlR2V0KG9iaiwga2V5KTtcblx0aWYgKHZhbHVlID09IG51bGwgJiYga2V5ICE9IFwidmFsdWVcIikge1xuXHRcdGNvbnN0IHRtcCA9IHNhZmVHZXQob2JqLCBcInZhbHVlXCIpO1xuXHRcdGlmICh0bXAgIT0gbnVsbCAmJiAhaXNQcmltaXRpdmUodG1wKSkgcmV0dXJuIGZhbGxUaHJvdWdoKHRtcCwga2V5KTtcblx0XHRlbHNlIHJldHVybiB2YWx1ZTtcblx0fSBlbHNlIGlmIChrZXkgPT0gXCJ2YWx1ZVwiICYmIHZhbHVlICE9IG51bGwgJiYgIWlzUHJpbWl0aXZlKHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsbFRocm91Z2godmFsdWUsIGtleSkgPz8gdmFsdWUgPz8gb2JqO1xuXHRyZXR1cm4gdmFsdWUgPz8gb2JqO1xufTtcbnZhciBzYWZlU2V0ID0gKG9iaiwga2V5LCB2YWx1ZSkgPT4ge1xuXHRpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcblx0bGV0IGFjdGl2ZSA9IF9fc2FmZVNldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdGlmIChhY3RpdmU/Lmhhcz8uKGtleSkpIHJldHVybiBmYWxzZTtcblx0YWN0aXZlPy5hZGQ/LihrZXkpO1xuXHRyZXR1cm4gUmVmbGVjdC5zZXQob2JqLCBrZXksIHZhbHVlKTtcbn07XG52YXIgc2FmZUdldCA9IChvYmosIGtleSwgcmVjKSA9PiB7XG5cdGxldCByZXN1bHQgPSB2b2lkIDA7XG5cdGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcblx0bGV0IGFjdGl2ZSA9IF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdGlmIChhY3RpdmU/Lmhhcz8uKGtleSkpIHJldHVybiBudWxsO1xuXHRpZiAoIWlzR2V0dGVyKG9iaiwga2V5KSkgcmVzdWx0ID8/PSBSZWZsZWN0LmdldChvYmosIGtleSwgcmVjICE9IG51bGwgPyByZWMgOiBvYmopO1xuXHRlbHNlIHtcblx0XHRhY3RpdmU/LmFkZD8uKGtleSk7XG5cdFx0dHJ5IHtcblx0XHRcdHJlc3VsdCA9IFJlZmxlY3QuZ2V0KG9iaiwga2V5LCByZWMgIT0gbnVsbCA/IHJlYyA6IG9iaik7XG5cdFx0fSBjYXRjaCAoX2UpIHtcblx0XHRcdHJlc3VsdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0YWN0aXZlLmRlbGV0ZShrZXkpO1xuXHRcdFx0aWYgKGFjdGl2ZT8uc2l6ZSA9PT0gMCkgX19zYWZlR2V0R3VhcmQ/LmRlbGV0ZT8uKG9iaik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0eXBlb2YgcmVzdWx0ID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgob2JqLCByZXN1bHQpIDogcmVzdWx0O1xufTtcbnZhciBoYXNPd24gPSAob2JqLCBrZXkpID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG52YXIgaXNUcmlnZ2VyRW1pdE9wdGlvbnMgPSAodmFsdWUsIGFsbG93VmFsdWVPbmx5ID0gZmFsc2UpID0+IHtcblx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIChoYXNPd24odmFsdWUsIFwia2V5XCIpIHx8IGhhc093bih2YWx1ZSwgXCJuYW1lXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvbGRWYWx1ZVwiKSB8fCBoYXNPd24odmFsdWUsIFwib2xkXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvcFwiKSB8fCBoYXNPd24odmFsdWUsIFwidHJpZ2dlclwiKSB8fCBhbGxvd1ZhbHVlT25seSAmJiBoYXNPd24odmFsdWUsIFwidmFsdWVcIikpO1xufTtcbnZhciB0cmlnZ2VyT3B0aW9uVmFsdWUgPSAob3B0aW9ucywga2V5LCBmYWxsYmFjaykgPT4ge1xuXHRpZiAoaGFzT3duKG9wdGlvbnMsIGtleSkpIHJldHVybiBvcHRpb25zW2tleV07XG5cdGlmIChrZXkgPT0gXCJvbGRWYWx1ZVwiICYmIGhhc093bihvcHRpb25zLCBcIm9sZFwiKSkgcmV0dXJuIG9wdGlvbnMub2xkO1xuXHRyZXR1cm4gZmFsbGJhY2soKTtcbn07XG52YXIgdHJpZ2dlck9wdGlvblRyaWdnZXIgPSAob3B0aW9ucywgZmFsbGJhY2sgPSBcIm1hbnVhbFwiKSA9PiBub3JtYWxpemVUcmlnZ2VyTmFtZShvcHRpb25zLnRyaWdnZXIgPz8gb3B0aW9ucy5vcCA/PyBmYWxsYmFjayk7XG52YXIgaXNSdW50aW1lS2V5ID0gKGtleSkgPT4gdHlwZW9mIGtleSA9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBrZXkgPT0gXCJudW1iZXJcIiB8fCB0eXBlb2Yga2V5ID09IFwic3ltYm9sXCI7XG52YXIgcmVhbFByb3BPZiQxID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCBwcm9wID0gc2FmZUdldCh0YXJnZXQsICRyZWFsUHJvcCkgPz8gc2FmZUdldCh0YXJnZXQsIFwicmVhbFByb3BcIik7XG5cdHJldHVybiBpc1J1bnRpbWVLZXkocHJvcCkgPyBwcm9wIDogbnVsbDtcbn07XG52YXIgdHJpZ2dlcktleU9mID0gKHRhcmdldCwga2V5KSA9PiBrZXkgPT0gXCJ2YWx1ZVwiID8gcmVhbFByb3BPZiQxKHRhcmdldCkgPz8ga2V5IDoga2V5O1xudmFyIHRyaWdnZXJWYWx1ZU9mID0gKHRhcmdldCwga2V5KSA9PiB7XG5cdGNvbnN0IHJlYWxQcm9wID0gcmVhbFByb3BPZiQxKHRhcmdldCk7XG5cdGlmIChyZWFsUHJvcCAhPSBudWxsICYmIGtleSA9PSByZWFsUHJvcCkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpID8/IHNhZmVHZXQodGFyZ2V0LCBrZXkpO1xuXHRyZXR1cm4ga2V5ID09IG51bGwgPyB2b2lkIDAgOiBzYWZlR2V0KHRhcmdldCwga2V5KTtcbn07XG52YXIgY3JlYXRlVHJpZ2dlckFQSSA9IChyZWdpc3RyeSwgZW1pdCkgPT4ge1xuXHRjb25zdCBhcGkgPSAoa2V5LCBvcE9yT3B0aW9ucywgdHJpZ2dlcikgPT4ge1xuXHRcdGlmICghaXNUcmlnZ2VyRW1pdE9wdGlvbnMob3BPck9wdGlvbnMpKSB0cmlnZ2VyID8/PSBvcE9yT3B0aW9ucztcblx0XHRyZXR1cm4gZW1pdChpc1RyaWdnZXJFbWl0T3B0aW9ucyhrZXkpID8ga2V5IDogaXNUcmlnZ2VyRW1pdE9wdGlvbnMob3BPck9wdGlvbnMsIHRydWUpID8ge1xuXHRcdFx0a2V5LFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdC4uLm9wT3JPcHRpb25zXG5cdFx0fSA6IHtcblx0XHRcdGtleSxcblx0XHRcdHRyaWdnZXI6IHRyaWdnZXIgPz8gb3BPck9wdGlvbnNcblx0XHR9KTtcblx0fTtcblx0Y29uc3QgY29udHJvbCA9IHJlZ2lzdHJ5Py50cmlnZ2VyQ29udHJvbDtcblx0aWYgKGNvbnRyb2wpIE9iamVjdC5hc3NpZ24oYXBpLCBjb250cm9sKTtcblx0YXBpLmN1c3RvbSA9ICh0cmlnZ2VyLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSkgPT4gYXBpKHtcblx0XHRrZXksXG5cdFx0dHJpZ2dlcixcblx0XHR2YWx1ZSxcblx0XHRvbGRWYWx1ZVxuXHR9KTtcblx0cmV0dXJuIGFwaTtcbn07XG52YXIgc3lzdGVtR2V0ID0gKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IGlzUHJpbWl0aXZlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGlmICgoW1xuXHRcdFwiZGVyZWZcIixcblx0XHRcImJpbmRcIixcblx0XHRcIkB0YXJnZXRcIixcblx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdCRleHRyYWN0S2V5JCxcblx0XHQkcmVnaXN0cnlLZXkkXG5cdF0uaW5kZXhPZihuYW1lKSA8IDAgPyBzYWZlR2V0KHRhcmdldCwgbmFtZSk/LmJpbmQ/Lih0YXJnZXQpIDogbnVsbCkgIT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdGlmIChbJGV4dHJhY3RLZXkkLCAkb3JpZ2luYWxLZXkkXS5pbmRleE9mKG5hbWUpID49IDApIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdGFyZ2V0O1xuXHRpZiAobmFtZSA9PSAkdmFsdWUpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIik7XG5cdGlmIChuYW1lID09ICRyZWdpc3RyeUtleSQpIHJldHVybiByZWdpc3RyeTtcblx0aWYgKG5hbWUgPT0gJHRyaWdnZXJDb250cm9sKSByZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXJDb250cm9sO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wub2JzZXJ2YWJsZSkgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuc3Vic2NyaWJlKSByZXR1cm4gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiBhZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCwgY2IsIG9wdGlvbnMpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5hc3luY0l0ZXJhdG9yKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuZGlzcG9zZSkgcmV0dXJuIChwcm9wKSA9PiB7XG5cdFx0c2FmZUdldCh0YXJnZXQsIFN5bWJvbC5kaXNwb3NlKT8uKHByb3ApO1xuXHRcdHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHR9O1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuYXN5bmNEaXNwb3NlKSByZXR1cm4gKHByb3ApID0+IHtcblx0XHRzYWZlR2V0KHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSk/Lihwcm9wKTtcblx0XHR1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0fTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLnVuc3Vic2NyaWJlKSByZXR1cm4gKHByb3ApID0+IHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xufTtcbnZhciBvYnNlcnZhYmxlQVBJTWV0aG9kcyA9ICh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KSA9PiB7XG5cdGlmIChuYW1lID09IFwic3Vic2NyaWJlXCIpIHJldHVybiByZWdpc3RyeT8uY29tcGF0aWJsZT8uW25hbWVdID8/ICgoaGFuZGxlcikgPT4ge1xuXHRcdGlmICh0eXBlb2YgaGFuZGxlciA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXIpO1xuXHRcdGVsc2UgaWYgKFwibmV4dFwiIGluIGhhbmRsZXIgJiYgaGFuZGxlcj8ubmV4dCAhPSBudWxsKSB7XG5cdFx0XHRjb25zdCB1c3ViID0gYWZmZWN0ZWQodGFyZ2V0LCBoYW5kbGVyPy5uZXh0KSwgY29tcCA9IGhhbmRsZXI/LltcImNvbXBsZXRlXCJdO1xuXHRcdFx0aGFuZGxlcltcImNvbXBsZXRlXCJdID0gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0dXN1Yj8uKCk7XG5cdFx0XHRcdHJldHVybiBjb21wPy4oLi4uYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGhhbmRsZXJbXCJjb21wbGV0ZVwiXTtcblx0XHR9XG5cdH0pO1xufTtcbnZhciBPYnNlcnZlQXJyYXlNZXRob2QgPSBjbGFzcyB7XG5cdCNuYW1lO1xuXHQjc2VsZjtcblx0I2hhbmRsZTtcblx0Y29uc3RydWN0b3IobmFtZSwgc2VsZiwgaGFuZGxlKSB7XG5cdFx0dGhpcy4jbmFtZSA9IG5hbWU7XG5cdFx0dGhpcy4jc2VsZiA9IHNlbGY7XG5cdFx0dGhpcy4jaGFuZGxlID0gaGFuZGxlO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgcmVjKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdGxldCBhZGRlZCA9IFtdLCByZW1vdmVkID0gW107XG5cdFx0bGV0IHNldFBhaXJzID0gW107XG5cdFx0bGV0IG9sZFN0YXRlID0gWy4uLnRoaXMuI3NlbGZdO1xuXHRcdGxldCBpZHggPSAtMTtcblx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4IHx8IHRoaXMuI3NlbGYsIGFyZ3MpO1xuXHRcdGlmICh0aGlzLiNoYW5kbGU/LlskdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSByZXR1cm4gb2JzZXJ2ZUFycmF5KHJlc3VsdCk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRzd2l0Y2ggKHRoaXMuI25hbWUpIHtcblx0XHRcdGNhc2UgXCJwdXNoXCI6XG5cdFx0XHRcdGlkeCA9IG9sZFN0YXRlPy5sZW5ndGg7XG5cdFx0XHRcdGFkZGVkID0gYXJncztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidW5zaGlmdFwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRhZGRlZCA9IGFyZ3M7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInBvcFwiOlxuXHRcdFx0XHRpZHggPSBvbGRTdGF0ZT8ubGVuZ3RoIC0gMTtcblx0XHRcdFx0aWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbb2xkU3RhdGVbaWR4XV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNoaWZ0XCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGlmIChvbGRTdGF0ZS5sZW5ndGggPiAwKSByZW1vdmVkID0gW29sZFN0YXRlW2lkeF1dO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzcGxpY2VcIjpcblx0XHRcdFx0aWR4ID0gYXJnc1swXTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1heChvbGRTdGF0ZS5sZW5ndGgsIHRoaXMuI3NlbGYubGVuZ3RoKTsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBvbGRTdGF0ZVtpXTtcblx0XHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHRoaXMuI3NlbGZbaV07XG5cdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09PSB2b2lkIDAgJiYgaSA+PSB0aGlzLiNzZWxmLmxlbmd0aCkgcmVtb3ZlZC5wdXNoKG9sZFZhbHVlKTtcblx0XHRcdFx0XHRlbHNlIGlmIChvbGRWYWx1ZSA9PT0gdm9pZCAwICYmIGkgPj0gb2xkU3RhdGUubGVuZ3RoKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdHZvaWQgMCxcblx0XHRcdFx0XHRcdGZhbHNlXG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChvbGRWYWx1ZSwgbmV3VmFsdWUpKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNvcnRcIjpcblx0XHRcdGNhc2UgXCJmaWxsXCI6XG5cdFx0XHRjYXNlIFwicmV2ZXJzZVwiOlxuXHRcdFx0Y2FzZSBcImNvcHlXaXRoaW5cIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvbGRTdGF0ZS5sZW5ndGg7IGkrKykgaWYgKGlzTm90RXF1YWwob2xkU3RhdGVbaV0sIHRoaXMuI3NlbGZbaV0pKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRpZHggKyBpLFxuXHRcdFx0XHRcdHRoaXMuI3NlbGZbaV0sXG5cdFx0XHRcdFx0b2xkU3RhdGVbaV0sXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2V0XCI6XG5cdFx0XHRcdGlkeCA9IGFyZ3NbMV07XG5cdFx0XHRcdHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdGlkeCxcblx0XHRcdFx0XHRhcmdzWzBdLFxuXHRcdFx0XHRcdG9sZFN0YXRlPy5baWR4XSxcblx0XHRcdFx0XHRpZHggaW4gb2xkU3RhdGVcblx0XHRcdFx0XSk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlZyA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0aGlzLiNzZWxmKTtcblx0XHRpZiAoYWRkZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIGFkZGVkWzBdLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZD8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBhZGRlZCwgbnVsbCwgXCJhZGRBbGxcIik7XG5cdFx0XHRhZGRlZC5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWc/LnRyaWdnZXI/LihpZHggKyBJLCBpdGVtLCBudWxsLCBcImFkZFwiKSk7XG5cdFx0fVxuXHRcdGlmIChzZXRQYWlycz8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKHNldFBhaXJzWzBdPy5bMF0gPz8gaWR4LCBzZXRQYWlyc1swXT8uWzFdLCBzZXRQYWlyc1swXT8uWzJdLCBzZXRQYWlyc1swXT8uWzNdID09PSBmYWxzZSA/IFwiYWRkXCIgOiBcInNldFwiKTtcblx0XHRlbHNlIGlmIChzZXRQYWlycz8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBzZXRQYWlycywgb2xkU3RhdGUsIFwic2V0QWxsXCIpO1xuXHRcdFx0c2V0UGFpcnMuZm9yRWFjaCgocGFpciwgSSkgPT4gcmVnPy50cmlnZ2VyPy4ocGFpcj8uWzBdID8/IGlkeCArIEksIHBhaXI/LlsxXSwgcGFpcj8uWzJdLCBwYWlyPy5bM10gPT09IGZhbHNlID8gXCJhZGRcIiA6IFwic2V0XCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlbW92ZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIG51bGwsIHJlbW92ZWRbMF0sIFwiZGVsZXRlXCIpO1xuXHRcdGVsc2UgaWYgKHJlbW92ZWQ/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZCwgXCJkZWxldGVBbGxcIik7XG5cdFx0XHRyZW1vdmVkLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZz8udHJpZ2dlcj8uKGlkeCArIEksIG51bGwsIGl0ZW0sIFwiZGVsZXRlXCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlc3VsdCA9PSB0YXJnZXQpIHJldHVybiBuZXcgUHJveHkocmVzdWx0LCB0aGlzLiNoYW5kbGUpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHJldHVybiBvYnNlcnZlQXJyYXkocmVzdWx0KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlID0gKHNlbGYsIHRhcmdldCwgb2xkTGVuLCBuZXdMZW4pID0+IHtcblx0Y29uc3QgcmVtb3ZlZEl0ZW1zID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPCBvbGRMZW4gPyB0YXJnZXQuc2xpY2UobmV3TGVuLCBvbGRMZW4pIDogW107XG5cdGlmICghc2VsZlskdHJpZ2dlckxvY2tdICYmIG9sZExlbiAhPT0gbmV3TGVuKSB7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA9PT0gMSkgcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtc1swXSwgXCJkZWxldGVcIik7XG5cdFx0ZWxzZSBpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuLCBudWxsLCByZW1vdmVkSXRlbXMsIFwiZGVsZXRlQWxsXCIpO1xuXHRcdFx0cmVtb3ZlZEl0ZW1zLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuICsgSSwgbnVsbCwgaXRlbSwgXCJkZWxldGVcIikpO1xuXHRcdH1cblx0XHRjb25zdCBhZGRlZENvdW50ID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPiBvbGRMZW4gPyBuZXdMZW4gLSBvbGRMZW4gOiAwO1xuXHRcdGlmIChhZGRlZENvdW50ID09PSAxKSByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgdm9pZCAwLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZENvdW50ID4gMSkge1xuXHRcdFx0Y29uc3QgYWRkZWQgPSBBcnJheShhZGRlZENvdW50KS5maWxsKHZvaWQgMCk7XG5cdFx0XHRyZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgYWRkZWQsIG51bGwsIFwiYWRkQWxsXCIpO1xuXHRcdFx0YWRkZWQuZm9yRWFjaCgoXywgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4gKyBJLCB2b2lkIDAsIG51bGwsIFwiYWRkXCIpKTtcblx0XHR9XG5cdH1cbn07XG52YXIgT2JzZXJ2ZUFycmF5SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0aGFzKHRhcmdldCwgbmFtZSkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gc2FmZUdldCh0YXJnZXQsIGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9KTtcblx0XHRpZiAobmFtZSA9PSBcIkB0YXJnZXRcIiB8fCBuYW1lID09ICRleHRyYWN0S2V5JCkgcmV0dXJuIHRhcmdldDtcblx0XHRpZiAobmFtZSA9PSBcInhcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnggPz8gdGFyZ2V0Py5bMF07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInlcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnkgPz8gdGFyZ2V0Py5bMV07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInpcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnogPz8gdGFyZ2V0Py5bMl07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcIndcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LncgPz8gdGFyZ2V0Py5bM107XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnIgPz8gdGFyZ2V0Py5bMF07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImdcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LmcgPz8gdGFyZ2V0Py5bMV07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LmIgPz8gdGFyZ2V0Py5bMl07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImFcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LmEgPz8gdGFyZ2V0Py5bM107XG5cdFx0fTtcblx0XHRjb25zdCBnb3QgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gKG5hbWUgPT0gXCJ2YWx1ZVwiID8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgOiBudWxsKTtcblx0XHRpZiAodHlwZW9mIGdvdCA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBuZXcgUHJveHkodHlwZW9mIGdvdCA9PSBcImZ1bmN0aW9uXCIgPyBnb3Q/LmJpbmQ/Lih0YXJnZXQpIDogZ290LCBuZXcgT2JzZXJ2ZUFycmF5TWV0aG9kKG5hbWUsIHRhcmdldCwgdGhpcykpO1xuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAodHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0aWYgKE51bWJlci5pc0ludGVnZXIocGFyc2VJbnQobmFtZSkpKSBuYW1lID0gcGFyc2VJbnQobmFtZSkgPz8gbmFtZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0Y29uc3Qgb2xkID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHh5encgPSBbXG5cdFx0XHRcInhcIixcblx0XHRcdFwieVwiLFxuXHRcdFx0XCJ6XCIsXG5cdFx0XHRcIndcIlxuXHRcdF07XG5cdFx0Y29uc3QgcmdiYSA9IFtcblx0XHRcdFwiclwiLFxuXHRcdFx0XCJnXCIsXG5cdFx0XHRcImJcIixcblx0XHRcdFwiYVwiXG5cdFx0XTtcblx0XHRjb25zdCB4eXp3X2lkeCA9IHh5encuaW5kZXhPZihuYW1lKTtcblx0XHRjb25zdCByZ2JhX2lkeCA9IHJnYmEuaW5kZXhPZihuYW1lKTtcblx0XHRsZXQgZ290ID0gZmFsc2U7XG5cdFx0aWYgKHh5endfaWR4ID49IDApIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgeHl6d19pZHgsIHZhbHVlKTtcblx0XHRlbHNlIGlmIChyZ2JhX2lkeCA+PSAwKSBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHJnYmFfaWR4LCB2YWx1ZSk7XG5cdFx0ZWxzZSBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0XHRpZiAobmFtZSA9PSBcImxlbmd0aFwiKSB7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbChvbGQsIHZhbHVlKSkgdHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UodGhpcywgdGFyZ2V0LCBvbGQsIHZhbHVlKTtcblx0XHR9XG5cdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIiAmJiBpc05vdEVxdWFsKG9sZCwgdmFsdWUpKSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIHZhbHVlLCBvbGQsIFwic2V0XCIpO1xuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KG5hbWUpKSkgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBvbGQgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgZ290ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG5hbWUgIT0gXCJsZW5ndGhcIiAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAob2xkICE9IG51bGwpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbmFtZSwgb2xkLCBcImRlbGV0ZVwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxufTtcbnZhciBPYnNlcnZlT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIixcblx0XHRcdFwidGhlblwiLFxuXHRcdFx0XCJjYXRjaFwiLFxuXHRcdFx0XCJmaW5hbGx5XCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gcmVhbFByb3BPZiQxKHRhcmdldCkgPz8gXCJ2YWx1ZVwiKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4ga2V5ID09IFwidmFsdWVcIiB8fCBrZXkgPT0gcmVhbFByb3BPZiQxKHRhcmdldCkgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IHZvaWQgMCk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRyaWdnZXJWYWx1ZU9mKHRhcmdldCwga2V5KSk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0pO1xuXHRcdGlmIChuYW1lID09IFN5bWJvbC50b1ByaW1pdGl2ZSkgcmV0dXJuIChoaW50KSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKGhpbnQpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIHRyeVBhcnNlQnlIaW50KGZ0LCBoaW50KTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIHRyeVBhcnNlQnlIaW50KHNhZmVHZXQoZnQsIFwidmFsdWVcIiksIGhpbnQpO1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQsIGhpbnQpO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gU3ltYm9sLnRvU3RyaW5nVGFnKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIFN0cmluZyhmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ0b1N0cmluZ1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIFN5bWJvbC50b1N0cmluZ1RhZykpIHJldHVybiBzYWZlR2V0KGZ0LCBTeW1ib2wudG9TdHJpbmdUYWcpPy4oKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBTdHJpbmcoZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwidmFsdWVPZlwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIFN5bWJvbC50b1ByaW1pdGl2ZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBTeW1ib2wudG9QcmltaXRpdmUpPy4oKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBmdDtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFwidmFsdWVcIik7XG5cdFx0XHRyZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdDtcblx0XHR9O1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0cmV0dXJuIGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIHByb3AgaW4gdGFyZ2V0O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHYsIG5hbWUpO1xuXHRcdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgJG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRcdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgIShzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBuYW1lIGluIHRhcmdldCkpIHJldHVybjtcblx0XHRcdGNvbnN0IHRyaWdnZXJOYW1lID0gdHJpZ2dlcktleU9mKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IG5hbWUgPT0gXCJ2YWx1ZVwiID8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgPz8gc2FmZUdldCh0YXJnZXQsIG5hbWUpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0dGFyZ2V0W25hbWVdID0gdjtcblx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IHY7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiICYmIChzYWZlR2V0KHRhcmdldCwgJGlzTm90RXF1YWwpID8/IGlzTm90RXF1YWwpPy4ob2xkVmFsdWUsIG5ld1ZhbHVlKSkgKHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCgkb3JpZ2luYWwpKT8udHJpZ2dlcj8uKHRyaWdnZXJOYW1lLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9KTtcblx0fVxuXHRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiBkZXNjcmlwdG9yLnZhbHVlKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIWRlc2NyaXB0b3IudmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICFkZXNjcmlwdG9yLnZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRpZiAoZGVzY3JpcHRvci5nZXQgPT0gdm9pZCAwICYmIGRlc2NyaXB0b3Iuc2V0ID09IHZvaWQgMCkgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCAkcmVzdWx0ID0gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHtcblx0XHRcdGdldDogZGVzY3JpcHRvci5nZXQsXG5cdFx0XHRzZXQ6IGRlc2NyaXB0b3Iuc2V0LFxuXHRcdFx0ZW51bWVyYWJsZTogZGVzY3JpcHRvci5lbnVtZXJhYmxlID8/IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID8/IHRydWVcblx0XHR9KTtcblx0XHRzYWZlU2V0KHRhcmdldCwgbmFtZSwgb2xkVmFsdWUpO1xuXHRcdHJldHVybiAkcmVzdWx0O1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG5hbWUgIT0gJHRyaWdnZXJMb2NrICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZU1hcEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdO1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGdldCh0YXJnZXQsIG5hbWUsIGN0eCkge1xuXHRcdGlmIChbXG5cdFx0XHQkZXh0cmFjdEtleSQsXG5cdFx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdFx0XCJAdGFyZ2V0XCIsXG5cdFx0XHRcImRlcmVmXCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCAkZXh0cmFjdEtleSQpID8/IHNhZmVHZXQodGFyZ2V0LCAkb3JpZ2luYWxLZXkkKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3QgdmFsdWVPckZ4ID0gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSk7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHZhbHVlT3JGeDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWU7XG5cdFx0XHRpZiAoa2V5ID09IG51bGwpIHJldHVybjtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gdGFyZ2V0LmdldChrZXkpKTtcblx0XHRcdGlmICh2YWx1ZSA9PSBudWxsICYmICFoYXNPd24ob3B0aW9ucywgXCJ2YWx1ZVwiKSkgcmV0dXJuO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9KTtcblx0XHRpZiAobmFtZSA9PSBcImNsZWFyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8uZW50cmllcz8uKCkgfHwgW10pLCByZXN1bHQgPSB2YWx1ZU9yRngoKTtcblx0XHRcdG9sZFZhbHVlcy5mb3JFYWNoKChbcHJvcCwgb2xkVmFsdWVdKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZGVsZXRlXCIpIHJldHVybiAocHJvcCwgXyA9IG51bGwpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXMocHJvcCksIG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3ApO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInNldFwiKSByZXR1cm4gKHByb3AsIHZhbHVlKSA9PiBwb3RlbnRpYWxseUFzeW5jTWFwKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyhwcm9wKSwgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCwgdik7XG5cdFx0XHRpZiAoIWhhZCB8fCBpc05vdEVxdWFsKG9sZFZhbHVlLCB2KSkge1xuXHRcdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCB2LCBoYWQgPyBvbGRWYWx1ZSA6IG51bGwsIGhhZCA/IFwic2V0XCIgOiBcImFkZFwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciBPYnNlcnZlU2V0SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja10gPSBmYWxzZTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHR0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgJGV4dHJhY3RLZXkkKSA/PyBzYWZlR2V0KHRhcmdldCwgJG9yaWdpbmFsS2V5JCkgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiB2YWx1ZU9yRng7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lO1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm47XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRhcmdldC5oYXMoa2V5KSk7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IHZvaWQgMCk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0pO1xuXHRcdGlmIChuYW1lID09IFwiY2xlYXJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlcyA9IEFycmF5LmZyb20odGFyZ2V0Py52YWx1ZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG5cdFx0XHRvbGRWYWx1ZXMuZm9yRWFjaCgob2xkVmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obnVsbCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJkZWxldGVcIikgcmV0dXJuICh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2YWx1ZSksIG9sZFZhbHVlID0gaGFkID8gdmFsdWUgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodmFsdWUpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHZhbHVlLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhZGRcIikgcmV0dXJuICh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2YWx1ZSksIG9sZFZhbHVlID0gaGFkID8gdmFsdWUgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodmFsdWUpO1xuXHRcdFx0aWYgKCFoYWQpIHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4odmFsdWUsIHZhbHVlLCBvbGRWYWx1ZSwgXCJhZGRcIik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciAkaXNPYnNlcnZhYmxlID0gKHRhcmdldCkgPT4ge1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSkpO1xufTtcbnZhciBvYnNlcnZlQXJyYXkgPSAoYXJyKSA9PiB7XG5cdHJldHVybiAkaXNPYnNlcnZhYmxlKGFycikgPyBhcnIgOiB3cmFwV2l0aChhcnIsIG5ldyBPYnNlcnZlQXJyYXlIYW5kbGVyKCkpO1xufTtcbnZhciBvYnNlcnZlT2JqZWN0ID0gKG9iaikgPT4ge1xuXHRyZXR1cm4gJGlzT2JzZXJ2YWJsZShvYmopID8gb2JqIDogd3JhcFdpdGgob2JqLCBuZXcgT2JzZXJ2ZU9iamVjdEhhbmRsZXIoKSk7XG59O1xudmFyIG9ic2VydmVNYXAgPSAobWFwKSA9PiB7XG5cdHJldHVybiAkaXNPYnNlcnZhYmxlKG1hcCkgPyBtYXAgOiB3cmFwV2l0aChtYXAsIG5ldyBPYnNlcnZlTWFwSGFuZGxlcigpKTtcbn07XG52YXIgb2JzZXJ2ZVNldCA9IChzZXQpID0+IHtcblx0cmV0dXJuICRpc09ic2VydmFibGUoc2V0KSA/IHNldCA6IHdyYXBXaXRoKHNldCwgbmV3IE9ic2VydmVTZXRIYW5kbGVyKCkpO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvUHJpbWl0aXZlcy50c1xudmFyIG51bWJlclJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IGlzUHJvbWlzZSA/IDAgOiBOdW1iZXIoZGVyZWYoaW5pdGlhbCkgfHwgMCkgfHwgMCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCgodHlwZW9mIHRoaXM/LlskdmFsdWVdICE9IFwib2JqZWN0XCIgPyB0aGlzPy5bJHZhbHVlXSA6IHRoaXM/LlskdmFsdWVdPy52YWx1ZSB8fCAwKSA/PyAwLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4odikgPyBOdW1iZXIodikgOiB0aGlzWyR2YWx1ZV0pIHx8IDA7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gTnVtYmVyKHRoaXNbJHZhbHVlXSB8fCAwKSB8fCAwO1xuXHRcdH1cblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4gJHIudmFsdWUgPSB2KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciBzdHJpbmdSZWYgPSAoaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0Y29uc3QgaXNQcm9taXNlID0gaW5pdGlhbCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdHlwZW9mIGluaXRpYWw/LnRoZW4gPT0gXCJmdW5jdGlvblwiO1xuXHRjb25zdCAkciA9IG9ic2VydmUoe1xuXHRcdFskcHJvbWlzZV06IGlzUHJvbWlzZSA/IGluaXRpYWwgOiBudWxsLFxuXHRcdFskdmFsdWVdOiAoaXNQcm9taXNlID8gXCJcIiA6IFN0cmluZyhkZXJlZih0eXBlb2YgaW5pdGlhbCA9PSBcIm51bWJlclwiID8gU3RyaW5nKGluaXRpYWwpIDogaW5pdGlhbCB8fCBcIlwiKSkpID8/IFwiXCIsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgPz8gXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIiwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gU3RyaW5nKHR5cGVvZiB2ID09IFwibnVtYmVyXCIgPyBTdHJpbmcodikgOiB2IHx8IFwiXCIpID8/IFwiXCI7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXNbJHZhbHVlXSA/PyBcIlwiKSA/PyBcIlwiO1xuXHRcdH1cblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4gJHIudmFsdWUgPSB2KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciBib29sZWFuUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogKGlzUHJvbWlzZSA/IGZhbHNlIDogKGRlcmVmKGluaXRpYWwpICE9IG51bGwgPyB0eXBlb2YgZGVyZWYoaW5pdGlhbCkgPT0gXCJzdHJpbmdcIiA/IHRydWUgOiAhIWRlcmVmKGluaXRpYWwpIDogZmFsc2UpIHx8IGZhbHNlKSB8fCBmYWxzZSxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCghIXRoaXM/LlskdmFsdWVdIHx8IGZhbHNlLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsID8gdHlwZW9mIHYgPT0gXCJzdHJpbmdcIiA/IHRydWUgOiAhIXYgOiB0aGlzWyR2YWx1ZV0pIHx8IGZhbHNlO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSB8fCBmYWxzZTtcblx0XHR9XG5cdH0pO1xuXHRpbml0aWFsPy50aGVuPy4oKHYpID0+ICRyLnZhbHVlID0gdik7XG5cdHJldHVybiAkcjtcbn07XG52YXIgd3JhcFJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZSh7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzLnZhbHVlLCBoaW50KTtcblx0XHR9LFxuXHRcdHZhbHVlOiBpc1Byb21pc2UgPyBudWxsIDogZGVyZWYoaW5pdGlhbClcblx0fSk7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4gJHIudmFsdWUgPSB2KTtcblx0YWZmZWN0ZWQoaW5pdGlhbCwgKHYpID0+IHtcblx0XHQkcj8uWyR0cmlnZ2VyXT8uKCk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIG1hcmtSZWFsUHJvcCA9ICh0YXJnZXQsIHJlYWxQcm9wKSA9PiB7XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHRhcmdldCAhPSBcImZ1bmN0aW9uXCIpIHJldHVybiB0YXJnZXQ7XG5cdHRyeSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgJHJlYWxQcm9wLCB7XG5cdFx0XHR2YWx1ZTogcmVhbFByb3AsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHR9IGNhdGNoIHtcblx0XHR0cnkge1xuXHRcdFx0dGFyZ2V0WyRyZWFsUHJvcF0gPSByZWFsUHJvcDtcblx0XHR9IGNhdGNoIHt9XG5cdH1cblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBcInJlYWxQcm9wXCIsIHtcblx0XHRcdHZhbHVlOiByZWFsUHJvcCxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0gY2F0Y2gge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXJnZXQucmVhbFByb3AgPSByZWFsUHJvcDtcblx0XHR9IGNhdGNoIHt9XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbn07XG52YXIgcHJvcFJlZiA9IChzcmMsIHNyY1Byb3AgPSBcInZhbHVlXCIsIGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShzcmMpIHx8ICFzcmMpIHJldHVybiBzcmM7XG5cdGlmIChBcnJheS5pc0FycmF5KHNyYykgJiYgc3JjLmxlbmd0aCA9PSAyICYmIHNyY1swXSAhPSBudWxsICYmIChzcmNbMF0gaW5zdGFuY2VvZiBNYXAgfHwgc3JjWzBdIGluc3RhbmNlb2YgV2Vha01hcCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBTZXQgfHwgc3JjWzBdIGluc3RhbmNlb2YgV2Vha1NldCkpIHtcblx0XHRpZiAoc3JjUHJvcCA9PSBudWxsIHx8IHNyY1Byb3AgPT09IFwidmFsdWVcIikgc3JjUHJvcCA9IHNyY1sxXTtcblx0XHRzcmMgPSBzcmNbMF07XG5cdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzcmMpICYmICFpc0FycmF5SW52YWxpZEtleShzcmM/LlsxXSwgc3JjKSAmJiAoQXJyYXkuaXNBcnJheShzcmM/LlswXSkgfHwgdHlwZW9mIHNyYz8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNyYz8uWzBdID09IFwiZnVuY3Rpb25cIikpIHNyYyA9IHNyYz8uWzBdO1xuXHRjb25zdCBpc01hcCA9IHNyYyBpbnN0YW5jZW9mIE1hcCB8fCBzcmMgaW5zdGFuY2VvZiBXZWFrTWFwO1xuXHRjb25zdCBpc1NldCA9IHNyYyBpbnN0YW5jZW9mIFNldCB8fCBzcmMgaW5zdGFuY2VvZiBXZWFrU2V0O1xuXHRpZiAoaXNNYXAgfHwgaXNTZXQpIHtcblx0XHRpZiAoc3JjUHJvcCA9PSBudWxsKSByZXR1cm47XG5cdH0gZWxzZSBpZiAoKHNyY1Byb3AgPz89IEFycmF5LmlzQXJyYXkoc3JjKSA/IG51bGwgOiBcInZhbHVlXCIpID09IG51bGwgfHwgaXNBcnJheUludmFsaWRLZXkoc3JjUHJvcCwgc3JjKSkgcmV0dXJuO1xuXHRjb25zdCByZWFkU2xvdCA9ICgpID0+IHtcblx0XHRpZiAoaXNNYXApIHJldHVybiBzcmMuZ2V0KHNyY1Byb3ApO1xuXHRcdGlmIChpc1NldCkgcmV0dXJuIHNyYy5oYXMoc3JjUHJvcCk7XG5cdFx0cmV0dXJuIHNyYz8uW3NyY1Byb3BdO1xuXHR9O1xuXHRjb25zdCB3cml0ZVNsb3QgPSAodikgPT4ge1xuXHRcdGlmIChpc01hcCkge1xuXHRcdFx0c3JjLnNldChzcmNQcm9wLCB2KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRpZiAoaXNTZXQpIHtcblx0XHRcdGlmICh2KSBzcmMuYWRkKHNyY1Byb3ApO1xuXHRcdFx0ZWxzZSBzcmMuZGVsZXRlKHNyY1Byb3ApO1xuXHRcdFx0cmV0dXJuIHNyYy5oYXMoc3JjUHJvcCk7XG5cdFx0fVxuXHRcdHJldHVybiBzcmNbc3JjUHJvcF0gPSB2O1xuXHR9O1xuXHRpZiAoaXNNYXAgJiYgaW5pdGlhbCAhPT0gdm9pZCAwICYmICFzcmMuaGFzKHNyY1Byb3ApKSBzcmMuc2V0KHNyY1Byb3AsIGluaXRpYWwpO1xuXHRlbHNlIGlmIChpc1NldCAmJiBpbml0aWFsICYmICFzcmMuaGFzKHNyY1Byb3ApKSBzcmMuYWRkKHNyY1Byb3ApO1xuXHRjb25zdCBjdXJyZW50ID0gcmVhZFNsb3QoKTtcblx0aWYgKCFpc1NldCAmJiBzcmNQcm9wICE9IG51bGwgJiYgaGFzVmFsdWUoY3VycmVudCkgJiYgaXNPYnNlcnZhYmxlKGN1cnJlbnQpKSByZXR1cm4gbWFya1JlYWxQcm9wKHJlY292ZXJSZWFjdGl2ZShjdXJyZW50KSwgc3JjUHJvcCk7XG5cdGlmICghaXNNYXAgJiYgIWlzU2V0ICYmIHNyY1Byb3AgJiYgdHlwZW9mIHNyYz8uZ2V0UHJvcGVydHkgPT0gXCJmdW5jdGlvblwiICYmIGlzT2JzZXJ2YWJsZShzcmM/LmdldFByb3BlcnR5Py4oc3JjUHJvcCkpKSByZXR1cm4gbWFya1JlYWxQcm9wKHNyYz8uZ2V0UHJvcGVydHk/LihzcmNQcm9wKSwgc3JjUHJvcCk7XG5cdGlmICghaXNNYXAgJiYgIWlzU2V0KSBzcmNbc3JjUHJvcF0gPz89IGluaXRpYWwgPz8gc3JjW3NyY1Byb3BdO1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IGlzU2V0ID8gISFyZWFkU2xvdCgpIDogcmVhZFNsb3QoKSA/PyBpbml0aWFsLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHJlYWRTbG90KCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHJlYWRTbG90KCksIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHJbJHRyaWdnZXJMb2NrJDFdID0gdHJ1ZTtcblx0XHRcdGlmIChpc1NldCkgdGhpc1skdmFsdWVdID0gd3JpdGVTbG90KHYpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnN0IG5leHQgPSB2ID8/IGRlZmF1bHRCeVR5cGUocmVhZFNsb3QoKSk7XG5cdFx0XHRcdHRoaXNbJHZhbHVlXSA9IHdyaXRlU2xvdChuZXh0KTtcblx0XHRcdH1cblx0XHRcdHJbJHRyaWdnZXJMb2NrJDFdID0gZmFsc2U7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRjb25zdCBzbG90ID0gcmVhZFNsb3QoKTtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gPSBpc1NldCA/ICEhc2xvdCA6IHNsb3QgPz8gdGhpc1skdmFsdWVdO1xuXHRcdH1cblx0fSk7XG5cdG1hcmtSZWFsUHJvcChyLCBzcmNQcm9wKTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoc3JjLCAodiwgX3Byb3AsIG9sZCwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChfcHJvcCA9PT0gc3JjUHJvcCkge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBpc1NldCA/IHYgIT0gbnVsbCA6IHY7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGlzU2V0ID8gb2xkICE9IG51bGwgOiBvbGQ7XG5cdFx0XHRyPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0XHRrZXk6IHNyY1Byb3AsXG5cdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRvbGRWYWx1ZSxcblx0XHRcdFx0dHJpZ2dlclxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblx0YWRkVG9DYWxsQ2hhaW4ociwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiByO1xufTtcbnZhciAkcmVmID0gKHR5cGVkLCBiZWhhdmlvcikgPT4ge1xuXHRzd2l0Y2ggKHR5cGVvZiB0eXBlZCkge1xuXHRcdGNhc2UgXCJib29sZWFuXCI6IHJldHVybiBib29sZWFuUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdFx0Y2FzZSBcIm51bWJlclwiOiByZXR1cm4gbnVtYmVyUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdFx0Y2FzZSBcInN0cmluZ1wiOiByZXR1cm4gc3RyaW5nUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdFx0Y2FzZSBcIm9iamVjdFwiOiBpZiAodHlwZWQgIT0gbnVsbCkgcmV0dXJuIHdyYXBSZWYob2JzZXJ2ZSh0eXBlZCksIGJlaGF2aW9yKTtcblx0XHRkZWZhdWx0OiByZXR1cm4gd3JhcFJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHR9XG59O1xudmFyIHJlZiA9ICh0eXBlZCwgcHJvcCA9IFwidmFsdWVcIiwgYmVoYXZpb3IpID0+IHtcblx0Y29uc3QgJHIgPSBpc09ic2VydmFibGUodHlwZWQpID8gdHlwZWQgOiAkcmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdGlmIChwcm9wICE9IG51bGwpIHJldHVybiBwcm9wUmVmKCRyLCBwcm9wLCBiZWhhdmlvcik7XG5cdGVsc2UgcmV0dXJuICRyO1xufTtcbnZhciBwcm9taXNlZCA9IChwcm9taXNlLCBiZWhhdmlvcikgPT4ge1xuXHRyZXR1cm4gcmVmKHByb21pc2UsIGJlaGF2aW9yKTtcbn07XG52YXIgdHJpZ2dlcldpdGhEZWxheSA9IChyZWYsIGNiLCBkZWxheSA9IDEwMCkgPT4ge1xuXHRpZiAocmVmPy52YWx1ZSA/PyByZWYpIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRpZiAocmVmLnZhbHVlKSBjYj8uKCk7XG5cdH0sIGRlbGF5KTtcbn07XG52YXIgZGVsYXllZEJlaGF2aW9yID0gKGRlbGF5ID0gMTAwKSA9PiB7XG5cdHJldHVybiAoY2IsIFt2YWxdLCBbc2lnXSkgPT4ge1xuXHRcdGxldCB0bSA9IHRyaWdnZXJXaXRoRGVsYXkodmFsLCBjYiwgZGVsYXkpO1xuXHRcdHNpZz8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwiYWJvcnRcIiwgKCkgPT4ge1xuXHRcdFx0aWYgKHRtKSBjbGVhclRpbWVvdXQodG0pO1xuXHRcdH0sIHsgb25jZTogdHJ1ZSB9KTtcblx0fTtcbn07XG52YXIgZGVsYXllZE9ySW5zdGFudEJlaGF2aW9yID0gKGRlbGF5ID0gMTAwKSA9PiB7XG5cdHJldHVybiAoY2IsIFt2YWxdLCBbc2lnXSkgPT4ge1xuXHRcdGxldCB0bSA9IHRyaWdnZXJXaXRoRGVsYXkodmFsLCBjYiwgZGVsYXkpO1xuXHRcdHNpZz8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwiYWJvcnRcIiwgKCkgPT4ge1xuXHRcdFx0aWYgKHRtKSBjbGVhclRpbWVvdXQodG0pO1xuXHRcdH0sIHsgb25jZTogdHJ1ZSB9KTtcblx0XHRpZiAoIXRtKSBjYj8uKCk7XG5cdH07XG59O1xuZnVuY3Rpb24gb2JzZXJ2ZSh0YXJnZXQsIHN0YXRlTmFtZSkge1xuXHRpZiAodGFyZ2V0ID09IG51bGwgfHwgdHlwZW9mIHRhcmdldCA9PSBcInN5bWJvbFwiIHx8ICEodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSB8fCAkaXNPYnNlcnZhYmxlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGlmICgodGFyZ2V0ID0gZGVyZWY/Lih0YXJnZXQpKSA9PSBudWxsIHx8IHRhcmdldCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCAkaXNPYnNlcnZhYmxlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGNvbnN0IHVud3JhcCA9IHRhcmdldDtcblx0aWYgKHVud3JhcCA9PSBudWxsIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJzeW1ib2xcIiB8fCAhKHR5cGVvZiB1bndyYXAgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIikgfHwgdW53cmFwIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrUmVmKSByZXR1cm4gdW53cmFwO1xuXHRsZXQgcmVhY3RpdmUgPSB1bndyYXA7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVBcnJheSh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVNYXAodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodW53cmFwIGluc3RhbmNlb2YgU2V0KSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlU2V0KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJvYmplY3RcIikge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZU9iamVjdCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fVxuXHRyZXR1cm4gcmVhY3RpdmU7XG59XG52YXIgaXNPYnNlcnZhYmxlID0gKHRhcmdldCkgPT4ge1xuXHRpZiAodHlwZW9mIEhUTUxJbnB1dEVsZW1lbnQgIT0gXCJ1bmRlZmluZWRcIiAmJiB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSByZXR1cm4gdHJ1ZTtcblx0cmV0dXJuICEhKCh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpICYmIHRhcmdldCAhPSBudWxsICYmICh0YXJnZXQ/LlskZXh0cmFjdEtleSRdIHx8IHRhcmdldD8uWyRhZmZlY3RlZF0gfHwgc3Vic2NyaXB0UmVnaXN0cnk/Lmhhcz8uKHRhcmdldCkpKTtcbn07XG52YXIgcmVjb3ZlclJlYWN0aXZlID0gKHRhcmdldCkgPT4ge1xuXHRyZXR1cm4gaXNPYnNlcnZhYmxlKHRhcmdldCkgPyBvYnNlcnZlKHRhcmdldCkgOiBudWxsO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvTWFpbmxpbmUudHNcbnZhciB1c2VPYnNlcnZhYmxlID0gKHVud3JhcCkgPT4ge1xuXHRpZiAodW53cmFwID09IG51bGwgfHwgdHlwZW9mIHVud3JhcCAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiB1bndyYXAgIT0gXCJmdW5jdGlvblwiIHx8IHVud3JhcD8uW1N5bWJvbC5vYnNlcnZhYmxlXSAhPSBudWxsKSByZXR1cm4gdW53cmFwO1xuXHR0cnkge1xuXHRcdHVud3JhcFtTeW1ib2wub2JzZXJ2YWJsZV0gPSBzZWxmPy5jb21wYXRpYmxlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS53YXJuKFwiVW5hYmxlIHRvIGFzc2lnbiA8W1N5bWJvbC5vYnNlcnZhYmxlXT4sIG9iamVjdCB3aWxsIG5vdCBvYnNlcnZhYmxlIGJ5IG90aGVyIGZyYW1ld29ya3NcIik7XG5cdH1cblx0dW53cmFwWyRhZmZlY3RlZF0gPSAoY2IsIHByb3AsIG9wdGlvbnMpID0+IHtcblx0XHRjb25zdCBvYnNlcnZhYmxlID0gdW53cmFwPy5bU3ltYm9sPy5vYnNlcnZhYmxlXTtcblx0XHRvYnNlcnZhYmxlPy4oKT8uYWZmZWN0ZWQ/LihjYiwgcHJvcCwgb3B0aW9ucyk7XG5cdFx0cmV0dXJuICgpID0+IG9ic2VydmFibGU/LigpPy51bmFmZmVjdGVkPy4oY2IsIHByb3ApO1xuXHR9O1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciBzcGVjaWFsaXplZFN1YnNjcmliZSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGNoZWNrVmFsaWRPYmogPSAob2JqKSA9PiB7XG5cdGlmICh0eXBlb2Ygb2JqID09IFwic3ltYm9sXCIgfHwgb2JqID09IG51bGwgfHwgISh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIG9iaiA9PSBcImZ1bmN0aW9uXCIpKSByZXR1cm47XG5cdHJldHVybiBvYmo7XG59O1xudmFyIGluaXRpYWxUcmlnZ2VyID0gXCJpbml0aWFsXCI7XG52YXIgcmVhbFByb3BPZiA9ICh0YXJnZXQpID0+IHtcblx0Y29uc3QgcHJvcCA9IHRhcmdldD8uWyRyZWFsUHJvcF0gPz8gdGFyZ2V0Py5yZWFsUHJvcDtcblx0cmV0dXJuIGlzS2V5VHlwZShwcm9wKSA/IHByb3AgOiBudWxsO1xufTtcbnZhciBub3JtYWxpemVBZmZlY3RlZFByb3AgPSAodGFyZ2V0LCBwcm9wKSA9PiB7XG5cdGNvbnN0IHJlYWxQcm9wID0gcmVhbFByb3BPZih0YXJnZXQpO1xuXHRpZiAocmVhbFByb3AgIT0gbnVsbCAmJiAocHJvcCA9PSBudWxsIHx8IHByb3AgPT0gXCJ2YWx1ZVwiKSkgcmV0dXJuIHJlYWxQcm9wO1xuXHRyZXR1cm4gcHJvcDtcbn07XG52YXIgcHJvcFZhbHVlT2YgPSAodGFyZ2V0LCBwcm9wKSA9PiB7XG5cdGlmIChwcm9wICE9IG51bGwgJiYgcHJvcCA9PSByZWFsUHJvcE9mKHRhcmdldCkpIHJldHVybiB0YXJnZXQ/LnZhbHVlO1xuXHRyZXR1cm4gdGFyZ2V0Py5bcHJvcF07XG59O1xudmFyIGNhbGxCeVByb3BSZWZBd2FyZSA9ICh0YXJnZXQsIHByb3AsIGNiLCBjdHgpID0+IHtcblx0aWYgKHByb3AgIT0gbnVsbCAmJiBwcm9wID09IHJlYWxQcm9wT2YodGFyZ2V0KSkge1xuXHRcdGNvbnN0IHZhbHVlID0gcHJvcFZhbHVlT2YodGFyZ2V0LCBwcm9wKTtcblx0XHRpZiAodmFsdWUgIT0gbnVsbCkgcmV0dXJuIGNiPy4odmFsdWUsIHByb3AsIG51bGwsIFwic2V0XCIpO1xuXHR9XG5cdHJldHVybiBjYWxsQnlQcm9wKHRhcmdldCwgcHJvcCwgY2IsIGN0eCk7XG59O1xudmFyIHdpdGhUcmlnZ2VyID0gKGNiLCBvcHRpb25zLCB0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdGlmICh0cmlnZ2VyID09IGluaXRpYWxUcmlnZ2VyKSB7XG5cdFx0aWYgKCFub3JtYWxpemVkLnRyaWdnZXJJbW1lZGlhdGVseSkgcmV0dXJuO1xuXHR9IGVsc2UgaWYgKCF0cmlnZ2VyRmlsdGVyQWxsb3dzKG5vcm1hbGl6ZWQuYWZmZWN0VHlwZXMsIHRyaWdnZXIpKSByZXR1cm47XG5cdHJldHVybiAodmFsdWUsIG5hbWUsIG9sZFZhbHVlLCAuLi5ldGMpID0+IGNiPy4odmFsdWUsIG5hbWUsIG9sZFZhbHVlLCB0cmlnZ2VyLCAuLi5ldGMpO1xufTtcbnZhciBzdWJzY3JpYmVEaXJlY3RseSA9ICh0YXJnZXQsIHByb3AsIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoIXRhcmdldCkgcmV0dXJuO1xuXHRpZiAoIWNoZWNrVmFsaWRPYmoodGFyZ2V0KSkgcmV0dXJuO1xuXHRjb25zdCB0UHJvcCA9IHByb3AgIT0gU3ltYm9sLml0ZXJhdG9yID8gbm9ybWFsaXplQWZmZWN0ZWRQcm9wKHRhcmdldCwgcHJvcCkgOiBudWxsO1xuXHRsZXQgcmVnaXN0cnkgPSB0YXJnZXQ/LlskcmVnaXN0cnlLZXkkXSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0dGFyZ2V0ID0gdGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSA/PyB0YXJnZXQ7XG5cdHF1ZXVlTWljcm90YXNrKCgpID0+IHtcblx0XHRjb25zdCBpbml0aWFsQ2IgPSB3aXRoVHJpZ2dlcihjYiwgb3B0aW9ucywgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdGlmICghaW5pdGlhbENiKSByZXR1cm47XG5cdFx0aWYgKHRQcm9wICE9IG51bGwgJiYgdFByb3AgIT0gU3ltYm9sLml0ZXJhdG9yKSBjYWxsQnlQcm9wUmVmQXdhcmUodGFyZ2V0LCB0UHJvcCwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRlbHNlIGNhbGxCeUFsbFByb3AodGFyZ2V0LCBpbml0aWFsQ2IsIG51bGwpO1xuXHR9KTtcblx0bGV0IHVuU3ViID0gcmVnaXN0cnk/LmFmZmVjdGVkPy4oY2IsIHRQcm9wLCBvcHRpb25zKTtcblx0aWYgKHRhcmdldD8uW1N5bWJvbC5kaXNwb3NlXSkgcmV0dXJuIHVuU3ViO1xuXHRhZGRUb0NhbGxDaGFpbih1blN1YiwgU3ltYm9sLmRpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odW5TdWIsIFN5bWJvbC5hc3luY0Rpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odGFyZ2V0LCBTeW1ib2wuZGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih0YXJnZXQsIFN5bWJvbC5hc3luY0Rpc3Bvc2UsIHVuU3ViKTtcblx0cmV0dXJuIHVuU3ViO1xufTtcbnZhciBzdWJzY3JpYmVJbnB1dCA9ICh0ZywgXywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IGFmZmVjdFR5cGVzID0gbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpLmFmZmVjdFR5cGVzO1xuXHRjb25zdCAkb3B0ID0ge307XG5cdGxldCBvbGRWYWx1ZSA9IHRnPy52YWx1ZTtcblx0Y29uc3QgJGNiID0gKGV2KSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSBldj8udGFyZ2V0Py52YWx1ZTtcblx0XHRpZiAodHJpZ2dlckZpbHRlckFsbG93cyhhZmZlY3RUeXBlcywgXCJzZXRcIikpIGNiPy4odmFsdWUsIFwidmFsdWVcIiwgb2xkVmFsdWUsIFwic2V0XCIsIGV2KTtcblx0XHRvbGRWYWx1ZSA9IHZhbHVlO1xuXHR9O1xuXHR0Zz8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwiY2hhbmdlXCIsICRjYiwgJG9wdCk7XG5cdHJldHVybiAoKSA9PiB0Zz8ucmVtb3ZlRXZlbnRMaXN0ZW5lcj8uKFwiY2hhbmdlXCIsICRjYiwgJG9wdCk7XG59O1xudmFyIGNoZWNrSXNQYWlyZWQgPSAodGcpID0+IHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodGcpICYmIHRnPy5sZW5ndGggPT0gMiAmJiBjaGVja1ZhbGlkT2JqKHRnPy5bMF0pICYmIChpc0tleVR5cGUodGc/LlsxXSkgfHwgdGc/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpO1xufTtcbnZhciBpc0VmZmVjdE9wdGlvbnNBcmcgPSAodmFsdWUpID0+IHtcblx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIChcImFmZmVjdFR5cGVzXCIgaW4gdmFsdWUgfHwgXCJ0cmlnZ2Vyc1wiIGluIHZhbHVlIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gdmFsdWUpO1xufTtcbnZhciBub3JtYWxpemVFZmZlY3RUYXJnZXRzID0gKHRhcmdldHMpID0+IHtcblx0aWYgKHRhcmdldHMgPT0gbnVsbCkgcmV0dXJuIFtdO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXRzKSAmJiAhY2hlY2tJc1BhaXJlZCh0YXJnZXRzKSAmJiAhaXNPYnNlcnZhYmxlKHRhcmdldHMpKSByZXR1cm4gdGFyZ2V0cztcblx0cmV0dXJuIFt0YXJnZXRzXTtcbn07XG52YXIgZWZmZWN0VGFyZ2V0Q29udGV4dCA9IChzb3VyY2UpID0+IHtcblx0aWYgKGNoZWNrSXNQYWlyZWQoc291cmNlKSkge1xuXHRcdGNvbnN0IHRhcmdldCA9IHNvdXJjZT8uWzBdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzb3VyY2UsXG5cdFx0XHR0YXJnZXQsXG5cdFx0XHRwcm9wOiBub3JtYWxpemVBZmZlY3RlZFByb3AodGFyZ2V0LCBzb3VyY2U/LlsxXSlcblx0XHR9O1xuXHR9XG5cdHJldHVybiB7XG5cdFx0c291cmNlLFxuXHRcdHRhcmdldDogc291cmNlLFxuXHRcdHByb3A6IG51bGxcblx0fTtcbn07XG52YXIgdG9FZmZlY3RFdmVudCA9IChzb3VyY2UsIHRhcmdldCwgdmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyLCBhcmdzKSA9PiAoe1xuXHRzb3VyY2UsXG5cdHRhcmdldCxcblx0dmFsdWUsXG5cdHByb3AsXG5cdG5hbWU6IHByb3AsXG5cdG9sZFZhbHVlLFxuXHR0cmlnZ2VyLFxuXHRhcmdzXG59KTtcbnZhciBzdWJzY3JpYmVQYWlyZWQgPSAodGcsIF8sIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRjb25zdCBwcm9wID0gaXNLZXlUeXBlKHRnPy5bMV0pID8gdGc/LlsxXSA6IG51bGw7XG5cdHJldHVybiBhZmZlY3RlZCh0Zz8uWzBdLCBwcm9wLCBjYiwgb3B0aW9ucyk7XG59O1xudmFyIHN1YnNjcmliZVRoZW5hYmxlID0gKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBvYmo/LnRoZW4/Ligob2JqKSA9PiBhZmZlY3RlZD8uKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMpKT8uY2F0Y2g/LigoZSkgPT4ge1xuXHRcdGNvbnNvbGUud2FybihlKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fSk7XG59O1xudmFyIGFmZmVjdGVkID0gKG9iaiwgcHJvcCwgY2IgPSAoKSA9PiB7fSwgb3B0aW9ucykgPT4ge1xuXHRpZiAodHlwZW9mIHByb3AgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0b3B0aW9ucyA9IGNiO1xuXHRcdGNiID0gcHJvcDtcblx0XHRwcm9wID0gbnVsbDtcblx0fSBlbHNlIHByb3AgPSBub3JtYWxpemVBZmZlY3RlZFByb3Aob2JqLCBwcm9wKTtcblx0aWYgKHR5cGVvZiBjYiA9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkoY2IpKSB7XG5cdFx0b3B0aW9ucyA9IGNiO1xuXHRcdGNiID0gKCkgPT4ge307XG5cdH1cblx0aWYgKGlzUHJpbWl0aXZlKG9iaikgfHwgdHlwZW9mIG9iaiA9PSBcInN5bWJvbFwiKSB7XG5cdFx0aWYgKG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKS50cmlnZ2VySW1tZWRpYXRlbHkpIHJldHVybiBQcm9taXNlZChnbG9iYWxUaGlzPy5Qcm9taXNlPy50cnk/LigoKSA9PiB7XG5cdFx0XHRyZXR1cm4gY2I/LihvYmosIG51bGwsIG51bGwsIG51bGwsIGluaXRpYWxUcmlnZ2VyKTtcblx0XHR9KSk7XG5cdH1cblx0aWYgKHR5cGVvZiBvYmo/LlskYWZmZWN0ZWRdID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG9iaj8uWyRhZmZlY3RlZF0/LihjYiwgcHJvcCwgb3B0aW9ucyk7XG5cdGVsc2UgaWYgKGNoZWNrVmFsaWRPYmoob2JqKSkge1xuXHRcdGNvbnN0IHdyYXBwZWQgPSBvYmo7XG5cdFx0aWYgKHNwZWNpYWxpemVkU3Vic2NyaWJlPy5oYXM/LihvYmogPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iaikpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0Py4ob2JqKT8uKHdyYXBwZWQsIHByb3AsIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaXNPYnNlcnZhYmxlKHdyYXBwZWQpIHx8IGNoZWNrSXNQYWlyZWQob2JqKSAmJiBpc09ic2VydmFibGUob2JqPy5bMF0pKSB7XG5cdFx0XHRpZiAoaXNUaGVuYWJsZShvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVUaGVuYWJsZSk/LihvYmosIHByb3AsIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgaWYgKGNoZWNrSXNQYWlyZWQob2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlUGFpcmVkKT8uKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMpO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIEhUTUxJbnB1dEVsZW1lbnQgIT0gXCJ1bmRlZmluZWRcIiAmJiBvYmogaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVJbnB1dCk/LihvYmosIHByb3AsIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlRGlyZWN0bHkpPy4od3JhcHBlZCwgcHJvcCwgY2IsIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBpbml0aWFsQ2IgPSB3aXRoVHJpZ2dlcihjYiwgb3B0aW9ucywgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdFx0aWYgKCFpbml0aWFsQ2IpIHJldHVybjtcblx0XHRcdHJldHVybiBQcm9taXNlZChnbG9iYWxUaGlzPy5Qcm9taXNlPy50cnk/LigoKSA9PiB7XG5cdFx0XHRcdGlmIChjaGVja0lzUGFpcmVkKG9iaikpIHJldHVybiBjYWxsQnlQcm9wUmVmQXdhcmU/LihvYmo/LlswXSwgb2JqPy5bMV0sIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgaWYgKHByb3AgIT0gbnVsbCAmJiBwcm9wICE9IFN5bWJvbC5pdGVyYXRvcikgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaiwgcHJvcCwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdFx0ZWxzZSByZXR1cm4gY2FsbEJ5QWxsUHJvcD8uKG9iaiwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdH0pKTtcblx0XHR9XG5cdH1cbn07XG5mdW5jdGlvbiBlZmZlY3QoY2IsIHRhcmdldHMsIG9wdGlvbnMpIHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAoaXNFZmZlY3RPcHRpb25zQXJnKHRhcmdldHMpICYmIG9wdGlvbnMgPT09IHZvaWQgMCkgcmV0dXJuIGVmZmVjdEdsb2JhbGx5KGNiLCB0YXJnZXRzKTtcblx0aWYgKHRhcmdldHMgPT0gbnVsbCkgcmV0dXJuIGVmZmVjdEdsb2JhbGx5KGNiLCBvcHRpb25zKTtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMob3B0aW9ucyk7XG5cdGNvbnN0IGFmZmVjdGVkT3B0aW9ucyA9IHtcblx0XHRhZmZlY3RUeXBlczogbm9ybWFsaXplZC5hZmZlY3RUeXBlcyxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG5vcm1hbGl6ZWQudHJpZ2dlckltbWVkaWF0ZWx5XG5cdH07XG5cdGNvbnN0IGRpc3Bvc2VycyA9IG5vcm1hbGl6ZUVmZmVjdFRhcmdldHModGFyZ2V0cykubWFwKChzb3VyY2UpID0+IHtcblx0XHRjb25zdCBjdHggPSBlZmZlY3RUYXJnZXRDb250ZXh0KHNvdXJjZSk7XG5cdFx0cmV0dXJuIGFmZmVjdGVkKGN0eC50YXJnZXQsIGN0eC5wcm9wLCAodmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyLCAuLi5hcmdzKSA9PiB7XG5cdFx0XHRyZXR1cm4gY2IodG9FZmZlY3RFdmVudChjdHguc291cmNlLCBjdHgudGFyZ2V0LCB2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIgPz8gbnVsbCwgYXJncykpO1xuXHRcdH0sIGFmZmVjdGVkT3B0aW9ucyk7XG5cdH0pLmZpbHRlcigoZGlzcG9zZSkgPT4gdHlwZW9mIGRpc3Bvc2UgPT0gXCJmdW5jdGlvblwiKTtcblx0cmV0dXJuICgpID0+IGRpc3Bvc2Vycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlPy4oKSk7XG59XG5mdW5jdGlvbiBlZmZlY3RlZCh0YXJnZXRzLCBjYiwgb3B0aW9ucykge1xuXHRyZXR1cm4gZWZmZWN0KGNiLCB0YXJnZXRzLCBvcHRpb25zKTtcbn1cbnZhciBtYWtlQXJyYXlPYnNlcnZhYmxlID0gKHRnKSA9PiB7XG5cdGlmICh0ZyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIG9ic2VydmFibGVCeVNldCh0Zyk7XG5cdGlmICh0ZyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIG9ic2VydmFibGVCeU1hcCh0Zyk7XG5cdHJldHVybiB0Zztcbn07XG52YXIgRG91YmxlV2Vha01hcCA9IGNsYXNzIHtcblx0I3RvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHQjZW5zdXJlSW5uZXIoa2V5MSkge1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG51bGw7XG5cdFx0bGV0IGlubmVyID0gdGhpcy4jdG9wLmdldChrZXkxKTtcblx0XHRpZiAoIWlubmVyKSB7XG5cdFx0XHRpbm5lciA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRcdFx0dGhpcy4jdG9wLnNldChrZXkxLCBpbm5lcik7XG5cdFx0fVxuXHRcdHJldHVybiBpbm5lcjtcblx0fVxuXHQjc3BsaXRQYWlyKHBhaXIpIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkocGFpcikgfHwgcGFpci5sZW5ndGggIT09IDIpIHJldHVybiBbbnVsbCwgbnVsbF07XG5cdFx0cmV0dXJuIHBhaXI7XG5cdH1cblx0aGFzTDEoa2V5MSkge1xuXHRcdHJldHVybiB0aGlzLiN0b3AuaGFzKGtleTEpO1xuXHR9XG5cdHNldChwYWlyLCB2YWx1ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0aGlzO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0Z2V0KHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdm9pZCAwO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZ2V0KGtleTEpPy5nZXQoa2V5Mik7XG5cdH1cblx0aGFzKHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5nZXQoa2V5MSk/LmhhcyhrZXkyKSA/PyBmYWxzZTtcblx0fVxuXHRkZWxldGUocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI3RvcC5nZXQoa2V5MSk7XG5cdFx0cmV0dXJuIGlubmVyID8gaW5uZXIuZGVsZXRlKGtleTIpIDogZmFsc2U7XG5cdH1cblx0ZGVsZXRlVG9wKGtleTEpIHtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmRlbGV0ZShrZXkxKTtcblx0fVxuXHRnZXRPckNyZWF0ZShwYWlyLCBmYWN0b3J5KSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhY3Rvcnk/LigpO1xuXHRcdGlmIChpbm5lci5oYXMoa2V5MikpIHJldHVybiBpbm5lci5nZXQoa2V5Mik7XG5cdFx0Y29uc3QgdmFsdWUgPSBmYWN0b3J5KCk7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblx0Z2V0T3JJbnNlcnQocGFpciwgdmFsdWUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRnZXRPckluc2VydENvbXB1dGVkKHBhaXIsIGNvbXB1dGUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY29tcHV0ZT8uKFtrZXkxLCBrZXkyXSk7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRjb25zdCB2YWx1ZSA9IGNvbXB1dGUoW2tleTEsIGtleTJdKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxufTtcbnZhciByZWdpc3RlcmVkSXRlcmF0ZWQgPSBuZXcgRG91YmxlV2Vha01hcCgpO1xuZnVuY3Rpb24gaXRlcmF0ZWQodGcsIGNiLCBvcHRpb25zID0gW1wiKlwiXSkge1xuXHRpZiAoIXRnKSByZXR1cm47XG5cdGlmICh0eXBlb2YgdGcgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHRnICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0aWYgKHJlZ2lzdGVyZWRJdGVyYXRlZC5oYXMoW3RnLCBjYl0pKSByZXR1cm4gcmVnaXN0ZXJlZEl0ZXJhdGVkLmdldChbdGcsIGNiXSk7XG5cdGNvbnN0ICRzdWIgPSAodmFsdWUsIG5hbWUsIG9sZCwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChuYW1lID09IFwidmFsdWVcIikge1xuXHRcdFx0Y29uc3QgZW50cmllcyA9IChvbGQ/LnZhbHVlID8/IG9sZCk/LmVudHJpZXM/LigpO1xuXHRcdFx0Y29uc3QgYmFzaXMgPSB0Zz8udmFsdWUgPz8gdmFsdWU/LnZhbHVlID8/IHZhbHVlO1xuXHRcdFx0aWYgKGVudHJpZXMpIGZvciAoY29uc3QgW2lkeCwgaXRlbV0gb2YgZW50cmllcykge1xuXHRcdFx0XHRjb25zdCBvZk9sZCA9IGl0ZW0gPz8gKG9sZD8udmFsdWUgPz8gb2xkKT8uW2lkeF0gPz8gbnVsbDtcblx0XHRcdFx0Y29uc3Qgb2ZOZXcgPSBiYXNpcz8uW2lkeF07XG5cdFx0XHRcdGlmIChvZk9sZCA9PSBudWxsICYmIG9mTmV3ICE9IG51bGwpIGNiKG9mTmV3LCBpZHgsIG51bGwsIFwiYWRkXCIpO1xuXHRcdFx0XHRlbHNlIGlmIChvZk9sZCAhPSBudWxsICYmIG9mTmV3ID09IG51bGwpIGNiKG51bGwsIGlkeCwgb2ZPbGQsIFwiZGVsZXRlXCIpO1xuXHRcdFx0XHRlbHNlIGlmIChpc05vdEVxdWFsKG9mT2xkLCBvZk5ldykpIGNiKG9mTmV3LCBpZHgsIG9mT2xkLCBcInNldFwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpdGVyYXRlZCh2YWx1ZSA/PyB0Zz8udmFsdWUsIGNiLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5hbWUgPT0gbnVsbCA/IHZvaWQgMCA6IHRnW25hbWVdO1xuXHR9O1xuXHRyZXR1cm4gcmVnaXN0ZXJlZEl0ZXJhdGVkLmdldE9ySW5zZXJ0Q29tcHV0ZWQoW3RnLCBjYl0sICgpID0+IHtcblx0XHRpZiAodGcgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBhZmZlY3RlZChbb2JzZXJ2YWJsZUJ5U2V0KHRnKSwgU3ltYm9sLml0ZXJhdG9yXSwgY2IsIG9wdGlvbnMpO1xuXHRcdGlmICh0ZyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIGFmZmVjdGVkKHRnLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKGhhc1ZhbHVlKHRnKSkgcmV0dXJuIGFmZmVjdGVkKHRnLCAkc3ViLCBvcHRpb25zKTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh0ZykgJiYgISh0Zz8ubGVuZ3RoID09IDIgJiYgaXNLZXlUeXBlKHRnPy5bMV0pICYmIGlzT2JzZXJ2YWJsZSh0Zz8uWzBdKSkpIHJldHVybiBhZmZlY3RlZChbdGcsIFN5bWJvbC5pdGVyYXRvcl0sIGNiLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gYWZmZWN0ZWQodGcsIGNiLCBvcHRpb25zKTtcblx0fSk7XG59XG5mdW5jdGlvbiB1bmFmZmVjdGVkKHRnLCBjYikge1xuXHRyZXR1cm4gd2l0aFByb21pc2UodGcsICh0YXJnZXQpID0+IHtcblx0XHRjb25zdCBpc1BhaXIgPSBBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgdGFyZ2V0Py5sZW5ndGggPT0gMiAmJiBbXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiXS5pbmRleE9mKHR5cGVvZiB0YXJnZXQ/LlswXSkgPj0gMCAmJiBpc0tleVR5cGUodGFyZ2V0Py5bMV0pO1xuXHRcdGNvbnN0IHByb3AgPSBpc1BhaXIgPyB0YXJnZXQ/LlsxXSA6IG51bGw7XG5cdFx0dGFyZ2V0ID0gaXNQYWlyICYmIHByb3AgIT0gbnVsbCA/IHRhcmdldD8uWzBdID8/IHRhcmdldCA6IHRhcmdldDtcblx0XHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldDtcblx0XHQodGFyZ2V0Py5bJHJlZ2lzdHJ5S2V5JF0gPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHVud3JhcCkpPy51bmFmZmVjdGVkPy4oY2IsIHByb3ApO1xuXHR9KTtcbn1cbnZhciBiaW5kQnkgPSAodGFyZ2V0LCByZWFjdGl2ZSwgd2F0Y2gpID0+IHtcblx0YWZmZWN0ZWQocmVhY3RpdmUsIG51bGwsICh2LCBwKSA9PiB7XG5cdFx0b2JqZWN0QXNzaWduKHRhcmdldCwgdiwgcCwgdHJ1ZSk7XG5cdH0pO1xuXHR3YXRjaD8uKCgpID0+IHRhcmdldCwgKE4pID0+IHtcblx0XHRmb3IgKGNvbnN0IGsgaW4gTikgb2JqZWN0QXNzaWduKHJlYWN0aXZlLCBOW2tdLCBrLCB0cnVlKTtcblx0fSwgeyBkZWVwOiB0cnVlIH0pO1xuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBkZXJpdmF0ZSA9IChmcm9tLCByZWFjdEZuLCB3YXRjaCkgPT4gYmluZEJ5KHJlYWN0Rm4oc2FmZShmcm9tKSksIGZyb20sIHdhdGNoKTtcbnZhciBiaW5kQnlLZXkgPSAodGFyZ2V0LCByZWFjdGl2ZSwga2V5ID0gKCkgPT4gXCJcIikgPT4gYWZmZWN0ZWQocmVhY3RpdmUsIG51bGwsICh2YWx1ZSwgcCkgPT4ge1xuXHRpZiAocCA9PSBrZXkoKSkgb2JqZWN0QXNzaWduKHRhcmdldCwgdmFsdWUsIG51bGwsIHRydWUpO1xufSk7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL0Fzc2lnbmVkLnRzXG52YXIgY29uZGl0aW9uYWxJbmRleCA9IChjb25kTGlzdCA9IFtdKSA9PiB7XG5cdGNvbnN0IHNvdXJjZSA9IG9ic2VydmUoeyB2YWx1ZTogMCB9KTtcblx0Y29uc3QgcmVhZENvbmRpdGlvbiA9IChjb25kaXRpb24pID0+IHtcblx0XHRpZiAodHlwZW9mIGNvbmRpdGlvbiA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb25kaXRpb24oKTtcblx0XHRyZXR1cm4gaGFzVmFsdWUoY29uZGl0aW9uKSA/IGNvbmRpdGlvbi52YWx1ZSA6IGNvbmRpdGlvbjtcblx0fTtcblx0Y29uc3QgZXZhbHVhdGUgPSAoKSA9PiBjb25kTGlzdC5maW5kSW5kZXgoKGNvbmRpdGlvbikgPT4gISFyZWFkQ29uZGl0aW9uKGNvbmRpdGlvbikpO1xuXHRjb25zdCByZXN1bHQgPSBjb21wdXRlZChbc291cmNlLCBcInZhbHVlXCJdLCBldmFsdWF0ZSwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgaW52YWxpZGF0ZSA9ICgpID0+IHtcblx0XHRzb3VyY2UudmFsdWUrKztcblx0fTtcblx0Y29uc3QgZGlzcG9zZXJzID0gW107XG5cdGlmIChpc09ic2VydmFibGUoY29uZExpc3QpKSBkaXNwb3NlcnMucHVzaChhZmZlY3RlZChjb25kTGlzdCwgaW52YWxpZGF0ZSwge1xuXHRcdGFmZmVjdFR5cGVzOiBbXG5cdFx0XHRcImFkZFwiLFxuXHRcdFx0XCJzZXRcIixcblx0XHRcdFwiZGVsZXRlXCJcblx0XHRdLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogZmFsc2Vcblx0fSkpO1xuXHRmb3IgKGNvbnN0IGNvbmRpdGlvbiBvZiBjb25kTGlzdCkgaWYgKGhhc1ZhbHVlKGNvbmRpdGlvbikpIGRpc3Bvc2Vycy5wdXNoKGFmZmVjdGVkKFtjb25kaXRpb24sIFwidmFsdWVcIl0sIGludmFsaWRhdGUsIHtcblx0XHRhZmZlY3RUeXBlczogW1wic2V0dGVyXCJdLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogZmFsc2Vcblx0fSkpO1xuXHRhZGRUb0NhbGxDaGFpbihyZXN1bHQsIFN5bWJvbC5kaXNwb3NlLCAoKSA9PiBkaXNwb3NlcnMuZm9yRWFjaCgoZGlzcG9zZSkgPT4gZGlzcG9zZT8uKCkpKTtcblx0cmV0dXJuIHJlc3VsdDtcbn07XG52YXIgY29uZGl0aW9uYWxSZWYgPSAoY29uZCwgaWZUcnVlLCBpZkZhbHNlLCBiZWhhdmlvcikgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUoY29uZCkpIHJldHVybiBjb25kID8gaWZUcnVlIDogaWZGYWxzZTtcblx0Y29uc3QgZ2V0VHJ1ZSA9ICgpID0+IHtcblx0XHRyZXR1cm4gaWZUcnVlO1xuXHR9O1xuXHRjb25zdCBnZXRGYWxzZSA9ICgpID0+IHtcblx0XHRyZXR1cm4gaWZGYWxzZTtcblx0fTtcblx0Y29uc3QgdmFsdWVPZiA9IChuKSA9PiB7XG5cdFx0aWYgKG4gIT0gbnVsbCkgY29uZC52YWx1ZSA9IGhhc1ZhbHVlKG4pID8gbj8udmFsdWUgOiBuO1xuXHRcdHJldHVybiAoaGFzVmFsdWUoY29uZCkgPyBjb25kPy52YWx1ZSA6IGNvbmQpID8gZ2V0VHJ1ZSgpIDogZ2V0RmFsc2UoKTtcblx0fTtcblx0Y29uc3QgciA9IG9ic2VydmUoe1xuXHRcdFskdmFsdWVdOiB2YWx1ZU9mKCksXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSB2YWx1ZU9mKHYpO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSA9IHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoW2NvbmQsIFwidmFsdWVcIl0sICgpID0+IHtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHI/LlskdmFsdWVdO1xuXHRcdGNvbnN0IHZhbHVlID0gdmFsdWVPZigpO1xuXHRcdHJbJHZhbHVlXSA9IHZhbHVlO1xuXHRcdHI/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlLFxuXHRcdFx0b2xkVmFsdWUsXG5cdFx0XHR0cmlnZ2VyOiBcIm1hbnVhbFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHI7XG59O1xudmFyIGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWxSZWY7XG52YXIgcmVtYXAgPSAoc3ViLCBjYiwgZGVzdCkgPT4ge1xuXHRpZiAoIWRlc3QpIGRlc3QgPSBvYnNlcnZlKHt9KTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoc3ViLCAodmFsdWUsIHByb3AsIG9sZCkgPT4ge1xuXHRcdGlmIChwcm9wID09IG51bGwpIHJldHVybjtcblx0XHRjb25zdCBnb3QgPSBjYj8uKHZhbHVlLCBwcm9wLCBvbGQpO1xuXHRcdGlmICh0eXBlb2YgZ290ID09IFwib2JqZWN0XCIpIG9iamVjdEFzc2lnbk5vdEVxdWFsKGRlc3QsIGdvdCk7XG5cdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChkZXN0W3Byb3BdLCBnb3QpKSBkZXN0W3Byb3BdID0gZ290O1xuXHR9KTtcblx0aWYgKGRlc3QpIGFkZFRvQ2FsbENoYWluKGRlc3QsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gZGVzdDtcbn07XG52YXIgdW5pZmllZCA9ICguLi5zdWJzKSA9PiB7XG5cdGNvbnN0IGRlc3QgPSBvYnNlcnZlKHt9KTtcblx0c3Vicz8uZm9yRWFjaD8uKChzdWIpID0+IGFmZmVjdGVkKHN1YiwgKHZhbHVlLCBwcm9wLCBfKSA9PiB7XG5cdFx0aWYgKHByb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGlmIChpc05vdEVxdWFsKGRlc3RbcHJvcF0sIHZhbHVlKSkgZGVzdFtwcm9wXSA9IHZhbHVlO1xuXHR9KSk7XG5cdHJldHVybiBkZXN0O1xufTtcbnZhciBvYnNlcnZhYmxlQnlTZXQgPSAoc2V0KSA9PiB7XG5cdGNvbnN0IG9icyA9IG9ic2VydmUoW10pO1xuXHRvYnMucHVzaCguLi5BcnJheS5mcm9tKHNldD8udmFsdWVzPy4oKSB8fCBbXSkpO1xuXHRhZGRUb0NhbGxDaGFpbihvYnMsIFN5bWJvbC5kaXNwb3NlLCBhZmZlY3RlZChzZXQsICh2YWx1ZSwgXywgb2xkKSA9PiB7XG5cdFx0aWYgKGlzTm90RXF1YWwodmFsdWUsIG9sZCkpIHtcblx0XHRcdGlmIChvbGQgPT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsKSBvYnMucHVzaCh2YWx1ZSk7XG5cdFx0XHRlbHNlIGlmIChvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdGNvbnN0IGlkeCA9IG9icy5pbmRleE9mKG9sZCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCkgb2JzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gb2JzLmluZGV4T2Yob2xkKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwICYmIGlzTm90RXF1YWwob2JzW2lkeF0sIHZhbHVlKSkgb2JzW2lkeF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKTtcblx0cmV0dXJuIG9icztcbn07XG52YXIgb2JzZXJ2YWJsZUJ5TWFwID0gKG1hcCkgPT4ge1xuXHRjb25zdCBvYnMgPSBvYnNlcnZlKFtdKTtcblx0Y29uc3QgaW5pdGlhbEVudHJpZXMgPSBBcnJheS5mcm9tKG1hcC5lbnRyaWVzKCkpO1xuXHRvYnMucHVzaCguLi5pbml0aWFsRW50cmllcyk7XG5cdGFkZFRvQ2FsbENoYWluKG9icywgU3ltYm9sLmRpc3Bvc2UsIGFmZmVjdGVkKG1hcCwgKHZhbHVlLCBwcm9wLCBvbGQpID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2YWx1ZSwgb2xkKSB8fCBvbGQgPT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsIHx8IG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdGlmIChvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdGxldCBpZHggPSBvYnMuZmluZEluZGV4KChbbmFtZSwgX10pID0+IG5hbWUgPT0gcHJvcCk7XG5cdFx0XHRcdGlmIChpZHggPCAwKSBpZHggPSBvYnMuZmluZExhc3RJbmRleCgoW18sIHZhbF0pID0+IG9sZCA9PT0gdmFsKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwKSBvYnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgaWR4ID0gb2JzLmZpbmRJbmRleCgoW25hbWUsIF9dKSA9PiBuYW1lID09IHByb3ApO1xuXHRcdFx0XHRpZiAoaWR4ID49IDAgJiYgaWR4IDwgb2JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlmIChpc05vdEVxdWFsKG9ic1tpZHhdPy5bMV0sIHZhbHVlKSkgb2JzW2lkeF0gPSBbcHJvcCwgdmFsdWVdO1xuXHRcdFx0XHR9IGVsc2Ugb2JzLnB1c2goW3Byb3AsIHZhbHVlXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KSk7XG5cdHJldHVybiBvYnM7XG59O1xudmFyIGFzc2lnbk1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGFzc2lnbiA9IChhLCBiLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IGlzQUNvbXB1dGUgPSB0eXBlb2YgYT8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBhPy5sZW5ndGggPT0gMiwgaXNCQ29tcHV0ZSA9IHR5cGVvZiBiPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIGI/Lmxlbmd0aCA9PSAyLCBjbXBCRm5jID0gaXNCQ29tcHV0ZSA/IGI/LlsxXSA6IG51bGw7XG5cdGNvbnN0IGlzQVByb3AgPSAoaXNLZXlUeXBlKGE/LlsxXSkgfHwgYT8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgYT8ubGVuZ3RoID09IDI7XG5cdGxldCBhX3Byb3AgPSBpc0FQcm9wICYmICFpc0FDb21wdXRlID8gYT8uWzFdIDogQXJyYXkuaXNBcnJheShhKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQVByb3AgJiYgIWlzQUNvbXB1dGUpIGEgPSBbYSwgYV9wcm9wXTtcblx0aWYgKGlzQUNvbXB1dGUpIGFbMV0gPSBhX3Byb3A7XG5cdGNvbnN0IGlzQlByb3AgPSAoaXNLZXlUeXBlKGI/LlsxXSkgfHwgYj8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgYj8ubGVuZ3RoID09IDI7XG5cdGxldCBiX3Byb3AgPSBpc0JQcm9wICYmICFpc0JDb21wdXRlID8gYj8uWzFdIDogQXJyYXkuaXNBcnJheShiKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQlByb3AgJiYgIWlzQkNvbXB1dGUpIGIgPSBbYiwgYl9wcm9wXTtcblx0aWYgKGlzQkNvbXB1dGUpIGJbMV0gPSBiX3Byb3A7XG5cdGlmIChhX3Byb3AgPT0gbnVsbCB8fCBiX3Byb3AgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShhX3Byb3AsIGE/LlswXSkgfHwgaXNBcnJheUludmFsaWRLZXkoYl9wcm9wLCBiPy5bMF0pKSByZXR1cm47XG5cdGlmICghKCh0eXBlb2YgYj8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGI/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmIGI/LlswXSAhPSBudWxsKSAmJiAhQXJyYXkuaXNBcnJheShhWzBdKSkge1xuXHRcdCRhdm9pZFRyaWdnZXIoYiwgKCkgPT4ge1xuXHRcdFx0YVswXVthX3Byb3BdID0gYj8uWzBdO1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB7fTtcblx0fVxuXHRjb25zdCBjb21wdXRlID0gKHYsIHApID0+IHtcblx0XHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKTtcblx0XHRjb25zdCBiX3RtcCA9IGJSZWY/LmRlcmVmPy4oKTtcblx0XHRpZiAoYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmJvdW5kID09IGJfdG1wKSB7XG5cdFx0XHRsZXQgdmFsID0gbnVsbDtcblx0XHRcdGNvbnN0IGNtcGZ4ID0gYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmNtcGZ4O1xuXHRcdFx0JGF2b2lkVHJpZ2dlcihiX3RtcCwgKCkgPT4ge1xuXHRcdFx0XHRpZiAodHlwZW9mIGNtcGZ4ID09IFwiZnVuY3Rpb25cIikgdmFsID0gY21wZng/LigkZ2V0VmFsdWUoYl90bXApID8/IHYsIHAsIG51bGwpO1xuXHRcdFx0XHRlbHNlIHZhbCA9IGJfdG1wPy5bcF0gPz8gdjtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgbnYgPSAkZ2V0VmFsdWUodmFsKTtcblx0XHRcdGlmIChpc05vdEVxdWFsKGFfdG1wW2FfcHJvcF0sIG52KSkgJGF2b2lkVHJpZ2dlcihiX3RtcCwgKCkgPT4ge1xuXHRcdFx0XHRhX3RtcFthX3Byb3BdID0gbnY7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgKChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKSk/LmdldD8uKGFfcHJvcCkpPy5kaXNwb3NlPy4oKTtcblx0fTtcblx0Y29uc3QgZGlzcG9zZSA9ICgpID0+IHtcblx0XHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKTtcblx0XHRjb25zdCBtYXAgPSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKTtcblx0XHRjb25zdCBzdG9yZSA9IG1hcD8uZ2V0Py4oYV9wcm9wKTtcblx0XHRtYXA/LmRlbGV0ZT8uKGFfcHJvcCk7XG5cdFx0c3RvcmU/LnVuc3ViPy4oKTtcblx0fTtcblx0Y29uc3QgYlJlZiA9IGI/LlswXSAhPSBudWxsICYmICh0eXBlb2YgYj8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGI/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmICEoYj8uWzBdIGluc3RhbmNlb2YgV2Vha1JlZiB8fCB0eXBlb2YgYj8uWzBdPy5kZXJlZiA9PSBcImZ1bmN0aW9uXCIpID8gbmV3IFdlYWtSZWYoYj8uWzBdKSA6IGI/LlswXSwgYVJlZiA9IGE/LlswXSAhPSBudWxsICYmICh0eXBlb2YgYT8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGE/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmICEoYT8uWzBdIGluc3RhbmNlb2YgV2Vha1JlZiB8fCB0eXBlb2YgYT8uWzBdPy5kZXJlZiA9PSBcImZ1bmN0aW9uXCIpID8gbmV3IFdlYWtSZWYoYT8uWzBdKSA6IGE/LlswXTtcblx0bGV0IHN0b3JlID0ge1xuXHRcdGNvbXB1dGUsXG5cdFx0ZGlzcG9zZSxcblx0XHRjbXBmeDogY21wQkZuY1xuXHR9O1xuXHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKSwgYl90bXAgPSBiUmVmPy5kZXJlZj8uKCk7XG5cdGlmIChhUmVmIGluc3RhbmNlb2YgV2Vha1JlZikge1xuXHRcdGlmIChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uYm91bmQgIT0gYl90bXApIGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5kZWxldGU/LihhX3Byb3ApO1xuXHRcdHN0b3JlID0gKGFzc2lnbk1hcD8uZ2V0T3JJbnNlcnQ/LihhX3RtcCwgLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSkpPy5nZXRPckluc2VydENvbXB1dGVkPy4oYV9wcm9wLCAoKSA9PiAoe1xuXHRcdFx0Ym91bmQ6IGJfdG1wLFxuXHRcdFx0Y21wZng6IGNtcEJGbmMsXG5cdFx0XHR1bnN1YjogbnVsbCxcblx0XHRcdGNvbXB1dGUsXG5cdFx0XHRkaXNwb3NlXG5cdFx0fSkpO1xuXHRcdHN0b3JlLnVuc3ViID0gYWZmZWN0ZWQoYiwgY29tcHV0ZSk7XG5cdFx0c3RvcmUuY21wZnggPSBjbXBCRm5jO1xuXHRcdGFkZFRvQ2FsbENoYWluKGFfdG1wLCBTeW1ib2wuZGlzcG9zZSwgc3RvcmU/LmRpc3Bvc2UpO1xuXHRcdGFkZFRvQ2FsbENoYWluKGJfdG1wLCBTeW1ib2wuZGlzcG9zZSwgc3RvcmU/LmRpc3Bvc2UpO1xuXHR9XG5cdGlmIChiX3RtcCAmJiAhQXJyYXkuaXNBcnJheShiX3RtcCkpICRhdm9pZFRyaWdnZXIoYV90bXAsICgpID0+IHtcblx0XHRiX3RtcFtiX3Byb3BdID8/PSBhX3RtcD8uW2FfcHJvcF0gPz8gYl90bXBbYl9wcm9wXTtcblx0fSk7XG5cdHJldHVybiBzdG9yZT8uZGlzcG9zZTtcbn07XG52YXIgbGluayA9IChhLCBiLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IHVzdWIgPSBbYXNzaWduKGEsIGIsIHByb3ApLCBhc3NpZ24oYiwgYSwgcHJvcCldO1xuXHRyZXR1cm4gKCkgPT4gdXN1Yj8ubWFwPy4oKGMpID0+IGM/LigpKTtcbn07XG52YXIgY29tcHV0ZWQgPSAoc3JjLCBjYiwgYmVoYXZpb3IsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgaXNBQ29tcHV0ZSA9IHR5cGVvZiBzcmM/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgc3JjPy5sZW5ndGggPT0gMjtcblx0Y29uc3QgaXNBUHJvcCA9IChpc0tleVR5cGUoc3JjPy5bMV0pIHx8IHNyYz8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgc3JjPy5sZW5ndGggPT0gMjtcblx0bGV0IGFfcHJvcCA9IGlzQVByb3AgJiYgIWlzQUNvbXB1dGUgPyBzcmM/LlsxXSA6IEFycmF5LmlzQXJyYXkoc3JjKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQVByb3AgJiYgIWlzQUNvbXB1dGUpIHNyYyA9IFtpc0FQcm9wID8gc3JjPy5bMF0gOiBzcmMsIGFfcHJvcF07XG5cdGlmIChpc0FDb21wdXRlKSBzcmNbMV0gPSBhX3Byb3A7XG5cdGlmIChhX3Byb3AgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShhX3Byb3AsIHNyYz8uWzBdKSkgcmV0dXJuO1xuXHRjb25zdCBjbXAgPSAodikgPT4ge1xuXHRcdGxldCBvbGRWYWx1ZSA9IHZvaWQgMDtcblx0XHRpZiAodiAhPSB2b2lkIDApIHtcblx0XHRcdG9sZFZhbHVlID0gc3JjWzBdW2FfcHJvcF07XG5cdFx0XHRzcmNbMF1bYV9wcm9wXSA9IHY7XG5cdFx0fVxuXHRcdHJldHVybiBjYj8uKHNyYz8uWzBdPy5bYV9wcm9wXSwgYV9wcm9wLCBvbGRWYWx1ZSk7XG5cdH07XG5cdGNvbnN0IGluaXRpYWwgPSBjbXAoKTtcblx0Y29uc3QgcmYgPSBvYnNlcnZlKHtcblx0XHRbJHByb21pc2VdOiB2b2lkIDAsXG5cdFx0WyR2YWx1ZV06IGluaXRpYWwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcoY21wKCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KGNtcCgpID8/IHRoaXNbJHZhbHVlXSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gY21wKHYpO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSA9IGNtcCgpID8/IHRoaXNbJHZhbHVlXTtcblx0XHR9XG5cdH0pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChbc3JjPy5bMF0gPz8gc3JjLCBhX3Byb3AgPz8gXCJ2YWx1ZVwiXSwgKCkgPT4ge1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gcmY/LlskdmFsdWVdO1xuXHRcdGNvbnN0IHZhbHVlID0gY21wKCk7XG5cdFx0cmZbJHZhbHVlXSA9IHZhbHVlO1xuXHRcdHJmPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcjogXCJtYW51YWxcIlxuXHRcdH0pO1xuXHR9KTtcblx0YWRkVG9DYWxsQ2hhaW4ocmYsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcmY7XG59O1xudmFyIGRlbGF5ZWRTdWJzY3JpYmUgPSAocmVmLCBjYiwgZGVsYXkgPSAxMDApID0+IHtcblx0bGV0IHRtO1xuXHRyZXR1cm4gYWZmZWN0ZWQocmVmLCBcInZhbHVlXCIsICh2KSA9PiB7XG5cdFx0aWYgKCF2ICYmIHRtKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodG0pO1xuXHRcdFx0dG0gPSBudWxsO1xuXHRcdH0gZWxzZSBpZiAodiAmJiAhdG0pIHRtID0gdHJpZ2dlcldpdGhEZWxheShyZWYsIGNiLCBkZWxheSkgPz8gdG07XG5cdH0pO1xufTtcblxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyAkYWZmZWN0ZWQsICRyZWYsICR0cmlnZ2VyLCAkdHJpZ2dlckNvbnRyb2wsICR0cmlnZ2VyTGVzcywgJHRyaWdnZXJMb2NrLCBBc3NpZ25PYmplY3RIYW5kbGVyLCBEb3VibGVXZWFrTWFwLCBhZGRUb0NhbGxDaGFpbiwgYWZmZWN0ZWQsIGFzc2lnbiwgYXNzaWduTWFwLCBiaW5kQnksIGJpbmRCeUtleSwgYm9vbGVhblJlZiwgY29tcHV0ZWQsIGNvbmRpdGlvbmFsLCBjb25kaXRpb25hbEluZGV4LCBjb25kaXRpb25hbFJlZiwgZGVsYXllZEJlaGF2aW9yLCBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IsIGRlbGF5ZWRTdWJzY3JpYmUsIGRlcmVmLCBkZXJpdmF0ZSwgZWZmZWN0LCBlZmZlY3RlZCwgaXNPYnNlcnZhYmxlLCBpdGVyYXRlZCwgbGluaywgbWFrZUFycmF5T2JzZXJ2YWJsZSwgbWFrZU9iamVjdEFzc2lnbmFibGUsIG51bWJlclJlZiwgb2JzZXJ2YWJsZUJ5TWFwLCBvYnNlcnZhYmxlQnlTZXQsIG9ic2VydmUsIHByb21pc2VkLCBwcm9wUmVmLCByZWNvdmVyUmVhY3RpdmUsIHJlZiwgcmVtYXAsIHNhZmUsIHNwZWNpYWxpemVkU3Vic2NyaWJlLCBzdHJpbmdSZWYsIHN1YnNjcmliZURpcmVjdGx5LCBzdWJzY3JpYmVJbnB1dCwgc3Vic2NyaWJlUGFpcmVkLCBzdWJzY3JpYmVUaGVuYWJsZSwgdHJpZ2dlcldpdGhEZWxheSwgdW5hZmZlY3RlZCwgdW5pZmllZCwgdW53cmFwLCB1c2VPYnNlcnZhYmxlLCB3cmFwUmVmLCB3cmFwU2V0QXNBcnJheSB9OyJdLAogICJtYXBwaW5ncyI6ICJBQUFBLFNBQVMsaUJBQUFBLElBQWUsYUFBQUMsSUFBVyxnQkFBZ0JDLElBQWdCLFlBQUFDLElBQVUsV0FBQUMsR0FBUyxpQkFBQUMsSUFBZSxjQUFBQyxJQUFZLGlCQUFBQyxJQUFlLFlBQUFDLEdBQVUscUJBQUFDLEdBQW1CLGFBQUFDLEdBQVcsY0FBQUMsR0FBWSxlQUFBQyxHQUFhLG1CQUFBQyxJQUFpQixnQkFBQUMsSUFBYyx3QkFBQUMsSUFBc0Isb0JBQUFDLElBQWtCLHVCQUFBQyxJQUFxQixrQkFBQUMsU0FBc0I7QUFHblQsT0FBTyxlQUFlLHVCQUFPLElBQUksWUFBWTtBQUM3QyxPQUFPLGNBQWMsdUJBQU8sSUFBSSxXQUFXO0FBQzNDLE9BQU8sZ0JBQWdCLHVCQUFPLElBQUksYUFBYTtBQUMvQyxJQUFJQyxJQUFTLHVCQUFPLElBQUksUUFBUSxHQUM1QkMsSUFBZSx1QkFBTyxJQUFJLFVBQVUsR0FDcENDLElBQWdCLHVCQUFPLElBQUksU0FBUyxHQUNwQ0MsS0FBZ0IsdUJBQU8sSUFBSSxXQUFXLEdBQ3RDQyxJQUFZLHVCQUFPLElBQUksV0FBVyxHQUNsQ0MsS0FBVyx1QkFBTyxJQUFJLFVBQVUsR0FDaENDLEtBQWUsdUJBQU8sSUFBSSxlQUFlLEdBQ3pDQyxJQUFlLHVCQUFPLElBQUksZUFBZSxHQUN6Q0MsS0FBa0IsdUJBQU8sSUFBSSxrQkFBa0IsR0FDL0NDLElBQVcsdUJBQU8sSUFBSSxVQUFVLEdBQ2hDQyxLQUFZLHVCQUFPLElBQUksWUFBWSxHQUNuQ0MsS0FBYyx1QkFBTyxJQUFJLGFBQWEsR0FDdENDLEtBQVksdUJBQU8sSUFBSSxXQUFXLEdBSWxDQyxLQUFvQyxvQkFBSSxRQUFRLEdBQ2hEQyxLQUFPLENBQUNDLE1BQVc7QUFDdEIsUUFBTUMsSUFBUyxPQUFPRCxLQUFVLFlBQVksT0FBT0EsS0FBVSxhQUFhQSxJQUFTZCxDQUFZLEtBQUtjLElBQVNBLEdBQVFFLElBQVMsQ0FBQ0MsTUFBTUosR0FBS0ksQ0FBQztBQUMzSSxTQUFJLE1BQU0sUUFBUUYsQ0FBTSxJQUFVQSxHQUFRLE1BQU1DLENBQU0sS0FBSyxNQUFNLEtBQUtELEtBQVUsQ0FBQyxDQUFDLEdBQUcsTUFBTUMsQ0FBTSxLQUFLLENBQUMsSUFDOUZELGFBQWtCLE9BQU9BLGFBQWtCLFVBQWdCLElBQUksSUFBSSxNQUFNLEtBQUtBLEdBQVEsVUFBVSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDRyxHQUFHQyxDQUFDLE1BQU0sQ0FBQ0QsR0FBR0wsR0FBS00sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUN6SUosYUFBa0IsT0FBT0EsYUFBa0IsVUFBZ0IsSUFBSSxJQUFJLE1BQU0sS0FBS0EsR0FBUSxTQUFTLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTUMsQ0FBTSxDQUFDLElBQ3RIRCxLQUFVLFFBQVEsT0FBT0EsS0FBVSxjQUFjLE9BQU9BLEtBQVUsV0FBaUIsT0FBTyxZQUFZLE1BQU0sS0FBSyxPQUFPLFFBQVFBLEtBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUNHLENBQUMsTUFBTUEsS0FBS2xCLEtBQWdCa0IsS0FBS2pCLEtBQWlCaUIsS0FBS2hCLEVBQWEsR0FBRyxNQUFNLENBQUMsQ0FBQ2dCLEdBQUdDLENBQUMsTUFBTSxDQUFDRCxHQUFHTCxHQUFLTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQ3pRSjtBQUNSLEdBQ0lBLEtBQVMsQ0FBQ0ssTUFDTkEsSUFBTXBCLENBQVksS0FBS29CLElBQU0sU0FBUyxLQUFLQSxHQUUvQ0MsSUFBUSxDQUFDUCxHQUFRUSxJQUFnQixPQUFVO0FBQzlDLFFBQU1DLElBQVdUO0FBQ2pCLE1BQUl0QixFQUFZc0IsQ0FBTSxLQUFLLE9BQU9BLEtBQVUsU0FBVSxRQUFPQTtBQUU3RCxNQURJQSxLQUFVLFNBQVNBLGFBQWtCLFdBQVcsV0FBV0EsS0FBVSxPQUFPQSxHQUFRLFNBQVMsZ0JBQWFBLElBQVNBLEdBQVEsUUFBUSxJQUNuSUEsS0FBVSxTQUFTLE9BQU9BLEtBQVUsWUFBWSxPQUFPQSxLQUFVLGFBQWE7QUFDakYsSUFBQUEsSUFBU0MsR0FBT0QsQ0FBTTtBQUN0QixVQUFNVSxJQUFPRixLQUFpQmxDLEVBQVMwQixDQUFNLEtBQUtBLEdBQVE7QUFFMUQsUUFESVUsS0FBUSxTQUFTLE9BQU9BLEtBQVEsWUFBWSxPQUFPQSxLQUFRLGdCQUFhVixJQUFTVSxJQUNqRkQsS0FBWVQsRUFBUSxRQUFPTyxFQUFNUCxHQUFRUSxDQUFhO0FBQUEsRUFDM0Q7QUFDQSxTQUFPUjtBQUNSLEdBQ0lXLEtBQWEsQ0FBQ0MsTUFBUUEsS0FBTyxRQUFRLE9BQU9BLEVBQUksUUFBUyxZQUN6REMsS0FBYyxDQUFDYixHQUFRYyxNQUN0QnBDLEVBQVlzQixDQUFNLEtBQUssT0FBT0EsS0FBVSxhQUFtQmMsSUFBS2QsQ0FBTSxJQUN0RVcsR0FBV1gsQ0FBTSxJQUFVQSxFQUFPLEtBQUtjLENBQUUsSUFDekNkLEdBQVEsV0FBV1csR0FBV1gsRUFBTyxPQUFPLElBQVVBLEVBQU8sUUFBUSxLQUFLYyxDQUFFLElBQ3pFQSxJQUFLZCxDQUFNLEdBRWZlLEtBQTZCLG9CQUFJLFFBQVEsR0FDekNDLEtBQWtCLElBQUkscUJBQXFCLENBQUNDLE1BQWM7QUFDN0QsRUFBQUEsR0FBVyxVQUFVLENBQUNILE1BQU9BLElBQUssQ0FBQztBQUNwQyxDQUFDO0FBQ0QsU0FBU0ksRUFBZUMsR0FBS0MsR0FBV0MsR0FBVTtBQUNqRCxNQUFJLEdBQUNBLEtBQVksT0FBT0EsS0FBWSxjQUFjLE9BQU9GLEtBQU8sWUFBWSxPQUFPQSxLQUFPO0FBQzFGLFFBQUlDLEtBQWEsT0FBTyxTQUFTO0FBQ2hDLFlBQU1FLElBQWNILElBQU1qQyxDQUFZLEtBQUtpQztBQUMzQyxNQUFBSixJQUFZLHNCQUFzQk8sR0FBYSxNQUFNO0FBQ3BELGNBQU1DLElBQTRCLG9CQUFJLElBQUk7QUFDMUMsZ0JBQUksT0FBT0QsS0FBZSxZQUFZLE9BQU9BLEtBQWUsZ0JBQzNETixHQUFnQixTQUFTTSxHQUFhQyxDQUFTLEdBQy9DUixHQUFXLElBQUlPLEdBQWFDLENBQVMsR0FDckNELEVBQVksT0FBTyxPQUFPLE1BQU0sTUFBTUMsRUFBVSxRQUFRLENBQUNULE1BQU87QUFDL0QsVUFBQUEsSUFBSztBQUFBLFFBQ04sQ0FBQyxJQUVLUztBQUFBLE1BQ1IsQ0FBQyxHQUFHLE1BQU1GLENBQVE7QUFBQSxJQUNuQixNQUFPLENBQUFGLEVBQUlDLENBQVMsSUFBSSxZQUFZSSxHQUFNO0FBQ3pDLFlBQU1mLElBQVdVLElBQU1DLENBQVM7QUFDaEMsTUFBSSxPQUFPWCxLQUFZLGNBQVlBLEVBQVMsTUFBTSxNQUFNZSxDQUFJLEdBQzVESCxFQUFTLE1BQU0sTUFBTUcsQ0FBSTtBQUFBLElBQzFCO0FBQ0Q7QUFDQSxJQUFJQyxJQUFlLENBQUNDLE1BQVM7QUFFNUIsTUFESSxPQUFPQSxLQUFTLFlBQ2hCQSxNQUFTLEdBQUksUUFBTztBQUN4QixRQUFNQyxJQUFNLE9BQU9ELENBQUk7QUFDdkIsU0FBTyxPQUFPLFVBQVVDLENBQUcsS0FBS0EsS0FBTyxLQUFLLE9BQU9BLENBQUcsTUFBTUQ7QUFDN0Q7QUFDQSxTQUFTRSxHQUFlQyxJQUFTLENBQUMsR0FBR0MsSUFBVSxDQUFDLEdBQUc7QUFDbEQsTUFBSUMsSUFBNkIsb0JBQUksSUFBSTtBQUN6QyxRQUFNQyxJQUFrQixDQUFDQyxHQUFPQyxHQUFLQyxNQUFVO0FBQzlDLElBQUFMLEVBQVEsY0FBYztBQUFBLE1BQ3JCLE9BQUFHO0FBQUEsTUFDQSxLQUFBQztBQUFBLE1BQ0EsT0FBQUM7QUFBQSxJQUNELENBQUM7QUFBQSxFQUNGO0FBQ0EsTUFBSU4sYUFBa0IsSUFBSyxDQUFBRSxJQUFhRjtBQUFBLE1BQ25DLFlBQVdPLEtBQVFQLEdBQVE7QUFDL0IsUUFBSUUsRUFBVyxJQUFJSyxDQUFJLEdBQUc7QUFDekIsTUFBQUosRUFBZ0JJLEdBQU0sTUFBTTtBQUM1QjtBQUFBLElBQ0Q7QUFDQSxJQUFBTCxFQUFXLElBQUlLLENBQUk7QUFBQSxFQUNwQjtBQUNBLFFBQU1DLElBQVcsTUFBTSxNQUFNLEtBQUtOLENBQVUsR0FDdENPLElBQWMsQ0FBQ2hDLE1BQVE7QUFDNUIsSUFBQXlCLEVBQVcsTUFBTTtBQUNqQixlQUFXSyxLQUFROUIsRUFBSyxDQUFBeUIsRUFBVyxJQUFJSyxDQUFJO0FBQUEsRUFDNUMsR0FDTUcsSUFBVTtBQUFBLElBQ2YsTUFBTSxJQUFJQyxNQUFVO0FBQ25CLFVBQUlDLElBQU9WLEVBQVc7QUFDdEIsaUJBQVdLLEtBQVFJLEdBQU87QUFDekIsWUFBSVQsRUFBVyxJQUFJSyxDQUFJLEdBQUc7QUFDekIsVUFBQUosRUFBZ0JJLEdBQU0sTUFBTTtBQUM1QjtBQUFBLFFBQ0Q7QUFDQSxRQUFBTCxFQUFXLElBQUlLLENBQUksR0FDbkJLO0FBQUEsTUFDRDtBQUNBLGFBQU9BO0FBQUEsSUFDUjtBQUFBLElBQ0EsS0FBSyxNQUFNO0FBQ1YsWUFBTW5DLElBQU0rQixFQUFTO0FBQ3JCLFVBQUksQ0FBQy9CLEVBQUksT0FBUTtBQUNqQixZQUFNMkIsSUFBUTNCLEVBQUlBLEVBQUksU0FBUyxDQUFDO0FBQ2hDLGFBQUF5QixFQUFXLE9BQU9FLENBQUssR0FDaEJBO0FBQUEsSUFDUjtBQUFBLElBQ0EsT0FBTyxNQUFNO0FBQ1osWUFBTVMsSUFBV1gsRUFBVyxPQUFPLEVBQUUsS0FBSztBQUMxQyxVQUFJVyxFQUFTLEtBQU07QUFDbkIsWUFBTVQsSUFBUVMsRUFBUztBQUN2QixhQUFBWCxFQUFXLE9BQU9FLENBQUssR0FDaEJBO0FBQUEsSUFDUjtBQUFBLElBQ0EsU0FBUyxJQUFJTyxNQUFVO0FBQ3RCLFVBQUksQ0FBQ0EsRUFBTSxPQUFRLFFBQU9ULEVBQVc7QUFDckMsWUFBTVksSUFBVU4sRUFBUyxHQUNuQk8sSUFBWSxDQUFDO0FBQ25CLGlCQUFXUixLQUFRSSxHQUFPO0FBQ3pCLFlBQUlHLEVBQVEsU0FBU1AsQ0FBSSxLQUFLUSxFQUFVLFNBQVNSLENBQUksR0FBRztBQUN2RCxVQUFBSixFQUFnQkksR0FBTSxXQUFXLENBQUM7QUFDbEM7QUFBQSxRQUNEO0FBQ0EsUUFBQVEsRUFBVSxLQUFLUixDQUFJO0FBQUEsTUFDcEI7QUFDQSxVQUFJLENBQUNRLEVBQVUsT0FBUSxRQUFPRCxFQUFRO0FBQ3RDLFlBQU1FLElBQU8sQ0FBQyxHQUFHRCxHQUFXLEdBQUdELENBQU87QUFDdEMsYUFBQUwsRUFBWU8sQ0FBSSxHQUNUQSxFQUFLO0FBQUEsSUFDYjtBQUFBLElBQ0EsUUFBUSxDQUFDQyxHQUFPQyxNQUFnQlAsTUFBVTtBQUN6QyxZQUFNbEMsSUFBTStCLEVBQVMsR0FDZlcsSUFBa0IsS0FBSyxJQUFJLEtBQUssSUFBSUYsR0FBTyxDQUFDLEdBQUd4QyxFQUFJLE1BQU0sR0FDekQyQyxJQUFvQkYsTUFBZ0IsU0FBU3pDLEVBQUksU0FBUzBDLElBQWtCLEtBQUssSUFBSSxHQUFHLEtBQUssSUFBSUQsR0FBYXpDLEVBQUksU0FBUzBDLENBQWUsQ0FBQyxHQUMzSUUsSUFBVTVDLEVBQUksT0FBTzBDLEdBQWlCQyxDQUFpQjtBQUM3RCxVQUFJRSxJQUFpQkg7QUFDckIsaUJBQVdaLEtBQVFJLEdBQU87QUFDekIsWUFBSWxDLEVBQUksU0FBUzhCLENBQUksR0FBRztBQUN2QixVQUFBSixFQUFnQkksR0FBTSxVQUFVZSxDQUFjO0FBQzlDO0FBQUEsUUFDRDtBQUNBLFFBQUE3QyxFQUFJLE9BQU82QyxLQUFrQixHQUFHZixDQUFJO0FBQUEsTUFDckM7QUFDQSxhQUFBRSxFQUFZaEMsQ0FBRyxHQUNSNEM7QUFBQSxJQUNSO0FBQUEsSUFDQSxVQUFVLENBQUNqQixNQUFVRixFQUFXLElBQUlFLENBQUs7QUFBQSxJQUN6QyxTQUFTLENBQUNBLE1BQVVJLEVBQVMsRUFBRSxRQUFRSixDQUFLO0FBQUEsSUFDNUMsT0FBTyxNQUFNO0FBQ1osTUFBQUYsRUFBVyxNQUFNO0FBQUEsSUFDbEI7QUFBQSxJQUNBLFFBQVEsQ0FBQ0UsTUFBVUYsRUFBVyxPQUFPRSxDQUFLO0FBQUEsSUFDMUMsU0FBUyxNQUFNSSxFQUFTO0FBQUEsSUFDeEIsT0FBTyxNQUFNLElBQUksSUFBSU4sQ0FBVTtBQUFBLElBQy9CLENBQUMsT0FBTyxRQUFRLEdBQUcsTUFBTUEsRUFBVyxPQUFPLFFBQVEsRUFBRTtBQUFBLEVBQ3REO0FBQ0EsU0FBTyxJQUFJLE1BQU1RLEdBQVM7QUFBQSxJQUN6QixLQUFLLENBQUNhLEdBQUcxQixNQUFTO0FBQ2pCLFVBQUlBLE1BQVMsU0FBVSxRQUFPSyxFQUFXO0FBQ3pDLFVBQUlOLEVBQWFDLENBQUksRUFBRyxRQUFPVyxFQUFTLEVBQUUsT0FBT1gsQ0FBSSxDQUFDO0FBQ3RELFlBQU1PLElBQVFNLEVBQVFiLENBQUk7QUFDMUIsYUFBd0NPO0FBQUEsSUFFekM7QUFBQSxJQUNBLEtBQUssQ0FBQ21CLEdBQUcxQixHQUFNTyxNQUFVO0FBQ3hCLFVBQUlQLE1BQVMsVUFBVTtBQUN0QixZQUFJLE9BQU9PLEtBQVUsWUFBWSxDQUFDLE9BQU8sU0FBU0EsQ0FBSyxLQUFLQSxJQUFRLEVBQUcsT0FBTSxJQUFJLFdBQVcsNkNBQTZDO0FBQ3pJLGNBQU1vQixJQUFhLEtBQUssTUFBTXBCLENBQUs7QUFDbkMsWUFBSW9CLEtBQWN0QixFQUFXLEtBQU0sUUFBTztBQUMxQyxjQUFNekIsSUFBTStCLEVBQVMsRUFBRSxNQUFNLEdBQUdnQixDQUFVO0FBQzFDLGVBQUFmLEVBQVloQyxDQUFHLEdBQ1I7QUFBQSxNQUNSO0FBQ0EsVUFBSW1CLEVBQWFDLENBQUksR0FBRztBQUN2QixjQUFNcEIsSUFBTStCLEVBQVMsR0FDZkYsSUFBUSxPQUFPVCxDQUFJO0FBQ3pCLFlBQUlTLElBQVE3QixFQUFJLE9BQVEsUUFBTztBQUMvQixjQUFNZ0QsSUFBWXJCO0FBQ2xCLFlBQUlFLElBQVE3QixFQUFJLFFBQVE7QUFDdkIsZ0JBQU1pRCxJQUFlakQsRUFBSTZCLENBQUs7QUFDOUIsY0FBSSxPQUFPLEdBQUdvQixHQUFjRCxDQUFTLEVBQUcsUUFBTztBQUMvQyxjQUFJaEQsRUFBSSxLQUFLLENBQUM4QixHQUFNb0IsTUFBUUEsTUFBUXJCLEtBQVMsT0FBTyxHQUFHQyxHQUFNa0IsQ0FBUyxDQUFDO0FBQ3RFLG1CQUFBdEIsRUFBZ0JzQixHQUFXLE9BQU9uQixDQUFLLEdBQ2hDO0FBRVIsVUFBQTdCLEVBQUk2QixDQUFLLElBQUltQjtBQUFBLFFBQ2QsT0FBTztBQUNOLGNBQUloRCxFQUFJLFNBQVNnRCxDQUFTO0FBQ3pCLG1CQUFBdEIsRUFBZ0JzQixHQUFXLE9BQU9uQixDQUFLLEdBQ2hDO0FBRVIsVUFBQTdCLEVBQUksS0FBS2dELENBQVM7QUFBQSxRQUNuQjtBQUNBLGVBQUFoQixFQUFZaEMsQ0FBRyxHQUNSO0FBQUEsTUFDUjtBQUNBLGFBQU8sUUFBUSxJQUFJaUMsR0FBU2IsR0FBTU8sQ0FBSztBQUFBLElBQ3hDO0FBQUEsSUFDQSxnQkFBZ0IsQ0FBQ21CLEdBQUcxQixNQUFTO0FBQzVCLFVBQUlBLE1BQVMsU0FBVSxRQUFPO0FBQzlCLFVBQUlELEVBQWFDLENBQUksR0FBRztBQUN2QixjQUFNcEIsSUFBTStCLEVBQVMsR0FDZkYsSUFBUSxPQUFPVCxDQUFJO0FBQ3pCLGVBQUlTLEtBQVM3QixFQUFJLFdBQ2pCQSxFQUFJLE9BQU82QixHQUFPLENBQUMsR0FDbkJHLEVBQVloQyxDQUFHLElBQ1I7QUFBQSxNQUNSO0FBQ0EsYUFBTyxRQUFRLGVBQWVpQyxHQUFTYixDQUFJO0FBQUEsSUFDNUM7QUFBQSxJQUNBLFNBQVMsTUFBTTtBQUNkLFlBQU0rQixJQUFPLENBQUM7QUFDZCxVQUFJQyxJQUFJO0FBQ1IsaUJBQVdOLEtBQUtyQixFQUFZLENBQUEwQixFQUFLLEtBQUssT0FBT0MsR0FBRyxDQUFDO0FBQ2pELGFBQUFELEVBQUssS0FBSyxRQUFRLEdBQ1hBO0FBQUEsSUFDUjtBQUFBLElBQ0EsMEJBQTBCLENBQUNMLEdBQUcxQixNQUFTO0FBQ3RDLFVBQUlBLE1BQVMsU0FBVSxRQUFPO0FBQUEsUUFDN0IsY0FBYztBQUFBLFFBQ2QsWUFBWTtBQUFBLFFBQ1osVUFBVTtBQUFBLFFBQ1YsT0FBT0ssRUFBVztBQUFBLE1BQ25CO0FBQ0EsVUFBSU4sRUFBYUMsQ0FBSSxHQUFHO0FBQ3ZCLGNBQU1wQixJQUFNK0IsRUFBUyxHQUNmRixJQUFRLE9BQU9ULENBQUk7QUFDekIsZUFBSVMsS0FBUzdCLEVBQUksU0FBUSxTQUNsQjtBQUFBLFVBQ04sY0FBYztBQUFBLFVBQ2QsWUFBWTtBQUFBLFVBQ1osVUFBVTtBQUFBLFVBQ1YsT0FBT0EsRUFBSTZCLENBQUs7QUFBQSxRQUNqQjtBQUFBLE1BQ0Q7QUFDQSxhQUFPLFFBQVEseUJBQXlCSSxHQUFTYixDQUFJO0FBQUEsSUFDdEQ7QUFBQSxJQUNBLEtBQUssQ0FBQzBCLEdBQUcxQixNQUFTO0FBQ2pCLFVBQUlBLE1BQVMsU0FBVSxRQUFPO0FBQzlCLFVBQUlELEVBQWFDLENBQUksR0FBRztBQUN2QixjQUFNUyxJQUFRLE9BQU9ULENBQUk7QUFDekIsZUFBT1MsS0FBUyxLQUFLQSxJQUFRSixFQUFXO0FBQUEsTUFDekM7QUFDQSxhQUFPTCxLQUFRYTtBQUFBLElBQ2hCO0FBQUEsRUFDRCxDQUFDO0FBQ0Y7QUFJQSxJQUFJb0IsS0FBc0IsTUFBTTtBQUFBLEVBQy9CLGNBQWM7QUFBQSxFQUFDO0FBQUEsRUFDZixlQUFlM0QsR0FBUTRELEdBQU07QUFDNUIsV0FBTyxRQUFRLGVBQWU1RCxHQUFRNEQsQ0FBSTtBQUFBLEVBQzNDO0FBQUEsRUFDQSxVQUFVNUQsR0FBUXdCLEdBQU1xQyxHQUFNO0FBQzdCLFdBQU8sUUFBUSxVQUFVN0QsR0FBUXdCLEdBQU1xQyxDQUFJO0FBQUEsRUFDNUM7QUFBQSxFQUNBLE1BQU03RCxHQUFROEQsR0FBS3RDLEdBQU07QUFDeEIsV0FBTyxRQUFRLE1BQU14QixHQUFROEQsR0FBS3RDLENBQUk7QUFBQSxFQUN2QztBQUFBLEVBQ0EsSUFBSXhCLEdBQVEwQixHQUFNO0FBQ2pCLFdBQU8sUUFBUSxJQUFJMUIsR0FBUTBCLENBQUk7QUFBQSxFQUNoQztBQUFBLEVBQ0EsSUFBSTFCLEdBQVE0RCxHQUFNM0IsR0FBTztBQUN4QixXQUFBckQsR0FBYW9CLEdBQVFpQyxHQUFPMkIsQ0FBSSxHQUN6QjtBQUFBLEVBQ1I7QUFBQSxFQUNBLElBQUk1RCxHQUFRNEQsR0FBTUUsR0FBSztBQUN0QixXQUFJLE9BQU9GLEtBQVEsV0FBaUI1RCxJQUFTNEQsQ0FBSSxLQUFLNUQsSUFDL0MsUUFBUSxJQUFJQSxHQUFRNEQsR0FBTUUsQ0FBRztBQUFBLEVBQ3JDO0FBQ0QsR0FDSUMsS0FBdUIsQ0FBQzVDLE1BQVE7QUFDbkMsTUFBSUEsSUFBTWhDLENBQWEsS0FBS1csR0FBa0IsSUFBSXFCLENBQUcsRUFBRyxRQUFPQTtBQUMvRCxRQUFNNkMsSUFBSyxJQUFJLE1BQU03QyxHQUFLLElBQUl3QyxHQUFvQixDQUFDO0FBQ25ELFNBQUE3RCxHQUFrQixJQUFJa0UsR0FBSTdDLENBQUcsR0FDdEI2QztBQUNSLEdBSUlDLEtBQWtCLHVCQUFPLElBQUkscUJBQXFCO0FBQ3RELFdBQVdBLEVBQWUsTUFBc0Isb0JBQUksUUFBUTtBQUM1RCxJQUFJQyxLQUFZLFdBQVdELEVBQWUsR0FDdENFLEtBQW9CLENBQUNDLEdBQVlDLEdBQU1DLE1BQ25DSixHQUFVLFlBQVlFLEdBQVksTUFBTTtBQUM5QyxRQUFNRyxJQUFXRixHQUFNLFFBQVE7QUFDL0IsRUFBQUUsR0FBVSxXQUFXRCxDQUFPO0FBQzVCLFFBQU1FLElBQWNKLEdBQVksVUFBVSxPQUFPQSxDQUFVLEdBQ3JESyxJQUFhLE1BQU07QUFDeEIsVUFBTUMsSUFBSUYsSUFBYztBQUN4QixXQUFBRCxHQUFVLGFBQWFELENBQU8sR0FDdkJJO0FBQUEsRUFDUjtBQUNBLFNBQUFOLEVBQVcsV0FBV0ssR0FDZjtBQUFBLElBQ04sWUFBQUE7QUFBQSxJQUNBLENBQUMsT0FBTyxPQUFPLEdBQUdBO0FBQUEsSUFDbEIsQ0FBQyxPQUFPLFlBQVksR0FBR0E7QUFBQSxFQUN4QjtBQUNELENBQUMsR0FFRUUsS0FBMEIsdUJBQU8sSUFBSSw2QkFBNkI7QUFDdEUsV0FBV0EsRUFBdUIsTUFBc0Isb0JBQUksUUFBUTtBQUNwRSxJQUFJQyxJQUFvQixXQUFXRCxFQUF1QixNQUFzQixvQkFBSSxRQUFRLEdBQ3hGRSxLQUE4Qix1QkFBTyxJQUFJLGlDQUFpQztBQUM5RSxXQUFXQSxFQUEyQixNQUFzQixvQkFBSSxJQUFJO0FBQ3BFLElBQUlDLEtBQXdCLFdBQVdELEVBQTJCLEdBQzlERSxLQUFpQixDQUFDakUsR0FBSWdCLElBQVUsQ0FBQyxHQUFHLE1BQU07QUFDN0MsTUFBSWhCLEtBQU0sUUFBUSxPQUFPQSxLQUFNLFdBQVk7QUFDM0MsUUFBTWtFLElBQWFDLEdBQXVCbkQsQ0FBTztBQUNqRCxTQUFBZ0QsR0FBc0IsSUFBSWhFLEdBQUlrRSxFQUFXLFdBQVcsR0FDN0MsTUFBTUYsR0FBc0IsT0FBT2hFLENBQUU7QUFDN0MsR0FDSW9FLEtBQWdCLHVCQUFPLElBQUksbUJBQW1CO0FBQ2xELFdBQVdBLEVBQWEsTUFBc0Isb0JBQUksUUFBUTtBQUMxRCxJQUFJQyxLQUFVLFdBQVdELEVBQWEsR0FDbENFLEtBQVcsQ0FBQ0MsR0FBTUMsTUFBVztBQUNoQyxRQUFNckYsSUFBU29GLElBQU9uRyxDQUFZLEtBQUttRztBQUN2QyxNQUFJZCxJQUFXSyxFQUFrQixJQUFJM0UsQ0FBTTtBQUMzQyxTQUFLc0UsSUFHRUEsRUFBUyxXQUFXdEUsQ0FBTSxLQUZoQ3NFLElBQVcsSUFBSWdCLEdBQVV0RixDQUFNLEdBQy9CMkUsRUFBa0IsSUFBSTNFLEdBQVFzRSxDQUFRLElBRWhDZTtBQUNSLEdBQ0lFLEtBQVcsQ0FBQ0gsR0FBTUMsT0FDckJELElBQU85RSxFQUFNOEUsSUFBT25HLENBQVksS0FBS21HLENBQUksR0FDckMsT0FBT0EsS0FBUSxZQUFZLEVBQUUsT0FBT0EsS0FBUSxZQUFZLE9BQU9BLEtBQVEsZUFBZUEsS0FBUSxPQUFhQSxJQUN4R0YsR0FBUSxvQkFBb0JFLEdBQU0sTUFBTSxJQUFJLE1BQU1BLEdBQU1ELEdBQVNDLEdBQU1DLENBQU0sQ0FBQyxDQUFDLElBRW5GRyxJQUFTLHVCQUFPLElBQUksV0FBVyxHQUMvQkMsS0FBbUMsb0JBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQ3ZEQyxLQUFpQyxvQkFBSSxJQUFJO0FBQUEsRUFDNUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxNQUFNLENBQUM7QUFBQSxFQUMxQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNoQixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7QUFBQSxFQUN0QixDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUM7QUFBQSxFQUM5QixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7QUFBQSxFQUN0QixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7QUFBQSxFQUN0QixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7QUFBQSxFQUN0QixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7QUFBQSxFQUN0QixDQUFDLGFBQWEsQ0FBQyxjQUFjLFFBQVEsQ0FBQztBQUN2QyxDQUFDLEdBQ0dDLEtBQThCLHVCQUFPLElBQUksaUNBQWlDO0FBQzlFLFdBQVdBLEVBQTJCLE1BQU0sSUFBSSxJQUFJLE1BQU0sS0FBS0QsR0FBZSxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQ0UsR0FBV0MsQ0FBTyxNQUFNQSxFQUFRLElBQUksQ0FBQ0MsTUFBVSxDQUFDQSxHQUFPRixDQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ3RLLElBQUlHLEtBQXdCLFdBQVdKLEVBQTJCLEdBQzlESyxLQUF1QixDQUFDQyxJQUFVLFVBQVU7QUFDL0MsTUFBSUEsS0FBVyxLQUFNLFFBQU9BO0FBQzVCLFFBQU10QyxJQUFPLE9BQU9zQyxLQUFXLEtBQUs7QUFDcEMsU0FBT0YsR0FBc0IsSUFBSXBDLENBQUksS0FBS0E7QUFDM0MsR0FDSXVDLEtBQWlCLENBQUNELE1BQVk7QUFDakMsUUFBTXRDLElBQU9zQyxLQUFXLE9BQU8sUUFBUSxPQUFPRCxHQUFxQkMsQ0FBTyxLQUFLLEtBQUs7QUFDcEYsU0FBTyxDQUFDdEMsR0FBTSxHQUFHK0IsR0FBZSxJQUFJL0IsQ0FBSSxLQUFLLENBQUMsQ0FBQztBQUNoRCxHQUNJd0MsS0FBc0IsQ0FBQ0MsSUFBUSxDQUFDLEdBQUcsTUFDL0IsSUFBSSxJQUFJLENBQUMsR0FBR0MsRUFBdUJELENBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQ3pDLE1BQVMsQ0FBQ0EsR0FBTSxHQUFHK0IsR0FBZSxJQUFJL0IsQ0FBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FFM0cwQyxJQUF5QixDQUFDQyxJQUFXLENBQUMsR0FBRyxNQUFNO0FBQ2xELFFBQU1DLElBQU8sT0FBT0QsS0FBWSxXQUFXLENBQUNBLENBQVEsSUFBSSxNQUFNLEtBQUtBLEtBQVksQ0FBQyxHQUFHLENBQUMsR0FDOUV2QixJQUFhLElBQUksSUFBSXdCLEVBQUssSUFBSSxDQUFDcEUsTUFBUztBQUM3QyxVQUFNd0IsSUFBTyxPQUFPeEIsS0FBUSxHQUFHO0FBQy9CLFdBQU9zRCxHQUFpQixJQUFJOUIsQ0FBSSxJQUFJQSxJQUFPLE9BQU9xQyxHQUFxQnJDLENBQUksS0FBS0EsQ0FBSTtBQUFBLEVBQ3JGLENBQUMsQ0FBQztBQUNGLFNBQU9vQixFQUFXLE9BQU9BLElBQTZCLG9CQUFJLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDcEUsR0FDSXlCLElBQXNCLENBQUNGLEdBQVVMLE1BQVk7QUFDaEQsUUFBTVEsSUFBU0gsYUFBb0IsTUFBTUEsSUFBV0QsRUFBdUJDLENBQVE7QUFDbkYsU0FBTyxDQUFDLEdBQUdiLEVBQWdCLEVBQUUsS0FBSyxDQUFDOUIsTUFBUzhDLEVBQU8sSUFBSTlDLENBQUksQ0FBQyxLQUFLdUMsR0FBZUQsQ0FBTyxFQUFFLEtBQUssQ0FBQ3RDLE1BQVM4QyxFQUFPLElBQUk5QyxDQUFJLENBQUM7QUFDekgsR0FDSStDLEtBQWtCLENBQUM3RSxNQUNmLENBQUMsQ0FBQ0EsS0FBVyxPQUFPQSxLQUFXLFlBQVksQ0FBQyxNQUFNLFFBQVFBLENBQU8sTUFBTSxpQkFBaUJBLEtBQVcsY0FBY0EsS0FBVyx3QkFBd0JBLElBRXhKOEUsS0FBMkIsQ0FBQzlFLElBQVUsQ0FBQyxHQUFHLE1BQU07QUFDbkQsTUFBSTZFLEdBQWdCN0UsQ0FBTyxFQUFHLFFBQU87QUFBQSxJQUNwQyxhQUFhd0UsRUFBdUJ4RSxFQUFRLGVBQWVBLEVBQVEsWUFBWSxDQUFDLEdBQUcsQ0FBQztBQUFBLElBQ3BGLG9CQUFvQkEsRUFBUSx1QkFBdUI7QUFBQSxFQUNwRDtBQUNBLFFBQU0rRSxJQUFjUCxFQUF1QnhFLENBQU87QUFDbEQsU0FBTztBQUFBLElBQ04sYUFBQStFO0FBQUEsSUFDQSxvQkFBb0JKLEVBQW9CSSxHQUFhLFNBQVM7QUFBQSxFQUMvRDtBQUNELEdBQ0k1QixLQUF5QixDQUFDbkQsSUFBVSxDQUFDLEdBQUcsTUFDdkM2RSxHQUFnQjdFLENBQU8sSUFBVTtBQUFBLEVBQ3BDLGFBQWF3RSxFQUF1QnhFLEVBQVEsZUFBZUEsRUFBUSxZQUFZLENBQUMsR0FBRyxDQUFDO0FBQUEsRUFDcEYsb0JBQW9CQSxFQUFRLHVCQUF1QjtBQUNwRCxJQUNPO0FBQUEsRUFDTixhQUFhd0UsRUFBdUJ4RSxDQUFPO0FBQUEsRUFDM0Msb0JBQW9CO0FBQ3JCLEdBRUdnRixLQUFrQix1QkFBTyxJQUFJLHFCQUFxQjtBQUN0RCxXQUFXQSxFQUFlLE1BQU0sTUFBZ0I7QUFBQSxFQUMvQztBQUFBLEVBQ0FDO0FBQUEsRUFDQUM7QUFBQSxFQUNBQyxLQUF5QixvQkFBSSxRQUFRO0FBQUEsRUFDckNDO0FBQUEsRUFDQUM7QUFBQSxFQUNBQyxLQUE4QixvQkFBSSxJQUFJO0FBQUEsRUFDdENDLEtBQW9DLG9CQUFJLElBQUk7QUFBQSxFQUM1Q0M7QUFBQSxFQUNBQyxLQUEyQixvQkFBSSxJQUFJO0FBQUEsRUFDbkNDLEtBQWlDLG9CQUFJLElBQUk7QUFBQSxFQUN6Q0MsS0FBa0I7QUFBQSxFQUNsQixZQUFZNUYsR0FBUTtBQUNuQixTQUFLa0YsS0FBVWxGLEdBQ2YsS0FBS21GLEtBQTZCLG9CQUFJLElBQUksR0FDMUMsS0FBS0MsS0FBeUIsb0JBQUksUUFBUSxHQUMxQyxLQUFLSyxLQUFrQjtBQUFBLE1BQ3RCLFFBQVEsQ0FBQ2pCLElBQVEsQ0FBQyxHQUFHLEdBQUd2RixNQUFPQSxJQUFLLEtBQUssYUFBYXVGLEdBQU8sSUFBTXZGLENBQUUsSUFBSSxLQUFLLG1CQUFtQnVGLEdBQU8sRUFBSTtBQUFBLE1BQzVHLFNBQVMsQ0FBQ0EsSUFBUSxDQUFDLEdBQUcsR0FBR3ZGLE1BQU9BLElBQUssS0FBSyxhQUFhdUYsR0FBTyxJQUFPdkYsQ0FBRSxJQUFJLEtBQUssbUJBQW1CdUYsR0FBTyxFQUFLO0FBQUEsTUFDL0csS0FBSyxDQUFDQSxHQUFPcUIsTUFBWSxLQUFLLG1CQUFtQnJCLEdBQU9xQixDQUFPO0FBQUEsTUFDL0QsTUFBTSxDQUFDckIsR0FBT3ZGLE1BQU8sS0FBSyxhQUFhdUYsR0FBTyxJQUFNdkYsQ0FBRTtBQUFBLE1BQ3RELFNBQVMsQ0FBQ3VGLEdBQU92RixNQUFPLEtBQUssYUFBYXVGLEdBQU8sSUFBT3ZGLENBQUU7QUFBQSxNQUMxRCxXQUFXLENBQUNvRixNQUFZLEtBQUssaUJBQWlCQSxDQUFPO0FBQUEsSUFDdEQsR0FDQSxLQUFLaUIsS0FBWSxFQUFFLE1BQU0sQ0FBQzNGLE1BQVM7QUFDbEMsTUFBSUEsTUFBTSxNQUFNLFFBQVFBLENBQUksSUFBSSxLQUFLbUcsR0FBVSxHQUFHbkcsQ0FBSSxJQUFJLEtBQUttRyxHQUFVbkcsQ0FBSTtBQUFBLElBQzlFLEVBQUU7QUFDRixVQUFNNkMsSUFBTyxJQUFJLFFBQVEsSUFBSSxHQUN2QnVELElBQWEsU0FBU3hELEdBQVk7QUFDdkMsWUFBTUUsSUFBVUYsR0FBWSxNQUFNLE9BQU9BLENBQVU7QUFDbkQsYUFBT0QsR0FBa0JDLEdBQVlDLEdBQU1DLENBQU87QUFBQSxJQUNuRDtBQUNBLFNBQUs0QyxLQUFVLE9BQU8sYUFBYyxNQUFjLElBQUksV0FBV1UsQ0FBVSxJQUFJLE1BQy9FLEtBQUssYUFBYSxNQUFNLEtBQUtWO0FBQUEsRUFDOUI7QUFBQSxFQUNBLFdBQVdyRixHQUFRO0FBQ2xCLGdCQUFLa0YsT0FBWWxGLEdBQ1Y7QUFBQSxFQUNSO0FBQUEsRUFDQSxVQUFVZixNQUFPVSxHQUFNO0FBQ3RCLFFBQUksR0FBQ1YsS0FBTSxLQUFLbUcsR0FBTyxJQUFJbkcsQ0FBRSxJQUM3QjtBQUFBLFdBQUttRyxHQUFPLElBQUluRyxDQUFFO0FBQ2xCLFVBQUk7QUFDSCxjQUFNK0csSUFBTS9HLEVBQUcsR0FBR1UsQ0FBSTtBQUN0QixZQUFJcUcsS0FBTyxPQUFPQSxFQUFJLFFBQVMsWUFBWTtBQUMxQyxVQUFBQSxFQUFJLE1BQU0sUUFBUSxJQUFJO0FBQ3RCO0FBQUEsUUFDRDtBQUNBLGVBQU9BO0FBQUEsTUFDUixTQUFTMUgsR0FBRztBQUNYLGdCQUFRLEtBQUtBLENBQUM7QUFBQSxNQUNmLFVBQUU7QUFDRCxhQUFLOEcsR0FBTyxPQUFPbkcsQ0FBRTtBQUFBLE1BQ3RCO0FBQUE7QUFBQSxFQUNEO0FBQUEsRUFDQTZHLEdBQVUvRCxHQUFNM0IsSUFBUSxNQUFNNkYsR0FBVTVCLElBQVUsVUFBVTZCLEdBQUs7QUFDaEUsSUFBQTdCLElBQVVELEdBQXFCQyxDQUFPLEtBQUtBO0FBQzNDLFVBQU04QixJQUFZLEtBQUtoQjtBQUN2QixRQUFJZ0IsR0FBVztBQUNkLGlCQUFXLENBQUNsSCxHQUFJbUgsQ0FBTSxLQUFLRCxFQUFVLFFBQVEsRUFBRyxFQUFLQyxFQUFPLFNBQVNyRSxLQUFRcUUsRUFBTyxTQUFTeEMsS0FBVXdDLEVBQU8sU0FBUyxTQUFTeEIsRUFBb0J3QixFQUFPLFVBQVUvQixDQUFPLEtBQUcsS0FBSyxVQUFVcEYsR0FBSW1CLEdBQU8yQixHQUFNa0UsR0FBVTVCLEdBQVMsR0FBRzZCLENBQUc7QUFFek8sUUFBSWpELEdBQXNCLE1BQU07QUFDL0IsWUFBTW9ELElBQVE7QUFBQSxRQUNiLFFBQVEsS0FBS25CO0FBQUEsUUFDYixRQUFRLEtBQUtBO0FBQUEsUUFDYixPQUFBOUU7QUFBQSxRQUNBLE1BQU0yQjtBQUFBLFFBQ04sTUFBQUE7QUFBQSxRQUNBLFVBQUFrRTtBQUFBLFFBQ0EsU0FBQTVCO0FBQUEsUUFDQSxNQUFNNkI7QUFBQSxNQUNQO0FBQ0EsaUJBQVcsQ0FBQ2pILEdBQUl5RixDQUFRLEtBQUt6QixHQUFzQixRQUFRLEVBQUcsQ0FBSTJCLEVBQW9CRixHQUFVTCxDQUFPLEtBQUcsS0FBSyxVQUFVcEYsR0FBSW9ILENBQUs7QUFBQSxJQUNuSTtBQUFBLEVBQ0Q7QUFBQSxFQUNBLEtBQUtDLEdBQUk7QUFDUixXQUFJLE1BQU0sUUFBUUEsQ0FBRSxJQUFVM0MsR0FBUzJDLEdBQUksSUFBSSxJQUN4Q0E7QUFBQSxFQUNSO0FBQUEsRUFDQSxJQUFJLGlCQUFpQjtBQUNwQixXQUFPLEtBQUtiO0FBQUEsRUFDYjtBQUFBLEVBQ0EsaUJBQWlCcEIsR0FBUztBQUN6QixXQUFPLENBQUNPLEVBQW9CLEtBQUtZLElBQW1CLEtBQUssS0FBSyxDQUFDbEIsR0FBZUQsQ0FBTyxFQUFFLEtBQUssQ0FBQ3RDLE1BQVMsS0FBS3lELEdBQWtCLElBQUl6RCxDQUFJLENBQUM7QUFBQSxFQUN2STtBQUFBLEVBQ0EsbUJBQW1CeUMsSUFBUSxDQUFDLEdBQUcsR0FBR3FCLElBQVUsSUFBTTtBQUNqRCxVQUFNVSxJQUFRaEMsR0FBb0JDLENBQUs7QUFDdkMsZUFBV3pDLEtBQVF3RSxFQUFPLENBQUlWLElBQVMsS0FBS0wsR0FBa0IsT0FBT3pELENBQUksSUFDcEUsS0FBS3lELEdBQWtCLElBQUl6RCxDQUFJO0FBQUEsRUFDckM7QUFBQSxFQUNBLGFBQWF5QyxHQUFPcUIsR0FBUzVHLEdBQUk7QUFDaEMsVUFBTXNILElBQVEsQ0FBQyxHQUFHaEMsR0FBb0JDLENBQUssQ0FBQyxHQUN0Q2dDLElBQVcsSUFBSSxJQUFJRCxFQUFNLElBQUksQ0FBQ3hFLE1BQVMsQ0FBQ0EsR0FBTSxLQUFLeUQsR0FBa0IsSUFBSXpELENBQUksQ0FBQyxDQUFDLENBQUMsR0FDaEYwRSxJQUFVLE1BQU07QUFDckIsTUFBQUQsRUFBUyxRQUFRLENBQUNFLEdBQWEzRSxNQUFTO0FBQ3ZDLFFBQUkyRSxJQUFhLEtBQUtsQixHQUFrQixJQUFJekQsQ0FBSSxJQUMzQyxLQUFLeUQsR0FBa0IsT0FBT3pELENBQUk7QUFBQSxNQUN4QyxDQUFDO0FBQUEsSUFDRjtBQUNBLFNBQUssbUJBQW1Cd0UsR0FBT1YsQ0FBTztBQUN0QyxRQUFJO0FBQ0gsWUFBTWMsSUFBUzFILElBQUs7QUFDcEIsYUFBSTBILEtBQVUsT0FBT0EsRUFBTyxXQUFXLGFBQW1CQSxFQUFPLFFBQVFGLENBQU8sS0FDaEZBLEVBQVEsR0FDREU7QUFBQSxJQUNSLFNBQVNySSxHQUFHO0FBQ1gsWUFBQW1JLEVBQVEsR0FDRm5JO0FBQUEsSUFDUDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFNBQVNXLEdBQUlZLEdBQU1JLElBQVUsQ0FBQyxHQUFHLEdBQUc7QUFDbkMsUUFBSWhCLEtBQU0sUUFBUSxPQUFPQSxLQUFNLFdBQVk7QUFDM0MsVUFBTWtFLElBQWE0QixHQUF5QjlFLENBQU87QUFDbkQsZ0JBQUtrRixHQUFXLElBQUlsRyxHQUFJO0FBQUEsTUFDdkIsTUFBTVksS0FBUStEO0FBQUEsTUFDZCxVQUFVVCxFQUFXO0FBQUEsSUFDdEIsQ0FBQyxHQUNNLE1BQU0sS0FBSyxXQUFXbEUsR0FBSVksS0FBUStELENBQU07QUFBQSxFQUNoRDtBQUFBLEVBQ0EsV0FBVzNFLEdBQUlZLEdBQU07QUFDcEIsUUFBSVosS0FBTSxRQUFRLE9BQU9BLEtBQU0sWUFBWTtBQUMxQyxZQUFNa0gsSUFBWSxLQUFLaEIsSUFDakJpQixJQUFTRCxHQUFXLElBQUlsSCxDQUFFO0FBQ2hDLFVBQUltSCxNQUFXQSxFQUFPLFFBQVF2RyxLQUFRQSxLQUFRLFFBQVFBLEtBQVErRDtBQUM3RCxlQUFBdUMsRUFBVSxPQUFPbEgsQ0FBRSxHQUNaLE1BQU0sS0FBSyxTQUFTQSxHQUFJWSxLQUFRK0QsR0FBUXdDLEVBQU8sUUFBUTtBQUFBLElBRWhFO0FBQ0EsV0FBTyxLQUFLakIsR0FBVyxNQUFNO0FBQUEsRUFDOUI7QUFBQSxFQUNBLFFBQVFwRCxHQUFNM0IsR0FBTzZGLEdBQVU1QixJQUFVLFVBQVU2QixHQUFLO0FBSXZELFFBSEksT0FBT25FLEtBQVMsYUFDaEJzQyxNQUFZLFdBQVFBLElBQVUsUUFDbENBLElBQVVELEdBQXFCQyxDQUFPLEtBQUtBLEdBQ3ZDLENBQUMsS0FBSyxpQkFBaUJBLENBQU8sR0FBRztBQUNyQyxVQUFNdUMsSUFBUSxHQUFHdkMsS0FBVyxLQUFLO0FBQ2pDLFFBQUl3QyxJQUFPLEtBQUtsQixHQUFlLElBQUk1RCxDQUFJO0FBWXZDLElBWEs4RSxNQUNKQSxJQUF1QixvQkFBSSxJQUFJLEdBQy9CLEtBQUtsQixHQUFlLElBQUk1RCxHQUFNOEUsQ0FBSSxJQUVuQ0EsRUFBSyxJQUFJRCxHQUFPO0FBQUEsTUFDZjdFO0FBQUEsTUFDQTNCO0FBQUEsTUFDQTZGO0FBQUEsTUFDQTVCO0FBQUEsTUFDQTZCO0FBQUEsSUFDRCxDQUFDLEdBQ0csTUFBS04sT0FDVCxLQUFLQSxLQUFrQixJQUN2QixlQUFlLE1BQU07QUFDcEIsV0FBS0EsS0FBa0I7QUFDdkIsWUFBTWtCLElBQVEsS0FBS25CO0FBQ25CLFdBQUtBLEtBQWlDLG9CQUFJLElBQUk7QUFDOUMsaUJBQVcsQ0FBQzlGLEdBQU1rSCxDQUFLLEtBQUtEO0FBQzNCLFlBQUksRUFBQWpILEtBQVEsUUFBUSxLQUFLMEYsR0FBWSxJQUFJMUYsQ0FBSSxJQUM3QztBQUFBLFVBQUlBLEtBQVEsUUFBTSxLQUFLMEYsR0FBWSxJQUFJMUYsQ0FBSTtBQUMzQyxjQUFJO0FBQ0gsdUJBQVcsQ0FBQyxFQUFFRixDQUFJLEtBQUtvSCxHQUFPO0FBQzdCLG9CQUFNLENBQUNDLEdBQUlDLEdBQUdDLEdBQUlDLEdBQUlDLENBQUksSUFBSXpIO0FBQzlCLGtCQUFJO0FBQ0gscUJBQUttRyxHQUFVa0IsR0FBSUMsR0FBR0MsR0FBSUMsR0FBSSxHQUFHQyxLQUFRLENBQUMsQ0FBQztBQUFBLGNBQzVDLFNBQVM5SSxHQUFHO0FBQ1gsd0JBQVEsS0FBS0EsQ0FBQztBQUFBLGNBQ2Y7QUFBQSxZQUNEO0FBQUEsVUFDRCxVQUFFO0FBQ0QsWUFBSXVCLEtBQVEsUUFBTSxLQUFLMEYsR0FBWSxPQUFPMUYsQ0FBSTtBQUFBLFVBQy9DO0FBQUE7QUFBQSxJQUVGLENBQUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxJQUFJLFdBQVc7QUFDZCxXQUFPLEtBQUt5RjtBQUFBLEVBQ2I7QUFDRDtBQUNBLElBQUk1QixLQUFZLFdBQVd1QixFQUFlLEdBSXRDb0MsS0FBdUIsdUJBQU8sSUFBSSwwQkFBMEIsR0FDNURDLEtBQStCLG9CQUFJLElBQUk7QUFBQSxFQUMxQyxPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUCxPQUFPO0FBQUEsRUFDUDtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNELENBQUMsR0FDR0MsSUFBZ0IsQ0FBQ3BKLEdBQVE0RCxNQUFTO0FBQ3JDLE1BQUksQ0FBQ3VGLEdBQWEsSUFBSXZGLENBQUksRUFBRyxRQUFPO0FBQ3BDLFFBQU15RixJQUFNQyxFQUFRdEosR0FBUTRELENBQUk7QUFDaEMsU0FBTyxPQUFPeUYsS0FBUSxhQUFhbkwsRUFBUThCLEdBQVFxSixDQUFHLElBQUlBO0FBQzNELEdBQ0lFLElBQWlCLFdBQVdMLEVBQW9CLE1BQXNCLG9CQUFJLFFBQVE7QUFDdEYsU0FBU00sR0FBU3JJLEdBQUtzSSxHQUFVO0FBQ2hDLE1BQUlKLElBQU07QUFDVixNQUFJO0FBQ0gsSUFBQUUsR0FBZ0IsY0FBY3BJLEdBQXFCLG9CQUFJLElBQUksQ0FBQyxHQUFHLE1BQU1zSSxDQUFRLEdBQ3pFRixHQUFnQixNQUFNcEksQ0FBRyxHQUFHLE1BQU1zSSxDQUFRLE1BQUdKLElBQU0sS0FDdkRBLElBQU0sT0FBTyxRQUFRLHlCQUF5QmxJLEdBQUtzSSxDQUFRLEdBQUcsT0FBTztBQUFBLEVBQ3RFLFFBQVk7QUFDWCxJQUFBSixJQUFNO0FBQUEsRUFDUCxVQUFFO0FBQ0QsSUFBQUUsR0FBZ0IsTUFBTXBJLENBQUcsR0FBRyxTQUFTc0ksQ0FBUTtBQUFBLEVBQzlDO0FBQ0EsU0FBT0o7QUFDUjtBQUNBLElBQUlLLElBQWMsQ0FBQ3ZJLEdBQUt3SSxNQUFRO0FBQy9CLE1BQUlqTCxFQUFZeUMsQ0FBRyxFQUFHLFFBQU9BO0FBQzdCLFFBQU1jLElBQVFxSCxFQUFRbkksR0FBS3dJLENBQUc7QUFDOUIsTUFBSTFILEtBQVMsUUFBUTBILEtBQU8sU0FBUztBQUNwQyxVQUFNQyxJQUFNTixFQUFRbkksR0FBSyxPQUFPO0FBQ2hDLFdBQUl5SSxLQUFPLFFBQVEsQ0FBQ2xMLEVBQVlrTCxDQUFHLElBQVVGLEVBQVlFLEdBQUtELENBQUcsSUFDckQxSDtBQUFBLEVBQ2IsV0FBVzBILEtBQU8sV0FBVzFILEtBQVMsUUFBUSxDQUFDdkQsRUFBWXVELENBQUssS0FBSyxPQUFPQSxLQUFTLFdBQVksUUFBT3lILEVBQVl6SCxHQUFPMEgsQ0FBRyxLQUFLMUgsS0FBU2Q7QUFDNUksU0FBT2MsS0FBU2Q7QUFDakIsR0FDSTBJLEtBQVUsQ0FBQzFJLEdBQUt3SSxHQUFLMUgsTUFBVTtBQUNsQyxNQUFJZCxLQUFPLEtBQU0sUUFBTztBQUN4QixNQUFJMkksSUFBUyxnQkFBZ0IsY0FBYzNJLEdBQXFCLG9CQUFJLElBQUksQ0FBQztBQUN6RSxTQUFJMkksR0FBUSxNQUFNSCxDQUFHLElBQVUsTUFDL0JHLEdBQVEsTUFBTUgsQ0FBRyxHQUNWLFFBQVEsSUFBSXhJLEdBQUt3SSxHQUFLMUgsQ0FBSztBQUNuQyxHQUNJcUgsSUFBVSxDQUFDbkksR0FBS3dJLEdBQUtJLE1BQVE7QUFDaEMsTUFBSXZCO0FBQ0osTUFBSXJILEtBQU8sS0FBTSxRQUFPQTtBQUN4QixNQUFJMkksSUFBU1AsR0FBZ0IsY0FBY3BJLEdBQXFCLG9CQUFJLElBQUksQ0FBQztBQUN6RSxNQUFJMkksR0FBUSxNQUFNSCxDQUFHLEVBQUcsUUFBTztBQUMvQixNQUFJLENBQUNILEdBQVNySSxHQUFLd0ksQ0FBRyxFQUFHLENBQUFuQixNQUFXLFFBQVEsSUFBSXJILEdBQUt3SSxHQUFLSSxLQUFvQjVJLENBQUc7QUFBQSxPQUM1RTtBQUNKLElBQUEySSxHQUFRLE1BQU1ILENBQUc7QUFDakIsUUFBSTtBQUNILE1BQUFuQixJQUFTLFFBQVEsSUFBSXJILEdBQUt3SSxHQUFLSSxLQUFvQjVJLENBQUc7QUFBQSxJQUN2RCxRQUFhO0FBQ1osTUFBQXFILElBQVM7QUFBQSxJQUNWLFVBQUU7QUFDRCxNQUFBc0IsRUFBTyxPQUFPSCxDQUFHLEdBQ2JHLEdBQVEsU0FBUyxLQUFHUCxHQUFnQixTQUFTcEksQ0FBRztBQUFBLElBQ3JEO0FBQUEsRUFDRDtBQUNBLFNBQU8sT0FBT3FILEtBQVUsYUFBYXRLLEVBQVFpRCxHQUFLcUgsQ0FBTSxJQUFJQTtBQUM3RCxHQUNJd0IsSUFBUyxDQUFDN0ksR0FBS3dJLE1BQVEsT0FBTyxVQUFVLGVBQWUsS0FBS3hJLEdBQUt3SSxDQUFHLEdBQ3BFTSxLQUF1QixDQUFDaEksR0FBT2lJLElBQWlCLE9BQzVDLENBQUMsQ0FBQ2pJLEtBQVMsT0FBT0EsS0FBUyxZQUFZLENBQUMsTUFBTSxRQUFRQSxDQUFLLE1BQU0rSCxFQUFPL0gsR0FBTyxLQUFLLEtBQUsrSCxFQUFPL0gsR0FBTyxNQUFNLEtBQUsrSCxFQUFPL0gsR0FBTyxVQUFVLEtBQUsrSCxFQUFPL0gsR0FBTyxLQUFLLEtBQUsrSCxFQUFPL0gsR0FBTyxJQUFJLEtBQUsrSCxFQUFPL0gsR0FBTyxTQUFTLEtBQUtpSSxLQUFrQkYsRUFBTy9ILEdBQU8sT0FBTyxJQUVyUWtJLElBQXFCLENBQUNySSxHQUFTNkgsR0FBS1MsTUFDbkNKLEVBQU9sSSxHQUFTNkgsQ0FBRyxJQUFVN0gsRUFBUTZILENBQUcsSUFDeENBLEtBQU8sY0FBY0ssRUFBT2xJLEdBQVMsS0FBSyxJQUFVQSxFQUFRLE1BQ3pEc0ksRUFBUyxHQUViQyxLQUF1QixDQUFDdkksR0FBU3NJLElBQVcsYUFBYW5FLEdBQXFCbkUsRUFBUSxXQUFXQSxFQUFRLE1BQU1zSSxDQUFRLEdBQ3ZIRSxLQUFlLENBQUNYLE1BQVEsT0FBT0EsS0FBTyxZQUFZLE9BQU9BLEtBQU8sWUFBWSxPQUFPQSxLQUFPLFVBQzFGWSxLQUFlLENBQUN2SyxNQUFXO0FBQzlCLFFBQU0wQixJQUFPNEgsRUFBUXRKLEdBQVFILEVBQVMsS0FBS3lKLEVBQVF0SixHQUFRLFVBQVU7QUFDckUsU0FBT3NLLEdBQWE1SSxDQUFJLElBQUlBLElBQU87QUFDcEMsR0FDSThJLEtBQWUsQ0FBQ3hLLEdBQVEySixNQUFRQSxLQUFPLFVBQVVZLEdBQWF2SyxDQUFNLEtBQUsySixJQUFNQSxHQUMvRWMsS0FBaUIsQ0FBQ3pLLEdBQVEySixNQUFRO0FBQ3JDLFFBQU1lLElBQVdILEdBQWF2SyxDQUFNO0FBQ3BDLFNBQUkwSyxLQUFZLFFBQVFmLEtBQU9lLElBQWlCcEIsRUFBUXRKLEdBQVEsT0FBTyxLQUFLc0osRUFBUXRKLEdBQVFmLENBQU0sS0FBS3FLLEVBQVF0SixHQUFRMkosQ0FBRyxJQUNuSEEsS0FBTyxPQUFPLFNBQVNMLEVBQVF0SixHQUFRMkosQ0FBRztBQUNsRCxHQUNJZ0IsS0FBbUIsQ0FBQ3BHLEdBQVVxRyxNQUFTO0FBQzFDLFFBQU1DLElBQU0sQ0FBQ2xCLEdBQUttQixHQUFhNUUsT0FDekIrRCxHQUFxQmEsQ0FBVyxNQUFHNUUsTUFBWTRFLElBQzdDRixFQUFLWCxHQUFxQk4sQ0FBRyxJQUFJQSxJQUFNTSxHQUFxQmEsR0FBYSxFQUFJLElBQUk7QUFBQSxJQUN2RixLQUFBbkI7QUFBQSxJQUNBLFNBQUF6RDtBQUFBLElBQ0EsR0FBRzRFO0FBQUEsRUFDSixJQUFJO0FBQUEsSUFDSCxLQUFBbkI7QUFBQSxJQUNBLFNBQVN6RCxLQUFXNEU7QUFBQSxFQUNyQixDQUFDLElBRUlDLElBQVV4RyxHQUFVO0FBQzFCLFNBQUl3RyxLQUFTLE9BQU8sT0FBT0YsR0FBS0UsQ0FBTyxHQUN2Q0YsRUFBSSxTQUFTLENBQUMzRSxHQUFTeUQsR0FBSzFILEdBQU82RixNQUFhK0MsRUFBSTtBQUFBLElBQ25ELEtBQUFsQjtBQUFBLElBQ0EsU0FBQXpEO0FBQUEsSUFDQSxPQUFBakU7QUFBQSxJQUNBLFVBQUE2RjtBQUFBLEVBQ0QsQ0FBQyxHQUNNK0M7QUFDUixHQUNJRyxLQUFZLENBQUNoTCxHQUFRNEQsR0FBTVcsTUFBYTtBQUMzQyxNQUFJdkUsS0FBVSxRQUFRdEIsRUFBWXNCLENBQU0sRUFBRyxRQUFPQTtBQUNsRCxPQUFLO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQWI7QUFBQSxJQUNBRDtBQUFBLElBQ0FFO0FBQUEsRUFDRCxFQUFFLFFBQVF3RSxDQUFJLElBQUksSUFBSTBGLEVBQVF0SixHQUFRNEQsQ0FBSSxHQUFHLE9BQU81RCxDQUFNLElBQUksU0FBUyxLQUFNLFFBQU87QUFDcEYsTUFBSSxDQUFDZCxHQUFjQyxDQUFhLEVBQUUsUUFBUXlFLENBQUksS0FBSyxFQUFHLFFBQU8wRixFQUFRdEosR0FBUTRELENBQUksS0FBSzVEO0FBQ3RGLE1BQUk0RCxLQUFRM0UsRUFBUSxRQUFPcUssRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUswRixFQUFRdEosR0FBUSxPQUFPO0FBQzNFLE1BQUk0RCxLQUFReEUsR0FBZSxRQUFPbUY7QUFDbEMsTUFBSVgsS0FBUW5FLEdBQWlCLFFBQU84RSxHQUFVO0FBQzlDLE1BQUlYLEtBQVEsT0FBTyxXQUFZLFFBQU9XLEdBQVU7QUFDaEQsTUFBSVgsS0FBUSxPQUFPLFVBQVcsUUFBTyxDQUFDOUMsR0FBSVksR0FBTUksTUFBWW1KLEVBQVN2SixLQUFRLE9BQU8sQ0FBQzFCLEdBQVEwQixDQUFJLElBQUkxQixHQUFRYyxHQUFJZ0IsQ0FBTztBQUV4SCxNQURJOEIsS0FBUSxPQUFPLFlBQ2ZBLEtBQVEsT0FBTyxjQUFlLFFBQU8wRixFQUFRdEosR0FBUTRELENBQUk7QUFDN0QsTUFBSUEsS0FBUSxPQUFPLFFBQVMsUUFBTyxDQUFDbEMsTUFBUztBQUM1QyxJQUFBNEgsRUFBUXRKLEdBQVEsT0FBTyxPQUFPLElBQUkwQixDQUFJLEdBQ3RDK0MsR0FBVy9DLEtBQVEsT0FBTyxDQUFDMUIsR0FBUTBCLENBQUksSUFBSTFCLENBQU07QUFBQSxFQUNsRDtBQUNBLE1BQUk0RCxLQUFRLE9BQU8sYUFBYyxRQUFPLENBQUNsQyxNQUFTO0FBQ2pELElBQUE0SCxFQUFRdEosR0FBUSxPQUFPLFlBQVksSUFBSTBCLENBQUksR0FDM0MrQyxHQUFXL0MsS0FBUSxPQUFPLENBQUMxQixHQUFRMEIsQ0FBSSxJQUFJMUIsQ0FBTTtBQUFBLEVBQ2xEO0FBQ0EsTUFBSTRELEtBQVEsT0FBTyxZQUFhLFFBQU8sQ0FBQ2xDLE1BQVMrQyxHQUFXL0MsS0FBUSxPQUFPLENBQUMxQixHQUFRMEIsQ0FBSSxJQUFJMUIsQ0FBTTtBQUNsRyxNQUFJLE9BQU80RCxLQUFRLGFBQWFBLEtBQVE1RCxLQUFVc0osRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUssTUFBTyxRQUFPMEYsRUFBUXRKLEdBQVE0RCxDQUFJO0FBQzlHLEdBQ0lzSCxLQUF1QixDQUFDbEwsR0FBUTRELEdBQU1XLE1BQWE7QUFDdEQsTUFBSVgsS0FBUSxZQUFhLFFBQU9XLEdBQVUsYUFBYVgsQ0FBSSxNQUFNLENBQUNVLE1BQVk7QUFDN0UsUUFBSSxPQUFPQSxLQUFXLFdBQVksUUFBTzJHLEVBQVNqTCxHQUFRc0UsQ0FBTztBQUM1RCxRQUFJLFVBQVVBLEtBQVdBLEdBQVMsUUFBUSxNQUFNO0FBQ3BELFlBQU02RyxJQUFPRixFQUFTakwsR0FBUXNFLEdBQVMsSUFBSSxHQUFHOEcsSUFBTzlHLEdBQVU7QUFDL0QsYUFBQUEsRUFBUSxXQUFjLElBQUk5QyxPQUN6QjJKLElBQU8sR0FDQUMsSUFBTyxHQUFHNUosQ0FBSSxJQUVmOEMsRUFBUTtBQUFBLElBQ2hCO0FBQUEsRUFDRDtBQUNELEdBQ0krRyxLQUFxQixNQUFNO0FBQUEsRUFDOUJDO0FBQUEsRUFDQUM7QUFBQSxFQUNBQztBQUFBLEVBQ0EsWUFBWTVILEdBQU02SCxHQUFNbkcsR0FBUTtBQUMvQixTQUFLZ0csS0FBUTFILEdBQ2IsS0FBSzJILEtBQVFFLEdBQ2IsS0FBS0QsS0FBVWxHO0FBQUEsRUFDaEI7QUFBQSxFQUNBLElBQUl0RixHQUFRNEQsR0FBTW1HLEdBQUs7QUFDdEIsVUFBTTJCLElBQU90QyxFQUFjcEosR0FBUTRELENBQUk7QUFDdkMsV0FBSThILEtBQ0csUUFBUSxJQUFJMUwsR0FBUTRELEdBQU1tRyxDQUFHO0FBQUEsRUFDckM7QUFBQSxFQUNBLE1BQU0vSixHQUFROEQsR0FBS3RDLEdBQU07QUFDeEIsUUFBSW1LLElBQVEsQ0FBQyxHQUFHekksSUFBVSxDQUFDLEdBQ3ZCMEksSUFBVyxDQUFDLEdBQ1pDLElBQVcsQ0FBQyxHQUFHLEtBQUtOLEVBQUssR0FDekIvSCxJQUFNO0FBQ1YsVUFBTWdGLElBQVMsUUFBUSxNQUFNeEksR0FBUThELEtBQU8sS0FBS3lILElBQU8vSixDQUFJO0FBQzVELFFBQUksS0FBS2dLLEtBQVVoTSxDQUFZO0FBQzlCLGFBQUksTUFBTSxRQUFRZ0osQ0FBTSxJQUFVc0QsR0FBYXRELENBQU0sSUFDOUNBO0FBRVIsWUFBUSxLQUFLOEMsSUFBTztBQUFBLE1BQ25CLEtBQUs7QUFDSixRQUFBOUgsSUFBTXFJLEdBQVUsUUFDaEJGLElBQVFuSztBQUNSO0FBQUEsTUFDRCxLQUFLO0FBQ0osUUFBQWdDLElBQU0sR0FDTm1JLElBQVFuSztBQUNSO0FBQUEsTUFDRCxLQUFLO0FBQ0osUUFBQWdDLElBQU1xSSxHQUFVLFNBQVMsR0FDckJBLEVBQVMsU0FBUyxNQUFHM0ksSUFBVSxDQUFDMkksRUFBU3JJLENBQUcsQ0FBQztBQUNqRDtBQUFBLE1BQ0QsS0FBSztBQUNKLFFBQUFBLElBQU0sR0FDRnFJLEVBQVMsU0FBUyxNQUFHM0ksSUFBVSxDQUFDMkksRUFBU3JJLENBQUcsQ0FBQztBQUNqRDtBQUFBLE1BQ0QsS0FBSztBQUNKLFFBQUFBLElBQU1oQyxFQUFLLENBQUM7QUFDWixpQkFBU2tDLElBQUksR0FBR0EsSUFBSSxLQUFLLElBQUltSSxFQUFTLFFBQVEsS0FBS04sR0FBTSxNQUFNLEdBQUc3SCxLQUFLO0FBQ3RFLGdCQUFNb0UsSUFBVytELEVBQVNuSSxDQUFDLEdBQ3JCcUksSUFBVyxLQUFLUixHQUFNN0gsQ0FBQztBQUM3QixVQUFJcUksTUFBYSxVQUFVckksS0FBSyxLQUFLNkgsR0FBTSxTQUFRckksRUFBUSxLQUFLNEUsQ0FBUSxJQUMvREEsTUFBYSxVQUFVcEUsS0FBS21JLEVBQVMsU0FBUUQsRUFBUyxLQUFLO0FBQUEsWUFDbkVsSTtBQUFBLFlBQ0FxSTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRCxDQUFDLElBQ1F0TixFQUFXcUosR0FBVWlFLENBQVEsS0FBR0gsRUFBUyxLQUFLO0FBQUEsWUFDdERsSTtBQUFBLFlBQ0FxSTtBQUFBLFlBQ0FqRTtBQUFBLFlBQ0E7QUFBQSxVQUNELENBQUM7QUFBQSxRQUNGO0FBQ0E7QUFBQSxNQUNELEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFDSixRQUFBdEUsSUFBTTtBQUNOLGlCQUFTRSxJQUFJLEdBQUdBLElBQUltSSxFQUFTLFFBQVFuSSxJQUFLLENBQUlqRixFQUFXb04sRUFBU25JLENBQUMsR0FBRyxLQUFLNkgsR0FBTTdILENBQUMsQ0FBQyxLQUFHa0ksRUFBUyxLQUFLO0FBQUEsVUFDbkdwSSxJQUFNRTtBQUFBLFVBQ04sS0FBSzZILEdBQU03SCxDQUFDO0FBQUEsVUFDWm1JLEVBQVNuSSxDQUFDO0FBQUEsVUFDVjtBQUFBLFFBQ0QsQ0FBQztBQUNEO0FBQUEsTUFDRCxLQUFLO0FBQ0osUUFBQUYsSUFBTWhDLEVBQUssQ0FBQyxHQUNab0ssRUFBUyxLQUFLO0FBQUEsVUFDYnBJO0FBQUEsVUFDQWhDLEVBQUssQ0FBQztBQUFBLFVBQ05xSyxJQUFXckksQ0FBRztBQUFBLFVBQ2RBLEtBQU9xSTtBQUFBLFFBQ1IsQ0FBQztBQUFBLElBQ0g7QUFDQSxVQUFNRyxJQUFNcEgsRUFBa0IsSUFBSSxLQUFLMkcsRUFBSztBQWdCNUMsV0FmSUksR0FBTyxVQUFVLElBQUdLLEdBQUssVUFBVXhJLEdBQUttSSxFQUFNLENBQUMsR0FBRyxNQUFNLEtBQUssSUFDeERBLEdBQU8sU0FBUyxNQUN4QkssR0FBSyxVQUFVeEksR0FBS21JLEdBQU8sTUFBTSxRQUFRLEdBQ3pDQSxFQUFNLFFBQVEsQ0FBQ3ZKLEdBQU02SixNQUFNRCxHQUFLLFVBQVV4SSxJQUFNeUksR0FBRzdKLEdBQU0sTUFBTSxLQUFLLENBQUMsSUFFbEV3SixHQUFVLFVBQVUsSUFBR0ksR0FBSyxVQUFVSixFQUFTLENBQUMsSUFBSSxDQUFDLEtBQUtwSSxHQUFLb0ksRUFBUyxDQUFDLElBQUksQ0FBQyxHQUFHQSxFQUFTLENBQUMsSUFBSSxDQUFDLEdBQUdBLEVBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFRLFFBQVEsS0FBSyxJQUN4SUEsR0FBVSxTQUFTLE1BQzNCSSxHQUFLLFVBQVV4SSxHQUFLb0ksR0FBVUMsR0FBVSxRQUFRLEdBQ2hERCxFQUFTLFFBQVEsQ0FBQ00sR0FBTUQsTUFBTUQsR0FBSyxVQUFVRSxJQUFPLENBQUMsS0FBSzFJLElBQU15SSxHQUFHQyxJQUFPLENBQUMsR0FBR0EsSUFBTyxDQUFDLEdBQUdBLElBQU8sQ0FBQyxNQUFNLEtBQVEsUUFBUSxLQUFLLENBQUMsSUFFMUhoSixHQUFTLFVBQVUsSUFBRzhJLEdBQUssVUFBVXhJLEdBQUssTUFBTU4sRUFBUSxDQUFDLEdBQUcsUUFBUSxJQUMvREEsR0FBUyxTQUFTLE1BQzFCOEksR0FBSyxVQUFVeEksR0FBSyxNQUFNTixHQUFTLFdBQVcsR0FDOUNBLEVBQVEsUUFBUSxDQUFDZCxHQUFNNkosTUFBTUQsR0FBSyxVQUFVeEksSUFBTXlJLEdBQUcsTUFBTTdKLEdBQU0sUUFBUSxDQUFDLElBRXZFb0csS0FBVXhJLElBQWUsSUFBSSxNQUFNd0ksR0FBUSxLQUFLZ0QsRUFBTyxJQUN2RCxNQUFNLFFBQVFoRCxDQUFNLElBQVVzRCxHQUFhdEQsQ0FBTSxJQUM5Q0E7QUFBQSxFQUNSO0FBQ0QsR0FDSTJELEtBQTBCLENBQUNWLEdBQU16TCxHQUFRb00sR0FBUUMsTUFBVztBQUMvRCxRQUFNQyxJQUFlLE9BQU8sVUFBVUYsQ0FBTSxLQUFLLE9BQU8sVUFBVUMsQ0FBTSxLQUFLQSxJQUFTRCxJQUFTcE0sRUFBTyxNQUFNcU0sR0FBUUQsQ0FBTSxJQUFJLENBQUM7QUFDL0gsTUFBSSxDQUFDWCxFQUFLak0sQ0FBWSxLQUFLNE0sTUFBV0MsR0FBUTtBQUM3QyxVQUFNOUgsSUFBV0ssRUFBa0IsSUFBSTVFLENBQU07QUFDN0MsSUFBSXNNLEVBQWEsV0FBVyxJQUFHL0gsR0FBVSxVQUFVOEgsR0FBUSxNQUFNQyxFQUFhLENBQUMsR0FBRyxRQUFRLElBQ2pGQSxFQUFhLFNBQVMsTUFDOUIvSCxHQUFVLFVBQVU4SCxHQUFRLE1BQU1DLEdBQWMsV0FBVyxHQUMzREEsRUFBYSxRQUFRLENBQUNsSyxHQUFNNkosTUFBTTFILEdBQVUsVUFBVThILElBQVNKLEdBQUcsTUFBTTdKLEdBQU0sUUFBUSxDQUFDO0FBRXhGLFVBQU1tSyxJQUFhLE9BQU8sVUFBVUgsQ0FBTSxLQUFLLE9BQU8sVUFBVUMsQ0FBTSxLQUFLQSxJQUFTRCxJQUFTQyxJQUFTRCxJQUFTO0FBQy9HLFFBQUlHLE1BQWUsRUFBRyxDQUFBaEksR0FBVSxVQUFVNkgsR0FBUSxRQUFRLE1BQU0sS0FBSztBQUFBLGFBQzVERyxJQUFhLEdBQUc7QUFDeEIsWUFBTVosSUFBUSxNQUFNWSxDQUFVLEVBQUUsS0FBSyxNQUFNO0FBQzNDLE1BQUFoSSxHQUFVLFVBQVU2SCxHQUFRVCxHQUFPLE1BQU0sUUFBUSxHQUNqREEsRUFBTSxRQUFRLENBQUN2SSxHQUFHNkksTUFBTTFILEdBQVUsVUFBVTZILElBQVNILEdBQUcsUUFBUSxNQUFNLEtBQUssQ0FBQztBQUFBLElBQzdFO0FBQUEsRUFDRDtBQUNELEdBQ0lPLEtBQXNCLE1BQU07QUFBQSxFQUMvQixDQUFDaE4sQ0FBWTtBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQUM7QUFBQSxFQUNmLElBQUlRLEdBQVE0RCxHQUFNO0FBQ2pCLFdBQU8sUUFBUSxJQUFJNUQsR0FBUTRELENBQUk7QUFBQSxFQUNoQztBQUFBLEVBQ0EsSUFBSTVELEdBQVE0RCxHQUFNbUcsR0FBSztBQUN0QixVQUFNMkIsSUFBT3RDLEVBQWNwSixHQUFRNEQsQ0FBSTtBQUN2QyxRQUFJOEgsS0FBUSxLQUFNLFFBQU9BO0FBQ3pCLFFBQUk7QUFBQSxNQUNIeE07QUFBQSxNQUNBQztBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRCxFQUFFLFFBQVF5RSxDQUFJLEtBQUssS0FBSzBGLEVBQVF0SixHQUFRNEQsQ0FBSSxLQUFLLFFBQVEwRixFQUFRdEosR0FBUTRELENBQUksS0FBSzVELEVBQVEsUUFBTyxPQUFPc0osRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUssYUFBYTBGLEVBQVF0SixHQUFRNEQsQ0FBSSxHQUFHLE9BQU81RCxDQUFNLElBQUlzSixFQUFRdEosR0FBUTRELENBQUk7QUFDMU0sVUFBTVcsSUFBV0ssR0FBbUIsTUFBTTVFLENBQU0sR0FDMUN5TSxJQUFNekIsR0FBVWhMLEdBQVE0RCxHQUFNVyxDQUFRO0FBQzVDLFFBQUlrSSxLQUFPLEtBQU0sUUFBT0E7QUFDeEIsVUFBTUMsSUFBTXhCLEdBQXFCbEwsR0FBUTRELEdBQU1XLENBQVE7QUFDdkQsUUFBSW1JLEtBQU8sS0FBTSxRQUFPQTtBQUN4QixRQUFJOUksS0FBUXJFLEdBQWMsUUFBT1osR0FBZ0IsS0FBSyxNQUFNLElBQUk7QUFDaEUsUUFBSWlGLEtBQVFsRSxFQUFVLFFBQU9pTCxHQUFpQnBHLEdBQVUsQ0FBQ3pDLE1BQVk7QUFDcEUsWUFBTTZILElBQU03SCxFQUFRLE9BQU9BLEVBQVEsUUFBUSxHQUNyQ0csSUFBUWtJLEVBQW1CckksR0FBUyxTQUFTLE1BQU13SCxFQUFRdEosR0FBUTJKLENBQUcsQ0FBQyxHQUN2RTdCLElBQVdxQyxFQUFtQnJJLEdBQVMsWUFBWSxNQUFHO0FBQUEsT0FBUztBQUNyRSxhQUFPeUMsR0FBVSxVQUFVb0YsR0FBSzFILEdBQU82RixHQUFVdUMsR0FBcUJ2SSxHQUFTLFFBQVEsQ0FBQztBQUFBLElBQ3pGLENBQUM7QUFDRCxRQUFJOEIsS0FBUSxhQUFhQSxLQUFRMUUsRUFBYyxRQUFPYztBQUN0RCxRQUFJNEQsS0FBUSxJQUFLLFFBQU8sTUFDaEI1RCxHQUFRLEtBQUtBLElBQVMsQ0FBQztBQUUvQixRQUFJNEQsS0FBUSxJQUFLLFFBQU8sTUFDaEI1RCxHQUFRLEtBQUtBLElBQVMsQ0FBQztBQUUvQixRQUFJNEQsS0FBUSxJQUFLLFFBQU8sTUFDaEI1RCxHQUFRLEtBQUtBLElBQVMsQ0FBQztBQUUvQixRQUFJNEQsS0FBUSxJQUFLLFFBQU8sTUFDaEI1RCxHQUFRLEtBQUtBLElBQVMsQ0FBQztBQUUvQixRQUFJNEQsS0FBUSxJQUFLLFFBQU8sTUFDaEI1RCxHQUFRLEtBQUtBLElBQVMsQ0FBQztBQUUvQixRQUFJNEQsS0FBUSxJQUFLLFFBQU8sTUFDaEI1RCxHQUFRLEtBQUtBLElBQVMsQ0FBQztBQUUvQixRQUFJNEQsS0FBUSxJQUFLLFFBQU8sTUFDaEI1RCxHQUFRLEtBQUtBLElBQVMsQ0FBQztBQUUvQixRQUFJNEQsS0FBUSxJQUFLLFFBQU8sTUFDaEI1RCxHQUFRLEtBQUtBLElBQVMsQ0FBQztBQUUvQixVQUFNcUosSUFBTUMsRUFBUXRKLEdBQVE0RCxDQUFJLE1BQU1BLEtBQVEsVUFBVTBGLEVBQVF0SixHQUFRZixDQUFNLElBQUk7QUFDbEYsV0FBSSxPQUFPb0ssS0FBTyxhQUFtQixJQUFJLE1BQU0sT0FBT0EsS0FBTyxhQUFhQSxHQUFLLE9BQU9ySixDQUFNLElBQUlxSixHQUFLLElBQUlnQyxHQUFtQnpILEdBQU01RCxHQUFRLElBQUksQ0FBQyxJQUN4SXFKO0FBQUEsRUFDUjtBQUFBLEVBQ0EsSUFBSXJKLEdBQVE0RCxHQUFNM0IsR0FBTztBQUl4QixRQUhJLE9BQU8yQixLQUFRLFlBQ2QsT0FBTyxVQUFVLFNBQVNBLENBQUksQ0FBQyxNQUFHQSxJQUFPLFNBQVNBLENBQUksS0FBS0EsSUFFNURBLEtBQVFwRSxLQUFnQnlDO0FBQzNCLGtCQUFLekMsQ0FBWSxJQUFJLENBQUMsQ0FBQ3lDLEdBQ2hCO0FBRVIsUUFBSTJCLEtBQVFwRSxLQUFnQixDQUFDeUM7QUFDNUIsb0JBQU8sS0FBS3pDLENBQVksR0FDakI7QUFFUixVQUFNbU4sSUFBTXJELEVBQVF0SixHQUFRNEQsQ0FBSSxHQUMxQmdKLElBQU87QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRCxHQUNNQyxJQUFPO0FBQUEsTUFDWjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0QsR0FDTUMsSUFBV0YsRUFBSyxRQUFRaEosQ0FBSSxHQUM1Qm1KLElBQVdGLEVBQUssUUFBUWpKLENBQUk7QUFDbEMsUUFBSXlGLElBQU07QUFDVixXQUFJeUQsS0FBWSxJQUFHekQsSUFBTSxRQUFRLElBQUlySixHQUFROE0sR0FBVTdLLENBQUssSUFDbkQ4SyxLQUFZLElBQUcxRCxJQUFNLFFBQVEsSUFBSXJKLEdBQVErTSxHQUFVOUssQ0FBSyxJQUM1RG9ILElBQU0sUUFBUSxJQUFJckosR0FBUTRELEdBQU0zQixDQUFLLEdBQ3RDMkIsS0FBUSxZQUNQbkYsRUFBV2tPLEdBQUsxSyxDQUFLLEtBQUdrSyxHQUF3QixNQUFNbk0sR0FBUTJNLEdBQUsxSyxDQUFLLEdBRXpFLENBQUMsS0FBS3pDLENBQVksS0FBSyxPQUFPb0UsS0FBUSxZQUFZbkYsRUFBV2tPLEdBQUsxSyxDQUFLLEtBQUcyQyxHQUFtQixNQUFNNUUsQ0FBTSxHQUFHLFVBQVU0RCxHQUFNM0IsR0FBTzBLLEdBQUssS0FBSyxHQUMxSXREO0FBQUEsRUFDUjtBQUFBLEVBQ0EsZUFBZXJKLEdBQVE0RCxHQUFNO0FBSTVCLFFBSEksT0FBT0EsS0FBUSxZQUNkLE9BQU8sVUFBVSxTQUFTQSxDQUFJLENBQUMsTUFBR0EsSUFBTyxTQUFTQSxDQUFJLEtBQUtBLElBRTVEQSxLQUFRcEU7QUFDWCxvQkFBTyxLQUFLQSxDQUFZLEdBQ2pCO0FBRVIsVUFBTW1OLElBQU1yRCxFQUFRdEosR0FBUTRELENBQUksR0FDMUJ5RixJQUFNLFFBQVEsZUFBZXJKLEdBQVE0RCxDQUFJO0FBQy9DLFdBQUksQ0FBQyxLQUFLcEUsQ0FBWSxLQUFLb0UsS0FBUSxZQUFZQSxLQUFRcEUsS0FBZ0IsT0FBT29FLEtBQVEsWUFDakYrSSxLQUFPLFFBQU0vSCxFQUFrQixJQUFJNUUsQ0FBTSxHQUFHLFVBQVU0RCxHQUFNQSxHQUFNK0ksR0FBSyxRQUFRLEdBRTdFdEQ7QUFBQSxFQUNSO0FBQ0QsR0FDSTJELEtBQXVCLE1BQU07QUFBQSxFQUNoQyxDQUFDeE4sQ0FBWTtBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQUM7QUFBQSxFQUNmLElBQUlRLEdBQVE0RCxHQUFNRSxHQUFLO0FBQ3RCLFFBQUk7QUFBQSxNQUNINUU7QUFBQSxNQUNBQztBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRCxFQUFFLFFBQVF5RSxDQUFJLEtBQUssS0FBSzBGLEVBQVF0SixHQUFRNEQsQ0FBSSxLQUFLLFFBQVEwRixFQUFRdEosR0FBUTRELENBQUksS0FBSzVELEVBQVEsUUFBTyxPQUFPc0osRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUssYUFBYTFGLEVBQVE4QixHQUFRc0osRUFBUXRKLEdBQVE0RCxDQUFJLENBQUMsSUFBSTBGLEVBQVF0SixHQUFRNEQsQ0FBSTtBQUMzTSxVQUFNVyxJQUFXSyxFQUFrQixJQUFJNUUsQ0FBTSxLQUFLNEUsRUFBa0IsSUFBSTBFLEVBQVF0SixHQUFRLE9BQU8sS0FBS0EsQ0FBTSxHQUNwR3lNLElBQU16QixHQUFVaEwsR0FBUTRELEdBQU1XLENBQVE7QUFDNUMsUUFBSWtJLEtBQU8sS0FBTSxRQUFPQTtBQUN4QixJQUFJbkQsRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUssUUFBUUEsS0FBUSxXQUFXdEYsRUFBUzBCLENBQU0sS0FBS3NKLEVBQVF0SixHQUFRLE9BQU8sS0FBSyxTQUFTLE9BQU9zSixFQUFRdEosR0FBUSxPQUFPLEtBQUssWUFBWSxPQUFPc0osRUFBUXRKLEdBQVEsT0FBTyxLQUFLLGVBQWVzSixFQUFRQSxFQUFRdEosR0FBUSxPQUFPLEdBQUc0RCxDQUFJLEtBQUssU0FBTTVELElBQVNzSixFQUFRdEosR0FBUSxPQUFPLEtBQUtBO0FBQ3hTLFVBQU0wTSxJQUFNeEIsR0FBcUJsTCxHQUFRNEQsR0FBTVcsQ0FBUTtBQUN2RCxXQUFJbUksTUFDQTlJLEtBQVFyRSxLQUFxQlosR0FBZ0IsS0FBSyxNQUFNLElBQUksSUFDNURpRixLQUFRbEUsSUFBaUJpTCxHQUFpQnBHLEdBQVUsQ0FBQ3pDLE1BQVk7QUFDcEUsWUFBTTZILElBQU1hLEdBQWF4SyxHQUFROEIsRUFBUSxPQUFPQSxFQUFRLFFBQVF5SSxHQUFhdkssQ0FBTSxLQUFLLE9BQU8sR0FDekY4SCxJQUFXcUMsRUFBbUJySSxHQUFTLFlBQVksTUFBTTZILEtBQU8sV0FBV0EsS0FBT1ksR0FBYXZLLENBQU0sSUFBSXNKLEVBQVF0SixHQUFRZixDQUFNLElBQUksTUFBTSxHQUN6SWdELElBQVFrSSxFQUFtQnJJLEdBQVMsU0FBUyxNQUFNMkksR0FBZXpLLEdBQVEySixDQUFHLENBQUM7QUFDcEYsYUFBT3BGLEdBQVUsVUFBVW9GLEdBQUsxSCxHQUFPNkYsR0FBVXVDLEdBQXFCdkksR0FBUyxRQUFRLENBQUM7QUFBQSxJQUN6RixDQUFDLElBQ0c4QixLQUFRLE9BQU8sY0FBb0IsQ0FBQ3FKLE1BQVM7QUFDaEQsWUFBTUMsSUFBS3hELEVBQVkxSixHQUFRNEQsQ0FBSTtBQUNuQyxhQUFJMEYsRUFBUTRELEdBQUl0SixDQUFJLElBQVUwRixFQUFRNEQsR0FBSXRKLENBQUksSUFBSXFKLENBQUksSUFDbER2TyxFQUFZd08sQ0FBRSxJQUFVbE8sRUFBZWtPLEdBQUlELENBQUksSUFDL0N2TyxFQUFZNEssRUFBUTRELEdBQUksT0FBTyxDQUFDLElBQVVsTyxFQUFlc0ssRUFBUTRELEdBQUksT0FBTyxHQUFHRCxDQUFJLElBQ2hGak8sRUFBZXNLLEVBQVE0RCxHQUFJLE9BQU8sS0FBS0EsR0FBSUQsQ0FBSTtBQUFBLElBQ3ZELElBQ0lySixLQUFRLE9BQU8sY0FBb0IsTUFBTTtBQUM1QyxZQUFNc0osSUFBS3hELEVBQVkxSixHQUFRNEQsQ0FBSTtBQUNuQyxhQUFJMEYsRUFBUTRELEdBQUl0SixDQUFJLElBQVUwRixFQUFRNEQsR0FBSXRKLENBQUksSUFBSSxJQUM5Q2xGLEVBQVl3TyxDQUFFLElBQVUsT0FBT0EsS0FBTSxFQUFFLEtBQUssS0FDNUN4TyxFQUFZNEssRUFBUTRELEdBQUksT0FBTyxDQUFDLElBQVUsT0FBTzVELEVBQVE0RCxHQUFJLE9BQU8sS0FBSyxFQUFFLEtBQUssS0FDN0UsT0FBTzVELEVBQVE0RCxHQUFJLE9BQU8sS0FBS0EsS0FBTSxFQUFFLEtBQUs7QUFBQSxJQUNwRCxJQUNJdEosS0FBUSxhQUFtQixNQUFNO0FBQ3BDLFlBQU1zSixJQUFLeEQsRUFBWTFKLEdBQVE0RCxDQUFJO0FBQ25DLGFBQUkwRixFQUFRNEQsR0FBSXRKLENBQUksSUFBVTBGLEVBQVE0RCxHQUFJdEosQ0FBSSxJQUFJLElBQzlDMEYsRUFBUTRELEdBQUksT0FBTyxXQUFXLElBQVU1RCxFQUFRNEQsR0FBSSxPQUFPLFdBQVcsSUFBSSxJQUMxRXhPLEVBQVl3TyxDQUFFLElBQVUsT0FBT0EsS0FBTSxFQUFFLEtBQUssS0FDNUN4TyxFQUFZNEssRUFBUTRELEdBQUksT0FBTyxDQUFDLElBQVUsT0FBTzVELEVBQVE0RCxHQUFJLE9BQU8sS0FBSyxFQUFFLEtBQUssS0FDN0UsT0FBTzVELEVBQVE0RCxHQUFJLE9BQU8sS0FBS0EsS0FBTSxFQUFFLEtBQUs7QUFBQSxJQUNwRCxJQUNJdEosS0FBUSxZQUFrQixNQUFNO0FBQ25DLFlBQU1zSixJQUFLeEQsRUFBWTFKLEdBQVE0RCxDQUFJO0FBQ25DLGFBQUkwRixFQUFRNEQsR0FBSXRKLENBQUksSUFBVTBGLEVBQVE0RCxHQUFJdEosQ0FBSSxJQUFJLElBQzlDMEYsRUFBUTRELEdBQUksT0FBTyxXQUFXLElBQVU1RCxFQUFRNEQsR0FBSSxPQUFPLFdBQVcsSUFBSSxJQUMxRXhPLEVBQVl3TyxDQUFFLElBQVVBLElBQ3hCeE8sRUFBWTRLLEVBQVE0RCxHQUFJLE9BQU8sQ0FBQyxJQUFVNUQsRUFBUTRELEdBQUksT0FBTyxJQUMxRDVELEVBQVE0RCxHQUFJLE9BQU8sS0FBS0E7QUFBQSxJQUNoQyxJQUNJLE9BQU90SixLQUFRLGFBQWFBLEtBQVE1RCxLQUFVc0osRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUssUUFBYzBGLEVBQVF0SixHQUFRNEQsQ0FBSSxJQUN0RzhGLEVBQVkxSixHQUFRNEQsQ0FBSTtBQUFBLEVBQ2hDO0FBQUEsRUFDQSxNQUFNNUQsR0FBUThELEdBQUt0QyxHQUFNO0FBQ3hCLFdBQU8sUUFBUSxNQUFNeEIsR0FBUThELEdBQUt0QyxDQUFJO0FBQUEsRUFDdkM7QUFBQSxFQUNBLFFBQVF4QixHQUFRO0FBQ2YsV0FBTyxRQUFRLFFBQVFBLENBQU07QUFBQSxFQUM5QjtBQUFBLEVBQ0EsVUFBVUEsR0FBUXdCLEdBQU1xQyxHQUFNO0FBQzdCLFdBQU8sUUFBUSxVQUFVN0QsR0FBUXdCLEdBQU1xQyxDQUFJO0FBQUEsRUFDNUM7QUFBQSxFQUNBLGFBQWE3RCxHQUFRO0FBQ3BCLFdBQU8sUUFBUSxhQUFhQSxDQUFNO0FBQUEsRUFDbkM7QUFBQSxFQUNBLHlCQUF5QkEsR0FBUTJKLEdBQUs7QUFDckMsUUFBSU47QUFDSixRQUFJO0FBQ0gsTUFBQUUsR0FBZ0IsY0FBY3ZKLEdBQXdCLG9CQUFJLElBQUksQ0FBQyxHQUFHLE1BQU0ySixDQUFHLEdBQ3ZFSixHQUFnQixNQUFNdkosQ0FBTSxHQUFHLE1BQU0ySixDQUFHLE1BQUdOLElBQU0sU0FDckRBLElBQU0sUUFBUSx5QkFBeUJySixHQUFRMkosQ0FBRztBQUFBLElBQ25ELFFBQVk7QUFDWCxNQUFBTixJQUFNO0FBQUEsSUFDUCxVQUFFO0FBQ0QsTUFBQUUsR0FBZ0IsTUFBTXZKLENBQU0sR0FBRyxTQUFTMkosQ0FBRztBQUFBLElBQzVDO0FBQ0EsV0FBT047QUFBQSxFQUNSO0FBQUEsRUFDQSxJQUFJckosR0FBUTBCLEdBQU07QUFDakIsV0FBT0EsS0FBUTFCO0FBQUEsRUFDaEI7QUFBQSxFQUNBLElBQUlBLEdBQVE0RCxHQUFNM0IsR0FBTztBQUN4QixVQUFNeUosSUFBT3RDLEVBQWNwSixHQUFRNEQsQ0FBSTtBQUN2QyxXQUFJOEgsS0FDRzVNLEdBQWlCbUQsR0FBTyxDQUFDNkcsTUFBTTtBQUNyQyxZQUFNNEMsSUFBT3RDLEVBQWNOLEdBQUdsRixDQUFJO0FBQ2xDLFVBQUk4SCxLQUFRLEtBQU0sUUFBT0E7QUFDekIsVUFBSTlILEtBQVFwRSxLQUFnQnlDO0FBQzNCLG9CQUFLekMsQ0FBWSxJQUFJLENBQUMsQ0FBQ3lDLEdBQ2hCO0FBRVIsVUFBSTJCLEtBQVFwRSxLQUFnQixDQUFDeUM7QUFDNUIsc0JBQU8sS0FBS3pDLENBQVksR0FDakI7QUFFUixZQUFNMk4sSUFBWW5OO0FBRWxCLFVBRElzSixFQUFRdEosR0FBUTRELENBQUksS0FBSyxRQUFRQSxLQUFRLFdBQVd0RixFQUFTMEIsQ0FBTSxLQUFLc0osRUFBUXRKLEdBQVEsT0FBTyxLQUFLLFNBQVMsT0FBT3NKLEVBQVF0SixHQUFRLE9BQU8sS0FBSyxZQUFZLE9BQU9zSixFQUFRdEosR0FBUSxPQUFPLEtBQUssZUFBZXNKLEVBQVFBLEVBQVF0SixHQUFRLE9BQU8sR0FBRzRELENBQUksS0FBSyxTQUFNNUQsSUFBU3NKLEVBQVF0SixHQUFRLE9BQU8sS0FBS0EsSUFDcFMsT0FBTzRELEtBQVEsWUFBWSxFQUFFMEYsRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUssUUFBUUEsS0FBUTVELEdBQVM7QUFDbkYsWUFBTW9OLElBQWM1QyxHQUFheEssR0FBUTRELENBQUksR0FDdkNrRSxJQUFXbEUsS0FBUSxVQUFVMEYsRUFBUXRKLEdBQVFmLENBQU0sS0FBS3FLLEVBQVF0SixHQUFRNEQsQ0FBSSxJQUFJMEYsRUFBUXRKLEdBQVE0RCxDQUFJO0FBQzFHLE1BQUE1RCxFQUFPNEQsQ0FBSSxJQUFJa0Y7QUFDZixZQUFNaUQsSUFBV3pDLEVBQVF0SixHQUFRNEQsQ0FBSSxLQUFLa0Y7QUFDMUMsYUFBSSxDQUFDLEtBQUt0SixDQUFZLEtBQUssT0FBT29FLEtBQVEsYUFBYTBGLEVBQVF0SixHQUFRSixFQUFXLEtBQUtuQixLQUFjcUosR0FBVWlFLENBQVEsTUFBSW5ILEVBQWtCLElBQUk1RSxDQUFNLEtBQUs0RSxFQUFrQixJQUFJdUksQ0FBUyxJQUFJLFVBQVVDLEdBQWF0RSxHQUFHaEIsQ0FBUSxHQUMxTjtBQUFBLElBQ1IsQ0FBQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLGVBQWU5SCxHQUFRNEQsR0FBTXlKLEdBQVk7QUFDeEMsVUFBTTNCLElBQU90QyxFQUFjcEosR0FBUTRELENBQUk7QUFDdkMsUUFBSThILEtBQVEsS0FBTSxRQUFPQTtBQUN6QixRQUFJOUgsS0FBUXBFLEtBQWdCNk4sRUFBVztBQUN0QyxrQkFBSzdOLENBQVksSUFBSSxDQUFDLENBQUM2TixFQUFXLE9BQzNCO0FBRVIsUUFBSXpKLEtBQVFwRSxLQUFnQixDQUFDNk4sRUFBVztBQUN2QyxvQkFBTyxLQUFLN04sQ0FBWSxHQUNqQjtBQUdSLFFBREk4SixFQUFRdEosR0FBUTRELENBQUksS0FBSyxRQUFRQSxLQUFRLFdBQVd0RixFQUFTMEIsQ0FBTSxLQUFLc0osRUFBUXRKLEdBQVEsT0FBTyxLQUFLLFNBQVMsT0FBT3NKLEVBQVF0SixHQUFRLE9BQU8sS0FBSyxZQUFZLE9BQU9zSixFQUFRdEosR0FBUSxPQUFPLEtBQUssZUFBZXNKLEVBQVFBLEVBQVF0SixHQUFRLE9BQU8sR0FBRzRELENBQUksS0FBSyxTQUFNNUQsSUFBU3NKLEVBQVF0SixHQUFRLE9BQU8sS0FBS0EsSUFDcFNxTixFQUFXLE9BQU8sUUFBVUEsRUFBVyxPQUFPLEtBQVEsUUFBTyxRQUFRLGVBQWVyTixHQUFRNEQsR0FBTXlKLENBQVU7QUFDaEgsVUFBTXZGLElBQVd3QixFQUFRdEosR0FBUTRELENBQUksR0FDL0IwSixJQUFVLFFBQVEsZUFBZXROLEdBQVE0RCxHQUFNO0FBQUEsTUFDcEQsS0FBS3lKLEVBQVc7QUFBQSxNQUNoQixLQUFLQSxFQUFXO0FBQUEsTUFDaEIsWUFBWUEsRUFBVyxjQUFjO0FBQUEsTUFDckMsY0FBY0EsRUFBVyxnQkFBZ0I7QUFBQSxJQUMxQyxDQUFDO0FBQ0QsV0FBQXhELEdBQVE3SixHQUFRNEQsR0FBTWtFLENBQVEsR0FDdkJ3RjtBQUFBLEVBQ1I7QUFBQSxFQUNBLGVBQWV0TixHQUFRNEQsR0FBTTtBQUM1QixRQUFJQSxLQUFRcEU7QUFDWCxvQkFBTyxLQUFLQSxDQUFZLEdBQ2pCO0FBRVIsSUFBSThKLEVBQVF0SixHQUFRNEQsQ0FBSSxLQUFLLFFBQVFBLEtBQVEsV0FBV3RGLEVBQVMwQixDQUFNLEtBQUtzSixFQUFRdEosR0FBUSxPQUFPLEtBQUssU0FBUyxPQUFPc0osRUFBUXRKLEdBQVEsT0FBTyxLQUFLLFlBQVksT0FBT3NKLEVBQVF0SixHQUFRLE9BQU8sS0FBSyxlQUFlc0osRUFBUUEsRUFBUXRKLEdBQVEsT0FBTyxHQUFHNEQsQ0FBSSxLQUFLLFNBQU01RCxJQUFTc0osRUFBUXRKLEdBQVEsT0FBTyxLQUFLQTtBQUN4UyxVQUFNOEgsSUFBV3dCLEVBQVF0SixHQUFRNEQsQ0FBSSxHQUMvQjRFLElBQVMsUUFBUSxlQUFleEksR0FBUTRELENBQUk7QUFDbEQsV0FBSSxDQUFDLEtBQUtwRSxDQUFZLEtBQUtvRSxLQUFRcEUsS0FBZ0IsT0FBT29FLEtBQVEsWUFBVWdCLEVBQWtCLElBQUk1RSxDQUFNLEdBQUcsVUFBVTRELEdBQU0sTUFBTWtFLEdBQVUsUUFBUSxHQUM1SVU7QUFBQSxFQUNSO0FBQ0QsR0FDSStFLEtBQW9CLE1BQU07QUFBQSxFQUM3QixDQUFDL04sQ0FBWTtBQUFBLEVBQ2IsY0FBYztBQUFBLEVBQUM7QUFBQSxFQUNmLElBQUlRLEdBQVE0RCxHQUFNRSxHQUFLO0FBQ3RCLFFBQUk7QUFBQSxNQUNINUU7QUFBQSxNQUNBQztBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRCxFQUFFLFFBQVF5RSxDQUFJLEtBQUssS0FBSzBGLEVBQVF0SixHQUFRNEQsQ0FBSSxLQUFLLFFBQVEwRixFQUFRdEosR0FBUTRELENBQUksS0FBSzVELEVBQVEsUUFBTyxPQUFPc0osRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUssYUFBYTFGLEVBQVE4QixHQUFRc0osRUFBUXRKLEdBQVE0RCxDQUFJLENBQUMsSUFBSTBGLEVBQVF0SixHQUFRNEQsQ0FBSTtBQUMzTSxVQUFNVyxJQUFXSyxFQUFrQixJQUFJNUUsQ0FBTSxHQUN2Q3lNLElBQU16QixHQUFVaEwsR0FBUTRELEdBQU1XLENBQVE7QUFDNUMsUUFBSWtJLEtBQU8sS0FBTSxRQUFPQTtBQUN4QixVQUFNQyxJQUFNeEIsR0FBcUJsTCxHQUFRNEQsR0FBTVcsQ0FBUTtBQUN2RCxRQUFJbUksS0FBTyxLQUFNLFFBQU9BO0FBQ3hCLElBQUExTSxJQUFTc0osRUFBUXRKLEdBQVFkLENBQVksS0FBS29LLEVBQVF0SixHQUFRYixDQUFhLEtBQUthO0FBQzVFLFVBQU13TixJQUFZdFAsRUFBUThCLEdBQVFzSixFQUFRdEosR0FBUTRELENBQUksQ0FBQztBQUN2RCxXQUFJLE9BQU9BLEtBQVEsYUFBYUEsS0FBUTVELEtBQVVzSixFQUFRdEosR0FBUTRELENBQUksS0FBSyxRQUFjNEosSUFDckY1SixLQUFRckUsS0FBcUJaLEdBQWdCLEtBQUssTUFBTSxJQUFJLElBQzVEaUYsS0FBUWxFLElBQWlCaUwsR0FBaUJwRyxHQUFVLENBQUN6QyxNQUFZO0FBQ3BFLFlBQU02SCxJQUFNN0gsRUFBUSxPQUFPQSxFQUFRO0FBQ25DLFVBQUk2SCxLQUFPLEtBQU07QUFDakIsWUFBTTFILElBQVFrSSxFQUFtQnJJLEdBQVMsU0FBUyxNQUFNOUIsRUFBTyxJQUFJMkosQ0FBRyxDQUFDO0FBQ3hFLFVBQUkxSCxLQUFTLFFBQVEsQ0FBQytILEVBQU9sSSxHQUFTLE9BQU8sRUFBRztBQUNoRCxZQUFNZ0csSUFBV3FDLEVBQW1CckksR0FBUyxZQUFZLE1BQUc7QUFBQSxPQUFTO0FBQ3JFLGFBQU95QyxHQUFVLFVBQVVvRixHQUFLMUgsR0FBTzZGLEdBQVV1QyxHQUFxQnZJLEdBQVMsUUFBUSxDQUFDO0FBQUEsSUFDekYsQ0FBQyxJQUNHOEIsS0FBUSxVQUFnQixNQUFNO0FBQ2pDLFlBQU02SixJQUFZLE1BQU0sS0FBS3pOLEdBQVEsVUFBVSxLQUFLLENBQUMsQ0FBQyxHQUFHd0ksSUFBU2dGLEVBQVU7QUFDNUUsYUFBQUMsRUFBVSxRQUFRLENBQUMsQ0FBQy9MLEdBQU1vRyxDQUFRLE1BQU07QUFDdkMsUUFBSyxLQUFLdEksQ0FBWSxLQUFHb0YsRUFBa0IsSUFBSTVFLENBQU0sR0FBRyxVQUFVMEIsR0FBTSxNQUFNb0csR0FBVSxRQUFRO0FBQUEsTUFDakcsQ0FBQyxHQUNNVTtBQUFBLElBQ1IsSUFDSTVFLEtBQVEsV0FBaUIsQ0FBQ2xDLEdBQU0wQixJQUFJLFNBQVM7QUFDaEQsWUFBTXNLLElBQU0xTixFQUFPLElBQUkwQixDQUFJLEdBQUdvRyxJQUFXOUgsRUFBTyxJQUFJMEIsQ0FBSSxHQUFHOEcsSUFBU2dGLEVBQVU5TCxDQUFJO0FBQ2xGLGFBQUksQ0FBQyxLQUFLbEMsQ0FBWSxLQUFLa08sS0FBSzlJLEVBQWtCLElBQUk1RSxDQUFNLEdBQUcsVUFBVTBCLEdBQU0sTUFBTW9HLEdBQVUsUUFBUSxHQUNoR1U7QUFBQSxJQUNSLElBQ0k1RSxLQUFRLFFBQWMsQ0FBQ2xDLEdBQU1PLE1BQVVsRCxHQUFvQmtELEdBQU8sQ0FBQzZHLE1BQU07QUFDNUUsWUFBTTRFLElBQU0xTixFQUFPLElBQUkwQixDQUFJLEdBQUdvRyxJQUFXOUgsRUFBTyxJQUFJMEIsQ0FBSSxHQUFHOEcsSUFBU2dGLEVBQVU5TCxHQUFNb0gsQ0FBQztBQUNyRixjQUFJLENBQUM0RSxLQUFPalAsRUFBV3FKLEdBQVVnQixDQUFDLE9BQzVCLEtBQUt0SixDQUFZLEtBQUdvRixFQUFrQixJQUFJNUUsQ0FBTSxHQUFHLFVBQVUwQixHQUFNb0gsR0FBRzRFLElBQU01RixJQUFXLE1BQU00RixJQUFNLFFBQVEsS0FBSyxJQUUvR2xGO0FBQUEsSUFDUixDQUFDLElBQ01nRjtBQUFBLEVBQ1I7QUFBQSxFQUNBLElBQUl4TixHQUFRNEQsR0FBTTNCLEdBQU87QUFDeEIsV0FBSTJCLEtBQVFwRSxLQUNYLEtBQUtBLENBQVksSUFBSSxDQUFDLENBQUN5QyxHQUNoQixNQUVKMkIsS0FBUXBFLEtBQWdCLENBQUN5QyxLQUM1QixPQUFPLEtBQUt6QyxDQUFZLEdBQ2pCLE1BRUQsUUFBUSxJQUFJUSxHQUFRNEQsR0FBTTNCLENBQUs7QUFBQSxFQUN2QztBQUFBLEVBQ0EsSUFBSWpDLEdBQVEwQixHQUFNO0FBQ2pCLFdBQU8sUUFBUSxJQUFJMUIsR0FBUTBCLENBQUk7QUFBQSxFQUNoQztBQUFBLEVBQ0EsTUFBTTFCLEdBQVE4RCxHQUFLdEMsR0FBTTtBQUN4QixXQUFPLFFBQVEsTUFBTXhCLEdBQVE4RCxHQUFLdEMsQ0FBSTtBQUFBLEVBQ3ZDO0FBQUEsRUFDQSxVQUFVeEIsR0FBUXdCLEdBQU1xQyxHQUFNO0FBQzdCLFdBQU8sUUFBUSxVQUFVN0QsR0FBUXdCLEdBQU1xQyxDQUFJO0FBQUEsRUFDNUM7QUFBQSxFQUNBLFFBQVE3RCxHQUFRO0FBQ2YsV0FBTyxRQUFRLFFBQVFBLENBQU07QUFBQSxFQUM5QjtBQUFBLEVBQ0EsYUFBYUEsR0FBUTtBQUNwQixXQUFPLFFBQVEsYUFBYUEsQ0FBTTtBQUFBLEVBQ25DO0FBQUEsRUFDQSx5QkFBeUJBLEdBQVEySixHQUFLO0FBQ3JDLFFBQUlOO0FBQ0osUUFBSTtBQUNILE1BQUFFLEdBQWdCLGNBQWN2SixHQUF3QixvQkFBSSxJQUFJLENBQUMsR0FBRyxNQUFNMkosQ0FBRyxHQUN2RUosR0FBZ0IsTUFBTXZKLENBQU0sR0FBRyxNQUFNMkosQ0FBRyxNQUFHTixJQUFNLFNBQ3JEQSxJQUFNLFFBQVEseUJBQXlCckosR0FBUTJKLENBQUc7QUFBQSxJQUNuRCxRQUFZO0FBQ1gsTUFBQU4sSUFBTTtBQUFBLElBQ1AsVUFBRTtBQUNELE1BQUFFLEdBQWdCLE1BQU12SixDQUFNLEdBQUcsU0FBUzJKLENBQUc7QUFBQSxJQUM1QztBQUNBLFdBQU9OO0FBQUEsRUFDUjtBQUFBLEVBQ0EsZUFBZXJKLEdBQVE0RCxHQUFNO0FBQzVCLFdBQUlBLEtBQVFwRSxLQUNYLE9BQU8sS0FBS0EsQ0FBWSxHQUNqQixNQUVELFFBQVEsZUFBZVEsR0FBUTRELENBQUk7QUFBQSxFQUMzQztBQUNELEdBQ0krSixLQUFvQixNQUFNO0FBQUEsRUFDN0IsQ0FBQ25PLENBQVksSUFBSTtBQUFBLEVBQ2pCLGNBQWM7QUFBQSxFQUFDO0FBQUEsRUFDZixJQUFJUSxHQUFRNEQsR0FBTUUsR0FBSztBQUN0QixRQUFJO0FBQUEsTUFDSDVFO0FBQUEsTUFDQUM7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0QsRUFBRSxRQUFReUUsQ0FBSSxLQUFLLEtBQUswRixFQUFRdEosR0FBUTRELENBQUksS0FBSyxRQUFRMEYsRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUs1RCxFQUFRLFFBQU8sT0FBT3NKLEVBQVF0SixHQUFRNEQsQ0FBSSxLQUFLLGFBQWExRixFQUFROEIsR0FBUXNKLEVBQVF0SixHQUFRNEQsQ0FBSSxDQUFDLElBQUkwRixFQUFRdEosR0FBUTRELENBQUk7QUFDM00sVUFBTVcsSUFBV0ssRUFBa0IsSUFBSTVFLENBQU0sR0FDdkN5TSxJQUFNekIsR0FBVWhMLEdBQVE0RCxHQUFNVyxDQUFRO0FBQzVDLFFBQUlrSSxLQUFPLEtBQU0sUUFBT0E7QUFDeEIsVUFBTUMsSUFBTXhCLEdBQXFCbEwsR0FBUTRELEdBQU1XLENBQVE7QUFDdkQsUUFBSW1JLEtBQU8sS0FBTSxRQUFPQTtBQUN4QixJQUFBMU0sSUFBU3NKLEVBQVF0SixHQUFRZCxDQUFZLEtBQUtvSyxFQUFRdEosR0FBUWIsQ0FBYSxLQUFLYTtBQUM1RSxVQUFNd04sSUFBWXRQLEVBQVE4QixHQUFRc0osRUFBUXRKLEdBQVE0RCxDQUFJLENBQUM7QUFDdkQsV0FBSSxPQUFPQSxLQUFRLGFBQWFBLEtBQVE1RCxLQUFVc0osRUFBUXRKLEdBQVE0RCxDQUFJLEtBQUssUUFBYzRKLElBQ3JGNUosS0FBUXJFLEtBQXFCWixHQUFnQixLQUFLLE1BQU0sSUFBSSxJQUM1RGlGLEtBQVFsRSxJQUFpQmlMLEdBQWlCcEcsR0FBVSxDQUFDekMsTUFBWTtBQUNwRSxZQUFNNkgsSUFBTTdILEVBQVEsT0FBT0EsRUFBUTtBQUNuQyxVQUFJNkgsS0FBTyxLQUFNO0FBQ2pCLFlBQU0xSCxJQUFRa0ksRUFBbUJySSxHQUFTLFNBQVMsTUFBTTlCLEVBQU8sSUFBSTJKLENBQUcsQ0FBQyxHQUNsRTdCLElBQVdxQyxFQUFtQnJJLEdBQVMsWUFBWSxNQUFHO0FBQUEsT0FBUztBQUNyRSxhQUFPeUMsR0FBVSxVQUFVb0YsR0FBSzFILEdBQU82RixHQUFVdUMsR0FBcUJ2SSxHQUFTLFFBQVEsQ0FBQztBQUFBLElBQ3pGLENBQUMsSUFDRzhCLEtBQVEsVUFBZ0IsTUFBTTtBQUNqQyxZQUFNNkosSUFBWSxNQUFNLEtBQUt6TixHQUFRLFNBQVMsS0FBSyxDQUFDLENBQUMsR0FBR3dJLElBQVNnRixFQUFVO0FBQzNFLGFBQUFDLEVBQVUsUUFBUSxDQUFDM0YsTUFBYTtBQUMvQixRQUFLLEtBQUt0SSxDQUFZLEtBQUdvRixFQUFrQixJQUFJNUUsQ0FBTSxHQUFHLFVBQVUsTUFBTSxNQUFNOEgsR0FBVSxRQUFRO0FBQUEsTUFDakcsQ0FBQyxHQUNNVTtBQUFBLElBQ1IsSUFDSTVFLEtBQVEsV0FBaUIsQ0FBQzNCLE1BQVU7QUFDdkMsWUFBTXlMLElBQU0xTixFQUFPLElBQUlpQyxDQUFLLEdBQUc2RixJQUFXNEYsSUFBTXpMLElBQVEsTUFBTXVHLElBQVNnRixFQUFVdkwsQ0FBSztBQUN0RixhQUFJLENBQUMsS0FBS3pDLENBQVksS0FBS2tPLEtBQUs5SSxFQUFrQixJQUFJNUUsQ0FBTSxHQUFHLFVBQVVpQyxHQUFPLE1BQU02RixHQUFVLFFBQVEsR0FDakdVO0FBQUEsSUFDUixJQUNJNUUsS0FBUSxRQUFjLENBQUMzQixNQUFVO0FBQ3BDLFlBQU15TCxJQUFNMU4sRUFBTyxJQUFJaUMsQ0FBSyxHQUFHNkYsSUFBVzRGLElBQU16TCxJQUFRLE1BQU11RyxJQUFTZ0YsRUFBVXZMLENBQUs7QUFDdEYsYUFBS3lMLEtBQ0MsS0FBS2xPLENBQVksS0FBR29GLEVBQWtCLElBQUk1RSxDQUFNLEdBQUcsVUFBVWlDLEdBQU9BLEdBQU82RixHQUFVLEtBQUssR0FFekZVO0FBQUEsSUFDUixJQUNPZ0Y7QUFBQSxFQUNSO0FBQUEsRUFDQSxJQUFJeE4sR0FBUTRELEdBQU0zQixHQUFPO0FBQ3hCLFdBQUkyQixLQUFRcEUsS0FBZ0J5QyxLQUMzQixLQUFLekMsQ0FBWSxJQUFJLENBQUMsQ0FBQ3lDLEdBQ2hCLE1BRUoyQixLQUFRcEUsS0FBZ0IsQ0FBQ3lDLEtBQzVCLE9BQU8sS0FBS3pDLENBQVksR0FDakIsTUFFRCxRQUFRLElBQUlRLEdBQVE0RCxHQUFNM0IsQ0FBSztBQUFBLEVBQ3ZDO0FBQUEsRUFDQSxJQUFJakMsR0FBUTBCLEdBQU07QUFDakIsV0FBTyxRQUFRLElBQUkxQixHQUFRMEIsQ0FBSTtBQUFBLEVBQ2hDO0FBQUEsRUFDQSxNQUFNMUIsR0FBUThELEdBQUt0QyxHQUFNO0FBQ3hCLFdBQU8sUUFBUSxNQUFNeEIsR0FBUThELEdBQUt0QyxDQUFJO0FBQUEsRUFDdkM7QUFBQSxFQUNBLFVBQVV4QixHQUFRd0IsR0FBTXFDLEdBQU07QUFDN0IsV0FBTyxRQUFRLFVBQVU3RCxHQUFRd0IsR0FBTXFDLENBQUk7QUFBQSxFQUM1QztBQUFBLEVBQ0EsUUFBUTdELEdBQVE7QUFDZixXQUFPLFFBQVEsUUFBUUEsQ0FBTTtBQUFBLEVBQzlCO0FBQUEsRUFDQSxhQUFhQSxHQUFRO0FBQ3BCLFdBQU8sUUFBUSxhQUFhQSxDQUFNO0FBQUEsRUFDbkM7QUFBQSxFQUNBLHlCQUF5QkEsR0FBUTJKLEdBQUs7QUFDckMsUUFBSU47QUFDSixRQUFJO0FBQ0gsTUFBQUUsR0FBZ0IsY0FBY3ZKLEdBQXdCLG9CQUFJLElBQUksQ0FBQyxHQUFHLE1BQU0ySixDQUFHLEdBQ3ZFSixHQUFnQixNQUFNdkosQ0FBTSxHQUFHLE1BQU0ySixDQUFHLE1BQUdOLElBQU0sU0FDckRBLElBQU0sUUFBUSx5QkFBeUJySixHQUFRMkosQ0FBRztBQUFBLElBQ25ELFFBQVk7QUFDWCxNQUFBTixJQUFNO0FBQUEsSUFDUCxVQUFFO0FBQ0QsTUFBQUUsR0FBZ0IsTUFBTXZKLENBQU0sR0FBRyxTQUFTMkosQ0FBRztBQUFBLElBQzVDO0FBQ0EsV0FBT047QUFBQSxFQUNSO0FBQUEsRUFDQSxlQUFlckosR0FBUTRELEdBQU07QUFDNUIsV0FBSUEsS0FBUXBFLEtBQ1gsT0FBTyxLQUFLQSxDQUFZLEdBQ2pCLE1BRUQsUUFBUSxlQUFlUSxHQUFRNEQsQ0FBSTtBQUFBLEVBQzNDO0FBQ0QsR0FDSWdLLElBQWdCLENBQUM1TixNQUNiLENBQUMsR0FBRyxPQUFPQSxLQUFVLFlBQVksT0FBT0EsS0FBVSxlQUFlQSxLQUFVLFNBQVNBLElBQVNkLENBQVksS0FBS2MsSUFBU0wsRUFBUyxLQUVwSW1NLEtBQWUsQ0FBQ3hMLE1BQ1pzTixFQUFjdE4sQ0FBRyxJQUFJQSxJQUFNa0YsR0FBU2xGLEdBQUssSUFBSWtNLEdBQW9CLENBQUMsR0FFdEVxQixLQUFnQixDQUFDMU0sTUFDYnlNLEVBQWN6TSxDQUFHLElBQUlBLElBQU1xRSxHQUFTckUsR0FBSyxJQUFJNkwsR0FBcUIsQ0FBQyxHQUV2RWMsS0FBYSxDQUFDQyxNQUNWSCxFQUFjRyxDQUFHLElBQUlBLElBQU12SSxHQUFTdUksR0FBSyxJQUFJUixHQUFrQixDQUFDLEdBRXBFUyxLQUFhLENBQUNDLE1BQ1ZMLEVBQWNLLENBQUcsSUFBSUEsSUFBTXpJLEdBQVN5SSxHQUFLLElBQUlOLEdBQWtCLENBQUMsR0FLcEVPLEtBQVksQ0FBQ0MsR0FBU0MsTUFBYTtBQUN0QyxRQUFNQyxJQUFZRixhQUFtQixXQUFXLE9BQU9BLEdBQVMsUUFBUSxZQUNsRUcsSUFBS0MsRUFBUTtBQUFBLElBQ2xCLENBQUNqUCxFQUFRLEdBQUcrTyxJQUFZRixJQUFVO0FBQUEsSUFDbEMsQ0FBQ2xQLENBQU0sR0FBR29QLElBQVksSUFBSSxPQUFPOU4sRUFBTTROLENBQU8sS0FBSyxDQUFDLEtBQUs7QUFBQSxJQUN6RCxDQUFDOU8sQ0FBUyxHQUFHK087QUFBQSxJQUNiLENBQUMsUUFBUSxXQUFXLElBQUk7QUFDdkIsYUFBTyxPQUFPLE9BQU9uUCxDQUFNLEtBQUssRUFBRSxLQUFLO0FBQUEsSUFDeEM7QUFBQSxJQUNBLENBQUMsUUFBUSxXQUFXLEVBQUVnTyxHQUFNO0FBQzNCLGFBQU9qTyxHQUFnQixPQUFPLE9BQU9DLENBQU0sS0FBSyxXQUFXLE9BQU9BLENBQU0sSUFBSSxPQUFPQSxDQUFNLEdBQUcsU0FBUyxNQUFNLEdBQUdnTyxDQUFJO0FBQUEsSUFDbkg7QUFBQSxJQUNBLElBQUksTUFBTW5FLEdBQUc7QUFDWixXQUFLN0osQ0FBTSxLQUFLNkosS0FBSyxRQUFRLENBQUMsT0FBTyxNQUFNQSxDQUFDLElBQUksT0FBT0EsQ0FBQyxJQUFJLEtBQUs3SixDQUFNLE1BQU07QUFBQSxJQUM5RTtBQUFBLElBQ0EsSUFBSSxRQUFRO0FBQ1gsYUFBTyxPQUFPLEtBQUtBLENBQU0sS0FBSyxDQUFDLEtBQUs7QUFBQSxJQUNyQztBQUFBLEVBQ0QsQ0FBQztBQUNELFNBQUFrUCxHQUFTLE9BQU8sQ0FBQ3JGLE1BQU13RixFQUFHLFFBQVF4RixDQUFDLEdBQzVCd0Y7QUFDUixHQUNJRSxLQUFZLENBQUNMLEdBQVNDLE1BQWE7QUFDdEMsUUFBTUMsSUFBWUYsYUFBbUIsV0FBVyxPQUFPQSxHQUFTLFFBQVEsWUFDbEVHLElBQUtDLEVBQVE7QUFBQSxJQUNsQixDQUFDalAsRUFBUSxHQUFHK08sSUFBWUYsSUFBVTtBQUFBLElBQ2xDLENBQUNsUCxDQUFNLElBQUlvUCxJQUFZLEtBQUssT0FBTzlOLEVBQU0sT0FBTzROLEtBQVcsV0FBVyxPQUFPQSxDQUFPLElBQUlBLEtBQVcsRUFBRSxDQUFDLE1BQU07QUFBQSxJQUM1RyxDQUFDOU8sQ0FBUyxHQUFHK087QUFBQSxJQUNiLENBQUMsUUFBUSxXQUFXLElBQUk7QUFDdkIsYUFBTyxPQUFPLE9BQU9uUCxDQUFNLEtBQUssRUFBRSxLQUFLO0FBQUEsSUFDeEM7QUFBQSxJQUNBLENBQUMsUUFBUSxXQUFXLEVBQUVnTyxHQUFNO0FBQzNCLGFBQU9qTyxFQUFlLE9BQU9DLENBQU0sS0FBSyxJQUFJZ08sQ0FBSTtBQUFBLElBQ2pEO0FBQUEsSUFDQSxJQUFJLE1BQU1uRSxHQUFHO0FBQ1osV0FBSzdKLENBQU0sSUFBSSxPQUFPLE9BQU82SixLQUFLLFdBQVcsT0FBT0EsQ0FBQyxJQUFJQSxLQUFLLEVBQUUsS0FBSztBQUFBLElBQ3RFO0FBQUEsSUFDQSxJQUFJLFFBQVE7QUFDWCxhQUFPLE9BQU8sS0FBSzdKLENBQU0sS0FBSyxFQUFFLEtBQUs7QUFBQSxJQUN0QztBQUFBLEVBQ0QsQ0FBQztBQUNELFNBQUFrUCxHQUFTLE9BQU8sQ0FBQ3JGLE1BQU13RixFQUFHLFFBQVF4RixDQUFDLEdBQzVCd0Y7QUFDUixHQUNJRyxLQUFhLENBQUNOLEdBQVNDLE1BQWE7QUFDdkMsUUFBTUMsSUFBWUYsYUFBbUIsV0FBVyxPQUFPQSxHQUFTLFFBQVEsWUFDbEVHLElBQUtDLEVBQVE7QUFBQSxJQUNsQixDQUFDalAsRUFBUSxHQUFHK08sSUFBWUYsSUFBVTtBQUFBLElBQ2xDLENBQUNsUCxDQUFNLElBQUlvUCxJQUFZLE1BQVM5TixFQUFNNE4sQ0FBTyxLQUFLLE9BQU8sT0FBTzVOLEVBQU00TixDQUFPLEtBQUssV0FBVyxLQUFPLENBQUMsQ0FBQzVOLEVBQU00TixDQUFPLElBQUksT0FBVSxPQUFVO0FBQUEsSUFDM0ksQ0FBQzlPLENBQVMsR0FBRytPO0FBQUEsSUFDYixDQUFDLFFBQVEsV0FBVyxJQUFJO0FBQ3ZCLGFBQU8sT0FBTyxPQUFPblAsQ0FBTSxLQUFLLEVBQUUsS0FBSztBQUFBLElBQ3hDO0FBQUEsSUFDQSxDQUFDLFFBQVEsV0FBVyxFQUFFZ08sR0FBTTtBQUMzQixhQUFPak8sRUFBZSxDQUFDLENBQUMsT0FBT0MsQ0FBTSxLQUFLLElBQU9nTyxDQUFJO0FBQUEsSUFDdEQ7QUFBQSxJQUNBLElBQUksTUFBTW5FLEdBQUc7QUFDWixXQUFLN0osQ0FBTSxLQUFLNkosS0FBSyxPQUFPLE9BQU9BLEtBQUssV0FBVyxLQUFPLENBQUMsQ0FBQ0EsSUFBSSxLQUFLN0osQ0FBTSxNQUFNO0FBQUEsSUFDbEY7QUFBQSxJQUNBLElBQUksUUFBUTtBQUNYLGFBQU8sS0FBS0EsQ0FBTSxLQUFLO0FBQUEsSUFDeEI7QUFBQSxFQUNELENBQUM7QUFDRCxTQUFBa1AsR0FBUyxPQUFPLENBQUNyRixNQUFNd0YsRUFBRyxRQUFReEYsQ0FBQyxHQUM1QndGO0FBQ1IsR0FDSUksS0FBVSxDQUFDUCxHQUFTQyxNQUFhO0FBQ3BDLFFBQU1DLElBQVlGLGFBQW1CLFdBQVcsT0FBT0EsR0FBUyxRQUFRLFlBQ2xFRyxJQUFLQyxFQUFRO0FBQUEsSUFDbEIsQ0FBQ2pQLEVBQVEsR0FBRytPLElBQVlGLElBQVU7QUFBQSxJQUNsQyxDQUFDOU8sQ0FBUyxHQUFHK087QUFBQSxJQUNiLENBQUMsUUFBUSxXQUFXLElBQUk7QUFDdkIsYUFBTyxPQUFPLEtBQUssU0FBUyxFQUFFLEtBQUs7QUFBQSxJQUNwQztBQUFBLElBQ0EsQ0FBQyxRQUFRLFdBQVcsRUFBRW5CLEdBQU07QUFDM0IsYUFBT2pPLEVBQWUsS0FBSyxPQUFPaU8sQ0FBSTtBQUFBLElBQ3ZDO0FBQUEsSUFDQSxPQUFPb0IsSUFBWSxPQUFPOU4sRUFBTTROLENBQU87QUFBQSxFQUN4QyxDQUFDO0FBQ0QsU0FBQUEsR0FBUyxPQUFPLENBQUNyRixNQUFNd0YsRUFBRyxRQUFReEYsQ0FBQyxHQUNuQ21DLEVBQVNrRCxHQUFTLENBQUNyRixNQUFNO0FBQ3hCLElBQUF3RixJQUFLNU8sQ0FBUSxJQUFJO0FBQUEsRUFDbEIsQ0FBQyxHQUNNNE87QUFDUixHQUNJSyxLQUFlLENBQUMzTyxHQUFRMEssTUFBYTtBQUN4QyxNQUFJMUssS0FBVSxRQUFRLE9BQU9BLEtBQVUsWUFBWSxPQUFPQSxLQUFVLFdBQVksUUFBT0E7QUFDdkYsTUFBSTtBQUNILFdBQU8sZUFBZUEsR0FBUUgsSUFBVztBQUFBLE1BQ3hDLE9BQU82SztBQUFBLE1BQ1AsVUFBVTtBQUFBLE1BQ1YsY0FBYztBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0YsUUFBUTtBQUNQLFFBQUk7QUFDSCxNQUFBMUssRUFBT0gsRUFBUyxJQUFJNks7QUFBQSxJQUNyQixRQUFRO0FBQUEsSUFBQztBQUFBLEVBQ1Y7QUFDQSxNQUFJO0FBQ0gsV0FBTyxlQUFlMUssR0FBUSxZQUFZO0FBQUEsTUFDekMsT0FBTzBLO0FBQUEsTUFDUCxVQUFVO0FBQUEsTUFDVixjQUFjO0FBQUEsSUFDZixDQUFDO0FBQUEsRUFDRixRQUFRO0FBQ1AsUUFBSTtBQUNILE1BQUExSyxFQUFPLFdBQVcwSztBQUFBLElBQ25CLFFBQVE7QUFBQSxJQUFDO0FBQUEsRUFDVjtBQUNBLFNBQU8xSztBQUNSLEdBQ0k0TyxLQUFVLENBQUNDLEdBQUtDLElBQVUsU0FBU1gsR0FBU0MsTUFBYTtBQUM1RCxNQUFJMVAsRUFBWW1RLENBQUcsS0FBSyxDQUFDQSxFQUFLLFFBQU9BO0FBQ3JDLEVBQUksTUFBTSxRQUFRQSxDQUFHLEtBQUtBLEVBQUksVUFBVSxLQUFLQSxFQUFJLENBQUMsS0FBSyxTQUFTQSxFQUFJLENBQUMsYUFBYSxPQUFPQSxFQUFJLENBQUMsYUFBYSxXQUFXQSxFQUFJLENBQUMsYUFBYSxPQUFPQSxFQUFJLENBQUMsYUFBYSxhQUM1SkMsS0FBVyxRQUFRQSxNQUFZLGFBQVNBLElBQVVELEVBQUksQ0FBQyxJQUMzREEsSUFBTUEsRUFBSSxDQUFDLEtBQ0QsTUFBTSxRQUFRQSxDQUFHLEtBQUssQ0FBQ3RRLEVBQWtCc1EsSUFBTSxDQUFDLEdBQUdBLENBQUcsTUFBTSxNQUFNLFFBQVFBLElBQU0sQ0FBQyxDQUFDLEtBQUssT0FBT0EsSUFBTSxDQUFDLEtBQUssWUFBWSxPQUFPQSxJQUFNLENBQUMsS0FBSyxnQkFBYUEsSUFBTUEsSUFBTSxDQUFDO0FBQzlLLFFBQU1FLElBQVFGLGFBQWUsT0FBT0EsYUFBZSxTQUM3Q0csSUFBUUgsYUFBZSxPQUFPQSxhQUFlO0FBQ25ELE1BQUlFLEtBQVNDO0FBQ1osUUFBSUYsS0FBVyxLQUFNO0FBQUEsY0FDVkEsTUFBWSxNQUFNLFFBQVFELENBQUcsSUFBSSxPQUFPLFlBQVksUUFBUXRRLEVBQWtCdVEsR0FBU0QsQ0FBRyxFQUFHO0FBQ3pHLFFBQU1JLElBQVcsTUFDWkYsSUFBY0YsRUFBSSxJQUFJQyxDQUFPLElBQzdCRSxJQUFjSCxFQUFJLElBQUlDLENBQU8sSUFDMUJELElBQU1DLENBQU8sR0FFZkksSUFBWSxDQUFDcEcsTUFDZGlHLEtBQ0hGLEVBQUksSUFBSUMsR0FBU2hHLENBQUMsR0FDWEEsS0FFSmtHLEtBQ0NsRyxJQUFHK0YsRUFBSSxJQUFJQyxDQUFPLElBQ2pCRCxFQUFJLE9BQU9DLENBQU8sR0FDaEJELEVBQUksSUFBSUMsQ0FBTyxLQUVoQkQsRUFBSUMsQ0FBTyxJQUFJaEc7QUFFdkIsRUFBSWlHLEtBQVNaLE1BQVksVUFBVSxDQUFDVSxFQUFJLElBQUlDLENBQU8sSUFBR0QsRUFBSSxJQUFJQyxHQUFTWCxDQUFPLElBQ3JFYSxLQUFTYixLQUFXLENBQUNVLEVBQUksSUFBSUMsQ0FBTyxLQUFHRCxFQUFJLElBQUlDLENBQU87QUFDL0QsUUFBTW5NLElBQVVzTSxFQUFTO0FBQ3pCLE1BQUksQ0FBQ0QsS0FBU0YsS0FBVyxRQUFReFEsRUFBU3FFLENBQU8sS0FBS3dNLEVBQWF4TSxDQUFPLEVBQUcsUUFBT2dNLEdBQWFTLEdBQWdCek0sQ0FBTyxHQUFHbU0sQ0FBTztBQUNsSSxNQUFJLENBQUNDLEtBQVMsQ0FBQ0MsS0FBU0YsS0FBVyxPQUFPRCxHQUFLLGVBQWUsY0FBY00sRUFBYU4sR0FBSyxjQUFjQyxDQUFPLENBQUMsRUFBRyxRQUFPSCxHQUFhRSxHQUFLLGNBQWNDLENBQU8sR0FBR0EsQ0FBTztBQUMvSyxFQUFJLENBQUNDLEtBQVMsQ0FBQ0MsTUFBT0gsRUFBSUMsQ0FBTyxNQUFNWCxLQUFXVSxFQUFJQyxDQUFPO0FBQzdELFFBQU1wSyxJQUFJNkosRUFBUTtBQUFBLElBQ2pCLENBQUN0UCxDQUFNLEdBQUcrUCxJQUFRLENBQUMsQ0FBQ0MsRUFBUyxJQUFJQSxFQUFTLEtBQUtkO0FBQUEsSUFDL0MsQ0FBQzlPLENBQVMsR0FBRytPO0FBQUEsSUFDYixDQUFDLFFBQVEsV0FBVyxJQUFJO0FBQ3ZCLGFBQU8sT0FBT2EsRUFBUyxLQUFLLEtBQUtoUSxDQUFNLEtBQUssRUFBRSxLQUFLO0FBQUEsSUFDcEQ7QUFBQSxJQUNBLENBQUMsUUFBUSxXQUFXLEVBQUVnTyxHQUFNO0FBQzNCLGFBQU9qTyxFQUFlaVEsRUFBUyxHQUFHaEMsQ0FBSTtBQUFBLElBQ3ZDO0FBQUEsSUFDQSxJQUFJLE1BQU1uRSxHQUFHO0FBRVosVUFEQXBFLEVBQUUxRyxFQUFjLElBQUksSUFDaEJnUixFQUFPLE1BQUsvUCxDQUFNLElBQUlpUSxFQUFVcEcsQ0FBQztBQUFBLFdBQ2hDO0FBQ0osY0FBTWpHLElBQU9pRyxLQUFLekssR0FBYzRRLEVBQVMsQ0FBQztBQUMxQyxhQUFLaFEsQ0FBTSxJQUFJaVEsRUFBVXJNLENBQUk7QUFBQSxNQUM5QjtBQUNBLE1BQUE2QixFQUFFMUcsRUFBYyxJQUFJO0FBQUEsSUFDckI7QUFBQSxJQUNBLElBQUksUUFBUTtBQUNYLFlBQU1xUixJQUFPSixFQUFTO0FBQ3RCLGFBQU8sS0FBS2hRLENBQU0sSUFBSStQLElBQVEsQ0FBQyxDQUFDSyxJQUFPQSxLQUFRLEtBQUtwUSxDQUFNO0FBQUEsSUFDM0Q7QUFBQSxFQUNELENBQUM7QUFDRCxFQUFBMFAsR0FBYWpLLEdBQUdvSyxDQUFPO0FBQ3ZCLFFBQU1RLElBQU1yRSxFQUFTNEQsR0FBSyxDQUFDL0YsR0FBR3lHLEdBQU81QyxHQUFLekcsTUFBWTtBQUNyRCxRQUFJcUosTUFBVVQsR0FBUztBQUN0QixZQUFNN00sSUFBUStNLElBQVFsRyxLQUFLLE9BQU9BLEdBQzVCaEIsSUFBV2tILElBQVFyQyxLQUFPLE9BQU9BO0FBQ3ZDLE1BQUFqSSxJQUFJaEYsQ0FBUSxJQUFJO0FBQUEsUUFDZixLQUFLb1A7QUFBQSxRQUNMLE9BQUE3TTtBQUFBLFFBQ0EsVUFBQTZGO0FBQUEsUUFDQSxTQUFBNUI7QUFBQSxNQUNELENBQUM7QUFBQSxJQUNGO0FBQUEsRUFDRCxDQUFDO0FBQ0QsU0FBQWhGLEVBQWV3RCxHQUFHLE9BQU8sU0FBUzRLLENBQUcsR0FDOUI1SztBQUNSLEdBQ0k4SyxLQUFPLENBQUNDLEdBQU9yQixNQUFhO0FBQy9CLFVBQVEsT0FBT3FCLEdBQU87QUFBQSxJQUNyQixLQUFLO0FBQVcsYUFBT2hCLEdBQVdnQixHQUFPckIsQ0FBUTtBQUFBLElBQ2pELEtBQUs7QUFBVSxhQUFPRixHQUFVdUIsR0FBT3JCLENBQVE7QUFBQSxJQUMvQyxLQUFLO0FBQVUsYUFBT0ksR0FBVWlCLEdBQU9yQixDQUFRO0FBQUEsSUFDL0MsS0FBSztBQUFVLFVBQUlxQixLQUFTLEtBQU0sUUFBT2YsR0FBUUgsRUFBUWtCLENBQUssR0FBR3JCLENBQVE7QUFBQSxJQUN6RTtBQUFTLGFBQU9NLEdBQVFlLEdBQU9yQixDQUFRO0FBQUEsRUFDeEM7QUFDRCxHQUNJc0IsS0FBTSxDQUFDRCxHQUFPL04sSUFBTyxTQUFTME0sTUFBYTtBQUM5QyxRQUFNRSxJQUFLYSxFQUFhTSxDQUFLLElBQUlBLElBQVFELEdBQUtDLEdBQU9yQixDQUFRO0FBQzdELFNBQUkxTSxLQUFRLE9BQWFrTixHQUFRTixHQUFJNU0sR0FBTTBNLENBQVEsSUFDdkNFO0FBQ2IsR0FDSXFCLEtBQVcsQ0FBQ0MsR0FBU3hCLE1BQ2pCc0IsR0FBSUUsR0FBU3hCLENBQVEsR0FFekJ5QixLQUFtQixDQUFDSCxHQUFLNU8sR0FBSWdQLElBQVEsUUFBUTtBQUNoRCxNQUFJSixHQUFLLFNBQVNBLEVBQUssUUFBTyxXQUFXLE1BQU07QUFDOUMsSUFBSUEsRUFBSSxTQUFPNU8sSUFBSztBQUFBLEVBQ3JCLEdBQUdnUCxDQUFLO0FBQ1QsR0FDSUMsS0FBa0IsQ0FBQ0QsSUFBUSxRQUN2QixDQUFDaFAsR0FBSSxDQUFDRixDQUFHLEdBQUcsQ0FBQ29QLENBQUcsTUFBTTtBQUM1QixNQUFJQyxJQUFLSixHQUFpQmpQLEdBQUtFLEdBQUlnUCxDQUFLO0FBQ3hDLEVBQUFFLEdBQUssbUJBQW1CLFNBQVMsTUFBTTtBQUN0QyxJQUFJQyxLQUFJLGFBQWFBLENBQUU7QUFBQSxFQUN4QixHQUFHLEVBQUUsTUFBTSxHQUFLLENBQUM7QUFDbEIsR0FFR0MsS0FBMkIsQ0FBQ0osSUFBUSxRQUNoQyxDQUFDaFAsR0FBSSxDQUFDRixDQUFHLEdBQUcsQ0FBQ29QLENBQUcsTUFBTTtBQUM1QixNQUFJQyxJQUFLSixHQUFpQmpQLEdBQUtFLEdBQUlnUCxDQUFLO0FBQ3hDLEVBQUFFLEdBQUssbUJBQW1CLFNBQVMsTUFBTTtBQUN0QyxJQUFJQyxLQUFJLGFBQWFBLENBQUU7QUFBQSxFQUN4QixHQUFHLEVBQUUsTUFBTSxHQUFLLENBQUMsR0FDWkEsS0FBSW5QLElBQUs7QUFDZjtBQUVELFNBQVN5TixFQUFRdk8sR0FBUW1RLEdBQVc7QUFFbkMsTUFESW5RLEtBQVUsUUFBUSxPQUFPQSxLQUFVLFlBQVksRUFBRSxPQUFPQSxLQUFVLFlBQVksT0FBT0EsS0FBVSxlQUFlNE4sRUFBYzVOLENBQU0sTUFDaklBLElBQVNPLElBQVFQLENBQU0sTUFBTSxRQUFRQSxhQUFrQixXQUFXQSxhQUFrQixXQUFXNE4sRUFBYzVOLENBQU0sRUFBRyxRQUFPQTtBQUNsSSxRQUFNQyxJQUFTRDtBQUNmLE1BQUlDLEtBQVUsUUFBUSxPQUFPQSxLQUFVLFlBQVksRUFBRSxPQUFPQSxLQUFVLFlBQVksT0FBT0EsS0FBVSxlQUFlQSxhQUFrQixXQUFXQSxhQUFrQixRQUFTLFFBQU9BO0FBQ2pMLE1BQUltUSxJQUFXblE7QUFDZixTQUFJLE1BQU0sUUFBUUEsQ0FBTSxLQUN2Qm1RLElBQVd0RSxHQUFhN0wsQ0FBTSxHQUN2Qm1RLEtBQ0duUSxhQUFrQixPQUM1Qm1RLElBQVd0QyxHQUFXN04sQ0FBTSxHQUNyQm1RLEtBQ0duUSxhQUFrQixPQUM1Qm1RLElBQVdwQyxHQUFXL04sQ0FBTSxHQUNyQm1RLE9BQ0csT0FBT25RLEtBQVUsY0FBYyxPQUFPQSxLQUFVLGNBQzFEbVEsSUFBV3ZDLEdBQWM1TixDQUFNLElBQ3hCbVE7QUFHVDtBQUNBLElBQUlqQixJQUFlLENBQUNuUCxNQUNmLE9BQU8sbUJBQW9CLE9BQWVBLGFBQWtCLG1CQUF5QixLQUNsRixDQUFDLEdBQUcsT0FBT0EsS0FBVSxZQUFZLE9BQU9BLEtBQVUsZUFBZUEsS0FBVSxTQUFTQSxJQUFTZCxDQUFZLEtBQUtjLElBQVNMLEVBQVMsS0FBS2lGLEdBQW1CLE1BQU01RSxDQUFNLEtBRXhLb1AsS0FBa0IsQ0FBQ3BQLE1BQ2ZtUCxFQUFhblAsQ0FBTSxJQUFJdU8sRUFBUXZPLENBQU0sSUFBSSxNQUs3Q3FRLEtBQWdCLENBQUNwUSxNQUFXO0FBQy9CLE1BQUlBLEtBQVUsUUFBUSxPQUFPQSxLQUFVLFlBQVksT0FBT0EsS0FBVSxjQUFjQSxJQUFTLE9BQU8sVUFBVSxLQUFLLEtBQU0sUUFBT0E7QUFDOUgsTUFBSTtBQUNILElBQUFBLEVBQU8sT0FBTyxVQUFVLElBQUksTUFBTTtBQUFBLEVBQ25DLFFBQVk7QUFDWCxZQUFRLEtBQUssd0ZBQXdGO0FBQUEsRUFDdEc7QUFDQSxTQUFBQSxFQUFPTixFQUFTLElBQUksQ0FBQ21CLEdBQUlZLEdBQU1JLE1BQVk7QUFDMUMsVUFBTXdPLElBQWFyUSxJQUFTLFFBQVEsVUFBVTtBQUM5QyxXQUFBcVEsSUFBYSxHQUFHLFdBQVd4UCxHQUFJWSxHQUFNSSxDQUFPLEdBQ3JDLE1BQU13TyxJQUFhLEdBQUcsYUFBYXhQLEdBQUlZLENBQUk7QUFBQSxFQUNuRCxHQUNPekI7QUFDUixHQUNJc1EsSUFBdUMsb0JBQUksUUFBUSxHQUNuREMsS0FBZ0IsQ0FBQ3JQLE1BQVE7QUFDNUIsTUFBSSxTQUFPQSxLQUFPLFlBQVlBLEtBQU8sUUFBUSxFQUFFLE9BQU9BLEtBQU8sWUFBWSxPQUFPQSxLQUFPO0FBQ3ZGLFdBQU9BO0FBQ1IsR0FDSXNQLEtBQWlCLFdBQ2pCQyxLQUFhLENBQUMxUSxNQUFXO0FBQzVCLFFBQU0wQixJQUFPMUIsSUFBU0gsRUFBUyxLQUFLRyxHQUFRO0FBQzVDLFNBQU94QixFQUFVa0QsQ0FBSSxJQUFJQSxJQUFPO0FBQ2pDLEdBQ0lpUCxLQUF3QixDQUFDM1EsR0FBUTBCLE1BQVM7QUFDN0MsUUFBTWdKLElBQVdnRyxHQUFXMVEsQ0FBTTtBQUNsQyxTQUFJMEssS0FBWSxTQUFTaEosS0FBUSxRQUFRQSxLQUFRLFdBQWlCZ0osSUFDM0RoSjtBQUNSLEdBQ0lrUCxLQUFjLENBQUM1USxHQUFRMEIsTUFDdEJBLEtBQVEsUUFBUUEsS0FBUWdQLEdBQVcxUSxDQUFNLElBQVVBLEdBQVEsUUFDeERBLElBQVMwQixDQUFJLEdBRWpCbVAsS0FBcUIsQ0FBQzdRLEdBQVEwQixHQUFNWixHQUFJZ0QsTUFBUTtBQUNuRCxNQUFJcEMsS0FBUSxRQUFRQSxLQUFRZ1AsR0FBVzFRLENBQU0sR0FBRztBQUMvQyxVQUFNaUMsSUFBUTJPLEdBQVk1USxHQUFRMEIsQ0FBSTtBQUN0QyxRQUFJTyxLQUFTLEtBQU0sUUFBT25CLElBQUttQixHQUFPUCxHQUFNLE1BQU0sS0FBSztBQUFBLEVBQ3hEO0FBQ0EsU0FBT3RELEdBQVc0QixHQUFRMEIsR0FBTVosR0FBSWdELENBQUc7QUFDeEMsR0FDSWdOLEtBQWMsQ0FBQ2hRLEdBQUlnQixHQUFTb0UsTUFBWTtBQUMzQyxRQUFNbEIsSUFBYTRCLEdBQXlCOUUsQ0FBTztBQUNuRCxNQUFJb0UsS0FBV3VLO0FBQ2QsUUFBSSxDQUFDekwsRUFBVyxtQkFBb0I7QUFBQSxhQUMxQixDQUFDeUIsRUFBb0J6QixFQUFXLGFBQWFrQixDQUFPLEVBQUc7QUFDbEUsU0FBTyxDQUFDakUsR0FBTzJCLEdBQU1rRSxNQUFhQyxNQUFRakgsSUFBS21CLEdBQU8yQixHQUFNa0UsR0FBVTVCLEdBQVMsR0FBRzZCLENBQUc7QUFDdEYsR0FDSWdKLEtBQW9CLENBQUMvUSxHQUFRMEIsR0FBTVosR0FBSWdCLElBQVUsQ0FBQyxHQUFHLE1BQU07QUFFOUQsTUFESSxDQUFDOUIsS0FDRCxDQUFDd1EsR0FBY3hRLENBQU0sRUFBRztBQUM1QixRQUFNZ1IsSUFBUXRQLEtBQVEsT0FBTyxXQUFXaVAsR0FBc0IzUSxHQUFRMEIsQ0FBSSxJQUFJO0FBQzlFLE1BQUk2QyxJQUFXdkUsSUFBU1osRUFBYSxLQUFLd0YsRUFBa0IsSUFBSTVFLENBQU07QUFDdEUsRUFBQUEsSUFBU0EsSUFBU2QsQ0FBWSxLQUFLYyxHQUNuQyxlQUFlLE1BQU07QUFDcEIsVUFBTWlSLElBQVlILEdBQVloUSxHQUFJZ0IsR0FBUzJPLEVBQWM7QUFDekQsSUFBS1EsTUFDREQsS0FBUyxRQUFRQSxLQUFTLE9BQU8sV0FBVUgsR0FBbUI3USxHQUFRZ1IsR0FBT0MsR0FBVyxJQUFJLElBQzNGOVMsR0FBYzZCLEdBQVFpUixHQUFXLElBQUk7QUFBQSxFQUMzQyxDQUFDO0FBQ0QsTUFBSUMsSUFBUTNNLEdBQVUsV0FBV3pELEdBQUlrUSxHQUFPbFAsQ0FBTztBQUNuRCxTQUFJOUIsSUFBUyxPQUFPLE9BQU8sTUFDM0JrQixFQUFlZ1EsR0FBTyxPQUFPLFNBQVNBLENBQUssR0FDM0NoUSxFQUFlZ1EsR0FBTyxPQUFPLGNBQWNBLENBQUssR0FDaERoUSxFQUFlbEIsR0FBUSxPQUFPLFNBQVNrUixDQUFLLEdBQzVDaFEsRUFBZWxCLEdBQVEsT0FBTyxjQUFja1IsQ0FBSyxJQUMxQ0E7QUFDUixHQUNJQyxLQUFpQixDQUFDbkksR0FBSTVGLEdBQUd0QyxHQUFJZ0IsSUFBVSxDQUFDLEdBQUcsTUFBTTtBQUNwRCxRQUFNK0UsSUFBY0QsR0FBeUI5RSxDQUFPLEVBQUUsYUFDaERzUCxJQUFPLENBQUM7QUFDZCxNQUFJdEosSUFBV2tCLEdBQUk7QUFDbkIsUUFBTXFJLElBQU0sQ0FBQ0MsTUFBTztBQUNuQixVQUFNclAsSUFBUXFQLEdBQUksUUFBUTtBQUMxQixJQUFJN0ssRUFBb0JJLEdBQWEsS0FBSyxLQUFHL0YsSUFBS21CLEdBQU8sU0FBUzZGLEdBQVUsT0FBT3dKLENBQUUsR0FDckZ4SixJQUFXN0Y7QUFBQSxFQUNaO0FBQ0EsU0FBQStHLEdBQUksbUJBQW1CLFVBQVVxSSxHQUFLRCxDQUFJLEdBQ25DLE1BQU1wSSxHQUFJLHNCQUFzQixVQUFVcUksR0FBS0QsQ0FBSTtBQUMzRCxHQUNJRyxJQUFnQixDQUFDdkksTUFDYixNQUFNLFFBQVFBLENBQUUsS0FBS0EsR0FBSSxVQUFVLEtBQUt3SCxHQUFjeEgsSUFBSyxDQUFDLENBQUMsTUFBTXhLLEVBQVV3SyxJQUFLLENBQUMsQ0FBQyxLQUFLQSxJQUFLLENBQUMsS0FBSyxPQUFPLFdBRS9Hd0ksS0FBcUIsQ0FBQ3ZQLE1BQ2xCLENBQUMsQ0FBQ0EsS0FBUyxPQUFPQSxLQUFTLFlBQVksQ0FBQyxNQUFNLFFBQVFBLENBQUssTUFBTSxpQkFBaUJBLEtBQVMsY0FBY0EsS0FBUyx3QkFBd0JBLElBRTlJd1AsS0FBeUIsQ0FBQ0MsTUFDekJBLEtBQVcsT0FBYSxDQUFDLElBQ3pCLE1BQU0sUUFBUUEsQ0FBTyxLQUFLLENBQUNILEVBQWNHLENBQU8sS0FBSyxDQUFDdkMsRUFBYXVDLENBQU8sSUFBVUEsSUFDakYsQ0FBQ0EsQ0FBTyxHQUVaQyxLQUFzQixDQUFDOVAsTUFBVztBQUNyQyxNQUFJMFAsRUFBYzFQLENBQU0sR0FBRztBQUMxQixVQUFNN0IsSUFBUzZCLElBQVMsQ0FBQztBQUN6QixXQUFPO0FBQUEsTUFDTixRQUFBQTtBQUFBLE1BQ0EsUUFBQTdCO0FBQUEsTUFDQSxNQUFNMlEsR0FBc0IzUSxHQUFRNkIsSUFBUyxDQUFDLENBQUM7QUFBQSxJQUNoRDtBQUFBLEVBQ0Q7QUFDQSxTQUFPO0FBQUEsSUFDTixRQUFBQTtBQUFBLElBQ0EsUUFBUUE7QUFBQSxJQUNSLE1BQU07QUFBQSxFQUNQO0FBQ0QsR0FDSStQLEtBQWdCLENBQUMvUCxHQUFRN0IsR0FBUWlDLEdBQU9QLEdBQU1vRyxHQUFVNUIsR0FBUzFFLE9BQVU7QUFBQSxFQUM5RSxRQUFBSztBQUFBLEVBQ0EsUUFBQTdCO0FBQUEsRUFDQSxPQUFBaUM7QUFBQSxFQUNBLE1BQUFQO0FBQUEsRUFDQSxNQUFNQTtBQUFBLEVBQ04sVUFBQW9HO0FBQUEsRUFDQSxTQUFBNUI7QUFBQSxFQUNBLE1BQUExRTtBQUNELElBQ0lxUSxLQUFrQixDQUFDN0ksR0FBSTVGLEdBQUd0QyxHQUFJZ0IsSUFBVSxDQUFDLEdBQUcsTUFBTTtBQUNyRCxRQUFNSixJQUFPbEQsRUFBVXdLLElBQUssQ0FBQyxDQUFDLElBQUlBLElBQUssQ0FBQyxJQUFJO0FBQzVDLFNBQU9pQyxFQUFTakMsSUFBSyxDQUFDLEdBQUd0SCxHQUFNWixHQUFJZ0IsQ0FBTztBQUMzQyxHQUNJZ1EsS0FBb0IsQ0FBQzNRLEdBQUtPLEdBQU1aLEdBQUlnQixJQUFVLENBQUMsR0FBRyxNQUM5Q1gsR0FBSyxPQUFPLENBQUNBLE1BQVE4SixJQUFXOUosR0FBS08sR0FBTVosR0FBSWdCLENBQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQzNCLE9BQ3pFLFFBQVEsS0FBS0EsQ0FBQyxHQUNQLEtBQ1AsR0FFRThLLElBQVcsQ0FBQzlKLEdBQUtPLEdBQU1aLElBQUssTUFBTTtBQUFDLEdBQUdnQixNQUFZO0FBVXJELE1BVEksT0FBT0osS0FBUSxjQUNsQkksSUFBVWhCLEdBQ1ZBLElBQUtZLEdBQ0xBLElBQU8sUUFDREEsSUFBT2lQLEdBQXNCeFAsR0FBS08sQ0FBSSxJQUN6QyxPQUFPWixLQUFNLFlBQVksTUFBTSxRQUFRQSxDQUFFLE9BQzVDZ0IsSUFBVWhCLEdBQ1ZBLElBQUssTUFBTTtBQUFBLEVBQUMsS0FFVHBDLEVBQVl5QyxDQUFHLEtBQUssT0FBT0EsS0FBTyxhQUNqQ3lGLEdBQXlCOUUsQ0FBTyxFQUFFO0FBQW9CLFdBQU83RCxHQUFTLFlBQVksU0FBUyxNQUFNLE1BQzdGNkMsSUFBS0ssR0FBSyxNQUFNLE1BQU0sTUFBTXNQLEVBQWMsQ0FDakQsQ0FBQztBQUVILE1BQUksT0FBT3RQLElBQU14QixFQUFTLEtBQUssV0FBWSxRQUFPd0IsSUFBTXhCLEVBQVMsSUFBSW1CLEdBQUlZLEdBQU1JLENBQU87QUFDakYsTUFBSTBPLEdBQWNyUCxDQUFHLEdBQUc7QUFDNUIsVUFBTWdFLElBQVVoRTtBQUNoQixRQUFJb1AsR0FBc0IsTUFBTXBQLElBQU1BLElBQU1qQyxDQUFZLEtBQUtpQyxDQUFHLEVBQUcsUUFBT29QLEdBQXNCLE1BQU1wUCxDQUFHLElBQUlnRSxHQUFTekQsR0FBTVosR0FBSWdCLENBQU87QUFDdkksUUFBSXFOLEVBQWFoSyxDQUFPLEtBQUtvTSxFQUFjcFEsQ0FBRyxLQUFLZ08sRUFBYWhPLElBQU0sQ0FBQyxDQUFDO0FBQ3ZFLGFBQUlSLEdBQVdRLENBQUcsSUFBVW9QLEdBQXNCLGNBQWNwUCxHQUFLMlEsRUFBaUIsSUFBSTNRLEdBQUtPLEdBQU1aLEdBQUlnQixDQUFPLElBQ3ZHeVAsRUFBY3BRLENBQUcsSUFBVW9QLEdBQXNCLGNBQWNwUCxHQUFLMFEsRUFBZSxJQUFJMVEsR0FBS08sR0FBTVosR0FBSWdCLENBQU8sSUFDN0csT0FBTyxtQkFBb0IsT0FBZVgsYUFBZSxtQkFBeUJvUCxHQUFzQixjQUFjcFAsR0FBS2dRLEVBQWMsSUFBSWhRLEdBQUtPLEdBQU1aLEdBQUlnQixDQUFPLElBQ2hLeU8sR0FBc0IsY0FBY3BQLEdBQUs0UCxFQUFpQixJQUFJNUwsR0FBU3pELEdBQU1aLEdBQUlnQixDQUFPO0FBQzlGO0FBQ04sWUFBTW1QLElBQVlILEdBQVloUSxHQUFJZ0IsR0FBUzJPLEVBQWM7QUFDekQsYUFBS1EsSUFDRWhULEdBQVMsWUFBWSxTQUFTLE1BQU0sTUFDdENzVCxFQUFjcFEsQ0FBRyxJQUFVMFAsS0FBcUIxUCxJQUFNLENBQUMsR0FBR0EsSUFBTSxDQUFDLEdBQUc4UCxHQUFXLElBQUksSUFDOUV2UCxLQUFRLFFBQVFBLEtBQVEsT0FBTyxXQUFpQm1QLEtBQXFCMVAsR0FBS08sR0FBTXVQLEdBQVcsSUFBSSxJQUM1RjlTLEtBQWdCZ0QsR0FBSzhQLEdBQVcsSUFBSSxDQUNoRCxDQUFDLElBTGM7QUFBQSxJQU1qQjtBQUFBLEVBQ0Q7QUFDRDtBQUNBLFNBQVNjLEdBQU9qUixHQUFJNFEsR0FBUzVQLEdBQVM7QUFDckMsTUFBSWhCLEtBQU0sUUFBUSxPQUFPQSxLQUFNLFdBQVk7QUFDM0MsTUFBSTBRLEdBQW1CRSxDQUFPLEtBQUs1UCxNQUFZLE9BQVEsUUFBT2lELEdBQWVqRSxHQUFJNFEsQ0FBTztBQUN4RixNQUFJQSxLQUFXLEtBQU0sUUFBTzNNLEdBQWVqRSxHQUFJZ0IsQ0FBTztBQUN0RCxRQUFNa0QsSUFBYUMsR0FBdUJuRCxDQUFPLEdBQzNDa1EsSUFBa0I7QUFBQSxJQUN2QixhQUFhaE4sRUFBVztBQUFBLElBQ3hCLG9CQUFvQkEsRUFBVztBQUFBLEVBQ2hDLEdBQ01pTixJQUFZUixHQUF1QkMsQ0FBTyxFQUFFLElBQUksQ0FBQzdQLE1BQVc7QUFDakUsVUFBTWlDLElBQU02TixHQUFvQjlQLENBQU07QUFDdEMsV0FBT29KLEVBQVNuSCxFQUFJLFFBQVFBLEVBQUksTUFBTSxDQUFDN0IsR0FBT1AsR0FBTW9HLEdBQVU1QixNQUFZMUUsTUFDbEVWLEVBQUc4USxHQUFjOU4sRUFBSSxRQUFRQSxFQUFJLFFBQVE3QixHQUFPUCxHQUFNb0csR0FBVTVCLEtBQVcsTUFBTTFFLENBQUksQ0FBQyxHQUMzRndRLENBQWU7QUFBQSxFQUNuQixDQUFDLEVBQUUsT0FBTyxDQUFDRSxNQUFZLE9BQU9BLEtBQVcsVUFBVTtBQUNuRCxTQUFPLE1BQU1ELEVBQVUsUUFBUSxDQUFDQyxNQUFZQSxJQUFVLENBQUM7QUFDeEQ7QUFDQSxTQUFTQyxHQUFTVCxHQUFTNVEsR0FBSWdCLEdBQVM7QUFDdkMsU0FBT2lRLEdBQU9qUixHQUFJNFEsR0FBUzVQLENBQU87QUFDbkM7QUFDQSxJQUFJc1EsS0FBc0IsQ0FBQ3BKLE1BQ3RCQSxhQUFjLE1BQVlxSixHQUFnQnJKLENBQUUsSUFDNUNBLGFBQWMsTUFBWXNKLEdBQWdCdEosQ0FBRSxJQUN6Q0EsR0FFSnVKLEtBQWdCLE1BQU07QUFBQSxFQUN6QkMsS0FBdUIsb0JBQUksUUFBUTtBQUFBLEVBQ25DQyxHQUFhQyxHQUFNO0FBQ2xCLFFBQUlBLEtBQVEsUUFBUSxPQUFPQSxLQUFTLFlBQVksT0FBT0EsS0FBUyxXQUFZLFFBQU87QUFDbkYsUUFBSUMsSUFBUSxLQUFLSCxHQUFLLElBQUlFLENBQUk7QUFDOUIsV0FBS0MsTUFDSkEsSUFBd0Isb0JBQUksUUFBUSxHQUNwQyxLQUFLSCxHQUFLLElBQUlFLEdBQU1DLENBQUssSUFFbkJBO0FBQUEsRUFDUjtBQUFBLEVBQ0FDLEdBQVcxRyxHQUFNO0FBQ2hCLFdBQUksQ0FBQyxNQUFNLFFBQVFBLENBQUksS0FBS0EsRUFBSyxXQUFXLElBQVUsQ0FBQyxNQUFNLElBQUksSUFDMURBO0FBQUEsRUFDUjtBQUFBLEVBQ0EsTUFBTXdHLEdBQU07QUFDWCxXQUFPLEtBQUtGLEdBQUssSUFBSUUsQ0FBSTtBQUFBLEVBQzFCO0FBQUEsRUFDQSxJQUFJeEcsR0FBTWpLLEdBQU87QUFDaEIsVUFBTSxDQUFDeVEsR0FBTUcsQ0FBSSxJQUFJLEtBQUtELEdBQVcxRyxDQUFJLEdBQ25DeUcsSUFBUSxLQUFLRixHQUFhQyxDQUFJO0FBQ3BDLFdBQUksQ0FBQ0MsS0FBU0UsS0FBUSxRQUFRLE9BQU9BLEtBQVMsWUFBWSxPQUFPQSxLQUFTLGFBQW1CLFFBQzdGRixFQUFNLElBQUlFLEdBQU01USxDQUFLLEdBQ2Q7QUFBQSxFQUNSO0FBQUEsRUFDQSxJQUFJaUssR0FBTTtBQUNULFVBQU0sQ0FBQ3dHLEdBQU1HLENBQUksSUFBSSxLQUFLRCxHQUFXMUcsQ0FBSTtBQUN6QyxRQUFJLEVBQUF3RyxLQUFRLFFBQVEsT0FBT0EsS0FBUyxZQUFZLE9BQU9BLEtBQVM7QUFDaEUsYUFBTyxLQUFLRixHQUFLLElBQUlFLENBQUksR0FBRyxJQUFJRyxDQUFJO0FBQUEsRUFDckM7QUFBQSxFQUNBLElBQUkzRyxHQUFNO0FBQ1QsVUFBTSxDQUFDd0csR0FBTUcsQ0FBSSxJQUFJLEtBQUtELEdBQVcxRyxDQUFJO0FBQ3pDLFdBQUl3RyxLQUFRLFFBQVEsT0FBT0EsS0FBUyxZQUFZLE9BQU9BLEtBQVMsYUFBbUIsS0FDNUUsS0FBS0YsR0FBSyxJQUFJRSxDQUFJLEdBQUcsSUFBSUcsQ0FBSSxLQUFLO0FBQUEsRUFDMUM7QUFBQSxFQUNBLE9BQU8zRyxHQUFNO0FBQ1osVUFBTSxDQUFDd0csR0FBTUcsQ0FBSSxJQUFJLEtBQUtELEdBQVcxRyxDQUFJO0FBQ3pDLFFBQUl3RyxLQUFRLFFBQVEsT0FBT0EsS0FBUyxZQUFZLE9BQU9BLEtBQVMsV0FBWSxRQUFPO0FBQ25GLFVBQU1DLElBQVEsS0FBS0gsR0FBSyxJQUFJRSxDQUFJO0FBQ2hDLFdBQU9DLElBQVFBLEVBQU0sT0FBT0UsQ0FBSSxJQUFJO0FBQUEsRUFDckM7QUFBQSxFQUNBLFVBQVVILEdBQU07QUFDZixXQUFJQSxLQUFRLFFBQVEsT0FBT0EsS0FBUyxZQUFZLE9BQU9BLEtBQVMsYUFBbUIsS0FDNUUsS0FBS0YsR0FBSyxPQUFPRSxDQUFJO0FBQUEsRUFDN0I7QUFBQSxFQUNBLFlBQVl4RyxHQUFNNEcsR0FBUztBQUMxQixVQUFNLENBQUNKLEdBQU1HLENBQUksSUFBSSxLQUFLRCxHQUFXMUcsQ0FBSSxHQUNuQ3lHLElBQVEsS0FBS0YsR0FBYUMsQ0FBSTtBQUNwQyxRQUFJLENBQUNDLEtBQVNFLEtBQVEsUUFBUSxPQUFPQSxLQUFTLFlBQVksT0FBT0EsS0FBUyxXQUFZLFFBQU9DLElBQVU7QUFDdkcsUUFBSUgsRUFBTSxJQUFJRSxDQUFJLEVBQUcsUUFBT0YsRUFBTSxJQUFJRSxDQUFJO0FBQzFDLFVBQU01USxJQUFRNlEsRUFBUTtBQUN0QixXQUFBSCxFQUFNLElBQUlFLEdBQU01USxDQUFLLEdBQ2RBO0FBQUEsRUFDUjtBQUFBLEVBQ0EsWUFBWWlLLEdBQU1qSyxHQUFPO0FBQ3hCLFVBQU0sQ0FBQ3lRLEdBQU1HLENBQUksSUFBSSxLQUFLRCxHQUFXMUcsQ0FBSSxHQUNuQ3lHLElBQVEsS0FBS0YsR0FBYUMsQ0FBSTtBQUNwQyxXQUFJLENBQUNDLEtBQVNFLEtBQVEsUUFBUSxPQUFPQSxLQUFTLFlBQVksT0FBT0EsS0FBUyxhQUFtQjVRLElBQ3pGMFEsRUFBTSxJQUFJRSxDQUFJLElBQVVGLEVBQU0sSUFBSUUsQ0FBSSxLQUMxQ0YsRUFBTSxJQUFJRSxHQUFNNVEsQ0FBSyxHQUNkQTtBQUFBLEVBQ1I7QUFBQSxFQUNBLG9CQUFvQmlLLEdBQU02RyxHQUFTO0FBQ2xDLFVBQU0sQ0FBQ0wsR0FBTUcsQ0FBSSxJQUFJLEtBQUtELEdBQVcxRyxDQUFJLEdBQ25DeUcsSUFBUSxLQUFLRixHQUFhQyxDQUFJO0FBQ3BDLFFBQUksQ0FBQ0MsS0FBU0UsS0FBUSxRQUFRLE9BQU9BLEtBQVMsWUFBWSxPQUFPQSxLQUFTLFdBQVksUUFBT0UsSUFBVSxDQUFDTCxHQUFNRyxDQUFJLENBQUM7QUFDbkgsUUFBSUYsRUFBTSxJQUFJRSxDQUFJLEVBQUcsUUFBT0YsRUFBTSxJQUFJRSxDQUFJO0FBQzFDLFVBQU01USxJQUFROFEsRUFBUSxDQUFDTCxHQUFNRyxDQUFJLENBQUM7QUFDbEMsV0FBQUYsRUFBTSxJQUFJRSxHQUFNNVEsQ0FBSyxHQUNkQTtBQUFBLEVBQ1I7QUFDRCxHQUNJK1EsS0FBcUIsSUFBSVQsR0FBYztBQUMzQyxTQUFTVSxHQUFTakssR0FBSWxJLEdBQUlnQixJQUFVLENBQUMsR0FBRyxHQUFHO0FBRTFDLE1BREksQ0FBQ2tILEtBQ0QsT0FBT0EsS0FBTyxZQUFZLE9BQU9BLEtBQU8sV0FBWTtBQUN4RCxNQUFJZ0ssR0FBbUIsSUFBSSxDQUFDaEssR0FBSWxJLENBQUUsQ0FBQyxFQUFHLFFBQU9rUyxHQUFtQixJQUFJLENBQUNoSyxHQUFJbEksQ0FBRSxDQUFDO0FBQzVFLFFBQU1vUyxJQUFPLENBQUNqUixHQUFPMkIsR0FBTStJLEdBQUt6RyxNQUFZO0FBQzNDLFFBQUl0QyxLQUFRLFNBQVM7QUFDcEIsWUFBTXVQLEtBQVd4RyxHQUFLLFNBQVNBLElBQU0sVUFBVSxHQUN6Q3lHLElBQVFwSyxHQUFJLFNBQVMvRyxHQUFPLFNBQVNBO0FBQzNDLFVBQUlrUixFQUFTLFlBQVcsQ0FBQzNQLEdBQUtwQixDQUFJLEtBQUsrUSxHQUFTO0FBQy9DLGNBQU1FLElBQVFqUixNQUFTdUssR0FBSyxTQUFTQSxLQUFPbkosQ0FBRyxLQUFLLE1BQzlDOFAsSUFBUUYsSUFBUTVQLENBQUc7QUFDekIsUUFBSTZQLEtBQVMsUUFBUUMsS0FBUyxPQUFNeFMsRUFBR3dTLEdBQU85UCxHQUFLLE1BQU0sS0FBSyxJQUNyRDZQLEtBQVMsUUFBUUMsS0FBUyxPQUFNeFMsRUFBRyxNQUFNMEMsR0FBSzZQLEdBQU8sUUFBUSxJQUM3RDVVLEVBQVc0VSxHQUFPQyxDQUFLLEtBQUd4UyxFQUFHd1MsR0FBTzlQLEdBQUs2UCxHQUFPLEtBQUs7QUFBQSxNQUMvRDtBQUNBLGFBQU9KLEdBQVNoUixLQUFTK0csR0FBSSxPQUFPbEksR0FBSWdCLENBQU87QUFBQSxJQUNoRDtBQUNBLFdBQU84QixLQUFRLE9BQU8sU0FBU29GLEVBQUdwRixDQUFJO0FBQUEsRUFDdkM7QUFDQSxTQUFPb1AsR0FBbUIsb0JBQW9CLENBQUNoSyxHQUFJbEksQ0FBRSxHQUFHLE1BQ25Ea0ksYUFBYyxNQUFZaUMsRUFBUyxDQUFDb0gsR0FBZ0JySixDQUFFLEdBQUcsT0FBTyxRQUFRLEdBQUdsSSxHQUFJZ0IsQ0FBTyxJQUN0RmtILGFBQWMsTUFBWWlDLEVBQVNqQyxHQUFJbEksR0FBSWdCLENBQU8sSUFDbER4RCxFQUFTMEssQ0FBRSxJQUFVaUMsRUFBU2pDLEdBQUlrSyxHQUFNcFIsQ0FBTyxJQUMvQyxNQUFNLFFBQVFrSCxDQUFFLEtBQUssRUFBRUEsR0FBSSxVQUFVLEtBQUt4SyxFQUFVd0ssSUFBSyxDQUFDLENBQUMsS0FBS21HLEVBQWFuRyxJQUFLLENBQUMsQ0FBQyxLQUFXaUMsRUFBUyxDQUFDakMsR0FBSSxPQUFPLFFBQVEsR0FBR2xJLEdBQUlnQixDQUFPLElBQ3ZJbUosRUFBU2pDLEdBQUlsSSxHQUFJZ0IsQ0FBTyxDQUMvQjtBQUNGO0FBQ0EsU0FBUzJDLEdBQVd1RSxHQUFJbEksR0FBSTtBQUMzQixTQUFPRCxHQUFZbUksR0FBSSxDQUFDaEosTUFBVztBQUNsQyxVQUFNdVQsSUFBUyxNQUFNLFFBQVF2VCxDQUFNLEtBQUtBLEdBQVEsVUFBVSxLQUFLLENBQUMsVUFBVSxVQUFVLEVBQUUsUUFBUSxPQUFPQSxJQUFTLENBQUMsQ0FBQyxLQUFLLEtBQUt4QixFQUFVd0IsSUFBUyxDQUFDLENBQUMsR0FDekkwQixJQUFPNlIsSUFBU3ZULElBQVMsQ0FBQyxJQUFJO0FBQ3BDLElBQUFBLElBQVN1VCxLQUFVN1IsS0FBUSxPQUFPMUIsSUFBUyxDQUFDLEtBQUtBLElBQVNBO0FBQzFELFVBQU1DLElBQVMsT0FBT0QsS0FBVSxZQUFZLE9BQU9BLEtBQVUsYUFBYUEsSUFBU2QsQ0FBWSxLQUFLYyxJQUFTQTtBQUM3RyxLQUFDQSxJQUFTWixFQUFhLEtBQUt3RixFQUFrQixJQUFJM0UsQ0FBTSxJQUFJLGFBQWFhLEdBQUlZLENBQUk7QUFBQSxFQUNsRixDQUFDO0FBQ0Y7QUFDQSxJQUFJOFIsS0FBUyxDQUFDeFQsR0FBUW9RLEdBQVVxRCxPQUMvQnhJLEVBQVNtRixHQUFVLE1BQU0sQ0FBQ3RILEdBQUc0SyxNQUFNO0FBQ2xDLEVBQUE5VSxHQUFhb0IsR0FBUThJLEdBQUc0SyxHQUFHLEVBQUk7QUFDaEMsQ0FBQyxHQUNERCxJQUFRLE1BQU16VCxHQUFRLENBQUMyVCxNQUFNO0FBQzVCLGFBQVdDLEtBQUtELEVBQUcsQ0FBQS9VLEdBQWF3UixHQUFVdUQsRUFBRUMsQ0FBQyxHQUFHQSxHQUFHLEVBQUk7QUFDeEQsR0FBRyxFQUFFLE1BQU0sR0FBSyxDQUFDLEdBQ1Y1VCxJQUVKNlQsS0FBVyxDQUFDQyxHQUFNQyxHQUFTTixNQUFVRCxHQUFPTyxFQUFRaFUsR0FBSytULENBQUksQ0FBQyxHQUFHQSxHQUFNTCxDQUFLLEdBQzVFTyxLQUFZLENBQUNoVSxHQUFRb1EsR0FBVXpHLElBQU0sTUFBTSxPQUFPc0IsRUFBU21GLEdBQVUsTUFBTSxDQUFDbk8sR0FBT3lSLE1BQU07QUFDNUYsRUFBSUEsS0FBSy9KLEVBQUksS0FBRy9LLEdBQWFvQixHQUFRaUMsR0FBTyxNQUFNLEVBQUk7QUFDdkQsQ0FBQyxHQUlHZ1MsS0FBbUIsQ0FBQ0MsSUFBVyxDQUFDLE1BQU07QUFDekMsUUFBTXJTLElBQVMwTSxFQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FDN0I0RixJQUFnQixDQUFDQyxNQUNsQixPQUFPQSxLQUFhLGFBQW1CQSxFQUFVLElBQzlDOVYsRUFBUzhWLENBQVMsSUFBSUEsRUFBVSxRQUFRQSxHQUcxQzVMLElBQVM2TCxHQUFTLENBQUN4UyxHQUFRLE9BQU8sR0FEdkIsTUFBTXFTLEVBQVMsVUFBVSxDQUFDRSxNQUFjLENBQUMsQ0FBQ0QsRUFBY0MsQ0FBUyxDQUFDLEdBQzlCLE9BQU8sR0FDdERFLElBQWEsTUFBTTtBQUN4QixJQUFBelMsRUFBTztBQUFBLEVBQ1IsR0FDTW9RLElBQVksQ0FBQztBQUNuQixFQUFJOUMsRUFBYStFLENBQVEsS0FBR2pDLEVBQVUsS0FBS2hILEVBQVNpSixHQUFVSSxHQUFZO0FBQUEsSUFDekUsYUFBYTtBQUFBLE1BQ1o7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Q7QUFBQSxJQUNBLG9CQUFvQjtBQUFBLEVBQ3JCLENBQUMsQ0FBQztBQUNGLGFBQVdGLEtBQWFGLEVBQVUsQ0FBSTVWLEVBQVM4VixDQUFTLEtBQUduQyxFQUFVLEtBQUtoSCxFQUFTLENBQUNtSixHQUFXLE9BQU8sR0FBR0UsR0FBWTtBQUFBLElBQ3BILGFBQWEsQ0FBQyxRQUFRO0FBQUEsSUFDdEIsb0JBQW9CO0FBQUEsRUFDckIsQ0FBQyxDQUFDO0FBQ0YsU0FBQXBULEVBQWVzSCxHQUFRLE9BQU8sU0FBUyxNQUFNeUosRUFBVSxRQUFRLENBQUNDLE1BQVlBLElBQVUsQ0FBQyxDQUFDLEdBQ2pGMUo7QUFDUixHQUNJK0wsS0FBaUIsQ0FBQ0MsR0FBTUMsR0FBUUMsR0FBU3RHLE1BQWE7QUFDekQsTUFBSTFQLEVBQVk4VixDQUFJLEVBQUcsUUFBT0EsSUFBT0MsSUFBU0M7QUFDOUMsUUFBTUMsSUFBVSxNQUNSRixHQUVGRyxJQUFXLE1BQ1RGLEdBRUZHLElBQVUsQ0FBQ0MsT0FDWkEsS0FBSyxTQUFNTixFQUFLLFFBQVFsVyxFQUFTd1csQ0FBQyxJQUFJQSxHQUFHLFFBQVFBLEtBQzdDeFcsRUFBU2tXLENBQUksSUFBSUEsR0FBTSxRQUFRQSxLQUFRRyxFQUFRLElBQUlDLEVBQVMsSUFFL0RsUSxJQUFJNkosRUFBUTtBQUFBLElBQ2pCLENBQUN0UCxDQUFNLEdBQUc0VixFQUFRO0FBQUEsSUFDbEIsQ0FBQ3hWLENBQVMsR0FBRytPO0FBQUEsSUFDYixDQUFDLFFBQVEsV0FBVyxJQUFJO0FBQ3ZCLGFBQU8sT0FBT3lHLEVBQVEsS0FBSyxLQUFLNVYsQ0FBTSxLQUFLLEVBQUUsS0FBSztBQUFBLElBQ25EO0FBQUEsSUFDQSxDQUFDLFFBQVEsV0FBVyxFQUFFZ08sR0FBTTtBQUMzQixhQUFPak8sRUFBZTZWLEVBQVEsS0FBSyxLQUFLNVYsQ0FBTSxHQUFHZ08sQ0FBSTtBQUFBLElBQ3REO0FBQUEsSUFDQSxJQUFJLE1BQU1uRSxHQUFHO0FBQ1osV0FBSzdKLENBQU0sSUFBSTRWLEVBQVEvTCxDQUFDO0FBQUEsSUFDekI7QUFBQSxJQUNBLElBQUksUUFBUTtBQUNYLGFBQU8sS0FBSzdKLENBQU0sSUFBSTRWLEVBQVEsS0FBSyxLQUFLNVYsQ0FBTTtBQUFBLElBQy9DO0FBQUEsRUFDRCxDQUFDLEdBQ0txUSxJQUFNckUsRUFBUyxDQUFDdUosR0FBTSxPQUFPLEdBQUcsTUFBTTtBQUMzQyxVQUFNMU0sSUFBV3BELElBQUl6RixDQUFNLEdBQ3JCZ0QsSUFBUTRTLEVBQVE7QUFDdEIsSUFBQW5RLEVBQUV6RixDQUFNLElBQUlnRCxHQUNaeUMsSUFBSWhGLENBQVEsSUFBSTtBQUFBLE1BQ2YsS0FBSztBQUFBLE1BQ0wsT0FBQXVDO0FBQUEsTUFDQSxVQUFBNkY7QUFBQSxNQUNBLFNBQVM7QUFBQSxJQUNWLENBQUM7QUFBQSxFQUNGLENBQUM7QUFDRCxTQUFBNUcsRUFBZXdELEdBQUcsT0FBTyxTQUFTNEssQ0FBRyxHQUM5QjVLO0FBQ1IsR0FDSXFRLEtBQWNSLElBQ2RTLEtBQVEsQ0FBQ0MsR0FBS25VLEdBQUlvVSxNQUFTO0FBQzlCLEVBQUtBLE1BQU1BLElBQU8zRyxFQUFRLENBQUMsQ0FBQztBQUM1QixRQUFNZSxJQUFNckUsRUFBU2dLLEdBQUssQ0FBQ2hULEdBQU9QLEdBQU1pTCxNQUFRO0FBQy9DLFFBQUlqTCxLQUFRLEtBQU07QUFDbEIsVUFBTTJILElBQU12SSxJQUFLbUIsR0FBT1AsR0FBTWlMLENBQUc7QUFDakMsSUFBSSxPQUFPdEQsS0FBTyxXQUFVeEssR0FBcUJxVyxHQUFNN0wsQ0FBRyxJQUNqRDVLLEVBQVd5VyxFQUFLeFQsQ0FBSSxHQUFHMkgsQ0FBRyxNQUFHNkwsRUFBS3hULENBQUksSUFBSTJIO0FBQUEsRUFDcEQsQ0FBQztBQUNELFNBQUk2TCxLQUFNaFUsRUFBZWdVLEdBQU0sT0FBTyxTQUFTNUYsQ0FBRyxHQUMzQzRGO0FBQ1IsR0FDSUMsS0FBVSxJQUFJQyxNQUFTO0FBQzFCLFFBQU1GLElBQU8zRyxFQUFRLENBQUMsQ0FBQztBQUN2QixTQUFBNkcsR0FBTSxVQUFVLENBQUNILE1BQVFoSyxFQUFTZ0ssR0FBSyxDQUFDaFQsR0FBT1AsR0FBTTBCLE1BQU07QUFDMUQsSUFBSTFCLEtBQVEsUUFDUmpELEVBQVd5VyxFQUFLeFQsQ0FBSSxHQUFHTyxDQUFLLE1BQUdpVCxFQUFLeFQsQ0FBSSxJQUFJTztBQUFBLEVBQ2pELENBQUMsQ0FBQyxHQUNLaVQ7QUFDUixHQUNJN0MsS0FBa0IsQ0FBQ3BFLE1BQVE7QUFDOUIsUUFBTXZCLElBQU02QixFQUFRLENBQUMsQ0FBQztBQUN0QixTQUFBN0IsRUFBSSxLQUFLLEdBQUcsTUFBTSxLQUFLdUIsR0FBSyxTQUFTLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FDN0MvTSxFQUFld0wsR0FBSyxPQUFPLFNBQVN6QixFQUFTZ0QsR0FBSyxDQUFDaE0sR0FBT21CLEdBQUd1SixNQUFRO0FBQ3BFLFFBQUlsTyxFQUFXd0QsR0FBTzBLLENBQUc7QUFDeEIsVUFBSUEsS0FBTyxRQUFRMUssS0FBUyxLQUFNLENBQUF5SyxFQUFJLEtBQUt6SyxDQUFLO0FBQUEsZUFDdkMwSyxLQUFPLFFBQVExSyxLQUFTLE1BQU07QUFDdEMsY0FBTXVCLElBQU1rSixFQUFJLFFBQVFDLENBQUc7QUFDM0IsUUFBSW5KLEtBQU8sS0FBR2tKLEVBQUksT0FBT2xKLEdBQUssQ0FBQztBQUFBLE1BQ2hDLE9BQU87QUFDTixjQUFNQSxJQUFNa0osRUFBSSxRQUFRQyxDQUFHO0FBQzNCLFFBQUluSixLQUFPLEtBQUsvRSxFQUFXaU8sRUFBSWxKLENBQUcsR0FBR3ZCLENBQUssTUFBR3lLLEVBQUlsSixDQUFHLElBQUl2QjtBQUFBLE1BQ3pEO0FBQUEsRUFFRixDQUFDLENBQUMsR0FDS3lLO0FBQ1IsR0FDSTRGLEtBQWtCLENBQUN2RSxNQUFRO0FBQzlCLFFBQU1yQixJQUFNNkIsRUFBUSxDQUFDLENBQUMsR0FDaEI4RyxJQUFpQixNQUFNLEtBQUt0SCxFQUFJLFFBQVEsQ0FBQztBQUMvQyxTQUFBckIsRUFBSSxLQUFLLEdBQUcySSxDQUFjLEdBQzFCblUsRUFBZXdMLEdBQUssT0FBTyxTQUFTekIsRUFBUzhDLEdBQUssQ0FBQzlMLEdBQU9QLEdBQU1pTCxNQUFRO0FBQ3ZFLFFBQUlsTyxFQUFXd0QsR0FBTzBLLENBQUcsS0FBS0EsS0FBTyxRQUFRMUssS0FBUyxRQUFRMEssS0FBTyxRQUFRMUssS0FBUztBQUNyRixVQUFJMEssS0FBTyxRQUFRMUssS0FBUyxNQUFNO0FBQ2pDLFlBQUl1QixJQUFNa0osRUFBSSxVQUFVLENBQUMsQ0FBQzlJLEdBQU1SLENBQUMsTUFBTVEsS0FBUWxDLENBQUk7QUFDbkQsUUFBSThCLElBQU0sTUFBR0EsSUFBTWtKLEVBQUksY0FBYyxDQUFDLENBQUN0SixHQUFHeEMsQ0FBRyxNQUFNK0wsTUFBUS9MLENBQUcsSUFDMUQ0QyxLQUFPLEtBQUdrSixFQUFJLE9BQU9sSixHQUFLLENBQUM7QUFBQSxNQUNoQyxPQUFPO0FBQ04sWUFBSUEsSUFBTWtKLEVBQUksVUFBVSxDQUFDLENBQUM5SSxHQUFNUixDQUFDLE1BQU1RLEtBQVFsQyxDQUFJO0FBQ25ELFFBQUk4QixLQUFPLEtBQUtBLElBQU1rSixFQUFJLFNBQ3JCak8sRUFBV2lPLEVBQUlsSixDQUFHLElBQUksQ0FBQyxHQUFHdkIsQ0FBSyxNQUFHeUssRUFBSWxKLENBQUcsSUFBSSxDQUFDOUIsR0FBTU8sQ0FBSyxLQUN2RHlLLEVBQUksS0FBSyxDQUFDaEwsR0FBTU8sQ0FBSyxDQUFDO0FBQUEsTUFDOUI7QUFBQSxFQUVGLENBQUMsQ0FBQyxHQUNLeUs7QUFDUixHQUNJNEksSUFBNEIsb0JBQUksUUFBUSxHQUN4Q0MsS0FBUyxDQUFDQyxHQUFHQyxHQUFHL1QsSUFBTyxZQUFZO0FBQ3RDLFFBQU1nVSxJQUFhLE9BQU9GLElBQUksQ0FBQyxLQUFLLGNBQWNBLEdBQUcsVUFBVSxHQUFHRyxJQUFhLE9BQU9GLElBQUksQ0FBQyxLQUFLLGNBQWNBLEdBQUcsVUFBVSxHQUFHRyxJQUFVRCxJQUFhRixJQUFJLENBQUMsSUFBSSxNQUN4SkksS0FBV3JYLEVBQVVnWCxJQUFJLENBQUMsQ0FBQyxLQUFLQSxJQUFJLENBQUMsS0FBSyxPQUFPLGFBQWFBLEdBQUcsVUFBVTtBQUNqRixNQUFJTSxJQUFTRCxLQUFXLENBQUNILElBQWFGLElBQUksQ0FBQyxJQUFJLE1BQU0sUUFBUUEsQ0FBQyxJQUFJLE9BQU85VDtBQUN6RSxFQUFJLENBQUNtVSxLQUFXLENBQUNILE1BQVlGLElBQUksQ0FBQ0EsR0FBR00sQ0FBTSxJQUN2Q0osTUFBWUYsRUFBRSxDQUFDLElBQUlNO0FBQ3ZCLFFBQU1DLEtBQVd2WCxFQUFVaVgsSUFBSSxDQUFDLENBQUMsS0FBS0EsSUFBSSxDQUFDLEtBQUssT0FBTyxhQUFhQSxHQUFHLFVBQVU7QUFDakYsTUFBSU8sSUFBU0QsS0FBVyxDQUFDSixJQUFhRixJQUFJLENBQUMsSUFBSSxNQUFNLFFBQVFBLENBQUMsSUFBSSxPQUFPL1Q7QUFHekUsTUFGSSxDQUFDcVUsS0FBVyxDQUFDSixNQUFZRixJQUFJLENBQUNBLEdBQUdPLENBQU0sSUFDdkNMLE1BQVlGLEVBQUUsQ0FBQyxJQUFJTyxJQUNuQkYsS0FBVSxRQUFRRSxLQUFVLFFBQVF6WCxFQUFrQnVYLEdBQVFOLElBQUksQ0FBQyxDQUFDLEtBQUtqWCxFQUFrQnlYLEdBQVFQLElBQUksQ0FBQyxDQUFDLEVBQUc7QUFDaEgsTUFBSSxHQUFHLE9BQU9BLElBQUksQ0FBQyxLQUFLLFlBQVksT0FBT0EsSUFBSSxDQUFDLEtBQUssZUFBZUEsSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLE1BQU0sUUFBUUQsRUFBRSxDQUFDLENBQUM7QUFDekcsV0FBQTFYLEdBQWMyWCxHQUFHLE1BQU07QUFDdEIsTUFBQUQsRUFBRSxDQUFDLEVBQUVNLENBQU0sSUFBSUwsSUFBSSxDQUFDO0FBQUEsSUFDckIsQ0FBQyxHQUNNLE1BQU07QUFBQSxJQUFDO0FBRWYsUUFBTTFDLElBQVUsQ0FBQ2pLLEdBQUc0SyxNQUFNO0FBQ3pCLFVBQU11QyxJQUFRQyxHQUFNLFFBQVEsR0FDdEJDLElBQVFDLEdBQU0sUUFBUTtBQUM1QixRQUFJZCxHQUFXLE1BQU1XLENBQUssR0FBRyxNQUFNSCxDQUFNLEdBQUcsU0FBU0ssR0FBTztBQUMzRCxVQUFJdlYsS0FBTTtBQUNWLFlBQU15VixLQUFRZixHQUFXLE1BQU1XLENBQUssR0FBRyxNQUFNSCxDQUFNLEdBQUc7QUFDdEQsTUFBQWhZLEdBQWNxWSxHQUFPLE1BQU07QUFDMUIsUUFBSSxPQUFPRSxNQUFTLGFBQVl6VixLQUFNeVYsS0FBUXRZLEdBQVVvWSxDQUFLLEtBQUtyTixHQUFHNEssR0FBRyxJQUFJLElBQ3ZFOVMsS0FBTXVWLElBQVF6QyxDQUFDLEtBQUs1SztBQUFBLE1BQzFCLENBQUM7QUFDRCxZQUFNd04sS0FBS3ZZLEdBQVU2QyxFQUFHO0FBQ3hCLE1BQUluQyxFQUFXd1gsRUFBTUgsQ0FBTSxHQUFHUSxFQUFFLEtBQUd4WSxHQUFjcVksR0FBTyxNQUFNO0FBQzdELFFBQUFGLEVBQU1ILENBQU0sSUFBSVE7QUFBQSxNQUNqQixDQUFDO0FBQUEsSUFDRixNQUFPLENBQUVoQixHQUFXLE1BQU1XLENBQUssR0FBSSxNQUFNSCxDQUFNLEdBQUksVUFBVTtBQUFBLEVBQzlELEdBQ001RCxJQUFVLE1BQU07QUFDckIsVUFBTStELElBQVFDLEdBQU0sUUFBUSxHQUN0Qm5JLElBQU11SCxHQUFXLE1BQU1XLENBQUssR0FDNUJNLElBQVF4SSxHQUFLLE1BQU0rSCxDQUFNO0FBQy9CLElBQUEvSCxHQUFLLFNBQVMrSCxDQUFNLEdBQ3BCUyxHQUFPLFFBQVE7QUFBQSxFQUNoQixHQUNNSCxJQUFPWCxJQUFJLENBQUMsS0FBSyxTQUFTLE9BQU9BLElBQUksQ0FBQyxLQUFLLFlBQVksT0FBT0EsSUFBSSxDQUFDLEtBQUssZUFBZSxFQUFFQSxJQUFJLENBQUMsYUFBYSxXQUFXLE9BQU9BLElBQUksQ0FBQyxHQUFHLFNBQVMsY0FBYyxJQUFJLFFBQVFBLElBQUksQ0FBQyxDQUFDLElBQUlBLElBQUksQ0FBQyxHQUFHUyxJQUFPVixJQUFJLENBQUMsS0FBSyxTQUFTLE9BQU9BLElBQUksQ0FBQyxLQUFLLFlBQVksT0FBT0EsSUFBSSxDQUFDLEtBQUssZUFBZSxFQUFFQSxJQUFJLENBQUMsYUFBYSxXQUFXLE9BQU9BLElBQUksQ0FBQyxHQUFHLFNBQVMsY0FBYyxJQUFJLFFBQVFBLElBQUksQ0FBQyxDQUFDLElBQUlBLElBQUksQ0FBQztBQUN2WCxNQUFJZSxJQUFRO0FBQUEsSUFDWCxTQUFBeEQ7QUFBQSxJQUNBLFNBQUFiO0FBQUEsSUFDQSxPQUFPMEQ7QUFBQSxFQUNSO0FBQ0EsUUFBTUssSUFBUUMsR0FBTSxRQUFRLEdBQUdDLElBQVFDLEdBQU0sUUFBUTtBQUNyRCxTQUFJRixhQUFnQixZQUNmWixHQUFXLE1BQU1XLENBQUssR0FBRyxNQUFNSCxDQUFNLEdBQUcsU0FBU0ssS0FBT2IsR0FBVyxNQUFNVyxDQUFLLEdBQUcsU0FBU0gsQ0FBTSxHQUNwR1MsSUFBU2pCLEdBQVcsY0FBY1csR0FBdUIsb0JBQUksSUFBSSxDQUFDLEdBQUksc0JBQXNCSCxHQUFRLE9BQU87QUFBQSxJQUMxRyxPQUFPSztBQUFBLElBQ1AsT0FBT1A7QUFBQSxJQUNQLE9BQU87QUFBQSxJQUNQLFNBQUE3QztBQUFBLElBQ0EsU0FBQWI7QUFBQSxFQUNELEVBQUUsR0FDRnFFLEVBQU0sUUFBUXRMLEVBQVN3SyxHQUFHMUMsQ0FBTyxHQUNqQ3dELEVBQU0sUUFBUVgsR0FDZDFVLEVBQWUrVSxHQUFPLE9BQU8sU0FBU00sR0FBTyxPQUFPLEdBQ3BEclYsRUFBZWlWLEdBQU8sT0FBTyxTQUFTSSxHQUFPLE9BQU8sSUFFakRKLEtBQVMsQ0FBQyxNQUFNLFFBQVFBLENBQUssS0FBR3JZLEdBQWNtWSxHQUFPLE1BQU07QUFDOUQsSUFBQUUsRUFBTUgsQ0FBTSxNQUFNQyxJQUFRSCxDQUFNLEtBQUtLLEVBQU1ILENBQU07QUFBQSxFQUNsRCxDQUFDLEdBQ01PLEdBQU87QUFDZixHQUNJQyxLQUFPLENBQUNoQixHQUFHQyxHQUFHL1QsSUFBTyxZQUFZO0FBQ3BDLFFBQU15SixJQUFPLENBQUNvSyxHQUFPQyxHQUFHQyxHQUFHL1QsQ0FBSSxHQUFHNlQsR0FBT0UsR0FBR0QsR0FBRzlULENBQUksQ0FBQztBQUNwRCxTQUFPLE1BQU15SixHQUFNLE1BQU0sQ0FBQ3NMLE1BQU1BLElBQUksQ0FBQztBQUN0QyxHQUNJcEMsS0FBVyxDQUFDeEYsR0FBSy9OLEdBQUlzTixHQUFVMU0sSUFBTyxZQUFZO0FBQ3JELFFBQU1nVSxJQUFhLE9BQU83RyxJQUFNLENBQUMsS0FBSyxjQUFjQSxHQUFLLFVBQVUsR0FDN0RnSCxLQUFXclgsRUFBVXFRLElBQU0sQ0FBQyxDQUFDLEtBQUtBLElBQU0sQ0FBQyxLQUFLLE9BQU8sYUFBYUEsR0FBSyxVQUFVO0FBQ3ZGLE1BQUlpSCxJQUFTRCxLQUFXLENBQUNILElBQWE3RyxJQUFNLENBQUMsSUFBSSxNQUFNLFFBQVFBLENBQUcsSUFBSSxPQUFPbk47QUFHN0UsTUFGSSxDQUFDbVUsS0FBVyxDQUFDSCxNQUFZN0csSUFBTSxDQUFDZ0gsSUFBVWhILElBQU0sQ0FBQyxJQUFJQSxHQUFLaUgsQ0FBTSxJQUNoRUosTUFBWTdHLEVBQUksQ0FBQyxJQUFJaUgsSUFDckJBLEtBQVUsUUFBUXZYLEVBQWtCdVgsR0FBUWpILElBQU0sQ0FBQyxDQUFDLEVBQUc7QUFDM0QsUUFBTTZILElBQU0sQ0FBQzVOLE1BQU07QUFDbEIsUUFBSWhCO0FBQ0osV0FBSWdCLEtBQUssU0FDUmhCLElBQVcrRyxFQUFJLENBQUMsRUFBRWlILENBQU0sR0FDeEJqSCxFQUFJLENBQUMsRUFBRWlILENBQU0sSUFBSWhOLElBRVhoSSxJQUFLK04sSUFBTSxDQUFDLElBQUlpSCxDQUFNLEdBQUdBLEdBQVFoTyxDQUFRO0FBQUEsRUFDakQsR0FDTXFHLElBQVV1SSxFQUFJLEdBQ2RDLElBQUtwSSxFQUFRO0FBQUEsSUFDbEIsQ0FBQ2pQLEVBQVEsR0FBRztBQUFBLElBQ1osQ0FBQ0wsQ0FBTSxHQUFHa1A7QUFBQSxJQUNWLENBQUM5TyxDQUFTLEdBQUcrTztBQUFBLElBQ2IsQ0FBQyxRQUFRLFdBQVcsSUFBSTtBQUN2QixhQUFPLE9BQU9zSSxFQUFJLEtBQUssS0FBS3pYLENBQU0sS0FBSyxFQUFFLEtBQUs7QUFBQSxJQUMvQztBQUFBLElBQ0EsQ0FBQyxRQUFRLFdBQVcsRUFBRWdPLEdBQU07QUFDM0IsYUFBT2pPLEVBQWUwWCxFQUFJLEtBQUssS0FBS3pYLENBQU0sR0FBR2dPLENBQUk7QUFBQSxJQUNsRDtBQUFBLElBQ0EsSUFBSSxNQUFNbkUsR0FBRztBQUNaLFdBQUs3SixDQUFNLElBQUl5WCxFQUFJNU4sQ0FBQztBQUFBLElBQ3JCO0FBQUEsSUFDQSxJQUFJLFFBQVE7QUFDWCxhQUFPLEtBQUs3SixDQUFNLElBQUl5WCxFQUFJLEtBQUssS0FBS3pYLENBQU07QUFBQSxJQUMzQztBQUFBLEVBQ0QsQ0FBQyxHQUNLcVEsSUFBTXJFLEVBQVMsQ0FBQzRELElBQU0sQ0FBQyxLQUFLQSxHQUFLaUgsS0FBVSxPQUFPLEdBQUcsTUFBTTtBQUNoRSxVQUFNaE8sSUFBVzZPLElBQUsxWCxDQUFNLEdBQ3RCZ0QsSUFBUXlVLEVBQUk7QUFDbEIsSUFBQUMsRUFBRzFYLENBQU0sSUFBSWdELEdBQ2IwVSxJQUFLalgsQ0FBUSxJQUFJO0FBQUEsTUFDaEIsS0FBSztBQUFBLE1BQ0wsT0FBQXVDO0FBQUEsTUFDQSxVQUFBNkY7QUFBQSxNQUNBLFNBQVM7QUFBQSxJQUNWLENBQUM7QUFBQSxFQUNGLENBQUM7QUFDRCxTQUFBNUcsRUFBZXlWLEdBQUksT0FBTyxTQUFTckgsQ0FBRyxHQUMvQnFIO0FBQ1IsR0FDSUMsS0FBbUIsQ0FBQ2xILEdBQUs1TyxHQUFJZ1AsSUFBUSxRQUFRO0FBQ2hELE1BQUlHO0FBQ0osU0FBT2hGLEVBQVN5RSxHQUFLLFNBQVMsQ0FBQzVHLE1BQU07QUFDcEMsSUFBSSxDQUFDQSxLQUFLbUgsS0FDVCxhQUFhQSxDQUFFLEdBQ2ZBLElBQUssUUFDS25ILEtBQUssQ0FBQ21ILE1BQUlBLElBQUtKLEdBQWlCSCxHQUFLNU8sR0FBSWdQLENBQUssS0FBS0c7QUFBQSxFQUMvRCxDQUFDO0FBQ0Y7IiwKICAibmFtZXMiOiBbIiRhdm9pZFRyaWdnZXIiLCAiJGdldFZhbHVlIiwgIiR0cmlnZ2VyTG9jayQxIiwgIlByb21pc2VkIiwgImJpbmRDdHgiLCAiY2FsbEJ5QWxsUHJvcCIsICJjYWxsQnlQcm9wIiwgImRlZmF1bHRCeVR5cGUiLCAiaGFzVmFsdWUiLCAiaXNBcnJheUludmFsaWRLZXkiLCAiaXNLZXlUeXBlIiwgImlzTm90RXF1YWwiLCAiaXNQcmltaXRpdmUiLCAibWFrZVRyaWdnZXJMZXNzIiwgIm9iamVjdEFzc2lnbiIsICJvYmplY3RBc3NpZ25Ob3RFcXVhbCIsICJwb3RlbnRpYWxseUFzeW5jIiwgInBvdGVudGlhbGx5QXN5bmNNYXAiLCAidHJ5UGFyc2VCeUhpbnQiLCAiJHZhbHVlIiwgIiRleHRyYWN0S2V5JCIsICIkb3JpZ2luYWxLZXkkIiwgIiRyZWdpc3RyeUtleSQiLCAiJGJlaGF2aW9yIiwgIiRwcm9taXNlIiwgIiR0cmlnZ2VyTGVzcyIsICIkdHJpZ2dlckxvY2siLCAiJHRyaWdnZXJDb250cm9sIiwgIiR0cmlnZ2VyIiwgIiRhZmZlY3RlZCIsICIkaXNOb3RFcXVhbCIsICIkcmVhbFByb3AiLCAiJG9yaWdpbmFsT2JqZWN0cyQiLCAic2FmZSIsICJ0YXJnZXQiLCAidW53cmFwIiwgIm1hcHBlZCIsICJlIiwgIksiLCAiViIsICJhcnIiLCAiZGVyZWYiLCAiZGlzY291bnRWYWx1ZSIsICJvcmlnaW5hbCIsICIkdmFsIiwgImlzVGhlbmFibGUiLCAidmFsIiwgIndpdGhQcm9taXNlIiwgImNiIiwgImRpc3Bvc2VNYXAiLCAiZGlzcG9zZVJlZ2lzdHJ5IiwgImNhbGxzdGFjayIsICJhZGRUb0NhbGxDaGFpbiIsICJvYmoiLCAibWV0aG9kS2V5IiwgImNhbGxiYWNrIiwgImNoYWluVGFyZ2V0IiwgIkNhbGxDaGFpbiIsICJhcmdzIiwgImlzQXJyYXlJbmRleCIsICJwcm9wIiwgIm51bSIsICJ3cmFwU2V0QXNBcnJheSIsICJzb3VyY2UiLCAib3B0aW9ucyIsICJiYWNraW5nU2V0IiwgIm5vdGlmeUR1cGxpY2F0ZSIsICJ2YWx1ZSIsICJ2aWEiLCAiaW5kZXgiLCAiaXRlbSIsICJzbmFwc2hvdCIsICJyZWJ1aWxkRnJvbSIsICJtZXRob2RzIiwgIml0ZW1zIiwgInNpemUiLCAiaXRlcmF0b3IiLCAiY3VycmVudCIsICJ0b1ByZXBlbmQiLCAibmV4dCIsICJzdGFydCIsICJkZWxldGVDb3VudCIsICJub3JtYWxpemVkU3RhcnQiLCAiYWN0dWFsRGVsZXRlQ291bnQiLCAicmVtb3ZlZCIsICJpbnNlcnRQb3NpdGlvbiIsICJfIiwgIm5leHRMZW5ndGgiLCAibmV4dFZhbHVlIiwgImN1cnJlbnRWYWx1ZSIsICJpZHgiLCAia2V5cyIsICJpIiwgIkFzc2lnbk9iamVjdEhhbmRsZXIiLCAibmFtZSIsICJuZXdUIiwgImN0eCIsICJtYWtlT2JqZWN0QXNzaWduYWJsZSIsICJweCIsICJ3aXRoVW5zdWJTeW1ib2wiLCAid2l0aFVuc3ViIiwgImNvbXBsZXRlV2l0aFVuc3ViIiwgInN1YnNjcmliZXIiLCAid2VhayIsICJoYW5kbGVyIiwgInJlZ2lzdHJ5IiwgInNhdkNvbXBsZXRlIiwgInVuYWZmZWN0ZWQiLCAiciIsICJzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbCIsICJzdWJzY3JpcHRSZWdpc3RyeSIsICJnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2wiLCAiZ2xvYmFsRWZmZWN0TGlzdGVuZXJzIiwgImVmZmVjdEdsb2JhbGx5IiwgIm5vcm1hbGl6ZWQiLCAibm9ybWFsaXplRWZmZWN0T3B0aW9ucyIsICJ3cmFwcGVkU3ltYm9sIiwgIndyYXBwZWQiLCAicmVnaXN0ZXIiLCAid2hhdCIsICJoYW5kbGUiLCAiU3Vic2NyaXB0IiwgIndyYXBXaXRoIiwgImZvckFsbCIsICJ3aWxkY2FyZFRyaWdnZXJzIiwgInRyaWdnZXJBbGlhc2VzIiwgInRyaWdnZXJDYW5vbmljYWxOYW1lc1N5bWJvbCIsICJjYW5vbmljYWwiLCAiYWxpYXNlcyIsICJhbGlhcyIsICJ0cmlnZ2VyQ2Fub25pY2FsTmFtZXMiLCAibm9ybWFsaXplVHJpZ2dlck5hbWUiLCAidHJpZ2dlciIsICJ0cmlnZ2VyTmFtZXNPZiIsICJleHBhbmRUcmlnZ2VyRmlsdGVyIiwgInR5cGVzIiwgIm5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIiLCAidHJpZ2dlcnMiLCAibGlzdCIsICJ0cmlnZ2VyRmlsdGVyQWxsb3dzIiwgImZpbHRlciIsICJpc09wdGlvbnNPYmplY3QiLCAibm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zIiwgImFmZmVjdFR5cGVzIiwgIlN1YnNjcmlwdFN5bWJvbCIsICIjc291cmNlIiwgIiNsaXN0ZW5lcnMiLCAiI2ZsYWdzIiwgIiNuYXRpdmUiLCAiI2l0ZXJhdG9yIiwgIiNpbkRpc3BhdGNoIiwgIiNkaXNhYmxlZFRyaWdnZXJzIiwgIiN0cmlnZ2VyQ29udHJvbCIsICIjcGVuZGluZyIsICIjcGVuZGluZ0J5UHJvcCIsICIjZmx1c2hTY2hlZHVsZWQiLCAiZW5hYmxlZCIsICIjZGlzcGF0Y2giLCAiY29udHJvbGxlciIsICJyZXMiLCAib2xkVmFsdWUiLCAiZXRjIiwgImxpc3RlbmVycyIsICJyZWNvcmQiLCAiZXZlbnQiLCAibnciLCAibmFtZXMiLCAicHJldmlvdXMiLCAicmVzdG9yZSIsICJ3YXNEaXNhYmxlZCIsICJyZXN1bHQiLCAib3BLZXkiLCAiYnlPcCIsICJiYXRjaCIsICJvcE1hcCIsICJubSIsICJ2IiwgIm92IiwgInRnIiwgInJlc3QiLCAiX19zYWZlR2V0R3VhcmRTeW1ib2wiLCAiX19zeXN0ZW1Ta2lwIiwgInN5c3RlbVNraXBHZXQiLCAiZ290IiwgInNhZmVHZXQiLCAiX19zYWZlR2V0R3VhcmQiLCAiaXNHZXR0ZXIiLCAicHJvcE5hbWUiLCAiZmFsbFRocm91Z2giLCAia2V5IiwgInRtcCIsICJzYWZlU2V0IiwgImFjdGl2ZSIsICJyZWMiLCAiaGFzT3duIiwgImlzVHJpZ2dlckVtaXRPcHRpb25zIiwgImFsbG93VmFsdWVPbmx5IiwgInRyaWdnZXJPcHRpb25WYWx1ZSIsICJmYWxsYmFjayIsICJ0cmlnZ2VyT3B0aW9uVHJpZ2dlciIsICJpc1J1bnRpbWVLZXkiLCAicmVhbFByb3BPZiQxIiwgInRyaWdnZXJLZXlPZiIsICJ0cmlnZ2VyVmFsdWVPZiIsICJyZWFsUHJvcCIsICJjcmVhdGVUcmlnZ2VyQVBJIiwgImVtaXQiLCAiYXBpIiwgIm9wT3JPcHRpb25zIiwgImNvbnRyb2wiLCAic3lzdGVtR2V0IiwgImFmZmVjdGVkIiwgIm9ic2VydmFibGVBUElNZXRob2RzIiwgInVzdWIiLCAiY29tcCIsICJPYnNlcnZlQXJyYXlNZXRob2QiLCAiI25hbWUiLCAiI3NlbGYiLCAiI2hhbmRsZSIsICJzZWxmIiwgInNraXAiLCAiYWRkZWQiLCAic2V0UGFpcnMiLCAib2xkU3RhdGUiLCAib2JzZXJ2ZUFycmF5IiwgIm5ld1ZhbHVlIiwgInJlZyIsICJJIiwgInBhaXIiLCAidHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UiLCAib2xkTGVuIiwgIm5ld0xlbiIsICJyZW1vdmVkSXRlbXMiLCAiYWRkZWRDb3VudCIsICJPYnNlcnZlQXJyYXlIYW5kbGVyIiwgInN5cyIsICJvYnMiLCAib2xkIiwgInh5enciLCAicmdiYSIsICJ4eXp3X2lkeCIsICJyZ2JhX2lkeCIsICJPYnNlcnZlT2JqZWN0SGFuZGxlciIsICJoaW50IiwgImZ0IiwgIiRvcmlnaW5hbCIsICJ0cmlnZ2VyTmFtZSIsICJkZXNjcmlwdG9yIiwgIiRyZXN1bHQiLCAiT2JzZXJ2ZU1hcEhhbmRsZXIiLCAidmFsdWVPckZ4IiwgIm9sZFZhbHVlcyIsICJoYWQiLCAiT2JzZXJ2ZVNldEhhbmRsZXIiLCAiJGlzT2JzZXJ2YWJsZSIsICJvYnNlcnZlT2JqZWN0IiwgIm9ic2VydmVNYXAiLCAibWFwIiwgIm9ic2VydmVTZXQiLCAic2V0IiwgIm51bWJlclJlZiIsICJpbml0aWFsIiwgImJlaGF2aW9yIiwgImlzUHJvbWlzZSIsICIkciIsICJvYnNlcnZlIiwgInN0cmluZ1JlZiIsICJib29sZWFuUmVmIiwgIndyYXBSZWYiLCAibWFya1JlYWxQcm9wIiwgInByb3BSZWYiLCAic3JjIiwgInNyY1Byb3AiLCAiaXNNYXAiLCAiaXNTZXQiLCAicmVhZFNsb3QiLCAid3JpdGVTbG90IiwgImlzT2JzZXJ2YWJsZSIsICJyZWNvdmVyUmVhY3RpdmUiLCAic2xvdCIsICJ1c2IiLCAiX3Byb3AiLCAiJHJlZiIsICJ0eXBlZCIsICJyZWYiLCAicHJvbWlzZWQiLCAicHJvbWlzZSIsICJ0cmlnZ2VyV2l0aERlbGF5IiwgImRlbGF5IiwgImRlbGF5ZWRCZWhhdmlvciIsICJzaWciLCAidG0iLCAiZGVsYXllZE9ySW5zdGFudEJlaGF2aW9yIiwgInN0YXRlTmFtZSIsICJyZWFjdGl2ZSIsICJ1c2VPYnNlcnZhYmxlIiwgIm9ic2VydmFibGUiLCAic3BlY2lhbGl6ZWRTdWJzY3JpYmUiLCAiY2hlY2tWYWxpZE9iaiIsICJpbml0aWFsVHJpZ2dlciIsICJyZWFsUHJvcE9mIiwgIm5vcm1hbGl6ZUFmZmVjdGVkUHJvcCIsICJwcm9wVmFsdWVPZiIsICJjYWxsQnlQcm9wUmVmQXdhcmUiLCAid2l0aFRyaWdnZXIiLCAic3Vic2NyaWJlRGlyZWN0bHkiLCAidFByb3AiLCAiaW5pdGlhbENiIiwgInVuU3ViIiwgInN1YnNjcmliZUlucHV0IiwgIiRvcHQiLCAiJGNiIiwgImV2IiwgImNoZWNrSXNQYWlyZWQiLCAiaXNFZmZlY3RPcHRpb25zQXJnIiwgIm5vcm1hbGl6ZUVmZmVjdFRhcmdldHMiLCAidGFyZ2V0cyIsICJlZmZlY3RUYXJnZXRDb250ZXh0IiwgInRvRWZmZWN0RXZlbnQiLCAic3Vic2NyaWJlUGFpcmVkIiwgInN1YnNjcmliZVRoZW5hYmxlIiwgImVmZmVjdCIsICJhZmZlY3RlZE9wdGlvbnMiLCAiZGlzcG9zZXJzIiwgImRpc3Bvc2UiLCAiZWZmZWN0ZWQiLCAibWFrZUFycmF5T2JzZXJ2YWJsZSIsICJvYnNlcnZhYmxlQnlTZXQiLCAib2JzZXJ2YWJsZUJ5TWFwIiwgIkRvdWJsZVdlYWtNYXAiLCAiI3RvcCIsICIjZW5zdXJlSW5uZXIiLCAia2V5MSIsICJpbm5lciIsICIjc3BsaXRQYWlyIiwgImtleTIiLCAiZmFjdG9yeSIsICJjb21wdXRlIiwgInJlZ2lzdGVyZWRJdGVyYXRlZCIsICJpdGVyYXRlZCIsICIkc3ViIiwgImVudHJpZXMiLCAiYmFzaXMiLCAib2ZPbGQiLCAib2ZOZXciLCAiaXNQYWlyIiwgImJpbmRCeSIsICJ3YXRjaCIsICJwIiwgIk4iLCAiayIsICJkZXJpdmF0ZSIsICJmcm9tIiwgInJlYWN0Rm4iLCAiYmluZEJ5S2V5IiwgImNvbmRpdGlvbmFsSW5kZXgiLCAiY29uZExpc3QiLCAicmVhZENvbmRpdGlvbiIsICJjb25kaXRpb24iLCAiY29tcHV0ZWQiLCAiaW52YWxpZGF0ZSIsICJjb25kaXRpb25hbFJlZiIsICJjb25kIiwgImlmVHJ1ZSIsICJpZkZhbHNlIiwgImdldFRydWUiLCAiZ2V0RmFsc2UiLCAidmFsdWVPZiIsICJuIiwgImNvbmRpdGlvbmFsIiwgInJlbWFwIiwgInN1YiIsICJkZXN0IiwgInVuaWZpZWQiLCAic3VicyIsICJpbml0aWFsRW50cmllcyIsICJhc3NpZ25NYXAiLCAiYXNzaWduIiwgImEiLCAiYiIsICJpc0FDb21wdXRlIiwgImlzQkNvbXB1dGUiLCAiY21wQkZuYyIsICJpc0FQcm9wIiwgImFfcHJvcCIsICJpc0JQcm9wIiwgImJfcHJvcCIsICJhX3RtcCIsICJhUmVmIiwgImJfdG1wIiwgImJSZWYiLCAiY21wZngiLCAibnYiLCAic3RvcmUiLCAibGluayIsICJjIiwgImNtcCIsICJyZiIsICJkZWxheWVkU3Vic2NyaWJlIl0KfQo=
