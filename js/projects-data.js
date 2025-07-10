// Clean project data for the redesigned portfolio
const projects = [
  {
    title: "Portfolio Management System",
    description:
      "Full-stack web application for photographers to manage clients, galleries, and bookings. Features automated watermarking, client proofing workflows, and integrated payment processing.",
    tech: ["React", "Node.js", "PostgreSQL", "AWS S3", "Stripe API"],
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
    links: [
      { text: "API Documentation", url: "#" },
      { text: "GitHub", url: "#" },
      { text: "Performance Metrics", url: "#" },
    ],
  },
];

// Additional project categories for expanded content
const projectCategories = {
  webDevelopment: [
    {
      title: "Photography Agency Website",
      description:
        "Responsive website for a photography agency featuring immersive galleries, client testimonials, and booking system.",
      tech: ["Next.js", "Tailwind CSS", "Sanity CMS", "Framer Motion"],
      links: [
        { text: "View Site", url: "#" },
        { text: "GitHub", url: "#" },
      ],
    },
    {
      title: "Event Photography Dashboard",
      description:
        "Real-time dashboard for event photographers to upload, organize, and share photos during live events.",
      tech: ["Vue.js", "Express.js", "Socket.io", "Cloudinary"],
      links: [
        { text: "Live Demo", url: "#" },
        { text: "GitHub", url: "#" },
      ],
    },
  ],

  mobileApps: [
    {
      title: "Exposure Calculator",
      description:
        "Mobile app for calculating exposure settings, depth of field, and hyperfocal distance for photographers.",
      tech: ["Flutter", "Dart", "SQLite", "Camera2 API"],
      links: [
        { text: "Play Store", url: "#" },
        { text: "App Store", url: "#" },
      ],
    },
    {
      title: "Photo Location Scout",
      description:
        "GPS-based app for discovering and sharing photography locations with community ratings and weather data.",
      tech: ["React Native", "MapBox", "Firebase", "Weather API"],
      links: [
        { text: "Download", url: "#" },
        { text: "GitHub", url: "#" },
      ],
    },
  ],

  photography: [
    {
      title: "Street Photography: Digital Nomads",
      description:
        "Documentary series capturing the intersection of technology and travel in urban environments.",
      tech: ["Fujifilm X-T4", "35mm f/1.4", "Capture One", "Photoshop"],
      links: [
        { text: "View Series", url: "#" },
        { text: "Print Sales", url: "#" },
      ],
    },
    {
      title: "Corporate Headshots",
      description:
        "Professional headshot photography for tech companies and startups, emphasizing clean and modern aesthetic.",
      tech: ["Canon R5", "85mm f/1.2", "Profoto Lighting", "Lightroom"],
      links: [
        { text: "Portfolio", url: "#" },
        { text: "Book Session", url: "#" },
      ],
    },
    {
      title: "Architecture: Code in Concrete",
      description:
        "Architectural photography exploring patterns, geometry, and the relationship between digital and physical structures.",
      tech: ["Sony A7R IV", "16-35mm f/2.8", "Tilt-shift", "Photoshop"],
      links: [
        { text: "Gallery", url: "#" },
        { text: "Exhibition Info", url: "#" },
      ],
    },
  ],

  creativeCode: [
    {
      title: "Generative Art with Photography",
      description:
        "Algorithmic art pieces combining computational creativity with photographic elements and data visualization.",
      tech: ["Processing", "p5.js", "Machine Learning", "Creative Coding"],
      links: [
        { text: "Interactive Demo", url: "#" },
        { text: "Source Code", url: "#" },
      ],
    },
    {
      title: "Interactive Photo Installations",
      description:
        "Motion-sensor driven photography displays that respond to viewer presence and movement.",
      tech: ["Arduino", "Kinect", "MAX/MSP", "Projection Mapping"],
      links: [
        { text: "Installation Video", url: "#" },
        { text: "Technical Details", url: "#" },
      ],
    },
  ],
};

// Professional timeline data
const timeline = [
  {
    year: "2024",
    title: "Freelance Developer & Photographer",
    description:
      "Building custom web applications and shooting commercial photography projects.",
    type: "work",
  },
  {
    year: "2023",
    title: "Senior Frontend Developer",
    description:
      "Led development of React applications and mentored junior developers.",
    type: "work",
  },
  {
    year: "2022",
    title: "Photography Exhibition",
    description:
      "First solo exhibition 'Digital Landscapes' showcasing urban photography.",
    type: "achievement",
  },
  {
    year: "2021",
    title: "Full Stack Developer",
    description:
      "Built e-commerce platforms and learned the art of digital photography.",
    type: "work",
  },
  {
    year: "2020",
    title: "Started Photography",
    description:
      "Picked up my first camera and fell in love with visual storytelling.",
    type: "milestone",
  },
  {
    year: "2019",
    title: "Computer Science Degree",
    description:
      "Graduated with honors, specializing in web technologies and algorithms.",
    type: "education",
  },
];

// Things I love - personal interests and inspirations
const thingsILove = [
  {
    title: "The Art of Code",
    description: "Clean, readable code that tells a story",
  },
  {
    title: "Golden Hour Photography",
    description: "That magical light just before sunset",
  },
  {
    title: "React Hooks",
    description: "The moment functional components clicked",
  },
  {
    title: "Street Photography",
    description: "Capturing unguarded moments in urban life",
  },
  {
    title: "Open Source",
    description: "The collaborative spirit of building together",
  },
  {
    title: "Film Photography",
    description: "The intentionality of shooting on film",
  },
  {
    title: "VS Code",
    description: "My daily companion for crafting code",
  },
  {
    title: "Coffee Shops",
    description: "Perfect for coding sessions and photo editing",
  },
  {
    title: "Minimal Design",
    description: "Less is more, in both code and composition",
  },
  {
    title: "Analog Cameras",
    description: "The satisfying click of a mechanical shutter",
  },
  {
    title: "TypeScript",
    description: "JavaScript that scales with confidence",
  },
  {
    title: "Black and White Photography",
    description: "Stripping away color to reveal emotion",
  },
  {
    title: "Clean Architecture",
    description: "Code that future-me will thank present-me for",
  },
  {
    title: "Documentary Photography",
    description: "Real stories, real people, real moments",
  },
  {
    title: "Git Commits",
    description: "Small, atomic changes that tell a story",
  },
];

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
    "HTML5",
    "CSS3",
    "JavaScript",
  ],
  backend: [
    "Node.js",
    "Python",
    "FastAPI",
    "Express.js",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AWS",
    "Firebase",
    "REST APIs",
  ],
  mobile: ["React Native", "Flutter", "iOS Development", "Android Development"],
  photography: [
    "Fujifilm X-System",
    "Canon R Series",
    "Adobe Lightroom",
    "Capture One",
    "Color Science",
    "Studio Lighting",
    "Film Photography",
  ],
  creative: [
    "Processing",
    "p5.js",
    "OpenCV",
    "Adobe Creative Suite",
    "DaVinci Resolve",
    "After Effects",
    "Generative Art",
  ],
  tools: [
    "Git",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Figma",
    "Linear",
    "Notion",
    "Slack",
    "VS Code",
  ],
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    projects,
    projectCategories,
    timeline,
    thingsILove,
    skills,
  };
}
