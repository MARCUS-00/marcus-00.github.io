# Manoj Kumar — Data Analyst portfolio

This repository builds **[marcus-00.github.io](https://marcus-00.github.io/)**, my portfolio as a
data analyst based in Bengaluru, India. I have a B.Tech in Computer Science from PES University
(completed July 2026) and am open to data analyst roles.

I turn raw data into analysis, dashboards and validated findings — cleaning and querying it with SQL
and Python, reporting it in Power BI, and testing results with statistics, forecasting and applied ML.

**[Live portfolio](https://marcus-00.github.io/)** · **[Résumé (PDF)](https://marcus-00.github.io/Manoj_Kumar_Resume.pdf)** ·
[LinkedIn](https://www.linkedin.com/in/manoj-kumar-analytics) · [Email](mailto:mailtomanojkumar07@gmail.com)

## Case studies

Each project is written up on the site with its question, data, method, validation and limits.

### [Olist revenue and retention analytics](https://marcus-00.github.io/p/olist/)

A personal project on the public Olist Brazilian e-commerce dataset (99,441 orders across nine
tables, 2016–2018): a Python ETL into a PostgreSQL 16 star schema, 18 SQL analyses, a Mann-Whitney U
test, cohort and RFM analysis, a 28-day demand forecast and a Power BI dashboard.

- **Findings:** 3.0% of customers placed a second delivered order. 8.11% of delivered orders arrived
  late, and late orders had a median review of 2/5 against 5/5 on time — an association, not proof
  of cause.
- **Validation:** in a six-fold walk-forward backtest, a seasonal-naive baseline (WAPE 0.2308) was
  effectively tied with Holt-Winters (0.2310), so the simpler baseline is the recommended forecast.
- **Tools:** SQL, Python, PostgreSQL, Power BI (DAX), Excel, Docker, GitHub Actions
- **Code:** [MARCUS-00/ecommerce-retention-analytics](https://github.com/MARCUS-00/ecommerce-retention-analytics)

### [OsteoScan: osteoporosis screening from dental X-rays](https://marcus-00.github.io/p/osteoscan/)

A project at PES University (2025–2026): a three-class bone-density classifier (EfficientNet-B0 with
a frozen ImageNet backbone) for dental periapical radiographs from 13 patients in a public Mendeley
dataset, served as a Flask web app with Grad-CAM heatmaps and PDF reports.

- **Findings:** the first evaluation's 97.28% accuracy came from patient-level leakage — a random
  patch-level split put the same patients in both the training and the test data.
- **Validation:** under patient-grouped cross-validation the model scored 61.5% (8 of 13 patients)
  against 53.8% for a brightness-only baseline, with a 95% bootstrap interval of 38.5–84.6% that
  overlaps the baseline. It is a research prototype, not a diagnostic tool.
- **Tools:** Python, TensorFlow and Keras, EfficientNet-B0, Flask, SQLite, Docker, GitHub Actions
- **Code and demo:** [repository](https://github.com/MARCUS-00/Early-Detection-of-Osteoporosis-using-Dental-X-rays) ·
  [live app](https://manojkumar724-osteoscan.hf.space) (sign-in required; accounts can be created on the page)

### [Explainable models on financial data](https://marcus-00.github.io/p/c3i/)

Research internship at C3I, PES University (January–May 2026, under faculty supervision): predicting
the 10-day price direction of 40 Indian large-cap equities from 68 features — prices and technical
indicators, fundamentals, FinBERT news sentiment and macroeconomic events — with an XGBoost and LSTM
ensemble, explained with SHAP.

- **Findings:** accuracy (0.534) fell below an always-up baseline (0.547), and with 0.1% costs per
  position change a backtest of the signals returned 10.52% against 12.23% for equal-weight
  buy-and-hold. It is a research scaffold, not a trading signal.
- **Validation:** time-based splits, validation scores from a model trained on training rows only,
  and a test AUC of 0.54 against 0.50 for chance (bootstrap 95% interval 0.529–0.552).
- **Tools:** Python, XGBoost, PyTorch, FinBERT, SHAP

## About this repository

The site is generated from the content in [`src/content/`](src/content/) by a small Node build
script: plain HTML, CSS and a few small ES modules, with no runtime dependencies and no framework.
Every page is complete without JavaScript, and scripts only enhance it.
[`.github/workflows/pages.yml`](.github/workflows/pages.yml) tests, builds and deploys it to GitHub
Pages on every push to `main`.

### Commands

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

### Testing

`npm test` validates the content and checks the generated pages: structure, metadata, canonical
URLs, and that facts such as role, dates and education read the same wherever they appear.
`npm run test:e2e` drives Edge or Chrome through the site: routes and navigation, keyboard and
no-JavaScript use, the Light/Dark setting, an axe-core accessibility audit (WCAG 2.0–2.2 A and AA
rules), and layout at 12 widths from 320 to 3440 px.

### Deploying

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

### Editing content

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

`npm run build` validates content first, and refuses to build if a project is missing required
fields, or a featured project doesn't fit the five-column topology.

Every factual claim is sourced from the résumé, the project repositories on github.com/MARCUS-00
and their documentation. Keep it that way: [`tests/unit/content.test.mjs`](tests/unit/content.test.mjs)
guards the corrections already made, and this README repeats headline figures from
`src/content/projects.js`, so update both together.

### Routes

| Path | Page |
| ---- | ---- |
| `/` | Home: hero, project topology, statement, selected work (previews), skills summary, contact |
| `/work/` | Work: the curated project index |
| `/p/<id>/` | A project's case study |
| `/p/<id>/<section>/` | Case study opened at a section (`overview`, `findings`, `method`, `decisions`, `validation`, `evidence`); canonical to `/p/<id>/` |
| `/experience/`, `/skills/`, `/about/`, `/contact/` | Section pages |

Older hash-style links (`/#/p/olist/validation`) redirect to these paths.

### Display

High contrast is permanent: the colour tokens are the high-contrast set, so secondary text meets
WCAG AA in both themes, with or without JavaScript. There is no control to turn it off.

The default is **Dark**. One toggle, **Light mode**, sits in the header (as an icon, from 700px up)
and in the mobile menu (labelled). A switch to Light is saved in `localStorage` (`mk-theme`) and
applied by the inline boot script before first paint.

### Layout

```
src/content/     data
src/templates/   pure functions: data → HTML (layout, pages, components)
src/styles/      the stylesheet
src/scripts/     progressive enhancement: display, menu, topology, motion, case navigation
src/static/      fonts (self-hosted, OFL), favicon, résumé PDF, link-preview image, project image
scripts/         build, dev and static server
tests/           unit/ (node:test) and e2e/ (playwright-core + axe-core)
```
