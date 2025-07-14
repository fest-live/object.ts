import { objectAssign } from "./AssignObject";
import { callByAllProp, callByProp, isKeyType, safe, withPromise, type keyType } from "./Utils";
import { subscriptRegistry } from "./Subscript";
import { makeReactiveArray, makeReactiveMap, makeReactiveObject, makeReactiveSet } from "./Specific";
import { $extractKey$, $registryKey$, $target } from "./Symbol";

/**
 * Преобразует целевой объект, функцию или коллекцию в реактивную сущность.
 *
 * @param {any} target - Целевое значение (объект, функция, Map, Set и т.д.)
 * @param {string} [stateName=""] - Необязательное имя состояния (используется для отладки/логирования)
 * @returns {any} - Реактивная версия переданного значения
 */
export const makeReactive: any = (target: any, stateName = ""): any => {
    if (typeof target == "symbol" || !(typeof target == "object" || typeof target == "function") || target == null || target?.[$extractKey$]) return target;
    if (target instanceof Promise || target instanceof WeakRef) return target; // promise forbidden

    //
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
    if (typeof unwrap == "symbol" || !(typeof unwrap == "object" || typeof unwrap == "function") || unwrap == null) return target;
    if (unwrap instanceof Promise || unwrap instanceof WeakRef) return target; // promise forbidden

    //
    let reactive = target;
    if (Array.isArray(unwrap)) { reactive = makeReactiveArray(target); } else
    if (unwrap instanceof Map || unwrap instanceof WeakMap) { reactive = makeReactiveMap(target); } else
    if (unwrap instanceof Set || unwrap instanceof WeakSet) { reactive = makeReactiveSet(target); } else
    if (typeof unwrap == "function" || typeof unwrap == "object") { reactive = makeReactiveObject(target); }

    //
    return reactive;
}

/**
 * Подписывает колбэк на изменения в реактивном объекте или его отдельном свойстве.
 *
 * @param {any} tg - Целевой реактивный объект или пара [объект, ключ]
 * @param {(value: any, prop: keyType, old?: any) => void} cb - Колбэк, вызываемый при изменениях
 * @param {any | null} [ctx=null] - Контекст вызова колбэка
 * @returns {Function} - Функция отписки, поддерживает также Symbol.dispose и Symbol.asyncDispose
 */
export const subscribe = (tg: any, cb: (value: any, prop: keyType, old?: any) => void, ctx: any | null = null) => {
    if (typeof tg == "symbol" || !(typeof tg == "object" || typeof tg == "function") || tg == null) return;

    //
    const isPair = Array.isArray(tg) && tg?.length == 2 && ["object", "function"].indexOf(typeof tg?.[0]) >= 0 && (isKeyType(tg?.[1]) || (Array.isArray(tg?.[0] && tg?.[1] == Symbol.iterator)));
    const prop   = isPair && (typeof tg?.[1] != "object" && typeof tg?.[1] != "function") ? tg?.[1] : null;

    // tg?.[0] ?? tg now isn't allowed anymore, because it's not safe
    tg = (isPair && (prop != null)) ? tg?.[0] : tg; if (!tg) return;

    // temp ban with dispose
    return withPromise(tg, (target: any) => { if (!target) return;
        if (typeof target == "symbol" || !(typeof target == "object" || typeof target == "function") || target == null) return;
        let unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target; if (!unwrap) return;
        if (typeof unwrap == "symbol" || !(typeof unwrap == "object" || typeof unwrap == "function") || unwrap == null) return;

        //
        const tProp = prop != Symbol.iterator ? prop : null;
        if (tProp != null) { callByProp(unwrap, tProp, cb, ctx); } else { callByAllProp(unwrap, cb, ctx); }
        let self = target?.[$registryKey$] ?? (subscriptRegistry).get(unwrap); if (self?.[Symbol.dispose]) return;

        // @ts-ignore
        if (!self && unwrap?.[Symbol.observable]) {
            unwrap = makeReactive(unwrap); // @ts-ignore
            unwrap?.[Symbol.observable]?.()?.subscribe?.((value, prop?: any) => (unwrap[prop ?? "value"] = value));
            self ??= unwrap?.[$registryKey$] ?? (subscriptRegistry).get(unwrap) ?? self;
        }
        if (!self) return; self?.subscribe?.(cb, tProp);

        //
        const unsub = () => { return self?.unsubscribe?.(cb, tProp); }
        if (Symbol?.dispose != null) { unsub[Symbol.dispose] ??= () => { return self?.unsubscribe?.(cb, tProp); } }
        if (Symbol?.asyncDispose != null) { unsub[Symbol.asyncDispose] ??= () => { return self?.unsubscribe?.(cb, tProp); } }

        // @ts-ignore
        try { unwrap[Symbol.observable] = self?.compatible; } catch (e) { console.warn("Unable to assign <[Symbol.observable]>, object will not observable by other frameworks"); };
        return unsub;
    });
}

/**
 * Подписывает колбэк на изменения в реактивном объекте или его отдельном свойстве.
 * Если передан массив, то подписывается на изменения всех свойств.
 * Данный метод является более удобным вариантом для работы с массивами.
 * Legacy for some our frameworks, use subscribe instead.
 *
 * @param {any} tg - Целевой реактивный объект или пара [объект, ключ]
 * @param {(value: any, prop: keyType, old?: any) => void} cb - Колбэк, вызываемый при изменениях
 * @param {any | null} [ctx=null] - Контекст вызова колбэка
 * @returns {Function} - Функция отписки, поддерживает также Symbol.dispose и Symbol.asyncDispose
 */
export const observe = (tg: any, cb: (value: any, prop: keyType, old?: any) => void, ctx: any | null = null)=>{
    if (Array.isArray(tg)) {
        return subscribe([tg, Symbol.iterator], cb, ctx);
    }
    return subscribe(tg, cb, ctx);
}

/**
 * Быстро удаляет подписку колбэка с реактивного объекта или свойства.
 *
 * @param {any} tg - Реактивный объект или пара [объект, ключ]
 * @param {(value: any, prop: keyType, old?: any) => void} [cb] - Колбэк для удаления, если не задан — удаляются все
 * @param {any | null} [ctx=null] - Контекст (необязательно)
 */
export const unsubscribe = (tg: any, cb?: (value: any, prop: keyType, old?: any) => void, ctx: any | null = null) => {
    return withPromise(tg, (target: any) => {
        // Определение, является ли аргумент парой [объект, ключ]
        const isPair = Array.isArray(target) && target?.length == 2 && ["object", "function"].indexOf(typeof target?.[0]) >= 0 && isKeyType(target?.[1]);
        const prop = isPair ? target?.[1] : null;

        // Для пары — извлекается цель
        target = (isPair && prop != null) ? (target?.[0] ?? target) : target;

        // Извлекается сырой объект
        const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
        let self = target?.[$registryKey$] ?? (subscriptRegistry).get(unwrap);
        self?.unsubscribe?.(cb, prop);
    });
}

/**
 * Следит за изменением определённого ключа в реактивном объекте и обновляет целевой объект.
 *
 * @param {object} target - Целевой объект, который будет обновлён
 * @param {any} reactive - Реактивный объект или коллекция
 * @param {() => string} [key=()=>""] - Функция-ключ, какое свойство отслеживать
 * @returns {Function} - Функция отписки
 */
export const bindByKey = (target, reactive, key = () => "") =>
    subscribe(reactive, (value, id) => { if (id == key()) { objectAssign(target, value, null, true); } });

/**
 * Создаёт новое реактивное значение на основе другого, поддерживает вычисления/трансформации.
 *
 * @param {any} from - Исходное реактивное значение
 * @param {(src) => any} reactFn - Функция-трансформер
 * @param {Function} [watch] - Необязательный watch-функция для наблюдения
 * @returns {any} - Новое реактивное значение
 */
export const derivate = (from, reactFn, watch?) => bindBy(reactFn(safe(from)), from, watch);

/**
 * Связывает состояния между целевым объектом и реактивным объектом (двусторонняя синхронизация).
 * Renamed due of LUR.E framework similar name method.
 *
 * @param {object} target - Целевой объект для синхронизации
 * @param {any} reactive - Реактивный объект
 * @param {Function} [watch] - Необязательная функция наблюдения за изменениями target
 * @returns {object} - Ссылка на target (для цепочек вызовов)
 */
export const bindBy = (target, reactive, watch?) => {
    // Синхронизация from reactive → target
    subscribe(reactive, (v, p) => { objectAssign(target, v, p, true); });
    // Если есть watch — синхронизация target → reactive
    watch?.(() => target, (N) => { for (const k in N) { objectAssign(reactive, N[k], k, true); } }, { deep: true });
    return target;
};

/**
 * Создает observable-массив, синхронизированный с Set.
 *
 * @param {Set<any>} set - Наблюдаемый Set.
 * @returns {any[]} Observable-массив, отражающий состояние Set.
 */
export const observableBySet = (set) => {
    const obs = makeReactive([]);
    obs[Symbol.dispose] = subscribe(set, (value, _, old) => {
        if (value !== old) {
            if (old == null && value != null) {
                obs.push(value);
            } else
                if (old != null && value == null) {
                    const idx = obs.indexOf(old);
                    if (idx >= 0) obs.splice(idx, 1);
                } else {
                    const idx = obs.indexOf(old);
                    if (idx >= 0 && obs[idx] !== value) obs[idx] = value;
                }
        }
    });
    return obs;
}

/**
 * Создает observable-массив, синхронизированный с Map.
 *
 * @param {Map<any, any>} map - Наблюдаемый Map.
 * @returns {Array<[any, any]>} Observable-массив пар [ключ, значение].
 */
export const observableByMap = (map) => {
    const obs = makeReactive([]);
    obs[Symbol.dispose] = subscribe(map, (value, prop, old) => {
        if (value !== old) {
            if (old != null && value == null) {
                const idx = obs.findIndex(([name, _]) => (name == prop));
                if (idx >= 0) obs.splice(idx, 1);
            } else {
                const idx = obs.findIndex(([name, _]) => {
                    return (name == prop)
                });
                if (idx >= 0) { if (obs[idx]?.[1] !== value) obs[idx] = [prop, value]; } else { obs.push([prop, value]); };
            }
        }
    });
    return obs;
}
