# Personal Portfolio

My personal portfolio website showcasing my journey as an IT student at Singapore Polytechnic.

## About

This is my portfolio website featuring an **Ubuntu GNOME (Yaru)** desktop theme. It simulates a Linux desktop experience with a GNOME-style top panel, a left-side dock, and draggable windows. Built with vanilla HTML, CSS, and JavaScript to keep things simple and fast.

## Structure

```plaintext
portfolio/
├── index.html                  # Main OS simulation (Single Page App)
├── 404.html                    # Custom 404 Error Page
├── manifest.json               # PWA manifest
├── sw.js                       # Service Worker for offline support
├── sitemap.xml                 # SEO sitemap
├── robots.txt                  # Search engine directives
├── check-before-deploy.js      # Pre-deployment safety check script
├── build.js                    # CSS build script
├── css/
│   ├── main.css                # CSS entry point (imports all styles)
│   ├── base/                   # Reset, variables, typography
│   └── components/             # Window, dock, terminal, dialog styles
├── js/
│   ├── app.js                  # Main entry point & orchestration
│   ├── apps/                   # App-specific logic (terminal, sticky notes)
│   ├── config/                 # Boot messages configuration
│   ├── core/                   # Window manager, audio, storage
│   └── ui/                     # Dialog, context menu, theme toggle
├── assets/                     # Favicon and icons
├── images/                     # Profile picture, wallpapers
└── resume/                     # Downloadable resume PDF
```

## Features

- **Ubuntu GNOME Desktop Theme** with Yaru-inspired colors and font
- **Simulated Linux Boot Log** on page load
- **Interactive Terminal** with commands like `neofetch`, `whoami`, and easter eggs
- **Draggable Windows** on desktop, with mobile-responsive views
- **Left-Side Dock** for quick app access (GNOME-style)
- Responsive design that works on all devices
- SEO optimized with proper meta tags
- Fast loading with vanilla JS

## Local Development

To run locally, you can use any simple HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Or just open index.html in your browser
```

Then visit `http://localhost:8000`

Or use the included dev server:

```bash
npm install
npm run dev
# Opens http://localhost:3000
```

## Tech Stack

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript
- No build process or frameworks



## Deployment

The site is deployed at [sawyehtet.com](https://sawyehtet.com) and automatically updates when changes are pushed to the main branch.

## Contact

Feel free to reach out if you have any questions or want to connect!
