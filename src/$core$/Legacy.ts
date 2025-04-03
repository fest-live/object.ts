import { $extractKey$ } from "./Keys";
import { wrapWith } from "./Subscript";
import { makeReactiveObject, ReactiveMap, ReactiveSet } from "./Specific";

//
export const createReactiveMap: <K, V>(map?: [K, V][]) => Map<K, V> = <K, V>(map: [K, V][] = []) => wrapWith(new Map(map), new ReactiveMap());
export const createReactiveSet: <V>(set?: V[]) => Set<V> = <V>(set: V[] = []) => wrapWith(new Set(set), new ReactiveSet());
export const createReactive: any = (target: any, stateName = ""): any => {
    if (target?.[$extractKey$]) { return target; }

    //
    const unwrap: any = (typeof target == "object" || typeof target == "function") ? (target?.[$extractKey$] ?? target) : target;
    let reactive = target;

    // BROKEN!
    if (Array.isArray(target)) {
        //reactive = createReactiveMap(target);
        //reactive = createReactiveSet(target);
    } else

    //
    if (typeof unwrap == "function" || typeof unwrap == "object") {
        reactive = makeReactiveObject(target);
    }

    //
    //if (stateName) stateMap.set(stateName, reactive);

    //
    return reactive;
}
