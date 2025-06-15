export const observeMaps = new WeakMap<any[], ObserveArray>();

//
class ObserveMethod {
    #handle: any; #name: string; #self: any;
    constructor(name, handle, self) {
        this.#name = name;
        this.#handle = handle;
        this.#self = self;
    }
    get(target, name, rec) { return Reflect.get(target, name, rec); }
    apply(target, ctx, args) {
        let removed = null;
        if (this.#name == "splice") { removed = this.#self[args[0]]; };
        const wp = this.#handle.wrap(Reflect.apply(target, ctx || this.#self, args));
        this.#handle.trigger(this.#self || ctx, this.#name, args, wp, removed);
        return wp;
    }
}

//
class ObserveArray {
    #handle: any; #events: WeakMap<any[], Set<Function>>;
    get events() { return this.#events; }
    constructor(arr: any[]) {
        this.#events = new WeakMap(); //
        this.#events.set(arr, new Set<Function>([]));
        const events = this.#events;
        this.#handle = {
            trigger(target: any[], name: number | string, ...args) {
                events?.get?.(target)?.values().forEach(ev => ev?.(name, ...args));
            },
            wrap(nw: any[] | unknown) {
                if (Array.isArray(nw)) {
                    const obs = new ObserveArray(nw);
                    observeMaps.set(nw, obs);
                    return new Proxy(nw, obs);
                }
                return nw;
            }
        }
    }
    has(target, name) { return Reflect.has(target, name); }
    get(target, name, rec) {
        if (name == "@target") return target;
        if (name == "silentForwardByIndex") {
            return (index: number) => {
                if (index < target.length) {
                    const E = target[index];
                    target.splice(index, 1);
                    target.push(E);
                }
            }
        }
        const got = Reflect.get(target, name, rec);
        if (typeof got == "function") { return new Proxy(got, new ObserveMethod(name, this.#handle, target)); };
        return got;
    }
    set(target, name, value) {
        if (!Number.isInteger(parseInt(name))) { return Reflect.set(target, name, value); };
        name = parseInt(name);
        const old = target?.[name];
        const got = Reflect.set(target, name, value);
        this.#handle.trigger(target, "@set", name, value, old);
        return got;
    }
    deleteProperty(target, name) {
        const old = target?.[name];
        const got = Reflect.deleteProperty(target, name);
        this.#handle.trigger(target, "@delete", name, old);
        return got;
    }
}

/**
 * Создает observable-обертку для массива.
 *
 * @param {any[]} arr - Исходный массив.
 * @returns {any[]} Observable-массив или исходный массив.
 */
export const observableArray = (arr: any[]) => {
    if (Array.isArray(arr)) {
        const obs = new ObserveArray(arr);
        observeMaps.set(arr, obs);
        return new Proxy(arr, obs);
    }
    return arr;
};

/**
 * Экспорт по умолчанию: observableArray.
 *
 * @type {typeof observableArray}
 */
export default observableArray;
