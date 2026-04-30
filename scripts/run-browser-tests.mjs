import { access, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import viteConfig from "../vite.config.js";

const root = resolve(import.meta.dirname, "..");
const localBrowserCache = resolve(root, "chrome-headless-shell");

const findHeadlessShell = async (dir = localBrowserCache) => {
    let entries = [];
    try {
        entries = await readdir(dir, { withFileTypes: true });
    } catch {
        return null;
    }

    for (const entry of entries) {
        const path = resolve(dir, entry.name);
        if (entry.isFile() && entry.name == "chrome-headless-shell") {
            await access(path);
            return path;
        }
        if (entry.isDirectory()) {
            const nested = await findHeadlessShell(path);
            if (nested) return nested;
        }
    }
    return null;
};

const resolveHeadlessShell = async () => {
    const explicit = process.env.CHROME_BIN ?? process.env.CHROMIUM_BIN;
    if (explicit) {
        await access(explicit);
        return explicit;
    }

    const local = await findHeadlessShell();
    if (local) return local;

    const bundled = puppeteer.executablePath();
    if (bundled) return bundled;

    throw new Error("No Chrome headless shell found. Run `npm run test:browser:install` or set CHROME_BIN.");
};

const server = await createServer({
    ...viteConfig,
    root,
    configFile: false,
    server: {
        ...(viteConfig.server ?? {}),
        https: false,
        host: "127.0.0.1",
        port: 0,
        open: false,
    },
});

try {
    await server.listen();
    const address = server.httpServer?.address();
    const port = typeof address == "object" && address ? address.port : null;
    if (!port) throw new Error("Unable to determine Vite test server port.");

    const url = `http://127.0.0.1:${port}/`;
    const browser = await puppeteer.launch({
        executablePath: await resolveHeadlessShell(),
        headless: "shell",
        args: [
            "--disable-gpu",
            "--no-sandbox",
            "--disable-dev-shm-usage",
        ],
    });

    try {
        const page = await browser.newPage();
        page.on("pageerror", (error) => console.error(error));
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        await page.waitForFunction(() => document.querySelector("#subscribe-test-report")?.getAttribute("data-test-status"), { timeout: 30000 });
        const report = await page.$eval("#subscribe-test-report", (el) => ({
            status: el.getAttribute("data-test-status"),
            text: el.textContent,
        }));
        if (report.status != "pass") {
            throw new Error(`Headless browser subscribe tests failed:\n${report.text}`);
        }
    } finally {
        await browser.close();
    }

    console.log("Headless browser subscribe tests passed.");
} finally {
    await server.close();
}
