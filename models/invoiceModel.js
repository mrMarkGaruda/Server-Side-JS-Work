const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      description: String,
      quantity: Number,
      unitPrice: Number,
      total: Number
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Unpaid", "Paid", "Cancelled"],
    default: "Unpaid"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: Date
});

module.exports = mongoose.model("Invoice", invoiceSchema);