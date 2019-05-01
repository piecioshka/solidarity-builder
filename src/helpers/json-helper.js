const fs = require('fs');
const util = require('util');

const save = util.promisify(fs.writeFile);

function printJSON(data) {
    console.log(
        JSON.stringify(data, null, 4)
    );
}

function loadJSON(file) {
    return JSON.parse(
        fs.readFileSync(file).toString()
    );
}

function saveJSON(file, content) {
    return save(file, JSON.stringify(content, null, 4));
}

module.exports = {
    printJSON,
    loadJSON,
    saveJSON
};
