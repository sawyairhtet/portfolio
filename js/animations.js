// Animation system for magical floating effects
let animationId = null;
let isAnimating = false;

function startAnimationLoop() {
  if (isAnimating) return;
  isAnimating = true;
  animate();
}

function stopAnimationLoop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  isAnimating = false;
}

function animate() {
  if (!isAnimating) return;

  animationId = requestAnimationFrame(animate);

  // Update camera position based on mouse
  if (window.interactionFunctions) {
    window.interactionFunctions.updateCameraPosition();
  }

  // Animate floating islands
  animateFloatingIslands();

  // Animate particles
  animateParticles();

  // Animate platforms
  animatePlatforms();

  // Render the scene
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function animateFloatingIslands() {
  if (!projectMeshes.length) return;

  const time = Date.now() * 0.0008;

  projectMeshes.forEach((mesh, index) => {
    if (!mesh.userData.originalPosition) return;

    const originalPos = mesh.userData.originalPosition;

    // Gentle rotation
    mesh.rotation.x += 0.002;
    mesh.rotation.y += 0.003;

    // Floating motion like Laputa - gentle vertical bobbing
    mesh.position.y = originalPos.y + Math.sin(time + index * 2) * 0.8;

    // Slight horizontal drift
    mesh.position.x = originalPos.x + Math.cos(time * 0.7 + index) * 0.3;
    mesh.position.z = originalPos.z + Math.sin(time * 0.5 + index * 1.5) * 0.2;

    // Add slight rotation variation for more natural movement
    const rotationOffset = Math.sin(time * 0.3 + index) * 0.1;
    mesh.rotation.z = rotationOffset;
  });
}

function animateParticles() {
  if (!particles.length) return;

  const time = Date.now() * 0.001;

  particles.forEach((particleSystem, systemIndex) => {
    const positions = particleSystem.geometry.attributes.position.array;
    const originalPositions = particleSystem.userData.originalPositions;
    const velocities = particleSystem.userData.velocities;

    if (!originalPositions || !velocities) return;

    for (let i = 0; i < positions.length; i += 3) {
      const particleIndex = i / 3;

      // Gentle floating motion
      positions[i] =
        originalPositions[i] + Math.sin(time + particleIndex * 0.1) * 2;
      positions[i + 1] =
        originalPositions[i + 1] +
        Math.cos(time * 0.7 + particleIndex * 0.2) * 1.5;
      positions[i + 2] =
        originalPositions[i + 2] +
        Math.sin(time * 0.5 + particleIndex * 0.15) * 1;

      // Add some upward drift
      originalPositions[i + 1] += 0.005;

      // Reset particles that drift too high
      if (originalPositions[i + 1] > projects[systemIndex].position.y + 15) {
        originalPositions[i + 1] = projects[systemIndex].position.y - 8;
      }
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
  });
}

function animatePlatforms() {
  if (!platforms.length) return;

  const time = Date.now() * 0.0008;

  platforms.forEach((platform, index) => {
    if (!platform.userData.originalPosition) return;

    const originalPos = platform.userData.originalPosition;

    // Gentle floating motion - slightly slower than the islands
    platform.position.y =
      originalPos.y + Math.sin(time * 0.8 + index * 2) * 0.6;
    platform.position.x = originalPos.x + Math.cos(time * 0.5 + index) * 0.2;
    platform.position.z =
      originalPos.z + Math.sin(time * 0.3 + index * 1.5) * 0.15;

    // Gentle rotation
    platform.rotation.y += 0.001;
  });
}

// Special effects functions
function createMagicalBurst(position, color = 0xffd700) {
  const particleCount = 50;
  const burstGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  const colors = new Float32Array(particleCount * 3);

  const particleColor = new THREE.Color(color);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // Start all particles at the burst position
    positions[i3] = position.x;
    positions[i3 + 1] = position.y;
    positions[i3 + 2] = position.z;

    // Random velocities for explosion effect
    velocities.push({
      x: (Math.random() - 0.5) * 0.5,
      y: Math.random() * 0.3,
      z: (Math.random() - 0.5) * 0.5,
    });

    colors[i3] = particleColor.r;
    colors[i3 + 1] = particleColor.g;
    colors[i3 + 2] = particleColor.b;
  }

  burstGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  burstGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const burstMaterial = new THREE.PointsMaterial({
    size: 0.3,
    transparent: true,
    opacity: 1,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  const burst = new THREE.Points(burstGeometry, burstMaterial);
  scene.add(burst);

  // Animate the burst
  let burstTime = 0;
  const burstDuration = 2000;

  function animateBurst() {
    burstTime += 16; // Approximately 60fps
    const progress = burstTime / burstDuration;

    if (progress >= 1) {
      scene.remove(burst);
      return;
    }

    const positions = burst.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const velocity = velocities[i];

      positions[i3] += velocity.x;
      positions[i3 + 1] += velocity.y;
      positions[i3 + 2] += velocity.z;

      // Add gravity
      velocity.y -= 0.01;
    }

    burst.geometry.attributes.position.needsUpdate = true;
    burst.material.opacity = 1 - progress;

    requestAnimationFrame(animateBurst);
  }

  animateBurst();
}

function createShimmerEffect(mesh) {
  const originalColor = mesh.material.color.clone();
  const shimmerColor = new THREE.Color(0xffffff);

  let shimmerProgress = 0;
  const shimmerDuration = 1000;
  const startTime = Date.now();

  function animateShimmer() {
    const elapsed = Date.now() - startTime;
    shimmerProgress = elapsed / shimmerDuration;

    if (shimmerProgress >= 1) {
      mesh.material.color.copy(originalColor);
      return;
    }

    // Pulse between original and white
    const intensity = Math.sin(shimmerProgress * Math.PI * 4) * 0.5 + 0.5;
    mesh.material.color.lerpColors(
      originalColor,
      shimmerColor,
      intensity * 0.3
    );

    requestAnimationFrame(animateShimmer);
  }

  animateShimmer();
}

// Utility functions for smooth animations
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function easeOutElastic(t) {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Background animation for ambient atmosphere
function createFloatingDebris() {
  const debrisCount = 20;
  const debris = [];

  for (let i = 0; i < debrisCount; i++) {
    const geometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 6, 6);
    const material = new THREE.MeshPhongMaterial({
      color: 0xdeb887,
      transparent: true,
      opacity: 0.3 + Math.random() * 0.3,
    });

    const debrisPiece = new THREE.Mesh(geometry, material);
    debrisPiece.position.set(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 100
    );

    debrisPiece.userData = {
      velocity: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.02,
      },
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      },
    };

    scene.add(debrisPiece);
    debris.push(debrisPiece);
  }

  return debris;
}

// Export animation functions
window.animationFunctions = {
  startAnimationLoop,
  stopAnimationLoop,
  createMagicalBurst,
  createShimmerEffect,
  createFloatingDebris,
  easeInOutCubic,
  easeOutElastic,
  lerp,
};
