const Product = require("../models/productModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Create new product
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    // Add createdBy from auth middleware
    const createdBy = req.userId;
    
    // Handle image if uploaded
    let imageUrl = null;
    if (req.file && req.file.processedPath) {
      imageUrl = `/uploads/${path.basename(req.file.processedPath)}`;
    }
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      createdBy
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

/**
 * Get all products
 */
exports.getAllProducts = async (req, res) => {
  try {
    // Process query parameters for filtering
    const { category, minPrice, maxPrice, sortBy } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Build sort object
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "price_asc":
          sort = { price: 1 };
          break;
        case "price_desc":
          sort = { price: -1 };
          break;
        case "newest":
          sort = { createdAt: -1 };
          break;
        case "oldest":
          sort = { createdAt: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 }; // Default sort by newest
    }
    
    const products = await Product.find(filter)
      .sort(sort)
      .populate("createdBy", "firstName lastName");
      
    res.json(products);
  } catch (err) {
    console.error("Error getting products:", err);
    res.status(500).json({ error: "Failed to get products" });
  }
};

/**
 * Get product by ID
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id)
      .populate("createdBy", "firstName lastName");
      
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(product);
  } catch (err) {
    console.error("Error getting product:", err);
    res.status(500).json({ error: "Failed to get product" });
  }
};

/**
 * Update product
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    
    // Find the product first
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Check if user owns this product or is admin
    if (product.createdBy.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: "Not authorized to update this product" });
    }
    
    // Handle image if uploaded
    let imageUrl = product.imageUrl;
    if (req.file && req.file.processedPath) {
      // Delete old image if exists
      if (product.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', product.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/${path.basename(req.file.processedPath)}`;
    }
    
    // Update product
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.imageUrl = imageUrl;
    product.updatedAt = new Date();
    
    const updatedProduct = await product.save();
    
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * Delete product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the product first
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Check if user owns this product or is admin
    if (product.createdBy.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: "Not authorized to delete this product" });
    }
    
    // Delete image if exists
    if (product.imageUrl) {
      const imagePath = path.join(__dirname, '..', product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete the product
    await Product.findByIdAndDelete(id);
    
    res.json({ message: "Product deleted successfully", id });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

/**
 * Get products by creator
 */
exports.getProductsByCreator = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    
    const products = await Product.find({ createdBy: userId });
    
    res.json(products);
  } catch (err) {
    console.error("Error getting products:", err);
    res.status(500).json({ error: "Failed to get products" });
  }
};

/**
 * Update product stock
 */
exports.updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (stock === undefined) {
      return res.status(400).json({ error: "Stock value is required" });
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Check if user is authorized
    if (product.createdBy.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: "Not authorized to update this product" });
    }
    
    product.stock = stock;
    product.updatedAt = new Date();
    
    const updatedProduct = await product.save();
    
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product stock:", err);
    res.status(500).json({ error: "Failed to update product stock" });
  }
};