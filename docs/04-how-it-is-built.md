# 4. How it is built

A short tour for the day you want to change the design, or simply understand what you own.

## The idea

Three layers, each with one job.

| Layer | Folder | Job |
|---|---|---|
| Content | `content/` | What the site says. Plain text and Markdown |
| Presentation | `src/` | How it looks and moves. React components and CSS |
| Build | `plugins/`, `scripts/`, `vite.config.js` | Turns the two above into static files in `dist/` |

Because content is separate, you can rewrite every word without touching code, and redesign the site without retyping a word.

## What happens when you run `npm run build`

1. **Vite** reads `index.html`, follows it to `src/main.jsx`, and bundles the React app.
2. **`plugins/markdown.js`** converts each `.md` file in `content/` to ready-made HTML, so the browser never parses Markdown.
3. **`scripts/postbuild.mjs`** writes one `index.html` per page (with its own title and description), a `404.html` and a `sitemap.xml`.

The result in `dist/` is ordinary HTML, CSS and JavaScript. No server code, no database.

## Pages and routes

`src/App.jsx` lists the addresses:

| Address | File | Content source |
|---|---|---|
| `/` | `src/pages/Home.jsx` | everything in `content/` |
| `/work/<name>` | `src/pages/WorkDetail.jsx` | `content/work/<name>.md` |
| `/writing/<name>` | `src/pages/WritingDetail.jsx` | `content/writing/<name>.md` |
| `/experience` | `src/pages/Experience.jsx` | `content/career.js`, `recognition.js`, `skills.js` |
| anything else | `src/pages/NotFound.jsx` | |

`Home.jsx` is written as a sequence of clearly labelled sections, in reading order. To reorder the home page, move a whole `<section>` block. To remove a section, delete its block.

## The design system

Every colour, font and spacing value is defined once, in `src/styles/tokens.css`.

```css
:root {
  --bg: #f4f1ec;        /* paper */
  --ink: #1f1e1c;       /* text and linework */
  --gold: #b68235;      /* the single accent */
  --font-display: 'Cormorant Garamond', ...;   /* headings */
  --font-body: 'Lora Variable', ...;           /* reading text */
  --font-mono: 'IBM Plex Mono', ...;           /* labels and data */
}
```

Change `--gold` and the accent changes on every page, in the drawings and in the 3D bridge. The dark theme is the second block in the same file.

The other style files:

| File | Covers |
|---|---|
| `base.css` | Typography, buttons, labels, chips, scroll reveal |
| `layout.css` | Top bar, hero, plates (drawings and photos), footer |
| `home.css` | Each section of the home page, in page order |
| `pages.css` | Case studies, articles, calculator, résumé page, print |

Fonts are bundled with the site (the `@fontsource` packages), so nothing is requested from Google when a visitor arrives.

## The 3D bridge

Two files, deliberately separated.

**`src/lib/bridge-model.js`** is the engineering. It has no graphics code. It defines the geometry (`G`: spans, tower height, sag, panel spacing), builds the list of line segments, and contains `deflection(x, X)`: the vertical movement at station `x` for a point load at station `X`. That function is a drawing aid, not an analysis. It reproduces the behaviour you would expect of a suspension span: the deck dips under the load, the far half of the main span rises as the cable shifts, the unloaded spans lift slightly, and nothing moves at the towers.

**`src/components/BridgeScene.jsx`** is the graphics. It hands those segments to three.js, moves a load across the deck, re-evaluates the deflected shape each frame, and lets the visitor's pointer become the load.

Things worth knowing:

- three.js is loaded only after the text has appeared, so the page is readable immediately.
- The animation pauses when the hero is scrolled out of view.
- Colours are read from `tokens.css`, so the bridge follows the light and dark themes.
- If a visitor has "reduce motion" switched on, the bridge is drawn still.
- If the browser cannot run WebGL, a flat line drawing is shown instead.

To change the bridge, edit the numbers in `G` at the top of `bridge-model.js`. Try `towerTop`, `sagClear` or `side`.

## Add a line drawing

Drawings live in `src/components/Figure.jsx`, in the `DRAWINGS` object. Each is a small function that returns SVG shapes on a 480 × 300 sheet.

```jsx
'box-girder'() {
  return (
    <g>
      <path className="i" d="M80 120 H400 L360 200 H120 Z" />   {/* ink */}
      <line className="g" x1="80" y1="110" x2="400" y2="110" /> {/* gold */}
      <Label x="240" y="240" anchor="middle">SECTION · BOX GIRDER</Label>
    </g>
  );
},
```

Four pen classes are available: `i` ink, `l` light ink, `f` faint ink, `g` gold. After adding a drawing, add its name to the `FIGURES` list in `scripts/check-content.mjs`, then use `figure: box-girder` in a content file.

## Add an interactive widget to an article

1. Write a React component in `src/widgets/`, for example `LoadRatingDemo.jsx`.
2. Register it in `src/widgets/index.js`:

```js
import LoadRatingDemo from './LoadRatingDemo.jsx';
export const widgets = {
  'token-calculator': TokenCalculator,
  'load-rating-demo': LoadRatingDemo,
};
```

3. Place it in any article with `[[widget:load-rating-demo]]` on its own line.

`TokenCalculator.jsx` is a complete example: inputs, a computed result, and a chart drawn in SVG.

## Add a page

1. Create `src/pages/Talks.jsx` (copy `NotFound.jsx` as a starting point).
2. Add `<Route path="/talks" element={<Talks />} />` in `src/App.jsx`.
3. Add the address to the `pages` list in `scripts/postbuild.mjs` so it gets its own HTML file.
4. Optionally add it to `nav` in `content/site.js`.

## Libraries used

| Library | Why |
|---|---|
| React | Components and state |
| React Router | Addresses and navigation without page reloads |
| three.js | The 3D bridge |
| Vite | Development server and build |
| marked, front-matter | Markdown and front matter, at build time only |
| Fontsource | Self-hosted fonts |

Nothing else. There is no CSS framework and no component library, so there is little to keep up to date.
