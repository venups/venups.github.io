import { Link } from 'react-router-dom';
import { getWork } from '../lib/content.js';

/**
 * A small "Case study →" link for an award, paper or talk.
 * `slug` is the file name of a case study in content/work (without .md).
 * Draws nothing if the slug is empty or no such case study is published.
 */
export default function CaseLink({ slug }) {
  if (!slug || !getWork(slug)) return null;
  return (
    <Link to={`/work/${slug}`} className="arrow-link ledger__link">
      Case study <span aria-hidden="true">→</span>
    </Link>
  );
}
