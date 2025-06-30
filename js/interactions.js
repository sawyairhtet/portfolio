// Mouse and interaction handling
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Mouse movement variables
let mouseX = 0,
  mouseY = 0;
let targetX = 0,
  targetY = 0;

// Camera animation variables
let cameraAnimation = null;

function initInteractions() {
  // Mouse movement for camera control
  document.addEventListener("mousemove", onMouseMove);

  // Click interactions
  document.addEventListener("click", onMouseClick);

  // Scroll for zoom
  document.addEventListener("wheel", onMouseWheel);

  // Touch support for mobile
  document.addEventListener("touchstart", onTouchStart, { passive: false });
  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", onTouchEnd);
}

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  targetX = mouseX * 3;
  targetY = mouseY * 2;

  // Raycasting for gentle hover effects
  mouse.x = mouseX;
  mouse.y = mouseY;

  updateHoverEffects();
}

function updateHoverEffects() {
  if (!projectMeshes.length) return;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(projectMeshes);

  // Reset all hovers
  projectMeshes.forEach((mesh) => {
    if (mesh.userData.isHovered) {
      mesh.scale.set(1, 1, 1);
      mesh.material.opacity = 0.85;
      mesh.userData.isHovered = false;
    }
  });

  // Handle new hover with gentle glow
  if (intersects.length > 0) {
    const hoveredMesh = intersects[0].object;
    hoveredMesh.scale.set(1.15, 1.15, 1.15);
    hoveredMesh.material.opacity = 1;
    hoveredMesh.userData.isHovered = true;

    // Update project info
    const projectIndex = hoveredMesh.userData.projectIndex;
    updateProjectInfo(projectIndex);
    document.body.style.cursor = "pointer";
  } else {
    hideProjectInfo();
    document.body.style.cursor = "default";
  }
}

function onMouseClick(event) {
  if (!projectMeshes.length) return;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(projectMeshes);

  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object;
    const projectIndex = clickedMesh.userData.projectIndex;
    focusProject(projectIndex);
  }
}

function onMouseWheel(event) {
  if (!camera) return;

  event.preventDefault();
  camera.position.z += event.deltaY * 0.02;
  camera.position.z = Math.max(8, Math.min(40, camera.position.z));
}

// Touch support for mobile devices
let touchStartX = 0,
  touchStartY = 0;
let isTouching = false;

function onTouchStart(event) {
  if (event.touches.length === 1) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    isTouching = true;

    // Simulate mouse move for hover effects
    const touch = event.touches[0];
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
    };
    onMouseMove(mouseEvent);
  }
}

function onTouchMove(event) {
  if (!isTouching || event.touches.length !== 1) return;

  event.preventDefault();
  const touch = event.touches[0];

  // Update mouse position for hover effects
  const mouseEvent = {
    clientX: touch.clientX,
    clientY: touch.clientY,
  };
  onMouseMove(mouseEvent);
}

function onTouchEnd(event) {
  if (!isTouching) return;

  isTouching = false;

  // Simulate click if it's a tap (not a drag)
  if (event.changedTouches.length === 1) {
    const touch = event.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX);
    const deltaY = Math.abs(touch.clientY - touchStartY);

    if (deltaX < 10 && deltaY < 10) {
      // It's a tap, simulate click
      const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
      };
      onMouseMove(mouseEvent);
      onMouseClick(mouseEvent);
    }
  }
}

// Project info functions
function updateProjectInfo(index) {
  if (index < 0 || index >= projects.length) return;

  const project = projects[index];
  const infoPanel = document.getElementById("project-info");
  const title = document.getElementById("project-title");
  const description = document.getElementById("project-description");
  const techStack = document.getElementById("tech-stack");
  const projectLinks = document.getElementById("project-links");

  if (!infoPanel || !title || !description || !techStack || !projectLinks)
    return;

  title.textContent = project.title;
  description.textContent = project.description;

  // Update tech stack
  techStack.innerHTML = "";
  project.tech.forEach((tech) => {
    const tag = document.createElement("span");
    tag.className = "tech-tag";
    tag.textContent = tech;
    techStack.appendChild(tag);
  });

  // Update project links
  projectLinks.innerHTML = "";
  if (project.links && project.links.length > 0) {
    project.links.forEach((link) => {
      const linkElement = document.createElement("a");
      linkElement.className = "project-link";
      linkElement.href = link.url;
      linkElement.textContent = link.text;
      linkElement.target = "_blank";
      linkElement.rel = "noopener noreferrer";
      projectLinks.appendChild(linkElement);
    });
  }

  infoPanel.classList.add("active");
}

function hideProjectInfo() {
  const infoPanel = document.getElementById("project-info");
  if (infoPanel) {
    infoPanel.classList.remove("active");
  }
}

// Gentle focus on specific project
function focusProject(index) {
  if (index < 0 || index >= projects.length || !camera) return;

  const project = projects[index];
  const targetPos = project.position;

  // Cancel any existing animation
  if (cameraAnimation) {
    cancelAnimationFrame(cameraAnimation);
  }

  // Smooth camera animation
  const startPos = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  const endPos = { x: targetPos.x, y: targetPos.y + 2, z: targetPos.z + 12 };

  let progress = 0;
  const duration = 3000; // Slower, more magical
  const startTime = Date.now();

  function animateCamera() {
    const elapsed = Date.now() - startTime;
    progress = Math.min(elapsed / duration, 1);

    // Gentle easing (ease-out)
    const ease = 1 - Math.pow(1 - progress, 2);

    camera.position.x = startPos.x + (endPos.x - startPos.x) * ease;
    camera.position.y = startPos.y + (endPos.y - startPos.y) * ease;
    camera.position.z = startPos.z + (endPos.z - startPos.z) * ease;

    camera.lookAt(targetPos.x, targetPos.y, targetPos.z);

    if (progress < 1) {
      cameraAnimation = requestAnimationFrame(animateCamera);
    } else {
      cameraAnimation = null;
    }
  }

  animateCamera();
  updateProjectInfo(index);
}

// Reset camera to default position
function resetCamera() {
  if (!camera) return;

  // Cancel any existing animation
  if (cameraAnimation) {
    cancelAnimationFrame(cameraAnimation);
  }

  const startPos = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };
  const endPos = { x: 0, y: 5, z: 20 };

  let progress = 0;
  const duration = 2000;
  const startTime = Date.now();

  function animateCamera() {
    const elapsed = Date.now() - startTime;
    progress = Math.min(elapsed / duration, 1);

    const ease = 1 - Math.pow(1 - progress, 2);

    camera.position.x = startPos.x + (endPos.x - startPos.x) * ease;
    camera.position.y = startPos.y + (endPos.y - startPos.y) * ease;
    camera.position.z = startPos.z + (endPos.z - startPos.z) * ease;

    camera.lookAt(0, 0, 0);

    if (progress < 1) {
      cameraAnimation = requestAnimationFrame(animateCamera);
    } else {
      cameraAnimation = null;
    }
  }

  animateCamera();
  hideProjectInfo();
}

// Update camera position based on mouse
function updateCameraPosition() {
  if (!camera) return;

  // Gentle camera movement
  camera.position.x += (targetX - camera.position.x) * 0.02;
  camera.position.y += (targetY - camera.position.y) * 0.02;

  // Only look at origin if not in focused mode
  if (!cameraAnimation) {
    camera.lookAt(0, 0, 0);
  }
}

// Export functions for use in other files
window.interactionFunctions = {
  initInteractions,
  updateCameraPosition,
  focusProject,
  resetCamera,
  updateProjectInfo,
  hideProjectInfo,
};
