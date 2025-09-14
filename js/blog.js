// Simplified blog functionality - no overengineering
// Just essential features for a clean blog experience

document.addEventListener("DOMContentLoaded", function () {
  // Simple fade-in animation for blog posts
  const blogPosts = document.querySelectorAll(".blog-post");

  // Add animation classes
  blogPosts.forEach((post, index) => {
    post.style.opacity = "0";
    post.style.transform = "translateY(20px)";
    post.style.transition = "all 0.6s ease";

    // Stagger the animations
    setTimeout(() => {
      post.style.opacity = "1";
      post.style.transform = "translateY(0)";
    }, index * 100);
  });

  // Simple hover effects for blog posts
  blogPosts.forEach((post) => {
    post.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
    });

    post.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Smooth scroll for any internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Set current year in footer
  function setCopyrightYear() {
    const yearElement = document.querySelector(".copyright");
    if (yearElement) {
      yearElement.textContent = `© ${new Date().getFullYear()} Saw Ye Htet. All rights reserved.`;
    }
  }
  setCopyrightYear();

  console.log('Blog loaded - Simple and clean');
});
