# GNOME 49 / Fedora 43 Gap Analysis

Audited: 2026-05-09  
Scope: post-token-pass re-score of categories touched in the GNOME/Fedora fidelity implementation, using `docs/fidelity-rubric.md`.

I am marking color fidelity 5/5 because the current static audit can trace every UI color outside `src/styles/adwaita-tokens.css` back to a libadwaita/Fedora token or token-derived `color-mix(...)`. I am not marking typography 5/5 yet: the font families and letter spacing are now correct, but component-local font sizes still remain.

## Summary

| Category              |    Score |
| --------------------- | -------: |
| Color fidelity        |  5.0 / 5 |
| Typography fidelity   |  3.5 / 5 |
| Window chrome         |  4.0 / 5 |
| Motion                | 3.25 / 5 |
| Activities overview   |  3.5 / 5 |
| Authentic apps        |  2.0 / 5 |
| Keyboard fidelity     |  3.0 / 5 |
| Sound design          |  1.5 / 5 |
| Easter eggs and depth |  3.5 / 5 |

Average: **3.25 / 5**. Judgment band: **convincing at a glance, weak under use**. The shell now has several real GNOME-like systems, and the color layer is token-faithful, but the desktop is still not defensible as a total 5/5 GNOME 49 clone under screenshot and behavior comparison.

## 1. Color Fidelity: 5.0 / 5

Improved:

- `src/styles/main.css` imports `src/styles/adwaita-tokens.css`.
- `src/context/ThemeContext.tsx` drives `--accent-bg-color`, so accent swapping now cascades.
- `css/base/variables.css` now maps legacy aliases such as `--accent`, `--surface-*`, `--text-*`, `--fedora-*`, shadows, dock colors, terminal colors, and icon-gradient colors back to libadwaita/Fedora tokens.
- `css/components/apps.css`, `css/components/focus-mode.css`, `css/components/layout.css`, `css/components/settings.css`, `css/components/quick-settings.css`, `css/components/top-bar.css`, `css/components/notification-center.css`, `css/components/responsive.css`, `css/components/context-menu.css`, `css/components/ui-elements.css`, `css/components/plymouth.css`, and `src/styles/404.css` no longer contain raw UI colors.
- Static audit: `rg -n "#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(" src css --glob '!src/styles/adwaita-tokens.css'` returns no matches.
- Undefined-token audit: all referenced CSS custom properties now have a stylesheet definition or an intentional runtime setter.

Screenshot-in-words:

- The desktop welcome overlay, top bar, notifications, quick settings, app pages, focus mode, 404 route, and mobile launcher all derive their blue accent, surface colors, text colors, borders, and shadows from Adwaita tokens. Swapping `--accent-bg-color` now carries through the visible chrome instead of leaving old literal blue/green/yellow values behind.

Why 5:

- Every authored UI color outside the token file is traceable to a documented token or a `color-mix(...)` using documented tokens. The remaining raw values live in `src/styles/adwaita-tokens.css`, which is the source-of-truth token file.

Residual risk:

- This is a static-token 5/5, not a claim that every component layout is visually identical to GNOME. A screenshot can still catch non-color issues in spacing, typography, and app structure.

## 2. Typography Fidelity: 3.5 / 5

Improved:

- Adwaita Sans and Adwaita Mono are self-hosted in `public/fonts/`.
- `css/base/typography.css` defines the HIG scale classes and defaults to Adwaita Sans / Adwaita Mono.
- Terminal/Text Editor code surfaces use Adwaita Mono.
- Font family audit no longer finds Cantarell, system-ui fallbacks, JetBrains Mono, Fira Code, Source Code Pro, Arial, or other non-Adwaita family declarations in authored app CSS.
- Undefined scale references such as `--title-1-font-size`, `--caption-font-size`, `--heading-font-weight`, and `--body-font-size` were removed and replaced with the existing HIG aliases: `--font-size-display`, `--font-size-2xl`, `--font-size-xl`, `--font-size-lg`, `--font-size-base`, and `--font-size-sm`.
- Letter spacing is normalized to `0` across the authored shell/app CSS.

Why not 5:

- Many component-local font sizes remain, especially in `css/components/apps.css`, `css/components/settings.css`, `css/components/notification-center.css`, `css/components/focus-mode.css`, `css/components/responsive.css`, `css/components/dock.css`, `css/components/activities.css`, and icon-heavy selectors.
- Some remaining numeric sizes are icon glyph sizes and may be acceptable, but several are still text labels, headings, and responsive overrides rather than explicit HIG scale classes.
- `css/components/focus-mode.css` still uses responsive `clamp(...)` timer and panel heading sizes, which is not the exact libadwaita text scale.

To reach 5:

- Replace all remaining text-facing numeric `font-size` values with `title-1` through `title-4`, `heading`, `body`, `caption`, `document`, `monospace`, and `numeric`.
- Separate icon glyph sizing from typography in the audit so icon dimensions do not hide real text-scale misses.
- Audit at 100%, 125%, and 150% zoom.

## 3. Window Chrome: 4.0 / 5

Improved:

- Rendered check: `docs/reference/rendered/window-chrome-side-by-side.png`.
- Measured portfolio values: 47px headerbar, 12px radius, two-layer GTK-style shadow, and three 24px right-side controls.
- Controls use self-hosted GNOME symbolic SVG masks from `public/icons/adwaita/window/`.
- Windows drag, resize, focus, minimize, maximize/restore, snap, stack, and double-click maximize.

Why not 5:

- The official GNOME 49 Calendar screenshot used for comparison shows only Close; this portfolio intentionally shows Minimize, Maximize, and Close because the implementation pass requested all three.
- Files chrome is still structurally simplified: the real Nautilus headerbar packs navigation/search/view/menu affordances differently.
- Focus/backdrop states are close but not yet proven against multiple real GNOME windows.
- Drag and resize work, but hit regions and edge behavior have not been compared pixel-by-pixel against GTK.

To reach 5:

- Decide per app whether the real GNOME 49 window shows only Close or all three controls, then match that app exactly.
- Compare focused/unfocused, maximized, snapped, and backdrop screenshots.
- Tune Files/Nautilus headerbar composition to the real GNOME 49 layout.

## 4. Motion: 3.25 / 5

Improved:

- Touched shell/window/overview/dock/terminal/keyboard files no longer contain `transition: all`, ad-hoc `ease`, or custom cubic curves.
- The color/typography pass also removed lingering ad-hoc motion in quick settings, context menus, notifications, focus-mode controls, desktop welcome, and the 404 route.
- Window open now zooms from a launch origin instead of fading.
- Reduced-motion handling skips transforms while preserving opacity/color state.

Why not 5:

- Legacy compatibility aliases `--ease-out-expo` and `--ease-spring` remain in `css/base/variables.css` for old selectors, though they now resolve to `--ease-out-quad`.
- Some durations are still interaction-tuned rather than proven against a GNOME 49 screen recording.
- The window-open "spring" is a keyframed approximation, not a real GNOME Shell physics match.
- Overview animation timing has not been matched against frame-by-frame GNOME 49 capture.
- Animations are not fully interruptible/cancellable like native shell transitions.

To reach 5:

- Remove remaining `ease`, `ease-in-out`, custom cubic curves, and legacy aliases from all CSS.
- Match overview/window/dock animation frame timing against real GNOME 49 recordings.
- Add proper cancellation behavior for repeated Super, app launches, close/open races, and workspace switching.

## 5. Activities Overview: 3.5 / 5

Improved:

- Super opens/closes Activities.
- The overlay now has a top search bar, bottom dash, right workspace strip, open-window grid, and app filtering.
- Search filters both apps and open windows.

Why not 5:

- Workspace thumbnails are visual state, not a real workspace model with window membership.
- Window previews are app cards, not live scaled thumbnails.
- There is no drag-to-workspace behavior.
- Search and app grid keyboard navigation are still web-style tab stops, not GNOME Shell roving focus.

To reach 5:

- Add real workspaces to window state.
- Render live or faithful window thumbnails.
- Implement drag-to-workspace, workspace creation/removal behavior, and GNOME-style keyboard navigation.

## 6. Authentic Apps: 2.0 / 5

Improved:

- Files exists and has sidebar places, pathbar, list/grid views, Recent, Projects, and double-click project opening.
- Console is now backed by xterm.js with history, tab completion, scrollback, and commands such as `whoami`, `cat resume.txt`, `ls projects/`, `cd`, `open`, `neofetch`, and `help`.
- Text Editor exists for `nano resume.md`.
- Firefox exists for the `firefox` command.

Why not 5:

- Calendar and Image Viewer are still missing, which caps this category hard.
- Files lacks Nautilus details: path entry mode, search popover, rename, trash, context menus, hidden-file transparency, cut-file scissor/dashed state, real selection model, and exact columns.
- Console lacks tabs/sessions, copy/paste fidelity, selection behavior, and GNOME Console headerbar/menu behavior.
- Text Editor lacks search, undo/redo fidelity, save/open dialogs, realistic menus, and unsaved indicators in window chrome.
- Settings is still a small portfolio preferences app, not the full GNOME Settings set.

To reach 5:

- Implement Calendar and Image Viewer.
- Bring Files, Console, Text Editor, and Settings up to real primary workflows plus secondary states.
- Make portfolio content behave as app data, not custom portfolio app shells.

## 7. Keyboard Fidelity: 3.0 / 5

Improved:

- Super toggles Activities.
- Alt+Tab shows a custom switcher overlay.
- Ctrl+Alt+Left/Right changes workspace index.
- Super+number focuses dock apps.
- Esc closes overlays or the topmost window.
- `/` opens Settings and `?` opens a GNOME-styled shortcuts sheet.
- Terminal supports Enter, Ctrl+L, Tab completion, and Up/Down history.

Why not 5:

- Workspaces are not real yet, so Ctrl+Alt+Left/Right does not move between actual workspace contents.
- Alt+Tab is basic and not proven MRU-accurate against GNOME.
- `/` should start search in Files and GNOME apps where appropriate, not globally open Settings.
- Arrow-key navigation for app grids, Files lists/grids, workspace previews, and menus is incomplete.
- Focus restoration after every close/minimize/dialog path has not been exhaustively verified.

To reach 5:

- Add real workspace state and MRU window ordering.
- Implement app-specific shortcuts: Files search/path entry, Text Editor search/save, Console copy/paste, Settings search.
- Add roving focus and arrow-key navigation across shell and app grids/lists.

## 8. Sound Design: 1.5 / 5

Improved:

- No meaningful change in this pass beyond notification/action flow.
- Existing sound still respects first user gesture and exposes mute/volume settings.

Why not 5:

- Notification arrival, button activation, toggles, errors, terminal bell, calendar reminders, volume changes, and lock/login sounds are not implemented as Adwaita-style event sounds.
- Do Not Disturb does not comprehensively suppress sound events because most sound events do not exist yet.

To reach 5:

- Add restrained Adwaita-style event sounds, gated by user gesture, mute, volume, and DND.
- Avoid hover/pointer-move sounds and overlapping playback.

## 9. Easter Eggs And Depth: 3.5 / 5

Improved:

- `nano resume.md` opens a real Text Editor window.
- `firefox` opens a Firefox/GitHub window.
- Settings can switch through self-hosted Fedora 43 and GNOME 49 wallpapers.
- First visit creates a welcome notification/toast with a View Resume action.
- Terminal commands can affect real app state.

Why not 5:

- Wallpaper changes persist, but many other deep states are not persistent or GNOME-specific.
- No lock screen, media controls, battery edge states, HDR brightness state, calendar reminders, or workspace persistence.
- Files lacks hidden/cut/trash/recent-file depth.
- Notifications do not yet stack and behave exactly like GNOME 49 notifications under multiple apps/actions.

To reach 5:

- Add authentic secondary states across Files, Settings, Calendar, lock screen, battery/power, workspace overview, and notifications.
- Keep every hidden detail integrated with real shell/app state, not just terminal output.
