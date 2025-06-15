// Main Application Entry Point
// CSS is loaded via HTML link tag to avoid MIME type issues
import { SceneSetup } from './three/scene-setup.js';
import { AnimationManager } from './animations/animation-manager.js';
import { UIManager } from './utils/ui-manager.js';
import { EventManager } from './utils/event-manager.js';

// Application class to manage the entire portfolio
class PortfolioApp {
  constructor() {
    this.sceneSetup = null;
    this.animationManager = null;
    this.uiManager = null;
    this.eventManager = null;
    this.isLoading = true;
    this.currentSection = 'about';
  }

  // Initialize the application
  async init() {
    try {
      console.log('Initializing 3D Portfolio Application...');

      // Initialize UI Manager first (works without Three.js)
      this.uiManager = new UIManager();
      window.uiManager = this.uiManager;

      // Try to initialize 3D scene
      this.sceneSetup = new SceneSetup();
      this.sceneSetup.initResponsiveSettings();
      
      if (this.sceneSetup.initThreeJS()) {
        // Three.js loaded successfully - full 3D mode
        this.animationManager = new AnimationManager(this.sceneSetup);
        this.eventManager = new EventManager(this.sceneSetup, this.animationManager, this.uiManager);
        window.animationManager = this.animationManager;
        
        await this.setupScene();
        this.setupEventListeners();
        this.startApplication();
      } else {
        // Three.js failed - fallback to 2D mode
        console.log('Running in 2D fallback mode');
        this.eventManager = new EventManager(null, null, this.uiManager);
        this.setupEventListeners();
        this.start2DMode();
      }

      console.log('Portfolio application initialized successfully!');
    } catch (error) {
      console.error('Error initializing portfolio application:', error);
      this.start2DMode();
    }
  }

  // Setup the 3D scene
  async setupScene() {
    try {
      // Initialize post-processing
      this.sceneSetup.initPostProcessing();

      // Create scene objects (will be implemented in animation manager)
      await this.animationManager.createSceneObjects();

      this.sceneSetup.updateLoadingProgress(2);
    } catch (error) {
      console.error('Error setting up scene:', error);
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
      this.sceneSetup.onWindowResize();
    });

    // Event manager automatically initializes its event listeners in constructor
    // this.eventManager.initEventListeners();
  }

  // Start the main application loop
  startApplication() {
    // Hide loading screen
    this.hideLoadingScreen();

    // Start animation loop
    this.animate();

    // Initialize UI animations
    this.uiManager.initializeUI();

    this.isLoading = false;
  }

  // Start in 2D mode without Three.js
  start2DMode() {
    // Hide loading screen immediately
    this.hideLoadingScreen();
    
    // Initialize basic UI
    this.uiManager.initializeUI();
    
    // Set a background color to the canvas area
    const canvas = document.getElementById('three-canvas');
    if (canvas) {
      canvas.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    this.isLoading = false;
    console.log('Running in 2D mode - portfolio is still fully functional!');
  }

  // Main animation loop
  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isLoading) {
      // Update scene
      this.sceneSetup.update();
      
      // Update animations
      this.animationManager.update();

      // Render the scene
      this.sceneSetup.render();
    }
  }

  // Hide loading screen with animation
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 500); // Reduced timeout for faster response
    }
  }

  // Show error state
  showErrorState() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.innerHTML = `
        <div class="loader">
          <div style="color: #ef4444; text-align: center;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <h3>Something went wrong</h3>
            <p>Failed to load the 3D portfolio. Please refresh the page and try again.</p>
            <button onclick="window.location.reload()" style="
              margin-top: 1rem;
              padding: 0.75rem 1.5rem;
              background: var(--primary-color);
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
            ">
              <i class="fas fa-refresh"></i> Reload Page
            </button>
          </div>
        </div>
      `;
    }
  }

  // Cleanup method
  dispose() {
    if (this.sceneSetup) {
      this.sceneSetup.dispose();
    }
    if (this.eventManager) {
      this.eventManager.dispose();
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();
  app.init();

  // Store app instance globally for debugging
  window.portfolioApp = app;
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.portfolioApp) {
    window.portfolioApp.dispose();
  }
});

// Export for testing purposes
export default PortfolioApp; 