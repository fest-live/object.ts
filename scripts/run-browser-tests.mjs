import { spawn } from "node:child_process";
import { access, mkdir, readdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, resolve } from "node:path";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import viteConfig from "../vite.config.js";

const root = resolve(import.meta.dirname, "..");
const localBrowserCache = resolve(root, "chrome-headless-shell");
const sharedBrowserCache = resolve(root, "..", "chrome-headless-shell");
const puppeteerShellCache = resolve(homedir(), ".cache/puppeteer/chrome-headless-shell");

const exists = async (path) => {
    try { await access(path); return true; } catch { return false; }
};

const findHeadlessShell = async (dir) => {
    if (!dir) return null;
    let info;
    try { info = await stat(dir); } catch { return null; }
    if (info.isFile() && basename(dir) == "chrome-headless-shell") return dir;
    if (!info.isDirectory()) return null;

    let entries = [];
    try { entries = await readdir(dir, { withFileTypes: true }); } catch { return null; }

    for (const entry of entries) {
        const path = resolve(dir, entry.name);
        if (entry.isFile() && entry.name == "chrome-headless-shell") {
            if (await exists(path)) return path;
        }
        if (entry.isDirectory()) {
            const nested = await findHeadlessShell(path);
            if (nested) return nested;
        }
    }
    return null;
};

const resolveFromHint = async (hint) => {
    if (!hint) return null;
    let info;
    try { info = await stat(hint); } catch { return null; }
    if (info.isFile()) return hint;
    return findHeadlessShell(hint);
};

const lookupHeadlessShell = async () => {
    const explicit = await resolveFromHint(process.env.CHROME_BIN ?? process.env.CHROMIUM_BIN);
    if (explicit) return explicit;

    for (const dir of [localBrowserCache, sharedBrowserCache, puppeteerShellCache]) {
        const found = await findHeadlessShell(dir);
        if (found) return found;
    }

    const bundled = puppeteer.executablePath();
    if (bundled && await exists(bundled)) return bundled;
    return null;
};

const installHeadlessShell = async () => {
    await mkdir(sharedBrowserCache, { recursive: true });
    await new Promise((resolvePromise, reject) => {
        const child = spawn("npx", [
            "--yes",
            "@puppeteer/browsers",
            "install",
            "chrome-headless-shell@stable",
            "--path",
            sharedBrowserCache,
        ], {
            cwd: root,
            stdio: "inherit",
        });
        child.on("error", reject);
        child.on("exit", (code) => {
            if (code == 0) resolvePromise();
            else reject(new Error(`chrome-headless-shell install exited ${code}`));
        });
    });
};

const resolveHeadlessShell = async () => {
    const existing = await lookupHeadlessShell();
    if (existing) return existing;

    await installHeadlessShell();
    const installed = await lookupHeadlessShell();
    if (installed) return installed;

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

    const executablePath = await resolveHeadlessShell();
    const url = `http://127.0.0.1:${port}/`;
    const browser = await puppeteer.launch({
        executablePath,
        headless: basename(executablePath) == "chrome-headless-shell" ? "shell" : true,
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
