const { read, write } = require("../utils/dataStore");
const { generateId } = require("../utils/idGenerator");

const { customersFile } = require("../models/customerModel");

// ======================================
// Get Customers
// ======================================

function getCustomers() {

    return read(customersFile);

}

// ======================================
// Create Customer
// ======================================

function createCustomer(customer) {

    const customers = read(customersFile);

    const newCustomer = {

        id: generateId("CUS", customers.length),

        name: customer.name,

        phone: customer.phone,

        email: customer.email,

        city: customer.city,

        address: customer.address || "",

        status: customer.status || "Active",

        createdAt: new Date().toISOString()

    };

    customers.push(newCustomer);

    write(customersFile, customers);

    return newCustomer;

}

// ======================================
// Update Customer
// ======================================

function updateCustomer(id, customer) {

    const customers = read(customersFile);

    const index = customers.findIndex(c => c.id === id);

    if (index === -1) {

        throw new Error("Customer not found.");

    }

    customers[index] = {

        ...customers[index],

        ...customer

    };

    write(customersFile, customers);

    return customers[index];

}

// ======================================
// Delete Customer
// ======================================

function deleteCustomer(id) {

    const customers = read(customersFile);

    const index = customers.findIndex(c => c.id === id);

    if (index === -1) {

        throw new Error("Customer not found.");

    }

    customers.splice(index, 1);

    write(customersFile, customers);

    return true;

}

module.exports = {

    getCustomers,

    createCustomer,

    updateCustomer,

    deleteCustomer

};