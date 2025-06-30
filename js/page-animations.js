// Page animations for About and Contact pages
document.addEventListener("DOMContentLoaded", function () {
  initPageAnimations();
});

function initPageAnimations() {
  // Enhanced floating leaves animation
  animateFloatingLeaves();

  // Animate elements on scroll
  setupScrollAnimations();

  // Add magical hover effects
  addMagicalHoverEffects();

  // Initialize navigation animations
  setupNavigationAnimations();

  // Add sparkle effects
  createSparkleEffects();

  console.log("✨ Page animations initialized");
}

function animateFloatingLeaves() {
  const leaves = document.querySelectorAll(".leaf");

  leaves.forEach((leaf, index) => {
    // Add random movement variation
    setInterval(() => {
      const randomX = (Math.random() - 0.5) * 100;
      const randomY = (Math.random() - 0.5) * 50;

      leaf.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${
        Math.random() * 360
      }deg)`;
    }, 3000 + index * 500);

    // Add click interaction
    leaf.addEventListener("click", function () {
      createLeafBurst(this);
    });
  });
}

function createLeafBurst(leaf) {
  const rect = leaf.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Create burst particles
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    particle.textContent = "✨";
    particle.style.position = "fixed";
    particle.style.left = centerX + "px";
    particle.style.top = centerY + "px";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "1000";
    particle.style.fontSize = "1rem";
    particle.style.color = "#FFD700";

    document.body.appendChild(particle);

    // Animate particle
    const angle = (i / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;

    particle.animate(
      [
        { transform: "translate(0, 0) scale(0)", opacity: 1 },
        {
          transform: `translate(${endX - centerX}px, ${
            endY - centerY
          }px) scale(1)`,
          opacity: 0,
        },
      ],
      {
        duration: 1000,
        easing: "ease-out",
      }
    ).onfinish = () => {
      particle.remove();
    };
  }

  // Animate the original leaf
  leaf.style.transform = "scale(1.2)";
  setTimeout(() => {
    leaf.style.transform = "";
  }, 200);
}

function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Add sparkle effect for special elements
        if (
          entry.target.classList.contains("story-card") ||
          entry.target.classList.contains("skill-tree") ||
          entry.target.classList.contains("value-card")
        ) {
          setTimeout(() => {
            addSparkleToElement(entry.target);
          }, 500);
        }
      }
    });
  }, observerOptions);

  // Observe elements that should animate in
  const animateElements = document.querySelectorAll(
    ".story-card, .skill-tree, .value-card, .faq-item, .contact-method"
  );
  animateElements.forEach((el) => observer.observe(el));
}

function addSparkleToElement(element) {
  const rect = element.getBoundingClientRect();
  const sparkleCount = 5;

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement("div");
    sparkle.textContent = "✨";
    sparkle.style.position = "fixed";
    sparkle.style.left = rect.left + Math.random() * rect.width + "px";
    sparkle.style.top = rect.top + Math.random() * rect.height + "px";
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "1000";
    sparkle.style.fontSize = "1.2rem";
    sparkle.style.color = "#FFD700";

    document.body.appendChild(sparkle);

    sparkle.animate(
      [
        { opacity: 0, transform: "scale(0) rotate(0deg)" },
        { opacity: 1, transform: "scale(1) rotate(180deg)" },
        { opacity: 0, transform: "scale(0) rotate(360deg)" },
      ],
      {
        duration: 2000,
        delay: i * 200,
        easing: "ease-in-out",
      }
    ).onfinish = () => {
      sparkle.remove();
    };
  }
}

function addMagicalHoverEffects() {
  // Add hover effects to cards
  const cards = document.querySelectorAll(
    ".story-card, .skill-tree, .value-card, .faq-item, .contact-method"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
      createGlowEffect(this);
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });

  // Add hover effects to buttons
  const buttons = document.querySelectorAll(
    ".cta-button, .nav-link, .nav-back"
  );

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      createRippleEffect(this);
    });
  });
}

function createGlowEffect(element) {
  const glow = document.createElement("div");
  glow.style.position = "absolute";
  glow.style.top = "0";
  glow.style.left = "0";
  glow.style.right = "0";
  glow.style.bottom = "0";
  glow.style.borderRadius = getComputedStyle(element).borderRadius;
  glow.style.background =
    "linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 182, 193, 0.1))";
  glow.style.pointerEvents = "none";
  glow.style.zIndex = "-1";
  glow.style.opacity = "0";
  glow.style.transition = "opacity 0.3s ease";

  if (element.style.position !== "relative") {
    element.style.position = "relative";
  }

  element.appendChild(glow);

  // Fade in
  setTimeout(() => {
    glow.style.opacity = "1";
  }, 10);

  // Remove after hover
  setTimeout(() => {
    if (glow.parentElement) {
      glow.style.opacity = "0";
      setTimeout(() => {
        if (glow.parentElement) {
          glow.remove();
        }
      }, 300);
    }
  }, 2000);
}

function createRippleEffect(element) {
  const ripple = document.createElement("div");
  ripple.style.position = "absolute";
  ripple.style.width = "20px";
  ripple.style.height = "20px";
  ripple.style.background = "rgba(255, 255, 255, 0.6)";
  ripple.style.borderRadius = "50%";
  ripple.style.pointerEvents = "none";
  ripple.style.transform = "scale(0)";
  ripple.style.left = "50%";
  ripple.style.top = "50%";
  ripple.style.marginLeft = "-10px";
  ripple.style.marginTop = "-10px";

  if (element.style.position !== "relative") {
    element.style.position = "relative";
  }

  element.appendChild(ripple);

  ripple.animate(
    [
      { transform: "scale(0)", opacity: 1 },
      { transform: "scale(4)", opacity: 0 },
    ],
    {
      duration: 600,
      easing: "ease-out",
    }
  ).onfinish = () => {
    ripple.remove();
  };
}

function setupNavigationAnimations() {
  const navLinks = document.querySelectorAll(".nav-link, .nav-back");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Create magical transition effect
      createTransitionEffect();
    });
  });
}

function createTransitionEffect() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background =
    "linear-gradient(45deg, #87CEEB, #98D8E8, #F0E68C, #FFB6C1)";
  overlay.style.opacity = "0";
  overlay.style.zIndex = "9999";
  overlay.style.pointerEvents = "none";
  overlay.style.transition = "opacity 0.5s ease";

  document.body.appendChild(overlay);

  // Fade in
  setTimeout(() => {
    overlay.style.opacity = "0.8";
  }, 10);

  // Create sparkles during transition
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createTransitionSparkle();
    }, i * 50);
  }

  // Remove overlay after transition
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }, 300);
}

function createTransitionSparkle() {
  const sparkle = document.createElement("div");
  sparkle.textContent = "✨";
  sparkle.style.position = "fixed";
  sparkle.style.left = Math.random() * window.innerWidth + "px";
  sparkle.style.top = Math.random() * window.innerHeight + "px";
  sparkle.style.fontSize = "2rem";
  sparkle.style.color = "#FFD700";
  sparkle.style.pointerEvents = "none";
  sparkle.style.zIndex = "10000";

  document.body.appendChild(sparkle);

  sparkle.animate(
    [
      { opacity: 0, transform: "scale(0) rotate(0deg)" },
      { opacity: 1, transform: "scale(1) rotate(180deg)" },
      { opacity: 0, transform: "scale(0) rotate(360deg)" },
    ],
    {
      duration: 1500,
      easing: "ease-in-out",
    }
  ).onfinish = () => {
    sparkle.remove();
  };
}

function createSparkleEffects() {
  // Add periodic sparkles to the page
  setInterval(() => {
    const sparkle = document.createElement("div");
    sparkle.textContent = ["✨", "🌟", "💫", "⭐"][
      Math.floor(Math.random() * 4)
    ];
    sparkle.style.position = "fixed";
    sparkle.style.left = Math.random() * window.innerWidth + "px";
    sparkle.style.top = Math.random() * window.innerHeight + "px";
    sparkle.style.fontSize = "1.5rem";
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "1";
    sparkle.style.opacity = "0.7";

    document.body.appendChild(sparkle);

    sparkle.animate(
      [
        { opacity: 0, transform: "scale(0)" },
        { opacity: 0.7, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0)" },
      ],
      {
        duration: 3000,
        easing: "ease-in-out",
      }
    ).onfinish = () => {
      sparkle.remove();
    };
  }, 5000);
}

// Smooth scrolling for anchor links
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

// Add entrance animations for elements already in view
window.addEventListener("load", function () {
  const elementsInView = document.querySelectorAll(
    ".story-card, .skill-tree, .value-card"
  );

  elementsInView.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, index * 200);
  });
});

// Export for debugging
window.pageAnimations = {
  createLeafBurst,
  addSparkleToElement,
  createGlowEffect,
  createRippleEffect,
};
