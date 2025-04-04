const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(403).json({ error: "No token provided!" });
    const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
    if (!token)
      return res.status(403).json({ error: "No token provided!" });
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized access: " + error.message });
  }
};
