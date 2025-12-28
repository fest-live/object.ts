import { callByAllProp, callByProp, isKeyType, isPrimitive, objectAssign } from "fest/core";
import { $extractKey$, $registryKey$, $affected } from "../wrap/Symbol";
import { addToCallChain, safe, withPromise, type keyType, subValid, refValid, isThenable } from "../wrap/Utils";
import { subscriptRegistry } from "./Subscript";
import { observableBySet, observableByMap } from "./Assigned";
import { isReactive } from "./Primitives";

//
export const useObservable = <Under = any>(unwrap: refValid<Under>): refValid<Under> => { // @ts-ignore
    if (unwrap == null || (typeof unwrap != "object" && typeof unwrap != "function") || unwrap?.[Symbol.observable] != null) { return unwrap; } // @ts-ignore
    try { unwrap[Symbol.observable] = self?.compatible; } catch (e) { console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks"); };
    unwrap[$affected] = (cb)=>{ // @ts-ignore
        const observable = unwrap?.[Symbol?.observable];
        observable?.()?.affected?.(cb);
        return () => observable?.()?.unaffected?.(cb);
    }; // @ts-ignore
    return unwrap;
}

//
type callable = (value: any, prop: keyType, old?: any, operation?: string | null) => void;
type subscript = (target: any, prop: keyType | null, cb: callable, ctx?: any) => any;
export const specializedSubscribe = new WeakMap<any, subscript>();

//
const checkValidObj = (obj: any) => {
    if (typeof obj == "symbol" || obj == null || !(typeof obj == "object" || typeof obj == "function")) return;
    return obj;
}

//
export const subscribeDirectly: subscript = (target: any, prop: keyType | null, cb: (value: any, prop: keyType, old?: any, operation?: string|null) => void, ctx: any | null = null) => { if (!target) return;
    if (!checkValidObj(target)) return;
    const tProp = (prop != Symbol.iterator) ? prop : null;

    //
    let registry = target?.[$registryKey$] ?? (subscriptRegistry).get(target);

    //
    target = target?.[$extractKey$] ?? target;

    //
    queueMicrotask(() => {
        if (tProp != null && tProp != Symbol.iterator) { callByProp(target, tProp, cb, ctx); } else { callByAllProp(target, cb, ctx); }
    });

    //
    let unSub: any = registry?.affected?.(cb, tProp);
    if (target?.[Symbol.dispose]) return unSub;

    //
    addToCallChain(unSub, Symbol.dispose, unSub);
    addToCallChain(unSub, Symbol.asyncDispose, unSub);
    addToCallChain(target, Symbol.dispose, unSub);
    addToCallChain(target, Symbol.asyncDispose, unSub);
    return unSub;
}

//
export const subscribeInput: subscript = (tg: HTMLInputElement, _: keyType | null, cb: (value: any, _: keyType, old?: any, operation?: string|null) => void, ctx: any | null = null) => {
    // inputs now can be regally subscribed directly
    const $opt: any = { }; let oldValue = tg?.value;
    const $cb = (ev: any) => { cb?.(ev?.target?.value, "value", oldValue); oldValue = ev?.target?.value; };
    (tg as any)?.addEventListener?.("change", $cb, $opt);
    return () => (tg as any)?.removeEventListener?.("change", $cb, $opt);
}

//
const checkIsPaired = (tg: any) => {
    return (Array.isArray(tg) && tg?.length == 2 && checkValidObj(tg?.[0])) && (isKeyType(tg?.[1]) || tg?.[1] == Symbol.iterator);
}

// split from prop pairs
export const subscribePaired: subscript = <Under = any, T=refValid<Under>>(tg: subValid<Under,T>, _: keyType | null, cb: (value: any, prop: keyType, old?: any, operation?: string|null) => void, ctx: any | null = null) => {
    const prop = isKeyType(tg?.[1]) ? tg?.[1] : null;
    return affected(tg?.[0], prop, cb, ctx);
}

//
export const subscribeThenable: subscript = (obj: any, prop: keyType | null, cb: (value: any, prop: keyType, old?: any, operation?: string|null) => void, ctx: any | null = null) => {
    return obj?.then?.((obj: any) => affected?.(obj, prop, cb, ctx))?.catch?.((e: any) => { console.warn(e); return null; });
}

//
export const affected = (obj: any, prop: keyType | callable | null, cb: callable = ()=>{}, ctx?: any) => {
    if (typeof prop == "function") { cb = prop; prop = null; }

    //
    if (isPrimitive(obj) || typeof obj == "symbol") { return queueMicrotask(() => { return cb?.(obj, null as any, null, null); }); }
    if (typeof obj?.[$affected] == "function") {
        return obj?.[$affected]?.(cb, prop, ctx);
    } else
    if (checkValidObj(obj)) {
        const wrapped = obj;
        obj = obj?.[$extractKey$] ?? obj;
        if (specializedSubscribe?.has?.(obj)) {
            return specializedSubscribe?.get?.(obj)?.(wrapped, prop, cb, ctx);
        }

        //
        if (isReactive(wrapped) || (checkIsPaired(obj) && isReactive(obj?.[0]))) {
            // when no exists, add a new specialized subscribe function
            if (isThenable(obj)) //@ts-ignore
                { return specializedSubscribe?.getOrInsert?.(obj, subscribeThenable)?.(obj, prop, cb, ctx); } else
            if (checkIsPaired(obj))  //@ts-ignore
                { return specializedSubscribe?.getOrInsert?.(obj, subscribePaired)?.(obj, prop, cb, ctx); } else
            if (typeof HTMLInputElement != "undefined" && obj instanceof HTMLInputElement)  //@ts-ignore
                { return specializedSubscribe?.getOrInsert?.(obj, subscribeInput)?.(obj, prop, cb, ctx); } else  //@ts-ignore
                { return specializedSubscribe?.getOrInsert?.(obj, subscribeDirectly)?.(wrapped, prop, cb, ctx); }
        } else {
            return queueMicrotask(() => {
                if (checkIsPaired(obj)) { return callByProp?.(obj?.[0], obj?.[1] as any, cb, ctx); }
                if (prop != null && prop != Symbol.iterator) { return callByProp?.(obj, prop, cb, ctx); }
                return callByAllProp?.(obj, cb, ctx);
            });
        }
    }
};

//
export const makeArrayObservable = (tg)=>{
    if (tg instanceof Set) return observableBySet(tg);
    if (tg instanceof Map) return observableByMap(tg);
    return tg;
}

//
export const iterated = <Under = any, T=refValid<Under>>(tg: subValid<Under,T>, cb: (value: any, prop: keyType, old?: any, operation?: string|null) => void, ctx: any | null = null)=>{
    if (Array.isArray(tg)) { return affected([tg, Symbol.iterator], cb, ctx); }
    if (tg instanceof Set) { return affected([observableBySet(tg) as any, Symbol.iterator], cb, ctx); }
    if (tg instanceof Map) { return affected(tg, cb, ctx); }
    return affected(tg, cb, ctx);
}

//
export const unaffected = <Under = any, T=refValid<Under>>(tg: subValid<Under,T>, cb?: (value: any, prop: keyType, old?: any) => void, ctx: any | null = null) => {
    return withPromise(tg, (target: any) => {
        const isPair = Array.isArray(target) && target?.length == 2 && ["object", "function"].indexOf(typeof target?.[0]) >= 0 && isKeyType(target?.[1]);
        const prop = isPair ? target?.[1] : null; target = (isPair && prop != null) ? (target?.[0] ?? target) : target;
        const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
        let self = target?.[$registryKey$] ?? (subscriptRegistry).get(unwrap);
        self?.unaffected?.(cb, prop);
    });
}

//
export const bindBy = <Under = any, T = refValid<Under>>(target, reactive: subValid<Under, T>, watch?) => {
    affected(reactive, null, (v, p) => { objectAssign(target, v, p, true); });
    watch?.(() => target, (N) => { for (const k in N) { objectAssign(reactive, N[k], k, true); } }, { deep: true });
    return target;
};

//
export const derivate = <Under = any, T = refValid<Under>>(from, reactFn: (value: any) => any, watch?) => bindBy(reactFn(safe(from)), from, watch);
export const bindByKey = <Under = any, T = refValid<Under>>(target, reactive: subValid<Under, T>, key = () => "") => affected(reactive, null, (value, p) => { if (p == key()) { objectAssign(target, value, null, true); } });
