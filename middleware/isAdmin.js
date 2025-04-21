// middleware/isAdmin.js
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    // Assumes auth middleware has already run and set req.userId
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if user has admin role
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admin rights required" });
    }
    
    req.isAdmin = true;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Server error checking admin rights" });
  }
};