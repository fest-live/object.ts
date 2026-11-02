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
      const y = [...o, ...f];
      return u(y), y.length;
    },
    splice: (i, f, ...o) => {
      const y = l(), a = Math.min(Math.max(i, 0), y.length), v = f === void 0 ? y.length - a : Math.max(0, Math.min(f, y.length - a)), m = y.splice(a, v);
      let b = a;
      for (const O of o) {
        if (y.includes(O)) {
          n(O, "splice", b);
          continue;
        }
        y.splice(b++, 0, O);
      }
      return u(y), m;
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
        const y = Math.floor(o);
        if (y >= r.size) return !0;
        const a = l().slice(0, y);
        return u(a), !0;
      }
      if (ee(f)) {
        const y = l(), a = Number(f);
        if (a > y.length) return !0;
        const v = o;
        if (a < y.length) {
          const m = y[a];
          if (Object.is(m, v)) return !0;
          if (y.some((b, O) => O !== a && Object.is(b, v)))
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
      if (ee(f)) {
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
      if (ee(f)) {
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
      for (const [o, y] of f)
        if (!(o != null && this.#i.has(o))) {
          o != null && this.#i.add(o);
          try {
            for (const [, a] of y) {
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
  (c(e, it) ?? A)(n, l) && u?.trigger?.(s, l, n), k(l) && Y(e, s, l, n);
}
function Z(e, t) {
  const r = Reflect.getOwnPropertyDescriptor(e, t);
  if (!r || !r.configurable || "value" in r && r.writable === !1) return !1;
  if (bt(e, t)) return !0;
  if ("value" in r) {
    const u = r.value, s = /* @__PURE__ */ new WeakMap();
    s.set(e, u);
    const i = Reflect.defineProperty(e, t, {
      enumerable: r.enumerable,
      configurable: !0,
      get() {
        return s.has(this) ? s.get(this) : u;
      },
      set(f) {
        const o = s.has(this) ? s.get(this) : u;
        s.set(this, f), et(this, e, t, o, f);
      }
    });
    return i && Le(e, t), i;
  }
  if (!r.set) return !1;
  const n = /* @__PURE__ */ new WeakMap(), l = Reflect.defineProperty(e, t, {
    ...r,
    configurable: !0,
    enumerable: r.enumerable,
    get: r.get ? function() {
      return r.get.call(this);
    } : n.get(this),
    set: function(u) {
      const s = r.get ? r.get.call(this) : n.get(this);
      r.set.call(this, u);
      const i = r.get ? r.get.call(this) : u;
      r.get || n.set(this, i), et(this, e, t, s, i);
    }
  });
  return l && Le(e, t), l;
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
  const r = c(e, t);
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
  const r = c(e, t);
  if (r == null && t != "value") {
    const n = c(e, "value");
    return n != null && !T(n) ? H(n, t) : r;
  } else if (t == "value" && r != null && !T(r) && typeof r != "function") return H(r, t) ?? r ?? e;
  return r ?? e;
}, Nt = (e, t, r) => {
  if (e == null) return !1;
  let n = __safeSetGuard?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  return n?.has?.(t) ? !1 : (n?.add?.(t), Reflect.set(e, t, r));
}, c = (e, t, r) => {
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
  const t = c(e, de) ?? c(e, "realProp");
  return Dt(t) ? t : null;
}, $e = (e, t) => t == "value" ? ve(e) ?? t : t, Bt = (e, t) => {
  const r = ve(e);
  return r != null && t == r ? c(e, "value") ?? c(e, d) ?? c(e, t) : t == null ? void 0 : c(e, t);
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
  ].indexOf(t) < 0 ? c(e, t)?.bind?.(e) : null) != null) return null;
  if ([w, D].indexOf(t) >= 0) return c(e, t) ?? e;
  if (t == d) return c(e, t) ?? c(e, "value");
  if (t == ie) return r;
  if (t == lt || t == "resolved" && !Object.prototype.hasOwnProperty.call(e, "resolved")) return pt(e);
  if (t == Ot) return r?.triggerControl;
  if (t == Symbol.observable) return r?.compatible;
  if (t == Symbol.subscribe) return (n, l, u) => g(l != null ? [e, l] : e, n, u);
  if (t == Symbol.iterator || t == Symbol.asyncIterator) return c(e, t);
  if (t == Symbol.dispose) return (n) => {
    c(e, Symbol.dispose)?.(n), Ee(n != null ? [e, n] : e);
  };
  if (t == Symbol.asyncDispose) return (n) => {
    c(e, Symbol.asyncDispose)?.(n), Ee(n != null ? [e, n] : e);
  };
  if (t == Symbol.unsubscribe) return (n) => Ee(n != null ? [e, n] : e);
  if (typeof t == "symbol" && (t in e || c(e, t) != null)) return c(e, t);
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
        for (let y = 0; y < Math.max(s.length, this.#e.length); y++) {
          const a = s[y], v = this.#e[y];
          v === void 0 && y >= this.#e.length ? l.push(a) : a === void 0 && y >= s.length ? u.push([
            y,
            v,
            void 0,
            !1
          ]) : A(a, v) && u.push([
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
        for (let y = 0; y < s.length; y++) A(s[y], this.#e[y]) && u.push([
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
    const o = S.get(this.#e);
    return n?.length == 1 ? o?.trigger?.(i, n[0], null, "add") : n?.length > 1 && (o?.trigger?.(i, n, null, "addAll"), n.forEach((y, a) => o?.trigger?.(i + a, y, null, "add"))), u?.length == 1 ? o?.trigger?.(u[0]?.[0] ?? i, u[0]?.[1], u[0]?.[2], u[0]?.[3] === !1 ? "add" : "set") : u?.length > 1 && (o?.trigger?.(i, u, s, "setAll"), u.forEach((y, a) => o?.trigger?.(y?.[0] ?? i + a, y?.[1], y?.[2], y?.[3] === !1 ? "add" : "set"))), l?.length == 1 ? o?.trigger?.(i, null, l[0], "delete") : l?.length > 1 && (o?.trigger?.(i, null, l, "deleteAll"), l.forEach((y, a) => o?.trigger?.(i + a, null, y, "delete"))), f == e ? new Proxy(f, this.#t) : Array.isArray(f) ? _e(f) : f;
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
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? c(e, t)?.bind?.(e) : c(e, t);
    const l = S?.get?.(e), u = Ae(e, t, l);
    if (u != null) return u;
    const s = Oe(e, t, l);
    if (s != null) return s;
    if (t == Se) return be.call(this, this);
    if (t == $) return we(l, (f) => {
      const o = f.key ?? f.name ?? 0, y = G(f, "value", () => c(e, o)), a = G(f, "oldValue", () => {
      });
      return l?.trigger?.(o, y, a, ge(f, "manual"));
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
    const i = c(e, t) ?? (t == "value" ? c(e, d) : null);
    return typeof i == "function" ? new Proxy(typeof i == "function" ? i?.bind?.(e) : i, new Kt(t, e, this)) : i;
  }
  set(e, t, r) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h && r)
      return this[h] = !!r, !0;
    if (t == h && !r)
      return delete this[h], !0;
    const n = k(r);
    return Ve(r, (l) => {
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
      return f >= 0 ? y = Reflect.set(e, f, l) : o >= 0 ? y = Reflect.set(e, o, l) : y = Reflect.set(e, t, l), t == "length" && A(u, l) && jt(this, e, u, l), !this[h] && typeof t != "symbol" && (A(u, l) && S?.get?.(e)?.trigger?.(t, l, u, "set"), n && Y(e, t, l, u)), y;
    });
  }
  deleteProperty(e, t) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h)
      return delete this[h], !0;
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
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
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? U(e, c(e, t)) : c(e, t);
    const n = S.get(e) ?? S.get(c(e, "value") ?? e), l = Ae(e, t, n);
    if (l != null) return l;
    c(e, t) == null && t != "value" && W(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const u = Oe(e, t, n);
    return u ?? (t == Se ? be.call(this, this) : t == $ ? we(n, (s) => {
      const i = $e(e, s.key ?? s.name ?? ve(e) ?? "value"), f = G(s, "oldValue", () => i == "value" || i == ve(e) ? c(e, d) : void 0), o = G(s, "value", () => Bt(e, i));
      return n?.trigger?.(i, o, f, ge(s, "manual"));
    }, e) : t == Symbol.toPrimitive ? (s) => {
      const i = H(e, t);
      return c(i, t) ? c(i, t)?.(s) : T(i) ? C(i, s) : T(c(i, "value")) ? C(c(i, "value"), s) : C(c(i, "value") ?? i, s);
    } : t == Symbol.toStringTag ? () => {
      const s = H(e, t);
      return c(s, t) ? c(s, t)?.() : T(s) ? String(s ?? "") || "" : T(c(s, "value")) ? String(c(s, "value") ?? "") || "" : String(c(s, "value") ?? s ?? "") || "";
    } : t == "toString" ? () => {
      const s = H(e, t);
      return c(s, t) ? c(s, t)?.() : c(s, Symbol.toStringTag) ? c(s, Symbol.toStringTag)?.() : T(s) ? String(s ?? "") || "" : T(c(s, "value")) ? String(c(s, "value") ?? "") || "" : String(c(s, "value") ?? s ?? "") || "";
    } : t == "valueOf" ? () => {
      const s = H(e, t);
      return c(s, t) ? c(s, t)?.() : c(s, Symbol.toPrimitive) ? c(s, Symbol.toPrimitive)?.() : T(s) ? s : T(c(s, "value")) ? c(s, "value") : c(s, "value") ?? s;
    } : typeof t == "symbol" && (t in e || c(e, t) != null) ? c(e, t) : H(e, t));
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
      if (c(e, t) == null && t != "value" && W(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), typeof t == "symbol" && !(c(e, t) != null && t in e)) return;
      const i = $e(e, t), f = t == "value" ? c(e, d) ?? c(e, t) : c(e, t);
      e[t] = l;
      const o = c(e, t) ?? l;
      if (!this[h] && typeof t != "symbol" && !bt(s, t)) {
        const y = S.get(e) ?? S.get(s);
        (c(e, it) ?? A)?.(f, o) && y?.trigger?.(i, l, f), k(r) && Y(s, i, l, f);
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
    if (c(e, t) == null && t != "value" && W(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), r.get == null && r.set == null) return Reflect.defineProperty(e, t, r);
    const l = c(e, t), u = Reflect.defineProperty(e, t, {
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
    c(e, t) == null && t != "value" && W(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
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
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? U(e, c(e, t)) : c(e, t);
    const n = S.get(e), l = Ae(e, t, n);
    if (l != null) return l;
    const u = Oe(e, t, n);
    if (u != null) return u;
    e = c(e, w) ?? c(e, D) ?? e;
    const s = U(e, c(e, t));
    if (typeof t == "symbol" && (t in e || c(e, t) != null)) return s;
    if (t == Se) return be.call(this, this);
    if (t == $) return we(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = G(i, "value", () => e.get(f));
      if (o == null && !z(i, "value")) return;
      const y = G(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, ge(i, "manual"));
    }, e);
    if (t == "clear") return () => {
      const i = Array.from(e?.entries?.() || []), f = s();
      return i.forEach(([o, y]) => {
        this[h] || S.get(e)?.trigger?.(o, null, y, "delete");
      }), f;
    };
    if (t == "delete") return (i, f = null) => {
      const o = e.has(i), y = e.get(i), a = s(i);
      return !this[h] && o && S.get(e)?.trigger?.(i, null, y, "delete"), a;
    };
    if (t == "set") return (i, f) => qe(f, (o) => {
      const y = e.has(i), a = e.get(i), v = s(i, o);
      return this[h] || ((!y || A(a, o)) && S.get(e)?.trigger?.(i, o, y ? a : null, y ? "set" : "add"), k(f) && Y(e, i, o, a)), v;
    });
    if (t == "getOrInsert" || t == "getOrInsertComputed") {
      const i = t == "getOrInsertComputed";
      return (f, o) => {
        if (e.has(f)) return e.get(f);
        const y = i && typeof o == "function" ? o(f) : o;
        return qe(y, (a) => {
          const v = typeof e.getOrInsert == "function" ? e.getOrInsert(f, a) : (e.set(f, a), e.get(f));
          return this[h] || (S.get(e)?.trigger?.(f, a, null, "add"), k(y) && Y(e, f, a, null)), v;
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
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? U(e, c(e, t)) : c(e, t);
    const n = S.get(e), l = Ae(e, t, n);
    if (l != null) return l;
    const u = Oe(e, t, n);
    if (u != null) return u;
    e = c(e, w) ?? c(e, D) ?? e;
    const s = U(e, c(e, t));
    return typeof t == "symbol" && (t in e || c(e, t) != null) ? s : t == Se ? be.call(this, this) : t == $ ? we(n, (i) => {
      const f = i.key ?? i.name;
      if (f == null) return;
      const o = G(i, "value", () => e.has(f)), y = G(i, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, ge(i, "manual"));
    }, e) : t == "clear" ? () => {
      const i = Array.from(e?.values?.() || []), f = s();
      return i.forEach((o) => {
        this[h] || S.get(e)?.trigger?.(null, null, o, "delete");
      }), f;
    } : t == "delete" ? (i) => {
      const f = e.has(i), o = f ? i : null, y = s(i);
      return !this[h] && f && S.get(e)?.trigger?.(i, null, o, "delete"), y;
    } : t == "add" ? (i) => Ve(i, (f) => {
      const o = e.has(f), y = o ? f : null, a = s(f);
      return this[h] || (o || S.get(e)?.trigger?.(f, f, y, "add"), k(i) && Y(e, f, f, y)), a;
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
  const y = g(e, (a, v, m, b) => {
    if (v != t || o[xe]) return;
    const O = u ? s() : a, I = o[d];
    o[d] = O, o[$]?.({
      key: "value",
      value: O,
      oldValue: m ?? I,
      trigger: b ?? "set"
    });
  });
  return E(o, Symbol.dispose, y), o;
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
    return g(i.target, i.prop, (f, o, y, a, ...v) => e(or(i.source, i.target, f, o, y, a ?? null, v)), l);
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
      if (f) for (const [y, a] of f) {
        const v = a ?? (s?.value ?? s)?.[y] ?? null, m = o?.[y];
        v == null && m != null ? t(m, y, null, "add") : v != null && m == null ? t(null, y, v, "delete") : A(v, m) && t(m, y, v, "set");
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
    const o = i?.[d], y = s();
    i[d] = y, i?.[$]?.({
      key: "value",
      value: y,
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
  const y = (p, M) => {
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
    compute: y,
    dispose: a,
    cmpfx: u
  };
  const O = m?.deref?.(), I = v?.deref?.();
  return m instanceof WeakRef && (F?.get?.(O)?.get?.(i)?.bound != I && F?.get?.(O)?.delete?.(i), b = F?.getOrInsert?.(O, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(i, () => ({
    bound: I,
    cmpfx: u,
    unsub: null,
    compute: y,
    dispose: a
  })), b.unsub = g(t, y), b.cmpfx = u, E(O, Symbol.dispose, b?.dispose), E(I, Symbol.dispose, b?.dispose)), I && !Array.isArray(I) && oe(O, () => {
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
  }, y = (p, M = "value", x, _) => {
    if (f = x ?? f, p ??= e?.[0]?.[s], A(f, p) && p != null || i == null) {
      let B = t?.(p, s, f, _);
      return f = p, (A(B, i) || i == null) && (b[M] = i = B, i = b[M]), B;
    }
    return b[M];
  }, a = o(e[0][s] ?? f), v = k(a), m = /* @__PURE__ */ Symbol.for("@@apply");
  Object.defineProperty(y, V, {
    value: a,
    writable: !0
  }), Object.defineProperty(y, d, {
    value: a,
    writable: !0
  }), Object.defineProperty(y, q, {
    value: r,
    writable: !0
  }), Object.defineProperty(y, Symbol?.toStringTag, {
    value: String(y[d] ?? "") || "",
    writable: !1
  }), Object.defineProperty(y, Symbol?.toPrimitive, {
    value: C(y[d], "number"),
    writable: !1
  }), Object.defineProperty(y, "value", {
    enumerable: !0,
    get: function() {
      const p = o();
      return p != null && (y[d] = p), y[d];
    },
    set: function(p) {
      y[d] = o(p, !0);
    }
  }), Object.defineProperty(y, m, {
    value: (p) => (p == null || (b.value = p), b?.value),
    writable: !1
  });
  const b = P(y), O = (p, M) => {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsib2JqZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsICR0cmlnZ2VyTG9jayBhcyAkdHJpZ2dlckxvY2skMSwgUHJvbWlzZWQsIGJpbmRDdHgsIGNhbGxCeUFsbFByb3AsIGNhbGxCeVByb3AsIGRlZmF1bHRCeVR5cGUsIGhhc1ZhbHVlLCBpc0FycmF5SW52YWxpZEtleSwgaXNLZXlUeXBlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBtYWtlVHJpZ2dlckxlc3MsIG9iamVjdEFzc2lnbiwgb2JqZWN0QXNzaWduTm90RXF1YWwsIHBvdGVudGlhbGx5QXN5bmMsIHBvdGVudGlhbGx5QXN5bmNNYXAsIHJlc29sdmVkIGFzIHJlc29sdmVkJDEsIHRyeVBhcnNlQnlIaW50IH0gZnJvbSBcIkBmZXN0LWxpYi9jb3JlXCI7XG5cbi8vI3JlZ2lvbiBzcmMvd3JhcC9TeW1ib2wudHNcblN5bWJvbC5vYnNlcnZhYmxlIHx8PSBTeW1ib2wuZm9yKFwib2JzZXJ2YWJsZVwiKTtcblN5bWJvbC5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJzdWJzY3JpYmVcIik7XG5TeW1ib2wudW5zdWJzY3JpYmUgfHw9IFN5bWJvbC5mb3IoXCJ1bnN1YnNjcmliZVwiKTtcbnZhciAkdmFsdWUgPSBTeW1ib2wuZm9yKFwiQHZhbHVlXCIpO1xudmFyICRleHRyYWN0S2V5JCA9IFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKTtcbnZhciAkb3JpZ2luYWxLZXkkID0gU3ltYm9sLmZvcihcIkBvcmlnaW5cIik7XG52YXIgJHJlZ2lzdHJ5S2V5JCA9IFN5bWJvbC5mb3IoXCJAcmVnaXN0cnlcIik7XG52YXIgJGJlaGF2aW9yID0gU3ltYm9sLmZvcihcIkBiZWhhdmlvclwiKTtcbnZhciAkcHJvbWlzZSA9IFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKTtcbnZhciAkcmVzb2x2ZWQgPSBTeW1ib2wuZm9yKFwiQHJlc29sdmVkXCIpO1xudmFyICR0cmlnZ2VyTGVzcyA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sZXNzXCIpO1xudmFyICR0cmlnZ2VyTG9jayA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sb2NrXCIpO1xudmFyICR0cmlnZ2VyQ29udHJvbCA9IFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpO1xudmFyICR0cmlnZ2VyID0gU3ltYm9sLmZvcihcIkB0cmlnZ2VyXCIpO1xudmFyICRhZmZlY3RlZCA9IFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpO1xudmFyICRpc05vdEVxdWFsID0gU3ltYm9sLmZvcihcIkBpc05vdEVxdWFsXCIpO1xudmFyICRyZWFsUHJvcCA9IFN5bWJvbC5mb3IoXCJAcmVhbFByb3BcIik7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy93cmFwL1V0aWxzLnRzXG52YXIgJG9yaWdpbmFsT2JqZWN0cyQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzYWZlID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldCwgbWFwcGVkID0gKGUpID0+IHNhZmUoZSk7XG5cdGlmIChBcnJheS5pc0FycmF5KHVud3JhcCkpIHJldHVybiB1bndyYXA/Lm1hcD8uKG1hcHBlZCkgfHwgQXJyYXkuZnJvbSh1bndyYXAgfHwgW10pPy5tYXA/LihtYXBwZWQpIHx8IFtdO1xuXHRlbHNlIGlmICh1bndyYXAgaW5zdGFuY2VvZiBNYXAgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha01hcCkgcmV0dXJuIG5ldyBNYXAoQXJyYXkuZnJvbSh1bndyYXA/LmVudHJpZXM/LigpIHx8IFtdKT8ubWFwPy4oKFtLLCBWXSkgPT4gW0ssIHNhZmUoVildKSk7XG5cdGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrU2V0KSByZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKHVud3JhcD8udmFsdWVzPy4oKSB8fCBbXSk/Lm1hcD8uKG1hcHBlZCkpO1xuXHRlbHNlIGlmICh1bndyYXAgIT0gbnVsbCAmJiB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyh1bndyYXAgfHwge30pIHx8IFtdKT8uZmlsdGVyPy4oKFtLXSkgPT4gSyAhPSAkZXh0cmFjdEtleSQgJiYgSyAhPSAkb3JpZ2luYWxLZXkkICYmIEsgIT0gJHJlZ2lzdHJ5S2V5JCk/Lm1hcD8uKChbSywgVl0pID0+IFtLLCBzYWZlKFYpXSkpO1xuXHRyZXR1cm4gdW53cmFwO1xufTtcbnZhciB1bndyYXAgPSAoYXJyKSA9PiB7XG5cdHJldHVybiBhcnI/LlskZXh0cmFjdEtleSRdID8/IGFycj8uW1wiQHRhcmdldFwiXSA/PyBhcnI7XG59O1xudmFyIGRlcmVmID0gKHRhcmdldCwgZGlzY291bnRWYWx1ZSA9IGZhbHNlKSA9PiB7XG5cdGNvbnN0IG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRpZiAoaXNQcmltaXRpdmUodGFyZ2V0KSB8fCB0eXBlb2YgdGFyZ2V0ID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0IGluc3RhbmNlb2YgV2Vha1JlZiB8fCBcImRlcmVmXCIgaW4gdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQ/LmRlcmVmID09IFwiZnVuY3Rpb25cIikpIHRhcmdldCA9IHRhcmdldD8uZGVyZWY/LigpO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwgJiYgKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHR0YXJnZXQgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRjb25zdCAkdmFsID0gZGlzY291bnRWYWx1ZSAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHRhcmdldD8udmFsdWU7XG5cdFx0aWYgKCR2YWwgIT0gbnVsbCAmJiAodHlwZW9mICR2YWwgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgJHZhbCA9PSBcImZ1bmN0aW9uXCIpKSB0YXJnZXQgPSAkdmFsO1xuXHRcdGlmIChvcmlnaW5hbCAhPSB0YXJnZXQpIHJldHVybiBkZXJlZih0YXJnZXQsIGRpc2NvdW50VmFsdWUpO1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIGlzVGhlbmFibGUgPSAodmFsKSA9PiB2YWwgIT0gbnVsbCAmJiB0eXBlb2YgdmFsLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbnZhciB3aXRoUHJvbWlzZSA9ICh0YXJnZXQsIGNiKSA9PiB7XG5cdGlmIChpc1ByaW1pdGl2ZSh0YXJnZXQpIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY2I/Lih0YXJnZXQpO1xuXHRpZiAoaXNUaGVuYWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0LnRoZW4oY2IpO1xuXHRpZiAodHlwZW9mIHRhcmdldD8ucmVzb2x2ZWQgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRhcmdldC5yZXNvbHZlZCgpKS50aGVuKGNiKTtcblx0aWYgKHRhcmdldD8ucHJvbWlzZSAmJiBpc1RoZW5hYmxlKHRhcmdldC5wcm9taXNlKSkgcmV0dXJuIHRhcmdldC5wcm9taXNlLnRoZW4oY2IpO1xuXHRpZiAodGFyZ2V0Py5bJHByb21pc2VdICYmIGlzVGhlbmFibGUodGFyZ2V0WyRwcm9taXNlXSkpIHJldHVybiB0YXJnZXRbJHByb21pc2VdLnRoZW4oY2IpO1xuXHRyZXR1cm4gY2I/Lih0YXJnZXQpO1xufTtcbnZhciBkaXNwb3NlTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgZGlzcG9zZVJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChjYWxsc3RhY2spID0+IHtcblx0Y2FsbHN0YWNrPy5mb3JFYWNoPy4oKGNiKSA9PiBjYj8uKCkpO1xufSk7XG5mdW5jdGlvbiBhZGRUb0NhbGxDaGFpbihvYmosIG1ldGhvZEtleSwgY2FsbGJhY2spIHtcblx0aWYgKCFjYWxsYmFjayB8fCB0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBvYmogIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAobWV0aG9kS2V5ID09IFN5bWJvbC5kaXNwb3NlKSB7XG5cdFx0Y29uc3QgY2hhaW5UYXJnZXQgPSBvYmo/LlskZXh0cmFjdEtleSRdID8/IG9iajtcblx0XHRkaXNwb3NlTWFwPy5nZXRPckluc2VydENvbXB1dGVkPy4oY2hhaW5UYXJnZXQsICgpID0+IHtcblx0XHRcdGNvbnN0IENhbGxDaGFpbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0XHRpZiAodHlwZW9mIGNoYWluVGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNoYWluVGFyZ2V0ID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRkaXNwb3NlUmVnaXN0cnkucmVnaXN0ZXIoY2hhaW5UYXJnZXQsIENhbGxDaGFpbik7XG5cdFx0XHRcdGRpc3Bvc2VNYXAuc2V0KGNoYWluVGFyZ2V0LCBDYWxsQ2hhaW4pO1xuXHRcdFx0XHRjaGFpblRhcmdldFtTeW1ib2wuZGlzcG9zZV0gPz89ICgpID0+IENhbGxDaGFpbi5mb3JFYWNoKChjYikgPT4ge1xuXHRcdFx0XHRcdGNiPy4oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQ2FsbENoYWluO1xuXHRcdH0pPy5hZGQ/LihjYWxsYmFjayk7XG5cdH0gZWxzZSBvYmpbbWV0aG9kS2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcblx0XHRjb25zdCBvcmlnaW5hbCA9IG9iaj8uW21ldGhvZEtleV07XG5cdFx0aWYgKHR5cGVvZiBvcmlnaW5hbCA9PSBcImZ1bmN0aW9uXCIpIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHR9O1xufVxudmFyIGlzQXJyYXlJbmRleCA9IChwcm9wKSA9PiB7XG5cdGlmICh0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuXHRpZiAocHJvcCA9PT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBudW0gPSBOdW1iZXIocHJvcCk7XG5cdHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IDAgJiYgU3RyaW5nKG51bSkgPT09IHByb3A7XG59O1xuZnVuY3Rpb24gd3JhcFNldEFzQXJyYXkoc291cmNlID0gW10sIG9wdGlvbnMgPSB7fSkge1xuXHRsZXQgYmFja2luZ1NldCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdGNvbnN0IG5vdGlmeUR1cGxpY2F0ZSA9ICh2YWx1ZSwgdmlhLCBpbmRleCkgPT4ge1xuXHRcdG9wdGlvbnMub25EdXBsaWNhdGU/Lih7XG5cdFx0XHR2YWx1ZSxcblx0XHRcdHZpYSxcblx0XHRcdGluZGV4XG5cdFx0fSk7XG5cdH07XG5cdGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIGJhY2tpbmdTZXQgPSBzb3VyY2U7XG5cdGVsc2UgZm9yIChjb25zdCBpdGVtIG9mIHNvdXJjZSkge1xuXHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwicHVzaFwiKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fVxuXHRjb25zdCBzbmFwc2hvdCA9ICgpID0+IEFycmF5LmZyb20oYmFja2luZ1NldCk7XG5cdGNvbnN0IHJlYnVpbGRGcm9tID0gKGFycikgPT4ge1xuXHRcdGJhY2tpbmdTZXQuY2xlYXIoKTtcblx0XHRmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSBiYWNraW5nU2V0LmFkZChpdGVtKTtcblx0fTtcblx0Y29uc3QgbWV0aG9kcyA9IHtcblx0XHRwdXNoOiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGxldCBzaXplID0gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG5cdFx0XHRcdGlmIChiYWNraW5nU2V0LmhhcyhpdGVtKSkge1xuXHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShpdGVtLCBcInB1c2hcIik7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YmFja2luZ1NldC5hZGQoaXRlbSk7XG5cdFx0XHRcdHNpemUrKztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzaXplO1xuXHRcdH0sXG5cdFx0cG9wOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0aWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdFx0YmFja2luZ1NldC5kZWxldGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0c2hpZnQ6ICgpID0+IHtcblx0XHRcdGNvbnN0IGl0ZXJhdG9yID0gYmFja2luZ1NldC52YWx1ZXMoKS5uZXh0KCk7XG5cdFx0XHRpZiAoaXRlcmF0b3IuZG9uZSkgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGNvbnN0IHZhbHVlID0gaXRlcmF0b3IudmFsdWU7XG5cdFx0XHRiYWNraW5nU2V0LmRlbGV0ZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSxcblx0XHR1bnNoaWZ0OiAoLi4uaXRlbXMpID0+IHtcblx0XHRcdGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm4gYmFja2luZ1NldC5zaXplO1xuXHRcdFx0Y29uc3QgY3VycmVudCA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCB0b1ByZXBlbmQgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoY3VycmVudC5pbmNsdWRlcyhpdGVtKSB8fCB0b1ByZXBlbmQuaW5jbHVkZXMoaXRlbSkpIHtcblx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUoaXRlbSwgXCJ1bnNoaWZ0XCIsIDApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvUHJlcGVuZC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0b1ByZXBlbmQubGVuZ3RoKSByZXR1cm4gY3VycmVudC5sZW5ndGg7XG5cdFx0XHRjb25zdCBuZXh0ID0gWy4uLnRvUHJlcGVuZCwgLi4uY3VycmVudF07XG5cdFx0XHRyZWJ1aWxkRnJvbShuZXh0KTtcblx0XHRcdHJldHVybiBuZXh0Lmxlbmd0aDtcblx0XHR9LFxuXHRcdHNwbGljZTogKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBub3JtYWxpemVkU3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChzdGFydCwgMCksIGFyci5sZW5ndGgpO1xuXHRcdFx0Y29uc3QgYWN0dWFsRGVsZXRlQ291bnQgPSBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gYXJyLmxlbmd0aCAtIG5vcm1hbGl6ZWRTdGFydCA6IE1hdGgubWF4KDAsIE1hdGgubWluKGRlbGV0ZUNvdW50LCBhcnIubGVuZ3RoIC0gbm9ybWFsaXplZFN0YXJ0KSk7XG5cdFx0XHRjb25zdCByZW1vdmVkID0gYXJyLnNwbGljZShub3JtYWxpemVkU3RhcnQsIGFjdHVhbERlbGV0ZUNvdW50KTtcblx0XHRcdGxldCBpbnNlcnRQb3NpdGlvbiA9IG5vcm1hbGl6ZWRTdGFydDtcblx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuXHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKGl0ZW0pKSB7XG5cdFx0XHRcdFx0bm90aWZ5RHVwbGljYXRlKGl0ZW0sIFwic3BsaWNlXCIsIGluc2VydFBvc2l0aW9uKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhcnIuc3BsaWNlKGluc2VydFBvc2l0aW9uKyssIDAsIGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmVidWlsZEZyb20oYXJyKTtcblx0XHRcdHJldHVybiByZW1vdmVkO1xuXHRcdH0sXG5cdFx0aW5jbHVkZXM6ICh2YWx1ZSkgPT4gYmFja2luZ1NldC5oYXModmFsdWUpLFxuXHRcdGluZGV4T2Y6ICh2YWx1ZSkgPT4gc25hcHNob3QoKS5pbmRleE9mKHZhbHVlKSxcblx0XHRjbGVhcjogKCkgPT4ge1xuXHRcdFx0YmFja2luZ1NldC5jbGVhcigpO1xuXHRcdH0sXG5cdFx0ZGVsZXRlOiAodmFsdWUpID0+IGJhY2tpbmdTZXQuZGVsZXRlKHZhbHVlKSxcblx0XHR0b0FycmF5OiAoKSA9PiBzbmFwc2hvdCgpLFxuXHRcdHRvU2V0OiAoKSA9PiBuZXcgU2V0KGJhY2tpbmdTZXQpLFxuXHRcdFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBiYWNraW5nU2V0W1N5bWJvbC5pdGVyYXRvcl0oKVxuXHR9O1xuXHRyZXR1cm4gbmV3IFByb3h5KG1ldGhvZHMsIHtcblx0XHRnZXQ6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHJldHVybiBzbmFwc2hvdCgpW051bWJlcihwcm9wKV07XG5cdFx0XHRjb25zdCB2YWx1ZSA9IG1ldGhvZHNbcHJvcF07XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdHNldDogKF8sIHByb3AsIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiIHx8ICFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJsZW5ndGggbXVzdCBiZSBhIGZpbml0ZSBub24tbmVnYXRpdmUgbnVtYmVyXCIpO1xuXHRcdFx0XHRjb25zdCBuZXh0TGVuZ3RoID0gTWF0aC5mbG9vcih2YWx1ZSk7XG5cdFx0XHRcdGlmIChuZXh0TGVuZ3RoID49IGJhY2tpbmdTZXQuc2l6ZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IGFyciA9IHNuYXBzaG90KCkuc2xpY2UoMCwgbmV4dExlbmd0aCk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXJyYXlJbmRleChwcm9wKSkge1xuXHRcdFx0XHRjb25zdCBhcnIgPSBzbmFwc2hvdCgpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IE51bWJlcihwcm9wKTtcblx0XHRcdFx0aWYgKGluZGV4ID4gYXJyLmxlbmd0aCkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdGNvbnN0IG5leHRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAoaW5kZXggPCBhcnIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFZhbHVlID0gYXJyW2luZGV4XTtcblx0XHRcdFx0XHRpZiAoT2JqZWN0LmlzKGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0aWYgKGFyci5zb21lKChpdGVtLCBpZHgpID0+IGlkeCAhPT0gaW5kZXggJiYgT2JqZWN0LmlzKGl0ZW0sIG5leHRWYWx1ZSkpKSB7XG5cdFx0XHRcdFx0XHRub3RpZnlEdXBsaWNhdGUobmV4dFZhbHVlLCBcInNldFwiLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YXJyW2luZGV4XSA9IG5leHRWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoYXJyLmluY2x1ZGVzKG5leHRWYWx1ZSkpIHtcblx0XHRcdFx0XHRcdG5vdGlmeUR1cGxpY2F0ZShuZXh0VmFsdWUsIFwic2V0XCIsIGluZGV4KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhcnIucHVzaChuZXh0VmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3Quc2V0KG1ldGhvZHMsIHByb3AsIHZhbHVlKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0YXJyLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHJlYnVpbGRGcm9tKGFycik7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRvd25LZXlzOiAoKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gW107XG5cdFx0XHRsZXQgaSA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IF8gb2YgYmFja2luZ1NldCkga2V5cy5wdXNoKFN0cmluZyhpKyspKTtcblx0XHRcdGtleXMucHVzaChcImxlbmd0aFwiKTtcblx0XHRcdHJldHVybiBrZXlzO1xuXHRcdH0sXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAoXywgcHJvcCkgPT4ge1xuXHRcdFx0aWYgKHByb3AgPT09IFwibGVuZ3RoXCIpIHJldHVybiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0dmFsdWU6IGJhY2tpbmdTZXQuc2l6ZVxuXHRcdFx0fTtcblx0XHRcdGlmIChpc0FycmF5SW5kZXgocHJvcCkpIHtcblx0XHRcdFx0Y29uc3QgYXJyID0gc25hcHNob3QoKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBOdW1iZXIocHJvcCk7XG5cdFx0XHRcdGlmIChpbmRleCA+PSBhcnIubGVuZ3RoKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHZhbHVlOiBhcnJbaW5kZXhdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWV0aG9kcywgcHJvcCk7XG5cdFx0fSxcblx0XHRoYXM6IChfLCBwcm9wKSA9PiB7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJsZW5ndGhcIikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAoaXNBcnJheUluZGV4KHByb3ApKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb3ApO1xuXHRcdFx0XHRyZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IGJhY2tpbmdTZXQuc2l6ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9wIGluIG1ldGhvZHM7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3dyYXAvQXNzaWduT2JqZWN0LnRzXG52YXIgQXNzaWduT2JqZWN0SGFuZGxlciA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRhcHBseSh0YXJnZXQsIGN0eCwgYXJncykge1xuXHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRvYmplY3RBc3NpZ24odGFyZ2V0LCB2YWx1ZSwgbmFtZSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIpIHJldHVybiB0YXJnZXQ/LltuYW1lXSA/PyB0YXJnZXQ7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgY3R4KTtcblx0fVxufTtcbnZhciBtYWtlT2JqZWN0QXNzaWduYWJsZSA9IChvYmopID0+IHtcblx0aWYgKG9iaj8uWyRvcmlnaW5hbEtleSRdIHx8ICRvcmlnaW5hbE9iamVjdHMkLmhhcyhvYmopKSByZXR1cm4gb2JqO1xuXHRjb25zdCBweCA9IG5ldyBQcm94eShvYmosIG5ldyBBc3NpZ25PYmplY3RIYW5kbGVyKCkpO1xuXHQkb3JpZ2luYWxPYmplY3RzJC5zZXQocHgsIG9iaik7XG5cdHJldHVybiBweDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1N1YnNjcmlwdC50c1xudmFyIHdpdGhVbnN1YlN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd2l0aFVuc3ViXCIpO1xuZ2xvYmFsVGhpc1t3aXRoVW5zdWJTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB3aXRoVW5zdWIgPSBnbG9iYWxUaGlzW3dpdGhVbnN1YlN5bWJvbF07XG52YXIgY29tcGxldGVXaXRoVW5zdWIgPSAoc3Vic2NyaWJlciwgd2VhaywgaGFuZGxlcikgPT4ge1xuXHRyZXR1cm4gd2l0aFVuc3ViLmdldE9ySW5zZXJ0KHN1YnNjcmliZXIsICgpID0+IHtcblx0XHRjb25zdCByZWdpc3RyeSA9IHdlYWs/LmRlcmVmPy4oKTtcblx0XHRyZWdpc3RyeT8uYWZmZWN0ZWQ/LihoYW5kbGVyKTtcblx0XHRjb25zdCBzYXZDb21wbGV0ZSA9IHN1YnNjcmliZXI/LmNvbXBsZXRlPy5iaW5kPy4oc3Vic2NyaWJlcik7XG5cdFx0Y29uc3QgdW5hZmZlY3RlZCA9ICgpID0+IHtcblx0XHRcdGNvbnN0IHIgPSBzYXZDb21wbGV0ZT8uKCk7XG5cdFx0XHRyZWdpc3RyeT8udW5hZmZlY3RlZD8uKGhhbmRsZXIpO1xuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fTtcblx0XHRzdWJzY3JpYmVyLmNvbXBsZXRlID0gdW5hZmZlY3RlZDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dW5hZmZlY3RlZCxcblx0XHRcdFtTeW1ib2wuZGlzcG9zZV06IHVuYWZmZWN0ZWQsXG5cdFx0XHRbU3ltYm9sLmFzeW5jRGlzcG9zZV06IHVuYWZmZWN0ZWRcblx0XHR9O1xuXHR9KTtcbn07XG52YXIgc3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHN1YnNjcmlwdFJlZ2lzdHJ5XCIpO1xuZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHN1YnNjcmlwdFJlZ2lzdHJ5ID0gZ2xvYmFsVGhpc1tzdWJzY3JpcHRSZWdpc3RyeVN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVyc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAZ2xvYmFsRWZmZWN0TGlzdGVuZXJzXCIpO1xuZ2xvYmFsVGhpc1tnbG9iYWxFZmZlY3RMaXN0ZW5lcnNTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGdsb2JhbEVmZmVjdExpc3RlbmVycyA9IGdsb2JhbFRoaXNbZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sXTtcbnZhciBlZmZlY3RHbG9iYWxseSA9IChjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplRWZmZWN0T3B0aW9ucyhvcHRpb25zKTtcblx0Z2xvYmFsRWZmZWN0TGlzdGVuZXJzLnNldChjYiwgbm9ybWFsaXplZC5hZmZlY3RUeXBlcyk7XG5cdHJldHVybiAoKSA9PiBnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuZGVsZXRlKGNiKTtcbn07XG52YXIgd3JhcHBlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAd3JhcHBlZFwiKTtcbmdsb2JhbFRoaXNbd3JhcHBlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHdyYXBwZWQgPSBnbG9iYWxUaGlzW3dyYXBwZWRTeW1ib2xdO1xudmFyIHJlZ2lzdGVyID0gKHdoYXQsIGhhbmRsZSkgPT4ge1xuXHRjb25zdCB1bndyYXAgPSB3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0O1xuXHRsZXQgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodW53cmFwKTtcblx0aWYgKCFyZWdpc3RyeSkge1xuXHRcdHJlZ2lzdHJ5ID0gbmV3IFN1YnNjcmlwdCh1bndyYXApO1xuXHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LnNldCh1bndyYXAsIHJlZ2lzdHJ5KTtcblx0fSBlbHNlIHJlZ2lzdHJ5LmJpbmRTb3VyY2UodW53cmFwKTtcblx0cmV0dXJuIGhhbmRsZTtcbn07XG52YXIgd3JhcFdpdGggPSAod2hhdCwgaGFuZGxlKSA9PiB7XG5cdHdoYXQgPSBkZXJlZih3aGF0Py5bJGV4dHJhY3RLZXkkXSA/PyB3aGF0KTtcblx0aWYgKHR5cGVvZiB3aGF0ID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2Ygd2hhdCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB3aGF0ID09IFwiZnVuY3Rpb25cIikgfHwgd2hhdCA9PSBudWxsKSByZXR1cm4gd2hhdDtcblx0cmV0dXJuIHdyYXBwZWQuZ2V0T3JJbnNlcnRDb21wdXRlZCh3aGF0LCAoKSA9PiBuZXcgUHJveHkod2hhdCwgcmVnaXN0ZXIod2hhdCwgaGFuZGxlKSkpO1xufTtcbnZhciBmb3JBbGwgPSBTeW1ib2wuZm9yKFwiQGFsbFByb3BzXCIpO1xudmFyIHdpbGRjYXJkVHJpZ2dlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCIqXCIsIFwiYWxsXCJdKTtcbnZhciB0cmlnZ2VyQWxpYXNlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKFtcblx0W1wic2V0XCIsIFtcInNldHRlclwiLCBcIkBzZXRcIl1dLFxuXHRbXCJhZGRcIiwgW1wiQGFkZFwiXV0sXG5cdFtcImRlbGV0ZVwiLCBbXCJAZGVsZXRlXCJdXSxcblx0W1wiaW52YWxpZGF0ZVwiLCBbXCJAaW52YWxpZGF0ZVwiXV0sXG5cdFtcIm1hbnVhbFwiLCBbXCJAbWFudWFsXCJdXSxcblx0W1wiY3VzdG9tXCIsIFtcIkBjdXN0b21cIl1dLFxuXHRbXCJyZXNvbHZlZFwiLCBbXCJAcmVzb2x2ZWRcIl1dLFxuXHRbXCJzZXRBbGxcIiwgW1wiQHNldEFsbFwiXV0sXG5cdFtcImFkZEFsbFwiLCBbXCJAYWRkQWxsXCJdXSxcblx0W1wiZGVsZXRlQWxsXCIsIFtcIkBkZWxldGVBbGxcIiwgXCJAY2xlYXJcIl1dXG5dKTtcbnZhciB0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQHRyaWdnZXJDYW5vbmljYWxOYW1lc1wiKTtcbmdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXSA/Pz0gbmV3IE1hcChBcnJheS5mcm9tKHRyaWdnZXJBbGlhc2VzLmVudHJpZXMoKSkuZmxhdE1hcCgoW2Nhbm9uaWNhbCwgYWxpYXNlc10pID0+IGFsaWFzZXMubWFwKChhbGlhcykgPT4gW2FsaWFzLCBjYW5vbmljYWxdKSkpO1xudmFyIHRyaWdnZXJDYW5vbmljYWxOYW1lcyA9IGdsb2JhbFRoaXNbdHJpZ2dlckNhbm9uaWNhbE5hbWVzU3ltYm9sXTtcbnZhciBub3JtYWxpemVUcmlnZ2VyTmFtZSA9ICh0cmlnZ2VyID0gXCJzZXRcIikgPT4ge1xuXHRpZiAodHJpZ2dlciA9PSBudWxsKSByZXR1cm4gdHJpZ2dlcjtcblx0Y29uc3QgbmFtZSA9IFN0cmluZyh0cmlnZ2VyIHx8IFwic2V0XCIpO1xuXHRyZXR1cm4gdHJpZ2dlckNhbm9uaWNhbE5hbWVzLmdldChuYW1lKSA/PyBuYW1lO1xufTtcbnZhciB0cmlnZ2VyTmFtZXNPZiA9ICh0cmlnZ2VyKSA9PiB7XG5cdGNvbnN0IG5hbWUgPSB0cmlnZ2VyID09IG51bGwgPyBcImFsbFwiIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKHRyaWdnZXIpID8/IFwiYWxsXCIpO1xuXHRyZXR1cm4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV07XG59O1xudmFyIGV4cGFuZFRyaWdnZXJGaWx0ZXIgPSAodHlwZXMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBuZXcgU2V0KFsuLi5ub3JtYWxpemVUcmlnZ2VyRmlsdGVyKHR5cGVzKV0uZmxhdE1hcCgobmFtZSkgPT4gW25hbWUsIC4uLnRyaWdnZXJBbGlhc2VzLmdldChuYW1lKSA/PyBbXV0pKTtcbn07XG52YXIgbm9ybWFsaXplVHJpZ2dlckZpbHRlciA9ICh0cmlnZ2VycyA9IFtcIipcIl0pID0+IHtcblx0Y29uc3QgbGlzdCA9IHR5cGVvZiB0cmlnZ2VycyA9PSBcInN0cmluZ1wiID8gW3RyaWdnZXJzXSA6IEFycmF5LmZyb20odHJpZ2dlcnMgPz8gW1wiKlwiXSk7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBuZXcgU2V0KGxpc3QubWFwKChpdGVtKSA9PiB7XG5cdFx0Y29uc3QgbmFtZSA9IFN0cmluZyhpdGVtIHx8IFwiKlwiKTtcblx0XHRyZXR1cm4gd2lsZGNhcmRUcmlnZ2Vycy5oYXMobmFtZSkgPyBuYW1lIDogU3RyaW5nKG5vcm1hbGl6ZVRyaWdnZXJOYW1lKG5hbWUpID8/IG5hbWUpO1xuXHR9KSk7XG5cdHJldHVybiBub3JtYWxpemVkLnNpemUgPyBub3JtYWxpemVkIDogLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1wiKlwiXSk7XG59O1xudmFyIHRyaWdnZXJGaWx0ZXJBbGxvd3MgPSAodHJpZ2dlcnMsIHRyaWdnZXIpID0+IHtcblx0Y29uc3QgZmlsdGVyID0gdHJpZ2dlcnMgaW5zdGFuY2VvZiBTZXQgPyB0cmlnZ2VycyA6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIodHJpZ2dlcnMpO1xuXHRyZXR1cm4gWy4uLndpbGRjYXJkVHJpZ2dlcnNdLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpIHx8IHRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IGZpbHRlci5oYXMobmFtZSkpO1xufTtcbnZhciBpc09wdGlvbnNPYmplY3QgPSAob3B0aW9ucykgPT4ge1xuXHRyZXR1cm4gISFvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucykgJiYgKFwiYWZmZWN0VHlwZXNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlcnNcIiBpbiBvcHRpb25zIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gb3B0aW9ucyk7XG59O1xudmFyIG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ICE9PSBmYWxzZVxuXHR9O1xuXHRjb25zdCBhZmZlY3RUeXBlcyA9IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyk7XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXMsXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiB0cmlnZ2VyRmlsdGVyQWxsb3dzKGFmZmVjdFR5cGVzLCBcImluaXRpYWxcIilcblx0fTtcbn07XG52YXIgbm9ybWFsaXplRWZmZWN0T3B0aW9ucyA9IChvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRpZiAoaXNPcHRpb25zT2JqZWN0KG9wdGlvbnMpKSByZXR1cm4ge1xuXHRcdGFmZmVjdFR5cGVzOiBub3JtYWxpemVUcmlnZ2VyRmlsdGVyKG9wdGlvbnMuYWZmZWN0VHlwZXMgPz8gb3B0aW9ucy50cmlnZ2VycyA/PyBbXCIqXCJdKSxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG9wdGlvbnMudHJpZ2dlckltbWVkaWF0ZWx5ID09PSB0cnVlXG5cdH07XG5cdHJldHVybiB7XG5cdFx0YWZmZWN0VHlwZXM6IG5vcm1hbGl6ZVRyaWdnZXJGaWx0ZXIob3B0aW9ucyksXG5cdFx0dHJpZ2dlckltbWVkaWF0ZWx5OiBmYWxzZVxuXHR9O1xufTtcbnZhciBTdWJzY3JpcHRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQFN1YnNjcmlwdFwiKTtcbmdsb2JhbFRoaXNbU3Vic2NyaXB0U3ltYm9sXSA/Pz0gY2xhc3MgU3Vic2NyaXB0IHtcblx0Y29tcGF0aWJsZTtcblx0I3NvdXJjZTtcblx0I2xpc3RlbmVycztcblx0I2ZsYWdzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdCNuYXRpdmU7XG5cdCNpdGVyYXRvcjtcblx0I2luRGlzcGF0Y2ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjZGlzYWJsZWRUcmlnZ2VycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdCN0cmlnZ2VyQ29udHJvbDtcblx0I3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQjcGVuZGluZ0J5UHJvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdCNmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuXHRjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcblx0XHR0aGlzLiNzb3VyY2UgPSBzb3VyY2U7XG5cdFx0dGhpcy4jbGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHR0aGlzLiNmbGFncyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRcdHRoaXMuI3RyaWdnZXJDb250cm9sID0ge1xuXHRcdFx0ZW5hYmxlOiAodHlwZXMgPSBbXCIqXCJdLCBjYikgPT4gY2IgPyB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgdHJ1ZSwgY2IpIDogdGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMsIHRydWUpLFxuXHRcdFx0ZGlzYWJsZTogKHR5cGVzID0gW1wiKlwiXSwgY2IpID0+IGNiID8gdGhpcy53aXRoVHJpZ2dlcnModHlwZXMsIGZhbHNlLCBjYikgOiB0aGlzLnNldFRyaWdnZXJzRW5hYmxlZCh0eXBlcywgZmFsc2UpLFxuXHRcdFx0c2V0OiAodHlwZXMsIGVuYWJsZWQpID0+IHRoaXMuc2V0VHJpZ2dlcnNFbmFibGVkKHR5cGVzLCBlbmFibGVkKSxcblx0XHRcdHdpdGg6ICh0eXBlcywgY2IpID0+IHRoaXMud2l0aFRyaWdnZXJzKHR5cGVzLCB0cnVlLCBjYiksXG5cdFx0XHR3aXRob3V0OiAodHlwZXMsIGNiKSA9PiB0aGlzLndpdGhUcmlnZ2Vycyh0eXBlcywgZmFsc2UsIGNiKSxcblx0XHRcdGlzRW5hYmxlZDogKHRyaWdnZXIpID0+IHRoaXMuaXNUcmlnZ2VyRW5hYmxlZCh0cmlnZ2VyKVxuXHRcdH07XG5cdFx0dGhpcy4jaXRlcmF0b3IgPSB7IG5leHQ6IChhcmdzKSA9PiB7XG5cdFx0XHRpZiAoYXJncykgQXJyYXkuaXNBcnJheShhcmdzKSA/IHRoaXMuI2Rpc3BhdGNoKC4uLmFyZ3MpIDogdGhpcy4jZGlzcGF0Y2goYXJncyk7XG5cdFx0fSB9O1xuXHRcdGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZih0aGlzKTtcblx0XHRjb25zdCBjb250cm9sbGVyID0gZnVuY3Rpb24oc3Vic2NyaWJlcikge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IHN1YnNjcmliZXI/Lm5leHQ/LmJpbmQ/LihzdWJzY3JpYmVyKTtcblx0XHRcdHJldHVybiBjb21wbGV0ZVdpdGhVbnN1YihzdWJzY3JpYmVyLCB3ZWFrLCBoYW5kbGVyKTtcblx0XHR9O1xuXHRcdHRoaXMuI25hdGl2ZSA9IHR5cGVvZiBPYnNlcnZhYmxlICE9IFwidW5kZWZpbmVkXCIgPyBuZXcgT2JzZXJ2YWJsZShjb250cm9sbGVyKSA6IG51bGw7XG5cdFx0dGhpcy5jb21wYXRpYmxlID0gKCkgPT4gdGhpcy4jbmF0aXZlO1xuXHR9XG5cdGJpbmRTb3VyY2Uoc291cmNlKSB7XG5cdFx0dGhpcy4jc291cmNlID8/PSBzb3VyY2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0JHNhZmVFeGVjKGNiLCAuLi5hcmdzKSB7XG5cdFx0aWYgKCFjYiB8fCB0aGlzLiNmbGFncy5oYXMoY2IpKSByZXR1cm47XG5cdFx0dGhpcy4jZmxhZ3MuYWRkKGNiKTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcmVzID0gY2IoLi4uYXJncyk7XG5cdFx0XHRpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHJlcy5jYXRjaChjb25zb2xlLndhcm4pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGNvbnNvbGUud2FybihlKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy4jZmxhZ3MuZGVsZXRlKGNiKTtcblx0XHR9XG5cdH1cblx0I2Rpc3BhdGNoKG5hbWUsIHZhbHVlID0gbnVsbCwgb2xkVmFsdWUsIHRyaWdnZXIgPSBcImFsbFwiLCAuLi5ldGMpIHtcblx0XHR0cmlnZ2VyID0gbm9ybWFsaXplVHJpZ2dlck5hbWUodHJpZ2dlcikgPz8gdHJpZ2dlcjtcblx0XHRjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiNsaXN0ZW5lcnM7XG5cdFx0aWYgKGxpc3RlbmVycz8uc2l6ZSkge1xuXHRcdFx0Zm9yIChjb25zdCBbY2IsIHJlY29yZF0gb2YgbGlzdGVuZXJzLmVudHJpZXMoKSkgaWYgKChyZWNvcmQucHJvcCA9PT0gbmFtZSB8fCByZWNvcmQucHJvcCA9PT0gZm9yQWxsIHx8IHJlY29yZC5wcm9wID09PSBudWxsKSAmJiB0cmlnZ2VyRmlsdGVyQWxsb3dzKHJlY29yZC50cmlnZ2VycywgdHJpZ2dlcikpIHRoaXMuJHNhZmVFeGVjKGNiLCB2YWx1ZSwgbmFtZSwgb2xkVmFsdWUsIHRyaWdnZXIsIC4uLmV0Yyk7XG5cdFx0fVxuXHRcdGlmIChnbG9iYWxFZmZlY3RMaXN0ZW5lcnMuc2l6ZSkge1xuXHRcdFx0Y29uc3QgZXZlbnQgPSB7XG5cdFx0XHRcdHNvdXJjZTogdGhpcy4jc291cmNlLFxuXHRcdFx0XHR0YXJnZXQ6IHRoaXMuI3NvdXJjZSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdHByb3A6IG5hbWUsXG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0XHR0cmlnZ2VyLFxuXHRcdFx0XHRhcmdzOiBldGNcblx0XHRcdH07XG5cdFx0XHRmb3IgKGNvbnN0IFtjYiwgdHJpZ2dlcnNdIG9mIGdsb2JhbEVmZmVjdExpc3RlbmVycy5lbnRyaWVzKCkpIGlmICh0cmlnZ2VyRmlsdGVyQWxsb3dzKHRyaWdnZXJzLCB0cmlnZ2VyKSkgdGhpcy4kc2FmZUV4ZWMoY2IsIGV2ZW50KTtcblx0XHR9XG5cdH1cblx0d3JhcChudykge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG53KSkgcmV0dXJuIHdyYXBXaXRoKG53LCB0aGlzKTtcblx0XHRyZXR1cm4gbnc7XG5cdH1cblx0Z2V0IHRyaWdnZXJDb250cm9sKCkge1xuXHRcdHJldHVybiB0aGlzLiN0cmlnZ2VyQ29udHJvbDtcblx0fVxuXHRpc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpIHtcblx0XHRyZXR1cm4gIXRyaWdnZXJGaWx0ZXJBbGxvd3ModGhpcy4jZGlzYWJsZWRUcmlnZ2VycywgXCJhbGxcIikgJiYgIXRyaWdnZXJOYW1lc09mKHRyaWdnZXIpLnNvbWUoKG5hbWUpID0+IHRoaXMuI2Rpc2FibGVkVHJpZ2dlcnMuaGFzKG5hbWUpKTtcblx0fVxuXHRzZXRUcmlnZ2Vyc0VuYWJsZWQodHlwZXMgPSBbXCIqXCJdLCBlbmFibGVkID0gdHJ1ZSkge1xuXHRcdGNvbnN0IG5hbWVzID0gZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyk7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSBpZiAoZW5hYmxlZCkgdGhpcy4jZGlzYWJsZWRUcmlnZ2Vycy5kZWxldGUobmFtZSk7XG5cdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0fVxuXHR3aXRoVHJpZ2dlcnModHlwZXMsIGVuYWJsZWQsIGNiKSB7XG5cdFx0Y29uc3QgbmFtZXMgPSBbLi4uZXhwYW5kVHJpZ2dlckZpbHRlcih0eXBlcyldO1xuXHRcdGNvbnN0IHByZXZpb3VzID0gbmV3IE1hcChuYW1lcy5tYXAoKG5hbWUpID0+IFtuYW1lLCB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmhhcyhuYW1lKV0pKTtcblx0XHRjb25zdCByZXN0b3JlID0gKCkgPT4ge1xuXHRcdFx0cHJldmlvdXMuZm9yRWFjaCgod2FzRGlzYWJsZWQsIG5hbWUpID0+IHtcblx0XHRcdFx0aWYgKHdhc0Rpc2FibGVkKSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmFkZChuYW1lKTtcblx0XHRcdFx0ZWxzZSB0aGlzLiNkaXNhYmxlZFRyaWdnZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0dGhpcy5zZXRUcmlnZ2Vyc0VuYWJsZWQobmFtZXMsIGVuYWJsZWQpO1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjYj8uKCk7XG5cdFx0XHRpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQuZmluYWxseSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiByZXN1bHQuZmluYWxseShyZXN0b3JlKTtcblx0XHRcdHJlc3RvcmUoKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmVzdG9yZSgpO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YWZmZWN0ZWQoY2IsIHByb3AsIG9wdGlvbnMgPSBbXCIqXCJdKSB7XG5cdFx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVBZmZlY3RlZE9wdGlvbnMob3B0aW9ucyk7XG5cdFx0dGhpcy4jbGlzdGVuZXJzLnNldChjYiwge1xuXHRcdFx0cHJvcDogcHJvcCB8fCBmb3JBbGwsXG5cdFx0XHR0cmlnZ2Vyczogbm9ybWFsaXplZC5hZmZlY3RUeXBlc1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnVuYWZmZWN0ZWQoY2IsIHByb3AgfHwgZm9yQWxsKTtcblx0fVxuXHR1bmFmZmVjdGVkKGNiLCBwcm9wKSB7XG5cdFx0aWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy4jbGlzdGVuZXJzO1xuXHRcdFx0Y29uc3QgcmVjb3JkID0gbGlzdGVuZXJzPy5nZXQoY2IpO1xuXHRcdFx0aWYgKHJlY29yZCAmJiAocmVjb3JkLnByb3AgPT0gcHJvcCB8fCBwcm9wID09IG51bGwgfHwgcHJvcCA9PSBmb3JBbGwpKSB7XG5cdFx0XHRcdGxpc3RlbmVycy5kZWxldGUoY2IpO1xuXHRcdFx0XHRyZXR1cm4gKCkgPT4gdGhpcy5hZmZlY3RlZChjYiwgcHJvcCB8fCBmb3JBbGwsIHJlY29yZC50cmlnZ2Vycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiNsaXN0ZW5lcnMuY2xlYXIoKTtcblx0fVxuXHR0cmlnZ2VyKG5hbWUsIHZhbHVlLCBvbGRWYWx1ZSwgdHJpZ2dlciA9IFwic2V0XCIsIC4uLmV0Yykge1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzeW1ib2xcIikgcmV0dXJuO1xuXHRcdGlmICh0cmlnZ2VyID09PSB2b2lkIDApIHRyaWdnZXIgPSBcInNldFwiO1xuXHRcdHRyaWdnZXIgPSBub3JtYWxpemVUcmlnZ2VyTmFtZSh0cmlnZ2VyKSA/PyB0cmlnZ2VyO1xuXHRcdGlmICghdGhpcy5pc1RyaWdnZXJFbmFibGVkKHRyaWdnZXIpKSByZXR1cm47XG5cdFx0Y29uc3Qgb3BLZXkgPSBgJHt0cmlnZ2VyID8/IFwiYWxsXCJ9YDtcblx0XHRsZXQgYnlPcCA9IHRoaXMuI3BlbmRpbmdCeVByb3AuZ2V0KG5hbWUpO1xuXHRcdGlmICghYnlPcCkge1xuXHRcdFx0YnlPcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wLnNldChuYW1lLCBieU9wKTtcblx0XHR9XG5cdFx0YnlPcC5zZXQob3BLZXksIFtcblx0XHRcdG5hbWUsXG5cdFx0XHR2YWx1ZSxcblx0XHRcdG9sZFZhbHVlLFxuXHRcdFx0dHJpZ2dlcixcblx0XHRcdGV0Y1xuXHRcdF0pO1xuXHRcdGlmICh0aGlzLiNmbHVzaFNjaGVkdWxlZCkgcmV0dXJuO1xuXHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcblx0XHRzY2hlZHVsZXI/LnlpZWxkPy4oKT8udGhlbj8uKCgpID0+IHtcblx0XHRcdHRoaXMuI2ZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5cdFx0XHRjb25zdCBiYXRjaCA9IHRoaXMuI3BlbmRpbmdCeVByb3A7XG5cdFx0XHR0aGlzLiNwZW5kaW5nQnlQcm9wID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGZvciAoY29uc3QgW3Byb3AsIG9wTWFwXSBvZiBiYXRjaCkge1xuXHRcdFx0XHRpZiAocHJvcCAhPSBudWxsICYmIHRoaXMuI2luRGlzcGF0Y2guaGFzKHByb3ApKSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHByb3AgIT0gbnVsbCkgdGhpcy4jaW5EaXNwYXRjaC5hZGQocHJvcCk7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBbLCBhcmdzXSBvZiBvcE1hcCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgW25tLCB2LCBvdiwgdGcsIHJlc3RdID0gYXJncztcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuI2Rpc3BhdGNoKG5tLCB2LCBvdiwgdGcsIC4uLnJlc3QgPz8gW10pO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdGlmIChwcm9wICE9IG51bGwpIHRoaXMuI2luRGlzcGF0Y2guZGVsZXRlKHByb3ApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0Z2V0IGl0ZXJhdG9yKCkge1xuXHRcdHJldHVybiB0aGlzLiNpdGVyYXRvcjtcblx0fVxufTtcbnZhciBTdWJzY3JpcHQgPSBnbG9iYWxUaGlzW1N1YnNjcmlwdFN5bWJvbF07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1Jlc29sdmVkLnRzXG52YXIgcmF3T2YgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHVud3JhcHBlZCA9IGRlcmVmKHRhcmdldCk7XG5cdHJldHVybiB1bndyYXBwZWQ/LlskZXh0cmFjdEtleSRdID8/IHVud3JhcHBlZDtcbn07XG5mdW5jdGlvbiByZXNvbHZlZCh0YXJnZXQsIG1vZGUgPSBcImFsbFwiKSB7XG5cdGNvbnN0IHJhdyA9IHJhd09mKHRhcmdldCk7XG5cdGlmIChpc1Byb21pc2UocmF3KSkgcmV0dXJuIHJlc29sdmVkJDEocmF3LCBtb2RlKTtcblx0aWYgKGlzUHJvbWlzZShyYXc/LlskcHJvbWlzZV0pKSByZXR1cm4gcmVzb2x2ZWQkMShyYXdbJHByb21pc2VdLCBtb2RlKTtcblx0cmV0dXJuIHJlc29sdmVkJDEocmF3ID8/IHRhcmdldCwgbW9kZSk7XG59XG5mdW5jdGlvbiBtYWtlUmVzb2x2ZWRPcCh0YXJnZXQsIGVtaXQgPSBmYWxzZSkge1xuXHRjb25zdCBydW4gPSAoKG1vZGUgPSBcImFsbFwiKSA9PiB7XG5cdFx0Y29uc3QgcGVuZGluZyA9IHJlc29sdmVkKHRhcmdldCwgbW9kZSk7XG5cdFx0aWYgKCFlbWl0KSByZXR1cm4gcGVuZGluZztcblx0XHRyZXR1cm4gcGVuZGluZy50aGVuKCh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KTtcblx0XHRcdGNvbnN0IGtleSA9IHJhdz8ucmVhbFByb3AgPz8gKHJhdyAmJiBcInZhbHVlXCIgaW4gcmF3ID8gXCJ2YWx1ZVwiIDogbnVsbCk7XG5cdFx0XHRzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmF3KT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIHZvaWQgMCwgXCJyZXNvbHZlZFwiKTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9KTtcblx0fSk7XG5cdHJ1bi5hbGwgPSAoKSA9PiBydW4oXCJhbGxcIik7XG5cdHJ1bi5hbGxTZXR0bGVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLmFsbEtleWVkID0gKCkgPT4gcnVuKFwiYWxsXCIpO1xuXHRydW4uYWxsU2V0dGxlZEtleWVkID0gKCkgPT4gcnVuKFwic2V0dGxlZFwiKTtcblx0cnVuLnRyeSA9IChjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpID0+IFByb21pc2UudHJ5KGNhbGxiYWNrT3JWYWx1ZSwgLi4uYXJncykudGhlbigodmFsdWUpID0+IHJlc29sdmVkKHZhbHVlID8/IHRhcmdldCwgXCJhbGxcIikpO1xuXHRyZXR1cm4gcnVuO1xufVxuZnVuY3Rpb24gZW1pdFJlc29sdmVkKHRhcmdldCwga2V5LCB2YWx1ZSwgb2xkVmFsdWUpIHtcblx0Y29uc3QgcmF3ID0gcmF3T2YodGFyZ2V0KSA/PyB0YXJnZXQ7XG5cdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChyYXcpPy50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIFwicmVzb2x2ZWRcIik7XG59XG5mdW5jdGlvbiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMobGl2ZSwgcmF3KSB7XG5cdGlmIChsaXZlID09IG51bGwgfHwgcmF3ID09IG51bGwpIHJldHVybiBsaXZlO1xuXHRpZiAoQXJyYXkuaXNBcnJheShyYXcpKSB7XG5cdFx0cmF3LmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuXHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGxpdmVbaW5kZXhdID0gdmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGxpdmU7XG5cdH1cblx0aWYgKHJhdyBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIHJhdy5lbnRyaWVzKCkpIGlmIChpc1Byb21pc2UodmFsdWUpKSBsaXZlLnNldChrZXksIHZhbHVlKTtcblx0XHRyZXR1cm4gbGl2ZTtcblx0fVxuXHRpZiAocmF3IGluc3RhbmNlb2YgU2V0KSByZXR1cm4gbGl2ZTtcblx0Zm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdC5vd25LZXlzKHJhdykpIHtcblx0XHRpZiAoa2V5ID09ICRleHRyYWN0S2V5JCB8fCBrZXkgPT0gJHByb21pc2UgfHwga2V5ID09ICRyZXNvbHZlZCkgY29udGludWU7XG5cdFx0aWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHJhdywga2V5KT8uZW51bWVyYWJsZSkgY29udGludWU7XG5cdFx0Y29uc3QgdmFsdWUgPSByYXdba2V5XTtcblx0XHRpZiAoaXNQcm9taXNlKHZhbHVlKSkgbGl2ZVtrZXldID0gdmFsdWU7XG5cdH1cblx0cmV0dXJuIGxpdmU7XG59XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL1NwZWNpZmljLnRzXG52YXIgX19zYWZlR2V0R3VhcmRTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LnRzQF9fc2FmZUdldEd1YXJkXCIpO1xudmFyIHJlYWN0aXZlUHJvcGVydGllc1N5bWJvbCA9IFN5bWJvbC5mb3IoXCJvYmplY3QudHNAcmVhY3RpdmVQcm9wZXJ0aWVzXCIpO1xudmFyIHJlYWN0aXZlUHJvcGVydGllcyA9IGdsb2JhbFRoaXNbcmVhY3RpdmVQcm9wZXJ0aWVzU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBtYXJrUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuXHRsZXQga2V5cyA9IHJlYWN0aXZlUHJvcGVydGllcy5nZXQodGFyZ2V0KTtcblx0aWYgKCFrZXlzKSByZWFjdGl2ZVByb3BlcnRpZXMuc2V0KHRhcmdldCwga2V5cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRrZXlzLmFkZChrZXkpO1xufVxuZnVuY3Rpb24gaXNSZWFjdGl2ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XG5cdGZvciAobGV0IGN1cnJlbnQgPSB0YXJnZXQ7IGN1cnJlbnQ7IGN1cnJlbnQgPSBSZWZsZWN0LmdldFByb3RvdHlwZU9mKGN1cnJlbnQpKSBpZiAocmVhY3RpdmVQcm9wZXJ0aWVzLmdldChjdXJyZW50KT8uaGFzKGtleSkpIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBub3RpZnlSZWFjdGl2ZVByb3BlcnR5KHJlY2VpdmVyLCBvd25lciwga2V5LCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcblx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQocmVjZWl2ZXIpID8/IHN1YnNjcmlwdFJlZ2lzdHJ5LmdldChvd25lcik7XG5cdGNvbnN0IHRyaWdnZXJOYW1lID0gdHJpZ2dlcktleU9mKHJlY2VpdmVyLCBrZXkpO1xuXHRpZiAoKHNhZmVHZXQocmVjZWl2ZXIsICRpc05vdEVxdWFsKSA/PyBpc05vdEVxdWFsKShvbGRWYWx1ZSwgbmV3VmFsdWUpKSByZWdpc3RyeT8udHJpZ2dlcj8uKHRyaWdnZXJOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuXHRpZiAoaXNQcm9taXNlKG5ld1ZhbHVlKSkgZW1pdFJlc29sdmVkKHJlY2VpdmVyLCB0cmlnZ2VyTmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbn1cbmZ1bmN0aW9uIGRlZmluZVJlYWN0aXZlUHJvcGVydHkodGFyZ2V0LCBrZXkpIHtcblx0Y29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcblx0aWYgKCFkZXNjcmlwdG9yIHx8ICFkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSkgcmV0dXJuIGZhbHNlO1xuXHRpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci53cml0YWJsZSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcblx0aWYgKGlzUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSkpIHJldHVybiB0cnVlO1xuXHRpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIHtcblx0XHRjb25zdCBpbml0aWFsVmFsdWUgPSBkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdGNvbnN0IHZhbHVlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRcdHZhbHVlcy5zZXQodGFyZ2V0LCBpbml0aWFsVmFsdWUpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcblx0XHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGdldCgpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlcy5oYXModGhpcykgPyB2YWx1ZXMuZ2V0KHRoaXMpIDogaW5pdGlhbFZhbHVlO1xuXHRcdFx0fSxcblx0XHRcdHNldChuZXh0VmFsdWUpIHtcblx0XHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB2YWx1ZXMuaGFzKHRoaXMpID8gdmFsdWVzLmdldCh0aGlzKSA6IGluaXRpYWxWYWx1ZTtcblx0XHRcdFx0dmFsdWVzLnNldCh0aGlzLCBuZXh0VmFsdWUpO1xuXHRcdFx0XHRub3RpZnlSZWFjdGl2ZVByb3BlcnR5KHRoaXMsIHRhcmdldCwga2V5LCBvbGRWYWx1ZSwgbmV4dFZhbHVlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRpZiAocmVzdWx0KSBtYXJrUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXHRpZiAoIWRlc2NyaXB0b3Iuc2V0KSByZXR1cm4gZmFsc2U7XG5cdGNvbnN0IGxhc3RBc3NpZ25lZCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCByZXN1bHQgPSBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCB7XG5cdFx0Li4uZGVzY3JpcHRvcixcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0ZW51bWVyYWJsZTogZGVzY3JpcHRvci5lbnVtZXJhYmxlLFxuXHRcdGdldDogZGVzY3JpcHRvci5nZXQgPyBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpO1xuXHRcdH0gOiBsYXN0QXNzaWduZWQuZ2V0KHRoaXMpLFxuXHRcdHNldDogZnVuY3Rpb24obmV4dFZhbHVlKSB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGRlc2NyaXB0b3IuZ2V0ID8gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKSA6IGxhc3RBc3NpZ25lZC5nZXQodGhpcyk7XG5cdFx0XHRkZXNjcmlwdG9yLnNldC5jYWxsKHRoaXMsIG5leHRWYWx1ZSk7XG5cdFx0XHRjb25zdCBhY3R1YWxWYWx1ZSA9IGRlc2NyaXB0b3IuZ2V0ID8gZGVzY3JpcHRvci5nZXQuY2FsbCh0aGlzKSA6IG5leHRWYWx1ZTtcblx0XHRcdGlmICghZGVzY3JpcHRvci5nZXQpIGxhc3RBc3NpZ25lZC5zZXQodGhpcywgYWN0dWFsVmFsdWUpO1xuXHRcdFx0bm90aWZ5UmVhY3RpdmVQcm9wZXJ0eSh0aGlzLCB0YXJnZXQsIGtleSwgb2xkVmFsdWUsIGFjdHVhbFZhbHVlKTtcblx0XHR9XG5cdH0pO1xuXHRpZiAocmVzdWx0KSBtYXJrUmVhY3RpdmVQcm9wZXJ0eSh0YXJnZXQsIGtleSk7XG5cdHJldHVybiByZXN1bHQ7XG59XG52YXIgX19zeXN0ZW1Ta2lwID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1xuXHRTeW1ib2wudG9TdHJpbmdUYWcsXG5cdFN5bWJvbC5pdGVyYXRvcixcblx0U3ltYm9sLmFzeW5jSXRlcmF0b3IsXG5cdFN5bWJvbC50b1ByaW1pdGl2ZSxcblx0XCJ0b1N0cmluZ1wiLFxuXHRcInZhbHVlT2ZcIixcblx0XCJpbnNwZWN0XCIsXG5cdFwiY29uc3RydWN0b3JcIixcblx0XCJfX3Byb3RvX19cIixcblx0XCJwcm90b3R5cGVcIixcblx0XCJ0aGVuXCIsXG5cdFwiY2F0Y2hcIixcblx0XCJmaW5hbGx5XCIsXG5cdFwibmV4dFwiXG5dKTtcbnZhciBzeXN0ZW1Ta2lwR2V0ID0gKHRhcmdldCwgbmFtZSkgPT4ge1xuXHRpZiAoIV9fc3lzdGVtU2tpcC5oYXMobmFtZSkpIHJldHVybiBudWxsO1xuXHRjb25zdCBnb3QgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdHJldHVybiB0eXBlb2YgZ290ID09PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgZ290KSA6IGdvdDtcbn07XG52YXIgX19zYWZlR2V0R3VhcmQgPSBnbG9iYWxUaGlzW19fc2FmZUdldEd1YXJkU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBpc0dldHRlcihvYmosIHByb3BOYW1lKSB7XG5cdGxldCBnb3QgPSB0cnVlO1xuXHR0cnkge1xuXHRcdF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk/LmFkZD8uKHByb3BOYW1lKTtcblx0XHRpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/Lmhhcz8uKHByb3BOYW1lKSkgZ290ID0gdHJ1ZTtcblx0XHRnb3QgPSB0eXBlb2YgUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBwcm9wTmFtZSk/LmdldCA9PSBcImZ1bmN0aW9uXCI7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRnb3QgPSB0cnVlO1xuXHR9IGZpbmFsbHkge1xuXHRcdF9fc2FmZUdldEd1YXJkPy5nZXQ/LihvYmopPy5kZWxldGU/Lihwcm9wTmFtZSk7XG5cdH1cblx0cmV0dXJuIGdvdDtcbn1cbnZhciBmYWxsVGhyb3VnaCA9IChvYmosIGtleSkgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUob2JqKSkgcmV0dXJuIG9iajtcblx0Y29uc3QgdmFsdWUgPSBzYWZlR2V0KG9iaiwga2V5KTtcblx0aWYgKHZhbHVlID09IG51bGwgJiYga2V5ICE9IFwidmFsdWVcIikge1xuXHRcdGNvbnN0IHRtcCA9IHNhZmVHZXQob2JqLCBcInZhbHVlXCIpO1xuXHRcdGlmICh0bXAgIT0gbnVsbCAmJiAhaXNQcmltaXRpdmUodG1wKSkgcmV0dXJuIGZhbGxUaHJvdWdoKHRtcCwga2V5KTtcblx0XHRlbHNlIHJldHVybiB2YWx1ZTtcblx0fSBlbHNlIGlmIChrZXkgPT0gXCJ2YWx1ZVwiICYmIHZhbHVlICE9IG51bGwgJiYgIWlzUHJpbWl0aXZlKHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsbFRocm91Z2godmFsdWUsIGtleSkgPz8gdmFsdWUgPz8gb2JqO1xuXHRyZXR1cm4gdmFsdWUgPz8gb2JqO1xufTtcbnZhciBzYWZlU2V0ID0gKG9iaiwga2V5LCB2YWx1ZSkgPT4ge1xuXHRpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcblx0bGV0IGFjdGl2ZSA9IF9fc2FmZVNldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdGlmIChhY3RpdmU/Lmhhcz8uKGtleSkpIHJldHVybiBmYWxzZTtcblx0YWN0aXZlPy5hZGQ/LihrZXkpO1xuXHRyZXR1cm4gUmVmbGVjdC5zZXQob2JqLCBrZXksIHZhbHVlKTtcbn07XG52YXIgc2FmZUdldCA9IChvYmosIGtleSwgcmVjKSA9PiB7XG5cdGxldCByZXN1bHQgPSB2b2lkIDA7XG5cdGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcblx0bGV0IGFjdGl2ZSA9IF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdGlmIChhY3RpdmU/Lmhhcz8uKGtleSkpIHJldHVybiBudWxsO1xuXHRpZiAoIWlzR2V0dGVyKG9iaiwga2V5KSkgcmVzdWx0ID8/PSBSZWZsZWN0LmdldChvYmosIGtleSwgcmVjICE9IG51bGwgPyByZWMgOiBvYmopO1xuXHRlbHNlIHtcblx0XHRhY3RpdmU/LmFkZD8uKGtleSk7XG5cdFx0dHJ5IHtcblx0XHRcdHJlc3VsdCA9IFJlZmxlY3QuZ2V0KG9iaiwga2V5LCByZWMgIT0gbnVsbCA/IHJlYyA6IG9iaik7XG5cdFx0fSBjYXRjaCAoX2UpIHtcblx0XHRcdHJlc3VsdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0YWN0aXZlLmRlbGV0ZShrZXkpO1xuXHRcdFx0aWYgKGFjdGl2ZT8uc2l6ZSA9PT0gMCkgX19zYWZlR2V0R3VhcmQ/LmRlbGV0ZT8uKG9iaik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0eXBlb2YgcmVzdWx0ID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgob2JqLCByZXN1bHQpIDogcmVzdWx0O1xufTtcbnZhciBoYXNPd24gPSAob2JqLCBrZXkpID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG52YXIgaXNUcmlnZ2VyRW1pdE9wdGlvbnMgPSAodmFsdWUsIGFsbG93VmFsdWVPbmx5ID0gZmFsc2UpID0+IHtcblx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIChoYXNPd24odmFsdWUsIFwia2V5XCIpIHx8IGhhc093bih2YWx1ZSwgXCJuYW1lXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvbGRWYWx1ZVwiKSB8fCBoYXNPd24odmFsdWUsIFwib2xkXCIpIHx8IGhhc093bih2YWx1ZSwgXCJvcFwiKSB8fCBoYXNPd24odmFsdWUsIFwidHJpZ2dlclwiKSB8fCBhbGxvd1ZhbHVlT25seSAmJiBoYXNPd24odmFsdWUsIFwidmFsdWVcIikpO1xufTtcbnZhciB0cmlnZ2VyT3B0aW9uVmFsdWUgPSAob3B0aW9ucywga2V5LCBmYWxsYmFjaykgPT4ge1xuXHRpZiAoaGFzT3duKG9wdGlvbnMsIGtleSkpIHJldHVybiBvcHRpb25zW2tleV07XG5cdGlmIChrZXkgPT0gXCJvbGRWYWx1ZVwiICYmIGhhc093bihvcHRpb25zLCBcIm9sZFwiKSkgcmV0dXJuIG9wdGlvbnMub2xkO1xuXHRyZXR1cm4gZmFsbGJhY2soKTtcbn07XG52YXIgdHJpZ2dlck9wdGlvblRyaWdnZXIgPSAob3B0aW9ucywgZmFsbGJhY2sgPSBcIm1hbnVhbFwiKSA9PiBub3JtYWxpemVUcmlnZ2VyTmFtZShvcHRpb25zLnRyaWdnZXIgPz8gb3B0aW9ucy5vcCA/PyBmYWxsYmFjayk7XG52YXIgaXNSdW50aW1lS2V5ID0gKGtleSkgPT4gdHlwZW9mIGtleSA9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBrZXkgPT0gXCJudW1iZXJcIiB8fCB0eXBlb2Yga2V5ID09IFwic3ltYm9sXCI7XG52YXIgcmVhbFByb3BPZiQxID0gKHRhcmdldCkgPT4ge1xuXHRjb25zdCBwcm9wID0gc2FmZUdldCh0YXJnZXQsICRyZWFsUHJvcCkgPz8gc2FmZUdldCh0YXJnZXQsIFwicmVhbFByb3BcIik7XG5cdHJldHVybiBpc1J1bnRpbWVLZXkocHJvcCkgPyBwcm9wIDogbnVsbDtcbn07XG52YXIgdHJpZ2dlcktleU9mID0gKHRhcmdldCwga2V5KSA9PiBrZXkgPT0gXCJ2YWx1ZVwiID8gcmVhbFByb3BPZiQxKHRhcmdldCkgPz8ga2V5IDoga2V5O1xudmFyIHRyaWdnZXJWYWx1ZU9mID0gKHRhcmdldCwga2V5KSA9PiB7XG5cdGNvbnN0IHJlYWxQcm9wID0gcmVhbFByb3BPZiQxKHRhcmdldCk7XG5cdGlmIChyZWFsUHJvcCAhPSBudWxsICYmIGtleSA9PSByZWFsUHJvcCkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpID8/IHNhZmVHZXQodGFyZ2V0LCBrZXkpO1xuXHRyZXR1cm4ga2V5ID09IG51bGwgPyB2b2lkIDAgOiBzYWZlR2V0KHRhcmdldCwga2V5KTtcbn07XG52YXIgY3JlYXRlVHJpZ2dlckFQSSA9IChyZWdpc3RyeSwgZW1pdCwgdGFyZ2V0KSA9PiB7XG5cdGNvbnN0IGFwaSA9IChrZXksIG9wT3JPcHRpb25zLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKCFpc1RyaWdnZXJFbWl0T3B0aW9ucyhvcE9yT3B0aW9ucykpIHRyaWdnZXIgPz89IG9wT3JPcHRpb25zO1xuXHRcdHJldHVybiBlbWl0KGlzVHJpZ2dlckVtaXRPcHRpb25zKGtleSkgPyBrZXkgOiBpc1RyaWdnZXJFbWl0T3B0aW9ucyhvcE9yT3B0aW9ucywgdHJ1ZSkgPyB7XG5cdFx0XHRrZXksXG5cdFx0XHR0cmlnZ2VyLFxuXHRcdFx0Li4ub3BPck9wdGlvbnNcblx0XHR9IDoge1xuXHRcdFx0a2V5LFxuXHRcdFx0dHJpZ2dlcjogdHJpZ2dlciA/PyBvcE9yT3B0aW9uc1xuXHRcdH0pO1xuXHR9O1xuXHRjb25zdCBjb250cm9sID0gcmVnaXN0cnk/LnRyaWdnZXJDb250cm9sO1xuXHRpZiAoY29udHJvbCkgT2JqZWN0LmFzc2lnbihhcGksIGNvbnRyb2wpO1xuXHRhcGkuY3VzdG9tID0gKHRyaWdnZXIsIGtleSwgdmFsdWUsIG9sZFZhbHVlKSA9PiBhcGkoe1xuXHRcdGtleSxcblx0XHR0cmlnZ2VyLFxuXHRcdHZhbHVlLFxuXHRcdG9sZFZhbHVlXG5cdH0pO1xuXHRpZiAodGFyZ2V0ICE9IG51bGwpIGFwaS5yZXNvbHZlZCA9IG1ha2VSZXNvbHZlZE9wKHRhcmdldCwgdHJ1ZSk7XG5cdHJldHVybiBhcGk7XG59O1xudmFyIHN5c3RlbUdldCA9ICh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KSA9PiB7XG5cdGlmICh0YXJnZXQgPT0gbnVsbCB8fCBpc1ByaW1pdGl2ZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRpZiAoKFtcblx0XHRcImRlcmVmXCIsXG5cdFx0XCJiaW5kXCIsXG5cdFx0XCJAdGFyZ2V0XCIsXG5cdFx0JG9yaWdpbmFsS2V5JCxcblx0XHQkZXh0cmFjdEtleSQsXG5cdFx0JHJlZ2lzdHJ5S2V5JFxuXHRdLmluZGV4T2YobmFtZSkgPCAwID8gc2FmZUdldCh0YXJnZXQsIG5hbWUpPy5iaW5kPy4odGFyZ2V0KSA6IG51bGwpICE9IG51bGwpIHJldHVybiBudWxsO1xuXHRpZiAoWyRleHRyYWN0S2V5JCwgJG9yaWdpbmFsS2V5JF0uaW5kZXhPZihuYW1lKSA+PSAwKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IHRhcmdldDtcblx0aWYgKG5hbWUgPT0gJHZhbHVlKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpO1xuXHRpZiAobmFtZSA9PSAkcmVnaXN0cnlLZXkkKSByZXR1cm4gcmVnaXN0cnk7XG5cdGlmIChuYW1lID09ICRyZXNvbHZlZCB8fCBuYW1lID09IFwicmVzb2x2ZWRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwgXCJyZXNvbHZlZFwiKSkgcmV0dXJuIG1ha2VSZXNvbHZlZE9wKHRhcmdldCk7XG5cdGlmIChuYW1lID09ICR0cmlnZ2VyQ29udHJvbCkgcmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyQ29udHJvbDtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLm9ic2VydmFibGUpIHJldHVybiByZWdpc3RyeT8uY29tcGF0aWJsZTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLnN1YnNjcmliZSkgcmV0dXJuIChjYiwgcHJvcCwgb3B0aW9ucykgPT4gYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQsIGNiLCBvcHRpb25zKTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLml0ZXJhdG9yKSByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRpZiAobmFtZSA9PSBTeW1ib2wuYXN5bmNJdGVyYXRvcikgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLmRpc3Bvc2UpIHJldHVybiAocHJvcCkgPT4ge1xuXHRcdHNhZmVHZXQodGFyZ2V0LCBTeW1ib2wuZGlzcG9zZSk/Lihwcm9wKTtcblx0XHR1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0fTtcblx0aWYgKG5hbWUgPT0gU3ltYm9sLmFzeW5jRGlzcG9zZSkgcmV0dXJuIChwcm9wKSA9PiB7XG5cdFx0c2FmZUdldCh0YXJnZXQsIFN5bWJvbC5hc3luY0Rpc3Bvc2UpPy4ocHJvcCk7XG5cdFx0dW5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCk7XG5cdH07XG5cdGlmIChuYW1lID09IFN5bWJvbC51bnN1YnNjcmliZSkgcmV0dXJuIChwcm9wKSA9PiB1bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTtcblx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgKG5hbWUgaW4gdGFyZ2V0IHx8IHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsKSkgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcbn07XG52YXIgb2JzZXJ2YWJsZUFQSU1ldGhvZHMgPSAodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSkgPT4ge1xuXHRpZiAobmFtZSA9PSBcInN1YnNjcmliZVwiKSByZXR1cm4gcmVnaXN0cnk/LmNvbXBhdGlibGU/LltuYW1lXSA/PyAoKGhhbmRsZXIpID0+IHtcblx0XHRpZiAodHlwZW9mIGhhbmRsZXIgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gYWZmZWN0ZWQodGFyZ2V0LCBoYW5kbGVyKTtcblx0XHRlbHNlIGlmIChcIm5leHRcIiBpbiBoYW5kbGVyICYmIGhhbmRsZXI/Lm5leHQgIT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgdXN1YiA9IGFmZmVjdGVkKHRhcmdldCwgaGFuZGxlcj8ubmV4dCksIGNvbXAgPSBoYW5kbGVyPy5bXCJjb21wbGV0ZVwiXTtcblx0XHRcdGhhbmRsZXJbXCJjb21wbGV0ZVwiXSA9ICguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdHVzdWI/LigpO1xuXHRcdFx0XHRyZXR1cm4gY29tcD8uKC4uLmFyZ3MpO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBoYW5kbGVyW1wiY29tcGxldGVcIl07XG5cdFx0fVxuXHR9KTtcbn07XG52YXIgT2JzZXJ2ZUFycmF5TWV0aG9kID0gY2xhc3Mge1xuXHQjbmFtZTtcblx0I3NlbGY7XG5cdCNoYW5kbGU7XG5cdGNvbnN0cnVjdG9yKG5hbWUsIHNlbGYsIGhhbmRsZSkge1xuXHRcdHRoaXMuI25hbWUgPSBuYW1lO1xuXHRcdHRoaXMuI3NlbGYgPSBzZWxmO1xuXHRcdHRoaXMuI2hhbmRsZSA9IGhhbmRsZTtcblx0fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCByZWMpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIG5hbWUsIHJlYyk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRsZXQgYWRkZWQgPSBbXSwgcmVtb3ZlZCA9IFtdO1xuXHRcdGxldCBzZXRQYWlycyA9IFtdO1xuXHRcdGxldCBvbGRTdGF0ZSA9IFsuLi50aGlzLiNzZWxmXTtcblx0XHRsZXQgaWR4ID0gLTE7XG5cdFx0Y29uc3QgcmVzdWx0ID0gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCB8fCB0aGlzLiNzZWxmLCBhcmdzKTtcblx0XHRpZiAodGhpcy4jaGFuZGxlPy5bJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkgcmV0dXJuIG9ic2VydmVBcnJheShyZXN1bHQpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0c3dpdGNoICh0aGlzLiNuYW1lKSB7XG5cdFx0XHRjYXNlIFwicHVzaFwiOlxuXHRcdFx0XHRpZHggPSBvbGRTdGF0ZT8ubGVuZ3RoO1xuXHRcdFx0XHRhZGRlZCA9IGFyZ3M7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInVuc2hpZnRcIjpcblx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0YWRkZWQgPSBhcmdzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJwb3BcIjpcblx0XHRcdFx0aWR4ID0gb2xkU3RhdGU/Lmxlbmd0aCAtIDE7XG5cdFx0XHRcdGlmIChvbGRTdGF0ZS5sZW5ndGggPiAwKSByZW1vdmVkID0gW29sZFN0YXRlW2lkeF1dO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzaGlmdFwiOlxuXHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRpZiAob2xkU3RhdGUubGVuZ3RoID4gMCkgcmVtb3ZlZCA9IFtvbGRTdGF0ZVtpZHhdXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic3BsaWNlXCI6XG5cdFx0XHRcdGlkeCA9IGFyZ3NbMF07XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5tYXgob2xkU3RhdGUubGVuZ3RoLCB0aGlzLiNzZWxmLmxlbmd0aCk7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IG9sZFZhbHVlID0gb2xkU3RhdGVbaV07XG5cdFx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSB0aGlzLiNzZWxmW2ldO1xuXHRcdFx0XHRcdGlmIChuZXdWYWx1ZSA9PT0gdm9pZCAwICYmIGkgPj0gdGhpcy4jc2VsZi5sZW5ndGgpIHJlbW92ZWQucHVzaChvbGRWYWx1ZSk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAob2xkVmFsdWUgPT09IHZvaWQgMCAmJiBpID49IG9sZFN0YXRlLmxlbmd0aCkgc2V0UGFpcnMucHVzaChbXG5cdFx0XHRcdFx0XHRpLFxuXHRcdFx0XHRcdFx0bmV3VmFsdWUsXG5cdFx0XHRcdFx0XHR2b2lkIDAsXG5cdFx0XHRcdFx0XHRmYWxzZVxuXHRcdFx0XHRcdF0pO1xuXHRcdFx0XHRcdGVsc2UgaWYgKGlzTm90RXF1YWwob2xkVmFsdWUsIG5ld1ZhbHVlKSkgc2V0UGFpcnMucHVzaChbXG5cdFx0XHRcdFx0XHRpLFxuXHRcdFx0XHRcdFx0bmV3VmFsdWUsXG5cdFx0XHRcdFx0XHRvbGRWYWx1ZSxcblx0XHRcdFx0XHRcdHRydWVcblx0XHRcdFx0XHRdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzb3J0XCI6XG5cdFx0XHRjYXNlIFwiZmlsbFwiOlxuXHRcdFx0Y2FzZSBcInJldmVyc2VcIjpcblx0XHRcdGNhc2UgXCJjb3B5V2l0aGluXCI6XG5cdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgb2xkU3RhdGUubGVuZ3RoOyBpKyspIGlmIChpc05vdEVxdWFsKG9sZFN0YXRlW2ldLCB0aGlzLiNzZWxmW2ldKSkgc2V0UGFpcnMucHVzaChbXG5cdFx0XHRcdFx0aWR4ICsgaSxcblx0XHRcdFx0XHR0aGlzLiNzZWxmW2ldLFxuXHRcdFx0XHRcdG9sZFN0YXRlW2ldLFxuXHRcdFx0XHRcdHRydWVcblx0XHRcdFx0XSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNldFwiOlxuXHRcdFx0XHRpZHggPSBhcmdzWzFdO1xuXHRcdFx0XHRzZXRQYWlycy5wdXNoKFtcblx0XHRcdFx0XHRpZHgsXG5cdFx0XHRcdFx0YXJnc1swXSxcblx0XHRcdFx0XHRvbGRTdGF0ZT8uW2lkeF0sXG5cdFx0XHRcdFx0aWR4IGluIG9sZFN0YXRlXG5cdFx0XHRcdF0pO1xuXHRcdH1cblx0XHRjb25zdCByZWcgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGhpcy4jc2VsZik7XG5cdFx0aWYgKGFkZGVkPy5sZW5ndGggPT0gMSkgcmVnPy50cmlnZ2VyPy4oaWR4LCBhZGRlZFswXSwgbnVsbCwgXCJhZGRcIik7XG5cdFx0ZWxzZSBpZiAoYWRkZWQ/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgYWRkZWQsIG51bGwsIFwiYWRkQWxsXCIpO1xuXHRcdFx0YWRkZWQuZm9yRWFjaCgoaXRlbSwgSSkgPT4gcmVnPy50cmlnZ2VyPy4oaWR4ICsgSSwgaXRlbSwgbnVsbCwgXCJhZGRcIikpO1xuXHRcdH1cblx0XHRpZiAoc2V0UGFpcnM/Lmxlbmd0aCA9PSAxKSByZWc/LnRyaWdnZXI/LihzZXRQYWlyc1swXT8uWzBdID8/IGlkeCwgc2V0UGFpcnNbMF0/LlsxXSwgc2V0UGFpcnNbMF0/LlsyXSwgc2V0UGFpcnNbMF0/LlszXSA9PT0gZmFsc2UgPyBcImFkZFwiIDogXCJzZXRcIik7XG5cdFx0ZWxzZSBpZiAoc2V0UGFpcnM/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJlZz8udHJpZ2dlcj8uKGlkeCwgc2V0UGFpcnMsIG9sZFN0YXRlLCBcInNldEFsbFwiKTtcblx0XHRcdHNldFBhaXJzLmZvckVhY2goKHBhaXIsIEkpID0+IHJlZz8udHJpZ2dlcj8uKHBhaXI/LlswXSA/PyBpZHggKyBJLCBwYWlyPy5bMV0sIHBhaXI/LlsyXSwgcGFpcj8uWzNdID09PSBmYWxzZSA/IFwiYWRkXCIgOiBcInNldFwiKSk7XG5cdFx0fVxuXHRcdGlmIChyZW1vdmVkPy5sZW5ndGggPT0gMSkgcmVnPy50cmlnZ2VyPy4oaWR4LCBudWxsLCByZW1vdmVkWzBdLCBcImRlbGV0ZVwiKTtcblx0XHRlbHNlIGlmIChyZW1vdmVkPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWc/LnRyaWdnZXI/LihpZHgsIG51bGwsIHJlbW92ZWQsIFwiZGVsZXRlQWxsXCIpO1xuXHRcdFx0cmVtb3ZlZC5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWc/LnRyaWdnZXI/LihpZHggKyBJLCBudWxsLCBpdGVtLCBcImRlbGV0ZVwiKSk7XG5cdFx0fVxuXHRcdGlmIChyZXN1bHQgPT0gdGFyZ2V0KSByZXR1cm4gbmV3IFByb3h5KHJlc3VsdCwgdGhpcy4jaGFuZGxlKTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSByZXR1cm4gb2JzZXJ2ZUFycmF5KHJlc3VsdCk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufTtcbnZhciB0cmlnZ2VyV2hlbkxlbmd0aENoYW5nZSA9IChzZWxmLCB0YXJnZXQsIG9sZExlbiwgbmV3TGVuKSA9PiB7XG5cdGNvbnN0IHJlbW92ZWRJdGVtcyA9IE51bWJlci5pc0ludGVnZXIob2xkTGVuKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKG5ld0xlbikgJiYgbmV3TGVuIDwgb2xkTGVuID8gdGFyZ2V0LnNsaWNlKG5ld0xlbiwgb2xkTGVuKSA6IFtdO1xuXHRpZiAoIXNlbGZbJHRyaWdnZXJMb2NrXSAmJiBvbGRMZW4gIT09IG5ld0xlbikge1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0aWYgKHJlbW92ZWRJdGVtcy5sZW5ndGggPT09IDEpIHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuLCBudWxsLCByZW1vdmVkSXRlbXNbMF0sIFwiZGVsZXRlXCIpO1xuXHRcdGVsc2UgaWYgKHJlbW92ZWRJdGVtcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZWdpc3RyeT8udHJpZ2dlcj8uKG5ld0xlbiwgbnVsbCwgcmVtb3ZlZEl0ZW1zLCBcImRlbGV0ZUFsbFwiKTtcblx0XHRcdHJlbW92ZWRJdGVtcy5mb3JFYWNoKChpdGVtLCBJKSA9PiByZWdpc3RyeT8udHJpZ2dlcj8uKG5ld0xlbiArIEksIG51bGwsIGl0ZW0sIFwiZGVsZXRlXCIpKTtcblx0XHR9XG5cdFx0Y29uc3QgYWRkZWRDb3VudCA9IE51bWJlci5pc0ludGVnZXIob2xkTGVuKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKG5ld0xlbikgJiYgbmV3TGVuID4gb2xkTGVuID8gbmV3TGVuIC0gb2xkTGVuIDogMDtcblx0XHRpZiAoYWRkZWRDb3VudCA9PT0gMSkgcmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4sIHZvaWQgMCwgbnVsbCwgXCJhZGRcIik7XG5cdFx0ZWxzZSBpZiAoYWRkZWRDb3VudCA+IDEpIHtcblx0XHRcdGNvbnN0IGFkZGVkID0gQXJyYXkoYWRkZWRDb3VudCkuZmlsbCh2b2lkIDApO1xuXHRcdFx0cmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4sIGFkZGVkLCBudWxsLCBcImFkZEFsbFwiKTtcblx0XHRcdGFkZGVkLmZvckVhY2goKF8sIEkpID0+IHJlZ2lzdHJ5Py50cmlnZ2VyPy4ob2xkTGVuICsgSSwgdm9pZCAwLCBudWxsLCBcImFkZFwiKSk7XG5cdFx0fVxuXHR9XG59O1xudmFyIE9ic2VydmVBcnJheUhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdO1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGhhcyh0YXJnZXQsIG5hbWUpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBuYW1lKTtcblx0fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCByZWMpIHtcblx0XHRjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGlmIChza2lwICE9IG51bGwpIHJldHVybiBza2lwO1xuXHRcdGlmIChbXG5cdFx0XHQkZXh0cmFjdEtleSQsXG5cdFx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdFx0XCJAdGFyZ2V0XCIsXG5cdFx0XHRcImRlcmVmXCJcblx0XHRdLmluZGV4T2YobmFtZSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBzYWZlR2V0KHRhcmdldCwgbmFtZSk/LmJpbmQ/Lih0YXJnZXQpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnk/LmdldD8uKHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lID8/IDA7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHNhZmVHZXQodGFyZ2V0LCBrZXkpKTtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcIkB0YXJnZXRcIiB8fCBuYW1lID09ICRleHRyYWN0S2V5JCkgcmV0dXJuIHRhcmdldDtcblx0XHRpZiAobmFtZSA9PSBcInhcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnggPz8gdGFyZ2V0Py5bMF07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInlcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnkgPz8gdGFyZ2V0Py5bMV07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInpcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnogPz8gdGFyZ2V0Py5bMl07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcIndcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LncgPz8gdGFyZ2V0Py5bM107XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LnIgPz8gdGFyZ2V0Py5bMF07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImdcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LmcgPz8gdGFyZ2V0Py5bMV07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LmIgPz8gdGFyZ2V0Py5bMl07XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcImFcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdHJldHVybiB0YXJnZXQ/LmEgPz8gdGFyZ2V0Py5bM107XG5cdFx0fTtcblx0XHRjb25zdCBnb3QgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gKG5hbWUgPT0gXCJ2YWx1ZVwiID8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgOiBudWxsKTtcblx0XHRpZiAodHlwZW9mIGdvdCA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBuZXcgUHJveHkodHlwZW9mIGdvdCA9PSBcImZ1bmN0aW9uXCIgPyBnb3Q/LmJpbmQ/Lih0YXJnZXQpIDogZ290LCBuZXcgT2JzZXJ2ZUFycmF5TWV0aG9kKG5hbWUsIHRhcmdldCwgdGhpcykpO1xuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAodHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0aWYgKE51bWJlci5pc0ludGVnZXIocGFyc2VJbnQobmFtZSkpKSBuYW1lID0gcGFyc2VJbnQobmFtZSkgPz8gbmFtZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7XG5cdFx0XHR0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0Y29uc3QgcGVuZGluZyA9IGlzUHJvbWlzZSh2YWx1ZSk7XG5cdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmModmFsdWUsICh2KSA9PiB7XG5cdFx0XHRjb25zdCBvbGQgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0XHRjb25zdCB4eXp3ID0gW1xuXHRcdFx0XHRcInhcIixcblx0XHRcdFx0XCJ5XCIsXG5cdFx0XHRcdFwielwiLFxuXHRcdFx0XHRcIndcIlxuXHRcdFx0XTtcblx0XHRcdGNvbnN0IHJnYmEgPSBbXG5cdFx0XHRcdFwiclwiLFxuXHRcdFx0XHRcImdcIixcblx0XHRcdFx0XCJiXCIsXG5cdFx0XHRcdFwiYVwiXG5cdFx0XHRdO1xuXHRcdFx0Y29uc3QgeHl6d19pZHggPSB4eXp3LmluZGV4T2YobmFtZSk7XG5cdFx0XHRjb25zdCByZ2JhX2lkeCA9IHJnYmEuaW5kZXhPZihuYW1lKTtcblx0XHRcdGxldCBnb3QgPSBmYWxzZTtcblx0XHRcdGlmICh4eXp3X2lkeCA+PSAwKSBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIHh5endfaWR4LCB2KTtcblx0XHRcdGVsc2UgaWYgKHJnYmFfaWR4ID49IDApIGdvdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwgcmdiYV9pZHgsIHYpO1xuXHRcdFx0ZWxzZSBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHYpO1xuXHRcdFx0aWYgKG5hbWUgPT0gXCJsZW5ndGhcIikge1xuXHRcdFx0XHRpZiAoaXNOb3RFcXVhbChvbGQsIHYpKSB0cmlnZ2VyV2hlbkxlbmd0aENoYW5nZSh0aGlzLCB0YXJnZXQsIG9sZCwgdik7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRcdGlmIChpc05vdEVxdWFsKG9sZCwgdikpIHN1YnNjcmlwdFJlZ2lzdHJ5Py5nZXQ/Lih0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgdiwgb2xkLCBcInNldFwiKTtcblx0XHRcdFx0aWYgKHBlbmRpbmcpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIG5hbWUsIHYsIG9sZCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZ290O1xuXHRcdH0pO1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSkge1xuXHRcdGlmICh0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG5cdFx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihwYXJzZUludChuYW1lKSkpIG5hbWUgPSBwYXJzZUludChuYW1lKSA/PyBuYW1lO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0Y29uc3Qgb2xkID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IGdvdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBuYW1lICE9IFwibGVuZ3RoXCIgJiYgbmFtZSAhPSAkdHJpZ2dlckxvY2sgJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikge1xuXHRcdFx0aWYgKG9sZCAhPSBudWxsKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIG5hbWUsIG9sZCwgXCJkZWxldGVcIik7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZU9iamVjdEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdO1xuXHRjb25zdHJ1Y3RvcigpIHt9XG5cdGdldCh0YXJnZXQsIG5hbWUsIGN0eCkge1xuXHRcdGlmIChbXG5cdFx0XHQkZXh0cmFjdEtleSQsXG5cdFx0XHQkb3JpZ2luYWxLZXkkLFxuXHRcdFx0XCJAdGFyZ2V0XCIsXG5cdFx0XHRcImRlcmVmXCIsXG5cdFx0XHRcInRoZW5cIixcblx0XHRcdFwiY2F0Y2hcIixcblx0XHRcdFwiZmluYWxseVwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KSA/PyBzdWJzY3JpcHRSZWdpc3RyeS5nZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGlmIChzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gbnVsbCAmJiBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgKHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCIpICYmIHNhZmVHZXQoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIiksIG5hbWUpICE9IG51bGwpIHRhcmdldCA9IHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldDtcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gdHJpZ2dlcktleU9mKHRhcmdldCwgb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lID8/IHJlYWxQcm9wT2YkMSh0YXJnZXQpID8/IFwidmFsdWVcIik7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcIm9sZFZhbHVlXCIsICgpID0+IGtleSA9PSBcInZhbHVlXCIgfHwga2V5ID09IHJlYWxQcm9wT2YkMSh0YXJnZXQpID8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgOiB2b2lkIDApO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0cmlnZ2VyVmFsdWVPZih0YXJnZXQsIGtleSkpO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFN5bWJvbC50b1ByaW1pdGl2ZSkgcmV0dXJuIChoaW50KSA9PiB7XG5cdFx0XHRjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKGhpbnQpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIHRyeVBhcnNlQnlIaW50KGZ0LCBoaW50KTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIHRyeVBhcnNlQnlIaW50KHNhZmVHZXQoZnQsIFwidmFsdWVcIiksIGhpbnQpO1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQsIGhpbnQpO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gU3ltYm9sLnRvU3RyaW5nVGFnKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKGZ0KSkgcmV0dXJuIFN0cmluZyhmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJ0b1N0cmluZ1wiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIFN5bWJvbC50b1N0cmluZ1RhZykpIHJldHVybiBzYWZlR2V0KGZ0LCBTeW1ib2wudG9TdHJpbmdUYWcpPy4oKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBTdHJpbmcoZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIFN0cmluZyhzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwidmFsdWVPZlwiKSByZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgZnQgPSBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuXHRcdFx0aWYgKHNhZmVHZXQoZnQsIFN5bWJvbC50b1ByaW1pdGl2ZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBTeW1ib2wudG9QcmltaXRpdmUpPy4oKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBmdDtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIHNhZmVHZXQoZnQsIFwidmFsdWVcIik7XG5cdFx0XHRyZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdDtcblx0XHR9O1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0cmV0dXJuIGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQ/LltTeW1ib2wuZm9yKFwiQEBhcHBseVwiKV0/LmJpbmQ/Lih0YXJnZXQ/LltTeW1ib2wuZm9yKFwiQEBhcHBseVwiKV0gPz8gdGFyZ2V0KSA/PyB0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIHByb3AgaW4gdGFyZ2V0O1xuXHR9XG5cdHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRyZXR1cm4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IHNraXAgPSBzeXN0ZW1Ta2lwR2V0KHYsIG5hbWUpO1xuXHRcdFx0aWYgKHNraXAgIT0gbnVsbCkgcmV0dXJuIHNraXA7XG5cdFx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHtcblx0XHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgJG9yaWdpbmFsID0gdGFyZ2V0O1xuXHRcdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdFx0aWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgIShzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBuYW1lIGluIHRhcmdldCkpIHJldHVybjtcblx0XHRcdGNvbnN0IHRyaWdnZXJOYW1lID0gdHJpZ2dlcktleU9mKHRhcmdldCwgbmFtZSk7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IG5hbWUgPT0gXCJ2YWx1ZVwiID8gc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgPz8gc2FmZUdldCh0YXJnZXQsIG5hbWUpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdFx0dGFyZ2V0W25hbWVdID0gdjtcblx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IHY7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiB0eXBlb2YgbmFtZSAhPT0gXCJzeW1ib2xcIiAmJiAhaXNSZWFjdGl2ZVByb3BlcnR5KCRvcmlnaW5hbCwgbmFtZSkpIHtcblx0XHRcdFx0Y29uc3Qgc3Vic2NyaXB0ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KCRvcmlnaW5hbCk7XG5cdFx0XHRcdGlmICgoc2FmZUdldCh0YXJnZXQsICRpc05vdEVxdWFsKSA/PyBpc05vdEVxdWFsKT8uKG9sZFZhbHVlLCBuZXdWYWx1ZSkpIHN1YnNjcmlwdD8udHJpZ2dlcj8uKHRyaWdnZXJOYW1lLCB2LCBvbGRWYWx1ZSk7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UodmFsdWUpKSBlbWl0UmVzb2x2ZWQoJG9yaWdpbmFsLCB0cmlnZ2VyTmFtZSwgdiwgb2xkVmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSk7XG5cdH1cblx0ZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoc2tpcCAhPSBudWxsKSByZXR1cm4gc2tpcDtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISFkZXNjcmlwdG9yLnZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhZGVzY3JpcHRvci52YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAoc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IG51bGwgJiYgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiKSAmJiBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsKSB0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyB0YXJnZXQ7XG5cdFx0aWYgKGRlc2NyaXB0b3IuZ2V0ID09IHZvaWQgMCAmJiBkZXNjcmlwdG9yLnNldCA9PSB2b2lkIDApIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcik7XG5cdFx0Y29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgJHJlc3VsdCA9IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG5cdFx0XHRnZXQ6IGRlc2NyaXB0b3IuZ2V0LFxuXHRcdFx0c2V0OiBkZXNjcmlwdG9yLnNldCxcblx0XHRcdGVudW1lcmFibGU6IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA/PyB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA/PyB0cnVlXG5cdFx0fSk7XG5cdFx0c2FmZVNldCh0YXJnZXQsIG5hbWUsIG9sZFZhbHVlKTtcblx0XHRyZXR1cm4gJHJlc3VsdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmIG5hbWUgIT0gXCJ2YWx1ZVwiICYmIGhhc1ZhbHVlKHRhcmdldCkgJiYgc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwiZnVuY3Rpb25cIikgJiYgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbCkgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBuYW1lICE9ICR0cmlnZ2VyTG9jayAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59O1xudmFyIE9ic2VydmVNYXBIYW5kbGVyID0gY2xhc3Mge1xuXHRbJHRyaWdnZXJMb2NrXTtcblx0Y29uc3RydWN0b3IoKSB7fVxuXHRnZXQodGFyZ2V0LCBuYW1lLCBjdHgpIHtcblx0XHRpZiAoW1xuXHRcdFx0JGV4dHJhY3RLZXkkLFxuXHRcdFx0JG9yaWdpbmFsS2V5JCxcblx0XHRcdFwiQHRhcmdldFwiLFxuXHRcdFx0XCJkZXJlZlwiXG5cdFx0XS5pbmRleE9mKG5hbWUpID49IDAgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwgJiYgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IHRhcmdldCkgcmV0dXJuIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eCh0YXJnZXQsIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG5cdFx0Y29uc3QgcmVnaXN0cnkgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KTtcblx0XHRjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7XG5cdFx0aWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXHRcdGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblx0XHR0YXJnZXQgPSBzYWZlR2V0KHRhcmdldCwgJGV4dHJhY3RLZXkkKSA/PyBzYWZlR2V0KHRhcmdldCwgJG9yaWdpbmFsS2V5JCkgPz8gdGFyZ2V0O1xuXHRcdGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuXHRcdGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHJldHVybiB2YWx1ZU9yRng7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXIpIHJldHVybiBjcmVhdGVUcmlnZ2VyQVBJKHJlZ2lzdHJ5LCAob3B0aW9ucykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5ID0gb3B0aW9ucy5rZXkgPz8gb3B0aW9ucy5uYW1lO1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm47XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRyaWdnZXJPcHRpb25WYWx1ZShvcHRpb25zLCBcInZhbHVlXCIsICgpID0+IHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCAmJiAhaGFzT3duKG9wdGlvbnMsIFwidmFsdWVcIikpIHJldHVybjtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gdHJpZ2dlck9wdGlvblZhbHVlKG9wdGlvbnMsIFwib2xkVmFsdWVcIiwgKCkgPT4gdm9pZCAwKTtcblx0XHRcdHJldHVybiByZWdpc3RyeT8udHJpZ2dlcj8uKGtleSwgdmFsdWUsIG9sZFZhbHVlLCB0cmlnZ2VyT3B0aW9uVHJpZ2dlcihvcHRpb25zLCBcIm1hbnVhbFwiKSk7XG5cdFx0fSwgdGFyZ2V0KTtcblx0XHRpZiAobmFtZSA9PSBcImNsZWFyXCIpIHJldHVybiAoKSA9PiB7XG5cdFx0XHRjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8uZW50cmllcz8uKCkgfHwgW10pLCByZXN1bHQgPSB2YWx1ZU9yRngoKTtcblx0XHRcdG9sZFZhbHVlcy5mb3JFYWNoKChbcHJvcCwgb2xkVmFsdWVdKSA9PiB7XG5cdFx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChuYW1lID09IFwiZGVsZXRlXCIpIHJldHVybiAocHJvcCwgXyA9IG51bGwpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXMocHJvcCksIG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3ApO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcImRlbGV0ZVwiKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAobmFtZSA9PSBcInNldFwiKSByZXR1cm4gKHByb3AsIHZhbHVlKSA9PiBwb3RlbnRpYWxseUFzeW5jTWFwKHZhbHVlLCAodikgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyhwcm9wKSwgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCwgdik7XG5cdFx0XHRpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkge1xuXHRcdFx0XHRpZiAoIWhhZCB8fCBpc05vdEVxdWFsKG9sZFZhbHVlLCB2KSkgc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCB2LCBoYWQgPyBvbGRWYWx1ZSA6IG51bGwsIGhhZCA/IFwic2V0XCIgOiBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHByb3AsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0aWYgKG5hbWUgPT0gXCJnZXRPckluc2VydFwiIHx8IG5hbWUgPT0gXCJnZXRPckluc2VydENvbXB1dGVkXCIpIHtcblx0XHRcdGNvbnN0IGNvbXB1dGVkID0gbmFtZSA9PSBcImdldE9ySW5zZXJ0Q29tcHV0ZWRcIjtcblx0XHRcdHJldHVybiAoa2V5LCBkZWZhdWx0T3JDb21wdXRlKSA9PiB7XG5cdFx0XHRcdGlmICh0YXJnZXQuaGFzKGtleSkpIHJldHVybiB0YXJnZXQuZ2V0KGtleSk7XG5cdFx0XHRcdGNvbnN0IGluY29taW5nID0gY29tcHV0ZWQgPyB0eXBlb2YgZGVmYXVsdE9yQ29tcHV0ZSA9PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0T3JDb21wdXRlKGtleSkgOiBkZWZhdWx0T3JDb21wdXRlIDogZGVmYXVsdE9yQ29tcHV0ZTtcblx0XHRcdFx0cmV0dXJuIHBvdGVudGlhbGx5QXN5bmNNYXAoaW5jb21pbmcsICh2KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdHlwZW9mIHRhcmdldC5nZXRPckluc2VydCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQuZ2V0T3JJbnNlcnQoa2V5LCB2KSA6ICh0YXJnZXQuc2V0KGtleSwgdiksIHRhcmdldC5nZXQoa2V5KSk7XG5cdFx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHtcblx0XHRcdFx0XHRcdHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4oa2V5LCB2LCBudWxsLCBcImFkZFwiKTtcblx0XHRcdFx0XHRcdGlmIChpc1Byb21pc2UoaW5jb21pbmcpKSBlbWl0UmVzb2x2ZWQodGFyZ2V0LCBrZXksIHYsIG51bGwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZU9yRng7XG5cdH1cblx0c2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHR9XG5cdGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpO1xuXHR9XG5cdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTtcblx0fVxuXHRvd25LZXlzKHRhcmdldCkge1xuXHRcdHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0fVxuXHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG5cdFx0bGV0IGdvdCA9IHZvaWQgMDtcblx0XHR0cnkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldE9ySW5zZXJ0Py4odGFyZ2V0LCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcblx0XHRcdGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgZ290ID0gdm9pZCAwO1xuXHRcdFx0Z290ID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGdvdCA9IHZvaWQgMDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0X19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG5cdFx0fVxuXHRcdHJldHVybiBnb3Q7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKSB7XG5cdFx0aWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZSk7XG5cdH1cbn07XG52YXIgT2JzZXJ2ZVNldEhhbmRsZXIgPSBjbGFzcyB7XG5cdFskdHJpZ2dlckxvY2tdID0gZmFsc2U7XG5cdGNvbnN0cnVjdG9yKCkge31cblx0Z2V0KHRhcmdldCwgbmFtZSwgY3R4KSB7XG5cdFx0aWYgKFtcblx0XHRcdCRleHRyYWN0S2V5JCxcblx0XHRcdCRvcmlnaW5hbEtleSQsXG5cdFx0XHRcIkB0YXJnZXRcIixcblx0XHRcdFwiZGVyZWZcIlxuXHRcdF0uaW5kZXhPZihuYW1lKSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuXHRcdGNvbnN0IHJlZ2lzdHJ5ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdFx0Y29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpO1xuXHRcdGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcblx0XHRjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTtcblx0XHRpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cdFx0dGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsICRleHRyYWN0S2V5JCkgPz8gc2FmZUdldCh0YXJnZXQsICRvcmlnaW5hbEtleSQpID8/IHRhcmdldDtcblx0XHRjb25zdCB2YWx1ZU9yRnggPSBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKTtcblx0XHRpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSByZXR1cm4gdmFsdWVPckZ4O1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpO1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyKSByZXR1cm4gY3JlYXRlVHJpZ2dlckFQSShyZWdpc3RyeSwgKG9wdGlvbnMpID0+IHtcblx0XHRcdGNvbnN0IGtleSA9IG9wdGlvbnMua2V5ID8/IG9wdGlvbnMubmFtZTtcblx0XHRcdGlmIChrZXkgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJ2YWx1ZVwiLCAoKSA9PiB0YXJnZXQuaGFzKGtleSkpO1xuXHRcdFx0Y29uc3Qgb2xkVmFsdWUgPSB0cmlnZ2VyT3B0aW9uVmFsdWUob3B0aW9ucywgXCJvbGRWYWx1ZVwiLCAoKSA9PiB2b2lkIDApO1xuXHRcdFx0cmV0dXJuIHJlZ2lzdHJ5Py50cmlnZ2VyPy4oa2V5LCB2YWx1ZSwgb2xkVmFsdWUsIHRyaWdnZXJPcHRpb25UcmlnZ2VyKG9wdGlvbnMsIFwibWFudWFsXCIpKTtcblx0XHR9LCB0YXJnZXQpO1xuXHRcdGlmIChuYW1lID09IFwiY2xlYXJcIikgcmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlcyA9IEFycmF5LmZyb20odGFyZ2V0Py52YWx1ZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG5cdFx0XHRvbGRWYWx1ZXMuZm9yRWFjaCgob2xkVmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10pIHN1YnNjcmlwdFJlZ2lzdHJ5LmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obnVsbCwgbnVsbCwgb2xkVmFsdWUsIFwiZGVsZXRlXCIpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJkZWxldGVcIikgcmV0dXJuICh2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgaGFkID0gdGFyZ2V0Lmhhcyh2YWx1ZSksIG9sZFZhbHVlID0gaGFkID8gdmFsdWUgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodmFsdWUpO1xuXHRcdFx0aWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHZhbHVlLCBudWxsLCBvbGRWYWx1ZSwgXCJkZWxldGVcIik7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKG5hbWUgPT0gXCJhZGRcIikgcmV0dXJuICh2YWx1ZSkgPT4gcG90ZW50aWFsbHlBc3luYyh2YWx1ZSwgKHYpID0+IHtcblx0XHRcdGNvbnN0IGhhZCA9IHRhcmdldC5oYXModiksIG9sZFZhbHVlID0gaGFkID8gdiA6IG51bGwsIHJlc3VsdCA9IHZhbHVlT3JGeCh2KTtcblx0XHRcdGlmICghdGhpc1skdHJpZ2dlckxvY2tdKSB7XG5cdFx0XHRcdGlmICghaGFkKSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHYsIHYsIG9sZFZhbHVlLCBcImFkZFwiKTtcblx0XHRcdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIGVtaXRSZXNvbHZlZCh0YXJnZXQsIHYsIHYsIG9sZFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlT3JGeDtcblx0fVxuXHRzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiB2YWx1ZSkge1xuXHRcdFx0dGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7XG5cdFx0XHRkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0fVxuXHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIGN0eCwgYXJncyk7XG5cdH1cblx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkge1xuXHRcdHJldHVybiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpO1xuXHR9XG5cdG93bktleXModGFyZ2V0KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHR9XG5cdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0fVxuXHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIHtcblx0XHRsZXQgZ290ID0gdm9pZCAwO1xuXHRcdHRyeSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpPy5hZGQ/LihrZXkpO1xuXHRcdFx0aWYgKF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5oYXM/LihrZXkpKSBnb3QgPSB2b2lkIDA7XG5cdFx0XHRnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Z290ID0gdm9pZCAwO1xuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uZGVsZXRlPy4oa2V5KTtcblx0XHR9XG5cdFx0cmV0dXJuIGdvdDtcblx0fVxuXHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcblx0XHRpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHtcblx0XHRcdGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblx0fVxufTtcbnZhciAkaXNPYnNlcnZhYmxlID0gKHRhcmdldCkgPT4ge1xuXHRyZXR1cm4gISEoKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgJiYgdGFyZ2V0ICE9IG51bGwgJiYgKHRhcmdldD8uWyRleHRyYWN0S2V5JF0gfHwgdGFyZ2V0Py5bJGFmZmVjdGVkXSkpO1xufTtcbnZhciBtYWtlUmVhY3RpdmVQcm9wZXJ0aWVzID0gKG9iaikgPT4ge1xuXHRpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG5cdFx0Y29uc3QgZW50cmllcyA9IG9iai5lbnRyaWVzKCk7XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcykgZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIGtleSk7XG5cdH0gZWxzZSBpZiAob2JqICE9IG51bGwgJiYgKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikpIHtcblx0XHRjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMob2JqKTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBlbnRyaWVzKSBkZWZpbmVSZWFjdGl2ZVByb3BlcnR5KG9iaiwga2V5KTtcblx0fVxufTtcbnZhciBvYnNlcnZlQXJyYXkgPSAoYXJyKSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKGFycikpIHJldHVybiBhcnI7XG5cdG1ha2VSZWFjdGl2ZVByb3BlcnRpZXMoYXJyKTtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChhcnIsIG5ldyBPYnNlcnZlQXJyYXlIYW5kbGVyKCkpLCBhcnIpO1xufTtcbnZhciBvYnNlcnZlT2JqZWN0ID0gKG9iaikgPT4ge1xuXHRpZiAoJGlzT2JzZXJ2YWJsZShvYmopKSByZXR1cm4gb2JqO1xuXHRtYWtlUmVhY3RpdmVQcm9wZXJ0aWVzKG9iaik7XG5cdHJldHVybiBiaW5kRXhpc3RpbmdUaGVuYWJsZXMod3JhcFdpdGgob2JqLCBuZXcgT2JzZXJ2ZU9iamVjdEhhbmRsZXIoKSksIG9iaik7XG59O1xudmFyIG9ic2VydmVNYXAgPSAobWFwKSA9PiB7XG5cdGlmICgkaXNPYnNlcnZhYmxlKG1hcCkpIHJldHVybiBtYXA7XG5cdG1ha2VSZWFjdGl2ZVByb3BlcnRpZXMobWFwKTtcblx0cmV0dXJuIGJpbmRFeGlzdGluZ1RoZW5hYmxlcyh3cmFwV2l0aChtYXAsIG5ldyBPYnNlcnZlTWFwSGFuZGxlcigpKSwgbWFwKTtcbn07XG52YXIgb2JzZXJ2ZVNldCA9IChzZXQpID0+IHtcblx0aWYgKCRpc09ic2VydmFibGUoc2V0KSkgcmV0dXJuIHNldDtcblx0bWFrZVJlYWN0aXZlUHJvcGVydGllcyhzZXQpO1xuXHRyZXR1cm4gd3JhcFdpdGgoc2V0LCBuZXcgT2JzZXJ2ZVNldEhhbmRsZXIoKSk7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY29yZS9QcmltaXRpdmVzLnRzXG52YXIgbnVtYmVyUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3Qgb2JqID0ge1xuXHRcdFskcHJvbWlzZV06IGlzUHJvbWlzZSA/IGluaXRpYWwgOiBudWxsLFxuXHRcdFskdmFsdWVdOiBpc1Byb21pc2UgPyAwIDogTnVtYmVyKGRlcmVmKGluaXRpYWwpIHx8IDApIHx8IDAsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQoKHR5cGVvZiB0aGlzPy5bJHZhbHVlXSAhPSBcIm9iamVjdFwiID8gdGhpcz8uWyR2YWx1ZV0gOiB0aGlzPy5bJHZhbHVlXT8udmFsdWUgfHwgMCkgPz8gMCwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gKHYgIT0gbnVsbCAmJiAhTnVtYmVyLmlzTmFOKHYpID8gTnVtYmVyKHYpIDogdGhpc1skdmFsdWVdKSB8fCAwO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIE51bWJlcih0aGlzWyR2YWx1ZV0gfHwgMCkgfHwgMDtcblx0XHR9XG5cdH07XG5cdGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBcInZhbHVlXCIpO1xuXHRjb25zdCAkciA9IG9ic2VydmUob2JqKTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiAkcjtcbn07XG52YXIgc3RyaW5nUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3Qgb2JqID0ge1xuXHRcdFskcHJvbWlzZV06IGlzUHJvbWlzZSA/IGluaXRpYWwgOiBudWxsLFxuXHRcdFskdmFsdWVdOiAoaXNQcm9taXNlID8gXCJcIiA6IFN0cmluZyhkZXJlZih0eXBlb2YgaW5pdGlhbCA9PSBcIm51bWJlclwiID8gU3RyaW5nKGluaXRpYWwpIDogaW5pdGlhbCB8fCBcIlwiKSkpID8/IFwiXCIsXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIikgPz8gXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQodGhpcz8uWyR2YWx1ZV0gPz8gXCJcIiwgaGludCk7XG5cdFx0fSxcblx0XHRzZXQgdmFsdWUodikge1xuXHRcdFx0dGhpc1skdmFsdWVdID0gU3RyaW5nKHR5cGVvZiB2ID09IFwibnVtYmVyXCIgPyBTdHJpbmcodikgOiB2IHx8IFwiXCIpID8/IFwiXCI7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXNbJHZhbHVlXSA/PyBcIlwiKSA/PyBcIlwiO1xuXHRcdH1cblx0fTtcblx0ZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIFwidmFsdWVcIik7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZShvYmopO1xuXHRpbml0aWFsPy50aGVuPy4oKHYpID0+IHtcblx0XHQkci52YWx1ZSA9IHY7XG5cdFx0JHJbJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZTogdixcblx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciBib29sZWFuUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3Qgb2JqID0ge1xuXHRcdFskcHJvbWlzZV06IGlzUHJvbWlzZSA/IGluaXRpYWwgOiBudWxsLFxuXHRcdFskdmFsdWVdOiAoaXNQcm9taXNlID8gZmFsc2UgOiAoZGVyZWYoaW5pdGlhbCkgIT0gbnVsbCA/IHR5cGVvZiBkZXJlZihpbml0aWFsKSA9PSBcInN0cmluZ1wiID8gdHJ1ZSA6ICEhZGVyZWYoaW5pdGlhbCkgOiBmYWxzZSkgfHwgZmFsc2UpIHx8IGZhbHNlLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXM/LlskdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KCEhdGhpcz8uWyR2YWx1ZV0gfHwgZmFsc2UsIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHRoaXNbJHZhbHVlXSA9ICh2ICE9IG51bGwgPyB0eXBlb2YgdiA9PSBcInN0cmluZ1wiID8gdHJ1ZSA6ICEhdiA6IHRoaXNbJHZhbHVlXSkgfHwgZmFsc2U7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1skdmFsdWVdIHx8IGZhbHNlO1xuXHRcdH1cblx0fTtcblx0ZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eShvYmosIFwidmFsdWVcIik7XG5cdGNvbnN0ICRyID0gb2JzZXJ2ZShvYmopO1xuXHRpbml0aWFsPy50aGVuPy4oKHYpID0+IHtcblx0XHQkci52YWx1ZSA9IHY7XG5cdFx0JHJbJHRyaWdnZXJdPy4oe1xuXHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHR2YWx1ZTogdixcblx0XHRcdHRyaWdnZXI6IFwicmVzb2x2ZWRcIlxuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciB3cmFwUmVmID0gKGluaXRpYWwsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0IGlzUHJvbWlzZSA9IGluaXRpYWwgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiBpbml0aWFsPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3Qgb2JqID0ge1xuXHRcdFskcHJvbWlzZV06IGlzUHJvbWlzZSA/IGluaXRpYWwgOiBudWxsLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHRoaXMudmFsdWUgPz8gXCJcIikgfHwgXCJcIjtcblx0XHR9LFxuXHRcdFtTeW1ib2w/LnRvUHJpbWl0aXZlXShoaW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ5UGFyc2VCeUhpbnQodGhpcy52YWx1ZSwgaGludCk7XG5cdFx0fSxcblx0XHR2YWx1ZTogaXNQcm9taXNlID8gbnVsbCA6IGRlcmVmKGluaXRpYWwpXG5cdH07XG5cdGRlZmluZVJlYWN0aXZlUHJvcGVydHkob2JqLCBcInZhbHVlXCIpO1xuXHRjb25zdCAkciA9IG9ic2VydmUob2JqKTtcblx0aW5pdGlhbD8udGhlbj8uKCh2KSA9PiB7XG5cdFx0JHIudmFsdWUgPSB2O1xuXHRcdCRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IHYsXG5cdFx0XHR0cmlnZ2VyOiBcInJlc29sdmVkXCJcblx0XHR9KTtcblx0fSk7XG5cdGFmZmVjdGVkKGluaXRpYWwsICh2KSA9PiB7XG5cdFx0JHI/LlskdHJpZ2dlcl0/LigpO1xuXHR9KTtcblx0cmV0dXJuICRyO1xufTtcbnZhciBtYXJrUmVhbFByb3AgPSAodGFyZ2V0LCByZWFsUHJvcCkgPT4ge1xuXHRpZiAodGFyZ2V0ID09IG51bGwgfHwgdHlwZW9mIHRhcmdldCAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiB0YXJnZXQgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdGFyZ2V0O1xuXHR0cnkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsICRyZWFsUHJvcCwge1xuXHRcdFx0dmFsdWU6IHJlYWxQcm9wLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhcmdldFskcmVhbFByb3BdID0gcmVhbFByb3A7XG5cdFx0fSBjYXRjaCB7fVxuXHR9XG5cdHRyeSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgXCJyZWFsUHJvcFwiLCB7XG5cdFx0XHR2YWx1ZTogcmVhbFByb3AsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdH0pO1xuXHR9IGNhdGNoIHtcblx0XHR0cnkge1xuXHRcdFx0dGFyZ2V0LnJlYWxQcm9wID0gcmVhbFByb3A7XG5cdFx0fSBjYXRjaCB7fVxuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59O1xudmFyIHByb3BSZWYgPSAoc3JjLCBzcmNQcm9wID0gXCJ2YWx1ZVwiLCBpbml0aWFsLCBiZWhhdmlvcikgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUoc3JjKSB8fCAhc3JjKSByZXR1cm4gc3JjO1xuXHRpZiAoQXJyYXkuaXNBcnJheShzcmMpICYmIHNyYy5sZW5ndGggPT0gMiAmJiBzcmNbMF0gIT0gbnVsbCAmJiAoc3JjWzBdIGluc3RhbmNlb2YgTWFwIHx8IHNyY1swXSBpbnN0YW5jZW9mIFdlYWtNYXAgfHwgc3JjWzBdIGluc3RhbmNlb2YgU2V0IHx8IHNyY1swXSBpbnN0YW5jZW9mIFdlYWtTZXQpKSB7XG5cdFx0aWYgKHNyY1Byb3AgPT0gbnVsbCB8fCBzcmNQcm9wID09PSBcInZhbHVlXCIpIHNyY1Byb3AgPSBzcmNbMV07XG5cdFx0c3JjID0gc3JjWzBdO1xuXHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc3JjKSAmJiAhaXNBcnJheUludmFsaWRLZXkoc3JjPy5bMV0sIHNyYykgJiYgKEFycmF5LmlzQXJyYXkoc3JjPy5bMF0pIHx8IHR5cGVvZiBzcmM/LlswXSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzcmM/LlswXSA9PSBcImZ1bmN0aW9uXCIpKSBzcmMgPSBzcmM/LlswXTtcblx0Y29uc3QgaXNNYXAgPSBzcmMgaW5zdGFuY2VvZiBNYXAgfHwgc3JjIGluc3RhbmNlb2YgV2Vha01hcCB8fCB0eXBlb2Ygc3JjPy5nZXQgPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBzcmM/LnNldCA9PSBcImZ1bmN0aW9uXCIgJiYgKHR5cGVvZiBzcmM/LmRlbGV0ZSA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHNyYz8ucmVtb3ZlID09IFwiZnVuY3Rpb25cIik7XG5cdGNvbnN0IGlzU2V0ID0gc3JjIGluc3RhbmNlb2YgU2V0IHx8IHNyYyBpbnN0YW5jZW9mIFdlYWtTZXQgfHwgdHlwZW9mIHNyYz8uaGFzID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc3JjPy5hZGQgPT0gXCJmdW5jdGlvblwiICYmICh0eXBlb2Ygc3JjPy5kZWxldGUgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBzcmM/LnJlbW92ZSA9PSBcImZ1bmN0aW9uXCIpO1xuXHRpZiAoaXNNYXAgfHwgaXNTZXQpIHtcblx0XHRpZiAoc3JjUHJvcCA9PSBudWxsKSByZXR1cm47XG5cdH0gZWxzZSBpZiAoKHNyY1Byb3AgPz89IEFycmF5LmlzQXJyYXkoc3JjKSA/IG51bGwgOiBcInZhbHVlXCIpID09IG51bGwgfHwgaXNBcnJheUludmFsaWRLZXkoc3JjUHJvcCwgc3JjKSkgcmV0dXJuO1xuXHRjb25zdCByZWFkU2xvdCA9ICgpID0+IHtcblx0XHRpZiAoaXNNYXApIHJldHVybiBzcmM/LmdldD8uKHNyY1Byb3ApO1xuXHRcdGlmIChpc1NldCkgcmV0dXJuIHNyYz8uaGFzPy4oc3JjUHJvcCkgPyBzcmNQcm9wIDogbnVsbDtcblx0XHRyZXR1cm4gc3JjPy5bc3JjUHJvcF07XG5cdH07XG5cdGNvbnN0IHdyaXRlU2xvdCA9ICh2KSA9PiB7XG5cdFx0aWYgKGlzTWFwKSB7XG5cdFx0XHRjb25zdCBtYXAgPSBzcmM7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbCh2LCBtYXA/LmdldD8uKHNyY1Byb3ApKSkgbWFwPy5zZXQ/LihzcmNQcm9wLCB2KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH1cblx0XHRpZiAoaXNTZXQpIHtcblx0XHRcdGNvbnN0IHNldCA9IHNyYztcblx0XHRcdGNvbnN0IG1lbWJlciA9IHYgPz8gc3JjUHJvcDtcblx0XHRcdGlmIChtZW1iZXIgPT0gbnVsbCkge1xuXHRcdFx0XHRzZXQ/LmRlbGV0ZT8uKHNyY1Byb3ApO1xuXHRcdFx0XHRyZXR1cm4gbWVtYmVyO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFzZXQ/Lmhhcz8uKG1lbWJlcikpIHNldD8uYWRkPy4obWVtYmVyKTtcblx0XHRcdHJldHVybiBtZW1iZXI7XG5cdFx0fVxuXHRcdGlmIChpc05vdEVxdWFsKHYsIHNyYz8uW3NyY1Byb3BdKSkgc3JjW3NyY1Byb3BdID0gdjtcblx0XHRyZXR1cm4gdjtcblx0fTtcblx0aWYgKGlzTWFwICYmIGluaXRpYWwgIT09IHZvaWQgMCAmJiAhc3JjPy5oYXM/LihzcmNQcm9wKSkgc3JjPy5zZXQ/LihzcmNQcm9wLCBpbml0aWFsKTtcblx0ZWxzZSBpZiAoaXNTZXQgJiYgaW5pdGlhbCAmJiAhc3JjPy5oYXM/LihzcmNQcm9wKSkgc3JjPy5hZGQ/LihzcmNQcm9wKTtcblx0Y29uc3QgY3VycmVudCA9IHJlYWRTbG90KCk7XG5cdGlmICghaXNTZXQgJiYgc3JjUHJvcCAhPSBudWxsICYmIGhhc1ZhbHVlKGN1cnJlbnQpICYmIGlzT2JzZXJ2YWJsZShjdXJyZW50KSkgcmV0dXJuIG1hcmtSZWFsUHJvcChyZWNvdmVyUmVhY3RpdmUoY3VycmVudCksIHNyY1Byb3ApO1xuXHRpZiAoIWlzTWFwICYmICFpc1NldCAmJiBzcmNQcm9wICYmIHR5cGVvZiBzcmM/LmdldFByb3BlcnR5ID09IFwiZnVuY3Rpb25cIiAmJiBpc09ic2VydmFibGUoc3JjPy5nZXRQcm9wZXJ0eT8uKHNyY1Byb3ApKSkgcmV0dXJuIG1hcmtSZWFsUHJvcChzcmM/LmdldFByb3BlcnR5Py4oc3JjUHJvcCksIHNyY1Byb3ApO1xuXHRpZiAoIWlzTWFwICYmICFpc1NldCkgc3JjW3NyY1Byb3BdID8/PSBpbml0aWFsID8/IHNyYz8uW3NyY1Byb3BdO1xuXHRlbHNlIGlmIChpc01hcCAmJiBpc05vdEVxdWFsKGluaXRpYWwgPz8gc3JjPy5nZXQ/LihzcmNQcm9wKSwgc3JjPy5nZXQ/LihzcmNQcm9wKSkpIHNyYz8uc2V0Py4oc3JjUHJvcCwgaW5pdGlhbCA/PyBzcmM/LmdldD8uKHNyY1Byb3ApKTtcblx0ZWxzZSBpZiAoaXNTZXQgJiYgc3JjPy5oYXM/Lihpbml0aWFsID8/IHNyY1Byb3ApKSBzcmM/LmFkZD8uKGluaXRpYWwgPz8gc3JjUHJvcCk7XG5cdGNvbnN0IHIgPSBvYnNlcnZlKHtcblx0XHRbJHZhbHVlXTogaXNTZXQgPyByZWFkU2xvdCgpIDogcmVhZFNsb3QoKSA/PyBpbml0aWFsLFxuXHRcdFskYmVoYXZpb3JdOiBiZWhhdmlvcixcblx0XHRbU3ltYm9sPy50b1N0cmluZ1RhZ10oKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKHJlYWRTbG90KCkgPz8gdGhpc1skdmFsdWVdID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0fSxcblx0XHRbU3ltYm9sPy50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdFx0cmV0dXJuIHRyeVBhcnNlQnlIaW50KHJlYWRTbG90KCksIGhpbnQpO1xuXHRcdH0sXG5cdFx0c2V0IHZhbHVlKHYpIHtcblx0XHRcdHJbJHRyaWdnZXJMb2NrJDFdID0gdHJ1ZTtcblx0XHRcdGlmIChpc1NldCkgdGhpc1skdmFsdWVdID0gd3JpdGVTbG90KHYpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnN0IG5leHQgPSB2ID8/IGRlZmF1bHRCeVR5cGUocmVhZFNsb3QoKSk7XG5cdFx0XHRcdHRoaXNbJHZhbHVlXSA9IHdyaXRlU2xvdChuZXh0KTtcblx0XHRcdH1cblx0XHRcdHJbJHRyaWdnZXJMb2NrJDFdID0gZmFsc2U7XG5cdFx0fSxcblx0XHRnZXQgdmFsdWUoKSB7XG5cdFx0XHRjb25zdCBzbG90ID0gcmVhZFNsb3QoKTtcblx0XHRcdHJldHVybiB0aGlzWyR2YWx1ZV0gPSBzbG90ID8/IHRoaXNbJHZhbHVlXTtcblx0XHR9XG5cdH0pO1xuXHRtYXJrUmVhbFByb3Aociwgc3JjUHJvcCk7XG5cdGNvbnN0IHVzYiA9IGFmZmVjdGVkKHNyYywgKHYsIF9wcm9wLCBvbGQsIHRyaWdnZXIpID0+IHtcblx0XHRpZiAoX3Byb3AgIT0gc3JjUHJvcCkgcmV0dXJuO1xuXHRcdGlmIChyWyR0cmlnZ2VyTG9jayQxXSkgcmV0dXJuO1xuXHRcdGNvbnN0IG5leHQgPSBpc1NldCA/IHJlYWRTbG90KCkgOiB2O1xuXHRcdGNvbnN0IHByZXYgPSByWyR2YWx1ZV07XG5cdFx0clskdmFsdWVdID0gbmV4dDtcblx0XHRyWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWU6IG5leHQsXG5cdFx0XHRvbGRWYWx1ZTogb2xkID8/IHByZXYsXG5cdFx0XHR0cmlnZ2VyOiB0cmlnZ2VyID8/IFwic2V0XCJcblx0XHR9KTtcblx0fSk7XG5cdGFkZFRvQ2FsbENoYWluKHIsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcjtcbn07XG52YXIgJHJlZiA9ICh0eXBlZCwgYmVoYXZpb3IpID0+IHtcblx0c3dpdGNoICh0eXBlb2YgdHlwZWQpIHtcblx0XHRjYXNlIFwiYm9vbGVhblwiOiByZXR1cm4gYm9vbGVhblJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJudW1iZXJcIjogcmV0dXJuIG51bWJlclJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJzdHJpbmdcIjogcmV0dXJuIHN0cmluZ1JlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRcdGNhc2UgXCJvYmplY3RcIjogaWYgKHR5cGVkICE9IG51bGwpIHJldHVybiB3cmFwUmVmKG9ic2VydmUodHlwZWQpLCBiZWhhdmlvcik7XG5cdFx0ZGVmYXVsdDogcmV0dXJuIHdyYXBSZWYodHlwZWQsIGJlaGF2aW9yKTtcblx0fVxufTtcbnZhciByZWYgPSAodHlwZWQsIHByb3AgPSBcInZhbHVlXCIsIGJlaGF2aW9yKSA9PiB7XG5cdGNvbnN0ICRyID0gaXNPYnNlcnZhYmxlKHR5cGVkKSA/IHR5cGVkIDogJHJlZih0eXBlZCwgYmVoYXZpb3IpO1xuXHRpZiAocHJvcCAhPSBudWxsKSByZXR1cm4gcHJvcFJlZigkciwgcHJvcCwgYmVoYXZpb3IpO1xuXHRlbHNlIHJldHVybiAkcjtcbn07XG52YXIgcHJvbWlzZWQgPSAocHJvbWlzZSwgYmVoYXZpb3IpID0+IHtcblx0cmV0dXJuIHJlZihwcm9taXNlLCBiZWhhdmlvcik7XG59O1xudmFyIHRyaWdnZXJXaXRoRGVsYXkgPSAocmVmLCBjYiwgZGVsYXkgPSAxMDApID0+IHtcblx0aWYgKHJlZj8udmFsdWUgPz8gcmVmKSByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0aWYgKHJlZi52YWx1ZSkgY2I/LigpO1xuXHR9LCBkZWxheSk7XG59O1xudmFyIGRlbGF5ZWRCZWhhdmlvciA9IChkZWxheSA9IDEwMCkgPT4ge1xuXHRyZXR1cm4gKGNiLCBbdmFsXSwgW3NpZ10pID0+IHtcblx0XHRsZXQgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHZhbCwgY2IsIGRlbGF5KTtcblx0XHRzaWc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImFib3J0XCIsICgpID0+IHtcblx0XHRcdGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKTtcblx0XHR9LCB7IG9uY2U6IHRydWUgfSk7XG5cdH07XG59O1xudmFyIGRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciA9IChkZWxheSA9IDEwMCkgPT4ge1xuXHRyZXR1cm4gKGNiLCBbdmFsXSwgW3NpZ10pID0+IHtcblx0XHRsZXQgdG0gPSB0cmlnZ2VyV2l0aERlbGF5KHZhbCwgY2IsIGRlbGF5KTtcblx0XHRzaWc/LmFkZEV2ZW50TGlzdGVuZXI/LihcImFib3J0XCIsICgpID0+IHtcblx0XHRcdGlmICh0bSkgY2xlYXJUaW1lb3V0KHRtKTtcblx0XHR9LCB7IG9uY2U6IHRydWUgfSk7XG5cdFx0aWYgKCF0bSkgY2I/LigpO1xuXHR9O1xufTtcbmZ1bmN0aW9uIG9ic2VydmUodGFyZ2V0LCBzdGF0ZU5hbWUpIHtcblx0aWYgKHRhcmdldCA9PSBudWxsIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJzeW1ib2xcIiB8fCAhKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgfHwgJGlzT2JzZXJ2YWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRpZiAoKHRhcmdldCA9IGRlcmVmPy4odGFyZ2V0KSkgPT0gbnVsbCB8fCB0YXJnZXQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHRhcmdldCBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgJGlzT2JzZXJ2YWJsZSh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRjb25zdCB1bndyYXAgPSB0YXJnZXQ7XG5cdGlmICh1bndyYXAgPT0gbnVsbCB8fCB0eXBlb2YgdW53cmFwID09IFwic3ltYm9sXCIgfHwgISh0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIpIHx8IHVud3JhcCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdW53cmFwIGluc3RhbmNlb2YgV2Vha1JlZikgcmV0dXJuIHVud3JhcDtcblx0bGV0IHJlYWN0aXZlID0gdW53cmFwO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh1bndyYXApKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlQXJyYXkodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH0gZWxzZSBpZiAodW53cmFwIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0cmVhY3RpdmUgPSBvYnNlcnZlTWFwKHVud3JhcCk7XG5cdFx0cmV0dXJuIHJlYWN0aXZlO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCkge1xuXHRcdHJlYWN0aXZlID0gb2JzZXJ2ZVNldCh1bndyYXApO1xuXHRcdHJldHVybiByZWFjdGl2ZTtcblx0fSBlbHNlIGlmICh0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgdW53cmFwID09IFwib2JqZWN0XCIpIHtcblx0XHRyZWFjdGl2ZSA9IG9ic2VydmVPYmplY3QodW53cmFwKTtcblx0XHRyZXR1cm4gcmVhY3RpdmU7XG5cdH1cblx0cmV0dXJuIHJlYWN0aXZlO1xufVxudmFyIGlzT2JzZXJ2YWJsZSA9ICh0YXJnZXQpID0+IHtcblx0aWYgKHR5cGVvZiBIVE1MSW5wdXRFbGVtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkgcmV0dXJuIHRydWU7XG5cdHJldHVybiAhISgodHlwZW9mIHRhcmdldCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0YXJnZXQgPT0gXCJmdW5jdGlvblwiKSAmJiB0YXJnZXQgIT0gbnVsbCAmJiAodGFyZ2V0Py5bJGV4dHJhY3RLZXkkXSB8fCB0YXJnZXQ/LlskYWZmZWN0ZWRdIHx8IHN1YnNjcmlwdFJlZ2lzdHJ5Py5oYXM/Lih0YXJnZXQpKSk7XG59O1xudmFyIHJlY292ZXJSZWFjdGl2ZSA9ICh0YXJnZXQpID0+IHtcblx0cmV0dXJuIGlzT2JzZXJ2YWJsZSh0YXJnZXQpID8gb2JzZXJ2ZSh0YXJnZXQpIDogbnVsbDtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL01haW5saW5lLnRzXG52YXIgdXNlT2JzZXJ2YWJsZSA9ICh1bndyYXApID0+IHtcblx0aWYgKHVud3JhcCA9PSBudWxsIHx8IHR5cGVvZiB1bndyYXAgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdW53cmFwICE9IFwiZnVuY3Rpb25cIiB8fCB1bndyYXA/LltTeW1ib2wub2JzZXJ2YWJsZV0gIT0gbnVsbCkgcmV0dXJuIHVud3JhcDtcblx0dHJ5IHtcblx0XHR1bndyYXBbU3ltYm9sLm9ic2VydmFibGVdID0gc2VsZj8uY29tcGF0aWJsZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUud2FybihcIlVuYWJsZSB0byBhc3NpZ24gPFtTeW1ib2wub2JzZXJ2YWJsZV0+LCBvYmplY3Qgd2lsbCBub3Qgb2JzZXJ2YWJsZSBieSBvdGhlciBmcmFtZXdvcmtzXCIpO1xuXHR9XG5cdHVud3JhcFskYWZmZWN0ZWRdID0gKGNiLCBwcm9wLCBvcHRpb25zKSA9PiB7XG5cdFx0Y29uc3Qgb2JzZXJ2YWJsZSA9IHVud3JhcD8uW1N5bWJvbD8ub2JzZXJ2YWJsZV07XG5cdFx0b2JzZXJ2YWJsZT8uKCk/LmFmZmVjdGVkPy4oY2IsIHByb3AsIG9wdGlvbnMpO1xuXHRcdHJldHVybiAoKSA9PiBvYnNlcnZhYmxlPy4oKT8udW5hZmZlY3RlZD8uKGNiLCBwcm9wKTtcblx0fTtcblx0cmV0dXJuIHVud3JhcDtcbn07XG52YXIgc3BlY2lhbGl6ZWRTdWJzY3JpYmUgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBjaGVja1ZhbGlkT2JqID0gKG9iaikgPT4ge1xuXHRpZiAodHlwZW9mIG9iaiA9PSBcInN5bWJvbFwiIHx8IG9iaiA9PSBudWxsIHx8ICEodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiKSkgcmV0dXJuO1xuXHRyZXR1cm4gb2JqO1xufTtcbnZhciBpbml0aWFsVHJpZ2dlciA9IFwiaW5pdGlhbFwiO1xudmFyIHJlYWxQcm9wT2YgPSAodGFyZ2V0KSA9PiB7XG5cdGNvbnN0IHByb3AgPSB0YXJnZXQ/LlskcmVhbFByb3BdID8/IHRhcmdldD8ucmVhbFByb3A7XG5cdHJldHVybiBpc0tleVR5cGUocHJvcCkgPyBwcm9wIDogbnVsbDtcbn07XG52YXIgbm9ybWFsaXplQWZmZWN0ZWRQcm9wID0gKHRhcmdldCwgcHJvcCkgPT4ge1xuXHRjb25zdCByZWFsUHJvcCA9IHJlYWxQcm9wT2YodGFyZ2V0KTtcblx0aWYgKHJlYWxQcm9wICE9IG51bGwgJiYgKHByb3AgPT0gbnVsbCB8fCBwcm9wID09IFwidmFsdWVcIikpIHJldHVybiByZWFsUHJvcDtcblx0cmV0dXJuIHByb3A7XG59O1xudmFyIHByb3BWYWx1ZU9mID0gKHRhcmdldCwgcHJvcCkgPT4ge1xuXHRpZiAocHJvcCAhPSBudWxsICYmIHByb3AgPT0gcmVhbFByb3BPZih0YXJnZXQpKSByZXR1cm4gdGFyZ2V0Py52YWx1ZTtcblx0cmV0dXJuIHRhcmdldD8uW3Byb3BdO1xufTtcbnZhciBjYWxsQnlQcm9wUmVmQXdhcmUgPSAodGFyZ2V0LCBwcm9wLCBjYiwgY3R4KSA9PiB7XG5cdGlmIChwcm9wICE9IG51bGwgJiYgcHJvcCA9PSByZWFsUHJvcE9mKHRhcmdldCkpIHtcblx0XHRjb25zdCB2YWx1ZSA9IHByb3BWYWx1ZU9mKHRhcmdldCwgcHJvcCk7XG5cdFx0aWYgKHZhbHVlICE9IG51bGwpIHJldHVybiBjYj8uKHZhbHVlLCBwcm9wLCBudWxsLCBcInNldFwiKTtcblx0fVxuXHRyZXR1cm4gY2FsbEJ5UHJvcCh0YXJnZXQsIHByb3AsIGNiLCBjdHgpO1xufTtcbnZhciB3aXRoVHJpZ2dlciA9IChjYiwgb3B0aW9ucywgdHJpZ2dlcikgPT4ge1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpO1xuXHRpZiAodHJpZ2dlciA9PSBpbml0aWFsVHJpZ2dlcikge1xuXHRcdGlmICghbm9ybWFsaXplZC50cmlnZ2VySW1tZWRpYXRlbHkpIHJldHVybjtcblx0fSBlbHNlIGlmICghdHJpZ2dlckZpbHRlckFsbG93cyhub3JtYWxpemVkLmFmZmVjdFR5cGVzLCB0cmlnZ2VyKSkgcmV0dXJuO1xuXHRyZXR1cm4gKHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgLi4uZXRjKSA9PiBjYj8uKHZhbHVlLCBuYW1lLCBvbGRWYWx1ZSwgdHJpZ2dlciwgLi4uZXRjKTtcbn07XG52YXIgc3Vic2NyaWJlRGlyZWN0bHkgPSAodGFyZ2V0LCBwcm9wLCBjYiwgb3B0aW9ucyA9IFtcIipcIl0pID0+IHtcblx0aWYgKCF0YXJnZXQpIHJldHVybjtcblx0aWYgKCFjaGVja1ZhbGlkT2JqKHRhcmdldCkpIHJldHVybjtcblx0Y29uc3QgdFByb3AgPSBwcm9wICE9IFN5bWJvbC5pdGVyYXRvciA/IG5vcm1hbGl6ZUFmZmVjdGVkUHJvcCh0YXJnZXQsIHByb3ApIDogbnVsbDtcblx0bGV0IHJlZ2lzdHJ5ID0gdGFyZ2V0Py5bJHJlZ2lzdHJ5S2V5JF0gPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk7XG5cdHRhcmdldCA9IHRhcmdldD8uWyRleHRyYWN0S2V5JF0gPz8gdGFyZ2V0O1xuXHRzY2hlZHVsZXI/LnlpZWxkPy4oKT8udGhlbj8uKCgpID0+IHtcblx0XHRjb25zdCBpbml0aWFsQ2IgPSB3aXRoVHJpZ2dlcihjYiwgb3B0aW9ucywgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdGlmICghaW5pdGlhbENiKSByZXR1cm47XG5cdFx0aWYgKHRQcm9wICE9IG51bGwgJiYgdFByb3AgIT0gU3ltYm9sLml0ZXJhdG9yKSBjYWxsQnlQcm9wUmVmQXdhcmUodGFyZ2V0LCB0UHJvcCwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRlbHNlIGNhbGxCeUFsbFByb3AodGFyZ2V0LCBpbml0aWFsQ2IsIG51bGwpO1xuXHR9KTtcblx0bGV0IHVuU3ViID0gcmVnaXN0cnk/LmFmZmVjdGVkPy4oY2IsIHRQcm9wLCBvcHRpb25zKTtcblx0aWYgKHRhcmdldD8uW1N5bWJvbC5kaXNwb3NlXSkgcmV0dXJuIHVuU3ViO1xuXHRhZGRUb0NhbGxDaGFpbih1blN1YiwgU3ltYm9sLmRpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odW5TdWIsIFN5bWJvbC5hc3luY0Rpc3Bvc2UsIHVuU3ViKTtcblx0YWRkVG9DYWxsQ2hhaW4odGFyZ2V0LCBTeW1ib2wuZGlzcG9zZSwgdW5TdWIpO1xuXHRhZGRUb0NhbGxDaGFpbih0YXJnZXQsIFN5bWJvbC5hc3luY0Rpc3Bvc2UsIHVuU3ViKTtcblx0cmV0dXJuIHVuU3ViO1xufTtcbnZhciBzdWJzY3JpYmVJbnB1dCA9ICh0ZywgXywgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdGNvbnN0IGFmZmVjdFR5cGVzID0gbm9ybWFsaXplQWZmZWN0ZWRPcHRpb25zKG9wdGlvbnMpLmFmZmVjdFR5cGVzO1xuXHRjb25zdCAkb3B0ID0ge307XG5cdGxldCBvbGRWYWx1ZSA9IHRnPy52YWx1ZTtcblx0Y29uc3QgJGNiID0gKGV2KSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSBldj8udGFyZ2V0Py52YWx1ZTtcblx0XHRpZiAodHJpZ2dlckZpbHRlckFsbG93cyhhZmZlY3RUeXBlcywgXCJzZXRcIikpIGNiPy4odmFsdWUsIFwidmFsdWVcIiwgb2xkVmFsdWUsIFwic2V0XCIsIGV2KTtcblx0XHRvbGRWYWx1ZSA9IHZhbHVlO1xuXHR9O1xuXHR0Zz8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwiY2hhbmdlXCIsICRjYiwgJG9wdCk7XG5cdHJldHVybiAoKSA9PiB0Zz8ucmVtb3ZlRXZlbnRMaXN0ZW5lcj8uKFwiY2hhbmdlXCIsICRjYiwgJG9wdCk7XG59O1xudmFyIGNoZWNrSXNQYWlyZWQgPSAodGcpID0+IHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodGcpICYmIHRnPy5sZW5ndGggPT0gMiAmJiBjaGVja1ZhbGlkT2JqKHRnPy5bMF0pICYmIChpc0tleVR5cGUodGc/LlsxXSkgfHwgdGc/LlsxXSA9PSBTeW1ib2wuaXRlcmF0b3IpO1xufTtcbnZhciBpc0VmZmVjdE9wdGlvbnNBcmcgPSAodmFsdWUpID0+IHtcblx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIChcImFmZmVjdFR5cGVzXCIgaW4gdmFsdWUgfHwgXCJ0cmlnZ2Vyc1wiIGluIHZhbHVlIHx8IFwidHJpZ2dlckltbWVkaWF0ZWx5XCIgaW4gdmFsdWUpO1xufTtcbnZhciBub3JtYWxpemVFZmZlY3RUYXJnZXRzID0gKHRhcmdldHMpID0+IHtcblx0aWYgKHRhcmdldHMgPT0gbnVsbCkgcmV0dXJuIFtdO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXRzKSAmJiAhY2hlY2tJc1BhaXJlZCh0YXJnZXRzKSAmJiAhaXNPYnNlcnZhYmxlKHRhcmdldHMpKSByZXR1cm4gdGFyZ2V0cztcblx0cmV0dXJuIFt0YXJnZXRzXTtcbn07XG52YXIgZWZmZWN0VGFyZ2V0Q29udGV4dCA9IChzb3VyY2UpID0+IHtcblx0aWYgKGNoZWNrSXNQYWlyZWQoc291cmNlKSkge1xuXHRcdGNvbnN0IHRhcmdldCA9IHNvdXJjZT8uWzBdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzb3VyY2UsXG5cdFx0XHR0YXJnZXQsXG5cdFx0XHRwcm9wOiBub3JtYWxpemVBZmZlY3RlZFByb3AodGFyZ2V0LCBzb3VyY2U/LlsxXSlcblx0XHR9O1xuXHR9XG5cdHJldHVybiB7XG5cdFx0c291cmNlLFxuXHRcdHRhcmdldDogc291cmNlLFxuXHRcdHByb3A6IG51bGxcblx0fTtcbn07XG52YXIgdG9FZmZlY3RFdmVudCA9IChzb3VyY2UsIHRhcmdldCwgdmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyLCBhcmdzKSA9PiAoe1xuXHRzb3VyY2UsXG5cdHRhcmdldCxcblx0dmFsdWUsXG5cdHByb3AsXG5cdG5hbWU6IHByb3AsXG5cdG9sZFZhbHVlLFxuXHR0cmlnZ2VyLFxuXHRhcmdzXG59KTtcbnZhciBzdWJzY3JpYmVQYWlyZWQgPSAodGcsIF8sIGNiLCBvcHRpb25zID0gW1wiKlwiXSkgPT4ge1xuXHRjb25zdCBwcm9wID0gaXNLZXlUeXBlKHRnPy5bMV0pID8gdGc/LlsxXSA6IG51bGw7XG5cdHJldHVybiBhZmZlY3RlZCh0Zz8uWzBdLCBwcm9wLCBjYiwgb3B0aW9ucyk7XG59O1xudmFyIHN1YnNjcmliZVRoZW5hYmxlID0gKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMgPSBbXCIqXCJdKSA9PiB7XG5cdHJldHVybiBvYmo/LnRoZW4/Ligob2JqKSA9PiBhZmZlY3RlZD8uKG9iaiwgcHJvcCwgY2IsIG9wdGlvbnMpKT8uY2F0Y2g/LigoZSkgPT4ge1xuXHRcdGNvbnNvbGUud2FybihlKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fSk7XG59O1xudmFyIGFmZmVjdGVkID0gKG9iaiwgcHJvcCwgY2IgPSAoKSA9PiB7fSwgb3B0aW9ucykgPT4ge1xuXHRsZXQga2V5ID0gbnVsbDtcblx0aWYgKHR5cGVvZiBwcm9wID09IFwiZnVuY3Rpb25cIikge1xuXHRcdG9wdGlvbnMgPSBjYjtcblx0XHRjYiA9IHByb3A7XG5cdH0gZWxzZSBrZXkgPSBub3JtYWxpemVBZmZlY3RlZFByb3Aob2JqLCBwcm9wKTtcblx0aWYgKHR5cGVvZiBjYiA9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkoY2IpKSB7XG5cdFx0b3B0aW9ucyA9IGNiO1xuXHRcdGNiID0gKCkgPT4ge307XG5cdH1cblx0aWYgKGlzUHJpbWl0aXZlKG9iaikgfHwgdHlwZW9mIG9iaiA9PSBcInN5bWJvbFwiKSB7XG5cdFx0aWYgKG5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyhvcHRpb25zKS50cmlnZ2VySW1tZWRpYXRlbHkpIHJldHVybiBQcm9taXNlZChnbG9iYWxUaGlzPy5Qcm9taXNlPy50cnk/LigoKSA9PiB7XG5cdFx0XHRyZXR1cm4gY2I/LihvYmosIG51bGwsIG51bGwsIG51bGwsIGluaXRpYWxUcmlnZ2VyKTtcblx0XHR9KSk7XG5cdH1cblx0aWYgKHR5cGVvZiBvYmo/LlskYWZmZWN0ZWRdID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG9iaj8uWyRhZmZlY3RlZF0/LihjYiwga2V5LCBvcHRpb25zKTtcblx0ZWxzZSBpZiAoY2hlY2tWYWxpZE9iaihvYmopKSB7XG5cdFx0Y29uc3Qgd3JhcHBlZCA9IG9iajtcblx0XHRpZiAoc3BlY2lhbGl6ZWRTdWJzY3JpYmU/Lmhhcz8uKG9iaiA9IG9iaj8uWyRleHRyYWN0S2V5JF0gPz8gb2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXQ/LihvYmopPy4od3JhcHBlZCwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKGlzT2JzZXJ2YWJsZSh3cmFwcGVkKSB8fCBjaGVja0lzUGFpcmVkKG9iaikgJiYgaXNPYnNlcnZhYmxlKG9iaj8uWzBdKSkge1xuXHRcdFx0aWYgKGlzVGhlbmFibGUob2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlVGhlbmFibGUpPy4ob2JqLCBrZXksIGNiLCBvcHRpb25zKTtcblx0XHRcdGVsc2UgaWYgKGNoZWNrSXNQYWlyZWQob2JqKSkgcmV0dXJuIHNwZWNpYWxpemVkU3Vic2NyaWJlPy5nZXRPckluc2VydD8uKG9iaiwgc3Vic2NyaWJlUGFpcmVkKT8uKG9iaiwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgSFRNTElucHV0RWxlbWVudCAhPSBcInVuZGVmaW5lZFwiICYmIG9iaiBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZUlucHV0KT8uKG9iaiwga2V5LCBjYiwgb3B0aW9ucyk7XG5cdFx0XHRlbHNlIHJldHVybiBzcGVjaWFsaXplZFN1YnNjcmliZT8uZ2V0T3JJbnNlcnQ/LihvYmosIHN1YnNjcmliZURpcmVjdGx5KT8uKHdyYXBwZWQsIGtleSwgY2IsIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBpbml0aWFsQ2IgPSB3aXRoVHJpZ2dlcihjYiwgb3B0aW9ucywgaW5pdGlhbFRyaWdnZXIpO1xuXHRcdFx0aWYgKCFpbml0aWFsQ2IpIHJldHVybjtcblx0XHRcdHJldHVybiBQcm9taXNlZChnbG9iYWxUaGlzPy5Qcm9taXNlPy50cnk/LigoKSA9PiB7XG5cdFx0XHRcdGlmIChjaGVja0lzUGFpcmVkKG9iaikpIHJldHVybiBjYWxsQnlQcm9wUmVmQXdhcmU/LihvYmo/LlswXSwgb2JqPy5bMV0sIGluaXRpYWxDYiwgbnVsbCk7XG5cdFx0XHRcdGVsc2UgaWYgKGtleSAhPSBudWxsICYmIGtleSAhPSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBjYWxsQnlQcm9wUmVmQXdhcmU/LihvYmosIGtleSwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdFx0ZWxzZSByZXR1cm4gY2FsbEJ5QWxsUHJvcD8uKG9iaiwgaW5pdGlhbENiLCBudWxsKTtcblx0XHRcdH0pKTtcblx0XHR9XG5cdH1cbn07XG5mdW5jdGlvbiBlZmZlY3QoY2IsIHRhcmdldHMsIG9wdGlvbnMpIHtcblx0aWYgKGNiID09IG51bGwgfHwgdHlwZW9mIGNiICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRpZiAoaXNFZmZlY3RPcHRpb25zQXJnKHRhcmdldHMpICYmIG9wdGlvbnMgPT09IHZvaWQgMCkgcmV0dXJuIGVmZmVjdEdsb2JhbGx5KGNiLCB0YXJnZXRzKTtcblx0aWYgKHRhcmdldHMgPT0gbnVsbCkgcmV0dXJuIGVmZmVjdEdsb2JhbGx5KGNiLCBvcHRpb25zKTtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMob3B0aW9ucyk7XG5cdGNvbnN0IGFmZmVjdGVkT3B0aW9ucyA9IHtcblx0XHRhZmZlY3RUeXBlczogbm9ybWFsaXplZC5hZmZlY3RUeXBlcyxcblx0XHR0cmlnZ2VySW1tZWRpYXRlbHk6IG5vcm1hbGl6ZWQudHJpZ2dlckltbWVkaWF0ZWx5XG5cdH07XG5cdGNvbnN0IGRpc3Bvc2VycyA9IG5vcm1hbGl6ZUVmZmVjdFRhcmdldHModGFyZ2V0cykubWFwKChzb3VyY2UpID0+IHtcblx0XHRjb25zdCBjdHggPSBlZmZlY3RUYXJnZXRDb250ZXh0KHNvdXJjZSk7XG5cdFx0cmV0dXJuIGFmZmVjdGVkKGN0eC50YXJnZXQsIGN0eC5wcm9wLCAodmFsdWUsIHByb3AsIG9sZFZhbHVlLCB0cmlnZ2VyLCAuLi5hcmdzKSA9PiB7XG5cdFx0XHRyZXR1cm4gY2IodG9FZmZlY3RFdmVudChjdHguc291cmNlLCBjdHgudGFyZ2V0LCB2YWx1ZSwgcHJvcCwgb2xkVmFsdWUsIHRyaWdnZXIgPz8gbnVsbCwgYXJncykpO1xuXHRcdH0sIGFmZmVjdGVkT3B0aW9ucyk7XG5cdH0pLmZpbHRlcigoZGlzcG9zZSkgPT4gdHlwZW9mIGRpc3Bvc2UgPT0gXCJmdW5jdGlvblwiKTtcblx0cmV0dXJuICgpID0+IGRpc3Bvc2Vycy5mb3JFYWNoKChkaXNwb3NlKSA9PiBkaXNwb3NlPy4oKSk7XG59XG5mdW5jdGlvbiBlZmZlY3RlZCh0YXJnZXRzLCBjYiwgb3B0aW9ucykge1xuXHRyZXR1cm4gZWZmZWN0KGNiLCB0YXJnZXRzLCBvcHRpb25zKTtcbn1cbnZhciBtYWtlQXJyYXlPYnNlcnZhYmxlID0gKHRnKSA9PiB7XG5cdGlmICh0ZyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIG9ic2VydmFibGVCeVNldCh0Zyk7XG5cdGlmICh0ZyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIG9ic2VydmFibGVCeU1hcCh0Zyk7XG5cdHJldHVybiB0Zztcbn07XG52YXIgRG91YmxlV2Vha01hcCA9IGNsYXNzIHtcblx0I3RvcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHQjZW5zdXJlSW5uZXIoa2V5MSkge1xuXHRcdGlmIChrZXkxID09IG51bGwgfHwgdHlwZW9mIGtleTEgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTEgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG51bGw7XG5cdFx0bGV0IGlubmVyID0gdGhpcy4jdG9wLmdldChrZXkxKTtcblx0XHRpZiAoIWlubmVyKSB7XG5cdFx0XHRpbm5lciA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRcdFx0dGhpcy4jdG9wLnNldChrZXkxLCBpbm5lcik7XG5cdFx0fVxuXHRcdHJldHVybiBpbm5lcjtcblx0fVxuXHQjc3BsaXRQYWlyKHBhaXIpIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkocGFpcikgfHwgcGFpci5sZW5ndGggIT09IDIpIHJldHVybiBbbnVsbCwgbnVsbF07XG5cdFx0cmV0dXJuIHBhaXI7XG5cdH1cblx0aGFzTDEoa2V5MSkge1xuXHRcdHJldHVybiB0aGlzLiN0b3AuaGFzKGtleTEpO1xuXHR9XG5cdHNldChwYWlyLCB2YWx1ZSkge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI2Vuc3VyZUlubmVyKGtleTEpO1xuXHRcdGlmICghaW5uZXIgfHwga2V5MiA9PSBudWxsIHx8IHR5cGVvZiBrZXkyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkyICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0aGlzO1xuXHRcdGlubmVyLnNldChrZXkyLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0Z2V0KHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdm9pZCAwO1xuXHRcdHJldHVybiB0aGlzLiN0b3AuZ2V0KGtleTEpPy5nZXQoa2V5Mik7XG5cdH1cblx0aGFzKHBhaXIpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0aWYgKGtleTEgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRoaXMuI3RvcC5nZXQoa2V5MSk/LmhhcyhrZXkyKSA/PyBmYWxzZTtcblx0fVxuXHRkZWxldGUocGFpcikge1xuXHRcdGNvbnN0IFtrZXkxLCBrZXkyXSA9IHRoaXMuI3NwbGl0UGFpcihwYWlyKTtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRjb25zdCBpbm5lciA9IHRoaXMuI3RvcC5nZXQoa2V5MSk7XG5cdFx0cmV0dXJuIGlubmVyID8gaW5uZXIuZGVsZXRlKGtleTIpIDogZmFsc2U7XG5cdH1cblx0ZGVsZXRlVG9wKGtleTEpIHtcblx0XHRpZiAoa2V5MSA9PSBudWxsIHx8IHR5cGVvZiBrZXkxICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBrZXkxICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy4jdG9wLmRlbGV0ZShrZXkxKTtcblx0fVxuXHRnZXRPckNyZWF0ZShwYWlyLCBmYWN0b3J5KSB7XG5cdFx0Y29uc3QgW2tleTEsIGtleTJdID0gdGhpcy4jc3BsaXRQYWlyKHBhaXIpO1xuXHRcdGNvbnN0IGlubmVyID0gdGhpcy4jZW5zdXJlSW5uZXIoa2V5MSk7XG5cdFx0aWYgKCFpbm5lciB8fCBrZXkyID09IG51bGwgfHwgdHlwZW9mIGtleTIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGtleTIgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhY3Rvcnk/LigpO1xuXHRcdGlmIChpbm5lci5oYXMoa2V5MikpIHJldHVybiBpbm5lci5nZXQoa2V5Mik7XG5cdFx0Y29uc3QgdmFsdWUgPSBmYWN0b3J5KCk7XG5cdFx0aW5uZXIuc2V0KGtleTIsIHZhbHVlKTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblx0Z2V0T3JJbnNlcnQocGFpciwgdmFsdWUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRnZXRPckluc2VydENvbXB1dGVkKHBhaXIsIGNvbXB1dGUpIHtcblx0XHRjb25zdCBba2V5MSwga2V5Ml0gPSB0aGlzLiNzcGxpdFBhaXIocGFpcik7XG5cdFx0Y29uc3QgaW5uZXIgPSB0aGlzLiNlbnN1cmVJbm5lcihrZXkxKTtcblx0XHRpZiAoIWlubmVyIHx8IGtleTIgPT0gbnVsbCB8fCB0eXBlb2Yga2V5MiAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Yga2V5MiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY29tcHV0ZT8uKFtrZXkxLCBrZXkyXSk7XG5cdFx0aWYgKGlubmVyLmhhcyhrZXkyKSkgcmV0dXJuIGlubmVyLmdldChrZXkyKTtcblx0XHRjb25zdCB2YWx1ZSA9IGNvbXB1dGUoW2tleTEsIGtleTJdKTtcblx0XHRpbm5lci5zZXQoa2V5MiwgdmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxufTtcbnZhciByZWdpc3RlcmVkSXRlcmF0ZWQgPSBuZXcgRG91YmxlV2Vha01hcCgpO1xuZnVuY3Rpb24gaXRlcmF0ZWQodGcsIGNiLCBvcHRpb25zID0gW1wiKlwiXSkge1xuXHRpZiAoIXRnKSByZXR1cm47XG5cdGlmICh0eXBlb2YgdGcgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHRnICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0aWYgKHJlZ2lzdGVyZWRJdGVyYXRlZC5oYXMoW3RnLCBjYl0pKSByZXR1cm4gcmVnaXN0ZXJlZEl0ZXJhdGVkLmdldChbdGcsIGNiXSk7XG5cdGNvbnN0ICRzdWIgPSAodmFsdWUsIG5hbWUsIG9sZCwgdHJpZ2dlcikgPT4ge1xuXHRcdGlmIChuYW1lID09IFwidmFsdWVcIikge1xuXHRcdFx0Y29uc3QgZW50cmllcyA9IChvbGQ/LnZhbHVlID8/IG9sZCk/LmVudHJpZXM/LigpO1xuXHRcdFx0Y29uc3QgYmFzaXMgPSB0Zz8udmFsdWUgPz8gdmFsdWU/LnZhbHVlID8/IHZhbHVlO1xuXHRcdFx0aWYgKGVudHJpZXMpIGZvciAoY29uc3QgW2lkeCwgaXRlbV0gb2YgZW50cmllcykge1xuXHRcdFx0XHRjb25zdCBvZk9sZCA9IGl0ZW0gPz8gKG9sZD8udmFsdWUgPz8gb2xkKT8uW2lkeF0gPz8gbnVsbDtcblx0XHRcdFx0Y29uc3Qgb2ZOZXcgPSBiYXNpcz8uW2lkeF07XG5cdFx0XHRcdGlmIChvZk9sZCA9PSBudWxsICYmIG9mTmV3ICE9IG51bGwpIGNiKG9mTmV3LCBpZHgsIG51bGwsIFwiYWRkXCIpO1xuXHRcdFx0XHRlbHNlIGlmIChvZk9sZCAhPSBudWxsICYmIG9mTmV3ID09IG51bGwpIGNiKG51bGwsIGlkeCwgb2ZPbGQsIFwiZGVsZXRlXCIpO1xuXHRcdFx0XHRlbHNlIGlmIChpc05vdEVxdWFsKG9mT2xkLCBvZk5ldykpIGNiKG9mTmV3LCBpZHgsIG9mT2xkLCBcInNldFwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpdGVyYXRlZCh2YWx1ZSA/PyB0Zz8udmFsdWUsIGNiLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5hbWUgPT0gbnVsbCA/IHZvaWQgMCA6IHRnW25hbWVdO1xuXHR9O1xuXHRyZXR1cm4gcmVnaXN0ZXJlZEl0ZXJhdGVkLmdldE9ySW5zZXJ0Q29tcHV0ZWQoW3RnLCBjYl0sICgpID0+IHtcblx0XHRpZiAodGcgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBhZmZlY3RlZChbb2JzZXJ2YWJsZUJ5U2V0KHRnKSwgU3ltYm9sLml0ZXJhdG9yXSwgY2IsIG9wdGlvbnMpO1xuXHRcdGlmICh0ZyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIGFmZmVjdGVkKHRnLCBjYiwgb3B0aW9ucyk7XG5cdFx0aWYgKGhhc1ZhbHVlKHRnKSkgcmV0dXJuIGFmZmVjdGVkKHRnLCAkc3ViLCBvcHRpb25zKTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh0ZykgJiYgISh0Zz8ubGVuZ3RoID09IDIgJiYgaXNLZXlUeXBlKHRnPy5bMV0pICYmIGlzT2JzZXJ2YWJsZSh0Zz8uWzBdKSkpIHJldHVybiBhZmZlY3RlZChbdGcsIFN5bWJvbC5pdGVyYXRvcl0sIGNiLCBvcHRpb25zKTtcblx0XHRyZXR1cm4gYWZmZWN0ZWQodGcsIGNiLCBvcHRpb25zKTtcblx0fSk7XG59XG5mdW5jdGlvbiB1bmFmZmVjdGVkKHRnLCBjYikge1xuXHRyZXR1cm4gd2l0aFByb21pc2UodGcsICh0YXJnZXQpID0+IHtcblx0XHRjb25zdCBpc1BhaXIgPSBBcnJheS5pc0FycmF5KHRhcmdldCkgJiYgdGFyZ2V0Py5sZW5ndGggPT0gMiAmJiBbXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiXS5pbmRleE9mKHR5cGVvZiB0YXJnZXQ/LlswXSkgPj0gMCAmJiBpc0tleVR5cGUodGFyZ2V0Py5bMV0pO1xuXHRcdGNvbnN0IHByb3AgPSBpc1BhaXIgPyB0YXJnZXQ/LlsxXSA6IG51bGw7XG5cdFx0dGFyZ2V0ID0gaXNQYWlyICYmIHByb3AgIT0gbnVsbCA/IHRhcmdldD8uWzBdID8/IHRhcmdldCA6IHRhcmdldDtcblx0XHRjb25zdCB1bndyYXAgPSB0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LlskZXh0cmFjdEtleSRdID8/IHRhcmdldCA6IHRhcmdldDtcblx0XHQodGFyZ2V0Py5bJHJlZ2lzdHJ5S2V5JF0gPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHVud3JhcCkpPy51bmFmZmVjdGVkPy4oY2IsIHByb3ApO1xuXHR9KTtcbn1cbnZhciBiaW5kQnkgPSAodGFyZ2V0LCByZWFjdGl2ZSwgd2F0Y2gpID0+IHtcblx0YWZmZWN0ZWQocmVhY3RpdmUsIG51bGwsICh2LCBwKSA9PiB7XG5cdFx0b2JqZWN0QXNzaWduKHRhcmdldCwgdiwgcCwgdHJ1ZSk7XG5cdH0pO1xuXHR3YXRjaD8uKCgpID0+IHRhcmdldCwgKE4pID0+IHtcblx0XHRmb3IgKGNvbnN0IGsgaW4gTikgb2JqZWN0QXNzaWduKHJlYWN0aXZlLCBOW2tdLCBrLCB0cnVlKTtcblx0fSwgeyBkZWVwOiB0cnVlIH0pO1xuXHRyZXR1cm4gdGFyZ2V0O1xufTtcbnZhciBkZXJpdmF0ZSA9IChmcm9tLCByZWFjdEZuLCB3YXRjaCkgPT4gYmluZEJ5KHJlYWN0Rm4oc2FmZShmcm9tKSksIGZyb20sIHdhdGNoKTtcbnZhciBiaW5kQnlLZXkgPSAodGFyZ2V0LCByZWFjdGl2ZSwga2V5ID0gKCkgPT4gXCJcIikgPT4gYWZmZWN0ZWQocmVhY3RpdmUsIG51bGwsICh2YWx1ZSwgcCkgPT4ge1xuXHRpZiAocCA9PSBrZXkoKSkgb2JqZWN0QXNzaWduKHRhcmdldCwgdmFsdWUsIG51bGwsIHRydWUpO1xufSk7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb3JlL0Fzc2lnbmVkLnRzXG52YXIgY29uZGl0aW9uYWxJbmRleCA9IChjb25kTGlzdCA9IFtdKSA9PiB7XG5cdGNvbnN0IHNvdXJjZSA9IG9ic2VydmUoeyB2YWx1ZTogMCB9KTtcblx0Y29uc3QgcmVhZENvbmRpdGlvbiA9IChjb25kaXRpb24pID0+IHtcblx0XHRpZiAodHlwZW9mIGNvbmRpdGlvbiA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb25kaXRpb24oKTtcblx0XHRyZXR1cm4gaGFzVmFsdWUoY29uZGl0aW9uKSA/IGNvbmRpdGlvbi52YWx1ZSA6IGNvbmRpdGlvbjtcblx0fTtcblx0Y29uc3QgZXZhbHVhdGUgPSAoKSA9PiBjb25kTGlzdC5maW5kSW5kZXgoKGNvbmRpdGlvbikgPT4gISFyZWFkQ29uZGl0aW9uKGNvbmRpdGlvbikpO1xuXHRjb25zdCByZXN1bHQgPSBjb21wdXRlZChbc291cmNlLCBcInZhbHVlXCJdLCBldmFsdWF0ZSwgXCJ2YWx1ZVwiKTtcblx0Y29uc3QgaW52YWxpZGF0ZSA9ICgpID0+IHtcblx0XHRzb3VyY2UudmFsdWUrKztcblx0fTtcblx0Y29uc3QgZGlzcG9zZXJzID0gW107XG5cdGlmIChpc09ic2VydmFibGUoY29uZExpc3QpKSBkaXNwb3NlcnMucHVzaChhZmZlY3RlZChjb25kTGlzdCwgaW52YWxpZGF0ZSwge1xuXHRcdGFmZmVjdFR5cGVzOiBbXG5cdFx0XHRcImFkZFwiLFxuXHRcdFx0XCJzZXRcIixcblx0XHRcdFwiZGVsZXRlXCJcblx0XHRdLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogZmFsc2Vcblx0fSkpO1xuXHRmb3IgKGNvbnN0IGNvbmRpdGlvbiBvZiBjb25kTGlzdCkgaWYgKGhhc1ZhbHVlKGNvbmRpdGlvbikpIGRpc3Bvc2Vycy5wdXNoKGFmZmVjdGVkKFtjb25kaXRpb24sIFwidmFsdWVcIl0sIGludmFsaWRhdGUsIHtcblx0XHRhZmZlY3RUeXBlczogW1wic2V0dGVyXCJdLFxuXHRcdHRyaWdnZXJJbW1lZGlhdGVseTogZmFsc2Vcblx0fSkpO1xuXHRhZGRUb0NhbGxDaGFpbihyZXN1bHQsIFN5bWJvbC5kaXNwb3NlLCAoKSA9PiBkaXNwb3NlcnMuZm9yRWFjaCgoZGlzcG9zZSkgPT4gZGlzcG9zZT8uKCkpKTtcblx0cmV0dXJuIHJlc3VsdDtcbn07XG52YXIgY29uZGl0aW9uYWxSZWYgPSAoY29uZCwgaWZUcnVlLCBpZkZhbHNlLCBiZWhhdmlvcikgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUoY29uZCkpIHJldHVybiBjb25kID8gaWZUcnVlIDogaWZGYWxzZTtcblx0Y29uc3QgZ2V0VHJ1ZSA9ICgpID0+IHtcblx0XHRyZXR1cm4gaWZUcnVlO1xuXHR9O1xuXHRjb25zdCBnZXRGYWxzZSA9ICgpID0+IHtcblx0XHRyZXR1cm4gaWZGYWxzZTtcblx0fTtcblx0Y29uc3QgdmFsdWVPZiA9IChuKSA9PiB7XG5cdFx0aWYgKG4gIT0gbnVsbCkgY29uZC52YWx1ZSA9IGhhc1ZhbHVlKG4pID8gbj8udmFsdWUgOiBuO1xuXHRcdHJldHVybiAoaGFzVmFsdWUoY29uZCkgPyBjb25kPy52YWx1ZSA6IGNvbmQpID8gZ2V0VHJ1ZSgpIDogZ2V0RmFsc2UoKTtcblx0fTtcblx0Y29uc3QgciA9IG9ic2VydmUoe1xuXHRcdFskdmFsdWVdOiB2YWx1ZU9mKCksXG5cdFx0WyRiZWhhdmlvcl06IGJlaGF2aW9yLFxuXHRcdFtTeW1ib2w/LnRvU3RyaW5nVGFnXSgpIHtcblx0XHRcdHJldHVybiBTdHJpbmcodmFsdWVPZigpID8/IHRoaXNbJHZhbHVlXSA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH0sXG5cdFx0W1N5bWJvbD8udG9QcmltaXRpdmVdKGhpbnQpIHtcblx0XHRcdHJldHVybiB0cnlQYXJzZUJ5SGludCh2YWx1ZU9mKCkgPz8gdGhpc1skdmFsdWVdLCBoaW50KTtcblx0XHR9LFxuXHRcdHNldCB2YWx1ZSh2KSB7XG5cdFx0XHR0aGlzWyR2YWx1ZV0gPSB2YWx1ZU9mKHYpO1xuXHRcdH0sXG5cdFx0Z2V0IHZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJHZhbHVlXSA9IHZhbHVlT2YoKSA/PyB0aGlzWyR2YWx1ZV07XG5cdFx0fVxuXHR9KTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoW2NvbmQsIFwidmFsdWVcIl0sICgpID0+IHtcblx0XHRjb25zdCBvbGRWYWx1ZSA9IHI/LlskdmFsdWVdO1xuXHRcdGNvbnN0IHZhbHVlID0gdmFsdWVPZigpO1xuXHRcdHJbJHZhbHVlXSA9IHZhbHVlO1xuXHRcdHI/LlskdHJpZ2dlcl0/Lih7XG5cdFx0XHRrZXk6IFwidmFsdWVcIixcblx0XHRcdHZhbHVlLFxuXHRcdFx0b2xkVmFsdWUsXG5cdFx0XHR0cmlnZ2VyOiBcIm1hbnVhbFwiXG5cdFx0fSk7XG5cdH0pO1xuXHRhZGRUb0NhbGxDaGFpbihyLCBTeW1ib2wuZGlzcG9zZSwgdXNiKTtcblx0cmV0dXJuIHI7XG59O1xudmFyIGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWxSZWY7XG52YXIgcmVtYXAgPSAoc3ViLCBjYiwgZGVzdCkgPT4ge1xuXHRpZiAoIWRlc3QpIGRlc3QgPSBvYnNlcnZlKHt9KTtcblx0Y29uc3QgdXNiID0gYWZmZWN0ZWQoc3ViLCAodmFsdWUsIHByb3AsIG9sZCkgPT4ge1xuXHRcdGlmIChwcm9wID09IG51bGwpIHJldHVybjtcblx0XHRjb25zdCBnb3QgPSBjYj8uKHZhbHVlLCBwcm9wLCBvbGQpO1xuXHRcdGlmICh0eXBlb2YgZ290ID09IFwib2JqZWN0XCIpIG9iamVjdEFzc2lnbk5vdEVxdWFsKGRlc3QsIGdvdCk7XG5cdFx0ZWxzZSBpZiAoaXNOb3RFcXVhbChkZXN0W3Byb3BdLCBnb3QpKSBkZXN0W3Byb3BdID0gZ290O1xuXHR9KTtcblx0aWYgKGRlc3QpIGFkZFRvQ2FsbENoYWluKGRlc3QsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gZGVzdDtcbn07XG52YXIgdW5pZmllZCA9ICguLi5zdWJzKSA9PiB7XG5cdGNvbnN0IGRlc3QgPSBvYnNlcnZlKHt9KTtcblx0c3Vicz8uZm9yRWFjaD8uKChzdWIpID0+IGFmZmVjdGVkKHN1YiwgKHZhbHVlLCBwcm9wLCBfKSA9PiB7XG5cdFx0aWYgKHByb3AgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGlmIChpc05vdEVxdWFsKGRlc3RbcHJvcF0sIHZhbHVlKSkgZGVzdFtwcm9wXSA9IHZhbHVlO1xuXHR9KSk7XG5cdHJldHVybiBkZXN0O1xufTtcbnZhciBvYnNlcnZhYmxlQnlTZXQgPSAoc2V0KSA9PiB7XG5cdGNvbnN0IG9icyA9IG9ic2VydmUoW10pO1xuXHRvYnMucHVzaCguLi5BcnJheS5mcm9tKHNldD8udmFsdWVzPy4oKSB8fCBbXSkpO1xuXHRhZGRUb0NhbGxDaGFpbihvYnMsIFN5bWJvbC5kaXNwb3NlLCBhZmZlY3RlZChzZXQsICh2YWx1ZSwgXywgb2xkKSA9PiB7XG5cdFx0aWYgKGlzTm90RXF1YWwodmFsdWUsIG9sZCkpIHtcblx0XHRcdGlmIChvbGQgPT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsKSBvYnMucHVzaCh2YWx1ZSk7XG5cdFx0XHRlbHNlIGlmIChvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdGNvbnN0IGlkeCA9IG9icy5pbmRleE9mKG9sZCk7XG5cdFx0XHRcdGlmIChpZHggPj0gMCkgb2JzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gb2JzLmluZGV4T2Yob2xkKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwICYmIGlzTm90RXF1YWwob2JzW2lkeF0sIHZhbHVlKSkgb2JzW2lkeF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH0pKTtcblx0cmV0dXJuIG9icztcbn07XG52YXIgb2JzZXJ2YWJsZUJ5TWFwID0gKG1hcCkgPT4ge1xuXHRjb25zdCBvYnMgPSBvYnNlcnZlKFtdKTtcblx0Y29uc3QgaW5pdGlhbEVudHJpZXMgPSBBcnJheS5mcm9tKG1hcC5lbnRyaWVzKCkpO1xuXHRvYnMucHVzaCguLi5pbml0aWFsRW50cmllcyk7XG5cdGFkZFRvQ2FsbENoYWluKG9icywgU3ltYm9sLmRpc3Bvc2UsIGFmZmVjdGVkKG1hcCwgKHZhbHVlLCBwcm9wLCBvbGQpID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2YWx1ZSwgb2xkKSB8fCBvbGQgPT0gbnVsbCAmJiB2YWx1ZSAhPSBudWxsIHx8IG9sZCAhPSBudWxsICYmIHZhbHVlID09IG51bGwpIHtcblx0XHRcdGlmIChvbGQgIT0gbnVsbCAmJiB2YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdGxldCBpZHggPSBvYnMuZmluZEluZGV4KChbbmFtZSwgX10pID0+IG5hbWUgPT0gcHJvcCk7XG5cdFx0XHRcdGlmIChpZHggPCAwKSBpZHggPSBvYnMuZmluZExhc3RJbmRleCgoW18sIHZhbF0pID0+IG9sZCA9PT0gdmFsKTtcblx0XHRcdFx0aWYgKGlkeCA+PSAwKSBvYnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgaWR4ID0gb2JzLmZpbmRJbmRleCgoW25hbWUsIF9dKSA9PiBuYW1lID09IHByb3ApO1xuXHRcdFx0XHRpZiAoaWR4ID49IDAgJiYgaWR4IDwgb2JzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlmIChpc05vdEVxdWFsKG9ic1tpZHhdPy5bMV0sIHZhbHVlKSkgb2JzW2lkeF0gPSBbcHJvcCwgdmFsdWVdO1xuXHRcdFx0XHR9IGVsc2Ugb2JzLnB1c2goW3Byb3AsIHZhbHVlXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KSk7XG5cdHJldHVybiBvYnM7XG59O1xudmFyIGFzc2lnbk1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGFzc2lnbiA9IChhLCBiLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IGlzQUNvbXB1dGUgPSB0eXBlb2YgYT8uWzFdID09IFwiZnVuY3Rpb25cIiAmJiBhPy5sZW5ndGggPT0gMiwgaXNCQ29tcHV0ZSA9IHR5cGVvZiBiPy5bMV0gPT0gXCJmdW5jdGlvblwiICYmIGI/Lmxlbmd0aCA9PSAyLCBjbXBCRm5jID0gaXNCQ29tcHV0ZSA/IGI/LlsxXSA6IG51bGw7XG5cdGNvbnN0IGlzQVByb3AgPSAoaXNLZXlUeXBlKGE/LlsxXSkgfHwgYT8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgYT8ubGVuZ3RoID09IDI7XG5cdGxldCBhX3Byb3AgPSBpc0FQcm9wICYmICFpc0FDb21wdXRlID8gYT8uWzFdIDogQXJyYXkuaXNBcnJheShhKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQVByb3AgJiYgIWlzQUNvbXB1dGUpIGEgPSBbYSwgYV9wcm9wXTtcblx0aWYgKGlzQUNvbXB1dGUpIGFbMV0gPSBhX3Byb3A7XG5cdGNvbnN0IGlzQlByb3AgPSAoaXNLZXlUeXBlKGI/LlsxXSkgfHwgYj8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgYj8ubGVuZ3RoID09IDI7XG5cdGxldCBiX3Byb3AgPSBpc0JQcm9wICYmICFpc0JDb21wdXRlID8gYj8uWzFdIDogQXJyYXkuaXNBcnJheShiKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQlByb3AgJiYgIWlzQkNvbXB1dGUpIGIgPSBbYiwgYl9wcm9wXTtcblx0aWYgKGlzQkNvbXB1dGUpIGJbMV0gPSBiX3Byb3A7XG5cdGlmIChhX3Byb3AgPT0gbnVsbCB8fCBiX3Byb3AgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShhX3Byb3AsIGE/LlswXSkgfHwgaXNBcnJheUludmFsaWRLZXkoYl9wcm9wLCBiPy5bMF0pKSByZXR1cm47XG5cdGlmICghKCh0eXBlb2YgYj8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGI/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmIGI/LlswXSAhPSBudWxsKSAmJiAhQXJyYXkuaXNBcnJheShhWzBdKSkge1xuXHRcdCRhdm9pZFRyaWdnZXIoYiwgKCkgPT4ge1xuXHRcdFx0YVswXVthX3Byb3BdID0gYj8uWzBdO1xuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiB7fTtcblx0fVxuXHRjb25zdCBjb21wdXRlID0gKHYsIHApID0+IHtcblx0XHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKTtcblx0XHRjb25zdCBiX3RtcCA9IGJSZWY/LmRlcmVmPy4oKTtcblx0XHRpZiAoYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmJvdW5kID09IGJfdG1wKSB7XG5cdFx0XHRsZXQgdmFsID0gbnVsbDtcblx0XHRcdGNvbnN0IGNtcGZ4ID0gYXNzaWduTWFwPy5nZXQ/LihhX3RtcCk/LmdldD8uKGFfcHJvcCk/LmNtcGZ4O1xuXHRcdFx0JGF2b2lkVHJpZ2dlcihiX3RtcCwgKCkgPT4ge1xuXHRcdFx0XHRpZiAodHlwZW9mIGNtcGZ4ID09IFwiZnVuY3Rpb25cIikgdmFsID0gY21wZng/LigkZ2V0VmFsdWUoYl90bXApID8/IHYsIHAsIG51bGwpO1xuXHRcdFx0XHRlbHNlIHZhbCA9IGJfdG1wPy5bcF0gPz8gdjtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgbnYgPSAkZ2V0VmFsdWUodmFsKTtcblx0XHRcdGlmIChpc05vdEVxdWFsKGFfdG1wW2FfcHJvcF0sIG52KSkgJGF2b2lkVHJpZ2dlcihiX3RtcCwgKCkgPT4ge1xuXHRcdFx0XHRhX3RtcFthX3Byb3BdID0gbnY7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgKChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKSk/LmdldD8uKGFfcHJvcCkpPy5kaXNwb3NlPy4oKTtcblx0fTtcblx0Y29uc3QgZGlzcG9zZSA9ICgpID0+IHtcblx0XHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKTtcblx0XHRjb25zdCBtYXAgPSBhc3NpZ25NYXA/LmdldD8uKGFfdG1wKTtcblx0XHRjb25zdCBzdG9yZSA9IG1hcD8uZ2V0Py4oYV9wcm9wKTtcblx0XHRtYXA/LmRlbGV0ZT8uKGFfcHJvcCk7XG5cdFx0c3RvcmU/LnVuc3ViPy4oKTtcblx0fTtcblx0Y29uc3QgYlJlZiA9IGI/LlswXSAhPSBudWxsICYmICh0eXBlb2YgYj8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGI/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmICEoYj8uWzBdIGluc3RhbmNlb2YgV2Vha1JlZiB8fCB0eXBlb2YgYj8uWzBdPy5kZXJlZiA9PSBcImZ1bmN0aW9uXCIpID8gbmV3IFdlYWtSZWYoYj8uWzBdKSA6IGI/LlswXSwgYVJlZiA9IGE/LlswXSAhPSBudWxsICYmICh0eXBlb2YgYT8uWzBdID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGE/LlswXSA9PSBcImZ1bmN0aW9uXCIpICYmICEoYT8uWzBdIGluc3RhbmNlb2YgV2Vha1JlZiB8fCB0eXBlb2YgYT8uWzBdPy5kZXJlZiA9PSBcImZ1bmN0aW9uXCIpID8gbmV3IFdlYWtSZWYoYT8uWzBdKSA6IGE/LlswXTtcblx0bGV0IHN0b3JlID0ge1xuXHRcdGNvbXB1dGUsXG5cdFx0ZGlzcG9zZSxcblx0XHRjbXBmeDogY21wQkZuY1xuXHR9O1xuXHRjb25zdCBhX3RtcCA9IGFSZWY/LmRlcmVmPy4oKSwgYl90bXAgPSBiUmVmPy5kZXJlZj8uKCk7XG5cdGlmIChhUmVmIGluc3RhbmNlb2YgV2Vha1JlZikge1xuXHRcdGlmIChhc3NpZ25NYXA/LmdldD8uKGFfdG1wKT8uZ2V0Py4oYV9wcm9wKT8uYm91bmQgIT0gYl90bXApIGFzc2lnbk1hcD8uZ2V0Py4oYV90bXApPy5kZWxldGU/LihhX3Byb3ApO1xuXHRcdHN0b3JlID0gKGFzc2lnbk1hcD8uZ2V0T3JJbnNlcnQ/LihhX3RtcCwgLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSkpPy5nZXRPckluc2VydENvbXB1dGVkPy4oYV9wcm9wLCAoKSA9PiAoe1xuXHRcdFx0Ym91bmQ6IGJfdG1wLFxuXHRcdFx0Y21wZng6IGNtcEJGbmMsXG5cdFx0XHR1bnN1YjogbnVsbCxcblx0XHRcdGNvbXB1dGUsXG5cdFx0XHRkaXNwb3NlXG5cdFx0fSkpO1xuXHRcdHN0b3JlLnVuc3ViID0gYWZmZWN0ZWQoYiwgY29tcHV0ZSk7XG5cdFx0c3RvcmUuY21wZnggPSBjbXBCRm5jO1xuXHRcdGFkZFRvQ2FsbENoYWluKGFfdG1wLCBTeW1ib2wuZGlzcG9zZSwgc3RvcmU/LmRpc3Bvc2UpO1xuXHRcdGFkZFRvQ2FsbENoYWluKGJfdG1wLCBTeW1ib2wuZGlzcG9zZSwgc3RvcmU/LmRpc3Bvc2UpO1xuXHR9XG5cdGlmIChiX3RtcCAmJiAhQXJyYXkuaXNBcnJheShiX3RtcCkpICRhdm9pZFRyaWdnZXIoYV90bXAsICgpID0+IHtcblx0XHRiX3RtcFtiX3Byb3BdID8/PSBhX3RtcD8uW2FfcHJvcF0gPz8gYl90bXBbYl9wcm9wXTtcblx0fSk7XG5cdHJldHVybiBzdG9yZT8uZGlzcG9zZTtcbn07XG52YXIgbGluayA9IChhLCBiLCBwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGNvbnN0IHVzdWIgPSBbYXNzaWduKGEsIGIsIHByb3ApLCBhc3NpZ24oYiwgYSwgcHJvcCldO1xuXHRyZXR1cm4gKCkgPT4gdXN1Yj8ubWFwPy4oKGMpID0+IGM/LigpKTtcbn07XG52YXIgY29tcHV0ZWQgPSAoc3JjLCBjYiwgYmVoYXZpb3IsIHByb3AgPSBcInZhbHVlXCIpID0+IHtcblx0Y29uc3QgaXNBQ29tcHV0ZSA9IHR5cGVvZiBzcmM/LlsxXSA9PSBcImZ1bmN0aW9uXCIgJiYgc3JjPy5sZW5ndGggPT0gMjtcblx0Y29uc3QgaXNBUHJvcCA9IChpc0tleVR5cGUoc3JjPy5bMV0pIHx8IHNyYz8uWzFdID09IFN5bWJvbC5pdGVyYXRvcikgJiYgc3JjPy5sZW5ndGggPT0gMjtcblx0bGV0IGFfcHJvcCA9IGlzQVByb3AgJiYgIWlzQUNvbXB1dGUgPyBzcmM/LlsxXSA6IEFycmF5LmlzQXJyYXkoc3JjKSA/IG51bGwgOiBwcm9wO1xuXHRpZiAoIWlzQVByb3AgJiYgIWlzQUNvbXB1dGUpIHNyYyA9IFtpc0FQcm9wID8gc3JjPy5bMF0gOiBzcmMsIGFfcHJvcF07XG5cdGlmIChpc0FDb21wdXRlKSBzcmNbMV0gPSBhX3Byb3A7XG5cdGlmIChhX3Byb3AgPT0gbnVsbCB8fCBpc0FycmF5SW52YWxpZEtleShhX3Byb3AsIHNyYz8uWzBdKSkgcmV0dXJuO1xuXHRsZXQgb2xkVmFsdWUgPSB2b2lkIDA7XG5cdGxldCBvbGRBcmcgPSB2b2lkIDA7XG5cdGNvbnN0IGNtcCA9IChhcmcsIGZvcmNlKSA9PiB7XG5cdFx0YXJnID8/PSBzcmM/LlswXT8uW2FfcHJvcF0gPz8gb2xkQXJnID8/IGFyZztcblx0XHRpZiAoZm9yY2UgfHwgaXNOb3RFcXVhbChvbGRBcmcsIGFyZykgJiYgYXJnICE9IHZvaWQgMCB8fCBvbGRWYWx1ZSA9PSB2b2lkIDApIHtcblx0XHRcdGxldCBudiA9IGNiPy4oYXJnLCBhX3Byb3AsIG9sZEFyZyk7XG5cdFx0XHRvbGRWYWx1ZSA9IG52O1xuXHRcdFx0cmV0dXJuIG52O1xuXHRcdH1cblx0XHRyZXR1cm4gb2xkVmFsdWU7XG5cdH07XG5cdGNvbnN0IHdycEZ1bmMgPSAoYXJnLCBwcm9wID0gXCJ2YWx1ZVwiLCBvbGRBcmckLCBvcCkgPT4ge1xuXHRcdG9sZEFyZyA9IG9sZEFyZyQgPz8gb2xkQXJnO1xuXHRcdGFyZyA/Pz0gc3JjPy5bMF0/LlthX3Byb3BdO1xuXHRcdGlmIChpc05vdEVxdWFsKG9sZEFyZywgYXJnKSAmJiBhcmcgIT0gdm9pZCAwIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0bGV0IG52ID0gY2I/LihhcmcsIGFfcHJvcCwgb2xkQXJnLCBvcCk7XG5cdFx0XHRvbGRBcmcgPSBhcmc7XG5cdFx0XHRpZiAoaXNOb3RFcXVhbChudiwgb2xkVmFsdWUpIHx8IG9sZFZhbHVlID09IHZvaWQgMCkge1xuXHRcdFx0XHRyZltwcm9wXSA9IG9sZFZhbHVlID0gbnY7XG5cdFx0XHRcdG9sZFZhbHVlID0gcmZbcHJvcF07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnY7XG5cdFx0fVxuXHRcdHJldHVybiByZltwcm9wXTtcblx0fTtcblx0Y29uc3QgaW5pdGlhbCA9IGNtcChzcmNbMF1bYV9wcm9wXSA/PyBvbGRBcmcpO1xuXHRjb25zdCBwZW5kaW5nSW5pdGlhbCA9IGlzUHJvbWlzZShpbml0aWFsKTtcblx0Y29uc3QgJGFwcGx5ID0gU3ltYm9sLmZvcihcIkBAYXBwbHlcIik7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkcHJvbWlzZSwge1xuXHRcdHZhbHVlOiBpbml0aWFsLFxuXHRcdHdyaXRhYmxlOiB0cnVlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgJHZhbHVlLCB7XG5cdFx0dmFsdWU6IGluaXRpYWwsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCAkYmVoYXZpb3IsIHtcblx0XHR2YWx1ZTogYmVoYXZpb3IsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBTeW1ib2w/LnRvU3RyaW5nVGFnLCB7XG5cdFx0dmFsdWU6IFN0cmluZyh3cnBGdW5jWyR2YWx1ZV0gPz8gXCJcIikgfHwgXCJcIixcblx0XHR3cml0YWJsZTogZmFsc2Vcblx0fSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cnBGdW5jLCBTeW1ib2w/LnRvUHJpbWl0aXZlLCB7XG5cdFx0dmFsdWU6IHRyeVBhcnNlQnlIaW50KHdycEZ1bmNbJHZhbHVlXSwgXCJudW1iZXJcIiksXG5cdFx0d3JpdGFibGU6IGZhbHNlXG5cdH0pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod3JwRnVuYywgXCJ2YWx1ZVwiLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgY3AgPSBjbXAoKTtcblx0XHRcdGlmIChjcCAhPSBudWxsKSB3cnBGdW5jWyR2YWx1ZV0gPSBjcDtcblx0XHRcdHJldHVybiB3cnBGdW5jWyR2YWx1ZV07XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKGFyZykge1xuXHRcdFx0d3JwRnVuY1skdmFsdWVdID0gY21wKGFyZywgdHJ1ZSk7XG5cdFx0fVxuXHR9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdycEZ1bmMsICRhcHBseSwge1xuXHRcdHZhbHVlOiAodikgPT4ge1xuXHRcdFx0aWYgKHYgPT0gdm9pZCAwKSByZXR1cm4gcmY/LnZhbHVlO1xuXHRcdFx0cmYudmFsdWUgPSB2O1xuXHRcdFx0cmV0dXJuIHJmPy52YWx1ZTtcblx0XHR9LFxuXHRcdHdyaXRhYmxlOiBmYWxzZVxuXHR9KTtcblx0Y29uc3QgcmYgPSBvYnNlcnZlKHdycEZ1bmMpO1xuXHRjb25zdCB3cml0ZUNvbXB1dGVkID0gKHZhbHVlLCB0cmlnZ2VyKSA9PiB7XG5cdFx0aWYgKGlzUHJvbWlzZSh2YWx1ZSkpIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oKHYpID0+IHtcblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gcmY/LlskdmFsdWVdO1xuXHRcdFx0cmZbJHZhbHVlXSA9IHY7XG5cdFx0XHRyZj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdFx0a2V5OiBcInZhbHVlXCIsXG5cdFx0XHRcdHZhbHVlOiB2LFxuXHRcdFx0XHRvbGRWYWx1ZSxcblx0XHRcdFx0dHJpZ2dlcjogXCJyZXNvbHZlZFwiXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB2O1xuXHRcdH0pO1xuXHRcdGNvbnN0IG9sZFZhbHVlID0gcmY/LlskdmFsdWVdO1xuXHRcdHJmWyR2YWx1ZV0gPSB2YWx1ZTtcblx0XHRyZj8uWyR0cmlnZ2VyXT8uKHtcblx0XHRcdGtleTogXCJ2YWx1ZVwiLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRvbGRWYWx1ZSxcblx0XHRcdHRyaWdnZXJcblx0XHR9KTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH07XG5cdGlmIChwZW5kaW5nSW5pdGlhbCkgd3JpdGVDb21wdXRlZChpbml0aWFsLCBcInJlc29sdmVkXCIpO1xuXHRjb25zdCB1c2IgPSBhZmZlY3RlZChbc3JjPy5bMF0gPz8gc3JjLCBhX3Byb3AgPz8gXCJ2YWx1ZVwiXSwgKCkgPT4ge1xuXHRcdHdyaXRlQ29tcHV0ZWQoY21wKCksIFwibWFudWFsXCIpO1xuXHR9KTtcblx0YWRkVG9DYWxsQ2hhaW4ocmYsIFN5bWJvbC5kaXNwb3NlLCB1c2IpO1xuXHRyZXR1cm4gcmY7XG59O1xudmFyIGRlbGF5ZWRTdWJzY3JpYmUgPSAocmVmLCBjYiwgZGVsYXkgPSAxMDApID0+IHtcblx0bGV0IHRtO1xuXHRyZXR1cm4gYWZmZWN0ZWQocmVmLCBcInZhbHVlXCIsICh2KSA9PiB7XG5cdFx0aWYgKCF2ICYmIHRtKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodG0pO1xuXHRcdFx0dG0gPSBudWxsO1xuXHRcdH0gZWxzZSBpZiAodiAmJiAhdG0pIHRtID0gdHJpZ2dlcldpdGhEZWxheShyZWYsIGNiLCBkZWxheSkgPz8gdG07XG5cdH0pO1xufTtcblxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyAkYWZmZWN0ZWQsICRyZWYsICRyZXNvbHZlZCwgJHRyaWdnZXIsICR0cmlnZ2VyQ29udHJvbCwgJHRyaWdnZXJMZXNzLCAkdHJpZ2dlckxvY2ssIEFzc2lnbk9iamVjdEhhbmRsZXIsIERvdWJsZVdlYWtNYXAsIGFkZFRvQ2FsbENoYWluLCBhZmZlY3RlZCwgYXNzaWduLCBhc3NpZ25NYXAsIGJpbmRCeSwgYmluZEJ5S2V5LCBib29sZWFuUmVmLCBjb21wdXRlZCwgY29uZGl0aW9uYWwsIGNvbmRpdGlvbmFsSW5kZXgsIGNvbmRpdGlvbmFsUmVmLCBkZWxheWVkQmVoYXZpb3IsIGRlbGF5ZWRPckluc3RhbnRCZWhhdmlvciwgZGVsYXllZFN1YnNjcmliZSwgZGVyZWYsIGRlcml2YXRlLCBlZmZlY3QsIGVmZmVjdGVkLCBpc09ic2VydmFibGUsIGl0ZXJhdGVkLCBsaW5rLCBtYWtlQXJyYXlPYnNlcnZhYmxlLCBtYWtlT2JqZWN0QXNzaWduYWJsZSwgbWFrZVJlc29sdmVkT3AsIG51bWJlclJlZiwgb2JzZXJ2YWJsZUJ5TWFwLCBvYnNlcnZhYmxlQnlTZXQsIG9ic2VydmUsIHByb21pc2VkLCBwcm9wUmVmLCByZWNvdmVyUmVhY3RpdmUsIHJlZiwgcmVtYXAsIHJlc29sdmVkLCBzYWZlLCBzcGVjaWFsaXplZFN1YnNjcmliZSwgc3RyaW5nUmVmLCBzdWJzY3JpYmVEaXJlY3RseSwgc3Vic2NyaWJlSW5wdXQsIHN1YnNjcmliZVBhaXJlZCwgc3Vic2NyaWJlVGhlbmFibGUsIHRyaWdnZXJXaXRoRGVsYXksIHVuYWZmZWN0ZWQsIHVuaWZpZWQsIHVud3JhcCwgdXNlT2JzZXJ2YWJsZSwgd3JhcFJlZiwgd3JhcFNldEFzQXJyYXkgfTsiXSwKICAibWFwcGluZ3MiOiAiQUFBQSxTQUFTLGlCQUFBQSxJQUFlLGFBQUFDLElBQVcsZ0JBQWdCQyxJQUFnQixZQUFBQyxJQUFVLFdBQUFDLEdBQVMsaUJBQUFDLElBQWUsY0FBQUMsSUFBWSxpQkFBQUMsSUFBZSxZQUFBQyxHQUFVLHFCQUFBQyxJQUFtQixhQUFBQyxHQUFXLGNBQUFDLEdBQVksZUFBQUMsR0FBYSxhQUFBQyxHQUFXLG1CQUFBQyxJQUFpQixnQkFBQUMsSUFBYyx3QkFBQUMsSUFBc0Isb0JBQUFDLElBQWtCLHVCQUFBQyxJQUFxQixZQUFZQyxJQUFZLGtCQUFBQyxTQUFzQjtBQUd0VixPQUFPLGVBQWUsdUJBQU8sSUFBSSxZQUFZO0FBQzdDLE9BQU8sY0FBYyx1QkFBTyxJQUFJLFdBQVc7QUFDM0MsT0FBTyxnQkFBZ0IsdUJBQU8sSUFBSSxhQUFh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Q0wsT0FBT29KO0FBQUEsUUFDUCxVQUFBaEI7QUFBQSxRQUNBLFNBQVM7QUFBQSxNQUNWLENBQUMsR0FDTWdCO0FBQUEsSUFDUixDQUFDO0FBQ0QsVUFBTWhCLElBQVdnUixJQUFLOVosQ0FBTTtBQUM1QixXQUFBOFosRUFBRzlaLENBQU0sSUFBSWlELEdBQ2I2VyxJQUFLcFosQ0FBUSxJQUFJO0FBQUEsTUFDaEIsS0FBSztBQUFBLE1BQ0wsT0FBQXVDO0FBQUEsTUFDQSxVQUFBNkY7QUFBQSxNQUNBLFNBQUE1QjtBQUFBLElBQ0QsQ0FBQyxHQUNNakU7QUFBQSxFQUNSO0FBQ0EsRUFBSThXLEtBQWdCRyxFQUFjakosR0FBUyxVQUFVO0FBQ3JELFFBQU1tQixJQUFNeEUsRUFBUyxDQUFDOEQsSUFBTSxDQUFDLEtBQUtBLEdBQUtpSCxLQUFVLE9BQU8sR0FBRyxNQUFNO0FBQ2hFLElBQUF1QixFQUFjVixFQUFJLEdBQUcsUUFBUTtBQUFBLEVBQzlCLENBQUM7QUFDRCxTQUFBdFgsRUFBZTRYLEdBQUksT0FBTyxTQUFTMUgsQ0FBRyxHQUMvQjBIO0FBQ1IsR0FDSUssS0FBbUIsQ0FBQzFILEdBQUszUSxHQUFJK1EsSUFBUSxRQUFRO0FBQ2hELE1BQUlHO0FBQ0osU0FBT3BGLEVBQVM2RSxHQUFLLFNBQVMsQ0FBQzNJLE1BQU07QUFDcEMsSUFBSSxDQUFDQSxLQUFLa0osS0FDVCxhQUFhQSxDQUFFLEdBQ2ZBLElBQUssUUFDS2xKLEtBQUssQ0FBQ2tKLE1BQUlBLElBQUtKLEdBQWlCSCxHQUFLM1EsR0FBSStRLENBQUssS0FBS0c7QUFBQSxFQUMvRCxDQUFDO0FBQ0Y7IiwKICAibmFtZXMiOiBbIiRhdm9pZFRyaWdnZXIiLCAiJGdldFZhbHVlIiwgIiR0cmlnZ2VyTG9jayQxIiwgIlByb21pc2VkIiwgImJpbmRDdHgiLCAiY2FsbEJ5QWxsUHJvcCIsICJjYWxsQnlQcm9wIiwgImRlZmF1bHRCeVR5cGUiLCAiaGFzVmFsdWUiLCAiaXNBcnJheUludmFsaWRLZXkiLCAiaXNLZXlUeXBlIiwgImlzTm90RXF1YWwiLCAiaXNQcmltaXRpdmUiLCAiaXNQcm9taXNlIiwgIm1ha2VUcmlnZ2VyTGVzcyIsICJvYmplY3RBc3NpZ24iLCAib2JqZWN0QXNzaWduTm90RXF1YWwiLCAicG90ZW50aWFsbHlBc3luYyIsICJwb3RlbnRpYWxseUFzeW5jTWFwIiwgInJlc29sdmVkJDEiLCAidHJ5UGFyc2VCeUhpbnQiLCAiJHZhbHVlIiwgIiRleHRyYWN0S2V5JCIsICIkb3JpZ2luYWxLZXkkIiwgIiRyZWdpc3RyeUtleSQiLCAiJGJlaGF2aW9yIiwgIiRwcm9taXNlIiwgIiRyZXNvbHZlZCIsICIkdHJpZ2dlckxlc3MiLCAiJHRyaWdnZXJMb2NrIiwgIiR0cmlnZ2VyQ29udHJvbCIsICIkdHJpZ2dlciIsICIkYWZmZWN0ZWQiLCAiJGlzTm90RXF1YWwiLCAiJHJlYWxQcm9wIiwgIiRvcmlnaW5hbE9iamVjdHMkIiwgInNhZmUiLCAidGFyZ2V0IiwgInVud3JhcCIsICJtYXBwZWQiLCAiZSIsICJLIiwgIlYiLCAiYXJyIiwgImRlcmVmIiwgImRpc2NvdW50VmFsdWUiLCAib3JpZ2luYWwiLCAiJHZhbCIsICJpc1RoZW5hYmxlIiwgInZhbCIsICJ3aXRoUHJvbWlzZSIsICJjYiIsICJkaXNwb3NlTWFwIiwgImRpc3Bvc2VSZWdpc3RyeSIsICJjYWxsc3RhY2siLCAiYWRkVG9DYWxsQ2hhaW4iLCAib2JqIiwgIm1ldGhvZEtleSIsICJjYWxsYmFjayIsICJjaGFpblRhcmdldCIsICJDYWxsQ2hhaW4iLCAiYXJncyIsICJpc0FycmF5SW5kZXgiLCAicHJvcCIsICJudW0iLCAid3JhcFNldEFzQXJyYXkiLCAic291cmNlIiwgIm9wdGlvbnMiLCAiYmFja2luZ1NldCIsICJub3RpZnlEdXBsaWNhdGUiLCAidmFsdWUiLCAidmlhIiwgImluZGV4IiwgIml0ZW0iLCAic25hcHNob3QiLCAicmVidWlsZEZyb20iLCAibWV0aG9kcyIsICJpdGVtcyIsICJzaXplIiwgIml0ZXJhdG9yIiwgImN1cnJlbnQiLCAidG9QcmVwZW5kIiwgIm5leHQiLCAic3RhcnQiLCAiZGVsZXRlQ291bnQiLCAibm9ybWFsaXplZFN0YXJ0IiwgImFjdHVhbERlbGV0ZUNvdW50IiwgInJlbW92ZWQiLCAiaW5zZXJ0UG9zaXRpb24iLCAiXyIsICJuZXh0TGVuZ3RoIiwgIm5leHRWYWx1ZSIsICJjdXJyZW50VmFsdWUiLCAiaWR4IiwgImtleXMiLCAiaSIsICJBc3NpZ25PYmplY3RIYW5kbGVyIiwgIm5hbWUiLCAibmV3VCIsICJjdHgiLCAibWFrZU9iamVjdEFzc2lnbmFibGUiLCAicHgiLCAid2l0aFVuc3ViU3ltYm9sIiwgIndpdGhVbnN1YiIsICJjb21wbGV0ZVdpdGhVbnN1YiIsICJzdWJzY3JpYmVyIiwgIndlYWsiLCAiaGFuZGxlciIsICJyZWdpc3RyeSIsICJzYXZDb21wbGV0ZSIsICJ1bmFmZmVjdGVkIiwgInIiLCAic3Vic2NyaXB0UmVnaXN0cnlTeW1ib2wiLCAic3Vic2NyaXB0UmVnaXN0cnkiLCAiZ2xvYmFsRWZmZWN0TGlzdGVuZXJzU3ltYm9sIiwgImdsb2JhbEVmZmVjdExpc3RlbmVycyIsICJlZmZlY3RHbG9iYWxseSIsICJub3JtYWxpemVkIiwgIm5vcm1hbGl6ZUVmZmVjdE9wdGlvbnMiLCAid3JhcHBlZFN5bWJvbCIsICJ3cmFwcGVkIiwgInJlZ2lzdGVyIiwgIndoYXQiLCAiaGFuZGxlIiwgIlN1YnNjcmlwdCIsICJ3cmFwV2l0aCIsICJmb3JBbGwiLCAid2lsZGNhcmRUcmlnZ2VycyIsICJ0cmlnZ2VyQWxpYXNlcyIsICJ0cmlnZ2VyQ2Fub25pY2FsTmFtZXNTeW1ib2wiLCAiY2Fub25pY2FsIiwgImFsaWFzZXMiLCAiYWxpYXMiLCAidHJpZ2dlckNhbm9uaWNhbE5hbWVzIiwgIm5vcm1hbGl6ZVRyaWdnZXJOYW1lIiwgInRyaWdnZXIiLCAidHJpZ2dlck5hbWVzT2YiLCAiZXhwYW5kVHJpZ2dlckZpbHRlciIsICJ0eXBlcyIsICJub3JtYWxpemVUcmlnZ2VyRmlsdGVyIiwgInRyaWdnZXJzIiwgImxpc3QiLCAidHJpZ2dlckZpbHRlckFsbG93cyIsICJmaWx0ZXIiLCAiaXNPcHRpb25zT2JqZWN0IiwgIm5vcm1hbGl6ZUFmZmVjdGVkT3B0aW9ucyIsICJhZmZlY3RUeXBlcyIsICJTdWJzY3JpcHRTeW1ib2wiLCAiI3NvdXJjZSIsICIjbGlzdGVuZXJzIiwgIiNmbGFncyIsICIjbmF0aXZlIiwgIiNpdGVyYXRvciIsICIjaW5EaXNwYXRjaCIsICIjZGlzYWJsZWRUcmlnZ2VycyIsICIjdHJpZ2dlckNvbnRyb2wiLCAiI3BlbmRpbmciLCAiI3BlbmRpbmdCeVByb3AiLCAiI2ZsdXNoU2NoZWR1bGVkIiwgImVuYWJsZWQiLCAiI2Rpc3BhdGNoIiwgImNvbnRyb2xsZXIiLCAicmVzIiwgIm9sZFZhbHVlIiwgImV0YyIsICJsaXN0ZW5lcnMiLCAicmVjb3JkIiwgImV2ZW50IiwgIm53IiwgIm5hbWVzIiwgInByZXZpb3VzIiwgInJlc3RvcmUiLCAid2FzRGlzYWJsZWQiLCAicmVzdWx0IiwgIm9wS2V5IiwgImJ5T3AiLCAiYmF0Y2giLCAib3BNYXAiLCAibm0iLCAidiIsICJvdiIsICJ0ZyIsICJyZXN0IiwgInJhd09mIiwgInVud3JhcHBlZCIsICJyZXNvbHZlZCIsICJtb2RlIiwgInJhdyIsICJtYWtlUmVzb2x2ZWRPcCIsICJlbWl0IiwgInJ1biIsICJwZW5kaW5nIiwgImtleSIsICJjYWxsYmFja09yVmFsdWUiLCAiZW1pdFJlc29sdmVkIiwgImJpbmRFeGlzdGluZ1RoZW5hYmxlcyIsICJsaXZlIiwgIl9fc2FmZUdldEd1YXJkU3ltYm9sIiwgInJlYWN0aXZlUHJvcGVydGllc1N5bWJvbCIsICJyZWFjdGl2ZVByb3BlcnRpZXMiLCAibWFya1JlYWN0aXZlUHJvcGVydHkiLCAiaXNSZWFjdGl2ZVByb3BlcnR5IiwgIm5vdGlmeVJlYWN0aXZlUHJvcGVydHkiLCAicmVjZWl2ZXIiLCAib3duZXIiLCAibmV3VmFsdWUiLCAidHJpZ2dlck5hbWUiLCAidHJpZ2dlcktleU9mIiwgInNhZmVHZXQiLCAiZGVmaW5lUmVhY3RpdmVQcm9wZXJ0eSIsICJkZXNjcmlwdG9yIiwgImluaXRpYWxWYWx1ZSIsICJ2YWx1ZXMiLCAibGFzdEFzc2lnbmVkIiwgImFjdHVhbFZhbHVlIiwgIl9fc3lzdGVtU2tpcCIsICJzeXN0ZW1Ta2lwR2V0IiwgImdvdCIsICJfX3NhZmVHZXRHdWFyZCIsICJpc0dldHRlciIsICJwcm9wTmFtZSIsICJmYWxsVGhyb3VnaCIsICJ0bXAiLCAic2FmZVNldCIsICJhY3RpdmUiLCAicmVjIiwgImhhc093biIsICJpc1RyaWdnZXJFbWl0T3B0aW9ucyIsICJhbGxvd1ZhbHVlT25seSIsICJ0cmlnZ2VyT3B0aW9uVmFsdWUiLCAiZmFsbGJhY2siLCAidHJpZ2dlck9wdGlvblRyaWdnZXIiLCAiaXNSdW50aW1lS2V5IiwgInJlYWxQcm9wT2YkMSIsICJ0cmlnZ2VyVmFsdWVPZiIsICJyZWFsUHJvcCIsICJjcmVhdGVUcmlnZ2VyQVBJIiwgImFwaSIsICJvcE9yT3B0aW9ucyIsICJjb250cm9sIiwgInN5c3RlbUdldCIsICJhZmZlY3RlZCIsICJvYnNlcnZhYmxlQVBJTWV0aG9kcyIsICJ1c3ViIiwgImNvbXAiLCAiT2JzZXJ2ZUFycmF5TWV0aG9kIiwgIiNuYW1lIiwgIiNzZWxmIiwgIiNoYW5kbGUiLCAic2VsZiIsICJza2lwIiwgImFkZGVkIiwgInNldFBhaXJzIiwgIm9sZFN0YXRlIiwgIm9ic2VydmVBcnJheSIsICJyZWciLCAiSSIsICJwYWlyIiwgInRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlIiwgIm9sZExlbiIsICJuZXdMZW4iLCAicmVtb3ZlZEl0ZW1zIiwgImFkZGVkQ291bnQiLCAiT2JzZXJ2ZUFycmF5SGFuZGxlciIsICJzeXMiLCAib2JzIiwgIm9sZCIsICJ4eXp3IiwgInJnYmEiLCAieHl6d19pZHgiLCAicmdiYV9pZHgiLCAiT2JzZXJ2ZU9iamVjdEhhbmRsZXIiLCAiaGludCIsICJmdCIsICIkb3JpZ2luYWwiLCAic3Vic2NyaXB0IiwgIiRyZXN1bHQiLCAiT2JzZXJ2ZU1hcEhhbmRsZXIiLCAidmFsdWVPckZ4IiwgIm9sZFZhbHVlcyIsICJoYWQiLCAiY29tcHV0ZWQiLCAiZGVmYXVsdE9yQ29tcHV0ZSIsICJpbmNvbWluZyIsICJPYnNlcnZlU2V0SGFuZGxlciIsICIkaXNPYnNlcnZhYmxlIiwgIm1ha2VSZWFjdGl2ZVByb3BlcnRpZXMiLCAiZW50cmllcyIsICJvYnNlcnZlT2JqZWN0IiwgIm9ic2VydmVNYXAiLCAibWFwIiwgIm9ic2VydmVTZXQiLCAic2V0IiwgIm51bWJlclJlZiIsICJpbml0aWFsIiwgImJlaGF2aW9yIiwgIiRyIiwgIm9ic2VydmUiLCAic3RyaW5nUmVmIiwgImJvb2xlYW5SZWYiLCAid3JhcFJlZiIsICJtYXJrUmVhbFByb3AiLCAicHJvcFJlZiIsICJzcmMiLCAic3JjUHJvcCIsICJpc01hcCIsICJpc1NldCIsICJyZWFkU2xvdCIsICJ3cml0ZVNsb3QiLCAibWVtYmVyIiwgImlzT2JzZXJ2YWJsZSIsICJyZWNvdmVyUmVhY3RpdmUiLCAic2xvdCIsICJ1c2IiLCAiX3Byb3AiLCAicHJldiIsICIkcmVmIiwgInR5cGVkIiwgInJlZiIsICJwcm9taXNlZCIsICJwcm9taXNlIiwgInRyaWdnZXJXaXRoRGVsYXkiLCAiZGVsYXkiLCAiZGVsYXllZEJlaGF2aW9yIiwgInNpZyIsICJ0bSIsICJkZWxheWVkT3JJbnN0YW50QmVoYXZpb3IiLCAic3RhdGVOYW1lIiwgInJlYWN0aXZlIiwgInVzZU9ic2VydmFibGUiLCAib2JzZXJ2YWJsZSIsICJzcGVjaWFsaXplZFN1YnNjcmliZSIsICJjaGVja1ZhbGlkT2JqIiwgImluaXRpYWxUcmlnZ2VyIiwgInJlYWxQcm9wT2YiLCAibm9ybWFsaXplQWZmZWN0ZWRQcm9wIiwgInByb3BWYWx1ZU9mIiwgImNhbGxCeVByb3BSZWZBd2FyZSIsICJ3aXRoVHJpZ2dlciIsICJzdWJzY3JpYmVEaXJlY3RseSIsICJ0UHJvcCIsICJpbml0aWFsQ2IiLCAidW5TdWIiLCAic3Vic2NyaWJlSW5wdXQiLCAiJG9wdCIsICIkY2IiLCAiZXYiLCAiY2hlY2tJc1BhaXJlZCIsICJpc0VmZmVjdE9wdGlvbnNBcmciLCAibm9ybWFsaXplRWZmZWN0VGFyZ2V0cyIsICJ0YXJnZXRzIiwgImVmZmVjdFRhcmdldENvbnRleHQiLCAidG9FZmZlY3RFdmVudCIsICJzdWJzY3JpYmVQYWlyZWQiLCAic3Vic2NyaWJlVGhlbmFibGUiLCAiZWZmZWN0IiwgImFmZmVjdGVkT3B0aW9ucyIsICJkaXNwb3NlcnMiLCAiZGlzcG9zZSIsICJlZmZlY3RlZCIsICJtYWtlQXJyYXlPYnNlcnZhYmxlIiwgIm9ic2VydmFibGVCeVNldCIsICJvYnNlcnZhYmxlQnlNYXAiLCAiRG91YmxlV2Vha01hcCIsICIjdG9wIiwgIiNlbnN1cmVJbm5lciIsICJrZXkxIiwgImlubmVyIiwgIiNzcGxpdFBhaXIiLCAia2V5MiIsICJmYWN0b3J5IiwgImNvbXB1dGUiLCAicmVnaXN0ZXJlZEl0ZXJhdGVkIiwgIml0ZXJhdGVkIiwgIiRzdWIiLCAiYmFzaXMiLCAib2ZPbGQiLCAib2ZOZXciLCAiaXNQYWlyIiwgImJpbmRCeSIsICJ3YXRjaCIsICJwIiwgIk4iLCAiayIsICJkZXJpdmF0ZSIsICJmcm9tIiwgInJlYWN0Rm4iLCAiYmluZEJ5S2V5IiwgImNvbmRpdGlvbmFsSW5kZXgiLCAiY29uZExpc3QiLCAicmVhZENvbmRpdGlvbiIsICJjb25kaXRpb24iLCAiaW52YWxpZGF0ZSIsICJjb25kaXRpb25hbFJlZiIsICJjb25kIiwgImlmVHJ1ZSIsICJpZkZhbHNlIiwgImdldFRydWUiLCAiZ2V0RmFsc2UiLCAidmFsdWVPZiIsICJuIiwgImNvbmRpdGlvbmFsIiwgInJlbWFwIiwgInN1YiIsICJkZXN0IiwgInVuaWZpZWQiLCAic3VicyIsICJpbml0aWFsRW50cmllcyIsICJhc3NpZ25NYXAiLCAiYXNzaWduIiwgImEiLCAiYiIsICJpc0FDb21wdXRlIiwgImlzQkNvbXB1dGUiLCAiY21wQkZuYyIsICJpc0FQcm9wIiwgImFfcHJvcCIsICJpc0JQcm9wIiwgImJfcHJvcCIsICJhX3RtcCIsICJhUmVmIiwgImJfdG1wIiwgImJSZWYiLCAiY21wZngiLCAibnYiLCAic3RvcmUiLCAibGluayIsICJjIiwgIm9sZEFyZyIsICJjbXAiLCAiYXJnIiwgImZvcmNlIiwgIndycEZ1bmMiLCAib2xkQXJnJCIsICJvcCIsICJyZiIsICJwZW5kaW5nSW5pdGlhbCIsICIkYXBwbHkiLCAiY3AiLCAid3JpdGVDb21wdXRlZCIsICJkZWxheWVkU3Vic2NyaWJlIl0KfQo=
