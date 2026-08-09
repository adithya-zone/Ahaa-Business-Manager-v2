const service = require("../services/customerService");
const { success } = require("../utils/response");

// ======================================
// Get Customers
// ======================================

function getCustomers(req, res) {

    success(res, service.getCustomers());

}

// ======================================
// Create Customer
// ======================================

function createCustomer(req, res) {

    try {

        const customer = service.createCustomer(req.body);

        success(res, customer, "Customer Created");

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

// ======================================
// Update Customer
// ======================================

function updateCustomer(req, res) {

    try {

        const customer = service.updateCustomer(

            req.params.id,

            req.body

        );

        success(res, customer, "Customer Updated");

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

// ======================================
// Delete Customer
// ======================================

function deleteCustomer(req, res) {

    try {

        service.deleteCustomer(req.params.id);

        success(res, null, "Customer Deleted");

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

}

module.exports = {

    getCustomers,

    createCustomer,

    updateCustomer,

    deleteCustomer

};