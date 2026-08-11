const invoiceService = require("../services/invoiceService");

// ======================================
// Get Invoice
// ======================================

async function getInvoice(req, res) {

    try {

        const invoice = await invoiceService.getInvoice(

            req.params.id

        );

        res.json({

            success: true,

            message: "Success",

            data: invoice

        });

    }

    catch (err) {

        res.status(404).json({

            success: false,

            message: err.message

        });

    }

}

module.exports = {

    getInvoice

};