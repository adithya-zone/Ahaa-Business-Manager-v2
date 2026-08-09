const express = require("express");

const router = express.Router();

const controller = require("../controllers/orderController");

// ======================================
// Routes
// ======================================

// Get all orders
router.get("/", controller.getOrders);

// Create new order
router.post("/", controller.createOrder);

// Update order
router.put("/:id", controller.updateOrder);

// Delete order
router.delete("/:id", controller.deleteOrder);

module.exports = router;