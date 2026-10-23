import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  // WebGL-heavy tests are tagged @webgl and run in a separate serial pass (see test:e2e).
  retries: process.env.CI ? 1 : 0,
  webServer: {
    command: "pnpm start -p 3100",
    port: 3100,
    reuseExistingServer: false,
    timeout: 180_000,
    env: { NEXT_DIST_DIR: ".next-playwright" },
    gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
  },
  use: { baseURL: "http://localhost:3100" },
  // Chromium (Chrome/Edge), WebKit (Safari) and Gecko (Firefox).
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 14"] } },
    { name: "desktop-webkit", use: { ...devices["Desktop Safari"] } },
    { name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } },
  ],
});
