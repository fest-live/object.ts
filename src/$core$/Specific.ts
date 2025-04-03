import { $extractKey$, $originalKey$, $registryKey$, bindCtx, type keyType } from "./Keys";
import { deref, subscriptRegistry, wrapWith } from "./Subscript";

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
