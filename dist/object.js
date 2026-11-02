import { $avoidTrigger as oe, $getValue as He, $triggerLock as xe, Promised as Ue, bindCtx as U, callByAllProp as nt, callByProp as gt, defaultByType as wt, hasValue as W, isArrayInvalidKey as le, isKeyType as j, isNotEqual as A, isPrimitive as T, isPromise as k, makeTriggerLess as be, objectAssign as ae, objectAssignNotEqual as At, potentiallyAsync as Ve, potentiallyAsyncMap as qe, resolved as Re, tryParseByHint as C } from "@fest-lib/core";
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var d = /* @__PURE__ */ Symbol.for("@value"), w = /* @__PURE__ */ Symbol.for("@extract"), D = /* @__PURE__ */ Symbol.for("@origin"), ie = /* @__PURE__ */ Symbol.for("@registry"), q = /* @__PURE__ */ Symbol.for("@behavior"), V = /* @__PURE__ */ Symbol.for("@promise"), lt = /* @__PURE__ */ Symbol.for("@resolved"), Se = /* @__PURE__ */ Symbol.for("@trigger-less"), h = /* @__PURE__ */ Symbol.for("@trigger-lock"), Ot = /* @__PURE__ */ Symbol.for("@trigger-control"), $ = /* @__PURE__ */ Symbol.for("@trigger"), ue = /* @__PURE__ */ Symbol.for("@subscribe"), it = /* @__PURE__ */ Symbol.for("@isNotEqual"), de = /* @__PURE__ */ Symbol.for("@realProp"), Je = /* @__PURE__ */ new WeakMap(), ce = (e) => {
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
function gr(e = [], t = {}) {
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
      const c = [...o, ...f];
      return u(c), c.length;
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
          if (c.includes(v))
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
}, wr = (e) => {
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
    i || (i = /* @__PURE__ */ new Map(), this.#l.set(t, i)), i.set(s, [
      t,
      r,
      n,
      l,
      u
    ]), !this.#u && (this.#u = !0, scheduler?.yield?.()?.then?.(() => {
      this.#u = !1;
      const f = this.#l;
      this.#l = /* @__PURE__ */ new Map();
      for (const [o, c] of f)
        if (!(o != null && this.#i.has(o))) {
          o != null && this.#i.add(o);
          try {
            for (const [, a] of c) {
              const [v, m, b, O, I] = a;
              try {
                this.#s(v, m, b, O, ...I ?? []);
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
    return t ? l.then((u) => {
      const s = Ce(e), i = s?.realProp ?? (s && "value" in s ? "value" : null);
      return S.get(s)?.trigger?.(i, u, void 0, "resolved"), u;
    }) : l;
  });
  return r.all = () => r("all"), r.allSettled = () => r("settled"), r.allKeyed = () => r("all"), r.allSettledKeyed = () => r("settled"), r.try = (n, ...l) => Promise.try(n, ...l).then((u) => Ze(u ?? e, "all")), r;
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
var Wt = /* @__PURE__ */ Symbol.for("object.ts@__safeGetGuard"), Vt = /* @__PURE__ */ Symbol.for("object.ts@reactiveProperties"), ke = globalThis[Vt] ??= /* @__PURE__ */ new WeakMap();
function Le(e, t) {
  let r = ke.get(e);
  r || ke.set(e, r = /* @__PURE__ */ new Set()), r.add(t);
}
function bt(e, t) {
  for (let r = e; r; r = Reflect.getPrototypeOf(r)) if (ke.get(r)?.has(t)) return !0;
  return !1;
}
function et(e, t, r, n, l) {
  const u = S.get(e) ?? S.get(t), s = $e(e, r);
  (y(e, it) ?? A)(n, l) && u?.trigger?.(s, l, n), k(l) && Y(e, s, l, n);
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
var zt = /* @__PURE__ */ new Set([
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
  if (!zt.has(t)) return null;
  const r = y(e, t);
  return typeof r == "function" ? U(e, r) : r;
}, R = globalThis[Wt] ??= /* @__PURE__ */ new WeakMap();
function Ct(e, t) {
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
}, Nt = (e, t, r) => {
  if (e == null) return !1;
  let n = __safeSetGuard?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  return n?.has?.(t) ? !1 : (n?.add?.(t), Reflect.set(e, t, r));
}, y = (e, t, r) => {
  let n;
  if (e == null) return e;
  let l = R?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  if (l?.has?.(t)) return null;
  if (!Ct(e, t)) n ??= Reflect.get(e, t, r ?? e);
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
}, z = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Pe = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && (z(e, "key") || z(e, "name") || z(e, "oldValue") || z(e, "old") || z(e, "op") || z(e, "trigger") || t && z(e, "value")), G = (e, t, r) => z(e, t) ? e[t] : t == "oldValue" && z(e, "old") ? e.old : r(), ge = (e, t = "manual") => se(e.trigger ?? e.op ?? t), Dt = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", ve = (e) => {
  const t = y(e, de) ?? y(e, "realProp");
  return Dt(t) ? t : null;
}, $e = (e, t) => t == "value" ? ve(e) ?? t : t, Bt = (e, t) => {
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
}, Kt = class {
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
}, jt = (e, t, r, n) => {
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
}, Gt = class {
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
    return typeof i == "function" ? new Proxy(typeof i == "function" ? i?.bind?.(e) : i, new Kt(t, e, this)) : i;
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
      return f >= 0 ? c = Reflect.set(e, f, l) : o >= 0 ? c = Reflect.set(e, o, l) : c = Reflect.set(e, t, l), t == "length" && A(u, l) && jt(this, e, u, l), !this[h] && typeof t != "symbol" && (A(u, l) && S?.get?.(e)?.trigger?.(t, l, u, "set"), n && Y(e, t, l, u)), c;
    });
  }
  deleteProperty(e, t) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h)
      return delete this[h], !0;
    const r = y(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != "length" && t != h && typeof t != "symbol" && r != null && S.get(e)?.trigger?.(t, t, r, "delete"), n;
  }
}, Ft = class {
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
    const u = Oe(e, t, n);
    return u ?? (t == Se ? be.call(this, this) : t == $ ? we(n, (s) => {
      const i = $e(e, s.key ?? s.name ?? ve(e) ?? "value"), f = G(s, "oldValue", () => i == "value" || i == ve(e) ? y(e, d) : void 0), o = G(s, "value", () => Bt(e, i));
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
    return Nt(e, t, l), u;
  }
  deleteProperty(e, t) {
    if (t == h)
      return delete this[h], !0;
    y(e, t) == null && t != "value" && W(e) && y(e, "value") != null && (typeof y(e, "value") == "object" || typeof y(e, "value") == "function") && y(y(e, "value"), t) != null && (e = y(e, "value") ?? e);
    const r = y(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != h && typeof t != "symbol" && S.get(e)?.trigger?.(t, null, r, "delete"), n;
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
      "deref"
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? U(e, y(e, t)) : y(e, t);
    const n = S.get(e), l = Ae(e, t, n);
    if (l != null) return l;
    const u = Oe(e, t, n);
    if (u != null) return u;
    e = y(e, w) ?? y(e, D) ?? e;
    const s = U(e, y(e, t));
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
    if (t == "set") return (i, f) => qe(f, (o) => {
      const c = e.has(i), a = e.get(i), v = s(i, o);
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
    ].indexOf(t) >= 0 && y(e, t) != null && y(e, t) != e) return typeof y(e, t) == "function" ? U(e, y(e, t)) : y(e, t);
    const n = S.get(e), l = Ae(e, t, n);
    if (l != null) return l;
    const u = Oe(e, t, n);
    if (u != null) return u;
    e = y(e, w) ?? y(e, D) ?? e;
    const s = U(e, y(e, t));
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
}, L = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[ue])), Te = (e) => {
  if (Array.isArray(e)) {
    const t = e.entries();
    for (const [r, n] of t) Z(e, r);
  } else if (e != null && (typeof e == "object" || typeof e == "function")) {
    const t = Object.entries(e);
    for (const [r, n] of t) Z(e, r);
  }
}, _e = (e) => L(e) ? e : (Te(e), Ne(fe(e, new Gt()), e)), qt = (e) => L(e) ? e : (Te(e), Ne(fe(e, new Ft()), e)), Jt = (e) => L(e) ? e : (Te(e), Ne(fe(e, new Ht()), e)), Qt = (e) => L(e) ? e : (Te(e), fe(e, new Ut())), Xt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [d]: r ? 0 : Number(N(e) || 0) || 0,
    [q]: t,
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
  const l = P(n);
  return e?.then?.((u) => {
    l.value = u, l[$]?.({
      key: "value",
      value: u,
      trigger: "resolved"
    });
  }), l;
}, Yt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = {
    [V]: r ? e : null,
    [d]: (r ? "" : String(N(typeof e == "number" ? String(e) : e || ""))) ?? "",
    [q]: t,
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
  const l = P(n);
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
    [d]: (r ? !1 : (N(e) != null ? typeof N(e) == "string" ? !0 : !!N(e) : !1) || !1) || !1,
    [q]: t,
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
  const l = P(n);
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
    [q]: t,
    [Symbol?.toStringTag]() {
      return String(this.value ?? "") || "";
    },
    [Symbol?.toPrimitive](u) {
      return C(this.value, u);
    },
    value: r ? null : N(e)
  };
  Z(n, "value");
  const l = P(n);
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
}, Lt = (e, t = "value", r, n) => {
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
  if (!u && t != null && W(f) && K(f)) return Ie(rr(f), t);
  if (!l && !u && t && typeof e?.getProperty == "function" && K(e?.getProperty?.(t))) return Ie(e?.getProperty?.(t), t);
  !l && !u ? e[t] ??= r ?? e?.[t] : l && A(r ?? e?.get?.(t), e?.get?.(t)) ? e?.set?.(t, r ?? e?.get?.(t)) : u && e?.has?.(r ?? t) && e?.add?.(r ?? t);
  const o = P({
    [d]: u ? s() : s() ?? r,
    [q]: n,
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
    const O = u ? s() : a, I = o[d];
    o[d] = O, o[$]?.({
      key: "value",
      value: O,
      oldValue: m ?? I,
      trigger: b ?? "set"
    });
  });
  return E(o, Symbol.dispose, c), o;
}, er = (e, t) => {
  switch (typeof e) {
    case "boolean":
      return Zt(e, t);
    case "number":
      return Xt(e, t);
    case "string":
      return Yt(e, t);
    case "object":
      if (e != null) return tt(P(e), t);
    default:
      return tt(e, t);
  }
}, tr = (e, t = "value", r) => {
  const n = K(e) ? e : er(e, r);
  return t != null ? Lt(n, t, r) : n;
}, Or = (e, t) => tr(e, t), De = (e, t, r = 100) => {
  if (e?.value ?? e) return setTimeout(() => {
    e.value && t?.();
  }, r);
}, Tr = (e = 100) => (t, [r], [n]) => {
  let l = De(r, t, e);
  n?.addEventListener?.("abort", () => {
    l && clearTimeout(l);
  }, { once: !0 });
}, xr = (e = 100) => (t, [r], [n]) => {
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
  return Array.isArray(r) ? (n = _e(r), n) : r instanceof Map ? (n = Jt(r), n) : r instanceof Set ? (n = Qt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = qt(r)), n);
}
var K = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[w] || e?.[ue] || S?.has?.(e))), rr = (e) => K(e) ? P(e) : null, Rr = (e) => {
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
}, nr = (e, t) => t != null && t == Ke(e) ? e?.value : e?.[t], We = (e, t, r, n) => {
  if (t != null && t == Ke(e)) {
    const l = nr(e, t);
    if (l != null) return r?.(l, t, null, "set");
  }
  return gt(e, t, r, n);
}, St = (e, t, r) => {
  const n = me(t);
  if (r == pe) {
    if (!n.triggerImmediately) return;
  } else if (!Q(n.affectTypes, r)) return;
  return (l, u, s, ...i) => e?.(l, u, s, r, ...i);
}, lr = (e, t, r, n = ["*"]) => {
  if (!e || !Be(e)) return;
  const l = t != Symbol.iterator ? je(e, t) : null;
  let u = e?.[ie] ?? S.get(e);
  e = e?.[w] ?? e, scheduler?.yield?.()?.then?.(() => {
    const i = St(r, n, pe);
    i && (l != null && l != Symbol.iterator ? We(e, l, i, null) : nt(e, i, null));
  });
  let s = u?.affected?.(r, l, n);
  return e?.[Symbol.dispose] || (E(s, Symbol.dispose, s), E(s, Symbol.asyncDispose, s), E(e, Symbol.dispose, s), E(e, Symbol.asyncDispose, s)), s;
}, ir = (e, t, r, n = ["*"]) => {
  const l = me(n).affectTypes, u = {};
  let s = e?.value;
  const i = (f) => {
    const o = f?.target?.value;
    Q(l, "set") && r?.(o, "value", s, "set", f), s = o;
  };
  return e?.addEventListener?.("change", i, u), () => e?.removeEventListener?.("change", i, u);
}, ne = (e) => Array.isArray(e) && e?.length == 2 && Be(e?.[0]) && (j(e?.[1]) || e?.[1] == Symbol.iterator), ur = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), sr = (e) => e == null ? [] : Array.isArray(e) && !ne(e) && !K(e) ? e : [e], fr = (e) => {
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
}, or = (e, t, r, n, l, u, s) => ({
  source: e,
  target: t,
  value: r,
  prop: n,
  name: n,
  oldValue: l,
  trigger: u,
  args: s
}), cr = (e, t, r, n = ["*"]) => {
  const l = j(e?.[1]) ? e?.[1] : null;
  return g(e?.[0], l, r, n);
}, yr = (e, t, r, n = ["*"]) => e?.then?.((l) => g?.(l, t, r, n))?.catch?.((l) => (console.warn(l), null)), g = (e, t, r = () => {
}, n) => {
  let l = null;
  if (typeof t == "function" ? (n = r, r = t) : l = je(e, t), (typeof r == "object" || Array.isArray(r)) && (n = r, r = () => {
  }), (T(e) || typeof e == "symbol") && me(n).triggerImmediately)
    return Ue(globalThis?.Promise?.try?.(() => r?.(e, null, null, null, pe)));
  if (typeof e?.[ue] == "function") return e?.[ue]?.(r, l, n);
  if (Be(e)) {
    const u = e;
    if (J?.has?.(e = e?.[w] ?? e)) return J?.get?.(e)?.(u, l, r, n);
    if (K(u) || ne(e) && K(e?.[0]))
      return ye(e) ? J?.getOrInsert?.(e, yr)?.(e, l, r, n) : ne(e) ? J?.getOrInsert?.(e, cr)?.(e, l, r, n) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? J?.getOrInsert?.(e, ir)?.(e, l, r, n) : J?.getOrInsert?.(e, lr)?.(u, l, r, n);
    {
      const s = St(r, n, pe);
      return s ? Ue(globalThis?.Promise?.try?.(() => ne(e) ? We?.(e?.[0], e?.[1], s, null) : l != null && l != Symbol.iterator ? We?.(e, l, s, null) : nt?.(e, s, null))) : void 0;
    }
  }
};
function ar(e, t, r) {
  if (e == null || typeof e != "function") return;
  if (ur(t) && r === void 0) return Xe(e, t);
  if (t == null) return Xe(e, r);
  const n = ht(r), l = {
    affectTypes: n.affectTypes,
    triggerImmediately: n.triggerImmediately
  }, u = sr(t).map((s) => {
    const i = fr(s);
    return g(i.target, i.prop, (f, o, c, a, ...v) => e(or(i.source, i.target, f, o, c, a ?? null, v)), l);
  }).filter((s) => typeof s == "function");
  return () => u.forEach((s) => s?.());
}
function Pr(e, t, r) {
  return ar(t, e, r);
}
var Ir = (e) => e instanceof Set ? mt(e) : e instanceof Map ? br(e) : e, dr = class {
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
}, Me = new dr();
function hr(e, t, r = ["*"]) {
  if (!e || typeof e != "object" && typeof e != "function") return;
  if (Me.has([e, t])) return Me.get([e, t]);
  const n = (l, u, s, i) => {
    if (u == "value") {
      const f = (s?.value ?? s)?.entries?.(), o = e?.value ?? l?.value ?? l;
      if (f) for (const [c, a] of f) {
        const v = a ?? (s?.value ?? s)?.[c] ?? null, m = o?.[c];
        v == null && m != null ? t(m, c, null, "add") : v != null && m == null ? t(null, c, v, "delete") : A(v, m) && t(m, c, v, "set");
      }
      return hr(l ?? e?.value, t, r);
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
var vr = (e, t, r) => (g(t, null, (n, l) => {
  ae(e, n, l, !0);
}), r?.(() => e, (n) => {
  for (const l in n) ae(t, n[l], l, !0);
}, { deep: !0 }), e), Mr = (e, t, r) => vr(t(ce(e)), e, r), Er = (e, t, r = () => "") => g(t, null, (n, l) => {
  l == r() && ae(e, n, null, !0);
}), kr = (e = []) => {
  const t = P({ value: 0 }), r = (i) => typeof i == "function" ? i() : W(i) ? i.value : i, l = Sr([t, "value"], () => e.findIndex((i) => !!r(i)), "value"), u = () => {
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
}, pr = (e, t, r, n) => {
  if (T(e)) return e ? t : r;
  const l = () => t, u = () => r, s = (o) => (o != null && (e.value = W(o) ? o?.value : o), (W(e) ? e?.value : e) ? l() : u()), i = P({
    [d]: s(),
    [q]: n,
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
}, $r = pr, _r = (e, t, r) => {
  r || (r = P({}));
  const n = g(e, (l, u, s) => {
    if (u == null) return;
    const i = t?.(l, u, s);
    typeof i == "object" ? At(r, i) : A(r[u], i) && (r[u] = i);
  });
  return r && E(r, Symbol.dispose, n), r;
}, Wr = (...e) => {
  const t = P({});
  return e?.forEach?.((r) => g(r, (n, l, u) => {
    l != null && A(t[l], n) && (t[l] = n);
  })), t;
}, mt = (e) => {
  const t = P([]);
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
}, br = (e) => {
  const t = P([]), r = Array.from(e.entries());
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
    cmpfx: u
  };
  const O = m?.deref?.(), I = v?.deref?.();
  return m instanceof WeakRef && (F?.get?.(O)?.get?.(i)?.bound != I && F?.get?.(O)?.delete?.(i), b = F?.getOrInsert?.(O, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(i, () => ({
    bound: I,
    cmpfx: u,
    unsub: null,
    compute: c,
    dispose: a
  })), b.unsub = g(t, c), b.cmpfx = u, E(O, Symbol.dispose, b?.dispose), E(I, Symbol.dispose, b?.dispose)), I && !Array.isArray(I) && oe(O, () => {
    I[o] ??= O?.[i] ?? I[o];
  }), b?.dispose;
}, Vr = (e, t, r = "value") => {
  const n = [rt(e, t, r), rt(t, e, r)];
  return () => n?.map?.((l) => l?.());
}, Sr = (e, t, r, n = "value") => {
  const l = typeof e?.[1] == "function" && e?.length == 2, u = (j(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let s = u && !l ? e?.[1] : Array.isArray(e) ? null : n;
  if (!u && !l && (e = [u ? e?.[0] : e, s]), l && (e[1] = s), s == null || le(s, e?.[0])) return;
  let i, f;
  const o = (p, M) => {
    if (p ??= e?.[0]?.[s] ?? f ?? p, M || A(f, p) && p != null || i == null) {
      let x = t?.(p, s, f);
      return i = x, x;
    }
    return i;
  }, c = (p, M = "value", x, _) => {
    if (f = x ?? f, p ??= e?.[0]?.[s], A(f, p) && p != null || i == null) {
      let B = t?.(p, s, f, _);
      return f = p, (A(B, i) || i == null) && (b[M] = i = B, i = b[M]), B;
    }
    return b[M];
  }, a = o(e[0][s] ?? f), v = k(a), m = /* @__PURE__ */ Symbol.for("@@apply");
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
  const I = g([e?.[0] ?? e, s ?? "value"], () => {
    O(o(), "manual");
  });
  return E(b, Symbol.dispose, I), b;
}, zr = (e, t, r = 100) => {
  let n;
  return g(e, "value", (l) => {
    !l && n ? (clearTimeout(n), n = null) : l && !n && (n = De(e, t, r) ?? n);
  });
};
export {
  ue as $affected,
  er as $ref,
  lt as $resolved,
  $ as $trigger,
  Ot as $triggerControl,
  Se as $triggerLess,
  h as $triggerLock,
  Pt as AssignObjectHandler,
  dr as DoubleWeakMap,
  E as addToCallChain,
  g as affected,
  rt as assign,
  F as assignMap,
  vr as bindBy,
  Er as bindByKey,
  Zt as booleanRef,
  Sr as computed,
  $r as conditional,
  kr as conditionalIndex,
  pr as conditionalRef,
  Tr as delayedBehavior,
  xr as delayedOrInstantBehavior,
  zr as delayedSubscribe,
  N as deref,
  Mr as derivate,
  ar as effect,
  Pr as effected,
  K as isObservable,
  hr as iterated,
  Vr as link,
  Ir as makeArrayObservable,
  wr as makeObjectAssignable,
  pt as makeResolvedOp,
  Xt as numberRef,
  br as observableByMap,
  mt as observableBySet,
  P as observe,
  Or as promised,
  Lt as propRef,
  rr as recoverReactive,
  tr as ref,
  _r as remap,
  Ze as resolved,
  ce as safe,
  J as specializedSubscribe,
  Yt as stringRef,
  lr as subscribeDirectly,
  ir as subscribeInput,
  cr as subscribePaired,
  yr as subscribeThenable,
  De as triggerWithDelay,
  Ee as unaffected,
  Wr as unified,
  Tt as unwrap,
  Rr as useObservable,
  tt as wrapRef,
  gr as wrapSetAsArray
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vI3JlZ2lvbiBzcmMvd3JhcC9TeW1ib2wudHNcblN5bWJvbC5vYnNlcnZhYmxlIHx8PSBTeW1ib2wuZm9yKFwib2JzZXJ2YWJsZVwiKTtcblN5bWJvbC5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJzdWJzY3JpYmVcIik7XG5TeW1ib2wudW5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJ1bnN1YnNjcmliZVwiKTtcbnZhciAkdmFsdWUgPSBTeW1ib2wuZm9yKFwiQHZhbHVlXCIpO1xudmFyICRleHRyYWN0S2V5JCA9IFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKTtcbnZhciAkb3JpZ2luYWxLZXkkID0gU3ltYm9sLmZvcihcIkBvcmlnaW5cIik7XG52YXIgJHJlZ2lzdHJ5S2V5JCA9IFN5bWJvbC5mb3IoXCJAcmVnaXN0cnlcIik7XG52YXIgJGJlaGF2aW9yID0gU3ltYm9sLmZvcihcIkBiZWhhdmlvclwiKTtcbnZhciAkcHJvbWlzZSA9IFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKTtcbnZhciAkcmVzb2x2ZWQgPSBTeW1ib2wuZm9yKFwiQHJlc29sdmVkXCIpO1xudmFyICR0cmlnZ2VyTGVzcyA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sZXNzXCIpO1xudmFyICR0cmlnZ2VyTG9jayA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sb2NrXCIpO1xudmFyICR0cmlnZ2VyQ29udHJvbCA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpO1xudmFyICR0cmlnZ2VyID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyXCIpO1xudmFyICRhZmZlY3RlZCA9IFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpO1xudmFyICRpc05vdEVxdWFsID0gU3ltYm9sLmZvcihcIkBpc05vdEVxdWFsXCIpO1xudmFyICRyZWFsUHJvcCA9IFN5bWJvbC5mb3IoXCJAcmVhbFByb3BcIik7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy93cmFwL1V0aWxzLnRzXG52YXIgJG9yaWdpbmFsT2JqZWN0cyQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzYWZlID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldCwgbWFwcGVkID0gKGUpID0+IHNhZmUoZSk7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHJldHVybiB1bndyYXA/Lm1hcD8uKG1hcHBlZCkgfHwgQXJyYXkuZnJvbSh1bndyYXAgfHwgW10pPy5tYXA/LihtYXBwZWQpIHx8IFtdO1xuXHRlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXAgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha01hcCkgcmV0dXJuIG5ldyBNYXAoQXJyYXkuZnJvbSh1bndyYXA/LmVudHJpZXM/LigpIHx8IFtdKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrU2V0KSByZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKHVud3JhcD8udmFsdWVzPy4oKSB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkpO1xuXHRlbHNlIGlmICh1bndyYXAgIT0gbnVsbCAmJiB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyh1bndyYXAgfHwge30pIHx8IFtdKT8uZmlsdGVyPy4oKFtLXSkgPT4gSyAhPSAkZXh0cmFjdEtleSQgJiYgSyAhPSAkb3JpZ2luYWxLZXkkICYmIEsgIT0gJHJlZ2lzdHJ5S2V5JCk/Lm1hcD8uKChbSywgVl0pID0+IFtLLCBzYWZlKFYpXSkpO1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciB1bndyYXAgPSAoYXJyKSA9PiB7XG5cdHJldHVybiBhcnI/LlskZXh0cmFjdEtleSRdID8/IGFycj8uW1wiQHRhcmdldFwiXSA/PyBhcnI7XG59O1xudmFyIGRlcmVmID0gKHRhcmdldCwgZGlzY291bnRWYWx1ZSA9IGZhbHNlKSA9PiB7XG5cdGNvbnN0IG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRpZiAoaXNQcmltaXRpdmUodGFyZ2V0KSB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCBcImRlcmVmXCIgaW4gdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQ/LmRlcmVmID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9IHRhcmdldD8uZGVyZWY/LigpO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwgJiYgKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHR0YXJnZXQgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRjb25zdCAkdmFsID0gZGlzY291bnRWYWx1ZSAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHRhcmdldD8udmFsdWU7XG5cdFx0aWYgKCR2YWwgIT0gbnVsbCAmJiAodHlwZW9mICR2YWwgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgJHZhbCA9PSBcImZ1bmN0aW9uXCIpKSB0YXJnZXQgPSAkdmFsO1xuXHRcdGlmIChvcmlnaW5hbCAhPSB0YXJnZXQpIHJldHVybiBkZXJlZih0YXJnZXQsIGRpc2NvdW50VmFsdWUpO1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGlzVGhlbmFibGUgPSAodmFsKSA9PiB2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbnZhciB3aXRoUHJvbWlzZSA9ICh0YXJnZXQsIGNiKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY2I/Lih0YXJnZXQpO1xuXHRpZiAoaXNUaGVuYWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0LnRoZW4oY2IpO1xuXHRpZiAodHlwZW9mIHRhcmdldD8ucmVzb2x2ZWQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRhcmdldC5yZXNvbHZlZCgpKS50aGVuKGNiKTtcblx0aWYgKHRhcmdldD8ucHJvbWlzZSAmJiBpc1RoZW5hYmxlKHRhcmdldC5wcm9taXNlKSkgcmV0dXJuIHRhcmdldC5wcm9taXNlLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5bJHByb21pc2VdICYmIGlzVGhlbmFibGUodGFyZ2V0WyRwcm9taXNlXSkpIHJldHVybiB0YXJnZXRbJHByb21pc2VdLnRoZW4oY2IpO1xuXHRyZXR1cm4gY2I/Lih0YXJnZXQpO1xufTtcbnZhciBkaXNwb3NlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZGlzcG9zZVJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChjYWxsc3RhY2spID0+IHtcblx0Y2FsbHN0YWNrPy5mb3JFYWNoPy4oKGNiKSA9PiBjYj8uKCkpO1xufSk7XG5mdW5jdGlvbiBhZGRUb0NhbGxDaGFpbihvYmosIG1ldGhvZEtleSwgY2FsbGJhY2spIHtcblx0aWYgKCFjYWxsYmFjayB8fCB0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBvYmogIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAobWV0aG9kS2V5ID09IFN5bWJvbC5kaXNwb3NlKSB7XG5cdFx0Y29uc3QgY2hhaW5UYXJnZXQgPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iajtcblx0XHRkaXNwb3NlTWFwPy5nZXRPckluc2VydENvbXB1dGVkPy4oY2hhaW5UYXJnZXQsICgpID0+IHtcblx0XHRcdGNvbnN0IENhbGxDaGFpbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0XHRpZiAodHlwZW9mIGNoYWluVGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNoYWluVGFyZ2V0ID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRkaXNwb3NlUmVnaXN0cnkucmVnaXN0ZXIoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGRpc3Bvc2VNYXAuc2V0KGNoYWluVGFyZ2V0LCBDYWxsQ2hhaW4pO1xuXHRcdFx0XHRjaGFpblRhcmdldFtTeW1ib2wuZGlzcG9zZV0gPz89ICgpID0+IENhbGxDaGFpbi5mb3JFYWNoKChjYikgPT4ge1xuXHRcdFx0XHRcdGNiPy4oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQ2FsbENoYWluO1xuXHRcdH0pPy5hZGQ/LihjYWxsYmFjayk7XG5cdH0gZWxzZSBvYmpbbWV0aG9kS2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IG9iaj8uW21ldGhvZEtleV07XG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbCA9PSBcImZ1bmN0aW9uXCIpIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxudmFyIGlzQXJyYXlJbmRleCA9IChwcm9wKSA9PiB7XG5cdGlmICh0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuXHRpZiAocHJvcCA9PT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBudW0gPSBOdW1iZXIocHJvcCk7XG5cdHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IDAgJiYgU3RyaW5nKG51bSkgPT09IHByb3A7XG59O1xuZnVuY3Rpb24gd3JhcFNldEFzQXJyYXkoc291cmNlID0gW10sIG9wdGlvbnMgPSB7fSkge1xuXHRsZXQgYmFja2luZ1NldCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdGNvbnN0IG5vdGlmeUR1cGxpY2F0ZSA9ICh2YWx1ZSwgdmlhLCBpbmRleCkgPT4ge1xuXHRcdG9wdGlvbnMub25EdXBsaWNhdGU/Lih7XG5cdFx0XHR2YWx1ZSxcblx0XHRcdHZpYSxcblx0XHRcdGluZGV4XG5cdFx0fSk7XG5cdH07XG5cdGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIGJhY2tpbmdTZXQgPSBzb3VyY2U7XG5cdGVsc2UgZm9yIChjb25zdCBpdGVtIG9mIHNvdXJjZSkge1xuXHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fVxuXHRjb25zdCBzbmFwc2hvdCA9ICgpID0+IEFycmF5LmZyb20oYmFja2luZ1NldCk7XG5cdGNvbnN0IHJlYnVpbGRGcm9tID0gKGFycikgPT4ge1xuXHRcdGJhY2tpbmdTZXQuY2xlYXIoKTtcblx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSBiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fTtcblx0Y29uc3QgbWV0aG9kcyA9IHtcblx0XHRwdXNoOiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGxldCBzaXplID0gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInB1c2hcIik7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdFx0XHRcdHNpemUrKztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzaXplO1xuXHRcdH0sXG5cdFx0cG9wOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0aWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdFx0YmFja2luZ1NldC5kZWxldGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2hpZnQ6ICgpID0+IHtcblx0XHRcdGNvbnN0IGl0ZXJhdG9yID0gYmFja2luZ1NldC52YWx1ZXMoKS5uZXh0KCk7XG5cdFx0XHRpZiAoaXRlcmF0b3IuZG9uZSkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmF0b3IudmFsdWU7XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHR1bnNoaWZ0OiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Y29uc3QgY3VycmVudCA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCB0b1ByZXBlbmQgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoY3VycmVudC5pbmNsdWRlcyhpdGVtKSB8fCB0b1ByZXBlbmQuaW5jbHVkZXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJ1bnNoaWZ0XCIsIDApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvUHJlcGVuZC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0b1ByZXBlbmQubGVuZ3RoKSByZXR1cm4gY3VycmVudC5sZW5ndGg7XG5cdFx0XHRjb25zdCBuZXh0ID0gWy4uLnRvUHJlcGVuZCwgLi4uY3VycmVudF07XG5cdFx0XHRyZWJ1aWxkRnJvbShuZXh0KTtcblx0XHRcdHJldHVybiBuZXh0Lmxlbmd0aDtcblx0XHR9LFxuXHRcdHNwbGljZTogKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBub3JtYWxpemVkU3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChzdGFydCwgMCksIGFyci5sZW5ndGgpO1xuXHRcdFx0Y29uc3QgYWN0dWFsRGVsZXRlQ291bnQgPSBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gYXJyLmxlbmd0aCAtIG5vcm1hbGl6ZWRTdGFydCA6IE1hdGgubWF4KDAsIE1hdGgubWluKGRlbGV0ZUNvdW50LCBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0KSk7XG5cdFx0XHRjb25zdCByZW1vdmVkID0gYXJyLnNwbGljZShub3JtYWxpemVkU3RhcnQsIGFjdHVhbERlbGV0ZUNvdW50KTtcblx0XHRcdGxldCBpbnNlcnRQb3NpdGlvbiA9IG5vcm1hbGl6ZWRTdGFydDtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwic3BsaWNlXCIsIGluc2VydFBvc2l0aW9uKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcnIuc3BsaWNlKGluc2VydFBvc2l0aW9uKyssIDAsIGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdHJldHVybiByZW1vdmVkO1xuXHRcdH0sXG5cdFx0aW5jbHVkZXM6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5oYXModmFsdWUpLFxuXHRcdGluZGV4T2Y6ICh2YWx1ZSkgPT4gc25hcHNob3QoKS5pbmRleE9mKHZhbHVlKSxcblx0XHRjbGVhcjogKCkgPT4ge1xuXHRcdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlOiAodmFsdWUpID0+IGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKSxcblx0XHR0b0FycmF5OiAoKSA9PiBzbmFwc2hvdCgpLFxuXHRcdHRvU2V0OiAoKSA9PiBuZXcgU2V0KGJhY2tpbmdTZXQpLFxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBiYWNraW5nU2V0W1N5bWJvbC5pdGVyYXRvcl0oKVxuXHR9O1xuXHRyZXR1cm4gbmV3IFByb3h5KG1ldGhvZHMsIHtcblx0XHRnZXQ6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHJldHVybiBzbmFwc2hvdCgpW051bWJlcihwcm9wKV07XG5cdFx0XHRjb25zdCB2YWx1ZSA9IG1ldGhvZHNbcHJvcF07XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHNldDogKF8sIHByb3AsIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyXCIpO1xuXHRcdFx0XHRjb25zdCBuZXh0TGVuZ3RoID0gTWF0aC5mbG9vcih2YWx1ZSk7XG5cdFx0XHRcdGlmIChuZXh0TGVuZ3RoID49IGJhY2tpbmdTZXQuc2l6ZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCkuc2xpY2UoMCwgbmV4dExlbmd0aCk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID4gYXJyLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IG5leHRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAoaW5kZXggPCBhcnIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFZhbHVlID0gYXJyW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoT2JqZWN0LmlzKGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKGFyci5zb21lKChpdGVtLCBpZHgpID0+IGlkeCAhPT0gaW5kZXggJiYgT2JqZWN0LmlzKGl0ZW0sIG5leHRWYWx1ZSkpKSB7XG5cdFx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUobmV4dFZhbHVlLCBcInNldFwiLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YXJyW2luZGV4XSA9IG5leHRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKG5leHRWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnIucHVzaChuZXh0VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3Quc2V0KG1ldGhvZHMsIHByb3AsIHZhbHVlKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRvd25LZXlzOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gW107XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IF8gb2YgYmFja2luZ1NldCkga2V5cy5wdXNoKFN0cmluZyhpKyspKTtcblx0XHRcdGtleXMucHVzaChcImxlbmd0aFwiKTtcblx0XHRcdHJldHVybiBrZXlzO1xuXHRcdH0sXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0dmFsdWU6IGJhY2tpbmdTZXQuc2l6ZVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHZhbHVlOiBhcnJbaW5kZXhdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRoYXM6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRyZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9wIGluIG1ldGhvZHM7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3dyYXAvQXNzaWduT2JqZWN0LnRzXG52YXIgQXNzaWduT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbmFtZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ/LltuYW1lXSA/PyB0YXJnZXQ7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgY3R4KTtcblx0fVxufTtcbnZhciBtYWtlT2JqZWN0QXNzaWduYWJsZSA9IChvYmopID0+IHtcblx0aWYgKG9iaj8uWyRvcmlnaW5hbEtleSRdIHx8ICRvcmlnaW5hbE9iamVjdHMkLmhhcyhvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCBweCA9IG5ldyBQcm94eShvYmosIG5ldyBBc3NpZ25PYmplY3RIYW5kbGVyKCkpO1xuXHQkb3JpZ2luYWxPYmplY3RzJC5zZXQocHgsIG9iaik7XG5cdHJldHVybiBweDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1N1YnNjcmlwdC50c1xudmFyIHdpdGhVbnN1YlN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd2l0aFVuc3ViXCIpO1xuZ2xvYmFsVGhpc1t3aXRoVW5zdWJTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB3aXRoVW5zdWIgPSBnbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF07XG52YXIgY29tcGxldGVXaXRoVW5zdWIgPSAoc3Vic2NyaWJlciwgd2VhaywgaGFuZGxlcikgPT4ge1xuXHRyZXR1cm4gd2l0aFVuc3ViLmdldE9ySW5zZXJ0KHN1YnNjcmliZXIsICgpID0+IHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHdlYWs/LmRlcmVmPy4oKTtcblx0XHRyZWdpc3RyeT8uYWZmZWN0ZWQ/LihoYW5kbGVyKTtcblx0XHRjb25zdCBzYXZDb21wbGV0ZSA9IHN1YnNjcmliZXI/LmNvbXBsZXRlPy5iaW5kPy4oc3Vic2NyaWJlcik7XG5cdFx0Y29uc3QgdW5hZmZlY3RlZCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHIgPSBzYXZDb21wbGV0ZT8uKCk7XG5cdFx0XHRyZWdpc3RyeT8udW5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fTtcblx0XHRzdWJzY3JpYmVyLmNvbXBsZXRlID0gdW5hZmZlY3RlZDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuZGlzcG9zZV06IHVuYWZmZWN0ZWQsXG5cdFx0XHRbU3ltYm9sLmFzeW5jRGlzcG9zZV06IHVuYWZmZWN0ZWRcblx0XHR9O1xuXHR9KTtcbn07XG52YXIgc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHN1YnNjcmlwdFJlZ2lzdHJ5XCIpO1xuZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHN1YnNjcmlwdFJlZ2lzdHJ5ID0gZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAZ2xvYmFsRWZmZWN0TGlzdGVuZXJzXCIpO1xuZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVycyA9IGdsb2JhbFRoaXNbZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sXTtcbnZhciBlZmZlY3RHbG9iYWxseSA9IChjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Z2xvYmFsRWZmZWN0TGlzdGVuZXJzLnNldChjYiwgbm9ybWFsaXplZC5hZmZlY3RUeXBlcyk7XG5cdHJldHVybiAoKSA9PiBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuZGVsZXRlKGNiKTtcbn07XG52YXIgd3JhcHBlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd3JhcHBlZFwiKTtcbmdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdyYXBwZWQgPSBnbG9iYWxUaGlzW3dyYXBwZWRTeW1ib2xdO1xudmFyIHJlZ2lzdGVyID0gKHdoYXQsIGhhbmRsZSkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0O1xuXHRsZXQgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKTtcblx0aWYgKCFyZWdpc3RyeSkge1xuXHRcdHJlZ2lzdHJ5ID0gbmV3IFN1YnNjcmlwdCh1bndyYXApO1xuXHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LnNldCh1bndyYXAsIHJlZ2lzdHJ5KTtcblx0fSBlbHNlIHJlZ2lzdHJ5LmJpbmRTb3VyY2UodW53cmFwKTtcblx0cmV0dXJuIGhhbmRsZTtcbn07XG52YXIgd3JhcFdpdGggPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdHdoYXQgPSBkZXJlZih3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0KTtcblx0aWYgKHR5cGVvZiB3aGF0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2Ygd2hhdCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB3aGF0ID09IFwiZnVuY3Rpb25cIikgfHwgd2hhdCA9PSBudWxsKSByZXR1cm4gd2hhdDtcblx0cmV0dXJuIHdyYXBwZWQuZ2V0T3JJbnNlcnRDb21wdXRlZCh3aGF0LCAoKSA9PiBuZXcgUHJveHkod2hhdCwgcmVnaXN0ZXIod2hhdCwgaGFuZGxlKSkpO1xufTtcbnZhciBmb3JBbGwgPSBTeW1ib2wuZm9yKFwiQGFsbFByb3BzXCIpO1xudmFyIHdpbGRjYXJkVHJpZ2dlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCIsIFwiYWxsXCJdKTtcbnZhciB0cmlnZ2VyQWxpYXNlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKFtcblx0W1wic2V0XCIsIFtcInNldHRlclwiLCBcIkBzZXRcIl1dLFxuXHRbXCJhZGRcIiwgW1wiQGFkZFwiXV0sXG5cdFtcImRlbGV0ZVwiLCBbXCJAZGVsZXRlXCJdXSxcblx0W1wiaW52YWxpZGF0ZVwiLCBbXCJAaW52YWxpZGF0ZVwiXV0sXG5cdFtcIm1hbnVhbFwiLCBbXCJAbWFudWFsXCJdXSxcblx0W1wiY3VzdG9tXCIsIFtcIkBjdXN0b21cIl1dLFxuXHRbXCJyZXNvbHZlZFwiLCBbXCJAcmVzb2x2ZWRcIl1dLFxuXHRbXCJzZXRBbGxcIiwgW1wiQHNldEFsbFwiXV0sXG5cdFtcImFkZEFsbFwiLCBbXCJAYWRkQWxsXCJdXSxcblx0W1wiZGVsZXRlQWxsXCIsIFtcIkBkZWxldGVBbGxcIiwgXCJAY2xlYXJcIl1dXG5dKTtcbnZhciB0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHRyaWdnZXJDYW5vbmljYWxOYW1lc1wiKTtcbmdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXSA/Pz0gbmV3IE1hcChBcnJheS5mcm9tKHRyaWdnZXJBbGlhc2VzLmVudHJpZXMoKSkuZmxhdE1hcCgoW2Nhbm9uaWNhbCwgYWxpYXNlc10pID0+IGFsaWFzZXMubWFwKChhbGlhcykgPT4gW2FsaWFzLCBjYW5vbmljYWxdKSkpO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lcyA9IGdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXTtcbnZhciBub3JtYWxpemVUcmlnZ2VyTmFtZSA9ICh0cmlnZ2VyID0gXCJzZXRcIikgPT4ge1xuXHRpZiAodHJpZ2dlciA9PSBudWxsKSByZXR1cm4gdHJpZ2dlcjtcblx0Y29uc3QgbmFtZSA9IFN0cmluZyh0cmlnZ2VyIHx8IFwic2V0XCIpO1xuXHRyZXR1cm4gdHJpZ2dlckNhbm9uaWNhbE5hbWVzLmdldChuYW1lKSA/PyBuYW1lO1xufTtcbnZhciB0cmlnZ2VyTmFtZXNPZiA9ICh0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5hbWUgPSB0cmlnZ2VyID09IG51bGwgPyBcImFsbFwiIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IFwiYWxsXCIpO1xuXHRyZXR1cm4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV07XG59O1xudmFyIGV4cGFuZFRyaWdnZXJGaWx0ZXIgPSAodHlwZXMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBuZXcgU2V0KFsuLi5ub3JtYWxpemVUcmlnZ2VyRmlsdGVyKHR5cGVzKV0uZmxhdE1hcCgobmFtZSkgPT4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV0pKTtcbn07XG52YXIgbm9ybWFsaXplVHJpZ2dlckZpbHRlciA9ICh0cmlnZ2VycyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgbGlzdCA9IHR5cGVvZiB0cmlnZ2VycyA9PSBcInN0cmluZ1wiID8gW3RyaWdnZXJzXSA6IEFycmF5LmZyb20odHJpZ2dlcnMgPz8gW1wiKlwiXSk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBuZXcgU2V0KGxpc3QubWFwKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgbmFtZSA9IFN0cmluZyhpdGVtIHx8IFwiKlwiKTtcblx0XHRyZXR1cm4gd2lsZGNhcmRUcmlnZ2Vycy5oYXMobmFtZSkgPyBuYW1lIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG5hbWUpID8/IG5hbWUpO1xuXHR9KSk7XG5cdHJldHVybiBub3JtYWxpemVkLnNpemUgPyBub3JtYWxpemVkIDogLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1wiKlwiXSk7XG59O1xudmFyIHRyaWdnZXJGaWx0ZXJBbGxvd3MgPSAodHJpZ2dlcnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3QgZmlsdGVyID0gdHJpZ2dlcnMgaW5zdGFuY2VvZiBTZXQgPyB0cmlnZ2VycyA6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHJpZ2dlcnMpO1xuXHRyZXR1cm4gWy4uLndpbGRjYXJkVHJpZ2dlcnNdLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpIHx8IHRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpO1xufTtcbnZhciBpc09wdGlvbnNPYmplY3QgPSAob3B0aW9ucykgPT4ge1xuXHRyZXR1cm4gISFvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucykgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlcnNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gb3B0aW9ucyk7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ICE9PSBmYWxzZVxuXHR9O1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyk7XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiB0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcImluaXRpYWxcIilcblx0fTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0T3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ID09PSB0cnVlXG5cdH07XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9O1xufTtcbnZhciBTdWJzY3JpcHRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQFN1YnNjcmlwdFwiKTtcbmdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXSA/Pz0gY2xhc3MgU3Vic2NyaXB0IHtcblx0Y29tcGF0aWJsZTtcblx0I3NvdXJjZTtcblx0I2xpc3RlbmVycztcblx0I2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdCNuYXRpdmU7XG5cdCNpdGVyYXRvcjtcblx0I2luRGlzcGF0Y2ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjZGlzYWJsZWRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCN0cmlnZ2VyQ29udHJvbDtcblx0I3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQjcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy4jbGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHR0aGlzLiNmbGFncyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRcdHRoaXMuI3RyaWdnZXJDb250cm9sID0ge1xuXHRcdFx0ZW5hYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgdHJ1ZSwgY2IpIDogdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIHRydWUpLFxuXHRcdFx0ZGlzYWJsZTogKHR5cGVzID0gW1wiKlwiXSwgY2IpID0+IGNiID8gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIGZhbHNlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgZmFsc2UpLFxuXHRcdFx0c2V0OiAodHlwZXMsIGVuYWJsZWQpID0+IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBlbmFibGVkKSxcblx0XHRcdHdpdGg6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYiksXG5cdFx0XHR3aXRob3V0OiAodHlwZXMsIGNiKSA9PiB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSxcblx0XHRcdGlzRW5hYmxlZDogKHRyaWdnZXIpID0+IHRoaXMuaXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKVxuXHRcdH07XG5cdFx0dGhpcy4jaXRlcmF0b3IgPSB7IG5leHQ6IChhcmdzKSA9PiB7XG5cdFx0XHRpZiAoYXJncykgQXJyYXkuaXNBcnJheShhcmdzKSA/IHRoaXMuI2Rpc3BhdGNoKC4uLmFyZ3MpIDogdGhpcy4jZGlzcGF0Y2goYXJncyk7XG5cdFx0fSB9O1xuXHRcdGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZih0aGlzKTtcblx0XHRjb25zdCBjb250cm9sbGVyID0gZnVuY3Rpb24oc3Vic2NyaWJlcikge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IHN1YnNjcmliZXI/Lm5leHQ/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRcdHJldHVybiBjb21wbGV0ZVdpdGhVbnN1YihzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKTtcblx0XHR9O1xuXHRcdHRoaXMuI25hdGl2ZSA9IHR5cGVvZiBPYnNlcnZhYmxlICE9IFwidW5kZWZpbmVkXCIgPyBuZXcgT2JzZXJ2YWJsZShjb250cm9sbGVyKSA6IG51bGw7XG5cdFx0dGhpcy5jb21wYXRpYmxlID0gKCkgPT4gdGhpcy4jbmF0aXZlO1xuXHR9XG5cdGJpbmRTb3VyY2Uoc291cmNlKSB7XG5cdFx0dGhpcy4jc291cmNlID8/PSBzb3VyY2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0JHNhZmVFeGVjKGNiLCAuLi5hcmdzKSB7XG5cdFx0aWYgKCFjYiB8fCB0aGlzLiNmbGFncy5oYXMoY2IpKSByZXR1cm47XG5cdFx0dGhpcy4jZmxhZ3MuYWRkKGNiKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzID0gY2IoLi4uYXJncyk7XG5cdFx0XHRpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHJlcy5jYXRjaChjb25zb2xlLndhcm4pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy4jZmxhZ3MuZGVsZXRlKGNiKTtcblx0XHR9XG5cdH1cblx0I2Rpc3BhdGNoKG5hbWUsIHZhbHVlID0gbnVsbCwgb2xkVmFsdWUsIHRyaWdnZXIgPSBcImFsbFwiLCAuLi5ldGMpIHtcblx0XHR0cmlnZ2VyID0gbm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gdHJpZ2dlcjtcblx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0aWYgKGxpc3RlbmVycz8uc2l6ZSkge1xuXHRcdFx0Zm9yIChjb25zdCBbY2IsIHJlY29yZF0gb2YgbGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKChyZWNvcmQucHJvcCA9PT0gbmFtZSB8fCByZWNvcmQucHJvcCA9PT0gZm9yQWxsIHx8IHJlY29yZC5wcm9wID09PSBudWxsKSAmJiB0cmlnZ2VyRmlsdGVyQWxsb3dzKHJlY29yZC50cmlnZ2VycywgdHJpZ2dlcikpIHRoaXMuJHNhZmVFeGVjKGNiLCB2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG5cdFx0fVxuXHRcdGlmIChnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2l6ZSkge1xuXHRcdFx0Y29uc3QgZXZlbnQgPSB7XG5cdFx0XHRcdHNvdXJjZTogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR0YXJnZXQ6IHRoaXMuI3NvdXJjZSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdHByb3A6IG5hbWUsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyLFxuXHRcdFx0XHRhcmdzOiBldGNcblx0XHRcdH07XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgdHJpZ2dlcnNdIG9mIGdsb2JhbEVmZmVjdExpc3RlbmVycy5lbnRyaWVzKCkpIGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKHRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIGV2ZW50KTtcblx0XHR9XG5cdH1cblx0d3JhcChudykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG53KSkgcmV0dXJuIHdyYXBXaXRoKG53LCB0aGlzKTtcblx0XHRyZXR1cm4gbnc7XG5cdH1cblx0Z2V0IHRyaWdnZXJDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLiN0cmlnZ2VyQ29udHJvbDtcblx0fVxuXHRpc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpIHtcblx0XHRyZXR1cm4gIXRyaWdnZXJGaWx0ZXJBbGxvd3ModGhpcy4jZGlzYWJsZWRUcmlnZ2VycywgXCJhbGxcIikgJiYgIXRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpKTtcblx0fVxuXHRzZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMgPSBbXCIqXCJdLCBlbmFibGVkID0gdHJ1ZSkge1xuXHRcdGNvbnN0IG5hbWVzID0gZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyk7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSBpZiAoZW5hYmxlZCkgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5kZWxldGUobmFtZSk7XG5cdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0fVxuXHR3aXRoVHJpZ2dlcnModHlwZXMsIGVuYWJsZWQsIGNiKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBbLi4uZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyldO1xuXHRcdGNvbnN0IHByZXZpb3VzID0gbmV3IE1hcChuYW1lcy5tYXAoKG5hbWUpID0+IFtuYW1lLCB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmhhcyhuYW1lKV0pKTtcblx0XHRjb25zdCByZXN0b3JlID0gKCkgPT4ge1xuXHRcdFx0cHJldmlvdXMuZm9yRWFjaCgod2FzRGlzYWJsZWQsIG5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHdhc0Rpc2FibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0XHRcdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0dGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQobmFtZXMsIGVuYWJsZWQpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjYj8uKCk7XG5cdFx0XHRpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQuZmluYWxseSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiByZXN1bHQuZmluYWxseShyZXN0b3JlKTtcblx0XHRcdHJlc3RvcmUoKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YWZmZWN0ZWQoY2IsIHByb3AsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdFx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy4jbGlzdGVuZXJzLnNldChjYiwge1xuXHRcdFx0cHJvcDogcHJvcCB8fCBmb3JBbGwsXG5cdFx0XHR0cmlnZ2Vyczogbm9ybWFsaXplZC5hZmZlY3RUeXBlc1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnVuYWZmZWN0ZWQoY2IsIHByb3AgfHwgZm9yQWxsKTtcblx0fVxuXHR1bmFmZmVjdGVkKGNiLCBwcm9wKSB7XG5cdFx0aWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy4jbGlzdGVuZXJzO1xuXHRcdFx0Y29uc3QgcmVjb3JkID0gbGlzdGVuZXJzPy5nZXQoY2IpO1xuXHRcdFx0aWYgKHJlY29yZCAmJiAocmVjb3JkLnByb3AgPT0gcHJvcCB8fCBwcm9wID09IG51bGwgfHwgcHJvcCA9PSBmb3JBbGwpKSB7XG5cdFx0XHRcdGxpc3RlbmVycy5kZWxldGUoY2IpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gdGhpcy5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwsIHJlY29yZC50cmlnZ2Vycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiNsaXN0ZW5lcnMuY2xlYXIoKTtcblx0fVxuXHR0cmlnZ2VyKG5hbWUsIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwic2V0XCIsIC4uLmV0Yykge1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgcmV0dXJuO1xuXHRcdGlmICh0cmlnZ2VyID09PSB2b2lkIDApIHRyaWdnZXIgPSBcInNldFwiO1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGlmICghdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpKSByZXR1cm47XG5cdFx0Y29uc3Qgb3BLZXkgPSBgJHt0cmlnZ2VyID8/IFwiYWxsXCJ9YDtcblx0XHRsZXQgYnlPcCA9IHRoaXMuI3BlbmRpbmdCeVByb3AuZ2V0KG5hbWUpO1xuXHRcdGlmICghYnlPcCkge1xuXHRcdFx0YnlPcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wLnNldChuYW1lLCBieU9wKTtcblx0XHR9XG5cdFx0YnlPcC5zZXQob3BLZXksIFtcblx0XHRcdG5hbWUsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdGV0Y1xuXHRcdF0pO1xuXHRcdGlmICh0aGlzLiNmbHVzaFNjaGVkdWxlZCkgcmV0dXJuO1xuXHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcblx0XHRzY2hlZHVsZXI/LnlpZWxkPy4oKT8udGhlbj8uKCgpID0+IHtcblx0XHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5cdFx0XHRjb25zdCBiYXRjaCA9IHRoaXMuI3BlbmRpbmdCeVByb3A7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGZvciAoY29uc3QgW3Byb3AsIG9wTWFwXSBvZiBiYXRjaCkge1xuXHRcdFx0XHRpZiAocHJvcCAhPSBudWxsICYmIHRoaXMuI2luRGlzcGF0Y2guaGFzKHByb3ApKSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCkgdGhpcy4jaW5EaXNwYXRjaC5hZGQocHJvcCk7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBbLCBhcmdzXSBvZiBvcE1hcCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgW25tLCB2LCBvdiwgdGcsIHJlc3RdID0gYXJncztcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuI2Rpc3BhdGNoKG5tLCB2LCBvdiwgdGcsIC4uLnJlc3QgPz8gW10pO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdGlmIChwcm9wICE9IG51bGwpIHRoaXMuI2luRGlzcGF0Y2guZGVsZXRlKHByb3ApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0Z2V0IGl0ZXJhdG9yKCkge1xuXHRcdHJldHVybiB0aGlzLiNpdGVyYXRvcjtcblx0fVxufTtcbnZhciBTdWJzY3JpcHQgPSBnbG9iYWxUaGlzW1N1YnNjcmlwdFN5bWJvbF07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1Jlc29sdmVkLnRzXG52YXIgcmF3T2YgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHVud3JhcHBlZCA9IGRlcmVmKHRhcmdldCk7XG5cdHJldHVybiB1bndyYXBwZWQ/LlskZXh0cmFjdEtleSRdID8/IHVud3JhcHBlZDtcbn07XG5mdW5jdGlvbiByZXNvbHZlZCh0YXJnZXQsIG1vZGUgPSBcImFsbFwiKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCk7XG5cdGlmIChpc1Byb21pc2UocmF3KSkgcmV0dXJuIHJlc29sdmVkJDEocmF3LCBtb2RlKTtcblx0aWYgKGlzUHJvbWlzZShyYXc/LlskcHJvbWlzZV0pKSByZXR1cm4gcmVzb2x2ZWQkMShyYXdbJHByb21pc2VdLCBtb2RlKTtcblx0cmV0dXJuIHJlc29sdmVkJDEocmF3ID8/IHRhcmdldCwgbW9kZSk7XG59XG5mdW5jdGlvbiBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQsIGVtaXQgPSBmYWxzZSkge1xuXHRjb25zdCBydW4gPSAoKG1vZGUgPSBcImFsbFwiKSA9PiB7XG5cdFx0Y29uc3QgcGVuZGluZyA9IHJlc29sdmVkKHRhcmdldCwgbW9kZSk7XG5cdFx0aWYgKCFlbWl0KSByZXR1cm4gcGVuZGluZztcblx0XHRyZXR1cm4gcGVuZGluZy50aGVuKCh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KTtcblx0XHRcdGNvbnN0IGtleSA9IHJhdz8ucmVhbFByb3AgPz8gKHJhdyAmJiBcInZhbHVlXCIgaW4gcmF3ID8gXCJ2YWx1ZVwiIDogbnVsbCk7XG5cdFx0XHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIHZvaWQgMCwgXCJyZXNvbHZlZFwiKTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9KTtcblx0fSk7XG5cdHJ1bi5hbGwgPSAoKSA9PiBydW4oXCJhbGxcIik7XG5cdHJ1bi5hbGxTZXR0bGVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLmFsbEtleWVkID0gKCkgPT4gcnVuKFwiYWxsXCIpO1xuXHRydW4uYWxsU2V0dGxlZEtleWVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLnRyeSA9IChjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpID0+IFByb21pc2UudHJ5KGNhbGxiYWNrT3JWYWx1ZSwgLi4uYXJncykudGhlbigodmFsdWUpID0+IHJlc29sdmVkKHZhbHVlID8/IHRhcmdldCwgXCJhbGxcIikpO1xuXHRyZXR1cm4gcnVuO1xufVxuZnVuY3Rpb24gZW1pdFJlc29sdmVkKHRhcmdldCwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpIHtcblx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KSA/PyB0YXJnZXQ7XG5cdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChyYXcpPy50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIFwicmVzb2x2ZWRcIik7XG59XG5mdW5jdGlvbiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMobGl2ZSwgcmF3KSB7XG5cdGlmIChsaXZlID09IG51bGwgfHwgcmF3ID09IG51bGwpIHJldHVybiBsaXZlO1xuXHRpZiAoQXJyYXkuaXNBcnJheShyYXcpKSB7XG5cdFx0cmF3LmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuXHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmVbaW5kZXhdID0gdmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGxpdmU7XG5cdH1cblx0aWYgKHJhdyBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIHJhdy5lbnRyaWVzKCkpIGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlLnNldChrZXksIHZhbHVlKTtcblx0XHRyZXR1cm4gbGl2ZTtcblx0fVxuXHRpZiAocmF3IGluc3RhbmNlb2YgU2V0KSByZXR1cm4gbGl2ZTtcblx0Zm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdC5vd25LZXlzKHJhdykpIHtcblx0XHRpZiAoa2V5ID09ICRleHRyYWN0S2V5JCB8fCBrZXkgPT0gJHByb21pc2UgfHwga2V5ID09ICRyZXNvbHZlZCkgY29udGludWU7XG5cdFx0aWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHJhdywga2V5KT8uZW51bWVyYWJsZSkgY29udGludWU7XG5cdFx0Y29uc3QgdmFsdWUgPSByYXdba2V5XTtcblx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZVtrZXldID0gdmFsdWU7XG5cdH1cblx0cmV0dXJuIGxpdmU7XG59XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1NwZWNpZmljLnRzXG52YXIgX19zYWZlR2V0R3VhcmRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQF9fc2FmZUdldEd1YXJkXCIpO1xudmFyIHJlYWN0aXZlUHJvcGVydGllc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAcmVhY3RpdmVQcm9wZXJ0aWVzXCIpO1xudmFyIHJlYWN0aXZlUHJvcGVydGllcyA9IGdsb2JhbFRoaXNbcmVhY3RpdmVQcm9wZXJ0aWVzU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBtYXJrUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuXHRsZXQga2V5cyA9IHJlYWN0aXZlUHJvcGVydGllcy5nZXQodGFyZ2V0KTtcblx0aWYgKCFrZXlzKSByZWFjdGl2ZVByb3BlcnRpZXMuc2V0KHRhcmdldCwga2V5cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRrZXlzLmFkZChrZXkpO1xufVxuZnVuY3Rpb24gaXNSZWFjdGl2ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XG5cdGZvciAobGV0IGN1cnJlbnQgPSB0YXJnZXQ7IGN1cnJlbnQ7IGN1cnJlbnQgPSBSZWZsZWN0LmdldFByb3RvdHlwZU9mKGN1cnJlbnQpKSBpZiAocmVhY3RpdmVQcm9wZXJ0aWVzLmdldChjdXJyZW50KT8uaGFzKGtleSkpIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBub3RpZnlSZWFjdGl2ZVByb3BlcnR5KHJlY2VpdmVyLCBvd25lciwga2V5LCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcblx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmVjZWl2ZXIpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChvd25lcik7XG5cdGNvbnN0IHRyaWdnZXJOYW1lID0gdHJpZ2dlcktleU9mKHJlY2VpdmVyLCBrZXkpO1xuXHRpZiAoKHNhZmVHZXQocmVjZWl2ZXIsICRpc05vdEVxdWFsKSA/PyBpc05vdEVxdWFsKShvbGRWYWx1ZSwgbmV3VmFsdWUpKSByZWdpc3RyeT8udHJpZ2dlcj8uKHRyaWdnZXJOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuXHRpZiAoaXNQcm9taXNlKG5ld1ZhbHVlKSkgZW1pdFJlc29sdmVkKHJlY2VpdmVyLCB0cmlnZ2VyTmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbn1cbmZ1bmN0aW9uIGRlZmluZVJlYWN0aXZlUHJvcGVydHkodGFyZ2V0LCBrZXksIHZhbHVlKSB7XG5cdGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdGlmICghZGVzY3JpcHRvciB8fCAhZGVzY3JpcHRvci5jb25maWd1cmFibGUpIHJldHVybiBmYWxzZTtcblx0aWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3Iud3JpdGFibGUgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cdGlmIChpc1JlYWN0aXZlUHJvcGVydHkodGFyZ2V0LCBrZXkpKSByZXR1cm4gdHJ1ZTtcblx0aWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3QgaW5pdGlhbFZhbHVlID0gZGVzY3JpcHRvci52YWx1ZTtcblx0XHRjb25zdCB2YWx1ZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0XHR2YWx1ZXMuc2V0KHRhcmdldCwgaW5pdGlhbFZhbHVlKTtcblx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCB7XG5cdFx0XHRlbnVtZXJhYmxlOiBkZXNjcmlwdG9yLmVudW1lcmFibGUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRnZXQoKSB7XG5cdFx0XHRcdHJldHVybiB2YWx1ZXMuaGFzKHRoaXMpID8gdmFsdWVzLmdldCh0aGlzKSA6IGluaXRpYWxWYWx1ZTtcblx0XHRcdH0sXG5cdFx0XHRzZXQobmV4dFZhbHVlKSB7XG5cdFx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdmFsdWVzLmhhcyh0aGlzKSA/IHZhbHVlcy5nZXQodGhpcykgOiBpbml0aWFsVmFsdWU7XG5cdFx0XHRcdHZhbHVlcy5zZXQodGhpcywgbmV4dFZhbHVlKTtcblx0XHRcdFx0bm90aWZ5UmVhY3RpdmVQcm9wZXJ0eSh0aGlzLCB0YXJnZXQsIGtleSwgb2xkVmFsdWUsIG5leHRWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0aWYgKHJlc3VsdCkgbWFya1JlYWN0aXZlUHJvcGVydHkodGFyZ2V0LCBrZXkpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblx0aWYgKCFkZXNjcmlwdG9yLnNldCkgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBsYXN0QXNzaWduZWQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0Y29uc3QgcHJvcGVydHlEZXNjID0ge1xuXHRcdC4uLmRlc2NyaXB0b3IsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSxcblx0XHRzZXQ6IGZ1bmN0aW9uKG5leHRWYWx1ZSkge1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBkZXNjcmlwdG9yLmdldCA/IGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcykgOiBsYXN0QXNzaWduZWQuZ2V0KHRoaXMpO1xuXHRcdFx0ZGVzY3JpcHRvci5zZXQuY2FsbCh0aGlzLCBuZXh0VmFsdWUpO1xuXHRcdFx0Y29uc3QgYWN0dWFsVmFsdWUgPSBkZXNjcmlwdG9yLmdldCA/IGRlc2NyaXB0b3IuZ2V0LmNhbGwodGhpcykgOiBuZXh0VmFsdWU7XG5cdFx0XHRpZiAoIWRlc2NyaXB0b3IuZ2V0KSBsYXN0QXNzaWduZWQuc2V0KHRoaXMsIGFjdHVhbFZhbHVlKTtcblx0XHRcdG5vdGlmeVJlYWN0aXZlUHJvcGVydHkodGhpcywgdGFyZ2V0LCBrZXksIG9sZFZhbHVlLCBhY3R1YWxWYWx1ZSk7XG5cdFx0fVxuXHR9O1xuXHRpZiAoZGVzY3JpcHRvci5nZXQpIHByb3BlcnR5RGVzYy5nZXQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKTtcblx0fTtcblx0aWYgKHZhbHVlICE9PSB2b2lkIDAgJiYgdHlwZW9mIHZhbHVlICE9IFwidW5kZWZpbmVkXCIpIGxhc3RBc3NpZ25lZC5zZXQodGFyZ2V0LCB2YWx1ZSk7XG5cdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHByb3BlcnR5RGVzYyk7XG5cdGlmIChyZXN1bHQpIG1hcmtSZWFjdGl2ZVByb3BlcnR5KHRhcmdldCwga2V5KTtcblx0cmV0dXJuIHJlc3VsdDtcbn1cbnZhciBfX3N5c3RlbVNraXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG5cdFN5bWJvbC50b1N0cmluZ1RhZyxcblx0U3ltYm9sLml0ZXJhdG9yLFxuXHRTeW1ib2wuYXN5bmNJdGVyYXRvcixcblx0U3ltYm9sLnRvUHJpbWl0aXZlLFxuXHRcInRvU3RyaW5nXCIsXG5cdFwidmFsdWVPZlwiLFxuXHRcImluc3BlY3RcIixcblx0XCJjb25zdHJ1Y3RvclwiLFxuXHRcIl9fcHJvdG9fX1wiLFxuXHRcInByb3RvdHlwZVwiLFxuXHRcInRoZW5cIixcblx0XCJjYXRjaFwiLFxuXHRcImZpbmFsbHlcIixcblx0XCJuZXh0XCJcbl0pO1xudmFyIHN5c3RlbVNraXBHZXQgPSAodGFyZ2V0LCBuYW1lKSA9PiB7XG5cdGlmICghX19zeXN0ZW1Ta2lwLmhhcyhuYW1lKSkgcmV0dXJuIG51bGw7XG5cdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0cmV0dXJuIHR5cGVvZiBnb3QgPT09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBnb3QpIDogZ290O1xufTtcbnZhciBfX3NhZmVHZXRHdWFyZCA9IGdsb2JhbFRoaXNbX19zYWZlR2V0R3VhcmRTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIGlzR2V0dGVyKG9iaiwgcHJvcE5hbWUpIHtcblx0bGV0IGdvdCA9IHRydWU7XG5cdHRyeSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4ocHJvcE5hbWUpO1xuXHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4ob2JqKT8uaGFzPy4ocHJvcE5hbWUpKSBnb3QgPSB0cnVlO1xuXHRcdGdvdCA9IHR5cGVvZiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3BOYW1lKT8uZ2V0ID09IFwiZnVuY3Rpb25cIjtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGdvdCA9IHRydWU7XG5cdH0gZmluYWxseSB7XG5cdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/LmRlbGV0ZT8uKHByb3BOYW1lKTtcblx0fVxuXHRyZXR1cm4gZ290O1xufVxudmFyIGZhbGxUaHJvdWdoID0gKG9iaiwga2V5KSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCB2YWx1ZSA9IHNhZmVHZXQob2JqLCBrZXkpO1xuXHRpZiAodmFsdWUgPT0gbnVsbCAmJiBrZXkgIT0gXCJ2YWx1ZVwiKSB7XG5cdFx0Y29uc3QgdG1wID0gc2FmZUdldChvYmosIFwidmFsdWVcIik7XG5cdFx0aWYgKHRtcCAhPSBudWxsICYmICFpc1ByaW1pdGl2ZSh0bXApKSByZXR1cm4gZmFsbFRocm91Z2godG1wLCBrZXkpO1xuXHRcdGVsc2UgcmV0dXJuIHZhbHVlO1xuXHR9IGVsc2UgaWYgKGtleSA9PSBcInZhbHVlXCIgJiYgdmFsdWUgIT0gbnVsbCAmJiAhaXNQcmltaXRpdmUodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxsVGhyb3VnaCh2YWx1ZSwga2V5KSA/PyB2YWx1ZSA/PyBvYmo7XG5cdHJldHVybiB2YWx1ZSA/PyBvYmo7XG59O1xudmFyIHNhZmVTZXQgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XG5cdGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlU2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIGZhbHNlO1xuXHRhY3RpdmU/LmFkZD8uKGtleSk7XG5cdHJldHVybiBSZWZsZWN0LnNldChvYmosIGtleSwgdmFsdWUpO1xufTtcbnZhciBzYWZlR2V0ID0gKG9iaiwga2V5LCByZWMpID0+IHtcblx0bGV0IHJlc3VsdCA9IHZvaWQgMDtcblx0aWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuXHRsZXQgYWN0aXZlID0gX19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4ob2JqLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcblx0aWYgKGFjdGl2ZT8uaGFzPy4oa2V5KSkgcmV0dXJuIG51bGw7XG5cdGlmICghaXNHZXR0ZXIob2JqLCBrZXkpKSByZXN1bHQgPz89IFJlZmxlY3QuZ2V0KG9iaiwga2V5LCByZWMgIT0gbnVsbCA/IHJlYyA6IG9iaik7XG5cdGVsc2Uge1xuXHRcdGFjdGl2ZT8uYWRkPy4oa2V5KTtcblx0XHR0cnkge1xuXHRcdFx0cmVzdWx0ID0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcblx0XHR9IGNhdGNoIChfZSkge1xuXHRcdFx0cmVzdWx0ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRhY3RpdmUuZGVsZXRlKGtleSk7XG5cdFx0XHRpZiAoYWN0aXZlPy5zaXplID09PSAwKSBfX3NhZmVHZXRHdWFyZD8uZGVsZXRlPy4ob2JqKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHR5cGVvZiByZXN1bHQgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eChvYmosIHJlc3VsdCkgOiByZXN1bHQ7XG59O1xudmFyIGhhc093biA9IChvYmosIGtleSkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbnZhciBpc1RyaWdnZXJFbWl0T3B0aW9ucyA9ICh2YWx1ZSwgYWxsb3dWYWx1ZU9ubHkgPSBmYWxzZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKGhhc093bih2YWx1ZSwgXCJrZXlcIikgfHwgaGFzT3duKHZhbHVlLCBcIm5hbWVcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9sZFZhbHVlXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvbGRcIikgfHwgaGFzT3duKHZhbHVlLCBcIm9wXCIpIHx8IGhhc093bih2YWx1ZSwgXCJ0cmlnZ2VyXCIpIHx8IGFsbG93VmFsdWVPbmx5ICYmIGhhc093bih2YWx1ZSwgXCJ2YWx1ZVwiKSk7XG59O1xudmFyIHRyaWdnZXJPcHRpb25WYWx1ZSA9IChvcHRpb25zLCBrZXksIGZhbGxiYWNrKSA9PiB7XG5cdGlmIChoYXNPd24ob3B0aW9ucywga2V5KSkgcmV0dXJuIG9wdGlvbnNba2V5XTtcblx0aWYgKGtleSA9PSBcIm9sZFZhbHVlXCIgJiYgaGFzT3duKG9wdGlvbnMsIFwib2xkXCIpKSByZXR1cm4gb3B0aW9ucy5vbGQ7XG5cdHJldHVybiBmYWxsYmFjaygpO1xufTtcbnZhciB0cmlnZ2VyT3B0aW9uVHJpZ2dlciA9IChvcHRpb25zLCBmYWxsYmFjayA9IFwibWFudWFsXCIpID0+IG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG9wdGlvbnMudHJpZ2dlciA/PyBvcHRpb25zLm9wID8/IGZhbGxiYWNrKTtcbnZhciBpc1J1bnRpbWVLZXkgPSAoa2V5KSA9PiB0eXBlb2Yga2V5ID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGtleSA9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBrZXkgPT0gXCJzeW1ib2xcIjtcbnZhciByZWFsUHJvcE9mJDEgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHByb3AgPSBzYWZlR2V0KHRhcmdldCwgJHJlYWxQcm9wKSA/PyBzYWZlR2V0KHRhcmdldCwgXCJyZWFsUHJvcFwiKTtcblx0cmV0dXJuIGlzUnVudGltZUtleShwcm9wKSA/IHByb3AgOiBudWxsO1xufTtcbnZhciB0cmlnZ2VyS2V5T2YgPSAodGFyZ2V0LCBrZXkpID0+IGtleSA9PSBcInZhbHVlXCIgPyByZWFsUHJvcE9mJDEodGFyZ2V0KSA/PyBrZXkgOiBrZXk7XG52YXIgdHJpZ2dlclZhbHVlT2YgPSAodGFyZ2V0LCBrZXkpID0+IHtcblx0Y29uc3QgcmVhbFByb3AgPSByZWFsUHJvcE9mJDEodGFyZ2V0KTtcblx0aWYgKHJlYWxQcm9wICE9IG51bGwgJiYga2V5ID09IHJlYWxQcm9wKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgPz8gc2FmZUdldCh0YXJnZXQsIGtleSk7XG5cdHJldHVybiBrZXkgPT0gbnVsbCA/IHZvaWQgMCA6IHNhZmVHZXQodGFyZ2V0LCBrZXkpO1xufTtcbnZhciBjcmVhdGVUcmlnZ2VyQVBJID0gKHJlZ2lzdHJ5LCBlbWl0LCB0YXJnZXQpID0+IHtcblx0Y29uc3QgYXBpID0gKGtleSwgb3BPck9wdGlvbnMsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoIWlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zKSkgdHJpZ2dlciA/Pz0gb3BPck9wdGlvbnM7XG5cdFx0cmV0dXJuIGVtaXQoaXNUcmlnZ2VyRW1pdE9wdGlvbnMoa2V5KSA/IGtleSA6IGlzVHJpZ2dlckVtaXRPcHRpb25zKG9wT3JPcHRpb25zLCB0cnVlKSA/IHtcblx0XHRcdGtleSxcblx0XHRcdHRyaWdnZXIsXG5cdFx0XHQuLi5vcE9yT3B0aW9uc1xuXHRcdH0gOiB7XG5cdFx0XHRrZXksXG5cdFx0XHR0cmlnZ2VyOiB0cmlnZ2VyID8/IG9wT3JPcHRpb25zXG5cdFx0fSk7XG5cdH07XG5cdGNvbnN0IGNvbnRyb2wgPSByZWdpc3RyeT8udHJpZ2dlckNvbnRyb2w7XG5cdGlmIChjb250cm9sKSBPYmplY3QuYXNzaWduKGFwaSwgY29udHJvbCk7XG5cdGFwaS5jdXN0b20gPSAodHJpZ2dlciwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpID0+IGFwaSh7XG5cdFx0a2V5LFxuXHRcdHRyaWdnZXIsXG5cdFx0dmFsdWUsXG5cdFx0b2xkVmFsdWVcblx0fSk7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCkgYXBpLnJlc29sdmVkID0gbWFrZVJlc29sdmVkT3AodGFyZ2V0LCB0cnVlKTtcblx0cmV0dXJuIGFwaTtcbn07XG52YXIgc3lzdGVtR2V0ID0gKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpID0+IHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IGlzUHJpbWl0aXZlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGlmICgoW1xuXHRcdFwiZGVyZWZcIixcblx0XHRcImJpbmRcIixcblx0XHRcIkB0YXJnZXRcIixcblx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdCRleHRyYWN0S2V5JCxcblx0XHQkcmVnaXN0cnlLZXkkXG5cdF0uaW5kZXhPZihuYW1lKSA8IDAgPyBzYWZlR2V0KHRhcmdldCwgbmFtZSk/LmJpbmQ/Lih0YXJnZXQpIDogbnVsbCkgIT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdGlmIChbJGV4dHJhY3RLZXkkLCAkb3JpZ2luYWxLZXkkXS5pbmRleE9mKG5hbWUpID49IDApIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdGFyZ2V0O1xuXHRpZiAobmFtZSA9PSAkdmFsdWUpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIik7XG5cdGlmIChuYW1lID09ICRyZWdpc3RyeUtleSQpIHJldHVybiByZWdpc3RyeTtcblx0aWYgKG5hbWUgPT0gJHJlc29sdmVkIHx8IG5hbWUgPT0gXCJyZXNvbHZlZFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBcInJlc29sdmVkXCIpKSByZXR1cm4gbWFrZVJlc29sdmVkT3AodGFyZ2V0KTtcblx0aWYgKG5hbWUgPT0gJHRyaWdnZXJDb250cm9sKSByZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXJDb250cm9sO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wub2JzZXJ2YWJsZSkgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuc3Vic2NyaWJlKSByZXR1cm4gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiBhZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCwgY2IsIG9wdGlvbnMpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdGlmIChuYW1lID09IFN5bWJvbC5hc3luY0l0ZXJhdG9yKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuZGlzcG9zZSkgcmV0dXJuIChwcm9wKSA9PiB7XG5cdFx0c2FmZUdldCh0YXJnZXQsIFN5bWJvbC5kaXNwb3NlKT8uKHByb3ApO1xuXHRcdHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHR9O1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuYXN5bmNEaXNwb3NlKSByZXR1cm4gKHByb3ApID0+IHtcblx0XHRzYWZlR2V0KHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSk/Lihwcm9wKTtcblx0XHR1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0fTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLnVuc3Vic2NyaWJlKSByZXR1cm4gKHByb3ApID0+IHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpO1xuXHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xufTtcbnZhciBvYnNlcnZhYmxlQVBJTWV0aG9kcyA9ICh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KSA9PiB7XG5cdGlmIChuYW1lID09IFwic3Vic2NyaWJlXCIpIHJldHVybiByZWdpc3RyeT8uY29tcGF0aWJsZT8uW25hbWVdID8/ICgoaGFuZGxlcikgPT4ge1xuXHRcdGlmICh0eXBlb2YgaGFuZGxlciA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXIpO1xuXHRcdGVsc2UgaWYgKFwibmV4dFwiIGluIGhhbmRsZXIgJiYgaGFuZGxlcj8ubmV4dCAhPSBudWxsKSB7XG5cdFx0XHRjb25zdCB1c3ViID0gYWZmZWN0ZWQodGFyZ2V0LCBoYW5kbGVyPy5uZXh0KSwgY29tcCA9IGhhbmRsZXI/LltcImNvbXBsZXRlXCJdO1xuXHRcdFx0aGFuZGxlcltcImNvbXBsZXRlXCJdID0gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0dXN1Yj8uKCk7XG5cdFx0XHRcdHJldHVybiBjb21wPy4oLi4uYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGhhbmRsZXJbXCJjb21wbGV0ZVwiXTtcblx0XHR9XG5cdH0pO1xufTtcbnZhciBPYnNlcnZlQXJyYXlNZXRob2QgPSBjbGFzcyB7XG5cdCNuYW1lO1xuXHQjc2VsZjtcblx0I2hhbmRsZTtcblx0Y29uc3RydWN0b3IobmFtZSwgc2VsZiwgaGFuZGxlKSB7XG5cdFx0dGhpcy4jbmFtZSA9IG5hbWU7XG5cdFx0dGhpcy4jc2VsZiA9IHNlbGY7XG5cdFx0dGhpcy4jaGFuZGxlID0gaGFuZGxlO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgcmVjKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdGxldCBhZGRlZCA9IFtdLCByZW1vdmVkID0gW107XG5cdFx0bGV0IHNldFBhaXJzID0gW107XG5cdFx0bGV0IG9sZFN0YXRlID0gWy4uLnRoaXMuI3NlbGZdO1xuXHRcdGxldCBpZHggPSAtMTtcblx0XHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4IHx8IHRoaXMuI3NlbGYsIGFyZ3MpO1xuXHRcdGlmICh0aGlzLiNoYW5kbGU/LlskdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSByZXR1cm4gb2JzZXJ2ZUFycmF5KHJlc3VsdCk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRzd2l0Y2ggKHRoaXMuI25hbWUpIHtcblx0XHRcdGNhc2UgXCJwdXNoXCI6XG5cdFx0XHRcdGlkeCA9IG9sZFN0YXRlPy5sZW5ndGg7XG5cdFx0XHRcdGFkZGVkID0gYXJncztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidW5zaGlmdFwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRhZGRlZCA9IGFyZ3M7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInBvcFwiOlxuXHRcdFx0XHRpZHggPSBvbGRTdGF0ZT8ubGVuZ3RoIC0gMTtcblx0XHRcdFx0aWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbb2xkU3RhdGVbaWR4XV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNoaWZ0XCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGlmIChvbGRTdGF0ZS5sZW5ndGggPiAwKSByZW1vdmVkID0gW29sZFN0YXRlW2lkeF1dO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzcGxpY2VcIjpcblx0XHRcdFx0aWR4ID0gYXJnc1swXTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1heChvbGRTdGF0ZS5sZW5ndGgsIHRoaXMuI3NlbGYubGVuZ3RoKTsgaSsrKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSBvbGRTdGF0ZVtpXTtcblx0XHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IHRoaXMuI3NlbGZbaV07XG5cdFx0XHRcdFx0aWYgKG5ld1ZhbHVlID09PSB2b2lkIDAgJiYgaSA+PSB0aGlzLiNzZWxmLmxlbmd0aCkgcmVtb3ZlZC5wdXNoKG9sZFZhbHVlKTtcblx0XHRcdFx0XHRlbHNlIGlmIChvbGRWYWx1ZSA9PT0gdm9pZCAwICYmIGkgPj0gb2xkU3RhdGUubGVuZ3RoKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdHZvaWQgMCxcblx0XHRcdFx0XHRcdGZhbHNlXG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChvbGRWYWx1ZSwgbmV3VmFsdWUpKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRcdGksXG5cdFx0XHRcdFx0XHRuZXdWYWx1ZSxcblx0XHRcdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNvcnRcIjpcblx0XHRcdGNhc2UgXCJmaWxsXCI6XG5cdFx0XHRjYXNlIFwicmV2ZXJzZVwiOlxuXHRcdFx0Y2FzZSBcImNvcHlXaXRoaW5cIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvbGRTdGF0ZS5sZW5ndGg7IGkrKykgaWYgKGlzTm90RXF1YWwob2xkU3RhdGVbaV0sIHRoaXMuI3NlbGZbaV0pKSBzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRpZHggKyBpLFxuXHRcdFx0XHRcdHRoaXMuI3NlbGZbaV0sXG5cdFx0XHRcdFx0b2xkU3RhdGVbaV0sXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2V0XCI6XG5cdFx0XHRcdGlkeCA9IGFyZ3NbMV07XG5cdFx0XHRcdHNldFBhaXJzLnB1c2goW1xuXHRcdFx0XHRcdGlkeCxcblx0XHRcdFx0XHRhcmdzWzBdLFxuXHRcdFx0XHRcdG9sZFN0YXRlPy5baWR4XSxcblx0XHRcdFx0XHRpZHggaW4gb2xkU3RhdGVcblx0XHRcdFx0XSk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlZyA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0aGlzLiNzZWxmKTtcblx0XHRpZiAoYWRkZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIGFkZGVkWzBdLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZD8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBhZGRlZCwgbnVsbCwgXCJhZGRBbGxcIik7XG5cdFx0XHRhZGRlZC5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWc/LnRyaWdnZXI/LihpZHggKyBJLCBpdGVtLCBudWxsLCBcImFkZFwiKSk7XG5cdFx0fVxuXHRcdGlmIChzZXRQYWlycz8ubGVuZ3RoID09IDEpIHJlZz8udHJpZ2dlcj8uKHNldFBhaXJzWzBdPy5bMF0gPz8gaWR4LCBzZXRQYWlyc1swXT8uWzFdLCBzZXRQYWlyc1swXT8uWzJdLCBzZXRQYWlyc1swXT8uWzNdID09PSBmYWxzZSA/IFwiYWRkXCIgOiBcInNldFwiKTtcblx0XHRlbHNlIGlmIChzZXRQYWlycz8ubGVuZ3RoID4gMSkge1xuXHRcdFx0cmVnPy50cmlnZ2VyPy4oaWR4LCBzZXRQYWlycywgb2xkU3RhdGUsIFwic2V0QWxsXCIpO1xuXHRcdFx0c2V0UGFpcnMuZm9yRWFjaCgocGFpciwgSSkgPT4gcmVnPy50cmlnZ2VyPy4ocGFpcj8uWzBdID8/IGlkeCArIEksIHBhaXI/LlsxXSwgcGFpcj8uWzJdLCBwYWlyPy5bM10gPT09IGZhbHNlID8gXCJhZGRcIiA6IFwic2V0XCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlbW92ZWQ/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihpZHgsIG51bGwsIHJlbW92ZWRbMF0sIFwiZGVsZXRlXCIpO1xuXHRcdGVsc2UgaWYgKHJlbW92ZWQ/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZCwgXCJkZWxldGVBbGxcIik7XG5cdFx0XHRyZW1vdmVkLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZz8udHJpZ2dlcj8uKGlkeCArIEksIG51bGwsIGl0ZW0sIFwiZGVsZXRlXCIpKTtcblx0XHR9XG5cdFx0aWYgKHJlc3VsdCA9PSB0YXJnZXQpIHJldHVybiBuZXcgUHJveHkocmVzdWx0LCB0aGlzLiNoYW5kbGUpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHJldHVybiBvYnNlcnZlQXJyYXkocmVzdWx0KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlID0gKHNlbGYsIHRhcmdldCwgb2xkTGVuLCBuZXdMZW4pID0+IHtcblx0Y29uc3QgcmVtb3ZlZEl0ZW1zID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPCBvbGRMZW4gPyB0YXJnZXQuc2xpY2UobmV3TGVuLCBvbGRMZW4pIDogW107XG5cdGlmICghc2VsZlskdHJpZ2dlckxvY2tdICYmIG9sZExlbiAhPT0gbmV3TGVuKSB7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA9PT0gMSkgcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtc1swXSwgXCJkZWxldGVcIik7XG5cdFx0ZWxzZSBpZiAocmVtb3ZlZEl0ZW1zLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuLCBudWxsLCByZW1vdmVkSXRlbXMsIFwiZGVsZXRlQWxsXCIpO1xuXHRcdFx0cmVtb3ZlZEl0ZW1zLmZvckVhY2goKGl0ZW0sIEkpID0+IHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuICsgSSwgbnVsbCwgaXRlbSwgXCJkZWxldGVcIikpO1xuXHRcdH1cblx0XHRjb25zdCBhZGRlZENvdW50ID0gTnVtYmVyLmlzSW50ZWdlcihvbGRMZW4pICYmIE51bWJlci5pc0ludGVnZXIobmV3TGVuKSAmJiBuZXdMZW4gPiBvbGRMZW4gPyBuZXdMZW4gLSBvbGRMZW4gOiAwO1xuXHRcdGlmIChhZGRlZENvdW50ID09PSAxKSByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgdm9pZCAwLCBudWxsLCBcImFkZFwiKTtcblx0XHRlbHNlIGlmIChhZGRlZENvdW50ID4gMSkge1xuXHRcdFx0Y29uc3QgYWRkZWQgPSBBcnJheShhZGRlZENvdW50KS5maWxsKHZvaWQgMCk7XG5cdFx0XHRyZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgYWRkZWQsIG51bGwsIFwiYWRkQWxsXCIpO1xuXHRcdFx0YWRkZWQuZm9yRWFjaCgoXywgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4gKyBJLCB2b2lkIDAsIG51bGwsIFwiYWRkXCIpKTtcblx0XHR9XG5cdH1cbn07XG52YXIgT2JzZXJ2ZUFycmF5SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0aGFzKHRhcmdldCwgbmFtZSkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuXHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeT8uZ2V0Py4odGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gc2FmZUdldCh0YXJnZXQsIGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiQHRhcmdldFwiIHx8IG5hbWUgPT0gJGV4dHJhY3RLZXkkKSByZXR1cm4gdGFyZ2V0O1xuXHRcdGlmIChuYW1lID09IFwieFwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueCA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwieVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueSA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwielwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8ueiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwid1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8udyA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiclwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uciA/PyB0YXJnZXQ/LlswXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZ1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uZyA/PyB0YXJnZXQ/LlsxXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYlwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYiA/PyB0YXJnZXQ/LlsyXTtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiYVwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0cmV0dXJuIHRhcmdldD8uYSA/PyB0YXJnZXQ/LlszXTtcblx0XHR9O1xuXHRcdGNvbnN0IGdvdCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA/PyAobmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IG51bGwpO1xuXHRcdGlmICh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG5ldyBQcm94eSh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIiA/IGdvdD8uYmluZD8uKHRhcmdldCkgOiBnb3QsIG5ldyBPYnNlcnZlQXJyYXlNZXRob2QobmFtZSwgdGFyZ2V0LCB0aGlzKSk7XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihwYXJzZUludChuYW1lKSkpIG5hbWUgPSBwYXJzZUludChuYW1lKSA/PyBuYW1lO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBwZW5kaW5nID0gaXNQcm9taXNlKHZhbHVlKTtcblx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IG9sZCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IHh5encgPSBbXG5cdFx0XHRcdFwieFwiLFxuXHRcdFx0XHRcInlcIixcblx0XHRcdFx0XCJ6XCIsXG5cdFx0XHRcdFwid1wiXG5cdFx0XHRdO1xuXHRcdFx0Y29uc3QgcmdiYSA9IFtcblx0XHRcdFx0XCJyXCIsXG5cdFx0XHRcdFwiZ1wiLFxuXHRcdFx0XHRcImJcIixcblx0XHRcdFx0XCJhXCJcblx0XHRcdF07XG5cdFx0XHRjb25zdCB4eXp3X2lkeCA9IHh5encuaW5kZXhPZihuYW1lKTtcblx0XHRcdGNvbnN0IHJnYmFfaWR4ID0gcmdiYS5pbmRleE9mKG5hbWUpO1xuXHRcdFx0bGV0IGdvdCA9IGZhbHNlO1xuXHRcdFx0aWYgKHh5endfaWR4ID49IDApIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgeHl6d19pZHgsIHYpO1xuXHRcdFx0ZWxzZSBpZiAocmdiYV9pZHggPj0gMCkgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCByZ2JhX2lkeCwgdik7XG5cdFx0XHRlbHNlIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdik7XG5cdFx0XHRpZiAobmFtZSA9PSBcImxlbmd0aFwiKSB7XG5cdFx0XHRcdGlmIChpc05vdEVxdWFsKG9sZCwgdikpIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlKHRoaXMsIHRhcmdldCwgb2xkLCB2KTtcblx0XHRcdH1cblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2xkLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnk/LmdldD8uKHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCB2LCBvbGQsIFwic2V0XCIpO1xuXHRcdFx0XHRpZiAocGVuZGluZykgZW1pdFJlc29sdmVkKHRhcmdldCwgbmFtZSwgdiwgb2xkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBnb3Q7XG5cdFx0fSk7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcblx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHBhcnNlSW50KG5hbWUpKSkgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBvbGQgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgZ290ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG5hbWUgIT0gXCJsZW5ndGhcIiAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAob2xkICE9IG51bGwpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbmFtZSwgb2xkLCBcImRlbGV0ZVwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxufTtcbnZhciBPYnNlcnZlT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja107XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIixcblx0XHRcdFwidGhlblwiLFxuXHRcdFx0XCJjYXRjaFwiLFxuXHRcdFx0XCJmaW5hbGx5XCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWUgPz8gcmVhbFByb3BPZiQxKHRhcmdldCkgPz8gXCJ2YWx1ZVwiKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4ga2V5ID09IFwidmFsdWVcIiB8fCBrZXkgPT0gcmVhbFByb3BPZiQxKHRhcmdldCkgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IHZvaWQgMCk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRyaWdnZXJWYWx1ZU9mKHRhcmdldCwga2V5KSk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gU3ltYm9sLnRvUHJpbWl0aXZlKSByZXR1cm4gKGhpbnQpID0+IHtcblx0XHRcdGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0XHRcdGlmIChzYWZlR2V0KGZ0LCBuYW1lKSkgcmV0dXJuIHNhZmVHZXQoZnQsIG5hbWUpPy4oaGludCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoZnQsIGhpbnQpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSwgaGludCk7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCwgaGludCk7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBTeW1ib2wudG9TdHJpbmdUYWcpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gU3RyaW5nKGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0cmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInRvU3RyaW5nXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvU3RyaW5nVGFnKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1N0cmluZ1RhZyk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIFN0cmluZyhmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZU9mXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgU3ltYm9sLnRvUHJpbWl0aXZlKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFN5bWJvbC50b1ByaW1pdGl2ZSk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIGZ0O1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKTtcblx0XHRcdHJldHVybiBzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0O1xuXHRcdH07XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRyZXR1cm4gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldD8uW1N5bWJvbC5mb3IoXCJAQGFwcGx5XCIpXT8uYmluZD8uKHRhcmdldD8uW1N5bWJvbC5mb3IoXCJAQGFwcGx5XCIpXSA/PyB0YXJnZXQpID8/IHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuXHRcdGxldCBnb3QgPSB2b2lkIDA7XG5cdFx0dHJ5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG5cdFx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIGdvdCA9IHZvaWQgMDtcblx0XHRcdGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRnb3QgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdHJldHVybiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodiwgbmFtZSk7XG5cdFx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCAkb3JpZ2luYWwgPSB0YXJnZXQ7XG5cdFx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAhKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIG5hbWUgaW4gdGFyZ2V0KSkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdHJpZ2dlck5hbWUgPSB0cmlnZ2VyS2V5T2YodGFyZ2V0LCBuYW1lKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gbmFtZSA9PSBcInZhbHVlXCIgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA/PyBzYWZlR2V0KHRhcmdldCwgbmFtZSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0XHR0YXJnZXRbbmFtZV0gPSB2O1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdjtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9PSBcInN5bWJvbFwiICYmICFpc1JlYWN0aXZlUHJvcGVydHkoJG9yaWdpbmFsLCBuYW1lKSkge1xuXHRcdFx0XHRjb25zdCBzdWJzY3JpcHQgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQoJG9yaWdpbmFsKTtcblx0XHRcdFx0aWYgKChzYWZlR2V0KHRhcmdldCwgJGlzTm90RXF1YWwpID8/IGlzTm90RXF1YWwpPy4ob2xkVmFsdWUsIG5ld1ZhbHVlKSkgc3Vic2NyaXB0Py50cmlnZ2VyPy4odHJpZ2dlck5hbWUsIHYsIG9sZFZhbHVlKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCgkb3JpZ2luYWwsIHRyaWdnZXJOYW1lLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9KTtcblx0fVxuXHRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiBkZXNjcmlwdG9yLnZhbHVlKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIWRlc2NyaXB0b3IudmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICFkZXNjcmlwdG9yLnZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRpZiAoZGVzY3JpcHRvci5nZXQgPT0gdm9pZCAwICYmIGRlc2NyaXB0b3Iuc2V0ID09IHZvaWQgMCkgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKTtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCAkcmVzdWx0ID0gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHtcblx0XHRcdGdldDogZGVzY3JpcHRvci5nZXQsXG5cdFx0XHRzZXQ6IGRlc2NyaXB0b3Iuc2V0LFxuXHRcdFx0ZW51bWVyYWJsZTogZGVzY3JpcHRvci5lbnVtZXJhYmxlID8/IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID8/IHRydWVcblx0XHR9KTtcblx0XHRzYWZlU2V0KHRhcmdldCwgbmFtZSwgb2xkVmFsdWUpO1xuXHRcdHJldHVybiAkcmVzdWx0O1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG5hbWUgIT0gJHRyaWdnZXJMb2NrICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZU1hcEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdO1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGdldCh0YXJnZXQsIG5hbWUsIGN0eCkge1xuXHRcdGlmIChbXG5cdFx0XHQkZXh0cmFjdEtleSQsXG5cdFx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdFx0XCJAdGFyZ2V0XCIsXG5cdFx0XHRcImRlcmVmXCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRjb25zdCByZWdpc3RyeSA9IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpO1xuXHRcdGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG5cdFx0Y29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXHRcdHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCAkZXh0cmFjdEtleSQpID8/IHNhZmVHZXQodGFyZ2V0LCAkb3JpZ2luYWxLZXkkKSA/PyB0YXJnZXQ7XG5cdFx0Y29uc3QgdmFsdWVPckZ4ID0gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSk7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHZhbHVlT3JGeDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlcikgcmV0dXJuIGNyZWF0ZVRyaWdnZXJBUEkocmVnaXN0cnksIChvcHRpb25zKSA9PiB7XG5cdFx0XHRjb25zdCBrZXkgPSBvcHRpb25zLmtleSA/PyBvcHRpb25zLm5hbWU7XG5cdFx0XHRpZiAoa2V5ID09IG51bGwpIHJldHVybjtcblx0XHRcdGNvbnN0IHZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwidmFsdWVcIiwgKCkgPT4gdGFyZ2V0LmdldChrZXkpKTtcblx0XHRcdGlmICh2YWx1ZSA9PSBudWxsICYmICFoYXNPd24ob3B0aW9ucywgXCJ2YWx1ZVwiKSkgcmV0dXJuO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiY2xlYXJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlcyA9IEFycmF5LmZyb20odGFyZ2V0Py5lbnRyaWVzPy4oKSB8fCBbXSksIHJlc3VsdCA9IHZhbHVlT3JGeCgpO1xuXHRcdFx0b2xkVmFsdWVzLmZvckVhY2goKFtwcm9wLCBvbGRWYWx1ZV0pID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4ocHJvcCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJkZWxldGVcIikgcmV0dXJuIChwcm9wLCBfID0gbnVsbCkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyhwcm9wKSwgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCk7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBoYWQpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4ocHJvcCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwic2V0XCIpIHJldHVybiAocHJvcCwgdmFsdWUpID0+IHBvdGVudGlhbGx5QXN5bmNNYXAodmFsdWUsICh2KSA9PiB7XG5cdFx0XHRjb25zdCBoYWQgPSB0YXJnZXQuaGFzKHByb3ApLCBvbGRWYWx1ZSA9IHRhcmdldC5nZXQocHJvcCksIHJlc3VsdCA9IHZhbHVlT3JGeChwcm9wLCB2KTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdGlmICghaGFkIHx8IGlzTm90RXF1YWwob2xkVmFsdWUsIHYpKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIHYsIGhhZCA/IG9sZFZhbHVlIDogbnVsbCwgaGFkID8gXCJzZXRcIiA6IFwiYWRkXCIpO1xuXHRcdFx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgZW1pdFJlc29sdmVkKHRhcmdldCwgcHJvcCwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9KTtcblx0XHRpZiAobmFtZSA9PSBcImdldE9ySW5zZXJ0XCIgfHwgbmFtZSA9PSBcImdldE9ySW5zZXJ0Q29tcHV0ZWRcIikge1xuXHRcdFx0Y29uc3QgY29tcHV0ZWQgPSBuYW1lID09IFwiZ2V0T3JJbnNlcnRDb21wdXRlZFwiO1xuXHRcdFx0cmV0dXJuIChrZXksIGRlZmF1bHRPckNvbXB1dGUpID0+IHtcblx0XHRcdFx0aWYgKHRhcmdldC5oYXMoa2V5KSkgcmV0dXJuIHRhcmdldC5nZXQoa2V5KTtcblx0XHRcdFx0Y29uc3QgaW5jb21pbmcgPSBjb21wdXRlZCA/IHR5cGVvZiBkZWZhdWx0T3JDb21wdXRlID09IFwiZnVuY3Rpb25cIiA/IGRlZmF1bHRPckNvbXB1dGUoa2V5KSA6IGRlZmF1bHRPckNvbXB1dGUgOiBkZWZhdWx0T3JDb21wdXRlO1xuXHRcdFx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luY01hcChpbmNvbWluZywgKHYpID0+IHtcblx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSB0eXBlb2YgdGFyZ2V0LmdldE9ySW5zZXJ0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldC5nZXRPckluc2VydChrZXksIHYpIDogKHRhcmdldC5zZXQoa2V5LCB2KSwgdGFyZ2V0LmdldChrZXkpKTtcblx0XHRcdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRcdFx0c3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihrZXksIHYsIG51bGwsIFwiYWRkXCIpO1xuXHRcdFx0XHRcdFx0aWYgKGlzUHJvbWlzZShpbmNvbWluZykpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIGtleSwgdiwgbnVsbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciBPYnNlcnZlU2V0SGFuZGxlciA9IGNsYXNzIHtcblx0WyR0cmlnZ2VyTG9ja10gPSBmYWxzZTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHR0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgJGV4dHJhY3RLZXkkKSA/PyBzYWZlR2V0KHRhcmdldCwgJG9yaWdpbmFsS2V5JCkgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiB2YWx1ZU9yRng7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lO1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm47XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRhcmdldC5oYXMoa2V5KSk7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IHZvaWQgMCk7XG5cdFx0XHRyZXR1cm4gcmVnaXN0cnk/LnRyaWdnZXI/LihrZXksIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlck9wdGlvblRyaWdnZXIob3B0aW9ucywgXCJtYW51YWxcIikpO1xuXHRcdH0sIHRhcmdldCk7XG5cdFx0aWYgKG5hbWUgPT0gXCJjbGVhclwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWVzID0gQXJyYXkuZnJvbSh0YXJnZXQ/LnZhbHVlcz8uKCkgfHwgW10pLCByZXN1bHQgPSB2YWx1ZU9yRngoKTtcblx0XHRcdG9sZFZhbHVlcy5mb3JFYWNoKChvbGRWYWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihudWxsLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImRlbGV0ZVwiKSByZXR1cm4gKHZhbHVlKSA9PiB7XG5cdFx0XHRjb25zdCBoYWQgPSB0YXJnZXQuaGFzKHZhbHVlKSwgb2xkVmFsdWUgPSBoYWQgPyB2YWx1ZSA6IG51bGwsIHJlc3VsdCA9IHZhbHVlT3JGeCh2YWx1ZSk7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBoYWQpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4odmFsdWUsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImFkZFwiKSByZXR1cm4gKHZhbHVlKSA9PiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2KSwgb2xkVmFsdWUgPSBoYWQgPyB2IDogbnVsbCwgcmVzdWx0ID0gdmFsdWVPckZ4KHYpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0aWYgKCFoYWQpIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4odiwgdiwgb2xkVmFsdWUsIFwiYWRkXCIpO1xuXHRcdFx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgZW1pdFJlc29sdmVkKHRhcmdldCwgdiwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9KTtcblx0XHRyZXR1cm4gdmFsdWVPckZ4O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpO1xuXHR9XG5cdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7XG5cdH1cblx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuXHRcdGxldCBnb3QgPSB2b2lkIDA7XG5cdFx0dHJ5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG5cdFx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIGdvdCA9IHZvaWQgMDtcblx0XHRcdGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRnb3QgPSB2b2lkIDA7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZ290O1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG59O1xudmFyICRpc09ic2VydmFibGUgPSAodGFyZ2V0KSA9PiB7XG5cdHJldHVybiAhISgodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSAmJiB0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSB8fCB0YXJnZXQ/LlskYWZmZWN0ZWRdKSk7XG59O1xudmFyIG1ha2VSZWFjdGl2ZVByb3BlcnRpZXMgPSAob2JqKSA9PiB7XG5cdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRjb25zdCBlbnRyaWVzID0gb2JqLmVudHJpZXMoKTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBlbnRyaWVzKSBkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KG9iaiwga2V5KTtcblx0fSBlbHNlIGlmIChvYmogIT0gbnVsbCAmJiAodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiKSkge1xuXHRcdGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhvYmopO1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGVudHJpZXMpIGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBrZXkpO1xuXHR9XG59O1xudmFyIG9ic2VydmVBcnJheSA9IChhcnIpID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUoYXJyKSkgcmV0dXJuIGFycjtcblx0bWFrZVJlYWN0aXZlUHJvcGVydGllcyhhcnIpO1xuXHRyZXR1cm4gYmluZEV4aXN0aW5nVGhlbmFibGVzKHdyYXBXaXRoKGFyciwgbmV3IE9ic2VydmVBcnJheUhhbmRsZXIoKSksIGFycik7XG59O1xudmFyIG9ic2VydmVPYmplY3QgPSAob2JqKSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKG9iaikpIHJldHVybiBvYmo7XG5cdG1ha2VSZWFjdGl2ZVByb3BlcnRpZXMob2JqKTtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChvYmosIG5ldyBPYnNlcnZlT2JqZWN0SGFuZGxlcigpKSwgb2JqKTtcbn07XG52YXIgb2JzZXJ2ZU1hcCA9IChtYXApID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUobWFwKSkgcmV0dXJuIG1hcDtcblx0bWFrZVJlYWN0aXZlUHJvcGVydGllcyhtYXApO1xuXHRyZXR1cm4gYmluZEV4aXN0aW5nVGhlbmFibGVzKHdyYXBXaXRoKG1hcCwgbmV3IE9ic2VydmVNYXBIYW5kbGVyKCkpLCBtYXApO1xufTtcbnZhciBvYnNlcnZlU2V0ID0gKHNldCkgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShzZXQpKSByZXR1cm4gc2V0O1xuXHRtYWtlUmVhY3RpdmVQcm9wZXJ0aWVzKHNldCk7XG5cdHJldHVybiB3cmFwV2l0aChzZXQsIG5ldyBPYnNlcnZlU2V0SGFuZGxlcigpKTtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1ByaW1pdGl2ZXMudHNcbnZhciBudW1iZXJSZWYgPSAoaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0Y29uc3QgaXNQcm9taXNlID0gaW5pdGlhbCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdHlwZW9mIGluaXRpYWw/LnRoZW4gPT0gXCJmdW5jdGlvblwiO1xuXHRjb25zdCBvYmogPSB7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IGlzUHJvbWlzZSA/IDAgOiBOdW1iZXIoZGVyZWYoaW5pdGlhbCkgfHwgMCkgfHwgMCxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCgodHlwZW9mIHRoaXM/LlskdmFsdWVdICE9IFwib2JqZWN0XCIgPyB0aGlzPy5bJHZhbHVlXSA6IHRoaXM/LlskdmFsdWVdPy52YWx1ZSB8fCAwKSA/PyAwLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSAodiAhPSBudWxsICYmICFOdW1iZXIuaXNOYU4odikgPyBOdW1iZXIodikgOiB0aGlzWyR2YWx1ZV0pIHx8IDA7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gTnVtYmVyKHRoaXNbJHZhbHVlXSB8fCAwKSB8fCAwO1xuXHRcdH1cblx0fTtcblx0ZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIFwidmFsdWVcIik7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZShvYmopO1xuXHRpbml0aWFsPy50aGVuPy4oKHYpID0+IHtcblx0XHQkci52YWx1ZSA9IHY7XG5cdFx0JHJbJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZTogdixcblx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciBzdHJpbmdSZWYgPSAoaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0Y29uc3QgaXNQcm9taXNlID0gaW5pdGlhbCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdHlwZW9mIGluaXRpYWw/LnRoZW4gPT0gXCJmdW5jdGlvblwiO1xuXHRjb25zdCBvYmogPSB7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBcIlwiIDogU3RyaW5nKGRlcmVmKHR5cGVvZiBpbml0aWFsID09IFwibnVtYmVyXCIgPyBTdHJpbmcoaW5pdGlhbCkgOiBpbml0aWFsIHx8IFwiXCIpKSkgPz8gXCJcIixcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiKSA/PyBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzPy5bJHZhbHVlXSA/PyBcIlwiLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSBTdHJpbmcodHlwZW9mIHYgPT0gXCJudW1iZXJcIiA/IFN0cmluZyh2KSA6IHYgfHwgXCJcIikgPz8gXCJcIjtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpc1skdmFsdWVdID8/IFwiXCIpID8/IFwiXCI7XG5cdFx0fVxuXHR9O1xuXHRkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KG9iaiwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKG9iaik7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIGJvb2xlYW5SZWYgPSAoaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0Y29uc3QgaXNQcm9taXNlID0gaW5pdGlhbCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdHlwZW9mIGluaXRpYWw/LnRoZW4gPT0gXCJmdW5jdGlvblwiO1xuXHRjb25zdCBvYmogPSB7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyR2YWx1ZV06IChpc1Byb21pc2UgPyBmYWxzZSA6IChkZXJlZihpbml0aWFsKSAhPSBudWxsID8gdHlwZW9mIGRlcmVmKGluaXRpYWwpID09IFwic3RyaW5nXCIgPyB0cnVlIDogISFkZXJlZihpbml0aWFsKSA6IGZhbHNlKSB8fCBmYWxzZSkgfHwgZmFsc2UsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoISF0aGlzPy5bJHZhbHVlXSB8fCBmYWxzZSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gKHYgIT0gbnVsbCA/IHR5cGVvZiB2ID09IFwic3RyaW5nXCIgPyB0cnVlIDogISF2IDogdGhpc1skdmFsdWVdKSB8fCBmYWxzZTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gfHwgZmFsc2U7XG5cdFx0fVxuXHR9O1xuXHRkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KG9iaiwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgJHIgPSBvYnNlcnZlKG9iaik7XG5cdGluaXRpYWw/LnRoZW4/LigodikgPT4ge1xuXHRcdCRyLnZhbHVlID0gdjtcblx0XHQkclskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIHdyYXBSZWYgPSAoaW5pdGlhbCwgYmVoYXZpb3IpID0+IHtcblx0Y29uc3QgaXNQcm9taXNlID0gaW5pdGlhbCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdHlwZW9mIGluaXRpYWw/LnRoZW4gPT0gXCJmdW5jdGlvblwiO1xuXHRjb25zdCBvYmogPSB7XG5cdFx0WyRwcm9taXNlXTogaXNQcm9taXNlID8gaW5pdGlhbCA6IG51bGwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh0aGlzLnZhbHVlLCBoaW50KTtcblx0XHR9LFxuXHRcdHZhbHVlOiBpc1Byb21pc2UgPyBudWxsIDogZGVyZWYoaW5pdGlhbClcblx0fTtcblx0ZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIFwidmFsdWVcIik7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZShvYmopO1xuXHRpbml0aWFsPy50aGVuPy4oKHYpID0+IHtcblx0XHQkci52YWx1ZSA9IHY7XG5cdFx0JHJbJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZTogdixcblx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdH0pO1xuXHR9KTtcblx0YWZmZWN0ZWQoaW5pdGlhbCwgKHYpID0+IHtcblx0XHQkcj8uWyR0cmlnZ2VyXT8uKCk7XG5cdH0pO1xuXHRyZXR1cm4gJHI7XG59O1xudmFyIG1hcmtSZWFsUHJvcCA9ICh0YXJnZXQsIHJlYWxQcm9wKSA9PiB7XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHRhcmdldCAhPSBcImZ1bmN0aW9uXCIpIHJldHVybiB0YXJnZXQ7XG5cdHRyeSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgJHJlYWxQcm9wLCB7XG5cdFx0XHR2YWx1ZTogcmVhbFByb3AsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHR9IGNhdGNoIHtcblx0XHR0cnkge1xuXHRcdFx0dGFyZ2V0WyRyZWFsUHJvcF0gPSByZWFsUHJvcDtcblx0XHR9IGNhdGNoIHt9XG5cdH1cblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBcInJlYWxQcm9wXCIsIHtcblx0XHRcdHZhbHVlOiByZWFsUHJvcCxcblx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0fSk7XG5cdH0gY2F0Y2gge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXJnZXQucmVhbFByb3AgPSByZWFsUHJvcDtcblx0XHR9IGNhdGNoIHt9XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbn07XG52YXIgcHJvcFJlZiA9IChzcmMsIHNyY1Byb3AgPSBcInZhbHVlXCIsIGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShzcmMpIHx8ICFzcmMpIHJldHVybiBzcmM7XG5cdGlmIChBcnJheS5pc0FycmF5KHNyYykgJiYgc3JjLmxlbmd0aCA9PSAyICYmIHNyY1swXSAhPSBudWxsICYmIChzcmNbMF0gaW5zdGFuY2VvZiBNYXAgfHwgc3JjWzBdIGluc3RhbmNlb2YgV2Vha01hcCB8fCBzcmNbMF0gaW5zdGFuY2VvZiBTZXQgfHwgc3JjWzBdIGluc3RhbmNlb2YgV2Vha1NldCkpIHtcblx0XHRpZiAoc3JjUHJvcCA9PSBudWxsIHx8IHNyY1Byb3AgPT09IFwidmFsdWVcIikgc3JjUHJvcCA9IHNyY1sxXTtcblx0XHRzcmMgPSBzcmNbMF07XG5cdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzcmMpICYmICFpc0FycmF5SW52YWxpZEtleShzcmM/LlsxXSwgc3JjKSAmJiAoQXJyYXkuaXNBcnJheShzcmM/LlswXSkgfHwgdHlwZW9mIHNyYz8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNyYz8uWzBdID09IFwiZnVuY3Rpb25cIikpIHNyYyA9IHNyYz8uWzBdO1xuXHRjb25zdCBpc01hcCA9IHNyYyBpbnN0YW5jZW9mIE1hcCB8fCBzcmMgaW5zdGFuY2VvZiBXZWFrTWFwIHx8IHR5cGVvZiBzcmM/LmdldCA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNyYz8uc2V0ID09IFwiZnVuY3Rpb25cIiAmJiAodHlwZW9mIHNyYz8uZGVsZXRlID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygc3JjPy5yZW1vdmUgPT0gXCJmdW5jdGlvblwiKTtcblx0Y29uc3QgaXNTZXQgPSBzcmMgaW5zdGFuY2VvZiBTZXQgfHwgc3JjIGluc3RhbmNlb2YgV2Vha1NldCB8fCB0eXBlb2Ygc3JjPy5oYXMgPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBzcmM/LmFkZCA9PSBcImZ1bmN0aW9uXCIgJiYgKHR5cGVvZiBzcmM/LmRlbGV0ZSA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHNyYz8ucmVtb3ZlID09IFwiZnVuY3Rpb25cIik7XG5cdGlmIChpc01hcCB8fCBpc1NldCkge1xuXHRcdGlmIChzcmNQcm9wID09IG51bGwpIHJldHVybjtcblx0fSBlbHNlIGlmICgoc3JjUHJvcCA/Pz0gQXJyYXkuaXNBcnJheShzcmMpID8gbnVsbCA6IFwidmFsdWVcIikgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShzcmNQcm9wLCBzcmMpKSByZXR1cm47XG5cdGNvbnN0IHJlYWRTbG90ID0gKCkgPT4ge1xuXHRcdGlmIChpc01hcCkgcmV0dXJuIHNyYz8uZ2V0Py4oc3JjUHJvcCk7XG5cdFx0aWYgKGlzU2V0KSByZXR1cm4gc3JjPy5oYXM/LihzcmNQcm9wKSA/IHNyY1Byb3AgOiBudWxsO1xuXHRcdHJldHVybiBzcmM/LltzcmNQcm9wXTtcblx0fTtcblx0Y29uc3Qgd3JpdGVTbG90ID0gKHYpID0+IHtcblx0XHRpZiAoaXNNYXApIHtcblx0XHRcdGNvbnN0IG1hcCA9IHNyYztcblx0XHRcdGlmIChpc05vdEVxdWFsKHYsIG1hcD8uZ2V0Py4oc3JjUHJvcCkpKSBtYXA/LnNldD8uKHNyY1Byb3AsIHYpO1xuXHRcdFx0cmV0dXJuIHY7XG5cdFx0fVxuXHRcdGlmIChpc1NldCkge1xuXHRcdFx0Y29uc3Qgc2V0ID0gc3JjO1xuXHRcdFx0Y29uc3QgbWVtYmVyID0gdiA/PyBzcmNQcm9wO1xuXHRcdFx0aWYgKG1lbWJlciA9PSBudWxsKSB7XG5cdFx0XHRcdHNldD8uZGVsZXRlPy4oc3JjUHJvcCk7XG5cdFx0XHRcdHJldHVybiBtZW1iZXI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXNldD8uaGFzPy4obWVtYmVyKSkgc2V0Py5hZGQ/LihtZW1iZXIpO1xuXHRcdFx0cmV0dXJuIG1lbWJlcjtcblx0XHR9XG5cdFx0aWYgKGlzTm90RXF1YWwodiwgc3JjPy5bc3JjUHJvcF0pKSBzcmNbc3JjUHJvcF0gPSB2O1xuXHRcdHJldHVybiB2O1xuXHR9O1xuXHRpZiAoaXNNYXAgJiYgaW5pdGlhbCAhPT0gdm9pZCAwICYmICFzcmM/Lmhhcz8uKHNyY1Byb3ApKSBzcmM/LnNldD8uKHNyY1Byb3AsIGluaXRpYWwpO1xuXHRlbHNlIGlmIChpc1NldCAmJiBpbml0aWFsICYmICFzcmM/Lmhhcz8uKHNyY1Byb3ApKSBzcmM/LmFkZD8uKHNyY1Byb3ApO1xuXHRjb25zdCBjdXJyZW50ID0gcmVhZFNsb3QoKTtcblx0aWYgKCFpc1NldCAmJiBzcmNQcm9wICE9IG51bGwgJiYgaGFzVmFsdWUoY3VycmVudCkgJiYgaXNPYnNlcnZhYmxlKGN1cnJlbnQpKSByZXR1cm4gbWFya1JlYWxQcm9wKHJlY292ZXJSZWFjdGl2ZShjdXJyZW50KSwgc3JjUHJvcCk7XG5cdGlmICghaXNNYXAgJiYgIWlzU2V0ICYmIHNyY1Byb3AgJiYgdHlwZW9mIHNyYz8uZ2V0UHJvcGVydHkgPT0gXCJmdW5jdGlvblwiICYmIGlzT2JzZXJ2YWJsZShzcmM/LmdldFByb3BlcnR5Py4oc3JjUHJvcCkpKSByZXR1cm4gbWFya1JlYWxQcm9wKHNyYz8uZ2V0UHJvcGVydHk/LihzcmNQcm9wKSwgc3JjUHJvcCk7XG5cdGlmICghaXNNYXAgJiYgIWlzU2V0KSBzcmNbc3JjUHJvcF0gPz89IGluaXRpYWwgPz8gc3JjPy5bc3JjUHJvcF07XG5cdGVsc2UgaWYgKGlzTWFwICYmIGlzTm90RXF1YWwoaW5pdGlhbCA/PyBzcmM/LmdldD8uKHNyY1Byb3ApLCBzcmM/LmdldD8uKHNyY1Byb3ApKSkgc3JjPy5zZXQ/LihzcmNQcm9wLCBpbml0aWFsID8/IHNyYz8uZ2V0Py4oc3JjUHJvcCkpO1xuXHRlbHNlIGlmIChpc1NldCAmJiBzcmM/Lmhhcz8uKGluaXRpYWwgPz8gc3JjUHJvcCkpIHNyYz8uYWRkPy4oaW5pdGlhbCA/PyBzcmNQcm9wKTtcblx0Y29uc3QgciA9IG9ic2VydmUoe1xuXHRcdFskdmFsdWVdOiBpc1NldCA/IHJlYWRTbG90KCkgOiByZWFkU2xvdCgpID8/IGluaXRpYWwsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcocmVhZFNsb3QoKSA/PyB0aGlzWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQocmVhZFNsb3QoKSwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0clskdHJpZ2dlckxvY2skMV0gPSB0cnVlO1xuXHRcdFx0aWYgKGlzU2V0KSB0aGlzWyR2YWx1ZV0gPSB3cml0ZVNsb3Qodik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc3QgbmV4dCA9IHYgPz8gZGVmYXVsdEJ5VHlwZShyZWFkU2xvdCgpKTtcblx0XHRcdFx0dGhpc1skdmFsdWVdID0gd3JpdGVTbG90KG5leHQpO1xuXHRcdFx0fVxuXHRcdFx0clskdHJpZ2dlckxvY2skMV0gPSBmYWxzZTtcblx0XHR9LFxuXHRcdGdldCB2YWx1ZSgpIHtcblx0XHRcdGNvbnN0IHNsb3QgPSByZWFkU2xvdCgpO1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSA9IHNsb3QgPz8gdGhpc1skdmFsdWVdO1xuXHRcdH1cblx0fSk7XG5cdG1hcmtSZWFsUHJvcChyLCBzcmNQcm9wKTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoc3JjLCAodiwgX3Byb3AsIG9sZCwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChfcHJvcCAhPSBzcmNQcm9wKSByZXR1cm47XG5cdFx0aWYgKHJbJHRyaWdnZXJMb2NrJDFdKSByZXR1cm47XG5cdFx0Y29uc3QgbmV4dCA9IGlzU2V0ID8gcmVhZFNsb3QoKSA6IHY7XG5cdFx0Y29uc3QgcHJldiA9IHJbJHZhbHVlXTtcblx0XHRyWyR2YWx1ZV0gPSBuZXh0O1xuXHRcdHJbJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZTogbmV4dCxcblx0XHRcdG9sZFZhbHVlOiBvbGQgPz8gcHJldixcblx0XHRcdHRyaWdnZXI6IHRyaWdnZXIgPz8gXCJzZXRcIlxuXHRcdH0pO1xuXHR9KTtcblx0YWRkVG9DYWxsQ2hhaW4ociwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiByO1xufTtcbnZhciAkcmVmID0gKHR5cGVkLCBiZWhhdmlvcikgPT4ge1xuXHRzd2l0Y2ggKHR5cGVvZiB0eXBlZCkge1xuXHRcdGNhc2UgXCJib29sZWFuXCI6IHJldHVybiBib29sZWFuUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdFx0Y2FzZSBcIm51bWJlclwiOiByZXR1cm4gbnVtYmVyUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdFx0Y2FzZSBcInN0cmluZ1wiOiByZXR1cm4gc3RyaW5nUmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdFx0Y2FzZSBcIm9iamVjdFwiOiBpZiAodHlwZWQgIT0gbnVsbCkgcmV0dXJuIHdyYXBSZWYob2JzZXJ2ZSh0eXBlZCksIGJlaGF2aW9yKTtcblx0XHRkZWZhdWx0OiByZXR1cm4gd3JhcFJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHR9XG59O1xudmFyIHJlZiA9ICh0eXBlZCwgcHJvcCA9IFwidmFsdWVcIiwgYmVoYXZpb3IpID0+IHtcblx0Y29uc3QgJHIgPSBpc09ic2VydmFibGUodHlwZWQpID8gdHlwZWQgOiAkcmVmKHR5cGVkLCBiZWhhdmlvcik7XG5cdGlmIChwcm9wICE9IG51bGwpIHJldHVybiBwcm9wUmVmKCRyLCBwcm9wLCBiZWhhdmlvcik7XG5cdGVsc2UgcmV0dXJuICRyO1xufTtcbnZhciBwcm9taXNlZCA9IChwcm9taXNlLCBiZWhhdmlvcikgPT4ge1xuXHRyZXR1cm4gcmVmKHByb21pc2UsIGJlaGF2aW9yKTtcbn07XG52YXIgdHJpZ2dlcldpdGhEZWxheSA9IChyZWYsIGNiLCBkZWxheSA9IDEwMCkgPT4ge1xuXHRpZiAocmVmPy52YWx1ZSA/PyByZWYpIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRpZiAocmVmLnZhbHVlKSBjYj8uKCk7XG5cdH0sIGRlbGF5KTtcbn07XG52YXIgZGVsYXllZEJlaGF2aW9yID0gKGRlbGF5ID0gMTAwKSA9PiB7XG5cdHJldHVybiAoY2IsIFt2YWxdLCBbc2lnXSkgPT4ge1xuXHRcdGxldCB0bSA9IHRyaWdnZXJXaXRoRGVsYXkodmFsLCBjYiwgZGVsYXkpO1xuXHRcdHNpZz8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwiYWJvcnRcIiwgKCkgPT4ge1xuXHRcdFx0aWYgKHRtKSBjbGVhclRpbWVvdXQodG0pO1xuXHRcdH0sIHsgb25jZTogdHJ1ZSB9KTtcblx0fTtcbn07XG52YXIgZGVsYXllZE9ySW5zdGFudEJlaGF2aW9yID0gKGRlbGF5ID0gMTAwKSA9PiB7XG5cdHJldHVybiAoY2IsIFt2YWxdLCBbc2lnXSkgPT4ge1xuXHRcdGxldCB0bSA9IHRyaWdnZXJXaXRoRGVsYXkodmFsLCBjYiwgZGVsYXkpO1xuXHRcdHNpZz8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwiYWJvcnRcIiwgKCkgPT4ge1xuXHRcdFx0aWYgKHRtKSBjbGVhclRpbWVvdXQodG0pO1xuXHRcdH0sIHsgb25jZTogdHJ1ZSB9KTtcblx0XHRpZiAoIXRtKSBjYj8uKCk7XG5cdH07XG59O1xuZnVuY3Rpb24gb2JzZXJ2ZSh0YXJnZXQsIHN0YXRlTmFtZSkge1xuXHRpZiAodGFyZ2V0ID09IG51bGwgfHwgdHlwZW9mIHRhcmdldCA9PSBcInN5bWJvbFwiIHx8ICEodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSB8fCAkaXNPYnNlcnZhYmxlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGlmICgodGFyZ2V0ID0gZGVyZWY/Lih0YXJnZXQpKSA9PSBudWxsIHx8IHRhcmdldCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCAkaXNPYnNlcnZhYmxlKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdGNvbnN0IHVud3JhcCA9IHRhcmdldDtcblx0aWYgKHVud3JhcCA9PSBudWxsIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJzeW1ib2xcIiB8fCAhKHR5cGVvZiB1bndyYXAgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIikgfHwgdW53cmFwIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrUmVmKSByZXR1cm4gdW53cmFwO1xuXHRsZXQgcmVhY3RpdmUgPSB1bndyYXA7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVBcnJheSh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVNYXAodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodW53cmFwIGluc3RhbmNlb2YgU2V0KSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlU2V0KHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiB1bndyYXAgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiB1bndyYXAgPT0gXCJvYmplY3RcIikge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZU9iamVjdCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fVxuXHRyZXR1cm4gcmVhY3RpdmU7XG59XG52YXIgaXNPYnNlcnZhYmxlID0gKHRhcmdldCkgPT4ge1xuXHRpZiAodHlwZW9mIEhUTUxJbnB1dEVsZW1lbnQgIT0gXCJ1bmRlZmluZWRcIiAmJiB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSByZXR1cm4gdHJ1ZTtcblx0cmV0dXJuICEhKCh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpICYmIHRhcmdldCAhPSBudWxsICYmICh0YXJnZXQ/LlskZXh0cmFjdEtleSRdIHx8IHRhcmdldD8uWyRhZmZlY3RlZF0gfHwgc3Vic2NyaXB0UmVnaXN0cnk/Lmhhcz8uKHRhcmdldCkpKTtcbn07XG52YXIgcmVjb3ZlclJlYWN0aXZlID0gKHRhcmdldCkgPT4ge1xuXHRyZXR1cm4gaXNPYnNlcnZhYmxlKHRhcmdldCkgPyBvYnNlcnZlKHRhcmdldCkgOiBudWxsO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvTWFpbmxpbmUudHNcbnZhciB1c2VPYnNlcnZhYmxlID0gKHVud3JhcCkgPT4ge1xuXHRpZiAodW53cmFwID09IG51bGwgfHwgdHlwZW9mIHVud3JhcCAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiB1bndyYXAgIT0gXCJmdW5jdGlvblwiIHx8IHVud3JhcD8uW1N5bWJvbC5vYnNlcnZhYmxlXSAhPSBudWxsKSByZXR1cm4gdW53cmFwO1xuXHR0cnkge1xuXHRcdHVud3JhcFtTeW1ib2wub2JzZXJ2YWJsZV0gPSBzZWxmPy5jb21wYXRpYmxlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS53YXJuKFwiVW5hYmxlIHRvIGFzc2lnbiA8W1N5bWJvbC5vYnNlcnZhYmxlXT4sIG9iamVjdCB3aWxsIG5vdCBvYnNlcnZhYmxlIGJ5IG90aGVyIGZyYW1ld29ya3NcIik7XG5cdH1cblx0dW53cmFwWyRhZmZlY3RlZF0gPSAoY2IsIHByb3AsIG9wdGlvbnMpID0+IHtcblx0XHRjb25zdCBvYnNlcnZhYmxlID0gdW53cmFwPy5bU3ltYm9sPy5vYnNlcnZhYmxlXTtcblx0XHRvYnNlcnZhYmxlPy4oKT8uYWZmZWN0ZWQ/LihjYiwgcHJvcCwgb3B0aW9ucyk7XG5cdFx0cmV0dXJuICgpID0+IG9ic2VydmFibGU/LigpPy51bmFmZmVjdGVkPy4oY2IsIHByb3ApO1xuXHR9O1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciBzcGVjaWFsaXplZFN1YnNjcmliZSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGNoZWNrVmFsaWRPYmogPSAob2JqKSA9PiB7XG5cdGlmICh0eXBlb2Ygb2JqID09IFwic3ltYm9sXCIgfHwgb2JqID09IG51bGwgfHwgISh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIG9iaiA9PSBcImZ1bmN0aW9uXCIpKSByZXR1cm47XG5cdHJldHVybiBvYmo7XG59O1xudmFyIGluaXRpYWxUcmlnZ2VyID0gXCJpbml0aWFsXCI7XG52YXIgcmVhbFByb3BPZiA9ICh0YXJnZXQpID0+IHtcblx0Y29uc3QgcHJvcCA9IHRhcmdldD8uWyRyZWFsUHJvcF0gPz8gdGFyZ2V0Py5yZWFsUHJvcDtcblx0cmV0dXJuIGlzS2V5VHlwZShwcm9wKSA/IHByb3AgOiBudWxsO1xufTtcbnZhciBub3JtYWxpemVBZmZlY3RlZFByb3AgPSAodGFyZ2V0LCBwcm9wKSA9PiB7XG5cdGNvbnN0IHJlYWxQcm9wID0gcmVhbFByb3BPZih0YXJnZXQpO1xuXHRpZiAocmVhbFByb3AgIT0gbnVsbCAmJiAocHJvcCA9PSBudWxsIHx8IHByb3AgPT0gXCJ2YWx1ZVwiKSkgcmV0dXJuIHJlYWxQcm9wO1xuXHRyZXR1cm4gcHJvcDtcbn07XG52YXIgcHJvcFZhbHVlT2YgPSAodGFyZ2V0LCBwcm9wKSA9PiB7XG5cdGlmIChwcm9wICE9IG51bGwgJiYgcHJvcCA9PSByZWFsUHJvcE9mKHRhcmdldCkpIHJldHVybiB0YXJnZXQ/LnZhbHVlO1xuXHRyZXR1cm4gdGFyZ2V0Py5bcHJvcF07XG59O1xudmFyIGNhbGxCeVByb3BSZWZBd2FyZSA9ICh0YXJnZXQsIHByb3AsIGNiLCBjdHgpID0+IHtcblx0aWYgKHByb3AgIT0gbnVsbCAmJiBwcm9wID09IHJlYWxQcm9wT2YodGFyZ2V0KSkge1xuXHRcdGNvbnN0IHZhbHVlID0gcHJvcFZhbHVlT2YodGFyZ2V0LCBwcm9wKTtcblx0XHRpZiAodmFsdWUgIT0gbnVsbCkgcmV0dXJuIGNiPy4odmFsdWUsIHByb3AsIG51bGwsIFwic2V0XCIpO1xuXHR9XG5cdHJldHVybiBjYWxsQnlQcm9wKHRhcmdldCwgcHJvcCwgY2IsIGN0eCk7XG59O1xudmFyIHdpdGhUcmlnZ2VyID0gKGNiLCBvcHRpb25zLCB0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdGlmICh0cmlnZ2VyID09IGluaXRpYWxUcmlnZ2VyKSB7XG5cdFx0aWYgKCFub3JtYWxpemVkLnRyaWdnZXJJbW1lZGlhdGVseSkgcmV0dXJuO1xuXHR9IGVsc2UgaWYgKCF0cmlnZ2VyRmlsdGVyQWxsb3dzKG5vcm1hbGl6ZWQuYWZmZWN0VHlwZXMsIHRyaWdnZXIpKSByZXR1cm47XG5cdHJldHVybiAodmFsdWUsIG5hbWUsIG9sZFZhbHVlLCAuLi5ldGMpID0+IGNiPy4odmFsdWUsIG5hbWUsIG9sZFZhbHVlLCB0cmlnZ2VyLCAuLi5ldGMpO1xufTtcbnZhciBzdWJzY3JpYmVEaXJlY3RseSA9ICh0YXJnZXQsIHByb3AsIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoIXRhcmdldCkgcmV0dXJuO1xuXHRpZiAoIWNoZWNrVmFsaWRPYmoodGFyZ2V0KSkgcmV0dXJuO1xuXHRjb25zdCB0UHJvcCA9IHByb3AgIT0gU3ltYm9sLml0ZXJhdG9yID8gbm9ybWFsaXplQWZmZWN0ZWRQcm9wKHRhcmdldCwgcHJvcCkgOiBudWxsO1xuXHRsZXQgcmVnaXN0cnkgPSB0YXJnZXQ/LlskcmVnaXN0cnlLZXkkXSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0dGFyZ2V0ID0gdGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSA/PyB0YXJnZXQ7XG5cdHNjaGVkdWxlcj8ueWllbGQ/LigpPy50aGVuPy4oKCkgPT4ge1xuXHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0aWYgKCFpbml0aWFsQ2IpIHJldHVybjtcblx0XHRpZiAodFByb3AgIT0gbnVsbCAmJiB0UHJvcCAhPSBTeW1ib2wuaXRlcmF0b3IpIGNhbGxCeVByb3BSZWZBd2FyZSh0YXJnZXQsIHRQcm9wLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdGVsc2UgY2FsbEJ5QWxsUHJvcCh0YXJnZXQsIGluaXRpYWxDYiwgbnVsbCk7XG5cdH0pO1xuXHRsZXQgdW5TdWIgPSByZWdpc3RyeT8uYWZmZWN0ZWQ/LihjYiwgdFByb3AsIG9wdGlvbnMpO1xuXHRpZiAodGFyZ2V0Py5bU3ltYm9sLmRpc3Bvc2VdKSByZXR1cm4gdW5TdWI7XG5cdGFkZFRvQ2FsbENoYWluKHVuU3ViLCBTeW1ib2wuZGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih1blN1YiwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih0YXJnZXQsIFN5bWJvbC5kaXNwb3NlLCB1blN1Yik7XG5cdGFkZFRvQ2FsbENoYWluKHRhcmdldCwgU3ltYm9sLmFzeW5jRGlzcG9zZSwgdW5TdWIpO1xuXHRyZXR1cm4gdW5TdWI7XG59O1xudmFyIHN1YnNjcmliZUlucHV0ID0gKHRnLCBfLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgYWZmZWN0VHlwZXMgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucykuYWZmZWN0VHlwZXM7XG5cdGNvbnN0ICRvcHQgPSB7fTtcblx0bGV0IG9sZFZhbHVlID0gdGc/LnZhbHVlO1xuXHRjb25zdCAkY2IgPSAoZXYpID0+IHtcblx0XHRjb25zdCB2YWx1ZSA9IGV2Py50YXJnZXQ/LnZhbHVlO1xuXHRcdGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcInNldFwiKSkgY2I/Lih2YWx1ZSwgXCJ2YWx1ZVwiLCBvbGRWYWx1ZSwgXCJzZXRcIiwgZXYpO1xuXHRcdG9sZFZhbHVlID0gdmFsdWU7XG5cdH07XG5cdHRnPy5hZGRFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcblx0cmV0dXJuICgpID0+IHRnPy5yZW1vdmVFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgJGNiLCAkb3B0KTtcbn07XG52YXIgY2hlY2tJc1BhaXJlZCA9ICh0ZykgPT4ge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh0ZykgJiYgdGc/Lmxlbmd0aCA9PSAyICYmIGNoZWNrVmFsaWRPYmoodGc/LlswXSkgJiYgKGlzS2V5VHlwZSh0Zz8uWzFdKSB8fCB0Zz8uWzFdID09IFN5bWJvbC5pdGVyYXRvcik7XG59O1xudmFyIGlzRWZmZWN0T3B0aW9uc0FyZyA9ICh2YWx1ZSkgPT4ge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiB2YWx1ZSB8fCBcInRyaWdnZXJzXCIgaW4gdmFsdWUgfHwgXCJ0cmlnZ2VySW1tZWRpYXRlbHlcIiBpbiB2YWx1ZSk7XG59O1xudmFyIG5vcm1hbGl6ZUVmZmVjdFRhcmdldHMgPSAodGFyZ2V0cykgPT4ge1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gW107XG5cdGlmIChBcnJheS5pc0FycmF5KHRhcmdldHMpICYmICFjaGVja0lzUGFpcmVkKHRhcmdldHMpICYmICFpc09ic2VydmFibGUodGFyZ2V0cykpIHJldHVybiB0YXJnZXRzO1xuXHRyZXR1cm4gW3RhcmdldHNdO1xufTtcbnZhciBlZmZlY3RUYXJnZXRDb250ZXh0ID0gKHNvdXJjZSkgPT4ge1xuXHRpZiAoY2hlY2tJc1BhaXJlZChzb3VyY2UpKSB7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gc291cmNlPy5bMF07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNvdXJjZSxcblx0XHRcdHRhcmdldCxcblx0XHRcdHByb3A6IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCh0YXJnZXQsIHNvdXJjZT8uWzFdKVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHtcblx0XHRzb3VyY2UsXG5cdFx0dGFyZ2V0OiBzb3VyY2UsXG5cdFx0cHJvcDogbnVsbFxuXHR9O1xufTtcbnZhciB0b0VmZmVjdEV2ZW50ID0gKHNvdXJjZSwgdGFyZ2V0LCB2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIGFyZ3MpID0+ICh7XG5cdHNvdXJjZSxcblx0dGFyZ2V0LFxuXHR2YWx1ZSxcblx0cHJvcCxcblx0bmFtZTogcHJvcCxcblx0b2xkVmFsdWUsXG5cdHRyaWdnZXIsXG5cdGFyZ3Ncbn0pO1xudmFyIHN1YnNjcmliZVBhaXJlZCA9ICh0ZywgXywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IHByb3AgPSBpc0tleVR5cGUodGc/LlsxXSkgPyB0Zz8uWzFdIDogbnVsbDtcblx0cmV0dXJuIGFmZmVjdGVkKHRnPy5bMF0sIHByb3AsIGNiLCBvcHRpb25zKTtcbn07XG52YXIgc3Vic2NyaWJlVGhlbmFibGUgPSAob2JqLCBwcm9wLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0cmV0dXJuIG9iaj8udGhlbj8uKChvYmopID0+IGFmZmVjdGVkPy4ob2JqLCBwcm9wLCBjYiwgb3B0aW9ucykpPy5jYXRjaD8uKChlKSA9PiB7XG5cdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9KTtcbn07XG52YXIgYWZmZWN0ZWQgPSAob2JqLCBwcm9wLCBjYiA9ICgpID0+IHt9LCBvcHRpb25zKSA9PiB7XG5cdGxldCBrZXkgPSBudWxsO1xuXHRpZiAodHlwZW9mIHByb3AgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0b3B0aW9ucyA9IGNiO1xuXHRcdGNiID0gcHJvcDtcblx0fSBlbHNlIGtleSA9IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcChvYmosIHByb3ApO1xuXHRpZiAodHlwZW9mIGNiID09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShjYikpIHtcblx0XHRvcHRpb25zID0gY2I7XG5cdFx0Y2IgPSAoKSA9PiB7fTtcblx0fVxuXHRpZiAoaXNQcmltaXRpdmUob2JqKSB8fCB0eXBlb2Ygb2JqID09IFwic3ltYm9sXCIpIHtcblx0XHRpZiAobm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpLnRyaWdnZXJJbW1lZGlhdGVseSkgcmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdHJldHVybiBjYj8uKG9iaiwgbnVsbCwgbnVsbCwgbnVsbCwgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdH0pKTtcblx0fVxuXHRpZiAodHlwZW9mIG9iaj8uWyRhZmZlY3RlZF0gPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gb2JqPy5bJGFmZmVjdGVkXT8uKGNiLCBrZXksIG9wdGlvbnMpO1xuXHRlbHNlIGlmIChjaGVja1ZhbGlkT2JqKG9iaikpIHtcblx0XHRjb25zdCB3cmFwcGVkID0gb2JqO1xuXHRcdGlmIChzcGVjaWFsaXplZFN1YnNjcmliZT8uaGFzPy4ob2JqID0gb2JqPy5bJGV4dHJhY3RLZXkkXSA/PyBvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldD8uKG9iaik/Lih3cmFwcGVkLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaXNPYnNlcnZhYmxlKHdyYXBwZWQpIHx8IGNoZWNrSXNQYWlyZWQob2JqKSAmJiBpc09ic2VydmFibGUob2JqPy5bMF0pKSB7XG5cdFx0XHRpZiAoaXNUaGVuYWJsZShvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVUaGVuYWJsZSk/LihvYmosIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdFx0ZWxzZSBpZiAoY2hlY2tJc1BhaXJlZChvYmopKSByZXR1cm4gc3BlY2lhbGl6ZWRTdWJzY3JpYmU/LmdldE9ySW5zZXJ0Py4ob2JqLCBzdWJzY3JpYmVQYWlyZWQpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBIVE1MSW5wdXRFbGVtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgb2JqIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlSW5wdXQpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlRGlyZWN0bHkpPy4od3JhcHBlZCwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGluaXRpYWxDYiA9IHdpdGhUcmlnZ2VyKGNiLCBvcHRpb25zLCBpbml0aWFsVHJpZ2dlcik7XG5cdFx0XHRpZiAoIWluaXRpYWxDYikgcmV0dXJuO1xuXHRcdFx0cmV0dXJuIFByb21pc2VkKGdsb2JhbFRoaXM/LlByb21pc2U/LnRyeT8uKCgpID0+IHtcblx0XHRcdFx0aWYgKGNoZWNrSXNQYWlyZWQob2JqKSkgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaj8uWzBdLCBvYmo/LlsxXSwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdFx0ZWxzZSBpZiAoa2V5ICE9IG51bGwgJiYga2V5ICE9IFN5bWJvbC5pdGVyYXRvcikgcmV0dXJuIGNhbGxCeVByb3BSZWZBd2FyZT8uKG9iaiwga2V5LCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0XHRlbHNlIHJldHVybiBjYWxsQnlBbGxQcm9wPy4ob2JqLCBpbml0aWFsQ2IsIG51bGwpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxufTtcbmZ1bmN0aW9uIGVmZmVjdChjYiwgdGFyZ2V0cywgb3B0aW9ucykge1xuXHRpZiAoY2IgPT0gbnVsbCB8fCB0eXBlb2YgY2IgIT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdGlmIChpc0VmZmVjdE9wdGlvbnNBcmcodGFyZ2V0cykgJiYgb3B0aW9ucyA9PT0gdm9pZCAwKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIHRhcmdldHMpO1xuXHRpZiAodGFyZ2V0cyA9PSBudWxsKSByZXR1cm4gZWZmZWN0R2xvYmFsbHkoY2IsIG9wdGlvbnMpO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Y29uc3QgYWZmZWN0ZWRPcHRpb25zID0ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVkLmFmZmVjdFR5cGVzLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogbm9ybWFsaXplZC50cmlnZ2VySW1tZWRpYXRlbHlcblx0fTtcblx0Y29uc3QgZGlzcG9zZXJzID0gbm9ybWFsaXplRWZmZWN0VGFyZ2V0cyh0YXJnZXRzKS5tYXAoKHNvdXJjZSkgPT4ge1xuXHRcdGNvbnN0IGN0eCA9IGVmZmVjdFRhcmdldENvbnRleHQoc291cmNlKTtcblx0XHRyZXR1cm4gYWZmZWN0ZWQoY3R4LnRhcmdldCwgY3R4LnByb3AsICh2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmFyZ3MpID0+IHtcblx0XHRcdHJldHVybiBjYih0b0VmZmVjdEV2ZW50KGN0eC5zb3VyY2UsIGN0eC50YXJnZXQsIHZhbHVlLCBwcm9wLCBvbGRWYWx1ZSwgdHJpZ2dlciA/PyBudWxsLCBhcmdzKSk7XG5cdFx0fSwgYWZmZWN0ZWRPcHRpb25zKTtcblx0fSkuZmlsdGVyKChkaXNwb3NlKSA9PiB0eXBlb2YgZGlzcG9zZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRyZXR1cm4gKCkgPT4gZGlzcG9zZXJzLmZvckVhY2goKGRpc3Bvc2UpID0+IGRpc3Bvc2U/LigpKTtcbn1cbmZ1bmN0aW9uIGVmZmVjdGVkKHRhcmdldHMsIGNiLCBvcHRpb25zKSB7XG5cdHJldHVybiBlZmZlY3QoY2IsIHRhcmdldHMsIG9wdGlvbnMpO1xufVxudmFyIG1ha2VBcnJheU9ic2VydmFibGUgPSAodGcpID0+IHtcblx0aWYgKHRnIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gb2JzZXJ2YWJsZUJ5U2V0KHRnKTtcblx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gb2JzZXJ2YWJsZUJ5TWFwKHRnKTtcblx0cmV0dXJuIHRnO1xufTtcbnZhciBEb3VibGVXZWFrTWFwID0gY2xhc3Mge1xuXHQjdG9wID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdCNlbnN1cmVJbm5lcihrZXkxKSB7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbnVsbDtcblx0XHRsZXQgaW5uZXIgPSB0aGlzLiN0b3AuZ2V0KGtleTEpO1xuXHRcdGlmICghaW5uZXIpIHtcblx0XHRcdGlubmVyID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdFx0XHR0aGlzLiN0b3Auc2V0KGtleTEsIGlubmVyKTtcblx0XHR9XG5cdFx0cmV0dXJuIGlubmVyO1xuXHR9XG5cdCNzcGxpdFBhaXIocGFpcikge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShwYWlyKSB8fCBwYWlyLmxlbmd0aCAhPT0gMikgcmV0dXJuIFtudWxsLCBudWxsXTtcblx0XHRyZXR1cm4gcGFpcjtcblx0fVxuXHRoYXNMMShrZXkxKSB7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5oYXMoa2V5MSk7XG5cdH1cblx0c2V0KHBhaXIsIHZhbHVlKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRoaXM7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRnZXQocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2b2lkIDA7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5nZXQoa2V5MSk/LmdldChrZXkyKTtcblx0fVxuXHRoYXMocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmdldChrZXkxKT8uaGFzKGtleTIpID8/IGZhbHNlO1xuXHR9XG5cdGRlbGV0ZShwYWlyKSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jdG9wLmdldChrZXkxKTtcblx0XHRyZXR1cm4gaW5uZXIgPyBpbm5lci5kZWxldGUoa2V5MikgOiBmYWxzZTtcblx0fVxuXHRkZWxldGVUb3Aoa2V5MSkge1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZGVsZXRlKGtleTEpO1xuXHR9XG5cdGdldE9yQ3JlYXRlKHBhaXIsIGZhY3RvcnkpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFjdG9yeT8uKCk7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRjb25zdCB2YWx1ZSA9IGZhY3RvcnkoKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRnZXRPckluc2VydChwYWlyLCB2YWx1ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cdGdldE9ySW5zZXJ0Q29tcHV0ZWQocGFpciwgY29tcHV0ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb21wdXRlPy4oW2tleTEsIGtleTJdKTtcblx0XHRpZiAoaW5uZXIuaGFzKGtleTIpKSByZXR1cm4gaW5uZXIuZ2V0KGtleTIpO1xuXHRcdGNvbnN0IHZhbHVlID0gY29tcHV0ZShba2V5MSwga2V5Ml0pO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59O1xudmFyIHJlZ2lzdGVyZWRJdGVyYXRlZCA9IG5ldyBEb3VibGVXZWFrTWFwKCk7XG5mdW5jdGlvbiBpdGVyYXRlZCh0ZywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdGlmICghdGcpIHJldHVybjtcblx0aWYgKHR5cGVvZiB0ZyAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdGcgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAocmVnaXN0ZXJlZEl0ZXJhdGVkLmhhcyhbdGcsIGNiXSkpIHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0KFt0ZywgY2JdKTtcblx0Y29uc3QgJHN1YiA9ICh2YWx1ZSwgbmFtZSwgb2xkLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKG5hbWUgPT0gXCJ2YWx1ZVwiKSB7XG5cdFx0XHRjb25zdCBlbnRyaWVzID0gKG9sZD8udmFsdWUgPz8gb2xkKT8uZW50cmllcz8uKCk7XG5cdFx0XHRjb25zdCBiYXNpcyA9IHRnPy52YWx1ZSA/PyB2YWx1ZT8udmFsdWUgPz8gdmFsdWU7XG5cdFx0XHRpZiAoZW50cmllcykgZm9yIChjb25zdCBbaWR4LCBpdGVtXSBvZiBlbnRyaWVzKSB7XG5cdFx0XHRcdGNvbnN0IG9mT2xkID0gaXRlbSA/PyAob2xkPy52YWx1ZSA/PyBvbGQpPy5baWR4XSA/PyBudWxsO1xuXHRcdFx0XHRjb25zdCBvZk5ldyA9IGJhc2lzPy5baWR4XTtcblx0XHRcdFx0aWYgKG9mT2xkID09IG51bGwgJiYgb2ZOZXcgIT0gbnVsbCkgY2Iob2ZOZXcsIGlkeCwgbnVsbCwgXCJhZGRcIik7XG5cdFx0XHRcdGVsc2UgaWYgKG9mT2xkICE9IG51bGwgJiYgb2ZOZXcgPT0gbnVsbCkgY2IobnVsbCwgaWR4LCBvZk9sZCwgXCJkZWxldGVcIik7XG5cdFx0XHRcdGVsc2UgaWYgKGlzTm90RXF1YWwob2ZPbGQsIG9mTmV3KSkgY2Iob2ZOZXcsIGlkeCwgb2ZPbGQsIFwic2V0XCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGl0ZXJhdGVkKHZhbHVlID8/IHRnPy52YWx1ZSwgY2IsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmFtZSA9PSBudWxsID8gdm9pZCAwIDogdGdbbmFtZV07XG5cdH07XG5cdHJldHVybiByZWdpc3RlcmVkSXRlcmF0ZWQuZ2V0T3JJbnNlcnRDb21wdXRlZChbdGcsIGNiXSwgKCkgPT4ge1xuXHRcdGlmICh0ZyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIGFmZmVjdGVkKFtvYnNlcnZhYmxlQnlTZXQodGcpLCBTeW1ib2wuaXRlcmF0b3JdLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKHRnIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gYWZmZWN0ZWQodGcsIGNiLCBvcHRpb25zKTtcblx0XHRpZiAoaGFzVmFsdWUodGcpKSByZXR1cm4gYWZmZWN0ZWQodGcsICRzdWIsIG9wdGlvbnMpO1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHRnKSAmJiAhKHRnPy5sZW5ndGggPT0gMiAmJiBpc0tleVR5cGUodGc/LlsxXSkgJiYgaXNPYnNlcnZhYmxlKHRnPy5bMF0pKSkgcmV0dXJuIGFmZmVjdGVkKFt0ZywgU3ltYm9sLml0ZXJhdG9yXSwgY2IsIG9wdGlvbnMpO1xuXHRcdHJldHVybiBhZmZlY3RlZCh0ZywgY2IsIG9wdGlvbnMpO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIHVuYWZmZWN0ZWQodGcsIGNiKSB7XG5cdHJldHVybiB3aXRoUHJvbWlzZSh0ZywgKHRhcmdldCkgPT4ge1xuXHRcdGNvbnN0IGlzUGFpciA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KSAmJiB0YXJnZXQ/Lmxlbmd0aCA9PSAyICYmIFtcIm9iamVjdFwiLCBcImZ1bmN0aW9uXCJdLmluZGV4T2YodHlwZW9mIHRhcmdldD8uWzBdKSA+PSAwICYmIGlzS2V5VHlwZSh0YXJnZXQ/LlsxXSk7XG5cdFx0Y29uc3QgcHJvcCA9IGlzUGFpciA/IHRhcmdldD8uWzFdIDogbnVsbDtcblx0XHR0YXJnZXQgPSBpc1BhaXIgJiYgcHJvcCAhPSBudWxsID8gdGFyZ2V0Py5bMF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdGNvbnN0IHVud3JhcCA9IHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIiA/IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRcdCh0YXJnZXQ/LlskcmVnaXN0cnlLZXkkXSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKSk/LnVuYWZmZWN0ZWQ/LihjYiwgcHJvcCk7XG5cdH0pO1xufVxudmFyIGJpbmRCeSA9ICh0YXJnZXQsIHJlYWN0aXZlLCB3YXRjaCkgPT4ge1xuXHRhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHYsIHApID0+IHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2LCBwLCB0cnVlKTtcblx0fSk7XG5cdHdhdGNoPy4oKCkgPT4gdGFyZ2V0LCAoTikgPT4ge1xuXHRcdGZvciAoY29uc3QgayBpbiBOKSBvYmplY3RBc3NpZ24ocmVhY3RpdmUsIE5ba10sIGssIHRydWUpO1xuXHR9LCB7IGRlZXA6IHRydWUgfSk7XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGRlcml2YXRlID0gKGZyb20sIHJlYWN0Rm4sIHdhdGNoKSA9PiBiaW5kQnkocmVhY3RGbihzYWZlKGZyb20pKSwgZnJvbSwgd2F0Y2gpO1xudmFyIGJpbmRCeUtleSA9ICh0YXJnZXQsIHJlYWN0aXZlLCBrZXkgPSAoKSA9PiBcIlwiKSA9PiBhZmZlY3RlZChyZWFjdGl2ZSwgbnVsbCwgKHZhbHVlLCBwKSA9PiB7XG5cdGlmIChwID09IGtleSgpKSBvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbnVsbCwgdHJ1ZSk7XG59KTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvcmUvQXNzaWduZWQudHNcbnZhciBjb25kaXRpb25hbEluZGV4ID0gKGNvbmRMaXN0ID0gW10pID0+IHtcblx0Y29uc3Qgc291cmNlID0gb2JzZXJ2ZSh7IHZhbHVlOiAwIH0pO1xuXHRjb25zdCByZWFkQ29uZGl0aW9uID0gKGNvbmRpdGlvbikgPT4ge1xuXHRcdGlmICh0eXBlb2YgY29uZGl0aW9uID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbmRpdGlvbigpO1xuXHRcdHJldHVybiBoYXNWYWx1ZShjb25kaXRpb24pID8gY29uZGl0aW9uLnZhbHVlIDogY29uZGl0aW9uO1xuXHR9O1xuXHRjb25zdCBldmFsdWF0ZSA9ICgpID0+IGNvbmRMaXN0LmZpbmRJbmRleCgoY29uZGl0aW9uKSA9PiAhIXJlYWRDb25kaXRpb24oY29uZGl0aW9uKSk7XG5cdGNvbnN0IHJlc3VsdCA9IGNvbXB1dGVkKFtzb3VyY2UsIFwidmFsdWVcIl0sIGV2YWx1YXRlLCBcInZhbHVlXCIpO1xuXHRjb25zdCBpbnZhbGlkYXRlID0gKCkgPT4ge1xuXHRcdHNvdXJjZS52YWx1ZSsrO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlcnMgPSBbXTtcblx0aWYgKGlzT2JzZXJ2YWJsZShjb25kTGlzdCkpIGRpc3Bvc2Vycy5wdXNoKGFmZmVjdGVkKGNvbmRMaXN0LCBpbnZhbGlkYXRlLCB7XG5cdFx0YWZmZWN0VHlwZXM6IFtcblx0XHRcdFwiYWRkXCIsXG5cdFx0XHRcInNldFwiLFxuXHRcdFx0XCJkZWxldGVcIlxuXHRcdF0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIGNvbmRMaXN0KSBpZiAoaGFzVmFsdWUoY29uZGl0aW9uKSkgZGlzcG9zZXJzLnB1c2goYWZmZWN0ZWQoW2NvbmRpdGlvbiwgXCJ2YWx1ZVwiXSwgaW52YWxpZGF0ZSwge1xuXHRcdGFmZmVjdFR5cGVzOiBbXCJzZXR0ZXJcIl0sXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9KSk7XG5cdGFkZFRvQ2FsbENoYWluKHJlc3VsdCwgU3ltYm9sLmRpc3Bvc2UsICgpID0+IGRpc3Bvc2Vycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlPy4oKSkpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbnZhciBjb25kaXRpb25hbFJlZiA9IChjb25kLCBpZlRydWUsIGlmRmFsc2UsIGJlaGF2aW9yKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZShjb25kKSkgcmV0dXJuIGNvbmQgPyBpZlRydWUgOiBpZkZhbHNlO1xuXHRjb25zdCBnZXRUcnVlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZlRydWU7XG5cdH07XG5cdGNvbnN0IGdldEZhbHNlID0gKCkgPT4ge1xuXHRcdHJldHVybiBpZkZhbHNlO1xuXHR9O1xuXHRjb25zdCB2YWx1ZU9mID0gKG4pID0+IHtcblx0XHRpZiAobiAhPSBudWxsKSBjb25kLnZhbHVlID0gaGFzVmFsdWUobikgPyBuPy52YWx1ZSA6IG47XG5cdFx0cmV0dXJuIChoYXNWYWx1ZShjb25kKSA/IGNvbmQ/LnZhbHVlIDogY29uZCkgPyBnZXRUcnVlKCkgOiBnZXRGYWxzZSgpO1xuXHR9O1xuXHRjb25zdCByID0gb2JzZXJ2ZSh7XG5cdFx0WyR2YWx1ZV06IHZhbHVlT2YoKSxcblx0XHRbJGJlaGF2aW9yXTogYmVoYXZpb3IsXG5cdFx0W1N5bWJvbD8udG9TdHJpbmdUYWddKCkge1xuXHRcdFx0cmV0dXJuIFN0cmluZyh2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV0sIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9IHZhbHVlT2Yodik7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdID0gdmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXTtcblx0XHR9XG5cdH0pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChbY29uZCwgXCJ2YWx1ZVwiXSwgKCkgPT4ge1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gcj8uWyR2YWx1ZV07XG5cdFx0Y29uc3QgdmFsdWUgPSB2YWx1ZU9mKCk7XG5cdFx0clskdmFsdWVdID0gdmFsdWU7XG5cdFx0cj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRvbGRWYWx1ZSxcblx0XHRcdHRyaWdnZXI6IFwibWFudWFsXCJcblx0XHR9KTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHIsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcjtcbn07XG52YXIgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbFJlZjtcbnZhciByZW1hcCA9IChzdWIsIGNiLCBkZXN0KSA9PiB7XG5cdGlmICghZGVzdCkgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChzdWIsICh2YWx1ZSwgcHJvcCwgb2xkKSA9PiB7XG5cdFx0aWYgKHByb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGNvbnN0IGdvdCA9IGNiPy4odmFsdWUsIHByb3AsIG9sZCk7XG5cdFx0aWYgKHR5cGVvZiBnb3QgPT0gXCJvYmplY3RcIikgb2JqZWN0QXNzaWduTm90RXF1YWwoZGVzdCwgZ290KTtcblx0XHRlbHNlIGlmIChpc05vdEVxdWFsKGRlc3RbcHJvcF0sIGdvdCkpIGRlc3RbcHJvcF0gPSBnb3Q7XG5cdH0pO1xuXHRpZiAoZGVzdCkgYWRkVG9DYWxsQ2hhaW4oZGVzdCwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiBkZXN0O1xufTtcbnZhciB1bmlmaWVkID0gKC4uLnN1YnMpID0+IHtcblx0Y29uc3QgZGVzdCA9IG9ic2VydmUoe30pO1xuXHRzdWJzPy5mb3JFYWNoPy4oKHN1YikgPT4gYWZmZWN0ZWQoc3ViLCAodmFsdWUsIHByb3AsIF8pID0+IHtcblx0XHRpZiAocHJvcCA9PSBudWxsKSByZXR1cm47XG5cdFx0aWYgKGlzTm90RXF1YWwoZGVzdFtwcm9wXSwgdmFsdWUpKSBkZXN0W3Byb3BdID0gdmFsdWU7XG5cdH0pKTtcblx0cmV0dXJuIGRlc3Q7XG59O1xudmFyIG9ic2VydmFibGVCeVNldCA9IChzZXQpID0+IHtcblx0Y29uc3Qgb2JzID0gb2JzZXJ2ZShbXSk7XG5cdG9icy5wdXNoKC4uLkFycmF5LmZyb20oc2V0Py52YWx1ZXM/LigpIHx8IFtdKSk7XG5cdGFkZFRvQ2FsbENoYWluKG9icywgU3ltYm9sLmRpc3Bvc2UsIGFmZmVjdGVkKHNldCwgKHZhbHVlLCBfLCBvbGQpID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2YWx1ZSwgb2xkKSkge1xuXHRcdFx0aWYgKG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwpIG9icy5wdXNoKHZhbHVlKTtcblx0XHRcdGVsc2UgaWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gb2JzLmluZGV4T2Yob2xkKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwKSBvYnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBpZHggPSBvYnMuaW5kZXhPZihvbGQpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDAgJiYgaXNOb3RFcXVhbChvYnNbaWR4XSwgdmFsdWUpKSBvYnNbaWR4XSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSkpO1xuXHRyZXR1cm4gb2JzO1xufTtcbnZhciBvYnNlcnZhYmxlQnlNYXAgPSAobWFwKSA9PiB7XG5cdGNvbnN0IG9icyA9IG9ic2VydmUoW10pO1xuXHRjb25zdCBpbml0aWFsRW50cmllcyA9IEFycmF5LmZyb20obWFwLmVudHJpZXMoKSk7XG5cdG9icy5wdXNoKC4uLmluaXRpYWxFbnRyaWVzKTtcblx0YWRkVG9DYWxsQ2hhaW4ob2JzLCBTeW1ib2wuZGlzcG9zZSwgYWZmZWN0ZWQobWFwLCAodmFsdWUsIHByb3AsIG9sZCkgPT4ge1xuXHRcdGlmIChpc05vdEVxdWFsKHZhbHVlLCBvbGQpIHx8IG9sZCA9PSBudWxsICYmIHZhbHVlICE9IG51bGwgfHwgb2xkICE9IG51bGwgJiYgdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0aWYgKG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdFx0bGV0IGlkeCA9IG9icy5maW5kSW5kZXgoKFtuYW1lLCBfXSkgPT4gbmFtZSA9PSBwcm9wKTtcblx0XHRcdFx0aWYgKGlkeCA8IDApIGlkeCA9IG9icy5maW5kTGFzdEluZGV4KChbXywgdmFsXSkgPT4gb2xkID09PSB2YWwpO1xuXHRcdFx0XHRpZiAoaWR4ID49IDApIG9icy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBpZHggPSBvYnMuZmluZEluZGV4KChbbmFtZSwgX10pID0+IG5hbWUgPT0gcHJvcCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCAmJiBpZHggPCBvYnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWYgKGlzTm90RXF1YWwob2JzW2lkeF0/LlsxXSwgdmFsdWUpKSBvYnNbaWR4XSA9IFtwcm9wLCB2YWx1ZV07XG5cdFx0XHRcdH0gZWxzZSBvYnMucHVzaChbcHJvcCwgdmFsdWVdKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKTtcblx0cmV0dXJuIG9icztcbn07XG52YXIgYXNzaWduTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgYXNzaWduID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgaXNBQ29tcHV0ZSA9IHR5cGVvZiBhPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIGE/Lmxlbmd0aCA9PSAyLCBpc0JDb21wdXRlID0gdHlwZW9mIGI/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgYj8ubGVuZ3RoID09IDIsIGNtcEJGbmMgPSBpc0JDb21wdXRlID8gYj8uWzFdIDogbnVsbDtcblx0Y29uc3QgaXNBUHJvcCA9IChpc0tleVR5cGUoYT8uWzFdKSB8fCBhPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBhPy5sZW5ndGggPT0gMjtcblx0bGV0IGFfcHJvcCA9IGlzQVByb3AgJiYgIWlzQUNvbXB1dGUgPyBhPy5bMV0gOiBBcnJheS5pc0FycmF5KGEpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgYSA9IFthLCBhX3Byb3BdO1xuXHRpZiAoaXNBQ29tcHV0ZSkgYVsxXSA9IGFfcHJvcDtcblx0Y29uc3QgaXNCUHJvcCA9IChpc0tleVR5cGUoYj8uWzFdKSB8fCBiPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBiPy5sZW5ndGggPT0gMjtcblx0bGV0IGJfcHJvcCA9IGlzQlByb3AgJiYgIWlzQkNvbXB1dGUgPyBiPy5bMV0gOiBBcnJheS5pc0FycmF5KGIpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNCUHJvcCAmJiAhaXNCQ29tcHV0ZSkgYiA9IFtiLCBiX3Byb3BdO1xuXHRpZiAoaXNCQ29tcHV0ZSkgYlsxXSA9IGJfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGJfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgYT8uWzBdKSB8fCBpc0FycmF5SW52YWxpZEtleShiX3Byb3AsIGI/LlswXSkpIHJldHVybjtcblx0aWYgKCEoKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgYj8uWzBdICE9IG51bGwpICYmICFBcnJheS5pc0FycmF5KGFbMF0pKSB7XG5cdFx0JGF2b2lkVHJpZ2dlcihiLCAoKSA9PiB7XG5cdFx0XHRhWzBdW2FfcHJvcF0gPSBiPy5bMF07XG5cdFx0fSk7XG5cdFx0cmV0dXJuICgpID0+IHt9O1xuXHR9XG5cdGNvbnN0IGNvbXB1dGUgPSAodiwgcCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IGJfdG1wID0gYlJlZj8uZGVyZWY/LigpO1xuXHRcdGlmIChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uYm91bmQgPT0gYl90bXApIHtcblx0XHRcdGxldCB2YWwgPSBudWxsO1xuXHRcdFx0Y29uc3QgY21wZnggPSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uY21wZng7XG5cdFx0XHQkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgY21wZnggPT0gXCJmdW5jdGlvblwiKSB2YWwgPSBjbXBmeD8uKCRnZXRWYWx1ZShiX3RtcCkgPz8gdiwgcCwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgdmFsID0gYl90bXA/LltwXSA/PyB2O1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBudiA9ICRnZXRWYWx1ZSh2YWwpO1xuXHRcdFx0aWYgKGlzTm90RXF1YWwoYV90bXBbYV9wcm9wXSwgbnYpKSAkYXZvaWRUcmlnZ2VyKGJfdG1wLCAoKSA9PiB7XG5cdFx0XHRcdGFfdG1wW2FfcHJvcF0gPSBudjtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSAoKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApKT8uZ2V0Py4oYV9wcm9wKSk/LmRpc3Bvc2U/LigpO1xuXHR9O1xuXHRjb25zdCBkaXNwb3NlID0gKCkgPT4ge1xuXHRcdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpO1xuXHRcdGNvbnN0IG1hcCA9IGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApO1xuXHRcdGNvbnN0IHN0b3JlID0gbWFwPy5nZXQ/LihhX3Byb3ApO1xuXHRcdG1hcD8uZGVsZXRlPy4oYV9wcm9wKTtcblx0XHRzdG9yZT8udW5zdWI/LigpO1xuXHR9O1xuXHRjb25zdCBiUmVmID0gYj8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBiPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYj8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShiPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBiPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihiPy5bMF0pIDogYj8uWzBdLCBhUmVmID0gYT8uWzBdICE9IG51bGwgJiYgKHR5cGVvZiBhPy5bMF0gPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYT8uWzBdID09IFwiZnVuY3Rpb25cIikgJiYgIShhPy5bMF0gaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiBhPy5bMF0/LmRlcmVmID09IFwiZnVuY3Rpb25cIikgPyBuZXcgV2Vha1JlZihhPy5bMF0pIDogYT8uWzBdO1xuXHRsZXQgc3RvcmUgPSB7XG5cdFx0Y29tcHV0ZSxcblx0XHRkaXNwb3NlLFxuXHRcdGNtcGZ4OiBjbXBCRm5jXG5cdH07XG5cdGNvbnN0IGFfdG1wID0gYVJlZj8uZGVyZWY/LigpLCBiX3RtcCA9IGJSZWY/LmRlcmVmPy4oKTtcblx0aWYgKGFSZWYgaW5zdGFuY2VvZiBXZWFrUmVmKSB7XG5cdFx0aWYgKGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5nZXQ/LihhX3Byb3ApPy5ib3VuZCAhPSBiX3RtcCkgYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmRlbGV0ZT8uKGFfcHJvcCk7XG5cdFx0c3RvcmUgPSAoYXNzaWduTWFwPy5nZXRPckluc2VydD8uKGFfdG1wLCAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKSk/LmdldE9ySW5zZXJ0Q29tcHV0ZWQ/LihhX3Byb3AsICgpID0+ICh7XG5cdFx0XHRib3VuZDogYl90bXAsXG5cdFx0XHRjbXBmeDogY21wQkZuYyxcblx0XHRcdHVuc3ViOiBudWxsLFxuXHRcdFx0Y29tcHV0ZSxcblx0XHRcdGRpc3Bvc2Vcblx0XHR9KSk7XG5cdFx0c3RvcmUudW5zdWIgPSBhZmZlY3RlZChiLCBjb21wdXRlKTtcblx0XHRzdG9yZS5jbXBmeCA9IGNtcEJGbmM7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYV90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdFx0YWRkVG9DYWxsQ2hhaW4oYl90bXAsIFN5bWJvbC5kaXNwb3NlLCBzdG9yZT8uZGlzcG9zZSk7XG5cdH1cblx0aWYgKGJfdG1wICYmICFBcnJheS5pc0FycmF5KGJfdG1wKSkgJGF2b2lkVHJpZ2dlcihhX3RtcCwgKCkgPT4ge1xuXHRcdGJfdG1wW2JfcHJvcF0gPz89IGFfdG1wPy5bYV9wcm9wXSA/PyBiX3RtcFtiX3Byb3BdO1xuXHR9KTtcblx0cmV0dXJuIHN0b3JlPy5kaXNwb3NlO1xufTtcbnZhciBsaW5rID0gKGEsIGIsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgdXN1YiA9IFthc3NpZ24oYSwgYiwgcHJvcCksIGFzc2lnbihiLCBhLCBwcm9wKV07XG5cdHJldHVybiAoKSA9PiB1c3ViPy5tYXA/LigoYykgPT4gYz8uKCkpO1xufTtcbnZhciBjb21wdXRlZCA9IChzcmMsIGNiLCBiZWhhdmlvciwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRjb25zdCBpc0FDb21wdXRlID0gdHlwZW9mIHNyYz8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRjb25zdCBpc0FQcm9wID0gKGlzS2V5VHlwZShzcmM/LlsxXSkgfHwgc3JjPy5bMV0gPT0gU3ltYm9sLml0ZXJhdG9yKSAmJiBzcmM/Lmxlbmd0aCA9PSAyO1xuXHRsZXQgYV9wcm9wID0gaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSA/IHNyYz8uWzFdIDogQXJyYXkuaXNBcnJheShzcmMpID8gbnVsbCA6IHByb3A7XG5cdGlmICghaXNBUHJvcCAmJiAhaXNBQ29tcHV0ZSkgc3JjID0gW2lzQVByb3AgPyBzcmM/LlswXSA6IHNyYywgYV9wcm9wXTtcblx0aWYgKGlzQUNvbXB1dGUpIHNyY1sxXSA9IGFfcHJvcDtcblx0aWYgKGFfcHJvcCA9PSBudWxsIHx8IGlzQXJyYXlJbnZhbGlkS2V5KGFfcHJvcCwgc3JjPy5bMF0pKSByZXR1cm47XG5cdGxldCBvbGRWYWx1ZSA9IHZvaWQgMDtcblx0bGV0IG9sZEFyZyA9IHZvaWQgMDtcblx0Y29uc3QgY21wID0gKGFyZywgZm9yY2UpID0+IHtcblx0XHRhcmcgPz89IHNyYz8uWzBdPy5bYV9wcm9wXSA/PyBvbGRBcmcgPz8gYXJnO1xuXHRcdGlmIChmb3JjZSB8fCBpc05vdEVxdWFsKG9sZEFyZywgYXJnKSAmJiBhcmcgIT0gdm9pZCAwIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0bGV0IG52ID0gY2I/LihhcmcsIGFfcHJvcCwgb2xkQXJnKTtcblx0XHRcdG9sZFZhbHVlID0gbnY7XG5cdFx0XHRyZXR1cm4gbnY7XG5cdFx0fVxuXHRcdHJldHVybiBvbGRWYWx1ZTtcblx0fTtcblx0Y29uc3Qgd3JwRnVuYyA9IChhcmcsIHByb3AgPSBcInZhbHVlXCIsIG9sZEFyZyQsIG9wKSA9PiB7XG5cdFx0b2xkQXJnID0gb2xkQXJnJCA/PyBvbGRBcmc7XG5cdFx0YXJnID8/PSBzcmM/LlswXT8uW2FfcHJvcF07XG5cdFx0aWYgKGlzTm90RXF1YWwob2xkQXJnLCBhcmcpICYmIGFyZyAhPSB2b2lkIDAgfHwgb2xkVmFsdWUgPT0gdm9pZCAwKSB7XG5cdFx0XHRsZXQgbnYgPSBjYj8uKGFyZywgYV9wcm9wLCBvbGRBcmcsIG9wKTtcblx0XHRcdG9sZEFyZyA9IGFyZztcblx0XHRcdGlmIChpc05vdEVxdWFsKG52LCBvbGRWYWx1ZSkgfHwgb2xkVmFsdWUgPT0gdm9pZCAwKSB7XG5cdFx0XHRcdHJmW3Byb3BdID0gb2xkVmFsdWUgPSBudjtcblx0XHRcdFx0b2xkVmFsdWUgPSByZltwcm9wXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBudjtcblx0XHR9XG5cdFx0cmV0dXJuIHJmW3Byb3BdO1xuXHR9O1xuXHRjb25zdCBpbml0aWFsID0gY21wKHNyY1swXVthX3Byb3BdID8/IG9sZEFyZyk7XG5cdGNvbnN0IHBlbmRpbmdJbml0aWFsID0gaXNQcm9taXNlKGluaXRpYWwpO1xuXHRjb25zdCAkYXBwbHkgPSBTeW1ib2wuZm9yKFwiQEBhcHBseVwiKTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRwcm9taXNlLCB7XG5cdFx0dmFsdWU6IGluaXRpYWwsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkdmFsdWUsIHtcblx0XHR2YWx1ZTogaW5pdGlhbCxcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRiZWhhdmlvciwge1xuXHRcdHZhbHVlOiBiZWhhdmlvcixcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsIFN5bWJvbD8udG9TdHJpbmdUYWcsIHtcblx0XHR2YWx1ZTogU3RyaW5nKHdycEZ1bmNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiLFxuXHRcdHdyaXRhYmxlOiBmYWxzZVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsIFN5bWJvbD8udG9QcmltaXRpdmUsIHtcblx0XHR2YWx1ZTogdHJ5UGFyc2VCeUhpbnQod3JwRnVuY1skdmFsdWVdLCBcIm51bWJlclwiKSxcblx0XHR3cml0YWJsZTogZmFsc2Vcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBcInZhbHVlXCIsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBjcCA9IGNtcCgpO1xuXHRcdFx0aWYgKGNwICE9IG51bGwpIHdycEZ1bmNbJHZhbHVlXSA9IGNwO1xuXHRcdFx0cmV0dXJuIHdycEZ1bmNbJHZhbHVlXTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYXJnKSB7XG5cdFx0XHR3cnBGdW5jWyR2YWx1ZV0gPSBjbXAoYXJnLCB0cnVlKTtcblx0XHR9XG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgJGFwcGx5LCB7XG5cdFx0dmFsdWU6ICh2KSA9PiB7XG5cdFx0XHRpZiAodiA9PSB2b2lkIDApIHJldHVybiByZj8udmFsdWU7XG5cdFx0XHRyZi52YWx1ZSA9IHY7XG5cdFx0XHRyZXR1cm4gcmY/LnZhbHVlO1xuXHRcdH0sXG5cdFx0d3JpdGFibGU6IGZhbHNlXG5cdH0pO1xuXHRjb25zdCByZiA9IG9ic2VydmUod3JwRnVuYyk7XG5cdGNvbnN0IHdyaXRlQ29tcHV0ZWQgPSAodmFsdWUsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbigodikgPT4ge1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSByZj8uWyR2YWx1ZV07XG5cdFx0XHRyZlskdmFsdWVdID0gdjtcblx0XHRcdHJmPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdFx0dmFsdWU6IHYsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHY7XG5cdFx0fSk7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSByZj8uWyR2YWx1ZV07XG5cdFx0cmZbJHZhbHVlXSA9IHZhbHVlO1xuXHRcdHJmPy5bJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlclxuXHRcdH0pO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblx0aWYgKHBlbmRpbmdJbml0aWFsKSB3cml0ZUNvbXB1dGVkKGluaXRpYWwsIFwicmVzb2x2ZWRcIik7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKFtzcmM/LlswXSA/PyBzcmMsIGFfcHJvcCA/PyBcInZhbHVlXCJdLCAoKSA9PiB7XG5cdFx0d3JpdGVDb21wdXRlZChjbXAoKSwgXCJtYW51YWxcIik7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyZiwgU3ltYm9sLmRpc3Bvc2UsIHVzYik7XG5cdHJldHVybiByZjtcbn07XG52YXIgZGVsYXllZFN1YnNjcmliZSA9IChyZWYsIGNiLCBkZWxheSA9IDEwMCkgPT4ge1xuXHRsZXQgdG07XG5cdHJldHVybiBhZmZlY3RlZChyZWYsIFwidmFsdWVcIiwgKHYpID0+IHtcblx0XHRpZiAoIXYgJiYgdG0pIHtcblx0XHRcdGNsZWFyVGltZW91dCh0bSk7XG5cdFx0XHR0bSA9IG51bGw7XG5cdFx0fSBlbHNlIGlmICh2ICYmICF0bSkgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHJlZiwgY2IsIGRlbGF5KSA/PyB0bTtcblx0fSk7XG59O1xuXG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7ICRhZmZlY3RlZCwgJHJlZiwgJHJlc29sdmVkLCAkdHJpZ2dlciwgJHRyaWdnZXJDb250cm9sLCAkdHJpZ2dlckxlc3MsICR0cmlnZ2VyTG9jaywgQXNzaWduT2JqZWN0SGFuZGxlciwgRG91YmxlV2Vha01hcCwgYWRkVG9DYWxsQ2hhaW4sIGFmZmVjdGVkLCBhc3NpZ24sIGFzc2lnbk1hcCwgYmluZEJ5LCBiaW5kQnlLZXksIGJvb2xlYW5SZWYsIGNvbXB1dGVkLCBjb25kaXRpb25hbCwgY29uZGl0aW9uYWxJbmRleCwgY29uZGl0aW9uYWxSZWYsIGRlbGF5ZWRCZWhhdmlvciwgZGVsYXllZE9ySW5zdGFudEJlaGF2aW9yLCBkZWxheWVkU3Vic2NyaWJlLCBkZXJlZiwgZGVyaXZhdGUsIGVmZmVjdCwgZWZmZWN0ZWQsIGlzT2JzZXJ2YWJsZSwgaXRlcmF0ZWQsIGxpbmssIG1ha2VBcnJheU9ic2VydmFibGUsIG1ha2VPYmplY3RBc3NpZ25hYmxlLCBtYWtlUmVzb2x2ZWRPcCwgbnVtYmVyUmVmLCBvYnNlcnZhYmxlQnlNYXAsIG9ic2VydmFibGVCeVNldCwgb2JzZXJ2ZSwgcHJvbWlzZWQsIHByb3BSZWYsIHJlY292ZXJSZWFjdGl2ZSwgcmVmLCByZW1hcCwgcmVzb2x2ZWQsIHNhZmUsIHNwZWNpYWxpemVkU3Vic2NyaWJlLCBzdHJpbmdSZWYsIHN1YnNjcmliZURpcmVjdGx5LCBzdWJzY3JpYmVJbnB1dCwgc3Vic2NyaWJlUGFpcmVkLCBzdWJzY3JpYmVUaGVuYWJsZSwgdHJpZ2dlcldpdGhEZWxheSwgdW5hZmZlY3RlZCwgdW5pZmllZCwgdW53cmFwLCB1c2VPYnNlcnZhYmxlLCB3cmFwUmVmLCB3cmFwU2V0QXNBcnJheSB9OyJdLAogICJtYXBwaW5ncyI6ICJBQUFBLFNBQVMsaUJBQUFBLElBQWUsYUFBQUMsSUFBVyxnQkFBZ0JDLElBQWdCLFlBQUFDLElBQVUsV0FBQUMsR0FBUyxpQkFBQUMsSUFBZSxjQUFBQyxJQUFZLGlCQUFBQyxJQUFlLFlBQUFDLEdBQVUscUJBQUFDLElBQW1CLGFBQUFDLEdBQVcsY0FBQUMsR0FBWSxlQUFBQyxHQUFhLGFBQUFDLEdBQVcsbUJBQUFDLElBQWlCLGdCQUFBQyxJQUFjLHdCQUFBQyxJQUFzQixvQkFBQUMsSUFBa0IsdUJBQUFDLElBQXFC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RjsiLAogICJuYW1lcyI6IFsiJGF2b2lkVHJpZ2dlciIsICIkZ2V0VmFsdWUiLCAiJHRyaWdnZXJMb2NrJDEiLCAiUHJvbWlzZWQiLCAiYmluZEN0eCIsICJjYWxsQnlBbGxQcm9wIiwgImNhbGxCeVByb3AiLCAiZGVmYXVsdEJ5VHlwZSIsICJoYXNWYWx1ZSIsICJpc0FycmF5SW52YWxpZEtleSIsICJpc0tleVR5cGUiLCAiaXNOb3RFcXVhbCIsICJpc1ByaW1pdGl2ZSIsICJpc1Byb21pc2UiLCAibWFrZVRyaWdnZXJMZXNzIiwgIm9iamVjdEFzc2lnbiIsICJvYmplY3RBc3NpZ25Ob3RFcXVhbCIsICJwb3RlbnRpYWxseUFzeW5jIiwgInBvdGVudGlhbGx5QXN5bmNNYXAiLCAicmVzb2x2ZWQkMSIsICJ0cnlQYXJzZUJ5SGludCIsICIkdmFsdWUiLCAiJGV4dHJhY3RLZXkkIiwgIiRvcmlnaW5hbEtleSQiLCAiJHJlZ2lzdHJ5S2V5JCIsICIkYmVoYXZpb3IiLCAiJHByb21pc2UiLCAiJHJlc29sdmVkIiwgIiR0cmlnZ2VyTGVzcyIsICIkdHJpZ2dlckxvY2siLCAiJHRyaWdnZXJDb250cm9sIiwgIiR0cmlnZ2VyIiwgIiRhZmZlY3RlZCIsICIkaXNOb3RFcXVhbCIsICIkcmVhbFByb3AiLCAiJG9yaWdpbmFsT2JqZWN0cyQiLCAic2FmZSIsICJ0YXJnZXQiLCAidW53cmFwIiwgIm1hcHBlZCIsICJlIiwgIksiLCAiViIsICJhcnIiLCAiZGVyZWYiLCAiZGlzY291bnRWYWx1ZSIsICJvcmlnaW5hbCIsICIkdmFsIiwgImlzVGhlbmFibGUiLCAidmFsIiwgIndpdGhQcm9taXNlIiwgImNiIiwgImRpc3Bvc2VNYXAiLCAiZGlzcG9zZVJlZ2lzdHJ5IiwgImNhbGxzdGFjayIsICJhZGRUb0NhbGxDaGFpbiIsICJvYmoiLCAibWV0aG9kS2V5IiwgImNhbGxiYWNrIiwgImNoYWluVGFyZ2V0IiwgIkNhbGxDaGFpbiIsICJhcmdzIiwgImlzQXJyYXlJbmRleCIsICJwcm9wIiwgIm51bSIsICJ3cmFwU2V0QXNBcnJheSIsICJzb3VyY2UiLCAib3B0aW9ucyIsICJiYWNraW5nU2V0IiwgIm5vdGlmeUR1cGxpY2F0ZSIsICJ2YWx1ZSIsICJ2aWEiLCAiaW5kZXgiLCAiaXRlbSIsICJzbmFwc2hvdCIsICJyZWJ1aWxkRnJvbSIsICJtZXRob2RzIiwgIml0ZW1zIiwgInNpemUiLCAiaXRlcmF0b3IiLCAiY3VycmVudCIsICJ0b1ByZXBlbmQiLCAibmV4dCIsICJzdGFydCIsICJkZWxldGVDb3VudCIsICJub3JtYWxpemVkU3RhcnQiLCAiYWN0dWFsRGVsZXRlQ291bnQiLCAicmVtb3ZlZCIsICJpbnNlcnRQb3NpdGlvbiIsICJfIiwgIm5leHRMZW5ndGgiLCAibmV4dFZhbHVlIiwgImN1cnJlbnRWYWx1ZSIsICJpZHgiLCAia2V5cyIsICJpIiwgIkFzc2lnbk9iamVjdEhhbmRsZXIiLCAibmFtZSIsICJuZXdUIiwgImN0eCIsICJtYWtlT2JqZWN0QXNzaWduYWJsZSIsICJweCIsICJ3aXRoVW5zdWJTeW1ib2wiLCAid2l0aFVuc3ViIiwgImNvbXBsZXRlV2l0aFVuc3ViIiwgInN1YnNjcmliZXIiLCAid2VhayIsICJoYW5kbGVyIiwgInJlZ2lzdHJ5IiwgInNhdkNvbXBsZXRlIiwgInVuYWZmZWN0ZWQiLCAiciIsICJzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbCIsICJzdWJzY3JpcHRSZWdpc3RyeSIsICJnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2wiLCAiZ2xvYmFsRWZmZWN0TGlzdGVuZXJzIiwgImVmZmVjdEdsb2JhbGx5IiwgIm5vcm1hbGl6ZWQiLCAibm9ybWFsaXplRWZmZWN0T3B0aW9ucyIsICJ3cmFwcGVkU3ltYm9sIiwgIndyYXBwZWQiLCAicmVnaXN0ZXIiLCAid2hhdCIsICJoYW5kbGUiLCAiU3Vic2NyaXB0IiwgIndyYXBXaXRoIiwgImZvckFsbCIsICJ3aWxkY2FyZFRyaWdnZXJzIiwgInRyaWdnZXJBbGlhc2VzIiwgInRyaWdnZXJDYW5vbmljYWxOYW1lc1N5bWJvbCIsICJjYW5vbmljYWwiLCAiYWxpYXNlcyIsICJhbGlhcyIsICJ0cmlnZ2VyQ2Fub25pY2FsTmFtZXMiLCAibm9ybWFsaXplVHJpZ2dlck5hbWUiLCAidHJpZ2dlciIsICJ0cmlnZ2VyTmFtZXNPZiIsICJleHBhbmRUcmlnZ2VyRmlsdGVyIiwgInR5cGVzIiwgIm5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIiLCAidHJpZ2dlcnMiLCAibGlzdCIsICJ0cmlnZ2VyRmlsdGVyQWxsb3dzIiwgImZpbHRlciIsICJpc09wdGlvbnNPYmplY3QiLCAibm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zIiwgImFmZmVjdFR5cGVzIiwgIlN1YnNjcmlwdFN5bWJvbCIsICIjc291cmNlIiwgIiNsaXN0ZW5lcnMiLCAiI2ZsYWdzIiwgIiNuYXRpdmUiLCAiI2l0ZXJhdG9yIiwgIiNpbkRpc3BhdGNoIiwgIiNkaXNhYmxlZFRyaWdnZXJzIiwgIiN0cmlnZ2VyQ29udHJvbCIsICIjcGVuZGluZyIsICIjcGVuZGluZ0J5UHJvcCIsICIjZmx1c2hTY2hlZHVsZWQiLCAiZW5hYmxlZCIsICIjZGlzcGF0Y2giLCAiY29udHJvbGxlciIsICJyZXMiLCAib2xkVmFsdWUiLCAiZXRjIiwgImxpc3RlbmVycyIsICJyZWNvcmQiLCAiZXZlbnQiLCAibnciLCAibmFtZXMiLCAicHJldmlvdXMiLCAicmVzdG9yZSIsICJ3YXNEaXNhYmxlZCIsICJyZXN1bHQiLCAib3BLZXkiLCAiYnlPcCIsICJiYXRjaCIsICJvcE1hcCIsICJubSIsICJ2IiwgIm92IiwgInRnIiwgInJlc3QiLCAicmF3T2YiLCAidW53cmFwcGVkIiwgInJlc29sdmVkIiwgIm1vZGUiLCAicmF3IiwgIm1ha2VSZXNvbHZlZE9wIiwgImVtaXQiLCAicnVuIiwgInBlbmRpbmciLCAia2V5IiwgImNhbGxiYWNrT3JWYWx1ZSIsICJlbWl0UmVzb2x2ZWQiLCAiYmluZEV4aXN0aW5nVGhlbmFibGVzIiwgImxpdmUiLCAiX19zYWZlR2V0R3VhcmRTeW1ib2wiLCAicmVhY3RpdmVQcm9wZXJ0aWVzU3ltYm9sIiwgInJlYWN0aXZlUHJvcGVydGllcyIsICJtYXJrUmVhY3RpdmVQcm9wZXJ0eSIsICJpc1JlYWN0aXZlUHJvcGVydHkiLCAibm90aWZ5UmVhY3RpdmVQcm9wZXJ0eSIsICJyZWNlaXZlciIsICJvd25lciIsICJuZXdWYWx1ZSIsICJ0cmlnZ2VyTmFtZSIsICJ0cmlnZ2VyS2V5T2YiLCAic2FmZUdldCIsICJkZWZpbmVSZWFjdGl2ZVByb3BlcnR5IiwgImRlc2NyaXB0b3IiLCAiaW5pdGlhbFZhbHVlIiwgInZhbHVlcyIsICJsYXN0QXNzaWduZWQiLCAicHJvcGVydHlEZXNjIiwgImFjdHVhbFZhbHVlIiwgIl9fc3lzdGVtU2tpcCIsICJzeXN0ZW1Ta2lwR2V0IiwgImdvdCIsICJfX3NhZmVHZXRHdWFyZCIsICJpc0dldHRlciIsICJwcm9wTmFtZSIsICJmYWxsVGhyb3VnaCIsICJ0bXAiLCAic2FmZVNldCIsICJhY3RpdmUiLCAicmVjIiwgImhhc093biIsICJpc1RyaWdnZXJFbWl0T3B0aW9ucyIsICJhbGxvd1ZhbHVlT25seSIsICJ0cmlnZ2VyT3B0aW9uVmFsdWUiLCAiZmFsbGJhY2siLCAidHJpZ2dlck9wdGlvblRyaWdnZXIiLCAiaXNSdW50aW1lS2V5IiwgInJlYWxQcm9wT2YkMSIsICJ0cmlnZ2VyVmFsdWVPZiIsICJyZWFsUHJvcCIsICJjcmVhdGVUcmlnZ2VyQVBJIiwgImFwaSIsICJvcE9yT3B0aW9ucyIsICJjb250cm9sIiwgInN5c3RlbUdldCIsICJhZmZlY3RlZCIsICJvYnNlcnZhYmxlQVBJTWV0aG9kcyIsICJ1c3ViIiwgImNvbXAiLCAiT2JzZXJ2ZUFycmF5TWV0aG9kIiwgIiNuYW1lIiwgIiNzZWxmIiwgIiNoYW5kbGUiLCAic2VsZiIsICJza2lwIiwgImFkZGVkIiwgInNldFBhaXJzIiwgIm9sZFN0YXRlIiwgIm9ic2VydmVBcnJheSIsICJyZWciLCAiSSIsICJwYWlyIiwgInRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlIiwgIm9sZExlbiIsICJuZXdMZW4iLCAicmVtb3ZlZEl0ZW1zIiwgImFkZGVkQ291bnQiLCAiT2JzZXJ2ZUFycmF5SGFuZGxlciIsICJzeXMiLCAib2JzIiwgIm9sZCIsICJ4eXp3IiwgInJnYmEiLCAieHl6d19pZHgiLCAicmdiYV9pZHgiLCAiT2JzZXJ2ZU9iamVjdEhhbmRsZXIiLCAiaGludCIsICJmdCIsICIkb3JpZ2luYWwiLCAic3Vic2NyaXB0IiwgIiRyZXN1bHQiLCAiT2JzZXJ2ZU1hcEhhbmRsZXIiLCAidmFsdWVPckZ4IiwgIm9sZFZhbHVlcyIsICJoYWQiLCAiY29tcHV0ZWQiLCAiZGVmYXVsdE9yQ29tcHV0ZSIsICJpbmNvbWluZyIsICJPYnNlcnZlU2V0SGFuZGxlciIsICIkaXNPYnNlcnZhYmxlIiwgIm1ha2VSZWFjdGl2ZVByb3BlcnRpZXMiLCAiZW50cmllcyIsICJvYnNlcnZlT2JqZWN0IiwgIm9ic2VydmVNYXAiLCAibWFwIiwgIm9ic2VydmVTZXQiLCAic2V0IiwgIm51bWJlclJlZiIsICJpbml0aWFsIiwgImJlaGF2aW9yIiwgIiRyIiwgIm9ic2VydmUiLCAic3RyaW5nUmVmIiwgImJvb2xlYW5SZWYiLCAid3JhcFJlZiIsICJtYXJrUmVhbFByb3AiLCAicHJvcFJlZiIsICJzcmMiLCAic3JjUHJvcCIsICJpc01hcCIsICJpc1NldCIsICJyZWFkU2xvdCIsICJ3cml0ZVNsb3QiLCAibWVtYmVyIiwgImlzT2JzZXJ2YWJsZSIsICJyZWNvdmVyUmVhY3RpdmUiLCAic2xvdCIsICJ1c2IiLCAiX3Byb3AiLCAicHJldiIsICIkcmVmIiwgInR5cGVkIiwgInJlZiIsICJwcm9taXNlZCIsICJwcm9taXNlIiwgInRyaWdnZXJXaXRoRGVsYXkiLCAiZGVsYXkiLCAiZGVsYXllZEJlaGF2aW9yIiwgInNpZyIsICJ0bSIsICJkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IiLCAic3RhdGVOYW1lIiwgInJlYWN0aXZlIiwgInVzZU9ic2VydmFibGUiLCAib2JzZXJ2YWJsZSIsICJzcGVjaWFsaXplZFN1YnNjcmliZSIsICJjaGVja1ZhbGlkT2JqIiwgImluaXRpYWxUcmlnZ2VyIiwgInJlYWxQcm9wT2YiLCAibm9ybWFsaXplQWZmZWN0ZWRQcm9wIiwgInByb3BWYWx1ZU9mIiwgImNhbGxCeVByb3BSZWZBd2FyZSIsICJ3aXRoVHJpZ2dlciIsICJzdWJzY3JpYmVEaXJlY3RseSIsICJ0UHJvcCIsICJpbml0aWFsQ2IiLCAidW5TdWIiLCAic3Vic2NyaWJlSW5wdXQiLCAiJG9wdCIsICIkY2IiLCAiZXYiLCAiY2hlY2tJc1BhaXJlZCIsICJpc0VmZmVjdE9wdGlvbnNBcmciLCAibm9ybWFsaXplRWZmZWN0VGFyZ2V0cyIsICJ0YXJnZXRzIiwgImVmZmVjdFRhcmdldENvbnRleHQiLCAidG9FZmZlY3RFdmVudCIsICJzdWJzY3JpYmVQYWlyZWQiLCAic3Vic2NyaWJlVGhlbmFibGUiLCAiZWZmZWN0IiwgImFmZmVjdGVkT3B0aW9ucyIsICJkaXNwb3NlcnMiLCAiZGlzcG9zZSIsICJlZmZlY3RlZCIsICJtYWtlQXJyYXlPYnNlcnZhYmxlIiwgIm9ic2VydmFibGVCeVNldCIsICJvYnNlcnZhYmxlQnlNYXAiLCAiRG91YmxlV2Vha01hcCIsICIjdG9wIiwgIiNlbnN1cmVJbm5lciIsICJrZXkxIiwgImlubmVyIiwgIiNzcGxpdFBhaXIiLCAia2V5MiIsICJmYWN0b3J5IiwgImNvbXB1dGUiLCAicmVnaXN0ZXJlZEl0ZXJhdGVkIiwgIml0ZXJhdGVkIiwgIiRzdWIiLCAiYmFzaXMiLCAib2ZPbGQiLCAib2ZOZXciLCAiaXNQYWlyIiwgImJpbmRCeSIsICJ3YXRjaCIsICJwIiwgIk4iLCAiayIsICJkZXJpdmF0ZSIsICJmcm9tIiwgInJlYWN0Rm4iLCAiYmluZEJ5S2V5IiwgImNvbmRpdGlvbmFsSW5kZXgiLCAiY29uZExpc3QiLCAicmVhZENvbmRpdGlvbiIsICJjb25kaXRpb24iLCAiaW52YWxpZGF0ZSIsICJjb25kaXRpb25hbFJlZiIsICJjb25kIiwgImlmVHJ1ZSIsICJpZkZhbHNlIiwgImdldFRydWUiLCAiZ2V0RmFsc2UiLCAidmFsdWVPZiIsICJuIiwgImNvbmRpdGlvbmFsIiwgInJlbWFwIiwgInN1YiIsICJkZXN0IiwgInVuaWZpZWQiLCAic3VicyIsICJpbml0aWFsRW50cmllcyIsICJhc3NpZ25NYXAiLCAiYXNzaWduIiwgImEiLCAiYiIsICJpc0FDb21wdXRlIiwgImlzQkNvbXB1dGUiLCAiY21wQkZuYyIsICJpc0FQcm9wIiwgImFfcHJvcCIsICJpc0JQcm9wIiwgImJfcHJvcCIsICJhX3RtcCIsICJhUmVmIiwgImJfdG1wIiwgImJSZWYiLCAiY21wZngiLCAibnYiLCAic3RvcmUiLCAibGluayIsICJjIiwgIm9sZEFyZyIsICJjbXAiLCAiYXJnIiwgImZvcmNlIiwgIndycEZ1bmMiLCAib2xkQXJnJCIsICJvcCIsICJyZiIsICJwZW5kaW5nSW5pdGlhbCIsICIkYXBwbHkiLCAiY3AiLCAid3JpdGVDb21wdXRlZCIsICJkZWxheWVkU3Vic2NyaWJlIl0KfQo=
