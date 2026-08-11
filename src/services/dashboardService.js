const productRepository = require("../repositories/productRepository");
const customerRepository = require("../repositories/customerRepository");
const orderRepository = require("../repositories/orderRepository");

async function getDashboardStats() {

    const products = await productRepository.getAll();

    const customers = await customerRepository.getAll();

    const orders = await orderRepository.getAll();

    let totalRevenue = 0;
    let todaySales = 0;
    let monthlySales = 0;

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = today.substring(0, 7); // YYYY-MM

    orders.forEach(order => {

        const total = Number(order.total || 0);

        totalRevenue += total;

        if (order.createdAt) {

            const orderDate = order.createdAt.substring(0, 10);

            const orderMonth = order.createdAt.substring(0, 7);

            if (orderDate === today) {

                todaySales += total;

            }

            if (orderMonth === currentMonth) {

                monthlySales += total;

            }

        }

    });

    return {

        totalProducts: products.length,

        totalCustomers: customers.length,

        totalOrders: orders.length,

        totalRevenue,

        todaySales,

        monthlySales

    };

}

module.exports = {

    getDashboardStats

};