# 🎨 Assets & Media Guide

**This directory serves as the tailored media library for the Saw Ye Htet Portfolio website.**

It contains all static visual elements, including wallpapers, icons, and profile images used throughout the application.

## 📋 Table of Contents

- [📦 Current Inventory](#-current-inventory)
- [📖 Usage Examples](#-usage-examples)
- [📐 Contribution Guidelines](#-contribution-guidelines)
- [⚡ Optimization Standards](#-optimization-standards)

---

## 📦 Current Inventory

As of the latest update, the folder structure is flat and contains:

```plaintext
assets/
├── README.md               # This documentation file
└── wallpaper-abstract.png  # The primary desktop background (Ubuntu Style)
```

---

## 📖 Usage Examples

### Using the Wallpaper

The abstract wallpaper is designed to work as a responsive background cover.

**CSS Implementation:**
```css
.wallpaper {
    background-image: url('../assets/wallpaper-abstract.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
```

**New to the project?**
When adding an image, reference it relative to the `css/` or `index.html` file.
- From CSS: `../assets/imagename.ext`
- From HTML: `assets/imagename.ext`

---

## 📐 Best Practices & Guidelines

### File Naming Conventions
Consistency is key. Please adhere to the `kebab-case` naming standard.

- **Bad:** `Profile pic.jpg`, `MyProject_FINAL.png`, `IMG_2024.jpg`
- **Good:** `profile-picture.jpg`, `project-portfolio-hero.png`, `icon-close.svg`

**Structure:** `category-description-variant.extension`

### Recommended Folder Hierarchy (Future Proofing)
As the project grows, organize new assets into these sub-folders:

```
assets/
├── icons/          # SVGs and favicons
├── images/         # Content images (projects, photography)
└── wallpapers/     # Desktop backgrounds
```

---

## ⚡ Optimization Standards

To ensure the portfolio remains fast (`Lighthouse Score > 90`), all assets must be optimized before committing.

### Image Formats
- **Photos/Wallpapers:** Use **JPG** or **WebP** (Quality: 80-90%).
- **UI Elements/Screenshots:** Use **PNG** or **WebP**.
- **Icons:** Use **SVG** whenever possible for scalability.

### Tools we use
1.  **[Squoosh.app](https://squoosh.app/)**: For manual compression and resizing.
2.  **[TinyPNG](https://tinypng.com/)**: Quick optimization for PNG/JPG.
