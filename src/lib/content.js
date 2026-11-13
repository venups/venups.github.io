const KIND_LABEL = { bridge: 'Bridge', software: 'Software' };

function loadCollection(modules, { includeDrafts = false } = {}) {
  return Object.entries(modules)
    .map(([path, module]) => {
      const slug = path.split('/').pop().replace(/\.md$/, '');
      const { meta, blocks = [], words = 0 } = module.default;
      return { ...meta, slug, blocks, words };
    })
    .filter((item) => item.slug !== '_template' && (includeDrafts || !item.draft))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.slug.localeCompare(b.slug));
}

export const work = loadCollection(import.meta.glob('/content/work/*.md', { eager: true }));
export const stories = loadCollection(import.meta.glob('/content/stories/*.md', { eager: true }));
export const writing = loadCollection(import.meta.glob('/content/writing/*.md', { eager: true })).sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

export { KIND_LABEL };

export function getWork(slug) {
  return work.find((item) => item.slug === slug);
}

export function getPost(slug) {
  return writing.find((item) => item.slug === slug);
}

export function workNeighbours(slug) {
  const index = work.findIndex((item) => item.slug === slug);
  return {
    prev: index > 0 ? work[index - 1] : null,
    next: index >= 0 && index < work.length - 1 ? work[index + 1] : null,
  };
}

export function formatDate(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function readingTime(words = 0) {
  return `${Math.max(1, Math.ceil(Number(words) / 220))} min read`;
}

export function asset(path = '') {
  if (!path) return '';
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
}
