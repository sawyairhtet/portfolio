# GNOME 49 Release Notes Reference

Fetched: 2026-05-09

Primary URLs:

- https://release.gnome.org/49/
- https://release.gnome.org/49/developers/
- https://release.gnome.org/48/
- https://gitlab.gnome.org/GNOME/nautilus/-/raw/49.0/NEWS
- https://gitlab.gnome.org/GNOME/gsettings-desktop-schemas/-/raw/49.0/schemas/org.gnome.desktop.interface.gschema.xml.in

## Quoted Anchors

- "Introducing GNOME 49, \"Brescia\"" - GNOME 49 release notes: https://release.gnome.org/49/
- "vibrant new wallpaper catalog" - GNOME 49 wallpapers: https://release.gnome.org/49/#wallpapers
- "Do Not Disturb has been moved" - GNOME 49 other improvements: https://release.gnome.org/49/#other-improvements
- "Redesigned search popover" - Files/Nautilus 49 NEWS: https://gitlab.gnome.org/GNOME/nautilus/-/raw/49.0/NEWS

## What Changed Visually Compared With GNOME 48

GNOME 48 already introduced several large visual shifts: Adwaita Sans/Mono, notification stacking, initial HDR support, slightly tweaked app colors, rounder buttons and entries, and restyled banners/toasts. GNOME 49 builds on that rather than replacing the whole visual language.

GNOME 49 release date and codename:

- Released September 17, 2025.
- Codename: Brescia.

## Desktop Chrome And Shell

GNOME 49 chrome-relevant changes:

- Do Not Disturb moved out of the notifications list and into Quick Settings.
- Lock-screen media controls were added.
- Login screen gained a more prominent accessibility menu.
- Top-bar battery icon now indicates "connected to power and not charging" states.
- HDR brightness controls moved into Quick Settings and can adjust external/multiple displays.
- A new gsetting can enable reboot/shutdown options on the lock screen.

These matter for a web recreation because GNOME 49's top-right system menu is more than status toggles; it is also the home for distraction and HDR brightness controls.

## Accent Colors

Accent colors were introduced before GNOME 49, so they are not new versus GNOME 48. They are still essential to GNOME 49/Fedora 43 fidelity.

GNOME 49's interface schema has:

- `accent-color` default: `blue`.
- Valid values: `blue`, `teal`, `green`, `yellow`, `orange`, `red`, `pink`, `purple`, `slate`.

Libadwaita 1.8 maps those names to the exact colors listed in [design-tokens.md](./design-tokens.md).

## Wallpaper

Upstream GNOME 49 adds a new wallpaper catalog engineered for HDR displays and Display P3. The release notes specifically mention Mutter rendering wallpapers at full 16-bit-per-channel RGB depth, enabled by improved color management.

For Fedora 43 Workstation, the default wallpaper is not the upstream GNOME default catalog image. Fedora ships its own `f43-backgrounds-gnome` package, with day/night JXL files and a time-of-day XML transition. See [fedora-43.md](./fedora-43.md).

## Apps With Visual Impact

Showtime replaces Totem as the default Video Player. It uses GTK 4 and libadwaita, and its playback window is chromeless: controls hide during playback and fade back only when needed.

Papers replaces Evince as the default Document Viewer. It is GTK 4/libadwaita-based, with improved performance and a refreshed UI, including a streamlined annotation flow.

Calendar has a reorganized, more adaptive interface. It can manually hide the sidebar, adapts better to smaller windows, and received readability-focused event styling changes.

Web has a new site-specific menu in the URL entry, redesigned security dialog, bookmark editing mode, improved web-app controls, and more capable in-page search.

Maps adds localized transit/highway icons and interactive labels, which affects iconography and map chrome if recreated.

Software focuses on performance, not a major chrome redesign.

## Files / Nautilus 49 Visual Notes

Nautilus 49 changes are mostly captured in its NEWS rather than the main GNOME 49 release page.

Visual and interaction-relevant changes:

- Redesigned search popover.
- Cut files use dashed border and scissor icon.
- Hidden files use transparency.
- Batch rename dialog was modernized and made adaptive.
- App chooser dialog moved to `AdwDialog`.
- Enhanced folder menu replaced the older long-press touch gesture.
- Network view can copy network addresses.
- File operation icon for finished operations changed.
- Search-related code and view code were refactored and optimized.

## Fidelity Guidance

- Do not model GNOME 49 as a radical restyle over 48. Model it as GNOME 48 Adwaita chrome plus better shell placement, new default apps, HDR wallpapers, and Nautilus search/visual-state updates.
- Notifications should support GNOME 48 stacking and GNOME 49 Quick Settings placement for Do Not Disturb.
- The wallpaper picker should allow the GNOME 49 HDR/P3 catalog idea, but Fedora 43's first-login desktop should use Fedora's own day/night JXL wallpaper.
- Files should show GNOME 49-specific search popover behavior and file-state visuals.
