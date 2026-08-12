const invoiceRepository =
    require("../repositories/invoiceRepository");

class InvoiceService {

    // ======================================
    // Get Invoice
    // ======================================

    async getInvoice(orderId) {

        const invoice =
            await invoiceRepository.getInvoice(orderId);

        if (!invoice) {

            throw new Error(
                "Invoice not found."
            );

        }


        // ======================================
        // Get Invoice Items
        // ======================================

        let items =
            await invoiceRepository.getInvoiceItems(
                orderId
            );


        // ======================================
        // Backward Compatibility
        // ======================================

        /*
         * Existing old orders may not have
         * records inside order_items.
         *
         * Create one item from the old
         * orders table when necessary.
         */

        if (!items || items.length === 0) {

            const legacyOrder =
                await invoiceRepository.get(

                    `SELECT
                        o.productId,
                        o.productName,
                        o.quantity,
                        p.price,
                        o.total
                     FROM orders o
                     LEFT JOIN products p
                        ON o.productId = p.id
                     WHERE o.id = ?`,

                    [orderId]

                );

            if (legacyOrder) {

                items = [

                    {

                        productId:
                            legacyOrder.productId,

                        productName:
                            legacyOrder.productName,

                        quantity:
                            Number(
                                legacyOrder.quantity
                            ) || 1,

                        /*
                         * Old orders did not have
                         * weight information.
                         *
                         * Use 1 KG as the legacy
                         * default so old invoices
                         * continue working.
                         */

                        weightKg: 1,

                        price:
                            Number(
                                legacyOrder.price
                            ) || 0,

                        total:
                            Number(
                                legacyOrder.total
                            ) || 0

                    }

                ];

            }

        }


        if (!items || items.length === 0) {

            throw new Error(
                "No products found for this invoice."
            );

        }


        // ======================================
        // Company Settings
        // ======================================

        const settings =
            await invoiceRepository.getSettings();


        // ======================================
        // Calculate Subtotal
        // ======================================

        const subtotal =
            items.reduce(

                (sum, item) => {

                    return (
                        sum +
                        Number(item.total || 0)
                    );

                },

                0

            );


        // ======================================
        // Prepare Invoice
        // ======================================

        return {

            invoiceNo:
                invoice.id,

            date:
                new Date(
                    invoice.createdAt
                ).toLocaleDateString(),

            customer:
                invoice.customer,

            status:
                invoice.status,

            paymentMethod:
                invoice.paymentMethod,

            items:

                items.map(item => ({

                    productId:
                        item.productId,

                    product:
                        item.productName,

                    weightKg:
                        Number(
                            item.weightKg || 0
                        ),

                    quantity:
                        Number(
                            item.quantity || 0
                        ),

                    price:
                        Number(
                            item.price || 0
                        ),

                    total:
                        Number(
                            item.total || 0
                        )

                })),

            subtotal,

            gst: 0,

            grandTotal:
                subtotal,

            companyName:
                settings.companyName ||
                "AHAA BUSINESS MANAGER",

            companyAddress:
                settings.companyAddress ||
                "",

            companyPhone:
                settings.companyPhone ||
                "",

            companyEmail:
                settings.companyEmail ||
                ""

        };

    }

}

module.exports = new InvoiceService();