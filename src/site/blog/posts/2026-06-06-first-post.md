---
title: 'Notes from the workbench'
date: '2026-06-06'
slug: 'first-post'
summary: 'A placeholder first entry. Flip draft to false (or drop in a new .md file) to publish.'
draft: true
---

This is a **draft** placeholder. Because its frontmatter says `draft: true`, it
is hidden everywhere — the blog index, the homepage teaser, the nav link, and
even its own URL — until you publish it.

## How to publish

1. Edit the frontmatter above and change `draft: true` to `draft: false`.
2. Rebuild (`npm run build`) or refresh in dev.

That is the whole flow. The nav "Writing" link and the homepage teaser switch
on automatically the moment one published post exists.

## Adding a new post

Drop another file in `src/site/blog/posts/`, e.g. `2026-07-01-my-post.md`, with
the same frontmatter keys: `title`, `date`, `slug`, `summary`, `draft`.

### Markdown you can use

Standard Markdown plus GitHub-flavored extras render here:

- Bullet lists like this one
- Inline `code` and [links](https://sawyehtet.com)
- Tables, task lists, and strikethrough (via remark-gfm)

```ts
// Fenced code blocks render with editorial styling.
function fps(frames: number, seconds: number): number {
    return frames / seconds;
}
```

> Blockquotes work too — handy for pull quotes or citing a log line.

When you are ready, the first real post is the CEMS 72 FPS hunt: profiling a
Unity VR build, isolating the bottleneck, and verifying the fix.
