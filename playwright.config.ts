import { defineConfig } from "@playwright/test";
const url = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
export default defineConfig({ testDir: "./e2e", use: { baseURL: url, screenshot: "only-on-failure" }, webServer: { command: `"${process.execPath}" node_modules/next/dist/bin/next start -H 127.0.0.1 -p ${new URL(url).port || '3000'}`, url, reuseExistingServer: !process.env.CI } });
