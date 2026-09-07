// Regenerates the extension table and applied-settings section of every pack README
// from its package.json, so the two can never drift.
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readPacks, isOwnPack, gallery } from "./lib/packs.mjs";

const START = "<!-- gen:start -->";
const END = "<!-- gen:end -->";

const packs = readPacks();
const thirdParty = [...new Set(packs.flatMap((p) => p.json.extensionPack ?? []).filter((id) => !isOwnPack(id)))];

const names = new Map();
for (const e of await gallery(thirdParty.map((value) => ({ filterType: 7, value })), 914)) {
  names.set(`${e.publisher.publisherName}.${e.extensionName}`.toLowerCase(), {
    display: e.displayName,
    description: e.shortDescription ?? "",
  });
}

const link = (id) => `[${names.get(id.toLowerCase())?.display ?? id}](https://marketplace.visualstudio.com/items?itemName=${id})`;

for (const pack of packs) {
  const { json } = pack;
  const included = (json.extensionPack ?? []).filter(isOwnPack);
  const own = (json.extensionPack ?? []).filter((id) => !isOwnPack(id));
  const lines = [START, ""];

  if (included.length) {
    lines.push("## Included packs", "");
    for (const id of included) lines.push(`- ${link(id)}`);
    lines.push("");
  }

  lines.push("## Extensions", "", "| Extension | Purpose |", "| --- | --- |");
  for (const id of own) lines.push(`| ${link(id)} | ${names.get(id.toLowerCase())?.description ?? ""} |`);
  lines.push("");

  const defaults = json.contributes?.configurationDefaults;
  if (defaults) {
    lines.push(
      "## Settings applied",
      "",
      "This pack sets the following defaults. Anything you set yourself wins.",
      "",
      "```json",
      JSON.stringify(defaults, null, 2),
      "```",
      "",
    );
  }
  lines.push(END);

  const path = join("packages", pack.dir, "README.md");
  const current = readFileSync(path, "utf8");
  const next = current.slice(0, current.indexOf(START)) + lines.join("\n") + current.slice(current.indexOf(END) + END.length);
  writeFileSync(path, next);
  console.log(`generated packages/${pack.dir}/README.md`);
}
