// UI Manager for handling interface interactions
export class UIManager {
  constructor() {
    this.currentSection = 'about';
    this.isProjectShowcaseOpen = false;
    this.isHelpOverlayOpen = false;
  }

  // Initialize UI components
  initializeUI() {
    this.setupNavigationHandlers();
    this.setupFormHandlers();
    this.setupHelpOverlay();
    this.animateInitialLoad();
  }

  // Setup navigation event handlers
  setupNavigationHandlers() {
    // Section indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator) => {
      indicator.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.switchSection(section);
      });
    });

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        this.switchSection(section);
      });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (navToggle && navLinksContainer) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  // Switch between sections
  switchSection(section) {
    if (section === this.currentSection) return;

    console.log(`Switching from ${this.currentSection} to ${section}`);

    // Update indicators
    document.querySelectorAll('.indicator').forEach((indicator) => {
      indicator.classList.remove('active');
    });
    document.querySelector(`.indicator[data-section="${section}"]`)?.classList.add('active');

    // Update panels - use a cleaner approach
    document.querySelectorAll('.content-panel').forEach((panel) => {
      panel.classList.remove('active', 'initial-load');
      console.log(`Hiding panel: ${panel.id}`);
    });

    // Small delay to ensure CSS transitions work properly
    setTimeout(() => {
      const targetPanel = document.getElementById(`${section}-panel`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        console.log(`Showing panel: ${targetPanel.id}`);
      }
    }, 10); // Very small delay to allow DOM updates

    // Update navigation links
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.classList.remove('active');
    });
    document.querySelector(`.nav-links a[data-section="${section}"]`)?.classList.add('active');

    this.currentSection = section;

    // Trigger section change event
    this.onSectionChange(section);
  }

  // Handle keyboard navigation
  handleKeyboardNavigation(e) {
    const sections = ['about', 'skills', 'projects', 'contact'];
    const currentIndex = sections.indexOf(this.currentSection);

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
        this.switchSection(sections[prevIndex]);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
        this.switchSection(sections[nextIndex]);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        e.preventDefault();
        const sectionIndex = parseInt(e.key) - 1;
        if (sectionIndex >= 0 && sectionIndex < sections.length) {
          this.switchSection(sections[sectionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.closeProjectShowcase();
        this.closeHelpOverlay();
        break;
    }
  }

  // Setup form handlers
  setupFormHandlers() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        this.handleFormSubmit(e);
      });
    }
  }

  // Handle contact form submission
  handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // Show loading state
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        e.target.reset();
      }, 2000);
    }, 1500);
  }

  // Setup help overlay
  setupHelpOverlay() {
    const helpButton = document.getElementById('help-button');
    const helpOverlay = document.getElementById('help-overlay');
    const helpClose = document.querySelector('.help-close');

    if (helpButton) {
      helpButton.addEventListener('click', () => this.showHelpOverlay());
    }

    if (helpClose) {
      helpClose.addEventListener('click', () => this.closeHelpOverlay());
    }

    if (helpOverlay) {
      helpOverlay.addEventListener('click', (e) => {
        if (e.target === helpOverlay) {
          this.closeHelpOverlay();
        }
      });
    }
  }

  // Show help overlay
  showHelpOverlay() {
    const helpOverlay = document.getElementById('help-overlay');
    if (helpOverlay) {
      helpOverlay.classList.add('active');
      this.isHelpOverlayOpen = true;
    }
  }

  // Close help overlay
  closeHelpOverlay() {
    const helpOverlay = document.getElementById('help-overlay');
    if (helpOverlay) {
      helpOverlay.classList.remove('active');
      this.isHelpOverlayOpen = false;
    }
  }

  // Show project showcase
  showProjectShowcase(projectData) {
    const showcase = document.getElementById('project-showcase-panel');
    const content = document.querySelector('.project-showcase-content');

    if (showcase && content) {
      content.innerHTML = `
        <h2>${projectData.title}</h2>
        <div class="project-category">${projectData.category}</div>
        <div class="project-description">${projectData.description}</div>
        <div class="project-technologies">
          <h3>Technologies Used</h3>
          <div class="tech-tags">
            ${projectData.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
        <div class="project-actions">
          <a href="#" class="btn-demo">
            <i class="fas fa-external-link-alt"></i> View Demo
          </a>
          <a href="#" class="btn-code">
            <i class="fab fa-github"></i> View Code
          </a>
        </div>
      `;

      showcase.classList.add('active');
      this.isProjectShowcaseOpen = true;
    }
  }

  // Close project showcase
  closeProjectShowcase() {
    const showcase = document.getElementById('project-showcase-panel');
    if (showcase) {
      showcase.classList.remove('active');
      this.isProjectShowcaseOpen = false;
    }
  }

  // Animate initial load
  animateInitialLoad() {
    const aboutPanel = document.getElementById('about-panel');
    if (aboutPanel) {
      setTimeout(() => {
        aboutPanel.classList.add('fade-in');
      }, 500);
    }

    // Animate stats counters
    this.animateStatsCounters();
  }

  // Animate stats counters
  animateStatsCounters() {
    const stats = document.querySelectorAll('.stat h3');
    stats.forEach((stat, index) => {
      const target = parseInt(stat.textContent);
      let current = 0;
      const increment = target / 100;

      setTimeout(() => {
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.textContent = Math.floor(current);
        }, 20);
      }, index * 200);
    });
  }

  // Show tooltip
  showTooltip(content, x, y) {
    const tooltip = document.getElementById('hover-tooltip');
    if (tooltip) {
      tooltip.textContent = content;
      tooltip.style.left = `${x + 10}px`;
      tooltip.style.top = `${y - 10}px`;
      tooltip.style.opacity = '1';
    }
  }

  // Hide tooltip
  hideTooltip() {
    const tooltip = document.getElementById('hover-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
    }
  }

  // Section change callback (to be used by other managers)
  onSectionChange(section) {
    // This will be called by the event manager to handle 3D scene changes
    console.log(`Switched to section: ${section}`);

    // Notify animation manager of section change
    if (window.animationManager) {
      window.animationManager.onSectionChange(section);
    }
  }

  // Get current section
  getCurrentSection() {
    return this.currentSection;
  }

  // Check if project showcase is open
  isProjectShowcaseVisible() {
    return this.isProjectShowcaseOpen;
  }

  // Handle contact form submission (called by EventManager)
  handleContactSubmit(e) {
    this.handleFormSubmit(e);
  }

  // Close all overlays
  closeAllOverlays() {
    this.closeProjectShowcase();
    this.closeHelpOverlay();
  }

  // Navigate to next section
  navigateNext() {
    const sections = ['about', 'skills', 'projects', 'contact'];
    const currentIndex = sections.indexOf(this.currentSection);
    const nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
    this.switchSection(sections[nextIndex]);
  }

  // Navigate to previous section
  navigatePrevious() {
    const sections = ['about', 'skills', 'projects', 'contact'];
    const currentIndex = sections.indexOf(this.currentSection);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
    this.switchSection(sections[prevIndex]);
  }

  // Handle mouse move events
  onMouseMove(event) {
    // Can be used for UI-specific mouse interactions
  }

  // Handle click events
  onClick(event) {
    // Handle UI-specific click events
  }

  // Handle resize events
  onResize() {
    // Handle UI adjustments on window resize
  }
}
