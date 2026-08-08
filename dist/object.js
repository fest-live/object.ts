var Le = /* @__PURE__ */ Symbol.for("@fix"), m = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" || typeof e > "u" || e == null, E = (e, t) => m(e) ? t == "number" ? Number(e) || 0 : t == "string" ? String(e) || "" : t == "boolean" ? !!e : e : null, ke = (e, t = "value") => (typeof e == "object" || typeof e == "function") && e != null && (t in e || e?.[t] != null), M = (e) => ke(e, "value"), Ke = (e) => m(e) ? e : M(e) ? e?.value : e, S = (e, t) => e?.[Le] ?? e ?? t ?? t, lt = (e) => {
  if (typeof e == "function" || e == null) return e;
  const t = function() {
  };
  return t[Le] = e, t;
}, Q = /* @__PURE__ */ Symbol.for("@trigger-lock"), ye = (e, t, r = "value") => {
  ke(e, r) && (e[Q] = !0);
  let n;
  try {
    n = t?.();
  } finally {
    ke(e, r) && delete e[Q];
  }
  return n;
}, st = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), ut = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), pe = function(e) {
  return (t) => {
    e[Q] = !0;
    let r;
    try {
      r = t?.();
    } finally {
      e[Q] = !1;
    }
    return r;
  };
}, ft = (e) => {
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
}, U = (e) => typeof e?.[Symbol.iterator] == "function", C = (e) => [
  "symbol",
  "string",
  "number"
].indexOf(typeof e) >= 0, ot = (e, t, r = null) => {
  const n = r != null && (typeof e == "object" || typeof e == "function") ? e?.[r] ?? e : e;
  let i = [];
  t instanceof Set || t instanceof Map || Array.isArray(t) || U(t) ? i = (n instanceof Set || n instanceof WeakSet ? t?.values?.() : t?.entries?.()) || (Array.isArray(t) || U(t) ? t : []) : (typeof t == "object" || typeof t == "function") && (i = n instanceof Set || n instanceof WeakSet ? Object.values(t) : Object.entries(t));
  let u = [];
  Array.isArray(n) ? u = n.entries() : n instanceof Map || n instanceof WeakMap ? u = n?.entries?.() : n instanceof Set || n instanceof WeakSet ? u = n?.values?.() : (typeof n == "object" || typeof n == "function") && (u = Object.entries(n));
  const s = new Set(Array.from(i).map((o) => o?.[0])), l = new Set(Array.from(u).map((o) => o?.[0])), f = s?.difference?.(l);
  if (Array.isArray(n)) {
    const o = n.filter((y, a) => !f.has(a));
    n.splice(0, n.length), n.push(...o);
  } else if (n instanceof Map || n instanceof Set || n instanceof WeakMap || n instanceof WeakSet) for (const o of f) n.delete(o);
  else if (typeof n == "function" || typeof n == "object") for (const o of f) delete n[o];
  return n;
}, ne = (e, t, r = null, n = !0, i = "id") => {
  const u = r != null && (typeof e == "object" || typeof e == "function") ? e?.[r] ?? e : e;
  let s = null;
  if (n && ot(u, t), t instanceof Set || t instanceof Map || Array.isArray(t) || U(t) ? s = (u instanceof Set || u instanceof WeakSet ? t?.values?.() : t?.entries?.()) || (Array.isArray(t) || U(t) ? t : []) : (typeof t == "object" || typeof t == "function") && (s = u instanceof Set || u instanceof WeakSet ? Object.values(t) : Object.entries(t)), u && s && (typeof s == "object" || typeof s == "function")) {
    if (u instanceof Map || u instanceof WeakMap) {
      for (const l of s) u.set(...l);
      return u;
    }
    if (u instanceof Set || u instanceof WeakSet) {
      for (const l of s) {
        const f = l?.[i] ? Array.from(u?.values?.() || []).find((o) => !x?.(o?.[i], l?.[i])) : null;
        f != null ? ne(f, l, null, n, i) : u.add(l);
      }
      return u;
    }
    if (typeof u == "object" || typeof u == "function") {
      if (Array.isArray(u) || U(u)) {
        let l = 0;
        for (const f of s) l < u.length ? u[l++] = f?.[1] : u?.push?.(f?.[1]);
        return u;
      }
      return Object.assign(u, Object.fromEntries([...s || []].filter((l) => typeof l != "symbol")));
    }
  }
  return r != null ? (Reflect.set(e, r, t), e) : typeof t == "object" || typeof t == "function" ? Object.assign(e, t) : t;
}, ct = (e, t) => at.getOrInsert(e, /* @__PURE__ */ new WeakMap()).getOrInsert(t, t?.bind?.(e)), K = (e, t) => (typeof t == "function" ? ct(e, t) : t) ?? t, ae = (e, t, r, n) => {
  if (t == Symbol.iterator) return Ve(e, r, n);
  if (t == null || typeof t == "symbol" || typeof t == "object" || typeof t == "function") return;
  const i = (u, ...s) => {
    if (u != null) return r?.(u, ...s);
  };
  if (e instanceof Map || e instanceof WeakMap) {
    if (e.has(t)) return i?.(e.get(t), t, null, "@set");
  } else if (e instanceof Set || e instanceof WeakSet) {
    if (e.has(t)) return i?.(t, t, null, "@add");
  } else if (Array.isArray(e) && typeof t == "string" && [...t?.matchAll?.(/^\d+$/g)].length == 1 && Number.isInteger(typeof t == "string" ? parseInt(t) : t)) {
    const u = typeof t == "string" ? parseInt(t) : t;
    return i?.(e?.[u], u, null, "@add");
  } else if (typeof e == "function" || typeof e == "object") return i?.(e?.[t], t, null, "@set");
}, yt = (e, t = {}) => (Object.entries(t)?.forEach?.(([r, n]) => {
  x(n, e[r]) && (e[r] = n);
}), e), Ve = (e, t, r) => {
  if (e == null) return;
  let n = [];
  if (e instanceof Set || e instanceof Map || typeof e?.keys == "function") return [...e?.keys?.() || n].forEach?.((i) => ae(e, i, t, r));
  if (Array.isArray(e) || U(e)) return [...e].forEach?.((i, u) => ae(e, u, t, r));
  if (typeof e == "object" || typeof e == "function") return [...Object.keys(e) || n].forEach?.((i) => ae(e, i, t, r));
}, x = (e, t) => e == null && t == null ? !1 : e == null || t == null ? !0 : typeof e == "boolean" && typeof t == "boolean" ? e != t : typeof e == "number" && typeof t == "number" ? !(e == t || Math.abs(e - t) < 1e-9) : typeof e == "string" && typeof t == "string" ? e != "" && t != "" && e != t || e !== t : typeof e != typeof t ? e !== t : e && t && e != t || e !== t, at = /* @__PURE__ */ new WeakMap(), ie = (e, t) => {
  const r = e == null || e < 0 || typeof e != "number" || e == Symbol.iterator || (t != null ? e >= (t?.length || 0) : !1);
  return t != null ? Array.isArray(t) && r : !1;
}, _ = /* @__PURE__ */ new WeakMap(), Ge = /* @__PURE__ */ new WeakMap(), T = (e, t) => e instanceof Promise || typeof e?.then == "function" ? _?.has?.(e) ? t(_?.get?.(e)) : Promise.try?.(async () => {
  const r = await e;
  return _?.set?.(e, r), r;
})?.then?.(t) : t(e), dt = class {
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
      const u = this.#t?.(...i);
      return this.#t = null, u;
    };
    if (t == "reject" && this.#e) return (...i) => {
      const u = this.#e?.(...i);
      return this.#e = null, u;
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
      let u;
      try {
        u = Reflect.get(i, t, r);
      } catch {
        u = e?.[t];
      }
      return typeof u == "function" ? u?.bind?.(i) : u;
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
  return e instanceof Promise || typeof e?.then == "function" ? _?.has?.(e) ? _?.get?.(e) : (Ge?.has?.(e) || e?.then?.((n) => _?.set?.(e, n)), Ge?.getOrInsertComputed?.(e, () => new Proxy(lt(e), new dt(t, r)))) : e;
}
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var h = /* @__PURE__ */ Symbol.for("@value"), g = /* @__PURE__ */ Symbol.for("@extract"), $ = /* @__PURE__ */ Symbol.for("@origin"), le = /* @__PURE__ */ Symbol.for("@registry"), G = /* @__PURE__ */ Symbol.for("@behavior"), fe = /* @__PURE__ */ Symbol.for("@promise"), me = /* @__PURE__ */ Symbol.for("@trigger-less"), d = /* @__PURE__ */ Symbol.for("@trigger-lock"), ht = /* @__PURE__ */ Symbol.for("@trigger-control"), D = /* @__PURE__ */ Symbol.for("@trigger"), se = /* @__PURE__ */ Symbol.for("@subscribe"), vt = /* @__PURE__ */ Symbol.for("@isNotEqual"), he = /* @__PURE__ */ Symbol.for("@realProp"), qe = /* @__PURE__ */ new WeakMap(), de = (e) => {
  const t = typeof e == "object" || typeof e == "function" ? e?.[g] ?? e : e, r = (n) => de(n);
  return Array.isArray(t) ? t?.map?.(r) || Array.from(t || [])?.map?.(r) || [] : t instanceof Map || t instanceof WeakMap ? new Map(Array.from(t?.entries?.() || [])?.map?.(([n, i]) => [n, de(i)])) : t instanceof Set || t instanceof WeakSet ? new Set(Array.from(t?.values?.() || [])?.map?.(r)) : t != null && typeof t == "function" || typeof t == "object" ? Object.fromEntries(Array.from(Object.entries(t || {}) || [])?.filter?.(([n]) => n != g && n != $ && n != le)?.map?.(([n, i]) => [n, de(i)])) : t;
}, bt = (e) => e?.[g] ?? e?.["@target"] ?? e, V = (e, t = !1) => {
  const r = e;
  if (m(e) || typeof e == "symbol") return e;
  if (e != null && (e instanceof WeakRef || "deref" in e && typeof e?.deref == "function") && (e = e?.deref?.()), e != null && (typeof e == "object" || typeof e == "function")) {
    e = bt(e);
    const n = t && M(e) && e?.value;
    if (n != null && (typeof n == "object" || typeof n == "function") && (e = n), r != e) return V(e, t);
  }
  return e;
}, We = (e) => e != null && typeof e.then == "function", St = (e, t) => m(e) || typeof e == "function" ? t?.(e) : We(e) ? e.then(t) : e?.promise && We(e.promise) ? e.promise.then(t) : t?.(e), Ue = /* @__PURE__ */ new WeakMap(), pt = new FinalizationRegistry((e) => {
  e?.forEach?.((t) => t?.());
});
function I(e, t, r) {
  if (!(!r || typeof r != "function" || typeof e != "object" && typeof e != "function"))
    if (t == Symbol.dispose) {
      const n = e?.[g] ?? e;
      Ue?.getOrInsertComputed?.(n, () => {
        const i = /* @__PURE__ */ new Set();
        return (typeof n == "object" || typeof n == "function") && (pt.register(n, i), Ue.set(n, i), n[Symbol.dispose] ??= () => i.forEach((u) => {
          u?.();
        })), i;
      })?.add?.(r);
    } else e[t] = function(...n) {
      const i = e?.[t];
      typeof i == "function" && i.apply(this, n), r.apply(this, n);
    };
}
var j = (e) => {
  if (typeof e != "string" || e === "") return !1;
  const t = Number(e);
  return Number.isInteger(t) && t >= 0 && String(t) === e;
};
function or(e = [], t = {}) {
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
  const i = () => Array.from(r), u = (l) => {
    r.clear();
    for (const f of l) r.add(f);
  }, s = {
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
      return u(y), y.length;
    },
    splice: (l, f, ...o) => {
      const y = i(), a = Math.min(Math.max(l, 0), y.length), v = f === void 0 ? y.length - a : Math.max(0, Math.min(f, y.length - a)), A = y.splice(a, v);
      let R = a;
      for (const O of o) {
        if (y.includes(O)) {
          n(O, "splice", R);
          continue;
        }
        y.splice(R++, 0, O);
      }
      return u(y), A;
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
  return new Proxy(s, {
    get: (l, f) => {
      if (f === "length") return r.size;
      if (j(f)) return i()[Number(f)];
      const o = s[f];
      return o;
    },
    set: (l, f, o) => {
      if (f === "length") {
        if (typeof o != "number" || !Number.isFinite(o) || o < 0) throw new RangeError("length must be a finite non-negative number");
        const y = Math.floor(o);
        if (y >= r.size) return !0;
        const a = i().slice(0, y);
        return u(a), !0;
      }
      if (j(f)) {
        const y = i(), a = Number(f);
        if (a > y.length) return !0;
        const v = o;
        if (a < y.length) {
          const A = y[a];
          if (Object.is(A, v)) return !0;
          if (y.some((R, O) => O !== a && Object.is(R, v)))
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
    deleteProperty: (l, f) => {
      if (f === "length") return !1;
      if (j(f)) {
        const o = i(), y = Number(f);
        return y >= o.length || (o.splice(y, 1), u(o)), !0;
      }
      return Reflect.deleteProperty(s, f);
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
      if (j(f)) {
        const o = i(), y = Number(f);
        return y >= o.length ? void 0 : {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          value: o[y]
        };
      }
      return Reflect.getOwnPropertyDescriptor(s, f);
    },
    has: (l, f) => {
      if (f === "length") return !0;
      if (j(f)) {
        const o = Number(f);
        return o >= 0 && o < r.size;
      }
      return f in s;
    }
  });
}
var mt = class {
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
    return ne(e, r, t), !0;
  }
  get(e, t, r) {
    return typeof t == "symbol" ? e?.[t] ?? e : Reflect.get(e, t, r);
  }
}, cr = (e) => {
  if (e?.[$] || qe.has(e)) return e;
  const t = new Proxy(e, new mt());
  return qe.set(t, e), t;
}, gt = /* @__PURE__ */ new WeakMap(), At = (e, t, r) => gt.getOrInsert(e, () => {
  const n = t?.deref?.();
  n?.affected?.(r);
  const i = e?.complete?.bind?.(e), u = () => {
    const s = i?.();
    return n?.unaffected?.(r), s;
  };
  return e.complete = u, {
    unaffected: u,
    [Symbol.dispose]: u,
    [Symbol.asyncDispose]: u
  };
}), p = /* @__PURE__ */ new WeakMap(), ve = /* @__PURE__ */ new Map(), Je = (e, t = ["*"]) => {
  if (e == null || typeof e != "function") return;
  const r = rt(t);
  return ve.set(e, r.affectTypes), () => ve.delete(e);
}, Ot = /* @__PURE__ */ new WeakMap(), xt = (e, t) => {
  const r = e?.[g] ?? e;
  let n = p.get(r);
  return n ? n.bindSource(r) : (n = new wt(r), p.set(r, n)), t;
}, oe = (e, t) => (e = V(e?.[g] ?? e), typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || e == null ? e : Ot.getOrInsertComputed(e, () => new Proxy(e, xt(e, t)))), ee = /* @__PURE__ */ Symbol.for("@allProps"), je = /* @__PURE__ */ new Set(["*", "all"]), ze = /* @__PURE__ */ new Map([
  ["set", ["setter", "@set"]],
  ["add", ["@add"]],
  ["delete", ["@delete"]],
  ["invalidate", ["@invalidate"]],
  ["manual", ["@manual"]],
  ["custom", ["@custom"]],
  ["setAll", ["@setAll"]],
  ["addAll", ["@addAll"]],
  ["deleteAll", ["@deleteAll", "@clear"]]
]), Rt = new Map(Array.from(ze.entries()).flatMap(([e, t]) => t.map((r) => [r, e]))), ue = (e = "set") => {
  if (e == null) return e;
  const t = String(e || "set");
  return Rt.get(t) ?? t;
}, et = (e) => {
  const t = e == null ? "all" : String(ue(e) ?? "all");
  return [t, ...ze.get(t) ?? []];
}, Qe = (e = ["*"]) => new Set([...X(e)].flatMap((t) => [t, ...ze.get(t) ?? []])), X = (e = ["*"]) => {
  const t = typeof e == "string" ? [e] : Array.from(e ?? ["*"]), r = new Set(t.map((n) => {
    const i = String(n || "*");
    return je.has(i) ? i : String(ue(i) ?? i);
  }));
  return r.size ? r : /* @__PURE__ */ new Set(["*"]);
}, J = (e, t) => {
  const r = e instanceof Set ? e : X(e);
  return [...je].some((n) => r.has(n)) || et(t).some((n) => r.has(n));
}, tt = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), ge = (e = ["*"]) => {
  if (tt(e)) return {
    affectTypes: X(e.affectTypes ?? e.triggers ?? ["*"]),
    triggerImmediately: e.triggerImmediately !== !1
  };
  const t = X(e);
  return {
    affectTypes: t,
    triggerImmediately: J(t, "initial")
  };
}, rt = (e = ["*"]) => tt(e) ? {
  affectTypes: X(e.affectTypes ?? e.triggers ?? ["*"]),
  triggerImmediately: e.triggerImmediately === !0
} : {
  affectTypes: X(e),
  triggerImmediately: !1
}, wt = class {
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
  constructor(e) {
    this.#t = e, this.#e = /* @__PURE__ */ new Map(), this.#r = /* @__PURE__ */ new WeakSet(), this.#c = {
      enable: (n = ["*"], i) => i ? this.withTriggers(n, !0, i) : this.setTriggersEnabled(n, !0),
      disable: (n = ["*"], i) => i ? this.withTriggers(n, !1, i) : this.setTriggersEnabled(n, !1),
      set: (n, i) => this.setTriggersEnabled(n, i),
      with: (n, i) => this.withTriggers(n, !0, i),
      without: (n, i) => this.withTriggers(n, !1, i),
      isEnabled: (n) => this.isTriggerEnabled(n)
    }, this.#o = { next: (n) => {
      n && (Array.isArray(n) ? this.#u(...n) : this.#u(n));
    } };
    const t = new WeakRef(this), r = function(n) {
      const i = n?.next?.bind?.(n);
      return At(n, t, i);
    };
    this.#f = typeof Observable < "u" ? new Observable(r) : null, this.compatible = () => this.#f;
  }
  bindSource(e) {
    return this.#t ??= e, this;
  }
  $safeExec(e, ...t) {
    if (!(!e || this.#r.has(e))) {
      this.#r.add(e);
      try {
        const r = e(...t);
        if (r && typeof r.then == "function") {
          r.catch(console.warn);
          return;
        }
        return r;
      } catch (r) {
        console.warn(r);
      } finally {
        this.#r.delete(e);
      }
    }
  }
  #u(e, t = null, r, n = "all", ...i) {
    n = ue(n) ?? n;
    const u = this.#e;
    if (u?.size)
      for (const [s, l] of u.entries()) (l.prop === e || l.prop === ee || l.prop === null) && J(l.triggers, n) && this.$safeExec(s, t, e, r, n, ...i);
    if (ve.size) {
      const s = {
        source: this.#t,
        target: this.#t,
        value: t,
        prop: e,
        name: e,
        oldValue: r,
        trigger: n,
        args: i
      };
      for (const [l, f] of ve.entries()) J(f, n) && this.$safeExec(l, s);
    }
  }
  wrap(e) {
    return Array.isArray(e) ? oe(e, this) : e;
  }
  get triggerControl() {
    return this.#c;
  }
  isTriggerEnabled(e) {
    return !J(this.#n, "all") && !et(e).some((t) => this.#n.has(t));
  }
  setTriggersEnabled(e = ["*"], t = !0) {
    const r = Qe(e);
    for (const n of r) t ? this.#n.delete(n) : this.#n.add(n);
  }
  withTriggers(e, t, r) {
    const n = [...Qe(e)], i = new Map(n.map((s) => [s, this.#n.has(s)])), u = () => {
      i.forEach((s, l) => {
        s ? this.#n.add(l) : this.#n.delete(l);
      });
    };
    this.setTriggersEnabled(n, t);
    try {
      const s = r?.();
      return s && typeof s.finally == "function" ? s.finally(u) : (u(), s);
    } catch (s) {
      throw u(), s;
    }
  }
  affected(e, t, r = ["*"]) {
    if (e == null || typeof e != "function") return;
    const n = ge(r);
    return this.#e.set(e, {
      prop: t || ee,
      triggers: n.affectTypes
    }), () => this.unaffected(e, t || ee);
  }
  unaffected(e, t) {
    if (e != null && typeof e == "function") {
      const r = this.#e, n = r?.get(e);
      if (n && (n.prop == t || t == null || t == ee))
        return r.delete(e), () => this.affected(e, t || ee, n.triggers);
    }
    return this.#e.clear();
  }
  trigger(e, t, r, n = "set", ...i) {
    if (typeof e == "symbol" || (n === void 0 && (n = "set"), n = ue(n) ?? n, !this.isTriggerEnabled(n))) return;
    const u = `${n ?? "all"}`;
    let s = this.#i.get(e);
    s || (s = /* @__PURE__ */ new Map(), this.#i.set(e, s)), s.set(u, [
      e,
      t,
      r,
      n,
      i
    ]), !this.#s && (this.#s = !0, queueMicrotask(() => {
      this.#s = !1;
      const l = this.#i;
      this.#i = /* @__PURE__ */ new Map();
      for (const [f, o] of l)
        if (!(f != null && this.#l.has(f))) {
          f != null && this.#l.add(f);
          try {
            for (const [, y] of o) {
              const [a, v, A, R, O] = y;
              try {
                this.#u(a, v, A, R, ...O ?? []);
              } catch (k) {
                console.warn(k);
              }
            }
          } finally {
            f != null && this.#l.delete(f);
          }
        }
    }));
  }
  get iterator() {
    return this.#o;
  }
}, Pt = /* @__PURE__ */ new Set([
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
]), te = (e, t) => {
  if (!Pt.has(t)) return null;
  const r = c(e, t);
  return typeof r == "function" ? K(e, r) : r;
}, w = /* @__PURE__ */ new WeakMap();
function Tt(e, t) {
  let r = !0;
  try {
    w?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), w?.get?.(e)?.has?.(t) && (r = !0), r = typeof Reflect.getOwnPropertyDescriptor(e, t)?.get == "function";
  } catch {
    r = !0;
  } finally {
    w?.get?.(e)?.delete?.(t);
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
}, It = (e, t, r) => {
  if (e == null) return !1;
  let n = __safeSetGuard.getOrInsert(e, /* @__PURE__ */ new Set());
  return n?.has?.(t) ? !1 : (n?.add?.(t), Reflect.set(e, t, r));
}, c = (e, t, r) => {
  let n;
  if (e == null) return e;
  let i = w.getOrInsert(e, /* @__PURE__ */ new Set());
  if (i?.has?.(t)) return null;
  if (!Tt(e, t)) n ??= Reflect.get(e, t, r ?? e);
  else {
    i?.add?.(t);
    try {
      n = Reflect.get(e, t, r ?? e);
    } catch {
      n = void 0;
    } finally {
      i.delete(t), i?.size === 0 && w?.delete?.(e);
    }
  }
  return typeof n == "function" ? K(e, n) : n;
}, W = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Pe = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && (W(e, "key") || W(e, "name") || W(e, "oldValue") || W(e, "old") || W(e, "op") || W(e, "trigger") || t && W(e, "value")), N = (e, t, r) => W(e, t) ? e[t] : t == "oldValue" && W(e, "old") ? e.old : r(), Ae = (e, t = "manual") => ue(e.trigger ?? e.op ?? t), Mt = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", be = (e) => {
  const t = c(e, he) ?? c(e, "realProp");
  return Mt(t) ? t : null;
}, Xe = (e, t) => t == "value" ? be(e) ?? t : t, kt = (e, t) => {
  const r = be(e);
  return r != null && t == r ? c(e, "value") ?? c(e, h) ?? c(e, t) : t == null ? void 0 : c(e, t);
}, Oe = (e, t) => {
  const r = (i, u, s) => (Pe(u) || (s ??= u), t(Pe(i) ? i : Pe(u, !0) ? {
    key: i,
    trigger: s,
    ...u
  } : {
    key: i,
    trigger: s ?? u
  })), n = e?.triggerControl;
  return n && Object.assign(r, n), r.custom = (i, u, s, l) => r({
    key: u,
    trigger: i,
    value: s,
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
    le
  ].indexOf(t) < 0 ? c(e, t)?.bind?.(e) : null) != null) return null;
  if ([g, $].indexOf(t) >= 0) return c(e, t) ?? e;
  if (t == h) return c(e, t) ?? c(e, "value");
  if (t == le) return r;
  if (t == ht) return r?.triggerControl;
  if (t == Symbol.observable) return r?.compatible;
  if (t == Symbol.subscribe) return (n, i, u) => b(i != null ? [e, i] : e, n, u);
  if (t == Symbol.iterator || t == Symbol.asyncIterator) return c(e, t);
  if (t == Symbol.dispose) return (n) => {
    c(e, Symbol.dispose)?.(n), Me(n != null ? [e, n] : e);
  };
  if (t == Symbol.asyncDispose) return (n) => {
    c(e, Symbol.asyncDispose)?.(n), Me(n != null ? [e, n] : e);
  };
  if (t == Symbol.unsubscribe) return (n) => Me(n != null ? [e, n] : e);
  if (typeof t == "symbol" && (t in e || c(e, t) != null)) return c(e, t);
}, Re = (e, t, r) => {
  if (t == "subscribe") return r?.compatible?.[t] ?? ((n) => {
    if (typeof n == "function") return b(e, n);
    if ("next" in n && n?.next != null) {
      const i = b(e, n?.next), u = n?.complete;
      return n.complete = (...s) => (i?.(), u?.(...s)), n.complete;
    }
  });
}, Et = class {
  #t;
  #e;
  #r;
  constructor(e, t, r) {
    this.#t = e, this.#e = t, this.#r = r;
  }
  get(e, t, r) {
    const n = te(e, t);
    return n ?? Reflect.get(e, t, r);
  }
  apply(e, t, r) {
    let n = [], i = [], u = [], s = [...this.#e], l = -1;
    const f = Reflect.apply(e, t || this.#e, r);
    if (this.#r?.[d])
      return Array.isArray(f) ? $e(f) : f;
    switch (this.#t) {
      case "push":
        l = s?.length, n = r;
        break;
      case "unshift":
        l = 0, n = r;
        break;
      case "pop":
        l = s?.length - 1, s.length > 0 && (i = [s[l]]);
        break;
      case "shift":
        l = 0, s.length > 0 && (i = [s[l]]);
        break;
      case "splice":
        l = r[0];
        for (let y = 0; y < Math.max(s.length, this.#e.length); y++) {
          const a = s[y], v = this.#e[y];
          v === void 0 && y >= this.#e.length ? i.push(a) : a === void 0 && y >= s.length ? u.push([
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
        l = 0;
        for (let y = 0; y < s.length; y++) x(s[y], this.#e[y]) && u.push([
          l + y,
          this.#e[y],
          s[y],
          !0
        ]);
        break;
      case "set":
        l = r[1], u.push([
          l,
          r[0],
          s?.[l],
          l in s
        ]);
        break;
    }
    const o = p.get(this.#e);
    return n?.length == 1 ? o?.trigger?.(l, n[0], null, "add") : n?.length > 1 && (o?.trigger?.(l, n, null, "addAll"), n.forEach((y, a) => o?.trigger?.(l + a, y, null, "add"))), u?.length == 1 ? o?.trigger?.(u[0]?.[0] ?? l, u[0]?.[1], u[0]?.[2], u[0]?.[3] === !1 ? "add" : "set") : u?.length > 1 && (o?.trigger?.(l, u, s, "setAll"), u.forEach((y, a) => o?.trigger?.(y?.[0] ?? l + a, y?.[1], y?.[2], y?.[3] === !1 ? "add" : "set"))), i?.length == 1 ? o?.trigger?.(l, null, i[0], "delete") : i?.length > 1 && (o?.trigger?.(l, null, i, "deleteAll"), i.forEach((y, a) => o?.trigger?.(l + a, null, y, "delete"))), f == e ? new Proxy(f, this.#r) : Array.isArray(f) ? $e(f) : f;
  }
}, Wt = (e, t, r, n) => {
  const i = Number.isInteger(r) && Number.isInteger(n) && n < r ? t.slice(n, r) : [];
  if (!e[d] && r !== n) {
    const u = p.get(t);
    i.length === 1 ? u?.trigger?.(n, null, i[0], "delete") : i.length > 1 && (u?.trigger?.(n, null, i, "deleteAll"), i.forEach((l, f) => u?.trigger?.(n + f, null, l, "delete")));
    const s = Number.isInteger(r) && Number.isInteger(n) && n > r ? n - r : 0;
    if (s === 1) u?.trigger?.(r, void 0, null, "add");
    else if (s > 1) {
      const l = Array(s).fill(void 0);
      u?.trigger?.(r, l, null, "addAll"), l.forEach((f, o) => u?.trigger?.(r + o, void 0, null, "add"));
    }
  }
}, $t = class {
  [d];
  constructor() {
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  get(e, t, r) {
    const n = te(e, t);
    if (n != null) return n;
    if ([
      g,
      $,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && c(e, t) != null && c(e, t) != e) return typeof c(e, t) == "function" ? c(e, t)?.bind?.(e) : c(e, t);
    const i = p?.get?.(e), u = xe(e, t, i);
    if (u != null) return u;
    const s = Re(e, t, i);
    if (s != null) return s;
    if (t == me) return pe.call(this, this);
    if (t == D) return Oe(i, (f) => {
      const o = f.key ?? f.name ?? 0, y = N(f, "value", () => c(e, o)), a = N(f, "oldValue", () => {
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
    const l = c(e, t) ?? (t == "value" ? c(e, h) : null);
    return typeof l == "function" ? new Proxy(typeof l == "function" ? l?.bind?.(e) : l, new Et(t, e, this)) : l;
  }
  set(e, t, r) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == d && r)
      return this[d] = !!r, !0;
    if (t == d && !r)
      return delete this[d], !0;
    const n = c(e, t), i = [
      "x",
      "y",
      "z",
      "w"
    ], u = [
      "r",
      "g",
      "b",
      "a"
    ], s = i.indexOf(t), l = u.indexOf(t);
    let f = !1;
    return s >= 0 ? f = Reflect.set(e, s, r) : l >= 0 ? f = Reflect.set(e, l, r) : f = Reflect.set(e, t, r), t == "length" && x(n, r) && Wt(this, e, n, r), !this[d] && typeof t != "symbol" && x(n, r) && p?.get?.(e)?.trigger?.(t, r, n, "set"), f;
  }
  deleteProperty(e, t) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == d)
      return delete this[d], !0;
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
    return !this[d] && t != "length" && t != d && typeof t != "symbol" && r != null && p.get(e)?.trigger?.(t, t, r, "delete"), n;
  }
}, _t = class {
  [d];
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
    c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const u = Re(e, t, n);
    return u ?? (t == me ? pe.call(this, this) : t == D ? Oe(n, (s) => {
      const l = Xe(e, s.key ?? s.name ?? be(e) ?? "value"), f = N(s, "oldValue", () => l == "value" || l == be(e) ? c(e, h) : void 0), o = N(s, "value", () => kt(e, l));
      return n?.trigger?.(l, o, f, Ae(s, "manual"));
    }) : t == Symbol.toPrimitive ? (s) => {
      const l = H(e, t);
      return c(l, t) ? c(l, t)?.(s) : m(l) ? E(l, s) : m(c(l, "value")) ? E(c(l, "value"), s) : E(c(l, "value") ?? l, s);
    } : t == Symbol.toStringTag ? () => {
      const s = H(e, t);
      return c(s, t) ? c(s, t)?.() : m(s) ? String(s ?? "") || "" : m(c(s, "value")) ? String(c(s, "value") ?? "") || "" : String(c(s, "value") ?? s ?? "") || "";
    } : t == "toString" ? () => {
      const s = H(e, t);
      return c(s, t) ? c(s, t)?.() : c(s, Symbol.toStringTag) ? c(s, Symbol.toStringTag)?.() : m(s) ? String(s ?? "") || "" : m(c(s, "value")) ? String(c(s, "value") ?? "") || "" : String(c(s, "value") ?? s ?? "") || "";
    } : t == "valueOf" ? () => {
      const s = H(e, t);
      return c(s, t) ? c(s, t)?.() : c(s, Symbol.toPrimitive) ? c(s, Symbol.toPrimitive)?.() : m(s) ? s : m(c(s, "value")) ? c(s, "value") : c(s, "value") ?? s;
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
      w?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), w?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      w?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  has(e, t) {
    return t in e;
  }
  set(e, t, r) {
    const n = te(e, t);
    return n ?? st(r, (i) => {
      const u = te(i, t);
      if (u != null) return u;
      if (t == d && r)
        return this[d] = !!r, !0;
      if (t == d && !r)
        return delete this[d], !0;
      const s = e;
      if (c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), typeof t == "symbol" && !(c(e, t) != null && t in e)) return;
      const l = Xe(e, t), f = t == "value" ? c(e, h) ?? c(e, t) : c(e, t);
      e[t] = i;
      const o = c(e, t) ?? i;
      return !this[d] && typeof t != "symbol" && (c(e, vt) ?? x)?.(f, o) && (p.get(e) ?? p.get(s))?.trigger?.(l, i, f), !0;
    });
  }
  defineProperty(e, t, r) {
    const n = te(e, t);
    if (n != null) return n;
    if (t == d && r.value)
      return this[d] = !!r.value, !0;
    if (t == d && !r.value)
      return delete this[d], !0;
    if (c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e), r.get == null && r.set == null) return Reflect.defineProperty(e, t, r);
    const i = c(e, t), u = Reflect.defineProperty(e, t, {
      get: r.get,
      set: r.set,
      enumerable: r.enumerable ?? !0,
      configurable: r.configurable ?? !0
    });
    return It(e, t, i), u;
  }
  deleteProperty(e, t) {
    if (t == d)
      return delete this[d], !0;
    c(e, t) == null && t != "value" && M(e) && c(e, "value") != null && (typeof c(e, "value") == "object" || typeof c(e, "value") == "function") && c(c(e, "value"), t) != null && (e = c(e, "value") ?? e);
    const r = c(e, t), n = Reflect.deleteProperty(e, t);
    return !this[d] && t != d && typeof t != "symbol" && p.get(e)?.trigger?.(t, null, r, "delete"), n;
  }
}, Vt = class {
  [d];
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
    const u = Re(e, t, n);
    if (u != null) return u;
    e = c(e, g) ?? c(e, $) ?? e;
    const s = K(e, c(e, t));
    return typeof t == "symbol" && (t in e || c(e, t) != null) ? s : t == me ? pe.call(this, this) : t == D ? Oe(n, (l) => {
      const f = l.key ?? l.name;
      if (f == null) return;
      const o = N(l, "value", () => e.get(f));
      if (o == null && !W(l, "value")) return;
      const y = N(l, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, Ae(l, "manual"));
    }) : t == "clear" ? () => {
      const l = Array.from(e?.entries?.() || []), f = s();
      return l.forEach(([o, y]) => {
        this[d] || p.get(e)?.trigger?.(o, null, y, "delete");
      }), f;
    } : t == "delete" ? (l, f = null) => {
      const o = e.has(l), y = e.get(l), a = s(l);
      return !this[d] && o && p.get(e)?.trigger?.(l, null, y, "delete"), a;
    } : t == "set" ? (l, f) => ut(f, (o) => {
      const y = e.has(l), a = e.get(l), v = s(l, o);
      return (!y || x(a, o)) && (this[d] || p.get(e)?.trigger?.(l, o, y ? a : null, y ? "set" : "add")), v;
    }) : s;
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
      w?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), w?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      w?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  deleteProperty(e, t) {
    return t == d ? (delete this[d], !0) : Reflect.deleteProperty(e, t);
  }
}, zt = class {
  [d] = !1;
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
    const u = Re(e, t, n);
    if (u != null) return u;
    e = c(e, g) ?? c(e, $) ?? e;
    const s = K(e, c(e, t));
    return typeof t == "symbol" && (t in e || c(e, t) != null) ? s : t == me ? pe.call(this, this) : t == D ? Oe(n, (l) => {
      const f = l.key ?? l.name;
      if (f == null) return;
      const o = N(l, "value", () => e.has(f)), y = N(l, "oldValue", () => {
      });
      return n?.trigger?.(f, o, y, Ae(l, "manual"));
    }) : t == "clear" ? () => {
      const l = Array.from(e?.values?.() || []), f = s();
      return l.forEach((o) => {
        this[d] || p.get(e)?.trigger?.(null, null, o, "delete");
      }), f;
    } : t == "delete" ? (l) => {
      const f = e.has(l), o = f ? l : null, y = s(l);
      return !this[d] && f && p.get(e)?.trigger?.(l, null, o, "delete"), y;
    } : t == "add" ? (l) => {
      const f = e.has(l), o = f ? l : null, y = s(l);
      return f || this[d] || p.get(e)?.trigger?.(l, l, o, "add"), y;
    } : s;
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
      w?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), w?.get?.(e)?.has?.(t) && (r = void 0), r = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      r = void 0;
    } finally {
      w?.get?.(e)?.delete?.(t);
    }
    return r;
  }
  deleteProperty(e, t) {
    return t == d ? (delete this[d], !0) : Reflect.deleteProperty(e, t);
  }
}, Y = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[g] || e?.[se])), $e = (e) => Y(e) ? e : oe(e, new $t()), Ct = (e) => Y(e) ? e : oe(e, new _t()), Nt = (e) => Y(e) ? e : oe(e, new Vt()), Dt = (e) => Y(e) ? e : oe(e, new zt()), Bt = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = P({
    [fe]: r ? e : null,
    [h]: r ? 0 : Number(V(e) || 0) || 0,
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](i) {
      return E((typeof this?.[h] != "object" ? this?.[h] : this?.[h]?.value || 0) ?? 0, i);
    },
    set value(i) {
      this[h] = (i != null && !Number.isNaN(i) ? Number(i) : this[h]) || 0;
    },
    get value() {
      return Number(this[h] || 0) || 0;
    }
  });
  return e?.then?.((i) => n.value = i), n;
}, Ft = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = P({
    [fe]: r ? e : null,
    [h]: (r ? "" : String(V(typeof e == "number" ? String(e) : e || ""))) ?? "",
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[h] ?? "") ?? "";
    },
    [Symbol?.toPrimitive](i) {
      return E(this?.[h] ?? "", i);
    },
    set value(i) {
      this[h] = String(typeof i == "number" ? String(i) : i || "") ?? "";
    },
    get value() {
      return String(this[h] ?? "") ?? "";
    }
  });
  return e?.then?.((i) => n.value = i), n;
}, Ht = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = P({
    [fe]: r ? e : null,
    [h]: (r ? !1 : (V(e) != null ? typeof V(e) == "string" ? !0 : !!V(e) : !1) || !1) || !1,
    [G]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](i) {
      return E(!!this?.[h] || !1, i);
    },
    set value(i) {
      this[h] = (i != null ? typeof i == "string" ? !0 : !!i : this[h]) || !1;
    },
    get value() {
      return this[h] || !1;
    }
  });
  return e?.then?.((i) => n.value = i), n;
}, Ye = (e, t) => {
  const r = e instanceof Promise || typeof e?.then == "function", n = P({
    [fe]: r ? e : null,
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
    Object.defineProperty(e, he, {
      value: t,
      writable: !0,
      configurable: !0
    });
  } catch {
    try {
      e[he] = t;
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
}, Kt = (e, t = "value", r, n) => {
  if (m(e) || !e) return e;
  Array.isArray(e) && e.length == 2 && e[0] != null && (e[0] instanceof Map || e[0] instanceof WeakMap || e[0] instanceof Set || e[0] instanceof WeakSet) ? ((t == null || t === "value") && (t = e[1]), e = e[0]) : Array.isArray(e) && !ie(e?.[1], e) && (Array.isArray(e?.[0]) || typeof e?.[0] == "object" || typeof e?.[0] == "function") && (e = e?.[0]);
  const i = e instanceof Map || e instanceof WeakMap, u = e instanceof Set || e instanceof WeakSet;
  if (i || u) {
    if (t == null) return;
  } else if ((t ??= Array.isArray(e) ? null : "value") == null || ie(t, e)) return;
  const s = () => i ? e.get(t) : u ? e.has(t) : e?.[t], l = (a) => i ? (e.set(t, a), a) : u ? (a ? e.add(t) : e.delete(t), e.has(t)) : e[t] = a;
  i && r !== void 0 && !e.has(t) ? e.set(t, r) : u && r && !e.has(t) && e.add(t);
  const f = s();
  if (!u && t != null && M(f) && z(f)) return Te(Ut(f), t);
  if (!i && !u && t && typeof e?.getProperty == "function" && z(e?.getProperty?.(t))) return Te(e?.getProperty?.(t), t);
  !i && !u && (e[t] ??= r ?? e[t]);
  const o = P({
    [h]: u ? !!s() : s() ?? r,
    [G]: n,
    [Symbol?.toStringTag]() {
      return String(s() ?? this[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return E(s(), a);
    },
    set value(a) {
      if (o[Q] = !0, u) this[h] = l(a);
      else {
        const v = a ?? ft(s());
        this[h] = l(v);
      }
      o[Q] = !1;
    },
    get value() {
      const a = s();
      return this[h] = u ? !!a : a ?? this[h];
    }
  });
  Te(o, t);
  const y = b(e, (a, v, A, R) => {
    if (v === t) {
      const O = u ? a != null : a, k = u ? A != null : A;
      o?.[D]?.({
        key: t,
        value: O,
        oldValue: k,
        trigger: R
      });
    }
  });
  return I(o, Symbol.dispose, y), o;
}, Gt = (e, t) => {
  switch (typeof e) {
    case "boolean":
      return Ht(e, t);
    case "number":
      return Bt(e, t);
    case "string":
      return Ft(e, t);
    case "object":
      if (e != null) return Ye(P(e), t);
    default:
      return Ye(e, t);
  }
}, qt = (e, t = "value", r) => {
  const n = z(e) ? e : Gt(e, r);
  return t != null ? Kt(n, t, r) : n;
}, yr = (e, t) => qt(e, t), Ce = (e, t, r = 100) => {
  if (e?.value ?? e) return setTimeout(() => {
    e.value && t?.();
  }, r);
}, ar = (e = 100) => (t, [r], [n]) => {
  let i = Ce(r, t, e);
  n?.addEventListener?.("abort", () => {
    i && clearTimeout(i);
  }, { once: !0 });
}, dr = (e = 100) => (t, [r], [n]) => {
  let i = Ce(r, t, e);
  n?.addEventListener?.("abort", () => {
    i && clearTimeout(i);
  }, { once: !0 }), i || t?.();
};
function P(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || Y(e) || (e = V?.(e)) == null || e instanceof Promise || e instanceof WeakRef || Y(e)) return e;
  const r = e;
  if (r == null || typeof r == "symbol" || !(typeof r == "object" || typeof r == "function") || r instanceof Promise || r instanceof WeakRef) return r;
  let n = r;
  return Array.isArray(r) ? (n = $e(r), n) : r instanceof Map ? (n = Nt(r), n) : r instanceof Set ? (n = Dt(r), n) : ((typeof r == "function" || typeof r == "object") && (n = Ct(r)), n);
}
var z = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[g] || e?.[se] || p?.has?.(e))), Ut = (e) => z(e) ? P(e) : null, hr = (e) => {
  if (e == null || typeof e != "object" && typeof e != "function" || e?.[Symbol.observable] != null) return e;
  try {
    e[Symbol.observable] = self?.compatible;
  } catch {
    console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks");
  }
  return e[se] = (t, r, n) => {
    const i = e?.[Symbol?.observable];
    return i?.()?.affected?.(t, r, n), () => i?.()?.unaffected?.(t, r);
  }, e;
}, q = /* @__PURE__ */ new WeakMap(), Ne = (e) => {
  if (!(typeof e == "symbol" || e == null || !(typeof e == "object" || typeof e == "function")))
    return e;
}, Se = "initial", De = (e) => {
  const t = e?.[he] ?? e?.realProp;
  return C(t) ? t : null;
}, Be = (e, t) => {
  const r = De(e);
  return r != null && (t == null || t == "value") ? r : t;
}, Jt = (e, t) => t != null && t == De(e) ? e?.value : e?.[t], _e = (e, t, r, n) => {
  if (t != null && t == De(e)) {
    const i = Jt(e, t);
    if (i != null) return r?.(i, t, null, "set");
  }
  return ae(e, t, r, n);
}, nt = (e, t, r) => {
  const n = ge(t);
  if (r == Se) {
    if (!n.triggerImmediately) return;
  } else if (!J(n.affectTypes, r)) return;
  return (i, u, s, ...l) => e?.(i, u, s, r, ...l);
}, Qt = (e, t, r, n = ["*"]) => {
  if (!e || !Ne(e)) return;
  const i = t != Symbol.iterator ? Be(e, t) : null;
  let u = e?.[le] ?? p.get(e);
  e = e?.[g] ?? e, queueMicrotask(() => {
    const l = nt(r, n, Se);
    l && (i != null && i != Symbol.iterator ? _e(e, i, l, null) : Ve(e, l, null));
  });
  let s = u?.affected?.(r, i, n);
  return e?.[Symbol.dispose] || (I(s, Symbol.dispose, s), I(s, Symbol.asyncDispose, s), I(e, Symbol.dispose, s), I(e, Symbol.asyncDispose, s)), s;
}, Xt = (e, t, r, n = ["*"]) => {
  const i = ge(n).affectTypes, u = {};
  let s = e?.value;
  const l = (f) => {
    const o = f?.target?.value;
    J(i, "set") && r?.(o, "value", s, "set", f), s = o;
  };
  return e?.addEventListener?.("change", l, u), () => e?.removeEventListener?.("change", l, u);
}, re = (e) => Array.isArray(e) && e?.length == 2 && Ne(e?.[0]) && (C(e?.[1]) || e?.[1] == Symbol.iterator), Yt = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), Zt = (e) => e == null ? [] : Array.isArray(e) && !re(e) && !z(e) ? e : [e], Lt = (e) => {
  if (re(e)) {
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
}, jt = (e, t, r, n, i, u, s) => ({
  source: e,
  target: t,
  value: r,
  prop: n,
  name: n,
  oldValue: i,
  trigger: u,
  args: s
}), er = (e, t, r, n = ["*"]) => {
  const i = C(e?.[1]) ? e?.[1] : null;
  return b(e?.[0], i, r, n);
}, tr = (e, t, r, n = ["*"]) => e?.then?.((i) => b?.(i, t, r, n))?.catch?.((i) => (console.warn(i), null)), b = (e, t, r = () => {
}, n) => {
  if (typeof t == "function" ? (n = r, r = t, t = null) : t = Be(e, t), (typeof r == "object" || Array.isArray(r)) && (n = r, r = () => {
  }), (m(e) || typeof e == "symbol") && ge(n).triggerImmediately)
    return Ee(globalThis?.Promise?.try?.(() => r?.(e, null, null, null, Se)));
  if (typeof e?.[se] == "function") return e?.[se]?.(r, t, n);
  if (Ne(e)) {
    const i = e;
    if (q?.has?.(e = e?.[g] ?? e)) return q?.get?.(e)?.(i, t, r, n);
    if (z(i) || re(e) && z(e?.[0])) return We(e) ? q?.getOrInsert?.(e, tr)?.(e, t, r, n) : re(e) ? q?.getOrInsert?.(e, er)?.(e, t, r, n) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? q?.getOrInsert?.(e, Xt)?.(e, t, r, n) : q?.getOrInsert?.(e, Qt)?.(i, t, r, n);
    {
      const u = nt(r, n, Se);
      return u ? Ee(globalThis?.Promise?.try?.(() => re(e) ? _e?.(e?.[0], e?.[1], u, null) : t != null && t != Symbol.iterator ? _e?.(e, t, u, null) : Ve?.(e, u, null))) : void 0;
    }
  }
};
function rr(e, t, r) {
  if (e == null || typeof e != "function") return;
  if (Yt(t) && r === void 0) return Je(e, t);
  if (t == null) return Je(e, r);
  const n = rt(r), i = {
    affectTypes: n.affectTypes,
    triggerImmediately: n.triggerImmediately
  }, u = Zt(t).map((s) => {
    const l = Lt(s);
    return b(l.target, l.prop, (f, o, y, a, ...v) => e(jt(l.source, l.target, f, o, y, a ?? null, v)), i);
  }).filter((s) => typeof s == "function");
  return () => u.forEach((s) => s?.());
}
function vr(e, t, r) {
  return rr(t, e, r);
}
var br = (e) => e instanceof Set ? it(e) : e instanceof Map ? ur(e) : e, nr = class {
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
    const u = t();
    return i.set(n, u), u;
  }
  getOrInsert(e, t) {
    const [r, n] = this.#r(e), i = this.#e(r);
    return i.has(n) ? i.get(n) : (i.set(n, t), t);
  }
  getOrInsertComputed(e, t) {
    const [r, n] = this.#r(e), i = this.#e(r);
    if (i.has(n)) return i.get(n);
    const u = t([r, n]);
    return i.set(n, u), u;
  }
}, Ie = new nr();
function ir(e, t, r = ["*"]) {
  if (!e) return;
  if (Ie.has([e, t])) return Ie.get([e, t]);
  const n = (i, u, s, l) => {
    if (u == "value") {
      const f = (s?.value ?? s)?.entries?.(), o = e?.value ?? i?.value ?? i;
      if (f) for (const [y, a] of f) {
        const v = a ?? (s?.value ?? s)?.[y] ?? null, A = o?.[y];
        v == null && A != null ? t(A, y, null, "add") : v != null && A == null ? t(null, y, v, "delete") : x(v, A) && t(A, y, v, "set");
      }
      return ir(i ?? e?.value, t, r);
    }
    return u == null ? void 0 : e[u];
  };
  return Ie.getOrInsertComputed([e, t], () => e instanceof Set ? b([it(e), Symbol.iterator], t, r) : e instanceof Map ? b(e, t, r) : M(e) ? b(e, n, r) : Array.isArray(e) && !(e?.length == 2 && C(e?.[1]) && z(e?.[0])) ? b([e, Symbol.iterator], t, r) : b(e, t, r));
}
function Me(e, t) {
  return St(e, (r) => {
    const n = Array.isArray(r) && r?.length == 2 && ["object", "function"].indexOf(typeof r?.[0]) >= 0 && C(r?.[1]), i = n ? r?.[1] : null;
    r = n && i != null ? r?.[0] ?? r : r;
    const u = typeof r == "object" || typeof r == "function" ? r?.[g] ?? r : r;
    (r?.[le] ?? p.get(u))?.unaffected?.(t, i);
  });
}
var lr = (e, t, r) => (b(t, null, (n, i) => {
  ne(e, n, i, !0);
}), r?.(() => e, (n) => {
  for (const i in n) ne(t, n[i], i, !0);
}, { deep: !0 }), e), Sr = (e, t, r) => lr(t(de(e)), e, r), pr = (e, t, r = () => "") => b(t, null, (n, i) => {
  i == r() && ne(e, n, null, !0);
}), mr = (e = []) => {
  const t = P({ value: 0 }), r = (l) => typeof l == "function" ? l() : M(l) ? l.value : l, i = fr([t, "value"], () => e.findIndex((l) => !!r(l)), "value"), u = () => {
    t.value++;
  }, s = [];
  z(e) && s.push(b(e, u, {
    affectTypes: [
      "add",
      "set",
      "delete"
    ],
    triggerImmediately: !1
  }));
  for (const l of e) M(l) && s.push(b([l, "value"], u, {
    affectTypes: ["setter"],
    triggerImmediately: !1
  }));
  return I(i, Symbol.dispose, () => s.forEach((l) => l?.())), i;
}, sr = (e, t, r, n) => {
  if (m(e)) return e ? t : r;
  const i = () => t, u = () => r, s = (o) => (o != null && (e.value = M(o) ? o?.value : o), (M(e) ? e?.value : e) ? i() : u()), l = P({
    [h]: s(),
    [G]: n,
    [Symbol?.toStringTag]() {
      return String(s() ?? this[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](o) {
      return E(s() ?? this[h], o);
    },
    set value(o) {
      this[h] = s(o);
    },
    get value() {
      return this[h] = s() ?? this[h];
    }
  }), f = b([e, "value"], () => {
    const o = l?.[h], y = s();
    l[h] = y, l?.[D]?.({
      key: "value",
      value: y,
      oldValue: o,
      trigger: "manual"
    });
  });
  return I(l, Symbol.dispose, f), l;
}, gr = sr, Ar = (e, t, r) => {
  r || (r = P({}));
  const n = b(e, (i, u, s) => {
    if (u == null) return;
    const l = t?.(i, u, s);
    typeof l == "object" ? yt(r, l) : x(r[u], l) && (r[u] = l);
  });
  return r && I(r, Symbol.dispose, n), r;
}, Or = (...e) => {
  const t = P({});
  return e?.forEach?.((r) => b(r, (n, i, u) => {
    i != null && x(t[i], n) && (t[i] = n);
  })), t;
}, it = (e) => {
  const t = P([]);
  return t.push(...Array.from(e?.values?.() || [])), I(t, Symbol.dispose, b(e, (r, n, i) => {
    if (x(r, i)) if (i == null && r != null) t.push(r);
    else if (i != null && r == null) {
      const u = t.indexOf(i);
      u >= 0 && t.splice(u, 1);
    } else {
      const u = t.indexOf(i);
      u >= 0 && x(t[u], r) && (t[u] = r);
    }
  })), t;
}, ur = (e) => {
  const t = P([]), r = Array.from(e.entries());
  return t.push(...r), I(t, Symbol.dispose, b(e, (n, i, u) => {
    if (x(n, u) || u == null && n != null || u != null && n == null) if (u != null && n == null) {
      let s = t.findIndex(([l, f]) => l == i);
      s < 0 && (s = t.findLastIndex(([l, f]) => u === f)), s >= 0 && t.splice(s, 1);
    } else {
      let s = t.findIndex(([l, f]) => l == i);
      s >= 0 && s < t.length ? x(t[s]?.[1], n) && (t[s] = [i, n]) : t.push([i, n]);
    }
  })), t;
}, F = /* @__PURE__ */ new WeakMap(), Ze = (e, t, r = "value") => {
  const n = typeof e?.[1] == "function" && e?.length == 2, i = typeof t?.[1] == "function" && t?.length == 2, u = i ? t?.[1] : null, s = (C(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let l = s && !n ? e?.[1] : Array.isArray(e) ? null : r;
  !s && !n && (e = [e, l]), n && (e[1] = l);
  const f = (C(t?.[1]) || t?.[1] == Symbol.iterator) && t?.length == 2;
  let o = f && !i ? t?.[1] : Array.isArray(t) ? null : r;
  if (!f && !i && (t = [t, o]), i && (t[1] = o), l == null || o == null || ie(l, e?.[0]) || ie(o, t?.[0])) return;
  if (!((typeof t?.[0] == "object" || typeof t?.[0] == "function") && t?.[0] != null) && !Array.isArray(e[0]))
    return ye(t, () => {
      e[0][l] = t?.[0];
    }), () => {
    };
  const y = (ce, Z) => {
    const B = A?.deref?.(), L = v?.deref?.();
    if (F?.get?.(B)?.get?.(l)?.bound == L) {
      let we = null;
      const Fe = F?.get?.(B)?.get?.(l)?.cmpfx;
      ye(L, () => {
        typeof Fe == "function" ? we = Fe?.(Ke(L) ?? ce, Z, null) : we = L?.[Z] ?? ce;
      });
      const He = Ke(we);
      x(B[l], He) && ye(L, () => {
        B[l] = He;
      });
    } else F?.get?.(B)?.get?.(l)?.dispose?.();
  }, a = () => {
    const ce = A?.deref?.(), Z = F?.get?.(ce), B = Z?.get?.(l);
    Z?.delete?.(l), B?.unsub?.();
  }, v = t?.[0] != null && (typeof t?.[0] == "object" || typeof t?.[0] == "function") && !(t?.[0] instanceof WeakRef || typeof t?.[0]?.deref == "function") ? new WeakRef(t?.[0]) : t?.[0], A = e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function") && !(e?.[0] instanceof WeakRef || typeof e?.[0]?.deref == "function") ? new WeakRef(e?.[0]) : e?.[0];
  let R = {
    compute: y,
    dispose: a,
    cmpfx: u
  };
  const O = A?.deref?.(), k = v?.deref?.();
  return A instanceof WeakRef && (F?.get?.(O)?.get?.(l)?.bound != k && F?.get?.(O)?.delete?.(l), R = F?.getOrInsert?.(O, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(l, () => ({
    bound: k,
    cmpfx: u,
    unsub: null,
    compute: y,
    dispose: a
  })), R.unsub = b(t, y), R.cmpfx = u, I(O, Symbol.dispose, R?.dispose), I(k, Symbol.dispose, R?.dispose)), k && !Array.isArray(k) && ye(O, () => {
    k[o] ??= O?.[l] ?? k[o];
  }), R?.dispose;
}, xr = (e, t, r = "value") => {
  const n = [Ze(e, t, r), Ze(t, e, r)];
  return () => n?.map?.((i) => i?.());
}, fr = (e, t, r, n = "value") => {
  const i = typeof e?.[1] == "function" && e?.length == 2, u = (C(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let s = u && !i ? e?.[1] : Array.isArray(e) ? null : n;
  if (!u && !i && (e = [u ? e?.[0] : e, s]), i && (e[1] = s), s == null || ie(s, e?.[0])) return;
  const l = (a) => {
    let v;
    return a != null && (v = e[0][s], e[0][s] = a), t?.(e?.[0]?.[s], s, v);
  }, f = l(), o = P({
    [fe]: void 0,
    [h]: f,
    [G]: r,
    [Symbol?.toStringTag]() {
      return String(l() ?? this[h] ?? "") || "";
    },
    [Symbol?.toPrimitive](a) {
      return E(l() ?? this[h], a);
    },
    set value(a) {
      this[h] = l(a);
    },
    get value() {
      return this[h] = l() ?? this[h];
    }
  }), y = b([e?.[0] ?? e, s ?? "value"], () => {
    const a = o?.[h], v = l();
    o[h] = v, o?.[D]?.({
      key: "value",
      value: v,
      oldValue: a,
      trigger: "manual"
    });
  });
  return I(o, Symbol.dispose, y), o;
}, Rr = (e, t, r = 100) => {
  let n;
  return b(e, "value", (i) => {
    !i && n ? (clearTimeout(n), n = null) : i && !n && (n = Ce(e, t, r) ?? n);
  });
};
export {
  se as $affected,
  Gt as $ref,
  D as $trigger,
  ht as $triggerControl,
  me as $triggerLess,
  d as $triggerLock,
  mt as AssignObjectHandler,
  nr as DoubleWeakMap,
  I as addToCallChain,
  b as affected,
  Ze as assign,
  F as assignMap,
  lr as bindBy,
  pr as bindByKey,
  Ht as booleanRef,
  fr as computed,
  gr as conditional,
  mr as conditionalIndex,
  sr as conditionalRef,
  ar as delayedBehavior,
  dr as delayedOrInstantBehavior,
  Rr as delayedSubscribe,
  V as deref,
  Sr as derivate,
  rr as effect,
  vr as effected,
  z as isObservable,
  ir as iterated,
  xr as link,
  br as makeArrayObservable,
  cr as makeObjectAssignable,
  Bt as numberRef,
  ur as observableByMap,
  it as observableBySet,
  P as observe,
  yr as promised,
  Kt as propRef,
  Ut as recoverReactive,
  qt as ref,
  Ar as remap,
  de as safe,
  q as specializedSubscribe,
  Ft as stringRef,
  Qt as subscribeDirectly,
  Xt as subscribeInput,
  er as subscribePaired,
  tr as subscribeThenable,
  Ce as triggerWithDelay,
  Me as unaffected,
  Or as unified,
  bt as unwrap,
  hr as useObservable,
  Ye as wrapRef,
  or as wrapSetAsArray
};
