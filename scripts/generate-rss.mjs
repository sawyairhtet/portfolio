/**
 * RSS Generator
 * Builds public/rss.xml from the published Markdown posts in
 * src/site/blog/posts/*.md, newest first. This is a standalone Node script — the
 * app's loader (src/site/blog/posts.ts) uses Vite's import.meta.glob, which isn't
 * available outside the bundler — so it re-reads and parses the same frontmatter.
 * Keep this parser in sync with posts.ts. Output goes to public/ so /rss.xml works
 * in local dev (Vite serves public/ at root) AND in the build (Vite copies it to
 * dist/). Runs before vite build:
 *   npm run build  →  tsc --noEmit && node scripts/generate-rss.mjs && vite build
 * Channel/item dates derive from post dates only (no run timestamp), so the
 * committed file is deterministic and doesn't churn between builds.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://sawyehtet.com'; // matches package.json "homepage"
const POSTS_DIR = join(__dirname, '../src/site/blog/posts');
const OUT_DIR = join(__dirname, '../public');
const OUT_FILE = join(OUT_DIR, 'rss.xml');

// --- frontmatter parsing (mirror of src/site/blog/posts.ts) ---
function parseFrontmatter(raw) {
    const data = new Map();
    const noBom = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    const normalized = noBom.replace(/\r\n/g, '\n');
    const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(normalized);
    if (!match) return { data };
    const [, frontmatter] = match;
    for (const line of frontmatter.split('\n')) {
        const sep = line.indexOf(':');
        if (sep === -1) continue;
        const key = line.slice(0, sep).trim();
        let value = line.slice(sep + 1).trim();
        if (
            value.length >= 2 &&
            ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'")))
        ) {
            value = value.slice(1, -1);
        }
        if (key) data.set(key, value);
    }
    return { data };
}

function parseTags(raw) {
    if (!raw) return [];
    let value = raw.trim();
    if (value.startsWith('[') && value.endsWith(']')) value = value.slice(1, -1);
    return value
        .split(',')
        .map(tag => tag.trim())
        .map(tag =>
            tag.length >= 2 &&
            ((tag.startsWith('"') && tag.endsWith('"')) ||
                (tag.startsWith("'") && tag.endsWith("'")))
                ? tag.slice(1, -1)
                : tag
        )
        .filter(Boolean);
}

function escapeXml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

const posts = readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => {
        const { data } = parseFrontmatter(readFileSync(join(POSTS_DIR, file), 'utf8'));
        const slug = data.get('slug') ?? file.replace(/\.md$/, '');
        return {
            title: data.get('title') ?? slug,
            date: data.get('date') ?? '',
            summary: data.get('summary') ?? '',
            slug,
            draft: data.get('draft') === 'true',
            tags: parseTags(data.get('tags')),
        };
    })
    .filter(post => !post.draft)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

const toRfc822 = date => (Number.isNaN(Date.parse(date)) ? null : new Date(date).toUTCString());

const items = posts
    .map(post => {
        const link = `${SITE_URL}/${post.slug}`;
        const pubDate = toRfc822(post.date);
        const categories = post.tags
            .map(tag => `    <category>${escapeXml(tag)}</category>`)
            .join('\n');
        return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <description>${escapeXml(post.summary)}</description>${pubDate ? `\n    <pubDate>${pubDate}</pubDate>` : ''}${categories ? '\n' + categories : ''}
  </item>`;
    })
    .join('\n');

// Deterministic channel date (newest post) so the committed file doesn't churn.
const lastBuild = posts.length ? toRfc822(posts[0].date) : null;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Saw Ye Htet — Writing</title>
  <link>${SITE_URL}/writing</link>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
  <description>Notes on IT support, troubleshooting, and building software.</description>
  <language>en</language>${lastBuild ? `\n  <lastBuildDate>${lastBuild}</lastBuildDate>` : ''}
${items}
</channel>
</rss>
`;

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, xml, 'utf8');
console.log(`RSS: wrote ${posts.length} item(s) → public/rss.xml`);
