const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  variant: { type: Schema.Types.ObjectId, ref: "PrintVariant" },
  quantity: Number,
  price: Number
});

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  orderItems: [orderItemSchema],
  orderDate: Date,
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Paid", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },
  discount: { type: Schema.Types.ObjectId, ref: "Discount" },
  payment: { type: Schema.Types.ObjectId, ref: "Payment" },
  shipment: { type: Schema.Types.ObjectId, ref: "Shipment" }
});

module.exports = mongoose.model("Order", orderSchema);
