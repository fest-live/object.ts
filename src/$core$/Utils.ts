import { $extractKey$, $originalKey$, $registryKey$ } from "./Symbol";

//
export const $originalObjects$ = new WeakMap();
export const propCbMap = new WeakMap();
export const boundCtx  = new WeakMap();

//
export const associateWith = (cb, name)=>{
    // !experimental `getOrInsert` feature!
    // @ts-ignore
    return propCbMap.getOrInsertComputed(cb, ()=>{
        return (val, prop, old)=>{ if (prop == name) return cb?.(val, prop, old); };
    });
}

//
export const UUIDv4 = () => (crypto?.randomUUID ? crypto?.randomUUID() : ("10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16))));
export const bindFx = (target, fx)=>{
    // !experimental `getOrInsert` feature!
    // @ts-ignore
    const be = boundCtx.getOrInsert(target, new WeakMap());
    return be.getOrInsert(fx, fx?.bind?.(target));
}

//
export type  keyType    = string | number | symbol;
export const isIterable = (obj) => (typeof obj?.[Symbol.iterator] == "function");
export const isKeyType  = (prop: any)=> ["symbol", "string", "number"].indexOf(typeof prop) >= 0;
export const bindCtx    = (target, fx) => ((typeof fx == "function" ? bindFx(target, fx) : fx) ?? fx);
export const isValidObj = (obj?: any)=> { return obj != null && (typeof obj == "function" || typeof obj == "object") && !(obj instanceof WeakRef); };
export const mergeByKey = (items: any[]|Set<any>, key = "id")=>{
    const entries = Array.from(items?.values?.()).map((I)=>[I?.[key],I]);
    const map = new Map(entries as any);
    return Array.from(map?.values?.() || []);
}

//
export const callByProp = (unwrap, prop, cb, ctx)=>{
    if (prop == $extractKey$ || prop == $originalKey$ || prop == $registryKey$) return;
    if (unwrap instanceof Map || unwrap instanceof WeakMap) { if (prop != null && unwrap.has(prop as any)) { return cb?.(unwrap.get(prop as any), prop); } } else
    if (unwrap instanceof Set || unwrap instanceof WeakSet) { if (prop != null && unwrap.has(prop as any)) { return cb?.(prop, prop); } } else
    if (typeof unwrap == "function" || typeof unwrap == "object") { return cb?.(Reflect.get(unwrap, prop, ctx ?? unwrap), prop); }
}

//
export const objectAssignNotEqual = (dst, src = {})=>{ Object.entries(src)?.forEach?.(([k,v])=>{ if (v !== dst[k]) { dst[k] = v; }; }); return dst; }
export const callByAllProp = (unwrap, cb, ctx)=>{
    let keys: any = []; // @ts-ignore
    if (unwrap instanceof Set || unwrap instanceof Map || Array.isArray(unwrap) || isIterable(unwrap) || typeof unwrap?.keys == "function") { keys = unwrap?.keys?.() || []; } else
    if ((typeof unwrap == "object" || typeof unwrap == "function") && unwrap != null) { keys = Object.keys(unwrap) || []; }
    return keys != null ? Array.from(keys)?.map?.((prop)=>callByProp(unwrap, prop, cb, ctx)) : [];
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
export const unwrap = (arr)=>{ return arr?.["@target"] ?? arr; }
export const deref  = (target?: any, discountValue?: boolean|null)=>{
    let from = (target?.value != null && (typeof target?.value == "object" || typeof target?.value == "function") && !discountValue) ? target?.value : target;
    if (from instanceof WeakRef) { from = deref(from.deref(), discountValue); }; return from;
}

// experimental promise support
export const withPromise = (target, cb)=>{
    if (typeof target?.promise?.then == "function") return target?.promise?.then?.(cb);
    if (typeof target?.then == "function") return target?.then?.(cb);
    return cb(target);
}
