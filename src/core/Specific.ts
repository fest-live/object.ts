import { subscribe, unsubscribe } from "./Mainline";
import { subscriptRegistry, wrapWith } from "./Subscript";
import { $extractKey$, $originalKey$, $registryKey$, $triggerLock, $triggerLess, $value, $trigger, $isNotEqual } from "../wrap/Symbol";
import { deref, type keyType, refValid } from "../wrap/Utils";
import { bindCtx, hasValue, isNotEqual, isPrimitive, makeTriggerLess, potentiallyAsync, potentiallyAsyncMap, tryParseByHint } from "fest/core";

// Safe getter with global re-entrancy guard to avoid recursive accessor loops
const __safeGetGuard = new WeakMap<any, Set<any>>();
export const safeGet = (obj: any, key: any, rec?: any) => {
    //const result = Reflect.get(obj, key, rec != null ? rec : obj);
    //return typeof result == "function" ? bindCtx(obj, result) : result;

    //
    if (obj == null) { return undefined; }
    let active = __safeGetGuard.get(obj);
    if (!active) { active = new Set(); __safeGetGuard.set(obj, active); }
    if (active.has(key)) { return null; }
    active.add(key);

    //
    let result = undefined;
    try {
        result = Reflect.get(obj, key, rec != null ? rec : obj);
    } catch (_e) {
        result = undefined;
    } finally {
        active.delete(key);
        if (active.size === 0) { __safeGetGuard.delete(obj); }
    }

    //
    return typeof result == "function" ? bindCtx(obj, result) : result;
}

// get reactive primitives (if native iterator is available, use it)
const systemGet = (target, name, registry)=>{
    if (target == null || isPrimitive(target)) { return target; }

    //
    const exists = ["deref", "bind", "@target", $originalKey$, $extractKey$, $registryKey$]?.indexOf(name) < 0 ? safeGet(target, name)?.bind?.(target) : null;
    if (exists != null) return null;

    //
    const $extK = [$extractKey$, $originalKey$];

    //
    if ($extK.indexOf(name) >= 0)     { return safeGet(target, name) ?? target; }
    if (name == $value)               { return safeGet(target, name) ?? safeGet(target, "value"); }
    if (name == $registryKey$)        { return registry; } // @ts-ignore
    if (name == Symbol.observable)    { return registry?.compatible; } // @ts-ignore
    if (name == Symbol.subscribe)     { return (cb, prop?)=>subscribe(prop != null ? [target, prop] : target, cb); }
    if (name == Symbol.iterator)      { return safeGet(target, name) ?? target; }
    if (name == Symbol.asyncIterator) { return safeGet(target, name) ?? target; }
    if (name == Symbol.dispose)       { return (prop?)=>{ safeGet(target, Symbol.dispose)?.(prop); unsubscribe(prop != null ? [target, prop] : target)}; }
    if (name == Symbol.asyncDispose)  { return (prop?)=>{ safeGet(target, Symbol.asyncDispose)?.(prop); unsubscribe(prop != null ? [target, prop] : target); } } // @ts-ignore
    if (name == Symbol.unsubscribe)   { return (prop?)=>unsubscribe(prop != null ? [target, prop] : target); }
    if (name == Symbol.toPrimitive)   { return (hint?)=>{
        if (typeof safeGet(target, Symbol.toPrimitive) == "function") { return safeGet(target, Symbol.toPrimitive)?.(hint); };
        if (safeGet(target, "value") != null && hasValue(target)) { return tryParseByHint(safeGet(target, "value"), hint); }
    } }
    if (name == Symbol.toStringTag) { return ()=>{
        if (typeof safeGet(target, Symbol.toStringTag) == "function") { return safeGet(target, Symbol.toStringTag)?.(); };
        if (safeGet(target, "value") != null && hasValue(target) && isPrimitive(safeGet(target, "value"))) { return String(safeGet(target, "value") ?? "") || ""; };
        return String(safeGet(target, "toString")?.() ?? safeGet(target, "valueOf")?.() ?? target);
    } }
}

//
const observableAPIMethods = (target, name, registry)=>{
    if (name == "subscribe") {
        return registry?.compatible?.[name] ?? ((handler)=>{
            if (typeof handler == "function") {
                return subscribe(target, handler);
            } else
            if ("next" in handler && handler?.next != null) {
                const usub = subscribe(target, handler?.next), comp = handler?.["complete"];
                handler["complete"] = (...args)=>{ usub?.(); return comp?.(...args); };
                return handler["complete"];
            }
        })
    }
}

//
export class ObserveArrayMethod {
    #name: string; #self: any; #handle: any;
    constructor(name, self, handle) {
        this.#name = name;
        this.#self = self;
        this.#handle = handle;
    }

    //
    get(target, name, rec) { return Reflect.get(target, name, rec); }
    apply(target, ctx, args) {
        let added: [number, any, any][] = [], removed: [number, any, any][] = [];
        let setPairs: [number, any, any][] = [];
        let oldState: any[] = [...this.#self];
        let idx: number = -1;

        // execute operation
        const result = Reflect.apply(target, ctx || this.#self, args);
        if (this.#handle?.[$triggerLock]) {
            if (Array.isArray(result)) { return makeReactiveArray(result); }
            return result;
        }

        //
        switch (this.#name) {
            case "push"   : idx = oldState?.length; added = args; break;
            case "unshift": idx = 0; added = args; break;
            case "pop":
                idx = oldState?.length - 1;
                if (oldState.length > 0) { removed = [[idx - 1, oldState[idx - 1], null]]; }
                break;
            case "shift":
                idx = 0;
                if (oldState.length > 0) removed = [[idx, oldState[idx], null]];
                break;
            case "splice":
                const [start, deleteCount, ...items] = args; idx = start;
                added = deleteCount > 0 ? items.slice(deleteCount) : [];

                // discount of replaced (assigned) elements
                removed = deleteCount > 0 ? oldState?.slice?.(items?.length + start, start + (deleteCount - (items?.length || 0))) : [];

                // fix index for remaining removed or added elements
                idx += (deleteCount || 0) - (items?.length || 1);

                // index assignment
                if (deleteCount > 0 && items?.length > 0) {
                    for (let i = 0; i < Math.min(deleteCount, items?.length ?? 0); i++) {
                        setPairs.push([start + i, items[i], oldState?.[start + i] ?? null]);
                    }
                }
                break;
            case "sort":
            case "fill":
            case "reverse":
            case "copyWithin":
                // compare old and new state, find changed elements
                idx = 0; for (let i = 0; i < oldState.length; i++) {
                    if (isNotEqual(oldState[i], this.#self[i]))
                        {
                            setPairs.push([idx+i, this.#self[i], oldState[i]]);
                        }
                }
                break;
            // index assignment, args: [value, index]
            case "set": idx = args[1];
            setPairs.push([idx, args[0], oldState?.[idx] ?? null]); break;
        }

        // triggers on adding
        const reg = subscriptRegistry.get(this.#self);
        if (added?.length == 1) {
            reg?.trigger?.(idx, added[0], null, "@add");
        } else if (added?.length > 1) {
            reg?.trigger?.(idx, added, null, "@addAll");
            added.forEach((item, I)=>reg?.trigger?.(idx+I, item, null, "@add"));
        }

        // triggers on changing
        if (setPairs?.length == 1) {
            reg?.trigger?.(setPairs[0]?.[0] ?? idx, setPairs[0]?.[1], setPairs[0]?.[2], "@set");
        } else if (setPairs?.length > 1) {
            reg?.trigger?.(idx, setPairs, oldState, "@setAll");
            setPairs.forEach((pair, I)=>reg?.trigger?.(pair?.[0] ?? idx+I, pair?.[1], pair?.[2], "@set"));
        }

        // triggers on removing
        if (removed?.length == 1) {
            reg?.trigger?.(idx, null, removed[0], "@remove");
        } else if (removed?.length > 1) {
            reg?.trigger?.(idx, null, removed, "@removeAll");
            removed.forEach((item, I)=>reg?.trigger?.(idx+I, null, item, "@remove"));
        }

        //
        if (result == target) { return new Proxy(result as any, this.#handle); };
        if (Array.isArray(result)) { return makeReactiveArray(result); }
        return result;
    }
}



//
const triggerWhenLengthChange = (self, target, oldLen, newLen)=>{
    const removedItems = (Number.isInteger(oldLen) && Number.isInteger(newLen) && newLen < oldLen) ? target.slice(newLen, oldLen) : [];
    if (!self[$triggerLock] && oldLen !== newLen) {
        const registry = (subscriptRegistry).get(target);

        // emit removals if shrunk
        if (removedItems.length === 1) {
            registry?.trigger?.(newLen, null, removedItems[0], "@remove");
        } else if (removedItems.length > 1) {
            registry?.trigger?.(newLen, null, removedItems, "@removeAll");
            removedItems.forEach((item, I) => registry?.trigger?.(newLen + I, null, item, "@remove"));
        }

        // emit additions if grown (holes are considered added undefined entries)
        const addedCount = (Number.isInteger(oldLen) && Number.isInteger(newLen) && newLen > oldLen)
            ? (newLen - oldLen) : 0;
        if (addedCount === 1) {
            registry?.trigger?.(oldLen, undefined, null, "@add");
        } else if (addedCount > 1) {
            const added = Array(addedCount).fill(undefined);
            registry?.trigger?.(oldLen, added, null, "@addAll");
            added.forEach((_, I) => registry?.trigger?.(oldLen + I, undefined, null, "@add"));
        }
    }
}



//
export class ReactiveArray {
    [$triggerLock]?: boolean;
    constructor() {
    }

    //
    has(target, name) { return Reflect.has(target, name); }

    // TODO: some target with target[n] may has also reactive target[n]?.value, which (sometimes) needs to observe too...
    // TODO: also, subscribe can't be too simply used more than once...
    get(target, name, rec) {
        if ([$extractKey$, $originalKey$, "@target", "deref"].indexOf(name) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ? safeGet(target, name)?.bind?.(target) : safeGet(target, name);
        };

        //
        const registry = (subscriptRegistry).get(target);
        const sys = systemGet(target, name, registry); if (sys != null) return sys;
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        //
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) { return (key = 0)=>{ return (subscriptRegistry).get(target)?.trigger?.(key, safeGet(target, key), safeGet(target, key), "@set"); }; }
        if (name == "@target" || name == $extractKey$) return target;

        // that case: target[n]?.(?{.?value})?
        const got = safeGet(target, name) ?? (name == "value" ? safeGet(target, $value) : null);
        if (typeof got == "function") { return new Proxy(typeof got == "function" ? got?.bind?.(target) : got, new ObserveArrayMethod(name, target, this)); };
        return got;
    }

    //
    set(target, name, value) {
        if (typeof name != "symbol") {
            // handle Array.length explicitly before numeric index normalization
            if (Number.isInteger(parseInt(name))) { name = parseInt(name) ?? name; };
        }

        //
        if (name == $triggerLock && value) { this[$triggerLock] = !!value; return true; }
        if (name == $triggerLock && !value) { delete this[$triggerLock]; return true; }

        // array property changes
        const old = safeGet(target, name);
        const got = Reflect.set(target, name, value);

        // bit different trigger rules
        if (name == "length") {
            if (isNotEqual(old, value)) {
                triggerWhenLengthChange(this, target, old, value);
            }
        }

        //
        if (!this[$triggerLock] && typeof name != "symbol" && isNotEqual(old, value)) {
            (subscriptRegistry)?.get?.(target)?.trigger?.(name, value, old, typeof name == "number" ? "@set" : null);
        }

        //
        return got;
    }

    //
    deleteProperty(target, name) {
        if (typeof name != "symbol") {
            // handle Array.length explicitly before numeric index normalization
            if (Number.isInteger(parseInt(name))) { name = parseInt(name) ?? name; };
        }

        //
        if (name == $triggerLock) { delete this[$triggerLock]; return true; }

        //
        const old = safeGet(target, name);
        const got = Reflect.deleteProperty(target, name);

        //
        if (!this[$triggerLock] && (name != "length" && name != $triggerLock && typeof name != "symbol")) {
            if (old != null) {
                (subscriptRegistry).get(target)?.trigger?.(name, name, old, typeof name == "number" ? "@delete" : null);
            }
        }

        //
        return got;
    }
}

//
export class ReactiveObject {
    [$triggerLock]?: boolean;
    constructor() {}

    // supports nested "value" objects and values
    get(target, name: keyType, ctx) {
        if ([$extractKey$, $originalKey$, "@target", "deref"].indexOf(name as any) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ? bindCtx(target, safeGet(target, name)) : safeGet(target, name);
        };

        //
        const registry = (subscriptRegistry).get(target);
        const sys = systemGet(target, name, registry); if (sys != null) return sys;
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        // drop into value if has
        if (safeGet(target, name) == null && name != "value" && hasValue(target) && (typeof safeGet(target, "value") == "object" || typeof safeGet(target, "value") == "function") && safeGet(target, "value") != null && safeGet(safeGet(target, "value"), name) != null) {
            target = safeGet(target, "value");
        }

        //
        // redirect to value key
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) { return (key = "value")=>{ return (subscriptRegistry).get(target)?.trigger?.(key, safeGet(target, key), safeGet(target, key)); }; }

        //
        if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) { return safeGet(target, name); }
        if (name == Symbol.toPrimitive) { return (hint?)=>{
            if (isPrimitive(safeGet(target, "value")) && hasValue(target))
                { return tryParseByHint(safeGet(target, "value"), hint); };
            return tryParseByHint(safeGet(target, Symbol.toPrimitive)?.(), hint);
        }}
        if (name == "toString") { return () => { if (isPrimitive(safeGet(target, "value"))) { return String(safeGet(target, "value") ?? "") || ""; }; return target?.toString?.(); } }
        if (name == "valueOf" ) { return () => { if (isPrimitive(safeGet(target, "value"))) { return tryParseByHint(safeGet(target, "value")); }; return tryParseByHint(safeGet(target, "valueOf")?.()); } }

        //
        return safeGet(target, name) ?? (name == "value" ? safeGet(target, $value) : safeGet(target, name));
    }

    //
    apply(target, ctx, args) { return Reflect.apply(target, ctx, args); }
    ownKeys(target) { return Reflect.ownKeys(target); }
    construct(target, args, newT) { return Reflect.construct(target, args, newT); }
    isExtensible(target) { return Reflect.isExtensible(target); }

    //
    getOwnPropertyDescriptor(target, key) {
        return Reflect.getOwnPropertyDescriptor(target, key);
    }

    // supports nested "value" objects
    has(target, prop: keyType) { return (prop in target); }
    set(target, name: keyType, value) {
        return potentiallyAsync(value, (v)=>{
            if (name == $triggerLock && value) { this[$triggerLock] = !!value; return true; }
            if (name == $triggerLock && !value) { delete this[$triggerLock]; return true; }

            // drop into value if has
            const $original = target;
            if (safeGet(target, name) == null && name != "value" && hasValue(target) && (typeof safeGet(target, "value") == "object" || typeof safeGet(target, "value") == "function") && safeGet(target, "value") != null && safeGet(safeGet(target, "value"), name) != null) {
                target = safeGet(target, "value");
            }

            //
            if (typeof name == "symbol" && !(safeGet(target, name) != null && name in target)) return;
            const oldValue = name == "value" ? (safeGet(target, $value) ?? safeGet(target, name)) : safeGet(target, name); target[name] = v; const newValue = safeGet(target, name) ?? v;
            if (!this[$triggerLock] && typeof name != "symbol" && (safeGet(target, $isNotEqual) ?? isNotEqual)?.(oldValue, newValue)) {
                (subscriptRegistry)?.get?.($original)?.trigger?.(name, v, oldValue);
            };
            return true;
        })
    }

    //
    deleteProperty(target, name: keyType) {
        if (name == $triggerLock) { delete this[$triggerLock]; return true; }

        //
        const oldValue = safeGet(target, name);
        const result = Reflect.deleteProperty(target, name);

        //
        if (!this[$triggerLock] && (name != $triggerLock && typeof name != "symbol")) { (subscriptRegistry).get(target)?.trigger?.(name, null, oldValue); }
        return result;
    }
}




//
export class ReactiveMap {
    constructor() { }

    //
    get(target, name: keyType, ctx) {
        if ([$extractKey$, $originalKey$, "@target", "deref"].indexOf(name as any) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ?
                bindCtx(target, safeGet(target, name)) : safeGet(target, name);
        };

        //
        const registry = (subscriptRegistry).get(target);
        const sys = systemGet(target, name, registry); if (sys != null) return sys;
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        //
        const tp = (safeGet(target, $extractKey$) ?? safeGet(target, $originalKey$) ?? target);
        const valueOrFx = bindCtx(tp, /*Reflect.get(, name, ctx)*/safeGet(tp, name));
        if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) { return valueOrFx; }

        //
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) { return (key)=>{ if (key != null) { return (subscriptRegistry).get(target)?.trigger?.(key, target?.get?.(key), target?.get?.(key), "@set"); } }; }

        //
        if (name == "clear") {
            return () => {
                const oldValues: any = Array.from(target?.entries?.() || []), result = valueOrFx();
                oldValues.forEach(([prop, oldValue])=>{
                    if (!this[$triggerLock] && oldValue) { (subscriptRegistry).get(target)?.trigger?.(prop, null, oldValue); }
                });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (prop, _ = null) => {
                const oldValue = target.get(prop), result = valueOrFx(prop);
                if (!this[$triggerLock] && oldValue) { (subscriptRegistry).get(target)?.trigger?.(prop, null, oldValue); }
                return result;
            };
        }

        //
        if (name == "set") {
            return (prop, value) => potentiallyAsyncMap(value, (v)=>{
                const oldValue = target.get(prop), result = valueOrFx(prop, value);
                if (isNotEqual(oldValue, result)) { if (!this[$triggerLock]) { (subscriptRegistry).get(target)?.trigger?.(prop, result, oldValue); } };
                return result;
            });
        }

        //
        return valueOrFx;
    }

    //
    set(target, name: keyType, value) {
        if (name == $triggerLock) { this[$triggerLock] = !!value; return true; }
        if (name == $triggerLock && !value) { delete this[$triggerLock]; return true; };
        return Reflect.set(target, name, value);
    }

    // redirect to value key
    has(target, prop: keyType) { return Reflect.has(target, prop); }
    apply(target, ctx, args) { return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { return Reflect.construct(target, args, newT); }
    ownKeys(target) { return Reflect.ownKeys(target); }
    isExtensible(target) { return Reflect.isExtensible(target); }
    getOwnPropertyDescriptor(target, key) {
        return Reflect.getOwnPropertyDescriptor(target, key);
    }

    //
    deleteProperty(target, name: keyType) {
        if (name == $triggerLock) { delete this[$triggerLock]; return true; }
        const result = Reflect.deleteProperty(target, name);
        return result;
    }
}

//
export class ReactiveSet {
    [$triggerLock]?: boolean = false;
    constructor() {}

    //
    get(target, name: keyType, ctx) {
        if ([$extractKey$, $originalKey$, "@target", "deref"].indexOf(name as any) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ? bindCtx(target, safeGet(target, name)) : safeGet(target, name);
        };

        //
        const registry = (subscriptRegistry).get(target);
        const sys = systemGet(target, name, registry); if (sys != null) return sys;
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        // redirect to value key
        const tp = (safeGet(target, $extractKey$) ?? safeGet(target, $originalKey$) ?? target);
        const valueOrFx = bindCtx(tp, /*Reflect.get(, name, ctx)*/safeGet(tp, name));
        if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) { return valueOrFx; }

        //
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) { return (key)=>{ if (key != null) { return (subscriptRegistry).get(target)?.trigger?.(key, target?.has?.(key), target?.has?.(key)); } }; }

        //
        if (name == "clear") {
            return () => {
                const oldValues = Array.from(target?.values?.() || []), result = valueOrFx();
                oldValues.forEach((oldValue)=>{ if (!this[$triggerLock] && oldValue) { (subscriptRegistry).get(target)?.trigger?.(null, null, oldValue); } });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (value) => {
                const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
                if (!this[$triggerLock] && oldValue) { (subscriptRegistry).get(target)?.trigger?.(value, null, oldValue); }
                return result;
            };
        }

        //
        if (name == "add") {
            // TODO: add potentially async set
            return (value) => {
                const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
                if (isNotEqual(oldValue, value)) { if (!this[$triggerLock] && !oldValue) { (subscriptRegistry).get(target)?.trigger?.(value, value, oldValue); } };
                return result;
            };
        }

        //
        return valueOrFx;
    }

    //
    set(target, name: keyType, value) {
        if (name == $triggerLock && value) { this[$triggerLock] = !!value; return true; }
        if (name == $triggerLock && !value) { delete this[$triggerLock]; return true; }
        return Reflect.set(target, name, value);
    }

    // redirect to value key i
    has(target, prop: keyType) { return Reflect.has(target, prop); }
    apply(target, ctx, args) { return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { return Reflect.construct(target, args, newT); }
    ownKeys(target) { return Reflect.ownKeys(target); }
    isExtensible(target) { return Reflect.isExtensible(target); }
    getOwnPropertyDescriptor(target, key) {
        return Reflect.getOwnPropertyDescriptor(target, key);
    }

    //
    deleteProperty(target, name: keyType) {
        if (name == $triggerLock) { delete this[$triggerLock]; return true; }
        const result = Reflect.deleteProperty(target, name);
        return result;
    }
}

//
export const makeReactiveArray  = <Under = any>(arr: Under[]): refValid<Under> => { return (arr?.[$extractKey$] ? arr : wrapWith(arr, new ReactiveArray())); };
export const makeReactiveObject = <Under = any>(obj: Under): refValid<Under> => { return (obj?.[$extractKey$] ? obj : wrapWith(obj, new ReactiveObject())); };
export const makeReactiveMap    = <Under = any, K = any>(map: Map<K, Under>): refValid<Under> => { return (map?.[$extractKey$] ? map : wrapWith(map, new ReactiveMap())); };
export const makeReactiveSet    = <Under = any, K = any>(set: Set<Under>): refValid<Under> => { return (set?.[$extractKey$] ? set : wrapWith(set, new ReactiveSet())); };
