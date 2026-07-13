# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is pnpm (`packageManager: pnpm@11.4.0`).

- `pnpm install` — install dependencies
- `pnpm run dev` — start Astro dev server (opens browser)
- `pnpm run build` — `astro build` then `pnpm run validate` (html-validate against `dist/`)
- `pnpm run build:gh-pages` — build only, skips validation (used if you need dist/ without linting)
- `pnpm run preview` / `pnpm run serve:dist` — preview the built `dist/` output
- `pnpm run validate` — run `html-validate` on `dist/**/*.html` (rules in `.htmlvalidate.json`)
- `pnpm test` — runs `node --test`; there are currently no `*.test.*` files in the repo, so this is a no-op until tests are added

There is no separate lint/typecheck script; Astro's own build performs type-checking of `.astro`/`.ts` files.

## Architecture

This is a static site built with **Astro** (output: static, `build.format: 'directory'`), deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`/`master`.

### Two independent content pipelines

1. **Resume ("About" page)** — `raw/resume.md` is the single source of truth for personal/resume content. It is NOT an Astro content collection; it's read directly from disk with `fs.readFileSync` in `src/pages/index.astro` and `src/pages/about.astro`, then parsed by a hand-written markdown-token parser in `src/lib/parse-resume.ts` (uses `marked`'s `lexer()` to walk tokens and build a structured `ResumeData` object: personal info, and typed sections — `simple`, `skills`, `employment`, `podcasts`, `education`, `certifications`, `languages`). The parser is regex-heavy and depends on specific markdown conventions in `raw/resume.md` (e.g. `**Company** • Location` / `*dates*` patterns, H3 = section, H4 = subsection/job/podcast). If you add a new resume section type, you must extend `SECTION_ICONS`, the `Section['type']` union, the parsing switch in `parseResume`, the render branches in `src/pages/about.astro`, and likely `src/components/Icon.astro`.

2. **Blog** — Markdown files in `src/content/blog/*.md`. Although `src/content.config.ts` defines an Astro content collection (`blog`) with a Zod schema, the actual pages (`src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`) do NOT use `getCollection()` — they use a custom loader in `src/lib/load-blog-posts.ts` that reads the directory with `fs.readdirSync`/`readFileSync` and hand-parses YAML-like frontmatter with regex (not a real YAML parser — supports simple `key: value`, `[a, b]` arrays, booleans, and quoted strings only). Draft posts (`draft: true`) are filtered out by `loadAllPosts()`. Post bodies are rendered via `src/lib/render-markdown.ts`, a `unified`/`remark`/`rehype` pipeline with `rehype-mermaid` (```mermaid code blocks → inline SVG at build time, zero client JS) and `allowDangerousHtml: true`.

Both pipelines exist in parallel and are not unified — be aware that `content.config.ts`'s schema is currently unenforced dead-ish scaffolding rather than the live data path for blog posts.

### Pages and layouts

- `src/pages/index.astro` — landing page with two cards linking to `/about` and `/blog`.
- `src/pages/about.astro` — renders parsed `raw/resume.md` (hero + personal info + typed sections).
- `src/pages/blog/index.astro` — blog listing.
- `src/pages/blog/[...slug].astro` — individual post pages, statically generated via `getStaticPaths()` from `loadAllPosts()`.
- `src/layouts/base.astro` — root HTML shell: meta tags, OpenGraph/Twitter cards, JSON-LD `Person` schema, favicon/manifest links, imports `src/styles/global.css`.
- `src/layouts/blog.astro` — wraps `base.astro`, adds the Home/About/Blog nav used on about/blog pages.
- `src/components/Icon.astro` — inlined Feather icons (SVG) keyed by name, used for resume section headers; zero runtime JS.

### Styling

Single global stylesheet at `src/styles/global.css`, ANTD-inspired design system (see `DESIGN.md` for full color palette, spacing, and component conventions). No CSS framework, no JS on the client — the whole site renders to static HTML/CSS at build time (mermaid diagrams included).

### Validation

`.htmlvalidate.json` extends `html-validate:recommended` with a custom `no-inline-style` allowlist (`display`, `line-height`, `max-width`, `stroke-dasharray`, `stroke-width`, `text-align`, `white-space`) — needed because inline Mermaid SVGs and a few components use inline styles for these properties. `pnpm run build` always runs this validator against `dist/`; a build isn't "done" until it passes.
