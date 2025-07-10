// Clean, responsive interactions for the minimal portfolio design
document.addEventListener("DOMContentLoaded", function () {
  // Check if device supports touch
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        // Adjust scroll offset based on screen size
        const offset = window.innerWidth <= 768 ? 20 : 50;
        const elementPosition = target.offsetTop - offset;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Responsive fade-in animation for sections
  const observerOptions = {
    threshold: window.innerWidth <= 768 ? 0.1 : 0.15,
    rootMargin: "0px 0px -30px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe sections for subtle fade-in effect
  document.querySelectorAll(".section, .intro").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    observer.observe(section);
  });

  // Enhanced hover effects that work on both desktop and mobile
  document.querySelectorAll(".project-card").forEach((card) => {
    // For touch devices, use click to toggle effect
    if (isTouchDevice) {
      card.addEventListener("touchstart", function () {
        this.style.transform = "translateX(5px)";
      });

      card.addEventListener("touchend", function () {
        setTimeout(() => {
          this.style.transform = "translateX(0)";
        }, 150);
      });
    } else {
      // Traditional hover for desktop
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateX(5px)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateX(0)";
      });
    }
  });

  // Add transition styles to project cards
  document.querySelectorAll(".project-card").forEach((card) => {
    card.style.transition = "transform 0.2s ease";
  });

  // Enhanced navigation highlighting with responsive behavior
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll(".section");

  function highlightNavigation() {
    let currentSection = "";
    const offset = window.innerWidth <= 768 ? 80 : 100;

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
      link.classList.remove("active-nav");

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.style.fontWeight = "600";
        link.classList.add("active-nav");
      }
    });
  }

  // Improved profile icon interaction for touch devices
  const profileIcon = document.querySelector(".profile-icon");
  if (profileIcon) {
    if (isTouchDevice) {
      profileIcon.addEventListener("touchstart", function () {
        this.style.transform = "scale(0.95)";
      });

      profileIcon.addEventListener("touchend", function () {
        setTimeout(() => {
          this.style.transform = "scale(1)";
        }, 150);
      });
    } else {
      profileIcon.addEventListener("click", function () {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "scale(1)";
        }, 150);
      });
    }
  }

  // Improved throttled scroll for better mobile performance
  let ticking = false;
  let lastScrollTop = 0;

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        highlightNavigation();

        // Add scroll direction detection for mobile optimizations
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        // Optional: Hide/show navigation on mobile when scrolling
        if (window.innerWidth <= 768) {
          const header = document.querySelector(".header");
          if (scrollDirection === "down" && scrollTop > 200) {
            header.style.transform = "translateY(-10px)";
            header.style.opacity = "0.8";
          } else {
            header.style.transform = "translateY(0)";
            header.style.opacity = "1";
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Handle orientation changes on mobile devices
  window.addEventListener("orientationchange", function () {
    setTimeout(() => {
      // Recalculate layouts after orientation change
      highlightNavigation();

      // Adjust any fixed positioning if needed
      const container = document.querySelector(".container");
      if (container) {
        container.style.minHeight = window.innerHeight + "px";
      }
    }, 100);
  });

  // Handle window resize for responsive adjustments
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate observer thresholds on resize
      observer.disconnect();

      const newObserverOptions = {
        threshold: window.innerWidth <= 768 ? 0.1 : 0.15,
        rootMargin: "0px 0px -30px 0px",
      };

      const newObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      }, newObserverOptions);

      // Re-observe sections
      document.querySelectorAll(".section, .intro").forEach((section) => {
        newObserver.observe(section);
      });

      highlightNavigation();
    }, 250);
  });

  // Improved keyboard navigation for accessibility
  document.addEventListener("keydown", function (e) {
    // Handle tab navigation on mobile-style buttons
    if (e.key === "Tab") {
      const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      focusableElements.forEach((el) => {
        el.addEventListener("focus", function () {
          this.style.transform = "scale(1.02)";
        });

        el.addEventListener("blur", function () {
          this.style.transform = "scale(1)";
        });
      });
    }

    // Quick navigation with keyboard
    if (e.key === "ArrowDown" && e.ctrlKey) {
      e.preventDefault();
      const sections = document.querySelectorAll(".section");
      const currentIndex = Array.from(sections).findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
      });

      if (currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
      }
    }

    if (e.key === "ArrowUp" && e.ctrlKey) {
      e.preventDefault();
      const sections = document.querySelectorAll(".section");
      const currentIndex = Array.from(sections).findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
      });

      if (currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  // Optimized contact form for mobile
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      // Add loading state with better mobile feedback
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;
      submitButton.style.opacity = "0.7";

      // Simulate form submission (replace with actual form handling)
      setTimeout(() => {
        submitButton.textContent = "Sent!";
        submitButton.style.backgroundColor = "#2c2c2c";
        submitButton.style.color = "white";

        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          submitButton.style.opacity = "1";
          submitButton.style.backgroundColor = "";
          submitButton.style.color = "";
        }, 2000);
      }, 1000);
    });
  }

  // Add CSS for header transitions
  const headerStyle = document.createElement("style");
  headerStyle.textContent = `
    .header {
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .active-nav {
      position: relative;
    }
    
    @media (max-width: 768px) {
      .active-nav::after {
        width: 100% !important;
      }
    }
    
    /* Improved focus styles for mobile */
    @media (max-width: 768px) {
      a:focus, button:focus {
        outline: 3px solid #2c2c2c;
        outline-offset: 2px;
        border-radius: 4px;
      }
    }
    
    /* Better touch feedback */
    .social-link:active,
    .nav-link:active,
    .project-link:active,
    .footer-link:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(headerStyle);

  console.log(
    `✨ Responsive portfolio loaded - ${
      isTouchDevice ? "Touch" : "Desktop"
    } mode`
  );
});
