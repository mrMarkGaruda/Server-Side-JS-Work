const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const saltRounds = 10;

exports.userSignUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields (firstName, lastName, email, password) are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });
    const hashed = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ firstName, lastName, email, password: hashed });
    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id }, process.env.SECRET_TOKEN_KEY, { expiresIn: "24h" });
    res.status(201).json({
      message: "User created successfully",
      token,
      user: { firstName: savedUser.firstName, lastName: savedUser.lastName, email: savedUser.email }
    });
  } catch (error) {
    next(error);
  }
};

exports.userLogIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });
    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(401).json({ error: "Invalid credentials" });
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: foundUser._id }, process.env.SECRET_TOKEN_KEY, { expiresIn: "24h" });
    res.json({
      message: "Logged in successfully",
      token,
      user: { firstName: foundUser.firstName, lastName: foundUser.lastName, email: foundUser.email }
    });
  } catch (error) {
    next(error);
  }
};

exports.userUpdate = async (req, res, next) => {
  try {
    const userId = req.userId; // Provided by auth middleware
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded or wrong file format" });
    }
    const fileUrl = req.protocol + "://" + req.get("host") + "/" + req.file.processedPath;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { imageUrl: fileUrl },
      { new: true, runValidators: true }
    );
    res.json({
      message: "User updated successfully",
      imageUrl: updatedUser.imageUrl
    });
  } catch (error) {
    next(error);
  }
};
