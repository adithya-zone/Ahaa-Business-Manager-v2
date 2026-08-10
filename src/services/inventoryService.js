const { read, write } = require("../utils/dataStore");

const {
    inventoryFile
} = require("../models/inventoryModel");

const {
    productsFile
} = require("../models/productModel");

// ======================================
// Get Inventory
// ======================================

function getInventory() {

    const products = read(productsFile);

    return products.map(product => ({

        id: product.id,

        name: product.name,

        category: product.category,

        stock: Number(product.stock),

        price: Number(product.price),

        value: Number(product.stock) * Number(product.price),

        lowStock: Number(product.stock) <= 10

    }));

}

// ======================================
// Stock In
// ======================================

function stockIn(productId, quantity) {

    const products = read(productsFile);

    const history = read(inventoryFile);

    const product = products.find(

        p => p.id === productId

    );

    if (!product) {

        throw new Error("Product not found.");

    }

    quantity = Number(quantity);

    product.stock += quantity;

    write(productsFile, products);

    history.push({

        id: Date.now(),

        productId,

        productName: product.name,

        type: "Stock In",

        quantity,

        balance: product.stock,

        createdAt: new Date().toISOString()

    });

    write(inventoryFile, history);

    return product;

}

// ======================================
// Stock Out
// ======================================

function stockOut(productId, quantity) {

    const products = read(productsFile);

    const history = read(inventoryFile);

    const product = products.find(

        p => p.id === productId

    );

    if (!product) {

        throw new Error("Product not found.");

    }

    quantity = Number(quantity);

    if (product.stock < quantity) {

        throw new Error("Insufficient stock.");

    }

    product.stock -= quantity;

    write(productsFile, products);

    history.push({

        id: Date.now(),

        productId,

        productName: product.name,

        type: "Stock Out",

        quantity,

        balance: product.stock,

        createdAt: new Date().toISOString()

    });

    write(inventoryFile, history);

    return product;

}

// ======================================
// Inventory History
// ======================================

function getInventoryHistory() {

    return read(inventoryFile);

}

module.exports = {

    getInventory,

    stockIn,

    stockOut,

    getInventoryHistory

};