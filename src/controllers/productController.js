const service = require("../services/productService");
const { success, error } = require("../utils/response");

// ======================================
// Get Products
// ======================================

async function getProducts(req, res) {

    try {

        const products = await service.getProducts();

        success(res, products);

    }

    catch (err) {

        error(res, err.message, 500);

    }

}

// ======================================
// Get Product
// ======================================

async function getProduct(req, res) {

    try {

        const product = await service.getProduct(req.params.id);

        if (!product) {

            return error(
                res,
                "Product not found",
                404
            );

        }

        success(res, product);

    }

    catch (err) {

        error(res, err.message, 500);

    }

}

// ======================================
// Create Product
// ======================================

async function createProduct(req, res) {

    try {

        const product = await service.createProduct(req.body);

        success(
            res,
            product,
            "Product Created"
        );

    }

    catch (err) {

        error(res, err.message, 500);

    }

}

// ======================================
// Update Product
// ======================================

async function updateProduct(req, res) {

    try {

        const product = await service.updateProduct(

            req.params.id,

            req.body

        );

        if (!product) {

            return error(
                res,
                "Product not found",
                404
            );

        }

        success(
            res,
            product,
            "Product Updated"
        );

    }

    catch (err) {

        error(res, err.message, 500);

    }

}

// ======================================
// Delete Product
// ======================================

async function deleteProduct(req, res) {

    try {

        await service.deleteProduct(req.params.id);

        success(
            res,
            {},
            "Product Deleted"
        );

    }

    catch (err) {

        error(res, err.message, 500);

    }

}

module.exports = {

    getProducts,

    getProduct,

    createProduct,

    updateProduct,

    deleteProduct

};