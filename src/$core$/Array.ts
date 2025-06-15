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
        // TODO! propertly interpret removed and added
        let removed = null, added = null, idx = -1, last = this.#self?.length - 1;
        if (this.#name == "splice") { idx = args?.[0]; removed = this.#self[idx]; };
        if (this.#name == "pop")    { idx = last; removed = this.#self[idx]; };
        if (this.#name == "shift")  { idx = 0; removed = this.#self[idx]; };
        if (this.#name == "push")   { idx = 0; added = args?.[0]; };
        removed ??= this.#handle.wrap(Reflect.apply(target, ctx || this.#self, args));

        // TODO! needs fully reinterpet actions
        // !support multiple push, splice or pop/shift as "push into [last/index]" and "remove of [last/index]"
        if (["shift", "pop", "splice", "push"].includes(this.#name)) { this.#handle.trigger(this.#self || ctx, this.#name, ...[added, idx, removed]); } else
            { this.#handle.trigger(this.#self || ctx, this.#name, ...args); }
        return removed;
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
                events?.get?.(target)?.values().forEach(ev => ev?.(...args, name));
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
        this.#handle.trigger(target, "@set", value, name, old);
        return got;
    }
    deleteProperty(target, name) {
        const old = target?.[name];
        const got = Reflect.deleteProperty(target, name);
        this.#handle.trigger(target, "@delete", null, name, old);
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
