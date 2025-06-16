// Event Manager for handling all user interactions and events
export class EventManager {
  constructor(sceneSetup, animationManager, uiManager) {
    this.sceneSetup = sceneSetup;
    this.animationManager = animationManager;
    this.uiManager = uiManager;

    // Binding methods
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    // Touch interaction state
    this.touchStartTime = 0;
    this.touchStartPosition = { x: 0, y: 0 };
    this.isTouchDevice = 'ontouchstart' in window;

    this.init();
  }

  // Initialize all event listeners
  init() {
    // Mouse events
    if (!this.isTouchDevice) {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('click', this.handleClick);
    }

    // Touch events
    if (this.isTouchDevice) {
      window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
      window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
      window.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    }

    // Keyboard events
    window.addEventListener('keydown', this.handleKeydown);

    // Window events
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('wheel', this.handleWheel, { passive: false });

    // Prevent context menu on right click
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    // Form submission events
    this.setupFormEvents();

    // Navigation events
    this.setupNavigationEvents();

    // Help overlay events
    this.setupHelpEvents();
  }

  // Setup form events
  setupFormEvents() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.uiManager.handleContactSubmit(e);
      });
    }

    // Input focus animations
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });

      // Check for pre-filled values
      if (input.value) {
        input.parentElement.classList.add('focused');
      }
    });
  }

  // Setup navigation events
  setupNavigationEvents() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        this.uiManager.switchSection(section);
      });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
      });
    }
  }

  // Setup help overlay events
  setupHelpEvents() {
    const helpButton = document.querySelector('.help-button');
    const helpOverlay = document.querySelector('.help-overlay');
    const closeHelpButton = document.querySelector('.close-help');

    if (helpButton && helpOverlay) {
      helpButton.addEventListener('click', () => {
        helpOverlay.classList.add('active');
      });
    }

    if (closeHelpButton && helpOverlay) {
      closeHelpButton.addEventListener('click', () => {
        helpOverlay.classList.remove('active');
      });
    }

    // Close help when clicking outside
    if (helpOverlay) {
      helpOverlay.addEventListener('click', (e) => {
        if (e.target === helpOverlay) {
          helpOverlay.classList.remove('active');
        }
      });
    }
  }

  // Handle mouse movement
  handleMouseMove(event) {
    if (this.animationManager && this.animationManager.onMouseMove) {
      this.animationManager.onMouseMove(event);
    }

    // Update UI manager for any mouse-based interactions
    if (this.uiManager && this.uiManager.onMouseMove) {
      this.uiManager.onMouseMove(event);
    }
  }

  // Handle clicks
  handleClick(event) {
    if (this.animationManager && this.animationManager.onClick) {
      this.animationManager.onClick(event);
    }

    // Handle UI clicks
    if (this.uiManager && this.uiManager.onClick) {
      this.uiManager.onClick(event);
    }
  }

  // Handle keyboard input
  handleKeydown(event) {
    // Escape key - close overlays
    if (event.key === 'Escape') {
      this.uiManager.closeAllOverlays();
    }

    // Arrow keys - navigate sections
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.uiManager.navigateNext();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.uiManager.navigatePrevious();
    }

    // Number keys - direct section navigation
    const sectionKeys = {
      1: 'about',
      2: 'skills',
      3: 'projects',
      4: 'contact',
    };

    if (sectionKeys[event.key]) {
      event.preventDefault();
      this.uiManager.switchSection(sectionKeys[event.key]);
    }

    // Help key
    if (event.key === 'h' || event.key === 'H') {
      const helpOverlay = document.querySelector('.help-overlay');
      if (helpOverlay) {
        helpOverlay.classList.toggle('active');
      }
    }

    // Spacebar - pause/resume animations (development feature)
    if (event.key === ' ' && event.ctrlKey) {
      event.preventDefault();
      this.sceneSetup.toggleAnimations();
    }
  }

  // Handle window resize
  handleResize() {
    if (this.sceneSetup) {
      this.sceneSetup.onWindowResize();
    }

    if (this.uiManager) {
      this.uiManager.onResize();
    }
  }

  // Handle wheel events
  handleWheel(event) {
    // Allow default zoom behavior
    // Add any custom wheel handling here if needed
  }

  // Handle touch start
  handleTouchStart(event) {
    this.touchStartTime = Date.now();

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.touchStartPosition = {
        x: touch.clientX,
        y: touch.clientY,
      };
    }
  }

  // Handle touch move
  handleTouchMove(event) {
    // Prevent default to avoid scrolling issues
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  // Handle touch end
  handleTouchEnd(event) {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - this.touchStartTime;

    // If it's a quick tap (less than 200ms), treat as click
    if (touchDuration < 200 && event.changedTouches.length === 1) {
      const touch = event.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - this.touchStartPosition.x);
      const deltaY = Math.abs(touch.clientY - this.touchStartPosition.y);

      // If touch didn't move much, simulate a click
      if (deltaX < 10 && deltaY < 10) {
        const clickEvent = new MouseEvent('click', {
          clientX: touch.clientX,
          clientY: touch.clientY,
          bubbles: true,
          cancelable: true,
        });

        touch.target.dispatchEvent(clickEvent);
      }
    }
  }

  // Cleanup event listeners
  destroy() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  // Add custom event listener
  addEventListener(element, event, handler) {
    if (element && typeof element.addEventListener === 'function') {
      element.addEventListener(event, handler);
    }
  }

  // Remove custom event listener
  removeEventListener(element, event, handler) {
    if (element && typeof element.removeEventListener === 'function') {
      element.removeEventListener(event, handler);
    }
  }

  // Trigger custom events
  triggerEvent(eventName, data = {}) {
    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
  }

  // Listen for custom events
  onCustomEvent(eventName, handler) {
    window.addEventListener(eventName, handler);
  }

  // Get mouse/touch position
  getPointerPosition(event) {
    if (event.touches && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else {
      return {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  // Check if device supports touch
  isTouchSupported() {
    return this.isTouchDevice;
  }

  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}
