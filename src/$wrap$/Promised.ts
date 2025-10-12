import { $fxy } from "./Symbol";

//
export const fixFx = (obj) => { if (typeof obj == "function" || obj == null) return obj; const fx = function(){}; fx[$fxy] = obj; return fx; }
export const $set = (rv, key, val)=>{ if (rv?.deref?.() != null) { return (rv.deref()[key] = val); }; }

//
const resolvedMap = new WeakMap(), handledMap = new WeakMap();
const actWith = (promiseOrPlain, cb)=>{
    if (promiseOrPlain instanceof Promise || typeof promiseOrPlain?.then == "function") {
        if (resolvedMap?.has?.(promiseOrPlain)) { return cb(resolvedMap?.get?.(promiseOrPlain)); }
        // @ts-ignore
        return Promise.try?.(async ()=>{
            const item = await promiseOrPlain;
            resolvedMap?.set?.(promiseOrPlain, item);
            return item;
        })?.then?.(cb);
    }
    return cb(promiseOrPlain);
}

//
const unwrap = (obj, fallback?: null|undefined|((...args: any[])=>any))=>{
    return (obj?.[$fxy] ?? (fallback ?? obj));
}


//
const isPrimitive = (obj: any)=>{
    return obj == null || typeof obj == "string" || typeof obj == "number" || typeof obj == "boolean" || typeof obj == "bigint" || typeof obj == "symbol" || typeof obj == "undefined";
}

//
const tryParseByHint = (value: any, hint?: any)=>{
    if (!isPrimitive(value)) return null;
    if (hint == "number") { return Number(value) || 0; }
    if (hint == "string") { return String(value) || ""; }
    if (hint == "boolean") { return !!value; }
    return value;
}


//
class PromiseHandler {
    #resolve?: ((...args: any[])=>void)|null;
    #reject?: ((...args: any[])=>void)|null;

    //
    constructor(resolve?: ((...args: any[])=>void)|null, reject?: ((...args: any[])=>void)|null) {
        this.#resolve = resolve;
        this.#reject = reject;
    }

    //
    defineProperty(target, prop, descriptor) {
        if (unwrap(target) instanceof Promise) return Reflect.defineProperty(target, prop, descriptor);
        return actWith(unwrap(target), (obj)=>Reflect.defineProperty(obj, prop, descriptor));
    }

    //
    deleteProperty(target, prop) {
        if (unwrap(target) instanceof Promise) return Reflect.deleteProperty(target, prop);
        return actWith(unwrap(target), (obj)=>Reflect.deleteProperty(obj, prop));
    }

    //
    getPrototypeOf(target) {
        if (unwrap(target) instanceof Promise) return Reflect.getPrototypeOf(target);
        return actWith(unwrap(target), (obj)=>Reflect.getPrototypeOf(obj));
    }

    //
    setPrototypeOf(target, proto) {
        if (unwrap(target) instanceof Promise) return Reflect.setPrototypeOf(target, proto);
        return actWith(unwrap(target), (obj)=>Reflect.setPrototypeOf(obj, proto));
    }

    //
    isExtensible(target) {
        if (unwrap(target) instanceof Promise) return Reflect.isExtensible(target);
        return actWith(unwrap(target), (obj)=>Reflect.isExtensible(obj));
    }

    //
    preventExtensions(target) {
        if (unwrap(target) instanceof Promise) return Reflect.ownKeys(target);
        return actWith(unwrap(target), (obj)=>Reflect.preventExtensions(obj));
    }

    //
    ownKeys(target) {
        const uwp = unwrap(target);
        if (uwp instanceof Promise) return Object.keys(uwp);
        const keys = actWith(uwp, (obj)=>{ return (typeof obj == "object" || typeof obj == "function") && obj != null ? Object.keys(obj) : [] });
        return keys ?? [];
    }

    //
    getOwnPropertyDescriptor(target, prop) {
        if (unwrap(target) instanceof Promise) return Reflect.getOwnPropertyDescriptor(target, prop);
        return actWith(unwrap(target), (obj)=>Reflect.getOwnPropertyDescriptor(obj, prop));
    }

    //
    construct(target, args, newTarget) {
        return actWith(unwrap(target), (ct)=>Reflect.construct(ct, args, newTarget));
    }

    //
    has(target, prop) {
        if (unwrap(target) instanceof Promise) return Reflect.has(target, prop);
        return actWith(unwrap(target), (obj)=>Reflect.has(obj, prop));
    }

    //
    get(target, prop, receiver) {
        target = unwrap(target);

        //
        if (prop == 'promise') { return target; } // @ts-ignore
        if (prop == 'resolve' && this.#resolve) { return (...args)=>{ const result = this.#resolve?.(...args); this.#resolve = null; return result; }; } // @ts-ignore
        if (prop == 'reject'  && this.#reject ) { return (...args)=>{ const result = this.#reject?.(...args);  this.#reject  = null; return result; }; } // @ts-ignore
        if (prop == 'then' || prop == 'catch' || prop == 'finally') {
            if (target instanceof Promise) {
                return target?.[prop]?.bind?.(target);
            } else {
                const $tmp = Promise.try(()=>target);
                return $tmp?.[prop]?.bind?.($tmp);
            }
        }

        // @ts-ignore
        const result = Promised(actWith(target, async (obj)=>{
            if (unwrap(obj) instanceof Promise) return Reflect.get(obj, prop, receiver);
            if (isPrimitive(obj)) { return (prop == Symbol.toPrimitive || prop == Symbol.toStringTag) ? obj : undefined; }
            let value: any = undefined;
            try { value = Reflect.get(obj, prop, receiver); } catch (e) { value = target?.[prop]; }
            if (typeof value == 'function') { return value?.bind?.(obj); }
            return value;
        }));

        //
        if (prop == Symbol.toStringTag) {
            if (isPrimitive(result)) { return String(result ?? "") || ""; };
            return result?.[Symbol.toStringTag]?.() || String(result ?? "") || "";
        }

        //
        if (prop == Symbol.toPrimitive) { return (hint?)=>{
            if (isPrimitive(result)) { return tryParseByHint(result, hint); };
            return null;//tryParseByHint(result?.[Symbol.toPrimitive]?.());
        }}

        //
        return result;
    }

    //
    set(target, prop, value) {
        return actWith(unwrap(target), (obj)=>Reflect.set(obj, prop, value));
    }

    //
    apply(target, thisArg, args) { // @ts-ignore
        if (this.#resolve) { const result = this.#resolve?.(...args); this.#resolve = null; return result; }
        return actWith(unwrap(target, this.#resolve), (obj) => {
            if (typeof obj == "function") {
                if (unwrap(obj) instanceof Promise) return Reflect.apply(obj, thisArg, args);
                return Reflect.apply(obj, thisArg, args);
            }
        });
    }
}

//
export type PromiseLike<T=any> = Promise<T>|any;
export function Promised<T=any>(promise: PromiseLike<T>, resolve?: ((...args: any[])=>void)|null, reject?: ((...args: any[])=>void)|null) {
    if (!(promise instanceof Promise || typeof promise?.then == "function")) { return promise; }
    if (resolvedMap?.has?.(promise)) { return resolvedMap?.get?.(promise); };
    if (!handledMap?.has?.(promise)) { promise?.then?.((item)=>resolvedMap?.set?.(promise, item)); } // @ts-ignore
    return handledMap?.getOrInsertComputed?.(promise, ()=>new Proxy<PromiseLike<T>>(fixFx(promise), new PromiseHandler(resolve, reject)));
}

//if (["then", "catch", "finally"].includes(prop as string)) { return (typeof withUpdate?.[prop] == "function" ? withUpdate?.[prop]?.bind?.(withUpdate) : withUpdate?.[prop]); }
