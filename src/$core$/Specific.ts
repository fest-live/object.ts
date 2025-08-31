import { subscribe, unsubscribe } from "./Mainline";
import { subscriptRegistry, wrapWith } from "./Subscript";
import { $extractKey$, $originalKey$, $registryKey$, $triggerLock, $triggerLess, $value, $trigger } from "../$wrap$/Symbol";
import { isNotEqual, bindCtx, deref, type keyType, refValid } from "../$wrap$/Utils";

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
    if (name == Symbol.iterator)      { return target[name]?.bind?.(target) ?? (()=>registry?.deref?.()?.iterator); }
    if (name == Symbol.asyncIterator) { return target[name]?.bind?.(target) ?? (() => registry?.deref?.()?.iterator); }
    if (name == Symbol.dispose)       { return (prop?)=>{ target?.[Symbol.dispose]?.(prop); unsubscribe(prop != null ? [target, prop] : target)}; }
    if (name == Symbol.asyncDispose)  { return (prop?)=>{ target?.[Symbol.asyncDispose]?.(prop); unsubscribe(prop != null ? [target, prop] : target); } } // @ts-ignore
    if (name == Symbol.unsubscribe)   { return (prop?)=>unsubscribe(prop != null ? [target, prop] : target); }
    if (name == Symbol.toPrimitive)   { return (hint?)=>{ if ((target?.value != null || "value" in target) && (typeof target?.value != "object" && typeof target?.value != "function")) { return target.value; }; return target?.valueOf?.(); } }
    if (name == Symbol.toStringTag)   { return ()=>String(target?.value ?? "") || ""; }
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
const potentiallyAsync = (promise, cb)=>{
    if (promise instanceof Promise || typeof promise?.then == "function")
        { return promise?.then?.(cb); } else
        { return cb?.(promise); }
    return promise;
}

//
const potentiallyAsyncMap = (promise, cb)=>{
    if (promise instanceof Promise || typeof promise?.then == "function")
        { return promise?.then?.(cb); } else
        { return cb?.(promise); }
    return promise;
}

//
const makeTriggerLess = function(self){
    return (cb)=>{
        self[$triggerLock] = true;
        let result;
        try {
            result = cb?.();
        } finally {
            self[$triggerLock] = false;
        }
        return result;
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
                    if (isNotEqual(oldState[i], oldState[i]))
                        {setPairs.push([idx+i, oldState[i], oldState[i]]); }
                }
                break;
            // index assignment, args: [value, index]
            case "set": idx = args[1];
            setPairs.push([idx, args[0], oldState?.[idx] ?? null]); break;
        }

        // execute operation
        const result = Reflect.apply(target, ctx || this.#self, args);
        if (this.#handle?.[$triggerLock]) {
            if (Array.isArray(result)) { return makeReactiveArray(result); }
            return result;
        }

        // triggers on adding
        const reg = subscriptRegistry.get(this.#self);
        if (added?.length == 1) {
            reg?.trigger?.(idx, added[0], null, "@add");
        } else if (added?.length > 1) {
            reg?.trigger?.(idx, added, null, "@addAll");
            added.forEach((item, I)=>reg?.trigger?.(idx+I, item, null, "@add"));
        }

        // triggers on removing
        if (removed?.length == 1) {
            reg?.trigger?.(idx, null, removed[0], "@remove");
        } else if (removed?.length > 1) {
            reg?.trigger?.(idx, null, removed, "@removeAll");
            removed.forEach((item, I)=>reg?.trigger?.(idx+I, null, item, "@remove"));
        }

        // triggers on changing
        if (setPairs?.length == 1) {
            reg?.trigger?.(setPairs[0]?.[0] ?? idx, setPairs[0]?.[1], setPairs[0]?.[2], "@set");
        } else if (setPairs?.length > 1) {
            reg?.trigger?.(idx, setPairs, oldState, "@setAll");
            setPairs.forEach((pair, I)=>reg?.trigger?.(pair?.[0] ?? idx+I, pair?.[1], pair?.[2], "@set"));
        }

        //
        if (result == target) { return new Proxy(result as any, this.#handle); };
        if (Array.isArray(result)) { return makeReactiveArray(result); }
        return result;
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
            if (!Number.isInteger(parseInt(name))) { return Reflect.set(target, name, value); };
            name = parseInt(name);
        }
        const old = target?.[name];
        const got = Reflect.set(target, name, value);

        //
        if (!this[$triggerLock]) {
            const $reg = (subscriptRegistry).get(target);
            $reg?.trigger?.(name, value, old, "@set");
        }
        return got;
    }

    //
    deleteProperty(target, name) {
        const old = target?.[name];
        const got = Reflect.deleteProperty(target, name);

        //
        if (!this[$triggerLock]) {
            const $reg = (subscriptRegistry).get(target);
            $reg?.trigger?.(name, name, old, "@delete");
        }
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

    // redirect to value key
    has(target, prop: keyType) { if ((target = deref(target)) == null) return false; return Reflect.has(target, prop); }
    apply(target, ctx, args) { if ((target = deref(target)) == null) return; return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { if ((target = deref(target)) == null) return; return Reflect.construct(target, args, newT); }
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

    // redirect to value key i
    has(target, prop: keyType) { if ((target = deref(target)) == null) return; return Reflect.has(target, prop); }
    apply(target, ctx, args) { if ((target = deref(target)) == null) return; return Reflect.apply(target, ctx, args); }
    construct(target, args, newT) { if ((target = deref(target)) == null) return; return Reflect.construct(target, args, newT); }
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
        if (name == Symbol.toPrimitive) { return (hint?)=>{ if ((target?.value != null || "value" in target) && (typeof target?.value != "object" && typeof target?.value != "string")) { return target.value; }; return target?.[Symbol.toPrimitive]?.(); } }
        if (name == "toString") { return () => (((typeof target?.value == "string") ? target?.value : target?.toString?.()) || ""); }
        if (name == "valueOf" ) { return () => { if ((target?.value != null || "value" in target) && (typeof target?.value != "object" && typeof target?.value != "string")) { return target.value; }; return target?.valueOf?.(); } }
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
        if (!this[$triggerLock]) { registry?.trigger?.(name, null, oldValue); }
        return result;
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
        return potentiallyAsync(value, (v)=>{
            if (typeof name == "symbol" && (name in target || target?.[name] != null)) return;
            const oldValue = target[name], result = Reflect.set(target, name, v);
            if (isNotEqual(oldValue, v)) { if (!this[$triggerLock]) { registry?.trigger?.(name, v, oldValue); } };
            return result;
        })
    }
}

//
export const makeReactiveArray  = <Under = any>(arr: Under[]): refValid<Under> => { return (arr?.[$extractKey$] ? arr : wrapWith(arr, new ReactiveArray())); };
export const makeReactiveObject = <Under = any>(obj: Under): refValid<Under> => { return (obj?.[$extractKey$] ? obj : wrapWith(obj, new ReactiveObject())); };
export const makeReactiveMap    = <Under = any, K = any>(map: Map<K, Under>): refValid<Under> => { return (map?.[$extractKey$] ? map : wrapWith(map, new ReactiveMap())); };
export const makeReactiveSet    = <Under = any, K = any>(set: Set<Under>): refValid<Under> => { return (set?.[$extractKey$] ? set : wrapWith(set, new ReactiveSet())); };
