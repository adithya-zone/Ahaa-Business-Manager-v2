const { read, write } = require("../utils/dataStore");
const { generateId } = require("../utils/idGenerator");
const { productsFile } = require("../models/productModel");

// ======================================
// Get All Products
// ======================================

function getProducts() {

    return read(productsFile);

}

// ======================================
// Get Product By ID
// ======================================

function getProduct(id) {

    const products = read(productsFile);

    return products.find(p => p.id === id);

}

// ======================================
// Create Product
// ======================================

function createProduct(product) {

    const products = read(productsFile);

    product.id = generateId("PRD", products.length);

    product.createdAt = new Date().toISOString();

    products.push(product);

    write(productsFile, products);

    return product;

}

// ======================================
// Update Product
// ======================================

function updateProduct(id, data) {

    const products = read(productsFile);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {

        return null;

    }

    products[index] = {

        ...products[index],

        ...data

    };

    write(productsFile, products);

    return products[index];

}

// ======================================
// Delete Product
// ======================================

function deleteProduct(id) {

    const products = read(productsFile);

    const updated = products.filter(

        p => p.id !== id

    );

    write(productsFile, updated);

}

module.exports = {

    getProducts,

    getProduct,

    createProduct,

    updateProduct,

    deleteProduct

};