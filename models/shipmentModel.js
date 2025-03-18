const mongoose = require("mongoose");
const { Schema } = mongoose;

const shipmentSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: "Order" },
  shippingAddress: String,
  status: {
    type: String,
    enum: ["InProgress", "Shipped", "Delivered", "Delayed", "Returned"],
    default: "InProgress"
  }
});

module.exports = mongoose.model("Shipment", shipmentSchema);
