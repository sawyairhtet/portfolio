// Project data showcasing photography and software engineering
const projects = [
  {
    title: "Portfolio Management System",
    description:
      "Full-stack web application for photographers to manage clients, galleries, and bookings. Features automated watermarking, client proofing workflows, and integrated payment processing.",
    tech: ["React", "Node.js", "PostgreSQL", "AWS S3", "Stripe API"],
    color: 0xff9800,
    position: { x: -12, y: 3, z: 0 },
    shape: "sphere",
    links: [
      { text: "Live Demo", url: "#" },
      { text: "GitHub", url: "#" },
      { text: "Case Study", url: "#" },
    ],
  },
  {
    title: "Mobile Photo Editor",
    description:
      "Native mobile application with advanced photo editing capabilities. Implements custom algorithms for exposure correction, color grading, and film emulation filters.",
    tech: ["React Native", "OpenCV", "Firebase", "TypeScript"],
    color: 0x607d8b,
    position: { x: 12, y: -2, z: -3 },
    shape: "octahedron",
    links: [
      { text: "App Store", url: "#" },
      { text: "GitHub", url: "#" },
      { text: "Technical Blog", url: "#" },
    ],
  },
  {
    title: "Photography Series: Urban Code",
    description:
      "Visual exploration of architecture as code - capturing geometric patterns, reflections, and shadows in urban environments. Shot with Fujifilm X-T4 and edited with custom Python scripts.",
    tech: ["Photography", "Python", "Adobe Lightroom", "Color Science"],
    color: 0x455a64,
    position: { x: 0, y: 8, z: -8 },
    shape: "crystal",
    links: [
      { text: "View Gallery", url: "#" },
      { text: "Behind the Scenes", url: "#" },
    ],
  },
  {
    title: "Real-time Image Processing API",
    description:
      "High-performance REST API for real-time image manipulation and analysis. Supports batch processing, format conversion, and AI-powered auto-enhancement for photography workflows.",
    tech: ["Python", "FastAPI", "OpenCV", "TensorFlow", "Docker"],
    color: 0x37474f,
    position: { x: -6, y: -8, z: 5 },
    shape: "dodecahedron",
    links: [
      { text: "API Documentation", url: "#" },
      { text: "GitHub", url: "#" },
      { text: "Performance Metrics", url: "#" },
    ],
  },
];

// Additional project categories
const additionalProjects = {
  webDevelopment: [
    {
      title: "Photography Agency Website",
      description:
        "Responsive website for a photography agency featuring immersive galleries, client testimonials, and booking system.",
      tech: ["Next.js", "Tailwind CSS", "Sanity CMS", "Framer Motion"],
      image: "assets/images/agency-site.jpg",
    },
    {
      title: "Event Photography Dashboard",
      description:
        "Real-time dashboard for event photographers to upload, organize, and share photos during live events.",
      tech: ["Vue.js", "Express.js", "Socket.io", "Cloudinary"],
      image: "assets/images/event-dashboard.jpg",
    },
  ],
  mobileApps: [
    {
      title: "Exposure Calculator",
      description:
        "Mobile app for calculating exposure settings, depth of field, and hyperfocal distance for photographers.",
      tech: ["Flutter", "Dart", "SQLite", "Camera2 API"],
      image: "assets/images/exposure-calc.jpg",
    },
    {
      title: "Photo Location Scout",
      description:
        "GPS-based app for discovering and sharing photography locations with community ratings and weather data.",
      tech: ["React Native", "MapBox", "Firebase", "Weather API"],
      image: "assets/images/location-scout.jpg",
    },
  ],
  photography: [
    {
      title: "Street Photography: Digital Nomads",
      description:
        "Documentary series capturing the intersection of technology and travel in urban environments.",
      tech: ["Fujifilm X-T4", "35mm f/1.4", "Capture One", "Photoshop"],
      image: "assets/images/street-series.jpg",
    },
    {
      title: "Corporate Headshots",
      description:
        "Professional headshot photography for tech companies and startups, emphasizing clean and modern aesthetic.",
      tech: ["Canon R5", "85mm f/1.2", "Profoto Lighting", "Lightroom"],
      image: "assets/images/headshots.jpg",
    },
    {
      title: "Architecture: Code in Concrete",
      description:
        "Architectural photography exploring patterns, geometry, and the relationship between digital and physical structures.",
      tech: ["Sony A7R IV", "16-35mm f/2.8", "Tilt-shift", "Photoshop"],
      image: "assets/images/architecture.jpg",
    },
  ],
  creativeCode: [
    {
      title: "Generative Art with Photography",
      description:
        "Algorithmic art pieces combining computational creativity with photographic elements and data visualization.",
      tech: ["Processing", "p5.js", "Machine Learning", "Creative Coding"],
      image: "assets/images/generative-art.jpg",
    },
    {
      title: "Interactive Photo Installations",
      description:
        "Motion-sensor driven photography displays that respond to viewer presence and movement.",
      tech: ["Arduino", "Kinect", "MAX/MSP", "Projection Mapping"],
      image: "assets/images/installations.jpg",
    },
  ],
};

// Skills and technologies
const skills = {
  frontend: [
    "React",
    "Next.js",
    "Vue.js",
    "TypeScript",
    "Tailwind CSS",
    "Three.js",
    "Framer Motion",
  ],
  backend: [
    "Node.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AWS",
  ],
  mobile: ["React Native", "Flutter", "iOS Development", "Android Development"],
  photography: [
    "Fujifilm X-System",
    "Canon R Series",
    "Adobe Lightroom",
    "Capture One",
    "Color Science",
    "Studio Lighting",
  ],
  creative: [
    "Processing",
    "p5.js",
    "OpenCV",
    "Adobe Creative Suite",
    "DaVinci Resolve",
    "After Effects",
  ],
  tools: ["Git", "Docker", "Kubernetes", "CI/CD", "Figma", "Linear"],
};

// Photography equipment and technical specs
const equipment = {
  cameras: [
    {
      name: "Fujifilm X-T4",
      type: "Mirrorless",
      features: ["26.1MP X-Trans", "IBIS", "4K Video"],
    },
    {
      name: "Canon EOS R5",
      type: "Full Frame Mirrorless",
      features: ["45MP", "8K Video", "Dual Pixel AF"],
    },
  ],
  lenses: [
    {
      name: "XF 35mm f/1.4 R",
      mount: "Fujifilm X",
      specialty: "Street Photography",
    },
    {
      name: "RF 85mm f/1.2L",
      mount: "Canon RF",
      specialty: "Portraits",
    },
  ],
  software: [
    "Adobe Lightroom Classic",
    "Capture One Pro",
    "Adobe Photoshop",
    "DxO PhotoLab",
  ],
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { projects, additionalProjects, skills, equipment };
}
