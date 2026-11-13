/**
 * scripts/check-pages.mjs: runs as the second half of `npm run check`.
 *
 * Draws every page of the site once, without a browser, and then follows
 * every link it finds. It reports:
 *
 *   - a page that fails to draw (the mistake that shows up as a blank screen)
 *   - a link that points to a page that does not exist
 *   - a link to a section (such as /#work) that is not on the page
 *
 * The deploy workflow runs this before publishing, so a broken page or a
 * broken link stops the deploy instead of reaching the live site.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vite = await createServer({ root, logLevel: 'error', appType: 'custom', server: { middlewareMode: true, hmr: false, ws: false } });
const problems = [];

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
  const { work, writing } = await vite.ssrLoadModule('/src/lib/content.js');

  const quiet = console.error;
  const draw = (route) => {
    console.error = () => {}; // React repeats the error we already report below
    try {
      return renderToString(createElement(StaticRouter, { location: route }, createElement(App)));
    } finally {
      console.error = quiet;
    }
  };

  const routes = ['/', '/experience', ...work.map((w) => `/work/${w.slug}`), ...writing.map((p) => `/writing/${p.slug}`)];
  const pages = new Map(); // route -> { html, ids }

  for (const route of routes) {
    try {
      const html = draw(route);
      if (html.includes('class="page notfound"')) problems.push(`${route}: shows the "not found" page`);
      if (!/<h1[\s>]/.test(html)) problems.push(`${route}: has no main heading`);
      pages.set(route, { html, ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])) });
    } catch (err) {
      problems.push(`${route}: the page fails to draw (${err.message})`);
    }
  }

  // An unknown address must give the 404 page, not an error.
  try {
    if (!draw('/work/no-such-page').includes('notfound')) problems.push('/work/no-such-page: should show the "not found" page');
  } catch (err) {
    problems.push(`The "not found" page fails to draw (${err.message})`);
  }

  let links = 0;
  for (const [route, page] of pages) {
    for (const [, raw] of page.html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
      const href = raw.replace(/&amp;/g, '&');
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      links += 1;
      const [to, hash] = href.split('#');
      const target = to === '' ? route : to.replace(/(.)\/$/, '$1');
      if (/\.[a-z0-9]{2,5}$/i.test(target)) continue; // a file such as /resume.pdf, checked by check-content
      if (!pages.has(target)) {
        problems.push(`${route}: link to "${href}" goes to a page that does not exist`);
      } else if (hash && !pages.get(target).ids.has(hash)) {
        problems.push(`${route}: link to "${href}" names a section (#${hash}) that is not on that page`);
      }
    }
  }

  console.log(`Drew ${pages.size} of ${routes.length} pages and followed ${links} internal links.`);
} finally {
  await vite.close();
}

if (problems.length) {
  console.log(`\n${problems.length} thing(s) to fix:\n` + [...new Set(problems)].map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log('Every page draws and every internal link has somewhere to go.');
