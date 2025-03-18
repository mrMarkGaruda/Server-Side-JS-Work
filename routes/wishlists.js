const express = require("express");
const { getWishlist, addItemToWishlist } = require("../controllers/wishlistController");

const router = express.Router();

router.get("/", getWishlist); // e.g. /api/wishlists?userId=xxx
router.post("/", addItemToWishlist);

module.exports = router;
