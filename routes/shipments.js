const express = require("express");
const {
  shipOrder,
  updateShipmentStatus
} = require("../controllers/shipmentController");

const router = express.Router();

router.post("/", shipOrder);
router.put("/", updateShipmentStatus);

module.exports = router;
