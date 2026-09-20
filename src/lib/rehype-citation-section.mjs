import { readFileSync } from "node:fs";

const references = JSON.parse(
  readFileSync(new URL("../data/references.json", import.meta.url), "utf8"),
);
const paperUrls = new Map(
  references.filter((reference) => reference.URL).map((reference) => [
    `#bib-${reference.id.toLowerCase()}`,
    reference.URL,
  ]),
);

function linkCitationsToPapers(node, inCitation = false) {
  const isCitation = inCitation || node.properties?.className?.includes("citation");
  if (isCitation && node.tagName === "a") {
    const url = paperUrls.get(node.properties?.href);
    if (url) {
      node.properties.href = url;
      node.properties.title = url;
    }
  }
  node.children?.forEach((child) => linkCitationsToPapers(child, isCitation));
}

function textContent(node) {
  if (node.type === "text") return node.value;
  if (!node.children) return "";
  return node.children.map(textContent).join("");
}

function addReferencesHeading(node) {
  if (!node.children) return false;

  const referencesIndex = node.children.findIndex(
    (child) => child.type === "element" && child.properties?.id === "refs",
  );

  if (referencesIndex !== -1) {
    const previous = node.children[referencesIndex - 1];
    const hasHeading =
      previous?.type === "element" &&
      /^h[1-6]$/.test(previous.tagName) &&
      /^(references|bibliography)$/i.test(textContent(previous).trim());

    if (!hasHeading) {
      node.children.splice(referencesIndex, 0, {
        type: "element",
        tagName: "h2",
        properties: { className: ["references-title"] },
        children: [{ type: "text", value: "References" }],
      });
    }

    return true;
  }

  return node.children.some(addReferencesHeading);
}

export default function rehypeCitationSection() {
  return (tree) => {
    linkCitationsToPapers(tree);
    addReferencesHeading(tree);
  };
}
