import { bindCtx, deref, type keyType } from "./Utils";
import { subscribe } from "./Mainline";
import { subscriptRegistry, wrapWith } from "./Subscript";
import { $extractKey$, $originalKey$, $registryKey$ } from "./Symbol";

// get reactive primitives (if native iterator is available, use it)
const systemGet = (target, name, registry)=>{
    if (name == $registryKey$) { return registry?.deref?.(); }
    if (name == $extractKey$ || name == $originalKey$) { return target?.[name] ?? target; } // @ts-ignore
    if (name == Symbol.observable) { return registry?.deref?.()?.compatible; } // @ts-ignore
    if (name == Symbol.subscribe) { return (cb, prop?)=>subscribe(prop != null ? [target, prop] : target, cb); }
    if (name == Symbol.asyncIterator) { return target[name]?.bind?.(target) ?? (() => registry?.deref?.()?.iterator); }
    if (name == Symbol.iterator) { return target[name]?.bind?.(target) ?? (()=>registry?.deref?.()?.iterator); }
}

//
export class ReactiveMap {
    constructor() { }

    //
    get(target, name: keyType, ctx) {
        const $reg = (subscriptRegistry).get(target);
        const registry = $reg ? new WeakRef($reg) : null;
        const sys = systemGet(target, name, registry); if (sys != null) return sys;

        //
        if ((target = deref(target)) == null) return;
        const tp = (target[$extractKey$] ?? target[$originalKey$] ?? target);
        const valueOrFx = bindCtx(tp, /*Reflect.get(, name, ctx)*/(tp)?.[name]);

        //
        if (name == "clear") {
            return () => {
                const oldValues: any = Array.from(target?.entries?.() || []);
                const result = valueOrFx();
                oldValues.forEach(([prop, oldValue])=>{
                    registry?.deref()?.trigger?.(prop, null, oldValue);
                });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (prop, _ = null) => {
                const oldValue = target.get(prop);
                const result = valueOrFx(prop);
                registry?.deref()?.trigger?.(prop, null, oldValue);
                return result;
            };
        }

        //
        if (name == "set") {
            return (prop, value) => {
                const oldValue = target.get(prop);
                const result = valueOrFx(prop, value);
                if (oldValue !== value) { registry?.deref()?.trigger?.(prop, value, oldValue); };
                return result;
            };
        }

        //
        return valueOrFx;
    }

    // redirect to value key
    has(target, prop: keyType) { if ((target = deref(target)) == null) return false; return Reflect.has(target, prop); }
    apply(target, ctx, args) { if ((target = deref(target)) == null) return; return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { if ((target = deref(target)) == null) return; return Reflect.construct(target, args, newT); }
}

//
export class ReactiveSet {
    constructor() {}

    //
    get(target, name: keyType, ctx) {
        const $reg = (subscriptRegistry).get(target);
        const registry = $reg ? new WeakRef($reg) : null;
        const sys = systemGet(target, name, registry); if (sys != null) return sys;

        // redirect to value key
        if ((target = deref(target)) == null) return;
        const tp = (target[$extractKey$] ?? target[$originalKey$] ?? target);
        const valueOrFx = bindCtx(tp, /*Reflect.get(, name, ctx)*/tp?.[name]);

        //
        if (name == "clear") {
            return () => {
                const oldValues = Array.from(target?.values?.() || []);
                const result = valueOrFx();
                oldValues.forEach((oldValue)=>{ registry?.deref?.()?.trigger?.(null, null, oldValue); });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (value) => {
                const oldValue = target.has(value) ? value : null;
                const result   = valueOrFx(value);
                registry?.deref()?.trigger?.(value, null, oldValue);
                return result;
            };
        }

        //
        if (name == "add") {
            return (value) => {
                const oldValue = target.has(value) ? value : null;
                const result   = valueOrFx(value);
                if (oldValue !== value) { registry?.deref()?.trigger?.(value, value, oldValue); };
                return result;
            };
        }

        //
        return valueOrFx;
    }

    // redirect to value key i
    has(target, prop: keyType) { if ((target = deref(target)) == null) return; return Reflect.has(target, prop); }
    apply(target, ctx, args) { if ((target = deref(target)) == null) return; return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { if ((target = deref(target)) == null) return; return Reflect.construct(target, args, newT); }
}

//
export class ReactiveObject {
    constructor() {}

    // supports nested "value" objects and values
    get(target, name: keyType, ctx) {
        const $reg = (subscriptRegistry).get(target);
        const registry = $reg ? new WeakRef($reg) : null;
        const sys = systemGet(target, name, registry); if (sys != null) return sys;

        // redirect to value key
        if ((target = deref(target, name == "value")) == null) return;
        if (name == Symbol.toPrimitive) { return () => {
            if (target?.value != null && (typeof target?.value != "object" && typeof target?.value != "string")) { return target.value; }
            return target?.[Symbol.toPrimitive]?.();
        }};
        if (name == "toString") { return () => (((typeof target?.value == "string") ? target?.value : target?.toString?.()) || ""); }
        if (name == "valueOf") { return () => { if (target?.value != null && (typeof target?.value != "object" && typeof target?.value != "string")) { return target.value; }; return target?.valueOf?.(); } }
        return bindCtx(target, Reflect.get(target, name, ctx));
    }

    //
    apply(target, ctx, args) { if ((target = deref(target)) == null) return; return Reflect.apply(target, ctx, args); }
    ownKeys(target) { if ((target = deref(target)) == null) return; return Reflect.ownKeys(target); }
    construct(target, args, newT) { if ((target = deref(target)) == null) return; return Reflect.construct(target, args, newT); }
    isExtensible(target) { if ((target = deref(target)) == null) return; return Reflect.isExtensible(target); }
    deleteProperty(target, name: keyType) {
        const registry = (subscriptRegistry).get(target);
        if ((target = deref(target)) == null) return;

        //
        const oldValue = target[name];
        const result = Reflect.deleteProperty(target, name);
        registry?.trigger?.(name, null, oldValue); return result;
    }

    //
    getOwnPropertyDescriptor(target, key) {
        if ((target = deref(target)) == null) return;
        return Reflect.getOwnPropertyDescriptor(target, key);
    }

    // supports nested "value" objects
    has(target, prop: keyType) { if ((target = deref(target)) == null) return; return Reflect.has(target, prop); }
    set(target, name: keyType, value) {
        const registry = (subscriptRegistry).get(target);
        if ((target = deref(target, name == "value")) == null) return;

        //
        const oldValue = target[name];
        const result = Reflect.set(target, name, value);
        if (oldValue !== value) { registry?.trigger?.(name, value, oldValue); };
        return result;
    }
}

//
export const makeReactiveObject: <T extends object>(map: T) => T = <T extends object>(obj: T) => { return (obj?.[$extractKey$] ? obj : wrapWith(obj, new ReactiveObject())); };
export const makeReactiveMap: <K, V>(map: Map<K, V>) => Map<K, V> = <K, V>(map: Map<K, V>) =>    { return (map?.[$extractKey$] ? map : wrapWith(map, new ReactiveMap())); };
export const makeReactiveSet: <V>(set: Set<V>) => Set<V> = <V>(set: Set<V>) =>                   { return (set?.[$extractKey$] ? set : wrapWith(set, new ReactiveSet())); };
