const Review = require("../models/reviewModel");

/**
 * Create review
 */
exports.createReview = async (req, res) => {
  try {
    const { userId, artPrintId, rating, reviewText } = req.body;
    const newReview = new Review({
      user: userId,
      artPrint: artPrintId,
      rating,
      reviewText
    });
    const saved = await newReview.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in createReview:", err);
    res.status(500).json({ error: "Failed to create review" });
  }
};

/**
 * Update review text
 */
exports.updateReview = async (req, res) => {
  try {
    const { reviewId, newReviewText } = req.body;
    const updated = await Review.findByIdAndUpdate(reviewId, { reviewText: newReviewText }, { new: true });
    if(!updated){
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error in updateReview:", err);
    res.status(500).json({ error: "Failed to update review" });
  }
};
