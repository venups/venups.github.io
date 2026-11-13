import { site } from '/content/site.js';
import { experience, education, licensure } from '/content/career.js';
import { awards, publications, talks, service } from '/content/recognition.js';
import { skills } from '/content/skills.js';
import { Link } from 'react-router-dom';
import { asset, getWork } from '../lib/content.js';
import { useMeta } from '../lib/hooks.js';
import CaseLink from '../components/CaseLink.jsx';

/**
 * Experience.jsx: the web résumé. It prints cleanly, so "Print or save as PDF"
 * gives visitors a PDF without one having to be uploaded.
 */
export default function Experience() {
  useMeta(`Experience · ${site.name}, ${site.credential}`, `Experience, education and credentials of ${site.name}, ${site.credential}, ${site.title}.`);

  return (
    <article className="page cv">
      <header className="container page__head">
        <div className="label label--gold page__kicker">Résumé</div>
        <h1 className="page__title">
          {site.name}, {site.credential}
        </h1>
        <p className="page__summary">{site.resumeSummary}</p>
        <div className="cv__actions">
          {site.resumeFile ? (
            <a className="btn btn--solid" href={asset(site.resumeFile)} download>
              Download PDF
            </a>
          ) : (
            <button className="btn btn--solid" onClick={() => window.print()}>
              Print or save as PDF
            </button>
          )}
          <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
        </div>
        <p className="cv__contact">
          {site.location} · <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.linkedin}>linkedin.com/in/venu-pokuri</a> · <a href={site.url}>venups.github.io</a>
        </p>
      </header>

      <div className="container cv__body">
        <section className="cv__section">
          <h2 className="cv__h">Experience</h2>
          {experience.map((job) => (
            <div className="job" key={job.org + job.dates}>
              <div className="job__head">
                <div>
                  <h3 className="job__org">{job.org}</h3>
                  <div className="job__title">{job.title}</div>
                </div>
                <div className="job__when">
                  <div>{job.dates}</div>
                  <div>{job.location}</div>
                </div>
              </div>
              {job.progression && <p className="job__progression">{job.progression}</p>}
              {job.groups.map((g, i) => (
                <div key={i} className="job__group">
                  {g.label && <div className="label job__group-label">{g.label}</div>}
                  <ul className="bullets">
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {job.caseStudies?.some(getWork) && (
                <p className="job__cases">
                  <span className="label">Case studies</span>
                  {job.caseStudies.map(getWork).filter(Boolean).map((w) => (
                    <Link key={w.slug} to={`/work/${w.slug}`}>
                      {w.title}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          ))}
        </section>

        <section className="cv__section">
          <h2 className="cv__h">Education</h2>
          <div className="cv__cols">
            {education.map((e) => (
              <div key={e.degree} className="cv__entry">
                <strong>{e.degree}</strong>
                <span>{e.school}</span>
                <span className="muted">{e.detail}</span>
                {e.note && <p>{e.note}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="cv__section">
          <h2 className="cv__h">Licensure and training</h2>
          <ul className="ledger ledger--plain">
            {licensure.map((l) => (
              <li key={l.name}>
                <span>
                  <strong>{l.name}</strong>
                  <em>{l.detail}</em>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="cv__section">
          <h2 className="cv__h">Skills</h2>
          <div className="toolbox">
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
          </div>
        </section>

        <section className="cv__section">
          <h2 className="cv__h">Awards</h2>
          <ul className="ledger">
            {awards.map((a) => (
              <li key={a.name}>
                <span className="ledger__year">{a.year}</span>
                <span>
                  <strong>{a.name}</strong>
                  <em>{a.by}</em>
                  <CaseLink slug={a.related} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="cv__section">
          <h2 className="cv__h">Publications and talks</h2>
          <ul className="ledger">
            {publications.map((p) => (
              <li key={p.title}>
                <span className="ledger__year">{p.year}</span>
                <span>
                  <strong>{p.title}</strong>
                  <em>
                    {p.authors} {p.venue}
                  </em>
                  <CaseLink slug={p.related} />
                </span>
              </li>
            ))}
            {talks.map((t) => (
              <li key={t.title + t.where}>
                <span className="ledger__year">{t.year}</span>
                <span>
                  <strong>{t.title}</strong>
                  <em>{t.where}</em>
                  <CaseLink slug={t.related} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="cv__section">
          <h2 className="cv__h">Professional service</h2>
          <ul className="ledger ledger--plain">
            {service.map((s) => (
              <li key={s.name}>
                <span>
                  <strong>{s.name}</strong>
                  <em>{s.role}</em>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
