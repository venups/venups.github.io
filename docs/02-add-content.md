# 2. Add content

Everything the site says lives in the `content/` folder. There are two kinds of file.

- **Markdown files (`.md`)** for things that have their own card or page: case studies, success stories, articles. One file each.
- **Data files (`.js`)** for lists: the career path, awards, talks, skills, and the site-wide text.

After any change, run `npm run check`. It reads every file and tells you in plain words what is missing or misspelled.

## How a Markdown file is laid out

```markdown
---
title: US 20 over Fox River
kind: bridge
summary: One sentence that appears on the card.
---

## The project

The body, written in ordinary Markdown.
```

The part between the two `---` lines is the **front matter**: labelled facts about the page. Below it is the **body**.

Three rules keep the front matter from breaking:

1. Keep the space after each colon: `title: My bridge`, not `title:My bridge`.
2. If a value contains a colon or starts with a symbol, wrap it in quotes: `title: "Bridges: a field guide"`, `metric: ">80%"`.
3. Indent list items with two spaces, exactly as in the templates.

The file name becomes the web address. `content/work/tappan-zee.md` is published at `/work/tappan-zee`. Use lowercase letters, numbers and hyphens.

## Add a project (case study)

1. Copy `content/work/_template.md` and rename the copy.
2. Fill in the front matter:

| Field | Required | What it does |
|---|---|---|
| `title` | yes | Card and page heading |
| `kind` | yes | `bridge` shows under Structures, `software` under Systems |
| `summary` | yes | One sentence on the card and under the title |
| `order` | | Position in the grid. Lower comes first |
| `featured` | | `true` marks it as a headline project |
| `role`, `client`, `firm`, `period`, `location` | | The facts row on the page. Leave out any that do not apply |
| `status` | | Short note beside the category, such as "In service" |
| `figure` | | Which line drawing to show (list below) |
| `cover` | | A photo to show instead of the drawing |
| `coverCaption` | | Caption or credit on the photo |
| `tags` | | Topics listed beside the text |
| `related` | | Other case studies to list beside the text as "Related work": file names without `.md`, e.g. `[steel-bridge-pal, us-20-fox-river]` |
| `metrics` | | Numbers shown in a band on the page. The first also appears on the card |
| `links` | | External links listed beside the text |
| `draft` | | `true` hides it from the published site |

3. Write the body. The structure that reads best to a recruiter is: **the project**, **why it is hard**, **my role**, **the result**, **what it shows**. Lead with the result where you have a number. To link to another page of the site from the text, write `[Steel Bridge Pal](/work/steel-bridge-pal)`.
4. Set `draft: false` (or delete the line), run `npm run check`, and publish.

### Line drawings available for `figure`

| Name | Drawing |
|---|---|
| `suspension` | Suspension bridge, elevation |
| `curved-girder` | Curved girders in plan, two construction stages |
| `viaduct` | Multi-span girder viaduct, elevation |
| `interchange` | Interchange in plan with one bridge highlighted |
| `jacking` | Girder lifted on jacks at a pier |
| `through-girder` | Railway through-girder, cross-section |
| `land-bridge` | Field of arch girders |
| `skew-deck` | Skewed deck in plan |
| `girder` | Simple girder elevation (the default) |
| `pipeline` | Five-step software pipeline |
| `suite` | Application window with tool tiles |
| `code` | Script driving an analysis model |
| `chart` | Cost curve |

To draw a new one, see docs/04-how-it-is-built.md.

### Which project is the flagship

The dark band near the top of the home page shows `steel-bridge-pal`. To feature a different project there, change the slug in `src/pages/Home.jsx` on the line that begins `const flagship =`.

## Add a success story

Stories are the cards in the **Results** section. Each one is a number, a headline and two or three sentences.

1. Copy `content/stories/_template.md` and rename the copy.
2. Fill in:

| Field | Required | What it does |
|---|---|---|
| `metric` | yes | The large number. Keep it short and put it in quotes |
| `title` | yes | What happened, in a few words |
| `context` | | Firm, project and year, shown at the bottom |
| `related` | | File name of a case study (without `.md`). Adds a "Case study" link |
| `order` | | Position. Lower comes first |

3. Write the body in this order: the situation, what you did, the result.

A good story has a number someone else could confirm. "Saved about 200 hours per model" is stronger than "greatly improved efficiency".

## Add an article

1. Copy `content/writing/_template.md` and rename the copy.
2. Set `title`, `date` (as `2026-12-01`) and `summary`.
3. Write the body. Headings start with `##`. Everything in the template is supported: bold, italic, links, bullet lists, numbered steps, quoted blocks, tables, code, and pictures.

Articles are listed on the home page with the newest first. Reading time is worked out automatically.

To include the interactive calculator, put this on a line by itself:

```
[[widget:token-calculator]]
```

## Edit the lists

Open the file, copy an existing entry, paste it at the top of its list, and change the words. Keep the commas and quotes as they are.

| To change | Edit |
|---|---|
| Name, tagline, email, links, hero text | `content/site.js` |
| The four numbers under the hero | `content/site.js` → `proof` |
| The "Two disciplines" columns | `content/site.js` → `disciplines` |
| Navigation links | `content/site.js` → `nav` |
| Career path on the home page | `content/career.js` → `path` |
| Jobs on the Experience page | `content/career.js` → `experience` |
| Education, licences, training | `content/career.js` → `education`, `licensure` |
| Awards, publications, talks, service | `content/recognition.js` |
| Skills | `content/skills.js` |

Example: a new award.

```js
export const awards = [
  { year: '2027', name: 'Name of the award', by: 'Who gave it' },   // ← new line
  { year: '2026', name: 'Technology Innovation Award, Winner', by: 'GFT · 2026 Technology Innovation Challenge' },
  ...
```

If the text contains an apostrophe, either use the curly one (’) or wrap the text in double quotes: `"Master's project"`.

## Offer a résumé PDF

By default the Résumé button opens the Experience page, which has a "Print or save as PDF" button. To offer your own PDF instead:

1. Save it as `public/resume.pdf`.
2. In `content/site.js` set `resumeFile: '/resume.pdf'`.

Check what the PDF contains before publishing it. A phone number or home address in a public PDF is collected by spam tools within days.

## Hide or remove something

- Hide a page without deleting it: add `draft: true` to its front matter.
- Remove it: delete the file.
- Keep notes that are never published: start the file name with `_`.
