let currentTheme = "light"; // Note: localStorage not available in artifacts
let formData = {};
let totalFields = 13; // Updated required field count

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";
const API_ENDPOINTS = {
  userinfo: `${API_BASE_URL}/userinfo/`,
};

// Initialize theme
document.documentElement.setAttribute("data-theme", currentTheme);
updateThemeIcon();

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  // localStorage.setItem("theme", currentTheme); // Not available in artifacts
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById("theme-icon");
  icon.textContent = currentTheme === "light" ? "🌙" : "☀️";
}

function goBack() {
  window.history.back();
}

// New function to handle file upload display
function handleFileUpload(input) {
  const fileUploadLabel = input.parentNode.querySelector(".file-upload-label");
  const fileUploadText = fileUploadLabel.querySelector(".file-upload-text");

  if (input.files && input.files[0]) {
    const file = input.files[0];
    const fileName = file.name;
    const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB

    // Update the display to show the selected file
    fileUploadText.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-bottom: 8px; color: var(--primary-color);">
        <path d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 3L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div style="color: var(--primary-color); font-weight: 500;">${fileName}</div>
      <small style="color: var(--text-muted); margin-top: 4px">${fileSize} MB • Click to change</small>
    `;

    // Add a class to indicate file is selected
    fileUploadLabel.classList.add("file-selected");
  } else {
    // Reset to original state if no file is selected
    fileUploadText.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-bottom: 8px">
        <path d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 3L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div>Drop your resume here or click to browse</div>
      <small style="color: var(--text-muted); margin-top: 4px">PDF, DOC, or DOCX (Max 5MB)</small>
    `;

    fileUploadLabel.classList.remove("file-selected");
  }
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let message = "";

  field.classList.remove("valid", "invalid");

  // Handle file input separately
  if (field.type === "file") {
    handleFileUpload(field);

    if (field.files && field.files[0]) {
      const file = field.files[0];
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        isValid = false;
        message = "File size must be less than 5MB";
      }
      // Check file type
      const allowedTypes = [".pdf", ".doc", ".docx"];
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        isValid = false;
        message = "Only PDF, DOC, and DOCX files are allowed";
      }
    }
  } else {
    // Rest of your existing validation logic for other fields
    if (field.required && !value) {
      isValid = false;
      message = "This field is required";
    }

    switch (fieldName) {
      case "email":
        if (value && !isValidEmail(value)) {
          isValid = false;
          message = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (value && !isValidPhone(value)) {
          isValid = false;
          message = "Please enter a valid phone number";
        }
        break;
      case "portfolio":
        if (value && !isValidURL(value)) {
          isValid = false;
          message = "Please enter a valid URL";
        }
        break;
      case "why-join":
        if (value && value.length < 50) {
          isValid = false;
          message = "Please provide at least 50 characters";
        }
        break;
      case "experience-description":
        if (value && value.length < 50) {
          isValid = false;
          message = "Please provide at least 50 characters";
        }
        break;
    }
  }

  if (
    isValid &&
    (value || (field.type === "file" && field.files && field.files[0]))
  ) {
    field.classList.add("valid");
  } else if (!isValid) {
    field.classList.add("invalid");
  }

  const messageElement = field.parentNode.querySelector(".validation-message");
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.classList.toggle("show", !isValid);
  }

  updateProgress();
  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?\d{10,}$/;
  return phoneRegex.test(phone);
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function updateProgress() {
  const requiredFields = document.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let completedFields = 0;

  requiredFields.forEach((field) => {
    if (field.value.trim() && !field.classList.contains("invalid")) {
      completedFields++;
    }
  });

  const progress = Math.round((completedFields / totalFields) * 100);
  document.getElementById("progressFill").style.width = progress + "%";
  document.getElementById(
    "progressText"
  ).textContent = `Complete your application (${progress}% done)`;
}

async function sendToBackend(formData) {
  try {
    console.log("Sending data to backend...");

    const response = await fetch(API_ENDPOINTS.userinfo, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API Error (HTTP):", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Try to parse as JSON
    const contentType = response.headers.get("content-type");
    const isJSON = contentType && contentType.includes("application/json");

    let result;
    if (isJSON) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    console.log("Backend response:", result);
    return result;
  } catch (error) {
    console.error("Backend API Error (Network/Parse):", error);
    throw error;
  }
}

function clearDraft() {
  // Function to clear any saved draft data
  // You can implement this if you have draft saving functionality
  console.log("Clearing draft data...");
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formDataObj = new FormData(form);
  const submitButton = document.getElementById("submitButton");
  const submitText = document.getElementById("submitText");

  // Validate all fields first
  let isFormValid = true;
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    const firstInvalid = form.querySelector(".invalid");
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus();
    }
    return;
  }

  // Prepare form data for backend
  const firstName = form.querySelector('[name="firstName"]').value.trim();
  const lastName = form.querySelector('[name="lastName"]').value.trim();
  formDataObj.append("full_name", `${firstName} ${lastName}`);

  // Map field names to backend expected names
  formDataObj.set(
    "whatsapp_number",
    form.querySelector('[name="phone"]').value.trim()
  );
  formDataObj.set(
    "experience_level",
    form.querySelector('[name="experience"]').value.trim()
  );
  formDataObj.set(
    "software_tools_used",
    form.querySelector('[name="software"]').value.trim()
  );
  formDataObj.set(
    "portfolio_link",
    form.querySelector('[name="portfolio"]').value.trim()
  );
  formDataObj.set(
    "reason_to_join",
    form.querySelector('[name="why-join"]').value.trim()
  );
  formDataObj.set(
    "weekly_availability",
    form.querySelector('[name="availability"]').value.trim()
  );

  // Parse and send numeric years_of_experience
  formDataObj.set(
    "years_of_experience",
    form.querySelector('[name="experience-description"]').value.trim()
  );

  formDataObj.set(
    "best_video_type",
    form.querySelector('[name="specialization"]').value.trim()
  );

  // Add missing backend-required fields
  if (!formDataObj.has("best_video_type"))
    formDataObj.append("best_video_type", "generic");
  if (!formDataObj.has("expected_price"))
    formDataObj.append("expected_price", "negotiable");

  formDataObj.set(
    "additional_info",
    form.querySelector('[name="additional-info"]').value.trim()
  );

  // Show loading state
  submitButton.classList.add("loading");
  submitButton.disabled = true;
  submitText.textContent = "Submitting...";

  try {
    // Send data to backend
    const result = await sendToBackend(formDataObj);

    // Success handling
    console.log("Form submitted successfully:", result);

    // Clear form or redirect
    clearDraft();

    // Redirect to confirmation page
    window.location.href = "confirmation.html";

  } catch (error) {
    console.error("Form submission error:", error);

    // Show error message to user
    showErrorMessage("Failed to submit application. Please try again.");
  } finally {
    // Reset button state
    submitButton.classList.remove("loading");
    submitButton.disabled = false;
    submitText.textContent = "Submit Application";
  }
}

// Utility function for showing error messages only
function showErrorMessage(message) {
  // Create or show error notification
  const notification = createNotification(message, "error");
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

function createNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    word-wrap: break-word;
    background-color: #ef4444;
  `;
  notification.textContent = message;

  // Add click to dismiss
  notification.addEventListener("click", () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });

  return notification;
}

// Add CSS animation for notifications
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .notification {
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .notification:hover {
    opacity: 0.9;
  }
`;
document.head.appendChild(style);

// Initialize form validation on page load
document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners to all form inputs
  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => validateField(input));

    // Special handling for file inputs
    if (input.type === "file") {
      input.addEventListener("change", () => validateField(input));
    }
  });

  // Initialize progress
  updateProgress();

  // Add form submit handler
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
});