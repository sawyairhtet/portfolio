# Portfolio Website - Simple & Clean

A clean, organized, and easy-to-manage portfolio website built with vanilla HTML, CSS, and JavaScript.

## 🎯 **Easy Content Management**

Your portfolio is now organized for maximum simplicity and ease of updates:

### **📝 Update Your Information**

**All your personal data is centralized in one file:**

- Edit `js/config.js` to update:
  - Personal information (name, title, location, email)
  - Social links
  - Projects and descriptions
  - Timeline entries
  - Things you love

### **📁 File Organization**

```
portfolio/
├── index.html              # Main page (rarely needs editing)
├── js/
│   ├── config.js           # 🎯 EDIT THIS for content updates
│   ├── main.js             # Simple interactions
│   └── blog.js             # Simple blog functionality
├── css/
│   └── main.css            # Well-organized styles
├── pages/                  # Additional pages
├── blog/                   # Blog posts
└── assets/                 # Images and media
```

## 🚀 **How to Update Your Portfolio**

### **1. Personal Information**

Edit `js/config.js` and update the `personal` section:

```javascript
personal: {
  name: "Your Name",
  title: "Your Title",
  location: "📍 Your Location",
  email: "your.email@example.com"
}
```

### **2. Add/Update Projects**

Edit the `projects` array in `js/config.js`:

```javascript
projects: [
  {
    title: "Your Project Name",
    description: "Project description...",
  },
];
```

### **3. Update Timeline**

Edit the `timeline` array in `js/config.js`

### **4. Add Blog Posts**

- Create new HTML files in the `blog/` folder
- Update the `blogPosts` array in `js/config.js`

## 🛠 **Development**

### **Start Development Server**

```bash
npm run dev
```

### **Simple HTTP Server**

```bash
npm start
```

## 🎨 **Design Philosophy**

- **Simple**: No overengineering or unnecessary complexity
- **Clean**: Well-organized code with clear sections
- **Manageable**: One file (`config.js`) for most content updates
- **Responsive**: Works perfectly on all devices
- **Fast**: Minimal JavaScript, optimized CSS

## 📱 **Mobile-First**

The portfolio is designed mobile-first with:

- Touch-friendly interactions
- Responsive navigation
- Optimized for all screen sizes
- Fast loading on mobile networks

## 🔧 **What Was Simplified**

✅ **Removed complexity:**

- Overengineered blog filtering (you only have 2 posts)
- Unused project data structures
- Excessive JavaScript features
- Complicated responsive breakpoints

✅ **Organized better:**

- CSS into logical sections with clear headings
- JavaScript simplified to essential features only
- All content centralized in `config.js`
- Clear file structure and naming

## 🎯 **Key Files to Know**

1. **`js/config.js`** - Update your content here
2. **`css/main.css`** - Organized styles (rarely needs editing)
3. **`index.html`** - Main page structure (rarely needs editing)
4. **`js/main.js`** - Simple interactions (rarely needs editing)

## 📊 **Browser Support**

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No build process required
- Works offline once loaded

---

**🎉 Your portfolio is now simple, clean, and easy to manage!**

To update your content, just edit `js/config.js` and refresh your browser.
