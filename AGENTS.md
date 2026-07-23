# Project guidance

This repository is Imran Ibrahimli's personal research site and notes blog,
published with GitHub Pages.

## Product direction

- Keep the site quiet, elegant, modern, minimal, and fast.
- Useful visual references:
  - https://transformer-circuits.pub/2025/attribution-graphs/biology.html
  - https://lilianweng.github.io/
  - https://colah.github.io/
- Notes are Markdown files in `src/content/notes/`.

## Technical workflow

- Keep Astro static and compatible with free GitHub Pages hosting.
- Preserve the `About / Notes / CV` navigation and mobile behavior.
- Use `npm run new -- "Title"` for new note scaffolding.
- Use `npm run add-file -- /path/to/file short-name` for public file aliases.
- Run `npm run check` and `npm run build` after meaningful changes.
