function generateId(prefix, count) {

    return `${prefix}-${String(count + 1).padStart(6, "0")}`;

}

module.exports = {

    generateId

};