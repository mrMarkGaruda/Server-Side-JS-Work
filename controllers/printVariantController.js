const PrintVariant = require("../models/printVariantModel");

/**
 * Create PrintVariant
 */
exports.createPrintVariant = async (req, res) => {
  try {
    const { artPrint, size, price, quantity } = req.body;
    const newVariant = new PrintVariant({ artPrint, size, price, quantity });
    const saved = await newVariant.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in createPrintVariant:", err);
    res.status(500).json({ error: "Failed to create PrintVariant" });
  }
};

/**
 * Get all PrintVariants
 */
exports.getAllPrintVariants = async (req, res) => {
  try {
    const variants = await PrintVariant.find().populate("artPrint");
    res.json(variants);
  } catch (err) {
    console.error("Error in getAllPrintVariants:", err);
    res.status(500).json({ error: "Failed to get PrintVariants" });
  }
};

/**
 * Calculate total price (demo method)
 */
exports.calcTotalPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await PrintVariant.findById(id).populate("artPrint");
    if (!variant) {
      return res.status(404).json({ error: "PrintVariant not found" });
    }
    // Demo formula: basePrice + (size * 10)
    const total = variant.price + variant.size * 10;
    res.json({ totalPrice: total });
  } catch (err) {
    console.error("Error in calcTotalPrice:", err);
    res.status(500).json({ error: "Failed to calculate price" });
  }
};
