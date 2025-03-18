const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const saltRounds = 10;

/**
 * Sign up (Create User)
 */
exports.userSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    // Hash password
    const hashed = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashed,
      role: role || "Customer", // default to Customer
      signUpTime: new Date(),
    });

    const savedUser = await newUser.save();
    // Return minimal user data
    res.status(201).json({
      message: "User created successfully",
      user: {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (err) {
    console.error("Error in userSignUp:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

/**
 * Log in
 */
exports.userLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Update login times
    user.lastLoginTime = user.loginTime || null;
    user.loginTime = new Date();
    await user.save();

    res.json({
      message: "Logged in successfully",
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Error in userLogIn:", err);
    res.status(500).json({ error: "Failed to log in" });
  }
};

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    res.status(500).json({ error: "Failed to get users" });
  }
};
