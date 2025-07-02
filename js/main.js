// Main initialization and control for technical portfolio
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the professional portfolio experience
  initPortfolio();
});

function initPortfolio() {
  console.log("🚀 Initializing professional portfolio...");

  // Show loading screen
  showLoadingScreen();

  // Initialize Three.js scene
  setTimeout(() => {
    try {
      initScene();
      console.log("✅ Scene initialized");

      // Initialize interactions
      if (window.interactionFunctions) {
        window.interactionFunctions.initInteractions();
        console.log("🎮 Interactions initialized");
      }

      // Hide loading screen and start animation
      setTimeout(() => {
        hideLoadingScreen();

        // Start the technical animation loop
        if (window.animationFunctions) {
          window.animationFunctions.startAnimationLoop();
          console.log("⚡ Animation loop started");
        }

        // Show welcome effects
        showWelcomeEffects();
      }, 1000);
    } catch (error) {
      console.error("Failed to initialize portfolio:", error);
      showErrorMessage();
    }
  }, 800);
}

function showLoadingScreen() {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = "block";
    loading.style.opacity = "1";
  }
}

function hideLoadingScreen() {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.transition = "opacity 0.8s ease-out";
    loading.style.opacity = "0";
    setTimeout(() => {
      loading.style.display = "none";
    }, 800);
  }
}

function showWelcomeEffects() {
  // Create data burst effects at each project structure
  setTimeout(() => {
    projects.forEach((project, index) => {
      setTimeout(() => {
        if (window.animationFunctions && projectMeshes[index]) {
          window.animationFunctions.createDataBurst(
            project.position,
            project.color
          );
        }
      }, index * 400);
    });
  }, 1000);

  // Add glow effects to structures
  setTimeout(() => {
    projectMeshes.forEach((mesh, index) => {
      setTimeout(() => {
        if (window.animationFunctions) {
          window.animationFunctions.createGlowEffect(mesh);
        }
      }, index * 300);
    });
  }, 2000);
}

function showErrorMessage() {
  const loading = document.getElementById("loading");
  if (loading) {
    const loadingText = loading.querySelector(".loading-text");
    if (loadingText) {
      loadingText.textContent =
        "⚠️ Something went wrong. Please refresh the page.";
      loadingText.style.color = "#FF6B6B";
    }
  }
}

// Navigation functions (called from HTML)
window.focusProject = function (index) {
  if (window.interactionFunctions) {
    window.interactionFunctions.focusProject(index);

    // Add technical effect when focusing
    if (window.animationFunctions && projectMeshes[index]) {
      window.animationFunctions.createDataBurst(
        projectMeshes[index].position,
        projects[index].color
      );
    }
  }
};

window.resetView = function () {
  if (window.interactionFunctions) {
    window.interactionFunctions.resetCamera();
  }
};

// Keyboard shortcuts for enhanced experience
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "1":
    case "2":
    case "3":
    case "4":
      const projectIndex = parseInt(event.key) - 1;
      if (projectIndex >= 0 && projectIndex < projects.length) {
        window.focusProject(projectIndex);
      }
      break;

    case "r":
    case "R":
      window.resetView();
      break;

    case "Escape":
      window.resetView();
      break;

    case " ":
      event.preventDefault();
      // Space bar to create random data burst
      if (window.animationFunctions && projects.length > 0) {
        const randomProject =
          projects[Math.floor(Math.random() * projects.length)];
        window.animationFunctions.createDataBurst(
          randomProject.position,
          randomProject.color
        );
      }
      break;
  }
});

// Performance monitoring
let lastFrameTime = Date.now();
let frameCount = 0;
let fps = 60;

function updatePerformanceMetrics() {
  frameCount++;
  const currentTime = Date.now();

  if (currentTime - lastFrameTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastFrameTime = currentTime;

    // Adjust quality based on performance
    adjustQuality();
  }
}

function adjustQuality() {
  if (!renderer) return;

  // Lower quality if FPS is too low
  if (fps < 30) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.5, 1));
    console.log("📉 Reducing quality for better performance");
  } else if (fps > 50) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

// Device detection and optimization
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function getOptimalQuality() {
  if (isMobileDevice()) {
    return 0.5; // Lower quality for mobile
  }
  return Math.min(window.devicePixelRatio, 2);
}

// Scene management
function pauseScene() {
  if (window.animationFunctions) {
    window.animationFunctions.stopAnimationLoop();
  }
}

function resumeScene() {
  if (window.animationFunctions) {
    window.animationFunctions.startAnimationLoop();
  }
}

// Visibility API for performance
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    pauseScene();
  } else {
    resumeScene();
  }
});

// Handle focus/blur for performance
window.addEventListener("blur", pauseScene);
window.addEventListener("focus", resumeScene);

// Export main functions
window.portfolioFunctions = {
  initPortfolio,
  showLoadingScreen,
  hideLoadingScreen,
  showWelcomeEffects,
  showErrorMessage,
  updatePerformanceMetrics,
  adjustQuality,
  pauseScene,
  resumeScene,
};

console.log(
  "🚀 Portfolio main script loaded. Press 1-4 to focus projects, R to reset, Space for magic!"
);
