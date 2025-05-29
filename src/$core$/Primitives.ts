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
const $value = Symbol.for("@value");

// very hard type
export const numberRef  = (initial?: any, behaviour?: any)=>{
    const $r = {
        [$value]: Number(deref(initial) || 0) || 0,
        set value(v) { this[$value] = Number(v) || 0; },
        get value() { return Number(this[$value] || 0) || 0; },
        behaviour
    };
    return makeReactive($r);
}

// very hard type
export const stringRef  = (initial?: any, behaviour?: any)=>{
    const $r = {
        [$value]: String(deref(initial) ?? "") || "",
        set value(v) { this[$value] = String(v ?? "") || ""; },
        get value() { return String(this[$value] || "") || ""; },
        behaviour
    };
    return makeReactive($r);
}

// very hard type
export const booleanRef  = (initial?: any, behaviour?: any)=>{
    const $r = {
        [$value]: Boolean(!!deref(initial) || false) || false,
        set value(v) { this[$value] = Boolean(!!v || false) || false; },
        get value() { return Boolean(!!this[$value] || false) || false; },
        behaviour
    };
    return makeReactive($r);
}

//
export const ref  = (initial?: any, behaviour?: any)=>{ return makeReactive({value: deref(initial), behaviour}); }
export const weak = (initial?: any, behaviour?: any)=>{ const obj = deref(initial); return makeReactive({value: isValidObj(obj) ? new WeakRef(obj) : obj, behaviour}); };
export const propRef =  (src: any, prop: string, initial?: any)=>{
    const r = ref(src[prop]);
    subscribe([src,prop], (val,p) => (r.value = val||initial));
    subscribe([r,"value"], (val,p) => (src[prop] = val));
    return r;
}

//
export const promised = (promise: any, behaviour?: any)=>{
    const ref = makeReactive({value: promise, behaviour});
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
