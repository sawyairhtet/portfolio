# Personal Portfolio

Interactive portfolio for Saw Ye Htet, built as a Fedora 43 / GNOME-style desktop experience in the browser.

## About

The current site is a React and TypeScript application built with Vite. It recreates a desktop shell with a boot sequence, dock, draggable windows, terminal, quick settings, notifications, and deep-linkable app routes.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS v4
- React Hook Form + Zod
- Vitest
- ESLint flat config
- CSS custom properties and layered component styles

## Project Structure

```text
portfolio/
├── src/                        # React application source
│   ├── components/             # Shell, apps, windows, and UI pieces
│   ├── context/                # App-wide state providers
│   ├── config/                 # App and content data
│   ├── lib/                    # Shared utilities
│   ├── styles/                 # React CSS entry point
│   └── tests/                  # React-focused test setup
├── css/                        # Shared design tokens and layered CSS imported by React
├── public/                     # Static assets copied by Vite
├── index.html                  # Vite HTML entry
├── 404.html                    # Static 404 page
└── netlify.toml                # Netlify build and routing config
```

## Development

```bash
npm install
npm run dev
```

The app runs through Vite in development and builds into `dist/` for production.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Or run the full validation chain:

```bash
npm run validate
```

## Deployment

Netlify should build with `npm run build` and publish the `dist/` directory. The included `netlify.toml` also rewrites `/app/*` deep links to the SPA entry so app routes load correctly on refresh.

## Design notes

The shell follows the GNOME 49 / libadwaita visual language (window radius, header bars, Adwaita color ramp, Cantarell, accent #3584e4). Two intentional deviations from the HIG, kept for portfolio UX:

- **Persistent dock.** Stock GNOME 49 only shows the dash inside the Activities overview; this site keeps the dash visible at all times so visitors can navigate without learning the gesture. Closer to Dash-to-Dock than vanilla GNOME.
- **Icon-plus-label buttons in body content** (About CTAs, Contact actions, Project actions). HIG prefers icon-or-label outside header bars; the combined form is kept here because the audience is recruiters scanning quickly.
