const express = require("express");

const router = express.Router();

const service = require("../services/invoiceService");

// ======================================
// Get Invoice
// ======================================

router.get("/:id", (req, res) => {

    try {

        const invoice = service.getInvoice(

            req.params.id

        );

        res.json({

            success: true,

            data: invoice

        });

    }

    catch (err) {

        res.status(404).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;