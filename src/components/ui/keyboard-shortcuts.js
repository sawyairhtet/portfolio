// Keyboard Shortcuts Component
export class KeyboardShortcuts {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.shortcuts = {
      // Navigation
      ArrowLeft: () => this.uiManager.navigatePrevious(),
      ArrowRight: () => this.uiManager.navigateNext(),
      ArrowUp: () => this.uiManager.navigatePrevious(),
      ArrowDown: () => this.uiManager.navigateNext(),
      Home: () => this.uiManager.switchSection('about'),
      End: () => this.uiManager.switchSection('contact'),

      // Direct section navigation
      1: () => this.uiManager.switchSection('about'),
      2: () => this.uiManager.switchSection('skills'),
      3: () => this.uiManager.switchSection('projects'),
      4: () => this.uiManager.switchSection('contact'),

      // Escape actions
      Escape: () => this.handleEscape(),

      // Accessibility
      Enter: () => this.handleEnter(),
      ' ': () => this.handleSpace(),
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.addNavigationTooltips();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      this.handleKeyPress(e);
    });

    // Prevent default browser shortcuts that might interfere
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && ['r', 'f', 'l'].includes(e.key.toLowerCase())) {
        if (e.key.toLowerCase() !== 'r') {
          // Allow refresh
          e.preventDefault();
        }
      }
    });
  }

  handleKeyPress(e) {
    // Skip if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = e.key;
    const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

    // Skip modified shortcuts
    if (hasModifier) {
      return;
    }

    // Handle regular shortcuts
    if (this.shortcuts[key]) {
      e.preventDefault();
      this.shortcuts[key]();
    }
  }

  addNavigationTooltips() {
    // Tooltips disabled - keyboard shortcuts still work without visual indicators
  }

  addTooltip(element, text) {
    // Tooltip functionality disabled
  }

  handleEscape() {
    // Close any open overlays
    if (window.uiManager) {
      window.uiManager.closeAllOverlays();
    }
  }

  handleEnter() {
    // Activate focused element
    const focused = document.activeElement;
    if (focused && focused.click) {
      focused.click();
    }
  }

  handleSpace() {
    // Same as Enter for most elements
    this.handleEnter();
  }

  getAvailableShortcuts() {
    return Object.keys(this.shortcuts);
  }
}
