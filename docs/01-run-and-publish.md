# 1. Run it and publish it

## Run it on your computer

```bash
cd venups.github.io
npm install        # first time only
npm run dev
```

Open the address it prints (usually http://localhost:5173). Leave it running. Every time you save a file the browser updates by itself. Press `Ctrl + C` in the terminal to stop.

While developing, files marked `draft: true` are visible so you can preview them. They are left out of the published site.

To see exactly what will be published:

```bash
npm run build
npm run preview    # http://localhost:4173
```

## Publish to GitHub Pages

GitHub can build and publish the site for you every time the `main` branch changes, so you never upload files by hand. The instructions for that are in a small workflow file.

### One-time setup

1. The workflow file is already in place at `.github/workflows/deploy.yml`. Nothing to copy.
2. On github.com open the repository, then **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

Do this before the new code reaches `main`. With the old setting ("Deploy from a branch") GitHub would serve the source files directly and the page would be blank.

### Every time you want to publish

The work is on the `dev` branch. Publishing means getting it to `main`.

```bash
git add -A
git commit -m "Describe what changed"
git push origin dev

git checkout main
git merge dev
git push origin main
git checkout dev
```

Then open the **Actions** tab on GitHub. A run called "Deploy to GitHub Pages" takes about a minute. When it shows a green tick, the site is live. If it shows a red cross, click it: the log names the file and line that is wrong (most often a typo in a content file, which `npm run check` would have caught). The workflow runs `npm run check` before it publishes, so a page that fails to draw or a link that goes nowhere stops the deploy and the live site stays as it was.

If you prefer, open a pull request from `dev` to `main` on GitHub and press Merge instead of the four `main` commands above.

## Host it as a static web app (Azure and others)

`npm run build` writes a complete, self-contained site to `dist/`. Any static host can serve that folder.

**Azure Static Web Apps.** Create the app in the Azure portal, connect this GitHub repository, and enter:

| Setting | Value |
|---|---|
| App location | `/` |
| Output location | `dist` |
| Build command | `npm run build` |

Azure adds its own workflow file to the repository. The file `public/staticwebapp.config.json` is already in place: it sends unknown addresses to the app and sets caching and security headers. If you move fully to Azure, delete `.github/workflows/deploy.yml` so the site is not published twice.

**Netlify, Cloudflare Pages, Vercel.** Build command `npm run build`, publish directory `dist`.

**Your own server.** Copy the contents of `dist/` to the web root.

### Why refreshing a page works everywhere

The site is a single-page app, but the build also writes a real `index.html` for every address (`/work/steel-bridge-pal/`, `/experience/`, and so on) plus a `404.html`. A static host therefore always finds a file, and a link pasted into LinkedIn or an email shows the right title and description. This is done by `scripts/postbuild.mjs`.

## Custom domain

1. Buy the domain and, at your registrar, point it to GitHub Pages (GitHub's documentation lists the records).
2. On GitHub: **Settings → Pages → Custom domain**.
3. In `content/site.js` change `url` to the new address, and update the address in `index.html` (`og:image`) and `public/robots.txt`.

## Hosting in a sub-folder

Only needed if the site will live at an address like `example.com/portfolio/`:

```bash
VITE_BASE=/portfolio/ npm run build
```

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Blank page on venups.github.io | Pages source is still "Deploy from a branch". Switch it to "GitHub Actions" and re-run the workflow. |
| Build fails with "Could not read content/…" | A typo in the block between the `---` lines of that file. Check indentation and quotes. |
| A new page does not appear | The file still has `draft: true`, or its name starts with `_`. |
| A picture does not show | The path must start with `/images/` and match the file name exactly, including capitals. Run `npm run check`. |
| `npm install` fails | Update Node.js to version 22 or newer. |
