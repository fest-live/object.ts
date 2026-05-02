/**
 * Concrete proxy handlers for arrays, objects, maps, and sets.
 *
 * This is the low-level implementation layer that intercepts reads/writes,
 * translates native collection operations into normalized trigger events, and
 * exposes the observable protocol used by `observe()`.
 */
import { affected, unaffected } from "./Mainline";
import { subscriptRegistry, wrapWith } from "./Subscript";
import { $extractKey$, $originalKey$, $registryKey$, $triggerLock, $triggerLess, $triggerControl, $value, $trigger, $isNotEqual, $affected, $realProp } from "../wrap/Symbol";
import type { keyType, MapLike, observeValid, SetLike } from "../wrap/Utils";
import { bindCtx, hasValue, isNotEqual, isPrimitive, makeTriggerLess, potentiallyAsync, potentiallyAsyncMap, tryParseByHint } from "fest/core";

//
const __systemSkip = new Set<any>([
    Symbol.toStringTag,
    Symbol.iterator,
    Symbol.asyncIterator,
    Symbol.toPrimitive,

    "toString",
    "valueOf",
    "inspect",          // node
    "constructor",
    "__proto__",
    "prototype",
    "then",
    "catch",
    "finally",
    "next"
]);

//
const systemSkipGet = (target: any, name: any) => {
    if (!__systemSkip.has(name)) return null;
  
    // important: not undefined, but a genuine access
    const got = safeGet(target, name);
    return (typeof got === "function") ? bindCtx(target, got) : got;
};

//
const __safeGetGuard = new WeakMap<any, Set<any>>();
function isGetter(obj, propName) {
    let got = true;
    try { // @ts-ignore
        __safeGetGuard?.getOrInsert?.(obj, new Set())?.add?.(propName);
        if (__safeGetGuard?.get?.(obj)?.has?.(propName)) { got = true; }
        const descriptor = Reflect.getOwnPropertyDescriptor(obj, propName);
        got = (typeof descriptor?.get == "function");
    } catch (e) {
        got = true;
    } finally {
        __safeGetGuard?.get?.(obj)?.delete?.(propName);
    }
    return got;
}

/** Follow `.value` chains when a wrapper stores the actual object one level deeper. */
export const fallThrough = (obj: any, key: any) => {
    if (isPrimitive(obj)) return obj;

    //
    const value = safeGet(obj, key);
    if (value == null && key != "value") {
        const tmp = safeGet(obj, "value");
        if (tmp != null && !isPrimitive(tmp))
            { return fallThrough(tmp, key); } else
            { return value; };
    } else
        // temp-fix: functions isn't supported correctly
        if (key == "value" && value != null && !isPrimitive(value) && (typeof value != "function")) {
            return fallThrough(value, key) ?? value ?? obj;
        }
    return value ?? obj;
}

/** Safe setter with re-entrancy protection to avoid recursive accessor loops. */
export const safeSet = <T = any>(obj: any, key: any, value: T): boolean => {
    if (obj == null) { return false; }

    // @ts-ignore
    let active = __safeSetGuard.getOrInsert(obj, new Set());
    if (active?.has?.(key)) { return false; }
    active?.add?.(key);
    return Reflect.set(obj, key, value);
}

/** Safe getter with re-entrancy protection to avoid recursive accessor loops. */
export const safeGet = <T = any>(obj: any, key: any, rec?: any): T | undefined | null => {
    //const result = Reflect.get(obj, key, rec != null ? rec : obj);
    //return typeof result == "function" ? bindCtx(obj, result) : result;

    //
    let result = undefined;
    if (obj == null) { return obj; }

    // @ts-ignore
    let active = __safeGetGuard.getOrInsert(obj, new Set());
    if (active?.has?.(key)) { return null; }

    // directly return if not a getter
    if (!isGetter(obj, key)) {
        result ??= Reflect.get(obj, key, rec != null ? rec : obj);
    } else {
        active?.add?.(key);

        //
        try {
            result = Reflect.get(obj, key, rec != null ? rec : obj);
        } catch (_e) {
            result = undefined;
        } finally {
            active.delete(key);
            if (active?.size === 0) { __safeGetGuard?.delete?.(obj); }
        }
    }

    //
    return typeof result == "function" ? bindCtx(obj, result) : result;
}

type TriggerEmitOptions = {
    key?: keyType | null;
    name?: keyType | null;
    value?: any;
    oldValue?: any;
    old?: any;
    op?: string | null;
    trigger?: string | null;
};
const hasOwn = (obj: any, key: keyType) => Object.prototype.hasOwnProperty.call(obj, key);
const isTriggerEmitOptions = (value: any, allowValueOnly = false): value is TriggerEmitOptions => {
    return !!value && typeof value == "object" && !Array.isArray(value) && (
        hasOwn(value, "key") ||
        hasOwn(value, "name") ||
        hasOwn(value, "oldValue") ||
        hasOwn(value, "old") ||
        hasOwn(value, "op") ||
        hasOwn(value, "trigger") ||
        (allowValueOnly && hasOwn(value, "value"))
    );
}
const triggerOptionValue = (options: TriggerEmitOptions, key: "value" | "oldValue", fallback: () => any) => {
    if (hasOwn(options, key)) return options[key];
    if (key == "oldValue" && hasOwn(options, "old")) return options.old;
    return fallback();
}
const isRuntimeKey = (key: any): key is keyType => typeof key == "string" || typeof key == "number" || typeof key == "symbol";
const realPropOf = (target: any): keyType | null => {
    const prop = safeGet(target, $realProp) ?? safeGet(target, "realProp");
    return isRuntimeKey(prop) ? prop : null;
}
const triggerKeyOf = (target: any, key: keyType | null): keyType | null => key == "value" ? (realPropOf(target) ?? key) : key;
const triggerValueOf = (target: any, key: keyType | null) => {
    const realProp = realPropOf(target);
    if (realProp != null && key == realProp) return safeGet(target, "value") ?? safeGet(target, $value) ?? safeGet(target, key);
    return key == null ? undefined : safeGet(target, key);
}
const createTriggerAPI = (registry: any, emit: (options: TriggerEmitOptions) => any) => {
    const api: any = (key?: any, opOrOptions?: string | null | TriggerEmitOptions, trigger?: string | null) => {
        const options: TriggerEmitOptions = isTriggerEmitOptions(key)
            ? key
            : isTriggerEmitOptions(opOrOptions, true)
                ? { ...opOrOptions, key }
                : { key, op: opOrOptions as string | null, trigger };
        return emit(options);
    };

    const control = registry?.triggerControl;
    if (control) Object.assign(api, control);
    api.custom = (trigger: string, key?: keyType | null, op: string | null = "@custom", value?: any, oldValue?: any) => api({ key, op, trigger, value, oldValue });
    return api;
}

// get reactive primitives (if native iterator is available, use it)
const systemGet = (target: any, name: any, registry: any)=>{
    if (target == null || isPrimitive(target)) { return target; }

    //
    const exists = ["deref", "bind", "@target", $originalKey$, $extractKey$, $registryKey$]?.indexOf(name as any) < 0 ? safeGet(target, name as any)?.bind?.(target) : null;
    if (exists != null) return null;

    //
    const $extK = [$extractKey$, $originalKey$];

    //
    if ($extK.indexOf(name as any) >= 0) { return safeGet(target, name as any) ?? target; }
    if (name == $value)               { return safeGet(target, name) ?? safeGet(target, "value"); }
    if (name == $registryKey$)        { return registry; } // @ts-ignore
    if (name == $triggerControl)      { return registry?.triggerControl; }
    if (name == (Symbol as any).observable) { return registry?.compatible; }
    if (name == (Symbol as any).subscribe)  { return (cb, prop?, options?)=>affected(prop != null ? [target, prop] : target, cb, options); }
    if (name == Symbol.iterator)      { return safeGet(target, name as any); }
    if (name == Symbol.asyncIterator) { return safeGet(target, name as any); }
    if (name == Symbol.dispose)       { return (prop?)=>{ safeGet(target, Symbol.dispose)?.(prop); unaffected(prop != null ? [target, prop] : target)}; }
    if (name == Symbol.asyncDispose)  { return (prop?)=>{ safeGet(target, Symbol.asyncDispose)?.(prop); unaffected(prop != null ? [target, prop] : target); } } // @ts-ignore
    if (name == Symbol.unsubscribe)   { return (prop?)=>unaffected(prop != null ? [target, prop] : target); }
    if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) { return safeGet(target, name); }

    /*
    if (name == Symbol.toPrimitive)   { return (hint?)=>{
        if (typeof safeGet(target, name) == "function") { return safeGet(target, name)?.(hint); };
        if (safeGet(target, "value") != null && hasValue(target)) { return tryParseByHint(safeGet(target, "value"), hint); }
    } }
    if (name == Symbol.toStringTag) { return ()=>{
        if (typeof safeGet(target, name) == "function") { return safeGet(target, name)?.(); };
        if (safeGet(target, "value") != null && hasValue(target) && isPrimitive(safeGet(target, "value"))) { return String(safeGet(target, "value") ?? "") || ""; };
        return String(safeGet(target, "toString")?.() ?? safeGet(target, "valueOf")?.() ?? target);
    } }*/
}

//
const observableAPIMethods = (target, name, registry)=>{
    if (name == "subscribe") {
        return registry?.compatible?.[name] ?? ((handler)=>{
            if (typeof handler == "function") {
                return affected(target, handler);
            } else
            if ("next" in handler && handler?.next != null) {
                const usub = affected(target, handler?.next), comp = handler?.["complete"];
                handler["complete"] = (...args)=>{ usub?.(); return comp?.(...args); };
                return handler["complete"];
            }
        })
    }
}

/** Wrap mutating array methods so they emit normalized add/set/delete events. */
export class ObserveArrayMethod {
    #name: string; #self: any; #handle: any;
    constructor(name, self, handle) {
        this.#name = name;
        this.#self = self;
        this.#handle = handle;
    }

    //
    get(target, name, rec) {
        const skip = systemSkipGet(target, name);
        if (skip != null) { return skip; }
        return Reflect.get(target, name, rec);
    }

    //
    apply(target, ctx, args) {
        let added: [number, any, any][] = [], removed: [number, any, any][] = [];
        let setPairs: [number, any, any][] = [];
        let oldState: any[] = [...this.#self];
        let idx: number = -1;

        // execute operation
        const result = Reflect.apply(target, ctx || this.#self, args);
        if (this.#handle?.[$triggerLock]) {
            if (Array.isArray(result)) { return observeArray(result); }
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
            reg?.trigger?.(idx, added[0], null, added[0] == null ? "@add" : "@set");
        } else if (added?.length > 1) {
            reg?.trigger?.(idx, added, null, "@addAll");
            added.forEach((item, I)=>reg?.trigger?.(idx+I, item, null, item == null ? "@add" : "@set"));
        }

        // triggers on changing
        if (setPairs?.length == 1) {
            reg?.trigger?.(setPairs[0]?.[0] ?? idx, setPairs[0]?.[1], setPairs[0]?.[2], setPairs[0]?.[2] == null ? "@add" : "@set");
        } else if (setPairs?.length > 1) {
            reg?.trigger?.(idx, setPairs, oldState, "@setAll");
            setPairs.forEach((pair, I)=>reg?.trigger?.(pair?.[0] ?? idx+I, pair?.[1], pair?.[2], pair?.[2] == null ? "@add" : "@set"));
        }

        // triggers on removing
        if (removed?.length == 1) {
            reg?.trigger?.(idx, null, removed[0], removed[0] == null ? "@add" : "@delete");
        } else if (removed?.length > 1) {
            reg?.trigger?.(idx, null, removed, "@clear");
            removed.forEach((item, I)=>reg?.trigger?.(idx+I, null, item, item == null ? "@add" : "@delete"));
        }

        //
        if (result == target) { return new Proxy(result as any, this.#handle); };
        if (Array.isArray(result)) { return observeArray(result); }
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
            registry?.trigger?.(newLen, null, removedItems[0], "@delete");
        } else if (removedItems.length > 1) {
            registry?.trigger?.(newLen, null, removedItems, "@clear");
            removedItems.forEach((item, I) => registry?.trigger?.(newLen + I, null, item, "@delete"));
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



/** Proxy handler for observable arrays, including index writes and mutation methods. */
export class ObserveArrayHandler {
    [$triggerLock]?: boolean;
    constructor() {
    }

    //
    has(target, name) { return Reflect.has(target, name); }

    // TODO: some target with target[n] may has also reactive target[n]?.value, which (sometimes) needs to observe too...
    // TODO: also, subscribe can't be too simply used more than once...
    get(target, name, rec) {
        const skip = systemSkipGet(target, name);
        if (skip != null) { return skip; }

        //
        if ([$extractKey$, $originalKey$, "@target", "deref"].indexOf(name as any) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ? safeGet(target, name)?.bind?.(target) : safeGet(target, name);
        };

        //
        const registry = (subscriptRegistry)?.get?.(target);
        const sys = systemGet(target, name, registry); if (sys != null) return sys;
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        //
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) {
            return createTriggerAPI(registry, (options) => {
                const key = options.key ?? options.name ?? 0;
                const value = triggerOptionValue(options, "value", () => safeGet(target, key));
                const oldValue = triggerOptionValue(options, "oldValue", () => undefined);
                return registry?.trigger?.(key, value, oldValue, options.op === undefined ? "@invalidate" : options.op, options.trigger ?? "manual");
            });
        }

        //
        if (name == "@target" || name == $extractKey$) return target;

        //
        if (name == "x") { return () => { return target?.x ?? target?.[0]; }; };
        if (name == "y") { return () => { return target?.y ?? target?.[1]; }; };
        if (name == "z") { return () => { return target?.z ?? target?.[2]; }; };
        if (name == "w") { return () => { return target?.w ?? target?.[3]; }; };

        //
        if (name == "r") { return () => { return target?.r ?? target?.[0]; }; };
        if (name == "g") { return () => { return target?.g ?? target?.[1]; }; };
        if (name == "b") { return () => { return target?.b ?? target?.[2]; }; };
        if (name == "a") { return () => { return target?.a ?? target?.[3]; }; };

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

        //
        const xyzw = ["x", "y", "z", "w"];
        const rgba = ["r", "g", "b", "a"];

        //
        const xyzw_idx = xyzw.indexOf(name);
        const rgba_idx = rgba.indexOf(name);

        //
        let got = false;
        if (xyzw_idx >= 0) { got = Reflect.set(target, xyzw_idx, value); } else
        if (rgba_idx >= 0) { got = Reflect.set(target, rgba_idx, value); } else
        { got = Reflect.set(target, name, value); }

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

/** Proxy handler for observable objects and ref-like `{ value }` containers. */
export class ObserveObjectHandler<T=any> {
    [$triggerLock]?: boolean;
    constructor() {}

    // supports nested "value" objects and values
    get(target, name: keyType, ctx) {
        if ([$extractKey$, $originalKey$, "@target", "deref", "then", "catch", "finally"].indexOf(name as any) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ? bindCtx(target, safeGet(target, name)) : safeGet(target, name);
        };

        //
        const registry = (subscriptRegistry).get(target) ?? subscriptRegistry.get(safeGet(target, "value") ?? target);
        const sys = systemGet(target, name, registry); if (sys != null) return sys;

        // drop into value if has
        if (safeGet(target, name) == null &&
            name != "value" && hasValue(target) &&
            safeGet(target, "value") != null &&
            (
                typeof safeGet(target, "value") == "object" ||
                typeof safeGet(target, "value") == "function"
            ) &&
            safeGet(safeGet(target, "value"), name) != null
        ) {
            target = safeGet(target, "value") ?? target;
        }

        //
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        //
        // redirect to value key
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) {
            return createTriggerAPI(registry, (options) => {
                const key = triggerKeyOf(target, options.key ?? options.name ?? realPropOf(target) ?? "value");
                const value = triggerOptionValue(options, "value", () => triggerValueOf(target, key));
                const oldValue = triggerOptionValue(options, "oldValue", () => key == "value" || key == realPropOf(target) ? safeGet(target, $value) : undefined);
                return registry?.trigger?.(key, value, oldValue, options.op === undefined ? "@invalidate" : options.op, options.trigger ?? "manual");
            });
        }

        //
        if (name == Symbol.toPrimitive) {
            return (hint?) => {
                const ft = fallThrough(target, name);
                if (safeGet(ft, name)) return safeGet(ft, name)?.(hint);
                if (isPrimitive(ft)) return tryParseByHint(ft, hint);
                if (isPrimitive(safeGet(ft, "value"))) return tryParseByHint(safeGet(ft, "value"), hint);
                return tryParseByHint(safeGet(ft, "value") ?? ft, hint);
            }
        }

        //
        if (name == Symbol.toStringTag) {
            return () => {
                const ft = fallThrough(target, name);
                if (safeGet(ft, name)) return safeGet(ft, name)?.();
                if (isPrimitive(ft)) return String(ft ?? "") || "";
                if (isPrimitive(safeGet(ft, "value"))) return String(safeGet(ft, "value") ?? "") || "";
                return String(safeGet(ft, "value") ?? ft ?? "") || "";
            }
        }

        //
        if (name == "toString") {
            return () => {
                const ft = fallThrough(target, name);
                if (safeGet(ft, name)) return safeGet(ft, name)?.();
                if (safeGet(ft, Symbol.toStringTag)) return safeGet(ft, Symbol.toStringTag)?.();
                if (isPrimitive(ft)) return String(ft ?? "") || "";
                if (isPrimitive(safeGet(ft, "value"))) return String(safeGet(ft, "value") ?? "") || "";
                return String(safeGet(ft, "value") ?? ft ?? "") || "";
            }
        }

        //
        if (name == "valueOf") {
            return () => {
                const ft = fallThrough(target, name);
                if (safeGet(ft, name)) return safeGet(ft, name)?.();
                if (safeGet(ft, Symbol.toPrimitive)) return safeGet(ft, Symbol.toPrimitive)?.();
                if (isPrimitive(ft)) return ft;
                if (isPrimitive(safeGet(ft, "value"))) return safeGet(ft, "value");
                return safeGet(ft, "value") ?? ft;
            }
        }

        //
        if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) { return safeGet(target, name); }

        //
        return fallThrough(target, name);
    }

    //
    apply(target, ctx, args) { return Reflect.apply(target, ctx, args); }
    ownKeys(target) { return Reflect.ownKeys(target); }
    construct(target, args, newT) { return Reflect.construct(target, args, newT); }
    isExtensible(target) { return Reflect.isExtensible(target); }

    //
    getOwnPropertyDescriptor(target, key) {
        let got: TypedPropertyDescriptor<any> | undefined = undefined;
        try { // @ts-ignore
            __safeGetGuard?.getOrInsert?.(target, new Set())?.add?.(key);
            if (__safeGetGuard?.get?.(target)?.has?.(key)) { got = undefined; }
            got = Reflect.getOwnPropertyDescriptor(target, key);
        } catch (e) {
            got = undefined;
        } finally {
            __safeGetGuard?.get?.(target)?.delete?.(key);
        }
        return got;
    }

    // supports nested "value" objects
    has(target, prop: keyType) { return (prop in target); }
    set(target, name: keyType, value) {
        const skip = systemSkipGet(target, name);
        if (skip != null) return skip;

        //
        return potentiallyAsync(value, (v) => {
            const skip = systemSkipGet(v, name);
            if (skip != null) return skip;
    
            //
            if (name == $triggerLock && value) { this[$triggerLock] = !!value; return true; }
            if (name == $triggerLock && !value) { delete this[$triggerLock]; return true; }

            // drop into value if has
            const $original = target;

            // drop into value if has
            if (safeGet(target, name) == null &&
                name != "value" && hasValue(target) &&
                safeGet(target, "value") != null &&
                (
                    typeof safeGet(target, "value") == "object" ||
                    typeof safeGet(target, "value") == "function"
                ) &&
                safeGet(safeGet(target, "value"), name) != null
            ) {
                target = safeGet(target, "value") ?? target;
            }

            //
            if (typeof name == "symbol" && !(safeGet(target, name) != null && name in target)) return;
            const triggerName = triggerKeyOf(target, name);
            const oldValue = name == "value" ? (safeGet(target, $value) ?? safeGet(target, name)) : safeGet(target, name); target[name] = v; const newValue = safeGet(target, name) ?? v;
            if (!this[$triggerLock] && typeof name != "symbol" && (safeGet(target, $isNotEqual) ?? isNotEqual)?.(oldValue, newValue)) {
                const subscript = subscriptRegistry.get(target) ?? subscriptRegistry.get($original);
                subscript?.trigger?.(triggerName, v, oldValue);
            };
            return true;
        })
    }

    //
    defineProperty(target, name: keyType, descriptor: PropertyDescriptor) {
        const skip = systemSkipGet(target, name);
        if (skip != null) return skip;

        //
        if (name == $triggerLock && descriptor.value) { this[$triggerLock] = !!descriptor.value; return true; }
        if (name == $triggerLock && !descriptor.value) { delete this[$triggerLock]; return true; }

        // drop into value if has
        if (safeGet(target, name) == null &&
            name != "value" && hasValue(target) &&
            safeGet(target, "value") != null &&
            (
                typeof safeGet(target, "value") == "object" ||
                typeof safeGet(target, "value") == "function"
            ) &&
            safeGet(safeGet(target, "value"), name) != null
        ) {
            target = safeGet(target, "value") ?? target;
        }
        
        //
        if (descriptor.get == undefined && descriptor.set == undefined) {
            return Reflect.defineProperty(target, name, descriptor);
        }

        // port old value to newer
        const oldValue = safeGet(target, name) as T;

        // re-define property
        const $result = Reflect.defineProperty(target, name, {
            get: descriptor.get,
            set: descriptor.set,
            enumerable: descriptor.enumerable ?? true,
            configurable: descriptor.configurable ?? true,
        });

        //
        safeSet(target, name, oldValue as T);
        return $result;
    }

    //
    deleteProperty(target, name: keyType) {
        if (name == $triggerLock) { delete this[$triggerLock]; return true; }

        // drop into value if has
        if (safeGet(target, name) == null &&
            name != "value" && hasValue(target) &&
            safeGet(target, "value") != null &&
            (
                typeof safeGet(target, "value") == "object" ||
                typeof safeGet(target, "value") == "function"
            ) &&
            safeGet(safeGet(target, "value"), name) != null
        ) {
            target = safeGet(target, "value") ?? target;
        }

        //
        const oldValue = safeGet(target, name);
        const result = Reflect.deleteProperty(target, name);

        //
        if (!this[$triggerLock] && (name != $triggerLock && typeof name != "symbol")) { (subscriptRegistry).get(target)?.trigger?.(name, null, oldValue); }
        return result;
    }
}



/** Proxy handler for observable maps, mapping native map operations to trigger events. */
export class ObserveMapHandler<K=any, V=any> {
    [$triggerLock]?: boolean;
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
        target = (safeGet(target, $extractKey$) ?? safeGet(target, $originalKey$) ?? target);
        const valueOrFx = bindCtx(target, /*Reflect.get(, name, ctx)*/safeGet(target, name));
        if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) { return valueOrFx; }

        //
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) {
            return createTriggerAPI(registry, (options) => {
                const key = options.key ?? options.name;
                if (key == null) { return; }
                const value = triggerOptionValue(options, "value", () => target.get(key));
                if (value == null && !hasOwn(options, "value")) { return; }
                const oldValue = triggerOptionValue(options, "oldValue", () => undefined);
                return registry?.trigger?.(key, value, oldValue, options.op ?? "@set", options.trigger ?? "manual");
            });
        }
        
        //
        if (name == "clear") {
            return () => {
                const oldValues: any = Array.from(target?.entries?.() || []), result = valueOrFx();
                oldValues.forEach(([prop, oldValue])=>{
                    if (!this[$triggerLock] && oldValue) { (subscriptRegistry).get(target)?.trigger?.(prop, null, oldValue, "@delete"); }
                });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (prop, _ = null) => {
                const oldValue = target.get(prop), result = valueOrFx(prop);
                if (!this[$triggerLock] && oldValue) { (subscriptRegistry).get(target)?.trigger?.(prop, null, oldValue, "@delete"); }
                return result;
            };
        }

        //
        if (name == "set") {
            return (prop, value) => potentiallyAsyncMap(value, (v)=>{
                const oldValue = target.get(prop), result = valueOrFx(prop, value);
                if (isNotEqual(oldValue, result)) { if (!this[$triggerLock]) { (subscriptRegistry).get(target)?.trigger?.(prop, result, oldValue, oldValue == null ? "@add" : "@set"); } };
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

    //
    getOwnPropertyDescriptor(target, key) {
        let got: TypedPropertyDescriptor<any> | undefined = undefined;
        try { // @ts-ignore
            __safeGetGuard?.getOrInsert?.(target, new Set())?.add?.(key);
            if (__safeGetGuard?.get?.(target)?.has?.(key)) { got = undefined; }
            got = Reflect.getOwnPropertyDescriptor(target, key);
        } catch (e) {
            got = undefined;
        } finally {
            __safeGetGuard?.get?.(target)?.delete?.(key);
        }
        return got;
    }

    //
    deleteProperty(target, name: keyType) {
        if (name == $triggerLock) { delete this[$triggerLock]; return true; }
        const result = Reflect.deleteProperty(target, name);
        return result;
    }
}

/** Proxy handler for observable sets, emitting membership changes as reactive events. */
export class ObserveSetHandler<T=any> {
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
        target = (safeGet(target, $extractKey$) ?? safeGet(target, $originalKey$) ?? target);
        const valueOrFx = bindCtx(target, safeGet(target, name));
        if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) { return valueOrFx; }

        //
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) {
            return createTriggerAPI(registry, (options) => {
                const key = options.key ?? options.name;
                if (key == null) return;
                const value = triggerOptionValue(options, "value", () => target.has(key));
                const oldValue = triggerOptionValue(options, "oldValue", () => undefined);
                return registry?.trigger?.(key, value, oldValue, options.op ?? "@invalidate", options.trigger ?? "manual");
            });
        }
        
        //
        if (name == "clear") {
            return () => {
                const oldValues = Array.from(target?.values?.() || []), result = valueOrFx();
                oldValues.forEach((oldValue)=>{ if (!this[$triggerLock] && oldValue) { (subscriptRegistry).get(target)?.trigger?.(null, null, oldValue, "@delete"); } });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (value) => {
                const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
                if (!this[$triggerLock] && oldValue) { (subscriptRegistry).get(target)?.trigger?.(value, null, oldValue, "@delete"); }
                return result;
            };
        }

        //
        if (name == "add") {
            // TODO: add potentially async set
            return (value) => {
                const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
                if (isNotEqual(oldValue, value)) { if (!this[$triggerLock] && !oldValue) { (subscriptRegistry).get(target)?.trigger?.(value, value, oldValue, "@add"); } };
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

    //
    getOwnPropertyDescriptor(target, key) {
        let got: TypedPropertyDescriptor<any> | undefined = undefined;
        try { // @ts-ignore
            __safeGetGuard?.getOrInsert?.(target, new Set())?.add?.(key);
            if (__safeGetGuard?.get?.(target)?.has?.(key)) { got = undefined; }
            got = Reflect.getOwnPropertyDescriptor(target, key);
        } catch (e) {
            got = undefined;
        } finally {
            __safeGetGuard?.get?.(target)?.delete?.(key);
        }
        return got;
    }

    //
    deleteProperty(target, name: keyType) {
        if (name == $triggerLock) { delete this[$triggerLock]; return true; }
        const result = Reflect.deleteProperty(target, name);
        return result;
    }
}

/** Lightweight internal check used before wrapping a target again. */
export const $isObservable = (target: any) => {
    return !!((typeof target == "object" || typeof target == "function") && target != null && (target?.[$extractKey$] || target?.[$affected]));
}

/** Wrap an array with the array-specific observable proxy. */
export const observeArray  = <T = any>(arr: T[]): observeValid<T[]> => { return ($isObservable(arr) ? arr : wrapWith(arr, new ObserveArrayHandler())); };
/** Wrap an object with the object-specific observable proxy. */
export const observeObject = <T = any>(obj: T): observeValid<T> => { return ($isObservable(obj) ? (obj as observeValid<T>) : wrapWith(obj, new ObserveObjectHandler())); };
/** Wrap a map with the map-specific observable proxy. */
export const observeMap    = <K = any, V = any, T extends MapLike<K, V> = Map<K, V>>(map: T): observeValid<T> => { return ($isObservable(map) ? map : wrapWith(map, new ObserveMapHandler())); };
/** Wrap a set with the set-specific observable proxy. */
export const observeSet    = <K = any, V = any, T extends SetLike<K, V> = Set<K>>(set: T): observeValid<T> => { return ($isObservable(set) ? set : wrapWith(set, new ObserveSetHandler())); };
