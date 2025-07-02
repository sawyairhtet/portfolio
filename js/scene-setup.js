// Three.js Scene Setup for Photography/Development Portfolio
let scene, camera, renderer;
let projectMeshes = [];
let particles = [];
let platforms = [];
let codeParticles = [];

function initScene() {
  // Professional scene setup
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0a, 20, 80);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 25);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0a0a, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  setupLighting();
  createProjectStructures();
  addTechnicalElements();

  // Handle window resize
  window.addEventListener("resize", onWindowResize);
}

function setupLighting() {
  // Professional studio-style lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  // Key light (main illumination)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(15, 20, 10);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 100;
  keyLight.shadow.camera.left = -30;
  keyLight.shadow.camera.right = 30;
  keyLight.shadow.camera.top = 30;
  keyLight.shadow.camera.bottom = -30;
  scene.add(keyLight);

  // Fill light (softer, opposite side)
  const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.6);
  fillLight.position.set(-10, 15, -8);
  scene.add(fillLight);

  // Accent light (signature orange)
  const accentLight = new THREE.DirectionalLight(0xff9800, 0.8);
  accentLight.position.set(0, -10, 15);
  scene.add(accentLight);

  // Rim light for depth
  const rimLight = new THREE.DirectionalLight(0xff6f00, 0.4);
  rimLight.position.set(5, 0, -20);
  scene.add(rimLight);
}

function createProjectStructures() {
  projects.forEach((project, index) => {
    // Create technical geometric shapes
    let geometry;
    switch (project.shape) {
      case "sphere":
        // Data node representation
        geometry = new THREE.IcosahedronGeometry(2.2, 1);
        break;
      case "crystal":
        // Camera aperture inspired
        geometry = new THREE.OctahedronGeometry(2.5);
        break;
      case "octahedron":
        // Code structure representation
        geometry = new THREE.OctahedronGeometry(2.2);
        break;
      case "dodecahedron":
        // Complex algorithm visualization
        geometry = new THREE.DodecahedronGeometry(2);
        break;
      default:
        geometry = new THREE.IcosahedronGeometry(2.2, 1);
    }

    // Professional material with subtle glow
    const material = new THREE.MeshPhysicalMaterial({
      color: project.color,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.9,
      emissive: new THREE.Color(project.color).multiplyScalar(0.1),
      transmission: 0.1,
      thickness: 0.5,
    });

    const structure = new THREE.Mesh(geometry, material);
    structure.position.set(
      project.position.x,
      project.position.y,
      project.position.z
    );
    structure.userData = {
      projectIndex: index,
      isHovered: false,
      originalPosition: { ...project.position },
      rotationSpeed: 0.005 + Math.random() * 0.01,
    };
    structure.castShadow = true;
    structure.receiveShadow = true;

    scene.add(structure);
    projectMeshes.push(structure);

    // Add wireframe base (representing code structure)
    createWireframeBase(project.position, project.color, index);

    // Add data stream particles
    createDataStream(project, index);
  });
}

function createWireframeBase(position, color, index) {
  const baseGeometry = new THREE.CylinderGeometry(3.5, 3, 0.3, 8);
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: color,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(position.x, position.y - 3, position.z);
  base.userData = {
    originalPosition: { x: position.x, y: position.y - 3, z: position.z },
    rotationSpeed: 0.002,
  };
  scene.add(base);
  platforms.push(base);

  // Add connecting lines (representing data connections)
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array([
    position.x,
    position.y - 2.5,
    position.z,
    position.x,
    position.y,
    position.z,
  ]);
  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(linePositions, 3)
  );

  const lineMaterial = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.4,
  });

  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
}

function createDataStream(project, index) {
  const particleCount = 40;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const color = new THREE.Color(project.color);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Create circular data streams around each project
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 4 + Math.random() * 3;
    positions[i3] = project.position.x + Math.cos(angle) * radius;
    positions[i3 + 1] = project.position.y + (Math.random() - 0.5) * 6;
    positions[i3 + 2] = project.position.z + Math.sin(angle) * radius;

    velocities[i3] = -Math.sin(angle) * 0.01;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
    velocities[i3 + 2] = Math.cos(angle) * 0.01;

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = 0.1 + Math.random() * 0.2;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  particleGeometry.userData = { velocities: velocities };

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    transparent: true,
    opacity: 0.7,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  particleSystem.userData = {
    projectIndex: index,
    velocities: velocities,
    originalPositions: Float32Array.from(positions),
  };
  scene.add(particleSystem);
  particles.push(particleSystem);
}

function addTechnicalElements() {
  // Add floating geometric elements representing code blocks
  for (let i = 0; i < 20; i++) {
    const geometries = [
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.TetrahedronGeometry(0.4),
      new THREE.OctahedronGeometry(0.35),
    ];

    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xff9800,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.4,
      emissive: new THREE.Color(0xff9800).multiplyScalar(0.05),
    });

    const element = new THREE.Mesh(geometry, material);
    element.position.set(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 80
    );

    element.userData = {
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
    };

    scene.add(element);
    codeParticles.push(element);
  }

  // Add grid floor (representing code structure)
  const gridHelper = new THREE.GridHelper(100, 50, 0xff9800, 0x333333);
  gridHelper.position.y = -15;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.2;
  scene.add(gridHelper);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Export scene objects for use in other files
window.sceneObjects = {
  scene,
  camera,
  renderer,
  projectMeshes,
  particles,
  platforms,
  codeParticles,
};
