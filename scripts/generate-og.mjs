/**
 * OG Image Generator — Editorial / Swiss
 * Generates the 1200×630 Open Graph preview for sawyehtet.com to match the
 * editorial site: paper background, big display type, one signal-red accent,
 * mono labels, hairline structure. Uses the self-hosted Adwaita fonts (no
 * external font requests). Run: npm run generate:og
 */

import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const b64 = (rel, mime) =>
    `data:${mime};base64,${readFileSync(join(__dirname, rel)).toString('base64')}`;

const sans = b64('../public/fonts/AdwaitaSans-Regular.woff2', 'font/woff2');
const mono = b64('../public/fonts/AdwaitaMono-Regular.woff2', 'font/woff2');
const photo = b64('../public/images/profile-picture.webp', 'image/webp');

const html = /* html */ `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Adwaita Sans'; src: url('${sans}') format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'Adwaita Mono'; src: url('${mono}') format('woff2'); font-weight: 400; }

  :root {
    --paper: #f7f5ef; --ink: #161410; --ink-2: #57534a; --ink-3: #6d685b;
    --line: #d8d3c6; --line-2: #c4bfb1; --accent: #cc2a10;
    --sans: 'Adwaita Sans', sans-serif; --mono: 'Adwaita Mono', monospace;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { background: var(--paper); color: var(--ink); font-family: var(--sans); -webkit-font-smoothing: antialiased; }

  .card { width: 1200px; height: 630px; padding: 56px 64px; display: flex; flex-direction: column; }
  .rule { height: 1px; background: var(--line); }
  .rule.strong { background: var(--ink); }

  .top { display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 18px; }
  .wordmark { font-weight: 800; font-size: 22px; letter-spacing: -0.02em; text-transform: uppercase; }
  .wordmark .dot { color: var(--accent); }
  .eyebrow { font-family: var(--mono); font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); }

  .main { flex: 1; display: flex; align-items: center; justify-content: space-between; gap: 56px; padding: 8px 0; }
  .head { font-weight: 800; font-size: 82px; line-height: 0.9; letter-spacing: -0.045em; text-transform: uppercase; }
  .head span { display: block; }
  .head .accent { color: var(--accent); }
  .role { margin-top: 28px; max-width: 30ch; font-size: 19px; line-height: 1.45; color: var(--ink-2); }
  .role b { color: var(--ink); font-weight: 600; }

  .portrait { position: relative; width: 268px; height: 336px; flex-shrink: 0; border: 1px solid var(--line-2); overflow: hidden; background: #ece8df; }
  .portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 16%; }
  .portrait .tag { position: absolute; left: 0; bottom: 0; padding: 7px 12px; background: var(--ink); color: var(--paper); font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; }

  .bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 18px; }
  .specs { display: flex; gap: 36px; font-family: var(--mono); font-size: 14px; letter-spacing: 0.04em; color: var(--ink); }
  .specs b { color: var(--ink-3); font-weight: 400; letter-spacing: 0.12em; margin-right: 8px; }
  .url { display: inline-flex; align-items: center; gap: 9px; font-family: var(--mono); font-size: 15px; letter-spacing: 0.06em; color: var(--accent); }
  .url::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
</style>
</head>
<body>
  <div class="card">
    <div class="top">
      <div class="wordmark">Saw Ye Htet<span class="dot">.</span></div>
      <div class="eyebrow">Portfolio · 2026</div>
    </div>
    <div class="rule strong"></div>

    <div class="main">
      <div class="text">
        <h1 class="head">
          <span>IT Support &amp;</span>
          <span class="accent">Operations</span>
          <span>Specialist</span>
        </h1>
        <p class="role">
          <b>Application &amp; production support</b> — methodical troubleshooting,
          log analysis, and documented fixes.
        </p>
      </div>
      <div class="portrait">
        <img src="${photo}" alt="Saw Ye Htet" />
        <span class="tag">Singapore</span>
      </div>
    </div>

    <div class="rule"></div>
    <div class="bottom">
      <div class="specs">
        <span><b>Stack</b>SQL · Linux · Python · React</span>
        <span><b>Status</b>Open to work</span>
      </div>
      <div class="url">sawyehtet.com</div>
    </div>
  </div>
</body>
</html>`;

async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--font-render-hinting=none',
        ],
    });
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });
        await new Promise(r => setTimeout(r, 400));
        const outputPath = join(__dirname, '../public/images/og-preview.png');
        await page.screenshot({
            path: outputPath,
            type: 'png',
            clip: { x: 0, y: 0, width: 1200, height: 630 },
        });
        console.log('OG image generated:', outputPath);
    } finally {
        await browser.close();
    }
}

main().catch(err => {
    console.error('Failed to generate OG image:', err.message);
    process.exit(1);
});
