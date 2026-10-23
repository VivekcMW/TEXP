// Runs Playwright in two passes: regular tests in parallel, then @webgl tests one at a time.
// Software-rendered WebGL scenes compete for CPU and time out when run alongside other tests.
// Extra arguments (spec files, --project, -g ...) are forwarded to both passes.
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const passes = [
  ["--grep-invert", "@webgl"],
  ["--grep", "@webgl", "--workers=1"],
];

let failed = false;
for (const pass of passes) {
  const result = spawnSync("pnpm", ["exec", "playwright", "test", ...pass, ...args, "--pass-with-no-tests"], { stdio: "inherit" });
  if (result.status !== 0) failed = true;
}
process.exit(failed ? 1 : 0);
