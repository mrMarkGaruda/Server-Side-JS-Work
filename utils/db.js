const mongoose = require("mongoose");

const mongoConnection = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/artprintstore";

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoConnection);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("No DB connection!", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
