# 🛡️ Deployment Safety Guide

## ✅ **Safe Deployment Workflow** (Follow EVERY Time)

### **Step 1: Local Testing**

```bash
# Start local development server
npm run dev  # Opens http://localhost:3000

# Make your changes, test in browser
# Check all pages work: Home, About, Gallery, Blog
# Test on different screen sizes (mobile/desktop)
```

### **Step 2: Pre-Commit Safety Check**

```bash
# Run automated safety checks
npm run check

# If PASSED ✅ → Continue to Step 3
# If FAILED ❌ → Fix issues and run again
```

### **Step 3: Git Safety Workflow**

```bash
# Check what you're committing
git status
git diff

# Add files (be specific, avoid git add .)
git add index.html css/main.css js/main.js

# Write descriptive commit message
git commit -m "Add new VR project section with hand tracking details"

# Push to trigger deployment
git push origin main
```

### **Step 4: Verify Deployment**

```bash
# Wait 2-3 minutes, then check:
# 1. Visit https://sawyehtet.com
# 2. Test all functionality
# 3. Check browser console for errors (F12)
```

---

## 🚨 **Emergency Recovery Strategies**

### **If You Pushed Broken Code:**

#### **Method 1: Quick Hotfix (Recommended)**

```bash
# Fix the issue locally
# Test with npm run dev
# Run npm run check
# Commit and push fix
git add .
git commit -m "🚑 HOTFIX: Fix broken navigation links"
git push origin main
```

#### **Method 2: Rollback to Previous Version**

```bash
# See recent commits
git log --oneline -5

# Rollback to previous good commit
git revert HEAD --no-edit
git push origin main

# This creates a new commit that undoes the broken one
```

#### **Method 3: Nuclear Option (Last Resort)**

```bash
# Reset to specific good commit (DANGEROUS!)
git log --oneline -10        # Find good commit hash
git reset --hard abc123f     # Replace with actual hash
git push --force origin main # ⚠️ This rewrites history!
```

---

## 🔍 **Common Issues & Prevention**

### **Prevent Broken Images**

- Always check image paths with `npm run check`
- Use relative paths: `assets/image.jpg` ✅
- Avoid absolute paths: `/home/user/image.jpg` ❌

### **Prevent CSS/JS Errors**

- Test in multiple browsers
- Check browser console (F12) for errors
- Use CSS/JS validators online

### **Prevent Content Issues**

- Spell check important text
- Test all links work
- Verify contact information is correct

---

## 📊 **Monitoring Your Site**

### **Set Up Alerts (Recommended)**

1. **UptimeRobot** - Free monitoring, emails when site is down
2. **Google Search Console** - SEO and indexing issues
3. **Netlify Status** - Check deployment status

### **Weekly Health Check**

```bash
# Run every Sunday
npm run check
# Visit your site from different devices
# Check Google Analytics for issues
```

---

## 🎯 **Best Practices**

### **Commit Messages**

- ✅ "Add new VR project with hand tracking demo"
- ✅ "Update timeline with Capella Hotel experience"
- ✅ "Fix mobile navigation on gallery page"
- ❌ "updates"
- ❌ "fix stuff"

### **Testing Checklist**

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Gallery images display
- [ ] Blog posts are accessible
- [ ] Mobile responsive design works
- [ ] No console errors in browser
- [ ] Contact information is accurate

### **Git Branch Strategy (Optional)**

```bash
# For major changes, use branches
git checkout -b feature/new-project-section
# Make changes, test thoroughly
git checkout main
git merge feature/new-project-section
git push origin main
```

---

## ⚡ **Quick Reference Commands**

```bash
# Daily workflow
npm run dev          # Start local testing
npm run check        # Safety check before commit
git status           # See what changed
git add filename.ext # Add specific files
git commit -m "msg"  # Commit with message
git push origin main # Deploy to live site

# Emergency commands
git log --oneline -5 # See recent commits
git revert HEAD      # Undo last commit
git reset --hard     # ⚠️ Nuclear reset (dangerous!)
```

Remember: **Better to delay a deployment than deploy broken code!** 🚀
