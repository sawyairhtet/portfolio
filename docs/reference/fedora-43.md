# Fedora 43 Workstation Reference

Fetched: 2026-05-09

Primary URLs:

- https://docs.fedoraproject.org/en-US/fedora/latest/release-notes/desktop/
- https://fedoramagazine.org/announcing-fedora-linux-43/
- https://fedoramagazine.org/whats-new-fedora-workstation-43/
- https://fedoraproject.org/wiki/Changes/WaylandOnlyGNOME
- https://packages.fedoraproject.org/pkgs/f43-backgrounds/
- https://github.com/fedoradesign/backgrounds/tree/f43-backgrounds/default
- https://raw.githubusercontent.com/fedoradesign/backgrounds/f43-backgrounds/default/gnome-backgrounds-f43.xml
- https://raw.githubusercontent.com/fedoradesign/backgrounds/f43-backgrounds/default/f43.xml
- https://gitlab.gnome.org/GNOME/gsettings-desktop-schemas/-/raw/49.0/schemas/org.gnome.desktop.interface.gschema.xml.in

Note: the Fedora Docs page was protected from direct fetch by Anubis during this pass, but search-indexed official Fedora Docs text was available and is reflected below. Fedora Magazine, the Fedora change page, Fedora Packages, and Fedora Design background metadata were directly fetched.

## Quoted Anchors

- "Fedora Linux 43 is here!" - Fedora Magazine announcement: https://fedoramagazine.org/announcing-fedora-linux-43/
- "brand-new GNOME 49 release" - Fedora Workstation 43 article: https://fedoramagazine.org/whats-new-fedora-workstation-43/
- "GNOME X11 session has been removed" - Fedora Wayland-only change: https://fedoraproject.org/wiki/Changes/WaylandOnlyGNOME
- "Set default fallback monospace font" - Fedora Docs desktop release notes: https://docs.fedoraproject.org/en-US/fedora/latest/release-notes/desktop/
- "Fedora 43 default wallpaper for Gnome and Cinnamon" - package listing: https://packages.fedoraproject.org/pkgs/f43-backgrounds/

## Release Notes Summary

Fedora Linux 43 was announced on October 28, 2025. Fedora Workstation 43 ships GNOME 49 and completes Fedora's move to a Wayland-only GNOME desktop session.

User-visible Workstation changes:

- GNOME 49 desktop.
- GNOME on Wayland only; GNOME X11 session packages removed.
- X11 applications still run through Xwayland.
- Showtime replaces Totem as the default video player.
- Fedora 43 release also includes the new Anaconda WebUI default for Spins; Workstation already used it in Fedora 42.

Relevant plumbing changes:

- RPM 6.0.
- Bootc and Fedora CoreOS update delivery changes.
- `gdk-pixbuf2` depends on Glycin for sandboxed image loading.
- Fedora 43 sets a tentative default fallback monospace font for languages that previously missed one.
- Noto Color Emoji uses COLRv1 scalable color fonts.

## Default Workstation Theming Choices

Fedora Workstation 43 appears to follow upstream GNOME Adwaita chrome, with Fedora-specific wallpaper branding.

GNOME 49 interface schema defaults:

- GTK theme: `Adwaita`.
- Icon theme: `Adwaita`.
- Cursor theme: `Adwaita`.
- Accent color: `blue`.
- Interface font: `Adwaita Sans 11`.
- Document font: `Adwaita Sans 12`.
- Monospace font: `Adwaita Mono 11`.

Fedora-specific wallpaper package:

- Source package: `f43-backgrounds`.
- GNOME package: `f43-backgrounds-gnome`.
- Display name: `Fedora 43 Default`.
- Light/day file: `/usr/share/backgrounds/f43/default/f43-01-day.jxl`.
- Dark/night file: `/usr/share/backgrounds/f43/default/f43-01-night.jxl`.
- Static background options: `zoom`.
- Fallback primary color: `#51a2da`.
- Fallback secondary color: `#294172`.
- Local inspection of the official JXL files: 4032x3024 px, 8-bit sRGB.

Time-of-day wallpaper animation:

- Starts at 2025-10-28 08:00:00.
- Day static duration: 36000 seconds, 8 AM to 6 PM.
- Day-to-night transition: 7200 seconds, 6 PM to 8 PM.
- Night static duration: 36000 seconds, 8 PM to 6 AM.
- Night-to-day transition: 7200 seconds, 6 AM to 8 AM.

## Fidelity Guidance

- First-boot Fedora 43 Workstation should look like upstream GNOME 49 Adwaita with Fedora's F43 wallpaper, not a custom Fedora GTK shell theme.
- Use blue accent by default.
- Use the Fedora wallpaper in the desktop/lock-screen background, but keep GNOME's own wallpaper catalog available if the portfolio includes Settings > Appearance.
- Do not expose "GNOME on Xorg" in the session chooser for Fedora 43 Workstation.
- Shell and GTK app chrome should be Wayland-era GNOME 49: Adwaita fonts, Adwaita controls, libadwaita 1.8 tokens, and Fedora's wallpaper/package identity.
