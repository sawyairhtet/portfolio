# sawyehtet.com

Personal site of Saw Ye Htet. A portfolio front door, a writing feed, and the site's
previous incarnation (a GNOME desktop simulation) preserved as a browsable artifact.

Live at [sawyehtet.com](https://sawyehtet.com), deployed on Netlify from `main`.

## What this is

| Route      | What you get                                                                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`        | The portfolio: a single-page Editorial / Swiss layout. Hero, About, Experience, Projects, Skills, Resume, Contact, and a teaser of recent writing                                                                         |
| `/writing` | The writing feed: newest-first list of published posts                                                                                                                                                                    |
| `/<slug>`  | Individual posts at clean root slugs, e.g. `/the-plain-door`                                                                                                                                                              |
| `/desktop` | The previous version of the site: a Fedora/GNOME desktop simulation with boot sequence, dock, draggable windows, and a working terminal. Kept as a showcased artifact, lazy-loaded so it never weighs down the front door |
| `/rss.xml` | RSS feed of published posts, generated at build time                                                                                                                                                                      |

The main site speaks one design language: big display type, strict grid, hairline
structure, a single red accent, warm paper-light theme, self-hosted Adwaita Sans/Mono.
Why the desktop simulation stopped being the front door is the subject of the first
post, [The Long Way to a Plain Door](https://sawyehtet.com/the-plain-door).

## Tech stack

- React 19 + TypeScript 5, built with Vite 8
- React Router 7 (routes above, plus 301s for legacy URLs)
- Vanilla CSS in cascade layers; no CSS framework
- react-markdown + remark-gfm for posts
- React Hook Form + Zod for the contact form (Formspree)
- xterm.js for the desktop artifact's terminal
- Phosphor icons
- Vitest + Testing Library; ESLint flat config + Prettier
- Netlify for hosting, GitHub Actions for CI, CodeQL + Dependabot for scanning

## Project structure

```text
portfolio/
├── src/
│   ├── site/                   # The main site: portfolio (/), writing feed, posts
│   │   ├── WorkPage.tsx        # The front door at /
│   │   ├── Home.tsx            # The writing feed at /writing
│   │   ├── BlogPost.tsx        # Post page at /<slug>
│   │   ├── editorial.css       # All main-site styles, scoped under .ed
│   │   └── blog/posts/         # Posts as Markdown with frontmatter
│   ├── components/             # The /desktop artifact: shell, windows, apps
│   ├── context/                # App-wide state providers
│   ├── config/                 # Profile and content data
│   ├── styles/                 # CSS entry point and design tokens
│   └── tests/                  # Vitest suites
├── css/                        # Layered CSS for the desktop artifact
├── scripts/                    # Build-time generators (RSS, OG image)
├── public/                     # Static assets, fonts, resume PDF
└── netlify.toml                # Headers, redirects, build config
```

## Writing and publishing posts

Posts live in `src/site/blog/posts/` as Markdown files with frontmatter:

```markdown
---
title: 'Post title'
date: '2026-06-06'
slug: 'post-slug'
summary: 'One or two sentences shown in the feed and as the meta description.'
tags: [meta, design]
draft: false
---
```

A post with `draft: true` is hidden everywhere, including its own URL. Publishing is
flipping `draft` to `false` (or adding a new file) and rebuilding. The feed, the
homepage writing section, reading time, and the RSS feed all update automatically.
`scripts/generate-rss.mjs` parses the same frontmatter, so keep it in sync with
`src/site/blog/posts.ts` if the format ever changes.

## Development

```bash
npm install
npm run dev        # Vite dev server on :3000
```

Note: `/rss.xml` is generated at build time, so it 404s in dev but serves on the
built and live site.

## Validation

```bash
npm run validate   # lint, typecheck, tests
npm run build      # typecheck, RSS generation, production build
```

CI runs the same chain (plus build) on every push and PR to `main`.

## Deployment

Netlify builds with `npm run build` and publishes `dist/`. Routing in `netlify.toml`:

- `/app/*` and the catch-all `/*` rewrite to the SPA entry (status 200)
- `/work` 301s to `/`; legacy `/blog` 301s to `/writing` and `/blog/*` to `/:splat`

### Post-deploy checklist

1. Visit `/` and confirm the portfolio renders with no layout shifts.
2. Visit `/writing` and a post slug; confirm the feed and post render.
3. Visit `/desktop` and confirm the boot sequence and shell load; `/app/about` should
   deep-link into the About window.
4. Check `/rss.xml` serves valid XML.
5. Test OG preview at [opengraph.xyz](https://www.opengraph.xyz/).
6. Verify headers at [securityheaders.com](https://securityheaders.com/).
7. Run Lighthouse (Performance, Accessibility, Best Practices).
8. Submit the contact form with a real email to confirm Formspree delivery.

## Updating profile and projects

Portfolio content lives in two config files:

- **`src/config/profile.ts`**: name, role, headline, education, email, resume path,
  availability, location, primary stack, social links.
- **`src/config/data.ts`**: experience entries, projects (problem/approach/outcome,
  tech stack, links, media), skill categories, plus everything the desktop artifact
  uses (app definitions, wallpapers, terminal filesystem).

To add a project, append a `Project` object to the `PROJECTS` array in `data.ts`.
After any content change run `npm run validate`.

## Design notes

The main site is an opinionated Editorial / Swiss design: strict grid, aligned
hairlines, one accent color, no glassmorphism or dark-card defaults.

The `/desktop` artifact follows the GNOME 49 / libadwaita visual language (window
radius, header bars, Adwaita color ramp, accent #3584e4) with two intentional
deviations kept for visitor UX: a persistent dock (stock GNOME only shows the dash
in the Activities overview) and icon-plus-label buttons in body content. These are
deliberate; see `CLAUDE.md` for the full list of intentional decisions.

## Security

- **Headers**: Netlify serves `X-Content-Type-Options: nosniff`, `X-Frame-Options:
DENY`, two-year HSTS with preload, a deny-by-default `Permissions-Policy`,
  cross-origin isolation headers, and a strict Content Security Policy on every
  response.
- **CSP `style-src 'unsafe-inline'`**: required by React inline `style` props. An
  accepted trade-off.
- **Contact form**: honeypot field, client-side rate limiting, Zod schema validation.
  Submissions go through Formspree (the form ID is public by design).
- **External links**: all `target="_blank"` links use `rel="noopener noreferrer"`.
- **Dependencies**: Dependabot runs weekly for npm and GitHub Actions. CodeQL scans
  JavaScript/TypeScript on every push to `main`.

## OG image

The Open Graph preview image is generated by Puppeteer:

```bash
npm run generate:og    # outputs public/images/og-preview.png
```

After regeneration, optimize the PNG before committing:

```bash
# pngquant (best results)
pngquant --force --quality=85-95 --output public/images/og-preview.png public/images/og-preview.png

# ImageMagick fallback
magick public/images/og-preview.png -strip -colors 256 -define png:compression-level=9 public/images/og-preview.png
```

The image stays PNG (not WebP) because link previews on Facebook, LinkedIn, iMessage,
and Slack have inconsistent WebP support.
