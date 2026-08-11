const BaseRepository = require("./baseRepository");

class SettingsRepository extends BaseRepository {

    async getAll() {

        return await this.all(

            `SELECT * FROM settings`

        );

    }

    async get(key) {

        return await this.get(

            `SELECT value
             FROM settings
             WHERE key=?`,

            [key]

        );

    }

    async save(key, value) {

        await this.run(

            `INSERT INTO settings(key,value)

             VALUES(?,?)

             ON CONFLICT(key)

             DO UPDATE SET

             value=excluded.value`,

            [

                key,

                value

            ]

        );

    }

}

module.exports = new SettingsRepository();