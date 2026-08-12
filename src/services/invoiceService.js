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

        // Get new multi-product items

        let items =
            await invoiceRepository.getInvoiceItems(
                orderId
            );

        /*
         * Backward compatibility:
         *
         * Existing orders were created before
         * order_items existed.
         *
         * If no order_items are found, create
         * one invoice item from the old order
         * columns.
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
                            legacyOrder.quantity,

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

        const settings =
            await invoiceRepository.getSettings();

        const subtotal =
            items.reduce(

                (sum, item) =>
                    sum + Number(item.total || 0),

                0

            );

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

                    quantity:
                        Number(item.quantity),

                    price:
                        Number(item.price || 0),

                    total:
                        Number(item.total || 0)

                })),

            subtotal,

            gst:
                0,

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