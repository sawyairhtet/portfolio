#!/usr/bin/env node
/* eslint-disable no-console */
/* global process */

// Pre-deployment safety checks for portfolio website
import fs from 'node:fs';

console.log('Running pre-deployment safety checks...\n');

let hasErrors = false;

// Check 1: Verify main files exist
const requiredFiles = ['index.html', 'css/main.css', 'js/app.js', '404.html'];
requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        console.log(`[ERROR] Missing required file: ${file}`);
        hasErrors = true;
    } else {
        console.log(`[OK] Found: ${file}`);
    }
});

// Check 2: Validate HTML syntax (very basic)
try {
    const htmlContent = fs.readFileSync('index.html', 'utf8');

    if (!htmlContent.includes('<!DOCTYPE html>')) {
        console.log('[WARN] Missing DOCTYPE declaration');
    }

    if (!htmlContent.includes('</html>')) {
        console.log('[ERROR] Missing closing </html> tag');
        hasErrors = true;
    }

    if (!htmlContent.includes('</body>')) {
        console.log('[ERROR] Missing closing </body> tag');
        hasErrors = true;
    }

    const bodyOpenTags = (htmlContent.match(/<body[^>]*>/g) || []).length;
    const bodyCloseTags = (htmlContent.match(/<\/body>/g) || []).length;
    if (bodyOpenTags !== bodyCloseTags) {
        console.log('[ERROR] Unmatched <body> tags');
        hasErrors = true;
    }

    console.log('[OK] Basic HTML structure looks good');
} catch (error) {
    console.log('[ERROR] Error reading index.html:', error.message);
    hasErrors = true;
}

// Check 3: Verify CSS file is not empty
try {
    const cssContent = fs.readFileSync('css/main.css', 'utf8');
    if (cssContent.trim().length === 0) {
        console.log('[WARN] CSS file is empty');
    } else {
        console.log('[OK] Source CSS file has content');
    }
} catch (error) {
    console.log('[WARN] Could not read CSS file:', error.message);
}

// Check 3b: Verify Build Artifacts (dist/bundle.min.css)
try {
    if (fs.existsSync('dist/bundle.min.css')) {
        const stats = fs.statSync('dist/bundle.min.css');
        if (stats.size > 0) {
            console.log('[OK] Build artifact found (dist/bundle.min.css)');
        } else {
            console.log('[ERROR] Build artifact is empty (dist/bundle.min.css)');
            hasErrors = true;
        }
    } else {
        console.log(
            '[ERROR] Build artifact missing (dist/bundle.min.css). Run "npm run build" first.'
        );
        hasErrors = true;
    }
} catch (error) {
    console.log('[ERROR] Could not check build artifacts:', error.message);
    hasErrors = true;
}

// Check 4: Verify JavaScript syntax (very basic)
try {
    const jsContent = fs.readFileSync('js/app.js', 'utf8');
    const openBraces = (jsContent.match(/\{/g) || []).length;
    const closeBraces = (jsContent.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
        console.log('[WARN] Potential JavaScript syntax issue (unmatched braces)');
    } else {
        console.log('[OK] JavaScript syntax looks okay');
    }
} catch (error) {
    console.log('[WARN] Could not read JavaScript file:', error.message);
}

// Check 5: Look for broken image paths in index.html
try {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    const imgMatches = htmlContent.match(/src=["']([^"']+)["']/g);
    if (imgMatches) {
        imgMatches.forEach(match => {
            const imgPath = match.match(/src=["']([^"']+)["']/)[1];
            if (imgPath.startsWith('http')) {
                return; // external URLs
            }
            if (!fs.existsSync(imgPath)) {
                console.log(`[ERROR] Image not found: ${imgPath}`);
                hasErrors = true;
            }
        });
    }
    console.log('[OK] Image paths checked');
} catch (error) {
    console.log('[WARN] Could not check image paths:', error.message);
}

// Check 6: Auto-update sitemap.xml lastmod date
try {
    const sitemapPath = 'sitemap.xml';
    if (fs.existsSync(sitemapPath)) {
        let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const lastmodRegex = /<lastmod>[^<]*<\/lastmod>/g;

        if (sitemapContent.includes('<lastmod>')) {
            sitemapContent = sitemapContent.replace(lastmodRegex, `<lastmod>${today}</lastmod>`);
            fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
            console.log(`[OK] Updated sitemap.xml lastmod to ${today}`);
        } else {
            console.log('[WARN] No <lastmod> tag found in sitemap.xml');
        }
    } else {
        console.log('[WARN] sitemap.xml not found');
    }
} catch (error) {
    console.log('[WARN] Could not update sitemap.xml:', error.message);
}

// Check 7: Verify Google Analytics tag is present (#50)
try {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    if (
        htmlContent.includes('googletagmanager.com/gtag/js') ||
        htmlContent.includes('google-analytics.com')
    ) {
        console.log('[OK] Google Analytics snippet found');
    } else {
        console.log('[WARN] Google Analytics snippet not found in index.html');
    }
} catch (error) {
    console.log('[WARN] Could not check for Google Analytics:', error.message);
}

console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('[ERROR] CRITICAL ISSUES FOUND - DO NOT DEPLOY!');
    console.log('Please fix the errors above before committing.');
    process.exit(1);
} else {
    console.log('[OK] All checks passed - Safe to deploy!');
    console.log('Reminder: Test locally at http://localhost:3000 first');
    process.exit(0);
}
