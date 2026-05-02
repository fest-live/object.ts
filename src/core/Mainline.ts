/**
 * Subscription and derivation pipeline for `object.ts`.
 *
 * This module resolves how callbacks subscribe to observable values, tuples,
 * promises, DOM inputs, and iteration sources, then builds higher-level
 * combinators like `assign`, `link`, `computed`, and `derivate`.
 */
import { callByAllProp, callByProp, hasValue, isKeyType, isNotEqual, isPrimitive, objectAssign } from "fest/core";
import { $extractKey$, $registryKey$, $affected, $trigger, $realProp } from "../wrap/Symbol";
import { addToCallChain, safe, withPromise, type keyType, type observeValid, type subValid, isThenable } from "../wrap/Utils";
import { effectGlobally, normalizeAffectedOptions, normalizeEffectOptions, subscriptRegistry, triggerFilterAllows, type AffectedCallback, type AffectedConfig, type EffectCallback, type EffectConfig, type EffectEvent, type TriggerName } from "./Subscript";
import { observableBySet, observableByMap } from "./Assigned";
import { isObservable } from "./Primitives";

/** Attach the Observable-compatible hook used by some external reactive ecosystems. */
export const useObservable = <Under = any>(unwrap: any): observeValid<Under> => { // @ts-ignore
    if (unwrap == null || (typeof unwrap != "object" && typeof unwrap != "function") || unwrap?.[Symbol.observable] != null) { return unwrap; } // @ts-ignore
    try { unwrap[Symbol.observable] = self?.compatible; } catch (e) { console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks"); };
    unwrap[$affected] = (cb, prop?, options?: AffectedConfig)=>{ // @ts-ignore
        const observable = unwrap?.[Symbol?.observable];
        observable?.()?.affected?.(cb, prop, options);
        return () => observable?.()?.unaffected?.(cb, prop);
    }; // @ts-ignore
    return unwrap;
}

//
type callable = AffectedCallback;
type subscript = (target: any, prop: keyType | null, cb: callable, options?: AffectedConfig) => any;
export const specializedSubscribe = new WeakMap<any, subscript>();

//
const checkValidObj = (obj: any) => {
    if (typeof obj == "symbol" || obj == null || !(typeof obj == "object" || typeof obj == "function")) return;
    return obj;
}

const initialTrigger: TriggerName = "initial";
const realPropOf = (target: any): keyType | null => {
    const prop = target?.[$realProp] ?? target?.realProp;
    return isKeyType(prop) ? prop : null;
}
const normalizeAffectedProp = (target: any, prop: keyType | null) => {
    const realProp = realPropOf(target);
    if (realProp != null && (prop == null || prop == "value")) return realProp;
    return prop;
}
const propValueOf = (target: any, prop: keyType | null) => {
    if (prop != null && prop == realPropOf(target)) return target?.value;
    return target?.[prop as any];
}
const callByPropRefAware = (target: any, prop: keyType | null, cb: callable, ctx: any) => {
    if (prop != null && prop == realPropOf(target)) {
        const value = propValueOf(target, prop);
        if (value != null) return cb?.(value, prop, null, "set");
    }
    return callByProp(target, prop as any, cb, ctx);
}
const withTrigger = (cb: callable, options: AffectedConfig, trigger: TriggerName) => {
    const normalized = normalizeAffectedOptions(options);
    if (trigger == initialTrigger) {
        if (!normalized.triggerImmediately) return;
    } else if (!triggerFilterAllows(normalized.affectTypes, trigger)) return;

    return (value: any, name: keyType | null, oldValue?: any, ...etc: any[]) => cb?.(value, name, oldValue, trigger, ...etc);
}

/** Default subscription strategy for already-observable targets. */
export const subscribeDirectly: subscript = (target: any, prop: keyType | null, cb: callable, options: AffectedConfig = ["*"]) => { if (!target) return;
    if (!checkValidObj(target)) return;
    const tProp = (prop != Symbol.iterator) ? normalizeAffectedProp(target, prop) : null;

    //
    let registry = target?.[$registryKey$] ?? (subscriptRegistry).get(target);

    //
    target = target?.[$extractKey$] ?? target;

    //
    queueMicrotask(() => {
        const initialCb = withTrigger(cb, options, initialTrigger);
        if (!initialCb) return;
        if (tProp != null && tProp != Symbol.iterator) { callByPropRefAware(target, tProp, initialCb, null); } else { callByAllProp(target, initialCb, null); }
    });

    //
    let unSub: any = registry?.affected?.(cb, tProp, options);
    if (target?.[Symbol.dispose]) return unSub;

    //
    addToCallChain(unSub, Symbol.dispose, unSub);
    addToCallChain(unSub, Symbol.asyncDispose, unSub);
    addToCallChain(target, Symbol.dispose, unSub);
    addToCallChain(target, Symbol.asyncDispose, unSub);
    return unSub;
}

/** Subscription adapter for DOM inputs, mapping `change` events onto reactive callbacks. */
export const subscribeInput: subscript = (tg: HTMLInputElement, _: keyType | null, cb: callable, options: AffectedConfig = ["*"]) => {
    // inputs now can be regally subscribed directly
    const affectTypes = normalizeAffectedOptions(options).affectTypes;
    const $opt: any = { }; let oldValue = tg?.value;
    const $cb = (ev: any) => {
        const value = ev?.target?.value;
        if (triggerFilterAllows(affectTypes, "set")) cb?.(value, "value", oldValue, "set", ev);
        oldValue = value;
    };
    (tg as any)?.addEventListener?.("change", $cb, $opt);
    return () => (tg as any)?.removeEventListener?.("change", $cb, $opt);
}

//
const checkIsPaired = (tg: any) => {
    return (Array.isArray(tg) && tg?.length == 2 && checkValidObj(tg?.[0])) && (isKeyType(tg?.[1]) || tg?.[1] == Symbol.iterator);
}

const isEffectOptionsArg = (value: any): value is EffectConfig => {
    return !!value && typeof value == "object" && !Array.isArray(value) && (
        "affectTypes" in value ||
        "triggers" in value ||
        "triggerImmediately" in value
    );
}

const normalizeEffectTargets = (targets: any) => {
    if (targets == null) return [];
    if (Array.isArray(targets) && !checkIsPaired(targets) && !isObservable(targets)) return targets;
    return [targets];
}

const effectTargetContext = (source: any) => {
    if (checkIsPaired(source)) {
        const target = source?.[0];
        return { source, target, prop: normalizeAffectedProp(target, source?.[1] as keyType) };
    }
    return { source, target: source, prop: null };
}

const toEffectEvent = (source: any, target: any, value: any, prop: keyType | null, oldValue: any, trigger: TriggerName, args: any[]): EffectEvent => ({
    source,
    target,
    value,
    prop,
    name: prop,
    oldValue,
    trigger,
    args,
});

/** Subscription adapter for `[target, prop]` tuples. */
export const subscribePaired: subscript = <Under = any>(tg: subValid<Under>, _: keyType | null, cb: callable, options: AffectedConfig = ["*"]) => {
    const prop = isKeyType(tg?.[1]) ? tg?.[1] : null;
    return affected(tg?.[0], prop, cb, options);
}

/** Defer subscription until a thenable source resolves. */
export const subscribeThenable: subscript = (obj: any, prop: keyType | null, cb: callable, options: AffectedConfig = ["*"]) => {
    return obj?.then?.((obj: any) => affected?.(obj, prop, cb, options))?.catch?.((e: any) => { console.warn(e); return null; });
}

// Trigger filters use compact operation names (`set`, `add`, `delete`, `manual`, `custom`, ...).
// Legacy aliases such as `setter` and `@set` are normalized in Subscript.

//
/** `function` (not `const`) so circular imports from Assigned/Primitives cannot hit TDZ during bundle init. */
export function affected(obj: any, prop: keyType | callable | null, cb: callable | AffectedConfig = ()=>{}, options?: AffectedConfig) {
    if (typeof prop == "function") { options = cb as AffectedConfig; cb = prop; prop = null; }
    prop = normalizeAffectedProp(obj, prop);

    //
    if (isPrimitive(obj) || typeof obj == "symbol") {
        return queueMicrotask(() => {
            const normalized = normalizeAffectedOptions(options);
            if (normalized.triggerImmediately) return (cb as callable)?.(obj, null as any, null, null, initialTrigger);
        });
    }
    if (typeof obj?.[$affected] == "function") {
        return obj?.[$affected]?.(cb, prop, options);
    } else
    if (checkValidObj(obj)) {
        const wrapped = obj;
        obj = obj?.[$extractKey$] ?? obj;
        if (specializedSubscribe?.has?.(obj)) {
            return specializedSubscribe?.get?.(obj)?.(wrapped, prop, cb as callable, options);
        }

        //
        if (isObservable(wrapped) || (checkIsPaired(obj) && isObservable(obj?.[0]))) {
            // when no exists, add a new specialized subscribe function
            if (isThenable(obj)) //@ts-ignore
                { return specializedSubscribe?.getOrInsert?.(obj, subscribeThenable)?.(obj, prop, cb, options); } else
            if (checkIsPaired(obj))  //@ts-ignore
                { return specializedSubscribe?.getOrInsert?.(obj, subscribePaired)?.(obj, prop, cb, options); } else
            if (typeof HTMLInputElement != "undefined" && obj instanceof HTMLInputElement)  //@ts-ignore
                { return specializedSubscribe?.getOrInsert?.(obj, subscribeInput)?.(obj, prop, cb, options); } else  //@ts-ignore
                { return specializedSubscribe?.getOrInsert?.(obj, subscribeDirectly)?.(wrapped, prop, cb, options); }
        } else {
            return queueMicrotask(() => {
                const initialCb = withTrigger(cb as callable, options, initialTrigger);
                if (!initialCb) return;
                if (checkIsPaired(obj)) { return callByPropRefAware?.(obj?.[0], obj?.[1] as any, initialCb, null); }
                if (prop != null && prop != Symbol.iterator) { return callByPropRefAware?.(obj, prop, initialCb, null); }
                return callByAllProp?.(obj, initialCb, null);
            });
        }
    }
}

/**
 * Subscribe to one or many reactive triggers and receive a structured event.
 *
 * Unlike `affected()`, `effect()` is callback-first and reports the source that
 * registered or emitted the event. It does not emit initial events by default.
 */
export function effect(cb: EffectCallback, targets?: any | EffectConfig, options?: EffectConfig) {
    if (cb == null || typeof cb != "function") return;
    if (isEffectOptionsArg(targets) && options === undefined) {
        return effectGlobally(cb, targets);
    }
    if (targets == null) {
        return effectGlobally(cb, options);
    }

    const normalized = normalizeEffectOptions(options);
    const affectedOptions: AffectedConfig = {
        affectTypes: normalized.affectTypes,
        triggerImmediately: normalized.triggerImmediately,
    };
    const disposers = normalizeEffectTargets(targets).map((source) => {
        const ctx = effectTargetContext(source);
        return affected(ctx.target, ctx.prop, (value, prop, oldValue, trigger, ...args) => {
            return cb(toEffectEvent(ctx.source, ctx.target, value, prop, oldValue, trigger ?? null, args));
        }, affectedOptions);
    }).filter((dispose) => typeof dispose == "function");

    return () => disposers.forEach((dispose) => dispose?.());
}

/** Target-first alias for `effect()` when that reads better at the callsite. */
export function effected(targets: any, cb: EffectCallback, options?: EffectConfig) {
    return effect(cb, targets, options);
}

/** Normalize collection inputs into observable array-like views when iteration matters. */
export const makeArrayObservable = (tg)=>{
    if (tg instanceof Set) return observableBySet(tg);
    if (tg instanceof Map) return observableByMap(tg);
    return tg;
}

/** Two-level WeakMap used to memoize subscriptions keyed by `[target, callback]` pairs. */
export class DoubleWeakMap {
    #top = new WeakMap(); // key1 -> WeakMap(key2 -> value)
  
    #ensureInner(key1) {
        let inner = this.#top.get(key1);
        if (!inner) {
            inner = new WeakMap();
            this.#top.set(key1, inner);
        }
        return inner;
    }
  
    #splitPair(pair) {
        if (!Array.isArray(pair) || pair.length !== 2) {
            //throw new TypeError("Key must be a pair: [keyL1, keyL2]");
            return [null, null];
        }
        return pair;
    }

    hasL1(key1) {
        return this.#top.has(key1);
    }
  
    set(pair, value) {
        const [key1, key2] = this.#splitPair(pair);
        this.#ensureInner(key1).set(key2, value);
        return this;
    }
  
    get(pair) {
        const [key1, key2] = this.#splitPair(pair);
        return this.#top.get(key1)?.get(key2);
    }
  
    has(pair) {
        const [key1, key2] = this.#splitPair(pair);
        return this.#top.get(key1)?.has(key2) ?? false;
    }
  
    delete(pair) {
        const [key1, key2] = this.#splitPair(pair);
        const inner = this.#top.get(key1);
        return inner ? inner.delete(key2) : false;
    }
  
    deleteTop(key1) {
        return this.#top.delete(key1);
    }
  
    // Уже было: универсальный get-or-create (синонимно логике "computed")
    getOrCreate(pair, factory) {
        const [key1, key2] = this.#splitPair(pair);
        const inner = this.#ensureInner(key1);
    
        if (inner.has(key2)) return inner.get(key2);
    
        const value = factory();
        inner.set(key2, value);
        return value;
    }
  
    // getOrInsert: если нет — вставить *переданное* значение (без вычисления)
    getOrInsert(pair, value) {
        const [key1, key2] = this.#splitPair(pair);
        const inner = this.#ensureInner(key1);
    
        if (inner.has(key2)) return inner.get(key2);
    
        inner.set(key2, value);
        return value;
    }
  
    // getOrInsertComputed: если нет — вычислить через fn(pair) и вставить
    // (удобно, когда надо использовать ключи в вычислении)
    getOrInsertComputed(pair, compute) {
        const [key1, key2] = this.#splitPair(pair);
        const inner = this.#ensureInner(key1);
    
        if (inner.has(key2)) return inner.get(key2);
    
        const value = compute([key1, key2]);
        inner.set(key2, value);
        return value;
    }
}

//
const registeredIterated = new DoubleWeakMap();

/**
 * Subscribe to iteration-level changes for arrays, sets, maps, and ref-like
 * containers whose `value` should itself be treated as a collection.
 */
export function iterated<T = any>(tg: subValid<T>, cb: callable, options: AffectedConfig = ["*"]) {
    if (!tg) return;

    //
    if (registeredIterated.has([tg, cb])) { return registeredIterated.get([tg, cb]); }

    //
    const $sub: callable = (value: any, name: keyType | null, old?: any, trigger?: TriggerName) => {
        if (name == "value") {
            //TODO: needs notify, that elements of arrayold is removed
            const entries = (old?.value ?? old)?.entries?.();
            const basis = (tg as any)?.value ?? value?.value ?? value;

            //
            if (entries) {
                for (const [idx, item] of entries) {
                    const ofOld = item ?? ((old?.value ?? old)?.[idx] ?? null);
                    const ofNew = basis?.[idx];
                    if (ofOld == null && ofNew != null) {
                        cb(ofNew, idx, null, "add");
                    } else if (ofOld != null && ofNew == null) {
                        cb(null, idx, ofOld, "delete");
                    } else if (isNotEqual(ofOld, ofNew)) {
                        cb(ofNew, idx, ofOld, "set");
                    }
                }
            }
            
            //
            return iterated(value ?? (tg as any)?.value, cb, options);
        }
        return name == null ? undefined : tg[name];
    }

    // @ts-ignore
    return registeredIterated.getOrInsertComputed([tg, cb], () => {
        if (tg instanceof Set) { return affected([observableBySet(tg) as T, Symbol.iterator], cb, options); }
        if (tg instanceof Map) { return affected(tg, cb, options); }
        if (hasValue(tg)) { return affected(tg, $sub, options); }
        if (Array.isArray(tg) && !(tg?.length == 2 && isKeyType(tg?.[1]) && isObservable(tg?.[0]))) { return affected([tg, Symbol.iterator], cb, options); }
        return affected(tg, cb, options);
    });
}

/** Remove a previously registered subscription. */
export function unaffected<T = any>(tg: T, cb?: callable) {
    return withPromise(tg, (target: any) => {
        const isPair = Array.isArray(target) && target?.length == 2 && ["object", "function"].indexOf(typeof target?.[0]) >= 0 && isKeyType(target?.[1]);
        const prop = isPair ? target?.[1] : null; target = (isPair && prop != null) ? (target?.[0] ?? target) : target;
        const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
        let self = target?.[$registryKey$] ?? (subscriptRegistry).get(unwrap);
        self?.unaffected?.(cb, prop);
    });
}

/** Mirror changes from a reactive source into a plain target, with optional reverse watching hook. */
export const bindBy = <Under = any>(target, reactive: subValid<Under>, watch?) => {
    affected(reactive, null, (v, p) => { objectAssign(target, v, p, true); });
    watch?.(() => target, (N) => { for (const k in N) { objectAssign(reactive, N[k], k, true); } }, { deep: true });
    return target;
};

/** Derive a plain target object from a source by combining `safe()` cloning with `bindBy()`. */
export const derivate = <Under = any, T = observeValid<Under>>(from, reactFn: (value: any) => any, watch?) => bindBy(reactFn(safe(from)), from, watch);
export const bindByKey = <Under = any>(target, reactive: subValid<Under>, key = () => "") => affected(reactive, null, (value, p) => { if (p == key()) { objectAssign(target, value, null, true); } });
