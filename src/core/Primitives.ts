import { defaultByType, isPrimitive, $triggerLock, tryParseByHint, isArrayInvalidKey, type keyType } from "fest/core";
import { $value, $behavior, $promise, $extractKey$, $affected, $trigger } from "../wrap/Symbol";
import { addToCallChain, deref, type observeValid, type WeakKey } from "../wrap/Utils";
import { $isObservable, observeArray, observeMap, observeObject, observeSet } from "./Specific";
import { subscriptRegistry } from "./Subscript";
import { MethodsOf } from "../wrap/Utils";
import { affected } from "./Mainline";
import { hasValue } from "fest/core";

//
export interface refWrap<T = any> {
    [$promise]?: Promise<T>|null|undefined;
    [$behavior]?: any;
    [Symbol.toStringTag]?(): string;
    [Symbol.toPrimitive]?(hint: any): any;
    [$value]?: T;
    set value(v: T|null|undefined);
    get value(): T|null|undefined;
}

//
export type refType<T = any> = (refWrap<T> | (T extends object ? T : any)) & MethodsOf<T> & (T extends symbol | object | Function ? T : any);

//
export const numberRef = (initial?: number|null|undefined|Promise<number>, behavior?: any): refType<number> => {
    const isPromise = initial instanceof Promise || typeof (initial as unknown as Promise<number>)?.then == "function";
    const obj: refWrap<number> = {
        [$promise]: isPromise ? (initial as unknown as Promise<number>) : null as unknown as Promise<number>,
        [$value]: isPromise ? 0 : (Number(deref(initial) || 0) || 0),
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this?.[$value] ?? "") || ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint((typeof this?.[$value] != "object" ? this?.[$value] : (this?.[$value]?.value || 0)) ?? 0, hint); },
        set value(v: any) { this[$value] = ((v != null && !Number.isNaN(v)) ? Number(v) : this[$value]) || 0; },
        get value() { return Number(this[$value] || 0) || 0; }
    };
    const $r = observe(obj) as observeValid<refType<number>>; (initial as unknown as Promise<number>)?.then?.((v)=>$r.value = v); return $r;
}

//
export const stringRef = (initial?: string|null|undefined|Promise<string>, behavior?: any): refType<string> => {
    const isPromise = initial instanceof Promise || typeof (initial as unknown as Promise<string>)?.then == "function";
    const obj: refWrap<string> = {
        [$promise]: isPromise ? (initial as unknown as Promise<string>) : null as unknown as Promise<string>,
        [$value]: (isPromise ? "" : String(deref(typeof initial == "number" ? String(initial) : (initial || "")))) ?? "",
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this?.[$value] ?? "") ?? ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint(this?.[$value] ?? "", hint); },
        set value(v: any) { this[$value] = String(typeof v == "number" ? String(v) : (v || "")) ?? ""; },
        get value() { return String(this[$value] ?? "") ?? ""; },
    };
    const $r = observe(obj) as observeValid<refType<string>>; (initial as unknown as Promise<string>)?.then?.((v)=>$r.value = v); return $r;
}

//
export const booleanRef = (initial?: boolean|null|undefined|Promise<boolean>, behavior?: any): refType<boolean> => {
    const isPromise = initial instanceof Promise || typeof (initial as unknown as Promise<boolean>)?.then == "function";
    const obj: refWrap<boolean> = {
        [$promise]: isPromise ? (initial as unknown as Promise<boolean>) : null as unknown as Promise<boolean>,
        [$value]: (isPromise ? false : ((deref(initial) != null ? (typeof deref(initial) == "string" ? true : !!deref(initial)) : false) || false)) || false,
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this?.[$value] ?? "") || ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint(!!this?.[$value] || false, hint); },
        set value(v: any) { this[$value] = (v != null ? (typeof v == "string" ? true : !!v) : this[$value]) || false; },
        get value() { return this[$value] || false; }
    };
    const $r = observe(obj) as observeValid<refType<boolean>>; (initial as unknown as Promise<boolean>)?.then?.((v)=>$r.value = v); return $r;
}

//
export const wrapRef = <T = any>(initial?: T|null|undefined|Promise<T>, behavior?: any): observeValid<refType<T>> => {
    const isPromise = initial instanceof Promise || typeof (initial as unknown as Promise<T>)?.then == "function";
    const obj: refWrap<T> = {
        [$promise]: isPromise ? (initial as unknown as Promise<T>) : null as unknown as Promise<T>,
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this.value ?? "") || ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint(this.value, hint); },
        value: isPromise ? null : deref(initial)
    };
    const $r = observe(obj) as observeValid<refType<T>>;
    (initial as unknown as Promise<T>)?.then?.((v) => $r.value = v);
    affected(initial, (v) => { /*wr?.deref?.()*/$r?.[$trigger]?.(); });
    return $r;
}

//
export const propRef = <T = any>(src: observeValid<T>, srcProp: keyType | null = "value", initial?: any, behavior?: any): any => {
    if (isPrimitive(src) || !src) return src;

    //
    if (Array.isArray(src) && !isArrayInvalidKey(src?.[1], src) && (Array.isArray(src?.[0]) || typeof src?.[0] == "object" || typeof src?.[0] == "function")) { src = src?.[0]; };

    //
    if ((srcProp ??= Array.isArray(src) ? null : "value") == null || isArrayInvalidKey(srcProp, src)) { return; }

    // isn't needed to proxy reactive value, it's already reactive
    if (srcProp && hasValue(src?.[srcProp]) && isObservable(src?.[srcProp])) {
        return recoverReactive(src?.[srcProp]);
    }

    // legally use in LUR.E/GLit properties
    if (srcProp && typeof src?.getProperty == "function" && isObservable(src?.getProperty?.(srcProp))) {
        return src?.getProperty?.(srcProp);
    }

    // is regular object, isn't can be reactive (or reactive one-directional, not duplex), just return the value directly
    //if (srcProp && !isObservable(src)) { return src?.[srcProp]; } // commented line means enabled one directional reactivity
    //if (isReactive(src)) { src = recoverReactive(src); }; // recover no necessary, subscribe already checks if reactive

    // truly reflective for object property key/index
    const r: any = observe({
        [$value]: ((src as any)[srcProp] ??= initial ?? (src as any)[srcProp]),
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(src?.[srcProp] ?? this[$value] ?? "") || ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint(src?.[srcProp], hint); },
        set value(v) { r[$triggerLock] = true; (src as any)[srcProp] = (this[$value] = v ?? defaultByType((src as any)[srcProp])); r[$triggerLock] = false; },
        get value() { return (this[$value] = src?.[srcProp] ?? this[$value]); }
    });

    // a reason, why regular objects isn't reactive directly, and may be single directional
    // from 09.02.2026, do more aggresively reactive the source object
    const usb = affected(src, (v) => { r?.[$trigger]?.(); /*r.value = src?.[srcProp] ?? r?.[$value];*/ });
    addToCallChain(r, Symbol.dispose, usb);
    return r;
}

//
export const $ref = <T = any>(typed: T|null|undefined|Promise<T>, behavior?: any): (T extends object|Function|symbol ? observeValid<T>|refType<T> : refType<T>) => {
    switch (typeof typed) {
        case "boolean": return booleanRef(typed, behavior) as refType<boolean>;
        case "number" : return numberRef(typed, behavior) as refType<number>;
        case "string" : return stringRef(typed, behavior) as refType<string>;
        case "object" : if (typed != null) { return wrapRef(observe(typed), behavior) as any; }
        default: return wrapRef(typed, behavior) as any;
    }
}

//
export const ref = <T = any>(
    typed: T | null | undefined | Promise<T>,
    prop: keyType | null = "value",
    behavior?: any
): (
    T extends object | Function | symbol ? observeValid<T> | refType<T> : refType<T>
) & (
    T extends symbol | object | Function ? T : any
) => {
    // 1. Ensure we have an observable or ref for the input
    const $r = isObservable(typed)
        ? (typed as observeValid<T>)
        : ($ref(typed, behavior) as observeValid<T>);
    
    // 2. If a prop is given, get a ref to that prop, otherwise use the value as is
    if (prop != null) {
        // propRef always returns a refType<X> or observeValid<X>
        // We cannot guarantee T extends prop type. So just return as best match
        return propRef(
            $r as unknown as refType<T>,
            prop,
            behavior
        ) as any;
    } else {
        return $r as any;
    }
};

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
