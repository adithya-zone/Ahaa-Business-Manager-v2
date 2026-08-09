const { read, write } = require("../utils/dataStore");
const { generateId } = require("../utils/idGenerator");

const {
    ordersFile,
    productsFile
} = require("../models/orderModel");

// ======================================
// Get Orders
// ======================================

function getOrders() {

    return read(ordersFile);

}

// ======================================
// Create Order
// ======================================

function createOrder(order) {

    const orders = read(ordersFile);

    const products = read(productsFile);

    const product = products.find(
        p => p.id === order.productId
    );

    if (!product) {

        throw new Error("Product not found.");

    }

    if (product.stock < Number(order.quantity)) {

        throw new Error("Insufficient stock.");

    }

    product.stock -= Number(order.quantity);

    write(productsFile, products);

    const newOrder = {

        id: generateId("ORD", orders.length),

        customer: order.customer || "Walk-in Customer",

        productId: product.id,

        productName: product.name,

        quantity: Number(order.quantity),

        total: Number(order.total),

        status: order.status || "Pending",

        createdAt: new Date().toISOString()

    };

    orders.push(newOrder);

    write(ordersFile, orders);

    return newOrder;

}

// ======================================
// Update Order
// ======================================

function updateOrder(id, data) {

    const orders = read(ordersFile);

    const products = read(productsFile);

    const index = orders.findIndex(o => o.id === id);

    if (index === -1) {

        throw new Error("Order not found.");

    }

    const oldOrder = orders[index];

    // Restore old stock
    const oldProduct = products.find(
        p => p.id === oldOrder.productId
    );

    if (oldProduct) {

        oldProduct.stock += Number(oldOrder.quantity);

    }

    // Validate new product
    const newProduct = products.find(
        p => p.id === data.productId
    );

    if (!newProduct) {

        throw new Error("Product not found.");

    }

    if (newProduct.stock < Number(data.quantity)) {

        throw new Error("Insufficient stock.");

    }

    // Deduct new stock
    newProduct.stock -= Number(data.quantity);

    orders[index] = {

        ...oldOrder,

        customer: data.customer,

        productId: newProduct.id,

        productName: newProduct.name,

        quantity: Number(data.quantity),

        total: Number(data.total),

        status: data.status

    };

    write(productsFile, products);

    write(ordersFile, orders);

    return orders[index];

}

// ======================================
// Delete Order
// ======================================

function deleteOrder(id) {

    const orders = read(ordersFile);

    const products = read(productsFile);

    const index = orders.findIndex(
        o => o.id === id
    );

    if (index === -1) {

        throw new Error("Order not found.");

    }

    const order = orders[index];

    const product = products.find(
        p => p.id === order.productId
    );

    if (product) {

        product.stock += Number(order.quantity);

    }

    orders.splice(index, 1);

    write(productsFile, products);

    write(ordersFile, orders);

    return true;

}

module.exports = {

    getOrders,

    createOrder,

    updateOrder,

    deleteOrder

};