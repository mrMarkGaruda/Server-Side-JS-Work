const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected routes (require authentication)
router.post(
  "/create", 
  auth, 
  upload.single("image"), 
  sharpMiddleware("webp", 80), 
  productController.createProduct
);

router.put(
  "/:id", 
  auth, 
  upload.single("image"), 
  sharpMiddleware("webp", 80), 
  productController.updateProduct
);

router.delete("/:id", auth, productController.deleteProduct);
router.get("/creator/me", auth, productController.getProductsByCreator);
router.put("/:id/stock", auth, productController.updateProductStock);

module.exports = router;