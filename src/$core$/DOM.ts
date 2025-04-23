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

// one-shot update
export const attrRef = (element, attribute: string)=>{
    // bi-directional attribute
    const val = makeReactive({ value: element?.getAttribute?.(attribute) });
    const config = { 
        attributeFilter: [attribute],
        attributeOldValue: true,
        attributes: true, 
        childList: false, 
        subtree: false, 
    };

    //
    const callback = (mutationList, _) => {
        for (const mutation of mutationList) {
            if (mutation.type == "attributes") {
                const value = mutation.target.getAttribute(mutation.attributeName);
                if (mutation.oldValue != value && (val != null && (val?.value != null || (typeof val == "object" || typeof val == "function")))) {
                    if (val?.value !== value) { val.value = value; }
                }
            }
        }
    };

    //
    const observer = new MutationObserver(callback);
    observer.observe(element, config);

    //
    subscribe(val, (v)=>{
        if (v !== element.getAttribute(attribute)) {
            if (v == null) {
                element.removeAttribute(attribute);
            } else {
                element.setAttribute(attribute, v);
            }
        }
    });

    //
    return val;
}
