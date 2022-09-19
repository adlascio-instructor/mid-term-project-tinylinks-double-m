const { dirname } = require('path');

function getFilePath(subpath) {
    const appDir = dirname(require.main.filename);
    return `${appDir}${subpath}`;
}

module.exports = {
    getFilePath,
}