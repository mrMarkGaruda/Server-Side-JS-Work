const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Customer", "Admin"], default: "Customer" },
  signUpTime: { type: Date, default: Date.now },
  loginTime: Date,
  lastLoginTime: Date
});

module.exports = mongoose.model("User", userSchema);
