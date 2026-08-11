const orderService = require("../services/orderService");

// ======================================
// Get Orders
// ======================================

async function getOrders(req, res) {

    try {

        const orders = await orderService.getOrders();

        res.json({

            success: true,

            message: "Success",

            data: orders

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

// ======================================
// Create Order
// ======================================

async function createOrder(req, res) {

    try {

        const order = await orderService.createOrder(req.body);

        res.json({

            success: true,

            message: "Order created successfully.",

            data: order

        });

    } catch (err) {

        console.error(err);

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

// ======================================
// Update Order
// ======================================

async function updateOrder(req, res) {

    try {

        const order = await orderService.updateOrder(

            req.params.id,

            req.body

        );

        res.json({

            success: true,

            message: "Order updated successfully.",

            data: order

        });

    } catch (err) {

        console.error(err);

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

// ======================================
// Delete Order
// ======================================

async function deleteOrder(req, res) {

    try {

        await orderService.deleteOrder(req.params.id);

        res.json({

            success: true,

            message: "Order deleted successfully."

        });

    } catch (err) {

        console.error(err);

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