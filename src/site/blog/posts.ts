// Editorial blog loader. Posts are authored as plain Markdown files in
// ./posts/*.md with a small frontmatter block, then bundled at build time via
// Vite's import.meta.glob — publishing is "drop a .md file and rebuild".
//
// A post stays invisible everywhere (index, direct URL, nav link, homepage
// teaser) until its frontmatter reads `draft: false`. See `hasPublishedPosts`.

export interface BlogPostMeta {
    title: string;
    date: string; // ISO-ish, e.g. 2026-06-06
    summary: string;
    slug: string;
    draft: boolean;
    featured: boolean;
    tags: string[];
}

export interface BlogPost {
    meta: BlogPostMeta;
    body: string; // Markdown source, frontmatter stripped
}

// Eager raw import: each value is the .md file's text content.
const RAW_POSTS = import.meta.glob<string>('./posts/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
});

interface ParsedFrontmatter {
    data: Map<string, string>;
    body: string;
}

// Minimal YAML-ish frontmatter parser: only flat `key: value` pairs between a
// leading `---` fence and the next `---`. Kept deliberately tiny (no dependency)
// and written without variable bracket-indexing so eslint-plugin-security stays
// quiet. Anything richer than key/value is out of scope on purpose.
function parseFrontmatter(raw: string): ParsedFrontmatter {
    const data = new Map<string, string>();
    const noBom = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    const normalized = noBom.replace(/\r\n/g, '\n');

    const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(normalized);
    if (!match) {
        return { data, body: normalized.trim() };
    }

    const [, frontmatter, body] = match;
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

    return { data, body: body.trim() };
}

function deriveSlug(path: string): string {
    const file = path.split('/').pop() ?? '';
    return file.replace(/\.md$/, '');
}

// Parse an optional `tags` frontmatter value into a string array. Accepts both
// `tags: [meta, design]` and `tags: meta, design`, with optional quotes per item.
// Written with array methods only (no bracket-indexing) so eslint-plugin-security
// stays quiet, consistent with parseFrontmatter above.
function parseTags(raw: string | undefined): string[] {
    if (!raw) return [];
    let value = raw.trim();
    if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1);
    }
    return value
        .split(',')
        .map(tag => tag.trim())
        .map(tag => {
            if (
                tag.length >= 2 &&
                ((tag.startsWith('"') && tag.endsWith('"')) ||
                    (tag.startsWith("'") && tag.endsWith("'")))
            ) {
                return tag.slice(1, -1);
            }
            return tag;
        })
        .filter(tag => tag.length > 0);
}

function buildPosts(): BlogPost[] {
    const posts: BlogPost[] = [];
    for (const [path, raw] of Object.entries(RAW_POSTS)) {
        const { data, body } = parseFrontmatter(raw);
        const slug = data.get('slug') ?? deriveSlug(path);
        posts.push({
            meta: {
                title: data.get('title') ?? slug,
                date: data.get('date') ?? '',
                summary: data.get('summary') ?? '',
                slug,
                draft: data.get('draft') === 'true',
                featured: data.get('featured') === 'true',
                tags: parseTags(data.get('tags')),
            },
            body,
        });
    }
    return posts;
}

// Newest first. Drafts are kept here (internal) but never exported publicly.
const ALL_POSTS: BlogPost[] = buildPosts().sort(
    (a, b) => Date.parse(b.meta.date) - Date.parse(a.meta.date)
);

/** Public, render-safe list: drafts removed, newest first. */
export const PUBLISHED_POSTS: BlogPost[] = ALL_POSTS.filter(post => !post.meta.draft);

/** Published posts flagged `featured: true`, newest first. */
export const FEATURED_POSTS: BlogPost[] = PUBLISHED_POSTS.filter(post => post.meta.featured);

/** True only when at least one non-draft post exists. Gates nav link + RSS link. */
export const hasPublishedPosts: boolean = PUBLISHED_POSTS.length > 0;

/** Resolve a slug to a *published* post. Drafts are unreachable by URL. */
export function getPublishedPost(slug: string | undefined): BlogPost | undefined {
    if (!slug) return undefined;
    return PUBLISHED_POSTS.find(post => post.meta.slug === slug);
}

/** Human-readable date for display, e.g. "06 Jun 2026". Falls back to raw. */
export function formatPostDate(date: string): string {
    const ms = Date.parse(date);
    if (Number.isNaN(ms)) return date;
    return new Date(ms).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
