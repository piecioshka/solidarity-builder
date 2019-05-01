const fs = require('fs');
const util = require('util');

const colors = require('colors');
const mkdirp = require('mkdirp');

const open = util.promisify(fs.readdir);
const mkdir = util.promisify(mkdirp);

function listDirectory(pathname) {
    return open(pathname);
}

function createDirectory(pathname) {
    const message = 'Create directory'
    console.log(
        `${colors.yellow('✔')} ${colors.bold(message)}: ${pathname}`
    )
    return mkdir(pathname);
}

module.exports = {
    listDirectory,
    createDirectory
};
