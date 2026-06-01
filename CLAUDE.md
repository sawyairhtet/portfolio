# CLAUDE.md — Repository Guide

> Quick-reference for any AI assistant or new contributor working on this codebase.

## Stack & Key Dependencies

| Layer     | Technology                                       | Version | Notes                                                                                                                       |
| --------- | ------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| Framework | React                                            | 19      | StrictMode enabled                                                                                                          |
| Language  | TypeScript                                       | 5       | Strict, `noEmit`, bundler module resolution                                                                                 |
| Bundler   | Vite                                             | 8       | Dev on `:3000`, builds to `dist/`                                                                                           |
| Styling   | CSS Layers (vanilla)                             | —       | `@layer reset, tokens, base, components, utilities` ordering. Predominantly vanilla CSS — no Tailwind                       |
| Routing   | React Router DOM                                 | 7       | BrowserRouter, two routes: `/` and `/app/:appId`                                                                            |
| Forms     | React Hook Form + Zod                            | 7 / 4   | Used by ContactApp; code-split into `vendor-forms` chunk                                                                    |
| Terminal  | @xterm/xterm                                     | 6       | Real xterm.js instance inside TerminalApp                                                                                   |
| Icons     | @phosphor-icons/react                            | 2       | Single icon system. String keys → Phosphor components via `src/components/ui/Icon.tsx`. Split into the `vendor-icons` chunk |
| Fonts     | Adwaita Sans/Mono (self-hosted WOFF2, subsetted) | —       | Fully self-hosted in `public/fonts/` with SIL license. **No external font requests** (no Google Fonts)                      |
| Testing   | Vitest + Testing Library + jsdom                 | 4 / 16  | `vmForks` pool, globals enabled                                                                                             |
| Linting   | ESLint flat config + Prettier                    | 9 / 3   | 4-space indent, single quotes, trailing comma es5                                                                           |
| Analytics | Plausible                                        | —       | Script tag in index.html, domain `sawyehtet.com`                                                                            |
| Deploy    | Netlify                                          | —       | Build: `npm run build`, publish: `dist/`, SPA rewrite for `/app/*`                                                          |
| PWA       | Service worker (`public/sw.js`) + manifest.json  | —       | Caches static assets, offline fallback page                                                                                 |

## Entry Point & Routing

```
index.html                          ← Vite HTML entry, loads /src/main.tsx
  └─ src/main.tsx                   ← ReactDOM.createRoot, imports main.css
       └─ src/App.tsx               ← BrowserRouter + 6 context providers
            ├─ /                    → DesktopShell
            ├─ /app/:appId          → DeepLinkHandler (opens window, renders DesktopShell)
            └─ *                    → DesktopShell (catch-all)
```

**Deep linking:** `/app/about`, `/app/projects`, etc. The `DeepLinkHandler` validates the `appId` against the `AppId` union type and calls `openWindow()`. Netlify rewrites `/app/*` → `/index.html` (status 200) to support SPA refresh.

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

## ⛔ Do-Not-Touch Zones

> [!CAUTION]
> The following are **deliberate design decisions**, not oversights. Do not "fix" or "modernize" them.

1. **Fedora 43 / GNOME 49 retro styling** — The entire visual language is an intentional Fedora desktop simulation. The Adwaita tokens, Cantarell font, window chrome, top bar, dock, Activities overlay, Plymouth boot, terminal styling — all deliberate. Do not replace with generic modern web aesthetics.

2. **Persistent dock** — GNOME 49 only shows the dash in Activities. This site intentionally keeps the dock always-visible (Dash-to-Dock style) for portfolio UX so recruiters can navigate without learning gestures.

3. **Icon-plus-label buttons** — HIG prefers icon-or-label outside header bars. Combined form is intentional for recruiter scanning speed.

4. **Boot sequence** — The Plymouth boot screen is a signature feature. First-time visitors see the full boot; returning visitors skip via `fastBoot`. Do not remove it.

5. **`window.__portfolioLoadTime`** — Global set on mount for the terminal `uptime` command. Intentional.

6. **Adwaita font self-hosting** — `public/fonts/` contains Adwaita Sans/Mono WOFF2 (subsetted to Latin + Latin Extended) with their SIL license. These are deliberately self-hosted for offline PWA support and GNOME authenticity. Do not replace with Google Fonts equivalents.

7. **`head-bootstrap.js`** — Synchronous script that sets `data-theme` before React hydration. Prevents dark→light flash. Must remain synchronous and in `<head>`.

8. **The `tailwindcss` keyword in `package.json` keywords** — Tailwind has been removed from the build (it generated no CSS — there was no `@import 'tailwindcss'`). The keyword string is left in place intentionally. The CSS Layer architecture is the only styling system.

9. **`instruction.md`** — Claude Code project instructions file for a previous audit. Keep for reference.

10. **Service worker unregistration in dev** — `DesktopShell` intentionally unregisters all SWs in dev mode to prevent stale cache issues.

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
npm run build            # typecheck → vite build → dist/
npm run preview          # Serve dist/ locally

# Utilities
npm run generate:og      # Puppeteer script to regenerate OG preview image
```

## Build & Deploy

- **Build:** `npm run build` → typechecks then produces `dist/` with manual chunks:
    - `vendor-react` (react, react-dom, scheduler)
    - `vendor-router` (react-router)
    - `vendor-motion` (framer-motion)
    - `vendor-icons` (@phosphor-icons/react)
    - `vendor-forms` (zod, react-hook-form) — only loaded with ContactApp
- **Multi-page:** Vite builds `index.html`, `offline.html`, and `404.html` as separate entries
- **Deploy target:** Netlify (config in `netlify.toml`). Build command: `npm run build`, publish: `dist/`
- **SPA rewrite:** `/app/*` → `/index.html` (status 200) for deep-link support
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) on push/PR to `main`: checkout → Node 22 → `npm ci` → typecheck → lint → test → build

## Tests

- **4 test files** in `src/tests/`:
  - `portfolio-interactions.test.tsx` — 12 tests: activities overlay, dock interactions, window lifecycle, settings panel switching, accent color update, Escape key, focus mode pause/resume, terminal commands
  - `additional-interactions.test.tsx` — 7 tests: ContactApp form rendering, validation, `aria-invalid`, BootScreen skip behavior, fastBoot, ResumeApp rendering
  - `keyboard-and-routing.test.tsx` — 6 tests: deep link routing (valid/invalid), window lifecycle, Escape on multi-window
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
