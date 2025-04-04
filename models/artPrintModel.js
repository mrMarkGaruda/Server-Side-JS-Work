const mongoose = require("mongoose");
const { Schema } = mongoose;

const artPrintSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String, default: "/images/default-art.jpg" }
}, { timestamps: true });

module.exports = mongoose.model("ArtPrint", artPrintSchema);
