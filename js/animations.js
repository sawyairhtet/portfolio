// Animation system for technical portfolio
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

  // Animate project structures
  animateProjectStructures();

  // Animate data streams
  animateDataStreams();

  // Animate wireframe bases
  animateWireframeBases();

  // Animate code particles
  animateCodeParticles();

  // Render the scene
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function animateProjectStructures() {
  if (!projectMeshes.length) return;

  const time = Date.now() * 0.001;

  projectMeshes.forEach((mesh, index) => {
    if (!mesh.userData.originalPosition || !mesh.userData.rotationSpeed) return;

    const originalPos = mesh.userData.originalPosition;
    const rotationSpeed = mesh.userData.rotationSpeed;

    // Smooth rotation
    mesh.rotation.x += rotationSpeed;
    mesh.rotation.y += rotationSpeed * 0.7;
    mesh.rotation.z += rotationSpeed * 0.3;

    // Subtle floating motion
    mesh.position.y = originalPos.y + Math.sin(time * 0.5 + index * 2) * 0.3;

    // Slight positional variation
    mesh.position.x = originalPos.x + Math.cos(time * 0.3 + index) * 0.1;
    mesh.position.z = originalPos.z + Math.sin(time * 0.2 + index * 1.5) * 0.1;
  });
}

function animateDataStreams() {
  if (!particles.length) return;

  const time = Date.now() * 0.001;

  particles.forEach((particleSystem, systemIndex) => {
    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.userData.velocities;

    if (!velocities) return;

    for (let i = 0; i < positions.length; i += 3) {
      const particleIndex = i / 3;

      // Update positions based on velocities
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Add some variation
      positions[i] += Math.sin(time + particleIndex * 0.1) * 0.002;
      positions[i + 1] += Math.cos(time * 0.7 + particleIndex * 0.2) * 0.001;

      // Keep particles in circular orbit
      const centerX = projects[systemIndex].position.x;
      const centerZ = projects[systemIndex].position.z;
      const dx = positions[i] - centerX;
      const dz = positions[i + 2] - centerZ;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > 8) {
        positions[i] = centerX + (dx / distance) * 4;
        positions[i + 2] = centerZ + (dz / distance) * 4;
      }
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
  });
}

function animateWireframeBases() {
  if (!platforms.length) return;

  const time = Date.now() * 0.001;

  platforms.forEach((platform, index) => {
    if (!platform.userData.originalPosition || !platform.userData.rotationSpeed)
      return;

    const originalPos = platform.userData.originalPosition;
    const rotationSpeed = platform.userData.rotationSpeed;

    // Continuous rotation
    platform.rotation.y += rotationSpeed;

    // Subtle floating motion
    platform.position.y =
      originalPos.y + Math.sin(time * 0.3 + index * 2) * 0.1;
  });
}

function animateCodeParticles() {
  if (!codeParticles.length) return;

  const time = Date.now() * 0.001;

  codeParticles.forEach((particle, index) => {
    if (!particle.userData.rotationSpeed) return;

    const rotationSpeed = particle.userData.rotationSpeed;

    // Rotate each code particle
    particle.rotation.x += rotationSpeed.x;
    particle.rotation.y += rotationSpeed.y;
    particle.rotation.z += rotationSpeed.z;

    // Subtle floating motion
    particle.position.y += Math.sin(time * 0.2 + index) * 0.001;
  });
}

// Technical effects functions
function createDataBurst(position, color = 0xff9800) {
  const particleCount = 30;
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
      x: (Math.random() - 0.5) * 0.3,
      y: Math.random() * 0.2,
      z: (Math.random() - 0.5) * 0.3,
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
    size: 0.15,
    transparent: true,
    opacity: 1,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  const burst = new THREE.Points(burstGeometry, burstMaterial);
  scene.add(burst);

  // Animate the burst
  let burstTime = 0;
  const burstDuration = 1500;

  function animateBurst() {
    burstTime += 16;
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

      // Apply gravity
      velocity.y -= 0.002;
    }

    burst.geometry.attributes.position.needsUpdate = true;
    burstMaterial.opacity = 1 - progress;

    requestAnimationFrame(animateBurst);
  }

  animateBurst();
}

function createGlowEffect(mesh) {
  if (!mesh.material) return;

  const originalEmissive = mesh.material.emissive.clone();
  const targetEmissive = new THREE.Color(0xff9800).multiplyScalar(0.3);

  let progress = 0;
  const duration = 2000;

  function animateGlow() {
    progress += 16;
    const t = Math.min(progress / duration, 1);

    // Smooth easing
    const easedT = easeInOutCubic(t);

    if (t < 0.5) {
      mesh.material.emissive.lerpColors(
        originalEmissive,
        targetEmissive,
        easedT * 2
      );
    } else {
      mesh.material.emissive.lerpColors(
        targetEmissive,
        originalEmissive,
        (easedT - 0.5) * 2
      );
    }

    if (t < 1) {
      requestAnimationFrame(animateGlow);
    } else {
      mesh.material.emissive.copy(originalEmissive);
    }
  }

  animateGlow();
}

// Utility functions
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

// Export functions to global scope
window.animationFunctions = {
  startAnimationLoop,
  stopAnimationLoop,
  createDataBurst,
  createGlowEffect,
  animateProjectStructures,
  animateDataStreams,
  animateWireframeBases,
  animateCodeParticles,
};
