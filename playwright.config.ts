import { defineConfig } from "@playwright/test";
const url = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
export default defineConfig({ testDir: "./e2e", use: { baseURL: url, screenshot: "only-on-failure" }, webServer: { command: "node_modules/.bin/next dev", url, reuseExistingServer: true } });
