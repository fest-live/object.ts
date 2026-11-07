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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vIHNyYy93cmFwL1N5bWJvbC50c1xuU3ltYm9sLm9ic2VydmFibGUgfHw9IFN5bWJvbC5mb3IoXCJvYnNlcnZhYmxlXCIpO1xuU3ltYm9sLnN1YnNjcmliZSB8fD0gU3ltYm9sLmZvcihcInN1YnNjcmliZVwiKTtcblN5bWJvbC51bnN1YnNjcmliZSB8fD0gU3ltYm9sLmZvcihcInVuc3Vic2NyaWJlXCIpO1xudmFyICR2YWx1ZSA9IFN5bWJvbC5mb3IoXCJAdmFsdWVcIik7XG52YXIgJGV4dHJhY3RLZXkkID0gU3ltYm9sLmZvcihcIkBleHRyYWN0XCIpO1xudmFyICRvcmlnaW5hbEtleSQgPSBTeW1ib2wuZm9yKFwiQG9yaWdpblwiKTtcbnZhciAkcmVnaXN0cnlLZXkkID0gU3ltYm9sLmZvcihcIkByZWdpc3RyeVwiKTtcbnZhciAkYmVoYXZpb3IgPSBTeW1ib2wuZm9yKFwiQGJlaGF2aW9yXCIpO1xudmFyICRwcm9taXNlID0gU3ltYm9sLmZvcihcIkBwcm9taXNlXCIpO1xudmFyICRyZXNvbHZlZCA9IFN5bWJvbC5mb3IoXCJAcmVzb2x2ZWRcIik7XG52YXIgJHRyaWdnZXJMZXNzID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyLWxlc3NcIik7XG52YXIgJHRyaWdnZXJMb2NrID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyLWxvY2tcIik7XG52YXIgJHRyaWdnZXJDb250cm9sID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyLWNvbnRyb2xcIik7XG52YXIgJHRyaWdnZXIgPSBTeW1ib2wuZm9yKFwiQHRyaWdnZXJcIik7XG52YXIgJGFmZmVjdGVkID0gU3ltYm9sLmZvcihcIkBzdWJzY3JpYmVcIik7XG52YXIgJGlzTm90RXF1YWwgPSBTeW1ib2wuZm9yKFwiQGlzTm90RXF1YWxcIik7XG52YXIgJHJlYWxQcm9wID0gU3ltYm9sLmZvcihcIkByZWFsUHJvcFwiKTtcblxuLy8gc3JjL3dyYXAvVXRpbHMudHNcbnZhciAkb3JpZ2luYWxPYmplY3RzJCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHNhZmUgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHVud3JhcCA9IHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0IDogdGFyZ2V0LCBtYXBwZWQgPSAoZSkgPT4gc2FmZShlKTtcblx0aWYgKEFycmF5LmlzQXJyYXkodW53cmFwKSkgcmV0dXJuIHVud3JhcD8ubWFwPy4obWFwcGVkKSB8fCBBcnJheS5mcm9tKHVud3JhcCB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkgfHwgW107XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIE1hcCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrTWFwKSByZXR1cm4gbmV3IE1hcChBcnJheS5mcm9tKHVud3JhcD8uZW50cmllcz8uKCkgfHwgW10pPy5tYXA/LigoW0ssIFZdKSA9PiBbSywgc2FmZShWKV0pKTtcblx0ZWxzZSBpZiAodW53cmFwIGluc3RhbmNlb2YgU2V0IHx8IHVud3JhcCBpbnN0YW5jZW9mIFdlYWtTZXQpIHJldHVybiBuZXcgU2V0KEFycmF5LmZyb20odW53cmFwPy52YWx1ZXM/LigpIHx8IFtdKT8ubWFwPy4obWFwcGVkKSk7XG5cdGVsc2UgaWYgKHVud3JhcCAhPSBudWxsICYmIHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJvYmplY3RcIikgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhBcnJheS5mcm9tKE9iamVjdC5lbnRyaWVzKHVud3JhcCB8fCB7fSkgfHwgW10pPy5maWx0ZXI/LigoW0tdKSA9PiBLICE9ICRleHRyYWN0S2V5JCAmJiBLICE9ICRvcmlnaW5hbEtleSQgJiYgSyAhPSAkcmVnaXN0cnlLZXkkKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdHJldHVybiB1bndyYXA7XG59O1xudmFyIHVud3JhcCA9IChhcnIpID0+IHtcblx0cmV0dXJuIGFycj8uWyRleHRyYWN0S2V5JF0gPz8gYXJyPy5bXCJAdGFyZ2V0XCJdID8/IGFycjtcbn07XG52YXIgZGVyZWYgPSAodGFyZ2V0LCBkaXNjb3VudFZhbHVlID0gZmFsc2UpID0+IHtcblx0Y29uc3Qgb3JpZ2luYWwgPSB0YXJnZXQ7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJzeW1ib2xcIikgcmV0dXJuIHRhcmdldDtcblx0aWYgKHRhcmdldCAhPSBudWxsICYmICh0YXJnZXQgaW5zdGFuY2VvZiBXZWFrUmVmIHx8IFwiZGVyZWZcIiBpbiB0YXJnZXQgJiYgdHlwZW9mIHRhcmdldD8uZGVyZWYgPT0gXCJmdW5jdGlvblwiKSkgdGFyZ2V0ID0gdGFyZ2V0Py5kZXJlZj8uKCk7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSkge1xuXHRcdHRhcmdldCA9IHVud3JhcCh0YXJnZXQpO1xuXHRcdGNvbnN0ICR2YWwgPSBkaXNjb3VudFZhbHVlICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgdGFyZ2V0Py52YWx1ZTtcblx0XHRpZiAoJHZhbCAhPSBudWxsICYmICh0eXBlb2YgJHZhbCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiAkdmFsID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9ICR2YWw7XG5cdFx0aWYgKG9yaWdpbmFsICE9IHRhcmdldCkgcmV0dXJuIGRlcmVmKHRhcmdldCwgZGlzY291bnRWYWx1ZSk7XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbn07XG52YXIgaXNUaGVuYWJsZSA9ICh2YWwpID0+IHZhbCAhPSBudWxsICYmIHR5cGVvZiB2YWwudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xudmFyIHdpdGhQcm9taXNlID0gKHRhcmdldCwgY2IpID0+IHtcblx0aWYgKGlzUHJpbWl0aXZlKHRhcmdldCkgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjYj8uKHRhcmdldCk7XG5cdGlmIChpc1RoZW5hYmxlKHRhcmdldCkpIHJldHVybiB0YXJnZXQudGhlbihjYik7XG5cdGlmICh0eXBlb2YgdGFyZ2V0Py5yZXNvbHZlZCA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBQcm9taXNlLnJlc29sdmUodGFyZ2V0LnJlc29sdmVkKCkpLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5wcm9taXNlICYmIGlzVGhlbmFibGUodGFyZ2V0LnByb21pc2UpKSByZXR1cm4gdGFyZ2V0LnByb21pc2UudGhlbihjYik7XG5cdGlmICh0YXJnZXQ/LlskcHJvbWlzZV0gJiYgaXNUaGVuYWJsZSh0YXJnZXRbJHByb21pc2VdKSkgcmV0dXJuIHRhcmdldFskcHJvbWlzZV0udGhlbihjYik7XG5cdHJldHVybiBjYj8uKHRhcmdldCk7XG59O1xudmFyIGRpc3Bvc2VNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBkaXNwb3NlUmVnaXN0cnkgPSBuZXcgRmluYWxpemF0aW9uUmVnaXN0cnkoKGNhbGxzdGFjaykgPT4ge1xuXHRjYWxsc3RhY2s/LmZvckVhY2g/LigoY2IpID0+IGNiPy4oKSk7XG59KTtcbmZ1bmN0aW9uIGFkZFRvQ2FsbENoYWluKG9iaiwgbWV0aG9kS2V5LCBjYWxsYmFjaykge1xuXHRpZiAoIWNhbGxiYWNrIHx8IHR5cGVvZiBjYWxsYmFjayAhPSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIG9iaiAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmogIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGlmIChtZXRob2RLZXkgPT0gU3ltYm9sLmRpc3Bvc2UpIHtcblx0XHRjb25zdCBjaGFpblRhcmdldCA9IG9iaj8uWyRleHRyYWN0S2V5JF0gPz8gb2JqO1xuXHRcdGRpc3Bvc2VNYXA/LmdldE9ySW5zZXJ0Q29tcHV0ZWQ/LihjaGFpblRhcmdldCwgKCkgPT4ge1xuXHRcdFx0Y29uc3QgQ2FsbENoYWluID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0XHRcdGlmICh0eXBlb2YgY2hhaW5UYXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2hhaW5UYXJnZXQgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdGRpc3Bvc2VSZWdpc3RyeS5yZWdpc3RlcihjaGFpblRhcmdldCwgQ2FsbENoYWluKTtcblx0XHRcdFx0ZGlzcG9zZU1hcC5zZXQoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGNoYWluVGFyZ2V0W1N5bWJvbC5kaXNwb3NlXSA/Pz0gKCkgPT4gQ2FsbENoYWluLmZvckVhY2goKGNiKSA9PiB7XG5cdFx0XHRcdFx0Y2I/LigpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBDYWxsQ2hhaW47XG5cdFx0fSk/LmFkZD8uKGNhbGxiYWNrKTtcblx0fSBlbHNlIG9ialttZXRob2RLZXldID0gZnVuY3Rpb24oLi4uYXJncykge1xuXHRcdGNvbnN0IG9yaWdpbmFsID0gb2JqPy5bbWV0aG9kS2V5XTtcblx0XHRpZiAodHlwZW9mIG9yaWdpbmFsID09IFwiZnVuY3Rpb25cIikgb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0Y2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG5cdH07XG59XG52YXIgaXNBcnJheUluZGV4ID0gKHByb3ApID0+IHtcblx0aWYgKHR5cGVvZiBwcm9wICE9PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsc2U7XG5cdGlmIChwcm9wID09PSBcIlwiKSByZXR1cm4gZmFsc2U7XG5cdGNvbnN0IG51bSA9IE51bWJlcihwcm9wKTtcblx0cmV0dXJuIE51bWJlci5pc0ludGVnZXIobnVtKSAmJiBudW0gPj0gMCAmJiBTdHJpbmcobnVtKSA9PT0gcHJvcDtcbn07XG5mdW5jdGlvbiB3cmFwU2V0QXNBcnJheShzb3VyY2UgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG5cdGxldCBiYWNraW5nU2V0ID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0Y29uc3Qgbm90aWZ5RHVwbGljYXRlID0gKHZhbHVlLCB2aWEsIGluZGV4KSA9PiB7XG5cdFx0b3B0aW9ucy5vbkR1cGxpY2F0ZT8uKHtcblx0XHRcdHZhbHVlLFxuXHRcdFx0dmlhLFxuXHRcdFx0aW5kZXhcblx0XHR9KTtcblx0fTtcblx0aWYgKHNvdXJjZSBpbnN0YW5jZW9mIFNldCkgYmFja2luZ1NldCA9IHNvdXJjZTtcblx0ZWxzZSBmb3IgKGNvbnN0IGl0ZW0gb2Ygc291cmNlKSB7XG5cdFx0aWYgKGJhY2tpbmdTZXQuaGFzKGl0ZW0pKSB7XG5cdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJwdXNoXCIpO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGJhY2tpbmdTZXQuYWRkKGl0ZW0pO1xuXHR9XG5cdGNvbnN0IHNuYXBzaG90ID0gKCkgPT4gQXJyYXkuZnJvbShiYWNraW5nU2V0KTtcblx0Y29uc3QgcmVidWlsZEZyb20gPSAoYXJyKSA9PiB7XG5cdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdGZvciAoY29uc3QgaXRlbSBvZiBhcnIpIGJhY2tpbmdTZXQuYWRkKGl0ZW0pO1xuXHR9O1xuXHRjb25zdCBtZXRob2RzID0ge1xuXHRcdHB1c2g6ICguLi5pdGVtcykgPT4ge1xuXHRcdFx0bGV0IHNpemUgPSBiYWNraW5nU2V0LnNpemU7XG5cdFx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcblx0XHRcdFx0aWYgKGJhY2tpbmdTZXQuaGFzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0XHRcdFx0c2l6ZSsrO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNpemU7XG5cdFx0fSxcblx0XHRwb3A6ICgpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRpZiAoIWFyci5sZW5ndGgpIHJldHVybiB2b2lkIDA7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IGFyclthcnIubGVuZ3RoIC0gMV07XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHRzaGlmdDogKCkgPT4ge1xuXHRcdFx0Y29uc3QgaXRlcmF0b3IgPSBiYWNraW5nU2V0LnZhbHVlcygpLm5leHQoKTtcblx0XHRcdGlmIChpdGVyYXRvci5kb25lKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBpdGVyYXRvci52YWx1ZTtcblx0XHRcdGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHVuc2hpZnQ6ICguLi5pdGVtcykgPT4ge1xuXHRcdFx0aWYgKCFpdGVtcy5sZW5ndGgpIHJldHVybiBiYWNraW5nU2V0LnNpemU7XG5cdFx0XHRjb25zdCBjdXJyZW50ID0gc25hcHNob3QoKTtcblx0XHRcdGNvbnN0IHRvUHJlcGVuZCA9IFtdO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChjdXJyZW50LmluY2x1ZGVzKGl0ZW0pIHx8IHRvUHJlcGVuZC5pbmNsdWRlcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInVuc2hpZnRcIiwgMCk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dG9QcmVwZW5kLnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXRvUHJlcGVuZC5sZW5ndGgpIHJldHVybiBjdXJyZW50Lmxlbmd0aDtcblx0XHRcdGNvbnN0IG5leHQgPSBbLi4udG9QcmVwZW5kLCAuLi5jdXJyZW50XTtcblx0XHRcdHJlYnVpbGRGcm9tKG5leHQpO1xuXHRcdFx0cmV0dXJuIG5leHQubGVuZ3RoO1xuXHRcdH0sXG5cdFx0c3BsaWNlOiAoc3RhcnQsIGRlbGV0ZUNvdW50LCAuLi5pdGVtcykgPT4ge1xuXHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdGNvbnN0IG5vcm1hbGl6ZWRTdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHN0YXJ0LCAwKSwgYXJyLmxlbmd0aCk7XG5cdFx0XHRjb25zdCBhY3R1YWxEZWxldGVDb3VudCA9IGRlbGV0ZUNvdW50ID09PSB2b2lkIDAgPyBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0IDogTWF0aC5tYXgoMCwgTWF0aC5taW4oZGVsZXRlQ291bnQsIGFyci5sZW5ndGggLSBub3JtYWxpemVkU3RhcnQpKTtcblx0XHRcdGNvbnN0IHJlbW92ZWQgPSBhcnIuc3BsaWNlKG5vcm1hbGl6ZWRTdGFydCwgYWN0dWFsRGVsZXRlQ291bnQpO1xuXHRcdFx0bGV0IGluc2VydFBvc2l0aW9uID0gbm9ybWFsaXplZFN0YXJ0O1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChhcnIuaW5jbHVkZXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJzcGxpY2VcIiwgaW5zZXJ0UG9zaXRpb24pO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFyci5zcGxpY2UoaW5zZXJ0UG9zaXRpb24rKywgMCwgaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRyZWJ1aWxkRnJvbShhcnIpO1xuXHRcdFx0cmV0dXJuIHJlbW92ZWQ7XG5cdFx0fSxcblx0XHRpbmNsdWRlczogKHZhbHVlKSA9PiBiYWNraW5nU2V0Lmhhcyh2YWx1ZSksXG5cdFx0aW5kZXhPZjogKHZhbHVlKSA9PiBzbmFwc2hvdCgpLmluZGV4T2YodmFsdWUpLFxuXHRcdGNsZWFyOiAoKSA9PiB7XG5cdFx0XHRiYWNraW5nU2V0LmNsZWFyKCk7XG5cdFx0fSxcblx0XHRkZWxldGU6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5kZWxldGUodmFsdWUpLFxuXHRcdHRvQXJyYXk6ICgpID0+IHNuYXBzaG90KCksXG5cdFx0dG9TZXQ6ICgpID0+IG5ldyBTZXQoYmFja2luZ1NldCksXG5cdFx0W1N5bWJvbC5pdGVyYXRvcl06ICgpID0+IGJhY2tpbmdTZXRbU3ltYm9sLml0ZXJhdG9yXSgpXG5cdH07XG5cdHJldHVybiBuZXcgUHJveHkobWV0aG9kcywge1xuXHRcdGdldDogKF8sIHByb3ApID0+IHtcblx0XHRcdGlmIChwcm9wID09PSBcImxlbmd0aFwiKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkgcmV0dXJuIHNuYXBzaG90KClbTnVtYmVyKHByb3ApXTtcblx0XHRcdGNvbnN0IHZhbHVlID0gbWV0aG9kc1twcm9wXTtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHZhbHVlO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2V0OiAoXywgcHJvcCwgdmFsdWUpID0+IHtcblx0XHRcdGlmIChwcm9wID09PSBcImxlbmd0aFwiKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgIT09IFwibnVtYmVyXCIgfHwgIU51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgfHwgdmFsdWUgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcImxlbmd0aCBtdXN0IGJlIGEgZmluaXRlIG5vbi1uZWdhdGl2ZSBudW1iZXJcIik7XG5cdFx0XHRcdGNvbnN0IG5leHRMZW5ndGggPSBNYXRoLmZsb29yKHZhbHVlKTtcblx0XHRcdFx0aWYgKG5leHRMZW5ndGggPj0gYmFja2luZ1NldC5zaXplKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKS5zbGljZSgwLCBuZXh0TGVuZ3RoKTtcblx0XHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRpZiAoaW5kZXggPiBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0Y29uc3QgbmV4dFZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdGlmIChpbmRleCA8IGFyci5sZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBjdXJyZW50VmFsdWUgPSBhcnJbaW5kZXhdO1xuXHRcdFx0XHRcdGlmIChPYmplY3QuaXMoY3VycmVudFZhbHVlLCBuZXh0VmFsdWUpKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRpZiAoYXJyLnNvbWUoKGl0ZW0sIGlkeCkgPT4gaWR4ICE9PSBpbmRleCAmJiBPYmplY3QuaXMoaXRlbSwgbmV4dFZhbHVlKSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnJbaW5kZXhdID0gbmV4dFZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChhcnIuaW5jbHVkZXMobmV4dFZhbHVlKSkge1xuXHRcdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKG5leHRWYWx1ZSwgXCJzZXRcIiwgaW5kZXgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFyci5wdXNoKG5leHRWYWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5zZXQobWV0aG9kcywgcHJvcCwgdmFsdWUpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlUHJvcGVydHk6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID49IGFyci5sZW5ndGgpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRhcnIuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShtZXRob2RzLCBwcm9wKTtcblx0XHR9LFxuXHRcdG93bktleXM6ICgpID0+IHtcblx0XHRcdGNvbnN0IGtleXMgPSBbXTtcblx0XHRcdGxldCBpID0gMDtcblx0XHRcdGZvciAoY29uc3QgXyBvZiBiYWNraW5nU2V0KSBrZXlzLnB1c2goU3RyaW5nKGkrKykpO1xuXHRcdFx0a2V5cy5wdXNoKFwibGVuZ3RoXCIpO1xuXHRcdFx0cmV0dXJuIGtleXM7XG5cdFx0fSxcblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHtcblx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcblx0XHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHR2YWx1ZTogYmFja2luZ1NldC5zaXplXG5cdFx0XHR9O1xuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID49IGFyci5sZW5ndGgpIHJldHVybiB2b2lkIDA7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRcdFx0dmFsdWU6IGFycltpbmRleF1cblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtZXRob2RzLCBwcm9wKTtcblx0XHR9LFxuXHRcdGhhczogKF8sIHByb3ApID0+IHtcblx0XHRcdGlmIChwcm9wID09PSBcImxlbmd0aFwiKSByZXR1cm4gdHJ1ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgYmFja2luZ1NldC5zaXplO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHByb3AgaW4gbWV0aG9kcztcblx0XHR9XG5cdH0pO1xufVxuXG4vLyBzcmMvd3JhcC9Bc3NpZ25PYmplY3QudHNcbnZhciBBc3NpZ25PYmplY3RIYW5kbGVyID0gY2xhc3Mge1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdG9iamVjdEFzc2lnbih0YXJnZXQsIHZhbHVlLCBuYW1lKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIikgcmV0dXJuIHRhcmdldD8uW25hbWVdID8/IHRhcmdldDtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBuYW1lLCBjdHgpO1xuXHR9XG59O1xudmFyIG1ha2VPYmplY3RBc3NpZ25hYmxlID0gKG9iaikgPT4ge1xuXHRpZiAob2JqPy5bJG9yaWdpbmFsS2V5JF0gfHwgJG9yaWdpbmFsT2JqZWN0cyQuaGFzKG9iaikpIHJldHVybiBvYmo7XG5cdGNvbnN0IHB4ID0gbmV3IFByb3h5KG9iaiwgbmV3IEFzc2lnbk9iamVjdEhhbmRsZXIoKSk7XG5cdCRvcmlnaW5hbE9iamVjdHMkLnNldChweCwgb2JqKTtcblx0cmV0dXJuIHB4O1xufTtcblxuLy8gc3JjL2NvcmUvU3Vic2NyaXB0LnRzXG52YXIgd2l0aFVuc3ViU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0B3aXRoVW5zdWJcIik7XG5nbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdpdGhVbnN1YiA9IGdsb2JhbFRoaXNbd2l0aFVuc3ViU3ltYm9sXTtcbnZhciBjb21wbGV0ZVdpdGhVbnN1YiA9IChzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKSA9PiB7XG5cdHJldHVybiB3aXRoVW5zdWIuZ2V0T3JJbnNlcnQoc3Vic2NyaWJlciwgKCkgPT4ge1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gd2Vhaz8uZGVyZWY/LigpO1xuXHRcdHJlZ2lzdHJ5Py5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdGNvbnN0IHNhdkNvbXBsZXRlID0gc3Vic2NyaWJlcj8uY29tcGxldGU/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRjb25zdCB1bmFmZmVjdGVkID0gKCkgPT4ge1xuXHRcdFx0Y29uc3QgciA9IHNhdkNvbXBsZXRlPy4oKTtcblx0XHRcdHJlZ2lzdHJ5Py51bmFmZmVjdGVkPy4oaGFuZGxlcik7XG5cdFx0XHRyZXR1cm4gcjtcblx0XHR9O1xuXHRcdHN1YnNjcmliZXIuY29tcGxldGUgPSB1bmFmZmVjdGVkO1xuXHRcdHJldHVybiB7XG5cdFx0XHR1bmFmZmVjdGVkLFxuXHRcdFx0W1N5bWJvbC5kaXNwb3NlXTogdW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuYXN5bmNEaXNwb3NlXTogdW5hZmZlY3RlZFxuXHRcdH07XG5cdH0pO1xufTtcbnZhciBzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAc3Vic2NyaXB0UmVnaXN0cnlcIik7XG5nbG9iYWxUaGlzW3N1YnNjcmlwdFJlZ2lzdHJ5U3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgc3Vic2NyaXB0UmVnaXN0cnkgPSBnbG9iYWxUaGlzW3N1YnNjcmlwdFJlZ2lzdHJ5U3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0BnbG9iYWxFZmZlY3RMaXN0ZW5lcnNcIik7XG5nbG9iYWxUaGlzW2dsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG52YXIgZ2xvYmFsRWZmZWN0TGlzdGVuZXJzID0gZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdO1xudmFyIGVmZmVjdEdsb2JhbGx5ID0gKGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoY2IgPT0gbnVsbCB8fCB0eXBlb2YgY2IgIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVFZmZlY3RPcHRpb25zKG9wdGlvbnMpO1xuXHRnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2V0KGNiLCBub3JtYWxpemVkLmFmZmVjdFR5cGVzKTtcblx0cmV0dXJuICgpID0+IGdsb2JhbEVmZmVjdExpc3RlbmVycy5kZWxldGUoY2IpO1xufTtcbnZhciB3cmFwcGVkU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0B3cmFwcGVkXCIpO1xuZ2xvYmFsVGhpc1t3cmFwcGVkU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgd3JhcHBlZCA9IGdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF07XG52YXIgcmVnaXN0ZXIgPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdGNvbnN0IHVud3JhcCA9IHdoYXQ/LlskZXh0cmFjdEtleSRdID8/IHdoYXQ7XG5cdGxldCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh1bndyYXApO1xuXHRpZiAoIXJlZ2lzdHJ5KSB7XG5cdFx0cmVnaXN0cnkgPSBuZXcgU3Vic2NyaXB0KHVud3JhcCk7XG5cdFx0c3Vic2NyaXB0UmVnaXN0cnkuc2V0KHVud3JhcCwgcmVnaXN0cnkpO1xuXHR9IGVsc2UgcmVnaXN0cnkuYmluZFNvdXJjZSh1bndyYXApO1xuXHRyZXR1cm4gaGFuZGxlO1xufTtcbnZhciB3cmFwV2l0aCA9ICh3aGF0LCBoYW5kbGUpID0+IHtcblx0d2hhdCA9IGRlcmVmKHdoYXQ/LlskZXh0cmFjdEtleSRdID8/IHdoYXQpO1xuXHRpZiAodHlwZW9mIHdoYXQgPT0gXCJzeW1ib2xcIiB8fCAhKHR5cGVvZiB3aGF0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHdoYXQgPT0gXCJmdW5jdGlvblwiKSB8fCB3aGF0ID09IG51bGwpIHJldHVybiB3aGF0O1xuXHRyZXR1cm4gd3JhcHBlZC5nZXRPckluc2VydENvbXB1dGVkKHdoYXQsICgpID0+IG5ldyBQcm94eSh3aGF0LCByZWdpc3Rlcih3aGF0LCBoYW5kbGUpKSk7XG59O1xudmFyIGZvckFsbCA9IFN5bWJvbC5mb3IoXCJAYWxsUHJvcHNcIik7XG52YXIgd2lsZGNhcmRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcIipcIiwgXCJhbGxcIl0pO1xudmFyIHRyaWdnZXJBbGlhc2VzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoW1xuXHRbXCJzZXRcIiwgW1wic2V0dGVyXCIsIFwiQHNldFwiXV0sXG5cdFtcImFkZFwiLCBbXCJAYWRkXCJdXSxcblx0W1wiZGVsZXRlXCIsIFtcIkBkZWxldGVcIl1dLFxuXHRbXCJpbnZhbGlkYXRlXCIsIFtcIkBpbnZhbGlkYXRlXCJdXSxcblx0W1wibWFudWFsXCIsIFtcIkBtYW51YWxcIl1dLFxuXHRbXCJjdXN0b21cIiwgW1wiQGN1c3RvbVwiXV0sXG5cdFtcInJlc29sdmVkXCIsIFtcIkByZXNvbHZlZFwiXV0sXG5cdFtcInNldEFsbFwiLCBbXCJAc2V0QWxsXCJdXSxcblx0W1wiYWRkQWxsXCIsIFtcIkBhZGRBbGxcIl1dLFxuXHRbXCJkZWxldGVBbGxcIiwgW1wiQGRlbGV0ZUFsbFwiLCBcIkBjbGVhclwiXV1cbl0pO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAdHJpZ2dlckNhbm9uaWNhbE5hbWVzXCIpO1xuZ2xvYmFsVGhpc1t0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2xdID8/PSBuZXcgTWFwKEFycmF5LmZyb20odHJpZ2dlckFsaWFzZXMuZW50cmllcygpKS5mbGF0TWFwKChbY2Fub25pY2FsLCBhbGlhc2VzXSkgPT4gYWxpYXNlcy5tYXAoKGFsaWFzKSA9PiBbYWxpYXMsIGNhbm9uaWNhbF0pKSk7XG52YXIgdHJpZ2dlckNhbm9uaWNhbE5hbWVzID0gZ2xvYmFsVGhpc1t0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2xdO1xudmFyIG5vcm1hbGl6ZVRyaWdnZXJOYW1lID0gKHRyaWdnZXIgPSBcInNldFwiKSA9PiB7XG5cdGlmICh0cmlnZ2VyID09IG51bGwpIHJldHVybiB0cmlnZ2VyO1xuXHRjb25zdCBuYW1lID0gU3RyaW5nKHRyaWdnZXIgfHwgXCJzZXRcIik7XG5cdHJldHVybiB0cmlnZ2VyQ2Fub25pY2FsTmFtZXMuZ2V0KG5hbWUpID8/IG5hbWU7XG59O1xudmFyIHRyaWdnZXJOYW1lc09mID0gKHRyaWdnZXIpID0+IHtcblx0Y29uc3QgbmFtZSA9IHRyaWdnZXIgPT0gbnVsbCA/IFwiYWxsXCIgOiBTdHJpbmcobm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gXCJhbGxcIik7XG5cdHJldHVybiBbbmFtZSwgLi4udHJpZ2dlckFsaWFzZXMuZ2V0KG5hbWUpID8/IFtdXTtcbn07XG52YXIgZXhwYW5kVHJpZ2dlckZpbHRlciA9ICh0eXBlcyA9IFtcIipcIl0pID0+IHtcblx0cmV0dXJuIG5ldyBTZXQoWy4uLm5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHlwZXMpXS5mbGF0TWFwKChuYW1lKSA9PiBbbmFtZSwgLi4udHJpZ2dlckFsaWFzZXMuZ2V0KG5hbWUpID8/IFtdXSkpO1xufTtcbnZhciBub3JtYWxpemVUcmlnZ2VyRmlsdGVyID0gKHRyaWdnZXJzID0gW1wiKlwiXSkgPT4ge1xuXHRjb25zdCBsaXN0ID0gdHlwZW9mIHRyaWdnZXJzID09IFwic3RyaW5nXCIgPyBbdHJpZ2dlcnNdIDogQXJyYXkuZnJvbSh0cmlnZ2VycyA/PyBbXCIqXCJdKTtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5ldyBTZXQobGlzdC5tYXAoKGl0ZW0pID0+IHtcblx0XHRjb25zdCBuYW1lID0gU3RyaW5nKGl0ZW0gfHwgXCIqXCIpO1xuXHRcdHJldHVybiB3aWxkY2FyZFRyaWdnZXJzLmhhcyhuYW1lKSA/IG5hbWUgOiBTdHJpbmcobm9ybWFsaXplVHJpZ2dlck5hbWUobmFtZSkgPz8gbmFtZSk7XG5cdH0pKTtcblx0cmV0dXJuIG5vcm1hbGl6ZWQuc2l6ZSA/IG5vcm1hbGl6ZWQgOiAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCJdKTtcbn07XG52YXIgdHJpZ2dlckZpbHRlckFsbG93cyA9ICh0cmlnZ2VycywgdHJpZ2dlcikgPT4ge1xuXHRjb25zdCBmaWx0ZXIgPSB0cmlnZ2VycyBpbnN0YW5jZW9mIFNldCA/IHRyaWdnZXJzIDogbm9ybWFsaXplVHJpZ2dlckZpbHRlcih0cmlnZ2Vycyk7XG5cdHJldHVybiBbLi4ud2lsZGNhcmRUcmlnZ2Vyc10uc29tZSgobmFtZSkgPT4gZmlsdGVyLmhhcyhuYW1lKSkgfHwgdHJpZ2dlck5hbWVzT2YodHJpZ2dlcikuc29tZSgobmFtZSkgPT4gZmlsdGVyLmhhcyhuYW1lKSk7XG59O1xudmFyIGlzT3B0aW9uc09iamVjdCA9IChvcHRpb25zKSA9PiB7XG5cdHJldHVybiAhIW9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShvcHRpb25zKSAmJiAoXCJhZmZlY3RUeXBlc1wiIGluIG9wdGlvbnMgfHwgXCJ0cmlnZ2Vyc1wiIGluIG9wdGlvbnMgfHwgXCJ0cmlnZ2VySW1tZWRpYXRlbHlcIiBpbiBvcHRpb25zKTtcbn07XG52YXIgbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zID0gKG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmIChpc09wdGlvbnNPYmplY3Qob3B0aW9ucykpIHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucy5hZmZlY3RUeXBlcyA/PyBvcHRpb25zLnRyaWdnZXJzID8/IFtcIipcIl0pLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogb3B0aW9ucy50cmlnZ2VySW1tZWRpYXRlbHkgIT09IGZhbHNlXG5cdH07XG5cdGNvbnN0IGFmZmVjdFR5cGVzID0gbm9ybWFsaXplVHJpZ2dlckZpbHRlcihvcHRpb25zKTtcblx0cmV0dXJuIHtcblx0XHRhZmZlY3RUeXBlcyxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IHRyaWdnZXJGaWx0ZXJBbGxvd3MoYWZmZWN0VHlwZXMsIFwiaW5pdGlhbFwiKVxuXHR9O1xufTtcbnZhciBub3JtYWxpemVFZmZlY3RPcHRpb25zID0gKG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGlmIChpc09wdGlvbnNPYmplY3Qob3B0aW9ucykpIHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucy5hZmZlY3RUeXBlcyA/PyBvcHRpb25zLnRyaWdnZXJzID8/IFtcIipcIl0pLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogb3B0aW9ucy50cmlnZ2VySW1tZWRpYXRlbHkgPT09IHRydWVcblx0fTtcblx0cmV0dXJuIHtcblx0XHRhZmZlY3RUeXBlczogbm9ybWFsaXplVHJpZ2dlckZpbHRlcihvcHRpb25zKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IGZhbHNlXG5cdH07XG59O1xudmFyIFN1YnNjcmlwdFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAU3Vic2NyaXB0XCIpO1xuZ2xvYmFsVGhpc1tTdWJzY3JpcHRTeW1ib2xdID8/PSBjbGFzcyBTdWJzY3JpcHQge1xuXHRjb21wYXRpYmxlO1xuXHQjc291cmNlO1xuXHQjbGlzdGVuZXJzO1xuXHQjZmxhZ3MgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtTZXQoKTtcblx0I25hdGl2ZTtcblx0I2l0ZXJhdG9yO1xuXHQjaW5EaXNwYXRjaCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCNkaXNhYmxlZFRyaWdnZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0I3RyaWdnZXJDb250cm9sO1xuXHQjcGVuZGluZyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNwZW5kaW5nQnlQcm9wID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0I2ZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5cdGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuXHRcdHRoaXMuI3NvdXJjZSA9IHNvdXJjZTtcblx0XHR0aGlzLiNsaXN0ZW5lcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdHRoaXMuI2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdFx0dGhpcy4jdHJpZ2dlckNvbnRyb2wgPSB7XG5cdFx0XHRlbmFibGU6ICh0eXBlcyA9IFtcIipcIl0sIGNiKSA9PiBjYiA/IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgdHJ1ZSksXG5cdFx0XHRkaXNhYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSA6IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBmYWxzZSksXG5cdFx0XHRzZXQ6ICh0eXBlcywgZW5hYmxlZCkgPT4gdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIGVuYWJsZWQpLFxuXHRcdFx0d2l0aDogKHR5cGVzLCBjYikgPT4gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIHRydWUsIGNiKSxcblx0XHRcdHdpdGhvdXQ6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCBmYWxzZSwgY2IpLFxuXHRcdFx0aXNFbmFibGVkOiAodHJpZ2dlcikgPT4gdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpXG5cdFx0fTtcblx0XHR0aGlzLiNpdGVyYXRvciA9IHsgbmV4dDogKGFyZ3MpID0+IHtcblx0XHRcdGlmIChhcmdzKSBBcnJheS5pc0FycmF5KGFyZ3MpID8gdGhpcy4jZGlzcGF0Y2goLi4uYXJncykgOiB0aGlzLiNkaXNwYXRjaChhcmdzKTtcblx0XHR9IH07XG5cdFx0Y29uc3Qgd2VhayA9IG5ldyBXZWFrUmVmKHRoaXMpO1xuXHRcdGNvbnN0IGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzdWJzY3JpYmVyKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gc3Vic2NyaWJlcj8ubmV4dD8uYmluZD8uKHN1YnNjcmliZXIpO1xuXHRcdFx0cmV0dXJuIGNvbXBsZXRlV2l0aFVuc3ViKHN1YnNjcmliZXIsIHdlYWssIGhhbmRsZXIpO1xuXHRcdH07XG5cdFx0dGhpcy4jbmF0aXZlID0gdHlwZW9mIE9ic2VydmFibGUgIT0gXCJ1bmRlZmluZWRcIiA/IG5ldyBPYnNlcnZhYmxlKGNvbnRyb2xsZXIpIDogbnVsbDtcblx0XHR0aGlzLmNvbXBhdGlibGUgPSAoKSA9PiB0aGlzLiNuYXRpdmU7XG5cdH1cblx0YmluZFNvdXJjZShzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPz89IHNvdXJjZTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHQkc2FmZUV4ZWMoY2IsIC4uLmFyZ3MpIHtcblx0XHRpZiAoIWNiIHx8IHRoaXMuI2ZsYWdzLmhhcyhjYikpIHJldHVybjtcblx0XHR0aGlzLiNmbGFncy5hZGQoY2IpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXMgPSBjYiguLi5hcmdzKTtcblx0XHRcdGlmIChyZXMgJiYgdHlwZW9mIHJlcy50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0cmVzLmNhdGNoKGNvbnNvbGUud2Fybik7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXM7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHR0aGlzLiNmbGFncy5kZWxldGUoY2IpO1xuXHRcdH1cblx0fVxuXHQjZGlzcGF0Y2gobmFtZSwgdmFsdWUgPSBudWxsLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwiYWxsXCIsIC4uLmV0Yykge1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuI2xpc3RlbmVycztcblx0XHRpZiAobGlzdGVuZXJzPy5zaXplKSB7XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgcmVjb3JkXSBvZiBsaXN0ZW5lcnMuZW50cmllcygpKSBpZiAoKHJlY29yZC5wcm9wID09PSBuYW1lIHx8IHJlY29yZC5wcm9wID09PSBmb3JBbGwgfHwgcmVjb3JkLnByb3AgPT09IG51bGwpICYmIHRyaWdnZXJGaWx0ZXJBbGxvd3MocmVjb3JkLnRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgdHJpZ2dlciwgLi4uZXRjKTtcblx0XHR9XG5cdFx0aWYgKGdsb2JhbEVmZmVjdExpc3RlbmVycy5zaXplKSB7XG5cdFx0XHRjb25zdCBldmVudCA9IHtcblx0XHRcdFx0c291cmNlOiB0aGlzLiNzb3VyY2UsXG5cdFx0XHRcdHRhcmdldDogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0cHJvcDogbmFtZSxcblx0XHRcdFx0bmFtZSxcblx0XHRcdFx0b2xkVmFsdWUsXG5cdFx0XHRcdHRyaWdnZXIsXG5cdFx0XHRcdGFyZ3M6IGV0Y1xuXHRcdFx0fTtcblx0XHRcdGZvciAoY29uc3QgW2NiLCB0cmlnZ2Vyc10gb2YgZ2xvYmFsRWZmZWN0TGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKHRyaWdnZXJGaWx0ZXJBbGxvd3ModHJpZ2dlcnMsIHRyaWdnZXIpKSB0aGlzLiRzYWZlRXhlYyhjYiwgZXZlbnQpO1xuXHRcdH1cblx0fVxuXHR3cmFwKG53KSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkobncpKSByZXR1cm4gd3JhcFdpdGgobncsIHRoaXMpO1xuXHRcdHJldHVybiBudztcblx0fVxuXHRnZXQgdHJpZ2dlckNvbnRyb2woKSB7XG5cdFx0cmV0dXJuIHRoaXMuI3RyaWdnZXJDb250cm9sO1xuXHR9XG5cdGlzVHJpZ2dlckVuYWJsZWQodHJpZ2dlcikge1xuXHRcdHJldHVybiAhdHJpZ2dlckZpbHRlckFsbG93cyh0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLCBcImFsbFwiKSAmJiAhdHJpZ2dlck5hbWVzT2YodHJpZ2dlcikuc29tZSgobmFtZSkgPT4gdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5oYXMobmFtZSkpO1xuXHR9XG5cdHNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcyA9IFtcIipcIl0sIGVuYWJsZWQgPSB0cnVlKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBleHBhbmRUcmlnZ2VyRmlsdGVyKHR5cGVzKTtcblx0XHRmb3IgKGNvbnN0IG5hbWUgb2YgbmFtZXMpIGlmIChlbmFibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRlbHNlIHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuYWRkKG5hbWUpO1xuXHR9XG5cdHdpdGhUcmlnZ2Vycyh0eXBlcywgZW5hYmxlZCwgY2IpIHtcblx0XHRjb25zdCBuYW1lcyA9IFsuLi5leHBhbmRUcmlnZ2VyRmlsdGVyKHR5cGVzKV07XG5cdFx0Y29uc3QgcHJldmlvdXMgPSBuZXcgTWFwKG5hbWVzLm1hcCgobmFtZSkgPT4gW25hbWUsIHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpXSkpO1xuXHRcdGNvbnN0IHJlc3RvcmUgPSAoKSA9PiB7XG5cdFx0XHRwcmV2aW91cy5mb3JFYWNoKCh3YXNEaXNhYmxlZCwgbmFtZSkgPT4ge1xuXHRcdFx0XHRpZiAod2FzRGlzYWJsZWQpIHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuYWRkKG5hbWUpO1xuXHRcdFx0XHRlbHNlIHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuZGVsZXRlKG5hbWUpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHR0aGlzLnNldFRyaWdnZXJzRW5hYmxlZChuYW1lcywgZW5hYmxlZCk7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGNiPy4oKTtcblx0XHRcdGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdC5maW5hbGx5ID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHJlc3VsdC5maW5hbGx5KHJlc3RvcmUpO1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRyZXN0b3JlKCk7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhZmZlY3RlZChjYiwgcHJvcCwgb3B0aW9ucyA9IFtcIipcIl0pIHtcblx0XHRpZiAoY2IgPT0gbnVsbCB8fCB0eXBlb2YgY2IgIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdFx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKTtcblx0XHR0aGlzLiNsaXN0ZW5lcnMuc2V0KGNiLCB7XG5cdFx0XHRwcm9wOiBwcm9wIHx8IGZvckFsbCxcblx0XHRcdHRyaWdnZXJzOiBub3JtYWxpemVkLmFmZmVjdFR5cGVzXG5cdFx0fSk7XG5cdFx0cmV0dXJuICgpID0+IHRoaXMudW5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwpO1xuXHR9XG5cdHVuYWZmZWN0ZWQoY2IsIHByb3ApIHtcblx0XHRpZiAoY2IgIT0gbnVsbCAmJiB0eXBlb2YgY2IgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0XHRjb25zdCByZWNvcmQgPSBsaXN0ZW5lcnM/LmdldChjYik7XG5cdFx0XHRpZiAocmVjb3JkICYmIChyZWNvcmQucHJvcCA9PSBwcm9wIHx8IHByb3AgPT0gbnVsbCB8fCBwcm9wID09IGZvckFsbCkpIHtcblx0XHRcdFx0bGlzdGVuZXJzLmRlbGV0ZShjYik7XG5cdFx0XHRcdHJldHVybiAoKSA9PiB0aGlzLmFmZmVjdGVkKGNiLCBwcm9wIHx8IGZvckFsbCwgcmVjb3JkLnRyaWdnZXJzKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuI2xpc3RlbmVycy5jbGVhcigpO1xuXHR9XG5cdHRyaWdnZXIobmFtZSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyID0gXCJzZXRcIiwgLi4uZXRjKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09PSBcInN5bWJvbFwiKSByZXR1cm47XG5cdFx0aWYgKHRyaWdnZXIgPT09IHZvaWQgMCkgdHJpZ2dlciA9IFwic2V0XCI7XG5cdFx0dHJpZ2dlciA9IG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IHRyaWdnZXI7XG5cdFx0aWYgKCF0aGlzLmlzVHJpZ2dlckVuYWJsZWQodHJpZ2dlcikpIHJldHVybjtcblx0XHRjb25zdCBvcEtleSA9IGAke3RyaWdnZXIgPz8gXCJhbGxcIn1gO1xuXHRcdGxldCBieU9wID0gdGhpcy4jcGVuZGluZ0J5UHJvcC5nZXQobmFtZSk7XG5cdFx0aWYgKCFieU9wKSB7XG5cdFx0XHRieU9wID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdHRoaXMuI3BlbmRpbmdCeVByb3Auc2V0KG5hbWUsIGJ5T3ApO1xuXHRcdH1cblx0XHRieU9wLnNldChvcEtleSwgW1xuXHRcdFx0bmFtZSxcblx0XHRcdHZhbHVlLFxuXHRcdFx0b2xkVmFsdWUsXG5cdFx0XHR0cmlnZ2VyLFxuXHRcdFx0ZXRjXG5cdFx0XSk7XG5cdFx0aWYgKHRoaXMuI2ZsdXNoU2NoZWR1bGVkKSByZXR1cm47XG5cdFx0dGhpcy4jZmx1c2hTY2hlZHVsZWQgPSB0cnVlO1xuXHRcdHNjaGVkdWxlcj8ueWllbGQ/LigpPy50aGVuPy4oKCkgPT4ge1xuXHRcdFx0dGhpcy4jZmx1c2hTY2hlZHVsZWQgPSBmYWxzZTtcblx0XHRcdGNvbnN0IGJhdGNoID0gdGhpcy4jcGVuZGluZ0J5UHJvcDtcblx0XHRcdHRoaXMuI3BlbmRpbmdCeVByb3AgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0Zm9yIChjb25zdCBbcHJvcCwgb3BNYXBdIG9mIGJhdGNoKSB7XG5cdFx0XHRcdGlmIChwcm9wICE9IG51bGwgJiYgdGhpcy4jaW5EaXNwYXRjaC5oYXMocHJvcCkpIGNvbnRpbnVlO1xuXHRcdFx0XHRpZiAocHJvcCAhPSBudWxsKSB0aGlzLiNpbkRpc3BhdGNoLmFkZChwcm9wKTtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IFssIGFyZ3NdIG9mIG9wTWFwKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBbbm0sIHYsIG92LCB0ZywgcmVzdF0gPSBhcmdzO1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0dGhpcy4jZGlzcGF0Y2gobm0sIHYsIG92LCB0ZywgLi4ucmVzdCA/PyBbXSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCkgdGhpcy4jaW5EaXNwYXRjaC5kZWxldGUocHJvcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRnZXQgaXRlcmF0b3IoKSB7XG5cdFx0cmV0dXJuIHRoaXMuI2l0ZXJhdG9yO1xuXHR9XG59O1xudmFyIFN1YnNjcmlwdCA9IGdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXTtcblxuLy8gc3JjL2NvcmUvUmVzb2x2ZWQudHNcbnZhciByYXdPZiA9ICh0YXJnZXQpID0+IHtcblx0Y29uc3QgdW53cmFwcGVkID0gZGVyZWYodGFyZ2V0KTtcblx0cmV0dXJuIHVud3JhcHBlZD8uWyRleHRyYWN0S2V5JF0gPz8gdW53cmFwcGVkO1xufTtcbmZ1bmN0aW9uIHJlc29sdmVkKHRhcmdldCwgbW9kZSA9IFwiYWxsXCIpIHtcblx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KTtcblx0aWYgKGlzUHJvbWlzZShyYXcpKSByZXR1cm4gcmVzb2x2ZWQkMShyYXcsIG1vZGUpO1xuXHRpZiAoaXNQcm9taXNlKHJhdz8uWyRwcm9taXNlXSkpIHJldHVybiByZXNvbHZlZCQxKHJhd1skcHJvbWlzZV0sIG1vZGUpO1xuXHRyZXR1cm4gcmVzb2x2ZWQkMShyYXcgPz8gdGFyZ2V0LCBtb2RlKTtcbn1cbmZ1bmN0aW9uIG1ha2VSZXNvbHZlZE9wKHRhcmdldCwgZW1pdCA9IGZhbHNlKSB7XG5cdGNvbnN0IHJ1biA9ICgobW9kZSA9IFwiYWxsXCIpID0+IHtcblx0XHRjb25zdCBwZW5kaW5nID0gcmVzb2x2ZWQodGFyZ2V0LCBtb2RlKTtcblx0XHRpZiAoIWVtaXQpIHJldHVybiBwZW5kaW5nO1xuXHRcdHJldHVybiBwZW5kaW5nLnRoZW4oKHZhbHVlKSA9PiB7XG5cdFx0XHRjb25zdCByYXcgPSByYXdPZih0YXJnZXQpO1xuXHRcdFx0Y29uc3Qga2V5ID0gcmF3Py5yZWFsUHJvcCA/PyAocmF3ICYmIFwidmFsdWVcIiBpbiByYXcgPyBcInZhbHVlXCIgOiBudWxsKTtcblx0XHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChyYXcpPy50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgdm9pZCAwLCBcInJlc29sdmVkXCIpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0pO1xuXHR9KTtcblx0cnVuLmFsbCA9ICgpID0+IHJ1bihcImFsbFwiKTtcblx0cnVuLmFsbFNldHRsZWQgPSAoKSA9PiBydW4oXCJzZXR0bGVkXCIpO1xuXHRydW4uYWxsS2V5ZWQgPSAoKSA9PiBydW4oXCJhbGxcIik7XG5cdHJ1bi5hbGxTZXR0bGVkS2V5ZWQgPSAoKSA9PiBydW4oXCJzZXR0bGVkXCIpO1xuXHRydW4udHJ5ID0gKGNhbGxiYWNrT3JWYWx1ZSwgLi4uYXJncykgPT4gUHJvbWlzZS50cnkoY2FsbGJhY2tPclZhbHVlLCAuLi5hcmdzKS50aGVuKCh2YWx1ZSkgPT4gcmVzb2x2ZWQodmFsdWUgPz8gdGFyZ2V0LCBcImFsbFwiKSk7XG5cdHJldHVybiBydW47XG59XG5mdW5jdGlvbiBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBrZXksIHZhbHVlLCBvbGRWYWx1ZSkge1xuXHRjb25zdCByYXcgPSByYXdPZih0YXJnZXQpID8/IHRhcmdldDtcblx0c3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHJhdyk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgXCJyZXNvbHZlZFwiKTtcbn1cbmZ1bmN0aW9uIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyhsaXZlLCByYXcpIHtcblx0aWYgKGxpdmUgPT0gbnVsbCB8fCByYXcgPT0gbnVsbCkgcmV0dXJuIGxpdmU7XG5cdGlmIChBcnJheS5pc0FycmF5KHJhdykpIHtcblx0XHRyYXcuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cdFx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZVtpbmRleF0gPSB2YWx1ZTtcblx0XHR9KTtcblx0XHRyZXR1cm4gbGl2ZTtcblx0fVxuXHRpZiAocmF3IGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgcmF3LmVudHJpZXMoKSkgaWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmUuc2V0KGtleSwgdmFsdWUpO1xuXHRcdHJldHVybiBsaXZlO1xuXHR9XG5cdGlmIChyYXcgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBsaXZlO1xuXHRmb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMocmF3KSkge1xuXHRcdGlmIChrZXkgPT0gJGV4dHJhY3RLZXkkIHx8IGtleSA9PSAkcHJvbWlzZSB8fCBrZXkgPT0gJHJlc29sdmVkKSBjb250aW51ZTtcblx0XHRpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocmF3LCBrZXkpPy5lbnVtZXJhYmxlKSBjb250aW51ZTtcblx0XHRjb25zdCB2YWx1ZSA9IHJhd1trZXldO1xuXHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlW2tleV0gPSB2YWx1ZTtcblx0fVxuXHRyZXR1cm4gbGl2ZTtcbn1cblxuLy8gc3JjL2NvcmUvU3BlY2lmaWMudHNcbnZhciBfX3NhZmVHZXRHdWFyZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAX19zYWZlR2V0R3VhcmRcIik7XG52YXIgcmVhY3RpdmVQcm9wZXJ0aWVzU3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC50c0ByZWFjdGl2ZVByb3BlcnRpZXNcIik7XG52YXIgcmVhY3RpdmVQcm9wZXJ0aWVzID0gZ2xvYmFsVGhpc1tyZWFjdGl2ZVByb3BlcnRpZXNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciByZWFjdGl2ZU1ldGhvZHNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHJlYWN0aXZlTWV0aG9kc1wiKTtcbnZhciByZWFjdGl2ZU1ldGhvZHMgPSBnbG9iYWxUaGlzW3JlYWN0aXZlTWV0aG9kc1N5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gbWFya1JlYWN0aXZlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcblx0bGV0IGtleXMgPSByZWFjdGl2ZVByb3BlcnRpZXMuZ2V0KHRhcmdldCk7XG5cdGlmICgha2V5cykgcmVhY3RpdmVQcm9wZXJ0aWVzLnNldCh0YXJnZXQsIGtleXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0a2V5cy5hZGQoa2V5KTtcbn1cbmZ1bmN0aW9uIGlzUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuXHRmb3IgKGxldCBjdXJyZW50ID0gdGFyZ2V0OyBjdXJyZW50OyBjdXJyZW50ID0gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihjdXJyZW50KSkgaWYgKHJlYWN0aXZlUHJvcGVydGllcy5nZXQoY3VycmVudCk/LmhhcyhrZXkpKSByZXR1cm4gdHJ1ZTtcblx0cmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gbm90aWZ5UmVhY3RpdmVQcm9wZXJ0eShyZWNlaXZlciwgb3duZXIsIGtleSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG5cdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHJlY2VpdmVyKSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQob3duZXIpO1xuXHRjb25zdCB0cmlnZ2VyTmFtZSA9IHRyaWdnZXJLZXlPZihyZWNlaXZlciwga2V5KTtcblx0aWYgKChzYWZlR2V0KHJlY2VpdmVyLCAkaXNOb3RFcXVhbCkgPz8gaXNOb3RFcXVhbCkob2xkVmFsdWUsIG5ld1ZhbHVlKSkgcmVnaXN0cnk/LnRyaWdnZXI/Lih0cmlnZ2VyTmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcblx0aWYgKGlzUHJvbWlzZShuZXdWYWx1ZSkpIGVtaXRSZXNvbHZlZChyZWNlaXZlciwgdHJpZ2dlck5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG59XG5mdW5jdGlvbiBkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KHRhcmdldCwga2V5LCB2YWx1ZSkge1xuXHRjb25zdCBkZXNjcmlwdG9yID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRpZiAoIWRlc2NyaXB0b3IgfHwgIWRlc2NyaXB0b3IuY29uZmlndXJhYmxlKSByZXR1cm4gZmFsc2U7XG5cdGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLndyaXRhYmxlID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuXHRpZiAoaXNSZWFjdGl2ZVByb3BlcnR5KHRhcmdldCwga2V5KSkgcmV0dXJuIHRydWU7XG5cdGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikge1xuXHRcdGNvbnN0IGluaXRpYWxWYWx1ZSA9IGRlc2NyaXB0b3IudmFsdWU7XG5cdFx0Y29uc3QgdmFsdWVzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdFx0dmFsdWVzLnNldCh0YXJnZXQsIGluaXRpYWxWYWx1ZSk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xuXHRcdFx0ZW51bWVyYWJsZTogZGVzY3JpcHRvci5lbnVtZXJhYmxlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0KCkge1xuXHRcdFx0XHRyZXR1cm4gdmFsdWVzLmhhcyh0aGlzKSA/IHZhbHVlcy5nZXQodGhpcykgOiBpbml0aWFsVmFsdWU7XG5cdFx0XHR9LFxuXHRcdFx0c2V0KG5leHRWYWx1ZSkge1xuXHRcdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHZhbHVlcy5oYXModGhpcykgPyB2YWx1ZXMuZ2V0KHRoaXMpIDogaW5pdGlhbFZhbHVlO1xuXHRcdFx0XHR2YWx1ZXMuc2V0KHRoaXMsIG5leHRWYWx1ZSk7XG5cdFx0XHRcdG5vdGlmeVJlYWN0aXZlUHJvcGVydHkodGhpcywgdGFyZ2V0LCBrZXksIG9sZFZhbHVlLCBuZXh0VmFsdWUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGlmIChyZXN1bHQpIG1hcmtSZWFjdGl2ZVByb3BlcnR5KHRhcmdldCwga2V5KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cdGlmICghZGVzY3JpcHRvci5zZXQpIHJldHVybiBmYWxzZTtcblx0Y29uc3QgbGFzdEFzc2lnbmVkID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdGNvbnN0IHByb3BlcnR5RGVzYyA9IHtcblx0XHQuLi5kZXNjcmlwdG9yLFxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRlbnVtZXJhYmxlOiBkZXNjcmlwdG9yLmVudW1lcmFibGUsXG5cdFx0c2V0OiBmdW5jdGlvbihuZXh0VmFsdWUpIHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gZGVzY3JpcHRvci5nZXQgPyBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpIDogbGFzdEFzc2lnbmVkLmdldCh0aGlzKTtcblx0XHRcdGRlc2NyaXB0b3Iuc2V0LmNhbGwodGhpcywgbmV4dFZhbHVlKTtcblx0XHRcdGNvbnN0IGFjdHVhbFZhbHVlID0gZGVzY3JpcHRvci5nZXQgPyBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpIDogbmV4dFZhbHVlO1xuXHRcdFx0aWYgKCFkZXNjcmlwdG9yLmdldCkgbGFzdEFzc2lnbmVkLnNldCh0aGlzLCBhY3R1YWxWYWx1ZSk7XG5cdFx0XHRub3RpZnlSZWFjdGl2ZVByb3BlcnR5KHRoaXMsIHRhcmdldCwga2V5LCBvbGRWYWx1ZSwgYWN0dWFsVmFsdWUpO1xuXHRcdH1cblx0fTtcblx0aWYgKGRlc2NyaXB0b3IuZ2V0KSBwcm9wZXJ0eURlc2MuZ2V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcyk7XG5cdH07XG5cdGlmICh2YWx1ZSAhPT0gdm9pZCAwICYmIHR5cGVvZiB2YWx1ZSAhPSBcInVuZGVmaW5lZFwiKSBsYXN0QXNzaWduZWQuc2V0KHRhcmdldCwgdmFsdWUpO1xuXHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBwcm9wZXJ0eURlc2MpO1xuXHRpZiAocmVzdWx0KSBtYXJrUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSk7XG5cdHJldHVybiByZXN1bHQ7XG59XG52YXIgX19zeXN0ZW1Ta2lwID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1xuXHRTeW1ib2wudG9TdHJpbmdUYWcsXG5cdFN5bWJvbC5pdGVyYXRvcixcblx0U3ltYm9sLmFzeW5jSXRlcmF0b3IsXG5cdFN5bWJvbC50b1ByaW1pdGl2ZSxcblx0XCJ0b1N0cmluZ1wiLFxuXHRcInZhbHVlT2ZcIixcblx0XCJpbnNwZWN0XCIsXG5cdFwiY29uc3RydWN0b3JcIixcblx0XCJfX3Byb3RvX19cIixcblx0XCJwcm90b3R5cGVcIixcblx0XCJ0aGVuXCIsXG5cdFwiY2F0Y2hcIixcblx0XCJmaW5hbGx5XCIsXG5cdFwibmV4dFwiXG5dKTtcbnZhciBzeXN0ZW1Ta2lwR2V0ID0gKHRhcmdldCwgbmFtZSkgPT4ge1xuXHRpZiAoIV9fc3lzdGVtU2tpcC5oYXMobmFtZSkpIHJldHVybiBudWxsO1xuXHRjb25zdCBnb3QgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdHJldHVybiB0eXBlb2YgZ290ID09PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgZ290KSA6IGdvdDtcbn07XG52YXIgX19zYWZlR2V0R3VhcmQgPSBnbG9iYWxUaGlzW19fc2FmZUdldEd1YXJkU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBpc0dldHRlcihvYmosIHByb3BOYW1lKSB7XG5cdGxldCBnb3QgPSB0cnVlO1xuXHR0cnkge1xuXHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKHByb3BOYW1lKTtcblx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/Lmhhcz8uKHByb3BOYW1lKSkgZ290ID0gdHJ1ZTtcblx0XHRnb3QgPSB0eXBlb2YgUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBwcm9wTmFtZSk/LmdldCA9PSBcImZ1bmN0aW9uXCI7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRnb3QgPSB0cnVlO1xuXHR9IGZpbmFsbHkge1xuXHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/LihvYmopPy5kZWxldGU/Lihwcm9wTmFtZSk7XG5cdH1cblx0cmV0dXJuIGdvdDtcbn1cbnZhciBmYWxsVGhyb3VnaCA9IChvYmosIGtleSkgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUob2JqKSkgcmV0dXJuIG9iajtcblx0Y29uc3QgdmFsdWUgPSBzYWZlR2V0KG9iaiwga2V5KTtcblx0aWYgKHZhbHVlID09IG51bGwgJiYga2V5ICE9IFwidmFsdWVcIikge1xuXHRcdGNvbnN0IHRtcCA9IHNhZmVHZXQob2JqLCBcInZhbHVlXCIpO1xuXHRcdGlmICh0bXAgIT0gbnVsbCAmJiAhaXNQcmltaXRpdmUodG1wKSkgcmV0dXJuIGZhbGxUaHJvdWdoKHRtcCwga2V5KTtcblx0XHRlbHNlIHJldHVybiB2YWx1ZTtcblx0fSBlbHNlIGlmIChrZXkgPT0gXCJ2YWx1ZVwiICYmIHZhbHVlICE9IG51bGwgJiYgIWlzUHJpbWl0aXZlKHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsbFRocm91Z2godmFsdWUsIGtleSkgPz8gdmFsdWUgPz8gb2JqO1xuXHRyZXR1cm4gdmFsdWUgPz8gb2JqO1xufTtcbnZhciBzYWZlU2V0ID0gKG9iaiwga2V5LCB2YWx1ZSkgPT4ge1xuXHRpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcblx0bGV0IGFjdGl2ZSA9IF9fc2FmZVNldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdGlmIChhY3RpdmU/Lmhhcz8uKGtleSkpIHJldHVybiBmYWxzZTtcblx0YWN0aXZlPy5hZGQ/LihrZXkpO1xuXHRyZXR1cm4gUmVmbGVjdC5zZXQob2JqLCBrZXksIHZhbHVlKTtcbn07XG52YXIgc2FmZUdldCA9IChvYmosIGtleSwgcmVjKSA9PiB7XG5cdGxldCByZXN1bHQgPSB2b2lkIDA7XG5cdGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcblx0bGV0IGFjdGl2ZSA9IF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdGlmIChhY3RpdmU/Lmhhcz8uKGtleSkpIHJldHVybiBudWxsO1xuXHRpZiAoIWlzR2V0dGVyKG9iaiwga2V5KSkgcmVzdWx0ID8/PSBSZWZsZWN0LmdldChvYmosIGtleSwgcmVjICE9IG51bGwgPyByZWMgOiBvYmopO1xuXHRlbHNlIHtcblx0XHRhY3RpdmU/LmFkZD8uKGtleSk7XG5cdFx0dHJ5IHtcblx0XHRcdHJlc3VsdCA9IFJlZmxlY3QuZ2V0KG9iaiwga2V5LCByZWMgIT0gbnVsbCA/IHJlYyA6IG9iaik7XG5cdFx0fSBjYXRjaCAoX2UpIHtcblx0XHRcdHJlc3VsdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0YWN0aXZlLmRlbGV0ZShrZXkpO1xuXHRcdFx0aWYgKGFjdGl2ZT8uc2l6ZSA9PT0gMCkgX19zYWZlR2V0R3VhcmQ/LmRlbGV0ZT8uKG9iaik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0eXBlb2YgcmVzdWx0ID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgob2JqLCByZXN1bHQpIDogcmVzdWx0O1xufTtcbnZhciBoYXNPd24gPSAob2JqLCBrZXkpID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG52YXIgaXNUcmlnZ2VyRW1pdE9wdGlvbnMgPSAodmFsdWUsIGFsbG93VmFsdWVPbmx5ID0gZmFsc2UpID0+IHtcblx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIChoYXNPd24odmFsdWUsIFwia2V5XCIpIHx8IGhhc093bih2YWx1ZSwgXCJuYW1lXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvbGRWYWx1ZVwiKSB8fCBoYXNPd24odmFsdWUsIFwib2xkXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvcFwiKSB8fCBoYXNPd24odmFsdWUsIFwidHJpZ2dlclwiKSB8fCBhbGxvd1ZhbHVlT25seSAmJiBoYXNPd24odmFsdWUsIFwidmFsdWVcIikpO1xufTtcbnZhciB0cmlnZ2VyT3B0aW9uVmFsdWUgPSAob3B0aW9ucywga2V5LCBmYWxsYmFjaykgPT4ge1xuXHRpZiAoaGFzT3duKG9wdGlvbnMsIGtleSkpIHJldHVybiBvcHRpb25zW2tleV07XG5cdGlmIChrZXkgPT0gXCJvbGRWYWx1ZVwiICYmIGhhc093bihvcHRpb25zLCBcIm9sZFwiKSkgcmV0dXJuIG9wdGlvbnMub2xkO1xuXHRyZXR1cm4gZmFsbGJhY2soKTtcbn07XG52YXIgdHJpZ2dlck9wdGlvblRyaWdnZXIgPSAob3B0aW9ucywgZmFsbGJhY2sgPSBcIm1hbnVhbFwiKSA9PiBub3JtYWxpemVUcmlnZ2VyTmFtZShvcHRpb25zLnRyaWdnZXIgPz8gb3B0aW9ucy5vcCA/PyBmYWxsYmFjayk7XG52YXIgaXNSdW50aW1lS2V5ID0gKGtleSkgPT4gdHlwZW9mIGtleSA9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBrZXkgPT0gXCJudW1iZXJcIiB8fCB0eXBlb2Yga2V5ID09IFwic3ltYm9sXCI7XG52YXIgcmVhbFByb3BPZiQxID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCBwcm9wID0gc2FmZUdldCh0YXJnZXQsICRyZWFsUHJvcCkgPz8gc2FmZUdldCh0YXJnZXQsIFwicmVhbFByb3BcIik7XG5cdHJldHVybiBpc1J1bnRpbWVLZXkocHJvcCkgPyBwcm9wIDogbnVsbDtcbn07XG52YXIgdHJpZ2dlcktleU9mID0gKHRhcmdldCwga2V5KSA9PiBrZXkgPT0gXCJ2YWx1ZVwiID8gcmVhbFByb3BPZiQxKHRhcmdldCkgPz8ga2V5IDoga2V5O1xudmFyIHRyaWdnZXJWYWx1ZU9mID0gKHRhcmdldCwga2V5KSA9PiB7XG5cdGNvbnN0IHJlYWxQcm9wID0gcmVhbFByb3BPZiQxKHRhcmdldCk7XG5cdGlmIChyZWFsUHJvcCAhPSBudWxsICYmIGtleSA9PSByZWFsUHJvcCkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpID8/IHNhZmVHZXQodGFyZ2V0LCBrZXkpO1xuXHRyZXR1cm4ga2V5ID09IG51bGwgPyB2b2lkIDAgOiBzYWZlR2V0KHRhcmdldCwga2V5KTtcbn07XG52YXIgY3JlYXRlVHJpZ2dlckFQSSA9IChyZWdpc3RyeSwgZW1pdCwgdGFyZ2V0KSA9PiB7XG5cdGNvbnN0IGFwaSA9IChrZXksIG9wT3JPcHRpb25zLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKCFpc1RyaWdnZXJFbWl0T3B0aW9ucyhvcE9yT3B0aW9ucykpIHRyaWdnZXIgPz89IG9wT3JPcHRpb25zO1xuXHRcdHJldHVybiBlbWl0KGlzVHJpZ2dlckVtaXRPcHRpb25zKGtleSkgPyBrZXkgOiBpc1RyaWdnZXJFbWl0T3B0aW9ucyhvcE9yT3B0aW9ucywgdHJ1ZSkgPyB7XG5cdFx0XHRrZXksXG5cdFx0XHR0cmlnZ2VyLFxuXHRcdFx0Li4ub3BPck9wdGlvbnNcblx0XHR9IDoge1xuXHRcdFx0a2V5LFxuXHRcdFx0dHJpZ2dlcjogdHJpZ2dlciA/PyBvcE9yT3B0aW9uc1xuXHRcdH0pO1xuXHR9O1xuXHRjb25zdCBjb250cm9sID0gcmVnaXN0cnk/LnRyaWdnZXJDb250cm9sO1xuXHRpZiAoY29udHJvbCkgT2JqZWN0LmFzc2lnbihhcGksIGNvbnRyb2wpO1xuXHRhcGkuY3VzdG9tID0gKHRyaWdnZXIsIGtleSwgdmFsdWUsIG9sZFZhbHVlKSA9PiBhcGkoe1xuXHRcdGtleSxcblx0XHR0cmlnZ2VyLFxuXHRcdHZhbHVlLFxuXHRcdG9sZFZhbHVlXG5cdH0pO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwpIGFwaS5yZXNvbHZlZCA9IG1ha2VSZXNvbHZlZE9wKHRhcmdldCwgdHJ1ZSk7XG5cdHJldHVybiBhcGk7XG59O1xudmFyIHN5c3RlbUdldCA9ICh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KSA9PiB7XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCBpc1ByaW1pdGl2ZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRpZiAoKFtcblx0XHRcImRlcmVmXCIsXG5cdFx0XCJiaW5kXCIsXG5cdFx0XCJAdGFyZ2V0XCIsXG5cdFx0JG9yaWdpbmFsS2V5JCxcblx0XHQkZXh0cmFjdEtleSQsXG5cdFx0JHJlZ2lzdHJ5S2V5JFxuXHRdLmluZGV4T2YobmFtZSkgPCAwID8gc2FmZUdldCh0YXJnZXQsIG5hbWUpPy5iaW5kPy4odGFyZ2V0KSA6IG51bGwpICE9IG51bGwpIHJldHVybiBudWxsO1xuXHRpZiAoWyRleHRyYWN0S2V5JCwgJG9yaWdpbmFsS2V5JF0uaW5kZXhPZihuYW1lKSA+PSAwKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IHRhcmdldDtcblx0aWYgKG5hbWUgPT0gJHZhbHVlKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpO1xuXHRpZiAobmFtZSA9PSAkcmVnaXN0cnlLZXkkKSByZXR1cm4gcmVnaXN0cnk7XG5cdGlmIChuYW1lID09ICRyZXNvbHZlZCB8fCBuYW1lID09IFwicmVzb2x2ZWRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwgXCJyZXNvbHZlZFwiKSkgcmV0dXJuIG1ha2VSZXNvbHZlZE9wKHRhcmdldCk7XG5cdGlmIChuYW1lID09ICR0cmlnZ2VyQ29udHJvbCkgcmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyQ29udHJvbDtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLm9ic2VydmFibGUpIHJldHVybiByZWdpc3RyeT8uY29tcGF0aWJsZTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLnN1YnNjcmliZSkgcmV0dXJuIChjYiwgcHJvcCwgb3B0aW9ucykgPT4gYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQsIGNiLCBvcHRpb25zKTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLml0ZXJhdG9yKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuYXN5bmNJdGVyYXRvcikgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLmRpc3Bvc2UpIHJldHVybiAocHJvcCkgPT4ge1xuXHRcdHNhZmVHZXQodGFyZ2V0LCBTeW1ib2wuZGlzcG9zZSk/Lihwcm9wKTtcblx0XHR1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0fTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLmFzeW5jRGlzcG9zZSkgcmV0dXJuIChwcm9wKSA9PiB7XG5cdFx0c2FmZUdldCh0YXJnZXQsIFN5bWJvbC5hc3luY0Rpc3Bvc2UpPy4ocHJvcCk7XG5cdFx0dW5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCk7XG5cdH07XG5cdGlmIChuYW1lID09IFN5bWJvbC51bnN1YnNjcmliZSkgcmV0dXJuIChwcm9wKSA9PiB1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcbn07XG52YXIgb2JzZXJ2YWJsZUFQSU1ldGhvZHMgPSAodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSkgPT4ge1xuXHRpZiAobmFtZSA9PSBcInN1YnNjcmliZVwiKSByZXR1cm4gcmVnaXN0cnk/LmNvbXBhdGlibGU/LltuYW1lXSA/PyAoKGhhbmRsZXIpID0+IHtcblx0XHRpZiAodHlwZW9mIGhhbmRsZXIgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gYWZmZWN0ZWQodGFyZ2V0LCBoYW5kbGVyKTtcblx0XHRlbHNlIGlmIChcIm5leHRcIiBpbiBoYW5kbGVyICYmIGhhbmRsZXI/Lm5leHQgIT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgdXN1YiA9IGFmZmVjdGVkKHRhcmdldCwgaGFuZGxlcj8ubmV4dCksIGNvbXAgPSBoYW5kbGVyPy5bXCJjb21wbGV0ZVwiXTtcblx0XHRcdGhhbmRsZXJbXCJjb21wbGV0ZVwiXSA9ICguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdHVzdWI/LigpO1xuXHRcdFx0XHRyZXR1cm4gY29tcD8uKC4uLmFyZ3MpO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBoYW5kbGVyW1wiY29tcGxldGVcIl07XG5cdFx0fVxuXHR9KTtcbn07XG52YXIgT2JzZXJ2ZUFycmF5TWV0aG9kID0gY2xhc3Mge1xuXHQjbmFtZTtcblx0I3NlbGY7XG5cdCNoYW5kbGU7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIHNlbGYsIGhhbmRsZSkge1xuXHRcdHRoaXMuI25hbWUgPSBuYW1lO1xuXHRcdHRoaXMuI3NlbGYgPSBzZWxmO1xuXHRcdHRoaXMuI2hhbmRsZSA9IGhhbmRsZTtcblx0fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCByZWMpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIG5hbWUsIHJlYyk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRsZXQgYWRkZWQgPSBbXSwgcmVtb3ZlZCA9IFtdO1xuXHRcdGxldCBzZXRQYWlycyA9IFtdO1xuXHRcdGxldCBvbGRTdGF0ZSA9IFsuLi50aGlzLiNzZWxmXTtcblx0XHRsZXQgaWR4ID0gLTE7XG5cdFx0Y29uc3QgcmVzdWx0ID0gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCB8fCB0aGlzLiNzZWxmLCBhcmdzKTtcblx0XHRpZiAodGhpcy4jaGFuZGxlPy5bJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkgcmV0dXJuIG9ic2VydmVBcnJheShyZXN1bHQpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0c3dpdGNoICh0aGlzLiNuYW1lKSB7XG5cdFx0XHRjYXNlIFwicHVzaFwiOlxuXHRcdFx0XHRpZHggPSBvbGRTdGF0ZT8ubGVuZ3RoO1xuXHRcdFx0XHRhZGRlZCA9IGFyZ3M7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInVuc2hpZnRcIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0YWRkZWQgPSBhcmdzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJwb3BcIjpcblx0XHRcdFx0aWR4ID0gb2xkU3RhdGU/Lmxlbmd0aCAtIDE7XG5cdFx0XHRcdGlmIChvbGRTdGF0ZS5sZW5ndGggPiAwKSByZW1vdmVkID0gW29sZFN0YXRlW2lkeF1dO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzaGlmdFwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRpZiAob2xkU3RhdGUubGVuZ3RoID4gMCkgcmVtb3ZlZCA9IFtvbGRTdGF0ZVtpZHhdXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic3BsaWNlXCI6XG5cdFx0XHRcdGlkeCA9IGFyZ3NbMF07XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5tYXgob2xkU3RhdGUubGVuZ3RoLCB0aGlzLiNzZWxmLmxlbmd0aCk7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IG9sZFZhbHVlID0gb2xkU3RhdGVbaV07XG5cdFx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSB0aGlzLiNzZWxmW2ldO1xuXHRcdFx0XHRcdGlmIChuZXdWYWx1ZSA9PT0gdm9pZCAwICYmIGkgPj0gdGhpcy4jc2VsZi5sZW5ndGgpIHJlbW92ZWQucHVzaChvbGRWYWx1ZSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAob2xkVmFsdWUgPT09IHZvaWQgMCAmJiBpID49IG9sZFN0YXRlLmxlbmd0aCkgc2V0UGFpcnMucHVzaChbXG5cdFx0XHRcdFx0XHRpLFxuXHRcdFx0XHRcdFx0bmV3VmFsdWUsXG5cdFx0XHRcdFx0XHR2b2lkIDAsXG5cdFx0XHRcdFx0XHRmYWxzZVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHRcdGVsc2UgaWYgKGlzTm90RXF1YWwob2xkVmFsdWUsIG5ld1ZhbHVlKSkgc2V0UGFpcnMucHVzaChbXG5cdFx0XHRcdFx0XHRpLFxuXHRcdFx0XHRcdFx0bmV3VmFsdWUsXG5cdFx0XHRcdFx0XHRvbGRWYWx1ZSxcblx0XHRcdFx0XHRcdHRydWVcblx0XHRcdFx0XHRdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzb3J0XCI6XG5cdFx0XHRjYXNlIFwiZmlsbFwiOlxuXHRcdFx0Y2FzZSBcInJldmVyc2VcIjpcblx0XHRcdGNhc2UgXCJjb3B5V2l0aGluXCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgb2xkU3RhdGUubGVuZ3RoOyBpKyspIGlmIChpc05vdEVxdWFsKG9sZFN0YXRlW2ldLCB0aGlzLiNzZWxmW2ldKSkgc2V0UGFpcnMucHVzaChbXG5cdFx0XHRcdFx0aWR4ICsgaSxcblx0XHRcdFx0XHR0aGlzLiNzZWxmW2ldLFxuXHRcdFx0XHRcdG9sZFN0YXRlW2ldLFxuXHRcdFx0XHRcdHRydWVcblx0XHRcdFx0XSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNldFwiOlxuXHRcdFx0XHRpZHggPSBhcmdzWzFdO1xuXHRcdFx0XHRzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRpZHgsXG5cdFx0XHRcdFx0YXJnc1swXSxcblx0XHRcdFx0XHRvbGRTdGF0ZT8uW2lkeF0sXG5cdFx0XHRcdFx0aWR4IGluIG9sZFN0YXRlXG5cdFx0XHRcdF0pO1xuXHRcdH1cblx0XHRjb25zdCByZWcgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGhpcy4jc2VsZik7XG5cdFx0aWYgKGFkZGVkPy5sZW5ndGggPT0gMSkgcmVnPy50cmlnZ2VyPy4oaWR4LCBhZGRlZFswXSwgbnVsbCwgXCJhZGRcIik7XG5cdFx0ZWxzZSBpZiAoYWRkZWQ/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgYWRkZWQsIG51bGwsIFwiYWRkQWxsXCIpO1xuXHRcdFx0YWRkZWQuZm9yRWFjaCgoaXRlbSwgSSkgPT4gcmVnPy50cmlnZ2VyPy4oaWR4ICsgSSwgaXRlbSwgbnVsbCwgXCJhZGRcIikpO1xuXHRcdH1cblx0XHRpZiAoc2V0UGFpcnM/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihzZXRQYWlyc1swXT8uWzBdID8/IGlkeCwgc2V0UGFpcnNbMF0/LlsxXSwgc2V0UGFpcnNbMF0/LlsyXSwgc2V0UGFpcnNbMF0/LlszXSA9PT0gZmFsc2UgPyBcImFkZFwiIDogXCJzZXRcIik7XG5cdFx0ZWxzZSBpZiAoc2V0UGFpcnM/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgc2V0UGFpcnMsIG9sZFN0YXRlLCBcInNldEFsbFwiKTtcblx0XHRcdHNldFBhaXJzLmZvckVhY2goKHBhaXIsIEkpID0+IHJlZz8udHJpZ2dlcj8uKHBhaXI/LlswXSA/PyBpZHggKyBJLCBwYWlyPy5bMV0sIHBhaXI/LlsyXSwgcGFpcj8uWzNdID09PSBmYWxzZSA/IFwiYWRkXCIgOiBcInNldFwiKSk7XG5cdFx0fVxuXHRcdGlmIChyZW1vdmVkPy5sZW5ndGggPT0gMSkgcmVnPy50cmlnZ2VyPy4oaWR4LCBudWxsLCByZW1vdmVkWzBdLCBcImRlbGV0ZVwiKTtcblx0XHRlbHNlIGlmIChyZW1vdmVkPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWc/LnRyaWdnZXI/LihpZHgsIG51bGwsIHJlbW92ZWQsIFwiZGVsZXRlQWxsXCIpO1xuXHRcdFx0cmVtb3ZlZC5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWc/LnRyaWdnZXI/LihpZHggKyBJLCBudWxsLCBpdGVtLCBcImRlbGV0ZVwiKSk7XG5cdFx0fVxuXHRcdGlmIChyZXN1bHQgPT0gdGFyZ2V0KSByZXR1cm4gbmV3IFByb3h5KHJlc3VsdCwgdGhpcy4jaGFuZGxlKTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSByZXR1cm4gb2JzZXJ2ZUFycmF5KHJlc3VsdCk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufTtcbnZhciB0cmlnZ2VyV2hlbkxlbmd0aENoYW5nZSA9IChzZWxmLCB0YXJnZXQsIG9sZExlbiwgbmV3TGVuKSA9PiB7XG5cdGNvbnN0IHJlbW92ZWRJdGVtcyA9IE51bWJlci5pc0ludGVnZXIob2xkTGVuKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKG5ld0xlbikgJiYgbmV3TGVuIDwgb2xkTGVuID8gdGFyZ2V0LnNsaWNlKG5ld0xlbiwgb2xkTGVuKSA6IFtdO1xuXHRpZiAoIXNlbGZbJHRyaWdnZXJMb2NrXSAmJiBvbGRMZW4gIT09IG5ld0xlbikge1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0aWYgKHJlbW92ZWRJdGVtcy5sZW5ndGggPT09IDEpIHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuLCBudWxsLCByZW1vdmVkSXRlbXNbMF0sIFwiZGVsZXRlXCIpO1xuXHRcdGVsc2UgaWYgKHJlbW92ZWRJdGVtcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWdpc3RyeT8udHJpZ2dlcj8uKG5ld0xlbiwgbnVsbCwgcmVtb3ZlZEl0ZW1zLCBcImRlbGV0ZUFsbFwiKTtcblx0XHRcdHJlbW92ZWRJdGVtcy5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWdpc3RyeT8udHJpZ2dlcj8uKG5ld0xlbiArIEksIG51bGwsIGl0ZW0sIFwiZGVsZXRlXCIpKTtcblx0XHR9XG5cdFx0Y29uc3QgYWRkZWRDb3VudCA9IE51bWJlci5pc0ludGVnZXIob2xkTGVuKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKG5ld0xlbikgJiYgbmV3TGVuID4gb2xkTGVuID8gbmV3TGVuIC0gb2xkTGVuIDogMDtcblx0XHRpZiAoYWRkZWRDb3VudCA9PT0gMSkgcmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4sIHZvaWQgMCwgbnVsbCwgXCJhZGRcIik7XG5cdFx0ZWxzZSBpZiAoYWRkZWRDb3VudCA+IDEpIHtcblx0XHRcdGNvbnN0IGFkZGVkID0gQXJyYXkoYWRkZWRDb3VudCkuZmlsbCh2b2lkIDApO1xuXHRcdFx0cmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4sIGFkZGVkLCBudWxsLCBcImFkZEFsbFwiKTtcblx0XHRcdGFkZGVkLmZvckVhY2goKF8sIEkpID0+IHJlZ2lzdHJ5Py50cmlnZ2VyPy4ob2xkTGVuICsgSSwgdm9pZCAwLCBudWxsLCBcImFkZFwiKSk7XG5cdFx0fVxuXHR9XG59O1xudmFyIE9ic2VydmVBcnJheUhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdO1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGhhcyh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBuYW1lKTtcblx0fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCByZWMpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdGlmIChbXG5cdFx0XHQkZXh0cmFjdEtleSQsXG5cdFx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdFx0XCJAdGFyZ2V0XCIsXG5cdFx0XHRcImRlcmVmXCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBzYWZlR2V0KHRhcmdldCwgbmFtZSk/LmJpbmQ/Lih0YXJnZXQpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnk/LmdldD8uKHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lID8/IDA7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHNhZmVHZXQodGFyZ2V0LCBrZXkpKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcIkB0YXJnZXRcIiB8fCBuYW1lID09ICRleHRyYWN0S2V5JCkgcmV0dXJuIHRhcmdldDtcblx0XHRpZiAobmFtZSA9PSBcInhcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnggPz8gdGFyZ2V0Py5bMF07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInlcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnkgPz8gdGFyZ2V0Py5bMV07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInpcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnogPz8gdGFyZ2V0Py5bMl07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcIndcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LncgPz8gdGFyZ2V0Py5bM107XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnIgPz8gdGFyZ2V0Py5bMF07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImdcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LmcgPz8gdGFyZ2V0Py5bMV07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LmIgPz8gdGFyZ2V0Py5bMl07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImFcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LmEgPz8gdGFyZ2V0Py5bM107XG5cdFx0fTtcblx0XHRjb25zdCBnb3QgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gKG5hbWUgPT0gXCJ2YWx1ZVwiID8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgOiBudWxsKTtcblx0XHRpZiAodHlwZW9mIGdvdCA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBuZXcgUHJveHkodHlwZW9mIGdvdCA9PSBcImZ1bmN0aW9uXCIgPyBnb3Q/LmJpbmQ/Lih0YXJnZXQpIDogZ290LCBuZXcgT2JzZXJ2ZUFycmF5TWV0aG9kKG5hbWUsIHRhcmdldCwgdGhpcykpO1xuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAodHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0aWYgKE51bWJlci5pc0ludGVnZXIocGFyc2VJbnQobmFtZSkpKSBuYW1lID0gcGFyc2VJbnQobmFtZSkgPz8gbmFtZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0Y29uc3QgcGVuZGluZyA9IGlzUHJvbWlzZSh2YWx1ZSk7XG5cdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmModmFsdWUsICh2KSA9PiB7XG5cdFx0XHRjb25zdCBvbGQgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0XHRjb25zdCB4eXp3ID0gW1xuXHRcdFx0XHRcInhcIixcblx0XHRcdFx0XCJ5XCIsXG5cdFx0XHRcdFwielwiLFxuXHRcdFx0XHRcIndcIlxuXHRcdFx0XTtcblx0XHRcdGNvbnN0IHJnYmEgPSBbXG5cdFx0XHRcdFwiclwiLFxuXHRcdFx0XHRcImdcIixcblx0XHRcdFx0XCJiXCIsXG5cdFx0XHRcdFwiYVwiXG5cdFx0XHRdO1xuXHRcdFx0Y29uc3QgeHl6d19pZHggPSB4eXp3LmluZGV4T2YobmFtZSk7XG5cdFx0XHRjb25zdCByZ2JhX2lkeCA9IHJnYmEuaW5kZXhPZihuYW1lKTtcblx0XHRcdGxldCBnb3QgPSBmYWxzZTtcblx0XHRcdGlmICh4eXp3X2lkeCA+PSAwKSBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHh5endfaWR4LCB2KTtcblx0XHRcdGVsc2UgaWYgKHJnYmFfaWR4ID49IDApIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgcmdiYV9pZHgsIHYpO1xuXHRcdFx0ZWxzZSBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHYpO1xuXHRcdFx0aWYgKG5hbWUgPT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAoaXNOb3RFcXVhbChvbGQsIHYpKSB0cmlnZ2VyV2hlbkxlbmd0aENoYW5nZSh0aGlzLCB0YXJnZXQsIG9sZCwgdik7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRcdGlmIChpc05vdEVxdWFsKG9sZCwgdikpIHN1YnNjcmlwdFJlZ2lzdHJ5Py5nZXQ/Lih0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgdiwgb2xkLCBcInNldFwiKTtcblx0XHRcdFx0aWYgKHBlbmRpbmcpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIG5hbWUsIHYsIG9sZCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZ290O1xuXHRcdH0pO1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdGlmICh0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihwYXJzZUludChuYW1lKSkpIG5hbWUgPSBwYXJzZUludChuYW1lKSA/PyBuYW1lO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0Y29uc3Qgb2xkID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IGdvdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBuYW1lICE9IFwibGVuZ3RoXCIgJiYgbmFtZSAhPSAkdHJpZ2dlckxvY2sgJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0aWYgKG9sZCAhPSBudWxsKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIG5hbWUsIG9sZCwgXCJkZWxldGVcIik7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZU9iamVjdEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdO1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGdldCh0YXJnZXQsIG5hbWUsIGN0eCkge1xuXHRcdGlmIChbXG5cdFx0XHQkZXh0cmFjdEtleSQsXG5cdFx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdFx0XCJAdGFyZ2V0XCIsXG5cdFx0XHRcImRlcmVmXCIsXG5cdFx0XHRcInRoZW5cIixcblx0XHRcdFwiY2F0Y2hcIixcblx0XHRcdFwiZmluYWxseVwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gdHJpZ2dlcktleU9mKHRhcmdldCwgb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lID8/IHJlYWxQcm9wT2YkMSh0YXJnZXQpID8/IFwidmFsdWVcIik7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IGtleSA9PSBcInZhbHVlXCIgfHwga2V5ID09IHJlYWxQcm9wT2YkMSh0YXJnZXQpID8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgOiB2b2lkIDApO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0cmlnZ2VyVmFsdWVPZih0YXJnZXQsIGtleSkpO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFN5bWJvbC50b1ByaW1pdGl2ZSkgcmV0dXJuIChoaW50KSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKGhpbnQpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIHRyeVBhcnNlQnlIaW50KGZ0LCBoaW50KTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIHRyeVBhcnNlQnlIaW50KHNhZmVHZXQoZnQsIFwidmFsdWVcIiksIGhpbnQpO1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQsIGhpbnQpO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gU3ltYm9sLnRvU3RyaW5nVGFnKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIFN0cmluZyhmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ0b1N0cmluZ1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIFN5bWJvbC50b1N0cmluZ1RhZykpIHJldHVybiBzYWZlR2V0KGZ0LCBTeW1ib2wudG9TdHJpbmdUYWcpPy4oKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBTdHJpbmcoZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwidmFsdWVPZlwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIFN5bWJvbC50b1ByaW1pdGl2ZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBTeW1ib2wudG9QcmltaXRpdmUpPy4oKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBmdDtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFwidmFsdWVcIik7XG5cdFx0XHRyZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdDtcblx0XHR9O1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0cmV0dXJuIGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQ/LltTeW1ib2wuZm9yKFwiQEBhcHBseVwiKV0/LmJpbmQ/Lih0YXJnZXQ/LltTeW1ib2wuZm9yKFwiQEBhcHBseVwiKV0gPz8gdGFyZ2V0KSA/PyB0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIHByb3AgaW4gdGFyZ2V0O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHYsIG5hbWUpO1xuXHRcdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgJG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRcdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgIShzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBuYW1lIGluIHRhcmdldCkpIHJldHVybjtcblx0XHRcdGNvbnN0IHRyaWdnZXJOYW1lID0gdHJpZ2dlcktleU9mKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IG5hbWUgPT0gXCJ2YWx1ZVwiID8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgPz8gc2FmZUdldCh0YXJnZXQsIG5hbWUpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0dGFyZ2V0W25hbWVdID0gdjtcblx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IHY7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiB0eXBlb2YgbmFtZSAhPT0gXCJzeW1ib2xcIiAmJiAhaXNSZWFjdGl2ZVByb3BlcnR5KCRvcmlnaW5hbCwgbmFtZSkpIHtcblx0XHRcdFx0Y29uc3Qgc3Vic2NyaXB0ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KCRvcmlnaW5hbCk7XG5cdFx0XHRcdGlmICgoc2FmZUdldCh0YXJnZXQsICRpc05vdEVxdWFsKSA/PyBpc05vdEVxdWFsKT8uKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHN1YnNjcmlwdD8udHJpZ2dlcj8uKHRyaWdnZXJOYW1lLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQoJG9yaWdpbmFsLCB0cmlnZ2VyTmFtZSwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSk7XG5cdH1cblx0ZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISFkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0aWYgKGRlc2NyaXB0b3IuZ2V0ID09IHZvaWQgMCAmJiBkZXNjcmlwdG9yLnNldCA9PSB2b2lkIDApIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgJHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG5cdFx0XHRnZXQ6IGRlc2NyaXB0b3IuZ2V0LFxuXHRcdFx0c2V0OiBkZXNjcmlwdG9yLnNldCxcblx0XHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA/PyB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA/PyB0cnVlXG5cdFx0fSk7XG5cdFx0c2FmZVNldCh0YXJnZXQsIG5hbWUsIG9sZFZhbHVlKTtcblx0XHRyZXR1cm4gJHJlc3VsdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIE9ic2VydmVNYXBIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHR0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgJGV4dHJhY3RLZXkkKSA/PyBzYWZlR2V0KHRhcmdldCwgJG9yaWdpbmFsS2V5JCkgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiB2YWx1ZU9yRng7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lO1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm47XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCAmJiAhaGFzT3duKG9wdGlvbnMsIFwidmFsdWVcIikpIHJldHVybjtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcImNsZWFyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8uZW50cmllcz8uKCkgfHwgW10pLCByZXN1bHQgPSB2YWx1ZU9yRngoKTtcblx0XHRcdG9sZFZhbHVlcy5mb3JFYWNoKChbcHJvcCwgb2xkVmFsdWVdKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZGVsZXRlXCIpIHJldHVybiAocHJvcCwgXyA9IG51bGwpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXMocHJvcCksIG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3ApO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInNldFwiKSByZXR1cm4gKHByb3AsIHZhbHVlKSA9PiBwb3RlbnRpYWxseUFzeW5jTWFwKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyhwcm9wKSwgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCwgdik7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRpZiAoIWhhZCB8fCBpc05vdEVxdWFsKG9sZFZhbHVlLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCB2LCBoYWQgPyBvbGRWYWx1ZSA6IG51bGwsIGhhZCA/IFwic2V0XCIgOiBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHByb3AsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0aWYgKG5hbWUgPT0gXCJnZXRPckluc2VydFwiIHx8IG5hbWUgPT0gXCJnZXRPckluc2VydENvbXB1dGVkXCIpIHtcblx0XHRcdGNvbnN0IGNvbXB1dGVkID0gbmFtZSA9PSBcImdldE9ySW5zZXJ0Q29tcHV0ZWRcIjtcblx0XHRcdHJldHVybiAoa2V5LCBkZWZhdWx0T3JDb21wdXRlKSA9PiB7XG5cdFx0XHRcdGlmICh0YXJnZXQuaGFzKGtleSkpIHJldHVybiB0YXJnZXQuZ2V0KGtleSk7XG5cdFx0XHRcdGNvbnN0IGluY29taW5nID0gY29tcHV0ZWQgPyB0eXBlb2YgZGVmYXVsdE9yQ29tcHV0ZSA9PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0T3JDb21wdXRlKGtleSkgOiBkZWZhdWx0T3JDb21wdXRlIDogZGVmYXVsdE9yQ29tcHV0ZTtcblx0XHRcdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmNNYXAoaW5jb21pbmcsICh2KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdHlwZW9mIHRhcmdldC5nZXRPckluc2VydCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQuZ2V0T3JJbnNlcnQoa2V5LCB2KSA6ICh0YXJnZXQuc2V0KGtleSwgdiksIHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0XHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4oa2V5LCB2LCBudWxsLCBcImFkZFwiKTtcblx0XHRcdFx0XHRcdGlmIChpc1Byb21pc2UoaW5jb21pbmcpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBrZXksIHYsIG51bGwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZU9yRng7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZVNldEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdID0gZmFsc2U7XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0dGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsICRleHRyYWN0S2V5JCkgPz8gc2FmZUdldCh0YXJnZXQsICRvcmlnaW5hbEtleSQpID8/IHRhcmdldDtcblx0XHRjb25zdCB2YWx1ZU9yRnggPSBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gdmFsdWVPckZ4O1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZTtcblx0XHRcdGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0YXJnZXQuaGFzKGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiY2xlYXJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlcyA9IEFycmF5LmZyb20odGFyZ2V0Py52YWx1ZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG5cdFx0XHRvbGRWYWx1ZXMuZm9yRWFjaCgob2xkVmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obnVsbCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJkZWxldGVcIikgcmV0dXJuICh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2YWx1ZSksIG9sZFZhbHVlID0gaGFkID8gdmFsdWUgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodmFsdWUpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHZhbHVlLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhZGRcIikgcmV0dXJuICh2YWx1ZSkgPT4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXModiksIG9sZFZhbHVlID0gaGFkID8gdiA6IG51bGwsIHJlc3VsdCA9IHZhbHVlT3JGeCh2KTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdGlmICghaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHYsIHYsIG9sZFZhbHVlLCBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHYsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciAkaXNPYnNlcnZhYmxlID0gKHRhcmdldCkgPT4ge1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSkpO1xufTtcbnZhciBtYWtlUmVhY3RpdmVQcm9wZXJ0aWVzID0gKG9iaikgPT4ge1xuXHRpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG5cdFx0Y29uc3QgZW50cmllcyA9IG9iai5lbnRyaWVzKCk7XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcykgZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIGtleSk7XG5cdH0gZWxzZSBpZiAob2JqICE9IG51bGwgJiYgKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHRjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMob2JqKTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBlbnRyaWVzKSBkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KG9iaiwga2V5KTtcblx0fVxufTtcbnZhciBvYnNlcnZlQXJyYXkgPSAoYXJyKSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKGFycikpIHJldHVybiBhcnI7XG5cdG1ha2VSZWFjdGl2ZVByb3BlcnRpZXMoYXJyKTtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChhcnIsIG5ldyBPYnNlcnZlQXJyYXlIYW5kbGVyKCkpLCBhcnIpO1xufTtcbnZhciBvYnNlcnZlT2JqZWN0ID0gKG9iaikgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShvYmopKSByZXR1cm4gb2JqO1xuXHRtYWtlUmVhY3RpdmVQcm9wZXJ0aWVzKG9iaik7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgob2JqLCBuZXcgT2JzZXJ2ZU9iamVjdEhhbmRsZXIoKSksIG9iaik7XG59O1xudmFyIG9ic2VydmVNYXAgPSAobWFwKSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKG1hcCkpIHJldHVybiBtYXA7XG5cdG1ha2VSZWFjdGl2ZVByb3BlcnRpZXMobWFwKTtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChtYXAsIG5ldyBPYnNlcnZlTWFwSGFuZGxlcigpKSwgbWFwKTtcbn07XG52YXIgb2JzZXJ2ZVNldCA9IChzZXQpID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUoc2V0KSkgcmV0dXJuIHNldDtcblx0bWFrZVJlYWN0aXZlUHJvcGVydGllcyhzZXQpO1xuXHRyZXR1cm4gd3JhcFdpdGgoc2V0LCBuZXcgT2JzZXJ2ZVNldEhhbmRsZXIoKSk7XG59O1xuXG4vLyBzcmMvY29yZS9QcmltaXRpdmVzLnRzXG52YXIgbnVtYmVyUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3Qgb2JqID0ge1xuXHRcdFskcHJvbWlzZV06IGlzUHJvbWlzZSA/IGluaXRpYWwgOiBudWxsLFxuXHRcdFskdmFsdWVdOiBpc1Byb21pc2UgPyAwIDogTnVtYmVyKGRlcmVmKGluaXRpYWwpIHx8IDApIHx8IDAsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoKHR5cGVvZiB0aGlzPy5bJHZhbHVlXSAhPSBcIm9iamVjdFwiID8gdGhpcz8uWyR2YWx1ZV0gOiB0aGlzPy5bJHZhbHVlXT8udmFsdWUgfHwgMCkgPz8gMCwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gKHYgIT0gbnVsbCAmJiAhTnVtYmVyLmlzTmFOKHYpID8gTnVtYmVyKHYpIDogdGhpc1skdmFsdWVdKSB8fCAwO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIE51bWJlcih0aGlzWyR2YWx1ZV0gfHwgMCkgfHwgMDtcblx0XHR9XG5cdH07XG5cdGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBcInZhbHVlXCIpO1xuXHRjb25zdCAkciA9IG9ic2VydmUob2JqKTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgc3RyaW5nUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3Qgb2JqID0ge1xuXHRcdFskcHJvbWlzZV06IGlzUHJvbWlzZSA/IGluaXRpYWwgOiBudWxsLFxuXHRcdFskdmFsdWVdOiAoaXNQcm9taXNlID8gXCJcIiA6IFN0cmluZyhkZXJlZih0eXBlb2YgaW5pdGlhbCA9PSBcIm51bWJlclwiID8gU3RyaW5nKGluaXRpYWwpIDogaW5pdGlhbCB8fCBcIlwiKSkpID8/IFwiXCIsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgPz8gXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIiwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gU3RyaW5nKHR5cGVvZiB2ID09IFwibnVtYmVyXCIgPyBTdHJpbmcodikgOiB2IHx8IFwiXCIpID8/IFwiXCI7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXNbJHZhbHVlXSA/PyBcIlwiKSA/PyBcIlwiO1xuXHRcdH1cblx0fTtcblx0ZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIFwidmFsdWVcIik7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZShvYmopO1xuXHRpbml0aWFsPy50aGVuPy4oKHYpID0+IHtcblx0XHQkci52YWx1ZSA9IHY7XG5cdFx0JHJbJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZTogdixcblx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciBib29sZWFuUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3Qgb2JqID0ge1xuXHRcdFskcHJvbWlzZV06IGlzUHJvbWlzZSA/IGluaXRpYWwgOiBudWxsLFxuXHRcdFskdmFsdWVdOiAoaXNQcm9taXNlID8gZmFsc2UgOiAoZGVyZWYoaW5pdGlhbCkgIT0gbnVsbCA/IHR5cGVvZiBkZXJlZihpbml0aWFsKSA9PSBcInN0cmluZ1wiID8gdHJ1ZSA6ICEhZGVyZWYoaW5pdGlhbCkgOiBmYWxzZSkgfHwgZmFsc2UpIHx8IGZhbHNlLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXM/LlskdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KCEhdGhpcz8uWyR2YWx1ZV0gfHwgZmFsc2UsIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9ICh2ICE9IG51bGwgPyB0eXBlb2YgdiA9PSBcInN0cmluZ1wiID8gdHJ1ZSA6ICEhdiA6IHRoaXNbJHZhbHVlXSkgfHwgZmFsc2U7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdIHx8IGZhbHNlO1xuXHRcdH1cblx0fTtcblx0ZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIFwidmFsdWVcIik7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZShvYmopO1xuXHRpbml0aWFsPy50aGVuPy4oKHYpID0+IHtcblx0XHQkci52YWx1ZSA9IHY7XG5cdFx0JHJbJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZTogdixcblx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciB3cmFwUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3Qgb2JqID0ge1xuXHRcdFskcHJvbWlzZV06IGlzUHJvbWlzZSA/IGluaXRpYWwgOiBudWxsLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUgPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQodGhpcy52YWx1ZSwgaGludCk7XG5cdFx0fSxcblx0XHR2YWx1ZTogaXNQcm9taXNlID8gbnVsbCA6IGRlcmVmKGluaXRpYWwpXG5cdH07XG5cdGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBcInZhbHVlXCIpO1xuXHRjb25zdCAkciA9IG9ic2VydmUob2JqKTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdGFmZmVjdGVkKGluaXRpYWwsICh2KSA9PiB7XG5cdFx0JHI/LlskdHJpZ2dlcl0/LigpO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciBtYXJrUmVhbFByb3AgPSAodGFyZ2V0LCByZWFsUHJvcCkgPT4ge1xuXHRpZiAodGFyZ2V0ID09IG51bGwgfHwgdHlwZW9mIHRhcmdldCAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiB0YXJnZXQgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdGFyZ2V0O1xuXHR0cnkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsICRyZWFsUHJvcCwge1xuXHRcdFx0dmFsdWU6IHJlYWxQcm9wLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhcmdldFskcmVhbFByb3BdID0gcmVhbFByb3A7XG5cdFx0fSBjYXRjaCB7fVxuXHR9XG5cdHRyeSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgXCJyZWFsUHJvcFwiLCB7XG5cdFx0XHR2YWx1ZTogcmVhbFByb3AsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHR9IGNhdGNoIHtcblx0XHR0cnkge1xuXHRcdFx0dGFyZ2V0LnJlYWxQcm9wID0gcmVhbFByb3A7XG5cdFx0fSBjYXRjaCB7fVxuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIHByb3BSZWYgPSAoc3JjLCBzcmNQcm9wID0gXCJ2YWx1ZVwiLCBpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUoc3JjKSB8fCAhc3JjKSByZXR1cm4gc3JjO1xuXHRpZiAoQXJyYXkuaXNBcnJheShzcmMpICYmIHNyYy5sZW5ndGggPT0gMiAmJiBzcmNbMF0gIT0gbnVsbCAmJiAoc3JjWzBdIGluc3RhbmNlb2YgTWFwIHx8IHNyY1swXSBpbnN0YW5jZW9mIFdlYWtNYXAgfHwgc3JjWzBdIGluc3RhbmNlb2YgU2V0IHx8IHNyY1swXSBpbnN0YW5jZW9mIFdlYWtTZXQpKSB7XG5cdFx0aWYgKHNyY1Byb3AgPT0gbnVsbCB8fCBzcmNQcm9wID09PSBcInZhbHVlXCIpIHNyY1Byb3AgPSBzcmNbMV07XG5cdFx0c3JjID0gc3JjWzBdO1xuXHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc3JjKSAmJiAhaXNBcnJheUludmFsaWRLZXkoc3JjPy5bMV0sIHNyYykgJiYgKEFycmF5LmlzQXJyYXkoc3JjPy5bMF0pIHx8IHR5cGVvZiBzcmM/LlswXSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzcmM/LlswXSA9PSBcImZ1bmN0aW9uXCIpKSBzcmMgPSBzcmM/LlswXTtcblx0Y29uc3QgaXNNYXAgPSBzcmMgaW5zdGFuY2VvZiBNYXAgfHwgc3JjIGluc3RhbmNlb2YgV2Vha01hcCB8fCB0eXBlb2Ygc3JjPy5nZXQgPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBzcmM/LnNldCA9PSBcImZ1bmN0aW9uXCIgJiYgKHR5cGVvZiBzcmM/LmRlbGV0ZSA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHNyYz8ucmVtb3ZlID09IFwiZnVuY3Rpb25cIik7XG5cdGNvbnN0IGlzU2V0ID0gc3JjIGluc3RhbmNlb2YgU2V0IHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtTZXQgfHwgdHlwZW9mIHNyYz8uaGFzID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc3JjPy5hZGQgPT0gXCJmdW5jdGlvblwiICYmICh0eXBlb2Ygc3JjPy5kZWxldGUgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBzcmM/LnJlbW92ZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRpZiAoaXNNYXAgfHwgaXNTZXQpIHtcblx0XHRpZiAoc3JjUHJvcCA9PSBudWxsKSByZXR1cm47XG5cdH0gZWxzZSBpZiAoKHNyY1Byb3AgPz89IEFycmF5LmlzQXJyYXkoc3JjKSA/IG51bGwgOiBcInZhbHVlXCIpID09IG51bGwgfHwgaXNBcnJheUludmFsaWRLZXkoc3JjUHJvcCwgc3JjKSkgcmV0dXJuO1xuXHRjb25zdCByZWFkU2xvdCA9ICgpID0+IHtcblx0XHRpZiAoaXNNYXApIHJldHVybiBzcmM/LmdldD8uKHNyY1Byb3ApO1xuXHRcdGlmIChpc1NldCkgcmV0dXJuIHNyYz8uaGFzPy4oc3JjUHJvcCkgPyBzcmNQcm9wIDogbnVsbDtcblx0XHRyZXR1cm4gc3JjPy5bc3JjUHJvcF07XG5cdH07XG5cdGNvbnN0IHdyaXRlU2xvdCA9ICh2KSA9PiB7XG5cdFx0aWYgKGlzTWFwKSB7XG5cdFx0XHRjb25zdCBtYXAgPSBzcmM7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbCh2LCBtYXA/LmdldD8uKHNyY1Byb3ApKSkgbWFwPy5zZXQ/LihzcmNQcm9wLCB2KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRpZiAoaXNTZXQpIHtcblx0XHRcdGNvbnN0IHNldCA9IHNyYztcblx0XHRcdGNvbnN0IG1lbWJlciA9IHYgPz8gc3JjUHJvcDtcblx0XHRcdGlmIChtZW1iZXIgPT0gbnVsbCkge1xuXHRcdFx0XHRzZXQ/LmRlbGV0ZT8uKHNyY1Byb3ApO1xuXHRcdFx0XHRyZXR1cm4gbWVtYmVyO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFzZXQ/Lmhhcz8uKG1lbWJlcikpIHNldD8uYWRkPy4obWVtYmVyKTtcblx0XHRcdHJldHVybiBtZW1iZXI7XG5cdFx0fVxuXHRcdGlmIChpc05vdEVxdWFsKHYsIHNyYz8uW3NyY1Byb3BdKSkgc3JjW3NyY1Byb3BdID0gdjtcblx0XHRyZXR1cm4gdjtcblx0fTtcblx0aWYgKGlzTWFwICYmIGluaXRpYWwgIT09IHZvaWQgMCAmJiAhc3JjPy5oYXM/LihzcmNQcm9wKSkgc3JjPy5zZXQ/LihzcmNQcm9wLCBpbml0aWFsKTtcblx0ZWxzZSBpZiAoaXNTZXQgJiYgaW5pdGlhbCAmJiAhc3JjPy5oYXM/LihzcmNQcm9wKSkgc3JjPy5hZGQ/LihzcmNQcm9wKTtcblx0Y29uc3QgY3VycmVudCA9IHJlYWRTbG90KCk7XG5cdGlmICghaXNTZXQgJiYgc3JjUHJvcCAhPSBudWxsICYmIGhhc1ZhbHVlKGN1cnJlbnQpICYmIGlzT2JzZXJ2YWJsZShjdXJyZW50KSkgcmV0dXJuIG1hcmtSZWFsUHJvcChyZWNvdmVyUmVhY3RpdmUoY3VycmVudCksIHNyY1Byb3ApO1xuXHRpZiAoIWlzTWFwICYmICFpc1NldCAmJiBzcmNQcm9wICYmIHR5cGVvZiBzcmM/LmdldFByb3BlcnR5ID09IFwiZnVuY3Rpb25cIiAmJiBpc09ic2VydmFibGUoc3JjPy5nZXRQcm9wZXJ0eT8uKHNyY1Byb3ApKSkgcmV0dXJuIG1hcmtSZWFsUHJvcChzcmM/LmdldFByb3BlcnR5Py4oc3JjUHJvcCksIHNyY1Byb3ApO1xuXHRpZiAoIWlzTWFwICYmICFpc1NldCkgc3JjW3NyY1Byb3BdID8/PSBpbml0aWFsID8/IHNyYz8uW3NyY1Byb3BdO1xuXHRlbHNlIGlmIChpc01hcCAmJiBpc05vdEVxdWFsKGluaXRpYWwgPz8gc3JjPy5nZXQ/LihzcmNQcm9wKSwgc3JjPy5nZXQ/LihzcmNQcm9wKSkpIHNyYz8uc2V0Py4oc3JjUHJvcCwgaW5pdGlhbCA/PyBzcmM/LmdldD8uKHNyY1Byb3ApKTtcblx0ZWxzZSBpZiAoaXNTZXQgJiYgc3JjPy5oYXM/Lihpbml0aWFsID8/IHNyY1Byb3ApKSBzcmM/LmFkZD8uKGluaXRpYWwgPz8gc3JjUHJvcCk7XG5cdGNvbnN0IHIgPSBvYnNlcnZlKHtcblx0XHRbJHZhbHVlXTogaXNTZXQgPyByZWFkU2xvdCgpIDogcmVhZFNsb3QoKSA/PyBpbml0aWFsLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHJlYWRTbG90KCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHJlYWRTbG90KCksIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHJbJHRyaWdnZXJMb2NrJDFdID0gdHJ1ZTtcblx0XHRcdGlmIChpc1NldCkgdGhpc1skdmFsdWVdID0gd3JpdGVTbG90KHYpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnN0IG5leHQgPSB2ID8/IGRlZmF1bHRCeVR5cGUocmVhZFNsb3QoKSk7XG5cdFx0XHRcdHRoaXNbJHZhbHVlXSA9IHdyaXRlU2xvdChuZXh0KTtcblx0XHRcdH1cblx0XHRcdHJbJHRyaWdnZXJMb2NrJDFdID0gZmFsc2U7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRjb25zdCBzbG90ID0gcmVhZFNsb3QoKTtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gPSBzbG90ID8/IHRoaXNbJHZhbHVlXTtcblx0XHR9XG5cdH0pO1xuXHRtYXJrUmVhbFByb3Aociwgc3JjUHJvcCk7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKHNyYywgKHYsIF9wcm9wLCBvbGQsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoX3Byb3AgIT0gc3JjUHJvcCkgcmV0dXJuO1xuXHRcdGlmIChyWyR0cmlnZ2VyTG9jayQxXSkgcmV0dXJuO1xuXHRcdGNvbnN0IG5leHQgPSBpc1NldCA/IHJlYWRTbG90KCkgOiB2O1xuXHRcdGNvbnN0IHByZXYgPSByWyR2YWx1ZV07XG5cdFx0clskdmFsdWVdID0gbmV4dDtcblx0XHRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IG5leHQsXG5cdFx0XHRvbGRWYWx1ZTogb2xkID8/IHByZXYsXG5cdFx0XHR0cmlnZ2VyOiB0cmlnZ2VyID8/IFwic2V0XCJcblx0XHR9KTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHIsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcjtcbn07XG52YXIgJHJlZiA9ICh0eXBlZCwgYmVoYXZpb3IpID0+IHtcblx0c3dpdGNoICh0eXBlb2YgdHlwZWQpIHtcblx0XHRjYXNlIFwiYm9vbGVhblwiOiByZXR1cm4gYm9vbGVhblJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJudW1iZXJcIjogcmV0dXJuIG51bWJlclJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJzdHJpbmdcIjogcmV0dXJuIHN0cmluZ1JlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJvYmplY3RcIjogaWYgKHR5cGVkICE9IG51bGwpIHJldHVybiB3cmFwUmVmKG9ic2VydmUodHlwZWQpLCBiZWhhdmlvcik7XG5cdFx0ZGVmYXVsdDogcmV0dXJuIHdyYXBSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0fVxufTtcbnZhciByZWYgPSAodHlwZWQsIHByb3AgPSBcInZhbHVlXCIsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0ICRyID0gaXNPYnNlcnZhYmxlKHR5cGVkKSA/IHR5cGVkIDogJHJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRpZiAocHJvcCAhPSBudWxsKSByZXR1cm4gcHJvcFJlZigkciwgcHJvcCwgYmVoYXZpb3IpO1xuXHRlbHNlIHJldHVybiAkcjtcbn07XG52YXIgcHJvbWlzZWQgPSAocHJvbWlzZSwgYmVoYXZpb3IpID0+IHtcblx0cmV0dXJuIHJlZihwcm9taXNlLCBiZWhhdmlvcik7XG59O1xudmFyIHRyaWdnZXJXaXRoRGVsYXkgPSAocmVmLCBjYiwgZGVsYXkgPSAxMDApID0+IHtcblx0aWYgKHJlZj8udmFsdWUgPz8gcmVmKSByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0aWYgKHJlZi52YWx1ZSkgY2I/LigpO1xuXHR9LCBkZWxheSk7XG59O1xudmFyIGRlbGF5ZWRCZWhhdmlvciA9IChkZWxheSA9IDEwMCkgPT4ge1xuXHRyZXR1cm4gKGNiLCBbdmFsXSwgW3NpZ10pID0+IHtcblx0XHRsZXQgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHZhbCwgY2IsIGRlbGF5KTtcblx0XHRzaWc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImFib3J0XCIsICgpID0+IHtcblx0XHRcdGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKTtcblx0XHR9LCB7IG9uY2U6IHRydWUgfSk7XG5cdH07XG59O1xudmFyIGRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciA9IChkZWxheSA9IDEwMCkgPT4ge1xuXHRyZXR1cm4gKGNiLCBbdmFsXSwgW3NpZ10pID0+IHtcblx0XHRsZXQgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHZhbCwgY2IsIGRlbGF5KTtcblx0XHRzaWc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImFib3J0XCIsICgpID0+IHtcblx0XHRcdGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKTtcblx0XHR9LCB7IG9uY2U6IHRydWUgfSk7XG5cdFx0aWYgKCF0bSkgY2I/LigpO1xuXHR9O1xufTtcbmZ1bmN0aW9uIG9ic2VydmUodGFyZ2V0LCBzdGF0ZU5hbWUpIHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJzeW1ib2xcIiB8fCAhKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgfHwgJGlzT2JzZXJ2YWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRpZiAoKHRhcmdldCA9IGRlcmVmPy4odGFyZ2V0KSkgPT0gbnVsbCB8fCB0YXJnZXQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHRhcmdldCBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgJGlzT2JzZXJ2YWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRjb25zdCB1bndyYXAgPSB0YXJnZXQ7XG5cdGlmICh1bndyYXAgPT0gbnVsbCB8fCB0eXBlb2YgdW53cmFwID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIpIHx8IHVud3JhcCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha1JlZikgcmV0dXJuIHVud3JhcDtcblx0bGV0IHJlYWN0aXZlID0gdW53cmFwO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh1bndyYXApKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlQXJyYXkodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodW53cmFwIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlTWFwKHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZVNldCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVPYmplY3QodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH1cblx0cmV0dXJuIHJlYWN0aXZlO1xufVxudmFyIGlzT2JzZXJ2YWJsZSA9ICh0YXJnZXQpID0+IHtcblx0aWYgKHR5cGVvZiBIVE1MSW5wdXRFbGVtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuIHRydWU7XG5cdHJldHVybiAhISgodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSAmJiB0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSB8fCB0YXJnZXQ/LlskYWZmZWN0ZWRdIHx8IHN1YnNjcmlwdFJlZ2lzdHJ5Py5oYXM/Lih0YXJnZXQpKSk7XG59O1xudmFyIHJlY292ZXJSZWFjdGl2ZSA9ICh0YXJnZXQpID0+IHtcblx0cmV0dXJuIGlzT2JzZXJ2YWJsZSh0YXJnZXQpID8gb2JzZXJ2ZSh0YXJnZXQpIDogbnVsbDtcbn07XG5cbi8vIHNyYy9jb3JlL01haW5saW5lLnRzXG52YXIgdXNlT2JzZXJ2YWJsZSA9ICh1bndyYXApID0+IHtcblx0aWYgKHVud3JhcCA9PSBudWxsIHx8IHR5cGVvZiB1bndyYXAgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdW53cmFwICE9IFwiZnVuY3Rpb25cIiB8fCB1bndyYXA/LltTeW1ib2wub2JzZXJ2YWJsZV0gIT0gbnVsbCkgcmV0dXJuIHVud3JhcDtcblx0dHJ5IHtcblx0XHR1bndyYXBbU3ltYm9sLm9ic2VydmFibGVdID0gc2VsZj8uY29tcGF0aWJsZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUud2FybihcIlVuYWJsZSB0byBhc3NpZ24gPFtTeW1ib2wub2JzZXJ2YWJsZV0+LCBvYmplY3Qgd2lsbCBub3Qgb2JzZXJ2YWJsZSBieSBvdGhlciBmcmFtZXdvcmtzXCIpO1xuXHR9XG5cdHVud3JhcFskYWZmZWN0ZWRdID0gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiB7XG5cdFx0Y29uc3Qgb2JzZXJ2YWJsZSA9IHVud3JhcD8uW1N5bWJvbD8ub2JzZXJ2YWJsZV07XG5cdFx0b2JzZXJ2YWJsZT8uKCk/LmFmZmVjdGVkPy4oY2IsIHByb3AsIG9wdGlvbnMpO1xuXHRcdHJldHVybiAoKSA9PiBvYnNlcnZhYmxlPy4oKT8udW5hZmZlY3RlZD8uKGNiLCBwcm9wKTtcblx0fTtcblx0cmV0dXJuIHVud3JhcDtcbn07XG52YXIgc3BlY2lhbGl6ZWRTdWJzY3JpYmUgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBjaGVja1ZhbGlkT2JqID0gKG9iaikgPT4ge1xuXHRpZiAodHlwZW9mIG9iaiA9PSBcInN5bWJvbFwiIHx8IG9iaiA9PSBudWxsIHx8ICEodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiKSkgcmV0dXJuO1xuXHRyZXR1cm4gb2JqO1xufTtcbnZhciBpbml0aWFsVHJpZ2dlciA9IFwiaW5pdGlhbFwiO1xudmFyIHJlYWxQcm9wT2YgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHByb3AgPSB0YXJnZXQ/LlskcmVhbFByb3BdID8/IHRhcmdldD8ucmVhbFByb3A7XG5cdHJldHVybiBpc0tleVR5cGUocHJvcCkgPyBwcm9wIDogbnVsbDtcbn07XG52YXIgbm9ybWFsaXplQWZmZWN0ZWRQcm9wID0gKHRhcmdldCwgcHJvcCkgPT4ge1xuXHRjb25zdCByZWFsUHJvcCA9IHJlYWxQcm9wT2YodGFyZ2V0KTtcblx0aWYgKHJlYWxQcm9wICE9IG51bGwgJiYgKHByb3AgPT0gbnVsbCB8fCBwcm9wID09IFwidmFsdWVcIikpIHJldHVybiByZWFsUHJvcDtcblx0cmV0dXJuIHByb3A7XG59O1xudmFyIHByb3BWYWx1ZU9mID0gKHRhcmdldCwgcHJvcCkgPT4ge1xuXHRpZiAocHJvcCAhPSBudWxsICYmIHByb3AgPT0gcmVhbFByb3BPZih0YXJnZXQpKSByZXR1cm4gdGFyZ2V0Py52YWx1ZTtcblx0cmV0dXJuIHRhcmdldD8uW3Byb3BdO1xufTtcbnZhciBjYWxsQnlQcm9wUmVmQXdhcmUgPSAodGFyZ2V0LCBwcm9wLCBjYiwgY3R4KSA9PiB7XG5cdGlmIChwcm9wICE9IG51bGwgJiYgcHJvcCA9PSByZWFsUHJvcE9mKHRhcmdldCkpIHtcblx0XHRjb25zdCB2YWx1ZSA9IHByb3BWYWx1ZU9mKHRhcmdldCwgcHJvcCk7XG5cdFx0aWYgKHZhbHVlICE9IG51bGwpIHJldHVybiBjYj8uKHZhbHVlLCBwcm9wLCBudWxsLCBcInNldFwiKTtcblx0fVxuXHRyZXR1cm4gY2FsbEJ5UHJvcCh0YXJnZXQsIHByb3AsIGNiLCBjdHgpO1xufTtcbnZhciB3aXRoVHJpZ2dlciA9IChjYiwgb3B0aW9ucywgdHJpZ2dlcikgPT4ge1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpO1xuXHRpZiAodHJpZ2dlciA9PSBpbml0aWFsVHJpZ2dlcikge1xuXHRcdGlmICghbm9ybWFsaXplZC50cmlnZ2VySW1tZWRpYXRlbHkpIHJldHVybjtcblx0fSBlbHNlIGlmICghdHJpZ2dlckZpbHRlckFsbG93cyhub3JtYWxpemVkLmFmZmVjdFR5cGVzLCB0cmlnZ2VyKSkgcmV0dXJuO1xuXHRyZXR1cm4gKHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgLi4uZXRjKSA9PiBjYj8uKHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgdHJpZ2dlciwgLi4uZXRjKTtcbn07XG52YXIgc3Vic2NyaWJlRGlyZWN0bHkgPSAodGFyZ2V0LCBwcm9wLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKCF0YXJnZXQpIHJldHVybjtcblx0aWYgKCFjaGVja1ZhbGlkT2JqKHRhcmdldCkpIHJldHVybjtcblx0Y29uc3QgdFByb3AgPSBwcm9wICE9IFN5bWJvbC5pdGVyYXRvciA/IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCh0YXJnZXQsIHByb3ApIDogbnVsbDtcblx0bGV0IHJlZ2lzdHJ5ID0gdGFyZ2V0Py5bJHJlZ2lzdHJ5S2V5JF0gPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdHRhcmdldCA9IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0O1xuXHRzY2hlZHVsZXI/LnlpZWxkPy4oKT8udGhlbj8uKCgpID0+IHtcblx0XHRjb25zdCBpbml0aWFsQ2IgPSB3aXRoVHJpZ2dlcihjYiwgb3B0aW9ucywgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdGlmICghaW5pdGlhbENiKSByZXR1cm47XG5cdFx0aWYgKHRQcm9wICE9IG51bGwgJiYgdFByb3AgIT0gU3ltYm9sLml0ZXJhdG9yKSBjYWxsQnlQcm9wUmVmQXdhcmUodGFyZ2V0LCB0UHJvcCwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRlbHNlIGNhbGxCeUFsbFByb3AodGFyZ2V0LCBpbml0aWFsQ2IsIG51bGwpO1xuXHR9KTtcblx0bGV0IHVuU3ViID0gcmVnaXN0cnk/LmFmZmVjdGVkPy4oY2IsIHRQcm9wLCBvcHRpb25zKTtcblx0aWYgKHRhcmdldD8uW1N5bWJvbC5kaXNwb3NlXSkgcmV0dXJuIHVuU3ViO1xuXHRhZGRUb0NhbGxDaGFpbih1blN1YiwgU3ltYm9sLmRpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odW5TdWIsIFN5bWJvbC5hc3luY0Rpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odGFyZ2V0LCBTeW1ib2wuZGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih0YXJnZXQsIFN5bWJvbC5hc3luY0Rpc3Bvc2UsIHVuU3ViKTtcblx0cmV0dXJuIHVuU3ViO1xufTtcbnZhciBzdWJzY3JpYmVJbnB1dCA9ICh0ZywgXywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IGFmZmVjdFR5cGVzID0gbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpLmFmZmVjdFR5cGVzO1xuXHRjb25zdCAkb3B0ID0ge307XG5cdGxldCBvbGRWYWx1ZSA9IHRnPy52YWx1ZTtcblx0Y29uc3QgJGNiID0gKGV2KSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSBldj8udGFyZ2V0Py52YWx1ZTtcblx0XHRpZiAodHJpZ2dlckZpbHRlckFsbG93cyhhZmZlY3RUeXBlcywgXCJzZXRcIikpIGNiPy4odmFsdWUsIFwidmFsdWVcIiwgb2xkVmFsdWUsIFwic2V0XCIsIGV2KTtcblx0XHRvbGRWYWx1ZSA9IHZhbHVlO1xuXHR9O1xuXHR0Zz8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwiY2hhbmdlXCIsICRjYiwgJG9wdCk7XG5cdHJldHVybiAoKSA9PiB0Zz8ucmVtb3ZlRXZlbnRMaXN0ZW5lcj8uKFwiY2hhbmdlXCIsICRjYiwgJG9wdCk7XG59O1xudmFyIGNoZWNrSXNQYWlyZWQgPSAodGcpID0+IHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodGcpICYmIHRnPy5sZW5ndGggPT0gMiAmJiBjaGVja1ZhbGlkT2JqKHRnPy5bMF0pICYmIChpc0tleVR5cGUodGc/LlsxXSkgfHwgdGc/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpO1xufTtcbnZhciBpc0VmZmVjdE9wdGlvbnNBcmcgPSAodmFsdWUpID0+IHtcblx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIChcImFmZmVjdFR5cGVzXCIgaW4gdmFsdWUgfHwgXCJ0cmlnZ2Vyc1wiIGluIHZhbHVlIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gdmFsdWUpO1xufTtcbnZhciBub3JtYWxpemVFZmZlY3RUYXJnZXRzID0gKHRhcmdldHMpID0+IHtcblx0aWYgKHRhcmdldHMgPT0gbnVsbCkgcmV0dXJuIFtdO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXRzKSAmJiAhY2hlY2tJc1BhaXJlZCh0YXJnZXRzKSAmJiAhaXNPYnNlcnZhYmxlKHRhcmdldHMpKSByZXR1cm4gdGFyZ2V0cztcblx0cmV0dXJuIFt0YXJnZXRzXTtcbn07XG52YXIgZWZmZWN0VGFyZ2V0Q29udGV4dCA9IChzb3VyY2UpID0+IHtcblx0aWYgKGNoZWNrSXNQYWlyZWQoc291cmNlKSkge1xuXHRcdGNvbnN0IHRhcmdldCA9IHNvdXJjZT8uWzBdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzb3VyY2UsXG5cdFx0XHR0YXJnZXQsXG5cdFx0XHRwcm9wOiBub3JtYWxpemVBZmZlY3RlZFByb3AodGFyZ2V0LCBzb3VyY2U/LlsxXSlcblx0XHR9O1xuXHR9XG5cdHJldHVybiB7XG5cdFx0c291cmNlLFxuXHRcdHRhcmdldDogc291cmNlLFxuXHRcdHByb3A6IG51bGxcblx0fTtcbn07XG52YXIgdG9FZmZlY3RFdmVudCA9IChzb3VyY2UsIHRhcmdldCwgdmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyLCBhcmdzKSA9PiAoe1xuXHRzb3VyY2UsXG5cdHRhcmdldCxcblx0dmFsdWUsXG5cdHByb3AsXG5cdG5hbWU6IHByb3AsXG5cdG9sZFZhbHVlLFxuXHR0cmlnZ2VyLFxuXHRhcmdzXG59KTtcbnZhciBzdWJzY3JpYmVQYWlyZWQgPSAodGcsIF8sIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRjb25zdCBwcm9wID0gaXNLZXlUeXBlKHRnPy5bMV0pID8gdGc/LlsxXSA6IG51bGw7XG5cdHJldHVybiBhZmZlY3RlZCh0Zz8uWzBdLCBwcm9wLCBjYiwgb3B0aW9ucyk7XG59O1xudmFyIHN1YnNjcmliZVRoZW5hYmxlID0gKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBvYmo/LnRoZW4/Ligob2JqKSA9PiBhZmZlY3RlZD8uKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMpKT8uY2F0Y2g/LigoZSkgPT4ge1xuXHRcdGNvbnNvbGUud2FybihlKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fSk7XG59O1xudmFyIGFmZmVjdGVkID0gKG9iaiwgcHJvcCwgY2IgPSAoKSA9PiB7fSwgb3B0aW9ucykgPT4ge1xuXHRsZXQga2V5ID0gbnVsbDtcblx0aWYgKHR5cGVvZiBwcm9wID09IFwiZnVuY3Rpb25cIikge1xuXHRcdG9wdGlvbnMgPSBjYjtcblx0XHRjYiA9IHByb3A7XG5cdH0gZWxzZSBrZXkgPSBub3JtYWxpemVBZmZlY3RlZFByb3Aob2JqLCBwcm9wKTtcblx0aWYgKHR5cGVvZiBjYiA9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkoY2IpKSB7XG5cdFx0b3B0aW9ucyA9IGNiO1xuXHRcdGNiID0gKCkgPT4ge307XG5cdH1cblx0aWYgKGlzUHJpbWl0aXZlKG9iaikgfHwgdHlwZW9mIG9iaiA9PSBcInN5bWJvbFwiKSB7XG5cdFx0aWYgKG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKS50cmlnZ2VySW1tZWRpYXRlbHkpIHJldHVybiBQcm9taXNlZChnbG9iYWxUaGlzPy5Qcm9taXNlPy50cnk/LigoKSA9PiB7XG5cdFx0XHRyZXR1cm4gY2I/LihvYmosIG51bGwsIG51bGwsIG51bGwsIGluaXRpYWxUcmlnZ2VyKTtcblx0XHR9KSk7XG5cdH1cblx0aWYgKHR5cGVvZiBvYmo/LlskYWZmZWN0ZWRdID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG9iaj8uWyRhZmZlY3RlZF0/LihjYiwga2V5LCBvcHRpb25zKTtcblx0ZWxzZSBpZiAoY2hlY2tWYWxpZE9iaihvYmopKSB7XG5cdFx0Y29uc3Qgd3JhcHBlZCA9IG9iajtcblx0XHRpZiAoc3BlY2lhbGl6ZWRTdWJzY3JpYmU/Lmhhcz8uKG9iaiA9IG9iaj8uWyRleHRyYWN0S2V5JF0gPz8gb2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXQ/LihvYmopPy4od3JhcHBlZCwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKGlzT2JzZXJ2YWJsZSh3cmFwcGVkKSB8fCBjaGVja0lzUGFpcmVkKG9iaikgJiYgaXNPYnNlcnZhYmxlKG9iaj8uWzBdKSkge1xuXHRcdFx0aWYgKGlzVGhlbmFibGUob2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlVGhlbmFibGUpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgaWYgKGNoZWNrSXNQYWlyZWQob2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlUGFpcmVkKT8uKG9iaiwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgSFRNTElucHV0RWxlbWVudCAhPSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZUlucHV0KT8uKG9iaiwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZURpcmVjdGx5KT8uKHdyYXBwZWQsIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBpbml0aWFsQ2IgPSB3aXRoVHJpZ2dlcihjYiwgb3B0aW9ucywgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdFx0aWYgKCFpbml0aWFsQ2IpIHJldHVybjtcblx0XHRcdHJldHVybiBQcm9taXNlZChnbG9iYWxUaGlzPy5Qcm9taXNlPy50cnk/LigoKSA9PiB7XG5cdFx0XHRcdGlmIChjaGVja0lzUGFpcmVkKG9iaikpIHJldHVybiBjYWxsQnlQcm9wUmVmQXdhcmU/LihvYmo/LlswXSwgb2JqPy5bMV0sIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgaWYgKGtleSAhPSBudWxsICYmIGtleSAhPSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBjYWxsQnlQcm9wUmVmQXdhcmU/LihvYmosIGtleSwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdFx0ZWxzZSByZXR1cm4gY2FsbEJ5QWxsUHJvcD8uKG9iaiwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdH0pKTtcblx0XHR9XG5cdH1cbn07XG5mdW5jdGlvbiBlZmZlY3QoY2IsIHRhcmdldHMsIG9wdGlvbnMpIHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAoaXNFZmZlY3RPcHRpb25zQXJnKHRhcmdldHMpICYmIG9wdGlvbnMgPT09IHZvaWQgMCkgcmV0dXJuIGVmZmVjdEdsb2JhbGx5KGNiLCB0YXJnZXRzKTtcblx0aWYgKHRhcmdldHMgPT0gbnVsbCkgcmV0dXJuIGVmZmVjdEdsb2JhbGx5KGNiLCBvcHRpb25zKTtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMob3B0aW9ucyk7XG5cdGNvbnN0IGFmZmVjdGVkT3B0aW9ucyA9IHtcblx0XHRhZmZlY3RUeXBlczogbm9ybWFsaXplZC5hZmZlY3RUeXBlcyxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG5vcm1hbGl6ZWQudHJpZ2dlckltbWVkaWF0ZWx5XG5cdH07XG5cdGNvbnN0IGRpc3Bvc2VycyA9IG5vcm1hbGl6ZUVmZmVjdFRhcmdldHModGFyZ2V0cykubWFwKChzb3VyY2UpID0+IHtcblx0XHRjb25zdCBjdHggPSBlZmZlY3RUYXJnZXRDb250ZXh0KHNvdXJjZSk7XG5cdFx0cmV0dXJuIGFmZmVjdGVkKGN0eC50YXJnZXQsIGN0eC5wcm9wLCAodmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyLCAuLi5hcmdzKSA9PiB7XG5cdFx0XHRyZXR1cm4gY2IodG9FZmZlY3RFdmVudChjdHguc291cmNlLCBjdHgudGFyZ2V0LCB2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIgPz8gbnVsbCwgYXJncykpO1xuXHRcdH0sIGFmZmVjdGVkT3B0aW9ucyk7XG5cdH0pLmZpbHRlcigoZGlzcG9zZSkgPT4gdHlwZW9mIGRpc3Bvc2UgPT0gXCJmdW5jdGlvblwiKTtcblx0cmV0dXJuICgpID0+IGRpc3Bvc2Vycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlPy4oKSk7XG59XG5mdW5jdGlvbiBlZmZlY3RlZCh0YXJnZXRzLCBjYiwgb3B0aW9ucykge1xuXHRyZXR1cm4gZWZmZWN0KGNiLCB0YXJnZXRzLCBvcHRpb25zKTtcbn1cbnZhciBtYWtlQXJyYXlPYnNlcnZhYmxlID0gKHRnKSA9PiB7XG5cdGlmICh0ZyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIG9ic2VydmFibGVCeVNldCh0Zyk7XG5cdGlmICh0ZyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIG9ic2VydmFibGVCeU1hcCh0Zyk7XG5cdHJldHVybiB0Zztcbn07XG52YXIgRG91YmxlV2Vha01hcCA9IGNsYXNzIHtcblx0I3RvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHQjZW5zdXJlSW5uZXIoa2V5MSkge1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG51bGw7XG5cdFx0bGV0IGlubmVyID0gdGhpcy4jdG9wLmdldChrZXkxKTtcblx0XHRpZiAoIWlubmVyKSB7XG5cdFx0XHRpbm5lciA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRcdFx0dGhpcy4jdG9wLnNldChrZXkxLCBpbm5lcik7XG5cdFx0fVxuXHRcdHJldHVybiBpbm5lcjtcblx0fVxuXHQjc3BsaXRQYWlyKHBhaXIpIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkocGFpcikgfHwgcGFpci5sZW5ndGggIT09IDIpIHJldHVybiBbbnVsbCwgbnVsbF07XG5cdFx0cmV0dXJuIHBhaXI7XG5cdH1cblx0aGFzTDEoa2V5MSkge1xuXHRcdHJldHVybiB0aGlzLiN0b3AuaGFzKGtleTEpO1xuXHR9XG5cdHNldChwYWlyLCB2YWx1ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0aGlzO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0Z2V0KHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdm9pZCAwO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZ2V0KGtleTEpPy5nZXQoa2V5Mik7XG5cdH1cblx0aGFzKHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5nZXQoa2V5MSk/LmhhcyhrZXkyKSA/PyBmYWxzZTtcblx0fVxuXHRkZWxldGUocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI3RvcC5nZXQoa2V5MSk7XG5cdFx0cmV0dXJuIGlubmVyID8gaW5uZXIuZGVsZXRlKGtleTIpIDogZmFsc2U7XG5cdH1cblx0ZGVsZXRlVG9wKGtleTEpIHtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmRlbGV0ZShrZXkxKTtcblx0fVxuXHRnZXRPckNyZWF0ZShwYWlyLCBmYWN0b3J5KSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhY3Rvcnk/LigpO1xuXHRcdGlmIChpbm5lci5oYXMoa2V5MikpIHJldHVybiBpbm5lci5nZXQoa2V5Mik7XG5cdFx0Y29uc3QgdmFsdWUgPSBmYWN0b3J5KCk7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblx0Z2V0T3JJbnNlcnQocGFpciwgdmFsdWUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRnZXRPckluc2VydENvbXB1dGVkKHBhaXIsIGNvbXB1dGUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY29tcHV0ZT8uKFtrZXkxLCBrZXkyXSk7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRjb25zdCB2YWx1ZSA9IGNvbXB1dGUoW2tleTEsIGtleTJdKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxufTtcbnZhciByZWdpc3RlcmVkSXRlcmF0ZWQgPSBuZXcgRG91YmxlV2Vha01hcCgpO1xuZnVuY3Rpb24gaXRlcmF0ZWQodGcsIGNiLCBvcHRpb25zID0gW1wiKlwiXSkge1xuXHRpZiAoIXRnKSByZXR1cm47XG5cdGlmICh0eXBlb2YgdGcgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHRnICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0aWYgKHJlZ2lzdGVyZWRJdGVyYXRlZC5oYXMoW3RnLCBjYl0pKSByZXR1cm4gcmVnaXN0ZXJlZEl0ZXJhdGVkLmdldChbdGcsIGNiXSk7XG5cdGNvbnN0ICRzdWIgPSAodmFsdWUsIG5hbWUsIG9sZCwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChuYW1lID09IFwidmFsdWVcIikge1xuXHRcdFx0Y29uc3QgZW50cmllcyA9IChvbGQ/LnZhbHVlID8/IG9sZCk/LmVudHJpZXM/LigpO1xuXHRcdFx0Y29uc3QgYmFzaXMgPSB0Zz8udmFsdWUgPz8gdmFsdWU/LnZhbHVlID8/IHZhbHVlO1xuXHRcdFx0aWYgKGVudHJpZXMpIGZvciAoY29uc3QgW2lkeCwgaXRlbV0gb2YgZW50cmllcykge1xuXHRcdFx0XHRjb25zdCBvZk9sZCA9IGl0ZW0gPz8gKG9sZD8udmFsdWUgPz8gb2xkKT8uW2lkeF0gPz8gbnVsbDtcblx0XHRcdFx0Y29uc3Qgb2ZOZXcgPSBiYXNpcz8uW2lkeF07XG5cdFx0XHRcdGlmIChvZk9sZCA9PSBudWxsICYmIG9mTmV3ICE9IG51bGwpIGNiKG9mTmV3LCBpZHgsIG51bGwsIFwiYWRkXCIpO1xuXHRcdFx0XHRlbHNlIGlmIChvZk9sZCAhPSBudWxsICYmIG9mTmV3ID09IG51bGwpIGNiKG51bGwsIGlkeCwgb2ZPbGQsIFwiZGVsZXRlXCIpO1xuXHRcdFx0XHRlbHNlIGlmIChpc05vdEVxdWFsKG9mT2xkLCBvZk5ldykpIGNiKG9mTmV3LCBpZHgsIG9mT2xkLCBcInNldFwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpdGVyYXRlZCh2YWx1ZSA/PyB0Zz8udmFsdWUsIGNiLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5hbWUgPT0gbnVsbCA/IHZvaWQgMCA6IHRnW25hbWVdO1xuXHR9O1xuXHRyZXR1cm4gcmVnaXN0ZXJlZEl0ZXJhdGVkLmdldE9ySW5zZXJ0Q29tcHV0ZWQoW3RnLCBjYl0sICgpID0+IHtcblx0XHRpZiAodGcgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBhZmZlY3RlZChbb2JzZXJ2YWJsZUJ5U2V0KHRnKSwgU3ltYm9sLml0ZXJhdG9yXSwgY2IsIG9wdGlvbnMpO1xuXHRcdGlmICh0ZyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIGFmZmVjdGVkKHRnLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKGhhc1ZhbHVlKHRnKSkgcmV0dXJuIGFmZmVjdGVkKHRnLCAkc3ViLCBvcHRpb25zKTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh0ZykgJiYgISh0Zz8ubGVuZ3RoID09IDIgJiYgaXNLZXlUeXBlKHRnPy5bMV0pICYmIGlzT2JzZXJ2YWJsZSh0Zz8uWzBdKSkpIHJldHVybiBhZmZlY3RlZChbdGcsIFN5bWJvbC5pdGVyYXRvcl0sIGNiLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gYWZmZWN0ZWQodGcsIGNiLCBvcHRpb25zKTtcblx0fSk7XG59XG5mdW5jdGlvbiB1bmFmZmVjdGVkKHRnLCBjYikge1xuXHRyZXR1cm4gd2l0aFByb21pc2UodGcsICh0YXJnZXQpID0+IHtcblx0XHRjb25zdCBpc1BhaXIgPSBBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgdGFyZ2V0Py5sZW5ndGggPT0gMiAmJiBbXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiXS5pbmRleE9mKHR5cGVvZiB0YXJnZXQ/LlswXSkgPj0gMCAmJiBpc0tleVR5cGUodGFyZ2V0Py5bMV0pO1xuXHRcdGNvbnN0IHByb3AgPSBpc1BhaXIgPyB0YXJnZXQ/LlsxXSA6IG51bGw7XG5cdFx0dGFyZ2V0ID0gaXNQYWlyICYmIHByb3AgIT0gbnVsbCA/IHRhcmdldD8uWzBdID8/IHRhcmdldCA6IHRhcmdldDtcblx0XHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldDtcblx0XHQodGFyZ2V0Py5bJHJlZ2lzdHJ5S2V5JF0gPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHVud3JhcCkpPy51bmFmZmVjdGVkPy4oY2IsIHByb3ApO1xuXHR9KTtcbn1cbnZhciBiaW5kQnkgPSAodGFyZ2V0LCByZWFjdGl2ZSwgd2F0Y2gpID0+IHtcblx0YWZmZWN0ZWQocmVhY3RpdmUsIG51bGwsICh2LCBwKSA9PiB7XG5cdFx0b2JqZWN0QXNzaWduKHRhcmdldCwgdiwgcCwgdHJ1ZSk7XG5cdH0pO1xuXHR3YXRjaD8uKCgpID0+IHRhcmdldCwgKE4pID0+IHtcblx0XHRmb3IgKGNvbnN0IGsgaW4gTikgb2JqZWN0QXNzaWduKHJlYWN0aXZlLCBOW2tdLCBrLCB0cnVlKTtcblx0fSwgeyBkZWVwOiB0cnVlIH0pO1xuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBkZXJpdmF0ZSA9IChmcm9tLCByZWFjdEZuLCB3YXRjaCkgPT4gYmluZEJ5KHJlYWN0Rm4oc2FmZShmcm9tKSksIGZyb20sIHdhdGNoKTtcbnZhciBiaW5kQnlLZXkgPSAodGFyZ2V0LCByZWFjdGl2ZSwga2V5ID0gKCkgPT4gXCJcIikgPT4gYWZmZWN0ZWQocmVhY3RpdmUsIG51bGwsICh2YWx1ZSwgcCkgPT4ge1xuXHRpZiAocCA9PSBrZXkoKSkgb2JqZWN0QXNzaWduKHRhcmdldCwgdmFsdWUsIG51bGwsIHRydWUpO1xufSk7XG5cbi8vIHNyYy9jb3JlL0Fzc2lnbmVkLnRzXG52YXIgY29uZGl0aW9uYWxJbmRleCA9IChjb25kTGlzdCA9IFtdKSA9PiB7XG5cdGNvbnN0IHNvdXJjZSA9IG9ic2VydmUoeyB2YWx1ZTogMCB9KTtcblx0Y29uc3QgcmVhZENvbmRpdGlvbiA9IChjb25kaXRpb24pID0+IHtcblx0XHRpZiAodHlwZW9mIGNvbmRpdGlvbiA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb25kaXRpb24oKTtcblx0XHRyZXR1cm4gaGFzVmFsdWUoY29uZGl0aW9uKSA/IGNvbmRpdGlvbi52YWx1ZSA6IGNvbmRpdGlvbjtcblx0fTtcblx0Y29uc3QgZXZhbHVhdGUgPSAoKSA9PiBjb25kTGlzdC5maW5kSW5kZXgoKGNvbmRpdGlvbikgPT4gISFyZWFkQ29uZGl0aW9uKGNvbmRpdGlvbikpO1xuXHRjb25zdCByZXN1bHQgPSBjb21wdXRlZChbc291cmNlLCBcInZhbHVlXCJdLCBldmFsdWF0ZSwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgaW52YWxpZGF0ZSA9ICgpID0+IHtcblx0XHRzb3VyY2UudmFsdWUrKztcblx0fTtcblx0Y29uc3QgZGlzcG9zZXJzID0gW107XG5cdGlmIChpc09ic2VydmFibGUoY29uZExpc3QpKSBkaXNwb3NlcnMucHVzaChhZmZlY3RlZChjb25kTGlzdCwgaW52YWxpZGF0ZSwge1xuXHRcdGFmZmVjdFR5cGVzOiBbXG5cdFx0XHRcImFkZFwiLFxuXHRcdFx0XCJzZXRcIixcblx0XHRcdFwiZGVsZXRlXCJcblx0XHRdLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogZmFsc2Vcblx0fSkpO1xuXHRmb3IgKGNvbnN0IGNvbmRpdGlvbiBvZiBjb25kTGlzdCkgaWYgKGhhc1ZhbHVlKGNvbmRpdGlvbikpIGRpc3Bvc2Vycy5wdXNoKGFmZmVjdGVkKFtjb25kaXRpb24sIFwidmFsdWVcIl0sIGludmFsaWRhdGUsIHtcblx0XHRhZmZlY3RUeXBlczogW1wic2V0dGVyXCJdLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogZmFsc2Vcblx0fSkpO1xuXHRhZGRUb0NhbGxDaGFpbihyZXN1bHQsIFN5bWJvbC5kaXNwb3NlLCAoKSA9PiBkaXNwb3NlcnMuZm9yRWFjaCgoZGlzcG9zZSkgPT4gZGlzcG9zZT8uKCkpKTtcblx0cmV0dXJuIHJlc3VsdDtcbn07XG52YXIgY29uZGl0aW9uYWxSZWYgPSAoY29uZCwgaWZUcnVlLCBpZkZhbHNlLCBiZWhhdmlvcikgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUoY29uZCkpIHJldHVybiBjb25kID8gaWZUcnVlIDogaWZGYWxzZTtcblx0Y29uc3QgZ2V0VHJ1ZSA9ICgpID0+IHtcblx0XHRyZXR1cm4gaWZUcnVlO1xuXHR9O1xuXHRjb25zdCBnZXRGYWxzZSA9ICgpID0+IHtcblx0XHRyZXR1cm4gaWZGYWxzZTtcblx0fTtcblx0Y29uc3QgdmFsdWVPZiA9IChuKSA9PiB7XG5cdFx0aWYgKG4gIT0gbnVsbCkgY29uZC52YWx1ZSA9IGhhc1ZhbHVlKG4pID8gbj8udmFsdWUgOiBuO1xuXHRcdHJldHVybiAoaGFzVmFsdWUoY29uZCkgPyBjb25kPy52YWx1ZSA6IGNvbmQpID8gZ2V0VHJ1ZSgpIDogZ2V0RmFsc2UoKTtcblx0fTtcblx0Y29uc3QgciA9IG9ic2VydmUoe1xuXHRcdFskdmFsdWVdOiB2YWx1ZU9mKCksXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSB2YWx1ZU9mKHYpO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSA9IHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoW2NvbmQsIFwidmFsdWVcIl0sICgpID0+IHtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHI/LlskdmFsdWVdO1xuXHRcdGNvbnN0IHZhbHVlID0gdmFsdWVPZigpO1xuXHRcdHJbJHZhbHVlXSA9IHZhbHVlO1xuXHRcdHI/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlLFxuXHRcdFx0b2xkVmFsdWUsXG5cdFx0XHR0cmlnZ2VyOiBcIm1hbnVhbFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHI7XG59O1xudmFyIGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWxSZWY7XG52YXIgcmVtYXAgPSAoc3ViLCBjYiwgZGVzdCkgPT4ge1xuXHRpZiAoIWRlc3QpIGRlc3QgPSBvYnNlcnZlKHt9KTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoc3ViLCAodmFsdWUsIHByb3AsIG9sZCkgPT4ge1xuXHRcdGlmIChwcm9wID09IG51bGwpIHJldHVybjtcblx0XHRjb25zdCBnb3QgPSBjYj8uKHZhbHVlLCBwcm9wLCBvbGQpO1xuXHRcdGlmICh0eXBlb2YgZ290ID09IFwib2JqZWN0XCIpIG9iamVjdEFzc2lnbk5vdEVxdWFsKGRlc3QsIGdvdCk7XG5cdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChkZXN0W3Byb3BdLCBnb3QpKSBkZXN0W3Byb3BdID0gZ290O1xuXHR9KTtcblx0aWYgKGRlc3QpIGFkZFRvQ2FsbENoYWluKGRlc3QsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gZGVzdDtcbn07XG52YXIgdW5pZmllZCA9ICguLi5zdWJzKSA9PiB7XG5cdGNvbnN0IGRlc3QgPSBvYnNlcnZlKHt9KTtcblx0c3Vicz8uZm9yRWFjaD8uKChzdWIpID0+IGFmZmVjdGVkKHN1YiwgKHZhbHVlLCBwcm9wLCBfKSA9PiB7XG5cdFx0aWYgKHByb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGlmIChpc05vdEVxdWFsKGRlc3RbcHJvcF0sIHZhbHVlKSkgZGVzdFtwcm9wXSA9IHZhbHVlO1xuXHR9KSk7XG5cdHJldHVybiBkZXN0O1xufTtcbnZhciBvYnNlcnZhYmxlQnlTZXQgPSAoc2V0KSA9PiB7XG5cdGNvbnN0IG9icyA9IG9ic2VydmUoW10pO1xuXHRvYnMucHVzaCguLi5BcnJheS5mcm9tKHNldD8udmFsdWVzPy4oKSB8fCBbXSkpO1xuXHRhZGRUb0NhbGxDaGFpbihvYnMsIFN5bWJvbC5kaXNwb3NlLCBhZmZlY3RlZChzZXQsICh2YWx1ZSwgXywgb2xkKSA9PiB7XG5cdFx0aWYgKGlzTm90RXF1YWwodmFsdWUsIG9sZCkpIHtcblx0XHRcdGlmIChvbGQgPT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsKSBvYnMucHVzaCh2YWx1ZSk7XG5cdFx0XHRlbHNlIGlmIChvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdGNvbnN0IGlkeCA9IG9icy5pbmRleE9mKG9sZCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCkgb2JzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gb2JzLmluZGV4T2Yob2xkKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwICYmIGlzTm90RXF1YWwob2JzW2lkeF0sIHZhbHVlKSkgb2JzW2lkeF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKTtcblx0cmV0dXJuIG9icztcbn07XG52YXIgb2JzZXJ2YWJsZUJ5TWFwID0gKG1hcCkgPT4ge1xuXHRjb25zdCBvYnMgPSBvYnNlcnZlKFtdKTtcblx0Y29uc3QgaW5pdGlhbEVudHJpZXMgPSBBcnJheS5mcm9tKG1hcC5lbnRyaWVzKCkpO1xuXHRvYnMucHVzaCguLi5pbml0aWFsRW50cmllcyk7XG5cdGFkZFRvQ2FsbENoYWluKG9icywgU3ltYm9sLmRpc3Bvc2UsIGFmZmVjdGVkKG1hcCwgKHZhbHVlLCBwcm9wLCBvbGQpID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2YWx1ZSwgb2xkKSB8fCBvbGQgPT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsIHx8IG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdGlmIChvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdGxldCBpZHggPSBvYnMuZmluZEluZGV4KChbbmFtZSwgX10pID0+IG5hbWUgPT0gcHJvcCk7XG5cdFx0XHRcdGlmIChpZHggPCAwKSBpZHggPSBvYnMuZmluZExhc3RJbmRleCgoW18sIHZhbF0pID0+IG9sZCA9PT0gdmFsKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwKSBvYnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgaWR4ID0gb2JzLmZpbmRJbmRleCgoW25hbWUsIF9dKSA9PiBuYW1lID09IHByb3ApO1xuXHRcdFx0XHRpZiAoaWR4ID49IDAgJiYgaWR4IDwgb2JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlmIChpc05vdEVxdWFsKG9ic1tpZHhdPy5bMV0sIHZhbHVlKSkgb2JzW2lkeF0gPSBbcHJvcCwgdmFsdWVdO1xuXHRcdFx0XHR9IGVsc2Ugb2JzLnB1c2goW3Byb3AsIHZhbHVlXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KSk7XG5cdHJldHVybiBvYnM7XG59O1xudmFyIGFzc2lnbk1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGFzc2lnbiA9IChhLCBiLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IGlzQUNvbXB1dGUgPSB0eXBlb2YgYT8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBhPy5sZW5ndGggPT0gMiwgaXNCQ29tcHV0ZSA9IHR5cGVvZiBiPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIGI/Lmxlbmd0aCA9PSAyLCBjbXBCRm5jID0gaXNCQ29tcHV0ZSA/IGI/LlsxXSA6IG51bGw7XG5cdGNvbnN0IGlzQVByb3AgPSAoaXNLZXlUeXBlKGE/LlsxXSkgfHwgYT8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgYT8ubGVuZ3RoID09IDI7XG5cdGxldCBhX3Byb3AgPSBpc0FQcm9wICYmICFpc0FDb21wdXRlID8gYT8uWzFdIDogQXJyYXkuaXNBcnJheShhKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQVByb3AgJiYgIWlzQUNvbXB1dGUpIGEgPSBbYSwgYV9wcm9wXTtcblx0aWYgKGlzQUNvbXB1dGUpIGFbMV0gPSBhX3Byb3A7XG5cdGNvbnN0IGlzQlByb3AgPSAoaXNLZXlUeXBlKGI/LlsxXSkgfHwgYj8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgYj8ubGVuZ3RoID09IDI7XG5cdGxldCBiX3Byb3AgPSBpc0JQcm9wICYmICFpc0JDb21wdXRlID8gYj8uWzFdIDogQXJyYXkuaXNBcnJheShiKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQlByb3AgJiYgIWlzQkNvbXB1dGUpIGIgPSBbYiwgYl9wcm9wXTtcblx0aWYgKGlzQkNvbXB1dGUpIGJbMV0gPSBiX3Byb3A7XG5cdGlmIChhX3Byb3AgPT0gbnVsbCB8fCBiX3Byb3AgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShhX3Byb3AsIGE/LlswXSkgfHwgaXNBcnJheUludmFsaWRLZXkoYl9wcm9wLCBiPy5bMF0pKSByZXR1cm47XG5cdGlmICghKCh0eXBlb2YgYj8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGI/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmIGI/LlswXSAhPSBudWxsKSAmJiAhQXJyYXkuaXNBcnJheShhWzBdKSkge1xuXHRcdCRhdm9pZFRyaWdnZXIoYiwgKCkgPT4ge1xuXHRcdFx0YVswXVthX3Byb3BdID0gYj8uWzBdO1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB7fTtcblx0fVxuXHRjb25zdCBjb21wdXRlID0gKHYsIHApID0+IHtcblx0XHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKTtcblx0XHRjb25zdCBiX3RtcCA9IGJSZWY/LmRlcmVmPy4oKTtcblx0XHRpZiAoYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmJvdW5kID09IGJfdG1wKSB7XG5cdFx0XHRsZXQgdmFsID0gbnVsbDtcblx0XHRcdGNvbnN0IGNtcGZ4ID0gYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmNtcGZ4O1xuXHRcdFx0JGF2b2lkVHJpZ2dlcihiX3RtcCwgKCkgPT4ge1xuXHRcdFx0XHRpZiAodHlwZW9mIGNtcGZ4ID09IFwiZnVuY3Rpb25cIikgdmFsID0gY21wZng/LigkZ2V0VmFsdWUoYl90bXApID8/IHYsIHAsIG51bGwpO1xuXHRcdFx0XHRlbHNlIHZhbCA9IGJfdG1wPy5bcF0gPz8gdjtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgbnYgPSAkZ2V0VmFsdWUodmFsKTtcblx0XHRcdGlmIChpc05vdEVxdWFsKGFfdG1wW2FfcHJvcF0sIG52KSkgJGF2b2lkVHJpZ2dlcihiX3RtcCwgKCkgPT4ge1xuXHRcdFx0XHRhX3RtcFthX3Byb3BdID0gbnY7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgKChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKSk/LmdldD8uKGFfcHJvcCkpPy5kaXNwb3NlPy4oKTtcblx0fTtcblx0Y29uc3QgZGlzcG9zZSA9ICgpID0+IHtcblx0XHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKTtcblx0XHRjb25zdCBtYXAgPSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKTtcblx0XHRjb25zdCBzdG9yZSA9IG1hcD8uZ2V0Py4oYV9wcm9wKTtcblx0XHRtYXA/LmRlbGV0ZT8uKGFfcHJvcCk7XG5cdFx0c3RvcmU/LnVuc3ViPy4oKTtcblx0fTtcblx0Y29uc3QgYlJlZiA9IGI/LlswXSAhPSBudWxsICYmICh0eXBlb2YgYj8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGI/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmICEoYj8uWzBdIGluc3RhbmNlb2YgV2Vha1JlZiB8fCB0eXBlb2YgYj8uWzBdPy5kZXJlZiA9PSBcImZ1bmN0aW9uXCIpID8gbmV3IFdlYWtSZWYoYj8uWzBdKSA6IGI/LlswXSwgYVJlZiA9IGE/LlswXSAhPSBudWxsICYmICh0eXBlb2YgYT8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGE/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmICEoYT8uWzBdIGluc3RhbmNlb2YgV2Vha1JlZiB8fCB0eXBlb2YgYT8uWzBdPy5kZXJlZiA9PSBcImZ1bmN0aW9uXCIpID8gbmV3IFdlYWtSZWYoYT8uWzBdKSA6IGE/LlswXTtcblx0bGV0IHN0b3JlID0ge1xuXHRcdGNvbXB1dGUsXG5cdFx0ZGlzcG9zZSxcblx0XHRjbXBmeDogY21wQkZuY1xuXHR9O1xuXHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKSwgYl90bXAgPSBiUmVmPy5kZXJlZj8uKCk7XG5cdGlmIChhUmVmIGluc3RhbmNlb2YgV2Vha1JlZikge1xuXHRcdGlmIChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uYm91bmQgIT0gYl90bXApIGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5kZWxldGU/LihhX3Byb3ApO1xuXHRcdHN0b3JlID0gKGFzc2lnbk1hcD8uZ2V0T3JJbnNlcnQ/LihhX3RtcCwgLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSkpPy5nZXRPckluc2VydENvbXB1dGVkPy4oYV9wcm9wLCAoKSA9PiAoe1xuXHRcdFx0Ym91bmQ6IGJfdG1wLFxuXHRcdFx0Y21wZng6IGNtcEJGbmMsXG5cdFx0XHR1bnN1YjogbnVsbCxcblx0XHRcdGNvbXB1dGUsXG5cdFx0XHRkaXNwb3NlXG5cdFx0fSkpO1xuXHRcdHN0b3JlLnVuc3ViID0gYWZmZWN0ZWQoYiwgY29tcHV0ZSk7XG5cdFx0c3RvcmUuY21wZnggPSBjbXBCRm5jO1xuXHRcdGFkZFRvQ2FsbENoYWluKGFfdG1wLCBTeW1ib2wuZGlzcG9zZSwgc3RvcmU/LmRpc3Bvc2UpO1xuXHRcdGFkZFRvQ2FsbENoYWluKGJfdG1wLCBTeW1ib2wuZGlzcG9zZSwgc3RvcmU/LmRpc3Bvc2UpO1xuXHR9XG5cdGlmIChiX3RtcCAmJiAhQXJyYXkuaXNBcnJheShiX3RtcCkpICRhdm9pZFRyaWdnZXIoYV90bXAsICgpID0+IHtcblx0XHRiX3RtcFtiX3Byb3BdID8/PSBhX3RtcD8uW2FfcHJvcF0gPz8gYl90bXBbYl9wcm9wXTtcblx0fSk7XG5cdHJldHVybiBzdG9yZT8uZGlzcG9zZTtcbn07XG52YXIgbGluayA9IChhLCBiLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IHVzdWIgPSBbYXNzaWduKGEsIGIsIHByb3ApLCBhc3NpZ24oYiwgYSwgcHJvcCldO1xuXHRyZXR1cm4gKCkgPT4gdXN1Yj8ubWFwPy4oKGMpID0+IGM/LigpKTtcbn07XG52YXIgY29tcHV0ZWQgPSAoc3JjLCBjYiwgYmVoYXZpb3IsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgaXNBQ29tcHV0ZSA9IHR5cGVvZiBzcmM/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgc3JjPy5sZW5ndGggPT0gMjtcblx0Y29uc3QgaXNBUHJvcCA9IChpc0tleVR5cGUoc3JjPy5bMV0pIHx8IHNyYz8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgc3JjPy5sZW5ndGggPT0gMjtcblx0bGV0IGFfcHJvcCA9IGlzQVByb3AgJiYgIWlzQUNvbXB1dGUgPyBzcmM/LlsxXSA6IEFycmF5LmlzQXJyYXkoc3JjKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQVByb3AgJiYgIWlzQUNvbXB1dGUpIHNyYyA9IFtpc0FQcm9wID8gc3JjPy5bMF0gOiBzcmMsIGFfcHJvcF07XG5cdGlmIChpc0FDb21wdXRlKSBzcmNbMV0gPSBhX3Byb3A7XG5cdGlmIChhX3Byb3AgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShhX3Byb3AsIHNyYz8uWzBdKSkgcmV0dXJuO1xuXHRsZXQgb2xkVmFsdWUgPSB2b2lkIDA7XG5cdGxldCBvbGRBcmcgPSB2b2lkIDA7XG5cdGNvbnN0IGNtcCA9IChhcmcsIGZvcmNlKSA9PiB7XG5cdFx0YXJnID8/PSBzcmM/LlswXT8uW2FfcHJvcF0gPz8gb2xkQXJnID8/IGFyZztcblx0XHRpZiAoZm9yY2UgfHwgaXNOb3RFcXVhbChvbGRBcmcsIGFyZykgJiYgYXJnICE9IHZvaWQgMCB8fCBvbGRWYWx1ZSA9PSB2b2lkIDApIHtcblx0XHRcdGxldCBudiA9IGNiPy4oYXJnLCBhX3Byb3AsIG9sZEFyZyk7XG5cdFx0XHRvbGRWYWx1ZSA9IG52O1xuXHRcdFx0cmV0dXJuIG52O1xuXHRcdH1cblx0XHRyZXR1cm4gb2xkVmFsdWU7XG5cdH07XG5cdGNvbnN0IHdycEZ1bmMgPSAoYXJnLCBwcm9wID0gXCJ2YWx1ZVwiLCBvbGRBcmckLCBvcCkgPT4ge1xuXHRcdG9sZEFyZyA9IG9sZEFyZyQgPz8gb2xkQXJnO1xuXHRcdGFyZyA/Pz0gc3JjPy5bMF0/LlthX3Byb3BdO1xuXHRcdGlmIChpc05vdEVxdWFsKG9sZEFyZywgYXJnKSAmJiBhcmcgIT0gdm9pZCAwIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0bGV0IG52ID0gY2I/LihhcmcsIGFfcHJvcCwgb2xkQXJnLCBvcCk7XG5cdFx0XHRvbGRBcmcgPSBhcmc7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbChudiwgb2xkVmFsdWUpIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0XHRyZltwcm9wXSA9IG9sZFZhbHVlID0gbnY7XG5cdFx0XHRcdG9sZFZhbHVlID0gcmZbcHJvcF07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnY7XG5cdFx0fVxuXHRcdHJldHVybiByZltwcm9wXTtcblx0fTtcblx0Y29uc3QgaW5pdGlhbCA9IGNtcChzcmNbMF1bYV9wcm9wXSA/PyBvbGRBcmcpO1xuXHRjb25zdCBwZW5kaW5nSW5pdGlhbCA9IGlzUHJvbWlzZShpbml0aWFsKTtcblx0Y29uc3QgJGFwcGx5ID0gU3ltYm9sLmZvcihcIkBAYXBwbHlcIik7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkcHJvbWlzZSwge1xuXHRcdHZhbHVlOiBpbml0aWFsLFxuXHRcdHdyaXRhYmxlOiB0cnVlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgJHZhbHVlLCB7XG5cdFx0dmFsdWU6IGluaXRpYWwsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkYmVoYXZpb3IsIHtcblx0XHR2YWx1ZTogYmVoYXZpb3IsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBTeW1ib2w/LnRvU3RyaW5nVGFnLCB7XG5cdFx0dmFsdWU6IFN0cmluZyh3cnBGdW5jWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIixcblx0XHR3cml0YWJsZTogZmFsc2Vcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBTeW1ib2w/LnRvUHJpbWl0aXZlLCB7XG5cdFx0dmFsdWU6IHRyeVBhcnNlQnlIaW50KHdycEZ1bmNbJHZhbHVlXSwgXCJudW1iZXJcIiksXG5cdFx0d3JpdGFibGU6IGZhbHNlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgXCJ2YWx1ZVwiLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgY3AgPSBjbXAoKTtcblx0XHRcdGlmIChjcCAhPSBudWxsKSB3cnBGdW5jWyR2YWx1ZV0gPSBjcDtcblx0XHRcdHJldHVybiB3cnBGdW5jWyR2YWx1ZV07XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKGFyZykge1xuXHRcdFx0d3JwRnVuY1skdmFsdWVdID0gY21wKGFyZywgdHJ1ZSk7XG5cdFx0fVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRhcHBseSwge1xuXHRcdHZhbHVlOiAodikgPT4ge1xuXHRcdFx0aWYgKHYgPT0gdm9pZCAwKSByZXR1cm4gcmY/LnZhbHVlO1xuXHRcdFx0cmYudmFsdWUgPSB2O1xuXHRcdFx0cmV0dXJuIHJmPy52YWx1ZTtcblx0XHR9LFxuXHRcdHdyaXRhYmxlOiBmYWxzZVxuXHR9KTtcblx0Y29uc3QgcmYgPSBvYnNlcnZlKHdycEZ1bmMpO1xuXHRjb25zdCB3cml0ZUNvbXB1dGVkID0gKHZhbHVlLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oKHYpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gcmY/LlskdmFsdWVdO1xuXHRcdFx0cmZbJHZhbHVlXSA9IHY7XG5cdFx0XHRyZj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0XHRvbGRWYWx1ZSxcblx0XHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH0pO1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gcmY/LlskdmFsdWVdO1xuXHRcdHJmWyR2YWx1ZV0gPSB2YWx1ZTtcblx0XHRyZj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRvbGRWYWx1ZSxcblx0XHRcdHRyaWdnZXJcblx0XHR9KTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH07XG5cdGlmIChwZW5kaW5nSW5pdGlhbCkgd3JpdGVDb21wdXRlZChpbml0aWFsLCBcInJlc29sdmVkXCIpO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChbc3JjPy5bMF0gPz8gc3JjLCBhX3Byb3AgPz8gXCJ2YWx1ZVwiXSwgKCkgPT4ge1xuXHRcdHdyaXRlQ29tcHV0ZWQoY21wKCksIFwibWFudWFsXCIpO1xuXHR9KTtcblx0YWRkVG9DYWxsQ2hhaW4ocmYsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcmY7XG59O1xudmFyIGRlbGF5ZWRTdWJzY3JpYmUgPSAocmVmLCBjYiwgZGVsYXkgPSAxMDApID0+IHtcblx0bGV0IHRtO1xuXHRyZXR1cm4gYWZmZWN0ZWQocmVmLCBcInZhbHVlXCIsICh2KSA9PiB7XG5cdFx0aWYgKCF2ICYmIHRtKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodG0pO1xuXHRcdFx0dG0gPSBudWxsO1xuXHRcdH0gZWxzZSBpZiAodiAmJiAhdG0pIHRtID0gdHJpZ2dlcldpdGhEZWxheShyZWYsIGNiLCBkZWxheSkgPz8gdG07XG5cdH0pO1xufTtcblxuZXhwb3J0IHsgJGFmZmVjdGVkLCAkcmVmLCAkcmVzb2x2ZWQsICR0cmlnZ2VyLCAkdHJpZ2dlckNvbnRyb2wsICR0cmlnZ2VyTGVzcywgJHRyaWdnZXJMb2NrLCBBc3NpZ25PYmplY3RIYW5kbGVyLCBEb3VibGVXZWFrTWFwLCBhZGRUb0NhbGxDaGFpbiwgYWZmZWN0ZWQsIGFzc2lnbiwgYXNzaWduTWFwLCBiaW5kQnksIGJpbmRCeUtleSwgYm9vbGVhblJlZiwgY29tcHV0ZWQsIGNvbmRpdGlvbmFsLCBjb25kaXRpb25hbEluZGV4LCBjb25kaXRpb25hbFJlZiwgZGVsYXllZEJlaGF2aW9yLCBkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IsIGRlbGF5ZWRTdWJzY3JpYmUsIGRlcmVmLCBkZXJpdmF0ZSwgZWZmZWN0LCBlZmZlY3RlZCwgaXNPYnNlcnZhYmxlLCBpdGVyYXRlZCwgbGluaywgbWFrZUFycmF5T2JzZXJ2YWJsZSwgbWFrZU9iamVjdEFzc2lnbmFibGUsIG1ha2VSZXNvbHZlZE9wLCBudW1iZXJSZWYsIG9ic2VydmFibGVCeU1hcCwgb2JzZXJ2YWJsZUJ5U2V0LCBvYnNlcnZlLCBwcm9taXNlZCwgcHJvcFJlZiwgcmVjb3ZlclJlYWN0aXZlLCByZWYsIHJlbWFwLCByZXNvbHZlZCwgc2FmZSwgc3BlY2lhbGl6ZWRTdWJzY3JpYmUsIHN0cmluZ1JlZiwgc3Vic2NyaWJlRGlyZWN0bHksIHN1YnNjcmliZUlucHV0LCBzdWJzY3JpYmVQYWlyZWQsIHN1YnNjcmliZVRoZW5hYmxlLCB0cmlnZ2VyV2l0aERlbGF5LCB1bmFmZmVjdGVkLCB1bmlmaWVkLCB1bndyYXAsIHVzZU9ic2VydmFibGUsIHdyYXBSZWYsIHdyYXBTZXRBc0FycmF5IH07Il0sCiAgIm1hcHBpbmdzIjogIkFBQUEsU0FBUyxpQkFBQUEsSUFBZSxhQUFBQyxJQUFXLGdCQUFnQkMsSUFBZ0IsWUFBQUMsSUFBVSxXQUFBQyxHQUFTLGlCQUFBQyxJQUFlLGNBQUFDLElBQVksaUJBQUFDLElBQWUsWUFBQUMsR0FBVSxxQkFBQUMsSUFBbUIsYUFBQUMsR0FBVyxjQUFBQyxHQUFZLGVBQUFDLEdBQWEsYUFBQUMsR0FBVyxtQkFBQUMsSUFBaUIsZ0JBQUFDLElBQWMsd0JBQUFDLElBQXNCLG9CQUFBQyxJQUFrQix1QkFBQUMsSUFBcUIsWUFBWUMsSUFBWSxrQkFBQUMsU0FBc0I7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QWlCSCxHQUFLOVEsR0FBSWtSLENBQUssS0FBS0c7QUFBQSxFQUMvRCxDQUFDO0FBQ0Y7IiwKICAibmFtZXMiOiBbIiRhdm9pZFRyaWdnZXIiLCAiJGdldFZhbHVlIiwgIiR0cmlnZ2VyTG9jayQxIiwgIlByb21pc2VkIiwgImJpbmRDdHgiLCAiY2FsbEJ5QWxsUHJvcCIsICJjYWxsQnlQcm9wIiwgImRlZmF1bHRCeVR5cGUiLCAiaGFzVmFsdWUiLCAiaXNBcnJheUludmFsaWRLZXkiLCAiaXNLZXlUeXBlIiwgImlzTm90RXF1YWwiLCAiaXNQcmltaXRpdmUiLCAiaXNQcm9taXNlIiwgIm1ha2VUcmlnZ2VyTGVzcyIsICJvYmplY3RBc3NpZ24iLCAib2JqZWN0QXNzaWduTm90RXF1YWwiLCAicG90ZW50aWFsbHlBc3luYyIsICJwb3RlbnRpYWxseUFzeW5jTWFwIiwgInJlc29sdmVkJDEiLCAidHJ5UGFyc2VCeUhpbnQiLCAiJHZhbHVlIiwgIiRleHRyYWN0S2V5JCIsICIkb3JpZ2luYWxLZXkkIiwgIiRyZWdpc3RyeUtleSQiLCAiJGJlaGF2aW9yIiwgIiRwcm9taXNlIiwgIiRyZXNvbHZlZCIsICIkdHJpZ2dlckxlc3MiLCAiJHRyaWdnZXJMb2NrIiwgIiR0cmlnZ2VyQ29udHJvbCIsICIkdHJpZ2dlciIsICIkYWZmZWN0ZWQiLCAiJGlzTm90RXF1YWwiLCAiJHJlYWxQcm9wIiwgIiRvcmlnaW5hbE9iamVjdHMkIiwgInNhZmUiLCAidGFyZ2V0IiwgInVud3JhcCIsICJtYXBwZWQiLCAiZSIsICJLIiwgIlYiLCAiYXJyIiwgImRlcmVmIiwgImRpc2NvdW50VmFsdWUiLCAib3JpZ2luYWwiLCAiJHZhbCIsICJpc1RoZW5hYmxlIiwgInZhbCIsICJ3aXRoUHJvbWlzZSIsICJjYiIsICJkaXNwb3NlTWFwIiwgImRpc3Bvc2VSZWdpc3RyeSIsICJjYWxsc3RhY2siLCAiYWRkVG9DYWxsQ2hhaW4iLCAib2JqIiwgIm1ldGhvZEtleSIsICJjYWxsYmFjayIsICJjaGFpblRhcmdldCIsICJDYWxsQ2hhaW4iLCAiYXJncyIsICJpc0FycmF5SW5kZXgiLCAicHJvcCIsICJudW0iLCAid3JhcFNldEFzQXJyYXkiLCAic291cmNlIiwgIm9wdGlvbnMiLCAiYmFja2luZ1NldCIsICJub3RpZnlEdXBsaWNhdGUiLCAidmFsdWUiLCAidmlhIiwgImluZGV4IiwgIml0ZW0iLCAic25hcHNob3QiLCAicmVidWlsZEZyb20iLCAibWV0aG9kcyIsICJpdGVtcyIsICJzaXplIiwgIml0ZXJhdG9yIiwgImN1cnJlbnQiLCAidG9QcmVwZW5kIiwgIm5leHQiLCAic3RhcnQiLCAiZGVsZXRlQ291bnQiLCAibm9ybWFsaXplZFN0YXJ0IiwgImFjdHVhbERlbGV0ZUNvdW50IiwgInJlbW92ZWQiLCAiaW5zZXJ0UG9zaXRpb24iLCAiXyIsICJuZXh0TGVuZ3RoIiwgIm5leHRWYWx1ZSIsICJjdXJyZW50VmFsdWUiLCAiaWR4IiwgImtleXMiLCAiaSIsICJBc3NpZ25PYmplY3RIYW5kbGVyIiwgIm5hbWUiLCAibmV3VCIsICJjdHgiLCAibWFrZU9iamVjdEFzc2lnbmFibGUiLCAicHgiLCAid2l0aFVuc3ViU3ltYm9sIiwgIndpdGhVbnN1YiIsICJjb21wbGV0ZVdpdGhVbnN1YiIsICJzdWJzY3JpYmVyIiwgIndlYWsiLCAiaGFuZGxlciIsICJyZWdpc3RyeSIsICJzYXZDb21wbGV0ZSIsICJ1bmFmZmVjdGVkIiwgInIiLCAic3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wiLCAic3Vic2NyaXB0UmVnaXN0cnkiLCAiZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sIiwgImdsb2JhbEVmZmVjdExpc3RlbmVycyIsICJlZmZlY3RHbG9iYWxseSIsICJub3JtYWxpemVkIiwgIm5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMiLCAid3JhcHBlZFN5bWJvbCIsICJ3cmFwcGVkIiwgInJlZ2lzdGVyIiwgIndoYXQiLCAiaGFuZGxlIiwgIlN1YnNjcmlwdCIsICJ3cmFwV2l0aCIsICJmb3JBbGwiLCAid2lsZGNhcmRUcmlnZ2VycyIsICJ0cmlnZ2VyQWxpYXNlcyIsICJ0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wiLCAiY2Fub25pY2FsIiwgImFsaWFzZXMiLCAiYWxpYXMiLCAidHJpZ2dlckNhbm9uaWNhbE5hbWVzIiwgIm5vcm1hbGl6ZVRyaWdnZXJOYW1lIiwgInRyaWdnZXIiLCAidHJpZ2dlck5hbWVzT2YiLCAiZXhwYW5kVHJpZ2dlckZpbHRlciIsICJ0eXBlcyIsICJub3JtYWxpemVUcmlnZ2VyRmlsdGVyIiwgInRyaWdnZXJzIiwgImxpc3QiLCAidHJpZ2dlckZpbHRlckFsbG93cyIsICJmaWx0ZXIiLCAiaXNPcHRpb25zT2JqZWN0IiwgIm5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyIsICJhZmZlY3RUeXBlcyIsICJTdWJzY3JpcHRTeW1ib2wiLCAiI3NvdXJjZSIsICIjbGlzdGVuZXJzIiwgIiNmbGFncyIsICIjbmF0aXZlIiwgIiNpdGVyYXRvciIsICIjaW5EaXNwYXRjaCIsICIjZGlzYWJsZWRUcmlnZ2VycyIsICIjdHJpZ2dlckNvbnRyb2wiLCAiI3BlbmRpbmciLCAiI3BlbmRpbmdCeVByb3AiLCAiI2ZsdXNoU2NoZWR1bGVkIiwgImVuYWJsZWQiLCAiI2Rpc3BhdGNoIiwgImNvbnRyb2xsZXIiLCAicmVzIiwgIm9sZFZhbHVlIiwgImV0YyIsICJsaXN0ZW5lcnMiLCAicmVjb3JkIiwgImV2ZW50IiwgIm53IiwgIm5hbWVzIiwgInByZXZpb3VzIiwgInJlc3RvcmUiLCAid2FzRGlzYWJsZWQiLCAicmVzdWx0IiwgIm9wS2V5IiwgImJ5T3AiLCAiYmF0Y2giLCAib3BNYXAiLCAibm0iLCAidiIsICJvdiIsICJ0ZyIsICJyZXN0IiwgInJhd09mIiwgInVud3JhcHBlZCIsICJyZXNvbHZlZCIsICJtb2RlIiwgInJhdyIsICJtYWtlUmVzb2x2ZWRPcCIsICJlbWl0IiwgInJ1biIsICJwZW5kaW5nIiwgImtleSIsICJjYWxsYmFja09yVmFsdWUiLCAiZW1pdFJlc29sdmVkIiwgImJpbmRFeGlzdGluZ1RoZW5hYmxlcyIsICJsaXZlIiwgIl9fc2FmZUdldEd1YXJkU3ltYm9sIiwgInJlYWN0aXZlUHJvcGVydGllc1N5bWJvbCIsICJyZWFjdGl2ZVByb3BlcnRpZXMiLCAicmVhY3RpdmVNZXRob2RzU3ltYm9sIiwgInJlYWN0aXZlTWV0aG9kcyIsICJtYXJrUmVhY3RpdmVQcm9wZXJ0eSIsICJpc1JlYWN0aXZlUHJvcGVydHkiLCAibm90aWZ5UmVhY3RpdmVQcm9wZXJ0eSIsICJyZWNlaXZlciIsICJvd25lciIsICJuZXdWYWx1ZSIsICJ0cmlnZ2VyTmFtZSIsICJ0cmlnZ2VyS2V5T2YiLCAic2FmZUdldCIsICJkZWZpbmVSZWFjdGl2ZVByb3BlcnR5IiwgImRlc2NyaXB0b3IiLCAiaW5pdGlhbFZhbHVlIiwgInZhbHVlcyIsICJsYXN0QXNzaWduZWQiLCAicHJvcGVydHlEZXNjIiwgImFjdHVhbFZhbHVlIiwgIl9fc3lzdGVtU2tpcCIsICJzeXN0ZW1Ta2lwR2V0IiwgImdvdCIsICJfX3NhZmVHZXRHdWFyZCIsICJpc0dldHRlciIsICJwcm9wTmFtZSIsICJmYWxsVGhyb3VnaCIsICJ0bXAiLCAic2FmZVNldCIsICJhY3RpdmUiLCAicmVjIiwgImhhc093biIsICJpc1RyaWdnZXJFbWl0T3B0aW9ucyIsICJhbGxvd1ZhbHVlT25seSIsICJ0cmlnZ2VyT3B0aW9uVmFsdWUiLCAiZmFsbGJhY2siLCAidHJpZ2dlck9wdGlvblRyaWdnZXIiLCAiaXNSdW50aW1lS2V5IiwgInJlYWxQcm9wT2YkMSIsICJ0cmlnZ2VyVmFsdWVPZiIsICJyZWFsUHJvcCIsICJjcmVhdGVUcmlnZ2VyQVBJIiwgImFwaSIsICJvcE9yT3B0aW9ucyIsICJjb250cm9sIiwgInN5c3RlbUdldCIsICJhZmZlY3RlZCIsICJvYnNlcnZhYmxlQVBJTWV0aG9kcyIsICJ1c3ViIiwgImNvbXAiLCAiT2JzZXJ2ZUFycmF5TWV0aG9kIiwgIiNuYW1lIiwgIiNzZWxmIiwgIiNoYW5kbGUiLCAic2VsZiIsICJza2lwIiwgImFkZGVkIiwgInNldFBhaXJzIiwgIm9sZFN0YXRlIiwgIm9ic2VydmVBcnJheSIsICJyZWciLCAiSSIsICJwYWlyIiwgInRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlIiwgIm9sZExlbiIsICJuZXdMZW4iLCAicmVtb3ZlZEl0ZW1zIiwgImFkZGVkQ291bnQiLCAiT2JzZXJ2ZUFycmF5SGFuZGxlciIsICJzeXMiLCAib2JzIiwgIm9sZCIsICJ4eXp3IiwgInJnYmEiLCAieHl6d19pZHgiLCAicmdiYV9pZHgiLCAiT2JzZXJ2ZU9iamVjdEhhbmRsZXIiLCAiaGludCIsICJmdCIsICIkb3JpZ2luYWwiLCAic3Vic2NyaXB0IiwgIiRyZXN1bHQiLCAiT2JzZXJ2ZU1hcEhhbmRsZXIiLCAidmFsdWVPckZ4IiwgIm9sZFZhbHVlcyIsICJoYWQiLCAiY29tcHV0ZWQiLCAiZGVmYXVsdE9yQ29tcHV0ZSIsICJpbmNvbWluZyIsICJPYnNlcnZlU2V0SGFuZGxlciIsICIkaXNPYnNlcnZhYmxlIiwgIm1ha2VSZWFjdGl2ZVByb3BlcnRpZXMiLCAiZW50cmllcyIsICJvYnNlcnZlT2JqZWN0IiwgIm9ic2VydmVNYXAiLCAibWFwIiwgIm9ic2VydmVTZXQiLCAic2V0IiwgIm51bWJlclJlZiIsICJpbml0aWFsIiwgImJlaGF2aW9yIiwgIiRyIiwgIm9ic2VydmUiLCAic3RyaW5nUmVmIiwgImJvb2xlYW5SZWYiLCAid3JhcFJlZiIsICJtYXJrUmVhbFByb3AiLCAicHJvcFJlZiIsICJzcmMiLCAic3JjUHJvcCIsICJpc01hcCIsICJpc1NldCIsICJyZWFkU2xvdCIsICJ3cml0ZVNsb3QiLCAibWVtYmVyIiwgImlzT2JzZXJ2YWJsZSIsICJyZWNvdmVyUmVhY3RpdmUiLCAic2xvdCIsICJ1c2IiLCAiX3Byb3AiLCAicHJldiIsICIkcmVmIiwgInR5cGVkIiwgInJlZiIsICJwcm9taXNlZCIsICJwcm9taXNlIiwgInRyaWdnZXJXaXRoRGVsYXkiLCAiZGVsYXkiLCAiZGVsYXllZEJlaGF2aW9yIiwgInNpZyIsICJ0bSIsICJkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IiLCAic3RhdGVOYW1lIiwgInJlYWN0aXZlIiwgInVzZU9ic2VydmFibGUiLCAib2JzZXJ2YWJsZSIsICJzcGVjaWFsaXplZFN1YnNjcmliZSIsICJjaGVja1ZhbGlkT2JqIiwgImluaXRpYWxUcmlnZ2VyIiwgInJlYWxQcm9wT2YiLCAibm9ybWFsaXplQWZmZWN0ZWRQcm9wIiwgInByb3BWYWx1ZU9mIiwgImNhbGxCeVByb3BSZWZBd2FyZSIsICJ3aXRoVHJpZ2dlciIsICJzdWJzY3JpYmVEaXJlY3RseSIsICJ0UHJvcCIsICJpbml0aWFsQ2IiLCAidW5TdWIiLCAic3Vic2NyaWJlSW5wdXQiLCAiJG9wdCIsICIkY2IiLCAiZXYiLCAiY2hlY2tJc1BhaXJlZCIsICJpc0VmZmVjdE9wdGlvbnNBcmciLCAibm9ybWFsaXplRWZmZWN0VGFyZ2V0cyIsICJ0YXJnZXRzIiwgImVmZmVjdFRhcmdldENvbnRleHQiLCAidG9FZmZlY3RFdmVudCIsICJzdWJzY3JpYmVQYWlyZWQiLCAic3Vic2NyaWJlVGhlbmFibGUiLCAiZWZmZWN0IiwgImFmZmVjdGVkT3B0aW9ucyIsICJkaXNwb3NlcnMiLCAiZGlzcG9zZSIsICJlZmZlY3RlZCIsICJtYWtlQXJyYXlPYnNlcnZhYmxlIiwgIm9ic2VydmFibGVCeVNldCIsICJvYnNlcnZhYmxlQnlNYXAiLCAiRG91YmxlV2Vha01hcCIsICIjdG9wIiwgIiNlbnN1cmVJbm5lciIsICJrZXkxIiwgImlubmVyIiwgIiNzcGxpdFBhaXIiLCAia2V5MiIsICJmYWN0b3J5IiwgImNvbXB1dGUiLCAicmVnaXN0ZXJlZEl0ZXJhdGVkIiwgIml0ZXJhdGVkIiwgIiRzdWIiLCAiYmFzaXMiLCAib2ZPbGQiLCAib2ZOZXciLCAiaXNQYWlyIiwgImJpbmRCeSIsICJ3YXRjaCIsICJwIiwgIk4iLCAiayIsICJkZXJpdmF0ZSIsICJmcm9tIiwgInJlYWN0Rm4iLCAiYmluZEJ5S2V5IiwgImNvbmRpdGlvbmFsSW5kZXgiLCAiY29uZExpc3QiLCAicmVhZENvbmRpdGlvbiIsICJjb25kaXRpb24iLCAiaW52YWxpZGF0ZSIsICJjb25kaXRpb25hbFJlZiIsICJjb25kIiwgImlmVHJ1ZSIsICJpZkZhbHNlIiwgImdldFRydWUiLCAiZ2V0RmFsc2UiLCAidmFsdWVPZiIsICJuIiwgImNvbmRpdGlvbmFsIiwgInJlbWFwIiwgInN1YiIsICJkZXN0IiwgInVuaWZpZWQiLCAic3VicyIsICJpbml0aWFsRW50cmllcyIsICJhc3NpZ25NYXAiLCAiYXNzaWduIiwgImEiLCAiYiIsICJpc0FDb21wdXRlIiwgImlzQkNvbXB1dGUiLCAiY21wQkZuYyIsICJpc0FQcm9wIiwgImFfcHJvcCIsICJpc0JQcm9wIiwgImJfcHJvcCIsICJhX3RtcCIsICJhUmVmIiwgImJfdG1wIiwgImJSZWYiLCAiY21wZngiLCAibnYiLCAic3RvcmUiLCAibGluayIsICJjIiwgIm9sZEFyZyIsICJjbXAiLCAiYXJnIiwgImZvcmNlIiwgIndycEZ1bmMiLCAib2xkQXJnJCIsICJvcCIsICJyZiIsICJwZW5kaW5nSW5pdGlhbCIsICIkYXBwbHkiLCAiY3AiLCAid3JpdGVDb21wdXRlZCIsICJkZWxheWVkU3Vic2NyaWJlIl0KfQo=
