import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://rahulballal.github.io',

  integrations: [mdx()],
  markdown: {
    rehypePlugins: [
      [rehypeMermaid, { strategy: 'inline-svg' }],
    ],
  },
  build: {
    format: 'directory',
  },
});
