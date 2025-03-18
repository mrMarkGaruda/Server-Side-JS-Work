const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  print: { type: Schema.Types.ObjectId, ref: "ArtPrint" },
  quantity: Number,
  price: Number
});

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  cartItems: [cartItemSchema]
});

module.exports = mongoose.model("Cart", cartSchema);
