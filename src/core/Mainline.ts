import { callByAllProp, callByProp, isKeyType, objectAssign } from "fest/core";
import { $extractKey$, $registryKey$, $subscribe } from "../wrap/Symbol";
import { addToCallChain, safe, withPromise, type keyType, subValid, refValid } from "../wrap/Utils";
import { subscriptRegistry } from "./Subscript";
import { observableBySet, observableByMap } from "./Assigned";

//
export const useObservable = <Under = any>(unwrap: refValid<Under>): refValid<Under> => { // @ts-ignore
    if (unwrap == null || (typeof unwrap != "object" && typeof unwrap != "function") || unwrap?.[Symbol.observable] != null) { return unwrap; } // @ts-ignore
    try { unwrap[Symbol.observable] = self?.compatible; } catch (e) { console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks"); };
    unwrap[$subscribe] = (cb)=>{ // @ts-ignore
        const observable = unwrap?.[Symbol?.observable];
        observable?.()?.subscribe?.(cb);
        return () => observable?.()?.unsubscribe?.(cb);
    }; // @ts-ignore
    return unwrap;
}

//
export const subscribe = <Under = any, T=refValid<Under>>(tg: subValid<Under,T>, cb: (value: any, prop: keyType, old?: any, operation?: string|null) => void, ctx: any | null = null) => {

    // inputs now can be regally subscribed directly
    if (typeof HTMLInputElement != "undefined" && tg instanceof HTMLInputElement) {
        const $opt: any = { }; let oldValue = tg?.value;
        const $cb = (ev: any) => { cb?.(ev?.target?.value, "value", oldValue); oldValue = ev?.target?.value; };
        (tg as any)?.addEventListener?.("change", $cb, $opt);
        return () => (tg as any)?.removeEventListener?.("change", $cb, $opt);
    }

    // use custom subscribe if available
    if (tg?.[$subscribe] != null && typeof tg?.[$subscribe] == "function") {
        return tg?.[$subscribe]?.(cb);
    }

    //
    if (typeof tg == "symbol" || tg == null || !(typeof tg == "object" || typeof tg == "function")) return;

    //
    const isPair = (Array.isArray(tg) && tg?.length == 2) && /*(["object", "function"].indexOf(typeof tg?.[0]) >= 0) &&*/ (isKeyType(tg?.[1]) || (Array.isArray(tg?.[0]) && tg?.[1] == Symbol.iterator));
    const prop = isPair && (typeof tg?.[1] != "object" && typeof tg?.[1] != "function") ? tg?.[1] : null;

    // tg?.[0] ?? tg now isn't allowed anymore, because it's not safe
    if (!(tg = (isPair && (prop != null)) ? tg?.[0] : tg)) return;

    // no hope...
    if (typeof tg == "symbol" || !(typeof tg == "object" || typeof tg == "function") || tg == null) { cb?.(tg, prop, null); return; };

    // temp ban with dispose
    return withPromise(tg, (target: any) => { if (!target) return;
        if (typeof target == "symbol" || !(typeof target == "object" || typeof target == "function") || target == null) return;
        let unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target; if (!unwrap) return;
        if (typeof unwrap == "symbol" || !(typeof unwrap == "object" || typeof unwrap == "function") || unwrap == null) return;

        //
        const tProp = (prop != Symbol.iterator) ? prop : null;

        //
        queueMicrotask(() => {
            if (tProp != null && tProp != Symbol.iterator) { callByProp(unwrap, tProp, cb, ctx); } else { callByAllProp(unwrap, cb, ctx); }
        });

        //
        let self = target?.[$registryKey$] ?? (subscriptRegistry).get(unwrap); if (self?.[Symbol.dispose]) return;

        //
        let unsub: any = self?.subscribe?.(cb, tProp);
        addToCallChain(unsub, Symbol.dispose, unsub);
        addToCallChain(unsub, Symbol.asyncDispose, unsub);
        addToCallChain(unwrap, Symbol.dispose, unsub);
        addToCallChain(unwrap, Symbol.asyncDispose, unsub);

        //
        return unsub;
    });
}

//
export const makeArrayObservable = (tg)=>{
    if (tg instanceof Set) return observableBySet(tg);
    if (tg instanceof Map) return observableByMap(tg);
    return tg;
}

//
export const observe = <Under = any, T=refValid<Under>>(tg: subValid<Under,T>, cb: (value: any, prop: keyType, old?: any, operation?: string|null) => void, ctx: any | null = null)=>{
    if (Array.isArray(tg)) { return subscribe([tg, Symbol.iterator], cb, ctx); }
    if (tg instanceof Set) { return subscribe([observableBySet(tg) as any, Symbol.iterator], cb, ctx); }
    if (tg instanceof Map) { return subscribe(tg, cb, ctx); }
    return subscribe(tg, cb, ctx);
}

//
export const unsubscribe = <Under = any, T=refValid<Under>>(tg: subValid<Under,T>, cb?: (value: any, prop: keyType, old?: any) => void, ctx: any | null = null) => {
    return withPromise(tg, (target: any) => {
        const isPair = Array.isArray(target) && target?.length == 2 && ["object", "function"].indexOf(typeof target?.[0]) >= 0 && isKeyType(target?.[1]);
        const prop = isPair ? target?.[1] : null; target = (isPair && prop != null) ? (target?.[0] ?? target) : target;
        const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
        let self = target?.[$registryKey$] ?? (subscriptRegistry).get(unwrap);
        self?.unsubscribe?.(cb, prop);
    });
}

//
export const bindBy = <Under = any, T = refValid<Under>>(target, reactive: subValid<Under, T>, watch?) => {
    subscribe(reactive, (v, p) => { objectAssign(target, v, p, true); });
    watch?.(() => target, (N) => { for (const k in N) { objectAssign(reactive, N[k], k, true); } }, { deep: true });
    return target;
};

//
export const derivate = <Under = any, T = refValid<Under>>(from, reactFn: (value: any) => any, watch?) => bindBy(reactFn(safe(from)), from, watch);
export const bindByKey = <Under = any, T = refValid<Under>>(target, reactive: subValid<Under, T>, key = () => "") => subscribe(reactive, (value, id) => { if (id == key()) { objectAssign(target, value, null, true); } });
