import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.resolve('src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  draft: boolean;
  body: string;
}

export function loadAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => loadPost(file))
    .filter((p): p is BlogPost => p !== null && !p.draft)
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

export function loadPost(filename: string): BlogPost | null {
  const filepath = path.join(BLOG_DIR, filename);
  const content = fs.readFileSync(filepath, 'utf-8');
  return parsePost(content, filename.replace(/\.md$/, ''));
}

export function parsePost(content: string, slug: string): BlogPost | null {
  // Parse YAML-like frontmatter between --- markers
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const frontmatter: Record<string, any> = {};
  const raw = match[1];
  const body = match[2].trim();

  // Simple YAML key:value parser
  for (const line of raw.split('\n')) {
    const colonMatch = line.match(/^(\w+):\s*(.*)$/);
    if (colonMatch) {
      let val: any = colonMatch[2].trim();
      // Parse arrays: [item1, item2]
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1'));
      }
      // Parse booleans
      else if (val === 'true') val = true;
      else if (val === 'false') val = false;
      // Parse quoted strings
      else {
        const qMatch = val.match(/^"(.*)"$/);
        if (qMatch) val = qMatch[1];
      }
      frontmatter[colonMatch[1]] = val;
    }
  }

  if (!frontmatter.title || !frontmatter.pubDate) return null;

  return {
    slug,
    title: frontmatter.title as string,
    description: (frontmatter.description as string) || '',
    pubDate: new Date(frontmatter.pubDate as string),
    tags: (frontmatter.tags as string[]) || [],
    draft: (frontmatter.draft as boolean) || false,
    body,
  };
}
