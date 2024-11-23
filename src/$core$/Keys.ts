export const $extractKey$ = "$@extract@$";//Symbol("@extract");
export const $originalKey$ = "$@origin@$";//Symbol("@origin");
export const $originalObjects$ = new WeakMap();

//
export const boundCtx = new WeakMap();
export const bindFx = (target, fx)=>{
    if (!boundCtx.has(target)) {
        boundCtx.set(target, new WeakMap());
    }

    //
    const be = boundCtx.get(target);
    if (!be.has(fx)) {
        const bfx = fx?.bind?.(target);
        be.set(fx, bfx);
    }

    //
    return be.get(fx);
}

//
export const bindCtx = (target, fx) => {
    return (typeof fx == "function" ? bindFx(target, fx) : fx) ?? fx;
}

//
export type keyType = string | number | symbol;

// TODO! WeakMap or WeakSet support
export const isKeyType = (prop: any)=>{
    return ["symbol", "string", "number"].indexOf(typeof prop) >= 0;
}

//
export const isIterable = (obj) => {
    return (typeof obj?.[Symbol.iterator] == "function");
}

//
export const callByProp = (unwrap, prop, cb, ctx)=>{
    if (unwrap instanceof Map || unwrap instanceof WeakMap) {
        if (prop != null && unwrap.has(prop as any)) {
            return cb?.(unwrap.get(prop as any), prop);
        }
    } else

    //
    if (unwrap instanceof Set || unwrap instanceof WeakSet) {
        if (prop != null && unwrap.has(prop as any)) {
            // @ts-ignore
            return cb?.(prop, prop);
        }
    } else

    //
    if (typeof unwrap == "function" || typeof unwrap == "object") {
        return cb?.(Reflect.get(unwrap, prop, ctx ?? unwrap), prop);
    }
}

//
export const callByAllProp = (unwrap, cb, ctx)=>{
    let keys: any = [];
    if (unwrap instanceof Set || unwrap instanceof Map || Array.isArray(unwrap) || isIterable(unwrap) || typeof unwrap?.keys == "function") {
        // @ts-ignore
        keys = unwrap?.keys?.() || keys;
    } else
    if (typeof unwrap == "object" || typeof unwrap == "function") {
        keys = Object.keys(unwrap) || keys;
    }
    return Array.from(keys)?.map?.((prop)=>callByProp(unwrap, prop, cb, ctx));
}
