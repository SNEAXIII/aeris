// Publishes only the packs whose local version is ahead of the marketplace.
// Changesets bumps versions; this decides what actually ships.
import { execFileSync } from "node:child_process";
import { readPacks, gallery } from "./lib/packs.mjs";

const packs = readPacks();
const remote = new Map();
for (const e of await gallery(packs.map((p) => ({ filterType: 7, value: `${p.json.publisher}.${p.json.name}` })))) {
  remote.set(`${e.publisher.publisherName}.${e.extensionName}`.toLowerCase(), e.versions?.[0]?.version ?? null);
}

const pat = process.env.VSCE_PAT;
if (!pat) throw new Error("VSCE_PAT is not set");

for (const pack of packs) {
  const id = `${pack.json.publisher}.${pack.json.name}`.toLowerCase();
  const published = remote.get(id);
  if (published === pack.json.version) {
    console.log(`skip     ${id}@${pack.json.version}`);
    continue;
  }
  console.log(`publish  ${id} ${published ?? "(new)"} -> ${pack.json.version}`);
  execFileSync("npx", ["vsce", "publish", "--no-dependencies", "-p", pat], {
    cwd: `packages/${pack.dir}`,
    stdio: "inherit",
    shell: true,
  });
}
