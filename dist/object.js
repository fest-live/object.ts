import { $avoidTrigger as oe, $getValue as He, $triggerLock as xe, Promised as Ue, bindCtx as U, callByAllProp as nt, callByProp as gt, defaultByType as wt, hasValue as W, isArrayInvalidKey as le, isKeyType as j, isNotEqual as A, isPrimitive as T, isPromise as k, makeTriggerLess as be, objectAssign as ae, objectAssignNotEqual as At, potentiallyAsync as Ve, potentiallyAsyncMap as qe, resolved as Re, tryParseByHint as C } from "@fest-lib/core";
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var d = /* @__PURE__ */ Symbol.for("@value"), w = /* @__PURE__ */ Symbol.for("@extract"), D = /* @__PURE__ */ Symbol.for("@origin"), ie = /* @__PURE__ */ Symbol.for("@registry"), q = /* @__PURE__ */ Symbol.for("@behavior"), V = /* @__PURE__ */ Symbol.for("@promise"), lt = /* @__PURE__ */ Symbol.for("@resolved"), Se = /* @__PURE__ */ Symbol.for("@trigger-less"), h = /* @__PURE__ */ Symbol.for("@trigger-lock"), Ot = /* @__PURE__ */ Symbol.for("@trigger-control"), $ = /* @__PURE__ */ Symbol.for("@trigger"), se = /* @__PURE__ */ Symbol.for("@subscribe"), it = /* @__PURE__ */ Symbol.for("@isNotEqual"), de = /* @__PURE__ */ Symbol.for("@realProp"), Je = /* @__PURE__ */ new WeakMap(), ce = (e) => {
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
        return (typeof n == "object" || typeof n == "function") && (Rt.register(n, l), Qe.set(n, l), n[Symbol.dispose] ??= () => l.forEach((s) => {
          s?.();
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
      const c = l(), a = Math.min(Math.max(i, 0), c.length), v = f === void 0 ? c.length - a : Math.max(0, Math.min(f, c.length - a)), m = c.splice(a, v);
      let b = a;
      for (const O of o) {
        if (c.includes(O)) {
          n(O, "splice", b);
          continue;
        }
        c.splice(b++, 0, O);
      }
      return s(c), m;
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
      if (ee(f)) return l()[Number(f)];
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
      if (ee(f)) {
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
      if (ee(f)) {
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
      if (ee(f)) {
        const o = Number(f);
        return o >= 0 && o < r.size;
      }
      return f in u;
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
}, st = /* @__PURE__ */ Symbol.for("object.ts@withUnsub");
globalThis[st] ??= /* @__PURE__ */ new WeakMap();
var It = globalThis[st], Mt = (e, t, r) => It.getOrInsert(e, () => {
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
}), ut = /* @__PURE__ */ Symbol.for("object.ts@subscriptRegistry");
globalThis[ut] ??= /* @__PURE__ */ new WeakMap();
var S = globalThis[ut] ??= /* @__PURE__ */ new WeakMap(), ft = /* @__PURE__ */ Symbol.for("object.ts@globalEffectListeners");
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
var $t = globalThis[yt], ue = (e = "set") => {
  if (e == null) return e;
  const t = String(e || "set");
  return $t.get(t) ?? t;
}, at = (e) => {
  const t = e == null ? "all" : String(ue(e) ?? "all");
  return [t, ...ze.get(t) ?? []];
}, Ye = (e = ["*"]) => new Set([...X(e)].flatMap((t) => [t, ...ze.get(t) ?? []])), X = (e = ["*"]) => {
  const t = typeof e == "string" ? [e] : Array.from(e ?? ["*"]), r = new Set(t.map((n) => {
    const l = String(n || "*");
    return ct.has(l) ? l : String(ue(l) ?? l);
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
  #s = !1;
  constructor(t) {
    this.#r = t, this.#e = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new WeakSet(), this.#c = {
      enable: (l = ["*"], s) => s ? this.withTriggers(l, !0, s) : this.setTriggersEnabled(l, !0),
      disable: (l = ["*"], s) => s ? this.withTriggers(l, !1, s) : this.setTriggersEnabled(l, !1),
      set: (l, s) => this.setTriggersEnabled(l, s),
      with: (l, s) => this.withTriggers(l, !0, s),
      without: (l, s) => this.withTriggers(l, !1, s),
      isEnabled: (l) => this.isTriggerEnabled(l)
    }, this.#o = { next: (l) => {
      l && (Array.isArray(l) ? this.#u(...l) : this.#u(l));
    } };
    const r = new WeakRef(this), n = function(l) {
      const s = l?.next?.bind?.(l);
      return Mt(l, r, s);
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
  #u(t, r = null, n, l = "all", ...s) {
    l = ue(l) ?? l;
    const u = this.#e;
    if (u?.size)
      for (const [i, f] of u.entries()) (f.prop === t || f.prop === te || f.prop === null) && Q(f.triggers, l) && this.$safeExec(i, r, t, n, l, ...s);
    if (he.size) {
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
    const l = [...Ye(t)], s = new Map(l.map((i) => [i, this.#n.has(i)])), u = () => {
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
  trigger(t, r, n, l = "set", ...s) {
    if (typeof t == "symbol" || (l === void 0 && (l = "set"), l = ue(l) ?? l, !this.isTriggerEnabled(l))) return;
    const u = `${l ?? "all"}`;
    let i = this.#l.get(t);
    i || (i = /* @__PURE__ */ new Map(), this.#l.set(t, i)), i.set(u, [
      t,
      r,
      n,
      l,
      s
    ]), !this.#s && (this.#s = !0, scheduler?.yield?.()?.then?.(() => {
      this.#s = !1;
      const f = this.#l;
      this.#l = /* @__PURE__ */ new Map();
      for (const [o, c] of f)
        if (!(o != null && this.#i.has(o))) {
          o != null && this.#i.add(o);
          try {
            for (const [, a] of c) {
              const [v, m, b, O, I] = a;
              try {
                this.#u(v, m, b, O, ...I ?? []);
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
    return t ? l.then((s) => {
      const u = Ce(e), i = u?.realProp ?? (u && "value" in u ? "value" : null);
      return S.get(u)?.trigger?.(i, s, void 0, "resolved"), s;
    }) : l;
  });
  return r.all = () => r("all"), r.allSettled = () => r("settled"), r.allKeyed = () => r("all"), r.allSettledKeyed = () => r("settled"), r.try = (n, ...l) => Promise.try(n, ...l).then((s) => Ze(s ?? e, "all")), r;
}
function Y(e, t, r, n) {
  const l = Ce(e) ?? e;
  S.get(l)?.trigger?.(t, r, n, "resolved");
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
function et(e, t, r, n, l) {
  const s = S.get(e) ?? S.get(t), u = $e(e, r);
  (y(e, it) ?? A)(n, l) && s?.trigger?.(u, l, n), k(l) && Y(e, u, l, n);
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
  const l = /* @__PURE__ */ new WeakMap(), s = {
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
  n.get && (s.get = function() {
    return n.get.call(this);
  }), r !== void 0 && typeof r < "u" && l.set(e, r);
  const u = Reflect.defineProperty(e, t, s);
  return u && Le(e, t), u;
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
  return typeof r == "function" ? U(e, r) : r;
}, R = globalThis[Wt] ??= /* @__PURE__ */ new WeakMap();
function Nt(e, t) {
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
}, Dt = (e, t, r) => {
  if (e == null) return !1;
  let n = __safeSetGuard?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  return n?.has?.(t) ? !1 : (n?.add?.(t), Reflect.set(e, t, r));
}, y = (e, t, r) => {
  let n;
  if (e == null) return e;
  let l = R?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  if (l?.has?.(t)) return null;
  if (!Nt(e, t)) n ??= Reflect.get(e, t, r ?? e);
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
}, z = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Pe = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && (z(e, "key") || z(e, "name") || z(e, "oldValue") || z(e, "old") || z(e, "op") || z(e, "trigger") || t && z(e, "value")), G = (e, t, r) => z(e, t) ? e[t] : t == "oldValue" && z(e, "old") ? e.old : r(), ge = (e, t = "manual") => ue(e.trigger ?? e.op ?? t), Bt = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", ve = (e) => {
  const t = y(e, de) ?? y(e, "realProp");
  return Bt(t) ? t : null;
}, $e = (e, t) => t == "value" ? ve(e) ?? t : t, Kt = (e, t) => {
  const r = ve(e);
  return r != null && t == r ? y(e, "value") ?? y(e, d) ?? y(e, t) : t == null ? void 0 : y(e, t);
}, we = (e, t, r) => {
  const n = (s, u, i) => (Pe(u) || (i ??= u), t(Pe(s) ? s : Pe(u, !0) ? {
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
  if (t == Symbol.subscribe) return (n, l, s) => g(l != null ? [e, l] : e, n, s);
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
      const l = g(e, n?.next), s = n?.complete;
      return n.complete = (...u) => (l?.(), s?.(...u)), n.complete;
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
    let n = [], l = [], s = [], u = [...this.#e], i = -1;
    const f = Reflect.apply(e, t || this.#e, r);
    if (this.#t?.[h])
      return Array.isArray(f) ? _e(f) : f;
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
          ]) : A(a, v) && s.push([
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
        for (let c = 0; c < u.length; c++) A(u[c], this.#e[c]) && s.push([
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
    const o = S.get(this.#e);
    return n?.length == 1 ? o?.trigger?.(i, n[0], null, "add") : n?.length > 1 && (o?.trigger?.(i, n, null, "addAll"), n.forEach((c, a) => o?.trigger?.(i + a, c, null, "add"))), s?.length == 1 ? o?.trigger?.(s[0]?.[0] ?? i, s[0]?.[1], s[0]?.[2], s[0]?.[3] === !1 ? "add" : "set") : s?.length > 1 && (o?.trigger?.(i, s, u, "setAll"), s.forEach((c, a) => o?.trigger?.(c?.[0] ?? i + a, c?.[1], c?.[2], c?.[3] === !1 ? "add" : "set"))), l?.length == 1 ? o?.trigger?.(i, null, l[0], "delete") : l?.length > 1 && (o?.trigger?.(i, null, l, "deleteAll"), l.forEach((c, a) => o?.trigger?.(i + a, null, c, "delete"))), f == e ? new Proxy(f, this.#t) : Array.isArray(f) ? _e(f) : f;
  }
}, Gt = (e, t, r, n) => {
  const l = Number.isInteger(r) && Number.isInteger(n) && n < r ? t.slice(n, r) : [];
  if (!e[h] && r !== n) {
    const s = S.get(t);
    l.length === 1 ? s?.trigger?.(n, null, l[0], "delete") : l.length > 1 && (s?.trigger?.(n, null, l, "deleteAll"), l.forEach((i, f) => s?.trigger?.(n + f, null, i, "delete")));
    const u = Number.isInteger(r) && Number.isInteger(n) && n > r ? n - r : 0;
    if (u === 1) s?.trigger?.(r, void 0, null, "add");
    else if (u > 1) {
      const i = Array(u).fill(void 0);
      s?.trigger?.(r, i, null, "addAll"), i.forEach((f, o) => s?.trigger?.(r + o, void 0, null, "add"));
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
    const l = S?.get?.(e), s = Ae(e, t, l);
    if (s != null) return s;
    const u = Oe(e, t, l);
    if (u != null) return u;
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
      return f >= 0 ? c = Reflect.set(e, f, l) : o >= 0 ? c = Reflect.set(e, o, l) : c = Reflect.set(e, t, l), t == "length" && A(s, l) && Gt(this, e, s, l), !this[h] && typeof t != "symbol" && (A(s, l) && S?.get?.(e)?.trigger?.(t, l, s, "set"), n && Y(e, t, l, s)), c;
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
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? U(e, y(e, t)) : y(e, t);
    const n = S.get(e) ?? S.get(y(e, "value") ?? e), l = Ae(e, t, n);
    if (l != null) return l;
    y(e, t) == null && t != "value" && W(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e);
    const s = Oe(e, t, n);
    return s ?? (t == Se ? be.call(this, this) : t == $ ? we(n, (u) => {
      const i = $e(e, u.key ?? u.name ?? ve(e) ?? "value"), f = G(u, "oldValue", () => i == "value" || i == ve(e) ? y(e, d) : void 0), o = G(u, "value", () => Kt(e, i));
      return n?.trigger?.(i, o, f, ge(u, "manual"));
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
    const n = re(e, t);
    return n ?? Ve(r, (l) => {
      const s = re(l, t);
      if (s != null) return s;
      if (t == h && r)
        return this[h] = !!r, !0;
      if (t == h && !r)
        return delete this[h], !0;
      const u = e;
      if (y(e, t) == null && t != "value" && W(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e), typeof t == "symbol" && !(y(e, t) != null && t in e)) return;
      const i = $e(e, t), f = t == "value" ? y(e, d) ?? y(e, t) : y(e, t);
      e[t] = l;
      const o = y(e, t) ?? l;
      if (!this[h] && typeof t != "symbol" && !bt(u, t)) {
        const c = S.get(e) ?? S.get(u);
        (y(e, it) ?? A)?.(f, o) && c?.trigger?.(i, l, f), k(r) && Y(u, i, l, f);
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
    const l = y(e, t), s = Reflect.defineProperty(e, t, {
      get: r.get,
      set: r.set,
      enumerable: r.enumerable ?? !0,
      configurable: r.configurable ?? !0
    });
    return Dt(e, t, l), s;
  }
  deleteProperty(e, t) {
    if (t == h)
      return delete this[h], !0;
    y(e, t) == null && t != "value" && W(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e);
    const r = y(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != h && typeof t != "symbol" && S.get(e)?.trigger?.(t, null, r, "delete"), n;
  }
}, Ut = class {
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
    const n = S.get(e), l = Ae(e, t, n);
    if (l != null) return l;
    const s = Oe(e, t, n);
    if (s != null) return s;
    e = y(e, w) ?? y(e, D) ?? e;
    const u = U(e, y(e, t));
    if (typeof t == "symbol" && (t in e || y(e, t) != null)) return u;
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
      const i = Array.from(e?.entries?.() || []), f = u();
      return i.forEach(([o, c]) => {
        this[h] || S.get(e)?.trigger?.(o, null, c, "delete");
      }), f;
    };
    if (t == "delete") return (i, f = null) => {
      const o = e.has(i), c = e.get(i), a = u(i);
      return !this[h] && o && S.get(e)?.trigger?.(i, null, c, "delete"), a;
    };
    if (t == "set") return (i, f) => qe(f, (o) => {
      const c = e.has(i), a = e.get(i), v = u(i, o);
      return this[h] || ((!c || A(a, o)) && S.get(e)?.trigger?.(i, o, c ? a : null, c ? "set" : "add"), k(f) && Y(e, i, o, a)), v;
    });
    if (t == "getOrInsert" || t == "getOrInsertComputed") {
      const i = t == "getOrInsertComputed";
      return (f, o) => {
        if (e.has(f)) return e.get(f);
        const c = i && typeof o == "function" ? o(f) : o;
        return qe(c, (a) => {
          const v = typeof e.getOrInsert == "function" ? e.getOrInsert(f, a) : (e.set(f, a), e.get(f));
          return this[h] || (S.get(e)?.trigger?.(f, a, null, "add"), k(c) && Y(e, f, a, null)), v;
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
}, qt = class {
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
    const n = S.get(e), l = Ae(e, t, n);
    if (l != null) return l;
    const s = Oe(e, t, n);
    if (s != null) return s;
    e = y(e, w) ?? y(e, D) ?? e;
    const u = U(e, y(e, t));
    return typeof t == "symbol" && (t in e || y(e, t) != null) ? u : t == Se ? be.call(this, this) : t == $ ? we(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = G(i, "value", () => e.has(f)), c = G(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, c, ge(i, "manual"));
    }, e) : t == "clear" ? () => {
      const i = Array.from(e?.values?.() || []), f = u();
      return i.forEach((o) => {
        this[h] || S.get(e)?.trigger?.(null, null, o, "delete");
      }), f;
    } : t == "delete" ? (i) => {
      const f = e.has(i), o = f ? i : null, c = u(i);
      return !this[h] && f && S.get(e)?.trigger?.(i, null, o, "delete"), c;
    } : t == "add" ? (i) => Ve(i, (f) => {
      const o = e.has(f), c = o ? f : null, a = u(f);
      return this[h] || (o || S.get(e)?.trigger?.(f, f, c, "add"), k(i) && Y(e, f, f, c)), a;
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
}, L = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[se])), Te = (e) => {
  if (Array.isArray(e)) {
    const t = e.entries();
    for (const [r, n] of t) Z(e, r);
  } else if (e != null && (typeof e == "object" || typeof e == "function")) {
    const t = Object.entries(e);
    for (const [r, n] of t) Z(e, r);
  }
}, _e = (e) => L(e) ? e : (Te(e), Ne(fe(e, new Ft()), e)), Jt = (e) => L(e) ? e : (Te(e), Ne(fe(e, new Ht()), e)), Qt = (e) => L(e) ? e : (Te(e), Ne(fe(e, new Ut()), e)), Xt = (e) => L(e) ? e : (Te(e), fe(e, new qt())), Yt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [d]: r ? 0 : Number(N(e) || 0) || 0,
    [q]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](s) {
      return C((typeof this?.[d] != "object" ? this?.[d] : this?.[d]?.value || 0) ?? 0, s);
    },
    set value(s) {
      this[d] = (s != null && !Number.isNaN(s) ? Number(s) : this[d]) || 0;
    },
    get value() {
      return Number(this[d] || 0) || 0;
    }
  };
  Z(n, "value");
  const l = P(n);
  return e?.then?.((s) => {
    l.value = s, l[$]?.({
      key: "value",
      value: s,
      trigger: "resolved"
    });
  }), l;
}, Zt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [d]: (r ? "" : String(N(typeof e == "number" ? String(e) : e || ""))) ?? "",
    [q]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") ?? "";
    },
    [Symbol?.toPrimitive](s) {
      return C(this?.[d] ?? "", s);
    },
    set value(s) {
      this[d] = String(typeof s == "number" ? String(s) : s || "") ?? "";
    },
    get value() {
      return String(this[d] ?? "") ?? "";
    }
  };
  Z(n, "value");
  const l = P(n);
  return e?.then?.((s) => {
    l.value = s, l[$]?.({
      key: "value",
      value: s,
      trigger: "resolved"
    });
  }), l;
}, Lt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [d]: (r ? !1 : (N(e) != null ? typeof N(e) == "string" ? !0 : !!N(e) : !1) || !1) || !1,
    [q]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](s) {
      return C(!!this?.[d] || !1, s);
    },
    set value(s) {
      this[d] = (s != null ? typeof s == "string" ? !0 : !!s : this[d]) || !1;
    },
    get value() {
      return this[d] || !1;
    }
  };
  Z(n, "value");
  const l = P(n);
  return e?.then?.((s) => {
    l.value = s, l[$]?.({
      key: "value",
      value: s,
      trigger: "resolved"
    });
  }), l;
}, tt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [q]: t,
    [Symbol?.toStringTag]() {
      return String(this.value ?? "") || "";
    },
    [Symbol?.toPrimitive](s) {
      return C(this.value, s);
    },
    value: r ? null : N(e)
  };
  Z(n, "value");
  const l = P(n);
  return e?.then?.((s) => {
    l.value = s, l[$]?.({
      key: "value",
      value: s,
      trigger: "resolved"
    });
  }), g(e, (s) => {
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
  const l = e instanceof Map || e instanceof WeakMap || typeof e?.get == "function" && typeof e?.set == "function" && (typeof e?.delete == "function" || typeof e?.remove == "function"), s = e instanceof Set || e instanceof WeakSet || typeof e?.has == "function" && typeof e?.add == "function" && (typeof e?.delete == "function" || typeof e?.remove == "function");
  if (l || s) {
    if (t == null) return;
  } else if ((t ??= Array.isArray(e) ? null : "value") == null || le(t, e)) return;
  const u = () => l ? e?.get?.(t) : s ? e?.has?.(t) ? t : null : e?.[t], i = (a) => {
    if (l) {
      const v = e;
      return A(a, v?.get?.(t)) && v?.set?.(t, a), a;
    }
    if (s) {
      const v = e, m = a ?? t;
      return m == null ? (v?.delete?.(t), m) : (v?.has?.(m) || v?.add?.(m), m);
    }
    return A(a, e?.[t]) && (e[t] = a), a;
  };
  l && r !== void 0 && !e?.has?.(t) ? e?.set?.(t, r) : s && r && !e?.has?.(t) && e?.add?.(t);
  const f = u();
  if (!s && t != null && W(f) && K(f)) return Ie(nr(f), t);
  if (!l && !s && t && typeof e?.getProperty == "function" && K(e?.getProperty?.(t))) return Ie(e?.getProperty?.(t), t);
  !l && !s ? e[t] ??= r ?? e?.[t] : l && A(r ?? e?.get?.(t), e?.get?.(t)) ? e?.set?.(t, r ?? e?.get?.(t)) : s && e?.has?.(r ?? t) && e?.add?.(r ?? t);
  const o = P({
    [d]: s ? u() : u() ?? r,
    [q]: n,
    [Symbol?.toStringTag]() {
      return String(u() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return C(u(), a);
    },
    set value(a) {
      if (o[xe] = !0, s) this[d] = i(a);
      else {
        const v = a ?? wt(u());
        this[d] = i(v);
      }
      o[xe] = !1;
    },
    get value() {
      const a = u();
      return this[d] = a ?? this[d];
    }
  });
  Ie(o, t);
  const c = g(e, (a, v, m, b) => {
    if (v != t || o[xe]) return;
    const O = s ? u() : a, I = o[d];
    o[d] = O, o[$]?.({
      key: "value",
      value: O,
      oldValue: m ?? I,
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
      if (e != null) return tt(P(e), t);
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
function P(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || L(e) || (e = N?.(e)) == null || e instanceof Promise || e instanceof WeakRef || L(e)) return e;
  const r = e;
  if (r == null || typeof r == "symbol" || !(typeof r == "object" || typeof r == "function") || r instanceof Promise || r instanceof WeakRef) return r;
  let n = r;
  return Array.isArray(r) ? (n = _e(r), n) : r instanceof Map ? (n = Qt(r), n) : r instanceof Set ? (n = Xt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = Jt(r)), n);
}
var K = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[se] || S?.has?.(e))), nr = (e) => K(e) ? P(e) : null, Ir = (e) => {
  if (e == null || typeof e != "object" && typeof e != "function" || e?.[Symbol.observable] != null) return e;
  try {
    e[Symbol.observable] = self?.compatible;
  } catch {
    console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks");
  }
  return e[se] = (t, r, n) => {
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
  return (l, s, u, ...i) => e?.(l, s, u, r, ...i);
}, ir = (e, t, r, n = ["*"]) => {
  if (!e || !Be(e)) return;
  const l = t != Symbol.iterator ? je(e, t) : null;
  let s = e?.[ie] ?? S.get(e);
  e = e?.[w] ?? e, scheduler?.yield?.()?.then?.(() => {
    const i = St(r, n, pe);
    i && (l != null && l != Symbol.iterator ? We(e, l, i, null) : nt(e, i, null));
  });
  let u = s?.affected?.(r, l, n);
  return e?.[Symbol.dispose] || (E(u, Symbol.dispose, u), E(u, Symbol.asyncDispose, u), E(e, Symbol.dispose, u), E(e, Symbol.asyncDispose, u)), u;
}, sr = (e, t, r, n = ["*"]) => {
  const l = me(n).affectTypes, s = {};
  let u = e?.value;
  const i = (f) => {
    const o = f?.target?.value;
    Q(l, "set") && r?.(o, "value", u, "set", f), u = o;
  };
  return e?.addEventListener?.("change", i, s), () => e?.removeEventListener?.("change", i, s);
}, ne = (e) => Array.isArray(e) && e?.length == 2 && Be(e?.[0]) && (j(e?.[1]) || e?.[1] == Symbol.iterator), ur = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), fr = (e) => e == null ? [] : Array.isArray(e) && !ne(e) && !K(e) ? e : [e], or = (e) => {
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
}, cr = (e, t, r, n, l, s, u) => ({
  source: e,
  target: t,
  value: r,
  prop: n,
  name: n,
  oldValue: l,
  trigger: s,
  args: u
}), yr = (e, t, r, n = ["*"]) => {
  const l = j(e?.[1]) ? e?.[1] : null;
  return g(e?.[0], l, r, n);
}, ar = (e, t, r, n = ["*"]) => e?.then?.((l) => g?.(l, t, r, n))?.catch?.((l) => (console.warn(l), null)), g = (e, t, r = () => {
}, n) => {
  let l = null;
  if (typeof t == "function" ? (n = r, r = t) : l = je(e, t), (typeof r == "object" || Array.isArray(r)) && (n = r, r = () => {
  }), (T(e) || typeof e == "symbol") && me(n).triggerImmediately)
    return Ue(globalThis?.Promise?.try?.(() => r?.(e, null, null, null, pe)));
  if (typeof e?.[se] == "function") return e?.[se]?.(r, l, n);
  if (Be(e)) {
    const s = e;
    if (J?.has?.(e = e?.[w] ?? e)) return J?.get?.(e)?.(s, l, r, n);
    if (K(s) || ne(e) && K(e?.[0]))
      return ye(e) ? J?.getOrInsert?.(e, ar)?.(e, l, r, n) : ne(e) ? J?.getOrInsert?.(e, yr)?.(e, l, r, n) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? J?.getOrInsert?.(e, sr)?.(e, l, r, n) : J?.getOrInsert?.(e, ir)?.(s, l, r, n);
    {
      const u = St(r, n, pe);
      return u ? Ue(globalThis?.Promise?.try?.(() => ne(e) ? We?.(e?.[0], e?.[1], u, null) : l != null && l != Symbol.iterator ? We?.(e, l, u, null) : nt?.(e, u, null))) : void 0;
    }
  }
};
function dr(e, t, r) {
  if (e == null || typeof e != "function") return;
  if (ur(t) && r === void 0) return Xe(e, t);
  if (t == null) return Xe(e, r);
  const n = ht(r), l = {
    affectTypes: n.affectTypes,
    triggerImmediately: n.triggerImmediately
  }, s = fr(t).map((u) => {
    const i = or(u);
    return g(i.target, i.prop, (f, o, c, a, ...v) => e(cr(i.source, i.target, f, o, c, a ?? null, v)), l);
  }).filter((u) => typeof u == "function");
  return () => s.forEach((u) => u?.());
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
}, Me = new hr();
function vr(e, t, r = ["*"]) {
  if (!e || typeof e != "object" && typeof e != "function") return;
  if (Me.has([e, t])) return Me.get([e, t]);
  const n = (l, s, u, i) => {
    if (s == "value") {
      const f = (u?.value ?? u)?.entries?.(), o = e?.value ?? l?.value ?? l;
      if (f) for (const [c, a] of f) {
        const v = a ?? (u?.value ?? u)?.[c] ?? null, m = o?.[c];
        v == null && m != null ? t(m, c, null, "add") : v != null && m == null ? t(null, c, v, "delete") : A(v, m) && t(m, c, v, "set");
      }
      return vr(l ?? e?.value, t, r);
    }
    return s == null ? void 0 : e[s];
  };
  return Me.getOrInsertComputed([e, t], () => e instanceof Set ? g([mt(e), Symbol.iterator], t, r) : e instanceof Map ? g(e, t, r) : W(e) ? g(e, n, r) : Array.isArray(e) && !(e?.length == 2 && j(e?.[1]) && K(e?.[0])) ? g([e, Symbol.iterator], t, r) : g(e, t, r));
}
function Ee(e, t) {
  return xt(e, (r) => {
    const n = Array.isArray(r) && r?.length == 2 && ["object", "function"].indexOf(typeof r?.[0]) >= 0 && j(r?.[1]), l = n ? r?.[1] : null;
    r = n && l != null ? r?.[0] ?? r : r;
    const s = typeof r == "object" || typeof r == "function" ? r?.[w] ?? r : r;
    (r?.[ie] ?? S.get(s))?.unaffected?.(t, l);
  });
}
var pr = (e, t, r) => (g(t, null, (n, l) => {
  ae(e, n, l, !0);
}), r?.(() => e, (n) => {
  for (const l in n) ae(t, n[l], l, !0);
}, { deep: !0 }), e), kr = (e, t, r) => pr(t(ce(e)), e, r), $r = (e, t, r = () => "") => g(t, null, (n, l) => {
  l == r() && ae(e, n, null, !0);
}), _r = (e = []) => {
  const t = P({ value: 0 }), r = (i) => typeof i == "function" ? i() : W(i) ? i.value : i, l = mr([t, "value"], () => e.findIndex((i) => !!r(i)), "value"), s = () => {
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
  for (const i of e) W(i) && u.push(g([i, "value"], s, {
    affectTypes: ["setter"],
    triggerImmediately: !1
  }));
  return E(l, Symbol.dispose, () => u.forEach((i) => i?.())), l;
}, br = (e, t, r, n) => {
  if (T(e)) return e ? t : r;
  const l = () => t, s = () => r, u = (o) => (o != null && (e.value = W(o) ? o?.value : o), (W(e) ? e?.value : e) ? l() : s()), i = P({
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
    i[d] = c, i?.[$]?.({
      key: "value",
      value: c,
      oldValue: o,
      trigger: "manual"
    });
  });
  return E(i, Symbol.dispose, f), i;
}, Wr = br, Vr = (e, t, r) => {
  r || (r = P({}));
  const n = g(e, (l, s, u) => {
    if (s == null) return;
    const i = t?.(l, s, u);
    typeof i == "object" ? At(r, i) : A(r[s], i) && (r[s] = i);
  });
  return r && E(r, Symbol.dispose, n), r;
}, zr = (...e) => {
  const t = P({});
  return e?.forEach?.((r) => g(r, (n, l, s) => {
    l != null && A(t[l], n) && (t[l] = n);
  })), t;
}, mt = (e) => {
  const t = P([]);
  return t.push(...Array.from(e?.values?.() || [])), E(t, Symbol.dispose, g(e, (r, n, l) => {
    if (A(r, l))
      if (l == null && r != null) t.push(r);
      else if (l != null && r == null) {
        const s = t.indexOf(l);
        s >= 0 && t.splice(s, 1);
      } else {
        const s = t.indexOf(l);
        s >= 0 && A(t[s], r) && (t[s] = r);
      }
  })), t;
}, Sr = (e) => {
  const t = P([]), r = Array.from(e.entries());
  return t.push(...r), E(t, Symbol.dispose, g(e, (n, l, s) => {
    if (A(n, s) || s == null && n != null || s != null && n == null)
      if (s != null && n == null) {
        let u = t.findIndex(([i, f]) => i == l);
        u < 0 && (u = t.findLastIndex(([i, f]) => s === f)), u >= 0 && t.splice(u, 1);
      } else {
        let u = t.findIndex(([i, f]) => i == l);
        u >= 0 && u < t.length ? A(t[u]?.[1], n) && (t[u] = [l, n]) : t.push([l, n]);
      }
  })), t;
}, F = /* @__PURE__ */ new WeakMap(), rt = (e, t, r = "value") => {
  const n = typeof e?.[1] == "function" && e?.length == 2, l = typeof t?.[1] == "function" && t?.length == 2, s = l ? t?.[1] : null, u = (j(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let i = u && !n ? e?.[1] : Array.isArray(e) ? null : r;
  !u && !n && (e = [e, i]), n && (e[1] = i);
  const f = (j(t?.[1]) || t?.[1] == Symbol.iterator) && t?.length == 2;
  let o = f && !l ? t?.[1] : Array.isArray(t) ? null : r;
  if (!f && !l && (t = [t, o]), l && (t[1] = o), i == null || o == null || le(i, e?.[0]) || le(o, t?.[0])) return;
  if (!((typeof t?.[0] == "object" || typeof t?.[0] == "function") && t?.[0] != null) && !Array.isArray(e[0]))
    return oe(t, () => {
      e[0][i] = t?.[0];
    }), () => {
    };
  const c = (p, M) => {
    const x = m?.deref?.(), _ = v?.deref?.();
    if (F?.get?.(x)?.get?.(i)?.bound == _) {
      let B = null;
      const Ge = F?.get?.(x)?.get?.(i)?.cmpfx;
      oe(_, () => {
        typeof Ge == "function" ? B = Ge?.(He(_) ?? p, M, null) : B = _?.[M] ?? p;
      });
      const Fe = He(B);
      A(x[i], Fe) && oe(_, () => {
        x[i] = Fe;
      });
    } else F?.get?.(x)?.get?.(i)?.dispose?.();
  }, a = () => {
    const p = m?.deref?.(), M = F?.get?.(p), x = M?.get?.(i);
    M?.delete?.(i), x?.unsub?.();
  }, v = t?.[0] != null && (typeof t?.[0] == "object" || typeof t?.[0] == "function") && !(t?.[0] instanceof WeakRef || typeof t?.[0]?.deref == "function") ? new WeakRef(t?.[0]) : t?.[0], m = e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function") && !(e?.[0] instanceof WeakRef || typeof e?.[0]?.deref == "function") ? new WeakRef(e?.[0]) : e?.[0];
  let b = {
    compute: c,
    dispose: a,
    cmpfx: s
  };
  const O = m?.deref?.(), I = v?.deref?.();
  return m instanceof WeakRef && (F?.get?.(O)?.get?.(i)?.bound != I && F?.get?.(O)?.delete?.(i), b = F?.getOrInsert?.(O, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(i, () => ({
    bound: I,
    cmpfx: s,
    unsub: null,
    compute: c,
    dispose: a
  })), b.unsub = g(t, c), b.cmpfx = s, E(O, Symbol.dispose, b?.dispose), E(I, Symbol.dispose, b?.dispose)), I && !Array.isArray(I) && oe(O, () => {
    I[o] ??= O?.[i] ?? I[o];
  }), b?.dispose;
}, Cr = (e, t, r = "value") => {
  const n = [rt(e, t, r), rt(t, e, r)];
  return () => n?.map?.((l) => l?.());
}, mr = (e, t, r, n = "value") => {
  const l = typeof e?.[1] == "function" && e?.length == 2, s = (j(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let u = s && !l ? e?.[1] : Array.isArray(e) ? null : n;
  if (!s && !l && (e = [s ? e?.[0] : e, u]), l && (e[1] = u), u == null || le(u, e?.[0])) return;
  let i, f;
  const o = (p, M) => {
    if (p ??= e?.[0]?.[u] ?? f ?? p, M || A(f, p) && p != null || i == null) {
      let x = t?.(p, u, f);
      return i = x, x;
    }
    return i;
  }, c = (p, M = "value", x, _) => {
    if (f = x ?? f, p ??= e?.[0]?.[u], A(f, p) && p != null || i == null) {
      let B = t?.(p, u, f, _);
      return f = p, (A(B, i) || i == null) && (b[M] = i = B, i = b[M]), B;
    }
    return b[M];
  }, a = o(e[0][u] ?? f), v = k(a), m = /* @__PURE__ */ Symbol.for("@@apply");
  Object.defineProperty(c, V, {
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
  }), Object.defineProperty(c, m, {
    value: (p) => (p == null || (b.value = p), b?.value),
    writable: !1
  });
  const b = P(c), O = (p, M) => {
    if (k(p)) return Promise.resolve(p).then((_) => {
      const B = b?.[d];
      return b[d] = _, b?.[$]?.({
        key: "value",
        value: _,
        oldValue: B,
        trigger: "resolved"
      }), _;
    });
    const x = b?.[d];
    return b[d] = p, b?.[$]?.({
      key: "value",
      value: p,
      oldValue: x,
      trigger: M
    }), p;
  };
  v && O(a, "resolved");
  const I = g([e?.[0] ?? e, u ?? "value"], () => {
    O(o(), "manual");
  });
  return E(b, Symbol.dispose, I), b;
}, Nr = (e, t, r = 100) => {
  let n;
  return g(e, "value", (l) => {
    !l && n ? (clearTimeout(n), n = null) : l && !n && (n = De(e, t, r) ?? n);
  });
};
export {
  se as $affected,
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
  P as observe,
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
  sr as subscribeInput,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vI3JlZ2lvbiBzcmMvd3JhcC9TeW1ib2wudHNcblN5bWJvbC5vYnNlcnZhYmxlIHx8PSBTeW1ib2wuZm9yKFwib2JzZXJ2YWJsZVwiKTtcblN5bWJvbC5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJzdWJzY3JpYmVcIik7XG5TeW1ib2wudW5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJ1bnN1YnNjcmliZVwiKTtcbnZhciAkdmFsdWUgPSBTeW1ib2wuZm9yKFwiQHZhbHVlXCIpO1xudmFyICRleHRyYWN0S2V5JCA9IFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKTtcbnZhciAkb3JpZ2luYWxLZXkkID0gU3ltYm9sLmZvcihcIkBvcmlnaW5cIik7XG52YXIgJHJlZ2lzdHJ5S2V5JCA9IFN5bWJvbC5mb3IoXCJAcmVnaXN0cnlcIik7XG52YXIgJGJlaGF2aW9yID0gU3ltYm9sLmZvcihcIkBiZWhhdmlvclwiKTtcbnZhciAkcHJvbWlzZSA9IFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKTtcbnZhciAkcmVzb2x2ZWQgPSBTeW1ib2wuZm9yKFwiQHJlc29sdmVkXCIpO1xudmFyICR0cmlnZ2VyTGVzcyA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sZXNzXCIpO1xudmFyICR0cmlnZ2VyTG9jayA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sb2NrXCIpO1xudmFyICR0cmlnZ2VyQ29udHJvbCA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpO1xudmFyICR0cmlnZ2VyID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyXCIpO1xudmFyICRhZmZlY3RlZCA9IFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpO1xudmFyICRpc05vdEVxdWFsID0gU3ltYm9sLmZvcihcIkBpc05vdEVxdWFsXCIpO1xudmFyICRyZWFsUHJvcCA9IFN5bWJvbC5mb3IoXCJAcmVhbFByb3BcIik7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy93cmFwL1V0aWxzLnRzXG52YXIgJG9yaWdpbmFsT2JqZWN0cyQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzYWZlID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldCwgbWFwcGVkID0gKGUpID0+IHNhZmUoZSk7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHJldHVybiB1bndyYXA/Lm1hcD8uKG1hcHBlZCkgfHwgQXJyYXkuZnJvbSh1bndyYXAgfHwgW10pPy5tYXA/LihtYXBwZWQpIHx8IFtdO1xuXHRlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXAgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha01hcCkgcmV0dXJuIG5ldyBNYXAoQXJyYXkuZnJvbSh1bndyYXA/LmVudHJpZXM/LigpIHx8IFtdKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrU2V0KSByZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKHVud3JhcD8udmFsdWVzPy4oKSB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkpO1xuXHRlbHNlIGlmICh1bndyYXAgIT0gbnVsbCAmJiB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyh1bndyYXAgfHwge30pIHx8IFtdKT8uZmlsdGVyPy4oKFtLXSkgPT4gSyAhPSAkZXh0cmFjdEtleSQgJiYgSyAhPSAkb3JpZ2luYWxLZXkkICYmIEsgIT0gJHJlZ2lzdHJ5S2V5JCk/Lm1hcD8uKChbSywgVl0pID0+IFtLLCBzYWZlKFYpXSkpO1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciB1bndyYXAgPSAoYXJyKSA9PiB7XG5cdHJldHVybiBhcnI/LlskZXh0cmFjdEtleSRdID8/IGFycj8uW1wiQHRhcmdldFwiXSA/PyBhcnI7XG59O1xudmFyIGRlcmVmID0gKHRhcmdldCwgZGlzY291bnRWYWx1ZSA9IGZhbHNlKSA9PiB7XG5cdGNvbnN0IG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRpZiAoaXNQcmltaXRpdmUodGFyZ2V0KSB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCBcImRlcmVmXCIgaW4gdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQ/LmRlcmVmID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9IHRhcmdldD8uZGVyZWY/LigpO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwgJiYgKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHR0YXJnZXQgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRjb25zdCAkdmFsID0gZGlzY291bnRWYWx1ZSAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHRhcmdldD8udmFsdWU7XG5cdFx0aWYgKCR2YWwgIT0gbnVsbCAmJiAodHlwZW9mICR2YWwgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgJHZhbCA9PSBcImZ1bmN0aW9uXCIpKSB0YXJnZXQgPSAkdmFsO1xuXHRcdGlmIChvcmlnaW5hbCAhPSB0YXJnZXQpIHJldHVybiBkZXJlZih0YXJnZXQsIGRpc2NvdW50VmFsdWUpO1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGlzVGhlbmFibGUgPSAodmFsKSA9PiB2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbnZhciB3aXRoUHJvbWlzZSA9ICh0YXJnZXQsIGNiKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY2I/Lih0YXJnZXQpO1xuXHRpZiAoaXNUaGVuYWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0LnRoZW4oY2IpO1xuXHRpZiAodHlwZW9mIHRhcmdldD8ucmVzb2x2ZWQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRhcmdldC5yZXNvbHZlZCgpKS50aGVuKGNiKTtcblx0aWYgKHRhcmdldD8ucHJvbWlzZSAmJiBpc1RoZW5hYmxlKHRhcmdldC5wcm9taXNlKSkgcmV0dXJuIHRhcmdldC5wcm9taXNlLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5bJHByb21pc2VdICYmIGlzVGhlbmFibGUodGFyZ2V0WyRwcm9taXNlXSkpIHJldHVybiB0YXJnZXRbJHByb21pc2VdLnRoZW4oY2IpO1xuXHRyZXR1cm4gY2I/Lih0YXJnZXQpO1xufTtcbnZhciBkaXNwb3NlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZGlzcG9zZVJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChjYWxsc3RhY2spID0+IHtcblx0Y2FsbHN0YWNrPy5mb3JFYWNoPy4oKGNiKSA9PiBjYj8uKCkpO1xufSk7XG5mdW5jdGlvbiBhZGRUb0NhbGxDaGFpbihvYmosIG1ldGhvZEtleSwgY2FsbGJhY2spIHtcblx0aWYgKCFjYWxsYmFjayB8fCB0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBvYmogIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAobWV0aG9kS2V5ID09IFN5bWJvbC5kaXNwb3NlKSB7XG5cdFx0Y29uc3QgY2hhaW5UYXJnZXQgPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iajtcblx0XHRkaXNwb3NlTWFwPy5nZXRPckluc2VydENvbXB1dGVkPy4oY2hhaW5UYXJnZXQsICgpID0+IHtcblx0XHRcdGNvbnN0IENhbGxDaGFpbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0XHRpZiAodHlwZW9mIGNoYWluVGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNoYWluVGFyZ2V0ID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRkaXNwb3NlUmVnaXN0cnkucmVnaXN0ZXIoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGRpc3Bvc2VNYXAuc2V0KGNoYWluVGFyZ2V0LCBDYWxsQ2hhaW4pO1xuXHRcdFx0XHRjaGFpblRhcmdldFtTeW1ib2wuZGlzcG9zZV0gPz89ICgpID0+IENhbGxDaGFpbi5mb3JFYWNoKChjYikgPT4ge1xuXHRcdFx0XHRcdGNiPy4oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQ2FsbENoYWluO1xuXHRcdH0pPy5hZGQ/LihjYWxsYmFjayk7XG5cdH0gZWxzZSBvYmpbbWV0aG9kS2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IG9iaj8uW21ldGhvZEtleV07XG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbCA9PSBcImZ1bmN0aW9uXCIpIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxudmFyIGlzQXJyYXlJbmRleCA9IChwcm9wKSA9PiB7XG5cdGlmICh0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuXHRpZiAocHJvcCA9PT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBudW0gPSBOdW1iZXIocHJvcCk7XG5cdHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IDAgJiYgU3RyaW5nKG51bSkgPT09IHByb3A7XG59O1xuZnVuY3Rpb24gd3JhcFNldEFzQXJyYXkoc291cmNlID0gW10sIG9wdGlvbnMgPSB7fSkge1xuXHRsZXQgYmFja2luZ1NldCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdGNvbnN0IG5vdGlmeUR1cGxpY2F0ZSA9ICh2YWx1ZSwgdmlhLCBpbmRleCkgPT4ge1xuXHRcdG9wdGlvbnMub25EdXBsaWNhdGU/Lih7XG5cdFx0XHR2YWx1ZSxcblx0XHRcdHZpYSxcblx0XHRcdGluZGV4XG5cdFx0fSk7XG5cdH07XG5cdGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIGJhY2tpbmdTZXQgPSBzb3VyY2U7XG5cdGVsc2UgZm9yIChjb25zdCBpdGVtIG9mIHNvdXJjZSkge1xuXHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fVxuXHRjb25zdCBzbmFwc2hvdCA9ICgpID0+IEFycmF5LmZyb20oYmFja2luZ1NldCk7XG5cdGNvbnN0IHJlYnVpbGRGcm9tID0gKGFycikgPT4ge1xuXHRcdGJhY2tpbmdTZXQuY2xlYXIoKTtcblx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSBiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fTtcblx0Y29uc3QgbWV0aG9kcyA9IHtcblx0XHRwdXNoOiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGxldCBzaXplID0gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInB1c2hcIik7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdFx0XHRcdHNpemUrKztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzaXplO1xuXHRcdH0sXG5cdFx0cG9wOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0aWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdFx0YmFja2luZ1NldC5kZWxldGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2hpZnQ6ICgpID0+IHtcblx0XHRcdGNvbnN0IGl0ZXJhdG9yID0gYmFja2luZ1NldC52YWx1ZXMoKS5uZXh0KCk7XG5cdFx0XHRpZiAoaXRlcmF0b3IuZG9uZSkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmF0b3IudmFsdWU7XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHR1bnNoaWZ0OiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Y29uc3QgY3VycmVudCA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCB0b1ByZXBlbmQgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoY3VycmVudC5pbmNsdWRlcyhpdGVtKSB8fCB0b1ByZXBlbmQuaW5jbHVkZXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJ1bnNoaWZ0XCIsIDApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvUHJlcGVuZC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0b1ByZXBlbmQubGVuZ3RoKSByZXR1cm4gY3VycmVudC5sZW5ndGg7XG5cdFx0XHRjb25zdCBuZXh0ID0gWy4uLnRvUHJlcGVuZCwgLi4uY3VycmVudF07XG5cdFx0XHRyZWJ1aWxkRnJvbShuZXh0KTtcblx0XHRcdHJldHVybiBuZXh0Lmxlbmd0aDtcblx0XHR9LFxuXHRcdHNwbGljZTogKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBub3JtYWxpemVkU3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChzdGFydCwgMCksIGFyci5sZW5ndGgpO1xuXHRcdFx0Y29uc3QgYWN0dWFsRGVsZXRlQ291bnQgPSBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gYXJyLmxlbmd0aCAtIG5vcm1hbGl6ZWRTdGFydCA6IE1hdGgubWF4KDAsIE1hdGgubWluKGRlbGV0ZUNvdW50LCBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0KSk7XG5cdFx0XHRjb25zdCByZW1vdmVkID0gYXJyLnNwbGljZShub3JtYWxpemVkU3RhcnQsIGFjdHVhbERlbGV0ZUNvdW50KTtcblx0XHRcdGxldCBpbnNlcnRQb3NpdGlvbiA9IG5vcm1hbGl6ZWRTdGFydDtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwic3BsaWNlXCIsIGluc2VydFBvc2l0aW9uKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcnIuc3BsaWNlKGluc2VydFBvc2l0aW9uKyssIDAsIGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdHJldHVybiByZW1vdmVkO1xuXHRcdH0sXG5cdFx0aW5jbHVkZXM6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5oYXModmFsdWUpLFxuXHRcdGluZGV4T2Y6ICh2YWx1ZSkgPT4gc25hcHNob3QoKS5pbmRleE9mKHZhbHVlKSxcblx0XHRjbGVhcjogKCkgPT4ge1xuXHRcdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlOiAodmFsdWUpID0+IGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKSxcblx0XHR0b0FycmF5OiAoKSA9PiBzbmFwc2hvdCgpLFxuXHRcdHRvU2V0OiAoKSA9PiBuZXcgU2V0KGJhY2tpbmdTZXQpLFxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBiYWNraW5nU2V0W1N5bWJvbC5pdGVyYXRvcl0oKVxuXHR9O1xuXHRyZXR1cm4gbmV3IFByb3h5KG1ldGhvZHMsIHtcblx0XHRnZXQ6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHJldHVybiBzbmFwc2hvdCgpW051bWJlcihwcm9wKV07XG5cdFx0XHRjb25zdCB2YWx1ZSA9IG1ldGhvZHNbcHJvcF07XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHNldDogKF8sIHByb3AsIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyXCIpO1xuXHRcdFx0XHRjb25zdCBuZXh0TGVuZ3RoID0gTWF0aC5mbG9vcih2YWx1ZSk7XG5cdFx0XHRcdGlmIChuZXh0TGVuZ3RoID49IGJhY2tpbmdTZXQuc2l6ZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCkuc2xpY2UoMCwgbmV4dExlbmd0aCk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID4gYXJyLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IG5leHRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAoaW5kZXggPCBhcnIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFZhbHVlID0gYXJyW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoT2JqZWN0LmlzKGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKGFyci5zb21lKChpdGVtLCBpZHgpID0+IGlkeCAhPT0gaW5kZXggJiYgT2JqZWN0LmlzKGl0ZW0sIG5leHRWYWx1ZSkpKSB7XG5cdFx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUobmV4dFZhbHVlLCBcInNldFwiLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YXJyW2luZGV4XSA9IG5leHRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKG5leHRWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnIucHVzaChuZXh0VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3Quc2V0KG1ldGhvZHMsIHByb3AsIHZhbHVlKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRvd25LZXlzOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gW107XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IF8gb2YgYmFja2luZ1NldCkga2V5cy5wdXNoKFN0cmluZyhpKyspKTtcblx0XHRcdGtleXMucHVzaChcImxlbmd0aFwiKTtcblx0XHRcdHJldHVybiBrZXlzO1xuXHRcdH0sXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0dmFsdWU6IGJhY2tpbmdTZXQuc2l6ZVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHZhbHVlOiBhcnJbaW5kZXhdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRoYXM6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRyZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9wIGluIG1ldGhvZHM7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3dyYXAvQXNzaWduT2JqZWN0LnRzXG52YXIgQXNzaWduT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbmFtZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ/LltuYW1lXSA/PyB0YXJnZXQ7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgY3R4KTtcblx0fVxufTtcbnZhciBtYWtlT2JqZWN0QXNzaWduYWJsZSA9IChvYmopID0+IHtcblx0aWYgKG9iaj8uWyRvcmlnaW5hbEtleSRdIHx8ICRvcmlnaW5hbE9iamVjdHMkLmhhcyhvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCBweCA9IG5ldyBQcm94eShvYmosIG5ldyBBc3NpZ25PYmplY3RIYW5kbGVyKCkpO1xuXHQkb3JpZ2luYWxPYmplY3RzJC5zZXQocHgsIG9iaik7XG5cdHJldHVybiBweDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1N1YnNjcmlwdC50c1xudmFyIHdpdGhVbnN1YlN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd2l0aFVuc3ViXCIpO1xuZ2xvYmFsVGhpc1t3aXRoVW5zdWJTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB3aXRoVW5zdWIgPSBnbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF07XG52YXIgY29tcGxldGVXaXRoVW5zdWIgPSAoc3Vic2NyaWJlciwgd2VhaywgaGFuZGxlcikgPT4ge1xuXHRyZXR1cm4gd2l0aFVuc3ViLmdldE9ySW5zZXJ0KHN1YnNjcmliZXIsICgpID0+IHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHdlYWs/LmRlcmVmPy4oKTtcblx0XHRyZWdpc3RyeT8uYWZmZWN0ZWQ/LihoYW5kbGVyKTtcblx0XHRjb25zdCBzYXZDb21wbGV0ZSA9IHN1YnNjcmliZXI/LmNvbXBsZXRlPy5iaW5kPy4oc3Vic2NyaWJlcik7XG5cdFx0Y29uc3QgdW5hZmZlY3RlZCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHIgPSBzYXZDb21wbGV0ZT8uKCk7XG5cdFx0XHRyZWdpc3RyeT8udW5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fTtcblx0XHRzdWJzY3JpYmVyLmNvbXBsZXRlID0gdW5hZmZlY3RlZDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuZGlzcG9zZV06IHVuYWZmZWN0ZWQsXG5cdFx0XHRbU3ltYm9sLmFzeW5jRGlzcG9zZV06IHVuYWZmZWN0ZWRcblx0XHR9O1xuXHR9KTtcbn07XG52YXIgc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHN1YnNjcmlwdFJlZ2lzdHJ5XCIpO1xuZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHN1YnNjcmlwdFJlZ2lzdHJ5ID0gZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAZ2xvYmFsRWZmZWN0TGlzdGVuZXJzXCIpO1xuZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVycyA9IGdsb2JhbFRoaXNbZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sXTtcbnZhciBlZmZlY3RHbG9iYWxseSA9IChjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Z2xvYmFsRWZmZWN0TGlzdGVuZXJzLnNldChjYiwgbm9ybWFsaXplZC5hZmZlY3RUeXBlcyk7XG5cdHJldHVybiAoKSA9PiBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuZGVsZXRlKGNiKTtcbn07XG52YXIgd3JhcHBlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd3JhcHBlZFwiKTtcbmdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdyYXBwZWQgPSBnbG9iYWxUaGlzW3dyYXBwZWRTeW1ib2xdO1xudmFyIHJlZ2lzdGVyID0gKHdoYXQsIGhhbmRsZSkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0O1xuXHRsZXQgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKTtcblx0aWYgKCFyZWdpc3RyeSkge1xuXHRcdHJlZ2lzdHJ5ID0gbmV3IFN1YnNjcmlwdCh1bndyYXApO1xuXHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LnNldCh1bndyYXAsIHJlZ2lzdHJ5KTtcblx0fSBlbHNlIHJlZ2lzdHJ5LmJpbmRTb3VyY2UodW53cmFwKTtcblx0cmV0dXJuIGhhbmRsZTtcbn07XG52YXIgd3JhcFdpdGggPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdHdoYXQgPSBkZXJlZih3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0KTtcblx0aWYgKHR5cGVvZiB3aGF0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2Ygd2hhdCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB3aGF0ID09IFwiZnVuY3Rpb25cIikgfHwgd2hhdCA9PSBudWxsKSByZXR1cm4gd2hhdDtcblx0cmV0dXJuIHdyYXBwZWQuZ2V0T3JJbnNlcnRDb21wdXRlZCh3aGF0LCAoKSA9PiBuZXcgUHJveHkod2hhdCwgcmVnaXN0ZXIod2hhdCwgaGFuZGxlKSkpO1xufTtcbnZhciBmb3JBbGwgPSBTeW1ib2wuZm9yKFwiQGFsbFByb3BzXCIpO1xudmFyIHdpbGRjYXJkVHJpZ2dlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCIsIFwiYWxsXCJdKTtcbnZhciB0cmlnZ2VyQWxpYXNlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKFtcblx0W1wic2V0XCIsIFtcInNldHRlclwiLCBcIkBzZXRcIl1dLFxuXHRbXCJhZGRcIiwgW1wiQGFkZFwiXV0sXG5cdFtcImRlbGV0ZVwiLCBbXCJAZGVsZXRlXCJdXSxcblx0W1wiaW52YWxpZGF0ZVwiLCBbXCJAaW52YWxpZGF0ZVwiXV0sXG5cdFtcIm1hbnVhbFwiLCBbXCJAbWFudWFsXCJdXSxcblx0W1wiY3VzdG9tXCIsIFtcIkBjdXN0b21cIl1dLFxuXHRbXCJyZXNvbHZlZFwiLCBbXCJAcmVzb2x2ZWRcIl1dLFxuXHRbXCJzZXRBbGxcIiwgW1wiQHNldEFsbFwiXV0sXG5cdFtcImFkZEFsbFwiLCBbXCJAYWRkQWxsXCJdXSxcblx0W1wiZGVsZXRlQWxsXCIsIFtcIkBkZWxldGVBbGxcIiwgXCJAY2xlYXJcIl1dXG5dKTtcbnZhciB0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHRyaWdnZXJDYW5vbmljYWxOYW1lc1wiKTtcbmdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXSA/Pz0gbmV3IE1hcChBcnJheS5mcm9tKHRyaWdnZXJBbGlhc2VzLmVudHJpZXMoKSkuZmxhdE1hcCgoW2Nhbm9uaWNhbCwgYWxpYXNlc10pID0+IGFsaWFzZXMubWFwKChhbGlhcykgPT4gW2FsaWFzLCBjYW5vbmljYWxdKSkpO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lcyA9IGdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXTtcbnZhciBub3JtYWxpemVUcmlnZ2VyTmFtZSA9ICh0cmlnZ2VyID0gXCJzZXRcIikgPT4ge1xuXHRpZiAodHJpZ2dlciA9PSBudWxsKSByZXR1cm4gdHJpZ2dlcjtcblx0Y29uc3QgbmFtZSA9IFN0cmluZyh0cmlnZ2VyIHx8IFwic2V0XCIpO1xuXHRyZXR1cm4gdHJpZ2dlckNhbm9uaWNhbE5hbWVzLmdldChuYW1lKSA/PyBuYW1lO1xufTtcbnZhciB0cmlnZ2VyTmFtZXNPZiA9ICh0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5hbWUgPSB0cmlnZ2VyID09IG51bGwgPyBcImFsbFwiIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IFwiYWxsXCIpO1xuXHRyZXR1cm4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV07XG59O1xudmFyIGV4cGFuZFRyaWdnZXJGaWx0ZXIgPSAodHlwZXMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBuZXcgU2V0KFsuLi5ub3JtYWxpemVUcmlnZ2VyRmlsdGVyKHR5cGVzKV0uZmxhdE1hcCgobmFtZSkgPT4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV0pKTtcbn07XG52YXIgbm9ybWFsaXplVHJpZ2dlckZpbHRlciA9ICh0cmlnZ2VycyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgbGlzdCA9IHR5cGVvZiB0cmlnZ2VycyA9PSBcInN0cmluZ1wiID8gW3RyaWdnZXJzXSA6IEFycmF5LmZyb20odHJpZ2dlcnMgPz8gW1wiKlwiXSk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBuZXcgU2V0KGxpc3QubWFwKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgbmFtZSA9IFN0cmluZyhpdGVtIHx8IFwiKlwiKTtcblx0XHRyZXR1cm4gd2lsZGNhcmRUcmlnZ2Vycy5oYXMobmFtZSkgPyBuYW1lIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG5hbWUpID8/IG5hbWUpO1xuXHR9KSk7XG5cdHJldHVybiBub3JtYWxpemVkLnNpemUgPyBub3JtYWxpemVkIDogLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1wiKlwiXSk7XG59O1xudmFyIHRyaWdnZXJGaWx0ZXJBbGxvd3MgPSAodHJpZ2dlcnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3QgZmlsdGVyID0gdHJpZ2dlcnMgaW5zdGFuY2VvZiBTZXQgPyB0cmlnZ2VycyA6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHJpZ2dlcnMpO1xuXHRyZXR1cm4gWy4uLndpbGRjYXJkVHJpZ2dlcnNdLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpIHx8IHRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpO1xufTtcbnZhciBpc09wdGlvbnNPYmplY3QgPSAob3B0aW9ucykgPT4ge1xuXHRyZXR1cm4gISFvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucykgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlcnNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gb3B0aW9ucyk7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ICE9PSBmYWxzZVxuXHR9O1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyk7XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiB0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcImluaXRpYWxcIilcblx0fTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0T3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ID09PSB0cnVlXG5cdH07XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9O1xufTtcbnZhciBTdWJzY3JpcHRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQFN1YnNjcmlwdFwiKTtcbmdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXSA/Pz0gY2xhc3MgU3Vic2NyaXB0IHtcblx0Y29tcGF0aWJsZTtcblx0I3NvdXJjZTtcblx0I2xpc3RlbmVycztcblx0I2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdCNuYXRpdmU7XG5cdCNpdGVyYXRvcjtcblx0I2luRGlzcGF0Y2ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjZGlzYWJsZWRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCN0cmlnZ2VyQ29udHJvbDtcblx0I3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQjcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy4jbGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHR0aGlzLiNmbGFncyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRcdHRoaXMuI3RyaWdnZXJDb250cm9sID0ge1xuXHRcdFx0ZW5hYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgdHJ1ZSwgY2IpIDogdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIHRydWUpLFxuXHRcdFx0ZGlzYWJsZTogKHR5cGVzID0gW1wiKlwiXSwgY2IpID0+IGNiID8gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIGZhbHNlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgZmFsc2UpLFxuXHRcdFx0c2V0OiAodHlwZXMsIGVuYWJsZWQpID0+IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBlbmFibGVkKSxcblx0XHRcdHdpdGg6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYiksXG5cdFx0XHR3aXRob3V0OiAodHlwZXMsIGNiKSA9PiB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSxcblx0XHRcdGlzRW5hYmxlZDogKHRyaWdnZXIpID0+IHRoaXMuaXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKVxuXHRcdH07XG5cdFx0dGhpcy4jaXRlcmF0b3IgPSB7IG5leHQ6IChhcmdzKSA9PiB7XG5cdFx0XHRpZiAoYXJncykgQXJyYXkuaXNBcnJheShhcmdzKSA/IHRoaXMuI2Rpc3BhdGNoKC4uLmFyZ3MpIDogdGhpcy4jZGlzcGF0Y2goYXJncyk7XG5cdFx0fSB9O1xuXHRcdGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZih0aGlzKTtcblx0XHRjb25zdCBjb250cm9sbGVyID0gZnVuY3Rpb24oc3Vic2NyaWJlcikge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IHN1YnNjcmliZXI/Lm5leHQ/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRcdHJldHVybiBjb21wbGV0ZVdpdGhVbnN1YihzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKTtcblx0XHR9O1xuXHRcdHRoaXMuI25hdGl2ZSA9IHR5cGVvZiBPYnNlcnZhYmxlICE9IFwidW5kZWZpbmVkXCIgPyBuZXcgT2JzZXJ2YWJsZShjb250cm9sbGVyKSA6IG51bGw7XG5cdFx0dGhpcy5jb21wYXRpYmxlID0gKCkgPT4gdGhpcy4jbmF0aXZlO1xuXHR9XG5cdGJpbmRTb3VyY2Uoc291cmNlKSB7XG5cdFx0dGhpcy4jc291cmNlID8/PSBzb3VyY2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0JHNhZmVFeGVjKGNiLCAuLi5hcmdzKSB7XG5cdFx0aWYgKCFjYiB8fCB0aGlzLiNmbGFncy5oYXMoY2IpKSByZXR1cm47XG5cdFx0dGhpcy4jZmxhZ3MuYWRkKGNiKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzID0gY2IoLi4uYXJncyk7XG5cdFx0XHRpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHJlcy5jYXRjaChjb25zb2xlLndhcm4pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy4jZmxhZ3MuZGVsZXRlKGNiKTtcblx0XHR9XG5cdH1cblx0I2Rpc3BhdGNoKG5hbWUsIHZhbHVlID0gbnVsbCwgb2xkVmFsdWUsIHRyaWdnZXIgPSBcImFsbFwiLCAuLi5ldGMpIHtcblx0XHR0cmlnZ2VyID0gbm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gdHJpZ2dlcjtcblx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0aWYgKGxpc3RlbmVycz8uc2l6ZSkge1xuXHRcdFx0Zm9yIChjb25zdCBbY2IsIHJlY29yZF0gb2YgbGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKChyZWNvcmQucHJvcCA9PT0gbmFtZSB8fCByZWNvcmQucHJvcCA9PT0gZm9yQWxsIHx8IHJlY29yZC5wcm9wID09PSBudWxsKSAmJiB0cmlnZ2VyRmlsdGVyQWxsb3dzKHJlY29yZC50cmlnZ2VycywgdHJpZ2dlcikpIHRoaXMuJHNhZmVFeGVjKGNiLCB2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG5cdFx0fVxuXHRcdGlmIChnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2l6ZSkge1xuXHRcdFx0Y29uc3QgZXZlbnQgPSB7XG5cdFx0XHRcdHNvdXJjZTogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR0YXJnZXQ6IHRoaXMuI3NvdXJjZSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdHByb3A6IG5hbWUsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyLFxuXHRcdFx0XHRhcmdzOiBldGNcblx0XHRcdH07XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgdHJpZ2dlcnNdIG9mIGdsb2JhbEVmZmVjdExpc3RlbmVycy5lbnRyaWVzKCkpIGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKHRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIGV2ZW50KTtcblx0XHR9XG5cdH1cblx0d3JhcChudykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG53KSkgcmV0dXJuIHdyYXBXaXRoKG53LCB0aGlzKTtcblx0XHRyZXR1cm4gbnc7XG5cdH1cblx0Z2V0IHRyaWdnZXJDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLiN0cmlnZ2VyQ29udHJvbDtcblx0fVxuXHRpc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpIHtcblx0XHRyZXR1cm4gIXRyaWdnZXJGaWx0ZXJBbGxvd3ModGhpcy4jZGlzYWJsZWRUcmlnZ2VycywgXCJhbGxcIikgJiYgIXRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpKTtcblx0fVxuXHRzZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMgPSBbXCIqXCJdLCBlbmFibGVkID0gdHJ1ZSkge1xuXHRcdGNvbnN0IG5hbWVzID0gZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyk7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSBpZiAoZW5hYmxlZCkgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5kZWxldGUobmFtZSk7XG5cdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0fVxuXHR3aXRoVHJpZ2dlcnModHlwZXMsIGVuYWJsZWQsIGNiKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBbLi4uZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyldO1xuXHRcdGNvbnN0IHByZXZpb3VzID0gbmV3IE1hcChuYW1lcy5tYXAoKG5hbWUpID0+IFtuYW1lLCB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmhhcyhuYW1lKV0pKTtcblx0XHRjb25zdCByZXN0b3JlID0gKCkgPT4ge1xuXHRcdFx0cHJldmlvdXMuZm9yRWFjaCgod2FzRGlzYWJsZWQsIG5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHdhc0Rpc2FibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0XHRcdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0dGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQobmFtZXMsIGVuYWJsZWQpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjYj8uKCk7XG5cdFx0XHRpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQuZmluYWxseSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiByZXN1bHQuZmluYWxseShyZXN0b3JlKTtcblx0XHRcdHJlc3RvcmUoKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YWZmZWN0ZWQoY2IsIHByb3AsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdFx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy4jbGlzdGVuZXJzLnNldChjYiwge1xuXHRcdFx0cHJvcDogcHJvcCB8fCBmb3JBbGwsXG5cdFx0XHR0cmlnZ2Vyczogbm9ybWFsaXplZC5hZmZlY3RUeXBlc1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnVuYWZmZWN0ZWQoY2IsIHByb3AgfHwgZm9yQWxsKTtcblx0fVxuXHR1bmFmZmVjdGVkKGNiLCBwcm9wKSB7XG5cdFx0aWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy4jbGlzdGVuZXJzO1xuXHRcdFx0Y29uc3QgcmVjb3JkID0gbGlzdGVuZXJzPy5nZXQoY2IpO1xuXHRcdFx0aWYgKHJlY29yZCAmJiAocmVjb3JkLnByb3AgPT0gcHJvcCB8fCBwcm9wID09IG51bGwgfHwgcHJvcCA9PSBmb3JBbGwpKSB7XG5cdFx0XHRcdGxpc3RlbmVycy5kZWxldGUoY2IpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gdGhpcy5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwsIHJlY29yZC50cmlnZ2Vycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiNsaXN0ZW5lcnMuY2xlYXIoKTtcblx0fVxuXHR0cmlnZ2VyKG5hbWUsIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwic2V0XCIsIC4uLmV0Yykge1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgcmV0dXJuO1xuXHRcdGlmICh0cmlnZ2VyID09PSB2b2lkIDApIHRyaWdnZXIgPSBcInNldFwiO1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGlmICghdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpKSByZXR1cm47XG5cdFx0Y29uc3Qgb3BLZXkgPSBgJHt0cmlnZ2VyID8/IFwiYWxsXCJ9YDtcblx0XHRsZXQgYnlPcCA9IHRoaXMuI3BlbmRpbmdCeVByb3AuZ2V0KG5hbWUpO1xuXHRcdGlmICghYnlPcCkge1xuXHRcdFx0YnlPcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wLnNldChuYW1lLCBieU9wKTtcblx0XHR9XG5cdFx0YnlPcC5zZXQob3BLZXksIFtcblx0XHRcdG5hbWUsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdGV0Y1xuXHRcdF0pO1xuXHRcdGlmICh0aGlzLiNmbHVzaFNjaGVkdWxlZCkgcmV0dXJuO1xuXHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcblx0XHRzY2hlZHVsZXI/LnlpZWxkPy4oKT8udGhlbj8uKCgpID0+IHtcblx0XHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5cdFx0XHRjb25zdCBiYXRjaCA9IHRoaXMuI3BlbmRpbmdCeVByb3A7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGZvciAoY29uc3QgW3Byb3AsIG9wTWFwXSBvZiBiYXRjaCkge1xuXHRcdFx0XHRpZiAocHJvcCAhPSBudWxsICYmIHRoaXMuI2luRGlzcGF0Y2guaGFzKHByb3ApKSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCkgdGhpcy4jaW5EaXNwYXRjaC5hZGQocHJvcCk7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBbLCBhcmdzXSBvZiBvcE1hcCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgW25tLCB2LCBvdiwgdGcsIHJlc3RdID0gYXJncztcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuI2Rpc3BhdGNoKG5tLCB2LCBvdiwgdGcsIC4uLnJlc3QgPz8gW10pO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdGlmIChwcm9wICE9IG51bGwpIHRoaXMuI2luRGlzcGF0Y2guZGVsZXRlKHByb3ApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0Z2V0IGl0ZXJhdG9yKCkge1xuXHRcdHJldHVybiB0aGlzLiNpdGVyYXRvcjtcblx0fVxufTtcbnZhciBTdWJzY3JpcHQgPSBnbG9iYWxUaGlzW1N1YnNjcmlwdFN5bWJvbF07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1Jlc29sdmVkLnRzXG52YXIgcmF3T2YgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHVud3JhcHBlZCA9IGRlcmVmKHRhcmdldCk7XG5cdHJldHVybiB1bndyYXBwZWQ/LlskZXh0cmFjdEtleSRdID8/IHVud3JhcHBlZDtcbn07XG5mdW5jdGlvbiByZXNvbHZlZCh0YXJnZXQsIG1vZGUgPSBcImFsbFwiKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCk7XG5cdGlmIChpc1Byb21pc2UocmF3KSkgcmV0dXJuIHJlc29sdmVkJDEocmF3LCBtb2RlKTtcblx0aWYgKGlzUHJvbWlzZShyYXc/LlskcHJvbWlzZV0pKSByZXR1cm4gcmVzb2x2ZWQkMShyYXdbJHByb21pc2VdLCBtb2RlKTtcblx0cmV0dXJuIHJlc29sdmVkJDEocmF3ID8/IHRhcmdldCwgbW9kZSk7XG59XG5mdW5jdGlvbiBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQsIGVtaXQgPSBmYWxzZSkge1xuXHRjb25zdCBydW4gPSAoKG1vZGUgPSBcImFsbFwiKSA9PiB7XG5cdFx0Y29uc3QgcGVuZGluZyA9IHJlc29sdmVkKHRhcmdldCwgbW9kZSk7XG5cdFx0aWYgKCFlbWl0KSByZXR1cm4gcGVuZGluZztcblx0XHRyZXR1cm4gcGVuZGluZy50aGVuKCh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KTtcblx0XHRcdGNvbnN0IGtleSA9IHJhdz8ucmVhbFByb3AgPz8gKHJhdyAmJiBcInZhbHVlXCIgaW4gcmF3ID8gXCJ2YWx1ZVwiIDogbnVsbCk7XG5cdFx0XHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIHZvaWQgMCwgXCJyZXNvbHZlZFwiKTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9KTtcblx0fSk7XG5cdHJ1bi5hbGwgPSAoKSA9PiBydW4oXCJhbGxcIik7XG5cdHJ1bi5hbGxTZXR0bGVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLmFsbEtleWVkID0gKCkgPT4gcnVuKFwiYWxsXCIpO1xuXHRydW4uYWxsU2V0dGxlZEtleWVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLnRyeSA9IChjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpID0+IFByb21pc2UudHJ5KGNhbGxiYWNrT3JWYWx1ZSwgLi4uYXJncykudGhlbigodmFsdWUpID0+IHJlc29sdmVkKHZhbHVlID8/IHRhcmdldCwgXCJhbGxcIikpO1xuXHRyZXR1cm4gcnVuO1xufVxuZnVuY3Rpb24gZW1pdFJlc29sdmVkKHRhcmdldCwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpIHtcblx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KSA/PyB0YXJnZXQ7XG5cdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChyYXcpPy50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIFwicmVzb2x2ZWRcIik7XG59XG5mdW5jdGlvbiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMobGl2ZSwgcmF3KSB7XG5cdGlmIChsaXZlID09IG51bGwgfHwgcmF3ID09IG51bGwpIHJldHVybiBsaXZlO1xuXHRpZiAoQXJyYXkuaXNBcnJheShyYXcpKSB7XG5cdFx0cmF3LmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuXHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmVbaW5kZXhdID0gdmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGxpdmU7XG5cdH1cblx0aWYgKHJhdyBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIHJhdy5lbnRyaWVzKCkpIGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlLnNldChrZXksIHZhbHVlKTtcblx0XHRyZXR1cm4gbGl2ZTtcblx0fVxuXHRpZiAocmF3IGluc3RhbmNlb2YgU2V0KSByZXR1cm4gbGl2ZTtcblx0Zm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdC5vd25LZXlzKHJhdykpIHtcblx0XHRpZiAoa2V5ID09ICRleHRyYWN0S2V5JCB8fCBrZXkgPT0gJHByb21pc2UgfHwga2V5ID09ICRyZXNvbHZlZCkgY29udGludWU7XG5cdFx0aWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHJhdywga2V5KT8uZW51bWVyYWJsZSkgY29udGludWU7XG5cdFx0Y29uc3QgdmFsdWUgPSByYXdba2V5XTtcblx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZVtrZXldID0gdmFsdWU7XG5cdH1cblx0cmV0dXJuIGxpdmU7XG59XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1NwZWNpZmljLnRzXG52YXIgX19zYWZlR2V0R3VhcmRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQF9fc2FmZUdldEd1YXJkXCIpO1xudmFyIHJlYWN0aXZlUHJvcGVydGllc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAcmVhY3RpdmVQcm9wZXJ0aWVzXCIpO1xudmFyIHJlYWN0aXZlUHJvcGVydGllcyA9IGdsb2JhbFRoaXNbcmVhY3RpdmVQcm9wZXJ0aWVzU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgcmVhY3RpdmVNZXRob2RzU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0ByZWFjdGl2ZU1ldGhvZHNcIik7XG52YXIgcmVhY3RpdmVNZXRob2RzID0gZ2xvYmFsVGhpc1tyZWFjdGl2ZU1ldGhvZHNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIG1hcmtSZWFjdGl2ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XG5cdGxldCBrZXlzID0gcmVhY3RpdmVQcm9wZXJ0aWVzLmdldCh0YXJnZXQpO1xuXHRpZiAoIWtleXMpIHJlYWN0aXZlUHJvcGVydGllcy5zZXQodGFyZ2V0LCBrZXlzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdGtleXMuYWRkKGtleSk7XG59XG5mdW5jdGlvbiBpc1JlYWN0aXZlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcblx0Zm9yIChsZXQgY3VycmVudCA9IHRhcmdldDsgY3VycmVudDsgY3VycmVudCA9IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YoY3VycmVudCkpIGlmIChyZWFjdGl2ZVByb3BlcnRpZXMuZ2V0KGN1cnJlbnQpPy5oYXMoa2V5KSkgcmV0dXJuIHRydWU7XG5cdHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIG5vdGlmeVJlYWN0aXZlUHJvcGVydHkocmVjZWl2ZXIsIG93bmVyLCBrZXksIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuXHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChyZWNlaXZlcikgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KG93bmVyKTtcblx0Y29uc3QgdHJpZ2dlck5hbWUgPSB0cmlnZ2VyS2V5T2YocmVjZWl2ZXIsIGtleSk7XG5cdGlmICgoc2FmZUdldChyZWNlaXZlciwgJGlzTm90RXF1YWwpID8/IGlzTm90RXF1YWwpKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHJlZ2lzdHJ5Py50cmlnZ2VyPy4odHJpZ2dlck5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG5cdGlmIChpc1Byb21pc2UobmV3VmFsdWUpKSBlbWl0UmVzb2x2ZWQocmVjZWl2ZXIsIHRyaWdnZXJOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xufVxuZnVuY3Rpb24gZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgdmFsdWUpIHtcblx0Y29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0aWYgKCFkZXNjcmlwdG9yIHx8ICFkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSkgcmV0dXJuIGZhbHNlO1xuXHRpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci53cml0YWJsZSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcblx0aWYgKGlzUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSkpIHJldHVybiB0cnVlO1xuXHRpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIHtcblx0XHRjb25zdCBpbml0aWFsVmFsdWUgPSBkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdGNvbnN0IHZhbHVlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRcdHZhbHVlcy5zZXQodGFyZ2V0LCBpbml0aWFsVmFsdWUpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcblx0XHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGdldCgpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlcy5oYXModGhpcykgPyB2YWx1ZXMuZ2V0KHRoaXMpIDogaW5pdGlhbFZhbHVlO1xuXHRcdFx0fSxcblx0XHRcdHNldChuZXh0VmFsdWUpIHtcblx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB2YWx1ZXMuaGFzKHRoaXMpID8gdmFsdWVzLmdldCh0aGlzKSA6IGluaXRpYWxWYWx1ZTtcblx0XHRcdFx0dmFsdWVzLnNldCh0aGlzLCBuZXh0VmFsdWUpO1xuXHRcdFx0XHRub3RpZnlSZWFjdGl2ZVByb3BlcnR5KHRoaXMsIHRhcmdldCwga2V5LCBvbGRWYWx1ZSwgbmV4dFZhbHVlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRpZiAocmVzdWx0KSBtYXJrUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXHRpZiAoIWRlc2NyaXB0b3Iuc2V0KSByZXR1cm4gZmFsc2U7XG5cdGNvbnN0IGxhc3RBc3NpZ25lZCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCBwcm9wZXJ0eURlc2MgPSB7XG5cdFx0Li4uZGVzY3JpcHRvcixcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0ZW51bWVyYWJsZTogZGVzY3JpcHRvci5lbnVtZXJhYmxlLFxuXHRcdHNldDogZnVuY3Rpb24obmV4dFZhbHVlKSB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGRlc2NyaXB0b3IuZ2V0ID8gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKSA6IGxhc3RBc3NpZ25lZC5nZXQodGhpcyk7XG5cdFx0XHRkZXNjcmlwdG9yLnNldC5jYWxsKHRoaXMsIG5leHRWYWx1ZSk7XG5cdFx0XHRjb25zdCBhY3R1YWxWYWx1ZSA9IGRlc2NyaXB0b3IuZ2V0ID8gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKSA6IG5leHRWYWx1ZTtcblx0XHRcdGlmICghZGVzY3JpcHRvci5nZXQpIGxhc3RBc3NpZ25lZC5zZXQodGhpcywgYWN0dWFsVmFsdWUpO1xuXHRcdFx0bm90aWZ5UmVhY3RpdmVQcm9wZXJ0eSh0aGlzLCB0YXJnZXQsIGtleSwgb2xkVmFsdWUsIGFjdHVhbFZhbHVlKTtcblx0XHR9XG5cdH07XG5cdGlmIChkZXNjcmlwdG9yLmdldCkgcHJvcGVydHlEZXNjLmdldCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpO1xuXHR9O1xuXHRpZiAodmFsdWUgIT09IHZvaWQgMCAmJiB0eXBlb2YgdmFsdWUgIT0gXCJ1bmRlZmluZWRcIikgbGFzdEFzc2lnbmVkLnNldCh0YXJnZXQsIHZhbHVlKTtcblx0Y29uc3QgcmVzdWx0ID0gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgcHJvcGVydHlEZXNjKTtcblx0aWYgKHJlc3VsdCkgbWFya1JlYWN0aXZlUHJvcGVydHkodGFyZ2V0LCBrZXkpO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxudmFyIF9fc3lzdGVtU2tpcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcblx0U3ltYm9sLnRvU3RyaW5nVGFnLFxuXHRTeW1ib2wuaXRlcmF0b3IsXG5cdFN5bWJvbC5hc3luY0l0ZXJhdG9yLFxuXHRTeW1ib2wudG9QcmltaXRpdmUsXG5cdFwidG9TdHJpbmdcIixcblx0XCJ2YWx1ZU9mXCIsXG5cdFwiaW5zcGVjdFwiLFxuXHRcImNvbnN0cnVjdG9yXCIsXG5cdFwiX19wcm90b19fXCIsXG5cdFwicHJvdG90eXBlXCIsXG5cdFwidGhlblwiLFxuXHRcImNhdGNoXCIsXG5cdFwiZmluYWxseVwiLFxuXHRcIm5leHRcIlxuXSk7XG52YXIgc3lzdGVtU2tpcEdldCA9ICh0YXJnZXQsIG5hbWUpID0+IHtcblx0aWYgKCFfX3N5c3RlbVNraXAuaGFzKG5hbWUpKSByZXR1cm4gbnVsbDtcblx0Y29uc3QgZ290ID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRyZXR1cm4gdHlwZW9mIGdvdCA9PT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIGdvdCkgOiBnb3Q7XG59O1xudmFyIF9fc2FmZUdldEd1YXJkID0gZ2xvYmFsVGhpc1tfX3NhZmVHZXRHdWFyZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gaXNHZXR0ZXIob2JqLCBwcm9wTmFtZSkge1xuXHRsZXQgZ290ID0gdHJ1ZTtcblx0dHJ5IHtcblx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/LihvYmosIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/Lihwcm9wTmFtZSk7XG5cdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/LihvYmopPy5oYXM/Lihwcm9wTmFtZSkpIGdvdCA9IHRydWU7XG5cdFx0Z290ID0gdHlwZW9mIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcE5hbWUpPy5nZXQgPT0gXCJmdW5jdGlvblwiO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Z290ID0gdHJ1ZTtcblx0fSBmaW5hbGx5IHtcblx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4ob2JqKT8uZGVsZXRlPy4ocHJvcE5hbWUpO1xuXHR9XG5cdHJldHVybiBnb3Q7XG59XG52YXIgZmFsbFRocm91Z2ggPSAob2JqLCBrZXkpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKG9iaikpIHJldHVybiBvYmo7XG5cdGNvbnN0IHZhbHVlID0gc2FmZUdldChvYmosIGtleSk7XG5cdGlmICh2YWx1ZSA9PSBudWxsICYmIGtleSAhPSBcInZhbHVlXCIpIHtcblx0XHRjb25zdCB0bXAgPSBzYWZlR2V0KG9iaiwgXCJ2YWx1ZVwiKTtcblx0XHRpZiAodG1wICE9IG51bGwgJiYgIWlzUHJpbWl0aXZlKHRtcCkpIHJldHVybiBmYWxsVGhyb3VnaCh0bXAsIGtleSk7XG5cdFx0ZWxzZSByZXR1cm4gdmFsdWU7XG5cdH0gZWxzZSBpZiAoa2V5ID09IFwidmFsdWVcIiAmJiB2YWx1ZSAhPSBudWxsICYmICFpc1ByaW1pdGl2ZSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbGxUaHJvdWdoKHZhbHVlLCBrZXkpID8/IHZhbHVlID8/IG9iajtcblx0cmV0dXJuIHZhbHVlID8/IG9iajtcbn07XG52YXIgc2FmZVNldCA9IChvYmosIGtleSwgdmFsdWUpID0+IHtcblx0aWYgKG9iaiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdGxldCBhY3RpdmUgPSBfX3NhZmVTZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/LihvYmosIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRpZiAoYWN0aXZlPy5oYXM/LihrZXkpKSByZXR1cm4gZmFsc2U7XG5cdGFjdGl2ZT8uYWRkPy4oa2V5KTtcblx0cmV0dXJuIFJlZmxlY3Quc2V0KG9iaiwga2V5LCB2YWx1ZSk7XG59O1xudmFyIHNhZmVHZXQgPSAob2JqLCBrZXksIHJlYykgPT4ge1xuXHRsZXQgcmVzdWx0ID0gdm9pZCAwO1xuXHRpZiAob2JqID09IG51bGwpIHJldHVybiBvYmo7XG5cdGxldCBhY3RpdmUgPSBfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/LihvYmosIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRpZiAoYWN0aXZlPy5oYXM/LihrZXkpKSByZXR1cm4gbnVsbDtcblx0aWYgKCFpc0dldHRlcihvYmosIGtleSkpIHJlc3VsdCA/Pz0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcblx0ZWxzZSB7XG5cdFx0YWN0aXZlPy5hZGQ/LihrZXkpO1xuXHRcdHRyeSB7XG5cdFx0XHRyZXN1bHQgPSBSZWZsZWN0LmdldChvYmosIGtleSwgcmVjICE9IG51bGwgPyByZWMgOiBvYmopO1xuXHRcdH0gY2F0Y2ggKF9lKSB7XG5cdFx0XHRyZXN1bHQgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdGFjdGl2ZS5kZWxldGUoa2V5KTtcblx0XHRcdGlmIChhY3RpdmU/LnNpemUgPT09IDApIF9fc2FmZUdldEd1YXJkPy5kZWxldGU/LihvYmopO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHlwZW9mIHJlc3VsdCA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KG9iaiwgcmVzdWx0KSA6IHJlc3VsdDtcbn07XG52YXIgaGFzT3duID0gKG9iaiwga2V5KSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xudmFyIGlzVHJpZ2dlckVtaXRPcHRpb25zID0gKHZhbHVlLCBhbGxvd1ZhbHVlT25seSA9IGZhbHNlKSA9PiB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAoaGFzT3duKHZhbHVlLCBcImtleVwiKSB8fCBoYXNPd24odmFsdWUsIFwibmFtZVwiKSB8fCBoYXNPd24odmFsdWUsIFwib2xkVmFsdWVcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9sZFwiKSB8fCBoYXNPd24odmFsdWUsIFwib3BcIikgfHwgaGFzT3duKHZhbHVlLCBcInRyaWdnZXJcIikgfHwgYWxsb3dWYWx1ZU9ubHkgJiYgaGFzT3duKHZhbHVlLCBcInZhbHVlXCIpKTtcbn07XG52YXIgdHJpZ2dlck9wdGlvblZhbHVlID0gKG9wdGlvbnMsIGtleSwgZmFsbGJhY2spID0+IHtcblx0aWYgKGhhc093bihvcHRpb25zLCBrZXkpKSByZXR1cm4gb3B0aW9uc1trZXldO1xuXHRpZiAoa2V5ID09IFwib2xkVmFsdWVcIiAmJiBoYXNPd24ob3B0aW9ucywgXCJvbGRcIikpIHJldHVybiBvcHRpb25zLm9sZDtcblx0cmV0dXJuIGZhbGxiYWNrKCk7XG59O1xudmFyIHRyaWdnZXJPcHRpb25UcmlnZ2VyID0gKG9wdGlvbnMsIGZhbGxiYWNrID0gXCJtYW51YWxcIikgPT4gbm9ybWFsaXplVHJpZ2dlck5hbWUob3B0aW9ucy50cmlnZ2VyID8/IG9wdGlvbnMub3AgPz8gZmFsbGJhY2spO1xudmFyIGlzUnVudGltZUtleSA9IChrZXkpID0+IHR5cGVvZiBrZXkgPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2Yga2V5ID09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGtleSA9PSBcInN5bWJvbFwiO1xudmFyIHJlYWxQcm9wT2YkMSA9ICh0YXJnZXQpID0+IHtcblx0Y29uc3QgcHJvcCA9IHNhZmVHZXQodGFyZ2V0LCAkcmVhbFByb3ApID8/IHNhZmVHZXQodGFyZ2V0LCBcInJlYWxQcm9wXCIpO1xuXHRyZXR1cm4gaXNSdW50aW1lS2V5KHByb3ApID8gcHJvcCA6IG51bGw7XG59O1xudmFyIHRyaWdnZXJLZXlPZiA9ICh0YXJnZXQsIGtleSkgPT4ga2V5ID09IFwidmFsdWVcIiA/IHJlYWxQcm9wT2YkMSh0YXJnZXQpID8/IGtleSA6IGtleTtcbnZhciB0cmlnZ2VyVmFsdWVPZiA9ICh0YXJnZXQsIGtleSkgPT4ge1xuXHRjb25zdCByZWFsUHJvcCA9IHJlYWxQcm9wT2YkMSh0YXJnZXQpO1xuXHRpZiAocmVhbFByb3AgIT0gbnVsbCAmJiBrZXkgPT0gcmVhbFByb3ApIHJldHVybiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA/PyBzYWZlR2V0KHRhcmdldCwga2V5KTtcblx0cmV0dXJuIGtleSA9PSBudWxsID8gdm9pZCAwIDogc2FmZUdldCh0YXJnZXQsIGtleSk7XG59O1xudmFyIGNyZWF0ZVRyaWdnZXJBUEkgPSAocmVnaXN0cnksIGVtaXQsIHRhcmdldCkgPT4ge1xuXHRjb25zdCBhcGkgPSAoa2V5LCBvcE9yT3B0aW9ucywgdHJpZ2dlcikgPT4ge1xuXHRcdGlmICghaXNUcmlnZ2VyRW1pdE9wdGlvbnMob3BPck9wdGlvbnMpKSB0cmlnZ2VyID8/PSBvcE9yT3B0aW9ucztcblx0XHRyZXR1cm4gZW1pdChpc1RyaWdnZXJFbWl0T3B0aW9ucyhrZXkpID8ga2V5IDogaXNUcmlnZ2VyRW1pdE9wdGlvbnMob3BPck9wdGlvbnMsIHRydWUpID8ge1xuXHRcdFx0a2V5LFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdC4uLm9wT3JPcHRpb25zXG5cdFx0fSA6IHtcblx0XHRcdGtleSxcblx0XHRcdHRyaWdnZXI6IHRyaWdnZXIgPz8gb3BPck9wdGlvbnNcblx0XHR9KTtcblx0fTtcblx0Y29uc3QgY29udHJvbCA9IHJlZ2lzdHJ5Py50cmlnZ2VyQ29udHJvbDtcblx0aWYgKGNvbnRyb2wpIE9iamVjdC5hc3NpZ24oYXBpLCBjb250cm9sKTtcblx0YXBpLmN1c3RvbSA9ICh0cmlnZ2VyLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSkgPT4gYXBpKHtcblx0XHRrZXksXG5cdFx0dHJpZ2dlcixcblx0XHR2YWx1ZSxcblx0XHRvbGRWYWx1ZVxuXHR9KTtcblx0aWYgKHRhcmdldCAhPSBudWxsKSBhcGkucmVzb2x2ZWQgPSBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQsIHRydWUpO1xuXHRyZXR1cm4gYXBpO1xufTtcbnZhciBzeXN0ZW1HZXQgPSAodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSkgPT4ge1xuXHRpZiAodGFyZ2V0ID09IG51bGwgfHwgaXNQcmltaXRpdmUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0aWYgKChbXG5cdFx0XCJkZXJlZlwiLFxuXHRcdFwiYmluZFwiLFxuXHRcdFwiQHRhcmdldFwiLFxuXHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0JGV4dHJhY3RLZXkkLFxuXHRcdCRyZWdpc3RyeUtleSRcblx0XS5pbmRleE9mKG5hbWUpIDwgMCA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBudWxsKSAhPSBudWxsKSByZXR1cm4gbnVsbDtcblx0aWYgKFskZXh0cmFjdEtleSQsICRvcmlnaW5hbEtleSRdLmluZGV4T2YobmFtZSkgPj0gMCkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyB0YXJnZXQ7XG5cdGlmIChuYW1lID09ICR2YWx1ZSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKTtcblx0aWYgKG5hbWUgPT0gJHJlZ2lzdHJ5S2V5JCkgcmV0dXJuIHJlZ2lzdHJ5O1xuXHRpZiAobmFtZSA9PSAkcmVzb2x2ZWQgfHwgbmFtZSA9PSBcInJlc29sdmVkXCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIFwicmVzb2x2ZWRcIikpIHJldHVybiBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQpO1xuXHRpZiAobmFtZSA9PSAkdHJpZ2dlckNvbnRyb2wpIHJldHVybiByZWdpc3RyeT8udHJpZ2dlckNvbnRyb2w7XG5cdGlmIChuYW1lID09IFN5bWJvbC5vYnNlcnZhYmxlKSByZXR1cm4gcmVnaXN0cnk/LmNvbXBhdGlibGU7XG5cdGlmIChuYW1lID09IFN5bWJvbC5zdWJzY3JpYmUpIHJldHVybiAoY2IsIHByb3AsIG9wdGlvbnMpID0+IGFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0LCBjYiwgb3B0aW9ucyk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5pdGVyYXRvcikgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5kaXNwb3NlKSByZXR1cm4gKHByb3ApID0+IHtcblx0XHRzYWZlR2V0KHRhcmdldCwgU3ltYm9sLmRpc3Bvc2UpPy4ocHJvcCk7XG5cdFx0dW5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCk7XG5cdH07XG5cdGlmIChuYW1lID09IFN5bWJvbC5hc3luY0Rpc3Bvc2UpIHJldHVybiAocHJvcCkgPT4ge1xuXHRcdHNhZmVHZXQodGFyZ2V0LCBTeW1ib2wuYXN5bmNEaXNwb3NlKT8uKHByb3ApO1xuXHRcdHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHR9O1xuXHRpZiAobmFtZSA9PSBTeW1ib2wudW5zdWJzY3JpYmUpIHJldHVybiAocHJvcCkgPT4gdW5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCk7XG5cdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG59O1xudmFyIG9ic2VydmFibGVBUElNZXRob2RzID0gKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpID0+IHtcblx0aWYgKG5hbWUgPT0gXCJzdWJzY3JpYmVcIikgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlPy5bbmFtZV0gPz8gKChoYW5kbGVyKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBoYW5kbGVyID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGFmZmVjdGVkKHRhcmdldCwgaGFuZGxlcik7XG5cdFx0ZWxzZSBpZiAoXCJuZXh0XCIgaW4gaGFuZGxlciAmJiBoYW5kbGVyPy5uZXh0ICE9IG51bGwpIHtcblx0XHRcdGNvbnN0IHVzdWIgPSBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXI/Lm5leHQpLCBjb21wID0gaGFuZGxlcj8uW1wiY29tcGxldGVcIl07XG5cdFx0XHRoYW5kbGVyW1wiY29tcGxldGVcIl0gPSAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHR1c3ViPy4oKTtcblx0XHRcdFx0cmV0dXJuIGNvbXA/LiguLi5hcmdzKTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gaGFuZGxlcltcImNvbXBsZXRlXCJdO1xuXHRcdH1cblx0fSk7XG59O1xudmFyIE9ic2VydmVBcnJheU1ldGhvZCA9IGNsYXNzIHtcblx0I25hbWU7XG5cdCNzZWxmO1xuXHQjaGFuZGxlO1xuXHRjb25zdHJ1Y3RvcihuYW1lLCBzZWxmLCBoYW5kbGUpIHtcblx0XHR0aGlzLiNuYW1lID0gbmFtZTtcblx0XHR0aGlzLiNzZWxmID0gc2VsZjtcblx0XHR0aGlzLiNoYW5kbGUgPSBoYW5kbGU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgcmVjKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBuYW1lLCByZWMpO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0bGV0IGFkZGVkID0gW10sIHJlbW92ZWQgPSBbXTtcblx0XHRsZXQgc2V0UGFpcnMgPSBbXTtcblx0XHRsZXQgb2xkU3RhdGUgPSBbLi4udGhpcy4jc2VsZl07XG5cdFx0bGV0IGlkeCA9IC0xO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHggfHwgdGhpcy4jc2VsZiwgYXJncyk7XG5cdFx0aWYgKHRoaXMuI2hhbmRsZT8uWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHJldHVybiBvYnNlcnZlQXJyYXkocmVzdWx0KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdHN3aXRjaCAodGhpcy4jbmFtZSkge1xuXHRcdFx0Y2FzZSBcInB1c2hcIjpcblx0XHRcdFx0aWR4ID0gb2xkU3RhdGU/Lmxlbmd0aDtcblx0XHRcdFx0YWRkZWQgPSBhcmdzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJ1bnNoaWZ0XCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGFkZGVkID0gYXJncztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwicG9wXCI6XG5cdFx0XHRcdGlkeCA9IG9sZFN0YXRlPy5sZW5ndGggLSAxO1xuXHRcdFx0XHRpZiAob2xkU3RhdGUubGVuZ3RoID4gMCkgcmVtb3ZlZCA9IFtvbGRTdGF0ZVtpZHhdXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2hpZnRcIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0aWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbb2xkU3RhdGVbaWR4XV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNwbGljZVwiOlxuXHRcdFx0XHRpZHggPSBhcmdzWzBdO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWF4KG9sZFN0YXRlLmxlbmd0aCwgdGhpcy4jc2VsZi5sZW5ndGgpOyBpKyspIHtcblx0XHRcdFx0XHRjb25zdCBvbGRWYWx1ZSA9IG9sZFN0YXRlW2ldO1xuXHRcdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gdGhpcy4jc2VsZltpXTtcblx0XHRcdFx0XHRpZiAobmV3VmFsdWUgPT09IHZvaWQgMCAmJiBpID49IHRoaXMuI3NlbGYubGVuZ3RoKSByZW1vdmVkLnB1c2gob2xkVmFsdWUpO1xuXHRcdFx0XHRcdGVsc2UgaWYgKG9sZFZhbHVlID09PSB2b2lkIDAgJiYgaSA+PSBvbGRTdGF0ZS5sZW5ndGgpIHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRcdG5ld1ZhbHVlLFxuXHRcdFx0XHRcdFx0dm9pZCAwLFxuXHRcdFx0XHRcdFx0ZmFsc2Vcblx0XHRcdFx0XHRdKTtcblx0XHRcdFx0XHRlbHNlIGlmIChpc05vdEVxdWFsKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdFx0aSxcblx0XHRcdFx0XHRcdG5ld1ZhbHVlLFxuXHRcdFx0XHRcdFx0b2xkVmFsdWUsXG5cdFx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic29ydFwiOlxuXHRcdFx0Y2FzZSBcImZpbGxcIjpcblx0XHRcdGNhc2UgXCJyZXZlcnNlXCI6XG5cdFx0XHRjYXNlIFwiY29weVdpdGhpblwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG9sZFN0YXRlLmxlbmd0aDsgaSsrKSBpZiAoaXNOb3RFcXVhbChvbGRTdGF0ZVtpXSwgdGhpcy4jc2VsZltpXSkpIHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdGlkeCArIGksXG5cdFx0XHRcdFx0dGhpcy4jc2VsZltpXSxcblx0XHRcdFx0XHRvbGRTdGF0ZVtpXSxcblx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdF0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzZXRcIjpcblx0XHRcdFx0aWR4ID0gYXJnc1sxXTtcblx0XHRcdFx0c2V0UGFpcnMucHVzaChbXG5cdFx0XHRcdFx0aWR4LFxuXHRcdFx0XHRcdGFyZ3NbMF0sXG5cdFx0XHRcdFx0b2xkU3RhdGU/LltpZHhdLFxuXHRcdFx0XHRcdGlkeCBpbiBvbGRTdGF0ZVxuXHRcdFx0XHRdKTtcblx0XHR9XG5cdFx0Y29uc3QgcmVnID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRoaXMuI3NlbGYpO1xuXHRcdGlmIChhZGRlZD8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKGlkeCwgYWRkZWRbMF0sIG51bGwsIFwiYWRkXCIpO1xuXHRcdGVsc2UgaWYgKGFkZGVkPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWc/LnRyaWdnZXI/LihpZHgsIGFkZGVkLCBudWxsLCBcImFkZEFsbFwiKTtcblx0XHRcdGFkZGVkLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZz8udHJpZ2dlcj8uKGlkeCArIEksIGl0ZW0sIG51bGwsIFwiYWRkXCIpKTtcblx0XHR9XG5cdFx0aWYgKHNldFBhaXJzPy5sZW5ndGggPT0gMSkgcmVnPy50cmlnZ2VyPy4oc2V0UGFpcnNbMF0/LlswXSA/PyBpZHgsIHNldFBhaXJzWzBdPy5bMV0sIHNldFBhaXJzWzBdPy5bMl0sIHNldFBhaXJzWzBdPy5bM10gPT09IGZhbHNlID8gXCJhZGRcIiA6IFwic2V0XCIpO1xuXHRcdGVsc2UgaWYgKHNldFBhaXJzPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWc/LnRyaWdnZXI/LihpZHgsIHNldFBhaXJzLCBvbGRTdGF0ZSwgXCJzZXRBbGxcIik7XG5cdFx0XHRzZXRQYWlycy5mb3JFYWNoKChwYWlyLCBJKSA9PiByZWc/LnRyaWdnZXI/LihwYWlyPy5bMF0gPz8gaWR4ICsgSSwgcGFpcj8uWzFdLCBwYWlyPy5bMl0sIHBhaXI/LlszXSA9PT0gZmFsc2UgPyBcImFkZFwiIDogXCJzZXRcIikpO1xuXHRcdH1cblx0XHRpZiAocmVtb3ZlZD8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZFswXSwgXCJkZWxldGVcIik7XG5cdFx0ZWxzZSBpZiAocmVtb3ZlZD8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBudWxsLCByZW1vdmVkLCBcImRlbGV0ZUFsbFwiKTtcblx0XHRcdHJlbW92ZWQuZm9yRWFjaCgoaXRlbSwgSSkgPT4gcmVnPy50cmlnZ2VyPy4oaWR4ICsgSSwgbnVsbCwgaXRlbSwgXCJkZWxldGVcIikpO1xuXHRcdH1cblx0XHRpZiAocmVzdWx0ID09IHRhcmdldCkgcmV0dXJuIG5ldyBQcm94eShyZXN1bHQsIHRoaXMuI2hhbmRsZSk7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkgcmV0dXJuIG9ic2VydmVBcnJheShyZXN1bHQpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn07XG52YXIgdHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UgPSAoc2VsZiwgdGFyZ2V0LCBvbGRMZW4sIG5ld0xlbikgPT4ge1xuXHRjb25zdCByZW1vdmVkSXRlbXMgPSBOdW1iZXIuaXNJbnRlZ2VyKG9sZExlbikgJiYgTnVtYmVyLmlzSW50ZWdlcihuZXdMZW4pICYmIG5ld0xlbiA8IG9sZExlbiA/IHRhcmdldC5zbGljZShuZXdMZW4sIG9sZExlbikgOiBbXTtcblx0aWYgKCFzZWxmWyR0cmlnZ2VyTG9ja10gJiYgb2xkTGVuICE9PSBuZXdMZW4pIHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHRcdGlmIChyZW1vdmVkSXRlbXMubGVuZ3RoID09PSAxKSByZWdpc3RyeT8udHJpZ2dlcj8uKG5ld0xlbiwgbnVsbCwgcmVtb3ZlZEl0ZW1zWzBdLCBcImRlbGV0ZVwiKTtcblx0XHRlbHNlIGlmIChyZW1vdmVkSXRlbXMubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtcywgXCJkZWxldGVBbGxcIik7XG5cdFx0XHRyZW1vdmVkSXRlbXMuZm9yRWFjaCgoaXRlbSwgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4gKyBJLCBudWxsLCBpdGVtLCBcImRlbGV0ZVwiKSk7XG5cdFx0fVxuXHRcdGNvbnN0IGFkZGVkQ291bnQgPSBOdW1iZXIuaXNJbnRlZ2VyKG9sZExlbikgJiYgTnVtYmVyLmlzSW50ZWdlcihuZXdMZW4pICYmIG5ld0xlbiA+IG9sZExlbiA/IG5ld0xlbiAtIG9sZExlbiA6IDA7XG5cdFx0aWYgKGFkZGVkQ291bnQgPT09IDEpIHJlZ2lzdHJ5Py50cmlnZ2VyPy4ob2xkTGVuLCB2b2lkIDAsIG51bGwsIFwiYWRkXCIpO1xuXHRcdGVsc2UgaWYgKGFkZGVkQ291bnQgPiAxKSB7XG5cdFx0XHRjb25zdCBhZGRlZCA9IEFycmF5KGFkZGVkQ291bnQpLmZpbGwodm9pZCAwKTtcblx0XHRcdHJlZ2lzdHJ5Py50cmlnZ2VyPy4ob2xkTGVuLCBhZGRlZCwgbnVsbCwgXCJhZGRBbGxcIik7XG5cdFx0XHRhZGRlZC5mb3JFYWNoKChfLCBJKSA9PiByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiArIEksIHZvaWQgMCwgbnVsbCwgXCJhZGRcIikpO1xuXHRcdH1cblx0fVxufTtcbnZhciBPYnNlcnZlQXJyYXlIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRoYXModGFyZ2V0LCBuYW1lKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSk7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgcmVjKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gc2FmZUdldCh0YXJnZXQsIG5hbWUpPy5iaW5kPy4odGFyZ2V0KSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5Py5nZXQ/Lih0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZSA/PyAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiBzYWZlR2V0KHRhcmdldCwga2V5KSk7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IHZvaWQgMCk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gXCJAdGFyZ2V0XCIgfHwgbmFtZSA9PSAkZXh0cmFjdEtleSQpIHJldHVybiB0YXJnZXQ7XG5cdFx0aWYgKG5hbWUgPT0gXCJ4XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py54ID8/IHRhcmdldD8uWzBdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ5XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py55ID8/IHRhcmdldD8uWzFdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ6XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py56ID8/IHRhcmdldD8uWzJdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ3XCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py53ID8/IHRhcmdldD8uWzNdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5yID8/IHRhcmdldD8uWzBdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJnXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5nID8/IHRhcmdldD8uWzFdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJiXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5iID8/IHRhcmdldD8uWzJdO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGFyZ2V0Py5hID8/IHRhcmdldD8uWzNdO1xuXHRcdH07XG5cdFx0Y29uc3QgZ290ID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IChuYW1lID09IFwidmFsdWVcIiA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpIDogbnVsbCk7XG5cdFx0aWYgKHR5cGVvZiBnb3QgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbmV3IFByb3h5KHR5cGVvZiBnb3QgPT0gXCJmdW5jdGlvblwiID8gZ290Py5iaW5kPy4odGFyZ2V0KSA6IGdvdCwgbmV3IE9ic2VydmVBcnJheU1ldGhvZChuYW1lLCB0YXJnZXQsIHRoaXMpKTtcblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KG5hbWUpKSkgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGNvbnN0IHBlbmRpbmcgPSBpc1Byb21pc2UodmFsdWUpO1xuXHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0Y29uc3QgeHl6dyA9IFtcblx0XHRcdFx0XCJ4XCIsXG5cdFx0XHRcdFwieVwiLFxuXHRcdFx0XHRcInpcIixcblx0XHRcdFx0XCJ3XCJcblx0XHRcdF07XG5cdFx0XHRjb25zdCByZ2JhID0gW1xuXHRcdFx0XHRcInJcIixcblx0XHRcdFx0XCJnXCIsXG5cdFx0XHRcdFwiYlwiLFxuXHRcdFx0XHRcImFcIlxuXHRcdFx0XTtcblx0XHRcdGNvbnN0IHh5endfaWR4ID0geHl6dy5pbmRleE9mKG5hbWUpO1xuXHRcdFx0Y29uc3QgcmdiYV9pZHggPSByZ2JhLmluZGV4T2YobmFtZSk7XG5cdFx0XHRsZXQgZ290ID0gZmFsc2U7XG5cdFx0XHRpZiAoeHl6d19pZHggPj0gMCkgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCB4eXp3X2lkeCwgdik7XG5cdFx0XHRlbHNlIGlmIChyZ2JhX2lkeCA+PSAwKSBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHJnYmFfaWR4LCB2KTtcblx0XHRcdGVsc2UgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2KTtcblx0XHRcdGlmIChuYW1lID09IFwibGVuZ3RoXCIpIHtcblx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2xkLCB2KSkgdHJpZ2dlcldoZW5MZW5ndGhDaGFuZ2UodGhpcywgdGFyZ2V0LCBvbGQsIHYpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0XHRpZiAoaXNOb3RFcXVhbChvbGQsIHYpKSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIHYsIG9sZCwgXCJzZXRcIik7XG5cdFx0XHRcdGlmIChwZW5kaW5nKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBuYW1lLCB2LCBvbGQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGdvdDtcblx0XHR9KTtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAodHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0aWYgKE51bWJlci5pc0ludGVnZXIocGFyc2VJbnQobmFtZSkpKSBuYW1lID0gcGFyc2VJbnQobmFtZSkgPz8gbmFtZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGNvbnN0IG9sZCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCBnb3QgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgbmFtZSAhPSBcImxlbmd0aFwiICYmIG5hbWUgIT0gJHRyaWdnZXJMb2NrICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChvbGQgIT0gbnVsbCkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCBuYW1lLCBvbGQsIFwiZGVsZXRlXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG59O1xudmFyIE9ic2VydmVPYmplY3RIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiLFxuXHRcdFx0XCJ0aGVuXCIsXG5cdFx0XHRcImNhdGNoXCIsXG5cdFx0XHRcImZpbmFsbHlcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IHRyaWdnZXJLZXlPZih0YXJnZXQsIG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZSA/PyByZWFsUHJvcE9mJDEodGFyZ2V0KSA/PyBcInZhbHVlXCIpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiBrZXkgPT0gXCJ2YWx1ZVwiIHx8IGtleSA9PSByZWFsUHJvcE9mJDEodGFyZ2V0KSA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpIDogdm9pZCAwKTtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gdHJpZ2dlclZhbHVlT2YodGFyZ2V0LCBrZXkpKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBTeW1ib2wudG9QcmltaXRpdmUpIHJldHVybiAoaGludCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LihoaW50KTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiB0cnlQYXJzZUJ5SGludChmdCwgaGludCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiB0cnlQYXJzZUJ5SGludChzYWZlR2V0KGZ0LCBcInZhbHVlXCIpLCBoaW50KTtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludChzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0LCBoaW50KTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFN5bWJvbC50b1N0cmluZ1RhZykgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBTdHJpbmcoZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwidG9TdHJpbmdcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBTeW1ib2wudG9TdHJpbmdUYWcpKSByZXR1cm4gc2FmZUdldChmdCwgU3ltYm9sLnRvU3RyaW5nVGFnKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gU3RyaW5nKGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0cmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInZhbHVlT2ZcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBTeW1ib2wudG9QcmltaXRpdmUpKSByZXR1cm4gc2FmZUdldChmdCwgU3ltYm9sLnRvUHJpbWl0aXZlKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gZnQ7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBzYWZlR2V0KGZ0LCBcInZhbHVlXCIpO1xuXHRcdFx0cmV0dXJuIHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQ7XG5cdFx0fTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdHJldHVybiBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0Py5bU3ltYm9sLmZvcihcIkBAYXBwbHlcIildPy5iaW5kPy4odGFyZ2V0Py5bU3ltYm9sLmZvcihcIkBAYXBwbHlcIildID8/IHRhcmdldCkgPz8gdGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBwcm9wIGluIHRhcmdldDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmModmFsdWUsICh2KSA9PiB7XG5cdFx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh2LCBuYW1lKTtcblx0XHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7XG5cdFx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0ICRvcmlnaW5hbCA9IHRhcmdldDtcblx0XHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmICEoc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgbmFtZSBpbiB0YXJnZXQpKSByZXR1cm47XG5cdFx0XHRjb25zdCB0cmlnZ2VyTmFtZSA9IHRyaWdnZXJLZXlPZih0YXJnZXQsIG5hbWUpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBuYW1lID09IFwidmFsdWVcIiA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpID8/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRcdHRhcmdldFtuYW1lXSA9IHY7XG5cdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyB2O1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgdHlwZW9mIG5hbWUgIT09IFwic3ltYm9sXCIgJiYgIWlzUmVhY3RpdmVQcm9wZXJ0eSgkb3JpZ2luYWwsIG5hbWUpKSB7XG5cdFx0XHRcdGNvbnN0IHN1YnNjcmlwdCA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCgkb3JpZ2luYWwpO1xuXHRcdFx0XHRpZiAoKHNhZmVHZXQodGFyZ2V0LCAkaXNOb3RFcXVhbCkgPz8gaXNOb3RFcXVhbCk/LihvbGRWYWx1ZSwgbmV3VmFsdWUpKSBzdWJzY3JpcHQ/LnRyaWdnZXI/Lih0cmlnZ2VyTmFtZSwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgZW1pdFJlc29sdmVkKCRvcmlnaW5hbCwgdHJpZ2dlck5hbWUsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0pO1xuXHR9XG5cdGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcikge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIGRlc2NyaXB0b3IudmFsdWUpIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhZGVzY3JpcHRvci52YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIWRlc2NyaXB0b3IudmFsdWUpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGlmIChkZXNjcmlwdG9yLmdldCA9PSB2b2lkIDAgJiYgZGVzY3JpcHRvci5zZXQgPT0gdm9pZCAwKSByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpO1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0ICRyZXN1bHQgPSBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwge1xuXHRcdFx0Z2V0OiBkZXNjcmlwdG9yLmdldCxcblx0XHRcdHNldDogZGVzY3JpcHRvci5zZXQsXG5cdFx0XHRlbnVtZXJhYmxlOiBkZXNjcmlwdG9yLmVudW1lcmFibGUgPz8gdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogZGVzY3JpcHRvci5jb25maWd1cmFibGUgPz8gdHJ1ZVxuXHRcdH0pO1xuXHRcdHNhZmVTZXQodGFyZ2V0LCBuYW1lLCBvbGRWYWx1ZSk7XG5cdFx0cmV0dXJuICRyZXN1bHQ7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgbmFtZSAhPSAkdHJpZ2dlckxvY2sgJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufTtcbnZhciBPYnNlcnZlTWFwSGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0dGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsICRleHRyYWN0S2V5JCkgPz8gc2FmZUdldCh0YXJnZXQsICRvcmlnaW5hbEtleSQpID8/IHRhcmdldDtcblx0XHRjb25zdCB2YWx1ZU9yRnggPSBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gdmFsdWVPckZ4O1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZTtcblx0XHRcdGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0YXJnZXQuZ2V0KGtleSkpO1xuXHRcdFx0aWYgKHZhbHVlID09IG51bGwgJiYgIWhhc093bihvcHRpb25zLCBcInZhbHVlXCIpKSByZXR1cm47XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IHZvaWQgMCk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gXCJjbGVhclwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWVzID0gQXJyYXkuZnJvbSh0YXJnZXQ/LmVudHJpZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG5cdFx0XHRvbGRWYWx1ZXMuZm9yRWFjaCgoW3Byb3AsIG9sZFZhbHVlXSkgPT4ge1xuXHRcdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImRlbGV0ZVwiKSByZXR1cm4gKHByb3AsIF8gPSBudWxsKSA9PiB7XG5cdFx0XHRjb25zdCBoYWQgPSB0YXJnZXQuaGFzKHByb3ApLCBvbGRWYWx1ZSA9IHRhcmdldC5nZXQocHJvcCksIHJlc3VsdCA9IHZhbHVlT3JGeChwcm9wKTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIGhhZCkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJzZXRcIikgcmV0dXJuIChwcm9wLCB2YWx1ZSkgPT4gcG90ZW50aWFsbHlBc3luY01hcCh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXMocHJvcCksIG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3AsIHYpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0aWYgKCFoYWQgfHwgaXNOb3RFcXVhbChvbGRWYWx1ZSwgdikpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4ocHJvcCwgdiwgaGFkID8gb2xkVmFsdWUgOiBudWxsLCBoYWQgPyBcInNldFwiIDogXCJhZGRcIik7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBwcm9wLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0pO1xuXHRcdGlmIChuYW1lID09IFwiZ2V0T3JJbnNlcnRcIiB8fCBuYW1lID09IFwiZ2V0T3JJbnNlcnRDb21wdXRlZFwiKSB7XG5cdFx0XHRjb25zdCBjb21wdXRlZCA9IG5hbWUgPT0gXCJnZXRPckluc2VydENvbXB1dGVkXCI7XG5cdFx0XHRyZXR1cm4gKGtleSwgZGVmYXVsdE9yQ29tcHV0ZSkgPT4ge1xuXHRcdFx0XHRpZiAodGFyZ2V0LmhhcyhrZXkpKSByZXR1cm4gdGFyZ2V0LmdldChrZXkpO1xuXHRcdFx0XHRjb25zdCBpbmNvbWluZyA9IGNvbXB1dGVkID8gdHlwZW9mIGRlZmF1bHRPckNvbXB1dGUgPT0gXCJmdW5jdGlvblwiID8gZGVmYXVsdE9yQ29tcHV0ZShrZXkpIDogZGVmYXVsdE9yQ29tcHV0ZSA6IGRlZmF1bHRPckNvbXB1dGU7XG5cdFx0XHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jTWFwKGluY29taW5nLCAodikgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IHR5cGVvZiB0YXJnZXQuZ2V0T3JJbnNlcnQgPT0gXCJmdW5jdGlvblwiID8gdGFyZ2V0LmdldE9ySW5zZXJ0KGtleSwgdikgOiAodGFyZ2V0LnNldChrZXksIHYpLCB0YXJnZXQuZ2V0KGtleSkpO1xuXHRcdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdFx0XHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKGtleSwgdiwgbnVsbCwgXCJhZGRcIik7XG5cdFx0XHRcdFx0XHRpZiAoaXNQcm9taXNlKGluY29taW5nKSkgZW1pdFJlc29sdmVkKHRhcmdldCwga2V5LCB2LCBudWxsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWVPckZ4O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpO1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuXHRcdGxldCBnb3QgPSB2b2lkIDA7XG5cdFx0dHJ5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG5cdFx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIGdvdCA9IHZvaWQgMDtcblx0XHRcdGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRnb3QgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG59O1xudmFyIE9ic2VydmVTZXRIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXSA9IGZhbHNlO1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGdldCh0YXJnZXQsIG5hbWUsIGN0eCkge1xuXHRcdGlmIChbXG5cdFx0XHQkZXh0cmFjdEtleSQsXG5cdFx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdFx0XCJAdGFyZ2V0XCIsXG5cdFx0XHRcImRlcmVmXCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCAkZXh0cmFjdEtleSQpID8/IHNhZmVHZXQodGFyZ2V0LCAkb3JpZ2luYWxLZXkkKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3QgdmFsdWVPckZ4ID0gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSk7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHZhbHVlT3JGeDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWU7XG5cdFx0XHRpZiAoa2V5ID09IG51bGwpIHJldHVybjtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gdGFyZ2V0LmhhcyhrZXkpKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcImNsZWFyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8udmFsdWVzPy4oKSB8fCBbXSksIHJlc3VsdCA9IHZhbHVlT3JGeCgpO1xuXHRcdFx0b2xkVmFsdWVzLmZvckVhY2goKG9sZFZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG51bGwsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZGVsZXRlXCIpIHJldHVybiAodmFsdWUpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXModmFsdWUpLCBvbGRWYWx1ZSA9IGhhZCA/IHZhbHVlIDogbnVsbCwgcmVzdWx0ID0gdmFsdWVPckZ4KHZhbHVlKTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIGhhZCkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lih2YWx1ZSwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYWRkXCIpIHJldHVybiAodmFsdWUpID0+IHBvdGVudGlhbGx5QXN5bmModmFsdWUsICh2KSA9PiB7XG5cdFx0XHRjb25zdCBoYWQgPSB0YXJnZXQuaGFzKHYpLCBvbGRWYWx1ZSA9IGhhZCA/IHYgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodik7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRpZiAoIWhhZCkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lih2LCB2LCBvbGRWYWx1ZSwgXCJhZGRcIik7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCB2LCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0pO1xuXHRcdHJldHVybiB2YWx1ZU9yRng7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cbn07XG52YXIgJGlzT2JzZXJ2YWJsZSA9ICh0YXJnZXQpID0+IHtcblx0cmV0dXJuICEhKCh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpICYmIHRhcmdldCAhPSBudWxsICYmICh0YXJnZXQ/LlskZXh0cmFjdEtleSRdIHx8IHRhcmdldD8uWyRhZmZlY3RlZF0pKTtcbn07XG52YXIgbWFrZVJlYWN0aXZlUHJvcGVydGllcyA9IChvYmopID0+IHtcblx0aWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuXHRcdGNvbnN0IGVudHJpZXMgPSBvYmouZW50cmllcygpO1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGVudHJpZXMpIGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBrZXkpO1xuXHR9IGVsc2UgaWYgKG9iaiAhPSBudWxsICYmICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIG9iaiA9PSBcImZ1bmN0aW9uXCIpKSB7XG5cdFx0Y29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG9iaik7XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcykgZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIGtleSk7XG5cdH1cbn07XG52YXIgb2JzZXJ2ZUFycmF5ID0gKGFycikgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShhcnIpKSByZXR1cm4gYXJyO1xuXHRtYWtlUmVhY3RpdmVQcm9wZXJ0aWVzKGFycik7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgoYXJyLCBuZXcgT2JzZXJ2ZUFycmF5SGFuZGxlcigpKSwgYXJyKTtcbn07XG52YXIgb2JzZXJ2ZU9iamVjdCA9IChvYmopID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUob2JqKSkgcmV0dXJuIG9iajtcblx0bWFrZVJlYWN0aXZlUHJvcGVydGllcyhvYmopO1xuXHRyZXR1cm4gYmluZEV4aXN0aW5nVGhlbmFibGVzKHdyYXBXaXRoKG9iaiwgbmV3IE9ic2VydmVPYmplY3RIYW5kbGVyKCkpLCBvYmopO1xufTtcbnZhciBvYnNlcnZlTWFwID0gKG1hcCkgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShtYXApKSByZXR1cm4gbWFwO1xuXHRtYWtlUmVhY3RpdmVQcm9wZXJ0aWVzKG1hcCk7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgobWFwLCBuZXcgT2JzZXJ2ZU1hcEhhbmRsZXIoKSksIG1hcCk7XG59O1xudmFyIG9ic2VydmVTZXQgPSAoc2V0KSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKHNldCkpIHJldHVybiBzZXQ7XG5cdG1ha2VSZWFjdGl2ZVByb3BlcnRpZXMoc2V0KTtcblx0cmV0dXJuIHdyYXBXaXRoKHNldCwgbmV3IE9ic2VydmVTZXRIYW5kbGVyKCkpO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvUHJpbWl0aXZlcy50c1xudmFyIG51bWJlclJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IG9iaiA9IHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogaXNQcm9taXNlID8gMCA6IE51bWJlcihkZXJlZihpbml0aWFsKSB8fCAwKSB8fCAwLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXM/LlskdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KCh0eXBlb2YgdGhpcz8uWyR2YWx1ZV0gIT0gXCJvYmplY3RcIiA/IHRoaXM/LlskdmFsdWVdIDogdGhpcz8uWyR2YWx1ZV0/LnZhbHVlIHx8IDApID8/IDAsIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9ICh2ICE9IG51bGwgJiYgIU51bWJlci5pc05hTih2KSA/IE51bWJlcih2KSA6IHRoaXNbJHZhbHVlXSkgfHwgMDtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiBOdW1iZXIodGhpc1skdmFsdWVdIHx8IDApIHx8IDA7XG5cdFx0fVxuXHR9O1xuXHRkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KG9iaiwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKG9iaik7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIHN0cmluZ1JlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IG9iaiA9IHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogKGlzUHJvbWlzZSA/IFwiXCIgOiBTdHJpbmcoZGVyZWYodHlwZW9mIGluaXRpYWwgPT0gXCJudW1iZXJcIiA/IFN0cmluZyhpbml0aWFsKSA6IGluaXRpYWwgfHwgXCJcIikpKSA/PyBcIlwiLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXM/LlskdmFsdWVdID8/IFwiXCIpID8/IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHRoaXM/LlskdmFsdWVdID8/IFwiXCIsIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9IFN0cmluZyh0eXBlb2YgdiA9PSBcIm51bWJlclwiID8gU3RyaW5nKHYpIDogdiB8fCBcIlwiKSA/PyBcIlwiO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzWyR2YWx1ZV0gPz8gXCJcIikgPz8gXCJcIjtcblx0XHR9XG5cdH07XG5cdGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBcInZhbHVlXCIpO1xuXHRjb25zdCAkciA9IG9ic2VydmUob2JqKTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgYm9vbGVhblJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IG9iaiA9IHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJHZhbHVlXTogKGlzUHJvbWlzZSA/IGZhbHNlIDogKGRlcmVmKGluaXRpYWwpICE9IG51bGwgPyB0eXBlb2YgZGVyZWYoaW5pdGlhbCkgPT0gXCJzdHJpbmdcIiA/IHRydWUgOiAhIWRlcmVmKGluaXRpYWwpIDogZmFsc2UpIHx8IGZhbHNlKSB8fCBmYWxzZSxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCghIXRoaXM/LlskdmFsdWVdIHx8IGZhbHNlLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsID8gdHlwZW9mIHYgPT0gXCJzdHJpbmdcIiA/IHRydWUgOiAhIXYgOiB0aGlzWyR2YWx1ZV0pIHx8IGZhbHNlO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSB8fCBmYWxzZTtcblx0XHR9XG5cdH07XG5cdGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBcInZhbHVlXCIpO1xuXHRjb25zdCAkciA9IG9ic2VydmUob2JqKTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgd3JhcFJlZiA9IChpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCBpc1Byb21pc2UgPSBpbml0aWFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgaW5pdGlhbD8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IG9iaiA9IHtcblx0XHRbJHByb21pc2VdOiBpc1Byb21pc2UgPyBpbml0aWFsIDogbnVsbCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHRoaXMudmFsdWUsIGhpbnQpO1xuXHRcdH0sXG5cdFx0dmFsdWU6IGlzUHJvbWlzZSA/IG51bGwgOiBkZXJlZihpbml0aWFsKVxuXHR9O1xuXHRkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KG9iaiwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKG9iaik7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZmZlY3RlZChpbml0aWFsLCAodikgPT4ge1xuXHRcdCRyPy5bJHRyaWdnZXJdPy4oKTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgbWFya1JlYWxQcm9wID0gKHRhcmdldCwgcmVhbFByb3ApID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGFyZ2V0ICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRhcmdldDtcblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCAkcmVhbFByb3AsIHtcblx0XHRcdHZhbHVlOiByZWFsUHJvcCxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0gY2F0Y2gge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXJnZXRbJHJlYWxQcm9wXSA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHR0cnkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIFwicmVhbFByb3BcIiwge1xuXHRcdFx0dmFsdWU6IHJlYWxQcm9wLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhcmdldC5yZWFsUHJvcCA9IHJlYWxQcm9wO1xuXHRcdH0gY2F0Y2gge31cblx0fVxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBwcm9wUmVmID0gKHNyYywgc3JjUHJvcCA9IFwidmFsdWVcIiwgaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKHNyYykgfHwgIXNyYykgcmV0dXJuIHNyYztcblx0aWYgKEFycmF5LmlzQXJyYXkoc3JjKSAmJiBzcmMubGVuZ3RoID09IDIgJiYgc3JjWzBdICE9IG51bGwgJiYgKHNyY1swXSBpbnN0YW5jZW9mIE1hcCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrTWFwIHx8IHNyY1swXSBpbnN0YW5jZW9mIFNldCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBXZWFrU2V0KSkge1xuXHRcdGlmIChzcmNQcm9wID09IG51bGwgfHwgc3JjUHJvcCA9PT0gXCJ2YWx1ZVwiKSBzcmNQcm9wID0gc3JjWzFdO1xuXHRcdHNyYyA9IHNyY1swXTtcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNyYykgJiYgIWlzQXJyYXlJbnZhbGlkS2V5KHNyYz8uWzFdLCBzcmMpICYmIChBcnJheS5pc0FycmF5KHNyYz8uWzBdKSB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc3JjPy5bMF0gPT0gXCJmdW5jdGlvblwiKSkgc3JjID0gc3JjPy5bMF07XG5cdGNvbnN0IGlzTWFwID0gc3JjIGluc3RhbmNlb2YgTWFwIHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtNYXAgfHwgdHlwZW9mIHNyYz8uZ2V0ID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc3JjPy5zZXQgPT0gXCJmdW5jdGlvblwiICYmICh0eXBlb2Ygc3JjPy5kZWxldGUgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBzcmM/LnJlbW92ZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRjb25zdCBpc1NldCA9IHNyYyBpbnN0YW5jZW9mIFNldCB8fCBzcmMgaW5zdGFuY2VvZiBXZWFrU2V0IHx8IHR5cGVvZiBzcmM/LmhhcyA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNyYz8uYWRkID09IFwiZnVuY3Rpb25cIiAmJiAodHlwZW9mIHNyYz8uZGVsZXRlID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygc3JjPy5yZW1vdmUgPT0gXCJmdW5jdGlvblwiKTtcblx0aWYgKGlzTWFwIHx8IGlzU2V0KSB7XG5cdFx0aWYgKHNyY1Byb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHR9IGVsc2UgaWYgKChzcmNQcm9wID8/PSBBcnJheS5pc0FycmF5KHNyYykgPyBudWxsIDogXCJ2YWx1ZVwiKSA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KHNyY1Byb3AsIHNyYykpIHJldHVybjtcblx0Y29uc3QgcmVhZFNsb3QgPSAoKSA9PiB7XG5cdFx0aWYgKGlzTWFwKSByZXR1cm4gc3JjPy5nZXQ/LihzcmNQcm9wKTtcblx0XHRpZiAoaXNTZXQpIHJldHVybiBzcmM/Lmhhcz8uKHNyY1Byb3ApID8gc3JjUHJvcCA6IG51bGw7XG5cdFx0cmV0dXJuIHNyYz8uW3NyY1Byb3BdO1xuXHR9O1xuXHRjb25zdCB3cml0ZVNsb3QgPSAodikgPT4ge1xuXHRcdGlmIChpc01hcCkge1xuXHRcdFx0Y29uc3QgbWFwID0gc3JjO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwodiwgbWFwPy5nZXQ/LihzcmNQcm9wKSkpIG1hcD8uc2V0Py4oc3JjUHJvcCwgdik7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9XG5cdFx0aWYgKGlzU2V0KSB7XG5cdFx0XHRjb25zdCBzZXQgPSBzcmM7XG5cdFx0XHRjb25zdCBtZW1iZXIgPSB2ID8/IHNyY1Byb3A7XG5cdFx0XHRpZiAobWVtYmVyID09IG51bGwpIHtcblx0XHRcdFx0c2V0Py5kZWxldGU/LihzcmNQcm9wKTtcblx0XHRcdFx0cmV0dXJuIG1lbWJlcjtcblx0XHRcdH1cblx0XHRcdGlmICghc2V0Py5oYXM/LihtZW1iZXIpKSBzZXQ/LmFkZD8uKG1lbWJlcik7XG5cdFx0XHRyZXR1cm4gbWVtYmVyO1xuXHRcdH1cblx0XHRpZiAoaXNOb3RFcXVhbCh2LCBzcmM/LltzcmNQcm9wXSkpIHNyY1tzcmNQcm9wXSA9IHY7XG5cdFx0cmV0dXJuIHY7XG5cdH07XG5cdGlmIChpc01hcCAmJiBpbml0aWFsICE9PSB2b2lkIDAgJiYgIXNyYz8uaGFzPy4oc3JjUHJvcCkpIHNyYz8uc2V0Py4oc3JjUHJvcCwgaW5pdGlhbCk7XG5cdGVsc2UgaWYgKGlzU2V0ICYmIGluaXRpYWwgJiYgIXNyYz8uaGFzPy4oc3JjUHJvcCkpIHNyYz8uYWRkPy4oc3JjUHJvcCk7XG5cdGNvbnN0IGN1cnJlbnQgPSByZWFkU2xvdCgpO1xuXHRpZiAoIWlzU2V0ICYmIHNyY1Byb3AgIT0gbnVsbCAmJiBoYXNWYWx1ZShjdXJyZW50KSAmJiBpc09ic2VydmFibGUoY3VycmVudCkpIHJldHVybiBtYXJrUmVhbFByb3AocmVjb3ZlclJlYWN0aXZlKGN1cnJlbnQpLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQgJiYgc3JjUHJvcCAmJiB0eXBlb2Ygc3JjPy5nZXRQcm9wZXJ0eSA9PSBcImZ1bmN0aW9uXCIgJiYgaXNPYnNlcnZhYmxlKHNyYz8uZ2V0UHJvcGVydHk/LihzcmNQcm9wKSkpIHJldHVybiBtYXJrUmVhbFByb3Aoc3JjPy5nZXRQcm9wZXJ0eT8uKHNyY1Byb3ApLCBzcmNQcm9wKTtcblx0aWYgKCFpc01hcCAmJiAhaXNTZXQpIHNyY1tzcmNQcm9wXSA/Pz0gaW5pdGlhbCA/PyBzcmM/LltzcmNQcm9wXTtcblx0ZWxzZSBpZiAoaXNNYXAgJiYgaXNOb3RFcXVhbChpbml0aWFsID8/IHNyYz8uZ2V0Py4oc3JjUHJvcCksIHNyYz8uZ2V0Py4oc3JjUHJvcCkpKSBzcmM/LnNldD8uKHNyY1Byb3AsIGluaXRpYWwgPz8gc3JjPy5nZXQ/LihzcmNQcm9wKSk7XG5cdGVsc2UgaWYgKGlzU2V0ICYmIHNyYz8uaGFzPy4oaW5pdGlhbCA/PyBzcmNQcm9wKSkgc3JjPy5hZGQ/Lihpbml0aWFsID8/IHNyY1Byb3ApO1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IGlzU2V0ID8gcmVhZFNsb3QoKSA6IHJlYWRTbG90KCkgPz8gaW5pdGlhbCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyhyZWFkU2xvdCgpID8/IHRoaXNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludChyZWFkU2xvdCgpLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHRyWyR0cmlnZ2VyTG9jayQxXSA9IHRydWU7XG5cdFx0XHRpZiAoaXNTZXQpIHRoaXNbJHZhbHVlXSA9IHdyaXRlU2xvdCh2KTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjb25zdCBuZXh0ID0gdiA/PyBkZWZhdWx0QnlUeXBlKHJlYWRTbG90KCkpO1xuXHRcdFx0XHR0aGlzWyR2YWx1ZV0gPSB3cml0ZVNsb3QobmV4dCk7XG5cdFx0XHR9XG5cdFx0XHRyWyR0cmlnZ2VyTG9jayQxXSA9IGZhbHNlO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0Y29uc3Qgc2xvdCA9IHJlYWRTbG90KCk7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gc2xvdCA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0bWFya1JlYWxQcm9wKHIsIHNyY1Byb3ApO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzcmMsICh2LCBfcHJvcCwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKF9wcm9wICE9IHNyY1Byb3ApIHJldHVybjtcblx0XHRpZiAoclskdHJpZ2dlckxvY2skMV0pIHJldHVybjtcblx0XHRjb25zdCBuZXh0ID0gaXNTZXQgPyByZWFkU2xvdCgpIDogdjtcblx0XHRjb25zdCBwcmV2ID0gclskdmFsdWVdO1xuXHRcdHJbJHZhbHVlXSA9IG5leHQ7XG5cdFx0clskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiBuZXh0LFxuXHRcdFx0b2xkVmFsdWU6IG9sZCA/PyBwcmV2LFxuXHRcdFx0dHJpZ2dlcjogdHJpZ2dlciA/PyBcInNldFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHI7XG59O1xudmFyICRyZWYgPSAodHlwZWQsIGJlaGF2aW9yKSA9PiB7XG5cdHN3aXRjaCAodHlwZW9mIHR5cGVkKSB7XG5cdFx0Y2FzZSBcImJvb2xlYW5cIjogcmV0dXJuIGJvb2xlYW5SZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwibnVtYmVyXCI6IHJldHVybiBudW1iZXJSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwic3RyaW5nXCI6IHJldHVybiBzdHJpbmdSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0XHRjYXNlIFwib2JqZWN0XCI6IGlmICh0eXBlZCAhPSBudWxsKSByZXR1cm4gd3JhcFJlZihvYnNlcnZlKHR5cGVkKSwgYmVoYXZpb3IpO1xuXHRcdGRlZmF1bHQ6IHJldHVybiB3cmFwUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdH1cbn07XG52YXIgcmVmID0gKHR5cGVkLCBwcm9wID0gXCJ2YWx1ZVwiLCBiZWhhdmlvcikgPT4ge1xuXHRjb25zdCAkciA9IGlzT2JzZXJ2YWJsZSh0eXBlZCkgPyB0eXBlZCA6ICRyZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0aWYgKHByb3AgIT0gbnVsbCkgcmV0dXJuIHByb3BSZWYoJHIsIHByb3AsIGJlaGF2aW9yKTtcblx0ZWxzZSByZXR1cm4gJHI7XG59O1xudmFyIHByb21pc2VkID0gKHByb21pc2UsIGJlaGF2aW9yKSA9PiB7XG5cdHJldHVybiByZWYocHJvbWlzZSwgYmVoYXZpb3IpO1xufTtcbnZhciB0cmlnZ2VyV2l0aERlbGF5ID0gKHJlZiwgY2IsIGRlbGF5ID0gMTAwKSA9PiB7XG5cdGlmIChyZWY/LnZhbHVlID8/IHJlZikgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGlmIChyZWYudmFsdWUpIGNiPy4oKTtcblx0fSwgZGVsYXkpO1xufTtcbnZhciBkZWxheWVkQmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHR9O1xufTtcbnZhciBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IgPSAoZGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIChjYiwgW3ZhbF0sIFtzaWddKSA9PiB7XG5cdFx0bGV0IHRtID0gdHJpZ2dlcldpdGhEZWxheSh2YWwsIGNiLCBkZWxheSk7XG5cdFx0c2lnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJhYm9ydFwiLCAoKSA9PiB7XG5cdFx0XHRpZiAodG0pIGNsZWFyVGltZW91dCh0bSk7XG5cdFx0fSwgeyBvbmNlOiB0cnVlIH0pO1xuXHRcdGlmICghdG0pIGNiPy4oKTtcblx0fTtcbn07XG5mdW5jdGlvbiBvYnNlcnZlKHRhcmdldCwgc3RhdGVOYW1lKSB7XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0aWYgKCh0YXJnZXQgPSBkZXJlZj8uKHRhcmdldCkpID09IG51bGwgfHwgdGFyZ2V0IGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0YXJnZXQgaW5zdGFuY2VvZiBXZWFrUmVmIHx8ICRpc09ic2VydmFibGUodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0Y29uc3QgdW53cmFwID0gdGFyZ2V0O1xuXHRpZiAodW53cmFwID09IG51bGwgfHwgdHlwZW9mIHVud3JhcCA9PSBcInN5bWJvbFwiIHx8ICEodHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiKSB8fCB1bndyYXAgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHVud3JhcCBpbnN0YW5jZW9mIFdlYWtSZWYpIHJldHVybiB1bndyYXA7XG5cdGxldCByZWFjdGl2ZSA9IHVud3JhcDtcblx0aWYgKEFycmF5LmlzQXJyYXkodW53cmFwKSkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZUFycmF5KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZU1hcCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVTZXQodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlT2JqZWN0KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9XG5cdHJldHVybiByZWFjdGl2ZTtcbn1cbnZhciBpc09ic2VydmFibGUgPSAodGFyZ2V0KSA9PiB7XG5cdGlmICh0eXBlb2YgSFRNTElucHV0RWxlbWVudCAhPSBcInVuZGVmaW5lZFwiICYmIHRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSB8fCBzdWJzY3JpcHRSZWdpc3RyeT8uaGFzPy4odGFyZ2V0KSkpO1xufTtcbnZhciByZWNvdmVyUmVhY3RpdmUgPSAodGFyZ2V0KSA9PiB7XG5cdHJldHVybiBpc09ic2VydmFibGUodGFyZ2V0KSA/IG9ic2VydmUodGFyZ2V0KSA6IG51bGw7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9NYWlubGluZS50c1xudmFyIHVzZU9ic2VydmFibGUgPSAodW53cmFwKSA9PiB7XG5cdGlmICh1bndyYXAgPT0gbnVsbCB8fCB0eXBlb2YgdW53cmFwICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHVud3JhcCAhPSBcImZ1bmN0aW9uXCIgfHwgdW53cmFwPy5bU3ltYm9sLm9ic2VydmFibGVdICE9IG51bGwpIHJldHVybiB1bndyYXA7XG5cdHRyeSB7XG5cdFx0dW53cmFwW1N5bWJvbC5vYnNlcnZhYmxlXSA9IHNlbGY/LmNvbXBhdGlibGU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRjb25zb2xlLndhcm4oXCJVbmFibGUgdG8gYXNzaWduIDxbU3ltYm9sLm9ic2VydmFibGVdPiwgb2JqZWN0IHdpbGwgbm90IG9ic2VydmFibGUgYnkgb3RoZXIgZnJhbWV3b3Jrc1wiKTtcblx0fVxuXHR1bndyYXBbJGFmZmVjdGVkXSA9IChjYiwgcHJvcCwgb3B0aW9ucykgPT4ge1xuXHRcdGNvbnN0IG9ic2VydmFibGUgPSB1bndyYXA/LltTeW1ib2w/Lm9ic2VydmFibGVdO1xuXHRcdG9ic2VydmFibGU/LigpPy5hZmZlY3RlZD8uKGNiLCBwcm9wLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gKCkgPT4gb2JzZXJ2YWJsZT8uKCk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH07XG5cdHJldHVybiB1bndyYXA7XG59O1xudmFyIHNwZWNpYWxpemVkU3Vic2NyaWJlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgY2hlY2tWYWxpZE9iaiA9IChvYmopID0+IHtcblx0aWYgKHR5cGVvZiBvYmogPT0gXCJzeW1ib2xcIiB8fCBvYmogPT0gbnVsbCB8fCAhKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikpIHJldHVybjtcblx0cmV0dXJuIG9iajtcbn07XG52YXIgaW5pdGlhbFRyaWdnZXIgPSBcImluaXRpYWxcIjtcbnZhciByZWFsUHJvcE9mID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCBwcm9wID0gdGFyZ2V0Py5bJHJlYWxQcm9wXSA/PyB0YXJnZXQ/LnJlYWxQcm9wO1xuXHRyZXR1cm4gaXNLZXlUeXBlKHByb3ApID8gcHJvcCA6IG51bGw7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mKHRhcmdldCk7XG5cdGlmIChyZWFsUHJvcCAhPSBudWxsICYmIChwcm9wID09IG51bGwgfHwgcHJvcCA9PSBcInZhbHVlXCIpKSByZXR1cm4gcmVhbFByb3A7XG5cdHJldHVybiBwcm9wO1xufTtcbnZhciBwcm9wVmFsdWVPZiA9ICh0YXJnZXQsIHByb3ApID0+IHtcblx0aWYgKHByb3AgIT0gbnVsbCAmJiBwcm9wID09IHJlYWxQcm9wT2YodGFyZ2V0KSkgcmV0dXJuIHRhcmdldD8udmFsdWU7XG5cdHJldHVybiB0YXJnZXQ/Lltwcm9wXTtcbn07XG52YXIgY2FsbEJ5UHJvcFJlZkF3YXJlID0gKHRhcmdldCwgcHJvcCwgY2IsIGN0eCkgPT4ge1xuXHRpZiAocHJvcCAhPSBudWxsICYmIHByb3AgPT0gcmVhbFByb3BPZih0YXJnZXQpKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSBwcm9wVmFsdWVPZih0YXJnZXQsIHByb3ApO1xuXHRcdGlmICh2YWx1ZSAhPSBudWxsKSByZXR1cm4gY2I/Lih2YWx1ZSwgcHJvcCwgbnVsbCwgXCJzZXRcIik7XG5cdH1cblx0cmV0dXJuIGNhbGxCeVByb3AodGFyZ2V0LCBwcm9wLCBjYiwgY3R4KTtcbn07XG52YXIgd2l0aFRyaWdnZXIgPSAoY2IsIG9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKTtcblx0aWYgKHRyaWdnZXIgPT0gaW5pdGlhbFRyaWdnZXIpIHtcblx0XHRpZiAoIW5vcm1hbGl6ZWQudHJpZ2dlckltbWVkaWF0ZWx5KSByZXR1cm47XG5cdH0gZWxzZSBpZiAoIXRyaWdnZXJGaWx0ZXJBbGxvd3Mobm9ybWFsaXplZC5hZmZlY3RUeXBlcywgdHJpZ2dlcikpIHJldHVybjtcblx0cmV0dXJuICh2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIC4uLmV0YykgPT4gY2I/Lih2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG59O1xudmFyIHN1YnNjcmliZURpcmVjdGx5ID0gKHRhcmdldCwgcHJvcCwgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmICghdGFyZ2V0KSByZXR1cm47XG5cdGlmICghY2hlY2tWYWxpZE9iaih0YXJnZXQpKSByZXR1cm47XG5cdGNvbnN0IHRQcm9wID0gcHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IgPyBub3JtYWxpemVBZmZlY3RlZFByb3AodGFyZ2V0LCBwcm9wKSA6IG51bGw7XG5cdGxldCByZWdpc3RyeSA9IHRhcmdldD8uWyRyZWdpc3RyeUtleSRdID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHR0YXJnZXQgPSB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldDtcblx0c2NoZWR1bGVyPy55aWVsZD8uKCk/LnRoZW4/LigoKSA9PiB7XG5cdFx0Y29uc3QgaW5pdGlhbENiID0gd2l0aFRyaWdnZXIoY2IsIG9wdGlvbnMsIGluaXRpYWxUcmlnZ2VyKTtcblx0XHRpZiAoIWluaXRpYWxDYikgcmV0dXJuO1xuXHRcdGlmICh0UHJvcCAhPSBudWxsICYmIHRQcm9wICE9IFN5bWJvbC5pdGVyYXRvcikgY2FsbEJ5UHJvcFJlZkF3YXJlKHRhcmdldCwgdFByb3AsIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0ZWxzZSBjYWxsQnlBbGxQcm9wKHRhcmdldCwgaW5pdGlhbENiLCBudWxsKTtcblx0fSk7XG5cdGxldCB1blN1YiA9IHJlZ2lzdHJ5Py5hZmZlY3RlZD8uKGNiLCB0UHJvcCwgb3B0aW9ucyk7XG5cdGlmICh0YXJnZXQ/LltTeW1ib2wuZGlzcG9zZV0pIHJldHVybiB1blN1Yjtcblx0YWRkVG9DYWxsQ2hhaW4odW5TdWIsIFN5bWJvbC5kaXNwb3NlLCB1blN1Yik7XG5cdGFkZFRvQ2FsbENoYWluKHVuU3ViLCBTeW1ib2wuYXN5bmNEaXNwb3NlLCB1blN1Yik7XG5cdGFkZFRvQ2FsbENoYWluKHRhcmdldCwgU3ltYm9sLmRpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odGFyZ2V0LCBTeW1ib2wuYXN5bmNEaXNwb3NlLCB1blN1Yik7XG5cdHJldHVybiB1blN1Yjtcbn07XG52YXIgc3Vic2NyaWJlSW5wdXQgPSAodGcsIF8sIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKS5hZmZlY3RUeXBlcztcblx0Y29uc3QgJG9wdCA9IHt9O1xuXHRsZXQgb2xkVmFsdWUgPSB0Zz8udmFsdWU7XG5cdGNvbnN0ICRjYiA9IChldikgPT4ge1xuXHRcdGNvbnN0IHZhbHVlID0gZXY/LnRhcmdldD8udmFsdWU7XG5cdFx0aWYgKHRyaWdnZXJGaWx0ZXJBbGxvd3MoYWZmZWN0VHlwZXMsIFwic2V0XCIpKSBjYj8uKHZhbHVlLCBcInZhbHVlXCIsIG9sZFZhbHVlLCBcInNldFwiLCBldik7XG5cdFx0b2xkVmFsdWUgPSB2YWx1ZTtcblx0fTtcblx0dGc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImNoYW5nZVwiLCAkY2IsICRvcHQpO1xuXHRyZXR1cm4gKCkgPT4gdGc/LnJlbW92ZUV2ZW50TGlzdGVuZXI/LihcImNoYW5nZVwiLCAkY2IsICRvcHQpO1xufTtcbnZhciBjaGVja0lzUGFpcmVkID0gKHRnKSA9PiB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHRnKSAmJiB0Zz8ubGVuZ3RoID09IDIgJiYgY2hlY2tWYWxpZE9iaih0Zz8uWzBdKSAmJiAoaXNLZXlUeXBlKHRnPy5bMV0pIHx8IHRnPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKTtcbn07XG52YXIgaXNFZmZlY3RPcHRpb25zQXJnID0gKHZhbHVlKSA9PiB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAoXCJhZmZlY3RUeXBlc1wiIGluIHZhbHVlIHx8IFwidHJpZ2dlcnNcIiBpbiB2YWx1ZSB8fCBcInRyaWdnZXJJbW1lZGlhdGVseVwiIGluIHZhbHVlKTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0VGFyZ2V0cyA9ICh0YXJnZXRzKSA9PiB7XG5cdGlmICh0YXJnZXRzID09IG51bGwpIHJldHVybiBbXTtcblx0aWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0cykgJiYgIWNoZWNrSXNQYWlyZWQodGFyZ2V0cykgJiYgIWlzT2JzZXJ2YWJsZSh0YXJnZXRzKSkgcmV0dXJuIHRhcmdldHM7XG5cdHJldHVybiBbdGFyZ2V0c107XG59O1xudmFyIGVmZmVjdFRhcmdldENvbnRleHQgPSAoc291cmNlKSA9PiB7XG5cdGlmIChjaGVja0lzUGFpcmVkKHNvdXJjZSkpIHtcblx0XHRjb25zdCB0YXJnZXQgPSBzb3VyY2U/LlswXTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c291cmNlLFxuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0cHJvcDogbm9ybWFsaXplQWZmZWN0ZWRQcm9wKHRhcmdldCwgc291cmNlPy5bMV0pXG5cdFx0fTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdHNvdXJjZSxcblx0XHR0YXJnZXQ6IHNvdXJjZSxcblx0XHRwcm9wOiBudWxsXG5cdH07XG59O1xudmFyIHRvRWZmZWN0RXZlbnQgPSAoc291cmNlLCB0YXJnZXQsIHZhbHVlLCBwcm9wLCBvbGRWYWx1ZSwgdHJpZ2dlciwgYXJncykgPT4gKHtcblx0c291cmNlLFxuXHR0YXJnZXQsXG5cdHZhbHVlLFxuXHRwcm9wLFxuXHRuYW1lOiBwcm9wLFxuXHRvbGRWYWx1ZSxcblx0dHJpZ2dlcixcblx0YXJnc1xufSk7XG52YXIgc3Vic2NyaWJlUGFpcmVkID0gKHRnLCBfLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgcHJvcCA9IGlzS2V5VHlwZSh0Zz8uWzFdKSA/IHRnPy5bMV0gOiBudWxsO1xuXHRyZXR1cm4gYWZmZWN0ZWQodGc/LlswXSwgcHJvcCwgY2IsIG9wdGlvbnMpO1xufTtcbnZhciBzdWJzY3JpYmVUaGVuYWJsZSA9IChvYmosIHByb3AsIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRyZXR1cm4gb2JqPy50aGVuPy4oKG9iaikgPT4gYWZmZWN0ZWQ/LihvYmosIHByb3AsIGNiLCBvcHRpb25zKSk/LmNhdGNoPy4oKGUpID0+IHtcblx0XHRjb25zb2xlLndhcm4oZSk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH0pO1xufTtcbnZhciBhZmZlY3RlZCA9IChvYmosIHByb3AsIGNiID0gKCkgPT4ge30sIG9wdGlvbnMpID0+IHtcblx0bGV0IGtleSA9IG51bGw7XG5cdGlmICh0eXBlb2YgcHJvcCA9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRvcHRpb25zID0gY2I7XG5cdFx0Y2IgPSBwcm9wO1xuXHR9IGVsc2Uga2V5ID0gbm9ybWFsaXplQWZmZWN0ZWRQcm9wKG9iaiwgcHJvcCk7XG5cdGlmICh0eXBlb2YgY2IgPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KGNiKSkge1xuXHRcdG9wdGlvbnMgPSBjYjtcblx0XHRjYiA9ICgpID0+IHt9O1xuXHR9XG5cdGlmIChpc1ByaW1pdGl2ZShvYmopIHx8IHR5cGVvZiBvYmogPT0gXCJzeW1ib2xcIikge1xuXHRcdGlmIChub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucykudHJpZ2dlckltbWVkaWF0ZWx5KSByZXR1cm4gUHJvbWlzZWQoZ2xvYmFsVGhpcz8uUHJvbWlzZT8udHJ5Py4oKCkgPT4ge1xuXHRcdFx0cmV0dXJuIGNiPy4ob2JqLCBudWxsLCBudWxsLCBudWxsLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0fSkpO1xuXHR9XG5cdGlmICh0eXBlb2Ygb2JqPy5bJGFmZmVjdGVkXSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBvYmo/LlskYWZmZWN0ZWRdPy4oY2IsIGtleSwgb3B0aW9ucyk7XG5cdGVsc2UgaWYgKGNoZWNrVmFsaWRPYmoob2JqKSkge1xuXHRcdGNvbnN0IHdyYXBwZWQgPSBvYmo7XG5cdFx0aWYgKHNwZWNpYWxpemVkU3Vic2NyaWJlPy5oYXM/LihvYmogPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iaikpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0Py4ob2JqKT8uKHdyYXBwZWQsIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdGlmIChpc09ic2VydmFibGUod3JhcHBlZCkgfHwgY2hlY2tJc1BhaXJlZChvYmopICYmIGlzT2JzZXJ2YWJsZShvYmo/LlswXSkpIHtcblx0XHRcdGlmIChpc1RoZW5hYmxlKG9iaikpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZVRoZW5hYmxlKT8uKG9iaiwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIGlmIChjaGVja0lzUGFpcmVkKG9iaikpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZVBhaXJlZCk/LihvYmosIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIEhUTUxJbnB1dEVsZW1lbnQgIT0gXCJ1bmRlZmluZWRcIiAmJiBvYmogaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVJbnB1dCk/LihvYmosIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdFx0ZWxzZSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVEaXJlY3RseSk/Lih3cmFwcGVkLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgaW5pdGlhbENiID0gd2l0aFRyaWdnZXIoY2IsIG9wdGlvbnMsIGluaXRpYWxUcmlnZ2VyKTtcblx0XHRcdGlmICghaW5pdGlhbENiKSByZXR1cm47XG5cdFx0XHRyZXR1cm4gUHJvbWlzZWQoZ2xvYmFsVGhpcz8uUHJvbWlzZT8udHJ5Py4oKCkgPT4ge1xuXHRcdFx0XHRpZiAoY2hlY2tJc1BhaXJlZChvYmopKSByZXR1cm4gY2FsbEJ5UHJvcFJlZkF3YXJlPy4ob2JqPy5bMF0sIG9iaj8uWzFdLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0XHRlbHNlIGlmIChrZXkgIT0gbnVsbCAmJiBrZXkgIT0gU3ltYm9sLml0ZXJhdG9yKSByZXR1cm4gY2FsbEJ5UHJvcFJlZkF3YXJlPy4ob2JqLCBrZXksIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgcmV0dXJuIGNhbGxCeUFsbFByb3A/LihvYmosIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHR9XG59O1xuZnVuY3Rpb24gZWZmZWN0KGNiLCB0YXJnZXRzLCBvcHRpb25zKSB7XG5cdGlmIChjYiA9PSBudWxsIHx8IHR5cGVvZiBjYiAhPSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0aWYgKGlzRWZmZWN0T3B0aW9uc0FyZyh0YXJnZXRzKSAmJiBvcHRpb25zID09PSB2b2lkIDApIHJldHVybiBlZmZlY3RHbG9iYWxseShjYiwgdGFyZ2V0cyk7XG5cdGlmICh0YXJnZXRzID09IG51bGwpIHJldHVybiBlZmZlY3RHbG9iYWxseShjYiwgb3B0aW9ucyk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVFZmZlY3RPcHRpb25zKG9wdGlvbnMpO1xuXHRjb25zdCBhZmZlY3RlZE9wdGlvbnMgPSB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZWQuYWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBub3JtYWxpemVkLnRyaWdnZXJJbW1lZGlhdGVseVxuXHR9O1xuXHRjb25zdCBkaXNwb3NlcnMgPSBub3JtYWxpemVFZmZlY3RUYXJnZXRzKHRhcmdldHMpLm1hcCgoc291cmNlKSA9PiB7XG5cdFx0Y29uc3QgY3R4ID0gZWZmZWN0VGFyZ2V0Q29udGV4dChzb3VyY2UpO1xuXHRcdHJldHVybiBhZmZlY3RlZChjdHgudGFyZ2V0LCBjdHgucHJvcCwgKHZhbHVlLCBwcm9wLCBvbGRWYWx1ZSwgdHJpZ2dlciwgLi4uYXJncykgPT4ge1xuXHRcdFx0cmV0dXJuIGNiKHRvRWZmZWN0RXZlbnQoY3R4LnNvdXJjZSwgY3R4LnRhcmdldCwgdmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyID8/IG51bGwsIGFyZ3MpKTtcblx0XHR9LCBhZmZlY3RlZE9wdGlvbnMpO1xuXHR9KS5maWx0ZXIoKGRpc3Bvc2UpID0+IHR5cGVvZiBkaXNwb3NlID09IFwiZnVuY3Rpb25cIik7XG5cdHJldHVybiAoKSA9PiBkaXNwb3NlcnMuZm9yRWFjaCgoZGlzcG9zZSkgPT4gZGlzcG9zZT8uKCkpO1xufVxuZnVuY3Rpb24gZWZmZWN0ZWQodGFyZ2V0cywgY2IsIG9wdGlvbnMpIHtcblx0cmV0dXJuIGVmZmVjdChjYiwgdGFyZ2V0cywgb3B0aW9ucyk7XG59XG52YXIgbWFrZUFycmF5T2JzZXJ2YWJsZSA9ICh0ZykgPT4ge1xuXHRpZiAodGcgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBvYnNlcnZhYmxlQnlTZXQodGcpO1xuXHRpZiAodGcgaW5zdGFuY2VvZiBNYXApIHJldHVybiBvYnNlcnZhYmxlQnlNYXAodGcpO1xuXHRyZXR1cm4gdGc7XG59O1xudmFyIERvdWJsZVdlYWtNYXAgPSBjbGFzcyB7XG5cdCN0b3AgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0I2Vuc3VyZUlubmVyKGtleTEpIHtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBudWxsO1xuXHRcdGxldCBpbm5lciA9IHRoaXMuI3RvcC5nZXQoa2V5MSk7XG5cdFx0aWYgKCFpbm5lcikge1xuXHRcdFx0aW5uZXIgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0XHRcdHRoaXMuI3RvcC5zZXQoa2V5MSwgaW5uZXIpO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5uZXI7XG5cdH1cblx0I3NwbGl0UGFpcihwYWlyKSB7XG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHBhaXIpIHx8IHBhaXIubGVuZ3RoICE9PSAyKSByZXR1cm4gW251bGwsIG51bGxdO1xuXHRcdHJldHVybiBwYWlyO1xuXHR9XG5cdGhhc0wxKGtleTEpIHtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmhhcyhrZXkxKTtcblx0fVxuXHRzZXQocGFpciwgdmFsdWUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdGhpcztcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdGdldChwYWlyKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHZvaWQgMDtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmdldChrZXkxKT8uZ2V0KGtleTIpO1xuXHR9XG5cdGhhcyhwYWlyKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZ2V0KGtleTEpPy5oYXMoa2V5MikgPz8gZmFsc2U7XG5cdH1cblx0ZGVsZXRlKHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiN0b3AuZ2V0KGtleTEpO1xuXHRcdHJldHVybiBpbm5lciA/IGlubmVyLmRlbGV0ZShrZXkyKSA6IGZhbHNlO1xuXHR9XG5cdGRlbGV0ZVRvcChrZXkxKSB7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5kZWxldGUoa2V5MSk7XG5cdH1cblx0Z2V0T3JDcmVhdGUocGFpciwgZmFjdG9yeSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWN0b3J5Py4oKTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGNvbnN0IHZhbHVlID0gZmFjdG9yeSgpO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cdGdldE9ySW5zZXJ0KHBhaXIsIHZhbHVlKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHZhbHVlO1xuXHRcdGlmIChpbm5lci5oYXMoa2V5MikpIHJldHVybiBpbm5lci5nZXQoa2V5Mik7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblx0Z2V0T3JJbnNlcnRDb21wdXRlZChwYWlyLCBjb21wdXRlKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbXB1dGU/Lihba2V5MSwga2V5Ml0pO1xuXHRcdGlmIChpbm5lci5oYXMoa2V5MikpIHJldHVybiBpbm5lci5nZXQoa2V5Mik7XG5cdFx0Y29uc3QgdmFsdWUgPSBjb21wdXRlKFtrZXkxLCBrZXkyXSk7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cbn07XG52YXIgcmVnaXN0ZXJlZEl0ZXJhdGVkID0gbmV3IERvdWJsZVdlYWtNYXAoKTtcbmZ1bmN0aW9uIGl0ZXJhdGVkKHRnLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pIHtcblx0aWYgKCF0ZykgcmV0dXJuO1xuXHRpZiAodHlwZW9mIHRnICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiB0ZyAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGlmIChyZWdpc3RlcmVkSXRlcmF0ZWQuaGFzKFt0ZywgY2JdKSkgcmV0dXJuIHJlZ2lzdGVyZWRJdGVyYXRlZC5nZXQoW3RnLCBjYl0pO1xuXHRjb25zdCAkc3ViID0gKHZhbHVlLCBuYW1lLCBvbGQsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAobmFtZSA9PSBcInZhbHVlXCIpIHtcblx0XHRcdGNvbnN0IGVudHJpZXMgPSAob2xkPy52YWx1ZSA/PyBvbGQpPy5lbnRyaWVzPy4oKTtcblx0XHRcdGNvbnN0IGJhc2lzID0gdGc/LnZhbHVlID8/IHZhbHVlPy52YWx1ZSA/PyB2YWx1ZTtcblx0XHRcdGlmIChlbnRyaWVzKSBmb3IgKGNvbnN0IFtpZHgsIGl0ZW1dIG9mIGVudHJpZXMpIHtcblx0XHRcdFx0Y29uc3Qgb2ZPbGQgPSBpdGVtID8/IChvbGQ/LnZhbHVlID8/IG9sZCk/LltpZHhdID8/IG51bGw7XG5cdFx0XHRcdGNvbnN0IG9mTmV3ID0gYmFzaXM/LltpZHhdO1xuXHRcdFx0XHRpZiAob2ZPbGQgPT0gbnVsbCAmJiBvZk5ldyAhPSBudWxsKSBjYihvZk5ldywgaWR4LCBudWxsLCBcImFkZFwiKTtcblx0XHRcdFx0ZWxzZSBpZiAob2ZPbGQgIT0gbnVsbCAmJiBvZk5ldyA9PSBudWxsKSBjYihudWxsLCBpZHgsIG9mT2xkLCBcImRlbGV0ZVwiKTtcblx0XHRcdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChvZk9sZCwgb2ZOZXcpKSBjYihvZk5ldywgaWR4LCBvZk9sZCwgXCJzZXRcIik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaXRlcmF0ZWQodmFsdWUgPz8gdGc/LnZhbHVlLCBjYiwgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdHJldHVybiBuYW1lID09IG51bGwgPyB2b2lkIDAgOiB0Z1tuYW1lXTtcblx0fTtcblx0cmV0dXJuIHJlZ2lzdGVyZWRJdGVyYXRlZC5nZXRPckluc2VydENvbXB1dGVkKFt0ZywgY2JdLCAoKSA9PiB7XG5cdFx0aWYgKHRnIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gYWZmZWN0ZWQoW29ic2VydmFibGVCeVNldCh0ZyksIFN5bWJvbC5pdGVyYXRvcl0sIGNiLCBvcHRpb25zKTtcblx0XHRpZiAodGcgaW5zdGFuY2VvZiBNYXApIHJldHVybiBhZmZlY3RlZCh0ZywgY2IsIG9wdGlvbnMpO1xuXHRcdGlmIChoYXNWYWx1ZSh0ZykpIHJldHVybiBhZmZlY3RlZCh0ZywgJHN1Yiwgb3B0aW9ucyk7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodGcpICYmICEodGc/Lmxlbmd0aCA9PSAyICYmIGlzS2V5VHlwZSh0Zz8uWzFdKSAmJiBpc09ic2VydmFibGUodGc/LlswXSkpKSByZXR1cm4gYWZmZWN0ZWQoW3RnLCBTeW1ib2wuaXRlcmF0b3JdLCBjYiwgb3B0aW9ucyk7XG5cdFx0cmV0dXJuIGFmZmVjdGVkKHRnLCBjYiwgb3B0aW9ucyk7XG5cdH0pO1xufVxuZnVuY3Rpb24gdW5hZmZlY3RlZCh0ZywgY2IpIHtcblx0cmV0dXJuIHdpdGhQcm9taXNlKHRnLCAodGFyZ2V0KSA9PiB7XG5cdFx0Y29uc3QgaXNQYWlyID0gQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmIHRhcmdldD8ubGVuZ3RoID09IDIgJiYgW1wib2JqZWN0XCIsIFwiZnVuY3Rpb25cIl0uaW5kZXhPZih0eXBlb2YgdGFyZ2V0Py5bMF0pID49IDAgJiYgaXNLZXlUeXBlKHRhcmdldD8uWzFdKTtcblx0XHRjb25zdCBwcm9wID0gaXNQYWlyID8gdGFyZ2V0Py5bMV0gOiBudWxsO1xuXHRcdHRhcmdldCA9IGlzUGFpciAmJiBwcm9wICE9IG51bGwgPyB0YXJnZXQ/LlswXSA/PyB0YXJnZXQgOiB0YXJnZXQ7XG5cdFx0Y29uc3QgdW53cmFwID0gdHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiID8gdGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSA/PyB0YXJnZXQgOiB0YXJnZXQ7XG5cdFx0KHRhcmdldD8uWyRyZWdpc3RyeUtleSRdID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh1bndyYXApKT8udW5hZmZlY3RlZD8uKGNiLCBwcm9wKTtcblx0fSk7XG59XG52YXIgYmluZEJ5ID0gKHRhcmdldCwgcmVhY3RpdmUsIHdhdGNoKSA9PiB7XG5cdGFmZmVjdGVkKHJlYWN0aXZlLCBudWxsLCAodiwgcCkgPT4ge1xuXHRcdG9iamVjdEFzc2lnbih0YXJnZXQsIHYsIHAsIHRydWUpO1xuXHR9KTtcblx0d2F0Y2g/LigoKSA9PiB0YXJnZXQsIChOKSA9PiB7XG5cdFx0Zm9yIChjb25zdCBrIGluIE4pIG9iamVjdEFzc2lnbihyZWFjdGl2ZSwgTltrXSwgaywgdHJ1ZSk7XG5cdH0sIHsgZGVlcDogdHJ1ZSB9KTtcblx0cmV0dXJuIHRhcmdldDtcbn07XG52YXIgZGVyaXZhdGUgPSAoZnJvbSwgcmVhY3RGbiwgd2F0Y2gpID0+IGJpbmRCeShyZWFjdEZuKHNhZmUoZnJvbSkpLCBmcm9tLCB3YXRjaCk7XG52YXIgYmluZEJ5S2V5ID0gKHRhcmdldCwgcmVhY3RpdmUsIGtleSA9ICgpID0+IFwiXCIpID0+IGFmZmVjdGVkKHJlYWN0aXZlLCBudWxsLCAodmFsdWUsIHApID0+IHtcblx0aWYgKHAgPT0ga2V5KCkpIG9iamVjdEFzc2lnbih0YXJnZXQsIHZhbHVlLCBudWxsLCB0cnVlKTtcbn0pO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9Bc3NpZ25lZC50c1xudmFyIGNvbmRpdGlvbmFsSW5kZXggPSAoY29uZExpc3QgPSBbXSkgPT4ge1xuXHRjb25zdCBzb3VyY2UgPSBvYnNlcnZlKHsgdmFsdWU6IDAgfSk7XG5cdGNvbnN0IHJlYWRDb25kaXRpb24gPSAoY29uZGl0aW9uKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBjb25kaXRpb24gPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY29uZGl0aW9uKCk7XG5cdFx0cmV0dXJuIGhhc1ZhbHVlKGNvbmRpdGlvbikgPyBjb25kaXRpb24udmFsdWUgOiBjb25kaXRpb247XG5cdH07XG5cdGNvbnN0IGV2YWx1YXRlID0gKCkgPT4gY29uZExpc3QuZmluZEluZGV4KChjb25kaXRpb24pID0+ICEhcmVhZENvbmRpdGlvbihjb25kaXRpb24pKTtcblx0Y29uc3QgcmVzdWx0ID0gY29tcHV0ZWQoW3NvdXJjZSwgXCJ2YWx1ZVwiXSwgZXZhbHVhdGUsIFwidmFsdWVcIik7XG5cdGNvbnN0IGludmFsaWRhdGUgPSAoKSA9PiB7XG5cdFx0c291cmNlLnZhbHVlKys7XG5cdH07XG5cdGNvbnN0IGRpc3Bvc2VycyA9IFtdO1xuXHRpZiAoaXNPYnNlcnZhYmxlKGNvbmRMaXN0KSkgZGlzcG9zZXJzLnB1c2goYWZmZWN0ZWQoY29uZExpc3QsIGludmFsaWRhdGUsIHtcblx0XHRhZmZlY3RUeXBlczogW1xuXHRcdFx0XCJhZGRcIixcblx0XHRcdFwic2V0XCIsXG5cdFx0XHRcImRlbGV0ZVwiXG5cdFx0XSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IGZhbHNlXG5cdH0pKTtcblx0Zm9yIChjb25zdCBjb25kaXRpb24gb2YgY29uZExpc3QpIGlmIChoYXNWYWx1ZShjb25kaXRpb24pKSBkaXNwb3NlcnMucHVzaChhZmZlY3RlZChbY29uZGl0aW9uLCBcInZhbHVlXCJdLCBpbnZhbGlkYXRlLCB7XG5cdFx0YWZmZWN0VHlwZXM6IFtcInNldHRlclwiXSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IGZhbHNlXG5cdH0pKTtcblx0YWRkVG9DYWxsQ2hhaW4ocmVzdWx0LCBTeW1ib2wuZGlzcG9zZSwgKCkgPT4gZGlzcG9zZXJzLmZvckVhY2goKGRpc3Bvc2UpID0+IGRpc3Bvc2U/LigpKSk7XG5cdHJldHVybiByZXN1bHQ7XG59O1xudmFyIGNvbmRpdGlvbmFsUmVmID0gKGNvbmQsIGlmVHJ1ZSwgaWZGYWxzZSwgYmVoYXZpb3IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKGNvbmQpKSByZXR1cm4gY29uZCA/IGlmVHJ1ZSA6IGlmRmFsc2U7XG5cdGNvbnN0IGdldFRydWUgPSAoKSA9PiB7XG5cdFx0cmV0dXJuIGlmVHJ1ZTtcblx0fTtcblx0Y29uc3QgZ2V0RmFsc2UgPSAoKSA9PiB7XG5cdFx0cmV0dXJuIGlmRmFsc2U7XG5cdH07XG5cdGNvbnN0IHZhbHVlT2YgPSAobikgPT4ge1xuXHRcdGlmIChuICE9IG51bGwpIGNvbmQudmFsdWUgPSBoYXNWYWx1ZShuKSA/IG4/LnZhbHVlIDogbjtcblx0XHRyZXR1cm4gKGhhc1ZhbHVlKGNvbmQpID8gY29uZD8udmFsdWUgOiBjb25kKSA/IGdldFRydWUoKSA6IGdldEZhbHNlKCk7XG5cdH07XG5cdGNvbnN0IHIgPSBvYnNlcnZlKHtcblx0XHRbJHZhbHVlXTogdmFsdWVPZigpLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQodmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gdmFsdWVPZih2KTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gPSB2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdO1xuXHRcdH1cblx0fSk7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKFtjb25kLCBcInZhbHVlXCJdLCAoKSA9PiB7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSByPy5bJHZhbHVlXTtcblx0XHRjb25zdCB2YWx1ZSA9IHZhbHVlT2YoKTtcblx0XHRyWyR2YWx1ZV0gPSB2YWx1ZTtcblx0XHRyPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcjogXCJtYW51YWxcIlxuXHRcdH0pO1xuXHR9KTtcblx0YWRkVG9DYWxsQ2hhaW4ociwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiByO1xufTtcbnZhciBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsUmVmO1xudmFyIHJlbWFwID0gKHN1YiwgY2IsIGRlc3QpID0+IHtcblx0aWYgKCFkZXN0KSBkZXN0ID0gb2JzZXJ2ZSh7fSk7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKHN1YiwgKHZhbHVlLCBwcm9wLCBvbGQpID0+IHtcblx0XHRpZiAocHJvcCA9PSBudWxsKSByZXR1cm47XG5cdFx0Y29uc3QgZ290ID0gY2I/Lih2YWx1ZSwgcHJvcCwgb2xkKTtcblx0XHRpZiAodHlwZW9mIGdvdCA9PSBcIm9iamVjdFwiKSBvYmplY3RBc3NpZ25Ob3RFcXVhbChkZXN0LCBnb3QpO1xuXHRcdGVsc2UgaWYgKGlzTm90RXF1YWwoZGVzdFtwcm9wXSwgZ290KSkgZGVzdFtwcm9wXSA9IGdvdDtcblx0fSk7XG5cdGlmIChkZXN0KSBhZGRUb0NhbGxDaGFpbihkZXN0LCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIGRlc3Q7XG59O1xudmFyIHVuaWZpZWQgPSAoLi4uc3VicykgPT4ge1xuXHRjb25zdCBkZXN0ID0gb2JzZXJ2ZSh7fSk7XG5cdHN1YnM/LmZvckVhY2g/Ligoc3ViKSA9PiBhZmZlY3RlZChzdWIsICh2YWx1ZSwgcHJvcCwgXykgPT4ge1xuXHRcdGlmIChwcm9wID09IG51bGwpIHJldHVybjtcblx0XHRpZiAoaXNOb3RFcXVhbChkZXN0W3Byb3BdLCB2YWx1ZSkpIGRlc3RbcHJvcF0gPSB2YWx1ZTtcblx0fSkpO1xuXHRyZXR1cm4gZGVzdDtcbn07XG52YXIgb2JzZXJ2YWJsZUJ5U2V0ID0gKHNldCkgPT4ge1xuXHRjb25zdCBvYnMgPSBvYnNlcnZlKFtdKTtcblx0b2JzLnB1c2goLi4uQXJyYXkuZnJvbShzZXQ/LnZhbHVlcz8uKCkgfHwgW10pKTtcblx0YWRkVG9DYWxsQ2hhaW4ob2JzLCBTeW1ib2wuZGlzcG9zZSwgYWZmZWN0ZWQoc2V0LCAodmFsdWUsIF8sIG9sZCkgPT4ge1xuXHRcdGlmIChpc05vdEVxdWFsKHZhbHVlLCBvbGQpKSB7XG5cdFx0XHRpZiAob2xkID09IG51bGwgJiYgdmFsdWUgIT0gbnVsbCkgb2JzLnB1c2godmFsdWUpO1xuXHRcdFx0ZWxzZSBpZiAob2xkICE9IG51bGwgJiYgdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRjb25zdCBpZHggPSBvYnMuaW5kZXhPZihvbGQpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDApIG9icy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGlkeCA9IG9icy5pbmRleE9mKG9sZCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCAmJiBpc05vdEVxdWFsKG9ic1tpZHhdLCB2YWx1ZSkpIG9ic1tpZHhdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KSk7XG5cdHJldHVybiBvYnM7XG59O1xudmFyIG9ic2VydmFibGVCeU1hcCA9IChtYXApID0+IHtcblx0Y29uc3Qgb2JzID0gb2JzZXJ2ZShbXSk7XG5cdGNvbnN0IGluaXRpYWxFbnRyaWVzID0gQXJyYXkuZnJvbShtYXAuZW50cmllcygpKTtcblx0b2JzLnB1c2goLi4uaW5pdGlhbEVudHJpZXMpO1xuXHRhZGRUb0NhbGxDaGFpbihvYnMsIFN5bWJvbC5kaXNwb3NlLCBhZmZlY3RlZChtYXAsICh2YWx1ZSwgcHJvcCwgb2xkKSA9PiB7XG5cdFx0aWYgKGlzTm90RXF1YWwodmFsdWUsIG9sZCkgfHwgb2xkID09IG51bGwgJiYgdmFsdWUgIT0gbnVsbCB8fCBvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRpZiAob2xkICE9IG51bGwgJiYgdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRsZXQgaWR4ID0gb2JzLmZpbmRJbmRleCgoW25hbWUsIF9dKSA9PiBuYW1lID09IHByb3ApO1xuXHRcdFx0XHRpZiAoaWR4IDwgMCkgaWR4ID0gb2JzLmZpbmRMYXN0SW5kZXgoKFtfLCB2YWxdKSA9PiBvbGQgPT09IHZhbCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCkgb2JzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGlkeCA9IG9icy5maW5kSW5kZXgoKFtuYW1lLCBfXSkgPT4gbmFtZSA9PSBwcm9wKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwICYmIGlkeCA8IG9icy5sZW5ndGgpIHtcblx0XHRcdFx0XHRpZiAoaXNOb3RFcXVhbChvYnNbaWR4XT8uWzFdLCB2YWx1ZSkpIG9ic1tpZHhdID0gW3Byb3AsIHZhbHVlXTtcblx0XHRcdFx0fSBlbHNlIG9icy5wdXNoKFtwcm9wLCB2YWx1ZV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkpO1xuXHRyZXR1cm4gb2JzO1xufTtcbnZhciBhc3NpZ25NYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBhc3NpZ24gPSAoYSwgYiwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRjb25zdCBpc0FDb21wdXRlID0gdHlwZW9mIGE/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgYT8ubGVuZ3RoID09IDIsIGlzQkNvbXB1dGUgPSB0eXBlb2YgYj8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBiPy5sZW5ndGggPT0gMiwgY21wQkZuYyA9IGlzQkNvbXB1dGUgPyBiPy5bMV0gOiBudWxsO1xuXHRjb25zdCBpc0FQcm9wID0gKGlzS2V5VHlwZShhPy5bMV0pIHx8IGE/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpICYmIGE/Lmxlbmd0aCA9PSAyO1xuXHRsZXQgYV9wcm9wID0gaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSA/IGE/LlsxXSA6IEFycmF5LmlzQXJyYXkoYSkgPyBudWxsIDogcHJvcDtcblx0aWYgKCFpc0FQcm9wICYmICFpc0FDb21wdXRlKSBhID0gW2EsIGFfcHJvcF07XG5cdGlmIChpc0FDb21wdXRlKSBhWzFdID0gYV9wcm9wO1xuXHRjb25zdCBpc0JQcm9wID0gKGlzS2V5VHlwZShiPy5bMV0pIHx8IGI/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpICYmIGI/Lmxlbmd0aCA9PSAyO1xuXHRsZXQgYl9wcm9wID0gaXNCUHJvcCAmJiAhaXNCQ29tcHV0ZSA/IGI/LlsxXSA6IEFycmF5LmlzQXJyYXkoYikgPyBudWxsIDogcHJvcDtcblx0aWYgKCFpc0JQcm9wICYmICFpc0JDb21wdXRlKSBiID0gW2IsIGJfcHJvcF07XG5cdGlmIChpc0JDb21wdXRlKSBiWzFdID0gYl9wcm9wO1xuXHRpZiAoYV9wcm9wID09IG51bGwgfHwgYl9wcm9wID09IG51bGwgfHwgaXNBcnJheUludmFsaWRLZXkoYV9wcm9wLCBhPy5bMF0pIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGJfcHJvcCwgYj8uWzBdKSkgcmV0dXJuO1xuXHRpZiAoISgodHlwZW9mIGI/LlswXSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBiPy5bMF0gPT0gXCJmdW5jdGlvblwiKSAmJiBiPy5bMF0gIT0gbnVsbCkgJiYgIUFycmF5LmlzQXJyYXkoYVswXSkpIHtcblx0XHQkYXZvaWRUcmlnZ2VyKGIsICgpID0+IHtcblx0XHRcdGFbMF1bYV9wcm9wXSA9IGI/LlswXTtcblx0XHR9KTtcblx0XHRyZXR1cm4gKCkgPT4ge307XG5cdH1cblx0Y29uc3QgY29tcHV0ZSA9ICh2LCBwKSA9PiB7XG5cdFx0Y29uc3QgYV90bXAgPSBhUmVmPy5kZXJlZj8uKCk7XG5cdFx0Y29uc3QgYl90bXAgPSBiUmVmPy5kZXJlZj8uKCk7XG5cdFx0aWYgKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5nZXQ/LihhX3Byb3ApPy5ib3VuZCA9PSBiX3RtcCkge1xuXHRcdFx0bGV0IHZhbCA9IG51bGw7XG5cdFx0XHRjb25zdCBjbXBmeCA9IGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5nZXQ/LihhX3Byb3ApPy5jbXBmeDtcblx0XHRcdCRhdm9pZFRyaWdnZXIoYl90bXAsICgpID0+IHtcblx0XHRcdFx0aWYgKHR5cGVvZiBjbXBmeCA9PSBcImZ1bmN0aW9uXCIpIHZhbCA9IGNtcGZ4Py4oJGdldFZhbHVlKGJfdG1wKSA/PyB2LCBwLCBudWxsKTtcblx0XHRcdFx0ZWxzZSB2YWwgPSBiX3RtcD8uW3BdID8/IHY7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IG52ID0gJGdldFZhbHVlKHZhbCk7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbChhX3RtcFthX3Byb3BdLCBudikpICRhdm9pZFRyaWdnZXIoYl90bXAsICgpID0+IHtcblx0XHRcdFx0YV90bXBbYV9wcm9wXSA9IG52O1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlICgoYXNzaWduTWFwPy5nZXQ/LihhX3RtcCkpPy5nZXQ/LihhX3Byb3ApKT8uZGlzcG9zZT8uKCk7XG5cdH07XG5cdGNvbnN0IGRpc3Bvc2UgPSAoKSA9PiB7XG5cdFx0Y29uc3QgYV90bXAgPSBhUmVmPy5kZXJlZj8uKCk7XG5cdFx0Y29uc3QgbWFwID0gYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk7XG5cdFx0Y29uc3Qgc3RvcmUgPSBtYXA/LmdldD8uKGFfcHJvcCk7XG5cdFx0bWFwPy5kZWxldGU/LihhX3Byb3ApO1xuXHRcdHN0b3JlPy51bnN1Yj8uKCk7XG5cdH07XG5cdGNvbnN0IGJSZWYgPSBiPy5bMF0gIT0gbnVsbCAmJiAodHlwZW9mIGI/LlswXSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBiPy5bMF0gPT0gXCJmdW5jdGlvblwiKSAmJiAhKGI/LlswXSBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgdHlwZW9mIGI/LlswXT8uZGVyZWYgPT0gXCJmdW5jdGlvblwiKSA/IG5ldyBXZWFrUmVmKGI/LlswXSkgOiBiPy5bMF0sIGFSZWYgPSBhPy5bMF0gIT0gbnVsbCAmJiAodHlwZW9mIGE/LlswXSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBhPy5bMF0gPT0gXCJmdW5jdGlvblwiKSAmJiAhKGE/LlswXSBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgdHlwZW9mIGE/LlswXT8uZGVyZWYgPT0gXCJmdW5jdGlvblwiKSA/IG5ldyBXZWFrUmVmKGE/LlswXSkgOiBhPy5bMF07XG5cdGxldCBzdG9yZSA9IHtcblx0XHRjb21wdXRlLFxuXHRcdGRpc3Bvc2UsXG5cdFx0Y21wZng6IGNtcEJGbmNcblx0fTtcblx0Y29uc3QgYV90bXAgPSBhUmVmPy5kZXJlZj8uKCksIGJfdG1wID0gYlJlZj8uZGVyZWY/LigpO1xuXHRpZiAoYVJlZiBpbnN0YW5jZW9mIFdlYWtSZWYpIHtcblx0XHRpZiAoYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmJvdW5kICE9IGJfdG1wKSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZGVsZXRlPy4oYV9wcm9wKTtcblx0XHRzdG9yZSA9IChhc3NpZ25NYXA/LmdldE9ySW5zZXJ0Py4oYV90bXAsIC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCkpKT8uZ2V0T3JJbnNlcnRDb21wdXRlZD8uKGFfcHJvcCwgKCkgPT4gKHtcblx0XHRcdGJvdW5kOiBiX3RtcCxcblx0XHRcdGNtcGZ4OiBjbXBCRm5jLFxuXHRcdFx0dW5zdWI6IG51bGwsXG5cdFx0XHRjb21wdXRlLFxuXHRcdFx0ZGlzcG9zZVxuXHRcdH0pKTtcblx0XHRzdG9yZS51bnN1YiA9IGFmZmVjdGVkKGIsIGNvbXB1dGUpO1xuXHRcdHN0b3JlLmNtcGZ4ID0gY21wQkZuYztcblx0XHRhZGRUb0NhbGxDaGFpbihhX3RtcCwgU3ltYm9sLmRpc3Bvc2UsIHN0b3JlPy5kaXNwb3NlKTtcblx0XHRhZGRUb0NhbGxDaGFpbihiX3RtcCwgU3ltYm9sLmRpc3Bvc2UsIHN0b3JlPy5kaXNwb3NlKTtcblx0fVxuXHRpZiAoYl90bXAgJiYgIUFycmF5LmlzQXJyYXkoYl90bXApKSAkYXZvaWRUcmlnZ2VyKGFfdG1wLCAoKSA9PiB7XG5cdFx0Yl90bXBbYl9wcm9wXSA/Pz0gYV90bXA/LlthX3Byb3BdID8/IGJfdG1wW2JfcHJvcF07XG5cdH0pO1xuXHRyZXR1cm4gc3RvcmU/LmRpc3Bvc2U7XG59O1xudmFyIGxpbmsgPSAoYSwgYiwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRjb25zdCB1c3ViID0gW2Fzc2lnbihhLCBiLCBwcm9wKSwgYXNzaWduKGIsIGEsIHByb3ApXTtcblx0cmV0dXJuICgpID0+IHVzdWI/Lm1hcD8uKChjKSA9PiBjPy4oKSk7XG59O1xudmFyIGNvbXB1dGVkID0gKHNyYywgY2IsIGJlaGF2aW9yLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IGlzQUNvbXB1dGUgPSB0eXBlb2Ygc3JjPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIHNyYz8ubGVuZ3RoID09IDI7XG5cdGNvbnN0IGlzQVByb3AgPSAoaXNLZXlUeXBlKHNyYz8uWzFdKSB8fCBzcmM/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpICYmIHNyYz8ubGVuZ3RoID09IDI7XG5cdGxldCBhX3Byb3AgPSBpc0FQcm9wICYmICFpc0FDb21wdXRlID8gc3JjPy5bMV0gOiBBcnJheS5pc0FycmF5KHNyYykgPyBudWxsIDogcHJvcDtcblx0aWYgKCFpc0FQcm9wICYmICFpc0FDb21wdXRlKSBzcmMgPSBbaXNBUHJvcCA/IHNyYz8uWzBdIDogc3JjLCBhX3Byb3BdO1xuXHRpZiAoaXNBQ29tcHV0ZSkgc3JjWzFdID0gYV9wcm9wO1xuXHRpZiAoYV9wcm9wID09IG51bGwgfHwgaXNBcnJheUludmFsaWRLZXkoYV9wcm9wLCBzcmM/LlswXSkpIHJldHVybjtcblx0bGV0IG9sZFZhbHVlID0gdm9pZCAwO1xuXHRsZXQgb2xkQXJnID0gdm9pZCAwO1xuXHRjb25zdCBjbXAgPSAoYXJnLCBmb3JjZSkgPT4ge1xuXHRcdGFyZyA/Pz0gc3JjPy5bMF0/LlthX3Byb3BdID8/IG9sZEFyZyA/PyBhcmc7XG5cdFx0aWYgKGZvcmNlIHx8IGlzTm90RXF1YWwob2xkQXJnLCBhcmcpICYmIGFyZyAhPSB2b2lkIDAgfHwgb2xkVmFsdWUgPT0gdm9pZCAwKSB7XG5cdFx0XHRsZXQgbnYgPSBjYj8uKGFyZywgYV9wcm9wLCBvbGRBcmcpO1xuXHRcdFx0b2xkVmFsdWUgPSBudjtcblx0XHRcdHJldHVybiBudjtcblx0XHR9XG5cdFx0cmV0dXJuIG9sZFZhbHVlO1xuXHR9O1xuXHRjb25zdCB3cnBGdW5jID0gKGFyZywgcHJvcCA9IFwidmFsdWVcIiwgb2xkQXJnJCwgb3ApID0+IHtcblx0XHRvbGRBcmcgPSBvbGRBcmckID8/IG9sZEFyZztcblx0XHRhcmcgPz89IHNyYz8uWzBdPy5bYV9wcm9wXTtcblx0XHRpZiAoaXNOb3RFcXVhbChvbGRBcmcsIGFyZykgJiYgYXJnICE9IHZvaWQgMCB8fCBvbGRWYWx1ZSA9PSB2b2lkIDApIHtcblx0XHRcdGxldCBudiA9IGNiPy4oYXJnLCBhX3Byb3AsIG9sZEFyZywgb3ApO1xuXHRcdFx0b2xkQXJnID0gYXJnO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwobnYsIG9sZFZhbHVlKSB8fCBvbGRWYWx1ZSA9PSB2b2lkIDApIHtcblx0XHRcdFx0cmZbcHJvcF0gPSBvbGRWYWx1ZSA9IG52O1xuXHRcdFx0XHRvbGRWYWx1ZSA9IHJmW3Byb3BdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG52O1xuXHRcdH1cblx0XHRyZXR1cm4gcmZbcHJvcF07XG5cdH07XG5cdGNvbnN0IGluaXRpYWwgPSBjbXAoc3JjWzBdW2FfcHJvcF0gPz8gb2xkQXJnKTtcblx0Y29uc3QgcGVuZGluZ0luaXRpYWwgPSBpc1Byb21pc2UoaW5pdGlhbCk7XG5cdGNvbnN0ICRhcHBseSA9IFN5bWJvbC5mb3IoXCJAQGFwcGx5XCIpO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgJHByb21pc2UsIHtcblx0XHR2YWx1ZTogaW5pdGlhbCxcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICR2YWx1ZSwge1xuXHRcdHZhbHVlOiBpbml0aWFsLFxuXHRcdHdyaXRhYmxlOiB0cnVlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgJGJlaGF2aW9yLCB7XG5cdFx0dmFsdWU6IGJlaGF2aW9yLFxuXHRcdHdyaXRhYmxlOiB0cnVlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgU3ltYm9sPy50b1N0cmluZ1RhZywge1xuXHRcdHZhbHVlOiBTdHJpbmcod3JwRnVuY1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCIsXG5cdFx0d3JpdGFibGU6IGZhbHNlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgU3ltYm9sPy50b1ByaW1pdGl2ZSwge1xuXHRcdHZhbHVlOiB0cnlQYXJzZUJ5SGludCh3cnBGdW5jWyR2YWx1ZV0sIFwibnVtYmVyXCIpLFxuXHRcdHdyaXRhYmxlOiBmYWxzZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsIFwidmFsdWVcIiwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGNwID0gY21wKCk7XG5cdFx0XHRpZiAoY3AgIT0gbnVsbCkgd3JwRnVuY1skdmFsdWVdID0gY3A7XG5cdFx0XHRyZXR1cm4gd3JwRnVuY1skdmFsdWVdO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbihhcmcpIHtcblx0XHRcdHdycEZ1bmNbJHZhbHVlXSA9IGNtcChhcmcsIHRydWUpO1xuXHRcdH1cblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkYXBwbHksIHtcblx0XHR2YWx1ZTogKHYpID0+IHtcblx0XHRcdGlmICh2ID09IHZvaWQgMCkgcmV0dXJuIHJmPy52YWx1ZTtcblx0XHRcdHJmLnZhbHVlID0gdjtcblx0XHRcdHJldHVybiByZj8udmFsdWU7XG5cdFx0fSxcblx0XHR3cml0YWJsZTogZmFsc2Vcblx0fSk7XG5cdGNvbnN0IHJmID0gb2JzZXJ2ZSh3cnBGdW5jKTtcblx0Y29uc3Qgd3JpdGVDb21wdXRlZCA9ICh2YWx1ZSwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKCh2KSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHJmPy5bJHZhbHVlXTtcblx0XHRcdHJmWyR2YWx1ZV0gPSB2O1xuXHRcdFx0cmY/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0XHR2YWx1ZTogdixcblx0XHRcdFx0b2xkVmFsdWUsXG5cdFx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdjtcblx0XHR9KTtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHJmPy5bJHZhbHVlXTtcblx0XHRyZlskdmFsdWVdID0gdmFsdWU7XG5cdFx0cmY/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlLFxuXHRcdFx0b2xkVmFsdWUsXG5cdFx0XHR0cmlnZ2VyXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xuXHRpZiAocGVuZGluZ0luaXRpYWwpIHdyaXRlQ29tcHV0ZWQoaW5pdGlhbCwgXCJyZXNvbHZlZFwiKTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoW3NyYz8uWzBdID8/IHNyYywgYV9wcm9wID8/IFwidmFsdWVcIl0sICgpID0+IHtcblx0XHR3cml0ZUNvbXB1dGVkKGNtcCgpLCBcIm1hbnVhbFwiKTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHJmLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHJmO1xufTtcbnZhciBkZWxheWVkU3Vic2NyaWJlID0gKHJlZiwgY2IsIGRlbGF5ID0gMTAwKSA9PiB7XG5cdGxldCB0bTtcblx0cmV0dXJuIGFmZmVjdGVkKHJlZiwgXCJ2YWx1ZVwiLCAodikgPT4ge1xuXHRcdGlmICghdiAmJiB0bSkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRtKTtcblx0XHRcdHRtID0gbnVsbDtcblx0XHR9IGVsc2UgaWYgKHYgJiYgIXRtKSB0bSA9IHRyaWdnZXJXaXRoRGVsYXkocmVmLCBjYiwgZGVsYXkpID8/IHRtO1xuXHR9KTtcbn07XG5cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgJGFmZmVjdGVkLCAkcmVmLCAkcmVzb2x2ZWQsICR0cmlnZ2VyLCAkdHJpZ2dlckNvbnRyb2wsICR0cmlnZ2VyTGVzcywgJHRyaWdnZXJMb2NrLCBBc3NpZ25PYmplY3RIYW5kbGVyLCBEb3VibGVXZWFrTWFwLCBhZGRUb0NhbGxDaGFpbiwgYWZmZWN0ZWQsIGFzc2lnbiwgYXNzaWduTWFwLCBiaW5kQnksIGJpbmRCeUtleSwgYm9vbGVhblJlZiwgY29tcHV0ZWQsIGNvbmRpdGlvbmFsLCBjb25kaXRpb25hbEluZGV4LCBjb25kaXRpb25hbFJlZiwgZGVsYXllZEJlaGF2aW9yLCBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IsIGRlbGF5ZWRTdWJzY3JpYmUsIGRlcmVmLCBkZXJpdmF0ZSwgZWZmZWN0LCBlZmZlY3RlZCwgaXNPYnNlcnZhYmxlLCBpdGVyYXRlZCwgbGluaywgbWFrZUFycmF5T2JzZXJ2YWJsZSwgbWFrZU9iamVjdEFzc2lnbmFibGUsIG1ha2VSZXNvbHZlZE9wLCBudW1iZXJSZWYsIG9ic2VydmFibGVCeU1hcCwgb2JzZXJ2YWJsZUJ5U2V0LCBvYnNlcnZlLCBwcm9taXNlZCwgcHJvcFJlZiwgcmVjb3ZlclJlYWN0aXZlLCByZWYsIHJlbWFwLCByZXNvbHZlZCwgc2FmZSwgc3BlY2lhbGl6ZWRTdWJzY3JpYmUsIHN0cmluZ1JlZiwgc3Vic2NyaWJlRGlyZWN0bHksIHN1YnNjcmliZUlucHV0LCBzdWJzY3JpYmVQYWlyZWQsIHN1YnNjcmliZVRoZW5hYmxlLCB0cmlnZ2VyV2l0aERlbGF5LCB1bmFmZmVjdGVkLCB1bmlmaWVkLCB1bndyYXAsIHVzZU9ic2VydmFibGUsIHdyYXBSZWYsIHdyYXBTZXRBc0FycmF5IH07Il0sCiAgIm1hcHBpbmdzIjogIkFBQUEsU0FBUyxpQkFBQUEsSUFBZSxhQUFBQyxJQUFXLGdCQUFnQkMsSUFBZ0IsWUFBQUMsSUFBVSxXQUFBQyxHQUFTLGlC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QjBIO0FBQ1IsR0FDSUssS0FBbUIsQ0FBQzFILEdBQUs5USxHQUFJa1IsSUFBUSxRQUFRO0FBQ2hELE1BQUlHO0FBQ0osU0FBT3BGLEVBQVM2RSxHQUFLLFNBQVMsQ0FBQzlJLE1BQU07QUFDcEMsSUFBSSxDQUFDQSxLQUFLcUosS0FDVCxhQUFhQSxDQUFFLEdBQ2ZBLElBQUssUUFDS3JKLEtBQUssQ0FBQ3FKLE1BQUlBLElBQUtKLEdBQWlCSCxHQUFLOVEsR0FBSWtSLENBQUssS0FBS0c7QUFBQSxFQUMvRCxDQUFDO0FBQ0Y7IiwKICAibmFtZXMiOiBbIiRhdm9pZFRyaWdnZXIiLCAiJGdldFZhbHVlIiwgIiR0cmlnZ2VyTG9jayQxIiwgIlByb21pc2VkIiwgImJpbmRDdHgiLCAiY2FsbEJ5QWxsUHJvcCIsICJjYWxsQnlQcm9wIiwgImRlZmF1bHRCeVR5cGUiLCAiaGFzVmFsdWUiLCAiaXNBcnJheUludmFsaWRLZXkiLCAiaXNLZXlUeXBlIiwgImlzTm90RXF1YWwiLCAiaXNQcmltaXRpdmUiLCAiaXNQcm9taXNlIiwgIm1ha2VUcmlnZ2VyTGVzcyIsICJvYmplY3RBc3NpZ24iLCAib2JqZWN0QXNzaWduTm90RXF1YWwiLCAicG90ZW50aWFsbHlBc3luYyIsICJwb3RlbnRpYWxseUFzeW5jTWFwIiwgInJlc29sdmVkJDEiLCAidHJ5UGFyc2VCeUhpbnQiLCAiJHZhbHVlIiwgIiRleHRyYWN0S2V5JCIsICIkb3JpZ2luYWxLZXkkIiwgIiRyZWdpc3RyeUtleSQiLCAiJGJlaGF2aW9yIiwgIiRwcm9taXNlIiwgIiRyZXNvbHZlZCIsICIkdHJpZ2dlckxlc3MiLCAiJHRyaWdnZXJMb2NrIiwgIiR0cmlnZ2VyQ29udHJvbCIsICIkdHJpZ2dlciIsICIkYWZmZWN0ZWQiLCAiJGlzTm90RXF1YWwiLCAiJHJlYWxQcm9wIiwgIiRvcmlnaW5hbE9iamVjdHMkIiwgInNhZmUiLCAidGFyZ2V0IiwgInVud3JhcCIsICJtYXBwZWQiLCAiZSIsICJLIiwgIlYiLCAiYXJyIiwgImRlcmVmIiwgImRpc2NvdW50VmFsdWUiLCAib3JpZ2luYWwiLCAiJHZhbCIsICJpc1RoZW5hYmxlIiwgInZhbCIsICJ3aXRoUHJvbWlzZSIsICJjYiIsICJkaXNwb3NlTWFwIiwgImRpc3Bvc2VSZWdpc3RyeSIsICJjYWxsc3RhY2siLCAiYWRkVG9DYWxsQ2hhaW4iLCAib2JqIiwgIm1ldGhvZEtleSIsICJjYWxsYmFjayIsICJjaGFpblRhcmdldCIsICJDYWxsQ2hhaW4iLCAiYXJncyIsICJpc0FycmF5SW5kZXgiLCAicHJvcCIsICJudW0iLCAid3JhcFNldEFzQXJyYXkiLCAic291cmNlIiwgIm9wdGlvbnMiLCAiYmFja2luZ1NldCIsICJub3RpZnlEdXBsaWNhdGUiLCAidmFsdWUiLCAidmlhIiwgImluZGV4IiwgIml0ZW0iLCAic25hcHNob3QiLCAicmVidWlsZEZyb20iLCAibWV0aG9kcyIsICJpdGVtcyIsICJzaXplIiwgIml0ZXJhdG9yIiwgImN1cnJlbnQiLCAidG9QcmVwZW5kIiwgIm5leHQiLCAic3RhcnQiLCAiZGVsZXRlQ291bnQiLCAibm9ybWFsaXplZFN0YXJ0IiwgImFjdHVhbERlbGV0ZUNvdW50IiwgInJlbW92ZWQiLCAiaW5zZXJ0UG9zaXRpb24iLCAiXyIsICJuZXh0TGVuZ3RoIiwgIm5leHRWYWx1ZSIsICJjdXJyZW50VmFsdWUiLCAiaWR4IiwgImtleXMiLCAiaSIsICJBc3NpZ25PYmplY3RIYW5kbGVyIiwgIm5hbWUiLCAibmV3VCIsICJjdHgiLCAibWFrZU9iamVjdEFzc2lnbmFibGUiLCAicHgiLCAid2l0aFVuc3ViU3ltYm9sIiwgIndpdGhVbnN1YiIsICJjb21wbGV0ZVdpdGhVbnN1YiIsICJzdWJzY3JpYmVyIiwgIndlYWsiLCAiaGFuZGxlciIsICJyZWdpc3RyeSIsICJzYXZDb21wbGV0ZSIsICJ1bmFmZmVjdGVkIiwgInIiLCAic3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wiLCAic3Vic2NyaXB0UmVnaXN0cnkiLCAiZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sIiwgImdsb2JhbEVmZmVjdExpc3RlbmVycyIsICJlZmZlY3RHbG9iYWxseSIsICJub3JtYWxpemVkIiwgIm5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMiLCAid3JhcHBlZFN5bWJvbCIsICJ3cmFwcGVkIiwgInJlZ2lzdGVyIiwgIndoYXQiLCAiaGFuZGxlIiwgIlN1YnNjcmlwdCIsICJ3cmFwV2l0aCIsICJmb3JBbGwiLCAid2lsZGNhcmRUcmlnZ2VycyIsICJ0cmlnZ2VyQWxpYXNlcyIsICJ0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wiLCAiY2Fub25pY2FsIiwgImFsaWFzZXMiLCAiYWxpYXMiLCAidHJpZ2dlckNhbm9uaWNhbE5hbWVzIiwgIm5vcm1hbGl6ZVRyaWdnZXJOYW1lIiwgInRyaWdnZXIiLCAidHJpZ2dlck5hbWVzT2YiLCAiZXhwYW5kVHJpZ2dlckZpbHRlciIsICJ0eXBlcyIsICJub3JtYWxpemVUcmlnZ2VyRmlsdGVyIiwgInRyaWdnZXJzIiwgImxpc3QiLCAidHJpZ2dlckZpbHRlckFsbG93cyIsICJmaWx0ZXIiLCAiaXNPcHRpb25zT2JqZWN0IiwgIm5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyIsICJhZmZlY3RUeXBlcyIsICJTdWJzY3JpcHRTeW1ib2wiLCAiI3NvdXJjZSIsICIjbGlzdGVuZXJzIiwgIiNmbGFncyIsICIjbmF0aXZlIiwgIiNpdGVyYXRvciIsICIjaW5EaXNwYXRjaCIsICIjZGlzYWJsZWRUcmlnZ2VycyIsICIjdHJpZ2dlckNvbnRyb2wiLCAiI3BlbmRpbmciLCAiI3BlbmRpbmdCeVByb3AiLCAiI2ZsdXNoU2NoZWR1bGVkIiwgImVuYWJsZWQiLCAiI2Rpc3BhdGNoIiwgImNvbnRyb2xsZXIiLCAicmVzIiwgIm9sZFZhbHVlIiwgImV0YyIsICJsaXN0ZW5lcnMiLCAicmVjb3JkIiwgImV2ZW50IiwgIm53IiwgIm5hbWVzIiwgInByZXZpb3VzIiwgInJlc3RvcmUiLCAid2FzRGlzYWJsZWQiLCAicmVzdWx0IiwgIm9wS2V5IiwgImJ5T3AiLCAiYmF0Y2giLCAib3BNYXAiLCAibm0iLCAidiIsICJvdiIsICJ0ZyIsICJyZXN0IiwgInJhd09mIiwgInVud3JhcHBlZCIsICJyZXNvbHZlZCIsICJtb2RlIiwgInJhdyIsICJtYWtlUmVzb2x2ZWRPcCIsICJlbWl0IiwgInJ1biIsICJwZW5kaW5nIiwgImtleSIsICJjYWxsYmFja09yVmFsdWUiLCAiZW1pdFJlc29sdmVkIiwgImJpbmRFeGlzdGluZ1RoZW5hYmxlcyIsICJsaXZlIiwgIl9fc2FmZUdldEd1YXJkU3ltYm9sIiwgInJlYWN0aXZlUHJvcGVydGllc1N5bWJvbCIsICJyZWFjdGl2ZVByb3BlcnRpZXMiLCAicmVhY3RpdmVNZXRob2RzU3ltYm9sIiwgInJlYWN0aXZlTWV0aG9kcyIsICJtYXJrUmVhY3RpdmVQcm9wZXJ0eSIsICJpc1JlYWN0aXZlUHJvcGVydHkiLCAibm90aWZ5UmVhY3RpdmVQcm9wZXJ0eSIsICJyZWNlaXZlciIsICJvd25lciIsICJuZXdWYWx1ZSIsICJ0cmlnZ2VyTmFtZSIsICJ0cmlnZ2VyS2V5T2YiLCAic2FmZUdldCIsICJkZWZpbmVSZWFjdGl2ZVByb3BlcnR5IiwgImRlc2NyaXB0b3IiLCAiaW5pdGlhbFZhbHVlIiwgInZhbHVlcyIsICJsYXN0QXNzaWduZWQiLCAicHJvcGVydHlEZXNjIiwgImFjdHVhbFZhbHVlIiwgIl9fc3lzdGVtU2tpcCIsICJzeXN0ZW1Ta2lwR2V0IiwgImdvdCIsICJfX3NhZmVHZXRHdWFyZCIsICJpc0dldHRlciIsICJwcm9wTmFtZSIsICJmYWxsVGhyb3VnaCIsICJ0bXAiLCAic2FmZVNldCIsICJhY3RpdmUiLCAicmVjIiwgImhhc093biIsICJpc1RyaWdnZXJFbWl0T3B0aW9ucyIsICJhbGxvd1ZhbHVlT25seSIsICJ0cmlnZ2VyT3B0aW9uVmFsdWUiLCAiZmFsbGJhY2siLCAidHJpZ2dlck9wdGlvblRyaWdnZXIiLCAiaXNSdW50aW1lS2V5IiwgInJlYWxQcm9wT2YkMSIsICJ0cmlnZ2VyVmFsdWVPZiIsICJyZWFsUHJvcCIsICJjcmVhdGVUcmlnZ2VyQVBJIiwgImFwaSIsICJvcE9yT3B0aW9ucyIsICJjb250cm9sIiwgInN5c3RlbUdldCIsICJhZmZlY3RlZCIsICJvYnNlcnZhYmxlQVBJTWV0aG9kcyIsICJ1c3ViIiwgImNvbXAiLCAiT2JzZXJ2ZUFycmF5TWV0aG9kIiwgIiNuYW1lIiwgIiNzZWxmIiwgIiNoYW5kbGUiLCAic2VsZiIsICJza2lwIiwgImFkZGVkIiwgInNldFBhaXJzIiwgIm9sZFN0YXRlIiwgIm9ic2VydmVBcnJheSIsICJyZWciLCAiSSIsICJwYWlyIiwgInRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlIiwgIm9sZExlbiIsICJuZXdMZW4iLCAicmVtb3ZlZEl0ZW1zIiwgImFkZGVkQ291bnQiLCAiT2JzZXJ2ZUFycmF5SGFuZGxlciIsICJzeXMiLCAib2JzIiwgIm9sZCIsICJ4eXp3IiwgInJnYmEiLCAieHl6d19pZHgiLCAicmdiYV9pZHgiLCAiT2JzZXJ2ZU9iamVjdEhhbmRsZXIiLCAiaGludCIsICJmdCIsICIkb3JpZ2luYWwiLCAic3Vic2NyaXB0IiwgIiRyZXN1bHQiLCAiT2JzZXJ2ZU1hcEhhbmRsZXIiLCAidmFsdWVPckZ4IiwgIm9sZFZhbHVlcyIsICJoYWQiLCAiY29tcHV0ZWQiLCAiZGVmYXVsdE9yQ29tcHV0ZSIsICJpbmNvbWluZyIsICJPYnNlcnZlU2V0SGFuZGxlciIsICIkaXNPYnNlcnZhYmxlIiwgIm1ha2VSZWFjdGl2ZVByb3BlcnRpZXMiLCAiZW50cmllcyIsICJvYnNlcnZlT2JqZWN0IiwgIm9ic2VydmVNYXAiLCAibWFwIiwgIm9ic2VydmVTZXQiLCAic2V0IiwgIm51bWJlclJlZiIsICJpbml0aWFsIiwgImJlaGF2aW9yIiwgIiRyIiwgIm9ic2VydmUiLCAic3RyaW5nUmVmIiwgImJvb2xlYW5SZWYiLCAid3JhcFJlZiIsICJtYXJrUmVhbFByb3AiLCAicHJvcFJlZiIsICJzcmMiLCAic3JjUHJvcCIsICJpc01hcCIsICJpc1NldCIsICJyZWFkU2xvdCIsICJ3cml0ZVNsb3QiLCAibWVtYmVyIiwgImlzT2JzZXJ2YWJsZSIsICJyZWNvdmVyUmVhY3RpdmUiLCAic2xvdCIsICJ1c2IiLCAiX3Byb3AiLCAicHJldiIsICIkcmVmIiwgInR5cGVkIiwgInJlZiIsICJwcm9taXNlZCIsICJwcm9taXNlIiwgInRyaWdnZXJXaXRoRGVsYXkiLCAiZGVsYXkiLCAiZGVsYXllZEJlaGF2aW9yIiwgInNpZyIsICJ0bSIsICJkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IiLCAic3RhdGVOYW1lIiwgInJlYWN0aXZlIiwgInVzZU9ic2VydmFibGUiLCAib2JzZXJ2YWJsZSIsICJzcGVjaWFsaXplZFN1YnNjcmliZSIsICJjaGVja1ZhbGlkT2JqIiwgImluaXRpYWxUcmlnZ2VyIiwgInJlYWxQcm9wT2YiLCAibm9ybWFsaXplQWZmZWN0ZWRQcm9wIiwgInByb3BWYWx1ZU9mIiwgImNhbGxCeVByb3BSZWZBd2FyZSIsICJ3aXRoVHJpZ2dlciIsICJzdWJzY3JpYmVEaXJlY3RseSIsICJ0UHJvcCIsICJpbml0aWFsQ2IiLCAidW5TdWIiLCAic3Vic2NyaWJlSW5wdXQiLCAiJG9wdCIsICIkY2IiLCAiZXYiLCAiY2hlY2tJc1BhaXJlZCIsICJpc0VmZmVjdE9wdGlvbnNBcmciLCAibm9ybWFsaXplRWZmZWN0VGFyZ2V0cyIsICJ0YXJnZXRzIiwgImVmZmVjdFRhcmdldENvbnRleHQiLCAidG9FZmZlY3RFdmVudCIsICJzdWJzY3JpYmVQYWlyZWQiLCAic3Vic2NyaWJlVGhlbmFibGUiLCAiZWZmZWN0IiwgImFmZmVjdGVkT3B0aW9ucyIsICJkaXNwb3NlcnMiLCAiZGlzcG9zZSIsICJlZmZlY3RlZCIsICJtYWtlQXJyYXlPYnNlcnZhYmxlIiwgIm9ic2VydmFibGVCeVNldCIsICJvYnNlcnZhYmxlQnlNYXAiLCAiRG91YmxlV2Vha01hcCIsICIjdG9wIiwgIiNlbnN1cmVJbm5lciIsICJrZXkxIiwgImlubmVyIiwgIiNzcGxpdFBhaXIiLCAia2V5MiIsICJmYWN0b3J5IiwgImNvbXB1dGUiLCAicmVnaXN0ZXJlZEl0ZXJhdGVkIiwgIml0ZXJhdGVkIiwgIiRzdWIiLCAiYmFzaXMiLCAib2ZPbGQiLCAib2ZOZXciLCAiaXNQYWlyIiwgImJpbmRCeSIsICJ3YXRjaCIsICJwIiwgIk4iLCAiayIsICJkZXJpdmF0ZSIsICJmcm9tIiwgInJlYWN0Rm4iLCAiYmluZEJ5S2V5IiwgImNvbmRpdGlvbmFsSW5kZXgiLCAiY29uZExpc3QiLCAicmVhZENvbmRpdGlvbiIsICJjb25kaXRpb24iLCAiaW52YWxpZGF0ZSIsICJjb25kaXRpb25hbFJlZiIsICJjb25kIiwgImlmVHJ1ZSIsICJpZkZhbHNlIiwgImdldFRydWUiLCAiZ2V0RmFsc2UiLCAidmFsdWVPZiIsICJuIiwgImNvbmRpdGlvbmFsIiwgInJlbWFwIiwgInN1YiIsICJkZXN0IiwgInVuaWZpZWQiLCAic3VicyIsICJpbml0aWFsRW50cmllcyIsICJhc3NpZ25NYXAiLCAiYXNzaWduIiwgImEiLCAiYiIsICJpc0FDb21wdXRlIiwgImlzQkNvbXB1dGUiLCAiY21wQkZuYyIsICJpc0FQcm9wIiwgImFfcHJvcCIsICJpc0JQcm9wIiwgImJfcHJvcCIsICJhX3RtcCIsICJhUmVmIiwgImJfdG1wIiwgImJSZWYiLCAiY21wZngiLCAibnYiLCAic3RvcmUiLCAibGluayIsICJjIiwgIm9sZEFyZyIsICJjbXAiLCAiYXJnIiwgImZvcmNlIiwgIndycEZ1bmMiLCAib2xkQXJnJCIsICJvcCIsICJyZiIsICJwZW5kaW5nSW5pdGlhbCIsICIkYXBwbHkiLCAiY3AiLCAid3JpdGVDb21wdXRlZCIsICJkZWxheWVkU3Vic2NyaWJlIl0KfQo=
