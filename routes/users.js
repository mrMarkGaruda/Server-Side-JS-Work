const express = require("express");
const router = express.Router();

const {
  userSignUp,
  userLogIn,
  getAllUsers
} = require("../controllers/userController");

// GET all users (Admin usage, or general)
router.get("/", getAllUsers);

// POST sign up
router.post("/signup", userSignUp);

// POST log in
router.post("/login", userLogIn);

module.exports = router;
