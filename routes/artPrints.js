const express = require("express");
const {
  createArtPrint,
  getAllArtPrints,
  getOneArtPrint,
  updateArtPrint,
  deleteArtPrint
} = require("../controllers/artPrintController");

const router = express.Router();

router.get("/", getAllArtPrints);
router.post("/", createArtPrint);
router.get("/:id", getOneArtPrint);
router.put("/:id", updateArtPrint);
router.delete("/:id", deleteArtPrint);

module.exports = router;
