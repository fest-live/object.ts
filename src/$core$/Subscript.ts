import { associateWith, deref, type keyType, propCbMap } from "./Utils.js";
import { $extractKey$ } from "./Symbol.js";

//
export class Subscript {
    compatible: any;
    #listeners: Set<(value: any, prop: keyType, oldValue?: any) => void>;
    #flags = new WeakSet();
    #native: any;
    #iterator: any;
    //#caller: any;

    //
    async $safeExec(cb, args) {
        if (cb && this.#flags.has(cb)) return this;
        this.#flags.add(cb);
        if (Array.isArray(args)) // @ts-ignore
            { await Promise?.try?.(cb, ...args as [any, any, any])?.catch?.(console.error.bind(console)); } else // @ts-ignore
            { await Promise?.try?.(cb, args)?.catch?.(console.error.bind(console)); }
        this.#flags.delete(cb); return this;
    }

    //
    constructor(withWeak?: any) {
        const weak = new WeakRef(this);
        this.#listeners = new Set();
        this.#flags = new WeakSet();

        //
        const listeners = new WeakRef(this.#listeners);
        const caller = (name, value = null, oldValue?: any)=>Promise.all([...listeners?.deref()?.values()||[]]?.map?.((cb: (value: any, prop: keyType, oldValue?: any) => void) => weak?.deref?.()?.$safeExec?.(cb, [value, name, oldValue]))||[]);
        //this.#caller = caller;

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

        //
        const generator = function*() {
            while (weak?.deref?.() && listeners?.deref?.()) {
                const args: any = yield;
                if (Array.isArray(args)) { caller(...args as [any, any, any]); } else { caller(args); }
            }
        }

        // @ts-ignore
        this.#native = (typeof Observable != "undefined" ? (new Observable(subscribe)) : { [Symbol.observable]() { return this }, subscribe })

        // initiate generator, and do next
        this.#iterator = generator();
        this.#iterator?.next?.();
        this.compatible = ()=>this.#native;
    }

    //
    subscribe(cb: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (prop != null) { cb = associateWith(cb, prop) ?? cb; }
        if (!this.#listeners.has(cb)) { this.#listeners.add?.(cb); }
        return ()=> this.unsubscribe(cb, prop);
    }

    unsubscribe(cb?: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (cb != null && typeof cb == "function") {
            if (prop != null && propCbMap.has(cb)) { cb = propCbMap.get(cb) ?? cb; } // @ts-ignore
            if (this.#listeners.has(cb)) { this.#listeners.delete(cb); } // @ts-ignore
            return () => this.subscribe(cb, prop);
        } // otherwise, clear everyone
        this.#listeners.clear();
    }

    // try execute immediatly, if already running, try delayed action in callstack
    // if catch will also fail, will cause another unhandled reject (will no repeating)
    trigger(name, value = null, oldValue?: any) {

        // @ts-ignore
        return Promise.try(()=>this.#iterator.next([name, value, oldValue]))?.catch?.(()=>this.#iterator.next([name, value, oldValue]))?.catch?.(console.error.bind(console));
    }

    //
    get iterator() { return this.#iterator; }
}

//
export const subscriptRegistry = new WeakMap<any, Subscript>();

// @ts-ignore
export const register = (what: any, handle: any): any => { const unwrap = what?.[$extractKey$] ?? what; subscriptRegistry.getOrInsert(unwrap, new Subscript()); return handle; }
export const wrapWith = (what, handle)=>{ what = deref(what?.[$extractKey$] ?? what); return new Proxy(what, register(what, handle)); }; // !experimental `getOrInsert` feature!
