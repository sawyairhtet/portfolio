// Simple and clean portfolio interactions
// No overengineering - just essential functionality

document.addEventListener("DOMContentLoaded", function () {
  // Enhanced lazy loading with intersection observer fallback
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Add loaded class when images finish loading
    lazyImages.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
    
    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading is supported, images will load automatically
      console.log('✅ Native lazy loading supported');
    } else {
      // Fallback for older browsers using Intersection Observer
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              img.classList.remove('lazy');
              img.addEventListener('load', () => {
                img.classList.add('loaded');
              });
              imageObserver.unobserve(img);
            }
          });
        });

        lazyImages.forEach(img => {
          imageObserver.observe(img);
        });
        
        console.log('✅ Fallback lazy loading with Intersection Observer');
      } else {
        // Fallback for very old browsers - load all images
        lazyImages.forEach(img => {
          img.src = img.dataset.src || img.src;
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
        });
        console.log('⚠️ Loading all images immediately (old browser)');
      }
    }
  }

  // Simple smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offset = window.innerWidth <= 768 ? 20 : 50;
        const elementPosition = target.offsetTop - offset;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Simple fade-in animation for sections
  const sections = document.querySelectorAll(".section, .intro");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  // Set up animations and observe sections
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });

  // Simple hover effects for project cards
  document.querySelectorAll(".project-card").forEach((card) => {
    card.style.transition = "transform 0.2s ease";

    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(5px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
    });
  });

  // Simple navigation highlighting
  function highlightNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll(".section");
    let currentSection = "";
    const offset = 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.style.fontWeight = "500";

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.style.fontWeight = "600";
      }
    });
  }

  // Throttled scroll handler
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

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Profile picture interaction
  const profilePicture = document.querySelector(".profile-picture");
  if (profilePicture) {
    profilePicture.addEventListener("click", function () {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
  }

  // Dark mode functionality
  function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  // Theme toggle button functionality
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Back to top functionality
  const backToTopButton = document.querySelector(".back-to-top");

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopButton?.classList.add("visible");
    } else {
      backToTopButton?.classList.remove("visible");
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Back to top button functionality
  if (backToTopButton) {
    backToTopButton.addEventListener("click", scrollToTop);
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
  }

  // Initialize theme
  initTheme();

  // Initialize lazy loading
  initLazyLoading();

  // Set current year in footer
  function setCopyrightYear() {
    const yearElement = document.querySelector(".copyright");
    if (yearElement) {
      yearElement.textContent = `© ${new Date().getFullYear()} Saw Ye Htet. All rights reserved.`;
    }
  }
  setCopyrightYear();

  console.log("✨ Portfolio loaded - Clean and simple");
});
