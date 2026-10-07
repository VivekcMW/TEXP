import { validateContent } from "../src/content/validate";
const r = validateContent();
if (!r.ok) {
  console.error("Content validation failed:\n" + r.errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log("Content OK");
