// Three.js Scene Setup
let scene, camera, renderer;
let projectMeshes = [];
let particles = [];
let platforms = [];

function initScene() {
  // Scene setup with Ghibli-style lighting
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x87ceeb, 10, 50);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 20);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x87ceeb, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  setupLighting();
  createProjectIslands();

  // Handle window resize
  window.addEventListener("resize", onWindowResize);
}

function setupLighting() {
  // Warm, magical lighting like Ghibli films
  const ambientLight = new THREE.AmbientLight(0xffe4b5, 0.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffd700, 1.2);
  sunLight.position.set(10, 15, 5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -20;
  sunLight.shadow.camera.right = 20;
  sunLight.shadow.camera.top = 20;
  sunLight.shadow.camera.bottom = -20;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.5);
  fillLight.position.set(-5, 10, -5);
  scene.add(fillLight);

  // Add rim light for magical effect
  const rimLight = new THREE.DirectionalLight(0xffb6c1, 0.3);
  rimLight.position.set(0, -5, 10);
  scene.add(rimLight);
}

function createProjectIslands() {
  projects.forEach((project, index) => {
    // Create different magical shapes
    let geometry;
    switch (project.shape) {
      case "sphere":
        geometry = new THREE.SphereGeometry(2, 16, 16);
        break;
      case "crystal":
        geometry = new THREE.OctahedronGeometry(2.5);
        break;
      case "octahedron":
        geometry = new THREE.OctahedronGeometry(2.2);
        break;
      case "dodecahedron":
        geometry = new THREE.DodecahedronGeometry(2);
        break;
      default:
        geometry = new THREE.SphereGeometry(2, 16, 16);
    }

    // Magical material with soft glow
    const material = new THREE.MeshPhongMaterial({
      color: project.color,
      transparent: true,
      opacity: 0.85,
      shininess: 30,
      specular: 0x222222,
    });

    const island = new THREE.Mesh(geometry, material);
    island.position.set(
      project.position.x,
      project.position.y,
      project.position.z
    );
    island.userData = {
      projectIndex: index,
      isHovered: false,
      originalPosition: { ...project.position },
    };
    island.castShadow = true;
    island.receiveShadow = true;

    scene.add(island);
    projectMeshes.push(island);

    // Add floating base/platform under each island
    createPlatform(project.position, index);

    // Add magical floating particles around each island
    createParticleSystem(project, index);
  });
}

function createPlatform(position, index) {
  const platformGeometry = new THREE.CylinderGeometry(3, 2.5, 0.5, 12);
  const platformMaterial = new THREE.MeshPhongMaterial({
    color: 0xdeb887,
    transparent: true,
    opacity: 0.7,
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.set(position.x, position.y - 2.5, position.z);
  platform.userData = {
    originalPosition: { x: position.x, y: position.y - 2.5, z: position.z },
  };
  platform.castShadow = true;
  platform.receiveShadow = true;
  scene.add(platform);
  platforms.push(platform);
}

function createParticleSystem(project, index) {
  const particleCount = 30;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  const color = new THREE.Color(project.color);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = project.position.x + (Math.random() - 0.5) * 12;
    positions[i3 + 1] = project.position.y + (Math.random() - 0.5) * 8;
    positions[i3 + 2] = project.position.z + (Math.random() - 0.5) * 12;

    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = Math.random() * 0.01;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  particleGeometry.userData = { velocities: velocities };

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
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

function addEnvironmentalElements() {
  // Add some floating rocks/debris for atmosphere
  for (let i = 0; i < 15; i++) {
    const rockGeometry = new THREE.DodecahedronGeometry(
      Math.random() * 0.5 + 0.2
    );
    const rockMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b7d6b,
      transparent: true,
      opacity: 0.6,
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);

    rock.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 60
    );

    rock.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    scene.add(rock);
  }
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
};
