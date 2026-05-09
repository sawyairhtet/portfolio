# Window Chrome Render Check

Reference: official GNOME 49 Calendar screenshot from <https://release.gnome.org/49/calendar-window-screenshot.webp>.

Portfolio render: `portfolio-files-window.png`, captured from `http://127.0.0.1:5173/app/files` with light theme and GNOME 49 Adwaita wallpaper.

Side by side: `window-chrome-side-by-side.png`.

Measured portfolio values:

- HeaderBar height: 47px.
- Window radius: 12px.
- Window shadow: `0 0 14px 5px rgb(0 0 0 / 15%)`, plus `0 0 5px 2px rgb(0 0 0 / 10%)`.
- Controls: Minimize, Maximize, Close on the right, each 24px.

Known mismatch:

- The GNOME 49 Calendar release screenshot shows only the close button, while this portfolio intentionally shows minimize, maximize, and close because the fidelity pass requested all three controls.
