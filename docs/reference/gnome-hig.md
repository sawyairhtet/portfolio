# GNOME Human Interface Guidelines Reference

Fetched: 2026-05-09

Primary URLs:

- https://developer.gnome.org/hig/
- https://developer.gnome.org/hig/guidelines/ui-styling.html
- https://developer.gnome.org/hig/guidelines/typography.html
- https://developer.gnome.org/hig/guidelines/adaptive.html
- https://developer.gnome.org/hig/patterns/containers/header-bars.html
- https://developer.gnome.org/hig/patterns/feedback/notifications.html
- https://developer.gnome.org/hig/reference/palette.html
- https://developer.gnome.org/hig/reference/backgrounds.html

## Quoted Anchors

- "recent versions of the GNOME platform, in particular GTK 4 and Libadwaita" - HIG platform definition: https://developer.gnome.org/hig/
- "The visual style used for UI in GNOME is called Adwaita." - UI styling: https://developer.gnome.org/hig/guidelines/ui-styling.html
- "In GNOME, the default font is Adwaita Sans" - Typography: https://developer.gnome.org/hig/guidelines/typography.html
- "Header bars are a standard element that span the top of windows." - Header bars: https://developer.gnome.org/hig/patterns/containers/header-bars.html

## Practical Summary

GNOME's HIG is the design source of truth for apps using GTK 4 and libadwaita. For this portfolio, that means the desktop simulation should feel like a GNOME platform surface first: Adwaita styling, GTK/libadwaita widget proportions, standard header bars, restrained use of color, and layouts that remain adaptive rather than web-page-like.

Adwaita is the GNOME UI style. The HIG explicitly treats light and dark styles as platform features, and points custom styling back to existing libadwaita style classes and CSS variables wherever possible. For a faithful desktop recreation, custom chrome should therefore be shaped from Adwaita tokens rather than a parallel theme.

Typography should use system defaults. GNOME 49/Fedora 43 use Adwaita Sans for interface text. HIG-standard text classes are `body`, `heading`, `caption`, `caption-heading`, `large-title`, and `title-1` through `title-4`; libadwaita provides the exact scale in its stylesheet.

Header bars are top-window chrome. The HIG expects a small number of controls, aligned to start/center/end zones, with drag space preserved. Header-bar buttons should usually be icon or icon+label controls with flat background treatment.

Notifications are system-owned surfaces. They have app icon, title, optional body, default action, and up to three action buttons. Use them sparingly, remove stale notifications, and do not make them the only place critical information exists.

Adaptive sizing matters. The HIG names 1024x600 px as the smallest recommended GNOME desktop display size, and 360x294 px for phone-appropriate apps. A faithful web desktop should not break at these constraints.

Backgrounds should be designed as square assets, centered, cropped by GNOME's zoom behavior, and compatible with the lock screen blur. The HIG recommends 4096x4096 px wallpaper images; Fedora 43's default wallpaper is a 4032x3024 JXL and is therefore a Fedora-specific distribution choice rather than the upstream GNOME wallpaper recommendation.

The GNOME palette in the HIG is primarily for app icons and illustrations. The exact UI color tokens come from libadwaita, while the full palette values are repeated in both the HIG palette reference and libadwaita CSS variables.

## Implementation Notes For The Portfolio

- Build windows around Adwaita header bars, not browser-style titlebars.
- Keep button and entry controls compact, icon-led, and visually calm.
- Use Adwaita Sans and Adwaita Mono defaults unless explicitly simulating fallback behavior.
- Use libadwaita color variables for surfaces and states; use the HIG palette for icon/illustration accents.
- Model wallpaper cropping with centered zoom behavior and lock-screen blur in mind.
- Preserve light/dark mode parity, including the Fedora 43 day/night wallpaper pair.
