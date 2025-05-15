import { isValidObj, objectAssignNotEqual } from "./AssignObject";
import { makeReactive, subscribe } from "./Mainline";
import { deref } from "./Subscript";

//
export const conditional = (ref: any, ifTrue: any, ifFalse: any)=>{
    const cond = makeReactive({value: ref.value ? ifTrue : ifFalse});
    subscribe([ref, "value"], (val) => { cond.value = val ? ifTrue : ifFalse; });
    return cond;
}

//
export const ref  = (initial?: any)=>{ return makeReactive({value: deref(initial)}); }
export const weak = (initial?: any)=>{ const obj = deref(initial); return makeReactive({value: isValidObj(obj) ? new WeakRef(obj) : obj}); };
export const propRef =  (src: any, prop: string, initial?: any)=>{ const r = ref(src[prop]); subscribe([src,prop], (val,p) => (r.value = val||initial)); return r; };

//
export const promised = (promise: any)=>{
    const ref = makeReactive({value: promise});
    promise?.then?.((v)=>ref.value = v);
    return ref;
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
    }));
    return dest;
}

//
export const assign = (a, b, prop = "value")=>{
    if (b?.[prop||="value"] != null) { b.value ||= a?.value; subscribe([b,prop],(v,p)=>(a[p] = b[p])); };
    return a;
}

//
export const link = (a, b, prop = "value")=>{
    if (b?.[prop||="value"] != null) { b.value ||= a?.value; subscribe([b,prop],(v,p)=>(a[p] = b[p])); };
    if (a?.[prop]           != null) { a.value ||= b?.value; subscribe([a,prop],(v,p)=>(b[p] = a[p])); };
    return a;
}
