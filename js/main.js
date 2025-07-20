// Simple and clean portfolio interactions
// No overengineering - just essential functionality

document.addEventListener("DOMContentLoaded", function () {
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

  console.log("✨ Portfolio loaded - Clean and simple");
});
