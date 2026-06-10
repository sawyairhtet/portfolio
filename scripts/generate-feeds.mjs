/**
 * Feed generator: builds public/rss.xml AND public/sitemap.xml from the
 * published Markdown posts (via scripts/lib/posts.mjs), newest first. Output
 * goes to public/ so both files are served in local dev (Vite serves public/
 * at root) AND copied into dist/ by the build. Runs before vite build:
 *   npm run build → tsc && generate-feeds && vite build && generate-meta
 * All dates derive from post frontmatter only (no run timestamp), so the
 * committed files are deterministic and don't churn between builds.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { SITE_URL, escapeXml, loadPublishedPosts } from './lib/posts.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public');

const posts = loadPublishedPosts();
const toRfc822 = date => (Number.isNaN(Date.parse(date)) ? null : new Date(date).toUTCString());

// --- RSS ---

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

const rss = `<?xml version="1.0" encoding="UTF-8"?>
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

// --- Sitemap ---

const isoDate = date => (Number.isNaN(Date.parse(date)) ? null : date);
const newestPostDate = posts.length ? isoDate(posts[0].date) : null;

const pages = [
    { loc: `${SITE_URL}/`, lastmod: newestPostDate, changefreq: 'weekly', priority: '1.0' },
    {
        loc: `${SITE_URL}/writing`,
        lastmod: newestPostDate,
        changefreq: 'weekly',
        priority: '0.9',
    },
    ...posts.map(post => ({
        loc: `${SITE_URL}/${post.slug}`,
        lastmod: isoDate(post.date),
        changefreq: 'monthly',
        priority: '0.7',
    })),
    { loc: `${SITE_URL}/desktop`, lastmod: null, changefreq: 'monthly', priority: '0.4' },
];

const urlEntries = pages
    .map(page => {
        const lastmod = page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : '';
        return `  <url>
    <loc>${escapeXml(page.loc)}</loc>${lastmod}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'rss.xml'), rss, 'utf8');
writeFileSync(join(OUT_DIR, 'sitemap.xml'), sitemap, 'utf8');
console.log(
    `Feeds: wrote ${posts.length} post(s) → public/rss.xml, ${pages.length} URL(s) → public/sitemap.xml`
);
