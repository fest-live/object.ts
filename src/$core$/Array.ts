export const observeMaps = new WeakMap<any[], ObserveArray>();

//
class ObserveMethod {
    #handle: any; #name: string; #self: any;
    constructor(name, handle, self) {
        this.#name = name;
        this.#handle = handle;
        this.#self = self;
    }

    //
    get(target, name, rec) { return Reflect.get(target, name, rec); }
    apply(target, ctx, args) {
        let added: any[] = [], removed: any[] = [];
        let setPairs: [any, number, any][] = [];
        let oldState: any[] = [...this.#self];
        let idx: number = -1;

        //
        switch (this.#name) {
            case "push"   : idx = this.#self?.length; added = args; break;
            case "unshift": idx = 0; added = args; break;
            case "pop":
                idx = this.#self?.length - 1;
                if (this.#self.length > 0) { removed = [this.#self[idx - 1]]; }
                break;
            case "shift":
                idx = 0;
                if (this.#self.length > 0) removed = [this.#self[idx]];
                break;
            case "splice":
                const [start, deleteCount, ...items] = args; idx = start;
                removed = this.#self.slice(start, start + deleteCount);
                added   = items.slice(deleteCount); // если добавлено больше, чем удалено
                // Если есть замена элементов (deleteCount > 0 && items.length > 0)
                if (deleteCount > 0 && items.length > 0) {
                    for (let i = 0; i < Math.min(deleteCount, items.length); i++) {
                        setPairs.push([items[i], start + i, oldState[start + i]]);
                    }
                }
                break;
            case "sort":
            case "fill":
            case "reverse":
            case "copyWithin":
                // Сравниваем старое и новое состояние, находим изменённые элементы
                idx = 0; for (let i = 0; i < this.#self.length; i++) {
                    if (oldState[i] !== this.#self[i])
                        {setPairs.push([this.#self[i], idx+i, oldState?.[idx+i]]); }
                }
                break;
             // Индексное присваивание, args: [value, index]
            case "set": idx = args[1]; setPairs.push([args[0], idx, oldState?.[idx]]); break;
        }

        // Выполнить операцию
        const result = Reflect.apply(target, ctx || this.#self, args);

        // Триггеры на добавление
        if (added?.length === 1) {
            this.#handle.trigger(this.#self || ctx, "@add", added[0]);
        } else if (added?.length > 1) {
            this.#handle.trigger(this.#self || ctx, "@addAll", added);
            removed.forEach((item, I)=>this.#handle.trigger(this.#self || ctx, "@add", item, idx+I));
        }

        // Триггеры на удаление
        if (removed?.length === 1) {
            this.#handle.trigger(this.#self || ctx, "@remove", null, idx, removed[0]);
        } else if (removed?.length > 1) {
            this.#handle.trigger(this.#self || ctx, "@removeAll",  idx, removed);
            removed.forEach((item, I)=>this.#handle.trigger(this.#self || ctx, "@remove", null, idx+I, item));
        }

        // Триггеры на изменение
        if (setPairs?.length === 1) {
            this.#handle.trigger(this.#self || ctx, "@set", ...setPairs[0]);
        } else if (setPairs?.length > 1) {
            this.#handle.trigger(this.#self || ctx, "@setAll", setPairs, idx);
            removed.forEach((pair, I)=>this.#handle.trigger(this.#self || ctx, "@set", ...pair));
        }

        //
        return result;
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
        if (typeof name != "symbol") {
            if (!Number.isInteger(parseInt(name))) { return Reflect.set(target, name, value); };
            name = parseInt(name);
        }
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
