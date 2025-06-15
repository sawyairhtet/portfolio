// Three.js Scene Setup Module
export class SceneSetup {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.composer = null;
    this.loadingProgress = 0;
    this.totalAssets = 10;
    this.loadedAssets = 0;
    this.isMobile = false;
    this.devicePixelRatio = 1;
  }

  // Initialize responsive settings
  initResponsiveSettings() {
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    this.devicePixelRatio = Math.min(
      window.devicePixelRatio,
      this.isMobile ? 1.5 : 2
    );

    if (this.isMobile) {
      this.totalAssets = 6;
    }

    console.log(
      `Device: ${this.isMobile ? "Mobile" : "Desktop"}, Pixel Ratio: ${
        this.devicePixelRatio
      }`
    );
  }

  // Update loading progress
  updateLoadingProgress(increment = 1) {
    this.loadedAssets += increment;
    this.loadingProgress = Math.min(
      (this.loadedAssets / this.totalAssets) * 100,
      100
    );

    const progressBar = document.querySelector(".progress-bar");
    const progressText = document.querySelector(".progress-text");
    const progressPercentage = document.querySelector(".progress-percentage");

    if (progressBar) {
      progressBar.style.width = `${this.loadingProgress}%`;
    }

    if (progressPercentage) {
      progressPercentage.textContent = `${Math.round(this.loadingProgress)}%`;
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
        Math.floor((this.loadingProgress / 100) * loadingMessages.length),
        loadingMessages.length - 1
      );
      progressText.textContent = loadingMessages[messageIndex];
    }

    console.log(`Loading progress: ${Math.round(this.loadingProgress)}%`);
  }

  // Check if Three.js is loaded
  checkThreeJS() {
    if (typeof THREE === "undefined") {
      console.error("Three.js failed to load. Falling back to 2D mode.");
      return false;
    }
    
    // Check if OrbitControls is available
    if (typeof THREE.OrbitControls === "undefined") {
      console.warn("OrbitControls not available, camera controls may be limited.");
      // Still continue with basic Three.js
    }
    
    return true;
  }

  // Initialize Three.js scene
  initThreeJS() {
    if (!this.checkThreeJS()) return false;

    try {
      // Scene setup
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0x111827, 50, 200);

      // Camera setup
      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 0, 20);

      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("three-canvas"),
        antialias: !this.isMobile,
        powerPreference: this.isMobile ? "low-power" : "high-performance",
        stencil: false,
      });

      this.renderer.setPixelRatio(this.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = !this.isMobile;
      this.renderer.shadowMap.type = this.isMobile
        ? THREE.BasicShadowMap
        : THREE.PCFSoftShadowMap;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.2;

      // Controls setup (with fallback)
      if (typeof THREE.OrbitControls !== "undefined") {
        this.controls = new THREE.OrbitControls(
          this.camera,
          this.renderer.domElement
        );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.maxDistance = 50;
        this.controls.minDistance = 10;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0.5;
      } else {
        console.warn("OrbitControls not available, using basic camera setup");
        this.controls = null;
      }

      this.updateLoadingProgress();
      return true;
    } catch (error) {
      console.error("Error initializing Three.js:", error);
      return false;
    }
  }

  // Initialize post-processing
  initPostProcessing() {
    if (this.isMobile) {
      // Skip post-processing on mobile for performance
      return;
    }

    try {
      // Import post-processing classes (assuming they're available)
      this.composer = new THREE.EffectComposer(this.renderer);

      const renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);

      // Bloom effect
      const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,
        0.4,
        0.85
      );
      this.composer.addPass(bloomPass);

      // FXAA anti-aliasing
      const fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
      fxaaPass.material.uniforms["resolution"].value.x =
        1 / (window.innerWidth * this.devicePixelRatio);
      fxaaPass.material.uniforms["resolution"].value.y =
        1 / (window.innerHeight * this.devicePixelRatio);
      this.composer.addPass(fxaaPass);

      this.updateLoadingProgress();
    } catch (error) {
      console.warn("Post-processing not available:", error);
    }
  }

  // Handle window resize
  onWindowResize() {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // Render frame
  render() {
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Update controls
  update() {
    if (this.controls) {
      this.controls.update();
    }
  }

  // Get scene objects
  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  getControls() {
    return this.controls;
  }

  // Toggle animations (for development/debugging)
  toggleAnimations() {
    // Can be used to pause/resume animations for debugging
    console.log('Animation toggle requested');
  }

  // Cleanup
  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.composer) {
      this.composer.dispose();
    }
  }
}
