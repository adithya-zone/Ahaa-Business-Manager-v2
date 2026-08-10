const { read } = require("../utils/dataStore");
const { ordersFile } = require("../models/orderModel");

// ======================================
// Get Invoice By Order ID
// ======================================

function getInvoice(orderId) {

    const orders = read(ordersFile);

    const order = orders.find(

        o => o.id === orderId

    );

    if (!order) {

        throw new Error("Order not found.");

    }

    return {

        invoiceNo: order.id.replace("ORD", "INV"),

        date: new Date(order.createdAt).toLocaleDateString(),

        customer: order.customer,

        product: order.productName,

        quantity: order.quantity,

        price: Number(order.total) / Number(order.quantity),

        total: order.total,

        status: order.status

    };

}

module.exports = {

    getInvoice

};