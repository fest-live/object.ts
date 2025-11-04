import { $extractKey$ } from "../wrap/Symbol";
import { deref, type keyType } from "../wrap/Utils";
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
const forAll = Symbol.for("@allProps");

//
export class Subscript {
    compatible: any;
    #listeners: Map<(value: any, prop: keyType, oldValue?: any, operation?: string|null) => void, any>;
    #flags = new WeakSet();
    #native: any;
    #iterator: any;
    triggerLock: boolean;

    // production version
    $safeExec(cb, ...args) {
        if (!cb || this.#flags.has(cb)) return this;

        //
        this.#flags.add(cb);
        const result = (Array.isArray(args) ?
            Promise?.try?.(cb, ...args as [any, any, any, any]) :
            Promise?.try?.(cb, args))?.catch?.(console.warn.bind(console));
        this.#flags.delete(cb);
        return result;
    }

    //
    constructor() {
        this.triggerLock = false;
        this.#listeners = new Map();
        this.#flags = new WeakSet();

        //
        const weak = new WeakRef(this), listeners = new WeakRef(this.#listeners);
        const caller = (name, value = null, oldValue?: any, ...etc: any[]) => {
            const arr = listeners?.deref?.();

            // sort by history order
            return Promise.all([...(arr?.entries?.()||[])]
                ?.filter?.(([_, $nm])=>($nm == name || $nm == forAll || $nm == null))
                ?.map?.(([cb, $nm]) => this.$safeExec(cb, value, name, oldValue, ...etc))||[]);;
        };

        // compatible with https://github.com/WICG/observable
        // mostly, only for subscribers (virtual Observable)
        const controller = function (subscriber) {
            const handler = subscriber?.next?.bind?.(subscriber);
            return completeWithUnsub(subscriber, weak, handler);
        }

        // @ts-ignore
        this.#native = (typeof Observable != "undefined" ? (new Observable(controller)) : null)

        // initiate generator, and do next
        this.#iterator = {
            next(args: any) {
                if (args) { Array.isArray(args) ? caller(...args as [any, any, any, any]) : caller(args); };
            }
        }

        //
        this.compatible = ()=>this.#native;
    }

    //
    wrap(nw: any[] | unknown) { if (Array.isArray(nw)) { return wrapWith(nw, this); }; return nw; }
    subscribe(cb: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (cb == null || (typeof cb != "function")) return;

        //
        this.#listeners?.set?.(cb, prop || forAll);
        return () => this.unsubscribe(cb, prop || forAll);
    }

    //
    unsubscribe(cb?: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (cb != null && typeof cb == "function") {
            const listeners = this.#listeners;
            if (listeners?.has?.(cb) && (listeners?.get?.(cb) == prop || prop == null || prop == forAll)) {
                listeners?.delete?.(cb);
                return () => this.subscribe(cb, prop || forAll);
            }
        }
        return this.#listeners?.clear?.();
    }

    // try execute immediatly, if already running, try delayed action in callstack
    // if catch will also fail, will cause another unhandled reject (will no repeating)
    trigger(name: keyType|null, value?: any|null, oldValue?: any, ...etc: any[]) {
        if (typeof name == "symbol") return;
        return Promise.try(this.#iterator.next?.bind(this.#iterator), [name, value, oldValue, ...etc])?.catch?.(console.warn.bind(console));;
    }

    //
    get iterator() { return this.#iterator; }
}
