const invoiceRepository = require("../repositories/invoiceRepository");

class InvoiceService {

    // ======================================
    // Get Invoice
    // ======================================

    async getInvoice(orderId) {

        const invoice = await invoiceRepository.getInvoice(orderId);

        if (!invoice) {

            throw new Error("Invoice not found.");

        }

        const settings = await invoiceRepository.getSettings();

        return {

            invoiceNo: invoice.id,

            date: new Date(invoice.createdAt).toLocaleDateString(),

            customer: invoice.customer,

            product: invoice.productName,

            quantity: invoice.quantity,

            price: invoice.price,

            total: invoice.total,

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