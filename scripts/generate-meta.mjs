/**
 * Static head shells for SPA routes. dist/index.html carries the homepage's
 * <title>, OG/Twitter tags, and canonical for every route, and social crawlers
 * don't run JS: sharing a post showed the homepage card, and every URL claimed
 * the homepage as canonical. This post-build step copies dist/index.html to
 * dist/<route>/index.html with the head rewritten per route. Netlify serves
 * static files before redirects, so these shells win over the SPA catch-all;
 * the app then hydrates and renders the route normally.
 *
 * Runs AFTER vite build: npm run build → tsc && generate-feeds && vite build
 * && generate-meta. Titles/descriptions must match what the React components
 * set at runtime (src/site/Home.tsx, src/site/BlogPost.tsx) so the head
 * doesn't change on hydration.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { SITE_URL, escapeXml, loadPublishedPosts } from './lib/posts.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '../dist');
const template = readFileSync(join(DIST, 'index.html'), 'utf8');

function setHead(html, pattern, label, replacement) {
    if (!pattern.test(html)) {
        throw new Error(
            `generate-meta: could not find ${label} in dist/index.html — keep this script in sync with index.html's <head>`
        );
    }
    // Function replacement so '$' in content is never treated as a backreference.
    return html.replace(pattern, (...args) => replacement(...args));
}

const attr = (kind, name) => new RegExp(`(<meta\\s+${kind}="${name}"\\s+content=")[^"]*(")`);

function renderShell({ title, description, url, type }) {
    const t = escapeXml(title);
    const d = escapeXml(description);
    const u = escapeXml(url);
    let html = template;
    html = setHead(html, /<title>[\s\S]*?<\/title>/, '<title>', () => `<title>${t}</title>`);
    html = setHead(html, attr('name', 'description'), 'meta description', (m, a, b) => a + d + b);
    html = setHead(html, attr('property', 'og:type'), 'og:type', (m, a, b) => a + type + b);
    html = setHead(html, attr('property', 'og:url'), 'og:url', (m, a, b) => a + u + b);
    html = setHead(html, attr('property', 'og:title'), 'og:title', (m, a, b) => a + t + b);
    html = setHead(
        html,
        attr('property', 'og:description'),
        'og:description',
        (m, a, b) => a + d + b
    );
    html = setHead(html, attr('name', 'twitter:title'), 'twitter:title', (m, a, b) => a + t + b);
    html = setHead(
        html,
        attr('name', 'twitter:description'),
        'twitter:description',
        (m, a, b) => a + d + b
    );
    html = setHead(html, attr('name', 'twitter:url'), 'twitter:url', (m, a, b) => a + u + b);
    html = setHead(
        html,
        /(<link rel="canonical" href=")[^"]*(")/,
        'canonical',
        (m, a, b) => a + u + b
    );
    return html;
}

const posts = loadPublishedPosts();

const pages = [
    {
        route: 'writing',
        title: 'Saw Ye Htet — Writing',
        description:
            'Writing by Saw Ye Htet — notes on IT support, troubleshooting, and building software. The portfolio lives on the home page.',
        url: `${SITE_URL}/writing`,
        type: 'website',
    },
    {
        route: 'desktop',
        title: 'Saw Ye Htet — Desktop',
        description:
            'A GNOME desktop simulation in the browser: boot sequence, windows, dock, and terminal. The previous version of sawyehtet.com, preserved.',
        url: `${SITE_URL}/desktop`,
        type: 'website',
    },
    ...posts.map(post => ({
        route: post.slug,
        title: `${post.title} — Saw Ye Htet`,
        description: post.summary || `${post.title} — a post by Saw Ye Htet.`,
        url: `${SITE_URL}/${post.slug}`,
        type: 'article',
    })),
];

for (const page of pages) {
    const dir = join(DIST, page.route);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), renderShell(page), 'utf8');
}

console.log(`Meta: wrote ${pages.length} head shell(s) → dist/<route>/index.html`);
