const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, enum: ["Customer", "Admin"], default: "Customer" },
    imageUrl: { type: String }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

userSchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique. Value: `{VALUE}`" });

module.exports = mongoose.model("User", userSchema);
