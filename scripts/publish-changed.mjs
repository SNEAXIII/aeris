// Publishes only the packs whose local version is ahead of the marketplace.
// Changesets bumps versions; this decides what actually ships.
import { execFileSync } from "node:child_process";
import { readPacks, gallery } from "./lib/packs.mjs";

// The marketplace caps how many *new* extensions a publisher can create per 12h.
// Hitting it is not a build failure: the remaining packs go out on the next run.
const RATE_LIMIT = /exceeded the maximum number of extensions/i;

// A freshly published extension takes minutes to appear in the gallery, so a re-run
// in that window sees it as new and tries again. That is a no-op, not a failure.
const ALREADY_PUBLISHED = /already exists|already published/i;

const packs = readPacks();
const remote = new Map();
for (const e of await gallery(packs.map((p) => ({ filterType: 7, value: `${p.json.publisher}.${p.json.name}` })))) {
  remote.set(`${e.publisher.publisherName}.${e.extensionName}`.toLowerCase(), e.versions?.[0]?.version ?? null);
}

const pat = process.env.VSCE_PAT;
if (!pat) throw new Error("VSCE_PAT is not set");

const published = [];
const deferred = [];
const failed = [];

for (const pack of packs) {
  const id = `${pack.json.publisher}.${pack.json.name}`.toLowerCase();
  const already = remote.get(id);
  if (already === pack.json.version) {
    console.log(`skip     ${id}@${pack.json.version}`);
    continue;
  }
  if (deferred.length) {
    // The cap is per publisher: once it bites, every remaining pack would hit it too.
    deferred.push(id);
    continue;
  }
  console.log(`publish  ${id} ${already ?? "(new)"} -> ${pack.json.version}`);
  try {
    execFileSync("npx", ["vsce", "publish", "--no-dependencies", "-p", pat], {
      cwd: `packages/${pack.dir}`,
      stdio: ["inherit", "inherit", "pipe"],
      shell: true,
      encoding: "utf8",
    });
    published.push(id);
  } catch (error) {
    const message = `${error.stderr ?? ""}${error.message ?? ""}`;
    if (ALREADY_PUBLISHED.test(message)) {
      console.log(`skip     ${id} — already on the marketplace, gallery not indexed yet`);
      continue;
    }
    if (RATE_LIMIT.test(message)) {
      console.log(`deferred ${id} — marketplace 12h cap on new extensions`);
      deferred.push(id);
      continue;
    }
    console.error(`FAILED   ${id}\n${message}`);
    failed.push(id);
  }
}

console.log(`\n${published.length} published, ${deferred.length} deferred, ${failed.length} failed.`);
if (deferred.length) console.log(`Deferred until the cap resets: ${deferred.join(", ")}. Re-run this workflow then.`);
process.exit(failed.length > 0 ? 1 : 0);
