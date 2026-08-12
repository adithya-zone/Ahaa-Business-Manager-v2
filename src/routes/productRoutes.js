const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/productController");

const {
    requireAuth
} = require("../middleware/authMiddleware");


// ==========================================
// Authentication
// ==========================================

router.use(requireAuth);


// ==========================================
// Product Routes
// ==========================================

router.get(
    "/",
    controller.getProducts
);

router.get(
    "/:id",
    controller.getProduct
);

router.post(
    "/",
    controller.createProduct
);

router.put(
    "/:id",
    controller.updateProduct
);

router.delete(
    "/:id",
    controller.deleteProduct
);


module.exports = router;