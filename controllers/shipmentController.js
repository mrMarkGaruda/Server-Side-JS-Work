const Shipment = require("../models/shipmentModel");
const Order = require("../models/orderModel");

/**
 * Ship Order
 */
exports.shipOrder = async (req, res) => {
  try {
    const { orderId, shippingAddress } = req.body;
    const newShipment = new Shipment({
      order: orderId,
      shippingAddress,
      status: "InProgress"
    });
    const savedShipment = await newShipment.save();

    // Update order with shipment
    const order = await Order.findById(orderId);
    if(order){
      order.shipment = savedShipment._id;
      order.orderStatus = "Shipped"; // or "Processing"
      await order.save();
    }

    res.status(201).json(savedShipment);
  } catch (err) {
    console.error("Error in shipOrder:", err);
    res.status(500).json({ error: "Failed to ship order" });
  }
};

/**
 * Update shipment status
 */
exports.updateShipmentStatus = async (req, res) => {
  try {
    const { shipmentId, newStatus } = req.body;
    const updated = await Shipment.findByIdAndUpdate(
      shipmentId,
      { status: newStatus },
      { new: true }
    );
    if(!updated){
      return res.status(404).json({ error: "Shipment not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error in updateShipmentStatus:", err);
    res.status(500).json({ error: "Failed to update shipment status" });
  }
};
