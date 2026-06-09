const fs = require('fs');
const util = require('util');

const colors = require('colors');
const mkdirp = require('mkdirp');

const open = util.promisify(fs.readdir);

function listDirectory(pathname) {
    return open(pathname);
}

function createDirectory(pathname) {
    const message = 'Create directory'
    console.log(
        `${colors.yellow('✔')} ${colors.bold(message)}: ${pathname}`
    )
    // `mkdirp` (v1+) already returns a Promise; wrapping it with
    // `util.promisify` passed a callback as `opts` → "invalid options argument".
    return mkdirp(pathname);
}

module.exports = {
    listDirectory,
    createDirectory
};
