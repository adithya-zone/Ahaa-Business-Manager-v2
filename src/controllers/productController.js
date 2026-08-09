const service = require("../services/productService");

const { success, error } = require("../utils/response");

// ======================================
// Get Products
// ======================================

function getProducts(req, res) {

    success(

        res,

        service.getProducts()

    );

}

// ======================================
// Get Product
// ======================================

function getProduct(req, res) {

    const product = service.getProduct(

        req.params.id

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

        product

    );

}

// ======================================
// Create Product
// ======================================

function createProduct(req, res) {

    const product = service.createProduct(

        req.body

    );

    success(

        res,

        product,

        "Product Created"

    );

}

// ======================================
// Update Product
// ======================================

function updateProduct(req, res) {

    const product = service.updateProduct(

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

// ======================================
// Delete Product
// ======================================

function deleteProduct(req, res) {

    service.deleteProduct(

        req.params.id

    );

    success(

        res,

        {},

        "Product Deleted"

    );

}

module.exports = {

    getProducts,

    getProduct,

    createProduct,

    updateProduct,

    deleteProduct

};