const express = require("express");
const { createReview, updateReview } = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);
router.put("/", updateReview);

module.exports = router;
