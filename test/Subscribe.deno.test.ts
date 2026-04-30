/// <reference lib="deno.ns" />

import { createAssert, subscribeTestCases } from "./Subscribe.shared";

const assert = createAssert();

for (const testCase of subscribeTestCases) {
    Deno.test(testCase.name, async () => {
        await testCase.run(assert);
    });
}
