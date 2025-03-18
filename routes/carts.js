const express = require("express");
const { getCart, addItemToCart } = require("../controllers/cartController");

const router = express.Router();

router.get("/", getCart); // e.g. /api/carts?userId=xxx
router.post("/", addItemToCart);

module.exports = router;
