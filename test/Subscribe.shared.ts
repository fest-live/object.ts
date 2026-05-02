import { getOrInsert as __installUpsertPolyfills } from "../../core.ts/src/utils/Upsert";
import { affected, effected, effect, observe, propRef, $trigger, $triggerControl } from "../src/index";

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

export const subscribeTestCases = [
    {
        name: "affected emits initial and setter events with the V2 callback shape",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: RecordedEvent[] = [];

            const unsubscribe = affected(source, record(events), { affectTypes: ["setter"], triggerImmediately: true });
            await tick();
            source.value = 2;
            await tick();
            unsubscribe?.();

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
            unsubscribe?.();

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
            unsubscribe?.();

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
            unsubscribe?.();

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
            unsubscribe?.();
            unsubscribeByValue?.();

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
