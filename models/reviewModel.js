const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  artPrint: { type: Schema.Types.ObjectId, ref: "ArtPrint" },
  rating: Number,
  reviewText: String,
  creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
