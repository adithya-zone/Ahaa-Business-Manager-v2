const productRepository = require("../repositories/productRepository");
const { generateId } = require("../utils/idGenerator");

// ======================================
// Get All Products
// ======================================

async function getProducts() {

    return await productRepository.getAll();

}

// ======================================
// Get Product By ID
// ======================================

async function getProduct(id) {

    return await productRepository.getById(id);

}

// ======================================
// Create Product
// ======================================

async function createProduct(product) {

    const lastProduct = await productRepository.getLastProduct();

    const lastNumber = lastProduct
        ? Number(lastProduct.id.split("-")[1])
        : 0;

    product.id = generateId("PRD", lastNumber);

    product.createdAt = new Date().toISOString();

    product.status = product.status || "Active";

    await productRepository.create(product);

    return product;

}

// ======================================
// Update Product
// ======================================

async function updateProduct(id, data) {

    const product = await productRepository.getById(id);

    if (!product) {

        return null;

    }

    const updated = {

        ...product,

        ...data

    };

    await productRepository.update(id, updated);

    return updated;

}

// ======================================
// Delete Product
// ======================================

async function deleteProduct(id) {

    await productRepository.delete(id);

}

module.exports = {

    getProducts,

    getProduct,

    createProduct,

    updateProduct,

    deleteProduct

};