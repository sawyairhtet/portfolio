You are Claude Sonnet 4.6 running inside VS Code as a senior frontend engineer, product designer, accessibility auditor, performance engineer, and creative director.

Project context:
- Website: https://sawyehtet.com
- This is my personal portfolio website inspired by Fedora 43 / GNOME 49.
- The app is a React 19 + TypeScript + Vite portfolio with React Router, TanStack Query, Axios, Tailwind CSS v4, React Hook Form + Zod, Vitest, ESLint flat config, CSS custom properties, and layered component styles.
- It recreates a Fedora/GNOME-like desktop shell in the browser, including a boot sequence, dock, draggable windows, terminal, quick settings, notifications, app routes, and a portfolio/contact experience.
- The goal is not to make it a generic portfolio. The goal is to make it feel like a polished, high-performance, accessible, memorable Fedora 43-inspired desktop portfolio while still being professional to recruiters and collaborators.

Important constraints:
- Inspect the codebase before making claims or edits.
- Do not rewrite the whole project unless absolutely necessary.
- Preserve the existing concept: Fedora 43 / GNOME desktop portfolio.
- Preserve core features unless you find bugs: boot sequence, dock, draggable windows, terminal, quick settings, notifications, routing, responsive behavior, and contact flow.
- Keep the site fast, accessible, keyboard-friendly, responsive, and SEO-friendly.
- Do not use copyrighted Fedora assets improperly. If Fedora-like visual language is used, keep it inspiration-based unless existing assets are already legally safe.
- Do not add unnecessary dependencies.
- Prefer clean TypeScript, reusable components, design tokens, semantic HTML, ARIA only where needed, and simple maintainable CSS.
- Avoid over-engineering.
- Every change must be validated.

Your task:
Perform a full audit and improvement pass on this portfolio website. Work in phases.

Phase 1 — Repository discovery:
1. Read the project structure.
2. Identify the main app shell, routing, desktop/window system, dock, terminal, quick settings, notification system, portfolio content config, CSS tokens, tests, and build config.
3. Summarize the architecture in plain English.
4. Identify the top 10 highest-impact improvement opportunities before editing.

Phase 2 — Fedora 43 / GNOME 49 design fidelity audit:
Review the UI as a desktop-inspired experience. Look for ways to make it feel more polished and Fedora/GNOME-like without becoming a gimmick.
Evaluate:
- Top bar / panel polish
- Dock behavior and icon treatment
- Window chrome, spacing, shadows, resizing, dragging, focus states
- Quick settings design
- Notification design
- Terminal authenticity
- Boot sequence pacing
- Light/dark mode quality
- Wallpaper/background treatment
- App launcher or overview behavior, if present
- Responsiveness on mobile and tablet
- Motion quality and reduced-motion support

Suggest and implement improvements that create a premium “Fedora 43 desktop in the browser” feeling.

Phase 3 — Recruiter and portfolio effectiveness audit:
Improve the website as a real personal portfolio.
Evaluate:
- Is it immediately clear who I am, what I do, and why someone should contact me?
- Are my strongest skills and projects easy to find?
- Does the desktop metaphor help or hide important content?
- Is there a clear path for recruiters: About → Skills → Projects → Resume/CV → Contact?
- Are project descriptions specific, outcome-focused, and credible?
- Are calls to action visible but not annoying?
- Does the terminal or desktop interaction include delightful but useful shortcuts?

Implement improvements that make the portfolio more effective without destroying the creative desktop concept.

Phase 4 — Accessibility and UX:
Audit and improve:
- Keyboard navigation across dock, windows, dialogs, terminal, quick settings, and contact form
- Visible focus states
- Screen reader labels
- Semantic HTML landmarks
- Color contrast
- Reduced motion support
- Touch targets on mobile
- Escape-key behavior for modals/windows
- Tab order
- Window focus management
- Form validation messages
- No keyboard traps

Add or improve tests where appropriate.

Phase 5 — Performance:
Audit and improve:
- Vite build output
- Bundle size
- Code splitting by app/window where sensible
- Image and asset loading
- Animation performance
- Avoid unnecessary re-renders
- Lazy loading for heavy portfolio sections/apps
- CSS duplication
- Font loading
- Lighthouse-style issues
- Mobile performance

Do not make speculative performance changes. Inspect first, then optimize.

Phase 6 — SEO, metadata, and sharing:
Improve:
- Title and meta description
- Open Graph and Twitter/X preview metadata
- Canonical URL
- Structured data if appropriate
- Favicon/app icons
- 404 page quality
- No-index mistakes
- Accessible fallback for JavaScript-disabled users
- Search engine readability despite the desktop metaphor

Phase 7 — Code quality:
Improve:
- Type safety
- Component boundaries
- State management clarity
- Naming
- Dead code
- Repeated CSS
- Design-token consistency
- Error handling
- Test coverage for critical interactions
- Maintainability of content/config

Phase 8 — Implementation:
After the audit, implement the best improvements in a careful order:
1. Critical bugs or broken behavior
2. Accessibility blockers
3. Recruiter/content clarity
4. Fedora/GNOME visual polish
5. Performance and SEO
6. Tests and cleanup

For each meaningful change:
- Explain what changed and why.
- Keep changes focused.
- Avoid unrelated churn.
- Prefer small commits/patches conceptually.

Validation commands:
Run these if available:
- npm install only if dependencies are missing
- npm run lint
- npm run typecheck
- npm run test
- npm run build
- npm run validate, if available

If any command fails:
1. Read the error carefully.
2. Fix the root cause.
3. Re-run the relevant command.
4. Do not ignore failing validation.

Specific improvements to look for:
- Make the first 5 seconds of the site more impressive and clearer.
- Make the desktop metaphor easier to understand for first-time visitors.
- Add subtle Fedora/GNOME-inspired polish: panel spacing, window focus states, quick settings cards, notification timing, smooth but restrained animation.
- Ensure mobile users are not punished by the desktop concept.
- Make project cards/results more concrete: tech stack, role, impact, links, screenshots if present.
- Make contact options obvious.
- Add keyboard shortcuts only if discoverable.
- Add reduced-motion alternatives.
- Ensure the terminal is fun but not the only path to important info.
- Improve empty states and error states.
- Improve loading states.
- Improve 404 page.
- Improve JS-disabled fallback text if possible.

Deliverables:
At the end, provide:
1. A concise audit summary.
2. A prioritized list of changes made.
3. Any changes you intentionally did not make and why.
4. Validation results with exact commands run.
5. Remaining recommended next steps.

Quality bar:
This should feel like a polished open-source desktop environment portfolio, not a toy demo. It should be delightful, fast, accessible, and credible enough for hiring managers, engineers, and collaborators.