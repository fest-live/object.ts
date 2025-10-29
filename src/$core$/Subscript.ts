import { associateWith, propCbMap } from "fest/core";
import { $extractKey$ } from "../$wrap$/Symbol";
import { deref, type keyType } from "../$wrap$/Utils";
import { WR } from "fest/core";

//
const withUnsub = new WeakMap();
const completeWithUnsub = (subscriber, weak: WeakRef<any>|WR<any>, handler: Subscript)=>{
    // @ts-ignore
    return withUnsub.getOrInsert(subscriber, ()=>{
        const registry = weak?.deref?.(); registry?.subscribe?.(handler);
        const savComplete = subscriber?.complete?.bind?.(subscriber);
        const unsubscribe = () => { const r = savComplete?.(); registry?.unsubscribe?.(handler); return r; };
        subscriber.complete = unsubscribe;
        return {
            unsubscribe,
            [Symbol.dispose]: unsubscribe,
            [Symbol.asyncDispose]: unsubscribe,
        }
    });
}

//
export const subscriptRegistry = new WeakMap<any, Subscript>();

// @ts-ignore
const wrapped = new WeakMap();

//
export const register = (what: any, handle: any): any => {
    const unwrap = what?.[$extractKey$] ?? what;  // @ts-ignore
    subscriptRegistry.getOrInsert(unwrap, new Subscript());
    return handle;
}

//
export const wrapWith = (what: any, handle: any): any =>{
    what = deref(what?.[$extractKey$] ?? what);
    if (typeof what == "symbol" || !(typeof what == "object" || typeof what == "function") || what == null) return what; // @ts-ignore
    return wrapped.getOrInsertComputed(what, ()=>new Proxy(what, register(what, handle)));
}; // !experimental `getOrInsert` feature!

//
export class Subscript {
    compatible: any;
    #listeners: Set<(value: any, prop: keyType, oldValue?: any, operation?: string|null) => void>;
    #flags = new WeakSet();
    #native: any;
    #iterator: any;
    #triggerLock: Map<any, boolean>;
    #subMap?: WeakMap<any, Map<any, any>>|null;

    // production version
    $safeExec(cb, args) {
        if (cb && this.#flags.has(cb)) return this;

        this.#flags.add(cb);
        this.#triggerLock?.set?.(args?.[1] ?? this, true);

        const result = (Array.isArray(args) ?
            Promise?.try?.(cb, ...args as [any, any, any, any]) :
            Promise?.try?.(cb, args))?.catch?.(console.warn.bind(console));

        this.#triggerLock?.delete?.(args?.[1] ?? this);
        this.#flags.delete(cb);
        return result;
    }

    //
    constructor(withWeak?: any) {
        this.#triggerLock = new Map();
        this.#listeners = new Set();
        this.#flags = new WeakSet();
        this.#subMap = new WeakMap();

        //
        const weak = new WeakRef(this), listeners = new WeakRef(this.#listeners);
        const caller = (name, value = null, oldValue?: any, ...etc: any[]) => {
            const arr = [...(listeners?.deref()?.values()||[])];
            return Promise.all(arr?.map?.((cb) => weak?.deref?.()?.$safeExec?.(cb, [value, name, oldValue, ...etc]))||[]);;
        };

        // compatible with https://github.com/WICG/observable
        // mostly, only for subscribers (virtual Observable)
        const controller = function (subscriber) {
            const handler = subscriber?.next?.bind?.(subscriber);
            return completeWithUnsub(subscriber, weak, handler);
        }

        //
        const generator = function*() {
            while (weak?.deref?.() && listeners?.deref?.()) {
                const args: any = yield;
                const result = Array.isArray(args) ? caller(...args as [any, any, any, any]) : caller(args);
            }
        }

        // @ts-ignore
        this.#native = (typeof Observable != "undefined" ? (new Observable(controller)) : null)

        // initiate generator, and do next
        this.#iterator = generator();
        this.#iterator?.next?.();
        this.compatible = ()=>this.#native;
    }

    //
    wrap(nw: any[] | unknown) { if (Array.isArray(nw)) { return wrapWith(nw, this); }; return nw; }
    subscribe(cb: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (prop != null) { cb = associateWith(cb, prop) ?? cb; };
        if (!this.#listeners.has(cb)) { this.#listeners.add?.(cb); }; // @ts-ignore
        return this.#subMap?.getOrInsert?.(cb)?.getOrInsert?.(prop, () => this.unsubscribe(cb, prop));
    }

    //
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
    trigger(name: keyType|null, value?: any|null, oldValue?: any, ...etc: any[]) {
        if (typeof name == "symbol") return;
        if (!this.#triggerLock?.has(name ?? this)) {
            return Promise.try(()=>this.#iterator.next([name, value, oldValue, ...etc]))?.catch?.(console.error.bind(console));
        }
    }

    //
    get iterator() { return this.#iterator; }
}
