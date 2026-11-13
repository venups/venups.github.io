import { Link } from 'react-router-dom';
import { site } from '/content/site.js';
import { useMeta } from '../lib/hooks.js';

export default function NotFound() {
  useMeta(`Page not found · ${site.name}`);
  return (
    <section className="page notfound">
      <div className="container">
        <div className="label label--gold">Error 404</div>
        <h1 className="page__title">This span is not on the drawings.</h1>
        <p className="page__summary">The page you asked for does not exist, or it has moved.</p>
        <Link to="/" className="btn btn--solid">
          Back to the start
        </Link>
      </div>
    </section>
  );
}
