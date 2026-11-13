import { Link, useParams } from 'react-router-dom';
import { site } from '/content/site.js';
import { getPost, formatDate, readingTime } from '../lib/content.js';
import { useMeta } from '../lib/hooks.js';
import Prose from '../components/Prose.jsx';
import NotFound from './NotFound.jsx';

/** One article, built from a file in content/writing. */
export default function WritingDetail() {
  const { slug } = useParams();
  const post = getPost(slug);
  useMeta(post ? `${post.title} · ${site.name}` : `Not found · ${site.name}`, post?.summary);
  if (!post) return <NotFound />;

  return (
    <article className="page page--article">
      <header className="container page__head page__head--article">
        <Link to="/#writing" className="arrow-link page__back">
          <span aria-hidden="true">←</span> All writing
        </Link>
        <div className="label label--gold page__kicker">
          {formatDate(post.date)} · {readingTime(post.words)}
        </div>
        <h1 className="page__title page__title--article">{post.title}</h1>
        <p className="page__summary">{post.summary}</p>
        <div className="byline">
          <span>{site.name}, {site.credential}</span>
          {post.tags?.length > 0 && (
            <span className="chips">
              {post.tags.map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </span>
          )}
        </div>
      </header>
      <div className="container page__body page__body--article">
        <Prose blocks={post.blocks} />
      </div>
    </article>
  );
}
