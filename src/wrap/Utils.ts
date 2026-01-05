import { hasValue, isPrimitive } from "fest/core";
import { $extractKey$, $originalKey$, $registryKey$ } from "./Symbol";

/*
//
type AnyFn = (...args: any[]) => any;
type MethodKeys<T> = {
    [K in keyof T]-?: T[K] extends AnyFn ? K : never
}[keyof T];

//
type MethodsOf<T> = Pick<T, MethodKeys<T>>;
type WithMethods<Under, T> = MethodsOf<Under> & MethodsOf<T>;

//
export type WeakKey = object;
export type keyType = string | number | symbol;

//
export type refValid<Under = any, T = any, K = any> =
    | (T & WithMethods<Under, T>)
    | (Under[] & WithMethods<Under, T>)
    | (Map<K, Under> & WithMethods<Under, T>)
    | (Set<any> & WithMethods<Under, T>)
    | (WeakMap<(K extends WeakKey ? K : never), Under> & WithMethods<Under, T>)
    | (WeakSet<(Under extends WeakKey ? Under : never)> & WithMethods<Under, T>)
    | (Function & WithMethods<Under, T>);

//
export type subValid<Under = any, T = any, K = any> =
    | refValid<Under, T, K>
    | ([refValid<Under, T, K>, keyType | Function] & WithMethods<Under, T>)
    | ([refValid<Under, T, K>, keyType | Function, ...any[]] & WithMethods<Under, T>);
*/

//
export type AnyFn = (...args: any[]) => any;
export type MethodKeys<T> = {
    [K in keyof T]-?: T[K] extends AnyFn ? K : never
}[keyof T];
export type MethodsOf<T> = Pick<T, MethodKeys<T>>;

//
export type WeakKey = object | Function;
export type keyType = string | number | symbol;

//
export type ContainerMethods<X> =
    X extends (any[] | Array<any>) ? MethodsOf<Array<any>> :
    X extends Map<keyType, any> ? MethodsOf<Map<keyType, any>> :
    X extends Set<any> ? MethodsOf<Set<any>> :
    X extends WeakMap<WeakKey, any> ? MethodsOf<WeakMap<WeakKey, any>> :
    X extends WeakSet<WeakKey> ? MethodsOf<WeakSet<WeakKey>> :
    X extends Function ? MethodsOf<Function> :
    {};

// extends by [key: symbol] internals, such as Symbol.observable, Symbol.dispose, $trigger$, etc...
export type observeSpecificKeys<T extends Record<keyType, any> = any> = T & {
    [K in keyof T]: T[K] extends AnySuitable<keyType, any> ? Ui<T[K], keyType, any> : T[K];
}[keyof T & keyType];

//
export type MapLike<K = any, V = any> = Map<K, V> | WeakMap<K extends WeakKey ? K : never, V> | Record<K extends keyType ? K : never, V>;
export type SetLike<V = any, _ = unknown> = Set<V> | WeakSet<V extends WeakKey ? V : never> | V[];
export type AnySuitable<K = any, V = any|unknown> = Function | Record<K extends keyType ? K : never, V> | MapLike<K, V> | SetLike<K, V extends unknown ? V : unknown>;
export type Ui<W extends AnySuitable<any, any>, K = any, V = any> = W | W[] | AnySuitable<K, V> | AnySuitable<K, V>[];
export type observeValid<T = any> = T & {
    value?: any;
    [key: symbol]: any;
    [key: string]: any;
};

//
export type TupleWithInheritedMethods<RV> =
    RV extends unknown ? ([RV, keyType | Function] & ContainerMethods<RV>) : never;

//
export type TupleVariadicWithInheritedMethods<RV> =
    RV extends unknown ? ([RV, keyType | Function, ...any[]] & ContainerMethods<RV>) : never;

//
export type subValid<T = any> =
    | observeValid<T>
    | TupleWithInheritedMethods<observeValid<T>>
    | TupleVariadicWithInheritedMethods<observeValid<T>>;

//
export const $originalObjects$ = new WeakMap();

//
export const safe = (target)=>{
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target, mapped = (e)=>safe(e);
    if (Array.isArray(unwrap)) { return unwrap?.map?.(mapped) || Array.from(unwrap || [])?.map?.(mapped) || []; } else // @ts-ignore
    if (unwrap instanceof Map || unwrap instanceof WeakMap) { return new Map(Array.from(unwrap?.entries?.() || [])?.map?.(([K,V])=>[K,safe(V)])); } else  // @ts-ignore
    if (unwrap instanceof Set || unwrap instanceof WeakSet) { return new Set(Array.from(unwrap?.values?.() || [])?.map?.(mapped)); } else  // @ts-ignore
    if (unwrap != null && typeof unwrap == "function" || typeof unwrap == "object") { return Object.fromEntries(Array.from(Object.entries(unwrap || {}) || [])?.filter?.(([K])=>(K != $extractKey$ && K != $originalKey$ && K != $registryKey$))?.map?.(([K,V])=>[K,safe(V)])); }
    return unwrap;
}

//
export const unwrap = (arr)=>{ return arr?.[$extractKey$] ?? arr?.["@target"] ?? arr; }
export const deref  = (target?: any, discountValue: boolean|null = false)=>{
    const original = target;
    if (isPrimitive(target) || typeof target == "symbol") return target;
    if (target != null && (target instanceof WeakRef || ("deref" in target && typeof target?.deref == "function"))) { target = target?.deref?.(); };
    if (target != null && (typeof target == "object" || typeof target == "function")) {
        target = unwrap(target);
        const $val = discountValue && hasValue(target) && target?.value;
        if ($val != null && (typeof $val == "object" || typeof $val == "function"))
            { target = $val; }
        if (original != target)
            { return deref(target, discountValue); }
    }
    return target;
}

//
export const isThenable = (val: any): val is PromiseLike<any> => val != null && typeof val.then === "function";
export const withPromise = (target, cb) => {
    if (isPrimitive(target) || typeof target == "function") { return cb?.(target); };
    if (isThenable(target)) return target.then(cb);
    if (target?.promise && isThenable(target.promise)) return target.promise.then(cb);
    return cb?.(target);
}

//
const disposeMap = new WeakMap();
const disposeRegistry = new FinalizationRegistry((callstack: any)=>{ callstack?.forEach?.((cb: any)=>cb?.()); });

//
export function addToCallChain(obj, methodKey, callback?: any|null) {
    if (!callback || typeof callback != "function" || (typeof obj != "object" && typeof obj != "function")) return;
    if (methodKey == Symbol.dispose) {
        // @ts-ignore
        disposeMap?.getOrInsertComputed?.(obj, ()=>{
            const CallChain = new Set();
            if (typeof obj == "object" || typeof obj == "function") {
                disposeRegistry.register(obj, CallChain);
                disposeMap.set(obj, CallChain);
                obj[Symbol.dispose] ??= ()=>CallChain.forEach((cb: any)=>{ cb?.(); });
            }
            return CallChain;
        })?.add?.(callback);
    } else {
        obj[methodKey] = function(...args) { const original = obj?.[methodKey]; if (typeof original == 'function') { original.apply(this, args); }; callback.apply(this, args); };
    }
}


type DuplicateContext = 'set' | 'push' | 'unshift' | 'splice';

interface DuplicateEvent<T> {
    value: T;
    via: DuplicateContext;
    index?: number;
}

interface SetArrayOptions<T> {
    onDuplicate?: (event: DuplicateEvent<T>) => void;
}

interface SetArrayMethods<T> {
    push(...items: T[]): number;
    pop(): T | undefined;
    shift(): T | undefined;
    unshift(...items: T[]): number;
    splice(start: number, deleteCount?: number, ...items: T[]): T[];
    includes(value: T): boolean;
    indexOf(value: T): number;
    toArray(): T[];
    toSet(): Set<T>;
    clear(): void;
    delete(value: T): boolean;
    [Symbol.iterator](): IterableIterator<T>;
}

export type SetArray<T> = SetArrayMethods<T> & {
    readonly length: number;
    [index: number]: T;
};

const isArrayIndex = (prop: PropertyKey): prop is `${number}` => {
    if (typeof prop !== 'string') return false;
    if (prop === '') return false;
    const num = Number(prop);
    return Number.isInteger(num) && num >= 0 && String(num) === prop;
};

export function wrapSetAsArray<T>(
    source: Iterable<T> = [],
    options: SetArrayOptions<T> = {}
): SetArray<T> {
    let backingSet: Set<T> = new Set<T>();

    const notifyDuplicate = (value: T, via: DuplicateContext, index?: number) => {
        options.onDuplicate?.({ value, via, index });
    };

    if (source instanceof Set) { backingSet = source; } else {
        for (const item of source) {
            if (backingSet.has(item)) {
                notifyDuplicate(item, 'push');
                continue;
            }
            backingSet.add(item);
        }
    }

    const snapshot = () => Array.from(backingSet);
    const rebuildFrom = (arr: T[]) => {
        backingSet.clear();
        for (const item of arr) {
            backingSet.add(item);
        }
    };



    const methods: SetArrayMethods<T> = {
        push: (...items: T[]) => {
            let size = backingSet.size;
            for (const item of items) {
                if (backingSet.has(item)) {
                    notifyDuplicate(item, 'push');
                    continue;
                }
                backingSet.add(item);
                size++;
            }
            return size;
        },
        pop: () => {
            const arr = snapshot();
            if (!arr.length) return undefined;
            const value = arr[arr.length - 1];
            backingSet.delete(value);
            return value;
        },
        shift: () => {
            const iterator = backingSet.values().next();
            if (iterator.done) return undefined;
            const value = iterator.value;
            backingSet.delete(value);
            return value;
        },
        unshift: (...items: T[]) => {
            if (!items.length) return backingSet.size;
            const current = snapshot();
            const toPrepend: T[] = [];

            for (const item of items) {
                if (current.includes(item) || toPrepend.includes(item)) {
                    notifyDuplicate(item, 'unshift', 0);
                    continue;
                }
                toPrepend.push(item);
            }

            if (!toPrepend.length) return current.length;

            const next = [...toPrepend, ...current];
            rebuildFrom(next);
            return next.length;
        },
        splice: (start: number, deleteCount?: number, ...items: T[]) => {
            const arr = snapshot();
            const normalizedStart = Math.min(Math.max(start, 0), arr.length);
            const actualDeleteCount =
                deleteCount === undefined
                    ? arr.length - normalizedStart
                    : Math.max(0, Math.min(deleteCount, arr.length - normalizedStart));

            const removed = arr.splice(normalizedStart, actualDeleteCount);

            let insertPosition = normalizedStart;
            for (const item of items) {
                if (arr.includes(item)) {
                    notifyDuplicate(item, 'splice', insertPosition);
                    continue;
                }
                arr.splice(insertPosition++, 0, item);
            }

            rebuildFrom(arr);
            return removed;
        },
        includes: (value: T) => backingSet.has(value),
        indexOf: (value: T) => snapshot().indexOf(value),
        clear: () => {
            backingSet.clear();
        },
        delete: (value: T) => backingSet.delete(value),
        toArray: () => snapshot(),
        toSet: () => new Set(backingSet),
        [Symbol.iterator]: () => backingSet[Symbol.iterator](),
    };

    const handler: ProxyHandler<SetArrayMethods<T>> = {
        get: (_, prop) => {
            if (prop === 'length') {
                return backingSet.size;
            }

            if (isArrayIndex(prop)) {
                const arr = snapshot();
                return arr[Number(prop)];
            }

            const value = (methods as unknown as Record<PropertyKey, unknown>)[prop];
            if (typeof value === 'function') {
                return value;
            }
            return value;
        },
        set: (_, prop, value) => {
            if (prop === 'length') {
                if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
                    throw new RangeError('length must be a finite non-negative number');
                }
                const nextLength = Math.floor(value);
                if (nextLength >= backingSet.size) {
                    // расширение с "дырами" не поддерживаем — просто игнорируем
                    return true;
                }
                const arr = snapshot().slice(0, nextLength);
                rebuildFrom(arr);
                return true;
            }

            if (isArrayIndex(prop)) {
                const arr = snapshot();
                const index = Number(prop);

                if (index > arr.length) {
                    return true; // не поддерживаем "редкие" индексы
                }

                const nextValue = value as T;
                if (index < arr.length) {
                    const currentValue = arr[index];
                    if (Object.is(currentValue, nextValue)) {
                        return true;
                    }
                    const duplicateElsewhere = arr.some(
                        (item, idx) => idx !== index && Object.is(item, nextValue)
                    );
                    if (duplicateElsewhere) {
                        notifyDuplicate(nextValue, 'set', index);
                        return true;
                    }
                    arr[index] = nextValue;
                } else {
                    if (arr.includes(nextValue)) {
                        notifyDuplicate(nextValue, 'set', index);
                        return true;
                    }
                    arr.push(nextValue);
                }

                rebuildFrom(arr);
                return true;
            }

            return Reflect.set(methods, prop, value);
        },
        deleteProperty: (_, prop) => {
            if (prop === 'length') {
                return false; // как у обычного массива
            }

            if (isArrayIndex(prop)) {
                const arr = snapshot();
                const index = Number(prop);
                if (index >= arr.length) {
                    return true;
                }
                arr.splice(index, 1);
                rebuildFrom(arr);
                return true;
            }

            return Reflect.deleteProperty(methods, prop);
        },
        ownKeys: () => {
            const keys: (string | symbol)[] = [];
            let i = 0;
            for (const _ of backingSet) {
                keys.push(String(i++));
            }
            keys.push('length');
            return keys;
        },
        getOwnPropertyDescriptor: (_, prop) => {
            if (prop === 'length') {
                return {
                    configurable: false,
                    enumerable: false,
                    writable: true,
                    value: backingSet.size,
                };
            }

            if (isArrayIndex(prop)) {
                const arr = snapshot();
                const index = Number(prop);
                if (index >= arr.length) return undefined;
                return {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: arr[index],
                };
            }

            return Reflect.getOwnPropertyDescriptor(methods, prop);
        },
        has: (_, prop) => {
            if (prop === 'length') return true;
            if (isArrayIndex(prop)) {
                const index = Number(prop);
                return index >= 0 && index < backingSet.size;
            }
            return prop in methods;
        },
    };

    return new Proxy(methods, handler) as SetArray<T>;
}
