import { subscribe, unsubscribe } from "./Mainline";
import { subscriptRegistry, wrapWith } from "./Subscript";
import { $extractKey$, $originalKey$, $registryKey$, $triggerLock, $triggerLess, $value, $trigger } from "../$wrap$/Symbol";
import { deref, type keyType, refValid } from "../$wrap$/Utils";
import { bindCtx, isNotEqual, isPrimitive, makeTriggerLess, potentiallyAsync, potentiallyAsyncMap, tryParseByHint } from "fest/core";

// get reactive primitives (if native iterator is available, use it)
const systemGet = (target, name, registry)=>{
    if (target == null) return null;

    //
    const exists = target?.[name]?.bind?.(target);
    if (exists != null) return null;

    //
    if (name == $value)               { return target?.[$value] ?? target?.value; }
    if (name == "value")              { return target?.value ?? target?.[$value]; }
    if (name == $registryKey$)        { return registry?.deref?.(); }
    if (name == $extractKey$ || name == $originalKey$) { return target?.[name] ?? target; } // @ts-ignore
    if (name == Symbol.observable)    { return registry?.deref?.()?.compatible; } // @ts-ignore
    if (name == Symbol.subscribe)     { return (cb, prop?)=>subscribe(prop != null ? [target, prop] : target, cb); }
    if (name == Symbol.iterator)      { return target[name]?.bind?.(target); }
    if (name == Symbol.asyncIterator) { return target[name]?.bind?.(target); }
    if (name == Symbol.dispose)       { return (prop?)=>{ target?.[Symbol.dispose]?.(prop); unsubscribe(prop != null ? [target, prop] : target)}; }
    if (name == Symbol.asyncDispose)  { return (prop?)=>{ target?.[Symbol.asyncDispose]?.(prop); unsubscribe(prop != null ? [target, prop] : target); } } // @ts-ignore
    if (name == Symbol.unsubscribe)   { return (prop?)=>unsubscribe(prop != null ? [target, prop] : target); }
    if (name == Symbol.toPrimitive)   { return (hint?)=>{ if ((target?.value != null || "value" in target) && (typeof target?.value != "object" && typeof target?.value != "function")) { return tryParseByHint(target.value, hint); }; return tryParseByHint(target?.valueOf?.(), hint); } }
    if (name == Symbol.toStringTag)   { return ()=>{ if (isPrimitive(target?.value)) { return String(target?.value ?? "") || ""; }; return target?.valueOf?.(); } }
}

//
const observableAPIMethods = (target, name, registry)=>{
    if (name in target || target?.[name] != null) return null;
    if (name == "subscribe") {
        return registry?.deref?.()?.compatible?.[name] ?? ((handler)=>{
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
        const $reg = (subscriptRegistry).get(target);

        // emit removals if shrunk
        if (removedItems.length === 1) {
            $reg?.trigger?.(newLen, null, removedItems[0], "@remove");
        } else if (removedItems.length > 1) {
            $reg?.trigger?.(newLen, null, removedItems, "@removeAll");
            removedItems.forEach((item, I) => $reg?.trigger?.(newLen + I, null, item, "@remove"));
        }

        // emit additions if grown (holes are considered added undefined entries)
        const addedCount = (Number.isInteger(oldLen) && Number.isInteger(newLen) && newLen > oldLen)
            ? (newLen - oldLen) : 0;
        if (addedCount === 1) {
            $reg?.trigger?.(oldLen, undefined, null, "@add");
        } else if (addedCount > 1) {
            const added = Array(addedCount).fill(undefined);
            $reg?.trigger?.(oldLen, added, null, "@addAll");
            added.forEach((_, I) => $reg?.trigger?.(oldLen + I, undefined, null, "@add"));
        }
    }
}



//
export class ReactiveArray {
    [$triggerLock]: boolean = false;
    constructor() {
    }

    //
    has(target, name) { return Reflect.has(target, name); }

    // TODO: some target with target[n] may has also reactive target[n]?.value, which (sometimes) needs to observe too...
    // TODO: also, subscribe can't be too simply used more than once...
    get(target, name, rec) {
        const $reg = (subscriptRegistry).get(target), registry = $reg ? new WeakRef($reg) : null;
        const sys = systemGet(target, name, registry); if (sys != null) return sys;
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        //
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) { return (key = "value")=>{ registry?.deref()?.trigger?.(key, target?.[key], target?.[key], "@set"); }; }
        if (name == "@target" || name == $extractKey$) return target;

        // that case: target[n]?.(?{.?value})?
        const got = Reflect.get(target, name, rec);
        if (typeof got == "function") { return new Proxy(got?.bind?.(target) ?? got, new ObserveArrayMethod(name, target, this)); };
        return got;
    }

    //
    set(target, name, value) {
        if (typeof name != "symbol") {
            // handle Array.length explicitly before numeric index normalization
            if (Number.isInteger(parseInt(name))) { name = parseInt(name); };
        }

        //
        if (name == $triggerLock) { this[$triggerLock] = !!value; return true; }

        // array property changes
        const old = target?.[name];
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
            name = parseInt(name);
        }

        //
        const old = target?.[name];
        const got = Reflect.deleteProperty(target, name);

        //
        if (!this[$triggerLock] && (name != "length" && name != $triggerLock && typeof name != "symbol")) {
            const $reg = (subscriptRegistry).get(target);
            if (old != null) {
                $reg?.trigger?.(name, name, old, typeof name == "number" ? "@delete" : null);
            }
        }

        //
        if (name == $triggerLock) {
            this[$triggerLock] = false;
        }

        //
        return got;
    }
}

//
export class ReactiveMap {
    constructor() { }

    //
    get(target, name: keyType, ctx) {
        const $reg = (subscriptRegistry).get(target);
        const registry = $reg ? new WeakRef($reg) : null;
        const sys = systemGet(target, name, registry); if (sys != null) return sys;
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        //
        if ((target = deref(target)) == null) return;
        const tp = (target[$extractKey$] ?? target[$originalKey$] ?? target);
        const valueOrFx = bindCtx(tp, /*Reflect.get(, name, ctx)*/(tp)?.[name]);
        if (typeof name == "symbol" && (name in target || target?.[name] != null)) { return valueOrFx; }

        //
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) { return (key = "value")=>{ registry?.deref()?.trigger?.(key, target?.[key], target?.[key], "@set"); }; }

        //
        if (name == "clear") {
            return () => {
                const oldValues: any = Array.from(target?.entries?.() || []), result = valueOrFx();
                oldValues.forEach(([prop, oldValue])=>{
                    if (!this[$triggerLock]) { registry?.deref()?.trigger?.(prop, null, oldValue); }
                });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (prop, _ = null) => {
                const oldValue = target.get(prop), result = valueOrFx(prop);
                if (!this[$triggerLock]) { registry?.deref()?.trigger?.(prop, null, oldValue); }
                return result;
            };
        }

        //
        if (name == "set") {
            return (prop, value) => potentiallyAsyncMap(value, (v)=>{
                const oldValue = target.get(prop), result = valueOrFx(prop, value);
                if (isNotEqual(oldValue, value)) { if (!this[$triggerLock]) { registry?.deref()?.trigger?.(prop, value, oldValue); } };
                return result;
            });
        }

        //
        return valueOrFx;
    }

    //
    set(target, name: keyType, value) {
        if (name == $triggerLock) { this[$triggerLock] = !!value; return true; }
        if ((target = deref(target)) == null) return true;
        return Reflect.set(target, name, value);
    }

    // redirect to value key
    has(target, prop: keyType) { if ((target = deref(target)) == null) return false; return Reflect.has(target, prop); }
    apply(target, ctx, args) { if ((target = deref(target)) == null) return; return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { if ((target = deref(target)) == null) return; return Reflect.construct(target, args, newT); }
    ownKeys(target) { if ((target = deref(target)) == null) return; return Reflect.ownKeys(target); }
    isExtensible(target) { if ((target = deref(target)) == null) return; return Reflect.isExtensible(target); }
    getOwnPropertyDescriptor(target, key) {
        if ((target = deref(target)) == null) return;
        return Reflect.getOwnPropertyDescriptor(target, key);
    }

    deleteProperty(target, name: keyType) {
        if (name == $triggerLock) { this[$triggerLock] = false; return true; }
        if ((target = deref(target)) == null) return true;
        const result = Reflect.deleteProperty(target, name);
        return result;
    }
}

//
export class ReactiveSet {
    [$triggerLock]: boolean = false;
    constructor() {}

    //
    get(target, name: keyType, ctx) {
        const $reg = (subscriptRegistry).get(target);
        const registry = $reg ? new WeakRef($reg) : null;
        const sys = systemGet(target, name, registry); if (sys != null) return sys;
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        // redirect to value key
        if ((target = deref(target)) == null) return;
        const tp = (target[$extractKey$] ?? target[$originalKey$] ?? target);
        const valueOrFx = bindCtx(tp, /*Reflect.get(, name, ctx)*/tp?.[name]);
        if (typeof name == "symbol" && (name in target || target?.[name] != null)) { return valueOrFx; }

        //
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) { return (key = "value")=>{ registry?.deref()?.trigger?.(key, target?.[key], target?.[key], "@set"); }; }

        //
        if (name == "clear") {
            return () => {
                const oldValues = Array.from(target?.values?.() || []), result = valueOrFx();
                oldValues.forEach((oldValue)=>{ if (!this[$triggerLock]) { registry?.deref?.()?.trigger?.(null, null, oldValue); } });
                return result;
            };
        }

        //
        if (name == "delete") {
            return (value) => {
                const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
                if (!this[$triggerLock]) { registry?.deref()?.trigger?.(value, null, oldValue); }
                return result;
            };
        }

        //
        if (name == "add") {
            // TODO: add potentially async set
            return (value) => {
                const oldValue = target.has(value) ? value : null, result = valueOrFx(value);
                if (isNotEqual(oldValue, value)) { if (!this[$triggerLock]) { registry?.deref()?.trigger?.(value, value, oldValue); } };
                return result;
            };
        }

        //
        return valueOrFx;
    }

    //
    set(target, name: keyType, value) {
        if (name == $triggerLock) { this[$triggerLock] = !!value; return true; }
        if ((target = deref(target)) == null) return true;
        return Reflect.set(target, name, value);
    }

    // redirect to value key i
    has(target, prop: keyType) { if ((target = deref(target)) == null) return; return Reflect.has(target, prop); }
    apply(target, ctx, args) { if ((target = deref(target)) == null) return; return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { if ((target = deref(target)) == null) return; return Reflect.construct(target, args, newT); }
    ownKeys(target) { if ((target = deref(target)) == null) return; return Reflect.ownKeys(target); }
    isExtensible(target) { if ((target = deref(target)) == null) return; return Reflect.isExtensible(target); }
    getOwnPropertyDescriptor(target, key) {
        if ((target = deref(target)) == null) return;
        return Reflect.getOwnPropertyDescriptor(target, key);
    }

    //
    deleteProperty(target, name: keyType) {
        if (name == $triggerLock) { this[$triggerLock] = false; return true;}
        if ((target = deref(target)) == null) return true;
        const result = Reflect.deleteProperty(target, name);
        return result;
    }
}

//
export class ReactiveObject {
    [$triggerLock]: boolean = false;
    constructor() {}

    // supports nested "value" objects and values
    get(target, name: keyType, ctx) {
        const $reg = (subscriptRegistry).get(target);
        const registry = $reg ? new WeakRef($reg) : null;
        const sys = systemGet(target, name, registry); if (sys != null) return sys;
        const obs = observableAPIMethods(target, name, registry); if (obs != null) return obs;

        //
        // redirect to value key
        if ((target = deref(target, name == "value")) == null) return;
        if (name == $triggerLess) { return makeTriggerLess.call(this, this); }
        if (name == $trigger) { return (key = "value")=>{ registry?.deref()?.trigger?.(key, target?.[key], target?.[key], "@set"); }; }

        //
        if (typeof name == "symbol" && (name in target || target?.[name] != null)) { return target?.[name]; }
        if (name == Symbol.toPrimitive) { return (hint?)=>{ if ((target?.value != null || "value" in target) && (typeof target?.value != "object" && typeof target?.value != "string")) { return tryParseByHint(target.value, hint); }; return tryParseByHint(target?.[Symbol.toPrimitive]?.(), hint); } }
        if (name == "toString") { return () => { if (isPrimitive(target?.value)) { return String(target?.value ?? "") || ""; }; return target?.toString?.(); } }
        if (name == "valueOf" ) { return () => { if (isPrimitive(target?.value)) { return tryParseByHint(target.value); }; return tryParseByHint(target?.valueOf?.()); } }
        return bindCtx(target, target?.[name]);
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

        //
        if (name == $triggerLock) {
            this[$triggerLock] = false;
        }

        //
        if (!this[$triggerLock] && (name != $triggerLock && typeof name != "symbol")) { registry?.trigger?.(name, null, oldValue); }
        return result;
    }

    //
    getOwnPropertyDescriptor(target, key) {
        if ((target = deref(target)) == null) return;
        return Reflect.getOwnPropertyDescriptor(target, key);
    }

    // supports nested "value" objects
    has(target, prop: keyType) { if ((target = deref(target)) == null) return false; return (prop in target); }
    set(target, name: keyType, value) {
        if ((target = deref(target, name == "value")) == null) return;
        return potentiallyAsync(value, (v)=>{
            if (name == $triggerLock) { this[$triggerLock] = !!value; return true; }
            if (typeof name == "symbol" && !(target?.[name] != null && name in target)) return;
            const oldValue = target[name]; target[name] = v;
            if (!this[$triggerLock] && typeof name != "symbol" && isNotEqual(oldValue, v)) {
                (subscriptRegistry)?.get?.(target)?.trigger?.(name, v, oldValue);
            };
            return true;
        })
    }
}

//
export const makeReactiveArray  = <Under = any>(arr: Under[]): refValid<Under> => { return (arr?.[$extractKey$] ? arr : wrapWith(arr, new ReactiveArray())); };
export const makeReactiveObject = <Under = any>(obj: Under): refValid<Under> => { return (obj?.[$extractKey$] ? obj : wrapWith(obj, new ReactiveObject())); };
export const makeReactiveMap    = <Under = any, K = any>(map: Map<K, Under>): refValid<Under> => { return (map?.[$extractKey$] ? map : wrapWith(map, new ReactiveMap())); };
export const makeReactiveSet    = <Under = any, K = any>(set: Set<Under>): refValid<Under> => { return (set?.[$extractKey$] ? set : wrapWith(set, new ReactiveSet())); };
