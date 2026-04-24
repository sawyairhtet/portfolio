# Legacy JavaScript (Not in Use)

> **⚠️ This folder is NOT used by the live site.**

The portfolio has been migrated to **React + TypeScript** (`src/` directory).  
The entry point is `src/main.tsx`, loaded from `index.html`.

This `js/` folder contains the original vanilla JavaScript implementation (~110KB)
and is preserved for historical reference only. It is not imported, bundled, or
executed by Vite.

## Structure (archived)

- `app.js` — Original monolithic app controller
- `apps/` — App content renderers (about, skills, projects, etc.)
- `core/` — Window manager, theme, sound, keyboard shortcuts
- `ui/` — Dock, top bar, activities overlay, sticky notes
- `config/` — Data constants (now in `src/config/data.ts`)
- `types.js` — JSDoc type definitions (now TypeScript in `src/types/`)

## Safe to Delete?

Yes — removing this folder will not affect the live site. It exists solely
as a reference for the vanilla → React migration.
