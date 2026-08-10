const BaseRepository = require("./baseRepository");

class OrderRepository extends BaseRepository {

    // ======================================
    // Get All Orders
    // ======================================

    async getAll() {

        return await this.all(
            `SELECT *
             FROM orders
             ORDER BY createdAt DESC`
        );

    }

    // ======================================
    // Get Order By ID
    // ======================================

    async getById(id) {

        return await this.get(
            `SELECT *
             FROM orders
             WHERE id = ?`,
            [id]
        );

    }

    // ======================================
    // Get Last Order
    // ======================================

    async getLastOrder() {

        return await this.get(
            `SELECT id
             FROM orders
             ORDER BY id DESC
             LIMIT 1`
        );

    }

    // ======================================
    // Create Order
    // ======================================

    async create(order) {

        await this.run(
            `INSERT INTO orders
            (
                id,
                customer,
                productId,
                productName,
                quantity,
                total,
                status,
                paymentMethod,
                createdAt
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                order.id,
                order.customer,
                order.productId,
                order.productName,
                order.quantity,
                order.total,
                order.status,
                order.paymentMethod || "Cash",
                order.createdAt
            ]
        );

        return order;

    }

    // ======================================
    // Update Order
    // ======================================

    async update(id, order) {

        await this.run(
            `UPDATE orders
             SET
                customer=?,
                productId=?,
                productName=?,
                quantity=?,
                total=?,
                status=?,
                paymentMethod=?
             WHERE id=?`,
            [
                order.customer,
                order.productId,
                order.productName,
                order.quantity,
                order.total,
                order.status,
                order.paymentMethod || "Cash",
                id
            ]
        );

    }

    // ======================================
    // Delete Order
    // ======================================

    async delete(id) {

        await this.run(
            `DELETE FROM orders
             WHERE id=?`,
            [id]
        );

    }

    // ======================================
    // Today's Sales
    // ======================================

    async getTodaySales() {

        return await this.get(
            `SELECT
                IFNULL(SUM(total),0) AS total
             FROM orders
             WHERE DATE(createdAt)=DATE('now','localtime')`
        );

    }

    // ======================================
    // Monthly Sales
    // ======================================

    async getMonthlySales() {

        return await this.get(
            `SELECT
                IFNULL(SUM(total),0) AS total
             FROM orders
             WHERE strftime('%Y-%m',createdAt)=strftime('%Y-%m','now','localtime')`
        );

    }

}

module.exports = new OrderRepository();