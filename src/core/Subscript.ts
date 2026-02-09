import { $extractKey$ } from "../wrap/Symbol";
import { deref, type keyType } from "../wrap/Utils";
import { WR } from "fest/core";

//
const withUnsub = new WeakMap();
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

//
export const subscriptRegistry = new WeakMap<any, Subscript>();

// @ts-ignore
const wrapped = new WeakMap();

//
export const register = (what: any, handle: any): any => {
    const unwrap = what?.[$extractKey$] ?? what;  // @ts-ignore
    subscriptRegistry.getOrInsert(unwrap, new Subscript());
    return handle;
}

//
export const wrapWith = (what: any, handle: any): any => {
    what = deref(what?.[$extractKey$] ?? what);
    if (typeof what == "symbol" || !(typeof what == "object" || typeof what == "function") || what == null) return what; // @ts-ignore
    return wrapped.getOrInsertComputed(what, () => new Proxy(what, register(what, handle)));
}; // !experimental `getOrInsert` feature!

//
const forAll = Symbol.for("@allProps");

//
export class Subscript {
    compatible: any;
    #listeners: Map<(value: any, prop: keyType, oldValue?: any, operation?: string | null) => void, any>;
    #flags = new WeakSet();
    #native: any;
    #iterator: any;
    #inDispatch = new Set<keyType>();

    // было: #triggerLock = new Set<keyType>();
    #pending = new Map<keyType | null, [keyType | null, any, any, any[]]>();
    #pendingByProp = new Map<keyType | null, Map<string, [keyType | null, any, any, (string | null), any[]]>>();
    #flushScheduled = false;

    // last run timestamp per callback
    #lastPerfNow = new WeakMap<Function, number>();

    // получаем "now" максимально дёшево/безопасно
    #now() {
        // performance может отсутствовать в некоторых рантаймах
        return (globalThis.performance?.now?.() ?? Date.now());
    }

    constructor() {
        this.#listeners = new Map();
        this.#flags = new WeakSet();

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

    $safeExec(cb, ...args) {
        if (!cb || this.#flags.has(cb)) return;
        this.#flags.add(cb);

        //
        if (this.#lastPerfNow.get(cb) === this.#now()) return;
        this.#lastPerfNow.set(cb, this.#now());

        //
        try {
            const res = cb(...args);
            if (res && typeof (res as any).then === "function") return (res as Promise<any>).catch(console.warn);
            return res;
        } catch (e) {
            console.warn(e);
        } finally {
            this.#flags.delete(cb);
        }
    }

    #dispatch(name, value = null, oldValue?: any, ...etc: any[]) {
        const listeners = this.#listeners;
        if (!listeners?.size) return;

        const promises: Promise<any>[] = Array.from(listeners.entries())
            .map(([cb, prop]) => {
                if (prop === name || prop === forAll || prop === null) {
                    return this.$safeExec(cb, value, name, oldValue, ...etc);
                }
                return undefined;
            })
            .filter((res: any) => res && typeof res.then === "function");

        return promises.length ? Promise.allSettled(promises) : undefined;
    }

    wrap(nw: any[] | unknown) { if (Array.isArray(nw)) return wrapWith(nw, this); return nw; }

    affected(cb: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (cb == null || typeof cb != "function") return;
        this.#listeners.set(cb, prop || forAll);
        return () => this.unaffected(cb, prop || forAll);
    }

    unaffected(cb?: (value: any, prop: keyType) => void, prop?: keyType | null) {
        if (cb != null && typeof cb == "function") {
            const listeners = this.#listeners;
            if (listeners?.has(cb) && (listeners.get(cb) == prop || prop == null || prop == forAll)) {
                listeners.delete(cb);
                return () => this.affected(cb, prop || forAll);
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
    trigger(name: keyType | null, value?: any | null, oldValue?: any, operation: string | null = null, ...etc: any[]) {
        if (typeof name === "symbol") return;

        // operation может быть undefined из старых вызовов
        if (operation === undefined) operation = null;

        // ключ дедупа по operation
        // null/undefined -> "__"
        const opKey = operation ?? "__";

        // если сейчас по этому name идет dispatch (реэнтранси) — складируем
        // если не идет — тоже складируем, но flush будет один на микро-тик
        let byOp = this.#pendingByProp.get(name);
        if (!byOp) {
            byOp = new Map();
            this.#pendingByProp.set(name, byOp);
        }

        // A: схлопываем только одинаковые (name + operation) в рамках микро-тика
        byOp.set(opKey, [name, value, oldValue, operation, etc]);

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
                        const [nm, v, ov, op, rest] = args;
                        try {
                            // #dispatch ожидает (name, value, oldValue, ...etc)
                            this.#dispatch(nm, v, ov, op, ...(rest ?? []));
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
