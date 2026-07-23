import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";

const [, , sourceArgument, aliasArgument] = process.argv;

if (!sourceArgument || !aliasArgument) {
  console.error("Usage: npm run add-file -- /path/to/file.pdf short-name");
  process.exit(1);
}

const alias = aliasArgument.toLowerCase();
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias)) {
  console.error("The short name may contain lowercase letters, numbers, and single hyphens.");
  process.exit(1);
}

const source = resolve(sourceArgument);
const extension = extname(source).toLowerCase();
if (!extension) {
  console.error(`The source file needs an extension: ${basename(source)}`);
  process.exit(1);
}

const publicDirectory = join(process.cwd(), "public", "files");
const destinationName = `${alias}${extension}`;
const destination = join(publicDirectory, destinationName);
const linksPath = join(process.cwd(), "src", "data", "file-links.json");
const links = JSON.parse(await readFile(linksPath, "utf8"));

if (links[alias]) {
  console.error(`The short link /${alias} already points to ${links[alias]}`);
  process.exit(1);
}

await mkdir(publicDirectory, { recursive: true });
await copyFile(source, destination);
links[alias] = `/files/${destinationName}`;
await writeFile(linksPath, `${JSON.stringify(links, null, 2)}\n`);

console.log(`Added ${destination}`);
console.log(`Short link: /${alias}`);
