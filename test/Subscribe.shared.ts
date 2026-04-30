import { getOrInsert as __installUpsertPolyfills } from "../../core.ts/src/utils/Upsert";
import { affected, observe, $trigger, $triggerControl } from "../src/index";

__installUpsertPolyfills(new Map(), "__upsert_polyfill__", () => null);

type AssertApi = {
    equal(actual: any, expected: any, message?: string): void;
    deepEqual(actual: any, expected: any, message?: string): void;
};

type RecordedEvent = {
    value: any;
    name: any;
    oldValue: any;
    op: string | null | undefined;
    trigger: string | null | undefined;
};

const tick = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

const record = (events: RecordedEvent[]) => (value: any, name: any, oldValue: any, op: string | null | undefined, trigger: string | null | undefined) => {
    events.push({ value, name, oldValue, op, trigger });
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
            assert.deepEqual(events[0], { value: 1, name: "value", oldValue: null, op: "@set", trigger: "initial" });
            assert.deepEqual(events[1], { value: 2, name: "value", oldValue: 1, op: null, trigger: "setter" });
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
            assert.deepEqual(events[0], { value: 2, name: "value", oldValue: 1, op: null, trigger: "setter" });
        },
    },
    {
        name: "custom trigger names are emitted and filtered separately from setter",
        run: async (assert: AssertApi) => {
            const source = observe({ value: 1 });
            const events: RecordedEvent[] = [];

            const unsubscribe = affected(source, record(events), { affectTypes: ["custom"], triggerImmediately: false });
            source.value = 2;
            source[$trigger]({ key: "value", value: 42, oldValue: 2, op: "@custom", trigger: "custom" });
            await tick();
            unsubscribe?.();

            assert.equal(events.length, 1);
            assert.deepEqual(events[0], { value: 42, name: "value", oldValue: 2, op: "@custom", trigger: "custom" });
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
            assert.deepEqual(events[0], { value: 3, name: "value", oldValue: 2, op: null, trigger: "setter" });
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
            assert.deepEqual(events[0], { value: 3, name: "value", oldValue: 2, op: null, trigger: "setter" });
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
