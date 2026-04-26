/**
 * OG Image Generator
 * Generates a polished Open Graph preview image for sawyehtet.com
 * Run: npm run generate:og
 */

import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read profile picture and base64-encode it for inline embedding
const profilePicPath = join(__dirname, '../public/images/profile-picture.webp');
const profilePicBase64 = `data:image/webp;base64,${readFileSync(profilePicPath).toString('base64')}`;

const html = /* html */ `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    body {
      background: #0a0015;
      position: relative;
      display: flex;
    }

    /* ── Background layers ── */
    .bg {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 90% 80% at 70% 50%, rgba(124, 92, 252, 0.22) 0%, transparent 65%),
        radial-gradient(ellipse 45% 45% at 2% 95%,  rgba(80,  40, 220, 0.18) 0%, transparent 60%),
        linear-gradient(145deg, #080012 0%, #12042a 55%, #080012 100%);
    }

    /* Subtle dot-grid overlay */
    .dots {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(124,92,252,0.12) 1px, transparent 1px);
      background-size: 30px 30px;
    }

    /* Top gradient accent bar */
    .top-bar {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg,
        transparent 0%,
        #5a30d4 15%,
        #7c5cfc 35%,
        #b78bff 50%,
        #7c5cfc 65%,
        #5a30d4 85%,
        transparent 100%
      );
    }

    /* Corner accent brackets */
    .corner {
      position: absolute;
      width: 22px;
      height: 22px;
    }
    .corner-tl { top: 28px;    left: 32px;   border-top:  2px solid rgba(124,92,252,0.45); border-left:  2px solid rgba(124,92,252,0.45); }
    .corner-tr { top: 28px;    right: 32px;  border-top:  2px solid rgba(124,92,252,0.45); border-right: 2px solid rgba(124,92,252,0.45); }
    .corner-bl { bottom: 28px; left: 32px;   border-bottom: 2px solid rgba(124,92,252,0.45); border-left:  2px solid rgba(124,92,252,0.45); }

    /* ── Main layout ── */
    .content {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 52px 76px 52px 80px;
      gap: 60px;
    }

    /* ── Profile photo ── */
    .photo-wrap {
      position: relative;
      flex-shrink: 0;
    }

    /* Outer soft glow */
    .photo-glow {
      position: absolute;
      inset: -24px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(124,92,252,0.38) 0%, transparent 68%);
      filter: blur(12px);
    }

    /* Gradient-border ring */
    .photo-ring {
      position: relative;
      width: 252px;
      height: 252px;
      border-radius: 50%;
      padding: 3.5px;
      background: conic-gradient(from 200deg, #7c5cfc, #b78bff, #4a9eff, #b78bff, #7c5cfc);
    }

    .photo-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      background: #1a0a2e;
    }

    .photo-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
    }

    /* ── Text content ── */
    .text {
      flex: 1;
      min-width: 0;
    }

    .eyebrow {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #9d7fff;
      margin-bottom: 16px;
    }

    .eyebrow-line {
      width: 26px;
      height: 2px;
      border-radius: 1px;
      background: linear-gradient(90deg, #7c5cfc, #9d7fff);
      flex-shrink: 0;
    }

    .name {
      font-size: 78px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.0;
      letter-spacing: -2.5px;
      margin-bottom: 18px;
      /* subtle text-shadow for depth */
      text-shadow: 0 2px 40px rgba(124,92,252,0.25);
    }

    .role {
      font-size: 25px;
      font-weight: 400;
      color: #c4b5fd;
      margin-bottom: 34px;
      letter-spacing: 0.01em;
    }

    .divider {
      width: 44px;
      height: 3px;
      border-radius: 2px;
      background: linear-gradient(90deg, #7c5cfc, #b78bff);
      margin-bottom: 30px;
    }

    /* Tech stack tags */
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .tag {
      padding: 6px 17px;
      border-radius: 100px;
      background: rgba(124, 92, 252, 0.11);
      border: 1px solid rgba(124, 92, 252, 0.32);
      color: #c4b5fd;
      font-size: 13.5px;
      font-weight: 500;
      letter-spacing: 0.03em;
    }

    /* ── URL badge (bottom-right) ── */
    .url-badge {
      position: absolute;
      bottom: 40px;
      right: 76px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 8px 20px;
      border-radius: 100px;
      background: rgba(124, 92, 252, 0.09);
      border: 1px solid rgba(124, 92, 252, 0.22);
    }

    .url-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #7c5cfc;
      box-shadow: 0 0 8px rgba(124,92,252,0.9);
      flex-shrink: 0;
    }

    .url-text {
      font-size: 15.5px;
      font-weight: 500;
      color: rgba(196, 181, 253, 0.75);
      letter-spacing: 0.04em;
    }
  </style>
</head>
<body>
  <div class="bg"></div>
  <div class="dots"></div>
  <div class="top-bar"></div>

  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>

  <div class="content">
    <!-- Profile photo -->
    <div class="photo-wrap">
      <div class="photo-glow"></div>
      <div class="photo-ring">
        <div class="photo-inner">
          <img src="${profilePicBase64}" alt="Saw Ye Htet" />
        </div>
      </div>
    </div>

    <!-- Text -->
    <div class="text">
      <div class="eyebrow">
        <span class="eyebrow-line"></span>
        Portfolio
      </div>
      <div class="name">Saw Ye Htet</div>
      <div class="role">Full Stack Java Developer</div>
      <div class="divider"></div>
      <div class="tags">
        <span class="tag">Java</span>
        <span class="tag">Spring Boot</span>
        <span class="tag">React</span>
        <span class="tag">TypeScript</span>
        <span class="tag">PostgreSQL</span>
      </div>
    </div>
  </div>

  <div class="url-badge">
    <div class="url-dot"></div>
    <span class="url-text">sawyehtet.com</span>
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

        // 1200×630 at 1× — exact OG spec
        await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

        // Set content and wait for Google Fonts to load
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });

        // Extra pause to ensure font rendering is complete
        await new Promise(r => setTimeout(r, 600));

        const outputPath = join(__dirname, '../public/images/og-preview.png');
        await page.screenshot({
            path: outputPath,
            type: 'png',
            clip: { x: 0, y: 0, width: 1200, height: 630 },
        });

        console.log('OG image generated successfully:', outputPath);
    } finally {
        await browser.close();
    }
}

main().catch(err => {
    console.error('Failed to generate OG image:', err.message);
    process.exit(1);
});
