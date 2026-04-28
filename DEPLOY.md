# Deploying to Vercel

This is a one-time setup. After it's done, every `git push` will auto-deploy a preview, and pushes to `main` will deploy to production.

The repo is already initialized and the first commit is staged — you just need to set your git identity, commit, push to GitHub, and connect Vercel.

---

## 1. Set your git identity (one-time, machine-wide)

If you've never committed from this machine before, git doesn't know who you are yet. Run these once with your real name and the email you use on GitHub:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Skip this if you've already configured git globally for other projects.

## 2. Make the initial commit

From the project directory (`C:\Users\jwbur\SB websitebuilder`), run:

```bash
git commit -m "Initial commit: Next.js scaffold + 6 sections"
```

Files are already staged. This will create the first commit on the `main` branch.

## 3. Create the GitHub repo

Easiest path is the web UI:

1. Go to **https://github.com/new**
2. Repo name: `north-country-tree-co` (or anything you want — it doesn't have to match)
3. Visibility: **Private** is fine for a portfolio piece (Vercel works with private repos on the free tier)
4. **Do NOT** check "Add a README", "Add .gitignore", or "Add license" — we already have those
5. Click **Create repository**

## 4. Push to GitHub

GitHub will show you a "push an existing repository" snippet on the new repo page. It looks like this — copy the lines, replacing `YOUR-USERNAME`:

```bash
git remote add origin https://github.com/YOUR-USERNAME/north-country-tree-co.git
git push -u origin main
```

When prompted for credentials, use a [GitHub Personal Access Token](https://github.com/settings/tokens) as the password (not your account password — GitHub deprecated that for git over HTTPS). For a portfolio repo a token with the `repo` scope is enough.

## 5. Connect Vercel

1. Go to **https://vercel.com/new**
2. Sign in with GitHub if you haven't already (this also grants Vercel access to your repos)
3. **Import** the `north-country-tree-co` repo
4. Vercel auto-detects the framework as **Next.js** — leave all build settings on the defaults
5. **Environment Variables** — add one:
   - Name: `ANTHROPIC_API_KEY`
   - Value: leave blank for now (or paste a real key if you have one). The chatbot is the only thing that uses this; it isn't built yet, so the deploy will succeed regardless.
6. Click **Deploy**

First deploy takes ~1–2 minutes. You'll get a URL like `north-country-tree-co.vercel.app`.

## 6. Verify the deploy

Open the live URL and walk through:

- [ ] Hero image loads (Unsplash CDN must work in prod — confirmed via [next.config.mjs](next.config.mjs) `remotePatterns`)
- [ ] Fonts render (Fraunces + Inter — `next/font` handles this automatically)
- [ ] All six sections render in order
- [ ] Phone number `tel:` links work on mobile (open the URL on your phone)
- [ ] Gallery lightbox opens
- [ ] Quote form *renders* — submitting will hit the placeholder error state until you swap the Formspree endpoint (see [CLAUDE.md](CLAUDE.md) TODOs)

## After deploy: how the workflow looks

- Every `git push` → Vercel builds a **preview** URL (one per branch/commit)
- `main` branch → automatically deploys to **production**
- Add `ANTHROPIC_API_KEY` value in Vercel before/when the chatbot ships
- Custom domain: Vercel project → Settings → Domains. Free SSL.

## If anything fails during the Vercel build

The Vercel dashboard shows full build logs. Most likely causes if it fails:
- **Missing env var** → only matters once the chatbot is added. Static deploy doesn't need it.
- **Image domain not allowed** → already handled in [next.config.mjs](next.config.mjs); only an issue if you swap in non-Unsplash image URLs.
- **TypeScript error** → I run `npm run build` after each section, so this should be clean. If it surfaces, the log will name the file + line.

If you hit something weird, paste the failing log and I'll diagnose.
