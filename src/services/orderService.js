const { read, write } = require("../utils/dataStore");
const { generateId } = require("../utils/idGenerator");

const {
    ordersFile,
    productsFile
} = require("../models/orderModel");

// =====================================
// Get Orders
// =====================================

function getOrders() {

    return read(ordersFile);

}

// =====================================
// Create Order
// =====================================

function createOrder(order) {

    const orders = read(ordersFile);

    order.id = generateId("ORD", orders.length);

    order.createdAt = new Date().toISOString();

    orders.push(order);

    write(ordersFile, orders);

    return order;

}

module.exports = {

    getOrders,

    createOrder

};