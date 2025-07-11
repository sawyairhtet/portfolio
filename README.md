# 🎨 Saw Ye Htet - Developer • Photographer • Creator

[![Portfolio](https://img.shields.io/badge/Portfolio-Live-brightgreen)](https://your-portfolio-url.com)
[![GitHub](https://img.shields.io/badge/GitHub-sawyairhtet-blue)](https://github.com/sawyairhtet)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/)

A clean, modern, and responsive portfolio website showcasing the intersection of development and photography. Built with vanilla HTML, CSS, and JavaScript, this portfolio emphasizes minimalist design, storytelling, and exceptional user experience.

## 🌟 Live Demo

🔗 **[View Live Portfolio](https://your-portfolio-url.com)**

## 📸 Preview

![Portfolio Preview](assets/screenshots/portfolio-preview.jpg)

_Clean, minimal design that lets the work speak for itself_

## ✨ Features Overview

### 🏠 Main Portfolio

- **Hero Section**: Professional introduction with custom profile picture
- **Projects Showcase**: Curated selection of development and photography work
- **Interactive Timeline**: Career progression and milestones
- **Personal Touch**: "100 Things I Love" for authentic personality
- **Responsive Design**: Seamless experience across all devices

### 👨‍💻 Developer Focus

- **Technical Projects**: Full-stack applications, mobile apps, and APIs
- **Code Samples**: Clean, documented examples of development work
- **Technology Stack**: Comprehensive skills and expertise display
- **GitHub Integration**: Direct links to repositories and live demos

### 📷 Photography Portfolio

- **Gallery Categories**: Portraits, Street, Architecture, Nature photography
- **Interactive Filters**: Easy navigation between photo categories
- **Lightbox Viewer**: Full-screen photo viewing experience
- **Technical Details**: Camera settings, equipment, and techniques
- **Professional Metadata**: Complete EXIF information display

### 📝 Content & Blog

- **Technical Writing**: Development tutorials and insights
- **Photography Articles**: Visual storytelling and technique guides
- **Newsletter Integration**: Visitor engagement and updates
- **SEO Optimized**: Search engine friendly content structure

## 🛠️ Technology Stack

### Frontend

- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with Flexbox/Grid, custom properties, and animations
- **Vanilla JavaScript**: Clean, dependency-free interactions
- **Progressive Enhancement**: Works without JavaScript enabled

### Design & UX

- **Inter Font Family**: Professional typography from Google Fonts
- **Mobile-First Design**: Responsive across all screen sizes
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized for Core Web Vitals

### Development Tools

- **No Build Process**: Direct file editing for immediate changes
- **Version Control**: Git workflow ready
- **Modern Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 📁 Project Structure

```
portfolio/
├── index.html                    # Main portfolio page
├── pages/
│   ├── about.html               # Personal story and background
│   ├── blog.html                # Blog listing and articles
│   └── gallery.html             # Photography portfolio
├── blog/
│   ├── react-performance-optimization.html
│   └── urban-photography-techniques.html
├── css/
│   └── main.css                 # All styles and animations
├── js/
│   ├── main.js                  # Core functionality
│   ├── projects-data.js         # Project and content data
│   └── blog.js                  # Blog functionality
├── assets/
│   ├── profile-picture.jpg      # Main profile image
│   ├── gallery/                 # Photography portfolio images
│   ├── projects/                # Project screenshots
│   ├── icons/                   # Favicons and PWA icons
│   └── documents/               # Resume and other documents
├── package.json                 # Project configuration
└── README.md                    # This documentation
```

## 🚀 Quick Start

### Prerequisites

- Modern web browser
- Code editor (VS Code recommended)
- Optional: Node.js for development server

### Installation

```bash
# Clone the repository
git clone https://github.com/sawyairhtet/portfolio.git
cd portfolio

# Option 1: Use live-server for development
npx live-server --port=3000

# Option 2: Use serve for simple static serving
npx serve .

# Option 3: Open directly in browser
# Simply open index.html in your preferred browser
```

### Development Workflow

```bash
# Start development server
npm run dev

# Build for production (optional)
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🎨 Customization Guide

### 1. Personal Information

**Update your details in multiple locations:**

`index.html` - Header section:

```html
<h1 class="name">Your Name</h1>
<p class="tagline">Your Professional Title</p>
<p class="location">📍 Your City, Country</p>
```

`js/projects-data.js` - Data configuration:

```javascript
const personalInfo = {
  name: "Your Name",
  title: "Developer • Photographer • Creator",
  email: "your.email@example.com",
  location: "Your City, Country",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourprofile",
};
```

### 2. Profile Picture

Replace `assets/profile-picture.jpg` with your photo:

- **Recommended size**: 400x400px minimum
- **Format**: JPG (optimized for web)
- **Style**: Professional headshot with clean background

### 3. Projects Portfolio

Edit `js/projects-data.js`:

```javascript
const projects = [
  {
    title: "Your Project Name",
    description:
      "Detailed project description highlighting key features and impact",
    tech: ["React", "Node.js", "PostgreSQL", "AWS"],
    links: [
      { text: "Live Demo", url: "https://your-demo.com" },
      { text: "GitHub", url: "https://github.com/yourusername/project" },
      { text: "Case Study", url: "#" },
    ],
    image: "assets/projects/project-screenshot.jpg",
    featured: true,
  },
];
```

### 4. Photography Gallery

**Add your photos to `assets/gallery/`:**

```
assets/gallery/
├── portraits/
├── street/
├── architecture/
└── nature/
```

**Update `pages/gallery.html`:**

```html
<img
  src="../assets/gallery/portraits/your-photo.jpg"
  alt="Photo Description"
  class="photo-img"
/>
```

### 5. About Page Content

Customize `pages/about.html` with your story:

- Personal journey into development/photography
- Professional experience and achievements
- Current projects and interests
- Technical setup and equipment

### 6. Color Scheme & Branding

Update CSS custom properties in `css/main.css`:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --accent-color: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --background: #ffffff;
  --surface: #f8fafc;
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### Testing

```bash
# Test responsive design
# Chrome DevTools: Toggle device toolbar
# Test on actual devices when possible
```

## 🎯 Performance Optimization

### Current Optimizations

- **Minimal Dependencies**: Only Google Fonts external dependency
- **Optimized Images**: WebP format with fallbacks
- **Lazy Loading**: Images load as user scrolls
- **Efficient CSS**: Organized and minified styles
- **JavaScript**: Clean, performance-focused code

### Lighthouse Scores Target

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Performance Tips

```bash
# Optimize images before adding
# Use WebP format for modern browsers
# Compress files for production
# Enable gzip on server
```

## ♿ Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Visible focus indicators
- **Alternative Text**: Descriptive alt text for all images

## 🔧 Browser Support

| Browser | Version | Status           |
| ------- | ------- | ---------------- |
| Chrome  | 90+     | ✅ Full Support  |
| Firefox | 88+     | ✅ Full Support  |
| Safari  | 14+     | ✅ Full Support  |
| Edge    | 90+     | ✅ Full Support  |
| IE 11   | -       | ❌ Not Supported |

### Progressive Enhancement

- Core functionality works without JavaScript
- Enhanced animations and interactions with JavaScript
- Graceful degradation for older browsers

## 🚀 Deployment Options

### Static Hosting (Recommended)

**Netlify:**

```bash
# Drag and drop the portfolio folder to Netlify
# Or connect GitHub repository for automatic deployments
```

**Vercel:**

```bash
npx vercel --prod
```

**GitHub Pages:**

```bash
# Enable Pages in repository settings
# Choose source: Deploy from a branch
# Select main branch and / (root) folder
```

**Firebase Hosting:**

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Custom Domain Setup

1. Purchase domain from registrar
2. Configure DNS settings
3. Update hosting platform with custom domain
4. Enable SSL certificate

## 📊 Analytics & Monitoring

### Google Analytics Setup

Add to `<head>` section:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

### Contact Form Integration

**Netlify Forms:**

```html
<form netlify>
  <!-- Form fields -->
</form>
```

**Formspree:**

```html
<form action="https://formspree.io/f/your-form-id" method="POST">
  <!-- Form fields -->
</form>
```

## 🔍 SEO Optimization

### Meta Tags Setup

```html
<!-- Basic SEO -->
<title>Saw Ye Htet - Developer • Photographer • Creator</title>
<meta
  name="description"
  content="Portfolio of Saw Ye Htet, a developer and photographer who builds beautiful web applications and captures compelling moments."
/>

<!-- Open Graph -->
<meta property="og:title" content="Saw Ye Htet - Developer • Photographer" />
<meta
  property="og:description"
  content="Portfolio showcasing development and photography work"
/>
<meta property="og:image" content="https://yoursite.com/assets/og-image.jpg" />
<meta property="og:url" content="https://yoursite.com" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Saw Ye Htet Portfolio" />
<meta
  name="twitter:description"
  content="Developer and photographer portfolio"
/>
<meta
  name="twitter:image"
  content="https://yoursite.com/assets/twitter-image.jpg"
/>
```

### Schema Markup

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Saw Ye Htet",
  "jobTitle": "Developer and Photographer",
  "url": "https://yoursite.com",
  "sameAs": [
    "https://github.com/sawyairhtet",
    "https://linkedin.com/in/saw-ye-htet-the-man-who-code"
  ]
}
```

## 📝 Content Guidelines

### Writing Style

- **Authentic Voice**: Personal and professional balance
- **Clear Communication**: Avoid jargon, explain technical concepts
- **Storytelling**: Connect projects to real-world impact
- **Visual Hierarchy**: Use headings and formatting effectively

### Photography Guidelines

- **High Quality**: Sharp, well-composed images
- **Consistent Style**: Cohesive visual aesthetic
- **Proper Attribution**: Credit collaborators and models
- **Technical Info**: Include camera settings and equipment details

## 🐛 Troubleshooting

### Common Issues

**Images not loading:**

```bash
# Check file paths are correct
# Ensure images are properly uploaded
# Verify file formats (JPG, PNG, WebP)
```

**Contact form not working:**

```bash
# Verify form action URL
# Check for JavaScript console errors
# Test form submission manually
```

**Mobile display issues:**

```bash
# Test on actual devices
# Use Chrome DevTools responsive mode
# Check viewport meta tag
```

**Performance issues:**

```bash
# Optimize and compress images
# Minimize HTTP requests
# Enable browser caching
```

## 🤝 Contributing

While this is a personal portfolio, contributions for improvements are welcome:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/improvement`)
3. **Commit** your changes (`git commit -am 'Add improvement'`)
4. **Push** to the branch (`git push origin feature/improvement`)
5. **Create** a Pull Request

### Development Guidelines

- Follow existing code style and structure
- Test across multiple browsers and devices
- Ensure accessibility compliance
- Optimize for performance

## 📄 License

MIT License - You're free to use this template for your own portfolio.

```
MIT License

Copyright (c) 2024 Saw Ye Htet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact & Support

### Get in Touch

- **Email**: [your@email.com](mailto:your@email.com)
- **GitHub**: [@sawyairhtet](https://github.com/sawyairhtet)
- **LinkedIn**: [Saw Ye Htet](https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/)

### Support This Project

If you find this portfolio template helpful:

- ⭐ **Star** the repository
- 🐛 **Report** issues and bugs
- 💡 **Suggest** improvements and features
- 📤 **Share** with other developers and photographers
- ☕ **Buy me a coffee** if you're feeling generous

### Hire Me

Currently available for:

- **Web Development**: Full-stack applications and websites
- **Photography**: Portraits, events, and commercial work
- **Consulting**: Technical guidance and creative direction

---

## 🚀 Project Roadmap

### Upcoming Features

- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Blog CMS**: Content management system integration
- [ ] **Advanced Gallery**: Enhanced photo organization and search
- [ ] **Client Portal**: Password-protected project galleries
- [ ] **Analytics Dashboard**: Built-in visitor and engagement metrics

### Version History

- **v1.0.0** - Initial release with core portfolio features
- **v1.1.0** - Added photography gallery and blog section
- **v1.2.0** - Enhanced mobile responsiveness and performance
- **v1.3.0** - Current version with improved accessibility and SEO

---

**Built with ❤️, clean code, and creative vision**

_Last updated: January 2025_
