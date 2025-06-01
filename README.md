# 3D Portfolio Website

A modern, interactive 3D portfolio website built with Three.js, featuring smooth animations, responsive design, and an immersive user experience.

## 🚀 Features

- **Interactive 3D Scene**: Built with Three.js featuring geometric shapes, particles, and dynamic lighting
- **Smooth Navigation**: Seamless transitions between different sections (About, Skills, Projects, Contact)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with glassmorphism effects
- **Loading Animation**: Engaging 3D cube loading screen
- **Keyboard Navigation**: Arrow keys and number keys for quick section switching
- **Contact Form**: Functional contact form with validation
- **Performance Optimized**: Efficient rendering and adaptive quality

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js
- **Styling**: CSS Custom Properties, Flexbox, Grid
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)

## 📁 Project Structure

```
Portfolio/
├── index.html          # Main HTML file
├── style.css           # Stylesheet with responsive design
├── script.js           # JavaScript with Three.js implementation
└── README.md           # Project documentation
```

## 🔧 Recent Fixes Applied

### JavaScript Issues Fixed:

1. **Syntax Errors**: Corrected broken lines and incomplete code blocks
2. **Three.js Integration**: Fixed OrbitControls import and implementation
3. **Function Completeness**: Completed all incomplete functions
4. **Event Handling**: Fixed navigation and form submission handlers
5. **Animation Loop**: Corrected the render loop and object animations
6. **Camera Controls**: Fixed camera movement and section transitions

### HTML Issues Fixed:

1. **CDN Links**: Updated Three.js CDN links to reliable sources
2. **Form Attributes**: Added proper name attributes to form fields
3. **Script Loading**: Fixed script loading order and dependencies

### CSS Issues Fixed:

1. **Mobile Navigation**: Added hamburger menu functionality
2. **Responsive Design**: Enhanced mobile and tablet layouts
3. **Animation Classes**: Completed fade-in and slide-up animations
4. **Scrollbar Styling**: Added custom scrollbar for content panels

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)

### Installation & Running

1. **Clone or download** the project files to your local machine

2. **Navigate** to the project directory:

   ```bash
   cd Portfolio
   ```

3. **Start a local server**:

   **Using Python:**

   ```bash
   python -m http.server 8000
   ```

   **Using Node.js (if you have it installed):**

   ```bash
   npx http-server -p 8000
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

## 🎮 Usage

### Navigation

- **Mouse**: Drag to rotate the 3D scene, scroll to zoom
- **Section Indicators**: Click the right-side indicators to switch sections
- **Navigation Bar**: Click navigation links to jump to sections
- **Keyboard Shortcuts**:
  - Arrow keys: Navigate between sections
  - Number keys (1-4): Jump directly to sections
  - Mouse wheel: Zoom in/out

### Sections

1. **About**: Personal introduction and statistics
2. **Skills**: Technical skills and technologies
3. **Projects**: Featured project showcase
4. **Contact**: Contact information and form

## 📱 Responsive Design

The website is fully responsive and optimized for:

- **Desktop**: Full 3D experience with all features
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Simplified navigation with hamburger menu

## 🎨 Customization

### Colors

Edit the CSS custom properties in `style.css`:

```css
:root {
  --primary-color: #4f46e5;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
  /* ... other colors */
}
```

### Content

Update the content in `index.html`:

- Personal information in the About section
- Skills and technologies
- Project details and links
- Contact information

### 3D Scene

Modify the Three.js scene in `script.js`:

- Adjust lighting, materials, and geometries
- Change animation speeds and effects
- Add new 3D objects or particles

## 🔧 Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile browsers**: ✅ Responsive support

## 📈 Performance

The website includes several performance optimizations:

- Efficient Three.js rendering
- Optimized particle systems
- Responsive image loading
- CSS animations with hardware acceleration
- Adaptive quality based on device capabilities

## 🐛 Troubleshooting

### Common Issues:

1. **3D scene not loading**:

   - Check browser console for JavaScript errors
   - Ensure Three.js CDN is accessible
   - Try refreshing the page

2. **Performance issues**:

   - The website automatically adapts quality based on performance
   - Try closing other browser tabs
   - Update your graphics drivers

3. **Mobile navigation not working**:
   - Ensure JavaScript is enabled
   - Try refreshing the page
   - Check for console errors

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📞 Support

If you encounter any issues or have questions, please check the troubleshooting section above or create an issue in the project repository.

---

**Enjoy exploring your new 3D portfolio website!** 🚀
