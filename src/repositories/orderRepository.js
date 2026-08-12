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
    // Create Order + Multiple Items
    // ======================================

    async createOrderWithItems(order, items) {

        // Save the main order

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

        // Save every product in order_items

for (const item of items) {

    await this.run(

        `INSERT INTO order_items(

            orderId,
            productId,
            productName,
            weightKg,
            quantity,
            price,
            total

        )

        VALUES(?,?,?,?,?,?,?)`,

        [

            order.id,
            item.productId,
            item.productName,
            item.weightKg,
            item.quantity,
            item.price,
            item.total

        ]

    );

}

        return order;

    }

    // ======================================
    // Get Order Items
    // ======================================

    async getOrderItems(orderId) {

        return await this.all(

            `SELECT
    id,
    orderId,
    productId,
    productName,
    weightKg,
    quantity,
    price,
    total
FROM order_items
             WHERE orderId = ?
             ORDER BY id ASC`,

            [orderId]

        );

    }

    // ======================================
    // Create Legacy Single Product Order
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

        // Delete order items first

        await this.run(

            `DELETE FROM order_items
             WHERE orderId = ?`,

            [id]

        );

        // Then delete the order

        await this.run(

            `DELETE FROM orders
             WHERE id = ?`,

            [id]

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