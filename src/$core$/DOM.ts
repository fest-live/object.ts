import { makeReactive, subscribe } from "./Mainline";

// reacts by change storage, loads from storage, and reacts from storage event changes
export const localStorageRef = (key, initial?: any)=>{
    const ref = makeReactive({value: localStorage.getItem(key) ?? (initial?.value ?? initial)});
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
export const attrRef = (element, attribute: string, initial?: any)=>{
    // bi-directional attribute
    const val = makeReactive({ value: element?.getAttribute?.(attribute) ?? ((initial?.value ?? initial) === true && typeof initial == "boolean" ? "" : (initial?.value ?? initial)) });
    if (initial != null && element?.getAttribute?.(attribute) == null && (typeof val.value != "object" && typeof val.value != "function") && val.value != null) { element?.setAttribute?.(attribute, val.value); };
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
            if (v == null || typeof v == "object" || typeof v == "function") {
                element.removeAttribute(attribute);
            } else {
                element.setAttribute(attribute, v);
            }
        }
    });

    //
    return val;
}

// ! you can't change size, due it's may break styles
export const sizeRef = (element, axis: "inline"|"block", box: ResizeObserverBoxOptions = "border-box")=>{
    const val = makeReactive({ value: 0 });
    const obs = new ResizeObserver((entries)=>{
        if (box == "border-box") { val.value = axis == "inline" ? entries[0].borderBoxSize[0].inlineSize : entries[0].borderBoxSize[0].blockSize };
        if (box == "content-box") { val.value = axis == "inline" ? entries[0].contentBoxSize[0].inlineSize : entries[0].contentBoxSize[0].blockSize };
        if (box == "device-pixel-content-box") { val.value = axis == "inline" ? entries[0].devicePixelContentBoxSize[0].inlineSize : entries[0].devicePixelContentBoxSize[0].blockSize };
    });
    obs.observe(element, {box});
    return val;
}

//
export const scrollRef = (element, axis: "inline"|"block", initial?: any)=>{
    if (initial != null && typeof (initial?.value ?? initial) == "number") { element?.scrollTo?.({ [axis=="inline"?"left":"top"]: (initial?.value ?? initial) }); };
    const val = makeReactive({ value: (axis == "inline" ? element?.scrollLeft : element?.scrollTop) || 0 });
    subscribe([val, "value"], ()=>element?.scrollTo?.({ [axis=="inline"?"left":"top"]: (val?.value ?? val) }));
    element?.addEventListener?.("scroll", (ev)=>{ val.value = (axis == "inline" ? ev?.target?.scrollLeft : ev?.target?.scrollTop) || 0; }, { passive: true });
    return val;
}

// for checkbox
export const checkedRef = (element)=>{
    const val = makeReactive({ value: !!element?.checked || false });
    element.addEventListener("change", (ev)=>{ if (val.value !== element?.checked) { val.value = !!element?.checked || false; } });
    element.addEventListener("input", (ev)=>{ if (val.value !== element?.checked) { val.value = !!element?.checked || false; } });
    element.addEventListener("click", (ev)=>{ if (val.value !== element?.checked) { val.value = !!element?.checked || false; } });
    subscribe(val, (v)=>{
        if (element.checked !== v) {
            element.checked = !!v;
            element.dispatchEvent(new Event("change", { bubbles: true }));
        }
    })
    return val;
}

// for string inputs
export const valueRef = (element)=>{
    const val = makeReactive({ value: element?.value || "" });
    element.addEventListener("change", (ev)=>{
        if (val.value != element?.value) { val.value = element?.value; }
    });
    subscribe(val, (v)=>{
        if (element.value != v) {
            element.value = v;
            element.dispatchEvent(new Event("change", {
                bubbles: true
            }));
        }
    })
    return val;
}

// for numeric inputs
export const valueAsNumberRef = (element)=>{
    const val = makeReactive({ value: element?.valueAsNumber || 0 });
    element.addEventListener("change", (ev)=>{
        if (val.value != element?.value) { val.value = element?.valueAsNumber; }
    });
    subscribe(val, (v)=>{
        if (element.valueAsNumber != v) {
            element.valueAsNumber = v;
            element.dispatchEvent(new Event("change", {
                bubbles: true
            }));
        }
    })
    return val;
}
