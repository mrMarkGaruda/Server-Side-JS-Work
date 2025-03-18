const express = require("express");
const router = express.Router();

// Dummy endpoint for invoices
router.get("/", (req, res) => {
  res.json({ message: "Invoices endpoint" });
});

module.exports = router;
