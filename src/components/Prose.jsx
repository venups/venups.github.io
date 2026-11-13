import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { widgets } from '../widgets/index.js';

/**
 * Prose: renders the body of a Markdown file.
 * The body arrives as blocks of ready-made HTML, with interactive widgets
 * in between (see plugins/markdown.js).
 */
export default function Prose({ blocks = [] }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  // Links to other pages of this site should not reload the whole page.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const onClick = (e) => {
      const a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = a.getAttribute('href') || '';
      if (a.target === '_blank' || !href.startsWith('/') || href.startsWith('//') || /\.[a-z0-9]{2,5}$/i.test(href)) return;
      e.preventDefault();
      navigate(base && href.startsWith(base) ? href.slice(base.length) || '/' : href);
    };
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [navigate]);

  return (
    <div className="prose" ref={ref}>
      {blocks.map((block, i) => {
        if (block.type === 'widget') {
          const Widget = widgets[block.name];
          return Widget ? (
            <div className="prose__widget" key={i}>
              <Widget />
            </div>
          ) : (
            <p key={i} className="muted">[Unknown widget: {block.name}]</p>
          );
        }
        return <div key={i} dangerouslySetInnerHTML={{ __html: block.html }} />;
      })}
    </div>
  );
}
