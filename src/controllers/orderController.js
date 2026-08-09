const service = require("../services/orderService");
const { success } = require("../utils/response");

// ======================================
// Get Orders
// ======================================

function getOrders(req, res) {

    success(res, service.getOrders());

}

// ======================================
// Create Order
// ======================================

function createOrder(req, res) {

    try {

        const order = service.createOrder(req.body);

        success(res, order, "Order Created");

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

// ======================================
// Update Order
// ======================================

function updateOrder(req, res) {

    try {

        const order = service.updateOrder(

            req.params.id,

            req.body

        );

        success(res, order, "Order Updated");

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

// ======================================
// Delete Order
// ======================================

function deleteOrder(req, res) {

    try {

        service.deleteOrder(req.params.id);

        success(res, null, "Order Deleted");

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

module.exports = {

    getOrders,

    createOrder,

    updateOrder,

    deleteOrder

};