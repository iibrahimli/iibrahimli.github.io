# iibrahimli.github.io

A lightweight personal site built with [Astro](https://astro.build/) and hosted
for free on GitHub Pages.

## Local preview

Install dependencies once:

```bash
npm install
```

Start the local site:

```bash
npm run dev
```

Open the address printed in the terminal. Changes appear as files are saved.

Useful commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local preview |
| `npm run new -- "Note title"` | Create a new draft note |
| `npm run check` | Check Astro and TypeScript files |
| `npm run build` | Create the production site in `dist/` |
| `npm run preview` | Preview the production build |
| `npm run add-file -- /path/to/file.pdf short-name` | Add a public file and short link |

## Résumé

The current résumé is stored at `public/files/cv.pdf` and is available at:

```text
https://iibrahimli.github.io/cv
```

To replace it later, copy the new PDF over `public/files/cv.pdf`. The short link
does not need to change.

## Other public files

Add a PDF, slide deck, or other download with:

```bash
npm run add-file -- ~/Desktop/slides.pdf slides
```

This copies the file into `public/files/` and creates `/slides`. Short-link
mappings are stored in `src/data/file-links.json`.

Everything published by GitHub Pages is public. Do not put private or sensitive
documents in `public/`. Private files require an external service with
authentication, such as a restricted Google Drive, Dropbox, or Box share.

## Notes

Notes are Markdown files in `src/content/notes/`. Create a draft with:

```bash
npm run new -- "A note about something"
```

Drafts appear locally but are excluded from production. Change `draft: true` to
`draft: false` or remove that line when the note is ready to publish.

### Zotero citations

The site reads its bibliography from `src/data/references.json`. Set up Zotero
once:

1. Install Better BibTeX and create a collection named `Website References`.
2. Right-click that collection and choose **Export Collection**.
3. Select **Better CSL JSON**, enable **Keep updated**, and save it as:

   ```text
   /Users/imran/Desktop/iibrahimli.github.io/src/data/references.json
   ```

4. In Better BibTeX's citation-key settings, set Quick Copy to Pandoc/Markdown
   citations. Copying a selected Zotero item should then produce `[@citekey]`.

Use the copied key directly in a note:

```md
This result extends earlier work [@author2025paper].

Several papers study the same effect [@author2025paper; @other2024result].

The relevant construction appears in the appendix [see @author2025paper, p. 12].
```

The site turns citations into linked author–year references and adds a
References section automatically. `npm run check` and `npm run build` report
unknown citation keys, which usually means the paper is not yet in the
`Website References` collection or Zotero has not refreshed the export.

## Publications

Homepage publications live in `src/data/publications.json`. Add one object with
the title, authors, type, venue, ISO date, primary URL, and any related links:

```json
{
  "title": "Paper title",
  "authors": ["Imran Ibrahimli", "Coauthor Name"],
  "venue": "Conference name",
  "date": "2026-07-11",
  "primaryUrl": "https://example.com/paper",
  "links": [
    { "label": "Paper", "url": "https://example.com/paper" },
    { "label": "PDF", "url": "https://example.com/paper.pdf" }
  ]
}
```

The homepage sorts entries by `date` in descending order. Add `"type":
"Preprint"` or `"type": "MSc thesis"` when that distinction is useful;
ordinary conference and workshop entries can omit `type`. Use `"newTab": true`
on a link when it should open in a new tab. The site bolds `Imran Ibrahimli`
automatically in each author list.

## Deploying

The workflow in `.github/workflows/deploy.yml` publishes the site whenever
`main` is pushed.

For the initial setup:

1. In the GitHub repository, open **Settings**.
2. Set the **Default branch** to `main`.
3. Open **Settings → Pages** and choose **GitHub Actions** as the source.
4. Under **Settings → Environments → github-pages**, ensure deployments from
   `main` are allowed.
5. Push when ready:

```bash
git push origin main
```

Future pushes to `main` deploy automatically.

## Structure

```text
src/pages/index.astro       About page
src/content/notes/          Markdown notes
src/styles/global.css       Site design
src/data/file-links.json    Short file links
src/data/publications.json  Homepage publications
public/files/               Public downloads
```
