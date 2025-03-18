const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const saltRounds = 10;

// Dummy user database (for testing)
const users = [];

// GET request (fetch users)
router.get("/", (req, res) => {
  res.json({ message: "Users page", users });
});

// Middleware to hash password
const hashPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      console.error("Error hashing password", err);
      return res.status(500).json({ error: "Error hashing password" });
    }
    req.body.hashedPassword = hash;
    next();
  });
};

// POST request (create user)
router.post("/", hashPassword, (req, res) => {
  const { firstName, email } = req.body;
  if (!firstName || !email) {
    return res.status(400).json({ error: "firstName and email are required" });
  }
  const newUser = {
    id: users.length + 1,
    firstName,
    email,
    hashedPassword: req.body.hashedPassword
  };
  users.push(newUser);
  res.status(201).json({ message: "User created", user: newUser });
});

module.exports = router;
