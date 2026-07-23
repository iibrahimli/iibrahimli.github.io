import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { visibleNotes } from "../lib/notes";

export async function GET(context) {
  const notes = visibleNotes(await getCollection("notes"));
  return rss({
    title: "Imran Ibrahimli — Research notes",
    description:
      "Research notes on deep learning, interpretability, and understanding models.",
    site: context.site,
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.published,
      link: `/notes/${note.id}/`,
      categories: note.data.tags,
    })),
  });
}
