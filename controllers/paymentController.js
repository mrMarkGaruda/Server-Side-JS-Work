const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");

/**
 * Process Payment
 */
exports.processPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    const newPayment = new Payment({
      order: orderId,
      amount,
      paymentMethod
    });
    const savedPayment = await newPayment.save();
    // Link payment to order
    const order = await Order.findById(orderId);
    if(order){
      order.payment = savedPayment._id;
      await order.save();
    }
    res.status(201).json(savedPayment);
  } catch (err) {
    console.error("Error in processPayment:", err);
    res.status(500).json({ error: "Failed to process payment" });
  }
};
