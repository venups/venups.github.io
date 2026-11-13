import Reveal from './Reveal.jsx';

/** The numbered heading at the top of each home-page section. */
export default function SectionHead({ num, label, title, lead, children }) {
  return (
    <Reveal className="section-head">
      <div className="section-head__kicker label">
        {num && <span className="section-head__num">{num}</span>}
        <span>{label}</span>
      </div>
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </Reveal>
  );
}
