import { $extractKey$, $originalKey$, $originalObjects$, $registryKey$, isIterable, type keyType } from "./Keys.js";

//
export const removeExtra = (target, value, name: keyType | null = null)=>{
    const exists = name != null && (typeof target == "object" || typeof target == "function") ? (target?.[name] ?? target) : target;

    //
    let entries: any = [];
    if (value instanceof Set || value instanceof Map || Array.isArray(value) || isIterable(value)) {
        entries = ((exists instanceof Set || exists instanceof WeakSet) ? value?.values?.() : value?.entries?.()) || ((Array.isArray(value) || isIterable(value)) ? value : []);
    } else
    if (typeof value == "object" || typeof value == "function") {
        entries = (exists instanceof Set || exists instanceof WeakSet) ? Object.values(value) : Object.entries(value);
    }

    //
    let exEntries: any = [];
    if (Array.isArray(exists)) {
        exEntries = exists.entries();
    } else
    if (exists instanceof Map || exists instanceof WeakMap) {
        // @ts-ignore
        exEntries = exists?.entries?.();
    } else
    if (exists instanceof Set || exists instanceof WeakSet) {
        // @ts-ignore
        exEntries = exists?.values?.();
    } else
    if (typeof exists == "object" || typeof exists == "function") {
        exEntries = Object.entries(exists);
    }

    // REQUIRES NEW ECMASCRIPT!!!
    const keys = new Set(Array.from(entries).map((e)=>e?.[0]));
    const exe  = new Set(Array.from(exEntries).map((e)=>e?.[0]));
    const exclude = keys?.difference?.(exe);

    //
    if (Array.isArray(exists)) {
        const nw = exists.filter((_,I)=>!exclude.has(I));
        exists.splice(0, exists.length);
        exists.push(...nw);
    } else
    if (exists instanceof Map || exists instanceof WeakMap) {
        for (const k of exclude) { exists.delete(k); };
    } else
    if (exists instanceof Set || exists instanceof WeakSet) {
        for (const k of exclude) { exists.delete(k); };
    } else
    if (typeof exists == "function" || typeof exists == "object") {
        for (const k of exclude) { delete exists[k]; };
    }

    //
    return exists;
}

//
export const mergeByKey = (items: any[]|Set<any>, key = "id")=>{
    const entries = Array.from(items?.values?.()).map((I)=>[I?.[key],I]);
    const map = new Map(entries as any);
    return Array.from(map?.values?.() || []);
}

//
export const objectAssign = (target, value, name: keyType | null = null, removeNotExists = true, mergeKey = "id")=>{
    const exists = name != null && (typeof target == "object" || typeof target == "function") ? (target?.[name] ?? target) : target;
    let entries: any = null;

    //
    if (removeNotExists) { removeExtra(exists, value); }

    //
    if (value instanceof Set || value instanceof Map || Array.isArray(value) || isIterable(value)) {
        entries = ((exists instanceof Set || exists instanceof WeakSet) ? value?.values?.() : value?.entries?.()) || ((Array.isArray(value) || isIterable(value)) ? value : []);
    } else
    if (typeof value == "object" || typeof value == "function") {
        entries = (exists instanceof Set || exists instanceof WeakSet) ? Object.values(value) : Object.entries(value);
    }

    //
    if (exists && entries && (typeof entries == "object" || typeof entries == "function")) {
        if (exists instanceof Map || exists instanceof WeakMap) {
            for (const E of entries) {
                // @ts-ignore
                exists.set(...E);
            }
            return exists;
        }

        //
        if (exists instanceof Set || exists instanceof WeakSet) {
            for (const E of entries) {
                // @ts-ignore
                const mergeObj = E?.[mergeKey] ? Array.from(exists?.values?.() || []).find((I)=>I?.[mergeKey]===E?.[mergeKey]) : null;
                if (mergeObj != null) { objectAssign(mergeObj, E, null, removeNotExists, mergeKey); } else { exists.add(E); }
            }
            return exists;
        }

        //
        if (typeof exists == "object" || typeof exists == "function") {
            if (Array.isArray(exists) || isIterable(exists)) {
                let I = 0;
                for (const E of entries) {
                    if (I < exists.length) { exists[I++] = E?.[1]; } else { exists?.push?.(E?.[1]); };
                }
                return exists;
            }
            return Object.assign(exists, Object.fromEntries([...(entries||[])]));
        }
    }

    //
    if (name != null) {
        Reflect.set(target, name, value);
        return target;
    } else
    if (typeof value == "object" || typeof value == "function") {
        return Object.assign(target, value);
    }

    //
    return value;
}

//
export class AssignObjectHandler {
    //
    constructor() {
    }

    //
    get(target, name: keyType, ctx) {
        /*if (name == $registryKey$) {
            return (subscriptRegistry).get(target);
        }*/
        if (name == $extractKey$ || name == $originalKey$ || name == $registryKey$) {
            return target?.[name] ?? target;
        }
        return Reflect.get(target, name, ctx);
    }

    //
    construct(target, args, newT) {
        return Reflect.construct(target, args, newT);
    }

    //
    has(target, prop: keyType) {
        return Reflect.has(target, prop);
    }

    //
    apply(target, ctx, args) {
        return Reflect.apply(target, ctx, args);
    }

    //
    set(target, name: keyType, value) {
        objectAssign(target, value, name);
        return true;
    }

    //
    deleteProperty(target, name: keyType) {
        const result = Reflect.deleteProperty(target, name);
        return result;
    }
}

//
export const makeObjectAssignable = (obj) => {
    if (obj?.[$originalKey$] || $originalObjects$.has(obj)) { return obj; }

    // @ts-ignore
    const px = new Proxy(obj, new AssignObjectHandler());
    $originalObjects$.set(px, obj);
    return px;
};
