import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const PACKAGES_DIR = "packages";

/** Every pack in the workspace, as { dir, path, json }. */
export function readPacks() {
  return readdirSync(PACKAGES_DIR).map((dir) => {
    const path = join(PACKAGES_DIR, dir, "package.json");
    return { dir, path, json: JSON.parse(readFileSync(path, "utf8")) };
  });
}

/** True for an entry pointing at another Aeris pack rather than a third-party extension. */
export const isOwnPack = (id) => id.toLowerCase().startsWith("sneaxiii.");

export async function gallery(criteria, flags = 950) {
  const res = await fetch("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;api-version=3.0-preview.1",
    },
    body: JSON.stringify({ filters: [{ criteria, pageSize: 100 }], flags }),
  });
  if (!res.ok) throw new Error(`gallery API returned ${res.status}`);
  const json = await res.json();
  return json.results[0].extensions ?? [];
}
