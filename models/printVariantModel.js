const mongoose = require("mongoose");
const { Schema } = mongoose;

const printVariantSchema = new Schema({
  artPrint: { type: Schema.Types.ObjectId, ref: "ArtPrint" },
  size: Number,       // e.g. 8 (8x10), 16 (16x20), etc.
  price: Number,
  quantity: Number
});

module.exports = mongoose.model("PrintVariant", printVariantSchema);
