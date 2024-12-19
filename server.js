const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Your reCAPTCHA Secret Key
const RECAPTCHA_SECRET_KEY = "6LfLsZ4qAAAAAMhUGED9uhQ0fI2Ax9w3bmLGBMzG";

app.use(bodyParser.json());
app.use(express.static("public"));

// Path to the users file
const USERS_FILE = "users.json";

// Handle registration
app.post("/register", async (req, res) => {
  const { username, email, password, recaptchaToken } = req.body;

  // Verify CAPTCHA
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
  try {
    const captchaResponse = await axios.post(recaptchaUrl);
    if (!captchaResponse.data.success) {
      return res.status(400).json({ message: "CAPTCHA validation failed. Please try again." });
    }

    // Save user data
    const newUser = { username, email, password };
    fs.readFile(USERS_FILE, (err, data) => {
      let users = [];
      if (!err && data.length) {
        users = JSON.parse(data);
      }
      // Check if username or email already exists
      const existingUser = users.find(
        (user) => user.username === username || user.email === email
      );
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists." });
      }

      users.push(newUser);
      fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
        if (err) return res.status(500).json({ message: "Error saving user data." });
        res.status(200).json({ message: "User registered successfully!" });
      });
    });
  } catch (error) {
    console.error("Error validating CAPTCHA:", error);
    res.status(500).json({ message: "Server error while validating CAPTCHA." });
  }
});

// Handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile(USERS_FILE, (err, data) => {
    if (err) {
      console.error("Error reading users.json:", err);
      return res.status(500).json({ message: "Server error." });
    }

    let users = [];
    if (data.length) {
      users = JSON.parse(data);
    }

    // Find user by username and password
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      // Return the user's data (excluding password for security)
      const { password, ...userData } = user;
      res.status(200).json({ message: "Login successful.", user: userData });
    } else {
      res.status(401).json({ message: "Invalid username or password." });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});