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
    // Get Product By ID
    // ======================================

    async getProduct(productId) {

        return await this.get(

            `SELECT *
             FROM products
             WHERE id = ?`,

            [productId]

        );

    }

    // ======================================
    // Create Order
    // ======================================

    async create(order) {

        await this.run(

            `INSERT INTO orders(

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

            VALUES(?,?,?,?,?,?,?,?,?)`,

            [

                order.id,
                order.customer,
                order.productId,
                order.productName,
                order.quantity,
                order.total,
                order.status,
                order.paymentMethod,
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
                order.paymentMethod,
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

            [

                id

            ]

        );

    }

    // ======================================
    // Update Product Stock
    // ======================================

    async updateStock(productId, stock) {

        await this.run(

            `UPDATE products

             SET stock=?

             WHERE id=?`,

            [

                stock,

                productId

            ]

        );

    }

}

module.exports = new OrderRepository();