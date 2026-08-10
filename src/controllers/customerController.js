const service = require("../services/customerService");
const { success, error } = require("../utils/response");

// ======================================
// Get Customers
// ======================================

async function getCustomers(req, res) {

    try {

        const customers = await service.getCustomers();

        success(res, customers);

    }

    catch (err) {

        error(res, err.message, 500);

    }

}

// ======================================
// Get Customer By ID
// ======================================

async function getCustomer(req, res) {

    try {

        const customer = await service.getCustomer(req.params.id);

        if (!customer) {

            return error(

                res,

                "Customer not found",

                404

            );

        }

        success(res, customer);

    }

    catch (err) {

        error(res, err.message, 500);

    }

}

// ======================================
// Create Customer
// ======================================

async function createCustomer(req, res) {

    try {

        const customer = await service.createCustomer(req.body);

        success(

            res,

            customer,

            "Customer Created"

        );

    }

    catch (err) {

        error(res, err.message, 400);

    }

}

// ======================================
// Update Customer
// ======================================

async function updateCustomer(req, res) {

    try {

        const customer = await service.updateCustomer(

            req.params.id,

            req.body

        );

        success(

            res,

            customer,

            "Customer Updated"

        );

    }

    catch (err) {

        error(res, err.message, 400);

    }

}

// ======================================
// Delete Customer
// ======================================

async function deleteCustomer(req, res) {

    try {

        await service.deleteCustomer(req.params.id);

        success(

            res,

            {},

            "Customer Deleted"

        );

    }

    catch (err) {

        error(res, err.message, 400);

    }

}

module.exports = {

    getCustomers,

    getCustomer,

    createCustomer,

    updateCustomer,

    deleteCustomer

};