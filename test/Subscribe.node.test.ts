import test from "node:test";
import assert from "node:assert/strict";
import { subscribeTestCases } from "./Subscribe.shared";

for (const testCase of subscribeTestCases) {
    test(testCase.name, async () => {
        await testCase.run(assert);
    });
}
