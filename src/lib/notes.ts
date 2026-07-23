import type { CollectionEntry } from "astro:content";

export function sortNotes(notes: CollectionEntry<"notes">[]) {
  return notes.sort(
    (left, right) =>
      right.data.published.valueOf() - left.data.published.valueOf(),
  );
}

export function visibleNotes(notes: CollectionEntry<"notes">[]) {
  return sortNotes(
    notes.filter((note) => import.meta.env.DEV || !note.data.draft),
  );
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
