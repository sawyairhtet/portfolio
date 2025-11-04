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

    let sfxToggle = document.querySelector('.sfx-toggle');
    if (!sfxToggle) {
      sfxToggle = document.createElement('button');
      sfxToggle.type = 'button';
      sfxToggle.className = 'sfx-toggle';
      sfxToggle.setAttribute('aria-label', 'Toggle interface sound effects');
      sfxToggle.setAttribute('aria-pressed', 'false');
      sfxToggle.setAttribute('data-sfx-enabled', 'false');
      sfxToggle.innerHTML = `
  <span class="sfx-toggle-icon sfx-icon-on" aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a2.5 2.5 0 00-1.5-2.296v4.592a2.5 2.5 0 001.5-2.296zm-1.5-7.981v2.054a4.5 4.5 0 010 9.854v2.055A6.5 6.5 0 0020 12a6.5 6.5 0 00-5-6.981z"/>
    </svg>
  </span>
  <span class="sfx-toggle-icon sfx-icon-off" aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 7.27V4.05A6.5 6.5 0 0120 12a6.45 6.45 0 01-1.04 3.53l-1.5-1.5A4.5 4.5 0 0018 12a4.48 4.48 0 00-2-3.73zM4.41 3L3 4.41 7.59 9H3v6h4l5 5v-6.59l4.11 4.11A6.46 6.46 0 0113.5 20v-2.05a4.51 4.51 0 001.48-1.02l3.11 3.11 1.41-1.41L4.41 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  </span>
`;
      document.body.appendChild(sfxToggle);
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
    backToTopButton.setAttribute('data-sfx', 'click');

    return { themeToggle, sfxToggle, backToTopButton };
  }

  const { themeToggle, sfxToggle, backToTopButton } = ensureGlobalControls();

  const soundFx = (() => {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    let context = null;
    let enabled = false;

    function ensureContext() {
      if (!AudioCtor) return null;
      if (!context) {
        try {
          context = new AudioCtor();
        } catch (_) {
          context = null;
        }
      }
      return context;
    }

    function enable() {
      const ctx = ensureContext();
      if (!ctx) return false;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      enabled = true;
      return true;
    }

    function disable() {
      enabled = false;
    }

    function isEnabled() {
      return enabled;
    }

    function play(type = 'click') {
      if (!enabled) return;
      const ctx = ensureContext();
      if (!ctx || ctx.state === 'suspended') return;

      const now = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const tones = {
        click: 420,
        window: 480,
        hover: 520,
        toggleOn: 660,
        toggleOff: 240,
      };
      const duration = type === 'hover' ? 0.15 : 0.22;
      const baseFrequency = tones[type] || tones.click;
      const startGain = type === 'hover' ? 0.05 : 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFrequency, now);
      if (type === 'toggleOff') {
        osc.frequency.exponentialRampToValueAtTime(180, now + duration);
      } else {
        osc.frequency.exponentialRampToValueAtTime(baseFrequency * 1.12, now + duration);
      }

      gain.gain.setValueAtTime(startGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    }

    return { enable, disable, isEnabled, play, hasSupport: Boolean(AudioCtor) };
  })();

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

  function applySfxToggleState(isOn) {
    if (!sfxToggle) return;
    sfxToggle.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    sfxToggle.setAttribute('data-sfx-enabled', isOn ? 'true' : 'false');
  }

  function attachSfxHandlers() {
    const clickTargets = document.querySelectorAll('[data-sfx="click"]');
    clickTargets.forEach((el) => {
      el.addEventListener('click', () => soundFx.play('click'));
    });

    document.querySelectorAll('[data-window-sfx]').forEach((card) => {
      card.addEventListener('pointerenter', () => soundFx.play('window'));
      card.addEventListener('focusin', () => soundFx.play('window'));
    });
  }

  function initSfx() {
    if (!sfxToggle) return;
    if (!soundFx.hasSupport) {
      sfxToggle.setAttribute('disabled', 'true');
      sfxToggle.setAttribute('aria-disabled', 'true');
      sfxToggle.title = 'Sound effects are not available in this browser';
      return;
    }

    const stored = localStorage.getItem('portfolio:sfx-enabled');
    let prefersSfx = stored === 'true';
    applySfxToggleState(prefersSfx);

    if (prefersSfx) {
      const unlock = () => {
        if (soundFx.enable()) {
          document.removeEventListener('pointerdown', unlock);
        }
      };
      document.addEventListener('pointerdown', unlock, { once: true });
    }

    sfxToggle.addEventListener('click', () => {
      const next = !prefersSfx;
      if (next) {
        if (!soundFx.enable()) {
          return;
        }
        soundFx.play('toggleOn');
      } else {
        soundFx.play('toggleOff');
        soundFx.disable();
      }
      prefersSfx = next;
      applySfxToggleState(next);
      localStorage.setItem('portfolio:sfx-enabled', String(next));
    });

    attachSfxHandlers();
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
    if (soundFx.isEnabled()) {
      soundFx.play(next === 'dark' ? 'toggleOn' : 'toggleOff');
    }
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

  initSfx();
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
