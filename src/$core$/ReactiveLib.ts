import { objectAssign } from "./AssignObject";
import { $originalObjects$, $originalKey$, $extractKey$, type keyType, bindCtx, isKeyType, isIterable, callByProp, callByAllProp, safe } from "./Keys.js";

//
export { safe };

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
        if (prop != null) {
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
const register = (what: any, handle: any): any => {
    const unwrap = what?.[$extractKey$] ?? what;
    if (!subscriptRegistry.has(unwrap)) {
        subscriptRegistry.set(unwrap, new Subscript());
    }
    return handle;
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
export const subscribe = (target: any, cb: (value: any, prop: keyType) => void, ctx: any | null = null)=>{
    const isPair = Array.isArray(target) && target?.length == 2 && ["object", "function"].indexOf(typeof target?.[0]) >= 0 && isKeyType(target?.[1]);
    const prop = isPair ? target?.[1] : null;

    // hard and advanced definition
    target = (isPair && prop != null) ? (target?.[0] ?? target) : target;

    //
    (target = $originalObjects$.get(target) ?? target?.[$originalKey$] ?? target);
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;

    //
    if (prop != null) {
        callByProp(unwrap, prop, cb, ctx);
    } else {
        callByAllProp(unwrap, cb, ctx);
    }

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
        if (name == $extractKey$ || name == $originalKey$) {
            return target?.[name] ?? target;
        }

        //
        const valueOrFx = bindCtx(target, Reflect.get(target, name, ctx));

        //
        if (name == "clear") {
            return () => {
                const oldValues: any = Array.from(target?.entries?.() || []);
                const result = valueOrFx();
                oldValues.forEach(([prop, oldValue])=>{
                    subscriptRegistry.get(target)?.trigger?.(prop, null, oldValue);
                });
                return result;
            };
        }

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
                if (oldValue !== value) { subscriptRegistry.get(target)?.trigger?.(prop, value, oldValue); };
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
        if (name == $extractKey$) {
            return target?.[$extractKey$] ?? target;
        }

        //
        const valueOrFx = bindCtx(target, Reflect.get(target, name, ctx));

        //
        if (name == "clear") {
            return () => {
                const oldValues = Array.from(target?.values?.() || []);
                const result = valueOrFx();
                oldValues.forEach((oldValue)=>{
                    subscriptRegistry.get(target)?.trigger?.(null, null, oldValue);
                });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (value) => {
                const oldValue = target.has(value) ? value : null;
                const result   = valueOrFx(value);
                subscriptRegistry.get(target)?.trigger?.(value, null, oldValue);
                return result;
            };
        }

        //
        if (name == "add") {
            return (value) => {
                const oldValue = target.has(value) ? value : null;
                const result   = valueOrFx(value);
                if (oldValue !== value) { subscriptRegistry.get(target)?.trigger?.(value, value, oldValue); };
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
        if (name == $extractKey$) {
            return target?.[$extractKey$] ?? target;
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
        if (oldValue !== value) { self?.trigger?.(name, value, oldValue); };
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
export const makeReactiveObject: <T extends object>(map: T) => T = <T extends object>(obj: T) => new Proxy<T>(obj?.[$extractKey$] ?? obj, register(obj, new ReactiveObject()) as ProxyHandler<T>);
export const makeReactiveMap: <K, V>(map: Map<K, V>) => Map<K, V> = <K, V>(map: Map<K, V>) => new Proxy(map?.[$extractKey$] ?? map, register(map, new ReactiveMap()) as ProxyHandler<Map<K, V>>);
export const makeReactiveSet: <V>(set: Set<V>) => Set<V> = <V>(set: Set<V>) => new Proxy(set?.[$extractKey$] ?? set, register(set, new ReactiveSet()) as ProxyHandler<Set<V>>);

//
export const createReactiveMap: <K, V>(map?: [K, V][]) => Map<K, V> = <K, V>(map: [K, V][] = []) => new Proxy(new Map(map), register(map, new ReactiveMap()) as ProxyHandler<Map<K, V>>);
export const createReactiveSet: <V>(set?: V[]) => Set<V> = <V>(set: V[] = []) => new Proxy(new Set(set), register(set, new ReactiveSet()) as ProxyHandler<Set<V>>);

//stateMap
export const makeReactive: any = (target: any, stateName = ""): any => {
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
