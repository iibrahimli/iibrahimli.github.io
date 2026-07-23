import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const client = join(dist, "client");
const server = join(dist, "server");

await rm(client, { recursive: true, force: true });
await mkdir(client, { recursive: true });

for (const entry of await readdir(dist, { withFileTypes: true })) {
  if (entry.name === "client" || entry.name === "server") continue;
  await cp(join(dist, entry.name), join(client, entry.name), { recursive: true });
}

await mkdir(server, { recursive: true });
await writeFile(
  join(server, "index.js"),
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
`,
);
