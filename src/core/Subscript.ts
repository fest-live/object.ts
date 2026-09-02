/*
 * Filename: Subscript.ts
 * FullPath: modules/projects/object.ts/src/core/Subscript.ts
 * Change date and time: 14.09.00_27.07.2026
 * Reason for changes: Drop Promise.allSettled in #dispatch — recursive async
 * listener returns must not block/hang the reactivity pipeline.
 */
/**
 * Listener registry and proxy wrapper backbone for `object.ts`.
 *
 * The `Subscript` class stores callbacks, batches dispatches, exposes a
 * minimal Observable-compatible surface, and helps observable wrappers share
 * one registry per underlying target.
 *
 * INVARIANT: dispatch never awaits or aggregates listener Promises.
 * Async returns are fire-and-forget (rejection → console.warn only).
 */
import { $extractKey$ } from "../wrap/Symbol";
import { deref, type keyType } from "../wrap/Utils";

export type TriggerName = string | null;
export type TriggerFilterList = Iterable<string> | string | null | undefined;
export type AffectedOptions = {
    affectTypes?: TriggerFilterList;
    triggers?: TriggerFilterList;
    triggerImmediately?: boolean;
};
export type AffectedConfig = TriggerFilterList | AffectedOptions;
export type AffectedCallback = (value: any, name: keyType | null, oldValue?: any, trigger?: TriggerName, ...etc: any[]) => void;
export type EffectEvent = {
    source: any;
    target: any;
    value: any;
    prop: keyType | null;
    name: keyType | null;
    oldValue?: any;
    trigger?: TriggerName;
    args: any[];
};
export type EffectCallback = (event: EffectEvent) => void;
export type EffectOptions = AffectedOptions;
export type EffectConfig = TriggerFilterList | EffectOptions;
export type TriggerControl = {
    enable(types?: TriggerFilterList, cb?: () => any): any;
    disable(types?: TriggerFilterList, cb?: () => any): any;
    set(types: TriggerFilterList, enabled: boolean): void;
    with(types: TriggerFilterList, cb: () => any): any;
    without(types: TriggerFilterList, cb: () => any): any;
    isEnabled(trigger: TriggerName): boolean;
};

/** Same shape as `WR` in `fest/core` (`WRef.ts`). Inlined so SW/dev bundles never need a `WR` runtime export from core. */
type WR<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => WR<R> | null : T[K] | null;
};

/** Track disposer rewrites for Observable-style subscribers so completion also unsubscribes. */
const withUnsubSymbol = Symbol.for("object.ts@withUnsub");
globalThis[withUnsubSymbol] ??= new WeakMap();
const withUnsub = globalThis[withUnsubSymbol];

/** Complete with unsubscription helper. */
const completeWithUnsub = (subscriber, weak: WeakRef<any> | WR<any>, handler: Subscript) => {
    // @ts-ignore
    return withUnsub.getOrInsert(subscriber, () => {
        const registry = weak?.deref?.(); registry?.affected?.(handler);
        const savComplete = subscriber?.complete?.bind?.(subscriber);
        const unaffected = () => { const r = savComplete?.(); registry?.unaffected?.(handler); return r; };
        subscriber.complete = unaffected;
        return {
            unaffected,
            [Symbol.dispose]: unaffected,
            [Symbol.asyncDispose]: unaffected,
        }
    });
}

/** Global registry that maps raw targets to their `Subscript` instance. */
const subscriptRegistrySymbol = Symbol.for("object.ts@subscriptRegistry");
globalThis[subscriptRegistrySymbol] ??= new WeakMap<any, Subscript>();
export const subscriptRegistry = globalThis[subscriptRegistrySymbol] ??= new WeakMap<any, Subscript>();

/** Global registry that maps effect callbacks to their trigger filters. */
const globalEffectListenersSymbol = Symbol.for("object.ts@globalEffectListeners");
globalThis[globalEffectListenersSymbol] ??= new Map<EffectCallback, Set<string>>();
const globalEffectListeners = globalThis[globalEffectListenersSymbol];

export const effectGlobally = (cb: EffectCallback, options: EffectConfig = ["*"]) => {
    if (cb == null || typeof cb != "function") return;
    const normalized = normalizeEffectOptions(options);
    globalEffectListeners.set(cb, normalized.affectTypes);
    return () => globalEffectListeners.delete(cb);
}

/** Global registry that maps wrapped targets to their `Subscript` instance. */
const wrappedSymbol = Symbol.for("object.ts@wrapped");
globalThis[wrappedSymbol] ??= new WeakMap();;
const wrapped = globalThis[wrappedSymbol];

/** Ensure a target has a registry before reusing or returning a reactive handle. */
export const register = (what: any, handle: any): any => {
    const unwrap = what?.[$extractKey$] ?? what;
    let registry = subscriptRegistry.get(unwrap);
    if (!registry) {
        registry = new Subscript(unwrap);
        subscriptRegistry.set(unwrap, registry);
    } else {
        registry.bindSource(unwrap);
    }
    return handle;
}

/** Wrap a raw target in a proxy backed by the provided handler, memoized per original object. */
export const wrapWith = (what: any, handle: any): any => {
    what = deref(what?.[$extractKey$] ?? what);
    if (typeof what == "symbol" || !(typeof what == "object" || typeof what == "function") || what == null) return what; // @ts-ignore
    return wrapped.getOrInsertComputed(what, () => new Proxy(what, register(what, handle)));
}; // !experimental `getOrInsert` feature!

//
const forAll = Symbol.for("@allProps");
const wildcardTriggers = new Set(["*", "all"]);
const triggerAliases = new Map<string, string[]>([
    ["set", ["setter", "@set"]],
    ["add", ["@add"]],
    ["delete", ["@delete"]],
    ["invalidate", ["@invalidate"]],
    ["manual", ["@manual"]],
    ["custom", ["@custom"]],
    ["resolved", ["@resolved"]],
    ["setAll", ["@setAll"]],
    ["addAll", ["@addAll"]],
    ["deleteAll", ["@deleteAll", "@clear"]],
]);

/** Global registry that maps trigger aliases to their canonical names. */
const triggerCanonicalNamesSymbol = Symbol.for("object.ts@triggerCanonicalNames");
globalThis[triggerCanonicalNamesSymbol] ??= new Map(
    Array.from(triggerAliases.entries()).flatMap(([canonical, aliases]) => aliases.map((alias) => [alias, canonical]))
);
const triggerCanonicalNames = globalThis[triggerCanonicalNamesSymbol];

export const normalizeTriggerName = (trigger: TriggerName = "set"): TriggerName => {
    if (trigger == null) return trigger;
    const name = String(trigger || "set");
    return triggerCanonicalNames.get(name) ?? name;
}

const triggerNamesOf = (trigger: TriggerName) => {
    const name = trigger == null ? "all" : String(normalizeTriggerName(trigger) ?? "all");
    return [name, ...(triggerAliases.get(name) ?? [])];
}

const expandTriggerFilter = (types: TriggerFilterList = ["*"]) => {
    return new Set([...normalizeTriggerFilter(types)].flatMap((name) => [name, ...(triggerAliases.get(name) ?? [])]));
}

export const normalizeTriggerFilter = (triggers: TriggerFilterList = ["*"]) => {
    const list = typeof triggers == "string" ? [triggers] : Array.from(triggers ?? ["*"]);
    const normalized = new Set(list.map((item) => {
        const name = String(item || "*");
        return wildcardTriggers.has(name) ? name : String(normalizeTriggerName(name) ?? name);
    }));
    return normalized.size ? normalized : new Set(["*"]);
}

export const triggerFilterAllows = (triggers: TriggerFilterList | Set<string>, trigger: TriggerName) => {
    const filter = triggers instanceof Set ? triggers : normalizeTriggerFilter(triggers);
    return [...wildcardTriggers].some((name) => filter.has(name)) || triggerNamesOf(trigger).some((name) => filter.has(name));
}

const isOptionsObject = (options: AffectedConfig | EffectConfig): options is AffectedOptions | EffectOptions => {
    return !!options && typeof options == "object" && !Array.isArray(options) && (
        "affectTypes" in options ||
        "triggers" in options ||
        "triggerImmediately" in options
    );
}

export const normalizeAffectedOptions = (options: AffectedConfig = ["*"]) => {
    if (isOptionsObject(options)) {
        return {
            affectTypes: normalizeTriggerFilter(options.affectTypes ?? options.triggers ?? ["*"]),
            triggerImmediately: options.triggerImmediately !== false,
        };
    }

    const affectTypes = normalizeTriggerFilter(options);
    return {
        affectTypes,
        triggerImmediately: triggerFilterAllows(affectTypes, "initial"),
    };
}

export const normalizeEffectOptions = (options: EffectConfig = ["*"]) => {
    if (isOptionsObject(options)) {
        return {
            affectTypes: normalizeTriggerFilter(options.affectTypes ?? options.triggers ?? ["*"]),
            triggerImmediately: options.triggerImmediately === true,
        };
    }

    return {
        affectTypes: normalizeTriggerFilter(options),
        triggerImmediately: false,
    };
}

type ListenerRecord = {
    prop: keyType | null | typeof forAll;
    triggers: Set<string>;
};

/** Central subscription registry with batched dispatch and Observable interoperability helpers. */
type Subscript = typeof Subscript;
const SubscriptSymbol = Symbol.for("object.ts@Subscript");
globalThis[SubscriptSymbol] ??= class Subscript {
    compatible: any;
    #source: any;
    #listeners: Map<AffectedCallback, ListenerRecord>;
    #flags = new WeakSet();
    #native: any;
    #iterator: any;
    #inDispatch = new Set<keyType>();
    #disabledTriggers = new Set<string>();
    #triggerControl: TriggerControl;

    // было: #triggerLock = new Set<keyType>();
    #pending = new Map<keyType | null, [keyType | null, any, any, any[]]>();
    #pendingByProp = new Map<keyType | null, Map<string, [keyType | null, any, any, TriggerName, any[]]>>();
    #flushScheduled = false;

    constructor(source?: any) {
        this.#source = source;
        this.#listeners = new Map();
        this.#flags = new WeakSet();
        this.#triggerControl = {
            enable: (types: TriggerFilterList = ["*"], cb?: () => any) => cb ? this.withTriggers(types, true, cb) : this.setTriggersEnabled(types, true),
            disable: (types: TriggerFilterList = ["*"], cb?: () => any) => cb ? this.withTriggers(types, false, cb) : this.setTriggersEnabled(types, false),
            set: (types: TriggerFilterList, enabled: boolean) => this.setTriggersEnabled(types, enabled),
            with: (types: TriggerFilterList, cb: () => any) => this.withTriggers(types, true, cb),
            without: (types: TriggerFilterList, cb: () => any) => this.withTriggers(types, false, cb),
            isEnabled: (trigger: TriggerName) => this.isTriggerEnabled(trigger),
        };

        this.#iterator = {
            next: (args: any) => {
                if (args) {
                    Array.isArray(args) ? this.#dispatch(...(args as [any, any, any, any])) : this.#dispatch(args);
                }
            }
        };

        const weak = new WeakRef(this);
        const controller = function (subscriber) {
            const handler = subscriber?.next?.bind?.(subscriber);
            return completeWithUnsub(subscriber, weak, handler);
        };

        // @ts-ignore
        this.#native = (typeof Observable != "undefined" ? (new Observable(controller)) : null)
        this.compatible = () => this.#native;
    }

    bindSource(source: any) {
        this.#source ??= source;
        return this;
    }

    /**
     * Run one listener with re-entrancy guard (recursive $safeExec on same cb skipped).
     *
     * WHY: never return/await listener Promises — a never-settling or
     * recursively awaiting Promise would stall callers that used to
     * Promise.allSettled the dispatch batch.
     */
    $safeExec(cb, ...args) {
        if (!cb || this.#flags.has(cb)) return;
        this.#flags.add(cb);

        //
        try {
            const res = cb(...args);
            // Fire-and-forget: swallow rejection, do not propagate Thenable.
            if (res && typeof (res as any).then === "function") {
                (res as Promise<any>).catch(console.warn);
                return;
            }
            return res;
        } catch (e) {
            console.warn(e);
        } finally {
            this.#flags.delete(cb);
        }
    }

    /**
     * Invoke matching listeners synchronously.
     *
     * INVARIANT: does not collect, await, or return Promise.all* over listener
     * results. Async listeners run detached; hangs must not block the pipeline.
     */
    #dispatch(name, value = null, oldValue?: any, trigger: TriggerName = "all", ...etc: any[]) {
        trigger = normalizeTriggerName(trigger) ?? trigger;
        const listeners = this.#listeners;
        if (listeners?.size) {
            for (const [cb, record] of listeners.entries()) {
                if (
                    (record.prop === name || record.prop === forAll || record.prop === null) &&
                    triggerFilterAllows(record.triggers, trigger)
                ) {
                    this.$safeExec(cb, value, name, oldValue, trigger, ...etc);
                }
            }
        }

        if (globalEffectListeners.size) {
            const event: EffectEvent = {
                source: this.#source,
                target: this.#source,
                value,
                prop: name,
                name,
                oldValue,
                trigger,
                args: etc,
            };
            for (const [cb, triggers] of globalEffectListeners.entries()) {
                if (triggerFilterAllows(triggers, trigger)) {
                    this.$safeExec(cb, event);
                }
            }
        }
    }

    wrap(nw: any[] | unknown) { if (Array.isArray(nw)) return wrapWith(nw, this); return nw; }

    get triggerControl() { return this.#triggerControl; }

    isTriggerEnabled(trigger: TriggerName) {
        return !triggerFilterAllows(this.#disabledTriggers, "all") && !triggerNamesOf(trigger).some((name) => this.#disabledTriggers.has(name));
    }

    setTriggersEnabled(types: TriggerFilterList = ["*"], enabled = true) {
        const names = expandTriggerFilter(types);
        for (const name of names) {
            if (enabled) this.#disabledTriggers.delete(name);
            else this.#disabledTriggers.add(name);
        }
    }

    withTriggers(types: TriggerFilterList, enabled: boolean, cb: () => any) {
        const names = [...expandTriggerFilter(types)];
        const previous = new Map(names.map((name) => [name, this.#disabledTriggers.has(name)]));
        const restore = () => {
            previous.forEach((wasDisabled, name) => {
                if (wasDisabled) this.#disabledTriggers.add(name);
                else this.#disabledTriggers.delete(name);
            });
        };

        this.setTriggersEnabled(names, enabled);
        try {
            const result = cb?.();
            if (result && typeof (result as any).finally == "function") return (result as Promise<any>).finally(restore);
            restore();
            return result;
        } catch (e) {
            restore();
            throw e;
        }
    }

    affected(cb: AffectedCallback, prop?: keyType | null, options: AffectedConfig = ["*"]) {
        if (cb == null || typeof cb != "function") return;
        const normalized = normalizeAffectedOptions(options);
        this.#listeners.set(cb, {
            prop: prop || forAll,
            triggers: normalized.affectTypes,
        });
        return () => this.unaffected(cb, prop || forAll);
    }

    unaffected(cb?: AffectedCallback, prop?: keyType | null) {
        if (cb != null && typeof cb == "function") {
            const listeners = this.#listeners;
            const record = listeners?.get(cb);
            if (record && (record.prop == prop || prop == null || prop == forAll)) {
                listeners.delete(cb);
                return () => this.affected(cb, prop || forAll, record.triggers);
            }
        }
        return this.#listeners.clear();
    }

    /**
     * Коалесит триггеры:
     * - один dispatch на name за микро-тик
     * - повторные trigger(name) до flush не вызывают повторно dispatch, а лишь обновляют аргументы
     * - другие name не блокируются
     */
    /**
     * Queue and coalesce trigger events by property and trigger type per microtask.
     *
     * WHY: hot mutation paths can emit many intermediate writes; batching keeps
     * subscribers deterministic and avoids recursive cascades on one property.
     */
    trigger(name: keyType | null, value?: any | null, oldValue?: any, trigger: TriggerName = "set", ...etc: any[]) {
        if (typeof name === "symbol") return;

        if (trigger === undefined) trigger = "set";
        trigger = normalizeTriggerName(trigger) ?? trigger;
        if (!this.isTriggerEnabled(trigger)) return;

        const opKey = `${trigger ?? "all"}`;

        // если сейчас по этому name идет dispatch (реэнтранси) — складируем
        // если не идет — тоже складируем, но flush будет один на микро-тик
        let byOp = this.#pendingByProp.get(name);
        if (!byOp) {
            byOp = new Map();
            this.#pendingByProp.set(name, byOp);
        }

        // A: схлопываем только одинаковые (name + trigger) в рамках микро-тика
        byOp.set(opKey, [name, value, oldValue, trigger, etc]);

        // уже запланирован flush — выходим
        if (this.#flushScheduled) return;
        this.#flushScheduled = true;

        queueMicrotask(() => {
            this.#flushScheduled = false;

            // забираем пачку и очищаем, чтобы триггеры во время dispatch попали в следующий тик
            const batch = this.#pendingByProp;
            this.#pendingByProp = new Map();

            // Важно: dispatch по prop, но не допускаем реэнтранси на один и тот же prop
            // (если во время dispatch придут новые trigger(prop, ...), они улетят в следующий микро-тик)
            for (const [prop, opMap] of batch) {
                if (prop != null && this.#inDispatch.has(prop)) continue;

                if (prop != null) this.#inDispatch.add(prop);
                try {
                    for (const [, args] of opMap) {
                        const [nm, v, ov, tg, rest] = args;
                        try {
                            // #dispatch ожидает (name, value, oldValue, ...etc)
                            this.#dispatch(nm, v, ov, tg, ...(rest ?? []));
                        } catch (e) {
                            console.warn(e);
                        }
                    }
                } finally {
                    if (prop != null) this.#inDispatch.delete(prop);
                }
            }
        });
    }

    get iterator() { return this.#iterator; }
}

//
const Subscript = globalThis[SubscriptSymbol];
export { Subscript };
export default Subscript;
