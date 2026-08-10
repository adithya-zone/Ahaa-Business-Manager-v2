const customerRepository = require("../repositories/customerRepository");
const { generateId } = require("../utils/idGenerator");

// ======================================
// Get Customers
// ======================================

async function getCustomers() {

    return await customerRepository.getAll();

}

// ======================================
// Get Customer By ID
// ======================================

async function getCustomer(id) {

    return await customerRepository.getById(id);

}

// ======================================
// Create Customer
// ======================================

async function createCustomer(customer) {

    const lastCustomer = await customerRepository.getLastCustomer();

    const lastNumber = lastCustomer
        ? Number(lastCustomer.id.split("-")[1])
        : 0;

    const newCustomer = {

        id: generateId("CUS", lastNumber),

        name: customer.name,

        phone: customer.phone,

        email: customer.email,

        city: customer.city,

        address: customer.address || "",

        status: customer.status || "Active",

        createdAt: new Date().toISOString()

    };

    await customerRepository.create(newCustomer);

    return newCustomer;

}

// ======================================
// Update Customer
// ======================================

async function updateCustomer(id, customer) {

    const existing = await customerRepository.getById(id);

    if (!existing) {

        throw new Error("Customer not found.");

    }

    const updated = {

        ...existing,

        ...customer

    };

    await customerRepository.update(id, updated);

    return updated;

}

// ======================================
// Delete Customer
// ======================================

async function deleteCustomer(id) {

    await customerRepository.delete(id);

    return true;

}

module.exports = {

    getCustomers,

    getCustomer,

    createCustomer,

    updateCustomer,

    deleteCustomer

};