const mongoose = require("mongoose");
const { Schema } = mongoose;

const artPrintSchema = new Schema({
  title: String,
  artist: String,
  price: Number,
  description: String
});

module.exports = mongoose.model("ArtPrint", artPrintSchema);
