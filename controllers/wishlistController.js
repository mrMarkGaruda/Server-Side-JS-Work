const Wishlist = require("../models/wishlistModel");

/**
 * Get user's wishlist
 */
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.query.userId;
    if(!userId) return res.status(400).json({ error: "userId required" });

    const wishlist = await Wishlist.findOne({ user: userId }).populate("items");
    res.json(wishlist || { items: [] });
  } catch (err) {
    console.error("Error in getWishlist:", err);
    res.status(500).json({ error: "Failed to get wishlist" });
  }
};

/**
 * Add item to wishlist
 */
exports.addItemToWishlist = async (req, res) => {
  try {
    const { userId, variantId } = req.body;
    if(!userId || !variantId){
      return res.status(400).json({ error: "userId and variantId required" });
    }
    let wishlist = await Wishlist.findOne({ user: userId });
    if(!wishlist){
      wishlist = new Wishlist({ user: userId, items: [] });
    }
    // check if item is already in wishlist
    if(!wishlist.items.includes(variantId)){
      wishlist.items.push(variantId);
    }
    const saved = await wishlist.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in addItemToWishlist:", err);
    res.status(500).json({ error: "Failed to add item to wishlist" });
  }
};
