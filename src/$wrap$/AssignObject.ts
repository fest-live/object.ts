import { objectAssign } from "fest/core";
import { $originalKey$ } from "./Symbol";
import { $originalObjects$, type keyType, refValid } from "./Utils";

//
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

//
export const makeObjectAssignable = <Under = any>(obj: Under): refValid<Under> => {
    // @ts-ignore
    if (obj?.[$originalKey$] || $originalObjects$.has(obj)) { return obj; }

    // @ts-ignore
    const px = new Proxy(obj, new AssignObjectHandler());
    $originalObjects$.set(px, obj); return px;
}
