import { makeReactive, subscribe } from "./Mainline";
import { $value, $behavior, $promise } from "./Symbol";
import { addToCallChain, deref, isKeyType, isNotEqual, objectAssignNotEqual } from "./Utils";

/**
 * Создаёт реактивное условное значение.
 *
 * @param {any} ref - Реактивная ссылка или значение, определяющее условие.
 * @param {any} ifTrue - Значение, возвращаемое при истинном условии.
 * @param {any} ifFalse - Значение, возвращаемое при ложном условии.
 * @returns {any} - Реактивная ссылка, которая меняет значение между ifTrue и ifFalse.
 */
export const conditional = (rf: any, ifTrue: any, ifFalse: any)=>{
    const cond = ref((rf?.value ?? rf) ? ifTrue : ifFalse);
    const usb = subscribe([rf, "value"], (val) => { cond.value = val ? ifTrue : ifFalse; });
    addToCallChain(cond, Symbol.dispose, usb); return cond;
}

/**
 * Создаёт реактивную ссылку для числового значения.
 *
 * @param {any} [initial] - Начальное значение или Promise.
 * @param {any} [behavior] - Дополнительное поведение реактива.
 * @returns {any} - Реактивная ссылка с геттером и сеттером для .value (число).
 */
export const numberRef  = (initial?: any, behavior?: any)=>{
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r = makeReactive({
        [$promise]: isPromise ? initial : null,
        [$value]: isPromise ? 0 : (Number(deref(initial) || 0) || 0),
        [$behavior]: behavior,
        set value(v) { this[$value] = ((v != null && !Number.isNaN(v)) ? Number(v) : this[$value]) || 0; },
        get value() { return Number(this[$value] || 0) || 0; }
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

/**
 * Создаёт реактивную ссылку для строкового значения.
 *
 * @param {any} [initial] - Начальное значение или Promise.
 * @param {any} [behavior] - Дополнительное поведение реактива.
 * @returns {any} - Реактивная ссылка с геттером и сеттером для .value (строка).
 */
export const stringRef  = (initial?: any, behavior?: any)=>{
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r = makeReactive({
        [$promise]: isPromise ? initial : null,
        [$value]: isPromise ? "" : String(deref(initial) ?? ""),
        [$behavior]: behavior,
        set value(v) { this[$value] = String(typeof v == "number" ? v : (v || "")); },
        get value() { return String(this[$value] || ""); },
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

/**
 * Создаёт реактивную ссылку для булевого значения.
 *
 * @param {any} [initial] - Начальное значение или Promise.
 * @param {any} [behavior] - Дополнительное поведение реактива.
 * @returns {any} - Реактивная ссылка с геттером и сеттером для .value (boolean).
 */
export const booleanRef  = (initial?: any, behavior?: any)=>{
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r = makeReactive({
        [$promise]: isPromise ? initial : null,
        [$value]: isPromise ? false : Boolean(!!deref(initial) || false) || false,
        [$behavior]: behavior,
        set value(v) { this[$value] = (v != null ? (typeof v == "string" ? true : Boolean(!!v || false)) : this[$value]) || false; },
        get value() { return Boolean(!!this[$value] || false) || false; }
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

/**
 * Создаёт универсальную реактивную ссылку.
 *
 * @param {any} [initial] - Начальное значение или Promise.
 * @param {any} [behavior] - Дополнительное поведение реактива.
 * @returns {any} - Реактивная ссылка с полем .value произвольного типа.
 */
export const ref  = (initial?: any, behavior?: any)=>{
    const isPromise = initial instanceof Promise || typeof initial?.then == "function";
    const $r = makeReactive({
        [$promise]: isPromise ? initial : null,
        [$behavior]: behavior,
        value: isPromise ? null : deref(initial)
    }); initial?.then?.((v)=>$r.value = v); return $r;
}

/**
 * Оборачивает Promise в реактивную ссылку.
 *
 * @deprecated Используйте ref(promise) напрямую.
 * @param {any} promise - Promise, результат которого станет значением .value.
 * @param {any} [behavior] - Дополнительное поведение реактива.
 * @returns {any} - Реактивная ссылка.
 */
export const promised = (promise: any, behavior?: any)=>{
    return ref(promise, behavior);
}

/**
 * Односторонняя синхронизация значений двух реактивных ссылок.
 * Значение a[prop] будет меняться при изменении b[prop].
 *
 * @param {any} a - Получатель значения.
 * @param {any} b - Источник значения.
 * @param {string} [prop="value"] - Имя синхронизируемого поля.
 * @returns {Function|undefined} - Функция для отписки или undefined.
 */
export const assignMap = new WeakMap();
export const assign = (a, b, prop = "value") => {
    const isACompute = typeof a?.[1] == "function" && a?.length == 2, isBCompute = typeof b?.[1] == "function" && b?.length == 2, cmpBFnc = isBCompute ? new WeakRef(b?.[1]) : null;
    const isAProp = (isKeyType(a?.[1]) || a?.[1] == Symbol.iterator) && a?.length == 2; let a_prop = isAProp ? a?.[1] : prop; if (!isAProp) { a = [isACompute ? a?.[1] : a, a_prop]; };
    const isBProp = (isKeyType(b?.[1]) || b?.[1] == Symbol.iterator) && b?.length == 2; let b_prop = isBProp ? b?.[1] : prop; if (!isBProp) { b = [isBCompute ? b?.[1] : b, b_prop]; };
    const compute = (v, p) => {
        if (assignMap?.get?.(aRef?.deref?.())?.get?.(a_prop) == bRef?.deref?.())
            { a[a_prop] = (isBCompute ? cmpBFnc?.deref?.()?.(bRef?.deref?.()?.value ?? v, p, null) : bRef?.deref?.()?.value ?? v); } else { ret?.(); }
    };

    //
    const bRef = new WeakRef(b?.[0]), aRef = new WeakRef(a?.[0]);
    if (assignMap?.get?.(a?.[0])?.get?.(a_prop) == b?.[0]) {
        // !needs to include unsub, and 'assignMap' use [b, unsub]?
        // same value, skip, return de-assign only
        return ()=>{ assignMap?.get?.(aRef?.deref?.())?.delete?.(a_prop); };
    };
    assignMap?.get?.(a?.[0])?.delete?.(a_prop); // @ts-ignore
    assignMap?.getOrInsert?.(a?.[0], new Map())?.set?.(a_prop, b?.[0]);
    b[b_prop] ??= a?.[a_prop] ?? b[b_prop]; const usub = subscribe(b, compute);
    const ret = ()=>{ assignMap?.get?.(aRef?.deref?.())?.delete?.(a_prop); usub?.(); };
    addToCallChain(a?.[0], Symbol.dispose, ret);
    addToCallChain(b?.[0], Symbol.dispose, ret);
    return ret;
}

/**
 * Двунаправленный "лайв-синк" между двумя реактивами/объектами по prop.
 *
 * @param {any} a - Первая ссылка.
 * @param {any} b - Вторая ссылка.
 * @param {string} [prop="value"] - Имя синхронизируемого поля.
 * @returns {Function} - Функция для прекращения синхронизации.
 */
export const link = (a, b, prop = "value")=>{
    const isACompute = typeof a?.[1] == "function", isBCompute = typeof b?.[1] == "function";
    const isAProp = (isKeyType(a?.[1]) || a?.[1] == Symbol.iterator) && a?.length == 2; let a_prop = isAProp ? a?.[1] : prop; if (!isAProp) { a = [isACompute ? a?.[1] : a, a_prop]; };
    const isBProp = (isKeyType(b?.[1]) || b?.[1] == Symbol.iterator) && b?.length == 2; let b_prop = isBProp ? b?.[1] : prop; if (!isBProp) { b = [isBCompute ? b?.[1] : b, b_prop]; };
    const usub = [ assign(a, b, a_prop), assign(b, a, b_prop) ];
    return ()=>usub?.map?.((a)=>a?.());
}

/**
 * Двунаправленный "лайв-синк" между двумя реактивами с возможностью задать преобразование (map).
 *
 * @param {[any, any]} param0 - Кортеж из двух реактивных ссылок.
 * @param {[Function|null, Function|null]} [fns] - Массив функций-трансформеров: [asb, bsb],
 *        для направления a->b и b->a, соответственно.
 * @returns {Function} - Функция для прекращения синхронизации.
 */
export const link_computed = (a, b, prop = "value")=>{
    return link(a, b, prop);
}

// used for conditional reaction
export const computed = (sub, cb?: Function|null, prop = "value")=>{
    const rf = autoRef(cb?.(sub?.[prop], prop));
    assign(rf, [sub, cb], prop); return rf;
}

/**
 * Создаёт реактивную ссылку на свойство объекта.
 *
 * @param {any} src - Исходный объект.
 * @param {string} prop - Имя свойства.
 * @param {any} [initial] - Значение по умолчанию.
 * @returns {any} - Реактивная ссылка, синхронизированная с полем объекта.
 */
export const propRef =  (src: any, prop: string = "value", initial?: any)=>{
    const r = autoRef(src?.[prop] ?? initial);
    return link([src, prop], [r, "value"]);
}

// used for redirection properties
// !one-directional
export const remap = (sub, cb?: Function|null, dest?: any|null)=>{
    if (!dest) dest = makeReactive({});
    const usb = subscribe(sub, (value, prop, old)=> {
        const got = cb?.(value, prop, old);
        if (typeof got == "object") { objectAssignNotEqual(dest, got); } else
        if (isNotEqual(dest[prop], got)) dest[prop] = got;
    });
    if (dest) { addToCallChain(dest, Symbol.dispose, usb); }; return dest; // return reactive value
}

// !one-directional
export const unified = (...subs: any[])=>{
    const dest = makeReactive({});
    subs?.forEach?.((sub)=>subscribe(sub, (value, prop, _)=>{
        if (isNotEqual(dest[prop], value)) { dest[prop] = value; };
    })); return dest;
}

//
export const conditionalIndex = (condList: any[] = []) => { return computed(condList, () => condList.findIndex(cb => cb?.())); }
export const delayedSubscribe = (ref, cb, delay = 100) => {
    let tm: any; //= triggerWithDelay(ref, cb, delay);
    return subscribe([ref, "value"], (v)=>{
        if (!v && tm) { clearTimeout(tm); tm = null; } else
        if (v && !tm) { tm = triggerWithDelay(ref, cb, delay) ?? tm; };
    });
}

// usable for delayed trigger when come true, but NOT when come false
export const triggerWithDelay = (ref, cb, delay = 100)=>{ if (ref?.value ?? ref) { return setTimeout(()=>{ if (ref.value) cb?.(); }, delay); } }
export const delayedBehavior  = (delay = 100) => {
    return (cb, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); };
}

// usable for delayed visible but instant hiding
export const delayedOrInstantBehavior = (delay = 100) => {
    return (cb, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); if (!tm) { cb?.(); }; };
}

//
export const autoRef = (typed: any) => {
    switch (typeof typed) {
        case "boolean": return booleanRef(typed);
        case "number": return numberRef(typed);
        case "string": return stringRef(typed);
        case "object": if (typed != null) { return makeReactive(typed); }
        default: return ref(typed);
    }
}
