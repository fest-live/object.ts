/**
 * Proxy helper that forces property writes through `objectAssign`.
 *
 * WHY: some callers want an object that looks ordinary but still normalizes
 * assignment semantics the same way the rest of the reactive stack does.
 */
import { objectAssign } from "fest/core";
import { $originalKey$ } from "./Symbol";
import { $originalObjects$, type keyType, type observeValid } from "./Utils";

/** Proxy handler that redirects `set` operations to the Fest assignment helper. */
export class AssignObjectHandler {
    constructor() { }
    deleteProperty(target, name: keyType) { const result = Reflect.deleteProperty(target, name); return result; }
    construct(target, args, newT) { return Reflect.construct(target, args, newT); }
    apply(target, ctx, args) { return Reflect.apply(target, ctx, args); }
    has(target, prop: keyType) { return Reflect.has(target, prop); }
    set(target, name: keyType, value) { objectAssign(target, value, name); return true; }
    get(target, name: keyType, ctx) {
        if (typeof name == "symbol") { return target?.[name] ?? target; }
        return Reflect.get(target, name, ctx);
    }
}

/** Wrap an object in an assignment-aware proxy once, preserving the original-object lookup table. */
export const makeObjectAssignable = <Under = any>(obj: Under): observeValid<Under> => {
    // @ts-ignore
    if (obj?.[$originalKey$] || $originalObjects$.has(obj)) { return obj; }

    // @ts-ignore
    const px = new Proxy(obj, new AssignObjectHandler());
    $originalObjects$.set(px, obj); return px;
}
