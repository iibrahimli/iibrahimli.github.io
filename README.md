# Imran Ibrahimli — research notes

A minimal, Markdown-first research blog for deep learning, experiments, and
technical essays. It is built with [Astro](https://astro.build/) and deployed
as a static site to GitHub Pages.

## The short version

```bash
npm install
npm run dev
```

Open the local address printed in the terminal. Changes appear as you save.

To create a new draft:

```bash
npm run new -- "What I learned about sparse autoencoders"
```

That creates a Markdown file in `src/content/notes/`. Write the post, keep
`draft: true` while it is unfinished, and change it to `draft: false` (or remove
the line) when it is ready to publish.

## Writing a note

Every note lives in `src/content/notes/` and starts with a small metadata block:

```md
---
title: "A precise, useful title"
description: "One sentence used on the homepage and in link previews."
published: 2026-07-23
tags:
  - Mechanistic interpretability
draft: true
readingMinutes: 8
---

Your post starts here.
```

Ordinary Markdown works for headings, links, tables, quotes, images, and code
blocks. Mathematical notation uses LaTeX delimiters:

```md
Inline math: $p(y \mid x)$

Display math:

$$
\mathcal{L}(\theta) = \frac{1}{n}\sum_i \ell(f_\theta(x_i), y_i)
$$
```

Put figures in `public/images/` and reference them from a note with
`![alt text](/images/figure-name.png)`. Keep experiment code under
`experiments/` so a post can link to the exact implementation and results.

Drafts are visible during local development and omitted from production builds.

## Public files and short links

GitHub Pages can also serve PDFs, slides, datasets, and other static files. This
project includes a small helper:

```bash
npm run add-file -- ~/Desktop/cv.pdf cv
```

It copies the file to `public/files/cv.pdf` and creates the short link `/cv`.
After the next deployment, both of these work:

```text
https://iibrahimli.github.io/cv
https://iibrahimli.github.io/files/cv.pdf
```

Use lowercase letters, numbers, and hyphens for short names. The mappings live
in `src/data/file-links.json`, so they can also be edited by hand.

Every file deployed with GitHub Pages is public. Do not put a sensitive CV,
private draft, access token, unpublished dataset, or personal document in
`public/`.

For genuinely private downloads, use a service that supports authentication or
expiring links—such as a private Google Drive, Dropbox, or Box link; an
authenticated object store; or Cloudflare Access—and add only that share link
to the site. GitHub Pages cannot securely implement private file links because
it has no server-side authentication.

## Local commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the live local preview |
| `npm run new -- "Title"` | Create a new draft note |
| `npm run add-file -- /path/to/file.pdf short-name` | Add a public file and short link |
| `npm run check` | Check content and Astro/TypeScript files |
| `npm run build` | Make the production site in `dist/` |
| `npm run preview` | Preview the most recent production build |
| `python3 experiments/spectral_bias.py` | Reproduce the example post’s result |

## How publishing works

The site uses one simple path from writing to publishing:

1. Write and preview the note locally with `npm run dev`.
2. Set `draft: false` when it is ready.
3. Run `npm run check && npm run build`.
4. Commit the change and push it to `main`.
5. GitHub Actions builds the site and publishes it to
   `https://iibrahimli.github.io`.

The workflow is in `.github/workflows/deploy.yml`. You do not upload the
generated `dist/` folder; GitHub builds it from the Markdown and source files.

For the first deployment only:

1. Open the repository on GitHub and go to **Settings**.
2. Under **Default branch**, choose `main`, click **Update**, and confirm.
3. Return to the repository, open the branch menu, choose **View all branches**,
   and delete `master`.
4. Go to **Settings → Pages → Build and deployment → Source** and choose
   **GitHub Actions**.
5. Open **Actions → Deploy to GitHub Pages** and run the workflow, or push a new
   commit to `main`.

Later pushes to `main` deploy automatically. Deployment progress and logs
appear in the repository’s **Actions** tab.

## Site structure

```text
src/
  content/notes/      Markdown posts
  components/         Reusable page pieces
  layouts/            Site and article layouts
  pages/              Home, archive, about, RSS, and article routes
  styles/global.css   The visual system
experiments/          Reproducible code and recorded results
public/               Public images and downloadable files
```

The homepage, archive, RSS feed, related-note links, dates, and metadata are
generated from the note files. Normally, publishing a new article should not
require editing frontend code.

## Personalizing it

The name, introduction, profile links, and contact email currently live in:

- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/components/SiteFooter.astro`
- `src/layouts/NoteLayout.astro`

The canonical site URL is set in `astro.config.mjs`. Change it there if you move
to a custom domain.

## Example research note

`src/content/notes/the-first-frequency-arrives-fast.md` is a complete example.
Its numbers come from the dependency-free experiment in
`experiments/spectral_bias.py`, and the recorded output is in
`experiments/spectral_bias_results.json`.
