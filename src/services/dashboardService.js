const { read } = require("../utils/dataStore");

const {

    productsFile,

    ordersFile,

    customersFile

} = require("../models/dashboardModel");

function getDashboardStats() {

    const products = read(productsFile);

    const orders = read(ordersFile);

    const customers = read(customersFile);

    let revenue = 0;

    orders.forEach(order => {

        revenue += Number(order.total || 0);

    });

    return {

        totalProducts: products.length,

        totalOrders: orders.length,

        totalCustomers: customers.length,

        totalRevenue: revenue

    };

}

module.exports = {

    getDashboardStats

};