import { $extractKey$, type keyType, safe } from "./Keys.js";

//
const propCbMap = new WeakMap();
const associateWith = (cb, name)=>{
    if (propCbMap.has(cb)) return propCbMap.get(cb);
    const nw = (val, prop, old)=>{ if (prop == name) return cb?.(val, prop, old); };
    propCbMap.set(cb, nw); return nw;
    //return (val, prop, old)=>{ if (prop == name) return cb(val, prop, old); };
}

//
export class Subscript {
    compatible: any;
    #listeners: Set<(value: any, prop: keyType, oldValue?: any) => void>;
    #native: any;

    //
    constructor(withWeak?: any) {
        const weak = new WeakRef(this);
        this.#listeners = new Set();

        // compatible with https://github.com/WICG/observable
        // mostly, only for subscribers (virtual Observable)
        const subscribe = function (subscriber) {
            const self = weak?.deref?.();
            const handler = subscriber?.next?.bind?.(subscriber);
            self?.subscribe?.(handler);
            const unsubscribe = () => { const r = subscriber?.complete?.(); self?.unsubscribe?.(handler); return r; };
            return {
                unsubscribe,
                [Symbol.dispose]: unsubscribe,
                [Symbol.asyncDispose]: unsubscribe,
            }
        }

        // @ts-ignore
        this.#native = (typeof Observable != "undefined" ? (new Observable(subscribe)) : { [Symbol.observable]() { return this },
            subscribe })

        //
        this.compatible = ()=>this.#native;
    }

    //
    subscribe(cb: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (prop != null) { cb = associateWith(cb, prop); }
        if (!this.#listeners.has(cb)) { this.#listeners.add?.(cb); }
    }

    //
    trigger(name, value = null, oldValue?: any) {
        return this.#listeners?.forEach((cb: (value: any, prop: keyType, oldValue?: any) => void) => cb(value, name, oldValue));
    }

    //
    unsubscribe(cb: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (prop != null && propCbMap.has(cb)) { cb = propCbMap.get(cb); }
        if (this.#listeners.has(cb)) { this.#listeners.delete(cb); }
    }
}

//
export const subscriptRegistry = new WeakMap<any, Subscript>();
export const register = (what: any, handle: any): any => {
    const unwrap = what?.[$extractKey$] ?? what;
    if (!subscriptRegistry.has(unwrap)) {
        subscriptRegistry.set(unwrap, new Subscript());
    }
    return handle;
}

//
export const wrapWith = (what, handle)=>{
    what = deref(what?.[$extractKey$] ?? what);
    return new Proxy(what, register(what, handle));
}

//
export const deref = (target?: any)=>{
    let from = (target?.value != null && (typeof target?.value == "object" || typeof target?.value == "function")) ? target?.value : target;
    if (from instanceof WeakRef) { from = deref(from.deref()); }
    return from;
}

// @ts-ignore
Symbol.observable ||= Symbol.for('observable')
