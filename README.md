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
public/files/               Public downloads
```
