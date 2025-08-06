#!/usr/bin/env node

// 🛡️ Pre-deployment safety checks for portfolio website
const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment safety checks...\n');

let hasErrors = false;

// Check 1: Verify main files exist
const requiredFiles = ['index.html', 'css/main.css', 'js/main.js'];
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`❌ Missing required file: ${file}`);
    hasErrors = true;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// Check 2: Validate HTML syntax (basic)
try {
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  
  // Check for common HTML issues
  if (!htmlContent.includes('<!DOCTYPE html>')) {
    console.log('⚠️  Missing DOCTYPE declaration');
  }
  
  if (!htmlContent.includes('</html>')) {
    console.log('❌ Missing closing </html> tag');
    hasErrors = true;
  }
  
  if (!htmlContent.includes('</body>')) {
    console.log('❌ Missing closing </body> tag');
    hasErrors = true;
  }
  
  // Check for properly closed tags
  const bodyOpenTags = (htmlContent.match(/<body[^>]*>/g) || []).length;
  const bodyCloseTags = (htmlContent.match(/<\/body>/g) || []).length;
  
  if (bodyOpenTags !== bodyCloseTags) {
    console.log('❌ Unmatched <body> tags');
    hasErrors = true;
  }
  
  console.log('✅ Basic HTML structure looks good');
} catch (error) {
  console.log('❌ Error reading index.html:', error.message);
  hasErrors = true;
}

// Check 3: Verify CSS file is not empty
try {
  const cssContent = fs.readFileSync('css/main.css', 'utf8');
  if (cssContent.trim().length === 0) {
    console.log('⚠️  CSS file is empty');
  } else {
    console.log('✅ CSS file has content');
  }
} catch (error) {
  console.log('⚠️  Could not read CSS file:', error.message);
}

// Check 4: Verify JavaScript syntax (basic)
try {
  const jsContent = fs.readFileSync('js/main.js', 'utf8');
  // Very basic check for unclosed brackets
  const openBraces = (jsContent.match(/\{/g) || []).length;
  const closeBraces = (jsContent.match(/\}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    console.log('⚠️  Potential JavaScript syntax issue (unmatched braces)');
  } else {
    console.log('✅ JavaScript syntax looks okay');
  }
} catch (error) {
  console.log('⚠️  Could not read JavaScript file:', error.message);
}

// Check 5: Look for broken image paths
try {
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  const imgMatches = htmlContent.match(/src=["']([^"']+)["']/g);
  
  if (imgMatches) {
    imgMatches.forEach(match => {
      const imgPath = match.match(/src=["']([^"']+)["']/)[1];
      if (imgPath.startsWith('http')) return; // Skip external URLs
      
      if (!fs.existsSync(imgPath)) {
        console.log(`❌ CRITICAL: Image not found: ${imgPath}`);
        hasErrors = true;
      }
    });
  }
  console.log('✅ Image paths checked');
} catch (error) {
  console.log('⚠️  Could not check image paths:', error.message);
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ CRITICAL ISSUES FOUND - DO NOT DEPLOY!');
  console.log('Please fix the errors above before committing.');
  process.exit(1);
} else {
  console.log('✅ All checks passed - Safe to deploy!');
  console.log('💡 Remember to test locally at http://localhost:3000 first');
  process.exit(0);
}