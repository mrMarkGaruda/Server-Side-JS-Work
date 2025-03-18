const express = require("express");
const router = express.Router();

// Dummy endpoint for products
router.get("/", (req, res) => {
  res.json({ message: "Products endpoint" });
});

module.exports = router;
