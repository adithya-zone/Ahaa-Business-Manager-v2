const express = require("express");

const router = express.Router();

const controller = require("../controllers/productController");

// ==========================================
// Product Routes
// ==========================================

// Get all products
router.get("/", controller.getProducts);

// Get single product
router.get("/:id", controller.getProduct);

// Create product
router.post("/", controller.createProduct);

// Update product
router.put("/:id", controller.updateProduct);

// Delete product
router.delete("/:id", controller.deleteProduct);

module.exports = router;