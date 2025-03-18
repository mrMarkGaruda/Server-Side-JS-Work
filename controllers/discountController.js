const Discount = require("../models/discountModel");

/**
 * Create discount
 */
exports.createDiscount = async (req, res) => {
  try {
    const { discountCode, percentage } = req.body;
    const newDiscount = new Discount({ discountCode, percentage });
    const saved = await newDiscount.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in createDiscount:", err);
    res.status(500).json({ error: "Failed to create discount" });
  }
};

/**
 * Apply discount to an order (demo usage: see orderController)
 */
exports.applyDiscount = async (req, res) => {
  try {
    // This would normally be used in order creation
    const { discountCode } = req.body;
    const discount = await Discount.findOne({ discountCode });
    if(!discount){
      return res.status(404).json({ error: "Invalid discount code" });
    }
    res.json({ message: "Discount found", discount });
  } catch (err) {
    console.error("Error in applyDiscount:", err);
    res.status(500).json({ error: "Failed to apply discount" });
  }
};
