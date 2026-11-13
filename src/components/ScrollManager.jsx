import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the top on a page change, or to the section named in the
 * address (e.g. /#work) once that section exists on the page.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      toTop();
      // Once more on the next frame, in case a smooth scroll was still in flight.
      const frame = requestAnimationFrame(toTop);
      return () => cancelAnimationFrame(frame);
    }
    let tries = 0;
    let timer;
    const go = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ behavior: tries === 0 ? 'smooth' : 'instant', block: 'start' });
      } else if (tries++ < 20) {
        timer = setTimeout(go, 50);
      }
    };
    timer = setTimeout(go, 0);
    return () => clearTimeout(timer);
    // `key` changes on every navigation, so clicking a link to the section
    // you are already on (for example "Work" twice) scrolls there again.
  }, [pathname, hash, key]);

  return null;
}
