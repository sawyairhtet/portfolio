# Libadwaita 1.8 Reference

Fetched: 2026-05-09

Primary URLs:

- https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.8/css-variables.html
- https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.8/style-classes.html
- https://gitlab.gnome.org/GNOME/libadwaita/-/raw/1.8.5.1/src/stylesheet/_common.scss
- https://gitlab.gnome.org/GNOME/libadwaita/-/raw/1.8.5.1/src/stylesheet/widgets/_labels.scss
- https://gitlab.gnome.org/GNOME/libadwaita/-/raw/1.8.5.1/src/adw-easing.c
- https://gitlab.gnome.org/GNOME/libadwaita/-/raw/1.8.5.1/src/adw-timed-animation.c

Version anchor: GNOME 49 release notes say GNOME 49 uses libadwaita 1.8 in the developer platform notes. The 1.8 docs currently identify library version `1.8.5.1`.

## Quoted Anchors

- "predefined CSS variables for colors" - CSS variables docs: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.8/css-variables.html
- "The accent color is used across many different widgets" - accent color docs: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.8/css-variables.html#accent-colors
- "style classes can be applied to widgets" - style classes docs: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.8/style-classes.html
- "four levels of title styles" - typography style classes: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.8/style-classes.html#titles

## Named Colors

Libadwaita exposes UI colors as CSS variables and compatibility named colors. For GNOME 49/Fedora 43, the relevant source is libadwaita 1.8.5.1.

The exact color values are listed in [design-tokens.md](./design-tokens.md). Important groups:

- Accent colors: blue, teal, green, yellow, orange, red, pink, purple, slate.
- Semantic colors: destructive, success, warning, error.
- Surface colors: window, view, headerbar, sidebar, secondary sidebar, card, overview, thumbnail, toggle, dialog, popover.
- Helper colors: shade, scrollbar outline, border color formula.
- Palette variables: GNOME blue/green/yellow/orange/red/purple/brown/light/dark 1-5.
- Compatibility aliases: `@theme_bg_color`, `@theme_fg_color`, `@theme_selected_bg_color`, and related GTK3-style names.

## Typography

Libadwaita's text scale is implemented as style classes in `_labels.scss`:

- `title-1`: weight 800, size 181%.
- `title-2`: weight 800, size 136%.
- `title-3`: weight 700, size 136%.
- `title-4`: weight 700, size 118%.
- `heading`: weight 700.
- `body`: weight 400, line-height 140%.
- `caption-heading`: weight 700, size 82%.
- `caption`: weight 400, size 82%, line-height 140%.
- `document`: document font family and size, line-height 140%.
- `monospace`: monospace font family and size.
- `numeric`: enables tabular numbers with `font-feature-settings: "tnum"`.

The libadwaita CSS variable docs list `--document-font-family: Adwaita Sans`, `--document-font-size: 12pt`, `--monospace-font-family: Adwaita Mono`, and `--monospace-font-size: 11pt` as the GNOME 49-era example/system values.

## Spacing

Libadwaita does not publish a single named spacing scale in the docs, so the token file uses the 1.8 stylesheet values. The clearest global spacing constants are:

- `$menu_margin: 6px`
- `$menu_padding: 12px`
- Toolbar margin/spacing: 6px in the style-class docs and stylesheet.
- Header-bar layout uses 6px/7px padding and 6px child spacing.
- Rows and boxed lists use 6px/12px spacing and 8px/12px row padding.
- Larger layout gaps observed in the stylesheet include 18px and 24px.

This produces a practical Adwaita spacing rhythm of 3px micro steps, 6px default gaps, 12px content padding, 18px group spacing, and 24px larger separation.

## Border Radii

Core radii come from `_common.scss`:

- `$button_radius: 9px`
- `$card_radius: 12px`
- `$menu_radius: 9px`
- `$popover_radius: $menu_radius + 6`, so 15px.
- `$dialog_radius: $button_radius + 6`, so 15px.
- `--window-radius: $button_radius + 6`, so 15px.

Other component radii include 6px checks, 14px switches, 99px/100px/9999px circular or pill shapes, and 15px floating toolbar/container treatments.

## Animation Timings

Global stylesheet timings:

- `$ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- `$backdrop_transition: 200ms ease-out`
- `$focus_transition`: outline color/width/offset over 200ms using `$ease-out-quad`.
- `$button_transition`: background and box-shadow over 200ms using `$ease-out-quad`.
- `needs_attention`: 150ms ease-in.

Libadwaita API easing:

- `ADW_EASE`: cubic-bezier control points `(0.25, 0.1)` and `(0.25, 1.0)`.
- `ADW_EASE_IN`: `(0.42, 0.0)` and `(1.0, 1.0)`.
- `ADW_EASE_OUT`: `(0.0, 0.0)` and `(0.58, 1.0)`.
- `ADW_EASE_IN_OUT`: `(0.42, 0.0)` and `(0.58, 1.0)`.
- `AdwTimedAnimation` default duration is 0 ms and default easing is `ADW_EASE_OUT_CUBIC`; individual widgets set their own durations.

Common widget timings observed in source:

- Toast show/hide: 300ms; toast replacement: 500ms.
- Style-manager color-scheme switch timeout: 250ms.
- Tab grid open/close/focus/resize/icon resize: 200ms; reorder: 250ms.
- Tab overview scroll: 200ms; overview transition: 400ms.
- Tab close button: 150ms; attention indicator: 250ms.
- Entry-row empty animation: 150ms.
- Bottom-sheet stack transition: 100ms; bottom-bar reveal: 250ms.
- Spinner cycle: 1200ms.

## Implementation Notes For The Portfolio

- Treat libadwaita variables as the visual token source, not as suggestions.
- Use blue accent by default for Fedora 43 unless simulating user preference changes.
- Use 15px window radius for floating windows and 0px for maximized/fullscreen window edges.
- Use 9px for buttons, entries, menus, and most small controls.
- Keep movement short: most UI chrome transitions should be 150-250ms, with toasts and overview transitions allowed to run longer.
