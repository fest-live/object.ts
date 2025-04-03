import { objectAssign } from "./AssignObject";
import { $originalKey$, $extractKey$, type keyType, bindCtx, isKeyType, $registryKey$, callByProp, callByAllProp, safe } from "./Keys.js";

//
export { safe };

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
const subscriptRegistry = new WeakMap<any, Subscript>();
const register = (what: any, handle: any): any => {
    const unwrap = what?.[$extractKey$] ?? what;
    if (!subscriptRegistry.has(unwrap)) {
        subscriptRegistry.set(unwrap, new Subscript());
    }
    return handle;
}

//
const wrapWith = (what, handle)=>{
    what = deref(what?.[$extractKey$] ?? what);
    return new Proxy(what, register(what, handle));
}

//
export const deref = (target?: any)=>{
    let from = (target?.value != null && (typeof target?.value == "object" || typeof target?.value == "function")) ? target?.value : target;
    if (from instanceof WeakRef) { from = deref(from.deref()); }
    return from;
}

//
export const bindByKey = (target, reactive, key = ()=>"")=>{
    subscribe(reactive, (value, id)=>{
        if (id == key()) { objectAssign(target, value, null, true); }
    });
}

//
export const bindWith = (target, reactive, watch?) => {
    subscribe(reactive, (v,p)=>{ objectAssign(target, v, p, true); });
    watch?.(() => target, (N) => { for (const k in N) { objectAssign(reactive, N[k], k, true); }}, {deep: true});
    return target;
}

//
export const derivate = (from, reactFn, watch?) => {
    return bindWith(reactFn(safe(from)), from, watch);
}

// experimental promise support
export const withPromise = (target, cb)=>{
    if (typeof target?.promise?.then == "function") return target?.promise?.then?.(cb);
    if (typeof target?.then == "function") return target?.then?.(cb);
    return cb(target);
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

// @ts-ignore
Symbol.observable ||= Symbol.for('observable')

//
export class ReactiveMap {
    constructor() { }
    has(target, prop: keyType) { return Reflect.has(target, prop); }
    get(target, name: keyType, ctx) {
        if (name == $registryKey$) { return (subscriptRegistry).get(target); }
        if (name == $extractKey$ || name == $originalKey$) { return target?.[name] ?? target; }

        // @ts-ignore
        if (name == Symbol.observable) { return (subscriptRegistry).get(target)?.compatible; }

        // redirect to value key
        const registry = subscriptRegistry.get(target);
        if ((target = deref(target)) == null) return;

        //
        const valueOrFx = bindCtx(target, Reflect.get(target[$extractKey$] ?? target[$originalKey$] ?? target, name, ctx));

        //
        if (name == "clear") {
            return () => {
                const oldValues: any = Array.from(target?.entries?.() || []);
                const result = valueOrFx();
                oldValues.forEach(([prop, oldValue])=>{
                    registry?.trigger?.(prop, null, oldValue);
                });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (prop, _ = null) => {
                const oldValue = target.get(prop);
                const result = valueOrFx(prop);
                registry?.trigger?.(prop, null, oldValue);
                return result;
            };
        }

        //
        if (name == "set") {
            return (prop, value) => {
                const oldValue = target.get(prop);
                const result = valueOrFx(prop, value);
                if (oldValue !== value) { registry?.trigger?.(prop, value, oldValue); };
                return result;
            };
        }

        //
        return valueOrFx;
    }

    //
    construct(target, args, newT) {
        // redirect to value key
        if ((target = deref(target)) == null) return;
        return Reflect.construct(target, args, newT);
    }

    //
    apply(target, ctx, args) {
        // redirect to value key
        if ((target = deref(target)) == null) return;
        return Reflect.apply(target, ctx, args);
    }
}

//
export class ReactiveSet {
    constructor() {
    }

    //
    has(target, prop: keyType) {
        // redirect to value key
        if ((target = deref(target)) == null) return;
        return Reflect.has(target, prop);
    }

    //
    get(target, name: keyType, ctx) {
        if (name == $registryKey$) { return (subscriptRegistry).get(target); }
        if (name == $extractKey$ || name == $originalKey$) { return target?.[name] ?? target; }

        // @ts-ignore
        if (name == Symbol.observable) { return (subscriptRegistry).get(target)?.compatible; }

        // redirect to value key
        const registry = subscriptRegistry.get(target);
        if ((target = deref(target)) == null) return;

        //
        const valueOrFx = bindCtx(target, Reflect.get(target, name, ctx));

        //
        if (name == "clear") {
            return () => {
                const oldValues = Array.from(target?.values?.() || []);
                const result = valueOrFx();
                oldValues.forEach((oldValue)=>{
                    registry?.trigger?.(null, null, oldValue);
                });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (value) => {
                const oldValue = target.has(value) ? value : null;
                const result   = valueOrFx(value);
                registry?.trigger?.(value, null, oldValue);
                return result;
            };
        }

        //
        if (name == "add") {
            return (value) => {
                const oldValue = target.has(value) ? value : null;
                const result   = valueOrFx(value);
                if (oldValue !== value) { registry?.trigger?.(value, value, oldValue); };
                return result;
            };
        }

        //
        return valueOrFx;
    }

    //
    construct(target, args, newT) {
        // redirect to value key
        if ((target = deref(target)) == null) return;
        return Reflect.construct(target, args, newT);
    }

    //
    apply(target, ctx, args) {
        // redirect to value key
        if ((target = deref(target)) == null) return;
        return Reflect.apply(target, ctx, args);
    }
}

//
export class ReactiveObject {
    constructor() {
    }

    // supports nested "value" objects and values
    get(target, name: keyType, ctx) {
        const registry = (subscriptRegistry).get(target);
        if ((target = deref(target)) == null) return;
        if (name == $registryKey$) { return registry; }
        if (name == $extractKey$ || name == $originalKey$) { return target?.[name] ?? target; }

        // @ts-ignore
        if (name == Symbol.observable) { return (subscriptRegistry).get(target)?.compatible; }

        //
        return bindCtx(target, Reflect.get(target, name, ctx));
    }

    //
    construct(target, args, newT) {
        if ((target = deref(target)) == null) return;
        return Reflect.construct(target, args, newT);
    }

    //
    has(target, prop: keyType) {
        if ((target = deref(target)) == null) return;
        return Reflect.has(target, prop);
    }

    //
    apply(target, ctx, args) {
        if ((target = deref(target)) == null) return;
        return Reflect.apply(target, ctx, args);
    }

    // supports nested "value" objects
    set(target, name: keyType, value) {
        const registry = (subscriptRegistry).get(target);
        if ((target = deref(target)) == null) return;

        //
        const oldValue = target[name];
        const result = Reflect.set(target, name, value);
        if (oldValue !== value) { registry?.trigger?.(name, value, oldValue); };
        return result;
    }

    //
    deleteProperty(target, name: keyType) {
        const registry = (subscriptRegistry).get(target);
        if ((target = deref(target)) == null) return;

        //
        const oldValue = target[name];
        const result = Reflect.deleteProperty(target, name);
        registry?.trigger?.(name, null, oldValue);
        return result;
    }
}

//
export const makeReactiveObject: <T extends object>(map: T) => T = <T extends object>(obj: T) => { return (obj?.[$extractKey$] ? obj : wrapWith(obj, new ReactiveObject())); };
export const makeReactiveMap: <K, V>(map: Map<K, V>) => Map<K, V> = <K, V>(map: Map<K, V>) =>    { return (map?.[$extractKey$] ? map : wrapWith(map, new ReactiveMap())); };
export const makeReactiveSet: <V>(set: Set<V>) => Set<V> = <V>(set: Set<V>) =>                   { return (set?.[$extractKey$] ? set : wrapWith(set, new ReactiveSet())); };

//
export const createReactiveMap: <K, V>(map?: [K, V][]) => Map<K, V> = <K, V>(map: [K, V][] = []) => wrapWith(new Map(map), new ReactiveMap());
export const createReactiveSet: <V>(set?: V[]) => Set<V> = <V>(set: V[] = []) => wrapWith(new Set(set), new ReactiveSet());

//
export const makeReactive: any = (target: any, stateName = ""): any => {
    if (target?.[$extractKey$]) { return target; }

    //
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
    let reactive = target;

    //
    if (unwrap instanceof Map || unwrap instanceof WeakMap) {
        reactive = makeReactiveMap(target);
    } else

    //
    if (unwrap instanceof Set || unwrap instanceof WeakSet) {
        reactive = makeReactiveSet(target);
    } else

    //
    if (typeof unwrap == "function" || typeof unwrap == "object") {
        reactive = makeReactiveObject(target);
    }

    //
    //if (stateName) stateMap.set(stateName, reactive);

    //
    return reactive;
}

//
export const createReactive: any = (target: any, stateName = ""): any => {
    if (target?.[$extractKey$]) { return target; }

    //
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
    let reactive = target;

    // BROKEN!
    if (Array.isArray(target)) {
        //reactive = createReactiveMap(target);
        //reactive = createReactiveSet(target);
    } else

    //
    if (typeof unwrap == "function" || typeof unwrap == "object") {
        reactive = makeReactiveObject(target);
    }

    //
    //if (stateName) stateMap.set(stateName, reactive);

    //
    return reactive;
}

// reacts by change storage, loads from storage, and reacts from storage event changes
export const localStorageRef = (key, initial?: any)=>{
    const ref = makeReactive({value: localStorage.getItem(key) ?? initial});
    addEventListener("storage", (ev)=>{
        if (ev.storageArea == localStorage && ev.key == key) {
            if (ref.value !== ev.newValue) { ref.value = ev.newValue; };
        }
    });
    subscribe([ref, "value"], (val)=>{
        localStorage.setItem(key, val);
    });
    return ref;
}

// reacts only from media, you can't change media condition
export const matchMediaRef = (condition: string)=>{
    const med = matchMedia(condition);
    const ref = makeReactive({value: med.matches});
    med.addEventListener("change", (ev)=>{
        ref.value = ev.matches;
    });
    return ref;
}

//
export const conditional = (ref: any, ifTrue: any, ifFalse: any)=>{
    const cond = makeReactive({value: ref.value ? ifTrue : ifFalse});
    subscribe([ref, "value"], (val) => { cond.value = val ? ifTrue : ifFalse; });
    return cond;
}

//
export const objectAssignNotEqual = (dst, src = {})=>{
    Object.entries(src)?.forEach?.(([k,v])=>{ if (v !== dst[k]) { dst[k] = v; }; });
    return dst;
}

//
const isValidObj  = (obj?: any)=> { return obj != null && (typeof obj == "function" || typeof obj == "object") && !(obj instanceof WeakRef); };
export const ref  = (initial?: any)=>{ return makeReactive({value: deref(initial)}); }
export const weak = (initial?: any)=>{ const obj = deref(initial); return makeReactive({value: isValidObj(obj) ? new WeakRef(obj) : obj}); }

//
export const promised = (promise: any)=>{
    const ref = makeReactive({value: promise});
    promise?.then?.((v)=>ref.value = v);
    return ref;
}

// used for conditional reaction
// !one-directional
export const computed = (sub, cb?: Function|null, dest?: [any, string|number|symbol]|null)=>{
    if (!dest) dest = [makeReactive({}), "value"];
    subscribe(sub, (value, prop, old) => {
        const got = cb?.(value, prop, old);
        if (got !== dest[dest[1]]) {
            dest[dest[1]] = got;
        }
    });
    return dest?.[0]; // return reactive value
}

// used for redirection properties
// !one-directional
export const remap = (sub, cb?: Function|null, dest?: any|null)=>{
    if (!dest) dest = makeReactive({});
    subscribe(sub, (value, prop, old)=> {
        const got = cb?.(value, prop, old);
        if (typeof got == "object") {
            objectAssignNotEqual(dest, got);
        } else
        if (dest[prop] !== got) dest[prop] = got;
    });
    return dest; // return reactive value
}

// !one-directional
export const unified = (...subs: any[])=>{
    const dest = makeReactive({});
    subs?.forEach?.((sub)=>subscribe(sub, (value, prop, _)=>{
        if (dest[prop] !== value) { dest[prop] = value; };
    }));
    return dest;
}
