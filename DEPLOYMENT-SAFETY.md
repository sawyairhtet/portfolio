# Deployment Safety Guide

## Safe Workflow

### 1. Validate locally

```bash
npm run dev
npm run validate
npm run build
```

Before pushing, verify the React desktop shell works on desktop and mobile breakpoints and that `/app/about` style deep links still load.

### 2. Commit the right surface

This repo is deployed from the Vite build output, not the old root-level static files.

```bash
git status
git diff --stat
git add src css public package.json vite.config.js netlify.toml README.md DEPLOYMENT-SAFETY.md
```

Only stage files you intentionally changed.

### 3. Deploy through Netlify

Netlify should use:

```bash
Build command: npm run build
Publish directory: dist
```

The checked-in `netlify.toml` keeps these settings in the repo and adds an SPA rewrite for `/app/*` routes.

### 4. Verify production

After deploy completes:

- Open `https://sawyehtet.com`
- Refresh an app deep link such as `https://sawyehtet.com/app/about`
- Confirm the custom `404.html` still renders for unknown non-app routes
- Check the browser console for runtime errors

## Recovery

If a deployment breaks, prefer a forward fix or `git revert` over history rewrites.

```bash
git log --oneline -5
git revert HEAD --no-edit
git push origin main
```

## Common Failure Modes

- Deploying the repo root instead of `dist`, which serves stale static files
- Passing `build` locally but skipping `validate`, which misses lint or test regressions
- Breaking deep links by removing the `/app/*` rewrite
- Updating content or routes without checking the 404 page and metadata

## Quick Reference

```bash
npm run dev
npm run validate
npm run build
git status
git diff --stat
git revert HEAD --no-edit
```
