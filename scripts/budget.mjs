import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const gz = (rel) => zlib.gzipSync(fs.readFileSync(path.join(".next", rel))).length;
const KB = 1024;
let failed = false;

// Non-3D pages: first-load JS must stay within 110 KB gzipped (framework floor 104 KB + 6 KB headroom).
const appManifest = JSON.parse(fs.readFileSync(".next/app-build-manifest.json", "utf8"));
const pageBudget = 110 * KB; // Next 15 + React 19 app-router floor measures 104 KB gzipped
for (const [route, files] of Object.entries(appManifest.pages)) {
  if (!route.endsWith("/page")) continue;
  const total = files.filter((f) => f.endsWith(".js")).reduce((n, f) => n + gz(f), 0);
  const label = route.replace(/\/page$/, "") || "/";
  if (total > pageBudget) { console.error(`✗ ${label} first-load ${Math.round(total / KB)} KB > 110 KB`); failed = true; }
  else console.log(`✓ ${label} ${Math.round(total / KB)} KB`);
}

// 3D islands: every lazily loaded chunk that contains WebGL code must be under 150 KB gzipped on its own,
// and the combined runtime is reported for the record.
let runtime = 0;
for (const f of fs.readdirSync(".next/static/chunks")) {
  if (!f.endsWith(".js")) continue;
  const src = fs.readFileSync(path.join(".next/static/chunks", f), "utf8");
  if (!/WebGLRenderer|@react-three\/fiber/.test(src)) continue;
  const size = gz(`static/chunks/${f}`);
  runtime += size;
  if (size > 150 * KB) { console.error(`✗ 3D chunk ${f} ${Math.round(size / KB)} KB > 150 KB`); failed = true; }
  else console.log(`✓ 3D chunk ${f} ${Math.round(size / KB)} KB`);
}
console.log(`ℹ 3D runtime total (lazy, after load+idle): ${Math.round(runtime / KB)} KB gzipped`);
process.exit(failed ? 1 : 0);
