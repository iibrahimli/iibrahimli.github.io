import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: npm run new -- "Your note title"');
  process.exit(1);
}

const slug = title
  .normalize("NFKD")
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/[\s_]+/g, "-")
  .replace(/-+/g, "-");

const today = new Date().toISOString().slice(0, 10);
const directory = join(process.cwd(), "src", "content", "notes");
const path = join(directory, `${slug}.md`);
const safeTitle = title.replaceAll('"', '\\"');
const template = `---
title: "${safeTitle}"
description: "A short summary."
published: ${today}
tags: []
draft: true
---

TODO
`;

await mkdir(directory, { recursive: true });

try {
  await writeFile(path, template, { flag: "wx" });
} catch (error) {
  if (error?.code === "EEXIST") {
    console.error(`A note already exists at ${path}`);
    process.exit(1);
  }
  throw error;
}

console.log(`Created ${path}`);
