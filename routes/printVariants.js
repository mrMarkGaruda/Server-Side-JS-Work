const express = require("express");
const {
  createPrintVariant,
  getAllPrintVariants,
  calcTotalPrice
} = require("../controllers/printVariantController");

const router = express.Router();

router.get("/", getAllPrintVariants);
router.post("/", createPrintVariant);

// Demo: calculate total price for a single variant
router.get("/:id/price", calcTotalPrice);

module.exports = router;
