import { makeReactive, subscribe } from "../$core$/Mainline";
import { $value, $behavior, $promise } from "../$wrap$/Symbol";
import { addToCallChain, deref, isKeyType, isNotEqual, objectAssignNotEqual } from "../$wrap$/Utils";

/**
 * Создаёт реактивное условное значение.
 *
 * @param {any} ref - Реактивная ссылка или значение, определяющее условие.
 * @param {any} ifTrue - Значение, возвращаемое при истинном условии.
 * @param {any} ifFalse - Значение, возвращаемое при ложном условии.
 * @returns {any} - Реактивная ссылка, которая меняет значение между ifTrue и ifFalse.
 */
export const conditional = (cond: any, ifTrue: any, ifFalse: any, behavior?: any)=>{
    const cur = autoRef((cond?.value ?? cond) ? ifTrue : ifFalse, behavior);
    const usb = subscribe([cond, "value"], (val) => { cur.value = val ? ifTrue : ifFalse; });
    addToCallChain(cur, Symbol.dispose, usb); return cur;
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
        [$value]: (isPromise ? "" : String(deref(initial || "") || "")) || "",
        [$behavior]: behavior,
        set value(v) { this[$value] = String(typeof v == "number" ? v : (v || "")) || ""; },
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
        [$value]: (isPromise ? false : !!deref(initial)) || false,
        [$behavior]: behavior,
        set value(v) { this[$value] = (v != null ? (typeof v == "string" ? true : !!v) : this[$value]) || false; },
        get value() { return this[$value] || false; }
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
 * Создаёт реактивную ссылку на основе типа данных.
 *
 * @param {any} typed - Исходное значение.
 * @returns {any} - Реактивная ссылка.
 */
export const autoRef = (typed: any, behavior?: any) => {
    switch (typeof typed) {
        case "boolean": return booleanRef(typed, behavior);
        case "number" : return numberRef(typed, behavior);
        case "string" : return stringRef(typed, behavior);
        case "object" : if (typed != null) { return makeReactive(typed); }
        default: return ref(typed, behavior);
    }
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

//
const $getValue = ($objOrPlain: any)=>{
    if (typeof $objOrPlain == "object" && ("value" in $objOrPlain || $objOrPlain?.value != null)) { return $objOrPlain?.value; }; return $objOrPlain;
}

//
export const assignMap = new WeakMap();
export const assign = (a, b, prop = "value") => {
    const isACompute = typeof a?.[1] == "function" && a?.length == 2, isBCompute = typeof b?.[1] == "function" && b?.length == 2, cmpBFnc = isBCompute ? b?.[1] : null;
    const isAProp = (isKeyType(a?.[1]) || a?.[1] == Symbol.iterator) && a?.length == 2; let a_prop = (isAProp && !isACompute) ? a?.[1] : prop; if (!isAProp && !isACompute) { a = [a, a_prop]; }; if (isACompute) { a[1] = a_prop; };
    const isBProp = (isKeyType(b?.[1]) || b?.[1] == Symbol.iterator) && b?.length == 2; let b_prop = (isBProp && !isBCompute) ? b?.[1] : prop; if (!isBProp && !isBCompute) { b = [b, b_prop]; }; if (isBCompute) { b[1] = b_prop; };

    //
    if (!(typeof b?.[0] == "object" || typeof b?.[0] == "function")) { a[0][a_prop] = b?.[0]; return ()=>{}; };

    //
    const compute = (v, p) => {
        if (assignMap?.get?.(aRef?.deref?.())?.get?.(a_prop) == bRef?.deref?.())
            { aRef.deref()[a_prop] = (typeof cmpBFnc == "function" ?
                $getValue(cmpBFnc?.($getValue(bRef?.deref?.()) ?? v, p, null)) :
                $getValue(bRef?.deref?.()) ?? v
            ); } //else { ret?.(); }
    };

    //
    const bRef = b?.[0] != null && (typeof b?.[0] == "object" || typeof b?.[0] == "function") && !(b?.[0] instanceof WeakRef || typeof b?.[0]?.deref == "function") ? new WeakRef(b?.[0]) : b?.[0],
          aRef = a?.[0] != null && (typeof a?.[0] == "object" || typeof a?.[0] == "function") && !(a?.[0] instanceof WeakRef || typeof a?.[0]?.deref == "function") ? new WeakRef(a?.[0]) : a?.[0];
    if (aRef instanceof WeakRef) {
        if (assignMap?.get?.(aRef?.deref?.())?.get?.(a_prop) != bRef?.deref?.()) {
            assignMap?.get?.(aRef?.deref?.())?.delete?.(a_prop); // @ts-ignore
            assignMap?.getOrInsert?.(aRef?.deref?.(), new Map())?.set?.(a_prop, bRef?.deref?.());
        };
    }

    //
    bRef.deref()[b_prop] ??= aRef.deref()[a_prop] ?? bRef.deref()[b_prop];

    //
    let ret: any, usub: any;
    ret  = ()=>{ assignMap?.get?.(aRef?.deref?.())?.delete?.(a_prop); usub?.(); };

    //
    usub = subscribe(b, compute);

    //ssss
    //addToCallChain(aRef?.deref?.(), Symbol.dispose, ret);
    //addToCallChain(bRef?.deref?.(), Symbol.dispose, ret);
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
export const link = (a, b, prop = "value") => {
    const isACompute = typeof a?.[1] == "function", isBCompute = typeof b?.[1] == "function";
    const isAProp = (isKeyType(a?.[1]) || a?.[1] == Symbol.iterator) && a?.length == 2; let a_prop = (isAProp && !isACompute) ? a?.[1] : prop; if (!isAProp && !isACompute) { a = [a, a_prop]; }; if (isACompute) { a[1] = a_prop; };
    const isBProp = (isKeyType(b?.[1]) || b?.[1] == Symbol.iterator) && b?.length == 2; let b_prop = (isBProp && !isBCompute) ? b?.[1] : prop; if (!isBProp && !isBCompute) { b = [b, b_prop]; }; if (isBCompute) { b[1] = b_prop; };
    const usub = [ assign(a, b, a_prop), assign(b, a, b_prop) ];
    return ()=>usub?.map?.((a)=>a?.());
}

/**
 * Создаёт реактивную ссылку на результат вычисления.
 *
 * @param {any} src - Исходный объект.
 * @param {Function|null} cb - Функция вычисления.
 * @param {string} [prop="value"] - Имя свойства.
 * @returns {any} - Реактивная ссылка.
 */
export const computed = (src, cb?: Function|null, behavior?: any, prop = "value")=>{ prop ??= "value";
    const isACompute = typeof src?.[1] == "function" && src?.length == 2;
    const isAProp = (isKeyType(src?.[1]) || src?.[1] == Symbol.iterator) && src?.length == 2; let a_prop = (isAProp && !isACompute) ? src?.[1] : prop; if (!isAProp && !isACompute) { src = [src, a_prop]; }; if (isACompute) { src[1] = a_prop; };
    const rf = autoRef(cb?.(src?.[0]?.[prop], prop), behavior);
    assign([rf, prop], [src?.[0], cb], prop); return rf;
}

/**
 * Создаёт реактивную ссылку на свойство объекта.
 *
 * @param {any} src - Исходный объект.
 * @param {string} prop - Имя свойства.
 * @param {any} [behavior] - Дополнительное поведение реактива.
 * @param {any} [initial] - Значение по умолчанию.
 * @returns {any} - Реактивная ссылка, синхронизированная с полем объекта.
 */
export const propRef =  (src: any, srcProp: any = "value", behavior?: any, initial?: any)=>{
    const r = autoRef(src?.[srcProp ??= "value"] ?? initial, behavior);
    link([r, "value"], [src, srcProp]); return r;
}

/**
 * Создаёт реактивную ссылку на индекс первого элемента в массиве, удовлетворяющего условию.
 *
 * @param {any[]} condList - Массив условий.
 * @returns {any} - Реактивная ссылка.
 */
export const conditionalIndex = (condList: any[] = []) => { return computed(condList, () => condList.findIndex(cb => cb?.()), "value"); }

/**
 * Запускает функцию с задержкой, если значение реактивной ссылки истинно.
 *
 * @param {any} ref - Реактивная ссылка.
 * @param {Function} cb - Функция для выполнения.
 * @param {number} [delay=100] - Задержка в миллисекундах.
 * @returns {any} - Таймер или null.
 */
export const delayedSubscribe = (ref, cb, delay = 100) => {
    let tm: any; //= triggerWithDelay(ref, cb, delay);
    return subscribe([ref, "value"], (v)=>{
        if (!v && tm) { clearTimeout(tm); tm = null; } else
        if (v && !tm) { tm = triggerWithDelay(ref, cb, delay) ?? tm; };
    });
}

/**
 * Запускает функцию с задержкой, если значение реактивной ссылки истинно.
 *
 * @param {any} ref - Реактивная ссылка.
 * @param {Function} cb - Функция для выполнения.
 * @param {number} [delay=100] - Задержка в миллисекундах.
 * @returns {any} - Таймер или null.
 */
export const triggerWithDelay = (ref, cb, delay = 100)=>{ if (ref?.value ?? ref) { return setTimeout(()=>{ if (ref.value) cb?.(); }, delay); } }

/**
 * Запускает функцию с задержкой, если значение реактивной ссылки истинно.
 *
 * @param {any} ref - Реактивная ссылка.
 * @param {Function} cb - Функция для выполнения.
 * @param {number} [delay=100] - Задержка в миллисекундах.
 * @returns {any} - Таймер или null.
 */
export const delayedBehavior  = (delay = 100) => {
    return (cb, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); };
}

/**
 * Запускает функцию с задержкой, если значение реактивной ссылки истинно.
 *
 * @param {any} ref - Реактивная ссылка.
 * @param {Function} cb - Функция для выполнения.
 * @param {number} [delay=100] - Задержка в миллисекундах.
 * @returns {any} - Таймер или null.
 */
export const delayedOrInstantBehavior = (delay = 100) => {
    return (cb, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); if (!tm) { cb?.(); }; };
}

/**
 * @deprecated Use `computed` instead.
 */
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

/**
 * @deprecated Use `computed` instead.
 */
// !one-directional
export const unified = (...subs: any[])=>{
    const dest = makeReactive({});
    subs?.forEach?.((sub)=>subscribe(sub, (value, prop, _)=>{
        if (isNotEqual(dest[prop], value)) { dest[prop] = value; };
    })); return dest;
}
