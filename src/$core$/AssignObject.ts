import { $originalObjects$, isIterable, type keyType } from "./Utils.js";
import { $extractKey$, $originalKey$, $registryKey$  } from "./Symbol.js";

//
export const removeExtra = (target, value, name: keyType | null = null)=>{
    const exists = name != null && (typeof target == "object" || typeof target == "function") ? (target?.[name] ?? target) : target;

    //
    let entries: any = [];
    if (value instanceof Set || value instanceof Map || Array.isArray(value) || isIterable(value)) { entries = ((exists instanceof Set || exists instanceof WeakSet) ? value?.values?.() : value?.entries?.()) || ((Array.isArray(value) || isIterable(value)) ? value : []); } else
    if (typeof value == "object" || typeof value == "function") { entries = (exists instanceof Set || exists instanceof WeakSet) ? Object.values(value) : Object.entries(value); }

    //
    let exEntries: any = [];
    if (Array.isArray(exists)) { exEntries = exists.entries(); } else // @ts-ignore
    if (exists instanceof Map || exists instanceof WeakMap) { exEntries = exists?.entries?.(); } else // @ts-ignore
    if (exists instanceof Set || exists instanceof WeakSet) { exEntries = exists?.values?.(); } else
    if (typeof exists == "object" || typeof exists == "function") { exEntries = Object.entries(exists); }

    // REQUIRES NEW ECMASCRIPT!!!
    const keys = new Set(Array.from(entries).map((e)=>e?.[0]));
    const exe  = new Set(Array.from(exEntries).map((e)=>e?.[0]));
    const exclude = keys?.difference?.(exe);

    //
    if (Array.isArray(exists)) { const nw = exists.filter((_,I)=>!exclude.has(I)); exists.splice(0, exists.length); exists.push(...nw); } else
    if ((exists instanceof Map || exists instanceof Set) || (exists instanceof WeakMap || exists instanceof WeakSet)) { for (const k of exclude) { exists.delete(k); }; } else
    if (typeof exists == "function" || typeof exists == "object") { for (const k of exclude) { delete exists[k]; }; }

    //
    return exists;
}

//
export const objectAssign = (target, value, name: keyType | null = null, removeNotExists = true, mergeKey = "id") => {
    const exists = name != null && (typeof target == "object" || typeof target == "function") ? (target?.[name] ?? target) : target;
    let entries: any = null;

    //
    if (removeNotExists) { removeExtra(exists, value); }

    //
    if (value instanceof Set || value instanceof Map || Array.isArray(value) || isIterable(value)) { entries = ((exists instanceof Set || exists instanceof WeakSet) ? value?.values?.() : value?.entries?.()) || ((Array.isArray(value) || isIterable(value)) ? value : []); } else
    if (typeof value == "object" || typeof value == "function") { entries = (exists instanceof Set || exists instanceof WeakSet) ? Object.values(value) : Object.entries(value); }

    //
    if (exists && entries && (typeof entries == "object" || typeof entries == "function")) {
        if (exists instanceof Map || exists instanceof WeakMap) // @ts-ignore
            { for (const E of entries) { exists.set(...E); }; return exists; }

        //
        if (exists instanceof Set || exists instanceof WeakSet)
            { for (const E of entries) { // @ts-ignore
                const mergeObj = E?.[mergeKey] ? Array.from(exists?.values?.() || []).find((I)=>I?.[mergeKey]===E?.[mergeKey]) : null;
                if (mergeObj != null) { objectAssign(mergeObj, E, null, removeNotExists, mergeKey); } else { exists.add(E); }
            } return exists; }

        //
        if (typeof exists == "object" || typeof exists == "function") {
            if (Array.isArray(exists) || isIterable(exists)) {
                let I = 0;
                for (const E of entries) {
                    if (I < exists.length) { exists[I++] = E?.[1]; } else { exists?.push?.(E?.[1]); };
                }
                return exists;
            }
            return Object.assign(exists, Object.fromEntries([...(entries||[])].filter((K)=>(K != $extractKey$ && K != $originalKey$ && K != $registryKey$))));
        }
    }

    //
    if (name != null) { Reflect.set(target, name, value); return target; } else
    if (typeof value == "object" || typeof value == "function") { return Object.assign(target, value); }
    return value;
}

//
export class AssignObjectHandler {
    constructor() { }
    deleteProperty(target, name: keyType) { const result = Reflect.deleteProperty(target, name); return result; }
    construct(target, args, newT) { return Reflect.construct(target, args, newT); }
    apply(target, ctx, args) { return Reflect.apply(target, ctx, args); }
    has(target, prop: keyType) { return Reflect.has(target, prop); }
    set(target, name: keyType, value) { objectAssign(target, value, name); return true; }
    get(target, name: keyType, ctx) {
        if (name == $originalKey$ || name == $extractKey$ || name == $registryKey$) { return (name == $extractKey$ || name == $registryKey$) ? target?.[name] : (target?.[name] ?? target); }
        return Reflect.get(target, name, ctx);
    }
}

//
export const makeObjectAssignable = (obj) => {
    if (obj?.[$originalKey$] || $originalObjects$.has(obj)) { return obj; }

    // @ts-ignore
    const px = new Proxy(obj, new AssignObjectHandler());
    $originalObjects$.set(px, obj); return px;
}
