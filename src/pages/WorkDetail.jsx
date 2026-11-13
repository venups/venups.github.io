import { Link, useParams } from 'react-router-dom';
import { site } from '/content/site.js';
import { getWork, workNeighbours, KIND_LABEL } from '../lib/content.js';
import { useMeta } from '../lib/hooks.js';
import Figure from '../components/Figure.jsx';
import Prose from '../components/Prose.jsx';
import Reveal from '../components/Reveal.jsx';
import NotFound from './NotFound.jsx';

/** One case study, built from a file in content/work. */
export default function WorkDetail() {
  const { slug } = useParams();
  const item = getWork(slug);
  useMeta(item ? `${item.title} · ${site.name}` : `Not found · ${site.name}`, item?.summary);
  if (!item) return <NotFound />;

  const { prev, next } = workNeighbours(slug);
  const facts = [
    ['Role', item.role],
    ['Client', item.client],
    ['Firm', item.firm],
    ['Period', item.period],
    ['Location', item.location],
  ].filter(([, v]) => v);

  return (
    <article className="page">
      <header className="container page__head">
        <Link to="/#work" className="arrow-link page__back">
          <span aria-hidden="true">←</span> All work
        </Link>
        <div className="label label--gold page__kicker">
          {KIND_LABEL[item.kind] || item.kind}
          {item.status ? ` · ${item.status}` : ''}
        </div>
        <h1 className="page__title">{item.title}</h1>
        <p className="page__summary">{item.summary}</p>
        {facts.length > 0 && (
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <div className="container">
        <Reveal>
          <Figure type={item.figure} cover={item.cover} alt={item.title} className="page__plate" caption={item.cover ? item.coverCaption : undefined} />
        </Reveal>
      </div>

      {item.metrics?.length > 0 && (
        <div className="metrics">
          <div className="container metrics__grid">
            {item.metrics.map((m) => (
              <div key={m.label} className="metrics__item">
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container page__body">
        <Prose blocks={item.blocks} />
        <aside className="page__aside">
          {item.tags?.length > 0 && (
            <div>
              <div className="label">Topics</div>
              <div className="chips">
                {item.tags.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {item.links?.length > 0 && (
            <div>
              <div className="label">Links</div>
              <ul className="page__links">
                {item.links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <nav className="container pager" aria-label="More work">
        <Link to={`/work/${prev.slug}`} className="pager__link">
          <span className="label">← Previous</span>
          <span className="pager__title">{prev.title}</span>
        </Link>
        <Link to={`/work/${next.slug}`} className="pager__link pager__link--next">
          <span className="label">Next →</span>
          <span className="pager__title">{next.title}</span>
        </Link>
      </nav>
    </article>
  );
}
