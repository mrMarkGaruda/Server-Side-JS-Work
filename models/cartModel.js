const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  variant: { type: Schema.Types.ObjectId, ref: "PrintVariant" },
  quantity: Number,
  price: Number
});

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  cartItems: [cartItemSchema]
});

module.exports = mongoose.model("Cart", cartSchema);
