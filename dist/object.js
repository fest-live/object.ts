import { $avoidTrigger as oe, $getValue as He, $triggerLock as xe, Promised as qe, bindCtx as q, callByAllProp as nt, callByProp as gt, defaultByType as wt, hasValue as W, isArrayInvalidKey as le, isKeyType as j, isNotEqual as A, isPrimitive as T, isPromise as k, makeTriggerLess as be, objectAssign as ae, objectAssignNotEqual as At, potentiallyAsync as Ve, potentiallyAsyncMap as Ue, resolved as Re, tryParseByHint as C } from "@fest-lib/core";
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var d = /* @__PURE__ */ Symbol.for("@value"), w = /* @__PURE__ */ Symbol.for("@extract"), D = /* @__PURE__ */ Symbol.for("@origin"), ie = /* @__PURE__ */ Symbol.for("@registry"), U = /* @__PURE__ */ Symbol.for("@behavior"), V = /* @__PURE__ */ Symbol.for("@promise"), lt = /* @__PURE__ */ Symbol.for("@resolved"), Se = /* @__PURE__ */ Symbol.for("@trigger-less"), h = /* @__PURE__ */ Symbol.for("@trigger-lock"), Ot = /* @__PURE__ */ Symbol.for("@trigger-control"), $ = /* @__PURE__ */ Symbol.for("@trigger"), ue = /* @__PURE__ */ Symbol.for("@subscribe"), it = /* @__PURE__ */ Symbol.for("@isNotEqual"), de = /* @__PURE__ */ Symbol.for("@realProp"), Je = /* @__PURE__ */ new WeakMap(), ce = (e) => {
  const t = typeof e == "object" || typeof e == "function" ? e?.[w] ?? e : e, r = (n) => ce(n);
  return Array.isArray(t) ? t?.map?.(r) || Array.from(t || [])?.map?.(r) || [] : t instanceof Map || t instanceof WeakMap ? new Map(Array.from(t?.entries?.() || [])?.map?.(([n, l]) => [n, ce(l)])) : t instanceof Set || t instanceof WeakSet ? new Set(Array.from(t?.values?.() || [])?.map?.(r)) : t != null && typeof t == "function" || typeof t == "object" ? Object.fromEntries(Array.from(Object.entries(t || {}) || [])?.filter?.(([n]) => n != w && n != D && n != ie)?.map?.(([n, l]) => [n, ce(l)])) : t;
}, Tt = (e) => e?.[w] ?? e?.["@target"] ?? e, N = (e, t = !1) => {
  const r = e;
  if (T(e) || typeof e == "symbol") return e;
  if (e != null && (e instanceof WeakRef || "deref" in e && typeof e?.deref == "function") && (e = e?.deref?.()), e != null && (typeof e == "object" || typeof e == "function")) {
    e = Tt(e);
    const n = t && W(e) && e?.value;
    if (n != null && (typeof n == "object" || typeof n == "function") && (e = n), r != e) return N(e, t);
  }
  return e;
}, ye = (e) => e != null && typeof e.then == "function", xt = (e, t) => T(e) || typeof e == "function" ? t?.(e) : ye(e) ? e.then(t) : typeof e?.resolved == "function" ? Promise.resolve(e.resolved()).then(t) : e?.promise && ye(e.promise) ? e.promise.then(t) : e?.[V] && ye(e[V]) ? e[V].then(t) : t?.(e), Qe = /* @__PURE__ */ new WeakMap(), Rt = new FinalizationRegistry((e) => {
  e?.forEach?.((t) => t?.());
});
function E(e, t, r) {
  if (!(!r || typeof r != "function" || typeof e != "object" && typeof e != "function"))
    if (t == Symbol.dispose) {
      const n = e?.[w] ?? e;
      Qe?.getOrInsertComputed?.(n, () => {
        const l = /* @__PURE__ */ new Set();
        return (typeof n == "object" || typeof n == "function") && (Rt.register(n, l), Qe.set(n, l), n[Symbol.dispose] ??= () => l.forEach((u) => {
          u?.();
        })), l;
      })?.add?.(r);
    } else e[t] = function(...n) {
      const l = e?.[t];
      typeof l == "function" && l.apply(this, n), r.apply(this, n);
    };
}
var ee = (e) => {
  if (typeof e != "string" || e === "") return !1;
  const t = Number(e);
  return Number.isInteger(t) && t >= 0 && String(t) === e;
};
function wr(e = [], t = {}) {
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
        if (f?.includes?.(a) || o?.includes?.(a)) {
          n(a, "unshift", 0);
          continue;
        }
        o.push(a);
      }
      if (!o.length) return f.length;
      const c = [...o, ...f];
      return u(c), c.length;
    },
    splice: (i, f, ...o) => {
      const c = l(), a = Math.min(Math.max(i, 0), c.length), v = f === void 0 ? c.length - a : Math.max(0, Math.min(f, c.length - a)), m = c.splice(a, v);
      let b = a;
      for (const O of o) {
        if (c?.includes?.(O)) {
          n(O, "splice", b);
          continue;
        }
        c.splice(b++, 0, O);
      }
      return u(c), m;
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
      if (ee(f)) return l()[Number(f)];
      const o = s[f];
      return o;
    },
    set: (i, f, o) => {
      if (f === "length") {
        if (typeof o != "number" || !Number.isFinite(o) || o < 0) throw new RangeError("length must be a finite non-negative number");
        const c = Math.floor(o);
        if (c >= r.size) return !0;
        const a = l().slice(0, c);
        return u(a), !0;
      }
      if (ee(f)) {
        const c = l(), a = Number(f);
        if (a > c.length) return !0;
        const v = o;
        if (a < c.length) {
          const m = c[a];
          if (Object.is(m, v)) return !0;
          if (c.some((b, O) => O !== a && Object.is(b, v)))
            return n(v, "set", a), !0;
          c[a] = v;
        } else {
          if (c?.includes?.(v))
            return n(v, "set", a), !0;
          c.push(v);
        }
        return u(c), !0;
      }
      return Reflect.set(s, f, o);
    },
    deleteProperty: (i, f) => {
      if (f === "length") return !1;
      if (ee(f)) {
        const o = l(), c = Number(f);
        return c >= o.length || (o.splice(c, 1), u(o)), !0;
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
      if (ee(f)) {
        const o = l(), c = Number(f);
        return c >= o.length ? void 0 : {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          value: o[c]
        };
      }
      return Reflect.getOwnPropertyDescriptor(s, f);
    },
    has: (i, f) => {
      if (f === "length") return !0;
      if (ee(f)) {
        const o = Number(f);
        return o >= 0 && o < r.size;
      }
      return f in s;
    }
  });
}
var Pt = class {
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
    return ae(e, r, t), !0;
  }
  get(e, t, r) {
    return typeof t == "symbol" ? e?.[t] ?? e : Reflect.get(e, t, r);
  }
}, Ar = (e) => {
  if (e?.[D] || Je.has(e)) return e;
  const t = new Proxy(e, new Pt());
  return Je.set(t, e), t;
}, ut = /* @__PURE__ */ Symbol.for("object.ts@withUnsub");
globalThis[ut] ??= /* @__PURE__ */ new WeakMap();
var It = globalThis[ut], Mt = (e, t, r) => It.getOrInsert(e, () => {
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
}), st = /* @__PURE__ */ Symbol.for("object.ts@subscriptRegistry");
globalThis[st] ??= /* @__PURE__ */ new WeakMap();
var S = globalThis[st] ??= /* @__PURE__ */ new WeakMap(), ft = /* @__PURE__ */ Symbol.for("object.ts@globalEffectListeners");
globalThis[ft] ??= /* @__PURE__ */ new Map();
var he = globalThis[ft], Xe = (e, t = ["*"]) => {
  if (e == null || typeof e != "function") return;
  const r = ht(t);
  return he.set(e, r.affectTypes), () => he.delete(e);
}, ot = /* @__PURE__ */ Symbol.for("object.ts@wrapped");
globalThis[ot] ??= /* @__PURE__ */ new WeakMap();
var Et = globalThis[ot], kt = (e, t) => {
  const r = e?.[w] ?? e;
  let n = S.get(r);
  return n ? n.bindSource(r) : (n = new _t(r), S.set(r, n)), t;
}, fe = (e, t) => (e = N(e?.[w] ?? e), typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || e == null ? e : Et.getOrInsertComputed(e, () => new Proxy(e, kt(e, t)))), te = /* @__PURE__ */ Symbol.for("@allProps"), ct = /* @__PURE__ */ new Set(["*", "all"]), ze = /* @__PURE__ */ new Map([
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
]), yt = /* @__PURE__ */ Symbol.for("object.ts@triggerCanonicalNames");
globalThis[yt] ??= new Map(Array.from(ze.entries()).flatMap(([e, t]) => t.map((r) => [r, e])));
var $t = globalThis[yt], se = (e = "set") => {
  if (e == null) return e;
  const t = String(e || "set");
  return $t.get(t) ?? t;
}, at = (e) => {
  const t = e == null ? "all" : String(se(e) ?? "all");
  return [t, ...ze.get(t) ?? []];
}, Ye = (e = ["*"]) => new Set([...X(e)].flatMap((t) => [t, ...ze.get(t) ?? []])), X = (e = ["*"]) => {
  const t = typeof e == "string" ? [e] : Array.from(e ?? ["*"]), r = new Set(t.map((n) => {
    const l = String(n || "*");
    return ct.has(l) ? l : String(se(l) ?? l);
  }));
  return r.size ? r : /* @__PURE__ */ new Set(["*"]);
}, Q = (e, t) => {
  const r = e instanceof Set ? e : X(e);
  return [...ct].some((n) => r.has(n)) || at(t).some((n) => r.has(n));
}, dt = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), me = (e = ["*"]) => {
  if (dt(e)) return {
    affectTypes: X(e.affectTypes ?? e.triggers ?? ["*"]),
    triggerImmediately: e.triggerImmediately !== !1
  };
  const t = X(e);
  return {
    affectTypes: t,
    triggerImmediately: Q(t, "initial")
  };
}, ht = (e = ["*"]) => dt(e) ? {
  affectTypes: X(e.affectTypes ?? e.triggers ?? ["*"]),
  triggerImmediately: e.triggerImmediately === !0
} : {
  affectTypes: X(e),
  triggerImmediately: !1
}, vt = /* @__PURE__ */ Symbol.for("object.ts@Subscript");
globalThis[vt] ??= class {
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
      enable: (l = ["*"], u) => u ? this.withTriggers(l, !0, u) : this.setTriggersEnabled(l, !0),
      disable: (l = ["*"], u) => u ? this.withTriggers(l, !1, u) : this.setTriggersEnabled(l, !1),
      set: (l, u) => this.setTriggersEnabled(l, u),
      with: (l, u) => this.withTriggers(l, !0, u),
      without: (l, u) => this.withTriggers(l, !1, u),
      isEnabled: (l) => this.isTriggerEnabled(l)
    }, this.#o = { next: (l) => {
      l && (Array.isArray(l) ? this.#s(...l) : this.#s(l));
    } };
    const r = new WeakRef(this), n = function(l) {
      const u = l?.next?.bind?.(l);
      return Mt(l, r, u);
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
  #s(t, r = null, n, l = "all", ...u) {
    l = se(l) ?? l;
    const s = this.#e;
    if (s?.size)
      for (const [i, f] of s.entries()) (f.prop === t || f.prop === te || f.prop === null) && Q(f.triggers, l) && this.$safeExec(i, r, t, n, l, ...u);
    if (he.size) {
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
      for (const [f, o] of he.entries()) Q(o, l) && this.$safeExec(f, i);
    }
  }
  wrap(t) {
    return Array.isArray(t) ? fe(t, this) : t;
  }
  get triggerControl() {
    return this.#c;
  }
  isTriggerEnabled(t) {
    return !Q(this.#n, "all") && !at(t).some((r) => this.#n.has(r));
  }
  setTriggersEnabled(t = ["*"], r = !0) {
    const n = Ye(t);
    for (const l of n) r ? this.#n.delete(l) : this.#n.add(l);
  }
  withTriggers(t, r, n) {
    const l = [...Ye(t)], u = new Map(l.map((i) => [i, this.#n.has(i)])), s = () => {
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
    const l = me(n);
    return this.#e.set(t, {
      prop: r || te,
      triggers: l.affectTypes
    }), () => this.unaffected(t, r || te);
  }
  unaffected(t, r) {
    if (t != null && typeof t == "function") {
      const n = this.#e, l = n?.get(t);
      if (l && (l.prop == r || r == null || r == te))
        return n.delete(t), () => this.affected(t, r || te, l.triggers);
    }
    return this.#e.clear();
  }
  trigger(t, r, n, l = "set", ...u) {
    if (typeof t == "symbol" || (l === void 0 && (l = "set"), l = se(l) ?? l, !this.isTriggerEnabled(l))) return;
    const s = `${l ?? "all"}`;
    let i = this.#l.get(t);
    if (i || (i = /* @__PURE__ */ new Map(), this.#l.set(t, i)), i.set(s, [
      t,
      r,
      n,
      l,
      u
    ]), this.#u) return;
    this.#u = !0, ((o) => typeof scheduler < "u" ? scheduler?.yield?.()?.then?.(o) : queueMicrotask(o))?.(() => {
      this.#u = !1;
      const o = this.#l;
      this.#l = /* @__PURE__ */ new Map();
      for (const [c, a] of o)
        if (!(c != null && this.#i.has(c))) {
          c != null && this.#i.add(c);
          try {
            for (const [, v] of a) {
              const [m, b, O, M, p] = v;
              try {
                this.#s(m, b, O, M, ...p ?? []);
              } catch (x) {
                console.warn(x);
              }
            }
          } finally {
            c != null && this.#i.delete(c);
          }
        }
    });
  }
  get iterator() {
    return this.#o;
  }
};
var _t = globalThis[vt], Ce = (e) => {
  const t = N(e);
  return t?.[w] ?? t;
};
function Ze(e, t = "all") {
  const r = Ce(e);
  return k(r) ? Re(r, t) : k(r?.[V]) ? Re(r[V], t) : Re(r ?? e, t);
}
function pt(e, t = !1) {
  const r = ((n = "all") => {
    const l = Ze(e, n);
    return t ? l.then((u) => {
      const s = Ce(e), i = s?.realProp ?? (s && "value" in s ? "value" : null);
      return S.get(s)?.trigger?.(i, u, void 0, "resolved"), u;
    }) : l;
  });
  return r.all = () => r("all"), r.allSettled = () => r("settled"), r.allKeyed = () => r("all"), r.allSettledKeyed = () => r("settled"), r.try = (n, ...l) => Promise.try(n, ...l).then((u) => Ze(u ?? e, "all")), r;
}
function Y(e, t, r, n, l = "resolved") {
  const u = Ce(e) ?? e;
  S.get(u)?.trigger?.(t, r, n, l);
}
function Ne(e, t) {
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
    if (r == w || r == V || r == lt || !Object.getOwnPropertyDescriptor(t, r)?.enumerable) continue;
    const n = t[r];
    k(n) && (e[r] = n);
  }
  return e;
}
var Wt = /* @__PURE__ */ Symbol.for("object.ts@__safeGetGuard"), Vt = /* @__PURE__ */ Symbol.for("object.ts@reactiveProperties"), ke = globalThis[Vt] ??= /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ Symbol.for("object.ts@reactiveMethods"), Tr = globalThis[zt] ??= /* @__PURE__ */ new WeakMap();
function Le(e, t) {
  let r = ke.get(e);
  r || ke.set(e, r = /* @__PURE__ */ new Set()), r.add(t);
}
function bt(e, t) {
  for (let r = e; r; r = Reflect.getPrototypeOf(r)) if (ke.get(r)?.has(t)) return !0;
  return !1;
}
function et(e, t, r, n, l, u = "set") {
  const s = S.get(e) ?? S.get(t), i = $e(e, r);
  (y(e, it) ?? A)(n, l) && s?.trigger?.(i, l, n, u), k(l) && Y(e, i, l, n);
}
function Z(e, t, r) {
  const n = Reflect.getOwnPropertyDescriptor(e, t);
  if (!n || !n.configurable || "value" in n && n.writable === !1) return !1;
  if (bt(e, t)) return !0;
  if ("value" in n) {
    const i = n.value, f = /* @__PURE__ */ new WeakMap();
    f.set(e, i);
    const o = Reflect.defineProperty(e, t, {
      enumerable: n.enumerable,
      configurable: !0,
      get() {
        return f.has(this) ? f.get(this) : i;
      },
      set(c) {
        const a = f.has(this) ? f.get(this) : i;
        f.set(this, c), et(this, e, t, a, c);
      }
    });
    return o && Le(e, t), o;
  }
  if (!n.set) return !1;
  const l = /* @__PURE__ */ new WeakMap(), u = {
    ...n,
    configurable: !0,
    enumerable: n.enumerable,
    set: function(i) {
      const f = n.get ? n.get.call(this) : l.get(this);
      n.set.call(this, i);
      const o = n.get ? n.get.call(this) : i;
      n.get || l.set(this, o), et(this, e, t, f, o);
    }
  };
  n.get && (u.get = function() {
    return n.get.call(this);
  }), r !== void 0 && typeof r < "u" && l.set(e, r);
  const s = Reflect.defineProperty(e, t, u);
  return s && Le(e, t), s;
}
var Ct = /* @__PURE__ */ new Set([
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
]), re = (e, t) => {
  if (!Ct.has(t)) return null;
  const r = y(e, t);
  return typeof r == "function" ? q(e, r) : r;
}, P = globalThis[Wt] ??= /* @__PURE__ */ new WeakMap();
function Nt(e, t) {
  let r = !0;
  try {
    P?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), P?.get?.(e)?.has?.(t) && (r = !0), r = typeof Reflect.getOwnPropertyDescriptor(e, t)?.get == "function";
  } catch {
    r = !0;
  } finally {
    P?.get?.(e)?.delete?.(t);
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
}, Dt = (e, t, r) => {
  if (e == null) return !1;
  let n = __safeSetGuard?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  return n?.has?.(t) ? !1 : (n?.add?.(t), Reflect.set(e, t, r));
}, y = (e, t, r) => {
  let n;
  if (e == null) return e;
  let l = P?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  if (l?.has?.(t)) return null;
  if (!Nt(e, t)) n ??= Reflect.get(e, t, r ?? e);
  else {
    l?.add?.(t);
    try {
      n = Reflect.get(e, t, r ?? e);
    } catch {
      n = void 0;
    } finally {
      l.delete(t), l?.size === 0 && P?.delete?.(e);
    }
  }
  return typeof n == "function" ? q(e, n) : n;
}, z = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Pe = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && (z(e, "key") || z(e, "name") || z(e, "oldValue") || z(e, "old") || z(e, "op") || z(e, "trigger") || t && z(e, "value")), G = (e, t, r) => z(e, t) ? e[t] : t == "oldValue" && z(e, "old") ? e.old : r(), ge = (e, t = "manual") => se(e.trigger ?? e.op ?? t), Bt = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", ve = (e) => {
  const t = y(e, de) ?? y(e, "realProp");
  return Bt(t) ? t : null;
}, $e = (e, t) => t == "value" ? ve(e) ?? t : t, Kt = (e, t) => {
  const r = ve(e);
  return r != null && t == r ? y(e, "value") ?? y(e, d) ?? y(e, t) : t == null ? void 0 : y(e, t);
}, we = (e, t, r) => {
  const n = (u, s, i) => (Pe(s) || (i ??= s), t(Pe(u) ? u : Pe(s, !0) ? {
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
  }), r != null && (n.resolved = pt(r, !0)), n;
}, Ae = (e, t, r) => {
  if (e == null || T(e)) return e;
  if (([
    "deref",
    "bind",
    "@target",
    D,
    w,
    ie
  ].indexOf(t) < 0 ? y(e, t)?.bind?.(e) : null) != null) return null;
  if ([w, D].indexOf(t) >= 0) return y(e, t) ?? e;
  if (t == d) return y(e, t) ?? y(e, "value");
  if (t == ie) return r;
  if (t == lt || t == "resolved" && !Object.prototype.hasOwnProperty.call(e, "resolved")) return pt(e);
  if (t == Ot) return r?.triggerControl;
  if (t == Symbol.observable) return r?.compatible;
  if (t == Symbol.subscribe) return (n, l, u) => g(l != null ? [e, l] : e, n, u);
  if (t == Symbol.iterator || t == Symbol.asyncIterator) return y(e, t);
  if (t == Symbol.dispose) return (n) => {
    y(e, Symbol.dispose)?.(n), Ee(n != null ? [e, n] : e);
  };
  if (t == Symbol.asyncDispose) return (n) => {
    y(e, Symbol.asyncDispose)?.(n), Ee(n != null ? [e, n] : e);
  };
  if (t == Symbol.unsubscribe) return (n) => Ee(n != null ? [e, n] : e);
  if (typeof t == "symbol" && (t in e || y(e, t) != null)) return y(e, t);
}, Oe = (e, t, r) => {
  if (t == "subscribe") return r?.compatible?.[t] ?? ((n) => {
    if (typeof n == "function") return g(e, n);
    if ("next" in n && n?.next != null) {
      const l = g(e, n?.next), u = n?.complete;
      return n.complete = (...s) => (l?.(), u?.(...s)), n.complete;
    }
  });
}, jt = class {
  #r;
  #e;
  #t;
  constructor(e, t, r) {
    this.#r = e, this.#e = t, this.#t = r;
  }
  get(e, t, r) {
    const n = re(e, t);
    return n ?? Reflect.get(e, t, r);
  }
  apply(e, t, r) {
    let n = [], l = [], u = [], s = [...this.#e], i = -1;
    const f = Reflect.apply(e, t || this.#e, r);
    if (this.#t?.[h])
      return Array.isArray(f) ? _e(f) : f;
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
        for (let c = 0; c < Math.max(s.length, this.#e.length); c++) {
          const a = s[c], v = this.#e[c];
          v === void 0 && c >= this.#e.length ? l.push(a) : a === void 0 && c >= s.length ? u.push([
            c,
            v,
            void 0,
            !1
          ]) : A(a, v) && u.push([
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
        for (let c = 0; c < s.length; c++) A(s[c], this.#e[c]) && u.push([
          i + c,
          this.#e[c],
          s[c],
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
    const o = S.get(this.#e);
    return n?.length == 1 ? o?.trigger?.(i, n[0], null, "add") : n?.length > 1 && (o?.trigger?.(i, n, null, "addAll"), n.forEach((c, a) => o?.trigger?.(i + a, c, null, "add"))), u?.length == 1 ? o?.trigger?.(u[0]?.[0] ?? i, u[0]?.[1], u[0]?.[2], u[0]?.[3] === !1 ? "add" : "set") : u?.length > 1 && (o?.trigger?.(i, u, s, "setAll"), u.forEach((c, a) => o?.trigger?.(c?.[0] ?? i + a, c?.[1], c?.[2], c?.[3] === !1 ? "add" : "set"))), l?.length == 1 ? o?.trigger?.(i, null, l[0], "delete") : l?.length > 1 && (o?.trigger?.(i, null, l, "deleteAll"), l.forEach((c, a) => o?.trigger?.(i + a, null, c, "delete"))), f == e ? new Proxy(f, this.#t) : Array.isArray(f) ? _e(f) : f;
  }
}, Gt = (e, t, r, n) => {
  const l = Number.isInteger(r) && Number.isInteger(n) && n < r ? t.slice(n, r) : [];
  if (!e[h] && r !== n) {
    const u = S.get(t);
    l.length === 1 ? u?.trigger?.(n, null, l[0], "delete") : l.length > 1 && (u?.trigger?.(n, null, l, "deleteAll"), l.forEach((i, f) => u?.trigger?.(n + f, null, i, "delete")));
    const s = Number.isInteger(r) && Number.isInteger(n) && n > r ? n - r : 0;
    if (s === 1) u?.trigger?.(r, void 0, null, "add");
    else if (s > 1) {
      const i = Array(s).fill(void 0);
      u?.trigger?.(r, i, null, "addAll"), i.forEach((f, o) => u?.trigger?.(r + o, void 0, null, "add"));
    }
  }
}, Ft = class {
  [h];
  constructor() {
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  get(e, t, r) {
    const n = re(e, t);
    if (n != null) return n;
    if ([
      w,
      D,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? y(e, t)?.bind?.(e) : y(e, t);
    const l = S?.get?.(e), u = Ae(e, t, l);
    if (u != null) return u;
    const s = Oe(e, t, l);
    if (s != null) return s;
    if (t == Se) return be.call(this, this);
    if (t == $) return we(l, (f) => {
      const o = f.key ?? f.name ?? 0, c = G(f, "value", () => y(e, o)), a = G(f, "oldValue", () => {
      });
      return l?.trigger?.(o, c, a, ge(f, "manual"));
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
    return typeof i == "function" ? new Proxy(typeof i == "function" ? i?.bind?.(e) : i, new jt(t, e, this)) : i;
  }
  set(e, t, r) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h && r)
      return this[h] = !!r, !0;
    if (t == h && !r)
      return delete this[h], !0;
    const n = k(r);
    return Ve(r, (l) => {
      const u = y(e, t), s = [
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
      let c = !1;
      return f >= 0 ? c = Reflect.set(e, f, l) : o >= 0 ? c = Reflect.set(e, o, l) : c = Reflect.set(e, t, l), t == "length" && A(u, l) && Gt(this, e, u, l), !this[h] && typeof t != "symbol" && (A(u, l) && S?.get?.(e)?.trigger?.(t, l, u, "set"), n && Y(e, t, l, u)), c;
    });
  }
  deleteProperty(e, t) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h)
      return delete this[h], !0;
    const r = y(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != "length" && t != h && typeof t != "symbol" && r != null && S.get(e)?.trigger?.(t, t, r, "delete"), n;
  }
}, Ht = class {
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
    const n = S.get(e) ?? S.get(y(e, "value") ?? e), l = Ae(e, t, n);
    if (l != null) return l;
    y(e, t) == null && t != "value" && W(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e);
    const u = Oe(e, t, n);
    return u ?? (t == Se ? be.call(this, this) : t == $ ? we(n, (s) => {
      const i = $e(e, s.key ?? s.name ?? ve(e) ?? "value"), f = G(s, "oldValue", () => i == "value" || i == ve(e) ? y(e, d) : void 0), o = G(s, "value", () => Kt(e, i));
      return n?.trigger?.(i, o, f, ge(s, "manual"));
    }, e) : t == Symbol.toPrimitive ? (s) => {
      const i = H(e, t);
      return y(i, t) ? y(i, t)?.(s) : T(i) ? C(i, s) : T(y(i, "value")) ? C(y(i, "value"), s) : C(y(i, "value") ?? i, s);
    } : t == Symbol.toStringTag ? () => {
      const s = H(e, t);
      return y(s, t) ? y(s, t)?.() : T(s) ? String(s ?? "") || "" : T(y(s, "value")) ? String(y(s, "value") ?? "") || "" : String(y(s, "value") ?? s ?? "") || "";
    } : t == "toString" ? () => {
      const s = H(e, t);
      return y(s, t) ? y(s, t)?.() : y(s, Symbol.toStringTag) ? y(s, Symbol.toStringTag)?.() : T(s) ? String(s ?? "") || "" : T(y(s, "value")) ? String(y(s, "value") ?? "") || "" : String(y(s, "value") ?? s ?? "") || "";
    } : t == "valueOf" ? () => {
      const s = H(e, t);
      return y(s, t) ? y(s, t)?.() : y(s, Symbol.toPrimitive) ? y(s, Symbol.toPrimitive)?.() : T(s) ? s : T(y(s, "value")) ? y(s, "value") : y(s, "value") ?? s;
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
      P?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), P?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      P?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  has(e, t) {
    return t in e;
  }
  set(e, t, r) {
    const n = re(e, t);
    return n ?? Ve(r, (l) => {
      const u = re(l, t);
      if (u != null) return u;
      if (t == h && r)
        return this[h] = !!r, !0;
      if (t == h && !r)
        return delete this[h], !0;
      const s = e;
      if (y(e, t) == null && t != "value" && W(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e), typeof t == "symbol" && !(y(e, t) != null && t in e)) return;
      const i = $e(e, t), f = t == "value" ? y(e, d) ?? y(e, t) : y(e, t);
      e[t] = l;
      const o = y(e, t) ?? l;
      if (!this[h] && typeof t != "symbol" && !bt(s, t)) {
        const c = S.get(e) ?? S.get(s);
        (y(e, it) ?? A)?.(f, o) && c?.trigger?.(i, l, f), k(r) && Y(s, i, l, f);
      }
      return !0;
    });
  }
  defineProperty(e, t, r) {
    const n = re(e, t);
    if (n != null) return n;
    if (t == h && r.value)
      return this[h] = !!r.value, !0;
    if (t == h && !r.value)
      return delete this[h], !0;
    if (y(e, t) == null && t != "value" && W(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e), r.get == null && r.set == null) return Reflect.defineProperty(e, t, r);
    const l = y(e, t), u = Reflect.defineProperty(e, t, {
      get: r.get,
      set: r.set,
      enumerable: r.enumerable ?? !0,
      configurable: r.configurable ?? !0
    });
    return Dt(e, t, l), u;
  }
  deleteProperty(e, t) {
    if (t == h)
      return delete this[h], !0;
    y(e, t) == null && t != "value" && W(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e);
    const r = y(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != h && typeof t != "symbol" && S.get(e)?.trigger?.(t, null, r, "delete"), n;
  }
}, qt = class {
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
    const n = S.get(e), l = Ae(e, t, n);
    if (l != null) return l;
    const u = Oe(e, t, n);
    if (u != null) return u;
    e = y(e, w) ?? y(e, D) ?? e;
    const s = q(e, y(e, t));
    if (typeof t == "symbol" && (t in e || y(e, t) != null)) return s;
    if (t == Se) return be.call(this, this);
    if (t == $) return we(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = G(i, "value", () => e.get(f));
      if (o == null && !z(i, "value")) return;
      const c = G(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, c, ge(i, "manual"));
    }, e);
    if (t == "clear") return () => {
      const i = Array.from(e?.entries?.() || []), f = s();
      return i.forEach(([o, c]) => {
        this[h] || S.get(e)?.trigger?.(o, null, c, "delete");
      }), f;
    };
    if (t == "delete") return (i, f = null) => {
      const o = e.has(i), c = e.get(i), a = s(i);
      return !this[h] && o && S.get(e)?.trigger?.(i, null, c, "delete"), a;
    };
    if (t == "set") return (i, f) => Ue(f, (o) => {
      const c = e.has(i), a = e.get(i), v = s(i, o);
      return this[h] || ((!c || A(a, o)) && S.get(e)?.trigger?.(i, o, c ? a : null, c ? "set" : "add"), k(f) && Y(e, i, o, a)), v;
    });
    if (t == "getOrInsert" || t == "getOrInsertComputed") {
      const i = t == "getOrInsertComputed";
      return (f, o) => {
        if (e.has(f)) return e.get(f);
        const c = i && typeof o == "function" ? o(f) : o;
        return Ue(c, (a) => {
          const v = typeof e.getOrInsert == "function" ? e.getOrInsert(f, a) : (e.set(f, a), e.get(f));
          return this[h] || (S.get(e)?.trigger?.(f, a, null, "add"), k(c) && Y(e, f, a, null)), v;
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
      P?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), P?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      P?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  deleteProperty(e, t) {
    return t == h ? (delete this[h], !0) : Reflect.deleteProperty(e, t);
  }
}, Ut = class {
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
    const n = S.get(e), l = Ae(e, t, n);
    if (l != null) return l;
    const u = Oe(e, t, n);
    if (u != null) return u;
    e = y(e, w) ?? y(e, D) ?? e;
    const s = q(e, y(e, t));
    return typeof t == "symbol" && (t in e || y(e, t) != null) ? s : t == Se ? be.call(this, this) : t == $ ? we(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = G(i, "value", () => e.has(f)), c = G(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, c, ge(i, "manual"));
    }, e) : t == "clear" ? () => {
      const i = Array.from(e?.values?.() || []), f = s();
      return i.forEach((o) => {
        this[h] || S.get(e)?.trigger?.(null, null, o, "delete");
      }), f;
    } : t == "delete" ? (i) => {
      const f = e.has(i), o = f ? i : null, c = s(i);
      return !this[h] && f && S.get(e)?.trigger?.(i, null, o, "delete"), c;
    } : t == "add" ? (i) => Ve(i, (f) => {
      const o = e.has(f), c = o ? f : null, a = s(f);
      return this[h] || (o || S.get(e)?.trigger?.(f, f, c, "add"), k(i) && Y(e, f, f, c)), a;
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
      P?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), P?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      P?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  deleteProperty(e, t) {
    return t == h ? (delete this[h], !0) : Reflect.deleteProperty(e, t);
  }
}, L = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[ue])), Te = (e) => {
  if (Array.isArray(e)) {
    const t = e.entries();
    for (const [r, n] of t) Z(e, r);
  } else if (e != null && (typeof e == "object" || typeof e == "function")) {
    const t = Object.entries(e);
    for (const [r, n] of t) Z(e, r);
  }
}, _e = (e) => L(e) ? e : (Te(e), Ne(fe(e, new Ft()), e)), Jt = (e) => L(e) ? e : (Te(e), Ne(fe(e, new Ht()), e)), Qt = (e) => L(e) ? e : (Te(e), Ne(fe(e, new qt()), e)), Xt = (e) => L(e) ? e : (Te(e), fe(e, new Ut())), Yt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [d]: r ? 0 : Number(N(e) || 0) || 0,
    [U]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](u) {
      return C((typeof this?.[d] != "object" ? this?.[d] : this?.[d]?.value || 0) ?? 0, u);
    },
    set value(u) {
      this[d] = (u != null && !Number.isNaN(u) ? Number(u) : this[d]) || 0;
    },
    get value() {
      return Number(this[d] || 0) || 0;
    }
  };
  Z(n, "value");
  const l = I(n);
  return e?.then?.((u) => {
    l.value = u, l[$]?.({
      key: "value",
      value: u,
      trigger: "resolved"
    });
  }), l;
}, Zt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [d]: (r ? "" : String(N(typeof e == "number" ? String(e) : e || ""))) ?? "",
    [U]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") ?? "";
    },
    [Symbol?.toPrimitive](u) {
      return C(this?.[d] ?? "", u);
    },
    set value(u) {
      this[d] = String(typeof u == "number" ? String(u) : u || "") ?? "";
    },
    get value() {
      return String(this[d] ?? "") ?? "";
    }
  };
  Z(n, "value");
  const l = I(n);
  return e?.then?.((u) => {
    l.value = u, l[$]?.({
      key: "value",
      value: u,
      trigger: "resolved"
    });
  }), l;
}, Lt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [d]: (r ? !1 : (N(e) != null ? typeof N(e) == "string" ? !0 : !!N(e) : !1) || !1) || !1,
    [U]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](u) {
      return C(!!this?.[d] || !1, u);
    },
    set value(u) {
      this[d] = (u != null ? typeof u == "string" ? !0 : !!u : this[d]) || !1;
    },
    get value() {
      return this[d] || !1;
    }
  };
  Z(n, "value");
  const l = I(n);
  return e?.then?.((u) => {
    l.value = u, l[$]?.({
      key: "value",
      value: u,
      trigger: "resolved"
    });
  }), l;
}, tt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [U]: t,
    [Symbol?.toStringTag]() {
      return String(this.value ?? "") || "";
    },
    [Symbol?.toPrimitive](u) {
      return C(this.value, u);
    },
    value: r ? null : N(e)
  };
  Z(n, "value");
  const l = I(n);
  return e?.then?.((u) => {
    l.value = u, l[$]?.({
      key: "value",
      value: u,
      trigger: "resolved"
    });
  }), g(e, (u) => {
    l?.[$]?.();
  }), l;
}, Ie = (e, t) => {
  if (e == null || typeof e != "object" && typeof e != "function") return e;
  try {
    Object.defineProperty(e, de, {
      value: t,
      writable: !0,
      configurable: !0
    });
  } catch {
    try {
      e[de] = t;
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
}, er = (e, t = "value", r, n) => {
  if (T(e) || !e) return e;
  Array.isArray(e) && e.length == 2 && e[0] != null && (e[0] instanceof Map || e[0] instanceof WeakMap || e[0] instanceof Set || e[0] instanceof WeakSet) ? ((t == null || t === "value") && (t = e[1]), e = e[0]) : Array.isArray(e) && !le(e?.[1], e) && (Array.isArray(e?.[0]) || typeof e?.[0] == "object" || typeof e?.[0] == "function") && (e = e?.[0]);
  const l = e instanceof Map || e instanceof WeakMap || typeof e?.get == "function" && typeof e?.set == "function" && (typeof e?.delete == "function" || typeof e?.remove == "function"), u = e instanceof Set || e instanceof WeakSet || typeof e?.has == "function" && typeof e?.add == "function" && (typeof e?.delete == "function" || typeof e?.remove == "function");
  if (l || u) {
    if (t == null) return;
  } else if ((t ??= Array.isArray(e) ? null : "value") == null || le(t, e)) return;
  const s = () => l ? e?.get?.(t) : u ? e?.has?.(t) ? t : null : e?.[t], i = (a) => {
    if (l) {
      const v = e;
      return A(a, v?.get?.(t)) && v?.set?.(t, a), a;
    }
    if (u) {
      const v = e, m = a ?? t;
      return m == null ? (v?.delete?.(t), m) : (v?.has?.(m) || v?.add?.(m), m);
    }
    return A(a, e?.[t]) && (e[t] = a), a;
  };
  l && r !== void 0 && !e?.has?.(t) ? e?.set?.(t, r) : u && r && !e?.has?.(t) && e?.add?.(t);
  const f = s();
  if (!u && t != null && W(f) && K(f)) return Ie(nr(f), t);
  if (!l && !u && t && typeof e?.getProperty == "function" && K(e?.getProperty?.(t))) return Ie(e?.getProperty?.(t), t);
  !l && !u ? e[t] ??= r ?? e?.[t] : l && A(r ?? e?.get?.(t), e?.get?.(t)) ? e?.set?.(t, r ?? e?.get?.(t)) : u && e?.has?.(r ?? t) && e?.add?.(r ?? t);
  const o = I({
    [d]: u ? s() : s() ?? r,
    [U]: n,
    [Symbol?.toStringTag]() {
      return String(s() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return C(s(), a);
    },
    set value(a) {
      if (o[xe] = !0, u) this[d] = i(a);
      else {
        const v = a ?? wt(s());
        this[d] = i(v);
      }
      o[xe] = !1;
    },
    get value() {
      const a = s();
      return this[d] = a ?? this[d];
    }
  });
  Ie(o, t);
  const c = g(e, (a, v, m, b) => {
    if (v != t || o[xe]) return;
    const O = u ? s() : a, M = o[d];
    o[d] = O, o[$]?.({
      key: "value",
      value: O,
      oldValue: m ?? M,
      trigger: b ?? "set"
    });
  });
  return E(o, Symbol.dispose, c), o;
}, tr = (e, t) => {
  switch (typeof e) {
    case "boolean":
      return Lt(e, t);
    case "number":
      return Yt(e, t);
    case "string":
      return Zt(e, t);
    case "object":
      if (e != null) return tt(I(e), t);
    default:
      return tt(e, t);
  }
}, rr = (e, t = "value", r) => {
  const n = K(e) ? e : tr(e, r);
  return t != null ? er(n, t, r) : n;
}, xr = (e, t) => rr(e, t), De = (e, t, r = 100) => {
  if (e?.value ?? e) return setTimeout(() => {
    e.value && t?.();
  }, r);
}, Rr = (e = 100) => (t, [r], [n]) => {
  let l = De(r, t, e);
  n?.addEventListener?.("abort", () => {
    l && clearTimeout(l);
  }, { once: !0 });
}, Pr = (e = 100) => (t, [r], [n]) => {
  let l = De(r, t, e);
  n?.addEventListener?.("abort", () => {
    l && clearTimeout(l);
  }, { once: !0 }), l || t?.();
};
function I(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || L(e) || (e = N?.(e)) == null || e instanceof Promise || e instanceof WeakRef || L(e)) return e;
  const r = e;
  if (r == null || typeof r == "symbol" || !(typeof r == "object" || typeof r == "function") || r instanceof Promise || r instanceof WeakRef) return r;
  let n = r;
  return Array.isArray(r) ? (n = _e(r), n) : r instanceof Map ? (n = Qt(r), n) : r instanceof Set ? (n = Xt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = Jt(r)), n);
}
var K = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[ue] || S?.has?.(e))), nr = (e) => K(e) ? I(e) : null, Ir = (e) => {
  if (e == null || typeof e != "object" && typeof e != "function" || e?.[Symbol.observable] != null) return e;
  try {
    e[Symbol.observable] = self?.compatible;
  } catch {
    console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks");
  }
  return e[ue] = (t, r, n) => {
    const l = e?.[Symbol?.observable];
    return l?.()?.affected?.(t, r, n), () => l?.()?.unaffected?.(t, r);
  }, e;
}, J = /* @__PURE__ */ new WeakMap(), Be = (e) => {
  if (!(typeof e == "symbol" || e == null || !(typeof e == "object" || typeof e == "function")))
    return e;
}, pe = "initial", Ke = (e) => {
  const t = e?.[de] ?? e?.realProp;
  return j(t) ? t : null;
}, je = (e, t) => {
  const r = Ke(e);
  return r != null && (t == null || t == "value") ? r : t;
}, lr = (e, t) => t != null && t == Ke(e) ? e?.value : e?.[t], We = (e, t, r, n) => {
  if (t != null && t == Ke(e)) {
    const l = lr(e, t);
    if (l != null) return r?.(l, t, null, "set");
  }
  return gt(e, t, r, n);
}, St = (e, t, r) => {
  const n = me(t);
  if (r == pe) {
    if (!n.triggerImmediately) return;
  } else if (!Q(n.affectTypes, r)) return;
  return (l, u, s, ...i) => e?.(l, u, s, r, ...i);
}, ir = (e, t, r, n = ["*"]) => {
  if (!e || !Be(e)) return;
  const l = t != Symbol.iterator ? je(e, t) : null;
  let u = e?.[ie] ?? S.get(e);
  e = e?.[w] ?? e, ((f) => typeof scheduler < "u" ? scheduler?.yield?.()?.then?.(f) : queueMicrotask(f))?.(() => {
    const f = St(r, n, pe);
    f && (l != null && l != Symbol.iterator ? We(e, l, f, null) : nt(e, f, null));
  });
  let i = u?.affected?.(r, l, n);
  return e?.[Symbol.dispose] || (E(i, Symbol.dispose, i), E(i, Symbol.asyncDispose, i), E(e, Symbol.dispose, i), E(e, Symbol.asyncDispose, i)), i;
}, ur = (e, t, r, n = ["*"]) => {
  const l = me(n).affectTypes, u = {};
  let s = e?.value;
  const i = (f) => {
    const o = f?.target?.value;
    Q(l, "set") && r?.(o, "value", s, "set", f), s = o;
  };
  return e?.addEventListener?.("change", i, u), () => e?.removeEventListener?.("change", i, u);
}, ne = (e) => Array.isArray(e) && e?.length == 2 && Be(e?.[0]) && (j(e?.[1]) || e?.[1] == Symbol.iterator), sr = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), fr = (e) => e == null ? [] : Array.isArray(e) && !ne(e) && !K(e) ? e : [e], or = (e) => {
  if (ne(e)) {
    const t = e?.[0];
    return {
      source: e,
      target: t,
      prop: je(t, e?.[1])
    };
  }
  return {
    source: e,
    target: e,
    prop: null
  };
}, cr = (e, t, r, n, l, u, s) => ({
  source: e,
  target: t,
  value: r,
  prop: n,
  name: n,
  oldValue: l,
  trigger: u,
  args: s
}), yr = (e, t, r, n = ["*"]) => {
  const l = j(e?.[1]) ? e?.[1] : null;
  return g(e?.[0], l, r, n);
}, ar = (e, t, r, n = ["*"]) => e?.then?.((l) => g?.(l, t, r, n))?.catch?.((l) => (console.warn(l), null)), g = (e, t, r = () => {
}, n) => {
  let l = null;
  if (typeof t == "function" ? (n = r, r = t) : l = je(e, t), (typeof r == "object" || Array.isArray(r)) && (n = r, r = () => {
  }), (T(e) || typeof e == "symbol") && me(n).triggerImmediately)
    return qe(globalThis?.Promise?.try?.(() => r?.(e, null, null, null, pe)));
  if (typeof e?.[ue] == "function") return e?.[ue]?.(r, l, n);
  if (Be(e)) {
    const u = e;
    if (J?.has?.(e = e?.[w] ?? e)) return J?.get?.(e)?.(u, l, r, n);
    if (K(u) || ne(e) && K(e?.[0]))
      return ye(e) ? J?.getOrInsert?.(e, ar)?.(e, l, r, n) : ne(e) ? J?.getOrInsert?.(e, yr)?.(e, l, r, n) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? J?.getOrInsert?.(e, ur)?.(e, l, r, n) : J?.getOrInsert?.(e, ir)?.(u, l, r, n);
    {
      const s = St(r, n, pe);
      return s ? qe(globalThis?.Promise?.try?.(() => ne(e) ? We?.(e?.[0], e?.[1], s, null) : l != null && l != Symbol.iterator ? We?.(e, l, s, null) : nt?.(e, s, null))) : void 0;
    }
  }
};
function dr(e, t, r) {
  if (e == null || typeof e != "function") return;
  if (sr(t) && r === void 0) return Xe(e, t);
  if (t == null) return Xe(e, r);
  const n = ht(r), l = {
    affectTypes: n.affectTypes,
    triggerImmediately: n.triggerImmediately
  }, u = fr(t).map((s) => {
    const i = or(s);
    return g(i.target, i.prop, (f, o, c, a, ...v) => e(cr(i.source, i.target, f, o, c, a ?? null, v)), l);
  }).filter((s) => typeof s == "function");
  return () => u.forEach((s) => s?.());
}
function Mr(e, t, r) {
  return dr(t, e, r);
}
var Er = (e) => e instanceof Set ? mt(e) : e instanceof Map ? Sr(e) : e, hr = class {
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
}, Me = new hr();
function vr(e, t, r = ["*"]) {
  if (!e || typeof e != "object" && typeof e != "function") return;
  if (Me.has([e, t])) return Me.get([e, t]);
  const n = (l, u, s, i) => {
    if (u == "value") {
      const f = (s?.value ?? s)?.entries?.(), o = e?.value ?? l?.value ?? l;
      if (f) for (const [c, a] of f) {
        const v = a ?? (s?.value ?? s)?.[c] ?? null, m = o?.[c];
        v == null && m != null ? t(m, c, null, "add") : v != null && m == null ? t(null, c, v, "delete") : A(v, m) && t(m, c, v, "set");
      }
      return vr(l ?? e?.value, t, r);
    }
    return u == null ? void 0 : e[u];
  };
  return Me.getOrInsertComputed([e, t], () => e instanceof Set ? g([mt(e), Symbol.iterator], t, r) : e instanceof Map ? g(e, t, r) : W(e) ? g(e, n, r) : Array.isArray(e) && !(e?.length == 2 && j(e?.[1]) && K(e?.[0])) ? g([e, Symbol.iterator], t, r) : g(e, t, r));
}
function Ee(e, t) {
  return xt(e, (r) => {
    const n = Array.isArray(r) && r?.length == 2 && ["object", "function"].indexOf(typeof r?.[0]) >= 0 && j(r?.[1]), l = n ? r?.[1] : null;
    r = n && l != null ? r?.[0] ?? r : r;
    const u = typeof r == "object" || typeof r == "function" ? r?.[w] ?? r : r;
    (r?.[ie] ?? S.get(u))?.unaffected?.(t, l);
  });
}
var pr = (e, t, r) => (g(t, null, (n, l) => {
  ae(e, n, l, !0);
}), r?.(() => e, (n) => {
  for (const l in n) ae(t, n[l], l, !0);
}, { deep: !0 }), e), kr = (e, t, r) => pr(t(ce(e)), e, r), $r = (e, t, r = () => "") => g(t, null, (n, l) => {
  l == r() && ae(e, n, null, !0);
}), _r = (e = []) => {
  const t = I({ value: 0 }), r = (i) => typeof i == "function" ? i() : W(i) ? i.value : i, l = mr([t, "value"], () => e.findIndex((i) => !!r(i)), "value"), u = () => {
    t.value++;
  }, s = [];
  K(e) && s.push(g(e, u, {
    affectTypes: [
      "add",
      "set",
      "delete"
    ],
    triggerImmediately: !1
  }));
  for (const i of e) W(i) && s.push(g([i, "value"], u, {
    affectTypes: ["setter"],
    triggerImmediately: !1
  }));
  return E(l, Symbol.dispose, () => s.forEach((i) => i?.())), l;
}, br = (e, t, r, n) => {
  if (T(e)) return e ? t : r;
  const l = () => t, u = () => r, s = (o) => (o != null && (e.value = W(o) ? o?.value : o), (W(e) ? e?.value : e) ? l() : u()), i = I({
    [d]: s(),
    [U]: n,
    [Symbol?.toStringTag]() {
      return String(s() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](o) {
      return C(s() ?? this[d], o);
    },
    set value(o) {
      this[d] = s(o);
    },
    get value() {
      return this[d] = s() ?? this[d];
    }
  }), f = g([e, "value"], () => {
    const o = i?.[d], c = s();
    i[d] = c, i?.[$]?.({
      key: "value",
      value: c,
      oldValue: o,
      trigger: "manual"
    });
  });
  return E(i, Symbol.dispose, f), i;
}, Wr = br, Vr = (e, t, r) => {
  r || (r = I({}));
  const n = g(e, (l, u, s) => {
    if (u == null) return;
    const i = t?.(l, u, s);
    typeof i == "object" ? At(r, i) : A(r[u], i) && (r[u] = i);
  });
  return r && E(r, Symbol.dispose, n), r;
}, zr = (...e) => {
  const t = I({});
  return e?.forEach?.((r) => g(r, (n, l, u) => {
    l != null && A(t[l], n) && (t[l] = n);
  })), t;
}, mt = (e) => {
  const t = I([]);
  return t.push(...Array.from(e?.values?.() || [])), E(t, Symbol.dispose, g(e, (r, n, l) => {
    if (A(r, l))
      if (l == null && r != null) t.push(r);
      else if (l != null && r == null) {
        const u = t.indexOf(l);
        u >= 0 && t.splice(u, 1);
      } else {
        const u = t.indexOf(l);
        u >= 0 && A(t[u], r) && (t[u] = r);
      }
  })), t;
}, Sr = (e) => {
  const t = I([]), r = Array.from(e.entries());
  return t.push(...r), E(t, Symbol.dispose, g(e, (n, l, u) => {
    if (A(n, u) || u == null && n != null || u != null && n == null)
      if (u != null && n == null) {
        let s = t.findIndex(([i, f]) => i == l);
        s < 0 && (s = t.findLastIndex(([i, f]) => u === f)), s >= 0 && t.splice(s, 1);
      } else {
        let s = t.findIndex(([i, f]) => i == l);
        s >= 0 && s < t.length ? A(t[s]?.[1], n) && (t[s] = [l, n]) : t.push([l, n]);
      }
  })), t;
}, F = /* @__PURE__ */ new WeakMap(), rt = (e, t, r = "value") => {
  const n = typeof e?.[1] == "function" && e?.length == 2, l = typeof t?.[1] == "function" && t?.length == 2, u = l ? t?.[1] : null, s = (j(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let i = s && !n ? e?.[1] : Array.isArray(e) ? null : r;
  !s && !n && (e = [e, i]), n && (e[1] = i);
  const f = (j(t?.[1]) || t?.[1] == Symbol.iterator) && t?.length == 2;
  let o = f && !l ? t?.[1] : Array.isArray(t) ? null : r;
  if (!f && !l && (t = [t, o]), l && (t[1] = o), i == null || o == null || le(i, e?.[0]) || le(o, t?.[0])) return;
  if (!((typeof t?.[0] == "object" || typeof t?.[0] == "function") && t?.[0] != null) && !Array.isArray(e[0]))
    return oe(t, () => {
      e[0][i] = t?.[0];
    }), () => {
    };
  const c = (p, x) => {
    const R = m?.deref?.(), _ = v?.deref?.();
    if (F?.get?.(R)?.get?.(i)?.bound == _) {
      let B = null;
      const Ge = F?.get?.(R)?.get?.(i)?.cmpfx;
      oe(_, () => {
        typeof Ge == "function" ? B = Ge?.(He(_) ?? p, x, null) : B = _?.[x] ?? p;
      });
      const Fe = He(B);
      A(R[i], Fe) && oe(_, () => {
        R[i] = Fe;
      });
    } else F?.get?.(R)?.get?.(i)?.dispose?.();
  }, a = () => {
    const p = m?.deref?.(), x = F?.get?.(p), R = x?.get?.(i);
    x?.delete?.(i), R?.unsub?.();
  }, v = t?.[0] != null && (typeof t?.[0] == "object" || typeof t?.[0] == "function") && !(t?.[0] instanceof WeakRef || typeof t?.[0]?.deref == "function") ? new WeakRef(t?.[0]) : t?.[0], m = e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function") && !(e?.[0] instanceof WeakRef || typeof e?.[0]?.deref == "function") ? new WeakRef(e?.[0]) : e?.[0];
  let b = {
    compute: c,
    dispose: a,
    cmpfx: u
  };
  const O = m?.deref?.(), M = v?.deref?.();
  return m instanceof WeakRef && (F?.get?.(O)?.get?.(i)?.bound != M && F?.get?.(O)?.delete?.(i), b = F?.getOrInsert?.(O, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(i, () => ({
    bound: M,
    cmpfx: u,
    unsub: null,
    compute: c,
    dispose: a
  })), b.unsub = g(t, c), b.cmpfx = u, E(O, Symbol.dispose, b?.dispose), E(M, Symbol.dispose, b?.dispose)), M && !Array.isArray(M) && oe(O, () => {
    M[o] ??= O?.[i] ?? M[o];
  }), b?.dispose;
}, Cr = (e, t, r = "value") => {
  const n = [rt(e, t, r), rt(t, e, r)];
  return () => n?.map?.((l) => l?.());
}, mr = (e, t, r, n = "value") => {
  const l = typeof e?.[1] == "function" && e?.length == 2, u = (j(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let s = u && !l ? e?.[1] : Array.isArray(e) ? null : n;
  if (!u && !l && (e = [u ? e?.[0] : e, s]), l && (e[1] = s), s == null || le(s, e?.[0])) return;
  let i, f;
  const o = (p, x) => {
    if (p ??= e?.[0]?.[s] ?? f ?? p, x || A(f, p) && p != null || i == null) {
      let R = t?.(p, s, f);
      return i = R, R;
    }
    return i;
  }, c = (p, x = "value", R, _) => {
    if (f = R ?? f, p ??= e?.[0]?.[s], A(f, p) && p != null || i == null) {
      let B = t?.(p, s, f, _);
      return f = p, (A(B, i) || i == null) && (b[x] = i = B, i = b[x]), B;
    }
    return b[x];
  }, a = o(e[0][s] ?? f), v = k(a), m = /* @__PURE__ */ Symbol.for("@@apply");
  Object.defineProperty(c, V, {
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
  }), Object.defineProperty(c, m, {
    value: (p) => (p == null || (b.value = p), b?.value),
    writable: !1
  });
  const b = I(c), O = (p, x) => {
    if (k(p)) return Promise.resolve(p).then((_) => {
      const B = b?.[d];
      return b[d] = _, b?.[$]?.({
        key: "value",
        value: _,
        oldValue: B,
        trigger: "resolved"
      }), _;
    });
    const R = b?.[d];
    return b[d] = p, b?.[$]?.({
      key: "value",
      value: p,
      oldValue: R,
      trigger: x
    }), p;
  };
  v && O(a, "resolved");
  const M = g([e?.[0] ?? e, s ?? "value"], () => {
    O(o(), "manual");
  });
  return E(b, Symbol.dispose, M), b;
}, Nr = (e, t, r = 100) => {
  let n;
  return g(e, "value", (l) => {
    !l && n ? (clearTimeout(n), n = null) : l && !n && (n = De(e, t, r) ?? n);
  });
};
export {
  ue as $affected,
  tr as $ref,
  lt as $resolved,
  $ as $trigger,
  Ot as $triggerControl,
  Se as $triggerLess,
  h as $triggerLock,
  Pt as AssignObjectHandler,
  hr as DoubleWeakMap,
  E as addToCallChain,
  g as affected,
  rt as assign,
  F as assignMap,
  pr as bindBy,
  $r as bindByKey,
  Lt as booleanRef,
  mr as computed,
  Wr as conditional,
  _r as conditionalIndex,
  br as conditionalRef,
  Rr as delayedBehavior,
  Pr as delayedOrInstantBehavior,
  Nr as delayedSubscribe,
  N as deref,
  kr as derivate,
  dr as effect,
  Mr as effected,
  K as isObservable,
  vr as iterated,
  Cr as link,
  Er as makeArrayObservable,
  Ar as makeObjectAssignable,
  pt as makeResolvedOp,
  Yt as numberRef,
  Sr as observableByMap,
  mt as observableBySet,
  I as observe,
  xr as promised,
  er as propRef,
  nr as recoverReactive,
  rr as ref,
  Vr as remap,
  Ze as resolved,
  ce as safe,
  J as specializedSubscribe,
  Zt as stringRef,
  ir as subscribeDirectly,
  ur as subscribeInput,
  yr as subscribePaired,
  ar as subscribeThenable,
  De as triggerWithDelay,
  Ee as unaffected,
  zr as unified,
  Tt as unwrap,
  Ir as useObservable,
  tt as wrapRef,
  wr as wrapSetAsArray
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vIHNyYy93cmFwL1N5bWJvbC50c1xuU3ltYm9sLm9ic2VydmFibGUgfHw9IFN5bWJvbC5mb3IoXCJvYnNlcnZhYmxlXCIpO1xuU3ltYm9sLnN1YnNjcmliZSB8fD0gU3ltYm9sLmZvcihcInN1YnNjcmliZVwiKTtcblN5bWJvbC51bnN1YnNjcmliZSB8fD0gU3ltYm9sLmZvcihcInVuc3Vic2NyaWJlXCIpO1xudmFyICR2YWx1ZSA9IFN5bWJvbC5mb3IoXCJAdmFsdWVcIik7XG52YXIgJGV4dHJhY3RLZXkkID0gU3ltYm9sLmZvcihcIkBleHRyYWN0XCIpO1xudmFyICRvcmlnaW5hbEtleSQgPSBTeW1ib2wuZm9yKFwiQG9yaWdpblwiKTtcbnZhciAkcmVnaXN0cnlLZXkkID0gU3ltYm9sLmZvcihcIkByZWdpc3RyeVwiKTtcbnZhciAkYmVoYXZpb3IgPSBTeW1ib2wuZm9yKFwiQGJlaGF2aW9yXCIpO1xudmFyICRwcm9taXNlID0gU3ltYm9sLmZvcihcIkBwcm9taXNlXCIpO1xudmFyICRyZXNvbHZlZCA9IFN5bWJvbC5mb3IoXCJAcmVzb2x2ZWRcIik7XG52YXIgJHRyaWdnZXJMZXNzID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyLWxlc3NcIik7XG52YXIgJHRyaWdnZXJMb2NrID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyLWxvY2tcIik7XG52YXIgJHRyaWdnZXJDb250cm9sID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyLWNvbnRyb2xcIik7XG52YXIgJHRyaWdnZXIgPSBTeW1ib2wuZm9yKFwiQHRyaWdnZXJcIik7XG52YXIgJGFmZmVjdGVkID0gU3ltYm9sLmZvcihcIkBzdWJzY3JpYmVcIik7XG52YXIgJGlzTm90RXF1YWwgPSBTeW1ib2wuZm9yKFwiQGlzTm90RXF1YWxcIik7XG52YXIgJHJlYWxQcm9wID0gU3ltYm9sLmZvcihcIkByZWFsUHJvcFwiKTtcblxuLy8gc3JjL3dyYXAvVXRpbHMudHNcbnZhciAkb3JpZ2luYWxPYmplY3RzJCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHNhZmUgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHVud3JhcCA9IHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0IDogdGFyZ2V0LCBtYXBwZWQgPSAoZSkgPT4gc2FmZShlKTtcblx0aWYgKEFycmF5LmlzQXJyYXkodW53cmFwKSkgcmV0dXJuIHVud3JhcD8ubWFwPy4obWFwcGVkKSB8fCBBcnJheS5mcm9tKHVud3JhcCB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkgfHwgW107XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIE1hcCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrTWFwKSByZXR1cm4gbmV3IE1hcChBcnJheS5mcm9tKHVud3JhcD8uZW50cmllcz8uKCkgfHwgW10pPy5tYXA/LigoW0ssIFZdKSA9PiBbSywgc2FmZShWKV0pKTtcblx0ZWxzZSBpZiAodW53cmFwIGluc3RhbmNlb2YgU2V0IHx8IHVud3JhcCBpbnN0YW5jZW9mIFdlYWtTZXQpIHJldHVybiBuZXcgU2V0KEFycmF5LmZyb20odW53cmFwPy52YWx1ZXM/LigpIHx8IFtdKT8ubWFwPy4obWFwcGVkKSk7XG5cdGVsc2UgaWYgKHVud3JhcCAhPSBudWxsICYmIHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJvYmplY3RcIikgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhBcnJheS5mcm9tKE9iamVjdC5lbnRyaWVzKHVud3JhcCB8fCB7fSkgfHwgW10pPy5maWx0ZXI/LigoW0tdKSA9PiBLICE9ICRleHRyYWN0S2V5JCAmJiBLICE9ICRvcmlnaW5hbEtleSQgJiYgSyAhPSAkcmVnaXN0cnlLZXkkKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdHJldHVybiB1bndyYXA7XG59O1xudmFyIHVud3JhcCA9IChhcnIpID0+IHtcblx0cmV0dXJuIGFycj8uWyRleHRyYWN0S2V5JF0gPz8gYXJyPy5bXCJAdGFyZ2V0XCJdID8/IGFycjtcbn07XG52YXIgZGVyZWYgPSAodGFyZ2V0LCBkaXNjb3VudFZhbHVlID0gZmFsc2UpID0+IHtcblx0Y29uc3Qgb3JpZ2luYWwgPSB0YXJnZXQ7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJzeW1ib2xcIikgcmV0dXJuIHRhcmdldDtcblx0aWYgKHRhcmdldCAhPSBudWxsICYmICh0YXJnZXQgaW5zdGFuY2VvZiBXZWFrUmVmIHx8IFwiZGVyZWZcIiBpbiB0YXJnZXQgJiYgdHlwZW9mIHRhcmdldD8uZGVyZWYgPT0gXCJmdW5jdGlvblwiKSkgdGFyZ2V0ID0gdGFyZ2V0Py5kZXJlZj8uKCk7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSkge1xuXHRcdHRhcmdldCA9IHVud3JhcCh0YXJnZXQpO1xuXHRcdGNvbnN0ICR2YWwgPSBkaXNjb3VudFZhbHVlICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgdGFyZ2V0Py52YWx1ZTtcblx0XHRpZiAoJHZhbCAhPSBudWxsICYmICh0eXBlb2YgJHZhbCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiAkdmFsID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9ICR2YWw7XG5cdFx0aWYgKG9yaWdpbmFsICE9IHRhcmdldCkgcmV0dXJuIGRlcmVmKHRhcmdldCwgZGlzY291bnRWYWx1ZSk7XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbn07XG52YXIgaXNUaGVuYWJsZSA9ICh2YWwpID0+IHZhbCAhPSBudWxsICYmIHR5cGVvZiB2YWwudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xudmFyIHdpdGhQcm9taXNlID0gKHRhcmdldCwgY2IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKHRhcmdldCkgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjYj8uKHRhcmdldCk7XG5cdGlmIChpc1RoZW5hYmxlKHRhcmdldCkpIHJldHVybiB0YXJnZXQudGhlbihjYik7XG5cdGlmICh0eXBlb2YgdGFyZ2V0Py5yZXNvbHZlZCA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBQcm9taXNlLnJlc29sdmUodGFyZ2V0LnJlc29sdmVkKCkpLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5wcm9taXNlICYmIGlzVGhlbmFibGUodGFyZ2V0LnByb21pc2UpKSByZXR1cm4gdGFyZ2V0LnByb21pc2UudGhlbihjYik7XG5cdGlmICh0YXJnZXQ/LlskcHJvbWlzZV0gJiYgaXNUaGVuYWJsZSh0YXJnZXRbJHByb21pc2VdKSkgcmV0dXJuIHRhcmdldFskcHJvbWlzZV0udGhlbihjYik7XG5cdHJldHVybiBjYj8uKHRhcmdldCk7XG59O1xudmFyIGRpc3Bvc2VNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBkaXNwb3NlUmVnaXN0cnkgPSBuZXcgRmluYWxpemF0aW9uUmVnaXN0cnkoKGNhbGxzdGFjaykgPT4ge1xuXHRjYWxsc3RhY2s/LmZvckVhY2g/LigoY2IpID0+IGNiPy4oKSk7XG59KTtcbmZ1bmN0aW9uIGFkZFRvQ2FsbENoYWluKG9iaiwgbWV0aG9kS2V5LCBjYWxsYmFjaykge1xuXHRpZiAoIWNhbGxiYWNrIHx8IHR5cGVvZiBjYWxsYmFjayAhPSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIG9iaiAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmogIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGlmIChtZXRob2RLZXkgPT0gU3ltYm9sLmRpc3Bvc2UpIHtcblx0XHRjb25zdCBjaGFpblRhcmdldCA9IG9iaj8uWyRleHRyYWN0S2V5JF0gPz8gb2JqO1xuXHRcdGRpc3Bvc2VNYXA/LmdldE9ySW5zZXJ0Q29tcHV0ZWQ/LihjaGFpblRhcmdldCwgKCkgPT4ge1xuXHRcdFx0Y29uc3QgQ2FsbENoYWluID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0XHRcdGlmICh0eXBlb2YgY2hhaW5UYXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2hhaW5UYXJnZXQgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdGRpc3Bvc2VSZWdpc3RyeS5yZWdpc3RlcihjaGFpblRhcmdldCwgQ2FsbENoYWluKTtcblx0XHRcdFx0ZGlzcG9zZU1hcC5zZXQoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGNoYWluVGFyZ2V0W1N5bWJvbC5kaXNwb3NlXSA/Pz0gKCkgPT4gQ2FsbENoYWluLmZvckVhY2goKGNiKSA9PiB7XG5cdFx0XHRcdFx0Y2I/LigpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBDYWxsQ2hhaW47XG5cdFx0fSk/LmFkZD8uKGNhbGxiYWNrKTtcblx0fSBlbHNlIG9ialttZXRob2RLZXldID0gZnVuY3Rpb24oLi4uYXJncykge1xuXHRcdGNvbnN0IG9yaWdpbmFsID0gb2JqPy5bbWV0aG9kS2V5XTtcblx0XHRpZiAodHlwZW9mIG9yaWdpbmFsID09IFwiZnVuY3Rpb25cIikgb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0Y2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG5cdH07XG59XG52YXIgaXNBcnJheUluZGV4ID0gKHByb3ApID0+IHtcblx0aWYgKHR5cGVvZiBwcm9wICE9PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsc2U7XG5cdGlmIChwcm9wID09PSBcIlwiKSByZXR1cm4gZmFsc2U7XG5cdGNvbnN0IG51bSA9IE51bWJlcihwcm9wKTtcblx0cmV0dXJuIE51bWJlci5pc0ludGVnZXIobnVtKSAmJiBudW0gPj0gMCAmJiBTdHJpbmcobnVtKSA9PT0gcHJvcDtcbn07XG5mdW5jdGlvbiB3cmFwU2V0QXNBcnJheShzb3VyY2UgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG5cdGxldCBiYWNraW5nU2V0ID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0Y29uc3Qgbm90aWZ5RHVwbGljYXRlID0gKHZhbHVlLCB2aWEsIGluZGV4KSA9PiB7XG5cdFx0b3B0aW9ucy5vbkR1cGxpY2F0ZT8uKHtcblx0XHRcdHZhbHVlLFxuXHRcdFx0dmlhLFxuXHRcdFx0aW5kZXhcblx0XHR9KTtcblx0fTtcblx0aWYgKHNvdXJjZSBpbnN0YW5jZW9mIFNldCkgYmFja2luZ1NldCA9IHNvdXJjZTtcblx0ZWxzZSBmb3IgKGNvbnN0IGl0ZW0gb2Ygc291cmNlKSB7XG5cdFx0aWYgKGJhY2tpbmdTZXQuaGFzKGl0ZW0pKSB7XG5cdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJwdXNoXCIpO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGJhY2tpbmdTZXQuYWRkKGl0ZW0pO1xuXHR9XG5cdGNvbnN0IHNuYXBzaG90ID0gKCkgPT4gQXJyYXkuZnJvbShiYWNraW5nU2V0KTtcblx0Y29uc3QgcmVidWlsZEZyb20gPSAoYXJyKSA9PiB7XG5cdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdGZvciAoY29uc3QgaXRlbSBvZiBhcnIpIGJhY2tpbmdTZXQuYWRkKGl0ZW0pO1xuXHR9O1xuXHRjb25zdCBtZXRob2RzID0ge1xuXHRcdHB1c2g6ICguLi5pdGVtcykgPT4ge1xuXHRcdFx0bGV0IHNpemUgPSBiYWNraW5nU2V0LnNpemU7XG5cdFx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcblx0XHRcdFx0aWYgKGJhY2tpbmdTZXQuaGFzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0XHRcdFx0c2l6ZSsrO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNpemU7XG5cdFx0fSxcblx0XHRwb3A6ICgpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRpZiAoIWFyci5sZW5ndGgpIHJldHVybiB2b2lkIDA7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IGFyclthcnIubGVuZ3RoIC0gMV07XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHRzaGlmdDogKCkgPT4ge1xuXHRcdFx0Y29uc3QgaXRlcmF0b3IgPSBiYWNraW5nU2V0LnZhbHVlcygpLm5leHQoKTtcblx0XHRcdGlmIChpdGVyYXRvci5kb25lKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBpdGVyYXRvci52YWx1ZTtcblx0XHRcdGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHVuc2hpZnQ6ICguLi5pdGVtcykgPT4ge1xuXHRcdFx0aWYgKCFpdGVtcy5sZW5ndGgpIHJldHVybiBiYWNraW5nU2V0LnNpemU7XG5cdFx0XHRjb25zdCBjdXJyZW50ID0gc25hcHNob3QoKTtcblx0XHRcdGNvbnN0IHRvUHJlcGVuZCA9IFtdO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChjdXJyZW50Py5pbmNsdWRlcz8uKGl0ZW0pIHx8IHRvUHJlcGVuZD8uaW5jbHVkZXM/LihpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInVuc2hpZnRcIiwgMCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dG9QcmVwZW5kLnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXRvUHJlcGVuZC5sZW5ndGgpIHJldHVybiBjdXJyZW50Lmxlbmd0aDtcblx0XHRcdGNvbnN0IG5leHQgPSBbLi4udG9QcmVwZW5kLCAuLi5jdXJyZW50XTtcblx0XHRcdHJlYnVpbGRGcm9tKG5leHQpO1xuXHRcdFx0cmV0dXJuIG5leHQubGVuZ3RoO1xuXHRcdH0sXG5cdFx0c3BsaWNlOiAoc3RhcnQsIGRlbGV0ZUNvdW50LCAuLi5pdGVtcykgPT4ge1xuXHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdGNvbnN0IG5vcm1hbGl6ZWRTdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHN0YXJ0LCAwKSwgYXJyLmxlbmd0aCk7XG5cdFx0XHRjb25zdCBhY3R1YWxEZWxldGVDb3VudCA9IGRlbGV0ZUNvdW50ID09PSB2b2lkIDAgPyBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0IDogTWF0aC5tYXgoMCwgTWF0aC5taW4oZGVsZXRlQ291bnQsIGFyci5sZW5ndGggLSBub3JtYWxpemVkU3RhcnQpKTtcblx0XHRcdGNvbnN0IHJlbW92ZWQgPSBhcnIuc3BsaWNlKG5vcm1hbGl6ZWRTdGFydCwgYWN0dWFsRGVsZXRlQ291bnQpO1xuXHRcdFx0bGV0IGluc2VydFBvc2l0aW9uID0gbm9ybWFsaXplZFN0YXJ0O1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChhcnI/LmluY2x1ZGVzPy4oaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJzcGxpY2VcIiwgaW5zZXJ0UG9zaXRpb24pO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFyci5zcGxpY2UoaW5zZXJ0UG9zaXRpb24rKywgMCwgaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRyZWJ1aWxkRnJvbShhcnIpO1xuXHRcdFx0cmV0dXJuIHJlbW92ZWQ7XG5cdFx0fSxcblx0XHRpbmNsdWRlczogKHZhbHVlKSA9PiBiYWNraW5nU2V0Lmhhcyh2YWx1ZSksXG5cdFx0aW5kZXhPZjogKHZhbHVlKSA9PiBzbmFwc2hvdCgpLmluZGV4T2YodmFsdWUpLFxuXHRcdGNsZWFyOiAoKSA9PiB7XG5cdFx0XHRiYWNraW5nU2V0LmNsZWFyKCk7XG5cdFx0fSxcblx0XHRkZWxldGU6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5kZWxldGUodmFsdWUpLFxuXHRcdHRvQXJyYXk6ICgpID0+IHNuYXBzaG90KCksXG5cdFx0dG9TZXQ6ICgpID0+IG5ldyBTZXQoYmFja2luZ1NldCksXG5cdFx0W1N5bWJvbC5pdGVyYXRvcl06ICgpID0+IGJhY2tpbmdTZXRbU3ltYm9sLml0ZXJhdG9yXSgpXG5cdH07XG5cdHJldHVybiBuZXcgUHJveHkobWV0aG9kcywge1xuXHRcdGdldDogKF8sIHByb3ApID0+IHtcblx0XHRcdGlmIChwcm9wID09PSBcImxlbmd0aFwiKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkgcmV0dXJuIHNuYXBzaG90KClbTnVtYmVyKHByb3ApXTtcblx0XHRcdGNvbnN0IHZhbHVlID0gbWV0aG9kc1twcm9wXTtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHZhbHVlO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2V0OiAoXywgcHJvcCwgdmFsdWUpID0+IHtcblx0XHRcdGlmIChwcm9wID09PSBcImxlbmd0aFwiKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgIT09IFwibnVtYmVyXCIgfHwgIU51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgfHwgdmFsdWUgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcImxlbmd0aCBtdXN0IGJlIGEgZmluaXRlIG5vbi1uZWdhdGl2ZSBudW1iZXJcIik7XG5cdFx0XHRcdGNvbnN0IG5leHRMZW5ndGggPSBNYXRoLmZsb29yKHZhbHVlKTtcblx0XHRcdFx0aWYgKG5leHRMZW5ndGggPj0gYmFja2luZ1NldC5zaXplKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKS5zbGljZSgwLCBuZXh0TGVuZ3RoKTtcblx0XHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRpZiAoaW5kZXggPiBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0Y29uc3QgbmV4dFZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdGlmIChpbmRleCA8IGFyci5sZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBjdXJyZW50VmFsdWUgPSBhcnJbaW5kZXhdO1xuXHRcdFx0XHRcdGlmIChPYmplY3QuaXMoY3VycmVudFZhbHVlLCBuZXh0VmFsdWUpKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAoYXJyLnNvbWUoKGl0ZW0sIGlkeCkgPT4gaWR4ICE9PSBpbmRleCAmJiBPYmplY3QuaXMoaXRlbSwgbmV4dFZhbHVlKSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnJbaW5kZXhdID0gbmV4dFZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChhcnI/LmluY2x1ZGVzPy4obmV4dFZhbHVlKSkge1xuXHRcdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKG5leHRWYWx1ZSwgXCJzZXRcIiwgaW5kZXgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFyci5wdXNoKG5leHRWYWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5zZXQobWV0aG9kcywgcHJvcCwgdmFsdWUpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlUHJvcGVydHk6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID49IGFyci5sZW5ndGgpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRhcnIuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShtZXRob2RzLCBwcm9wKTtcblx0XHR9LFxuXHRcdG93bktleXM6ICgpID0+IHtcblx0XHRcdGNvbnN0IGtleXMgPSBbXTtcblx0XHRcdGxldCBpID0gMDtcblx0XHRcdGZvciAoY29uc3QgXyBvZiBiYWNraW5nU2V0KSBrZXlzLnB1c2goU3RyaW5nKGkrKykpO1xuXHRcdFx0a2V5cy5wdXNoKFwibGVuZ3RoXCIpO1xuXHRcdFx0cmV0dXJuIGtleXM7XG5cdFx0fSxcblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHtcblx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcblx0XHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHR2YWx1ZTogYmFja2luZ1NldC5zaXplXG5cdFx0XHR9O1xuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID49IGFyci5sZW5ndGgpIHJldHVybiB2b2lkIDA7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRcdFx0dmFsdWU6IGFycltpbmRleF1cblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtZXRob2RzLCBwcm9wKTtcblx0XHR9LFxuXHRcdGhhczogKF8sIHByb3ApID0+IHtcblx0XHRcdGlmIChwcm9wID09PSBcImxlbmd0aFwiKSByZXR1cm4gdHJ1ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgYmFja2luZ1NldC5zaXplO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHByb3AgaW4gbWV0aG9kcztcblx0XHR9XG5cdH0pO1xufVxuXG4vLyBzcmMvd3JhcC9Bc3NpZ25PYmplY3QudHNcbnZhciBBc3NpZ25PYmplY3RIYW5kbGVyID0gY2xhc3Mge1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdG9iamVjdEFzc2lnbih0YXJnZXQsIHZhbHVlLCBuYW1lKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIikgcmV0dXJuIHRhcmdldD8uW25hbWVdID8/IHRhcmdldDtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBuYW1lLCBjdHgpO1xuXHR9XG59O1xudmFyIG1ha2VPYmplY3RBc3NpZ25hYmxlID0gKG9iaikgPT4ge1xuXHRpZiAob2JqPy5bJG9yaWdpbmFsS2V5JF0gfHwgJG9yaWdpbmFsT2JqZWN0cyQuaGFzKG9iaikpIHJldHVybiBvYmo7XG5cdGNvbnN0IHB4ID0gbmV3IFByb3h5KG9iaiwgbmV3IEFzc2lnbk9iamVjdEhhbmRsZXIoKSk7XG5cdCRvcmlnaW5hbE9iamVjdHMkLnNldChweCwgb2JqKTtcblx0cmV0dXJuIHB4O1xufTtcblxuLy8gc3JjL2NvcmUvU3Vic2NyaXB0LnRzXG52YXIgd2l0aFVuc3ViU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0B3aXRoVW5zdWJcIik7XG5nbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdpdGhVbnN1YiA9IGdsb2JhbFRoaXNbd2l0aFVuc3ViU3ltYm9sXTtcbnZhciBjb21wbGV0ZVdpdGhVbnN1YiA9IChzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKSA9PiB7XG5cdHJldHVybiB3aXRoVW5zdWIuZ2V0T3JJbnNlcnQoc3Vic2NyaWJlciwgKCkgPT4ge1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gd2Vhaz8uZGVyZWY/LigpO1xuXHRcdHJlZ2lzdHJ5Py5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdGNvbnN0IHNhdkNvbXBsZXRlID0gc3Vic2NyaWJlcj8uY29tcGxldGU/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRjb25zdCB1bmFmZmVjdGVkID0gKCkgPT4ge1xuXHRcdFx0Y29uc3QgciA9IHNhdkNvbXBsZXRlPy4oKTtcblx0XHRcdHJlZ2lzdHJ5Py51bmFmZmVjdGVkPy4oaGFuZGxlcik7XG5cdFx0XHRyZXR1cm4gcjtcblx0XHR9O1xuXHRcdHN1YnNjcmliZXIuY29tcGxldGUgPSB1bmFmZmVjdGVkO1xuXHRcdHJldHVybiB7XG5cdFx0XHR1bmFmZmVjdGVkLFxuXHRcdFx0W1N5bWJvbC5kaXNwb3NlXTogdW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuYXN5bmNEaXNwb3NlXTogdW5hZmZlY3RlZFxuXHRcdH07XG5cdH0pO1xufTtcbnZhciBzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAc3Vic2NyaXB0UmVnaXN0cnlcIik7XG5nbG9iYWxUaGlzW3N1YnNjcmlwdFJlZ2lzdHJ5U3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgc3Vic2NyaXB0UmVnaXN0cnkgPSBnbG9iYWxUaGlzW3N1YnNjcmlwdFJlZ2lzdHJ5U3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0BnbG9iYWxFZmZlY3RMaXN0ZW5lcnNcIik7XG5nbG9iYWxUaGlzW2dsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG52YXIgZ2xvYmFsRWZmZWN0TGlzdGVuZXJzID0gZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdO1xudmFyIGVmZmVjdEdsb2JhbGx5ID0gKGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoY2IgPT0gbnVsbCB8fCB0eXBlb2YgY2IgIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVFZmZlY3RPcHRpb25zKG9wdGlvbnMpO1xuXHRnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2V0KGNiLCBub3JtYWxpemVkLmFmZmVjdFR5cGVzKTtcblx0cmV0dXJuICgpID0+IGdsb2JhbEVmZmVjdExpc3RlbmVycy5kZWxldGUoY2IpO1xufTtcbnZhciB3cmFwcGVkU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0B3cmFwcGVkXCIpO1xuZ2xvYmFsVGhpc1t3cmFwcGVkU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgd3JhcHBlZCA9IGdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF07XG52YXIgcmVnaXN0ZXIgPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdGNvbnN0IHVud3JhcCA9IHdoYXQ/LlskZXh0cmFjdEtleSRdID8/IHdoYXQ7XG5cdGxldCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh1bndyYXApO1xuXHRpZiAoIXJlZ2lzdHJ5KSB7XG5cdFx0cmVnaXN0cnkgPSBuZXcgU3Vic2NyaXB0KHVud3JhcCk7XG5cdFx0c3Vic2NyaXB0UmVnaXN0cnkuc2V0KHVud3JhcCwgcmVnaXN0cnkpO1xuXHR9IGVsc2UgcmVnaXN0cnkuYmluZFNvdXJjZSh1bndyYXApO1xuXHRyZXR1cm4gaGFuZGxlO1xufTtcbnZhciB3cmFwV2l0aCA9ICh3aGF0LCBoYW5kbGUpID0+IHtcblx0d2hhdCA9IGRlcmVmKHdoYXQ/LlskZXh0cmFjdEtleSRdID8/IHdoYXQpO1xuXHRpZiAodHlwZW9mIHdoYXQgPT0gXCJzeW1ib2xcIiB8fCAhKHR5cGVvZiB3aGF0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHdoYXQgPT0gXCJmdW5jdGlvblwiKSB8fCB3aGF0ID09IG51bGwpIHJldHVybiB3aGF0O1xuXHRyZXR1cm4gd3JhcHBlZC5nZXRPckluc2VydENvbXB1dGVkKHdoYXQsICgpID0+IG5ldyBQcm94eSh3aGF0LCByZWdpc3Rlcih3aGF0LCBoYW5kbGUpKSk7XG59O1xudmFyIGZvckFsbCA9IFN5bWJvbC5mb3IoXCJAYWxsUHJvcHNcIik7XG52YXIgd2lsZGNhcmRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcIipcIiwgXCJhbGxcIl0pO1xudmFyIHRyaWdnZXJBbGlhc2VzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoW1xuXHRbXCJzZXRcIiwgW1wic2V0dGVyXCIsIFwiQHNldFwiXV0sXG5cdFtcImFkZFwiLCBbXCJAYWRkXCJdXSxcblx0W1wiZGVsZXRlXCIsIFtcIkBkZWxldGVcIl1dLFxuXHRbXCJpbnZhbGlkYXRlXCIsIFtcIkBpbnZhbGlkYXRlXCJdXSxcblx0W1wibWFudWFsXCIsIFtcIkBtYW51YWxcIl1dLFxuXHRbXCJjdXN0b21cIiwgW1wiQGN1c3RvbVwiXV0sXG5cdFtcInJlc29sdmVkXCIsIFtcIkByZXNvbHZlZFwiXV0sXG5cdFtcInNldEFsbFwiLCBbXCJAc2V0QWxsXCJdXSxcblx0W1wiYWRkQWxsXCIsIFtcIkBhZGRBbGxcIl1dLFxuXHRbXCJkZWxldGVBbGxcIiwgW1wiQGRlbGV0ZUFsbFwiLCBcIkBjbGVhclwiXV1cbl0pO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAdHJpZ2dlckNhbm9uaWNhbE5hbWVzXCIpO1xuZ2xvYmFsVGhpc1t0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2xdID8/PSBuZXcgTWFwKEFycmF5LmZyb20odHJpZ2dlckFsaWFzZXMuZW50cmllcygpKS5mbGF0TWFwKChbY2Fub25pY2FsLCBhbGlhc2VzXSkgPT4gYWxpYXNlcy5tYXAoKGFsaWFzKSA9PiBbYWxpYXMsIGNhbm9uaWNhbF0pKSk7XG52YXIgdHJpZ2dlckNhbm9uaWNhbE5hbWVzID0gZ2xvYmFsVGhpc1t0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2xdO1xudmFyIG5vcm1hbGl6ZVRyaWdnZXJOYW1lID0gKHRyaWdnZXIgPSBcInNldFwiKSA9PiB7XG5cdGlmICh0cmlnZ2VyID09IG51bGwpIHJldHVybiB0cmlnZ2VyO1xuXHRjb25zdCBuYW1lID0gU3RyaW5nKHRyaWdnZXIgfHwgXCJzZXRcIik7XG5cdHJldHVybiB0cmlnZ2VyQ2Fub25pY2FsTmFtZXMuZ2V0KG5hbWUpID8/IG5hbWU7XG59O1xudmFyIHRyaWdnZXJOYW1lc09mID0gKHRyaWdnZXIpID0+IHtcblx0Y29uc3QgbmFtZSA9IHRyaWdnZXIgPT0gbnVsbCA/IFwiYWxsXCIgOiBTdHJpbmcobm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gXCJhbGxcIik7XG5cdHJldHVybiBbbmFtZSwgLi4udHJpZ2dlckFsaWFzZXMuZ2V0KG5hbWUpID8/IFtdXTtcbn07XG52YXIgZXhwYW5kVHJpZ2dlckZpbHRlciA9ICh0eXBlcyA9IFtcIipcIl0pID0+IHtcblx0cmV0dXJuIG5ldyBTZXQoWy4uLm5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHlwZXMpXS5mbGF0TWFwKChuYW1lKSA9PiBbbmFtZSwgLi4udHJpZ2dlckFsaWFzZXMuZ2V0KG5hbWUpID8/IFtdXSkpO1xufTtcbnZhciBub3JtYWxpemVUcmlnZ2VyRmlsdGVyID0gKHRyaWdnZXJzID0gW1wiKlwiXSkgPT4ge1xuXHRjb25zdCBsaXN0ID0gdHlwZW9mIHRyaWdnZXJzID09IFwic3RyaW5nXCIgPyBbdHJpZ2dlcnNdIDogQXJyYXkuZnJvbSh0cmlnZ2VycyA/PyBbXCIqXCJdKTtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5ldyBTZXQobGlzdC5tYXAoKGl0ZW0pID0+IHtcblx0XHRjb25zdCBuYW1lID0gU3RyaW5nKGl0ZW0gfHwgXCIqXCIpO1xuXHRcdHJldHVybiB3aWxkY2FyZFRyaWdnZXJzLmhhcyhuYW1lKSA/IG5hbWUgOiBTdHJpbmcobm9ybWFsaXplVHJpZ2dlck5hbWUobmFtZSkgPz8gbmFtZSk7XG5cdH0pKTtcblx0cmV0dXJuIG5vcm1hbGl6ZWQuc2l6ZSA/IG5vcm1hbGl6ZWQgOiAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCJdKTtcbn07XG52YXIgdHJpZ2dlckZpbHRlckFsbG93cyA9ICh0cmlnZ2VycywgdHJpZ2dlcikgPT4ge1xuXHRjb25zdCBmaWx0ZXIgPSB0cmlnZ2VycyBpbnN0YW5jZW9mIFNldCA/IHRyaWdnZXJzIDogbm9ybWFsaXplVHJpZ2dlckZpbHRlcih0cmlnZ2Vycyk7XG5cdHJldHVybiBbLi4ud2lsZGNhcmRUcmlnZ2Vyc10uc29tZSgobmFtZSkgPT4gZmlsdGVyLmhhcyhuYW1lKSkgfHwgdHJpZ2dlck5hbWVzT2YodHJpZ2dlcikuc29tZSgobmFtZSkgPT4gZmlsdGVyLmhhcyhuYW1lKSk7XG59O1xudmFyIGlzT3B0aW9uc09iamVjdCA9IChvcHRpb25zKSA9PiB7XG5cdHJldHVybiAhIW9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShvcHRpb25zKSAmJiAoXCJhZmZlY3RUeXBlc1wiIGluIG9wdGlvbnMgfHwgXCJ0cmlnZ2Vyc1wiIGluIG9wdGlvbnMgfHwgXCJ0cmlnZ2VySW1tZWRpYXRlbHlcIiBpbiBvcHRpb25zKTtcbn07XG52YXIgbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zID0gKG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmIChpc09wdGlvbnNPYmplY3Qob3B0aW9ucykpIHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucy5hZmZlY3RUeXBlcyA/PyBvcHRpb25zLnRyaWdnZXJzID8/IFtcIipcIl0pLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogb3B0aW9ucy50cmlnZ2VySW1tZWRpYXRlbHkgIT09IGZhbHNlXG5cdH07XG5cdGNvbnN0IGFmZmVjdFR5cGVzID0gbm9ybWFsaXplVHJpZ2dlckZpbHRlcihvcHRpb25zKTtcblx0cmV0dXJuIHtcblx0XHRhZmZlY3RUeXBlcyxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IHRyaWdnZXJGaWx0ZXJBbGxvd3MoYWZmZWN0VHlwZXMsIFwiaW5pdGlhbFwiKVxuXHR9O1xufTtcbnZhciBub3JtYWxpemVFZmZlY3RPcHRpb25zID0gKG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmIChpc09wdGlvbnNPYmplY3Qob3B0aW9ucykpIHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucy5hZmZlY3RUeXBlcyA/PyBvcHRpb25zLnRyaWdnZXJzID8/IFtcIipcIl0pLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogb3B0aW9ucy50cmlnZ2VySW1tZWRpYXRlbHkgPT09IHRydWVcblx0fTtcblx0cmV0dXJuIHtcblx0XHRhZmZlY3RUeXBlczogbm9ybWFsaXplVHJpZ2dlckZpbHRlcihvcHRpb25zKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IGZhbHNlXG5cdH07XG59O1xudmFyIFN1YnNjcmlwdFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAU3Vic2NyaXB0XCIpO1xuZ2xvYmFsVGhpc1tTdWJzY3JpcHRTeW1ib2xdID8/PSBjbGFzcyBTdWJzY3JpcHQge1xuXHRjb21wYXRpYmxlO1xuXHQjc291cmNlO1xuXHQjbGlzdGVuZXJzO1xuXHQjZmxhZ3MgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtTZXQoKTtcblx0I25hdGl2ZTtcblx0I2l0ZXJhdG9yO1xuXHQjaW5EaXNwYXRjaCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCNkaXNhYmxlZFRyaWdnZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0I3RyaWdnZXJDb250cm9sO1xuXHQjcGVuZGluZyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNwZW5kaW5nQnlQcm9wID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0I2ZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5cdGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuXHRcdHRoaXMuI3NvdXJjZSA9IHNvdXJjZTtcblx0XHR0aGlzLiNsaXN0ZW5lcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdHRoaXMuI2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdFx0dGhpcy4jdHJpZ2dlckNvbnRyb2wgPSB7XG5cdFx0XHRlbmFibGU6ICh0eXBlcyA9IFtcIipcIl0sIGNiKSA9PiBjYiA/IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgdHJ1ZSksXG5cdFx0XHRkaXNhYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSA6IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBmYWxzZSksXG5cdFx0XHRzZXQ6ICh0eXBlcywgZW5hYmxlZCkgPT4gdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIGVuYWJsZWQpLFxuXHRcdFx0d2l0aDogKHR5cGVzLCBjYikgPT4gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIHRydWUsIGNiKSxcblx0XHRcdHdpdGhvdXQ6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCBmYWxzZSwgY2IpLFxuXHRcdFx0aXNFbmFibGVkOiAodHJpZ2dlcikgPT4gdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpXG5cdFx0fTtcblx0XHR0aGlzLiNpdGVyYXRvciA9IHsgbmV4dDogKGFyZ3MpID0+IHtcblx0XHRcdGlmIChhcmdzKSBBcnJheS5pc0FycmF5KGFyZ3MpID8gdGhpcy4jZGlzcGF0Y2goLi4uYXJncykgOiB0aGlzLiNkaXNwYXRjaChhcmdzKTtcblx0XHR9IH07XG5cdFx0Y29uc3Qgd2VhayA9IG5ldyBXZWFrUmVmKHRoaXMpO1xuXHRcdGNvbnN0IGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzdWJzY3JpYmVyKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gc3Vic2NyaWJlcj8ubmV4dD8uYmluZD8uKHN1YnNjcmliZXIpO1xuXHRcdFx0cmV0dXJuIGNvbXBsZXRlV2l0aFVuc3ViKHN1YnNjcmliZXIsIHdlYWssIGhhbmRsZXIpO1xuXHRcdH07XG5cdFx0dGhpcy4jbmF0aXZlID0gdHlwZW9mIE9ic2VydmFibGUgIT0gXCJ1bmRlZmluZWRcIiA/IG5ldyBPYnNlcnZhYmxlKGNvbnRyb2xsZXIpIDogbnVsbDtcblx0XHR0aGlzLmNvbXBhdGlibGUgPSAoKSA9PiB0aGlzLiNuYXRpdmU7XG5cdH1cblx0YmluZFNvdXJjZShzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPz89IHNvdXJjZTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHQkc2FmZUV4ZWMoY2IsIC4uLmFyZ3MpIHtcblx0XHRpZiAoIWNiIHx8IHRoaXMuI2ZsYWdzLmhhcyhjYikpIHJldHVybjtcblx0XHR0aGlzLiNmbGFncy5hZGQoY2IpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXMgPSBjYiguLi5hcmdzKTtcblx0XHRcdGlmIChyZXMgJiYgdHlwZW9mIHJlcy50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0cmVzLmNhdGNoKGNvbnNvbGUud2Fybik7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXM7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHR0aGlzLiNmbGFncy5kZWxldGUoY2IpO1xuXHRcdH1cblx0fVxuXHQjZGlzcGF0Y2gobmFtZSwgdmFsdWUgPSBudWxsLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwiYWxsXCIsIC4uLmV0Yykge1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuI2xpc3RlbmVycztcblx0XHRpZiAobGlzdGVuZXJzPy5zaXplKSB7XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgcmVjb3JkXSBvZiBsaXN0ZW5lcnMuZW50cmllcygpKSBpZiAoKHJlY29yZC5wcm9wID09PSBuYW1lIHx8IHJlY29yZC5wcm9wID09PSBmb3JBbGwgfHwgcmVjb3JkLnByb3AgPT09IG51bGwpICYmIHRyaWdnZXJGaWx0ZXJBbGxvd3MocmVjb3JkLnRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgdHJpZ2dlciwgLi4uZXRjKTtcblx0XHR9XG5cdFx0aWYgKGdsb2JhbEVmZmVjdExpc3RlbmVycy5zaXplKSB7XG5cdFx0XHRjb25zdCBldmVudCA9IHtcblx0XHRcdFx0c291cmNlOiB0aGlzLiNzb3VyY2UsXG5cdFx0XHRcdHRhcmdldDogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0cHJvcDogbmFtZSxcblx0XHRcdFx0bmFtZSxcblx0XHRcdFx0b2xkVmFsdWUsXG5cdFx0XHRcdHRyaWdnZXIsXG5cdFx0XHRcdGFyZ3M6IGV0Y1xuXHRcdFx0fTtcblx0XHRcdGZvciAoY29uc3QgW2NiLCB0cmlnZ2Vyc10gb2YgZ2xvYmFsRWZmZWN0TGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKHRyaWdnZXJGaWx0ZXJBbGxvd3ModHJpZ2dlcnMsIHRyaWdnZXIpKSB0aGlzLiRzYWZlRXhlYyhjYiwgZXZlbnQpO1xuXHRcdH1cblx0fVxuXHR3cmFwKG53KSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkobncpKSByZXR1cm4gd3JhcFdpdGgobncsIHRoaXMpO1xuXHRcdHJldHVybiBudztcblx0fVxuXHRnZXQgdHJpZ2dlckNvbnRyb2woKSB7XG5cdFx0cmV0dXJuIHRoaXMuI3RyaWdnZXJDb250cm9sO1xuXHR9XG5cdGlzVHJpZ2dlckVuYWJsZWQodHJpZ2dlcikge1xuXHRcdHJldHVybiAhdHJpZ2dlckZpbHRlckFsbG93cyh0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLCBcImFsbFwiKSAmJiAhdHJpZ2dlck5hbWVzT2YodHJpZ2dlcikuc29tZSgobmFtZSkgPT4gdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5oYXMobmFtZSkpO1xuXHR9XG5cdHNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcyA9IFtcIipcIl0sIGVuYWJsZWQgPSB0cnVlKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBleHBhbmRUcmlnZ2VyRmlsdGVyKHR5cGVzKTtcblx0XHRmb3IgKGNvbnN0IG5hbWUgb2YgbmFtZXMpIGlmIChlbmFibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRlbHNlIHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuYWRkKG5hbWUpO1xuXHR9XG5cdHdpdGhUcmlnZ2Vycyh0eXBlcywgZW5hYmxlZCwgY2IpIHtcblx0XHRjb25zdCBuYW1lcyA9IFsuLi5leHBhbmRUcmlnZ2VyRmlsdGVyKHR5cGVzKV07XG5cdFx0Y29uc3QgcHJldmlvdXMgPSBuZXcgTWFwKG5hbWVzLm1hcCgobmFtZSkgPT4gW25hbWUsIHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpXSkpO1xuXHRcdGNvbnN0IHJlc3RvcmUgPSAoKSA9PiB7XG5cdFx0XHRwcmV2aW91cy5mb3JFYWNoKCh3YXNEaXNhYmxlZCwgbmFtZSkgPT4ge1xuXHRcdFx0XHRpZiAod2FzRGlzYWJsZWQpIHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuYWRkKG5hbWUpO1xuXHRcdFx0XHRlbHNlIHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuZGVsZXRlKG5hbWUpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHR0aGlzLnNldFRyaWdnZXJzRW5hYmxlZChuYW1lcywgZW5hYmxlZCk7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGNiPy4oKTtcblx0XHRcdGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdC5maW5hbGx5ID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHJlc3VsdC5maW5hbGx5KHJlc3RvcmUpO1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRyZXN0b3JlKCk7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhZmZlY3RlZChjYiwgcHJvcCwgb3B0aW9ucyA9IFtcIipcIl0pIHtcblx0XHRpZiAoY2IgPT0gbnVsbCB8fCB0eXBlb2YgY2IgIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdFx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKTtcblx0XHR0aGlzLiNsaXN0ZW5lcnMuc2V0KGNiLCB7XG5cdFx0XHRwcm9wOiBwcm9wIHx8IGZvckFsbCxcblx0XHRcdHRyaWdnZXJzOiBub3JtYWxpemVkLmFmZmVjdFR5cGVzXG5cdFx0fSk7XG5cdFx0cmV0dXJuICgpID0+IHRoaXMudW5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwpO1xuXHR9XG5cdHVuYWZmZWN0ZWQoY2IsIHByb3ApIHtcblx0XHRpZiAoY2IgIT0gbnVsbCAmJiB0eXBlb2YgY2IgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0XHRjb25zdCByZWNvcmQgPSBsaXN0ZW5lcnM/LmdldChjYik7XG5cdFx0XHRpZiAocmVjb3JkICYmIChyZWNvcmQucHJvcCA9PSBwcm9wIHx8IHByb3AgPT0gbnVsbCB8fCBwcm9wID09IGZvckFsbCkpIHtcblx0XHRcdFx0bGlzdGVuZXJzLmRlbGV0ZShjYik7XG5cdFx0XHRcdHJldHVybiAoKSA9PiB0aGlzLmFmZmVjdGVkKGNiLCBwcm9wIHx8IGZvckFsbCwgcmVjb3JkLnRyaWdnZXJzKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuI2xpc3RlbmVycy5jbGVhcigpO1xuXHR9XG5cdHRyaWdnZXIobmFtZSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyID0gXCJzZXRcIiwgLi4uZXRjKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09PSBcInN5bWJvbFwiKSByZXR1cm47XG5cdFx0aWYgKHRyaWdnZXIgPT09IHZvaWQgMCkgdHJpZ2dlciA9IFwic2V0XCI7XG5cdFx0dHJpZ2dlciA9IG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IHRyaWdnZXI7XG5cdFx0aWYgKCF0aGlzLmlzVHJpZ2dlckVuYWJsZWQodHJpZ2dlcikpIHJldHVybjtcblx0XHRjb25zdCBvcEtleSA9IGAke3RyaWdnZXIgPz8gXCJhbGxcIn1gO1xuXHRcdGxldCBieU9wID0gdGhpcy4jcGVuZGluZ0J5UHJvcC5nZXQobmFtZSk7XG5cdFx0aWYgKCFieU9wKSB7XG5cdFx0XHRieU9wID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdHRoaXMuI3BlbmRpbmdCeVByb3Auc2V0KG5hbWUsIGJ5T3ApO1xuXHRcdH1cblx0XHRieU9wLnNldChvcEtleSwgW1xuXHRcdFx0bmFtZSxcblx0XHRcdHZhbHVlLFxuXHRcdFx0b2xkVmFsdWUsXG5cdFx0XHR0cmlnZ2VyLFxuXHRcdFx0ZXRjXG5cdFx0XSk7XG5cdFx0aWYgKHRoaXMuI2ZsdXNoU2NoZWR1bGVkKSByZXR1cm47XG5cdFx0dGhpcy4jZmx1c2hTY2hlZHVsZWQgPSB0cnVlO1xuXHRcdGNvbnN0IHNjaGVkdWxlID0gKGNiKSA9PiB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIHNjaGVkdWxlciAhPSBcInVuZGVmaW5lZFwiID8gc2NoZWR1bGVyPy55aWVsZD8uKCk/LnRoZW4/LihjYikgOiBxdWV1ZU1pY3JvdGFzayhjYik7XG5cdFx0fTtcblx0XHRzY2hlZHVsZT8uKCgpID0+IHtcblx0XHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5cdFx0XHRjb25zdCBiYXRjaCA9IHRoaXMuI3BlbmRpbmdCeVByb3A7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGZvciAoY29uc3QgW3Byb3AsIG9wTWFwXSBvZiBiYXRjaCkge1xuXHRcdFx0XHRpZiAocHJvcCAhPSBudWxsICYmIHRoaXMuI2luRGlzcGF0Y2guaGFzKHByb3ApKSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCkgdGhpcy4jaW5EaXNwYXRjaC5hZGQocHJvcCk7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBbLCBhcmdzXSBvZiBvcE1hcCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgW25tLCB2LCBvdiwgdGcsIHJlc3RdID0gYXJncztcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuI2Rpc3BhdGNoKG5tLCB2LCBvdiwgdGcsIC4uLnJlc3QgPz8gW10pO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdGlmIChwcm9wICE9IG51bGwpIHRoaXMuI2luRGlzcGF0Y2guZGVsZXRlKHByb3ApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0Z2V0IGl0ZXJhdG9yKCkge1xuXHRcdHJldHVybiB0aGlzLiNpdGVyYXRvcjtcblx0fVxufTtcbnZhciBTdWJzY3JpcHQgPSBnbG9iYWxUaGlzW1N1YnNjcmlwdFN5bWJvbF07XG5cbi8vIHNyYy9jb3JlL1Jlc29sdmVkLnRzXG52YXIgcmF3T2YgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHVud3JhcHBlZCA9IGRlcmVmKHRhcmdldCk7XG5cdHJldHVybiB1bndyYXBwZWQ/LlskZXh0cmFjdEtleSRdID8/IHVud3JhcHBlZDtcbn07XG5mdW5jdGlvbiByZXNvbHZlZCh0YXJnZXQsIG1vZGUgPSBcImFsbFwiKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCk7XG5cdGlmIChpc1Byb21pc2UocmF3KSkgcmV0dXJuIHJlc29sdmVkJDEocmF3LCBtb2RlKTtcblx0aWYgKGlzUHJvbWlzZShyYXc/LlskcHJvbWlzZV0pKSByZXR1cm4gcmVzb2x2ZWQkMShyYXdbJHByb21pc2VdLCBtb2RlKTtcblx0cmV0dXJuIHJlc29sdmVkJDEocmF3ID8/IHRhcmdldCwgbW9kZSk7XG59XG5mdW5jdGlvbiBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQsIGVtaXQgPSBmYWxzZSkge1xuXHRjb25zdCBydW4gPSAoKG1vZGUgPSBcImFsbFwiKSA9PiB7XG5cdFx0Y29uc3QgcGVuZGluZyA9IHJlc29sdmVkKHRhcmdldCwgbW9kZSk7XG5cdFx0aWYgKCFlbWl0KSByZXR1cm4gcGVuZGluZztcblx0XHRyZXR1cm4gcGVuZGluZy50aGVuKCh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KTtcblx0XHRcdGNvbnN0IGtleSA9IHJhdz8ucmVhbFByb3AgPz8gKHJhdyAmJiBcInZhbHVlXCIgaW4gcmF3ID8gXCJ2YWx1ZVwiIDogbnVsbCk7XG5cdFx0XHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIHZvaWQgMCwgXCJyZXNvbHZlZFwiKTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9KTtcblx0fSk7XG5cdHJ1bi5hbGwgPSAoKSA9PiBydW4oXCJhbGxcIik7XG5cdHJ1bi5hbGxTZXR0bGVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLmFsbEtleWVkID0gKCkgPT4gcnVuKFwiYWxsXCIpO1xuXHRydW4uYWxsU2V0dGxlZEtleWVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLnRyeSA9IChjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpID0+IFByb21pc2UudHJ5KGNhbGxiYWNrT3JWYWx1ZSwgLi4uYXJncykudGhlbigodmFsdWUpID0+IHJlc29sdmVkKHZhbHVlID8/IHRhcmdldCwgXCJhbGxcIikpO1xuXHRyZXR1cm4gcnVuO1xufVxuZnVuY3Rpb24gZW1pdFJlc29sdmVkKHRhcmdldCwga2V5LCB2YWx1ZSwgb2xkVmFsdWUsIG9wID0gXCJyZXNvbHZlZFwiKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCkgPz8gdGFyZ2V0O1xuXHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCBvcCk7XG59XG5mdW5jdGlvbiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMobGl2ZSwgcmF3KSB7XG5cdGlmIChsaXZlID09IG51bGwgfHwgcmF3ID09IG51bGwpIHJldHVybiBsaXZlO1xuXHRpZiAoQXJyYXkuaXNBcnJheShyYXcpKSB7XG5cdFx0cmF3LmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuXHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmVbaW5kZXhdID0gdmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGxpdmU7XG5cdH1cblx0aWYgKHJhdyBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIHJhdy5lbnRyaWVzKCkpIGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlLnNldChrZXksIHZhbHVlKTtcblx0XHRyZXR1cm4gbGl2ZTtcblx0fVxuXHRpZiAocmF3IGluc3RhbmNlb2YgU2V0KSByZXR1cm4gbGl2ZTtcblx0Zm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdC5vd25LZXlzKHJhdykpIHtcblx0XHRpZiAoa2V5ID09ICRleHRyYWN0S2V5JCB8fCBrZXkgPT0gJHByb21pc2UgfHwga2V5ID09ICRyZXNvbHZlZCkgY29udGludWU7XG5cdFx0aWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHJhdywga2V5KT8uZW51bWVyYWJsZSkgY29udGludWU7XG5cdFx0Y29uc3QgdmFsdWUgPSByYXdba2V5XTtcblx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZVtrZXldID0gdmFsdWU7XG5cdH1cblx0cmV0dXJuIGxpdmU7XG59XG5cbi8vIHNyYy9jb3JlL1NwZWNpZmljLnRzXG52YXIgX19zYWZlR2V0R3VhcmRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQF9fc2FmZUdldEd1YXJkXCIpO1xudmFyIHJlYWN0aXZlUHJvcGVydGllc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAcmVhY3RpdmVQcm9wZXJ0aWVzXCIpO1xudmFyIHJlYWN0aXZlUHJvcGVydGllcyA9IGdsb2JhbFRoaXNbcmVhY3RpdmVQcm9wZXJ0aWVzU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgcmVhY3RpdmVNZXRob2RzU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0ByZWFjdGl2ZU1ldGhvZHNcIik7XG52YXIgcmVhY3RpdmVNZXRob2RzID0gZ2xvYmFsVGhpc1tyZWFjdGl2ZU1ldGhvZHNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIG1hcmtSZWFjdGl2ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XG5cdGxldCBrZXlzID0gcmVhY3RpdmVQcm9wZXJ0aWVzLmdldCh0YXJnZXQpO1xuXHRpZiAoIWtleXMpIHJlYWN0aXZlUHJvcGVydGllcy5zZXQodGFyZ2V0LCBrZXlzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdGtleXMuYWRkKGtleSk7XG59XG5mdW5jdGlvbiBpc1JlYWN0aXZlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcblx0Zm9yIChsZXQgY3VycmVudCA9IHRhcmdldDsgY3VycmVudDsgY3VycmVudCA9IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YoY3VycmVudCkpIGlmIChyZWFjdGl2ZVByb3BlcnRpZXMuZ2V0KGN1cnJlbnQpPy5oYXMoa2V5KSkgcmV0dXJuIHRydWU7XG5cdHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIG5vdGlmeVJlYWN0aXZlUHJvcGVydHkocmVjZWl2ZXIsIG93bmVyLCBrZXksIG9sZFZhbHVlLCBuZXdWYWx1ZSwgb3AgPSBcInNldFwiKSB7XG5cdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHJlY2VpdmVyKSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQob3duZXIpO1xuXHRjb25zdCB0cmlnZ2VyTmFtZSA9IHRyaWdnZXJLZXlPZihyZWNlaXZlciwga2V5KTtcblx0aWYgKChzYWZlR2V0KHJlY2VpdmVyLCAkaXNOb3RFcXVhbCkgPz8gaXNOb3RFcXVhbCkob2xkVmFsdWUsIG5ld1ZhbHVlKSkgcmVnaXN0cnk/LnRyaWdnZXI/Lih0cmlnZ2VyTmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlLCBvcCk7XG5cdGlmIChpc1Byb21pc2UobmV3VmFsdWUpKSBlbWl0UmVzb2x2ZWQocmVjZWl2ZXIsIHRyaWdnZXJOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xufVxuZnVuY3Rpb24gZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgdmFsdWUpIHtcblx0Y29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0aWYgKCFkZXNjcmlwdG9yIHx8ICFkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSkgcmV0dXJuIGZhbHNlO1xuXHRpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci53cml0YWJsZSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcblx0aWYgKGlzUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSkpIHJldHVybiB0cnVlO1xuXHRpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIHtcblx0XHRjb25zdCBpbml0aWFsVmFsdWUgPSBkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdGNvbnN0IHZhbHVlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRcdHZhbHVlcy5zZXQodGFyZ2V0LCBpbml0aWFsVmFsdWUpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcblx0XHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGdldCgpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlcy5oYXModGhpcykgPyB2YWx1ZXMuZ2V0KHRoaXMpIDogaW5pdGlhbFZhbHVlO1xuXHRcdFx0fSxcblx0XHRcdHNldChuZXh0VmFsdWUpIHtcblx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB2YWx1ZXMuaGFzKHRoaXMpID8gdmFsdWVzLmdldCh0aGlzKSA6IGluaXRpYWxWYWx1ZTtcblx0XHRcdFx0dmFsdWVzLnNldCh0aGlzLCBuZXh0VmFsdWUpO1xuXHRcdFx0XHRub3RpZnlSZWFjdGl2ZVByb3BlcnR5KHRoaXMsIHRhcmdldCwga2V5LCBvbGRWYWx1ZSwgbmV4dFZhbHVlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRpZiAocmVzdWx0KSBtYXJrUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXHRpZiAoIWRlc2NyaXB0b3Iuc2V0KSByZXR1cm4gZmFsc2U7XG5cdGNvbnN0IGxhc3RBc3NpZ25lZCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCBwcm9wZXJ0eURlc2MgPSB7XG5cdFx0Li4uZGVzY3JpcHRvcixcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0ZW51bWVyYWJsZTogZGVzY3JpcHRvci5lbnVtZXJhYmxlLFxuXHRcdHNldDogZnVuY3Rpb24obmV4dFZhbHVlKSB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGRlc2NyaXB0b3IuZ2V0ID8gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKSA6IGxhc3RBc3NpZ25lZC5nZXQodGhpcyk7XG5cdFx0XHRkZXNjcmlwdG9yLnNldC5jYWxsKHRoaXMsIG5leHRWYWx1ZSk7XG5cdFx0XHRjb25zdCBhY3R1YWxWYWx1ZSA9IGRlc2NyaXB0b3IuZ2V0ID8gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKSA6IG5leHRWYWx1ZTtcblx0XHRcdGlmICghZGVzY3JpcHRvci5nZXQpIGxhc3RBc3NpZ25lZC5zZXQodGhpcywgYWN0dWFsVmFsdWUpO1xuXHRcdFx0bm90aWZ5UmVhY3RpdmVQcm9wZXJ0eSh0aGlzLCB0YXJnZXQsIGtleSwgb2xkVmFsdWUsIGFjdHVhbFZhbHVlKTtcblx0XHR9XG5cdH07XG5cdGlmIChkZXNjcmlwdG9yLmdldCkgcHJvcGVydHlEZXNjLmdldCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpO1xuXHR9O1xuXHRpZiAodmFsdWUgIT09IHZvaWQgMCAmJiB0eXBlb2YgdmFsdWUgIT0gXCJ1bmRlZmluZWRcIikgbGFzdEFzc2lnbmVkLnNldCh0YXJnZXQsIHZhbHVlKTtcblx0Y29uc3QgcmVzdWx0ID0gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgcHJvcGVydHlEZXNjKTtcblx0aWYgKHJlc3VsdCkgbWFya1JlYWN0aXZlUHJvcGVydHkodGFyZ2V0LCBrZXkpO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxudmFyIF9fc3lzdGVtU2tpcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcblx0U3ltYm9sLnRvU3RyaW5nVGFnLFxuXHRTeW1ib2wuaXRlcmF0b3IsXG5cdFN5bWJvbC5hc3luY0l0ZXJhdG9yLFxuXHRTeW1ib2wudG9QcmltaXRpdmUsXG5cdFwidG9TdHJpbmdcIixcblx0XCJ2YWx1ZU9mXCIsXG5cdFwiaW5zcGVjdFwiLFxuXHRcImNvbnN0cnVjdG9yXCIsXG5cdFwiX19wcm90b19fXCIsXG5cdFwicHJvdG90eXBlXCIsXG5cdFwidGhlblwiLFxuXHRcImNhdGNoXCIsXG5cdFwiZmluYWxseVwiLFxuXHRcIm5leHRcIlxuXSk7XG52YXIgc3lzdGVtU2tpcEdldCA9ICh0YXJnZXQsIG5hbWUpID0+IHtcblx0aWYgKCFfX3N5c3RlbVNraXAuaGFzKG5hbWUpKSByZXR1cm4gbnVsbDtcblx0Y29uc3QgZ290ID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRyZXR1cm4gdHlwZW9mIGdvdCA9PT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIGdvdCkgOiBnb3Q7XG59O1xudmFyIF9fc2FmZUdldEd1YXJkID0gZ2xvYmFsVGhpc1tfX3NhZmVHZXRHdWFyZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gaXNHZXR0ZXIob2JqLCBwcm9wTmFtZSkge1xuXHRsZXQgZ290ID0gdHJ1ZTtcblx0dHJ5IHtcblx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/LihvYmosIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/Lihwcm9wTmFtZSk7XG5cdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/LihvYmopPy5oYXM/Lihwcm9wTmFtZSkpIGdvdCA9IHRydWU7XG5cdFx0Z290ID0gdHlwZW9mIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcE5hbWUpPy5nZXQgPT0gXCJmdW5jdGlvblwiO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Z290ID0gdHJ1ZTtcblx0fSBmaW5hbGx5IHtcblx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4ob2JqKT8uZGVsZXRlPy4ocHJvcE5hbWUpO1xuXHR9XG5cdHJldHVybiBnb3Q7XG59XG52YXIgZmFsbFRocm91Z2ggPSAob2JqLCBrZXkpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKG9iaikpIHJldHVybiBvYmo7XG5cdGNvbnN0IHZhbHVlID0gc2FmZUdldChvYmosIGtleSk7XG5cdGlmICh2YWx1ZSA9PSBudWxsICYmIGtleSAhPSBcInZhbHVlXCIpIHtcblx0XHRjb25zdCB0bXAgPSBzYWZlR2V0KG9iaiwgXCJ2YWx1ZVwiKTtcblx0XHRpZiAodG1wICE9IG51bGwgJiYgIWlzUHJpbWl0aXZlKHRtcCkpIHJldHVybiBmYWxsVGhyb3VnaCh0bXAsIGtleSk7XG5cdFx0ZWxzZSByZXR1cm4gdmFsdWU7XG5cdH0gZWxzZSBpZiAoa2V5ID09IFwidmFsdWVcIiAmJiB2YWx1ZSAhPSBudWxsICYmICFpc1ByaW1pdGl2ZSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbGxUaHJvdWdoKHZhbHVlLCBrZXkpID8/IHZhbHVlID8/IG9iajtcblx0cmV0dXJuIHZhbHVlID8/IG9iajtcbn07XG52YXIgc2FmZVNldCA9IChvYmosIGtleSwgdmFsdWUpID0+IHtcblx0aWYgKG9iaiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdGxldCBhY3RpdmUgPSBfX3NhZmVTZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/LihvYmosIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRpZiAoYWN0aXZlPy5oYXM/LihrZXkpKSByZXR1cm4gZmFsc2U7XG5cdGFjdGl2ZT8uYWRkPy4oa2V5KTtcblx0cmV0dXJuIFJlZmxlY3Quc2V0KG9iaiwga2V5LCB2YWx1ZSk7XG59O1xudmFyIHNhZmVHZXQgPSAob2JqLCBrZXksIHJlYykgPT4ge1xuXHRsZXQgcmVzdWx0ID0gdm9pZCAwO1xuXHRpZiAob2JqID09IG51bGwpIHJldHVybiBvYmo7XG5cdGxldCBhY3RpdmUgPSBfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/LihvYmosIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRpZiAoYWN0aXZlPy5oYXM/LihrZXkpKSByZXR1cm4gbnVsbDtcblx0aWYgKCFpc0dldHRlcihvYmosIGtleSkpIHJlc3VsdCA/Pz0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcblx0ZWxzZSB7XG5cdFx0YWN0aXZlPy5hZGQ/LihrZXkpO1xuXHRcdHRyeSB7XG5cdFx0XHRyZXN1bHQgPSBSZWZsZWN0LmdldChvYmosIGtleSwgcmVjICE9IG51bGwgPyByZWMgOiBvYmopO1xuXHRcdH0gY2F0Y2ggKF9lKSB7XG5cdFx0XHRyZXN1bHQgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdGFjdGl2ZS5kZWxldGUoa2V5KTtcblx0XHRcdGlmIChhY3RpdmU/LnNpemUgPT09IDApIF9fc2FmZUdldEd1YXJkPy5kZWxldGU/LihvYmopO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHlwZW9mIHJlc3VsdCA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KG9iaiwgcmVzdWx0KSA6IHJlc3VsdDtcbn07XG52YXIgaGFzT3duID0gKG9iaiwga2V5KSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xudmFyIGlzVHJpZ2dlckVtaXRPcHRpb25zID0gKHZhbHVlLCBhbGxvd1ZhbHVlT25seSA9IGZhbHNlKSA9PiB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAoaGFzT3duKHZhbHVlLCBcImtleVwiKSB8fCBoYXNPd24odmFsdWUsIFwibmFtZVwiKSB8fCBoYXNPd24odmFsdWUsIFwib2xkVmFsdWVcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9sZFwiKSB8fCBoYXNPd24odmFsdWUsIFwib3BcIikgfHwgaGFzT3duKHZhbHVlLCBcInRyaWdnZXJcIikgfHwgYWxsb3dWYWx1ZU9ubHkgJiYgaGFzT3duKHZhbHVlLCBcInZhbHVlXCIpKTtcbn07XG52YXIgdHJpZ2dlck9wdGlvblZhbHVlID0gKG9wdGlvbnMsIGtleSwgZmFsbGJhY2spID0+IHtcblx0aWYgKGhhc093bihvcHRpb25zLCBrZXkpKSByZXR1cm4gb3B0aW9uc1trZXldO1xuXHRpZiAoa2V5ID09IFwib2xkVmFsdWVcIiAmJiBoYXNPd24ob3B0aW9ucywgXCJvbGRcIikpIHJldHVybiBvcHRpb25zLm9sZDtcblx0cmV0dXJuIGZhbGxiYWNrKCk7XG59O1xudmFyIHRyaWdnZXJPcHRpb25UcmlnZ2VyID0gKG9wdGlvbnMsIGZhbGxiYWNrID0gXCJtYW51YWxcIikgPT4gbm9ybWFsaXplVHJpZ2dlck5hbWUob3B0aW9ucy50cmlnZ2VyID8/IG9wdGlvbnMub3AgPz8gZmFsbGJhY2spO1xudmFyIGlzUnVudGltZUtleSA9IChrZXkpID0+IHR5cGVvZiBrZXkgPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2Yga2V5ID09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGtleSA9PSBcInN5bWJvbFwiO1xudmFyIHJlYWxQcm9wT2YkMSA9ICh0YXJnZXQpID0+IHtcblx0Y29uc3QgcHJvcCA9IHNhZmVHZXQodGFyZ2V0LCAkcmVhbFByb3ApID8/IHNhZmVHZXQodGFyZ2V0LCBcInJlYWxQcm9wXCIpO1xuXHRyZXR1cm4gaXNSdW50aW1lS2V5KHByb3ApID8gcHJvcCA6IG51bGw7XG59O1xudmFyIHRyaWdnZXJLZXlPZiA9ICh0YXJnZXQsIGtleSkgPT4ga2V5ID09IFwidmFsdWVcIiA/IHJlYWxQcm9wT2YkMSh0YXJnZXQpID8/IGtleSA6IGtleTtcbnZhciB0cmlnZ2VyVmFsdWVPZiA9ICh0YXJnZXQsIGtleSkgPT4ge1xuXHRjb25zdCByZWFsUHJvcCA9IHJlYWxQcm9wT2YkMSh0YXJnZXQpO1xuXHRpZiAocmVhbFByb3AgIT0gbnVsbCAmJiBrZXkgPT0gcmVhbFByb3ApIHJldHVybiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA/PyBzYWZlR2V0KHRhcmdldCwga2V5KTtcblx0cmV0dXJuIGtleSA9PSBudWxsID8gdm9pZCAwIDogc2FmZUdldCh0YXJnZXQsIGtleSk7XG59O1xudmFyIGNyZWF0ZVRyaWdnZXJBUEkgPSAocmVnaXN0cnksIGVtaXQsIHRhcmdldCkgPT4ge1xuXHRjb25zdCBhcGkgPSAoa2V5LCBvcE9yT3B0aW9ucywgdHJpZ2dlcikgPT4ge1xuXHRcdGlmICghaXNUcmlnZ2VyRW1pdE9wdGlvbnMob3BPck9wdGlvbnMpKSB0cmlnZ2VyID8/PSBvcE9yT3B0aW9ucztcblx0XHRyZXR1cm4gZW1pdChpc1RyaWdnZXJFbWl0T3B0aW9ucyhrZXkpID8ga2V5IDogaXNUcmlnZ2VyRW1pdE9wdGlvbnMob3BPck9wdGlvbnMsIHRydWUpID8ge1xuXHRcdFx0a2V5LFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdC4uLm9wT3JPcHRpb25zXG5cdFx0fSA6IHtcblx0XHRcdGtleSxcblx0XHRcdHRyaWdnZXI6IHRyaWdnZXIgPz8gb3BPck9wdGlvbnNcblx0XHR9KTtcblx0fTtcblx0Y29uc3QgY29udHJvbCA9IHJlZ2lzdHJ5Py50cmlnZ2VyQ29udHJvbDtcblx0aWYgKGNvbnRyb2wpIE9iamVjdC5hc3NpZ24oYXBpLCBjb250cm9sKTtcblx0YXBpLmN1c3RvbSA9ICh0cmlnZ2VyLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSkgPT4gYXBpKHtcblx0XHRrZXksXG5cdFx0dHJpZ2dlcixcblx0XHR2YWx1ZSxcblx0XHRvbGRWYWx1ZVxuXHR9KTtcblx0aWYgKHRhcmdldCAhPSBudWxsKSBhcGkucmVzb2x2ZWQgPSBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQsIHRydWUpO1xuXHRyZXR1cm4gYXBpO1xufTtcbnZhciBzeXN0ZW1HZXQgPSAodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSkgPT4ge1xuXHRpZiAodGFyZ2V0ID09IG51bGwgfHwgaXNQcmltaXRpdmUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0aWYgKChbXG5cdFx0XCJkZXJlZlwiLFxuXHRcdFwiYmluZFwiLFxuXHRcdFwiQHRhcmdldFwiLFxuXHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0JGV4dHJhY3RLZXkkLFxuXHRcdCRyZWdpc3RyeUtleSRcblx0XS5pbmRleE9mKG5hbWUpIDwgMCA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBudWxsKSAhPSBudWxsKSByZXR1cm4gbnVsbDtcblx0aWYgKFskZXh0cmFjdEtleSQsICRvcmlnaW5hbEtleSRdLmluZGV4T2YobmFtZSkgPj0gMCkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyB0YXJnZXQ7XG5cdGlmIChuYW1lID09ICR2YWx1ZSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKTtcblx0aWYgKG5hbWUgPT0gJHJlZ2lzdHJ5S2V5JCkgcmV0dXJuIHJlZ2lzdHJ5O1xuXHRpZiAobmFtZSA9PSAkcmVzb2x2ZWQgfHwgbmFtZSA9PSBcInJlc29sdmVkXCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIFwicmVzb2x2ZWRcIikpIHJldHVybiBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQpO1xuXHRpZiAobmFtZSA9PSAkdHJpZ2dlckNvbnRyb2wpIHJldHVybiByZWdpc3RyeT8udHJpZ2dlckNvbnRyb2w7XG5cdGlmIChuYW1lID09IFN5bWJvbC5vYnNlcnZhYmxlKSByZXR1cm4gcmVnaXN0cnk/LmNvbXBhdGlibGU7XG5cdGlmIChuYW1lID09IFN5bWJvbC5zdWJzY3JpYmUpIHJldHVybiAoY2IsIHByb3AsIG9wdGlvbnMpID0+IGFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0LCBjYiwgb3B0aW9ucyk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5pdGVyYXRvcikgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5kaXNwb3NlKSByZXR1cm4gKHByb3ApID0+IHtcblx0XHRzYWZlR2V0KHRhcmdldCwgU3ltYm9sLmRpc3Bvc2UpPy4ocHJvcCk7XG5cdFx0dW5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCk7XG5cdH07XG5cdGlmIChuYW1lID09IFN5bWJvbC5hc3luY0Rpc3Bvc2UpIHJldHVybiAocHJvcCkgPT4ge1xuXHRcdHNhZmVHZXQodGFyZ2V0LCBTeW1ib2wuYXN5bmNEaXNwb3NlKT8uKHByb3ApO1xuXHRcdHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHR9O1xuXHRpZiAobmFtZSA9PSBTeW1ib2wudW5zdWJzY3JpYmUpIHJldHVybiAocHJvcCkgPT4gdW5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCk7XG5cdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG59O1xudmFyIG9ic2VydmFibGVBUElNZXRob2RzID0gKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpID0+IHtcblx0aWYgKG5hbWUgPT0gXCJzdWJzY3JpYmVcIikgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlPy5bbmFtZV0gPz8gKChoYW5kbGVyKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBoYW5kbGVyID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGFmZmVjdGVkKHRhcmdldCwgaGFuZGxlcik7XG5cdFx0ZWxzZSBpZiAoXCJuZXh0XCIgaW4gaGFuZGxlciAmJiBoYW5kbGVyPy5uZXh0ICE9IG51bGwpIHtcblx0XHRcdGNvbnN0IHVzdWIgPSBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXI/Lm5leHQpLCBjb21wID0gaGFuZGxlcj8uW1wiY29tcGxldGVcIl07XG5cdFx0XHRoYW5kbGVyW1wiY29tcGxldGVcIl0gPSAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHR1c3ViPy4oKTtcblx0XHRcdFx0cmV0dXJuIGNvbXA/LiguLi5hcmdzKTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gaGFuZGxlcltcImNvbXBsZXRlXCJdO1xuXHRcdH1cblx0fSk7XG59O1xudmFyIE9ic2VydmVBcnJheU1ldGhvZCA9IGNsYXNzIHtcblx0I25hbWU7XG5cdCNzZWxmO1xuXHQjaGFuZGxlO1xuXHRjb25zdHJ1Y3RvcihuYW1lLCBzZWxmLCBoYW5kbGUpIHtcblx0XHR0aGlzLiNuYW1lID0gbmFtZTtcblx0XHR0aGlzLiNzZWxmID0gc2VsZjtcblx0XHR0aGlzLiNoYW5kbGUgPSBoYW5kbGU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgcmVjKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBuYW1lLCByZWMpO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0bGV0IGFkZGVkID0gW10sIHJlbW92ZWQgPSBbXTtcblx0XHRsZXQgc2V0UGFpcnMgPSBbXTtcblx0XHRsZXQgb2xkU3RhdGUgPSBbLi4udGhpcy4jc2VsZl07XG5cdFx0bGV0IGlkeCA9IC0xO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHggfHwgdGhpcy4jc2VsZiwgYXJncyk7XG5cdFx0aWYgKHRoaXMuI2hhbmRsZT8uWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHJldHVybiBvYnNlcnZlQXJyYXkocmVzdWx0KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdHN3aXRjaCAodGhpcy4jbmFtZSkge1xuXHRcdFx0Y2FzZSBcInB1c2hcIjpcblx0XHRcdFx0aWR4ID0gb2xkU3RhdGU/Lmxlbmd0aDtcblx0XHRcdFx0YWRkZWQgPSBhcmdzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJ1bnNoaWZ0XCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGFkZGVkID0gYXJncztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwicG9wXCI6XG5cdFx0XHRcdGlkeCA9IG9sZFN0YXRlPy5sZW5ndGggLSAxO1xuXHRcdFx0XHRpZiAob2xkU3RhdGUubGVuZ3RoID4gMCkgcmVtb3ZlZCA9IFtvbGRTdGF0ZVtpZHhdXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2hpZnRcIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0aWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbb2xkU3RhdGVbaWR4XV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNwbGljZVwiOlxuXHRcdFx0XHRpZHggPSBhcmdzWzBdO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWF4KG9sZFN0YXRlLmxlbmd0aCwgdGhpcy4jc2VsZi5sZW5ndGgpOyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBvbGRWYWx1ZSA9IG9sZFN0YXRlW2ldO1xuXHRcdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gdGhpcy4jc2VsZltpXTtcblx0XHRcdFx0XHRpZiAobmV3VmFsdWUgPT09IHZvaWQgMCAmJiBpID49IHRoaXMuI3NlbGYubGVuZ3RoKSByZW1vdmVkLnB1c2gob2xkVmFsdWUpO1xuXHRcdFx0XHRcdGVsc2UgaWYgKG9sZFZhbHVlID09PSB2b2lkIDAgJiYgaSA+PSBvbGRTdGF0ZS5sZW5ndGgpIHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRcdG5ld1ZhbHVlLFxuXHRcdFx0XHRcdFx0dm9pZCAwLFxuXHRcdFx0XHRcdFx0ZmFsc2Vcblx0XHRcdFx0XHRdKTtcblx0XHRcdFx0XHRlbHNlIGlmIChpc05vdEVxdWFsKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRcdG5ld1ZhbHVlLFxuXHRcdFx0XHRcdFx0b2xkVmFsdWUsXG5cdFx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic29ydFwiOlxuXHRcdFx0Y2FzZSBcImZpbGxcIjpcblx0XHRcdGNhc2UgXCJyZXZlcnNlXCI6XG5cdFx0XHRjYXNlIFwiY29weVdpdGhpblwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG9sZFN0YXRlLmxlbmd0aDsgaSsrKSBpZiAoaXNOb3RFcXVhbChvbGRTdGF0ZVtpXSwgdGhpcy4jc2VsZltpXSkpIHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdGlkeCArIGksXG5cdFx0XHRcdFx0dGhpcy4jc2VsZltpXSxcblx0XHRcdFx0XHRvbGRTdGF0ZVtpXSxcblx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdF0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzZXRcIjpcblx0XHRcdFx0aWR4ID0gYXJnc1sxXTtcblx0XHRcdFx0c2V0UGFpcnMucHVzaChbXG5cdFx0XHRcdFx0aWR4LFxuXHRcdFx0XHRcdGFyZ3NbMF0sXG5cdFx0XHRcdFx0b2xkU3RhdGU/LltpZHhdLFxuXHRcdFx0XHRcdGlkeCBpbiBvbGRTdGF0ZVxuXHRcdFx0XHRdKTtcblx0XHR9XG5cdFx0Y29uc3QgcmVnID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRoaXMuI3NlbGYpO1xuXHRcdGlmIChhZGRlZD8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKGlkeCwgYWRkZWRbMF0sIG51bGwsIFwiYWRkXCIpO1xuXHRcdGVsc2UgaWYgKGFkZGVkPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWc/LnRyaWdnZXI/LihpZHgsIGFkZGVkLCBudWxsLCBcImFkZEFsbFwiKTtcblx0XHRcdGFkZGVkLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZz8udHJpZ2dlcj8uKGlkeCArIEksIGl0ZW0sIG51bGwsIFwiYWRkXCIpKTtcblx0XHR9XG5cdFx0aWYgKHNldFBhaXJzPy5sZW5ndGggPT0gMSkgcmVnPy50cmlnZ2VyPy4oc2V0UGFpcnNbMF0/LlswXSA/PyBpZHgsIHNldFBhaXJzWzBdPy5bMV0sIHNldFBhaXJzWzBdPy5bMl0sIHNldFBhaXJzWzBdPy5bM10gPT09IGZhbHNlID8gXCJhZGRcIiA6IFwic2V0XCIpO1xuXHRcdGVsc2UgaWYgKHNldFBhaXJzPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWc/LnRyaWdnZXI/LihpZHgsIHNldFBhaXJzLCBvbGRTdGF0ZSwgXCJzZXRBbGxcIik7XG5cdFx0XHRzZXRQYWlycy5mb3JFYWNoKChwYWlyLCBJKSA9PiByZWc/LnRyaWdnZXI/LihwYWlyPy5bMF0gPz8gaWR4ICsgSSwgcGFpcj8uWzFdLCBwYWlyPy5bMl0sIHBhaXI/LlszXSA9PT0gZmFsc2UgPyBcImFkZFwiIDogXCJzZXRcIikpO1xuXHRcdH1cblx0XHRpZiAocmVtb3ZlZD8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZFswXSwgXCJkZWxldGVcIik7XG5cdFx0ZWxzZSBpZiAocmVtb3ZlZD8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBudWxsLCByZW1vdmVkLCBcImRlbGV0ZUFsbFwiKTtcblx0XHRcdHJlbW92ZWQuZm9yRWFjaCgoaXRlbSwgSSkgPT4gcmVnPy50cmlnZ2VyPy4oaWR4ICsgSSwgbnVsbCwgaXRlbSwgXCJkZWxldGVcIikpO1xuXHRcdH1cblx0XHRpZiAocmVzdWx0ID09IHRhcmdldCkgcmV0dXJuIG5ldyBQcm94eShyZXN1bHQsIHRoaXMuI2hhbmRsZSk7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkgcmV0dXJuIG9ic2VydmVBcnJheShyZXN1bHQpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn07XG52YXIgdHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UgPSAoc2VsZiwgdGFyZ2V0LCBvbGRMZW4sIG5ld0xlbikgPT4ge1xuXHRjb25zdCByZW1vdmVkSXRlbXMgPSBOdW1iZXIuaXNJbnRlZ2VyKG9sZExlbikgJiYgTnVtYmVyLmlzSW50ZWdlcihuZXdMZW4pICYmIG5ld0xlbiA8IG9sZExlbiA/IHRhcmdldC5zbGljZShuZXdMZW4sIG9sZExlbikgOiBbXTtcblx0aWYgKCFzZWxmWyR0cmlnZ2VyTG9ja10gJiYgb2xkTGVuICE9PSBuZXdMZW4pIHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHRcdGlmIChyZW1vdmVkSXRlbXMubGVuZ3RoID09PSAxKSByZWdpc3RyeT8udHJpZ2dlcj8uKG5ld0xlbiwgbnVsbCwgcmVtb3ZlZEl0ZW1zWzBdLCBcImRlbGV0ZVwiKTtcblx0XHRlbHNlIGlmIChyZW1vdmVkSXRlbXMubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtcywgXCJkZWxldGVBbGxcIik7XG5cdFx0XHRyZW1vdmVkSXRlbXMuZm9yRWFjaCgoaXRlbSwgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4gKyBJLCBudWxsLCBpdGVtLCBcImRlbGV0ZVwiKSk7XG5cdFx0fVxuXHRcdGNvbnN0IGFkZGVkQ291bnQgPSBOdW1iZXIuaXNJbnRlZ2VyKG9sZExlbikgJiYgTnVtYmVyLmlzSW50ZWdlcihuZXdMZW4pICYmIG5ld0xlbiA+IG9sZExlbiA/IG5ld0xlbiAtIG9sZExlbiA6IDA7XG5cdFx0aWYgKGFkZGVkQ291bnQgPT09IDEpIHJlZ2lzdHJ5Py50cmlnZ2VyPy4ob2xkTGVuLCB2b2lkIDAsIG51bGwsIFwiYWRkXCIpO1xuXHRcdGVsc2UgaWYgKGFkZGVkQ291bnQgPiAxKSB7XG5cdFx0XHRjb25zdCBhZGRlZCA9IEFycmF5KGFkZGVkQ291bnQpLmZpbGwodm9pZCAwKTtcblx0XHRcdHJlZ2lzdHJ5Py50cmlnZ2VyPy4ob2xkTGVuLCBhZGRlZCwgbnVsbCwgXCJhZGRBbGxcIik7XG5cdFx0XHRhZGRlZC5mb3JFYWNoKChfLCBJKSA9PiByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiArIEksIHZvaWQgMCwgbnVsbCwgXCJhZGRcIikpO1xuXHRcdH1cblx0fVxufTtcbnZhciBPYnNlcnZlQXJyYXlIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRoYXModGFyZ2V0LCBuYW1lKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSk7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgcmVjKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gc2FmZUdldCh0YXJnZXQsIG5hbWUpPy5iaW5kPy4odGFyZ2V0KSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5Py5nZXQ/Lih0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZSA/PyAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiBzYWZlR2V0KHRhcmdldCwga2V5KSk7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IHZvaWQgMCk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gXCJAdGFyZ2V0XCIgfHwgbmFtZSA9PSAkZXh0cmFjdEtleSQpIHJldHVybiB0YXJnZXQ7XG5cdFx0aWYgKG5hbWUgPT0gXCJ4XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py54ID8/IHRhcmdldD8uWzBdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ5XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py55ID8/IHRhcmdldD8uWzFdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ6XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py56ID8/IHRhcmdldD8uWzJdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ3XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py53ID8/IHRhcmdldD8uWzNdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5yID8/IHRhcmdldD8uWzBdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJnXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5nID8/IHRhcmdldD8uWzFdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJiXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5iID8/IHRhcmdldD8uWzJdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5hID8/IHRhcmdldD8uWzNdO1xuXHRcdH07XG5cdFx0Y29uc3QgZ290ID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IChuYW1lID09IFwidmFsdWVcIiA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpIDogbnVsbCk7XG5cdFx0aWYgKHR5cGVvZiBnb3QgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbmV3IFByb3h5KHR5cGVvZiBnb3QgPT0gXCJmdW5jdGlvblwiID8gZ290Py5iaW5kPy4odGFyZ2V0KSA6IGdvdCwgbmV3IE9ic2VydmVBcnJheU1ldGhvZChuYW1lLCB0YXJnZXQsIHRoaXMpKTtcblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KG5hbWUpKSkgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGNvbnN0IHBlbmRpbmcgPSBpc1Byb21pc2UodmFsdWUpO1xuXHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0Y29uc3QgeHl6dyA9IFtcblx0XHRcdFx0XCJ4XCIsXG5cdFx0XHRcdFwieVwiLFxuXHRcdFx0XHRcInpcIixcblx0XHRcdFx0XCJ3XCJcblx0XHRcdF07XG5cdFx0XHRjb25zdCByZ2JhID0gW1xuXHRcdFx0XHRcInJcIixcblx0XHRcdFx0XCJnXCIsXG5cdFx0XHRcdFwiYlwiLFxuXHRcdFx0XHRcImFcIlxuXHRcdFx0XTtcblx0XHRcdGNvbnN0IHh5endfaWR4ID0geHl6dy5pbmRleE9mKG5hbWUpO1xuXHRcdFx0Y29uc3QgcmdiYV9pZHggPSByZ2JhLmluZGV4T2YobmFtZSk7XG5cdFx0XHRsZXQgZ290ID0gZmFsc2U7XG5cdFx0XHRpZiAoeHl6d19pZHggPj0gMCkgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCB4eXp3X2lkeCwgdik7XG5cdFx0XHRlbHNlIGlmIChyZ2JhX2lkeCA+PSAwKSBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHJnYmFfaWR4LCB2KTtcblx0XHRcdGVsc2UgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2KTtcblx0XHRcdGlmIChuYW1lID09IFwibGVuZ3RoXCIpIHtcblx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2xkLCB2KSkgdHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UodGhpcywgdGFyZ2V0LCBvbGQsIHYpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0XHRpZiAoaXNOb3RFcXVhbChvbGQsIHYpKSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIHYsIG9sZCwgXCJzZXRcIik7XG5cdFx0XHRcdGlmIChwZW5kaW5nKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBuYW1lLCB2LCBvbGQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGdvdDtcblx0XHR9KTtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAodHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0aWYgKE51bWJlci5pc0ludGVnZXIocGFyc2VJbnQobmFtZSkpKSBuYW1lID0gcGFyc2VJbnQobmFtZSkgPz8gbmFtZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGNvbnN0IG9sZCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCBnb3QgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgbmFtZSAhPSBcImxlbmd0aFwiICYmIG5hbWUgIT0gJHRyaWdnZXJMb2NrICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChvbGQgIT0gbnVsbCkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCBuYW1lLCBvbGQsIFwiZGVsZXRlXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG59O1xudmFyIE9ic2VydmVPYmplY3RIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiLFxuXHRcdFx0XCJ0aGVuXCIsXG5cdFx0XHRcImNhdGNoXCIsXG5cdFx0XHRcImZpbmFsbHlcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IHRyaWdnZXJLZXlPZih0YXJnZXQsIG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZSA/PyByZWFsUHJvcE9mJDEodGFyZ2V0KSA/PyBcInZhbHVlXCIpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiBrZXkgPT0gXCJ2YWx1ZVwiIHx8IGtleSA9PSByZWFsUHJvcE9mJDEodGFyZ2V0KSA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpIDogdm9pZCAwKTtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gdHJpZ2dlclZhbHVlT2YodGFyZ2V0LCBrZXkpKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBTeW1ib2wudG9QcmltaXRpdmUpIHJldHVybiAoaGludCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LihoaW50KTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiB0cnlQYXJzZUJ5SGludChmdCwgaGludCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiB0cnlQYXJzZUJ5SGludChzYWZlR2V0KGZ0LCBcInZhbHVlXCIpLCBoaW50KTtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludChzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0LCBoaW50KTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFN5bWJvbC50b1N0cmluZ1RhZykgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBTdHJpbmcoZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwidG9TdHJpbmdcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBTeW1ib2wudG9TdHJpbmdUYWcpKSByZXR1cm4gc2FmZUdldChmdCwgU3ltYm9sLnRvU3RyaW5nVGFnKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gU3RyaW5nKGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0cmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInZhbHVlT2ZcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBTeW1ib2wudG9QcmltaXRpdmUpKSByZXR1cm4gc2FmZUdldChmdCwgU3ltYm9sLnRvUHJpbWl0aXZlKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gZnQ7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBzYWZlR2V0KGZ0LCBcInZhbHVlXCIpO1xuXHRcdFx0cmV0dXJuIHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQ7XG5cdFx0fTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdHJldHVybiBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0Py5bU3ltYm9sLmZvcihcIkBAYXBwbHlcIildPy5iaW5kPy4odGFyZ2V0Py5bU3ltYm9sLmZvcihcIkBAYXBwbHlcIildID8/IHRhcmdldCkgPz8gdGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBwcm9wIGluIHRhcmdldDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmModmFsdWUsICh2KSA9PiB7XG5cdFx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh2LCBuYW1lKTtcblx0XHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7XG5cdFx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0ICRvcmlnaW5hbCA9IHRhcmdldDtcblx0XHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmICEoc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgbmFtZSBpbiB0YXJnZXQpKSByZXR1cm47XG5cdFx0XHRjb25zdCB0cmlnZ2VyTmFtZSA9IHRyaWdnZXJLZXlPZih0YXJnZXQsIG5hbWUpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBuYW1lID09IFwidmFsdWVcIiA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpID8/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRcdHRhcmdldFtuYW1lXSA9IHY7XG5cdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyB2O1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgdHlwZW9mIG5hbWUgIT09IFwic3ltYm9sXCIgJiYgIWlzUmVhY3RpdmVQcm9wZXJ0eSgkb3JpZ2luYWwsIG5hbWUpKSB7XG5cdFx0XHRcdGNvbnN0IHN1YnNjcmlwdCA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCgkb3JpZ2luYWwpO1xuXHRcdFx0XHRpZiAoKHNhZmVHZXQodGFyZ2V0LCAkaXNOb3RFcXVhbCkgPz8gaXNOb3RFcXVhbCk/LihvbGRWYWx1ZSwgbmV3VmFsdWUpKSBzdWJzY3JpcHQ/LnRyaWdnZXI/Lih0cmlnZ2VyTmFtZSwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgZW1pdFJlc29sdmVkKCRvcmlnaW5hbCwgdHJpZ2dlck5hbWUsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0pO1xuXHR9XG5cdGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcikge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIGRlc2NyaXB0b3IudmFsdWUpIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhZGVzY3JpcHRvci52YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIWRlc2NyaXB0b3IudmFsdWUpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGlmIChkZXNjcmlwdG9yLmdldCA9PSB2b2lkIDAgJiYgZGVzY3JpcHRvci5zZXQgPT0gdm9pZCAwKSByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0ICRyZXN1bHQgPSBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwge1xuXHRcdFx0Z2V0OiBkZXNjcmlwdG9yLmdldCxcblx0XHRcdHNldDogZGVzY3JpcHRvci5zZXQsXG5cdFx0XHRlbnVtZXJhYmxlOiBkZXNjcmlwdG9yLmVudW1lcmFibGUgPz8gdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogZGVzY3JpcHRvci5jb25maWd1cmFibGUgPz8gdHJ1ZVxuXHRcdH0pO1xuXHRcdHNhZmVTZXQodGFyZ2V0LCBuYW1lLCBvbGRWYWx1ZSk7XG5cdFx0cmV0dXJuICRyZXN1bHQ7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgbmFtZSAhPSAkdHJpZ2dlckxvY2sgJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufTtcbnZhciBPYnNlcnZlTWFwSGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0dGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsICRleHRyYWN0S2V5JCkgPz8gc2FmZUdldCh0YXJnZXQsICRvcmlnaW5hbEtleSQpID8/IHRhcmdldDtcblx0XHRjb25zdCB2YWx1ZU9yRnggPSBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gdmFsdWVPckZ4O1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZTtcblx0XHRcdGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0YXJnZXQuZ2V0KGtleSkpO1xuXHRcdFx0aWYgKHZhbHVlID09IG51bGwgJiYgIWhhc093bihvcHRpb25zLCBcInZhbHVlXCIpKSByZXR1cm47XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IHZvaWQgMCk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gXCJjbGVhclwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWVzID0gQXJyYXkuZnJvbSh0YXJnZXQ/LmVudHJpZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG5cdFx0XHRvbGRWYWx1ZXMuZm9yRWFjaCgoW3Byb3AsIG9sZFZhbHVlXSkgPT4ge1xuXHRcdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImRlbGV0ZVwiKSByZXR1cm4gKHByb3AsIF8gPSBudWxsKSA9PiB7XG5cdFx0XHRjb25zdCBoYWQgPSB0YXJnZXQuaGFzKHByb3ApLCBvbGRWYWx1ZSA9IHRhcmdldC5nZXQocHJvcCksIHJlc3VsdCA9IHZhbHVlT3JGeChwcm9wKTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIGhhZCkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJzZXRcIikgcmV0dXJuIChwcm9wLCB2YWx1ZSkgPT4gcG90ZW50aWFsbHlBc3luY01hcCh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXMocHJvcCksIG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3AsIHYpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0aWYgKCFoYWQgfHwgaXNOb3RFcXVhbChvbGRWYWx1ZSwgdikpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4ocHJvcCwgdiwgaGFkID8gb2xkVmFsdWUgOiBudWxsLCBoYWQgPyBcInNldFwiIDogXCJhZGRcIik7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBwcm9wLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0pO1xuXHRcdGlmIChuYW1lID09IFwiZ2V0T3JJbnNlcnRcIiB8fCBuYW1lID09IFwiZ2V0T3JJbnNlcnRDb21wdXRlZFwiKSB7XG5cdFx0XHRjb25zdCBjb21wdXRlZCA9IG5hbWUgPT0gXCJnZXRPckluc2VydENvbXB1dGVkXCI7XG5cdFx0XHRyZXR1cm4gKGtleSwgZGVmYXVsdE9yQ29tcHV0ZSkgPT4ge1xuXHRcdFx0XHRpZiAodGFyZ2V0LmhhcyhrZXkpKSByZXR1cm4gdGFyZ2V0LmdldChrZXkpO1xuXHRcdFx0XHRjb25zdCBpbmNvbWluZyA9IGNvbXB1dGVkID8gdHlwZW9mIGRlZmF1bHRPckNvbXB1dGUgPT0gXCJmdW5jdGlvblwiID8gZGVmYXVsdE9yQ29tcHV0ZShrZXkpIDogZGVmYXVsdE9yQ29tcHV0ZSA6IGRlZmF1bHRPckNvbXB1dGU7XG5cdFx0XHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jTWFwKGluY29taW5nLCAodikgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IHR5cGVvZiB0YXJnZXQuZ2V0T3JJbnNlcnQgPT0gXCJmdW5jdGlvblwiID8gdGFyZ2V0LmdldE9ySW5zZXJ0KGtleSwgdikgOiAodGFyZ2V0LnNldChrZXksIHYpLCB0YXJnZXQuZ2V0KGtleSkpO1xuXHRcdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdFx0XHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKGtleSwgdiwgbnVsbCwgXCJhZGRcIik7XG5cdFx0XHRcdFx0XHRpZiAoaXNQcm9taXNlKGluY29taW5nKSkgZW1pdFJlc29sdmVkKHRhcmdldCwga2V5LCB2LCBudWxsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWVPckZ4O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpO1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuXHRcdGxldCBnb3QgPSB2b2lkIDA7XG5cdFx0dHJ5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG5cdFx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIGdvdCA9IHZvaWQgMDtcblx0XHRcdGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRnb3QgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG59O1xudmFyIE9ic2VydmVTZXRIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXSA9IGZhbHNlO1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGdldCh0YXJnZXQsIG5hbWUsIGN0eCkge1xuXHRcdGlmIChbXG5cdFx0XHQkZXh0cmFjdEtleSQsXG5cdFx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdFx0XCJAdGFyZ2V0XCIsXG5cdFx0XHRcImRlcmVmXCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCAkZXh0cmFjdEtleSQpID8/IHNhZmVHZXQodGFyZ2V0LCAkb3JpZ2luYWxLZXkkKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3QgdmFsdWVPckZ4ID0gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSk7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHZhbHVlT3JGeDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWU7XG5cdFx0XHRpZiAoa2V5ID09IG51bGwpIHJldHVybjtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gdGFyZ2V0LmhhcyhrZXkpKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcImNsZWFyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8udmFsdWVzPy4oKSB8fCBbXSksIHJlc3VsdCA9IHZhbHVlT3JGeCgpO1xuXHRcdFx0b2xkVmFsdWVzLmZvckVhY2goKG9sZFZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG51bGwsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZGVsZXRlXCIpIHJldHVybiAodmFsdWUpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXModmFsdWUpLCBvbGRWYWx1ZSA9IGhhZCA/IHZhbHVlIDogbnVsbCwgcmVzdWx0ID0gdmFsdWVPckZ4KHZhbHVlKTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIGhhZCkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lih2YWx1ZSwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYWRkXCIpIHJldHVybiAodmFsdWUpID0+IHBvdGVudGlhbGx5QXN5bmModmFsdWUsICh2KSA9PiB7XG5cdFx0XHRjb25zdCBoYWQgPSB0YXJnZXQuaGFzKHYpLCBvbGRWYWx1ZSA9IGhhZCA/IHYgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodik7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRpZiAoIWhhZCkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lih2LCB2LCBvbGRWYWx1ZSwgXCJhZGRcIik7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCB2LCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0pO1xuXHRcdHJldHVybiB2YWx1ZU9yRng7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cbn07XG52YXIgJGlzT2JzZXJ2YWJsZSA9ICh0YXJnZXQpID0+IHtcblx0cmV0dXJuICEhKCh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpICYmIHRhcmdldCAhPSBudWxsICYmICh0YXJnZXQ/LlskZXh0cmFjdEtleSRdIHx8IHRhcmdldD8uWyRhZmZlY3RlZF0pKTtcbn07XG52YXIgbWFrZVJlYWN0aXZlUHJvcGVydGllcyA9IChvYmopID0+IHtcblx0aWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuXHRcdGNvbnN0IGVudHJpZXMgPSBvYmouZW50cmllcygpO1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGVudHJpZXMpIGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBrZXkpO1xuXHR9IGVsc2UgaWYgKG9iaiAhPSBudWxsICYmICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIG9iaiA9PSBcImZ1bmN0aW9uXCIpKSB7XG5cdFx0Y29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG9iaik7XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcykgZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIGtleSk7XG5cdH1cbn07XG52YXIgb2JzZXJ2ZUFycmF5ID0gKGFycikgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShhcnIpKSByZXR1cm4gYXJyO1xuXHRtYWtlUmVhY3RpdmVQcm9wZXJ0aWVzKGFycik7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgoYXJyLCBuZXcgT2JzZXJ2ZUFycmF5SGFuZGxlcigpKSwgYXJyKTtcbn07XG52YXIgb2JzZXJ2ZU9iamVjdCA9IChvYmopID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUob2JqKSkgcmV0dXJuIG9iajtcblx0bWFrZVJlYWN0aXZlUHJvcGVydGllcyhvYmopO1xuXHRyZXR1cm4gYmluZEV4aXN0aW5nVGhlbmFibGVzKHdyYXBXaXRoKG9iaiwgbmV3IE9ic2VydmVPYmplY3RIYW5kbGVyKCkpLCBvYmopO1xufTtcbnZhciBvYnNlcnZlTWFwID0gKG1hcCkgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShtYXApKSByZXR1cm4gbWFwO1xuXHRtYWtlUmVhY3RpdmVQcm9wZXJ0aWVzKG1hcCk7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgobWFwLCBuZXcgT2JzZXJ2ZU1hcEhhbmRsZXIoKSksIG1hcCk7XG59O1xudmFyIG9ic2VydmVTZXQgPSAoc2V0KSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKHNldCkpIHJldHVybiBzZXQ7XG5cdG1ha2VSZWFjdGl2ZVByb3BlcnRpZXMoc2V0KTtcblx0cmV0dXJuIHdyYXBXaXRoKHNldCwgbmV3IE9ic2VydmVTZXRIYW5kbGVyKCkpO1xufTtcblxuLy8gc3JjL2NvcmUvUHJpbWl0aXZlcy50c1xudmFyIG51bWJlclJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IG9iaiA9IHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogaXNQcm9taXNlID8gMCA6IE51bWJlcihkZXJlZihpbml0aWFsKSB8fCAwKSB8fCAwLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXM/LlskdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KCh0eXBlb2YgdGhpcz8uWyR2YWx1ZV0gIT0gXCJvYmplY3RcIiA/IHRoaXM/LlskdmFsdWVdIDogdGhpcz8uWyR2YWx1ZV0/LnZhbHVlIHx8IDApID8/IDAsIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9ICh2ICE9IG51bGwgJiYgIU51bWJlci5pc05hTih2KSA/IE51bWJlcih2KSA6IHRoaXNbJHZhbHVlXSkgfHwgMDtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiBOdW1iZXIodGhpc1skdmFsdWVdIHx8IDApIHx8IDA7XG5cdFx0fVxuXHR9O1xuXHRkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KG9iaiwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKG9iaik7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIHN0cmluZ1JlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IG9iaiA9IHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogKGlzUHJvbWlzZSA/IFwiXCIgOiBTdHJpbmcoZGVyZWYodHlwZW9mIGluaXRpYWwgPT0gXCJudW1iZXJcIiA/IFN0cmluZyhpbml0aWFsKSA6IGluaXRpYWwgfHwgXCJcIikpKSA/PyBcIlwiLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXM/LlskdmFsdWVdID8/IFwiXCIpID8/IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHRoaXM/LlskdmFsdWVdID8/IFwiXCIsIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9IFN0cmluZyh0eXBlb2YgdiA9PSBcIm51bWJlclwiID8gU3RyaW5nKHYpIDogdiB8fCBcIlwiKSA/PyBcIlwiO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzWyR2YWx1ZV0gPz8gXCJcIikgPz8gXCJcIjtcblx0XHR9XG5cdH07XG5cdGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBcInZhbHVlXCIpO1xuXHRjb25zdCAkciA9IG9ic2VydmUob2JqKTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgYm9vbGVhblJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IG9iaiA9IHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogKGlzUHJvbWlzZSA/IGZhbHNlIDogKGRlcmVmKGluaXRpYWwpICE9IG51bGwgPyB0eXBlb2YgZGVyZWYoaW5pdGlhbCkgPT0gXCJzdHJpbmdcIiA/IHRydWUgOiAhIWRlcmVmKGluaXRpYWwpIDogZmFsc2UpIHx8IGZhbHNlKSB8fCBmYWxzZSxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCghIXRoaXM/LlskdmFsdWVdIHx8IGZhbHNlLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsID8gdHlwZW9mIHYgPT0gXCJzdHJpbmdcIiA/IHRydWUgOiAhIXYgOiB0aGlzWyR2YWx1ZV0pIHx8IGZhbHNlO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSB8fCBmYWxzZTtcblx0XHR9XG5cdH07XG5cdGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBcInZhbHVlXCIpO1xuXHRjb25zdCAkciA9IG9ic2VydmUob2JqKTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgd3JhcFJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IG9iaiA9IHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHRoaXMudmFsdWUsIGhpbnQpO1xuXHRcdH0sXG5cdFx0dmFsdWU6IGlzUHJvbWlzZSA/IG51bGwgOiBkZXJlZihpbml0aWFsKVxuXHR9O1xuXHRkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KG9iaiwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKG9iaik7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZmZlY3RlZChpbml0aWFsLCAodikgPT4ge1xuXHRcdCRyPy5bJHRyaWdnZXJdPy4oKTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgbWFya1JlYWxQcm9wID0gKHRhcmdldCwgcmVhbFByb3ApID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGFyZ2V0ICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRhcmdldDtcblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCAkcmVhbFByb3AsIHtcblx0XHRcdHZhbHVlOiByZWFsUHJvcCxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0gY2F0Y2gge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXJnZXRbJHJlYWxQcm9wXSA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHR0cnkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIFwicmVhbFByb3BcIiwge1xuXHRcdFx0dmFsdWU6IHJlYWxQcm9wLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhcmdldC5yZWFsUHJvcCA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBwcm9wUmVmID0gKHNyYywgc3JjUHJvcCA9IFwidmFsdWVcIiwgaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKHNyYykgfHwgIXNyYykgcmV0dXJuIHNyYztcblx0aWYgKEFycmF5LmlzQXJyYXkoc3JjKSAmJiBzcmMubGVuZ3RoID09IDIgJiYgc3JjWzBdICE9IG51bGwgJiYgKHNyY1swXSBpbnN0YW5jZW9mIE1hcCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrTWFwIHx8IHNyY1swXSBpbnN0YW5jZW9mIFNldCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrU2V0KSkge1xuXHRcdGlmIChzcmNQcm9wID09IG51bGwgfHwgc3JjUHJvcCA9PT0gXCJ2YWx1ZVwiKSBzcmNQcm9wID0gc3JjWzFdO1xuXHRcdHNyYyA9IHNyY1swXTtcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNyYykgJiYgIWlzQXJyYXlJbnZhbGlkS2V5KHNyYz8uWzFdLCBzcmMpICYmIChBcnJheS5pc0FycmF5KHNyYz8uWzBdKSB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJmdW5jdGlvblwiKSkgc3JjID0gc3JjPy5bMF07XG5cdGNvbnN0IGlzTWFwID0gc3JjIGluc3RhbmNlb2YgTWFwIHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtNYXAgfHwgdHlwZW9mIHNyYz8uZ2V0ID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc3JjPy5zZXQgPT0gXCJmdW5jdGlvblwiICYmICh0eXBlb2Ygc3JjPy5kZWxldGUgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBzcmM/LnJlbW92ZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRjb25zdCBpc1NldCA9IHNyYyBpbnN0YW5jZW9mIFNldCB8fCBzcmMgaW5zdGFuY2VvZiBXZWFrU2V0IHx8IHR5cGVvZiBzcmM/LmhhcyA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNyYz8uYWRkID09IFwiZnVuY3Rpb25cIiAmJiAodHlwZW9mIHNyYz8uZGVsZXRlID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygc3JjPy5yZW1vdmUgPT0gXCJmdW5jdGlvblwiKTtcblx0aWYgKGlzTWFwIHx8IGlzU2V0KSB7XG5cdFx0aWYgKHNyY1Byb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHR9IGVsc2UgaWYgKChzcmNQcm9wID8/PSBBcnJheS5pc0FycmF5KHNyYykgPyBudWxsIDogXCJ2YWx1ZVwiKSA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KHNyY1Byb3AsIHNyYykpIHJldHVybjtcblx0Y29uc3QgcmVhZFNsb3QgPSAoKSA9PiB7XG5cdFx0aWYgKGlzTWFwKSByZXR1cm4gc3JjPy5nZXQ/LihzcmNQcm9wKTtcblx0XHRpZiAoaXNTZXQpIHJldHVybiBzcmM/Lmhhcz8uKHNyY1Byb3ApID8gc3JjUHJvcCA6IG51bGw7XG5cdFx0cmV0dXJuIHNyYz8uW3NyY1Byb3BdO1xuXHR9O1xuXHRjb25zdCB3cml0ZVNsb3QgPSAodikgPT4ge1xuXHRcdGlmIChpc01hcCkge1xuXHRcdFx0Y29uc3QgbWFwID0gc3JjO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwodiwgbWFwPy5nZXQ/LihzcmNQcm9wKSkpIG1hcD8uc2V0Py4oc3JjUHJvcCwgdik7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9XG5cdFx0aWYgKGlzU2V0KSB7XG5cdFx0XHRjb25zdCBzZXQgPSBzcmM7XG5cdFx0XHRjb25zdCBtZW1iZXIgPSB2ID8/IHNyY1Byb3A7XG5cdFx0XHRpZiAobWVtYmVyID09IG51bGwpIHtcblx0XHRcdFx0c2V0Py5kZWxldGU/LihzcmNQcm9wKTtcblx0XHRcdFx0cmV0dXJuIG1lbWJlcjtcblx0XHRcdH1cblx0XHRcdGlmICghc2V0Py5oYXM/LihtZW1iZXIpKSBzZXQ/LmFkZD8uKG1lbWJlcik7XG5cdFx0XHRyZXR1cm4gbWVtYmVyO1xuXHRcdH1cblx0XHRpZiAoaXNOb3RFcXVhbCh2LCBzcmM/LltzcmNQcm9wXSkpIHNyY1tzcmNQcm9wXSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH07XG5cdGlmIChpc01hcCAmJiBpbml0aWFsICE9PSB2b2lkIDAgJiYgIXNyYz8uaGFzPy4oc3JjUHJvcCkpIHNyYz8uc2V0Py4oc3JjUHJvcCwgaW5pdGlhbCk7XG5cdGVsc2UgaWYgKGlzU2V0ICYmIGluaXRpYWwgJiYgIXNyYz8uaGFzPy4oc3JjUHJvcCkpIHNyYz8uYWRkPy4oc3JjUHJvcCk7XG5cdGNvbnN0IGN1cnJlbnQgPSByZWFkU2xvdCgpO1xuXHRpZiAoIWlzU2V0ICYmIHNyY1Byb3AgIT0gbnVsbCAmJiBoYXNWYWx1ZShjdXJyZW50KSAmJiBpc09ic2VydmFibGUoY3VycmVudCkpIHJldHVybiBtYXJrUmVhbFByb3AocmVjb3ZlclJlYWN0aXZlKGN1cnJlbnQpLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQgJiYgc3JjUHJvcCAmJiB0eXBlb2Ygc3JjPy5nZXRQcm9wZXJ0eSA9PSBcImZ1bmN0aW9uXCIgJiYgaXNPYnNlcnZhYmxlKHNyYz8uZ2V0UHJvcGVydHk/LihzcmNQcm9wKSkpIHJldHVybiBtYXJrUmVhbFByb3Aoc3JjPy5nZXRQcm9wZXJ0eT8uKHNyY1Byb3ApLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQpIHNyY1tzcmNQcm9wXSA/Pz0gaW5pdGlhbCA/PyBzcmM/LltzcmNQcm9wXTtcblx0ZWxzZSBpZiAoaXNNYXAgJiYgaXNOb3RFcXVhbChpbml0aWFsID8/IHNyYz8uZ2V0Py4oc3JjUHJvcCksIHNyYz8uZ2V0Py4oc3JjUHJvcCkpKSBzcmM/LnNldD8uKHNyY1Byb3AsIGluaXRpYWwgPz8gc3JjPy5nZXQ/LihzcmNQcm9wKSk7XG5cdGVsc2UgaWYgKGlzU2V0ICYmIHNyYz8uaGFzPy4oaW5pdGlhbCA/PyBzcmNQcm9wKSkgc3JjPy5hZGQ/Lihpbml0aWFsID8/IHNyY1Byb3ApO1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IGlzU2V0ID8gcmVhZFNsb3QoKSA6IHJlYWRTbG90KCkgPz8gaW5pdGlhbCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyhyZWFkU2xvdCgpID8/IHRoaXNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludChyZWFkU2xvdCgpLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHRyWyR0cmlnZ2VyTG9jayQxXSA9IHRydWU7XG5cdFx0XHRpZiAoaXNTZXQpIHRoaXNbJHZhbHVlXSA9IHdyaXRlU2xvdCh2KTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjb25zdCBuZXh0ID0gdiA/PyBkZWZhdWx0QnlUeXBlKHJlYWRTbG90KCkpO1xuXHRcdFx0XHR0aGlzWyR2YWx1ZV0gPSB3cml0ZVNsb3QobmV4dCk7XG5cdFx0XHR9XG5cdFx0XHRyWyR0cmlnZ2VyTG9jayQxXSA9IGZhbHNlO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0Y29uc3Qgc2xvdCA9IHJlYWRTbG90KCk7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gc2xvdCA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0bWFya1JlYWxQcm9wKHIsIHNyY1Byb3ApO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzcmMsICh2LCBfcHJvcCwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKF9wcm9wICE9IHNyY1Byb3ApIHJldHVybjtcblx0XHRpZiAoclskdHJpZ2dlckxvY2skMV0pIHJldHVybjtcblx0XHRjb25zdCBuZXh0ID0gaXNTZXQgPyByZWFkU2xvdCgpIDogdjtcblx0XHRjb25zdCBwcmV2ID0gclskdmFsdWVdO1xuXHRcdHJbJHZhbHVlXSA9IG5leHQ7XG5cdFx0clskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiBuZXh0LFxuXHRcdFx0b2xkVmFsdWU6IG9sZCA/PyBwcmV2LFxuXHRcdFx0dHJpZ2dlcjogdHJpZ2dlciA/PyBcInNldFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHI7XG59O1xudmFyICRyZWYgPSAodHlwZWQsIGJlaGF2aW9yKSA9PiB7XG5cdHN3aXRjaCAodHlwZW9mIHR5cGVkKSB7XG5cdFx0Y2FzZSBcImJvb2xlYW5cIjogcmV0dXJuIGJvb2xlYW5SZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwibnVtYmVyXCI6IHJldHVybiBudW1iZXJSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwic3RyaW5nXCI6IHJldHVybiBzdHJpbmdSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwib2JqZWN0XCI6IGlmICh0eXBlZCAhPSBudWxsKSByZXR1cm4gd3JhcFJlZihvYnNlcnZlKHR5cGVkKSwgYmVoYXZpb3IpO1xuXHRcdGRlZmF1bHQ6IHJldHVybiB3cmFwUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdH1cbn07XG52YXIgcmVmID0gKHR5cGVkLCBwcm9wID0gXCJ2YWx1ZVwiLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCAkciA9IGlzT2JzZXJ2YWJsZSh0eXBlZCkgPyB0eXBlZCA6ICRyZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0aWYgKHByb3AgIT0gbnVsbCkgcmV0dXJuIHByb3BSZWYoJHIsIHByb3AsIGJlaGF2aW9yKTtcblx0ZWxzZSByZXR1cm4gJHI7XG59O1xudmFyIHByb21pc2VkID0gKHByb21pc2UsIGJlaGF2aW9yKSA9PiB7XG5cdHJldHVybiByZWYocHJvbWlzZSwgYmVoYXZpb3IpO1xufTtcbnZhciB0cmlnZ2VyV2l0aERlbGF5ID0gKHJlZiwgY2IsIGRlbGF5ID0gMTAwKSA9PiB7XG5cdGlmIChyZWY/LnZhbHVlID8/IHJlZikgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGlmIChyZWYudmFsdWUpIGNiPy4oKTtcblx0fSwgZGVsYXkpO1xufTtcbnZhciBkZWxheWVkQmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHR9O1xufTtcbnZhciBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHRcdGlmICghdG0pIGNiPy4oKTtcblx0fTtcbn07XG5mdW5jdGlvbiBvYnNlcnZlKHRhcmdldCwgc3RhdGVOYW1lKSB7XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0aWYgKCh0YXJnZXQgPSBkZXJlZj8uKHRhcmdldCkpID09IG51bGwgfHwgdGFyZ2V0IGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0YXJnZXQgaW5zdGFuY2VvZiBXZWFrUmVmIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0Y29uc3QgdW53cmFwID0gdGFyZ2V0O1xuXHRpZiAodW53cmFwID09IG51bGwgfHwgdHlwZW9mIHVud3JhcCA9PSBcInN5bWJvbFwiIHx8ICEodHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiKSB8fCB1bndyYXAgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHVud3JhcCBpbnN0YW5jZW9mIFdlYWtSZWYpIHJldHVybiB1bndyYXA7XG5cdGxldCByZWFjdGl2ZSA9IHVud3JhcDtcblx0aWYgKEFycmF5LmlzQXJyYXkodW53cmFwKSkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZUFycmF5KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZU1hcCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVTZXQodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlT2JqZWN0KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9XG5cdHJldHVybiByZWFjdGl2ZTtcbn1cbnZhciBpc09ic2VydmFibGUgPSAodGFyZ2V0KSA9PiB7XG5cdGlmICh0eXBlb2YgSFRNTElucHV0RWxlbWVudCAhPSBcInVuZGVmaW5lZFwiICYmIHRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSB8fCBzdWJzY3JpcHRSZWdpc3RyeT8uaGFzPy4odGFyZ2V0KSkpO1xufTtcbnZhciByZWNvdmVyUmVhY3RpdmUgPSAodGFyZ2V0KSA9PiB7XG5cdHJldHVybiBpc09ic2VydmFibGUodGFyZ2V0KSA/IG9ic2VydmUodGFyZ2V0KSA6IG51bGw7XG59O1xuXG4vLyBzcmMvY29yZS9NYWlubGluZS50c1xudmFyIHVzZU9ic2VydmFibGUgPSAodW53cmFwKSA9PiB7XG5cdGlmICh1bndyYXAgPT0gbnVsbCB8fCB0eXBlb2YgdW53cmFwICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHVud3JhcCAhPSBcImZ1bmN0aW9uXCIgfHwgdW53cmFwPy5bU3ltYm9sLm9ic2VydmFibGVdICE9IG51bGwpIHJldHVybiB1bndyYXA7XG5cdHRyeSB7XG5cdFx0dW53cmFwW1N5bWJvbC5vYnNlcnZhYmxlXSA9IHNlbGY/LmNvbXBhdGlibGU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRjb25zb2xlLndhcm4oXCJVbmFibGUgdG8gYXNzaWduIDxbU3ltYm9sLm9ic2VydmFibGVdPiwgb2JqZWN0IHdpbGwgbm90IG9ic2VydmFibGUgYnkgb3RoZXIgZnJhbWV3b3Jrc1wiKTtcblx0fVxuXHR1bndyYXBbJGFmZmVjdGVkXSA9IChjYiwgcHJvcCwgb3B0aW9ucykgPT4ge1xuXHRcdGNvbnN0IG9ic2VydmFibGUgPSB1bndyYXA/LltTeW1ib2w/Lm9ic2VydmFibGVdO1xuXHRcdG9ic2VydmFibGU/LigpPy5hZmZlY3RlZD8uKGNiLCBwcm9wLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gKCkgPT4gb2JzZXJ2YWJsZT8uKCk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH07XG5cdHJldHVybiB1bndyYXA7XG59O1xudmFyIHNwZWNpYWxpemVkU3Vic2NyaWJlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgY2hlY2tWYWxpZE9iaiA9IChvYmopID0+IHtcblx0aWYgKHR5cGVvZiBvYmogPT0gXCJzeW1ib2xcIiB8fCBvYmogPT0gbnVsbCB8fCAhKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikpIHJldHVybjtcblx0cmV0dXJuIG9iajtcbn07XG52YXIgaW5pdGlhbFRyaWdnZXIgPSBcImluaXRpYWxcIjtcbnZhciByZWFsUHJvcE9mID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCBwcm9wID0gdGFyZ2V0Py5bJHJlYWxQcm9wXSA/PyB0YXJnZXQ/LnJlYWxQcm9wO1xuXHRyZXR1cm4gaXNLZXlUeXBlKHByb3ApID8gcHJvcCA6IG51bGw7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mKHRhcmdldCk7XG5cdGlmIChyZWFsUHJvcCAhPSBudWxsICYmIChwcm9wID09IG51bGwgfHwgcHJvcCA9PSBcInZhbHVlXCIpKSByZXR1cm4gcmVhbFByb3A7XG5cdHJldHVybiBwcm9wO1xufTtcbnZhciBwcm9wVmFsdWVPZiA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0aWYgKHByb3AgIT0gbnVsbCAmJiBwcm9wID09IHJlYWxQcm9wT2YodGFyZ2V0KSkgcmV0dXJuIHRhcmdldD8udmFsdWU7XG5cdHJldHVybiB0YXJnZXQ/Lltwcm9wXTtcbn07XG52YXIgY2FsbEJ5UHJvcFJlZkF3YXJlID0gKHRhcmdldCwgcHJvcCwgY2IsIGN0eCkgPT4ge1xuXHRpZiAocHJvcCAhPSBudWxsICYmIHByb3AgPT0gcmVhbFByb3BPZih0YXJnZXQpKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSBwcm9wVmFsdWVPZih0YXJnZXQsIHByb3ApO1xuXHRcdGlmICh2YWx1ZSAhPSBudWxsKSByZXR1cm4gY2I/Lih2YWx1ZSwgcHJvcCwgbnVsbCwgXCJzZXRcIik7XG5cdH1cblx0cmV0dXJuIGNhbGxCeVByb3AodGFyZ2V0LCBwcm9wLCBjYiwgY3R4KTtcbn07XG52YXIgd2l0aFRyaWdnZXIgPSAoY2IsIG9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKTtcblx0aWYgKHRyaWdnZXIgPT0gaW5pdGlhbFRyaWdnZXIpIHtcblx0XHRpZiAoIW5vcm1hbGl6ZWQudHJpZ2dlckltbWVkaWF0ZWx5KSByZXR1cm47XG5cdH0gZWxzZSBpZiAoIXRyaWdnZXJGaWx0ZXJBbGxvd3Mobm9ybWFsaXplZC5hZmZlY3RUeXBlcywgdHJpZ2dlcikpIHJldHVybjtcblx0cmV0dXJuICh2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIC4uLmV0YykgPT4gY2I/Lih2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG59O1xudmFyIHN1YnNjcmliZURpcmVjdGx5ID0gKHRhcmdldCwgcHJvcCwgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmICghdGFyZ2V0KSByZXR1cm47XG5cdGlmICghY2hlY2tWYWxpZE9iaih0YXJnZXQpKSByZXR1cm47XG5cdGNvbnN0IHRQcm9wID0gcHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IgPyBub3JtYWxpemVBZmZlY3RlZFByb3AodGFyZ2V0LCBwcm9wKSA6IG51bGw7XG5cdGxldCByZWdpc3RyeSA9IHRhcmdldD8uWyRyZWdpc3RyeUtleSRdID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHR0YXJnZXQgPSB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldDtcblx0Y29uc3Qgc2NoZWR1bGUgPSAoY2IpID0+IHtcblx0XHRyZXR1cm4gdHlwZW9mIHNjaGVkdWxlciAhPSBcInVuZGVmaW5lZFwiID8gc2NoZWR1bGVyPy55aWVsZD8uKCk/LnRoZW4/LihjYikgOiBxdWV1ZU1pY3JvdGFzayhjYik7XG5cdH07XG5cdHNjaGVkdWxlPy4oKCkgPT4ge1xuXHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0aWYgKCFpbml0aWFsQ2IpIHJldHVybjtcblx0XHRpZiAodFByb3AgIT0gbnVsbCAmJiB0UHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IpIGNhbGxCeVByb3BSZWZBd2FyZSh0YXJnZXQsIHRQcm9wLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdGVsc2UgY2FsbEJ5QWxsUHJvcCh0YXJnZXQsIGluaXRpYWxDYiwgbnVsbCk7XG5cdH0pO1xuXHRsZXQgdW5TdWIgPSByZWdpc3RyeT8uYWZmZWN0ZWQ/LihjYiwgdFByb3AsIG9wdGlvbnMpO1xuXHRpZiAodGFyZ2V0Py5bU3ltYm9sLmRpc3Bvc2VdKSByZXR1cm4gdW5TdWI7XG5cdGFkZFRvQ2FsbENoYWluKHVuU3ViLCBTeW1ib2wuZGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih1blN1YiwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih0YXJnZXQsIFN5bWJvbC5kaXNwb3NlLCB1blN1Yik7XG5cdGFkZFRvQ2FsbENoYWluKHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRyZXR1cm4gdW5TdWI7XG59O1xudmFyIHN1YnNjcmliZUlucHV0ID0gKHRnLCBfLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgYWZmZWN0VHlwZXMgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucykuYWZmZWN0VHlwZXM7XG5cdGNvbnN0ICRvcHQgPSB7fTtcblx0bGV0IG9sZFZhbHVlID0gdGc/LnZhbHVlO1xuXHRjb25zdCAkY2IgPSAoZXYpID0+IHtcblx0XHRjb25zdCB2YWx1ZSA9IGV2Py50YXJnZXQ/LnZhbHVlO1xuXHRcdGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcInNldFwiKSkgY2I/Lih2YWx1ZSwgXCJ2YWx1ZVwiLCBvbGRWYWx1ZSwgXCJzZXRcIiwgZXYpO1xuXHRcdG9sZFZhbHVlID0gdmFsdWU7XG5cdH07XG5cdHRnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcblx0cmV0dXJuICgpID0+IHRnPy5yZW1vdmVFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcbn07XG52YXIgY2hlY2tJc1BhaXJlZCA9ICh0ZykgPT4ge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh0ZykgJiYgdGc/Lmxlbmd0aCA9PSAyICYmIGNoZWNrVmFsaWRPYmoodGc/LlswXSkgJiYgKGlzS2V5VHlwZSh0Zz8uWzFdKSB8fCB0Zz8uWzFdID09IFN5bWJvbC5pdGVyYXRvcik7XG59O1xudmFyIGlzRWZmZWN0T3B0aW9uc0FyZyA9ICh2YWx1ZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiB2YWx1ZSB8fCBcInRyaWdnZXJzXCIgaW4gdmFsdWUgfHwgXCJ0cmlnZ2VySW1tZWRpYXRlbHlcIiBpbiB2YWx1ZSk7XG59O1xudmFyIG5vcm1hbGl6ZUVmZmVjdFRhcmdldHMgPSAodGFyZ2V0cykgPT4ge1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gW107XG5cdGlmIChBcnJheS5pc0FycmF5KHRhcmdldHMpICYmICFjaGVja0lzUGFpcmVkKHRhcmdldHMpICYmICFpc09ic2VydmFibGUodGFyZ2V0cykpIHJldHVybiB0YXJnZXRzO1xuXHRyZXR1cm4gW3RhcmdldHNdO1xufTtcbnZhciBlZmZlY3RUYXJnZXRDb250ZXh0ID0gKHNvdXJjZSkgPT4ge1xuXHRpZiAoY2hlY2tJc1BhaXJlZChzb3VyY2UpKSB7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gc291cmNlPy5bMF07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNvdXJjZSxcblx0XHRcdHRhcmdldCxcblx0XHRcdHByb3A6IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCh0YXJnZXQsIHNvdXJjZT8uWzFdKVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHtcblx0XHRzb3VyY2UsXG5cdFx0dGFyZ2V0OiBzb3VyY2UsXG5cdFx0cHJvcDogbnVsbFxuXHR9O1xufTtcbnZhciB0b0VmZmVjdEV2ZW50ID0gKHNvdXJjZSwgdGFyZ2V0LCB2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIGFyZ3MpID0+ICh7XG5cdHNvdXJjZSxcblx0dGFyZ2V0LFxuXHR2YWx1ZSxcblx0cHJvcCxcblx0bmFtZTogcHJvcCxcblx0b2xkVmFsdWUsXG5cdHRyaWdnZXIsXG5cdGFyZ3Ncbn0pO1xudmFyIHN1YnNjcmliZVBhaXJlZCA9ICh0ZywgXywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IHByb3AgPSBpc0tleVR5cGUodGc/LlsxXSkgPyB0Zz8uWzFdIDogbnVsbDtcblx0cmV0dXJuIGFmZmVjdGVkKHRnPy5bMF0sIHByb3AsIGNiLCBvcHRpb25zKTtcbn07XG52YXIgc3Vic2NyaWJlVGhlbmFibGUgPSAob2JqLCBwcm9wLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0cmV0dXJuIG9iaj8udGhlbj8uKChvYmopID0+IGFmZmVjdGVkPy4ob2JqLCBwcm9wLCBjYiwgb3B0aW9ucykpPy5jYXRjaD8uKChlKSA9PiB7XG5cdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9KTtcbn07XG52YXIgYWZmZWN0ZWQgPSAob2JqLCBwcm9wLCBjYiA9ICgpID0+IHt9LCBvcHRpb25zKSA9PiB7XG5cdGxldCBrZXkgPSBudWxsO1xuXHRpZiAodHlwZW9mIHByb3AgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0b3B0aW9ucyA9IGNiO1xuXHRcdGNiID0gcHJvcDtcblx0fSBlbHNlIGtleSA9IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcChvYmosIHByb3ApO1xuXHRpZiAodHlwZW9mIGNiID09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShjYikpIHtcblx0XHRvcHRpb25zID0gY2I7XG5cdFx0Y2IgPSAoKSA9PiB7fTtcblx0fVxuXHRpZiAoaXNQcmltaXRpdmUob2JqKSB8fCB0eXBlb2Ygb2JqID09IFwic3ltYm9sXCIpIHtcblx0XHRpZiAobm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpLnRyaWdnZXJJbW1lZGlhdGVseSkgcmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdHJldHVybiBjYj8uKG9iaiwgbnVsbCwgbnVsbCwgbnVsbCwgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdH0pKTtcblx0fVxuXHRpZiAodHlwZW9mIG9iaj8uWyRhZmZlY3RlZF0gPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gb2JqPy5bJGFmZmVjdGVkXT8uKGNiLCBrZXksIG9wdGlvbnMpO1xuXHRlbHNlIGlmIChjaGVja1ZhbGlkT2JqKG9iaikpIHtcblx0XHRjb25zdCB3cmFwcGVkID0gb2JqO1xuXHRcdGlmIChzcGVjaWFsaXplZFN1YnNjcmliZT8uaGFzPy4ob2JqID0gb2JqPy5bJGV4dHJhY3RLZXkkXSA/PyBvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldD8uKG9iaik/Lih3cmFwcGVkLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaXNPYnNlcnZhYmxlKHdyYXBwZWQpIHx8IGNoZWNrSXNQYWlyZWQob2JqKSAmJiBpc09ic2VydmFibGUob2JqPy5bMF0pKSB7XG5cdFx0XHRpZiAoaXNUaGVuYWJsZShvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVUaGVuYWJsZSk/LihvYmosIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdFx0ZWxzZSBpZiAoY2hlY2tJc1BhaXJlZChvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVQYWlyZWQpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBIVE1MSW5wdXRFbGVtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgb2JqIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlSW5wdXQpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlRGlyZWN0bHkpPy4od3JhcHBlZCwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0XHRpZiAoIWluaXRpYWxDYikgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdFx0aWYgKGNoZWNrSXNQYWlyZWQob2JqKSkgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaj8uWzBdLCBvYmo/LlsxXSwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdFx0ZWxzZSBpZiAoa2V5ICE9IG51bGwgJiYga2V5ICE9IFN5bWJvbC5pdGVyYXRvcikgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaiwga2V5LCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0XHRlbHNlIHJldHVybiBjYWxsQnlBbGxQcm9wPy4ob2JqLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxufTtcbmZ1bmN0aW9uIGVmZmVjdChjYiwgdGFyZ2V0cywgb3B0aW9ucykge1xuXHRpZiAoY2IgPT0gbnVsbCB8fCB0eXBlb2YgY2IgIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGlmIChpc0VmZmVjdE9wdGlvbnNBcmcodGFyZ2V0cykgJiYgb3B0aW9ucyA9PT0gdm9pZCAwKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIHRhcmdldHMpO1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIG9wdGlvbnMpO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Y29uc3QgYWZmZWN0ZWRPcHRpb25zID0ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVkLmFmZmVjdFR5cGVzLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogbm9ybWFsaXplZC50cmlnZ2VySW1tZWRpYXRlbHlcblx0fTtcblx0Y29uc3QgZGlzcG9zZXJzID0gbm9ybWFsaXplRWZmZWN0VGFyZ2V0cyh0YXJnZXRzKS5tYXAoKHNvdXJjZSkgPT4ge1xuXHRcdGNvbnN0IGN0eCA9IGVmZmVjdFRhcmdldENvbnRleHQoc291cmNlKTtcblx0XHRyZXR1cm4gYWZmZWN0ZWQoY3R4LnRhcmdldCwgY3R4LnByb3AsICh2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmFyZ3MpID0+IHtcblx0XHRcdHJldHVybiBjYih0b0VmZmVjdEV2ZW50KGN0eC5zb3VyY2UsIGN0eC50YXJnZXQsIHZhbHVlLCBwcm9wLCBvbGRWYWx1ZSwgdHJpZ2dlciA/PyBudWxsLCBhcmdzKSk7XG5cdFx0fSwgYWZmZWN0ZWRPcHRpb25zKTtcblx0fSkuZmlsdGVyKChkaXNwb3NlKSA9PiB0eXBlb2YgZGlzcG9zZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRyZXR1cm4gKCkgPT4gZGlzcG9zZXJzLmZvckVhY2goKGRpc3Bvc2UpID0+IGRpc3Bvc2U/LigpKTtcbn1cbmZ1bmN0aW9uIGVmZmVjdGVkKHRhcmdldHMsIGNiLCBvcHRpb25zKSB7XG5cdHJldHVybiBlZmZlY3QoY2IsIHRhcmdldHMsIG9wdGlvbnMpO1xufVxudmFyIG1ha2VBcnJheU9ic2VydmFibGUgPSAodGcpID0+IHtcblx0aWYgKHRnIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gb2JzZXJ2YWJsZUJ5U2V0KHRnKTtcblx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gb2JzZXJ2YWJsZUJ5TWFwKHRnKTtcblx0cmV0dXJuIHRnO1xufTtcbnZhciBEb3VibGVXZWFrTWFwID0gY2xhc3Mge1xuXHQjdG9wID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdCNlbnN1cmVJbm5lcihrZXkxKSB7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbnVsbDtcblx0XHRsZXQgaW5uZXIgPSB0aGlzLiN0b3AuZ2V0KGtleTEpO1xuXHRcdGlmICghaW5uZXIpIHtcblx0XHRcdGlubmVyID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdFx0XHR0aGlzLiN0b3Auc2V0KGtleTEsIGlubmVyKTtcblx0XHR9XG5cdFx0cmV0dXJuIGlubmVyO1xuXHR9XG5cdCNzcGxpdFBhaXIocGFpcikge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShwYWlyKSB8fCBwYWlyLmxlbmd0aCAhPT0gMikgcmV0dXJuIFtudWxsLCBudWxsXTtcblx0XHRyZXR1cm4gcGFpcjtcblx0fVxuXHRoYXNMMShrZXkxKSB7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5oYXMoa2V5MSk7XG5cdH1cblx0c2V0KHBhaXIsIHZhbHVlKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRoaXM7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRnZXQocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2b2lkIDA7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5nZXQoa2V5MSk/LmdldChrZXkyKTtcblx0fVxuXHRoYXMocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmdldChrZXkxKT8uaGFzKGtleTIpID8/IGZhbHNlO1xuXHR9XG5cdGRlbGV0ZShwYWlyKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jdG9wLmdldChrZXkxKTtcblx0XHRyZXR1cm4gaW5uZXIgPyBpbm5lci5kZWxldGUoa2V5MikgOiBmYWxzZTtcblx0fVxuXHRkZWxldGVUb3Aoa2V5MSkge1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZGVsZXRlKGtleTEpO1xuXHR9XG5cdGdldE9yQ3JlYXRlKHBhaXIsIGZhY3RvcnkpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFjdG9yeT8uKCk7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRjb25zdCB2YWx1ZSA9IGZhY3RvcnkoKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRnZXRPckluc2VydChwYWlyLCB2YWx1ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cdGdldE9ySW5zZXJ0Q29tcHV0ZWQocGFpciwgY29tcHV0ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb21wdXRlPy4oW2tleTEsIGtleTJdKTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGNvbnN0IHZhbHVlID0gY29tcHV0ZShba2V5MSwga2V5Ml0pO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59O1xudmFyIHJlZ2lzdGVyZWRJdGVyYXRlZCA9IG5ldyBEb3VibGVXZWFrTWFwKCk7XG5mdW5jdGlvbiBpdGVyYXRlZCh0ZywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdGlmICghdGcpIHJldHVybjtcblx0aWYgKHR5cGVvZiB0ZyAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGcgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAocmVnaXN0ZXJlZEl0ZXJhdGVkLmhhcyhbdGcsIGNiXSkpIHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0KFt0ZywgY2JdKTtcblx0Y29uc3QgJHN1YiA9ICh2YWx1ZSwgbmFtZSwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZVwiKSB7XG5cdFx0XHRjb25zdCBlbnRyaWVzID0gKG9sZD8udmFsdWUgPz8gb2xkKT8uZW50cmllcz8uKCk7XG5cdFx0XHRjb25zdCBiYXNpcyA9IHRnPy52YWx1ZSA/PyB2YWx1ZT8udmFsdWUgPz8gdmFsdWU7XG5cdFx0XHRpZiAoZW50cmllcykgZm9yIChjb25zdCBbaWR4LCBpdGVtXSBvZiBlbnRyaWVzKSB7XG5cdFx0XHRcdGNvbnN0IG9mT2xkID0gaXRlbSA/PyAob2xkPy52YWx1ZSA/PyBvbGQpPy5baWR4XSA/PyBudWxsO1xuXHRcdFx0XHRjb25zdCBvZk5ldyA9IGJhc2lzPy5baWR4XTtcblx0XHRcdFx0aWYgKG9mT2xkID09IG51bGwgJiYgb2ZOZXcgIT0gbnVsbCkgY2Iob2ZOZXcsIGlkeCwgbnVsbCwgXCJhZGRcIik7XG5cdFx0XHRcdGVsc2UgaWYgKG9mT2xkICE9IG51bGwgJiYgb2ZOZXcgPT0gbnVsbCkgY2IobnVsbCwgaWR4LCBvZk9sZCwgXCJkZWxldGVcIik7XG5cdFx0XHRcdGVsc2UgaWYgKGlzTm90RXF1YWwob2ZPbGQsIG9mTmV3KSkgY2Iob2ZOZXcsIGlkeCwgb2ZPbGQsIFwic2V0XCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGl0ZXJhdGVkKHZhbHVlID8/IHRnPy52YWx1ZSwgY2IsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmFtZSA9PSBudWxsID8gdm9pZCAwIDogdGdbbmFtZV07XG5cdH07XG5cdHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0T3JJbnNlcnRDb21wdXRlZChbdGcsIGNiXSwgKCkgPT4ge1xuXHRcdGlmICh0ZyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIGFmZmVjdGVkKFtvYnNlcnZhYmxlQnlTZXQodGcpLCBTeW1ib2wuaXRlcmF0b3JdLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gYWZmZWN0ZWQodGcsIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaGFzVmFsdWUodGcpKSByZXR1cm4gYWZmZWN0ZWQodGcsICRzdWIsIG9wdGlvbnMpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHRnKSAmJiAhKHRnPy5sZW5ndGggPT0gMiAmJiBpc0tleVR5cGUodGc/LlsxXSkgJiYgaXNPYnNlcnZhYmxlKHRnPy5bMF0pKSkgcmV0dXJuIGFmZmVjdGVkKFt0ZywgU3ltYm9sLml0ZXJhdG9yXSwgY2IsIG9wdGlvbnMpO1xuXHRcdHJldHVybiBhZmZlY3RlZCh0ZywgY2IsIG9wdGlvbnMpO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIHVuYWZmZWN0ZWQodGcsIGNiKSB7XG5cdHJldHVybiB3aXRoUHJvbWlzZSh0ZywgKHRhcmdldCkgPT4ge1xuXHRcdGNvbnN0IGlzUGFpciA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KSAmJiB0YXJnZXQ/Lmxlbmd0aCA9PSAyICYmIFtcIm9iamVjdFwiLCBcImZ1bmN0aW9uXCJdLmluZGV4T2YodHlwZW9mIHRhcmdldD8uWzBdKSA+PSAwICYmIGlzS2V5VHlwZSh0YXJnZXQ/LlsxXSk7XG5cdFx0Y29uc3QgcHJvcCA9IGlzUGFpciA/IHRhcmdldD8uWzFdIDogbnVsbDtcblx0XHR0YXJnZXQgPSBpc1BhaXIgJiYgcHJvcCAhPSBudWxsID8gdGFyZ2V0Py5bMF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdGNvbnN0IHVud3JhcCA9IHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdCh0YXJnZXQ/LlskcmVnaXN0cnlLZXkkXSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKSk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH0pO1xufVxudmFyIGJpbmRCeSA9ICh0YXJnZXQsIHJlYWN0aXZlLCB3YXRjaCkgPT4ge1xuXHRhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHYsIHApID0+IHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2LCBwLCB0cnVlKTtcblx0fSk7XG5cdHdhdGNoPy4oKCkgPT4gdGFyZ2V0LCAoTikgPT4ge1xuXHRcdGZvciAoY29uc3QgayBpbiBOKSBvYmplY3RBc3NpZ24ocmVhY3RpdmUsIE5ba10sIGssIHRydWUpO1xuXHR9LCB7IGRlZXA6IHRydWUgfSk7XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGRlcml2YXRlID0gKGZyb20sIHJlYWN0Rm4sIHdhdGNoKSA9PiBiaW5kQnkocmVhY3RGbihzYWZlKGZyb20pKSwgZnJvbSwgd2F0Y2gpO1xudmFyIGJpbmRCeUtleSA9ICh0YXJnZXQsIHJlYWN0aXZlLCBrZXkgPSAoKSA9PiBcIlwiKSA9PiBhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHZhbHVlLCBwKSA9PiB7XG5cdGlmIChwID09IGtleSgpKSBvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbnVsbCwgdHJ1ZSk7XG59KTtcblxuLy8gc3JjL2NvcmUvQXNzaWduZWQudHNcbnZhciBjb25kaXRpb25hbEluZGV4ID0gKGNvbmRMaXN0ID0gW10pID0+IHtcblx0Y29uc3Qgc291cmNlID0gb2JzZXJ2ZSh7IHZhbHVlOiAwIH0pO1xuXHRjb25zdCByZWFkQ29uZGl0aW9uID0gKGNvbmRpdGlvbikgPT4ge1xuXHRcdGlmICh0eXBlb2YgY29uZGl0aW9uID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbmRpdGlvbigpO1xuXHRcdHJldHVybiBoYXNWYWx1ZShjb25kaXRpb24pID8gY29uZGl0aW9uLnZhbHVlIDogY29uZGl0aW9uO1xuXHR9O1xuXHRjb25zdCBldmFsdWF0ZSA9ICgpID0+IGNvbmRMaXN0LmZpbmRJbmRleCgoY29uZGl0aW9uKSA9PiAhIXJlYWRDb25kaXRpb24oY29uZGl0aW9uKSk7XG5cdGNvbnN0IHJlc3VsdCA9IGNvbXB1dGVkKFtzb3VyY2UsIFwidmFsdWVcIl0sIGV2YWx1YXRlLCBcInZhbHVlXCIpO1xuXHRjb25zdCBpbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdHNvdXJjZS52YWx1ZSsrO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlcnMgPSBbXTtcblx0aWYgKGlzT2JzZXJ2YWJsZShjb25kTGlzdCkpIGRpc3Bvc2Vycy5wdXNoKGFmZmVjdGVkKGNvbmRMaXN0LCBpbnZhbGlkYXRlLCB7XG5cdFx0YWZmZWN0VHlwZXM6IFtcblx0XHRcdFwiYWRkXCIsXG5cdFx0XHRcInNldFwiLFxuXHRcdFx0XCJkZWxldGVcIlxuXHRcdF0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIGNvbmRMaXN0KSBpZiAoaGFzVmFsdWUoY29uZGl0aW9uKSkgZGlzcG9zZXJzLnB1c2goYWZmZWN0ZWQoW2NvbmRpdGlvbiwgXCJ2YWx1ZVwiXSwgaW52YWxpZGF0ZSwge1xuXHRcdGFmZmVjdFR5cGVzOiBbXCJzZXR0ZXJcIl0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGFkZFRvQ2FsbENoYWluKHJlc3VsdCwgU3ltYm9sLmRpc3Bvc2UsICgpID0+IGRpc3Bvc2Vycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlPy4oKSkpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbnZhciBjb25kaXRpb25hbFJlZiA9IChjb25kLCBpZlRydWUsIGlmRmFsc2UsIGJlaGF2aW9yKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShjb25kKSkgcmV0dXJuIGNvbmQgPyBpZlRydWUgOiBpZkZhbHNlO1xuXHRjb25zdCBnZXRUcnVlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZlRydWU7XG5cdH07XG5cdGNvbnN0IGdldEZhbHNlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZkZhbHNlO1xuXHR9O1xuXHRjb25zdCB2YWx1ZU9mID0gKG4pID0+IHtcblx0XHRpZiAobiAhPSBudWxsKSBjb25kLnZhbHVlID0gaGFzVmFsdWUobikgPyBuPy52YWx1ZSA6IG47XG5cdFx0cmV0dXJuIChoYXNWYWx1ZShjb25kKSA/IGNvbmQ/LnZhbHVlIDogY29uZCkgPyBnZXRUcnVlKCkgOiBnZXRGYWxzZSgpO1xuXHR9O1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IHZhbHVlT2YoKSxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV0sIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9IHZhbHVlT2Yodik7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gdmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXTtcblx0XHR9XG5cdH0pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChbY29uZCwgXCJ2YWx1ZVwiXSwgKCkgPT4ge1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gcj8uWyR2YWx1ZV07XG5cdFx0Y29uc3QgdmFsdWUgPSB2YWx1ZU9mKCk7XG5cdFx0clskdmFsdWVdID0gdmFsdWU7XG5cdFx0cj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRvbGRWYWx1ZSxcblx0XHRcdHRyaWdnZXI6IFwibWFudWFsXCJcblx0XHR9KTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHIsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcjtcbn07XG52YXIgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbFJlZjtcbnZhciByZW1hcCA9IChzdWIsIGNiLCBkZXN0KSA9PiB7XG5cdGlmICghZGVzdCkgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzdWIsICh2YWx1ZSwgcHJvcCwgb2xkKSA9PiB7XG5cdFx0aWYgKHByb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGNvbnN0IGdvdCA9IGNiPy4odmFsdWUsIHByb3AsIG9sZCk7XG5cdFx0aWYgKHR5cGVvZiBnb3QgPT0gXCJvYmplY3RcIikgb2JqZWN0QXNzaWduTm90RXF1YWwoZGVzdCwgZ290KTtcblx0XHRlbHNlIGlmIChpc05vdEVxdWFsKGRlc3RbcHJvcF0sIGdvdCkpIGRlc3RbcHJvcF0gPSBnb3Q7XG5cdH0pO1xuXHRpZiAoZGVzdCkgYWRkVG9DYWxsQ2hhaW4oZGVzdCwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiBkZXN0O1xufTtcbnZhciB1bmlmaWVkID0gKC4uLnN1YnMpID0+IHtcblx0Y29uc3QgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRzdWJzPy5mb3JFYWNoPy4oKHN1YikgPT4gYWZmZWN0ZWQoc3ViLCAodmFsdWUsIHByb3AsIF8pID0+IHtcblx0XHRpZiAocHJvcCA9PSBudWxsKSByZXR1cm47XG5cdFx0aWYgKGlzTm90RXF1YWwoZGVzdFtwcm9wXSwgdmFsdWUpKSBkZXN0W3Byb3BdID0gdmFsdWU7XG5cdH0pKTtcblx0cmV0dXJuIGRlc3Q7XG59O1xudmFyIG9ic2VydmFibGVCeVNldCA9IChzZXQpID0+IHtcblx0Y29uc3Qgb2JzID0gb2JzZXJ2ZShbXSk7XG5cdG9icy5wdXNoKC4uLkFycmF5LmZyb20oc2V0Py52YWx1ZXM/LigpIHx8IFtdKSk7XG5cdGFkZFRvQ2FsbENoYWluKG9icywgU3ltYm9sLmRpc3Bvc2UsIGFmZmVjdGVkKHNldCwgKHZhbHVlLCBfLCBvbGQpID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2YWx1ZSwgb2xkKSkge1xuXHRcdFx0aWYgKG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwpIG9icy5wdXNoKHZhbHVlKTtcblx0XHRcdGVsc2UgaWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gb2JzLmluZGV4T2Yob2xkKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwKSBvYnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBpZHggPSBvYnMuaW5kZXhPZihvbGQpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDAgJiYgaXNOb3RFcXVhbChvYnNbaWR4XSwgdmFsdWUpKSBvYnNbaWR4XSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkpO1xuXHRyZXR1cm4gb2JzO1xufTtcbnZhciBvYnNlcnZhYmxlQnlNYXAgPSAobWFwKSA9PiB7XG5cdGNvbnN0IG9icyA9IG9ic2VydmUoW10pO1xuXHRjb25zdCBpbml0aWFsRW50cmllcyA9IEFycmF5LmZyb20obWFwLmVudHJpZXMoKSk7XG5cdG9icy5wdXNoKC4uLmluaXRpYWxFbnRyaWVzKTtcblx0YWRkVG9DYWxsQ2hhaW4ob2JzLCBTeW1ib2wuZGlzcG9zZSwgYWZmZWN0ZWQobWFwLCAodmFsdWUsIHByb3AsIG9sZCkgPT4ge1xuXHRcdGlmIChpc05vdEVxdWFsKHZhbHVlLCBvbGQpIHx8IG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwgfHwgb2xkICE9IG51bGwgJiYgdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0aWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0bGV0IGlkeCA9IG9icy5maW5kSW5kZXgoKFtuYW1lLCBfXSkgPT4gbmFtZSA9PSBwcm9wKTtcblx0XHRcdFx0aWYgKGlkeCA8IDApIGlkeCA9IG9icy5maW5kTGFzdEluZGV4KChbXywgdmFsXSkgPT4gb2xkID09PSB2YWwpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDApIG9icy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBpZHggPSBvYnMuZmluZEluZGV4KChbbmFtZSwgX10pID0+IG5hbWUgPT0gcHJvcCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCAmJiBpZHggPCBvYnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2JzW2lkeF0/LlsxXSwgdmFsdWUpKSBvYnNbaWR4XSA9IFtwcm9wLCB2YWx1ZV07XG5cdFx0XHRcdH0gZWxzZSBvYnMucHVzaChbcHJvcCwgdmFsdWVdKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKTtcblx0cmV0dXJuIG9icztcbn07XG52YXIgYXNzaWduTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgYXNzaWduID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgaXNBQ29tcHV0ZSA9IHR5cGVvZiBhPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIGE/Lmxlbmd0aCA9PSAyLCBpc0JDb21wdXRlID0gdHlwZW9mIGI/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgYj8ubGVuZ3RoID09IDIsIGNtcEJGbmMgPSBpc0JDb21wdXRlID8gYj8uWzFdIDogbnVsbDtcblx0Y29uc3QgaXNBUHJvcCA9IChpc0tleVR5cGUoYT8uWzFdKSB8fCBhPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBhPy5sZW5ndGggPT0gMjtcblx0bGV0IGFfcHJvcCA9IGlzQVByb3AgJiYgIWlzQUNvbXB1dGUgPyBhPy5bMV0gOiBBcnJheS5pc0FycmF5KGEpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgYSA9IFthLCBhX3Byb3BdO1xuXHRpZiAoaXNBQ29tcHV0ZSkgYVsxXSA9IGFfcHJvcDtcblx0Y29uc3QgaXNCUHJvcCA9IChpc0tleVR5cGUoYj8uWzFdKSB8fCBiPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBiPy5sZW5ndGggPT0gMjtcblx0bGV0IGJfcHJvcCA9IGlzQlByb3AgJiYgIWlzQkNvbXB1dGUgPyBiPy5bMV0gOiBBcnJheS5pc0FycmF5KGIpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNCUHJvcCAmJiAhaXNCQ29tcHV0ZSkgYiA9IFtiLCBiX3Byb3BdO1xuXHRpZiAoaXNCQ29tcHV0ZSkgYlsxXSA9IGJfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGJfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgYT8uWzBdKSB8fCBpc0FycmF5SW52YWxpZEtleShiX3Byb3AsIGI/LlswXSkpIHJldHVybjtcblx0aWYgKCEoKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgYj8uWzBdICE9IG51bGwpICYmICFBcnJheS5pc0FycmF5KGFbMF0pKSB7XG5cdFx0JGF2b2lkVHJpZ2dlcihiLCAoKSA9PiB7XG5cdFx0XHRhWzBdW2FfcHJvcF0gPSBiPy5bMF07XG5cdFx0fSk7XG5cdFx0cmV0dXJuICgpID0+IHt9O1xuXHR9XG5cdGNvbnN0IGNvbXB1dGUgPSAodiwgcCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IGJfdG1wID0gYlJlZj8uZGVyZWY/LigpO1xuXHRcdGlmIChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uYm91bmQgPT0gYl90bXApIHtcblx0XHRcdGxldCB2YWwgPSBudWxsO1xuXHRcdFx0Y29uc3QgY21wZnggPSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uY21wZng7XG5cdFx0XHQkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgY21wZnggPT0gXCJmdW5jdGlvblwiKSB2YWwgPSBjbXBmeD8uKCRnZXRWYWx1ZShiX3RtcCkgPz8gdiwgcCwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgdmFsID0gYl90bXA/LltwXSA/PyB2O1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBudiA9ICRnZXRWYWx1ZSh2YWwpO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwoYV90bXBbYV9wcm9wXSwgbnYpKSAkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGFfdG1wW2FfcHJvcF0gPSBudjtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSAoKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApKT8uZ2V0Py4oYV9wcm9wKSk/LmRpc3Bvc2U/LigpO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlID0gKCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IG1hcCA9IGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApO1xuXHRcdGNvbnN0IHN0b3JlID0gbWFwPy5nZXQ/LihhX3Byb3ApO1xuXHRcdG1hcD8uZGVsZXRlPy4oYV9wcm9wKTtcblx0XHRzdG9yZT8udW5zdWI/LigpO1xuXHR9O1xuXHRjb25zdCBiUmVmID0gYj8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShiPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBiPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihiPy5bMF0pIDogYj8uWzBdLCBhUmVmID0gYT8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBhPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYT8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShhPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBhPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihhPy5bMF0pIDogYT8uWzBdO1xuXHRsZXQgc3RvcmUgPSB7XG5cdFx0Y29tcHV0ZSxcblx0XHRkaXNwb3NlLFxuXHRcdGNtcGZ4OiBjbXBCRm5jXG5cdH07XG5cdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpLCBiX3RtcCA9IGJSZWY/LmRlcmVmPy4oKTtcblx0aWYgKGFSZWYgaW5zdGFuY2VvZiBXZWFrUmVmKSB7XG5cdFx0aWYgKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5nZXQ/LihhX3Byb3ApPy5ib3VuZCAhPSBiX3RtcCkgYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmRlbGV0ZT8uKGFfcHJvcCk7XG5cdFx0c3RvcmUgPSAoYXNzaWduTWFwPy5nZXRPckluc2VydD8uKGFfdG1wLCAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKSk/LmdldE9ySW5zZXJ0Q29tcHV0ZWQ/LihhX3Byb3AsICgpID0+ICh7XG5cdFx0XHRib3VuZDogYl90bXAsXG5cdFx0XHRjbXBmeDogY21wQkZuYyxcblx0XHRcdHVuc3ViOiBudWxsLFxuXHRcdFx0Y29tcHV0ZSxcblx0XHRcdGRpc3Bvc2Vcblx0XHR9KSk7XG5cdFx0c3RvcmUudW5zdWIgPSBhZmZlY3RlZChiLCBjb21wdXRlKTtcblx0XHRzdG9yZS5jbXBmeCA9IGNtcEJGbmM7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYV90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYl90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdH1cblx0aWYgKGJfdG1wICYmICFBcnJheS5pc0FycmF5KGJfdG1wKSkgJGF2b2lkVHJpZ2dlcihhX3RtcCwgKCkgPT4ge1xuXHRcdGJfdG1wW2JfcHJvcF0gPz89IGFfdG1wPy5bYV9wcm9wXSA/PyBiX3RtcFtiX3Byb3BdO1xuXHR9KTtcblx0cmV0dXJuIHN0b3JlPy5kaXNwb3NlO1xufTtcbnZhciBsaW5rID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgdXN1YiA9IFthc3NpZ24oYSwgYiwgcHJvcCksIGFzc2lnbihiLCBhLCBwcm9wKV07XG5cdHJldHVybiAoKSA9PiB1c3ViPy5tYXA/LigoYykgPT4gYz8uKCkpO1xufTtcbnZhciBjb21wdXRlZCA9IChzcmMsIGNiLCBiZWhhdmlvciwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRjb25zdCBpc0FDb21wdXRlID0gdHlwZW9mIHNyYz8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRjb25zdCBpc0FQcm9wID0gKGlzS2V5VHlwZShzcmM/LlsxXSkgfHwgc3JjPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRsZXQgYV9wcm9wID0gaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSA/IHNyYz8uWzFdIDogQXJyYXkuaXNBcnJheShzcmMpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgc3JjID0gW2lzQVByb3AgPyBzcmM/LlswXSA6IHNyYywgYV9wcm9wXTtcblx0aWYgKGlzQUNvbXB1dGUpIHNyY1sxXSA9IGFfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgc3JjPy5bMF0pKSByZXR1cm47XG5cdGxldCBvbGRWYWx1ZSA9IHZvaWQgMDtcblx0bGV0IG9sZEFyZyA9IHZvaWQgMDtcblx0Y29uc3QgY21wID0gKGFyZywgZm9yY2UpID0+IHtcblx0XHRhcmcgPz89IHNyYz8uWzBdPy5bYV9wcm9wXSA/PyBvbGRBcmcgPz8gYXJnO1xuXHRcdGlmIChmb3JjZSB8fCBpc05vdEVxdWFsKG9sZEFyZywgYXJnKSAmJiBhcmcgIT0gdm9pZCAwIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0bGV0IG52ID0gY2I/LihhcmcsIGFfcHJvcCwgb2xkQXJnKTtcblx0XHRcdG9sZFZhbHVlID0gbnY7XG5cdFx0XHRyZXR1cm4gbnY7XG5cdFx0fVxuXHRcdHJldHVybiBvbGRWYWx1ZTtcblx0fTtcblx0Y29uc3Qgd3JwRnVuYyA9IChhcmcsIHByb3AgPSBcInZhbHVlXCIsIG9sZEFyZyQsIG9wKSA9PiB7XG5cdFx0b2xkQXJnID0gb2xkQXJnJCA/PyBvbGRBcmc7XG5cdFx0YXJnID8/PSBzcmM/LlswXT8uW2FfcHJvcF07XG5cdFx0aWYgKGlzTm90RXF1YWwob2xkQXJnLCBhcmcpICYmIGFyZyAhPSB2b2lkIDAgfHwgb2xkVmFsdWUgPT0gdm9pZCAwKSB7XG5cdFx0XHRsZXQgbnYgPSBjYj8uKGFyZywgYV9wcm9wLCBvbGRBcmcsIG9wKTtcblx0XHRcdG9sZEFyZyA9IGFyZztcblx0XHRcdGlmIChpc05vdEVxdWFsKG52LCBvbGRWYWx1ZSkgfHwgb2xkVmFsdWUgPT0gdm9pZCAwKSB7XG5cdFx0XHRcdHJmW3Byb3BdID0gb2xkVmFsdWUgPSBudjtcblx0XHRcdFx0b2xkVmFsdWUgPSByZltwcm9wXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBudjtcblx0XHR9XG5cdFx0cmV0dXJuIHJmW3Byb3BdO1xuXHR9O1xuXHRjb25zdCBpbml0aWFsID0gY21wKHNyY1swXVthX3Byb3BdID8/IG9sZEFyZyk7XG5cdGNvbnN0IHBlbmRpbmdJbml0aWFsID0gaXNQcm9taXNlKGluaXRpYWwpO1xuXHRjb25zdCAkYXBwbHkgPSBTeW1ib2wuZm9yKFwiQEBhcHBseVwiKTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRwcm9taXNlLCB7XG5cdFx0dmFsdWU6IGluaXRpYWwsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkdmFsdWUsIHtcblx0XHR2YWx1ZTogaW5pdGlhbCxcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRiZWhhdmlvciwge1xuXHRcdHZhbHVlOiBiZWhhdmlvcixcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsIFN5bWJvbD8udG9TdHJpbmdUYWcsIHtcblx0XHR2YWx1ZTogU3RyaW5nKHdycEZ1bmNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiLFxuXHRcdHdyaXRhYmxlOiBmYWxzZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsIFN5bWJvbD8udG9QcmltaXRpdmUsIHtcblx0XHR2YWx1ZTogdHJ5UGFyc2VCeUhpbnQod3JwRnVuY1skdmFsdWVdLCBcIm51bWJlclwiKSxcblx0XHR3cml0YWJsZTogZmFsc2Vcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBcInZhbHVlXCIsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBjcCA9IGNtcCgpO1xuXHRcdFx0aWYgKGNwICE9IG51bGwpIHdycEZ1bmNbJHZhbHVlXSA9IGNwO1xuXHRcdFx0cmV0dXJuIHdycEZ1bmNbJHZhbHVlXTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYXJnKSB7XG5cdFx0XHR3cnBGdW5jWyR2YWx1ZV0gPSBjbXAoYXJnLCB0cnVlKTtcblx0XHR9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgJGFwcGx5LCB7XG5cdFx0dmFsdWU6ICh2KSA9PiB7XG5cdFx0XHRpZiAodiA9PSB2b2lkIDApIHJldHVybiByZj8udmFsdWU7XG5cdFx0XHRyZi52YWx1ZSA9IHY7XG5cdFx0XHRyZXR1cm4gcmY/LnZhbHVlO1xuXHRcdH0sXG5cdFx0d3JpdGFibGU6IGZhbHNlXG5cdH0pO1xuXHRjb25zdCByZiA9IG9ic2VydmUod3JwRnVuYyk7XG5cdGNvbnN0IHdyaXRlQ29tcHV0ZWQgPSAodmFsdWUsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbigodikgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSByZj8uWyR2YWx1ZV07XG5cdFx0XHRyZlskdmFsdWVdID0gdjtcblx0XHRcdHJmPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdFx0dmFsdWU6IHYsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHY7XG5cdFx0fSk7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSByZj8uWyR2YWx1ZV07XG5cdFx0cmZbJHZhbHVlXSA9IHZhbHVlO1xuXHRcdHJmPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlclxuXHRcdH0pO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblx0aWYgKHBlbmRpbmdJbml0aWFsKSB3cml0ZUNvbXB1dGVkKGluaXRpYWwsIFwicmVzb2x2ZWRcIik7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKFtzcmM/LlswXSA/PyBzcmMsIGFfcHJvcCA/PyBcInZhbHVlXCJdLCAoKSA9PiB7XG5cdFx0d3JpdGVDb21wdXRlZChjbXAoKSwgXCJtYW51YWxcIik7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyZiwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiByZjtcbn07XG52YXIgZGVsYXllZFN1YnNjcmliZSA9IChyZWYsIGNiLCBkZWxheSA9IDEwMCkgPT4ge1xuXHRsZXQgdG07XG5cdHJldHVybiBhZmZlY3RlZChyZWYsIFwidmFsdWVcIiwgKHYpID0+IHtcblx0XHRpZiAoIXYgJiYgdG0pIHtcblx0XHRcdGNsZWFyVGltZW91dCh0bSk7XG5cdFx0XHR0bSA9IG51bGw7XG5cdFx0fSBlbHNlIGlmICh2ICYmICF0bSkgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHJlZiwgY2IsIGRlbGF5KSA/PyB0bTtcblx0fSk7XG59O1xuXG5leHBvcnQgeyAkYWZmZWN0ZWQsICRyZWYsICRyZXNvbHZlZCwgJHRyaWdnZXIsICR0cmlnZ2VyQ29udHJvbCwgJHRyaWdnZXJMZXNzLCAkdHJpZ2dlckxvY2ssIEFzc2lnbk9iamVjdEhhbmRsZXIsIERvdWJsZVdlYWtNYXAsIGFkZFRvQ2FsbENoYWluLCBhZmZlY3RlZCwgYXNzaWduLCBhc3NpZ25NYXAsIGJpbmRCeSwgYmluZEJ5S2V5LCBib29sZWFuUmVmLCBjb21wdXRlZCwgY29uZGl0aW9uYWwsIGNvbmRpdGlvbmFsSW5kZXgsIGNvbmRpdGlvbmFsUmVmLCBkZWxheWVkQmVoYXZpb3IsIGRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciwgZGVsYXllZFN1YnNjcmliZSwgZGVyZWYsIGRlcml2YXRlLCBlZmZlY3QsIGVmZmVjdGVkLCBpc09ic2VydmFibGUsIGl0ZXJhdGVkLCBsaW5rLCBtYWtlQXJyYXlPYnNlcnZhYmxlLCBtYWtlT2JqZWN0QXNzaWduYWJsZSwgbWFrZVJlc29sdmVkT3AsIG51bWJlclJlZiwgb2JzZXJ2YWJsZUJ5TWFwLCBvYnNlcnZhYmxlQnlTZXQsIG9ic2VydmUsIHByb21pc2VkLCBwcm9wUmVmLCByZWNvdmVyUmVhY3RpdmUsIHJlZiwgcmVtYXAsIHJlc29sdmVkLCBzYWZlLCBzcGVjaWFsaXplZFN1YnNjcmliZSwgc3RyaW5nUmVmLCBzdWJzY3JpYmVEaXJlY3RseSwgc3Vic2NyaWJlSW5wdXQsIHN1YnNjcmliZVBhaXJlZCwgc3Vic2NyaWJlVGhlbmFibGUsIHRyaWdnZXJXaXRoRGVsYXksIHVuYWZmZWN0ZWQsIHVuaWZpZWQsIHVud3JhcCwgdXNlT2JzZXJ2YWJsZSwgd3JhcFJlZiwgd3JhcFNldEFz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Q0EsU0FBQTVCO0FBQUEsSUFDRCxDQUFDLEdBQ01qRTtBQUFBLEVBQ1I7QUFDQSxFQUFJaVgsS0FBZ0JHLEVBQWNoSixHQUFTLFVBQVU7QUFDckQsUUFBTW1CLElBQU14RSxFQUFTLENBQUM4RCxJQUFNLENBQUMsS0FBS0EsR0FBS2lILEtBQVUsT0FBTyxHQUFHLE1BQU07QUFDaEUsSUFBQXNCLEVBQWNULEVBQUksR0FBRyxRQUFRO0FBQUEsRUFDOUIsQ0FBQztBQUNELFNBQUExWCxFQUFlK1gsR0FBSSxPQUFPLFNBQVN6SCxDQUFHLEdBQy9CeUg7QUFDUixHQUNJSyxLQUFtQixDQUFDekgsR0FBSy9RLEdBQUltUixJQUFRLFFBQVE7QUFDaEQsTUFBSUc7QUFDSixTQUFPcEYsRUFBUzZFLEdBQUssU0FBUyxDQUFDL0ksTUFBTTtBQUNwQyxJQUFJLENBQUNBLEtBQUtzSixLQUNULGFBQWFBLENBQUUsR0FDZkEsSUFBSyxRQUNLdEosS0FBSyxDQUFDc0osTUFBSUEsSUFBS0osR0FBaUJILEdBQUsvUSxHQUFJbVIsQ0FBSyxLQUFLRztBQUFBLEVBQy9ELENBQUM7QUFDRjsiLAogICJuYW1lcyI6IFsiJGF2b2lkVHJpZ2dlciIsICIkZ2V0VmFsdWUiLCAiJHRyaWdnZXJMb2NrJDEiLCAiUHJvbWlzZWQiLCAiYmluZEN0eCIsICJjYWxsQnlBbGxQcm9wIiwgImNhbGxCeVByb3AiLCAiZGVmYXVsdEJ5VHlwZSIsICJoYXNWYWx1ZSIsICJpc0FycmF5SW52YWxpZEtleSIsICJpc0tleVR5cGUiLCAiaXNOb3RFcXVhbCIsICJpc1ByaW1pdGl2ZSIsICJpc1Byb21pc2UiLCAibWFrZVRyaWdnZXJMZXNzIiwgIm9iamVjdEFzc2lnbiIsICJvYmplY3RBc3NpZ25Ob3RFcXVhbCIsICJwb3RlbnRpYWxseUFzeW5jIiwgInBvdGVudGlhbGx5QXN5bmNNYXAiLCAicmVzb2x2ZWQkMSIsICJ0cnlQYXJzZUJ5SGludCIsICIkdmFsdWUiLCAiJGV4dHJhY3RLZXkkIiwgIiRvcmlnaW5hbEtleSQiLCAiJHJlZ2lzdHJ5S2V5JCIsICIkYmVoYXZpb3IiLCAiJHByb21pc2UiLCAiJHJlc29sdmVkIiwgIiR0cmlnZ2VyTGVzcyIsICIkdHJpZ2dlckxvY2siLCAiJHRyaWdnZXJDb250cm9sIiwgIiR0cmlnZ2VyIiwgIiRhZmZlY3RlZCIsICIkaXNOb3RFcXVhbCIsICIkcmVhbFByb3AiLCAiJG9yaWdpbmFsT2JqZWN0cyQiLCAic2FmZSIsICJ0YXJnZXQiLCAidW53cmFwIiwgIm1hcHBlZCIsICJlIiwgIksiLCAiViIsICJhcnIiLCAiZGVyZWYiLCAiZGlzY291bnRWYWx1ZSIsICJvcmlnaW5hbCIsICIkdmFsIiwgImlzVGhlbmFibGUiLCAidmFsIiwgIndpdGhQcm9taXNlIiwgImNiIiwgImRpc3Bvc2VNYXAiLCAiZGlzcG9zZVJlZ2lzdHJ5IiwgImNhbGxzdGFjayIsICJhZGRUb0NhbGxDaGFpbiIsICJvYmoiLCAibWV0aG9kS2V5IiwgImNhbGxiYWNrIiwgImNoYWluVGFyZ2V0IiwgIkNhbGxDaGFpbiIsICJhcmdzIiwgImlzQXJyYXlJbmRleCIsICJwcm9wIiwgIm51bSIsICJ3cmFwU2V0QXNBcnJheSIsICJzb3VyY2UiLCAib3B0aW9ucyIsICJiYWNraW5nU2V0IiwgIm5vdGlmeUR1cGxpY2F0ZSIsICJ2YWx1ZSIsICJ2aWEiLCAiaW5kZXgiLCAiaXRlbSIsICJzbmFwc2hvdCIsICJyZWJ1aWxkRnJvbSIsICJtZXRob2RzIiwgIml0ZW1zIiwgInNpemUiLCAiaXRlcmF0b3IiLCAiY3VycmVudCIsICJ0b1ByZXBlbmQiLCAibmV4dCIsICJzdGFydCIsICJkZWxldGVDb3VudCIsICJub3JtYWxpemVkU3RhcnQiLCAiYWN0dWFsRGVsZXRlQ291bnQiLCAicmVtb3ZlZCIsICJpbnNlcnRQb3NpdGlvbiIsICJfIiwgIm5leHRMZW5ndGgiLCAibmV4dFZhbHVlIiwgImN1cnJlbnRWYWx1ZSIsICJpZHgiLCAia2V5cyIsICJpIiwgIkFzc2lnbk9iamVjdEhhbmRsZXIiLCAibmFtZSIsICJuZXdUIiwgImN0eCIsICJtYWtlT2JqZWN0QXNzaWduYWJsZSIsICJweCIsICJ3aXRoVW5zdWJTeW1ib2wiLCAid2l0aFVuc3ViIiwgImNvbXBsZXRlV2l0aFVuc3ViIiwgInN1YnNjcmliZXIiLCAid2VhayIsICJoYW5kbGVyIiwgInJlZ2lzdHJ5IiwgInNhdkNvbXBsZXRlIiwgInVuYWZmZWN0ZWQiLCAiciIsICJzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbCIsICJzdWJzY3JpcHRSZWdpc3RyeSIsICJnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2wiLCAiZ2xvYmFsRWZmZWN0TGlzdGVuZXJzIiwgImVmZmVjdEdsb2JhbGx5IiwgIm5vcm1hbGl6ZWQiLCAibm9ybWFsaXplRWZmZWN0T3B0aW9ucyIsICJ3cmFwcGVkU3ltYm9sIiwgIndyYXBwZWQiLCAicmVnaXN0ZXIiLCAid2hhdCIsICJoYW5kbGUiLCAiU3Vic2NyaXB0IiwgIndyYXBXaXRoIiwgImZvckFsbCIsICJ3aWxkY2FyZFRyaWdnZXJzIiwgInRyaWdnZXJBbGlhc2VzIiwgInRyaWdnZXJDYW5vbmljYWxOYW1lc1N5bWJvbCIsICJjYW5vbmljYWwiLCAiYWxpYXNlcyIsICJhbGlhcyIsICJ0cmlnZ2VyQ2Fub25pY2FsTmFtZXMiLCAibm9ybWFsaXplVHJpZ2dlck5hbWUiLCAidHJpZ2dlciIsICJ0cmlnZ2VyTmFtZXNPZiIsICJleHBhbmRUcmlnZ2VyRmlsdGVyIiwgInR5cGVzIiwgIm5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIiLCAidHJpZ2dlcnMiLCAibGlzdCIsICJ0cmlnZ2VyRmlsdGVyQWxsb3dzIiwgImZpbHRlciIsICJpc09wdGlvbnNPYmplY3QiLCAibm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zIiwgImFmZmVjdFR5cGVzIiwgIlN1YnNjcmlwdFN5bWJvbCIsICIjc291cmNlIiwgIiNsaXN0ZW5lcnMiLCAiI2ZsYWdzIiwgIiNuYXRpdmUiLCAiI2l0ZXJhdG9yIiwgIiNpbkRpc3BhdGNoIiwgIiNkaXNhYmxlZFRyaWdnZXJzIiwgIiN0cmlnZ2VyQ29udHJvbCIsICIjcGVuZGluZyIsICIjcGVuZGluZ0J5UHJvcCIsICIjZmx1c2hTY2hlZHVsZWQiLCAiZW5hYmxlZCIsICIjZGlzcGF0Y2giLCAiY29udHJvbGxlciIsICJyZXMiLCAib2xkVmFsdWUiLCAiZXRjIiwgImxpc3RlbmVycyIsICJyZWNvcmQiLCAiZXZlbnQiLCAibnciLCAibmFtZXMiLCAicHJldmlvdXMiLCAicmVzdG9yZSIsICJ3YXNEaXNhYmxlZCIsICJyZXN1bHQiLCAib3BLZXkiLCAiYnlPcCIsICJiYXRjaCIsICJvcE1hcCIsICJubSIsICJ2IiwgIm92IiwgInRnIiwgInJlc3QiLCAicmF3T2YiLCAidW53cmFwcGVkIiwgInJlc29sdmVkIiwgIm1vZGUiLCAicmF3IiwgIm1ha2VSZXNvbHZlZE9wIiwgImVtaXQiLCAicnVuIiwgInBlbmRpbmciLCAia2V5IiwgImNhbGxiYWNrT3JWYWx1ZSIsICJlbWl0UmVzb2x2ZWQiLCAib3AiLCAiYmluZEV4aXN0aW5nVGhlbmFibGVzIiwgImxpdmUiLCAiX19zYWZlR2V0R3VhcmRTeW1ib2wiLCAicmVhY3RpdmVQcm9wZXJ0aWVzU3ltYm9sIiwgInJlYWN0aXZlUHJvcGVydGllcyIsICJyZWFjdGl2ZU1ldGhvZHNTeW1ib2wiLCAicmVhY3RpdmVNZXRob2RzIiwgIm1hcmtSZWFjdGl2ZVByb3BlcnR5IiwgImlzUmVhY3RpdmVQcm9wZXJ0eSIsICJub3RpZnlSZWFjdGl2ZVByb3BlcnR5IiwgInJlY2VpdmVyIiwgIm93bmVyIiwgIm5ld1ZhbHVlIiwgInRyaWdnZXJOYW1lIiwgInRyaWdnZXJLZXlPZiIsICJzYWZlR2V0IiwgImRlZmluZVJlYWN0aXZlUHJvcGVydHkiLCAiZGVzY3JpcHRvciIsICJpbml0aWFsVmFsdWUiLCAidmFsdWVzIiwgImxhc3RBc3NpZ25lZCIsICJwcm9wZXJ0eURlc2MiLCAiYWN0dWFsVmFsdWUiLCAiX19zeXN0ZW1Ta2lwIiwgInN5c3RlbVNraXBHZXQiLCAiZ290IiwgIl9fc2FmZUdldEd1YXJkIiwgImlzR2V0dGVyIiwgInByb3BOYW1lIiwgImZhbGxUaHJvdWdoIiwgInRtcCIsICJzYWZlU2V0IiwgImFjdGl2ZSIsICJyZWMiLCAiaGFzT3duIiwgImlzVHJpZ2dlckVtaXRPcHRpb25zIiwgImFsbG93VmFsdWVPbmx5IiwgInRyaWdnZXJPcHRpb25WYWx1ZSIsICJmYWxsYmFjayIsICJ0cmlnZ2VyT3B0aW9uVHJpZ2dlciIsICJpc1J1bnRpbWVLZXkiLCAicmVhbFByb3BPZiQxIiwgInRyaWdnZXJWYWx1ZU9mIiwgInJlYWxQcm9wIiwgImNyZWF0ZVRyaWdnZXJBUEkiLCAiYXBpIiwgIm9wT3JPcHRpb25zIiwgImNvbnRyb2wiLCAic3lzdGVtR2V0IiwgImFmZmVjdGVkIiwgIm9ic2VydmFibGVBUElNZXRob2RzIiwgInVzdWIiLCAiY29tcCIsICJPYnNlcnZlQXJyYXlNZXRob2QiLCAiI25hbWUiLCAiI3NlbGYiLCAiI2hhbmRsZSIsICJzZWxmIiwgInNraXAiLCAiYWRkZWQiLCAic2V0UGFpcnMiLCAib2xkU3RhdGUiLCAib2JzZXJ2ZUFycmF5IiwgInJlZyIsICJJIiwgInBhaXIiLCAidHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UiLCAib2xkTGVuIiwgIm5ld0xlbiIsICJyZW1vdmVkSXRlbXMiLCAiYWRkZWRDb3VudCIsICJPYnNlcnZlQXJyYXlIYW5kbGVyIiwgInN5cyIsICJvYnMiLCAib2xkIiwgInh5enciLCAicmdiYSIsICJ4eXp3X2lkeCIsICJyZ2JhX2lkeCIsICJPYnNlcnZlT2JqZWN0SGFuZGxlciIsICJoaW50IiwgImZ0IiwgIiRvcmlnaW5hbCIsICJzdWJzY3JpcHQiLCAiJHJlc3VsdCIsICJPYnNlcnZlTWFwSGFuZGxlciIsICJ2YWx1ZU9yRngiLCAib2xkVmFsdWVzIiwgImhhZCIsICJjb21wdXRlZCIsICJkZWZhdWx0T3JDb21wdXRlIiwgImluY29taW5nIiwgIk9ic2VydmVTZXRIYW5kbGVyIiwgIiRpc09ic2VydmFibGUiLCAibWFrZVJlYWN0aXZlUHJvcGVydGllcyIsICJlbnRyaWVzIiwgIm9ic2VydmVPYmplY3QiLCAib2JzZXJ2ZU1hcCIsICJtYXAiLCAib2JzZXJ2ZVNldCIsICJzZXQiLCAibnVtYmVyUmVmIiwgImluaXRpYWwiLCAiYmVoYXZpb3IiLCAiJHIiLCAib2JzZXJ2ZSIsICJzdHJpbmdSZWYiLCAiYm9vbGVhblJlZiIsICJ3cmFwUmVmIiwgIm1hcmtSZWFsUHJvcCIsICJwcm9wUmVmIiwgInNyYyIsICJzcmNQcm9wIiwgImlzTWFwIiwgImlzU2V0IiwgInJlYWRTbG90IiwgIndyaXRlU2xvdCIsICJtZW1iZXIiLCAiaXNPYnNlcnZhYmxlIiwgInJlY292ZXJSZWFjdGl2ZSIsICJzbG90IiwgInVzYiIsICJfcHJvcCIsICJwcmV2IiwgIiRyZWYiLCAidHlwZWQiLCAicmVmIiwgInByb21pc2VkIiwgInByb21pc2UiLCAidHJpZ2dlcldpdGhEZWxheSIsICJkZWxheSIsICJkZWxheWVkQmVoYXZpb3IiLCAic2lnIiwgInRtIiwgImRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciIsICJzdGF0ZU5hbWUiLCAicmVhY3RpdmUiLCAidXNlT2JzZXJ2YWJsZSIsICJvYnNlcnZhYmxlIiwgInNwZWNpYWxpemVkU3Vic2NyaWJlIiwgImNoZWNrVmFsaWRPYmoiLCAiaW5pdGlhbFRyaWdnZXIiLCAicmVhbFByb3BPZiIsICJub3JtYWxpemVBZmZlY3RlZFByb3AiLCAicHJvcFZhbHVlT2YiLCAiY2FsbEJ5UHJvcFJlZkF3YXJlIiwgIndpdGhUcmlnZ2VyIiwgInN1YnNjcmliZURpcmVjdGx5IiwgInRQcm9wIiwgImluaXRpYWxDYiIsICJ1blN1YiIsICJzdWJzY3JpYmVJbnB1dCIsICIkb3B0IiwgIiRjYiIsICJldiIsICJjaGVja0lzUGFpcmVkIiwgImlzRWZmZWN0T3B0aW9uc0FyZyIsICJub3JtYWxpemVFZmZlY3RUYXJnZXRzIiwgInRhcmdldHMiLCAiZWZmZWN0VGFyZ2V0Q29udGV4dCIsICJ0b0VmZmVjdEV2ZW50IiwgInN1YnNjcmliZVBhaXJlZCIsICJzdWJzY3JpYmVUaGVuYWJsZSIsICJlZmZlY3QiLCAiYWZmZWN0ZWRPcHRpb25zIiwgImRpc3Bvc2VycyIsICJkaXNwb3NlIiwgImVmZmVjdGVkIiwgIm1ha2VBcnJheU9ic2VydmFibGUiLCAib2JzZXJ2YWJsZUJ5U2V0IiwgIm9ic2VydmFibGVCeU1hcCIsICJEb3VibGVXZWFrTWFwIiwgIiN0b3AiLCAiI2Vuc3VyZUlubmVyIiwgImtleTEiLCAiaW5uZXIiLCAiI3NwbGl0UGFpciIsICJrZXkyIiwgImZhY3RvcnkiLCAiY29tcHV0ZSIsICJyZWdpc3RlcmVkSXRlcmF0ZWQiLCAiaXRlcmF0ZWQiLCAiJHN1YiIsICJiYXNpcyIsICJvZk9sZCIsICJvZk5ldyIsICJpc1BhaXIiLCAiYmluZEJ5IiwgIndhdGNoIiwgInAiLCAiTiIsICJrIiwgImRlcml2YXRlIiwgImZyb20iLCAicmVhY3RGbiIsICJiaW5kQnlLZXkiLCAiY29uZGl0aW9uYWxJbmRleCIsICJjb25kTGlzdCIsICJyZWFkQ29uZGl0aW9uIiwgImNvbmRpdGlvbiIsICJpbnZhbGlkYXRlIiwgImNvbmRpdGlvbmFsUmVmIiwgImNvbmQiLCAiaWZUcnVlIiwgImlmRmFsc2UiLCAiZ2V0VHJ1ZSIsICJnZXRGYWxzZSIsICJ2YWx1ZU9mIiwgIm4iLCAiY29uZGl0aW9uYWwiLCAicmVtYXAiLCAic3ViIiwgImRlc3QiLCAidW5pZmllZCIsICJzdWJzIiwgImluaXRpYWxFbnRyaWVzIiwgImFzc2lnbk1hcCIsICJhc3NpZ24iLCAiYSIsICJiIiwgImlzQUNvbXB1dGUiLCAiaXNCQ29tcHV0ZSIsICJjbXBCRm5jIiwgImlzQVByb3AiLCAiYV9wcm9wIiwgImlzQlByb3AiLCAiYl9wcm9wIiwgImFfdG1wIiwgImFSZWYiLCAiYl90bXAiLCAiYlJlZiIsICJjbXBmeCIsICJudiIsICJzdG9yZSIsICJsaW5rIiwgImMiLCAib2xkQXJnIiwgImNtcCIsICJhcmciLCAiZm9yY2UiLCAid3JwRnVuYyIsICJvbGRBcmckIiwgInJmIiwgInBlbmRpbmdJbml0aWFsIiwgIiRhcHBseSIsICJjcCIsICJ3cml0ZUNvbXB1dGVkIiwgImRlbGF5ZWRTdWJzY3JpYmUiXQp9Cg==
