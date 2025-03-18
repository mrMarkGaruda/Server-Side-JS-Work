const express = require("express");
const {
  placeOrder,
  getUserOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", placeOrder);              // create order
router.get("/", getUserOrders);           // get user's orders (query param)
router.put("/status", updateOrderStatus); // update status

module.exports = router;
