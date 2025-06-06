let currentTheme = localStorage.getItem("theme") || "light";
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
  localStorage.setItem("theme", currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById("theme-icon");
  icon.textContent = currentTheme === "light" ? "🌙" : "☀️";
}

function goBack() {
  window.history.back();
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let message = "";

  field.classList.remove("valid", "invalid");

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
      if (value && isNaN(parseInt(value))) {
        isValid = false;
        message = "Please enter a numeric value";
      }
      break;
  }

  if (isValid && value) {
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
  const experienceValue = parseInt(
    form.querySelector('[name="experience-description"]').value.trim()
  );
  formDataObj.set(
    "years_of_experience",
    isNaN(experienceValue) ? "0" : experienceValue.toString()
  );

  // Add missing backend-required fields
  if (!formDataObj.has("best_video_type"))
    formDataObj.append("best_video_type", "generic");
  if (!formDataObj.has("expected_price"))
    formDataObj.append("expected_price", "negotiable");

  // Show loading state
  submitButton.classList.add("loading");
  submitButton.disabled = true;
  submitText.textContent = "Submitting...";

  try {
    console.log("Starting form submission...");

    const response = await sendToBackend(formDataObj);

    console.log("Form submitted successfully:", response);

    // Check if we have a success message
    if (response && (response.message || typeof response === "string")) {
      // Success! Redirect to confirmation page
      window.location.href = "confirmation.html";
      clearDraft();
    } else {
      // Unexpected response format
      console.warn("Unexpected response format:", response);
      alert(
        "Form submitted but received unexpected response. Please contact support if needed."
      );
    }
  } catch (error) {
    console.error("Submission error:", error);

    // More user-friendly error messages
    let errorMessage = "There was an error submitting your application.";

    if (error.message) {
      if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error: Please check your internet connection and try again.";
      } else if (error.message.includes("HTTP 400")) {
        errorMessage =
          "Invalid form data. Please check your inputs and try again.";
      } else if (error.message.includes("HTTP 500")) {
        errorMessage =
          "Server error. Please try again later or contact support.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }

    alert(errorMessage);
  } finally {
    // Reset button state
    submitButton.classList.remove("loading");
    submitButton.disabled = false;
    submitText.textContent = "Submit Application";
  }
}
