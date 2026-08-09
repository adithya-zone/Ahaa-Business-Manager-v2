const service = require("../services/dashboardService");

const { success } = require("../utils/response");

function getDashboard(req, res) {

    success(

        res,

        service.getDashboardStats()

    );

}

module.exports = {

    getDashboard

};