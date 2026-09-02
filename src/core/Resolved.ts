/**
 * FIND:promise-keyed
 * Reactive `resolved` operation: snapshot thenables via core combinators and emit `resolved`.
 */
import { isPromise, resolved as awaitResolved, type ResolvedMode } from "@fest-lib/core";
import { $extractKey$, $promise, $resolved } from "../wrap/Symbol";
import { deref } from "../wrap/Utils";
import { subscriptRegistry } from "./Subscript";

export type ResolvedOp = ((mode?: ResolvedMode) => Promise<any>) & {
    all(): Promise<any>;
    allSettled(): Promise<any>;
    allKeyed(): Promise<any>;
    allSettledKeyed(): Promise<any>;
    try(callbackOrValue: any, ...args: any[]): Promise<any>;
};

const rawOf = (target: any) => {
    const unwrapped = deref(target);
    return unwrapped?.[$extractKey$] ?? unwrapped;
};

/** Snapshot a reactive target (or its raw source) with `all` / `allKeyed` / settled variants. */
export function resolved(target: any, mode: ResolvedMode = "all"): Promise<any> {
    const raw = rawOf(target);
    if (isPromise(raw)) return awaitResolved(raw, mode);
    if (isPromise(raw?.[$promise])) return awaitResolved(raw[$promise], mode);
    return awaitResolved(raw ?? target, mode);
}

/** Build `obj.resolved` / `$trigger.resolved` without making the proxy thenable. */
export function makeResolvedOp(target: any, emit = false): ResolvedOp {
    const run = ((mode: ResolvedMode = "all") => {
        const pending = resolved(target, mode);
        if (!emit) return pending;
        return pending.then((value) => {
            const raw = rawOf(target);
            const key = raw?.realProp ?? (raw && "value" in (raw as object) ? "value" : null);
            subscriptRegistry.get(raw)?.trigger?.(key, value, undefined, "resolved");
            return value;
        });
    }) as ResolvedOp;

    run.all = () => run("all");
    run.allSettled = () => run("settled");
    run.allKeyed = () => run("all");
    run.allSettledKeyed = () => run("settled");
    run.try = (callbackOrValue, ...args) =>
        Promise.try(callbackOrValue, ...args).then((value) => resolved(value ?? target, "all"));
    return run;
}

export function emitResolved(target: any, key: any, value: any, oldValue: any) {
    const raw = rawOf(target) ?? target;
    subscriptRegistry.get(raw)?.trigger?.(key, value, oldValue, "resolved");
}

/** Re-assign thenable fields through the live proxy so set + `resolved` share one path. */
export function bindExistingThenables(live: any, raw: any) {
    if (live == null || raw == null) return live;
    if (Array.isArray(raw)) {
        raw.forEach((value, index) => { if (isPromise(value)) live[index] = value; });
        return live;
    }
    if (raw instanceof Map) {
        for (const [key, value] of raw.entries()) {
            if (isPromise(value)) live.set(key, value);
        }
        return live;
    }
    if (raw instanceof Set) return live;
    for (const key of Reflect.ownKeys(raw)) {
        if (key == $extractKey$ || key == $promise || key == $resolved) continue;
        const desc = Object.getOwnPropertyDescriptor(raw, key);
        if (!desc?.enumerable) continue;
        const value = raw[key];
        if (isPromise(value)) live[key] = value;
    }
    return live;
}
