const reportService = require("../services/reportService");

// ======================================
// Get Reports
// ======================================

async function getReport(req, res) {

    try {

        const report = await reportService.getReport();

        res.json({

            success: true,

            message: "Success",

            data: report

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

module.exports = {

    getReport

};