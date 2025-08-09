import { $extractKey$ } from "../$wrap$/Symbol";
import { associateWith, deref, type keyType, propCbMap } from "../$wrap$/Utils";
import { WR } from "../$wrap$/WRef";

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
export const register = (what: any, handle: any): any => { const unwrap = what?.[$extractKey$] ?? what; subscriptRegistry.getOrInsert(unwrap, new Subscript()); return handle; }
export const wrapWith = (what: any, handle: any): any =>{ what = deref(what?.[$extractKey$] ?? what);
    if (typeof what == "symbol" || !(typeof what == "object" || typeof what == "function") || what == null) return what;
    return new Proxy(what, register(what, handle));
}; // !experimental `getOrInsert` feature!

//
export class Subscript {
    compatible: any;
    #listeners: Set<(value: any, prop: keyType, oldValue?: any) => void>;
    #flags = new WeakSet();
    #native: any;
    #iterator: any;
    #subMap?: WeakMap<any, Map<any, any>>|null;
    //#caller: any;

    // production version
    async $safeExec(cb, args) {
        if (cb && this.#flags.has(cb)) return this;
        this.#flags.add(cb);
        if (Array.isArray(args)) // @ts-ignore
            { await Promise?.try?.(cb, ...args as [any, any, any])?.catch?.(console.error.bind(console)); } else // @ts-ignore
            { await Promise?.try?.(cb, args)?.catch?.(console.error.bind(console)); }
        this.#flags.delete(cb); return this;
    }

/*  // debug version (with performance.mark)
    async $safeExec(cb, args) {
        const cbName    = cb.name || '[anonymous]';
        const markTime  = (performance.now()*1000)|0;
        const markStart = `cb_start_${cbName}_on_[${args?.[1]||"<?>"}]_@[${markTime}]_[${Math.random()}]`;
        const markEnd   = `cb_end_${cbName}_on_[${args?.[1]||"<?>"}]_@[${markTime}]_[${Math.random()}]`;
        const markName  = `cb_exec_${cbName}_on_[${args?.[1]||"<?>"}]_@[${markTime}]_[${Math.random()}]`;

        //
        if (cb && this.#flags.has(cb)) return this;

        //
        performance.mark(markStart);
        this.#flags.add(cb);
        try {
            if (Array.isArray(args)) // @ts-ignore
                { await Promise?.try?.(cb, ...args as [any, any, any]); } else // @ts-ignore
                { await Promise?.try?.(cb, args); }
        } catch (e) { console.error(e); }
        this.#flags.delete(cb);

        //
        performance.mark(markEnd);
        performance.measure(
            markName,
            markStart,
            markEnd
        );

        //
        const measures = performance.getEntriesByName(markName);
        if (measures.length) {
            //const duration = measures[measures.length - 1].duration; //recordCbStat(cbName, duration);
            //console.log(`[${markTime}] exec_time for '${cbName}(...)' on [${args?.[1]||"<?>"}]:`, duration, 'ms');
        }

        //
        performance.clearMarks(markStart);
        performance.clearMarks(markEnd);
        performance.clearMeasures(markName);
        return this;
    }*/

    //
    constructor(withWeak?: any) {
        const weak = new WeakRef(this);
        this.#listeners = new Set();
        this.#flags = new WeakSet();
        this.#subMap = new WeakMap();

        //
        const listeners = new WeakRef(this.#listeners);
        const caller = async (name, value = null, oldValue?: any, ...etc: any[]) => {
            const callName = ("[" + ((performance.now()*1000)|0) + "]") + ' caller_stack on [' + (name || "<?>") + "]";
            //console.time(callName);
            const arr = [...(listeners?.deref()?.values()||[])];
            const result = await Promise.all(arr?.map?.((cb) =>
                weak?.deref?.()?.$safeExec?.(cb, [value, name, oldValue, ...etc])
            )||[]);
            //console.timeEnd(callName);
            return result;
        };

        //const caller = (name, value = null, oldValue?: any)=>Promise.all([...listeners?.deref()?.values()||[]]?.map?.((cb: (value: any, prop: keyType, oldValue?: any) => void) => weak?.deref?.()?.$safeExec?.(cb, [value, name, oldValue]))||[]);
        //this.#caller = caller;

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
                if (Array.isArray(args)) { caller(...args as [any, any, any]); } else { caller(args); }
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
    trigger(name: keyType, value: any = null, oldValue?: any, ...etc: any[]) {
        if (typeof name == "symbol") return;

        // @ts-ignore
        return Promise.try(()=>this.#iterator.next([name, value, oldValue, ...etc]))?.catch?.(()=>this.#iterator.next([name, value, oldValue, ...etc]))?.catch?.(console.error.bind(console));
    }

    //
    get iterator() { return this.#iterator; }
}
