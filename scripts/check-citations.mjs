import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const bibliographyPath = join(root, "src", "data", "references.json");
const notesDirectory = join(root, "src", "content", "notes");

let bibliography;
try {
  bibliography = JSON.parse(await readFile(bibliographyPath, "utf8"));
} catch (error) {
  console.error(`Could not read src/data/references.json: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(bibliography)) {
  console.error("src/data/references.json must contain a CSL-JSON array.");
  process.exit(1);
}

const referenceIds = new Set();
const duplicateIds = new Set();

for (const item of bibliography) {
  if (!item || typeof item.id !== "string" || item.id.length === 0) {
    console.error("Every item in src/data/references.json must have a citation-key id.");
    process.exit(1);
  }

  if (referenceIds.has(item.id)) duplicateIds.add(item.id);
  referenceIds.add(item.id);
}

if (duplicateIds.size > 0) {
  console.error(`Duplicate citation keys: ${[...duplicateIds].sort().join(", ")}`);
  process.exit(1);
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFiles(path)));
    if (entry.isFile() && [".md", ".mdx"].includes(extname(entry.name))) files.push(path);
  }

  return files;
}

const missing = [];

for (const path of await markdownFiles(notesDirectory)) {
  const lines = (await readFile(path, "utf8")).split("\n");
  let fence = null;

  for (const [index, originalLine] of lines.entries()) {
    const fenceMatch = originalLine.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === marker) fence = null;
      else if (fence === null) fence = marker;
      continue;
    }
    if (fence !== null) continue;

    const line = originalLine.replace(/`[^`]*`/g, "");
    for (const bracket of line.matchAll(/\[[^\]]*@[^\]]+\]/g)) {
      for (const citation of bracket[0].matchAll(/[\[\s;][-]?@([^\s,;\]]+)/g)) {
        const id = citation[1].replace(/[.!?]+$/, "");
        if (!referenceIds.has(id)) {
          missing.push(`${relative(root, path)}:${index + 1} — @${id}`);
        }
      }
    }
  }
}

if (missing.length > 0) {
  console.error("Unknown citation keys:\n");
  console.error(missing.map((entry) => `  ${entry}`).join("\n"));
  console.error("\nAdd these papers to the Zotero export before building.");
  process.exit(1);
}

console.log(
  `Citations OK (${referenceIds.size} reference${referenceIds.size === 1 ? "" : "s"} available).`,
);
