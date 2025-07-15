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
export const conditional = (ref: any, ifTrue: any, ifFalse: any)=>{
    const cond = ref((ref?.value ?? ref) ? ifTrue : ifFalse);
    const usb = subscribe([ref, "value"], (val) => { cond.value = val ? ifTrue : ifFalse; });
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
 * Создаёт реактивную ссылку на свойство объекта.
 *
 * @param {any} src - Исходный объект.
 * @param {string} prop - Имя свойства.
 * @param {any} [initial] - Значение по умолчанию.
 * @returns {any} - Реактивная ссылка, синхронизированная с полем объекта.
 */
export const propRef =  (src: any, prop: string, initial?: any)=>{
    const r = ref(src[prop]);
    const u1 = subscribe([src,prop], (val,p) => (r.value = val||initial));
    const u2 = subscribe([r,"value"], (val,p) => (src[prop] = val));
    addToCallChain(r, Symbol.dispose, ()=>{ u1?.(); u2?.(); }); return r;
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
export const assign = (a, b, prop = "value")=>{
    const isAProp = (isKeyType(a?.[1]) || a?.[1] == Symbol.iterator); let a_prop = isAProp ? a?.[1] : prop; if (!isAProp) { a = [a, prop]; };
    const isBProp = (isKeyType(b?.[1]) || b?.[1] == Symbol.iterator); let b_prop = isBProp ? b?.[1] : prop; if (!isBProp) { b = [b, prop]; };
    b[b_prop] ??= a?.[a_prop]; return subscribe(b, (v,p)=>(a[p] = v));
}

/**
 * Двунаправленный "лайв-синк" между двумя реактивами/объектами по prop.
 *
 * @param {any} a - Первая ссылка.
 * @param {any} b - Вторая ссылка.
 * @param {string} [prop="value"] - Имя синхронизируемого поля.
 * @returns {Function} - Функция для прекращения синхронизации.
 */
export const link = (a, b)=>{
    const isAProp = (isKeyType(a?.[1]) || a?.[1] == Symbol.iterator); if (!isAProp) { a = [a, "value"]; };
    const isBProp = (isKeyType(b?.[1]) || b?.[1] == Symbol.iterator); if (!isBProp) { b = [b, "value"]; };
    const usub = [
        subscribe(b,(v,p)=>(a[p] = v)),
        subscribe(a,(v,p)=>(b[p] = v))
    ];
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
export const link_computed = ([a,b], [asb, bsb]: [Function|null, Function|null] = [null,null])=>{
    const isAProp = (isKeyType(a?.[1]) || a?.[1] == Symbol.iterator); if (!isAProp) { a = [a, "value"]; };
    const isBProp = (isKeyType(b?.[1]) || b?.[1] == Symbol.iterator); if (!isBProp) { b = [b, "value"]; };
    const usub = [
        subscribe(a, (value, prop, old) => { b[prop] = asb?.(value, prop, old)??b[prop]; }),
        subscribe(b, (value, prop, old) => { a[prop] = bsb?.(value, prop, old)??a[prop]; })
    ];
    return ()=>usub?.map?.((a)=>a?.());
}

// used for conditional reaction
// !one-directional
export const computed = (sub, cb?: Function|null, dest?: [any, string|number|symbol]|null)=>{
    const inProp = "value", outProp = "value";
    const isProp = (isKeyType(sub?.[1]) || sub?.[1] == Symbol.iterator); if (!isProp) { sub = [sub, inProp]; };
    if (!dest) dest = [ref(cb?.(sub?.[inProp], inProp, null)), outProp];
    const usb = subscribe(sub, (value, prop, old) => {
        const got = cb?.(value, prop, old);
        if (isNotEqual(got, dest[0]?.[dest[1]])) { dest[0][dest[1]] = got; };
    });
    if (dest?.[0]) { addToCallChain(dest[0], Symbol.dispose, usb); }
    return dest?.[0]; // return reactive value
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
        case "object": return makeReactive(typed);
        default: return ref(typed);
    }
}
