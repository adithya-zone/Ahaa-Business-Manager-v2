const BaseRepository = require("./baseRepository");

class InvoiceRepository extends BaseRepository {

    // ======================================
    // Get Invoice Order
    // ======================================

    async getInvoice(orderId) {

        return await this.get(

            `SELECT
                o.id,
                o.customer,
                o.status,
                o.paymentMethod,
                o.total,
                o.createdAt
             FROM orders o
             WHERE o.id = ?`,

            [orderId]

        );

    }


    // ======================================
    // Get Invoice Items
    // ======================================

    async getInvoiceItems(orderId) {

        return await this.all(

            `SELECT
                productId,
                productName,
                quantity,
                price,
                total,
                weightKg
             FROM order_items
             WHERE orderId = ?
             ORDER BY id ASC`,

            [orderId]

        );

    }


    // ======================================
    // Get Settings
    // ======================================

    async getSettings() {

        const rows = await this.all(

            `SELECT
                key,
                value
             FROM settings`

        );

        const settings = {};

        rows.forEach(row => {

            settings[row.key] = row.value;

        });

        return settings;

    }

}

module.exports = new InvoiceRepository();