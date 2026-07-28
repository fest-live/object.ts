/*
 * Filename: Subscribe.shared.ts
 * FullPath: modules/projects/object.ts/test/Subscribe.shared.ts
 * Change date and time: 00.18.29_29.07.2026
 * Reason for changes: Expand cross-runtime coverage for observable collections,
 * refs, combinators, trigger filters, disposal, and boundary adapters.
 */
import { getOrInsert as __installUpsertPolyfills } from "../../core.ts/src/utils/Upsert";
import {
    affected,
    assign,
    computed,
    conditional,
    conditionalIndex,
    conditionalRef,
    effected,
    effect,
    link,
    observe,
    propRef,
    ref,
    remap,
    $trigger,
    $triggerControl,
} from "../src/index";

__installUpsertPolyfills(new Map(), "__upsert_polyfill__", () => null);

type AssertApi = {
    equal(actual: any, expected: any, message?: string): void;
    deepEqual(actual: any, expected: any, message?: string): void;
};

type RecordedEvent = {
    value: any;
    name: any;
    oldValue: any;
    trigger: string | null | undefined;
};

const tick = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

const record = (events: RecordedEvent[]) => (value: any, name: any, oldValue: any, trigger: string | null | undefined) => {
    events.push({ value, name, oldValue, trigger });
};

const disposeValue = (value: any) => {
    const disposeKey = (Symbol as any).dispose;
    if (disposeKey && typeof value?.[disposeKey] == "function") value[disposeKey]();
};

export const subscribeTestCases = [
    {
        name: "observe is idempotent and ref/propRef bridge reads and writes",
        run: async (assert: AssertApi) => {
            const raw = { value: 1 };
            const source = observe(raw);
            const valueRef = ref(source, "value");
            const primitiveRef = ref(3, null);

            assert.equal(observe(raw), source);
            assert.equal(observe(source), source);
            assert.equal(valueRef.value, 1);
            assert.equal(primitiveRef.value, 3);

            valueRef.value = 2;
            primitiveRef.value = 4;
            await tick();

            assert.equal(source.value, 2);
            assert.equal(valueRef.value, 2);
            assert.equal(primitiveRef.value, 4);
        },
    },
    {
        name: "nested observed proxies share raw targets without widening parent subscriptions",
        run: async (assert: AssertApi) => {
            const rawChild = { count: 0 };
            const parent = observe({ child: rawChild });
            const child = observe(parent.child);
            const parentEvents: RecordedEvent[] = [];
            const childEvents: RecordedEvent[] = [];

            const unsubscribeParent = affected(parent, record(parentEvents), { affectTypes: ["setter"], triggerImmediately: false });
            const unsubscribeChild = affected(child, record(childEvents), { affectTypes: ["setter"], triggerImmediately: false });

            child.count = 1;
            await tick();

            assert.equal(parentEvents.length, 0);
            assert.equal(childEvents.length, 1);
            assert.deepEqual(childEvents[0], { value: 1, name: "count", oldValue: 0, trigger: "set" });
            assert.equal(observe(rawChild), child);

            const nextRawChild = { count: 2 };
            parent.child = nextRawChild;
            await tick();

            assert.equal(parentEvents.length, 1);
            assert.equal(parentEvents[0].name, "child");
            assert.equal(parentEvents[0].trigger, "set");

            const nextChild = observe(parent.child);
            nextChild.count = 3;
            await tick();

            assert.equal(childEvents.length, 1);
            assert.equal(nextChild.count, 3);
            unsubscribeParent?.();
            unsubscribeChild?.();
        },
    },
    {
        name: "array mutations emit normalized add, set, and delete events",
        run: async (assert: AssertApi) => {
            const source = observe([1]);
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(source, record(events), {
                affectTypes: ["add", "set", "delete", "addAll", "setAll", "deleteAll"],
                triggerImmediately: false,
            });

            source.push(2);
            await tick();
            source[0] = 3;
            await tick();
            source.unshift(0);
            await tick();
            source.shift();
            await tick();
            source.splice(0, 1, 4);
            await tick();
            source.pop();
            await tick();
            unsubscribe?.();

            assert.deepEqual(events, [
                { value: 2, name: 1, oldValue: null, trigger: "add" },
                { value: 3, name: 0, oldValue: 1, trigger: "set" },
                { value: 0, name: 0, oldValue: null, trigger: "add" },
                { value: null, name: 0, oldValue: 0, trigger: "delete" },
                { value: 4, name: 0, oldValue: 3, trigger: "set" },
                { value: null, name: 1, oldValue: 2, trigger: "delete" },
            ]);
        },
    },
    {
        name: "array removals preserve delete semantics for nullish values",
        run: async (assert: AssertApi) => {
            const source = observe<any[]>([null, undefined]);
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(source, record(events), {
                affectTypes: ["add", "set", "delete"],
                triggerImmediately: false,
            });

            source.pop();
            await tick();
            source.shift();
            await tick();
            source.push(undefined);
            await tick();
            source[0] = "value";
            await tick();
            source.splice(0, 1);
            await tick();
            unsubscribe?.();

            assert.equal(events.length, 5);
            assert.equal(events[0].trigger, "delete");
            assert.equal(events[1].trigger, "delete");
            assert.equal(events[1].oldValue, null);
            assert.equal(events[2].trigger, "add");
            assert.equal(events[3].trigger, "set");
            assert.equal(events[3].value, "value");
            assert.equal(events[4].trigger, "delete");
            assert.equal(events[4].oldValue, "value");
        },
    },
    {
        name: "map mutations distinguish additions, updates, deletion, and clear",
        run: async (assert: AssertApi) => {
            const source = observe(new Map([["a", 1]]));
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(source, record(events), {
                affectTypes: ["add", "set", "delete"],
                triggerImmediately: false,
            });

            source.set("b", 2);
            await tick();
            source.set("a", 3);
            await tick();
            source.delete("b");
            await tick();
            source.clear();
            await tick();
            unsubscribe?.();

            assert.deepEqual(events, [
                { value: 2, name: "b", oldValue: null, trigger: "add" },
                { value: 3, name: "a", oldValue: 1, trigger: "set" },
                { value: null, name: "b", oldValue: 2, trigger: "delete" },
                { value: null, name: "a", oldValue: 3, trigger: "delete" },
            ]);
        },
    },
    {
        name: "map mutations preserve falsy values and suppress same-value writes",
        run: async (assert: AssertApi) => {
            const source = observe(new Map<any, any>([["zero", 0], ["empty", ""]]));
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(source, record(events), {
                affectTypes: ["add", "set", "delete"],
                triggerImmediately: false,
            });

            source.set("zero", 0);
            await tick();
            source.set("new", false);
            await tick();
            source.delete("zero");
            await tick();
            source.clear();
            await tick();
            unsubscribe?.();

            assert.deepEqual(events, [
                { value: false, name: "new", oldValue: null, trigger: "add" },
                { value: null, name: "zero", oldValue: 0, trigger: "delete" },
                { value: null, name: "empty", oldValue: "", trigger: "delete" },
                { value: null, name: "new", oldValue: false, trigger: "delete" },
            ]);
        },
    },
    {
        name: "set mutations report membership additions, deletions, and clear",
        run: async (assert: AssertApi) => {
            const source = observe(new Set(["a"]));
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(source, record(events), {
                affectTypes: ["add", "delete"],
                triggerImmediately: false,
            });

            source.add("b");
            await tick();
            source.delete("b");
            await tick();
            source.clear();
            await tick();
            unsubscribe?.();

            assert.deepEqual(events, [
                { value: "b", name: "b", oldValue: null, trigger: "add" },
                { value: null, name: "b", oldValue: "b", trigger: "delete" },
                { value: null, name: null, oldValue: "a", trigger: "delete" },
            ]);
        },
    },
    {
        name: "set mutations preserve falsy membership and suppress duplicate additions",
        run: async (assert: AssertApi) => {
            const source = observe(new Set<any>(["", 0]));
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(source, record(events), {
                affectTypes: ["add", "delete"],
                triggerImmediately: false,
            });

            source.add("");
            await tick();
            source.add(false);
            await tick();
            source.delete(0);
            await tick();
            source.delete("");
            await tick();
            source.clear();
            await tick();
            unsubscribe?.();

            assert.deepEqual(events, [
                { value: false, name: false, oldValue: null, trigger: "add" },
                { value: null, name: 0, oldValue: 0, trigger: "delete" },
                { value: null, name: "", oldValue: "", trigger: "delete" },
                { value: null, name: null, oldValue: false, trigger: "delete" },
            ]);
        },
    },
    {
        name: "computed refs recalculate and dispose their source bridge",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 2 });
            const derived = computed([source, "value"], (value) => value * 2);
            await tick();
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(derived, record(events), { affectTypes: ["manual"], triggerImmediately: false });

            assert.equal(derived.value, 4);
            source.value = 3;
            await tick();

            assert.equal(derived.value, 6);
            assert.equal(events.length, 1);
            assert.deepEqual(events[0], { value: 6, name: "value", oldValue: 4, trigger: "manual" });

            unsubscribe?.();
            source.value = 4;
            await tick();
            assert.equal(events.length, 1);
            assert.equal(derived.value, 8);

            const postDisposeEvents: RecordedEvent[] = [];
            const unsubscribeAfterDispose = affected(derived, record(postDisposeEvents), {
                affectTypes: ["manual"],
                triggerImmediately: false,
            });
            disposeValue(derived);
            derived[$trigger]({ key: "value", value: 99, oldValue: 8, trigger: "manual" });
            await tick();
            assert.equal(postDisposeEvents.length, 1);
            postDisposeEvents.length = 0;
            source.value = 5;
            await tick();
            assert.equal(postDisposeEvents.length, 0);
            unsubscribeAfterDispose?.();
        },
    },
    {
        name: "assign mirrors a source into a target and stops after disposal",
        run: async (assert: AssertApi) => {
            const target = observe({ value: 0 });
            const source = observe({ value: 2 });
            const dispose = assign(target, source);
            await tick();

            assert.equal(target.value, 2);
            source.value = 4;
            await tick();
            assert.equal(target.value, 4);

            dispose?.();
            source.value = 5;
            await tick();
            assert.equal(target.value, 4);
        },
    },
    {
        name: "link keeps both endpoints synchronized and can be removed",
        run: async (assert: AssertApi) => {
            const left = observe({ value: 1 });
            const right = observe({ value: 2 });
            const unlink = link(left, right);
            await tick();

            assert.equal(left.value, 2);
            right.value = 4;
            await tick();
            assert.equal(left.value, 4);
            left.value = 5;
            await tick();
            assert.equal(right.value, 5);

            unlink?.();
            right.value = 6;
            await tick();
            assert.equal(left.value, 5);
        },
    },
    {
        name: "remap projects source values and disposes through the destination",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const destination = remap(source, (value, prop) => ({ [prop]: value * 10 }));
            await tick();

            assert.equal(destination.value, 10);
            source.value = 2;
            await tick();
            assert.equal(destination.value, 20);

            disposeValue(destination);
            source.value = 3;
            await tick();
            assert.equal(destination.value, 20);
        },
    },
    {
        name: "conditional refs switch values and expose the conditional alias",
        run: async (assert: AssertApi) => {
            const condition = ref(true, null);
            const selected = conditionalRef(condition, "yes", "no");
            await tick();
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(selected, record(events), { affectTypes: ["manual"], triggerImmediately: false });

            assert.equal(conditional, conditionalRef);
            assert.equal(selected.value, "yes");
            condition.value = false;
            await tick();

            assert.equal(selected.value, "no");
            assert.equal(events.length, 1);
            assert.deepEqual(events[0], { value: "no", name: "value", oldValue: "yes", trigger: "manual" });
            unsubscribe?.();
        },
    },
    {
        name: "conditionalIndex returns the first truthy predicate position",
        run: async (assert: AssertApi) => {
            const index = conditionalIndex([() => false, () => true, () => true]);
            assert.equal(index?.value, 1);
        },
    },
    {
        name: "conditionalIndex follows observable condition refs and disposes its bridges",
        run: async (assert: AssertApi) => {
            const first = ref(false, null);
            const second = ref(false, null);
            const index = conditionalIndex([first, second]);
            const events: any[] = [];
            const unsubscribe = affected(index, (value, name, oldValue, trigger) => {
                events.push({ value, name, oldValue, trigger });
            }, { affectTypes: ["manual"], triggerImmediately: false });

            assert.equal(index?.value, -1);
            first.value = true;
            await tick();
            assert.equal(index?.value, 0);
            assert.equal(events.some((event) => event.value === 0), true);
            const firstEventCount = events.length;

            first.value = false;
            second.value = true;
            await tick();
            assert.equal(index?.value, 1);
            assert.equal(events.length > firstEventCount, true);
            assert.equal(events.some((event) => event.value === 1), true);
            const secondEventCount = events.length;

            disposeValue(index);
            index[$trigger]({ key: "value", value: 77, oldValue: 1, trigger: "manual" });
            await tick();
            assert.equal(events.length, secondEventCount + 1);
            events.length = 0;
            second.value = false;
            await tick();
            assert.equal(events.length, 0);
            unsubscribe?.();
        },
    },
    {
        name: "trigger filters exclude unrelated operations and preserve initial-only semantics",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const setterEvents: RecordedEvent[] = [];
            const initialEvents: RecordedEvent[] = [];
            const unsubscribeSetter = affected(source, record(setterEvents), { affectTypes: ["setter"], triggerImmediately: false });
            const unsubscribeInitial = affected(source, record(initialEvents), ["initial"]);

            await tick();
            source[$trigger]({ key: "value", value: 2, oldValue: 1, trigger: "manual" });
            source.value = 3;
            await tick();

            assert.equal(initialEvents.length, 1);
            assert.deepEqual(initialEvents[0], { value: 1, name: "value", oldValue: null, trigger: "initial" });
            assert.equal(setterEvents.length, 1);
            assert.deepEqual(setterEvents[0], { value: 3, name: "value", oldValue: 1, trigger: "set" });
            unsubscribeSetter?.();
            unsubscribeInitial?.();
        },
    },
    {
        name: "disposing an observable removes registered callbacks",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: RecordedEvent[] = [];
            affected(source, record(events), { affectTypes: ["setter"], triggerImmediately: false });

            source.value = 2;
            await tick();
            disposeValue(source);
            source.value = 3;
            await tick();

            assert.equal(events.length, 1);
            assert.deepEqual(events[0], { value: 2, name: "value", oldValue: 1, trigger: "set" });
        },
    },
    {
        name: "propRef writes bridge back to the source property and dispose stops delivery",
        run: async (assert: AssertApi) => {
            const source = observe({ title: "one" });
            const titleRef = propRef(source, "title");
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(titleRef, record(events), { affectTypes: ["setter"], triggerImmediately: false });

            titleRef.value = "two";
            await tick();

            assert.equal(source.title, "two");
            assert.equal(titleRef.value, "two");
            assert.deepEqual(events, [
                { value: "two", name: "title", oldValue: "one", trigger: "set" },
            ]);

            unsubscribe?.();
            titleRef.value = "three";
            await tick();
            assert.equal(source.title, "three");
            assert.equal(events.length, 1);

            const postDisposeEvents: RecordedEvent[] = [];
            const unsubscribeAfterDispose = affected(titleRef, record(postDisposeEvents), {
                affectTypes: ["setter"],
                triggerImmediately: false,
            });
            disposeValue(titleRef);
            titleRef[$trigger]({ key: "title", value: "manual", oldValue: "three", trigger: "set" });
            await tick();
            assert.equal(postDisposeEvents.length, 1);
            postDisposeEvents.length = 0;
            source.title = "four";
            await tick();
            assert.equal(source.title, "four");
            assert.equal(postDisposeEvents.length, 0);
            unsubscribeAfterDispose?.();
        },
    },
    {
        name: "subscribeInput bridges browser change events through the shared callback contract",
        run: async (assert: AssertApi) => {
            if (typeof document == "undefined" || typeof HTMLInputElement == "undefined") return;

            const input = document.createElement("input");
            input.value = "before";
            const events: RecordedEvent[] = [];
            const unsubscribe = affected(input, record(events), { affectTypes: ["setter"], triggerImmediately: true });

            await tick();
            input.value = "after";
            input.dispatchEvent(new Event("change"));
            await tick();

            assert.deepEqual(events, [
                { value: "after", name: "value", oldValue: "before", trigger: "set" },
            ]);
            unsubscribe?.();
            input.value = "ignored";
            input.dispatchEvent(new Event("change"));
            await tick();
            assert.equal(events.length, 1);
        },
    },
    {
        name: "affected emits initial and setter events with the V2 callback shape",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: RecordedEvent[] = [];

            const unsubscribe = affected(source, record(events), { affectTypes: ["setter"], triggerImmediately: true });
            await tick();
            source.value = 2;
            await tick();
            (await unsubscribe)?.();

            assert.equal(events.length, 2);
            assert.deepEqual(events[0], { value: 1, name: "value", oldValue: null, trigger: "initial" });
            assert.deepEqual(events[1], { value: 2, name: "value", oldValue: 1, trigger: "set" });
        },
    },
    {
        name: "direct trigger lists do not imply initial unless they include initial or wildcard",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: RecordedEvent[] = [];

            const unsubscribe = affected(source, record(events), ["setter"]);
            await tick();
            source.value = 2;
            await tick();
            (await unsubscribe)?.();

            assert.equal(events.length, 1);
            assert.deepEqual(events[0], { value: 2, name: "value", oldValue: 1, trigger: "set" });
        },
    },
    {
        name: "custom trigger names are emitted and filtered separately from setter",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: RecordedEvent[] = [];

            const unsubscribe = affected(source, record(events), { affectTypes: ["custom"], triggerImmediately: false });
            source.value = 2;
            source[$trigger]({ key: "value", value: 42, oldValue: 2, trigger: "custom" });
            await tick();
            unsubscribe?.();

            assert.equal(events.length, 1);
            assert.deepEqual(events[0], { value: 42, name: "value", oldValue: 2, trigger: "custom" });
        },
    },
    {
        name: "$triggerControl can temporarily suppress setter events",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: RecordedEvent[] = [];

            const unsubscribe = affected(source, record(events), { affectTypes: ["setter"], triggerImmediately: false });
            source[$triggerControl].without(["setter"], () => {
                source.value = 2;
            });
            await tick();

            source.value = 3;
            await tick();
            (await unsubscribe)?.();

            assert.equal(events.length, 1);
            assert.deepEqual(events[0], { value: 3, name: "value", oldValue: 2, trigger: "set" });
        },
    },
    {
        name: "$triggerControl treats set and setter as aliases",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: RecordedEvent[] = [];

            const unsubscribe = affected(source, record(events), { affectTypes: ["setter"], triggerImmediately: false });
            source[$triggerControl].disable(["set"]);
            source.value = 2;
            await tick();

            source[$triggerControl].enable(["setter"]);
            source.value = 3;
            await tick();
            (await unsubscribe)?.();

            assert.equal(events.length, 1);
            assert.deepEqual(events[0], { value: 3, name: "value", oldValue: 2, trigger: "set" });
        },
    },
    {
        name: "affected uses propRef realProp as the callback property name",
        run: async (assert: AssertApi) => {
            const source = observe({ title: "one", other: "skip" });
            const titleRef = propRef(source, "title");
            const events: RecordedEvent[] = [];
            const pairedValueEvents: RecordedEvent[] = [];

            assert.equal(titleRef.realProp, "title");

            const unsubscribe = affected(titleRef, record(events), { affectTypes: ["setter"], triggerImmediately: true });
            const unsubscribeByValue = affected([titleRef, "value"], record(pairedValueEvents), { affectTypes: ["setter"], triggerImmediately: false });
            await tick();
            source.other = "changed";
            source.title = "two";
            await tick();
            (await unsubscribe)?.();
            (await unsubscribeByValue)?.();

            assert.equal(events.length, 2);
            assert.deepEqual(events[0], { value: "one", name: "title", oldValue: null, trigger: "initial" });
            assert.deepEqual(events[1], { value: "two", name: "title", oldValue: "one", trigger: "set" });
            assert.equal(pairedValueEvents.length, 1);
            assert.deepEqual(pairedValueEvents[0], { value: "two", name: "title", oldValue: "one", trigger: "set" });
        },
    },
    {
        name: "effect emits structured events without an initial trigger by default",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: any[] = [];

            const unsubscribe = effect((event) => events.push(event), source, { affectTypes: ["setter"] });
            await tick();
            source.value = 2;
            await tick();
            unsubscribe?.();

            assert.equal(events.length, 1);
            assert.equal(events[0].source, source);
            assert.equal(events[0].target, source);
            assert.equal(events[0].value, 2);
            assert.equal(events[0].prop, "value");
            assert.equal(events[0].oldValue, 1);
            assert.equal("op" in events[0], false);
            assert.equal(events[0].trigger, "set");
        },
    },
    {
        name: "effect reports propRef realProp in structured events",
        run: async (assert: AssertApi) => {
            const source = observe({ title: "one" });
            const titleRef = propRef(source, "title");
            const events: any[] = [];

            const unsubscribe = effect((event) => events.push(event), titleRef, { affectTypes: ["setter"] });
            source.title = "two";
            await tick();
            unsubscribe?.();

            assert.equal(events.length, 1);
            assert.equal(events[0].source, titleRef);
            assert.equal(events[0].target, titleRef);
            assert.equal(events[0].value, "two");
            assert.equal(events[0].prop, "title");
            assert.equal(events[0].oldValue, "one");
        },
    },
    {
        name: "effected is a target-first alias with trigger filtering",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: any[] = [];

            const unsubscribe = effected(source, (event) => events.push(event), { affectTypes: ["manual"] });
            source.value = 2;
            source[$trigger]({ key: "value", value: 3, oldValue: 2, trigger: "manual" });
            await tick();
            unsubscribe?.();

            assert.equal(events.length, 1);
            assert.equal(events[0].value, 3);
            assert.equal(events[0].prop, "value");
            assert.equal("op" in events[0], false);
            assert.equal(events[0].trigger, "manual");
        },
    },
    {
        name: "effect without targets listens globally to observable triggers",
        run: async (assert: AssertApi) => {
            const events: any[] = [];
            const unsubscribe = effect((event) => events.push(event), { affectTypes: ["setter"] });
            const source = observe({ value: 1 });

            source.value = 2;
            await tick();
            unsubscribe?.();

            assert.equal(events.length, 1);
            assert.equal(events[0].source?.value, 2);
            assert.equal(events[0].target, events[0].source);
            assert.equal(events[0].value, 2);
            assert.equal(events[0].prop, "value");
            assert.equal(events[0].trigger, "set");
        },
    },
];

export const createAssert = (): AssertApi => ({
    equal(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message ?? `Expected ${String(actual)} to equal ${String(expected)}`);
        }
    },
    deepEqual(actual, expected, message) {
        const got = JSON.stringify(actual);
        const want = JSON.stringify(expected);
        if (got !== want) {
            throw new Error(message ?? `Expected ${got} to deep equal ${want}`);
        }
    },
});

export const runSubscribeTests = async (assert: AssertApi = createAssert()) => {
    for (const testCase of subscribeTestCases) {
        await testCase.run(assert);
    }
};
