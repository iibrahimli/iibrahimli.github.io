import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: npm run new -- "Your post title"');
  process.exit(1);
}

const slug = title
  .normalize("NFKD")
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/[\s_]+/g, "-")
  .replace(/-+/g, "-");

if (!slug) {
  console.error("The title must contain at least one letter or number.");
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const directory = join(process.cwd(), "src", "content", "notes");
const path = join(directory, `${slug}.md`);
const safeTitle = title.replaceAll('"', '\\"');
const template = `---
title: "${safeTitle}"
description: "One-sentence summary for the homepage and link previews."
published: ${today}
tags:
  - Deep learning
draft: true
readingMinutes: 5
---

Start with the question or observation.

## Setup

Describe the model, data, metric, and the choice you are testing.

## Finding

State what happened, with enough evidence to evaluate it.

## What I think it means

Separate observation from interpretation, and list the important limitations.
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
