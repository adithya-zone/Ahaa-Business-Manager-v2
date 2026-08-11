const BaseRepository = require("./baseRepository");

class ReportRepository extends BaseRepository {

    // ======================================
    // Dashboard Summary
    // ======================================

    async getSummary() {

        const totalOrders = await this.get(

            `SELECT COUNT(*) AS totalOrders
             FROM orders`

        );

        const totalRevenue = await this.get(

            `SELECT IFNULL(SUM(total),0) AS totalRevenue
             FROM orders`

        );

        const todaySales = await this.get(

            `SELECT IFNULL(SUM(total),0) AS todaySales
             FROM orders
             WHERE DATE(createdAt)=DATE('now','localtime')`

        );

        const monthlySales = await this.get(

            `SELECT IFNULL(SUM(total),0) AS monthlySales
             FROM orders
             WHERE strftime('%Y-%m',createdAt)=strftime('%Y-%m','now','localtime')`

        );

        return {

            totalOrders: totalOrders.totalOrders,

            totalRevenue: totalRevenue.totalRevenue,

            todaySales: todaySales.todaySales,

            monthlySales: monthlySales.monthlySales

        };

    }

    // ======================================
    // Sales Report
    // ======================================

    async getSalesReport() {

        return await this.all(

            `SELECT

                id,

                customer,

                productName,

                quantity,

                total,

                status,

                createdAt

            FROM orders

            ORDER BY createdAt DESC`

        );

    }

}

module.exports = new ReportRepository();