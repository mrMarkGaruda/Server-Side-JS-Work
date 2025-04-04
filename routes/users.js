const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");
const auth = require("../middleware/auth");

const { userSignUp, userLogIn, userUpdate } = require("../controllers/userController");

// POST /api/users/signup: Create a new user
router.post("/signup", userSignUp);

// POST /api/users/login: Log in and receive a JWT token
router.post("/login", userLogIn);

// PUT /api/users/userUpdate: Update user profile image (protected route)
router.put("/userUpdate", auth, upload.single("image"), sharpMiddleware(), userUpdate);

module.exports = router;
