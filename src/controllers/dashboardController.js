const service = require("../services/dashboardService");

const { success, error } = require("../utils/response");

// ==========================================
// Dashboard
// ==========================================

async function getDashboard(req, res) {

    try {

        const stats = await service.getDashboardStats();

        success(res, stats);

    }

    catch (err) {

        console.error(err);

        error(res, err.message, 500);

    }

}

module.exports = {

    getDashboard

};