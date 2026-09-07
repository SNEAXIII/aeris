// Fails when a bundled extension disappeared or went stale.
// We own none of the extensions we distribute, so this is the only thing standing
// between a rename upstream and a half-broken install downstream.
import { readPacks, isOwnPack, gallery } from "./lib/packs.mjs";

// Two thresholds, because they answer two different questions:
// AGEING is "someone should look at this", STALE is "do not ship this".
const WARN_MONTHS = 6;
const FAIL_MONTHS = 12;
const failOnWarn = process.argv.includes("--fail-on=warn");

// Extensions kept despite their age: no maintained equivalent exists.
// Keep the reason: it is what makes the exception reviewable later.
const EXCEPTIONS = {
  "tamasfe.even-better-toml": "de facto TOML standard, no maintained alternative",
  "gruntfuggly.todo-tree": "millions of installs, alternatives sit under 30k",
  "oderwat.indent-rainbow": "single-purpose and finished; alternatives under 1k installs",
  "stivo.tailwind-fold": "no credible maintained alternative",
  "nuxtr.nuxtr-vscode": "only Nuxt tooling extension on the marketplace",
  "box-of-hats.bemhelper": "only BEM extension with real adoption (191k)",
};

const ids = [...new Set(readPacks().flatMap((p) => p.json.extensionPack ?? []).filter((id) => !isOwnPack(id)))];
const found = new Map();
for (const e of await gallery(ids.map((value) => ({ filterType: 7, value })))) {
  found.set(`${e.publisher.publisherName}.${e.extensionName}`.toLowerCase(), e.versions?.[0]?.lastUpdated ?? null);
}

const missing = [];
const stale = [];
const ageing = [];
for (const id of ids) {
  const key = id.toLowerCase();
  if (!found.has(key)) {
    missing.push(id);
    continue;
  }
  if (key in EXCEPTIONS) continue;
  const updated = found.get(key);
  const months = updated ? (Date.now() - new Date(updated).getTime()) / 2.628e9 : Infinity;
  const entry = `${id} (${months.toFixed(1)} months)`;
  if (months > FAIL_MONTHS) stale.push(entry);
  else if (months > WARN_MONTHS) ageing.push(entry);
}

for (const id of missing) console.log(`MISSING  ${id}`);
for (const e of stale) console.log(`STALE    ${e}`);
for (const e of ageing) console.log(`AGEING   ${e}`);
console.log(
  `\n${ids.length} extensions checked: ${missing.length} missing, ${stale.length} past ${FAIL_MONTHS} months, ` +
    `${ageing.length} past ${WARN_MONTHS} months, ${Object.keys(EXCEPTIONS).length} grandfathered.`,
);

const blocking = missing.length + stale.length + (failOnWarn ? ageing.length : 0);
process.exit(blocking > 0 ? 1 : 0);
