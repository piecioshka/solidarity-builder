const fs = require('fs');
const util = require('util');

const mkdirp = require('mkdirp');

const open = util.promisify(fs.readdir);
const mkdir = util.promisify(mkdirp);

function listDirectory(pathname) {
    return open(pathname);
}

function createDirectory(pathname) {
    return mkdir(pathname);
}

module.exports = {
    listDirectory,
    createDirectory
};
