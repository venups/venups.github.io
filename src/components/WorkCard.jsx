import { Link } from 'react-router-dom';
import Figure from './Figure.jsx';
import { KIND_LABEL } from '../lib/content.js';

/** One case study in the Work grid. */
export default function WorkCard({ item, index }) {
  return (
    <Link to={`/work/${item.slug}`} className={`work-card ${item.featured ? 'work-card--featured' : ''}`}>
      <Figure type={item.figure} cover={item.cover} alt={item.title} className="work-card__plate" />
      <div className="work-card__body">
        <div className="work-card__meta label">
          <span className="work-card__num">{String(index + 1).padStart(2, '0')}</span>
          <span>{KIND_LABEL[item.kind] || item.kind}</span>
          {item.period && <span className="work-card__period">{item.period}</span>}
        </div>
        <h3 className="work-card__title">{item.title}</h3>
        <p className="work-card__summary">{item.summary}</p>
        {item.metrics?.length > 0 && (
          <div className="work-card__metric">
            <strong>{item.metrics[0].value}</strong>
            <span>{item.metrics[0].label}</span>
          </div>
        )}
        <span className="arrow-link work-card__more">
          Read the case <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
