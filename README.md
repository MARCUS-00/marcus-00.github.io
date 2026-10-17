# Manoj Kumar — portfolio

A static site generated from content data. Plain HTML, CSS and a few small ES
modules. There are no runtime dependencies and no framework. Every page is
complete without JavaScript, and scripts only enhance it.

## Commands

```bash
npm install          # dev tooling only (browser tests)
npm run dev          # build + serve at http://127.0.0.1:4173, rebuilds on change
npm run build        # production build into dist/
npm test             # content validation + build/structure tests (no browser)
npm run test:e2e     # browser tests via installed Edge/Chrome (BROWSER_CHANNEL=chrome to choose)
npm run check        # both
npm run social       # re-render the link-preview image (src/static/social.png) from the profile
```

Build options (environment variables):

| Variable    | Effect |
| ----------- | ------ |
| `SITE_URL`  | Absolute origin for canonical URLs, `og:url`, `sitemap.xml` and `robots.txt`. Defaults to `https://marcus-00.github.io`; set it to a custom domain later, or to an empty string to omit them. |
| `BASE_PATH` | Deploy under a sub-path, e.g. `/portfolio/` for a GitHub Pages project site. Default `/`. |

## Deploying

**Production:** the GitHub Pages user site **https://marcus-00.github.io/**, published from this
repository (`MARCUS-00/marcus-00.github.io`, branch `main`). It is served from the root, so
`BASE_PATH` is `/`.

`.github/workflows/pages.yml` runs on every push to `main` (and on demand from the Actions tab):
it installs, runs the unit tests, builds with `SITE_URL=https://marcus-00.github.io`, and
publishes **only `dist/`** as a Pages artifact. It commits nothing back. One-time setup:
Settings → Pages → Build and deployment → Source: **GitHub Actions**.

`404.html` handles unknown paths. Pages serves `dir/index.html` for `dir/` and redirects `/work`
to `/work/`, so `/p/<slug>/` and section links load directly. Other repositories' project sites
stay at `/<repo>/`; none of those paths collides with this site's routes. The build also writes
`.nojekyll`, which matters only if the site is ever published from a branch instead.

Any other static host works the same way: upload `dist/`. Files under `assets/` have content
hashes in their names, so they can be cached forever.

## Editing content

All content lives in `src/content/`. Pages are rendered from it, so editing
content never means editing markup.

| File            | What it holds |
| --------------- | ------------- |
| `profile.js`    | Name, role, contact links, résumé path. Links appear on every surface automatically. |
| `projects.js`   | Projects in display order. Any number works: the first three featured ones appear in the home topology, and `/work/` lists all. Optional fields simply drop their block. Each case study can carry an `overview` (context, problem, data, what made it hard, approach) and typed `findings` (Finding, Interpretation, Recommendation, Next step). Evidence takes links, a verbatim `code` excerpt from the repository, a supplied `media` capture (image in `src/static/`, with alt text and pixel size), or a plain `pending` note. |
| `experience.js` | Professional roles: role, organisation, dates, a one-line summary, what the role involved (`did`, short bullets), tools, and an optional link to the project it produced. No project results here. |
| `education.js`  | Academic records only: qualification, field, institution, dates, completion status. |
| `skills.js`     | The competency inventory, grouped by kind with the data-analysis stack first. Plain names: skills do not link to projects (each case study lists its own tools). No ratings. |
| `site.js`       | Site copy: statement, About (a lead paragraph and labelled sections), topology labels, metadata, `socialImage` (the 1200×630 link-preview PNG, rendered by `npm run social`), and `verification` (Google/Bing meta-tag tokens, unset). |

`npm run build` validates content first, and refuses to build if a project is
missing required fields, or a
featured project doesn't fit the five-column topology.

Every factual claim is sourced from the résumé, the project repositories on
github.com/MARCUS-00 and their documentation. Keep it that way. `tests/unit/content.test.mjs` guards the
corrections already made.

## Routes

| Path | Page |
| ---- | ---- |
| `/` | Home: hero, project topology, statement, selected work (previews), skills summary, contact |
| `/work/` | Work: the curated project index |
| `/p/<id>/` | A project's case study |
| `/p/<id>/<section>/` | Case study opened at a section (`overview`, `findings`, `method`, `decisions`, `validation`, `evidence`); canonical to `/p/<id>/` |
| `/experience/`, `/skills/`, `/about/`, `/contact/` | Section pages |

Older hash-style links (`/#/p/olist/validation`) redirect to these paths.

## Display

High contrast is permanent: the colour tokens are the high-contrast set, so secondary text meets
WCAG AA in both themes, with or without JavaScript. There is no control to turn it off.

The default is **Dark**. One toggle, **Light mode**, sits in the header (as an icon, from 700px up)
and in the mobile menu (labelled). A switch to Light is saved in `localStorage` (`mk-theme`) and
applied by the inline boot script before first paint.

## Layout

```
src/content/     data
src/templates/   pure functions: data → HTML (layout, pages, components)
src/styles/      the stylesheet
src/scripts/     progressive enhancement: display, menu, topology, motion, case navigation
src/static/      fonts (self-hosted, OFL), favicon, résumé PDF, link-preview image, project image
scripts/         build, dev and static server
tests/           unit/ (node:test) and e2e/ (playwright-core + axe-core)
```
