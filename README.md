# 🏰 Sky Castle Portfolio

A magical, Ghibli-inspired portfolio website featuring floating islands, Three.js 3D graphics, and enchanting animations. Experience your projects like never before in a world where creativity floats among the clouds.

## ✨ Features

### 🌟 Magical Experience

- **Floating Islands**: Each project lives on its own magical floating island
- **3D Environment**: Built with Three.js for immersive 3D interactions
- **Ghibli-Inspired Design**: Soft colors, gentle animations, and whimsical elements
- **Interactive Elements**: Hover, click, and explore with magical feedback

### 🎮 Interactive Navigation

- **Mouse Controls**: Drag to explore the sky, scroll to zoom
- **Touch Support**: Full mobile and tablet compatibility
- **Keyboard Shortcuts**:
  - `1-4`: Focus on specific projects
  - `R`: Reset camera view
  - `Space`: Create magical sparkles
  - `Escape`: Return to overview

### 🎨 Visual Magic

- **Particle Systems**: Floating magical particles around each island
- **Dynamic Lighting**: Warm, cinematic lighting like Ghibli films
- **Smooth Animations**: Gentle floating motion and transitions
- **Atmospheric Effects**: Clouds, sparkles, and ambient elements

### 📱 Responsive Design

- **Mobile Optimized**: Touch-friendly interactions and responsive layouts
- **Performance Adaptive**: Automatic quality adjustment based on device performance
- **Cross-Browser**: Compatible with modern browsers

## 🚀 Quick Start

1. **Clone or Download**: Get the portfolio files
2. **Open in Browser**: Simply open `index.html` in your web browser
3. **Customize Content**: Edit the project data in `js/projects-data.js`
4. **Personalize Pages**: Update `pages/about.html` and `pages/contact.html`

## 📁 Project Structure

```
portfolio/
├── index.html              # Main portfolio page
├── css/
│   ├── main.css            # Main styles for 3D portfolio
│   └── pages.css           # Styles for about/contact pages
├── js/
│   ├── projects-data.js    # Project information and data
│   ├── scene-setup.js      # Three.js scene initialization
│   ├── interactions.js     # Mouse/touch interactions
│   ├── animations.js       # Animation systems
│   ├── main.js            # Main initialization
│   ├── page-animations.js  # Page-specific animations
│   └── contact-form.js     # Contact form handling
├── pages/
│   ├── about.html         # About page
│   └── contact.html       # Contact page
├── assets/                # Images and static assets
└── README.md             # This file
```

## 🛠 Customization

### Adding Your Projects

Edit `js/projects-data.js` to add your own projects:

```javascript
const projects = [
  {
    title: "Your Amazing Project",
    description: "A magical description of what you built",
    tech: ["React", "Node.js", "MongoDB"],
    color: 0x90ee90,
    position: { x: -12, y: 3, z: 0 },
    shape: "sphere",
    links: [
      { text: "🌐 Live Demo", url: "https://your-demo.com" },
      { text: "💻 GitHub", url: "https://github.com/you/project" },
    ],
  },
  // ... add more projects
];
```

### Customizing Colors and Themes

Update the color palette in `css/main.css`:

```css
body {
  background: linear-gradient(
    180deg,
    #87ceeb 0%,
    /* Sky blue - change these */ #98d8e8 25%,
    /* Light blue */ #f0e68c 75%,
    /* Pale yellow */ #ffb6c1 100% /* Light pink */
  );
}
```

### Adding New Page Sections

Follow the existing pattern in the about/contact pages:

1. Add HTML structure with appropriate classes
2. Include magical elements like floating leaves
3. Use the established color scheme and animations

### Modifying 3D Elements

Customize the floating islands in `js/scene-setup.js`:

- Change island shapes: `sphere`, `crystal`, `octahedron`, `dodecahedron`
- Adjust positions: `{ x, y, z }` coordinates
- Modify colors: Hex color values
- Add new shapes: Extend the geometry creation logic

## 🎮 Interactive Features

### Navigation Controls

- **Mouse Movement**: Gentle camera following
- **Click Islands**: Focus on specific projects
- **Scroll Wheel**: Zoom in/out
- **Touch Gestures**: Mobile-friendly interactions

### Magical Effects

- **Hover Sparkles**: Projects glow when hovered
- **Click Bursts**: Magical particle explosions
- **Ambient Particles**: Floating elements around islands
- **Page Transitions**: Smooth, animated navigation

## 🎨 Design Philosophy

This portfolio embodies the wonder and magic of Studio Ghibli films:

- **Gentle Motion**: Nothing moves harshly or suddenly
- **Warm Colors**: Soft, inviting color palette
- **Natural Elements**: Clouds, sparkles, and organic shapes
- **Peaceful Atmosphere**: Calming and welcoming experience
- **Attention to Detail**: Every interaction feels special

## 📱 Mobile Experience

The portfolio is fully optimized for mobile devices:

- Touch-friendly navigation
- Responsive layouts
- Performance optimizations
- Simplified interactions for smaller screens

## 🔧 Technical Details

### Built With

- **Three.js**: 3D graphics and animations
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling and animations
- **HTML5**: Semantic structure

### Performance Features

- **Automatic Quality Adjustment**: Reduces quality on slower devices
- **Efficient Particle Systems**: Optimized for smooth animations
- **Lazy Loading**: Resources loaded as needed
- **Memory Management**: Cleanup of unused objects

### Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 🌟 Inspiration

This portfolio draws inspiration from:

- **Studio Ghibli Films**: Especially "Castle in the Sky" and "Spirited Away"
- **Japanese Aesthetics**: Gentle, nature-inspired design
- **Interactive Art**: Playful, exploratory experiences
- **Modern Web Tech**: Pushing the boundaries of web experiences

## 💡 Tips for Best Experience

1. **Use a Mouse**: While touch works, mouse interactions are more magical
2. **Good Internet**: Loads Three.js library from CDN
3. **Modern Browser**: Best performance on recent browser versions
4. **Take Your Time**: Explore slowly and enjoy the magical details

## 🚀 Deployment

To deploy your portfolio:

1. **Static Hosting**: Upload files to any static host (Netlify, Vercel, GitHub Pages)
2. **No Build Process**: Works directly without compilation
3. **CDN Dependencies**: Uses Three.js from CDN for easy deployment

## 🤝 Contributing

Want to add more magic? Feel free to:

- Suggest new magical effects
- Improve mobile experience
- Add accessibility features
- Create new island shapes
- Enhance animations

## 📄 License

Feel free to use this as inspiration for your own magical portfolio! No restrictions - create something wonderful.

---

**Made with 💖 and a sprinkle of magic**

_May your portfolio float among the clouds and inspire wonder in all who visit_ ✨
