/**
 * content/site.js: the words and links that appear across the whole site.
 *
 * Edit the text between the quotes, save, and the page updates.
 * Nothing here needs any knowledge of React.
 */

export const site = {
  // ── Identity ──────────────────────────────────────────────────────────
  name: 'Venu Pokuri',
  credential: 'P.E.',
  title: 'Senior Project Engineer, Bridge & Technology',
  location: 'Greater Philadelphia',
  url: 'https://venups.github.io', // used for the sitemap and link previews

  // ── Hero (the first screen) ───────────────────────────────────────────
  kicker: 'Bridge Engineering  ·  AI & Engineering Automation',
  tagline: 'I design bridges that have to hold,',
  taglineAccent: 'and build the software that helps engineers design them.',
  heroCaption: 'Fig. 01  ·  Suspension span, live-load response  ·  deflection exaggerated',
  heroHint: 'Move across the deck. You are the live load.',

  // ── Links ─────────────────────────────────────────────────────────────
  email: 'venups@hotmail.com',
  linkedin: 'https://www.linkedin.com/in/venu-pokuri/',
  github: 'https://github.com/venups',

  // Résumé button. Leave '' to send visitors to the Experience page.
  // To offer a PDF: put the file at public/resume.pdf and set this to '/resume.pdf'.
  resumeFile: '',

  // ── Contact band (bottom of every page) ───────────────────────────────
  contactHeading: 'Building something that has to hold?',
  contactBody:
    'I am glad to talk about applied AI for engineering, automation of analysis and design workflows, and bridge technology: collaborations, speaking, and new opportunities.',

  // ── Summary at the top of the Experience (résumé) page ────────────────
  resumeSummary:
    'Senior Project Engineer, Bridge & Technology at GFT. Licensed Professional Engineer with more than a decade in structural engineering, including more than seven years of U.S. bridge design, analysis and construction support. Builds the Python, C# and VBA tools and AI-enabled workflows that bridge teams use.',

  // ── Search / link-preview description ─────────────────────────────────
  description:
    'Venu Pokuri, P.E. Bridge engineer with a decade in steel and prestressed bridges, and the product owner behind Steel Bridge Pal and other AI and automation tools for bridge design.',
};

/** Top navigation. `to` is a section id on the home page or a page path.
 *  (The Résumé button, which opens the Experience page, is added automatically.) */
export const nav = [
  { label: 'Work', to: '/#work' },
  { label: 'Results', to: '/#results' },
  { label: 'Path', to: '/#path' },
  { label: 'Writing', to: '/#writing' },
  { label: 'Contact', to: '/#contact' },
];

/** The four numbers under the hero. Keep each label under about six words. */
export const proof = [
  { value: '10+', unit: 'years', label: 'in structural engineering, 7+ on U.S. bridges' },
  { value: 'P.E.', unit: '', label: 'licensed Professional Engineer' },
  { value: '≈2,000', unit: 'hours', label: 'of modeling saved across ten bridges by Steel Bridge Pal' },
  { value: '2026', unit: '', label: 'GFT Technology Innovation Award · ASHE Young Member of the Year' },
];

/** "Two disciplines, one engineer": the left and right columns on the home page. */
export const disciplines = {
  heading: 'Two disciplines. One engineer.',
  lead:
    'For more than ten years I have carried two jobs in one seat: the structural engineer who signs for the bridge, and the builder who writes the tools the team uses to design it. In 2026 the title caught up: Senior Project Engineer, Bridge & Technology.',
  left: {
    label: 'Structures',
    heading: 'What bridge teams know me for',
    items: [
      { term: 'Steel and prestressed girder bridges', body: 'Design, detailing and PS&E delivery to AASHTO LRFD, AREMA, NJDOT, PennDOT, IDOT and MassDOT standards.' },
      { term: 'Construction-stage finite element modeling', body: 'Staged construction, erection and deck-pour sequence analysis in CSiBridge, SAP2000 and STAAD.Pro.' },
      { term: 'Load rating and rehabilitation', body: 'Highway and railway ratings, fracture-critical repairs, bridge jacking and bearing replacement.' },
      { term: 'Task leadership and QA/QC', body: 'Structures task leader on NJDOT and toll-authority work: schedule, budget and review coordination.' },
    ],
    link: { label: 'See the bridge work', filter: 'bridge' },
  },
  right: {
    label: 'Systems',
    heading: 'What technology teams should know',
    items: [
      { term: 'Product owner and architect', body: 'Steel Bridge Pal and the GFT Transportation application suite, from the first prototype to rollout across a bridge practice.' },
      { term: 'AI adoption with verification built in', body: 'Member of GFT’s AI Working Group and Automation & AI Ambassador; every AI-assisted workflow keeps an engineer’s check in the loop.' },
      { term: 'Python, C#, VBA and analysis APIs', body: 'Automation around CSiBridge, SAP2000, STAAD.Pro (OpenSTAAD) and OpenBridge. Writing engineering software since 2014.' },
      { term: 'Statistics and machine learning', body: 'MITx MicroMasters program in Statistics & Data Science; co-author on applied machine-learning research.' },
    ],
    link: { label: 'See the software and AI work', filter: 'software' },
  },
  joint: {
    label: 'Where they meet',
    body: 'A structural model and a software system fail the same way: quietly, at an assumption nobody checked. The habit I bring to both is the same. Verify against something independent before anyone relies on it.',
  },
};
