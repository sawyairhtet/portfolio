// Simple and clean portfolio interactions
// No overengineering - just essential functionality

document.addEventListener('DOMContentLoaded', () => {
  function ensureGlobalControls() {
    let themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) {
      themeToggle = document.createElement('button');
      themeToggle.type = 'button';
      themeToggle.className = 'theme-toggle';
      themeToggle.setAttribute('aria-label', 'Toggle dark mode');
      themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle.innerHTML = `
  <span class="theme-toggle-icon light-icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8 1.8-1.8zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9.83-19.16l-1.79-1.79-1.8 1.79 1.8 1.8 1.79-1.8zM17.24 4.84l-1.8 1.8 1.8 1.8 1.8-1.8-1.8-1.8zM12 6a6 6 0 100 12A6 6 0 0012 6zm8 7h3v-2h-3v2zM4.22 18.36l1.79 1.79 1.8-1.79-1.8-1.8-1.79 1.8zM17.24 19.16l1.8 1.79 1.79-1.79-1.79-1.8-1.8 1.8z"/>
    </svg>
  </span>
  <span class="theme-toggle-icon dark-icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.64 13a9 9 0 01-11.31-11.31 1 1 0 00-1.33-1.33A11 11 0 1022.97 14.3a1 1 0 00-1.33-1.3z"/>
    </svg>
  </span>
`;
      document.body.appendChild(themeToggle);
    }

    let backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) {
      backToTopButton = document.createElement('button');
      backToTopButton.type = 'button';
      backToTopButton.className = 'back-to-top';
      backToTopButton.setAttribute('aria-label', 'Back to top');
      backToTopButton.innerHTML = `
  <span class="back-to-top-icon">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 4l-7 7h4v9h6v-9h4z"/>
    </svg>
  </span>
`;
      document.body.appendChild(backToTopButton);
    }

    return { themeToggle, backToTopButton };
  }

  const { themeToggle, backToTopButton } = ensureGlobalControls();

  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

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
      lazyImages.forEach((img) => {
        img.src = img.dataset.src || img.src;
        img.addEventListener('load', () => img.classList.add('loaded'));
      });
      console.log('Loading all images immediately (old browser)');
    }
  }

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

  document.querySelectorAll('.project-card').forEach((card) => {
    card.style.transition = 'transform 0.2s ease';
    card.addEventListener('mouseenter', () => (card.style.transform = 'translateX(5px)'));
    card.addEventListener('mouseleave', () => (card.style.transform = 'translateX(0)'));
  });

  function highlightNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!navLinks.length) return;
    const contentSections = document.querySelectorAll('.section');
    let current = '';
    const offset = 100;

    contentSections.forEach((section) => {
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = current && link.getAttribute('href') === `#${current}`;
      link.style.fontWeight = isActive ? '600' : '500';
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
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

  const profilePicture = document.querySelector('.profile-picture');
  if (profilePicture) {
    profilePicture.addEventListener('click', function () {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => (this.style.transform = 'scale(1)'), 150);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    // Update browser UI tint to match theme
    try {
      const themeMeta = document.querySelector('meta#theme-color');
      if (themeMeta) {
        const light = '#fafafa';
        const dark = '#121212';
        themeMeta.setAttribute('content', theme === 'dark' ? dark : light);
      }
    } catch (_) {
      // no-op
    }
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

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
    toggleBackToTop();
  }

  initTheme();
  initLazyLoading();
  highlightNavigation();

  function updateYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll('[data-current-year]').forEach((el) => {
      el.textContent = year;
    });
  }
  updateYear();
  console.log('Portfolio loaded - Clean and simple');
});
