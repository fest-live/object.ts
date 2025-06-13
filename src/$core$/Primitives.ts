import { makeReactive, subscribe } from "./Mainline";
import { $value, $behavior, $promise } from "./Symbol";
import { isValidObj, objectAssignNotEqual, deref } from "./Utils";

//
export const conditional = (ref: any, ifTrue: any, ifFalse: any)=>{
    const cond = ref((ref?.value ?? ref) ? ifTrue : ifFalse);
    subscribe([ref, "value"], (val) => { cond.value = val ? ifTrue : ifFalse; });
    return cond;
}

// very hard type
export const numberRef  = (initial?: any, behavior?: any)=>{
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r = makeReactive({
        [$promise]: isPromise ? initial : null,
        [$value]: isPromise ? 0 : (Number(deref(initial) || 0) || 0),
        [$behavior]: behavior,
        set value(v) { this[$value] = Number(v) || 0; },
        get value() { return Number(this[$value] || 0) || 0; }
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

// very hard type
export const stringRef  = (initial?: any, behavior?: any)=>{
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r = makeReactive({
        [$promise]: isPromise ? initial : null,
        [$value]: isPromise ? "" : String(deref(initial) ?? "") || "",
        [$behavior]: behavior,
        set value(v) { this[$value] = String(v ?? "") || ""; },
        get value() { return String(this[$value] || "") || ""; },
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

// very hard type
export const booleanRef  = (initial?: any, behavior?: any)=>{
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r = makeReactive({
        [$promise]: isPromise ? initial : null,
        [$value]: isPromise ? false : Boolean(!!deref(initial) || false) || false,
        [$behavior]: behavior,
        set value(v) { this[$value] = Boolean(!!v || false) || false; },
        get value() { return Boolean(!!this[$value] || false) || false; }
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const ref  = (initial?: any, behavior?: any)=>{
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r = makeReactive({
        [$promise]: isPromise ? initial : null,
        [$behavior]: behavior,
        value: isPromise ? null : deref(initial)
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

//
export const weak = (initial?: any, behavior?: any)=>{ const obj = deref(initial); return ref(isValidObj(obj) ? new WeakRef(obj) : obj, behavior); };
export const propRef =  (src: any, prop: string, initial?: any)=>{
    const r = ref(src[prop]);
    subscribe([src,prop], (val,p) => (r.value = val||initial));
    subscribe([r,"value"], (val,p) => (src[prop] = val));
    return r;
}

// !deprecated?
export const promised = (promise: any, behavior?: any)=>{
    return ref(promise, behavior);
}

//
export const assign = (a, b, prop = "value")=>{
    if (b?.[prop||="value"] != null) { b[prop] ||= a?.[prop]; return subscribe([b,prop],(v,p)=>(a[p] = b[p])); };
}

//
export const link = (a, b, prop = "value")=>{
    const usub = [
        (b?.[prop||="value"] != null) ? subscribe([b,prop],(v,p)=>(a[p] = b[p])) : null,
        (a?.[prop]           != null) ? subscribe([a,prop],(v,p)=>(b[p] = a[p])) : null
    ];
    return ()=>usub?.map?.((a)=>a?.());
}

//
export const link_computed = ([a,b], [asb, bsb]: [Function|null, Function|null] = [null,null])=>{
    const prop = "value";
    const usub = [
        subscribe([a, prop], (value, prop, old) => { b[prop] = asb?.(value, prop, old)??b[prop]; }),
        subscribe([b, prop], (value, prop, old) => { a[prop] = bsb?.(value, prop, old)??a[prop]; })
    ];
    return ()=>usub?.map?.((a)=>a?.());
}



// used for conditional reaction
// !one-directional
export const computed = (sub, cb?: Function|null, dest?: [any, string|number|symbol]|null)=>{
    if (!dest) dest = [makeReactive({}), "value"];
    subscribe(sub, (value, prop, old) => {
        const got = cb?.(value, prop, old);
        if (got !== dest[0]?.[dest[1] ?? "value"]) {
            dest[0][dest[1] ?? "value"] = got;
        }
    });
    return dest?.[0]; // return reactive value
}

// used for redirection properties
// !one-directional
export const remap = (sub, cb?: Function|null, dest?: any|null)=>{
    if (!dest) dest = makeReactive({});
    subscribe(sub, (value, prop, old)=> {
        const got = cb?.(value, prop, old);
        if (typeof got == "object") {
            objectAssignNotEqual(dest, got);
        } else
        if (dest[prop] !== got) dest[prop] = got;
    });
    return dest; // return reactive value
}

// !one-directional
export const unified = (...subs: any[])=>{
    const dest = makeReactive({});
    subs?.forEach?.((sub)=>subscribe(sub, (value, prop, _)=>{
        if (dest[prop] !== value) { dest[prop] = value; };
    })); return dest;
}
