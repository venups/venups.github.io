/**
 * scripts/postbuild.mjs: runs after `vite build`.
 *
 * A static host (GitHub Pages, Azure Static Web Apps, any plain web server)
 * serves files, so every address on the site needs a real file behind it.
 * This script copies index.html to:
 *
 *   dist/work/<slug>/index.html      one per case study
 *   dist/writing/<slug>/index.html   one per article
 *   dist/experience/index.html
 *   dist/404.html                    shown for unknown addresses
 *
 * Each copy gets its own title and description, so a link pasted into
 * LinkedIn, Slack or an email shows the right preview. It also writes
 * sitemap.xml for search engines.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fm from 'front-matter';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { site } = await import(path.join(root, 'content/site.js'));

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

function render({ title, description, url }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace('</head>', `    <link rel="canonical" href="${esc(url)}" />\n    <meta property="og:url" content="${esc(url)}" />\n  </head>`);
  return html;
}

async function collection(folder) {
  const dir = path.join(root, 'content', folder);
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
  const items = [];
  for (const file of files) {
    const { attributes } = fm(await readFile(path.join(dir, file), 'utf8'));
    if (attributes.draft) continue;
    items.push({ slug: file.replace(/\.md$/, ''), ...attributes });
  }
  return items;
}

const base = site.url.replace(/\/$/, '');
const pages = [{ route: '/', title: `${site.name}, ${site.credential} · Bridge Engineering and AI`, description: site.description }];
pages.push({ route: '/experience/', title: `Experience · ${site.name}, ${site.credential}`, description: site.resumeSummary });
for (const w of await collection('work')) pages.push({ route: `/work/${w.slug}/`, title: `${w.title} · ${site.name}`, description: w.summary });
for (const p of await collection('writing')) pages.push({ route: `/writing/${p.slug}/`, title: `${p.title} · ${site.name}`, description: p.summary });

for (const page of pages) {
  const html = render({ ...page, url: base + page.route });
  const outDir = path.join(dist, page.route);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html);
}

await writeFile(path.join(dist, '404.html'), render({ title: `Page not found · ${site.name}`, description: site.description, url: base + '/' }));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
  .map((p) => `  <url><loc>${base}${p.route}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')}\n</urlset>\n`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);

console.log(`postbuild: wrote ${pages.length} pages, 404.html and sitemap.xml`);
