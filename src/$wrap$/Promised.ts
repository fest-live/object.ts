import { $fxy } from "../$wrap$/Symbol";

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
        return actWith(unwrap(target), (obj)=>Reflect.defineProperty(obj, prop, descriptor));
    }

    //
    deleteProperty(target, prop) {
        return actWith(unwrap(target), (obj)=>Reflect.deleteProperty(obj, prop));
    }

    //
    getPrototypeOf(target) {
        return actWith(unwrap(target), (obj)=>Reflect.getPrototypeOf(obj));
    }

    //
    setPrototypeOf(target, proto) {
        return actWith(unwrap(target), (obj)=>Reflect.setPrototypeOf(obj, proto));
    }

    //
    isExtensible(target) {
        return actWith(unwrap(target), (obj)=>Reflect.isExtensible(obj));
    }

    //
    preventExtensions(target) {
        return actWith(unwrap(target), (obj)=>Reflect.preventExtensions(obj));
    }

    //
    ownKeys(target) {
        return actWith(unwrap(target), (obj)=>Reflect.ownKeys(obj));
    }

    //
    getOwnPropertyDescriptor(target, prop) {
        return actWith(unwrap(target), (obj)=>Reflect.getOwnPropertyDescriptor(obj, prop));
    }

    //
    construct(target, args, newTarget) {
        return actWith(unwrap(target), (ct)=>Reflect.construct(ct, args, newTarget));
    }

    //
    get(target, prop, receiver) {
        target = unwrap(target);

        //
        if (prop == 'promise') { return target; } // @ts-ignore
        if (prop == 'resolve' && this.#resolve) { return (...args)=>{ const result = this.#resolve?.(...args); this.#resolve = null; return result; }; } // @ts-ignore
        if (prop == 'reject'  && this.#reject ) { return (...args)=>{ const result = this.#reject?.(...args);  this.#reject  = null; return result; }; } // @ts-ignore
        if (prop == 'then' || prop == 'catch' || prop == 'finally') { return target?.[prop]?.bind?.(target); }

        // @ts-ignore
        return Promised(actWith(target, async (obj)=>{
            let value: any = undefined;
            try { value = Reflect.get(obj, prop, receiver); } catch (e) { value = target?.[prop]; }
            if (typeof value == 'function') { return value?.bind?.(obj); }
            return value;
        }));
    }

    //
    set(target, prop, value) {
        return actWith(unwrap(target), (obj)=>Reflect.set(obj, prop, value));
    }

    //
    apply(target, thisArg, args) { // @ts-ignore
        if (this.#resolve) { const result = this.#resolve?.(...args); this.#resolve = null; return result; }
        return actWith(unwrap(target, this.#resolve), (obj)=>Reflect.apply(obj, thisArg, args));
    }
}

//
export type PromiseLike<T=any> = Promise<T>|any;
export function Promised<T=any>(promise: PromiseLike<T>, resolve?: ((...args: any[])=>void)|null, reject?: ((...args: any[])=>void)|null) {
    if (!handledMap?.has?.(promise)) { promise?.then?.((item)=>resolvedMap?.set?.(promise, item)); } // @ts-ignore
    return handledMap?.getOrInsertComputed?.(promise, ()=>new Proxy<PromiseLike<T>>(fixFx(promise), new PromiseHandler(resolve, reject)));
}
