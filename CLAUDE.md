# CLAUDE.md — Repository Guide

> Quick-reference for any AI assistant or new contributor working on this codebase.

## ⚡ Current architecture (read first)

The site is **portfolio-first**. The **front door (`/`) is the portfolio**
(`src/site/WorkPage.tsx`) — the single-page Editorial / Swiss layout: Hero · About ·
Experience · Projects · Skills · Résumé · Contact, closing with a **Writing** section
(`src/site/sections/Writing.tsx`) that surfaces the three newest posts and links out to
the feed. The **writing feed lives at `/writing`** (`src/site/Home.tsx`): a compact
masthead (name · tagline · intro · a link back to the portfolio) over the newest-first
list of published posts. Individual posts render at **clean root slugs** (`/<slug>`,
e.g. `/the-plain-door`). It all shares one Editorial / Swiss language: big display type,
strict grid, hairline structure, one signal-red accent, warm "paper" light theme,
self-hosted Adwaita Sans/Mono. Styles live in `src/site/editorial.css` (scoped under
`.ed`, independent of the GNOME token system). Portfolio content comes from
`src/config/data.ts` + `src/config/profile.ts`; posts are Markdown in
`src/site/blog/posts/*.md` (loader: `src/site/blog/posts.ts`).

The **GNOME/Fedora desktop simulation is preserved as a showcased artifact at
`/desktop`** (and `/app/:appId` deep links). It is **lazy-loaded**, so it is not
shipped on the front door. Everything under `src/components/` (shell, window, apps)
belongs to that desktop artifact. The "Do-Not-Touch Zones" below still apply **to the
`/desktop` experience** — it is not the main site.

When the task is about the primary site (the `/` portfolio, the `/writing` feed, or
posts), work in `src/site/`. When it is about the interactive desktop demo, work in
`src/components/`.

## Stack & Key Dependencies

| Layer     | Technology                                       | Version | Notes                                                                                                                                                                                             |
| --------- | ------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | React                                            | 19      | StrictMode enabled                                                                                                                                                                                |
| Language  | TypeScript                                       | 5       | Strict, `noEmit`, bundler module resolution                                                                                                                                                       |
| Bundler   | Vite                                             | 8       | Dev on `:3000`, builds to `dist/`                                                                                                                                                                 |
| Styling   | CSS Layers (vanilla)                             | —       | `@layer reset, tokens, base, components, utilities` ordering. Predominantly vanilla CSS — no Tailwind                                                                                             |
| Routing   | React Router DOM                                 | 7       | BrowserRouter. Routes: `/` (portfolio), `/writing` (feed), `/:slug` (posts), `/desktop`, `/app/:appId`; `/work`→`/`, `/blog`→`/writing`, `/blog/:slug`→`/:slug` (301); `*` → 404                  |
| Forms     | React Hook Form + Zod                            | 7 / 4   | Used by the `/` Contact section (lazy) + desktop ContactApp; rides in shared lazy chunks (deliberately NOT a manual chunk)                                                                        |
| Terminal  | @xterm/xterm                                     | 6       | Real xterm.js instance inside TerminalApp                                                                                                                                                         |
| Icons     | @phosphor-icons/react                            | 2       | Single icon system. String keys → Phosphor components via `src/components/ui/Icon.tsx`. Rides with the lazy desktop chunks                                                                        |
| Fonts     | Adwaita Sans/Mono (self-hosted WOFF2, subsetted) | —       | Fully self-hosted in `public/fonts/` with SIL license. **No external font requests** (no Google Fonts)                                                                                            |
| Testing   | Vitest + Testing Library + jsdom                 | 4 / 16  | `vmForks` pool, globals enabled                                                                                                                                                                   |
| Linting   | ESLint flat config + Prettier                    | 9 / 3   | 4-space indent, single quotes, trailing comma es5                                                                                                                                                 |
| Analytics | Plausible                                        | —       | Script tag in index.html, domain `sawyehtet.com`                                                                                                                                                  |
| Deploy    | Netlify                                          | —       | Build: `npm run build`, publish: `dist/`; SPA rewrite `/app/*`, 301s for `/work`→`/` and legacy `/blog*`; RSS + sitemap + per-route head shells generated at build                                |
| PWA       | Service worker (`public/sw.js`) + manifest.json  | —       | Per-build cache version (`__BUILD_HASH__` injected by vite.config.js); cache-first for `/assets/` + `/fonts/`, stale-while-revalidate for other statics, network-first HTML with offline fallback |

## Entry Point & Routing

```
index.html                          ← Vite HTML entry, loads /src/main.tsx
  └─ src/main.tsx                   ← ReactDOM.createRoot, imports main.css
       └─ src/App.tsx               ← BrowserRouter + 6 context providers
            ├─ /                    → WorkPage        (src/site/, the portfolio — eager)
            ├─ /writing             → Home            (lazy, the writing feed)
            ├─ /work                → Navigate → /          (redirect — old portfolio route)
            ├─ /desktop             → DesktopShell    (lazy, the desktop artifact)
            ├─ /app/:appId          → DeepLinkHandler (lazy, opens a desktop window)
            ├─ /blog                → Navigate → /writing   (legacy redirect)
            ├─ /blog/:slug          → Navigate → /:slug     (legacy redirect)
            ├─ /:slug               → BlogPost        (lazy, a published post; unknown/draft → not-found)
            └─ *                    → NotFound        (editorial 404)
```

`WorkPage` is eager (the front-door portfolio); `Home`, `BlogPost`, `NotFound`,
`DesktopShell`, and `DeepLinkHandler` are `React.lazy`-loaded inside a `Suspense`
boundary. The portfolio's `Contact` section is _itself_ lazy (a local `Suspense` inside
`WorkPage`) so the react-hook-form/zod runtime is code-split out of the front door's
bundle; `react-markdown` rides with `BlogPost`, and the desktop bundle (Phosphor icons,
`TerminalApp`, framer-motion) stays on `/desktop`. Lazy-only vendors are deliberately
NOT listed in `manualChunks` (vite.config.js): Rolldown hoists manual chunks into the
entry's static imports, which made the front door modulepreload desktop/Contact code.

**Deep linking:** `/app/about`, `/app/projects`, etc. The `DeepLinkHandler` validates the `appId` against the `AppId` union type and calls `openWindow()`. Netlify rewrites `/app/*` and a catch-all `/*` → `/index.html` (status 200) for SPA refresh; `/work` → `/`, legacy `/blog` → `/writing` and `/blog/*` → `/:splat` are **301 redirects** (`netlify.toml`). `scripts/generate-feeds.mjs` (chained into `npm run build`, before `vite build`) writes `public/rss.xml` + `public/sitemap.xml` (committed, deterministic, served in dev too); `scripts/generate-meta.mjs` (after `vite build`) writes static head shells `dist/<route>/index.html` (per-post/`/writing`/`/desktop` title, OG, canonical) so social crawlers — which don't run JS — see the right card. Netlify serves static files before redirects, so shells win over the SPA catch-all.

**Head bootstrap:** `public/head-bootstrap.js` runs synchronously before React to read `localStorage('theme')` and set `data-theme` on `<html>`, preventing a dark→light flash.

## Context Providers (wrap order in App.tsx)

1. **DeviceProvider** — detects `mobile` / `tablet` / `desktop` from `window.innerWidth` (debounced resize)
2. **ThemeProvider** — `isDark` toggle, accent color. Syncs `data-theme` attribute + CSS custom properties on `:root`
3. **PreferencesProvider** — wallpaper, brightness, snap/resize/focusDim/fastBoot toggles. Persisted to `localStorage('portfolioPreferences')`
4. **SoundProvider** — Web Audio API oscillator startup drum. Mute/volume persisted
5. **WindowManagerProvider** — the core window manager. `Map<AppId, WindowInfo>` with open/close/minimize/maximize/bringToFront/snap/resize. Z-index stacking, MAXIMIZED_Z_FLOOR at 1050
6. **NotificationProvider** — notification center entries + ephemeral toasts. DND mode. Welcome notification on first visit

## Component Architecture

### Shell (`src/components/shell/`)

| Component         | What it does                                                                                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DesktopShell`    | **The god component.** Renders TopBar, Dock, Wallpaper, BootScreen, conditionally-rendered Window instances (lazy-loaded), Activities overlay, QuickSettings, NotificationCenter, ContextMenu, ToastContainer, keyboard shortcuts, alt-tab switcher, welcome hero. |
| `TopBar`          | GNOME-style panel: Activities button, live clock, status indicators (wifi/volume/battery). Click zones toggle overlays                                                                                                                                             |
| `Dock`            | Desktop dock (filtered by `desktopDock`) + mobile dock (filtered by `mobileDock`). Mobile has an "Apps" launcher drawer                                                                                                                                            |
| `Wallpaper`       | Renders the selected wallpaper (image or gradient). Supports light/dark image variants. Uses `<img>` with `object-fit: cover`                                                                                                                                      |
| `BootScreen`      | Plymouth-style boot: log lines → spinner → Fedora logo. First-time visitors see full boot; returning visitors with `fastBoot` skip instantly. Skippable on any key/click                                                                                           |
| `DeepLinkHandler` | Reads `:appId` from URL, opens the matching window, renders `DesktopShell`                                                                                                                                                                                         |

### Window (`src/components/window/`)

| Component | What it does                                                                                                                                                                                                                                                                  |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Window`  | Generic draggable/resizable window container. Header bar with close/minimize/maximize. Snap zones (left/right half). Mobile: full-viewport sheet with swipe-to-close. Container queries via `container-name: app-window`. Escape closes via `onKeyDown` on the dialog element |

### Apps (`src/components/apps/`) — all lazy-loaded

| App             | AppId         | Description                                                                                                                                                                                                                                 |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AboutApp`      | `about`       | Recruiter summary — profile pic, bio, education, CTA buttons, social links, recruiter path (About → Skills → Projects → Resume → Contact)                                                                                                   |
| `SkillsApp`     | `skills`      | Skill categories with proficiency dots (3-dot system: proficient/intermediate/learning)                                                                                                                                                     |
| `ProjectsApp`   | `projects`    | Featured project cards with tech stack badges, proof points, links, expand/collapse, WIP status badge                                                                                                                                       |
| `ContactApp`    | `contact`     | Email/resume actions, copy-email button, Formspree-powered contact form (React Hook Form + Zod validation), honeypot spam filter                                                                                                            |
| `FilesApp`      | `files`       | Nautilus-style file browser showing projects as file entries                                                                                                                                                                                |
| `BrowserApp`    | `browser`     | Simulated Firefox window pointing at GitHub profile                                                                                                                                                                                         |
| `TerminalApp`   | `terminal`    | Full xterm.js terminal with custom shell: `ls`, `cd`, `cat`, `open`, `help`, `neofetch`, `fortune`, `joke`, `hello`, `uptime`, `whoami`, `clear`, `history`, `nano`, `exit`. Can open app windows via command. ~28KB, the largest component |
| `TextEditorApp` | `text-editor` | Displays resume.md content in a read-only editor view                                                                                                                                                                                       |
| `SettingsApp`   | `settings`    | Multi-panel settings: Appearance (wallpaper, accent color, dark mode), Sound (volume, mute), Windows (snap, resize, buttons), System (boot, preferences reset)                                                                              |
| `FocusModeApp`  | `focus-mode`  | Pomodoro timer with presets, pause/resume, session stats, optional focus dimming of other windows                                                                                                                                           |

### UI (`src/components/ui/`)

| Component            | What it does                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `ActivitiesOverlay`  | GNOME Activities overview — open window thumbnails + app grid. Click to focus/open         |
| `QuickSettingsPanel` | Slide-down panel from top bar — Wi-Fi, Bluetooth, DND, dark mode, volume, brightness tiles |
| `NotificationCenter` | Slide-down from clock area — grouped notifications with dismiss/clear-all                  |
| `ToastContainer`     | Fixed position toast stack (top-right), auto-dismiss 3s                                    |
| `ContextMenu`        | Right-click desktop context menu                                                           |

## Data & Config

- **`src/config/data.ts`** — The single source of truth for all portfolio content: app definitions (`APP_DEFINITIONS`), projects (`PROJECTS`), skills (`SKILL_CATEGORIES`), boot log messages, virtual filesystem (`DEFAULT_FILE_SYSTEM`), terminal easter eggs (fortunes/jokes/greetings), wallpapers (`WALLPAPERS`), accent colors, default notifications, timing constants
- **`src/config/profile.ts`** — Personal info (name, email, resume path, availability, location) and social links
- **`src/types/index.ts`** — All TypeScript types: `AppId` union (11 apps), `WindowInfo`, `AppDefinition`, `Project`, `SkillCategory`, `Notification`, `Toast`, `WallpaperOption`, `PortfolioPreferences`, filesystem types

## CSS Architecture

```
src/styles/main.css               ← Entry point, declares layer order, imports everything
  @layer reset      ← css/base/reset.css
  @layer tokens     ← css/base/variables.css + src/styles/adwaita-tokens.css
  @layer base       ← css/base/typography.css + css/base/animations.css
  @layer components ← 18 files in css/components/
  @layer utilities  ← css/components/responsive.css
  (unlayered)       ← inline React-specific styles (incl. `i > svg` icon alignment)
```

**Key design tokens:**

- `src/styles/adwaita-tokens.css` — Faithful reproduction of GNOME 49 / libadwaita tokens (colors, typography, spacing, radius, motion, elevation) with full light/dark variants
- `css/base/variables.css` — Portfolio-specific tokens (glass effects, shadows, z-index scale, font stacks)

**Theme switching:** `data-theme="dark|light"` attribute on `<html>`. CSS uses `[data-theme='dark']` / `[data-theme='light']` selectors.

## ⛔ Do-Not-Touch Zones (the `/desktop` artifact)

> [!CAUTION]
> The following are **deliberate design decisions** for the desktop simulation at
> `/desktop`, not oversights. Do not "fix" or "modernize" them. (The primary `/`
> site is the editorial redesign in `src/site/` — that is where new portfolio work
> goes; these constraints do not apply to it.)

1. **Fedora 43 / GNOME 49 retro styling** — The desktop artifact's visual language is an intentional Fedora desktop simulation. The Adwaita tokens, Cantarell font, window chrome, top bar, dock, Activities overlay, Plymouth boot, terminal styling — all deliberate. Do not replace with generic modern web aesthetics.

2. **Persistent dock** — GNOME 49 only shows the dash in Activities. This site intentionally keeps the dock always-visible (Dash-to-Dock style) for portfolio UX so recruiters can navigate without learning gestures.

3. **Icon-plus-label buttons** — HIG prefers icon-or-label outside header bars. Combined form is intentional for recruiter scanning speed.

4. **Boot sequence** — The Plymouth boot screen is a signature feature. First-time visitors see the full boot; returning visitors skip via `fastBoot`. Do not remove it.

5. **`window.__portfolioLoadTime`** — Global set on mount for the terminal `uptime` command. Intentional.

6. **Adwaita font self-hosting** — `public/fonts/` contains Adwaita Sans/Mono WOFF2 (subsetted to Latin + Latin Extended) with their SIL license. These are deliberately self-hosted for offline PWA support and GNOME authenticity. Do not replace with Google Fonts equivalents.

7. **`head-bootstrap.js`** — Synchronous script that sets `data-theme` before React hydration. Prevents dark→light flash. Must remain synchronous and in `<head>`.

8. **The `tailwindcss` keyword in `package.json` keywords** — Tailwind has been removed from the build (it generated no CSS — there was no `@import 'tailwindcss'`). The keyword string is left in place intentionally. The CSS Layer architecture is the only styling system.

9. **Service worker unregistration in dev** — `DesktopShell` intentionally unregisters all SWs in dev mode to prevent stale cache issues.

## Scripts Reference

```bash
# Development
npm run dev              # Vite dev server on :3000, auto-opens browser

# Quality checks
npm run lint             # ESLint on src/**/*.{ts,tsx}
npm run lint:fix         # ESLint with --fix
npm run typecheck        # tsc --noEmit
npm run test             # Vitest run (single pass)
npm run test:watch       # Vitest watch mode
npm run validate         # lint → typecheck → test (full CI gate)
npm run format           # Prettier write
npm run format:check     # Prettier check

# Build
npm run build            # typecheck → generate:feeds → vite build → generate:meta → dist/
npm run preview          # Serve dist/ locally

# Utilities
npm run generate:og      # Puppeteer script to regenerate OG preview image
npm run generate:feeds   # public/rss.xml + public/sitemap.xml from published posts (runs in build)
npm run generate:meta    # dist/<route>/index.html head shells (runs in build, needs dist/)
```

## Build & Deploy

- **Build:** `npm run build` → typecheck → `scripts/generate-feeds.mjs` → `vite build` → `scripts/generate-meta.mjs`. Manual chunks (eager vendors ONLY — see the Rolldown hoisting note above):
    - `vendor-react` (react, react-dom, scheduler)
    - `vendor-router` (react-router)
    - framer-motion, @phosphor-icons, zod/react-hook-form are intentionally unlisted; they ride with their lazy importers
- **Multi-page:** Vite builds `index.html`, `offline.html`, and `404.html` as separate entries
- **Feeds:** `scripts/generate-feeds.mjs` re-reads `src/site/blog/posts/*.md` via `scripts/lib/posts.mjs` (a standalone Node mirror of the Vite loader — keep its frontmatter parser in sync with `posts.ts`) and writes `public/rss.xml` + `public/sitemap.xml`. Both are committed and deterministic (dates derive from posts), served in dev and copied to `dist/` on build.
- **Head shells:** `scripts/generate-meta.mjs` (post-build) copies `dist/index.html` to `dist/<route>/index.html` for `/writing`, `/desktop`, and every published post, rewriting `<title>`, meta description, OG/Twitter tags, and canonical per route. Shell titles must match what the React components set at runtime. It throws if `index.html`'s head shape drifts.
- **Deploy target:** Netlify (config in `netlify.toml`). Build command: `npm run build`, publish: `dist/`
- **SPA rewrite:** `/app/*` and catch-all `/*` → `/index.html` (status 200); `/work` → `/`, legacy `/blog` → `/writing` and `/blog/*` → `/:splat` are **301 redirects**
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) on push/PR to `main`: checkout → Node 22 → `npm ci` → typecheck → lint → test → build

## Tests

- **6 test files** in `src/tests/`:
    - `portfolio-interactions.test.tsx` — 12 tests: activities overlay, dock interactions, window lifecycle, settings panel switching, accent color update, Escape key, focus mode pause/resume, terminal commands
    - `additional-interactions.test.tsx` — 7 tests: ContactApp form rendering, validation, `aria-invalid`, BootScreen skip behavior, fastBoot, ResumeApp rendering
    - `keyboard-and-routing.test.tsx` — 6 tests: deep link routing (valid/invalid), window lifecycle, Escape on multi-window (mounts DesktopShell against its OWN local route table — does not exercise App.tsx's real routes)
    - `front-door-routing.test.tsx` — 2 tests: renders the real `<App>` (its BrowserRouter + route table) and asserts the portfolio hero at `/` and the writing-feed masthead at `/writing` — guards the front-door swap
    - `deep-coverage.test.tsx` — 19 tests: terminal command parsing (help, whoami, neofetch, uptime, ls, cd, cat, pwd, clear, fortune, joke, echo, date, shortcuts), contact form rate limiting, ErrorBoundary resilience (persistent failures, app-level crash)
    - `error-boundary.test.tsx` — 4 tests: window-level error UI, app-level crash screen, retry recovery, normal rendering
- **Test setup** (`src/tests/setup.ts`): mocks `matchMedia`, `AudioContext`, and `localStorage`
- **Environment:** jsdom with `vmForks` pool
- **All tests wrap components in a `Providers` harness** that mirrors the App.tsx provider nesting

## Non-Obvious Details

1. **Container queries** — `Window` sets `container-name: app-window` on `.window-body`. App CSS uses `@container app-window (max-width: ...)` for responsive layouts inside windows, independent of viewport.

2. **Launch origin animation** — `openWindow()` accepts an optional `LaunchOrigin` `{x, y}` for dock icon position, enabling a "zoom from icon" animation on window open.

3. **Snap zones** — Dragging a window to the left/right edge triggers half-screen snap. State tracked in `WindowInfo.snapState`.

4. **Virtual filesystem** — `DEFAULT_FILE_SYSTEM` in data.ts defines a full fake Linux filesystem (`/home/sawyehtet/...`) that the terminal navigates with `cd`, `ls`, `cat`.

5. **Honeypot spam field** — ContactApp includes a hidden `website_url` field positioned off-screen (not `display:none`, because bots detect that). Bots that fill it get filtered.

6. **Formspree integration** — Contact form POSTs to `https://formspree.io/f/{formId}` via native `fetch()`. No external HTTP client dependency.

7. **Two CSS token systems coexist** — `css/base/variables.css` (portfolio tokens like `--glass-bg-heavy`, `--shadow-popover`) and `src/styles/adwaita-tokens.css` (upstream libadwaita tokens like `--window-bg-color`, `--headerbar-bg-color`). Both are in the `tokens` layer. The Adwaita tokens are the source of truth for GNOME-authentic colors.

8. **`google0e39a960e13ab711.html`** — Google Search Console verification file. Do not delete.

9. **The `docs/` directory** contains a fidelity rubric and gap analysis from a previous GNOME design audit. Reference material, not build artifacts.

10. **No React Router `<Link>` components** — All navigation is via the window manager (`openWindow()`), not URL transitions. The router exists solely for deep-link entry and catch-all.

11. **String-keyed icon system** — Content is declarative: `data.ts`/`profile.ts` and the toast/notification system store icons as short string keys (`'terminal'`, `'github'`). `src/components/ui/Icon.tsx` is the single registry mapping those keys → Phosphor components. It renders the glyph inside an `<i>` wrapper at `size="1em"` with `currentColor`, so the existing CSS rules that target `i` (font-size, color, width) keep working. To add an icon: add the key→component entry to `ICON_MAP`. The static `404.html` (no React) inlines Phosphor SVGs directly, wrapped in `<i class="ph">`.

## Prettier Config

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "trailingComma": "es5",
    "printWidth": 100,
    "bracketSpacing": true,
    "arrowParens": "avoid",
    "endOfLine": "lf"
}
```

## Node Version

Requires Node `^20.19.0 || >=22.12.0` (see `engines` in package.json). CI uses Node 22.
