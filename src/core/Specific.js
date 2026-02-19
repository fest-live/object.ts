import { affected, unaffected } from "./Mainline";
import { subscriptRegistry, wrapWith } from "./Subscript";
import { $extractKey$, $originalKey$, $registryKey$, $triggerLock, $triggerLess, $value, $trigger, $isNotEqual, $affected } from "../wrap/Symbol";
import { bindCtx, hasValue, isNotEqual, isPrimitive, makeTriggerLess, potentiallyAsync, potentiallyAsyncMap, tryParseByHint } from "fest/core";
//
const __systemSkip = new Set([
    Symbol.toStringTag,
    Symbol.iterator,
    Symbol.asyncIterator,
    Symbol.toPrimitive,
    "toString",
    "valueOf",
    "inspect", // node
    "constructor",
    "__proto__",
    "prototype",
    "then",
    "catch",
    "finally",
    "next"
]);
//
const systemSkipGet = (target, name) => {
    if (!__systemSkip.has(name))
        return null;
    // важно: не undefined, а честный доступ
    const got = safeGet(target, name);
    return (typeof got === "function") ? bindCtx(target, got) : got;
};
//
const __safeGetGuard = new WeakMap();
function isGetter(obj, propName) {
    let got = true;
    try { // @ts-ignore
        __safeGetGuard?.getOrInsert?.(obj, new Set())?.add?.(propName);
        if (__safeGetGuard?.get?.(obj)?.has?.(propName)) {
            got = true;
        }
        const descriptor = Reflect.getOwnPropertyDescriptor(obj, propName);
        got = (typeof descriptor?.get == "function");
    }
    catch (e) {
        got = true;
    }
    finally {
        __safeGetGuard?.get?.(obj)?.delete?.(propName);
    }
    return got;
}
//
export const fallThrough = (obj, key) => {
    if (isPrimitive(obj))
        return obj;
    //
    const value = safeGet(obj, key);
    if (value == null && key != "value") {
        const tmp = safeGet(obj, "value");
        if (tmp != null && !isPrimitive(tmp)) {
            return fallThrough(tmp, key);
        }
        else {
            return value;
        }
        ;
    }
    else 
    // temp-fix: functions isn't supported correctly
    if (key == "value" && value != null && !isPrimitive(value) && (typeof value != "function")) {
        return fallThrough(value, key) ?? value ?? obj;
    }
    return value ?? obj;
};
// Safe getter with global re-entrancy guard to avoid recursive accessor loops
export const safeGet = (obj, key, rec) => {
    //const result = Reflect.get(obj, key, rec != null ? rec : obj);
    //return typeof result == "function" ? bindCtx(obj, result) : result;
    //
    let result = undefined;
    if (obj == null) {
        return obj;
    }
    // @ts-ignore
    let active = __safeGetGuard.getOrInsert(obj, new Set());
    if (active?.has?.(key)) {
        return null;
    }
    // directly return if not a getter
    if (!isGetter(obj, key)) {
        result ??= Reflect.get(obj, key, rec != null ? rec : obj);
    }
    else {
        active?.add?.(key);
        //
        try {
            result = Reflect.get(obj, key, rec != null ? rec : obj);
        }
        catch (_e) {
            result = undefined;
        }
        finally {
            active.delete(key);
            if (active?.size === 0) {
                __safeGetGuard?.delete?.(obj);
            }
        }
    }
    //
    return typeof result == "function" ? bindCtx(obj, result) : result;
};
// get reactive primitives (if native iterator is available, use it)
const systemGet = (target, name, registry) => {
    if (target == null || isPrimitive(target)) {
        return target;
    }
    //
    const exists = ["deref", "bind", "@target", $originalKey$, $extractKey$, $registryKey$]?.indexOf(name) < 0 ? safeGet(target, name)?.bind?.(target) : null;
    if (exists != null)
        return null;
    //
    const $extK = [$extractKey$, $originalKey$];
    //
    if ($extK.indexOf(name) >= 0) {
        return safeGet(target, name) ?? target;
    }
    if (name == $value) {
        return safeGet(target, name) ?? safeGet(target, "value");
    }
    if (name == $registryKey$) {
        return registry;
    } // @ts-ignore
    if (name == Symbol.observable) {
        return registry?.compatible;
    } // @ts-ignore
    if (name == Symbol.subscribe) {
        return (cb, prop) => affected(prop != null ? [target, prop] : target, cb);
    }
    if (name == Symbol.iterator) {
        return safeGet(target, name);
    }
    if (name == Symbol.asyncIterator) {
        return safeGet(target, name);
    }
    if (name == Symbol.dispose) {
        return (prop) => { safeGet(target, Symbol.dispose)?.(prop); unaffected(prop != null ? [target, prop] : target); };
    }
    if (name == Symbol.asyncDispose) {
        return (prop) => { safeGet(target, Symbol.asyncDispose)?.(prop); unaffected(prop != null ? [target, prop] : target); };
    } // @ts-ignore
    if (name == Symbol.unsubscribe) {
        return (prop) => unaffected(prop != null ? [target, prop] : target);
    }
    if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) {
        return safeGet(target, name);
    }
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
};
//
const observableAPIMethods = (target, name, registry) => {
    if (name == "subscribe") {
        return registry?.compatible?.[name] ?? ((handler) => {
            if (typeof handler == "function") {
                return affected(target, handler);
            }
            else if ("next" in handler && handler?.next != null) {
                const usub = affected(target, handler?.next), comp = handler?.["complete"];
                handler["complete"] = (...args) => { usub?.(); return comp?.(...args); };
                return handler["complete"];
            }
        });
    }
};
//
export class ObserveArrayMethod {
    #name;
    #self;
    #handle;
    constructor(name, self, handle) {
        this.#name = name;
        this.#self = self;
        this.#handle = handle;
    }
    //
    get(target, name, rec) {
        const skip = systemSkipGet(target, name);
        if (skip !== null) {
            return skip;
        }
        return Reflect.get(target, name, rec);
    }
    //
    apply(target, ctx, args) {
        let added = [], removed = [];
        let setPairs = [];
        let oldState = [...this.#self];
        let idx = -1;
        // execute operation
        const result = Reflect.apply(target, ctx || this.#self, args);
        if (this.#handle?.[$triggerLock]) {
            if (Array.isArray(result)) {
                return observeArray(result);
            }
            return result;
        }
        //
        switch (this.#name) {
            case "push":
                idx = oldState?.length;
                added = args;
                break;
            case "unshift":
                idx = 0;
                added = args;
                break;
            case "pop":
                idx = oldState?.length - 1;
                if (oldState.length > 0) {
                    removed = [[idx - 1, oldState[idx - 1], null]];
                }
                break;
            case "shift":
                idx = 0;
                if (oldState.length > 0)
                    removed = [[idx, oldState[idx], null]];
                break;
            case "splice":
                const [start, deleteCount, ...items] = args;
                idx = start;
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
                idx = 0;
                for (let i = 0; i < oldState.length; i++) {
                    if (isNotEqual(oldState[i], this.#self[i])) {
                        setPairs.push([idx + i, this.#self[i], oldState[i]]);
                    }
                }
                break;
            // index assignment, args: [value, index]
            case "set":
                idx = args[1];
                setPairs.push([idx, args[0], oldState?.[idx] ?? null]);
                break;
        }
        // triggers on adding
        const reg = subscriptRegistry.get(this.#self);
        if (added?.length == 1) {
            reg?.trigger?.(idx, added[0], null, added[0] == null ? "@add" : "@set");
        }
        else if (added?.length > 1) {
            reg?.trigger?.(idx, added, null, "@addAll");
            added.forEach((item, I) => reg?.trigger?.(idx + I, item, null, item == null ? "@add" : "@set"));
        }
        // triggers on changing
        if (setPairs?.length == 1) {
            reg?.trigger?.(setPairs[0]?.[0] ?? idx, setPairs[0]?.[1], setPairs[0]?.[2], setPairs[0]?.[2] == null ? "@add" : "@set");
        }
        else if (setPairs?.length > 1) {
            reg?.trigger?.(idx, setPairs, oldState, "@setAll");
            setPairs.forEach((pair, I) => reg?.trigger?.(pair?.[0] ?? idx + I, pair?.[1], pair?.[2], pair?.[2] == null ? "@add" : "@set"));
        }
        // triggers on removing
        if (removed?.length == 1) {
            reg?.trigger?.(idx, null, removed[0], removed[0] == null ? "@add" : "@delete");
        }
        else if (removed?.length > 1) {
            reg?.trigger?.(idx, null, removed, "@clear");
            removed.forEach((item, I) => reg?.trigger?.(idx + I, null, item, item == null ? "@add" : "@delete"));
        }
        //
        if (result == target) {
            return new Proxy(result, this.#handle);
        }
        ;
        if (Array.isArray(result)) {
            return observeArray(result);
        }
        return result;
    }
}
//
const triggerWhenLengthChange = (self, target, oldLen, newLen) => {
    const removedItems = (Number.isInteger(oldLen) && Number.isInteger(newLen) && newLen < oldLen) ? target.slice(newLen, oldLen) : [];
    if (!self[$triggerLock] && oldLen !== newLen) {
        const registry = (subscriptRegistry).get(target);
        // emit removals if shrunk
        if (removedItems.length === 1) {
            registry?.trigger?.(newLen, null, removedItems[0], "@delete");
        }
        else if (removedItems.length > 1) {
            registry?.trigger?.(newLen, null, removedItems, "@clear");
            removedItems.forEach((item, I) => registry?.trigger?.(newLen + I, null, item, "@delete"));
        }
        // emit additions if grown (holes are considered added undefined entries)
        const addedCount = (Number.isInteger(oldLen) && Number.isInteger(newLen) && newLen > oldLen)
            ? (newLen - oldLen) : 0;
        if (addedCount === 1) {
            registry?.trigger?.(oldLen, undefined, null, "@add");
        }
        else if (addedCount > 1) {
            const added = Array(addedCount).fill(undefined);
            registry?.trigger?.(oldLen, added, null, "@addAll");
            added.forEach((_, I) => registry?.trigger?.(oldLen + I, undefined, null, "@add"));
        }
    }
};
//
export class ObserveArrayHandler {
    [$triggerLock];
    constructor() {
    }
    //
    has(target, name) { return Reflect.has(target, name); }
    // TODO: some target with target[n] may has also reactive target[n]?.value, which (sometimes) needs to observe too...
    // TODO: also, subscribe can't be too simply used more than once...
    get(target, name, rec) {
        const skip = systemSkipGet(target, name);
        if (skip !== null) {
            return skip;
        }
        //
        if ([$extractKey$, $originalKey$, "@target", "deref"].indexOf(name) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ? safeGet(target, name)?.bind?.(target) : safeGet(target, name);
        }
        ;
        //
        const registry = (subscriptRegistry)?.get?.(target);
        const sys = systemGet(target, name, registry);
        if (sys != null)
            return sys;
        const obs = observableAPIMethods(target, name, registry);
        if (obs != null)
            return obs;
        //
        if (name == $triggerLess) {
            return makeTriggerLess.call(this, this);
        }
        if (name == $trigger) {
            return (key = 0) => {
                const v = safeGet(target, key);
                return subscriptRegistry.get(target)?.trigger?.(key, v, undefined, "@invalidate");
            };
        }
        //
        if (name == "@target" || name == $extractKey$)
            return target;
        //
        if (name == "x") {
            return () => { return target?.x ?? target?.[0]; };
        }
        ;
        if (name == "y") {
            return () => { return target?.y ?? target?.[1]; };
        }
        ;
        if (name == "z") {
            return () => { return target?.z ?? target?.[2]; };
        }
        ;
        if (name == "w") {
            return () => { return target?.w ?? target?.[3]; };
        }
        ;
        //
        if (name == "r") {
            return () => { return target?.r ?? target?.[0]; };
        }
        ;
        if (name == "g") {
            return () => { return target?.g ?? target?.[1]; };
        }
        ;
        if (name == "b") {
            return () => { return target?.b ?? target?.[2]; };
        }
        ;
        if (name == "a") {
            return () => { return target?.a ?? target?.[3]; };
        }
        ;
        // that case: target[n]?.(?{.?value})?
        const got = safeGet(target, name) ?? (name == "value" ? safeGet(target, $value) : null);
        if (typeof got == "function") {
            return new Proxy(typeof got == "function" ? got?.bind?.(target) : got, new ObserveArrayMethod(name, target, this));
        }
        ;
        return got;
    }
    //
    set(target, name, value) {
        if (typeof name != "symbol") {
            // handle Array.length explicitly before numeric index normalization
            if (Number.isInteger(parseInt(name))) {
                name = parseInt(name) ?? name;
            }
            ;
        }
        //
        if (name == $triggerLock && value) {
            this[$triggerLock] = !!value;
            return true;
        }
        if (name == $triggerLock && !value) {
            delete this[$triggerLock];
            return true;
        }
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
        if (xyzw_idx >= 0) {
            got = Reflect.set(target, xyzw_idx, value);
        }
        else if (rgba_idx >= 0) {
            got = Reflect.set(target, rgba_idx, value);
        }
        else {
            got = Reflect.set(target, name, value);
        }
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
            if (Number.isInteger(parseInt(name))) {
                name = parseInt(name) ?? name;
            }
            ;
        }
        //
        if (name == $triggerLock) {
            delete this[$triggerLock];
            return true;
        }
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
export class ObserveObjectHandler {
    [$triggerLock];
    constructor() { }
    // supports nested "value" objects and values
    get(target, name, ctx) {
        if ([$extractKey$, $originalKey$, "@target", "deref", "then", "catch", "finally"].indexOf(name) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ? bindCtx(target, safeGet(target, name)) : safeGet(target, name);
        }
        ;
        //
        const registry = (subscriptRegistry).get(target) ?? subscriptRegistry.get(safeGet(target, "value") ?? target);
        const sys = systemGet(target, name, registry);
        if (sys != null)
            return sys;
        // drop into value if has
        if (safeGet(target, name) == null &&
            name != "value" && hasValue(target) &&
            safeGet(target, "value") != null &&
            (typeof safeGet(target, "value") == "object" ||
                typeof safeGet(target, "value") == "function") &&
            safeGet(safeGet(target, "value"), name) != null) {
            target = safeGet(target, "value") ?? target;
        }
        //
        const obs = observableAPIMethods(target, name, registry);
        if (obs != null)
            return obs;
        //
        // redirect to value key
        if (name == $triggerLess) {
            return makeTriggerLess.call(this, this);
        }
        if (name == $trigger) {
            return (key = "value") => {
                const v = safeGet(target, key);
                const old = (key == "value") ? safeGet(target, $value) : undefined;
                return subscriptRegistry.get(target)?.trigger?.(key, v, old, "@invalidate");
            };
        }
        //
        if (name == Symbol.toPrimitive) {
            return (hint) => {
                const ft = fallThrough(target, name);
                if (safeGet(ft, name))
                    return safeGet(ft, name)?.(hint);
                if (isPrimitive(ft))
                    return tryParseByHint(ft, hint);
                if (isPrimitive(safeGet(ft, "value")))
                    return tryParseByHint(safeGet(ft, "value"), hint);
                return tryParseByHint(safeGet(ft, "value") ?? ft, hint);
            };
        }
        //
        if (name == Symbol.toStringTag) {
            return () => {
                const ft = fallThrough(target, name);
                if (safeGet(ft, name))
                    return safeGet(ft, name)?.();
                if (isPrimitive(ft))
                    return String(ft ?? "") || "";
                if (isPrimitive(safeGet(ft, "value")))
                    return String(safeGet(ft, "value") ?? "") || "";
                return String(safeGet(ft, "value") ?? ft ?? "") || "";
            };
        }
        //
        if (name == "toString") {
            return () => {
                const ft = fallThrough(target, name);
                if (safeGet(ft, name))
                    return safeGet(ft, name)?.();
                if (safeGet(ft, Symbol.toStringTag))
                    return safeGet(ft, Symbol.toStringTag)?.();
                if (isPrimitive(ft))
                    return String(ft ?? "") || "";
                if (isPrimitive(safeGet(ft, "value")))
                    return String(safeGet(ft, "value") ?? "") || "";
                return String(safeGet(ft, "value") ?? ft ?? "") || "";
            };
        }
        //
        if (name == "valueOf") {
            return () => {
                const ft = fallThrough(target, name);
                if (safeGet(ft, name))
                    return safeGet(ft, name)?.();
                if (safeGet(ft, Symbol.toPrimitive))
                    return safeGet(ft, Symbol.toPrimitive)?.();
                if (isPrimitive(ft))
                    return ft;
                if (isPrimitive(safeGet(ft, "value")))
                    return safeGet(ft, "value");
                return safeGet(ft, "value") ?? ft;
            };
        }
        //
        if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) {
            return safeGet(target, name);
        }
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
        let got = undefined;
        try { // @ts-ignore
            __safeGetGuard?.getOrInsert?.(target, new Set())?.add?.(key);
            if (__safeGetGuard?.get?.(target)?.has?.(key)) {
                got = undefined;
            }
            got = Reflect.getOwnPropertyDescriptor(target, key);
        }
        catch (e) {
            got = undefined;
        }
        finally {
            __safeGetGuard?.get?.(target)?.delete?.(key);
        }
        return got;
    }
    // supports nested "value" objects
    has(target, prop) { return (prop in target); }
    set(target, name, value) {
        const skip = systemSkipGet(target, name);
        if (skip !== null)
            return skip;
        //
        return potentiallyAsync(value, (v) => {
            const skip = systemSkipGet(v, name);
            if (skip !== null)
                return skip;
            //
            if (name == $triggerLock && value) {
                this[$triggerLock] = !!value;
                return true;
            }
            if (name == $triggerLock && !value) {
                delete this[$triggerLock];
                return true;
            }
            // drop into value if has
            const $original = target;
            // drop into value if has
            if (safeGet(target, name) == null &&
                name != "value" && hasValue(target) &&
                safeGet(target, "value") != null &&
                (typeof safeGet(target, "value") == "object" ||
                    typeof safeGet(target, "value") == "function") &&
                safeGet(safeGet(target, "value"), name) != null) {
                target = safeGet(target, "value") ?? target;
            }
            //
            if (typeof name == "symbol" && !(safeGet(target, name) != null && name in target))
                return;
            const oldValue = name == "value" ? (safeGet(target, $value) ?? safeGet(target, name)) : safeGet(target, name);
            target[name] = v;
            const newValue = safeGet(target, name) ?? v;
            if (!this[$triggerLock] && typeof name != "symbol" && (safeGet(target, $isNotEqual) ?? isNotEqual)?.(oldValue, newValue)) {
                const subscript = subscriptRegistry.get(target) ?? subscriptRegistry.get($original);
                subscript?.trigger?.(name, v, oldValue);
            }
            ;
            return true;
        });
    }
    //
    deleteProperty(target, name) {
        if (name == $triggerLock) {
            delete this[$triggerLock];
            return true;
        }
        // drop into value if has
        if (safeGet(target, name) == null &&
            name != "value" && hasValue(target) &&
            safeGet(target, "value") != null &&
            (typeof safeGet(target, "value") == "object" ||
                typeof safeGet(target, "value") == "function") &&
            safeGet(safeGet(target, "value"), name) != null) {
            target = safeGet(target, "value") ?? target;
        }
        //
        const oldValue = safeGet(target, name);
        const result = Reflect.deleteProperty(target, name);
        //
        if (!this[$triggerLock] && (name != $triggerLock && typeof name != "symbol")) {
            (subscriptRegistry).get(target)?.trigger?.(name, null, oldValue);
        }
        return result;
    }
}
//
export class ObserveMapHandler {
    [$triggerLock];
    constructor() { }
    //
    get(target, name, ctx) {
        if ([$extractKey$, $originalKey$, "@target", "deref"].indexOf(name) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ?
                bindCtx(target, safeGet(target, name)) : safeGet(target, name);
        }
        ;
        //
        const registry = (subscriptRegistry).get(target);
        const sys = systemGet(target, name, registry);
        if (sys != null)
            return sys;
        const obs = observableAPIMethods(target, name, registry);
        if (obs != null)
            return obs;
        //
        target = (safeGet(target, $extractKey$) ?? safeGet(target, $originalKey$) ?? target);
        const valueOrFx = bindCtx(target, /*Reflect.get(, name, ctx)*/ safeGet(target, name));
        if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) {
            return valueOrFx;
        }
        //
        if (name == $triggerLess) {
            return makeTriggerLess.call(this, this);
        }
        if (name == $trigger) {
            return (key) => {
                if (key == null) {
                    return;
                }
                const v = target.get(key);
                if (v == null) {
                    return;
                }
                return subscriptRegistry.get(target)?.trigger?.(key, v, undefined, "@set");
            };
        }
        //
        if (name == "clear") {
            return () => {
                const oldValues = Array.from(target?.entries?.() || []), result = valueOrFx();
                oldValues.forEach(([prop, oldValue]) => {
                    if (!this[$triggerLock] && oldValue) {
                        (subscriptRegistry).get(target)?.trigger?.(prop, null, oldValue, "@delete");
                    }
                });
                return result;
            };
        }
        //
        if (name == "delete") {
            return (prop, _ = null) => {
                const oldValue = target.get(prop), result = valueOrFx(prop);
                if (!this[$triggerLock] && oldValue) {
                    (subscriptRegistry).get(target)?.trigger?.(prop, null, oldValue, "@delete");
                }
                return result;
            };
        }
        //
        if (name == "set") {
            return (prop, value) => potentiallyAsyncMap(value, (v) => {
                const oldValue = target.get(prop), result = valueOrFx(prop, value);
                if (isNotEqual(oldValue, result)) {
                    if (!this[$triggerLock]) {
                        (subscriptRegistry).get(target)?.trigger?.(prop, result, oldValue, oldValue == null ? "@add" : "@set");
                    }
                }
                ;
                return result;
            });
        }
        //
        return valueOrFx;
    }
    //
    set(target, name, value) {
        if (name == $triggerLock) {
            this[$triggerLock] = !!value;
            return true;
        }
        if (name == $triggerLock && !value) {
            delete this[$triggerLock];
            return true;
        }
        ;
        return Reflect.set(target, name, value);
    }
    // redirect to value key
    has(target, prop) { return Reflect.has(target, prop); }
    apply(target, ctx, args) { return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { return Reflect.construct(target, args, newT); }
    ownKeys(target) { return Reflect.ownKeys(target); }
    isExtensible(target) { return Reflect.isExtensible(target); }
    //
    getOwnPropertyDescriptor(target, key) {
        let got = undefined;
        try { // @ts-ignore
            __safeGetGuard?.getOrInsert?.(target, new Set())?.add?.(key);
            if (__safeGetGuard?.get?.(target)?.has?.(key)) {
                got = undefined;
            }
            got = Reflect.getOwnPropertyDescriptor(target, key);
        }
        catch (e) {
            got = undefined;
        }
        finally {
            __safeGetGuard?.get?.(target)?.delete?.(key);
        }
        return got;
    }
    //
    deleteProperty(target, name) {
        if (name == $triggerLock) {
            delete this[$triggerLock];
            return true;
        }
        const result = Reflect.deleteProperty(target, name);
        return result;
    }
}
//
export class ObserveSetHandler {
    [$triggerLock] = false;
    constructor() { }
    //
    get(target, name, ctx) {
        if ([$extractKey$, $originalKey$, "@target", "deref"].indexOf(name) >= 0 && safeGet(target, name) != null && safeGet(target, name) != target) {
            return typeof safeGet(target, name) == "function" ? bindCtx(target, safeGet(target, name)) : safeGet(target, name);
        }
        ;
        //
        const registry = (subscriptRegistry).get(target);
        const sys = systemGet(target, name, registry);
        if (sys != null)
            return sys;
        const obs = observableAPIMethods(target, name, registry);
        if (obs != null)
            return obs;
        // redirect to value key
        target = (safeGet(target, $extractKey$) ?? safeGet(target, $originalKey$) ?? target);
        const valueOrFx = bindCtx(target, safeGet(target, name));
        if (typeof name == "symbol" && (name in target || safeGet(target, name) != null)) {
            return valueOrFx;
        }
        //
        if (name == $triggerLess) {
            return makeTriggerLess.call(this, this);
        }
        if (name == $trigger) {
            return (key) => {
                if (key == null)
                    return;
                const v = target.has(key);
                return subscriptRegistry.get(target)?.trigger?.(key, v, undefined, "@invalidate");
            };
        }
        //
        if (name == "clear") {
            return () => {
                const oldValues = Array.from(target?.values?.() || []), result = valueOrFx();
                oldValues.forEach((oldValue) => { if (!this[$triggerLock] && oldValue) {
                    (subscriptRegistry).get(target)?.trigger?.(null, null, oldValue, "@delete");
                } });
                return result;
            };
        }
        //
        if (name == "delete") {
            return (value) => {
                const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
                if (!this[$triggerLock] && oldValue) {
                    (subscriptRegistry).get(target)?.trigger?.(value, null, oldValue, "@delete");
                }
                return result;
            };
        }
        //
        if (name == "add") {
            // TODO: add potentially async set
            return (value) => {
                const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
                if (isNotEqual(oldValue, value)) {
                    if (!this[$triggerLock] && !oldValue) {
                        (subscriptRegistry).get(target)?.trigger?.(value, value, oldValue, "@add");
                    }
                }
                ;
                return result;
            };
        }
        //
        return valueOrFx;
    }
    //
    set(target, name, value) {
        if (name == $triggerLock && value) {
            this[$triggerLock] = !!value;
            return true;
        }
        if (name == $triggerLock && !value) {
            delete this[$triggerLock];
            return true;
        }
        return Reflect.set(target, name, value);
    }
    // redirect to value key i
    has(target, prop) { return Reflect.has(target, prop); }
    apply(target, ctx, args) { return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { return Reflect.construct(target, args, newT); }
    ownKeys(target) { return Reflect.ownKeys(target); }
    isExtensible(target) { return Reflect.isExtensible(target); }
    //
    getOwnPropertyDescriptor(target, key) {
        let got = undefined;
        try { // @ts-ignore
            __safeGetGuard?.getOrInsert?.(target, new Set())?.add?.(key);
            if (__safeGetGuard?.get?.(target)?.has?.(key)) {
                got = undefined;
            }
            got = Reflect.getOwnPropertyDescriptor(target, key);
        }
        catch (e) {
            got = undefined;
        }
        finally {
            __safeGetGuard?.get?.(target)?.delete?.(key);
        }
        return got;
    }
    //
    deleteProperty(target, name) {
        if (name == $triggerLock) {
            delete this[$triggerLock];
            return true;
        }
        const result = Reflect.deleteProperty(target, name);
        return result;
    }
}
//
export const $isObservable = (target) => {
    return !!((typeof target == "object" || typeof target == "function") && target != null && (target?.[$extractKey$] || target?.[$affected]));
};
//
export const observeArray = (arr) => { return ($isObservable(arr) ? arr : wrapWith(arr, new ObserveArrayHandler())); };
export const observeObject = (obj) => { return ($isObservable(obj) ? obj : wrapWith(obj, new ObserveObjectHandler())); };
export const observeMap = (map) => { return ($isObservable(map) ? map : wrapWith(map, new ObserveMapHandler())); };
export const observeSet = (set) => { return ($isObservable(set) ? set : wrapWith(set, new ObserveSetHandler())); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BlY2lmaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTcGVjaWZpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNsRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFELE9BQU8sRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxKLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUUvSSxFQUFFO0FBQ0YsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQU07SUFDOUIsTUFBTSxDQUFDLFdBQVc7SUFDbEIsTUFBTSxDQUFDLFFBQVE7SUFDZixNQUFNLENBQUMsYUFBYTtJQUNwQixNQUFNLENBQUMsV0FBVztJQUVsQixVQUFVO0lBQ1YsU0FBUztJQUNULFNBQVMsRUFBVyxPQUFPO0lBQzNCLGFBQWE7SUFDYixXQUFXO0lBQ1gsV0FBVztJQUNYLE1BQU07SUFDTixPQUFPO0lBQ1AsU0FBUztJQUNULE1BQU07Q0FDVCxDQUFDLENBQUM7QUFFSCxFQUFFO0FBQ0YsTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFXLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFekMsd0NBQXdDO0lBQ3hDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEMsT0FB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LENBQUMsQ0FBQztRQUFDLENBQUM7UUFBQSxDQUFDO1FBQ3hFLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQUMsT0FBTyxHQUFHLEVBQUUsR0FBRyxPQUFPLE1BQU0sRUFBRSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDO1FBQUEsQ0FBQztRQUN4RSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUcsT0FBTyxNQUFNLEVBQUUsQ0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQztRQUFBLENBQUM7UUFFeEUsRUFBRTtRQUNGLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQUMsT0FBTyxHQUFHLEVBQUUsR0FBRyxPQUFPLE1BQU0sRUFBRSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxDQUFDO1FBQUEsQ0FBQztRQUN4RSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUcsT0FBTyxNQUFNLEVBQUUsQ0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQztRQUFBLENBQUM7UUFDeEUsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLE9BQU8sTUFBTSxFQUFFLENBQUMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLENBQUM7UUFBQSxDQUFDO1FBQ3hFLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQUMsT0FBTyxHQUFHLEVBQUUsR0FBRyxPQUFPLE1BQU0sRUFBRSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FB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QWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUUsR0FBdUIsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNLLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBTSxDQUF3RCxHQUFNLEVBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqTSxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQU0sQ0FBcUQsR0FBTSxFQUFtQixFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhZmZlY3RlZCwgdW5hZmZlY3RlZCB9IGZyb20gXCIuL01haW5saW5lXCI7XG5pbXBvcnQgeyBzdWJzY3JpcHRSZWdpc3RyeSwgd3JhcFdpdGggfSBmcm9tIFwiLi9TdWJzY3JpcHRcIjtcbmltcG9ydCB7ICRleHRyYWN0S2V5JCwgJG9yaWdpbmFsS2V5JCwgJHJlZ2lzdHJ5S2V5JCwgJHRyaWdnZXJMb2NrLCAkdHJpZ2dlckxlc3MsICR2YWx1ZSwgJHRyaWdnZXIsICRpc05vdEVxdWFsLCAkYWZmZWN0ZWQgfSBmcm9tIFwiLi4vd3JhcC9TeW1ib2xcIjtcbmltcG9ydCB0eXBlIHsga2V5VHlwZSwgTWFwTGlrZSwgb2JzZXJ2ZVZhbGlkLCBTZXRMaWtlIH0gZnJvbSBcIi4uL3dyYXAvVXRpbHNcIjtcbmltcG9ydCB7IGJpbmRDdHgsIGhhc1ZhbHVlLCBpc05vdEVxdWFsLCBpc1ByaW1pdGl2ZSwgbWFrZVRyaWdnZXJMZXNzLCBwb3RlbnRpYWxseUFzeW5jLCBwb3RlbnRpYWxseUFzeW5jTWFwLCB0cnlQYXJzZUJ5SGludCB9IGZyb20gXCJmZXN0L2NvcmVcIjtcblxuLy9cbmNvbnN0IF9fc3lzdGVtU2tpcCA9IG5ldyBTZXQ8YW55PihbXG4gICAgU3ltYm9sLnRvU3RyaW5nVGFnLFxuICAgIFN5bWJvbC5pdGVyYXRvcixcbiAgICBTeW1ib2wuYXN5bmNJdGVyYXRvcixcbiAgICBTeW1ib2wudG9QcmltaXRpdmUsXG5cbiAgICBcInRvU3RyaW5nXCIsXG4gICAgXCJ2YWx1ZU9mXCIsXG4gICAgXCJpbnNwZWN0XCIsICAgICAgICAgIC8vIG5vZGVcbiAgICBcImNvbnN0cnVjdG9yXCIsXG4gICAgXCJfX3Byb3RvX19cIixcbiAgICBcInByb3RvdHlwZVwiLFxuICAgIFwidGhlblwiLFxuICAgIFwiY2F0Y2hcIixcbiAgICBcImZpbmFsbHlcIixcbiAgICBcIm5leHRcIlxuXSk7XG5cbi8vXG5jb25zdCBzeXN0ZW1Ta2lwR2V0ID0gKHRhcmdldDogYW55LCBuYW1lOiBhbnkpID0+IHtcbiAgICBpZiAoIV9fc3lzdGVtU2tpcC5oYXMobmFtZSkpIHJldHVybiBudWxsO1xuICBcbiAgICAvLyDQstCw0LbQvdC+OiDQvdC1IHVuZGVmaW5lZCwg0LAg0YfQtdGB0YLQvdGL0Lkg0LTQvtGB0YLRg9C/XG4gICAgY29uc3QgZ290ID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuICAgIHJldHVybiAodHlwZW9mIGdvdCA9PT0gXCJmdW5jdGlvblwiKSA/IGJpbmRDdHgodGFyZ2V0LCBnb3QpIDogZ290O1xufTtcblxuLy9cbmNvbnN0IF9fc2FmZUdldEd1YXJkID0gbmV3IFdlYWtNYXA8YW55LCBTZXQ8YW55Pj4oKTtcbmZ1bmN0aW9uIGlzR2V0dGVyKG9iaiwgcHJvcE5hbWUpIHtcbiAgICBsZXQgZ290ID0gdHJ1ZTtcbiAgICB0cnkgeyAvLyBAdHMtaWdub3JlXG4gICAgICAgIF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKG9iaiwgbmV3IFNldCgpKT8uYWRkPy4ocHJvcE5hbWUpO1xuICAgICAgICBpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/Lmhhcz8uKHByb3BOYW1lKSkgeyBnb3QgPSB0cnVlOyB9XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3BOYW1lKTtcbiAgICAgICAgZ290ID0gKHR5cGVvZiBkZXNjcmlwdG9yPy5nZXQgPT0gXCJmdW5jdGlvblwiKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGdvdCA9IHRydWU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX19zYWZlR2V0R3VhcmQ/LmdldD8uKG9iaik/LmRlbGV0ZT8uKHByb3BOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGdvdDtcbn1cblxuLy9cbmV4cG9ydCBjb25zdCBmYWxsVGhyb3VnaCA9IChvYmo6IGFueSwga2V5OiBhbnkpID0+IHtcbiAgICBpZiAoaXNQcmltaXRpdmUob2JqKSkgcmV0dXJuIG9iajtcblxuICAgIC8vXG4gICAgY29uc3QgdmFsdWUgPSBzYWZlR2V0KG9iaiwga2V5KTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCAmJiBrZXkgIT0gXCJ2YWx1ZVwiKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IHNhZmVHZXQob2JqLCBcInZhbHVlXCIpO1xuICAgICAgICBpZiAodG1wICE9IG51bGwgJiYgIWlzUHJpbWl0aXZlKHRtcCkpXG4gICAgICAgICAgICB7IHJldHVybiBmYWxsVGhyb3VnaCh0bXAsIGtleSk7IH0gZWxzZVxuICAgICAgICAgICAgeyByZXR1cm4gdmFsdWU7IH07XG4gICAgfSBlbHNlXG4gICAgICAgIC8vIHRlbXAtZml4OiBmdW5jdGlvbnMgaXNuJ3Qgc3VwcG9ydGVkIGNvcnJlY3RseVxuICAgICAgICBpZiAoa2V5ID09IFwidmFsdWVcIiAmJiB2YWx1ZSAhPSBudWxsICYmICFpc1ByaW1pdGl2ZSh2YWx1ZSkgJiYgKHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsbFRocm91Z2godmFsdWUsIGtleSkgPz8gdmFsdWUgPz8gb2JqO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHZhbHVlID8/IG9iajtcbn1cblxuLy8gU2FmZSBnZXR0ZXIgd2l0aCBnbG9iYWwgcmUtZW50cmFuY3kgZ3VhcmQgdG8gYXZvaWQgcmVjdXJzaXZlIGFjY2Vzc29yIGxvb3BzXG5leHBvcnQgY29uc3Qgc2FmZUdldCA9IChvYmo6IGFueSwga2V5OiBhbnksIHJlYz86IGFueSkgPT4ge1xuICAgIC8vY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcbiAgICAvL3JldHVybiB0eXBlb2YgcmVzdWx0ID09IFwiZnVuY3Rpb25cIiA/IGJpbmRDdHgob2JqLCByZXN1bHQpIDogcmVzdWx0O1xuXG4gICAgLy9cbiAgICBsZXQgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgIGlmIChvYmogPT0gbnVsbCkgeyByZXR1cm4gb2JqOyB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgbGV0IGFjdGl2ZSA9IF9fc2FmZUdldEd1YXJkLmdldE9ySW5zZXJ0KG9iaiwgbmV3IFNldCgpKTtcbiAgICBpZiAoYWN0aXZlPy5oYXM/LihrZXkpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAvLyBkaXJlY3RseSByZXR1cm4gaWYgbm90IGEgZ2V0dGVyXG4gICAgaWYgKCFpc0dldHRlcihvYmosIGtleSkpIHtcbiAgICAgICAgcmVzdWx0ID8/PSBSZWZsZWN0LmdldChvYmosIGtleSwgcmVjICE9IG51bGwgPyByZWMgOiBvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFjdGl2ZT8uYWRkPy4oa2V5KTtcblxuICAgICAgICAvL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXQob2JqLCBrZXksIHJlYyAhPSBudWxsID8gcmVjIDogb2JqKTtcbiAgICAgICAgfSBjYXRjaCAoX2UpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGFjdGl2ZS5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChhY3RpdmU/LnNpemUgPT09IDApIHsgX19zYWZlR2V0R3VhcmQ/LmRlbGV0ZT8uKG9iaik7IH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vXG4gICAgcmV0dXJuIHR5cGVvZiByZXN1bHQgPT0gXCJmdW5jdGlvblwiID8gYmluZEN0eChvYmosIHJlc3VsdCkgOiByZXN1bHQ7XG59XG5cbi8vIGdldCByZWFjdGl2ZSBwcmltaXRpdmVzIChpZiBuYXRpdmUgaXRlcmF0b3IgaXMgYXZhaWxhYmxlLCB1c2UgaXQpXG5jb25zdCBzeXN0ZW1HZXQgPSAodGFyZ2V0OiBhbnksIG5hbWU6IGFueSwgcmVnaXN0cnk6IGFueSk9PntcbiAgICBpZiAodGFyZ2V0ID09IG51bGwgfHwgaXNQcmltaXRpdmUodGFyZ2V0KSkgeyByZXR1cm4gdGFyZ2V0OyB9XG5cbiAgICAvL1xuICAgIGNvbnN0IGV4aXN0cyA9IFtcImRlcmVmXCIsIFwiYmluZFwiLCBcIkB0YXJnZXRcIiwgJG9yaWdpbmFsS2V5JCwgJGV4dHJhY3RLZXkkLCAkcmVnaXN0cnlLZXkkXT8uaW5kZXhPZihuYW1lIGFzIGFueSkgPCAwID8gc2FmZUdldCh0YXJnZXQsIG5hbWUgYXMgYW55KT8uYmluZD8uKHRhcmdldCkgOiBudWxsO1xuICAgIGlmIChleGlzdHMgIT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAvL1xuICAgIGNvbnN0ICRleHRLID0gWyRleHRyYWN0S2V5JCwgJG9yaWdpbmFsS2V5JF07XG5cbiAgICAvL1xuICAgIGlmICgkZXh0Sy5pbmRleE9mKG5hbWUgYXMgYW55KSA+PSAwKSB7IHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSBhcyBhbnkpID8/IHRhcmdldDsgfVxuICAgIGlmIChuYW1lID09ICR2YWx1ZSkgICAgICAgICAgICAgICB7IHJldHVybiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIik7IH1cbiAgICBpZiAobmFtZSA9PSAkcmVnaXN0cnlLZXkkKSAgICAgICAgeyByZXR1cm4gcmVnaXN0cnk7IH0gLy8gQHRzLWlnbm9yZVxuICAgIGlmIChuYW1lID09IFN5bWJvbC5vYnNlcnZhYmxlKSAgICB7IHJldHVybiByZWdpc3RyeT8uY29tcGF0aWJsZTsgfSAvLyBAdHMtaWdub3JlXG4gICAgaWYgKG5hbWUgPT0gU3ltYm9sLnN1YnNjcmliZSkgICAgIHsgcmV0dXJuIChjYiwgcHJvcD8pPT5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCwgY2IpOyB9XG4gICAgaWYgKG5hbWUgPT0gU3ltYm9sLml0ZXJhdG9yKSAgICAgIHsgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lIGFzIGFueSk7IH1cbiAgICBpZiAobmFtZSA9PSBTeW1ib2wuYXN5bmNJdGVyYXRvcikgeyByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUgYXMgYW55KTsgfVxuICAgIGlmIChuYW1lID09IFN5bWJvbC5kaXNwb3NlKSAgICAgICB7IHJldHVybiAocHJvcD8pPT57IHNhZmVHZXQodGFyZ2V0LCBTeW1ib2wuZGlzcG9zZSk/Lihwcm9wKTsgdW5hZmZlY3RlZChwcm9wICE9IG51bGwgPyBbdGFyZ2V0LCBwcm9wXSA6IHRhcmdldCl9OyB9XG4gICAgaWYgKG5hbWUgPT0gU3ltYm9sLmFzeW5jRGlzcG9zZSkgIHsgcmV0dXJuIChwcm9wPyk9Pnsgc2FmZUdldCh0YXJnZXQsIFN5bWJvbC5hc3luY0Rpc3Bvc2UpPy4ocHJvcCk7IHVuYWZmZWN0ZWQocHJvcCAhPSBudWxsID8gW3RhcmdldCwgcHJvcF0gOiB0YXJnZXQpOyB9IH0gLy8gQHRzLWlnbm9yZVxuICAgIGlmIChuYW1lID09IFN5bWJvbC51bnN1YnNjcmliZSkgICB7IHJldHVybiAocHJvcD8pPT51bmFmZmVjdGVkKHByb3AgIT0gbnVsbCA/IFt0YXJnZXQsIHByb3BdIDogdGFyZ2V0KTsgfVxuICAgIGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHsgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTsgfVxuXG4gICAgLypcbiAgICBpZiAobmFtZSA9PSBTeW1ib2wudG9QcmltaXRpdmUpICAgeyByZXR1cm4gKGhpbnQ/KT0+e1xuICAgICAgICBpZiAodHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIpIHsgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uKGhpbnQpOyB9O1xuICAgICAgICBpZiAoc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgIT0gbnVsbCAmJiBoYXNWYWx1ZSh0YXJnZXQpKSB7IHJldHVybiB0cnlQYXJzZUJ5SGludChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgaGludCk7IH1cbiAgICB9IH1cbiAgICBpZiAobmFtZSA9PSBTeW1ib2wudG9TdHJpbmdUYWcpIHsgcmV0dXJuICgpPT57XG4gICAgICAgIGlmICh0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIikgeyByZXR1cm4gc2FmZUdldCh0YXJnZXQsIG5hbWUpPy4oKTsgfTtcbiAgICAgICAgaWYgKHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJiBpc1ByaW1pdGl2ZShzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSkpIHsgcmV0dXJuIFN0cmluZyhzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiOyB9O1xuICAgICAgICByZXR1cm4gU3RyaW5nKHNhZmVHZXQodGFyZ2V0LCBcInRvU3RyaW5nXCIpPy4oKSA/PyBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZU9mXCIpPy4oKSA/PyB0YXJnZXQpO1xuICAgIH0gfSovXG59XG5cbi8vXG5jb25zdCBvYnNlcnZhYmxlQVBJTWV0aG9kcyA9ICh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KT0+e1xuICAgIGlmIChuYW1lID09IFwic3Vic2NyaWJlXCIpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdHJ5Py5jb21wYXRpYmxlPy5bbmFtZV0gPz8gKChoYW5kbGVyKT0+e1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhZmZlY3RlZCh0YXJnZXQsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBpZiAoXCJuZXh0XCIgaW4gaGFuZGxlciAmJiBoYW5kbGVyPy5uZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1c3ViID0gYWZmZWN0ZWQodGFyZ2V0LCBoYW5kbGVyPy5uZXh0KSwgY29tcCA9IGhhbmRsZXI/LltcImNvbXBsZXRlXCJdO1xuICAgICAgICAgICAgICAgIGhhbmRsZXJbXCJjb21wbGV0ZVwiXSA9ICguLi5hcmdzKT0+eyB1c3ViPy4oKTsgcmV0dXJuIGNvbXA/LiguLi5hcmdzKTsgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcltcImNvbXBsZXRlXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuLy9cbmV4cG9ydCBjbGFzcyBPYnNlcnZlQXJyYXlNZXRob2Qge1xuICAgICNuYW1lOiBzdHJpbmc7ICNzZWxmOiBhbnk7ICNoYW5kbGU6IGFueTtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBzZWxmLCBoYW5kbGUpIHtcbiAgICAgICAgdGhpcy4jbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuI3NlbGYgPSBzZWxmO1xuICAgICAgICB0aGlzLiNoYW5kbGUgPSBoYW5kbGU7XG4gICAgfVxuXG4gICAgLy9cbiAgICBnZXQodGFyZ2V0LCBuYW1lLCByZWMpIHtcbiAgICAgICAgY29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgaWYgKHNraXAgIT09IG51bGwpIHsgcmV0dXJuIHNraXA7IH1cbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgcmVjKTtcbiAgICB9XG5cbiAgICAvL1xuICAgIGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7XG4gICAgICAgIGxldCBhZGRlZDogW251bWJlciwgYW55LCBhbnldW10gPSBbXSwgcmVtb3ZlZDogW251bWJlciwgYW55LCBhbnldW10gPSBbXTtcbiAgICAgICAgbGV0IHNldFBhaXJzOiBbbnVtYmVyLCBhbnksIGFueV1bXSA9IFtdO1xuICAgICAgICBsZXQgb2xkU3RhdGU6IGFueVtdID0gWy4uLnRoaXMuI3NlbGZdO1xuICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSAtMTtcblxuICAgICAgICAvLyBleGVjdXRlIG9wZXJhdGlvblxuICAgICAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4IHx8IHRoaXMuI3NlbGYsIGFyZ3MpO1xuICAgICAgICBpZiAodGhpcy4jaGFuZGxlPy5bJHRyaWdnZXJMb2NrXSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkgeyByZXR1cm4gb2JzZXJ2ZUFycmF5KHJlc3VsdCk7IH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBzd2l0Y2ggKHRoaXMuI25hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJwdXNoXCIgICA6IGlkeCA9IG9sZFN0YXRlPy5sZW5ndGg7IGFkZGVkID0gYXJnczsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwidW5zaGlmdFwiOiBpZHggPSAwOyBhZGRlZCA9IGFyZ3M7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInBvcFwiOlxuICAgICAgICAgICAgICAgIGlkeCA9IG9sZFN0YXRlPy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIGlmIChvbGRTdGF0ZS5sZW5ndGggPiAwKSB7IHJlbW92ZWQgPSBbW2lkeCAtIDEsIG9sZFN0YXRlW2lkeCAtIDFdLCBudWxsXV07IH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJzaGlmdFwiOlxuICAgICAgICAgICAgICAgIGlkeCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKG9sZFN0YXRlLmxlbmd0aCA+IDApIHJlbW92ZWQgPSBbW2lkeCwgb2xkU3RhdGVbaWR4XSwgbnVsbF1dO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNwbGljZVwiOlxuICAgICAgICAgICAgICAgIGNvbnN0IFtzdGFydCwgZGVsZXRlQ291bnQsIC4uLml0ZW1zXSA9IGFyZ3M7IGlkeCA9IHN0YXJ0O1xuICAgICAgICAgICAgICAgIGFkZGVkID0gZGVsZXRlQ291bnQgPiAwID8gaXRlbXMuc2xpY2UoZGVsZXRlQ291bnQpIDogW107XG5cbiAgICAgICAgICAgICAgICAvLyBkaXNjb3VudCBvZiByZXBsYWNlZCAoYXNzaWduZWQpIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgcmVtb3ZlZCA9IGRlbGV0ZUNvdW50ID4gMCA/IG9sZFN0YXRlPy5zbGljZT8uKGl0ZW1zPy5sZW5ndGggKyBzdGFydCwgc3RhcnQgKyAoZGVsZXRlQ291bnQgLSAoaXRlbXM/Lmxlbmd0aCB8fCAwKSkpIDogW107XG5cbiAgICAgICAgICAgICAgICAvLyBmaXggaW5kZXggZm9yIHJlbWFpbmluZyByZW1vdmVkIG9yIGFkZGVkIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgaWR4ICs9IChkZWxldGVDb3VudCB8fCAwKSAtIChpdGVtcz8ubGVuZ3RoIHx8IDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5kZXggYXNzaWdubWVudFxuICAgICAgICAgICAgICAgIGlmIChkZWxldGVDb3VudCA+IDAgJiYgaXRlbXM/Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbihkZWxldGVDb3VudCwgaXRlbXM/Lmxlbmd0aCA/PyAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRQYWlycy5wdXNoKFtzdGFydCArIGksIGl0ZW1zW2ldLCBvbGRTdGF0ZT8uW3N0YXJ0ICsgaV0gPz8gbnVsbF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNvcnRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJmaWxsXCI6XG4gICAgICAgICAgICBjYXNlIFwicmV2ZXJzZVwiOlxuICAgICAgICAgICAgY2FzZSBcImNvcHlXaXRoaW5cIjpcbiAgICAgICAgICAgICAgICAvLyBjb21wYXJlIG9sZCBhbmQgbmV3IHN0YXRlLCBmaW5kIGNoYW5nZWQgZWxlbWVudHNcbiAgICAgICAgICAgICAgICBpZHggPSAwOyBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFN0YXRlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05vdEVxdWFsKG9sZFN0YXRlW2ldLCB0aGlzLiNzZWxmW2ldKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRQYWlycy5wdXNoKFtpZHgraSwgdGhpcy4jc2VsZltpXSwgb2xkU3RhdGVbaV1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBpbmRleCBhc3NpZ25tZW50LCBhcmdzOiBbdmFsdWUsIGluZGV4XVxuICAgICAgICAgICAgY2FzZSBcInNldFwiOiBpZHggPSBhcmdzWzFdO1xuICAgICAgICAgICAgc2V0UGFpcnMucHVzaChbaWR4LCBhcmdzWzBdLCBvbGRTdGF0ZT8uW2lkeF0gPz8gbnVsbF0pOyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRyaWdnZXJzIG9uIGFkZGluZ1xuICAgICAgICBjb25zdCByZWcgPSBzdWJzY3JpcHRSZWdpc3RyeS5nZXQodGhpcy4jc2VsZik7XG4gICAgICAgIGlmIChhZGRlZD8ubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJlZz8udHJpZ2dlcj8uKGlkeCwgYWRkZWRbMF0sIG51bGwsIGFkZGVkWzBdID09IG51bGwgPyBcIkBhZGRcIiA6IFwiQHNldFwiKTtcbiAgICAgICAgfSBlbHNlIGlmIChhZGRlZD8ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmVnPy50cmlnZ2VyPy4oaWR4LCBhZGRlZCwgbnVsbCwgXCJAYWRkQWxsXCIpO1xuICAgICAgICAgICAgYWRkZWQuZm9yRWFjaCgoaXRlbSwgSSk9PnJlZz8udHJpZ2dlcj8uKGlkeCtJLCBpdGVtLCBudWxsLCBpdGVtID09IG51bGwgPyBcIkBhZGRcIiA6IFwiQHNldFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0cmlnZ2VycyBvbiBjaGFuZ2luZ1xuICAgICAgICBpZiAoc2V0UGFpcnM/Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICByZWc/LnRyaWdnZXI/LihzZXRQYWlyc1swXT8uWzBdID8/IGlkeCwgc2V0UGFpcnNbMF0/LlsxXSwgc2V0UGFpcnNbMF0/LlsyXSwgc2V0UGFpcnNbMF0/LlsyXSA9PSBudWxsID8gXCJAYWRkXCIgOiBcIkBzZXRcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoc2V0UGFpcnM/Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJlZz8udHJpZ2dlcj8uKGlkeCwgc2V0UGFpcnMsIG9sZFN0YXRlLCBcIkBzZXRBbGxcIik7XG4gICAgICAgICAgICBzZXRQYWlycy5mb3JFYWNoKChwYWlyLCBJKT0+cmVnPy50cmlnZ2VyPy4ocGFpcj8uWzBdID8/IGlkeCtJLCBwYWlyPy5bMV0sIHBhaXI/LlsyXSwgcGFpcj8uWzJdID09IG51bGwgPyBcIkBhZGRcIiA6IFwiQHNldFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0cmlnZ2VycyBvbiByZW1vdmluZ1xuICAgICAgICBpZiAocmVtb3ZlZD8ubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHJlZz8udHJpZ2dlcj8uKGlkeCwgbnVsbCwgcmVtb3ZlZFswXSwgcmVtb3ZlZFswXSA9PSBudWxsID8gXCJAYWRkXCIgOiBcIkBkZWxldGVcIik7XG4gICAgICAgIH0gZWxzZSBpZiAocmVtb3ZlZD8ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmVnPy50cmlnZ2VyPy4oaWR4LCBudWxsLCByZW1vdmVkLCBcIkBjbGVhclwiKTtcbiAgICAgICAgICAgIHJlbW92ZWQuZm9yRWFjaCgoaXRlbSwgSSk9PnJlZz8udHJpZ2dlcj8uKGlkeCtJLCBudWxsLCBpdGVtLCBpdGVtID09IG51bGwgPyBcIkBhZGRcIiA6IFwiQGRlbGV0ZVwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAocmVzdWx0ID09IHRhcmdldCkgeyByZXR1cm4gbmV3IFByb3h5KHJlc3VsdCBhcyBhbnksIHRoaXMuI2hhbmRsZSk7IH07XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHsgcmV0dXJuIG9ic2VydmVBcnJheShyZXN1bHQpOyB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG5cblxuLy9cbmNvbnN0IHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlID0gKHNlbGYsIHRhcmdldCwgb2xkTGVuLCBuZXdMZW4pPT57XG4gICAgY29uc3QgcmVtb3ZlZEl0ZW1zID0gKE51bWJlci5pc0ludGVnZXIob2xkTGVuKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKG5ld0xlbikgJiYgbmV3TGVuIDwgb2xkTGVuKSA/IHRhcmdldC5zbGljZShuZXdMZW4sIG9sZExlbikgOiBbXTtcbiAgICBpZiAoIXNlbGZbJHRyaWdnZXJMb2NrXSAmJiBvbGRMZW4gIT09IG5ld0xlbikge1xuICAgICAgICBjb25zdCByZWdpc3RyeSA9IChzdWJzY3JpcHRSZWdpc3RyeSkuZ2V0KHRhcmdldCk7XG5cbiAgICAgICAgLy8gZW1pdCByZW1vdmFscyBpZiBzaHJ1bmtcbiAgICAgICAgaWYgKHJlbW92ZWRJdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJlZ2lzdHJ5Py50cmlnZ2VyPy4obmV3TGVuLCBudWxsLCByZW1vdmVkSXRlbXNbMF0sIFwiQGRlbGV0ZVwiKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZW1vdmVkSXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4sIG51bGwsIHJlbW92ZWRJdGVtcywgXCJAY2xlYXJcIik7XG4gICAgICAgICAgICByZW1vdmVkSXRlbXMuZm9yRWFjaCgoaXRlbSwgSSkgPT4gcmVnaXN0cnk/LnRyaWdnZXI/LihuZXdMZW4gKyBJLCBudWxsLCBpdGVtLCBcIkBkZWxldGVcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZW1pdCBhZGRpdGlvbnMgaWYgZ3Jvd24gKGhvbGVzIGFyZSBjb25zaWRlcmVkIGFkZGVkIHVuZGVmaW5lZCBlbnRyaWVzKVxuICAgICAgICBjb25zdCBhZGRlZENvdW50ID0gKE51bWJlci5pc0ludGVnZXIob2xkTGVuKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKG5ld0xlbikgJiYgbmV3TGVuID4gb2xkTGVuKVxuICAgICAgICAgICAgPyAobmV3TGVuIC0gb2xkTGVuKSA6IDA7XG4gICAgICAgIGlmIChhZGRlZENvdW50ID09PSAxKSB7XG4gICAgICAgICAgICByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiwgdW5kZWZpbmVkLCBudWxsLCBcIkBhZGRcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoYWRkZWRDb3VudCA+IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGFkZGVkID0gQXJyYXkoYWRkZWRDb3VudCkuZmlsbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmVnaXN0cnk/LnRyaWdnZXI/LihvbGRMZW4sIGFkZGVkLCBudWxsLCBcIkBhZGRBbGxcIik7XG4gICAgICAgICAgICBhZGRlZC5mb3JFYWNoKChfLCBJKSA9PiByZWdpc3RyeT8udHJpZ2dlcj8uKG9sZExlbiArIEksIHVuZGVmaW5lZCwgbnVsbCwgXCJAYWRkXCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vXG5leHBvcnQgY2xhc3MgT2JzZXJ2ZUFycmF5SGFuZGxlciB7XG4gICAgWyR0cmlnZ2VyTG9ja10/OiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIC8vXG4gICAgaGFzKHRhcmdldCwgbmFtZSkgeyByZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBuYW1lKTsgfVxuXG4gICAgLy8gVE9ETzogc29tZSB0YXJnZXQgd2l0aCB0YXJnZXRbbl0gbWF5IGhhcyBhbHNvIHJlYWN0aXZlIHRhcmdldFtuXT8udmFsdWUsIHdoaWNoIChzb21ldGltZXMpIG5lZWRzIHRvIG9ic2VydmUgdG9vLi4uXG4gICAgLy8gVE9ETzogYWxzbywgc3Vic2NyaWJlIGNhbid0IGJlIHRvbyBzaW1wbHkgdXNlZCBtb3JlIHRoYW4gb25jZS4uLlxuICAgIGdldCh0YXJnZXQsIG5hbWUsIHJlYykge1xuICAgICAgICBjb25zdCBza2lwID0gc3lzdGVtU2tpcEdldCh0YXJnZXQsIG5hbWUpO1xuICAgICAgICBpZiAoc2tpcCAhPT0gbnVsbCkgeyByZXR1cm4gc2tpcDsgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChbJGV4dHJhY3RLZXkkLCAkb3JpZ2luYWxLZXkkLCBcIkB0YXJnZXRcIiwgXCJkZXJlZlwiXS5pbmRleE9mKG5hbWUgYXMgYW55KSA+PSAwICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSBudWxsICYmIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSAhPSB0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIG5hbWUpID09IFwiZnVuY3Rpb25cIiA/IHNhZmVHZXQodGFyZ2V0LCBuYW1lKT8uYmluZD8uKHRhcmdldCkgOiBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9cbiAgICAgICAgY29uc3QgcmVnaXN0cnkgPSAoc3Vic2NyaXB0UmVnaXN0cnkpPy5nZXQ/Lih0YXJnZXQpO1xuICAgICAgICBjb25zdCBzeXMgPSBzeXN0ZW1HZXQodGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7IGlmIChzeXMgIT0gbnVsbCkgcmV0dXJuIHN5cztcbiAgICAgICAgY29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7IGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHsgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpOyB9XG4gICAgICAgIGlmIChuYW1lID09ICR0cmlnZ2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gKGtleTogYW55ID0gMCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBzYWZlR2V0KHRhcmdldCwga2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihrZXksIHYsIHVuZGVmaW5lZCwgXCJAaW52YWxpZGF0ZVwiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBcIkB0YXJnZXRcIiB8fCBuYW1lID09ICRleHRyYWN0S2V5JCkgcmV0dXJuIHRhcmdldDtcblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBcInhcIikgeyByZXR1cm4gKCkgPT4geyByZXR1cm4gdGFyZ2V0Py54ID8/IHRhcmdldD8uWzBdOyB9OyB9O1xuICAgICAgICBpZiAobmFtZSA9PSBcInlcIikgeyByZXR1cm4gKCkgPT4geyByZXR1cm4gdGFyZ2V0Py55ID8/IHRhcmdldD8uWzFdOyB9OyB9O1xuICAgICAgICBpZiAobmFtZSA9PSBcInpcIikgeyByZXR1cm4gKCkgPT4geyByZXR1cm4gdGFyZ2V0Py56ID8/IHRhcmdldD8uWzJdOyB9OyB9O1xuICAgICAgICBpZiAobmFtZSA9PSBcIndcIikgeyByZXR1cm4gKCkgPT4geyByZXR1cm4gdGFyZ2V0Py53ID8/IHRhcmdldD8uWzNdOyB9OyB9O1xuXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChuYW1lID09IFwiclwiKSB7IHJldHVybiAoKSA9PiB7IHJldHVybiB0YXJnZXQ/LnIgPz8gdGFyZ2V0Py5bMF07IH07IH07XG4gICAgICAgIGlmIChuYW1lID09IFwiZ1wiKSB7IHJldHVybiAoKSA9PiB7IHJldHVybiB0YXJnZXQ/LmcgPz8gdGFyZ2V0Py5bMV07IH07IH07XG4gICAgICAgIGlmIChuYW1lID09IFwiYlwiKSB7IHJldHVybiAoKSA9PiB7IHJldHVybiB0YXJnZXQ/LmIgPz8gdGFyZ2V0Py5bMl07IH07IH07XG4gICAgICAgIGlmIChuYW1lID09IFwiYVwiKSB7IHJldHVybiAoKSA9PiB7IHJldHVybiB0YXJnZXQ/LmEgPz8gdGFyZ2V0Py5bM107IH07IH07XG5cbiAgICAgICAgLy8gdGhhdCBjYXNlOiB0YXJnZXRbbl0/Lig/ey4/dmFsdWV9KT9cbiAgICAgICAgY29uc3QgZ290ID0gc2FmZUdldCh0YXJnZXQsIG5hbWUpID8/IChuYW1lID09IFwidmFsdWVcIiA/IHNhZmVHZXQodGFyZ2V0LCAkdmFsdWUpIDogbnVsbCk7XG4gICAgICAgIGlmICh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIikgeyByZXR1cm4gbmV3IFByb3h5KHR5cGVvZiBnb3QgPT0gXCJmdW5jdGlvblwiID8gZ290Py5iaW5kPy4odGFyZ2V0KSA6IGdvdCwgbmV3IE9ic2VydmVBcnJheU1ldGhvZChuYW1lLCB0YXJnZXQsIHRoaXMpKTsgfTtcbiAgICAgICAgcmV0dXJuIGdvdDtcbiAgICB9XG5cbiAgICAvL1xuICAgIHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiKSB7XG4gICAgICAgICAgICAvLyBoYW5kbGUgQXJyYXkubGVuZ3RoIGV4cGxpY2l0bHkgYmVmb3JlIG51bWVyaWMgaW5kZXggbm9ybWFsaXphdGlvblxuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIocGFyc2VJbnQobmFtZSkpKSB7IG5hbWUgPSBwYXJzZUludChuYW1lKSA/PyBuYW1lOyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy9cbiAgICAgICAgaWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7IHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGlmIChuYW1lID09ICR0cmlnZ2VyTG9jayAmJiAhdmFsdWUpIHsgZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTsgcmV0dXJuIHRydWU7IH1cblxuICAgICAgICAvLyBhcnJheSBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAgICAgIGNvbnN0IG9sZCA9IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcblxuICAgICAgICAvL1xuICAgICAgICBjb25zdCB4eXp3ID0gW1wieFwiLCBcInlcIiwgXCJ6XCIsIFwid1wiXTtcbiAgICAgICAgY29uc3QgcmdiYSA9IFtcInJcIiwgXCJnXCIsIFwiYlwiLCBcImFcIl07XG5cbiAgICAgICAgLy9cbiAgICAgICAgY29uc3QgeHl6d19pZHggPSB4eXp3LmluZGV4T2YobmFtZSk7XG4gICAgICAgIGNvbnN0IHJnYmFfaWR4ID0gcmdiYS5pbmRleE9mKG5hbWUpO1xuXG4gICAgICAgIC8vXG4gICAgICAgIGxldCBnb3QgPSBmYWxzZTtcbiAgICAgICAgaWYgKHh5endfaWR4ID49IDApIHsgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCB4eXp3X2lkeCwgdmFsdWUpOyB9IGVsc2VcbiAgICAgICAgaWYgKHJnYmFfaWR4ID49IDApIHsgZ290ID0gUmVmbGVjdC5zZXQodGFyZ2V0LCByZ2JhX2lkeCwgdmFsdWUpOyB9IGVsc2VcbiAgICAgICAgeyBnb3QgPSBSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTsgfVxuXG4gICAgICAgIC8vIGJpdCBkaWZmZXJlbnQgdHJpZ2dlciBydWxlc1xuICAgICAgICBpZiAobmFtZSA9PSBcImxlbmd0aFwiKSB7XG4gICAgICAgICAgICBpZiAoaXNOb3RFcXVhbChvbGQsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRyaWdnZXJXaGVuTGVuZ3RoQ2hhbmdlKHRoaXMsIHRhcmdldCwgb2xkLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiB0eXBlb2YgbmFtZSAhPSBcInN5bWJvbFwiICYmIGlzTm90RXF1YWwob2xkLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgIChzdWJzY3JpcHRSZWdpc3RyeSk/LmdldD8uKHRhcmdldCk/LnRyaWdnZXI/LihuYW1lLCB2YWx1ZSwgb2xkLCB0eXBlb2YgbmFtZSA9PSBcIm51bWJlclwiID8gXCJAc2V0XCIgOiBudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiBnb3Q7XG4gICAgfVxuXG4gICAgLy9cbiAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBBcnJheS5sZW5ndGggZXhwbGljaXRseSBiZWZvcmUgbnVtZXJpYyBpbmRleCBub3JtYWxpemF0aW9uXG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihwYXJzZUludChuYW1lKSkpIHsgbmFtZSA9IHBhcnNlSW50KG5hbWUpID8/IG5hbWU7IH07XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHsgZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTsgcmV0dXJuIHRydWU7IH1cblxuICAgICAgICAvL1xuICAgICAgICBjb25zdCBvbGQgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG4gICAgICAgIGNvbnN0IGdvdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblxuICAgICAgICAvL1xuICAgICAgICBpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiAobmFtZSAhPSBcImxlbmd0aFwiICYmIG5hbWUgIT0gJHRyaWdnZXJMb2NrICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIpKSB7XG4gICAgICAgICAgICBpZiAob2xkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAoc3Vic2NyaXB0UmVnaXN0cnkpLmdldCh0YXJnZXQpPy50cmlnZ2VyPy4obmFtZSwgbmFtZSwgb2xkLCB0eXBlb2YgbmFtZSA9PSBcIm51bWJlclwiID8gXCJAZGVsZXRlXCIgOiBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiBnb3Q7XG4gICAgfVxufVxuXG4vL1xuZXhwb3J0IGNsYXNzIE9ic2VydmVPYmplY3RIYW5kbGVyPFQ9YW55PiB7XG4gICAgWyR0cmlnZ2VyTG9ja10/OiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIC8vIHN1cHBvcnRzIG5lc3RlZCBcInZhbHVlXCIgb2JqZWN0cyBhbmQgdmFsdWVzXG4gICAgZ2V0KHRhcmdldCwgbmFtZToga2V5VHlwZSwgY3R4KSB7XG4gICAgICAgIGlmIChbJGV4dHJhY3RLZXkkLCAkb3JpZ2luYWxLZXkkLCBcIkB0YXJnZXRcIiwgXCJkZXJlZlwiLCBcInRoZW5cIiwgXCJjYXRjaFwiLCBcImZpbmFsbHlcIl0uaW5kZXhPZihuYW1lIGFzIGFueSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvL1xuICAgICAgICBjb25zdCByZWdpc3RyeSA9IChzdWJzY3JpcHRSZWdpc3RyeSkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID8/IHRhcmdldCk7XG4gICAgICAgIGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTsgaWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuXG4gICAgICAgIC8vIGRyb3AgaW50byB2YWx1ZSBpZiBoYXNcbiAgICAgICAgaWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmXG4gICAgICAgICAgICBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmXG4gICAgICAgICAgICBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHxcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICApICYmXG4gICAgICAgICAgICBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy9cbiAgICAgICAgY29uc3Qgb2JzID0gb2JzZXJ2YWJsZUFQSU1ldGhvZHModGFyZ2V0LCBuYW1lLCByZWdpc3RyeSk7IGlmIChvYnMgIT0gbnVsbCkgcmV0dXJuIG9icztcblxuICAgICAgICAvL1xuICAgICAgICAvLyByZWRpcmVjdCB0byB2YWx1ZSBrZXlcbiAgICAgICAgaWYgKG5hbWUgPT0gJHRyaWdnZXJMZXNzKSB7IHJldHVybiBtYWtlVHJpZ2dlckxlc3MuY2FsbCh0aGlzLCB0aGlzKTsgfVxuICAgICAgICBpZiAobmFtZSA9PSAkdHJpZ2dlcikge1xuICAgICAgICAgICAgcmV0dXJuIChrZXk6IGFueSA9IFwidmFsdWVcIikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBzYWZlR2V0KHRhcmdldCwga2V5KTtcbiAgICAgICAgICAgICAgICBjb25zdCBvbGQgPSAoa2V5ID09IFwidmFsdWVcIikgPyBzYWZlR2V0KHRhcmdldCwgJHZhbHVlKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihrZXksIHYsIG9sZCwgXCJAaW52YWxpZGF0ZVwiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBTeW1ib2wudG9QcmltaXRpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiAoaGludD8pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LihoaW50KTtcbiAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQoZnQsIGhpbnQpO1xuICAgICAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZShzYWZlR2V0KGZ0LCBcInZhbHVlXCIpKSkgcmV0dXJuIHRyeVBhcnNlQnlIaW50KHNhZmVHZXQoZnQsIFwidmFsdWVcIiksIGhpbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnlQYXJzZUJ5SGludChzYWZlR2V0KGZ0LCBcInZhbHVlXCIpID8/IGZ0LCBoaW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChuYW1lID09IFN5bWJvbC50b1N0cmluZ1RhZykge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdCA9IGZhbGxUaHJvdWdoKHRhcmdldCwgbmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKHNhZmVHZXQoZnQsIG5hbWUpKSByZXR1cm4gc2FmZUdldChmdCwgbmFtZSk/LigpO1xuICAgICAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZShmdCkpIHJldHVybiBTdHJpbmcoZnQgPz8gXCJcIikgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSkpIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBcIlwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdCA/PyBcIlwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9cbiAgICAgICAgaWYgKG5hbWUgPT0gXCJ0b1N0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHNhZmVHZXQoZnQsIFN5bWJvbC50b1N0cmluZ1RhZykpIHJldHVybiBzYWZlR2V0KGZ0LCBTeW1ib2wudG9TdHJpbmdUYWcpPy4oKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gU3RyaW5nKGZ0ID8/IFwiXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gXCJcIikgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHNhZmVHZXQoZnQsIFwidmFsdWVcIikgPz8gZnQgPz8gXCJcIikgfHwgXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChuYW1lID09IFwidmFsdWVPZlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ0ID0gZmFsbFRocm91Z2godGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoc2FmZUdldChmdCwgbmFtZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBuYW1lKT8uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHNhZmVHZXQoZnQsIFN5bWJvbC50b1ByaW1pdGl2ZSkpIHJldHVybiBzYWZlR2V0KGZ0LCBTeW1ib2wudG9QcmltaXRpdmUpPy4oKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoZnQpKSByZXR1cm4gZnQ7XG4gICAgICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHNhZmVHZXQoZnQsIFwidmFsdWVcIikpKSByZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2FmZUdldChmdCwgXCJ2YWx1ZVwiKSA/PyBmdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHsgcmV0dXJuIHNhZmVHZXQodGFyZ2V0LCBuYW1lKTsgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiBmYWxsVGhyb3VnaCh0YXJnZXQsIG5hbWUpO1xuICAgIH1cblxuICAgIC8vXG4gICAgYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHsgcmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpOyB9XG4gICAgb3duS2V5cyh0YXJnZXQpIHsgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpOyB9XG4gICAgY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkgeyByZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTsgfVxuICAgIGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHsgcmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7IH1cblxuICAgIC8vXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG4gICAgICAgIGxldCBnb3Q6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPGFueT4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRyeSB7IC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcbiAgICAgICAgICAgIGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgeyBnb3QgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgICAgIGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZ290ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdvdDtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBuZXN0ZWQgXCJ2YWx1ZVwiIG9iamVjdHNcbiAgICBoYXModGFyZ2V0LCBwcm9wOiBrZXlUeXBlKSB7IHJldHVybiAocHJvcCBpbiB0YXJnZXQpOyB9XG4gICAgc2V0KHRhcmdldCwgbmFtZToga2V5VHlwZSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgaWYgKHNraXAgIT09IG51bGwpIHJldHVybiBza2lwO1xuXG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiBwb3RlbnRpYWxseUFzeW5jKHZhbHVlLCAodikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2tpcCA9IHN5c3RlbVNraXBHZXQodiwgbmFtZSk7XG4gICAgICAgICAgICBpZiAoc2tpcCAhPT0gbnVsbCkgcmV0dXJuIHNraXA7XG4gICAgXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmIHZhbHVlKSB7IHRoaXNbJHRyaWdnZXJMb2NrXSA9ICEhdmFsdWU7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgICBpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7IGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107IHJldHVybiB0cnVlOyB9XG5cbiAgICAgICAgICAgIC8vIGRyb3AgaW50byB2YWx1ZSBpZiBoYXNcbiAgICAgICAgICAgIGNvbnN0ICRvcmlnaW5hbCA9IHRhcmdldDtcblxuICAgICAgICAgICAgLy8gZHJvcCBpbnRvIHZhbHVlIGlmIGhhc1xuICAgICAgICAgICAgaWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmXG4gICAgICAgICAgICAgICAgbmFtZSAhPSBcInZhbHVlXCIgJiYgaGFzVmFsdWUodGFyZ2V0KSAmJlxuICAgICAgICAgICAgICAgIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpICE9IG51bGwgJiZcbiAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcIm9iamVjdFwiIHx8XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSA9PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgICApICYmXG4gICAgICAgICAgICAgICAgc2FmZUdldChzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSwgbmFtZSkgIT0gbnVsbFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09IFwic3ltYm9sXCIgJiYgIShzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBuYW1lIGluIHRhcmdldCkpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gbmFtZSA9PSBcInZhbHVlXCIgPyAoc2FmZUdldCh0YXJnZXQsICR2YWx1ZSkgPz8gc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTsgdGFyZ2V0W25hbWVdID0gdjsgY29uc3QgbmV3VmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSkgPz8gdjtcbiAgICAgICAgICAgIGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIHR5cGVvZiBuYW1lICE9IFwic3ltYm9sXCIgJiYgKHNhZmVHZXQodGFyZ2V0LCAkaXNOb3RFcXVhbCkgPz8gaXNOb3RFcXVhbCk/LihvbGRWYWx1ZSwgbmV3VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0ID0gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCkgPz8gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KCRvcmlnaW5hbCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0Py50cmlnZ2VyPy4obmFtZSwgdiwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vXG4gICAgZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lOiBrZXlUeXBlKSB7XG4gICAgICAgIGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykgeyBkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdOyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgICAgIC8vIGRyb3AgaW50byB2YWx1ZSBpZiBoYXNcbiAgICAgICAgaWYgKHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBudWxsICYmXG4gICAgICAgICAgICBuYW1lICE9IFwidmFsdWVcIiAmJiBoYXNWYWx1ZSh0YXJnZXQpICYmXG4gICAgICAgICAgICBzYWZlR2V0KHRhcmdldCwgXCJ2YWx1ZVwiKSAhPSBudWxsICYmXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpID09IFwib2JqZWN0XCIgfHxcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICApICYmXG4gICAgICAgICAgICBzYWZlR2V0KHNhZmVHZXQodGFyZ2V0LCBcInZhbHVlXCIpLCBuYW1lKSAhPSBudWxsXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gc2FmZUdldCh0YXJnZXQsIFwidmFsdWVcIikgPz8gdGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy9cbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSBzYWZlR2V0KHRhcmdldCwgbmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcblxuICAgICAgICAvL1xuICAgICAgICBpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiAobmFtZSAhPSAkdHJpZ2dlckxvY2sgJiYgdHlwZW9mIG5hbWUgIT0gXCJzeW1ib2xcIikpIHsgKHN1YnNjcmlwdFJlZ2lzdHJ5KS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG5hbWUsIG51bGwsIG9sZFZhbHVlKTsgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuXG5cbi8vXG5leHBvcnQgY2xhc3MgT2JzZXJ2ZU1hcEhhbmRsZXI8Sz1hbnksIFY9YW55PiB7XG4gICAgWyR0cmlnZ2VyTG9ja10/OiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICAvL1xuICAgIGdldCh0YXJnZXQsIG5hbWU6IGtleVR5cGUsIGN0eCkge1xuICAgICAgICBpZiAoWyRleHRyYWN0S2V5JCwgJG9yaWdpbmFsS2V5JCwgXCJAdGFyZ2V0XCIsIFwiZGVyZWZcIl0uaW5kZXhPZihuYW1lIGFzIGFueSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgP1xuICAgICAgICAgICAgICAgIGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpIDogc2FmZUdldCh0YXJnZXQsIG5hbWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vXG4gICAgICAgIGNvbnN0IHJlZ2lzdHJ5ID0gKHN1YnNjcmlwdFJlZ2lzdHJ5KS5nZXQodGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgc3lzID0gc3lzdGVtR2V0KHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpOyBpZiAoc3lzICE9IG51bGwpIHJldHVybiBzeXM7XG4gICAgICAgIGNvbnN0IG9icyA9IG9ic2VydmFibGVBUElNZXRob2RzKHRhcmdldCwgbmFtZSwgcmVnaXN0cnkpOyBpZiAob2JzICE9IG51bGwpIHJldHVybiBvYnM7XG5cbiAgICAgICAgLy9cbiAgICAgICAgdGFyZ2V0ID0gKHNhZmVHZXQodGFyZ2V0LCAkZXh0cmFjdEtleSQpID8/IHNhZmVHZXQodGFyZ2V0LCAkb3JpZ2luYWxLZXkkKSA/PyB0YXJnZXQpO1xuICAgICAgICBjb25zdCB2YWx1ZU9yRnggPSBiaW5kQ3R4KHRhcmdldCwgLypSZWZsZWN0LmdldCgsIG5hbWUsIGN0eCkqL3NhZmVHZXQodGFyZ2V0LCBuYW1lKSk7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PSBcInN5bWJvbFwiICYmIChuYW1lIGluIHRhcmdldCB8fCBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCkpIHsgcmV0dXJuIHZhbHVlT3JGeDsgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChuYW1lID09ICR0cmlnZ2VyTGVzcykgeyByZXR1cm4gbWFrZVRyaWdnZXJMZXNzLmNhbGwodGhpcywgdGhpcyk7IH1cbiAgICAgICAgaWYgKG5hbWUgPT0gJHRyaWdnZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAoa2V5OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IG51bGwpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRhcmdldC5nZXQoa2V5KTsgaWYgKHYgPT0gbnVsbCkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihrZXksIHYsIHVuZGVmaW5lZCwgXCJAc2V0XCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9cbiAgICAgICAgaWYgKG5hbWUgPT0gXCJjbGVhclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlczogYW55ID0gQXJyYXkuZnJvbSh0YXJnZXQ/LmVudHJpZXM/LigpIHx8IFtdKSwgcmVzdWx0ID0gdmFsdWVPckZ4KCk7XG4gICAgICAgICAgICAgICAgb2xkVmFsdWVzLmZvckVhY2goKFtwcm9wLCBvbGRWYWx1ZV0pPT57XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpc1skdHJpZ2dlckxvY2tdICYmIG9sZFZhbHVlKSB7IChzdWJzY3JpcHRSZWdpc3RyeSkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lihwcm9wLCBudWxsLCBvbGRWYWx1ZSwgXCJAZGVsZXRlXCIpOyB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBcImRlbGV0ZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gKHByb3AsIF8gPSBudWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0YXJnZXQuZ2V0KHByb3ApLCByZXN1bHQgPSB2YWx1ZU9yRngocHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgb2xkVmFsdWUpIHsgKHN1YnNjcmlwdFJlZ2lzdHJ5KS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKHByb3AsIG51bGwsIG9sZFZhbHVlLCBcIkBkZWxldGVcIik7IH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChuYW1lID09IFwic2V0XCIpIHtcbiAgICAgICAgICAgIHJldHVybiAocHJvcCwgdmFsdWUpID0+IHBvdGVudGlhbGx5QXN5bmNNYXAodmFsdWUsICh2KT0+e1xuICAgICAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGFyZ2V0LmdldChwcm9wKSwgcmVzdWx0ID0gdmFsdWVPckZ4KHByb3AsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNOb3RFcXVhbChvbGRWYWx1ZSwgcmVzdWx0KSkgeyBpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSkgeyAoc3Vic2NyaXB0UmVnaXN0cnkpLmdldCh0YXJnZXQpPy50cmlnZ2VyPy4ocHJvcCwgcmVzdWx0LCBvbGRWYWx1ZSwgb2xkVmFsdWUgPT0gbnVsbCA/IFwiQGFkZFwiIDogXCJAc2V0XCIpOyB9IH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9cbiAgICAgICAgcmV0dXJuIHZhbHVlT3JGeDtcbiAgICB9XG5cbiAgICAvL1xuICAgIHNldCh0YXJnZXQsIG5hbWU6IGtleVR5cGUsIHZhbHVlKSB7XG4gICAgICAgIGlmIChuYW1lID09ICR0cmlnZ2VyTG9jaykgeyB0aGlzWyR0cmlnZ2VyTG9ja10gPSAhIXZhbHVlOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICBpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgIXZhbHVlKSB7IGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107IHJldHVybiB0cnVlOyB9O1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gcmVkaXJlY3QgdG8gdmFsdWUga2V5XG4gICAgaGFzKHRhcmdldCwgcHJvcDoga2V5VHlwZSkgeyByZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTsgfVxuICAgIGFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKSB7IHJldHVybiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgY3R4LCBhcmdzKTsgfVxuICAgIGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1QpIHsgcmV0dXJuIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCk7IH1cbiAgICBvd25LZXlzKHRhcmdldCkgeyByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7IH1cbiAgICBpc0V4dGVuc2libGUodGFyZ2V0KSB7IHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpOyB9XG5cbiAgICAvL1xuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkge1xuICAgICAgICBsZXQgZ290OiBUeXBlZFByb3BlcnR5RGVzY3JpcHRvcjxhbnk+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgICB0cnkgeyAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBfX3NhZmVHZXRHdWFyZD8uZ2V0T3JJbnNlcnQ/Lih0YXJnZXQsIG5ldyBTZXQoKSk/LmFkZD8uKGtleSk7XG4gICAgICAgICAgICBpZiAoX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/Lmhhcz8uKGtleSkpIHsgZ290ID0gdW5kZWZpbmVkOyB9XG4gICAgICAgICAgICBnb3QgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGdvdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9fc2FmZUdldEd1YXJkPy5nZXQ/Lih0YXJnZXQpPy5kZWxldGU/LihrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnb3Q7XG4gICAgfVxuXG4gICAgLy9cbiAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWU6IGtleVR5cGUpIHtcbiAgICAgICAgaWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrKSB7IGRlbGV0ZSB0aGlzWyR0cmlnZ2VyTG9ja107IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5cbi8vXG5leHBvcnQgY2xhc3MgT2JzZXJ2ZVNldEhhbmRsZXI8VD1hbnk+IHtcbiAgICBbJHRyaWdnZXJMb2NrXT86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICAvL1xuICAgIGdldCh0YXJnZXQsIG5hbWU6IGtleVR5cGUsIGN0eCkge1xuICAgICAgICBpZiAoWyRleHRyYWN0S2V5JCwgJG9yaWdpbmFsS2V5JCwgXCJAdGFyZ2V0XCIsIFwiZGVyZWZcIl0uaW5kZXhPZihuYW1lIGFzIGFueSkgPj0gMCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gbnVsbCAmJiBzYWZlR2V0KHRhcmdldCwgbmFtZSkgIT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHNhZmVHZXQodGFyZ2V0LCBuYW1lKSA9PSBcImZ1bmN0aW9uXCIgPyBiaW5kQ3R4KHRhcmdldCwgc2FmZUdldCh0YXJnZXQsIG5hbWUpKSA6IHNhZmVHZXQodGFyZ2V0LCBuYW1lKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvL1xuICAgICAgICBjb25zdCByZWdpc3RyeSA9IChzdWJzY3JpcHRSZWdpc3RyeSkuZ2V0KHRhcmdldCk7XG4gICAgICAgIGNvbnN0IHN5cyA9IHN5c3RlbUdldCh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTsgaWYgKHN5cyAhPSBudWxsKSByZXR1cm4gc3lzO1xuICAgICAgICBjb25zdCBvYnMgPSBvYnNlcnZhYmxlQVBJTWV0aG9kcyh0YXJnZXQsIG5hbWUsIHJlZ2lzdHJ5KTsgaWYgKG9icyAhPSBudWxsKSByZXR1cm4gb2JzO1xuXG4gICAgICAgIC8vIHJlZGlyZWN0IHRvIHZhbHVlIGtleVxuICAgICAgICB0YXJnZXQgPSAoc2FmZUdldCh0YXJnZXQsICRleHRyYWN0S2V5JCkgPz8gc2FmZUdldCh0YXJnZXQsICRvcmlnaW5hbEtleSQpID8/IHRhcmdldCk7XG4gICAgICAgIGNvbnN0IHZhbHVlT3JGeCA9IGJpbmRDdHgodGFyZ2V0LCBzYWZlR2V0KHRhcmdldCwgbmFtZSkpO1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT0gXCJzeW1ib2xcIiAmJiAobmFtZSBpbiB0YXJnZXQgfHwgc2FmZUdldCh0YXJnZXQsIG5hbWUpICE9IG51bGwpKSB7IHJldHVybiB2YWx1ZU9yRng7IH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSAkdHJpZ2dlckxlc3MpIHsgcmV0dXJuIG1ha2VUcmlnZ2VyTGVzcy5jYWxsKHRoaXMsIHRoaXMpOyB9XG4gICAgICAgIGlmIChuYW1lID09ICR0cmlnZ2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gKGtleTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBudWxsKSByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRhcmdldC5oYXMoa2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0UmVnaXN0cnkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/LihrZXksIHYsIHVuZGVmaW5lZCwgXCJAaW52YWxpZGF0ZVwiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChuYW1lID09IFwiY2xlYXJcIikge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRWYWx1ZXMgPSBBcnJheS5mcm9tKHRhcmdldD8udmFsdWVzPy4oKSB8fCBbXSksIHJlc3VsdCA9IHZhbHVlT3JGeCgpO1xuICAgICAgICAgICAgICAgIG9sZFZhbHVlcy5mb3JFYWNoKChvbGRWYWx1ZSk9PnsgaWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgb2xkVmFsdWUpIHsgKHN1YnNjcmlwdFJlZ2lzdHJ5KS5nZXQodGFyZ2V0KT8udHJpZ2dlcj8uKG51bGwsIG51bGwsIG9sZFZhbHVlLCBcIkBkZWxldGVcIik7IH0gfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBcImRlbGV0ZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0YXJnZXQuaGFzKHZhbHVlKSA/IHZhbHVlIDogbnVsbCwgcmVzdWx0ID0gdmFsdWVPckZ4KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXNbJHRyaWdnZXJMb2NrXSAmJiBvbGRWYWx1ZSkgeyAoc3Vic2NyaXB0UmVnaXN0cnkpLmdldCh0YXJnZXQpPy50cmlnZ2VyPy4odmFsdWUsIG51bGwsIG9sZFZhbHVlLCBcIkBkZWxldGVcIik7IH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChuYW1lID09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IGFkZCBwb3RlbnRpYWxseSBhc3luYyBzZXRcbiAgICAgICAgICAgIHJldHVybiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRhcmdldC5oYXModmFsdWUpID8gdmFsdWUgOiBudWxsLCByZXN1bHQgPSB2YWx1ZU9yRngodmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChpc05vdEVxdWFsKG9sZFZhbHVlLCB2YWx1ZSkpIHsgaWYgKCF0aGlzWyR0cmlnZ2VyTG9ja10gJiYgIW9sZFZhbHVlKSB7IChzdWJzY3JpcHRSZWdpc3RyeSkuZ2V0KHRhcmdldCk/LnRyaWdnZXI/Lih2YWx1ZSwgdmFsdWUsIG9sZFZhbHVlLCBcIkBhZGRcIik7IH0gfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIHJldHVybiB2YWx1ZU9yRng7XG4gICAgfVxuXG4gICAgLy9cbiAgICBzZXQodGFyZ2V0LCBuYW1lOiBrZXlUeXBlLCB2YWx1ZSkge1xuICAgICAgICBpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2sgJiYgdmFsdWUpIHsgdGhpc1skdHJpZ2dlckxvY2tdID0gISF2YWx1ZTsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgaWYgKG5hbWUgPT0gJHRyaWdnZXJMb2NrICYmICF2YWx1ZSkgeyBkZWxldGUgdGhpc1skdHJpZ2dlckxvY2tdOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gcmVkaXJlY3QgdG8gdmFsdWUga2V5IGlcbiAgICBoYXModGFyZ2V0LCBwcm9wOiBrZXlUeXBlKSB7IHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApOyB9XG4gICAgYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpIHsgcmV0dXJuIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCBjdHgsIGFyZ3MpOyB9XG4gICAgY29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VCkgeyByZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUKTsgfVxuICAgIG93bktleXModGFyZ2V0KSB7IHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTsgfVxuICAgIGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHsgcmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7IH1cblxuICAgIC8vXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSB7XG4gICAgICAgIGxldCBnb3Q6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPGFueT4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRyeSB7IC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIF9fc2FmZUdldEd1YXJkPy5nZXRPckluc2VydD8uKHRhcmdldCwgbmV3IFNldCgpKT8uYWRkPy4oa2V5KTtcbiAgICAgICAgICAgIGlmIChfX3NhZmVHZXRHdWFyZD8uZ2V0Py4odGFyZ2V0KT8uaGFzPy4oa2V5KSkgeyBnb3QgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgICAgIGdvdCA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZ290ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX19zYWZlR2V0R3VhcmQ/LmdldD8uKHRhcmdldCk/LmRlbGV0ZT8uKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdvdDtcbiAgICB9XG5cbiAgICAvL1xuICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgbmFtZToga2V5VHlwZSkge1xuICAgICAgICBpZiAobmFtZSA9PSAkdHJpZ2dlckxvY2spIHsgZGVsZXRlIHRoaXNbJHRyaWdnZXJMb2NrXTsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuLy9cbmV4cG9ydCBjb25zdCAkaXNPYnNlcnZhYmxlID0gKHRhcmdldDogYW55KSA9PiB7XG4gICAgcmV0dXJuICEhKCh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpICYmIHRhcmdldCAhPSBudWxsICYmICh0YXJnZXQ/LlskZXh0cmFjdEtleSRdIHx8IHRhcmdldD8uWyRhZmZlY3RlZF0pKTtcbn1cblxuLy9cbmV4cG9ydCBjb25zdCBvYnNlcnZlQXJyYXkgID0gPFQgPSBhbnk+KGFycjogVFtdKTogb2JzZXJ2ZVZhbGlkPFRbXT4gPT4geyByZXR1cm4gKCRpc09ic2VydmFibGUoYXJyKSA/IGFyciA6IHdyYXBXaXRoKGFyciwgbmV3IE9ic2VydmVBcnJheUhhbmRsZXIoKSkpOyB9O1xuZXhwb3J0IGNvbnN0IG9ic2VydmVPYmplY3QgPSA8VCA9IGFueT4ob2JqOiBUKTogb2JzZXJ2ZVZhbGlkPFQ+ID0+IHsgcmV0dXJuICgkaXNPYnNlcnZhYmxlKG9iaikgPyAob2JqIGFzIG9ic2VydmVWYWxpZDxUPikgOiB3cmFwV2l0aChvYmosIG5ldyBPYnNlcnZlT2JqZWN0SGFuZGxlcigpKSk7IH07XG5leHBvcnQgY29uc3Qgb2JzZXJ2ZU1hcCAgICA9IDxLID0gYW55LCBWID0gYW55LCBUIGV4dGVuZHMgTWFwTGlrZTxLLCBWPiA9IE1hcDxLLCBWPj4obWFwOiBUKTogb2JzZXJ2ZVZhbGlkPFQ+ID0+IHsgcmV0dXJuICgkaXNPYnNlcnZhYmxlKG1hcCkgPyBtYXAgOiB3cmFwV2l0aChtYXAsIG5ldyBPYnNlcnZlTWFwSGFuZGxlcigpKSk7IH07XG5leHBvcnQgY29uc3Qgb2JzZXJ2ZVNldCAgICA9IDxLID0gYW55LCBWID0gYW55LCBUIGV4dGVuZHMgU2V0TGlrZTxLLCBWPiA9IFNldDxLPj4oc2V0OiBUKTogb2JzZXJ2ZVZhbGlkPFQ+ID0+IHsgcmV0dXJuICgkaXNPYnNlcnZhYmxlKHNldCkgPyBzZXQgOiB3cmFwV2l0aChzZXQsIG5ldyBPYnNlcnZlU2V0SGFuZGxlcigpKSk7IH07XG4iXX0=