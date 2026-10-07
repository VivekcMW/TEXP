import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  webServer: { command: "pnpm start -p 3100", port: 3100, reuseExistingServer: !process.env.CI, timeout: 180_000 },
  use: { baseURL: "http://localhost:3100" },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
});
