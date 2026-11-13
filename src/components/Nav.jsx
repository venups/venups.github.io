import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { site, nav } from '/content/site.js';
import { useTheme } from '../lib/hooks.js';

/** Fixed top bar: name, section links, theme toggle, résumé button. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const location = useLocation();

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Clicking a link to the section you are already on should still scroll there.
  const onNavClick = (to) => () => {
    setOpen(false);
    const [path, hash] = to.split('#');
    if (hash && location.pathname === (path || '/') && location.hash === `#${hash}`) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="nav__name">{site.name}</span>
          <span className="nav__cred">{site.credential}</span>
        </Link>

        <nav className="nav__links" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="nav__link" onClick={onNavClick(item.to)}>
              {item.label}
            </Link>
          ))}
          <Link to="/experience" className="btn btn--gold btn--small nav__resume">
            Résumé
          </Link>
        </nav>

        <div className="nav__tools">
          <button className="nav__theme" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="Light / dark">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              {theme === 'dark' ? (
                <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7L7 17M17 7l1.7-1.7" />
                </g>
              ) : (
                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              )}
            </svg>
          </button>
          <button className="nav__burger" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Menu">
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="nav__sheet" hidden={!open}>
        <nav className="container" aria-label="Mobile">
          {nav.map((item, i) => (
            <Link key={item.to} to={item.to} className="nav__sheet-link" onClick={onNavClick(item.to)}>
              <span className="label">{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </Link>
          ))}
          <Link to="/experience" className="nav__sheet-link">
            <span className="label">{String(nav.length + 1).padStart(2, '0')}</span>
            Résumé
          </Link>
        </nav>
      </div>
    </header>
  );
}
