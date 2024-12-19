// Registration Form Submission
document.getElementById("registerForm").addEventListener("submit", function (e) {e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("message");

  // Clear previous messages
  message.textContent = "";

  // Validate passwords match
  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match!";
    message.style.color = "red";
    return;
  }

  // Validate CAPTCHA completion
  const recaptchaToken = grecaptcha.getResponse();
  if (!recaptchaToken) {
    message.textContent = "Please complete the CAPTCHA.";
    message.style.color = "red";
    return;
  }

  // Prepare user data
  const userData = { username, email, password, recaptchaToken };

  // Send registration request
  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
    .then(async (response) => {
      const result = await response.json();
      if (response.ok) {
        // Redirect to thanks page
        window.location.href = "thanks.html";
      } else {
        message.textContent = result.message;
        message.style.color = "red";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      message.textContent = "Server error. Please try again later.";
      message.style.color = "red";
    });
});



// Account Page Display
if (window.location.pathname.endsWith("account.html")) {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    document.getElementById("accountInfo").innerHTML = `
      <h2>Welcome, ${loggedInUser.username}!</h2>
      <p>Email: ${loggedInUser.email}</p>
    `;
  } else {
    window.location.href = "login.html"; // Redirect if not logged in
  }
}


// Toggle Password Visibility
document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const targetInput = document.getElementById(targetId);

    if (targetInput.type === "password") {
      targetInput.type = "text";
      this.querySelector(".material-icons").textContent = "visibility_off";
    } else {
      targetInput.type = "password";
      this.querySelector(".material-icons").textContent = "visibility";
    }
  });
});



