import { makeReactive, subscribe } from "./Mainline";

// reacts by change storage, loads from storage, and reacts from storage event changes
export const localStorageRef = (key, initial?: any)=>{
    const ref = makeReactive({value: localStorage.getItem(key) ?? initial});
    addEventListener("storage", (ev)=>{
        if (ev.storageArea == localStorage && ev.key == key) {
            if (ref.value !== ev.newValue) { ref.value = ev.newValue; };
        }
    });
    subscribe([ref, "value"], (val)=>{
        localStorage.setItem(key, val);
    });
    return ref;
}

// reacts only from media, you can't change media condition
export const matchMediaRef = (condition: string)=>{
    const med = matchMedia(condition);
    const ref = makeReactive({value: med.matches});
    med.addEventListener("change", (ev)=>{
        ref.value = ev.matches;
    });
    return ref;
}
