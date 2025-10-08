import { subscribe } from "./Mainline";
import { addToCallChain, isKeyType, isNotEqual, objectAssignNotEqual, refValid, subValid, type keyType } from "../$wrap$/Utils";
import { autoRef, makeReactive, triggerWithDelay } from "./Primitives";

//
export const conditionalIndex = <Under = any>(condList: any[] = []): refValid<Under> => { return computed(condList, () => condList.findIndex(cb => cb?.()), "value"); } // TODO: check
export const conditional = <Under = any>(cond: any, ifTrue: any, ifFalse: any, behavior?: any): refValid<Under> => {
    const cur = autoRef((cond?.value ?? cond) ? ifTrue : ifFalse, behavior);
    const usb = subscribe([cond, "value"], (val) => { if (cur != null && (typeof cur == "object" || typeof cur == "function")) cur.value = val ? ifTrue : ifFalse; });
    addToCallChain(cur, Symbol.dispose, usb); return cur;
}

//
// used for redirection properties
// !one-directional
export const remap = <Under = any>(sub: subValid<Under>, cb?: Function | null, dest?: any | null) => {
    if (!dest) dest = makeReactive<Under>({});
    const usb = subscribe(sub, (value, prop, old) => {
        const got = cb?.(value, prop, old);
        if (typeof got == "object") { objectAssignNotEqual(dest, got); } else
            if (isNotEqual(dest[prop], got)) dest[prop] = got;
    });
    if (dest) { addToCallChain(dest, Symbol.dispose, usb); }; return dest; // return reactive value
}

//
// !one-directional
export const unified = <Under = any>(...subs: subValid<Under>[]) => {
    const dest = makeReactive({});
    subs?.forEach?.((sub) => subscribe(sub, (value, prop, _) => {
        if (isNotEqual(dest[prop], value)) { dest[prop] = value; };
    })); return dest;
}

//
export const observableBySet = <Under = any>(set: Set<Under>): refValid<Under, Set<Under>> => { // @ts-ignore
    const obs: Under[] = makeReactive<Under[]>([]) as refValid<Under>; // @ts-ignore
    // Initialize with existing set entries
    obs.push(...Array.from(set?.values?.() || [])); // @ts-ignore
    addToCallChain(obs, Symbol.dispose, subscribe(set, (value, _, old) => { // @ts-ignore
        if (isNotEqual(value, old)) {
            if (old == null && value != null) {
                obs.push(value);
            } else
                if (old != null && value == null) {
                    const idx = obs.indexOf(old);
                    if (idx >= 0) obs.splice(idx, 1);
                } else {
                    const idx = obs.indexOf(old);
                    if (idx >= 0 && isNotEqual(obs[idx], value)) obs[idx] = value;
                }
        }
    }));
    return obs;
}

//
export const observableByMap = <Under = any>(map: Map<any, Under>): refValid<Under, [any, Under][]> => { // @ts-ignore
    const obs: [any, Under][] = makeReactive<[any, Under][]>([]) as refValid<Under>; // @ts-ignore

    // Initialize with existing map entries
    const initialEntries: [any, Under][] = Array.from(map.entries());
    obs.push(...initialEntries);

    //
    addToCallChain(obs, Symbol.dispose, subscribe(map, (value, prop, old) => {
        if (isNotEqual(value, old) || (old == null && value != null) || (old != null && value == null)) {
            if (old != null && value == null) {
                // Map entry deleted (by name)
                let idx = obs.findIndex(([name, _]) => (name == prop));

                // alternative index search
                if (idx < 0) idx = obs.findIndex(([_, val]) => (old === val));

                // remove entry
                if (idx >= 0) obs.splice(idx, 1);
            } else {
                // Map entry added or updated (by name)
                let idx = obs.findIndex(([name, _]) => (name == prop));

                // alternative index search
                if (idx < 0) idx = obs.findIndex(([_, val]) => (old === val));

                //
                if (idx >= 0) {
                    // Entry exists - update if value changed
                    if (isNotEqual(obs[idx]?.[1], value)) {
                        obs[idx] = [prop, value];
                    }
                } else {
                    // New entry - add to array
                    obs.push([prop, value]);
                }
            }
        }
    }));

    //
    return obs;
}

//
const $getValue = ($objOrPlain: any) => {
    if (typeof $objOrPlain == "object" && $objOrPlain != null && ($objOrPlain?.value != null || "value" in $objOrPlain)) { return $objOrPlain?.value; }; return $objOrPlain;
}

//
export interface PropStore {
    unsub?: any;
    bound?: any;
    cmpfx?: any;
    compute?: any;
    dispose?: any;
}

//
export const assignMap = new WeakMap<any, Map<any, PropStore>>();
export const assign = <Under = any>(a: subValid<Under>, b: subValid<Under>, prop: keyType = "value") => {
    const isACompute = typeof a?.[1] == "function" && (a as [any, keyType])?.length == 2, isBCompute = typeof b?.[1] == "function" && (b as [any, keyType])?.length == 2, cmpBFnc = isBCompute ? b?.[1] : null;
    const isAProp = (isKeyType(a?.[1]) || a?.[1] == Symbol.iterator) && (a as [any, keyType])?.length == 2; let a_prop = (isAProp && !isACompute) ? a?.[1] : prop; if (!isAProp && !isACompute) { a = [a, a_prop]; }; if (isACompute) { a[1] = a_prop; };
    const isBProp = (isKeyType(b?.[1]) || b?.[1] == Symbol.iterator) && (b as [any, keyType])?.length == 2; let b_prop = (isBProp && !isBCompute) ? b?.[1] : prop; if (!isBProp && !isBCompute) { b = [b, b_prop]; }; if (isBCompute) { b[1] = b_prop; };

    //
    if (!(typeof b?.[0] == "object" || typeof b?.[0] == "function")) { a[0][a_prop] = b?.[0]; return () => { }; };

    //
    const compute = (v, p) => {
        if (assignMap?.get?.(aRef?.deref?.())?.get?.(a_prop)?.bound == bRef?.deref?.()) {
            let val: any = null;
            const cmpfx = assignMap?.get?.(aRef?.deref?.())?.get?.(a_prop)?.cmpfx;
            if (typeof cmpfx == "function") { val = cmpfx?.($getValue(bRef?.deref?.()) ?? v, p, null); } else { val = bRef?.deref?.()?.[p] ?? v; };

            //
            const nv = $getValue(val);
            aRef.deref()[a_prop] = nv;
        } else {
            const map = assignMap?.get?.(aRef?.deref?.());
            const store = map?.get?.(a_prop);
            store?.dispose?.();
        }
    };

    //
    const dispose = () => {
        const map = assignMap?.get?.(aRef?.deref?.());
        const store = map?.get?.(a_prop);
        map?.delete?.(a_prop);
        store?.unsub?.();
    };

    //
    const bRef = b?.[0] != null && (typeof b?.[0] == "object" || typeof b?.[0] == "function") && !(b?.[0] instanceof WeakRef || typeof b?.[0]?.deref == "function") ? new WeakRef(b?.[0]) : b?.[0],
        aRef = a?.[0] != null && (typeof a?.[0] == "object" || typeof a?.[0] == "function") && !(a?.[0] instanceof WeakRef || typeof a?.[0]?.deref == "function") ? new WeakRef(a?.[0]) : a?.[0];

    //
    let store: PropStore = { compute, dispose, cmpfx: cmpBFnc };

    //
    const a_tmp = aRef?.deref?.(), b_tmp = bRef?.deref?.();
    if (aRef instanceof WeakRef) {
        if (assignMap?.get?.(a_tmp)?.get?.(a_prop)?.bound != b_tmp) {
            assignMap?.get?.(a_tmp)?.delete?.(a_prop);
        };

        // @ts-ignore
        const map = assignMap?.getOrInsert?.(a_tmp, new Map());
        store = map?.getOrInsertComputed?.(a_prop, () => ({
            bound: b_tmp,
            cmpfx: cmpBFnc,
            unsub: null,
            compute,
            dispose,
        }));

        //
        store.unsub = subscribe(b, compute);
        store.cmpfx = cmpBFnc;
        addToCallChain(a_tmp, Symbol.dispose, store?.dispose);
        addToCallChain(b_tmp, Symbol.dispose, store?.dispose);
    }

    //
    if (b_tmp) { b_tmp[b_prop] ??= a_tmp?.[a_prop] ?? b_tmp[b_prop]; }

    //
    return store?.dispose;
}

//
export const link = <Under = any>(a: subValid<Under>, b: subValid<Under>, prop: keyType = "value") => {
    /*const isACompute = typeof a?.[1] == "function", isBCompute = typeof b?.[1] == "function";
    const isAProp = (isKeyType(a?.[1]) || a?.[1] == Symbol.iterator) && (a as [any, keyType])?.length == 2; let a_prop = (isAProp && !isACompute) ? a?.[1] : prop; if (!isAProp && !isACompute) { a = [a, a_prop]; }; if (isACompute) { a[1] = a_prop; };
    const isBProp = (isKeyType(b?.[1]) || b?.[1] == Symbol.iterator) && (b as [any, keyType])?.length == 2; let b_prop = (isBProp && !isBCompute) ? b?.[1] : prop; if (!isBProp && !isBCompute) { b = [b, b_prop]; }; if (isBCompute) { b[1] = b_prop; };
    const usub = [ assign(a, b, b_prop), assign(b, a, a_prop) ];*/
    const usub = [assign(a, b, prop), assign(b, a, prop)];
    return () => usub?.map?.((c) => c?.());
}

//
export const computed = <Under = any, OutputUnder = Under>(src: subValid<Under>, cb?: Function | null, behavior?: any, prop: keyType = "value"): refValid<OutputUnder> => {
    prop ??= "value";
    const isACompute = typeof src?.[1] == "function" && (src as [any, keyType])?.length == 2;
    const isAProp = (isKeyType(src?.[1]) || src?.[1] == Symbol.iterator) && (src as [any, keyType])?.length == 2; let a_prop = (isAProp && !isACompute) ? src?.[1] : prop; if (!isAProp && !isACompute) { src = [src, a_prop]; }; if (isACompute) { src[1] = a_prop; };
    const rf = autoRef(cb?.(src?.[0]?.[prop], prop), behavior);
    assign([rf, prop], [src?.[0], cb], prop); return rf;
}

//
export const propRef = <Under = any>(src: refValid<Under>, srcProp: keyType = "value", behavior?: any, initial?: any): refValid<Under> => {
    const r = autoRef(src?.[srcProp ??= "value"] ?? initial, behavior);
    link([r, "value"], [src, srcProp]); return r;
}

//
export const delayedSubscribe = <Under = any>(ref: any, cb: Function, delay = 100): refValid<Under> => {
    let tm: any; //= triggerWithDelay(ref, cb, delay);
    return subscribe([ref, "value"], (v) => {
        if (!v && tm) { clearTimeout(tm); tm = null; } else
            if (v && !tm) { tm = triggerWithDelay(ref, cb, delay) ?? tm; };
    });
}