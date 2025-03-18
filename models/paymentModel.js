const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: "Order" },
  amount: Number,
  paymentMethod: {
    type: String,
    enum: ["CreditCard", "PayPal", "BankTransfer"],
    default: "CreditCard"
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
