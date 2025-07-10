// Simple interactions for the clean portfolio design
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add simple fade-in animation for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all sections for fade-in effect
  document.querySelectorAll(".section, .intro, .header").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });

  // Add subtle hover effects to project cards
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Add transition styles to project cards
  document.querySelectorAll(".project-card").forEach((card) => {
    card.style.transition = "transform 0.2s ease";
  });

  // Simple typing effect for the header (optional)
  const tagline = document.querySelector(".tagline");
  if (tagline) {
    const text = tagline.textContent;
    tagline.textContent = "";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        tagline.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }

    // Start typing after a brief delay
    setTimeout(typeWriter, 1000);
  }

  // Add scroll-based navigation highlighting
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll(".section");

  function highlightNavigation() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
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
      link.style.color = "#0066cc";

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.style.fontWeight = "600";
        link.style.color = "#004499";
      }
    });
  }

  // Throttled scroll event for performance
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

  window.addEventListener("scroll", handleScroll);

  // Easter egg: Konami code
  let konamiCode = [];
  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  document.addEventListener("keydown", function (e) {
    konamiCode.push(e.code);

    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }

    if (konamiCode.join(",") === konamiSequence.join(",")) {
      // Add a fun little surprise
      document.body.style.fontFamily = "Comic Sans MS, cursive";
      setTimeout(() => {
        document.body.style.fontFamily = "";
      }, 5000);

      // Show a message
      const message = document.createElement("div");
      message.textContent =
        "🎉 You found the easter egg! Comic Sans for 5 seconds!";
      message.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #0066cc;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1000;
                font-size: 14px;
                font-weight: 500;
            `;
      document.body.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 5000);

      konamiCode = [];
    }
  });

  // Simple contact form enhancement (if contact form exists)
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.textContent = "Sending...";
      submitButton.disabled = true;

      // Simulate form submission (replace with actual form handling)
      setTimeout(() => {
        submitButton.textContent = "Sent!";
        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }, 2000);
      }, 1000);
    });
  }

  console.log("🎨 Clean portfolio loaded successfully!");
  console.log("💡 Tip: Try the Konami code for a surprise!");
});
