import { objectAssign } from "./AssignObject";
import { callByAllProp, callByProp, isKeyType, safe, withPromise, type keyType } from "./Utils";
import { subscriptRegistry } from "./Subscript";
import { makeReactiveMap, makeReactiveObject, makeReactiveSet } from "./Specific";
import { $extractKey$, $registryKey$ } from "./Symbol";

//
export const makeReactive: any = (target: any, stateName = ""): any => {
    if (target?.[$extractKey$]) { return target; }

    //
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
    let reactive = target;

    //
    if (unwrap instanceof Map || unwrap instanceof WeakMap) { reactive = makeReactiveMap(target); } else
    if (unwrap instanceof Set || unwrap instanceof WeakSet) { reactive = makeReactiveSet(target); } else
    if (typeof unwrap == "function" || typeof unwrap == "object") { reactive = makeReactiveObject(target); }

    //
    return reactive;
}

//
export const subscribe = (tg: any, cb: (value: any, prop: keyType, old?: any) => void, ctx: any | null = null)=>{
    return withPromise(tg, (target: any)=>{
        const isPair = Array.isArray(target) && target?.length == 2 && ["object", "function"].indexOf(typeof target?.[0]) >= 0 && isKeyType(target?.[1]);
        const prop = isPair ? target?.[1] : null;

        // hard and advanced definition
        target = (isPair && prop != null) ? (target?.[0] ?? target) : target;

        //
        const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;

        //
        if (prop != null) { callByProp(unwrap, prop, cb, ctx); } else { callByAllProp(unwrap, cb, ctx); }
        let self = target?.[$registryKey$] ?? (subscriptRegistry).get(unwrap);

        // !experimental support for backward compatible (DOESN'T SUPPORT FOR MAP/SET)
        // @ts-ignore
        if (!self && unwrap?.[Symbol.observable]) {
            target = makeReactive(unwrap);

            // @ts-ignore
            unwrap?.[Symbol.observable]?.()?.subscribe?.((value, prop?: any) => (target[prop ?? "value"] = value));
            self = target?.[$registryKey$] ?? (subscriptRegistry).get(unwrap);
        }

        //
        self?.subscribe?.(cb, prop);

        //
        const unsub = ()=>{ return self?.unsubscribe?.(cb, prop); }
        if (Symbol?.dispose != null) { unsub[Symbol.dispose] = ()=>{ return self?.unsubscribe?.(cb, prop); } }
        if (Symbol?.asyncDispose != null) { unsub[Symbol.asyncDispose] = ()=>{ return self?.unsubscribe?.(cb, prop); } }

        // @ts-ignore
        try { unwrap[Symbol.observable] = self?.compatible; } catch(e) { console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks"); };

        //
        return unsub;
    });
}

//
export const bindByKey = (target, reactive, key = ()=>"")=> subscribe(reactive, (value, id)=>{ if (id == key()) { objectAssign(target, value, null, true); } });
export const derivate  = (from, reactFn, watch?) => bindWith(reactFn(safe(from)), from, watch);
export const bindWith  = (target, reactive, watch?) => {
    subscribe(reactive, (v,p)=>{ objectAssign(target, v, p, true); });
    watch?.(() => target, (N) => { for (const k in N) { objectAssign(reactive, N[k], k, true); }}, {deep: true});
    return target;
}
