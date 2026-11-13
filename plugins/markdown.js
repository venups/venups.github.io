/**
 * plugins/markdown.js: turns every content/*.md file into a JavaScript module
 * at build time, so the browser never has to parse Markdown.
 *
 *   import post from '/content/writing/my-post.md'
 *   post.meta    -> the front matter (the block between the --- lines)
 *   post.blocks  -> the body, as [{ type: 'html', html }, { type: 'widget', name }]
 *   post.words   -> word count (used for "6 min read")
 *
 * Two small extensions to plain Markdown:
 *   1. An image on its own line becomes a captioned figure:
 *        ![Caption shown under the picture](/images/work/my-project/photo.jpg)
 *   2. A line that reads [[widget:name]] drops an interactive React component
 *      into the article (see src/widgets/index.js for the available names).
 */
import fm from 'front-matter';
import { Marked } from 'marked';

const WIDGET = /^\[\[widget:([a-z0-9-]+)\]\]\s*$/gm;

function escapeHtml(s = '') {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function makeMarked(base) {
  const withBase = (href = '') => (href.startsWith('/') && !href.startsWith('//') ? base.replace(/\/$/, '') + href : href);
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      image({ href, title, text }) {
        const caption = title || text;
        return `<figure class="prose-figure"><img src="${withBase(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async" />${
          caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''
        }</figure>`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        return `<a href="${withBase(href)}"${title ? ` title="${escapeHtml(title)}"` : ''}${
          external ? ' target="_blank" rel="noopener noreferrer"' : ''
        }>${inner}</a>`;
      },
    },
  });
  return marked;
}

export function parseMarkdown(source, base = '/') {
  const { attributes, body } = fm(source);
  const marked = makeMarked(base);
  const blocks = [];
  let last = 0;
  let m;
  WIDGET.lastIndex = 0;
  const pushHtml = (md) => {
    if (!md.trim()) return;
    // An image alone in a paragraph should not be wrapped in <p>.
    const html = marked.parse(md).replace(/<p>(<figure[\s\S]*?<\/figure>)<\/p>/g, '$1');
    blocks.push({ type: 'html', html });
  };
  while ((m = WIDGET.exec(body))) {
    pushHtml(body.slice(last, m.index));
    blocks.push({ type: 'widget', name: m[1] });
    last = m.index + m[0].length;
  }
  pushHtml(body.slice(last));
  const words = body.replace(/[#>*_`\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return { meta: attributes, blocks, words };
}

export default function markdown() {
  let base = '/';
  return {
    name: 'portfolio-markdown',
    enforce: 'pre',
    configResolved(config) {
      base = config.base || '/';
    },
    transform(source, id) {
      if (!id.endsWith('.md')) return null;
      let parsed;
      try {
        parsed = parseMarkdown(source, base);
      } catch (err) {
        this.error(`Could not read ${id}\n${err.message}\nCheck the front matter between the --- lines (indentation and quotes).`);
      }
      return { code: `export default ${JSON.stringify(parsed)};`, map: null };
    },
  };
}
