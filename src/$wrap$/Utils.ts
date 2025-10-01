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
type AnyFn = (...args: any[]) => any;
type MethodKeys<T> = {
    [K in keyof T]-?: T[K] extends AnyFn ? K : never
}[keyof T];
type MethodsOf<T> = Pick<T, MethodKeys<T>>;
type WithMethods<Under, T = any> = MethodsOf<Under> & MethodsOf<T>;

//
export type WeakKey = object;
export type keyType = string | number | symbol;

//
type ContainerMethods<X> =
    X extends any[] ? MethodsOf<any[]> :
    X extends Map<any, any> ? MethodsOf<Map<any, any>> :
    X extends Set<any> ? MethodsOf<Set<any>> :
    X extends WeakMap<object, any> ? MethodsOf<WeakMap<object, any>> :
    X extends WeakSet<object> ? MethodsOf<WeakSet<object>> :
    X extends Function ? MethodsOf<Function> :
    {};

//
export type refValid<Under = any, T = any, K = any> =
    | T & MethodsOf<T>
    | Under[] & MethodsOf<Under[]>
    | Map<K, Under> & MethodsOf<Map<K, Under>>
    | Set<any> & MethodsOf<Set<any>>
    | WeakMap<(K extends WeakKey ? K : never), Under> & MethodsOf<WeakMap<(K extends WeakKey ? K : never), Under>>
    | WeakSet<(Under extends WeakKey ? Under : never)> & MethodsOf<WeakSet<(Under extends WeakKey ? Under : never)>>
    | Function & MethodsOf<Function>;

//
type TupleWithInheritedMethods<RV> =
    RV extends unknown ? ([RV, keyType | Function] & ContainerMethods<RV>) : never;

//
type TupleVariadicWithInheritedMethods<RV> =
    RV extends unknown ? ([RV, keyType | Function, ...any[]] & ContainerMethods<RV>) : never;

//
export type subValid<Under = any, T = any, K = any> =
    | refValid<Under, T, K>
    | TupleWithInheritedMethods<refValid<Under, T, K>>
    | TupleVariadicWithInheritedMethods<refValid<Under, T, K>>;



//
export const $originalObjects$ = new WeakMap();
export const propCbMap = new WeakMap();
export const boundCtx  = new WeakMap();

//
export const associateWith = (cb, name)=>{
    // !experimental `getOrInsert` feature!
    // @ts-ignore
    return propCbMap.getOrInsertComputed(cb, ()=>{
        return (val, prop: keyType, old)=>{ if (prop == name) return cb?.(val, prop, old); };
    });
}

//
export const getRandomValues = (array: Uint8Array) => { return crypto?.getRandomValues ? crypto?.getRandomValues?.(array) : (()=>{
    const values = new Uint8Array(array.length);
    for (let i = 0; i < array.length; i++) {
        values[i] = Math.floor(Math.random() * 256);
    }
    return values;
})(); };

//
export const UUIDv4 = () => (crypto?.randomUUID ? crypto?.randomUUID?.() : ("10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (getRandomValues?.(new Uint8Array(1))?.[0] & (15 >> (+c / 4)))).toString(16))));
export const bindFx = (target, fx)=>{
    // !experimental `getOrInsert` feature!
    // @ts-ignore
    const be = boundCtx.getOrInsert(target, new WeakMap());
    return be.getOrInsert(fx, fx?.bind?.(target));
}

//
export const isIterable = (obj) => (typeof obj?.[Symbol.iterator] == "function");
export const isKeyType = (prop: keyType | any) => (["symbol", "string", "number"].indexOf(typeof prop) >= 0);
export const bindCtx    = (target, fx) => ((typeof fx == "function" ? bindFx(target, fx) : fx) ?? fx);
export const isValidObj = (obj?: any)=> { return obj != null && (typeof obj == "function" || typeof obj == "object") && !(obj instanceof WeakRef); };
export const mergeByKey = (items: any[]|Set<any>, key = "id")=>{
    const entries = Array.from(items?.values?.()).map((I)=>[I?.[key],I]);
    const map = new Map(entries as any);
    return Array.from(map?.values?.() || []);
}

//
export const callByProp = (unwrap, prop: keyType, cb, ctx)=>{
    if (
        prop == null ||
        (prop == $extractKey$ || prop == $originalKey$ || prop == $registryKey$) ||
        (typeof prop == "symbol" || typeof prop == "object" || typeof prop == "function")
    ) return;

    //
    if (unwrap instanceof Map || unwrap instanceof WeakMap) {
        if (unwrap.has(prop as any)) { return cb?.(unwrap.get(prop as any), prop); }
    } else
        if (unwrap instanceof Set || unwrap instanceof WeakSet) {
            if (unwrap.has(prop as any)) { return cb?.(prop, prop); }
        } else
            if (Array.isArray(unwrap) && (typeof prop == "string" && [...prop?.matchAll?.(/^\d+$/g)]?.length == 1) && Number.isInteger(typeof prop == "string" ? parseInt(prop) : prop)) {
                const index = typeof prop == "string" ? parseInt(prop) : prop;
                return cb?.(unwrap?.[index], index, null, "@add");
            } else
                if (typeof unwrap == "function" || typeof unwrap == "object") { return cb?.(unwrap?.[prop], prop); }
}

//
export const objectAssignNotEqual = (dst, src = {})=>{ Object.entries(src)?.forEach?.(([k,v])=>{ if (isNotEqual(v, dst[k])) { dst[k] = v; }; }); return dst; }
export const callByAllProp = (unwrap, cb, ctx)=>{
    if (unwrap == null) return;

    //
    let keys: any = [];

    if (unwrap instanceof Set || unwrap instanceof Map || typeof unwrap?.keys == "function") {
        return [...(unwrap?.keys?.() || keys)]?.forEach?.((prop: keyType | any) => callByProp(unwrap, prop, cb, ctx));
    }

    if (Array.isArray(unwrap) || isIterable(unwrap)) {
        return [...unwrap]?.forEach?.((v, I) => callByProp(unwrap, I, cb, ctx));
    }

    if (typeof unwrap == "object" || typeof unwrap == "function") {
        return [...(Object.keys(unwrap) || keys)]?.forEach?.((prop: keyType | any) => callByProp(unwrap, prop, cb, ctx));
    }
}

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
    if (target == null) return target; const val = unwrap(target?.value ?? target);
    let from = (val != null && !discountValue && (typeof val == "object" || typeof val == "function")) ? val : target;
    if (from == null || target == from) return target;
    if (from instanceof WeakRef || typeof from?.deref == "function") { from = deref(from?.deref?.(), discountValue); } else { from = deref(from, discountValue); }
    return from;
}

// experimental promise support
export const withPromise = (target, cb)=>{
    if (typeof target?.then == "function") return target?.then?.(cb);
    if (typeof target?.promise?.then == "function") return target?.promise?.then?.(cb);
    return cb(target);
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

//
export const isObjectNotEqual = (a, b)=>{
    if (a == null && b == null) return false;
    if (a == null || b == null) return true; // @ts-ignore
    if (a instanceof Map || a instanceof WeakMap) { return a.size != b.size || Array.from(a.entries()).some(([k, v]) => !b.has(k) || !isNotEqual(v, b.get(k))); } // @ts-ignore
    if (a instanceof Set || a instanceof WeakSet) { return a.size != b.size || Array.from(a.values()).some((v) => !b.has(v)); } // @ts-ignore
    if (Array.isArray(a) || Array.isArray(b)) { return a.length != b.length || a.some((v, i) => !isNotEqual(v, b[i])); }
    if (typeof a == "object" || typeof b == "object") { return JSON.stringify(a) != JSON.stringify(b); }
    return a != b;
}

//
export const isNotEqual = (a, b)=>{
    if (a == null && b == null) return false;
    if (a == null || b == null) return true;
    if (typeof a == "number" && typeof b == "number") {
        return (Math.abs(a - b) >= 1e-9);
    }
    if (typeof a == "boolean" && typeof b == "boolean") {
        return a != b;
    }
    if (typeof a == "string" && typeof b == "string") {
        return a != b;
    }
    if ((typeof a) != (typeof b)) {
        return a !== b;
    }
    return a != b;
}
