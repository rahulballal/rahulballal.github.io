import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeMermaid from 'rehype-mermaid';
import rehypeStringify from 'rehype-stringify';

let processor: ReturnType<typeof createProcessor> | null = null;

function createProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeMermaid, { strategy: 'inline-svg' })
    .use(rehypeStringify, { allowDangerousHtml: true });
}

export async function renderMarkdown(content: string): Promise<string> {
  if (!processor) {
    processor = createProcessor();
  }
  const file = await processor.process(content);
  return String(file);
}
