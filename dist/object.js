var je = /* @__PURE__ */ Symbol.for("@fix"), m = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" || typeof e > "u" || e == null, E = (e, t) => m(e) ? t == "number" ? Number(e) || 0 : t == "string" ? String(e) || "" : t == "boolean" ? !!e : e : null, ke = (e, t = "value") => (typeof e == "object" || typeof e == "function") && e != null && (t in e || e?.[t] != null), I = (e) => ke(e, "value"), Ke = (e) => m(e) ? e : I(e) ? e?.value : e, S = (e, t) => e?.[je] ?? e ?? t ?? t, yt = (e) => {
  if (typeof e == "function" || e == null) return e;
  const t = function() {
  };
  return t[je] = e, t;
}, X = /* @__PURE__ */ Symbol.for("@trigger-lock"), ye = (e, t, r = "value") => {
  ke(e, r) && (e[X] = !0);
  let n;
  try {
    n = t?.();
  } finally {
    ke(e, r) && delete e[X];
  }
  return n;
}, at = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), ht = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), pe = function(e) {
  return (t) => {
    e[X] = !0;
    let r;
    try {
      r = t?.();
    } finally {
      e[X] = !1;
    }
    return r;
  };
}, dt = (e) => {
  switch (typeof e) {
    case "number":
      return 0;
    case "string":
      return "";
    case "boolean":
      return !1;
    case "object":
      return null;
    case "function":
      return null;
    case "symbol":
      return null;
    case "bigint":
      return 0n;
  }
}, J = (e) => typeof e?.[Symbol.iterator] == "function", N = (e) => [
  "symbol",
  "string",
  "number"
].indexOf(typeof e) >= 0, vt = (e, t, r = null) => {
  const n = r != null && (typeof e == "object" || typeof e == "function") ? e?.[r] ?? e : e;
  let i = [];
  t instanceof Set || t instanceof Map || Array.isArray(t) || J(t) ? i = (n instanceof Set || n instanceof WeakSet ? t?.values?.() : t?.entries?.()) || (Array.isArray(t) || J(t) ? t : []) : (typeof t == "object" || typeof t == "function") && (i = n instanceof Set || n instanceof WeakSet ? Object.values(t) : Object.entries(t));
  let s = [];
  Array.isArray(n) ? s = n.entries() : n instanceof Map || n instanceof WeakMap ? s = n?.entries?.() : n instanceof Set || n instanceof WeakSet ? s = n?.values?.() : (typeof n == "object" || typeof n == "function") && (s = Object.entries(n));
  const u = new Set(Array.from(i).map((o) => o?.[0])), l = new Set(Array.from(s).map((o) => o?.[0])), f = u?.difference?.(l);
  if (Array.isArray(n)) {
    const o = n.filter((y, a) => !f.has(a));
    n.splice(0, n.length), n.push(...o);
  } else if (n instanceof Map || n instanceof Set || n instanceof WeakMap || n instanceof WeakSet) for (const o of f) n.delete(o);
  else if (typeof n == "function" || typeof n == "object") for (const o of f) delete n[o];
  return n;
}, ie = (e, t, r = null, n = !0, i = "id") => {
  const s = r != null && (typeof e == "object" || typeof e == "function") ? e?.[r] ?? e : e;
  let u = null;
  if (n && vt(s, t), t instanceof Set || t instanceof Map || Array.isArray(t) || J(t) ? u = (s instanceof Set || s instanceof WeakSet ? t?.values?.() : t?.entries?.()) || (Array.isArray(t) || J(t) ? t : []) : (typeof t == "object" || typeof t == "function") && (u = s instanceof Set || s instanceof WeakSet ? Object.values(t) : Object.entries(t)), s && u && (typeof u == "object" || typeof u == "function")) {
    if (s instanceof Map || s instanceof WeakMap) {
      for (const l of u) s.set(...l);
      return s;
    }
    if (s instanceof Set || s instanceof WeakSet) {
      for (const l of u) {
        const f = l?.[i] ? Array.from(s?.values?.() || []).find((o) => !x?.(o?.[i], l?.[i])) : null;
        f != null ? ie(f, l, null, n, i) : s.add(l);
      }
      return s;
    }
    if (typeof s == "object" || typeof s == "function") {
      if (Array.isArray(s) || J(s)) {
        let l = 0;
        for (const f of u) l < s.length ? s[l++] = f?.[1] : s?.push?.(f?.[1]);
        return s;
      }
      return Object.assign(s, Object.fromEntries([...u || []].filter((l) => typeof l != "symbol")));
    }
  }
  return r != null ? (Reflect.set(e, r, t), e) : typeof t == "object" || typeof t == "function" ? Object.assign(e, t) : t;
}, bt = (e, t) => pt.getOrInsert(e, /* @__PURE__ */ new WeakMap()).getOrInsert(t, t?.bind?.(e)), K = (e, t) => (typeof t == "function" ? bt(e, t) : t) ?? t, ae = (e, t, r, n) => {
  if (t == Symbol.iterator) return Ve(e, r, n);
  if (t == null || typeof t == "symbol" || typeof t == "object" || typeof t == "function") return;
  const i = (s, ...u) => {
    if (s != null) return r?.(s, ...u);
  };
  if (e instanceof Map || e instanceof WeakMap) {
    if (e.has(t)) return i?.(e.get(t), t, null, "@set");
  } else if (e instanceof Set || e instanceof WeakSet) {
    if (e.has(t)) return i?.(t, t, null, "@add");
  } else if (Array.isArray(e) && typeof t == "string" && [...t?.matchAll?.(/^\d+$/g)].length == 1 && Number.isInteger(typeof t == "string" ? parseInt(t) : t)) {
    const s = typeof t == "string" ? parseInt(t) : t;
    return i?.(e?.[s], s, null, "@add");
  } else if (typeof e == "function" || typeof e == "object") return i?.(e?.[t], t, null, "@set");
}, St = (e, t = {}) => (Object.entries(t)?.forEach?.(([r, n]) => {
  x(n, e[r]) && (e[r] = n);
}), e), Ve = (e, t, r) => {
  if (e == null) return;
  let n = [];
  if (e instanceof Set || e instanceof Map || typeof e?.keys == "function") return [...e?.keys?.() || n].forEach?.((i) => ae(e, i, t, r));
  if (Array.isArray(e) || J(e)) return [...e].forEach?.((i, s) => ae(e, s, t, r));
  if (typeof e == "object" || typeof e == "function") return [...Object.keys(e) || n].forEach?.((i) => ae(e, i, t, r));
}, x = (e, t) => e == null && t == null ? !1 : e == null || t == null ? !0 : typeof e == "boolean" && typeof t == "boolean" ? e != t : typeof e == "number" && typeof t == "number" ? !(e == t || Math.abs(e - t) < 1e-9) : typeof e == "string" && typeof t == "string" ? e != "" && t != "" && e != t || e !== t : typeof e != typeof t ? e !== t : e && t && e != t || e !== t, pt = /* @__PURE__ */ new WeakMap(), le = (e, t) => {
  const r = e == null || e < 0 || typeof e != "number" || e == Symbol.iterator || (t != null ? e >= (t?.length || 0) : !1);
  return t != null ? Array.isArray(t) && r : !1;
}, _ = /* @__PURE__ */ new WeakMap(), Ge = /* @__PURE__ */ new WeakMap(), T = (e, t) => e instanceof Promise || typeof e?.then == "function" ? _?.has?.(e) ? t(_?.get?.(e)) : Promise.try?.(async () => {
  const r = await e;
  return _?.set?.(e, r), r;
})?.then?.(t) : t(e), mt = class {
  #t;
  #e;
  constructor(e, t) {
    this.#t = e, this.#e = t;
  }
  defineProperty(e, t, r) {
    return S(e) instanceof Promise ? Reflect.defineProperty(e, t, r) : T(S(e), (n) => Reflect.defineProperty(n, t, r));
  }
  deleteProperty(e, t) {
    return S(e) instanceof Promise ? Reflect.deleteProperty(e, t) : T(S(e), (r) => Reflect.deleteProperty(r, t));
  }
  getPrototypeOf(e) {
    return S(e) instanceof Promise ? Reflect.getPrototypeOf(e) : T(S(e), (t) => Reflect.getPrototypeOf(t));
  }
  setPrototypeOf(e, t) {
    return S(e) instanceof Promise ? Reflect.setPrototypeOf(e, t) : T(S(e), (r) => Reflect.setPrototypeOf(r, t));
  }
  isExtensible(e) {
    return S(e) instanceof Promise ? Reflect.isExtensible(e) : T(S(e), (t) => Reflect.isExtensible(t));
  }
  preventExtensions(e) {
    return S(e) instanceof Promise ? Reflect.ownKeys(e) : T(S(e), (t) => Reflect.preventExtensions(t));
  }
  ownKeys(e) {
    const t = S(e);
    return t instanceof Promise ? Object.keys(t) : T(t, (r) => (typeof r == "object" || typeof r == "function") && r != null ? Object.keys(r) : []) ?? [];
  }
  getOwnPropertyDescriptor(e, t) {
    return S(e) instanceof Promise ? Reflect.getOwnPropertyDescriptor(e, t) : T(S(e), (r) => Reflect.getOwnPropertyDescriptor(r, t));
  }
  construct(e, t, r) {
    return T(S(e), (n) => Reflect.construct(n, t, r));
  }
  has(e, t) {
    return S(e) instanceof Promise ? Reflect.has(e, t) : T(S(e), (r) => Reflect.has(r, t));
  }
  get(e, t, r) {
    if (e = S(e), t == "promise") return e;
    if (t == "resolve" && this.#t) return (...i) => {
      const s = this.#t?.(...i);
      return this.#t = null, s;
    };
    if (t == "reject" && this.#e) return (...i) => {
      const s = this.#e?.(...i);
      return this.#e = null, s;
    };
    if (t == "then" || t == "catch" || t == "finally") {
      if (e instanceof Promise) return e?.[t]?.bind?.(e);
      {
        const i = Promise.try(() => e);
        return i?.[t]?.bind?.(i);
      }
    }
    let n;
    return _?.has?.(e) && (n = _?.get?.(e))?.[t] != null ? n = _?.get?.(e)?.[t] : n = Ee(T(e, async (i) => {
      if (S(i) instanceof Promise) return Reflect.get(i, t, r);
      if (m(i)) return t == Symbol.toPrimitive || t == Symbol.toStringTag ? i : void 0;
      let s;
      try {
        s = Reflect.get(i, t, r);
      } catch {
        s = e?.[t];
      }
      return typeof s == "function" ? s?.bind?.(i) : s;
    })), t == Symbol.toStringTag ? m(n) ? String(n ?? "") || "" : n?.[Symbol.toStringTag]?.() || String(n ?? "") || "" : t == Symbol.toPrimitive ? (i) => {
      if (m(n)) return E(n, i);
    } : n;
  }
  set(e, t, r) {
    return T(S(e), (n) => Reflect.set(n, t, r));
  }
  apply(e, t, r) {
    if (this.#t) {
      const n = this.#t?.(...r);
      return this.#t = null, n;
    }
    return T(S(e, this.#t), (n) => {
      if (typeof n == "function")
        return S(n) instanceof Promise, Reflect.apply(n, t, r);
    });
  }
};
function Ee(e, t, r) {
  return e instanceof Promise || typeof e?.then == "function" ? _?.has?.(e) ? _?.get?.(e) : (Ge?.has?.(e) || e?.then?.((n) => _?.set?.(e, n)), Ge?.getOrInsertComputed?.(e, () => new Proxy(yt(e), new mt(t, r)))) : e;
}
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var d = /* @__PURE__ */ Symbol.for("@value"), g = /* @__PURE__ */ Symbol.for("@extract"), $ = /* @__PURE__ */ Symbol.for("@origin"), se = /* @__PURE__ */ Symbol.for("@registry"), G = /* @__PURE__ */ Symbol.for("@behavior"), oe = /* @__PURE__ */ Symbol.for("@promise"), me = /* @__PURE__ */ Symbol.for("@trigger-less"), h = /* @__PURE__ */ Symbol.for("@trigger-lock"), gt = /* @__PURE__ */ Symbol.for("@trigger-control"), D = /* @__PURE__ */ Symbol.for("@trigger"), ue = /* @__PURE__ */ Symbol.for("@subscribe"), At = /* @__PURE__ */ Symbol.for("@isNotEqual"), de = /* @__PURE__ */ Symbol.for("@realProp"), qe = /* @__PURE__ */ new WeakMap(), he = (e) => {
  const t = typeof e == "object" || typeof e == "function" ? e?.[g] ?? e : e, r = (n) => he(n);
  return Array.isArray(t) ? t?.map?.(r) || Array.from(t || [])?.map?.(r) || [] : t instanceof Map || t instanceof WeakMap ? new Map(Array.from(t?.entries?.() || [])?.map?.(([n, i]) => [n, he(i)])) : t instanceof Set || t instanceof WeakSet ? new Set(Array.from(t?.values?.() || [])?.map?.(r)) : t != null && typeof t == "function" || typeof t == "object" ? Object.fromEntries(Array.from(Object.entries(t || {}) || [])?.filter?.(([n]) => n != g && n != $ && n != se)?.map?.(([n, i]) => [n, he(i)])) : t;
}, Ot = (e) => e?.[g] ?? e?.["@target"] ?? e, V = (e, t = !1) => {
  const r = e;
  if (m(e) || typeof e == "symbol") return e;
  if (e != null && (e instanceof WeakRef || "deref" in e && typeof e?.deref == "function") && (e = e?.deref?.()), e != null && (typeof e == "object" || typeof e == "function")) {
    e = Ot(e);
    const n = t && I(e) && e?.value;
    if (n != null && (typeof n == "object" || typeof n == "function") && (e = n), r != e) return V(e, t);
  }
  return e;
}, We = (e) => e != null && typeof e.then == "function", xt = (e, t) => m(e) || typeof e == "function" ? t?.(e) : We(e) ? e.then(t) : e?.promise && We(e.promise) ? e.promise.then(t) : t?.(e), Ue = /* @__PURE__ */ new WeakMap(), wt = new FinalizationRegistry((e) => {
  e?.forEach?.((t) => t?.());
});
function M(e, t, r) {
  if (!(!r || typeof r != "function" || typeof e != "object" && typeof e != "function"))
    if (t == Symbol.dispose) {
      const n = e?.[g] ?? e;
      Ue?.getOrInsertComputed?.(n, () => {
        const i = /* @__PURE__ */ new Set();
        return (typeof n == "object" || typeof n == "function") && (wt.register(n, i), Ue.set(n, i), n[Symbol.dispose] ??= () => i.forEach((s) => {
          s?.();
        })), i;
      })?.add?.(r);
    } else e[t] = function(...n) {
      const i = e?.[t];
      typeof i == "function" && i.apply(this, n), r.apply(this, n);
    };
}
var ee = (e) => {
  if (typeof e != "string" || e === "") return !1;
  const t = Number(e);
  return Number.isInteger(t) && t >= 0 && String(t) === e;
};
function vr(e = [], t = {}) {
  let r = /* @__PURE__ */ new Set();
  const n = (l, f, o) => {
    t.onDuplicate?.({
      value: l,
      via: f,
      index: o
    });
  };
  if (e instanceof Set) r = e;
  else for (const l of e) {
    if (r.has(l)) {
      n(l, "push");
      continue;
    }
    r.add(l);
  }
  const i = () => Array.from(r), s = (l) => {
    r.clear();
    for (const f of l) r.add(f);
  }, u = {
    push: (...l) => {
      let f = r.size;
      for (const o of l) {
        if (r.has(o)) {
          n(o, "push");
          continue;
        }
        r.add(o), f++;
      }
      return f;
    },
    pop: () => {
      const l = i();
      if (!l.length) return;
      const f = l[l.length - 1];
      return r.delete(f), f;
    },
    shift: () => {
      const l = r.values().next();
      if (l.done) return;
      const f = l.value;
      return r.delete(f), f;
    },
    unshift: (...l) => {
      if (!l.length) return r.size;
      const f = i(), o = [];
      for (const a of l) {
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
    splice: (l, f, ...o) => {
      const y = i(), a = Math.min(Math.max(l, 0), y.length), v = f === void 0 ? y.length - a : Math.max(0, Math.min(f, y.length - a)), A = y.splice(a, v);
      let w = a;
      for (const O of o) {
        if (y.includes(O)) {
          n(O, "splice", w);
          continue;
        }
        y.splice(w++, 0, O);
      }
      return s(y), A;
    },
    includes: (l) => r.has(l),
    indexOf: (l) => i().indexOf(l),
    clear: () => {
      r.clear();
    },
    delete: (l) => r.delete(l),
    toArray: () => i(),
    toSet: () => new Set(r),
    [Symbol.iterator]: () => r[Symbol.iterator]()
  };
  return new Proxy(u, {
    get: (l, f) => {
      if (f === "length") return r.size;
      if (ee(f)) return i()[Number(f)];
      const o = u[f];
      return o;
    },
    set: (l, f, o) => {
      if (f === "length") {
        if (typeof o != "number" || !Number.isFinite(o) || o < 0) throw new RangeError("length must be a finite non-negative number");
        const y = Math.floor(o);
        if (y >= r.size) return !0;
        const a = i().slice(0, y);
        return s(a), !0;
      }
      if (ee(f)) {
        const y = i(), a = Number(f);
        if (a > y.length) return !0;
        const v = o;
        if (a < y.length) {
          const A = y[a];
          if (Object.is(A, v)) return !0;
          if (y.some((w, O) => O !== a && Object.is(w, v)))
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
    deleteProperty: (l, f) => {
      if (f === "length") return !1;
      if (ee(f)) {
        const o = i(), y = Number(f);
        return y >= o.length || (o.splice(y, 1), s(o)), !0;
      }
      return Reflect.deleteProperty(u, f);
    },
    ownKeys: () => {
      const l = [];
      let f = 0;
      for (const o of r) l.push(String(f++));
      return l.push("length"), l;
    },
    getOwnPropertyDescriptor: (l, f) => {
      if (f === "length") return {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: r.size
      };
      if (ee(f)) {
        const o = i(), y = Number(f);
        return y >= o.length ? void 0 : {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          value: o[y]
        };
      }
      return Reflect.getOwnPropertyDescriptor(u, f);
    },
    has: (l, f) => {
      if (f === "length") return !0;
      if (ee(f)) {
        const o = Number(f);
        return o >= 0 && o < r.size;
      }
      return f in u;
    }
  });
}
var Rt = class {
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
    return ie(e, r, t), !0;
  }
  get(e, t, r) {
    return typeof t == "symbol" ? e?.[t] ?? e : Reflect.get(e, t, r);
  }
}, br = (e) => {
  if (e?.[$] || qe.has(e)) return e;
  const t = new Proxy(e, new Rt());
  return qe.set(t, e), t;
}, Le = /* @__PURE__ */ Symbol.for("object.ts@withUnsub");
globalThis[Le] ??= /* @__PURE__ */ new WeakMap();
var Pt = globalThis[Le], Tt = (e, t, r) => Pt.getOrInsert(e, () => {
  const n = t?.deref?.();
  n?.affected?.(r);
  const i = e?.complete?.bind?.(e), s = () => {
    const u = i?.();
    return n?.unaffected?.(r), u;
  };
  return e.complete = s, {
    unaffected: s,
    [Symbol.dispose]: s,
    [Symbol.asyncDispose]: s
  };
}), et = /* @__PURE__ */ Symbol.for("object.ts@subscriptRegistry");
globalThis[et] ??= /* @__PURE__ */ new WeakMap();
var p = globalThis[et] ??= /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ Symbol.for("object.ts@globalEffectListeners");
globalThis[tt] ??= /* @__PURE__ */ new Map();
var ve = globalThis[tt], Je = (e, t = ["*"]) => {
  if (e == null || typeof e != "function") return;
  const r = ut(t);
  return ve.set(e, r.affectTypes), () => ve.delete(e);
}, rt = /* @__PURE__ */ Symbol.for("object.ts@wrapped");
globalThis[rt] ??= /* @__PURE__ */ new WeakMap();
var Mt = globalThis[rt], It = (e, t) => {
  const r = e?.[g] ?? e;
  let n = p.get(r);
  return n ? n.bindSource(r) : (n = new Et(r), p.set(r, n)), t;
}, ce = (e, t) => (e = V(e?.[g] ?? e), typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || e == null ? e : Mt.getOrInsertComputed(e, () => new Proxy(e, It(e, t)))), te = /* @__PURE__ */ Symbol.for("@allProps"), nt = /* @__PURE__ */ new Set(["*", "all"]), Ce = /* @__PURE__ */ new Map([
  ["set", ["setter", "@set"]],
  ["add", ["@add"]],
  ["delete", ["@delete"]],
  ["invalidate", ["@invalidate"]],
  ["manual", ["@manual"]],
  ["custom", ["@custom"]],
  ["setAll", ["@setAll"]],
  ["addAll", ["@addAll"]],
  ["deleteAll", ["@deleteAll", "@clear"]]
]), it = /* @__PURE__ */ Symbol.for("object.ts@triggerCanonicalNames");
globalThis[it] ??= new Map(Array.from(Ce.entries()).flatMap(([e, t]) => t.map((r) => [r, e])));
var kt = globalThis[it], fe = (e = "set") => {
  if (e == null) return e;
  const t = String(e || "set");
  return kt.get(t) ?? t;
}, lt = (e) => {
  const t = e == null ? "all" : String(fe(e) ?? "all");
  return [t, ...Ce.get(t) ?? []];
}, Qe = (e = ["*"]) => new Set([...Y(e)].flatMap((t) => [t, ...Ce.get(t) ?? []])), Y = (e = ["*"]) => {
  const t = typeof e == "string" ? [e] : Array.from(e ?? ["*"]), r = new Set(t.map((n) => {
    const i = String(n || "*");
    return nt.has(i) ? i : String(fe(i) ?? i);
  }));
  return r.size ? r : /* @__PURE__ */ new Set(["*"]);
}, Q = (e, t) => {
  const r = e instanceof Set ? e : Y(e);
  return [...nt].some((n) => r.has(n)) || lt(t).some((n) => r.has(n));
}, st = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), ge = (e = ["*"]) => {
  if (st(e)) return {
    affectTypes: Y(e.affectTypes ?? e.triggers ?? ["*"]),
    triggerImmediately: e.triggerImmediately !== !1
  };
  const t = Y(e);
  return {
    affectTypes: t,
    triggerImmediately: Q(t, "initial")
  };
}, ut = (e = ["*"]) => st(e) ? {
  affectTypes: Y(e.affectTypes ?? e.triggers ?? ["*"]),
  triggerImmediately: e.triggerImmediately === !0
} : {
  affectTypes: Y(e),
  triggerImmediately: !1
}, ft = /* @__PURE__ */ Symbol.for("object.ts@Subscript");
globalThis[ft] ??= class {
  compatible;
  #t;
  #e;
  #r = /* @__PURE__ */ new WeakSet();
  #f;
  #o;
  #l = /* @__PURE__ */ new Set();
  #n = /* @__PURE__ */ new Set();
  #c;
  #y = /* @__PURE__ */ new Map();
  #i = /* @__PURE__ */ new Map();
  #s = !1;
  constructor(t) {
    this.#t = t, this.#e = /* @__PURE__ */ new Map(), this.#r = /* @__PURE__ */ new WeakSet(), this.#c = {
      enable: (i = ["*"], s) => s ? this.withTriggers(i, !0, s) : this.setTriggersEnabled(i, !0),
      disable: (i = ["*"], s) => s ? this.withTriggers(i, !1, s) : this.setTriggersEnabled(i, !1),
      set: (i, s) => this.setTriggersEnabled(i, s),
      with: (i, s) => this.withTriggers(i, !0, s),
      without: (i, s) => this.withTriggers(i, !1, s),
      isEnabled: (i) => this.isTriggerEnabled(i)
    }, this.#o = { next: (i) => {
      i && (Array.isArray(i) ? this.#u(...i) : this.#u(i));
    } };
    const r = new WeakRef(this), n = function(i) {
      const s = i?.next?.bind?.(i);
      return Tt(i, r, s);
    };
    this.#f = typeof Observable < "u" ? new Observable(n) : null, this.compatible = () => this.#f;
  }
  bindSource(t) {
    return this.#t ??= t, this;
  }
  $safeExec(t, ...r) {
    if (!(!t || this.#r.has(t))) {
      this.#r.add(t);
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
        this.#r.delete(t);
      }
    }
  }
  #u(t, r = null, n, i = "all", ...s) {
    i = fe(i) ?? i;
    const u = this.#e;
    if (u?.size)
      for (const [l, f] of u.entries()) (f.prop === t || f.prop === te || f.prop === null) && Q(f.triggers, i) && this.$safeExec(l, r, t, n, i, ...s);
    if (ve.size) {
      const l = {
        source: this.#t,
        target: this.#t,
        value: r,
        prop: t,
        name: t,
        oldValue: n,
        trigger: i,
        args: s
      };
      for (const [f, o] of ve.entries()) Q(o, i) && this.$safeExec(f, l);
    }
  }
  wrap(t) {
    return Array.isArray(t) ? ce(t, this) : t;
  }
  get triggerControl() {
    return this.#c;
  }
  isTriggerEnabled(t) {
    return !Q(this.#n, "all") && !lt(t).some((r) => this.#n.has(r));
  }
  setTriggersEnabled(t = ["*"], r = !0) {
    const n = Qe(t);
    for (const i of n) r ? this.#n.delete(i) : this.#n.add(i);
  }
  withTriggers(t, r, n) {
    const i = [...Qe(t)], s = new Map(i.map((l) => [l, this.#n.has(l)])), u = () => {
      s.forEach((l, f) => {
        l ? this.#n.add(f) : this.#n.delete(f);
      });
    };
    this.setTriggersEnabled(i, r);
    try {
      const l = n?.();
      return l && typeof l.finally == "function" ? l.finally(u) : (u(), l);
    } catch (l) {
      throw u(), l;
    }
  }
  affected(t, r, n = ["*"]) {
    if (t == null || typeof t != "function") return;
    const i = ge(n);
    return this.#e.set(t, {
      prop: r || te,
      triggers: i.affectTypes
    }), () => this.unaffected(t, r || te);
  }
  unaffected(t, r) {
    if (t != null && typeof t == "function") {
      const n = this.#e, i = n?.get(t);
      if (i && (i.prop == r || r == null || r == te))
        return n.delete(t), () => this.affected(t, r || te, i.triggers);
    }
    return this.#e.clear();
  }
  trigger(t, r, n, i = "set", ...s) {
    if (typeof t == "symbol" || (i === void 0 && (i = "set"), i = fe(i) ?? i, !this.isTriggerEnabled(i))) return;
    const u = `${i ?? "all"}`;
    let l = this.#i.get(t);
    l || (l = /* @__PURE__ */ new Map(), this.#i.set(t, l)), l.set(u, [
      t,
      r,
      n,
      i,
      s
    ]), !this.#s && (this.#s = !0, queueMicrotask(() => {
      this.#s = !1;
      const f = this.#i;
      this.#i = /* @__PURE__ */ new Map();
      for (const [o, y] of f)
        if (!(o != null && this.#l.has(o))) {
          o != null && this.#l.add(o);
          try {
            for (const [, a] of y) {
              const [v, A, w, O, k] = a;
              try {
                this.#u(v, A, w, O, ...k ?? []);
              } catch (q) {
                console.warn(q);
              }
            }
          } finally {
            o != null && this.#l.delete(o);
          }
        }
    }));
  }
  get iterator() {
    return this.#o;
  }
};
var Et = globalThis[ft], Wt = /* @__PURE__ */ new Set([
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
  if (!Wt.has(t)) return null;
  const r = c(e, t);
  return typeof r == "function" ? K(e, r) : r;
}, R = /* @__PURE__ */ new WeakMap();
function $t(e, t) {
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
  if (m(e)) return e;
  const r = c(e, t);
  if (r == null && t != "value") {
    const n = c(e, "value");
    return n != null && !m(n) ? H(n, t) : r;
  } else if (t == "value" && r != null && !m(r) && typeof r != "function") return H(r, t) ?? r ?? e;
  return r ?? e;
}, _t = (e, t, r) => {
  if (e == null) return !1;
  let n = __safeSetGuard.getOrInsert(e, /* @__PURE__ */ new Set());
  return n?.has?.(t) ? !1 : (n?.add?.(t), Reflect.set(e, t, r));
}, c = (e, t, r) => {
  let n;
  if (e == null) return e;
  let i = R.getOrInsert(e, /* @__PURE__ */ new Set());
  if (i?.has?.(t)) return null;
  if (!$t(e, t)) n ??= Reflect.get(e, t, r ?? e);
  else {
    i?.add?.(t);
    try {
      n = Reflect.get(e, t, r ?? e);
    } catch {
      n = void 0;
    } finally {
      i.delete(t), i?.size === 0 && R?.delete?.(e);
    }
  }
  return typeof n == "function" ? K(e, n) : n;
}, W = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Pe = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && (W(e, "key") || W(e, "name") || W(e, "oldValue") || W(e, "old") || W(e, "op") || W(e, "trigger") || t && W(e, "value")), z = (e, t, r) => W(e, t) ? e[t] : t == "oldValue" && W(e, "old") ? e.old : r(), Ae = (e, t = "manual") => fe(e.trigger ?? e.op ?? t), Vt = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", be = (e) => {
  const t = c(e, de) ?? c(e, "realProp");
  return Vt(t) ? t : null;
}, Xe = (e, t) => t == "value" ? be(e) ?? t : t, Ct = (e, t) => {
  const r = be(e);
  return r != null && t == r ? c(e, "value") ?? c(e, d) ?? c(e, t) : t == null ? void 0 : c(e, t);
}, Oe = (e, t) => {
  const r = (i, s, u) => (Pe(s) || (u ??= s), t(Pe(i) ? i : Pe(s, !0) ? {
    key: i,
    trigger: u,
    ...s
  } : {
    key: i,
    trigger: u ?? s
  })), n = e?.triggerControl;
  return n && Object.assign(r, n), r.custom = (i, s, u, l) => r({
    key: s,
    trigger: i,
    value: u,
    oldValue: l
  }), r;
}, xe = (e, t, r) => {
  if (e == null || m(e)) return e;
  if (([
    "deref",
    "bind",
    "@target",
    $,
    g,
    se
  ].indexOf(t) < 0 ? c(e, t)?.bind?.(e) : null) != null) return null;
  if ([g, $].indexOf(t) >= 0) return c(e, t) ?? e;
  if (t == d) return c(e, t) ?? c(e, "value");
  if (t == se) return r;
  if (t == gt) return r?.triggerControl;
  if (t == Symbol.observable) return r?.compatible;
  if (t == Symbol.subscribe) return (n, i, s) => b(i != null ? [e, i] : e, n, s);
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
    if (typeof n == "function") return b(e, n);
    if ("next" in n && n?.next != null) {
      const i = b(e, n?.next), s = n?.complete;
      return n.complete = (...u) => (i?.(), s?.(...u)), n.complete;
    }
  });
}, Nt = class {
  #t;
  #e;
  #r;
  constructor(e, t, r) {
    this.#t = e, this.#e = t, this.#r = r;
  }
  get(e, t, r) {
    const n = re(e, t);
    return n ?? Reflect.get(e, t, r);
  }
  apply(e, t, r) {
    let n = [], i = [], s = [], u = [...this.#e], l = -1;
    const f = Reflect.apply(e, t || this.#e, r);
    if (this.#r?.[h])
      return Array.isArray(f) ? $e(f) : f;
    switch (this.#t) {
      case "push":
        l = u?.length, n = r;
        break;
      case "unshift":
        l = 0, n = r;
        break;
      case "pop":
        l = u?.length - 1, u.length > 0 && (i = [u[l]]);
        break;
      case "shift":
        l = 0, u.length > 0 && (i = [u[l]]);
        break;
      case "splice":
        l = r[0];
        for (let y = 0; y < Math.max(u.length, this.#e.length); y++) {
          const a = u[y], v = this.#e[y];
          v === void 0 && y >= this.#e.length ? i.push(a) : a === void 0 && y >= u.length ? s.push([
            y,
            v,
            void 0,
            !1
          ]) : x(a, v) && s.push([
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
        l = 0;
        for (let y = 0; y < u.length; y++) x(u[y], this.#e[y]) && s.push([
          l + y,
          this.#e[y],
          u[y],
          !0
        ]);
        break;
      case "set":
        l = r[1], s.push([
          l,
          r[0],
          u?.[l],
          l in u
        ]);
        break;
    }
    const o = p.get(this.#e);
    return n?.length == 1 ? o?.trigger?.(l, n[0], null, "add") : n?.length > 1 && (o?.trigger?.(l, n, null, "addAll"), n.forEach((y, a) => o?.trigger?.(l + a, y, null, "add"))), s?.length == 1 ? o?.trigger?.(s[0]?.[0] ?? l, s[0]?.[1], s[0]?.[2], s[0]?.[3] === !1 ? "add" : "set") : s?.length > 1 && (o?.trigger?.(l, s, u, "setAll"), s.forEach((y, a) => o?.trigger?.(y?.[0] ?? l + a, y?.[1], y?.[2], y?.[3] === !1 ? "add" : "set"))), i?.length == 1 ? o?.trigger?.(l, null, i[0], "delete") : i?.length > 1 && (o?.trigger?.(l, null, i, "deleteAll"), i.forEach((y, a) => o?.trigger?.(l + a, null, y, "delete"))), f == e ? new Proxy(f, this.#r) : Array.isArray(f) ? $e(f) : f;
  }
}, zt = (e, t, r, n) => {
  const i = Number.isInteger(r) && Number.isInteger(n) && n < r ? t.slice(n, r) : [];
  if (!e[h] && r !== n) {
    const s = p.get(t);
    i.length === 1 ? s?.trigger?.(n, null, i[0], "delete") : i.length > 1 && (s?.trigger?.(n, null, i, "deleteAll"), i.forEach((l, f) => s?.trigger?.(n + f, null, l, "delete")));
    const u = Number.isInteger(r) && Number.isInteger(n) && n > r ? n - r : 0;
    if (u === 1) s?.trigger?.(r, void 0, null, "add");
    else if (u > 1) {
      const l = Array(u).fill(void 0);
      s?.trigger?.(r, l, null, "addAll"), l.forEach((f, o) => s?.trigger?.(r + o, void 0, null, "add"));
    }
  }
}, Dt = class {
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
      g,
      $,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? c(e, t)?.bind?.(e) : c(e, t);
    const i = p?.get?.(e), s = xe(e, t, i);
    if (s != null) return s;
    const u = we(e, t, i);
    if (u != null) return u;
    if (t == me) return pe.call(this, this);
    if (t == D) return Oe(i, (f) => {
      const o = f.key ?? f.name ?? 0, y = z(f, "value", () => c(e, o)), a = z(f, "oldValue", () => {
      });
      return i?.trigger?.(o, y, a, Ae(f, "manual"));
    });
    if (t == "@target" || t == g) return e;
    if (t == "x") return () => e?.x ?? e?.[0];
    if (t == "y") return () => e?.y ?? e?.[1];
    if (t == "z") return () => e?.z ?? e?.[2];
    if (t == "w") return () => e?.w ?? e?.[3];
    if (t == "r") return () => e?.r ?? e?.[0];
    if (t == "g") return () => e?.g ?? e?.[1];
    if (t == "b") return () => e?.b ?? e?.[2];
    if (t == "a") return () => e?.a ?? e?.[3];
    const l = c(e, t) ?? (t == "value" ? c(e, d) : null);
    return typeof l == "function" ? new Proxy(typeof l == "function" ? l?.bind?.(e) : l, new Nt(t, e, this)) : l;
  }
  set(e, t, r) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h && r)
      return this[h] = !!r, !0;
    if (t == h && !r)
      return delete this[h], !0;
    const n = c(e, t), i = [
      "x",
      "y",
      "z",
      "w"
    ], s = [
      "r",
      "g",
      "b",
      "a"
    ], u = i.indexOf(t), l = s.indexOf(t);
    let f = !1;
    return u >= 0 ? f = Reflect.set(e, u, r) : l >= 0 ? f = Reflect.set(e, l, r) : f = Reflect.set(e, t, r), t == "length" && x(n, r) && zt(this, e, n, r), !this[h] && typeof t != "symbol" && x(n, r) && p?.get?.(e)?.trigger?.(t, r, n, "set"), f;
  }
  deleteProperty(e, t) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == h)
      return delete this[h], !0;
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != "length" && t != h && typeof t != "symbol" && r != null && p.get(e)?.trigger?.(t, t, r, "delete"), n;
  }
}, Bt = class {
  [h];
  constructor() {
  }
  get(e, t, r) {
    if ([
      g,
      $,
      "@target",
      "deref",
      "then",
      "catch",
      "finally"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? K(e, c(e, t)) : c(e, t);
    const n = p.get(e) ?? p.get(c(e, "value") ?? e), i = xe(e, t, n);
    if (i != null) return i;
    c(e, t) == null && t != "value" && I(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const s = we(e, t, n);
    return s ?? (t == me ? pe.call(this, this) : t == D ? Oe(n, (u) => {
      const l = Xe(e, u.key ?? u.name ?? be(e) ?? "value"), f = z(u, "oldValue", () => l == "value" || l == be(e) ? c(e, d) : void 0), o = z(u, "value", () => Ct(e, l));
      return n?.trigger?.(l, o, f, Ae(u, "manual"));
    }) : t == Symbol.toPrimitive ? (u) => {
      const l = H(e, t);
      return c(l, t) ? c(l, t)?.(u) : m(l) ? E(l, u) : m(c(l, "value")) ? E(c(l, "value"), u) : E(c(l, "value") ?? l, u);
    } : t == Symbol.toStringTag ? () => {
      const u = H(e, t);
      return c(u, t) ? c(u, t)?.() : m(u) ? String(u ?? "") || "" : m(c(u, "value")) ? String(c(u, "value") ?? "") || "" : String(c(u, "value") ?? u ?? "") || "";
    } : t == "toString" ? () => {
      const u = H(e, t);
      return c(u, t) ? c(u, t)?.() : c(u, Symbol.toStringTag) ? c(u, Symbol.toStringTag)?.() : m(u) ? String(u ?? "") || "" : m(c(u, "value")) ? String(c(u, "value") ?? "") || "" : String(c(u, "value") ?? u ?? "") || "";
    } : t == "valueOf" ? () => {
      const u = H(e, t);
      return c(u, t) ? c(u, t)?.() : c(u, Symbol.toPrimitive) ? c(u, Symbol.toPrimitive)?.() : m(u) ? u : m(c(u, "value")) ? c(u, "value") : c(u, "value") ?? u;
    } : typeof t == "symbol" && (t in e || c(e, t) != null) ? c(e, t) : H(e, t));
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
    return n ?? at(r, (i) => {
      const s = re(i, t);
      if (s != null) return s;
      if (t == h && r)
        return this[h] = !!r, !0;
      if (t == h && !r)
        return delete this[h], !0;
      const u = e;
      if (c(e, t) == null && t != "value" && I(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), typeof t == "symbol" && !(c(e, t) != null && t in e)) return;
      const l = Xe(e, t), f = t == "value" ? c(e, d) ?? c(e, t) : c(e, t);
      e[t] = i;
      const o = c(e, t) ?? i;
      return !this[h] && typeof t != "symbol" && (c(e, At) ?? x)?.(f, o) && (p.get(e) ?? p.get(u))?.trigger?.(l, i, f), !0;
    });
  }
  defineProperty(e, t, r) {
    const n = re(e, t);
    if (n != null) return n;
    if (t == h && r.value)
      return this[h] = !!r.value, !0;
    if (t == h && !r.value)
      return delete this[h], !0;
    if (c(e, t) == null && t != "value" && I(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), r.get == null && r.set == null) return Reflect.defineProperty(e, t, r);
    const i = c(e, t), s = Reflect.defineProperty(e, t, {
      get: r.get,
      set: r.set,
      enumerable: r.enumerable ?? !0,
      configurable: r.configurable ?? !0
    });
    return _t(e, t, i), s;
  }
  deleteProperty(e, t) {
    if (t == h)
      return delete this[h], !0;
    c(e, t) == null && t != "value" && I(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
    return !this[h] && t != h && typeof t != "symbol" && p.get(e)?.trigger?.(t, null, r, "delete"), n;
  }
}, Ft = class {
  [h];
  constructor() {
  }
  get(e, t, r) {
    if ([
      g,
      $,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? K(e, c(e, t)) : c(e, t);
    const n = p.get(e), i = xe(e, t, n);
    if (i != null) return i;
    const s = we(e, t, n);
    if (s != null) return s;
    e = c(e, g) ?? c(e, $) ?? e;
    const u = K(e, c(e, t));
    return typeof t == "symbol" && (t in e || c(e, t) != null) ? u : t == me ? pe.call(this, this) : t == D ? Oe(n, (l) => {
      const f = l.key ?? l.name;
      if (f == null) return;
      const o = z(l, "value", () => e.get(f));
      if (o == null && !W(l, "value")) return;
      const y = z(l, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, Ae(l, "manual"));
    }) : t == "clear" ? () => {
      const l = Array.from(e?.entries?.() || []), f = u();
      return l.forEach(([o, y]) => {
        this[h] || p.get(e)?.trigger?.(o, null, y, "delete");
      }), f;
    } : t == "delete" ? (l, f = null) => {
      const o = e.has(l), y = e.get(l), a = u(l);
      return !this[h] && o && p.get(e)?.trigger?.(l, null, y, "delete"), a;
    } : t == "set" ? (l, f) => ht(f, (o) => {
      const y = e.has(l), a = e.get(l), v = u(l, o);
      return (!y || x(a, o)) && (this[h] || p.get(e)?.trigger?.(l, o, y ? a : null, y ? "set" : "add")), v;
    }) : u;
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
}, Ht = class {
  [h] = !1;
  constructor() {
  }
  get(e, t, r) {
    if ([
      g,
      $,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? K(e, c(e, t)) : c(e, t);
    const n = p.get(e), i = xe(e, t, n);
    if (i != null) return i;
    const s = we(e, t, n);
    if (s != null) return s;
    e = c(e, g) ?? c(e, $) ?? e;
    const u = K(e, c(e, t));
    return typeof t == "symbol" && (t in e || c(e, t) != null) ? u : t == me ? pe.call(this, this) : t == D ? Oe(n, (l) => {
      const f = l.key ?? l.name;
      if (f == null) return;
      const o = z(l, "value", () => e.has(f)), y = z(l, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, Ae(l, "manual"));
    }) : t == "clear" ? () => {
      const l = Array.from(e?.values?.() || []), f = u();
      return l.forEach((o) => {
        this[h] || p.get(e)?.trigger?.(null, null, o, "delete");
      }), f;
    } : t == "delete" ? (l) => {
      const f = e.has(l), o = f ? l : null, y = u(l);
      return !this[h] && f && p.get(e)?.trigger?.(l, null, o, "delete"), y;
    } : t == "add" ? (l) => {
      const f = e.has(l), o = f ? l : null, y = u(l);
      return f || this[h] || p.get(e)?.trigger?.(l, l, o, "add"), y;
    } : u;
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
}, Z = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[g] || e?.[ue])), $e = (e) => Z(e) ? e : ce(e, new Dt()), Kt = (e) => Z(e) ? e : ce(e, new Bt()), Gt = (e) => Z(e) ? e : ce(e, new Ft()), qt = (e) => Z(e) ? e : ce(e, new Ht()), Ut = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = P({
    [oe]: r ? e : null,
    [d]: r ? 0 : Number(V(e) || 0) || 0,
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](i) {
      return E((typeof this?.[d] != "object" ? this?.[d] : this?.[d]?.value || 0) ?? 0, i);
    },
    set value(i) {
      this[d] = (i != null && !Number.isNaN(i) ? Number(i) : this[d]) || 0;
    },
    get value() {
      return Number(this[d] || 0) || 0;
    }
  });
  return e?.then?.((i) => n.value = i), n;
}, Jt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = P({
    [oe]: r ? e : null,
    [d]: (r ? "" : String(V(typeof e == "number" ? String(e) : e || ""))) ?? "",
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") ?? "";
    },
    [Symbol?.toPrimitive](i) {
      return E(this?.[d] ?? "", i);
    },
    set value(i) {
      this[d] = String(typeof i == "number" ? String(i) : i || "") ?? "";
    },
    get value() {
      return String(this[d] ?? "") ?? "";
    }
  });
  return e?.then?.((i) => n.value = i), n;
}, Qt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = P({
    [oe]: r ? e : null,
    [d]: (r ? !1 : (V(e) != null ? typeof V(e) == "string" ? !0 : !!V(e) : !1) || !1) || !1,
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](i) {
      return E(!!this?.[d] || !1, i);
    },
    set value(i) {
      this[d] = (i != null ? typeof i == "string" ? !0 : !!i : this[d]) || !1;
    },
    get value() {
      return this[d] || !1;
    }
  });
  return e?.then?.((i) => n.value = i), n;
}, Ye = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = P({
    [oe]: r ? e : null,
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this.value ?? "") || "";
    },
    [Symbol?.toPrimitive](i) {
      return E(this.value, i);
    },
    value: r ? null : V(e)
  });
  return e?.then?.((i) => n.value = i), b(e, (i) => {
    n?.[D]?.();
  }), n;
}, Te = (e, t) => {
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
}, Xt = (e, t = "value", r, n) => {
  if (m(e) || !e) return e;
  Array.isArray(e) && e.length == 2 && e[0] != null && (e[0] instanceof Map || e[0] instanceof WeakMap || e[0] instanceof Set || e[0] instanceof WeakSet) ? ((t == null || t === "value") && (t = e[1]), e = e[0]) : Array.isArray(e) && !le(e?.[1], e) && (Array.isArray(e?.[0]) || typeof e?.[0] == "object" || typeof e?.[0] == "function") && (e = e?.[0]);
  const i = e instanceof Map || e instanceof WeakMap, s = e instanceof Set || e instanceof WeakSet;
  if (i || s) {
    if (t == null) return;
  } else if ((t ??= Array.isArray(e) ? null : "value") == null || le(t, e)) return;
  const u = () => i ? e.get(t) : s ? e.has(t) : e?.[t], l = (a) => i ? (e.set(t, a), a) : s ? (a ? e.add(t) : e.delete(t), e.has(t)) : e[t] = a;
  i && r !== void 0 && !e.has(t) ? e.set(t, r) : s && r && !e.has(t) && e.add(t);
  const f = u();
  if (!s && t != null && I(f) && C(f)) return Te(jt(f), t);
  if (!i && !s && t && typeof e?.getProperty == "function" && C(e?.getProperty?.(t))) return Te(e?.getProperty?.(t), t);
  !i && !s && (e[t] ??= r ?? e[t]);
  const o = P({
    [d]: s ? !!u() : u() ?? r,
    [G]: n,
    [Symbol?.toStringTag]() {
      return String(u() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return E(u(), a);
    },
    set value(a) {
      if (o[X] = !0, s) this[d] = l(a);
      else {
        const v = a ?? dt(u());
        this[d] = l(v);
      }
      o[X] = !1;
    },
    get value() {
      const a = u();
      return this[d] = s ? !!a : a ?? this[d];
    }
  });
  Te(o, t);
  const y = b(e, (a, v, A, w) => {
    if (v === t) {
      const O = s ? a != null : a, k = s ? A != null : A;
      o?.[D]?.({
        key: t,
        value: O,
        oldValue: k,
        trigger: w
      });
    }
  });
  return M(o, Symbol.dispose, y), o;
}, Yt = (e, t) => {
  switch (typeof e) {
    case "boolean":
      return Qt(e, t);
    case "number":
      return Ut(e, t);
    case "string":
      return Jt(e, t);
    case "object":
      if (e != null) return Ye(P(e), t);
    default:
      return Ye(e, t);
  }
}, Zt = (e, t = "value", r) => {
  const n = C(e) ? e : Yt(e, r);
  return t != null ? Xt(n, t, r) : n;
}, pr = (e, t) => Zt(e, t), Ne = (e, t, r = 100) => {
  if (e?.value ?? e) return setTimeout(() => {
    e.value && t?.();
  }, r);
}, mr = (e = 100) => (t, [r], [n]) => {
  let i = Ne(r, t, e);
  n?.addEventListener?.("abort", () => {
    i && clearTimeout(i);
  }, { once: !0 });
}, gr = (e = 100) => (t, [r], [n]) => {
  let i = Ne(r, t, e);
  n?.addEventListener?.("abort", () => {
    i && clearTimeout(i);
  }, { once: !0 }), i || t?.();
};
function P(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || Z(e) || (e = V?.(e)) == null || e instanceof Promise || e instanceof WeakRef || Z(e)) return e;
  const r = e;
  if (r == null || typeof r == "symbol" || !(typeof r == "object" || typeof r == "function") || r instanceof Promise || r instanceof WeakRef) return r;
  let n = r;
  return Array.isArray(r) ? (n = $e(r), n) : r instanceof Map ? (n = Gt(r), n) : r instanceof Set ? (n = qt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = Kt(r)), n);
}
var C = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[g] || e?.[ue] || p?.has?.(e))), jt = (e) => C(e) ? P(e) : null, Ar = (e) => {
  if (e == null || typeof e != "object" && typeof e != "function" || e?.[Symbol.observable] != null) return e;
  try {
    e[Symbol.observable] = self?.compatible;
  } catch {
    console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks");
  }
  return e[ue] = (t, r, n) => {
    const i = e?.[Symbol?.observable];
    return i?.()?.affected?.(t, r, n), () => i?.()?.unaffected?.(t, r);
  }, e;
}, U = /* @__PURE__ */ new WeakMap(), ze = (e) => {
  if (!(typeof e == "symbol" || e == null || !(typeof e == "object" || typeof e == "function")))
    return e;
}, Se = "initial", De = (e) => {
  const t = e?.[de] ?? e?.realProp;
  return N(t) ? t : null;
}, Be = (e, t) => {
  const r = De(e);
  return r != null && (t == null || t == "value") ? r : t;
}, Lt = (e, t) => t != null && t == De(e) ? e?.value : e?.[t], _e = (e, t, r, n) => {
  if (t != null && t == De(e)) {
    const i = Lt(e, t);
    if (i != null) return r?.(i, t, null, "set");
  }
  return ae(e, t, r, n);
}, ot = (e, t, r) => {
  const n = ge(t);
  if (r == Se) {
    if (!n.triggerImmediately) return;
  } else if (!Q(n.affectTypes, r)) return;
  return (i, s, u, ...l) => e?.(i, s, u, r, ...l);
}, er = (e, t, r, n = ["*"]) => {
  if (!e || !ze(e)) return;
  const i = t != Symbol.iterator ? Be(e, t) : null;
  let s = e?.[se] ?? p.get(e);
  e = e?.[g] ?? e, queueMicrotask(() => {
    const l = ot(r, n, Se);
    l && (i != null && i != Symbol.iterator ? _e(e, i, l, null) : Ve(e, l, null));
  });
  let u = s?.affected?.(r, i, n);
  return e?.[Symbol.dispose] || (M(u, Symbol.dispose, u), M(u, Symbol.asyncDispose, u), M(e, Symbol.dispose, u), M(e, Symbol.asyncDispose, u)), u;
}, tr = (e, t, r, n = ["*"]) => {
  const i = ge(n).affectTypes, s = {};
  let u = e?.value;
  const l = (f) => {
    const o = f?.target?.value;
    Q(i, "set") && r?.(o, "value", u, "set", f), u = o;
  };
  return e?.addEventListener?.("change", l, s), () => e?.removeEventListener?.("change", l, s);
}, ne = (e) => Array.isArray(e) && e?.length == 2 && ze(e?.[0]) && (N(e?.[1]) || e?.[1] == Symbol.iterator), rr = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), nr = (e) => e == null ? [] : Array.isArray(e) && !ne(e) && !C(e) ? e : [e], ir = (e) => {
  if (ne(e)) {
    const t = e?.[0];
    return {
      source: e,
      target: t,
      prop: Be(t, e?.[1])
    };
  }
  return {
    source: e,
    target: e,
    prop: null
  };
}, lr = (e, t, r, n, i, s, u) => ({
  source: e,
  target: t,
  value: r,
  prop: n,
  name: n,
  oldValue: i,
  trigger: s,
  args: u
}), sr = (e, t, r, n = ["*"]) => {
  const i = N(e?.[1]) ? e?.[1] : null;
  return b(e?.[0], i, r, n);
}, ur = (e, t, r, n = ["*"]) => e?.then?.((i) => b?.(i, t, r, n))?.catch?.((i) => (console.warn(i), null)), b = (e, t, r = () => {
}, n) => {
  if (typeof t == "function" ? (n = r, r = t, t = null) : t = Be(e, t), (typeof r == "object" || Array.isArray(r)) && (n = r, r = () => {
  }), (m(e) || typeof e == "symbol") && ge(n).triggerImmediately)
    return Ee(globalThis?.Promise?.try?.(() => r?.(e, null, null, null, Se)));
  if (typeof e?.[ue] == "function") return e?.[ue]?.(r, t, n);
  if (ze(e)) {
    const i = e;
    if (U?.has?.(e = e?.[g] ?? e)) return U?.get?.(e)?.(i, t, r, n);
    if (C(i) || ne(e) && C(e?.[0])) return We(e) ? U?.getOrInsert?.(e, ur)?.(e, t, r, n) : ne(e) ? U?.getOrInsert?.(e, sr)?.(e, t, r, n) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? U?.getOrInsert?.(e, tr)?.(e, t, r, n) : U?.getOrInsert?.(e, er)?.(i, t, r, n);
    {
      const s = ot(r, n, Se);
      return s ? Ee(globalThis?.Promise?.try?.(() => ne(e) ? _e?.(e?.[0], e?.[1], s, null) : t != null && t != Symbol.iterator ? _e?.(e, t, s, null) : Ve?.(e, s, null))) : void 0;
    }
  }
};
function fr(e, t, r) {
  if (e == null || typeof e != "function") return;
  if (rr(t) && r === void 0) return Je(e, t);
  if (t == null) return Je(e, r);
  const n = ut(r), i = {
    affectTypes: n.affectTypes,
    triggerImmediately: n.triggerImmediately
  }, s = nr(t).map((u) => {
    const l = ir(u);
    return b(l.target, l.prop, (f, o, y, a, ...v) => e(lr(l.source, l.target, f, o, y, a ?? null, v)), i);
  }).filter((u) => typeof u == "function");
  return () => s.forEach((u) => u?.());
}
function Or(e, t, r) {
  return fr(t, e, r);
}
var xr = (e) => e instanceof Set ? ct(e) : e instanceof Map ? hr(e) : e, or = class {
  #t = /* @__PURE__ */ new WeakMap();
  #e(e) {
    let t = this.#t.get(e);
    return t || (t = /* @__PURE__ */ new WeakMap(), this.#t.set(e, t)), t;
  }
  #r(e) {
    return !Array.isArray(e) || e.length !== 2 ? [null, null] : e;
  }
  hasL1(e) {
    return this.#t.has(e);
  }
  set(e, t) {
    const [r, n] = this.#r(e);
    return this.#e(r).set(n, t), this;
  }
  get(e) {
    const [t, r] = this.#r(e);
    return this.#t.get(t)?.get(r);
  }
  has(e) {
    const [t, r] = this.#r(e);
    return this.#t.get(t)?.has(r) ?? !1;
  }
  delete(e) {
    const [t, r] = this.#r(e), n = this.#t.get(t);
    return n ? n.delete(r) : !1;
  }
  deleteTop(e) {
    return this.#t.delete(e);
  }
  getOrCreate(e, t) {
    const [r, n] = this.#r(e), i = this.#e(r);
    if (i.has(n)) return i.get(n);
    const s = t();
    return i.set(n, s), s;
  }
  getOrInsert(e, t) {
    const [r, n] = this.#r(e), i = this.#e(r);
    return i.has(n) ? i.get(n) : (i.set(n, t), t);
  }
  getOrInsertComputed(e, t) {
    const [r, n] = this.#r(e), i = this.#e(r);
    if (i.has(n)) return i.get(n);
    const s = t([r, n]);
    return i.set(n, s), s;
  }
}, Me = new or();
function cr(e, t, r = ["*"]) {
  if (!e) return;
  if (Me.has([e, t])) return Me.get([e, t]);
  const n = (i, s, u, l) => {
    if (s == "value") {
      const f = (u?.value ?? u)?.entries?.(), o = e?.value ?? i?.value ?? i;
      if (f) for (const [y, a] of f) {
        const v = a ?? (u?.value ?? u)?.[y] ?? null, A = o?.[y];
        v == null && A != null ? t(A, y, null, "add") : v != null && A == null ? t(null, y, v, "delete") : x(v, A) && t(A, y, v, "set");
      }
      return cr(i ?? e?.value, t, r);
    }
    return s == null ? void 0 : e[s];
  };
  return Me.getOrInsertComputed([e, t], () => e instanceof Set ? b([ct(e), Symbol.iterator], t, r) : e instanceof Map ? b(e, t, r) : I(e) ? b(e, n, r) : Array.isArray(e) && !(e?.length == 2 && N(e?.[1]) && C(e?.[0])) ? b([e, Symbol.iterator], t, r) : b(e, t, r));
}
function Ie(e, t) {
  return xt(e, (r) => {
    const n = Array.isArray(r) && r?.length == 2 && ["object", "function"].indexOf(typeof r?.[0]) >= 0 && N(r?.[1]), i = n ? r?.[1] : null;
    r = n && i != null ? r?.[0] ?? r : r;
    const s = typeof r == "object" || typeof r == "function" ? r?.[g] ?? r : r;
    (r?.[se] ?? p.get(s))?.unaffected?.(t, i);
  });
}
var yr = (e, t, r) => (b(t, null, (n, i) => {
  ie(e, n, i, !0);
}), r?.(() => e, (n) => {
  for (const i in n) ie(t, n[i], i, !0);
}, { deep: !0 }), e), wr = (e, t, r) => yr(t(he(e)), e, r), Rr = (e, t, r = () => "") => b(t, null, (n, i) => {
  i == r() && ie(e, n, null, !0);
}), Pr = (e = []) => {
  const t = P({ value: 0 }), r = (l) => typeof l == "function" ? l() : I(l) ? l.value : l, i = dr([t, "value"], () => e.findIndex((l) => !!r(l)), "value"), s = () => {
    t.value++;
  }, u = [];
  C(e) && u.push(b(e, s, {
    affectTypes: [
      "add",
      "set",
      "delete"
    ],
    triggerImmediately: !1
  }));
  for (const l of e) I(l) && u.push(b([l, "value"], s, {
    affectTypes: ["setter"],
    triggerImmediately: !1
  }));
  return M(i, Symbol.dispose, () => u.forEach((l) => l?.())), i;
}, ar = (e, t, r, n) => {
  if (m(e)) return e ? t : r;
  const i = () => t, s = () => r, u = (o) => (o != null && (e.value = I(o) ? o?.value : o), (I(e) ? e?.value : e) ? i() : s()), l = P({
    [d]: u(),
    [G]: n,
    [Symbol?.toStringTag]() {
      return String(u() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](o) {
      return E(u() ?? this[d], o);
    },
    set value(o) {
      this[d] = u(o);
    },
    get value() {
      return this[d] = u() ?? this[d];
    }
  }), f = b([e, "value"], () => {
    const o = l?.[d], y = u();
    l[d] = y, l?.[D]?.({
      key: "value",
      value: y,
      oldValue: o,
      trigger: "manual"
    });
  });
  return M(l, Symbol.dispose, f), l;
}, Tr = ar, Mr = (e, t, r) => {
  r || (r = P({}));
  const n = b(e, (i, s, u) => {
    if (s == null) return;
    const l = t?.(i, s, u);
    typeof l == "object" ? St(r, l) : x(r[s], l) && (r[s] = l);
  });
  return r && M(r, Symbol.dispose, n), r;
}, Ir = (...e) => {
  const t = P({});
  return e?.forEach?.((r) => b(r, (n, i, s) => {
    i != null && x(t[i], n) && (t[i] = n);
  })), t;
}, ct = (e) => {
  const t = P([]);
  return t.push(...Array.from(e?.values?.() || [])), M(t, Symbol.dispose, b(e, (r, n, i) => {
    if (x(r, i)) if (i == null && r != null) t.push(r);
    else if (i != null && r == null) {
      const s = t.indexOf(i);
      s >= 0 && t.splice(s, 1);
    } else {
      const s = t.indexOf(i);
      s >= 0 && x(t[s], r) && (t[s] = r);
    }
  })), t;
}, hr = (e) => {
  const t = P([]), r = Array.from(e.entries());
  return t.push(...r), M(t, Symbol.dispose, b(e, (n, i, s) => {
    if (x(n, s) || s == null && n != null || s != null && n == null) if (s != null && n == null) {
      let u = t.findIndex(([l, f]) => l == i);
      u < 0 && (u = t.findLastIndex(([l, f]) => s === f)), u >= 0 && t.splice(u, 1);
    } else {
      let u = t.findIndex(([l, f]) => l == i);
      u >= 0 && u < t.length ? x(t[u]?.[1], n) && (t[u] = [i, n]) : t.push([i, n]);
    }
  })), t;
}, F = /* @__PURE__ */ new WeakMap(), Ze = (e, t, r = "value") => {
  const n = typeof e?.[1] == "function" && e?.length == 2, i = typeof t?.[1] == "function" && t?.length == 2, s = i ? t?.[1] : null, u = (N(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let l = u && !n ? e?.[1] : Array.isArray(e) ? null : r;
  !u && !n && (e = [e, l]), n && (e[1] = l);
  const f = (N(t?.[1]) || t?.[1] == Symbol.iterator) && t?.length == 2;
  let o = f && !i ? t?.[1] : Array.isArray(t) ? null : r;
  if (!f && !i && (t = [t, o]), i && (t[1] = o), l == null || o == null || le(l, e?.[0]) || le(o, t?.[0])) return;
  if (!((typeof t?.[0] == "object" || typeof t?.[0] == "function") && t?.[0] != null) && !Array.isArray(e[0]))
    return ye(t, () => {
      e[0][l] = t?.[0];
    }), () => {
    };
  const y = (q, j) => {
    const B = A?.deref?.(), L = v?.deref?.();
    if (F?.get?.(B)?.get?.(l)?.bound == L) {
      let Re = null;
      const Fe = F?.get?.(B)?.get?.(l)?.cmpfx;
      ye(L, () => {
        typeof Fe == "function" ? Re = Fe?.(Ke(L) ?? q, j, null) : Re = L?.[j] ?? q;
      });
      const He = Ke(Re);
      x(B[l], He) && ye(L, () => {
        B[l] = He;
      });
    } else F?.get?.(B)?.get?.(l)?.dispose?.();
  }, a = () => {
    const q = A?.deref?.(), j = F?.get?.(q), B = j?.get?.(l);
    j?.delete?.(l), B?.unsub?.();
  }, v = t?.[0] != null && (typeof t?.[0] == "object" || typeof t?.[0] == "function") && !(t?.[0] instanceof WeakRef || typeof t?.[0]?.deref == "function") ? new WeakRef(t?.[0]) : t?.[0], A = e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function") && !(e?.[0] instanceof WeakRef || typeof e?.[0]?.deref == "function") ? new WeakRef(e?.[0]) : e?.[0];
  let w = {
    compute: y,
    dispose: a,
    cmpfx: s
  };
  const O = A?.deref?.(), k = v?.deref?.();
  return A instanceof WeakRef && (F?.get?.(O)?.get?.(l)?.bound != k && F?.get?.(O)?.delete?.(l), w = F?.getOrInsert?.(O, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(l, () => ({
    bound: k,
    cmpfx: s,
    unsub: null,
    compute: y,
    dispose: a
  })), w.unsub = b(t, y), w.cmpfx = s, M(O, Symbol.dispose, w?.dispose), M(k, Symbol.dispose, w?.dispose)), k && !Array.isArray(k) && ye(O, () => {
    k[o] ??= O?.[l] ?? k[o];
  }), w?.dispose;
}, kr = (e, t, r = "value") => {
  const n = [Ze(e, t, r), Ze(t, e, r)];
  return () => n?.map?.((i) => i?.());
}, dr = (e, t, r, n = "value") => {
  const i = typeof e?.[1] == "function" && e?.length == 2, s = (N(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let u = s && !i ? e?.[1] : Array.isArray(e) ? null : n;
  if (!s && !i && (e = [s ? e?.[0] : e, u]), i && (e[1] = u), u == null || le(u, e?.[0])) return;
  const l = (a) => {
    let v;
    return a != null && (v = e[0][u], e[0][u] = a), t?.(e?.[0]?.[u], u, v);
  }, f = l(), o = P({
    [oe]: void 0,
    [d]: f,
    [G]: r,
    [Symbol?.toStringTag]() {
      return String(l() ?? this[d] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return E(l() ?? this[d], a);
    },
    set value(a) {
      this[d] = l(a);
    },
    get value() {
      return this[d] = l() ?? this[d];
    }
  }), y = b([e?.[0] ?? e, u ?? "value"], () => {
    const a = o?.[d], v = l();
    o[d] = v, o?.[D]?.({
      key: "value",
      value: v,
      oldValue: a,
      trigger: "manual"
    });
  });
  return M(o, Symbol.dispose, y), o;
}, Er = (e, t, r = 100) => {
  let n;
  return b(e, "value", (i) => {
    !i && n ? (clearTimeout(n), n = null) : i && !n && (n = Ne(e, t, r) ?? n);
  });
};
export {
  ue as $affected,
  Yt as $ref,
  D as $trigger,
  gt as $triggerControl,
  me as $triggerLess,
  h as $triggerLock,
  Rt as AssignObjectHandler,
  or as DoubleWeakMap,
  M as addToCallChain,
  b as affected,
  Ze as assign,
  F as assignMap,
  yr as bindBy,
  Rr as bindByKey,
  Qt as booleanRef,
  dr as computed,
  Tr as conditional,
  Pr as conditionalIndex,
  ar as conditionalRef,
  mr as delayedBehavior,
  gr as delayedOrInstantBehavior,
  Er as delayedSubscribe,
  V as deref,
  wr as derivate,
  fr as effect,
  Or as effected,
  C as isObservable,
  cr as iterated,
  kr as link,
  xr as makeArrayObservable,
  br as makeObjectAssignable,
  Ut as numberRef,
  hr as observableByMap,
  ct as observableBySet,
  P as observe,
  pr as promised,
  Xt as propRef,
  jt as recoverReactive,
  Zt as ref,
  Mr as remap,
  he as safe,
  U as specializedSubscribe,
  Jt as stringRef,
  er as subscribeDirectly,
  tr as subscribeInput,
  sr as subscribePaired,
  ur as subscribeThenable,
  Ne as triggerWithDelay,
  Ie as unaffected,
  Ir as unified,
  Ot as unwrap,
  Ar as useObservable,
  Ye as wrapRef,
  vr as wrapSetAsArray
};
