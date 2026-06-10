/**
 * Shared post loader for the build-time generators (generate-feeds.mjs and
 * generate-meta.mjs). This is a standalone Node mirror of the app's loader
 * (src/site/blog/posts.ts), which uses Vite's import.meta.glob and therefore
 * can't run outside the bundler. Keep the frontmatter parsing in sync with it.
 */

import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const SITE_URL = 'https://sawyehtet.com'; // matches package.json "homepage"
export const POSTS_DIR = join(__dirname, '../../src/site/blog/posts');

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

export function escapeXml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/** Published (non-draft) posts, newest first. */
export function loadPublishedPosts() {
    return readdirSync(POSTS_DIR)
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
}
