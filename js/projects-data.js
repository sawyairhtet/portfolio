// Project data with Ghibli themes
const projects = [
  {
    title: "Enchanted E-Commerce Garden",
    description:
      "A magical marketplace where products bloom like flowers and shopping feels like wandering through a secret garden. Features intuitive navigation and delightful micro-animations.",
    tech: ["React", "Node.js", "MongoDB", "Framer Motion"],
    color: 0x90ee90,
    position: { x: -12, y: 3, z: 0 },
    shape: "sphere",
    links: [
      { text: "🌐 Live Demo", url: "#" },
      { text: "💻 GitHub", url: "#" },
    ],
  },
  {
    title: "Crystal Mobile Adventures",
    description:
      "A fitness companion app that transforms workouts into magical quests. Users collect crystal energy and unlock new abilities as they stay active.",
    tech: ["React Native", "Firebase", "Three.js", "Redux"],
    color: 0x87cefa,
    position: { x: 12, y: -2, z: -3 },
    shape: "crystal",
    links: [
      { text: "📱 App Store", url: "#" },
      { text: "🤖 Google Play", url: "#" },
      { text: "💻 GitHub", url: "#" },
    ],
  },
  {
    title: "Floating Art Gallery",
    description:
      "An immersive 3D gallery where artworks float in space like magical paintings from Howl's Moving Castle. Visitors can walk through and interact with each piece.",
    tech: ["Three.js", "WebGL", "GSAP", "Canvas API"],
    color: 0xdda0dd,
    position: { x: 0, y: 8, z: -8 },
    shape: "octahedron",
    links: [
      { text: "🎨 Explore Gallery", url: "#" },
      { text: "💻 GitHub", url: "#" },
    ],
  },
  {
    title: "Totoro Brand Studio",
    description:
      "Complete brand identity system inspired by nature and wonder. Created logos, color palettes, and brand guidelines that capture the magic of childhood imagination.",
    tech: ["Adobe CC", "Figma", "Procreate", "After Effects"],
    color: 0xffb6c1,
    position: { x: -6, y: -8, z: 5 },
    shape: "dodecahedron",
    links: [
      { text: "📖 Case Study", url: "#" },
      { text: "🎨 Behance", url: "#" },
    ],
  },
];

// Additional project categories for expansion
const additionalProjects = {
  webDevelopment: [
    {
      title: "Spirited Away Restaurant Site",
      description:
        "A restaurant website that brings the magical dining experience from Spirited Away to life.",
      tech: ["Vue.js", "Nuxt.js", "SCSS", "AOS"],
      image: "assets/images/restaurant-site.jpg",
    },
    {
      title: "Castle in the Sky Landing Page",
      description:
        "An interactive landing page with floating elements and Laputa-inspired design.",
      tech: ["HTML5", "CSS3", "JavaScript", "Three.js"],
      image: "assets/images/castle-landing.jpg",
    },
  ],
  mobileApps: [
    {
      title: "Catbus Navigation App",
      description:
        "A public transportation app with whimsical animations and route optimization.",
      tech: ["Flutter", "Dart", "Google Maps API", "Firebase"],
      image: "assets/images/catbus-app.jpg",
    },
  ],
  design: [
    {
      title: "Kodama Logo Collection",
      description:
        "A series of nature-inspired logos featuring forest spirits and organic shapes.",
      tech: ["Illustrator", "Photoshop", "Figma"],
      image: "assets/images/kodama-logos.jpg",
    },
  ],
};

// Skills and technologies
const skills = {
  frontend: [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React",
    "Vue.js",
    "Three.js",
    "GSAP",
  ],
  backend: [
    "Node.js",
    "Python",
    "MongoDB",
    "PostgreSQL",
    "Firebase",
    "Express",
  ],
  mobile: ["React Native", "Flutter", "Ionic"],
  design: [
    "Adobe Creative Suite",
    "Figma",
    "Sketch",
    "Procreate",
    "After Effects",
  ],
  tools: ["Git", "Webpack", "Vite", "Docker", "AWS", "Vercel"],
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { projects, additionalProjects, skills };
}
