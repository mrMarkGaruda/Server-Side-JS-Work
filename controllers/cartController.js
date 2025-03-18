const Cart = require("../models/cartModel");
const PrintVariant = require("../models/printVariantModel");

/**
 * Get user's cart
 */
exports.getCart = async (req, res) => {
  try {
    // For demo, assume userId is passed in query or you handle auth
    const userId = req.query.userId;
    if(!userId) return res.status(400).json({ error: "userId required" });

    const cart = await Cart.findOne({ user: userId }).populate("cartItems.variant");
    res.json(cart || { cartItems: [] });
  } catch (err) {
    console.error("Error in getCart:", err);
    res.status(500).json({ error: "Failed to get cart" });
  }
};

/**
 * Add item to cart
 */
exports.addItemToCart = async (req, res) => {
  try {
    const { userId, variantId, quantity } = req.body;
    if(!userId || !variantId || !quantity){
      return res.status(400).json({ error: "userId, variantId, quantity required" });
    }
    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if(!cart){
      cart = new Cart({ user: userId, cartItems: [] });
    }
    // Check if variant already in cart
    const existingItem = cart.cartItems.find(item => item.variant.toString() === variantId);
    if(existingItem){
      existingItem.quantity += quantity;
    } else {
      // fetch variant price
      const variant = await PrintVariant.findById(variantId);
      cart.cartItems.push({
        variant: variantId,
        quantity,
        price: variant ? variant.price : 0
      });
    }
    const saved = await cart.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in addItemToCart:", err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};
