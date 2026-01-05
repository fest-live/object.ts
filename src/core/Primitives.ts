import { tryParseByHint } from "fest/core";
import { $value, $behavior, $promise, $extractKey$, $affected } from "../wrap/Symbol";
import { deref, type observeValid, type WeakKey } from "../wrap/Utils";
import { $isObservable, observeArray, observeMap, observeObject, observeSet } from "./Specific";
import { subscriptRegistry } from "./Subscript";
import { MethodsOf } from "../wrap/Utils";

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
export type refType<T = any> = (refWrap<T> | (T extends object ? T : any)) & MethodsOf<T>;

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
export const ref = <T = any>(initial?: T|null|undefined|Promise<T>, behavior?: any): observeValid<refType<T>> => {
    const isPromise = initial instanceof Promise || typeof (initial as unknown as Promise<T>)?.then == "function";
    const obj: refWrap<T> = {
        [$promise]: isPromise ? (initial as unknown as Promise<T>) : null as unknown as Promise<T>,
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this.value ?? "") || ""; },
        [Symbol?.toPrimitive](hint: any) { return tryParseByHint(this.value, hint); },
        value: isPromise ? null : deref(initial)
    };
    const $r = observe(obj) as observeValid<refType<T>>; (initial as unknown as Promise<T>)?.then?.((v)=>$r.value = v); return $r;
}

//
export const autoRef = <T = any>(typed: T|null|undefined|Promise<T>, behavior?: any): (T extends object|Function|symbol ? observeValid<T>|refType<T> : refType<T>) => {
    switch (typeof typed) {
        case "boolean": return booleanRef(typed, behavior) as refType<boolean>;
        case "number" : return numberRef(typed, behavior) as refType<number>;
        case "string" : return stringRef(typed, behavior) as refType<string>;
        case "object" : if (typed != null) { return observe(typed) as any; }
        default: return ref(typed, behavior) as any;
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
