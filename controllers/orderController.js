const Order = require("../models/orderModel");
const Discount = require("../models/discountModel");

/**
 * Place an order
 */
exports.placeOrder = async (req, res) => {
  try {
    const { userId, orderItems, discountCode } = req.body;
    // Create order
    const newOrder = new Order({
      user: userId,
      orderItems,
      orderDate: new Date(),
      orderStatus: "Pending"
    });
    // If discount code, try applying discount
    if(discountCode){
      const discount = await Discount.findOne({ discountCode });
      if(discount){
        newOrder.discount = discount._id;
      }
    }
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in placeOrder:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

/**
 * Get user's orders
 */
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId;
    if(!userId) return res.status(400).json({ error: "userId required" });
    const orders = await Order.find({ user: userId })
      .populate("orderItems.variant")
      .populate("discount")
      .populate("payment")
      .populate("shipment");
    res.json(orders);
  } catch (err) {
    console.error("Error in getUserOrders:", err);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updated = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
    if(!updated){
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error in updateOrderStatus:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
