const existsMap = new WeakMap<any, WR<any>>();
class WeakRefProxyHandler<T extends object> implements ProxyHandler<object> {
    // here can be only options or left params
    constructor(args?: any) {}

    //
    private _deref(target): T | undefined { return (target instanceof WeakRef || typeof target?.deref == "function") ? (target?.deref?.()) : target; }

    //
    get(tg: object, prop: PropertyKey, _receiver: any): any {
        const obj = this._deref(tg), value = (obj as any)?.[prop];

        // libraries specific (LUR.E/object.ts)
        if ((prop === "element" || prop === "value") && obj && (value == null || !(prop in obj))) { return obj; }
        // wrap-away deref from side-effects
        if (prop === "deref") { return ()=>this._deref(tg); };
        // if function, workaround callable
        if (typeof value === 'function') {
            return (...args: any[]) => {
                const realObj = this._deref(tg);
                return (realObj as any)?.[prop]?.(...args);
            };
        };
        return value;
    }

    set(tg: object, prop: PropertyKey, value: any, _receiver: any): boolean {
        const obj = this._deref(tg); if (obj) return Reflect.set(obj, prop, value);
        return true;
    }

    has(tg: object, prop: PropertyKey): boolean {
        const obj = this._deref(tg); if (!obj) return false;
        return prop in obj;
    }

    ownKeys(tg: object): ArrayLike<string | symbol> {
        const obj = this._deref(tg); if (!obj) return [];
        return Reflect.ownKeys(obj);
    }

    getOwnPropertyDescriptor(tg: object, prop: PropertyKey): PropertyDescriptor | undefined {
        const obj = this._deref(tg); if (!obj) return undefined;
        return Object.getOwnPropertyDescriptor(obj, prop);
    }

    deleteProperty(tg: object, prop: PropertyKey): boolean {
        const obj = this._deref(tg); if (!obj) return true;
        return Reflect.deleteProperty(obj, prop);
    }

    defineProperty(tg: object, prop: PropertyKey, descriptor: PropertyDescriptor): boolean {
        const obj = this._deref(tg); if (!obj) return true;
        return Reflect.defineProperty(obj, prop, descriptor);
    }

    getPrototypeOf(tg: object): object | null {
        const obj = this._deref(tg); if (!obj) return null;
        return Object.getPrototypeOf(obj);
    }

    setPrototypeOf(tg: object, proto: any): boolean {
        const obj = this._deref(tg); if (!obj) return true;
        return Reflect.setPrototypeOf(obj, proto);
    }

    isExtensible(tg: object): boolean {
        const obj = this._deref(tg); if (!obj) return false;
        return Reflect.isExtensible(obj);
    }

    preventExtensions(tg: object): boolean {
        const obj = this._deref(tg); if (!obj) return true;
        return Reflect.preventExtensions(obj);
    }
}

//
export type WR<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R
        ? (...args: A) => WR<R> | null
        : T[K] | null
};

//
export function WRef<T extends object>(target: T|WeakRef<T>): WR<T> {
    if (!(typeof target == "object" || typeof target == "function")) return target;
    const isWeakRef = (target instanceof WeakRef || typeof (target as any)?.deref == "function");
    target = (isWeakRef ? (target as any)?.deref?.() : target) as unknown as T;
    if (target != null && existsMap.has(target)) { return existsMap.get(target) as WR<T>; }

    //
    const handler = new WeakRefProxyHandler<T>(); // !here may be dead WeakRef
    const pm: WR<T> = new Proxy(isWeakRef ? target : new WeakRef(target), handler as ProxyHandler<WeakRef<T>>) as WR<T>;
    existsMap.set(target, pm); return pm;
}
