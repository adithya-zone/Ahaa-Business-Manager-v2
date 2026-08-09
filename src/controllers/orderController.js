const service = require("../services/orderService");

const { success } = require("../utils/response");

function getOrders(req, res) {

    success(res, service.getOrders());

}

function createOrder(req, res) {

    const order = service.createOrder(req.body);

    success(res, order, "Order Created");

}

module.exports = {

    getOrders,

    createOrder

};