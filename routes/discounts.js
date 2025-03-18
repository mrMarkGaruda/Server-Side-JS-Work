const express = require("express");
const { createDiscount, applyDiscount } = require("../controllers/discountController");

const router = express.Router();

router.post("/", createDiscount);
router.post("/apply", applyDiscount);

module.exports = router;
