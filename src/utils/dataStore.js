const fs = require("fs");

function read(filePath) {

    if (!fs.existsSync(filePath)) {

        fs.writeFileSync(filePath, "[]");

    }

    return JSON.parse(

        fs.readFileSync(filePath, "utf8")

    );

}

function write(filePath, data) {

    fs.writeFileSync(

        filePath,

        JSON.stringify(data, null, 2)

    );

}

module.exports = {

    read,

    write

};