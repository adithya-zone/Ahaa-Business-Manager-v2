const { getDatabase } = require("../config/database");

class BaseRepository {

    // ======================================
    // Get Database
    // ======================================

    async db() {

        return await getDatabase();

    }

    // ======================================
    // Select Multiple Rows
    // ======================================

    async all(sql, params = []) {

        const database = await this.db();

        return database.all(sql, params);

    }

    // ======================================
    // Select Single Row
    // ======================================

    async get(sql, params = []) {

        const database = await this.db();

        return database.get(sql, params);

    }

    // ======================================
    // Insert / Update / Delete
    // ======================================

    async run(sql, params = []) {

        const database = await this.db();

        return database.run(sql, params);

    }

}

module.exports = BaseRepository;