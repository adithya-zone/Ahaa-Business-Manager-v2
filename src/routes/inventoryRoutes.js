const express = require("express");

const router = express.Router();

const controller = require("../controllers/inventoryController");

// ======================================
// Inventory Routes
// ======================================

router.get("/", controller.getInventory);

router.get("/history", controller.getHistory);

router.post("/:id/stock-in", controller.stockIn);

router.post("/:id/stock-out", controller.stockOut);

module.exports = router;