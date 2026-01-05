import { tryParseByHint } from "fest/core";
import { $value, $behavior, $promise, $extractKey$, $affected } from "../wrap/Symbol";
import { deref, type observeValid, type WeakKey } from "../wrap/Utils";
import { $isObservable, observeArray, observeMap, observeObject, observeSet } from "./Specific";
import { subscriptRegistry } from "./Subscript";

//
export const numberRef = (initial?: any, behavior?: any) => {
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const obj = {
        [$promise]: isPromise ? initial : null,
        [$value]: isPromise ? 0 : (Number(deref(initial) || 0) || 0),
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this?.[$value] ?? "") || ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint((typeof this?.[$value] != "object" ? this?.[$value] : (this?.[$value]?.value || 0)) ?? 0, hint); },
        set value(v: any) { this[$value] = ((v != null && !Number.isNaN(v)) ? Number(v) : this[$value]) || 0; },
        get value() { return Number(this[$value] || 0) || 0; }
    };
    const $r = observe(obj); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const stringRef = (initial?: any, behavior?: any) => {
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const obj = {
        [$promise]: isPromise ? initial : null,
        [$value]: (isPromise ? "" : String(deref(typeof initial == "number" ? String(initial) : (initial || "")))) ?? "",
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this?.[$value] ?? "") ?? ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint(this?.[$value] ?? "", hint); },
        set value(v: any) { this[$value] = String(typeof v == "number" ? String(v) : (v || "")) ?? ""; },
        get value() { return String(this[$value] ?? "") ?? ""; },
    };
    const $r = observe(obj); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const booleanRef = (initial?: any, behavior?: any) => {
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const obj = {
        [$promise]: isPromise ? initial : null,
        [$value]: (isPromise ? false : ((deref(initial) != null ? (typeof deref(initial) == "string" ? true : !!deref(initial)) : false) || false)) || false,
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this?.[$value] ?? "") || ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint(!!this?.[$value] || false, hint); },
        set value(v: any) { this[$value] = (v != null ? (typeof v == "string" ? true : !!v) : this[$value]) || false; },
        get value() { return this[$value] || false; }
    };
    const $r = observe(obj); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const ref = (initial?: any, behavior?: any) => {
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const obj = {
        [$promise]: isPromise ? initial : null,
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this.value ?? "") || ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint(this.value, hint); },
        value: isPromise ? null : deref(initial)
    };
    const $r = observe(obj); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const autoRef = (typed: any, behavior?: any) => {
    switch (typeof typed) {
        case "boolean": return booleanRef(typed, behavior);
        case "number" : return numberRef(typed, behavior);
        case "string" : return stringRef(typed, behavior);
        case "object" : if (typed != null) { return observe(typed); }
        default: return ref(typed, behavior);
    }
}

//
export const promised = (promise: any, behavior?: any) => {
    return ref(promise, behavior);
}

//
export const triggerWithDelay = (ref: any, cb: Function, delay = 100): ReturnType<typeof setTimeout> | undefined => { if (ref?.value ?? ref) { return setTimeout(()=>{ if (ref.value) cb?.(); }, delay); } }

//
export const delayedBehavior  = (delay = 100) => {
    return (cb: Function, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); };
}

//
export const delayedOrInstantBehavior = (delay = 100) => {
    return (cb: Function, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); if (!tm) { cb?.(); }; };
}



//
export const observe = <T = any>(target: T, stateName?: string): observeValid<T> => {
    if (target == null || typeof target == "symbol" || !(typeof target == "object" || typeof target == "function") || $isObservable(target)) {
        return target as observeValid<T>;
    }

    //
    if ((target = deref?.(target)) == null || target instanceof Promise || target instanceof WeakRef || $isObservable(target)) {
        return target as observeValid<T>; // promise forbidden
    }

    //
    const unwrap: any = target;
    if (unwrap == null ||
        typeof unwrap == "symbol" || !(typeof unwrap == "object" || typeof unwrap == "function") ||
        unwrap instanceof Promise || unwrap instanceof WeakRef
    ) { return unwrap as observeValid<T>; };

    //
    let reactive = unwrap;
    if (Array.isArray(unwrap)) { reactive = observeArray(unwrap); return reactive; } else
    if (unwrap instanceof Map) { reactive = observeMap(unwrap); return reactive; } else
    if (unwrap instanceof Set) { reactive = observeSet(unwrap); return reactive; } else
    if (typeof unwrap == "function" || typeof unwrap == "object") { reactive = observeObject(unwrap); return reactive; }
    return reactive;
}

//
export const isObservable = (target: any) => {
    if (typeof HTMLInputElement != "undefined" && target instanceof HTMLInputElement) { return true; }
    return !!((typeof target == "object" || typeof target == "function") && target != null && (target?.[$extractKey$] || target?.[$affected] || subscriptRegistry?.has?.(target)));
}

//
export const recoverReactive = (target: any): any => {
    return isObservable(target) ? observe(target) : null;
}
