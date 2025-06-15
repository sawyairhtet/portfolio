# Deployment Guide

This guide covers the deployment process for the 3D Portfolio Website.

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

## Build Process

### Development Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will be available at `http://localhost:3000`

### Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Deployment Options

### 1. GitHub Pages (Recommended)

```bash
# Deploy to GitHub Pages
npm run deploy
```

This will:
- Build the project for production
- Deploy to the `gh-pages` branch
- Make the site available at `https://[username].github.io/3d-portfolio-website`

### 2. Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push to main branch

Build settings:
```
Build command: npm run build
Publish directory: dist
Node version: 18
```

### 3. Vercel

1. Import your GitHub repository to Vercel
2. Vercel will auto-detect the framework
3. Deploy automatically

### 4. Manual Deployment

```bash
# Build the project
npm run build

# Copy the dist/ folder contents to your web server
```

## Environment Variables

Create a `.env` file for environment-specific configurations:

```env
# Development
NODE_ENV=development

# Production
NODE_ENV=production

# Analytics (optional)
GOOGLE_ANALYTICS_ID=your-ga-id

# Contact form (optional)
CONTACT_FORM_ENDPOINT=your-form-endpoint
```

## Performance Optimization

The build process includes:

- **Code Splitting**: Separate chunks for vendors, Three.js, and application code
- **Minification**: JavaScript and CSS minification
- **Asset Optimization**: Image optimization and compression
- **Caching**: Long-term caching with content hashes
- **Tree Shaking**: Remove unused code

## Bundle Analysis

Analyze bundle size:

```bash
npm run build:analyze
```

This will generate a bundle analyzer report to help optimize bundle size.

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test 3D scene functionality
- [ ] Check responsive design on different devices
- [ ] Validate contact form submission
- [ ] Test navigation and interactions
- [ ] Verify SEO meta tags
- [ ] Check performance metrics
- [ ] Test in different browsers

## Troubleshooting

### Common Issues

1. **Three.js not loading**
   - Check CDN links in HTML
   - Verify internet connection
   - Check browser console for errors

2. **Build failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Performance issues**
   - Check bundle size with analyzer
   - Optimize images and assets
   - Consider lazy loading for heavy components

### Debug Mode

Enable debug mode in development:

```javascript
window.DEBUG = true;
```

This will enable additional console logging and debugging features.

## Monitoring

### Performance Metrics

Monitor these key metrics:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Bundle size

### Error Tracking

Consider integrating error tracking services:
- Sentry
- LogRocket
- Bugsnag

## Security

### Content Security Policy

Add CSP headers for enhanced security:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
```

### HTTPS

Always deploy with HTTPS enabled for:
- Security
- Performance (HTTP/2)
- PWA compatibility
- SEO benefits

## Maintenance

### Regular Updates

- Update dependencies monthly
- Monitor security vulnerabilities
- Update Three.js for new features
- Review and optimize performance

### Backup

- Regular backups of source code
- Version control with Git
- Document any custom configurations 