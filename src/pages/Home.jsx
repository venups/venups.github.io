import { useState } from 'react';
import { Link } from 'react-router-dom';
import { site, proof, disciplines } from '/content/site.js';
import { path } from '/content/career.js';
import { awards, publications, talks } from '/content/recognition.js';
import { skills } from '/content/skills.js';
import { work, stories, writing, getWork, formatDate, readingTime, KIND_LABEL } from '../lib/content.js';
import { useMeta } from '../lib/hooks.js';
import BridgeScene from '../components/BridgeScene.jsx';
import Figure from '../components/Figure.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHead from '../components/SectionHead.jsx';
import WorkCard from '../components/WorkCard.jsx';

/**
 * Home.jsx: the landing page. Each <section> below is one chapter of the
 * story, in the order a visitor reads it:
 *
 *   Hero → proof → two disciplines → flagship → work → results
 *        → career path → recognition → writing → toolbox → (contact, in Footer)
 *
 * The words come from /content. This file only arranges them.
 */
export default function Home() {
  useMeta(`${site.name}, ${site.credential} · Bridge Engineering and AI`, site.description);
  const [filter, setFilter] = useState('all');

  const flagship = getWork('steel-bridge-pal') || work.find((w) => w.featured) || work[0];
  const shown = work.filter((w) => filter === 'all' || w.kind === filter);

  const showWork = (kind) => () => {
    setFilter(kind);
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="hero">
        <BridgeScene />
        <div className="hero__content container">
          <p className="hero__kicker label label--gold">{site.kicker}</p>
          <h1 className="hero__name">
            {site.name}
            <span className="hero__cred">, {site.credential}</span>
          </h1>
          <p className="hero__tagline">
            {site.tagline} <em>{site.taglineAccent}</em>
          </p>
          <div className="hero__actions">
            <Link to="/#work" className="btn btn--solid">
              See the work
            </Link>
            <Link to="/experience" className="btn">
              Résumé
            </Link>
          </div>
        </div>
        <div className="hero__foot container">
          <span className="label">{site.heroCaption}</span>
          <span className="label hero__hint">{site.heroHint}</span>
        </div>
      </section>

      {/* ── Proof strip ────────────────────────────────────────────── */}
      <section className="proof" aria-label="At a glance">
        <div className="container proof__grid">
          {proof.map((p, i) => (
            <Reveal key={p.label} className="proof__item" delay={i * 80}>
              <div className="proof__value">
                {p.value}
                {p.unit && <span>{p.unit}</span>}
              </div>
              <div className="proof__label">{p.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 01 Two disciplines ─────────────────────────────────────── */}
      <section className="section section--flush" id="about">
        <div className="container">
          <SectionHead num="01" label="Profile" title={<>Two disciplines. <em>One engineer.</em></>} lead={disciplines.lead} />
          <div className="duo">
            {[disciplines.left, disciplines.right].map((col, i) => (
              <Reveal key={col.label} className="duo__col" delay={i * 120}>
                <div className="duo__label label label--gold">{col.label}</div>
                <h3 className="duo__heading">{col.heading}</h3>
                <dl className="duo__list">
                  {col.items.map((it) => (
                    <div key={it.term} className="duo__item">
                      <dt>{it.term}</dt>
                      <dd>{it.body}</dd>
                    </div>
                  ))}
                </dl>
                <button className="arrow-link" onClick={showWork(col.link.filter)}>
                  {col.link.label} <span aria-hidden="true">→</span>
                </button>
              </Reveal>
            ))}
          </div>
          <Reveal className="joint">
            <div className="joint__mark" aria-hidden="true">
              <svg viewBox="0 0 120 40" width="120" height="40">
                <path d="M0 20H44M76 20H120" className="i" />
                <circle cx="60" cy="20" r="13" className="g" />
                <circle cx="60" cy="20" r="3" className="gf" />
              </svg>
            </div>
            <div className="label">{disciplines.joint.label}</div>
            <p className="joint__body">{disciplines.joint.body}</p>
          </Reveal>
        </div>
      </section>

      {/* ── 02 Flagship ────────────────────────────────────────────── */}
      {flagship && (
        <section className="flagship" id="flagship">
          <div className="container flagship__grid">
            <Reveal className="flagship__text">
              <div className="label flagship__label">02 · Flagship · {flagship.status}</div>
              <h2 className="flagship__title">{flagship.title}</h2>
              <p className="flagship__summary">{flagship.summary}</p>
              <p className="flagship__role">
                <span className="label">Role</span> {flagship.role}
              </p>
              <Link to={`/work/${flagship.slug}`} className="btn flagship__btn">
                Read the case study
              </Link>
            </Reveal>
            <Reveal className="flagship__plate" delay={120}>
              <Figure type={flagship.figure} cover={flagship.cover} alt={flagship.title} />
            </Reveal>
          </div>
          {flagship.metrics?.length > 0 && (
            <div className="container">
              <div className="flagship__stats">
                {flagship.metrics.map((mtr, i) => (
                  <Reveal key={mtr.label} className="flagship__stat" delay={i * 80}>
                    <strong>{mtr.value}</strong>
                    <span>{mtr.label}</span>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── 03 Work ────────────────────────────────────────────────── */}
      <section className="section section--flush" id="work">
        <div className="container">
          <SectionHead
            num="03"
            label="Selected work"
            title={<>Bridges that stand. <em>Tools that ship.</em></>}
            lead="Each case study states the problem, my role, and what was delivered. Filter by discipline, or read them in order."
          >
            <div className="filter" role="group" aria-label="Filter work">
              {[
                ['all', `All (${work.length})`],
                ['bridge', `${KIND_LABEL.bridge} (${work.filter((w) => w.kind === 'bridge').length})`],
                ['software', `${KIND_LABEL.software} (${work.filter((w) => w.kind === 'software').length})`],
              ].map(([key, label]) => (
                <button key={key} className={`filter__btn ${filter === key ? 'is-active' : ''}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>
                  {label}
                </button>
              ))}
            </div>
          </SectionHead>
          <div className="work-grid">
            {shown.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 3) * 90}>
                <WorkCard item={item} index={work.indexOf(item)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 Results ─────────────────────────────────────────────── */}
      <section className="section" id="results">
        <div className="container">
          <SectionHead
            num="04"
            label="Results"
            title={<>Results <em>you can count.</em></>}
            lead="Short stories from real projects, each anchored to a number."
          />
          <div className="stories">
            {stories.map((s, i) => (
              <Reveal key={s.slug} as="article" className="story" delay={(i % 3) * 90}>
                <div className="story__metric">{s.metric}</div>
                <h3 className="story__title">{s.title}</h3>
                <div className="story__body" dangerouslySetInnerHTML={{ __html: s.blocks.map((b) => b.html || '').join('') }} />
                <div className="story__foot">
                  <span className="label">{s.context}</span>
                  {s.related && getWork(s.related) && (
                    <Link to={`/work/${s.related}`} className="arrow-link">
                      Case study <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 Path ────────────────────────────────────────────────── */}
      <section className="section" id="path">
        <div className="container">
          <SectionHead
            num="05"
            label="Career path"
            title={<>Two threads, <em>since 2009.</em></>}
            lead="At every stop there was a structure to design and a tool to build. Read the left line for the engineering and the right line for the software."
          />
          <div className="path">
            <div className="path__legend" aria-hidden="true">
              <span />
              <span className="label">Structures</span>
              <span className="label label--gold">Systems</span>
            </div>
            {path.map((stop, i) => (
              <Reveal key={stop.years} className={`path__row ${stop.current ? 'is-current' : ''}`} delay={i * 60}>
                <div className="path__when">
                  <div className="path__years">{stop.years}</div>
                  <div className="path__place">{stop.place}</div>
                  <div className="path__role">{stop.role}</div>
                </div>
                <p className="path__structures">{stop.structures}</p>
                <p className="path__systems">{stop.systems}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="path__more">
            <Link to="/experience" className="btn">
              Full experience and education
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── 06 Recognition ─────────────────────────────────────────── */}
      <section className="section" id="recognition">
        <div className="container">
          <SectionHead num="06" label="Recognition" title={<>Awards, papers <em>and talks.</em></>} />
          <div className="recog">
            <Reveal className="recog__col">
              <h3 className="recog__h label">Awards</h3>
              <ul className="ledger">
                {awards.map((a) => (
                  <li key={a.name}>
                    <span className="ledger__year">{a.year}</span>
                    <span>
                      <strong>{a.name}</strong>
                      <em>{a.by}</em>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="recog__col" delay={100}>
              <h3 className="recog__h label">Publications</h3>
              <ul className="ledger">
                {publications.map((p) => (
                  <li key={p.title}>
                    <span className="ledger__year">{p.year}</span>
                    <span>
                      <strong>{p.title}</strong>
                      <em>
                        {p.authors} {p.venue}
                      </em>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="recog__col" delay={200}>
              <h3 className="recog__h label">Talks</h3>
              <ul className="ledger">
                {talks.map((t) => (
                  <li key={t.title + t.where}>
                    <span className="ledger__year">{t.year}</span>
                    <span>
                      <strong>{t.title}</strong>
                      <em>{t.where}</em>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 07 Writing ─────────────────────────────────────────────── */}
      {writing.length > 0 && (
        <section className="section" id="writing">
          <div className="container">
            <SectionHead num="07" label="Writing" title={<>Notes from <em>the crossing.</em></>} lead="What I am learning as I move between structural engineering and AI." />
            <div className="posts">
              {writing.map((post, i) => (
                <Reveal key={post.slug} delay={i * 90}>
                  <Link to={`/writing/${post.slug}`} className="post-card">
                    <Figure type={post.figure || 'chart'} cover={post.cover} alt={post.title} className="post-card__plate" />
                    <div className="post-card__body">
                      <div className="label">
                        {formatDate(post.date)} · {readingTime(post.words)}
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.summary}</p>
                      <span className="arrow-link">
                        Read the post <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 08 Toolbox ─────────────────────────────────────────────── */}
      <section className="section" id="toolbox">
        <div className="container">
          <SectionHead num="08" label="Toolbox" title={<>Standards, software <em>and code.</em></>} />
          <Reveal className="toolbox">
            {skills.map((g) => (
              <div className="toolbox__row" key={g.group}>
                <div className="toolbox__group">{g.group}</div>
                <div className="chips">
                  {g.items.map((s) => (
                    <span key={s.name} className={`chip ${s.core ? 'chip--core' : ''}`}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="toolbox__key label">
              <span className="chip chip--core">Primary</span>
              <span className="chip">Also proficient</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
