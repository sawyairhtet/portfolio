// Contact form handling with magical effects
document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById("contactForm");
  const formInputs = document.querySelectorAll(
    ".form-input, .form-select, .form-textarea"
  );

  if (!form) return;

  // Add magical input effects
  setupFormInputEffects(formInputs);

  // Setup form validation
  setupFormValidation(form);

  // Handle form submission
  form.addEventListener("submit", handleFormSubmission);

  console.log("📝 Contact form initialized with magic!");
}

function setupFormInputEffects(inputs) {
  inputs.forEach((input) => {
    // Add focus effects
    input.addEventListener("focus", function () {
      createInputSparkle(this);
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
      validateField(this);
    });

    // Add typing effects
    input.addEventListener("input", function () {
      if (this.value.length > 0) {
        this.parentElement.classList.add("has-content");

        // Create typing sparkles occasionally
        if (Math.random() < 0.1) {
          createTypingSparkle(this);
        }
      } else {
        this.parentElement.classList.remove("has-content");
      }

      // Real-time validation
      clearTimeout(this.validationTimeout);
      this.validationTimeout = setTimeout(() => {
        validateField(this);
      }, 500);
    });
  });
}

function createInputSparkle(input) {
  const rect = input.getBoundingClientRect();
  const sparkle = document.createElement("div");

  sparkle.textContent = "✨";
  sparkle.style.position = "fixed";
  sparkle.style.left = rect.right - 30 + "px";
  sparkle.style.top = rect.top + rect.height / 2 + "px";
  sparkle.style.fontSize = "1.2rem";
  sparkle.style.pointerEvents = "none";
  sparkle.style.zIndex = "1000";
  sparkle.style.color = "#FFD700";

  document.body.appendChild(sparkle);

  sparkle.animate(
    [
      { opacity: 0, transform: "scale(0) rotate(0deg)" },
      { opacity: 1, transform: "scale(1) rotate(180deg)" },
      { opacity: 0, transform: "scale(0) rotate(360deg)" },
    ],
    {
      duration: 1500,
      easing: "ease-out",
    }
  ).onfinish = () => {
    sparkle.remove();
  };
}

function createTypingSparkle(input) {
  const rect = input.getBoundingClientRect();
  const sparkle = document.createElement("div");

  sparkle.textContent = ["💫", "⭐", "🌟"][Math.floor(Math.random() * 3)];
  sparkle.style.position = "fixed";
  sparkle.style.left = rect.left + Math.random() * rect.width + "px";
  sparkle.style.top = rect.top - 10 + "px";
  sparkle.style.fontSize = "0.8rem";
  sparkle.style.pointerEvents = "none";
  sparkle.style.zIndex = "1000";

  document.body.appendChild(sparkle);

  sparkle.animate(
    [
      { opacity: 1, transform: "translateY(0) scale(1)" },
      { opacity: 0, transform: "translateY(-30px) scale(0)" },
    ],
    {
      duration: 1000,
      easing: "ease-out",
    }
  ).onfinish = () => {
    sparkle.remove();
  };
}

function setupFormValidation(form) {
  // Custom validation messages
  const validationMessages = {
    name: {
      required: "✨ Please tell me your magical name!",
      minLength: "🌟 Your name needs at least 2 characters",
    },
    email: {
      required: "📧 I need your email to send you replies!",
      invalid: "🔮 That email doesn't look quite right",
    },
    subject: {
      required: "🎯 Please choose what this message is about",
    },
    message: {
      required: "💌 Please share your thoughts with me!",
      minLength: "📝 Your message needs at least 10 characters",
    },
  };

  form.validationMessages = validationMessages;
}

function validateField(field) {
  const fieldName = field.name;
  const value = field.value.trim();
  const messages = field.form.validationMessages[fieldName];

  if (!messages) return true;

  // Remove existing validation feedback
  removeValidationFeedback(field);

  let isValid = true;
  let message = "";

  // Required validation
  if (field.hasAttribute("required") && !value) {
    isValid = false;
    message = messages.required;
  }
  // Email validation
  else if (field.type === "email" && value && !isValidEmail(value)) {
    isValid = false;
    message = messages.invalid;
  }
  // Minimum length validation
  else if (
    messages.minLength &&
    value.length < (fieldName === "name" ? 2 : 10)
  ) {
    isValid = false;
    message = messages.minLength;
  }

  if (!isValid) {
    showValidationError(field, message);
  } else {
    showValidationSuccess(field);
  }

  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function removeValidationFeedback(field) {
  const parent = field.parentElement;
  const existingFeedback = parent.querySelector(".validation-feedback");
  if (existingFeedback) {
    existingFeedback.remove();
  }
  parent.classList.remove("validation-error", "validation-success");
}

function showValidationError(field, message) {
  const parent = field.parentElement;
  parent.classList.add("validation-error");

  const feedback = document.createElement("div");
  feedback.className = "validation-feedback validation-error-message";
  feedback.textContent = message;
  feedback.style.color = "#FF6B6B";
  feedback.style.fontSize = "0.9rem";
  feedback.style.marginTop = "5px";
  feedback.style.fontWeight = "600";

  parent.appendChild(feedback);

  // Add shake animation to field
  field.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(0)" },
    ],
    {
      duration: 400,
      easing: "ease-in-out",
    }
  );
}

function showValidationSuccess(field) {
  const parent = field.parentElement;
  parent.classList.add("validation-success");

  // Create success sparkle
  createValidationSparkle(field, "✅");
}

function createValidationSparkle(field, emoji) {
  const rect = field.getBoundingClientRect();
  const sparkle = document.createElement("div");

  sparkle.textContent = emoji;
  sparkle.style.position = "fixed";
  sparkle.style.left = rect.right - 25 + "px";
  sparkle.style.top = rect.top + rect.height / 2 - 10 + "px";
  sparkle.style.fontSize = "1.2rem";
  sparkle.style.pointerEvents = "none";
  sparkle.style.zIndex = "1000";

  document.body.appendChild(sparkle);

  sparkle.animate(
    [
      { opacity: 0, transform: "scale(0)" },
      { opacity: 1, transform: "scale(1.2)" },
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(0)" },
    ],
    {
      duration: 2000,
      easing: "ease-in-out",
    }
  ).onfinish = () => {
    sparkle.remove();
  };
}

function handleFormSubmission(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const formInputs = form.querySelectorAll(
    ".form-input, .form-select, .form-textarea"
  );

  // Validate all fields
  let isFormValid = true;
  formInputs.forEach((input) => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    showFormError(
      "Please fix the errors above before sending your message! ✨"
    );
    return;
  }

  // Show loading state
  showFormLoading(form);

  // Simulate form submission (replace with actual submission logic)
  simulateFormSubmission(formData)
    .then(() => {
      showFormSuccess(form);
      createSuccessAnimation();
    })
    .catch((error) => {
      showFormError("Oops! Something magical went wrong. Please try again! 🪄");
      hideFormLoading(form);
    });
}

function showFormLoading(form) {
  const submitButton = form.querySelector(".submit-button");
  const buttonText = submitButton.querySelector(".button-text");

  submitButton.disabled = true;
  submitButton.style.opacity = "0.7";
  buttonText.textContent = "🌟 Sending magical message...";

  // Add loading sparkles
  createLoadingSparkles(submitButton);
}

function hideFormLoading(form) {
  const submitButton = form.querySelector(".submit-button");
  const buttonText = submitButton.querySelector(".button-text");

  submitButton.disabled = false;
  submitButton.style.opacity = "1";
  buttonText.textContent = "🕊️ Send My Message";
}

function createLoadingSparkles(element) {
  const rect = element.getBoundingClientRect();

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.textContent = "✨";
      sparkle.style.position = "fixed";
      sparkle.style.left = rect.left + Math.random() * rect.width + "px";
      sparkle.style.top = rect.top + Math.random() * rect.height + "px";
      sparkle.style.fontSize = "1rem";
      sparkle.style.pointerEvents = "none";
      sparkle.style.zIndex = "1000";
      sparkle.style.color = "#FFD700";

      document.body.appendChild(sparkle);

      sparkle.animate(
        [
          { opacity: 0, transform: "scale(0)" },
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0)" },
        ],
        {
          duration: 1500,
          easing: "ease-in-out",
        }
      ).onfinish = () => {
        sparkle.remove();
      };
    }, i * 200);
  }
}

function simulateFormSubmission(formData) {
  // This is a simulation - replace with actual form submission logic
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Log form data for demonstration
      console.log("Form submitted with data:", {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        newsletter: formData.get("newsletter"),
      });

      // Simulate success (you could also simulate failure)
      resolve();
    }, 2000);
  });
}

function showFormSuccess(form) {
  const formContainer = form.parentElement;
  const successDiv = document.getElementById("formSuccess");

  // Hide form and show success message
  form.style.display = "none";
  successDiv.style.display = "block";

  // Animate success message
  successDiv.animate(
    [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 800,
      easing: "ease-out",
    }
  );
}

function createSuccessAnimation() {
  // Create celebration sparkles
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.textContent = ["🎉", "✨", "🌟", "💫", "⭐"][
        Math.floor(Math.random() * 5)
      ];
      sparkle.style.position = "fixed";
      sparkle.style.left = Math.random() * window.innerWidth + "px";
      sparkle.style.top = Math.random() * window.innerHeight + "px";
      sparkle.style.fontSize = "2rem";
      sparkle.style.pointerEvents = "none";
      sparkle.style.zIndex = "1000";

      document.body.appendChild(sparkle);

      sparkle.animate(
        [
          { opacity: 0, transform: "scale(0) rotate(0deg)" },
          { opacity: 1, transform: "scale(1) rotate(180deg)" },
          { opacity: 0, transform: "scale(0) rotate(360deg)" },
        ],
        {
          duration: 2000,
          easing: "ease-out",
        }
      ).onfinish = () => {
        sparkle.remove();
      };
    }, i * 100);
  }
}

function showFormError(message) {
  // Create or update error message
  let errorDiv = document.querySelector(".form-error-message");

  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "form-error-message";
    errorDiv.style.cssText = `
            background: rgba(255, 107, 107, 0.1);
            border: 3px solid #FF6B6B;
            border-radius: 20px;
            padding: 20px;
            margin: 20px 0;
            color: #FF6B6B;
            font-weight: 600;
            text-align: center;
        `;

    const form = document.getElementById("contactForm");
    form.parentElement.insertBefore(errorDiv, form);
  }

  errorDiv.textContent = message;

  // Animate error message
  errorDiv.animate(
    [
      { opacity: 0, transform: "translateY(-10px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 400,
      easing: "ease-out",
    }
  );

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-10px)" },
        ],
        {
          duration: 400,
          easing: "ease-in",
        }
      ).onfinish = () => {
        errorDiv.remove();
      };
    }
  }, 5000);
}

// Add CSS for validation states
const validationStyles = document.createElement("style");
validationStyles.textContent = `
    .validation-error .form-input,
    .validation-error .form-select,
    .validation-error .form-textarea {
        border-color: #FF6B6B !important;
        box-shadow: 0 0 15px rgba(255, 107, 107, 0.3) !important;
    }
    
    .validation-success .form-input,
    .validation-success .form-select,
    .validation-success .form-textarea {
        border-color: #90EE90 !important;
        box-shadow: 0 0 15px rgba(144, 238, 144, 0.3) !important;
    }
    
    .focused .form-input,
    .focused .form-select,
    .focused .form-textarea {
        transform: translateY(-2px);
    }
    
    .has-content .form-magic {
        opacity: 1;
        transform: scale(1);
    }
`;
document.head.appendChild(validationStyles);

// Export for debugging
window.contactForm = {
  validateField,
  createInputSparkle,
  createSuccessAnimation,
  showFormError,
};
