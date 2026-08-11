const repository = require("../repositories/settingsRepository");

async function getSettings() {

    const rows = await repository.getAll();

    const settings = {};

    rows.forEach(row => {

        settings[row.key] = row.value;

    });

    return settings;

}

async function saveSettings(data) {

    for (const key in data) {

        await repository.save(

            key,

            data[key]

        );

    }

    return true;

}

module.exports = {

    getSettings,

    saveSettings

};