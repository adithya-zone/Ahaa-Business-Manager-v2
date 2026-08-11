const BaseRepository = require("./baseRepository");

class InvoiceRepository extends BaseRepository {

    // ======================================
    // Get Invoice By Order ID
    // ======================================

    async getInvoice(orderId) {

        return await this.get(

            `SELECT

                o.id,

                o.customer,

                o.productId,

                o.productName,

                o.quantity,

                o.total,

                o.status,

                o.createdAt,

                p.price

            FROM orders o

            LEFT JOIN products p

                ON o.productId = p.id

            WHERE o.id = ?`,

            [orderId]

        );

    }

    // ======================================
    // Get All Settings
    // ======================================

    async getSettings() {

        const rows = await this.all(

            `SELECT key,value
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