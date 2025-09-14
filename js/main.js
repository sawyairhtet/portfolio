// Simple and clean portfolio interactions
// No overengineering - just essential functionality

document.addEventListener('DOMContentLoaded', () => {
  // Enhanced lazy loading with Intersection Observer fallback
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    // Add loaded class when images finish loading
    lazyImages.forEach((img) => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
      }
    });

    if ('loading' in HTMLImageElement.prototype) {
      console.log('Native lazy loading supported');
      return;
    }

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            img.addEventListener('load', () => img.classList.add('loaded'));
            observer.unobserve(img);
          }
        });
      });

      lazyImages.forEach((img) => imageObserver.observe(img));
      console.log('Fallback lazy loading with Intersection Observer');
    } else {
      // Very old browsers: load all images
      lazyImages.forEach((img) => {
        img.src = img.dataset.src || img.src;
        img.addEventListener('load', () => img.classList.add('loaded'));
      });
      console.log('Loading all images immediately (old browser)');
    }
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth <= 768 ? 20 : 50;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Fade-in animation for sections
  const sections = document.querySelectorAll('.section, .intro');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  sections.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(el);
  });

  // Simple hover effects for project cards
  document.querySelectorAll('.project-card').forEach((card) => {
    card.style.transition = 'transform 0.2s ease';
    card.addEventListener('mouseenter', () => (card.style.transform = 'translateX(5px)'));
    card.addEventListener('mouseleave', () => (card.style.transform = 'translateX(0)'));
  });

  // Navigation highlighting on scroll
  function highlightNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('.section');
    let current = '';
    const offset = 100;

    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.style.fontWeight = link.getAttribute('href') === `#${current}` ? '600' : '500';
    });
  }

  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        highlightNavigation();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Profile picture interaction
  const profilePicture = document.querySelector('.profile-picture');
  if (profilePicture) {
    profilePicture.addEventListener('click', function () {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => (this.style.transform = 'scale(1)'), 150);
    });
  }

  // Dark mode functionality
  function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Back to top
  const backToTopButton = document.querySelector('.back-to-top');
  function toggleBackToTop() {
    if (!backToTopButton) return;
    if (window.scrollY > 300) backToTopButton.classList.add('visible');
    else backToTopButton.classList.remove('visible');
  }
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (backToTopButton) {
    backToTopButton.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
  }

  // Initialize
  initTheme();
  initLazyLoading();

  // Set current year in footer
  (function updateYear() {
    const yearEl = document.querySelector('.copyright');
    if (yearEl) {
      const year = new Date().getFullYear();
      yearEl.textContent = `© ${year} Saw Ye Htet. All rights reserved.`;
    }
  })();

  console.log('Portfolio loaded - Clean and simple');
});


// Ensure © symbol renders correctly in footer (override if needed)
(function fixYearSymbol() {
  const el = document.querySelector('.copyright');
  if (el) {
    const year = new Date().getFullYear();
    el.textContent = '© ' + year + ' Saw Ye Htet. All rights reserved.';
  }
})();
