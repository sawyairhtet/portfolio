// Global variables
let scene, camera, renderer, controls;
let mainObject, particles, starField, orbitingObjects, constellationLines;
let currentSection = "about";
let isLoading = true;
let cameraAnimationId = null;
let animationMixer;

// Post-processing variables
let composer, bloomPass, filmPass, renderPass;
let effectFXAA;

// Responsive and loading variables
let loadingProgress = 0;
let totalAssets = 10; // Estimated number of assets to load
let loadedAssets = 0;
let isMobile = false;
let devicePixelRatio = 1;

// Interactive features
let raycaster, mouse;
let hoveredObject = null;
let selectedProject = null;
let isProjectShowcaseMode = false;
let originalCameraPosition = null;
let originalControlsTarget = null;

// Enhanced lighting variables
let ambientLight,
  directionalLight,
  rimLights = [];
let pointLights = [];

// Content integration variables
let projectThumbnails = [];
let skillOrbitingElements = [];
let statsAnimated = false;
let contactFormFeedback = null;
let skillVisualizationActive = false;

// Stats animation configuration
const statsConfig = {
  graduateYear: { target: 2025, current: 2020, duration: 2000 },
  projects: { target: 15, current: 0, duration: 1500 },
  skills: { target: 12, current: 0, duration: 1800 },
};

// Project data for interactive showcase
const projectData = {
  0: {
    title: "AutoVid - AI Video Generator",
    description:
      "Developed an AI application as a group project with Mendix low code platform for auto video generation based on user prompts. Features intelligent content creation and automated video production.",
    technologies: ["Mendix", "AI/ML", "Low-Code", "Video Generation"],
    category: "AI Project",
  },
  1: {
    title: "Interactive 3D Portfolio",
    description:
      "Modern portfolio website built with Three.js featuring immersive 3D graphics, smooth animations, and responsive design. Showcases technical skills through interactive web experiences.",
    technologies: ["Three.js", "WebGL", "JavaScript", "Responsive Design"],
    category: "Web Development",
  },
  2: {
    title: "Database Management System",
    description:
      "Comprehensive database solution with optimized queries and data visualization. Implemented efficient data structures and user-friendly interfaces.",
    technologies: ["SQL", "Database Design", "Data Visualization"],
    category: "Backend",
  },
  3: {
    title: "Responsive Web Design",
    description:
      "Modern, mobile-first web applications with clean UI/UX design. Focus on accessibility and cross-platform compatibility.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    category: "Frontend",
  },
};

// Skill categories for floating objects
const skillCategories = {
  4: {
    name: "Problem Solving",
    color: 0x4f46e5,
    description: "Analytical thinking and creative solutions",
  },
  5: {
    name: "Graphic Design",
    color: 0x10b981,
    description: "Visual design and creative aesthetics",
  },
  6: {
    name: "AI Development",
    color: 0xf59e0b,
    description: "Machine learning and AI applications",
  },
  7: {
    name: "Web Technologies",
    color: 0xef4444,
    description: "Modern web development stack",
  },
  8: {
    name: "Database Systems",
    color: 0x8b5cf6,
    description: "Data management and optimization",
  },
  9: {
    name: "Low-Code Platforms",
    color: 0x06b6d4,
    description: "Rapid application development",
  },
  10: {
    name: "Version Control",
    color: 0xf97316,
    description: "Git and collaborative development",
  },
  11: {
    name: "UI/UX Design",
    color: 0xec4899,
    description: "User experience and interface design",
  },
};

// Check device capabilities and set responsive parameters
function initResponsiveSettings() {
  // Detect mobile devices
  isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

  // Set device pixel ratio with performance considerations
  devicePixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

  // Adjust total assets based on device capabilities
  if (isMobile) {
    totalAssets = 6; // Fewer assets for mobile
  }

  console.log(
    `Device: ${
      isMobile ? "Mobile" : "Desktop"
    }, Pixel Ratio: ${devicePixelRatio}`
  );
}

// Enhanced loading progress tracking
function updateLoadingProgress(increment = 1) {
  loadedAssets += increment;
  loadingProgress = Math.min((loadedAssets / totalAssets) * 100, 100);

  const progressBar = document.querySelector(".progress-bar");
  const progressText = document.querySelector(".progress-text");
  const progressPercentage = document.querySelector(".progress-percentage");

  if (progressBar) {
    progressBar.style.width = `${loadingProgress}%`;
  }

  if (progressPercentage) {
    progressPercentage.textContent = `${Math.round(loadingProgress)}%`;
  }

  if (progressText) {
    const loadingMessages = [
      "Initializing 3D engine...",
      "Loading geometries...",
      "Setting up lighting...",
      "Creating particle systems...",
      "Configuring post-processing...",
      "Optimizing for your device...",
      "Preparing interactive elements...",
      "Finalizing scene...",
      "Almost ready...",
      "Welcome to the experience!",
    ];

    const messageIndex = Math.min(
      Math.floor((loadingProgress / 100) * loadingMessages.length),
      loadingMessages.length - 1
    );
    progressText.textContent = loadingMessages[messageIndex];
  }

  console.log(`Loading progress: ${Math.round(loadingProgress)}%`);
}

// Check if Three.js is loaded
function checkThreeJS() {
  if (typeof THREE === "undefined") {
    console.error(
      "Three.js failed to load. Please check your internet connection."
    );
    document.getElementById("loading-screen").innerHTML = `
      <div class="loader">
        <div style="color: #ef4444; text-align: center;">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Failed to load 3D graphics library.</p>
          <p>Please check your internet connection and refresh the page.</p>
        </div>
      </div>
    `;
    return false;
  }
  return true;
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Initialize responsive settings first
  initResponsiveSettings();

  // Check if Three.js loaded successfully
  if (!checkThreeJS()) {
    return;
  }

  try {
    updateLoadingProgress(); // Initial progress
    initThreeJS();
    initEventListeners();
    initInteractiveFeatures();
    startLoadingSequence();
  } catch (error) {
    console.error("Error initializing portfolio:", error);
    document.getElementById("loading-screen").innerHTML = `
      <div class="loader">
        <div style="color: #ef4444; text-align: center;">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Error loading portfolio.</p>
          <p>Please refresh the page to try again.</p>
        </div>
      </div>
    `;
  }
});

// Initialize Three.js scene with enhanced settings
function initThreeJS() {
  // Scene setup
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x111827, isMobile ? 15 : 20, isMobile ? 80 : 100);
  updateLoadingProgress();

  // Camera setup with responsive FOV
  const fov = isMobile ? 85 : 75;
  camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, isMobile ? 15 : 12);
  updateLoadingProgress();

  // Enhanced renderer setup
  const canvas = document.getElementById("three-canvas");
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: !isMobile, // Disable antialiasing on mobile for performance
    alpha: true,
    powerPreference: isMobile ? "low-power" : "high-performance",
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.shadowMap.enabled = !isMobile; // Disable shadows on mobile
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  updateLoadingProgress();

  // Controls setup with responsive settings
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = isMobile ? 0.08 : 0.05;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.maxDistance = isMobile ? 30 : 25;
  controls.minDistance = isMobile ? 10 : 8;
  controls.maxPolarAngle = Math.PI / 1.3;
  controls.minPolarAngle = Math.PI / 4;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;

  // Initialize post-processing
  initPostProcessing();
  updateLoadingProgress();

  // Create all 3D elements
  createMainObject();
  updateLoadingProgress();

  createEnhancedParticleSystem();
  updateLoadingProgress();

  createStarField();
  updateLoadingProgress();

  createOrbitingObjects();
  updateLoadingProgress();

  createConstellationLines();
  setupRealisticLighting();
  updateLoadingProgress();

  // Create content integration elements
  createProjectThumbnails();
  createSkillVisualization();
  createContactFormFeedback();
  updateLoadingProgress();

  // Start render loop
  animate();
  updateLoadingProgress();

  // Debug the scene state after initialization
  setTimeout(() => {
    debugSceneState();
  }, 500);
}

// Initialize post-processing effects
function initPostProcessing() {
  // Only enable post-processing on desktop for performance
  if (isMobile) {
    console.log("Post-processing disabled on mobile for performance");
    return;
  }

  // Import post-processing passes
  const EffectComposer = THREE.EffectComposer;
  const RenderPass = THREE.RenderPass;
  const UnrealBloomPass = THREE.UnrealBloomPass;
  const FilmPass = THREE.FilmPass;
  const ShaderPass = THREE.ShaderPass;
  const FXAAShader = THREE.FXAAShader;

  // Check if post-processing classes are available
  if (!EffectComposer || !RenderPass || !UnrealBloomPass) {
    console.warn(
      "Post-processing effects not available, continuing without them"
    );
    return;
  }

  try {
    // Create composer
    composer = new EffectComposer(renderer);

    // Render pass
    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom pass for glowing effects
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);

    // Film grain pass for cinematic look
    if (FilmPass) {
      filmPass = new FilmPass(
        0.15, // noise intensity
        0.025, // scanline intensity
        648, // scanline count
        false // grayscale
      );
      composer.addPass(filmPass);
    }

    // FXAA anti-aliasing pass
    if (FXAAShader && ShaderPass) {
      effectFXAA = new ShaderPass(FXAAShader);
      effectFXAA.uniforms["resolution"].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
      composer.addPass(effectFXAA);
    }

    console.log("Post-processing initialized successfully");
  } catch (error) {
    console.warn("Failed to initialize post-processing:", error);
    composer = null;
  }
}

// Setup realistic lighting system
function setupRealisticLighting() {
  // Clear existing lights
  scene.children
    .filter((child) => child.isLight)
    .forEach((light) => {
      scene.remove(light);
    });

  // Enhanced ambient lighting
  ambientLight = new THREE.AmbientLight(0x404040, isMobile ? 0.6 : 0.4);
  scene.add(ambientLight);

  // Main directional light (key light)
  directionalLight = new THREE.DirectionalLight(0xffffff, isMobile ? 1.2 : 1.5);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = !isMobile;

  if (!isMobile) {
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.bias = -0.0001;
  }
  scene.add(directionalLight);

  // Rim lighting for depth and professional look
  const rimLight1 = new THREE.DirectionalLight(0x88ccff, 0.8);
  rimLight1.position.set(-10, -8, 10);
  scene.add(rimLight1);
  rimLights.push(rimLight1);

  const rimLight2 = new THREE.DirectionalLight(0xff8888, 0.6);
  rimLight2.position.set(10, 8, -10);
  scene.add(rimLight2);
  rimLights.push(rimLight2);

  // Additional rim light for the main sphere
  const sphereRimLight = new THREE.DirectionalLight(0xffffff, 0.4);
  sphereRimLight.position.set(0, 0, -15);
  scene.add(sphereRimLight);
  rimLights.push(sphereRimLight);

  // Colored point lights for atmosphere (reduced on mobile)
  const pointLightConfigs = [
    {
      color: 0x4f46e5,
      intensity: isMobile ? 0.8 : 1,
      distance: 20,
      position: [-8, 5, -8],
    },
    {
      color: 0x10b981,
      intensity: isMobile ? 0.6 : 0.8,
      distance: 15,
      position: [8, -5, 8],
    },
    {
      color: 0xf59e0b,
      intensity: isMobile ? 0.9 : 1.2,
      distance: 25,
      position: [0, 12, -12],
    },
  ];

  pointLightConfigs.forEach((config) => {
    const pointLight = new THREE.PointLight(
      config.color,
      config.intensity,
      config.distance
    );
    pointLight.position.set(...config.position);
    scene.add(pointLight);
    pointLights.push(pointLight);
  });

  // Hemisphere light for natural ambient lighting
  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x1e3a8a, 0.3);
  scene.add(hemisphereLight);

  console.log("Realistic lighting system initialized");
}

// Create the main 3D object with enhanced materials and responsive scaling
function createMainObject() {
  const group = new THREE.Group();
  const scale = isMobile ? 0.8 : 1; // Scale down on mobile

  // Central geometric shape with enhanced materials
  const geometry = new THREE.IcosahedronGeometry(2.5 * scale, 2);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x4f46e5,
    metalness: 0.8,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: false, // Make it non-transparent to ensure visibility
    opacity: 1.0, // Full opacity
    emissive: 0x1a1a3a,
    emissiveIntensity: 0.5, // Increased emissive intensity
    envMapIntensity: 1.0,
  });

  const centralMesh = new THREE.Mesh(geometry, material);
  centralMesh.castShadow = !isMobile;
  centralMesh.receiveShadow = !isMobile;
  centralMesh.userData = {
    type: "central",
    originalScale: scale,
    originalOpacity: 1.0,
  };

  // Ensure the central mesh is visible
  centralMesh.visible = true;
  centralMesh.scale.setScalar(scale);

  console.log("Central mesh created:", centralMesh);
  console.log("Central mesh scale:", centralMesh.scale);
  console.log("Central mesh material:", centralMesh.material);

  group.add(centralMesh);

  // Enhanced section indicators with better materials
  const sections = ["about", "skills", "projects", "contact"];
  const colors = [0x4f46e5, 0x10b981, 0xf59e0b, 0xef4444];
  const geometries = [
    new THREE.OctahedronGeometry(0.4 * scale),
    new THREE.TetrahedronGeometry(0.5 * scale),
    new THREE.DodecahedronGeometry(0.4 * scale),
    new THREE.IcosahedronGeometry(0.4 * scale),
  ];

  sections.forEach((section, index) => {
    const angle = (index / sections.length) * Math.PI * 2;
    const radius = 6 * scale;

    const sectionMaterial = new THREE.MeshPhysicalMaterial({
      color: colors[index],
      metalness: 0.7,
      roughness: 0.2,
      emissive: colors[index],
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.9,
    });

    const sectionMesh = new THREE.Mesh(geometries[index], sectionMaterial);
    sectionMesh.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 0.7) * 2 * scale,
      Math.sin(angle) * radius
    );
    sectionMesh.userData = {
      section: section,
      originalPosition: sectionMesh.position.clone(),
      originalOpacity: 0.9,
      orbitSpeed: 0.3 + index * 0.1,
      rotationSpeed: {
        x: 0.01 + index * 0.005,
        y: 0.015 + index * 0.003,
        z: 0.008 + index * 0.002,
      },
    };
    sectionMesh.castShadow = !isMobile;
    group.add(sectionMesh);

    // Enhanced connecting lines with gradient effect
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      sectionMesh.position,
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: colors[index],
      transparent: true,
      opacity: 0.6,
      linewidth: 2,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.userData = { type: "connectionLine", targetMesh: sectionMesh };
    group.add(line);
  });

  // Enhanced floating rings with different materials (fewer on mobile)
  const ringCount = isMobile ? 2 : 4;
  for (let i = 0; i < ringCount; i++) {
    const ringGeometry = new THREE.RingGeometry(
      (4 + i * 0.8) * scale,
      (4.3 + i * 0.8) * scale,
      isMobile ? 32 : 64
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      color: i % 2 === 0 ? 0x4f46e5 : 0x10b981,
      opacity: 0.15 - i * 0.02,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2 + i * 0.1;
    ring.position.y = (i - 1.5) * 0.3 * scale;
    ring.userData = {
      type: "ring",
      rotationSpeed: 0.005 * (i + 1) * (i % 2 === 0 ? 1 : -1),
      originalY: ring.position.y,
    };
    group.add(ring);
  }

  mainObject = group;
  scene.add(mainObject);

  // Fallback: Ensure there's always a visible central sphere
  setTimeout(() => {
    const centralMesh = mainObject.children.find(
      (child) => child.userData && child.userData.type === "central"
    );

    if (!centralMesh || !centralMesh.visible || centralMesh.scale.x < 0.1) {
      console.log("Creating fallback central sphere");

      // Create a simple fallback sphere
      const fallbackGeometry = new THREE.SphereGeometry(2, 32, 32);
      const fallbackMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f46e5,
        transparent: false,
        opacity: 1.0,
      });

      const fallbackSphere = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
      fallbackSphere.userData = {
        type: "central",
        originalScale: 1,
        originalOpacity: 1.0,
      };
      fallbackSphere.visible = true;
      fallbackSphere.scale.setScalar(1);

      // Remove any existing central mesh
      if (centralMesh) {
        mainObject.remove(centralMesh);
      }

      mainObject.add(fallbackSphere);
      console.log("Fallback central sphere created and added");
    }
  }, 100);
}

// Create enhanced particle system with multiple layers
function createEnhancedParticleSystem() {
  const particleGroup = new THREE.Group();

  // Main particle cloud
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    // Create spherical distribution with some clustering
    const radius = Math.random() * 30 + 15;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    // Varied particle colors
    const color = new THREE.Color();
    const hue = Math.random() * 0.3 + 0.6; // Blue to purple range
    color.setHSL(hue, 0.8, 0.6 + Math.random() * 0.4);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 3 + 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  particles = new THREE.Points(geometry, material);
  particles.userData = { type: "mainParticles" };
  particleGroup.add(particles);

  // Add floating dust particles
  createFloatingDust(particleGroup);

  scene.add(particleGroup);
}

// Create floating dust particles for atmosphere
function createFloatingDust(parentGroup) {
  const dustCount = 500;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);

  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 50;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;

    const color = new THREE.Color(0xffffff);
    dustColors[i * 3] = color.r;
    dustColors[i * 3 + 1] = color.g;
    dustColors[i * 3 + 2] = color.b;
  }

  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(dustPositions, 3)
  );
  dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

  const dustMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
  });

  const dust = new THREE.Points(dustGeometry, dustMaterial);
  dust.userData = { type: "dust" };
  parentGroup.add(dust);
}

// Create background star field
function createStarField() {
  const starCount = 1000;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    // Place stars far away
    const radius = Math.random() * 200 + 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);

    // Star colors - mostly white with some blue/yellow tints
    const color = new THREE.Color();
    const temp = Math.random();
    if (temp < 0.7) {
      color.setRGB(1, 1, 1); // White
    } else if (temp < 0.85) {
      color.setRGB(0.8, 0.9, 1); // Blue
    } else {
      color.setRGB(1, 1, 0.8); // Yellow
    }

    starColors[i * 3] = color.r;
    starColors[i * 3 + 1] = color.g;
    starColors[i * 3 + 2] = color.b;
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );
  starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
}

// Create orbiting geometric objects
function createOrbitingObjects() {
  orbitingObjects = new THREE.Group();

  const objectCount = 12;
  const geometries = [
    new THREE.TetrahedronGeometry(0.3),
    new THREE.OctahedronGeometry(0.25),
    new THREE.DodecahedronGeometry(0.2),
    new THREE.IcosahedronGeometry(0.3),
  ];

  for (let i = 0; i < objectCount; i++) {
    const geometry = geometries[i % geometries.length];

    // Enhanced material with better interactivity
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL((i / objectCount) * 0.3 + 0.6, 0.7, 0.6),
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
      emissive: new THREE.Color().setHSL(
        (i / objectCount) * 0.3 + 0.6,
        0.5,
        0.2
      ),
      emissiveIntensity: 0.3,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Set orbital parameters
    const orbitRadius = 10 + Math.random() * 8;
    const orbitSpeed = 0.5 + Math.random() * 0.8;
    const orbitInclination = (Math.random() - 0.5) * Math.PI * 0.5;
    const orbitPhase = Math.random() * Math.PI * 2;

    // Calculate initial position
    const angle = orbitPhase;
    const initialX = Math.cos(angle) * orbitRadius;
    const initialY = Math.sin(angle + orbitInclination) * orbitRadius * 0.3;
    const initialZ = Math.sin(angle) * orbitRadius;

    mesh.position.set(initialX, initialY, initialZ);

    mesh.userData = {
      orbitRadius: orbitRadius,
      orbitSpeed: orbitSpeed * 0.01,
      orbitInclination: orbitInclination,
      orbitPhase: orbitPhase,
      originalPosition: mesh.position.clone(),
      originalScale: mesh.scale.clone(),
      originalOpacity: material.opacity,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      },
      isHovered: false,
    };

    mesh.castShadow = true;
    orbitingObjects.add(mesh);
  }

  scene.add(orbitingObjects);
}

// Create constellation-like connections
function createConstellationLines() {
  constellationLines = new THREE.Group();

  // We'll update these dynamically in the animation loop
  scene.add(constellationLines);
}

// Update constellation connections dynamically
function updateConstellationLines() {
  // Clear existing lines
  while (constellationLines.children.length > 0) {
    constellationLines.remove(constellationLines.children[0]);
  }

  const objects = orbitingObjects.children;
  const maxDistance = 8;

  // Create connections between nearby objects
  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      const distance = objects[i].position.distanceTo(objects[j].position);

      if (distance < maxDistance) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          objects[i].position,
          objects[j].position,
        ]);

        const opacity = 1 - distance / maxDistance;
        const material = new THREE.LineBasicMaterial({
          color: 0x4f46e5,
          transparent: true,
          opacity: opacity * 0.3,
        });

        const line = new THREE.Line(geometry, material);
        constellationLines.add(line);
      }
    }
  }
}

// Enhanced animation loop with post-processing
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Safeguard: Ensure main object is always visible after loading
  if (!isLoading && mainObject && mainObject.scale.x === 0) {
    console.log("Restoring main object scale");
    mainObject.scale.set(1, 1, 1);
  }

  // Animate main object with breathing effect
  if (mainObject) {
    mainObject.rotation.y += 0.003;
    mainObject.rotation.x = Math.sin(time * 0.2) * 0.05;

    // Enhanced central sphere pulsing
    const centralMesh = mainObject.children.find(
      (child) => child.userData.type === "central"
    );
    if (centralMesh) {
      // ULTRA AGGRESSIVE SAFEGUARD: Continuously ensure central mesh is stable
      if (!centralMesh.visible) {
        console.log("Central mesh was invisible, making it visible");
        centralMesh.visible = true;
      }

      // If protection is active, force restore every frame
      if (centralSphereProtected) {
        forceCentralSphereRestore(centralMesh);
      }

      // Ensure minimum scale - more aggressive checking
      if (centralMesh.scale.x < 0.5 || centralMesh.scale.x > 3) {
        console.log("Central mesh scale out of bounds, resetting");
        centralMesh.scale.set(1, 1, 1);
      }

      // Ensure minimum opacity - more aggressive checking
      if (centralMesh.material.opacity < 0.8) {
        console.log("Central mesh opacity too low, resetting");
        centralMesh.material.opacity = 1.0;
        centralMesh.material.transparent = false;
      }

      // ADDITIONAL SAFEGUARD: Ensure material exists and is properly configured
      if (!centralMesh.material || centralMesh.material.disposed) {
        console.log("Central mesh material missing or disposed, recreating");
        centralMesh.material = new THREE.MeshPhysicalMaterial({
          color: 0x4f46e5,
          metalness: 0.8,
          roughness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          transparent: false,
          opacity: 1.0,
          emissive: 0x1a1a3a,
          emissiveIntensity: 0.5,
          envMapIntensity: 1.0,
        });
      }

      // Ensure material color is correct - check every frame
      if (
        centralMesh.material.color &&
        centralMesh.material.color.getHex() !== 0x4f46e5 &&
        !centralMesh.userData.isHovered
      ) {
        centralMesh.material.color.setHex(0x4f46e5);
      }

      // Only apply breathing animation if not in protection mode
      if (!centralSphereProtected) {
        const breathingScale = 1 + Math.sin(time * 1.5) * 0.15;
        const pulseScale = 1 + Math.sin(time * 3) * 0.05;
        const finalScale = breathingScale * pulseScale;
        centralMesh.scale.setScalar(finalScale);

        // Color pulsing
        centralMesh.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;
      } else {
        // In protection mode, keep scale and intensity stable
        centralMesh.scale.set(1, 1, 1);
        centralMesh.material.emissiveIntensity = 0.5;
      }
    } else {
      console.log("Central mesh not found in mainObject children");
    }

    // Animate section indicators with enhanced movement
    mainObject.children.forEach((child, index) => {
      if (child.userData && child.userData.section) {
        const userData = child.userData;
        const angle = (index / 4) * Math.PI * 2 + time * userData.orbitSpeed;
        const radius =
          (6 + Math.sin(time * 0.5 + index) * 0.5) * (isMobile ? 0.8 : 1);

        child.position.x = Math.cos(angle) * radius;
        child.position.z = Math.sin(angle) * radius;
        child.position.y =
          userData.originalPosition.y + Math.sin(angle * 2 + time) * 0.8;

        // Enhanced rotation
        child.rotation.x += userData.rotationSpeed.x;
        child.rotation.y += userData.rotationSpeed.y;
        child.rotation.z += userData.rotationSpeed.z;

        // Pulsing emissive intensity
        child.material.emissiveIntensity =
          0.4 + Math.sin(time * 2 + index) * 0.2;
      }

      // Animate rings with wave motion
      if (child.userData && child.userData.type === "ring") {
        child.rotation.z += child.userData.rotationSpeed;
        child.position.y =
          child.userData.originalY + Math.sin(time * 0.8 + index) * 0.2;
        child.material.opacity = 0.15 + Math.sin(time * 1.5 + index) * 0.05;
      }

      // Update connection lines
      if (child.userData && child.userData.type === "connectionLine") {
        const targetMesh = child.userData.targetMesh;
        if (targetMesh) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            targetMesh.position,
          ]);
          child.geometry.dispose();
          child.geometry = lineGeometry;

          // Animate line opacity
          child.material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
        }
      }
    });
  }

  // Animate orbiting objects
  if (orbitingObjects) {
    orbitingObjects.children.forEach((obj, index) => {
      const userData = obj.userData;

      // Skip animation if object is in project showcase mode
      if (isProjectShowcaseMode && obj === selectedProject) {
        return;
      }

      const angle = time * userData.orbitSpeed + userData.orbitPhase;

      // Update position only if not in showcase mode
      if (!isProjectShowcaseMode) {
        obj.position.x = Math.cos(angle) * userData.orbitRadius;
        obj.position.z = Math.sin(angle) * userData.orbitRadius;
        obj.position.y =
          Math.sin(angle + userData.orbitInclination) *
          userData.orbitRadius *
          0.3;

        // Update original position for showcase mode
        userData.originalPosition = obj.position.clone();
      }

      // Individual rotation with enhanced hover effects
      if (userData.isHovered) {
        // Faster rotation when hovered
        obj.rotation.x += userData.rotationSpeed.x * 2;
        obj.rotation.y += userData.rotationSpeed.y * 2;
        obj.rotation.z += userData.rotationSpeed.z * 2;
      } else {
        obj.rotation.x += userData.rotationSpeed.x;
        obj.rotation.y += userData.rotationSpeed.y;
        obj.rotation.z += userData.rotationSpeed.z;
      }

      // Enhanced pulsing emissive with hover consideration
      const baseIntensity = userData.isHovered ? 0.6 : 0.3;
      obj.material.emissiveIntensity =
        baseIntensity + Math.sin(time * 3 + index) * 0.2;
    });

    // Update constellation lines every few frames for performance
    if (Math.floor(time * 10) % 3 === 0) {
      updateConstellationLines();
    }
  }

  // Animate particle systems with performance considerations
  if (particles) {
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;

    // Subtle particle movement (reduced frequency on mobile)
    if (!isMobile || Math.floor(time * 10) % 2 === 0) {
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.002;
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }
  }

  // Animate star field with subtle twinkling (reduced on mobile)
  if (starField) {
    starField.rotation.y += 0.0001;

    // Twinkling effect (less frequent on mobile)
    if (!isMobile || Math.floor(time * 5) % 3 === 0) {
      const starColors = starField.geometry.attributes.color.array;
      for (let i = 0; i < starColors.length; i += 3) {
        const twinkle = 0.8 + Math.sin(time * 2 + i * 0.1) * 0.2;
        starColors[i] *= twinkle;
        starColors[i + 1] *= twinkle;
        starColors[i + 2] *= twinkle;
      }
      starField.geometry.attributes.color.needsUpdate = true;
    }
  }

  // Animate lighting for dynamic atmosphere
  if (pointLights.length > 0) {
    pointLights.forEach((light, index) => {
      const baseIntensity = light.userData?.baseIntensity || light.intensity;
      light.intensity = baseIntensity + Math.sin(time * 0.5 + index) * 0.1;
    });
  }

  // Animate project thumbnails
  if (projectThumbnails.length > 0) {
    projectThumbnails.forEach((thumbnail, index) => {
      if (thumbnail.visible) {
        // Floating animation
        const floatOffset = thumbnail.userData.floatOffset;
        thumbnail.position.y =
          thumbnail.userData.originalPosition.y +
          Math.sin(time * 0.8 + floatOffset) * 0.3;

        // Gentle rotation
        thumbnail.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
        thumbnail.rotation.z = Math.cos(time * 0.3 + index) * 0.05;

        // Hover effects
        if (thumbnail.userData.isHovered) {
          thumbnail.scale.setScalar(1.1);
          thumbnail.material.emissiveIntensity = 0.4;
        } else {
          thumbnail.scale.setScalar(1.0);
          thumbnail.material.emissiveIntensity = 0.2;
        }
      }
    });
  }

  // Animate skill visualization elements
  if (skillOrbitingElements.length > 0) {
    skillOrbitingElements.forEach((skillGroup, index) => {
      if (skillGroup.userData.isVisible) {
        const userData = skillGroup.userData;
        const angle = time * userData.orbitSpeed + userData.orbitPhase;

        // Orbit around center
        const radius = userData.skill.orbitRadius || 12;
        skillGroup.position.x = Math.cos(angle) * radius;
        skillGroup.position.z = Math.sin(angle) * radius;
        skillGroup.position.y =
          userData.originalPosition.y + Math.sin(angle * 0.5) * 1;

        // Rotate skill group
        skillGroup.rotation.y += 0.01;

        // Animate technology elements within each skill group
        skillGroup.children.forEach((child, childIndex) => {
          if (child.userData.orbitRadius) {
            const techAngle =
              time * child.userData.orbitSpeed + child.userData.orbitPhase;
            const techRadius = child.userData.orbitRadius;

            child.position.x = Math.cos(techAngle) * techRadius;
            child.position.z = Math.sin(techAngle) * techRadius;
            child.position.y = Math.sin(techAngle * 0.5) * 0.5;

            child.rotation.x += 0.02;
            child.rotation.y += 0.015;
          }
        });
      }
    });
  }

  // Update controls
  controls.update();

  // Render with post-processing if available, otherwise use standard rendering
  if (composer && !isMobile) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}

// Initialize event listeners
function initEventListeners() {
  // Section indicators
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
      const section = indicator.dataset.section;
      switchSection(section);
    });
  });

  // Navigation links
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      switchSection(section);
    });
  });

  // Contact form
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  // Window resize
  window.addEventListener("resize", onWindowResize);

  // Mobile navigation toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksContainer = document.querySelector(".nav-links");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinksContainer.classList.toggle("active");
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (isLoading) return;

    const sections = ["about", "skills", "projects", "contact"];
    const currentIndex = sections.indexOf(currentSection);

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + sections.length) % sections.length;
        switchSection(sections[prevIndex]);
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % sections.length;
        switchSection(sections[nextIndex]);
        break;
      case "1":
        switchSection("about");
        break;
      case "2":
        switchSection("skills");
        break;
      case "3":
        switchSection("projects");
        break;
      case "4":
        switchSection("contact");
        break;
    }
  });
}

// Switch between sections
function switchSection(section) {
  if (section === currentSection) return;

  // Update indicators
  document.querySelectorAll(".indicator").forEach((indicator) => {
    indicator.classList.remove("active");
  });
  const activeIndicator = document.querySelector(
    `.indicator[data-section="${section}"]`
  );
  if (activeIndicator) activeIndicator.classList.add("active");

  // Update navigation
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
  });
  const navLink = document.querySelector(
    `.nav-links a[data-section="${section}"]`
  );
  if (navLink) navLink.classList.add("active");

  // Update content panels
  document.querySelectorAll(".content-panel").forEach((panel) => {
    panel.classList.remove("active");
  });
  const targetPanel = document.getElementById(`${section}-panel`);
  if (targetPanel) targetPanel.classList.add("active");

  // Trigger content integration features based on section
  if (section === "about" && !statsAnimated) {
    // Animate stats when about section is viewed
    setTimeout(() => {
      animateStatsCounters();
    }, 500);
  }

  if (section === "skills") {
    // Show skill visualization
    toggleSkillVisualization(true);
  } else {
    // Hide skill visualization when not in skills section
    toggleSkillVisualization(false);
  }

  if (section === "projects") {
    // Animate project thumbnails
    animateProjectThumbnails(true);
  } else {
    // Reset project thumbnails
    animateProjectThumbnails(false);
  }

  // Enhanced camera animation for section change
  animateCameraForSection(section);

  currentSection = section;
}

// Animate camera based on section
function animateCameraForSection(section) {
  const positions = {
    about: { x: 0, y: 2, z: 12 },
    skills: { x: -8, y: 4, z: 10 },
    projects: { x: 8, y: -3, z: 10 },
    contact: { x: 0, y: 6, z: 15 },
  };

  const lookAtTargets = {
    about: { x: 0, y: 0, z: 0 },
    skills: { x: -3, y: 2, z: 0 },
    projects: { x: 3, y: -1, z: 0 },
    contact: { x: 0, y: 2, z: 0 },
  };

  // Enhanced camera movements with cinematic feel
  const cameraEffects = {
    about: { fov: 75, shake: 0 },
    skills: { fov: 70, shake: 0.02 },
    projects: { fov: 80, shake: 0.01 },
    contact: { fov: 65, shake: 0 },
  };

  const targetPosition = positions[section] || positions.about;
  const targetLookAt = lookAtTargets[section] || lookAtTargets.about;
  const effects = cameraEffects[section] || cameraEffects.about;

  // Cancel any existing camera animation
  if (cameraAnimationId) {
    cancelAnimationFrame(cameraAnimationId);
  }

  // Smooth camera transition with enhanced easing
  const startPosition = camera.position.clone();
  const startLookAt = controls.target.clone();
  const startFov = camera.fov;
  const duration = 1500; // Longer duration for smoother transitions
  const startTime = Date.now();

  function updateCamera() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Enhanced easing with overshoot for cinematic feel
    let easeProgress;
    if (progress < 0.5) {
      easeProgress = 2 * progress * progress;
    } else {
      easeProgress = 1 - Math.pow(-2 * progress + 2, 3) / 2;
    }

    // Add slight overshoot for more dynamic movement
    const overshoot = Math.sin(progress * Math.PI) * 0.1;
    const finalProgress = easeProgress + overshoot * (1 - progress);

    // Interpolate camera position with arc movement
    const arcHeight = 2; // Add vertical arc to camera movement
    const midPoint = new THREE.Vector3()
      .lerpVectors(
        startPosition,
        new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
        0.5
      )
      .add(new THREE.Vector3(0, arcHeight, 0));

    let currentPosition;
    if (progress < 0.5) {
      currentPosition = new THREE.Vector3().lerpVectors(
        startPosition,
        midPoint,
        progress * 2
      );
    } else {
      currentPosition = new THREE.Vector3().lerpVectors(
        midPoint,
        new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
        (progress - 0.5) * 2
      );
    }

    // Add camera shake effect
    if (effects.shake > 0) {
      const shakeIntensity = effects.shake * Math.sin(elapsed * 0.01);
      currentPosition.x += (Math.random() - 0.5) * shakeIntensity;
      currentPosition.y += (Math.random() - 0.5) * shakeIntensity;
    }

    camera.position.copy(currentPosition);

    // Interpolate look-at target
    const currentLookAt = new THREE.Vector3().lerpVectors(
      startLookAt,
      new THREE.Vector3(targetLookAt.x, targetLookAt.y, targetLookAt.z),
      finalProgress
    );
    controls.target.copy(currentLookAt);

    // Animate field of view for zoom effects
    camera.fov = startFov + (effects.fov - startFov) * finalProgress;
    camera.updateProjectionMatrix();

    controls.update();

    if (progress < 1) {
      cameraAnimationId = requestAnimationFrame(updateCamera);
    } else {
      cameraAnimationId = null;
    }
  }

  updateCamera();
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // Simple form validation
  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    animateContactFormFeedback("error");
    return;
  }

  // Show sending feedback
  animateContactFormFeedback("sending");

  // Simulate form submission
  const submitBtn = e.target.querySelector(".btn-submit");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  setTimeout(() => {
    // Show success feedback
    animateContactFormFeedback("success");
    alert("Thank you for your message! I'll get back to you soon.");
    e.target.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

// Handle window resize with post-processing updates
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update post-processing if available
  if (composer && !isMobile) {
    composer.setSize(window.innerWidth, window.innerHeight);

    if (effectFXAA) {
      effectFXAA.uniforms["resolution"].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
    }

    if (bloomPass) {
      bloomPass.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // Re-detect mobile if window size changes significantly
  const wasMobile = isMobile;
  isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

  if (wasMobile !== isMobile) {
    console.log(`Device type changed: ${isMobile ? "Mobile" : "Desktop"}`);
    // Could reinitialize scene here if needed
  }
}

// Loading sequence
function startLoadingSequence() {
  // Simulate loading time
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.add("hidden");

    // Show About panel after loading sequence completes
    const aboutPanel = document.getElementById("about-panel");
    if (aboutPanel) {
      setTimeout(() => {
        aboutPanel.classList.remove("initial-load");
        // Add smooth fade-in effect
        aboutPanel.style.transition = "opacity 0.8s ease, visibility 0.8s ease";
      }, 3000); // Show after 3 seconds to ensure all animations are complete
    }

    // Enhanced entrance animation sequence
    if (mainObject) {
      mainObject.scale.set(0, 0, 0);
      mainObject.rotation.set(0, 0, 0);
    }

    if (orbitingObjects) {
      orbitingObjects.children.forEach((obj) => {
        obj.scale.set(0, 0, 0);
        obj.material.opacity = 0;
      });
    }

    if (particles) {
      particles.material.opacity = 0;
    }

    if (starField) {
      starField.material.opacity = 0;
    }

    const startTime = Date.now();
    const duration = 4000; // Extended duration for dramatic effect

    function animateEntrance() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      // Main object entrance with rotation
      if (mainObject && progress > 0.1) {
        const mainProgress = Math.min((progress - 0.1) / 0.4, 1);
        const scale = easeProgress * mainProgress;
        mainObject.scale.setScalar(scale);

        // Add entrance rotation
        mainObject.rotation.y = (1 - mainProgress) * Math.PI * 4;
        mainObject.rotation.x = (1 - mainProgress) * Math.PI * 2;
      }

      // Star field entrance
      if (starField && progress > 0.2) {
        const starProgress = Math.min((progress - 0.2) / 0.3, 1);
        starField.material.opacity = starProgress * 0.8;
      }

      // Particles entrance with wave effect
      if (particles && progress > 0.4) {
        const particleProgress = Math.min((progress - 0.4) / 0.4, 1);
        particles.material.opacity = particleProgress * 0.8;

        // Add wave entrance effect
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const wave =
            Math.sin(elapsed * 0.005 + i * 0.01) * (1 - particleProgress) * 5;
          positions[i + 1] += wave;
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }

      // Orbiting objects entrance with staggered timing
      if (orbitingObjects && progress > 0.6) {
        orbitingObjects.children.forEach((obj, index) => {
          const objProgress = Math.min(
            (progress - 0.6 - index * 0.05) / 0.3,
            1
          );
          if (objProgress > 0) {
            const scale = Math.min(objProgress * 2, 1);
            obj.scale.setScalar(scale);
            obj.material.opacity = Math.min(objProgress * 1.5, 0.7);

            // Add spiral entrance
            const spiral = (1 - objProgress) * Math.PI * 6;
            obj.rotation.x += spiral * 0.1;
            obj.rotation.y += spiral * 0.15;
          }
        });
      }

      // Camera entrance movement
      if (progress < 0.8) {
        const cameraProgress = progress / 0.8;
        const startDistance = 25;
        const targetDistance = 12;
        const currentDistance =
          startDistance + (targetDistance - startDistance) * easeProgress;

        camera.position.setLength(currentDistance);
        camera.lookAt(0, 0, 0);
      }

      if (progress < 1) {
        requestAnimationFrame(animateEntrance);
      } else {
        isLoading = false;

        // Final setup - ensure everything is in correct state
        if (mainObject) {
          mainObject.rotation.set(0, 0, 0);
          mainObject.scale.set(1, 1, 1); // Ensure main object is at full scale
        }

        // Ensure all orbiting objects are at proper opacity
        if (orbitingObjects) {
          orbitingObjects.children.forEach((obj) => {
            obj.material.opacity = obj.userData.originalOpacity || 0.7;
          });
        }

        // Ensure particles are at proper opacity
        if (particles) {
          particles.material.opacity = 0.8;
        }

        // Ensure star field is at proper opacity
        if (starField) {
          starField.material.opacity = 0.8;
        }

        // Trigger initial section animation
        setTimeout(() => {
          animateCameraForSection(currentSection);
        }, 500);
      }
    }

    animateEntrance();

    // Animate UI elements with enhanced timing
    setTimeout(() => {
      document
        .querySelectorAll(".indicator, .content-panel.active:not(#about-panel)")
        .forEach((el, index) => {
          setTimeout(() => {
            el.classList.add("fade-in");

            // Add subtle entrance animation
            el.style.transform = "translateY(20px)";
            el.style.opacity = "0";

            setTimeout(() => {
              el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
              el.style.transform = "translateY(0)";
              el.style.opacity = "1";
            }, 50);
          }, index * 150);
        });

      // Handle About panel separately without the translateY animation
      const aboutPanel = document.getElementById("about-panel");
      if (aboutPanel) {
        aboutPanel.classList.add("fade-in");
        aboutPanel.style.opacity = "1";
      }
    }, 2000);
  }, 1200); // Slightly longer initial delay
}

// Initialize interactive features
function initInteractiveFeatures() {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Mouse move event for hover effects
  window.addEventListener("mousemove", onMouseMove, false);

  // Click event for interactive objects
  window.addEventListener("click", onMouseClick, false);

  // Escape key to exit project showcase mode
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isProjectShowcaseMode) {
      exitProjectShowcase();
    }
  });
}

// Handle mouse movement for hover effects
function onMouseMove(event) {
  if (isLoading) return;

  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update raycaster
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with interactive objects
  const intersectableObjects = [];

  if (orbitingObjects) {
    intersectableObjects.push(...orbitingObjects.children);
  }

  if (mainObject) {
    mainObject.children.forEach((child) => {
      if (child.userData && child.userData.section) {
        intersectableObjects.push(child);
      }
    });
  }

  // Add central sphere to intersectable objects
  if (mainObject) {
    const centralMesh = mainObject.children.find(
      (child) => child.userData && child.userData.type === "central"
    );
    if (centralMesh) {
      intersectableObjects.push(centralMesh);
      console.log("Central sphere added to intersectable objects");
    } else {
      console.log("Central sphere not found in mainObject children");
    }
  }

  // Add project thumbnails
  if (projectThumbnails) {
    intersectableObjects.push(
      ...projectThumbnails.filter((thumb) => thumb.visible)
    );
  }

  // Add skill visualization elements
  if (skillOrbitingElements) {
    skillOrbitingElements.forEach((skillGroup) => {
      if (skillGroup.visible) {
        intersectableObjects.push(skillGroup);
      }
    });
  }

  const intersects = raycaster.intersectObjects(intersectableObjects);

  // Reset previous hover state
  if (
    hoveredObject &&
    hoveredObject !== (intersects.length > 0 ? intersects[0].object : null)
  ) {
    resetHoverEffect(hoveredObject);
  }

  // Apply hover effect to new object
  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object !== hoveredObject) {
      hoveredObject = object;
      applyHoverEffect(object);
      document.body.style.cursor = "pointer";
    }
  } else {
    hoveredObject = null;
    document.body.style.cursor = "default";
  }
}

// Handle mouse clicks for interactive objects
function onMouseClick(event) {
  if (isLoading) return;

  // Calculate mouse position
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  const intersectableObjects = [];

  if (orbitingObjects) {
    intersectableObjects.push(...orbitingObjects.children);
  }

  if (mainObject) {
    mainObject.children.forEach((child) => {
      if (child.userData && child.userData.section) {
        intersectableObjects.push(child);
      }
    });
  }

  const intersects = raycaster.intersectObjects(intersectableObjects);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    handleObjectClick(object);
  }
}

// Apply hover effects to objects
function applyHoverEffect(object) {
  if (!object.material) return;

  // Skip hover effects for central sphere if it's protected
  if (
    object.userData &&
    object.userData.type === "central" &&
    centralSphereProtected
  ) {
    console.log("Hover effect blocked - central sphere protected");
    return;
  }

  // Store original properties if not already stored
  if (!object.userData.originalEmissiveIntensity) {
    object.userData.originalEmissiveIntensity =
      object.material.emissiveIntensity;
    object.userData.originalScale = object.scale.clone();
    object.userData.originalOpacity = object.material.opacity;
  }

  // Enhanced hover effects
  object.material.emissiveIntensity = Math.min(
    object.userData.originalEmissiveIntensity + 0.5,
    1.0
  );

  // Scale up slightly - but be careful with central sphere
  if (object.userData.type === "central") {
    // For central sphere, only apply very subtle hover effect
    const hoverScale = object.userData.originalScale
      .clone()
      .multiplyScalar(1.02);
    object.scale.copy(hoverScale);
  } else {
    // For other objects, normal hover effect
    const hoverScale = object.userData.originalScale
      .clone()
      .multiplyScalar(1.2);
    object.scale.copy(hoverScale);
  }

  // Add rotation animation
  object.userData.isHovered = true;

  // Special effect for central sphere
  if (object.userData.type === "central") {
    // SAFE color change - store original color first
    if (!object.userData.originalColor) {
      object.userData.originalColor = object.material.color.getHex();
    }
    if (!object.userData.originalEmissiveColor) {
      object.userData.originalEmissiveColor = object.material.emissive.getHex();
    }

    // Only change color if not protected
    if (!centralSphereProtected) {
      object.material.color.setHex(0x10b981);
      object.material.emissive.setHex(0x064e3b);
    }
  }

  // Show tooltip for orbiting objects
  if (orbitingObjects && orbitingObjects.children.includes(object)) {
    showTooltip(object, event);
  }
}

// Reset hover effects
function resetHoverEffect(object) {
  if (!object.material || !object.userData.originalEmissiveIntensity) return;

  // Skip reset for central sphere if it's protected (let protection handle it)
  if (
    object.userData &&
    object.userData.type === "central" &&
    centralSphereProtected
  ) {
    object.userData.isHovered = false;
    return;
  }

  object.material.emissiveIntensity = object.userData.originalEmissiveIntensity;
  object.scale.copy(object.userData.originalScale);
  object.userData.isHovered = false;

  // Reset central sphere color SAFELY
  if (object.userData.type === "central") {
    // Restore original colors if they were stored
    if (object.userData.originalColor !== undefined) {
      object.material.color.setHex(object.userData.originalColor);
    } else {
      // Fallback to default color
      object.material.color.setHex(0x4f46e5);
    }

    if (object.userData.originalEmissiveColor !== undefined) {
      object.material.emissive.setHex(object.userData.originalEmissiveColor);
    } else {
      // Fallback to default emissive color
      object.material.emissive.setHex(0x1a1a3a);
    }

    // Ensure opacity is restored
    if (object.userData.originalOpacity !== undefined) {
      object.material.opacity = object.userData.originalOpacity;
    } else {
      object.material.opacity = 1.0;
    }

    // Ensure visibility
    object.visible = true;
  }

  hideTooltip();
}

// Global click protection for central sphere
let centralSphereProtected = false;
let centralSphereClickCount = 0;
let centralSphereResetTimeout = null;

// Handle object clicks
function handleObjectClick(object) {
  // Enhanced protection against rapid clicking
  const now = Date.now();
  const timeSinceLastClick = now - (window.lastClickTime || 0);

  // If clicking too rapidly, ignore clicks
  if (timeSinceLastClick < 200) {
    console.log("Click ignored - too rapid");
    return;
  }
  window.lastClickTime = now;

  // Special protection for central sphere
  if (object.userData && object.userData.type === "central") {
    centralSphereClickCount++;

    // If too many clicks in short time, activate protection mode
    if (centralSphereClickCount > 5) {
      centralSphereProtected = true;
      console.log("Central sphere protection activated");
      updateStabilityCheckFrequency(); // Increase check frequency

      // Reset protection after 3 seconds
      if (centralSphereResetTimeout) {
        clearTimeout(centralSphereResetTimeout);
      }
      centralSphereResetTimeout = setTimeout(() => {
        centralSphereProtected = false;
        centralSphereClickCount = 0;
        updateStabilityCheckFrequency(); // Decrease check frequency
        console.log("Central sphere protection deactivated");
      }, 3000);

      // Force restore sphere immediately
      forceCentralSphereRestore(object);
      return;
    }

    // Reset click count after 2 seconds of no clicks
    if (centralSphereResetTimeout) {
      clearTimeout(centralSphereResetTimeout);
    }
    centralSphereResetTimeout = setTimeout(() => {
      centralSphereClickCount = 0;
    }, 2000);
  }

  // Handle section indicator clicks
  if (object.userData && object.userData.section) {
    switchSection(object.userData.section);
    return;
  }

  // Handle project thumbnail clicks
  if (object.userData && object.userData.type === "projectThumbnail") {
    const projectIndex = object.userData.projectIndex;
    const projectInfo = projectData[projectIndex];
    if (projectInfo) {
      enterProjectShowcase(object, projectInfo);
    }
    return;
  }

  // Handle skill visualization clicks
  if (object.userData && object.userData.type === "skillVisualization") {
    const skillIndex = object.userData.skillIndex;
    const skillInfo = skillCategories[skillIndex];
    if (skillInfo) {
      showSkillDetails(skillInfo);
    }
    return;
  }

  // Handle orbiting object clicks (projects/skills)
  if (orbitingObjects && orbitingObjects.children.includes(object)) {
    const objectIndex = orbitingObjects.children.indexOf(object);

    if (projectData[objectIndex]) {
      // It's a project - enter showcase mode
      enterProjectShowcase(object, projectData[objectIndex]);
    } else if (skillCategories[objectIndex]) {
      // It's a skill category - show skill details
      showSkillDetails(skillCategories[objectIndex]);
    }
    return;
  }

  // Handle central sphere click - ULTRA PROTECTED
  if (object.userData && object.userData.type === "central") {
    console.log("Central sphere clicked!");

    // Safeguard: Don't handle click if in project showcase mode
    if (isProjectShowcaseMode) {
      console.log("Ignoring central sphere click - in project showcase mode");
      return;
    }

    // Force restore sphere properties before any action
    forceCentralSphereRestore(object);

    // Return to about section with special animation
    switchSection("about");
    animateSpherePulse();
  }
}

// Force restore central sphere to perfect state
function forceCentralSphereRestore(centralMesh) {
  if (
    !centralMesh ||
    !centralMesh.userData ||
    centralMesh.userData.type !== "central"
  ) {
    return;
  }

  console.log("Force restoring central sphere");

  // Lock all properties to safe values
  centralMesh.visible = true;
  centralMesh.scale.set(1, 1, 1);

  // Ensure material exists and is correct
  if (!centralMesh.material || centralMesh.material.disposed) {
    centralMesh.material = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      metalness: 0.8,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: false,
      opacity: 1.0,
      emissive: 0x1a1a3a,
      emissiveIntensity: 0.5,
      envMapIntensity: 1.0,
    });
  }

  // Force correct material properties
  centralMesh.material.opacity = 1.0;
  centralMesh.material.transparent = false;
  centralMesh.material.visible = true;

  if (centralMesh.material.color) {
    centralMesh.material.color.setHex(0x4f46e5);
  }
  if (centralMesh.material.emissive) {
    centralMesh.material.emissive.setHex(0x1a1a3a);
  }

  // Reset user data to safe values
  centralMesh.userData.originalScale = 1;
  centralMesh.userData.originalOpacity = 1.0;
  centralMesh.userData.originalColor = 0x4f46e5;
  centralMesh.userData.originalEmissiveColor = 0x1a1a3a;
  centralMesh.userData.isHovered = false;

  console.log("Central sphere force restored:", {
    visible: centralMesh.visible,
    scale: centralMesh.scale.x,
    opacity: centralMesh.material.opacity,
    color: centralMesh.material.color.getHex(),
  });
}

// Enter project showcase mode
function enterProjectShowcase(projectObject, projectInfo) {
  if (isProjectShowcaseMode) return;

  isProjectShowcaseMode = true;
  selectedProject = projectObject;

  // Store original camera position
  originalCameraPosition = camera.position.clone();
  originalControlsTarget = controls.target.clone();

  // Animate project object to center stage
  const targetPosition = new THREE.Vector3(0, 2, 5);
  const startPosition = projectObject.position.clone();
  const startScale = projectObject.scale.clone();
  const targetScale = startScale.clone().multiplyScalar(2);

  const duration = 1000;
  const startTime = Date.now();

  function animateProjectShowcase() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    // Move project to center
    projectObject.position.lerpVectors(
      startPosition,
      targetPosition,
      easeProgress
    );
    projectObject.scale.lerpVectors(startScale, targetScale, easeProgress);

    // Rotate for better view
    projectObject.rotation.y += 0.02;

    if (progress < 1) {
      requestAnimationFrame(animateProjectShowcase);
    } else {
      // Show project information panel
      showProjectPanel(projectInfo);
    }
  }

  // Animate camera to focus on project
  animateCameraToProject(targetPosition);
  animateProjectShowcase();

  // Dim other objects
  dimOtherObjects(projectObject);
}

// Exit project showcase mode
function exitProjectShowcase() {
  if (!isProjectShowcaseMode || !selectedProject) return;

  isProjectShowcaseMode = false;
  hideProjectPanel();

  // Restore project object to original position
  const targetPosition =
    selectedProject.userData.originalPosition || new THREE.Vector3();
  const targetScale =
    selectedProject.userData.originalScale || new THREE.Vector3(1, 1, 1);

  const duration = 800;
  const startTime = Date.now();
  const startPosition = selectedProject.position.clone();
  const startScale = selectedProject.scale.clone();

  function animateProjectReturn() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    selectedProject.position.lerpVectors(
      startPosition,
      targetPosition,
      easeProgress
    );
    selectedProject.scale.lerpVectors(startScale, targetScale, easeProgress);

    if (progress < 1) {
      requestAnimationFrame(animateProjectReturn);
    }
  }

  animateProjectReturn();

  // Restore camera position
  if (originalCameraPosition && originalControlsTarget) {
    animateCameraToPosition(originalCameraPosition, originalControlsTarget);
  }

  // Restore other objects
  restoreOtherObjects();
  selectedProject = null;
}

// Animate camera to focus on project
function animateCameraToProject(targetPosition) {
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();
  const newCameraPosition = new THREE.Vector3(
    targetPosition.x + 3,
    targetPosition.y + 1,
    targetPosition.z + 3
  );
  const newTarget = targetPosition.clone();

  const duration = 1000;
  const startTime = Date.now();

  function updateCameraToProject() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(startPosition, newCameraPosition, easeProgress);
    controls.target.lerpVectors(startTarget, newTarget, easeProgress);
    controls.update();

    if (progress < 1) {
      requestAnimationFrame(updateCameraToProject);
    }
  }

  updateCameraToProject();
}

// Animate camera to specific position
function animateCameraToPosition(targetPosition, targetLookAt) {
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();

  const duration = 1000;
  const startTime = Date.now();

  function updateCameraPosition() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
    controls.target.lerpVectors(startTarget, targetLookAt, easeProgress);
    controls.update();

    if (progress < 1) {
      requestAnimationFrame(updateCameraPosition);
    }
  }

  updateCameraPosition();
}

// Dim other objects during project showcase
function dimOtherObjects(excludeObject) {
  if (orbitingObjects) {
    orbitingObjects.children.forEach((obj) => {
      if (obj !== excludeObject) {
        // Store original opacity if not already stored
        if (!obj.userData.originalOpacity) {
          obj.userData.originalOpacity = obj.material.opacity;
        }
        obj.material.opacity = 0.2;
        obj.material.transparent = true;
      }
    });
  }

  if (mainObject) {
    mainObject.children.forEach((child) => {
      if (child.material) {
        // Store original opacity if not already stored
        if (!child.userData.originalOpacity) {
          child.userData.originalOpacity = child.material.opacity;
        }

        // Special handling for central mesh - never dim it too much
        if (child.userData.type === "central") {
          child.material.opacity = Math.max(
            child.userData.originalOpacity * 0.8,
            0.8
          );
          console.log("Dimming central mesh to:", child.material.opacity);
        } else {
          // Only dim slightly, don't make it too transparent
          child.material.opacity = Math.max(
            child.userData.originalOpacity * 0.6,
            0.4
          );
        }
        child.material.transparent = true;
      }
    });
  }

  if (particles) {
    if (!particles.userData.originalOpacity) {
      particles.userData.originalOpacity = particles.material.opacity;
    }
    particles.material.opacity = 0.1;
  }
}

// Restore other objects after project showcase
function restoreOtherObjects() {
  if (orbitingObjects) {
    orbitingObjects.children.forEach((obj) => {
      // Restore original opacity
      obj.material.opacity = obj.userData.originalOpacity || 0.7;
    });
  }

  if (mainObject) {
    mainObject.children.forEach((child) => {
      if (child.material) {
        // Restore original opacity
        child.material.opacity = child.userData.originalOpacity || 0.9;
      }
    });
  }

  if (particles) {
    particles.material.opacity = particles.userData.originalOpacity || 0.8;
  }
}

// Show project information panel
function showProjectPanel(projectInfo) {
  // Remove existing panel if any
  hideProjectPanel();

  const panel = document.createElement("div");
  panel.id = "project-showcase-panel";
  panel.innerHTML = `
    <div class="project-showcase-content">
      <button class="close-btn" onclick="exitProjectShowcase()">
        <i class="fas fa-times"></i>
      </button>
      <h2>${projectInfo.title}</h2>
      <p class="project-category">${projectInfo.category}</p>
      <p class="project-description">${projectInfo.description}</p>
      <div class="project-technologies">
        <h3>Technologies Used:</h3>
        <div class="tech-tags">
          ${projectInfo.technologies
            .map((tech) => `<span class="tech-tag">${tech}</span>`)
            .join("")}
        </div>
      </div>
      <div class="project-actions">
        <button class="btn-demo">View Demo</button>
        <button class="btn-code">View Code</button>
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  // Animate panel entrance
  setTimeout(() => {
    panel.classList.add("visible");
  }, 100);
}

// Hide project information panel
function hideProjectPanel() {
  const panel = document.getElementById("project-showcase-panel");
  if (panel) {
    panel.classList.remove("visible");
    setTimeout(() => {
      panel.remove();
    }, 300);
  }
}

// Show skill details
function showSkillDetails(skillInfo) {
  // Create temporary tooltip with skill information
  const tooltip = document.createElement("div");
  tooltip.className = "skill-tooltip";
  tooltip.innerHTML = `
    <h3>${skillInfo.name}</h3>
    <p>${skillInfo.description}</p>
  `;

  document.body.appendChild(tooltip);

  // Position tooltip near mouse
  tooltip.style.left = event.clientX + 10 + "px";
  tooltip.style.top = event.clientY - 10 + "px";

  // Auto-remove after 3 seconds
  setTimeout(() => {
    tooltip.remove();
  }, 3000);
}

// Show tooltip for orbiting objects
function showTooltip(object, event) {
  hideTooltip();

  const objectIndex = orbitingObjects.children.indexOf(object);
  let tooltipText = "";

  if (projectData[objectIndex]) {
    tooltipText = `${projectData[objectIndex].title} - Click to explore`;
  } else if (skillCategories[objectIndex]) {
    tooltipText = `${skillCategories[objectIndex].name} - Click for details`;
  }

  if (tooltipText) {
    const tooltip = document.createElement("div");
    tooltip.id = "hover-tooltip";
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);

    tooltip.style.left = event.clientX + 10 + "px";
    tooltip.style.top = event.clientY - 10 + "px";
  }
}

// Hide tooltip
function hideTooltip() {
  const tooltip = document.getElementById("hover-tooltip");
  if (tooltip) {
    tooltip.remove();
  }
}

// Animate sphere pulse effect
function animateSpherePulse() {
  const centralMesh = mainObject.children.find(
    (child) => child.userData.type === "central"
  );
  if (!centralMesh) return;

  const originalScale = centralMesh.scale.x;
  const pulseScale = originalScale * 1.5;
  const duration = 500;
  const startTime = Date.now();

  function updatePulse() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    let scale;
    if (progress < 0.5) {
      scale = originalScale + (pulseScale - originalScale) * (progress * 2);
    } else {
      scale =
        pulseScale - (pulseScale - originalScale) * ((progress - 0.5) * 2);
    }

    centralMesh.scale.setScalar(scale);

    if (progress < 1) {
      requestAnimationFrame(updatePulse);
    }
  }

  updatePulse();
}

// Make exitProjectShowcase globally available
window.exitProjectShowcase = exitProjectShowcase;

// Help overlay functions
function showHelp() {
  const helpOverlay = document.getElementById("help-overlay");
  if (helpOverlay) {
    helpOverlay.classList.add("visible");
  }
}

function hideHelp() {
  const helpOverlay = document.getElementById("help-overlay");
  if (helpOverlay) {
    helpOverlay.classList.remove("visible");
  }
}

// Make help functions globally available
window.showHelp = showHelp;
window.hideHelp = hideHelp;

// Animated stats counter
function animateStatsCounters() {
  if (statsAnimated) return;
  statsAnimated = true;

  const statElements = {
    year: document.querySelector(".stat h3"),
    projects: document.querySelectorAll(".stat h3")[1],
    skills: document.querySelectorAll(".stat h3")[2],
  };

  // Animate graduate year
  if (statElements.year) {
    animateNumber(
      statElements.year,
      statsConfig.graduateYear.current,
      statsConfig.graduateYear.target,
      statsConfig.graduateYear.duration
    );
  }

  // Animate projects count
  if (statElements.projects) {
    animateNumber(
      statElements.projects,
      statsConfig.projects.current,
      statsConfig.projects.target,
      statsConfig.projects.duration,
      "+"
    );
  }

  // Animate skills count
  if (statElements.skills) {
    animateNumber(
      statElements.skills,
      statsConfig.skills.current,
      statsConfig.skills.target,
      statsConfig.skills.duration,
      "+"
    );
  }

  // Add visual feedback to 3D scene
  if (mainObject) {
    const centralMesh = mainObject.children.find(
      (child) => child.userData.type === "central"
    );
    if (centralMesh) {
      // Pulse effect when stats animate
      const originalIntensity = centralMesh.material.emissiveIntensity;
      centralMesh.material.emissiveIntensity = 1.0;

      setTimeout(() => {
        centralMesh.material.emissiveIntensity = originalIntensity;
      }, 1000);
    }
  }
}

// Number animation helper
function animateNumber(element, start, end, duration, prefix = "") {
  const startTime = Date.now();
  const range = end - start;

  function updateNumber() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

    const current = Math.floor(start + range * easeProgress);
    element.textContent = prefix + current;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = prefix + end;
    }
  }

  updateNumber();
}

// Create floating project thumbnails in 3D space
function createProjectThumbnails() {
  projectThumbnails = [];

  Object.entries(projectData).forEach(([index, project]) => {
    // Create thumbnail plane
    const geometry = new THREE.PlaneGeometry(3, 2.25);

    // Create material with placeholder color
    const material = new THREE.MeshPhysicalMaterial({
      color:
        index == 0
          ? 0x4f46e5
          : index == 1
          ? 0x10b981
          : index == 2
          ? 0xf59e0b
          : 0xef4444,
      transparent: true,
      opacity: 0.9,
      metalness: 0.1,
      roughness: 0.3,
      emissive: 0x111111,
      emissiveIntensity: 0.2,
    });

    const thumbnail = new THREE.Mesh(geometry, material);
    const position = project.position || { x: (index - 1.5) * 4, y: 2, z: -8 };
    thumbnail.position.set(position.x, position.y, position.z);

    // Add border frame
    const frameGeometry = new THREE.PlaneGeometry(3.2, 2.45);
    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = -0.01;
    thumbnail.add(frame);

    // Add glow effect
    const glowGeometry = new THREE.PlaneGeometry(3.5, 2.7);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: material.color,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.02;
    thumbnail.add(glow);

    thumbnail.userData = {
      type: "projectThumbnail",
      projectIndex: index,
      originalPosition: thumbnail.position.clone(),
      originalRotation: thumbnail.rotation.clone(),
      isHovered: false,
      floatOffset: Math.random() * Math.PI * 2,
    };

    thumbnail.castShadow = !isMobile;
    thumbnail.receiveShadow = !isMobile;

    projectThumbnails.push(thumbnail);
    scene.add(thumbnail);
  });

  console.log(`Created ${projectThumbnails.length} project thumbnails`);
}

// Create skill visualization with orbiting elements
function createSkillVisualization() {
  skillOrbitingElements = [];

  Object.entries(skillCategories).forEach(([index, skill]) => {
    const skillGroup = new THREE.Group();

    // Main skill sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: skill.color,
      metalness: 0.7,
      roughness: 0.3,
      emissive: skill.color,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    skillGroup.add(sphere);

    // Technology orbiting elements (simplified for now)
    const techCount = 3; // Simplified
    for (let techIndex = 0; techIndex < techCount; techIndex++) {
      const techGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const techMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(
          (techIndex / techCount) * 0.3 + 0.6,
          0.8,
          0.7
        ),
        metalness: 0.8,
        roughness: 0.2,
        emissive: new THREE.Color().setHSL(
          (techIndex / techCount) * 0.3 + 0.6,
          0.5,
          0.3
        ),
        emissiveIntensity: 0.4,
      });
      const techMesh = new THREE.Mesh(techGeometry, techMaterial);

      const angle = (techIndex / techCount) * Math.PI * 2;
      const radius = 1.5;
      techMesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 0.5) * 0.5,
        Math.sin(angle) * radius
      );

      techMesh.userData = {
        orbitRadius: radius,
        orbitSpeed: 0.02 + techIndex * 0.005,
        orbitPhase: angle,
      };

      skillGroup.add(techMesh);
    }

    // Position skill group
    const angle =
      (parseInt(index) / Object.keys(skillCategories).length) * Math.PI * 2;
    const orbitRadius = skill.orbitRadius || 12;
    skillGroup.position.set(
      Math.cos(angle) * orbitRadius,
      Math.sin(angle * 0.3) * 3,
      Math.sin(angle) * orbitRadius
    );

    skillGroup.userData = {
      type: "skillVisualization",
      skillIndex: index,
      skill: skill,
      originalPosition: skillGroup.position.clone(),
      orbitSpeed: (skill.orbitSpeed || 0.8) * 0.01,
      orbitPhase: angle,
      isVisible: false,
    };

    skillGroup.visible = false; // Initially hidden
    skillOrbitingElements.push(skillGroup);
    scene.add(skillGroup);
  });

  console.log(
    `Created ${skillOrbitingElements.length} skill visualization elements`
  );
}

// Toggle skill visualization
function toggleSkillVisualization(show) {
  skillVisualizationActive = show;

  skillOrbitingElements.forEach((skillGroup, index) => {
    skillGroup.visible = show;
    skillGroup.userData.isVisible = show;

    if (show) {
      // Animate entrance
      skillGroup.scale.set(0, 0, 0);
      const targetScale = 1;
      const delay = index * 100;

      setTimeout(() => {
        const startTime = Date.now();
        const duration = 800;

        function animateEntrance() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          skillGroup.scale.setScalar(easeProgress * targetScale);
          skillGroup.rotation.y = (1 - easeProgress) * Math.PI * 2;

          if (progress < 1) {
            requestAnimationFrame(animateEntrance);
          }
        }

        animateEntrance();
      }, delay);
    }
  });
}

// Enhanced contact form with 3D feedback
function createContactFormFeedback() {
  // Create feedback visualization in 3D space
  const feedbackGeometry = new THREE.SphereGeometry(1, 16, 16);
  const feedbackMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x10b981,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0,
  });

  contactFormFeedback = new THREE.Mesh(feedbackGeometry, feedbackMaterial);
  contactFormFeedback.position.set(0, 8, 0);
  contactFormFeedback.visible = false;
  scene.add(contactFormFeedback);
}

// Animate contact form feedback
function animateContactFormFeedback(type = "success") {
  if (!contactFormFeedback) return;

  const colors = {
    success: { color: 0x10b981, emissive: 0x10b981 },
    error: { color: 0xef4444, emissive: 0xef4444 },
    sending: { color: 0xf59e0b, emissive: 0xf59e0b },
  };

  const config = colors[type] || colors.success;

  contactFormFeedback.material.color.setHex(config.color);
  contactFormFeedback.material.emissive.setHex(config.emissive);
  contactFormFeedback.visible = true;

  // Animate appearance
  const startTime = Date.now();
  const duration = 2000;

  function animateFeedback() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (progress < 0.3) {
      // Fade in and scale up
      const fadeProgress = progress / 0.3;
      contactFormFeedback.material.opacity = fadeProgress * 0.8;
      contactFormFeedback.scale.setScalar(fadeProgress);
    } else if (progress < 0.7) {
      // Hold
      contactFormFeedback.material.opacity = 0.8;
      contactFormFeedback.scale.setScalar(1);
    } else {
      // Fade out
      const fadeProgress = 1 - (progress - 0.7) / 0.3;
      contactFormFeedback.material.opacity = fadeProgress * 0.8;
      contactFormFeedback.scale.setScalar(fadeProgress);
    }

    // Rotation animation
    contactFormFeedback.rotation.y += 0.02;
    contactFormFeedback.rotation.x = Math.sin(elapsed * 0.003) * 0.2;

    if (progress < 1) {
      requestAnimationFrame(animateFeedback);
    } else {
      contactFormFeedback.visible = false;
      contactFormFeedback.material.opacity = 0;
      contactFormFeedback.scale.setScalar(0);
    }
  }

  animateFeedback();
}

// Animate project thumbnails
function animateProjectThumbnails(show) {
  projectThumbnails.forEach((thumbnail, index) => {
    if (show) {
      // Animate thumbnails into view
      thumbnail.visible = true;
      const delay = index * 200;

      setTimeout(() => {
        const startTime = Date.now();
        const duration = 1000;
        const startScale = 0;
        const targetScale = 1;

        function animateIn() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          thumbnail.scale.setScalar(
            startScale + (targetScale - startScale) * easeProgress
          );
          thumbnail.rotation.y = (1 - easeProgress) * Math.PI;

          if (progress < 1) {
            requestAnimationFrame(animateIn);
          }
        }

        animateIn();
      }, delay);
    } else {
      // Animate thumbnails out of view
      const startTime = Date.now();
      const duration = 500;
      const startScale = thumbnail.scale.x;

      function animateOut() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress * progress;

        thumbnail.scale.setScalar(startScale * (1 - easeProgress));
        thumbnail.rotation.y += 0.02;

        if (progress < 1) {
          requestAnimationFrame(animateOut);
        } else {
          thumbnail.visible = false;
        }
      }

      animateOut();
    }
  });
}

// Debug function to check scene state
function debugSceneState() {
  console.log("=== SCENE DEBUG ===");
  console.log("Scene children count:", scene.children.length);
  console.log("MainObject exists:", !!mainObject);

  if (mainObject) {
    console.log("MainObject children count:", mainObject.children.length);
    console.log("MainObject scale:", mainObject.scale);
    console.log("MainObject visible:", mainObject.visible);

    const centralMesh = mainObject.children.find(
      (child) => child.userData && child.userData.type === "central"
    );

    if (centralMesh) {
      console.log("Central mesh found!");
      console.log("Central mesh visible:", centralMesh.visible);
      console.log("Central mesh scale:", centralMesh.scale);
      console.log("Central mesh position:", centralMesh.position);
      console.log(
        "Central mesh material opacity:",
        centralMesh.material.opacity
      );
      console.log(
        "Central mesh material transparent:",
        centralMesh.material.transparent
      );
    } else {
      console.log("Central mesh NOT FOUND!");
      console.log(
        "MainObject children:",
        mainObject.children.map((child) => ({
          type: child.userData?.type,
          visible: child.visible,
          scale: child.scale,
        }))
      );
    }
  }
  console.log("=== END DEBUG ===");
}

// Make debug function globally available
window.debugSceneState = debugSceneState;

// Periodic check to ensure central sphere stability
function ensureCentralSphereStability() {
  if (!mainObject) return;

  const centralMesh = mainObject.children.find(
    (child) => child.userData && child.userData.type === "central"
  );

  if (!centralMesh) {
    console.log("Central sphere missing, recreating...");
    createFallbackCentralSphere();
    return;
  }

  // Check and fix common issues
  let needsUpdate = false;

  if (!centralMesh.visible) {
    centralMesh.visible = true;
    needsUpdate = true;
  }

  if (centralMesh.scale.x < 0.1 || centralMesh.scale.x > 5) {
    centralMesh.scale.set(1, 1, 1);
    needsUpdate = true;
  }

  if (centralMesh.material.opacity < 0.5) {
    centralMesh.material.opacity = 1.0;
    centralMesh.material.transparent = false;
    needsUpdate = true;
  }

  // Force restore if protection is active
  if (centralSphereProtected) {
    forceCentralSphereRestore(centralMesh);
    needsUpdate = true;
  }

  if (needsUpdate) {
    console.log("Central sphere stability restored");
  }
}

// Variable interval checking - more frequent when protected
let stabilityCheckInterval = null;

function startStabilityChecking() {
  if (stabilityCheckInterval) {
    clearInterval(stabilityCheckInterval);
  }

  // Check more frequently if protected, less frequently if not
  const interval = centralSphereProtected ? 100 : 2000; // 100ms vs 2s
  stabilityCheckInterval = setInterval(ensureCentralSphereStability, interval);
}

// Start initial checking
startStabilityChecking();

// Update checking frequency when protection status changes
function updateStabilityCheckFrequency() {
  startStabilityChecking();
}

// Create fallback central sphere if the original is lost
function createFallbackCentralSphere() {
  if (!mainObject) return;

  console.log("Creating fallback central sphere");

  // Remove any existing central mesh
  const existingCentral = mainObject.children.find(
    (child) => child.userData && child.userData.type === "central"
  );
  if (existingCentral) {
    mainObject.remove(existingCentral);
  }

  // Create new central sphere
  const fallbackGeometry = new THREE.IcosahedronGeometry(2.5, 2);
  const fallbackMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x4f46e5,
    metalness: 0.8,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: false,
    opacity: 1.0,
  });

  const fallbackSphere = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
  fallbackSphere.userData = {
    type: "central",
    originalScale: 1,
    originalOpacity: 1.0,
  };
  fallbackSphere.visible = true;
  fallbackSphere.scale.setScalar(1);

  // Remove any existing central mesh
  if (existingCentral) {
    mainObject.remove(existingCentral);
  }

  mainObject.add(fallbackSphere);
  console.log("Fallback central sphere created and added");
}

// Call stability check periodically
setInterval(ensureCentralSphereStability, 5000); // Check every 5 seconds

// Make debug function globally available
window.debugSceneState = debugSceneState;
