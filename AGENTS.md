# AGENTS.md

This file documents automated agents and helper tooling for this repository. It covers three scopes: GitHub Actions / CI agents, local developer helper scripts, and assistant/Copilot agents.

## Overview

- Repo type: static resume website (index.html) with minimal build that copies files into `dist/`.
- Primary developer commands live in package.json (see `npm run` scripts).

## Agent inventory

### 1) CI / GitHub Actions
- Purpose: validate HTML, build artifacts (dist/), and optionally deploy to GitHub Pages.
- How to run locally: `npm install && npm run build && npm run validate`.
- Recommended workflow (summary):
  - Trigger: push, pull_request
  - Jobs: checkout, setup-node, npm ci, npm run build, npm run validate, optionally deploy `dist/` to `gh-pages` using a deploy action and a secret token (e.g., `GH_PAGES_TOKEN`).

### 2) Local developer helper scripts
- Purpose: run a dev server, preview build output, and run validation/linting.
- Useful scripts from package.json:
  - `npm run dev` — start http-server on port 3000 (cache disabled)
  - `npm start` — start server and open browser
  - `npm run build` — clean + copy files + validate
  - `npm run serve:dist` — preview `dist/` on port 8080
  - `npm run lint:html` / `npm run validate` — run HTML linting and validation
- Typical workflow:
  - `npm install`
  - `npm run dev` (iterate)
  - `npm run build && npm run serve:dist` (preview production output)

### 3) Assistant / Copilot agents
- Purpose: document repeatable AI-assisted tasks like drafting PR descriptions, generating release notes, or producing content updates.
- For each assistant agent, store a short template showing:
  - Intent (one-line)
  - Trigger (manual / PR / schedule)
  - Prompt template (exact prompt)
  - Example input and expected output
  - Owner / reviewer
- Example template: "Draft PR description"
  - Intent: Create a clear PR summary and checklist
  - Prompt template: "Given these changes (list), produce a PR title, one-paragraph summary, and a checklist for reviewers including testing steps and accessibility notes."
  - Owner: repo maintainer

## Conventions
- Name GitHub workflows clearly (e.g., `ci.yml`, `deploy-gh-pages.yml`).
- Keep agent prompts and examples in this repo for reproducibility.
- Use existing npm scripts in examples to avoid drift.

## Security and secrets
- Never store secrets in the repository. Use GitHub Secrets for CI (e.g., `GH_PAGES_TOKEN`).
- Document required secret names in this file when used by workflows.

## Ownership
- Owner: Rahul Ballal <rahulballal@gmail.com>
- Maintain agent prompts and workflows in this repo; open issues/PRs for changes.

## Example GitHub Actions job (summary)

- Job: `validate-and-build`
  - Runs-on: ubuntu-latest
  - Steps:
    1. actions/checkout@v3
    2. actions/setup-node@v4 (node-version: 18)
    3. npm ci
    4. npm run build
    5. npm run validate
    6. Optional: deploy `dist/` to `gh-pages` using deploy action and `GH_PAGES_TOKEN` secret

## Next steps
- Add this file to the repo (done).
- If desired, add a demonstration GitHub Actions workflow (CI) that uses `npm run build` and `npm run validate` and deploys to GitHub Pages.
- Add sample assistant prompts under `.github/assistant-prompts/` for reuse.
