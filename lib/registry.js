const fs = require('fs');
const config = require('../config');
const ui = require('./ui');

var commands = [];

const NETWORK = /ENOTFOUND|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket hang up|timeout|status code [45]\d\d|invalid json|Unexpected token|request to .* failed|certificate/i;
const BAD_DATA = /Cannot read propert(y|ies) of (undefined|null)/;
const API_CODE = /axios|fetch\(|fetchJson|getBuffer|node-fetch|mumaker|ytdl|aptoide|uploadFile|scraper|\.\.\/lib\/ai/i;

const usesApi = (filename) => {
    try {
        return API_CODE.test(fs.readFileSync(filename, 'utf8'));
    } catch (error) {
        return false;
    }
};

const guard = (info, func) => {
    const api = info.pattern && usesApi(info.filename);
    return async (...args) => {
        try {
            return await func(...args);
        } catch (error) {
            const network =
                error &&
                (error.working ||
                    error.isAxiosError ||
                    ['FetchError', 'AxiosError', 'TimeoutError'].includes(error.name) ||
                    NETWORK.test(String(error.message)) ||
                    (api && BAD_DATA.test(String(error.message))));
            const citel = args[1];
            if (!network || !citel || !citel.reply) throw error;
            console.log(`[${info.pattern}] ${error.message}`);
            return citel.reply(ui.text.working);
        }
    };
};

function cmd(info, func) {
    var data = info;
    data.function = info.pattern && info.filename ? guard(info, func) : func;
    if (!data.dontAddCommandList) data.dontAddCommandList = false;
    if (!info.desc) info.desc = '';
    if (!data.fromMe) data.fromMe = false;
    if (!info.category) data.category = 'misc';
    if(!info.filename) data.filename = "Not Provided";
    commands.push(data);
    return data;
}
module.exports = {
    cmd,
    AddCommand:cmd,
    Function:cmd,
    Module:cmd,
    xmd:cmd,
    commands,
};
