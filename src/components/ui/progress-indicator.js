// Progress Indicator Component
export class ProgressIndicator {
  constructor() {
    this.sections = ['about', 'skills', 'projects', 'contact'];
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.createProgressIndicator();
    this.setupEventListeners();
  }

  createProgressIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'progress-indicator';
    indicator.className = 'progress-indicator';

    indicator.innerHTML = `
      <div class="progress-track">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-labels">
        ${this.sections
          .map(
            (section, index) => `
          <div class="progress-step ${index === 0 ? 'active' : ''}" data-section="${section}" data-index="${index}">
            <div class="step-dot">
              <i class="fas ${this.getSectionIcon(section)}"></i>
            </div>
            <span class="step-label">${this.getSectionLabel(section)}</span>
          </div>
        `
          )
          .join('')}
      </div>
      <div class="progress-counter">
        <span class="current-step">1</span>
        <span class="step-separator">/</span>
        <span class="total-steps">${this.sections.length}</span>
      </div>
    `;

    // Add to UI
    const container = document.querySelector('#container');
    if (container) {
      container.appendChild(indicator);
    }
  }

  setupEventListeners() {
    // Listen for section changes
    window.addEventListener('sectionChange', (e) => {
      this.updateProgress(e.detail.section);
    });

    // Make steps clickable
    document.addEventListener('click', (e) => {
      const step = e.target.closest('.progress-step');
      if (step) {
        const section = step.dataset.section;
        if (window.uiManager) {
          window.uiManager.switchSection(section);
        }
      }
    });
  }

  updateProgress(section) {
    const newIndex = this.sections.indexOf(section);
    if (newIndex === -1) return;

    this.currentIndex = newIndex;
    const progress = ((newIndex + 1) / this.sections.length) * 100;

    // Update progress fill
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

    // Update step states
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index < newIndex) {
        step.classList.add('completed');
      } else if (index === newIndex) {
        step.classList.add('active');
      }
    });

    // Update counter
    const currentStepEl = document.querySelector('.current-step');
    if (currentStepEl) {
      currentStepEl.textContent = newIndex + 1;
    }

    // Animate the change
    this.animateProgressChange();
  }

  animateProgressChange() {
    const indicator = document.getElementById('progress-indicator');
    if (indicator) {
      indicator.classList.add('updating');
      setTimeout(() => {
        indicator.classList.remove('updating');
      }, 300);
    }
  }

  getSectionIcon(section) {
    const icons = {
      about: 'fa-user',
      skills: 'fa-code',
      projects: 'fa-project-diagram',
      contact: 'fa-envelope',
    };
    return icons[section] || 'fa-circle';
  }

  getSectionLabel(section) {
    const labels = {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
    };
    return labels[section] || section;
  }

  // Public methods for external control
  goToNext() {
    const nextIndex = Math.min(this.currentIndex + 1, this.sections.length - 1);
    if (nextIndex !== this.currentIndex && window.uiManager) {
      window.uiManager.switchSection(this.sections[nextIndex]);
    }
  }

  goToPrevious() {
    const prevIndex = Math.max(this.currentIndex - 1, 0);
    if (prevIndex !== this.currentIndex && window.uiManager) {
      window.uiManager.switchSection(this.sections[prevIndex]);
    }
  }

  goToSection(section) {
    if (this.sections.includes(section) && window.uiManager) {
      window.uiManager.switchSection(section);
    }
  }

  getCurrentSection() {
    return this.sections[this.currentIndex];
  }

  getProgress() {
    return {
      current: this.currentIndex + 1,
      total: this.sections.length,
      percentage: ((this.currentIndex + 1) / this.sections.length) * 100,
      section: this.sections[this.currentIndex],
    };
  }
}
