import { $extractKey$ } from "../wrap/Symbol";
import { deref, type keyType } from "../wrap/Utils";
import { WR } from "fest/core";

//
const withUnsub = new WeakMap();
const completeWithUnsub = (subscriber, weak: WeakRef<any>|WR<any>, handler: Subscript)=>{
    // @ts-ignore
    return withUnsub.getOrInsert(subscriber, ()=>{
        const registry = weak?.deref?.(); registry?.affected?.(handler);
        const savComplete = subscriber?.complete?.bind?.(subscriber);
        const unaffected = () => { const r = savComplete?.(); registry?.unaffected?.(handler); return r; };
        subscriber.complete = unaffected;
        return {
            unaffected,
            [Symbol.dispose]: unaffected,
            [Symbol.asyncDispose]: unaffected,
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
const forAll = Symbol.for("@allProps");

//
export class Subscript {
    compatible: any;
    #listeners: Map<(value: any, prop: keyType, oldValue?: any, operation?: string|null) => void, any>;
    #flags = new WeakSet();
    #native: any;
    #iterator: any;
    #triggerLock = new Set<keyType>();

    // production version
    $safeExec(cb, ...args) {
        if (!cb || this.#flags.has(cb)) return;

        //
        this.#flags.add(cb);
        try {
            // @ts-ignore
            const res = cb(...args);
            // Handle promises if returned, but don't force them
            if (res && typeof res.then === 'function') {
                // @ts-ignore
                return res.catch(console.warn);
            }
            return res;
        } catch (e) {
            console.warn(e);
        } finally {
            this.#flags.delete(cb);
        }
    }

    //
    constructor() {
        this.#listeners = new Map();
        this.#flags = new WeakSet();

        // initiate generator, and do next
        this.#iterator = {
            next: (args: any) => {
                if (args) {
                    Array.isArray(args) ? this.#dispatch(...args as [any, any, any, any]) : this.#dispatch(args);
                }
            }
        }



        // compatible with https://github.com/WICG/observable
        // mostly, only for subscribers (virtual Observable)
        const weak = new WeakRef(this);
        const controller = function (subscriber) {
            const handler = subscriber?.next?.bind?.(subscriber);
            return completeWithUnsub(subscriber, weak, handler);
        }

        // @ts-ignore
        this.#native = (typeof Observable != "undefined" ? (new Observable(controller)) : null)
        this.compatible = ()=>this.#native;
    }

    // Optimized dispatch method replacing the closure 'caller'
    #dispatch(name, value = null, oldValue?: any, ...etc: any[]) {
        const listeners = this.#listeners;
        if (!listeners?.size) return;

        // Direct iteration avoiding array allocation
        let promises: Promise<any>[] = Array.from(listeners?.entries?.() ?? []).map?.(([cb, prop]) => {
            if (prop === name || prop === forAll || prop === null) { return this.$safeExec(cb, value, name, oldValue, ...etc); }
            return undefined;
        })?.filter?.((res: any) => res && typeof res.then === 'function');
        return promises?.length ? Promise.allSettled(promises) : undefined;
    }

    //
    wrap(nw: any[] | unknown) { if (Array.isArray(nw)) { return wrapWith(nw, this); }; return nw; }

    //
    affected(cb: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (cb == null || (typeof cb != "function")) return;

        //
        this.#listeners?.set?.(cb, prop || forAll);
        return () => this.unaffected(cb, prop || forAll);
    }

    //
    unaffected(cb?: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (cb != null && typeof cb == "function") {
            const listeners = this.#listeners;
            if (listeners?.has?.(cb) && (listeners?.get?.(cb) == prop || prop == null || prop == forAll)) {
                listeners?.delete?.(cb);
                return () => this.affected(cb, prop || forAll);
            }
        }
        return this.#listeners?.clear?.();
    }

    // try execute immediatly, if already running, try delayed action in callstack
    // if catch will also fail, will cause another unhandled reject (will no repeating)
    trigger(name: keyType|null, value?: any|null, oldValue?: any, ...etc: any[]) {
        if (typeof name == "symbol") return;

        //
        if (name != null && this.#triggerLock.has(name)) return;
        if (name != null) this.#triggerLock.add(name);

        //
        const $promised = Promise.withResolvers<any[]>();
        queueMicrotask(() => {
            try
                { $promised.resolve((this.#dispatch(name, value, oldValue, ...etc) as Promise<any[]> | undefined | any) ?? []); } catch (e)
                { $promised.reject(e); console.warn(e); } finally
                { if (name != null) this.#triggerLock.delete(name); }
        });

        //
        return $promised.promise;
    }

    //
    get iterator() { return this.#iterator; }
}
