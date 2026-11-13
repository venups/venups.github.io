# venups.github.io

The personal site of **Venu Pokuri, P.E.** It presents two bodies of work side by side: bridge engineering, and the software and AI tools built for it.

Built with **React**, **Vite** and **three.js**. It compiles to plain static files, so it runs on GitHub Pages today and on Azure Static Web Apps, Netlify, Cloudflare Pages or any web server later, with no changes.

## Quick start

You need [Node.js](https://nodejs.org) 22 or newer (check with `node -v`).

```bash
npm install      # once, downloads the libraries
npm run dev      # opens the site at http://localhost:5173 and reloads as you edit
```

Other commands:

| Command | What it does |
|---|---|
| `npm run check` | Reads every content file and lists mistakes (missing title, missing image, wrong name), then draws every page and follows every internal link, so a blank page or a dead link is caught before it is published |
| `npm run build` | Produces the finished site in `dist/` |
| `npm run preview` | Serves `dist/` locally, exactly as it will be published |

## Where things are

```
content/            WHAT THE SITE SAYS. This is the folder you will edit.
  site.js             name, tagline, links, the "two disciplines" text
  career.js           career path, full experience, education
  recognition.js      awards, publications, talks, service
  skills.js           the toolbox
  work/*.md           one file per case study (bridges and software)
  stories/*.md        one file per success story (the Results cards)
  writing/*.md        one file per article

public/             FILES SERVED AS THEY ARE
  images/             photos and screenshots (see docs/03-images.md)
  favicon.svg, og.png, robots.txt

src/                HOW THE SITE LOOKS AND BEHAVES
  pages/              Home, WorkDetail, WritingDetail, Experience, NotFound
  components/         Nav, Footer, BridgeScene (the 3D hero), Figure (line drawings) ...
  widgets/            interactive pieces for articles (the token cost calculator)
  styles/             tokens.css holds every colour, font and spacing value
  lib/                content loader, hooks, the bridge geometry

plugins/            turns Markdown files into pages at build time
scripts/            post-build step (per-page HTML, 404, sitemap), the content checker and the page-and-link checker
docs/               the guides below
.github/workflows/  deploy.yml builds and publishes the site every time `main` changes
```

The rule of the codebase: **content is data.** To change what the site says, edit `content/`. You only touch `src/` to change the design.

## Guides

1. [Run it and publish it](docs/01-run-and-publish.md): local preview, GitHub Pages, Azure Static Web Apps, custom domain
2. [Add content](docs/02-add-content.md): projects, success stories, articles, awards, jobs
3. [Images](docs/03-images.md): where they go, sizes, permissions
4. [How it is built](docs/04-how-it-is-built.md): the design system, the 3D bridge, adding a drawing or a widget

## Adding something, in one minute

**A project.** Copy `content/work/_template.md`, rename it `my-project.md`, fill in the fields, set `draft: false`. It appears in the Work grid and gets its own page at `/work/my-project`.

**A success story.** Copy `content/stories/_template.md`, rename it, write the number and three sentences.

**An article.** Copy `content/writing/_template.md`, rename it, write in Markdown.

**A photo.** Save it in `public/images/work/my-project/` and set `cover: /images/work/my-project/cover.jpg` in the project file.

Then:

```bash
npm run check                      # catches typos before they are published
git add -A
git commit -m "Add my project"
git push                           # GitHub builds and publishes when this reaches main
```

## Still to review

- [x] Automatic publishing is switched on (`.github/workflows/deploy.yml`, with **Settings → Pages → Source: GitHub Actions**)
- [ ] Read every page once and correct anything that is not exactly right
- [ ] Confirm your employer is comfortable with the project details shown
- [ ] Review the article in `content/writing/` and replace the calculator defaults with your own measurements
- [ ] Optional: add `public/resume.pdf` and set `resumeFile` in `content/site.js`
- [ ] Optional: add real photos (docs/03-images.md)
