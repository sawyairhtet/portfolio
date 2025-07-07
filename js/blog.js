// Blog functionality for the portfolio website
// Handles filtering, loading, and interactive features

document.addEventListener("DOMContentLoaded", function () {
  initializeBlogFunctionality();
});

function initializeBlogFunctionality() {
  // Initialize filter functionality
  initializeFilters();

  // Initialize load more functionality
  initializeLoadMore();

  // Initialize blog post animations
  initializeBlogAnimations();

  // Initialize search functionality (if needed)
  // initializeSearch();
}

function initializeFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const blogPosts = document.querySelectorAll(".blog-post");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Filter posts
      filterPosts(filter, blogPosts);
    });
  });
}

function filterPosts(filter, posts) {
  posts.forEach((post) => {
    const category = post.getAttribute("data-category");

    if (filter === "all" || category === filter) {
      post.style.display = "block";
      post.style.opacity = "0";
      post.style.transform = "translateY(20px)";

      // Animate in
      setTimeout(() => {
        post.style.transition = "all 0.3s ease";
        post.style.opacity = "1";
        post.style.transform = "translateY(0)";
      }, 100);
    } else {
      post.style.transition = "all 0.3s ease";
      post.style.opacity = "0";
      post.style.transform = "translateY(-20px)";

      setTimeout(() => {
        post.style.display = "none";
      }, 300);
    }
  });
}

function initializeLoadMore() {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  const blogGrid = document.querySelector(".blog-grid");

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      loadMorePosts(blogGrid);
    });
  }
}

function loadMorePosts(blogGrid) {
  const loadMoreBtn = document.querySelector(".load-more-btn");

  // Show loading state
  loadMoreBtn.textContent = "Loading...";
  loadMoreBtn.disabled = true;

  // Simulate loading delay
  setTimeout(() => {
    // In a real application, you would fetch more posts from an API
    // For now, we'll just show a message or duplicate existing posts

    // Reset button
    loadMoreBtn.textContent = "Load More Posts";
    loadMoreBtn.disabled = false;

    // You could add logic here to:
    // 1. Fetch more posts from an API
    // 2. Append new posts to the grid
    // 3. Update the post count

    console.log("Load more functionality - ready for API integration");
  }, 1000);
}

function initializeBlogAnimations() {
  // Add scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe blog posts
  const blogPosts = document.querySelectorAll(".blog-post");
  blogPosts.forEach((post) => {
    observer.observe(post);
  });
}

// Optional: Search functionality
function initializeSearch() {
  const searchInput = document.querySelector(".blog-search-input");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const blogPosts = document.querySelectorAll(".blog-post");

      blogPosts.forEach((post) => {
        const title = post
          .querySelector(".post-title a")
          .textContent.toLowerCase();
        const excerpt = post
          .querySelector(".post-excerpt")
          .textContent.toLowerCase();

        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
          post.style.display = "block";
        } else {
          post.style.display = "none";
        }
      });
    });
  }
}

// Blog post hover effects
document.addEventListener("DOMContentLoaded", function () {
  const blogPosts = document.querySelectorAll(".blog-post");

  blogPosts.forEach((post) => {
    post.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    post.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
});

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    .blog-post {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .blog-post.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .blog-post:nth-child(1) { transition-delay: 0.1s; }
    .blog-post:nth-child(2) { transition-delay: 0.2s; }
    .blog-post:nth-child(3) { transition-delay: 0.3s; }
    .blog-post:nth-child(4) { transition-delay: 0.4s; }
    .blog-post:nth-child(5) { transition-delay: 0.5s; }
    .blog-post:nth-child(6) { transition-delay: 0.6s; }
    
    .filter-btn {
        position: relative;
        overflow: hidden;
    }
    
    .filter-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.1), transparent);
        transition: left 0.5s ease;
    }
    
    .filter-btn:hover::before {
        left: 100%;
    }
    
    .load-more-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .blog-grid {
        opacity: 0;
        animation: fadeInGrid 0.8s ease forwards;
        animation-delay: 0.5s;
    }
    
    @keyframes fadeInGrid {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize blog posts animation on page load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const blogPosts = document.querySelectorAll(".blog-post");
    blogPosts.forEach((post) => {
      post.classList.add("animate-in");
    });
  }, 200);
});
