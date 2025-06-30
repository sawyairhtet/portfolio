// Main initialization and control
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the magical portfolio experience
  initPortfolio();
});

function initPortfolio() {
  console.log("🌟 Initializing magical portfolio...");

  // Show loading screen
  showLoadingScreen();

  // Initialize Three.js scene
  setTimeout(() => {
    try {
      initScene();
      console.log("✨ Scene initialized");

      // Initialize interactions
      if (window.interactionFunctions) {
        window.interactionFunctions.initInteractions();
        console.log("🎮 Interactions initialized");
      }

      // Add environmental elements
      addEnvironmentalElements();

      // Create floating debris for atmosphere
      if (window.animationFunctions) {
        window.animationFunctions.createFloatingDebris();
        console.log("🍃 Atmospheric elements added");
      }

      // Hide loading screen and start animation
      setTimeout(() => {
        hideLoadingScreen();

        // Start the magical animation loop
        if (window.animationFunctions) {
          window.animationFunctions.startAnimationLoop();
          console.log("🎪 Animation loop started");
        }

        // Show welcome message
        showWelcomeEffects();
      }, 1500);
    } catch (error) {
      console.error("Failed to initialize portfolio:", error);
      showErrorMessage();
    }
  }, 1000);
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
    loading.style.transition = "opacity 1s ease-out";
    loading.style.opacity = "0";
    setTimeout(() => {
      loading.style.display = "none";
    }, 1000);
  }
}

function showWelcomeEffects() {
  // Create magical burst effects at each project island
  setTimeout(() => {
    projects.forEach((project, index) => {
      setTimeout(() => {
        if (window.animationFunctions) {
          window.animationFunctions.createMagicalBurst(
            project.position,
            project.color
          );
        }
      }, index * 800);
    });
  }, 2000);

  // Add shimmer effects to islands
  setTimeout(() => {
    projectMeshes.forEach((mesh, index) => {
      setTimeout(() => {
        if (window.animationFunctions) {
          window.animationFunctions.createShimmerEffect(mesh);
        }
      }, index * 600);
    });
  }, 4000);
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

    // Add magical effect when focusing
    if (window.animationFunctions && projectMeshes[index]) {
      window.animationFunctions.createMagicalBurst(
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
      // Space bar to create random magical burst
      if (window.animationFunctions) {
        const randomProject =
          projects[Math.floor(Math.random() * projects.length)];
        window.animationFunctions.createMagicalBurst(
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

// Utility functions
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function getOptimalQuality() {
  const isMobile = isMobileDevice();
  const pixelRatio = window.devicePixelRatio || 1;

  if (isMobile) {
    return Math.min(pixelRatio * 0.8, 1.5);
  } else {
    return Math.min(pixelRatio, 2);
  }
}

// Handle visibility change (for performance)
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // Pause animation when tab is not visible
    if (window.animationFunctions) {
      window.animationFunctions.stopAnimationLoop();
    }
  } else {
    // Resume animation when tab becomes visible
    if (window.animationFunctions) {
      window.animationFunctions.startAnimationLoop();
    }
  }
});

// Graceful error handling
window.addEventListener("error", function (event) {
  console.error("Portfolio error:", event.error);

  // Try to recover by restarting the animation
  setTimeout(() => {
    if (window.animationFunctions) {
      window.animationFunctions.stopAnimationLoop();
      setTimeout(() => {
        window.animationFunctions.startAnimationLoop();
      }, 1000);
    }
  }, 2000);
});

// Export for debugging
window.portfolioDebug = {
  resetPortfolio: initPortfolio,
  showPerformanceInfo: () => console.log(`FPS: ${fps}`),
  createRandomBurst: () => {
    if (window.animationFunctions) {
      const randomProject =
        projects[Math.floor(Math.random() * projects.length)];
      window.animationFunctions.createMagicalBurst(
        randomProject.position,
        randomProject.color
      );
    }
  },
};

console.log(
  "🚀 Portfolio main script loaded. Press 1-4 to focus projects, R to reset, Space for magic!"
);
