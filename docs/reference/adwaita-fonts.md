# Adwaita Sans And Adwaita Mono Reference

Fetched: 2026-05-09

Primary URLs:

- https://gitlab.gnome.org/GNOME/adwaita-fonts/-/raw/49.0/README.md
- https://gitlab.gnome.org/GNOME/adwaita-fonts/-/raw/49.0/meson.build
- https://download.gnome.org/sources/adwaita-fonts/49/adwaita-fonts-49.0.tar.xz
- https://gitlab.gnome.org/GNOME/gsettings-desktop-schemas/-/raw/49.0/schemas/org.gnome.desktop.interface.gschema.xml.in
- https://developer.gnome.org/hig/guidelines/typography.html
- https://release.gnome.org/48/

## Quoted Anchors

- "Adwaita Sans, a variation of Inter" - Adwaita Fonts README: https://gitlab.gnome.org/GNOME/adwaita-fonts/-/raw/49.0/README.md
- "Adwaita Mono, Iosevka customized to match Inter" - Adwaita Fonts README: https://gitlab.gnome.org/GNOME/adwaita-fonts/-/raw/49.0/README.md
- "Default font used by gtk+" - GNOME 49 schema: https://gitlab.gnome.org/GNOME/gsettings-desktop-schemas/-/raw/49.0/schemas/org.gnome.desktop.interface.gschema.xml.in

## Version And License

Adwaita Fonts version for GNOME 49: `49.0`.

License from `meson.build`: `OFL-1.1`.

Installed font files from `meson.build`:

- `sans/AdwaitaSans-Regular.ttf`
- `sans/AdwaitaSans-Italic.ttf`
- `mono/AdwaitaMono-Regular.ttf`
- `mono/AdwaitaMono-Italic.ttf`
- `mono/AdwaitaMono-Bold.ttf`
- `mono/AdwaitaMono-BoldItalic.ttf`

## Defaults In GNOME 49

From `org.gnome.desktop.interface` schema tag `49.0`:

- Interface font: `Adwaita Sans 11`.
- Document font: `Adwaita Sans 12`.
- Monospace font: `Adwaita Mono 11`.

These are the default font specs that replace the older GNOME stack's Cantarell and Source Code Pro defaults.

## Adwaita Sans Specs

Source family: Inter 4.1.

Build script details:

- Downloads `Inter-4.1.zip`.
- Extracts `InterVariable.ttf` and `InterVariable-Italic.ttf`.
- Applies `pyftfeatfreeze --features "cv05"`.
- Renames `Inter Variable` to `Adwaita Sans`.

Local inspection of the official 49.0 tarball with `fc-scan`:

- Family: `Adwaita Sans`.
- Files: regular and italic variable TTFs.
- Styles exposed include Thin, ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black and italic equivalents.
- Fontconfig weight range observed: 0-210.
- Regular slant: 0.
- Italic slant: 100.

## Adwaita Mono Specs

Source family: Iosevka 33.2.5.

Build script details:

- Downloads Iosevka `v33.2.5`.
- Uses `private-build-plans.toml`.
- Family: `Adwaita Mono`.
- Spacing: fixed.
- Serifs: sans.
- Regular weight: CSS 400.
- Bold weight: CSS 700.
- Normal width: CSS `normal`.
- Italic angle: 9.4 degrees.
- Excludes regional indicator characters U+1F1E6 through U+1F1FF.

Selected glyph-design choices from the build plan:

- Zero: dotted.
- Capital I: short-serifed.
- Lowercase i: serifed-asymmetric.
- Lowercase l: serifed-flat-tailed.
- Four: closed-serifless.
- Six and nine: closed-contour.
- Braces: straight.
- Percent: rings-continuous-slash.

Local inspection of the official 49.0 tarball with `fc-scan`:

- Family: `Adwaita Mono`.
- Styles: Regular, Italic, Bold, Bold Italic.
- Fixed-width spacing: 100.
- Regular/Bold fontconfig weights observed: 80/200, corresponding to CSS 400/700 from the build plan.
- Upright slant: 0.
- Italic slant: 100.

## Fidelity Guidance

- Use `Adwaita Sans` for all GNOME shell and app UI text.
- Use `Adwaita Mono` for terminal, code, log, and monospace labels.
- Use 11pt for UI and monospace defaults; use 12pt for document/text content.
- For web implementation, load local or bundled WOFF2/TTF conversions from Adwaita Fonts where licensing permits; keep family names identical so CSS matches the GNOME schema names.
