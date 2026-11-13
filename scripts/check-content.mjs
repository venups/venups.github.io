/**
 * scripts/check-content.mjs: run with `npm run check`.
 * Reads every file in /content and reports the mistakes that are easy to make:
 * a missing title, an unknown figure name, a cover image that does not exist,
 * a story that points at a case study that is not there.
 */
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fm from 'front-matter';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIGURES = ['suspension', 'curved-girder', 'viaduct', 'interchange', 'jacking', 'through-girder', 'land-bridge', 'skew-deck', 'pipeline', 'suite', 'code', 'chart', 'girder'];
const problems = [];
const exists = (p) => access(p).then(() => true, () => false);

async function load(folder) {
  const dir = path.join(root, 'content', folder);
  const out = [];
  for (const file of (await readdir(dir)).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    try {
      const { attributes, body } = fm(await readFile(path.join(dir, file), 'utf8'));
      out.push({ file: `content/${folder}/${file}`, slug: file.replace(/\.md$/, ''), a: attributes, body });
    } catch (err) {
      problems.push(`content/${folder}/${file}: the front matter could not be read (${err.reason || err.message})`);
    }
  }
  return out;
}

const work = await load('work');
const stories = await load('stories');
const writing = await load('writing');

async function common(item, required) {
  for (const key of required) if (!item.a[key]) problems.push(`${item.file}: missing "${key}"`);
  if (!/^[a-z0-9-]+$/.test(item.slug)) problems.push(`${item.file}: file names should use lowercase letters, numbers and hyphens only`);
  if (item.a.figure && !FIGURES.includes(item.a.figure)) problems.push(`${item.file}: unknown figure "${item.a.figure}". Choose one of: ${FIGURES.join(', ')}`);
  if (item.a.cover && !/^https?:/.test(item.a.cover) && !(await exists(path.join(root, 'public', item.a.cover)))) {
    problems.push(`${item.file}: cover image not found at public${item.a.cover}`);
  }
  for (const m of item.body.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)/g)) {
    if (!(await exists(path.join(root, 'public', m[1])))) problems.push(`${item.file}: image not found at public${m[1]}`);
  }
}

for (const w of work) {
  await common(w, ['title', 'kind', 'summary']);
  if (w.a.kind && !['bridge', 'software'].includes(w.a.kind)) problems.push(`${w.file}: kind must be "bridge" or "software"`);
}
for (const s of stories) {
  await common(s, ['metric', 'title']);
  if (s.a.related && !work.some((w) => w.slug === s.a.related)) problems.push(`${s.file}: related "${s.a.related}" does not match any file in content/work`);
}
for (const p of writing) {
  await common(p, ['title', 'date', 'summary']);
  if (p.a.date && Number.isNaN(new Date(p.a.date).getTime())) problems.push(`${p.file}: date should look like 2026-11-12`);
}

console.log(`Checked ${work.length} case studies, ${stories.length} stories, ${writing.length} articles.`);
if (problems.length) {
  console.log(`\n${problems.length} thing(s) to fix:\n` + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log('Everything looks good.');
