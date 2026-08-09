const path = require("path");

module.exports = {

    productsFile: path.join(__dirname, "..", "..", "data", "products.json"),

    ordersFile: path.join(__dirname, "..", "..", "data", "orders.json"),

    customersFile: path.join(__dirname, "..", "..", "data", "customers.json")

};