# 3. Images

Until you add photographs, each project shows a line drawing. The site is designed to look complete that way, so add pictures only where they help.

## Where they go

Save pictures under `public/images/`, in a folder named after the page:

```
public/images/work/us-20-fox-river/cover.jpg
public/images/work/us-20-fox-river/stage-3-erection.jpg
public/images/writing/local-ai-field-notes/benchmark.png
```

Use lowercase names with hyphens and no spaces.

## Use one as the cover of a project or article

In the front matter of the content file:

```yaml
cover: /images/work/us-20-fox-river/cover.jpg
coverCaption: "Photo: Illinois DOT"
```

The path starts at `/images/`. Leave out `public`. The cover replaces the line drawing on the card and at the top of the page.

## Put one inside the text

On a line by itself in the body:

```markdown
![Girder erection, stage 3. Photo: J. Smith](/images/work/us-20-fox-river/stage-3-erection.jpg)
```

The words in the square brackets become the caption under the picture and the description read by screen readers. Write what the picture shows.

## Sizes

| Use | Shape | Width | Format |
|---|---|---|---|
| Cover | 16 : 10 landscape | 1600 px | JPG, quality about 80 |
| Inside the text | any | 1400 px | JPG for photos, PNG for screenshots and diagrams |
| Link preview (`public/og.png`) | 1200 × 630 | 1200 px | PNG |

Keep each file under about 400 KB. On a Mac, open the picture in Preview, choose **Tools → Adjust Size**, set the width, then **File → Export** as JPEG.

Covers are cropped to fit, so keep the subject near the centre.

## Permission

Before publishing a picture, be sure you may.

- **Project photographs and drawings** usually belong to the owner agency or your employer. Ask before using them, and credit the source in the caption.
- **Screenshots of internal tools** can show client names, file paths or data. Crop or blur them, and get approval.
- **Pictures from the web** are not free to use unless the licence says so. Your own photographs are the safest choice.
- **Sheets from contract plans** are generally public once a project is advertised, but confirm with the project manager.

When in doubt, keep the line drawing.

## The link preview image

`public/og.png` is the picture shown when the site's address is pasted into LinkedIn, Slack or a message. To refresh it after a redesign, take a 1200 × 630 screenshot of the top of the home page and save it over that file.
