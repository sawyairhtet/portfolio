# 3D Portfolio – Improvement Roadmap

Below is a living backlog of enhancements and experiments we can tackle. Tick items off, add dates/owners, or reprioritise as needed.

## 📈 Recent Progress Summary

**Latest Update: January 2025**

✅ **Major Features Completed:**

- **Advanced Keyboard Navigation** - Full keyboard shortcuts system (Arrow keys, 1-4 keys) - clean implementation without visual indicators
- **LocalStorage Management** - Persistent user preferences, last visited section, and visit history tracking
- **Progress Indicator** - Beautiful timeline showing navigation progress through portfolio sections
- **Bundle Optimization** - Advanced Webpack code splitting for better performance

🚫 **Features Removed per User Preference:**

- **Dark/Light Theme System** - Removed to maintain fixed dark theme aesthetic
- **Skip Intro Button** - Removed for cleaner interface
- **Keyboard Shortcut Tooltips** - Removed "Press X" visual indicators for cleaner navigation

🎯 **Key Improvements Made:**

- Clean, streamlined navigation without visual clutter
- Seamless keyboard navigation behind the scenes
- Better performance through intelligent code splitting
- Comprehensive user preference management
- Modern, minimal design system

📊 **Progress: 4/16 major sections have active implementations**

## 1. Visual Design & UI Polish

- [x] ~~Dark / light theme toggle (remember preference)~~ ❌ **REMOVED** - User preferred fixed dark theme for consistent aesthetic
- [ ] Micro-interactions (hover ripples, card tilt, parallax backgrounds)
- [ ] Unique accent colours per panel
- [ ] Simplified "reading mode" without 3D scene

## 2. UX & Navigation

- [x] Keyboard shortcuts for panel switching ✅ **COMPLETED** - Clean keyboard navigation (1-4 keys, arrows) without visual tooltips
- [x] Persist last-visited panel in `localStorage` ✅ **COMPLETED** - LocalStorage manager with visit history tracking
- [x] Progress indicator or timeline for panel count ✅ **COMPLETED** - Beautiful progress indicator with step visualization
- [x] ~~Skip-intro button for motion-sensitive visitors~~ ❌ **REMOVED** - User preferred cleaner interface without extra buttons

## 3. Performance & Loading Strategy

- [ ] Compress GLTF/GLB models (Draco / Meshopt)
- [ ] Lazy-load models & heavy scripts per section
- [x] Bundle-split with Webpack (initial vs. on-demand) ✅ **COMPLETED** - Advanced bundle splitting with separate chunks for UI, Three.js, animations
- [ ] AVIF/WebP image variants
- [ ] Lighthouse CI budget tracking

## 4. Accessibility (a11y)

- [ ] Logical tab order & focus rings on all controls
- [ ] ARIA roles/labels for 3D canvas
- [ ] Reduced-motion "static" mode
- [ ] Skip-to-content link & ARIA live-region for panel changes

## 5. SEO & Social Sharing

- [ ] Real meta-title / description per panel (via JS router)
- [ ] JSON-LD structured data (`Person`, `CreativeWork`)
- [ ] Auto-generated OG/Twitter images

## 6. Content Depth

- [ ] Case-study pages for projects
- [ ] Markdown/blog section powered by a headless CMS
- [ ] Downloadable résumé PDF & print stylesheet
- [ ] Testimonials carousel

## 7. Three.js Interactivity

- [ ] Object picking → open project details
- [ ] Post-processing effects (toggleable)
- [ ] Camera storytelling path on scroll
- [ ] Day/night themed scene

## 8. Responsiveness & Device Tweaks

- [ ] Touch gesture optimisation (pinch, two-finger rotate)
- [ ] GPU capability detection → fallback
- [ ] Foldable / tablet breakpoint tests

## 9. PWA & Offline Support

- [ ] Service-worker caching for offline access
- [ ] "Offline" panel with résumé and basic info

## 10. Analytics & Insights

- [ ] Privacy-friendly analytics (Plausible/Umami)
- [ ] Web-vitals reporting to backend

## 11. Internationalisation

- [ ] JSON-based i18n files & language toggle
- [ ] RTL layout testing

## 12. Testing & QA

- [ ] Unit tests (Jest) for utilities
- [ ] Playwright E2E navigation/form tests
- [ ] Visual-regression snapshots for 3D canvas

## 13. CI / CD

- [ ] GitHub Actions pipeline (lint → test → build → deploy)
- [ ] Lighthouse and a11y automated checks
- [ ] Dependabot / Renovate for dependencies

## 14. Security & Privacy

- [ ] Strong Content-Security-Policy header
- [ ] reCAPTCHA / hCaptcha on contact form
- [ ] Privacy statement page

## 15. Codebase Maintainability

- [ ] Migration to TypeScript for scripts
- [ ] Modular ES-module organisation
- [ ] eslint-plugin-three & Prettier hooks

## 16. Fun & Engagement

- [ ] Easter-egg hidden object → secret message
- [ ] Tech-stack heatmap visualisation
- [ ] Visitor counter hologram (serverless backend)

---

\_Last updated: 2025-01-26 - Removed tooltip visual indicators and cleaned up navigation interface per user feedback
