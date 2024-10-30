import { $originalKey$, $originalObjects$, objectAssign } from "./AssignObject";
//import stateMap from "./StateManager.ts";

//
const boundCtx = new WeakMap();
const bindFx = (target, fx)=>{
    if (!boundCtx.has(target)) {
        boundCtx.set(target, new WeakMap());
    }

    //
    const be = boundCtx.get(target);
    if (!be.has(fx)) {
        const bfx = fx?.bind?.(target);
        be.set(fx, bfx);
    }

    //
    return be.get(fx);
}

//
const bindCtx = (target, fx) => {
    return (typeof fx == "function" ? bindFx(target, fx) : fx) ?? fx;
}

//
type keyType = string | number | symbol;


//
export class Subscript {
    subscribers: Map<keyType, Set<(value: any, prop: keyType) => void>>;
    listeners: Set<(value: any, prop: keyType) => void>;

    //
    constructor(){
        this.subscribers = new Map();
        this.listeners = new Set();
    }

    //
    subscribe(cb: (value: any, prop: keyType) => void, prop: keyType | null) {
        if (prop) {
            if (this.subscribers.has(prop)) {
                this.subscribers.get(prop)?.add?.(cb);
            } else {
                this.subscribers.set(prop, new Set([cb]));
            }
        } else
        if (!this.listeners.has(cb)) {
            this.listeners.add?.(cb);
        }
    }

    //
    trigger(name, value = null, oldValue?: any) {
        Array.from(this.subscribers.get(name)?.values?.() || []).forEach((cb: (value: any, prop: keyType, oldValue?: any) => void) => cb(value, name, oldValue));
        Array.from(this.listeners?.values?.() || []).forEach((cb: (value: any, prop: keyType, oldValue?: any) => void) => cb(value, name, oldValue));
    }
}

//
const subscriptRegistry = new WeakMap<any, Subscript>();
export const extractSymbol = "$@extract@$";//Symbol("@extract");

//
const register = (what: any, handle: any): any => {
    const unwrap = what?.[extractSymbol] ?? what;
    if (!subscriptRegistry.has(unwrap)) {
        subscriptRegistry.set(unwrap, new Subscript());
    }
    return handle;
}



//
export const safe = (target)=>{
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[extractSymbol] ?? target) : target;

    //
    if (Array.isArray(unwrap)) {
        const mapped = (e)=>safe(e);
        return unwrap?.map?.(mapped) || Array.from(unwrap || []).map(mapped);
    } else

    //
    if (unwrap instanceof Map || unwrap instanceof WeakMap) {
        const map = new Map();
        // @ts-ignore
        for (const E of unwrap?.entries?.()) { map.set(E[0], safe(E[1])); };
        return map;
    } else

    //
    if (unwrap instanceof Set || unwrap instanceof WeakSet) {
        const set = new Set();
        // @ts-ignore
        for (const E of unwrap?.values?.()) { set.add(safe(E[0])); };
        return set;
    } else

    //
    if (unwrap != null && typeof unwrap == "function" || typeof unwrap == "object") {
        const obj = {};
        for (const E of Object.entries(unwrap || {})) {
            obj[E[0]] = safe(E[1]);
        };
        return obj;
    }

    //
    return unwrap;
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

//
export const subscribe = (target, cb: (value: any, prop: keyType) => void, prop: keyType | null = null, ctx: any | null = null)=>{
    (target = $originalObjects$.get(target) ?? target?.[$originalKey$] ?? target);
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[extractSymbol] ?? target) : target;

    //
    if (prop) {
        if (unwrap instanceof Map || unwrap instanceof WeakMap) {
            if (unwrap.has(prop as any) || !prop) {
                cb?.(unwrap.get(prop as any), prop);
            }
        } else

        //
        if (unwrap instanceof Set || unwrap instanceof WeakSet) {
            if (unwrap.has(prop as any) || !prop) {
                // @ts-ignore
                cb?.(unwrap.get(prop as any), prop);
            }
        } else

        //
        if (typeof unwrap == "function" || typeof unwrap == "object") {
            cb?.(Reflect.get(unwrap, prop, ctx ?? unwrap), prop);
        }
    };

    //
    const self = subscriptRegistry.get(unwrap);
    self?.subscribe?.(cb, prop);
    return self;
}

//
export class ReactiveMap {
    //
    constructor() {
    }

    //
    has(target, prop: keyType) {
        return Reflect.has(target, prop);
    }

    //
    get(target, name: keyType, ctx) {
        if (name == extractSymbol) {
            return target?.[extractSymbol] ?? target;
        }

        //
        const valueOrFx = bindCtx(target, Reflect.get(target, name, ctx));

        //
        if (name == "delete") {
            return (prop, _ = null) => {
                const oldValue = target.get(prop);
                const result = valueOrFx(prop);
                subscriptRegistry.get(target)?.trigger?.(prop, null, oldValue);
                return result;
            };
        }

        //
        if (name == "set") {
            return (prop, value) => {
                const oldValue = target.get(prop);
                const result = valueOrFx(prop, value);
                subscriptRegistry.get(target)?.trigger?.(prop, value, oldValue);
                return result;
            };
        }

        //
        return valueOrFx;
    }

    //
    construct(target, args, newT) {
        return Reflect.construct(target, args, newT);
    }

    //
    apply(target, ctx, args) {
        return Reflect.apply(target, ctx, args);
    }
}

//
export class ReactiveSet {
    constructor() {
    }

    //
    has(target, prop: keyType) {
        return Reflect.has(target, prop);
    }

    //
    get(target, name: keyType, ctx) {
        //
        if (name == extractSymbol) {
            return target?.[extractSymbol] ?? target;
        }

        //
        const valueOrFx = bindCtx(target, Reflect.get(target, name, ctx));

        //
        if (name == "delete") {
            return (value) => {
                const oldValue = target.get(value);
                const result = valueOrFx(value);
                subscriptRegistry.get(target)?.trigger?.(value, null, oldValue);
                return result;
            };
        }

        //
        if (name == "add") {
            return (value) => {
                const oldValue = target.get(value);
                const result = valueOrFx(value);
                subscriptRegistry.get(target)?.trigger?.(value, value, oldValue);
                return result;
            };
        }

        //
        return valueOrFx;
    }

    //
    construct(target, args, newT) {
        return Reflect.construct(target, args, newT);
    }

    //
    apply(target, ctx, args) {
        return Reflect.apply(target, ctx, args);
    }
}

//
export class ReactiveObject {
    constructor() {
    }

    //
    get(target, name: keyType, ctx) {
        if (name == extractSymbol) {
            return target?.[extractSymbol] ?? target;
        }
        return bindCtx(target, Reflect.get(target, name, ctx));
    }

    //
    construct(target, args, newT) {
        return Reflect.construct(target, args, newT);
    }

    //
    has(target, prop: keyType) {
        return Reflect.has(target, prop);
    }

    //
    apply(target, ctx, args) {
        return Reflect.apply(target, ctx, args);
    }

    //
    set(target, name: keyType, value) {
        const oldValue = target[name];
        const result = Reflect.set(target, name, value);
        const self = subscriptRegistry.get(target);
        self?.trigger?.(name, value, oldValue);
        return result;
    }

    //
    deleteProperty(target, name: keyType) {
        const oldValue = target[name];
        const result = Reflect.deleteProperty(target, name);
        const self = subscriptRegistry.get(target);
        self?.trigger?.(name, null, oldValue);
        return result;
    }
}

//
export const makeReactiveObject: <T extends object>(map: T) => T = <T extends object>(obj: T) => new Proxy<T>(obj?.[extractSymbol] ?? obj, register(obj, new ReactiveObject()) as ProxyHandler<T>);
export const makeReactiveMap: <K, V>(map: Map<K, V>) => Map<K, V> = <K, V>(map: Map<K, V>) => new Proxy(map?.[extractSymbol] ?? map, register(map, new ReactiveMap()) as ProxyHandler<Map<K, V>>);
export const makeReactiveSet: <V>(set: Set<V>) => Set<V> = <V>(set: Set<V>) => new Proxy(set?.[extractSymbol] ?? set, register(set, new ReactiveSet()) as ProxyHandler<Set<V>>);

//
export const createReactiveMap: <K, V>(map?: [K, V][]) => Map<K, V> = <K, V>(map: [K, V][] = []) => new Proxy(new Map(map), register(map, new ReactiveMap()) as ProxyHandler<Map<K, V>>);
export const createReactiveSet: <V>(set?: V[]) => Set<V> = <V>(set: V[] = []) => new Proxy(new Set(set), register(set, new ReactiveSet()) as ProxyHandler<Set<V>>);

//stateMap
export const makeReactive: any = (target: any, stateName = ""): any => {
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[extractSymbol] ?? target) : target;
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
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[extractSymbol] ?? target) : target;
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