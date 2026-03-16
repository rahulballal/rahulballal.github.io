# Rahul Ballal - Resume Website

A static resume website generated from markdown and deployed to GitHub Pages.

## Overview

- Source of truth: `raw/resume.md`
- HTML template: `templates/resume.ejs`
- Generator: `scripts/generate-resume.js`
- Output: `index.html` and `dist/` for deployment

## Prerequisites

- Node.js 18+
- pnpm 10+

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm run dev
```

Serves the project on `http://localhost:3000` with caching disabled.

## Build And Validate

```bash
pnpm run build
```

The build pipeline performs all of the following:

1. Cleans `dist/`
2. Regenerates `index.html` from `raw/resume.md`
3. Copies static assets into `dist/`
4. Validates both `index.html` and `dist/index.html`
5. Verifies local links in `index.html`

## Tests

```bash
pnpm test
```

Runs parser regression tests for the markdown-to-HTML transformation logic.

## Preview Built Output

```bash
pnpm run serve:dist
```

Serves `dist/` on `http://localhost:8080`.

## Scripts

- `pnpm start` - Serve project on port 3000 and open browser
- `pnpm run dev` - Serve project on port 3000 with disabled cache
- `pnpm run generate:resume` - Regenerate `index.html` from markdown
- `pnpm run build` - Full build, validation, and link checks
- `pnpm run serve` - Serve project on port 8080
- `pnpm run serve:dist` - Serve built site from `dist/`
- `pnpm run lint:html` - Run HTMLHint against `index.html`
- `pnpm run validate` - Validate `index.html`
- `pnpm run validate:all` - Validate `index.html` and `dist/index.html`
- `pnpm run check:links` - Verify local links in generated HTML
- `pnpm test` - Run parser tests
- `pnpm run deploy-preview` - Build and preview `dist/`

## Deployment

GitHub Actions workflow in `.github/workflows/deploy.yml`:

- Triggers on pushes and pull requests to `main`/`master`
- Installs dependencies with `pnpm install --frozen-lockfile`
- Runs tests
- Runs full build and validation checks
- Deploys `dist/` to GitHub Pages on branch pushes

## Project Structure

```text
rahulballal.github.io/
|-- raw/resume.md
|-- templates/resume.ejs
|-- scripts/generate-resume.js
|-- scripts/check-links.js
|-- index.html
|-- dist/
|-- test/
`-- .github/workflows/deploy.yml
```
