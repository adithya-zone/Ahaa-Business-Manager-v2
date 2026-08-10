const BaseRepository = require("./baseRepository");

class CustomerRepository extends BaseRepository {

    // ======================================
    // Get All Customers
    // ======================================

    async getAll() {

        return await this.all(

            `SELECT *
             FROM customers
             ORDER BY createdAt DESC`

        );

    }

    // ======================================
    // Get Customer By ID
    // ======================================

    async getById(id) {

        return await this.get(

            `SELECT *
             FROM customers
             WHERE id = ?`,

            [id]

        );

    }

    // ======================================
    // Get Last Customer
    // ======================================

    async getLastCustomer() {

        return await this.get(

            `SELECT id
             FROM customers
             ORDER BY id DESC
             LIMIT 1`

        );

    }

    // ======================================
    // Search Customers
    // ======================================

    async search(keyword) {

        return await this.all(

            `SELECT *
             FROM customers
             WHERE
                name LIKE ?
                OR phone LIKE ?
                OR email LIKE ?
                OR city LIKE ?
             ORDER BY name ASC`,

            [

                `%${keyword}%`,
                `%${keyword}%`,
                `%${keyword}%`,
                `%${keyword}%`

            ]

        );

    }

    // ======================================
    // Create Customer
    // ======================================

    async create(customer) {

        await this.run(

            `INSERT INTO customers
            (
                id,
                name,
                phone,
                email,
                city,
                address,
                status,
                createdAt
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)`,

            [

                customer.id,
                customer.name,
                customer.phone,
                customer.email,
                customer.city,
                customer.address,
                customer.status,
                customer.createdAt

            ]

        );

        return customer;

    }

    // ======================================
    // Update Customer
    // ======================================

    async update(id, customer) {

        await this.run(

            `UPDATE customers

             SET

                name=?,
                phone=?,
                email=?,
                city=?,
                address=?,
                status=?

             WHERE id=?`,

            [

                customer.name,
                customer.phone,
                customer.email,
                customer.city,
                customer.address,
                customer.status,
                id

            ]

        );

    }

    // ======================================
    // Delete Customer
    // ======================================

    async delete(id) {

        await this.run(

            `DELETE FROM customers
             WHERE id=?`,

            [id]

        );

    }

}

module.exports = new CustomerRepository();