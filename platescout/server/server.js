// server/server.js
// Assignment 6 — Express backend for PlateScout.
// This server stores users in memory for now.
// MongoDB, password hashing, JWTs, and protected routes come later.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware — mounted BEFORE any route.
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-platescout.vercel.app",
    /\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(express.json());

function validateInputs({ username, email, password }) {
  // Validate username
  if (!username || username.trim().length < 3) {
    return "Username must be at least 3 characters.";
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Email must be a valid format (text@text.text).";
  }

  // Validate password
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  // All fields valid
  return "";
}

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const validationError = validateInputs({ username, email, password });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken." });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hash });

    const token = jwt.sign({ username: newUser.username }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(201).json({
      message: "User registered successfully.",
      user: { username: newUser.username, email: newUser.email },
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({ error: `${field} already taken.` });
    }
    return res.status(500).json({ error: "Server error." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const valid = user && await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful.",
      user: { username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
});

app.post("/api/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token." });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Accept expired tokens — logout should always succeed
  }

  return res.status(200).json({ message: "Logged out." });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1,
  });
});

// 404 fallback — must come AFTER all routes so they match first.
app.use((_req, res) => {
  return res.status(404).json({
    error: "Route not found.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});