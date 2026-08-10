const service = require("../services/inventoryService");
const { success } = require("../utils/response");

// ======================================
// Get Inventory
// ======================================

function getInventory(req, res) {

    success(res, service.getInventory());

}

// ======================================
// Stock In
// ======================================

function stockIn(req, res) {

    try {

        const product = service.stockIn(

            req.params.id,

            req.body.quantity

        );

        success(res, product, "Stock Updated");

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

// ======================================
// Stock Out
// ======================================

function stockOut(req, res) {

    try {

        const product = service.stockOut(

            req.params.id,

            req.body.quantity

        );

        success(res, product, "Stock Updated");

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

// ======================================
// Inventory History
// ======================================

function getHistory(req, res) {

    success(

        res,

        service.getInventoryHistory()

    );

}

module.exports = {

    getInventory,

    stockIn,

    stockOut,

    getHistory

};