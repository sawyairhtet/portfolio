# GNOME 49 / Fedora 43 Design Tokens

Fetched: 2026-05-09

This file synthesizes exact values from the source references in this directory. Primary token sources are libadwaita 1.8.5.1, GNOME 49 interface schemas, Adwaita Fonts 49.0, GNOME HIG, GNOME 49 release notes, Nautilus 49 NEWS, and Fedora 43 background metadata.

## Source Versions

| Token area | Version / source |
| --- | --- |
| GNOME desktop target | GNOME 49 "Brescia", released 2025-09-17 |
| Fedora target | Fedora Workstation 43, announced 2025-10-28 |
| libadwaita | 1.8.5.1 docs/source |
| Adwaita Fonts | 49.0 |
| GNOME interface schema | gsettings-desktop-schemas 49.0 |
| Fedora wallpaper package | f43-backgrounds / f43-backgrounds-gnome |

## System Defaults

| Token | Value | Source |
| --- | --- | --- |
| `gtk-theme` | `Adwaita` | GNOME 49 schema |
| `icon-theme` | `Adwaita` | GNOME 49 schema |
| `cursor-theme` | `Adwaita` | GNOME 49 schema |
| `accent-color` | `blue` | GNOME 49 schema |
| `font-name` | `Adwaita Sans 11` | GNOME 49 schema |
| `document-font-name` | `Adwaita Sans 12` | GNOME 49 schema |
| `monospace-font-name` | `Adwaita Mono 11` | GNOME 49 schema |
| `enable-animations` | `true` | GNOME 49 schema |
| `cursor-size` | `24` | GNOME 49 schema |
| `text-scaling-factor` | `1.0` | GNOME 49 schema |
| `scaling-factor` | `0`, automatic | GNOME 49 schema |

## Accent Colors

| Name | Background / variable | Foreground | Standalone light | Standalone dark |
| --- | --- | --- | --- | --- |
| Blue | `#3584e4` / `--accent-blue` | `#ffffff` | `#0461be` | `#81d0ff` |
| Teal | `#2190a4` / `--accent-teal` | `#ffffff` | `#007184` | `#7bdff4` |
| Green | `#3a944a` / `--accent-green` | `#ffffff` | `#15772e` | `#8de698` |
| Yellow | `#c88800` / `--accent-yellow` | `#ffffff` | `#905300` | `#ffc057` |
| Orange | `#ed5b00` / `--accent-orange` | `#ffffff` | `#b62200` | `#ff9c5b` |
| Red | `#e62d42` / `--accent-red` | `#ffffff` | `#c00023` | `#ff888c` |
| Pink | `#d56199` / `--accent-pink` | `#ffffff` | `#a2326c` | `#ffa0d8` |
| Purple | `#9141ac` / `--accent-purple` | `#ffffff` | `#8939a4` | `#fba7ff` |
| Slate | `#6f8396` / `--accent-slate` | `#ffffff` | `#526678` | `#bbd1e5` |

Standalone derivation:

| Token | Light | Dark |
| --- | --- | --- |
| `--standalone-color-oklab` | `min(l, 0.5) a b` | `max(l, 0.85) a b` |

## Semantic Colors

| Token | Light | Dark |
| --- | --- | --- |
| `--destructive-bg-color` | `#e01b24` | `#c01c28` |
| `--destructive-fg-color` | `#ffffff` | `#ffffff` |
| `--destructive-color` | `#c30000` | `#ff938c` |
| `--success-bg-color` | `#2ec27e` | `#26a269` |
| `--success-fg-color` | `#ffffff` | `#ffffff` |
| `--success-color` | `#007c3d` | `#78e9ab` |
| `--warning-bg-color` | `#e5a50a` | `#cd9309` |
| `--warning-fg-color` | `rgb(0 0 0 / 80%)` | `rgb(0 0 0 / 80%)` |
| `--warning-color` | `#905400` | `#ffc252` |
| `--error-bg-color` | `#e01b24` | `#c01c28` |
| `--error-fg-color` | `#ffffff` | `#ffffff` |
| `--error-color` | `#c30000` | `#ff938c` |

## Surface Colors

| Token | Light | Dark |
| --- | --- | --- |
| `--window-bg-color` | `#fafafb` | `#222226` |
| `--window-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--view-bg-color` | `#ffffff` | `#1d1d20` |
| `--view-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--headerbar-bg-color` | `#ffffff` | `#2e2e32` |
| `--headerbar-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--headerbar-border-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--headerbar-backdrop-color` | `#fafafb` | `#222226` |
| `--headerbar-shade-color` | `rgb(0 0 6 / 12%)` | `rgb(0 0 6 / 36%)` |
| `--headerbar-darker-shade-color` | `rgb(0 0 6 / 12%)` | `rgb(0 0 6 / 90%)` |
| `--sidebar-bg-color` | `#ebebed` | `#2e2e32` |
| `--sidebar-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--sidebar-backdrop-color` | `#f2f2f4` | `#28282c` |
| `--sidebar-border-color` | `rgb(0 0 6 / 7%)` | `rgb(0 0 6 / 36%)` |
| `--sidebar-shade-color` | `rgb(0 0 6 / 7%)` | `rgb(0 0 6 / 25%)` |
| `--secondary-sidebar-bg-color` | `#f3f3f5` | `#28282c` |
| `--secondary-sidebar-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--secondary-sidebar-backdrop-color` | `#f6f6fa` | `#252529` |
| `--secondary-sidebar-border-color` | `rgb(0 0 6 / 7%)` | `rgb(0 0 6 / 36%)` |
| `--secondary-sidebar-shade-color` | `rgb(0 0 6 / 7%)` | `rgb(0 0 6 / 25%)` |
| `--card-bg-color` | `#ffffff` | `rgb(255 255 255 / 8%)` |
| `--card-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--card-shade-color` | `rgb(0 0 6 / 7%)` | `rgb(0 0 6 / 36%)` |
| `--overview-bg-color` | `#f3f3f5` | `#28282c` |
| `--overview-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--thumbnail-bg-color` | `#ffffff` | `#39393d` |
| `--thumbnail-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--active-toggle-bg-color` | `#ffffff` | `rgb(255 255 255 / 20%)` |
| `--active-toggle-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--dialog-bg-color` | `#fafafb` | `#36363a` |
| `--dialog-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--popover-bg-color` | `#ffffff` | `#36363a` |
| `--popover-fg-color` | `rgb(0 0 6 / 80%)` | `#ffffff` |
| `--popover-shade-color` | `rgb(0 0 6 / 7%)` | `rgb(0 0 6 / 25%)` |
| `--shade-color` | `rgb(0 0 6 / 7%)` | `rgb(0 0 6 / 25%)` |
| `--scrollbar-outline-color` | `#ffffff` | `rgb(0 0 6 / 50%)` |

## Opacity And Borders

| Token | Regular | High contrast |
| --- | --- | --- |
| `--border-opacity` | `15%` | `50%` |
| `--dim-opacity` | `55%` | `90%` |
| `--disabled-opacity` | `50%` | `40%` |

| Token | Value |
| --- | --- |
| `--border-color` | `color-mix(in srgb, currentColor var(--border-opacity), transparent)` |
| `@borders` | `color-mix(in srgb, currentColor 15%, transparent)` |

## GNOME Palette Variables

| Token | Value |
| --- | --- |
| `--blue-1` | `#99c1f1` |
| `--blue-2` | `#62a0ea` |
| `--blue-3` | `#3584e4` |
| `--blue-4` | `#1c71d8` |
| `--blue-5` | `#1a5fb4` |
| `--green-1` | `#8ff0a4` |
| `--green-2` | `#57e389` |
| `--green-3` | `#33d17a` |
| `--green-4` | `#2ec27e` |
| `--green-5` | `#26a269` |
| `--yellow-1` | `#f9f06b` |
| `--yellow-2` | `#f8e45c` |
| `--yellow-3` | `#f6d32d` |
| `--yellow-4` | `#f5c211` |
| `--yellow-5` | `#e5a50a` |
| `--orange-1` | `#ffbe6f` |
| `--orange-2` | `#ffa348` |
| `--orange-3` | `#ff7800` |
| `--orange-4` | `#e66100` |
| `--orange-5` | `#c64600` |
| `--red-1` | `#f66151` |
| `--red-2` | `#ed333b` |
| `--red-3` | `#e01b24` |
| `--red-4` | `#c01c28` |
| `--red-5` | `#a51d2d` |
| `--purple-1` | `#dc8add` |
| `--purple-2` | `#c061cb` |
| `--purple-3` | `#9141ac` |
| `--purple-4` | `#813d9c` |
| `--purple-5` | `#613583` |
| `--brown-1` | `#cdab8f` |
| `--brown-2` | `#b5835a` |
| `--brown-3` | `#986a44` |
| `--brown-4` | `#865e3c` |
| `--brown-5` | `#63452c` |
| `--light-1` | `#ffffff` |
| `--light-2` | `#f6f5f4` |
| `--light-3` | `#deddda` |
| `--light-4` | `#c0bfbc` |
| `--light-5` | `#9a9996` |
| `--dark-1` | `#77767b` |
| `--dark-2` | `#5e5c64` |
| `--dark-3` | `#3d3846` |
| `--dark-4` | `#241f31` |
| `--dark-5` | `#000000` |

## Compatibility Named Colors

| Token | Value |
| --- | --- |
| `@theme_bg_color` | `@window_bg_color` |
| `@theme_fg_color` | `@window_fg_color` |
| `@theme_base_color` | `@view_bg_color` |
| `@theme_text_color` | `@view_fg_color` |
| `@theme_selected_bg_color` | `@accent_bg_color` |
| `@theme_selected_fg_color` | `@accent_fg_color` |
| `@insensitive_bg_color` | `color-mix(@window_bg_color 60%, @view_bg_color)` |
| `@insensitive_fg_color` | `color-mix(in srgb, @window_fg_color 50%, transparent)` |
| `@insensitive_base_color` | `@view_bg_color` |
| `@theme_unfocused_bg_color` | `@window_bg_color` |
| `@theme_unfocused_fg_color` | `@window_fg_color` |
| `@theme_unfocused_base_color` | `@view_bg_color` |
| `@theme_unfocused_text_color` | `@view_fg_color` |
| `@theme_unfocused_selected_bg_color` | `@accent_bg_color` |
| `@theme_unfocused_selected_fg_color` | `@accent_fg_color` |
| `@unfocused_insensitive_color` | `@insensitive_bg_color` |
| `@unfocused_borders` | `@borders` |

## Typography

| Token / class | Family | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| Interface default | `Adwaita Sans` | `11pt` | normal | toolkit default | GNOME schema |
| Document default | `Adwaita Sans` | `12pt` | normal | toolkit default | GNOME schema |
| Monospace default | `Adwaita Mono` | `11pt` | normal | toolkit default | GNOME schema |
| `--document-font-family` | `Adwaita Sans` | - | - | - | libadwaita docs example/system value |
| `--document-font-size` | - | `12pt` | - | - | libadwaita docs |
| `--monospace-font-family` | `Adwaita Mono` | - | - | - | libadwaita docs |
| `--monospace-font-size` | - | `11pt` | - | - | libadwaita docs |
| `.title-1` | inherit | `181%` | `800` | inherit | About 19.91pt on 11pt base |
| `.title-2` | inherit | `136%` | `800` | inherit | About 14.96pt on 11pt base |
| `.title-3` | inherit | `136%` | `700` | inherit | About 14.96pt on 11pt base |
| `.title-4` | inherit | `118%` | `700` | inherit | About 12.98pt on 11pt base |
| `.heading` | inherit | inherit | `700` | inherit | Standard UI heading |
| `.body` | inherit | inherit | `400` | `140%` | Wrapping UI text |
| `.caption-heading` | inherit | `82%` | `700` | inherit | About 9.02pt on 11pt base |
| `.caption` | inherit | `82%` | `400` | `140%` | About 9.02pt on 11pt base |
| `.document` | `var(--document-font-family)` | `var(--document-font-size)` | inherit | `140%` | Long-form content |
| `.monospace` | `var(--monospace-font-family)` | `var(--monospace-font-size)` | inherit | inherit | Code/logs |
| `.numeric` | inherit | inherit | inherit | inherit | `font-feature-settings: "tnum"` |
| `.large-title` deprecated | inherit | `24pt` | `300` | inherit | Replaced by `.title-1` |

## Spacing Scale

Libadwaita does not expose public spacing variables, so these are observed stylesheet tokens and recurring values.

| Token | Value | Typical use |
| --- | --- | --- |
| `spacing-xxs` | `3px` | Micro padding, collapsed headerbar/titlebar adjustments, list inner gaps |
| `spacing-xs` | `4px` | Small icon/button padding, compact toolbar buttons |
| `spacing-sm` | `6px` | Default toolbar/menu/sidebar/list child spacing |
| `spacing-md` | `9px` | Entry horizontal padding, scrollbar margin, compact control radius-adjacent spacing |
| `spacing-lg` | `12px` | Menu padding, row horizontal padding, list/card gutters |
| `spacing-xl` | `15px` | Bottom sheet handle margin, radius-derived container spacing |
| `spacing-2xl` | `18px` | Group/header separation, shortcuts dialog spacing |
| `spacing-3xl` | `24px` | Larger separation, text selection popover padding, old HIG rhythm |
| `control-min-small` | `24px` | Small circular/list action controls |
| `control-min-medium` | `36px` | Common row/control minimum height |
| `headerbar-min-height` | `46px` | Standard headerbar height in stylesheet |
| `touch-target-large` | `56px` | Drawing mixin minimum target size |

Component spacing:

| Token | Value |
| --- | --- |
| `$menu_margin` | `6px` |
| `$menu_padding` | `12px` |
| `.toolbar` padding | `6px` |
| `.toolbar` child spacing | `6px` |
| Headerbar padding | `6px 7px 7px 7px` |
| Headerbar child spacing | `6px` |
| Action row padding | `8px 12px` |
| List/card row horizontal spacing | `12px` |
| Tooltip padding | `6px 10px` |

## Border Radii

| Token | Value | Source / use |
| --- | --- | --- |
| `$button_radius` | `9px` | Buttons, entries, many small controls |
| `$card_radius` | `12px` | Cards and boxed lists |
| `$menu_radius` | `9px` | Menu items and menu surfaces |
| `$popover_radius` | `15px` | `$menu_radius + 6` |
| `$dialog_radius` | `15px` | `$button_radius + 6` |
| `--window-radius` | `15px` | Floating windows |
| Maximized/fullscreen `--window-radius` | `0px` | Window edge state |
| Tooltip radius | `9px` | Tooltip surface |
| Check radius | `6px` | Checkbox base |
| Switch radius | `14px` | Switch trough |
| Tab overview thumbnail radius | `12px` | `THUMBNAIL_BORDER_RADIUS` |
| Tab overview window radius | `15px` | `WINDOW_BORDER_RADIUS` |
| Circular/pill controls | `99px`, `100px`, `999px`, `9999px`, or `50%` | Fully rounded affordances |

## Animation Timings And Easing

| Token | Value |
| --- | --- |
| `$ease-out-quad` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| `$backdrop_transition` | `200ms ease-out` |
| `$focus_transition` | `outline-color`, `outline-width`, `outline-offset` over `200ms` with `$ease-out-quad` |
| `$button_transition` | `background`, `box-shadow` over `200ms` with `$ease-out-quad` |
| `needs_attention` | `150ms ease-in` |
| `ADW_EASE` | cubic-bezier points `(0.25, 0.1)` and `(0.25, 1.0)` |
| `ADW_EASE_IN` | cubic-bezier points `(0.42, 0.0)` and `(1.0, 1.0)` |
| `ADW_EASE_OUT` | cubic-bezier points `(0.0, 0.0)` and `(0.58, 1.0)` |
| `ADW_EASE_IN_OUT` | cubic-bezier points `(0.42, 0.0)` and `(0.58, 1.0)` |
| `AdwTimedAnimation` default duration | `0ms` |
| `AdwTimedAnimation` default easing | `ADW_EASE_OUT_CUBIC` |

Widget timings:

| Component | Token | Value |
| --- | --- | --- |
| Style manager | color-scheme switch timeout | `250ms` |
| Toast overlay | show | `300ms` |
| Toast overlay | hide | `300ms` |
| Toast overlay | replace | `500ms` |
| Tab grid | open | `200ms` |
| Tab grid | close | `200ms` |
| Tab grid | focus | `200ms` |
| Tab grid | resize | `200ms` |
| Tab grid | reorder | `250ms` |
| Tab grid | icon resize | `200ms` |
| Tab overview | scroll | `200ms` |
| Tab overview | transition | `400ms` |
| Tab | close button | `150ms` |
| Tab | attention indicator | `250ms` |
| Entry row | empty animation | `150ms` |
| Bottom sheet | sheet stack transition | `100ms` |
| Bottom sheet | bottom bar reveal | `250ms` |
| Flap | fold duration | `250ms` |
| Squeezer | transition duration | `200ms` |
| View switcher bar | revealer transition | `250ms` |
| Spinner | spin cycle | `1200ms` |

Spring parameters:

| Component | Value |
| --- | --- |
| Common flap/carousel/leaflet spring | `adw_spring_params_new(1, 0.5, 500)` |
| Bottom sheet open spring | `adw_spring_params_new(0.8, 1, 400)` |
| Floating sheet spring | `adw_spring_params_new(0.62, 1, 500)` |
| Adaptive preview spring | `adw_spring_params_new(1, 1, 800)` |
| Navigation view spring | `adw_spring_params_new(1, 1, 1000)` |

## Fedora 43 Wallpaper Tokens

| Token | Value |
| --- | --- |
| Wallpaper package | `f43-backgrounds-gnome` |
| Static display name | `Fedora 43 Default` |
| Time-of-day display name | `Fedora 43 Time of Day` |
| Day file | `/usr/share/backgrounds/f43/default/f43-01-day.jxl` |
| Night file | `/usr/share/backgrounds/f43/default/f43-01-night.jxl` |
| Options | `zoom` |
| Shade type | `solid` |
| Primary fallback color | `#51a2da` |
| Secondary fallback color | `#294172` |
| Local inspected image size | `4032x3024` |
| Local inspected color/depth | `8-bit sRGB` |
| Day static duration | `36000.0s` |
| Day-to-night transition | `7200.0s` |
| Night static duration | `36000.0s` |
| Night-to-day transition | `7200.0s` |
| Animation start date/time | `2025-10-28 08:00:00` |

## GNOME 49 Chrome Tokens / Behaviors

| Area | Token / behavior |
| --- | --- |
| Quick Settings | Do Not Disturb toggle lives here in GNOME 49 |
| Quick Settings | HDR brightness controls live here when HDR is enabled |
| Lock screen | Media controls are shown |
| Lock screen | Optional reboot/shutdown gsetting: `org.gnome.desktop.screensaver restart-enabled true` |
| Login screen | Prominent accessibility menu |
| Top bar | Battery icon distinguishes plugged-in but not charging |
| Notifications | GNOME 48 stacking remains; GNOME 49 moves DND control to Quick Settings |
| Files | Redesigned search popover |
| Files | Cut files use dashed border plus scissor icon |
| Files | Hidden files use transparency |

## Source Pointers

- HIG: https://developer.gnome.org/hig/
- Libadwaita CSS variables: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.8/css-variables.html
- Libadwaita style classes: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1.8/style-classes.html
- Libadwaita source tag: https://gitlab.gnome.org/GNOME/libadwaita/-/tree/1.8.5.1
- GNOME 49 release notes: https://release.gnome.org/49/
- GNOME 48 release notes: https://release.gnome.org/48/
- Fedora Workstation 43: https://fedoramagazine.org/whats-new-fedora-workstation-43/
- Fedora Docs desktop release notes: https://docs.fedoraproject.org/en-US/fedora/latest/release-notes/desktop/
- Fedora 43 announcement: https://fedoramagazine.org/announcing-fedora-linux-43/
- Fedora backgrounds package: https://packages.fedoraproject.org/pkgs/f43-backgrounds/
- Adwaita Fonts 49.0: https://download.gnome.org/sources/adwaita-fonts/49/adwaita-fonts-49.0.tar.xz
