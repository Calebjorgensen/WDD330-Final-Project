document.getElementById("loginForm").addEventListener("submit", async function (e) {e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  // Clear previous messages
  message.textContent = "";

  // Check if username and password are provided
  if (!username || !password) {
    message.textContent = "Both username and password are required.";
    message.style.color = "red";
    return;
  }

  // Get the reCAPTCHA response token
  const recaptchaToken = grecaptcha.getResponse();

  // Check if the reCAPTCHA is completed
  if (!recaptchaToken) {
    message.textContent = "Please complete the CAPTCHA.";
    message.style.color = "red";
    return;
  }

  // Send login request to the server
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, recaptchaToken }),
    });

    const result = await response.json();

    if (response.ok) {
      // Save user data in session storage and redirect to account page
      sessionStorage.setItem("loggedInUser", JSON.stringify(result.user));
      window.location.href = "account.html";
    } else {
      message.textContent = result.message;
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Login error:", error);
    message.textContent = "Server error. Please try again later.";
    message.style.color = "red";
  }
});
