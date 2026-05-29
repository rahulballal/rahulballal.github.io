---
title: "Hello World — Building This Site with Astro"
description: "Why I migrated my resume site to Astro with Mermaid diagram support, and how the zero-JS approach keeps it fast."
pubDate: 2026-05-29
tags: ["astro", "architecture", "static-site"]
---

## Why Astro?

This site used to be a hand-rolled markdown-to-HTML pipeline: `marked` parser + EJS template + custom CSS. It worked, but adding a blog meant reinventing pagination, RSS, tag pages, and image optimization.

Astro gives all of that out of the box, with zero client JavaScript.

## Architecture

Here's the build pipeline:

```mermaid
graph LR
    A[Markdown Content] --> B[Astro Build]
    B --> C[Static HTML]
    C --> D[GitHub Pages]
    B --> E[Inline SVG Mermaid]
    B --> F[RSS Feed]
```

The `rehype-mermaid` plugin converts ` ```mermaid ` code blocks to inline SVG during the build. No browser, no JavaScript, no runtime cost.

## Component Structure

```mermaid
graph TD
    subgraph Content
        A1[resume.md]
        A2[blog/*.md]
    end
    subgraph Layout
        B1[base.astro]
        B2[blog.astro]
    end
    subgraph Pages
        C1[index.astro]
        C2[blog/index.astro]
        C3["blog/[...slug].astro"]
    end
    A1 --> C1
    A2 --> C3
    C1 --> B1
    C2 --> B2
    C3 --> B2
    C1 --> C2
```

## What's Next

- More blog posts on engineering leadership and architecture
- Tag pages and RSS feed
- Dark mode support
- Further performance optimization

Stay tuned!
