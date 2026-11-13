import { Link } from 'react-router-dom';
import { site } from '/content/site.js';
import Reveal from './Reveal.jsx';

/** The dark contact band and the footer line, shown on every page. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <Reveal className="contact">
          <div className="label contact__label">Contact</div>
          <h2 className="contact__heading">{site.contactHeading}</h2>
          <p className="contact__body">{site.contactBody}</p>
          <div className="contact__actions">
            {site.email && (
              <a className="btn contact__btn contact__btn--solid" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            )}
            {site.linkedin && (
              <a className="btn contact__btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            )}
            {site.github && (
              <a className="btn contact__btn" href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            )}
          </div>
        </Reveal>

        <div className="footer__line">
          <span>
            © {year} {site.name}, {site.credential} · {site.location}
          </span>
          <span className="footer__links">
            <Link to="/#work">Work</Link>
            <Link to="/#writing">Writing</Link>
            <Link to="/experience">Experience</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
