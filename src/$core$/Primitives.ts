import { $value, $behavior, $promise, $extractKey$ } from "../$wrap$/Symbol";
import { deref, refValid } from "../$wrap$/Utils";
import { makeReactiveArray, makeReactiveMap, makeReactiveObject, makeReactiveSet } from "./Specific";

//
export const numberRef = <Under = number>(initial?: any, behavior?: any): refValid<Under> => {
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r: refValid<Under> = makeReactive({
        [$promise]: isPromise ? initial : null,
        [$value]: isPromise ? 0 : (Number(deref(initial) || 0) || 0),
        [$behavior]: behavior,
        [Symbol?.toStringTag]() { return String(this?.[$value] ?? "") || ""; },
        [Symbol?.toPrimitive](hint: any) { return Number((typeof this?.[$value] != "object" ? this?.[$value] : (this?.[$value]?.value || 0)) ?? 0) || 0; },
        set value(v) { this[$value] = ((v != null && !Number.isNaN(v)) ? Number(v) : this[$value]) || 0; },
        get value() { return Number(this[$value] || 0) || 0; }
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const stringRef = <Under = string>(initial?: any, behavior?: any): refValid<Under> => {
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r: refValid<Under> = makeReactive({
        [$promise]: isPromise ? initial : null, // @ts-ignore
        [$value]: (isPromise ? "" : String(deref(typeof initial == "number" ? String(initial) : (initial || "")))) ?? "", // @ts-ignore
        [$behavior]: behavior, // @ts-ignore
        [Symbol?.toStringTag]() { return String(this?.[$value] ?? "") ?? ""; }, // @ts-ignore
        [Symbol?.toPrimitive](hint: any) { return String(this?.[$value] ?? "") ?? ""; }, // TODO: check hint
        set value(v) { this[$value] = String(typeof v == "number" ? String(v) : (v || "")) ?? ""; }, // @ts-ignore
        get value() { return String(this[$value] ?? "") ?? ""; }, // @ts-ignore
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const booleanRef = <Under = boolean>(initial?: any, behavior?: any): refValid<Under> => {
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r: refValid<Under> = makeReactive({
        [$promise]: isPromise ? initial : null, // @ts-ignore
        [$value]: (isPromise ? false : ((deref(initial) != null ? (typeof deref(initial) == "string" ? true : !!deref(initial)) : false) || false)) || false, // @ts-ignore
        [$behavior]: behavior, // @ts-ignore
        [Symbol?.toStringTag]() { return String(this?.[$value] ?? "") || ""; }, // @ts-ignore
        [Symbol?.toPrimitive](hint: any) { return (!!this?.[$value] || false); }, // TODO: check hint
        set value(v) { this[$value] = (v != null ? (typeof v == "string" ? true : !!v) : this[$value]) || false; }, // @ts-ignore
        get value() { return this[$value] || false; } // @ts-ignore
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const ref = <Under = any>(initial?: any, behavior?: any): refValid<Under> => {
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r: refValid<Under> = makeReactive({
        [$promise]: isPromise ? initial : null, // @ts-ignore
        [$behavior]: behavior, // @ts-ignore
        value: isPromise ? null : deref(initial) // @ts-ignore
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const autoRef = <Under = any>(typed: any, behavior?: any): refValid<Under> => {
    switch (typeof typed) {
        case "boolean": return booleanRef<boolean>(typed, behavior);
        case "number" : return numberRef<number>(typed, behavior);
        case "string" : return stringRef<string>(typed, behavior);
        case "object" : if (typed != null) { return makeReactive(typed); }
        default: return ref<Under>(typed, behavior);
    }
}

//
export const promised = <Under = any>(promise: any, behavior?: any): refValid<Under> => {
    return ref<Under>(promise, behavior);
}

//
export const triggerWithDelay = <Under = any>(ref: any, cb: Function, delay = 100): refValid<Under> => { if (ref?.value ?? ref) { return setTimeout(()=>{ if (ref.value) cb?.(); }, delay); } }

//
export const delayedBehavior  = (delay = 100) => {
    return (cb: Function, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); };
}

//
export const delayedOrInstantBehavior = (delay = 100) => {
    return (cb: Function, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); if (!tm) { cb?.(); }; };
}

//
export const makeReactive = <Under = any, T=refValid<Under>>(target: refValid<Under,T>, stateName = ""): refValid<Under,T> => {
    if (typeof target == "symbol" || !(typeof target == "object" || typeof target == "function") || target == null || target?.[$extractKey$]) return target as refValid<Under,T>;
    if (target instanceof Promise || target instanceof WeakRef) return target as refValid<Under,T>; // promise forbidden

    //
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
    if (typeof unwrap == "symbol" || !(typeof unwrap == "object" || typeof unwrap == "function") || unwrap == null) return target as refValid<Under,T>;
    if (unwrap instanceof Promise || unwrap instanceof WeakRef) return target as refValid<Under,T>; // promise forbidden

    //
    let reactive = target;
    if (Array.isArray(unwrap)) { reactive = makeReactiveArray(target as Under[]); return reactive; } else
    if (unwrap instanceof Map || unwrap instanceof WeakMap) { reactive = makeReactiveMap(target as Map<any, Under>); return reactive; } else
    if (unwrap instanceof Set || unwrap instanceof WeakSet) { reactive = makeReactiveSet(target as Set<Under>); return reactive; } else
    if (typeof unwrap == "function" || typeof unwrap == "object") { reactive = makeReactiveObject(target); return reactive; }

    //
    return reactive;
}

//
export const isReactive = (target: any) => {
    return !!((typeof target == "object" || typeof target == "function") && target != null && target?.[$extractKey$]);
}
