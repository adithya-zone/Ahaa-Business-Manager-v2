const reportRepository = require("../repositories/reportRepository");

class ReportService {

    // ======================================
    // Get Report Data
    // ======================================

    async getReport() {

        const summary = await reportRepository.getSummary();

        const sales = await reportRepository.getSalesReport();

        return {

            summary,

            sales

        };

    }

}

module.exports = new ReportService();