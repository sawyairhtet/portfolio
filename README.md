# Personal Portfolio

My personal portfolio website showcasing my journey as an IT student at Singapore Polytechnic.

## About

This is my portfolio website where I share my projects, timeline, and personal interests. Built with vanilla HTML, CSS, and JavaScript to keep things simple and fast.

## Structure

```plaintext
portfolio/
├── index.html              # Main homepage
├── pages/
│   ├── about.html          # About me page
│   ├── blog.html           # Blog (coming soon)
│   ├── gallery.html        # Photography gallery
│   └── newsletter-success.html
├── css/
│   └── main.css            # All styles
├── js/
│   ├── main.js             # Homepage interactions
│   └── blog.js             # Blog functionality
├── assets/
│   ├── gallery/            # Photography collection
│   ├── profile-picture.jpg
│   └── favicon.svg
└── blog/                   # Future blog posts
```

## Features

- Responsive design that works on all devices
- Photography gallery with lightbox
- Smooth scrolling navigation
- Clean, minimal aesthetic
- SEO optimized with proper meta tags
- Fast loading with vanilla JS
- **Optimized lazy loading** with native browser support and fallbacks
- Shimmer loading animations for better UX
- Critical resource preloading for faster initial load

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

## Performance Optimizations

### Lazy Loading Implementation

- **Native lazy loading** with `loading="lazy"` attribute for modern browsers
- **Intersection Observer fallback** for older browser compatibility
- **Critical resource preloading** using `rel="preload"` for above-the-fold images
- **Shimmer loading animations** for better perceived performance
- **Explicit image dimensions** to prevent layout shift (CLS)

### Loading Strategy

- **Eager loading**: Profile picture and critical images load immediately
- **Lazy loading**: Gallery images and below-the-fold content load on demand
- **Bandwidth optimization**: Images only load when users scroll to them

## Deployment

The site is deployed at [sawyehtet.com](https://sawyehtet.com) and automatically updates when changes are pushed to the main branch.

## Contact

Feel free to reach out if you have any questions or want to connect!
