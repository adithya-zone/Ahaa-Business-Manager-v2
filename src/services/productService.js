const { read, write } = require("../utils/dataStore");
const { generateId } = require("../utils/idGenerator");
const { productFile } = require("../models/productModel");

// ======================================
// Get All Products
// ======================================

function getProducts() {

    return read(productFile);

}

// ======================================
// Get Product By ID
// ======================================

function getProduct(id) {

    const products = read(productFile);

    return products.find(p => p.id === id);

}

// ======================================
// Create Product
// ======================================

function createProduct(product) {

    const products = read(productFile);

    product.id = generateId("PRD", products.length);

    product.createdAt = new Date().toISOString();

    products.push(product);

    write(productFile, products);

    return product;

}

// ======================================
// Update Product
// ======================================

function updateProduct(id, data) {

    const products = read(productFile);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {

        return null;

    }

    products[index] = {

        ...products[index],

        ...data

    };

    write(productFile, products);

    return products[index];

}

// ======================================
// Delete Product
// ======================================

function deleteProduct(id) {

    const products = read(productFile);

    const updated = products.filter(p => p.id !== id);

    write(productFile, updated);

}

module.exports = {

    getProducts,

    getProduct,

    createProduct,

    updateProduct,

    deleteProduct

};