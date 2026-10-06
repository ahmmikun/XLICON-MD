const fs = require('fs-extra');
const path = require('path');
const os = require('os');
function getTempFilePath(ext) {
    return path.join(os.tmpdir(), `xlicon_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`);
}
function safeUnlink(file) {
    try {
        if (file && fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    } catch (e) {}
}
module.exports = {
    getTempFilePath,
    safeUnlink,
};
