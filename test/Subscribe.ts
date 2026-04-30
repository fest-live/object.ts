import { createAssert, subscribeTestCases } from "./Subscribe.shared";

const root = document.createElement("main");
root.id = "subscribe-test-report";
root.textContent = "Running object.ts subscribe tests...";
document.body.append(root);

const assert = createAssert();
const results: { name: string; ok: boolean; error?: string }[] = [];

for (const testCase of subscribeTestCases) {
    try {
        await testCase.run(assert);
        results.push({ name: testCase.name, ok: true });
    } catch (error: any) {
        results.push({ name: testCase.name, ok: false, error: error?.stack ?? error?.message ?? String(error) });
    }
}

const failed = results.filter((result) => !result.ok);
root.dataset.testStatus = failed.length ? "fail" : "pass";
root.innerHTML = `
    <h1>object.ts subscribe tests: ${failed.length ? "failed" : "passed"}</h1>
    <pre>${JSON.stringify(results, null, 2)}</pre>
`;

if (failed.length) {
    throw new Error(`${failed.length} subscribe test(s) failed`);
}
